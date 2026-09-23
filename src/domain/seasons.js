// Seasons, and comparing one to another.
//
// SEASONS END ON THEIR END DATE. THEY DO NOT NEED CLOSING.
//
// An earlier version guessed boundaries from gaps in play. It was wrong
// in both directions -- two months off mid-season looked like two
// seasons, a summer league running on from a winter one looked like one
// -- and the bowler could see it was wrong with no way to correct it.
//
// A version after that added a "close season" button. Also wrong, for a
// quieter reason: it asked the bowler to do bookkeeping the app already
// had the answer to. A league has an end date. When that date passes,
// the season is over. Nobody needs to confirm it.
//
// So: a season runs from its start date to its end date. Once the end
// date is past, that season is finished. The next one begins when the
// bowler sets a new start date -- and the gap between them is the
// off-season, which is real and should not be papered over.
//
// THE ARCHIVE HAPPENS WHEN THE DATA WOULD OTHERWISE BE LOST.
//
// leagues.start_date and end_date describe one season. Setting a new
// start date overwrites them, and last season's boundaries would be
// gone. So that edit is the moment the old range gets archived -- not a
// button, not a schedule, just the one action that would otherwise
// destroy it.
//
// A CLOSED SEASON IS A DATE RANGE, NOT A TAG ON EACH NIGHT.
//
// Sessions are attributed by date. Closing works retroactively on nights
// already logged, needs no migration of existing rows, and cannot drift
// out of step with the boundaries the way a denormalised id would.

const num = v => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const rows = v => (Array.isArray(v) ? v : []).filter(x => x && typeof x === "object");

// Every season for a league, oldest first, with the open one last.
//
// `closed` are the archived ranges. `current` is the league's own
// startDate, which is where the open season begins.
export function seasonsForLeague(league, closed, current) {
  const mine = rows(closed)
    .filter(c => c.league === league && c.startDate && c.endDate)
    .slice()
    .sort((a, b) => String(a.startDate).localeCompare(String(b.startDate)))
    .map(c => ({
      league,
      startDate: c.startDate,
      endDate: c.endDate,
      closed: true,
      label: seasonLabel(c.startDate, c.endDate),
    }));

  // The current season is the league's own start/end dates -- not
  // derived from the archive.
  //
  // Ranges are NOT continuous now. A season ends on its end date and the
  // next begins on its own start date, and the gap between them is the
  // off-season. That is real: nobody bowls in July, and pretending the
  // season ran through it would put a two-month hole inside a season
  // rather than between two.
  const startDate = current?.startDate || "";
  if (startDate && !mine.some(c => c.startDate === startDate)) {
    const endDate = current?.endDate || "";
    mine.push({
      league,
      startDate,
      endDate,
      // Ended by its own date, not by anyone pressing anything.
      closed: !!endDate && seasonHasEnded(endDate, new Date().toISOString().slice(0, 10)),
      label: seasonLabel(startDate, endDate),
    });
  }
  return mine;
}

// "2024-25", or "2025-26" -- the bowling years, which is how bowlers
// name their own seasons. A season inside one calendar year is just
// "2025".
//
// Deliberately not "Sep 2024 - Apr 2025": that is four words to say what
// two digits say, and it is the range a bowler already knows. The point
// of the label is telling two seasons apart, not describing either.
export function seasonLabel(from, to) {
  const year = d => {
    const t = Date.parse(String(d) + "T12:00:00Z");
    return Number.isNaN(t) ? null : new Date(t).getUTCFullYear();
  };
  const a = year(from);
  if (a === null) return "";
  const b = year(to);
  if (b === null) return `${a}-`;          // open, end unknown
  if (a === b) return String(a);
  return `${a}-${String(b).slice(2)}`;
}

// Whether setting a new start date should archive the season it
// replaces, and what to archive.
//
// Called BEFORE the new start date is written. Returns null when there
// is nothing worth keeping -- no range yet, or the bowler is correcting
// a typo in the current season rather than starting a new one.
//
// The test for "new season" is that the new start date falls after the
// current end date. Editing the start date to something inside the
// current range is a correction, not a new season, and archiving it
// would create a phantom.
export function archiveOnNewStart(league, current, nextStartDate) {
  const startDate = current?.startDate || "";
  const endDate = current?.endDate || "";
  const next = String(nextStartDate || "").slice(0, 10);

  // Nothing to preserve.
  if (!startDate || !endDate) return null;
  if (!next) return null;

  // A correction inside the existing range, or a date before it.
  if (next <= endDate) return null;

  return { league, startDate, endDate, closedAt: new Date().toISOString() };
}

// Has this season finished? A season is over when its end date has
// passed -- no confirmation needed, the date already said so.
export function seasonHasEnded(endDate, today) {
  const end = String(endDate || "");
  if (!end) return false;
  const t = String(today || "").slice(0, 10);
  if (!t) return false;
  return end < t;
}

// Which season a date falls in. Null when it predates every season.
export function seasonForDate(date, seasons) {
  const d = String(date || "");
  if (!d) return null;
  for (const s of rows(seasons)) {
    if (d < String(s.startDate)) continue;
    if (s.endDate && d > String(s.endDate)) continue;
    return s;
  }
  return null;
}

// The figures worth comparing between two seasons.
//
// Scores only, deliberately. Shot-level stats depend on how diligently
// the bowler tracked that year, so a season where they logged frames
// would look transformed next to one where they logged scores -- an
// artefact of their habits, not their bowling.
export function seasonSummary(season, sessions, bowler) {
  const s = (season && typeof season === "object") ? season : null;
  if (!s) return null;

  const nights = rows(sessions).filter(n =>
    (!bowler || n.bowler === bowler)
    && n.league === s.league
    && n.date
    && String(n.date) >= String(s.startDate)
    && (!s.endDate || String(n.date) <= String(s.endDate)));

  const scores = nights
    .flatMap(n => (Array.isArray(n.scores) ? n.scores : []).map(num))
    .filter(v => v !== null);
  if (!scores.length) return null;

  const series = nights
    .map(n => (Array.isArray(n.scores) ? n.scores : []).map(num).filter(v => v !== null))
    .filter(g => g.length)
    .map(g => g.reduce((a, b) => a + b, 0));

  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const spread = Math.sqrt(scores.reduce((a, v) => a + (v - avg) ** 2, 0) / scores.length);

  // Labelled by the nights actually bowled, not the range boundary.
  //
  // Season ranges are continuous -- the open one starts the day after
  // the last close, so nothing can fall between two seasons. That is
  // right for attribution and wrong for a label: a season closed in
  // April reads "Apr - now" when the bowler did not touch a ball until
  // September. The dates below are the range; the label is what
  // happened.
  const dates = nights.map(n => String(n.date)).sort();
  const label = seasonLabel(dates[0], s.endDate || dates[dates.length - 1]);

  return {
    label: s.endDate ? label : `${label.split(" – ")[0]} – now`,
    league: s.league,

    from: s.startDate,
    to: s.endDate,
    closed: !!s.closed,
    nights: nights.length,
    games: scores.length,
    average: Math.floor(avg),
    highGame: Math.max(...scores),
    highSeries: series.length ? Math.max(...series) : null,
    // How steady, not how good. A bowler can raise their average and get
    // streakier at the same time, and that is worth seeing separately.
    spread: Math.round(spread),
    over200: scores.filter(v => v >= 200).length,
  };
}

// The open season against the one before it.
//
// Returns null rather than a comparison when there is only one season --
// "you have improved by 0" is worse than saying nothing.
export function compareSeasons(league, sessions, closed, current, bowler) {
  const seasons = seasonsForLeague(league, closed, current);
  if (seasons.length < 2) return null;

  const currentSummary = seasonSummary(seasons[seasons.length - 1], sessions, bowler);
  const previousSummary = seasonSummary(seasons[seasons.length - 2], sessions, bowler);
  if (!currentSummary || !previousSummary) return null;

  const delta = (a, b) => (a === null || b === null) ? null : a - b;

  return {
    current: currentSummary,
    previous: previousSummary,
    changes: {
      average: delta(currentSummary.average, previousSummary.average),
      highGame: delta(currentSummary.highGame, previousSummary.highGame),
      highSeries: delta(currentSummary.highSeries, previousSummary.highSeries),
      // Lower is steadier, so an improvement here is a NEGATIVE number.
      // Named so the UI cannot show a drop in consistency as a gain.
      spread: delta(currentSummary.spread, previousSummary.spread),
      over200: delta(currentSummary.over200, previousSummary.over200),
      games: delta(currentSummary.games, previousSummary.games),
    },
    // A short season is not a fair comparison, and the bowler should be
    // told rather than left to notice.
    thin: currentSummary.games < 12 || previousSummary.games < 12,
  };
}

// One honest sentence about the change.
//
// Deliberately not congratulatory. A bowler who dropped four pins does
// not want that dressed up, and one who gained four does not need it
// oversold -- four pins across a season is real but small.
export function describeSeasonChange(comparison) {
  const c = (comparison && typeof comparison === "object") ? comparison : null;
  if (!c || !c.changes) return "";

  const d = num(c.changes.average);
  if (d === null) return "";

  const games = `${c.current.games} games against ${c.previous.games}`;
  if (d === 0) return `Your average is the same as last season — ${games}.`;

  const dir = d > 0 ? "up" : "down";
  const pins = Math.abs(d);
  const sentence = `Your average is ${dir} ${pins} ${pins === 1 ? "pin" : "pins"} on last season — ${games}.`;

  return c.thin
    ? `${sentence} One of those seasons is short, so treat it lightly.`
    : sentence;
}

// Every season for a bowler in a league, newest first.
export function allSeasonSummaries(league, sessions, closed, current, bowler) {
  return seasonsForLeague(league, closed, current)
    .map(s => seasonSummary(s, sessions, bowler))
    .filter(Boolean)
    .reverse();
}
