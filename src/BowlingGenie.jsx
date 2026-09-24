import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { C, S, AiNote } from "./ui.jsx";
import { reviewAiOutput, overreachNote } from "./domain/aiGuard.js";

import { recordError } from "./errorLogStore.js";
import {
  classifyQuestion, refusalMessage, questionsLeftToday, canAskToday,
  budgetLabel, DAILY_QUESTIONS, GENIE_NAME, GENIE_EXAMPLES,
} from "./domain/genie.js";

// The bowling genie.
//
// A lamp that floats over every screen. Rub it, ask it three things a
// day about your own bowling, and it answers from your history.
//
// WHY IT IS CAPPED AT THREE.
//
// Not really cost -- a question is well under a cent. Three makes each
// one worth thinking about, which is the difference between a feature
// people use and a chat box they ignore. The scarcity is the design.
//
// A LOCALLY-BLOCKED QUESTION IS FREE.
//
// Nothing was spent and the classifier might simply be wrong about an
// oddly-phrased question. Burning a wish on a regex misfire is exactly
// what someone would remember about this feature.
// Two shades derived from the theme accent.
//
// accentDark / accentLight are not theme tokens -- referencing them fell
// back to flat accent on every path, which flattens the lamp into a
// silhouette and loses the taper and the foot entirely. Mixed here so
// the shading follows whatever accent the bowler's theme uses.
function shade(hex, amount) {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || "").trim());
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const mix = (c) => Math.max(0, Math.min(255, Math.round(c + 255 * amount)));
  const r = mix((n >> 16) & 255), g = mix((n >> 8) & 255), b = mix(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

export default function BowlingGenie({
  asked = [], today = "", onAsk, disabled = false,
  // In the app header rather than floating over the screen. The lamp
  // floated bottom-right on every screen, which put it over whatever card
  // sat there -- on Home, the Open bowling card. In the header it covers
  // nothing, and the panel drops down from the top instead.
  inHeader = false,
  // For the example questions: a left-hander's corner pin is the 7.
  leftHanded = false,
}) {
  const lampMid = C.accent;
  const lampDark = shade(C.accent, -0.22);
  const lampLight = shade(C.accent, 0.18);
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [thinking, setThinking] = useState(false);

  // What the wait says, changing as it goes on.
  //
  // A message that never changes stops being evidence of progress after
  // a few seconds -- it looks as stuck as no message at all. These are
  // honest about what is happening rather than fake progress: she really
  // does read the statistics before answering.
  const [thinkingNote, setThinkingNote] = useState("Rubbing the lamp\u2026");

  // The pulse is driven from JS, not a CSS animation.
  //
  // There is no stylesheet in this project and no @keyframes anywhere, so
  // an animation name would resolve to nothing and the dot would sit
  // still -- which is precisely the "looks frozen" problem this is meant
  // to fix, reintroduced by the fix.
  const [pulse, setPulse] = useState(1);
  useEffect(() => {
    if (!thinking) return;
    const id = setInterval(() => setPulse(p => (p === 1 ? 0.35 : 1)), 550);
    return () => clearInterval(id);
  }, [thinking]);
  useEffect(() => {
    if (!thinking) { setThinkingNote("Rubbing the lamp\u2026"); return; }
    const stages = [
      [1500, "Reading your numbers\u2026"],
      [5000, "Working out what they mean\u2026"],
      [12000, "Still going \u2014 it is a fair question\u2026"],
    ];
    const timers = stages.map(([ms, text]) => setTimeout(() => setThinkingNote(text), ms));
    return () => timers.forEach(clearTimeout);
  }, [thinking]);
  const [answer, setAnswer] = useState(null);
  const [freeRefusal, setFreeRefusal] = useState("");

  const left = questionsLeftToday(asked, today);
  const canAsk = canAskToday(asked, today) && !disabled;

  async function ask() {
    const q = question.trim();
    if (!q || thinking) return;

    // Checked BEFORE spending anything. A refusal here costs nothing and
    // must not decrement.
    const verdict = classifyQuestion(q);
    if (!verdict.ok) {
      setFreeRefusal(refusalMessage(verdict.reason));
      setAnswer(null);
      return;
    }

    setFreeRefusal("");
    setThinking(true);
    setAnswer(null);
    try {
      const reply = await onAsk?.(q);

      // Show the REAL reason when there is one.
      //
      // onAsk returns { error } with the actual cause -- an exhausted
      // Gemini quota, a retired model, a server fault -- and this used to
      // drop it and say "couldn't reach" for all of them. A bowler waits
      // and retries, which is right for a blip and useless for a quota
      // that resets at midnight.
      // The server says when it ran out of room mid-answer.
      if (reply?.truncated) {
        recordError({
          kind: "unhandled",
          where: "BowlingGenie.ask",
          message: "answer truncated (MAX_TOKENS) — raise maxOutputTokens",
        });
      }

      if (reply?.error && !reply?.text) {
        recordError({
          kind: "unhandled",
          where: "BowlingGenie.ask",
          message: String(reply.error).slice(0, 300),
        });
        setAnswer({ text: String(reply.error), failed: true });
        return;
      }
      // Checked against what she was actually sent, the same way the
      // analysis is. A genie discussing a statistic the app withholds is
      // the fastest way to lose a bowler's trust in both.
      const checked = reply?.text ? reviewAiOutput(reply.text, reply.payload) : null;
      setAnswer(checked
        ? { ...reply, overreached: checked.overreached, citedWithheld: checked.citedWithheld }
        : (reply || { text: `${GENIE_NAME} went quiet. Try again in a moment.` }));
      setQuestion("");
    } catch (e) {
      // A failed call should not silently eat a wish either -- the
      // server only counts what it actually answered.
      // Deliberately does not promise the wish was refunded.
      //
      // The server records the attempt before calling Gemini, so a
      // failure HAS spent one of the three. Saying "that one's still
      // yours" and then showing two left would be a small lie the bowler
      // would notice. See the note in the Edge Function.
      // A thrown error is a different failure from a returned one, and
      // was indistinguishable on screen. Recorded so it can be told apart.
      recordError({
        kind: "unhandled",
        where: "BowlingGenie.ask",
        message: `threw: ${e?.message || String(e)}`.slice(0, 300),
      });
      setAnswer({ text: `Couldn't reach ${GENIE_NAME}. Try again in a moment.`, failed: true });
    } finally {
      setThinking(false);
    }
  }

  return (
    <>
      {/* The lamp. Above the content, clear of the nav bar and the iOS
          home indicator. */}
      <button
        onClick={() => setOpen(v => !v)}
        aria-label={`Ask ${GENIE_NAME}, the bowling genie`}
        style={{
          ...(inHeader ? {
            position: "relative",
            width: "34px", height: "34px", borderRadius: "10px",
            backgroundColor: C.surface,
            border: `1px solid ${C.accent}88`,
            boxShadow: `0 4px 12px ${C.bg}22`,
            padding: 0, flexShrink: 0,
          } : {
            position: "fixed",
            right: "16px",
            bottom: "calc(84px + env(safe-area-inset-bottom, 0px))",
            width: "52px", height: "52px", borderRadius: "26px",
            backgroundColor: C.card,
            border: `1px solid ${C.accent}55`,
            boxShadow: "0 4px 14px rgba(0,0,0,0.28)",
          }),
          lineHeight: 1, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 200, WebkitTapHighlightColor: "transparent",
          opacity: canAsk ? 1 : 0.55,
        }}>
        {/* Drawn, not an emoji.

            The nearest emoji is a diya -- an oil lamp of entirely the
            wrong shape -- and Unicode has no Aladdin lamp. Drawing it
            also means it looks the same on every phone rather than
            whatever that OS decided a lamp should be.

            Two details that took several passes and are easy to undo by
            accident:

            The spout sweeps UP from the belly. Drooping below it, which
            is the obvious way to draw a spout, loses the silhouette
            entirely.

            The handle is a CLOSED loop, joined to the body at the
            shoulder and again at the waist. A detached curve beside a
            tapered body reads as a person with an arm out. */}
        <svg viewBox="0 0 32 32" width={inHeader ? 20 : 30} height={inHeader ? 20 : 30} aria-hidden="true">
          <ellipse cx="16.6" cy="27" rx="4.2" ry="1.1" fill={C.accent} opacity="0.75"/>
          <path d="M15.1 24.4h3l.6 2.2h-4.2z" fill={C.accent} opacity="0.75"/>
          <path d="M23.4 16.4c2.9.6 4.8 2.2 4.8 4.1 0 2-2.1 3.5-5 3.8l-.5-1.8c1.9-.2 3.3-1 3.3-2 0-.9-1.1-1.7-2.9-2.1z" fill={C.accent}/>
          <path d="M9.6 19c0-2.5 3.2-4.1 7-4.1s7 1.6 7 4.1c0 2.2-1.4 3.9-3.1 5-1 .6-1.9.8-3.9.8s-2.9-.2-3.9-.8c-1.7-1.1-3.1-2.8-3.1-5z" fill={C.accent}/>
          <path d="M9.8 18.3C7.1 17 3.9 14.3 2.3 11.2c.8 3.5 3.4 6.6 6.4 8.4z" fill={C.accent}/>
          <path d="M13.2 14.8c0-1.9 1.5-3 3.4-3s3.4 1.1 3.4 3z" fill={C.accent} opacity="0.85"/>
          <circle cx="16.6" cy="10.6" r="1.5" fill={C.accent} opacity="0.75"/>
        </svg>

        {/* How many are left, without opening it. */}
        {left > 0 && left < DAILY_QUESTIONS && (
          <span style={{
            position: "absolute", top: inHeader ? "-7px" : "-2px", right: inHeader ? "-7px" : "-2px",
            minWidth: "18px", height: "18px", borderRadius: "9px",
            backgroundColor: C.accent, color: C.bg,
            fontSize: "10px", fontWeight: 700, lineHeight: "18px",
            textAlign: "center",
          }}>{left}</span>
        )}
      </button>

      {/* Tapping anywhere else closes it.

          An invisible full-screen layer BEHIND the panel and above
          everything else. Without it the only way out was the lamp
          again, which is not where anyone looks to dismiss something --
          and taps meant for the panel's surroundings were landing on
          whatever screen was underneath.

          Below the panel and the lamp in z-order (199 against 200) so
          both stay clickable; the lamp keeps working as a toggle. */}
      {/* A backdrop, so tapping anywhere else closes the panel.

          Without one the only way out was the lamp itself, which is not
          where anyone looks to dismiss something. It also stops a tap
          meant for "close" landing on whatever screen is behind the
          panel and doing something unintended.

          Transparent rather than dimmed: this is a small panel over a
          working screen, not a modal, and darkening everything would
          overstate it. */}
      {/* Both the tap-away layer and the panel are portalled to <body>.
          The lamp sits in the app header, whose backdrop-filter makes it
          the containing block for position:fixed children -- so the
          "full-screen" layer only covered the header, taps below it
          reached the app, and the panel never closed. At the document
          root, fixed means the viewport again. */}
      {open && typeof document !== "undefined" && createPortal(
        <div
          onClick={() => setOpen(false)}
          aria-hidden="true"
          style={{ position: "fixed", inset: 0, zIndex: 199 }}
        />,
        document.body
      )}

      {open && typeof document !== "undefined" && createPortal(
        <div style={{
          position: "fixed", left: "12px", right: "12px",
          ...(inHeader ? {
            top: "calc(70px + env(safe-area-inset-top, 0px))",
            maxHeight: "calc(100dvh - 170px - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px))",
            overflowY: "auto",
          } : {
            bottom: "calc(144px + env(safe-area-inset-bottom, 0px))",
          }),
          backgroundColor: C.card, borderRadius: "14px",
          // Accent, not the neutral border every other card uses.
          //
          // The panel floats over a working screen rather than dimming
          // it, so it has to separate itself from whatever is behind --
          // and a 1px neutral line against a card background does not.
          // The accent also ties it to the lamp that opened it.
          border: `1.5px solid ${C.accent}`,
          boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
          padding: "14px", zIndex: 200, maxWidth: "460px", margin: "0 auto",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <div style={{ fontSize: "14px", fontWeight: 600, color: C.text }}>{GENIE_NAME}</div>
            <div style={{ fontSize: "11px", color: C.textMuted }}>{budgetLabel(asked, today)}</div>
          </div>

          {!canAsk && !answer && (
            <div style={{ fontSize: "12px", color: C.textMuted, lineHeight: 1.5 }}>
              You've used all {DAILY_QUESTIONS} today. {GENIE_NAME} is back tomorrow.
            </div>
          )}

          {canAsk && (
            <>
              {/* What she is FOR. The Stats screens already show the standard
                  numbers; she answers the questions they don't, from what
                  the bowler has logged -- and says what to start tracking
                  when the answer needs something they don't. */}
              <div style={{ fontSize: "11.5px", color: C.textMuted, marginBottom: "8px", lineHeight: 1.5 }}>
                The Stats screens cover the usual numbers. {GENIE_NAME} is for the questions they
                don't answer — ask about your own bowling and she works it out from what you've
                logged. If it needs something you don't track yet, she'll tell you what to start logging.
              </div>
              {/* Examples, tap to fill. Each one is answerable from what she
                  is actually sent, so the first try works. Hidden once
                  something is typed. */}
              {!question && !answer && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
                  {GENIE_EXAMPLES.map(ex => leftHanded ? ex.replace("the 10", "the 7") : ex).map(ex => (
                    <button key={ex} type="button" onClick={() => setQuestion(ex)}
                      style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "999px",
                        color: C.text, fontSize: "11.5px", padding: "6px 10px", cursor: "pointer",
                        fontFamily: "inherit", WebkitTapHighlightColor: "transparent" }}>
                      {ex}
                    </button>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  style={{ ...S.input, flex: 1, minWidth: 0, marginBottom: 0, fontSize: "12px" }}
                  value={question}
                  onChange={e => { setQuestion(e.target.value); setFreeRefusal(""); }}
                  onKeyDown={e => { if (e.key === "Enter") ask(); }}
                  placeholder="Ask about your bowling…"
                  disabled={thinking} />
                <button
                  style={{ ...S.btn("primary"), width: "auto", flexShrink: 0, padding: "9px 16px", fontSize: "13px" }}
                  disabled={!question.trim() || thinking}
                  onClick={ask}>
                  {thinking ? "…" : "Ask"}
                </button>
              </div>
            </>
          )}

          {/* Free refusal. Says outright that it cost nothing, because
              otherwise people assume it did. */}
          {/* Say she is THINKING, at the place the answer will appear.
              
              The only sign was the Ask button turning into a single "…"
              while a call takes ten to twenty seconds. Nothing moved,
              nothing appeared where the answer goes, and the app read as
              frozen -- which is worse than slow, because a bowler who
              thinks it crashed taps again or leaves.
              
              The lines change as the wait goes on, so late in a long call
              there is still evidence something is happening. */}
          {thinking && (
            <div style={{ fontSize: "12px", color: C.textMuted, marginTop: "10px",
              lineHeight: 1.6, display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ display: "inline-block", width: "10px", height: "10px",
                borderRadius: "50%", background: C.accent,
                opacity: pulse, transition: "opacity 0.5s ease-in-out" }} />
              <span>{thinkingNote}</span>
            </div>
          )}

          {freeRefusal && (
            <div style={{ fontSize: "12px", color: C.textMuted, marginTop: "10px", lineHeight: 1.5 }}>
              {freeRefusal}
            </div>
          )}

          {answer && (
            <div style={{ marginTop: "12px" }}>
              <div style={{ fontSize: "13px", color: C.text, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>
                {answer.text}
              </div>
              {/* Only on a real answer. A connection failure is not an AI
                  claim about your bowling and does not need caveating. */}
              {answer.overreached && (
                <div style={{ fontSize: "11px", color: C.miss, lineHeight: 1.5, marginTop: "8px" }}>
                  {overreachNote(answer.citedWithheld)}
                </div>
              )}
              {!answer.failed && <AiNote what="That" />}
            </div>
          )}
        </div>
        ,
        document.body
      )}
    </>
  );
}
