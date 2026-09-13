import { useState } from "react";
import { PLACEMENTS } from "./domain/achievements.js";
import { C, S, Chip, CollapsibleCard } from "./ui.jsx";
import {
  addGame, removeGame, setGameField, addDay, removeDay, setDayField, updateDay,
  dayTotal, dayAverage, dayGamesEntered, cutMargin,
  tournamentTotal, tournamentTotalWithHandicap, tournamentAverage, tournamentMoney,
  SCORING_BASES, PIN_FORMATS, PLAY_STYLES,
  scoringBasis, pinFormat, playStyle, cutTarget,
} from "./domain/tournaments.js";
import { patternDisplayName, searchPatterns, describePattern, patternStats } from "./domain/oilPatterns.js";
import { leagueFormat, isNoTapLeague } from "./domain/leagueSeasons.js";
import { isBaker, appliesHandicap, bakerFramesFor, BAKER_STARTERS, handicapPins } from "./domain/tournamentFormats.js";
import {
  SIDE_POT_TYPES, addSidePot, removeSidePot, setSidePotField, sidePotMoney, sidePotTotals,
} from "./domain/sidePots.js";
import {
  addMatch, removeMatch, setMatchField, setBonus, matchResult, matchPlayTotals, pinDifferential,
  matchMargin, competitiveness, describeCompetitiveness,
} from "./domain/matchPlay.js";

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

function DayDetails({ tournament, day, onChange, canRemoveDay, onRemoveDay, multiDay, oilPatterns, submitOilPattern, tournaments, expanded = true, onToggleExpanded }) {
  function update(next) { onChange(next); }

  // The cut line lives here, with the block details, so the margin has
  // to be worked out here too -- it moved over from DayScoring with the
  // rest of the card. No shot scores: this is the posted cut against
  // what is entered, and a half-finished frame-tracked game should not
  // move the margin around while the bowler is still bowling it.
  const margin = cutMargin(day);

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
          {expanded ? "\u25be" : "\u25b8"} {multiDay ? `Day ${day.dayNumber}` : "Block Details"}
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
            onChange={e => update({ ...day, date: e.target.value })} />
        </div>
        <div style={{ flex: 1 }}>
          {fieldLabel("Start Time")}
          <input style={S.input} type="time" value={day.startTime}
            onChange={e => update({ ...day, startTime: e.target.value })} />
        </div>
      </div>

      <div style={{ ...S.row, marginTop: "8px" }}>
        <div style={{ flex: 1 }}>
          {fieldLabel("Squad")}
          <input style={S.input} placeholder="e.g. A, 2, Sat AM" value={day.squad}
            onChange={e => update({ ...day, squad: e.target.value })} />
        </div>
      </div>

      <div style={{ ...S.row, marginTop: "8px" }}>
        <div style={{ flex: 1 }}>
          {fieldLabel("Block #")}
          <input style={S.input} placeholder="e.g. 2" value={day.blockNumber}
            onChange={e => update({ ...day, blockNumber: e.target.value })} />
        </div>
        <div style={{ flex: 2 }}>
          <OilPatternField
            value={day.oilPattern}
            onChange={v => update({ ...day, oilPattern: v })}
            patterns={oilPatterns}
            onSubmitPattern={submitOilPattern}
            tournaments={tournaments}
            currentTournamentId={tournament?.id} />
        </div>
      </div>

      <div style={S.divider} />

      <div style={S.label}>Cut Line</div>
      <div style={{ fontSize: "11px", color: C.textMuted, marginBottom: "8px" }}>
        {/* Focus group Finding 5: 9 of 50 stalled here because the cut
            is usually not announced until after qualifying. Leaving it
            blank already worked -- nothing said so, and an empty
            numeric field on a setup screen reads as something you are
            required to know. Not labelled "optional", which implies it
            does not matter; it does, just not yet. */}
        Pins over or under a 200 average. A cut posted as +150 after eight games means 1750.
      </div>
      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
        {/* The sign, before the number, because that is how a cut is
            read out: "plus one fifty", not "one fifty, over". */}
        <div style={S.chips}>
          {["+", "-"].map(sign => (
            <Chip key={sign} label={sign} dense
              selected={(day.cutSign || "+") === sign}
              onToggle={() => update({ ...day, cutSign: sign })} />
          ))}
        </div>
        <input style={{ ...S.input, flex: 1 }} type="number" inputMode="numeric"
          placeholder="Add it when it's posted"
          value={day.cutLine} onChange={e => update({ ...day, cutLine: e.target.value })} />
      </div>
      {day.cutLine !== "" && cutTarget(day) !== null && (
        <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "4px" }}>
          That's {cutTarget(day)} across {dayGamesEntered(day)} game{dayGamesEntered(day) === 1 ? "" : "s"}.
        </div>
      )}

      {margin !== null && (
        <div style={{ textAlign: "center", marginTop: "8px", fontSize: "13px", fontWeight: 700, color: margin >= 0 ? C.strike : C.miss }}>
          {margin >= 0 ? `▲ +${margin} above the cut` : `▼ ${margin} below the cut`}
        </div>
      )}

      <div style={{ ...S.label, marginTop: "10px" }}>Made the Cut?</div>
      <div style={S.chips}>
        <Chip label="Yes" selected={day.madeCut === true} color={C.strike}
          onToggle={() => update({ ...day, madeCut: day.madeCut === true ? null : true })} />
        <Chip label="No" selected={day.madeCut === false} color={C.miss}
          onToggle={() => update({ ...day, madeCut: day.madeCut === false ? null : false })} />
      </div>
      {day.madeCut === null && (
        <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "4px" }}>
          Usually not known until the squad finishes — leave blank until then.
        </div>
      )}
      </>)}
    </div>
  );
}

function DayScoring({ tournament, day, onChange, multiDay, shotScores, expanded = true, onToggleExpanded }) {
  const total = dayTotal(day, shotScores);
  const avg = dayAverage(day, shotScores);
  const entered = dayGamesEntered(day, shotScores);
  const margin = cutMargin(day, shotScores);
  const derived = g => shotScores ? (Number.isFinite(Number(shotScores[String(g.gameNumber)])) ? Number(shotScores[String(g.gameNumber)]) : null) : null;
  function update(next) { onChange(next); }

  return (
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
                 invisible on the dark palette. */
              color: g.score === "" && derived(g) !== null ? C.textMuted : C.text }}
            type="number" inputMode="numeric"
            placeholder={derived(g) !== null ? String(derived(g)) : "Score"}
            value={g.score} onChange={e => update(setGameField(day, g.gameNumber, "score", e.target.value))} />
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
  );
}

// Itemised side action. Each row is one purchase -- four brackets at $5
// is one row with entries=4, not four rows.
function SidePots({ tournament, onChange }) {
  const [open, setOpen] = useState(true);
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
      </>)}
    </div>
  );
}

// Match play: the head-to-head block after the cut.
function MatchPlay({ tournament, onChange }) {
  const [open, setOpen] = useState(true);
  const mp = tournament.matchPlay || {};
  const matches = mp.matches || [];
  const totals = matchPlayTotals(mp);
  const diff = pinDifferential(mp);
  const comp = competitiveness(mp);

  function update(next) { onChange({ ...tournament, matchPlay: next }); }

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
              <button style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: "11px", textDecoration: "underline", padding: 0 }}
                onClick={() => update(removeMatch(mp, m.matchNumber))}>
                Remove
              </button>
            </div>
            <div style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
              <input style={{ ...S.input, flex: 2, fontSize: "12px" }} placeholder="Opponent"
                value={m.opponent} onChange={e => update(setMatchField(mp, m.matchNumber, "opponent", e.target.value))} />
              <input style={{ ...S.input, flex: 1, fontSize: "12px" }} placeholder="Lanes"
                value={m.lanePair} onChange={e => update(setMatchField(mp, m.matchNumber, "lanePair", e.target.value))} />
            </div>
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <input style={{ ...S.input, flex: 1, fontSize: "14px", textAlign: "center" }} type="number" inputMode="numeric" placeholder="You"
                value={m.yourScore} onChange={e => update(setMatchField(mp, m.matchNumber, "yourScore", e.target.value))} />
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
      </>)}
    </div>
  );
}

export default function TournamentSession({ tournament, onChange, onSave, saved, oilPatterns, submitOilPattern, tournaments, shotScoresByDate = null, tab: controlledTab, onTabChange }) {
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
  const isOpen = k => open[k] !== false;
  const toggle = k => setOpen(o => ({ ...o, [k]: o[k] === false }));
  // The handicap total is what the tournament used, so it is what a
  // bowler needs to see. Scratch is kept alongside rather than replaced
  // -- it is the number that says how they actually bowled.
  // Totals span every block, so they need each block's own scores. The
  // domain functions take one flat map, so this walks the days and adds
  // them up with each day's slice.
  const dayScores = d => (shotScoresByDate || {})[String(d?.date || "")] || null;
  const scratchTotal = (tournament.days || []).reduce((a, d) => {
    const v = dayTotal(d, dayScores(d));
    return v === null ? a : (a === null ? v : a + v);
  }, null);
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
        <div style={S.chips}>
          <Chip label="Set up" selected={tab === "setup"} onToggle={() => setTab("setup")} />
          <Chip label="Scoring" selected={tab === "scoring"} onToggle={() => setTab("scoring")} />
          <Chip label="Brackets" selected={tab === "brackets"} onToggle={() => setTab("brackets")} />
          <Chip label="Results" selected={tab === "results"} onToggle={() => setTab("results")} />
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
          expanded={isOpen(`day${day.dayNumber}`)}
          onToggleExpanded={() => toggle(`day${day.dayNumber}`)}
          oilPatterns={oilPatterns}
          submitOilPattern={submitOilPattern}
          tournaments={tournaments} />
      ))}

      </>)}

      {/* Brackets and side pots: money staked against other bowlers,
          separate from the tournament entry itself. Its own tab
          because it is a different pot with different maths, and
          mixing it into scoring made both harder to read. */}
      {tab === "brackets" && (<>
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
            {fieldLabel("Buy-in $")}
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
                <span style={{ color: C.textMuted }}>Buy-in</span>
                <span style={{ color: C.miss, fontWeight: 600 }}>
                  −${Math.abs(money.buyIn || 0).toFixed(2)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2px" }}>
                <span style={{ color: C.textMuted }}>Winnings</span>
                <span style={{ color: C.strike, fontWeight: 600 }}>
                  +${Math.abs(money.winnings || 0).toFixed(2)}
                </span>
              </div>
              {/* Side action stays on its own line -- it is a different
                  pot, and the Brackets tab is where it is entered. */}
              {money.side.count > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2px" }}>
                  <span style={{ color: C.textMuted }}>Brackets &amp; side pots</span>
                  <span style={{ color: money.side.net >= 0 ? C.strike : C.miss }}>
                    {money.side.net < 0 ? "−" : "+"}${Math.abs(money.side.net).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
            <div style={{ textAlign: "center", fontSize: "13px", fontWeight: 700,
              color: money.net >= 0 ? C.strike : C.miss,
              borderTop: `1px solid ${C.border}`, paddingTop: "6px" }}>
              {money.net < 0 ? "−" : ""}${Math.abs(money.net).toFixed(2)} net
            </div>
          </div>
        )}
      </CollapsibleCard>

      <CollapsibleCard title="Tournament Notes" expanded={isOpen("notes")} onToggle={() => toggle("notes")}>
        <textarea style={{ ...S.input, minHeight: "60px", resize: "vertical" }}
          placeholder="Overall takeaways…"
          value={tournament.notes} onChange={e => onChange({ ...tournament, notes: e.target.value })} />
      </CollapsibleCard>

      <button style={S.btn("primary")} onClick={onSave}>
        {saved ? "✓ Tournament Saved" : "Save Tournament"}
      </button>
      </>)}

      {tab === "scoring" && (<>
      {(tournament.days || []).map(day => (
        <DayScoring key={day.dayNumber}
          shotScores={(shotScoresByDate || {})[String(day.date || "")] || null}
          tournament={tournament}
          day={day}
          multiDay={multiDay}
          expanded={isOpen(`score${day.dayNumber}`)}
          onToggleExpanded={() => toggle(`score${day.dayNumber}`)}
          onChange={next => onChange(updateDay(tournament, day.dayNumber, () => next))} />
      ))}

      <button style={{ ...S.btn(), width: "100%", marginBottom: "12px" }} onClick={() => onChange(addDay(tournament))}>
        + Add Another Day
      </button>

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




      {/* How it finished.
      
          Recorded, not computed: the app knows your scores but has no
          idea what anyone else shot, so it can't tell a win from a
          middling weekend. Sits right before Save because it's the last
          thing you know. */}
      <div style={{ height: "24px" }} />
      <MatchPlay tournament={tournament} onChange={onChange} />
      </>)}
    </div>
  );
}
