// "Subscribe" on the welcome page, carried through sign-in.
//
// The welcome page links to /app/?subscribe=year (or month). The bowler
// may not be signed in yet, and signing in can leave the page: Google
// sign-in redirects away and back, and the email code can be opened
// later. So the choice is noted in localStorage the moment the app
// loads, the parameter is taken off the address (a bookmark or a reload
// must not reopen checkout), and BowlingTracker picks it up once there
// is a signed-in bowler past onboarding.
//
// It lapses after two hours: someone who clicked Subscribe yesterday
// and opens the app today came to bowl, not to be sent to a pay screen.

const KEY = "mbj-pending-subscribe-v1";
const TTL_MS = 2 * 60 * 60 * 1000;

export function periodFromParam(value) {
  return value === "year" || value === "month" ? value : "";
}

// Called once, from main.jsx, before anything renders.
export function capturePendingSubscribe() {
  try {
    const u = new URL(window.location.href);
    if (!u.searchParams.has("subscribe")) return;
    const period = periodFromParam(u.searchParams.get("subscribe"));
    u.searchParams.delete("subscribe");
    window.history.replaceState(null, "", u.toString());
    if (period) window.localStorage.setItem(KEY, JSON.stringify({ period, at: Date.now() }));
  } catch { /* no storage: the bowler lands on Home, which still works */ }
}

// Returns "year", "month" or "", and clears it: it is used once.
export function takePendingSubscribe(now = Date.now()) {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return "";
    window.localStorage.removeItem(KEY);
    const { period, at } = JSON.parse(raw) || {};
    if (!Number.isFinite(at) || now - at > TTL_MS || now < at) return "";
    return periodFromParam(period);
  } catch {
    return "";
  }
}
