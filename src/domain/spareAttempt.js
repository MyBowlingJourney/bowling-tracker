// Recording WHICH pins the spare ball took, not just how many.
//
// ── What this replaces ──────────────────────────────────────────────────
//
// A minus/plus stepper that asked for the frame TOTAL. The bowler had to
// add their first ball to their second and enter the sum -- arithmetic
// nobody should do standing at a ball return, and arithmetic the app
// already knows how to do.
//
// Worse, the total is lossy. "Eight, then one" says a pin fell; it never
// says which one. So the scoresheet could not draw an open frame's second
// ball, and the rack reported `exact: false` and left every standing pin
// hollow. That was the one place the card knowingly said less than it
// looked like it was saying.
//
// Tapping the pin is the same gesture that already records the leave, and
// it records the thing that was missing.
//
// ── What gets stored ────────────────────────────────────────────────────
//
// `secondLeave`: the pins STILL STANDING after the second ball -- the
// same shape and meaning as `otherLeave`, one ball later. Not the pins
// knocked down, because "what is still up" is what every other part of
// this app already speaks, and a second convention would be a bug
// waiting to happen.
//
// `pinCount` keeps being written exactly as before, derived rather than
// typed. Nothing downstream changes, and a shot with no `secondLeave`
// still means today what it means today.
//
// ── Weak 10 and Ringing 10 never come here ──────────────────────────────
//
// They are single-pin leaves, and a single pin has only two outcomes --
// it fell or it did not, which is what "Spare made?" already asks. They
// skipped the stepper for the same reason and they skip the picker too.

// Pin numbers only, same sentinel handling as the rack.
function pins(list) {
  return (Array.isArray(list) ? list : [])
    .filter(p => p !== "9 Pin No-Tap")
    .map(Number)
    .filter(n => Number.isInteger(n) && n >= 1 && n <= 10);
}

/** The pins the spare ball is being thrown at. */
export function standingAfterFirst(shot) {
  return pins(shot?.otherLeave);
}

/**
 * Whether the picker should be shown at all.
 *
 * Deliberately the same shape as the condition the stepper used, so this
 * is a swap of one control for another rather than a change to when the
 * app asks. A single pin is excluded: "Spare made?" has already asked it.
 */
export function needsPinPicker(shot) {
  if (!shot || shot.spareMade !== "No") return false;
  const standing = standingAfterFirst(shot);
  return standing.length > 1;
}

/** Tap on, tap off. Order never matters, so the result stays sorted. */
export function toggleKnocked(knocked, pin) {
  const n = Number(pin);
  const cur = pins(knocked);
  const next = cur.includes(n) ? cur.filter(p => p !== n) : [...cur, n];
  return next.sort((a, b) => a - b);
}

/**
 * What to store: the pins still standing once the second ball is done.
 *
 * Anything the bowler did not tap is still up. Pins that were already
 * down before this ball are not part of it -- they were never standing
 * to begin with.
 */
export function secondLeaveFrom(firstLeave, knocked) {
  const standing = pins(firstLeave);
  const down = new Set(pins(knocked));
  return standing.filter(p => !down.has(p));
}

/**
 * The frame total, the way `pinCount` has always meant it: both balls
 * added together.
 *
 * Derived here so the bowler never types it and the two numbers can
 * never disagree.
 */
export function pinCountFrom(firstLeave, knocked) {
  const standing = pins(firstLeave);
  const downSecond = pins(knocked).filter(p => standing.includes(p));
  return (10 - standing.length) + downSecond.length;
}

/**
 * Taking every standing pin down IS a spare.
 *
 * The old stepper made this unreachable by capping its maximum one below
 * the total, which quietly prevented a contradiction the bowler could
 * not see. A picker cannot hide a pin that way without looking broken,
 * so the contradiction is allowed to happen and then named: the save is
 * blocked with a reason, the same way a missing "Spare made?" already
 * blocks it.
 */
export function isAccidentalSpare(firstLeave, knocked) {
  const standing = pins(firstLeave);
  if (!standing.length) return false;
  return secondLeaveFrom(standing, knocked).length === 0;
}

/**
 * Re-open a saved shot for editing: which pins were tapped last time.
 *
 * Returns null when the shot predates this field, so the UI can tell
 * "nothing was knocked down" (an empty array) apart from "we never
 * asked" (null) -- and not silently claim the bowler whiffed.
 */
export function knockedFromSecondLeave(firstLeave, secondLeave) {
  if (!Array.isArray(secondLeave)) return null;
  const standing = pins(firstLeave);
  const stillUp = new Set(pins(secondLeave));
  return standing.filter(p => !stillUp.has(p));
}
