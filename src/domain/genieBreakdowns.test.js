import { describe, it, expect } from 'vitest';
import { genieBreakdowns, bucketStats, laneSide, frameStage } from './genieBreakdowns.js';

// n first balls on one ball/lane/game, `strikes` of them strikes; every
// non-strike is a spare attempt made when `made` says so.
function shots(n, strikes, extra = {}, made = true) {
  return Array.from({ length: n }, (_, i) => ({
    ballNum: 1, result: i < strikes ? 'Strike' : '7', spareMade: i < strikes ? '' : (made ? 'Yes' : 'No'),
    game: 1, frame: (i % 10) + 1, lane: 7, ball: 'Phaze', league: 'Tuesday', date: '2026-09-01', ...extra,
  }));
}

describe('bucketStats', () => {
  it('uses first balls for strike %, like the Stats screens', () => {
    const st = bucketStats([...shots(10, 6), { ballNum: 2, result: '7', spareMade: '' }]);
    expect(st.n).toBe(10);
    expect(st.strike).toBe(60);
    expect(st.spare).toBe(100);
  });
  it('leaves out a slice too thin to mean anything', () => {
    expect(bucketStats(shots(5, 5))).toBe(null);
  });
  it('does not count splits as spare attempts, and reports them', () => {
    const isSplit = s => s.split === true;
    const list = [...shots(8, 4), ...shots(2, 0, { split: true }, false)];
    const st = bucketStats(list, { isSplit });
    expect(st.spare).toBe(100);
    expect(st.split).toBe(20);
  });
});

describe('lane side and part of the game', () => {
  it('odd lanes are the left of the pair', () => {
    expect(laneSide(7)).toBe('left lane');
    expect(laneSide('8')).toBe('right lane');
    expect(laneSide('')).toBe(null);
    expect(laneSide(-3)).toBe(null);
  });
  it('splits a game into early, middle and late', () => {
    expect(frameStage(2)).toBe('frames 1-3');
    expect(frameStage(6)).toBe('frames 4-7');
    expect(frameStage(10)).toBe('frames 8-10');
  });
});

describe('genieBreakdowns', () => {
  const data = [
    ...shots(20, 12, { ball: 'Phaze', game: 1, lane: 7 }),
    ...shots(20, 6, { ball: 'Hy-Road', game: 3, lane: 8 }),
  ];
  it('slices by ball, game and lane of the pair', () => {
    const text = genieBreakdowns(data).join('\n');
    expect(text).toContain('By ball: ');
    expect(text).toContain('Phaze 20fb X60%');
    expect(text).toContain('Hy-Road 20fb X30%');
    expect(text).toContain('By game of the night: game 1 20fb X60%');
    expect(text).toContain('left lane 20fb X60%');
  });
  it('answers combinations like game and lane of the pair', () => {
    expect(genieBreakdowns(data).join('\n')).toContain('game 3 right lane 20fb X30%');
  });
  it('uses the oil pattern it is given for each night', () => {
    const text = genieBreakdowns(data, { patternFor: (lg, d) => 'Shark' }).join('\n');
    expect(text).not.toContain('By oil pattern');   // one pattern is not a comparison
    const two = genieBreakdowns([
      ...shots(10, 8, { date: 'a' }), ...shots(10, 2, { date: 'b' }),
    ], { patternFor: (lg, d) => (d === 'a' ? 'Shark' : 'Badger') }).join('\n');
    expect(two).toContain('By oil pattern: Shark 10fb X80%');
  });
  it('explains its key once, at the top', () => {
    expect(genieBreakdowns(data)[0]).toMatch(/^Breakdowns of logged shots/);
  });
  it('stays within its size budget however much is logged', () => {
    const big = [];
    for (let g = 1; g <= 3; g++) for (let l = 1; l <= 40; l++)
      big.push(...shots(12, 5, { game: g, lane: l, ball: `Ball ${l % 9}`, ballSpeed: 14 + (l % 5), revRate: 250 + l * 5 }));
    const lines = genieBreakdowns(big, { maxChars: 2000 });
    expect(lines.join('\n').length).toBeLessThanOrEqual(2000 + lines.length);
    expect(lines.length).toBeGreaterThan(2);
  });
  it('returns nothing for nothing', () => {
    expect(genieBreakdowns([])).toEqual([]);
    expect(genieBreakdowns(null)).toEqual([]);
  });
});
