import journeyIcon from "../journey-icon.png";
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
  leagues = [], onOpenJourney, onOpenStats, onPickMode, badgeCount = 0,
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
        {value === null || value === undefined ? "—" : value}
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
          padding: "14px 16px", marginBottom: "8px",
        }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "13px", color: C.textMuted }}>This league season</span>
          <span aria-hidden="true" style={{ color: C.textMuted, fontSize: "18px" }}>
            {"›"}
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

      {/* Journey -- the app's name, so it should not look like a row.
          
          It was a label, a line and a chevron: the dullest card on a
          screen carrying the name of the product. The milestone is the
          content, so it gets the size, and the accent wash separates it
          from the reference cards around it without a second colour.
          
          The count is a quiet achievement line rather than a progress
          bar. A bar implies a finish, and a bowling life does not have
          one. */}
      <button onClick={onOpenJourney}
        style={{
          ...S.card, width: "100%", textAlign: "left", cursor: "pointer",
          fontFamily: "inherit",
          padding: "14px 16px", marginBottom: "8px",
          backgroundColor: C.accentDim,
          border: `1px solid ${C.accent}33`,
        }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            {/* The app's own logo.
                
                Points at journey-icon.png, NOT icon.svg -- that one is
                still the old Vault mark, so using it would put the
                previous brand on the card carrying the new name.
                
                Hides itself if the file is not there yet rather than
                showing a broken-image glyph, so this is safe to ship
                before the asset lands. The label beside it carries the
                meaning either way.
                
                No alt text: the label already says "My journey", and a
                screen reader announcing the logo twice is noise. */}
            {/* The app's own logo, IMPORTED rather than path-built.
                
                There is no public/ folder and no publicDir override, so
                Vite only emits assets it can see. A runtime string like
                `${BASE_URL}journey-icon.png` is invisible to the bundler:
                the file never reaches dist, the request 404s, and the
                onError below hides it -- an icon that silently never
                appears, with nothing to debug.
                
                The import makes it a real dependency. Vite hashes it,
                copies it, and hands back the correct URL under the Pages
                sub-path.
                
                No alt text: the label beside it already says "My
                journey", and a screen reader announcing it twice is
                noise. */}
            <img src={journeyIcon} alt="" aria-hidden="true"
              onError={e => { e.currentTarget.style.display = "none"; }}
              style={{
                width: "26px", height: "26px", borderRadius: "7px",
                flexShrink: 0, display: "block",
              }} />
            <span style={{ fontSize: "12px", color: C.accent, letterSpacing: "0.02em" }}>
              My journey
            </span>
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* Badges earned, on the right of the row.
                
                Badges live inside Journey, so the count belongs on the
                card that leads there -- it says the collection exists and
                that there is something in it, which a chevron alone does
                not.
                
                Hidden at zero: "0 badges" on a new bowler's first screen
                reads as a scoreboard they are losing. */}
            {badgeCount > 0 && (
              <span style={{ fontSize: "12px", color: C.accent }}>
                {badgeCount} badge{badgeCount === 1 ? "" : "s"}
              </span>
            )}
            <span aria-hidden="true" style={{ color: C.accent, fontSize: "18px" }}>
              {"›"}
            </span>
          </span>
        </div>

        {recap ? (
          <>
            {/* The milestone itself, at headline size. */}
            <div style={{ fontSize: "20px", fontWeight: 500, color: C.text, marginTop: "8px", lineHeight: 1.25 }}>
              {recap.label}
            </div>

            <div style={{ fontSize: "12px", color: C.textMuted, marginTop: "6px" }}>
              {recap.date} {"·"} {recap.total} milestone{recap.total === 1 ? "" : "s"} so far
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: "18px", fontWeight: 500, color: C.text, marginTop: "8px", lineHeight: 1.3 }}>
              Your road starts with one night
            </div>
            <div style={{ fontSize: "13px", color: C.textMuted, marginTop: "6px", lineHeight: 1.5 }}>
              Every first lands here with the date you did it {"—"} first
              strike, first spare, first 200.
            </div>
          </>
        )}
      </button>

      {/* The four modes ARE the way in.
          
          Tapping one sets the mode and opens scoring. Same rows as the
          setup screen and Settings, from the same source, so the modes
          look like the same four things everywhere they appear. */}
      <div style={{ ...S.label, marginBottom: "8px", marginTop: "2px" }}>What are you doing today?</div>
      {ENVIRONMENTS.map(env => (
        <ActionRow key={env}
          icon={ENVIRONMENT_ICONS[env]}
          color={ENVIRONMENT_COLORS[env]}
          label={ENVIRONMENT_LABELS[env]}
          compact
          onClick={() => onPickMode?.(env)} />
      ))}
    </>
  );
}
