// Notifications the phone schedules for itself: no server, no account.
//
// Two of them, both known in advance:
//   * league night -- weekly, on the night the league is inferred to bowl
//     (see inferLeagueDay), an hour before the assumed 7pm start. Same
//     intent the calendar reminder already carries (reminderSpec), now
//     delivered by the app itself.
//   * the Pro trial ending -- once, three days before day 60. The prompt
//     that shows what Pro was used for only appears if they open the app;
//     this is what gets them to open it.
//
// Pure: this file only decides WHAT to schedule. src/localReminders.js
// hands the plan to the Capacitor plugin.

import { reminderSpec } from "./reminders.js";

// IDs are how the plugin cancels and replaces. Each kind owns a range so
// a resync can clear exactly what this app scheduled and nothing else.
export const TRIAL_REMINDER_ID = 900;
export const LEAGUE_ID_MIN = 1000;
export const LEAGUE_ID_MAX = 999999;
export const TRIAL_REMINDER_DAYS_BEFORE = 3;
export const TRIAL_REMINDER_HOUR = 10;

const DAY_MS = 24 * 60 * 60 * 1000;

export function isOurReminderId(id) {
  const n = Number(id);
  return n === TRIAL_REMINDER_ID || (Number.isInteger(n) && n >= LEAGUE_ID_MIN && n <= LEAGUE_ID_MAX);
}

// Stable per league name, so turning a reminder off cancels the same ID
// that turning it on scheduled -- across restarts, with no stored map.
export function leagueReminderId(league) {
  const s = typeof league === "string" ? league.trim().toLowerCase() : "";
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  return LEAGUE_ID_MIN + (h % (LEAGUE_ID_MAX - LEAGUE_ID_MIN + 1));
}

// The weekday and clock time to fire, from a reminderSpec. Capacitor
// counts weekdays from 1 = Sunday; reminderSpec from 0 = Sunday. A
// reminder that would fall before midnight moves back a day.
export function leagueReminderWhen(spec) {
  if (!spec || typeof spec !== "object") return null;
  // A number, not anything Number() will turn into one: Number(null) is
  // 0, which would schedule an unknown league night for Sunday.
  const day = spec.day;
  if (typeof day !== "number" || !Number.isInteger(day) || day < 0 || day > 6) return null;
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(spec.time || ""));
  if (!m) return null;
  const before = Number(spec.minutesBefore);
  let mins = Number(m[1]) * 60 + Number(m[2]) - (Number.isFinite(before) && before > 0 ? before : 0);
  let d = day;
  while (mins < 0) { mins += 24 * 60; d = (d + 6) % 7; }
  return { weekday: d + 1, hour: Math.floor(mins / 60) % 24, minute: mins % 60 };
}

// When the trial reminder fires: 10am local, three days before the end.
// Null when that moment has passed -- the in-app prompt covers the last
// days, and a notification about a trial that is nearly over already is
// just noise.
export function trialReminderAt(trialEnd, now = Date.now()) {
  const end = new Date(trialEnd).getTime();
  if (!Number.isFinite(end)) return null;
  const at = new Date(end - TRIAL_REMINDER_DAYS_BEFORE * DAY_MS);
  at.setHours(TRIAL_REMINDER_HOUR, 0, 0, 0);
  return at.getTime() > now ? at : null;
}

// Everything to schedule. `leagues` is [{ league, day }] for the leagues
// the bowler turned reminders on for; `text(english, ...values)` returns
// the words in the app's language.
export function planLocalReminders(opts) {
  const { leagues, trialEnd, onTrial, now = Date.now(), text } =
    opts && typeof opts === "object" ? opts : {};
  const tx = typeof text === "function" ? text : (s) => s;
  const out = [];
  const seen = new Set();
  for (const item of Array.isArray(leagues) ? leagues : []) {
    if (!item || typeof item !== "object") continue;
    const league = typeof item.league === "string" ? item.league.trim() : "";
    if (!league) continue;
    const when = leagueReminderWhen(reminderSpec(league, item.day, 60, "19:00"));
    if (!when) continue;
    const id = leagueReminderId(league);
    if (seen.has(id)) continue;
    seen.add(id);
    out.push({
      id,
      title: tx("League night"),
      body: tx("{0} is tonight. Log it as you bowl.", league),
      schedule: { on: when },
    });
  }
  if (onTrial) {
    const at = trialReminderAt(trialEnd, now);
    if (at) {
      out.push({
        id: TRIAL_REMINDER_ID,
        title: tx("3 days left of Pro"),
        body: tx("Open the app to see what you've used Pro for, and choose Pro or Basic."),
        schedule: { at },
      });
    }
  }
  return out;
}
