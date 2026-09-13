import { describe, it, expect } from 'vitest';
import {
  parseMonthKey, monthKey, monthsWithSessions, nightSummary,
  monthGrid, monthLabel, weekdayLabels, shiftMonth,
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
