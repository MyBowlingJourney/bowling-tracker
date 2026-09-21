// What a bowler sees when an Edge Function call fails.
//
// ── Why this exists ─────────────────────────────────────────────────────
//
// Every call site made this decision on its own, and three of them showed
// whatever came back: Insights printed supabase-js's "Edge Function
// returned a non-2xx status code", and the scorecard reader printed a
// paragraph telling the bowler to set a secret in Project Settings. Those
// are messages for the person who deploys the app, not the person using
// it.
//
// ── The rule ────────────────────────────────────────────────────────────
//
// A message our own function wrote FOR BOWLERS is shown as-is: a rate
// limit, "part of the paid plan", "too many images". Anything else --
// a 5xx, a message naming infrastructure, supabase-js's generic text --
// is replaced with the caller's fallback, written in that feature's voice.
//
// The raw detail is never lost: callers record it to the local error log,
// which is what Settings > Diagnostics copies. Hiding it from the bowler
// and keeping it for the developer are the same decision, made once.

// Words that mean a message is about the plumbing. If any appears, the
// message was written for a developer, whatever its status code.
const INFRASTRUCTURE = /gemini|secret|api[ _-]?key|configured|edge function|supabase|deno|redeploy|payload|upstream|json|unexpected error|non-2xx|status code|stack|undefined|null\b|exception|\b[45]\d\d\b/i;

// supabase-js's own wording when the request never reached the server:
// offline, DNS, the function failing to boot, a CORS rejection.
const NETWORK = /failed to send a request|failed to fetch|networkerror|network request failed|load failed|timed? ?out|aborted/i;

export const NETWORK_MESSAGE = "Couldn't connect. Check your signal and try again.";
export const SIGNED_OUT_MESSAGE = "Your sign-in has expired. Sign out and back in, then try again.";

/**
 * Is this message safe to put in front of a bowler?
 * Short, and free of anything that names the machinery.
 */
export function isBowlerFacing(message) {
  const m = String(message || "").trim();
  if (!m || m.length > 280) return false;
  return !INFRASTRUCTURE.test(m);
}

/**
 * Decide the message to show.
 *
 * failure: { status, body, message } as produced by readFunctionFailure.
 *   status  -- HTTP status, or 0 when the request never got a response
 *   body    -- the parsed JSON body, or null
 *   message -- supabase-js's error.message
 * fallback: the feature's own friendly sentence for "it didn't work".
 *
 * Returns { text, kind } where kind is one of
 *   "network" | "auth" | "limit" | "upgrade" | "server"
 * so a caller can, say, keep an Upgrade button for "upgrade".
 */
export function friendlyFunctionError(failure, fallback) {
  const status = Number(failure?.status) || 0;
  const said = failure?.body?.error;
  const safeFallback = isBowlerFacing(fallback) ? fallback : "Something went wrong. Try again in a few minutes.";

  if (!status) {
    return NETWORK.test(String(failure?.message || ""))
      ? { text: NETWORK_MESSAGE, kind: "network" }
      : { text: safeFallback, kind: "server" };
  }
  if (status === 401) return { text: SIGNED_OUT_MESSAGE, kind: "auth" };

  const kind = status === 429 ? "limit" : status === 402 || failure?.body?.upgrade === true ? "upgrade" : "server";

  // Our functions write their own 4xx messages for bowlers -- trust them,
  // but only past the same filter as everything else. Some 5xx ones are
  // written for bowlers too ("The nightcap took too long. Tap to try
  // again."), so the filter, not the status, is what decides.
  if (isBowlerFacing(said)) return { text: String(said).trim(), kind };
  return { text: safeFallback, kind };
}

/**
 * Pull status and body out of a supabase-js functions.invoke error.
 *
 * supabase-js reports every non-2xx as the same opaque message and puts
 * the Response on error.context. A body that isn't JSON, or has already
 * been read, leaves body null -- the status is still enough to decide.
 */
export async function readFunctionFailure(error) {
  const res = error?.context;
  const status = Number(res?.status) || 0;
  let body = null;
  try {
    if (res && typeof res.json === "function") body = await res.json();
  } catch { /* not JSON, or already consumed */ }
  return { status, body: body && typeof body === "object" ? body : null, message: String(error?.message || "") };
}

/**
 * Diagnostic detail for the local error log. Never shown to a bowler.
 */
export function failureDetail(failure) {
  const b = failure?.body || {};
  return {
    status: failure?.status ?? 0,
    error: typeof b.error === "string" ? b.error.slice(0, 300) : undefined,
    reason: typeof b.reason === "string" ? b.reason : undefined,
    requestId: typeof b.requestId === "string" ? b.requestId : undefined,
    message: String(failure?.message || "").slice(0, 200),
  };
}
