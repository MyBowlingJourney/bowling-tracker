// What Android's back gesture (or back button) should do.
//
// Without a handler Capacitor's default is the WebView's history -- and
// this app never pushes history, it swaps views in state -- so a swipe in
// from the edge had nothing to go back to and left the app instead of
// stepping back one screen.
//
// Same tree as the header's back arrow (PARENT_VIEW in BowlingTracker),
// so the gesture and the arrow can never disagree:
//   1. a tour is open            -> close it
//   2. the screen has a parent   -> go to it (Badges -> Journey, etc.)
//   3. any other screen but Home -> Home (the bottom-nav tabs)
//   4. Home                      -> leave the app (minimise, not kill,
//                                   which is what back does on Android's
//                                   own home-level screens)
export function backAction(opts) {
  // A null or missing argument would throw on destructuring (a "= {}"
  // default does not catch null). Treat it, and any non-object, as
  // "nothing given".
  const { activeTour = "", view = "home", parentView = null } = opts && typeof opts === "object" ? opts : {};
  if (activeTour) return { type: "closeTour" };
  if (parentView) return { type: "view", view: parentView };
  if (view && view !== "home") return { type: "view", view: "home" };
  return { type: "exit" };
}
