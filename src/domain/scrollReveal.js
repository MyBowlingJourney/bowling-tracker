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
 * @param gap          breathing room below the region
 *
 * @returns pixels to scroll DOWN. Never negative: a region already fully
 *          visible returns 0, because scrolling backwards to "reveal"
 *          something the bowler is already looking at moves the page for
 *          a reason they cannot see.
 */
export function revealBottomDelta({ rect, bottomLimit, headerH, cap = false, gap = 12 }) {
  if (!rect || !Number.isFinite(bottomLimit) || bottomLimit <= 0) return 0;

  let delta = rect.bottom + gap - bottomLimit;
  if (!(delta > 0)) return 0;          // also catches NaN

  if (cap) {
    const maxDelta = rect.top - (headerH + gap);
    if (delta > maxDelta) delta = maxDelta;
  }

  return delta > 0 ? delta : 0;
}

// Below this, a scroll is visual noise rather than a correction -- the
// page jiggles and nothing useful comes on screen.
export const MIN_SCROLL = 2;
