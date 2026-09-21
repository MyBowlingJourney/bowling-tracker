import { isContainerLeague } from "./leagueMembership.js";
// The tours.
//
// Setup asks the two questions the app can't work without — your name and
// what you're bowling. What it can't do is explain what any of the six
// tabs are for, so a new bowler lands on a full app and discovers it by
// poking. That's the gap these fill.
//
// Steps are DATA rather than markup so the sequence can be tested and
// reordered without touching a component. Each step's `id` is also the
// key into TourScreen's SCREENS map, so a step with no matching mock
// renders its words and nothing else rather than breaking the tour.
//
// ── Rebuilt from scratch, and why ───────────────────────────────────────
//
// The previous tours were organised by MODE: casual, practice, league,
// tournament, coach, plus a "general" track. Two things were wrong with
// that.
//
// The renderings had gone stale. They drew a Vault tab that no longer
// exists and a nav of five tabs where the app has six. A tour is a
// promise about what the bowler will find, and a picture of a screen
// they will never see is worse than no picture at all.
//
// And mode was the wrong axis. Someone wanting to know how scoring works
// does not first ask themselves whether they are a league bowler; they
// ask how scoring works. The tracks below are the questions people
// actually arrive with, so a bowler picks the one they want rather than
// the one matching a setting they chose in onboarding.
//
// Mode-triggered tours are gone with it: nothing launches a walkthrough
// because someone tapped "Tournament".

const ALL_STEPS = [
  // ── Look around: the six tabs, one slide each ─────────────────────────
  //
  // Deliberately one slide per tab, in nav order. This track answers
  // exactly one question — "what is behind each of these?" — and the
  // fastest way to answer it is to go along the row.
  {
    id: "look-score",
    track: "look",
    tab: "log",
    title: "Keeping score",
    body: "Bowl is where a night gets logged. Enter three game scores, or go ball by ball and record every leave. Pick a mode from the rows on Home and you land here.",
  },
  {
    id: "look-gear",
    track: "look",
    tab: "gear",
    title: "Your gear",
    body: "Setup starts with your arsenal. On Balls, add a ball, record its layout, surface and specs, and on Bags sort them so tonight's four are one tap away.",
  },
  {
    id: "look-team",
    track: "look",
    tab: "team",
    title: "Leagues and teams",
    body: "Setup is also where a league gets set up, under League, and a roster filled in, under Team. Scores file against a league, so that's the one thing worth doing first — a team can wait until you want to compare.",
  },
  {
    id: "look-stats",
    track: "look",
    tab: "stats",
    title: "Stats and trends",
    body: "Stats breaks your bowling down by ball, by game, by center and by team. The Trends chip charts any of it over time, and the eye on any card hides it.",
  },
  {
    id: "look-journey",
    track: "look",
    tab: "home",
    title: "Your journey",
    body: "Your road so far: every first, dated, and how close you are to the next one — a few pins from a 700 series, say. Badges collect beside them.",
  },
  {
    id: "look-calendar",
    track: "look",
    tab: "history",
    title: "Calendar and journal",
    body: "History keeps every night you've bowled, on a calendar you can scroll back through. The journal holds all of your notes from every bowling session, gathered in one place and searchable.",
  },

  {
    // The closing card, and the only step that is not about a tab.
    //
    // A tour that simply stops leaves the bowler where the last slide
    // was, with no idea the other three exist. Naming where they live is
    // the difference between four tours and one tour plus three nobody
    // finds.
    id: "look-more",
    track: "look",
    tab: "home",
    title: "That's enough for now",
    body: "You know your way around. If you want more, there are three other tours waiting in the settings menu — keeping score, what the AI does, and stats.",
  },

  // ── Scorekeeping ──────────────────────────────────────────────────────
  //
  // Game-level first, then the three frame outcomes, then where a night
  // ends up. The order matters: a bowler who only ever wants to type
  // three numbers can stop after the first slide and has lost nothing.
  {
    id: "score-game",
    track: "score",
    tab: "log",
    title: "By game",
    body: "The quickest way in. Type the score for each game and you're done — three numbers, a night logged. Your average, highs and trends all work from this alone.",
  },
  {
    id: "score-strike",
    track: "score",
    tab: "log",
    title: "A strike",
    body: "Going ball by ball, tap Strike and the frame is finished — no pins to pick. Add how it hit if you want it: flush, high, light, a messenger, a Brooklyn.",
  },
  {
    id: "score-spare",
    track: "score",
    tab: "log",
    title: "A spare",
    body: "Tap the pins you left standing, then answer Spare Made. Yes closes the frame. The pins you tap are what feeds your leave and conversion numbers later.",
  },
  {
    id: "score-open",
    track: "score",
    tab: "log",
    title: "An open frame",
    body: "Same start — tap what was standing — then answer No, and tap which of those pins you knocked down. None of them? Just save. The app works out the count.",
  },
  {
    id: "score-results",
    track: "score",
    tab: "log",
    title: "How the night went",
    body: "The Results chip closes the session: games, series, how it compared to your average, and anything you won. Tap it when you're done and the night is filed.",
  },

  // ── AI ────────────────────────────────────────────────────────────────
  {
    id: "ai-import-shot",
    track: "ai",
    tab: "log",
    title: "Photograph the scorecard",
    body: "The camera icon at the top takes a picture of the monitor or a printed sheet. Every bowler on it, every frame it can read — no typing.",
  },
  {
    id: "ai-insights",
    track: "ai",
    tab: "improve",
    title: "Insights",
    body: "Improve reads your own history and tells you what it finds — which ball is carrying, where a spare is leaking, what changed this month. It stays quiet until it has enough shots to be sure.",
  },
  {
    id: "ai-nightcap",
    track: "ai",
    tab: "log",
    title: "The Nightcap",
    body: "On a league or tournament Results screen, the Nightcap reads your night back to you — where the leaves sat, what the opens cost, which ball was carrying. Log the night ball by ball and it pours itself once the night is saved.",
  },
  {
    id: "ai-brooklyn",
    track: "ai",
    tab: "improve",
    title: "Ask Brooklyn",
    body: "Brooklyn is the genie, and she has your whole history in front of her. Ask her anything about your bowling in plain words. Three wishes a day.",
  },

  // ── Stats ─────────────────────────────────────────────────────────────
  {
    id: "stats-breakdown",
    track: "stats",
    tab: "stats",
    title: "Break it down",
    body: "The chips across the top slice the same numbers different ways — yours, your team's, by ball, by game, by center.",
  },
  {
    id: "stats-compare",
    track: "stats",
    tab: "stats",
    title: "Compare",
    body: "Put yourself beside a teammate, or against the team as a whole. Same measures, same scale.",
  },
  {
    id: "stats-thresholds",
    track: "stats",
    tab: "stats",
    title: "When there isn't much data yet",
    body: "Nothing is locked — every card shows its numbers. But a number built on a handful of shots moves more with luck than with you, so until there's enough behind it the card is faded and says how many more shots it needs to be reliable.",
  },
  {
    id: "stats-trend",
    track: "stats",
    tab: "stats",
    title: "The trend graph",
    body: "Pick the measure, the ball and the league from the three dropdowns, then choose how far back to look — a number of games, a number of days, or two dates. Every game, or one point per night.",
  },
];

// ── Tracks ──────────────────────────────────────────────────────────────
//
// Topic, not mode. Every track is always available: someone who bowls
// league most weeks might still want the scoring walkthrough, and a
// casual bowler is as entitled to the stats one as anybody.
export const TOUR_TRACKS = [
  { key: "look",  label: "Look around",  blurb: "What's behind each tab" },
  { key: "score", label: "Keeping score", blurb: "By game, or ball by ball" },
  { key: "ai",    label: "What the AI does", blurb: "Scorecards, insights, Nightcap, Brooklyn" },
  { key: "stats", label: "Stats",         blurb: "Breakdowns, comparing, trends" },
];

export const TRACK_KEYS = TOUR_TRACKS.map(t => t.key);

// The tour offered to a bowler who has just finished setup.
export const FIRST_TOUR = "look";

export function availableTours() {
  return TOUR_TRACKS;
}

export function stepsForTrack(track) {
  return ALL_STEPS.filter(s => s.track === track);
}

// `= {}` only defaults an argument that is UNDEFINED. Passed null, or a
// number, destructuring throws on the parameter list itself -- before any
// guard in the body could run.
export function tourSteps(preferences = {}, opts = {}) {
  const o = (opts && typeof opts === "object" && !Array.isArray(opts)) ? opts : {};
  const { track, skipSeen = [] } = o;

  // An unknown track returns the first tour rather than nothing.
  //
  // Callers that predate the topic tracks pass "general", "league" or no
  // track at all, and a tour that opens empty looks like a broken button.
  const base = TRACK_KEYS.includes(track) ? stepsForTrack(track) : stepsForTrack(FIRST_TOUR);

  // Steps already seen are dropped, but never all of them: a track that
  // is entirely overlap still shows its first step rather than flashing
  // open and closed.
  if (!skipSeen?.length) return base;
  const seen = new Set(skipSeen);
  const trimmed = base.filter(s => !seen.has(s.id));
  return trimmed.length ? trimmed : base.slice(0, 1);
}

// Which step ids a bowler has already been shown.
export function stepsSeenFrom(seenSteps) {
  return Array.isArray(seenSteps) ? seenSteps : [];
}

export function recordStepsSeen(seenSteps, steps) {
  const set = new Set(stepsSeenFrom(seenSteps));
  for (const s of (Array.isArray(steps) ? steps : [])) set.add(s?.id);
  return [...set];
}

export function tourLength(preferences, opts) {
  return tourSteps(preferences, opts).length;
}

// Clamped rather than wrapped: running off either end of a tour should
// stop at the end, not silently loop a new bowler back to the start.
export function stepAt(preferences, index, opts) {
  const steps = tourSteps(preferences, opts);
  if (!steps.length) return null;
  const i = Math.max(0, Math.min(steps.length - 1, index));
  return steps[i];
}

export function isLastStep(preferences, index, opts) {
  return index >= tourSteps(preferences, opts).length - 1;
}

// ── Which tours has this bowler already seen? ───────────────────────────
//
// Stored as a list of track keys: "look", "score", "ai", "stats".
//
// Previously these were environment keys, so an existing bowler's stored
// list holds things like "league". Those simply never match a track key
// now, which means they are ignored rather than mistaken for a tour
// already watched -- the safe direction. The worst case is being offered
// the look-around tour once more.

export function hasSeenTour(seen, key) {
  return Array.isArray(seen) && seen.includes(key);
}

export function markTourSeen(seen, key) {
  const list = Array.isArray(seen) ? seen : [];
  return list.includes(key) ? list : [...list, key];
}

// Should we offer a tour right now?
//
// Only the look-around one, and only to someone who has never seen it.
// Deliberately an OFFER rather than a takeover: interrupting someone who
// opened the app to log a game is worse than letting them find the
// feature themselves. The other three are picked from Settings when the
// bowler wants them.
export function tourToOffer(options) {
  const { seen = [] } = (options && typeof options === "object" && !Array.isArray(options)) ? options : {};
  return hasSeenTour(seen, FIRST_TOUR) ? null : FIRST_TOUR;
}

// ── League setup ────────────────────────────────────────────────────────
//
// Choosing "league" with no league set up is a dead end: scores are filed
// against a league, so there's nowhere to put them. Rather than showing an
// empty screen, say so and offer to fix it.
export function needsLeagueSetup(options) {
  const { environment, leagues = [] } = (options && typeof options === "object" && !Array.isArray(options)) ? options : {};
  if (environment !== "league") return false;
  // "Casual" was the old name for the container; it is "Just Bowling"
  // now, so this filter had stopped excluding it.
  const realLeagues = (leagues || []).filter(l => l && !isContainerLeague(l));
  // A LEAGUE is required; a team is not.
  //
  // This used to return true when a league existed but no team did, and
  // LogView showed a setup card INSTEAD of the entry form. That was the
  // wall in Focus group Finding 2: 62% of new league bowlers hit it, and
  // 11 of 31 abandoned during team setup -- most at the roster screen,
  // asked for teammates' email addresses they did not have.
  //
  // Asking for a team is now a reminder AFTER a night is logged, not a
  // gate before one -- see domain/teamPrompt.js.
  return !realLeagues.length;
}
