import { describe, it, expect } from 'vitest';
import { badgesEarnedOn } from './nightBadges.js';

const defs = [
  { id: 'turkey', emoji: 'T', name: 'Turkey' },
  { id: 'first', emoji: 'F', name: 'First night' },
  { id: 'clean', emoji: 'C', name: 'Clean game' },
];

describe('badgesEarnedOn', () => {
  it('returns the badges earned that night, in definition order', () => {
    const h = {
      clean: { count: 1, dates: ['2026-09-18'] },
      turkey: { count: 3, dates: ['2026-09-04', '2026-09-18', '2026-09-25'] },
      first: { count: 1, dates: ['2026-01-06'] },
    };
    expect(badgesEarnedOn(h, defs, '2026-09-18').map(b => b.name)).toEqual(['Turkey', 'Clean game']);
  });
  it('keeps a repeat earned that night even when it was earned again later', () => {
    const h = { turkey: { count: 2, lastDate: '2026-09-25', dates: ['2026-09-18', '2026-09-25'] } };
    expect(badgesEarnedOn(h, defs, '2026-09-18')).toHaveLength(1);
  });
  it('is empty for a night that earned nothing', () => {
    expect(badgesEarnedOn({ turkey: { count: 1, dates: ['2026-09-04'] } }, defs, '2026-09-18')).toEqual([]);
  });
  it('ignores badges not earned at all', () => {
    expect(badgesEarnedOn({ turkey: { count: 0, dates: [] } }, defs, '2026-09-18')).toEqual([]);
  });
  it('falls back to lastDate for an older history without dates', () => {
    expect(badgesEarnedOn({ first: { count: 1, lastDate: '2026-09-18' } }, defs, '2026-09-18')[0].name).toBe('First night');
  });
  it('survives nothing', () => {
    expect(badgesEarnedOn(null, defs, '2026-09-18')).toEqual([]);
    expect(badgesEarnedOn({}, null, '2026-09-18')).toEqual([]);
    expect(badgesEarnedOn({ turkey: { count: 1, dates: ['x'] } }, defs, '')).toEqual([]);
  });
});
