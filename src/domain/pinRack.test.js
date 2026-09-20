import { describe, it, expect } from 'vitest';
import {
  framePinDecks, tenthPinDecks, rowPinDecks, frameWidthUnits, PIN_ROWS, ALL_PINS,
} from './pinRack.js';

// ── What these tests are actually protecting ────────────────────────────
//
// The rack claims a fact about someone's game for every pin it fills in.
// Two ways to get that wrong, and only one of them looks like a bug:
//
//   Drawing the wrong pin is visible the first time a bowler checks the
//   card against the monitor.
//
//   Drawing a pin CONFIDENTLY when the data never said so is invisible.
//   The stored shot for an open frame in 1-9 knows two pins stood and one
//   fell; it does not know which. A rack that picks one is fiction, and
//   it is fiction a bowler would then use to decide what to work on.
//
// So `exact` is asserted as hard as the pin states are.

const down = (deck, pin) => deck.states[pin];

// Everything except the named pins fell to the first ball.
const strike = { result: 'Strike', otherLeave: [] };

describe('frames 1 through 9 — always one deck', () => {
  it('a strike fills every pin from the first ball', () => {
    const [deck] = framePinDecks(strike);
    for (const p of ALL_PINS) expect(down(deck, p)).toBe('down1');
    expect(deck.exact).toBe(true);
  });

  it('a spare attributes the leave to the second ball, exactly', () => {
    // Nine down, the ten pin picked up.
    const [deck] = framePinDecks({
      result: 'Other Leave', otherLeave: [10], spareMade: 'Yes', pinCount: '10',
    });
    expect(down(deck, 10)).toBe('down2');
    expect(down(deck, 1)).toBe('down1');
    // A spare clears everything standing, so nothing is left over.
    expect(ALL_PINS.some(p => down(deck, p) === 'standing')).toBe(false);
    expect(deck.exact).toBe(true);
  });

  // The case the whole `exact` flag exists for.
  it('an open frame does NOT claim which pin the second ball took', () => {
    // Eight down leaving 4 and 7; the second ball got one of them. Which
    // one is not stored anywhere.
    const [deck] = framePinDecks({
      result: 'Other Leave', otherLeave: [4, 7], spareMade: 'No', pinCount: '9',
    });
    expect(down(deck, 4)).toBe('standing');
    expect(down(deck, 7)).toBe('standing');
    expect(deck.exact).toBe(false);
    // And nothing anywhere is attributed to the second ball.
    expect(ALL_PINS.some(p => down(deck, p) === 'down2')).toBe(false);
  });

  it('the first ball is exact even when the rest of the frame is not', () => {
    const [deck] = framePinDecks({
      result: 'Other Leave', otherLeave: [4, 7], spareMade: 'No', pinCount: '9',
    });
    // The eight that fell are known precisely, and say so.
    const first = ALL_PINS.filter(p => down(deck, p) === 'down1');
    expect(first.sort((a, b) => a - b)).toEqual([1, 2, 3, 5, 6, 8, 9, 10]);
  });

  it('marks a split leave, and an ordinary one not', () => {
    const [bedposts] = framePinDecks({ result: 'Other Leave', otherLeave: [7, 10], pinCount: '8' });
    expect(bedposts.split).toBe(true);

    // The 2 still standing ahead of the 4 and 5 makes it a cluster.
    const [cluster] = framePinDecks({ result: 'Other Leave', otherLeave: [2, 4, 5], pinCount: '7' });
    expect(cluster.split).toBe(false);
  });

  it('ignores the no-tap sentinel rather than drawing it as a pin', () => {
    // "9 Pin No-Tap" rides along in otherLeave meaning "scored as a
    // strike". Treating it as a pin number would corrupt the rack.
    const [deck] = framePinDecks({ result: 'Other Leave', noTap: true, otherLeave: ['9 Pin No-Tap'] });
    for (const p of ALL_PINS) expect(down(deck, p)).toBe('down1');
  });

  it('returns nothing at all for a frame not yet bowled', () => {
    expect(framePinDecks(null)).toEqual([]);
    expect(framePinDecks(undefined)).toEqual([]);
  });
});

// ── The corner pin is named, not numbered ───────────────────────────────
//
// "Weak 10" and "Ringing 10" store an EMPTY otherLeave -- the pin is in
// the result name. Reading only otherLeave drew all ten pins down, so a
// corner-pin leave looked exactly like a strike while every number on
// the card stayed correct. That combination is why it shipped.
describe('Weak 10 and Ringing 10 leave a pin standing', () => {
  const corner = r => ({ result: r, otherLeave: [], spareMade: 'No', pinCount: '9' });

  it('stands the 10 for a right-hander', () => {
    for (const r of ['Weak 10', 'Ringing 10']) {
      const [deck] = framePinDecks(corner(r), false);
      expect(down(deck, 10)).toBe('standing');
      expect(down(deck, 7)).toBe('down1');
      expect(ALL_PINS.filter(p => down(deck, p) === 'down1')).toHaveLength(9);
    }
  });

  // The stored value is canonical for both hands: a lefty taps "Weak 7"
  // and the record still says "Weak 10". The pin that physically stood
  // is the 7, and the rack has to draw the pin, not the label.
  it('stands the 7 for a left-hander', () => {
    const [deck] = framePinDecks(corner('Weak 10'), true);
    expect(down(deck, 7)).toBe('standing');
    expect(down(deck, 10)).toBe('down1');
  });

  it('attributes the corner pin to ball two when the spare was made', () => {
    const [deck] = framePinDecks(
      { result: 'Weak 10', otherLeave: [], spareMade: 'Yes', pinCount: '10' }, false,
    );
    expect(down(deck, 10)).toBe('down2');
    expect(deck.exact).toBe(true);
  });

  // The guard that keeps this fix from swallowing real strikes.
  it('does not stand a pin for an actual strike', () => {
    const [deck] = framePinDecks(strike, false);
    expect(ALL_PINS.every(p => down(deck, p) === 'down1')).toBe(true);
  });

  it('lets pins recorded by number win over the result name', () => {
    const [deck] = framePinDecks(
      { result: 'Other Leave', otherLeave: [4, 7], spareMade: 'No', pinCount: '8' }, false,
    );
    expect(down(deck, 4)).toBe('standing');
    expect(down(deck, 7)).toBe('standing');
    expect(down(deck, 10)).toBe('down1');
  });
});

describe('the tenth — one rack per deck, never per ball', () => {
  const b = (n, shot) => ({ ...shot, ballNum: n, frame: 10 });

  it('three strikes are three decks', () => {
    const decks = tenthPinDecks({
      ball1: b(1, strike), ball2: b(2, strike), ball3: b(3, strike),
    });
    expect(decks).toHaveLength(3);
    for (const d of decks) {
      for (const p of ALL_PINS) expect(down(d, p)).toBe('down1');
    }
  });

  // The case that settled the design: a strike then a spare is TWO
  // racks, not three. The eight and the fill ball share a deck, so the
  // colours carry them.
  it('strike then spare is two decks, with the fill ball in amber', () => {
    const decks = tenthPinDecks({
      ball1: b(1, strike),
      ball2: b(2, { result: 'Other Leave', otherLeave: [4, 7] }),
      ball3: b(3, { result: 'Other Leave', otherLeave: [] }),
    });
    expect(decks).toHaveLength(2);

    // Deck one: the strike.
    for (const p of ALL_PINS) expect(down(decks[0], p)).toBe('down1');

    // Deck two: eight on its first ball, the 4 and 7 on its second.
    expect(down(decks[1], 4)).toBe('down2');
    expect(down(decks[1], 7)).toBe('down2');
    expect(down(decks[1], 1)).toBe('down1');
    expect(decks[1].exact).toBe(true);
  });

  it('spare then strike is two decks', () => {
    const decks = tenthPinDecks({
      ball1: b(1, { result: 'Other Leave', otherLeave: [10] }),
      ball2: b(2, { result: 'Other Leave', otherLeave: [] }),
      ball3: b(3, strike),
    });
    expect(decks).toHaveLength(2);
    expect(down(decks[0], 10)).toBe('down2');
    for (const p of ALL_PINS) expect(down(decks[1], p)).toBe('down1');
  });

  it('an open tenth is ONE deck, the same width as any other frame', () => {
    const decks = tenthPinDecks({
      ball1: b(1, { result: 'Other Leave', otherLeave: [4, 7] }),
      ball2: b(2, { result: 'Other Leave', otherLeave: [7] }),
      ball3: null,
    });
    expect(decks).toHaveLength(1);
    // The tenth stores each ball separately, so unlike frames 1-9 this
    // one IS exactly attributable: the 4 fell, the 7 stood.
    expect(down(decks[0], 4)).toBe('down2');
    expect(down(decks[0], 7)).toBe('standing');
    expect(decks[0].exact).toBe(true);
  });

  it('handles a spare embedded in the first ball record', () => {
    // A spare on the tenth's first ball can arrive as one record
    // covering both balls, rather than two.
    const decks = tenthPinDecks({
      ball1: b(1, { result: 'Other Leave', otherLeave: [10], spareMade: 'Yes', pinCount: '10' }),
      ball2: null, ball3: null,
    });
    expect(decks).toHaveLength(1);
    expect(down(decks[0], 10)).toBe('down2');
    expect(decks[0].exact).toBe(true);
  });

  it('a deck still being bowled claims nothing about its second ball', () => {
    const decks = tenthPinDecks({
      ball1: b(1, strike),
      ball2: b(2, { result: 'Other Leave', otherLeave: [4, 7] }),
      ball3: null,
    });
    expect(decks).toHaveLength(2);
    expect(down(decks[1], 4)).toBe('standing');
    expect(down(decks[1], 7)).toBe('standing');
    expect(decks[1].exact).toBe(false);
  });

  it('survives an empty or missing tenth', () => {
    expect(tenthPinDecks(null)).toEqual([]);
    expect(tenthPinDecks({})).toEqual([]);
    expect(tenthPinDecks({ ball1: null, ball2: null, ball3: null })).toEqual([]);
  });

  it('never returns more than three decks', () => {
    const decks = tenthPinDecks({
      ball1: b(1, strike), ball2: b(2, strike), ball3: b(3, strike),
    });
    expect(decks.length).toBeLessThanOrEqual(3);
  });
});

describe('rowPinDecks routes by frame', () => {
  it('sends the tenth to the tenth reader', () => {
    const decks = rowPinDecks({
      frame: 10,
      tenth: { ball1: { ...strike, ballNum: 1 }, ball2: { ...strike, ballNum: 2 }, ball3: null },
      shot: { ...strike, ballNum: 1 },
    });
    expect(decks).toHaveLength(2);
  });

  it('sends every other frame to the single-deck reader', () => {
    const decks = rowPinDecks({ frame: 3, shot: strike, tenth: null });
    expect(decks).toHaveLength(1);
  });

  it('is safe on a row that has nothing in it', () => {
    expect(rowPinDecks(null)).toEqual([]);
    expect(rowPinDecks({ frame: 4, shot: null, tenth: null })).toEqual([]);
  });
});

describe('width follows the decks', () => {
  it('one deck is one frame wide', () => {
    expect(frameWidthUnits(1)).toBe(1);
  });

  it('more decks take more room, but less than proportionally', () => {
    // The marks and the running total are already sized; only the racks
    // multiply. Three decks at 3x would leave the box mostly empty.
    expect(frameWidthUnits(2)).toBeGreaterThan(1);
    expect(frameWidthUnits(3)).toBeGreaterThan(frameWidthUnits(2));
    expect(frameWidthUnits(3)).toBeLessThan(3);
  });

  it('clamps nonsense rather than returning a broken width', () => {
    // A width of 0 or NaN collapses the frame to nothing, which is a
    // worse failure than being slightly too wide.
    expect(frameWidthUnits(0)).toBe(1);
    expect(frameWidthUnits(-2)).toBe(1);
    expect(frameWidthUnits(99)).toBe(frameWidthUnits(3));
    expect(frameWidthUnits(undefined)).toBe(1);
    expect(frameWidthUnits(NaN)).toBe(1);
  });
});

describe('the rack layout itself', () => {
  it('is the deck as seen from the approach, back row first', () => {
    expect(PIN_ROWS.map(r => [...r])).toEqual([[7, 8, 9, 10], [4, 5, 6], [2, 3], [1]]);
  });

  it('names all ten pins exactly once', () => {
    const flat = PIN_ROWS.flatMap(r => [...r]).sort((a, b) => a - b);
    expect(flat).toEqual(ALL_PINS);
  });
});
