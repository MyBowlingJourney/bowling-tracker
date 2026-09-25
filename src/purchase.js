// Starting a purchase, on whichever rail this bowler is on.
//
// Play inside the Android app, Stripe everywhere else. Not a preference:
// an app distributed through Play must use Play billing for digital
// goods and cannot offer Stripe inside it -- and an iPhone bowler cannot
// install the Android app at all, so without the web rail they have no
// way to pay.
//
// The decision itself is in domain/billing.js and is pure. This file is
// the part that talks to things.

import { supabase } from "./supabaseClient.js";
import { isNative } from "./nativeAuth.js";
import { paymentRail, displayPricesFor, checkoutCurrencyFor, annualPriceToShow } from "./domain/billing.js";
import { isBowlerFacing } from "./domain/functionErrors.js";
import { recordError } from "./errorLogStore.js";
// The SAME constants verify-purchase and play-rtdn map with, imported
// from the one file rather than copied, so the id the app buys and the id
// the server recognises cannot drift apart.
import {
  PLAY_PRODUCT_ID, PLAY_BASE_PLAN_MONTHLY, PLAY_BASE_PLAN_YEARLY, PLAY_TRIAL_OFFER_ID,
} from "../supabase/functions/_shared/play.ts";

// ⚠️ DISPLAY ONLY, AND PLACEHOLDERS. ⚠️
//
// These are what the screen SAYS. What a bowler is actually charged is
// whatever the price object in Stripe or the base plan in Play says, and
// nothing here can change that.
//
// Which makes a mismatch worse than it looks: the screen would promise
// one number and the card would be charged another. That is a refund, a
// chargeback, and in some places a consumer-protection problem.
//
// THE REAL FIX, once there are real products: take the price from the
// store rather than from here. Play's billing plugin returns the price
// already localised, and Stripe can return one from a small endpoint.
// Then a price change in the dashboard reaches the screen on its own,
// and bowlers outside the US stop being quoted dollars.
//
// Canada is the exception: 9.99 / 69.99 CAD, the same as Play, and
// create-checkout charges CAD to match (see domain/billing.js).
function deviceTimeZone() {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch { return ""; }
}
export const DISPLAY_PRICES = displayPricesFor(deviceTimeZone());

// Which rail, resolved for real. isNative() does the Capacitor dance
// already and returns false on the web and when the plugin is absent.
export async function currentRail() {
  return paymentRail({ isNative: await isNative() });
}

// ── Stripe ──────────────────────────────────────────────────────────
//
// create-checkout returns a URL and we navigate to it. A full navigation
// rather than a popup: popups are blocked on mobile browsers often
// enough that a checkout which silently does nothing is a real outcome,
// and Stripe sends the bowler back to APP_URL afterwards either way.
// READ THE BODY on a non-2xx.
//
// supabase-js collapses every non-2xx into one opaque error and hangs
// the real response off error.context -- data is null, not the parsed
// body. Reading `data.alreadySubscribed` after an error therefore always
// saw undefined, which made the "you already have a subscription" branch
// below unreachable and turned every distinct server answer -- 409
// already subscribed, 503 plan not available, 503 not configured, 429
// too many attempts -- into the same "try again in a moment", a message
// that is wrong for all four and tells a bowler to retry something that
// will never start working.
//
// Same pattern, and the same reasoning, as askGenie, analyzePerformance,
// Nightcap and deleteAccount.
async function invokeFailure(error) {
  let body = null;
  try {
    const res = error?.context;
    if (res && typeof res.json === "function") body = await res.json();
  } catch { /* not JSON; the status is all there is */ }
  return {
    // Only a message written for bowlers passes; "not configured" and the
    // like leave this empty so the caller's own friendly text is shown.
    message: isBowlerFacing(body?.error) ? body.error : "",
    alreadySubscribed: body?.alreadySubscribed === true,
  };
}

async function startStripe(period) {
  const { data, error } = await supabase.functions.invoke("create-checkout", {
    // "cad" when the screen showed Canadian prices, so Checkout charges
    // the same number the screen showed.
    body: { period, currency: checkoutCurrencyFor(deviceTimeZone()) || undefined },
  });
  if (error) {
    // 409 means they already have a subscription. Worth saying plainly
    // rather than as a failure, because it is good news.
    const { message, alreadySubscribed } = await invokeFailure(error);
    return {
      ok: false,
      reason: alreadySubscribed ? "already-subscribed" : "checkout-failed",
      // The function's own message where there is one -- it knows
      // whether the plan is unavailable, the key is missing or they are
      // simply going too fast.
      message: message || "Could not start checkout. Please try again in a moment.",
    };
  }
  if (!data?.url) {
    return { ok: false, reason: "checkout-failed", message: "Could not start checkout." };
  }
  window.location.href = data.url;
  // Navigation has been asked for but has not happened yet, so the
  // caller should keep showing its busy state rather than settling.
  return { ok: true, navigating: true };
}

// Opens Stripe's Customer Portal so a subscribed bowler can update their
// card or cancel. Play subscribers manage theirs in the Play Store app
// instead -- there is nothing for this to do on that rail, so the caller
// (Subscribe.jsx) only offers this button when currentRail() is "stripe".
export async function openSubscriptionManager() {
  try {
    const { data, error } = await supabase.functions.invoke("create-portal-session", {});
    if (error) {
      // Same as startStripe: the useful sentence is in the body, not in
      // the opaque error. A bowler on the Play rail gets "No Stripe
      // subscription found for this account", which is the truth and
      // points them at the right place, instead of a generic failure
      // they would reasonably retry.
      const { message } = await invokeFailure(error);
      return { ok: false, message: message || "Could not open the subscription manager. Please try again." };
    }
    if (!data?.url) {
      return { ok: false, message: "Could not open the subscription manager. Please try again." };
    }
    window.location.href = data.url;
    return { ok: true, navigating: true };
  } catch (e) {
    console.error("opening the subscription manager threw:", String(e));
    return { ok: false, message: "Could not open the subscription manager. Please try again." };
  }
}

// ── One Play call at a time ─────────────────────────────────────────
//
// The plugin opens a fresh billing connection for every call and CLOSES
// any existing one first (initBillingClient in its Android source). Two
// calls in flight at once -- the launch-time purchase check and the
// subscribe screen asking for prices, say -- would tear down each
// other's connection mid-request. Every plugin call goes through this
// queue so they run one after another.
let playQueue = Promise.resolve();
function withPlay(fn) {
  const run = async () => {
    const mod = await import("@capgo/native-purchases");
    // Destructured here, never returned bare -- a Capacitor plugin is a
    // Proxy that answers `then`, so resolving a promise WITH it hangs
    // forever (see googleAuth.js).
    return fn(mod.NativePurchases, mod.PURCHASE_TYPE);
  };
  const next = playQueue.then(run, run);
  playQueue = next.catch(() => {});
  return next;
}

// ── Play ────────────────────────────────────────────────────────────
//
// Buy through Google Play, then hand the purchase token to
// verify-purchase and let the SERVER decide what was bought. Nothing the
// plugin returns about price, plan or entitlement is trusted.
//
// @capgo/native-purchases v7 (it tracks Capacitor's major version). The
// field names below were read from that version's Android source, not
// guessed:
//
//   - purchaseProduct resolves with { purchaseToken, ... } on success.
//   - It rejects "Purchase is pending" for a pending payment (cash,
//     some bank methods) and "Purchase is not purchased" for EVERYTHING
//     else -- the bowler backing out and a real billing error look
//     identical from here. So the message is "wasn't completed", which is
//     true for both, and the raw text goes to Diagnostics.
//   - It picks the first offer on the requested base plan; v7 cannot be
//     told which. With a free-trial offer on the plan, Play only lists it
//     for bowlers still eligible for a trial.
//
// autoAcknowledgePurchases: false, on purpose. verify-purchase
// acknowledges AFTER it has written the entitlement row. If the plugin
// acknowledged here instead, a bowler whose verification then failed
// would have paid, been acknowledged, and been given nothing.
async function startPlay(period) {
  let transaction;
  try {
    transaction = await withPlay((NativePurchases, PURCHASE_TYPE) => NativePurchases.purchaseProduct({
      productIdentifier: PLAY_PRODUCT_ID,
      planIdentifier: period === "year" ? PLAY_BASE_PLAN_YEARLY : PLAY_BASE_PLAN_MONTHLY,
      productType: PURCHASE_TYPE.SUBS,
      quantity: 1,
      autoAcknowledgePurchases: false,
    }));
  } catch (e) {
    const raw = String(e?.message || e || "");
    recordError({ kind: "unhandled", where: "purchase.play.buy", message: raw.slice(0, 300) });
    if (/pending/i.test(raw)) {
      return {
        ok: false, reason: "pending",
        message: "Your payment is pending. Pro unlocks once Google Play finishes processing it.",
      };
    }
    return { ok: false, reason: "not-completed", message: "The purchase wasn't completed. You haven't been charged." };
  }

  const purchaseToken = transaction?.purchaseToken;
  if (!purchaseToken) {
    recordError({ kind: "unhandled", where: "purchase.play.buy", message: "purchase resolved with no purchaseToken" });
    return { ok: false, reason: "verify-failed", message: VERIFY_LATER };
  }

  // Twice, a few seconds apart: a bowler who has just paid and loses
  // signal on the way back should not be left on the free plan by one
  // dropped request. If both fail, reconcilePlayPurchases() picks it up
  // on the next launch -- see below.
  const v = await verifyToken(purchaseToken, 2);
  if (v.ok) return { ok: true, purchased: true, plan: v.plan, status: v.status };
  if (v.otherAccount) {
    return { ok: false, reason: "other-account", message: v.message || "That purchase is already linked to another account." };
  }
  return { ok: false, reason: "verify-failed", message: VERIFY_LATER };
}

// Sends one purchase token to verify-purchase, retrying a failure.
// Resolves { ok, plan, status } or { ok:false, otherAccount, message }.
async function verifyToken(purchaseToken, attempts) {
  let lastMessage = "";
  for (let attempt = 0; attempt < attempts; attempt++) {
    if (attempt) await new Promise(r => setTimeout(r, 3000));
    const { data, error } = await supabase.functions.invoke("verify-purchase", { body: { purchaseToken } });
    if (!error && data?.ok) return { ok: true, plan: data.plan, status: data.status };
    let body = null;
    try { const res = error?.context; if (res && typeof res.json === "function") body = await res.json(); } catch { /* not JSON */ }
    lastMessage = `${error?.context?.status || ""} ${body?.error || error?.message || "no ok in response"}`.trim();
    // 409: that token belongs to another account. Retrying cannot change it.
    if (error?.context?.status === 409) {
      recordError({ kind: "unhandled", where: "purchase.play.verify", message: lastMessage.slice(0, 300) });
      return { ok: false, otherAccount: true, message: body?.error || "" };
    }
  }
  recordError({ kind: "unhandled", where: "purchase.play.verify", message: lastMessage.slice(0, 300) });
  return { ok: false, message: lastMessage };
}

// ── Purchases that were paid for but never confirmed ────────────────
//
// If the verify-purchase call after a purchase fails -- no signal at the
// lanes, the app killed at the wrong moment -- the purchase is real but
// unacknowledged, our database has no row for it, and play-rtdn cannot
// help: its notifications are matched to a row by token, and there is
// none. Google then refunds and revokes it after three days, and a
// bowler who paid simply loses Pro with nobody noticing.
//
// So on launch, ask Play for this Google account's subscription
// purchases and send any that are still UNACKNOWLEDGED to
// verify-purchase -- exactly what the purchase flow would have done.
// Acknowledged purchases are skipped: they are already on file, and
// re-sending every one on every launch would be pointless traffic.
//
// Returns how many were confirmed, so the caller can re-read the
// entitlement when that is more than zero. Never throws.
export async function reconcilePlayPurchases() {
  try {
    if ((await currentRail()) !== "play") return 0;
    const { purchases } = await withPlay((NativePurchases, PURCHASE_TYPE) =>
      NativePurchases.getPurchases({ productType: PURCHASE_TYPE.SUBS }));
    const pending = (Array.isArray(purchases) ? purchases : []).filter(p =>
      p && p.purchaseToken
      && p.productIdentifier === PLAY_PRODUCT_ID
      // "1" is Purchase.PurchaseState.PURCHASED; a PENDING payment is not
      // ours to confirm yet.
      && String(p.purchaseState) === "1"
      && p.isAcknowledged === false);
    let confirmed = 0;
    for (const p of pending) {
      const v = await verifyToken(p.purchaseToken, 1);
      if (v.ok) confirmed++;
    }
    return confirmed;
  } catch (e) {
    recordError({ kind: "unhandled", where: "purchase.play.reconcile", message: String(e?.message || e).slice(0, 300) });
    return 0;
  }
}

// Said when Google has taken the money but our server has not confirmed
// it yet. Never "try again" -- a second tap would try to buy twice.
const VERIFY_LATER =
  "Your purchase went through, but we couldn't confirm it just yet. Pro will unlock shortly -- " +
  "reopen the app in a few minutes. You won't be charged twice.";

// ── What Google offers THIS bowler: trial eligibility and local price ─
//
// Google decides trial eligibility, not us: someone who has had the trial
// once is never offered it again, and the Play sheet then shows the full
// price starting today. The subscribe screen must not promise a trial
// Google is about to withhold.
//
// And Google sets the price per country. DISPLAY_PRICES is US dollars;
// a bowler in Canada or the UK is charged in their own currency, so the
// screen shows Play's own formatted price whenever it has one.
//
// Play only lists offers the signed-in Google account is ELIGIBLE for.
// The plugin (v7, read from its Android source) returns one entry per
// offer: identifier = base plan id, offerId (null for the plain base
// plan), and priceString = the FIRST pricing phase, formatted in the
// bowler's currency. So:
//   - trial available  = the freetrial30 offer is listed for that plan
//   - recurring price  = priceString of the plan's no-offer entry, whose
//                        first phase is the full price (a trial offer's
//                        first phase is "Free", so it cannot be used)
//
// Returns { trial: {month, year}, prices: {month, year} }, or null when
// it cannot tell (web, no plugin, no connection). A missing price is
// null and the caller falls back to DISPLAY_PRICES.
export async function playOffers() {
  try {
    if ((await currentRail()) !== "play") return null;
    const { products } = await withPlay((NativePurchases, PURCHASE_TYPE) =>
      NativePurchases.getProducts({
        productIdentifiers: [PLAY_PRODUCT_ID],
        productType: PURCHASE_TYPE.SUBS,
      }));
    const list = Array.isArray(products) ? products : [];
    const hasTrial = plan => list.some(p => p?.identifier === plan && p?.offerId === PLAY_TRIAL_OFFER_ID);
    const priceOf = plan => {
      const base = list.find(p => p?.identifier === plan && !p?.offerId && p?.priceString);
      return base ? String(base.priceString) : null;
    };
    return {
      trial: { month: hasTrial(PLAY_BASE_PLAN_MONTHLY), year: hasTrial(PLAY_BASE_PLAN_YEARLY) },
      prices: { month: priceOf(PLAY_BASE_PLAN_MONTHLY), year: priceOf(PLAY_BASE_PLAN_YEARLY) },
    };
  } catch (e) {
    recordError({ kind: "unhandled", where: "purchase.play.offers", message: String(e?.message || e).slice(0, 300) });
    return null;
  }
}

// The yearly price for the trial banner, in the bowler's own currency.
// See annualPriceToShow: Play's price on Play (or none), checkout's on
// the web. Never throws; "" means "leave the price out".
export async function annualDisplayPrice() {
  try {
    const rail = await currentRail();
    const offers = rail === "play" ? await playOffers() : null;
    return annualPriceToShow({ rail, offers, displayPrices: DISPLAY_PRICES });
  } catch {
    return "";
  }
}

// ── The one entry point ─────────────────────────────────────────────
//
// Always resolves, never throws. A purchase button that throws leaves a
// spinner spinning forever, and the bowler cannot tell whether they have
// been charged.
export async function startPurchase(period) {
  if (period !== "month" && period !== "year") {
    return { ok: false, reason: "bad-period", message: "Pick a plan first." };
  }
  try {
    const rail = await currentRail();
    return rail === "play" ? await startPlay(period) : await startStripe(period);
  } catch (e) {
    console.error("starting a purchase threw:", String(e));
    return {
      ok: false,
      reason: "failed",
      message: "Something went wrong starting that. Please try again.",
    };
  }
}
