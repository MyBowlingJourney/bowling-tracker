// Grouping the stats screen.
//
// Thirty-seven cards in one column is a scroll, not a screen. A bowler
// looking for "which ball is carrying" should not pass their team's
// weekly points to get there.
//
// Five groups, named for the question being asked rather than the data
// underneath: what happened, how it is moving, and then the three things
// a bowler slices by -- ball, game, house.

export const STATS_GROUPS = [
  { id: "overview", label: "Overview" },
  { id: "trends", label: "Trends" },
  { id: "ball", label: "By Ball" },
  { id: "game", label: "By Game" },
  { id: "center", label: "By Center" },
];

export const STATS_GROUP_IDS = STATS_GROUPS.map(g => g.id);

// Which group each card belongs to.
//
// A card not listed here falls to Overview. That is deliberate: a new
// card should show up somewhere by default rather than vanish because
// nobody remembered to file it.
const GROUP_BY_CARD = {
  // How it is moving over time.
  runningAverages: "trends",
  progress: "trends",
  consistency: "trends",
  seasonCompare: "trends",
  theoreticalAverage: "trends",
  scoreDistribution: "trends",
  strikeStreak: "trends",

  // The ball in your hand.
  byBall: "ball",
  ballChangeTriggers: "ball",

  // Where in the night, and where in the frame.
  gameByGame: "game",
  framePosition: "game",
  weeklyPoints: "game",

  // The house and what it was dressed with.
  byCenter: "center",
  rackType: "center",
  patternHistory: "center",
};

export function groupForCard(id) {
  const key = String(id ?? "").trim();
  return GROUP_BY_CARD[key] || "overview";
}

// The cards for one group, in the bowler's own order.
//
// Order comes from the card order they arranged in Settings, so a group
// is a filter over that rather than a second ordering to keep in step.
export function cardsInGroup(order, group) {
  const want = STATS_GROUP_IDS.includes(group) ? group : "overview";
  return (Array.isArray(order) ? order : [])
    .filter(id => typeof id === "string" && id)
    .filter(id => groupForCard(id) === want);
}

// Groups that have something to show.
//
// A chip leading to an empty screen is worse than no chip: it reads as a
// screen that failed to load. `has` decides what actually rendered,
// which the caller knows and this module cannot.
export function visibleGroups(order, has) {
  const test = typeof has === "function" ? has : () => true;
  return STATS_GROUPS.filter(g => cardsInGroup(order, g.id).some(id => test(id)));
}
