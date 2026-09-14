import { C, S } from "./ui.jsx";
import {
  journeyMilestones, nextMilestone, journeyProgress, describeMilestone,
} from "./domain/journey.js";

// My Journey: a winding path of milestones, newest at the bottom.
//
// Bottom to top so scrolling UP is progress. The alternative -- newest at
// the top, like every feed -- makes the thing already achieved the thing
// you see first, which is backwards for a screen about what comes next.
//
// Drawn as one SVG rather than a list of cards because the PATH is the
// point: the milestones are on a route, and a card stack cannot show that
// a 700 series comes after a 600 and before an 800.

const NODE = { earned: c => c.strike, reach: c => c.accent, locked: c => c.textMuted };

// Alternating left and right, so the path winds.
//
// A straight column of circles would be a list with a line drawn on it.
// The wind is what makes it read as a route, and it costs nothing --
// the x positions are the only thing that changes.
const X = [88, 232];

const STEP = 104;          // vertical gap between milestones
const TOP_PAD = 52;
const BOTTOM_PAD = 44;

export default function JourneyView({ sessions = [], tournaments = [], bowler = "" }) {
  const mine = (Array.isArray(sessions) ? sessions : [])
    .filter(s => s && (!bowler || s.bowler === bowler));
  const milestones = journeyMilestones(mine, tournaments);
  const next = nextMilestone(milestones);
  const { earned, total } = journeyProgress(milestones);

  // Bottom of the list is the FIRST milestone, so reverse for drawing.
  const drawn = [...milestones].reverse();
  const height = TOP_PAD + (drawn.length - 1) * STEP + BOTTOM_PAD;
  const pos = i => ({ x: X[(drawn.length - 1 - i) % 2], y: TOP_PAD + i * STEP });

  // The dotted route, drawn once through every node.
  const path = drawn.map((m, i) => {
    const p = pos(i);
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = pos(i - 1);
    const mid = (prev.y + p.y) / 2;
    return `C ${prev.x} ${mid}, ${p.x} ${mid}, ${p.x} ${p.y}`;
  }).join(" ");

  return (
    <div style={{ ...S.card, paddingTop: "14px" }}>
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <div style={{ fontSize: "14px", fontWeight: 600, color: C.text }}>My journey</div>
        <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "2px" }}>
          {earned} of {total} reached
          {next ? ` \u00b7 next: ${next.label}` : " \u00b7 all of them"}
        </div>
      </div>

      <svg viewBox={`0 0 320 ${height}`} style={{ width: "100%", height: "auto", display: "block" }}
        role="img" aria-label="Your bowling milestones as a path">
        <path d={path} fill="none" stroke={C.border} strokeWidth="5"
          strokeLinecap="round" strokeDasharray="1 12" />

        {drawn.map((m, i) => {
          const p = pos(i);
          const col = (NODE[m.state] || NODE.locked)(C);
          // The one in reach is bigger. It is the only milestone the
          // bowler can act on tonight, so it should be the one the eye
          // lands on first.
          const r = m.state === "reach" ? 27 : 22;
          const labelLeft = p.x > 160;
          return (
            <g key={m.id}>
              <circle cx={p.x} cy={p.y} r={r} fill={col + "33"} stroke={col}
                strokeWidth={m.state === "reach" ? 2 : 1.25} />
              <text x={p.x} y={p.y + 4} textAnchor="middle"
                style={{ fontSize: "12px", fontWeight: 600, fill: col }}>
                {m.kind === "count" ? (m.state === "earned" ? "\u2713" : m.target) : m.target}
              </text>
              <text x={labelLeft ? p.x - r - 10 : p.x + r + 10} y={p.y - 2}
                textAnchor={labelLeft ? "end" : "start"}
                style={{ fontSize: "12px", fill: C.text }}>
                {m.label}
              </text>
              <text x={labelLeft ? p.x - r - 10 : p.x + r + 10} y={p.y + 13}
                textAnchor={labelLeft ? "end" : "start"}
                style={{ fontSize: "10px", fill: m.state === "reach" ? C.accent : C.textMuted }}>
                {describeMilestone(m)}
              </text>
            </g>
          );
        })}
      </svg>

      <div style={{ display: "flex", justifyContent: "center", gap: "14px",
        marginTop: "8px", fontSize: "10px", color: C.textMuted }}>
        <span>Earned</span>
        <span>In reach</span>
        <span>Locked</span>
      </div>
    </div>
  );
}
