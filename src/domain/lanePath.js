// Drawing a ball down a lane.
//
// ── Why this is not a spline ────────────────────────────────────────────
//
// It was one, twice, and both times the line came out with an S in it.
//
// A spline INTERPOLATES: it is dragged through every recorded point, and
// the tangent at each point is set by its neighbours. So the pocket
// pulled on the tangent at the breakpoint and the breakpoint pulled back
// up the lane, and -- worse -- the laydown, the arrows and the
// breakpoint are never exactly collinear, because nothing a person
// sights down a lane ever is. The curve bent one way to reach the
// arrows and back the other to reach the breakpoint. Two opposite bends
// in one line, which is exactly what an S is.
//
// Monotone interpolation (Fritsch-Carlson) was the second attempt. It
// killed the overshoot past the breakpoint and kept the S, which is what
// finally made the point: the wobble really is in the numbers. It is
// just not in the BALL.
//
// ── What a ball actually does ───────────────────────────────────────────
//
// It skids. While it is on oil nothing is turning it, so it runs
// essentially straight. Then it reaches dry boards and it arcs, once,
// into the pocket. Two pieces, one bend -- so that is what gets drawn:
//
//   laydown -> breakpoint   the skid
//   breakpoint -> pocket    the hook, ONE quadratic Bezier
//
// The hook's control point sits on the tangent the skid arrived with, so
// it leaves the breakpoint in exactly the direction the skid got there
// and there is no kink. And a quadratic Bezier is convex by
// construction: three points, one bend, it cannot inflect whatever the
// numbers say. The S is not tuned out here, it is unrepresentable.
//
// The skid is drawn as the straight line it is -- see below -- so the
// only curvature in the whole path is the hook's.

// ── The skid is STRAIGHT ────────────────────────────────────────────────
//
// It was a parabola through the laydown, the arrow board and the
// breakpoint, so that the recorded arrow was honoured rather than
// ignored. That was the wrong trade. A parabola cannot inflect, so the
// line was never an S again -- but it was visibly bowed for the whole
// first forty feet, and a ball on oil does not bow. It skids. Nothing is
// turning it yet.
//
// So the skid is a line and the arrow is a MARKER on it, which is what
// an arrow is: a board you sight over on the way past, not a point the
// ball is dragged through. Two or three boards of disagreement between
// the arrow and the line is the bowler's eye and the averaging, not the
// ball changing direction twice in the heads.
//
// All the curvature lives in the hook, where the friction is. That is
// also what makes this construction trivially safe: one straight
// segment and one quadratic Bezier, and a quadratic is convex by
// construction, so the finished line has exactly one bend no matter what
// the numbers say.

const num = v => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

/**
 * The two path strings for one shot.
 *
 * @param points  ballLine()'s four points: laydown, arrows, breakpoint,
 *                pocket, each {feet, board}
 * @param x       board -> screen x
 * @param y       feet  -> screen y
 *
 * @returns {skid, hook, arrowCrossing} -- two `d` strings, and the board
 *          the skid crosses at the arrows, so the card can show it
 *          against the one that was recorded. Empty strings when there
 *          is not enough to draw.
 */
export function lanePath(points, x, y) {
  const p = (Array.isArray(points) ? points : [])
    .filter(q => q && num(q.feet) !== null && num(q.board) !== null)
    .map(q => ({ f: num(q.feet), b: num(q.board) }));
  if (p.length < 2 || typeof x !== "function" || typeof y !== "function") {
    return { skid: "", hook: "", arrowCrossing: null };
  }

  const lay = p[0];
  const pocket = p[p.length - 1];
  // The breakpoint is the last point before the pocket; the arrow is the
  // one between it and the laydown, when there is one.
  const brk = p.length >= 3 ? p[p.length - 2] : pocket;
  const arrow = p.length >= 4 ? p[1] : null;

  // Three decimals, not one.
  //
  // The hook's control point sits ON the tangent the skid arrives with,
  // and that is the whole reason the join is smooth. Rounding it to a
  // tenth of a pixel knocks it off that tangent: at one decimal the join
  // bent by about a sixth of a degree. Invisible on screen -- but it is
  // a real kink, at exactly the join this construction exists to
  // protect, and it was enough to make the curve test argue. Three
  // decimals puts it two orders of magnitude under anything a bend
  // detector could mistake for a bend, at the cost of a few characters
  // per path.
  const at = (b, f) => `${x(b).toFixed(3)} ${y(f).toFixed(3)}`;

  // ── Where the arc begins ──────────────────────────────────────────
  //
  // The breakpoint is, by definition, the point the ball is FURTHEST
  // out: it stops going right there and starts coming back. So the
  // drawn line must not pass outside it.
  //
  // A single arc leaving the breakpoint along the skid's own direction
  // cannot do that -- it is still travelling outward at the moment it
  // starts, so it keeps going and reaches its apex a board or two wide.
  // Measured, that was one to one and a half boards past the dot the
  // card draws at the breakpoint, so the line visibly passed outside its
  // own marker.
  //
  // So the ball starts turning BEFORE the breakpoint, which is also what
  // it really does -- the ball rolls out of the oil over a few feet, it
  // does not switch. The skid runs dead straight to a point short of the
  // breakpoint, and from there two quadratics carry it through:
  //
  //   skid end -> breakpoint   turning, ending parallel to the lane
  //   breakpoint -> pocket     turning the same way, back to the pocket
  //
  // They meet at the breakpoint with the same horizontal tangent, so
  // there is no kink, the apex is EXACTLY the recorded board, and both
  // halves are quadratics -- convex by construction, so the whole line
  // still has exactly one bend.
  // ── Does it actually hook back? ───────────────────────────────────
  //
  // The apex construction below assumes the breakpoint IS one: that the
  // ball goes out to it and comes back. Sometimes the recorded numbers
  // do not say that -- a laydown of 1, a breakpoint of 12 and a pocket
  // of 17.5 all march the same way, so there is no furthest-out point at
  // all. Forcing a flat tangent onto a line that never turns puts a bend
  // in and takes it out again, which is the S this file exists to
  // prevent.
  //
  // So it is asked rather than assumed, and a line that only ever goes
  // one way is drawn as one.
  const out = brk.b - lay.b;
  const back = pocket.b - brk.b;
  const turnsBack = out * back < 0;

  let skid, arrowCrossing, hook;

  if (turnsBack) {
    // The breakpoint is by definition the point the ball is FURTHEST
    // out: it stops going right there and starts coming back. So the
    // drawn line must not pass outside it.
    //
    // A single arc leaving the breakpoint along the skid's own direction
    // cannot manage that -- it is still travelling outward at the moment
    // it starts, so it keeps going and reaches its apex a board or two
    // wide. Measured, that was one to one and a half boards past the dot
    // the card draws at the breakpoint: the line passed outside its own
    // marker.
    //
    // So the ball starts turning BEFORE the breakpoint, which is what it
    // really does -- it rolls out of the oil over a few feet, it does
    // not switch. The skid runs dead straight to a point short of the
    // breakpoint, and from there two quadratics carry it through:
    //
    //   skid end -> breakpoint   turning, ending parallel to the lane
    //   breakpoint -> pocket     turning the same way, into the pocket
    //
    // They meet at the breakpoint with the same horizontal tangent, so
    // there is no kink, the apex is EXACTLY the recorded board, and both
    // halves are quadratics -- convex by construction, so the whole line
    // still has exactly one bend.
    const ROLLOUT = 0.25;                  // of the run from laydown
    const run = brk.f - lay.f;
    const d = Math.max(0, run * ROLLOUT);

    // The skid's slope, solved so the apex lands on the recorded board.
    // The arc's control point sits half way through the roll-out, which
    // fixes where the skid has to end, and that fixes the slope.
    const denom = run - d / 2;
    const slope = denom === 0 ? 0 : out / denom;
    const skidEnd = { f: brk.f - d, b: brk.b - slope * d / 2 };
    const span = pocket.f - brk.f;

    skid = `M ${at(lay.b, lay.f)} L ${at(skidEnd.b, skidEnd.f)}`;
    arrowCrossing = arrow ? lay.b + slope * (arrow.f - lay.f) : null;
    hook = `M ${at(skidEnd.b, skidEnd.f)}`
      + ` Q ${at(brk.b, skidEnd.f + d / 2)}, ${at(brk.b, brk.f)}`
      + ` Q ${at(brk.b, brk.f + span * 0.45)}, ${at(pocket.b, pocket.f)}`;
  } else {
    // No turn: straight to the breakpoint, then one quadratic easing
    // into the pocket along the direction it arrived with. Nothing to
    // overshoot, because there is no apex.
    const run = brk.f - lay.f;
    const slope = run === 0 ? 0 : out / run;
    const span = pocket.f - brk.f;

    skid = `M ${at(lay.b, lay.f)} L ${at(brk.b, brk.f)}`;
    arrowCrossing = arrow ? lay.b + slope * (arrow.f - lay.f) : null;
    hook = `M ${at(brk.b, brk.f)}`
      + ` Q ${at(brk.b + slope * span * 0.55, brk.f + span * 0.55)}, ${at(pocket.b, pocket.f)}`;
  }

  return { skid, hook, arrowCrossing };
}

// The rack, headpin nearest the bowler.
//
// Real geometry, not a decorative triangle: pins are 12 inches apart,
// which is 11.3 boards on a 41.5-inch lane, and the rows are 10.4 inches
// deep. Board 1 is the bowler's own gutter, so for a right-hander the
// 3 pin is the LOWER board -- it sits on their side of the headpin.
export const RACK = Object.freeze([
  { pin: 1, board: 20, feet: 60 },
  { pin: 3, board: 14.4, feet: 60.87 }, { pin: 2, board: 25.6, feet: 60.87 },
  { pin: 6, board: 8.7, feet: 61.73 }, { pin: 5, board: 20, feet: 61.73 },
  { pin: 4, board: 31.3, feet: 61.73 },
  { pin: 10, board: 3.1, feet: 62.6 }, { pin: 9, board: 14.4, feet: 62.6 },
  { pin: 8, board: 25.6, feet: 62.6 }, { pin: 7, board: 36.9, feet: 62.6 },
]);

// The boards that carry a dot, an arrow and a printed number.
export const MARK_BOARDS = Object.freeze([5, 10, 15, 20, 25, 30, 35]);

// The two pins the line is aimed between.
//
// Canonical by HAND, not by number: a right-hander's pocket is the 1-3,
// a left-hander's is the 1-2. Drawing the 1-3 for everybody put a
// lefty's target on the wrong side of the headpin.
export function pocketPins(leftHanded) {
  return leftHanded ? [1, 2] : [1, 3];
}
