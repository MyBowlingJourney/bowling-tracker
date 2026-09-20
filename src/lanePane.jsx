import { useState } from "react";
import { C, S, F } from "./ui.jsx";
import { lanePath, RACK, MARK_BOARDS, pocketPins } from "./domain/lanePath.js";
import { ARROWS_FEET, FOUL_LINE_TO_PINS } from "./domain/ballComparison.js";

// The lane, drawn the way a bowler reads one.
//
// Split out of BallCompare because it now owns state -- which balls are
// shown -- and because the diagram is the thing people will keep asking
// for changes to. Everything about it is here.
//
// ── Geometry, not decoration ────────────────────────────────────────────
//
// Thirty-nine boards, arrows at fifteen feet, the headpin at sixty and
// the rack behind it. Board 1 is the bowler's OWN gutter, so for a
// right-hander low boards sit on the RIGHT of the screen -- drawn the
// other way round a right-hander's ball swings out to the left, which is
// backwards. This is the only place handedness is applied; ballLine
// keeps boards in the bowler's own numbering.
//
// Proportions: a real lane is 1:17, which drawn honestly is a thread
// nobody can read on a phone. The reference diagrams bowlers actually
// use compress it to about 1:5, and so does this.

const LANE_BOARDS = 39;
const APPROACH_FEET = 12;

export default function LanePane({ lines, colors, leftHanded }) {
  // Every ball on, which is where the card was before the filter. A ball
  // is turned OFF rather than on, so a newly bagged ball appears by
  // itself instead of being invisible until someone finds the control.
  const [hidden, setHidden] = useState({});

  if (!lines.length) return null;

  const W = 300, H = 760, PAD = 12;
  const RULER = 34;                       // room for the foot marks
  const laneL = PAD + RULER, laneR = W - PAD;
  const FT_TOP = 63, FT_BOT = -APPROACH_FEET;

  const x = board => {
    const frac = (board - 1) / (LANE_BOARDS - 1);
    return leftHanded
      ? laneL + frac * (laneR - laneL)
      : laneR - frac * (laneR - laneL);
  };
  // Down the lane is UP the screen: the bowler stands at the bottom and
  // the pins are at the far end. Drawn the other way it reads as a ball
  // travelling towards you, which is nobody's view of a lane.
  const y = feet => PAD + ((FT_TOP - feet) / (FT_TOP - FT_BOT)) * (H - PAD * 2);

  const foulY = y(0), arrowY = y(ARROWS_FEET), approachY = y(-APPROACH_FEET);
  const pocket = pocketPins(leftHanded);

  const shown = lines.filter(({ entry }) => !hidden[entry.ball]);
  const allHidden = shown.length === 0;

  const toggle = ball => setHidden(prev => {
    const next = { ...prev };
    if (next[ball]) delete next[ball]; else next[ball] = true;
    return next;
  });

  return (
    <>
      <svg viewBox={`0 0 ${W} ${H}`} role="img"
        aria-label={`Lane diagram, ${shown.length} of ${lines.length} balls shown`}
        style={{ width: "100%", height: "auto", display: "block", marginBottom: "8px" }}>

        {/* The approach, behind the foul line, where the feet are. */}
        <rect x={laneL} y={foulY} width={laneR - laneL} height={approachY - foulY}
          fill={C.bg} />
        <line x1={laneL} y1={approachY} x2={laneR} y2={approachY}
          stroke={C.border} strokeDasharray="4 4" />

        {/* The lane bed, board by board. The marked boards a shade
            stronger so the eye can count to the arrow without a ruler. */}
        <rect x={laneL} y={PAD} width={laneR - laneL} height={foulY - PAD}
          fill={C.card} />
        {Array.from({ length: LANE_BOARDS }, (_, i) => i + 1).map(b => (
          <line key={b} x1={x(b)} y1={PAD} x2={x(b)} y2={foulY}
            stroke={C.border} strokeWidth="0.5"
            opacity={MARK_BOARDS.includes(b) ? 0.9 : 0.4} />
        ))}
        <rect x={laneL} y={PAD} width={laneR - laneL} height={foulY - PAD}
          fill="none" stroke={C.border} />

        {/* Feet from the foul line. */}
        {[0, 15, 30, 45, 60].map(f => (
          <g key={f}>
            <line x1={laneL - 6} y1={y(f)} x2={laneL} y2={y(f)} stroke={C.border} />
            <text x={laneL - 9} y={y(f) + 3.5} textAnchor="end" fontSize="9"
              fill={C.textMuted} fontFamily={F.num}>{f}′</text>
          </g>
        ))}

        {/* The rack, headpin nearest the bowler. The pocket is shaded
            because it is what the whole line is aimed at -- and it is
            the 1-2 for a left-hander, not the 1-3. */}
        {RACK.map(p => (
          <circle key={p.pin} cx={x(p.board)} cy={y(p.feet)} r="4.5"
            fill={pocket.includes(p.pin) ? C.strike : C.textMuted}
            opacity={pocket.includes(p.pin) ? 1 : 0.6} />
        ))}

        {/* The arrows, at fifteen feet. */}
        {MARK_BOARDS.map(b => (
          <polygon key={b} fill={C.textMuted} opacity="0.8"
            points={`${x(b)},${arrowY - 7} ${x(b) - 3.5},${arrowY + 3} ${x(b) + 3.5},${arrowY + 3}`} />
        ))}

        {/* The foul line, its guide dots, and the board numbers. */}
        <line x1={laneL} y1={foulY} x2={laneR} y2={foulY}
          stroke={C.text} strokeWidth="1.5" />
        {MARK_BOARDS.map(b => (
          <circle key={b} cx={x(b)} cy={foulY + 11} r="2" fill={C.textMuted} />
        ))}
        {MARK_BOARDS.map(b => (
          <text key={b} x={x(b)} y={foulY + 26} textAnchor="middle" fontSize="8"
            fill={C.textMuted} fontFamily={F.num}>{b}</text>
        ))}

        {/* The lines.

            Left free to overlap. Two balls that run the same line SHOULD
            sit on top of each other -- that is the finding, and nudging
            them apart to keep both visible would draw a difference that
            is not there. */}
        {shown.map(({ entry, line }) => {
          const { skid, hook } = lanePath(line.points, x, y);
          const colour = colors[entry.ball] || C.accent;
          const brk = line.points[line.points.length - 2];
          return (
            <g key={entry.ball}>
              <path fill="none" stroke={colour} strokeWidth="3"
                strokeLinecap="round" strokeDasharray="7 6" opacity="0.75" d={hook} />
              <path fill="none" stroke={colour} strokeWidth="3"
                strokeLinecap="round" d={skid} />
              {/* Where it turns. */}
              <circle cx={x(brk.board)} cy={y(brk.feet)} r="3"
                fill={C.card} stroke={colour} strokeWidth="2" />
              {/* Where it lands. */}
              <circle cx={x(line.points[0].board)} cy={foulY} r="3.5" fill={colour} />
            </g>
          );
        })}
      </svg>

      {/* The filter.

          Real buttons, so it is reachable by keyboard and a screen reader
          says which balls are on. The row IS the legend -- a separate one
          would be the same information twice. */}
      <div style={{ display: "grid", gap: "4px", marginBottom: "8px" }}>
        {lines.map(({ entry }) => {
          const on = !hidden[entry.ball];
          const colour = colors[entry.ball] || C.accent;
          return (
            <button key={entry.ball} type="button" onClick={() => toggle(entry.ball)}
              aria-pressed={on}
              style={{
                display: "flex", alignItems: "center", gap: "8px", width: "100%",
                padding: "6px 8px", minHeight: "44px", boxSizing: "border-box",
                backgroundColor: on ? C.card : "transparent",
                border: `1px solid ${on ? colour + "66" : C.border}`,
                borderRadius: "8px", cursor: "pointer", textAlign: "left",
                fontFamily: F.body, WebkitTapHighlightColor: "transparent",
              }}>
              <span aria-hidden="true" style={{
                width: "18px", height: "3px", borderRadius: "2px", flexShrink: 0,
                backgroundColor: on ? colour : C.border,
              }} />
              <span style={{ flexGrow: 1, minWidth: 0, fontSize: "12px",
                color: on ? C.text : C.textMuted, overflow: "hidden",
                textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.ball}</span>
              <span style={{ fontSize: "12px", color: C.textMuted, fontFamily: F.num }}>
                {entry.strikeRate == null ? "—" : `${entry.strikeRate}%`}
              </span>
            </button>
          );
        })}
        {/* Only offered when it would do something. */}
        {(Object.keys(hidden).length > 0 || lines.length > 2) && (
          <div style={{ display: "flex", gap: "6px", marginTop: "2px" }}>
            <button type="button" onClick={() => setHidden({})}
              style={{ ...S.btn("sm"), flex: 1, fontSize: "12px", minHeight: "40px" }}>
              Show all
            </button>
            <button type="button"
              onClick={() => setHidden(Object.fromEntries(lines.map(l => [l.entry.ball, true])))}
              style={{ ...S.btn("sm"), flex: 1, fontSize: "12px", minHeight: "40px" }}>
              Hide all
            </button>
          </div>
        )}
      </div>

      <div style={{ fontSize: "11px", color: C.textMuted, lineHeight: 1.5 }}>
        {allHidden
          ? "Every ball is hidden — tap one above to put it back on the lane."
          : `Solid while it skids, dashed once it turns. Where it turns comes from the
             oil pattern rather than from anything you logged, so that half is a
             drawing of the pattern as much as of the ball.`}
      </div>
    </>
  );
}
