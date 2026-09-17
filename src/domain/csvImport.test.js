import { describe, it, expect } from 'vitest';
import {
  parseCsv, mapHeader, validateDate, validateScore, validateImport, MAX_ROWS,
} from './csvImport.js';

const file = (...lines) => ['date,game1,game2,game3', ...lines].join('\n');
const TODAY = { today: '2026-09-17' };

describe('parsing the file', () => {
  // Excel writes a BOM by default, and it otherwise becomes part of the
  // first header name -- so "date" never matches and every file from
  // Excel is rejected for a missing column.
  it('survives a BOM and CRLF line endings', () => {
    const rows = parseCsv('\uFEFFdate,game1\r\n2026-09-01,210\r\n');
    expect(rows[0][0]).toBe('date');
    expect(rows[1]).toEqual(['2026-09-01', '210']);
  });

  // A league export with "Smith, John" in it would shift every column
  // after it if commas were split on blindly.
  it('keeps commas inside quoted fields', () => {
    expect(parseCsv('a,"one, two",c')[0]).toEqual(['a', 'one, two', 'c']);
  });

  it('handles escaped quotes', () => {
    expect(parseCsv('"he said ""hi"""')[0]).toEqual(['he said "hi"']);
  });

  it('ignores a trailing newline', () => {
    expect(parseCsv('a,b\n1,2\n')).toHaveLength(2);
  });

  it('survives junk', () => {
    for (const j of [null, undefined, '', '   ', 42]) {
      expect(() => parseCsv(j)).not.toThrow();
    }
  });
});

describe('header matching', () => {
  it('accepts common spellings', () => {
    for (const row of [
      ['date', 'game1', 'game2', 'game3'],
      ['Date', 'Game 1', 'Game 2', 'Game 3'],
      ['DAY', 'G1', 'G2', 'G3'],
      ['date_bowled', 'game_1', 'game_2', 'game_3'],
    ]) {
      const idx = mapHeader(row);
      expect(Object.keys(idx).sort()).toEqual(['date', 'game1', 'game2', 'game3']);
    }
  });

  it('does not invent a column that is absent', () => {
    expect(mapHeader(['date', 'game1']).game3).toBeUndefined();
  });
});

describe('dates', () => {
  // 01/02/2026 is 1 February to most of the world and 2 January in the
  // US. Guessing would file a whole season to the wrong dates silently.
  it('takes ISO only', () => {
    expect(validateDate('2026-09-01', TODAY).ok).toBe(true);
    for (const bad of ['09/01/2026', '1-9-2026', 'Sep 1 2026', '20260901']) {
      expect(validateDate(bad, TODAY).ok).toBe(false);
    }
  });

  // Date.parse accepts 2026-02-31 and rolls it into March.
  it('rejects a day that does not exist', () => {
    expect(validateDate('2026-02-31', TODAY).ok).toBe(false);
    expect(validateDate('2026-13-01', TODAY).ok).toBe(false);
  });

  it('accepts a real leap day and rejects a fake one', () => {
    expect(validateDate('2024-02-29', TODAY).ok).toBe(true);
    expect(validateDate('2026-02-29', TODAY).ok).toBe(false);
  });

  it('rejects the future', () => {
    expect(validateDate('2026-09-18', TODAY).ok).toBe(false);
    expect(validateDate('2026-09-17', TODAY).ok).toBe(true);
  });

  it('rejects an empty date', () => {
    expect(validateDate('', TODAY).ok).toBe(false);
  });
});

describe('scores', () => {
  it('takes whole numbers in range', () => {
    for (const n of [0, 1, 150, 299, 300]) {
      expect(validateScore(String(n), 'game 1').value).toBe(n);
    }
  });

  it('rejects out of range', () => {
    for (const n of ['-1', '301', '1000']) {
      expect(validateScore(n, 'game 1').ok).toBe(false);
    }
  });

  it('rejects anything that is not a whole number', () => {
    for (const v of ['abc', '19.5', '2e3', '1 0']) {
      expect(validateScore(v, 'game 1').ok).toBe(false);
    }
  });

  // A night can be one or two games; a bowler should not have to invent
  // a third. Blank is not zero -- zero is a score somebody can bowl.
  it('treats blank as absent, not zero', () => {
    expect(validateScore('', 'game 2')).toEqual({ ok: true, value: null });
    expect(validateScore('0', 'game 2').value).toBe(0);
  });
});

describe('validating a whole file', () => {
  it('accepts a clean file', () => {
    const r = validateImport(file('2026-09-01,210,190,230', '2026-09-08,205,195,215'), TODAY);
    expect(r.ok).toBe(true);
    expect(r.accepted).toHaveLength(2);
    expect(r.accepted[0].scores).toEqual([210, 190, 230]);
  });

  // One typo in row 40 should not cost a bowler the other 39.
  it('keeps the good rows when one is bad', () => {
    const r = validateImport(file('2026-09-01,210,190,230', '2026-09-08,301,195,215'), TODAY);
    expect(r.accepted).toHaveLength(1);
    expect(r.rejected).toHaveLength(1);
    expect(r.rejected[0].reason).toContain('between 0 and 300');
  });

  // Spreadsheet row numbers: the header is row 1.
  it('numbers rows as the spreadsheet does', () => {
    const r = validateImport(file('2026-09-01,999,0,0'), TODAY);
    expect(r.rejected[0].line).toBe(2);
  });

  it('allows a short night', () => {
    const r = validateImport(file('2026-09-01,205,,'), TODAY);
    expect(r.accepted[0].scores).toEqual([205]);
  });

  // 210, blank, 195 means a column was missed, not that the middle game
  // was skipped.
  it('rejects a gap between two scores', () => {
    const r = validateImport(file('2026-09-01,210,,195'), TODAY);
    expect(r.rejected[0].reason).toContain('blank between two scores');
  });

  it('rejects a row with no scores at all', () => {
    const r = validateImport(file('2026-09-01,,,'), TODAY);
    expect(r.rejected[0].reason).toContain('no scores');
  });

  it('skips a wholly blank line without complaining', () => {
    const r = validateImport(file('2026-09-01,210,190,230', ',,,'), TODAY);
    expect(r.accepted).toHaveLength(1);
    expect(r.rejected).toHaveLength(0);
  });

  it('catches the same date twice in one file', () => {
    const r = validateImport(file('2026-09-01,210,190,230', '2026-09-01,180,180,180'), TODAY);
    expect(r.accepted).toHaveLength(1);
    expect(r.rejected[0].reason).toContain('twice');
  });

  it('will not import a night already logged', () => {
    const r = validateImport(file('2026-09-01,210,190,230'),
      { ...TODAY, existingDates: ['2026-09-01'] });
    expect(r.accepted).toHaveLength(0);
    expect(r.rejected[0].reason).toContain('already have a night');
  });

  it('names the columns it needs', () => {
    const r = validateImport('date,game1\n2026-09-01,210', TODAY);
    expect(r.ok).toBe(false);
    expect(r.error).toContain('game2');
  });

  it('refuses an empty file', () => {
    expect(validateImport('', TODAY).ok).toBe(false);
  });

  it('refuses a file over the row cap', () => {
    const rows = Array.from({ length: MAX_ROWS + 1 }, (_, i) => `2020-01-01,200,200,200`);
    const r = validateImport(file(...rows), TODAY);
    expect(r.ok).toBe(false);
    expect(r.error).toContain(String(MAX_ROWS));
  });

  it('survives junk', () => {
    for (const j of [null, undefined, 42, {}, []]) {
      expect(() => validateImport(j, j)).not.toThrow();
    }
  });
});
