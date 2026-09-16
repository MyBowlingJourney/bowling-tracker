// Insights from game scores alone.
//
// Everything Insights analysed was shot-derived, which quietly meant the
// tab was dead for anyone who tracks scores only -- 12/50 league bowlers
// and most of the casual group. They were not told this; they were shown
// "no single statistic has enough data", which reads as "not yet" when it
// actually meant "never".
//
// Game scores support real analysis. None of this needs a single logged
// shot:
//
//   - Game-position fade. A bowler who averages 195/190/165 is losing it
//     in the third game, and that is one of the most actionable things
//     you can tell someone. Needs only scores[].
//   - Consistency. 180/180/180 and 140/230/170 are the same average and
//     completely different bowlers. Spread is the thing a coach reacts to.
//   - Direction over time, which trends.js already computes.
//   - Form against the bowler's own book average.
//
// Same discipline as the shot-based gates: each figure carries its own
// sample size and is withheld until it has earned it. A "fade" measured
// over three nights is a story about noise.

// Sessions needed before each claim. Lower than the shot thresholds
// because a session average is already an aggregate of three games --
// the noise is pre-smoothed in a way a single first ball is not.
export const SCORE_THRESHOLDS = {
  // Nights before per-game-position averages are compared. Each night
  // contributes one observation per position, so 8 nights is 8 games in
  // each slot.
  gamePosition: 8,
  // Nights before spread/consistency is characterised.
  consistency: 6,
  // Nights before current form is set against book average.
  formVsBook: 6,
};

function scoresOf(session) {
  return Array.isArray(session?.scores) ? session.scores.filter(v => Number.isFinite(v)) : [];
}

function mean(values) {
  if (!values.length) return null;
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
}

// Population standard deviation. Population rather than sample because
// these are the games actually bowled, not a sample drawn from a larger
// set the bowler cares about.
function stdDev(values) {
  if (values.length < 2) return null;
  const m = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + (b - m) ** 2, 0) / values.length;
  return Math.round(Math.sqrt(variance) * 10) / 10;
}

// Average by position in the series -- game 1 vs 2 vs 3.
//
// Deliberately positional, not chronological across the night: a bowler
// who bowls a 4-game set has four positions, and blending position 4 into
// position 1 would hide exactly the fade this exists to find.
export function gamePositionAverages(sessions, bowler) {
  const mine = (Array.isArray(sessions) ? sessions : [])
    .filter(s => s && (bowler ? s.bowler === bowler : true));
  const byPosition = [];
  for (const s of mine) {
    scoresOf(s).forEach((score, i) => {
      (byPosition[i] = byPosition[i] || []).push(score);
    });
  }
  return byPosition.map((scores, i) => ({
    position: i + 1,
    average: mean(scores),
    games: scores.length,
  })).filter(p => p.games > 0);
}

// The drop (or climb) from the best position to the last one. Positive
// means they finish weaker than their best game slot.
export function positionFade(sessions, bowler) {
  const positions = gamePositionAverages(sessions, bowler);
  if (positions.length < 2) return null;
  const last = positions[positions.length - 1];
  const best = positions.reduce((a, b) => (b.average > a.average ? b : a));
  if (best.position === last.position) return { fade: 0, bestPosition: best.position, lastPosition: last.position, positions };
  return {
    fade: Math.round((best.average - last.average) * 10) / 10,
    bestPosition: best.position,
    lastPosition: last.position,
    positions,
  };
}

// Spread within a night and across nights. Two different kinds of
// inconsistency: the bowler who is erratic game to game, and the bowler
// who is steady on the night but unpredictable week to week.
export function consistency(sessions, bowler) {
  const mine = (Array.isArray(sessions) ? sessions : [])
    .filter(s => s && (bowler ? s.bowler === bowler : true) && scoresOf(s).length >= 2);
  if (!mine.length) return null;

  const withinNight = mine
    .map(s => stdDev(scoresOf(s)))
    .filter(v => v !== null);
  const nightAverages = mine.map(s => mean(scoresOf(s))).filter(v => v !== null);

  return {
    nights: mine.length,
    // Typical game-to-game swing inside a single night.
    withinNight: mean(withinNight),
    // Night-to-night swing of the nightly average.
    betweenNights: stdDev(nightAverages),
    highGame: Math.max(...mine.flatMap(scoresOf)),
    lowGame: Math.min(...mine.flatMap(scoresOf)),
  };
}

// Current form against the bowler's own frozen book average -- the
// comparison they actually care about, and one the app already has the
// number for.
export function formVsBook(sessions, bowler, bookAverage) {
  const book = Number(bookAverage);
  if (!Number.isFinite(book) || book <= 0) return null;
  const mine = (Array.isArray(sessions) ? sessions : [])
    .filter(s => s && (bowler ? s.bowler === bowler : true));
  const recent = mine.slice(-8);
  const games = recent.flatMap(scoresOf);
  if (!games.length) return null;
  const current = mean(games);
  return {
    book: Math.floor(book),
    current,
    diff: Math.round((current - book) * 10) / 10,
    nights: recent.length,
    games: games.length,
  };
}

// Everything the score-only path can offer, with sample sizes attached so
// the gating layer can withhold what has not earned its place.
export function scoreStats(sessions, bowler, bookAverage) {
  const mine = (Array.isArray(sessions) ? sessions : [])
    .filter(s => s && (bowler ? s.bowler === bowler : true));
  const nights = mine.length;

  const fade = positionFade(sessions, bowler);
  const cons = consistency(sessions, bowler);
  const form = formVsBook(sessions, bowler, bookAverage);

  return {
    nights,
    gamePosition: fade ? { ...fade, sampleSize: nights } : null,
    consistency: cons ? { ...cons, sampleSize: cons.nights } : null,
    formVsBook: form ? { ...form, sampleSize: form.nights } : null,
  };
}

// This season against last, for one league.
//
// The "This Season vs Last" card has been listed in Settings -- movable,
// hideable, sitting in the default order -- while nothing rendered it.
// A bowler could reorder a card that did not exist.
//
// Seasons are bounded by the league's own startDate. Everything on or
// after it is this season; the year before that is last season. That is a
// simplification -- a league that ran ten months has a two-month gap
// nobody bowled in -- but it never misattributes a night, which matters
// more than tidiness at the edges.
//
// Returns null when there is nothing to compare against. A card that says
// "no data for last season" is worse than a card that is not there.
export function seasonComparison(sessions, opts) {
  // A default parameter only covers undefined, not null. Sixth module to
  // hit this; the pattern never varies.
  const { bowler, league, seasonStart } = (opts && typeof opts === "object") ? opts : {};
  const clean = v => String(v ?? "").trim();
  const who = clean(bowler);
  const lg = clean(league);
  const start = clean(seasonStart);
  if (!start) return null;

  const scoresOf = s => (Array.isArray(s?.scores) ? s.scores : [])
    .map(Number).filter(v => Number.isFinite(v) && v > 0);

  const mine = (Array.isArray(sessions) ? sessions : []).filter(s =>
    s && typeof s === "object"
    && (!who || clean(s.bowler) === who)
    && (!lg || clean(s.league) === lg)
    && scoresOf(s).length > 0);

  // A year back from the season start, to the day before it.
  const prevStart = (() => {
    const d = new Date(`${start}T00:00:00`);
    if (Number.isNaN(d.getTime())) return "";
    d.setFullYear(d.getFullYear() - 1);
    return d.toISOString().slice(0, 10);
  })();
  if (!prevStart) return null;

  const figures = rows => {
    const games = rows.flatMap(scoresOf);
    if (!games.length) return null;
    const total = games.reduce((a, b) => a + b, 0);
    const series = rows.map(scoresOf).filter(g => g.length >= 3)
      .map(g => g.reduce((a, b) => a + b, 0));
    return {
      games: games.length,
      average: Math.round((total / games.length) * 10) / 10,
      highGame: Math.max(...games),
      highSeries: series.length ? Math.max(...series) : null,
    };
  };

  const current = figures(mine.filter(s => clean(s.date) >= start));
  const previous = figures(mine.filter(s => {
    const d = clean(s.date);
    return d >= prevStart && d < start;
  }));

  // Nothing to compare against is not a comparison.
  if (!current || !previous) return null;

  return {
    current,
    previous,
    // Signed, so the view does not have to work out which way is better.
    averageChange: Math.round((current.average - previous.average) * 10) / 10,
  };
}
