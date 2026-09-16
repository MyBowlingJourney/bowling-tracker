import { describe, it, expect } from 'vitest';
import { practiceGames, practiceDrills, practiceSummary, practiceShotStats } from './practiceSummary.js';

const night = { bowler: 'R', date: 'd1' };
const drill = (target, made, missed) => ({ ...night, target, made, missed });

describe('a practice session, both halves', () => {
  // A bowler often shoots games AND stays to work corner pins. Each chip
  // only knew about itself, so the half you were not looking at may as
  // well not have happened.
  it('reports games and drills together', () => {
    const s = practiceSummary({
      sessions: [{ ...night, scores: [180, 195, 210] }],
      drills: [drill('10pin', 14, 6)],
      ...night,
    });
    expect(s.didGames).toBe(true);
    expect(s.didDrills).toBe(true);
    expect(s.games.average).toBe(195);
    expect(s.drillRate).toBe(70);
  });

  // Two sittings at the 10 pin is one thing done twice, not two things.
  it('groups repeated work on one target', () => {
    const t = practiceDrills([drill('10pin', 14, 6), drill('10pin', 4, 1)], night);
    expect(t).toHaveLength(1);
    expect(t[0].attempts).toBe(25);
    expect(t[0].made).toBe(18);
  });

  it('orders targets by how much work they got', () => {
    const t = practiceDrills([drill('7pin', 1, 1), drill('10pin', 10, 10)], night);
    expect(t[0].target).toBe('10pin');
  });

  // An empty section reads as a broken feature rather than a thing you
  // did not do.
  it('flags which halves actually happened', () => {
    const gamesOnly = practiceSummary({ sessions: [{ ...night, scores: [200] }], ...night });
    expect(gamesOnly.didGames).toBe(true);
    expect(gamesOnly.didDrills).toBe(false);

    const drillsOnly = practiceSummary({ drills: [drill('10pin', 3, 1)], ...night });
    expect(drillsOnly.didGames).toBe(false);
    expect(drillsOnly.didDrills).toBe(true);

    expect(practiceSummary(night).didNothing).toBe(true);
  });

  // A session row is only written by "End session", so mid-practice there
  // is nothing there yet.
  it('falls back to live scores before the session is ended', () => {
    const g = practiceGames([], [178, 192], night);
    expect(g.games).toEqual([178, 192]);
    expect(g.best).toBe(192);
  });

  // Counting both would double a night that was ended and reopened.
  it('prefers the session row over live scores', () => {
    const g = practiceGames([{ ...night, scores: [200, 200] }], [178, 192], night);
    expect(g.games).toEqual([200, 200]);
  });

  it('ignores another bowler and another date', () => {
    const rows = [
      { bowler: 'Maggie', date: 'd1', scores: [300] },
      { bowler: 'R', date: 'd2', scores: [300] },
    ];
    expect(practiceGames(rows, [], night).games).toEqual([]);
    expect(practiceDrills([{ ...drill('10pin', 9, 0), bowler: 'Maggie' }], night)).toEqual([]);
  });

  // A rate of zero reads as "missed everything", which is a different
  // claim from "did not attempt".
  it('does not invent a rate with no attempts', () => {
    expect(practiceDrills([drill('10pin', 0, 0)], night)).toEqual([]);
    expect(practiceSummary({ ...night }).drillRate).toBe(null);
  });

  it('survives junk', () => {
    for (const j of [null, undefined, 'x', 42, [null]]) {
      expect(() => practiceSummary(j)).not.toThrow();
      expect(() => practiceGames(j, j, j)).not.toThrow();
      expect(() => practiceDrills(j, j)).not.toThrow();
    }
  });
});

describe('what the frames say about tonight', () => {
  const sh = (result, over = {}) => ({
    bowler: 'R', league: 'P', date: 'd1', ballNum: '1',
    result, otherLeave: [], ...over,
  });

  // Average, best and series is what any scoresheet gives. The reason to
  // record every delivery is that the app can say more.
  it('reports strike, spare and clean rates', () => {
    const st = practiceShotStats([
      sh('Strike'), sh('Strike'),
      sh('Other Leave', { spareMade: 'Yes' }),
      sh('Weak 10', { spareMade: 'No' }),
    ], { bowler: 'R', league: 'P', date: 'd1' });
    expect(st.strikeRate).toBe(50);
    expect(st.spareRate).toBe(50);
    expect(st.cleanRate).toBe(75);
  });

  // A strike rate counts opportunities, and the second ball of a frame
  // was never one.
  it('counts first balls only', () => {
    const st = practiceShotStats([
      sh('Strike'),
      sh('Other Leave', { ballNum: '2' }),
    ], { bowler: 'R', league: 'P', date: 'd1' });
    expect(st.firstBalls).toBe(1);
    expect(st.strikeRate).toBe(100);
  });

  // Inventing detail from three numbers would be worse than not having
  // it, so a scores-only night gets nothing.
  it('returns null with no shots', () => {
    expect(practiceShotStats([], { bowler: 'R', date: 'd1' })).toBe(null);
  });

  it('stays on one bowler and one night', () => {
    const rows = [
      sh('Strike', { bowler: 'Maggie' }),
      sh('Strike', { date: 'd2' }),
    ];
    expect(practiceShotStats(rows, { bowler: 'R', league: 'P', date: 'd1' })).toBe(null);
  });

  // One ball is not a comparison.
  it('names a best ball only when more than one was thrown', () => {
    const one = practiceShotStats(
      [sh('Strike', { ball: 'Zen' }), sh('Strike', { ball: 'Zen' }), sh('Other Leave', { ball: 'Zen' })],
      { bowler: 'R', league: 'P', date: 'd1' });
    expect(one.bestBall).toBe(null);

    const two = practiceShotStats([
      sh('Strike', { ball: 'Zen' }), sh('Strike', { ball: 'Zen' }), sh('Strike', { ball: 'Zen' }),
      sh('Other Leave', { ball: 'Phaze' }), sh('Other Leave', { ball: 'Phaze' }), sh('Other Leave', { ball: 'Phaze' }),
    ], { bowler: 'R', league: 'P', date: 'd1' });
    expect(two.bestBall.ball).toBe('Zen');
    expect(two.bestBall.rate).toBe(100);
  });

  // Three first balls is not enough to rank a ball on.
  it('ignores a ball with too few first balls', () => {
    const st = practiceShotStats([
      sh('Strike', { ball: 'Zen' }), sh('Strike', { ball: 'Zen' }), sh('Strike', { ball: 'Zen' }),
      sh('Strike', { ball: 'OneOff' }),
    ], { bowler: 'R', league: 'P', date: 'd1' });
    expect(st.bestBall).toBe(null);
  });

  it('counts splits when given a detector', () => {
    const st = practiceShotStats(
      [sh('Other Leave', { otherLeave: ['7', '10'] }), sh('Strike')],
      { bowler: 'R', league: 'P', date: 'd1', isSplit: s => (s.otherLeave || []).length === 2 });
    expect(st.splits).toBe(1);
  });

  // A spare rate of zero and no chances at all are different claims.
  it('has no spare rate without a chance', () => {
    const st = practiceShotStats([sh('Strike'), sh('Strike')],
      { bowler: 'R', league: 'P', date: 'd1' });
    expect(st.spareChances).toBe(0);
    expect(st.spareRate).toBe(null);
  });

  it('survives junk', () => {
    for (const j of [null, undefined, 'x', 42, [null]]) {
      expect(() => practiceShotStats(j, j)).not.toThrow();
    }
  });
});
