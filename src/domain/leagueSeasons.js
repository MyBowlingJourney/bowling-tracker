// League seasons.
//
// A league's start and end date live on the league itself -- shared across
// everyone in it, the same way a real season has one boundary for the
// whole house shot. Whether a given bowler has already been asked to
// update their book average for that season-end is personal, so THAT
// tracking (bookAverageAsOf) lives on the bowler's own profile, not here.
//
// The trigger question this module answers: "has a season this bowler
// hasn't been asked about yet already ended?" Not "is it currently the
// last day of the season" -- a bowler who doesn't open the app for two
// weeks after the season wraps should still see the prompt when they do.

export function normalizeLeagueDates(raw) {
  const start = typeof raw?.startDate === "string" ? raw.startDate : "";
  const end = typeof raw?.endDate === "string" ? raw.endDate : "";
  // An end date before its own start date isn't a season, it's a typo --
  // treat it as if no end date were set rather than trigger on nonsense.
  if (start && end && end < start) return { startDate: start, endDate: "" };
  return { startDate: start, endDate: end };
}

export function hasLeagueEnded(endDate, today) {
  // A date that cannot be parsed is not an ended league -- it is an
  // unknown one, and saying "ended" would hide a league from its bowler.
  if (Number.isNaN(new Date(endDate).getTime())) return false;
  if (!endDate) return false;
  // `today` is a parameter, so it can be anything. An unparseable value
  // threw "Invalid time value" on toISOString -- and a season-end check
  // failing loudly is worse than treating an unknown today as now.
  const t = today instanceof Date ? today : new Date(today);
  const todayStr = (Number.isNaN(t.getTime()) ? new Date() : t).toISOString().slice(0, 10);
  return endDate <= todayStr;
}

// Every league (from the set the bowler is in) whose season has already
// ended, sorted most-recently-ended first.
//
// `leaguesWithDates` is [{ name, endDate }] -- the caller assembles this
// from whichever leagues the bowler is actually in, since that membership
// lives elsewhere (teams) and this module doesn't need to know about it.
export function endedLeagues(leaguesWithDates, today = new Date()) {
  // Null elements and non-list arguments: both arrive from the cloud.
  leaguesWithDates = (Array.isArray(leaguesWithDates) ? leaguesWithDates : []).filter(x => x && typeof x === "object");
  leaguesWithDates = Array.isArray(leaguesWithDates) ? leaguesWithDates : [];
  return (leaguesWithDates || [])
    .filter(l => hasLeagueEnded(l.endDate, today))
    .sort((a, b) => b.endDate.localeCompare(a.endDate));
}

// Whether there's a season-end this bowler hasn't already been asked
// about. `bookAverageAsOf` is the end_date of the last season they WERE
// asked about (accepted, overrode, or dismissed) -- so a season they've
// already handled never re-prompts, but any later one still does.
export function needsBookAverageUpdate(leaguesWithDates, bookAverageAsOf, today = new Date()) {
  // Null elements and non-list arguments: both arrive from the cloud.
  leaguesWithDates = (Array.isArray(leaguesWithDates) ? leaguesWithDates : []).filter(x => x && typeof x === "object");
  leaguesWithDates = Array.isArray(leaguesWithDates) ? leaguesWithDates : [];
  const ended = endedLeagues(leaguesWithDates, today);
  if (!ended.length) return { needed: false, league: null };
  const mostRecent = ended[0];
  if (bookAverageAsOf && mostRecent.endDate <= bookAverageAsOf) {
    return { needed: false, league: null };
  }
  return { needed: true, league: mostRecent };
}

// League scoring format.
//
// Ten-pin is the default and always will be: a bowler who never touches
// this setting gets standard scoring, and no existing league changes
// meaning because a field was added.
//
// 9-pin no-tap is not a display preference -- it changes what a frame
// SCORES. A first ball leaving one pin counts as a strike, ends the
// frame, and no spare is attempted. So this has to be known wherever a
// game is scored, not just where it is shown.
export const LEAGUE_FORMATS = [
  { id: "tenpin", label: "10 pin", blurb: "Standard scoring." },
  { id: "notap9", label: "9 pin no-tap", blurb: "Nine on the first ball counts as a strike." },
];

export const LEAGUE_FORMAT_IDS = LEAGUE_FORMATS.map(f => f.id);

// Blank, unknown and missing all mean ten-pin. A league recorded before
// this existed was a ten-pin league, and guessing otherwise would
// silently rescore a bowler's history.
export function leagueFormat(format) {
  return format === "notap9" ? "notap9" : "tenpin";
}

export function isNoTapLeague(format) {
  return leagueFormat(format) === "notap9";
}

export function leagueFormatLabel(format) {
  return LEAGUE_FORMATS.find(f => f.id === leagueFormat(format))?.label || "10 pin";
}

// How many pins on the first ball count as a strike.
//
// Ten for standard, nine for no-tap. Returned as a number so the caller
// compares rather than branching on a format string, which is what keeps
// an 8-pin no-tap league from needing this logic rewritten.
export function strikePinThreshold(format) {
  return isNoTapLeague(format) ? 9 : 10;
}
