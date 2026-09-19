// Turning Google's idea of a subscription into ours.
//
// Lives in _shared because two functions need it and they must agree:
// verify-purchase (the bowler just paid, tell them straight away) and
// play-rtdn (Google says something changed). Underscore-prefixed folders
// are excluded from deployment and bundled into whichever function
// imports them, which is Supabase's documented convention for exactly
// this.
//
// NO IMPORTS, deliberately -- the same reason nightcap/render.ts has
// none. It lets vitest load this straight out of supabase/ without any
// of the Deno runtime coming with it, so every state below is tested in
// CI. See src/domain/playBilling.test.js.
//
// ── The shape of the system ─────────────────────────────────────────
//
//   the app         buys through @capgo/native-purchases, gets a token
//   verify-purchase takes that token, asks Google what it really is,
//                   writes entitlements under service_role
//   play-rtdn       Google says something changed; we ask Google again
//                   and rewrite the row
//
// THE CLIENT NEVER SAYS WHAT SOMEBODY BOUGHT. It hands over a token and
// the server asks Google. A client that can assert "I am plus" is a
// client that will, because the anon key ships in the app.
//
// RTDN carries a notification TYPE, and it is deliberately not mapped
// here. The type tells you something happened; it does not tell you what
// is true now, and acting on the type alone means a replayed
// notification can downgrade a bowler who has since re-subscribed. Both
// entry points do the same thing -- fetch the purchase, map the state
// below, write the result -- so order of arrival stops mattering.

// ── Placeholders ────────────────────────────────────────────────────
//
// ⚠️ EVERY ID BELOW IS A PLACEHOLDER. ⚠️
//
// There is no Play Console yet, so none of these exist. They are written
// to be obviously wrong rather than plausibly right, on the same
// principle as the appId in capacitor.config.ts: a placeholder you could
// mistake for real is one that ships.
//
// When the Play Console exists these must match it exactly. A base plan
// id that is one character off does not throw -- it falls through to
// null and the bowler silently gets no billing period.
export const PLAY_PRODUCT_ID = "PLACEHOLDER_product_plus";
export const PLAY_BASE_PLAN_MONTHLY = "PLACEHOLDER-monthly";
export const PLAY_BASE_PLAN_YEARLY = "PLACEHOLDER-yearly";

// The 30-day free trial, configured in Play as an offer on the monthly
// base plan. Play reports a trial as an ACTIVE subscription, so the
// offer id is the only thing separating "trialing" from "paying".
export const PLAY_TRIAL_OFFER_ID = "PLACEHOLDER-freetrial30";

export const BASE_PLAN_PERIODS: Readonly<Record<string, "month" | "year">> = Object.freeze({
  [PLAY_BASE_PLAN_MONTHLY]: "month",
  [PLAY_BASE_PLAN_YEARLY]: "year",
});

export type Status =
  | "none" | "trialing" | "active" | "grace"
  | "on_hold" | "paused" | "canceled" | "expired";

export interface OfferDetails {
  basePlanId?: string;
  offerId?: string;
}

export interface LineItem {
  productId?: string;
  expiryTime?: string;
  offerDetails?: OfferDetails;
}

export interface SubscriptionPurchaseV2 {
  subscriptionState?: string;
  purchaseToken?: string;
  linkedPurchaseToken?: string;
  lineItems?: LineItem[];
}

export interface EntitlementRow {
  plan: "free" | "plus";
  source: "play";
  status: Status;
  billing_period: "month" | "year" | null;
  current_period_end: string | null;
  trial_end: string | null;
  play_purchase_token: string | null;
}

// ── Google's states, and ours ───────────────────────────────────────
//
// Verified against the Google Play Developer API v3 reference for
// purchases.subscriptionsv2 (SubscriptionState). All nine are listed,
// because an unlisted one falling through to a default is how a paying
// bowler ends up locked out by a state nobody thought about.
//
// Two of these are judgement calls rather than translations:
//
//   CANCELED  they turned off auto-renew but have NOT lapsed. They keep
//             access until expiryTime, which is_subscriber() enforces.
//             Writing them off at cancellation takes away time they have
//             already paid for.
//   PENDING   a purchase that has not completed -- cash at a kiosk, a
//             card awaiting approval. No money has arrived, so no
//             access. It becomes ACTIVE on its own if it completes.
export const PLAY_STATE_TO_STATUS: Readonly<Record<string, Status>> = Object.freeze({
  SUBSCRIPTION_STATE_ACTIVE: "active",
  SUBSCRIPTION_STATE_IN_GRACE_PERIOD: "grace",
  SUBSCRIPTION_STATE_ON_HOLD: "on_hold",
  SUBSCRIPTION_STATE_PAUSED: "paused",
  SUBSCRIPTION_STATE_CANCELED: "canceled",
  SUBSCRIPTION_STATE_EXPIRED: "expired",
  SUBSCRIPTION_STATE_PENDING: "none",
  SUBSCRIPTION_STATE_PENDING_PURCHASE_CANCELED: "none",
  SUBSCRIPTION_STATE_UNSPECIFIED: "none",
});

// An unrecognised state is "none", not a crash and not access. Google
// can add a state faster than we can ship, and the safe direction for
// one we have never seen is the one that hands out nothing.
//
// hasOwnProperty rather than a bare lookup: "constructor" and "toString"
// resolve to functions off Object's prototype otherwise. Same bug class
// as the one fixed in nightcap/render.ts.
export function playStateToStatus(state: unknown): Status {
  if (typeof state !== "string") return "none";
  return Object.prototype.hasOwnProperty.call(PLAY_STATE_TO_STATUS, state)
    ? PLAY_STATE_TO_STATUS[state]
    : "none";
}

export function billingPeriodFor(basePlanId: unknown): "month" | "year" | null {
  if (typeof basePlanId !== "string") return null;
  return Object.prototype.hasOwnProperty.call(BASE_PLAN_PERIODS, basePlanId)
    ? BASE_PLAN_PERIODS[basePlanId]
    : null;
}

// ── Reading a purchase ──────────────────────────────────────────────

function lineItems(p: SubscriptionPurchaseV2 | null | undefined): LineItem[] {
  return p && Array.isArray(p.lineItems) ? p.lineItems.filter(Boolean) : [];
}

// There is no "current period end" field on SubscriptionPurchaseV2 --
// confirmed against the API reference. lineItems[].expiryTime is what
// serves that purpose.
//
// The LATEST expiry across line items, not the first. A subscription
// normally has one, but an upgrade in flight can briefly carry two, and
// taking the first would cut a bowler off at the end of the plan they
// just left.
export function currentPeriodEnd(p: SubscriptionPurchaseV2 | null | undefined): string | null {
  let best: number | null = null;
  for (const li of lineItems(p)) {
    const t = Date.parse(li?.expiryTime ?? "");
    if (!Number.isFinite(t)) continue;
    if (best === null || t > best) best = t;
  }
  return best === null ? null : new Date(best).toISOString();
}

// The line item actually driving this subscription: the one whose expiry
// we are using.
function activeLineItem(p: SubscriptionPurchaseV2 | null | undefined): LineItem | null {
  let best: LineItem | null = null;
  let bestT: number | null = null;
  for (const li of lineItems(p)) {
    const t = Date.parse(li?.expiryTime ?? "");
    if (!Number.isFinite(t)) continue;
    if (bestT === null || t > bestT) { best = li; bestT = t; }
  }
  return best ?? lineItems(p)[0] ?? null;
}

export function basePlanIdOf(p: SubscriptionPurchaseV2 | null | undefined): string | null {
  const id = activeLineItem(p)?.offerDetails?.basePlanId;
  return typeof id === "string" && id ? id : null;
}

export function offerIdOf(p: SubscriptionPurchaseV2 | null | undefined): string | null {
  const id = activeLineItem(p)?.offerDetails?.offerId;
  return typeof id === "string" && id ? id : null;
}

// Is this ACTIVE subscription actually a free trial?
//
// Google does not say so directly. A trial reports as
// SUBSCRIPTION_STATE_ACTIVE like any other live subscription, and the
// only signal is that the line item carries the trial OFFER id --
// offerId is populated for discounted and promotional offers and absent
// otherwise.
//
// Getting this wrong in the safe direction matters. A real trial read as
// "active" only means the banner does not count down, which is cosmetic.
// A paying subscriber read as "trialing" would show them a countdown to
// a charge that already happened, which is alarming. Hence an exact id
// match and nothing looser.
export function isTrialPurchase(
  p: SubscriptionPurchaseV2 | null | undefined,
  trialOfferId: string = PLAY_TRIAL_OFFER_ID,
): boolean {
  return !!trialOfferId && offerIdOf(p) === trialOfferId;
}

export function playStatus(
  p: SubscriptionPurchaseV2 | null | undefined,
  trialOfferId: string = PLAY_TRIAL_OFFER_ID,
): Status {
  const status = playStateToStatus(p?.subscriptionState);
  if (status === "active" && isTrialPurchase(p, trialOfferId)) return "trialing";
  return status;
}

// ── The row ─────────────────────────────────────────────────────────
//
// What the Edge Functions write. Returns the columns only -- no user_id,
// because the caller is the one who knows which bowler this token
// belongs to, and this file should not be capable of being handed the
// wrong one.
//
// plan is "plus" for every status that grants access and "free"
// otherwise, so a row can be read at a glance without reimplementing
// is_subscriber() in SQL.
export function entitlementFromPlayPurchase(
  p: SubscriptionPurchaseV2 | null | undefined,
  opts: { trialOfferId?: string } = {},
): EntitlementRow {
  const { trialOfferId = PLAY_TRIAL_OFFER_ID } = opts;
  const status = playStatus(p, trialOfferId);
  const ends = currentPeriodEnd(p);
  const grants = status === "active" || status === "trialing"
    || status === "grace" || status === "canceled";
  return {
    plan: grants ? "plus" : "free",
    source: "play",
    status,
    billing_period: billingPeriodFor(basePlanIdOf(p)),
    current_period_end: ends,
    // Only a trial has a trial end, and it is the same instant the
    // subscription would otherwise renew. Writing it for a paying
    // subscriber would make trialDaysLeft() count down to their renewal.
    trial_end: status === "trialing" ? ends : null,
    play_purchase_token: typeof p?.purchaseToken === "string" ? p.purchaseToken : null,
  };
}
