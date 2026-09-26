// Removing a game column from the open bowling score sheet.
//
// Scores are stored by game number, so deleting game 2 of 4 has to move
// games 3 and 4 down to 2 and 3 for everyone on the sheet, then clear
// game 4 -- otherwise the sheet shows a hole where game 2 was. Game 1 is
// never removed: its x clears the scores and the column stays.
//
// Returns the writes to make, in order, as {who, game, value} where
// value "" clears the box. `get(who, game)` reads a score (null = empty).
export function deleteGameColumnPlan(opts) {
  // A null or missing argument would throw on destructuring (a "= {}"
  // default does not catch null). Treat it, and any non-object, as
  // "nothing given".
  const { people, game, lastGame, get } = opts && typeof opts === "object" ? opts : {};
  const who = (Array.isArray(people) ? people : []).filter(p => typeof p === "string" && p);
  const g = Number(game);
  const last = Number(lastGame);
  const read = typeof get === "function" ? get : () => null;
  if (!who.length || !Number.isInteger(g) || g < 1 || !Number.isInteger(last) || last < g) return [];
  const str = v => (v === null || v === undefined ? "" : String(v));

  const writes = [];
  for (const p of who) {
    if (g === 1) {
      if (read(p, 1) != null) writes.push({ who: p, game: 1, value: "" });
      continue;
    }
    for (let k = g; k < last; k++) {
      const next = read(p, k + 1), cur = read(p, k);
      if (str(next) !== str(cur)) writes.push({ who: p, game: k, value: str(next) });
    }
    if (read(p, last) != null) writes.push({ who: p, game: last, value: "" });
  }
  return writes;
}

// Whether a column holds any score, so deleting it asks first.
export function columnHasScores(opts) {
  // A null or missing argument would throw on destructuring (a "= {}"
  // default does not catch null). Treat it, and any non-object, as
  // "nothing given".
  const { people, game, get } = opts && typeof opts === "object" ? opts : {};
  const read = typeof get === "function" ? get : () => null;
  return (Array.isArray(people) ? people : []).some(p => read(p, Number(game)) != null);
}
