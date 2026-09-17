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
              const known = pts.filter(p => p.feet <= ARROWS_FEET);
              const rest = pts.filter(p => p.feet >= ARROWS_FEET);
              return (
                <g key={entry.ball}>
                  <path fill="none" stroke={colors[entry.ball]} strokeWidth="4"
                    strokeLinecap="round" d={trajectoryPath(known, x, y)} />
                  <path fill="none" stroke={colors[entry.ball]} strokeWidth="4"
                    strokeLinecap="round" strokeDasharray="9 7" opacity="0.75"
                    d={trajectoryPath(rest, x, y)} />
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
