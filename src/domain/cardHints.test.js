import { describe, it, expect } from 'vitest';
import { CARD_HINTS, cardHint } from './cardHints.js';
import { MOVABLE_STATS_CARDS } from './preferences.js';

describe('what a card needs before it shows anything', () => {
  // An absent card is indistinguishable from one that does not exist. A
  // card with no hint would render no placeholder, so a gap here is a
  // card the bowler can never find out about.
  it('covers every card', () => {
    const missing = MOVABLE_STATS_CARDS.map(c => c.id).filter(id => !cardHint(id));
    expect(missing).toEqual([]);
  });

  // A hint for a card that no longer exists is dead text that will drift.
  it('has no hint for a card that does not exist', () => {
    const ids = MOVABLE_STATS_CARDS.map(c => c.id);
    expect(Object.keys(CARD_HINTS).filter(k => !ids.includes(k))).toEqual([]);
  });

  // The hint is the ACTION, not the condition: the bowler has to do
  // something, and "needs three sessions" does not say what.
  it('tells the bowler what to do', () => {
    for (const [id, hint] of Object.entries(CARD_HINTS)) {
      expect(hint.length, id).toBeGreaterThan(20);
      // Two sentences: what it is, then what fills it.
      expect(hint.split('.').filter(Boolean).length, id).toBeGreaterThanOrEqual(2);
    }
  });

  it('returns null for anything unknown', () => {
    expect(cardHint('notACard')).toBe(null);
    expect(cardHint('')).toBe(null);
    expect(cardHint(null)).toBe(null);
  });
});
