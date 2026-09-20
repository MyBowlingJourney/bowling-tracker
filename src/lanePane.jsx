import { useState, useMemo } from "react";
import { C, S, F } from "./ui.jsx";
import { lanePath, RACK, MARK_BOARDS, pocketPins } from "./domain/lanePath.js";
import { ballComparison, ballLine, ARROWS_FEET } from "./domain/ballComparison.js";
import { isSplit, isCornerPinLeave } from "./domain/splits.js";
import {
  shotsAt, nightsIn, patternsIn, positionLabel, typicalGames,
  patternLengthFor, SLIDER_STEPS,
} from "./domain/laneTransition.js";

// The lane, drawn the way a bowler reads one -- and scrubable.
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
//
// ── The slider is the point ─────────────────────────────────────────────
//
// A single averaged line per ball is a fair summary of a ball you have
// settled on and a lie about a night you moved. Scrubbing through the
// block shows the move instead of averaging it away -- which is also
// what makes logging the line every shot worth the trouble.

const LANE_BOARDS = 39;
const APPROACH_FEET = 12;

export default function LanePane({
  shots = [], bowler = "", league = "", leftHanded = false,
  colors = {}, allBalls = [], lanePatterns = [],
  drift, lateralOffset, twoHanded = false, patternLength = null,
}) {
  // Every ball on, and the whole night. A ball is turned OFF rather than
  // on, so a newly bagged ball appears by itself instead of being
  // invisible until someone finds the control.
  const [hidden, setHidden] = useState({});
  // null = the whole block averaged, which is where this card started
  // and is still the right default: most of the time you want the ball,
  // not the night.
  const [at, setAt] = useState(null);
  const [night, setNight] = useState("");      // "" = every night, pooled
  const [pattern, setPattern] = useState("");  // "" = every pattern

  const nights = useMemo(() => nightsIn(shots, lanePatterns), [shots, lanePatterns]);
  const patterns = useMemo(() => patternsIn(shots, lanePatterns), [shots, lanePatterns]);
  const games = useMemo(() => typicalGames(shots), [shots]);

  // Scrubbing off means the card behaves exactly as it did before: one
  // line per ball, every shot behind it.
  const scrubbing = at !== null;

  const { lines, sampleNights, sampleShots } = useMemo(() => {
    const picked = scrubbing || pattern || night
      ? shotsAt(shots, { at: at ?? 0.5, date: night, pattern, lanePatterns,
                         halfWindow: scrubbing ? 0.15 : 1 })
      : { shots, nights: nights.length };

    // A chosen pattern sets where the ball turns. A 47-foot block turns
    // it later than a 36-foot one, and drawing both at the league's
    // default length would put the same breakpoint on patterns that play
    // nothing alike.
    const feet = patternLengthFor(lanePatterns, pattern) ?? patternLength;

    const entries = ballComparison(picked.shots, {
      bowler, league, isSplit, isCornerPinLeave, leftHanded, minShots: 0,
    });
    return {
      lines: entries
        .map(b => ({ entry: b, line: ballLine(b, { drift, lateralOffset, twoHanded, patternLength: feet }) }))
        .filter(v => v.line),
      sampleNights: picked.nights,
      sampleShots: picked.shots.length,
    };
  }, [shots, at, night, pattern, lanePatterns, bowler, league, leftHanded,
      drift, lateralOffset, twoHanded, patternLength, scrubbing, nights.length]);

  if (!allBalls.length) return null;

  const W = 300, H = 760, PAD = 12;
  const RULER = 34;
  const laneL = PAD + RULER, laneR = W - PAD;
  const FT_TOP = 63, FT_BOT = -APPROACH_FEET;

  const x = board => {
    const frac = (board - 1) / (LANE_BOARDS - 1);
    return leftHanded
      ? laneL + frac * (laneR - laneL)
      : laneR - frac * (laneR - laneL);
  };
  // Down the lane is UP the screen: the bowler stands at the bottom and
  // the pins are at the far end.
  const y = feet => PAD + ((FT_TOP - feet) / (FT_TOP - FT_BOT)) * (H - PAD * 2);

  const foulY = y(0), arrowY = y(ARROWS_FEET), approachY = y(-APPROACH_FEET);
  const pocket = pocketPins(leftHanded);

  const shown = lines.filter(({ entry }) => !hidden[entry.ball]);
  const toggle = ball => setHidden(prev => {
    const next = { ...prev };
    if (next[ball]) delete next[ball]; else next[ball] = true;
    return next;
  });

  const pill = active => ({
    padding: "7px 11px", minHeight: "40px", borderRadius: "8px",
    border: `1px solid ${active ? C.accent : C.border}`,
    backgroundColor: active ? C.accentDim : "transparent",
    color: active ? C.text : C.textMuted,
    fontFamily: F.body, fontSize: "12px", cursor: "pointer",
    WebkitTapHighlightColor: "transparent",
  });

  return (
    <>
      <svg viewBox={`0 0 ${W} ${H}`} role="img"
        aria-label={`Lane diagram, ${shown.length} of ${allBalls.length} balls shown`}
        style={{ width: "100%", height: "auto", display: "block", marginBottom: "8px" }}>

        {/* The approach, behind the foul line, where the feet are. */}
        <rect x={laneL} y={foulY} width={laneR - laneL} height={approachY - foulY} fill={C.bg} />
        <line x1={laneL} y1={approachY} x2={laneR} y2={approachY}
          stroke={C.border} strokeDasharray="4 4" />

        {/* The lane bed, board by board. */}
        <rect x={laneL} y={PAD} width={laneR - laneL} height={foulY - PAD} fill={C.card} />
        {Array.from({ length: LANE_BOARDS }, (_, i) => i + 1).map(b => (
          <line key={b} x1={x(b)} y1={PAD} x2={x(b)} y2={foulY}
            stroke={C.border} strokeWidth="0.5"
            opacity={MARK_BOARDS.includes(b) ? 0.9 : 0.4} />
        ))}
        <rect x={laneL} y={PAD} width={laneR - laneL} height={foulY - PAD}
          fill="none" stroke={C.border} />

        {[0, 15, 30, 45, 60].map(f => (
          <g key={f}>
            <line x1={laneL - 6} y1={y(f)} x2={laneL} y2={y(f)} stroke={C.border} />
            <text x={laneL - 9} y={y(f) + 3.5} textAnchor="end" fontSize="9"
              fill={C.textMuted} fontFamily={F.num}>{f}′</text>
          </g>
        ))}

        {/* The rack. The pocket is the 1-2 for a left-hander. */}
        {RACK.map(p => (
          <circle key={p.pin} cx={x(p.board)} cy={y(p.feet)} r="4.5"
            fill={pocket.includes(p.pin) ? C.strike : C.textMuted}
            opacity={pocket.includes(p.pin) ? 1 : 0.6} />
        ))}

        {MARK_BOARDS.map(b => (
          <polygon key={b} fill={C.textMuted} opacity="0.8"
            points={`${x(b)},${arrowY - 7} ${x(b) - 3.5},${arrowY + 3} ${x(b) + 3.5},${arrowY + 3}`} />
        ))}

        <line x1={laneL} y1={foulY} x2={laneR} y2={foulY} stroke={C.text} strokeWidth="1.5" />
        {MARK_BOARDS.map(b => (
          <circle key={b} cx={x(b)} cy={foulY + 11} r="2" fill={C.textMuted} />
        ))}
        {MARK_BOARDS.map(b => (
          <text key={b} x={x(b)} y={foulY + 26} textAnchor="middle" fontSize="8"
            fill={C.textMuted} fontFamily={F.num}>{b}</text>
        ))}

        {/* The lines. Left free to overlap: two balls that run the same
            line SHOULD sit on top of each other -- that is the finding,
            and nudging them apart would draw a difference that is not
            there. */}
        {shown.map(({ entry, line }) => {
          const { skid, hook } = lanePath(line.points, x, y);
          const colour = colors[entry.ball] || C.accent;
          const brk = line.points[line.points.length - 2];
          return (
            <g key={entry.ball}>
              <path fill="none" stroke={colour} strokeWidth="3" strokeLinecap="round"
                strokeDasharray="7 6" opacity="0.75" d={hook} />
              <path fill="none" stroke={colour} strokeWidth="3" strokeLinecap="round" d={skid} />
              <circle cx={x(brk.board)} cy={y(brk.feet)} r="3"
                fill={C.card} stroke={colour} strokeWidth="2" />
              <circle cx={x(line.points[0].board)} cy={foulY} r="3.5" fill={colour} />
            </g>
          );
        })}
      </svg>

      {/* ── Through the block ──────────────────────────────────────────

          The transition is measured in FRAMES, not games: the move that
          matters is usually made in the middle of one, and stepping by
          game hides exactly that. */}
      <div style={{ marginBottom: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
          <span style={{ ...S.label, marginBottom: 0, flexGrow: 1 }}>
            {scrubbing ? positionLabel(at, games) : "Whole block"}
          </span>
          <button type="button" onClick={() => setAt(scrubbing ? null : 0)}
            style={pill(scrubbing)}>
            {scrubbing ? "Show the average" : "Scrub the block"}
          </button>
        </div>

        {scrubbing && (
          <>
            <input type="range" min="0" max={SLIDER_STEPS} step="1"
              value={Math.round(at * SLIDER_STEPS)}
              onChange={e => setAt(Number(e.target.value) / SLIDER_STEPS)}
              aria-label="Position through the block"
              style={{ width: "100%", accentColor: C.accent, minHeight: "44px" }} />
            <div style={{ display: "flex", justifyContent: "space-between",
              fontSize: "10px", color: C.textMuted, fontFamily: F.num, marginTop: "-4px" }}>
              <span>first ball</span><span>last ball</span>
            </div>
          </>
        )}
      </div>

      {/* Which nights. Pooling by position is the default because it has
          the data behind it; one night is for reviewing the night you
          just bowled. */}
      {nights.length > 1 && (
        <div style={{ marginBottom: "8px" }}>
          <div style={{ ...S.label, marginBottom: "4px" }}>Nights</div>
          <select style={{ ...S.sel, width: "100%" }}
            value={night} onChange={e => setNight(e.target.value)}>
            <option value="">Every night, by position in the block</option>
            {nights.map(n => (
              <option key={n.date} value={n.date}>
                {n.date}{n.pattern ? ` · ${n.pattern}` : ""} · {n.games} games
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Oil pattern. The single biggest thing outside the bowler that
          decides the line, so it belongs beside the line rather than
          filed under the centre. */}
      {patterns.length > 0 && (
        <div style={{ marginBottom: "8px" }}>
          <div style={{ ...S.label, marginBottom: "4px" }}>Oil pattern</div>
          <select style={{ ...S.sel, width: "100%" }}
            value={pattern} onChange={e => setPattern(e.target.value)}>
            <option value="">Every pattern</option>
            {patterns.map(p => (
              <option key={p.name} value={p.name}>
                {p.name} · {p.nights} {p.nights === 1 ? "night" : "nights"}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* The filter. The row IS the legend -- a separate one would be
          the same information twice. */}
      <div style={{ display: "grid", gap: "4px", marginBottom: "8px" }}>
        {allBalls.map(ball => {
          const on = !hidden[ball];
          const here = lines.find(l => l.entry.ball === ball);
          const colour = colors[ball] || C.accent;
          return (
            <button key={ball} type="button" onClick={() => toggle(ball)} aria-pressed={on}
              style={{
                display: "flex", alignItems: "center", gap: "8px", width: "100%",
                padding: "6px 8px", minHeight: "44px", boxSizing: "border-box",
                backgroundColor: on ? C.card : "transparent",
                border: `1px solid ${on ? colour + "66" : C.border}`,
                borderRadius: "8px", cursor: "pointer", textAlign: "left",
                fontFamily: F.body, WebkitTapHighlightColor: "transparent",
                opacity: here ? 1 : 0.45,
              }}>
              <span aria-hidden="true" style={{
                width: "18px", height: "3px", borderRadius: "2px", flexShrink: 0,
                backgroundColor: on ? colour : C.border,
              }} />
              <span style={{ flexGrow: 1, minWidth: 0, fontSize: "12px",
                color: on ? C.text : C.textMuted, overflow: "hidden",
                textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ball}</span>
              <span style={{ fontSize: "12px", color: C.textMuted, fontFamily: F.num }}>
                {/* Not thrown in this window: say so rather than leave a
                    button that looks broken. */}
                {here ? `${here.entry.shots} shots` : "none here"}
              </span>
            </button>
          );
        })}
        {(Object.keys(hidden).length > 0 || allBalls.length > 2) && (
          <div style={{ display: "flex", gap: "6px", marginTop: "2px" }}>
            <button type="button" onClick={() => setHidden({})}
              style={{ ...S.btn("sm"), flex: 1, fontSize: "12px", minHeight: "40px" }}>Show all</button>
            <button type="button"
              onClick={() => setHidden(Object.fromEntries(allBalls.map(b => [b, true])))}
              style={{ ...S.btn("sm"), flex: 1, fontSize: "12px", minHeight: "40px" }}>Hide all</button>
          </div>
        )}
      </div>

      {/* What is behind what is drawn. A line from four shots and a line
          from four hundred look identical, so the count is not a detail
          -- it is the difference between a pattern and an anecdote. */}
      <div style={{ fontSize: "11px", color: C.textMuted, lineHeight: 1.5 }}>
        {shown.length === 0
          ? "Nothing on the lane — turn a ball back on, or widen the window."
          : <>
              {scrubbing
                ? `${sampleShots} shots around ${positionLabel(at, games).toLowerCase()}`
                : `${sampleShots} shots`}
              {night ? " on this night" : sampleNights > 1 ? `, across ${sampleNights} nights` : ""}
              {pattern ? ` on ${pattern}` : ""}
              {". "}
              Solid while it skids, dashed once it turns — where it turns comes from
              the oil pattern rather than from anything you logged.
            </>}
      </div>
    </>
  );
}
