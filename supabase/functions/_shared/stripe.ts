// Turning Stripe's idea of a subscription into ours.
//
// The web rail. An iPhone bowler cannot install the Android app at all,
// so without this they have no way to pay -- which is not a lost 40c
// fee, it is a lost subscription.
//
// NO IMPORTS, deliberately -- same as play.ts, and for the same reason:
// it lets vitest load this straight out of supabase/ and test every
// subscription state in CI. See src/domain/stripeBilling.test.js.
//
// ── The field that moved ────────────────────────────────────────────
//
// Stripe's Basil release (API 2025-03-31) REMOVED current_period_start
// and current_period_end from the Subscription object and moved them
// onto each subscription ITEM.
//
// This is the single most dangerous detail in this file, because getting
// it wrong fails in the expensive direction rather than the loud one. A
// missing period end is null, and isSubscriber() reads a null end on an
// active plan as a manual grant -- open-ended, no expiry. So reading the
// old field would not lock anybody out; it would give every bowler who
// cancelled a free subscription forever, quietly.
//
// Both shapes are read below: the item first, the subscription second.
// A webhook endpoint is pinned to an API version, so an endpoint created
// before Basil still sends the old shape, and a project can be mid-
// upgrade with both arriving on the same day.

// ── Which price to sell ─────────────────────────────────────────────
//
// LOOKUP KEYS, not price ids, and that is the whole point.
//
// A price id exists in exactly one mode: a price_... created in test
// does not exist in live. Hardcode ids and going live means swapping the
// secret key AND both ids together, where getting one wrong produces
// "No such price" -- an error that reads like a bug in this code, on the
// day real money starts moving.
//
// A lookup key is a name WE choose and set on the price in both modes.
// Ask for "pro_monthly" and you get whichever mode the key you are
// holding belongs to. The mismatch stops being possible rather than
// being something to remember.
//
// These are real values, not placeholders: they match the lookup keys
// set on the prices in the Stripe dashboard. Change them here and in
// Stripe together, or not at all.
export const STRIPE_LOOKUP_MONTHLY = "pro_monthly";
export const STRIPE_LOOKUP_YEARLY = "pro_yearly";

export type Status =
  | "none" | "trialing" | "active" | "grace"
  | "on_hold" | "paused" | "canceled" | "expired";

export interface StripePrice {
  id?: string;
  recurring?: { interval?: string };
}

export interface StripeSubscriptionItem {
  price?: StripePrice;
  current_period_end?: number;
}

export interface StripeSubscription {
  id?: string;
  status?: string;
  customer?: string;
  cancel_at_period_end?: boolean;
  trial_end?: number | null;
  items?: { data?: StripeSubscriptionItem[] };
  // Basil removed this. Read only as a fallback for an endpoint still
  // pinned to an older API version.
  current_period_end?: number;
}

export interface EntitlementRow {
  plan: "free" | "plus";
  source: "stripe";
  status: Status;
  billing_period: "month" | "year" | null;
  current_period_end: string | null;
  trial_end: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
}

// ── Stripe's statuses, and ours ─────────────────────────────────────
//
// All eight, listed, for the same reason as play.ts: an unlisted one
// falling through to a default is how a paying bowler gets locked out by
// a state nobody considered.
//
// The subtle one is "canceled", and it does NOT mean what our "canceled"
// means:
//
//   Stripe canceled   the subscription is OVER. Access has ended.
//                     -> our "expired"
//   our canceled      they cancelled but paid through the period and
//                     keep access until it ends.
//                     -> in Stripe that is status "active" with
//                        cancel_at_period_end = true, handled in
//                        stripeStatus() below.
//
// Mapping Stripe's "canceled" onto ours would hand a month of free
// access to everyone who cancelled, because our isSubscriber() honours
// "canceled" until current_period_end.
export const STRIPE_STATUS_TO_STATUS: Readonly<Record<string, Status>> = Object.freeze({
  trialing: "trialing",
  active: "active",
  // The card failed and Stripe is retrying. Our "grace" -- access
  // continues, exactly as it does for Play's grace period.
  past_due: "grace",
  // Stripe has stopped trying to collect.
  unpaid: "on_hold",
  paused: "paused",
  // Over. Not our "canceled".
  canceled: "expired",
  // Checkout was started and never completed. No money arrived.
  incomplete: "none",
  incomplete_expired: "expired",
});

export function stripeStateToStatus(state: unknown): Status {
  if (typeof state !== "string") return "none";
  return Object.prototype.hasOwnProperty.call(STRIPE_STATUS_TO_STATUS, state)
    ? STRIPE_STATUS_TO_STATUS[state]
    : "none";
}

export function stripeStatus(sub: StripeSubscription | null | undefined): Status {
  const status = stripeStateToStatus(sub?.status);
  // Cancelled but still inside the period they paid for. Trialing is
  // deliberately excluded: somebody who cancels during a trial has
  // nothing paid for, and calling it "canceled" would keep them on
  // plus until the trial end they no longer have.
  if (status === "active" && sub?.cancel_at_period_end === true) return "canceled";
  return status;
}

// ── Reading a subscription ──────────────────────────────────────────

function items(sub: StripeSubscription | null | undefined): StripeSubscriptionItem[] {
  return sub && Array.isArray(sub.items?.data) ? sub.items!.data!.filter(Boolean) : [];
}

function fromUnix(seconds: unknown): string | null {
  if (typeof seconds !== "number" || !Number.isFinite(seconds) || seconds <= 0) return null;
  const ms = seconds * 1000;
  const d = new Date(ms);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

// The LATEST period end across items, with the pre-Basil subscription
// field as a fallback.
//
// Latest rather than first for the same reason as Play: one
// subscription can briefly carry two items during a plan change, and
// taking the first would end access at the plan they just left.
export function currentPeriodEnd(sub: StripeSubscription | null | undefined): string | null {
  let best: number | null = null;
  for (const it of items(sub)) {
    const v = it?.current_period_end;
    if (typeof v !== "number" || !Number.isFinite(v) || v <= 0) continue;
    if (best === null || v > best) best = v;
  }
  if (best !== null) return fromUnix(best);
  // Only reached on an endpoint pinned before 2025-03-31.basil.
  return fromUnix(sub?.current_period_end);
}

function activeItem(sub: StripeSubscription | null | undefined): StripeSubscriptionItem | null {
  let best: StripeSubscriptionItem | null = null;
  let bestV: number | null = null;
  for (const it of items(sub)) {
    const v = it?.current_period_end;
    if (typeof v !== "number" || !Number.isFinite(v)) continue;
    if (bestV === null || v > bestV) { best = it; bestV = v; }
  }
  return best ?? items(sub)[0] ?? null;
}

// From the price's own recurring interval rather than from a lookup
// table of price ids.
//
// A price id that does not match a table is null, silently -- and a
// silent null here means shouldOfferAnnual() never fires for anybody.
// The interval is on the object Stripe already sent and cannot drift out
// of step with the dashboard the way a hardcoded id can.
export function billingPeriodOf(sub: StripeSubscription | null | undefined): "month" | "year" | null {
  const interval = activeItem(sub)?.price?.recurring?.interval;
  if (interval === "month") return "month";
  if (interval === "year") return "year";
  return null;
}

export function priceIdOf(sub: StripeSubscription | null | undefined): string | null {
  const id = activeItem(sub)?.price?.id;
  return typeof id === "string" && id ? id : null;
}

// ── The row ─────────────────────────────────────────────────────────
//
// Columns only -- no user_id. The caller is the one who knows which
// bowler this subscription belongs to, and this file should not be
// capable of being handed the wrong one.
export function entitlementFromStripeSubscription(
  sub: StripeSubscription | null | undefined,
): EntitlementRow {
  const status = stripeStatus(sub);
  const ends = currentPeriodEnd(sub);
  const grants = status === "active" || status === "trialing"
    || status === "grace" || status === "canceled";
  return {
    plan: grants ? "plus" : "free",
    source: "stripe",
    status,
    billing_period: billingPeriodOf(sub),
    current_period_end: ends,
    // Stripe gives a real trial_end, unlike Play. Used only when they
    // are actually trialing -- a past trial_end left on a paying
    // subscriber would make trialDaysLeft() count down to nothing.
    trial_end: status === "trialing" ? (fromUnix(sub?.trial_end) ?? ends) : null,
    stripe_customer_id: typeof sub?.customer === "string" ? sub.customer : null,
    stripe_subscription_id: typeof sub?.id === "string" ? sub.id : null,
  };
}
