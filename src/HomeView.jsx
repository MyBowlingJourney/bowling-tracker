import { C, S } from "./ui.jsx";
import { seasonFigures, journeyRecap } from "./domain/home.js";
import { journeyMilestones } from "./domain/journey.js";

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
  leagues = [], onOpenJourney, onOpenStats, onStartBowling,
}) {
  const figures = seasonFigures(sessions, { bowler, leagues });
  const recap = journeyRecap(journeyMilestones(
    (sessions || []).filter(s => s && s.bowler === bowler),
    tournaments,
    (shots || []).filter(s => s && s.bowler === bowler),
  ));

  const stat = (label, value, suffix) => (
    <div style={{
      flex: 1, minWidth: 0, backgroundColor: C.surface,
      borderRadius: "14px", padding: "12px 10px", textAlign: "center",
      border: `1px solid ${C.border}`,
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
      {/* The headline. One number, the one a bowler would say out loud
          if asked how they are bowling. */}
      <div style={{ ...S.card, paddingBottom: "14px" }}>
        <div style={{ fontSize: "13px", color: C.textMuted }}>
          Season average
        </div>
        <div style={{ fontSize: "38px", fontWeight: 500, lineHeight: 1.1, marginTop: "2px" }}>
          {figures.average === null ? "\u2014" : figures.average}
        </div>
        <div style={{ fontSize: "12px", color: C.textMuted }}>
          {figures.games
            ? `${figures.games} game${figures.games === 1 ? "" : "s"} this season`
            : "No games logged yet this season"}
        </div>
        <button style={{ ...S.btn("primary"), width: "100%", marginTop: "14px" }}
          onClick={onStartBowling}>
          Log bowling
        </button>
      </div>

      {/* Journey, as a recap rather than a target.
          
          The most recent milestone EARNED -- a recap that asks for
          something is a demand, not a recap. */}
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
              {recap.date} \u00b7 {recap.total} milestone{recap.total === 1 ? "" : "s"} so far
            </span>
          )}
        </span>
        <span aria-hidden="true" style={{ color: C.textMuted, fontSize: "18px" }}>
          {"\u203A"}
        </span>
      </button>

      {/* Three numbers, one tap from the rest.
          
          Summary here, depth in Stats -- the cards are a doorway, not a
          destination. */}
      <button onClick={onOpenStats}
        style={{
          width: "100%", background: "none", border: "none", padding: 0,
          cursor: "pointer", fontFamily: "inherit",
        }}>
        <div style={{ display: "flex", gap: "10px" }}>
          {stat("Average", figures.average)}
          {stat("High game", figures.highGame)}
          {stat("High series", figures.highSeries)}
        </div>
        <div style={{ fontSize: "12px", color: C.textMuted, marginTop: "8px", textAlign: "center" }}>
          This league season \u00b7 see all stats {"\u203A"}
        </div>
      </button>
    </>
  );
}
