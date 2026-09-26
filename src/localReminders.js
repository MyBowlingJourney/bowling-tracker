// Hands the plan from domain/localReminders.js to the phone.
//
// Android app only. On the web there is no way to fire a notification
// while the page is closed, so the website keeps its calendar reminder.
//
// Notification permission (Android 13+) is asked for at two moments with
// an obvious reason behind them: turning on a league reminder, and once
// during the Pro trial. Everything scheduled is cleared and rescheduled on
// every sync, so a league turned off, a trial that became a subscription,
// or a changed league night never leaves a stale notification behind.

import { LocalNotifications } from "@capacitor/local-notifications";
import { inferLeagueDay } from "./domain/reminders.js";
import { planLocalReminders, isOurReminderId } from "./domain/localReminders.js";
import { onProTrial, hasPaidSubscription, isTestAccount } from "./domain/entitlements.js";
import { t } from "./i18n/index.js";

const LEAGUES_KEY = "mbj-league-reminders-v1";
const TRIAL_ASKED_KEY = "mbj-notify-trial-asked-v1";

export function remindersAvailable() {
  try { return !!window.Capacitor?.isNativePlatform?.(); } catch { return false; }
}

// Leagues with a reminder turned on, on this phone.
export function reminderLeagues() {
  try {
    const v = JSON.parse(window.localStorage.getItem(LEAGUES_KEY) || "[]");
    return Array.isArray(v) ? v.filter(x => typeof x === "string" && x) : [];
  } catch { return []; }
}
function saveReminderLeagues(list) {
  try { window.localStorage.setItem(LEAGUES_KEY, JSON.stringify(list)); } catch { /* private mode */ }
}

async function permissionGranted(ask) {
  try {
    let p = await LocalNotifications.checkPermissions();
    if (p.display === "granted") return true;
    if (!ask || p.display === "denied") return false;
    p = await LocalNotifications.requestPermissions();
    return p.display === "granted";
  } catch { return false; }
}

// English in, the app's language out. Values are put in first, so the
// translator matches the whole sentence against its "{0} ..." pattern.
function text(english, ...values) {
  const filled = values.reduce((s, v, i) => s.split(`{${i}}`).join(String(v ?? "")), english);
  return t(filled);
}

// Clears everything this app scheduled and schedules the current plan.
// Never throws: a reminder failing must not take a screen with it.
export async function syncLocalReminders({ sessions, entitlement } = {}) {
  if (!remindersAvailable()) return;
  try {
    if (!(await permissionGranted(false))) return;
    const trial = onProTrial(entitlement) && !hasPaidSubscription(entitlement) && !isTestAccount(entitlement);
    const leagues = reminderLeagues()
      .map(league => ({ league, day: inferLeagueDay(sessions || [], league) }))
      .filter(x => x.day !== null);
    const plan = planLocalReminders({
      leagues, onTrial: trial, trialEnd: entitlement?.pro_trial_end, text,
    });
    const pending = await LocalNotifications.getPending();
    const ours = (pending?.notifications || []).filter(n => isOurReminderId(n.id));
    if (ours.length) await LocalNotifications.cancel({ notifications: ours.map(n => ({ id: n.id })) });
    if (plan.length) await LocalNotifications.schedule({ notifications: plan });
  } catch { /* the calendar reminder still exists as a fallback */ }
}

// Turns one league's reminder on or off. Returns whether it is on
// afterwards: off if permission was refused.
export async function setLeagueReminder(league, on, ctx) {
  const list = reminderLeagues().filter(l => l !== league);
  if (on) {
    if (!(await permissionGranted(true))) { saveReminderLeagues(list); return false; }
    list.push(league);
  }
  saveReminderLeagues(list);
  await syncLocalReminders(ctx);
  return on;
}

// Once, during the Pro trial: ask so the "3 days left" reminder can fire.
// Asked a single time whatever the answer -- a refusal is respected.
export async function askForTrialReminder(ctx) {
  if (!remindersAvailable()) return;
  const e = ctx?.entitlement;
  if (!onProTrial(e) || hasPaidSubscription(e) || isTestAccount(e)) return;
  try {
    if (window.localStorage.getItem(TRIAL_ASKED_KEY)) return;
    window.localStorage.setItem(TRIAL_ASKED_KEY, "1");
  } catch { return; }
  await permissionGranted(true);
  await syncLocalReminders(ctx);
}
