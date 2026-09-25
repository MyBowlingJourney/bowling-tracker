// Turning a frame's shots into the pin racks the scoresheet draws.
//
// ── What the stored data can and cannot say ─────────────────────────────
//
// `otherLeave` is the pins left STANDING after a delivery, by number. For
// frames 1-9 one shot record covers the whole frame, and that leave
// belongs to the FIRST ball only. The second ball is stored as a count
// (`pinCount` minus the first ball) and as `spareMade`.
//
// So for an open frame the data knows that two pins stood and that one of
// them fell -- but NOT which one. Showing a guess would be inventing a
// fact about someone's game, so a deck whose second ball isn't exactly
// known reports `exact: false` and leaves those pins standing. The marks
// beside the rack still say how many fell.
//
// Two cases ARE exact, and they cover most of what matters:
//
//   A spare clears everything, so every standing pin went down on ball 2.
//
//   The tenth stores each ball as its own record with its own leave, so
//   every ball there is exactly attributable.
//
// ── Decks, not balls ────────────────────────────────────────────────────
//
// A rack is drawn per DECK, not per ball: a new one only when the pins
// actually reset. Inside a single deck, down-on-first / down-on-second /
// standing already says which ball did what, so `X 8 /` is two racks (the
// strike, then the eight and the spare together) rather than three.
//
// Only the tenth can hold more than one deck, and only a turkey holds
// three.

import { isStk } from "./scoring.js";
import { isSplit, pinForHand } from "./splits.js";

// The rack as it is seen from the approach: the four back pins first,
// the headpin last. Matches how a bowler reads a leave and how
// `otherLeave` numbers them.
export const PIN_ROWS = Object.freeze([
  Object.freeze([7, 8, 9, 10]),
  Object.freeze([4, 5, 6]),
  Object.freeze([2, 3]),
  Object.freeze([1]),
]);

export const ALL_PINS = Object.freeze([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

// Pin numbers only. "9 Pin No-Tap" rides along in otherLeave as a
// sentinel meaning "scored as a strike"; it is not a pin and must not
// become one.
//
// ── The corner pin is named, not numbered ───────────────────────────────
//
// "Weak 10" and "Ringing 10" store an EMPTY otherLeave. The pin left
// standing is carried by the result name instead, because what those
// results record is how the ball drove through the rack, not which pin
// survived -- the pin is the same one every time.
//
// Reading only otherLeave therefore said "nothing standing", and the
// rack drew all ten pins down: a corner-pin leave rendered identically
// to a strike. The score stayed right, because firstBallOf() has always
// known to return 9 for these, which is exactly why it went unnoticed --
// every number on the card agreed while the picture disagreed.
//
// The stored value is canonical: "Weak 10" means the corner pin for
// BOTH hands, and a lefty's corner pin is physically the 7. pinForHand
// is how the rest of the app resolves that (ArsenalList does the same),
// so the rack follows it rather than inventing a second convention.
//
// Pins listed by number are already physical and need no mirroring --
// a lefty's otherLeave of [7] means the 7 really stood.
function leaveOf(shot, leftHanded) {
  const raw = Array.isArray(shot?.otherLeave) ? shot.otherLeave : [];
  const pins = raw
    .filter(p => p !== "9 Pin No-Tap")
    .map(Number)
    .filter(n => Number.isInteger(n) && n >= 1 && n <= 10);

  // Explicit pins win. The named result is only consulted when nothing
  // was recorded by number.
  if (pins.length) return pins;

  const r = shot?.result;
  if (r === "Weak 10" || r === "Ringing 10") return [pinForHand(10, !!leftHanded)];

  return pins;
}

/**
 * One deck's worth of pins.
 *
 * @param firstLeave   pins standing after this deck's first ball
 * @param secondLeave  pins standing after its second ball, or null when
 *                     that isn't known (an open frame in 1-9, or a deck
 *                     still being bowled)
 * @param split        whether the first ball's leave was a split
 */
function makeDeck(firstLeave, secondLeave, split) {
  const states = {};
  for (const p of ALL_PINS) states[p] = "down1";
  for (const p of firstLeave) states[p] = "standing";

  const exact = Array.isArray(secondLeave);
  if (exact) {
    // Anything standing after ball one but not after ball two fell to
    // ball two. Set subtraction, no inference.
    for (const p of firstLeave) {
      if (!secondLeave.includes(p)) states[p] = "down2";
    }
  }

  return { states, exact, split: !!split };
}

// A deck the first ball cleared.
function strikeDeck() {
  return makeDeck([], [], false);
}

// A 9-pin no-tap strike: scored as an X, but a pin really stood.
//
// isStk() is true for these, which is right for SCORING -- and the rack
// used it for DRAWING too, so a no-tap Weak 10 rendered as a full clean
// strike. Every Weak and Ringing 10 in a no-tap event vanished from the
// card: the one thing that tells a bowler which way they are missing.
//
// The pin that stood gets its own state, "notap", so the rack shows it
// standing but counted. A true strike in a no-tap game is still clean.
function strikeDeckFor(shot, leftHanded) {
  if (!(shot && shot.noTap === true && shot.result && shot.result !== "Strike")) return strikeDeck();
  const stood = leaveOf(shot, leftHanded);
  if (!stood.length) return strikeDeck();
  const deck = makeDeck([], [], false);
  for (const p of stood) deck.states[p] = "notap";
  return deck;
}

/**
 * Racks for frames 1 through 9. Always exactly one deck: the pins only
 * reset at the end of the frame, never inside it.
 */
export function framePinDecks(shot, leftHanded) {
  if (!shot) return [];
  if (isStk(shot)) return [strikeDeckFor(shot, leftHanded)];

  const first = leaveOf(shot, leftHanded);
  const split = isSplit(shot);

  // A spare took everything that was standing -- exact, every time.
  if (shot.spareMade === "Yes") return [makeDeck(first, [], split)];

  // The spare picker records what the second ball actually left, so an
  // open frame is exact too whenever it ran.
  //
  // Array, not truthiness: an EMPTY secondLeave is a real answer -- the
  // bowler tapped nothing, so nothing fell. Treating that as "unknown"
  // would throw away the one case the picker is clearest about.
  if (Array.isArray(shot.secondLeave)) {
    return [makeDeck(first, leaveOf({ otherLeave: shot.secondLeave }, leftHanded), split)];
  }

  // Older shots, and frames still being bowled. Which of the standing
  // pins the second ball took was never recorded, so none are claimed.
  return [makeDeck(first, null, split)];
}

/**
 * Racks for the tenth: one per deck, up to three.
 *
 * The walk is deliberately simple. A ball either lands on a deck that is
 * already open -- in which case it is that deck's second ball and closes
 * it -- or it opens a new one. A strike opens and closes in the same
 * motion, and so does a spare that arrived embedded in a single record.
 *
 * @param tenth  {ball1, ball2, ball3} as frameScoresheet hands it over
 */
export function tenthPinDecks(tenth, leftHanded) {
  const balls = [tenth?.ball1, tenth?.ball2, tenth?.ball3].filter(Boolean);
  const decks = [];
  let open = null;

  for (let bi = 0; bi < balls.length; bi++) {
    const b = balls[bi];
    if (open) {
      // Second ball on the deck already in play. Its own leave is
      // recorded, so this one is exact.
      decks.push(makeDeck(open.firstLeave, leaveOf(b, leftHanded), open.split));
      open = null;
      continue;
    }

    if (isStk(b)) { decks.push(strikeDeckFor(b, leftHanded)); continue; }

    // The tenth's first ball can carry its spare in the same record, in
    // which case the deck is complete on arrival.
    if (b.spareMade === "Yes") {
      decks.push(makeDeck(leaveOf(b, leftHanded), [], isSplit(b)));
      continue;
    }

    // An open deck whose second ball is recorded in the same record --
    // "7 2" in the tenth. Its secondLeave says what stood after ball
    // two, exactly as frames 1-9 use it; without this the deck stayed
    // "waiting on ball two" and the pins ball two took were drawn as
    // still standing.
    // Only when no separate record follows: a tenth logged ball by ball
    // carries its second ball as the next record instead.
    if (b.spareMade === "No" && Array.isArray(b.secondLeave) && bi === balls.length - 1) {
      decks.push(makeDeck(leaveOf(b, leftHanded), leaveOf({ otherLeave: b.secondLeave }, leftHanded), isSplit(b)));
      continue;
    }

    open = { firstLeave: leaveOf(b, leftHanded), split: isSplit(b) };
  }

  // A deck still waiting on its second ball -- mid-frame, or an open
  // tenth that ended there.
  if (open) decks.push(makeDeck(open.firstLeave, null, open.split));

  return decks;
}

/**
 * The racks for one frameScoresheet row, whichever frame it is.
 */
export function rowPinDecks(row, leftHanded) {
  if (!row) return [];
  return row.frame === 10
    ? tenthPinDecks(row.tenth, leftHanded)
    : framePinDecks(row.shot, leftHanded);
}

// How much room a frame needs, relative to a one-deck frame.
//
// Returned as a number rather than a width so the component owns the
// units: the row divides the visible width by five, and this says how
// many of those shares this frame takes.
//
// Deliberately sub-linear. Three decks need more room than one but not
// three times as much -- the marks and the running total underneath are
// already sized, and only the racks actually multiply.
export function frameWidthUnits(deckCount) {
  const n = Math.max(1, Math.min(3, Number(deckCount) || 1));
  return n === 1 ? 1 : n === 2 ? 1.7 : 2.5;
}
