import { useState, useEffect } from "react";
import { C, S, AiNote } from "./ui.jsx";
import { reviewAiOutput, overreachNote } from "./domain/aiGuard.js";

import { recordError } from "./errorLogStore.js";
import {
  classifyQuestion, refusalMessage, questionsLeftToday, canAskToday,
  budgetLabel, DAILY_QUESTIONS, GENIE_NAME, GENIE_EXAMPLES,
} from "./domain/genie.js";

// Ask Brooklyn: a card on the Improve tab.
//
// Three questions a day about your own bowling, answered from your
// history. It used to be a lamp in the header on every screen, with a
// genie persona and "wishes"; it is now a plain field on Improve, next to
// the rest of the improvement tools, and the budget is "questions".
//
// WHY IT IS CAPPED AT THREE.
//
// Not really cost -- a question is well under a cent. Three makes each
// one worth thinking about, which is the difference between a feature
// people use and a chat box they ignore.
//
// A LOCALLY-BLOCKED QUESTION IS FREE.
//
// Nothing was spent and the classifier might simply be wrong about an
// oddly-phrased question. Spending a question on a regex misfire is
// exactly what someone would remember about this feature.
export default function AskBrooklyn({
  asked = [], today = "", onAsk, disabled = false,
  // For the example questions: a left-hander's corner pin is the 7.
  leftHanded = false,
}) {
  const [question, setQuestion] = useState("");
  const [thinking, setThinking] = useState(false);

  // What the wait says, changing as it goes on. A message that never
  // changes stops being evidence of progress after a few seconds.
  const [thinkingNote, setThinkingNote] = useState("Reading your question\u2026");

  // The pulse is driven from JS: there are no @keyframes in this app.
  const [pulse, setPulse] = useState(1);
  useEffect(() => {
    if (!thinking) return;
    const id = setInterval(() => setPulse(p => (p === 1 ? 0.35 : 1)), 550);
    return () => clearInterval(id);
  }, [thinking]);
  useEffect(() => {
    if (!thinking) { setThinkingNote("Reading your question\u2026"); return; }
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
          where: "AskBrooklyn.ask",
          message: "answer truncated (MAX_TOKENS) — raise maxOutputTokens",
        });
      }

      if (reply?.error && !reply?.text) {
        recordError({
          kind: "unhandled",
          where: "AskBrooklyn.ask",
          message: String(reply.error).slice(0, 300),
        });
        setAnswer({ text: String(reply.error), failed: true });
        return;
      }
      // Checked against what she was actually sent, the same way the
      // analysis is. Brooklyn discussing a statistic the app withholds is
      // the fastest way to lose a bowler's trust in both.
      const checked = reply?.text ? reviewAiOutput(reply.text, reply.payload) : null;
      setAnswer(checked
        ? { ...reply, overreached: checked.overreached, citedWithheld: checked.citedWithheld }
        : (reply || { text: `${GENIE_NAME} went quiet. Try again in a moment.` }));
      setQuestion("");
    } catch (e) {
      // Deliberately does not promise the question was refunded.
      //
      // The server records the attempt before calling Gemini, so a
      // failure HAS spent one of the three. Saying "that one's still
      // yours" and then showing two left would be a small lie the bowler
      // would notice. See the note in the Edge Function.
      // A thrown error is a different failure from a returned one, and
      // was indistinguishable on screen. Recorded so it can be told apart.
      recordError({
        kind: "unhandled",
        where: "AskBrooklyn.ask",
        message: `threw: ${e?.message || String(e)}`.slice(0, 300),
      });
      setAnswer({ text: `Couldn't reach ${GENIE_NAME}. Try again in a moment.`, failed: true });
    } finally {
      setThinking(false);
    }
  }

  return (
    <div style={S.card}>
      {/* Wraps rather than squeezing: in French both halves are long, and
          the count drops under the title instead of splitting it. */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "baseline", columnGap: "10px", rowGap: "2px", marginBottom: "8px" }}>
        <div style={{ ...S.label, color: C.accent, marginBottom: 0, whiteSpace: "nowrap" }}>Ask {GENIE_NAME}</div>
        <div style={{ fontSize: "11px", color: C.textMuted, whiteSpace: "nowrap" }}>{budgetLabel(asked, today)}</div>
      </div>

      {!canAsk && !answer && (
        <div style={{ fontSize: "12.5px", color: C.textMuted, lineHeight: 1.5 }}>
          You've used all {DAILY_QUESTIONS} questions today. Ask again tomorrow.
        </div>
      )}

      {canAsk && (
        <>
          {/* What she is FOR. The Stats screens already show the standard
              numbers; she answers the questions they don't, from what
              the bowler has logged. */}
          <div style={{ fontSize: "12.5px", color: C.textMuted, marginBottom: "10px", lineHeight: 1.5 }}>
            The Stats screens cover the usual numbers. {GENIE_NAME} is for the questions they
            don't answer — ask about your own bowling and she works it out from what you've
            logged. If it needs something you don't track yet, she'll tell you what to start logging.
          </div>
          {/* Examples, tap to fill. Each one is answerable from what she
              is actually sent, so the first try works. Hidden once
              something is typed. */}
          {!question && !answer && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
              {GENIE_EXAMPLES.map(ex => leftHanded ? ex.replace("the 10", "the 7") : ex).map(ex => (
                <button key={ex} type="button" onClick={() => setQuestion(ex)}
                  style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "999px",
                    color: C.text, fontSize: "12px", padding: "7px 11px", cursor: "pointer",
                    fontFamily: "inherit", WebkitTapHighlightColor: "transparent" }}>
                  {ex}
                </button>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              style={{ ...S.input, flex: 1, minWidth: 0, marginBottom: 0 }}
              value={question}
              onChange={e => { setQuestion(e.target.value); setFreeRefusal(""); }}
              onKeyDown={e => { if (e.key === "Enter") ask(); }}
              placeholder="Ask about your bowling…"
              aria-label={`Ask ${GENIE_NAME} a question`}
              disabled={thinking} />
            <button
              style={{ ...S.btn("primary"), width: "auto", flexShrink: 0, padding: "10px 18px", fontSize: "14px" }}
              disabled={!question.trim() || thinking}
              onClick={ask}>
              {thinking ? "…" : "Ask"}
            </button>
          </div>
        </>
      )}

      {/* Say she is working, where the answer will appear. A call takes
          ten to twenty seconds, and a screen where nothing moves reads
          as frozen. */}
      {thinking && (
        <div style={{ fontSize: "12.5px", color: C.textMuted, marginTop: "10px",
          lineHeight: 1.6, display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ display: "inline-block", width: "10px", height: "10px",
            borderRadius: "50%", background: C.accent,
            opacity: pulse, transition: "opacity 0.5s ease-in-out" }} />
          <span>{thinkingNote}</span>
        </div>
      )}

      {/* Free refusal. Says outright that it cost nothing, because
          otherwise people assume it did. */}
      {freeRefusal && (
        <div style={{ fontSize: "12.5px", color: C.textMuted, marginTop: "10px", lineHeight: 1.5 }}>
          {freeRefusal}
        </div>
      )}

      {answer && (
        <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: `1px solid ${C.border}` }}>
          {/* The AI already answers in the app's language, so its words are
              never run through the translation; an error message is. */}
          <div translate={answer.failed ? undefined : "no"} style={{ fontSize: "14px", color: C.text, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>
            {answer.text}
          </div>
          {answer.overreached && (
            <div style={{ fontSize: "11.5px", color: C.miss, lineHeight: 1.5, marginTop: "8px" }}>
              {overreachNote(answer.citedWithheld)}
            </div>
          )}
          {!answer.failed && <AiNote what="That" />}
        </div>
      )}
    </div>
  );
}
