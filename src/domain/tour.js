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
    body: "History keeps every night you've bowled, on a calendar you can scroll back through. The journal gathers every note you've written — on a shot, a drill, a pattern or the end of a night — and you can search them, or filter by kind and date range.",
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
    // Named rather than counted. "Three other tours" was already wrong
    // by the time a fourth was added, and a count is the part of a
    // sentence nobody remembers to update.
    body: "You know your way around. If you want more, the settings menu has the rest — keeping score, bowling a tournament, what the AI does, stats, and coaching.",
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

  // ── Tournaments ───────────────────────────────────────────────────────
  //
  // Its own track, because a tournament is the one thing in the app that
  // is genuinely several screens deep: an event is set up once, bowled
  // across blocks, and may then run into match play or a stepladder that
  // score nothing like qualifying does.
  //
  // In event order, which is also the order the tabs sit in. A bowler
  // entering a one-squad scratch tournament can stop after the second
  // slide and has lost nothing -- the later phases only exist for events
  // that actually have them.
  {
    id: "tourn-setup",
    track: "tournament",
    tab: "log",
    title: "Setting up an event",
    body: "Pick Tournament on Home and Set up asks what the event is: its name and center, then Style, Scoring and Format. Those three are separate questions, so any mix works — a Baker squad can be handicapped and 9 pin no-tap at once. A handicap event then asks for your pins per game.",
  },
  {
    id: "tourn-qualifying",
    track: "tournament",
    tab: "log",
    title: "Qualifying",
    body: "Add a block for each day or squad and they become tabs under Scoring. Enter the cut as it's posted — plus or minus against a 200 average — and the app tells you where you stand against it, carrying your earlier blocks in once there's more than one.",
  },
  {
    id: "tourn-cut",
    track: "tournament",
    tab: "log",
    title: "Making the cut",
    body: "The app never asks whether you made it: the margin already says. What it can't work out is what came next, so each block asks what you qualified for — match play, a stepladder, or neither — and gives you a button straight to it.",
  },
  {
    id: "tourn-match",
    track: "tournament",
    tab: "log",
    title: "Match play",
    body: "Each match is your score against an opponent's, with bonus pins for a win or a tie. Game numbering starts again at 1 here, so tracking frames in a match is a fresh slate rather than a continuation of qualifying. In a handicap event there's a box for your opponent's handicap too.",
  },
  {
    id: "tourn-stepladder",
    track: "tournament",
    tab: "log",
    title: "The stepladder",
    body: "Sudden death, so no bonus pins — the higher score advances. Enter your seed and each opponent's, and the app works out where you finished from how far you climbed. Beat the one seed and it says you won it.",
  },
  {
    id: "tourn-results",
    track: "tournament",
    tab: "log",
    title: "How the event went",
    body: "Results recaps the whole event broken out by phase, with your brackets and side pots and what they paid. End tournament and view results saves everything on its way there. The Nightcap reads the night back to you, and the share button hands the lot to whoever asks how you did.",
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
    body: "The Stats screens cover the usual numbers. Brooklyn is for the questions they don't answer — ask about your own bowling in plain words and she works it out from what you've logged. If it needs something you don't track yet, she'll say what to start logging. Tap the lamp at the top of any screen. Three wishes a day.",
  },

  // ── Coaching ──────────────────────────────────────────────────────────
  //
  // One track covering BOTH sides of the link, deliberately. The two
  // roles are the same screen with the View toggle flipped, and a bowler
  // whose coach just sent them a drill arrives wanting to know what to
  // do about it -- not to be told this tour was written for coaches.
  //
  // The link is directional, so the first slide is about establishing it
  // and everything after assumes it exists.
  {
    id: "coach-connect",
    track: "coach",
    tab: "improve",
    title: "Linking up",
    body: "Improve has a Coach button once you're coaching someone or being coached. Search for them by name, say which way round it goes — they coach me, or I coach them — and send the request. It starts working when they accept.",
  },
  {
    id: "coach-switch",
    track: "coach",
    tab: "improve",
    title: "Both sides, one screen",
    body: "If you do both, the View chips flip between them: I'm bowling shows what your own coach has sent you, I'm coaching shows your bowlers. A coach sees their pupils' scores without having to add them as a friend.",
  },
  {
    id: "coach-bowler",
    track: "coach",
    tab: "improve",
    title: "Reading a bowler",
    body: "Pick a bowler and you get their recent nights and how their shots break down — strikes, spares, the leaves that keep coming back — with the number of shots it's built on shown beside it, so you know how much to trust it.",
  },
  {
    id: "coach-task",
    track: "coach",
    tab: "improve",
    title: "Setting work",
    body: "A task is something to go and do, with an optional measurable target and a due date — convert 60% of your single-pin spares, say. Leave the target off for anything that isn't a number.",
  },
  {
    id: "coach-respond",
    track: "coach",
    tab: "improve",
    title: "Answering back",
    body: "The bowler marks it done, or records an attempt with the number they actually reached and a note about how it went. Either way it comes back to the coach, so the next thing you set is based on what happened rather than what was asked for.",
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
  { key: "tournament", label: "Bowling a tournament", blurb: "Blocks, the cut, match play, the ladder" },
  { key: "ai",    label: "What the AI does", blurb: "Scorecards, insights, Nightcap, Brooklyn" },
  { key: "stats", label: "Stats",         blurb: "Breakdowns, comparing, trends" },
  { key: "coach", label: "Coaching",      blurb: "Linking up, tasks, what comes back" },
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
