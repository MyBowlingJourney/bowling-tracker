// How a failed sync is described to a bowler.
//
// Pure logic, kept out of syncQueue.js so it can actually be tested --
// importing that module drags in IndexedDB, which is why this was
// excluded from the test run and why a broken timeout match went
// unnoticed.

const TRANSIENT_CODES = new Set([
  "08000", "08003", "08006", // connection failures
  "53300", "57014",          // too many connections, query cancelled
  "40001", "40P01",          // serialisation failure, deadlock
]);

// Errors that will NEVER pass by retrying, because the data itself
// conflicts with a rule. Retrying forever just wedges the queue.
const PERMANENT_CODES = new Set([
  "23505", // unique violation
  "23503", // foreign key violation
  "23502", // not-null violation
  "23514", // check constraint
  "42501", // insufficient privilege (RLS/grant)
  "22P02", // invalid text representation
  "22001", // value too long for its column
  "22003", // number out of range
  "22007", "22008", // invalid date/time
  "42703", // column does not exist (app ahead of the database)
  "42P01", // table does not exist
  "PGRST204", // PostgREST: column not in its schema cache
]);

// Shared reference tables, where an RLS denial means the write was never
// the bowler's to make -- a stale copy of somebody else's row -- and the
// real change goes some other way. bowling_centers: pin type is saved
// through set_center_pins(); a queued whole-row upsert of a looked-up
// center can never land, and keeping it only retries forever.
// friendships: older app versions inserted teammate friendships as
// already accepted; the database now refuses that (they are made by
// befriend_teammates instead), so a refused copy left in a queue can go.
const DISCARDABLE_WHEN_DENIED = new Set(["bowling_centers", "friendships"]);

export function classifySyncError(err, table = "") {
  const code = err?.code || "";
  const msg = String(err?.message || "");

  // "timed out" does not match /timeout/ -- the word is split, and that
  // is how browsers and Postgres actually phrase it ("The operation
  // timed out", "ETIMEDOUT", "statement timeout"). A real alley-wifi
  // timeout was therefore classed as a PERMANENT failure and the bowler
  // was told something had gone wrong rather than "this will upload on
  // its own".
  //
  // Also covers offline, connection-refused and DNS wording, which are
  // the same situation from the bowler's point of view.
  // A bare 502/503/504 anywhere in the message used to count, and that
  // matched things that are not gateway errors at all:
  //
  //   "PostgREST error 23503: foreign key violation"  -> contains 503
  //   "Key (score)=(502) already exists"              -> contains 502
  //
  // Both are PERMANENT failures, and calling them transient is not a
  // cosmetic mistake: the flush loop BREAKS on a transient error to
  // preserve ordering, so one misread foreign-key violation blocks every
  // write behind it — the exact wedge the permanent branch exists to
  // prevent. A bowler shooting 502 could wedge their own queue.
  //
  // So the status has to stand alone: start of string or whitespace
  // before, whitespace or end after. "503 Service Unavailable" matches;
  // "23503" and "(502)" do not.
  const looksLikeGatewayError =
    /(?:^|\s)50[234](?:\s|$)/.test(msg) || /bad gateway|service unavailable|gateway time/i.test(msg);

  if (TRANSIENT_CODES.has(code) ||
      looksLikeGatewayError ||
      /fetch|network|time[\s-]?d?\s?out|timeout|abort|offline|disconnect|refused|unreachable|dns|ECONN|ETIMEDOUT|ENOTFOUND|ERR_INTERNET|ERR_NETWORK/i.test(msg)) {
    return {
      kind: "transient",
      // No action: the queue retries automatically.
      title: "Waiting for a better connection",
      detail: "Your scores are saved on this phone and will upload on their own.",
      canRetry: true,
      canDiscard: false,
    };
  }

  if (code === "23505") {
    return {
      kind: "permanent",
      title: "Something was already saved",
      detail: "This looks like a duplicate of something already in the cloud. Your scores are safe — this copy just isn't needed.",
      canRetry: true,
      canDiscard: true,
    };
  }

  if (code === "42501") {
    return {
      kind: "permanent",
      title: "Not allowed to save this",
      detail: "The app doesn't have permission to save this. Nothing is lost on this phone, but it can't reach the cloud until this is fixed.",
      canRetry: true,
      // Needs a real fix, not a discard -- except on a shared reference
      // table, where it can never succeed (see above).
      canDiscard: DISCARDABLE_WHEN_DENIED.has(table),
    };
  }

  // The app is ahead of the database -- a column or table it writes has
  // not been created yet. Skipped so it cannot block the queue, but never
  // thrown away: running the migration lets it through.
  if (code === "42703" || code === "42P01" || code === "PGRST204") {
    return {
      kind: "permanent",
      title: "Waiting for an app update to finish",
      detail: "The cloud isn't ready for this yet. Nothing is lost on this phone; it will upload once the update is complete.",
      canRetry: true,
      canDiscard: false,
    };
  }

  if (PERMANENT_CODES.has(code)) {
    return {
      kind: "permanent",
      title: "This didn't save correctly",
      detail: "Something about this entry doesn't fit what the cloud expects. Your scores are still on this phone.",
      canRetry: true,
      canDiscard: true,
    };
  }

  return {
    kind: "unknown",
    title: "Couldn't upload yet",
    detail: "Your scores are saved on this phone. The app keeps trying in the background.",
    canRetry: true,
    canDiscard: true,
  };
}

// Whether the bowler needs to be told anything at all.
//
// A transient failure with a small backlog is just normal life at a
// bowling alley with bad wifi -- surfacing it would train people to
// ignore the indicator. Speak up when it's stuck, not when it's slow.
export function shouldSurfaceSyncIssue(state) {
  // A default parameter only applies to `undefined`, not `null` -- and
  // "no queue state yet" is naturally expressed as null by a caller
  // reading it from storage before the first sync.
  const { total = 0, oldestAgeMs = 0, kind = "unknown" } =
    (state && typeof state === "object") ? state : {};
  if (total === 0) return false;
  if (kind === "permanent") return true;
  // Transient and recent: stay quiet, it's working.
  const TWO_HOURS = 2 * 60 * 60 * 1000;
  return oldestAgeMs > TWO_HOURS;
}
