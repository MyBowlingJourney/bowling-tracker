import { useState, useEffect, useRef } from "react";
import { PLACEMENTS } from "./domain/achievements.js";
import { C, S, Chip, CollapsibleCard, LockedNote, StatLead } from "./ui.jsx";
import {
  addGame, removeGame, setGameField, addDay, removeDay, setDayField, updateDay,
  dayTotal, dayAverage, dayGamesEntered, cutMargin,
  tournamentTotal, tournamentTotalWithHandicap, tournamentAverage, tournamentMoney,
  cutMarginWithCarry, carryBefore, tournamentGamesEntered, resolveTournamentGameScore, phaseGameOffsets,
  SCORING_BASES, PIN_FORMATS, PLAY_STYLES,
  scoringBasis, pinFormat, playStyle, cutTarget, describeTournamentFormat} from "./domain/tournaments.js";
import { patternDisplayName, searchPatterns, describePattern, patternStats } from "./domain/oilPatterns.js";
import { leagueFormat, isNoTapLeague } from "./domain/leagueSeasons.js";
import { isBaker, appliesHandicap, bakerFramesFor, BAKER_STARTERS, handicapPins, bakerScoreNote } from "./domain/tournamentFormats.js";


import {
  SIDE_POT_TYPES, addSidePot, removeSidePot, setSidePotField, sidePotMoney, sidePotTotals,
} from "./domain/sidePots.js";
import { canUseBracketsAndSidePots } from "./domain/entitlements.js";
import {
  addMatch, removeMatch, setMatchField, setBonus, matchResult, matchPlayTotals, pinDifferential,
  matchMargin, competitiveness, describeCompetitiveness,
} from "./domain/matchPlay.js";
import {
  addStep, removeStep, setStepField, setStepladderField, stepResult,
  stepladderResult, describeStepladder, ordinal,
} from "./domain/stepladder.js";

function fieldLabel(text) {
  return (
    <div style={{ fontSize:"12px",color:C.textMuted, marginBottom: "4px" }}>
      {text}
    </div>
  );
}

// How the bowler has actually scored on this pattern before, across every
// tournament day that named it. Only appears once there's something real
// to show -- a pattern logged for the first time gets nothing rather than
// a row of dashes, and the current tournament's own in-progress day is
// excluded so it isn't comparing today against itself.
function PatternHistory({ patternName, tournaments, excludeTournamentId }) {
  const [open, setOpen] = useState(false);
  const scoped = (tournaments || []).filter(t => !excludeTournamentId || t.id !== excludeTournamentId);
  const stats = patternStats(scoped, patternName);
  if (!stats || !stats.games) return null;

  const cutText = stats.cutsTracked
    ? `${stats.cutsMade}/${stats.cutsTracked} cuts`
    : null;

  return (
    <div style={{ marginTop: "6px" }}>
      <button
        style={{ background: "none", border: "none", padding: 0, fontSize: "11px", color: C.accent, cursor: "pointer", textAlign: "left" }}
        onClick={() => setOpen(o => !o)}>
        {open ? "▾" : "▸"} Your history: {stats.average} avg over {stats.games} game{stats.games === 1 ? "" : "s"}
        {cutText ? ` · ${cutText}` : ""}
      </button>
      {open && (
        <div style={{ marginTop: "6px", padding: "8px", backgroundColor: C.surface, borderRadius: "8px", border: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
            <div style={{ ...S.statBox, padding: "6px" }}>
              <div style={{ ...S.statNum, fontSize: "16px" }}>{stats.average}</div>
              <div style={S.statLbl}>Average</div>
            </div>
            <div style={{ ...S.statBox, padding: "6px" }}>
              <div style={{ ...S.statNum, fontSize: "16px", color: C.strike }}>{stats.high}</div>
              <div style={S.statLbl}>High</div>
            </div>
            <div style={{ ...S.statBox, padding: "6px" }}>
              <div style={{ ...S.statNum, fontSize: "16px", color: C.textMuted }}>{stats.low}</div>
              <div style={S.statLbl}>Low</div>
            </div>
          </div>
          {stats.days.map((d, i) => (
            <div key={`${d.tournamentId}-${d.dayNumber}-${i}`}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px", fontSize: "11px", paddingBottom: "4px", marginBottom: "4px", borderBottom: i < stats.days.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {d.tournamentName || "Untitled"}
                </div>
                <div style={{ color: C.textMuted, fontSize: "10px" }}>
                  {d.date || "no date"}{d.center ? ` · ${d.center}` : ""}
                  {d.madeCut === true ? " · made cut" : d.madeCut === false ? " · missed cut" : ""}
                </div>
              </div>
              <div style={{ color: C.textMuted, flexShrink: 0 }}>
                {d.scores.length ? d.scores.join(" · ") : "—"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Search-as-you-type over the seeded pattern library, falling back to
// plain free text -- a PBA tournament pattern or a house shot won't be in
// the seed set, and that's expected, not an error state. If it's genuinely
// new, "Save this pattern" adds it to the shared table so it's searchable
// next time, for this bowler or anyone else.
function OilPatternField({ value, onChange, patterns, onSubmitPattern, tournaments, currentTournamentId }) {
  const [focused, setFocused] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newLength, setNewLength] = useState("");
  const [newRatio, setNewRatio] = useState("");
  const [newVolume, setNewVolume] = useState("");
  const [saved, setSaved] = useState(false);

  const matches = focused ? searchPatterns(value, patterns) : [];
  // An exact match (typed in full, or just selected) shows its specs
  // instead of a dropdown -- no point suggesting alternatives to a pattern
  // already fully identified.
  const trimmed = (value || "").trim();
  const exact = (patterns || []).find(p => p.name.toLowerCase() === trimmed.toLowerCase());
  // Worth offering to save once there's a plausible name and it isn't
  // already in the table -- 3 characters keeps this from popping up on
  // every single keystroke of a short partial name.
  const offerToAdd = trimmed.length >= 3 && !exact && !focused;

  function save() {
    onSubmitPattern?.({
      name: trimmed,
      lengthFeet: newLength ? Number(newLength) : null,
      ratio: newRatio.trim(),
      volumeMl: newVolume ? Number(newVolume) : null,
    });
    setAdding(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div style={{ position: "relative" }}>
      {fieldLabel("Oil Pattern")}
      <input style={S.input} placeholder="e.g. Krypton, or type your own"
        value={value}
        onChange={e => { onChange(e.target.value); setAdding(false); setSaved(false); }}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)} />
      {exact && describePattern(exact) && (
        <div style={{ fontSize: "11px", color: exact.verified ? C.accent : C.textMuted, marginTop: "4px" }}>
          {describePattern(exact)}
        </div>
      )}
      {!focused && (
        <PatternHistory patternName={value} tournaments={tournaments} excludeTournamentId={currentTournamentId} />
      )}
      {focused && !exact && matches.length > 0 && (
        <div style={{ position: "absolute", zIndex: 10, left: 0, right: 0, marginTop: "2px", backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: "8px", overflow: "hidden" }}>
          {matches.map(p => (
            <button key={p.id || p.name}
              style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", padding: "8px 10px", cursor: "pointer", color: C.text, borderBottom: `1px solid ${C.border}` }}
              onMouseDown={() => onChange(p.name)}>
              <div style={{ fontSize: "13px", fontWeight: 600 }}>{patternDisplayName(p)}</div>
              {describePattern(p) && <div style={{ fontSize: "11px", color: C.textMuted }}>{describePattern(p)}</div>}
            </button>
          ))}
        </div>
      )}

      {offerToAdd && !adding && !saved && onSubmitPattern && (
        <button style={{ background: "none", border: "none", padding: 0, marginTop: "4px", fontSize: "11px", color: C.accent, cursor: "pointer", textDecoration: "underline" }}
          onClick={() => setAdding(true)}>
          + Save "{trimmed}" for next time
        </button>
      )}
      {saved && (
        <div style={{ fontSize: "11px", color: C.strike, marginTop: "4px" }}>✓ Saved</div>
      )}
      {adding && (
        <div style={{ marginTop: "6px", padding: "8px", backgroundColor: C.surface, borderRadius: "8px", border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: "10px", color: C.textMuted, marginBottom: "6px" }}>
            Length, ratio, and volume are optional — fill in whatever you know.
          </div>
          <div style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
            <input style={{ ...S.input, flex: 1, fontSize: "12px" }} type="number" placeholder="Feet"
              value={newLength} onChange={e => setNewLength(e.target.value)} />
            <input style={{ ...S.input, flex: 1, fontSize: "12px" }} placeholder="Ratio e.g. 3:1"
              value={newRatio} onChange={e => setNewRatio(e.target.value)} />
            <input style={{ ...S.input, flex: 1, fontSize: "12px" }} type="number" placeholder="mL"
              value={newVolume} onChange={e => setNewVolume(e.target.value)} />
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            <button style={{ ...S.btn("primary"), flex: 1, padding: "6px", fontSize: "12px" }} onClick={save}>Save</button>
            <button style={{ ...S.btn(), flex: 1, padding: "6px", fontSize: "12px" }} onClick={() => setAdding(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

function DayDetails({ tournament, day, onChange, canRemoveDay, onRemoveDay, multiDay, oilPatterns, submitOilPattern, tournaments, expanded = true, onToggleExpanded, onUseDate, onGoToScoring }) {
  function update(next) { onChange(next); }

  // Block details only -- date, time, squad, block number.
  //
  // Games moved out to the Scoring tab, and Starting Lanes went
  // with them: a tournament moves pairs after every game, so the
  // pair belongs beside the game it applies to rather than as a
  // single value set once before the block starts.
  return (
    <div style={{ ...S.card, border: `1px solid ${C.border}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        {/* The title toggles; Remove Day stays a separate control so
            a tap meant to collapse a day cannot delete it. */}
        <div style={{ ...S.label, marginBottom: 0, cursor: "pointer", flex: 1 }}
          onClick={onToggleExpanded}>
          {expanded ? "\u25be" : "\u25b8"} {multiDay ? `Day ${day.dayNumber}` : "Squad Details"}
        </div>
        {canRemoveDay && (
          <button style={{ ...S.btn(), padding: "4px 10px", fontSize: "11px" }} onClick={onRemoveDay}>
            Remove Day
          </button>
        )}
      </div>
      {expanded && (<>

      <div style={S.row}>
        <div style={{ flex: 1 }}>
          {fieldLabel("Date")}
          <input style={S.input} type="date" value={day.date}
            onChange={e => {
              update({ ...day, date: e.target.value });
              // Bring the shot context to this squad's date.
              //
              // The block date and the shot-context date were
              // independent, so dating a second squad and then bowling
              // filed those frames under the FIRST squad's date -- they
              // showed up in the wrong block and the new one stayed
              // empty.
              //
              // Only when the bowler is about to log against this block.
              // Back-filling a date on a block already scored should not
              // move where the next shot goes.
              if (onUseDate && e.target.value) onUseDate(e.target.value);
            }} />
        </div>
        <div style={{ flex: 1 }}>
          {fieldLabel("Start Time")}
          <input style={S.input} type="time" value={day.startTime}
            onChange={e => update({ ...day, startTime: e.target.value })} />
        </div>
      </div>

      {/* Squad and block sit together: they are read together off the
          sheet ("A, block 2") and separating them made the block number
          look like it belonged to the oil pattern beside it. */}
      <div style={{ ...S.row, marginTop: "8px" }}>
        <div style={{ flex: 1 }}>
          {fieldLabel("Squad")}
          <input style={S.input} placeholder="e.g. A" value={day.squad}
            onChange={e => update({ ...day, squad: e.target.value })} />
        </div>
        <div style={{ flex: 1 }}>
          {fieldLabel("Block #")}
          <input style={S.input} placeholder="e.g. 2" value={day.blockNumber}
            onChange={e => update({ ...day, blockNumber: e.target.value })} />
        </div>
      </div>

      <div style={{ ...S.row, marginTop: "8px" }}>
        <div style={{ flex: 1 }}>
          <OilPatternField
            value={day.oilPattern}
            onChange={v => update({ ...day, oilPattern: v })}
            patterns={oilPatterns}
            onSubmitPattern={submitOilPattern}
            tournaments={tournaments}
            currentTournamentId={tournament?.id} />
        </div>
      </div>

      {/* The cut moved to Scoring, at the top of this block's games:
          it is posted while the block is being bowled, not while it is
          being set up, and the margin only means anything next to the
          scores it is measured against. */}

      {/* Straight to this squad's games.
          
          Without it the bowler sets a squad up, switches to Scoring, and
          has to work out which card is the one they just made -- which
          gets worse with every squad added. */}
      {onGoToScoring && (
        <button style={{ ...S.btn("primary"), width: "100%", marginTop: "10px" }}
          onClick={() => onGoToScoring(day)}>
          Go to scoring{day.date ? ` — ${day.date}` : ""} {"\u2192"}
        </button>
      )}
      </>)}
    </div>
  );
}

function DayScoring({ tournament, day, onChange, multiDay, shotScores, shotScoresByDate, expanded = true, onToggleExpanded, carry = null, onGoToPhase = null }) {
  const total = dayTotal(day, shotScores);
  const avg = dayAverage(day, shotScores);
  const entered = dayGamesEntered(day, shotScores);
  // A cut after the first block is posted against everything bowled so
  // far, so day two onwards carries day one's pins into the comparison.
  const carrying = !!carry && (carry.games > 0);
  const margin = carrying ? cutMarginWithCarry(day, shotScores, carry) : cutMargin(day, shotScores);
  const cumGames = entered + (carrying ? carry.games : 0);
  const cumTotal = (total ?? 0) + (carrying ? carry.total : 0);
  // Score and completeness come from ONE entry per game.
  //
  // They used to be two props -- the score map and a separate map of raw
  // shots -- and when the second arrived empty every game read as
  // unfinished: scores present, nothing filled, no way to tell that from
  // a genuinely half-bowled block.
  const entry = g => {
    const e = shotScores ? shotScores[String(g.gameNumber)] : null;
    if (e === null || e === undefined) return null;
    // A bare number is an older shape; treat it as finished.
    return typeof e === "number" ? { score: e, complete: true } : e;
  };
  const derived = g => { const e = entry(g); return e && Number.isFinite(Number(e.score)) ? Number(e.score) : null; };
  const gameComplete = g => !!entry(g)?.complete;

  // Frame-tracked scores are WRITTEN into the games, not just shown
  // behind them.
  //
  // A placeholder was not enough: the number has to be in the field, so
  // it saves with the tournament, survives a reload and reads as a
  // recorded score rather than a hint. A bowler frame-tracking a block
  // should never have to copy their own scores across.
  //
  // scoreAuto marks a score this filled in. While it is set, the frames
  // keep the field up to date as the game is bowled. The moment the
  // bowler types over it the flag clears and the app stops touching it
  // -- the house scorer wins, and a mis-tapped frame stays correctable.
  useEffect(() => {
    // Scores arrived but this block got none, or none of its games
    // matched. That is the half the LogView instrumentation cannot see.
    if (!shotScores) {
      if (shotScoresByDate && Object.keys(shotScoresByDate).length) {
      }
      return;
    }

    let next = day;
    let changed = false;
    // Why each game was skipped. Every branch below is a silent
    // `continue`, so a fill that does nothing produced no evidence at
    // all -- which is exactly what happened.
    const skipped = [];

    for (const g of day.games || []) {
      const v = derived(g);
      if (v === null) { skipped.push(`g${g.gameNumber}:no-score`); continue; }

      // Only once the game is FINISHED.
      //
      // A running total climbing in the score box during the game reads
      // as a final score and invites the bowler to leave it, or to
      // wonder why it keeps changing. The number appears when it is the
      // number.
      if (!gameComplete(g)) { skipped.push(`g${g.gameNumber}:incomplete(${v})`); continue; }

      const typedOver = g.score !== "" && !g.scoreAuto;
      if (typedOver) { skipped.push(`g${g.gameNumber}:typed(${g.score})`); continue; }
      if (String(g.score) === String(v) && g.scoreAuto) { skipped.push(`g${g.gameNumber}:already`); continue; }

      next = setGameField(next, g.gameNumber, "score", String(v));
      next = setGameField(next, g.gameNumber, "scoreAuto", true);
      changed = true;
    }
    if (changed) update(next);
    else if (skipped.length) {
    }

    // day.games is the dependency that matters; shotScores changes as
    // frames land.
  }, [shotScores, day]);

  function update(next) { onChange(next); }

  return (
    <>
    {/* The cut, in its own card above the games: it is the target every
        game below is bowled against, and it is posted during the block
        rather than before it. Set up carries what the block IS; this
        carries how it is going.

        Two rows, everything on a line with its label -- it was seven
        stacked rows and a paragraph of explanation, which pushed the
        first game off a phone screen. */}
    {expanded && (
      <div style={{ ...S.card, border: `1px solid ${C.border}`, padding: "10px 12px", marginBottom: "8px" }}>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <div style={{ ...S.label, marginBottom: 0, flex: "0 0 auto" }}>Cut</div>
          {/* The sign, before the number, because that is how a cut is
              read out: "plus one fifty", not "one fifty, over". */}
          <div style={{ ...S.chips, marginBottom: 0, flex: "0 0 auto" }}>
            {["+", "-"].map(sign => (
              <Chip key={sign} label={sign} dense
                selected={(day.cutSign || "+") === sign}
                onToggle={() => update({ ...day, cutSign: sign })} />
            ))}
          </div>
          <input style={{ ...S.input, flex: 1, minWidth: 0, fontSize: "13px", padding: "6px 10px" }}
            type="number" inputMode="numeric"
            placeholder="Pins vs 200 avg"
            value={day.cutLine} onChange={e => update({ ...day, cutLine: e.target.value })} />
          {margin !== null && (
            <div style={{ flex: "0 0 auto", fontSize: "12px", fontWeight: 700, color: margin >= 0 ? C.strike : C.miss }}>
              {margin >= 0 ? `▲ +${margin}` : `▼ ${margin}`}
            </div>
          )}
        </div>
        {day.cutLine !== "" && cumGames > 0 && (
          <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "4px" }}>
            {/* Cumulative when it is cumulative, and it says so: a
                bowler reading "1230 of 1350" has to be able to tell
                whether that is this block or the whole event. */}
            {cumTotal} of {(200 * cumGames) + (day.cutSign === "-" ? -Number(day.cutLine || 0) : Number(day.cutLine || 0))}
            {" across "}{cumGames} game{cumGames === 1 ? "" : "s"}
            {carrying ? " (all blocks so far)" : ""}.
          </div>
        )}

        {/* What this block led to. Whether they MADE the cut is the sign
            of the margin above -- asking as well invited two answers
            that could disagree. What the app cannot work out is which
            phase came next, which is the question worth asking. */}
        <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "8px", flexWrap: "wrap" }}>
          <div style={{ ...S.label, marginBottom: 0, flex: "0 0 auto" }}>Qualified for</div>
          <div style={{ ...S.chips, marginBottom: 0 }}>
            <Chip label="Match play" dense selected={day.nextRound === "match"} color={C.strike}
              onToggle={() => update({ ...day, nextRound: day.nextRound === "match" ? null : "match" })} />
            <Chip label="Stepladder" dense selected={day.nextRound === "stepladder"} color={C.strike}
              onToggle={() => update({ ...day, nextRound: day.nextRound === "stepladder" ? null : "stepladder" })} />
            <Chip label="N/A" dense selected={day.nextRound === "na"}
              onToggle={() => update({ ...day, nextRound: day.nextRound === "na" ? null : "na" })} />
          </div>
        </div>
        {onGoToPhase && (day.nextRound === "match" || day.nextRound === "stepladder") && (
          <button style={{ ...S.btn("primary"), width: "100%", marginTop: "8px" }}
            onClick={() => onGoToPhase(day.nextRound)}>
            Go to {day.nextRound === "match" ? "match play" : "the stepladder"} {"→"}
          </button>
        )}
      </div>
    )}
    <div style={{ ...S.card, border: `1px solid ${C.border}` }}>
      {/* A finished block is worth folding away -- a four-day event
          is four of these and only the current one matters. */}
      <div style={{ ...S.label, marginBottom: expanded ? "8px" : 0, cursor: "pointer" }}
        onClick={onToggleExpanded}>
        {expanded ? "\u25be" : "\u25b8"} {multiDay ? `Day ${day.dayNumber}` : "Games"}
      </div>
      {expanded && (<>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <div style={S.label}>Games</div>
        <button style={{ ...S.btn(), padding: "4px 12px", fontSize: "12px" }} onClick={() => update(addGame(day))}>
          + Game
        </button>
      </div>
      <div style={{ fontSize: "11px", color: C.textMuted, marginBottom: "8px" }}>
        Tournaments usually move pairs after every game, so each game gets its own.
      </div>

      {(day.games || []).map(g => (
        <div key={g.gameNumber} style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "6px" }}>
          <div style={{ fontSize: "12px", color: C.textMuted, width: "28px" }}>G{g.gameNumber}</div>
          {/* Shows the frames when nothing has been typed.

              A bowler frame-tracking a tournament should not have to
              copy their own score into this box -- the app already knows
              it. Shown as a placeholder rather than written into the
              field, so it stays derived: type over it and the typed
              number wins, clear the box and the frames come back.

              resolveTournamentGameScore applies the same rule to every
              total, so what shows here is what the cut line uses. */}
          <input style={{ ...S.input, flex: 1, fontSize: "13px", padding: "6px 10px",
              /* C.text, not undefined -- an explicit undefined here
                 overrode S.input's own colour and left the text black,
                 invisible on the dark palette.

                 A frame-filled score is shown in full colour, not greyed:
                 it IS the score now, saved with the tournament, not a
                 suggestion. */
              color: C.text }}
            type="number" inputMode="numeric"
            placeholder="Score"
            value={g.score}
            onChange={e => update(setGameField(
              setGameField(day, g.gameNumber, "scoreAuto", false),
              g.gameNumber, "score", e.target.value))} />
          <input style={{ ...S.input, flex: 1, fontSize: "13px", padding: "6px 10px" }}
            placeholder="Pair" value={g.lanePair}
            onChange={e => update(setGameField(day, g.gameNumber, "lanePair", e.target.value))} />
          {(day.games || []).length > 1 && (
            <button style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: "16px", padding: "0 4px" }}
              onClick={() => update(removeGame(day, g.gameNumber))} aria-label={`Remove game ${g.gameNumber}`}>×</button>
          )}
        </div>
      ))}

      {total !== null && (
        <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
          <div style={S.statBox}>
            <div style={{ ...S.statNum, fontSize: "18px", color: C.accent }}>{total}</div>
            <div style={S.statLbl}>Total ({entered}g)</div>
          </div>
          <div style={S.statBox}>
            <div style={{ ...S.statNum, fontSize: "18px" }}>{avg === null ? "—" : avg.toFixed(1)}</div>
            <div style={S.statLbl}>Average</div>
          </div>
        </div>
      )}

      <div style={{ ...S.label, marginTop: "10px" }}>Day Notes</div>
      <textarea style={{ ...S.input, minHeight: "50px", resize: "vertical" }}
        placeholder="Transition, ball reaction, what worked…"
        value={day.notes} onChange={e => update({ ...day, notes: e.target.value })} />
      </>)}
    </div>
    </>
  );
}

// Itemised side action. Each row is one purchase -- four brackets at $5
// is one row with entries=4, not four rows.
function SidePots({ tournament, onChange }) {
  const [open, setOpen] = useState(true);
  // Confirmation flash only, matching league > Side games: the value is
  // already written on every keystroke through onChange. The button
  // exists because a bowler who types a figure and walks away has no
  // other signal that it landed.
  const [wSaved, setWSaved] = useState(false);
  const pots = tournament.sidePots || [];
  const totals = sidePotTotals(pots);

  return (
    <div style={S.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
        <div style={{ ...S.label, marginBottom: 0, cursor: "pointer" }} onClick={() => setOpen(o => !o)}>
          {open ? "\u25be" : "\u25b8"} Brackets &amp; Side Pots
        </div>
        {totals.count > 0 && (
          <div style={{ fontSize: "12px", fontWeight: 700, color: totals.net >= 0 ? C.strike : C.miss }}>
            {totals.net < 0 ? "\u2212" : ""}${Math.abs(totals.net).toFixed(2)}
          </div>
        )}
      </div>
      {/* The toggle flipped `open` and nothing read it, so this card
          never actually collapsed. */}
      {open && (<>
      <div style={{ fontSize: "11px", color: C.textMuted, marginBottom: "10px" }}>
        Tracked separately from the main entry, so you can see which of these actually pay for themselves.
      </div>

      {pots.map(pot => {
        const m = sidePotMoney(pot);
        return (
          <div key={pot.id} style={{ padding: "10px", marginBottom: "8px", backgroundColor: C.surface, borderRadius: "8px", border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
              <select style={{ ...S.sel, flex: 1, fontSize: "12px" }}
                value={pot.type}
                onChange={e => onChange({ ...tournament, sidePots: setSidePotField(pots, pot.id, "type", e.target.value) })}>
                {SIDE_POT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <input style={{ ...S.input, flex: 1, fontSize: "12px" }} placeholder="Label (optional)"
                value={pot.label}
                onChange={e => onChange({ ...tournament, sidePots: setSidePotField(pots, pot.id, "label", e.target.value) })} />
            </div>
            <div style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
              <div style={{ flex: 1 }}>
                {fieldLabel("Entries")}
                <input style={{ ...S.input, fontSize: "12px" }} type="number" inputMode="numeric" placeholder="1"
                  value={pot.entries}
                  onChange={e => onChange({ ...tournament, sidePots: setSidePotField(pots, pot.id, "entries", e.target.value) })} />
              </div>
              <div style={{ flex: 1 }}>
                {fieldLabel("$ Each")}
                <input style={{ ...S.input, fontSize: "12px" }} type="number" inputMode="decimal" placeholder="5"
                  value={pot.costPerEntry}
                  onChange={e => onChange({ ...tournament, sidePots: setSidePotField(pots, pot.id, "costPerEntry", e.target.value) })} />
              </div>
              <div style={{ flex: 1 }}>
                {fieldLabel("Won")}
                <input style={{ ...S.input, fontSize: "12px" }} type="number" inputMode="decimal" placeholder="0"
                  value={pot.winnings}
                  onChange={e => onChange({ ...tournament, sidePots: setSidePotField(pots, pot.id, "winnings", e.target.value) })} />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "11px", color: C.textMuted }}>
                Cost ${m.cost.toFixed(2)} &middot;{" "}
                <span style={{ color: m.net >= 0 ? C.strike : C.miss, fontWeight: 600 }}>
                  {m.net < 0 ? "\u2212" : "+"}${Math.abs(m.net).toFixed(2)}
                </span>
              </div>
              <button style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: "11px", textDecoration: "underline", padding: 0 }}
                onClick={() => onChange({ ...tournament, sidePots: removeSidePot(pots, pot.id) })}>
                Remove
              </button>
            </div>
          </div>
        );
      })}

      {totals.byType.length > 1 && (
        <div style={{ marginBottom: "8px", paddingTop: "8px", borderTop: `1px solid ${C.border}` }}>
          {totals.byType.map(b => (
            <div key={b.type} style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "2px" }}>
              <span style={{ color: C.textMuted }}>{b.type} ({b.entries})</span>
              <span style={{ color: b.net >= 0 ? C.strike : C.miss }}>
                {b.net < 0 ? "\u2212" : "+"}${Math.abs(b.net).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}

      <div style={S.chips}>
        {SIDE_POT_TYPES.slice(0, 3).map(t => (
          <button key={t} style={{ ...S.btn(), padding: "6px 10px", fontSize: "12px" }}
            onClick={() => onChange({ ...tournament, sidePots: addSidePot(pots, t) })}>
            + {t}
          </button>
        ))}
      </div>

      {/* The total, read the way league > Side games reads it: won
          leads, paid-in and net are its detail. The small figure beside
          the card header was easy to miss and easy to misread as one
          row's net. */}
      {totals.count > 0 && (
        <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: `1px solid ${C.border}` }}>
          <StatLead
            value={`$${totals.won.toFixed(2)}`}
            caption="won in brackets" color={C.strike}
            detail={`$${totals.cost.toFixed(2)} paid in — ${totals.net >= 0 ? "up" : "down"} $${Math.abs(totals.net).toFixed(2)} on side action.`} />
        </div>
      )}

      <button style={{ ...S.btn("primary"), marginTop: "4px" }}
        onClick={() => { setWSaved(true); setTimeout(() => setWSaved(false), 1500); }}>
        {wSaved ? "✓ Winnings Saved" : "Save Winnings"}
      </button>
      </>)}
    </div>
  );
}

// Match play: the head-to-head block after the cut.
function MatchPlay({ tournament, onChange, onGoToPhase = null, shotScores = null, gameStart = 0, onUseGame = null }) {
  const [open, setOpen] = useState(true);
  const mp = tournament.matchPlay || {};
  const matches = mp.matches || [];
  const totals = matchPlayTotals(mp);
  const diff = pinDifferential(mp);
  const comp = competitiveness(mp);

  function update(next) { onChange({ ...tournament, matchPlay: next }); }

  // Which game of the day each match is. Qualifying already used games
  // 1..n on this date, so match 1 is the game after those -- see
  // phaseGameOffsets.
  const gameFor = m => gameStart + Number(m?.matchNumber || 0);

  // The same fill qualifying does, for a match: a bowler tracking
  // frames should never have to copy their own score across. Only once
  // the game is FINISHED (a running total in the box reads as a final
  // score), only while the app put it there (scoreAuto), and never over
  // something typed.
  useEffect(() => {
    if (!shotScores) return;
    let next = mp;
    let changed = false;
    for (const m of matches) {
      const e = shotScores[String(gameFor(m))];
      if (e === null || e === undefined) continue;
      const entry = typeof e === "number" ? { score: e, complete: true } : e;
      const v = Number(entry?.score);
      if (!Number.isFinite(v)) continue;
      if (!entry?.complete) continue;
      const typedOver = m.yourScore !== "" && !m.scoreAuto;
      if (typedOver) continue;
      if (String(m.yourScore) === String(v) && m.scoreAuto) continue;
      next = setMatchField(next, m.matchNumber, "yourScore", String(v));
      next = setMatchField(next, m.matchNumber, "scoreAuto", true);
      changed = true;
    }
    if (changed) update(next);
  }, [shotScores, mp]);

  return (
    <div style={S.card}>
      <div style={{ ...S.label, marginBottom: 0, cursor: "pointer" }} onClick={() => setOpen(o => !o)}>
        {open ? "\u25be" : "\u25b8"} Match Play
      </div>
      {open && (<>
      <div style={{ fontSize: "11px", color: C.textMuted, marginBottom: "10px" }}>
        The head-to-head block after the cut. Bonus pins vary by tournament — set them to whatever this event uses.
      </div>

      <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
        <div style={{ flex: 1 }}>
          {fieldLabel("Bonus per win")}
          <input style={{ ...S.input, fontSize: "12px" }} type="number" inputMode="numeric"
            value={mp.bonusPerWin ?? ""} onChange={e => update(setBonus(mp, "bonusPerWin", e.target.value))} />
        </div>
        <div style={{ flex: 1 }}>
          {fieldLabel("Bonus per tie")}
          <input style={{ ...S.input, fontSize: "12px" }} type="number" inputMode="numeric"
            value={mp.bonusPerTie ?? ""} onChange={e => update(setBonus(mp, "bonusPerTie", e.target.value))} />
        </div>
      </div>

      {matches.map(m => {
        const result = matchResult(m);
        const margin = matchMargin(m);
        const color = result === "win" ? C.strike : result === "loss" ? C.miss : result === "tie" ? C.spare : C.textMuted;
        return (
          <div key={m.matchNumber} style={{ padding: "10px", marginBottom: "8px", backgroundColor: C.surface, borderRadius: "8px", border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <div style={{ fontSize: "12px", fontWeight: 600 }}>
                Match {m.matchNumber}
                {result && <span style={{ color, marginLeft: "6px", textTransform: "uppercase", fontSize: "10px" }}>{result}</span>}
                {/* The margin, right beside the result: losing by 5 and
                    losing by 60 are the same word but not the same night. */}
                {margin !== null && margin !== 0 && (
                  <span style={{ color: C.textMuted, marginLeft: "6px", fontSize: "11px", fontWeight: 400 }}>
                    by {Math.abs(margin)}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                {/* Points the frame tracker at THIS match: its game
                    number for the day, frame 1. Without it the shot
                    context stayed on whatever qualifying left it at,
                    and the frames landed on a qualifying game. */}
                {onUseGame && (
                  <button style={{ background: "none", border: "none", color: C.accent, cursor: "pointer", fontSize: "11px", textDecoration: "underline", padding: 0 }}
                    onClick={() => onUseGame(gameFor(m))}>
                    Track frames (G{gameFor(m)})
                  </button>
                )}
                <button style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: "11px", textDecoration: "underline", padding: 0 }}
                  onClick={() => update(removeMatch(mp, m.matchNumber))}>
                  Remove
                </button>
              </div>
            </div>
            <div style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
              <input style={{ ...S.input, flex: 2, fontSize: "12px" }} placeholder="Opponent"
                value={m.opponent} onChange={e => update(setMatchField(mp, m.matchNumber, "opponent", e.target.value))} />
              <input style={{ ...S.input, flex: 1, fontSize: "12px" }} placeholder="Lanes"
                value={m.lanePair} onChange={e => update(setMatchField(mp, m.matchNumber, "lanePair", e.target.value))} />
            </div>
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <input style={{ ...S.input, flex: 1, fontSize: "14px", textAlign: "center" }} type="number" inputMode="numeric" placeholder="You"
                value={m.yourScore}
                onChange={e => update(setMatchField(
                  setMatchField(mp, m.matchNumber, "scoreAuto", false),
                  m.matchNumber, "yourScore", e.target.value))} />
              <span style={{ fontSize: "11px", color: C.textMuted }}>vs</span>
              <input style={{ ...S.input, flex: 1, fontSize: "14px", textAlign: "center" }} type="number" inputMode="numeric" placeholder="Them"
                value={m.opponentScore} onChange={e => update(setMatchField(mp, m.matchNumber, "opponentScore", e.target.value))} />
            </div>
          </div>
        );
      })}

      <button style={{ ...S.btn(), width: "100%", marginBottom: matches.length ? "12px" : 0 }}
        onClick={() => update(addMatch(mp))}>
        + Add Match
      </button>

      {totals.played > 0 && (
        <>
          <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
            <div style={S.statBox}>
              <div style={{ ...S.statNum, fontSize: "16px" }}>{totals.wins}-{totals.losses}{totals.ties ? `-${totals.ties}` : ""}</div>
              <div style={S.statLbl}>Record</div>
            </div>
            <div style={S.statBox}>
              <div style={{ ...S.statNum, fontSize: "16px", color: C.textMuted }}>{totals.scratch}</div>
              <div style={S.statLbl}>Scratch</div>
            </div>
            <div style={S.statBox}>
              <div style={{ ...S.statNum, fontSize: "16px", color: C.spare }}>+{totals.bonusPins}</div>
              <div style={S.statLbl}>Bonus</div>
            </div>
            <div style={{ ...S.statBox, border: `1px solid ${C.accent}44` }}>
              <div style={{ ...S.statNum, fontSize: "16px", color: C.accent }}>{totals.total}</div>
              <div style={S.statLbl}>Total</div>
            </div>
          </div>
          <div style={{ fontSize: "11px", color: C.textMuted, textAlign: "center" }}>
            {totals.average} average over {totals.played} match{totals.played === 1 ? "" : "es"}
            {diff !== null && <> &middot; {diff >= 0 ? "+" : "\u2212"}{Math.abs(diff)} pins vs opponents</>}
          </div>

          {/* Record alone can't distinguish being outclassed from losing
              three squeakers. This is the part a bowler actually wants
              after a bad block. */}
          {comp && (
            <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: `1px solid ${C.border}` }}>
              <div style={{ fontSize: "12px", color: C.text, marginBottom: "8px" }}>
                {describeCompetitiveness(tournament.matchPlay)}
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                {comp.avgWinMargin != null && (
                  <div style={S.statBox}>
                    <div style={{ ...S.statNum, fontSize: "15px", color: C.strike }}>+{comp.avgWinMargin}</div>
                    <div style={S.statLbl}>Avg Win</div>
                  </div>
                )}
                {comp.avgLossMargin != null && (
                  <div style={S.statBox}>
                    <div style={{ ...S.statNum, fontSize: "15px", color: C.miss }}>&minus;{comp.avgLossMargin}</div>
                    <div style={S.statLbl}>Avg Loss</div>
                  </div>
                )}
                <div style={S.statBox}>
                  <div style={{ ...S.statNum, fontSize: "15px", color: C.spare }}>{comp.closeCount}</div>
                  <div style={S.statLbl}>Under {comp.closeThreshold}</div>
                </div>
              </div>
              {(comp.biggestWin || comp.worstLoss) && (
                <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "8px" }}>
                  {comp.biggestWin && (
                    <div>Best: match {comp.biggestWin.matchNumber} by {comp.biggestWin.margin}{comp.biggestWin.opponent ? ` vs ${comp.biggestWin.opponent}` : ""}</div>
                  )}
                  {comp.worstLoss && (
                    <div>Worst: match {comp.worstLoss.matchNumber} by {comp.worstLoss.margin}{comp.worstLoss.opponent ? ` vs ${comp.worstLoss.opponent}` : ""}</div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Where match play led, asked the same way qualifying asks it. */}
      <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "12px", flexWrap: "wrap" }}>
        <div style={{ ...S.label, marginBottom: 0, flex: "0 0 auto" }}>Qualified for</div>
        <div style={{ ...S.chips, marginBottom: 0 }}>
          <Chip label="Stepladder" dense color={C.strike}
            selected={tournament.matchPlayNextRound === "stepladder"}
            onToggle={() => onChange({ ...tournament, matchPlayNextRound: tournament.matchPlayNextRound === "stepladder" ? null : "stepladder" })} />
          <Chip label="N/A" dense
            selected={tournament.matchPlayNextRound === "na"}
            onToggle={() => onChange({ ...tournament, matchPlayNextRound: tournament.matchPlayNextRound === "na" ? null : "na" })} />
        </div>
      </div>
      {onGoToPhase && tournament.matchPlayNextRound === "stepladder" && (
        <button style={{ ...S.btn("primary"), width: "100%", marginTop: "8px" }}
          onClick={() => onGoToPhase("stepladder")}>
          Go to the stepladder {"→"}
        </button>
      )}
      </>)}
    </div>
  );
}

// The stepladder finals.
//
// Match play with two things taken away and one added: no bonus pins
// (a step is sudden death), and seeds, which are what decide where a
// bowler finished -- so the app works the finish out rather than asking
// for it. See domain/stepladder.js for the placement rule.
function Stepladder({ tournament, onChange, shotScores = null, gameStart = 0, onUseGame = null }) {
  const [open, setOpen] = useState(true);
  const sl = tournament.stepladder || {};
  const steps = sl.steps || [];
  const result = stepladderResult(sl);

  function update(next) { onChange({ ...tournament, stepladder: next }); }

  // Game numbers carry on from qualifying AND match play, since all of
  // it is the same day's frames -- see phaseGameOffsets.
  const gameFor = st => gameStart + Number(st?.stepNumber || 0);

  // Same fill as qualifying and match play: finished games only, never
  // over a typed score.
  useEffect(() => {
    if (!shotScores) return;
    let next = sl;
    let changed = false;
    for (const st of steps) {
      const e = shotScores[String(gameFor(st))];
      if (e === null || e === undefined) continue;
      const entry = typeof e === "number" ? { score: e, complete: true } : e;
      const v = Number(entry?.score);
      if (!Number.isFinite(v)) continue;
      if (!entry?.complete) continue;
      const typedOver = st.yourScore !== "" && !st.scoreAuto;
      if (typedOver) continue;
      if (String(st.yourScore) === String(v) && st.scoreAuto) continue;
      next = setStepField(next, st.stepNumber, "yourScore", String(v));
      next = setStepField(next, st.stepNumber, "scoreAuto", true);
      changed = true;
    }
    if (changed) update(next);
  }, [shotScores, sl]);

  return (
    <div style={S.card}>
      <div style={{ ...S.label, marginBottom: 0, cursor: "pointer" }} onClick={() => setOpen(o => !o)}>
        {open ? "▾" : "▸"} Stepladder
      </div>
      {open && (<>
      <div style={{ fontSize: "11px", color: C.textMuted, margin: "6px 0 10px", lineHeight: 1.5 }}>
        Sudden death, no bonus pins. Enter the seeds and the app works out where you finished.
      </div>

      <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "10px" }}>
        <div style={{ flex: 1 }}>
          {fieldLabel("Your seed")}
          <input style={{ ...S.input, fontSize: "12px" }} type="number" inputMode="numeric" placeholder="e.g. 3"
            value={sl.yourSeed ?? ""}
            onChange={e => update(setStepladderField(sl, "yourSeed", e.target.value))} />
        </div>
        {result.decided && result.place !== null && (
          <div style={{ ...S.statBox, flex: 1, border: `1px solid ${C.accent}44` }}>
            <div style={{ ...S.statNum, fontSize: "18px", color: result.place === 1 ? C.strike : C.accent }}>
              {ordinal(result.place)}
            </div>
            <div style={S.statLbl}>Finished</div>
          </div>
        )}
      </div>

      {steps.map(s => {
        const r = stepResult(s);
        const color = r === "win" ? C.strike : r === "loss" ? C.miss : r === "tie" ? C.spare : C.textMuted;
        const margin = r === null ? null : Number(s.yourScore) - Number(s.opponentScore);
        return (
          <div key={s.stepNumber} style={{ padding: "10px", marginBottom: "8px", backgroundColor: C.surface, borderRadius: "8px", border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <div style={{ fontSize: "12px", fontWeight: 600 }}>
                Step {s.stepNumber}
                {r && <span style={{ color, marginLeft: "6px", textTransform: "uppercase", fontSize: "10px" }}>{r}</span>}
                {margin !== null && margin !== 0 && (
                  <span style={{ color: C.textMuted, marginLeft: "6px", fontSize: "11px", fontWeight: 400 }}>
                    by {Math.abs(margin)}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                {onUseGame && (
                  <button style={{ background: "none", border: "none", color: C.accent, cursor: "pointer", fontSize: "11px", textDecoration: "underline", padding: 0 }}
                    onClick={() => onUseGame(gameFor(s))}>
                    Track frames (G{gameFor(s)})
                  </button>
                )}
                <button style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: "11px", textDecoration: "underline", padding: 0 }}
                  onClick={() => update(removeStep(sl, s.stepNumber))}>
                  Remove
                </button>
              </div>
            </div>
            <div style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
              <input style={{ ...S.input, flex: 2, fontSize: "12px" }} placeholder="Opponent"
                value={s.opponent} onChange={e => update(setStepField(sl, s.stepNumber, "opponent", e.target.value))} />
              <input style={{ ...S.input, flex: 1, fontSize: "12px" }} type="number" inputMode="numeric" placeholder="Seed"
                value={s.opponentSeed} onChange={e => update(setStepField(sl, s.stepNumber, "opponentSeed", e.target.value))} />
              <input style={{ ...S.input, flex: 1, fontSize: "12px" }} placeholder="Lanes"
                value={s.lanePair} onChange={e => update(setStepField(sl, s.stepNumber, "lanePair", e.target.value))} />
            </div>
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <input style={{ ...S.input, flex: 1, fontSize: "14px", textAlign: "center" }} type="number" inputMode="numeric" placeholder="You"
                value={s.yourScore}
                onChange={e => update(setStepField(
                  setStepField(sl, s.stepNumber, "scoreAuto", false),
                  s.stepNumber, "yourScore", e.target.value))} />
              <span style={{ fontSize: "11px", color: C.textMuted }}>vs</span>
              <input style={{ ...S.input, flex: 1, fontSize: "14px", textAlign: "center" }} type="number" inputMode="numeric" placeholder="Them"
                value={s.opponentScore} onChange={e => update(setStepField(sl, s.stepNumber, "opponentScore", e.target.value))} />
            </div>
          </div>
        );
      })}

      <button style={{ ...S.btn(), width: "100%", marginBottom: steps.length ? "12px" : 0 }}
        onClick={() => update(addStep(sl))}>
        + Add Step
      </button>

      {result.played > 0 && (
        <>
          <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
            <div style={S.statBox}>
              <div style={{ ...S.statNum, fontSize: "16px" }}>{result.wins}-{result.losses}{result.ties ? `-${result.ties}` : ""}</div>
              <div style={S.statLbl}>Steps</div>
            </div>
            <div style={S.statBox}>
              <div style={{ ...S.statNum, fontSize: "16px", color: C.textMuted }}>{result.scratch}</div>
              <div style={S.statLbl}>Scratch</div>
            </div>
            <div style={S.statBox}>
              <div style={{ ...S.statNum, fontSize: "16px" }}>{result.average ?? "—"}</div>
              <div style={S.statLbl}>Average</div>
            </div>
          </div>
          <div style={{ fontSize: "11px", color: C.textMuted, textAlign: "center" }}>
            {describeStepladder(sl)}
          </div>
        </>
      )}
      </>)}
    </div>
  );
}

// The recap, for a tournament.
//
// A league night recap answers "how did tonight go": one set of games,
// one average, one set of money. A tournament is three competitions in
// a row scored three different ways -- qualifying on total pinfall
// against a cut, match play on bonus pins, the stepladder on sudden
// death -- and blending them into one average describes none of them.
// So each phase reports itself, round by round, and only the phases
// actually bowled appear.
function TournamentRecap({ tournament, dayScores }) {
  const days = tournament?.days || [];
  const mp = tournament?.matchPlay || {};
  const mpTotals = matchPlayTotals(mp);
  const sl = tournament?.stepladder || {};
  const slResult = stepladderResult(sl);

  const qualGames = tournamentGamesEntered(tournament, null);
  const scratch = tournamentTotal(tournament, null);
  const withHcp = tournamentTotalWithHandicap(tournament, null);
  const hasQualifying = days.some(d => dayGamesEntered(d, dayScores ? dayScores(d) : null) > 0);

  if (!hasQualifying && !mpTotals.played && !slResult.played) return null;

  const phaseLabel = { match: "match play", stepladder: "the stepladder", na: "nothing further" };

  return (
    <div style={{ ...S.card, border: `1px solid ${C.accent}44` }}>
      <div style={{ ...S.label, color: C.accent }}>How it went</div>

      {hasQualifying && (<>
        <div style={{ ...S.label, marginTop: "4px" }}>Qualifying</div>
        <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
          <div style={{ ...S.statBox, border: `1px solid ${C.accent}44` }}>
            <div style={{ ...S.statNum, fontSize: "18px", color: C.accent }}>{withHcp ?? "\u2014"}</div>
            <div style={S.statLbl}>{appliesHandicap(tournament) ? "With handicap" : "Total"}</div>
          </div>
          <div style={S.statBox}>
            <div style={{ ...S.statNum, fontSize: "18px" }}>
              {/* Bowling averages truncate. */}
              {qualGames ? Math.floor((scratch ?? 0) / qualGames) : "\u2014"}
            </div>
            <div style={S.statLbl}>Average</div>
          </div>
          <div style={S.statBox}>
            <div style={{ ...S.statNum, fontSize: "18px" }}>{qualGames}</div>
            <div style={S.statLbl}>Games</div>
          </div>
        </div>

        {days.map(d => {
          const scores = dayScores ? dayScores(d) : null;
          const n = dayGamesEntered(d, scores);
          if (!n) return null;
          const carry = carryBefore(tournament, d.dayNumber, dayScores);
          const margin = carry.games ? cutMarginWithCarry(d, scores, carry) : cutMargin(d, scores);
          const games = (d.games || []).map(g => resolveTournamentGameScore(g, scores)).filter(v => v !== null);
          const label = [
            days.length > 1 ? `Day ${d.dayNumber}` : "Block",
            d.squad ? `Squad ${d.squad}` : "",
            d.blockNumber ? `Block ${d.blockNumber}` : "",
          ].filter(Boolean).join(" \u00b7 ");
          return (
            <div key={d.dayNumber} style={{ marginBottom: "8px", paddingBottom: "8px", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 600 }}>
                <span>{label}</span>
                <span style={{ color: C.accent }}>{dayTotal(d, scores)}</span>
              </div>
              {/* The games themselves. A tournament recap without the
                  game scores was the one thing every bowler checked
                  for and the only thing it did not show. */}
              <div style={{ fontSize: "12px", color: C.textMuted, marginTop: "2px" }}>
                {games.join(" \u00b7 ")}
              </div>
              <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "2px" }}>
                {Math.floor(games.reduce((a, b) => a + b, 0) / n)} average over {n} game{n === 1 ? "" : "s"}
                {margin !== null && (
                  <span style={{ color: margin >= 0 ? C.strike : C.miss, fontWeight: 600 }}>
                    {" \u00b7 "}{margin >= 0 ? `+${margin}` : margin} vs the cut
                  </span>
                )}
                {d.nextRound && phaseLabel[d.nextRound] ? ` \u00b7 on to ${phaseLabel[d.nextRound]}` : ""}
              </div>
            </div>
          );
        })}
      </>)}

      {mpTotals.played > 0 && (<>
        <div style={{ ...S.label, marginTop: "8px" }}>Match Play</div>
        <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
          <div style={S.statBox}>
            <div style={{ ...S.statNum, fontSize: "18px" }}>{mpTotals.wins}-{mpTotals.losses}{mpTotals.ties ? `-${mpTotals.ties}` : ""}</div>
            <div style={S.statLbl}>Record</div>
          </div>
          <div style={S.statBox}>
            <div style={{ ...S.statNum, fontSize: "18px", color: C.spare }}>+{mpTotals.bonusPins}</div>
            <div style={S.statLbl}>Bonus</div>
          </div>
          <div style={{ ...S.statBox, border: `1px solid ${C.accent}44` }}>
            <div style={{ ...S.statNum, fontSize: "18px", color: C.accent }}>{mpTotals.total}</div>
            <div style={S.statLbl}>Total</div>
          </div>
        </div>
        {(mp.matches || []).map(m => {
          const r = matchResult(m);
          if (r === null) return null;
          const color = r === "win" ? C.strike : r === "loss" ? C.miss : C.spare;
          return (
            <div key={m.matchNumber} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "2px" }}>
              <span style={{ color: C.textMuted }}>
                Match {m.matchNumber}{m.opponent ? ` vs ${m.opponent}` : ""}
              </span>
              <span style={{ color }}>{m.yourScore}{"\u2013"}{m.opponentScore}</span>
            </div>
          );
        })}
        {tournament.matchPlayNextRound && phaseLabel[tournament.matchPlayNextRound] && (
          <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "4px" }}>
            On to {phaseLabel[tournament.matchPlayNextRound]}.
          </div>
        )}
      </>)}

      {slResult.played > 0 && (<>
        <div style={{ ...S.label, marginTop: "8px" }}>Stepladder</div>
        {(sl.steps || []).map(st => {
          const r = stepResult(st);
          if (r === null) return null;
          const color = r === "win" ? C.strike : r === "loss" ? C.miss : C.spare;
          return (
            <div key={st.stepNumber} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "2px" }}>
              <span style={{ color: C.textMuted }}>
                Step {st.stepNumber}{st.opponent ? ` vs ${st.opponent}` : ""}{st.opponentSeed ? ` (${ordinal(st.opponentSeed)})` : ""}
              </span>
              <span style={{ color }}>{st.yourScore}{"\u2013"}{st.opponentScore}</span>
            </div>
          );
        })}
        <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "4px" }}>
          {sl.yourSeed ? `Seeded ${ordinal(sl.yourSeed)}. ` : ""}{describeStepladder(sl)}
        </div>
      </>)}
    </div>
  );
}

export default function TournamentSession({ onCancelTournament = null, resultsSummary = null, entitlement = null, tournament, onChange, onSave, saved, oilPatterns, submitOilPattern, tournaments, shotScoresByDate = null, tab: controlledTab, onTabChange, saveMessage = "", onUseDate, onUseGameNumber = null, onCloseTournament, sessionDate = "" }) {
  // The tab is owned by the caller.
  //
  // LogView renders Shot Context alongside this card, and it only makes
  // sense on the Scoring tab -- so something outside this component has
  // to know which tab is showing. Keeping the state private here meant
  // Shot Context appeared under Set up, Brackets and Results too.
  const [ownTab, setOwnTab] = useState("setup");
  const tab = controlledTab ?? ownTab;
  const setTab = onTabChange ?? setOwnTab;

  // Which cards are open. Everything starts open -- a bowler setting up
  // an event needs to see the fields, and collapsing is for getting them
  // out of the way afterwards, not for hiding them on arrival.
  const [open, setOpen] = useState({});

  // Which block the Scoring tab is showing. A multi-day event stacked
  // every block's games on one scroll, so the one being bowled was
  // somewhere in the middle of the others. Null means "the first one",
  // resolved at render so adding a day cannot leave this pointing at a
  // block that no longer exists.
  const [scoreDay, setScoreDay] = useState(null);

  // Which phase of the event the Scoring tab is showing: qualifying,
  // match play or the stepladder. A tournament is bowled in that order
  // and each phase is scored differently, so they are sub-tabs of
  // Scoring rather than peers of Set up and Results.
  const [phase, setPhase] = useState("qualifying");

  // The review sticks around; `saved` does not.
  //
  // `saved` is the button's "✓ Saved" flash and clears itself after a
  // second and a half. Hanging the review off it meant the summary
  // appeared and then vanished while the bowler was still reading it.
  //
  // Cleared when the id changes -- a different event gets a fresh card,
  // and starting a new tournament should not open on the last one's
  // summary.
  // A plain flag, not keyed on the id.
  //
  // A new tournament has no id until saveTournament assigns one, so
  // requiring one made the review depend on whether the id landed in the
  // same render as the saved flag. It usually does; "usually" is not a
  // reason to hide a summary.
  //
  // Cleared when the id changes to a DIFFERENT non-empty id -- a new
  // event should not open on the last one's summary, but the blank-to-
  // assigned transition of the first save is not that.
  const [showReview, setShowReview] = useState(false);
  const [closing, setClosing] = useState(false);
  const [cancelArmed, setCancelArmed] = useState(false);
  useEffect(() => { if (saved) setShowReview(true); }, [saved]);
  const seenId = useRef(tournament?.id || "");
  useEffect(() => {
    const id = tournament?.id || "";
    if (id && seenId.current && id !== seenId.current) setShowReview(false);
    if (id) seenId.current = id;
  }, [tournament?.id]);


  const isOpen = k => open[k] !== false;
  const toggle = k => setOpen(o => ({ ...o, [k]: o[k] === false }));
  // The handicap total is what the tournament used, so it is what a
  // bowler needs to see. Scratch is kept alongside rather than replaced
  // -- it is the number that says how they actually bowled.
  // Totals span every block, so they need each block's own scores. The
  // domain functions take one flat map, so this walks the days and adds
  // them up with each day's slice.
  // Which frames belong to this block.
  //
  // By the block's own date when it has one -- that is what keeps a
  // Saturday block's frames out of Sunday's games.
  //
  // A block with NO date set is the common case, though: the field is
  // optional and most bowlers never fill it in. Keying strictly on date
  // meant looking up byDate[""], which matches nothing, so frame
  // tracking appeared broken for everyone who skipped it.
  //
  // Undated single block: take whatever frames exist. There is only one
  // block, so there is nothing to confuse them with. Undated block
  // alongside dated ones: nothing, because guessing which night those
  // frames belong to is how scores bleed between blocks.
  const dated = (tournament.days || []).filter(d => d && d.date);
  // Shots for a block, by the SAME rule as its scores.
  //
  // This used to fall back to Object.values(...)[0] -- the first date in
  // the map -- so a second squad with no frames of its own was handed
  // the first squad's, and its games filled in with the wrong day's
  // scores. Any fallback that picks "some other day" is wrong here; the
  // only safe default is nothing.

  // Scores arrived. Recorded here, in the always-mounted parent, because
  // the fill effect lives in DayScoring -- which only mounts on the
  // Scoring tab, so it cannot report that it never ran.
  useEffect(() => {
    if (!shotScoresByDate || !Object.keys(shotScoresByDate).length) return;
    const blocks = (tournament.days || [])
      .map(d => `${d.date || "(undated)"}->${pickForDay(shotScoresByDate, d) ? "matched" : "none"}`)
      .join(" ");
  }, [shotScoresByDate, tournament.days]);


  const pickForDay = (map, d) => {
    const byDate = map || {};
    const key = String(d?.date || "");
    if (key) return byDate[key] || null;
    // An UNDATED block means "the night being bowled", which is the
    // session date -- not "whichever single date happens to be in the
    // map".
    //
    // That fallback put a finished game from an earlier date into an
    // undated block: G1 showed 277 from Saturday while the scoresheet
    // showed Sunday's 211. Two different games, both presented as this
    // one.
    if (dated.length) return null;
    return sessionDate ? (byDate[String(sessionDate)] || null) : null;
  };

  const dayScores = d => pickForDay(shotScoresByDate, d);

  // Match play and the stepladder are bowled on one date -- the night
  // in progress -- and have no date field of their own, so they read
  // the same frame scores the session is filing under.
  const phaseDate = sessionDate || (tournament.days || []).map(d => d.date).filter(Boolean).pop() || "";
  const phaseScores = (shotScoresByDate && phaseDate) ? (shotScoresByDate[String(phaseDate)] || null) : null;
  const phaseOffsets = phaseGameOffsets(tournament, phaseDate);

  // Point the shot context at a particular game and start it at frame
  // 1. Advancing a round has to move the tracker with it, or the next
  // match's frames land on the last one.
  const useGameNumber = onUseGameNumber
    ? g => { if (phaseDate && onUseDate) onUseDate(phaseDate); onUseGameNumber(g); }
    : null;

  const scratchTotal = (tournament.days || []).reduce((a, d) => {
    const v = dayTotal(d, dayScores(d));
    return v === null ? a : (a === null ? v : a + v);
  }, null);
  // Match play record for the summary, counted with the same helper the
  // Match tab uses rather than a second reading of the data.
  const matchRecord = (() => {
    const ms = tournament?.matchPlay?.matches || [];
    if (!ms.length) return "";
    let w = 0, l = 0, t = 0;
    for (const m of ms) {
      const r = matchResult(m);
      if (r === "win") w++; else if (r === "loss") l++; else if (r === "tie") t++;
    }
    if (!w && !l && !t) return "";
    return t ? `${w}-${l}-${t}` : `${w}-${l}`;
  })();

  const gamesAll = (tournament.days || []).reduce((a, d) => a + dayGamesEntered(d, dayScores(d)), 0);
  const total = scratchTotal === null ? null
    : scratchTotal + handicapPins(tournament, gamesAll);


  const avg = (scratchTotal !== null && gamesAll) ? scratchTotal / gamesAll : null;
  const money = tournamentMoney(tournament);
  const multiDay = (tournament.days || []).length > 1;

  return (
    <div>
      {/* Two tabs, because a tournament carries far more than a league
          night and one scroll of it was unreadable.
          
          Set up is what you fill in once; Scoring is what you come back
          to between games. Same chip pattern as Stats and Trends. */}
      <div style={{ ...S.card, padding: "10px 12px" }}>
        {/* One line, always. Five chips wrap on a narrow phone and a
            wrapped tab row reads as two rows of unrelated buttons, and a
            sideways-scrolling one hid Results off the edge. So all five
            share the row equally (dense + fill: they shrink rather than
            overflow) and each label stays on one line. */}
        <div style={{ ...S.chips, flexWrap: "nowrap", gap: "4px", marginBottom: 0 }}>
          {[["setup", "Set up"], ["scoring", "Scoring"], ["brackets", "Brackets"], ["results", "Results"]].map(([id, label]) => (
            <Chip key={id} label={label} dense fill selected={tab === id} onToggle={() => setTab(id)} />
          ))}
        </div>
      </div>

      {tab === "setup" && (<>
      <CollapsibleCard title="Tournament"
        summary={tournament.name || ""}
        expanded={isOpen("tournament")} onToggle={() => toggle("tournament")}>
        <div style={{ marginBottom: "8px" }}>
          {fieldLabel("Name")}
          <input style={S.input} placeholder="e.g. Spring Masters"
            value={tournament.name} onChange={e => onChange({ ...tournament, name: e.target.value })} />
        </div>
        <div>
          {fieldLabel("Center")}
          <input style={S.input} placeholder="e.g. Bowlero Pittsburgh"
            value={tournament.center} onChange={e => onChange({ ...tournament, center: e.target.value })} />
        </div>

        {/* The four settings that define the event, in the same card
            as the name and centre -- they are read together as one
            sentence about the event, and a separate card made them
            feel like a second job. */}
        <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>

          <div>
            {fieldLabel("Style")}
            <div style={S.chips}>
              {PLAY_STYLES.map(o => (
                <Chip key={o.id} label={o.label} dense
                  selected={playStyle(tournament) === o.id}
                  onToggle={() => onChange({ ...tournament, playStyle: o.id })} />
              ))}
            </div>
          </div>

          <div>
            {fieldLabel("Scoring")}
            <div style={S.chips}>
              {SCORING_BASES.map(o => (
                <Chip key={o.id} label={o.label} dense
                  selected={scoringBasis(tournament) === o.id}
                  onToggle={() => onChange({ ...tournament, scoringBasis: o.id })} />
              ))}
            </div>
          </div>

          <div>
            {fieldLabel("Format")}
            <div style={S.chips}>
              {PIN_FORMATS.map(o => (
                <Chip key={o.id} label={o.label} dense
                  selected={pinFormat(tournament) === o.id}
                  onToggle={() => onChange({ ...tournament, pinFormat: o.id })} />
              ))}
            </div>
          </div>

          {/* Cascades from Scoring: only a handicap event needs a number,
              and an empty box in a scratch event is a question with no
              answer. */}
          <div>
            {scoringBasis(tournament) === "handicap" ? (
              <>
                {fieldLabel("Handicap per game")}
                <input style={S.input} type="number" inputMode="numeric" placeholder="e.g. 40"
                  value={tournament.handicap || ""}
                  onChange={e => onChange({ ...tournament, handicap: e.target.value })} />
              </>
            ) : null}
          </div>

        </div>

        {/* Baker needs two more answers, and only Baker does. */}
        {isBaker(tournament) && (
          <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: `1px solid ${C.border}` }}>
            {fieldLabel("Bowling with")}
            <input style={S.input} placeholder="Partner's name"
              value={tournament.bakerPartner || ""}
              onChange={e => onChange({ ...tournament, bakerPartner: e.target.value })} />
            <div style={{ fontSize: "11px", color: C.textMuted, margin: "8px 0 4px" }}>Who bowls frame 1</div>
            <div style={S.chips}>
              {BAKER_STARTERS.map(b => (
                <Chip key={b.id} label={b.label} dense
                  selected={(tournament.bakerStarter || "me") === b.id}
                  onToggle={() => onChange({ ...tournament, bakerStarter: b.id })} />
              ))}
            </div>
            <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "6px", lineHeight: 1.5 }}>
              You bowl frames {bakerFramesFor("me", tournament.bakerStarter).join(", ")}. The score stays
              out of your average since you did not bowl it alone, but your own frames still count.
            </div>
          </div>
        )}
        </div>
      </CollapsibleCard>


      {/* Block details -- date, time, squad, block number.
          
          Here rather than with the scores because they are set once
          before the block starts. Games and the lane pair moved to
          Scoring, where they belong beside the game they describe. */}
      {(tournament.days || []).map(day => (
        <DayDetails key={day.dayNumber}
          tournament={tournament}
          day={day}
          multiDay={multiDay}
          canRemoveDay={(tournament.days || []).length > 1}
          onRemoveDay={() => onChange(removeDay(tournament, day.dayNumber))}
          onChange={next => onChange(updateDay(tournament, day.dayNumber, () => next))}
          onUseDate={onUseDate}
          onGoToScoring={d => {
            // Jump to Scoring AND make sure that squad's card is open, so
            // the bowler lands on the games they asked for rather than on
            // whichever squad happened to be expanded.
            setOpen(o => ({ ...o, [`score${d.dayNumber}`]: true }));
            setScoreDay(d.dayNumber);
            setPhase("qualifying");
            if (d.date && onUseDate) onUseDate(d.date);
            setTab("scoring");
          }}
          expanded={isOpen(`day${day.dayNumber}`)}
          onToggleExpanded={() => toggle(`day${day.dayNumber}`)}
          oilPatterns={oilPatterns}
          submitOilPattern={submitOilPattern}
          tournaments={tournaments} />
      ))}

      {/* Adding a squad lives with the squad details, not with the
          scores. A new squad is something you set up -- give it a date
          and a squad number -- before there is anything to score. */}
      <button style={{ ...S.btn(), width: "100%", marginBottom: "12px" }} onClick={() => onChange(addDay(tournament))}>
        + Add Another Day or Block
      </button>

      {/* Start Scoring: the one way forward from Set up, the same button
          league has. It opens the first squad without games yet (or the
          last one), so the bowler lands on the games they are about to
          bowl. The per-squad "Go to scoring" links still work too. */}
      <button style={{ ...S.btn("primary"), width: "100%", marginBottom: "12px" }}
        onClick={() => {
          const days = tournament.days || [];
          const next = days.find(d => !(Array.isArray(d.games) && d.games.some(g => Number(g?.score) > 0)))
            || days[days.length - 1];
          if (next) {
            setOpen(o => ({ ...o, [`score${next.dayNumber}`]: true }));
            setScoreDay(next.dayNumber);
            setPhase("qualifying");
            if (next.date && onUseDate) onUseDate(next.date);
          }
          setTab("scoring");
          try { window.scrollTo({ top: 0 }); } catch {}
        }}>
        Start Scoring
      </button>

      {/* A way out of an event that is not happening -- a test entry, the
          wrong tournament, a block logged in the wrong place. Quiet, under
          everything, and it asks twice: nothing it removes comes back. */}
      {onCancelTournament && (
        !cancelArmed ? (
          <button
            style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer",
              fontSize: "13px", padding: "8px", width: "100%", WebkitTapHighlightColor: "transparent" }}
            onClick={() => setCancelArmed(true)}>
            Cancel Tournament
          </button>
        ) : (
          <div style={{ ...S.card, padding: "12px" }}>
            <div style={{ fontSize: "13px", color: C.text, lineHeight: 1.5, marginBottom: "10px" }}>
              This deletes <strong>{tournament.name || "this tournament"}</strong> — every block, shot, score
              and bracket entered for it — and takes you back to Home. This cannot be undone.
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button style={{ ...S.btn(), flex: 1 }} onClick={() => setCancelArmed(false)}>
                Keep it
              </button>
              <button style={{ ...S.btn("warn"), flex: 1 }}
                onClick={() => { setCancelArmed(false); onCancelTournament(); }}>
                Delete and exit
              </button>
            </div>
          </div>
        )
      )}

      </>)}

      {/* Brackets and side pots: money staked against other bowlers,
          separate from the tournament entry itself. Its own tab
          because it is a different pot with different maths, and
          mixing it into scoring made both harder to read. */}
      {tab === "brackets" && !canUseBracketsAndSidePots(entitlement) && (
        <LockedNote title="Brackets and side pots">
          Working out brackets and side pots as you go is part of the paid plan.
          Money games in league stay free.
        </LockedNote>
      )}
      {tab === "brackets" && canUseBracketsAndSidePots(entitlement) && (<>
      <SidePots tournament={tournament} onChange={onChange} />
      </>)}

      {/* Results: what the tournament itself cost and paid.

          Brackets and side pots are deliberately NOT here -- those are
          side action, and adding them to this total would answer a
          different question than "did the tournament pay". */}

      {tab === "results" && (<>
      <CollapsibleCard title="How did it finish?" expanded={isOpen("finish")} onToggle={() => toggle("finish")}>

        <div style={S.chips}>
          {PLACEMENTS.map(p => (
            <Chip key={p.id} label={p.emoji ? `${p.emoji} ${p.label}` : p.label}
              selected={tournament.placement === p.id}
              color={p.id === "won" ? C.strike : undefined}
              onToggle={() => onChange({
                ...tournament,
                placement: tournament.placement === p.id ? "" : p.id,
              })} />
          ))}
        </div>
        {tournament.placement && tournament.placement !== "none" && (
          <input style={{ ...S.input, marginTop: "8px" }}
            placeholder="Anything worth remembering about it?"
            value={tournament.placementNote || ""}
            onChange={e => onChange({ ...tournament, placementNote: e.target.value })} />
        )}
      </CollapsibleCard>
      <CollapsibleCard title="Entry &amp; Winnings" expanded={isOpen("money")} onToggle={() => toggle("money")}>
        <div style={S.row}>
          <div style={{ flex: 1 }}>
            {fieldLabel("Tournament buy in $")}
            <input style={S.input} type="number" inputMode="decimal" placeholder="0"
              value={tournament.buyIn} onChange={e => onChange({ ...tournament, buyIn: e.target.value })} />
          </div>
          <div style={{ flex: 1 }}>
            {fieldLabel("Tournament winnings $")}
            <input style={S.input} type="number" inputMode="decimal" placeholder="0"
              value={tournament.winnings} onChange={e => onChange({ ...tournament, winnings: e.target.value })} />
          </div>
        </div>
        {/* Said outright, because "Winnings" alone reads as everything
            won today -- and a bowler who cashed a bracket would enter it
            here as well as on the Brackets tab and count it twice. */}
        <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "4px", lineHeight: 1.5 }}>
          The tournament payout only. Bracket and side pot winnings go on the Brackets tab.
        </div>
        {(money.buyIn !== 0 || money.winnings !== 0 || money.side.count > 0) && (
          <div style={{ marginTop: "8px" }}>
            {/* Buy-in and winnings shown SEPARATELY, in their own
                colours, before the net.
                
                They used to be blended into one line called "Entry",
                which answered neither of the questions a bowler actually
                has: what did this cost me, and what did it pay. A single
                "-$45" hides a $120 entry that paid $75.
                
                Red for money out, green for money in -- the same colours
                the rest of the app uses for a miss and a strike. */}
            <div style={{ fontSize: "12px", marginBottom: "6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: C.textMuted }}>Tournament buy in</span>
                <span style={{ color: C.miss, fontWeight: 600 }}>
                  −${Math.abs(money.buyIn || 0).toFixed(2)}
                </span>
              </div>
              {/* Winnings show even at zero once there was a buy-in:
                  a blank line reads as "not entered yet", and "I paid
                  and cashed nothing" is the answer most nights. */}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2px" }}>
                <span style={{ color: C.textMuted }}>Tournament winnings</span>
                <span style={{ color: C.strike, fontWeight: 600 }}>
                  +${Math.abs(money.winnings || 0).toFixed(2)}
                </span>
              </div>
              {/* Side action on its own two lines, for the same reason
                  the entry is split: one blended net hides what it
                  cost. Entered on the Brackets tab. */}
              {(money.side.count > 0 || money.side.cost !== 0) && (<>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2px" }}>
                  <span style={{ color: C.textMuted }}>Brackets buy in</span>
                  <span style={{ color: C.miss, fontWeight: 600 }}>
                    −${Math.abs(money.side.cost || 0).toFixed(2)}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2px" }}>
                  <span style={{ color: C.textMuted }}>Brackets winnings</span>
                  <span style={{ color: C.strike, fontWeight: 600 }}>
                    +${Math.abs(money.side.won || 0).toFixed(2)}
                  </span>
                </div>
              </>)}
            </div>
            <div style={{ textAlign: "center", fontSize: "13px", fontWeight: 700,
              color: money.net >= 0 ? C.strike : C.miss,
              borderTop: `1px solid ${C.border}`, paddingTop: "6px" }}>
              {money.net < 0 ? "−" : ""}${Math.abs(money.net).toFixed(2)} net
            </div>
          </div>
        )}
      </CollapsibleCard>

      {/* The event, phase by phase. Here, rather than after this card,
          so Results reads top to bottom: how it finished, the money,
          the bowling, the notes -- and Save last, once everything above
          is right.

          NOT the league night recap LogView hands in: that answers
          "how did tonight go" with one average over one set of games,
          which describes a qualifying block and says nothing at all
          about match play or a stepladder. */}
      <TournamentRecap tournament={tournament} dayScores={dayScores} />

      <CollapsibleCard title="Tournament Notes" expanded={isOpen("notes")} onToggle={() => toggle("notes")}>
        <textarea style={{ ...S.input, minHeight: "60px", resize: "vertical" }}
          placeholder="Overall takeaways…"
          value={tournament.notes} onChange={e => onChange({ ...tournament, notes: e.target.value })} />
      </CollapsibleCard>

      {/* Why the save was refused, next to the button that refused it. */}
      {saveMessage && (
        <div style={{ fontSize: "12px", color: C.miss, marginBottom: "8px", lineHeight: 1.5 }}>
          {saveMessage}
        </div>
      )}
      <button style={S.btn("primary")} onClick={onSave}>
        {saved ? "✓ Tournament Saved" : "Save & Finish Tournament"}
      </button>

      {/* The whole event, once it is saved.

          Everything here is spread across four tabs while the bowler is
          filling it in, which is right for entry and wrong for looking
          back: nobody wants to tab around to answer "how did that go".

          Only after saving -- a summary of a half-entered event is a
          summary of nothing. */}
      {/* Done with this event.
          
          Saving keeps it in history; this clears the card so the next
          event starts clean. Two taps, because a tournament is a lot of
          entry to lose to a mis-tap -- and it only appears once the
          event is saved, so there is nothing to lose by then. */}
      {showReview && onCloseTournament && (
        closing ? (
          <div style={{ ...S.card, border: `1px solid ${C.miss}` }}>
            <div style={{ fontSize: "12px", color: C.miss, marginBottom: "8px", lineHeight: 1.5 }}>
              Close this tournament and start a new one? It stays in your history.
            </div>
            <div style={S.chips}>
              <Chip label="Yes, close it" dense color={C.miss}
                onToggle={() => { setClosing(false); onCloseTournament(); }} />
              <Chip label="Keep working on it" dense onToggle={() => setClosing(false)} />
            </div>
          </div>
        ) : (
          <button style={{ ...S.btn(), width: "100%", marginTop: "10px" }}
            onClick={() => setClosing(true)}>
            Close tournament
          </button>
        )
      )}

      {showReview && (

        <div style={{ ...S.card, border: `1.5px solid ${C.accent}`, marginTop: "12px" }}>
          <div style={{ ...S.label, color: C.accent }}>{tournament.name || "Tournament"}</div>
          {(describeTournamentFormat(tournament) || tournament.center) && (
            <div style={{ fontSize: "11px", color: C.textMuted, marginBottom: "8px" }}>
              {[describeTournamentFormat(tournament), tournament.center].filter(Boolean).join(" · ")}
            </div>
          )}

          <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
            <div style={S.statBox}>
              <div style={{ ...S.statNum, fontSize: "18px", color: C.accent }}>{total ?? "—"}</div>
              <div style={S.statLbl}>{appliesHandicap(tournament) ? "With handicap" : "Total"}</div>
            </div>
            <div style={S.statBox}>
              <div style={{ ...S.statNum, fontSize: "18px" }}>{avg === null ? "—" : avg.toFixed(1)}</div>
              <div style={S.statLbl}>Average</div>
            </div>
            <div style={S.statBox}>
              <div style={{ ...S.statNum, fontSize: "18px" }}>{gamesAll}</div>
              <div style={S.statLbl}>Games</div>
            </div>
          </div>

          {/* Block by block, because a bowler who missed the cut wants to
              know which block lost it. */}
          {(tournament.days || []).map(d => {
            const dt = dayTotal(d, dayScores(d));
            const dg = dayGamesEntered(d, dayScores(d));
            if (!dg) return null;
            return (
              <div key={d.dayNumber} style={{ display: "flex", justifyContent: "space-between",
                fontSize: "12px", padding: "3px 0", color: C.text }}>
                <span style={{ color: C.textMuted }}>
                  {(tournament.days || []).length > 1 ? `Day ${d.dayNumber}` : "Block"}
                  {d.date ? ` · ${d.date}` : ""}
                </span>
                <span>{dt} <span style={{ color: C.textMuted }}>({dg} game{dg === 1 ? "" : "s"})</span></span>
              </div>
            );
          })}

          {/* Brackets and side pots, if any were played. Their own
              line, because they are a separate pot from the entry. */}
          {money.side.count > 0 && (
            <div style={{ marginTop: "10px", paddingTop: "8px", borderTop: `1px solid ${C.border}` }}>
              <div style={{ fontSize: "11px", color: C.textMuted, marginBottom: "4px" }}>Brackets and side pots</div>
              {(money.side.byType || []).map((b, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", padding: "2px 0" }}>
                  <span style={{ color: C.textMuted }}>{b.type || "Side pot"}</span>
                  <span style={{ color: (b.net ?? 0) >= 0 ? C.strike : C.miss }}>
                    {(b.net ?? 0) < 0 ? "−" : "+"}${Math.abs(b.net ?? 0).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Match play, if it was played. */}
          {matchRecord && (
            <div style={{ marginTop: "10px", paddingTop: "8px", borderTop: `1px solid ${C.border}`,
              display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
              <span style={{ color: C.textMuted }}>Match play</span>
              <span>{matchRecord}</span>
            </div>
          )}

          {(money.buyIn !== 0 || money.winnings !== 0 || money.side.count > 0) && (
            <div style={{ marginTop: "10px", paddingTop: "8px", borderTop: `1px solid ${C.border}`,
              display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
              <span style={{ color: C.textMuted }}>Money</span>
              <span>
                <span style={{ color: C.miss }}>−${Math.abs(money.totalCost).toFixed(2)}</span>
                {" / "}
                <span style={{ color: C.strike }}>+${Math.abs(money.totalWon).toFixed(2)}</span>
                {" = "}
                <span style={{ color: money.net >= 0 ? C.strike : C.miss, fontWeight: 700 }}>
                  {money.net < 0 ? "−" : ""}${Math.abs(money.net).toFixed(2)}
                </span>
              </span>
            </div>
          )}

          {isBaker(tournament) && (
            <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "8px", lineHeight: 1.5 }}>
              {bakerScoreNote(tournament)}
            </div>
          )}
        </div>
      )}
      </>)}

      {tab === "scoring" && (<>
      {/* The three phases of a tournament, in the order they are
          bowled. They were a top-level tab each, which put qualifying
          and match play at the same level as Set up and Results -- and
          left the stepladder nowhere at all. */}
      <div style={{ ...S.card, padding: "10px 12px" }}>
        <div style={{ ...S.chips, flexWrap: "nowrap", gap: "4px", marginBottom: 0 }}>
          {[["qualifying", "Qualifying"], ["match", "Match Play"], ["stepladder", "Stepladder"]].map(([id, label]) => (
            <Chip key={id} label={label} dense fill selected={phase === id} onToggle={() => setPhase(id)} />
          ))}
        </div>
      </div>

      {phase === "match" && (
        <MatchPlay tournament={tournament} onChange={onChange} onGoToPhase={setPhase}
          shotScores={phaseScores} gameStart={phaseOffsets.matchStart}
          onUseGame={useGameNumber} />
      )}
      {phase === "stepladder" && (
        <Stepladder tournament={tournament} onChange={onChange}
          shotScores={phaseScores} gameStart={phaseOffsets.stepStart}
          onUseGame={useGameNumber} />
      )}

      {phase === "qualifying" && (<>
      {(() => {
        const days = tournament.days || [];
        if (days.length < 2) return null;
        const cur = days.some(d => d.dayNumber === scoreDay) ? scoreDay : days[0].dayNumber;
        const d = days.find(x => x.dayNumber === cur);
        // Which block this is, in the words off the entry sheet: date,
        // start time, squad, block. Under the tabs rather than inside
        // the card, because it is what the tab selection MEANS.
        const bits = [
          d?.date || "",
          d?.startTime || "",
          d?.squad ? `Squad ${d.squad}` : "",
          d?.blockNumber ? `Block ${d.blockNumber}` : "",
        ].filter(Boolean);
        return (
          <div style={{ ...S.card, padding: "10px 12px" }}>
            <div style={{ ...S.chips, flexWrap: "wrap", gap: "4px", marginBottom: bits.length ? "8px" : 0 }}>
              {days.map(x => (
                <Chip key={x.dayNumber} label={`Day ${x.dayNumber}`} dense
                  selected={x.dayNumber === cur}
                  onToggle={() => setScoreDay(x.dayNumber)} />
              ))}
            </div>
            {bits.length > 0 && (
              <div style={{ fontSize: "12px", color: C.textMuted }}>{bits.join(" · ")}</div>
            )}
          </div>
        );
      })()}
      {(tournament.days || [])
        .filter((day, _i, all) => all.length < 2
          || day.dayNumber === (all.some(d => d.dayNumber === scoreDay) ? scoreDay : all[0].dayNumber))
        .map(day => (
        <DayScoring key={day.dayNumber}
          shotScores={dayScores(day)}
          shotScoresByDate={shotScoresByDate}
          tournament={tournament}
          day={day}
          multiDay={multiDay}
          expanded={isOpen(`score${day.dayNumber}`)}
          onToggleExpanded={() => toggle(`score${day.dayNumber}`)}
          carry={carryBefore(tournament, day.dayNumber, dayScores)}
          onGoToPhase={setPhase}
          onChange={next => onChange(updateDay(tournament, day.dayNumber, () => next))} />
      ))}

      {multiDay && total !== null && (
        <div style={{ ...S.card, border: `1px solid ${C.accent}44` }}>
          <div style={{ ...S.label, color: C.accent }}>Tournament Total</div>
          <div style={{ display: "flex", gap: "6px" }}>
            <div style={{ ...S.statBox, border: `1px solid ${C.accent}44` }}>
              <div style={{ ...S.statNum, fontSize: "20px", color: C.accent }}>{total}</div>
              <div style={S.statLbl}>{appliesHandicap(tournament) ? "With handicap" : "All Days"}</div>
            </div>
            <div style={S.statBox}>
              <div style={{ ...S.statNum, fontSize: "20px" }}>{avg === null ? "—" : avg.toFixed(1)}</div>
              <div style={S.statLbl}>Average</div>
            </div>
          </div>
          {/* Scratch alongside, not instead. The handicap total is what
              the tournament used; the scratch total is how the bowler
              actually bowled, and both matter. */}
          {appliesHandicap(tournament) && scratchTotal !== null && (
            <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "6px", textAlign: "center" }}>
              {scratchTotal} scratch · {total - scratchTotal} handicap pins
            </div>
          )}
        </div>
      )}
      </>)}




      {/* How it finished.
      
          Recorded, not computed: the app knows your scores but has no
          idea what anyone else shot, so it can't tell a win from a
          middling weekend. Sits right before Save because it's the last
          thing you know. */}
      <div style={{ height: "24px" }} />

      </>)}
    </div>
  );
}
