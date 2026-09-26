// Money on screen, in the bowler's own currency.
//
// Side games, brackets and tournament entries are amounts the bowler
// types, in whatever the house takes. A league in Seoul runs a ₩1,000
// game, not a dollar game, and printing "$1,000.00" beside it reads as a
// thousand US dollars. So every money figure the app shows goes through
// formatMoney, which writes the local symbol and the local number of
// decimals.
//
// PURE. No DOM, no storage. The only thing read from the device is its
// time zone (Intl), and every function takes the currency as an argument
// so tests never depend on where they run.
//
// Decided from the device's TIME ZONE, the same signal the subscription
// prices use (billing.js) and for the same reason: an English phone in
// Tokyo is in Japan, a Japanese phone in Toronto is not. The zone lists
// are billing.js's own -- checkoutCurrencyFor reads LOCAL_PRICING -- so
// "which country is this phone in" has one answer in the app, not two
// lists that drift.
//
// Stored amounts are NOT converted. A number the bowler typed is in the
// currency they typed it in; only how it is displayed changes. A bowler
// who moves from Toronto to Tokyo sees the same numbers with a different
// symbol, which is wrong for them and right for nobody else -- there is
// no exchange rate that would make old entries correct, so none is
// attempted.

import { checkoutCurrencyFor } from "./billing.js";

// Every dollar country keeps "$" and two decimals: the US, Canada,
// Singapore, Mexico, Hong Kong, Puerto Rico, Bermuda, Australia, New
// Zealand, and anywhere unknown. Their
// output is byte-for-byte what the app printed before this module
// existed ("$12.00", "−$5.00", "+$45"), which is what keeps every English
// screen, catalog pattern and test for dollar users unchanged.
//
// factor: how a dollar-denominated threshold (the $100 "Money bags"
// badge) scales. stakes: the small and large poker games a house in that
// country actually runs -- not a conversion of 25c and $1, which would
// give a ¥25 game nobody plays.
//
// sep: what goes between the symbol and the digits. The dirham and the
// dinar have one: "AED 50" and "KD 1.500", never "AED50". The symbol itself stays
// bare ("AED") because it also travels on its own -- the Nightcap
// request, the first-cash medallion.
//
// Whole-number currencies (decimals 0): yen and won have no smaller
// unit; rupees and colones do on paper, but a side pot is never ₹12.50.
// The Kuwaiti dinar is the one with three: 1,000 fils to the dinar, and a
// bracket really is KD 0.500.
export const CURRENCIES = Object.freeze({
  dollar: Object.freeze({ id: "dollar", symbol: "$", decimals: 2, factor: 1, stakes: Object.freeze([0.25, 1]) }),
  jpy: Object.freeze({ id: "jpy", symbol: "¥", decimals: 0, factor: 100, stakes: Object.freeze([100, 500]) }),
  krw: Object.freeze({ id: "krw", symbol: "₩", decimals: 0, factor: 1000, stakes: Object.freeze([500, 1000]) }),
  myr: Object.freeze({ id: "myr", symbol: "RM", decimals: 2, factor: 5, stakes: Object.freeze([1, 5]) }),
  php: Object.freeze({ id: "php", symbol: "₱", decimals: 2, factor: 50, stakes: Object.freeze([20, 50]) }),
  inr: Object.freeze({ id: "inr", symbol: "₹", decimals: 0, factor: 50, stakes: Object.freeze([20, 50]) }),
  aed: Object.freeze({ id: "aed", symbol: "AED", sep: " ", decimals: 2, factor: 5, stakes: Object.freeze([1, 5]) }),
  crc: Object.freeze({ id: "crc", symbol: "₡", decimals: 0, factor: 500, stakes: Object.freeze([100, 500]) }),
  kwd: Object.freeze({ id: "kwd", symbol: "KD", sep: " ", decimals: 3, factor: 0.3, stakes: Object.freeze([0.1, 0.5]) }),
});

// The seven with their own money here (plus Kuwait, below). Singapore,
// Mexico and Hong Kong have local subscription PRICES (S$, MX$, HK$) but
// are dollar countries here: a bare "$" is what a bowler there writes on a
// bracket sheet.
const BY_CHECKOUT = { jpy: "jpy", krw: "krw", myr: "myr", php: "php", inr: "inr", aed: "aed", crc: "crc" };

// Kuwait: the one country whose money the app shows but whose
// subscription is not priced here -- Stripe cannot charge dinars, so
// billing.js leaves it on US prices. A bracket there is still KD 0.500.
const KWD_ZONES = new Set(["Asia/Kuwait"]);

export function currencyForZone(tz) {
  if (typeof tz === "string" && KWD_ZONES.has(tz)) return CURRENCIES.kwd;
  const code = typeof tz === "string" && tz ? checkoutCurrencyFor(tz) : "";
  return CURRENCIES[BY_CHECKOUT[code]] || CURRENCIES.dollar;
}

// The device's zone, read once. Money is formatted hundreds of times a
// render and the zone does not change under a running app; a reload
// picks up a new one. try/catch because an old WebView without Intl
// time zones must still show money, in dollars.
let zoneCache = null;
export function localTimeZone() {
  if (zoneCache === null) {
    try { zoneCache = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch { zoneCache = ""; }
  }
  return zoneCache;
}
// Tests only: forget the cached zone so a stubbed Intl is read again.
export function resetLocalTimeZone() { zoneCache = null; }

export function localCurrency() {
  return currencyForZone(localTimeZone());
}

// Accepts a currency object, an id ("krw"), or nothing (the device's).
function resolve(currency) {
  if (currency && typeof currency === "object" && currency.symbol) return currency;
  if (typeof currency === "string" && CURRENCIES[currency]) return CURRENCIES[currency];
  return localCurrency();
}

export function isDollar(currency) {
  return resolve(currency).id === "dollar";
}

export function moneySymbol(currency) {
  return resolve(currency).symbol;
}

function grouped(intDigits) {
  return intDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// "$12.00", "₩5,000", "RM12.00", "¥1,500", "AED 12.00", "₹500".
//
// opts:
//   currency  -- as resolve() takes; the device's when absent.
//   decimals  -- a site that shows whole amounts ("+$45 on the season")
//                passes 0. Never MORE than the currency has: a yen amount
//                has no sen to show.
//   raw       -- the number exactly as it came ("$12.5"). A few sites
//                always printed the bare value; for dollars they still do.
//                Other currencies get their own decimals instead.
//   signed    -- "+" in front of a positive or zero amount.
//   minus     -- the minus sign for a negative amount: "−" (U+2212, the
//                default, what the money cards use) or "-".
//
// Dollars are written exactly as toFixed wrote them -- no thousands
// separator -- because that is what every dollar screen showed before,
// and the French layer (frenchNumbers) re-groups a "$1,234.50" or a
// "$1234.50" the same way. The other currencies get "," between
// thousands, which the Japanese and Korean layers keep as is.
export function formatMoney(amount, opts = {}) {
  const o = (opts && typeof opts === "object") ? opts : {};
  const c = resolve(o.currency);
  const n = Number(amount);
  const v = Number.isFinite(n) ? n : 0;
  const minus = o.minus === "-" ? "-" : "−";

  if (c.id === "dollar" && o.raw) {
    const neg = v < 0;
    return `${neg ? minus : (o.signed ? "+" : "")}$${Math.abs(v)}`;
  }

  const want = Number.isInteger(o.decimals) && o.decimals >= 0 ? o.decimals : c.decimals;
  const decimals = Math.min(want, c.decimals);
  const fixed = Math.abs(v).toFixed(decimals);
  // A value that rounds to zero is zero: no "−¥0" for a -0.4 yen net.
  const neg = v < 0 && Number(fixed) !== 0;
  const [int, frac] = fixed.split(".");
  const digits = c.id === "dollar" ? int : grouped(int);
  const body = `${c.symbol}${c.sep || ""}${digits}${frac !== undefined ? "." + frac : ""}`;
  return `${neg ? minus : (o.signed ? "+" : "")}${body}`;
}

// A dollar amount the app itself chose (a threshold, a sample figure on a
// walkthrough screen), in the local currency's terms. Never used on an
// amount the bowler typed -- those are already in their money.
export function scaleMoney(dollars, currency) {
  const c = resolve(currency);
  // Rounded to the currency's own decimals: 100 x 0.3 is
  // 30.000000000000004 in floating point, and a threshold a hair above
  // KD 30 would refuse a bowler who won exactly KD 30.
  return Number(((Number(dollars) || 0) * c.factor).toFixed(c.decimals));
}

// An <input type="number"> step. "0.25" makes sense for a quarter game;
// in yen or won there are no fractions to step through, and in dinars a
// step of 0.25 would mark a KD 0.100 game as invalid.
export function moneyStep(dollarStep, currency) {
  const d = resolve(currency).decimals;
  if (d === 0) return "1";
  if (d === 3) return "0.001";
  return String(dollarStep);
}

// ── The two poker games ────────────────────────────────────────────────
//
// Stored as pokerQuarter / pokerDollar. Those are DATA KEYS -- columns,
// cost arrays, saved buy-in rates -- and stay what they are everywhere.
// Only what the bowler reads changes: "Quarter game" and "Dollar game"
// are dollar names, so elsewhere the game is named by its stake,
// "¥100 game", built from the amount so the label and the default rate
// can never disagree.
export function pokerStakes(currency) {
  const [small, large] = resolve(currency).stakes;
  return { pokerQuarter: small, pokerDollar: large };
}

// Every label the non-dollar currencies can produce, for the catalog
// check in currency.test.js: each one must translate in all four
// languages.
export function pokerGameLabels(currency) {
  const c = resolve(currency);
  if (c.id === "dollar") return { pokerQuarter: "Quarter game", pokerDollar: "Dollar game" };
  const s = pokerStakes(c);
  // Whole stakes are named whole ("¥100 game", "AED 1 game"); a stake
  // below one unit keeps its decimals, or the dinar's KD 0.100 game
  // would be called "KD 0 game".
  const label = v => `${formatMoney(v, { currency: c, decimals: Number.isInteger(v) ? 0 : undefined })} game`;
  return { pokerQuarter: label(s.pokerQuarter), pokerDollar: label(s.pokerDollar) };
}

// ── Money thresholds ───────────────────────────────────────────────────
//
// "Money bags" is $100 won in side games. ¥100 or ₩100 is pocket change,
// so the threshold scales with the currency's factor (¥10,000, ₩100,000,
// RM500, ₱5,000, ₹5,000, AED 500, ₡50,000, KD 30.000) and the badge's
// own text shows the scaled figure.
export const MONEY_BAGS_DOLLARS = 100;
export function moneyBagsThreshold(currency) {
  return scaleMoney(MONEY_BAGS_DOLLARS, currency);
}

// Nights before this date were judged against the old, unscaled $100 --
// in every currency, because the app knew only dollars. Badges are worked
// out from history on every render, not stored, so without this a
// Korean bowler who had ₩50,000 of winnings would watch a badge they had
// already been shown disappear the day the threshold became ₩100,000.
// Winnings from these nights still count toward the scaled threshold
// too; this only keeps what was already earned.
export const MONEY_SCALED_FROM = "2026-10-01";
