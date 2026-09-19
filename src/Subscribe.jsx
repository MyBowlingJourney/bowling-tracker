import { useState, useEffect } from "react";
import { C, S } from "./ui.jsx";
import { startPurchase, currentRail, DISPLAY_PRICES } from "./purchase.js";
import { TRIAL_DAYS, FREE_LEAGUE_LIMIT } from "./domain/entitlements.js";

// The one screen where a bowler decides to pay.
//
// ── What it promises, it has to keep ────────────────────────────────
//
// Everything below the button -- that it renews on its own, what it
// costs, how to stop it -- is not legal boilerplate bolted on at the
// end. Google Play and Stripe both require the terms to be clear before
// purchase, and independently of either, a bowler who is surprised by a
// charge asks for their money back and leaves a one-star review on the
// way out. The disclosure IS the product working.
//
// So: no countdown timers, no "only today", no pre-ticked upsell. If the
// app is worth $X a month it will still be worth it tomorrow.
export default function Subscribe({ entitlement, onClose }) {
  const [period, setPeriod] = useState("year");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [rail, setRail] = useState("");

  // Which store this bowler will actually be sent to. Only used for the
  // wording below -- "Google Play" versus "our payment provider" -- so a
  // slow answer costs nothing.
  useEffect(() => {
    let live = true;
    currentRail().then(r => { if (live) setRail(r); }).catch(() => {});
    return () => { live = false; };
  }, []);

  // Somebody who has already paid must never see a buy button. Reaching
  // this screen while subscribed means a stale link or a back button,
  // not a decision to pay twice.
  const alreadyPaid = entitlement?.plan === "plus"
    && ["active", "trialing", "grace"].includes(String(entitlement?.status));

  async function buy() {
    setBusy(true);
    setError("");
    const result = await startPurchase(period);
    // On Stripe the page is navigating away, so the busy state is left
    // on deliberately -- clearing it would flash an enabled button at
    // somebody who is already leaving.
    if (!result.ok) {
      setError(result.message || "Something went wrong.");
      setBusy(false);
    }
  }

  if (alreadyPaid) {
    return (
      <div style={S.card}>
        <div style={{ ...S.label, color: C.accent }}>You are subscribed</div>
        <div style={{ fontSize: "13px", color: C.textMuted, lineHeight: 1.5 }}>
          Everything is unlocked. Manage or cancel your subscription wherever you
          set it up{rail === "play" ? " — the Play Store app, under Subscriptions" : ""}.
        </div>
        {typeof onClose === "function" && (
          <button style={{ ...S.btn(), marginTop: "12px" }} onClick={onClose}>Back</button>
        )}
      </div>
    );
  }

  const yearly = period === "year";

  return (
    <div>
      <div style={S.card}>
        <div style={{ ...S.label, color: C.accent }}>My Bowling Journey Plus</div>
        <div style={{ fontSize: "13px", color: C.text, lineHeight: 1.55, marginBottom: "14px" }}>
          Your scores, spares and ball numbers stay free, always. Plus is for the
          comparisons — and for the parts that think about your night for you.
        </div>

        <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px", color: C.textMuted, lineHeight: 1.7 }}>
          <li>Every league and team you bowl in{" "}
            <span style={{ color: C.textMuted, opacity: 0.8 }}>
              (free keeps {FREE_LEAGUE_LIMIT})
            </span>
          </li>
          <li>Ball against ball, house against house, pattern against pattern</li>
          <li>Head to head with friends and teammates</li>
          <li>This season against last</li>
          <li>Nightcap, Insights, Brooklyn and coaching</li>
          <li>Scorecard import</li>
        </ul>
      </div>

      <div style={S.card}>
        <div style={{ ...S.label }}>Choose a plan</div>

        <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
          <button
            style={{ ...S.chip(yearly), flex: 1, padding: "14px 10px", textAlign: "center" }}
            onClick={() => { setPeriod("year"); setError(""); }}
          >
            Yearly · {DISPLAY_PRICES.year}
          </button>
          <button
            style={{ ...S.chip(!yearly), flex: 1, padding: "14px 10px", textAlign: "center" }}
            onClick={() => { setPeriod("month"); setError(""); }}
          >
            Monthly · {DISPLAY_PRICES.month}
          </button>
        </div>

        <button
          style={{ ...S.btn("primary"), opacity: busy ? 0.6 : 1 }}
          onClick={buy}
          disabled={busy}
        >
          {busy ? "Opening…" : `Start your ${TRIAL_DAYS}-day free trial`}
        </button>

        {error && (
          <div style={{ fontSize: "12px", color: C.miss, lineHeight: 1.5, marginTop: "10px" }}>
            {error}
          </div>
        )}

        {/* Stated before the purchase, not after it. A bowler who reads
            only this paragraph should still be able to predict exactly
            what will be taken from their card and when. */}
        <div style={{ fontSize: "11.5px", color: C.textMuted, lineHeight: 1.6, marginTop: "14px" }}>
          Your {TRIAL_DAYS}-day free trial runs from the day you created your
          account. When it ends, the {yearly ? "yearly" : "monthly"} plan starts at{" "}
          {yearly ? DISPLAY_PRICES.year : DISPLAY_PRICES.month} and renews on its own
          until you cancel. Cancel any time
          {rail === "play"
            ? " in the Play Store app under Subscriptions"
            : " from the link in your receipt"}
          {" "}— you keep Plus until the end of the period you have paid for.
        </div>

        {/* Nothing is deleted when a subscription ends. Said here, where
            somebody deciding whether to start is also deciding what
            happens if they stop. */}
        <div style={{ fontSize: "11.5px", color: C.textMuted, lineHeight: 1.6, marginTop: "8px" }}>
          If you stop, nothing you have logged is deleted. One league stays active
          and the rest are paused until you come back.
        </div>
      </div>

      {typeof onClose === "function" && (
        <button style={S.btn()} onClick={onClose}>Not now</button>
      )}
    </div>
  );
}
