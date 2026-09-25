// One entitlements row, two ways to pay (Google Play and Stripe).
//
// Each rail's handler used to write its own view of the world over the
// row, whatever the row said. So a bowler whose Play card failed, who then
// paid on the web, was later locked out by Play's "expired" notification
// for the old token -- and the reverse. The same shape hit a second Stripe
// subscription from an abandoned checkout tab: its cancellation took Pro
// away while the other subscription was still charging.
//
// The rule: while the row is entitled, only the subscription it records
// may change it -- or a different one that is actively renewing, which
// takes it over. Anything else (an old token expiring, a second checkout
// winding down) is skipped.

type Row = {
  plan?: string | null;
  status?: string | null;
  current_period_end?: string | null;
  source?: string | null;
  stripe_subscription_id?: string | null;
  play_purchase_token?: string | null;
};

export function entitled(row: Row | null | undefined, now = Date.now()): boolean {
  if (!row || row.plan !== "plus") return false;
  const ends = row.current_period_end ? Date.parse(row.current_period_end) : null;
  if (ends !== null && Number.isNaN(ends)) return false;
  switch (row.status) {
    case "trialing":
    case "active":
      return ends === null || ends > now;
    case "grace":
      return true;
    case "canceled":
      return ends !== null && ends > now;
    default:
      return false;
  }
}

// Which subscription a row (or an incoming write) is about.
function subscriptionOf(row: Row): string {
  if (row.source === "stripe") return `stripe:${row.stripe_subscription_id || ""}`;
  if (row.source === "play") return `play:${row.play_purchase_token || ""}`;
  return `${row.source || "?"}:`;
}

// Should `incoming` be written over `existing`?
export function shouldApply(existing: Row | null | undefined, incoming: Row, now = Date.now()): boolean {
  if (!existing) return true;
  if (!entitled(existing, now)) return true;          // nothing to protect
  if (subscriptionOf(existing) === subscriptionOf(incoming)) return true;
  // A DIFFERENT subscription may take the row over only if it is actually
  // renewing. One that is winding down (cancelled, paid to the period end)
  // would otherwise take the row now, and then remove Pro when it ends --
  // while the subscription that is still charging goes unrecorded.
  return ["active", "trialing", "grace"].includes(String(incoming.status));
}
