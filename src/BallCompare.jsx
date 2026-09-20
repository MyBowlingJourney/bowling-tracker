import { C, S } from "./ui.jsx";
import {
  BALL_METRICS, ballComparison, bestByMetric, ballColors,
  ballByPhase, bestByPhase, GAME_PHASES,
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

// Shots in ONE phase of the night before its rate is treated as settled.
// Lower than the whole-season bar: a phase is a third of a night by
// definition, so holding it to the season's sample would dash every cell
// for most of a season.
const PHASE_RELIABLE_AT = 10;

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
  drift, lateralOffset, twoHanded = false, patternLength = null,
  lanePatterns = [],
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
  const anyProvisional = comparison.some(b => b.provisional);

  const colors = ballColors(comparison);
  const phases = ballByPhase(shots, {
    bowler, league, isSplit, isCornerPinLeave, leftHanded, minShots: 0,
  });
  const bestPhase = bestByPhase(phases);


  return (
    <div style={S.card}>
      <div style={S.label}>Ball path</div>
      <div style={{ fontSize: "11px", color: C.textMuted, marginBottom: "10px" }}>
        First balls at a full rack only {"—"} what a strike ball is for.
      </div>
      {anyProvisional && (
        <div style={{ fontSize: "11px", color: C.spare, marginBottom: "10px", lineHeight: 1.5 }}>
          A ball marked {"31/50"}-style has not been thrown enough yet. Its
          numbers are shown anyway, but treat them as preliminary {"—"} it is
          not named as leading anything until it gets there.
        </div>
      )}

      {/* Which ball, and when.
          
          A season average over every game answers none of the three
          questions a bowler actually asks -- what to throw on the fresh,
          through transition, and at the end when the heads are gone. It
          averages three different lane conditions into one number.
          
          A phase is scored exactly the way the season is: fresh racks
          only, same measures, the same function. No second
          implementation to drift out of step. */}
      {phases.length > 0 && (
        <>
          <div style={{ ...S.label, marginTop: "4px" }}>Through the night</div>
          <div style={{ display: "flex", fontSize: "11px", color: C.textMuted,
            marginBottom: "4px" }}>
            <span style={{ flex: 1, minWidth: 0 }} />
            {GAME_PHASES.map(p => (
              <span key={p.id} style={{ width: "62px", textAlign: "right" }}>{p.label}</span>
            ))}
          </div>
          {phases.map(b => (
            <div key={b.ball} style={{ display: "flex", alignItems: "center",
              fontSize: "13px", marginBottom: "6px" }}>
              <span style={{ flex: 1, minWidth: 0, display: "flex",
                alignItems: "center", gap: "6px", overflow: "hidden" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "5px",
                  backgroundColor: colors[b.ball], flexShrink: 0 }} />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis",
                  whiteSpace: "nowrap" }}>{b.ball}</span>
                {/* Said on the row itself, not in a footnote: the bowler
                    reading a 71% needs to know its sample while they are
                    looking at it. */}
                {(() => {
                  const c = comparison.find(x => x.ball === b.ball);
                  return c?.provisional ? (
                    <span style={{ fontSize: "10px", color: C.spare, flexShrink: 0 }}>
                      {c.shots}/{reliableAt}
                    </span>
                  ) : null;
                })()}
              </span>
              {GAME_PHASES.map(p => {
                const e = b.phases[p.id];
                const leads = bestPhase[p.id] === b.ball;
                // A rate exists or it does not. A dash means there is
                // NOTHING here; a thin phase shows its number in the
                // caution colour instead.
                //
                // This used to dash anything under ten shots, which threw
                // away a real number the bowler could not get any other
                // way -- the whole question this table answers is how the
                // early games differ from the late ones, and the fresh
                // rack is exactly where a bowler has the fewest shots.
                const rate = e && e.strikeRate !== null ? e.strikeRate : null;
                const thin = !!e && e.shots < PHASE_RELIABLE_AT;
                return (
                  <span key={p.id} style={{ width: "62px", textAlign: "right",
                    fontWeight: leads ? 700 : 400,
                    color: rate === null ? C.textMuted
                      : thin ? C.spare
                      : leads ? C.strike : C.text }}
                    title={rate !== null && thin
                      ? `${e.shots} shots — too few to rely on` : undefined}>
                    {rate === null ? "—" : `${rate}%`}
                  </span>
                );
              })}
            </div>
          ))}
          <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "2px",
            marginBottom: "14px", lineHeight: 1.5 }}>
            Strike rate by part of the night. Bold leads that phase; nothing
            is bold when the gap is small enough to be chance. A rate in
            amber has fewer than {PHASE_RELIABLE_AT} shots behind it, so treat
            it as preliminary. A dash means no shots at all.
          </div>
        </>
      )}

      {/* The table that was here is gone: it showed the same numbers as
          the By Ball card directly below, sorted the same way. Two places
          showing one thing is how they end up disagreeing -- which they
          already had, over the leave average.
          
          What only this card can show is the lane. */}

      {/* The lane. Same colours as the table, so a line is identified
          without a second legend to read. */}
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
        patternLength={patternLength} />
    </div>
  );
}
