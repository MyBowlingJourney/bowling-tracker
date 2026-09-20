// What a card needs before it can show you anything.
//
// A card with no data currently renders nothing at all, so a bowler
// looking at the Team chip sees four cards and has no idea that five more
// exist, or what they would take to unlock. An absent card is
// indistinguishable from a card that does not exist.
//
// So each one gets a line saying what it is and what would fill it. The
// hint is the ACTION, not the condition: "log three nights" rather than
// "needs three sessions", because the bowler has to do something.

export const CARD_HINTS = {
  // ── The match ──
  headToHead: "Compare yourself with a teammate. Log a night with more than one bowler.",
  teamRecords: "Your team's best games and series. Needs team-mates with logged scores.",
  seasonRecord: "Win-loss record. Record match results on a league night.",
  weeklyPoints: "Points won each week. Record match results on a league night.",
  handicapImpact: "How handicap changes results. Set a book average for the roster.",
  teamLeaderboard: "Team averages ranked. Add bowlers to your team.",
  giantKiller: "Wins against higher-average teams. Record match results.",
  hung: "Games decided by a handful of pins. Record match results.",
  teamSeries: "Team totals by night. Needs team-mates with logged scores.",

  // ── The house ──
  rackType: "Free fall against string pins. Set the rack type on two centers.",
  patternHistory: "Scores by oil pattern. Record the pattern when you start a night.",
  byCenter: "Averages by house. Bowl at more than one center.",

  // ── The ball ──
  ballPhases: "Strike percentage by part of the night, ball against ball. Log which ball you threw on each shot.",
  ballCompare: "Your line, drawn on the lane. Log start board and arrows on your shots.",
  byBall: "Each ball's numbers. Log which ball you threw on each shot.",
  ballChangeTriggers: "What makes you switch balls. Record a ball-change reason.",

  // ── The shot ──
  cleanFrames: "Frames without an open. Log a full night frame by frame.",
  framePosition: "How you bowl early against late in a game. Log shots by frame.",
  firstBallAverage: "Pins on the first ball. Log shots frame by frame.",
  tenPinLeaves: "How often the corner pin stands. Log your leaves.",
  singlePinSpares: "Single-pin conversion. Log your leaves and whether you made them.",
  splits: "Splits and conversions. Log your leaves.",
  loneFivePin: "The lone 5. Log your leaves.",
  nonSplitLeaves: "Makeable leaves you missed. Log your leaves.",
  strikeStreak: "Longest run of strikes. Log a full night frame by frame.",
  missDistribution: "Where your misses go. Record a miss direction on bad shots.",
  releaseQuality: "How your release holds up. Record release quality on your shots.",
  strikeQuality: "Flush against lucky strikes. Record how each strike carried.",

  // ── Over time ──
  runningAverages: "Your average as it moves. Log a few more nights.",
  theoreticalAverage: "What you would average with every spare. Log your leaves.",
  progress: "Where you are heading. Log a few more nights.",
  consistency: "How much your scores swing. Log a few more nights.",
  scoreDistribution: "The shape of your scores. Log a few more nights.",
  seasonCompare: "This season against last. Finish a season, then start another.",
  gameByGame: "First, second and third game. Log a few full nights.",

  // ── Money ──
  money: "What you won and paid in. Turn on money games and record a night.",
  threeSixNine: "3-6-9 and jackpot. Turn on money games and record a night.",

  headlineStats: "Your season at a glance. Log a night.",
};

// The hint for a card, or null when there is nothing useful to say.
//
// A card with no hint gets NO placeholder rather than a vague one: a line
// reading "no data yet" teaches less than the absence did, and costs a
// row of screen to say it.
export function cardHint(id) {
  const key = String(id ?? "").trim();
  return CARD_HINTS[key] || null;
}
