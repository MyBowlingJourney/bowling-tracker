import { useState, useEffect, useMemo } from "react";
import { C, S } from "./ui.jsx";
import { supabase } from "./supabaseClient.js";
import { isContainerLeague } from "./domain/leagueMembership.js";

// Asks a lapsed bowler which league stays active.
//
// A free account keeps one real league. Which one is THEIRS to choose --
// the app defaults to the one they bowled most recently and would be
// right most of the time, but "most of the time" is not good enough when
// the wrong guess makes their Thursday night disappear.
//
// NOTHING IS DELETED. Every shot in every league keeps syncing, keeps
// exporting, and comes straight back the moment they subscribe. This
// picker only decides what the app shows in the meantime, which is why
// the copy below says "paused" and never says "removed".
//
// ── Chosen once ─────────────────────────────────────────────────────
//
// The first pick is free and final; changing it is part of Pro. Letting
// a free bowler re-pick at will made the limit a formality -- keep
// Tuesday, log Tuesday, switch to Thursday, log Thursday.
//
// The rule lives in the database, not here: the write goes through the
// set_kept_league() function, and the bowler has no direct UPDATE on
// entitlements at all. The anon key ships in every copy of the app, so a
// rule this file enforced would be one console call from gone.
//
// The function also creates the entitlements row when there isn't one --
// a bowler who never subscribed has none, and this used to tell them
// "there is no subscription on this account" and save nothing.
export default function KeptLeaguePicker({
  leagues = [],
  keptLeagueName = "",
  defaultLeagueName = "",
  leagueIds = {},
  userId = "",
  onSaved,
  // Opens the Subscribe screen. This card is the moment a free bowler
  // feels the one-league limit, so the way out of it sits right beside
  // the choice rather than three screens away in Settings.
  onUpgrade,
}) {
  const [choice, setChoice] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  // Real leagues only. Practice, Just Bowling and Tournament are storage
  // rather than leagues anybody joined -- they are never counted against
  // the limit and so are never on offer here.
  const real = useMemo(
    () =>
      [...new Set((Array.isArray(leagues) ? leagues : [])
        .filter(n => typeof n === "string" && n.trim() && !isContainerLeague(n)))]
        .sort(),
    [leagues],
  );

  // Seeded in an effect rather than in useState, because the leagues
  // arrive from the database a moment after this first renders -- a
  // useState initialiser would run against an empty list and stick.
  // Re-seeds only while the bowler has not touched the control.
  useEffect(() => {
    if (choice && real.includes(choice)) return;
    const seed = [keptLeagueName, defaultLeagueName].find(n => n && real.includes(n)) || real[0] || "";
    if (seed !== choice) setChoice(seed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [real.join("\u0001"), keptLeagueName, defaultLeagueName]);

  // Every hook above this line, and the early return below it. A return
  // placed higher throws "rendered fewer hooks than expected" the first
  // time a bowler joins a second league and this branch flips.
  if (real.length <= 1) return null;

  // Already chosen: say which, and that changing it is Pro. No select --
  // offering a choice the database will refuse is a trap.
  if (keptLeagueName && real.includes(keptLeagueName)) {
    const others = real.filter(n => n !== keptLeagueName);
    return (
      <div style={{ ...S.card, border: `1px solid ${C.accent}66`, backgroundColor: C.accent + "0D" }}>
        <div style={{ ...S.label, color: C.accent }}>Your active league</div>
        <div style={{ fontSize: "15px", fontWeight: 600, color: C.text, marginBottom: "8px" }}>
          {keptLeagueName}
        </div>
        <div style={{ fontSize: "12px", color: C.textMuted, lineHeight: 1.5, marginBottom: "12px" }}>
          The free plan follows this league.{others.length ? ` Paused: ${others.join(", ")}.` : ""} Switching
          leagues, or bowling more than one, is part of Pro — and everything you have
          logged comes back when you subscribe.
        </div>
        {typeof onUpgrade === "function" && (
          <button style={S.btn("primary")} onClick={onUpgrade}>Get Pro</button>
        )}
      </div>
    );
  }

  const paused = real.filter(n => n !== choice);

  async function save() {
    if (!choice || !userId) return;
    const id = leagueIds?.[choice];
    if (!id) {
      // A league that exists on screen but has no row id yet is one that
      // has not finished syncing. Saving its name would write nothing and
      // look like success.
      setStatus("error");
      setMessage("That league is still syncing. Give it a moment and try again.");
      return;
    }
    if (!supabase) return;
    setStatus("saving");
    setMessage("");
    try {
      const { error } = await supabase.rpc("set_kept_league", { p_league_id: id });
      if (error) {
        setStatus("error");
        setMessage(error.hint === "kept_league_locked"
          ? "Your active league is already chosen. Switching leagues is part of Pro."
          : "Could not save that just now. Your leagues are untouched — try again in a minute.");
        console.error("kept league save failed:", error.message);
        return;
      }
      setStatus("saved");
      setMessage("");
      if (typeof onSaved === "function") onSaved(choice);
    } catch (e) {
      setStatus("error");
      setMessage("Could not save that just now. Your leagues are untouched — try again in a minute.");
      console.error("kept league save threw:", String(e));
    }
  }

  return (
    <div style={{ ...S.card, border: `1px solid ${C.accent}66`, backgroundColor: C.accent + "0D" }}>
      <div style={{ ...S.label, color: C.accent }}>Choose your active league</div>

      <div style={{ fontSize: "12px", color: C.textMuted, lineHeight: 1.5, marginBottom: "12px" }}>
        A free account follows one league. Pick the one you want to keep bowling
        with — you choose once, and switching later is part of Pro. The rest are
        paused, not deleted, and everything you have logged comes back when you
        subscribe.
      </div>

      <div style={{ ...S.row, marginBottom: "12px" }}>
        <select
          style={S.sel}
          value={choice}
          onChange={e => { setChoice(e.target.value); setStatus("idle"); setMessage(""); }}
          aria-label="Active league"
        >
          {real.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      {paused.length > 0 && (
        <div style={{ fontSize: "12px", color: C.textMuted, lineHeight: 1.5, marginBottom: "12px" }}>
          Paused: {paused.join(", ")}. Practice and Just Bowling stay open either way.
        </div>
      )}

      {/* Side by side, not stacked: this card sits on Home, and one row
          instead of two is what lets Home fit without scrolling. Pro is
          the filled button; keeping one league is the fallback. */}
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          style={{ ...S.btn(), flex: 1, opacity: status === "saving" ? 0.6 : 1 }}
          onClick={save}
          disabled={status === "saving"}
        >
          {status === "saving" ? "Saving…" : "Keep this league"}
        </button>
        {typeof onUpgrade === "function" && (
          <button style={{ ...S.btn("primary"), flex: 1, width: "auto" }} onClick={onUpgrade}>
            Get Pro
          </button>
        )}
      </div>

      {status === "saved" && (
        <div style={{ fontSize: "12px", color: C.accent, lineHeight: 1.5, marginTop: "10px" }}>
          Saved. {choice} is your active league.
        </div>
      )}

      {status === "error" && message && (
        <div style={{ fontSize: "12px", color: C.miss, lineHeight: 1.5, marginTop: "10px" }}>
          {message}
        </div>
      )}
    </div>
  );
}
