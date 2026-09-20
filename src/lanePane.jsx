import { useState, useMemo } from "react";
import { C, S, F } from "./ui.jsx";
import { lanePath, RACK, MARK_BOARDS, pocketPins } from "./domain/lanePath.js";
import { ballComparison, ballLine, ARROWS_FEET } from "./domain/ballComparison.js";
import { isSplit, isCornerPinLeave } from "./domain/splits.js";
import {
  shotsAt, nightsIn, patternsIn, positionLabel, typicalGames,
  patternLengthFor, SLIDER_STEPS, HOUSE_PATTERN,
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
// ── Following the transition ────────────────────────────────────────────
//
// A single averaged line per ball is a fair summary of a ball you have
// settled on and a lie about a night you moved. Dragging through the
// block shows the move instead of averaging it away -- which is also
// what makes logging the line every shot worth the trouble.

const LANE_BOARDS = 39;

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

  const nights = useMemo(() => nightsIn(shots, lanePatterns), [shots, lanePatterns]);
  const patterns = useMemo(() => patternsIn(shots, lanePatterns), [shots, lanePatterns]);

  // Starts on the house shot rather than on everything.
  //
  // "Every pattern" averages a house night and a sport block into one
  // line, and they are not the same shot -- that is most of the reason
  // the pattern picker exists. The house shot is where nearly every
  // league night is bowled, so it is the honest default; a bowler who
  // wants the sport block picks it.
  const [pattern, setPattern] = useState(
    () => (patternsIn(shots, lanePatterns).some(p => p.name === HOUSE_PATTERN)
      ? HOUSE_PATTERN : ""));
  const games = useMemo(() => typicalGames(shots), [shots]);

  // Scrubbing off means the card behaves exactly as it did before: one
  // line per ball, every shot behind it.
  const scrubbing = at !== null;

  const { lines, sampleNights, sampleShots, breakFeet } = useMemo(() => {
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
      // The depth every line turned at, so the diagram can draw it once
      // rather than each line implying its own.
      breakFeet: entries.length
        ? (ballLine(entries[0], { drift, lateralOffset, twoHanded, patternLength: feet })
            ?.points?.[2]?.feet ?? null)
        : null,
    };
  }, [shots, at, night, pattern, lanePatterns, bowler, league, leftHanded,
      drift, lateralOffset, twoHanded, patternLength, scrubbing, nights.length]);

  if (!allBalls.length) return null;

  // ── Fitting on a phone ────────────────────────────────────────────
  //
  // The lane, the pattern picker and the slider have to be on screen
  // together: scrubbing while the lane is scrolled off is scrubbing
  // blind, and that is the whole feature.
  //
  // So the lane is given whatever height is left after the controls,
  // in dvh rather than vh -- on a phone vh is the height the viewport
  // would have with the address bar hidden, so a vh-sized diagram is
  // cut off by the bar until you scroll. dvh is the height it actually
  // has right now.
  //
  // The SVG then scales to that box rather than the box being computed
  // from the SVG, so nothing here needs to know the font size, the
  // number of balls or the phone.
  //
  // And the approach is gone. Twelve feet of empty boards behind the
  // foul line, for a card whose subject starts at the foul line -- it
  // was a fifth of the height for a stripe with a dot on it.
  const LANE_HEIGHT = "min(52dvh, 460px)";

  const W = 300, H = 640, PAD = 10;
  const RULER = 30;
  const laneL = PAD + RULER, laneR = W - PAD;
  const FT_TOP = 63, FT_BOT = 0;

  const x = board => {
    const frac = (board - 1) / (LANE_BOARDS - 1);
    return leftHanded
      ? laneL + frac * (laneR - laneL)
      : laneR - frac * (laneR - laneL);
  };
  // Down the lane is UP the screen: the bowler stands at the bottom and
  // the pins are at the far end.
  const y = feet => PAD + ((FT_TOP - feet) / (FT_TOP - FT_BOT)) * (H - PAD * 2);

  const foulY = y(0), arrowY = y(ARROWS_FEET);
  const pocket = pocketPins(leftHanded);

  const shown = lines.filter(({ entry }) => !hidden[entry.ball]);
  const toggle = ball => setHidden(prev => {
    const next = { ...prev };
    if (next[ball]) delete next[ball]; else next[ball] = true;
    return next;
  });

  const pill = active => ({
    padding: "6px 10px", minHeight: "38px", borderRadius: "8px",
    border: `1px solid ${active ? C.accent : C.border}`,
    backgroundColor: active ? C.accentDim : "transparent",
    color: active ? C.text : C.textMuted,
    fontFamily: F.body, fontSize: "12px", cursor: "pointer",
    WebkitTapHighlightColor: "transparent",
  });

  // ── The filter column ─────────────────────────────────────────────
  //
  // On the side the ball is NOT on. Board 1 is the bowler's own gutter,
  // so a right-hander's line lives on the right of the lane and the
  // filter goes left; a left-hander is the mirror. Put it on the same
  // side and the buttons sit against the busiest part of the drawing.
  const filterColumn = (
    <div style={{ width: "96px", flexShrink: 0, display: "flex",
      flexDirection: "column", gap: "4px", overflowY: "auto",
      maxHeight: LANE_HEIGHT }}>
      {allBalls.map(ball => {
        const on = !hidden[ball];
        const here = lines.find(l => l.entry.ball === ball);
        const colour = colors[ball] || C.accent;
        return (
          <button key={ball} type="button" onClick={() => toggle(ball)} aria-pressed={on}
            style={{
              display: "flex", flexDirection: "column", alignItems: "flex-start",
              gap: "2px", width: "100%", padding: "5px 6px", minHeight: "44px",
              boxSizing: "border-box",
              backgroundColor: on ? C.card : "transparent",
              border: `1px solid ${on ? colour + "66" : C.border}`,
              borderRadius: "8px", cursor: "pointer", textAlign: "left",
              fontFamily: F.body, WebkitTapHighlightColor: "transparent",
              opacity: here ? 1 : 0.45,
            }}>
            <span style={{ display: "flex", alignItems: "center", gap: "5px",
              width: "100%", minWidth: 0 }}>
              <span aria-hidden="true" style={{ width: "12px", height: "3px",
                borderRadius: "2px", flexShrink: 0,
                backgroundColor: on ? colour : C.border }} />
              <span style={{ flexGrow: 1, minWidth: 0, fontSize: "11px",
                color: on ? C.text : C.textMuted, overflow: "hidden",
                textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ball}</span>
            </span>
            <span style={{ fontSize: "10px", color: C.textMuted, fontFamily: F.num }}>
              {/* Not thrown in this window: say so rather than leave a
                  button that looks broken. */}
              {here ? `${here.entry.shots} shots` : "none here"}
            </span>
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Oil pattern, directly above the lane. The single biggest thing
          outside the bowler that decides the line, so it sits with the
          line rather than filed under the centre -- and choosing one
          redraws the breakpoint at that pattern's own length. */}
      {/* Shown whenever there is more than one bucket to choose between.
      
          With only house nights logged there is nothing to pick, and a
          dropdown with one entry is a control that cannot do anything --
          the line under the diagram already says what it is drawn from.
          
          It was hidden altogether before, on a condition that required a
          NAMED pattern, so a bowler with a season of ordinary league
          nights never saw it at all. Those nights are the house shot;
          they were just never written down. */}
      {patterns.length > 1 && (
        <select style={{ ...S.sel, width: "100%", marginBottom: "8px" }}
          aria-label="Oil pattern"
          value={pattern} onChange={e => setPattern(e.target.value)}>
          <option value="">Every oil pattern</option>
          {patterns.map(p => (
            <option key={p.name} value={p.name}>
              {p.name} · {p.nights} {p.nights === 1 ? "night" : "nights"}
            </option>
          ))}
        </select>
      )}

      {/* The lane and the filter, side by side. The filter goes on the
          side the bowler's line is NOT on. */}
      <div style={{ display: "flex", gap: "8px", alignItems: "flex-start",
        marginBottom: "8px" }}>
        {!leftHanded && filterColumn}
        <div style={{ flexGrow: 1, minWidth: 0, height: LANE_HEIGHT }}>
          <svg viewBox={`0 0 ${W} ${H}`} role="img"
            preserveAspectRatio="xMidYMid meet"
            aria-label={`Lane diagram, ${shown.length} of ${allBalls.length} balls shown`}
            style={{ width: "100%", height: "100%", display: "block" }}>

            {/* The lane bed, board by board. */}
            <rect x={laneL} y={PAD} width={laneR - laneL} height={foulY - PAD} fill={C.card} />
            {Array.from({ length: LANE_BOARDS }, (_, i) => i + 1).map(b => (
              <line key={b} x1={x(b)} y1={PAD} x2={x(b)} y2={foulY}
                stroke={C.border} strokeWidth="0.5"
                opacity={MARK_BOARDS.includes(b) ? 0.9 : 0.4} />
            ))}
            <rect x={laneL} y={PAD} width={laneR - laneL} height={foulY - PAD}
              fill="none" stroke={C.border} />

            {[15, 30, 45, 60].map(f => (
              <g key={f}>
                <line x1={laneL - 5} y1={y(f)} x2={laneL} y2={y(f)} stroke={C.border} />
                <text x={laneL - 8} y={y(f) + 3.5} textAnchor="end" fontSize="9"
                  fill={C.textMuted} fontFamily={F.num}>{f}′</text>
              </g>
            ))}

            {/* The rack. The pocket is the 1-2 for a left-hander. */}
            {RACK.map(p => (
              <circle key={p.pin} cx={x(p.board)} cy={y(p.feet)} r="4.5"
                fill={pocket.includes(p.pin) ? C.strike : C.textMuted}
                opacity={pocket.includes(p.pin) ? 1 : 0.6} />
            ))}

            {/* The breakpoint depth, drawn across the lane.
            
                It is the one distance on here that is not a fact about
                the shot: where the ball turns comes from the oil pattern
                length, not from anything the bowler logged. Drawing it
                as a dashed line says which depth every breakpoint dot is
                sitting on, and labelling it in feet says where the
                number came from. Forty feet is the house default; a
                47-foot sport block moves this line down the lane and
                every hook with it. */}
            {breakFeet != null && (
              <g>
                <line x1={laneL} y1={y(breakFeet)} x2={laneR} y2={y(breakFeet)}
                  stroke={C.compare} strokeDasharray="5 4" opacity="0.65" />
                <text x={laneR - 2} y={y(breakFeet) - 4} textAnchor="end"
                  fontSize="8.5" fill={C.compare} fontFamily={F.num}>
                  breakpoint {breakFeet}′
                </text>
              </g>
            )}

            {MARK_BOARDS.map(b => (
              <polygon key={b} fill={C.textMuted} opacity="0.8"
                points={`${x(b)},${arrowY - 7} ${x(b) - 3.5},${arrowY + 3} ${x(b) + 3.5},${arrowY + 3}`} />
            ))}

            {/* The foul line, its guide dots and the board numbers. The
                approach behind it is gone -- twelve feet of empty boards
                for a card whose subject starts here. */}
            <line x1={laneL} y1={foulY} x2={laneR} y2={foulY} stroke={C.text} strokeWidth="1.5" />
            {MARK_BOARDS.map(b => (
              <circle key={b} cx={x(b)} cy={foulY + 9} r="1.8" fill={C.textMuted} />
            ))}
            {MARK_BOARDS.map(b => (
              <text key={b} x={x(b)} y={foulY + 23} textAnchor="middle" fontSize="8"
                fill={C.textMuted} fontFamily={F.num}>{b}</text>
            ))}

            {/* The lines. Left free to overlap: two balls that run the
                same line SHOULD sit on top of each other -- that is the
                finding, and nudging them apart would draw a difference
                that is not there. */}
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
        </div>
        {leftHanded && filterColumn}
      </div>

      {/* ── Through the block ──────────────────────────────────────────
          
          Measured in FRAMES, not games: the move that matters is usually
          made in the middle of one, and stepping by game hides it. */}
      <div style={{ marginBottom: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
          <span style={{ ...S.label, marginBottom: 0, flexGrow: 1 }}>
            {scrubbing ? positionLabel(at, games) : "Averaged over the night"}
          </span>
          {/* Not "scrub the block". That is video-editing language and
              it describes the gesture rather than what it shows. What it
              shows is the transition: where the line moved as the night
              went on. */}
          <button type="button" onClick={() => setAt(scrubbing ? null : 0)}
            style={pill(scrubbing)}>
            {scrubbing ? "Show my usual line" : "Follow the transition"}
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
              <span>fresh oil</span><span>end of the block</span>
            </div>
          </>
        )}
      </div>

      {/* Which nights. Pooling by position is the default because it has
          the data behind it; one night is for reviewing the night you
          just bowled. */}
      {nights.length > 1 && (
        <select style={{ ...S.sel, width: "100%", marginBottom: "8px" }}
          aria-label="Which nights"
          value={night} onChange={e => setNight(e.target.value)}>
          <option value="">Every night, by position in the block</option>
          {nights.map(n => (
            <option key={n.date} value={n.date}>
              {n.date}{n.pattern ? ` · ${n.pattern}` : ""} · {n.games} games
            </option>
          ))}
        </select>
      )}

      {(Object.keys(hidden).length > 0 || allBalls.length > 2) && (
        <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
          <button type="button" onClick={() => setHidden({})}
            style={{ ...S.btn("sm"), flex: 1, fontSize: "12px", minHeight: "40px" }}>Show all</button>
          <button type="button"
            onClick={() => setHidden(Object.fromEntries(allBalls.map(b => [b, true])))}
            style={{ ...S.btn("sm"), flex: 1, fontSize: "12px", minHeight: "40px" }}>Hide all</button>
        </div>
      )}

      {/* What is behind what is drawn. A line from four shots and a line
          from four hundred look identical, so the count is not a detail
          -- it is the difference between a pattern and an anecdote. */}
      <div style={{ fontSize: "11px", color: C.textMuted, lineHeight: 1.5 }}>
        {shown.length === 0
          ? "Nothing on the lane — turn a ball back on."
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
