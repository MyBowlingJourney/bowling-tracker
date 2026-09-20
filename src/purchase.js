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
import { paymentRail } from "./domain/billing.js";

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
export const DISPLAY_PRICES = Object.freeze({
  month: "$6.99",
  year: "$49.99",
});

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
    message: typeof body?.error === "string" ? body.error : "",
    alreadySubscribed: body?.alreadySubscribed === true,
  };
}

async function startStripe(period) {
  const { data, error } = await supabase.functions.invoke("create-checkout", {
    body: { period },
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

// ── Play ────────────────────────────────────────────────────────────
//
// NOT IMPLEMENTED YET, DELIBERATELY AND VISIBLY.
//
// @capgo/native-purchases is not in package.json. nativeAuth.js loads
// @capacitor/core with a dynamic import inside a try/catch, which works
// because that package IS installed -- an unresolvable dynamic import is
// a BUILD failure in Vite, not a runtime one caught by the catch. So
// writing the real call now would break every build until the dependency
// is added, including builds of the web app, which does not use Play at
// all.
//
// When the Play Console exists and the plugin is installed, this becomes
// roughly:
//
//   const { NativePurchases } = await import("@capgo/native-purchases");
//   const { transaction } = await NativePurchases.purchaseProduct({
//     productIdentifier: PLAY_PRODUCT_ID,
//     planIdentifier: period === "year" ? BASE_PLAN_YEARLY : BASE_PLAN_MONTHLY,
//   });
//   const { data, error } = await supabase.functions.invoke("verify-purchase", {
//     body: { purchaseToken: transaction.purchaseToken },
//   });
//
// with the exact field names checked against the plugin's own types
// rather than against this comment -- I have not been able to install it
// and will not pretend to know its shape.
//
// The important half is already true and must stay true: the token goes
// to verify-purchase and the SERVER decides what was bought. Nothing the
// plugin returns about price, plan or entitlement is trusted.
async function startPlay(_period) {
  return {
    ok: false,
    reason: "play-not-available",
    message: "In-app purchases are not available in this build yet.",
  };
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
