// Turning a store's idea of a subscription into ours.
//
// PURE. No network, no Capacitor, no supabase. The Edge Function fetches
// the purchase and writes the row; this file only decides what the row
// should say. That is what makes every state below testable without a
// Play Console, which matters because most of them are states you cannot
// easily reach on purpose.
//
// ── The shape of the system ─────────────────────────────────────────
//
//   the app         buys through @capgo/native-purchases, gets a token
//   verify-purchase takes that token, asks Google what it really is,
//                   writes entitlements under service_role
//   play-rtdn       Google tells us something changed; we ask Google
//                   again and rewrite the row
//
// THE CLIENT NEVER SAYS WHAT SOMEBODY BOUGHT. It hands over a token and
// the server asks Google. A client that can assert "I am plus" is a
// client that will, because the anon key ships in the app.
//
// RTDN carries a notification TYPE, and it is deliberately not mapped
// here. The type tells you something happened; it does not tell you the
// current state, and acting on the type alone means replaying an old
// notification can downgrade a bowler who has since re-subscribed. Both
// entry points do the same thing: fetch the purchase, map the state
// below, write the result. Order of arrival stops mattering.

// ── Placeholders ────────────────────────────────────────────────────
//
// ⚠️ EVERY ID BELOW IS A PLACEHOLDER. ⚠️
//
// There is no Play Console yet, so none of these exist. They are written
// to be obviously wrong rather than plausibly right, on the same
// principle as the appId in capacitor.config.ts: a placeholder you could
// mistake for real is one that ships.
//
// When the Play Console exists, these must match it exactly. A base plan
// id that is a character off does not throw -- it falls through to null
// and the bowler silently gets no billing period.
export const PLAY_PRODUCT_ID = "PLACEHOLDER_product_plus";
export const PLAY_BASE_PLAN_MONTHLY = "PLACEHOLDER-monthly";
export const PLAY_BASE_PLAN_YEARLY = "PLACEHOLDER-yearly";

// The 30-day free trial, configured in Play as an offer on the monthly
// base plan. Play reports a trial as an ACTIVE subscription, so the
// offer id is the only thing that distinguishes "trialing" from
// "paying" -- see playStatus() below.
export const PLAY_TRIAL_OFFER_ID = "PLACEHOLDER-freetrial30";

export const BASE_PLAN_PERIODS = Object.freeze({
  [PLAY_BASE_PLAN_MONTHLY]: "month",
  [PLAY_BASE_PLAN_YEARLY]: "year",
});

// ── Play's states, and ours ─────────────────────────────────────────
//
// Verified against the Google Play Developer API v3 reference for
// purchases.subscriptionsv2 (SubscriptionState). All nine are listed
// because an unlisted one falling through to a default is how a paying
// bowler ends up locked out by a state nobody thought about.
//
// Two of these are judgement calls rather than translations:
//
//   CANCELED  they turned off auto-renew but have NOT lapsed. They keep
//             access until expiryTime, which isSubscriber() enforces.
//             Writing them off at cancellation would take away time they
//             have already paid for.
//   PENDING   a purchase that has not completed -- cash at a kiosk, a
//             card awaiting approval. No money has arrived, so no
//             access. It becomes ACTIVE on its own if it completes.
export const PLAY_STATE_TO_STATUS = Object.freeze({
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
// can add a state faster than we can ship, and the safe direction for a
// state we have never seen is the one that does not hand out a
// subscription.
export function playStateToStatus(state) {
  if (typeof state !== "string") return "none";
  return Object.prototype.hasOwnProperty.call(PLAY_STATE_TO_STATUS, state)
    ? PLAY_STATE_TO_STATUS[state]
    : "none";
}

export function billingPeriodFor(basePlanId) {
  if (typeof basePlanId !== "string") return null;
  return Object.prototype.hasOwnProperty.call(BASE_PLAN_PERIODS, basePlanId)
    ? BASE_PLAN_PERIODS[basePlanId]
    : null;
}

// ── Reading a purchase ──────────────────────────────────────────────

const lineItems = p => (p && Array.isArray(p.lineItems) ? p.lineItems.filter(Boolean) : []);

// There is no "current period end" field on SubscriptionPurchaseV2 --
// confirmed against the API reference. lineItems[].expiryTime is what
// serves that purpose.
//
// The LATEST expiry across line items, not the first. A subscription
// normally has one, but an upgrade in flight can briefly carry two, and
// taking the first would cut a bowler off at the end of the plan they
// just left.
export function currentPeriodEnd(purchase) {
  let best = null;
  for (const li of lineItems(purchase)) {
    const t = Date.parse(li?.expiryTime);
    if (!Number.isFinite(t)) continue;
    if (best === null || t > best) best = t;
  }
  return best === null ? null : new Date(best).toISOString();
}

// The line item that is actually driving this subscription: the one
// whose expiry we are using.
function activeLineItem(purchase) {
  let best = null, bestT = null;
  for (const li of lineItems(purchase)) {
    const t = Date.parse(li?.expiryTime);
    if (!Number.isFinite(t)) continue;
    if (bestT === null || t > bestT) { best = li; bestT = t; }
  }
  return best || lineItems(purchase)[0] || null;
}

export function basePlanIdOf(purchase) {
  const id = activeLineItem(purchase)?.offerDetails?.basePlanId;
  return typeof id === "string" && id ? id : null;
}

export function offerIdOf(purchase) {
  const id = activeLineItem(purchase)?.offerDetails?.offerId;
  return typeof id === "string" && id ? id : null;
}

// Is this ACTIVE subscription actually a free trial?
//
// Play does not say so directly. A trial reports as
// SUBSCRIPTION_STATE_ACTIVE like any other live subscription, and the
// only signal is that the line item carries the trial OFFER id --
// offerId is populated for discounted and promotional offers and absent
// otherwise.
//
// Getting this wrong in the safe direction matters: a real trial read as
// "active" only means the banner does not count down, which is a
// cosmetic miss. A paying subscriber read as "trialing" would show them
// a countdown to a charge that already happened, which is alarming.
// Hence an exact id match and nothing looser.
export function isTrialPurchase(purchase, trialOfferId = PLAY_TRIAL_OFFER_ID) {
  return !!trialOfferId && offerIdOf(purchase) === trialOfferId;
}

export function playStatus(purchase, trialOfferId = PLAY_TRIAL_OFFER_ID) {
  const status = playStateToStatus(purchase?.subscriptionState);
  if (status === "active" && isTrialPurchase(purchase, trialOfferId)) return "trialing";
  return status;
}

// ── The row ─────────────────────────────────────────────────────────
//
// What the Edge Functions write. Returns the columns only -- no user_id,
// because the caller is the one who knows which bowler this token
// belongs to, and this file should not be able to be handed the wrong
// one.
//
// plan is "plus" for every status that grants access and "free"
// otherwise, so a row can be read at a glance without reimplementing
// isSubscriber() in SQL.
export function entitlementFromPlayPurchase(purchase, opts = {}) {
  const { trialOfferId = PLAY_TRIAL_OFFER_ID } = opts;
  const status = playStatus(purchase, trialOfferId);
  const ends = currentPeriodEnd(purchase);
  const grants = status === "active" || status === "trialing"
    || status === "grace" || status === "canceled";
  return {
    plan: grants ? "plus" : "free",
    source: "play",
    status,
    billing_period: billingPeriodFor(basePlanIdOf(purchase)),
    current_period_end: ends,
    // Only a trial has a trial end, and it is the same instant the
    // subscription would otherwise renew. Writing it for a paying
    // subscriber would make trialDaysLeft() count down to their renewal.
    trial_end: status === "trialing" ? ends : null,
    play_purchase_token: typeof purchase?.purchaseToken === "string" ? purchase.purchaseToken : null,
  };
}

// ── Which rail ──────────────────────────────────────────────────────
//
// Play inside the Android app, Stripe on the web. Not a preference: an
// app distributed through Play must use Play billing for digital goods,
// and Stripe cannot be offered inside it.
//
// isNative is passed in rather than read from Capacitor here, so this
// stays pure -- and so the web rail can be tested without pretending to
// be a phone. The caller reads Capacitor.isNativePlatform(), which is
// the exact signal and is not user-agent sniffing: iPadOS reports itself
// as a Mac, and an iPhone bowler on the web app must get Stripe.
export function paymentRail({ isNative = false } = {}) {
  return isNative ? "play" : "stripe";
}
