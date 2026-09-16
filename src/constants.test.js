import { describe, it, expect } from 'vitest';
import { strikeDescriptionsForHand, storedStrikeDescriptionFor,
  PRACTICE_SESSION_KEY,
  practiceLeagueCloudName,
  practiceLeagueDisplayName,
  isPracticeLeagueName,
  formatDate,
  formatDateShort,
  casualLeagueCloudName,
  isCasualLeagueName,
  CASUAL_SESSION_KEY,
  isTournamentLeagueName,
  CASUAL_DISPLAY_NAME,
} from './constants.js';


// "Trip 4" and "Kick 10" name the specific pin that carried through or
// got kicked out. A lefty's ball approaches from the opposite side, so
// she is never going to kick a 10 or trip a 4 -- her equivalents are the
// mirror pins (matching the same deck mirror splits.js uses elsewhere).
// The other descriptions aren't tied to a specific pin and stay as-is.
describe('strike descriptions follow the bowler\'s hand', () => {
  it('mirrors only the two pin-specific descriptions', () => {
    const lefty = strikeDescriptionsForHand(true);
    expect(lefty).toContain('Trip 6');
    expect(lefty).toContain('Kick 7');
    expect(lefty).not.toContain('Trip 4');
    expect(lefty).not.toContain('Kick 10');
  });

  it('leaves the hand-neutral descriptions untouched', () => {
    const lefty = strikeDescriptionsForHand(true);
    for (const d of ['Flush', 'High', 'Light', 'Messenger', 'Half Pocket', 'Brooklyn']) {
      expect(lefty).toContain(d);
    }
  });

  it('keeps Messenger in the list for both hands, right after Light', () => {
    const righty = strikeDescriptionsForHand(false);
    expect(righty.indexOf('Light')).toBeLessThan(righty.indexOf('Messenger'));
    expect(righty.indexOf('Messenger')).toBeLessThan(righty.indexOf('Half Pocket'));
  });

  it('stores the canonical value regardless of which label was tapped', () => {
    expect(storedStrikeDescriptionFor('Trip 6')).toBe('Trip 4');
    expect(storedStrikeDescriptionFor('Kick 7')).toBe('Kick 10');
    expect(storedStrikeDescriptionFor('Flush')).toBe('Flush');
  });

  it('round-trips: a lefty\'s own label maps back to the canonical value and back to her label', () => {
    const stored = storedStrikeDescriptionFor('Kick 7');
    expect(strikeDescriptionsForHand(true).find(l => storedStrikeDescriptionFor(l) === stored)).toBe('Kick 7');
  });
});

describe('practice league naming', () => {
  const ME = '3f2504e0-4f89-11d3-9a0c-0305e82c3301';
  const THEM = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';

  // leagues.name is globally unique because real leagues are shared --
  // a team joins "Tuesday House Shot" and everyone means the same one.
  // Practice is personal, so a plain "Practice" row meant the first
  // bowler to practise claimed the name system-wide and everyone else
  // got a 23505.
  it('gives every bowler their own practice league name', () => {
    expect(practiceLeagueCloudName(ME)).not.toBe(practiceLeagueCloudName(THEM));
  });

  it('reads back as plain Practice', () => {
    expect(practiceLeagueDisplayName(practiceLeagueCloudName(ME))).toBe(PRACTICE_SESSION_KEY);
  });

  it('leaves a real league name alone', () => {
    expect(isPracticeLeagueName('Tuesday House Shot')).toBe(false);
    expect(practiceLeagueDisplayName('Tuesday House Shot')).toBe('Tuesday House Shot');
  });
});

describe('display dates', () => {
  const today = new Date(2026, 8, 7);

  it('reads as a day, not an ISO string', () => {
    expect(formatDate('2026-09-01', { today })).toMatch(/Sep/);
    expect(formatDate('2026-09-01', { today })).not.toMatch(/2026-09/);
  });

  // `new Date("2026-09-01")` is UTC midnight, which is the previous
  // evening anywhere west of Greenwich -- every Tuesday-night league
  // bowler in North America would have seen "Mon".
  it('keeps a Tuesday a Tuesday regardless of timezone', () => {
    expect(formatDate('2026-09-01', { today })).toMatch(/^Tue/);
  });

  it('adds the year only when it is not this year', () => {
    expect(formatDate('2026-09-01', { today })).not.toMatch(/2026/);
    expect(formatDate('2025-09-01', { today })).toMatch(/2025/);
  });

  it('passes garbage through rather than throwing', () => {
    expect(formatDate('not-a-date')).toBe('not-a-date');
    expect(formatDate('')).toBe('');
    expect(formatDate(null)).toBe('');
  });

  it('has a short form for tight spots', () => {
    expect(formatDateShort('2026-09-01', today)).not.toMatch(/Tue/);
  });
});

// Casual scores used to be device-local: no league row meant the cloud
// write bailed on `if(!leagueId)return`, so a reinstall lost every
// casual night and every badge earned with it.
describe('casual league container', () => {
  it('is per user, like practice', () => {
    expect(casualLeagueCloudName('a')).not.toBe(casualLeagueCloudName('b'));
  });

  it('is recognised as a casual container', () => {
    expect(isCasualLeagueName(casualLeagueCloudName('a'))).toBe(true);
  });

  it('reads back as its display name', () => {
    // The DISPLAY name, which is deliberately not the storage key: the
    // key stays "Just Bowling" so existing sessions still resolve, while
    // the bowler sees "Open bowling" like everywhere else in the app.
    expect(practiceLeagueDisplayName(casualLeagueCloudName('a'))).toBe(CASUAL_DISPLAY_NAME);
    expect(CASUAL_SESSION_KEY).toBe('Just Bowling');
  });

  // The two containers must not be confused for each other -- a casual
  // night filed under practice would land in real stats.
  it('is not mistaken for a practice league', () => {
    expect(isPracticeLeagueName(casualLeagueCloudName('a'))).toBe(false);
    expect(isCasualLeagueName(practiceLeagueCloudName('a'))).toBe(false);
  });

  it('leaves a real league alone', () => {
    expect(isCasualLeagueName('Tuesday House Shot')).toBe(false);
    expect(practiceLeagueDisplayName('Tuesday House Shot')).toBe('Tuesday House Shot');
  });
});

describe('reserved league names, bare and per-user', () => {
  // These only matched the "Key·<id>" form, so a session stored under the
  // plain key slipped past every caller -- and the callers decide what
  // counts as real bowling. A 300 shot in open bowling showed as a season
  // high game because its league was the bare key.
  //
  // Three separate bugs came from this one gap, each patched at its own
  // call site before the cause was found.
  it('recognises the bare key as well as the per-user form', () => {
    expect(isPracticeLeagueName('Practice')).toBe(true);
    expect(isPracticeLeagueName(practiceLeagueCloudName('a'))).toBe(true);

    expect(isCasualLeagueName('Just Bowling')).toBe(true);
    expect(isCasualLeagueName(casualLeagueCloudName('a'))).toBe(true);

    expect(isTournamentLeagueName('Tournament')).toBe(true);
  });

  it('does not claim an ordinary league', () => {
    for (const name of ['Tuesday Night', 'Practice Makes Perfect', 'Just Bowling Club']) {
      expect(isPracticeLeagueName(name)).toBe(false);
      expect(isCasualLeagueName(name)).toBe(false);
      expect(isTournamentLeagueName(name)).toBe(false);
    }
  });

  it('survives junk', () => {
    for (const j of [null, undefined, 42, {}, []]) {
      expect(isPracticeLeagueName(j)).toBe(false);
      expect(isCasualLeagueName(j)).toBe(false);
      expect(isTournamentLeagueName(j)).toBe(false);
    }
  });
});
