import { useState, useEffect, useRef } from "react";
import { C, F } from "./ui.jsx";

// The header's ☰ menu: help search at the top, then Profile and Settings.
//
// Search, Profile and Settings were three separate header buttons, which
// with Import, Brooklyn, sync and inbox left the app name almost no room.
// None of the three is used mid-game, so they fold behind one button and
// the header keeps the two things worth one tap: Brooklyn and Import.
//
// The search box is live the moment the menu opens. Enter (or the
// arrow) opens Help with what was typed already searched; an empty
// submit opens Help's full index, which is what the old 🔍 button did.
export default function HeaderMenu({ onSearch, onOpenProfile, onOpenSettings }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = e => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function close() { setOpen(false); setQuery(""); }
  function go(fn) { close(); fn?.(); }
  function submit(e) {
    e.preventDefault();
    const q = query.trim();
    close();
    onSearch?.(q);
  }

  const btn = {
    width: "34px", height: "34px", borderRadius: "10px", padding: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    background: open ? C.accent + "22" : C.surface,
    border: `1px solid ${open ? C.accent : C.border}`,
    boxShadow: `0 4px 12px ${C.bg}22`, cursor: "pointer", flexShrink: 0,
    WebkitTapHighlightColor: "transparent",
  };

  const Row = ({ icon, label, detail, onClick }) => (
    <button type="button" onClick={onClick}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: "11px",
        padding: "11px 8px", background: "none", border: "none",
        borderTop: `1px solid ${C.border}`, cursor: "pointer", textAlign: "left",
        color: C.text, fontFamily: F.body, WebkitTapHighlightColor: "transparent",
      }}>
      <span aria-hidden="true" style={{
        width: "32px", height: "32px", borderRadius: "9px", flexShrink: 0,
        background: C.surface, border: `1px solid ${C.border}`,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px",
      }}>{icon}</span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontSize: "14px", fontWeight: 700 }}>{label}</span>
        <span style={{ display: "block", fontSize: "11.5px", color: C.textMuted, marginTop: "1px" }}>{detail}</span>
      </span>
      <span aria-hidden="true" style={{ color: C.textMuted, fontSize: "20px", lineHeight: 1 }}>›</span>
    </button>
  );

  return (
    <>
      <button type="button" onClick={() => (open ? close() : setOpen(true))}
        aria-label="Menu" aria-expanded={open} aria-haspopup="menu" style={btn}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.text}
          strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {open && (
        <>
          {/* Tap anywhere else to close. Dimmed lightly so the menu reads
              as on top of the screen, not part of it. */}
          <div onClick={close} aria-hidden="true"
            style={{ position: "fixed", inset: 0, zIndex: 190, background: "rgba(0,0,0,0.35)" }} />
          <div role="menu" style={{
            position: "fixed", zIndex: 191,
            top: "calc(66px + env(safe-area-inset-top, 0px))", right: "10px",
            width: "min(280px, calc(100vw - 20px))",
            background: C.card, border: `1px solid ${C.border}`, borderRadius: "16px",
            boxShadow: "0 18px 40px rgba(0,0,0,0.45)", padding: "10px",
          }}>
            <form onSubmit={submit} role="search"
              style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px",
                background: C.surface, border: `1px solid ${C.accent}88`, borderRadius: "11px",
                padding: "0 6px 0 11px" }}>
              <span aria-hidden="true" style={{ fontSize: "14px" }}>🔍</span>
              <input ref={inputRef} id="header-menu-search" type="search" value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search help…" aria-label="Search help" enterKeyHint="search"
                style={{ flex: 1, minWidth: 0, background: "none", border: "none", outline: "none",
                  boxShadow: "none", color: C.text, fontSize: "14px", fontFamily: F.body,
                  padding: "11px 0" }} />
              <button type="submit" aria-label="Search"
                style={{ background: "none", border: "none", color: C.accent, fontSize: "20px",
                  cursor: "pointer", padding: "4px 6px", lineHeight: 1 }}>›</button>
            </form>
            <Row icon="👤" label="Profile" detail="Name, hand, style, home centers"
              onClick={() => go(onOpenProfile)} />
            <Row icon="⚙️" label="Settings" detail="Theme, stats cards, account"
              onClick={() => go(onOpenSettings)} />
          </div>
        </>
      )}
    </>
  );
}
