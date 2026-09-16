import { describe, it, expect } from 'vitest';
import { sessionIsLive, seasonFigures, journeyRecap } from './home.js';

const night = (date, scores) => ({ bowler: 'R', league: 'Tuesday', date, scores });

describe('what home says', () => {
  const sessions = [
    night('2026-09-01', [218, 201, 226]),
    night('2026-09-08', [190, 205, 240]),
    night('2026-08-01', [300, 200, 200]),
  ];

  // Season-scoped on purpose: a high game from four years ago is a
  // memory, not a standard to measure tonight against. All-time belongs
  // on Journey, where it is a milestone.
  it('scopes the figures to the season', () => {
    const f = seasonFigures(sessions, { bowler: 'R', leagues: ['Tuesday'], since: '2026-09-01' });
    expect(f.highGame).toBe(240);
    expect(f.games).toBe(6);
  });

  it('includes everything without a start date', () => {
    expect(seasonFigures(sessions, { bowler: 'R' }).highGame).toBe(300);
  });

  // A two-game night would otherwise look like a poor three-game series.
  it('only counts a full night as a series', () => {
    const f = seasonFigures([night('2026-09-01', [200, 200])], { bowler: 'R' });
    expect(f.highSeries).toBe(null);
    expect(f.average).toBe(200);
  });

  // A zero average reads as terrible bowling; a blank reads as a new
  // season.
  it('returns blanks, not zeroes, with no games', () => {
    const f = seasonFigures([], { bowler: 'R' });
    expect(f.average).toBe(null);
    expect(f.highGame).toBe(null);
    expect(f.highSeries).toBe(null);
  });

  it('ignores another bowler', () => {
    const theirs = [{ ...night('2026-09-01', [300, 300, 300]), bowler: 'Maggie' }];
    expect(seasonFigures(theirs, { bowler: 'R' }).average).toBe(null);
  });

  it('ignores leagues outside the scope', () => {
    const other = [{ ...night('2026-09-01', [300, 300, 300]), league: 'Practice\u00b7u1' }];
    expect(seasonFigures(other, { bowler: 'R', leagues: ['Tuesday'] }).average).toBe(null);
  });

  // Home becomes the scoring screen while a night is live, so this
  // decides which of two entirely different screens appears on launch.
  it('sees a night that has shots today', () => {
    const shots = [{ bowler: 'R', league: 'Tuesday', date: '2026-09-15', frame: '1' }];
    expect(sessionIsLive(shots, { bowler: 'R', league: 'Tuesday', date: '2026-09-15' })).toBe(true);
  });

  it('does not see yesterday as live', () => {
    const shots = [{ bowler: 'R', league: 'Tuesday', date: '2026-09-14', frame: '1' }];
    expect(sessionIsLive(shots, { bowler: 'R', league: 'Tuesday', date: '2026-09-15' })).toBe(false);
  });

  it('needs a bowler, a league and a date', () => {
    const shots = [{ bowler: 'R', league: 'Tuesday', date: '2026-09-15' }];
    expect(sessionIsLive(shots, { bowler: 'R', league: '', date: '2026-09-15' })).toBe(false);
    expect(sessionIsLive(shots, {})).toBe(false);
  });

  // The most recent thing earned, not the next target -- a recap that
  // asks for something is a demand, not a recap.
  it('recaps the latest milestone', () => {
    const r = journeyRecap([
      { state: 'earned', label: 'First 600 series', date: '2026-03-22' },
      { state: 'earned', label: 'First 200 game', date: '2025-01-10' },
    ]);
    expect(r.label).toBe('First 600 series');
    expect(r.total).toBe(2);
  });

  it('has no recap before the first milestone', () => {
    expect(journeyRecap([])).toBe(null);
  });

  it('survives junk', () => {
    for (const j of [null, undefined, 'x', 42, [null]]) {
      expect(() => seasonFigures(j, j)).not.toThrow();
      expect(() => sessionIsLive(j, j)).not.toThrow();
      expect(() => journeyRecap(j)).not.toThrow();
    }
  });
});
