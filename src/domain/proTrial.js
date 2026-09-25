// The end of the 60-day Pro trial: what to say, and what they'd lose.
//
// A generic "upgrade to Pro" list is a list of features somebody may
// never have touched. This builds the ask out of the bowler's own
// sixty days instead -- the ball they've thrown most, the leagues they
// set up, the Nightcaps they've poured -- and lists ONLY the Pro things
// they actually used, each with the evidence. What they never used is
// not something they'd miss, so it isn't mentioned.
//
// Everything said here must be TRUE of Basic. Scores, spares, splits,
// each ball's own numbers, badges and the journey stay free; the lines
// below name only what Basic takes away (see entitlements.js).

import { FREE_LEAGUE_LIMIT, FREE_TEAM_LIMIT, FREE_BAGS_PER_TYPE } from "./entitlements.js";
import { isContainerLeague } from "./leagueMembership.js";

const clean = v => String(v ?? "").trim();
const rows = v => (Array.isArray(v) ? v : []).filter(x => x && typeof x === "object");
const count = v => (Number.isFinite(Number(v)) && Number(v) > 0 ? Math.round(Number(v)) : 0);

// The Pro things this bowler used, most valuable first. Each entry is
// { id, title, detail } -- detail carries their own numbers.
//
// ctx:
//   leagues        league names (containers are ignored)
//   teams          teams they are on
//   bags           [{ bagType }]
//   usage          { nightcap, genie, insights, caddie, import } call counts
//   ballFirstBalls { ball: first balls logged } -- ball comparison needs two
//   teammates      how many other bowlers share a team with them
//   friends        how many friends they have
//   centers        distinct houses bowled in
//   seasons        distinct seasons with games
//   sidePots       tournaments where brackets / side pots were entered
//   coaching       an active coach or bowler relationship
export function proLosses(ctx = {}) {
  const out = [];
  const leagues = (Array.isArray(ctx.leagues) ? ctx.leagues : []).map(clean).filter(n => n && !isContainerLeague(n));
  const u = ctx.usage || {};

  if (leagues.length > FREE_LEAGUE_LIMIT) {
    out.push({ id: "leagues", title: `All ${leagues.length} of your leagues`,
      detail: `Basic keeps ${FREE_LEAGUE_LIMIT} league active. The others are paused — nothing is deleted, and they come back when you do.` });
  }
  const teams = count(ctx.teams);
  if (teams > FREE_TEAM_LIMIT) {
    out.push({ id: "teams", title: `All ${teams} of your teams`, detail: `Basic keeps ${FREE_TEAM_LIMIT}.` });
  }
  const balls = Object.entries(ctx.ballFirstBalls || {}).filter(([, n]) => count(n) >= 10);
  if (balls.length >= 2) {
    out.push({ id: "ballCompare", title: "Ball against ball",
      detail: `Which of your ${balls.length} balls carries best, and how each one holds up from the first game to the last.` });
  }
  if (count(u.nightcap)) {
    const n = count(u.nightcap);
    out.push({ id: "nightcap", title: "The Nightcap", detail: n === 1
      ? "Your read-back after every night — you've poured one."
      : `Your read-back after every night — you've poured ${n}.` });
  }
  if (count(u.genie)) {
    out.push({ id: "genie", title: "Brooklyn", detail: `Answers about your own game — you've asked ${count(u.genie)} question${count(u.genie) === 1 ? "" : "s"}.` });
  }
  if (count(u.insights)) {
    out.push({ id: "insights", title: "Insights", detail: `The deep read of your game — you've run it ${count(u.insights)} time${count(u.insights) === 1 ? "" : "s"}.` });
  }
  if (count(u.caddie)) {
    out.push({ id: "caddie", title: "The Caddie", detail: `Your arsenal and bags, read ball by ball — ${count(u.caddie)} read${count(u.caddie) === 1 ? "" : "s"} so far.` });
  }
  if (count(u.import)) {
    out.push({ id: "import", title: "Scorecard import", detail: "A photo of the scorecard instead of typing every game." });
  }
  const bagsByType = {};
  for (const b of rows(ctx.bags)) {
    const t = clean(b.bagType) || "league";
    bagsByType[t] = (bagsByType[t] || 0) + 1;
  }
  const extraBags = Object.values(bagsByType).reduce((n, c) => n + Math.max(0, c - FREE_BAGS_PER_TYPE), 0);
  if (extraBags > 0) {
    const total = Object.values(bagsByType).reduce((a, b) => a + b, 0);
    out.push({ id: "bags", title: `All ${total} of your bags`, detail: `Basic keeps ${FREE_BAGS_PER_TYPE} league bag and ${FREE_BAGS_PER_TYPE} tournament bag.` });
  }
  if (count(ctx.teammates) || count(ctx.friends)) {
    out.push({ id: "headToHead", title: "Head to head",
      detail: count(ctx.teammates)
        ? "Your numbers against your teammates', and the team leaderboard."
        : "Comparing your numbers with your friends'." });
  }
  if (count(ctx.centers) >= 2) {
    out.push({ id: "byCenter", title: "House against house", detail: `How you score at each of the ${count(ctx.centers)} centers you've bowled.` });
  }
  if (count(ctx.seasons) >= 2) {
    out.push({ id: "seasonCompare", title: "This season against last", detail: "Your season side by side with the one before." });
  }
  if (count(ctx.sidePots)) {
    out.push({ id: "sidePots", title: "Brackets and side pots", detail: "Tracking what you put in and won at tournaments." });
  }
  if (ctx.coaching) {
    out.push({ id: "coaching", title: "Coaching", detail: "Your coach's tasks, notes and view of your numbers." });
  }
  return out;
}

// The headline: their strongest reason to stay, in their own numbers.
//
// topBall: { ball, games } -- the ball with the most games, or null.
// price: the monthly price as shown ("$4.99").
export function trialHeadline({ topBall, usage, leagues, games } = {}, price = "") {
  const per = price ? ` for ${price}/month` : "";
  const u = usage || {};
  const realLeagues = (Array.isArray(leagues) ? leagues : []).filter(n => clean(n) && !isContainerLeague(clean(n)));
  if (topBall && count(topBall.games) >= 3) {
    return {
      title: `You've logged ${count(topBall.games)} games with your ${clean(topBall.ball)}!`,
      body: `To keep seeing how it stacks up against the rest of your bag — which ball carries, and when — keep Pro${per}.`,
    };
  }
  if (count(u.nightcap) >= 2) {
    return {
      title: `You've poured ${count(u.nightcap)} Nightcaps!`,
      body: `To keep getting one after every night, keep Pro${per}.`,
    };
  }
  if (realLeagues.length > FREE_LEAGUE_LIMIT) {
    return {
      title: `You're tracking ${realLeagues.length} leagues!`,
      body: `To keep all of them active, keep Pro${per}.`,
    };
  }
  if (count(games) > 0) {
    return {
      title: `You've logged ${count(games)} games in your first 60 days!`,
      body: `To keep the comparisons and the AI reads of your game, keep Pro${per}.`,
    };
  }
  return {
    title: "Your 60 days of Pro are up.",
    body: `Keep everything unlocked${per}, or carry on with Basic — your scores and stats stay free.`,
  };
}

// What Basic keeps, said every time so dropping down is never a threat
// to their history.
export const BASIC_KEEPS = [
  "Every game, shot and night you've logged — nothing is deleted",
  "Your own stats: strikes, spares, splits, leaves and each ball's numbers",
  "One league, one team, a league bag and a tournament bag",
  "Badges, your journey and the calendar",
];
