import { supabase } from "./supabaseClient.js";
import { signatureOf } from "./domain/errorLog.js";

// Sending a report, without ever becoming the thing it reports.
//
// ── Never queued ────────────────────────────────────────────────────────
//
// This deliberately does NOT go through syncQueue. The most valuable
// entries in the log are sync failures, so routing reports through the
// queue means they are stuck exactly when they matter — and a failed
// report would be recorded as an error, which would queue another
// report, which would fail. One try, then give up and let the next
// occurrence carry it: the local log keeps the count, so nothing is lost
// by not retrying.
//
// ── Never logged ────────────────────────────────────────────────────────
//
// Nothing in here calls recordError, and every failure is swallowed. A
// logger that logs its own failures is a loop with a nicer name.
//
// ── Never blocking ──────────────────────────────────────────────────────
//
// Fire-and-forget with a short timeout. A bowler mid-frame must not wait
// on telemetry, and an unreachable server must not hold a promise open.

const TIMEOUT_MS = 4000;

// One send per signature per session.
//
// The local log already merges repeats into a count, so sending on every
// occurrence would be 89 round trips to move one number. The first
// occurrence goes immediately (that is the one worth knowing about), and
// after that only when the count has grown enough to change the picture.
const sent = new Map();
const RESEND_FACTOR = 10;

// A signature is worth sending again once its count has grown by an
// order of magnitude — 1 to 10 to 100. That turns "this happened" into
// "this is happening a lot" without a report per occurrence.
function worthSending(sig, hits) {
  if (!sent.has(sig)) return true;
  return hits >= sent.get(sig) * RESEND_FACTOR;
}

export function resetReportingForTests() {
  sent.clear();
}

export function reportError(entry, buildId = "") {
  // Deliberately not async: callers must not be able to await this by
  // accident and make a failure path slower than the success path.
  try {
    const e = (entry && typeof entry === "object") ? entry : null;
    if (!e) return;

    // supabaseClient exports null under MODE=test, and there is no client
    // at all before sign-in. Anonymous reports have nowhere to attach --
    // report_error returns silently for them anyway, so do not spend the
    // round trip.
    if (!supabase || typeof supabase.rpc !== "function") return;

    const sig = signatureOf(e);
    if (!sig) return;
    const hits = Number(e.count) > 0 ? Number(e.count) : 1;
    if (!worthSending(sig, hits)) return;

    // Marked as sent BEFORE the call, not after.
    //
    // Recording it on success would let a burst of failures fire a
    // report each, since none of them would have completed yet. A
    // dropped report costs nothing; the next occurrence carries the
    // same signature and a higher count.
    sent.set(sig, hits);

    const call = supabase.rpc("report_error", {
      p_signature: sig,
      p_kind: e.kind || "",
      p_where: e.where || "",
      p_code: e.code || "",
      // Already redacted by makeEntry. Nothing here un-redacts it.
      p_message: e.message || "",
      p_count: hits,
      p_build: buildId || e.build || "",
    });

    // No await anywhere: this resolves or it does not, and either way the
    // caller has already moved on.
    const timer = setTimeout(() => {}, 0);
    clearTimeout(timer);
    Promise.race([
      Promise.resolve(call),
      new Promise(resolve => setTimeout(resolve, TIMEOUT_MS)),
    ]).catch(() => {});
  } catch {
    // Swallowed on purpose. See the header: this must never be the
    // reason anything else fails.
  }
}
