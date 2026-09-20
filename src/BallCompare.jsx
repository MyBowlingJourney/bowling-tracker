import { C, S } from "./ui.jsx";
import { ballComparison, ballColors } from "./domain/ballComparison.js";
import { isSplit, isCornerPinLeave } from "./domain/splits.js";
import LanePane from "./lanePane.jsx";

// Where the arsenal is being thrown.
//
// This card once had two halves -- a table answering "which ball is
// working", and the lane answering "and where am I throwing it". The
// table is gone: By Ball reports each ball's own numbers, and does it
// SORTABLY, which is the better answer to "which is best" than crowning
// one. Which ball is best depends on what is being asked, and the one
// that carries is not always the one that keeps you out of splits.
//
// What only this card can show is the lane.
//
// A NUMBER IS NEVER HIDDEN FOR BEING EARLY.
//
// minShots 0: nothing is filtered out on the way in. This card used to
// drop any ball under a threshold and then render nothing at all if
// fewer than two survived -- so a bowler with a new ball in the bag saw
// the whole comparison vanish, with no way to tell whether it was broken
// or just waiting. Withholding a number the bowler can see on their own
// scoresheet does not protect them from it; it only makes the app look
// empty.
//
// The thin-sample MARKING went with the table that carried it: there is
// no column here to mark, and every line the lane draws is labelled with
// the shot count behind it in the ball filter.
//
// The AI gate is deliberately NOT relaxed to match. insightGating still
// withholds thin statistics from Brooklyn and from Insights, because a
// model handed a noisy number writes a confident story about it and the
// bowler cannot see the sample size behind the sentence. A human reading
// "31 of 50" can discount it themselves. That asymmetry is the point.
export default function BallCompare({
  shots = [], bowler = "", league = "", leftHanded = false,
  drift, lateralOffset, twoHanded = false, oilPatterns = [],
  lanePatterns = [], leaguePatterns = {},
  patternScores = [], overallAverage = null,
}) {
  const comparison = ballComparison(shots, {
    bowler, league, isSplit, isCornerPinLeave, leftHanded, minShots: 0,
  });
  if (comparison.length < 2) return null;

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
