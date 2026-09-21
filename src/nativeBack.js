// Android back gesture / back button, wired to the app's own navigation.
//
// Loaded lazily and only on the native shell, like nativeAuth.js: the web
// build never imports the plugin. Returns an unsubscribe function.
//
// The handler is read through a getter on every press rather than bound
// once, so it always sees the current screen without re-registering the
// listener on every render.
export function listenForBack(getHandler) {
  let handle = null;
  let cancelled = false;
  (async () => {
    try {
      const core = await import("@capacitor/core");
      if (!core?.Capacitor?.isNativePlatform?.()) return;
      const { App } = await import("@capacitor/app");
      // Registering ANY backButton listener replaces Capacitor's default
      // (WebView history, then finish), which is what we want.
      const h = await App.addListener("backButton", () => {
        const fn = getHandler();
        if (fn) fn({ exit: () => App.minimizeApp() });
      });
      if (cancelled) h.remove(); else handle = h;
    } catch { /* not native, or plugin missing: nothing to do */ }
  })();
  return () => { cancelled = true; try { handle?.remove(); } catch {} };
}
