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
// The skid itself is a parabola through the laydown, the arrow board and
// the breakpoint, so the recorded arrow is honoured rather than ignored
// -- and a parabola has no inflection point either. Both halves are
// individually inflection-free, and the guard below makes sure they
// curve the same way so the join between them is not one.

// How much bend the skid needs before it is drawn as a curve at all.
//
// A ball cannot turn right harder and harder: friction only ever takes
// the turn out of it. A parabola bending that way means the three
// recorded boards disagree, and a straight skid is the honest drawing.
//
// The floor matters as much as the sign. On a good shot the three boards
// are very nearly collinear, so the curvature is a rounding error away
// from zero, its SIGN is noise, and what it describes is a straight line
// with an invisible wobble in it. A real hook measures around 0.008
// boards per foot squared and the troublesome near-collinear cases
// measured about 0.0014, so the floor sits between them rather than
// just above zero.
const MIN_CURVATURE = 3e-3;

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
 * @returns {skid, hook, usedArrow} -- two `d` strings, and whether the
 *          arrow board could be honoured. Empty strings when there is
 *          not enough to draw.
 */
export function lanePath(points, x, y) {
  const p = (Array.isArray(points) ? points : [])
    .filter(q => q && num(q.feet) !== null && num(q.board) !== null)
    .map(q => ({ f: num(q.feet), b: num(q.board) }));
  if (p.length < 2 || typeof x !== "function" || typeof y !== "function") {
    return { skid: "", hook: "", usedArrow: false };
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

  // ── The skid ──────────────────────────────────────────────────────
  let quad = null;
  if (arrow && arrow.f > lay.f && brk.f > arrow.f) {
    // Lagrange's second divided difference: the parabola's curvature.
    const A = (lay.b / ((lay.f - arrow.f) * (lay.f - brk.f)))
            + (arrow.b / ((arrow.f - lay.f) * (arrow.f - brk.f)))
            + (brk.b / ((brk.f - lay.f) * (brk.f - arrow.f)));
    if (A > MIN_CURVATURE) {
      const linear = (brk.b - lay.b) / (brk.f - lay.f) - A * (lay.f + brk.f);
      quad = { A, slopeAt: f => 2 * A * f + linear };
    }
  }

  let skid;
  let slope;
  if (quad) {
    const s0 = quad.slopeAt(lay.f), s2 = quad.slopeAt(brk.f);
    const third = (brk.f - lay.f) / 3;
    const c1 = { f: lay.f + third, b: lay.b + s0 * third };
    const c2 = { f: brk.f - third, b: brk.b - s2 * third };

    // Do the two halves bend the same way?
    //
    // Each being inflection-free is not enough: if they curve opposite
    // ways, the JOIN between them is an inflection, and that is an S
    // with one bend in each half. It only happens on data a bowler
    // cannot actually produce -- a breakpoint further in than the
    // pocket, so the ball has to come back the other way -- but the
    // drawing must not go strange when the numbers do. Compared as
    // signed areas rather than reasoned about in sign algebra: cheap,
    // exact, and impossible to get subtly wrong.
    const cross = (ab, af, bb, bf) => ab * bf - af * bb;
    const span = pocket.f - brk.f;
    const ctrl = { f: brk.f + span * 0.55, b: brk.b + s2 * span * 0.55 };
    const skidTurn = cross(c1.b - lay.b, c1.f - lay.f, c2.b - c1.b, c2.f - c1.f);
    const hookTurn = cross(ctrl.b - brk.b, ctrl.f - brk.f, pocket.b - ctrl.b, pocket.f - ctrl.f);

    if (skidTurn * hookTurn < 0) {
      quad = null;
    } else {
      // A parabola IS a cubic Bezier, exactly.
      skid = `M ${at(lay.b, lay.f)} C ${at(c1.b, c1.f)}, ${at(c2.b, c2.f)}, ${at(brk.b, brk.f)}`;
      slope = s2;
    }
  }

  if (!quad) {
    skid = `M ${at(lay.b, lay.f)} L ${at(brk.b, brk.f)}`;
    slope = brk.f === lay.f ? 0 : (brk.b - lay.b) / (brk.f - lay.f);
  }

  // ── The hook ──────────────────────────────────────────────────────
  const span = pocket.f - brk.f;
  const ctrl = { f: brk.f + span * 0.55, b: brk.b + slope * span * 0.55 };
  const hook = `M ${at(brk.b, brk.f)} Q ${at(ctrl.b, ctrl.f)}, ${at(pocket.b, pocket.f)}`;

  return { skid, hook, usedArrow: !!quad };
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
