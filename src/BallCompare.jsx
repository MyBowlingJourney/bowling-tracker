import { C, S } from "./ui.jsx";
import {
  BALL_METRICS, ballComparison, bestByMetric, ballColors,
} from "./domain/ballComparison.js";
import { isSplit, isCornerPinLeave } from "./domain/splits.js";
import LanePane from "./lanePane.jsx";
import { SAMPLE_THRESHOLDS } from "./domain/insightGating.js";

// Comparing the arsenal.
//
// Two halves, because there are two different questions. The table
// answers "which ball is working"; the lane answers "and where am I
// throwing it". Neither is much use without the other -- a ball that
// carries best from a line you cannot repeat is not the answer.

// A NUMBER IS NEVER HIDDEN FOR BEING EARLY.
//
// This card used to drop any ball under `minShots` and then render
// nothing at all if fewer than two survived -- so a bowler with a new
// ball in the bag saw the whole comparison vanish, with no explanation
// and no way to tell whether it was broken or just waiting. Withholding
// a number the bowler can see on their own scoresheet does not protect
// them from it; it only makes the app look empty.
//
// So every ball is shown, and the thin ones are MARKED rather than
// removed. The threshold still does real work: it decides which balls
// may be declared a winner, because "your Zen Master carries best" drawn
// from nine shots is a claim, not a display.
//
// The AI gate is deliberately NOT relaxed with it. insightGating still
// withholds thin statistics from Brooklyn and from Insights, because a
// model handed a noisy number writes a confident story about it and the
// bowler cannot see the sample size behind the sentence. A human reading
// "31 of 50" can discount it themselves. That asymmetry is the point.
export default function BallCompare({
  shots = [], bowler = "", league = "", leftHanded = false,
  reliableAt = SAMPLE_THRESHOLDS.ballComparison,
  drift, lateralOffset, twoHanded = false, oilPatterns = [],
  lanePatterns = [], leaguePatterns = {},
  patternScores = [], overallAverage = null,
}) {
  // minShots 0: nothing is filtered out on the way in.
  const raw = ballComparison(shots, {
    bowler, league, isSplit, isCornerPinLeave, leftHanded, minShots: 0,
  });
  const comparison = raw.map(b => ({ ...b, provisional: b.shots < reliableAt }));
  if (comparison.length < 2) return null;

  // Only settled balls can win a metric. A provisional one still appears
  // in every row -- it just cannot be crowned.
  const settled = comparison.filter(b => !b.provisional);
  const best = settled.length >= 2 ? bestByMetric(settled) : {};

  const colors = ballColors(comparison);

  return (
    <div style={S.card}>
      <div style={S.label}>Ball path</div>
      <div style={{ fontSize: "11px", color: C.textMuted, marginBottom: "10px" }}>
        First balls at a full rack only {"—"} what a strike ball is for.
      </div>
      {/* Two tables used to sit here and both have gone.
      
          One showed the same numbers as the By Ball card below it, sorted
          the same way -- two places showing one thing is how they end up
          disagreeing, which they already had, over the leave average. The
          other was the strike percentages through the night, which is now
          its own card at the top of this group: it answers "which ball is
          carrying", and this card answers "where am I throwing it".
          
          What only this card can show is the lane. */}

      {/* The lane, in its own component.
      
          It owns the scrub position, which nights and which pattern --
          and therefore its own aggregation, because the lines it draws
          depend on all three. What it takes from here is the stable
          part: the colours and the full ball list, so a ball keeps its
          colour and keeps its row in the filter even at a moment in the
          block where it was never thrown. */}
      <LanePane shots={shots} bowler={bowler} league={league}
        leftHanded={leftHanded} colors={colors}
        allBalls={comparison.map(b => b.ball)}
        lanePatterns={lanePatterns}
        drift={drift} lateralOffset={lateralOffset} twoHanded={twoHanded}
        oilPatterns={oilPatterns}
        leaguePatterns={leaguePatterns}
        patternScores={patternScores} overallAverage={overallAverage} />
    </div>
  );
}
