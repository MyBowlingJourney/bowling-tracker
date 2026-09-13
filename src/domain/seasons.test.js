import { describe, it, expect } from 'vitest';
import {
  seasonsForLeague, seasonLabel, archiveOnNewStart, seasonHasEnded, seasonForDate,
  seasonSummary, compareSeasons, describeSeasonChange, allSeasonSummaries,
} from './seasons.js';

const CURRENT = { startDate: '2025-09-01' };
const CLOSED = [{ league: 'Tue', startDate: '2024-09-01', endDate: '2025-04-01' }];
const n = (date, scores, league = 'Tue') => ({ bowler: 'Ryan', league, date, scores });
const SESSIONS = [
  n('2024-09-10', [180, 190, 200]),
  n('2025-03-20', [185, 195, 205]),
  n('2025-09-10', [200, 210, 205]),
  n('2026-01-15', [215, 205, 220]),
];

describe('seasons are declared, not inferred', () => {
  // The first version guessed boundaries from gaps in play. It was wrong
  // in both directions and the bowler could see it was wrong with no way
  // to correct it.
  it('gives one closed season and one open one', () => {
    const s = seasonsForLeague('Tue', CLOSED, CURRENT);
    expect(s).toHaveLength(2);
    expect(s[0].closed).toBe(true);
    expect(s[1].closed).toBe(false);
  });

  it('gives only an open season when nothing has been closed', () => {
    const s = seasonsForLeague('Tue', [], CURRENT);
    expect(s).toHaveLength(1);
    expect(s[0].closed).toBe(false);
    expect(s[0].startDate).toBe('2025-09-01');
  });

  // A bowler who never closes a season has one long season. That is the
  // truth about their data rather than a machine's opinion of it.
  it('does not invent a boundary from a long gap', () => {
    const withGap = [n('2024-01-01', [180]), n('2026-01-01', [180])];
    expect(seasonsForLeague('Tue', [], CURRENT)).toHaveLength(1);
    expect(seasonSummary(seasonsForLeague('Tue', [], { startDate: '2023-01-01' })[0], withGap, 'Ryan').games).toBe(2);
  });

  // Ranges are deliberately NOT continuous. A season ends on its end
  // date and the next begins on its own start date; the gap between is
  // the off-season, which is real. Papering over it would put a
  // two-month hole inside a season rather than between two.
  it('leaves the off-season as a gap between seasons', () => {
    const s = seasonsForLeague('Tue', CLOSED, CURRENT);
    expect(s[0].endDate).toBe('2025-04-01');
    expect(s[1].startDate).toBe('2025-09-01');
  });

  it('keeps leagues separate', () => {
    const mixed = [...CLOSED, { league: 'Thu', startDate: '2024-01-01', endDate: '2024-06-01' }];
    expect(seasonsForLeague('Tue', mixed, CURRENT).filter(s => s.closed)).toHaveLength(1);
  });
});

describe('a season ends on its end date', () => {
  // No button. A league has an end date; when it passes, the season is
  // over. Asking the bowler to confirm what the date already says is
  // bookkeeping the app can do itself.
  it('is over once the end date has passed', () => {
    expect(seasonHasEnded('2025-04-15', '2025-09-01')).toBe(true);
  });

  it('is not over on the end date itself', () => {
    expect(seasonHasEnded('2025-04-15', '2025-04-15')).toBe(false);
  });

  it('is not over without an end date', () => {
    expect(seasonHasEnded('', '2025-09-01')).toBe(false);
  });
});

describe('archiving when a new season starts', () => {
  const current = { startDate: '2025-09-01', endDate: '2026-04-15' };

  // The archive happens at the only moment the data would otherwise be
  // lost: the edit that overwrites the old range.
  it('archives the old range when the new start is after the old end', () => {
    const r = archiveOnNewStart('Tue', current, '2026-09-01');
    expect(r.startDate).toBe('2025-09-01');
    expect(r.endDate).toBe('2026-04-15');
  });

  // Editing the start date inside the current range is a correction, not
  // a new season, and archiving it would create a phantom.
  it('does not archive a correction inside the current range', () => {
    expect(archiveOnNewStart('Tue', current, '2025-09-08')).toBe(null);
  });

  it('does not archive when the new start is before the old end', () => {
    expect(archiveOnNewStart('Tue', current, '2026-04-01')).toBe(null);
  });

  it('does not archive a season with no end date yet', () => {
    expect(archiveOnNewStart('Tue', { startDate: '2025-09-01' }, '2026-09-01')).toBe(null);
  });

  it('does nothing without a new start date', () => {
    expect(archiveOnNewStart('Tue', current, '')).toBe(null);
  });
});

describe('seasons are named by their years', () => {
  // How bowlers name their own seasons. "Sep 2024 - Apr 2025" is four
  // words to say what two digits say, and the point of a label is
  // telling seasons apart rather than describing either.
  it('spans two years as 2024-25', () => {
    expect(seasonLabel('2024-09-01', '2025-04-15')).toBe('2024-25');
  });

  it('gives a single year when it does not span one', () => {
    expect(seasonLabel('2025-06-01', '2025-08-30')).toBe('2025');
  });

  it('marks an open season', () => {
    expect(seasonLabel('2025-09-01', '')).toBe('2025-');
  });
});

describe('attributing a night to a season', () => {
  const seasons = seasonsForLeague('Tue', CLOSED, CURRENT);

  it('puts a night inside a closed range in that season', () => {
    expect(seasonForDate('2024-10-01', seasons).closed).toBe(true);
  });

  it('puts a later night in the open season', () => {
    expect(seasonForDate('2026-01-15', seasons).closed).toBe(false);
  });

  it('includes the boundary dates themselves', () => {
    expect(seasonForDate('2024-09-01', seasons)).toBeTruthy();
    expect(seasonForDate('2025-04-01', seasons).closed).toBe(true);
  });

  it('returns nothing for a date before every season', () => {
    expect(seasonForDate('2020-01-01', seasons)).toBe(null);
  });
});

describe('summaries', () => {
  const seasons = seasonsForLeague('Tue', CLOSED, CURRENT);

  it('counts only the nights inside the season', () => {
    expect(seasonSummary(seasons[0], SESSIONS, 'Ryan').games).toBe(6);
    expect(seasonSummary(seasons[1], SESSIONS, 'Ryan').games).toBe(6);
  });

  it('labels a season by its years', () => {
    expect(seasonSummary(seasons[0], SESSIONS, 'Ryan').label).toBe('2024-25');
  });

  it('keeps one bowler out of another’s season', () => {
    const withDave = [...SESSIONS, { bowler: 'Dave', league: 'Tue', date: '2025-10-01', scores: [90] }];
    expect(seasonSummary(seasons[1], withDave, 'Ryan').games).toBe(6);
  });

  it('gives nothing for a season with no nights', () => {
    expect(seasonSummary(seasons[0], [], 'Ryan')).toBe(null);
  });
});

describe('comparing', () => {
  it('reports the change in each figure', () => {
    const c = compareSeasons('Tue', SESSIONS, CLOSED, CURRENT, 'Ryan');
    expect(c.changes.average).toBe(16);
    expect(c.changes.highGame).toBe(15);
  });

  // "You have improved by 0" is worse than saying nothing.
  it('says nothing with only one season', () => {
    expect(compareSeasons('Tue', SESSIONS, [], CURRENT, 'Ryan')).toBe(null);
  });

  it('flags a thin comparison', () => {
    expect(compareSeasons('Tue', SESSIONS, CLOSED, CURRENT, 'Ryan').thin).toBe(true);
  });

  it('states direction and pins without congratulating', () => {
    const d = describeSeasonChange(compareSeasons('Tue', SESSIONS, CLOSED, CURRENT, 'Ryan'));
    expect(d).toContain('up 16 pins');
    expect(d).not.toMatch(/great|well done|unlucky|keep it up/i);
  });

  it('lists every season newest first', () => {
    const all = allSeasonSummaries('Tue', SESSIONS, CLOSED, CURRENT, 'Ryan');
    expect(all).toHaveLength(2);
    expect(all[0].closed).toBe(false);
  });
});

describe('survives junk', () => {
  it('every entry point', () => {
    for (const j of [null, undefined, 'x', 42, {}, [null], [{}]]) {
      expect(() => seasonsForLeague(j, j, j)).not.toThrow();
      expect(() => archiveOnNewStart(j, j, j)).not.toThrow();
      expect(() => seasonHasEnded(j, j)).not.toThrow();
      expect(() => seasonForDate(j, j)).not.toThrow();
      expect(() => seasonSummary(j, j, j)).not.toThrow();
      expect(() => compareSeasons(j, j, j, j, j)).not.toThrow();
      expect(() => describeSeasonChange(j)).not.toThrow();
      expect(() => allSeasonSummaries(j, j, j, j, j)).not.toThrow();
      expect(() => seasonLabel(j, j)).not.toThrow();
    }
    expect(seasonsForLeague(null, null, null)).toEqual([]);
    expect(compareSeasons(null, null, null, null, null)).toBe(null);
  });
});
