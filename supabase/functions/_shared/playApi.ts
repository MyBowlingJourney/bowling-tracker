// Talking to Google, for both functions that have to.
//
// verify-purchase (a bowler just paid) and play-rtdn (Google says
// something changed) both need the same three things: an access token, a
// purchase looked up, and an acknowledgement sent. They must behave
// identically, so this is one file rather than two copies that drift.
//
// SEPARATE FROM play.ts ON PURPOSE. play.ts is the mapping and has no
// imports at all, which is what lets vitest load it straight out of
// supabase/ and test every subscription state in CI. This file touches
// the network and reads Deno.env, so it cannot be tested that way -- and
// putting it in play.ts would take the mapping's testability down with
// it.
//
// No googleapis library. It is large, Node-shaped, and all that is
// needed here is one RS256 signature, which crypto.subtle already does.
//
// Secrets:
//   PLAY_PACKAGE_NAME          the applicationId from capacitor.config.ts
//   PLAY_SERVICE_ACCOUNT_JSON  the whole service-account key JSON as one
//                              string, with the Android Publisher role
//
// ⚠️ NEITHER EXISTS YET. ⚠️ There is no Play Console, so configured()
// answers false and both callers refuse cleanly instead of throwing.

import type { SubscriptionPurchaseV2 } from "./play.ts";

export const PACKAGE_NAME = Deno.env.get("PLAY_PACKAGE_NAME")?.trim() || "";
const SERVICE_ACCOUNT_JSON = Deno.env.get("PLAY_SERVICE_ACCOUNT_JSON") || "";

const ANDROID_PUBLISHER = "https://androidpublisher.googleapis.com/androidpublisher/v3";
const OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/androidpublisher";

interface ServiceAccount {
  client_email: string;
  private_key: string;
}

function serviceAccount(): ServiceAccount | null {
  if (!SERVICE_ACCOUNT_JSON) return null;
  try {
    const parsed = JSON.parse(SERVICE_ACCOUNT_JSON);
    if (typeof parsed?.client_email !== "string" || typeof parsed?.private_key !== "string") {
      console.error("PLAY_SERVICE_ACCOUNT_JSON is missing client_email or private_key");
      return null;
    }
    return parsed as ServiceAccount;
  } catch (e) {
    console.error("PLAY_SERVICE_ACCOUNT_JSON is not valid JSON:", String(e));
    return null;
  }
}

export function configured(): boolean {
  return !!PACKAGE_NAME && !!serviceAccount();
}

const enc = new TextEncoder();

function b64url(bytes: Uint8Array): string {
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// The PEM body is base64 DER. Newlines in the secret may arrive as the
// two characters backslash-n rather than as actual newlines, depending
// on how the JSON was pasted -- handled both ways below, because the
// difference is invisible in a secrets UI and shows up only as "invalid
// key".
async function importPrivateKey(pem: string): Promise<CryptoKey> {
  const body = pem
    .replace(/\\n/g, "\n")
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s+/g, "");
  const raw = atob(body);
  const der = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) der[i] = raw.charCodeAt(i);
  return await crypto.subtle.importKey(
    "pkcs8",
    der,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

// One token, reused until it is nearly expired. Google's last an hour; a
// fresh one per request would be three round trips to sell one
// subscription.
let cachedToken: { value: string; expiresAt: number } | null = null;

export async function accessToken(): Promise<string | null> {
  const now = Date.now();
  // 60s of headroom, so a token cannot expire between being taken from
  // the cache and being used.
  if (cachedToken && cachedToken.expiresAt - 60_000 > now) return cachedToken.value;

  const sa = serviceAccount();
  if (!sa) return null;

  const iat = Math.floor(now / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = { iss: sa.client_email, scope: SCOPE, aud: OAUTH_TOKEN_URL, exp: iat + 3600, iat };
  const unsigned = `${b64url(enc.encode(JSON.stringify(header)))}.${b64url(enc.encode(JSON.stringify(claim)))}`;

  try {
    const key = await importPrivateKey(sa.private_key);
    const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, enc.encode(unsigned));
    const assertion = `${unsigned}.${b64url(new Uint8Array(sig))}`;

    const res = await fetch(OAUTH_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion,
      }),
    });
    if (!res.ok) {
      console.error("google token exchange failed:", res.status, (await res.text()).slice(0, 300));
      return null;
    }
    const body = await res.json();
    if (typeof body?.access_token !== "string") {
      console.error("google token exchange returned no access_token");
      return null;
    }
    const ttl = Number(body.expires_in);
    cachedToken = {
      value: body.access_token,
      expiresAt: now + (Number.isFinite(ttl) ? ttl * 1000 : 3_600_000),
    };
    return cachedToken.value;
  } catch (e) {
    console.error("google token exchange threw:", String(e));
    return null;
  }
}

// What Google says this token really is: the only source of truth about
// a purchase.
//
// Google's own RTDN reference is explicit that a notification tells you
// only that something changed, not what is now true, and that this call
// is required afterwards. Both callers therefore end up here.
export async function fetchPurchase(token: string): Promise<SubscriptionPurchaseV2 | null> {
  const access = await accessToken();
  if (!access) return null;
  const url = `${ANDROID_PUBLISHER}/applications/${encodeURIComponent(PACKAGE_NAME)}`
    + `/purchases/subscriptionsv2/tokens/${encodeURIComponent(token)}`;
  try {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${access}` } });
    if (!res.ok) {
      // 404 means Google has never heard of this token, which is what an
      // invented one looks like. A normal thing to see, not an incident.
      console.error("play purchase lookup failed:", res.status, (await res.text()).slice(0, 300));
      return null;
    }
    return await res.json() as SubscriptionPurchaseV2;
  } catch (e) {
    console.error("play purchase lookup threw:", String(e));
    return null;
  }
}

// Tell Google we have given the bowler what they paid for.
//
// Required within THREE DAYS of an initial purchase or a resubscription
// after expiry, or Google refunds the bowler and revokes the purchase.
// Renewals do not need it -- which is why callers drive this off
// acknowledgementState rather than off having just seen a purchase.
//
// Best-effort by design: a failure here must not fail the caller. The
// bowler has paid and the row is written; a missed acknowledgement is
// recoverable on the next call, and refusing them access because a
// bookkeeping call failed helps nobody.
export async function acknowledge(productId: string, token: string): Promise<void> {
  const access = await accessToken();
  if (!access || !productId) return;
  const url = `${ANDROID_PUBLISHER}/applications/${encodeURIComponent(PACKAGE_NAME)}`
    + `/purchases/subscriptions/${encodeURIComponent(productId)}`
    + `/tokens/${encodeURIComponent(token)}:acknowledge`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${access}`, "Content-Type": "application/json" },
      body: "{}",
    });
    if (!res.ok) {
      console.error("play acknowledge failed:", res.status, (await res.text()).slice(0, 300));
    }
  } catch (e) {
    console.error("play acknowledge threw:", String(e));
  }
}

// Stop a subscription renewing, WITHOUT refunding.
//
// Used when a bowler deletes their account: the subscription must not go
// on charging a person who no longer exists in our database, but they do
// not get money back for the period they already bought.
//
// cancel, NOT revoke. The two are one word apart in Google's API and
// mean opposite things financially:
//
//   cancel  stops future renewals. "The subscription remains valid until
//           its expiration time." No money moves.
//   revoke  refunds the purchase and cuts access immediately.
//
// Calling revoke here would hand back money nobody asked to have back,
// on every single deletion.
//
// The subscriptionId path segment has not been required since May 2025,
// but it is sent when known because the documented template still
// includes it.
export async function cancelSubscription(productId: string, token: string): Promise<boolean> {
  const access = await accessToken();
  if (!access || !token) return false;
  if (!productId) {
    // Without it there is no documented path to call. Logged loudly:
    // this is somebody who will keep being charged.
    console.error("cannot cancel a play subscription without a product id");
    return false;
  }
  const url = `${ANDROID_PUBLISHER}/applications/${encodeURIComponent(PACKAGE_NAME)}`
    + `/purchases/subscriptionsv2/${encodeURIComponent(productId)}`
    + `/tokens/${encodeURIComponent(token)}:cancel`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${access}`, "Content-Type": "application/json" },
      body: "{}",
    });
    if (!res.ok) {
      console.error("play cancel failed:", res.status, (await res.text()).slice(0, 300));
      return false;
    }
    return true;
  } catch (e) {
    console.error("play cancel threw:", String(e));
    return false;
  }
}
