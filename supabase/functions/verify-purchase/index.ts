// Supabase Edge Function: verify-purchase
//
// A bowler has just paid. This is what makes that true in our database.
//
// The app buys through @capgo/native-purchases and comes away with a
// purchase token. It sends that token here. This function asks GOOGLE
// what the token actually is, maps the answer through
// _shared/play.ts, and writes the entitlements row under service_role.
//
// THE CLIENT NEVER SAYS WHAT IT BOUGHT. It hands over an opaque token
// and nothing else that is trusted. A client that could assert "I am
// plus" is a client that will, because the anon key ships inside every
// copy of the app.
//
// ── Why this exists when play-rtdn also writes the row ──────────────
//
// Google's real-time developer notification is the durable path, but it
// is asynchronous and can take a moment. A bowler who has just been
// charged and is still looking at the screen should not be told they are
// on the free plan. So: this writes immediately on the way back from the
// purchase, and play-rtdn writes again for every later change. Both do
// the SAME thing -- fetch the purchase, map the state, write the row --
// so whichever arrives second simply writes the same truth again.
//
// ── Acknowledgement is not optional ─────────────────────────────────
//
// Google requires an initial subscription purchase to be acknowledged
// within THREE DAYS. Miss it and the bowler is automatically refunded
// and the purchase revoked -- silently, as far as our logs are
// concerned. Renewals do not need it; initial purchases and
// resubscriptions after expiry do.
//
// It is done here, server-side, rather than left to the client: a client
// that acknowledges is a client that can be closed, lose signal, or be
// killed by the OS between paying and acknowledging, and the bowler gets
// their money back three days later without either of us noticing.
//
// Deploy with: supabase functions deploy verify-purchase
// Secrets required:
//   PLAY_PACKAGE_NAME          the applicationId from capacitor.config.ts
//   PLAY_SERVICE_ACCOUNT_JSON  the whole service-account key JSON, as one
//                              string. Needs the Android Publisher role
//                              and the Play Console link.
//   ALLOWED_ORIGINS            same list as the other functions
//
// The first two are read in _shared/playApi.ts, which is where the
// Google client lives -- shared with play-rtdn so the two cannot drift.
//
// ⚠️ NONE OF THESE EXIST YET. ⚠️ There is no Play Console, so this
// function cannot succeed. It fails with a clear 503 rather than a stack
// trace -- see configured() below.

import { createClient } from "jsr:@supabase/supabase-js@2";
import { entitlementFromPlayPurchase } from "../_shared/play.ts";
// The Google client, shared with play-rtdn so the two cannot drift.
import { configured, fetchPurchase, acknowledge } from "../_shared/playApi.ts";
import { shouldApply } from "../_shared/railGuard.ts";

// Takes its CORS headers as an argument rather than reading a
// module-level constant -- see analyze-performance for the
// ReferenceError this shape prevents.
function json(body: unknown, cors: Record<string, string>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

// Shared-secret origin list, same as the other functions. An
// unconfigured deploy falls back to "*" deliberately, so a missing
// secret degrades to working rather than to every request rejected.
function corsFor(req: Request) {
  // Named allowedOrigins, not configured: configured() is now imported
  // from _shared/playApi.ts, and a local of the same name would shadow
  // it inside this function. Harmless today, a silent trap the first
  // time somebody reaches for it here.
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

// Fails SAFE, not open -- see analyze-performance for why both failure
// paths returning true made every signed-in account unlimited.
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

// ── The handler ─────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  const cors = corsFor(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, cors, 405);

  const { user, response } = await requireUser(req, cors);
  if (response) return response;

  // Twenty an hour. Generous for a bowler retrying a flaky purchase,
  // mean enough that a loop cannot be used to probe tokens against
  // Google on our service account's quota.
  const ok = await withinRateLimit(req, "verify-purchase", 20, "1 hour", user!.id, 3_600_000);
  if (!ok) return json({ error: "Too many attempts. Try again shortly." }, cors, 429);

  if (!configured()) {
    // Deliberately explicit. The alternative is a 500 that looks like a
    // bug in the app when it is actually an unconfigured deploy.
    console.error("verify-purchase is not configured: PLAY_PACKAGE_NAME and/or PLAY_SERVICE_ACCOUNT_JSON missing");
    return json({ error: "Purchases are not available yet." }, cors, 503);
  }

  let body: { purchaseToken?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Bad request" }, cors, 400);
  }

  const token = typeof body?.purchaseToken === "string" ? body.purchaseToken.trim() : "";
  // An upper bound so a megabyte of junk is rejected before it becomes a
  // URL. Play tokens are a few hundred characters.
  if (!token || token.length > 2000) return json({ error: "Bad request" }, cors, 400);

  const purchase = await fetchPurchase(token);
  if (!purchase) return json({ error: "That purchase could not be verified." }, cors, 402);

  const row = entitlementFromPlayPurchase(purchase, { purchaseToken: token });

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  // ONE TOKEN, ONE ACCOUNT.
  //
  // Without this, a token could be replayed from a second account and
  // both would read as subscribed -- one payment, two subscriptions,
  // repeatable for as many accounts as somebody cares to make. There is
  // a partial unique index on play_purchase_token, so the database would
  // refuse the second write anyway; this turns that into an answer the
  // app can show rather than a 500.
  const { data: owner, error: ownerErr } = await admin
    .from("entitlements")
    .select("user_id")
    .eq("play_purchase_token", token)
    .maybeSingle();
  if (ownerErr) {
    console.error("owner lookup failed:", ownerErr.message);
    return json({ error: "Could not verify that purchase." }, cors, 500);
  }
  if (owner && owner.user_id !== user!.id) {
    console.error("purchase token already belongs to another account");
    return json({ error: "That purchase is already linked to another account." }, cors, 409);
  }

  // An upgrade or a resubscribe carries the token it replaces. Leaving
  // the old one on a row means the unique index blocks a future write,
  // and a stale token sitting in the table looks like a live
  // subscription to anybody reading the row by eye.
  const linked = typeof purchase.linkedPurchaseToken === "string" ? purchase.linkedPurchaseToken : "";
  if (linked && linked !== token) {
    const { error: clearErr } = await admin
      .from("entitlements")
      .update({ play_purchase_token: null })
      .eq("play_purchase_token", linked);
    if (clearErr) console.error("clearing linked purchase token failed:", clearErr.message);
  }

  // A purchase that is not (or no longer) active must not overwrite a
  // row that is entitled through a web subscription.
  const { data: mine } = await admin
    .from("entitlements")
    .select("plan,status,current_period_end,source,stripe_subscription_id,play_purchase_token")
    .eq("user_id", user!.id)
    .maybeSingle();
  if (!shouldApply(mine, row)) {
    return json({ ok: true, plan: mine?.plan, status: mine?.status, current_period_end: mine?.current_period_end, keptOtherSubscription: true }, cors);
  }

  const { error: writeErr } = await admin
    .from("entitlements")
    .upsert({ user_id: user!.id, ...row }, { onConflict: "user_id" });
  if (writeErr) {
    console.error("entitlement write failed:", writeErr.message);
    return json({ error: "Could not record that purchase." }, cors, 500);
  }

  // After the row is written, never before. If acknowledgement ran first
  // and the write then failed, Google would believe the bowler has been
  // given what they paid for while our database says they have not.
  //
  // Driven off Google's own acknowledgementState so renewals -- which do
  // not need acknowledging -- do not generate a pointless call each time.
  if (purchase.acknowledgementState === "ACKNOWLEDGEMENT_STATE_PENDING") {
    const productId = purchase.lineItems?.find(li => li?.productId)?.productId || "";
    await acknowledge(productId, token);
  }

  // The app re-reads its entitlement from the database rather than
  // trusting this body. Returned anyway so the screen can settle
  // immediately without waiting for that round trip.
  return json({
    ok: true,
    plan: row.plan,
    status: row.status,
    billing_period: row.billing_period,
    current_period_end: row.current_period_end,
  }, cors);
});
