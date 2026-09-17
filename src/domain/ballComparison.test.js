import { describe, it, expect } from 'vitest';
import {
  ballComparison, bestByMetric, ballLine, BALL_METRICS,
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
  it('counts a named corner pin as one pin left', () => {
    expect(ballComparison(night, opts)[0].leaveAvg).toBe(1.5);
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
    { ball: 'A', shots: 100, strikeRate: 72, leaveAvg: 2.0, cornerPinRate: 3, splitRate: 4 },
    { ball: 'B', shots: 100, strikeRate: 71, leaveAvg: 3.4, cornerPinRate: 12, splitRate: 5 },
  ];

  // 72 against 71 is a coin flip. Naming a winner there invents a finding
  // from a rounding error.
  it('says nothing when two balls are level', () => {
    expect(bestByMetric(two).strikeRate).toBe(null);
  });

  it('names a leader when the gap is real', () => {
    expect(bestByMetric(two).cornerPinRate).toBe('A');
    expect(bestByMetric(two).leaveAvg).toBe('A');
  });

  it('knows lower is better for splits and leaves', () => {
    const worse = [
      { ball: 'A', shots: 100, splitRate: 20, leaveAvg: 5 },
      { ball: 'B', shots: 100, splitRate: 2, leaveAvg: 1 },
    ];
    expect(bestByMetric(worse).splitRate).toBe('B');
    expect(bestByMetric(worse).leaveAvg).toBe('B');
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

  it('projects the breakpoint along the same angle', () => {
    // 22 to 10 over 15 feet is -0.8 a foot; 25 more feet is another -20,
    // clamped to the lane.
    const line = ballLine({ ball: 'Zen', startBoard: 22, arrowBoard: 10 });
    const bp = line.points.find(p => p.feet === BREAKPOINT_FEET);
    expect(bp.board).toBeLessThan(10);
    expect(bp.board).toBeGreaterThanOrEqual(1);
  });

  it('mirrors for a left-hander', () => {
    const right = ballLine({ ball: 'Z', startBoard: 22, arrowBoard: 10 });
    const left = ballLine({ ball: 'Z', startBoard: 22, arrowBoard: 10 }, { leftHanded: true });
    expect(left.points[0].board).toBe(40 - right.points[0].board);
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
