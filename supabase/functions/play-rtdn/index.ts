// Supabase Edge Function: play-rtdn
//
// Google telling us a subscription changed.
//
// This is the durable path. verify-purchase covers the moment a bowler
// pays, because they are standing there looking at the screen; this
// covers everything afterwards that nobody is watching -- a renewal at
// 4am, a card that failed, a cancellation from the Play Store app, a
// refund three weeks later.
//
// ── The notification is a doorbell, not a letter ────────────────────
//
// Google's own RTDN reference is explicit: a notification tells you only
// that the purchase state CHANGED, not what it changed to, and you must
// call the Developer API afterwards to find out. So notificationType is
// deliberately never mapped here. Every path does the same thing -- take
// the token, ask Google, map the answer, write the row -- which also
// means a duplicate or out-of-order delivery is harmless: it just writes
// the same truth twice.
//
// ── This endpoint is PUBLIC ─────────────────────────────────────────
//
// Google posts here with no Supabase session, so it must be deployed
// with JWT verification OFF:
//
//   supabase functions deploy play-rtdn --no-verify-jwt
//
// Which means proving the caller is Google is this function's main job,
// and it is done properly: Pub/Sub signs each push with an OIDC token,
// and every part of that token is checked below -- signature against
// Google's published keys, issuer, audience, expiry, and the exact
// service account allowed to call. A shared secret in the query string
// would have been less code and is what most guides suggest; it also
// leaks into logs and cannot be rotated without downtime.
//
// Deploy with: supabase functions deploy play-rtdn --no-verify-jwt
// Secrets required:
//   PLAY_PACKAGE_NAME             applicationId from capacitor.config.ts
//   PLAY_SERVICE_ACCOUNT_JSON     service-account key JSON
//   PLAY_PUBSUB_AUDIENCE          the audience configured on the Pub/Sub
//                                 push subscription -- normally this
//                                 function's own URL
//   PLAY_PUBSUB_SERVICE_ACCOUNT   the service account Pub/Sub pushes as,
//                                 e.g. play-rtdn@<project>.iam.gserviceaccount.com
//
// ⚠️ NONE OF THESE EXIST YET. ⚠️ Unconfigured, this refuses everything
// rather than trusting anything.

import { createClient } from "jsr:@supabase/supabase-js@2";
import { entitlementFromPlayPurchase } from "../_shared/play.ts";
import { configured, fetchPurchase, acknowledge } from "../_shared/playApi.ts";

const PUBSUB_AUDIENCE = Deno.env.get("PLAY_PUBSUB_AUDIENCE")?.trim() || "";
const PUBSUB_SERVICE_ACCOUNT = Deno.env.get("PLAY_PUBSUB_SERVICE_ACCOUNT")?.trim() || "";
const GOOGLE_JWKS_URL = "https://www.googleapis.com/oauth2/v3/certs";
const GOOGLE_ISSUERS = ["https://accounts.google.com", "accounts.google.com"];

// ── Proving it is Google ────────────────────────────────────────────

interface Jwk {
  kid?: string;
  kty?: string;
  alg?: string;
  use?: string;
  n?: string;
  e?: string;
}

// Google rotates these. Cached for an hour, and re-fetched on a kid we
// do not recognise -- which is exactly what a rotation looks like, and
// would otherwise reject every notification until the cache expired.
let jwksCache: { keys: Jwk[]; fetchedAt: number } | null = null;

async function googleKeys(force = false): Promise<Jwk[]> {
  const now = Date.now();
  if (!force && jwksCache && now - jwksCache.fetchedAt < 3_600_000) return jwksCache.keys;
  try {
    const res = await fetch(GOOGLE_JWKS_URL);
    if (!res.ok) {
      console.error("google jwks fetch failed:", res.status);
      return jwksCache?.keys || [];
    }
    const body = await res.json();
    const keys = Array.isArray(body?.keys) ? body.keys as Jwk[] : [];
    if (keys.length) jwksCache = { keys, fetchedAt: now };
    return keys;
  } catch (e) {
    console.error("google jwks fetch threw:", String(e));
    return jwksCache?.keys || [];
  }
}

function b64urlToBytes(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const raw = atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

function decodeSegment(seg: string): Record<string, unknown> | null {
  try {
    return JSON.parse(new TextDecoder().decode(b64urlToBytes(seg)));
  } catch {
    return null;
  }
}

// Returns true only if every check passes. There is no partial credit
// here: this is the only thing standing between a public URL and our
// entitlements table.
async function isFromGoogle(req: Request): Promise<boolean> {
  if (!PUBSUB_AUDIENCE || !PUBSUB_SERVICE_ACCOUNT) {
    console.error("play-rtdn is not configured: PLAY_PUBSUB_AUDIENCE and/or PLAY_PUBSUB_SERVICE_ACCOUNT missing");
    return false;
  }
  const auth = req.headers.get("Authorization") || "";
  const jwt = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!jwt) return false;

  const parts = jwt.split(".");
  if (parts.length !== 3) return false;
  const [headerSeg, payloadSeg, sigSeg] = parts;

  const header = decodeSegment(headerSeg);
  const payload = decodeSegment(payloadSeg);
  if (!header || !payload) return false;

  // RS256 only. Accepting whatever the token names is how "alg: none"
  // and HMAC-with-the-public-key forgeries get in.
  if (header.alg !== "RS256") return false;

  let keys = await googleKeys();
  let jwk = keys.find(k => k.kid === header.kid);
  if (!jwk) {
    // Unknown kid: most likely a rotation, so try once with a fresh
    // fetch before rejecting.
    keys = await googleKeys(true);
    jwk = keys.find(k => k.kid === header.kid);
  }
  if (!jwk || jwk.kty !== "RSA" || !jwk.n || !jwk.e) return false;

  let verified = false;
  try {
    const key = await crypto.subtle.importKey(
      "jwk",
      { kty: "RSA", n: jwk.n, e: jwk.e, alg: "RS256", ext: true },
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"],
    );
    verified = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      key,
      b64urlToBytes(sigSeg),
      new TextEncoder().encode(`${headerSeg}.${payloadSeg}`),
    );
  } catch (e) {
    console.error("oidc signature check threw:", String(e));
    return false;
  }
  if (!verified) return false;

  // A valid signature only proves Google minted it. These prove it was
  // minted FOR US, by the account we expect -- without them, any Google
  // OIDC token from any project would be accepted.
  const nowSec = Math.floor(Date.now() / 1000);
  const exp = Number(payload.exp);
  if (!Number.isFinite(exp) || exp <= nowSec) return false;
  if (!GOOGLE_ISSUERS.includes(String(payload.iss))) return false;
  if (String(payload.aud) !== PUBSUB_AUDIENCE) return false;
  if (String(payload.email) !== PUBSUB_SERVICE_ACCOUNT) return false;
  if (payload.email_verified !== true && payload.email_verified !== "true") return false;

  return true;
}

// ── The notification ────────────────────────────────────────────────

interface DeveloperNotification {
  version?: string;
  packageName?: string;
  eventTimeMillis?: string;
  subscriptionNotification?: { notificationType?: number; purchaseToken?: string };
  voidedPurchaseNotification?: { purchaseToken?: string; orderId?: string; productType?: number; refundType?: number };
  oneTimeProductNotification?: { purchaseToken?: string; sku?: string };
  testNotification?: { version?: string };
}

// 200 for anything we have finished with, whether or not we changed
// something. Pub/Sub retries on any non-2xx, and retrying a notification
// we have deliberately ignored just means receiving it again every few
// minutes for a week.
//
// 500 is reserved for genuinely transient failures where a retry is the
// right answer -- Google unreachable, a database write that failed.
function ok(body: Record<string, unknown> = { ok: true }) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

function admin() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );
}

Deno.serve(async (req: Request) => {
  // No CORS block: no browser calls this, and advertising it to one
  // would be advertising it to everyone.
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  if (!(await isFromGoogle(req))) {
    // 401 with no detail. Telling an unauthenticated caller WHICH check
    // failed is telling them how to pass it.
    return new Response("Unauthorized", { status: 401 });
  }

  if (!configured()) {
    console.error("play-rtdn cannot act: PLAY_PACKAGE_NAME and/or PLAY_SERVICE_ACCOUNT_JSON missing");
    // 500, not 200: this is our misconfiguration and the notification is
    // worth redelivering once it is fixed.
    return new Response("Not configured", { status: 500 });
  }

  let envelope: { message?: { data?: string; messageId?: string } };
  try {
    envelope = await req.json();
  } catch {
    // Malformed and never going to parse. Acknowledge it so it stops.
    console.error("rtdn envelope was not JSON");
    return ok({ ok: false, reason: "bad envelope" });
  }

  const messageId = typeof envelope?.message?.messageId === "string" ? envelope.message.messageId : "";
  const data = typeof envelope?.message?.data === "string" ? envelope.message.data : "";
  if (!data) return ok({ ok: false, reason: "no data" });

  let notification: DeveloperNotification;
  try {
    notification = JSON.parse(new TextDecoder().decode(b64urlToBytes(data)));
  } catch (e) {
    console.error("rtdn payload did not decode:", String(e));
    return ok({ ok: false, reason: "bad payload" });
  }

  const db = admin();

  // An audit trail, and the record of what we have already seen.
  // subscription_events has a unique index on (source, event_id), so a
  // redelivery lands on the same row rather than making a second one.
  //
  // NOT a guard, though: processing IS idempotent -- every path re-reads
  // the truth from Google -- so a duplicate is recorded and the work is
  // done anyway. Treating one as "already handled" would skip a
  // notification whose first delivery failed halfway through, which is
  // precisely the delivery worth redoing.
  //
  // event_time is NOT NULL with no default, so it must be supplied.
  // Google sends eventTimeMillis as a STRING of milliseconds; anything
  // unreadable falls back to now rather than failing the insert, because
  // losing the audit row is worse than an approximate timestamp on it.
  const eventMs = Number(notification.eventTimeMillis);
  const eventTime = Number.isFinite(eventMs) && eventMs > 0
    ? new Date(eventMs).toISOString()
    : new Date().toISOString();
  const eventType = notification.subscriptionNotification
    ? `subscription:${notification.subscriptionNotification.notificationType ?? "?"}`
    : notification.voidedPurchaseNotification
      ? "voided"
      : notification.testNotification
        ? "test"
        : "other";

  // applied stays false until the entitlement write actually succeeds --
  // that is the column's whole job. A row sitting at applied = false is
  // a notification we accepted and did not act on, which is the first
  // thing worth looking at when somebody says they paid and it did not
  // take.
  let eventRowId: string | null = null;
  if (messageId) {
    const { data: ev, error } = await db
      .from("subscription_events")
      .upsert(
        { source: "play", event_id: messageId, event_type: eventType, event_time: eventTime },
        { onConflict: "source,event_id" },
      )
      .select("id")
      .maybeSingle();
    if (error) console.error("subscription_events upsert failed:", error.message);
    else eventRowId = ev?.id ?? null;
  }

  // Marks the audit row done, once the entitlement really changed.
  // Best-effort: the bowler's access is already correct by this point,
  // and failing the request over a bookkeeping update would make
  // Pub/Sub redeliver work that is finished.
  async function markApplied(userId: string | null) {
    if (!eventRowId) return;
    const { error } = await db
      .from("subscription_events")
      .update({ applied: true, user_id: userId })
      .eq("id", eventRowId);
    if (error) console.error("marking event applied failed:", error.message);
  }

  // Google sends this from the Play Console to prove the pipe works. It
  // carries no purchase and means nothing about any bowler.
  if (notification.testNotification) {
    console.log("rtdn test notification received");
    // Applied, with no user: it was handled completely, and there was
    // never a bowler for it to be about.
    await markApplied(null);
    return ok({ ok: true, test: true });
  }

  // A refund or chargeback. The purchase is gone, and the subscriptions
  // API may no longer return anything useful for the token -- so this
  // does not go through the usual fetch-and-map path. It revokes
  // directly, which is the one place in this file that writes a status
  // without asking Google first, and is safe because "voided" is not a
  // state that can be reversed by a later notification.
  if (notification.voidedPurchaseNotification) {
    const token = notification.voidedPurchaseNotification.purchaseToken || "";
    if (!token) return ok({ ok: false, reason: "voided without token" });
    const { data: revoked, error } = await db
      .from("entitlements")
      .update({ plan: "free", status: "expired", current_period_end: null, trial_end: null })
      .eq("play_purchase_token", token)
      .select("user_id");
    if (error) {
      console.error("revoking voided purchase failed:", error.message);
      return new Response("Write failed", { status: 500 });
    }
    // No matching row is not a failure: a refund for a purchase we never
    // recorded has nothing to revoke. Recorded as applied either way, so
    // it does not sit in the audit trail looking unhandled.
    console.log(`revoked a voided purchase (${revoked?.length ?? 0} row(s))`);
    await markApplied(revoked?.[0]?.user_id ?? null);
    return ok({ ok: true, voided: true });
  }

  const sub = notification.subscriptionNotification;
  if (!sub?.purchaseToken) {
    // A one-time product notification, or something new. We sell one
    // subscription and nothing else, so there is nothing to do and
    // nothing to retry.
    return ok({ ok: true, ignored: true });
  }
  const token = sub.purchaseToken;

  // Whose is it? The row written by verify-purchase carries the token.
  //
  // Nobody matching is normal, not an error: the notification for a
  // brand-new purchase can beat the app's own verify-purchase call. A
  // 500 here would make Pub/Sub retry, and the retry usually finds the
  // row -- but so does the NEXT notification, and retrying a token we
  // genuinely do not own would go on for a week.
  const { data: rows, error: lookupErr } = await db
    .from("entitlements")
    .select("user_id")
    .eq("play_purchase_token", token)
    .limit(1);
  if (lookupErr) {
    console.error("entitlement lookup failed:", lookupErr.message);
    return new Response("Lookup failed", { status: 500 });
  }
  const userId = rows?.[0]?.user_id;
  if (!userId) {
    console.log("rtdn for a token we do not have a row for yet");
    return ok({ ok: true, unknownToken: true });
  }

  const purchase = await fetchPurchase(token);
  if (!purchase) {
    // Google was unreachable or refused. Worth a retry -- this is the
    // one failure here that a later attempt genuinely fixes.
    return new Response("Lookup failed", { status: 500 });
  }

  const row = entitlementFromPlayPurchase(purchase);
  const { error: writeErr } = await db
    .from("entitlements")
    .update(row)
    .eq("user_id", userId);
  if (writeErr) {
    console.error("entitlement write failed:", writeErr.message);
    return new Response("Write failed", { status: 500 });
  }

  // A resubscription after expiry needs acknowledging just like a first
  // purchase, and this is the path that sees it -- the app never calls
  // verify-purchase for a renewal.
  if (purchase.acknowledgementState === "ACKNOWLEDGEMENT_STATE_PENDING") {
    const productId = purchase.lineItems?.find(li => li?.productId)?.productId || "";
    await acknowledge(productId, token);
  }

  await markApplied(userId);
  return ok({ ok: true, status: row.status });
});
