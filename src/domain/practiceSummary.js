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
  const { bowler, date, seq } = (opts && typeof opts === "object") ? opts : {};
  const who = clean(bowler), when = clean(date);
  const empty = { games: [], total: null, best: null, average: null };
  if (!who || !when) return empty;

  // seq: which session of that day. A day can hold more than one, and a
  // filed row from the morning is not this afternoon's night -- reading
  // it as one is how a 256 nobody bowled today turned up in Results. A
  // row with no seq of its own predates the idea and reads as 1.
  const sameRun = s => seq == null || (Number(s?.sessionSeq) || 1) === seq;
  const fromSessions = rows(sessions)
    .filter(s => sameNight(s, who, when) && sameRun(s))
    .flatMap(scoresOf);

  // Only fall back when no session recorded scores: counting both would
  // double a night that has been ended and reopened.
  // A zero is a game not bowled yet, not a game scored zero.
  //
  // gameScores is a fixed-length array with a slot per game, so a
  // one-game practice arrives as [189, 0, 0] -- and counting those made
  // the average 63 off a single 189. Nobody bowls a zero: ten gutters
  // still scores 0 only in theory, and the real meaning here is "empty".
  // Two different filters, because the two arrays mean different things.
  //
  // liveScores is fixed-length with a slot per game, so an unbowled game
  // arrives as 0 and has to be dropped -- that is what made a one-game
  // practice average 63 off a single 189.
  //
  // A filed session's scores array holds only games actually bowled, so
  // a 0 in it is a real gutter game. Dropping it there was wrong: it
  // removed a score the bowler earned and quietly raised their average.
  // CSV import makes this reachable -- 0 is a valid score in a file.
  const bowled = v => Number.isFinite(v) && v >= 0;
  const notPadding = v => Number.isFinite(v) && v > 0;
  const live = (Array.isArray(liveScores) ? liveScores : []).map(Number).filter(notPadding);
  const filed = fromSessions.filter(bowled);

  // The LIVE scores win whenever there are any.
  //
  // A filed session row used to win outright, so the moment one existed
  // for tonight the live scores were discarded -- and this card showed
  // 193.3 while the Games tab beside it showed 210, for the same night,
  // on the same screen. Two averages, both presented as fact.
  //
  // Live is the right one: it is literally what is in the score boxes, so
  // this card and those boxes can never disagree again. A filed row is
  // the fallback for a night with nothing live -- an old night being
  // looked back at, where the row is all there is.
  //
  // Count is not the tiebreak. Equal counts were the failing case, and
  // "the longer list" would still have let a stale three-game row beat
  // three freshly corrected scores.
  const games = live.length ? live : filed;

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
  const { bowler, date, seq } = (opts && typeof opts === "object") ? opts : {};
  const who = clean(bowler), when = clean(date);
  if (!who || !when) return [];

  const byTarget = new Map();
  for (const d of rows(drills)) {
    if (!sameNight(d, who, when)) continue;
    if (seq != null && (Number(d?.sessionSeq) || 1) !== seq) continue;
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
  const { sessions, liveScores, drills, bowler, date, seq } = (opts && typeof opts === "object") ? opts : {};
  const games = practiceGames(sessions, liveScores, { bowler, date, seq });
  const targets = practiceDrills(drills, { bowler, date, seq });
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

// What the frames say about the games bowled tonight.
//
// A practice summary of average, best and series is the same summary any
// scoresheet gives -- and the reason to log frame by frame is that the app
// can say things a scoresheet cannot. If a bowler took the trouble to
// record every delivery, the recap should show what that bought them.
//
// Everything here needs shots. A scores-only practice gets null and the
// card falls back to the plain figures, because inventing detail from
// three numbers would be worse than not having it.
export function practiceShotStats(shots, opts) {
  // A default parameter only covers undefined, not null. Fifth time.
  const { bowler, league, date, isSplit } =
    (opts && typeof opts === "object") ? opts : {};
  const who = clean(bowler), lg = clean(league), when = clean(date);
  const mine = rows(shots).filter(sh =>
    (!who || clean(sh.bowler) === who)
    && (!lg || clean(sh.league) === lg)
    && (!when || clean(sh.date) === when));
  if (!mine.length) return null;

  // First balls only: a strike rate counts opportunities, and the second
  // ball of a frame was never one.
  const first = mine.filter(sh => String(sh.ballNum ?? "1") === "1" || sh.ballNum == null);
  if (!first.length) return null;

  const strikes = first.filter(sh => clean(sh.result) === "Strike").length;

  // Spare chances are first balls that left something, excluding the ones
  // that cannot be converted in the normal run of play.
  const leaves = first.filter(sh => clean(sh.result) !== "Strike");
  const converted = leaves.filter(sh => clean(sh.spareMade) === "Yes").length;

  const splits = typeof isSplit === "function"
    ? leaves.filter(sh => isSplit(sh)).length
    : null;

  // Which ball carried best, when more than one was thrown.
  //
  // One ball is not a comparison, so it reports nothing rather than
  // "your only ball is your best ball".
  const byBall = new Map();
  for (const sh of first) {
    const b = clean(sh.ball);
    if (!b) continue;
    const cur = byBall.get(b) || { ball: b, first: 0, strikes: 0 };
    cur.first += 1;
    if (clean(sh.result) === "Strike") cur.strikes += 1;
    byBall.set(b, cur);
  }
  const balls = [...byBall.values()]
    .filter(b => b.first >= 3)
    .map(b => ({ ...b, rate: Math.round((b.strikes / b.first) * 100) }))
    .sort((a, b) => b.rate - a.rate);

  return {
    firstBalls: first.length,
    strikes,
    strikeRate: Math.round((strikes / first.length) * 100),
    spareChances: leaves.length,
    sparesMade: converted,
    spareRate: leaves.length ? Math.round((converted / leaves.length) * 100) : null,
    splits,
    // Clean means struck or spared -- the frames that cost nothing.
    cleanRate: Math.round(((strikes + converted) / first.length) * 100),
    bestBall: balls.length > 1 ? balls[0] : null,
  };
}
