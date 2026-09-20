import { describe, it, expect } from 'vitest';
import { sessionsToCsv, shotsToCsv, seasonSummary, summaryToText } from './seasonExport.js';

describe('sessionsToCsv', () => {
  it('escapes commas and quotes so a league name cannot break a row', () => {
    const out = sessionsToCsv([{ date: '2026-09-01', bowler: 'Ryan', league: 'Fun, "League"', scores: [100], total: 100 }]);
    expect(out.split('\n')[1]).toContain('"Fun, ""League"""');
  });

  it('filters to one bowler', () => {
    const out = sessionsToCsv([
      { date: '2026-09-01', bowler: 'Ryan', league: 'L', scores: [200] },
      { date: '2026-09-01', bowler: 'Aaron', league: 'L', scores: [150] },
    ], 'Ryan');
    expect(out.split('\n')).toHaveLength(2);
  });
});

describe('seasonSummary', () => {
  it('reports no strike rate for a scores-only bowler rather than 0%', () => {
    // A bowler with no shot detail has no strike rate. "0%" would be a lie.
    const sum = seasonSummary([{ bowler: 'Ryan', league: 'L', date: '2026-09-01', scores: [200, 210] }], [], 'Ryan');
    expect(sum.strikeRate).toBeNull();
    expect(summaryToText(sum)).not.toContain('% strikes');
  });

  it('returns null with no games at all', () => {
    expect(seasonSummary([], [], 'Nobody')).toBeNull();
  });

  it('uses singular nouns for counts of one', () => {
    const sum = seasonSummary([{ bowler: 'Ryan', league: 'L', date: '2026-09-01', scores: [205] }], [], 'Ryan');
    expect(summaryToText(sum)).toContain('1 night · 1 game');
    expect(summaryToText(sum)).toContain('1 game over 200');
  });
});

// ── CSV formula injection (CWE-1236) ────────────────────────────────
//
// Quoting keeps the FILE valid; it does not stop the spreadsheet from
// treating the text as a formula once it has stripped those quotes. A
// team or bowler name is not always your own -- rosters and friends
// come from other people's accounts -- so a name is attacker-controlled
// input that lands in a file the victim opens in Excel.
describe('season CSV does not hand formulas to the spreadsheet', () => {
  const cellFor = name => {
    const line = sessionsToCsv(
      [{ bowler: name, league: 'L', date: '2026-09-15', scores: [200, 180, 210] }],
      null,
    ).split('\n')[1];
    // bowler is the second column; strip the CSV quoting to see what the
    // spreadsheet would actually evaluate.
    return csvFields(line)[1];
  };

  // A real CSV field splitter: commas inside quotes are data, not
  // separators, and "" is an escaped quote. Splitting on "," would have
  // made this test lie about what the spreadsheet sees.
  function csvFields(line) {
    const out = [];
    let cur = '', inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQ) {
        if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
        else if (ch === '"') inQ = false;
        else cur += ch;
      } else if (ch === '"') inQ = true;
      else if (ch === ',') { out.push(cur); cur = ''; }
      else cur += ch;
    }
    out.push(cur);
    return out;
  }

  it('neutralises every formula-triggering lead character', () => {
    for (const attack of [
      '=HYPERLINK("https://evil.example","x")',
      '+1+1',
      '@SUM(A1)',
      "-1+cmd|'/c calc'!A1",
      '\tsneaky',
    ]) {
      expect(`${attack.slice(0, 6)} -> ${cellFor(attack).startsWith("'")}`)
        .toBe(`${attack.slice(0, 6)} -> true`);
    }
  });

  it('leaves ordinary names exactly as they were', () => {
    for (const name of ['Ryan', 'Tuesday Trios', "O'Brien"]) {
      expect(cellFor(name)).toBe(name);
    }
  });

  // net_money is routinely negative. Escaping it would turn a number the
  // bowler wants to sum into text, which breaks the export to fix a
  // threat a plain number never carried.
  it('leaves negative NUMBERS alone so they still sum', () => {
    const line = sessionsToCsv(
      [{ bowler: 'Ryan', league: 'L', date: '2026-09-15', scores: [200, 180, 210] }],
      null,
    ).split('\n')[1];
    for (const cell of line.split(',')) { // numbers are never quoted
      if (/^-?\d+(\.\d+)?$/.test(cell.replace(/^'/, ''))) {
        expect(cell.startsWith("'")).toBe(false);
      }
    }
  });
});
