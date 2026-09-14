import { describe, it, expect } from 'vitest';
import {
  parseMonthKey,
  monthKey,
  monthsWithSessions,
  nightSummary,
  monthGrid,
  monthLabel,
  weekdayLabels,
  shiftMonth,
  cellModes,
  tournamentNights,
  sessionMode,
  shotNights,
  drillNights,
} from './calendar.js';

const n = (date, scores, league = 'Tue', bowler = 'Ryan') => ({ bowler, league, date, scores });
const FEB = [
  n('2026-02-03', [180, 190, 200]),
  n('2026-02-10', [210, 205, 195]),
  n('2026-02-24', [200, 200, 200]),
];

describe('month keys', () => {
  it('parses and rebuilds', () => {
    expect(parseMonthKey('2026-02')).toEqual({ year: 2026, month: 2 });
    expect(monthKey(2026, 2)).toBe('2026-02');
  });

  it('refuses nonsense', () => {
    for (const bad of ['2026-13', '2026-00', '202602', '', null, 42]) {
      expect(parseMonthKey(bad)).toBe(null);
    }
  });

  // Adding days to January 31st lands in March.
  it('steps by calendar month, not by days', () => {
    expect(shiftMonth('2026-01', 1)).toBe('2026-02');
    expect(shiftMonth('2026-01', -1)).toBe('2025-12');
    expect(shiftMonth('2026-12', 1)).toBe('2027-01');
    expect(shiftMonth('2026-03', -14)).toBe('2025-01');
  });
});

describe('the grid', () => {
  const g = monthGrid('2026-02', FEB, 'Ryan', 'Tue');

  // Always six rows, so the calendar does not change height as a bowler
  // pages through months and the buttons stay under the thumb.
  it('is always 42 cells', () => {
    expect(g.cells).toHaveLength(42);
    expect(monthGrid('2026-03', [], 'Ryan').cells).toHaveLength(42);
  });

  it('puts every day of the month in exactly once', () => {
    const days = g.cells.map(c => c.day).filter(d => d !== null);
    expect(days).toHaveLength(28);            // February 2026
    expect(new Set(days).size).toBe(28);
  });

  it('handles a leap February', () => {
    const days = monthGrid('2024-02', [], 'Ryan').cells.map(c => c.day).filter(Boolean);
    expect(days).toHaveLength(29);
  });

  // Session dates are plain YYYY-MM-DD with no zone. Parsing them into a
  // Date and back can shift a night into the previous day's box.
  it('puts a night in the right box regardless of timezone', () => {
    const cell = g.cells.find(c => c.date === '2026-02-03');
    expect(cell.nights).toHaveLength(1);
    expect(cell.nights[0].series).toBe(570);
  });

  it('lines a weekly league up in one column', () => {
    const cols = g.cells
      .map((c, i) => ({ i, c }))
      .filter(x => x.c.nights.length)
      .map(x => x.i % 7);
    expect(new Set(cols).size).toBe(1);
  });

  it('leaves days with no bowling empty', () => {
    expect(g.cells.find(c => c.date === '2026-02-04').nights).toEqual([]);
  });

  // A league night and a practice session on one day is real.
  it('keeps both nights when two fall on one day', () => {
    const two = [...FEB, n('2026-02-03', [150], 'Practice')];
    const cell = monthGrid('2026-02', two, 'Ryan').cells.find(c => c.date === '2026-02-03');
    expect(cell.nights).toHaveLength(2);
  });

  it('summarises the month', () => {
    expect(g.nightsBowled).toBe(3);
    expect(g.games).toBe(9);
    expect(g.average).toBe(198);
    expect(g.high).toBe(210);
  });

  it('gives an empty month null figures rather than zero', () => {
    const empty = monthGrid('2026-03', FEB, 'Ryan');
    expect(empty.nightsBowled).toBe(0);
    expect(empty.average).toBe(null);
  });

  it('keeps one bowler out of another’s calendar', () => {
    const mixed = [...FEB, n('2026-02-17', [90], 'Tue', 'Dave')];
    expect(monthGrid('2026-02', mixed, 'Ryan').nightsBowled).toBe(3);
  });

  it('filters by league when given one', () => {
    const mixed = [...FEB, n('2026-02-17', [150], 'Thu')];
    expect(monthGrid('2026-02', mixed, 'Ryan', 'Tue').nightsBowled).toBe(3);
    expect(monthGrid('2026-02', mixed, 'Ryan', '').nightsBowled).toBe(4);
  });

  it('refuses a bad month key', () => {
    expect(monthGrid('nonsense', FEB, 'Ryan')).toBe(null);
  });
});

describe('week start', () => {
  // League nights are named by weekday, so which column a Tuesday sits
  // in matters to a bowler scanning for their own night.
  it('shifts the grid when the week starts on Monday', () => {
    const sun = monthGrid('2026-02', FEB, 'Ryan', 'Tue', 0);
    const mon = monthGrid('2026-02', FEB, 'Ryan', 'Tue', 1);
    const firstOf = g => g.cells.findIndex(c => c.day === 1);
    expect(firstOf(sun)).not.toBe(firstOf(mon));
  });

  it('labels weekdays in the matching order', () => {
    expect(weekdayLabels(0)).toHaveLength(7);
    expect(weekdayLabels(1)).toHaveLength(7);
    expect(weekdayLabels(0)[0]).not.toBe(weekdayLabels(1)[0]);
  });
});

describe('months with sessions', () => {
  it('lists only months with something in them, newest first', () => {
    const spread = [n('2025-11-04', [180]), n('2026-02-03', [180])];
    expect(monthsWithSessions(spread, 'Ryan')).toEqual(['2026-02', '2025-11']);
  });

  it('ignores a night with no usable date', () => {
    expect(monthsWithSessions([n('', [180]), n('nope', [180])], 'Ryan')).toEqual([]);
  });
});

describe('night summary', () => {
  it('reports series, high and average', () => {
    const s = nightSummary(n('2026-02-03', [180, 190, 200]));
    expect(s.series).toBe(570);
    expect(s.high).toBe(200);
    expect(s.average).toBe(190);
  });

  it('gives nothing for a night with no scores', () => {
    expect(nightSummary(n('2026-02-03', []))).toBe(null);
  });
});

describe('survives junk', () => {
  it('every entry point', () => {
    for (const j of [null, undefined, 'x', 42, {}, [null], [{}]]) {
      expect(() => monthGrid(j, j, j, j, j)).not.toThrow();
      expect(() => monthsWithSessions(j, j, j)).not.toThrow();
      expect(() => nightSummary(j)).not.toThrow();
      expect(() => monthLabel(j)).not.toThrow();
      expect(() => shiftMonth(j, j)).not.toThrow();
      expect(() => weekdayLabels(j)).not.toThrow();
    }
    expect(monthsWithSessions(null, 'Ryan')).toEqual([]);
    expect(monthGrid(null, null, null)).toBe(null);
  });
});

describe('cell fill modes', () => {
  const night = mode => ({ mode, scores: [180], date: '2026-02-03' });

  it('gives one mode for a single kind of night', () => {
    expect(cellModes([night('league')])).toEqual(['league']);
  });

  // A league night and a practice session on one day splits the square
  // rather than one silently winning.
  it('gives both when two kinds share a day', () => {
    expect(cellModes([night('league'), night('practice')])).toEqual(['league', 'practice']);
  });

  it('does not repeat a mode bowled twice in a day', () => {
    expect(cellModes([night('league'), night('league')])).toEqual(['league']);
  });

  // A square is 40px. A third band would be 13px of colour nobody can
  // read, and the detail is one tap away.
  it('caps at two', () => {
    expect(cellModes([night('league'), night('practice'), night('tournament')]))
      .toHaveLength(2);
  });

  it('defaults an untagged night to league', () => {
    expect(cellModes([{ scores: [180] }])).toEqual(['league']);
  });

  it('survives junk', () => {
    for (const j of [null, undefined, 'x', 42, [null]]) {
      expect(() => cellModes(j)).not.toThrow();
    }
    expect(cellModes(null)).toEqual([]);
  });
});

describe('tournament nights', () => {
  const t = [{ bowler: 'Ryan', name: 'City Open', days: [
    { date: '2026-02-14', games: [{ score: '220' }, { score: '195' }] },
    { date: '2026-02-15', games: [] },
  ] }];

  // Tournaments live in their own table, so a tournament weekend would
  // otherwise be a blank square on a day spent eight hours at a centre.
  it('turns tournament days into nights', () => {
    const nights = tournamentNights(t, 'Ryan');
    expect(nights).toHaveLength(1);
    expect(nights[0].mode).toBe('tournament');
    expect(nights[0].scores).toEqual([220, 195]);
  });

  it('skips a day with no scores entered', () => {
    expect(tournamentNights(t, 'Ryan').map(n => n.date)).not.toContain('2026-02-15');
  });

  it('survives junk', () => {
    for (const j of [null, undefined, 'x', 42, [null], [{ days: 'no' }]]) {
      expect(() => tournamentNights(j, 'Ryan')).not.toThrow();
    }
    expect(tournamentNights(null, 'Ryan')).toEqual([]);
  });
});

describe('nights the calendar used to miss', () => {
  const B = 'Ryan';
  const sh = (lg, d) => ({ bowler: B, league: lg, date: d, frame: '1', result: 'Strike' });

  // A session row is only written by "End session". A bowler who logs a
  // night's frames and closes the app had no row, so a month of real
  // bowling read "Nothing logged yet".
  it('counts a night that has frames but no session row', () => {
    expect(shotNights([sh('Tuesday', '2026-09-05')], [])).toHaveLength(1);
  });

  it('does not double a night that already has a session row', () => {
    const sessions = [{ bowler: B, league: 'Tuesday', date: '2026-09-05', scores: [180] }];
    expect(shotNights([sh('Tuesday', '2026-09-05')], sessions)).toHaveLength(0);
  });

  it('keeps each mode distinct', () => {
    const nights = shotNights([
      sh('Tuesday', '2026-09-01'),
      sh('Practice\u00b7u1', '2026-09-02'),
      sh('Tournament\u00b7T5\u00b7u1', '2026-09-03'),
      sh('Just Bowling\u00b7u1', '2026-09-04'),
    ], []);
    expect(nights.map(n => n.mode).sort())
      .toEqual(['casual', 'league', 'practice', 'tournament']);
  });

  // A drill has no league and no game scores, so it never reached the
  // calendar -- and for a bowler whose practice IS drills, that was most
  // of their practice missing.
  it('counts a drill night as practice', () => {
    const nights = drillNights([{ bowler: B, date: '2026-09-06', made: 7, missed: 3 }], []);
    expect(nights).toHaveLength(1);
    expect(nights[0].mode).toBe('practice');
  });

  it('merges several drills on one date into one night', () => {
    const nights = drillNights([
      { bowler: B, date: '2026-09-06', made: 7, missed: 3 },
      { bowler: B, date: '2026-09-06', made: 5, missed: 5 },
    ], []);
    expect(nights).toHaveLength(1);
    expect(nights[0].drillAttempts).toBe(20);
  });

  it('does not double a drill night that already bowled games', () => {
    const existing = [{ bowler: B, league: 'Tuesday', date: '2026-09-01', scores: [180] }];
    expect(drillNights([{ bowler: B, date: '2026-09-01', made: 4, missed: 1 }], existing))
      .toHaveLength(0);
  });

  // The scoreless guard is right for a session ROW and wrong for a night
  // built from frames.
  it('keeps a scoreless night that came from frames', () => {
    expect(nightSummary({ bowler: B, league: 'T', date: '2026-09-05', scores: [], inProgress: true }))
      .not.toBe(null);
  });

  it('still drops an empty session row', () => {
    expect(nightSummary({ bowler: B, league: 'T', date: '2026-09-05', scores: [] })).toBe(null);
  });
});
