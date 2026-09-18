// Making the magic link work inside the Android app.
//
// ── The problem ─────────────────────────────────────────────────────────
//
// On the web, a magic link works because the link points back at the same
// page: Supabase's client sees the tokens in the URL and finishes sign-in
// on its own. That is what `emailRedirectTo: window.location.origin +
// window.location.pathname` does, and why nothing else has been needed.
//
// In a native shell there is no such URL. The app is served from inside
// the bundle, so `window.location.origin` is not a place an email link
// can reach. Tapping the link opens a BROWSER, which lands on a page that
// is not the app, and the app never learns anything happened. Sign-in
// appears to do nothing at all.
//
// ── The fix ─────────────────────────────────────────────────────────────
//
// Send the link to a custom scheme the OS knows belongs to this app
// (`<appId>://auth`). Android hands the whole URL to the app through
// Capacitor's appUrlOpen event, and we pull the tokens out of it
// ourselves -- doing by hand what the browser does automatically.
//
// ── First run on a device: one real bug found ───────────────────────────
//
// This file was originally written from the Capacitor and Supabase
// contracts without ever being run, and the header said so. The first
// run on an emulator (18 Sep 2026) found exactly the failure that note
// predicted, in authRedirectTo below:
//
//   const id = cap.Capacitor.getAppId?.() || "";
//
// `Capacitor.getAppId()` DOES NOT EXIST. The CapacitorGlobal interface
// has seven members -- convertFileSrc, getPlatform, isNativePlatform,
// isPluginAvailable, registerPlugin, addListener, removeListener -- and
// no getAppId. The `?.` meant it returned undefined instead of throwing,
// so `id` was "", so the function silently returned the WEB url. The
// emailed link then pointed at GitHub Pages: tapping it opened the web
// app in a browser and the native shell never saw a thing. Every piece
// looked correct and nothing reported an error.
//
// The app id now comes from App.getInfo(), whose `id` field is
// documented as the Android Application ID (and the iOS Bundle
// Identifier). Same plugin listenForAuthLinks already depends on.
//
// The remaining untested-on-hardware parts are sessionFromUrl's two
// flows and the setSession handoff; the first real sign-in is still the
// only thing that proves those.

import { supabase } from "./supabaseClient.js";

// Capacitor is loaded lazily, and never on the web.
//
// A static import would pull the plugin into the browser bundle for every
// PWA visitor who will never need it. It also keeps the web build working
// unchanged if the packages are absent.
async function capacitor() {
  try {
    const core = await import("@capacitor/core");
    if (!core?.Capacitor?.isNativePlatform?.()) return null;
    const app = await import("@capacitor/app");
    return { Capacitor: core.Capacitor, App: app.App };
  } catch {
    // Not installed, or running on the web. Both mean "do nothing".
    return null;
  }
}

export async function isNative() {
  return !!(await capacitor());
}

// Where the magic link should come back to.
//
// The web keeps its current behaviour exactly; only the native shell gets
// the scheme. Returning webDefault means "use the web behaviour", so the
// caller does not have to know which platform it is on.
export async function authRedirectTo(webDefault) {
  const cap = await capacitor();
  if (!cap) return webDefault;

  // The appId IS the scheme, by Capacitor convention. Read at runtime
  // from the native layer so there is one source of truth -- the value
  // in capacitor.config.ts -- rather than a second copy here that can
  // drift from it.
  const info = await cap.App.getInfo();
  const id = info?.id || "";

  // Deliberately loud, and deliberately NOT a fall back to webDefault.
  //
  // Falling back here is what made the original bug invisible: on a
  // device, a web redirect url produces a link that CANNOT reach this
  // app, so sign-in silently never completes and everything upstream
  // looks fine. Failing outright is worse for exactly one user -- the
  // one hitting a broken build -- and better for every attempt to
  // diagnose it. In practice this is near-unreachable: getInfo is a core
  // plugin, and if it were missing, listenForAuthLinks would already be
  // dead too.
  if (!id) {
    throw new Error(
      "Native platform detected but App.getInfo() returned no app id. " +
      "Refusing to fall back to the web redirect url, which would send " +
      "the magic link somewhere this app can never receive it."
    );
  }

  return `${id}://auth`;
}

// Finish a sign-in that arrived as a deep link.
//
// Supabase puts the tokens in the URL FRAGMENT for an implicit-flow magic
// link (#access_token=...&refresh_token=...) and in a QUERY parameter for
// PKCE (?code=...). Which one depends on the project's flow setting, so
// both are handled -- guessing wrong would mean sign-in works on the web
// and silently fails on the phone.
export function sessionFromUrl(url) {
  try {
    const u = new URL(url);
    const code = u.searchParams.get("code");
    if (code) return { kind: "pkce", code };

    // The fragment is not parsed by URL(), so do it by hand.
    const hash = (u.hash || "").replace(/^#/, "");
    if (!hash) return null;
    const params = new URLSearchParams(hash);
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");
    if (access_token && refresh_token) {
      return { kind: "implicit", access_token, refresh_token };
    }
    // An error can come back the same way -- an expired or reused link.
    const error = params.get("error_description") || params.get("error");
    return error ? { kind: "error", error } : null;
  } catch {
    return null;
  }
}

// Start listening. Returns a function that stops listening, or null on
// the web where there is nothing to listen to.
//
// onError is called with a short, human sentence -- an expired link is
// the common case and the bowler needs to be told, not left on a screen
// that did nothing.
export async function listenForAuthLinks(onError) {
  const cap = await capacitor();
  if (!cap) return null;

  const handle = await cap.App.addListener("appUrlOpen", async ({ url }) => {
    const parsed = sessionFromUrl(url || "");
    if (!parsed) return;

    try {
      if (parsed.kind === "error") {
        onError?.("That sign-in link didn't work — it may have expired. Send yourself a new one.");
        return;
      }
      if (parsed.kind === "pkce") {
        const { error } = await supabase.auth.exchangeCodeForSession(parsed.code);
        if (error) throw error;
        return;
      }
      const { error } = await supabase.auth.setSession({
        access_token: parsed.access_token,
        refresh_token: parsed.refresh_token,
      });
      if (error) throw error;
      // No state is set here on purpose: onAuthStateChange in
      // AuthProvider is already listening and will pick the session up,
      // exactly as it does on the web. Two places setting the session is
      // how they end up disagreeing.
    } catch (e) {
      onError?.("Couldn't finish signing in. Check your connection and try the link again.");
    }
  });

  return () => { try { handle?.remove?.(); } catch { /* already gone */ } };
}
