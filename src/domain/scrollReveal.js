// How far to scroll to bring the END of a region onto the screen.
//
// Split out of LogView so it can be tested. The component owns the DOM --
// measuring rects, reading the header height, calling scrollBy -- and
// this owns the arithmetic, which is the part that was getting it wrong.
//
// Two failure modes, both reported from an actual phone:
//
//   Too far. Top-aligning the accessory block scrolled past the end of
//   the page and left dead space between the last card and Save Shot.
//
//   Not far enough. Capping the scroll so the block's top stayed under
//   the header meant a block taller than the screen never reached its
//   bottom, and Shoes and Execution stayed below the fold.
//
// So the cap is a choice, not a constant, and it turns on whether the
// region fits on a screen -- see `cap` below.

// ── The screen is smaller than the window at BOTH ends ──────────────────
//
// This is what the first version got wrong, and it is worth naming.
//
// Save Shot is not in the page flow. It lives in a FIXED bar above the
// nav, so it is always reachable -- which also means it covers the last
// stretch of the window. Scrolling a card's bottom to window.innerHeight
// therefore parked that card UNDERNEATH the bar: the arithmetic was
// right and the card was still not visible.
//
// So the useful area ends at the TOP of that bar, not at the bottom of
// the window, and the caller passes it in as `bottomLimit`. Measured off
// the bar itself rather than rebuilt from nav height plus safe-area
// inset, because that sum has three terms and every one of them is a
// chance to be wrong on somebody's phone.

/**
 * @param rect         the region: {top, bottom} in viewport coordinates
 * @param bottomLimit  y below which content is hidden -- the top of the
 *                     fixed Save Shot bar, or window.innerHeight when
 *                     there is no bar on screen
 * @param headerH      height of the sticky header
 * @param cap          true  -- the region FITS in the useful area. Reveal
 *                             its end, but never push its own top under
 *                             the header.
 *                     false -- the region is TALLER than the area. Its top
 *                             cannot stay visible and does not need to; go
 *                             all the way to the limit.
 * @param allowUp      false -- REVEAL. Only ever scrolls down, to bring
 *                             something hidden onto the screen. A region
 *                             already visible returns 0, because moving
 *                             the page to show what the bowler is already
 *                             looking at is motion they cannot explain.
 *                     true  -- ALIGN. Put the region's end at the limit
 *                             whichever way that is. This is for landing
 *                             somewhere after an action rather than
 *                             following the bowler's own progress down
 *                             the form -- saving a shot ends at the
 *                             bottom of the accessory cards, and the next
 *                             frame starts at the Result card, which is
 *                             upward.
 * @param gap          breathing room below the region
 *
 * @returns pixels to scroll DOWN, or negative to scroll UP when allowUp.
 */
export function revealBottomDelta({
  rect, bottomLimit, headerH, cap = false, allowUp = false, gap = 12,
}) {
  if (!rect || !Number.isFinite(bottomLimit) || bottomLimit <= 0) return 0;

  let delta = rect.bottom + gap - bottomLimit;
  if (!Number.isFinite(delta)) return 0;
  if (!allowUp && delta <= 0) return 0;

  if (cap) {
    // Only ever pulls the scroll BACK, so it cannot turn an up-scroll
    // into a down-scroll -- it caps how far down we go, nothing else.
    const maxDelta = rect.top - (headerH + gap);
    if (!Number.isFinite(maxDelta)) return 0;
    if (delta > maxDelta) delta = maxDelta;
  }

  if (!allowUp && delta < 0) return 0;
  return delta;
}

// Below this, a scroll is visual noise rather than a correction -- the
// page jiggles and nothing useful comes on screen.
export const MIN_SCROLL = 2;
