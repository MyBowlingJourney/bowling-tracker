// Brooklyn's breakdowns: the bowler's shot data, sliced.
//
// Brooklyn is for the questions the Stats screens do not answer. Those
// are nearly always a number within a SLICE of the data -- "on the left
// lane", "in game 3", "with the Phaze", "on Shark" -- and the ~30
// headline figures she was sent had no slices at all.
//
// Sending raw shots would answer anything, but three seasons of shots is
// ~600k tokens (~$0.45 a question). These are the same shots pre-cut into
// small tables, a few thousand characters however much has been logged,
// so a question stays under a cent.
//
// Each bucket carries the same three figures the Stats screens use,
// computed the same way (see shotBreakdown in coaching.js):
//   strike %  -- of first balls only
//   spare %   -- non-split spare attempts converted
//   split %   -- first balls that left a split
// and how many first balls it rests on, so she can say when a slice is
// too thin. Slices under `minSample` first balls are left out entirely:
// "100% strikes on lane 23" from two shots is not a finding.
//
// Output is plain text lines, already trimmed to `maxChars`. The most
// useful dimensions come first, so trimming drops the least useful.

const clean = v => String(v ?? "").trim();
const num = v => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};
const isFirst = s => !s.ballNum || Number(s.ballNum) === 1;
const pct = (a, b) => (b ? Math.round((a / b) * 100) : null);

// Stats for one bucket of shots, or null when it is too thin to use.
export function bucketStats(shots, { isSplit, minSample = 8 } = {}) {
  const list = (Array.isArray(shots) ? shots : []).filter(Boolean);
  const first = list.filter(isFirst);
  if (first.length < minSample) return null;
  const strikes = first.filter(s => s.result === "Strike").length;
  const split = typeof isSplit === "function" ? isSplit : () => false;
  const spareTries = list.filter(s => s.result !== "Strike" && clean(s.spareMade) !== "" && !split(s));
  const spareMade = spareTries.filter(s => s.spareMade === "Yes").length;
  const splits = first.filter(s => s.result !== "Strike" && split(s)).length;
  return {
    n: first.length,
    strike: pct(strikes, first.length),
    spare: spareTries.length >= 3 ? pct(spareMade, spareTries.length) : null,
    split: pct(splits, first.length),
  };
}

function formatBucket(label, st) {
  const parts = [`${st.n}fb`, `X${st.strike}%`];
  if (st.spare !== null) parts.push(`sp${st.spare}%`);
  parts.push(`spl${st.split}%`);
  return `${label} ${parts.join(" ")}`;
}

// One dimension: group, measure, drop thin buckets, order, cap.
function dimensionLine(title, shots, keyFn, opts, { order = "count", limit = 12 } = {}) {
  const groups = new Map();
  for (const s of shots) {
    let k;
    try { k = keyFn(s); } catch { k = null; }
    if (k === null || k === undefined || k === "") continue;
    const key = String(k);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(s);
  }
  let rows = [...groups.entries()]
    .map(([k, list]) => ({ k, st: bucketStats(list, opts) }))
    .filter(r => r.st);
  if (rows.length < 2) return null;             // one bucket is not a comparison
  if (order === "natural") {
    rows.sort((a, b) => {
      const na = parseFloat(a.k), nb = parseFloat(b.k);
      return Number.isFinite(na) && Number.isFinite(nb) ? na - nb : a.k.localeCompare(b.k);
    });
  } else {
    rows.sort((a, b) => b.st.n - a.st.n);
  }
  rows = rows.slice(0, limit);
  return `${title}: ${rows.map(r => formatBucket(r.k, r.st)).join("; ")}`;
}

// Which lane of the pair a shot was thrown on. Pairs are (1,2), (3,4)...
// so an odd lane is the left one. Answers "on the left lane" without the
// bowler needing to remember numbers.
export function laneSide(lane) {
  const n = num(lane);
  if (n === null || n < 1) return null;
  return n % 2 === 1 ? "left lane" : "right lane";
}

// Early / middle / late in a game.
export function frameStage(frame) {
  const f = num(frame);
  if (f === null || f < 1) return null;
  return f <= 3 ? "frames 1-3" : f <= 7 ? "frames 4-7" : "frames 8-10";
}

function speedBand(v) {
  const n = num(v);
  if (n === null || n <= 0) return null;
  const lo = Math.floor(n);
  return `${lo}-${lo + 1}mph`;
}

function revBand(v) {
  const n = num(v);
  if (n === null || n <= 0) return null;
  const lo = Math.floor(n / 50) * 50;
  return `${lo}-${lo + 49}rpm`;
}

const firstMiss = s => (Array.isArray(s.miss) ? s.miss[0] : s.miss) || null;

export function genieBreakdowns(shots, options) {
  const o = (options && typeof options === "object") ? options : {};
  const list = (Array.isArray(shots) ? shots : []).filter(s => s && typeof s === "object");
  if (!list.length) return [];
  const minSample = Number.isFinite(o.minSample) ? o.minSample : 8;
  const maxChars = Number.isFinite(o.maxChars) ? o.maxChars : 4500;
  const opts = { isSplit: o.isSplit, minSample };
  const patternFor = typeof o.patternFor === "function" ? o.patternFor : () => null;
  const centerFor = typeof o.centerFor === "function" ? o.centerFor : () => null;
  const kindFor = typeof o.kindFor === "function" ? o.kindFor : () => null;

  // Most useful first: trimming to maxChars drops from the bottom.
  const dims = [
    ["By ball", s => clean(s.ball) || null],
    ["By game of the night", s => (num(s.game) ? `game ${num(s.game)}` : null), { order: "natural" }],
    ["By lane of the pair", s => laneSide(s.lane)],
    ["By part of the game", s => frameStage(s.frame), { order: "natural" }],
    ["By oil pattern", s => patternFor(s.league, s.date)],
    ["By kind of night", s => kindFor(s.league)],
    ["By centre", s => centerFor(s.league)],
    ["By release", s => clean(s.release) || null],
    ["By where it missed", s => firstMiss(s)],
    ["By ball speed", s => speedBand(s.ballSpeed), { order: "natural" }],
    ["By rev rate", s => revBand(s.revRate), { order: "natural" }],
    ["By lane", s => (num(s.lane) ? `lane ${num(s.lane)}` : null), { order: "natural", limit: 16 }],
    ["By frame", s => (num(s.frame) ? `frame ${num(s.frame)}` : null), { order: "natural" }],
    ["By surface", s => clean(s.surface) || null],
    // Combinations bowlers actually ask about.
    ["By game and lane of the pair", s => {
      const g = num(s.game), side = laneSide(s.lane);
      return g && side ? `game ${g} ${side}` : null;
    }, { order: "natural" }],
    ["By ball and oil pattern", s => {
      const b = clean(s.ball), p = patternFor(s.league, s.date);
      return b && p ? `${b} on ${p}` : null;
    }],
    ["By ball and game", s => {
      const b = clean(s.ball), g = num(s.game);
      return b && g ? `${b} game ${g}` : null;
    }],
    ["By ball and lane of the pair", s => {
      const b = clean(s.ball), side = laneSide(s.lane);
      return b && side ? `${b} ${side}` : null;
    }],
  ];

  const header = `Breakdowns of logged shots. Key: fb = first balls, X = strike %, sp = non-split spare conversion %, spl = split % of first balls. Slices under ${minSample} first balls are left out; a missing slice means too little data, not zero.`;
  const out = [header];
  let used = header.length;
  for (const [title, fn, cfg] of dims) {
    const line = dimensionLine(title, list, fn, opts, cfg);
    if (!line) continue;
    if (used + line.length + 1 > maxChars) continue;  // skip; a shorter later line may still fit
    out.push(line);
    used += line.length + 1;
  }
  return out.length > 1 ? out : [];
}
