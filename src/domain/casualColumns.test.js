import { describe, it, expect } from 'vitest';
import { deleteGameColumnPlan, columnHasScores } from './casualColumns.js';

// A tiny sheet: {name: [g1, g2, ...]}, null for empty.
const sheet = s => (who, g) => { const v = s[who]?.[g - 1]; return v == null ? null : v; };
const apply = (s, writes) => {
  const out = JSON.parse(JSON.stringify(s));
  for (const w of writes) out[w.who][w.game - 1] = w.value === "" ? null : Number(w.value);
  return out;
};

describe('deleteGameColumnPlan', () => {
  it('moves later games down for everyone and clears the last', () => {
    const s = { Ryan: [180, 200, 220, 190], Kim: [150, 160, 170, null] };
    const after = apply(s, deleteGameColumnPlan({ people: ['Ryan', 'Kim'], game: 2, lastGame: 4, get: sheet(s) }));
    expect(after.Ryan).toEqual([180, 220, 190, null]);
    expect(after.Kim).toEqual([150, 170, null, null]);
  });
  it('deleting the last column just clears it', () => {
    const s = { Ryan: [180, 200, 220] };
    const after = apply(s, deleteGameColumnPlan({ people: ['Ryan'], game: 3, lastGame: 3, get: sheet(s) }));
    expect(after.Ryan).toEqual([180, 200, null]);
  });
  it('game 1 clears its scores but never shifts the others', () => {
    const s = { Ryan: [180, 200, 220], Kim: [150, null, 170] };
    const after = apply(s, deleteGameColumnPlan({ people: ['Ryan', 'Kim'], game: 1, lastGame: 3, get: sheet(s) }));
    expect(after.Ryan).toEqual([null, 200, 220]);
    expect(after.Kim).toEqual([null, null, 170]);
  });
  it('writes nothing it does not need to', () => {
    const s = { Ryan: [180, null, null] };
    expect(deleteGameColumnPlan({ people: ['Ryan'], game: 2, lastGame: 3, get: sheet(s) })).toEqual([]);
  });
  it('refuses nonsense', () => {
    expect(deleteGameColumnPlan({ people: [], game: 2, lastGame: 3 })).toEqual([]);
    expect(deleteGameColumnPlan({ people: ['R'], game: 0, lastGame: 3 })).toEqual([]);
    expect(deleteGameColumnPlan({ people: ['R'], game: 4, lastGame: 3 })).toEqual([]);
    expect(deleteGameColumnPlan()).toEqual([]);
  });
});

describe('columnHasScores', () => {
  it('is true only when someone has a score in that game', () => {
    const s = { Ryan: [180, null], Kim: [null, null] };
    expect(columnHasScores({ people: ['Ryan', 'Kim'], game: 1, get: sheet(s) })).toBe(true);
    expect(columnHasScores({ people: ['Ryan', 'Kim'], game: 2, get: sheet(s) })).toBe(false);
  });
});
