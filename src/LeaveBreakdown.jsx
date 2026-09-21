import { useState } from "react";
import { C, S } from "./ui.jsx";
import { rankLeaves, pageState, nextShown, leavePins, leaveLabel, FIRST_PAGE } from "./domain/leaveRanking.js";

// Shared body of the Splits and Non-Split Leaves cards.
//
// Top three as ranked rows with a bar -- "fix these first" -- then
// everything past three as a gallery of small racks, revealed 7 at a time.
// A switch in the header flips the ranking between most missed and most
// made. Leaves are drawn, not listed: a numbered list of pin leaves read
// as a wall of digits, and a rack is recognisable at a glance.

// Physical positions, back row first. Pins are physical here -- this is
// what was standing, not a hand-adjusted reading of it.
const PIN_XY = {7:[0,0],8:[1,0],9:[2,0],10:[3,0],4:[.5,1],5:[1.5,1],6:[2.5,1],2:[1,2],3:[2,2],1:[1.5,3]};

export function MiniRack({ pins, size = 48, color }){
  const standing = new Set(pins);
  const step = size / 4, r = step * 0.34, h = Math.round(step * 3 + 2 * r + 2);
  return (
    <svg width={size} height={h} viewBox={`0 0 ${size} ${h}`} role="img"
      aria-label={pins.length ? `${pins.join("-")} standing` : "no pins"} style={{ flexShrink: 0, display: "block" }}>
      {Object.entries(PIN_XY).map(([p, [x, y]]) => {
        const up = standing.has(Number(p));
        return <circle key={p} cx={step / 2 + x * step} cy={r + 1 + y * step}
          r={up ? r : r * 0.55} fill={up ? color : C.border} />;
      })}
    </svg>
  );
}

const rateColor = rate => rate >= 70 ? C.strike : rate >= 40 ? C.spare : C.miss;

function ModeSwitch({ mode, onChange }){
  const opt = (value, label) => {
    const on = mode === value;
    return (
      <button type="button" aria-pressed={on} onClick={() => onChange(value)}
        style={{ border: "none", cursor: "pointer", font: "inherit", fontSize: "11px", fontWeight: 600,
          padding: "6px 10px", minHeight: "30px", borderRadius: "999px",
          background: on ? C.card : "transparent", color: on ? C.text : C.textMuted,
          boxShadow: on ? `0 0 0 1px ${C.border}` : "none" }}>
        {label}
      </button>
    );
  };
  return (
    <div role="group" aria-label="Rank leaves by"
      style={{ display: "inline-flex", gap: "2px", padding: "2px", borderRadius: "999px", background: C.bg, border: `1px solid ${C.border}` }}>
      {opt("missed", "Top missed")}
      {opt("made", "Top made")}
    </div>
  );
}

export default function LeaveBreakdown({ title, rows, color, lead, children }){
  const [mode, setMode] = useState("missed");
  const [shown, setShown] = useState(FIRST_PAGE);
  const ranked = rankLeaves(rows, mode);
  const { visible, button } = pageState(ranked.length, shown);
  const top = ranked.slice(0, Math.min(FIRST_PAGE, visible));
  const rest = ranked.slice(FIRST_PAGE, visible);
  const barKey = mode === "made" ? "made" : "missed";
  const barColor = mode === "made" ? C.strike : color;
  const barMax = Math.max(1, ...ranked.map(r => r[barKey]));

  return (
    <div style={S.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
        <div style={{ ...S.label, marginBottom: 0 }}>{title}</div>
        {ranked.length > 0 && <ModeSwitch mode={mode} onChange={setMode} />}
      </div>
      {lead}
      {children}

      {top.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "12px" }}>
          {top.map(r => {
            const { name, pins } = leaveLabel(r);
            return (
              <div key={r.pins || r.key} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <MiniRack pins={leavePins(r)} size={46} color={color} />
                <div style={{ flexGrow: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: "14px" }}>
                    <span style={{ fontWeight: 600 }}>
                      {name || pins}
                      {name && <span style={{ fontSize: "11px", fontWeight: 400, color: C.textMuted, marginLeft: "6px" }}>{pins}</span>}
                    </span>
                    <span style={{ fontWeight: 700, color: rateColor(r.rate) }}>{r.rate}%</span>
                  </div>
                  <div style={{ height: "8px", borderRadius: "4px", background: C.border, margin: "5px 0 4px" }}>
                    <div style={{ height: "8px", borderRadius: "4px", width: `${(r[barKey] / barMax) * 100}%`, background: barColor }} />
                  </div>
                  <div style={{ fontSize: "11px", color: C.textMuted }}>
                    {mode === "made" ? `${r.made} made of ${r.count}` : `${r.missed} missed of ${r.count}`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {rest.length > 0 && (
        <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: `1px solid ${C.border}` }}>
          <div style={{ ...S.label, marginBottom: "8px" }}>Everything else</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "8px" }}>
            {rest.map(r => {
              const { name, pins } = leaveLabel(r);
              return (
                <div key={r.pins || r.key} title={name ? `${name} (${pins})` : pins}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
                    padding: "10px 4px", border: `1px solid ${C.border}`, borderRadius: "12px" }}>
                  <MiniRack pins={leavePins(r)} size={48} color={color} />
                  <div style={{ fontSize: "12px", fontWeight: 600, color: C.text }}>{pins}</div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: rateColor(r.rate) }}>{r.rate}%</div>
                  <div style={{ fontSize: "11px", color: C.textMuted }}>{r.made} of {r.count}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {button && (
        <button type="button" onClick={() => setShown(nextShown(ranked.length, shown))}
          style={{ marginTop: "8px", minHeight: "44px", padding: "0 4px", background: "none", border: "none",
            font: "inherit", fontSize: "13px", fontWeight: 600, color: C.accent, cursor: "pointer" }}>
          {button === "more" ? "Show more" : button === "all" ? `Show all ${ranked.length}` : "Collapse all"}
        </button>
      )}
    </div>
  );
}
