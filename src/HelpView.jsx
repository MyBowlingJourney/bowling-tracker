import { useState } from "react";
import { C, S } from "./ui.jsx";
import { searchHelp, helpByArea, helpFor, HELP } from "./domain/help.js";

// Searchable help, scoped to the mode being bowled. Entries used to carry
// a "Take me there" button; see Entry below for why it came out.
export default function HelpView({ onNavigate, onClose, onReplayTour, environment }) {
  const [query, setQuery] = useState("");
  // Scoped to the mode: a Just Bowling user's docs should describe their
  // app, not features their app doesn't have.
  const scoped = helpFor(environment);
  const results = query.trim() ? searchHelp(query, scoped) : null;
  const areas = helpByArea(scoped);

  function Entry({ entry }) {
    return (
      <div style={{ padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontSize: "14px", fontWeight: 600, color: C.text, marginBottom: "3px" }}>
          {entry.title}
        </div>
        <div style={{ fontSize: "12.5px", color: C.textMuted, lineHeight: 1.5 }}>
          {entry.body}
        </div>
        {/* "Take me there" removed. Every entry's view is a top-level
            screen, but most of what the entries describe lives inside a
            mode or a tab -- so the button landed on Scoring for nearly
            everything, which is worse than no button: it sends a bowler
            somewhere confidently wrong. The words say where to go. */}
      </div>
    );
  }

  return (
    <>
      <div style={S.card}>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "10px" }}>
          <input
            style={{ ...S.input, flex: 1 }}
            type="search"
            placeholder="Search help — try 'buy-in' or 'prebowl'"
            value={query}
            autoFocus
            onChange={e => setQuery(e.target.value)} />
          {onClose && (
            <button style={{ ...S.btn(), padding: "10px 12px", flexShrink: 0 }} onClick={onClose}>
              Close
            </button>
          )}
        </div>

        {onReplayTour && !query.trim() && (
          <button style={{ ...S.btn(), width: "100%", fontSize: "12px" }}
            onClick={() => { onReplayTour(); onClose?.(); }}>
            Show me around the app again
          </button>
        )}
      </div>

      {/* Nothing found is a real answer, and saying so beats an empty
          screen that looks broken. */}
      {results && results.length === 0 && (
        <div style={S.card}>
          <div style={{ fontSize: "13px", color: C.textMuted, lineHeight: 1.5 }}>
            Nothing matched "{query}". Try a word you'd see in the app — "spare", "team",
            "ball", "import".
          </div>
        </div>
      )}

      {results && results.length > 0 && (
        <div style={S.card}>
          <div style={S.label}>
            {results.length} {results.length === 1 ? "result" : "results"}
          </div>
          {results.map(e => <Entry key={e.id} entry={e} />)}
        </div>
      )}

      {/* Browsable when nothing has been typed: someone who doesn't know
          what to search for still needs a way in. */}
      {!results && areas.map(area => (
        <div key={area.label} style={S.card}>
          <div style={S.label}>{area.label}</div>
          {area.entries.map(e => <Entry key={e.id} entry={e} />)}
        </div>
      ))}
    </>
  );
}
