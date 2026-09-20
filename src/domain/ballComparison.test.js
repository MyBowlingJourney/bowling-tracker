import { describe, it, expect } from 'vitest';
import {
  ballComparison, ballLine, trajectoryPath,
  catmullRomSegments, laydownBoard, phaseForGame, ballByPhase, bestByPhase, ballColors,
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
    expect(Object.keys(ballComparison(night, opts)[0])).not.toContain('spareRate');
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

describe('where the ball lands', () => {
  // Standing on 16, drifting 2 toward the middle, with a 6-board swing:
  // slide on 18, lay the ball down on 12.
  it('works the worked example', () => {
    expect(laydownBoard(16, { drift: 2, lateralOffset: 6 }))
      .toEqual({ slide: 18, laydown: 12 });
  });

  // Both are in the bowler's own board numbering, counted from their own
  // gutter, so the arithmetic needs no handedness term at all.
  it('needs no handedness', () => {
    const a = laydownBoard(16, { drift: 2, lateralOffset: 6 });
    const b = laydownBoard(16, { drift: 2, lateralOffset: 6, leftHanded: true });
    expect(a).toEqual(b);
  });

  it('defaults by style when unset', () => {
    expect(laydownBoard(20, {}).laydown).toBe(19);              // 20 +5 -6
    expect(laydownBoard(20, { twoHanded: true }).laydown).toBe(28); // 20 +10 -2
  });

  // Zero drift is a real answer; not having measured it is not.
  it('treats an explicit zero as a real value', () => {
    expect(laydownBoard(20, { drift: 0, lateralOffset: 6 }).slide).toBe(20);
  });

  it('keeps the lay-down on the lane', () => {
    expect(laydownBoard(2, { drift: 0, lateralOffset: 20 }).laydown).toBe(1);
  });

  it('returns nothing without a start board', () => {
    expect(laydownBoard('', {})).toBe(null);
  });

  // The feet board is where you stand, not where the ball touches down.
  it('starts the drawn line at the lay-down board', () => {
    const line = ballLine({ ball: 'Z', startBoard: 16, arrowBoard: 10 },
      { drift: 2, lateralOffset: 6 });
    expect(line.points[0].board).toBe(12);
  });
});

describe('how a ball behaves as the night goes on', () => {
  // Three games is the common league night but not a rule -- some houses
  // bowl four, tournaments bowl more -- so phases are derived from what
  // was actually bowled rather than hardcoded.
  it('divides a three-game night one game per phase', () => {
    expect([1, 2, 3].map(g => phaseForGame(g, 3)))
      .toEqual(['fresh', 'transition', 'late']);
  });

  it('handles nights that are not three games', () => {
    expect(phaseForGame(1, 1)).toBe('fresh');
    expect([1, 2].map(g => phaseForGame(g, 2))).toEqual(['fresh', 'late']);
    expect([1, 2, 3, 4, 5, 6].map(g => phaseForGame(g, 6)))
      .toEqual(['fresh', 'fresh', 'transition', 'transition', 'late', 'late']);
  });

  it('refuses nonsense', () => {
    expect(phaseForGame(0, 3)).toBe(null);
    expect(phaseForGame(1, 0)).toBe(null);
    expect(phaseForGame('', '')).toBe(null);
  });

  const night = (date, ball, game, strikes) =>
    Array.from({ length: 10 }, (_, i) => ({
      bowler: 'R', league: 'L', date, ball, game: String(game),
      frame: String(i + 1), ballNum: null,
      result: i < strikes ? 'Strike' : 'Other Leave',
      otherLeave: i < strikes ? [] : ['10'], spareMade: '',
    }));

  const shots = [];
  for (let n = 1; n <= 10; n++) {
    const d = `2026-01-${String(n).padStart(2, '0')}`;
    shots.push(...night(d, 'Zen Master', 1, 8), ...night(d, 'Zen Master', 2, 4),
      ...night(d, 'Zen Master', 3, 4));
    shots.push(...night(d, 'IQ Tour', 1, 4), ...night(d, 'IQ Tour', 2, 4),
      ...night(d, 'IQ Tour', 3, 8));
  }
  const opts2 = { bowler: 'R', league: 'L', isSplit, isCornerPinLeave };

  it('separates a ball that carries on the fresh from one that carries late', () => {
    const bp = ballByPhase(shots, opts2);
    const zen = bp.find(b => b.ball === 'Zen Master');
    const iq = bp.find(b => b.ball === 'IQ Tour');
    expect(zen.phases.fresh.strikeRate).toBe(80);
    expect(zen.phases.late.strikeRate).toBe(40);
    expect(iq.phases.late.strikeRate).toBe(80);
  });

  it('names the ball for each phase', () => {
    const best = bestByPhase(ballByPhase(shots, opts2));
    expect(best.fresh).toBe('Zen Master');
    expect(best.late).toBe('IQ Tour');
  });

  // Both balls strike 40% through transition. Naming one is inventing a
  // finding from a tie.
  it('says nothing when a phase is level', () => {
    expect(bestByPhase(ballByPhase(shots, opts2)).transition).toBe(null);
  });

  it('survives junk', () => {
    for (const j of [null, undefined, 'x', 42]) {
      expect(() => ballByPhase(j, j)).not.toThrow();
      expect(() => bestByPhase(j, j)).not.toThrow();
    }
  });
});

describe('junk rows, not just junk arrays', () => {
  // The earlier junk test passed bad ARRAYS -- null, a string, a number.
  // It never passed an array CONTAINING a bad row, so bestByPhase reading
  // b.phases[id] on a row with no phases survived it and crashed in fuzz.
  it('survives a row with no phases', () => {
    for (const rows of [[{}], [null, { frame: 1 }], [{ phases: null }], [{ ball: 'x' }]]) {
      expect(() => bestByPhase(rows)).not.toThrow();
    }
  });

  it('survives junk rows in the comparison too', () => {
    for (const rows of [[{}], [null], [{ ball: null }]]) {
      expect(() => ballColors(rows)).not.toThrow();
    }
  });
});
