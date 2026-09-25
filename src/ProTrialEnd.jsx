import { useEffect, useMemo, useState } from "react";
import { C, S } from "./ui.jsx";
import { proLosses, trialHeadline, BASIC_KEEPS } from "./domain/proTrial.js";
import { DISPLAY_PRICES, playOffers } from "./purchase.js";
import { supabase } from "./supabaseClient.js";

// The ask at the end of the 60-day Pro trial.
//
// Built from the bowler's own sixty days: the headline is their
// strongest reason to stay, and the list is only the Pro things they
// actually used, each with their own numbers. Basic is offered as a real
// choice, with what it keeps said just as plainly -- dropping down never
// deletes anything.

// AI feature use, from the server's token log (my_pro_usage), so the
// counts are right on any device. Empty when it can't be read -- the
// list then leaves those lines out rather than guessing.
async function readUsage() {
  try {
    const { data, error } = await supabase.rpc("my_pro_usage");
    if (error || !Array.isArray(data)) return {};
    const by = Object.fromEntries(data.map(r => [r.endpoint, Number(r.calls) || 0]));
    return {
      nightcap: by["nightcap"] || 0,
      genie: by["bowling-genie"] || 0,
      insights: by["analyze-performance"] || 0,
      caddie: by["caddie"] || 0,
      import: by["import-scorecard"] || 0,
    };
  } catch {
    return {};
  }
}

export default function ProTrialEnd({ ctx, topBall, games, daysLeft = 0, onKeep, onBasic, onLater }) {
  const [usage, setUsage] = useState(null);
  const [prices, setPrices] = useState(DISPLAY_PRICES);
  useEffect(() => {
    let live = true;
    readUsage().then(u => { if (live) setUsage(u); });
    playOffers().then(o => {
      if (!live || !o?.prices) return;
      setPrices(p => ({ month: o.prices.month || p.month, year: o.prices.year || p.year }));
    }).catch(() => {});
    return () => { live = false; };
  }, []);

  const full = useMemo(() => ({ ...ctx, usage: usage || {} }), [ctx, usage]);
  const losses = useMemo(() => proLosses(full), [full]);
  const head = trialHeadline({ topBall, usage: usage || {}, leagues: ctx?.leagues, games }, prices.month);
  const ending = daysLeft > 0;

  return (
    <div style={{ ...S.card, border: `1px solid ${C.accent}88`, backgroundColor: C.accent + "0D" }}>
      <div style={{ ...S.label, color: C.accent }}>
        {ending ? `Your Pro trial ends in ${daysLeft} day${daysLeft === 1 ? "" : "s"}` : "Your Pro trial has ended"}
      </div>
      <div style={{ fontSize: "17px", fontWeight: 700, color: C.text, lineHeight: 1.3, marginBottom: "6px" }}>
        {head.title}
      </div>
      <div style={{ fontSize: "13.5px", color: C.text, lineHeight: 1.5, marginBottom: "12px" }}>
        {head.body}
      </div>

      {losses.length > 0 && (
        <div style={{ marginBottom: "12px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: C.text, marginBottom: "6px" }}>
            What you've been using that Basic doesn't include:
          </div>
          {losses.map(l => (
            <div key={l.id} style={{ fontSize: "12.5px", lineHeight: 1.5, marginBottom: "6px" }}>
              <span style={{ fontWeight: 600, color: C.text }}>{l.title}</span>
              <span style={{ color: C.textMuted }}> — {l.detail}</span>
            </div>
          ))}
        </div>
      )}

      <button style={{ ...S.btn("primary"), width: "100%" }} onClick={() => onKeep?.("month")}>
        Keep Pro · {prices.month}/month
      </button>
      <button style={{ ...S.btn(), width: "100%", marginTop: "8px" }} onClick={() => onKeep?.("year")}>
        Or {prices.year}/year
      </button>

      <div style={{ fontSize: "11.5px", color: C.textMuted, lineHeight: 1.55, margin: "12px 0 8px" }}>
        <div style={{ fontWeight: 600, color: C.text, marginBottom: "3px" }}>Basic is free, and keeps:</div>
        {BASIC_KEEPS.map(k => <div key={k}>• {k}</div>)}
      </div>

      {!ending && (
        <button style={{ ...S.btn(), width: "100%", fontSize: "13px" }} onClick={onBasic}>
          Continue with Basic
        </button>
      )}
      {ending && (
        <>
          <div style={{ fontSize: "11px", color: C.textMuted, lineHeight: 1.5, marginBottom: "8px" }}>
            No card is on file, so nothing is charged when the trial ends — you move to Basic unless you choose Pro.
          </div>
          {onLater && (
            <button style={{ ...S.btn(), width: "100%", fontSize: "13px" }} onClick={onLater}>Not now</button>
          )}
        </>
      )}
    </div>
  );
}
