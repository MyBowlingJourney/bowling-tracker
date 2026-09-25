import { useEffect, useState } from "react";
import { C, S } from "./ui.jsx";
import { annualDisplayPrice } from "./purchase.js";
import { isTrialing, trialDaysLeft, shouldOfferAnnual } from "./domain/entitlements.js";

// The one strip that tells a bowler where their subscription stands.
//
// Two states, and they never appear together because the conditions are
// mutually exclusive: shouldOfferAnnual() returns false while the status
// is "trialing".
//
//   trial    a countdown, and the date the card is charged
//   annual   a quiet nudge to the yearly plan, after two months monthly
//
// ── Why the charge date is always on screen ─────────────────────────
//
// The trial takes a card up front and converts on its own. That is the
// arrangement the bowler agreed to, and it only stays fair if the date
// is somewhere they can see without going looking for it. Google Play's
// subscription policy requires the terms be clear and prominent, and
// independently of the policy, a charge nobody saw coming is a refund
// and a one-star review from somebody who WAS going to keep paying.
//
// So this does not hide itself after a few days, and there is no
// dismiss button. It gets quieter when the end is far off and louder in
// the last three days, which is the honest shape of the information.
//
// ── Prices are not in this file ─────────────────────────────────────
//
// They are passed in, and omitted from the copy when absent. Play and
// Stripe both return the price in the bowler's own currency, already
// localised and already correct after a price change; a figure hardcoded
// here would be wrong for everyone outside the US the day it shipped,
// and wrong for everyone the day a price moves.
export default function TrialBanner({
  entitlement,
  now = Date.now(),
  // Leave it out and the banner asks the store itself (Play's price on
  // Play, checkout's on the web), and only when it is about to show it.
  annualPrice,
  onManage,
  onSwitchAnnual,
}) {
  const offerAnnual = shouldOfferAnnual(entitlement, now);
  const [storePrice, setStorePrice] = useState("");
  useEffect(() => {
    if (annualPrice !== undefined || !offerAnnual) return undefined;
    let live = true;
    annualDisplayPrice().then(p => { if (live) setStorePrice(p || ""); });
    return () => { live = false; };
  }, [annualPrice, offerAnnual]);
  const yearlyPrice = annualPrice !== undefined ? annualPrice : storePrice;

  const trialing = isTrialing(entitlement, now);
  const days = trialing ? trialDaysLeft(entitlement, now) : 0;

  // days === 0 covers both "ended" and "trial_end is unreadable". Both
  // mean this strip has nothing true to say, so it says nothing.
  if (trialing && days > 0) {
    const urgent = days <= 3;
    const ends = formatDate(entitlement?.trial_end);
    return (
      <div style={{
        ...S.card,
        marginBottom: "12px",
        padding: "12px 14px",
        border: `1px solid ${urgent ? C.accent : C.border}`,
        backgroundColor: urgent ? C.accent + "14" : C.card,
      }}>
        <div style={{
          fontSize: "13px", fontWeight: urgent ? 600 : 500,
          color: urgent ? C.accent : C.text, lineHeight: 1.45,
        }}>
          Free trial — {days} {days === 1 ? "day" : "days"} left
        </div>
        <div style={{ fontSize: "12px", color: C.textMuted, lineHeight: 1.5, marginTop: "3px" }}>
          {ends
            ? `Your subscription starts ${ends}.`
            : "Your subscription starts when the trial ends."}
        </div>
        {typeof onManage === "function" && (
          <button
            style={{ ...S.btn(), padding: "8px 14px", fontSize: "13px", marginTop: "10px" }}
            onClick={onManage}
          >
            Manage subscription
          </button>
        )}
      </div>
    );
  }

  // Inert until the billing_period column exists -- shouldOfferAnnual
  // requires billing_period === "month" and answers false when the field
  // is absent, which is the safe direction: an annual subscriber must
  // never be asked to switch to annual.
  if (offerAnnual) {
    return (
      <div style={{ ...S.card, marginBottom: "12px", padding: "12px 14px" }}>
        <div style={{ fontSize: "13px", fontWeight: 500, color: C.text, lineHeight: 1.45 }}>
          Thanks for bowling with us
        </div>
        <div style={{ fontSize: "12px", color: C.textMuted, lineHeight: 1.5, marginTop: "3px" }}>
          {yearlyPrice
            ? `You are on the monthly plan. The yearly plan is ${yearlyPrice} and works out cheaper — switch any time.`
            : "You are on the monthly plan. The yearly plan works out cheaper — switch any time."}
        </div>
        {typeof onSwitchAnnual === "function" && (
          <button
            style={{ ...S.btn(), padding: "8px 14px", fontSize: "13px", marginTop: "10px" }}
            onClick={onSwitchAnnual}
          >
            See the yearly plan
          </button>
        )}
      </div>
    );
  }

  return null;
}

// The bowler's own locale and time zone, not the server's. A trial that
// ends at 00:30 UTC ends on the previous evening in Pennsylvania, and
// printing the UTC date would name a day they never see.
function formatDate(value) {
  if (!value) return "";
  const t = Date.parse(value);
  if (!Number.isFinite(t)) return "";
  try {
    return new Date(t).toLocaleDateString(undefined, { month: "long", day: "numeric" });
  } catch {
    return "";
  }
}
