import { isPracticeLeagueName, isCasualLeagueName } from "../constants.js";

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
  const { bowler, leagues, since } = (opts && typeof opts === "object") ? opts : {};
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
    // believes. Tournaments stay: those are real competition.
    const lg = clean(s.league);
    if (isPracticeLeagueName(lg) || lg === "Practice") return false;
    if (isCasualLeagueName(lg)) return false;
    if (Array.isArray(leagues) && leagues.length
      && !leagues.map(clean).includes(clean(s.league))) return false;
    if (since && clean(s.date) < clean(since)) return false;
    return scoresOf(s).length > 0;
  });

  const games = inScope.flatMap(scoresOf);
  if (!games.length) {
    return { average: null, highGame: null, highSeries: null, games: 0 };
  }

  const seriesTotals = inScope
    .map(s => scoresOf(s))
    // A series is a full night, not a partial one -- a two-game night
    // would otherwise look like a poor three-game series.
    .filter(g => g.length >= 3)
    .map(g => g.reduce((a, b) => a + b, 0));

  return {
    average: Math.round((games.reduce((a, b) => a + b, 0) / games.length) * 10) / 10,
    highGame: Math.max(...games),
    highSeries: seriesTotals.length ? Math.max(...seriesTotals) : null,
    games: games.length,
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
