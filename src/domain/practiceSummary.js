// What a practice session actually was, games and drills together.
//
// Practice splits into two chips -- Games and Drill -- and a bowler often
// does both on the same night: shoot a few games, then stay and work
// tenth-frame corner pins for twenty minutes. Until now each chip only
// knew about itself, so the half you were not looking at may as well not
// have happened.
//
// This reads both for one bowler on one date and reports the night, not
// the chip.

const rows = v => (Array.isArray(v) ? v : []).filter(x => x && typeof x === "object");

const clean = v => String(v ?? "").trim();

const scoresOf = s => (Array.isArray(s?.scores) ? s.scores : [])
  .map(Number).filter(Number.isFinite);

const sameNight = (r, bowler, date) =>
  clean(r.bowler) === clean(bowler) && clean(r.date) === clean(date);

// The games half: the scores for this date.
//
// Takes an already-computed liveScores array rather than deriving from
// shots, because the caller has that in hand -- BowlingTracker builds it
// from the night's shots for the scoresheet. Recomputing it here would
// be a second implementation of the scoring rules, which is how two
// screens end up disagreeing about the same game.
//
// Session rows come first and liveScores is the fallback: a row is only
// written by "End session", so mid-practice there is nothing to read
// there yet.
export function practiceGames(sessions, liveScores, opts) {
  // A default parameter only covers undefined, and a caller reading these
  // out of component state hands over null long before it hands over
  // nothing. This has bitten three domain modules now.
  const { bowler, date } = (opts && typeof opts === "object") ? opts : {};
  const who = clean(bowler), when = clean(date);
  const empty = { games: [], total: null, best: null, average: null };
  if (!who || !when) return empty;

  const fromSessions = rows(sessions)
    .filter(s => sameNight(s, who, when))
    .flatMap(scoresOf);

  // Only fall back when no session recorded scores: counting both would
  // double a night that has been ended and reopened.
  // A zero is a game not bowled yet, not a game scored zero.
  //
  // gameScores is a fixed-length array with a slot per game, so a
  // one-game practice arrives as [189, 0, 0] -- and counting those made
  // the average 63 off a single 189. Nobody bowls a zero: ten gutters
  // still scores 0 only in theory, and the real meaning here is "empty".
  const usable = v => Number.isFinite(v) && v > 0;
  const games = fromSessions.length
    ? fromSessions.filter(usable)
    : (Array.isArray(liveScores) ? liveScores : [])
        .map(Number).filter(usable);

  if (!games.length) return empty;
  const total = games.reduce((a, b) => a + b, 0);
  return {
    games,
    total,
    best: Math.max(...games),
    average: Math.round((total / games.length) * 10) / 10,
  };
}

// The drills half: every target worked on this date.
//
// Grouped by target rather than listed per record, because a bowler who
// shot the 10 pin in two sittings did one thing twice, not two things.
export function practiceDrills(drills, opts) {
  // A default parameter only covers undefined, and a caller reading these
  // out of component state hands over null long before it hands over
  // nothing. This has bitten three domain modules now.
  const { bowler, date } = (opts && typeof opts === "object") ? opts : {};
  const who = clean(bowler), when = clean(date);
  if (!who || !when) return [];

  const byTarget = new Map();
  for (const d of rows(drills)) {
    if (!sameNight(d, who, when)) continue;
    const key = clean(d.customTarget) || clean(d.target) || "drill";
    const made = Number(d.made) || 0;
    const missed = Number(d.missed) || 0;
    if (!made && !missed) continue;
    const cur = byTarget.get(key) || { target: key, made: 0, missed: 0 };
    cur.made += made;
    cur.missed += missed;
    byTarget.set(key, cur);
  }

  return [...byTarget.values()].map(t => ({
    ...t,
    attempts: t.made + t.missed,
    // Null rather than 0 when nothing was attempted: a rate of zero reads
    // as "missed everything", which is a different claim.
    rate: (t.made + t.missed)
      ? Math.round((t.made / (t.made + t.missed)) * 100)
      : null,
  })).sort((a, b) => b.attempts - a.attempts);
}

// Both halves, plus whether each happened.
//
// The flags matter because the summary should say "you only shot games"
// rather than showing an empty drills section -- an empty section reads
// as a feature that is broken rather than a thing you did not do.
export function practiceSummary(opts) {
  // A default parameter only covers undefined, and a caller reading these
  // out of component state hands over null long before it hands over
  // nothing. This has bitten three domain modules now.
  const { sessions, liveScores, drills, bowler, date } = (opts && typeof opts === "object") ? opts : {};
  const games = practiceGames(sessions, liveScores, { bowler, date });
  const targets = practiceDrills(drills, { bowler, date });
  const drillAttempts = targets.reduce((a, t) => a + t.attempts, 0);
  const drillMade = targets.reduce((a, t) => a + t.made, 0);
  return {
    games,
    targets,
    drillAttempts,
    // Returned as well as used: the recap says "18 of 25", and a rate
    // without the made count behind it is a number a bowler cannot check.
    drillMade,
    drillRate: drillAttempts ? Math.round((drillMade / drillAttempts) * 100) : null,
    didGames: games.games.length > 0,
    didDrills: drillAttempts > 0,
    didNothing: games.games.length === 0 && drillAttempts === 0,
  };
}
