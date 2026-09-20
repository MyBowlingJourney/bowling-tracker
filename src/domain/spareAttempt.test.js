import { describe, it, expect } from 'vitest';
import {
  standingAfterFirst, needsPinPicker, toggleKnocked, secondLeaveFrom,
  pinCountFrom, isAccidentalSpare, knockedFromSecondLeave,
} from './spareAttempt.js';
import { framePinDecks, ALL_PINS } from './pinRack.js';

// The picker exists to record WHICH pins the spare ball took, replacing a
// stepper that only ever knew how many. These tests pin three things:
// the arithmetic the bowler no longer has to do, the distinction between
// "nothing fell" and "we never asked", and the fact that an old shot
// keeps meaning exactly what it meant before the field existed.

const open = (leave, extra = {}) => ({
  result: 'Other Leave', otherLeave: leave, spareMade: 'No', ...extra,
});

describe('when the picker appears', () => {
  it('shows for a leave of two or more', () => {
    expect(needsPinPicker(open([4, 7]))).toBe(true);
  });

  // The reason Weak 10 and Ringing 10 never reach it: they ARE single-pin
  // leaves, and "Spare made?" has already asked the only question a
  // single pin has.
  it('stays away from a single pin', () => {
    expect(needsPinPicker(open([10]))).toBe(false);
  });

  it('stays away from Weak 10 and Ringing 10', () => {
    for (const result of ['Weak 10', 'Ringing 10']) {
      expect(needsPinPicker({ result, otherLeave: [], spareMade: 'No' })).toBe(false);
    }
  });

  it('stays away until the spare question is answered', () => {
    expect(needsPinPicker(open([4, 7], { spareMade: '' }))).toBe(false);
    expect(needsPinPicker(open([4, 7], { spareMade: 'Yes' }))).toBe(false);
  });

  it('is safe on nothing at all', () => {
    expect(needsPinPicker(null)).toBe(false);
    expect(needsPinPicker({})).toBe(false);
  });
});

describe('tapping pins', () => {
  it('toggles on and off', () => {
    expect(toggleKnocked([], 4)).toEqual([4]);
    expect(toggleKnocked([4, 7], 4)).toEqual([7]);
  });

  it('keeps the order stable so nothing depends on tap sequence', () => {
    expect(toggleKnocked([7], 4)).toEqual([4, 7]);
  });

  // The rack speaks strings ("7"); the domain speaks numbers. A mismatch
  // here silently matches nothing and every tap looks dead.
  it('accepts pins as strings', () => {
    expect(toggleKnocked(['7'], '4')).toEqual([4, 7]);
  });
});

describe('what gets stored', () => {
  it('records the pins still standing, not the ones that fell', () => {
    expect(secondLeaveFrom([4, 7], [4])).toEqual([7]);
  });

  it('a whiff leaves everything standing', () => {
    expect(secondLeaveFrom([4, 7], [])).toEqual([4, 7]);
  });

  it('ignores a pin that was never standing to begin with', () => {
    // Defensive: a stale tap from a leave the bowler has since changed
    // must not invent a knocked-down pin.
    expect(secondLeaveFrom([4, 7], [4, 10])).toEqual([7]);
  });
});

describe('the arithmetic the bowler no longer does', () => {
  it('adds both balls into the frame total', () => {
    // Eight down, then the 4. pinCount has always meant the frame total.
    expect(pinCountFrom([4, 7], [4])).toBe(9);
  });

  it('counts a whiff as the first ball alone', () => {
    expect(pinCountFrom([4, 7], [])).toBe(8);
  });

  it('handles a three-pin leave', () => {
    expect(pinCountFrom([3, 6, 10], [3, 6])).toBe(9);
  });

  it('never counts a pin that was already down', () => {
    expect(pinCountFrom([4, 7], [4, 10])).toBe(9);
  });
});

describe('taking every pin is a spare, and says so', () => {
  // The stepper made this unreachable by capping one below the total.
  // A picker cannot hide a pin without looking broken, so the
  // contradiction is allowed and then named.
  it('flags a full clear', () => {
    expect(isAccidentalSpare([4, 7], [4, 7])).toBe(true);
  });

  it('does not flag a partial one', () => {
    expect(isAccidentalSpare([4, 7], [4])).toBe(false);
  });

  it('does not flag an empty leave', () => {
    expect(isAccidentalSpare([], [])).toBe(false);
  });
});

describe('reopening a saved shot', () => {
  it('lights the pins that fell', () => {
    expect(knockedFromSecondLeave([4, 7], [7])).toEqual([4]);
  });

  // The distinction the whole nullable column exists for.
  it('tells a whiff apart from never having asked', () => {
    expect(knockedFromSecondLeave([4, 7], [4, 7])).toEqual([]);   // asked, nothing fell
    expect(knockedFromSecondLeave([4, 7], undefined)).toBeNull(); // never asked
  });
});

// ── The payoff ──────────────────────────────────────────────────────────
describe('the scoresheet can finally draw an open frame', () => {
  const state = (deck, pin) => deck.states[pin];

  it('attributes the second ball exactly', () => {
    const [deck] = framePinDecks(open([4, 7], { pinCount: '9', secondLeave: [7] }), false);
    expect(deck.exact).toBe(true);
    expect(state(deck, 4)).toBe('down2');
    expect(state(deck, 7)).toBe('standing');
  });

  it('draws a whiff as a whiff rather than as unknown', () => {
    const [deck] = framePinDecks(open([4, 7], { pinCount: '8', secondLeave: [4, 7] }), false);
    expect(deck.exact).toBe(true);
    expect(ALL_PINS.some(p => state(deck, p) === 'down2')).toBe(false);
  });

  // Every shot logged before the column existed.
  it('leaves an older shot exactly as it was', () => {
    const [deck] = framePinDecks(open([4, 7], { pinCount: '9' }), false);
    expect(deck.exact).toBe(false);
    expect(state(deck, 4)).toBe('standing');
    expect(state(deck, 7)).toBe('standing');
  });
});

describe('standingAfterFirst', () => {
  it('reads the leave as pin numbers', () => {
    expect(standingAfterFirst({ otherLeave: ['4', '7'] })).toEqual([4, 7]);
  });

  it('drops the no-tap sentinel rather than treating it as a pin', () => {
    expect(standingAfterFirst({ otherLeave: ['9 Pin No-Tap'] })).toEqual([]);
  });

  it('is safe on a shot with no leave', () => {
    expect(standingAfterFirst({})).toEqual([]);
    expect(standingAfterFirst(null)).toEqual([]);
  });
});
