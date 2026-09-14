// The minimum Chrome will accept for a real installed PWA icon.
//
// Chrome's Android installability check requires a registered service
// worker with a fetch handler -- without one, "Add to Home Screen"
// silently degrades to a plain bookmark shortcut with a generic icon,
// rather than a real installed app using the manifest's icon. That's
// almost certainly why the manifest fix alone didn't produce an icon.
//
// This is deliberately NOT a real offline/caching strategy. A fetch
// handler that intercepts everything and gets the caching wrong can
// serve stale app code indefinitely -- worse than no service worker at
// all. So it does the one thing required (exists, listens for fetch)
// and otherwise gets out of the way: every request just goes to the
// network, same as if this file didn't exist.
//
// Real offline support -- caching the app shell, working at the lanes
// with no signal -- is a separate, deliberate project. This unblocks
// installability today without pretending to be that project.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// NAVIGATIONS GO TO THE NETWORK FIRST, AND ARE NEVER SERVED STALE.
//
// This is the one caching rule the app needs, and it exists to prevent
// exactly one failure:
//
//   index.html names its JS chunks by content hash. The browser caches
//   index.html. A redeploy replaces the chunk files and deletes the old
//   ones. The cached index.html then asks for chunks that no longer
//   exist, and every lazily-loaded screen fails with
//   "Failed to fetch dynamically imported module".
//
// The visible symptom is not an error. It is a screen that renders the
// PREVIOUS build -- a missing tab, a fix that "did not deploy" -- while
// the main bundle is current. That cost most of a session to find.
//
// Everything else still passes straight through. Assets are content
// hashed, so they are safe to cache; only the document that names them
// must be fresh.
self.addEventListener("fetch", (event) => {
  const req = event.request;

  const isNavigation = req.mode === "navigate"
    || (req.method === "GET" && (req.headers.get("accept") || "").includes("text/html"));

  if (!isNavigation) {
    event.respondWith(fetch(req));
    return;
  }

  event.respondWith(
    // cache: "no-store" bypasses the HTTP cache for the document itself,
    // which is what GitHub Pages cannot be told to do with headers.
    fetch(req, { cache: "no-store" }).catch(() =>
      // Offline: the network copy is the only copy, so fall back to
      // whatever the browser already has rather than showing nothing.
      fetch(req))
  );
});

