// The Caddie: what gets sent to be read back.
//
// Like the Nightcap, the model does no arithmetic and sees no prose from
// the app. Everything here is a number, an id from a closed set, or a
// ball/bag name -- and the edge function checks each of those again
// (supabase/functions/caddie) before any of it becomes a sentence.
//
// Positions, gaps and scoring are all worked out in arsenalMap.js first.
// The Caddie's job is judgement and voice: which ball for which
// condition, which bag is built right, what to add or retire.

const clean = v => String(v ?? "").trim();
const num = v => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};
const round = (v, dp) => (v === null ? null : Math.round(v * 10 ** dp) / 10 ** dp);

// Names travel, bounded. Letters, digits, spaces and a little
// punctuation; anything else is dropped, and the whole is capped.
export function safeName(v, cap = 40) {
  return clean(v).replace(/\s+/g, " ").replace(/[^\p{L}\p{N} .'\-/&+#()]/gu, "").replace(/\s+/g, " ").slice(0, cap).trim();
}

export const GAP_IDS = ["noSpare", "missingSpecs", "noHeavyOil", "noDryLanes", "noSharp", "noSmooth", "ladderGap", "overlap"];

function ballFact(b) {
  const s = b.specs || {};
  const lay = b.layout && b.layout.system ? {
    system: b.layout.system,
    values: Object.fromEntries(Object.entries(b.layout.values || {})
      .map(([k, v]) => [k, num(v)]).filter(([, v]) => v !== null)),
  } : null;
  const sc = b.scoring;
  return {
    name: safeName(b.name),
    spare: !!b.spare,
    cover: ["solid", "pearl", "hybrid"].includes(s.coverstock) ? s.coverstock : null,
    core: ["symmetric", "asymmetric"].includes(s.coreType) ? s.coreType : null,
    rg: round(num(s.rg), 3),
    diff: round(num(s.diff), 3),
    intDiff: s.coreType === "asymmetric" ? round(num(s.intDiff), 3) : null,
    surface: clean(b.surface) || null,
    surfaceAssumed: !!b.surfaceAssumed,
    layout: lay && Object.keys(lay.values).length ? lay : null,
    strength: b.strength ?? null,
    length: b.length ?? null,
    shape: b.shape ?? null,
    confidence: b.confidence ?? 0,
    scoring: sc ? {
      games: sc.games, avg: sc.avg, delta: sc.delta,
      bestPhase: sc.bestPhase || null,
      phases: Object.fromEntries(Object.entries(sc.phases || {}).map(([k, p]) => [k, { games: p.games, avg: p.avg }])),
    } : null,
    strikePct: b.strikePct ?? null,
    firstBalls: b.firstBalls ?? null,
  };
}

function gapFact(g, index) {
  if (!g || !GAP_IDS.includes(g.id)) return null;
  const at = n => index.get(n);
  switch (g.id) {
    case "missingSpecs": return { id: g.id, balls: (g.balls || []).map(at).filter(i => i !== undefined) };
    case "noHeavyOil": return { id: g.id, value: num(g.strongest) };
    case "noDryLanes": return { id: g.id, value: num(g.weakest) };
    case "ladderGap": return { id: g.id, a: at(g.above), b: at(g.below), value: num(g.gap) };
    case "overlap": return { id: g.id, a: at(g.a), b: at(g.b), value: num(g.distance) };
    default: return { id: g.id };
  }
}

// placed: balls from placeArsenal (with strikePct/firstBalls attached)
// bags:   [{ name, balls: [ball names] }]
// gaps:   { all: [...], byBag: { bagName: [...] } }
// candidates: [{ gapId, name, brand, placed, specs }]
export function buildCaddiePayload({ placed, bags, gaps, candidates, overallAverage, leftHanded, twoHanded, focus }) {
  const balls = (Array.isArray(placed) ? placed : []).slice(0, 30);
  const index = new Map(balls.map((b, i) => [b.name, i]));
  const bagList = (Array.isArray(bags) ? bags : []).slice(0, 6).map(bag => ({
    name: safeName(bag.name),
    balls: (bag.balls || []).map(n => index.get(n)).filter(i => i !== undefined),
    gaps: ((gaps?.byBag || {})[bag.name] || []).map(g => gapFact(g, index)).filter(Boolean).slice(0, 10),
  }));
  const cands = (Array.isArray(candidates) ? candidates : []).slice(0, 8).map(c => ({
    gap: GAP_IDS.includes(c.gapId) ? c.gapId : null,
    name: safeName(c.name),
    brand: safeName(c.brand, 20),
    cover: c.specs?.coverstock || null,
    core: c.specs?.coreType || null,
    rg: round(num(c.specs?.rg), 3),
    diff: round(num(c.specs?.diff), 3),
    intDiff: c.specs?.coreType === "asymmetric" ? round(num(c.specs?.intDiff), 3) : null,
    strength: c.placed?.strength ?? null,
    length: c.placed?.length ?? null,
    shape: c.placed?.shape ?? null,
  })).filter(c => c.gap && c.name);
  const payload = {
    focus: focus === "compare" ? "compare" : focus === "bag" ? "bag" : "all",
    bowler: {
      hand: leftHanded ? "left" : "right",
      style: twoHanded ? "two" : "one",
      average: num(overallAverage),
    },
    balls: balls.map(ballFact),
    bags: bagList,
    gaps: (gaps?.all || []).map(g => gapFact(g, index)).filter(Boolean).slice(0, 12),
    candidates: cands,
  };
  payload.fingerprint = fingerprint(payload);
  return payload;
}

// Same arsenal, same numbers, same read: cached on this.
export function fingerprint(payload) {
  const s = JSON.stringify({ ...payload, fingerprint: undefined });
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

// A reply, checked before it is rendered or cached.
export function normalizeCaddieReply(r) {
  if (!r || typeof r !== "object") return null;
  const str = (v, cap) => (typeof v === "string" && v.trim() ? v.trim().slice(0, cap) : null);
  const list = (v, cap, n) => (Array.isArray(v) ? v.map(x => str(x, cap)).filter(Boolean).slice(0, n) : []);
  const read = str(r.read, 600);
  if (!read) return null;
  return {
    read,
    roles: (Array.isArray(r.roles) ? r.roles : []).map(x => x && typeof x === "object"
      ? { ball: str(x.ball, 60), role: str(x.role, 240) } : null).filter(x => x && x.ball && x.role).slice(0, 30),
    bags: (Array.isArray(r.bags) ? r.bags : []).map(x => x && typeof x === "object"
      ? { bag: str(x.bag, 60), note: str(x.note, 400) } : null).filter(x => x && x.bag && x.note).slice(0, 6),
    gaps: list(r.gaps, 300, 5),
    nextBall: str(r.nextBall, 400),
    bench: str(r.bench, 300),
    generatedAt: str(r.generatedAt, 40),
  };
}
