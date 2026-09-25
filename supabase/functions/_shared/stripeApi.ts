// Talking to Stripe, for both functions that have to.
//
// create-checkout opens a session; stripe-webhook reads back the
// subscription behind an event. Same key, same shape, so one file.
//
// SEPARATE FROM stripe.ts ON PURPOSE. stripe.ts is the mapping and has
// no imports at all, which is what lets vitest test every subscription
// state in CI. This touches Deno.env and the network, and putting it
// there would take that testability down with it. Same split as
// play.ts / playApi.ts.
//
// No Stripe SDK. The REST API is form-encoded and fetch does it in a
// dozen lines; the SDK is Node-shaped, large, and would be pulled in for
// three calls. It also lets the API version be pinned explicitly below,
// which matters more here than usual -- see stripe.ts on what Basil
// moved.
//
// Secrets:
//   STRIPE_SECRET_KEY   sk_live_... or sk_test_...  NEVER the publishable
//                       key, and never anywhere the browser can read it
//   STRIPE_PRICE_MONTHLY / STRIPE_PRICE_YEARLY
//                       optional overrides for the placeholder price ids
//
// ⚠️ NONE OF THESE EXIST YET. ⚠️

import { STRIPE_LOOKUP_MONTHLY, STRIPE_LOOKUP_YEARLY } from "./stripe.ts";

const SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY")?.trim() || "";
const API = "https://api.stripe.com/v1";

// Pinned, not "whatever the account defaults to".
//
// An account's default API version can be changed from the dashboard by
// anybody, and Basil moved current_period_end when it landed. Pinning
// means an upgrade is a decision made in this file with the tests run,
// rather than something that happens to the app one afternoon.
const API_VERSION = "2025-03-31.basil";

// Overridable by secret, but the defaults are the real keys -- no
// secret needs setting for this to work.
export const LOOKUP_MONTHLY = Deno.env.get("STRIPE_LOOKUP_MONTHLY")?.trim() || STRIPE_LOOKUP_MONTHLY;
export const LOOKUP_YEARLY = Deno.env.get("STRIPE_LOOKUP_YEARLY")?.trim() || STRIPE_LOOKUP_YEARLY;

// sk_ OR rk_.
//
// Stripe issues two kinds of server-side key and both work here:
//   sk_...  a standard secret key, full account access
//   rk_...  a RESTRICTED key, scoped to chosen resources
//
// New accounts are increasingly steered towards restricted keys, and an
// rk_ is the better key to use -- this one needs only Checkout Sessions,
// Customers and Subscriptions write, plus Prices read.
//
// Checking for "sk_" alone rejected a perfectly good restricted key and
// reported it as MISSING, which is a 503 saying "Subscriptions are not
// available yet" while the key sits correctly in the secrets page. The
// point of this check is to catch a PUBLISHABLE key (pk_) pasted here by
// mistake -- that is the error worth catching, because it would
// otherwise fail deep inside a checkout.
export function stripeConfigured(): boolean {
  return SECRET_KEY.startsWith("sk_") || SECRET_KEY.startsWith("rk_");
}

// Stripe's API is form-encoded, including nested structures, which it
// expresses as bracketed keys: subscription_data[trial_end]=1750000000.
// Flattened here rather than hand-written at each call site, because a
// mistyped bracket is silently IGNORED by Stripe rather than rejected --
// the call succeeds and the setting simply is not there.
export function form(obj: Record<string, unknown>, prefix = ""): string[] {
  const out: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    const key = prefix ? `${prefix}[${k}]` : k;
    if (Array.isArray(v)) {
      v.forEach((item, i) => {
        if (item && typeof item === "object") out.push(...form(item as Record<string, unknown>, `${key}[${i}]`));
        else out.push(`${encodeURIComponent(`${key}[${i}]`)}=${encodeURIComponent(String(item))}`);
      });
    } else if (typeof v === "object") {
      out.push(...form(v as Record<string, unknown>, key));
    } else {
      out.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`);
    }
  }
  return out;
}

export async function stripeRequest(
  path: string,
  body?: Record<string, unknown>,
  // DELETE is here for cancelSubscriptionNow. Stripe cancels a
  // subscription with DELETE on its resource, not with a POST.
  method: "GET" | "POST" | "DELETE" = body ? "POST" : "GET",
): Promise<Record<string, unknown> | null> {
  if (!stripeConfigured()) {
    console.error("STRIPE_SECRET_KEY is missing or not a secret key");
    return null;
  }
  try {
    const res = await fetch(`${API}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${SECRET_KEY}`,
        "Stripe-Version": API_VERSION,
        ...(body ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
      },
      body: body ? form(body).join("&") : undefined,
    });
    const json = await res.json();
    if (!res.ok) {
      // Stripe's own message is the useful part and is safe to log --
      // it describes the request, never the key.
      console.error("stripe request failed:", path, res.status, JSON.stringify(json?.error?.message || "").slice(0, 300));
      return null;
    }
    return json as Record<string, unknown>;
  } catch (e) {
    console.error("stripe request threw:", path, String(e));
    return null;
  }
}

// The subscription, with its items expanded.
//
// items.data is where current_period_end lives since Basil, and it is
// NOT expanded by default on every path -- fetching it explicitly is
// what stops the period end coming back undefined, which would read as
// an open-ended manual grant. See stripe.ts.
export async function fetchSubscription(id: string) {
  if (!id) return null;
  return await stripeRequest(`/subscriptions/${encodeURIComponent(id)}?expand[]=items.data.price`);
}

// Constant-time comparison for the webhook signature.
//
// A plain === leaks, through timing, how much of a forged signature was
// correct -- enough to reconstruct one byte at a time. Rare in practice
// over a network, free to avoid.
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// End a subscription now, with no refund and no proration.
//
// Used when a bowler deletes their account. DELETE on a subscription
// cancels it immediately; Stripe's prorate and invoice_now parameters
// both default to off, so nothing is credited and no final invoice is
// raised. That is the intent: stop the next charge, keep what was
// already paid for the period they already had.
//
// Immediate rather than at_period_end, because the account is gone. A
// subscription set to end later would sit in the dashboard attached to a
// customer whose user no longer exists, and any webhook it fired would
// arrive with nobody to apply it to.
export async function cancelSubscriptionNow(subscriptionId: string): Promise<boolean> {
  if (!subscriptionId) return false;
  const res = await stripeRequest(`/subscriptions/${encodeURIComponent(subscriptionId)}`, undefined, "DELETE");
  return !!res;
}

// Is anything on this customer still billing? Our row holds one
// subscription; Stripe knows them all.
export async function customerHasLiveSubscription(customerId: string): Promise<boolean | null> {
  if (!customerId) return null;
  const res = await stripeRequest(`/subscriptions?customer=${encodeURIComponent(customerId)}&status=all&limit=100`);
  const data = (res as { data?: Array<{ status?: string }> } | null)?.data;
  if (!Array.isArray(data)) return null;
  return data.some(sub => ["active", "trialing", "past_due", "unpaid", "paused"].includes(String(sub?.status)));
}

// Close any checkout this customer left open. A checkout stays payable
// for 24 hours, so an abandoned phone tab finished after paying on a
// laptop made a second subscription.
export async function expireOpenCheckouts(customerId: string): Promise<void> {
  if (!customerId) return;
  const res = await stripeRequest(`/checkout/sessions?customer=${encodeURIComponent(customerId)}&status=open&limit=100`);
  const data = (res as { data?: Array<{ id?: string }> } | null)?.data;
  if (!Array.isArray(data)) return;
  for (const cs of data) {
    if (cs?.id) await stripeRequest(`/checkout/sessions/${encodeURIComponent(cs.id)}/expire`, {}, "POST");
  }
}

// Every subscription on a customer that could still charge them.
//
// A second checkout tab finished later, or a web subscription started
// while Play was on hold, leaves a subscription the entitlements row does
// not point at. Deleting an account has to stop all of them, not only the
// one we happen to have stored.
export async function cancelAllForCustomer(customerId: string): Promise<{ cancelled: number; failed: number }> {
  const out = { cancelled: 0, failed: 0 };
  if (!customerId) return out;
  const res = await stripeRequest(`/subscriptions?customer=${encodeURIComponent(customerId)}&status=all&limit=100`);
  const data = (res as { data?: Array<{ id?: string; status?: string }> } | null)?.data;
  if (!Array.isArray(data)) return out;
  for (const sub of data) {
    if (!sub?.id || ["canceled", "incomplete_expired"].includes(String(sub.status))) continue;
    if (await cancelSubscriptionNow(sub.id)) out.cancelled++; else out.failed++;
  }
  return out;
}

// Has this customer EVER had a subscription with us?
//
// The trial runs from checkout rather than from sign-up, which is what
// was asked for and is right for somebody subscribing the first time.
// On its own, though, it also means: subscribe, cancel, subscribe again
// -- another 30 free days, repeatable for as long as somebody cares to
// keep doing it. The trial has to be a first-time thing, and the only
// authoritative record of "have they had one" is Stripe's own.
//
// status=all matters. The default listing returns active-ish
// subscriptions only, so a bowler whose subscription had fully ended --
// exactly the one coming back for a second free month -- would come back
// as "no prior subscriptions" and be handed another trial.
//
// Returns null when Stripe could not be asked. The caller decides what
// to do with that; it is deliberately NOT folded into false, because
// "we do not know" and "they are new" must not be the same answer.
export async function customerHasAnySubscription(customerId: string): Promise<boolean | null> {
  if (!customerId) return null;
  const res = await stripeRequest(
    `/subscriptions?customer=${encodeURIComponent(customerId)}&status=all&limit=1`,
  );
  if (!res) return null;
  const data = (res as { data?: unknown[] }).data;
  if (!Array.isArray(data)) return null;
  return data.length > 0;
}

// A lookup key, turned into the price id Checkout needs.
//
// Cached for the life of the function instance. A price id does not
// change once a price exists, and the alternative is an extra round trip
// to Stripe on every single checkout -- paid by a bowler waiting for the
// page to open.
//
// The cache holds only successful lookups. Caching a miss would mean one
// bad deploy, or one moment before the price existed, poisoning every
// checkout until the instance recycled.
const priceIdCache = new Map<string, string>();

export async function priceIdForLookupKey(lookupKey: string): Promise<string | null> {
  if (!lookupKey) return null;
  const hit = priceIdCache.get(lookupKey);
  if (hit) return hit;

  const res = await stripeRequest(
    `/prices?lookup_keys[]=${encodeURIComponent(lookupKey)}&active=true&limit=1`,
  );
  const list = Array.isArray((res as { data?: unknown[] })?.data) ? (res as { data: unknown[] }).data : [];
  const first = list[0] as { id?: unknown } | undefined;
  const id = typeof first?.id === "string" ? first.id : "";
  if (!id) {
    // Loud, because every checkout fails until it is fixed, and the
    // cause is almost always a lookup key that exists in one mode and
    // not the other.
    console.error(`no active price found for lookup key "${lookupKey}" in this mode`);
    return null;
  }
  priceIdCache.set(lookupKey, id);
  return id;
}
