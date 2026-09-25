// What the BROWSER needs to know about billing, which is very little.
//
// PURE. No Capacitor, no network, no supabase.
//
// The Play state machine is deliberately not here. Mapping a Google
// subscription to an entitlement row is server work -- the client never
// does it, and a client that could would be a client asserting what it
// had bought. That lives in supabase/functions/_shared/play.ts and is
// tested from src/domain/playBilling.test.js, the same arrangement
// nightcap/render.ts already uses.
//
// What is left is the one decision the browser genuinely owns: which
// payment rail to offer the person looking at the screen.

// Play inside the Android app, Stripe on the web.
//
// Not a preference. An app distributed through Play must use Play
// billing for digital goods, and Stripe cannot be offered inside it.
// Equally, an iPhone bowler cannot install the Android app at all, so
// without the web rail they have no way to pay -- which is not a lost
// 40c fee, it is a lost subscription.
//
// isNative is passed in rather than read from Capacitor here, so this
// stays pure and so the web rail can be tested without pretending to be
// a phone. The caller reads Capacitor.isNativePlatform(), which is the
// exact signal and is not user-agent sniffing: iPadOS reports itself as
// a Mac, and getting that wrong offers Play billing to a browser that
// has no Play Store in it.
// === true, not merely truthy. isNativePlatform() returns a real
// boolean, but a caller who passes something looser must not be routed
// to a store that may not exist: the STRING "false" is truthy, and so is
// "no". Truthiness here fails towards Play, which is the rail that
// cannot fall back to anything.
export function paymentRail({ isNative = false } = {}) {
  return isNative === true ? "play" : "stripe";
}

// ── Canada: the same price on the web as in the app ─────────────────
//
// Play charges Canadians 9.99 / 69.99 CAD. The Stripe prices carry the
// same amounts as a CAD currency option, and create-checkout asks Stripe
// for CAD when the app says the bowler is in Canada -- so the number on
// the screen and the number on the card are the same number.
//
// Decided from the device's time zone, not its language: an English
// phone in Toronto is in Canada, a French phone in Paris is not. The
// list is every Canadian zone in the tz database, plus the older names
// some devices still report.
const CANADA_ZONES = new Set([
  "America/Atikokan", "America/Blanc-Sablon", "America/Cambridge_Bay",
  "America/Coral_Harbour", "America/Creston", "America/Dawson",
  "America/Dawson_Creek", "America/Edmonton", "America/Fort_Nelson",
  "America/Glace_Bay", "America/Goose_Bay", "America/Halifax",
  "America/Inuvik", "America/Iqaluit", "America/Moncton",
  "America/Montreal", "America/Nipigon", "America/Pangnirtung",
  "America/Rainy_River", "America/Rankin_Inlet", "America/Regina",
  "America/Resolute", "America/St_Johns", "America/Swift_Current",
  "America/Thunder_Bay", "America/Toronto", "America/Vancouver",
  "America/Whitehorse", "America/Winnipeg", "America/Yellowknife",
]);

export function isCanadianTimeZone(tz) {
  if (typeof tz !== "string" || !tz) return false;
  return CANADA_ZONES.has(tz) || tz.startsWith("Canada/");
}

// What the screen says. "$" in both: Play shows Canadians "$9.99" too,
// and the French layer writes it as "9,99 $".
export const PRICES_USD = Object.freeze({ month: "$6.99", year: "$49.99" });
export const PRICES_CAD = Object.freeze({ month: "$9.99", year: "$69.99" });

export function displayPricesFor(tz) {
  return isCanadianTimeZone(tz) ? PRICES_CAD : PRICES_USD;
}

// The currency create-checkout is asked for: "cad" in Canada, nothing
// anywhere else (Stripe then picks, as it always has).
export function checkoutCurrencyFor(tz) {
  return isCanadianTimeZone(tz) ? "cad" : "";
}
