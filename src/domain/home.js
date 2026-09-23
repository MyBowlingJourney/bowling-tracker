import { isPracticeLeagueName, isCasualLeagueName, isTournamentLeagueName, isImportedLeagueName } from "../constants.js";

// What the home screen says, before anyone taps anything.
//
// The app opened on a setup form -- a question -- which is the wrong
// first thing to show someone who has already logged twenty nights. Home
// answers "how am I bowling?" and offers one action.
//
// Everything here is DERIVED from what is already stored. Home introduces
// no new data and no new truth: if a number differs from the Stats screen
// it is a bug, not a different view.

const rows = v => (Array.isArray(v) ? v : []).filter(x => x && typeof x === "object");

const clean = v => String(v ?? "").trim();

const num = v => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const scoresOf = s => (Array.isArray(s?.scores) ? s.scores : []).map(num).filter(v => v !== null);

// Is a night under way right now?
//
// Home becomes the scoring screen while one is, so this decides which of
// two entirely different screens a bowler sees on launch. It has to be
// conservative in both directions: showing the dashboard mid-game hides
// the thing they opened the app for, and showing scoring when there is no
// night is a dead screen with no way back.
//
// "Shots logged today under the current league" is the signal, because
// that is the same evidence the session recap and the calendar use. A
// session ROW is not required -- it is only written by "End session", so
// requiring one would mean Home never took over.
export function sessionIsLive(shots, opts) {
  // A default parameter only covers undefined. A caller reading these out
  // of component state hands over null long before it hands over nothing.
  const { bowler, league, date } = (opts && typeof opts === "object") ? opts : {};
  if (!clean(bowler) || !clean(league) || !clean(date)) return false;
  return rows(shots).some(s =>
    clean(s.bowler) === clean(bowler)
    && clean(s.league) === clean(league)
    && clean(s.date) === clean(date));
}

// The three numbers, for the CURRENT league season.
//
// Season-scoped rather than all-time on purpose: a bowler's high game
// from four years ago is a memory, not a standard they are measuring
// tonight against. All-time belongs on Journey, where it is a milestone.
//
// Returns nulls rather than zeroes when there is nothing yet. A zero
// average reads as terrible bowling; a blank reads as a new season.
export function seasonFigures(sessions, opts) {
  const { bowler, leagues, since, until } = (opts && typeof opts === "object") ? opts : {};
  const who = clean(bowler);
  const inScope = rows(sessions).filter(s => {
    if (who && clean(s.bowler) !== who) return false;
    // Practice and open bowling never count toward a season average.
    //
    // These are the headline figures a bowler quotes -- their average,
    // their high game, their high series -- and those mean league play.
    // A practice night spent working the 10 pin scores 120s by design,
    // and it was dragging the season average down as if it were a bad
    // league night.
    //
    // Filtered HERE rather than by whatever list the caller passes,
    // because "season figures" means league figures whatever the caller
    // believes.
    //
    // Tournaments are excluded too, though they ARE real bowling. A
    // tournament is a different discipline on a different pattern, and
    // averaging a scratch block into a house-shot season produces a
    // number that describes neither. They get their own card instead.
    const lg = clean(s.league);
    if (isPracticeLeagueName(lg) || lg === "Practice") return false;
    if (isCasualLeagueName(lg)) return false;
    if (isTournamentLeagueName(lg) || lg === "Tournament") return false;
    if (Array.isArray(leagues) && leagues.length
      && !leagues.map(clean).includes(clean(s.league))) return false;
    if (since && clean(s.date) < clean(since)) return false;
    // `until` closes the window at the other end, so a finished season
    // stays finished -- without it, "this season" quietly grew to mean
    // every league night ever bowled.
    if (until && clean(s.date) > clean(until)) return false;
    return scoresOf(s).length > 0;
  });

  const games = inScope.flatMap(scoresOf);
  if (!games.length) {
    return {
      average: null, highGame: null, highSeries: null, games: 0,
      highGameCount: 0, highSeriesCount: 0, nights: 0,
    };
  }

  const seriesTotals = inScope
    .map(s => scoresOf(s))
    // A series is a full night, not a partial one -- a two-game night
    // would otherwise look like a poor three-game series.
    .filter(g => g.length >= 3)
    .map(g => g.reduce((a, b) => a + b, 0));

  const highGame = Math.max(...games);
  const highSeries = seriesTotals.length ? Math.max(...seriesTotals) : null;

  return {
    average: Math.floor((games.reduce((a, b) => a + b, 0) / games.length) * 10) / 10,
    highGame,
    highSeries,
    games: games.length,
    nights: inScope.length,
    // How many times the CURRENT record has been matched.
    //
    // A tally of the top score only, not of good games: shoot a 279
    // three times and it reads 279 x3, but shoot a 280 afterwards and it
    // resets to 280 with no count, because the badge describes the
    // record standing right now. Counted from 2 up -- "x1" is just the
    // record, and saying it adds nothing.
    highGameCount: games.filter(v => v === highGame).length,
    // Series ties count the same way, over full nights only -- which is
    // already what highSeries itself means.
    highSeriesCount: highSeries == null
      ? 0
      : seriesTotals.filter(v => v === highSeries).length,
  };
}

// Which season window today falls in, across the leagues a bowler plays.
//
// leagueDates is { leagueName: { startDate, endDate } } -- the open season
// per league. A bowler can be in two leagues with different windows, so
// "in season" means today sits inside ANY of them, and the scope runs from
// the earliest of those starts.
//
// No dates configured anywhere means the app genuinely does not know when
// the season runs. Rather than label lifetime numbers "this season" -- the
// thing this whole change exists to stop -- that reads as career, and
// setting dates on a league upgrades it to a real season card.
export function activeSeasonWindow(leagueDates, opts) {
  const { leagues, today } = (opts && typeof opts === "object") ? opts : {};
  const now = clean(today);
  const dates = (leagueDates && typeof leagueDates === "object") ? leagueDates : {};
  const mine = Object.entries(dates)
    .filter(([name]) => !Array.isArray(leagues) || !leagues.length
      || leagues.map(clean).includes(clean(name)))
    .map(([name, v]) => ({ name, start: clean(v?.startDate), end: clean(v?.endDate) }))
    .filter(d => d.start);

  if (!mine.length) return { inSeason: false, configured: false, since: null, until: null, label: "" };

  const open = mine.filter(d => (!now || d.start <= now) && (!d.end || !now || now <= d.end));
  if (!open.length) return { inSeason: false, configured: true, since: null, until: null, label: "" };

  const since = open.map(d => d.start).sort()[0];
  return {
    inSeason: true,
    configured: true,
    since,
    until: null,
    label: open.length === 1 ? open[0].name : `${open.length} leagues`,
  };
}

// The one line of Journey worth putting on Home.
//
// The most recent earned milestone, because that is the thing a bowler
// wants to be reminded of -- not the next target, which turns a recap
// into a demand.
export function journeyRecap(milestones) {
  const earned = rows(milestones).filter(m => m.state === "earned" && clean(m.date));
  if (!earned.length) return null;
  const latest = earned.reduce((best, m) =>
    (!best || clean(m.date) > clean(best.date)) ? m : best, null);
  return { label: latest.label, date: latest.date, total: earned.length };
}

// The most recent tournament, if it was recent enough to still matter.
//
// Tournament scores are kept out of the season figures -- a scratch block
// on a different pattern is a different discipline, and averaging it into
// a house-shot season describes neither. But a block bowled last weekend
// is the thing a bowler most wants to see, so it gets its own card.
//
// Ten days, then it goes. A tournament from two months ago is history and
// belongs in History; leaving it on the front page makes the home screen
// a museum.
export const TOURNAMENT_CARD_DAYS = 10;

export function recentTournament(tournaments, { bowler, today, withinDays } = {}) {
  const who = clean(bowler);
  const limit = Number.isFinite(Number(withinDays)) ? Number(withinDays) : TOURNAMENT_CARD_DAYS;
  const now = clean(today);

  const mine = rows(tournaments).filter(t =>
    clean(t.name) && (!who || clean(t.bowler) === who));
  if (!mine.length) return null;

  // A tournament's date is the last day it was bowled: a two-day event
  // that finished yesterday is recent even though it started before the
  // window.
  const dated = mine.map(t => {
    const days = Array.isArray(t.days) ? t.days : [];
    const dates = days.map(d => clean(d && d.date)).filter(Boolean).sort();
    const games = days.flatMap(d => (Array.isArray(d && d.games) ? d.games : []))
      .map(g => Number(g && g.score !== undefined ? g.score : g))
      .filter(v => Number.isFinite(v) && v > 0);
    return { t, last: dates.length ? dates[dates.length - 1] : "", games };
  }).filter(x => x.last);
  if (!dated.length) return null;

  dated.sort((a, b) => (a.last < b.last ? 1 : -1));
  const best = dated[0];

  if (now) {
    const diff = Math.round(
      (Date.parse(`${now}T00:00:00`) - Date.parse(`${best.last}T00:00:00`)) / 86400000);
    // Future-dated events stay visible: an entry for next weekend is
    // something a bowler wants to see, not something to hide.
    if (Number.isFinite(diff) && diff > limit) return null;
  }

  const total = best.games.reduce((a, b) => a + b, 0);
  return {
    name: clean(best.t.name),
    center: clean(best.t.center),
    date: best.last,
    games: best.games.length,
    total: best.games.length ? total : null,
    average: best.games.length
      ? Math.round((total / best.games.length) * 10) / 10
      : null,
    best: best.games.length ? Math.max(...best.games) : null,
    placement: clean(best.t.placement),
    winnings: Number(best.t.winnings) || 0,
  };
}

// The bowler's most recent night, for the slim row under Home's mode cards.
//
// League, practice and tournament nights only. Open bowling is skipped:
// a past open bowling night has no results screen to open yet, and a row
// that goes nowhere is worse than no row.
//
// Tournaments come from their own records rather than session rows, since
// opening a tournament's results needs the tournament itself. A tournament
// day and a league night on the same date: the tournament wins, as the
// bigger event of the day.
//
// Returns null when there is nothing to show.
export function latestNight(sessions, tournaments, { bowler } = {}) {
  const who = clean(bowler);
  const avg = list => list.length
    ? Math.round((list.reduce((a, b) => a + b, 0) / list.length) * 10) / 10
    : null;

  const candidates = [];
  for (const s of rows(sessions)) {
    if (who && clean(s.bowler) !== who) continue;
    const league = clean(s.league);
    const date = clean(s.date);
    if (!league || !date) continue;
    if (isCasualLeagueName(league) || isTournamentLeagueName(league)) continue;
    if (isImportedLeagueName(league)) continue;
    const kind = isPracticeLeagueName(league) ? "practice" : "league";
    candidates.push({ kind, league, date, average: avg(scoresOf(s)), rank: 0 });
  }
  for (const t of rows(tournaments)) {
    if (!clean(t.name) || (who && clean(t.bowler) !== who)) continue;
    for (const d of Array.isArray(t.days) ? t.days : []) {
      const date = clean(d && d.date);
      if (!date) continue;
      const games = (Array.isArray(d.games) ? d.games : [])
        .map(g => Number(g && g.score !== undefined ? g.score : g))
        .filter(v => Number.isFinite(v) && v > 0);
      candidates.push({ kind: "tournament", league: clean(t.name), date,
        average: avg(games), tournament: t, rank: 1 });
    }
  }
  if (!candidates.length) return null;
  candidates.sort((a, b) => (a.date !== b.date ? (a.date < b.date ? 1 : -1) : b.rank - a.rank));
  const { rank, ...night } = candidates[0];
  return night;
}
