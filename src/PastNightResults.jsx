import { C, S } from "./ui.jsx";
import { formatDate, CASUAL_SESSION_KEY } from "./constants.js";
import { casualNightsFrom } from "./domain/manualScores.js";
import SessionRecap from "./SessionRecap.jsx";

// A past open bowling night's results, read-only.
//
// The results screen used to exist only for the night in progress: once
// an open bowling night ended there was no way back to who won, the
// awards, or the share card. The recap itself works from saved scores for
// any date, so this is the same screen pointed at an older night --
// without "End Open Bowling", since there is nothing to end.
//
// Who bowled comes from the scores saved that night, not the current
// guest list: a friend who came once is still on their night.
export default function PastNightResults({
  date, manualScores, activeBowler, badgesEarnedOnNight, leftHandedForBowler, onBack,
}) {
  const night = casualNightsFrom(manualScores, CASUAL_SESSION_KEY).find(n => n.date === date);
  const bowlers = night ? Object.keys(night.scoresByBowler) : [];

  return (
    <>
      <button type="button" onClick={onBack}
        style={{ background: "none", border: "none", color: C.accent, cursor: "pointer",
          fontSize: "14px", fontWeight: 700, padding: "0 0 12px", fontFamily: "inherit" }}>
        ‹ Back to History
      </button>
      <div style={{ ...S.label, marginBottom: "4px" }}>Open bowling</div>
      <div style={{ fontSize: "20px", fontWeight: 800, color: C.text, marginBottom: "14px" }}>
        {date ? formatDate(date) : ""}
      </div>
      {bowlers.length ? (
        <SessionRecap
          environment="casual"
          manualScores={manualScores}
          bowler={activeBowler}
          allBowlers={bowlers}
          league={CASUAL_SESSION_KEY}
          date={date}
          badgesEarnedOnNight={badgesEarnedOnNight}
          leftHandedForBowler={leftHandedForBowler} />
      ) : (
        <div style={S.card}>
          <div style={{ fontSize: "13px", color: C.textMuted, lineHeight: 1.5 }}>
            No game scores were saved for this night, so there are no results to show.
          </div>
        </div>
      )}
    </>
  );
}
