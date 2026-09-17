import { describe, it, expect } from 'vitest';
import {
  ballComparison, bestByMetric, ballLine, BALL_METRICS, trajectoryPath,
  catmullRomSegments,
  ARROWS_FEET, BREAKPOINT_FEET,
} from './ballComparison.js';
import { isSplit, isCornerPinLeave } from './splits.js';

const sh = (game, frame, ballNum, result, ball, extra = {}) => ({
  bowler: 'R', league: 'L', ball, game: String(game), frame: String(frame),
  ballNum, result, otherLeave: [], spareMade: '', ...extra,
});
const opts = { bowler: 'R', league: 'L', isSplit, isCornerPinLeave };
const count = shots => ballComparison(shots, opts)[0]?.shots ?? 0;

describe('which shots count as a strike-ball attempt', () => {
  it('counts every ordinary frame', () => {
    expect(count(Array.from({ length: 9 }, (_, i) => sh(1, i + 1, null, 'Strike', 'Zen')))).toBe(9);
  });

  // A spare in the tenth CLEARS THE RACK, so the fill ball after it is
  // thrown at ten pins. Missing this dropped the commonest fill ball.
  it('counts the fill ball after a spare in the tenth', () => {
    expect(count([
      sh(1, 10, 1, 'Other Leave', 'Zen', { otherLeave: ['10'], spareMade: 'Yes' }),
      sh(1, 10, 3, 'Strike', 'Zen'),
    ])).toBe(2);
  });

  it('counts both fill balls after two strikes', () => {
    expect(count([
      sh(1, 10, 1, 'Strike', 'Zen'),
      sh(1, 10, 2, 'Strike', 'Zen'),
      sh(1, 10, 3, 'Strike', 'Zen'),
    ])).toBe(3);
  });

  // Ball 3 here is shooting at what ball 2 left. That is spare shooting,
  // not a strike ball.
  it('does not count a fill ball at a partial rack', () => {
    expect(count([
      sh(1, 10, 1, 'Strike', 'Zen'),
      sh(1, 10, 2, 'Other Leave', 'Zen', { otherLeave: ['7'], spareMade: 'No' }),
      sh(1, 10, 3, 'Other Leave', 'Zen', { otherLeave: ['7'] }),
    ])).toBe(2);
  });

  it('does not count a second ball in frames 1-9', () => {
    expect(count([
      sh(1, 5, 1, 'Other Leave', 'Zen', { otherLeave: ['10'] }),
      sh(1, 5, 2, 'Other Leave', 'Zen', { otherLeave: ['10'] }),
    ])).toBe(1);
  });
});

describe('the measures', () => {
  const night = [
    sh(1, 1, null, 'Strike', 'Zen'),
    sh(1, 2, null, 'Strike', 'Zen'),
    sh(1, 3, null, 'Weak 10', 'Zen'),
    sh(1, 4, null, 'Other Leave', 'Zen', { otherLeave: ['7', '10'] }),
  ];

  it('rates strikes over fresh racks only', () => {
    expect(ballComparison(night, opts)[0].strikeRate).toBe(50);
  });

  // Weak and Ringing 10 carry an empty leave and mean one pin standing.
  it('reports pins knocked down on the first ball', () => {
    expect(ballComparison(night, opts)[0].firstBallAvg).toBe(8.5);
  });

  it('counts corner pins and splits', () => {
    const b = ballComparison(night, opts)[0];
    expect(b.cornerPinRate).toBe(25);
    expect(b.splitRate).toBe(25);
  });

  // Spare conversion is about spare shooting, not about which ball
  // carries, so it is deliberately absent.
  it('reports no spare conversion', () => {
    expect(BALL_METRICS.map(m => m.id)).not.toContain('spareRate');
  });
});

describe('naming a leader', () => {
  const two = [
    { ball: 'A', shots: 100, strikeRate: 72, firstBallAvg: 9.1, cornerPinRate: 3, splitRate: 4 },
    { ball: 'B', shots: 100, strikeRate: 71, firstBallAvg: 7.8, cornerPinRate: 12, splitRate: 5 },
  ];

  // 72 against 71 is a coin flip. Naming a winner there invents a finding
  // from a rounding error.
  it('says nothing when two balls are level', () => {
    expect(bestByMetric(two).strikeRate).toBe(null);
  });

  it('names a leader when the gap is real', () => {
    expect(bestByMetric(two).cornerPinRate).toBe('A');
    expect(bestByMetric(two).firstBallAvg).toBe('A');
  });

  it('knows lower is better for splits and leaves', () => {
    const worse = [
      { ball: 'A', shots: 100, splitRate: 20, firstBallAvg: 6 },
      { ball: 'B', shots: 100, splitRate: 2, firstBallAvg: 9 },
    ];
    expect(bestByMetric(worse).splitRate).toBe('B');
    expect(bestByMetric(worse).firstBallAvg).toBe('B');
  });

  it('says nothing with only one ball', () => {
    expect(bestByMetric([two[0]]).strikeRate).toBe(null);
  });
});

describe('the line down the lane', () => {
  it('marks which points are known and which are assumed', () => {
    const line = ballLine({ ball: 'Zen', startBoard: 22, arrowBoard: 10 });
    expect(line.points.map(p => p.known)).toEqual([true, true, false, false]);
  });

  // Feet-to-arrows is steeper than the ball's path -- it includes the
  // approach angle. Extended at full rate, a 22-to-10 line reached the
  // gutter by forty feet, which no shot does.
  it('damps the breakpoint instead of extending the full angle', () => {
    const line = ballLine({ ball: 'Zen', startBoard: 22, arrowBoard: 10 });
    const bp = line.points.find(p => p.feet === BREAKPOINT_FEET);
    expect(bp.board).toBeLessThan(10);
    expect(bp.board).toBeGreaterThanOrEqual(3);
  });

  // Boards are the bowler's own numbering either way. The mirroring is
  // the drawing's job -- doing it here too flipped it twice.
  it('does not mirror for a left-hander', () => {
    const right = ballLine({ ball: 'Z', startBoard: 22, arrowBoard: 10 });
    const left = ballLine({ ball: 'Z', startBoard: 22, arrowBoard: 10 }, { leftHanded: true });
    expect(left.points[0].board).toBe(right.points[0].board);
  });


  it('returns nothing without both known points', () => {
    expect(ballLine({ ball: 'Z', startBoard: 22 })).toBe(null);
    expect(ballLine({ ball: 'Z', arrowBoard: 10 })).toBe(null);
  });

  it('puts the arrows at fifteen feet', () => {
    const line = ballLine({ ball: 'Z', startBoard: 20, arrowBoard: 12 });
    expect(line.points[1].feet).toBe(ARROWS_FEET);
  });
});

describe('junk', () => {
  it('survives it', () => {
    for (const j of [null, undefined, 'x', 42, {}]) {
      expect(() => ballComparison(j, j)).not.toThrow();
      expect(() => bestByMetric(j, j)).not.toThrow();
      expect(() => ballLine(j, j)).not.toThrow();
    }
  });
});

describe('the trajectory path', () => {
  const x = b => b * 7;
  const y = f => 200 - f * 3;

  // A ball does not change direction at the arrows and again at the
  // breakpoint. Straight segments read as three separate decisions.
  // A ball runs straight through the oil then hooks once. It does not
  // weave -- curving every segment made an S, three direction changes
  // where a real shot makes one.
  it('is one continuous curve with no kinks', () => {
    const d = trajectoryPath(
      [{ feet: 0, board: 22 }, { feet: 15, board: 10 },
       { feet: 40, board: 6 }, { feet: 60, board: 17.5 }], x, y);
    expect((d.match(/C /g) || []).length).toBe(3);
  });

  it('still curves with only two points', () => {
    const d = trajectoryPath([{ feet: 0, board: 22 }, { feet: 15, board: 10 }], x, y);
    expect(d).toContain('C');
  });


  // A ball does not make angular moves. Straight segments then a
  // quadratic put a visible corner at the breakpoint -- the tangent
  // changed direction in a single point, and the eye sees that as a kink.
  it('carries curvature across every join', () => {
    const segs = catmullRomSegments([
      { feet: 0, board: 22 }, { feet: 15, board: 10 },
      { feet: 40, board: 6 }, { feet: 60, board: 17.5 }]);
    for (let i = 0; i < segs.length - 1; i++) {
      const a = segs[i], b = segs[i + 1];
      const cross = (a.to.board - a.c2.board) * (b.c1.feet - b.from.feet)
                  - (a.to.feet - a.c2.feet) * (b.c1.board - b.from.board);
      expect(Math.abs(cross)).toBeLessThan(1e-9);
    }
  });

  it('returns nothing for too few points', () => {
    expect(trajectoryPath([], x, y)).toBe('');
    expect(trajectoryPath([{ feet: 0, board: 5 }], x, y)).toBe('');
  });

  it('survives junk', () => {
    for (const j of [null, undefined, 'x', 42]) {
      expect(() => trajectoryPath(j, x, y)).not.toThrow();
    }
  });
});
