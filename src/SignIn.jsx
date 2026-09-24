import { useState, useRef, useEffect } from 'react';
import { APP_NAME } from "./constants.js";
import { useAuth } from './AuthProvider.jsx';
import { supabase } from './supabaseClient.js';

// ── Password sign-in, hidden: for the Google Play reviewer ──────────
//
// Bowlers never have a password -- they sign up through Google or an
// email code -- so password sign-in only works for accounts created in
// the Supabase dashboard with one. That is the Play reviewer's account:
// a Google account is no good for review, because Google challenges a
// sign-in from the reviewer's unfamiliar device with phone verification
// they cannot complete, and the app is rejected as "couldn't sign in".
//
// Hidden behind five quick taps on the app name, so bowlers never see a
// password field they have no password for. The reviewer instructions in
// Play Console say where it is. It only signs in; it never creates an
// account, so it opens no new way to sign up.
const PASSWORD_TAPS = 5;
const PASSWORD_TAP_WINDOW_MS = 3000;

// How many digits the code is.
//
// MUST MATCH Supabase: Authentication -> Sign In / Providers -> Email ->
// Email OTP Length. Supabase allows 6 to 10; this project is set to 6,
// because eight digits is a lot to retype standing at a ball return.
//
// This is one named constant rather than a literal because it is NOT a
// fact this file gets to decide. It shipped hardcoded as 6 while the
// project was still on Supabase's 8, in three places at once --
// maxLength, the auto-submit trigger, and the button's enabled state --
// so a valid code could not even be typed in full. The app was wrong and
// the server was right, which is the wrong way round for the side that
// is talking to the bowler.
//
// If sign-in ever starts failing on a correct-looking code, count the
// digits in the email and change this one number. Nothing else here
// knows the length, and AuthProvider deliberately does not check it at
// all -- verifyOtp is the authority.
const OTP_LENGTH = 6;

const C = {
  bg: "#0f1117", surface: "#1a1d27", card: "#22263a",
  accent: "#4a9eff", accentDim: "#1e3a5f",
  strike: "#22c55e", spare: "#f59e0b", miss: "#ef4444",
  text: "#e8eaf0", textMuted: "#8892a4", border: "#2e3347",
};

// Sign-in, by code OR by link.
//
// The email carries both. Which one a bowler reaches for depends on where
// they are:
//
//   - In the ANDROID APP the code is the reliable path. A link has to
//     survive the email client's embedded browser, that browser choosing
//     to hand a custom scheme back to Android, an intent filter match,
//     and Capacitor's appUrlOpen event. Any of those can drop it, and
//     when they do nothing visible happens at all -- the worst possible
//     failure for a first-run experience.
//   - On the WEB the link is one tap and none of that applies.
//
// So this screen leads with the code field and mentions the link
// underneath, rather than the other way round.
export default function SignIn() {
  const { signInWithMagicLink, verifyEmailCode, signInWithGoogle, authError } = useAuth();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  // idle | sending | sent | verifying | error
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const codeRef = useRef(null);
  const [passwordMode, setPasswordMode] = useState(false);
  const [password, setPassword] = useState("");
  const taps = useRef([]);
  function tapTitle() {
    const now = Date.now();
    taps.current = [...taps.current.filter(t => now - t < PASSWORD_TAP_WINDOW_MS), now];
    if (taps.current.length >= PASSWORD_TAPS) {
      taps.current = [];
      setPasswordMode(true);
      setStatus("idle");
      setErrorMsg("");
    }
  }
  async function handlePassword(e) {
    e.preventDefault();
    if (!email || !password || status === "sending" || !supabase) return;
    setStatus("sending");
    setErrorMsg("");
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setStatus("error");
      setErrorMsg(/invalid/i.test(error.message || "")
        ? "Wrong email or password."
        : (error.message || "Couldn't sign in."));
      return;
    }
    // Success lands through onAuthStateChange, like every other door.
    setStatus("idle");
  }

  // Keep the button above the keyboard.
  //
  // On Android the app is edge-to-edge, and the WebView is no longer
  // resized when the keyboard opens -- the keyboard is drawn OVER the
  // page. On a phone that put it squarely over "Email Me a Code", with
  // nowhere to scroll: this screen is exactly one screen tall.
  //
  // So while a field has focus the page gets room at the bottom, and the
  // button is scrolled into the top part of the screen, which the
  // keyboard never reaches. This works whether or not the WebView
  // resizes, so it needs no native plugin and changes nothing on the web.
  //
  // The room comes off a beat AFTER focus leaves, not on blur: tapping
  // the button blurs the field first, and removing the room at that
  // instant would move the button out from under the finger mid-tap.
  const [typing, setTyping] = useState(false);
  const releaseTimer = useRef(null);
  const emailButtonRef = useRef(null);
  const codeButtonRef = useRef(null);
  const keepAboveKeyboard = (targetRef) => ({
    onFocus: () => {
      clearTimeout(releaseTimer.current);
      setTyping(true);
      setTimeout(() => {
        const el = targetRef.current;
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY;
        try { window.scrollTo({ top: Math.max(0, top - window.innerHeight * 0.3), behavior: "smooth" }); } catch { /* old WebView */ }
      }, 250);
    },
    onBlur: () => {
      clearTimeout(releaseTimer.current);
      releaseTimer.current = setTimeout(() => setTyping(false), 400);
    },
  });
  useEffect(() => () => clearTimeout(releaseTimer.current), []);
  // Guards the auto-submit below against firing twice for one entry --
  // a re-render while the request is in flight would otherwise resubmit
  // the same code and get the second attempt rejected as already used.
  const submittingRef = useRef(false);

  // A link that came back and failed reports through the context rather
  // than through this form -- nothing was submitted here, so the local
  // state above would never hear about it.
  const linkError = authError || "";

  // Put the cursor in the code field the moment it appears. The bowler is
  // switching to their email app and back; landing them on a focused
  // field means the keyboard is already up when they return.
  useEffect(() => {
    if (status === "sent") codeRef.current?.focus();
  }, [status]);

  // On the web this navigates away to Google, so the "google" status is
  // only ever visible for the moment before the browser leaves. On
  // Android it covers the native sheet opening, which is the case that
  // actually needs the feedback.
  //
  // A cancelled sign-in resolves with no error and no session -- the
  // bowler closed the sheet deliberately, and telling them off for it
  // reads as a malfunction. The status just goes back to idle.
  async function handleGoogle() {
    setStatus("google");
    setErrorMsg("");
    const { error } = await signInWithGoogle();
    if (error) {
      setErrorMsg(error.message);
      setStatus("error");
      return;
    }
    // No success branch on purpose. onAuthStateChange in AuthProvider
    // owns what happens next, exactly as it does for a code or a link.
    // Setting state here would be a second place deciding the same
    // thing, which is how the two end up disagreeing.
    setStatus("idle");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || status === "sending") return;
    setStatus("sending");
    setErrorMsg("");
    const { error } = await signInWithMagicLink(email.trim());
    if (error) {
      setStatus("error");
      setErrorMsg(error.message || "Couldn't send the code. Try again.");
    } else {
      setCode("");
      setStatus("sent");
    }
  }

  async function submitCode(value) {
    const digits = String(value || "").replace(/\D/g, "");
    if (digits.length !== OTP_LENGTH || submittingRef.current) return;
    submittingRef.current = true;
    setStatus("verifying");
    setErrorMsg("");
    const { error } = await verifyEmailCode(email.trim(), digits);
    submittingRef.current = false;
    if (error) {
      // Back to "sent", not "error": the email is still valid and the
      // bowler's next move is to retype the code, so the field has to
      // still be there. A full error state would take it away.
      setStatus("sent");
      setErrorMsg(
        /expired|invalid|token/i.test(error.message || "")
          ? "That code didn't work. Check it, or send a new one."
          : (error.message || "Couldn't verify that code.")
      );
      setCode("");
      codeRef.current?.focus();
    }
    // On success nothing happens here on purpose -- the session lands via
    // onAuthStateChange and this whole screen unmounts.
  }

  // Auto-submit on the last digit.
  //
  // A full-length code is unambiguous: there is nothing else the bowler
  // could be about to type. Making them reach for a button afterwards is
  // a tap that exists only because the form has one.
  function onCodeChange(raw) {
    const digits = raw.replace(/\D/g, "").slice(0, OTP_LENGTH);
    setCode(digits);
    if (errorMsg) setErrorMsg("");
    if (digits.length === OTP_LENGTH) submitCode(digits);
  }

  const shownError = linkError || errorMsg;

  return (
    <div style={{
      minHeight: "100vh", backgroundColor: C.bg, color: C.text,
      fontFamily: "'Inter',system-ui,sans-serif", fontSize: "14px",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "24px",
      // Room to scroll the button above the keyboard -- see keepAboveKeyboard.
      paddingBottom: typing ? "60vh" : "24px",
    }}>
      <div style={{
        width: "100%", maxWidth: "360px", backgroundColor: C.card,
        borderRadius: "12px", padding: "28px 24px", border: `1px solid ${C.border}`,
      }}>
        <div onClick={tapTitle} style={{
          fontSize: "16px", fontWeight: 700, letterSpacing: "0.05em",
          color: C.accent, textTransform: "uppercase", textAlign: "center", marginBottom: "6px",
          userSelect: "none", WebkitTapHighlightColor: "transparent",
        }}>
          🎳 {APP_NAME}
        </div>
        <div style={{ fontSize: "12px", color: C.textMuted, textAlign: "center", marginBottom: "24px" }}>
          Sign in to log your own games and see the team's stats.
        </div>

        {passwordMode ? (
          <form onSubmit={handlePassword}>
            <input
              type="email" required autoComplete="username"
              placeholder="Email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%", backgroundColor: C.surface, border: `1px solid ${C.border}`,
                borderRadius: "8px", padding: "12px", color: C.text, fontSize: "14px",
                boxSizing: "border-box", outline: "none", marginBottom: "10px",
              }}
            />
            <input
              type="password" required autoComplete="current-password"
              placeholder="Password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%", backgroundColor: C.surface, border: `1px solid ${C.border}`,
                borderRadius: "8px", padding: "12px", color: C.text, fontSize: "14px",
                boxSizing: "border-box", outline: "none", marginBottom: "12px",
              }}
            />
            <button
              type="submit"
              disabled={status === "sending"}
              style={{
                width: "100%", padding: "12px 20px", borderRadius: "10px", border: "none",
                cursor: status === "sending" ? "default" : "pointer",
                fontSize: "14px", fontWeight: 700, backgroundColor: C.accent, color: "#fff",
                opacity: status === "sending" ? 0.6 : 1, WebkitTapHighlightColor: "transparent",
              }}
            >
              {status === "sending" ? "Signing in…" : "Sign In"}
            </button>
            {status === "error" && errorMsg && (
              <div style={{ fontSize: "12px", color: C.miss, marginTop: "10px", textAlign: "center" }}>
                {errorMsg}
              </div>
            )}
            <div style={{ textAlign: "center", marginTop: "14px" }}>
              <button
                type="button"
                onClick={() => { setPasswordMode(false); setPassword(""); setStatus("idle"); setErrorMsg(""); }}
                style={{ background: "none", border: "none", color: C.accent, fontSize: "12px", cursor: "pointer" }}
              >
                Back
              </button>
            </div>
          </form>
        ) : status === "sent" || status === "verifying" ? (
          <div>
            <div style={{ textAlign: "center", marginBottom: "18px" }}>
              <div style={{ fontSize: "28px", marginBottom: "10px" }}>📬</div>
              <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>
                Check your email
              </div>
              <div style={{ fontSize: "12px", color: C.textMuted }}>
                We sent a {OTP_LENGTH}-digit code to <span style={{ color: C.text }}>{email}</span>.
              </div>
            </div>

            <input
              ref={codeRef}
              {...keepAboveKeyboard(codeButtonRef)}
              type="text"
              inputMode="numeric"
              // Lets Android and iOS offer the code from the notification
              // or the email without the bowler switching apps at all.
              autoComplete="one-time-code"
              placeholder={"0".repeat(OTP_LENGTH)}
              value={code}
              maxLength={OTP_LENGTH}
              disabled={status === "verifying"}
              onChange={(e) => onCodeChange(e.target.value)}
              style={{
                width: "100%", backgroundColor: C.surface, border: `1px solid ${shownError ? C.miss : C.border}`,
                borderRadius: "8px", padding: "14px", color: C.text,
                fontSize: "24px", fontWeight: 700, letterSpacing: "0.35em",
                textAlign: "center", boxSizing: "border-box", outline: "none",
                marginBottom: "12px", opacity: status === "verifying" ? 0.6 : 1,
              }}
            />

            <button
              ref={codeButtonRef}
              type="button"
              onClick={() => submitCode(code)}
              disabled={status === "verifying" || code.length !== OTP_LENGTH}
              style={{
                width: "100%", padding: "12px 20px", borderRadius: "10px", border: "none",
                cursor: status === "verifying" || code.length !== OTP_LENGTH ? "default" : "pointer",
                fontSize: "14px", fontWeight: 700,
                backgroundColor: C.accent, color: "#fff",
                opacity: status === "verifying" || code.length !== OTP_LENGTH ? 0.5 : 1,
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {status === "verifying" ? "Signing in…" : "Sign In"}
            </button>

            {shownError && (
              <div style={{ fontSize: "12px", color: C.miss, marginTop: "10px", textAlign: "center" }}>
                {shownError}
              </div>
            )}

            <div style={{
              fontSize: "11px", color: C.textMuted, marginTop: "16px",
              textAlign: "center", lineHeight: 1.6,
            }}>
              The same email has a sign-in link in it, if you'd rather tap that.
              <br />The code lasts an hour.
            </div>

            <div style={{ textAlign: "center", marginTop: "14px" }}>
              <button
                onClick={() => { setStatus("idle"); setCode(""); setErrorMsg(""); }}
                style={{
                  background: "none", border: "none", color: C.accent,
                  fontSize: "12px", cursor: "pointer", WebkitTapHighlightColor: "transparent",
                }}
              >
                Use a different email
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Google first, and deliberately so.

                It is the faster door on every platform and the only one
                that doesn't spend an email -- on Android the account is
                already on the phone, so it's one tap and no inbox round
                trip. Email stays directly beneath it, in full, for anyone
                without a Google account or who would simply rather not
                use one. Nothing has been taken away. */}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={status === "google"}
              style={{
                width: "100%", padding: "12px 20px", borderRadius: "10px",
                border: `1px solid ${C.border}`,
                cursor: status === "google" ? "default" : "pointer",
                fontSize: "14px", fontWeight: 600,
                backgroundColor: "#fff", color: "#1f1f1f",
                opacity: status === "google" ? 0.6 : 1,
                WebkitTapHighlightColor: "transparent",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                marginBottom: "16px",
              }}
            >
              {/* Google's own mark, inline. Their branding terms require
                  the real logo rather than an approximation, and inlining
                  it avoids a network fetch on the one screen that must
                  work before anything else does. */}
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"/>
                <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33z"/>
                <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"/>
              </svg>
              {status === "google" ? "Opening Google…" : "Continue with Google"}
            </button>

            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              marginBottom: "16px", color: C.textMuted, fontSize: "11px",
            }}>
              <div style={{ flex: 1, height: "1px", backgroundColor: C.border }} />
              or
              <div style={{ flex: 1, height: "1px", backgroundColor: C.border }} />
            </div>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              required
              {...keepAboveKeyboard(emailButtonRef)}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%", backgroundColor: C.surface, border: `1px solid ${C.border}`,
                borderRadius: "8px", padding: "12px", color: C.text, fontSize: "14px",
                boxSizing: "border-box", outline: "none", marginBottom: "12px",
              }}
            />
            <button
              ref={emailButtonRef}
              type="submit"
              disabled={status === "sending"}
              style={{
                width: "100%", padding: "12px 20px", borderRadius: "10px", border: "none",
                cursor: status === "sending" ? "default" : "pointer",
                fontSize: "14px", fontWeight: 700,
                backgroundColor: C.accent, color: "#fff",
                opacity: status === "sending" ? 0.6 : 1,
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {status === "sending" ? "Sending…" : "Email Me a Code"}
            </button>
            {(status === "error" || linkError) && (
              <div style={{ fontSize: "12px", color: C.miss, marginTop: "10px", textAlign: "center" }}>
                {/* The link error wins: it is about a link the bowler has
                    already tapped, which is more recent and more useful
                    than whatever this form last said. */}
                {linkError || errorMsg}
              </div>
            )}
            <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "14px", textAlign: "center" }}>
              No password needed — we'll email you a code.
            </div>
          </form>
          </>
        )}
      </div>
    </div>
  );
}
