import { describe, it, expect } from 'vitest';
import { practiceGames, practiceDrills, practiceSummary } from './practiceSummary.js';

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
