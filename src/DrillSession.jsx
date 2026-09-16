import { useState } from "react";
import { C, S, Chip } from "./ui.jsx";
import { formatDateShort } from "./constants.js";
import {
  DRILL_TARGETS, targetLabel, targetShortLabel, recordMade, recordMissed, undo,
  attempts, conversionRate, targetHistory, normalizeCustomPins,
  } from "./domain/drills.js";

// Big two-button tapping. This runs while someone is standing on the
// approach between shots, so everything is oversized and the rate is
// always visible without scrolling.
export default function DrillSession({ drill, onChange, onSave, saved, balls, drills, bowler, onStartAnother, sessionDate, leftHanded = false }) {
  //  is the session in progress. It is normally always present,
  // but a drill session interrupted mid-write can leave it absent --
  // and drill.target threw on the first line, so the screen showed the
  // error boundary rather than an empty drill.
  drill = (drill && typeof drill === "object") ? drill : {};
  const [lastTap, setLastTap] = useState(null);
  const rate = conversionRate(drill);
  const n = attempts(drill);
  const todaysDrills = (drills || []).filter(d => d.bowler === bowler && d.date === (sessionDate || drill.date) && ((d.made || 0) + (d.missed || 0)) > 0);
  const history = targetHistory(drills || [], bowler, drill.target);
  const prev = history.length ? history[history.length - 1] : null;

  return (
    <div>
      <div style={S.card}>
        <div style={S.label}>Drill</div>
        {/* A dropdown, like the ball below it.
            
            Twelve targets as chips wrapped to four rows, and with the pin
            deck under them the drill's own controls -- made, missed,
            notes -- started below the fold. A bowler mid-practice was
            scrolling to reach the two buttons they came for.
            
            One target at a time, so this was always a select. */}
        <select style={{ ...S.sel, width: "100%" }}
          value={drill.target || ""}
          onChange={e => onChange({
            ...drill,
            target: e.target.value,
            // Counts and notes both belong to the target you were working
            // on. Carrying "ball was coming in light" onto the 2-4-5 after
            // twenty 10-pins files an observation against a drill it was
            // never about -- and the counts already reset for exactly this
            // reason. Notes are per drill, like the made and missed.
            made: 0, missed: 0, notes: "",
          })}>
          {DRILL_TARGETS.map(t => {
            // "10" alone is a number; "10 pin" is a target.
            //
            // The short label is deliberately bare because it also fills
            // tight chips elsewhere, where the extra word does not fit.
            // A dropdown row has the space, and reading "7" in a list
            // next to "Pocket" and "3-6-10" gives no clue what it is.
            //
            // Only the purely numeric ones: "3-6-10 pin" and "Pocket
            // pin" would both be wrong.
            const short = targetShortLabel(t.id, leftHanded);
            const label = /^\d+$/.test(short) ? `${short} pin` : short;
            return <option key={t.id} value={t.id}>{label}</option>;
          })}
        </select>
        {drill.target === "custom" && (
          <>
            <input style={{ ...S.input, marginTop: "6px" }} placeholder="Name it (optional)"
              value={drill.customTarget} onChange={e => onChange({ ...drill, customTarget: e.target.value })} />
            {/* Naming the actual pins is what makes a custom drill
                comparable with anyone else's -- and mirrorable, so a
                lefty's 2-4-7 matches a righty's 3-6-10 instead of
                sitting in its own bucket forever. A name alone still
                works for shapes that aren't a fixed pin set. */}
            <div style={{ ...S.label, marginTop: "8px", marginBottom: "4px" }}>Pins (optional)</div>
            <div style={S.chips}>
              {["1","2","3","4","5","6","7","8","9","10"].map(pin => {
                const selected = (drill.customPins || []).includes(pin);
                return (
                  <Chip key={pin} label={pin} dense selected={selected}
                    onToggle={() => {
                      const cur = drill.customPins || [];
                      const next = selected ? cur.filter(x => x !== pin) : [...cur, pin];
                      onChange({ ...drill, customPins: normalizeCustomPins(next) });
                    }} />
                );
              })}
            </div>
          </>
        )}
        {(balls || []).length > 0 && (
          <>
            <div style={{ ...S.label, marginTop: "10px" }}>Ball</div>
            {/* A dropdown, not a chip per ball.
                
                A full arsenal is a dozen balls, and twelve chips wrapped
                to four rows pushed the drill itself off the screen. A
                bowler picks one ball and then bowls -- that is a select,
                not a filter.
                
                Empty option included so a chosen ball can be cleared,
                which the chips did by tapping the selected one again. */}
            <select style={{ ...S.sel, width: "100%" }}
              value={drill.ball || ""}
              onChange={e => onChange({ ...drill, ball: e.target.value })}>
              <option value="">No ball recorded</option>
              {balls.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </>
        )}
      </div>

      <div style={{ ...S.card, textAlign: "center", border: `1px solid ${C.accent}44` }}>
        <div style={{ fontSize: "12px", color: C.textMuted }}>
          {targetLabel(drill.target, drill.customTarget, leftHanded, drill.customPins)}
        </div>
        <div style={{ fontSize: "48px", fontWeight: 700, color: rate === null ? C.textMuted : rate >= 80 ? C.strike : rate >= 60 ? C.spare : C.miss, lineHeight: 1.1, margin: "8px 0" }}>
          {rate === null ? "—" : `${rate}%`}
        </div>
        <div style={{ fontSize: "13px", color: C.textMuted }}>
          {drill.made} of {n} {n === 1 ? "attempt" : "attempts"}
          {prev && n >= 5 && (
            <span style={{ color: rate >= prev.rate ? C.strike : C.miss }}>
              {" "}· last time {prev.rate}%
            </span>
          )}
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
          <button style={{ ...S.btn("primary"), flex: 1, padding: "20px", fontSize: "18px", backgroundColor: C.strike }}
            onClick={() => { onChange(recordMade(drill)); setLastTap(true); }}>
            ✓ Made
          </button>
          <button style={{ ...S.btn("primary"), flex: 1, padding: "20px", fontSize: "18px", backgroundColor: C.miss }}
            onClick={() => { onChange(recordMissed(drill)); setLastTap(false); }}>
            ✗ Missed
          </button>
        </div>
        {lastTap !== null && n > 0 && (
          <button style={{ ...S.btn(), marginTop: "8px", fontSize: "11px", padding: "6px 12px" }}
            onClick={() => { onChange(undo(drill, lastTap)); setLastTap(null); }}>
            Undo last
          </button>
        )}
      </div>

      <div style={S.card}>
        <textarea style={{ ...S.input, minHeight: "50px", resize: "vertical" }}
          placeholder="Shot notes — what worked on this drill…"
          value={drill.notes} onChange={e => onChange({ ...drill, notes: e.target.value })} />
      </div>

      <button style={S.btn("primary")} onClick={onSave} disabled={n === 0}>
        {saved ? "✓ Drill Saved" : n === 0 ? "Throw a few first" : `Save Drill (${n} attempts)`}
      </button>

      {/* A night can cover several targets. Without this the only way to
          work a second one was to change the target on the drill already
          saved -- which updated that record instead of adding a new one,
          quietly replacing the first drill. */}
      {onStartAnother && drill.id && (
        <button style={{ ...S.btn(), width: "100%", marginTop: "8px" }} onClick={onStartAnother}>
          + Start another drill
        </button>
      )}

      {/* Everything already saved tonight, so it's obvious the earlier
          drills are still there once you move on to the next target. */}
      {todaysDrills.length > 0 && (
        <div style={{ ...S.card, marginTop: "12px" }}>
          <div style={S.label}>Saved tonight</div>
          {todaysDrills.map(d => {
            const total = (d.made || 0) + (d.missed || 0);
            const rate = total ? Math.round(((d.made || 0) / total) * 100) : null;
            return (
              <div key={d.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                <span style={{ color: d.id === drill.id ? C.accent : C.textMuted }}>
                  {targetLabel(d.target, d.customTarget, leftHanded, d.customPins)}{d.id === drill.id ? " (editing)" : ""}
                </span>
                <span style={{ color: C.textMuted }}>
                  {d.made}/{total}{rate != null && total >= 5 ? ` · ${rate}%` : ""}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Weekly, not per-session: over a season a list of one-off
          percentages is noise, and a 2-attempt night would otherwise
          swing a week as hard as a 40-attempt one. Attempts are pooled
          within the week and the rate computed from the total. */}
      {/* By-week and over-time have moved out.
          
          Both were history: eight weeks of conversion rates and the last
          six sittings at this target. Useful, but not while a bowler is
          stood on the approach with a ball in hand -- they pushed Made and
          Missed down the screen to make room for last month.
          
          They belong in a stats view for drills, where looking back is
          the whole point. */}

      <div style={{ height: "32px" }} />
    </div>
  );
}
