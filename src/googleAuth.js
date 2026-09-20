// "Sign in with Google", on the web and in the Android shell.
//
// ── Why this exists at all ──────────────────────────────────────────────
//
// Until now email was the ONLY way into this app. Magic link and
// sign-in-by-code look like two doors but are one: the code arrives IN
// the email, so both spend a message. Resend's free plan allows 100 a
// day, which is roughly 60-70 real sign-ins once you count the "I didn't
// get it, send another" taps -- and when that runs out the app simply
// stops letting anyone new in, silently, for the rest of the day. On a
// launch day or a league night where the app gets passed round a centre,
// that is exactly when it breaks.
//
// Google sign-in costs nothing per use and has no daily ceiling. On
// Android it is also the *better* door regardless of cost: the account is
// already on the device, so signing in is one tap and no inbox round
// trip at all.
//
// ── The two platforms take genuinely different routes ───────────────────
//
// WEB: the ordinary OAuth redirect. Supabase sends the browser to
// Google, Google sends it back, the client picks the session out of the
// URL. Nothing here has to finish the job -- AuthProvider's
// onAuthStateChange is already listening.
//
// ANDROID: a browser redirect works badly in a Capacitor shell for the
// same reason magic links did (see nativeAuth.js): the app is served
// from inside the bundle, so there is no web origin to come back to. It
// CAN be made to work via the custom scheme, but it means bouncing the
// bowler out to a browser and back for an account their phone already
// knows about. So native uses Google's own sign-in sheet, gets an ID
// token, and hands that straight to Supabase -- no browser, no round
// trip.
//
// ── The nonce, and why it is two different values ───────────────────────
//
// A nonce stops a stolen ID token being replayed. It travels as a pair:
// Google is given the SHA-256 HASH, and Supabase is given the RAW string
// it hashes to. Supabase hashes the raw value itself and checks it
// against the hash baked into the token.
//
// Send the same form to both and it fails -- with a token-validation
// error that says nothing about nonces, which is a genuinely unpleasant
// thing to debug. Hence the deliberate naming below.

import { supabase } from "./supabaseClient.js";
import { APP_URL, GOOGLE_WEB_CLIENT_ID } from "./constants.js";

// Lazy, exactly as nativeAuth.js does it. A static import would pull the
// native plugin into the bundle every PWA visitor downloads, to serve a
// path that can never run in a browser -- and it would break the web
// build outright on any machine where the package isn't installed.
async function nativePlugin() {
  try {
    const core = await import("@capacitor/core");
    if (!core?.Capacitor?.isNativePlatform?.()) return null;
    const { SocialLogin } = await import("@capgo/capacitor-social-login");
    return SocialLogin || null;
  } catch {
    // Not installed, or running on the web. Both mean "use the web path".
    return null;
  }
}

// 32 bytes of real randomness, URL-safe. Math.random() is not acceptable
// here -- the whole point of the value is that it cannot be predicted.
function rawNonce() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Hex, not base64. This is the form Google's sign-in APIs expect for the
// hashed nonce, and mixing the encodings fails the same silent way as
// mixing raw and hashed.
async function sha256Hex(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Initialize is idempotent but not free, and calling it on every tap adds
// latency to the one interaction that should feel instant.
let initialized = false;

async function ensureInitialized(SocialLogin) {
  if (initialized) return;
  await SocialLogin.initialize({
    google: {
      // The WEB client id, on Android. See the long note in constants.js:
      // the Android OAuth client identifies the app by SHA-1 fingerprint,
      // but the ID token is addressed to the web client, and Supabase
      // validates that audience.
      webClientId: GOOGLE_WEB_CLIENT_ID,
      // Required for an idToken to come back at all. Without it the login
      // resolves successfully with no token, and the failure looks like
      // Supabase rejecting a valid sign-in rather than us never having
      // asked for the credential.
      mode: "online",
      // iOSClientId goes here when there is an iOS build. Omitted rather
      // than left empty: an empty string is a value, and a plugin that
      // validates this would reject it.
    },
  });
  initialized = true;
}

/**
 * Start a Google sign-in.
 *
 * Returns { error } to match signInWithMagicLink and verifyEmailCode, so
 * SignIn.jsx handles all three the same way.
 *
 * On the WEB this navigates away and therefore does not "return" in any
 * meaningful sense on success -- the redirect happens first. Only the
 * failure path resolves.
 */
export async function signInWithGoogle() {
  try {
    const SocialLogin = await nativePlugin();

    // ── Web ─────────────────────────────────────────────────────────────
    if (!SocialLogin) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          // Explicit rather than window.location.origin: a preview
          // deployment or a stray origin would otherwise send bowlers
          // somewhere that isn't the app, and the redirect has to match a
          // URI registered in Google Cloud regardless.
          redirectTo: APP_URL,
        },
      });
      return { error: error || null };
    }

    // ── Android ─────────────────────────────────────────────────────────
    await ensureInitialized(SocialLogin);

    const raw = rawNonce();
    const hashed = await sha256Hex(raw);

    const response = await SocialLogin.login({
      provider: "google",
      options: {
        // Only what's needed to make an account. Asking for more would
        // push this app into Google's verification review, which takes
        // weeks and would block launch.
        scopes: ["email", "profile"],
        nonce: hashed,
      },
    });

    // The plugin has moved this field's position between versions, so
    // check both shapes rather than assuming one. A missing token here
    // almost always means mode:"online" was lost from initialize.
    const idToken = response?.result?.idToken || response?.idToken;
    if (!idToken) {
      return {
        error: new Error(
          "Google signed in but didn't return an ID token. This usually means " +
          "the sign-in wasn't configured for online mode."
        ),
      };
    }

    const { error } = await supabase.auth.signInWithIdToken({
      provider: "google",
      token: idToken,
      // RAW here, hashed above. Not interchangeable -- see the header.
      nonce: raw,
    });
    return { error: error || null };
  } catch (e) {
    // A cancelled sign-in is not an error worth showing. The bowler
    // closed the sheet on purpose; a red message telling them what they
    // just chose to do reads as a malfunction.
    const message = String(e?.message || e || "");
    if (/cancel|closed|dismiss|user_cancelled/i.test(message)) {
      return { error: null, cancelled: true };
    }
    return {
      error: new Error("Couldn't sign in with Google. Check your connection and try again."),
    };
  }
}
