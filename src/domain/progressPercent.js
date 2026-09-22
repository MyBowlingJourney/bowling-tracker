// A progress fraction as a whole percent, ROUNDED DOWN.
//
// Rounding to nearest showed 299 of a 300 game as "100%" -- a milestone
// reading as reached when it is not. Down means 100% only when it is
// actually done. The tiny epsilon keeps floating-point noise from
// dropping a whole point (0.29 * 100 is 28.999...).
export function progressPercent(fraction) {
  const f = Number(fraction);
  if (!Number.isFinite(f) || f <= 0) return 0;
  if (f >= 1) return 100;
  return Math.min(99, Math.floor(f * 100 + 1e-9));
}
