import { useState, useRef, useEffect } from 'react';
import { APP_NAME } from "./constants.js";
import { useAuth } from './AuthProvider.jsx';

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
  const { signInWithMagicLink, verifyEmailCode, authError } = useAuth();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  // idle | sending | sent | verifying | error
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const codeRef = useRef(null);
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
    }}>
      <div style={{
        width: "100%", maxWidth: "360px", backgroundColor: C.card,
        borderRadius: "12px", padding: "28px 24px", border: `1px solid ${C.border}`,
      }}>
        <div style={{
          fontSize: "16px", fontWeight: 700, letterSpacing: "0.05em",
          color: C.accent, textTransform: "uppercase", textAlign: "center", marginBottom: "6px",
        }}>
          🎳 {APP_NAME}
        </div>
        <div style={{ fontSize: "12px", color: C.textMuted, textAlign: "center", marginBottom: "24px" }}>
          Sign in to log your own games and see the team's stats.
        </div>

        {status === "sent" || status === "verifying" ? (
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
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              required
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
        )}
      </div>
    </div>
  );
}
