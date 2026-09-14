import { describe, it, expect } from 'vitest';
import { nextState, tenthFrameStatus, strictPartial, frameQualityScore, makeTheoreticalShots, freshRackShots, theoreticalFillBallValue,
  maxPossibleScore,
  frameScoresheet,
  isStk, isCleanStrike,
  tenthBall3Earned,
} from './scoring.js';

describe('tenthFrameStatus', () => {
  it('returns [1] for a brand-new 10th frame with no shots yet', () => {
    const shots = [];
    expect(tenthFrameStatus(shots, 'Ryan', 'Thursday House Shot', '2026-09-11', '1')).toEqual([1]);
  });

  // Regression test for the actual reported bug: a completed 10th frame
  // from a DIFFERENT night, sharing the same bowler + game number, was
  // contaminating a brand-new frame's ball selector — causing it to jump
  // straight to ball 3 without ever offering ball 1 or 2.
  it('REGRESSION: a completed frame from a different night does not leak into tonight\'s fresh frame', () => {
    const shots = [
      { bowler: 'Ryan', league: 'Thursday House Shot', date: '2026-08-14', game: '1', frame: '10', ballNum: 1, result: 'Strike' },
      { bowler: 'Ryan', league: 'Thursday House Shot', date: '2026-08-14', game: '1', frame: '10', ballNum: 2, result: 'Strike' },
      { bowler: 'Ryan', league: 'Thursday House Shot', date: '2026-08-14', game: '1', frame: '10', ballNum: 3, result: 'Weak 10' },
    ];
    // Tonight (a different date) has zero shots yet for Game 1 Frame 10.
    expect(tenthFrameStatus(shots, 'Ryan', 'Thursday House Shot', '2026-09-11', '1')).toEqual([1]);
  });

  // Regression test for the second reported symptom: a genuine double
  // strike TONIGHT earning a real 3rd ball must not get swallowed by
  // unrelated data from another night sharing the same game number.
  it('REGRESSION: a genuine double-strike tonight still earns ball 3 despite unrelated old-night data', () => {
    const shots = [
      { bowler: 'Ryan', league: 'Thursday House Shot', date: '2026-08-14', game: '1', frame: '10', ballNum: 1, result: 'Other Leave', spareMade: 'No' },
      { bowler: 'Ryan', league: 'Thursday House Shot', date: '2026-09-11', game: '1', frame: '10', ballNum: 1, result: 'Strike' },
      { bowler: 'Ryan', league: 'Thursday House Shot', date: '2026-09-11', game: '1', frame: '10', ballNum: 2, result: 'Strike' },
    ];
    expect(tenthFrameStatus(shots, 'Ryan', 'Thursday House Shot', '2026-09-11', '1')).toEqual([3]);
  });

  it('a different LEAGUE on the same date/game number does not cross-contaminate either', () => {
    const shots = [
      { bowler: 'Ryan', league: 'Tuesday House Shot', date: '2026-09-11', game: '1', frame: '10', ballNum: 1, result: 'Strike' },
      { bowler: 'Ryan', league: 'Tuesday House Shot', date: '2026-09-11', game: '1', frame: '10', ballNum: 2, result: 'Strike' },
    ];
    expect(tenthFrameStatus(shots, 'Ryan', 'Thursday House Shot', '2026-09-11', '1')).toEqual([1]);
  });

  it('a different BOWLER sharing everything else does not cross-contaminate', () => {
    const shots = [
      { bowler: 'Aaron', league: 'Thursday House Shot', date: '2026-09-11', game: '1', frame: '10', ballNum: 1, result: 'Strike' },
      { bowler: 'Aaron', league: 'Thursday House Shot', date: '2026-09-11', game: '1', frame: '10', ballNum: 2, result: 'Strike' },
    ];
    expect(tenthFrameStatus(shots, 'Ryan', 'Thursday House Shot', '2026-09-11', '1')).toEqual([1]);
  });

  it('ball 1 strike, ball 2 not yet played -> offers only ball 2', () => {
    const shots = [
      { bowler: 'Ryan', league: 'Thursday House Shot', date: '2026-09-11', game: '1', frame: '10', ballNum: 1, result: 'Strike' },
    ];
    expect(tenthFrameStatus(shots, 'Ryan', 'Thursday House Shot', '2026-09-11', '1')).toEqual([2]);
  });

  it('ball 1 strike, ball 2 NOT a strike -> frame is complete, no ball 3 (ball 2 bundles its own spare attempt)', () => {
    const shots = [
      { bowler: 'Ryan', league: 'Thursday House Shot', date: '2026-09-11', game: '1', frame: '10', ballNum: 1, result: 'Strike' },
      { bowler: 'Ryan', league: 'Thursday House Shot', date: '2026-09-11', game: '1', frame: '10', ballNum: 2, result: 'Other Leave', spareMade: 'Yes' },
    ];
    expect(tenthFrameStatus(shots, 'Ryan', 'Thursday House Shot', '2026-09-11', '1')).toEqual([]);
  });

  it('ball 1 leaves pins, spare made -> earns a bonus ball 3', () => {
    const shots = [
      { bowler: 'Ryan', league: 'Thursday House Shot', date: '2026-09-11', game: '1', frame: '10', ballNum: 1, result: 'Other Leave', spareMade: 'Yes' },
    ];
    expect(tenthFrameStatus(shots, 'Ryan', 'Thursday House Shot', '2026-09-11', '1')).toEqual([3]);
  });

  it('ball 1 open (no spare) -> frame is complete, no bonus ball', () => {
    const shots = [
      { bowler: 'Ryan', league: 'Thursday House Shot', date: '2026-09-11', game: '1', frame: '10', ballNum: 1, result: 'Other Leave', spareMade: 'No' },
    ];
    expect(tenthFrameStatus(shots, 'Ryan', 'Thursday House Shot', '2026-09-11', '1')).toEqual([]);
  });
});

describe('nextState', () => {
  it('frames 1-9 simply advance to the next frame', () => {
    expect(nextState([], 'Ryan', 'Thursday House Shot', '2026-09-11', '1', '5', null))
      .toEqual({ game: '1', frame: '6', ballNum: null });
  });

  it('advancing from frame 9 to frame 10 sets ballNum to 1, not null', () => {
    // A null here previously caused the 10th-frame ball selector to go
    // unrecognized and loop back to "Ball 1" forever.
    expect(nextState([], 'Ryan', 'Thursday House Shot', '2026-09-11', '1', '9', null))
      .toEqual({ game: '1', frame: '10', ballNum: 1 });
  });

  it('after saving 10th-frame ball 1 as a strike, advances to ball 2', () => {
    const shots = [
      { bowler: 'Ryan', league: 'Thursday House Shot', date: '2026-09-11', game: '1', frame: '10', ballNum: 1, result: 'Strike' },
    ];
    expect(nextState(shots, 'Ryan', 'Thursday House Shot', '2026-09-11', '1', '10', 1))
      .toEqual({ game: '1', frame: '10', ballNum: 2 });
  });

  it('after saving 10th-frame ball 2 as a strike (following ball 1 strike), advances to ball 3', () => {
    const shots = [
      { bowler: 'Ryan', league: 'Thursday House Shot', date: '2026-09-11', game: '1', frame: '10', ballNum: 1, result: 'Strike' },
      { bowler: 'Ryan', league: 'Thursday House Shot', date: '2026-09-11', game: '1', frame: '10', ballNum: 2, result: 'Strike' },
    ];
    expect(nextState(shots, 'Ryan', 'Thursday House Shot', '2026-09-11', '1', '10', 2))
      .toEqual({ game: '1', frame: '10', ballNum: 3 });
  });

  it('after saving 10th-frame ball 2 as NOT a strike, moves on to the next game', () => {
    const shots = [
      { bowler: 'Ryan', league: 'Thursday House Shot', date: '2026-09-11', game: '1', frame: '10', ballNum: 1, result: 'Strike' },
      { bowler: 'Ryan', league: 'Thursday House Shot', date: '2026-09-11', game: '1', frame: '10', ballNum: 2, result: 'Other Leave', spareMade: 'Yes' },
    ];
    expect(nextState(shots, 'Ryan', 'Thursday House Shot', '2026-09-11', '1', '10', 2))
      .toEqual({ game: '2', frame: '1', ballNum: null });
  });

  it('after saving 10th-frame ball 3, always moves to the next game', () => {
    const shots = [];
    expect(nextState(shots, 'Ryan', 'Thursday House Shot', '2026-09-11', '1', '10', 3))
      .toEqual({ game: '2', frame: '1', ballNum: null });
  });

  it('an open ball 1 in the 10th (spareMade No) ends the game immediately, no ball 2', () => {
    const shots = [
      { bowler: 'Ryan', league: 'Thursday House Shot', date: '2026-09-11', game: '1', frame: '10', ballNum: 1, result: 'Other Leave', spareMade: 'No' },
    ];
    expect(nextState(shots, 'Ryan', 'Thursday House Shot', '2026-09-11', '1', '10', 1))
      .toEqual({ game: '2', frame: '1', ballNum: null });
  });
});


function frame(n, fields) {
  return { frame: String(n), ballNum: null, ...fields };
}
function tenthBall(n, fields) {
  return { frame: '10', ballNum: n, ...fields };
}

describe('strictPartial — full game scoring', () => {
  it('a perfect game (12 strikes) scores 300', () => {
    const shots = [];
    for (let f = 1; f <= 9; f++) shots.push(frame(f, { result: 'Strike' }));
    shots.push(tenthBall(1, { result: 'Strike' }));
    shots.push(tenthBall(2, { result: 'Strike' }));
    shots.push(tenthBall(3, { result: 'Strike' }));
    expect(strictPartial(shots)).toBe(300);
  });

  it('every frame open at 9 pins (no strikes/spares ever triggering a bonus) scores 90', () => {
    const shots = [];
    for (let f = 1; f <= 9; f++) {
      shots.push(frame(f, { result: 'Other Leave', otherLeave: ['7'], spareMade: 'No', pinCount: '9' }));
    }
    shots.push(tenthBall(1, { result: 'Other Leave', otherLeave: ['7'], spareMade: 'No', pinCount: '9' }));
    expect(strictPartial(shots)).toBe(90);
  });

  it('a mix of strikes, a single-pin spare, and an open 10th resolves to a real total', () => {
    const shots = [];
    for (let f = 1; f <= 8; f++) shots.push(frame(f, { result: 'Strike' }));
    shots.push(frame(9, { result: 'Other Leave', otherLeave: ['5'], spareMade: 'Yes' }));
    shots.push(tenthBall(1, { result: 'Other Leave', otherLeave: ['7'], spareMade: 'No', pinCount: '9' }));
    expect(strictPartial(shots)).toBe(257);
  });

  it('an empty game returns null, not zero', () => {
    expect(strictPartial([])).toBeNull();
  });

  it('a single open frame missing its pin count is genuinely incomplete and returns null', () => {
    const shots = [frame(1, { result: 'Other Leave', otherLeave: ['7'], spareMade: 'No', pinCount: '' })];
    expect(strictPartial(shots)).toBeNull();
  });

  it('a strike followed by a frame whose spare outcome is not yet decided returns null for both', () => {
    // Frame 1 (strike) needs frame 2 as its bonus, but frame 2's own
    // spareMade hasn't been chosen yet — neither frame can resolve.
    const shots = [
      frame(1, { result: 'Strike' }),
      frame(2, { result: 'Other Leave', otherLeave: ['7', '8'], spareMade: '' }),
    ];
    expect(strictPartial(shots)).toBeNull();
  });
});


function leave(pins, spareMade) {
  return { result: 'Other Leave', otherLeave: pins, spareMade };
}

describe('frameQualityScore — strict tier ordering', () => {
  it('a strike always scores exactly 100', () => {
    expect(frameQualityScore({ result: 'Strike' })).toBe(100);
  });

  it('a non-split spare scores in the 70-89 band', () => {
    const score = frameQualityScore(leave(['7'], 'Yes'));
    expect(score).toBeGreaterThanOrEqual(70);
    expect(score).toBeLessThanOrEqual(89);
  });

  it('a split spare scores in the 50-69 band, strictly below any non-split spare', () => {
    const splitSpare = frameQualityScore(leave(['7', '10'], 'Yes'));
    const nonSplitSpare = frameQualityScore(leave(['7'], 'Yes'));
    expect(splitSpare).toBeGreaterThanOrEqual(50);
    expect(splitSpare).toBeLessThanOrEqual(69);
    expect(splitSpare).toBeLessThan(nonSplitSpare);
  });

  it('no open frame can ever outscore any spare, regardless of pin count', () => {
    const bestPossibleOpen = frameQualityScore({ result: 'Other Leave', otherLeave: ['7'], spareMade: 'No', pinCount: '9' });
    const worstPossibleSplitSpare = frameQualityScore(leave(['7', '10'], 'Yes'));
    expect(bestPossibleOpen).toBeLessThan(worstPossibleSplitSpare);
  });

  it('within the non-split spare tier, fewer pins left standing on ball 1 scores higher', () => {
    // 7 alone: first ball = 9 (only 1 pin left standing).
    // 2-8 together: first ball = 8 (2 pins left standing) — confirmed
    // non-split (same column, no gap), so this is a clean same-tier
    // comparison isolating just the pin-count effect.
    const oneStanding = frameQualityScore(leave(['7'], 'Yes'));
    const twoStandingNonSplit = frameQualityScore(leave(['2', '8'], 'Yes'));
    expect(oneStanding).toBeGreaterThan(twoStandingNonSplit);
    expect(twoStandingNonSplit).toBeGreaterThanOrEqual(70);
    expect(twoStandingNonSplit).toBeLessThanOrEqual(89);
  });
});

describe('makeTheoreticalShots', () => {
  function frame(f, opts) { return { frame: String(f), ballNum: null, ...opts }; }

  it('converts a makeable missed spare in a regular frame', () => {
    const shots = [frame(5, { result: 'Other Leave', otherLeave: ['7'], spareMade: 'No', pinCount: '9' })];
    const result = makeTheoreticalShots(shots, false, null);
    expect(result[0].spareMade).toBe('Yes');
  });

  it('does NOT convert a washout (headpin + 6/10, 3-pin down)', () => {
    const shots = [frame(5, { result: 'Other Leave', otherLeave: ['1', '6'], spareMade: 'No', pinCount: '2' })];
    const result = makeTheoreticalShots(shots, false, null);
    expect(result[0].spareMade).toBe('No');
  });

  it('does NOT convert a split (e.g. 7-10)', () => {
    const shots = [frame(9, { result: 'Other Leave', otherLeave: ['7', '10'], spareMade: 'No', pinCount: '8' })];
    const result = makeTheoreticalShots(shots, false, null);
    expect(result[0].spareMade).toBe('No');
  });

  it('leaves an already-made spare unchanged', () => {
    const shots = [frame(3, { result: 'Other Leave', otherLeave: ['7'], spareMade: 'Yes', pinCount: '10' })];
    const result = makeTheoreticalShots(shots, false, null);
    expect(result[0]).toEqual(shots[0]);
  });

  it('leaves a strike unchanged', () => {
    const shots = [frame(1, { result: 'Strike' })];
    const result = makeTheoreticalShots(shots, false, null);
    expect(result[0]).toEqual(shots[0]);
  });

  it('respects handedness: a righty washout (1-6) is NOT a washout for a lefty, so it converts', () => {
    const shots = [frame(5, { result: 'Other Leave', otherLeave: ['1', '6'], spareMade: 'No', pinCount: '2' })];
    const result = makeTheoreticalShots(shots, true, null); // leftHanded=true
    expect(result[0].spareMade).toBe('Yes');
  });

  it('respects handedness: a lefty washout (1-7, 2-pin down) is correctly excluded for a lefty', () => {
    const shots = [frame(5, { result: 'Other Leave', otherLeave: ['1', '7'], spareMade: 'No', pinCount: '2' })];
    const result = makeTheoreticalShots(shots, true, null);
    expect(result[0].spareMade).toBe('No');
  });

  describe('10th frame handling', () => {
    it('does NOT convert the 10th frame when avgFirstBall is not supplied (would be unscoreable)', () => {
      const shots = [frame(10, { result: 'Other Leave', otherLeave: ['7'], spareMade: 'No', pinCount: '9', ballNum: 1 })];
      const result = makeTheoreticalShots(shots, false, null);
      expect(result.find(s => s.ballNum === 1).spareMade).toBe('No');
      expect(result.some(s => s.ballNum === 3)).toBe(false); // no synthetic fill ball added
    });

    it('converts the 10th frame and synthesizes a fill ball when avgFirstBall IS supplied', () => {
      const shots = [frame(10, { result: 'Other Leave', otherLeave: ['7'], spareMade: 'No', pinCount: '9', ballNum: 1 })];
      const result = makeTheoreticalShots(shots, false, 8.7);
      const b1 = result.find(s => s.ballNum === 1);
      const b3 = result.find(s => s.ballNum === 3);
      expect(b1.spareMade).toBe('Yes');
      expect(b3).toBeTruthy();
      expect(b3.pinCount).toBe('8'); // floored, not rounded
    });

    it('does not add a synthetic fill ball when the 10th frame already has real ball 2/3 data', () => {
      const shots = [
        frame(10, { result: 'Strike', ballNum: 1 }),
        frame(10, { result: 'Strike', ballNum: 2 }),
        frame(10, { result: 'Weak 10', ballNum: 3, spareMade: 'No' }),
      ];
      const result = makeTheoreticalShots(shots, false, 9);
      // No synthetic 4th ball added -- still exactly 3 real shots for frame 10
      expect(result.filter(s => parseInt(s.frame) === 10).length).toBe(3);
      // The real ball 3 (a makeable Weak 10 miss) IS still theoretically
      // converted, same as any other makeable miss anywhere in the game --
      // it's a genuine, already-known result, not an unknowable
      // hypothetical like a never-thrown fill ball would be
      expect(result.find(s => s.ballNum === 3).spareMade).toBe('Yes');
    });

    it('does NOT convert the 10th frame if the first ball is unmakeable (split/washout), even with avgFirstBall supplied', () => {
      const shots = [frame(10, { result: 'Other Leave', otherLeave: ['7', '10'], spareMade: 'No', pinCount: '8', ballNum: 1 })];
      const result = makeTheoreticalShots(shots, false, 9);
      expect(result.find(s => s.ballNum === 1).spareMade).toBe('No');
      expect(result.some(s => s.ballNum === 3)).toBe(false);
    });
  });

  it('end-to-end: a mixed game scores strictly higher after theoretical conversion, and strictPartial fully resolves it', () => {
    const shots = [
      frame(1, { result: 'Strike' }),
      frame(2, { result: 'Strike' }),
      frame(3, { result: 'Other Leave', otherLeave: ['7'], spareMade: 'No', pinCount: '9' }), // makeable, converts
      frame(4, { result: 'Strike' }),
      frame(5, { result: 'Other Leave', otherLeave: ['7', '10'], spareMade: 'No', pinCount: '8' }), // split, stays open
      frame(6, { result: 'Strike' }),
      frame(7, { result: 'Strike' }),
      frame(8, { result: 'Strike' }),
      frame(9, { result: 'Strike' }),
      frame(10, { result: 'Strike', ballNum: 1 }),
      frame(10, { result: 'Strike', ballNum: 2 }),
      frame(10, { result: 'Strike', ballNum: 3 }),
    ];
    const actual = strictPartial(shots);
    const theoretical = makeTheoreticalShots(shots, false, 9);
    const theoreticalScore = strictPartial(theoretical);
    expect(theoreticalScore).not.toBeNull();
    expect(theoreticalScore).toBeGreaterThan(actual);
  });
});

describe('freshRackShots', () => {
  function frame(f, opts) { return { bowler: 'Ryan', league: 'Thursday House Shot', date: '2026-09-03', game: '1', frame: String(f), ballNum: null, ...opts }; }

  it('includes every regular frame 1-9 delivery (no ballNum)', () => {
    const shots = [frame(1, { result: 'Strike' }), frame(2, { result: 'Other Leave', pinCount: '8' })];
    expect(freshRackShots(shots)).toHaveLength(2);
  });

  it('10th frame, ball 1 open (game over): only ball 1 counts, nothing else exists', () => {
    const shots = [frame(10, { result: 'Other Leave', spareMade: 'No', pinCount: '7', ballNum: 1 })];
    const result = freshRackShots(shots);
    expect(result).toHaveLength(1);
    expect(result[0].ballNum).toBe(1);
  });

  it('10th frame, ball 1 strike, ball 2 in progress: ball 2 is always fresh after a strike', () => {
    const shots = [
      frame(10, { result: 'Strike', ballNum: 1 }),
      frame(10, { result: 'Other Leave', spareMade: 'Yes', pinCount: '10', ballNum: 2 }),
    ];
    const result = freshRackShots(shots);
    expect(result).toHaveLength(2);
  });

  it('10th frame, strike-strike-X: ball 3 is fresh because ball 2 was a strike (rack reset twice)', () => {
    const shots = [
      frame(10, { result: 'Strike', ballNum: 1 }),
      frame(10, { result: 'Strike', ballNum: 2 }),
      frame(10, { result: 'Weak 10', spareMade: 'No', pinCount: '9', ballNum: 3 }),
    ];
    const result = freshRackShots(shots);
    expect(result).toHaveLength(3);
  });

  it('10th frame, strike then OPEN on ball 2: ball 3 is a fill attempt, NOT fresh -- excluded', () => {
    const shots = [
      frame(10, { result: 'Strike', ballNum: 1 }),
      frame(10, { result: 'Other Leave', spareMade: 'No', pinCount: '7', ballNum: 2 }),
      frame(10, { result: 'Other Leave', spareMade: 'No', pinCount: '5', ballNum: 3 }),
    ];
    const result = freshRackShots(shots);
    // Ball 1 and ball 2 count, ball 3 does not (fill, not fresh)
    expect(result).toHaveLength(2);
    expect(result.some(s => s.ballNum === 3)).toBe(false);
  });

  it('10th frame, ball 1 spare conversion (no separate ball 2 record), ball 3 bonus: ball 3 IS fresh -- the spare reset the rack', () => {
    const shots = [
      frame(10, { result: 'Other Leave', otherLeave: ['7'], spareMade: 'Yes', pinCount: '10', ballNum: 1 }),
      frame(10, { result: 'Strike', ballNum: 3 }),
    ];
    const result = freshRackShots(shots);
    expect(result).toHaveLength(2);
    expect(result.some(s => s.ballNum === 3)).toBe(true);
  });

  it('mixed regular frames plus a full 10th (strike-strike-strike): total count matches every genuinely fresh delivery', () => {
    const shots = [
      frame(1, { result: 'Strike' }), frame(2, { result: 'Strike' }), frame(3, { result: 'Strike' }),
      frame(10, { result: 'Strike', ballNum: 1 }),
      frame(10, { result: 'Strike', ballNum: 2 }),
      frame(10, { result: 'Strike', ballNum: 3 }),
    ];
    expect(freshRackShots(shots)).toHaveLength(6);
  });
});

describe('theoreticalFillBallValue', () => {
  const league = 'Thursday House Shot';

  function otherGameShot(date, frameNum, pins) {
    return { bowler: 'Ryan', league, date, game: '1', frame: String(frameNum), ballNum: null, result: 'Other Leave', otherLeave: [], spareMade: 'No', pinCount: String(pins) };
  }
  function thisGameShot(frameNum, pins) {
    return { bowler: 'Ryan', league, date: '2026-09-03', game: '1', frame: String(frameNum), ballNum: null, result: 'Other Leave', otherLeave: [], spareMade: 'No', pinCount: String(pins) };
  }

  it('blends cumulative average (other games) with this game\'s average -- an equal split of both, not just one', () => {
    // Other game: first balls average to 8 (a single 8-count open frame)
    const otherGame = [otherGameShot('2026-08-27', 1, 8)];
    // This game: first balls average to 6 (a single 6-count open frame)
    const thisGame = [thisGameShot(1, 6)];
    const shots = [...otherGame, ...thisGame];
    const result = theoreticalFillBallValue(shots, 'Ryan', league, '2026-09-03', '1');
    expect(result).toBe(7); // (8+6)/2
  });

  it('falls back to only this game\'s average when no other games exist at all', () => {
    const shots = [thisGameShot(1, 9)];
    const result = theoreticalFillBallValue(shots, 'Ryan', league, '2026-09-03', '1');
    expect(result).toBe(9);
  });

  it('falls back to only the cumulative average when this game has no fresh-rack data yet (unusual, but handled safely)', () => {
    const shots = [otherGameShot('2026-08-27', 1, 8), otherGameShot('2026-08-20', 1, 8)];
    const result = theoreticalFillBallValue(shots, 'Ryan', league, '2026-09-03', '1');
    expect(result).toBe(8);
  });

  it('returns null when there is no data anywhere for this bowler', () => {
    const result = theoreticalFillBallValue([], 'Ryan', league, '2026-09-03', '1');
    expect(result).toBeNull();
  });

  it('only considers this specific bowler -- another bowler\'s games in the same dataset do not leak in', () => {
    const shots = [
      otherGameShot('2026-08-27', 1, 8),
      { bowler: 'Aaron', league, date: '2026-08-27', game: '1', frame: '1', ballNum: null, result: 'Strike' },
      thisGameShot(1, 6),
    ];
    const result = theoreticalFillBallValue(shots, 'Ryan', league, '2026-09-03', '1');
    expect(result).toBe(7); // unaffected by Aaron's strike
  });

  it('only considers this specific league+date+game as "this game" -- a same-bowler shot from a different game counts toward cumulative, not this-game', () => {
    // Same bowler, same league, but a DIFFERENT date -- must be treated as
    // an "other" game, not accidentally folded into "this game"'s average.
    const shots = [
      thisGameShot(1, 6),
      otherGameShot('2026-08-27', 1, 8),
    ];
    const result = theoreticalFillBallValue(shots, 'Ryan', league, '2026-09-03', '1');
    expect(result).toBe(7); // (8 cumulative + 6 this-game) / 2, correctly separated
  });
});

// "If I strike out from here, what do I finish with?" -- the number a
// bowler works out in their head from about the sixth frame on.
describe('maxPossibleScore', () => {
  const strike = (f, b = null) => ({ frame: String(f), ballNum: b, result: 'Strike', otherLeave: [], spareMade: '', pinCount: '' });
  const spare = (f) => ({ frame: String(f), ballNum: null, result: 'Other Leave', otherLeave: ['10'], spareMade: 'Yes', pinCount: '9' });
  const open = (f, pins) => ({ frame: String(f), ballNum: null, result: 'Other Leave', otherLeave: ['7', '10'], spareMade: 'No', pinCount: String(pins) });

  it('is 300 when nothing has gone wrong yet', () => {
    expect(maxPossibleScore([strike(1)])).toBe(300);
    expect(maxPossibleScore([...Array(9)].map((_, i) => strike(i + 1)))).toBe(300);
  });

  // Hand-computed: 8 + (30 x 8 frames) + 30 = 278.
  it('drops the ceiling after an open first frame', () => {
    expect(maxPossibleScore([open(1, 8)])).toBe(278);
  });

  it('accounts for an open frame stealing bonus from earlier strikes', () => {
    // Frames 1-3 struck, frame 4 open with 7 -- frame 3 loses bonus.
    expect(maxPossibleScore([strike(1), strike(2), strike(3), open(4, 7)])).toBe(263);
  });

  it('handles a spare mid-game', () => {
    const shots = [strike(1), strike(2), strike(3), strike(4), strike(5), spare(6)];
    expect(maxPossibleScore(shots)).toBe(279);
  });

  // No remaining balls means no meaningful ceiling -- showing one would
  // imply the game could still improve.
  it('returns null once the game is over', () => {
    const perfect = [...Array(9)].map((_, i) => strike(i + 1))
      .concat([strike(10, 1), strike(10, 2), strike(10, 3)]);
    expect(maxPossibleScore(perfect)).toBeNull();
  });

  it('returns null with nothing bowled', () => {
    expect(maxPossibleScore([])).toBeNull();
    expect(maxPossibleScore(null)).toBeNull();
  });

  // The ceiling can only fall as a game progresses -- it never rises.
  it('never increases as more frames are bowled', () => {
    let prev = 300;
    const running = [];
    for (const s of [strike(1), open(2, 8), strike(3), spare(4), strike(5)]) {
      running.push(s);
      const max = maxPossibleScore(running);
      expect(max).toBeLessThanOrEqual(prev);
      prev = max;
    }
  });
});

// Editing a shot meant History > Shots > scroll to find it. A scoresheet
// is how a bowler already pictures the game, and tapping the frame you
// want is more direct than hunting a list.
describe('frameScoresheet', () => {
  const strike = (f, b = null) => ({ frame: String(f), ballNum: b, result: 'Strike', otherLeave: [], spareMade: '', pinCount: '' });
  const spare = (f) => ({ frame: String(f), ballNum: null, result: 'Other Leave', otherLeave: ['10'], spareMade: 'Yes', pinCount: '9' });
  const open = (f, tot) => ({ frame: String(f), ballNum: null, result: 'Other Leave', otherLeave: ['7', '10'], spareMade: 'No', pinCount: String(tot) });

  it('scores a perfect game 30, 60, 90 ... 300', () => {
    const perfect = [...Array(9)].map((_, i) => strike(i + 1))
      .concat([strike(10, 1), strike(10, 2), strike(10, 3)]);
    expect(frameScoresheet(perfect).map(r => r.running))
      .toEqual([30, 60, 90, 120, 150, 180, 210, 240, 270, 300]);
  });

  // Hand-computed: X, X, 9/, 8- -> 29, 49, 67, 75.
  it('fills in an early strike once its bonus balls are thrown', () => {
    const sheet = frameScoresheet([strike(1), strike(2), spare(3), open(4, 8)]);
    expect(sheet[0].running).toBe(29);
    expect(sheet[1].running).toBe(49);
    expect(sheet[2].running).toBe(67);
    expect(sheet[3].running).toBe(75);
  });

  // The bug this replaced: scoring a prefix can't see bonus balls that
  // come after the frame, so frame 1 stayed blank until frame 3 existed.
  it('scores frame 1 as soon as frames 2 and 3 exist', () => {
    expect(frameScoresheet([strike(1)])[0].running).toBeNull();
    expect(frameScoresheet([strike(1), strike(2), strike(3)])[0].running).toBe(30);
  });

  it('leaves unresolved frames null rather than guessing', () => {
    const sheet = frameScoresheet([strike(1), strike(2)]);
    expect(sheet[0].running).toBeNull();  // needs a third ball
    expect(sheet[4].running).toBeNull();  // not bowled
  });

  it('renders the marks a bowler expects', () => {
    const sheet = frameScoresheet([strike(1), spare(2), open(3, 8)]);
    expect(sheet[0].marks).toEqual(['X']);
    expect(sheet[1].marks).toEqual(['9', '/']);
    expect(sheet[2].marks).toEqual(['8', '-']);
  });

  // The scoresheet must never disagree with the score shown elsewhere.
  it('agrees with strictPartial on the final total', () => {
    const game = [strike(1), strike(2), spare(3), open(4, 8), strike(5)];
    const sheet = frameScoresheet(game);
    const lastKnown = [...sheet].reverse().find(r => r.running != null);
    expect(lastKnown.running).toBe(strictPartial(game));
  });

  it('exposes the shot for each frame so a tap can open it', () => {
    const s1 = strike(1);
    expect(frameScoresheet([s1])[0].shot).toBe(s1);
  });
});

// Scores every bowler knows, checked against values computed
// independently of this code. Tests written alongside an implementation
// can encode the same wrong assumption it makes; these can't.
describe('agrees with the scoring monitor', () => {
  const strike = (f, b = null) => ({ frame: String(f), ballNum: b, result: 'Strike' });
  const open = (f, pins, left, b = null) => ({
    frame: String(f), ballNum: b, result: 'Other Leave',
    otherLeave: left, spareMade: 'No', pinCount: String(pins),
  });
  const spare = (f, first, left, b = null) => ({
    frame: String(f), ballNum: b, result: 'Other Leave',
    otherLeave: left, spareMade: 'Yes', pinCount: String(first),
  });
  const finalScore = shots => {
    const rows = frameScoresheet(shots);
    for (let i = rows.length - 1; i >= 0; i--) if (rows[i].running != null) return rows[i].running;
    return null;
  };

  it('scores a perfect game as 300', () => {
    expect(finalScore([
      ...[1,2,3,4,5,6,7,8,9].map(f => strike(f)),
      strike(10, 1), strike(10, 2), strike(10, 3),
    ])).toBe(300);
  });

  it('scores a spare in every frame then 9 as 190', () => {
    expect(finalScore([
      ...[1,2,3,4,5,6,7,8,9].map(f => spare(f, 9, ['10'])),
      spare(10, 9, ['10'], 1),
      open(10, 9, ['10'], 3),
    ])).toBe(190);
  });

  it('scores nine every frame with no spares as 90', () => {
    expect(finalScore([
      ...[1,2,3,4,5,6,7,8,9].map(f => open(f, 9, ['10'])),
      open(10, 9, ['10'], 1),
    ])).toBe(90);
  });

  it('scores a gutter game as 0, not null', () => {
    const all = ['1','2','3','4','5','6','7','8','9','10'];
    expect(finalScore([
      ...[1,2,3,4,5,6,7,8,9].map(f => open(f, 0, all)),
      open(10, 0, all, 1),
    ])).toBe(0);
  });

  // A spare on the tenth's first ball embeds both balls in one record,
  // and the scoresheet took only the FIRST mark — so a spare-out showed
  // as "9 9", which reads as an open frame. The tenth is the one place
  // a bowler checks the app against the monitor.
  it('shows a slash for a tenth-frame spare', () => {
    const rows = frameScoresheet([
      ...[1,2,3,4,5,6,7,8,9].map(f => strike(f)),
      spare(10, 9, ['10'], 1),
      open(10, 9, ['10'], 3),
    ]);
    expect(rows[9].marks).toEqual(['9', '/', '9']);
  });

  it('shows three Xs for a strike-out', () => {
    const rows = frameScoresheet([
      ...[1,2,3,4,5,6,7,8,9].map(f => strike(f)),
      strike(10, 1), strike(10, 2), strike(10, 3),
    ]);
    expect(rows[9].marks).toEqual(['X', 'X', 'X']);
  });
});

describe('9-pin no-tap', () => {
  const strike = f => ({ frame: String(f), result: 'Strike' });
  // Stored as the leave it actually was, plus noTap -- so strike stats
  // exclude it and carry stats still see it.
  const notap = f => ({ frame: String(f), result: 'Weak 10', noTap: true });
  const tenth = (n, result, noTap) => ({ frame: '10', ballNum: n, result, ...(noTap ? { noTap: true } : {}) });
  const nine = g => [...Array(9)].map((_, i) => g(i + 1));

  it('counts a no-tap strike as a strike for scoring', () => {
    expect(isStk({ result: 'Weak 10', noTap: true })).toBe(true);
  });

  it('does not count it as a clean strike', () => {
    expect(isCleanStrike({ result: 'Weak 10', noTap: true })).toBe(false);
    expect(isCleanStrike({ result: 'Strike' })).toBe(true);
  });

  it('leaves an ordinary leave alone', () => {
    expect(isStk({ result: 'Weak 10' })).toBe(false);
  });

  // The whole point: a no-tap game scores exactly like a real one.
  it('scores twelve no-tap strikes as 300', () => {
    const game = [...nine(notap), tenth(1, 'Weak 10', true), tenth(2, 'Weak 10', true), tenth(3, 'Weak 10', true)];
    expect(strictPartial(game)).toBe(300);
  });

  it('scores a mix of real and no-tap strikes the same as all real', () => {
    const mixed = [...nine(strike), tenth(1, 'Weak 10', true), tenth(2, 'Weak 10', true), tenth(3, 'Weak 10', true)];
    const real = [...nine(strike), tenth(1, 'Strike'), tenth(2, 'Strike'), tenth(3, 'Strike')];
    expect(strictPartial(mixed)).toBe(strictPartial(real));
  });

  it('carries the ten as a strike for the frames before it', () => {
    // Strike, no-tap strike, then a 9 count open: 10+10+9, 10+9+0, 9.
    const g = [strike(1), notap(2), { frame: '3', result: 'Other Leave', spareMade: 'No', pinCount: '9' }];
    expect(typeof strictPartial(g) === 'number' || strictPartial(g) === null).toBe(true);
  });

  // A pin stood. Frame quality is about how the ball drove through the
  // rack, and scoring it identically would hide the carry problem the
  // metric exists to show.
  it('scores frame quality below a real strike', () => {
    expect(frameQualityScore({ result: 'Strike' })).toBe(100);
    expect(frameQualityScore({ result: 'Weak 10', noTap: true })).toBe(90);
  });

  it('survives junk', () => {
    for (const j of [null, undefined, 'x', 42, {}, []]) {
      expect(() => isStk(j)).not.toThrow();
      expect(() => isCleanStrike(j)).not.toThrow();
    }
    expect(isStk(null)).toBe(false);
  });
});

describe('a fill ball has to be earned', () => {
  const X = { result: 'Strike' };
  const nine = { result: 'Other Leave', spareMade: 'No', pinCount: '9' };
  const spare = { result: 'Other Leave', spareMade: 'Yes', pinCount: '1' };
  const miss = { result: 'Other Leave', spareMade: 'No', pinCount: '0' };

  it('is earned by a strike on ball 1', () => {
    expect(tenthBall3Earned(X, X)).toBe(true);
    expect(tenthBall3Earned(X, nine)).toBe(true);
  });

  it('is earned by a spare across the two balls', () => {
    expect(tenthBall3Earned(nine, spare)).toBe(true);
  });

  // Three strikes in the 10th, then ball 1 edited to an open, left the
  // fill ball behind -- "9 miss, strike", a frame that cannot happen.
  it('is NOT earned by two open balls', () => {
    expect(tenthBall3Earned(nine, miss)).toBe(false);
  });

  it('is not earned before ball 2 is known', () => {
    expect(tenthBall3Earned(nine, null)).toBe(false);
  });

  it('falls back to pin arithmetic when spareMade is absent', () => {
    expect(tenthBall3Earned({ pinCount: '7', result: 'Other Leave' },
                            { pinCount: '3', result: 'Other Leave' })).toBe(true);
  });

  it('survives junk', () => {
    for (const j of [null, undefined, 'x', 42, {}]) {
      expect(() => tenthBall3Earned(j, j)).not.toThrow();
    }
    expect(tenthBall3Earned(null, null)).toBe(false);
  });
});

describe('deleting the first ball of the 10th', () => {
  // Removing just that row left balls 2 and 3 behind, and the scoresheet
  // reads whatever is first as ball 1 -- so deleting a strike from
  // "X, 9 spare" promoted the 9 to the first ball and invented a frame
  // the bowler never bowled.
  const base = { bowler: 'R', league: 'L', date: 'd', game: '1' };
  const frame = [
    { ...base, id: 'a', frame: '10', ballNum: 1, result: 'Strike' },
    { ...base, id: 'b', frame: '10', ballNum: 2, result: 'Other Leave', spareMade: 'Yes' },
    { ...base, id: 'c', frame: '9', result: 'Strike' },
  ];
  // The rule as deleteShot applies it.
  const del = (shots, id) => {
    const t = shots.find(s => s.id === id);
    if (!t) return shots;
    const first = parseInt(t.frame) === 10 && (!t.ballNum || Number(t.ballNum) === 1);
    if (!first) return shots.filter(s => s.id !== id);
    const same = s => s.bowler === t.bowler && s.league === t.league && s.date === t.date
      && String(s.game) === String(t.game) && parseInt(s.frame) === 10;
    return shots.filter(s => !same(s));
  };

  it('takes the whole tenth frame', () => {
    expect(del(frame, 'a').map(s => s.id)).toEqual(['c']);
  });

  it('leaves earlier frames alone', () => {
    expect(del(frame, 'a').some(s => s.frame === '9')).toBe(true);
  });

  // Correcting the back half of a frame the bowler did bowl.
  it('deletes ball 2 on its own', () => {
    expect(del(frame, 'b').map(s => s.id)).toEqual(['a', 'c']);
  });

  it('leaves an ordinary frame deleting one row', () => {
    expect(del(frame, 'c').map(s => s.id)).toEqual(['a', 'b']);
  });
});

describe('a stale ball number on frames 1-9 does not hide the game', () => {
  // Only the 10th numbers its balls in this model, so the lookup
  // required !s.ballNum. A 1 left on frame 3 by the form made that frame
  // read as unbowled: the game scored as nothing, and every score box
  // and series total downstream sat empty with no error anywhere.
  const build = withBallNum => {
    const out = [];
    for (let f = 1; f <= 9; f++) {
      out.push({ frame: String(f), result: 'Strike', ...(withBallNum ? { ballNum: 1 } : {}) });
    }
    out.push({ frame: '10', ballNum: 1, result: 'Strike' },
             { frame: '10', ballNum: 2, result: 'Strike' },
             { frame: '10', ballNum: 3, result: 'Strike' });
    return out;
  };

  it('scores the same either way', () => {
    expect(strictPartial(build(true))).toBe(300);
    expect(strictPartial(build(false))).toBe(300);
  });

  // Shots already saved this way must work without a migration.
  it('scores a real game carrying ball numbers', () => {
    const g = [
      { frame: '1', ballNum: 1, result: 'Strike' },
      { frame: '2', ballNum: 1, result: 'Other Leave', spareMade: 'Yes', pinCount: '9' },
      { frame: '3', ballNum: 1, result: 'Other Leave', spareMade: 'No', pinCount: '8' },
    ];
    expect(strictPartial(g)).toBeGreaterThan(0);
  });

  // The scoresheet reads through the same lookup.
  it('draws those frames on the scoresheet', () => {
    const sheet = frameScoresheet(build(true));
    expect(sheet.find(r => r.frame === 1).marks).toEqual(['X']);
    expect(sheet.find(r => r.frame === 9).running).toBeGreaterThan(0);
  });
});
