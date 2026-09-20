// Merging a delta fetch into a local cache.
//
// The correctness rule that matters most: a tombstone always wins over
// an incoming row for the same id. A realistic sequence is edit a shot
// while offline, decide it was wrong, delete it once back online -- the
// delete is what actually happened last, and the cache must reflect
// that even if the edit and the delete both arrive in the same batch in
// the other order.
//
// Kept format-agnostic on purpose: this doesn't know about shots or
// sessions, only about objects with an `id`. The same two functions
// merge either table.

export function mergeDelta(existingRows, incomingRows, tombstoneIds) {
  const existing = Array.isArray(existingRows) ? existingRows : [];
  const incoming = Array.isArray(incomingRows) ? incomingRows : [];
  const tombstones = new Set(Array.isArray(tombstoneIds) ? tombstoneIds : []);

  const byId = new Map();
  for (const row of existing) {
    if (row && row.id != null) byId.set(row.id, row);
  }
  for (const row of incoming) {
    if (!row || row.id == null) continue;
    // A tombstone in this same batch beats an update in this same
    // batch, whichever order they were pushed in.
    if (tombstones.has(row.id)) continue;
    byId.set(row.id, row);
  }
  for (const id of tombstones) byId.delete(id);

  return [...byId.values()];
}

// The cursor for the NEXT delta fetch: the latest timestamp seen this
// round, across both updated rows and tombstones, never earlier than
// what the caller already had.
//
// Deliberately the max seen, not max+epsilon. Advancing past the exact
// boundary would save re-fetching a row or two on the next sync, but it
// bets on clock precision being fine enough that nothing else could
// share that same instant -- an assumption that's cheap to get wrong
// and expensive to be wrong about, since being wrong means silently
// missing a write. Using the max as-is means the row(s) at that exact
// timestamp get asked for again next time, which the merge already
// handles for free: merging the same row twice does nothing. A little
// redundant fetching is a fine price for never missing one.
// The cursor to store after a FULL fetch, or null meaning "store
// nothing, fetch everything again next time".
//
// ── Why this is not `nextCursor(...) || new Date().toISOString()` ───
//
// That is what it used to be, and the fallback is the bug.
//
// Every cursor is compared against `updated_at`, which is written by
// the SERVER. `new Date()` is the PHONE. Mixing the two means the
// cursor can land ahead of rows that already exist, and since a cursor
// only ever moves forward, every row in that gap is never requested
// again. Not on the next sync, not ever. No error is raised, because
// nothing went wrong as far as either side can tell: the client asked
// for changes since a time, and was correctly told there were none.
//
// It needs no clock skew to bite, either. A row written while the fetch
// was in flight is already in the past by the time the response is
// handled, so a second device saving a game during your sync can put
// that game permanently out of reach.
//
// So: a real server timestamp, or nothing. Storing no cursor costs one
// more full fetch of a table that just came back empty -- which is the
// cheapest fetch there is -- and it cannot lose data.
export function seedCursor(timestamps) {
  return nextCursor(null, timestamps);
}

export function nextCursor(previousCursor, timestamps) {
  const all = [
    ...(previousCursor ? [previousCursor] : []),
    ...(Array.isArray(timestamps) ? timestamps : []),
  ]
    .map(t => (t ? new Date(t).getTime() : NaN))
    .filter(t => Number.isFinite(t));

  if (!all.length) return previousCursor || null;
  return new Date(Math.max(...all)).toISOString();
}
