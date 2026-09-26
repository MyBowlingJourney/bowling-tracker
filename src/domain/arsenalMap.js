// Arsenal analysis: where each ball sits, how it should behave, how it
// has actually scored, and what the bag is missing.
//
// WHAT THE POSITIONS ARE
//
// A ball's reaction is not printed on its box. What IS printed -- cover
// type, RG, differential, intermediate differential -- plus the surface
// it is at and how it was drilled, is what a pro shop reads to predict
// it. This file does the same reading, as three estimates on a 0-100
// scale:
//
//   strength  total hook: how much the ball reads the lane overall
//             (weak = dry lanes and burn, strong = heavy oil)
//   length    when it reads the lane (early = hooks sooner and rolls
//             earlier, long = skids further before it goes)
//   shape     what it does at the break point (smooth = a controlled
//             arc, sharp = a quick change of direction)
//
// They are estimates from specs, not measurements, and the screen says
// so. Two balls with identical numbers can still roll differently, and
// a bowler's own rev rate and speed move every ball the same way -- so
// what these are good for is where the balls sit RELATIVE TO EACH OTHER,
// which is the question an arsenal is built around.
//
// WHY THE WEIGHTS ARE WHAT THEY ARE
//
// The cover and its surface are the only parts of the ball that touch
// the lane, so between them they carry over half of every estimate. A
// strong core in a shiny pearl still skids; a weak core in a sanded
// solid still reads the fronts. Core numbers and layout decide how the
// friction the cover finds is turned into motion, so they matter, but
// second:
//
//   strength: cover .30, surface .25, differential .15, RG .12,
//             layout .10, intermediate diff .08
//   length:   surface .30, cover .25, RG .25, layout .20
//   shape:    cover .30, surface .25, layout .15, differential .15,
//             intermediate diff .15
//
// A missing input is left out and the rest re-weighted, and the share of
// the weight that WAS known is reported as `confidence`, so a ball with
// only a cover type shows as a guess rather than as a fact.

const clean = v => String(v ?? "").trim();
const num = v => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};
const clamp01 = v => Math.max(0, Math.min(1, v));
const rows = v => (Array.isArray(v) ? v : []).filter(x => x && typeof x === "object");

// How grippy each cover chemistry is, 0 (slides) to 1 (grabs).
//
// Urethane is not a point on the solid-to-pearl line. It reads the lane
// earliest and turns the smoothest of all, but spends its energy before
// the back end, so it hooks less in total than a reactive solid. So it
// carries its own length and back-end values (COVER_LENGTH, COVER_SHAPE)
// instead of taking them from its friction the way the reactive covers do.
export const COVER_FRICTION = { solid: 1, hybrid: 0.6, pearl: 0.3, urethane: 0.45 };
export const COVER_LENGTH = { urethane: 0 };  // 0 = earliest
export const COVER_SHAPE = { urethane: 0 };   // 0 = smoothest

// Surface texture, 0 (shiny, skids) to 1 (rough, grabs). Lower grit
// numbers are rougher. "Lane Shine" is a cover worn smooth by use.
export const SURFACE_TEXTURE = {
  "500": 1, "1000": 0.88, "1500": 0.76, "2000": 0.64, "3000": 0.52,
  "4000": 0.42, "Lane Shine": 0.3, "Polish": 0.18,
};

// "Box" is whatever the factory shipped, which follows the cover: solids
// come sanded, pearls polished, hybrids somewhere between, and urethane
// sanded (usually about 2000 grit).
export const BOX_TEXTURE = { solid: 0.58, hybrid: 0.4, pearl: 0.2, urethane: 0.64 };

export const WEIGHTS = {
  strength: { cover: 0.30, surface: 0.25, diff: 0.15, rg: 0.12, layout: 0.10, intDiff: 0.08 },
  length: { surface: 0.30, cover: 0.25, rg: 0.25, layout: 0.20 },
  shape: { cover: 0.30, surface: 0.25, layout: 0.15, diff: 0.15, intDiff: 0.15 },
};

// The bands a score falls into, in the words bowlers already use for a
// ball (and the app's default ball groups use).
export const STRENGTH_BANDS = [
  { max: 38, id: "weak", label: "Weak" },
  { max: 62, id: "benchmark", label: "Benchmark" },
  { max: 101, id: "strong", label: "Strong" },
];
export const LENGTH_BANDS = [
  { max: 38, id: "early", label: "Early" },
  { max: 62, id: "mid", label: "Mid-lane" },
  { max: 101, id: "long", label: "Long" },
];
export const SHAPE_BANDS = [
  { max: 40, id: "smooth", label: "Smooth" },
  { max: 60, id: "controlled", label: "Controlled" },
  { max: 101, id: "sharp", label: "Sharp" },
];
export const OIL_FOR_STRENGTH = [
  { max: 38, label: "Light oil / late in the block" },
  { max: 62, label: "Medium oil" },
  { max: 101, label: "Heavy oil / fresh" },
];

const band = (bands, v) => (v === null ? null : bands.find(b => v < b.max) || bands[bands.length - 1]);

// Spare balls: plastic, or named as a spare. They are placed on the map
// only as "spare", never scored -- a plastic ball's "strength" is zero by
// design and would drag every comparison.
export function isSpareBall(name, specs) {
  const n = clean(name).toLowerCase();
  if (!n) return false;
  if (/\b(plastic|polyester|spare|viz-a-ball|clear)\b/.test(n)) return true;
  return false;
}

// What the texture is, and whether it was known or assumed.
export function surfaceTexture(surface, cover) {
  const s = clean(surface);
  if (s && s !== "Box" && SURFACE_TEXTURE[s] !== undefined) return { value: SURFACE_TEXTURE[s], assumed: false };
  if (cover && BOX_TEXTURE[cover] !== undefined) return { value: BOX_TEXTURE[cover], assumed: s !== "Box" };
  return { value: null, assumed: true };
}

// What the drilling does, from whichever layout system it was recorded
// in. Returns two nudges on a -1..1 scale plus a flare factor:
//   length  -1 = drilled to go earlier, +1 = drilled to go longer
//   shape   -1 = smoother, +1 = sharper
//   flare   0.6..1, how much of the core's flare potential the pin
//           placement unlocks (most at about 3.5-4.5" pin to PAP)
export function layoutEffect(layout) {
  if (!layout || typeof layout !== "object") return null;
  const v = layout.values || {};
  const pinToPap = num(v.pinToPap);
  let length = null, shape = null;
  if (layout.system === "dual_angle") {
    const da = num(v.drillingAngle), val = num(v.valAngle);
    // Small drilling angles rev up early and read the midlane; big ones
    // push the ball down the lane and turn it harder at the break.
    if (da !== null) { length = Math.max(-1, Math.min(1, (da - 50) / 35)); shape = Math.max(-1, Math.min(1, (da - 50) / 40)); }
    // A bigger VAL angle delays and smooths the flare.
    if (val !== null) shape = (shape ?? 0) - Math.max(-0.5, Math.min(0.5, (val - 45) / 60));
  } else if (layout.system === "vls") {
    const buffer = num(v.pinBuffer), psa = num(v.psaToPap);
    // A short pin buffer is the early, strong end of VLS; a long one
    // is later and more angular.
    if (buffer !== null) { length = Math.max(-1, Math.min(1, (buffer - 2.5) / 2)); shape = Math.max(-1, Math.min(1, (buffer - 2.5) / 2.5)); }
    if (psa !== null) shape = (shape ?? 0) + Math.max(-0.4, Math.min(0.4, (4 - psa) / 5));
  } else if (layout.system === "2ls") {
    const cog = num(v.pinToCog);
    if (cog !== null) { length = Math.max(-1, Math.min(1, (cog - 3.5) / 3)); shape = Math.max(-1, Math.min(1, (cog - 3.5) / 3)); }
  } else {
    return null;
  }
  const flare = pinToPap === null ? null
    : (pinToPap >= 3.25 && pinToPap <= 4.75 ? 1 : Math.max(0.6, 1 - Math.abs(pinToPap - 4) / 6));
  if (length === null && shape === null && flare === null) return null;
  return { length, shape, flare };
}

// Weighted average of whichever parts are known.
function blend(parts, weights) {
  let total = 0, weight = 0, known = 0;
  const all = Object.values(weights).reduce((a, b) => a + b, 0);
  for (const [k, w] of Object.entries(weights)) {
    const v = parts[k];
    if (v === null || v === undefined) continue;
    total += v * w; weight += w; known += w;
  }
  if (weight === 0) return { value: null, confidence: 0 };
  return { value: Math.round(clamp01(total / weight) * 100), confidence: Math.round((known / all) * 100) / 100 };
}

// One ball, placed.
//
// specs: { coverstock, coreType, rg, diff, intDiff } (ballSpecs.js shape)
// layout: { system, values } (layouts.js shape) or null
// surface: a SURFACES value, or "" when unknown
export function placeBall(specs, layout, surface) {
  const s = specs || {};
  const cover = COVER_FRICTION[s.coverstock] !== undefined ? s.coverstock : "";
  const coverF = cover ? COVER_FRICTION[cover] : null;
  const tex = surfaceTexture(surface, cover);
  const rg = num(s.rg), diff = num(s.diff);
  const asym = s.coreType === "asymmetric";
  const intDiff = asym ? num(s.intDiff) : (s.coreType === "symmetric" ? 0 : null);
  const lay = layoutEffect(layout);
  // A surface and a layout alone say how a ball was prepared, not what
  // it is. Without the cover or the core numbers there is nothing to
  // place -- a guess from grit alone would read as a finding.
  if (!cover && (rg === null || diff === null)) {
    return { strength: null, length: null, shape: null, confidence: 0, surfaceAssumed: tex.assumed, tags: {}, oil: null };
  }

  // Low RG revs up sooner. 2.46 is about the lowest a ball is made,
  // 2.80 the highest.
  const rgEarly = rg === null ? null : clamp01((2.8 - rg) / 0.34);
  const flare = diff === null ? null : clamp01(diff / 0.06) * (lay?.flare ?? 1);
  const asymF = intDiff === null ? null : clamp01(intDiff / 0.025);

  const strength = blend({
    cover: coverF,
    surface: tex.value,
    diff: flare,
    rg: rgEarly,
    // A layout that unlocks the core's flare adds hook; one that
    // smothers it takes some away.
    layout: lay?.flare ?? null,
    intDiff: asymF,
  }, WEIGHTS.strength);

  const length = blend({
    surface: tex.value === null ? null : 1 - tex.value,
    cover: coverF === null ? null : (COVER_LENGTH[cover] ?? 1 - coverF),
    rg: rgEarly === null ? null : 1 - rgEarly,
    layout: lay?.length === null || lay?.length === undefined ? null : (lay.length + 1) / 2,
  }, WEIGHTS.length);

  const shape = blend({
    cover: coverF === null ? null : (COVER_SHAPE[cover] ?? 1 - coverF),
    surface: tex.value === null ? null : 1 - tex.value,
    layout: lay?.shape === null || lay?.shape === undefined ? null : (lay.shape + 1) / 2,
    diff: flare,
    intDiff: asymF,
  }, WEIGHTS.shape);

  const confidence = Math.min(strength.confidence, length.confidence, shape.confidence);
  return {
    strength: strength.value,
    length: length.value,
    shape: shape.value,
    confidence,
    surfaceAssumed: tex.assumed,
    tags: {
      strength: band(STRENGTH_BANDS, strength.value)?.label || null,
      length: band(LENGTH_BANDS, length.value)?.label || null,
      shape: band(SHAPE_BANDS, shape.value)?.label || null,
    },
    oil: band(OIL_FOR_STRENGTH, strength.value)?.label || null,
  };
}

// The surface a ball is at now: the most recent one recorded against it,
// on a logged shot or a typed game.
export function currentSurface(ball, shots, gameEquipment) {
  let best = null;
  for (const s of rows(shots)) {
    if (clean(s.ball) !== ball || !clean(s.surface)) continue;
    const when = `${clean(s.date)}|${String(num(s.game) ?? 0).padStart(2, "0")}`;
    if (!best || when > best.when) best = { when, surface: clean(s.surface) };
  }
  for (const [key, e] of Object.entries(gameEquipment || {})) {
    if (!e || clean(e.ball) !== ball || !clean(e.surface)) continue;
    const parts = key.split("|");
    const when = `${clean(parts[2])}|${String(num(parts[3]) ?? 0).padStart(2, "0")}`;
    if (!best || when > best.when) best = { when, surface: clean(e.surface) };
  }
  return best ? best.surface : "";
}

// ── How each ball has actually scored ─────────────────────────────────

// Games with a known ball, one entry per game: the ball typed with the
// score, or the ball thrown on most of that game's first balls.
export function gamesByBall(sessions, shots, gameEquipment, bowler) {
  const who = clean(bowler);
  const tally = new Map();
  for (const s of rows(shots)) {
    if (who && clean(s.bowler) !== who) continue;
    if (!clean(s.ball)) continue;
    if (num(s.ballNum) !== null && num(s.ballNum) !== 1) continue;
    const key = `${clean(s.bowler)}|${clean(s.league)}|${clean(s.date)}|${num(s.game) ?? 1}|${num(s.sessionSeq) ?? 1}`;
    const t = tally.get(key) || new Map();
    t.set(clean(s.ball), (t.get(clean(s.ball)) || 0) + 1);
    tally.set(key, t);
  }
  const eqByKey = new Map();
  for (const [key, e] of Object.entries(gameEquipment || {})) {
    if (e && clean(e.ball)) eqByKey.set(key, clean(e.ball));
  }
  const out = [];
  for (const s of rows(sessions)) {
    if (who && clean(s.bowler) !== who) continue;
    const scores = Array.isArray(s.scores) ? s.scores : [];
    const seq = num(s.sessionSeq) ?? 1;
    scores.forEach((raw, i) => {
      const score = num(raw);
      if (score === null || score < 0 || score > 300) return;
      const game = i + 1;
      const base = `${clean(s.bowler)}|${clean(s.league)}|${clean(s.date)}|${game}`;
      let ball = eqByKey.get(`${base}|${seq}`) || (seq === 1 ? eqByKey.get(base) : null) || null;
      if (!ball) {
        const t = tally.get(`${base}|${seq}`);
        if (t) {
          let top = null, n = 0, total = 0;
          for (const [b, c] of t) { total += c; if (c > n) { top = b; n = c; } }
          if (top && n * 2 >= total) ball = top;
        }
      }
      if (ball) out.push({ ball, score, league: clean(s.league), date: clean(s.date), game, games: scores.length });
    });
  }
  return out;
}

// Per ball: games, average, and how that compares with the bowler's
// average over every game with a known ball.
//
// "Scores well" needs a real sample: at least MIN_GAMES games and five
// pins over the bowler's own average. Five pins over a handful of games
// is a good night, not a ball.
export const MIN_GAMES = 6;
export function scoringByBall(games) {
  const list = rows(games);
  const overall = list.length ? list.reduce((a, g) => a + g.score, 0) / list.length : null;
  const byBall = new Map();
  for (const g of list) {
    const cur = byBall.get(g.ball) || { ball: g.ball, games: 0, total: 0, byPhase: {} };
    cur.games += 1; cur.total += g.score;
    const phase = g.games <= 1 ? "fresh" : g.games === 2 ? (g.game === 1 ? "fresh" : "late")
      : (g.game <= g.games / 3 ? "fresh" : g.game <= (g.games * 2) / 3 ? "transition" : "late");
    const p = cur.byPhase[phase] || { games: 0, total: 0 };
    p.games += 1; p.total += g.score;
    cur.byPhase[phase] = p;
    byBall.set(g.ball, cur);
  }
  const out = {};
  for (const b of byBall.values()) {
    const avg = Math.round(b.total / b.games);
    const delta = overall === null ? null : Math.round(b.total / b.games - overall);
    const phases = {};
    for (const [k, p] of Object.entries(b.byPhase)) phases[k] = { games: p.games, avg: Math.round(p.total / p.games) };
    // The phase this ball scores best in, only where it has the games to
    // say so and the lead is more than noise.
    const ranked = Object.entries(phases).filter(([, p]) => p.games >= 3).sort((a, c) => c[1].avg - a[1].avg);
    const bestPhase = ranked.length >= 2 && ranked[0][1].avg - ranked[1][1].avg >= 8 ? ranked[0][0] : null;
    out[b.ball] = {
      games: b.games, avg, delta,
      scoresWell: b.games >= MIN_GAMES && delta !== null && delta >= 5,
      struggles: b.games >= MIN_GAMES && delta !== null && delta <= -8,
      phases, bestPhase,
    };
  }
  return { overall: overall === null ? null : Math.round(overall), byBall: out };
}

// ── Gaps and overlaps ─────────────────────────────────────────────────

const dist = (a, b) => Math.sqrt(
  (a.strength - b.strength) ** 2 + (a.length - b.length) ** 2 + (a.shape - b.shape) ** 2);

// What a set of balls (the arsenal, or one bag) covers and misses.
// Each finding is { id, ... } from a closed set so the Caddie receives
// ids and numbers, never prose.
export function findGaps(placed) {
  const list = rows(placed);
  const spares = list.filter(b => b.spare);
  const scored = list.filter(b => !b.spare && b.strength !== null && b.length !== null && b.shape !== null);
  const unplaced = list.filter(b => !b.spare && (b.strength === null || b.length === null || b.shape === null));
  const out = [];
  if (!spares.length) out.push({ id: "noSpare" });
  if (unplaced.length) out.push({ id: "missingSpecs", balls: unplaced.map(b => b.name) });
  if (!scored.length) return out;

  const maxStrength = Math.max(...scored.map(b => b.strength));
  const minStrength = Math.min(...scored.map(b => b.strength));
  if (maxStrength < 62) out.push({ id: "noHeavyOil", strongest: maxStrength });
  if (minStrength > 40) out.push({ id: "noDryLanes", weakest: minStrength });
  if (!scored.some(b => b.shape >= 60)) out.push({ id: "noSharp" });
  if (!scored.some(b => b.shape <= 42)) out.push({ id: "noSmooth" });

  // A step down the ladder: sorted strongest to weakest, a jump of more
  // than 25 between neighbours is a condition the bag has nothing for.
  const byStrength = [...scored].sort((a, b) => b.strength - a.strength);
  for (let i = 1; i < byStrength.length; i++) {
    const gap = byStrength[i - 1].strength - byStrength[i].strength;
    if (gap > 25) out.push({ id: "ladderGap", above: byStrength[i - 1].name, below: byStrength[i].name, gap });
  }

  // Two balls that sit on top of each other do one job twice.
  for (let i = 0; i < scored.length; i++) {
    for (let j = i + 1; j < scored.length; j++) {
      const d = dist(scored[i], scored[j]);
      if (d < 9) out.push({ id: "overlap", a: scored[i].name, b: scored[j].name, distance: Math.round(d) });
    }
  }
  return out;
}

// The target a gap asks for, as a point on the map, so catalog balls can
// be ranked by how well they fill it.
export function gapTarget(gap, placed) {
  const scored = rows(placed).filter(b => !b.spare && b.strength !== null);
  const avgLen = scored.length ? scored.reduce((a, b) => a + b.length, 0) / scored.length : 50;
  switch (gap?.id) {
    case "noHeavyOil": return { strength: 78, length: 40, shape: 45 };
    case "noDryLanes": return { strength: 25, length: 70, shape: 55 };
    case "noSharp": return { strength: 55, length: 60, shape: 75 };
    case "noSmooth": return { strength: 60, length: 40, shape: 25 };
    case "ladderGap": {
      const a = scored.find(b => b.name === gap.above), c = scored.find(b => b.name === gap.below);
      if (!a || !c) return null;
      return { strength: (a.strength + c.strength) / 2, length: (a.length + c.length) / 2 || avgLen, shape: (a.shape + c.shape) / 2 };
    }
    default: return null;
  }
}

// Catalog balls that would fill a gap, nearest first.
//
// catalog: [{ ballName, brand, specs }] -- official or community entries.
// Balls already owned are skipped. Surface is taken as out of the box.
export function fillCandidates(gap, placed, catalog, owned, limit = 3) {
  const target = gapTarget(gap, placed);
  if (!target) return [];
  const have = new Set(rows(owned).map(x => clean(x).toLowerCase()).concat((owned || []).filter(x => typeof x === "string").map(x => clean(x).toLowerCase())));
  const out = [];
  for (const c of rows(catalog)) {
    const name = clean(c.ballName);
    if (!name || have.has(name.toLowerCase())) continue;
    if (isSpareBall(name)) continue;
    const p = placeBall(c.specs, null, "Box");
    if (p.strength === null || p.length === null || p.shape === null || p.confidence < 0.6) continue;
    out.push({ name, brand: clean(c.brand), specs: c.specs, placed: p, distance: Math.round(dist(p, target)) });
  }
  return out.sort((a, b) => a.distance - b.distance || a.name.localeCompare(b.name)).slice(0, limit);
}

// ── Bags side by side ─────────────────────────────────────────────────

export function bagSummary(placed) {
  const scored = rows(placed).filter(b => !b.spare && b.strength !== null);
  const range = k => (scored.length ? [Math.min(...scored.map(b => b[k])), Math.max(...scored.map(b => b[k]))] : null);
  return {
    balls: rows(placed).length,
    placed: scored.length,
    strength: range("strength"),
    length: range("length"),
    shape: range("shape"),
  };
}

// Balls two bags share, and how far apart their coverage is.
export function compareBags(a, b) {
  const an = new Set(rows(a).map(x => x.name)), bn = new Set(rows(b).map(x => x.name));
  const shared = [...an].filter(n => bn.has(n));
  return { shared, a: bagSummary(a), b: bagSummary(b) };
}

// ── Putting it together ───────────────────────────────────────────────

// Every ball of a bowler, placed, with its scoring attached.
export function placeArsenal(opts) {
  // A null or missing argument would throw on destructuring (a "= {}"
  // default does not catch null). Treat it, and any non-object, as
  // "nothing given".
  const { balls, bowler, ballSpecs, ballLayouts, shots, sessions, gameEquipment } = opts && typeof opts === "object" ? opts : {};
  const who = clean(bowler);
  const games = gamesByBall(sessions, shots, gameEquipment, who);
  const scoring = scoringByBall(games);
  const list = (Array.isArray(balls) ? balls : []).map(clean).filter(Boolean);
  const placed = list.map(name => {
    const specs = (ballSpecs || {})[`${who}|${name}`] || {};
    const layout = (ballLayouts || {})[`${who}|${name}`] || null;
    const surface = currentSurface(name, rows(shots).filter(s => !who || clean(s.bowler) === who), gameEquipment);
    const spare = isSpareBall(name, specs);
    const p = spare ? { strength: null, length: null, shape: null, confidence: 0, tags: {}, oil: null, surfaceAssumed: true } : placeBall(specs, layout, surface);
    return {
      name, spare, specs, layout, surface,
      ...p,
      scoring: scoring.byBall[name] || null,
    };
  });
  return { balls: placed, overallAverage: scoring.overall };
}

// The axes the map can be drawn on. Each reads a ball and gives x/y on
// 0-100 (or null when the ball can't be placed on that chart).
export const MAP_VIEWS = [
  {
    id: "motion", label: "Length × Back end",
    x: { key: "length", low: "Early", high: "Long" },
    y: { key: "shape", low: "Smooth", high: "Sharp" },
    size: "strength",
    help: "Where each ball starts to hook, and how it turns. Bigger dots are stronger balls.",
  },
  {
    id: "ladder", label: "Length × Strength",
    x: { key: "length", low: "Early", high: "Long" },
    y: { key: "strength", low: "Weak", high: "Strong" },
    size: null,
    help: "The ladder: strongest at the top for fresh or heavy oil, weakest at the bottom for dry lanes and late in the block.",
  },
  {
    id: "core", label: "RG × Differential",
    x: { key: "rg", low: "Low RG (revs early)", high: "High RG (revs late)", min: 2.46, max: 2.8 },
    y: { key: "diff", low: "Low diff (less flare)", high: "High diff (more flare)", min: 0, max: 0.06 },
    size: "intDiff",
    help: "The core alone, as the maker's numbers. Bigger dots are more asymmetric.",
  },
];

// A ball's x/y on a view, as 0-100, or null.
export function pointFor(ball, view) {
  // Nothing to plot is null, which is what callers already filter on.
  if (!ball || typeof ball !== "object" || !view || typeof view !== "object"
      || !view.x || !view.y) return null;
  const read = axis => {
    if (axis.key === "rg" || axis.key === "diff") {
      const v = num(ball.specs?.[axis.key]);
      if (v === null) return null;
      return Math.round(clamp01((v - axis.min) / (axis.max - axis.min)) * 100);
    }
    return ball[axis.key] ?? null;
  };
  const x = read(view.x), y = read(view.y);
  if (x === null || y === null) return null;
  let size = 0.5;
  if (view.size === "strength" && ball.strength !== null) size = ball.strength / 100;
  if (view.size === "intDiff") size = ball.specs?.coreType === "asymmetric" ? clamp01((num(ball.specs?.intDiff) ?? 0) / 0.025) : 0;
  return { x, y, size };
}
