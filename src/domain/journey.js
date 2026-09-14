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
export function journeyMilestones(sessions, tournaments) {
  const ss = rows(sessions);
  const b = bests(ss);
  const events = rows(tournaments);

  const cashed = events.filter(t => (num(t.winnings) || 0) > 0).length;
  const played = events.filter(t => String(t.name || "").trim()).length;

  const gameStep = (target, label) => ({
    id: `game-${target}`,
    label,
    kind: "game",
    target,
    best: b.game,
    date: firstDateAtOrAbove(ss, maxOf, target),
  });
  const seriesStep = (target, label) => ({
    id: `series-${target}`,
    label,
    kind: "series",
    target,
    best: b.series,
    date: firstDateAtOrAbove(ss, seriesOf, target),
  });

  const raw = [
    gameStep(200, "First 200 game"),
    seriesStep(500, "First 500 series"),
    gameStep(250, "First 250 game"),
    seriesStep(600, "First 600 series"),
    {
      id: "tourney-first", label: "Bowl a tournament", kind: "count",
      target: 1, best: played, date: "",
    },
    seriesStep(700, "First 700 series"),
    {
      id: "tourney-cash", label: "Cash in an event", kind: "count",
      target: 1, best: cashed, date: "",
    },
    gameStep(299, "A 299 game"),
    gameStep(300, "Perfect game"),
    seriesStep(800, "First 800 series"),
  ];

  return raw.map(m => {
    const earned = m.best !== null && m.best >= m.target;
    // Counts are not pins. "One tournament away" is a real statement
    // about a countable thing; running it through the pin-proportional
    // test gets the right answer for the wrong reason, and would get the
    // wrong one the moment a target above 1 is added.
    const close = m.kind === "count"
      ? (num(m.best) || 0) >= m.target - 1
      : inReach(m.best, m.target);
    return {
      ...m,
      state: earned ? "earned" : (close ? "reach" : "locked"),
      // Only meaningful while it is still ahead of them.
      gap: earned || m.best === null ? null : m.target - m.best,
    };
  });
}

// The one the bowler is walking toward: the nearest unearned step.
//
// Nearest by POSITION on the path, not by smallest gap. The path has an
// order and the next step is the next step -- jumping the bowler to a
// 300 game because they once shot 290 skips everything between.
export function nextMilestone(milestones) {
  return rows(milestones).find(m => m.state !== "earned") || null;
}

export function journeyProgress(milestones) {
  const all = rows(milestones);
  const earned = all.filter(m => m.state === "earned").length;
  return { earned, total: all.length };
}

// One line under a milestone.
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
