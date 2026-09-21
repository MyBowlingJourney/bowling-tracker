import { isStk } from "./scoring.js";

import { isSplit } from "./splits.js";
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
// Each step carries the average a bowler is ROUGHLY at when they reach
// it. That is what the bands collapse on: a 200 bowler should not scroll
// past "Broke 75" to find their own history.
//
// Nothing above 180 is banded -- from there up, every milestone is worth
// its own line on anyone's timeline.
const GAME_STEPS = [
  [50, 100, "Broke 50"],
  [75, 100, "Broke 75"],
  [100, 100, "First 100 game"],
  [125, 130, "Broke 125"],
  [150, 150, "First 150 game"],
  [175, 180, "Broke 175"],
  [200, 180, "First 200 game"],
  [225, null, "Broke 225"],
  [250, null, "First 250 game"],
  [275, null, "Broke 275"],
  [300, null, "Perfect game"],
];

const SERIES_STEPS = [
  [200, 100, "First 200 series"],
  [300, 100, "First 300 series"],
  [400, 130, "First 400 series"],
  [500, 150, "First 500 series"],
  [600, 180, "First 600 series"],
  [700, null, "First 700 series"],
  [800, null, "First 800 series"],
];

// Nights bowled. Turning up is a milestone, and it is the only one
// available to a bowler having a bad season.
const NIGHT_STEPS = [
  [1, 100, "First night logged"],
  [5, 100, "Five nights in"],
  [10, 130, "Ten nights in"],
  [25, 150, "Twenty-five nights"],
  [50, 180, "Fifty nights"],
  [100, null, "A hundred nights"],
];

// FRAME-LEVEL milestones, from shots rather than session totals.
//
// A first strike and a first spare are the two biggest moments a new
// bowler has, and neither shows up in a score. A journey built only on
// game totals skips the whole first month of learning to bowl.
//
// At the other end, a four-bagger and a converted big four are frame
// events too -- they never appear as a distinct score.
const FRAME_STEPS = [
  { id: "first-strike", label: "First strike", band: 100,
    hit: sh => isStk(sh) },
  { id: "first-spare", label: "First spare", band: 100,
    hit: sh => clean(sh.spareMade) === "Yes" },
  { id: "first-double", label: "Two strikes in a row", band: 130,
    run: 2 },
  { id: "first-turkey", label: "First turkey", band: 150,
    run: 3 },
  { id: "first-four-bagger", label: "Four in a row", band: 180,
    run: 4 },
  { id: "first-five-bagger", label: "Five in a row", band: null,
    run: 5 },
  { id: "split-convert", label: "Converted a split", band: 150,
    hit: sh => clean(sh.spareMade) === "Yes" && isSplit(sh.otherLeave) },
  { id: "big-four", label: "Converted the big four", band: null,
    hit: sh => clean(sh.spareMade) === "Yes" && bigFour(sh.otherLeave) },
];

// 4-6-7-10, the one every bowler knows by name.
function bigFour(leave) {
  const pins = (Array.isArray(leave) ? leave : []).map(p => String(p));
  return ["4", "6", "7", "10"].every(p => pins.includes(p)) && pins.length === 4;
}

// The earliest date a shot satisfied `hit`.
function dateOfFirstShot(shots, hit) {
  let best = "";
  for (const sh of rows(shots)) {
    const d = clean(sh.date);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) continue;
    let ok = false;
    try { ok = !!hit(sh); } catch { ok = false; }
    if (!ok) continue;
    if (!best || d < best) best = d;
  }
  return best;
}

// The earliest date the bowler struck `run` times consecutively.
//
// Walked per game, in frame order, because a run does not cross games --
// the tenth of one game and the first of the next are not consecutive
// frames in any sense a bowler means.
function dateOfStrikeRun(shots, run) {
  const games = new Map();
  for (const sh of rows(shots)) {
    const d = clean(sh.date);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) continue;
    const key = `${clean(sh.bowler)}|${clean(sh.league)}|${d}|${clean(sh.game)}`;
    if (!games.has(key)) games.set(key, []);
    games.get(key).push(sh);
  }

  let best = "";
  for (const [key, list] of games) {
    const date = key.split("|")[2];
    const ordered = [...list].sort((a, b) =>
      (parseInt(a.frame) - parseInt(b.frame))
      || ((Number(a.ballNum) || 0) - (Number(b.ballNum) || 0)));
    let streak = 0;
    for (const sh of ordered) {
      if (isStk(sh)) {
        streak += 1;
        if (streak >= run) { if (!best || date < best) best = date; break; }
      } else {
        streak = 0;
      }
    }
  }
  return best;
}

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

// Every step on the road, earned or not, with its date if earned and the
// bowler's best so far. journeyMilestones keeps the earned ones;
// upcomingMilestones looks at the rest.
function journeySteps(sessions, tournaments, shots) {
  const ss = rows(sessions);
  const events = rows(tournaments).filter(t => clean(t.name));
  const cashed = events.filter(t => (num(t.winnings) || 0) > 0);

  const eventDate = t => clean(t?.days?.[0]?.date);
  const earliest = list => list.map(eventDate).filter(Boolean).sort()[0] || "";

  const all = [
    ...NIGHT_STEPS.map(([n, band, label]) => ({
      id: `nights-${n}`, label, band, kind: "count", target: n,
      date: dateAtCount(ss, n),
      best: ss.length,
    })),
    ...GAME_STEPS.map(([target, band, label]) => ({
      id: `game-${target}`, label, band, kind: "game", target,
      date: dateOfFirstGame(ss, target),
      best: bests(ss).game,
    })),
    ...SERIES_STEPS.map(([target, band, label]) => ({
      id: `series-${target}`, label, band, kind: "series", target,
      date: dateOfFirstSeries(ss, target),
      best: bests(ss).series,
    })),
    ...FRAME_STEPS.map(f => ({
      id: f.id, label: f.label, band: f.band, kind: "frame", target: 1,
      date: f.run ? dateOfStrikeRun(shots, f.run) : dateOfFirstShot(shots, f.hit),
      best: null,
    })),
    {
      id: "tourney-first", label: "First tournament", band: 130, kind: "count", target: 1,
      date: earliest(events), best: events.length,
    },
    {
      id: "tourney-cash", label: "First cash", band: 180, kind: "count", target: 1,
      date: earliest(cashed), best: cashed.length,
    },
  ];

  return all;
}

export function journeyMilestones(sessions, tournaments, shots) {
  const all = journeySteps(sessions, tournaments, shots);
  const earned = all.filter(m => m.date).map(m => ({ ...m, state: "earned" }));

  // Date order -- what actually happened, when. Ties break by the
  // catalogue order so one night that earned three milestones reads from
  // easiest to hardest rather than at random.
  const rank = new Map(all.map((m, i) => [m.id, i]));
  earned.sort((a, b) =>
    a.date.localeCompare(b.date) || rank.get(a.id) - rank.get(b.id));

  // EARNED ONLY. Nothing that has not happened yet.
  //
  // Showing the next target turned the timeline back into a ladder: it
  // put a locked node at the top of the road with a number attached, and
  // a bowler who is nowhere near it reads that as how far behind they
  // are.
  //
  // A timeline of a life does not end with what you have not done. The
  // view says "keep bowling" instead, which is true, encouraging, and
  // makes no claim about what should come next.
  return earned;
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

// BANDS: fold away the milestones a bowler is long past.
//
// A 200 average bowler has earned every step up to 180 and does not need
// to scroll through "Broke 75" to reach their own history. But deleting
// those entries would be worse -- they DID break 75, and on a date, and
// that is the point of a timeline.
//
// So they collapse. One line at the foot of the road saying "Milestones
// up to a 180 average", which opens to the next band down, and so on.
//
// A band folds only when the bowler is CLEARLY past it. Bowling at 182
// does not fold the 180 band -- they are still living in it, and folding
// the ground they are standing on is how a feature starts feeling like
// it is hiding things.
const BAND_CEILINGS = [100, 130, 150, 180];
const BAND_CLEAR = 15;

export function bandLabel(ceiling) {
  return `Milestones up to a ${ceiling} average`;
}

// Split a timeline into what stays open and what folds away.
//
// Returns { open, bands } -- `open` in date order as before, `bands`
// highest ceiling first, because the nearest history is the one most
// likely to be opened.
export function bandedJourney(milestones, average) {
  const all = rows(milestones);
  const avg = Number(average) || 0;

  // No average yet, or not clearly past the lowest band: nothing folds.
  // A new bowler should see their whole road.
  if (!avg) return { open: all, bands: [] };

  const folded = BAND_CEILINGS.filter(c => avg >= c + BAND_CLEAR);
  if (!folded.length) return { open: all, bands: [] };

  const highest = folded[folded.length - 1];

  // The most recent milestones ALWAYS stay open, whatever band they are
  // in.
  //
  // Without this a bowler whose every milestone falls in a folded band --
  // a 200 average with no 225 game yet -- opens their journey to an
  // empty map and a row of folded drawers. The recent history is the
  // part anyone actually wants to see.
  const KEEP_OPEN = 3;
  const earnedIds = all.filter(m => m.state === "earned").map(m => m.id);
  const alwaysOpen = new Set(earnedIds.slice(-KEEP_OPEN));

  const open = [];
  const byBand = new Map(folded.map(c => [c, []]));
  for (const m of all) {
    // Only EARNED milestones fold. The step ahead always stays in view;
    // it is the one thing on this screen that is about what comes next.
    const band = (m.state === "earned" && !alwaysOpen.has(m.id)) ? m.band : null;
    if (band && folded.includes(band)) byBand.get(band).push(m);
    else open.push(m);
  }

  const bands = folded
    .slice()
    .reverse()
    .map(c => ({ ceiling: c, label: bandLabel(c), milestones: byBand.get(c) || [] }))
    .filter(b => b.milestones.length);

  return { open, bands, highest };
}

// ── What the redesigned Journey screen adds ───────────────────────────

// The next step in each measurable line -- the lowest unearned night
// count, game and series -- closest first.
//
// Only ONE per line, and only the nearest one or two overall. The road
// used to show nothing ahead at all ("Keep bowling to see what's next"),
// deliberately, because a ladder of everything not yet done reads as a
// list of failures. One or two near goals read as the next stop.
//
// Frame milestones (first turkey, big four) have no "best so far" to
// measure, and a line with no progress yet is not near, so neither is
// offered.
export function upcomingMilestones(sessions, tournaments, shots, limit = 2) {
  const next = new Map();
  for (const m of journeySteps(sessions, tournaments, shots)) {
    if (m.date || m.kind === "frame") continue;
    const target = Number(m.target) || 0;
    const best = m.best === null || m.best === undefined ? null : Number(m.best);
    if (!target || best === null || !Number.isFinite(best) || best <= 0) continue;
    const line = String(m.id).split("-")[0];
    const have = next.get(line);
    if (!have || target < have.target) {
      next.set(line, { ...m, state: "next", best, progress: Math.min(1, best / target), remaining: Math.max(0, target - best) });
    }
  }
  return [...next.values()].sort((a, b) => b.progress - a.progress).slice(0, Math.max(0, limit));
}

// A plain sentence for an upcoming step. Numbers only from the step.
export function describeUpcoming(m) {
  if (!m || typeof m !== "object") return "";
  const r = Number(m.remaining) || 0;
  if (m.kind === "game") return `${r} pin${r === 1 ? "" : "s"} short · best ${m.best}`;
  if (m.kind === "series") return `${r} pin${r === 1 ? "" : "s"} short · best ${m.best}`;
  return `${m.best} of ${m.target}`;
}

// Lifetime numbers for the top of the screen: nights, games, every pin,
// and the date it started.
export function journeyTotals(sessions) {
  const ss = rows(sessions).filter(s => scoresOf(s).length);
  const scores = ss.flatMap(scoresOf);
  const dates = ss.map(dateOf).filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort();
  return {
    nights: ss.length,
    games: scores.length,
    pins: scores.reduce((a, b) => a + b, 0),
    since: dates[0] || "",
  };
}

// What sits inside a milestone's medallion. A number where there is one;
// a symbol a bowler reads at a glance otherwise. It used to print the
// milestone's target, so every "first" read "1" -- "Five in a row" in a
// circle marked 1.
const GLYPHS = {
  "first-strike": "X", "first-spare": "/", "first-double": "XX",
  "first-turkey": "\u{1F983}", "first-four-bagger": "4X", "first-five-bagger": "5X",
  "split-convert": "S/", "big-four": "B4",
  "tourney-first": "\u{1F3C6}", "tourney-cash": "$",
};
export function milestoneGlyph(m) {
  if (!m || typeof m !== "object") return "";
  if (GLYPHS[m.id]) return GLYPHS[m.id];
  return String(m.target ?? "");
}
