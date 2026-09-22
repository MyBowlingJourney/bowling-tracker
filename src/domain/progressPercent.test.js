import { describe, it, expect } from 'vitest';
import { progressPercent } from './progressPercent.js';

describe('progressPercent', () => {
  it('never shows 100% before the milestone is reached', () => {
    expect(progressPercent(299 / 300)).toBe(99);
    expect(progressPercent(0.9999)).toBe(99);
  });
  it('shows 100% once it is reached', () => {
    expect(progressPercent(1)).toBe(100);
    expect(progressPercent(1.2)).toBe(100);
  });
  it('rounds down, without losing a point to floating-point noise', () => {
    expect(progressPercent(0.29)).toBe(29);
    expect(progressPercent(0.567)).toBe(56);
  });
  it('treats nonsense as nothing done', () => {
    expect(progressPercent(null)).toBe(0);
    expect(progressPercent(-0.2)).toBe(0);
    expect(progressPercent('x')).toBe(0);
  });
});
