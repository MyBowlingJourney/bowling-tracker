// The stepladder finals.
//
// Same shape as match play -- one opponent, one game, a score each --
// with two differences that matter enough to keep it separate:
//
//   1. No bonus pins. A stepladder step is sudden death: the higher
//      score advances and the loser is done. Carrying match play's
//      bonus arithmetic in here would invent pins that no sheet has.
//   2. Seeds decide everything. The bowlers are ranked coming in, the
//      bottom two bowl first, and the winner climbs. Because the ladder
//      fills places from the bottom up, where a bowler finished is a
//      fact about their seed and how many steps they won -- not
//      something to ask them.
//
// Finishing position, derived rather than asked:
//
//   Each step eliminates exactly one bowler, who takes the lowest place
//   still open. Losing your (w+1)th step after w wins puts you one place
//   above the last bowler eliminated, which works out to:
//
//     bottom seed:  place = seed - wins
//     anyone else:  place = seed - wins + 1
//
//   The bottom seed is the one case where two bowlers enter at the same
//   step (the bottom two bowl each other first), so they do not get the
//   +1 that everyone waiting above them does. "Bottom seed" is read off
//   the ladder itself -- their seed number is higher than every opponent
//   they face -- so the ladder's size never has to be entered.
//
//   Beat the number one seed and you won it: first.

export function emptyStep(stepNumber = 1) {
  return {
    stepNumber,
    opponent: "",
    opponentSeed: "",
    yourScore: "",
    opponentScore: "",
    lanePair: "",
    // Filled in from the frames rather than typed -- see matchPlay.js.
    scoreAuto: false,
  };
}

export function emptyStepladder() {
  return {
    // The day the ladder was bowled -- see matchPlay.js.
    date: "",
    yourSeed: "",
    steps: [],
  };
}

function isoDate(v) {
  const raw = String(v ?? "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : "";
}

function num(v) {
  if (v === null || v === undefined) return null;
  const raw = String(v).trim();
  if (raw === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

// Same 0-300 guard qualifying and match play use: outside that range
// it's a typo, and letting it through would corrupt a standing.
function gameScore(v) {
  const n = num(v);
  if (n === null) return null;
  const r = Math.round(n);
  return r < 0 || r > 300 ? null : r;
}

// A seed is a whole position, 1 or better. Zero and negatives are not
// seeds, and a fractional one is a typo.
function seed(v) {
  const n = num(v);
  if (n === null) return null;
  const r = Math.round(n);
  return r < 1 ? null : r;
}

export function normalizeStep(raw, stepNumber = 1) {
  const base = emptyStep(stepNumber);
  if (!raw || typeof raw !== "object") return base;
  const you = gameScore(raw.yourScore);
  const them = gameScore(raw.opponentScore);
  const os = seed(raw.opponentSeed);
  return {
    stepNumber: raw.stepNumber ?? stepNumber,
    opponent: (raw.opponent || "").trim(),
    opponentSeed: os === null ? "" : String(os),
    yourScore: you === null ? "" : String(you),
    opponentScore: them === null ? "" : String(them),
    lanePair: (raw.lanePair || "").toString().trim(),
    scoreAuto: raw.scoreAuto === true,
  };
}

export function normalizeStepladder(raw) {
  const base = emptyStepladder();
  if (!raw || typeof raw !== "object") return base;
  const ys = seed(raw.yourSeed);
  return {
    date: isoDate(raw.date),
    yourSeed: ys === null ? "" : String(ys),
    steps: Array.isArray(raw.steps) ? raw.steps.map((s, i) => normalizeStep(s, i + 1)) : [],
  };
}

export function addStep(sl) {
  const base = normalizeStepladder(sl);
  return { ...base, steps: [...base.steps, emptyStep(base.steps.length + 1)] };
}

export function removeStep(sl, stepNumber) {
  const base = normalizeStepladder(sl);
  return {
    ...base,
    steps: base.steps
      .filter(s => s.stepNumber !== stepNumber)
      // Renumber so the ladder stays 1..n after a deletion from the
      // middle -- the step number IS the order they were bowled.
      .map((s, i) => ({ ...s, stepNumber: i + 1 })),
  };
}

export function setStepField(sl, stepNumber, field, value) {
  const base = normalizeStepladder(sl);
  return {
    ...base,
    steps: base.steps.map(s => (s.stepNumber === stepNumber ? { ...s, [field]: value } : s)),
  };
}

export function setStepladderField(sl, field, value) {
  const base = normalizeStepladder(sl);
  return { ...base, [field]: value };
}

// Result of one step. Null when either score is missing -- an unbowled
// step is not a loss. A tie is possible on the lanes and is resolved by
// a roll-off the app does not model, so it is reported as a tie and
// stops the ladder from claiming a finish either way.
export function stepResult(step) {
  const you = gameScore(step?.yourScore);
  const them = gameScore(step?.opponentScore);
  if (you === null || them === null) return null;
  if (you > them) return "win";
  if (you < them) return "loss";
  return "tie";
}

// Where the ladder left you.
//
// { place, decided, wins, losses, played, scratch, average, eliminatedBy }
//
// decided is false while the ladder is still live (no loss yet and the
// number one seed not yet beaten), and place is null then: a bowler two
// steps up with three to go has no finishing position, and showing one
// would be a guess.
export function stepladderResult(sl) {
  const base = normalizeStepladder(sl);
  const mySeed = seed(base.yourSeed);

  let wins = 0, losses = 0, ties = 0, played = 0, scratch = 0;
  let winsBeforeLoss = null;
  let eliminatedBy = null;
  let beatTopSeed = false;
  // Highest opponent seed faced, for the bottom-seed test below.
  let maxOpponentSeed = null;

  for (const step of base.steps) {
    const r = stepResult(step);
    if (r === null) continue;
    played += 1;
    scratch += gameScore(step.yourScore) ?? 0;
    const os = seed(step.opponentSeed);
    if (os !== null && (maxOpponentSeed === null || os > maxOpponentSeed)) maxOpponentSeed = os;

    if (r === "win") {
      wins += 1;
      if (os === 1) beatTopSeed = true;
    } else if (r === "loss") {
      losses += 1;
      if (winsBeforeLoss === null) {
        winsBeforeLoss = wins;
        eliminatedBy = { opponent: step.opponent, seed: os, stepNumber: step.stepNumber };
      }
    } else {
      ties += 1;
    }
  }

  const totals = {
    wins, losses, ties, played, scratch,
    average: played ? Math.floor(scratch / played) : null,
    eliminatedBy,
  };

  // Won it outright: beat the top seed and never lost.
  if (beatTopSeed && losses === 0) return { ...totals, place: 1, decided: true };

  if (winsBeforeLoss === null) return { ...totals, place: null, decided: false };
  if (mySeed === null) return { ...totals, place: null, decided: false };

  // The bottom seed of the ladder is the only bowler with nobody
  // beneath them, which is the same as saying no opponent they face is
  // seeded below them.
  const bottomSeed = maxOpponentSeed !== null && mySeed > maxOpponentSeed;
  const place = bottomSeed ? mySeed - winsBeforeLoss : mySeed - winsBeforeLoss + 1;
  // A place above first is arithmetic gone wrong somewhere upstream (a
  // seed typed as 1 by a bowler who was not the top seed, say). Report
  // nothing rather than a standing that cannot exist.
  if (place < 1) return { ...totals, place: null, decided: false };
  return { ...totals, place, decided: true };
}

// One plain line for the recap. Empty while nothing is decided.
export function describeStepladder(sl) {
  const r = stepladderResult(sl);
  if (!r.played) return "";
  if (!r.decided) {
    return r.wins
      ? `${r.wins} step${r.wins === 1 ? "" : "s"} won, still climbing.`
      : "Ladder under way.";
  }
  if (r.place === 1) return `Won the stepladder${r.wins ? ` — ${r.wins} straight` : ""}.`;
  const by = r.eliminatedBy?.opponent
    ? ` to ${r.eliminatedBy.opponent}`
    : r.eliminatedBy?.seed ? ` to the ${ordinal(r.eliminatedBy.seed)} seed` : "";
  return `Finished ${ordinal(r.place)}${by}.`;
}

export function ordinal(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return String(n);
  const abs = Math.abs(Math.round(v));
  const rem100 = abs % 100;
  if (rem100 >= 11 && rem100 <= 13) return `${abs}th`;
  const rem10 = abs % 10;
  return `${abs}${rem10 === 1 ? "st" : rem10 === 2 ? "nd" : rem10 === 3 ? "rd" : "th"}`;
}
