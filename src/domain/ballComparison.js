import { isStk, tenthBall3Available } from "./scoring.js";

// Comparing balls against each other.
//
// Five balls with five numbers is the raw material for a comparison, not
// a comparison. This ranks them on each measure so the answer is read
// rather than worked out.
//
// FIRST BALLS AT A FULL RACK ONLY. That is what a strike ball is for and
// the only shot the balls genuinely compete at. A second ball at a 3-6-10
// says something about spare shooting, not about which ball carries --
// so spare conversion is deliberately absent here.

const rows = v => (Array.isArray(v) ? v : []).filter(x => x && typeof x === "object");
const clean = v => String(v ?? "").trim();
const num = v => {
  // Number(null) is 0 and Number("") is 0, so an absent value has to be
  // rejected before the conversion. Without this a null ballNum became 0,
  // failed the "is it ball 1" test, and every ordinary frame was dropped
  // from the comparison.
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

// The measures worth comparing, and which direction is better.
//
// "better" matters: a bowler scanning a table should not have to remember
// that a high split rate is bad.
export const BALL_METRICS = [
  { id: "strikeRate", label: "Strike", unit: "%", better: "higher" },
  { id: "firstBallAvg", label: "First ball", unit: "", better: "higher" },
  { id: "cornerPinRate", label: "Corner pin", unit: "%", better: "lower" },
  { id: "splitRate", label: "Splits", unit: "%", better: "lower" },
];

// Is this shot a first ball at a full rack?
//
// Frames 1-9 are simple: the frame's row is the first ball.
//
// The tenth is not, and my first attempt got it wrong -- it counted ball
// 3 only when ball 2 struck, which misses the commonest case. A SPARE in
// the tenth clears the rack, so the fill ball after it is thrown at ten
// pins and belongs in these numbers.
//
// Rather than re-derive the cases, this asks the app's own scorer:
// tenthBall3Available returns 10 exactly when ball 3 faces a full rack,
// including the "reached here via ball 1's spare" path. Two places
// working out the same rule is how they end up disagreeing.
function isFreshRack(shot, byFrame) {
  const ballNum = num(shot.ballNum);
  if (ballNum === null || ballNum === 1) return true;
  if (clean(shot.frame) !== "10") return false;

  const b1 = byFrame.get(`${clean(shot.game)}|1`);
  const b2 = byFrame.get(`${clean(shot.game)}|2`);

  // Ball 2 is a fresh rack only after a strike. After anything else it is
  // a spare attempt, which is not what a strike ball is judged on.
  if (ballNum === 2) return !!b1 && isStk(b1);
  if (ballNum === 3) return tenthBall3Available(b1, b2) === 10;
  return false;
}

export function ballComparison(shots, opts) {
  const o = (opts && typeof opts === "object") ? opts : {};
  const bowler = clean(o.bowler);
  const league = clean(o.league);
  const isSplit = typeof o.isSplit === "function" ? o.isSplit : () => false;
  const isCorner = typeof o.isCornerPinLeave === "function" ? o.isCornerPinLeave : () => false;
  const leftHanded = !!o.leftHanded;
  const minShots = num(o.minShots) ?? 0;

  const mine = rows(shots).filter(s =>
    (!bowler || clean(s.bowler) === bowler)
    && (!league || clean(s.league) === league)
    && clean(s.ball));

  // Tenth-frame balls indexed so a fill ball can see what preceded it.
  const byFrame = new Map();
  for (const s of mine) {
    if (clean(s.frame) === "10" && num(s.ballNum) !== null) {
      byFrame.set(`${clean(s.game)}|${num(s.ballNum)}`, s);
    }
  }

  const byBall = new Map();
  for (const s of mine) {
    if (!isFreshRack(s, byFrame)) continue;
    const ball = clean(s.ball);
    const cur = byBall.get(ball) || {
      ball, shots: 0, strikes: 0, corner: 0, splits: 0,
      leaveTotal: 0, leaveCount: 0,
      startTotal: 0, startCount: 0, arrowTotal: 0, arrowCount: 0,
    };
    cur.shots += 1;
    if (clean(s.result) === "Strike") cur.strikes += 1;
    else {
      // Pins KNOCKED DOWN on the first ball, not pins left standing.
      //
      // The By Ball card already showed this and called it "Leave Avg",
      // which is wrong twice over: 6.8 is not a leave, and my card
      // computed the opposite quantity under the same name. The two
      // disagreed by construction -- they summed to ten.
      //
      // First-ball average is the standard stat and says what it is.
      const named = clean(s.result) === "Weak 10" || clean(s.result) === "Ringing 10";
      const standing = named ? 1 : (Array.isArray(s.otherLeave) ? s.otherLeave.length : null);
      if (standing !== null) { cur.leaveTotal += (10 - standing); cur.leaveCount += 1; }
      if (isCorner(s, leftHanded)) cur.corner += 1;
      if (isSplit(s)) cur.splits += 1;
    }
    const start = num(s.startingBoard);
    if (start !== null) { cur.startTotal += start; cur.startCount += 1; }
    const arrows = num(s.actualArrows);
    if (arrows !== null) { cur.arrowTotal += arrows; cur.arrowCount += 1; }
    byBall.set(ball, cur);
  }

  const pct = (a, b) => (b > 0 ? Math.round((a / b) * 100) : null);
  const avg = (total, n, dp = 1) =>
    (n > 0 ? Math.round((total / n) * 10 ** dp) / 10 ** dp : null);

  return [...byBall.values()]
    .filter(b => b.shots >= minShots)
    .map(b => ({
      ball: b.ball,
      shots: b.shots,
      strikeRate: pct(b.strikes, b.shots),
      firstBallAvg: avg(b.leaveTotal, b.leaveCount),
      cornerPinRate: pct(b.corner, b.shots),
      splitRate: pct(b.splits, b.shots),
      startBoard: avg(b.startTotal, b.startCount),
      arrowBoard: avg(b.arrowTotal, b.arrowCount),
    }))
    .sort((a, b) => (b.strikeRate ?? -1) - (a.strikeRate ?? -1));
}

// Which ball leads on each measure.
//
// Returns the ball name per metric, or null when it is too close to
// separate -- a near-tie named as a winner is a finding invented from a
// rounding error.
export function bestByMetric(comparison, opts) {
  const o = (opts && typeof opts === "object") ? opts : {};
  const list = rows(comparison);
  const out = {};
  for (const m of BALL_METRICS) {
    const withValue = list.filter(b => b[m.id] !== null && b[m.id] !== undefined);
    if (withValue.length < 2) { out[m.id] = null; continue; }
    const sorted = [...withValue].sort((a, b) =>
      m.better === "higher" ? b[m.id] - a[m.id] : a[m.id] - b[m.id]);
    const gap = Math.abs(sorted[0][m.id] - sorted[1][m.id]);
    // Percentages need a wider margin than a leave average, which is in
    // pins and moves in tenths.
    const need = num(o.margin) ?? (m.unit === "%" ? 8 : 0.5);
    out[m.id] = gap >= need ? sorted[0].ball : null;
  }
  return out;
}

// The line a ball is typically thrown on, as points down the lane.
export const ARROWS_FEET = 15;
export const BREAKPOINT_FEET = 40;
export const FOUL_LINE_TO_PINS = 60;
export const POCKET_BOARD = 17.5;

// Two known points and two assumptions, and the difference is marked.
//
// Known: where the feet start, and the board crossed at the arrows.
// Assumed: the breakpoint, because nothing records where the ball
// actually turns, and the pocket, because that is where it is aimed
// rather than where it went.
export function ballLine(entry, opts) {
  const o = (opts && typeof opts === "object") ? opts : {};
  const e = entry && typeof entry === "object" ? entry : {};
  const start = num(e.startBoard);
  const arrows = num(e.arrowBoard);
  if (start === null || arrows === null) return null;

  // Boards stay in the bowler's OWN numbering -- board 1 is their own
  // gutter, whichever hand they throw with. The mirroring belongs in the
  // drawing, not here: doing it in both places flipped a right-hander's
  // line twice and sent the ball out to the wrong side.

  // Past the arrows the ball is still moving outward before it turns.
  // Continuing the same angle to the breakpoint is the simplest honest
  // guess, and it is flagged as a guess.
  // Damped, not extended at full angle.
  //
  // Feet-to-arrows is steeper than the ball's actual path: it includes
  // the angle of the approach. Continuing it at full rate sent a 22-to-10
  // line into the gutter by forty feet, which no shot does.
  //
  // A fifth of the rate puts the breakpoint a few boards outside the
  // arrows, which is what the line actually looks like. Floored at 3 --
  // the ball rides the dry, it does not leave the lane.
  const perFoot = (arrows - start) / ARROWS_FEET;
  const projected = arrows + perFoot * (BREAKPOINT_FEET - ARROWS_FEET) * 0.2;
  const breakpoint = Math.max(3, Math.min(37, projected));

  return {
    ball: e.ball,
    points: [
      { feet: 0, board: start, known: true },
      { feet: ARROWS_FEET, board: arrows, known: true },
      { feet: BREAKPOINT_FEET, board: breakpoint, known: false },
      { feet: FOUL_LINE_TO_PINS, board: POCKET_BOARD, known: false },
    ],
  };
}

// Colours for the comparison, assigned by position rather than hashed.
//
// The name hash ArsenalList uses snaps hues to 30-degree steps, and with
// five balls three of them collided on the same purple. That is survivable
// on a list where the name is right there; on a chart where the colour IS
// the label it is useless.
//
// Fixed palette, taken in order, so distinctness is guaranteed rather
// than hoped for. The order is the comparison's own -- best carry first
// -- so the leading ball is always the same colour as the top row.
export const BALL_PALETTE = [
  "#2f7ed8", "#e07b39", "#4aa564", "#b5539c", "#d4a017",
  "#3aa9a3", "#c2504a", "#7a6ff0",
];

export function ballColors(comparison) {
  const out = {};
  (Array.isArray(comparison) ? comparison : []).forEach((b, i) => {
    if (b && b.ball) out[b.ball] = BALL_PALETTE[i % BALL_PALETTE.length];
  });
  return out;
}

// The trajectory, as one continuous curve.
//
// A ball does not make angular moves. My first attempt drew straight
// segments then a quadratic, which put a visible corner at the
// breakpoint -- the tangent changed direction in a single point, and the
// eye sees that as a kink.
//
// A Catmull-Rom spline passes through every point with the tangent at
// each one derived from its neighbours, so curvature carries across the
// joins. Converted to cubic Beziers because SVG has no Catmull-Rom.
//
// Where the points are nearly collinear -- the long oiled run from the
// feet to the breakpoint -- it stays nearly straight of its own accord.
// The bend appears where the points actually bend, which is the hook.
export function catmullRomSegments(points) {
  const p = (Array.isArray(points) ? points : []).filter(q => q && typeof q === "object");
  if (p.length < 2) return [];

  // Phantom points at each end so the first and last real points get a
  // tangent too, rather than starting flat.
  const ext = [
    { board: p[0].board * 2 - p[1].board, feet: p[0].feet * 2 - p[1].feet },
    ...p,
    { board: p[p.length - 1].board * 2 - p[p.length - 2].board,
      feet: p[p.length - 1].feet * 2 - p[p.length - 2].feet },
  ];

  const out = [];
  for (let i = 1; i < ext.length - 2; i++) {
    const p0 = ext[i - 1], p1 = ext[i], p2 = ext[i + 1], p3 = ext[i + 2];
    // The standard conversion: control points sit a sixth of the way
    // along each neighbour-to-neighbour vector.
    out.push({
      from: p1,
      to: p2,
      c1: { board: p1.board + (p2.board - p0.board) / 6,
            feet: p1.feet + (p2.feet - p0.feet) / 6 },
      c2: { board: p2.board - (p3.board - p1.board) / 6,
            feet: p2.feet - (p3.feet - p1.feet) / 6 },
    });
  }
  return out;
}

// One SVG path from a run of those segments.
export function trajectoryPath(points, x, y) {
  const segs = catmullRomSegments(points);
  if (!segs.length) return "";
  let d = `M ${x(segs[0].from.board)} ${y(segs[0].from.feet)}`;
  for (const s of segs) {
    d += ` C ${x(s.c1.board)} ${y(s.c1.feet)}, ${x(s.c2.board)} ${y(s.c2.feet)},`
      + ` ${x(s.to.board)} ${y(s.to.feet)}`;
  }
  return d;
}
