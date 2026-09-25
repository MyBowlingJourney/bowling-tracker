// Supabase Edge Function: stripe-webhook
//
// Stripe telling us a subscription changed.
//
// The web rail's durable path, and the mirror of play-rtdn: create-
// checkout covers the moment a bowler starts paying, this covers every
// renewal, failed card, cancellation and refund afterwards that nobody
// is watching.
//
// ── This endpoint is PUBLIC ─────────────────────────────────────────
//
// Stripe posts here with no Supabase session, so it must be deployed
// with JWT verification off:
//
//   supabase functions deploy stripe-webhook --no-verify-jwt
//
// (or via the [functions.stripe-webhook] block in supabase/config.toml)
//
// So proving the caller is Stripe is this function's main job. Stripe
// signs every request; the signature is checked below by hand rather
// than with the SDK -- it is an HMAC and a timestamp, and pulling in a
// Node-shaped library for it would be the larger risk.
//
// ── The raw body matters ────────────────────────────────────────────
//
// The signature is computed over the EXACT bytes Stripe sent. Parsing
// the JSON and re-serialising it changes key order, spacing and number
// formatting, and the signature then never matches -- the single most
// common way this integration fails, and it fails looking like a wrong
// secret. req.text() first, JSON.parse second, always in that order.
//
// Deploy with: supabase functions deploy stripe-webhook --no-verify-jwt
// Secrets required:
//   STRIPE_SECRET_KEY      sk_live_... or sk_test_...
//   STRIPE_WEBHOOK_SECRET  whsec_... -- specific to THIS endpoint, and
//                          different between test and live mode
//
// ⚠️ NEITHER EXISTS YET. ⚠️

import { createClient } from "jsr:@supabase/supabase-js@2";
import { entitlementFromStripeSubscription, type StripeSubscription } from "../_shared/stripe.ts";
import { stripeConfigured, fetchSubscription, timingSafeEqual } from "../_shared/stripeApi.ts";
import { shouldApply } from "../_shared/railGuard.ts";

const WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET")?.trim() || "";
// Five minutes, which is Stripe's own recommended tolerance. It is what
// stops a signed request being captured and replayed indefinitely.
const TOLERANCE_SECONDS = 300;

// ── Proving it is Stripe ────────────────────────────────────────────

// Stripe-Signature looks like:  t=1750000000,v1=abc...,v1=def...
// More than one v1 appears while a secret is being rotated, and ANY of
// them matching is a pass -- rejecting the second would mean downtime
// during every rotation.
function parseSignature(header: string): { t: number; v1: string[] } | null {
  if (!header) return null;
  let t = 0;
  const v1: string[] = [];
  for (const part of header.split(",")) {
    const i = part.indexOf("=");
    if (i < 0) continue;
    const k = part.slice(0, i).trim();
    const v = part.slice(i + 1).trim();
    if (k === "t") t = Number(v);
    else if (k === "v1") v1.push(v);
  }
  if (!Number.isFinite(t) || t <= 0 || v1.length === 0) return null;
  return { t, v1 };
}

function toHex(buf: ArrayBuffer): string {
  const b = new Uint8Array(buf);
  let s = "";
  for (let i = 0; i < b.length; i++) s += b[i].toString(16).padStart(2, "0");
  return s;
}

async function isFromStripe(rawBody: string, sigHeader: string): Promise<boolean> {
  if (!WEBHOOK_SECRET) {
    console.error("stripe-webhook is not configured: STRIPE_WEBHOOK_SECRET missing");
    return false;
  }
  const parsed = parseSignature(sigHeader);
  if (!parsed) return false;

  // Reject anything too old to be a live delivery. Without this, a
  // request captured once is valid forever.
  const nowSec = Math.floor(Date.now() / 1000);
  if (Math.abs(nowSec - parsed.t) > TOLERANCE_SECONDS) {
    console.error("stripe signature timestamp outside tolerance");
    return false;
  }

  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(WEBHOOK_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    // The signed payload is timestamp, a literal full stop, then the
    // raw body. Exactly these bytes.
    const mac = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(`${parsed.t}.${rawBody}`),
    );
    const expected = toHex(mac);
    return parsed.v1.some(sig => timingSafeEqual(sig, expected));
  } catch (e) {
    console.error("stripe signature check threw:", String(e));
    return false;
  }
}

// ── Handling it ─────────────────────────────────────────────────────

interface StripeEvent {
  id?: string;
  type?: string;
  created?: number;
  data?: { object?: Record<string, unknown> };
}

// 200 for anything finished with, including events deliberately
// ignored. Stripe retries a non-2xx for up to three days, and retrying
// an event we have chosen not to act on achieves nothing but noise.
//
// 500 is kept for failures a retry genuinely fixes.
function ok(body: Record<string, unknown> = { received: true }) {
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

// The events that change whether somebody has paid. Everything else
// Stripe sends -- invoices, payment intents, customer updates -- is
// noise for our purposes, because all of it ends in one of these.
const SUBSCRIPTION_EVENTS = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "customer.subscription.paused",
  "customer.subscription.resumed",
  "customer.subscription.trial_will_end",
]);

Deno.serve(async (req: Request) => {
  // No CORS block: no browser calls this, and advertising it to one
  // would be advertising it to everyone.
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  // RAW FIRST. See the header -- parsing before verifying breaks the
  // signature in a way that looks like a wrong secret.
  const raw = await req.text();
  const sigHeader = req.headers.get("Stripe-Signature") || "";

  if (!(await isFromStripe(raw, sigHeader))) {
    // No detail. Telling an unauthenticated caller which check failed is
    // telling them how to pass it.
    return new Response("Unauthorized", { status: 401 });
  }

  if (!stripeConfigured()) {
    console.error("stripe-webhook cannot act: STRIPE_SECRET_KEY missing");
    // 500, not 200: ours to fix, and the event is worth redelivering.
    return new Response("Not configured", { status: 500 });
  }

  let event: StripeEvent;
  try {
    event = JSON.parse(raw);
  } catch {
    console.error("stripe event was not JSON");
    return ok({ received: true, reason: "bad payload" });
  }

  const db = admin();
  const eventId = typeof event.id === "string" ? event.id : "";
  const eventType = typeof event.type === "string" ? event.type : "unknown";
  // event.created is unix seconds. event_time is NOT NULL with no
  // default, so something must always be supplied.
  const eventTime = typeof event.created === "number" && event.created > 0
    ? new Date(event.created * 1000).toISOString()
    : new Date().toISOString();

  // The audit trail. Unique on (source, event_id), so a redelivery lands
  // on the same row. NOT used as a guard: processing re-reads the truth
  // from Stripe and is idempotent, and treating a duplicate as handled
  // would skip an event whose first delivery failed halfway through.
  let eventRowId: string | null = null;
  if (eventId) {
    const { data: ev, error } = await db
      .from("subscription_events")
      .upsert(
        { source: "stripe", event_id: eventId, event_type: eventType, event_time: eventTime },
        { onConflict: "source,event_id" },
      )
      .select("id")
      .maybeSingle();
    if (error) console.error("subscription_events upsert failed:", error.message);
    else eventRowId = ev?.id ?? null;
  }

  async function markApplied(userId: string | null) {
    if (!eventRowId) return;
    const { error } = await db
      .from("subscription_events")
      .update({ applied: true, user_id: userId })
      .eq("id", eventRowId);
    if (error) console.error("marking event applied failed:", error.message);
  }

  if (!SUBSCRIPTION_EVENTS.has(eventType)) {
    // Recorded, not acted on. Worth keeping in the trail so that "we
    // never heard about it" and "we heard and ignored it" stay
    // different answers.
    return ok({ received: true, ignored: true });
  }

  const object = event.data?.object || {};

  // Which subscription, and whose.
  //
  // checkout.session.completed carries the session, not the
  // subscription -- so the id is read off it and the subscription
  // fetched. Every customer.subscription.* event IS the subscription
  // already, but it is re-fetched anyway, for the same reason play-rtdn
  // re-fetches: the object in an event is a snapshot from when it was
  // queued, and events do not arrive in order.
  const isSession = eventType === "checkout.session.completed";
  const subscriptionId = isSession
    ? (typeof object.subscription === "string" ? object.subscription : "")
    : (typeof object.id === "string" ? object.id : "");

  if (!subscriptionId) {
    // A checkout that was not for a subscription. Nothing we sell.
    return ok({ received: true, ignored: true });
  }

  const fresh = await fetchSubscription(subscriptionId) as StripeSubscription | null;
  if (!fresh) {
    // Stripe unreachable or refused. The one failure here a retry fixes.
    return new Response("Lookup failed", { status: 500 });
  }

  // Whose is it? Three routes, most reliable first:
  //   1. the subscription's own metadata, set at checkout -- survives
  //      forever and is on every later event
  //   2. the session's client_reference_id, on the first event only
  //   3. the customer id already stored on the row
  const meta = (fresh as unknown as { metadata?: Record<string, unknown> }).metadata || {};
  let userId = typeof meta.user_id === "string" ? meta.user_id : "";
  if (!userId && isSession && typeof object.client_reference_id === "string") {
    userId = object.client_reference_id;
  }
  if (!userId) {
    const customerId = typeof fresh.customer === "string" ? fresh.customer : "";
    if (customerId) {
      const { data: rows, error } = await db
        .from("entitlements")
        .select("user_id")
        .eq("stripe_customer_id", customerId)
        .limit(1);
      if (error) {
        console.error("customer lookup failed:", error.message);
        return new Response("Lookup failed", { status: 500 });
      }
      userId = rows?.[0]?.user_id || "";
    }
  }

  if (!userId) {
    // Nobody to apply it to. Not retryable -- the answer will not change
    // on the fourth delivery -- so it is recorded and acknowledged.
    console.error("stripe event for a subscription we cannot trace to a bowler");
    return ok({ received: true, unknownUser: true });
  }

  const row = entitlementFromStripeSubscription(fresh);

  // A second subscription (an old checkout tab finished later) ending, or
  // a web subscription lapsing while Play pays, must not take away access
  // another subscription is paying for.
  {
    const { data: current } = await db
      .from("entitlements")
      .select("plan,status,current_period_end,source,stripe_subscription_id,play_purchase_token")
      .eq("user_id", userId)
      .maybeSingle();
    if (!shouldApply(current, row)) {
      console.log("stripe event not applied: the bowler is entitled through another subscription");
      await markApplied(userId);
      return ok({ received: true, keptOtherSubscription: true });
    }
  }

  // ── A write that cannot go backwards ──────────────────────────────
  //
  // This was a plain upsert on user_id, and Stripe does not deliver one
  // event at a time. Two arrive together -- a cancellation and a
  // renewal, say -- and BOTH re-fetch the truth from Stripe, which is
  // correct and is what makes redelivery safe. But then both write, and
  // whichever write lands last wins regardless of which fetch was
  // newer. A slower fetch of older state silently overwrites newer
  // state.
  //
  // The re-fetch above is what makes processing the SAME event twice
  // safe. It does nothing about two DIFFERENT events in flight at once,
  // which is the case actually seen in the logs: two deliveries, three
  // minutes old, both 200.
  //
  // The direction that matters: a stale row reading "active" after a
  // cancellation costs a little revenue. A stale row reading "canceled"
  // or "free" after a renewal takes Pro away from somebody who has just
  // paid for it. That is a refund and a one-star review, so the write
  // has to be ordered.
  //
  // last_event_at is Stripe's own event.created, not our clock -- the
  // same discipline as the sync cursor, and for the same reason: two
  // machines' clocks cannot be compared, and the only ordering anyone
  // can trust here is the one Stripe itself assigned.
  //
  // UPDATE-then-INSERT rather than an upsert, because PostgREST cannot
  // put a WHERE on the conflict branch of an upsert, and "only if
  // newer" is exactly such a condition.
  const ordered = `last_event_at.is.null,last_event_at.lte.${eventTime}`;

  async function applyIfNewer(): Promise<{ applied: boolean; error?: string }> {
    const { data, error } = await db
      .from("entitlements")
      .update({ ...row, last_event_at: eventTime })
      .eq("user_id", userId)
      .or(ordered)
      .select("user_id");
    if (error) return { applied: false, error: error.message };
    // Rows matched means it was applied. Zero means either there is no
    // row yet, or a NEWER event already wrote one -- and those two are
    // told apart by trying the insert below.
    return { applied: (data?.length ?? 0) > 0 };
  }

  let result = await applyIfNewer();
  if (result.error) {
    console.error("entitlement write failed:", result.error);
    return new Response("Write failed", { status: 500 });
  }

  if (!result.applied) {
    const { error: insErr } = await db
      .from("entitlements")
      .insert({ user_id: userId, ...row, last_event_at: eventTime });

    if (insErr) {
      // 23505: the row exists after all. Either a newer event beat us to
      // it -- correct, nothing to do -- or two first-ever events for one
      // bowler raced and the other inserted first, in which case ours
      // may still be the newer of the two. One more ordered update tells
      // those apart and costs a single round trip.
      const isConflict = (insErr as { code?: string }).code === "23505";
      if (!isConflict) {
        console.error("entitlement write failed:", insErr.message);
        return new Response("Write failed", { status: 500 });
      }
      const retry = await applyIfNewer();
      if (retry.error) {
        console.error("entitlement write failed:", retry.error);
        return new Response("Write failed", { status: 500 });
      }
      // retry.applied false here is a SUCCESS: it means the stored row
      // is newer than this event, so leaving it alone is the right
      // outcome, not a failure to write.
    }
  }

  await markApplied(userId);
  return ok({ received: true, status: row.status });
});
