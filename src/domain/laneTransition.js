// Where in the block a shot was thrown, and which shots belong to a
// given moment in it.
//
// ── Why this exists ─────────────────────────────────────────────────────
//
// The Ball path card drew one line per ball, averaged over every shot
// ever thrown with it. That is a fair summary of a ball you have settled
// on and a lie about a night you moved: start on 20, move to 25 as the
// lanes transition, and the mean is 22.5 -- a line you never threw.
//
// Worse, the laydown and the arrow board were averaged INDEPENDENTLY,
// with their own counts, so the drawn line could pair a laydown from one
// set of shots with an arrow from another. That pairing need never have
// existed.
//
// So instead of one average, a position: pick a moment in the block and
// average only the shots thrown near it. Slide the moment and the lines
// move the way you moved.
//
// ── This module only SELECTS ────────────────────────────────────────────
//
// It does not average anything. It hands back a subset of shots, and
// ballComparison does the aggregating exactly as it always has -- which
// matters, because ballComparison also decides what counts as a fresh
// rack, and a spare shot at a corner pin is not a line you chose. Two
// averaging paths would drift apart, and the one in the card would be
// the one nobody tested.

const rows = v => (Array.isArray(v) ? v : []).filter(s => s && typeof s === "object");
const clean = v => (v == null ? "" : String(v).trim());
const num = v => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

// A league night is three games; practice can be one, or five.
const FRAMES_PER_GAME = 10;

/**
 * How far through their own night each shot sits, from 0 at the first
 * ball to 1 at the last.
 *
 * Measured in FRAMES, not games. The transition does not wait for a game
 * to end -- the move that matters is usually made in the middle of one,
 * and bucketing by game hides exactly that.
 *
 * Each night is measured against its OWN length, so a three-game league
 * night and a five-game practice block both run 0 to 1. That is what
 * makes them poolable: "two thirds of the way through" means the same
 * thing in both.
 */
export function blockPositions(shots) {
  const all = rows(shots);

  // How long each night ran. Taken from the shots themselves rather than
  // assumed to be three: a night abandoned after two games is two games
  // long, and stretching it to three would put its last shot at 0.67 and
  // claim a transition nobody bowled.
  const nightLength = new Map();
  for (const s of all) {
    const key = nightKey(s);
    const g = num(s.game) ?? 1;
    nightLength.set(key, Math.max(nightLength.get(key) || 1, g));
  }

  const out = new Map();
  for (const s of all) {
    const games = nightLength.get(nightKey(s)) || 1;
    const g = num(s.game) ?? 1;
    const f = num(s.frame) ?? 1;
    const frameIndex = (g - 1) * FRAMES_PER_GAME + (f - 1);
    const total = games * FRAMES_PER_GAME;
    // Clamped: a stray game number past the night's length would
    // otherwise land outside the slider.
    out.set(s, total <= 1 ? 0 : Math.max(0, Math.min(1, frameIndex / (total - 1))));
  }
  return out;
}

function nightKey(s) {
  return `${clean(s.bowler)}|${clean(s.league)}|${clean(s.date)}`;
}

/**
 * The nights available to scrub through, newest first.
 *
 * @returns [{date, games, shots, pattern}]
 */
export function nightsIn(shots, lanePatterns) {
  const byDate = new Map();
  for (const s of rows(shots)) {
    const date = clean(s.date);
    if (!date) continue;
    const cur = byDate.get(date) || { date, games: 0, shots: 0 };
    cur.games = Math.max(cur.games, num(s.game) ?? 1);
    cur.shots += 1;
    byDate.set(date, cur);
  }
  return [...byDate.values()]
    .map(n => ({ ...n, pattern: patternForNight(lanePatterns, n.date) }))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

// The pattern a night was bowled on, by date.
//
// Lane patterns are recorded per league, date and LANE, and a night is
// bowled on a pair -- so several rows can describe the same night. They
// name the same pattern in every case that matters; the first one found
// is that name.
export function patternForNight(lanePatterns, date) {
  const d = clean(date);
  if (!d) return "";
  for (const p of rows(lanePatterns)) {
    if (clean(p.date) === d) {
      const name = clean(p.patternName);
      if (name) return name;
    }
  }
  return "";
}

/**
 * The patterns there is enough data to draw, most-bowled first.
 *
 * A pattern with one night behind it is not a pattern you have learned,
 * it is a night. It is still listed -- withholding a number the bowler
 * can see on their own scoresheet does not protect them from it -- with
 * its night count, so the card can say so rather than imply otherwise.
 */
export function patternsIn(shots, lanePatterns) {
  const nights = nightsIn(shots, lanePatterns);
  const byName = new Map();
  for (const n of nights) {
    if (!n.pattern) continue;
    const cur = byName.get(n.pattern) || { name: n.pattern, nights: 0, shots: 0 };
    cur.nights += 1;
    cur.shots += n.shots;
    byName.set(n.pattern, cur);
  }
  return [...byName.values()].sort((a, b) => b.shots - a.shots || (a.name < b.name ? -1 : 1));
}

/**
 * The shots thrown around one moment in the block.
 *
 * @param shots        every shot the card is working from
 * @param at           0 to 1, where in the block
 * @param halfWindow   how much of the block either side counts as "near"
 * @param date         "" pools every night by position; a date scrubs
 *                     that night alone
 * @param pattern      "" is every pattern; a name keeps only nights
 *                     bowled on it
 * @param lanePatterns for resolving a night's pattern
 *
 * @returns {shots, nights} -- the subset, and how many nights it drew
 *          from, so the card can say what is behind a line.
 */
export function shotsAt(shots, opts) {
  const o = (opts && typeof opts === "object") ? opts : {};
  const at = Math.max(0, Math.min(1, num(o.at) ?? 0.5));
  const half = Math.max(0.02, num(o.halfWindow) ?? 0.15);
  const date = clean(o.date);
  const pattern = clean(o.pattern);
  const lanePatterns = o.lanePatterns;

  let pool = rows(shots);
  if (date) pool = pool.filter(s => clean(s.date) === date);
  if (pattern) {
    const ok = new Set(nightsIn(pool, lanePatterns)
      .filter(n => n.pattern === pattern).map(n => n.date));
    pool = pool.filter(s => ok.has(clean(s.date)));
  }

  const pos = blockPositions(pool);

  // The window is CLAMPED, not slid.
  //
  // A window centred on 0 would be half empty, so the first slider
  // position would average a third as many shots as the middle and jump
  // around for no reason the bowler could see. Sliding it inward instead
  // would mean position 0 showed shots from the middle of the night,
  // which is a quieter lie. Clamping keeps the ends honest: they cover
  // less of the block, and the sample count says so.
  const lo = Math.max(0, at - half);
  const hi = Math.min(1, at + half);

  const picked = pool.filter(s => {
    const p = pos.get(s);
    return p != null && p >= lo && p <= hi;
  });

  const nights = new Set(picked.map(s => clean(s.date)));
  return { shots: picked, nights: nights.size };
}

/**
 * Where the slider can usefully stop.
 *
 * Every tenth of the block, plus the ends. Finer than that and the
 * bowler is dragging through positions whose window barely changes;
 * coarser and a mid-game move lands between two stops.
 */
export const SLIDER_STEPS = 20;

/**
 * A label for a slider position, in the bowler's own terms.
 *
 * "Game 2, frame 4" rather than "0.45" -- the number means nothing and
 * the frame is what they remember moving on.
 */
export function positionLabel(at, games) {
  const g = Math.max(1, num(games) ?? 3);
  const total = g * FRAMES_PER_GAME;
  const frameIndex = Math.round(Math.max(0, Math.min(1, num(at) ?? 0)) * (total - 1));
  const game = Math.floor(frameIndex / FRAMES_PER_GAME) + 1;
  const frame = (frameIndex % FRAMES_PER_GAME) + 1;
  return `Game ${game}, frame ${frame}`;
}

/**
 * The typical number of games in a night, for labelling the slider.
 *
 * The median rather than the mean: one five-game practice block should
 * not stretch the labels on a season of three-game league nights.
 */
export function typicalGames(shots) {
  const byNight = new Map();
  for (const s of rows(shots)) {
    const k = nightKey(s);
    byNight.set(k, Math.max(byNight.get(k) || 1, num(s.game) ?? 1));
  }
  const all = [...byNight.values()].sort((a, b) => a - b);
  if (!all.length) return 3;
  return all[Math.floor(all.length / 2)];
}

/**
 * The length of a named pattern, in feet.
 *
 * Where the ball turns comes from the pattern, so selecting a pattern
 * should change the drawing -- a 47-foot block turns the ball later than
 * a 36-foot one, and drawing both at the league's default length would
 * show two identical breakpoints on patterns that play nothing alike.
 */
export function patternLengthFor(lanePatterns, name) {
  const want = clean(name);
  if (!want) return null;
  for (const p of rows(lanePatterns)) {
    if (clean(p.patternName) === want) {
      const feet = num(p.length) ?? num(p.lengthFeet);
      if (feet !== null && feet > 0) return feet;
    }
  }
  return null;
}
