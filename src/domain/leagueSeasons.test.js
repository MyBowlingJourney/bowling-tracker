import { describe, it, expect } from 'vitest';
import {
  LEAGUE_FORMAT_IDS, isNoTapLeague, leagueFormat, leagueFormatLabel,
  strikePinThreshold, normalizeLeagueDates, hasLeagueEnded, endedLeagues,
} from './leagueSeasons.js';

describe('league format', () => {
  // This decides whether a nine-count scores as a strike, which changes
  // every score in the league. It had no test file at all.
  it('knows the two formats', () => {
    expect(LEAGUE_FORMAT_IDS).toEqual(['tenpin', 'notap9']);
  });

  it('drops the strike threshold to nine for no-tap', () => {
    expect(strikePinThreshold('notap9')).toBe(9);
    expect(isNoTapLeague('notap9')).toBe(true);
  });

  it('keeps ten for a normal league', () => {
    expect(strikePinThreshold('tenpin')).toBe(10);
    expect(isNoTapLeague('tenpin')).toBe(false);
  });

  // Anything unrecognised must fall back to real bowling: scoring a
  // nine-count as a strike by accident inflates every game.
  it('falls back to ten pin on anything unknown', () => {
    for (const junk of [null, undefined, '', 'nonsense', 9, {}, []]) {
      expect(leagueFormat(junk)).toBe('tenpin');
      expect(isNoTapLeague(junk)).toBe(false);
      expect(strikePinThreshold(junk)).toBe(10);
    }
  });

  it('labels both formats readably', () => {
    expect(leagueFormatLabel('notap9')).toBe('9 pin no-tap');
    expect(leagueFormatLabel('tenpin')).toBe('10 pin');
  });
});

describe('league dates', () => {
  it('keeps a valid pair', () => {
    const d = normalizeLeagueDates({ startDate: '2026-09-01', endDate: '2027-04-01' });
    expect(d.startDate).toBe('2026-09-01');
    expect(d.endDate).toBe('2027-04-01');
  });

  it('survives junk', () => {
    for (const junk of [null, undefined, 'x', 42, {}]) {
      expect(() => normalizeLeagueDates(junk)).not.toThrow();
    }
  });

  // A league with no end date has not ended -- it is still running, not
  // finished on the first day something asks.
  it('does not end a league with no end date', () => {
    expect(hasLeagueEnded({ startDate: '2026-09-01', endDate: '' }, '2027-01-01')).toBeFalsy();
  });

  it('survives junk when listing ended leagues', () => {
    for (const junk of [null, undefined, 'x', 42]) {
      expect(() => endedLeagues(junk, junk)).not.toThrow();
    }
  });
});
