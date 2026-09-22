import { describe, it, expect } from 'vitest';
import { laneDigits } from './laneInput.js';

describe('laneDigits', () => {
  it('keeps a normal lane number', () => {
    expect(laneDigits('8')).toBe('8');
    expect(laneDigits('24')).toBe('24');
  });
  it('drops a minus sign rather than keeping a negative lane', () => {
    expect(laneDigits('-8')).toBe('8');
    expect(laneDigits('-')).toBe('');
  });
  it('drops decimals, exponents and anything that is not a digit', () => {
    expect(laneDigits('1.5')).toBe('15');
    expect(laneDigits('1e3')).toBe('13');
    expect(laneDigits(' 12 ')).toBe('12');
  });
  it('has no lane zero', () => {
    expect(laneDigits('0')).toBe('');
    expect(laneDigits('007')).toBe('7');
  });
  it('caps at three digits', () => {
    expect(laneDigits('12345')).toBe('123');
  });
  it('treats nothing as not set', () => {
    expect(laneDigits('')).toBe('');
    expect(laneDigits(null)).toBe('');
    expect(laneDigits(undefined)).toBe('');
  });
});
