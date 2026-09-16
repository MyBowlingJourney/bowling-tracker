import { C, S, ActionRow } from "./ui.jsx";
import { seasonFigures, journeyRecap } from "./domain/home.js";
import { journeyMilestones } from "./domain/journey.js";


import { ENVIRONMENTS, ENVIRONMENT_ICONS, ENVIRONMENT_COLORS, ENVIRONMENT_LABELS } from "./domain/preferences.js";
// The screen the app opens on, when a night is not under way.
//
// It answers "how am I bowling?" before anyone taps anything. The app
// used to open on a setup form -- a question -- which is the wrong first
// thing to show someone who has already logged twenty nights.
//
// Everything here is derived from stored data and links somewhere
// deeper. Home holds no truth of its own: if a number here differs from
// the Stats screen, that is a bug rather than a second opinion.
export default function HomeView({
  sessions = [], shots = [], tournaments = [], bowler = "",
  leagues = [], onOpenJourney, onOpenStats, onPickMode,
}) {
  const figures = seasonFigures(sessions, { bowler, leagues });
  const recap = journeyRecap(journeyMilestones(
    (sessions || []).filter(s => s && s.bowler === bowler),
    tournaments,
    (shots || []).filter(s => s && s.bowler === bowler),
  ));

  const stat = (label, value, suffix) => (
    <div style={{
      flex: 1, minWidth: 0, textAlign: "center",
      // No border and no fill: these sit INSIDE the season card now, and
      // a bordered box inside a bordered box reads as three cards that
      // happen to be adjacent rather than one figure in three parts.
    }}>
      <div style={{ fontSize: "20px", fontWeight: 500, color: C.text }}>
        {value === null || value === undefined ? "\u2014" : value}
      </div>
      <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "2px" }}>
        {label}
      </div>
      {suffix && (
        <div style={{ fontSize: "10px", color: C.textMuted }}>{suffix}</div>
      )}
    </div>
  );

  return (
    <>
      {/* The three numbers, in ONE card, at the top.
          
          Separate cards made three numbers look like three subjects. They
          are one subject -- how you are bowling this season -- and the
          whole card is the doorway into Stats.
          
          The standalone average card is gone: it said the same thing as
          the first figure here, and a number repeated twice on one screen
          reads as two different numbers that happen to match. */}
      <button onClick={onOpenStats}
        style={{
          ...S.card, width: "100%", textAlign: "left",
          cursor: "pointer", fontFamily: "inherit",
        }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "13px", color: C.textMuted }}>This league season</span>
          <span aria-hidden="true" style={{ color: C.textMuted, fontSize: "18px" }}>
            {"\u203A"}
          </span>
        </div>
        <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
          {stat("Average", figures.average)}
          {stat("High game", figures.highGame)}
          {stat("High series", figures.highSeries)}
        </div>
        <div style={{ fontSize: "12px", color: C.textMuted, marginTop: "10px" }}>
          {figures.games
            ? `${figures.games} game${figures.games === 1 ? "" : "s"} logged`
            : "No games logged yet this season"}
        </div>
      </button>

      {/* Journey, as a recap rather than a target.
          
          The most recent milestone EARNED -- a recap that asks for
          something is a demand, not a recap. The whole card opens
          Journey. */}
      <button onClick={onOpenJourney}
        style={{
          ...S.card, width: "100%", textAlign: "left", cursor: "pointer",
          display: "flex", alignItems: "center", gap: "12px",
          fontFamily: "inherit",
        }}>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "block", fontSize: "13px", color: C.textMuted }}>
            My journey
          </span>
          <span style={{ display: "block", fontSize: "15px", color: C.text, marginTop: "2px" }}>
            {recap ? recap.label : "Log a night and your journey starts here"}
          </span>
          {recap && (
            <span style={{ display: "block", fontSize: "12px", color: C.textMuted, marginTop: "2px" }}>
              {recap.date} {"\u00b7"} {recap.total} milestone{recap.total === 1 ? "" : "s"} so far
            </span>
          )}
        </span>
        <span aria-hidden="true" style={{ color: C.textMuted, fontSize: "18px" }}>
          {"\u203A"}
        </span>
      </button>

      {/* The four modes ARE the way in.
          
          Tapping one sets the mode and opens scoring. Same rows as the
          setup screen and Settings, from the same source, so the modes
          look like the same four things everywhere they appear. */}
      <div style={S.label}>What are you doing today?</div>
      {ENVIRONMENTS.map(env => (
        <ActionRow key={env}
          icon={ENVIRONMENT_ICONS[env]}
          color={ENVIRONMENT_COLORS[env]}
          label={ENVIRONMENT_LABELS[env]}
          onClick={() => onPickMode?.(env)} />
      ))}
    </>
  );
}
