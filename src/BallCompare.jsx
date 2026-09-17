import { C, S } from "./ui.jsx";
import {
  BALL_METRICS, ballComparison, bestByMetric, ballColors, ballLine,
  ARROWS_FEET, BREAKPOINT_FEET, FOUL_LINE_TO_PINS,
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
  const x = board => PAD + ((board - 1) / (LANE_BOARDS - 1)) * (W - PAD * 2);
  const y = feet => PAD + (feet / FOUL_LINE_TO_PINS) * (H - PAD * 2);

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
            <circle cx={x(17.5)} cy={y(FOUL_LINE_TO_PINS)} r="3" fill={C.textMuted} />

            {lines.map(({ entry, line }) => {
              const pts = line.points;
              // Solid to the arrows, dashed past them: everything beyond
              // fifteen feet is projected, not recorded.
              const known = pts.filter(p => p.feet <= ARROWS_FEET);
              return (
                <g key={entry.ball}>
                  <polyline fill="none" stroke={colors[entry.ball]} strokeWidth="2"
                    points={known.map(p => `${x(p.board)},${y(p.feet)}`).join(" ")} />
                  <polyline fill="none" stroke={colors[entry.ball]} strokeWidth="2"
                    strokeDasharray="4 3" opacity="0.7"
                    points={pts.filter(p => p.feet >= ARROWS_FEET)
                      .map(p => `${x(p.board)},${y(p.feet)}`).join(" ")} />
                  <circle cx={x(pts[0].board)} cy={y(0)} r="3" fill={colors[entry.ball]} />
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
