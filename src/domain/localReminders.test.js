import { describe, it, expect } from "vitest";
import {
  leagueReminderId, leagueReminderWhen, trialReminderAt, planLocalReminders,
  isOurReminderId, TRIAL_REMINDER_ID,
} from "./localReminders.js";
import { reminderSpec } from "./reminders.js";

describe("leagueReminderWhen", () => {
  it("fires an hour before a 7pm start, Capacitor weekday numbering", () => {
    // Tuesday is 2 in reminderSpec (0 = Sunday), 3 for Capacitor (1 = Sunday).
    expect(leagueReminderWhen(reminderSpec("Tues Mixed", 2, 60, "19:00")))
      .toEqual({ weekday: 3, hour: 18, minute: 0 });
  });
  it("moves back a day when the reminder falls before midnight", () => {
    expect(leagueReminderWhen(reminderSpec("Early", 0, 60, "00:30")))
      .toEqual({ weekday: 7, hour: 23, minute: 30 });
  });
  it("is null for a day it cannot use", () => {
    expect(leagueReminderWhen(reminderSpec("X", null))).toBeNull();
    expect(leagueReminderWhen(reminderSpec("X", 9))).toBeNull();
    expect(leagueReminderWhen(null)).toBeNull();
  });
});

describe("leagueReminderId", () => {
  it("is stable and ignores case and spacing at the ends", () => {
    expect(leagueReminderId("Tues Mixed")).toBe(leagueReminderId(" tues mixed "));
    expect(isOurReminderId(leagueReminderId("Tues Mixed"))).toBe(true);
  });
  it("differs between leagues", () => {
    expect(leagueReminderId("Tues Mixed")).not.toBe(leagueReminderId("Thursday Men"));
  });
});

describe("trialReminderAt", () => {
  it("is 10am local three days before the end", () => {
    const end = new Date(2026, 10, 20, 15, 0).toISOString();
    const at = trialReminderAt(end, new Date(2026, 9, 1).getTime());
    expect(at.getDate()).toBe(17);
    expect(at.getHours()).toBe(10);
  });
  it("is null once that moment has passed, or with no end", () => {
    const end = new Date(2026, 10, 20).toISOString();
    expect(trialReminderAt(end, new Date(2026, 10, 18).getTime())).toBeNull();
    expect(trialReminderAt(undefined)).toBeNull();
  });
});

describe("planLocalReminders", () => {
  const now = new Date(2026, 9, 1).getTime();
  const trialEnd = new Date(2026, 10, 20).toISOString();

  it("one weekly reminder per league plus the trial reminder", () => {
    const plan = planLocalReminders({
      leagues: [{ league: "Tues Mixed", day: 2 }, { league: "Thu Men", day: 4 }],
      trialEnd, onTrial: true, now,
    });
    expect(plan).toHaveLength(3);
    expect(plan[0].body).toBe("{0} is tonight. Log it as you bowl.");
    expect(plan[2].id).toBe(TRIAL_REMINDER_ID);
  });
  it("no trial reminder for a subscriber or after the trial", () => {
    expect(planLocalReminders({ leagues: [], trialEnd, onTrial: false, now })).toHaveLength(0);
  });
  it("passes the league name to the translator as a value", () => {
    const plan = planLocalReminders({
      leagues: [{ league: "Tues Mixed", day: 2 }], now,
      text: (s, ...v) => s.replace("{0}", v[0] ?? ""),
    });
    expect(plan[0].body).toBe("Tues Mixed is tonight. Log it as you bowl.");
  });
  it("skips leagues with no usable day, and duplicates", () => {
    const plan = planLocalReminders({
      leagues: [{ league: "A", day: null }, { league: "B", day: 1 }, { league: "b ", day: 1 }, null], now,
    });
    expect(plan).toHaveLength(1);
  });
  it("copes with nothing given", () => {
    expect(planLocalReminders()).toEqual([]);
    expect(planLocalReminders(null)).toEqual([]);
  });
});
