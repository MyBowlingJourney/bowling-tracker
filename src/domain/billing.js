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
// Play charges Canadians 6.99 / 69.99 CAD. The Stripe prices carry the
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

// ── Local prices: Japan, Singapore, Malaysia, the Philippines, Mexico,
//    South Korea, Hong Kong, India, the UAE, Costa Rica, Kuwait, Brunei ─
//
// The same arrangement as Canada: Play charges these prices, both Stripe
// prices carry the same amounts as a currency option, and create-checkout
// asks for that currency when the device is on that country's time. In
// these twelve the price shown is the price paid, tax included, on Play and
// on the web alike.
//
// Puerto Rico and Bermuda are not here on purpose: they pay in US dollars
// (Bermuda's dollar is at par and Play charges USD there), so their zones
// get the US prices like any other.
//
// Kuwait's dinar has three decimals: KD 1.500 is one and a half dinars.
// Brunei's dollar is at par with Singapore's, so it takes the Singapore
// price.
//
// Asia/Dubai is the UAE's only zone. Oman's phones report Asia/Muscat,
// so they are not caught by it.
const LOCAL_PRICING = [
  { zones: ["Asia/Tokyo", "Japan"], currency: "jpy",
    prices: Object.freeze({ month: "¥800", year: "¥8,000" }) },
  { zones: ["Asia/Singapore", "Singapore"], currency: "sgd",
    prices: Object.freeze({ month: "S$6.98", year: "S$69.98" }) },
  { zones: ["Asia/Kuala_Lumpur", "Asia/Kuching"], currency: "myr",
    prices: Object.freeze({ month: "RM21.90", year: "RM219.90" }) },
  { zones: ["Asia/Manila"], currency: "php",
    prices: Object.freeze({ month: "₱349", year: "₱3,490" }) },
  { zones: ["America/Mexico_City", "America/Cancun", "America/Merida", "America/Monterrey", "America/Matamoros", "America/Chihuahua", "America/Ciudad_Juarez", "America/Ojinaga", "America/Mazatlan", "America/Bahia_Banderas", "America/Hermosillo", "America/Tijuana", "Mexico/General", "Mexico/BajaNorte", "Mexico/BajaSur"], currency: "mxn",
    prices: Object.freeze({ month: "MX$99", year: "MX$999" }) },
  { zones: ["Asia/Seoul", "ROK"], currency: "krw",
    prices: Object.freeze({ month: "₩7,900", year: "₩79,000" }) },
  { zones: ["Asia/Hong_Kong", "Hongkong"], currency: "hkd",
    prices: Object.freeze({ month: "HK$38", year: "HK$388" }) },
  { zones: ["Asia/Kolkata", "Asia/Calcutta"], currency: "inr",
    prices: Object.freeze({ month: "₹449", year: "₹4,490" }) },
  { zones: ["Asia/Dubai"], currency: "aed",
    prices: Object.freeze({ month: "AED 18.99", year: "AED 189.99" }) },
  { zones: ["America/Costa_Rica"], currency: "crc",
    prices: Object.freeze({ month: "₡2,700", year: "₡27,000" }) },
  { zones: ["Asia/Kuwait"], currency: "kwd",
    prices: Object.freeze({ month: "KD 1.500", year: "KD 15.000" }) },
  { zones: ["Asia/Brunei"], currency: "bnd",
    prices: Object.freeze({ month: "B$6.98", year: "B$69.98" }) },
];
const localPricingFor = tz => LOCAL_PRICING.find(r => r.zones.includes(tz)) || null;

export function isJapanTimeZone(tz) {
  return localPricingFor(tz)?.currency === "jpy";
}

// What the screen says. "$" for both dollars: Play shows Canadians
// "$6.99" too, and the French layer writes it as "6,99 $".
export const PRICES_USD = Object.freeze({ month: "$4.99", year: "$49.99" });
export const PRICES_CAD = Object.freeze({ month: "$6.99", year: "$69.99" });
export const PRICES_JPY = LOCAL_PRICING[0].prices;

export function displayPricesFor(tz) {
  if (isCanadianTimeZone(tz)) return PRICES_CAD;
  return localPricingFor(tz)?.prices || PRICES_USD;
}

// The currency create-checkout is asked for: "cad" in Canada, the local
// currency in the twelve countries above, nothing anywhere else (Stripe
// then picks, as it always has).
export function checkoutCurrencyFor(tz) {
  if (isCanadianTimeZone(tz)) return "cad";
  return localPricingFor(tz)?.currency || "";
}

// The yearly price the trial banner quotes. On Play it is Google's own
// price in the bowler's currency (AUD in Australia, NZD in New Zealand)
// or nothing at all -- never the US figure, which would be the wrong
// currency for everyone outside the US. The banner leaves the price out
// when this is empty. On the web it is the price checkout will charge.
export function annualPriceToShow({ rail, offers, displayPrices } = {}) {
  if (rail === "play") return offers?.prices?.year ? String(offers.prices.year) : "";
  return displayPrices?.year || "";
}
