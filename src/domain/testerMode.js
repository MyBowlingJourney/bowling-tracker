// Tester mode: who sees the Diagnostics card in Settings.
//
// Diagnostics was taken out for everyone -- "23503 violates foreign key
// constraint" is not something a bowler can act on, and a card counting
// issues suggests the app is broken. But the people testing it need it:
// it is the only place the app says WHY something failed on their phone.
//
// So it comes back behind a switch, the Android way: tap the
// "published by" line in About & Legal seven times. The same tapping
// turns it off again. No account flag, no database change -- the log it
// shows is this phone's own, so there is nothing to protect by locking it
// down harder, and a tester can be designated by telling them the taps.

export const TESTER_KEY = "mbj-tester-mode-v1";
export const TAPS_TO_TOGGLE = 7;
// Taps further apart than this start the count again, so seven stray
// taps across a week never flip it.
export const TAP_WINDOW_MS = 1500;

// Pure: the next tap-counter state. Returns { count, last, toggled }.
export function nextTap(state, now) {
  const s = state && typeof state === "object" ? state : { count: 0, last: 0 };
  const fresh = !s.last || now - s.last > TAP_WINDOW_MS;
  const count = (fresh ? 0 : s.count) + 1;
  if (count >= TAPS_TO_TOGGLE) return { count: 0, last: 0, toggled: true };
  return { count, last: now, toggled: false };
}

// How many more taps, for the "N more taps" hint once someone is close.
export function tapsLeft(state) {
  return Math.max(0, TAPS_TO_TOGGLE - (state?.count || 0));
}

export function readTesterMode(storage = globalThis.localStorage) {
  try { return storage?.getItem(TESTER_KEY) === "1"; } catch { return false; }
}

export function writeTesterMode(on, storage = globalThis.localStorage) {
  try {
    if (on) storage?.setItem(TESTER_KEY, "1");
    else storage?.removeItem(TESTER_KEY);
  } catch { /* private mode: it just will not persist */ }
}
