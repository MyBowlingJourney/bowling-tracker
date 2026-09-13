// The four things a tournament can be, and what each one does.
//
// They are FOUR INDEPENDENT AXES, not one setting with six values:
//
//   scoringBasis  scratch | handicap   -- are pins added to each game
//   trackingMode  shot    | game       -- frames, or final scores only
//   pinFormat     tenpin  | notap9     -- what counts as a strike
//   playStyle     standard| baker      -- bowling alone, or alternating
//
// Any combination is legal. A Baker squad can be handicapped, no-tap and
// frame-tracked all at once, which is why an earlier version that packed
// scratch/handicap/baker into one field was already drifting toward a
// combinatorial list with "baker-no-tap".
//
// Every default is the one that means "behaves as it always has":
// scratch, frame tracking, 10 pin, standard. A tournament recorded before
// any of this keeps its scores unchanged.

import { leagueFormat } from "./leagueSeasons.js";

// The stored value is "shot" and the label is "Frame tracking" -- that
// mismatch predates this and is left alone deliberately. Changing the
// stored value would rewrite every existing preference for a wording
// change nobody sees.
export const SCORING_BASES = [
  { id: "scratch",  label: "Scratch",  blurb: "Your pins, as bowled." },
  { id: "handicap", label: "Handicap", blurb: "Pins added to every game." },
];

export const TRACKING_MODES = [
  { id: "shot", label: "Frame tracking", blurb: "Every frame, with leaves and carry." },
  { id: "game", label: "Game tracking",  blurb: "Final score for each game." },
];

export const PIN_FORMATS = [
  { id: "tenpin", label: "10 pin",       blurb: "Standard scoring." },
  { id: "notap9", label: "9 pin no-tap", blurb: "Nine on the first ball counts as a strike." },
];

export const PLAY_STYLES = [
  { id: "standard", label: "Standard", blurb: "You bowl the whole game." },
  { id: "baker",    label: "Baker",    blurb: "You and a partner alternate frames." },
];

// Resolvers. Anything unrecognised -- blank, missing, a value from a
// future version -- falls back to the default rather than throwing or
// being stored as-is, so an unknown value scores as standard rather than
// stranding the event.
export function scoringBasis(t) {
  return t?.scoringBasis === "handicap" ? "handicap" : "scratch";
}

export function trackingMode(t) {
  return t?.trackingMode === "game" ? "game" : "shot";
}

export function pinFormat(t) {
  return leagueFormat(t?.pinFormat);
}

export function playStyle(t) {
  return t?.playStyle === "baker" ? "baker" : "standard";
}

const num = v => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

// ── Handicap ────────────────────────────────────────────────────────────
//
// Added to EVERY GAME, not once to the series.
//
// That distinction is the whole thing. A 40-pin handicap across a
// four-game block is 160 pins, not 40, and a bowler checking whether
// they made the cut needs the number the tournament used. Adding it once
// would under-report by three games' worth and quietly put them below a
// cut line they actually cleared.

export function handicapPerGame(tournament) {
  return num(tournament?.handicap) ?? 0;
}

// A single game with handicap applied.
export function gameWithHandicap(score, handicap) {
  const s = num(score);
  if (s === null) return null;
  const h = num(handicap) ?? 0;
  return s + h;
}

// Does this tournament apply a handicap at all?
//
// Scratch and Baker do not. A handicap typed and then switched to
// scratch stays stored -- switching back should not lose it -- but it
// must not be applied while the event is scratch.
export function appliesHandicap(tournament) {
  return scoringBasis(tournament) === "handicap" && handicapPerGame(tournament) > 0;
}

// Handicap pins across however many games were actually bowled.
//
// Games ENTERED, not games scheduled: a block abandoned after two games
// earns two games of handicap, and counting five would invent pins.
export function handicapPins(tournament, gamesEntered) {
  if (!appliesHandicap(tournament)) return 0;
  const n = num(gamesEntered) ?? 0;
  return handicapPerGame(tournament) * Math.max(0, n);
}

// ── Baker ───────────────────────────────────────────────────────────────
//
// Two bowlers alternate frames and share one game score.
//
// Who bowls which frame follows from who starts, so nothing needs
// marking per shot -- a frame's owner is arithmetic:
//
//   Starter bowls the odd frames:  1, 3, 5, 7, 9
//   Partner bowls the even frames: 2, 4, 6, 8, 10
//
// THE TENTH IS NOT SPLIT. Whoever starts the 10th bowls all of it,
// including a fill ball. That is the rule bowlers use and it is also the
// only sane reading: a fill ball earned by a strike belongs to the
// person who threw the strike.

export const BAKER_STARTERS = [
  { id: "me", label: "I start" },
  { id: "partner", label: "Partner starts" },
];

export function isBaker(tournament) {
  return playStyle(tournament) === "baker";
}

// "me" or "partner" -- who bowls this frame.
//
// Returns null for a frame number that is not 1-10, rather than
// guessing, because a wrong owner silently misattributes a strike.
export function bakerFrameOwner(frameNumber, starter) {
  const f = num(frameNumber);
  if (f === null || f < 1 || f > 10) return null;
  const startsWithMe = starter !== "partner";
  const oddFrame = f % 2 === 1;
  // Odd frames belong to whoever started; even frames to the other.
  return oddFrame === startsWithMe ? "me" : "partner";
}

// The frames this bowler actually threw.
export function bakerFramesFor(who, starter) {
  const out = [];
  for (let f = 1; f <= 10; f++) if (bakerFrameOwner(f, starter) === who) out.push(f);
  return out;
}

export function isMyBakerFrame(frameNumber, starter) {
  return bakerFrameOwner(frameNumber, starter) === "me";
}

// Whose shots count toward the bowler's own statistics.
//
// A Baker SCORE is not the bowler's -- half of it was thrown by someone
// else, so it must not land in their average. Their FRAMES are entirely
// theirs, so strike percentage, carry by ball and leave patterns should
// all count them: they threw those balls.
//
// Splitting the two is the point. Dropping Baker entirely would throw
// away real shot data; keeping it whole would inflate an average with a
// partner's pins.
export function myBakerShots(shots, starter) {
  return (Array.isArray(shots) ? shots : [])
    .filter(s => s && typeof s === "object")
    .filter(s => isMyBakerFrame(parseInt(s.frame, 10), starter));
}

// Does this session's SCORE belong in the bowler's average?
//
// False for Baker, true for everything else. Called by whatever computes
// averages, so a Baker block is visible in history and absent from the
// figures it would distort.
export function scoreCountsForBowler(tournament) {
  return !isBaker(tournament);
}

// One line explaining why a Baker score is set aside, shown where the
// score is. Without it the bowler sees a 210 excluded from their average
// and reasonably assumes a bug.
export function bakerScoreNote(tournament) {
  if (!isBaker(tournament)) return "";
  const partner = String(tournament?.bakerPartner || "").trim();
  const who = partner ? `you and ${partner}` : "you and your partner";
  return `Baker: ${who} bowled this together, so the score stays out of your average. `
    + `Your own frames still count toward strikes, spares and how each ball carried.`;
}
