// Supabase Edge Function: create-checkout
//
// The web rail. Opens a Stripe Checkout session and hands back its URL.
//
// Play covers bowlers inside the Android app. This covers everybody
// else, and "everybody else" is not a rounding error: an iPhone bowler
// cannot install the Android app at all, so without this they have no
// way to pay at all.
//
// ── No store trial ──────────────────────────────────────────────────
//
// Replaced by the 60-day reverse trial every account starts with (see
// public.is_subscriber()). A checkout here charges from day one.
//
// Deploy with: supabase functions deploy create-checkout
// Secrets required:
//   STRIPE_SECRET_KEY      sk_live_... or sk_test_...
//   (no price secrets: the prices are found by their lookup keys,
//    pro_monthly and pro_yearly, which are the same in test and live)
//   APP_URL                where to send them back to, e.g.
//                          https://mybowlingjourney.com
//   ALLOWED_ORIGINS        same list as the other functions
//
// ⚠️ NONE OF THESE EXIST YET. ⚠️ Unconfigured it returns 503.

import { createClient } from "jsr:@supabase/supabase-js@2";
import {
  stripeConfigured, stripeRequest, priceIdForLookupKey,
  customerHasLiveSubscription,
  expireOpenCheckouts,
  LOOKUP_MONTHLY, LOOKUP_YEARLY,
} from "../_shared/stripeApi.ts";

const APP_URL = Deno.env.get("APP_URL")?.trim().replace(/\/+$/, "") || "";
// The APP lives at /app/; APP_URL's root is the public welcome page.
// Sending a bowler who just paid to the marketing page reads as a failed
// checkout, so both Stripe returns point one level in.
const APP_HOME = APP_URL ? `${APP_URL}/app` : "";

function json(body: unknown, cors: Record<string, string>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

function corsFor(req: Request) {
  const allowedOrigins = (Deno.env.get("ALLOWED_ORIGINS") || "").split(",").map(s => s.trim()).filter(Boolean);
  const origin = req.headers.get("Origin") || "";
  const allow = allowedOrigins.length === 0
    ? "*"
    : (allowedOrigins.includes(origin) ? origin : allowedOrigins[0]);
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Vary": "Origin",
  };
}

async function requireUser(req: Request, cors: Record<string, string>) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return { user: null, response: json({ error: "Not authenticated" }, cors, 401) };
  }
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return { user: null, response: json({ error: "Not authenticated" }, cors, 401) };
  }
  return { user, response: null };
}

// Fails SAFE, not open -- see analyze-performance.
const fallbackHits = new Map<string, number[]>();

function withinFallbackLimit(userId: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (fallbackHits.get(userId) || []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    fallbackHits.set(userId, recent);
    return false;
  }
  recent.push(now);
  fallbackHits.set(userId, recent);
  if (fallbackHits.size > 5000) {
    for (const [k, v] of fallbackHits) {
      if (!v.some((t) => now - t < windowMs)) fallbackHits.delete(k);
    }
  }
  return true;
}

async function withinRateLimit(
  req: Request, endpoint: string, limit: number,
  windowInterval: string, userId: string, windowMs: number,
): Promise<boolean> {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } },
    );
    const { data, error } = await supabase.rpc("check_api_rate_limit", {
      p_endpoint: endpoint,
      p_limit: limit,
      p_window: windowInterval,
    });
    if (error) {
      console.error(`rate limit check failed for ${endpoint}, falling back:`, error.message);
      return withinFallbackLimit(userId, limit, windowMs);
    }
    return data !== false;
  } catch (e) {
    console.error(`rate limit check threw for ${endpoint}, falling back:`, String(e));
    return withinFallbackLimit(userId, limit, windowMs);
  }
}

Deno.serve(async (req: Request) => {
  const cors = corsFor(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, cors, 405);

  const { user, response } = await requireUser(req, cors);
  if (response) return response;

  // Ten an hour. A bowler changing their mind about monthly versus
  // yearly opens a few sessions; a loop opening thousands is somebody
  // filling the Stripe dashboard with abandoned checkouts.
  const ok = await withinRateLimit(req, "create-checkout", 10, "1 hour", user!.id, 3_600_000);
  if (!ok) return json({ error: "Too many attempts. Try again shortly." }, cors, 429);

  if (!stripeConfigured() || !APP_URL) {
    console.error("create-checkout is not configured: STRIPE_SECRET_KEY and/or APP_URL missing");
    return json({ error: "Subscriptions are not available yet." }, cors, 503);
  }

  let body: { period?: unknown; currency?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Bad request" }, cors, 400);
  }

  // An explicit allowlist, not a lookup. The period decides which price
  // is charged, and it arrives from the browser.
  const period = body?.period === "year" ? "year" : body?.period === "month" ? "month" : "";
  if (!period) return json({ error: "Bad request" }, cors, 400);
  // Canada only, and an allowlist for the same reason as period. The app
  // shows Canadians the Play Canada prices (9.99 / 69.99 CAD) and asks
  // for CAD here; both Stripe prices carry those amounts as a CAD
  // currency option. Anything else: no currency, and Stripe picks.
  const currency = body?.currency === "cad" ? "cad" : "";
  // Resolved from a lookup key rather than read as a price id. See
  // _shared/stripe.ts: this is what makes test and live use the same
  // configuration instead of two sets of ids that can be mixed up on the
  // day it matters most.
  const price = await priceIdForLookupKey(period === "year" ? LOOKUP_YEARLY : LOOKUP_MONTHLY);
  if (!price) {
    return json({ error: "That plan is not available right now." }, cors, 503);
  }

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  // Reuse their Stripe customer if they have one. A second customer for
  // the same bowler is how one person ends up with two live
  // subscriptions and a support email nobody can untangle.
  const { data: existing, error: readErr } = await admin
    .from("entitlements")
    .select("stripe_customer_id,status,plan,trial_end,source")
    .eq("user_id", user!.id)
    .maybeSingle();
  if (readErr) {
    console.error("entitlement read failed:", readErr.message);
    return json({ error: "Could not start checkout." }, cors, 500);
  }

  // Already paying. Sending them to checkout again would charge them
  // twice for the same thing.
  // "canceled" IS in this list, and leaving it out was a real bug.
  //
  // Our "canceled" means cancelled but paid through the period -- they
  // still have everything until the date they bought. isSubscriber() on
  // the client counts them as a subscriber and delete-account cancels
  // for them, so a list here that stopped at "grace" let exactly one
  // person through: the bowler who cancelled, changed their mind, and
  // came back before the period ended. They would get a SECOND live
  // subscription on the same Stripe customer, and since entitlements
  // holds one row per bowler the older one goes invisible and bills on
  // forever. They want to RESUME, which is what the portal is for.
  if (existing && existing.plan === "plus"
      && ["active", "trialing", "grace", "canceled"].includes(String(existing.status))) {
    return json({ error: "You already have a subscription.", alreadySubscribed: true }, cors, 409);
  }

  let customerId = typeof existing?.stripe_customer_id === "string" ? existing.stripe_customer_id : "";
  let isNewCustomer = false;
  if (!customerId) {
    const customer = await stripeRequest("/customers", {
      email: user!.email || undefined,
      // So a human looking at the Stripe dashboard can tell who this is
      // without a database query.
      metadata: { user_id: user!.id },
    });
    if (!customer?.id) return json({ error: "Could not start checkout." }, cors, 500);
    customerId = String(customer.id);
    // Brand new customer, created a line ago. There is nothing to ask
    // Stripe about, and skipping the call keeps the common first-time
    // path at one round trip.
    isNewCustomer = true;
  }

  // ── One subscription per bowler ────────────────────────────────────
  if (!isNewCustomer) {
    // Already billing on this customer, whatever our row says -- send
    // them to manage it, not to a second subscription.
    if (await customerHasLiveSubscription(customerId) === true) {
      return json({ error: "You already have a subscription.", alreadySubscribed: true }, cors, 409);
    }
    // One open checkout at a time: this new one replaces any other.
    await expireOpenCheckouts(customerId);
  }

  // No trial here any more. Every account has Pro free for its first
  // 60 days (the reverse trial, public.is_subscriber()), so a
  // subscription bought through checkout starts paying the day it is
  // bought. trial_period_days is deliberately gone.

  const sessionParams: Record<string, unknown> = {
    mode: "subscription",
    customer: customerId,
    line_items: [{ price, quantity: 1 }],
    // Both, deliberately. client_reference_id is what
    // checkout.session.completed carries; the subscription metadata is
    // what every LATER subscription event carries. Without the second,
    // a renewal two years from now can only be traced back through the
    // customer id.
    client_reference_id: user!.id,
    subscription_data: {
      metadata: { user_id: user!.id },
    },
    // ⚠️ THE LINE THAT MOVES THE TAX LIABILITY. ⚠️
    //
    // Managed Payments is enabled PER SESSION, not on the account. Leave
    // this out and the session is an ordinary Stripe payment: we are the
    // merchant of record, and the sales tax on every web sale is ours to
    // register for, collect and remit -- while the dashboard still shows
    // Managed Payments switched on, because the account-level setting is
    // about availability, not about this transaction.
    //
    // With it, Stripe is the seller of record and carries the tax, the
    // fraud and the disputes, for the 3.5% add-on. That is the whole
    // reason the web rail exists in this shape rather than being
    // abandoned in favour of Play-only.
    //
    // Nothing fails loudly if this is removed. That is exactly why it is
    // commented this heavily.
    managed_payments: { enabled: true },
    // A card, always: the subscription charges from the day it starts.
    payment_method_collection: "always",
    allow_promotion_codes: true,
    success_url: `${APP_HOME}/?checkout=success`,
    cancel_url: `${APP_HOME}/?checkout=cancelled`,
  };

  let session = await stripeRequest("/checkout/sessions",
    currency ? { ...sessionParams, currency } : sessionParams);
  // CAD refused -- a price without its CAD option, or a customer Stripe
  // will not bill in CAD. A checkout in Stripe's own choice of currency
  // beats no checkout: the page shows the real amount before anyone
  // pays. Logged loudly, because it means the screen and the charge no
  // longer match for this bowler.
  if (!session?.url && currency) {
    console.error(`checkout in ${currency} failed; retrying without a currency. Check the CAD option on both Stripe prices.`);
    session = await stripeRequest("/checkout/sessions", sessionParams);
  }

  if (!session?.url) {
    console.error("checkout session had no url");
    return json({ error: "Could not start checkout." }, cors, 500);
  }

  // The customer id is stored now rather than waiting for the webhook,
  // so an abandoned checkout still reuses this customer next time
  // instead of creating another one.
  //
  // Nothing about plan or status is written here. Opening a checkout
  // page is not paying for anything, and the only thing allowed to say
  // somebody has paid is the webhook.
  const { error: upsertErr } = await admin
    .from("entitlements")
    .upsert({ user_id: user!.id, stripe_customer_id: customerId }, { onConflict: "user_id" });
  if (upsertErr) console.error("storing stripe_customer_id failed:", upsertErr.message);

  return json({ url: session.url, trialing: false }, cors);
});
