import { useState, useRef, useEffect } from "react";
import { C, S } from "./ui.jsx";
import { searchPatterns, patternDisplayName, describePattern } from "./domain/oilPatterns.js";

// Type-ahead over the oil pattern catalogue.
//
// Used in two places that were both free-text boxes: the league's usual
// pattern (Settings) and the pattern bowled on a given night (Log).
//
// ── Why type-ahead and not a dropdown ───────────────────────────────
//
// The catalogue is long and a bowler already knows the name they want.
// A <select> of every PBA and Kegel pattern is a scroll; typing "cham"
// is two seconds. searchPatterns already ranks prefix matches first, so
// the thing you meant is usually the first row.
//
// ── Free text is NOT a fallback for errors ──────────────────────────
//
// House shots have local names, a centre can run something homemade, and
// a brand new PBA pattern will not be in the catalogue the week it
// appears. So whatever is typed is kept whether or not it matches
// anything -- exactly the reasoning CenterPicker uses for houses HERE
// has never heard of. The list is an accelerator, never a gate.
//
// ── Picking fills the specs ─────────────────────────────────────────
//
// On the Log screen the pattern name sits beside length, volume and
// ratio. Those are properties OF the pattern, so choosing a known one
// hands them over rather than asking a bowler to copy three numbers off
// a sheet taped to the wall. onPick receives the whole pattern; callers
// with nowhere to put the specs simply ignore it.
export default function OilPatternPicker({
  value = "",
  patterns = [],
  onChange,
  placeholder = "Pattern name",
  autoFocus = false,
}) {
  const [text, setText] = useState(value || "");
  const [open, setOpen] = useState(false);
  const [touched, setTouched] = useState(false);
  const boxRef = useRef(null);

  // Follow the value in from outside, but never while the bowler is
  // mid-edit -- a cloud load landing on their third keystroke would
  // otherwise yank the box back to the old name.
  useEffect(() => {
    if (!touched) setText(value || "");
  }, [value, touched]);

  // A tap anywhere else closes the list. Without this the suggestions
  // hang over the rest of the form on mobile, where there is no hover to
  // make it obvious they are still there.
  useEffect(() => {
    function onDocDown(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocDown);
    document.addEventListener("touchstart", onDocDown);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      document.removeEventListener("touchstart", onDocDown);
    };
  }, []);

  // searchPatterns answers [] below two characters, which is what keeps
  // the whole catalogue from dropping down on the first letter.
  const matches = open ? searchPatterns(text, patterns, 8) : [];

  function commit(name, pattern) {
    setTouched(false);
    setText(name);
    setOpen(false);
    if (typeof onChange === "function") onChange(name, pattern || null);
  }

  return (
    <div ref={boxRef} style={{ position: "relative" }}>
      <input
        style={{ ...S.input, width: "100%" }}
        placeholder={placeholder}
        value={text}
        autoFocus={autoFocus}
        onChange={e => { setTouched(true); setText(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        // Saves on blur rather than per keystroke: the league version of
        // this writes to the cloud.
        onBlur={() => { if (touched) commit(text.trim(), null); }}
        onKeyDown={e => {
          if (e.key === "Enter") { e.preventDefault(); commit(text.trim(), null); }
          if (e.key === "Escape") setOpen(false);
        }} />

      {matches.length > 0 && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, zIndex: 40,
          backgroundColor: C.surface, border: `1px solid ${C.border}`,
          borderRadius: "12px", marginTop: "4px", overflow: "hidden",
          maxHeight: "240px", overflowY: "auto",
        }}>
          {matches.map(p => (
            <button
              key={p.id || p.name}
              type="button"
              // onMouseDown, not onClick: blur fires first on a click and
              // would commit the half-typed text, closing the list out
              // from under the finger that was choosing from it.
              onMouseDown={e => { e.preventDefault(); commit(p.name, p); }}
              style={{
                display: "block", width: "100%", textAlign: "left",
                background: "none", border: "none", cursor: "pointer",
                padding: "10px 12px", borderBottom: `1px solid ${C.border}`,
                WebkitTapHighlightColor: "transparent",
              }}>
              <div style={{ fontSize: "14px", color: C.text }}>{patternDisplayName(p)}</div>
              {describePattern(p) && (
                <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "2px" }}>
                  {describePattern(p)}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
