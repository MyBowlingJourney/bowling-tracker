// What a bowler is entitled to, in one place.
//
// THERE IS NO BILLING IN THIS APP YET. This file exists so that when
// there is, it lands in exactly one function per feature rather than in
// fifteen scattered `if` statements that have to be found first.
//
// Everything returns true today. That is deliberate and it is not a
// stub that got forgotten: the app ships free, and the honest way to
// hold a paywall's place is a named function that says "yes" and says
// why, not a hardcoded `true` inline at the call site with a TODO next
// to it.
//
// When entitlements arrive, they arrive here:
//
//   export function canPourNightcap(entitlement) {
//     return entitlement?.plan === "plus" && entitlement?.status === "active";
//   }
//
// and the call sites do not change, because they already pass the
// argument and already render a locked state when the answer is false.
//
// WHY A LOCKED STATE AND NOT A HIDDEN ONE
//
// A feature a bowler cannot see is a feature they will never pay for.
// The locked card shows what the night's nightcap would have said about
// -- the real fact count, from their real shots -- and stops short of
// saying it. That is a specific thing being withheld, on a specific
// night, which is the only moment a subscription is ever worth buying.
// "Upgrade for more features" at a random moment is not that moment.

// The Nightcap: the end-of-night read-back on the league results card.
//
// Takes the whole entitlement object rather than a boolean so the shape
// of the answer can get more complicated (trial, lapsed, grace period)
// without every caller changing.
// eslint-disable-next-line no-unused-vars
export function canPourNightcap(entitlement) {
  return true; // free for everyone until billing exists
}

// True while the app has no billing at all, which is what lets the UI
// skip the "locked" presentation entirely rather than showing a padlock
// that nothing can unlock. Flip this the moment a purchase is possible,
// before the gates themselves get teeth -- a padlock with nowhere to go
// is worse than no padlock.
export const BILLING_LIVE = false;
