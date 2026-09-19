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
// ── Why the write is so narrow ──────────────────────────────────────
//
// This component writes exactly one column, kept_league_id, and that is
// enforced by the database rather than by this file behaving well: the
// `authenticated` role holds a COLUMN grant on kept_league_id alone, so
// plan and status are refused by Postgres at the privilege layer before
// RLS is even consulted. The anon key ships in every copy of the app --
// anyone can open the console and try. Let them; the answer is no.
//
// A bowler with no entitlement row has never subscribed and so has never
// lapsed. There is no INSERT grant and none is wanted: the row is created
// by the billing webhooks under service_role. If the update touches no
// rows, that is what happened, and saying so plainly beats a spinner that
// never resolves.
export default function KeptLeaguePicker({
  leagues = [],
  keptLeagueName = "",
  defaultLeagueName = "",
  leagueIds = {},
  userId = "",
  onSaved,
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

  const paused = real.filter(n => n !== choice);
  const unchanged = choice === keptLeagueName;

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
      const { data, error } = await supabase
        .from("entitlements")
        .update({ kept_league_id: id })
        .eq("user_id", userId)
        .select("kept_league_id");
      if (error) {
        setStatus("error");
        setMessage("Could not save that just now. Your leagues are untouched — try again in a minute.");
        console.error("kept league save failed:", error.message);
        return;
      }
      // No error and no rows means the update matched nothing, which for
      // this table means there is no entitlement row to write to.
      if (!Array.isArray(data) || data.length === 0) {
        setStatus("error");
        setMessage("There is no subscription on this account yet, so there is nothing to pause.");
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
        A free account follows one league at a time. Pick the one you want to keep
        bowling with — the rest are paused, not deleted, and everything you have
        logged comes back the moment you subscribe.
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

      <button
        style={{ ...S.btn("primary"), opacity: status === "saving" || unchanged ? 0.6 : 1 }}
        onClick={save}
        disabled={status === "saving" || unchanged}
      >
        {status === "saving" ? "Saving…" : unchanged ? "This is your active league" : `Keep ${choice}`}
      </button>

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
