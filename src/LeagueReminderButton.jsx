import { useState } from "react";
import { S, C } from "./ui.jsx";
import { reminderLeagues, setLeagueReminder } from "./localReminders.js";

// The league-night reminder in the Android app: a notification from the
// app itself, an hour before a 7pm start, on the night the league bowls.
// On the website the calendar button stays, since a closed web page
// cannot notify anyone.
export default function LeagueReminderButton({ league, sessions, entitlement }) {
  const [on, setOn] = useState(() => reminderLeagues().includes(league));
  const [busy, setBusy] = useState(false);
  const [refused, setRefused] = useState(false);

  async function toggle() {
    if (busy) return;
    setBusy(true);
    const want = !on;
    const now = await setLeagueReminder(league, want, { sessions, entitlement });
    setOn(now);
    // Asked and refused: say where to change it rather than a button
    // that silently does nothing.
    setRefused(want && !now);
    setBusy(false);
  }

  return (
    <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-end", gap: "2px" }}>
      <button type="button" aria-pressed={on} disabled={busy} onClick={toggle}
        style={{ ...S.btn(), padding: "3px 8px", fontSize: "10px",
          ...(on ? { borderColor: C.accent, color: C.accent } : null) }}>
        {on ? "Reminder on" : "Remind me"}
      </button>
      {refused && (
        <span style={{ fontSize: "10px", color: C.textMuted, textAlign: "right" }}>
          Notifications are off for this app in your phone's settings.
        </span>
      )}
    </span>
  );
}
