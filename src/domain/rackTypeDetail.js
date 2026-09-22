// The detail behind the Free Fall vs String card: rates, what was left
// standing, and how the strikes carried, for each rack type.
//
// statsByRackType (centers.js) keeps the headline numbers it always had
// -- average, strike %, messenger share. This adds the rest, off the same
// shots and the same league -> centre -> rack type lookup, so the card's
// three tabs never disagree about which games count.

import { isSplit, isCornerPinLeave, pinForHand, splitKey } from "./splits.js";
import { rackTypeForLane } from "./centers.js";

const rows = v => (Array.isArray(v) ? v : []).filter(x => x && typeof x === "object");
const isFirstBall = s => !s.ballNum || Number(s.ballNum) === 1;
const pct = (n, d) => (d ? Math.round((n / d) * 1000) / 10 : null);

// Below these, a tab says nothing rather than something noisy. Twenty
// first balls is two games; five described strikes is the least a
// "share of strikes" can stand on.
export const MIN_FIRST_BALLS_FOR_LEAVES = 20;
export const MIN_DESCRIBED_STRIKES = 5;

// Canonical strike descriptions, as stored. The card mirrors the two
// pin-specific ones for a left-hander, the way the logging screen does.
export const STRIKE_SHAPES = ["Flush", "Messenger", "Light", "High", "Half Pocket", "Trip 4", "Kick 10", "Brooklyn"];

// The pins standing after a first ball, or [] for a strike / nothing.
// Weak and Ringing 10 are the corner pin for either hand.
export function pinsStanding(shot, leftHanded = false) {
  if (!shot || shot.result === "Strike") return [];
  if (shot.result === "Weak 10" || shot.result === "Ringing 10") return [pinForHand(10, leftHanded)];
  if (shot.result !== "Other Leave") return [];
  return (Array.isArray(shot.otherLeave) ? shot.otherLeave : [])
    .filter(p => p !== "9 Pin No-Tap")
    .map(p => parseInt(p, 10))
    .filter(n => Number.isInteger(n) && n >= 1 && n <= 10);
}

// The CENTRE each league bowls at, not the rack type -- because a mixed
// house has no single answer. rackTypeForLane resolves each shot from the
// lane it was thrown on, and a shot with no lane in a mixed house is left
// out rather than guessed.
function centerByLeague(leagues, centers) {
  const centerById = {};
  rows(centers).forEach(c => { centerById[c.id] = c; });
  const out = {};
  rows(leagues).forEach(l => {
    const c = l.centerId && centerById[l.centerId];
    if (c && c.rackType) out[l.name] = c;
  });
  return out;
}

function emptyBucket() {
  return { firstBalls: 0, spareAttempts: 0, sparesMade: 0, splits: 0, corners: 0,
    pinCounts: {}, leaves: {}, shapes: {}, described: 0 };
}

export function rackTypeDetail(shots, leagues, centers, bowler, leftHanded = false) {
  const centerFor = centerByLeague(leagues, centers);
  const b = { freefall: emptyBucket(), string: emptyBucket() };

  for (const s of rows(shots)) {
    if (bowler && s.bowler !== bowler) continue;
    const rt = rackTypeForLane(centerFor[s.league], s.lane);
    if (rt !== "freefall" && rt !== "string") continue;
    const x = b[rt];
    if (s.result === "Strike") {
      const d = STRIKE_SHAPES.includes(s.strikeDescription) ? s.strikeDescription : null;
      if (d) { x.shapes[d] = (x.shapes[d] || 0) + 1; x.described += 1; }
    }
    // Spare conversion as everywhere else in the app: splits excluded.
    if (s.result !== "Strike" && String(s.spareMade ?? "").trim() !== "" && !isSplit(s)) {
      x.spareAttempts += 1;
      if (s.spareMade === "Yes") x.sparesMade += 1;
    }
    if (!isFirstBall(s)) continue;
    x.firstBalls += 1;
    if (isSplit(s)) x.splits += 1;
    if (isCornerPinLeave(s, leftHanded)) x.corners += 1;
    const pins = pinsStanding(s, leftHanded);
    if (pins.length) {
      pins.forEach(p => { x.pinCounts[p] = (x.pinCounts[p] || 0) + 1; });
      const key = s.result === "Other Leave" ? splitKey(s) : [...pins].sort((a, c) => a - c).join("-");
      if (key) x.leaves[key] = (x.leaves[key] || 0) + 1;
    }
  }

  const summarize = x => ({
    firstBalls: x.firstBalls,
    spareRate: pct(x.sparesMade, x.spareAttempts),
    spareAttempts: x.spareAttempts,
    splitRate: pct(x.splits, x.firstBalls),
    cornerRate: pct(x.corners, x.firstBalls),
    // Share of first balls that left each pin standing, 0-100.
    pinRates: Object.fromEntries(Object.entries(x.pinCounts).map(([p, n]) => [p, pct(n, x.firstBalls)])),
    leaves: x.leaves,
    described: x.described,
    shapes: STRIKE_SHAPES
      .filter(k => x.shapes[k])
      .map(k => ({ shape: k, count: x.shapes[k], pct: pct(x.shapes[k], x.described) })),
  });

  const freefall = summarize(b.freefall), string = summarize(b.string);
  return {
    freefall, string,
    cornerPin: pinForHand(10, leftHanded),
    leavesReady: freefall.firstBalls >= MIN_FIRST_BALLS_FOR_LEAVES && string.firstBalls >= MIN_FIRST_BALLS_FOR_LEAVES,
    strikesReady: freefall.described >= MIN_DESCRIBED_STRIKES && string.described >= MIN_DESCRIBED_STRIKES,
    biggestChanges: biggestChanges(b.freefall, b.string),
  };
}

// Leaves whose share of first balls moved most between the two, both
// ways. Only leaves seen at least three times in total, so one stray
// 4-6 doesn't headline the card.
export function biggestChanges(ff, st, limit = 3) {
  if (!ff.firstBalls || !st.firstBalls) return [];
  const keys = new Set([...Object.keys(ff.leaves), ...Object.keys(st.leaves)]);
  return [...keys]
    .map(key => {
      const a = ff.leaves[key] || 0, c = st.leaves[key] || 0;
      return { key, freefallCount: a, stringCount: c,
        freefallRate: pct(a, ff.firstBalls), stringRate: pct(c, st.firstBalls) };
    })
    .filter(r => r.freefallCount + r.stringCount >= 3 && /^\d{1,2}(-\d{1,2})*$/.test(r.key))
    .map(r => ({ ...r, change: Math.round((r.stringRate - r.freefallRate) * 10) / 10 }))
    .filter(r => r.change !== 0)
    .sort((x, y) => Math.abs(y.change) - Math.abs(x.change) || x.key.localeCompare(y.key, undefined, { numeric: true }))
    .slice(0, limit);
}
