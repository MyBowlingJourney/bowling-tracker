import { C, S } from "./ui.jsx";
import {
  BALL_METRICS, ballComparison, bestByMetric, ballColors, ballLine,
  ARROWS_FEET, BREAKPOINT_FEET, FOUL_LINE_TO_PINS, catmullRomSegments,
  ballByPhase, bestByPhase, GAME_PHASES,
} from "./domain/ballComparison.js";
import { isSplit, isCornerPinLeave } from "./domain/splits.js";
import { SAMPLE_THRESHOLDS } from "./domain/insightGating.js";

// Comparing the arsenal.
//
// Two halves, because there are two different questions. The table
// answers "which ball is working"; the lane answers "and where am I
// throwing it". Neither is much use without the other -- a ball that
// carries best from a line you cannot repeat is not the answer.

const LANE_BOARDS = 39;

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

  const lines = comparison
    .map(b => ({ entry: b, line: ballLine(b, { drift, lateralOffset, twoHanded, patternLength }) }))
    .filter(x => x.line);

  // Lane geometry. Sixty feet deep, thirty-nine boards across, drawn
  // looking down the lane from the approach.
  // Proportions. A lane is 41.5 inches wide and sixty feet long -- 1:17.3,
  // which drawn honestly is a thread nobody can read on a phone. The
  // reference diagrams bowlers actually use compress it to about 1:5.
  //
  // 1:3 here, capped at 190px wide so the card comes out around 570px
  // tall. Still compressed, but the arrows now sit a quarter of the way
  // up rather than two-thirds, which is what made the old one wrong.
  //
  // Depth runs to 63ft: the headpin is at 60 and the rack sits BEHIND it.
  const W = 300, H = 900, PAD = 10;
  const DEPTH = 63;
  // Board 1 is the bowler's OWN gutter. For a right-hander that is the
  // right-hand side of the lane, so low boards belong on the RIGHT of the
  // screen -- drawn the other way round, a right-hander's ball swung out
  // to the left, which is backwards.
  //
  // This is the only place handedness is applied. ballLine used to mirror
  // as well, which flipped it twice and cancelled out.
  const x = board => {
    const frac = (board - 1) / (LANE_BOARDS - 1);
    return leftHanded
      ? PAD + frac * (W - PAD * 2)
      : (W - PAD) - frac * (W - PAD * 2);
  };
  // Down the lane is UP the screen: the bowler stands at the bottom and
  // the pins are at the far end. Drawn the other way it read as a ball
  // travelling towards you, which is nobody's view of a lane.
  const y = feet => (H - PAD) - (feet / DEPTH) * (H - PAD * 2);

  return (
    <div style={S.card}>
      <div style={S.label}>Ball path</div>
      <div style={{ fontSize: "11px", color: C.textMuted, marginBottom: "10px" }}>
        First balls at a full rack only {"—"} what a strike ball is for.
      </div>
      {anyProvisional && (
        <div style={{ fontSize: "11px", color: C.spare, marginBottom: "10px", lineHeight: 1.5 }}>
          A ball marked {"31/50"}-style has not been thrown enough yet. Its
          numbers are shown anyway and will move, and it is not named as
          leading anything until it gets there.
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
            amber has fewer than {PHASE_RELIABLE_AT} shots behind it and
            will move. A dash means no shots at all.
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
      {lines.length > 0 && (
        <>
          
          <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto",
            display: "block", marginBottom: "4px" }}>
            <rect x={PAD} y={PAD} width={W - PAD * 2} height={H - PAD * 2}
              fill={C.surface} stroke={C.border} />

            {/* The seven arrows, at fifteen feet. */}
            {[5, 10, 15, 20, 25, 30, 35].map(b => (
              <polygon key={b}
                points={`${x(b)},${y(ARROWS_FEET) - 9} ${x(b) - 4},${y(ARROWS_FEET) + 3} ${x(b) + 4},${y(ARROWS_FEET) + 3}`}
                fill={C.border} />
            ))}

            {/* Breakpoint depth, marked because it is the assumption. */}
            <line x1={PAD} y1={y(BREAKPOINT_FEET)} x2={W - PAD} y2={y(BREAKPOINT_FEET)}
              stroke={C.border} strokeDasharray="6 5" />
            <text x={W - PAD - 2} y={y(BREAKPOINT_FEET) - 6} textAnchor="end"
              fontSize="13" fill={C.textMuted}>breakpoint ~40ft</text>

            {/* The pocket. */}
            {/* The rack. The HEADPIN IS IN FRONT, nearest the bowler, with
                the rows behind it -- I had the four-pin back row closest,
                which is the rack upside down.
                
                Real geometry: pins are 12 inches apart, which is 11.3
                boards on a 41.5-inch lane, and the rows are 10.4 inches
                deep. Not a decorative triangle. */}
            {[[[20], 60], [[14.4, 25.6], 60.87], [[8.7, 20, 31.3], 61.73],
              [[3.1, 14.4, 25.6, 36.9], 62.6]].map(([boards, feet], r) => (
              boards.map((b, i) => (
                <circle key={`${r}-${i}`} cx={x(b)} cy={y(feet)} r="4.5"
                  fill={C.textMuted} opacity={r === 0 ? 1 : 0.65} />
              ))
            ))}

            {/* The foul line, just ahead of the feet. */}
            <line x1={PAD} y1={y(0)} x2={W - PAD} y2={y(0)} stroke={C.border} strokeWidth="1.5" />
            <text x={PAD + 2} y={y(0) - 6} fontSize="13" fill={C.textMuted}>foul line</text>

            {lines.map(({ entry, line }) => {
              const pts = line.points;
              // Two paths, not four straight segments. A ball does not
              // change direction at the arrows and again at the
              // breakpoint -- it runs fairly straight and then arcs.
              //
              // Solid to the arrows is what was logged; dashed past them
              // is projected, because nothing records where it turns.
              // Solid before the arrows, dashed after -- but BOTH come
              // from the same spline, so the join has no kink. Splitting
              // the points and curving each half separately gave two
              // curves that met at an angle.
              const segs = catmullRomSegments(pts);
              const draw = list => {
                if (!list.length) return "";
                let d = `M ${x(list[0].from.board)} ${y(list[0].from.feet)}`;
                for (const g of list) {
                  d += ` C ${x(g.c1.board)} ${y(g.c1.feet)},`
                    + ` ${x(g.c2.board)} ${y(g.c2.feet)},`
                    + ` ${x(g.to.board)} ${y(g.to.feet)}`;
                }
                return d;
              };
              const solid = segs.filter(g => g.to.feet <= ARROWS_FEET);
              const dashed = segs.filter(g => g.to.feet > ARROWS_FEET);
              return (
                <g key={entry.ball}>
                  <path fill="none" stroke={colors[entry.ball]} strokeWidth="4"
                    strokeLinecap="round" d={draw(solid)} />
                  <path fill="none" stroke={colors[entry.ball]} strokeWidth="4"
                    strokeLinecap="round" strokeDasharray="9 7" opacity="0.75"
                    d={draw(dashed)} />
                  {/* The feet, at the bottom where the bowler stands. */}
                  <circle cx={x(pts[0].board)} cy={y(0)} r="6"
                    fill={colors[entry.ball]} />
                </g>
              );
            })}
          </svg>
          <div style={{ fontSize: "11px", color: C.textMuted, lineHeight: 1.5 }}>
            Solid to the arrows is what you logged. Dashed past them is
            projected {"—"} nothing records where the ball actually turns.
          </div>
        </>
      )}
    </div>
  );
}
