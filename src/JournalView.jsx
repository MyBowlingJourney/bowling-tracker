import { useState } from "react";
import { C, S } from "./ui.jsx";
import { journalEntries, searchJournal, journalByDate } from "./domain/journal.js";
import { targetLabel } from "./domain/drills.js";
import { formatDate } from "./constants.js";

// Everything you have written, in one place.
//
// The notes themselves live where they were written -- on the shot, the
// drill, the session. This only reads them, so editing a note at its
// source changes it here and there is no second copy to drift.

const KIND = {
  session: { label: "Night", color: "accent" },
  tournament: { label: "Tournament", color: "strike" },
  drill: { label: "Drill", color: "spare" },
  shot: { label: "Shot", color: "textMuted" },
};

export default function JournalView({
  sessions = [], shots = [], drills = [], tournaments = [], bowler = "",
}) {
  const [query, setQuery] = useState("");

  const all = journalEntries({ sessions, shots, drills, tournaments, bowler, labelFor: targetLabel });
  const days = journalByDate(searchJournal(all, query));

  if (!all.length) {
    return (
      <div style={{ ...S.card, fontSize: "13px", color: C.textMuted, lineHeight: 1.6 }}>
        Nothing written yet. Notes you add to a shot, a drill or the end of a
        night all collect here, so you can look back at what you were working
        on and what you said about it.
      </div>
    );
  }

  return (
    <>
      {/* Search first, because the journal is worth having only once it
          is too long to scroll -- and by then finding is the whole job. */}
      <input style={{ ...S.input, marginBottom: "12px" }}
        placeholder="Search your notes…"
        value={query} onChange={e => setQuery(e.target.value)} />

      {!days.length && (
        <div style={{ ...S.card, fontSize: "13px", color: C.textMuted }}>
          Nothing matches {`“${query}”`}.
        </div>
      )}

      {days.map(day => (
        <div key={day.date} style={{ marginBottom: "16px" }}>
          <div style={{ ...S.label, marginBottom: "6px" }}>
            {formatDate(day.date)}
          </div>
          {day.entries.map((e, i) => (
            <div key={i} style={{ ...S.card, padding: "12px 14px", marginBottom: "8px" }}>
              <div style={{ display: "flex", alignItems: "baseline",
                justifyContent: "space-between", gap: "8px", marginBottom: "4px" }}>
                {/* What kind of note, so a one-line remark about a single
                    delivery is not mistaken for a verdict on the night. */}
                <span style={{ fontSize: "11px", color: C[KIND[e.kind].color] }}>
                  {KIND[e.kind].label}
                </span>
                {e.detail && (
                  <span style={{ fontSize: "11px", color: C.textMuted,
                    textAlign: "right", minWidth: 0 }}>
                    {e.detail}
                  </span>
                )}
              </div>
              <div style={{ fontSize: "14px", color: C.text, lineHeight: 1.5 }}>
                {e.text}
              </div>
              {e.league && (
                <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "4px" }}>
                  {e.league}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
