import { useState } from "react";
import { C, S, Chip } from "./ui.jsx";
import { journalEntries, searchJournal, journalByDate, filterJournal, journalKinds } from "./domain/journal.js";
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
  pattern: { label: "Pattern", color: "spare" },
  drill: { label: "Drill", color: "spare" },
  shot: { label: "Shot", color: "textMuted" },
};

export default function JournalView({
  sessions = [], shots = [], drills = [], tournaments = [], patterns = [], bowler = "",
}) {
  const [query, setQuery] = useState("");
  // Which kinds are on. Empty is "all of them" rather than "none",
  // which keeps the common case free of taps.
  const [kinds, setKinds] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const all = journalEntries({ sessions, shots, drills, tournaments, patterns, bowler, labelFor: targetLabel });
  const available = journalKinds(all);
  const narrowed = filterJournal(searchJournal(all, query), { kinds, from, to });
  const days = journalByDate(narrowed);
  const filtered = kinds.length > 0 || !!from || !!to;

  const toggleKind = k => setKinds(cur =>
    cur.includes(k) ? cur.filter(x => x !== k) : [...cur, k]);
  const clearFilters = () => { setKinds([]); setFrom(""); setTo(""); };

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
      <input style={{ ...S.input, marginBottom: "8px" }}
        placeholder="Search your notes…"
        value={query} onChange={e => setQuery(e.target.value)} />

      {/* Filters, folded away until asked for.
      
          A journal of six notes needs none of this, and a row of
          controls above six notes is the screen telling a bowler their
          journal is complicated. It opens when there is something to
          narrow -- and stays open while a filter is on, so a screen
          showing a subset always says why. */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
        <button
          onClick={() => setShowFilters(v => !v)}
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer",
            color: filtered ? C.accent : C.textMuted, fontSize: "12px", textDecoration: "underline" }}>
          {showFilters || filtered ? "Filters" : "Filter"}
          {filtered ? ` · ${narrowed.length} of ${all.length}` : ""}
        </button>
        {filtered && (
          <button onClick={clearFilters}
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer",
              color: C.textMuted, fontSize: "12px", textDecoration: "underline" }}>
            Clear
          </button>
        )}
      </div>

      {(showFilters || filtered) && (
        <div style={{ ...S.card, padding: "12px 14px", marginBottom: "12px" }}>
          {available.length > 1 && (<>
            <div style={{ ...S.label, marginBottom: "6px" }}>Kind</div>
            <div style={{ ...S.chips, marginBottom: "10px" }}>
              {available.map(k => (
                <Chip key={k} label={KIND[k].label} dense
                  selected={kinds.includes(k)}
                  onToggle={() => toggleKind(k)} />
              ))}
            </div>
          </>)}
          <div style={{ ...S.label, marginBottom: "6px" }}>Dates</div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <input style={{ ...S.input, flex: 1, fontSize: "13px" }} type="date"
              aria-label="From date"
              value={from} onChange={e => setFrom(e.target.value)} />
            <span style={{ fontSize: "12px", color: C.textMuted }}>to</span>
            <input style={{ ...S.input, flex: 1, fontSize: "13px" }} type="date"
              aria-label="To date"
              value={to} onChange={e => setTo(e.target.value)} />
          </div>
        </div>
      )}

      {!days.length && (
        <div style={{ ...S.card, fontSize: "13px", color: C.textMuted }}>
          {query
            ? `Nothing matches “${query}”${filtered ? " in that range" : ""}.`
            : "Nothing written in that range."}
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
