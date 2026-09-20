import { describe, it, expect } from 'vitest';
import { revealBottomDelta } from './scrollReveal.js';

// An 800px window with the app's sticky header at the top and the fixed
// Save Shot bar covering the last 132px, so the useful area ends at 668.
const WINDOW = 800, LIMIT = 668, H = 64, GAP = 12;
const d = (top, bottom, cap = false) =>
  revealBottomDelta({ rect: { top, bottom }, bottomLimit: LIMIT, headerH: H, cap });

describe('nothing to do', () => {
  it('leaves a region that already ends above the bar alone', () => {
    expect(d(200, 600)).toBe(0);
  });

  // "Reveal" must never scroll UP. A bowler looking at a block that is
  // already visible should not see the page move.
  it('never scrolls backwards', () => {
    expect(d(-400, -100)).toBe(0);
    expect(d(100, 300, true)).toBe(0);
  });

  it('treats one gap above the bar as already visible', () => {
    expect(d(100, LIMIT - GAP)).toBe(0);
  });
});

// ── The bug that started this ───────────────────────────────────────────
describe('the fixed Save Shot bar', () => {
  // A card ending between the bar's top and the window bottom LOOKS
  // on-screen to any arithmetic based on innerHeight, and is in fact
  // hidden behind the bar. This is exactly what "Shoes and Execution are
  // still below Save Shot" was.
  it('scrolls content out from behind the bar', () => {
    const behindBar = 700;                 // > LIMIT, < WINDOW
    expect(behindBar).toBeLessThan(WINDOW);
    expect(d(300, behindBar)).toBe(behindBar + GAP - LIMIT);  // 44
  });

  it('would have done nothing if it measured the window instead', () => {
    const wrong = revealBottomDelta({
      rect: { top: 300, bottom: 700 }, bottomLimit: WINDOW, headerH: H,
    });
    expect(wrong).toBe(0);                 // the old behaviour
    expect(d(300, 700)).toBeGreaterThan(0);
  });
});

describe('a region taller than the area (cap off)', () => {
  // The accessory grid: Line, Measurements, Shoes, Execution. Its top is
  // above the fold and cannot stay visible; what matters is that Shoes
  // and Execution end up above the Save Shot bar.
  it('goes all the way to the limit', () => {
    expect(d(-300, 1100)).toBe(1100 + GAP - LIMIT);   // 444
  });

  // Capping here is what stopped the scroll short and left the last two
  // cards below the fold.
  it('is not limited by its own top', () => {
    expect(d(-300, 1100)).toBeGreaterThan(0);
    expect(d(-300, 1100, true)).toBe(0);
  });
});

describe('a region that fits (cap on)', () => {
  // The Result card on entering edit mode.
  it('reveals the end when there is room to', () => {
    expect(d(300, 700, true)).toBe(44);
  });

  it('stops before its own top slips under the header', () => {
    // Wants 344, but only 100 - (64+12) = 24 is available.
    expect(d(100, 1000, true)).toBe(24);
  });

  it('does nothing rather than a negative scroll when there is no room', () => {
    expect(d(70, 1000, true)).toBe(0);
  });
});

describe('safety', () => {
  it('is safe on a missing rect', () => {
    expect(revealBottomDelta({ rect: null, bottomLimit: LIMIT, headerH: H })).toBe(0);
  });

  // jsdom and a backgrounded tab both hand back zeroes.
  it('is safe on a zero or bogus limit', () => {
    expect(revealBottomDelta({ rect: { top: 0, bottom: 900 }, bottomLimit: 0, headerH: H })).toBe(0);
    expect(revealBottomDelta({ rect: { top: 0, bottom: 900 }, bottomLimit: NaN, headerH: H })).toBe(0);
  });

  it('never returns NaN from a bogus rect', () => {
    expect(revealBottomDelta({ rect: { top: NaN, bottom: NaN }, bottomLimit: LIMIT, headerH: H })).toBe(0);
  });
});
