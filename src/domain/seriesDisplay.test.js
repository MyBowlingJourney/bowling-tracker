import { describe, it, expect } from 'vitest';
import { seriesTotal, resolveGameScore, setManualScore } from './manualScores.js';

// ── What the Enter Game Scores card shows for a series ──────────────────
//
// The card summed `entered` -- the TYPED scores only -- so a night bowled
// frame by frame showed every game's score sitting in its own box and
// then no series and no average underneath them, and a blank summary on
// the collapsed card. The numbers were on screen and refused to add up.
//
// The boxes had always displayed the resolved score (typed if there is
// one, otherwise the frames), so the card disagreed with itself. These
// tests pin the two halves to the same rule.

const B = 'Ryan', L = 'Monday', D = '2026-09-20';

// The card's own derivation, kept in one place so the assertions below
// describe the card rather than re-deriving it each time.
const card = (frameScores, manualScores = {}) => {
  const games = frameScores.map((_, i) => i + 1);
  const resolved = games.map(g =>
    resolveGameScore(manualScores, B, L, D, g, frameScores[g - 1] ?? null));
  const total = seriesTotal(resolved);
  const scored = resolved.filter(v => typeof v === 'number').length;
  return {
    boxes: games.map(g => {
      const m = resolveGameScore(manualScores, B, L, D, g, null);
      return m != null ? String(m) : (frameScores[g - 1] == null ? '' : String(frameScores[g - 1]));
    }),
    total,
    average: scored ? Math.round(total / scored) : null,
  };
};

describe('a night bowled frame by frame', () => {
  it('shows a series, not a blank', () => {
    const c = card([200, 180, 220]);
    expect(c.total).toBe(600);
    expect(c.average).toBe(200);
  });

  it('shows the same numbers in the boxes that it adds up', () => {
    const c = card([200, 180, 220]);
    expect(c.boxes).toEqual(['200', '180', '220']);
    expect(c.boxes.reduce((a, b) => a + Number(b), 0)).toBe(c.total);
  });

  it('counts only the games that have been bowled', () => {
    const c = card([200, 180, null]);
    expect(c.total).toBe(380);
    expect(c.average).toBe(190);          // not 380/3
  });

  it('has nothing to show before the first ball', () => {
    const c = card([null, null, null]);
    expect(c.total).toBeNull();
    expect(c.average).toBeNull();         // never a divide by zero
  });
});

describe('typed scores and frames together', () => {
  it('lets a typed score win its game and carry into the series', () => {
    const ms = setManualScore({}, B, L, D, 2, '175');
    const c = card([200, 180, 220], ms);
    expect(c.boxes[1]).toBe('175');
    expect(c.total).toBe(200 + 175 + 220);
  });

  // The average used to divide a resolved total by a count of TYPED
  // scores, so one typed game in a frame-tracked night reported that
  // game's score as the whole average.
  it('averages over every scored game, not just the typed ones', () => {
    const ms = setManualScore({}, B, L, D, 1, '175');
    const c = card([200, 180, 220], ms);
    expect(c.total).toBe(575);
    expect(c.average).toBe(192);          // 575/3, not 575/1
  });

  it('hands the game back to the frames when a typed score is cleared', () => {
    const ms = setManualScore(setManualScore({}, B, L, D, 2, '175'), B, L, D, 2, '');
    const c = card([200, 180, 220], ms);
    expect(c.boxes[1]).toBe('180');
    expect(c.total).toBe(600);
  });

  it('works for a night that is entirely typed', () => {
    let ms = {};
    ms = setManualScore(ms, B, L, D, 1, '190');
    ms = setManualScore(ms, B, L, D, 2, '201');
    ms = setManualScore(ms, B, L, D, 3, '178');
    const c = card([null, null, null], ms);
    expect(c.total).toBe(569);
    expect(c.average).toBe(190);
  });
});
