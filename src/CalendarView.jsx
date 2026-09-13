import { useState } from "react";
import { C, S } from "./ui.jsx";
import {
  monthGrid, monthsWithSessions, monthLabel, weekdayLabels, shiftMonth,
} from "./domain/calendar.js";

// A month of bowling nights.
//
// The Sessions list answers "what did I shoot". This answers a different
// question: when do I actually bowl, and what does a month of it look
// like. Gaps carry as much as entries -- three weeks missed in February
// is obvious here and invisible in a list.
//
// A tapped night expands in place rather than navigating away, because
// the reason to be here is scanning the shape of a month and losing the
// grid to see one night defeats that.
export default function CalendarView({
  sessions = [], bowler = "", league = "", weekStart = 0,
}) {
  const months = monthsWithSessions(sessions, bowler, league);
  const [monthIdx, setMonthIdx] = useState(0);
  const [openDate, setOpenDate] = useState(null);

  if (!months.length) {
    return (
      <div style={S.card}>
        <div style={{ fontSize: "12px", color: C.textMuted, lineHeight: 1.5 }}>
          Nothing logged yet. Once you've bowled a night or two, this shows the
          shape of a month — which weeks you bowled and which you missed.
        </div>
      </div>
    );
  }

  // Clamped rather than wrapped: paging past the oldest month should
  // stop, not jump to the newest.
  const key = months[Math.min(Math.max(monthIdx, 0), months.length - 1)];
  const grid = monthGrid(key, sessions, bowler, league, weekStart);
  if (!grid) return null;

  // Stepping moves by calendar month, but only lands on months with
  // something in them -- an empty month between two busy ones is worth
  // seeing INSIDE a grid, not as a blank page to click through.
  const step = dir => {
    const next = monthIdx + dir;
    if (next < 0 || next >= months.length) return;
    setMonthIdx(next);
    setOpenDate(null);
  };

  const open = openDate
    ? grid.cells.find(c => c.date === openDate)
    : null;

  return (
    <>
      <div style={{ ...S.card, paddingBottom: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
          <button
            onClick={() => step(1)}
            disabled={monthIdx >= months.length - 1}
            aria-label="Earlier month"
            style={{
              ...S.btn("sm"), width: "auto", padding: "4px 10px",
              opacity: monthIdx >= months.length - 1 ? 0.35 : 1,
            }}>‹</button>
          <div style={{ flex: 1, textAlign: "center", fontSize: "14px", fontWeight: 600, color: C.text }}>
            {grid.label}
          </div>
          <button
            onClick={() => step(-1)}
            disabled={monthIdx <= 0}
            aria-label="Later month"
            style={{
              ...S.btn("sm"), width: "auto", padding: "4px 10px",
              opacity: monthIdx <= 0 ? 0.35 : 1,
            }}>›</button>
        </div>

        <div style={{ fontSize: "11px", color: C.textMuted, textAlign: "center", marginBottom: "10px" }}>
          {grid.nightsBowled
            ? `${grid.nightsBowled} night${grid.nightsBowled === 1 ? "" : "s"} · ${grid.games} games · ${grid.average} average · ${grid.high} high`
            : "Nothing bowled this month"}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
          {weekdayLabels(weekStart).map((d, i) => (
            <div key={i} style={{
              fontSize: "10px", color: C.textMuted, textAlign: "center",
              paddingBottom: "4px",
            }}>{d}</div>
          ))}

          {grid.cells.map((cell, i) => {
            const bowled = cell.nights.length > 0;
            const selected = cell.date && cell.date === openDate;
            return (
              <button
                key={i}
                disabled={!bowled}
                onClick={() => setOpenDate(selected ? null : cell.date)}
                style={{
                  aspectRatio: "1", border: selected ? `1.5px solid ${C.accent}` : "1px solid transparent",
                  borderRadius: "6px",
                  // A bowled night is filled; an empty day is just a
                  // number. The contrast is the whole point of the view.
                  backgroundColor: bowled ? C.accent + "33" : "transparent",
                  color: cell.day === null ? "transparent" : (bowled ? C.text : C.textMuted),
                  fontSize: "11px", fontWeight: bowled ? 600 : 400,
                  cursor: bowled ? "pointer" : "default",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: "1px",
                  padding: 0, WebkitTapHighlightColor: "transparent",
                }}>
                <span>{cell.day ?? ""}</span>
                {/* The series is the one number that fits in a box this
                    size. Everything else waits for a tap. */}
                {bowled && (
                  <span style={{ fontSize: "8.5px", fontWeight: 400, color: C.textMuted }}>
                    {cell.nights.length === 1 ? cell.nights[0].series : `${cell.nights.length}×`}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {open && open.nights.map((night, i) => (
        <div key={i} style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: C.text }}>
              {night.league || "Bowling"}
            </div>
            <div style={{ fontSize: "12px", color: C.textMuted }}>{night.date}</div>
          </div>
          <div style={{ fontSize: "13px", color: C.text, marginBottom: "4px" }}>
            {night.scores.join(" · ")}
          </div>
          <div style={{ fontSize: "11px", color: C.textMuted }}>
            {night.series} series · {night.average} average · {night.high} high
          </div>
        </div>
      ))}
    </>
  );
}
