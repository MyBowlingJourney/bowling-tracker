// My Journey: the milestones of a bowling life, in the order they come.
//
// A vertical path rather than a badge grid. The difference is that a path
// has a NEXT ONE -- the bowler can see what they are walking toward and
// how far off it is, which a wall of trophies cannot show.
//
// THREE STATES, AND WHY
//
//   earned    it happened, with the date it happened
//   reach     not yet, but close enough that this season could do it
//   locked    a long way off
//
// "reach" is the state that earns the feature. A 682 series next to a 700
// milestone reading "18 pins away" is the thing a bowler comes back for.
// Everything else on the path is context for that one line.
//
// WHAT IS NOT HERE
//
// No milestone invents a number the bowler did not bowl. Every threshold
// is a real bowling landmark -- 200 game, 600 series, 300 game, cashing
// an event -- not a synthetic level curve. A journey made of arbitrary
// XP thresholds is a progress bar wearing a costume.

const rows = v => (Array.isArray(v) ? v : []).filter(x => x && typeof x === "object");

const num = v => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const scoresOf = s => (Array.isArray(s?.scores) ? s.scores : []).map(num).filter(v => v !== null);

// The bowler's best single game, best series, and when each happened.
function bests(sessions) {
  let game = null, gameDate = "";
  let series = null, seriesDate = "";
  for (const s of rows(sessions)) {
    const sc = scoresOf(s);
    if (!sc.length) continue;
    const hi = Math.max(...sc);
    if (game === null || hi > game) { game = hi; gameDate = String(s.date || ""); }
    // A series is a night's total, and only counts as one at three games
    // or more -- a single 246 is a good game, not a 246 series.
    if (sc.length >= 3) {
      const tot = sc.reduce((a, b) => a + b, 0);
      if (series === null || tot > series) { series = tot; seriesDate = String(s.date || ""); }
    }
  }
  return { game, gameDate, series, seriesDate };
}

// The date a threshold was first crossed, so an earned milestone can say
// WHEN rather than just that it happened.
function firstDateAtOrAbove(sessions, pick, threshold) {
  const dated = rows(sessions)
    .map(s => ({ date: String(s.date || ""), value: pick(scoresOf(s)) }))
    .filter(r => r.value !== null && r.value >= threshold && r.date)
    .sort((a, b) => a.date.localeCompare(b.date));
  return dated.length ? dated[0].date : "";
}

const maxOf = sc => (sc.length ? Math.max(...sc) : null);
const seriesOf = sc => (sc.length >= 3 ? sc.reduce((a, b) => a + b, 0) : null);

// How close is close enough to call something "in reach"?
//
// Proportional, not a fixed pin count: 20 pins off a 700 series is a good
// night away, and 20 pins off a 300 game is not the same conversation.
// A tenth of the target, floored at 10 pins so small gaps still count.
function inReach(best, target) {
  if (best === null) return false;
  if (best >= target) return false;
  return (target - best) <= Math.max(10, Math.round(target * 0.1));
}

// The milestones, bottom of the path to the top.
//
// Order is deliberate and fixed -- a journey whose steps reorder
// themselves as you bowl is not a journey. Later entries are harder, so
// the path reads as progress even before any of it is earned.
// A TIMELINE, not a ladder.
//
// The first version listed targets in difficulty order with the earned
// ones ticked off. That reads as a goal progression -- and it tells a
// bowler who is not near the next target that they are behind.
//
// This reads as a history instead: what you have done, in the order you
// did it, each with its date. A twelve-year-old who has just broken 100
// and a scratch bowler chasing 800 both see the same thing -- their own
// road, as long as they have made it.
//
// Two consequences worth keeping:
//
//   ORDER IS BY DATE, not by difficulty. If someone bowled a 600 series
//   before their first 200 game, that is the order it happened and the
//   order it shows. A timeline that reorders itself is not a timeline.
//
//   ONLY THE NEXT ONE IS SHOWN AHEAD. A wall of locked achievements is
//   a scoreboard of everything you have not done. One next step is a
//   road; twenty is a judgement.
//
// STARTING POINTS DIFFER
//
// The catalogue runs from "logged a first game" to an 800 series, so a
// child's first spare and a league bowler's 300 are both on it. Nobody
// sees the whole list -- they see the part they have walked.

// Milestones in rough order of difficulty. This order only decides which
// unearned one is offered NEXT; earned ones sort by date.
//
// The low end matters as much as the high end. "First spare" is a real
// moment for a new bowler, and an app that starts its history at 200
// tells them their first season did not count.
const GAME_STEPS = [
  [50, "Broke 50"],
  [75, "Broke 75"],
  [100, "First 100 game"],
  [125, "Broke 125"],
  [150, "First 150 game"],
  [175, "Broke 175"],
  [200, "First 200 game"],
  [225, "Broke 225"],
  [250, "First 250 game"],
  [275, "Broke 275"],
  [300, "Perfect game"],
];

const SERIES_STEPS = [
  [200, "First 200 series"],
  [300, "First 300 series"],
  [400, "First 400 series"],
  [500, "First 500 series"],
  [600, "First 600 series"],
  [700, "First 700 series"],
  [800, "First 800 series"],
];

// Nights bowled. Turning up is a milestone, and it is the only one
// available to a bowler having a bad season.
const NIGHT_STEPS = [
  [1, "First night logged"],
  [5, "Five nights in"],
  [10, "Ten nights in"],
  [25, "Twenty-five nights"],
  [50, "Fifty nights"],
  [100, "A hundred nights"],
];

const clean = v => String(v ?? "").trim();

const dateOf = s => clean(s?.date);

// The date a running count first reached `target`, walking nights in the
// order they happened.
function dateAtCount(sessions, target) {
  const dated = rows(sessions)
    .filter(s => /^\d{4}-\d{2}-\d{2}$/.test(dateOf(s)))
    .sort((a, b) => dateOf(a).localeCompare(dateOf(b)));
  return dated.length >= target ? dateOf(dated[target - 1]) : "";
}

// The earliest date a single game reached `target`.
function dateOfFirstGame(sessions, target) {
  const hit = rows(sessions)
    .filter(s => scoresOf(s).some(v => v >= target))
    .sort((a, b) => dateOf(a).localeCompare(dateOf(b)))[0];
  return hit ? dateOf(hit) : "";
}

// The earliest date a SERIES reached `target`.
function dateOfFirstSeries(sessions, target) {
  const hit = rows(sessions)
    .map(s => ({ s, total: scoresOf(s).reduce((a, x) => a + x, 0) }))
    .filter(x => x.total >= target)
    .sort((a, b) => dateOf(a.s).localeCompare(dateOf(b.s)))[0];
  return hit ? dateOf(hit.s) : "";
}

export function journeyMilestones(sessions, tournaments) {
  const ss = rows(sessions);
  const events = rows(tournaments).filter(t => clean(t.name));
  const cashed = events.filter(t => (num(t.winnings) || 0) > 0);

  const eventDate = t => clean(t?.days?.[0]?.date);
  const earliest = list => list.map(eventDate).filter(Boolean).sort()[0] || "";

  const all = [
    ...NIGHT_STEPS.map(([n, label]) => ({
      id: `nights-${n}`, label, kind: "count", target: n,
      date: dateAtCount(ss, n),
      best: ss.length,
    })),
    ...GAME_STEPS.map(([target, label]) => ({
      id: `game-${target}`, label, kind: "game", target,
      date: dateOfFirstGame(ss, target),
      best: bests(ss).game,
    })),
    ...SERIES_STEPS.map(([target, label]) => ({
      id: `series-${target}`, label, kind: "series", target,
      date: dateOfFirstSeries(ss, target),
      best: bests(ss).series,
    })),
    {
      id: "tourney-first", label: "First tournament", kind: "count", target: 1,
      date: earliest(events), best: events.length,
    },
    {
      id: "tourney-cash", label: "First cash", kind: "count", target: 1,
      date: earliest(cashed), best: cashed.length,
    },
  ];

  const earned = all.filter(m => m.date).map(m => ({ ...m, state: "earned" }));

  // Date order -- what actually happened, when. Ties break by the
  // catalogue order so one night that earned three milestones reads from
  // easiest to hardest rather than at random.
  const rank = new Map(all.map((m, i) => [m.id, i]));
  earned.sort((a, b) =>
    a.date.localeCompare(b.date) || rank.get(a.id) - rank.get(b.id));

  // One step ahead: the first unearned milestone in catalogue order.
  // A wall of locked achievements is a list of everything you have not
  // done, which is the opposite of what this screen is for.
  const next = all.find(m => !m.date);
  const ahead = next
    ? [{ ...next, state: reachState(next), gap: gapFor(next) }]
    : [];

  return [...earned, ...ahead];
}

// Close enough to be worth naming a number, rather than a wall to stare
// at. Measured against the bowler's own best.
function reachState(m) {
  const best = Number(m.best) || 0;
  const target = Number(m.target) || 0;
  if (!target) return "locked";
  return best >= target * 0.9 ? "reach" : "locked";
}

function gapFor(m) {
  if (m.kind === "count") return null;
  const best = Number(m.best) || 0;
  const target = Number(m.target) || 0;
  const gap = target - best;
  return gap > 0 && best >= target * 0.9 ? gap : null;
}

export function describeMilestone(m) {
  if (!m || typeof m !== "object") return "";
  if (m.state === "earned") return m.date ? m.date : "Earned";
  if (m.kind === "count") {
    const have = num(m.best) || 0;
    return have >= m.target ? "Earned" : `${have} of ${m.target}`;
  }
  if (m.best === null) return "Not yet";
  if (m.state === "reach") return `${m.gap} pin${m.gap === 1 ? "" : "s"} away`;
  return `Best ${m.best}`;
}

// How far along, for the header.
//
// Counts EARNED against the whole catalogue, not against what is shown:
// the timeline only lists what happened plus one step ahead, so
// "3 of 4" would be meaningless.
export function journeyProgress(milestones) {
  const all = rows(milestones);
  return {
    earned: all.filter(m => m.state === "earned").length,
    total: all.length,
  };
}

// The one step ahead, if there is one.
export function nextMilestone(milestones) {
  return rows(milestones).find(m => m.state !== "earned") || null;
}
