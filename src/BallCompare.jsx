import { C, S } from "./ui.jsx";
import {
  BALL_METRICS, ballComparison, bestByMetric, ballColors, ballLine,
  ARROWS_FEET, BREAKPOINT_FEET, FOUL_LINE_TO_PINS, trajectoryPath,
} from "./domain/ballComparison.js";
import { isSplit, isCornerPinLeave } from "./domain/splits.js";

// Comparing the arsenal.
//
// Two halves, because there are two different questions. The table
// answers "which ball is working"; the lane answers "and where am I
// throwing it". Neither is much use without the other -- a ball that
// carries best from a line you cannot repeat is not the answer.

const LANE_BOARDS = 39;

export default function BallCompare({
  shots = [], bowler = "", league = "", leftHanded = false, minShots = 25,
}) {
  const comparison = ballComparison(shots, {
    bowler, league, isSplit, isCornerPinLeave, leftHanded, minShots,
  });
  if (comparison.length < 2) return null;

  const best = bestByMetric(comparison);
  const colors = ballColors(comparison);
  const lines = comparison
    .map(b => ({ entry: b, line: ballLine(b, { leftHanded }) }))
    .filter(x => x.line);

  // Lane geometry. Sixty feet deep, thirty-nine boards across, drawn
  // looking down the lane from the approach.
  const W = 300, H = 210, PAD = 8;
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
  const y = feet => (H - PAD) - (feet / FOUL_LINE_TO_PINS) * (H - PAD * 2);

  return (
    <div style={S.card}>
      <div style={S.label}>Ball vs Ball</div>
      <div style={{ fontSize: "11px", color: C.textMuted, marginBottom: "10px" }}>
        First balls at a full rack only {"—"} what a strike ball is for.
      </div>

      {/* The table. Every measure at once, because "which ball is best"
          has four different answers and a bowler needs to see the trade:
          the ball that carries may also be the one leaving splits. */}
      <div style={{ display: "flex", fontSize: "11px", color: C.textMuted,
        marginBottom: "4px" }}>
        <span style={{ flex: 1, minWidth: 0 }} />
        {BALL_METRICS.map(m => (
          <span key={m.id} style={{ width: "58px", textAlign: "right" }}>{m.label}</span>
        ))}
      </div>

      {comparison.map(b => (
        <div key={b.ball} style={{ display: "flex", alignItems: "center",
          fontSize: "13px", marginBottom: "6px" }}>
          <span style={{ flex: 1, minWidth: 0, display: "flex",
            alignItems: "center", gap: "6px", overflow: "hidden" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "5px",
              backgroundColor: colors[b.ball], flexShrink: 0 }} />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis",
              whiteSpace: "nowrap" }}>{b.ball}</span>
          </span>
          {BALL_METRICS.map(m => {
            const v = b[m.id];
            // Bold marks the leader on that measure. bestByMetric returns
            // null on a near-tie, so nothing is marked when nothing is
            // genuinely ahead.
            const leads = best[m.id] === b.ball;
            return (
              <span key={m.id} style={{ width: "58px", textAlign: "right",
                fontWeight: leads ? 700 : 400,
                color: leads ? C.strike : C.text }}>
                {v === null || v === undefined ? "—" : `${v}${m.unit}`}
              </span>
            );
          })}
        </div>
      ))}

      <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "2px" }}>
        {comparison.map(b => `${b.ball} ${b.shots}`).join(" · ")} shots
      </div>

      {/* The lane. Same colours as the table, so a line is identified
          without a second legend to read. */}
      {lines.length > 0 && (
        <>
          <div style={{ ...S.label, marginTop: "14px" }}>Where you throw them</div>
          <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto",
            display: "block", marginBottom: "4px" }}>
            <rect x={PAD} y={PAD} width={W - PAD * 2} height={H - PAD * 2}
              fill={C.surface} stroke={C.border} />

            {/* The seven arrows, at fifteen feet. */}
            {[5, 10, 15, 20, 25, 30, 35].map(b => (
              <polygon key={b}
                points={`${x(b)},${y(ARROWS_FEET) - 5} ${x(b) - 3},${y(ARROWS_FEET) + 2} ${x(b) + 3},${y(ARROWS_FEET) + 2}`}
                fill={C.border} />
            ))}

            {/* Breakpoint depth, marked because it is the assumption. */}
            <line x1={PAD} y1={y(BREAKPOINT_FEET)} x2={W - PAD} y2={y(BREAKPOINT_FEET)}
              stroke={C.border} strokeDasharray="3 3" />
            <text x={W - PAD - 2} y={y(BREAKPOINT_FEET) - 3} textAnchor="end"
              fontSize="8" fill={C.textMuted}>breakpoint ~40ft</text>

            {/* The pocket. */}
            {/* The rack, at the top where the pins are. Ten dots in the
                real triangle rather than one blob, so the far end of the
                lane reads as pins. */}
            {[[17.5, 60], [15.5, 58], [19.5, 58], [13.5, 56], [17.5, 56],
              [21.5, 56], [11.5, 54], [15.5, 54], [19.5, 54], [23.5, 54]].map(([b, f], i) => (
              <circle key={i} cx={x(b)} cy={y(f)} r="2" fill={C.textMuted} opacity="0.8" />
            ))}

            {/* The foul line, just ahead of the feet. */}
            <line x1={PAD} y1={y(0)} x2={W - PAD} y2={y(0)} stroke={C.border} strokeWidth="1.5" />
            <text x={PAD + 2} y={y(0) - 3} fontSize="8" fill={C.textMuted}>foul line</text>

            {lines.map(({ entry, line }) => {
              const pts = line.points;
              // Two paths, not four straight segments. A ball does not
              // change direction at the arrows and again at the
              // breakpoint -- it runs fairly straight and then arcs.
              //
              // Solid to the arrows is what was logged; dashed past them
              // is projected, because nothing records where it turns.
              const known = pts.filter(p => p.feet <= ARROWS_FEET);
              const rest = pts.filter(p => p.feet >= ARROWS_FEET);
              return (
                <g key={entry.ball}>
                  <path fill="none" stroke={colors[entry.ball]} strokeWidth="2.5"
                    strokeLinecap="round" d={trajectoryPath(known, x, y)} />
                  <path fill="none" stroke={colors[entry.ball]} strokeWidth="2.5"
                    strokeLinecap="round" strokeDasharray="5 4" opacity="0.75"
                    d={trajectoryPath(rest, x, y)} />
                  {/* The feet, at the bottom where the bowler stands. */}
                  <circle cx={x(pts[0].board)} cy={y(0)} r="3.5"
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
