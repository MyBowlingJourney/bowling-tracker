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
