import { useState } from "react";
import { C, S, ActionRow } from "./ui.jsx";
import {
  journeyMilestones,
  journeyProgress,
  describeMilestone,
  bandedJourney,
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

export default function JourneyView({ onOpenBadges, sessions = [], tournaments = [], bowler = "", shots = []}) {
  const mine = (Array.isArray(sessions) ? sessions : [])
    .filter(s => s && (!bowler || s.bowler === bowler));
  const myShots = (Array.isArray(shots) ? shots : [])
    .filter(sh => sh && (!bowler || sh.bowler === bowler));
  const milestones = journeyMilestones(mine, tournaments, myShots);

  // The bowler's average decides what folds away.
  const allScores = mine.flatMap(s => Array.isArray(s.scores) ? s.scores : [])
    .map(Number).filter(Number.isFinite);
  const average = allScores.length
    ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
    : 0;
  const { open: openMilestones, bands } = bandedJourney(milestones, average);
  const [openBands, setOpenBands] = useState({});
  const { earned, total } = journeyProgress(milestones);

  // Bottom of the list is the FIRST milestone, so reverse for drawing.
  const drawn = [...openMilestones].reverse();
  // Nothing yet. An empty map with one node and no path reads as a
  // broken screen; this reads as a beginning.
  if (!drawn.length) {
    return (
      <div style={{ ...S.card, textAlign: "center", padding: "24px 16px" }}>
        <div style={{ fontSize: "14px", fontWeight: 600, color: C.text }}>My journey</div>
        <div style={{ fontSize: "12px", color: C.textMuted, marginTop: "8px", lineHeight: 1.6 }}>
          Log a night and your journey starts here. Every first — first
          strike, first spare, first 100 — lands on the map with the date
          you did it.
        </div>
      </div>
    );
  }

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
          {/* A count of what HAPPENED, not a score out of a total.
              
              "3 of 15 reached" is ladder language -- it names everything
              not done. The timeline only lists what was earned plus one
              step, so the honest number is simply how many. */}
          {earned} milestone{earned === 1 ? "" : "s"}
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
        {/* Only "earned" can appear now, so the legend would be three
            labels for one colour. Replaced by the line below. */}
        <span>Keep bowling to see what's next on your journey</span>
      </div>

      {/* Folded history, nearest first.
          
          A 200 average bowler has earned every step up to 180 and should
          not scroll past "Broke 75" to reach their own road. Deleting
          those would be worse -- they did break 75, on a date, and that
          is the whole point of a timeline. So they fold instead. */}
      {bands.map(band => {
        const isOpen = !!openBands[band.ceiling];
        return (
          <div key={band.ceiling} style={{ marginTop: "8px",
            borderTop: `1px solid ${C.border}`, paddingTop: "8px" }}>
            <button
              onClick={() => setOpenBands(o => ({ ...o, [band.ceiling]: !isOpen }))}
              style={{ background: "none", border: "none", padding: 0, width: "100%",
                textAlign: "left", cursor: "pointer", color: C.textMuted,
                fontSize: "12px" }}>
              {isOpen ? "\u25be" : "\u25b8"} {band.label}
              {" \u00b7 "}{band.milestones.length}
            </button>
            {isOpen && (
              <div style={{ marginTop: "6px" }}>
                {band.milestones.map(m => (
                  <div key={m.id} style={{ display: "flex",
                    justifyContent: "space-between", padding: "3px 0",
                    fontSize: "11px" }}>
                    <span style={{ color: C.text }}>{m.label}</span>
                    <span style={{ color: C.textMuted }}>{m.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
      {onOpenBadges && (
        <div style={{ marginTop: "12px" }}>
          {/* Badges live at the foot of the road.
              
              They lost their tab in the five-tab nav and had nowhere to
              go -- but they were never a separate subject: a badge and a
              milestone are both a record of something earned. The
              difference is only that milestones are dated points on a
              line and badges are a collection.
              
              So Journey holds both, and this is the way through. */}
          <ActionRow
            icon={"\u{1F3C5}"}
            color={C.spare}
            label="Badges"
            detail="What you've collected along the way"
            onClick={onOpenBadges} />
        </div>
      )}
    </div>
  );
}
