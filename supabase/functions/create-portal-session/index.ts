// Supabase Edge Function: create-portal-session
//
// Opens Stripe's hosted Customer Portal so a bowler can update their card
// or cancel, without us building any of that UI ourselves. The portal's
// own behaviour (cancel at period end, no proration) is configured once
// in the Stripe dashboard under Settings -> Billing -> Customer portal,
// not here -- this function's only job is to hand back a portal URL for
// the bowler who is asking.
//
// Deploy with: supabase functions deploy create-portal-session
// Secrets required: same as create-checkout
//   STRIPE_SECRET_KEY, APP_URL, ALLOWED_ORIGINS
//
// ⚠️ Depends on the Customer portal being configured in Stripe first --
// an unconfigured portal returns an error from Stripe, surfaced below as
// "Could not open the subscription manager." ⚠️

import { createClient } from "jsr:@supabase/supabase-js@2";
import { stripeConfigured, stripeRequest } from "../_shared/stripeApi.ts";

const APP_URL = Deno.env.get("APP_URL")?.trim().replace(/\/+$/, "") || "";

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

Deno.serve(async (req: Request) => {
  const cors = corsFor(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, cors, 405);

  const { user, response } = await requireUser(req, cors);
  if (response) return response;

  if (!stripeConfigured() || !APP_URL) {
    console.error("create-portal-session is not configured: STRIPE_SECRET_KEY and/or APP_URL missing");
    return json({ error: "Subscription management is not available yet." }, cors, 503);
  }

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  const { data: row, error: readErr } = await admin
    .from("entitlements")
    .select("stripe_customer_id")
    .eq("user_id", user!.id)
    .maybeSingle();
  if (readErr) {
    console.error("entitlement read failed:", readErr.message);
    return json({ error: "Could not open the subscription manager." }, cors, 500);
  }

  const customerId = typeof row?.stripe_customer_id === "string" ? row.stripe_customer_id : "";
  if (!customerId) {
    // Never checked out through Stripe -- either on the Play rail, or
    // never subscribed at all. Nothing to manage here.
    return json({ error: "No Stripe subscription found for this account." }, cors, 404);
  }

  const session = await stripeRequest("/billing_portal/sessions", {
    customer: customerId,
    // /app/, not the root: the root is the public welcome page.
    return_url: `${APP_URL}/app/`,
  });

  if (!session?.url) {
    console.error("portal session had no url");
    return json({ error: "Could not open the subscription manager." }, cors, 500);
  }

  return json({ url: session.url }, cors);
});
