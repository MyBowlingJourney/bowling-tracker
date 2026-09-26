import { useState, useMemo, useRef, useEffect } from "react";
import { C, S, F } from "./ui.jsx";
import { patternScoreband, patternLengthByName } from "./domain/oilPatterns.js";
import { lanePath, RACK, MARK_BOARDS, pocketPins } from "./domain/lanePath.js";
import { ballComparison, ballLine, ARROWS_FEET, BREAKPOINT_FEET } from "./domain/ballComparison.js";
import { isSplit, isCornerPinLeave } from "./domain/splits.js";
import {
  shotsAt, nightsIn, patternsIn, positionLabel, typicalGames,
  patternLengthFor, drawLengthFor, nightChoices, SLIDER_STEPS, HOUSE_PATTERN,
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

// A dropdown that looks like one.
//
// S.sel carries `appearance: none`, which strips the platform's own
// dropdown arrow. Everywhere else in the app that is fine, because the
// select sits in a form next to other fields and inherits the fact that
// it is one. Here it sits alone under a heading, full width, showing a
// sentence -- "House · 14 nights", "Every night, by position in the
// block" -- so with the arrow gone it reads as a caption describing the
// card rather than a control that changes it. Both filters were being
// missed for that reason.
//
// So the affordance is put back explicitly, three ways at once, because
// on a touch screen there is no hover to discover it with:
//   a caption above, naming what the control picks;
//   a chevron in a tinted well on the trailing edge;
//   an accent-tinted border, so it reads as live rather than as a box
//   drawn round some text.
//
// The chevron is aria-hidden and the select keeps its own accessible
// name: to a screen reader this was always announced as a combo box,
// and none of this is for its benefit.
function Picker({ label, value, onChange, children }) {
  return (
    <div style={{ marginBottom: "8px" }}>
      <div style={{ fontSize: "11px", color: C.textMuted, fontFamily: F.body,
        marginBottom: "3px", letterSpacing: "0.02em" }}>{label}</div>
      <div style={{ position: "relative" }}>
        <select
          aria-label={label}
          value={value}
          onChange={onChange}
          style={{
            ...S.sel,
            width: "100%",
            // Room for the well, so a long pattern name never slides
            // under the chevron.
            paddingRight: "46px",
            border: `1px solid ${C.accent}59`,
            fontWeight: 600,
            cursor: "pointer",
          }}>
          {children}
        </select>
        {/* The chevron well is drawn for every select by styles.css. */}
      </div>
    </div>
  );
}

// Green above, red below, muted at dead level.
//
// Zero takes the muted colour rather than the green: "+0" painted as a
// gain is a claim the number does not make.
const deltaColour = d => (d > 0 ? C.strike : (d < 0 ? C.miss : C.textMuted));

export default function LanePane({
  shots = [], bowler = "", league = "", leftHanded = false,
  colors = {}, allBalls = [], lanePatterns = [],
  drift, lateralOffset, twoHanded = false, oilPatterns = [],
  patternScores = [], overallAverage = null, leaguePatterns = {},
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

  // Whose shots, and which league.
  //
  // `shots` arrives UNFILTERED -- ballComparison has always done its own
  // filtering from the bowler and league props, so nothing downstream
  // noticed. The picker did not, and nights are bucketed by DATE: a
  // bowler in two leagues that both bowl Monday had the two nights
  // merged into one, with whichever league's pattern happened to be
  // recorded put on both. Different house, different oil, one line.
  const mine = useMemo(() => (Array.isArray(shots) ? shots : []).filter(s =>
    s && typeof s === "object"
    && (!bowler || s.bowler === bowler)
    && (!league || s.league === league)), [shots, bowler, league]);

  const nights = useMemo(() => nightsIn(mine, lanePatterns, leaguePatterns),
    [mine, lanePatterns, leaguePatterns]);
  const patterns = useMemo(() => patternsIn(mine, lanePatterns, leaguePatterns),
    [mine, lanePatterns, leaguePatterns]);

  // Always exactly one pattern. There is no "every pattern".
  //
  // Averaging a house night and a sport block into one line describes a
  // shot nobody threw -- and the breakpoint it draws has to come from
  // one length or the other, so the mixed bucket was picking one
  // silently. The house shot is the default because that is where nearly
  // every league night is bowled; failing that, the most-bowled pattern.
  const [pattern, setPattern] = useState(() => {
    const list = patternsIn(mine, lanePatterns, leaguePatterns);
    if (list.some(p => p.name === HOUSE_PATTERN)) return HOUSE_PATTERN;
    return list.length ? list[0].name : HOUSE_PATTERN;
  });
  // The nights this pattern was bowled on, and which of them is showing.
  // See nightChoices -- the two filters used to be independent, which let
  // you ask for a night the pattern was never bowled on.
  const { nights: visibleNights, night: activeNight } = useMemo(
    () => nightChoices(nights, pattern, night), [nights, pattern, night]);

  const games = useMemo(() => typicalGames(shots), [shots]);
  // Collapsed. The headline answers the question most of the time; the
  // ranking is for the bowler who wants to know where this pattern sits.
  const [rankOpen, setRankOpen] = useState(false);

  // How the bowler SCORES on the pattern they are looking at, and where
  // it sits against the others. Null whenever there is nothing honest to
  // say -- see patternScoreband; chiefly, with only one pattern the delta
  // is the bowler's average against itself.
  const band = useMemo(
    () => patternScoreband(patternScores, pattern),
    [patternScores, pattern]);

  // Scrubbing off means the card behaves exactly as it did before: one
  // line per ball, every shot behind it.
  const scrubbing = at !== null;

  const { lines, sampleNights, sampleShots, breakFeet } = useMemo(() => {
    const picked = scrubbing || pattern || activeNight
      ? shotsAt(mine, { at: at ?? 0.5, date: activeNight, pattern, lanePatterns,
                         leagueDefaults: leaguePatterns,
                         halfWindow: scrubbing ? 0.15 : 1 })
      : { shots: mine, nights: nights.length };

    // Where the ball turns, in feet. Resolved for the pattern ON SCREEN,
    // and never borrowed from another one.
    //
    // A chosen pattern sets it: a 47-foot block turns the ball later than
    // a 36-foot one, and drawing both at one length would put the same
    // breakpoint on patterns that play nothing alike.
    //
    // In order: what the bowler wrote down for the night, then their own
    // saved entry for that pattern, then the published spec. When none of
    // those knows, it is the 40-foot house default.
    //
    // NOT patternLengthForLeague, which is what this used to end in. That
    // returns the length of the most recent NAMED pattern in the league,
    // so one 37-foot sport night became the length drawn for every other
    // pattern on screen -- including the house shot, which broke at 37
    // instead of 40 until Ryan caught it. The house shot was only the
    // most visible case; a named pattern whose length nobody entered had
    // exactly the same leak with a different label on it.
    //
    // An unrecorded length means nobody measured it, and the honest
    // reading of that is house conditions -- not "whatever block we
    // happened to bowl last".
    const feet = drawLengthFor(pattern, {
      lanePatterns, oilPatterns,
      lengthByName: patternLengthByName,
      houseFeet: BREAKPOINT_FEET,
    });

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
  }, [mine, at, activeNight, pattern, lanePatterns, leaguePatterns, bowler, league, leftHanded,
      drift, lateralOffset, twoHanded, oilPatterns, scrubbing, nights.length]);


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

  // Which half of the lane the bowler's own lines live on, decided once.
  //
  // Board 1 is their own gutter, so a left-hander's lines are on the
  // LEFT of the screen and everything that must stay clear of them --
  // the filter column, the breakpoint label -- goes right. A right-
  // hander is the mirror.
  //
  // `leftHanded` here is already the hand the BALL behaves like, not
  // necessarily the hand the bowler calls themselves: a right-hander
  // throwing a backup ball plays the left side of the lane, so their
  // filter belongs on the right along with everything else about them
  // that is geometrically left-handed.
  const labelSide = leftHanded ? "right" : "left";

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

  // Whether the ball list is taller than the space it is given.
  //
  // Measured from the element rather than inferred from how many balls
  // there are: the cap is in dvh, so it moves with the phone, with the
  // address bar showing or hidden, and with whatever the controls above
  // took. A ball-count threshold would be right on one handset and wrong
  // on the next.
  const filterRef = useRef(null);
  const [filterOverflow, setFilterOverflow] = useState(false);
  const checkFilterOverflow = () => {
    const el = filterRef.current;
    if (!el) return;
    // Not just "does it overflow" but "is there anything BELOW" -- once
    // scrolled to the bottom the hint is a lie, and a permanent arrow
    // pointing at nothing is how a control stops being believed.
    const more = el.scrollHeight - el.clientHeight - el.scrollTop > 1;
    setFilterOverflow(prev => (prev === more ? prev : more));
  };
  // Keyed on the number of chips, which is the only thing that changes
  // the content's height -- the text inside a chip changes as you scrub,
  // its height does not. Re-running every render would re-bind the
  // listener on every slider step for no new information.
  useEffect(() => {
    checkFilterOverflow();
    // The address bar sliding away changes dvh without a re-render.
    window.addEventListener("resize", checkFilterOverflow);
    return () => window.removeEventListener("resize", checkFilterOverflow);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allBalls.length]);

  // After every hook, never before one: returning early above a hook
  // means the first night with a ball renders more hooks than the render
  // before it, and React throws.
  if (!allBalls.length) return null;

  // ── The filter column ─────────────────────────────────────────────
  //
  // Placed by labelSide, the same rule the breakpoint label uses, so the
  // two can never end up on opposite assumptions about which half of the
  // lane is busy.
  const filterColumn = (
    <div style={{ position: "relative", width: "96px", flexShrink: 0 }}>
    <div ref={filterRef} onScroll={checkFilterOverflow}
      style={{ width: "100%", display: "flex",
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
    {/* There are more balls below.
    
        The column is capped at the lane's height so the diagram and the
        slider stay on one screen, and it has always scrolled past that
        -- silently. A chip at 44px (the touch-target floor, not a number
        worth shaving) plus its gap means a bag of eight fits on a small
        phone and ten does not, so the balls past the fold were simply
        invisible, with a filter that looked complete.
        
        Measured rather than guessed from a ball count: the cap is in
        dvh, so how many fit depends on the phone, the address bar and
        the two dropdowns above. The fade is aria-hidden and lets taps
        through -- it is a hint, not a control. */}
    {filterOverflow && (
      <div aria-hidden="true" style={{
        position: "absolute", left: 0, right: 0, bottom: 0, height: "26px",
        pointerEvents: "none", borderRadius: "0 0 8px 8px",
        backgroundImage: `linear-gradient(to bottom, transparent, ${C.card})`,
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        color: C.textMuted, fontSize: "10px", fontFamily: F.num,
      }}>more ▾</div>
    )}
    </div>
  );

  return (
    <>
      {/* Oil pattern, directly above the lane. The single biggest thing
          outside the bowler that decides the line, so it sits with the
          line rather than filed under the centre -- and choosing one
          redraws the breakpoint at that pattern's own length. */}
      {/* Always shown, whenever there is a pattern at all.
      
          It has now been hidden twice for being clever: once on a
          condition that required a NAMED pattern, so a season of
          ordinary league nights showed nothing, and once on "more than
          one bucket", which hides it for exactly the bowler who only
          ever bowls the house shot -- who then cannot see what the lane
          is drawn from, or that the filter exists at all.
          
          A dropdown showing "House · 14 nights" with nothing else in it
          is not a useless control. It is the card telling you what it is
          showing you. */}
      {/* The two filters, on one row.
      
          They are read together -- "the house shot, across every night"
          is one sentence -- and stacked they pushed the lane far enough
          down that the diagram and the slider stopped sharing a screen,
          which is the whole feature.
          
          Wrapping rather than shrinking below a usable width: on a
          narrow phone they fall back to a stack, which is worse than
          side by side and much better than two dropdowns too cramped to
          read a pattern name in. */}
      {(patterns.length > 0 || visibleNights.length > 1) && (
        <div data-i18n="picker" style={{ display: "flex", gap: "8px", flexWrap: "wrap",
          alignItems: "flex-start" }}>
          {patterns.length > 0 && (
            <div style={{ flex: "1 1 140px", minWidth: 0 }}>
              <Picker label="Oil pattern" value={pattern}
                onChange={e => setPattern(e.target.value)}>
                {/* The name alone. How many nights are behind it is
                    said once, at the bottom of the card, against the
                    sample actually drawn -- which is the number that
                    matters and is not the same as the count here once a
                    night or a scrub position is chosen. */}
                {patterns.map(p => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))}
              </Picker>
            </div>
          )}

          {/* Pooling every night is the default because it has the data
              behind it; one night is for reviewing the night you just
              bowled.
          
              The nights are already narrowed to the pattern beside them,
              so neither the pattern name nor an explanation of how the
              pooling works belongs in the option text -- it was the
              longest string in the card and it said the same thing on
              every row. */}
          {visibleNights.length > 1 && (
            <div style={{ flex: "1 1 140px", minWidth: 0 }}>
              <Picker label="Which nights" value={activeNight}
                onChange={e => setNight(e.target.value)}>
                <option value="">Every night</option>
                {visibleNights.map(n => (
                  <option key={n.date} value={n.date}>
                    {n.date} · {n.games} games
                  </option>
                ))}
              </Picker>
            </div>
          )}
        </div>
      )}

      {/* How you score on it, and where it sits.

          This is the old "By Oil Pattern" card, which used to sit on its
          own in the centre group -- a ranked list of every pattern against
          the overall average, across the screen from the lane diagram those
          patterns explain. Here the pattern is already chosen, so the
          chosen one is the headline and the rest open underneath.

          It is absent, not empty, whenever there is nothing honest to put
          in it: with a single pattern the pattern average and the overall
          average come off the same games, so the delta is the bowler's
          average against itself. A row saying "+0 vs overall" between the
          picker and the lane is a row that costs height and teaches
          nothing. */}
      {band && (
        <div style={{ marginBottom: "8px", borderRadius: "11px",
          border: `1px solid ${C.border}`, backgroundColor: C.bg,
          overflow: "hidden" }}>
          <button type="button"
            onClick={() => setRankOpen(o => !o)}
            aria-expanded={rankOpen}
            style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              gap: "10px", width: "100%", padding: "10px 12px", minHeight: "44px",
              background: "none", border: "none", cursor: "pointer",
              fontFamily: F.body, textAlign: "left",
              WebkitTapHighlightColor: "transparent",
            }}>
            <span style={{ display: "flex", alignItems: "baseline", gap: "7px",
              flexWrap: "wrap", minWidth: 0 }}>
              {/* "Avg" says what the big number is. Without it, 198 beside
                  a pattern name could be a score, a count or a board. */}
              <span style={{ fontSize: "12px", fontWeight: 600, color: C.textMuted }}>Avg</span>
              <span style={{ fontFamily: F.num, fontSize: "20px", fontWeight: 600,
                color: C.text }}>{band.here.average}</span>
              <span style={{ fontFamily: F.num, fontSize: "13px", fontWeight: 600,
                color: deltaColour(band.here.versusOverall) }}>
                {band.here.versusOverall > 0 ? "+" : ""}{band.here.versusOverall}
              </span>
              {/* Named, not just "vs overall". 198 means nothing on its
                  own and neither does +7; the sentence a bowler plans
                  practice around is the one with both numbers in it. */}
              <span style={{ fontSize: "12px", color: C.textMuted }}>
                vs your {overallAverage} overall
                {" · "}{band.here.games} game{band.here.games === 1 ? "" : "s"}
              </span>
            </span>
            <span aria-hidden="true" style={{ fontSize: "11px", color: C.textMuted,
              whiteSpace: "nowrap", flexShrink: 0 }}>
              {rankOpen ? "▲" : "▼"} {band.others.length} more
            </span>
          </button>
          {rankOpen && (
            <div style={{ borderTop: `1px solid ${C.border}`,
              padding: "6px 12px 10px", backgroundColor: C.surface }}>
              {band.others.map(o => (
                <div key={o.name} style={{ display: "flex", alignItems: "baseline",
                  justifyContent: "space-between", gap: "8px", padding: "4px 0" }}>
                  <span style={{ fontSize: "13px", minWidth: 0, overflow: "hidden",
                    textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.name}</span>
                  <span style={{ fontSize: "12px", color: C.textMuted,
                    fontFamily: F.num, whiteSpace: "nowrap", flexShrink: 0 }}>
                    Avg {o.average}{" "}
                    <strong style={{ color: deltaColour(o.versusOverall) }}>
                      {o.versusOverall > 0 ? "+" : ""}{o.versusOverall}
                    </strong>
                    {" · "}{o.games}g
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* The lane and the filter, side by side. The filter goes on the
          side the bowler's line is NOT on. */}
      <div style={{ display: "flex", gap: "8px", alignItems: "flex-start",
        marginBottom: "8px" }}>
        {labelSide === "left" && filterColumn}
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
                {/* On the side the ball is NOT on, and sitting ON the
                    line rather than beside it.
                
                    Every line on this diagram converges on the pocket,
                    so the busy half of the lane is the bowler's own
                    gutter side -- board 1, which is the RIGHT of the
                    screen for a right-hander. Put the label there and
                    the ball paths are drawn straight through the text.
                
                    The patch behind it is what stops the dashed line
                    striking through the words. */}
                <rect x={labelSide === "left" ? laneL + 2 : laneR - 60}
                  y={y(breakFeet) - 8} width="58" height="11" rx="2"
                  fill={C.card} />
                <text x={labelSide === "left" ? laneL + 4 : laneR - 3}
                  y={y(breakFeet) + 0.5}
                  textAnchor={labelSide === "left" ? "start" : "end"}
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
        {labelSide === "right" && filterColumn}
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
              {activeNight ? " on this night" : sampleNights > 1 ? `, across ${sampleNights} nights` : ""}
              {pattern ? ` on ${pattern}` : ""}
              {". "}
              Solid while it skids, dashed once it turns — where it turns comes from
              the oil pattern rather than from anything you logged.
            </>}
      </div>
    </>
  );
}
