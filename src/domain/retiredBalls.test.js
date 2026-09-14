import { describe, it, expect } from 'vitest';
import {
  isRetired, retiredOn, activeBalls, retiredBallNames, retireBall, unretireBall,
  retiredBallSummary, describeRetirement,
} from './retiredBalls.js';

// An arsenal is an array of ball NAMES; retirement lives beside it.
const ARSENAL = ['Phaze II', 'Zen', 'Hy-Road', 'Idol'];
const RETIRED = { Zen: '2026-03-01', Idol: '2026-08-15' };

describe('retiring instead of deleting', () => {
  // Deleting a ball with two thousand shots behind it throws away the
  // answer to "was it actually better on this pattern".
  it('keeps a retired ball out of the active arsenal', () => {
    expect(activeBalls(ARSENAL, RETIRED)).toEqual(['Phaze II', 'Hy-Road']);
  });

  // The ball sold last month is the one they still remember.
  it('lists retired balls most recent first', () => {
    expect(retiredBallNames(ARSENAL, RETIRED)).toEqual(['Idol', 'Zen']);
  });

  it('retires a ball as of a date', () => {
    const after = retireBall(RETIRED, 'Phaze II', '2026-09-14');
    expect(isRetired(after, 'Phaze II')).toBe(true);
    expect(retiredOn(after, 'Phaze II')).toBe('2026-09-14');
  });

  // Re-tapping should not quietly rewrite when it happened.
  it('keeps the original date when retired again', () => {
    const once = retireBall(RETIRED, 'Phaze II', '2026-09-14');
    expect(retiredOn(retireBall(once, 'Phaze II', '2026-12-01'), 'Phaze II'))
      .toBe('2026-09-14');
  });

  // Bowlers rebuy a ball they regret selling.
  it('brings a ball back', () => {
    expect(activeBalls(ARSENAL, unretireBall(RETIRED, 'Zen'))).toContain('Zen');
  });

  it('leaves other balls alone', () => {
    const after = retireBall(RETIRED, 'Phaze II', '2026-09-14');
    expect(isRetired(after, 'Hy-Road')).toBe(false);
  });

  it('does not mutate the map it is given', () => {
    const before = { ...RETIRED };
    retireBall(RETIRED, 'Phaze II', '2026-09-14');
    unretireBall(RETIRED, 'Zen');
    expect(RETIRED).toEqual(before);
  });
});

describe('what a retired ball still says', () => {
  const shots = n => [...Array(n)].map((_, i) => ({ ball: 'Zen', result: i % 3 ? 'Strike' : 'Weak 10' }));

  it('keeps its shots and strike rate', () => {
    const s = retiredBallSummary('Zen', RETIRED, shots(60));
    expect(s.shots).toBe(60);
    expect(s.strikeRate).toBeGreaterThan(0);
    expect(s.comparable).toBe(true);
  });

  // Showing six shots and four hundred identically invites reading noise
  // as signal.
  it('flags a sample too thin to compare', () => {
    const s = retiredBallSummary('Zen', RETIRED, shots(6));
    expect(s.comparable).toBe(false);
    expect(describeRetirement(s)).toContain('too few to compare');
  });

  // "0% of nothing" is not a rate.
  it('gives null rather than zero with nothing thrown', () => {
    expect(retiredBallSummary('Zen', RETIRED, []).strikeRate).toBe(null);
  });

  it('says so when nothing was ever logged', () => {
    expect(describeRetirement(retiredBallSummary('Zen', RETIRED, [])))
      .toContain('nothing logged');
  });

  it('survives junk', () => {
    for (const j of [null, undefined, 'x', 42, {}, [null]]) {
      expect(() => activeBalls(j, j)).not.toThrow();
      expect(() => retiredBallNames(j, j)).not.toThrow();
      expect(() => retireBall(j, j, j)).not.toThrow();
      expect(() => unretireBall(j, j)).not.toThrow();
      expect(() => retiredBallSummary(j, j, j)).not.toThrow();
      expect(() => describeRetirement(j)).not.toThrow();
      expect(() => isRetired(j, j)).not.toThrow();
    }
    expect(activeBalls(null, null)).toEqual([]);
    expect(retiredBallSummary(null, null, null)).toBe(null);
  });
});
