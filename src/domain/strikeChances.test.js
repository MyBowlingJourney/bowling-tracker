import { describe, it, expect } from 'vitest';
import { strikeChances, strikeRateOf } from './scoring.js';

const f = (frame, result, extra = {}) => ({ bowler: 'R', league: 'L', date: '2026-09-22', game: '1', frame: String(frame), result, ...extra });

describe('strikeChances', () => {
  it('counts one chance per frame 1-9 and the 10th full racks only', () => {
    const game = [
      ...Array.from({ length: 9 }, (_, i) => f(i + 1, i % 2 ? 'Strike' : '7')),
      f(10, 'Strike', { ballNum: 1 }), f(10, '7', { ballNum: 2, pinCount: '7' }), f(10, 'Spare', { ballNum: 3 }),
    ];
    // 9 frames + 10th ball 1 + ball 2 (after a strike); ball 3 is a spare attempt.
    expect(strikeChances(game)).toHaveLength(11);
    expect(strikeRateOf(game)).toBe(Math.round((5 / 11) * 100));
  });
  it('counts a strike on the fill ball after a spare', () => {
    const game = [f(10, '9', { ballNum: 1, spareMade: 'Yes', pinCount: '9' }), f(10, 'Strike', { ballNum: 3 })];
    expect(strikeChances(game)).toHaveLength(2);
    expect(strikeRateOf(game)).toBe(50);
  });
  it('keeps games apart', () => {
    const a = [f(10, 'Strike', { ballNum: 1 }), f(10, 'Strike', { ballNum: 2 })];
    const b = [f(10, '8', { ballNum: 1, game: '2' }), f(10, '1', { ballNum: 2, game: '2' })];
    expect(strikeChances([...a, ...b])).toHaveLength(3);
    expect(strikeRateOf([])).toBeNull();
  });
});
