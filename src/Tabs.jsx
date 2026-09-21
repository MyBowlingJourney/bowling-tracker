import { useState } from "react";
import { C, S } from "./ui.jsx";
import { initialTab } from "./domain/statsTabGroups.js";

// The pill tab bar shared by every tabbed card. Real buttons with
// aria-pressed, so it is keyboard- and screen-reader-usable, and 36px
// tall inside a 44px row.
export function TabBar({ tabs, value, onChange, label }) {
  return (
    <div role="group" aria-label={label}
      style={{ display: "flex", gap: "2px", padding: "2px", borderRadius: "999px",
        background: C.bg, border: `1px solid ${C.border}`, marginBottom: "14px" }}>
      {tabs.map(t => {
        const on = t.id === value;
        return (
          <button key={t.id} type="button" aria-pressed={on} onClick={() => onChange(t.id)}
            style={{ flex: 1, minWidth: 0, minHeight: "36px", padding: "0 6px", border: "none",
              borderRadius: "999px", font: "inherit", fontSize: "12px", fontWeight: 600,
              cursor: "pointer", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              background: on ? C.card : "transparent", color: on ? C.text : C.textMuted,
              boxShadow: on ? `0 0 0 1px ${C.border}` : "none" }}>
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

// Last tab used, per card. A convenience: storage that throws or comes
// back empty just means the first tab.
const KEY = id => `mbj.statsTab.${id}`;
function readTab(id) { try { return window.localStorage.getItem(KEY(id)); } catch { return null; } }
function writeTab(id, v) { try { window.localStorage.setItem(KEY(id), v); } catch { /* fine */ } }

export function useRememberedTab(id, tabIds) {
  const [picked, setPicked] = useState(() => readTab(id));
  const value = initialTab(tabIds.map(card => ({ card })), picked);
  const choose = v => { setPicked(v); writeTab(id, v); };
  return [value, choose];
}

// A group of existing stats cards shown as one card with tabs.
//
// Each member is still its own card -- same component, same data, same
// lock if it's paid -- rendered inside this one with its outer chrome
// taken off, so it reads as a tab of this card rather than a card in a
// card. Its own heading goes too, since the tab already names it; a
// header that carries a control (the leave cards' missed/made switch)
// is not a bare heading and stays.
export function TabbedGroupCard({ group, tabs, render }) {
  const [value, choose] = useRememberedTab(group.id, tabs.map(t => t.card));
  const scope = `tg-${group.id}`;
  return (
    <div style={S.card}>
      <style>{`
        .${scope} > div { border: none !important; background: transparent !important;
          padding: 0 !important; margin: 0 !important; box-shadow: none !important; }
        .${scope} > div > div:first-child[style*="letter-spacing: 0.01em"] { display: none; }
      `}</style>
      <div style={S.label}>{group.title}</div>
      <TabBar label={`${group.title} view`} value={value} onChange={choose}
        tabs={tabs.map(t => ({ id: t.card, label: t.label }))} />
      <div className={scope}>{render(value)}</div>
    </div>
  );
}
