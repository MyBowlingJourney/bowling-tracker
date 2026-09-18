import { useState } from "react";
import { C, S } from "./ui.jsx";
import { tourSteps, stepAt, isLastStep, tourLength } from "./domain/tour.js";
import TourScreen from "./TourScreen.jsx";

// A full-screen walkthrough that takes over the app.
//
// It used to be a card pinned to the bottom over the live app, which had
// two problems: there wasn't room to show anything useful, and the live
// app behind it was a bowler's EMPTY app -- no scores, no frames, no
// teams -- so the step describing a scoresheet sat above a screen that
// didn't have one.
//
// Taking over means each step can show a full, populated screen with the
// relevant part lit up. That's the only way to teach how to enter a
// spare: you have to see the pins-standing chips and the Spare Made
// buttons, and a new bowler has no data that would produce them.
// `track` picks which walkthrough: "look" | "score" | "ai" | "stats".
//
// Tracks are TOPICS, not modes. The previous version rewrote
// preferences.environment from the track name so an environment-scoped
// step would resolve against the tour being watched -- necessary when a
// track WAS an environment, and meaningless now: there is no environment
// called "stats", and steps are no longer scoped by one.
export default function Tour({ preferences = {}, track, onNavigate, onFinish }) {
  const [index, setIndex] = useState(0);
  const opts = { track };
  const prefs = preferences;
  const steps = tourSteps(prefs, opts);
  const step = stepAt(prefs, index, opts);
  const total = tourLength(prefs, opts);

  if (!step) return null;
  const last = isLastStep(prefs, index, opts);

  function go(next) {
    const clamped = Math.max(0, Math.min(total - 1, next));
    setIndex(clamped);
    // Still switch the app behind the tour, so finishing leaves the
    // bowler on the tab the last step described.
    const s = steps[clamped];
    // Only navigate when the tab exists in the CURRENT mode.
    //
    // The casual tour's Standings steps point at "social", which is the
    // leaderboard in Just Bowling and the Friends screen everywhere
    // else. Replaying the casual tour from Settings as a league bowler
    // therefore walked them into Friends -- a screen the tour isn't
    // describing, behind an overlay they can't interact with.
    //
    // The mock-up already shows what the step is about, so showing the
    // step without moving the app behind it is the safe failure.
    const env = preferences?.environment || "league";
    const tabFitsMode = !(s?.tab === "social" && track === "casual" && env !== "casual");
    if (s?.tab && tabFitsMode && onNavigate) onNavigate(s.tab);
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 400,
      background: C.bg,
      display: "flex", flexDirection: "column",
      paddingTop: "env(safe-area-inset-top)",
      paddingBottom: "env(safe-area-inset-bottom)",
    }}>
      {/* Progress: dots rather than "3 of 12", which reads as a chore. */}
      <div style={{ display: "flex", gap: "4px", justifyContent: "center", padding: "14px 16px 8px" }}>
        {steps.map((s, i) => (
          <div key={s.id} style={{
            height: "4px", borderRadius: "2px", flex: i === index ? "0 0 22px" : "0 0 7px",
            background: i === index ? C.accent : i < index ? C.accent + "55" : C.border,
            transition: "flex-basis 0.2s",
          }} />
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 8px" }}>
        <div style={{ fontSize: "20px", fontWeight: 700, color: C.text, marginBottom: "6px" }}>
          {step.title}
        </div>
        <div style={{ fontSize: "14px", color: C.textMuted, lineHeight: 1.55, marginBottom: "16px" }}>
          {step.body}
        </div>

        <TourScreen stepId={step.id} track={track} />

        {/* A caveat that belongs UNDER the picture, not in the body --
            it qualifies what was just shown rather than describing it. */}
        {step.footnote && (
          <div style={{
            fontSize: "12px", color: C.textMuted, lineHeight: 1.5,
            marginTop: "12px", paddingTop: "10px", borderTop: `1px solid ${C.border}`,
          }}>
            {step.footnote}
          </div>
        )}
      </div>

      <div style={{
        display: "flex", gap: "8px", alignItems: "center",
        padding: "12px 16px", borderTop: `1px solid ${C.border}`, background: C.surface,
      }}>
        {/* Skip is always reachable. A tour you can't leave is worse than
            no tour at all. */}
        <button style={{ ...S.btn(), padding: "12px 14px", fontSize: "13px" }} onClick={onFinish}>
          Skip
        </button>
        {index > 0 && (
          <button style={{ ...S.btn(), padding: "12px 14px", fontSize: "13px" }} onClick={() => go(index - 1)}>
            Back
          </button>
        )}
        <button style={{ ...S.btn("primary"), flex: 1, padding: "12px 14px", fontSize: "14px" }}
          onClick={() => (last ? onFinish?.() : go(index + 1))}>
          {last ? "Start bowling" : "Next"}
        </button>
      </div>
    </div>
  );
}
