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

import { STRIPE_PRICE_MONTHLY, STRIPE_PRICE_YEARLY } from "./stripe.ts";

const SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY")?.trim() || "";
const API = "https://api.stripe.com/v1";

// Pinned, not "whatever the account defaults to".
//
// An account's default API version can be changed from the dashboard by
// anybody, and Basil moved current_period_end when it landed. Pinning
// means an upgrade is a decision made in this file with the tests run,
// rather than something that happens to the app one afternoon.
const API_VERSION = "2025-03-31.basil";

export const PRICE_MONTHLY = Deno.env.get("STRIPE_PRICE_MONTHLY")?.trim() || STRIPE_PRICE_MONTHLY;
export const PRICE_YEARLY = Deno.env.get("STRIPE_PRICE_YEARLY")?.trim() || STRIPE_PRICE_YEARLY;

export function stripeConfigured(): boolean {
  return SECRET_KEY.startsWith("sk_");
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
  method: "GET" | "POST" = body ? "POST" : "GET",
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
