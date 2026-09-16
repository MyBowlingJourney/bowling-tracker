import { describe, it, expect } from 'vitest';
import {
  allowsOtherBowlers, otherBowlerSource, guestsAreLocalOnly,
  scorekeepingOptions, addGuest, normalizeGuests, boardMiss } from './scorekeeping.js';

describe('who you can keep score for', () => {
  const teams = [
    { id: 't1', name: 'Gutter Kings', league: 'Thursday', members: ['Ryan', 'Aaron', 'Sub Slot'] },
    { id: 't2', name: 'Other', league: 'Tuesday', members: ['Lee'] },
  ];

  it('never offers anyone else in a tournament', () => {
    // You bowl your own squad and record your own results. Offering the
    // option only creates a way to file your scores under another name.
    expect(allowsOtherBowlers('tournament')).toBe(false);
    expect(scorekeepingOptions({ environment: 'tournament', owner: 'Ryan', teams, guests: ['X'] }))
      .toEqual(['Ryan']);
  });

  it('offers league teammates and roster placeholders', () => {
    expect(scorekeepingOptions({ environment: 'league', owner: 'Ryan', league: 'Thursday', teams }))
      .toEqual(['Ryan', 'Aaron', 'Sub Slot']);
  });

  it('scopes league options to the league being bowled', () => {
    expect(scorekeepingOptions({ environment: 'league', owner: 'Ryan', league: 'Tuesday', teams }))
      .toEqual(['Ryan', 'Lee']);
  });

  it('lists the owner once even when they are on the roster', () => {
    const out = scorekeepingOptions({ environment: 'league', owner: 'Ryan', league: 'Thursday', teams });
    expect(out.filter(n => n === 'Ryan')).toHaveLength(1);
  });

  it('uses free-text guests in practice, ignoring the roster', () => {
    expect(scorekeepingOptions({ environment: 'practice', owner: 'Ryan', teams, guests: ['Dave'] }))
      .toEqual(['Ryan', 'Dave']);
  });
});

describe('guest privacy', () => {
  it('marks practice and casual guests as local-only', () => {
    // These are names typed about people who aren't users of this app and
    // haven't agreed to anything, so they never leave the device.
    expect(guestsAreLocalOnly('practice')).toBe(true);
    expect(guestsAreLocalOnly('casual')).toBe(true);
  });

  it('does not treat league teammates as local-only', () => {
    // Those are real roster members with their own accounts.
    expect(guestsAreLocalOnly('league')).toBe(false);
    expect(otherBowlerSource('league')).toBe('roster');
  });
});

describe('guest list', () => {
  it('dedupes case-insensitively so one person is not two', () => {
    expect(addGuest(['Dave'], 'dave')).toEqual(['Dave']);
  });

  it('discards non-string entries', () => {
    expect(normalizeGuests(['Dave', null, 42, '  ', 'Mike'])).toEqual(['Dave', 'Mike']);
  });
});

describe('which way a shot missed, in boards', () => {
  // Boards run 1 upward from the bowler's OWN gutter, so the same
  // arithmetic means opposite directions for the two hands. The app
  // called a higher number "right" for everyone, which is backwards for
  // every right-handed bowler.
  it('reads a higher board as left for a right-hander', () => {
    expect(boardMiss(8, 10, false)).toEqual({ boards: 2, direction: 'left' });
  });

  it('reads a lower board as right for a right-hander', () => {
    expect(boardMiss(8, 6, false)).toEqual({ boards: 2, direction: 'right' });
  });

  it('mirrors both for a left-hander', () => {
    expect(boardMiss(8, 10, true)).toEqual({ boards: 2, direction: 'right' });
    expect(boardMiss(8, 6, true)).toEqual({ boards: 2, direction: 'left' });
  });

  it('calls an exact hit on target, either hand', () => {
    for (const hand of [true, false]) {
      expect(boardMiss(8, 8, hand)).toEqual({ boards: 0, direction: 'on target' });
    }
  });

  it('handles strings, since form fields are text', () => {
    expect(boardMiss('8', '10', false)).toEqual({ boards: 2, direction: 'left' });
  });

  // A half-filled form should say nothing rather than guess.
  it('says nothing without both boards', () => {
    for (const [t, a] of [['', 10], [8, ''], [null, 10], [8, undefined], ['x', 10]]) {
      expect(boardMiss(t, a, false)).toBe(null);
    }
  });

  it('reports the distance, not the sign', () => {
    expect(boardMiss(20, 5, false).boards).toBe(15);
    expect(boardMiss(5, 20, false).boards).toBe(15);
  });
});
