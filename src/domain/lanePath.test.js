import { describe, it, expect } from 'vitest';
import { lanePath, RACK, MARK_BOARDS, pocketPins } from './lanePath.js';
import { ballLine } from './ballComparison.js';

// ── The one property this module exists for ─────────────────────────────
//
// No drawn line ever bends twice. Two splines were tried before this and
// both put an S in the line; the fix was to stop interpolating and draw
// the two things a ball actually does -- a straight-ish skid and one arc
// -- so that a second bend is unrepresentable rather than merely absent.
//
// These tests measure the rendered path rather than trusting the
// construction, because "it cannot happen" is exactly the claim worth
// checking.

const x = b => 300 - (b - 1) * 7;     // the real orientation: board 1 right
const y = f => 800 - f * 12;          // down the lane is up the screen

// Walk the path string and hand back points along it.
function samplePath(d, steps = 100) {
  const out = [];
  const re = /([ML]) (-?[\d.]+) (-?[\d.]+)|C (-?[\d.]+) (-?[\d.]+), (-?[\d.]+) (-?[\d.]+), (-?[\d.]+) (-?[\d.]+)|Q (-?[\d.]+) (-?[\d.]+), (-?[\d.]+) (-?[\d.]+)/g;
  let cur = null, m;
  while ((m = re.exec(d))) {
    if (m[1]) {
      const p = [+m[2], +m[3]];
      if (m[1] === 'L' && cur) {
        for (let s = 1; s <= steps; s++) {
          const t = s / steps;
          out.push([cur[0] + (p[0] - cur[0]) * t, cur[1] + (p[1] - cur[1]) * t]);
        }
      } else out.push(p);
      cur = p;
    } else if (m[4] !== undefined) {
      const a = [+m[4], +m[5]], b = [+m[6], +m[7]], p = [+m[8], +m[9]];
      for (let s = 1; s <= steps; s++) {
        const t = s / steps, u = 1 - t;
        out.push([u * u * u * cur[0] + 3 * u * u * t * a[0] + 3 * u * t * t * b[0] + t * t * t * p[0],
                  u * u * u * cur[1] + 3 * u * u * t * a[1] + 3 * u * t * t * b[1] + t * t * t * p[1]]);
      }
      cur = p;
    } else {
      const c = [+m[10], +m[11]], p = [+m[12], +m[13]];
      for (let s = 1; s <= steps; s++) {
        const t = s / steps, u = 1 - t;
        out.push([u * u * cur[0] + 2 * u * t * c[0] + t * t * p[0],
                  u * u * cur[1] + 2 * u * t * c[1] + t * t * p[1]]);
      }
      cur = p;
    }
  }
  return out;
}

// How many times the line changes which way it bends. One = a hook.
// Two or more = an S.
//
// Measured as the ANGLE between successive steps, not a raw cross
// product: a cross product's magnitude scales with the sample spacing,
// so a fixed epsilon would be a different tolerance on every segment.
function bendsBothWays(pts) {
  let changes = 0, prev = 0;
  for (let i = 2; i < pts.length; i++) {
    const ax = pts[i - 1][0] - pts[i - 2][0], ay = pts[i - 1][1] - pts[i - 2][1];
    const bx = pts[i][0] - pts[i - 1][0], by = pts[i][1] - pts[i - 1][1];
    const la = Math.hypot(ax, ay), lb = Math.hypot(bx, by);
    if (la < 1e-9 || lb < 1e-9) continue;
    const sin = (ax * by - ay * bx) / (la * lb);
    // Under 0.06 degrees. A real hook turns about 0.3 degrees per
    // sample at this spacing, so this sits five times under the
    // smallest thing worth calling a bend and well over the rounding
    // in the path string.
    if (Math.abs(sin) < 1e-3) continue;
    const s = Math.sign(sin);
    if (prev !== 0 && s !== prev) changes++;
    prev = s;
  }
  return changes;
}

const whole = r => `${r.skid} ${r.hook.slice(r.hook.indexOf(' Q'))}`;

describe('a drawn line never bends twice', () => {
  // Straight through ballLine, which is what the card actually feeds it,
  // over every shot the log screen can produce.
  it('holds across every shot ballLine can build', () => {
    const bad = [];
    let swept = 0;
    for (let startBoard = 5; startBoard <= 39; startBoard += 2) {
      for (let arrowBoard = 1; arrowBoard <= 25; arrowBoard += 2) {
        for (const breakpointBoard of [null, 3, 7, 12, 20]) {
          for (const patternLength of [null, 36, 41, 47]) {
            const line = ballLine({ ball: 'b', startBoard, arrowBoard, breakpointBoard },
                                  { patternLength });
            if (!line) continue;
            swept++;
            const n = bendsBothWays(samplePath(whole(lanePath(line.points, x, y))));
            if (n !== 0) bad.push({ startBoard, arrowBoard, breakpointBoard, patternLength, n });
          }
        }
      }
    }
    expect(swept).toBeGreaterThan(4000);
    expect(bad).toEqual([]);
  });

  // The one Ryan spotted: a deep line, out to the left and a long way
  // back. It was the worst of them because its two bends were furthest
  // apart, not because it was the only one.
  it('holds on a deep line', () => {
    const line = ballLine({ ball: 'b', startBoard: 28, arrowBoard: 17, breakpointBoard: 5 },
                          { patternLength: 39 });
    expect(bendsBothWays(samplePath(whole(lanePath(line.points, x, y))))).toBe(0);
  });
});

describe('the two pieces join smoothly', () => {
  // The hook's control point sits on the tangent the skid arrives with.
  // That is the whole reason there is no kink, and rounding the output
  // to a tenth of a pixel was enough to break it.
  it('has no kink at the breakpoint', () => {
    // Measured on the TANGENTS, not on samples. Sampling the last step
    // of the skid against the first step of the hook compares two
    // chords, and the hook's first chord already contains real
    // curvature -- so that measures how hard the ball turns, not
    // whether the two pieces meet smoothly.
    const line = ballLine({ ball: 'b', startBoard: 25, arrowBoard: 15, breakpointBoard: 7 },
                          { patternLength: 41 });
    const r = lanePath(line.points, x, y);
    const n = d => d.match(/-?[\d.]+/g).map(Number);

    const s = n(r.skid);
    // The skid is either "M p0 C c1 c2 p1" or "M p0 L p1"; either way
    // its final direction is the last pair minus the pair before it.
    const endDir = [s[s.length - 2] - s[s.length - 4], s[s.length - 1] - s[s.length - 3]];

    const h = n(r.hook);                       // M end Q c1 apex Q c2 pocket
    const startDir = [h[2] - h[0], h[3] - h[1]];

    const sin = (endDir[0] * startDir[1] - endDir[1] * startDir[0])
      / (Math.hypot(...endDir) * Math.hypot(...startDir));
    expect(Math.abs(sin)).toBeLessThan(1e-4);   // under 0.006 degrees
  });

  it('starts the hook exactly where the skid ends', () => {
    const line = ballLine({ ball: 'b', startBoard: 25, arrowBoard: 15, breakpointBoard: 7 },
                          { patternLength: 41 });
    const r = lanePath(line.points, x, y);
    // Compared as numbers. Matching the printed text instead depends on
    // how many decimals the path happens to carry, which is a formatting
    // detail and not the thing being asserted.
    const s = r.skid.match(/-?[\d.]+/g).map(Number);
    const h = r.hook.match(/-?[\d.]+/g).map(Number);
    expect([h[0], h[1]]).toEqual([s[s.length - 2], s[s.length - 1]]);
  });
});

describe('the breakpoint is the apex', () => {
  // The breakpoint is by definition the point the ball is furthest out.
  // A single arc leaving it along the skid's direction is still going
  // outward when it starts, so it reached its apex a board or two wide
  // -- the line passed outside the very dot the card draws at it.
  const apexOf = r => {
    const n = r.hook.match(/-?[\d.]+/g).map(Number);
    let min = Infinity;
    // Boards are the even entries; walk each Q in turn.
    for (let i = 0; i + 5 < n.length + 1; i += 4) {
      const b0 = n[i], cb = n[i + 2], b1 = n[i + 4];
      if (b1 === undefined) break;
      for (let s = 0; s <= 400; s++) {
        const t = s / 400, u = 1 - t;
        min = Math.min(min, u * u * b0 + 2 * u * t * cb + t * t * b1);
      }
    }
    return min;
  };

  it('never draws the line outside its own breakpoint', () => {
    const idx = v => v;
    for (const [startBoard, arrowBoard, breakpointBoard] of
         [[25, 15, 7], [28, 17, 5], [30, 15, 4], [22, 13, 9], [12, 8, 6]]) {
      const line = ballLine({ ball: 'b', startBoard, arrowBoard, breakpointBoard },
                            { patternLength: 41 });
      expect(apexOf(lanePath(line.points, idx, idx))).toBeCloseTo(breakpointBoard, 2);
    }
  });
});

describe('the skid is straight', () => {
  // It was a parabola through the laydown, the arrow and the breakpoint.
  // That honoured the recorded arrow and bowed the line for the whole
  // first forty feet, and a ball on oil does not bow -- nothing is
  // turning it yet.
  it('draws a line, not a curve', () => {
    const line = ballLine({ ball: 'b', startBoard: 25, arrowBoard: 15, breakpointBoard: 7 },
                          { patternLength: 41 });
    const r = lanePath(line.points, x, y);
    expect(r.skid).toContain(' L ');
    expect(r.skid).not.toContain(' C ');
  });

  // The arrow becomes a marker on that line rather than a point the ball
  // is dragged through -- so a real gap between where the bowler looked
  // and where the line goes stays visible instead of being smoothed into
  // a bend.
  it('reports where it crosses the arrows', () => {
    const points = [
      { feet: 0, board: 26 }, { feet: 15, board: 15 },
      { feet: 45, board: 8 }, { feet: 60, board: 17.5 },
    ];
    const crossing = lanePath(points, x, y).arrowCrossing;
    // On the skid line, between the laydown and the breakpoint, and
    // heading outward -- the numbers themselves come from the slope that
    // puts the apex on the recorded board.
    expect(crossing).toBeLessThan(26);
    expect(crossing).toBeGreaterThan(8);
  });

  it('has nothing to report without an arrow', () => {
    expect(lanePath([{ feet: 0, board: 20 }, { feet: 60, board: 17.5 }], x, y)
      .arrowCrossing).toBeNull();
  });

  // Whatever the numbers, one bend.
  it('still bends exactly once on data a bowler cannot produce', () => {
    const impossible = [
      { feet: 0, board: 20 }, { feet: 15, board: 19 },
      { feet: 40, board: 35 }, { feet: 60, board: 17.5 },
    ];
    expect(bendsBothWays(samplePath(whole(lanePath(impossible, x, y))))).toBe(0);
  });
});

describe('safety', () => {
  it('never throws and never emits NaN', () => {
    const junk = [null, undefined, [], [{}], 'x', 42,
      [{ feet: 0, board: 20 }],
      [{ feet: NaN, board: NaN }, { feet: 1, board: 2 }],
      [{ feet: 0, board: 20 }, { feet: 'x', board: null }]];
    for (const j of junk) {
      let r;
      expect(() => { r = lanePath(j, x, y); }).not.toThrow();
      expect(`${r.skid}${r.hook}`).not.toMatch(/NaN|undefined/);
    }
  });

  it('is safe without scales', () => {
    expect(() => lanePath([{ feet: 0, board: 1 }, { feet: 60, board: 2 }])).not.toThrow();
  });
});

describe('the rack', () => {
  it('has ten pins with the headpin nearest the bowler', () => {
    expect(RACK).toHaveLength(10);
    const head = RACK.find(p => p.pin === 1);
    expect(head.feet).toBe(60);
    expect(RACK.every(p => p.feet >= head.feet)).toBe(true);
  });

  // A lefty's pocket is the 1-2. Drawing the 1-3 for everyone put their
  // target on the wrong side of the headpin.
  it('knows which pocket belongs to which hand', () => {
    expect(pocketPins(false)).toEqual([1, 3]);
    expect(pocketPins(true)).toEqual([1, 2]);
  });

  it('marks the seven boards that carry a dot and an arrow', () => {
    expect(MARK_BOARDS).toEqual([5, 10, 15, 20, 25, 30, 35]);
  });
});
