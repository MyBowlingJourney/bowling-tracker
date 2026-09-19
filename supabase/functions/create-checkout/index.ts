// Supabase Edge Function: create-checkout
//
// The web rail. Opens a Stripe Checkout session and hands back its URL.
//
// Play covers bowlers inside the Android app. This covers everybody
// else, and "everybody else" is not a rounding error: an iPhone bowler
// cannot install the Android app at all, so without this they have no
// way to pay at all.
//
// ── The trial runs from SIGN-UP, not from checkout ──────────────────
//
// The decision was 30 days from the day they created an account, so
// somebody who downloads the app in May and does nothing until September
// does not get a fresh month in September. That means the trial left is
// computed from their auth account's created_at and passed to Stripe as
// an explicit trial_end, rather than as trial_period_days -- which would
// restart the clock at checkout.
//
// Stripe requires trial_end to be at least 48 hours out. Less than that
// left and the subscription simply starts paid, which is the honest
// outcome: their trial is over.
//
// Deploy with: supabase functions deploy create-checkout
// Secrets required:
//   STRIPE_SECRET_KEY      sk_live_... or sk_test_...
//   STRIPE_PRICE_MONTHLY   price_... from the Stripe dashboard
//   STRIPE_PRICE_YEARLY    price_...
//   APP_URL                where to send them back to, e.g.
//                          https://mybowlingjourney.com
//   ALLOWED_ORIGINS        same list as the other functions
//
// ⚠️ NONE OF THESE EXIST YET. ⚠️ Unconfigured it returns 503.

import { createClient } from "jsr:@supabase/supabase-js@2";
import { stripeConfigured, stripeRequest, PRICE_MONTHLY, PRICE_YEARLY } from "../_shared/stripeApi.ts";

const APP_URL = Deno.env.get("APP_URL")?.trim().replace(/\/+$/, "") || "";
const TRIAL_DAYS = 30;
// Stripe's own floor. A trial_end closer than this is rejected outright,
// so it is treated as no trial rather than as an error the bowler sees.
const MIN_TRIAL_SECONDS = 48 * 3600;

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

  let body: { period?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Bad request" }, cors, 400);
  }

  // An explicit allowlist, not a lookup. The period decides which price
  // is charged, and it arrives from the browser.
  const period = body?.period === "year" ? "year" : body?.period === "month" ? "month" : "";
  if (!period) return json({ error: "Bad request" }, cors, 400);
  const price = period === "year" ? PRICE_YEARLY : PRICE_MONTHLY;

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
    .select("stripe_customer_id,status,plan")
    .eq("user_id", user!.id)
    .maybeSingle();
  if (readErr) {
    console.error("entitlement read failed:", readErr.message);
    return json({ error: "Could not start checkout." }, cors, 500);
  }

  // Already paying. Sending them to checkout again would charge them
  // twice for the same thing.
  if (existing && existing.plan === "plus"
      && ["active", "trialing", "grace"].includes(String(existing.status))) {
    return json({ error: "You already have a subscription.", alreadySubscribed: true }, cors, 409);
  }

  let customerId = typeof existing?.stripe_customer_id === "string" ? existing.stripe_customer_id : "";
  if (!customerId) {
    const customer = await stripeRequest("/customers", {
      email: user!.email || undefined,
      // So a human looking at the Stripe dashboard can tell who this is
      // without a database query.
      metadata: { user_id: user!.id },
    });
    if (!customer?.id) return json({ error: "Could not start checkout." }, cors, 500);
    customerId = String(customer.id);
  }

  // What is left of their 30 days, measured from the day the account was
  // created -- not from today.
  const createdMs = Date.parse(String(user!.created_at || ""));
  const trialEndsMs = Number.isFinite(createdMs) ? createdMs + TRIAL_DAYS * 86_400_000 : 0;
  const trialEndSec = Math.floor(trialEndsMs / 1000);
  const nowSec = Math.floor(Date.now() / 1000);
  const useTrial = trialEndSec - nowSec >= MIN_TRIAL_SECONDS;

  const session = await stripeRequest("/checkout/sessions", {
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
      ...(useTrial ? { trial_end: trialEndSec } : {}),
    },
    // A card is taken even during the trial, because the trial converts
    // on its own and cannot convert without one.
    payment_method_collection: "always",
    allow_promotion_codes: true,
    success_url: `${APP_URL}/?checkout=success`,
    cancel_url: `${APP_URL}/?checkout=cancelled`,
  });

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

  return json({ url: session.url, trialing: useTrial }, cors);
});
