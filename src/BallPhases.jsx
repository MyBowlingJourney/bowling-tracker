import { C, S, F } from "./ui.jsx";
import {
  ballComparison, ballColors, ballByPhase, bestByPhase, GAME_PHASES,
} from "./domain/ballComparison.js";
import { isSplit, isCornerPinLeave } from "./domain/splits.js";
import { SAMPLE_THRESHOLDS } from "./domain/insightGating.js";

// Strike percentage by part of the night, ball against ball.
//
// Lifted out of the Ball path card, which had grown into two cards in
// one: a table of rates and a drawing of lines. They answer different
// questions -- "which ball is carrying right now" and "where am I
// throwing it" -- and the drawing had picked up a slider, a night picker
// and a pattern picker of its own, so the table was being scrolled past
// to reach the lane.
//
// It leads the Ball group because it is the question a bowler asks
// first: the lane diagram is how you act on the answer.

// Shots in ONE phase of the night before its rate is treated as settled.
// Lower than the whole-season bar: a phase is a third of a night by
// definition, so holding it to the season's sample would dash every cell
// for most of a season.
const PHASE_RELIABLE_AT = 10;

export default function BallPhases({
  shots = [], bowler = "", league = "", leftHanded = false,
  reliableAt = SAMPLE_THRESHOLDS.ballComparison,
}) {
  const comparison = ballComparison(shots, {
    bowler, league, isSplit, isCornerPinLeave, leftHanded, minShots: 0,
  });
  if (comparison.length < 2) return null;

  const colors = ballColors(comparison);
  const phases = ballByPhase(shots, {
    bowler, league, isSplit, isCornerPinLeave, leftHanded, minShots: 0,
  });
  if (!phases.length) return null;
  const bestPhase = bestByPhase(phases);

  return (
    <div style={S.card}>
      {/* Says STRIKE, in the title and again above the numbers.

          It was headed "Through the night" with three bare percentages
          under it, which could as easily have been spare conversion or
          clean frames. A column of numbers nobody can name is a column
          of numbers nobody uses. */}
      <div style={S.label}>Strike % through the night</div>
      <div style={{ fontSize: "11px", color: C.textMuted, marginBottom: "10px" }}>
        How each ball carried as the lanes went, first games to last.
      </div>

      <div style={{ display: "flex", fontSize: "11px", color: C.textMuted,
        marginBottom: "6px", alignItems: "baseline" }}>
        <span style={{ flex: 1, minWidth: 0 }}>Ball</span>
        {GAME_PHASES.map(p => (
          <span key={p.id} style={{ width: "62px", textAlign: "right" }}>{p.label}</span>
        ))}
      </div>

      {phases.map(b => (
        <div key={b.ball} style={{ display: "flex", alignItems: "center",
          fontSize: "13px", marginBottom: "6px" }}>
          <span style={{ flex: 1, minWidth: 0, display: "flex",
            alignItems: "center", gap: "6px", overflow: "hidden" }}>
            <span aria-hidden="true" style={{ width: "10px", height: "10px",
              borderRadius: "5px", backgroundColor: colors[b.ball], flexShrink: 0 }} />
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
                fontFamily: F.num, fontWeight: leads ? 700 : 400,
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

      <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "8px",
        lineHeight: 1.5 }}>
        Every number is a strike percentage. Bold leads that phase; nothing
        is bold when the gap is small enough to be chance. A rate in amber
        has fewer than {PHASE_RELIABLE_AT} shots behind it, so treat it as
        preliminary. A dash means no shots at all.
      </div>
    </div>
  );
}
