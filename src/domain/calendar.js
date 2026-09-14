// A month grid of bowling nights.
//
// The list in Sessions answers "what did I shoot"; a calendar answers a
// different question -- when do I actually bowl, and what does a month
// of it look like. Gaps are as informative as entries: three weeks
// missed in February is visible here and invisible in a list.
//
// BUILT FROM DATES, NOT FROM A CALENDAR LIBRARY.
//
// A month grid is six rows of seven and a bit of arithmetic. Pulling in
// a date library for that would add a dependency to the bundle for
// something the standard Date already does, and every such library has
// its own opinion about timezones -- which is the one thing this must
// not get wrong.
//
// TIMEZONES.
//
// Session dates are plain YYYY-MM-DD strings with no time and no zone:
// a night bowled on the 11th is the 11th wherever it is read. So every
// comparison here is string-to-string, and the only place a Date object
// appears is working out how many days a month has and which weekday it
// starts on. Parsing "2026-02-11" into a Date and formatting it back can
// shift it a day either side of UTC, which would put a Tuesday night in
// Monday's box.

import { isPracticeLeagueName, isCasualLeagueName, isTournamentLeagueName } from "../constants.js";

const rows = v => (Array.isArray(v) ? v : []).filter(x => x && typeof x === "object");

// What kind of night this was.
//
// Derived from the league name rather than a stored field, because that
// is where the distinction already lives: practice and open bowling both
// use reserved league names scoped to the user. Adding a mode column to
// sessions would be a second source of truth for something already
// unambiguous.
//
// Tournaments are NOT in the sessions table at all -- they are their own
// rows with their own days -- so they arrive separately and are tagged
// by the caller.
export function sessionMode(session) {
  const league = String(session?.league || "");
  if (isPracticeLeagueName(league) || league === "Practice") return "practice";
  if (isCasualLeagueName(league) || league === "Just Bowling") return "casual";
  // Tournaments were missing entirely, so every tournament night fell
  // through to "league" and took the league colour -- the calendar
  // looked uncoloured because three of the four modes were the same
  // colour.
  //
  // tournamentNights() colours days folded from the tournaments table,
  // but a tournament that was BOWLED has session rows too, and those
  // came through here.
  if (isTournamentLeagueName(league) || league === "Tournament") return "tournament";
  return "league";

}

const num = v => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

// "2026-02" -> { year: 2026, month: 2 }
export function parseMonthKey(key) {
  const m = /^(\d{4})-(\d{2})$/.exec(String(key || ""));
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  if (month < 1 || month > 12) return null;
  return { year, month };
}

export function monthKey(year, month) {
  return `${year}-${String(month).padStart(2, "0")}`;
}

// Every month a bowler has bowled in, newest first.
//
// Only months with something in them. An empty January between two busy
// months is worth seeing INSIDE a month grid; an empty month in the
// month picker is just a dead option.
export function monthsWithSessions(sessions, bowler, league) {
  const keys = new Set();
  for (const s of rows(sessions)) {
    if (bowler && s.bowler !== bowler) continue;
    if (league && s.league !== league) continue;
    const d = String(s.date || "");
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) keys.add(d.slice(0, 7));
  }
  return [...keys].sort().reverse();
}

// One night, summarised for a calendar cell.
//
// Deliberately small: a cell is a few characters wide. The series total
// is the one number that belongs in the box; everything else waits for
// the bowler to tap it.
export function nightSummary(session) {
  const s = (session && typeof session === "object") ? session : null;
  if (!s) return null;
  const scores = (Array.isArray(s.scores) ? s.scores : []).map(num).filter(v => v !== null);
  if (!scores.length) return null;
  return {
    date: String(s.date || ""),
    league: s.league || "",
    mode: s.mode || sessionMode(s),
    games: scores.length,
    scores,
    series: scores.reduce((a, b) => a + b, 0),
    high: Math.max(...scores),
    average: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
  };
}

// The grid for one month: six rows of seven cells, always.
//
// Always six rows rather than five-or-six, so the calendar does not
// change height as a bowler pages through months. A grid that jumps
// makes the next/previous buttons move under the thumb.
//
// weekStart is 0 for Sunday, 1 for Monday. League nights are named by
// weekday, so which column a Tuesday sits in matters to a bowler
// scanning for their own night.
// Tournament days as calendar nights.
//
// Tournaments live in their own table with their own days, not in
// sessions, so a tournament would otherwise be a blank square on a day
// the bowler spent eight hours at a centre.
export function tournamentNights(tournaments, bowler) {
  const out = [];
  for (const t of rows(tournaments)) {
    if (bowler && t.bowler && t.bowler !== bowler) continue;
    for (const day of rows(t.days)) {
      const date = String(day.date || "");
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
      const scores = rows(day.games)
        .map(g => num(g.score))
        .filter(v => v !== null);
      if (!scores.length) continue;
      out.push({
        bowler: t.bowler || bowler || "",
        league: t.name || "Tournament",
        date,
        scores,
        mode: "tournament",
      });
    }
  }
  return out;
}

export function monthGrid(key, sessions, bowler, league, weekStart = 0) {
  const parsed = parseMonthKey(key);
  if (!parsed) return null;
  const { year, month } = parsed;

  // UTC throughout: these are calendar facts, not moments in time, and
  // local-time construction shifts the 1st of the month across a
  // timezone boundary.
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const lead = (firstWeekday - weekStart + 7) % 7;

  // Nights in this month, keyed by day number.
  const byDay = new Map();
  for (const s of rows(sessions)) {
    if (bowler && s.bowler !== bowler) continue;
    if (league && s.league !== league) continue;
    const d = String(s.date || "");
    if (d.slice(0, 7) !== key) continue;
    const day = Number(d.slice(8, 10));
    if (!day) continue;
    const summary = nightSummary(s);
    if (!summary) continue;
    // Two sessions on one day is real -- a league night and a practice
    // session, or two leagues. Kept as a list rather than the last one
    // winning.
    if (!byDay.has(day)) byDay.set(day, []);
    byDay.get(day).push(summary);
  }

  const cells = [];
  for (let i = 0; i < 42; i++) {
    const day = i - lead + 1;
    if (day < 1 || day > daysInMonth) {
      cells.push({ day: null, date: "", nights: [] });
    } else {
      cells.push({
        day,
        date: `${key}-${String(day).padStart(2, "0")}`,
        nights: byDay.get(day) || [],
      });
    }
  }

  const allNights = [...byDay.values()].flat();
  const allScores = allNights.flatMap(n => n.scores);

  return {
    key,
    year,
    month,
    label: monthLabel(key),
    weekStart,
    cells,
    nightsBowled: allNights.length,
    games: allScores.length,
    average: allScores.length
      ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
      : null,
    high: allScores.length ? Math.max(...allScores) : null,
  };
}

export function monthLabel(key) {
  const parsed = parseMonthKey(key);
  if (!parsed) return "";
  // Midday UTC so the month name cannot slip either side of a boundary.
  const d = new Date(Date.UTC(parsed.year, parsed.month - 1, 15, 12));
  return d.toLocaleDateString(undefined, { month: "long", year: "numeric", timeZone: "UTC" });
}

// Weekday headings in the same order the grid uses.
export function weekdayLabels(weekStart = 0) {
  const out = [];
  for (let i = 0; i < 7; i++) {
    // 2024-01-07 was a Sunday; adding gives every weekday in order.
    const d = new Date(Date.UTC(2024, 0, 7 + ((weekStart + i) % 7)));
    out.push(d.toLocaleDateString(undefined, { weekday: "narrow", timeZone: "UTC" }));
  }
  return out;
}

// Stepping between months.
//
// Steps by calendar month, not by 30 days: adding days to January 31st
// lands in March.
export function shiftMonth(key, delta) {
  const parsed = parseMonthKey(key);
  if (!parsed) return "";
  const total = parsed.year * 12 + (parsed.month - 1) + Number(delta || 0);
  return monthKey(Math.floor(total / 12), (total % 12 + 12) % 12 + 1);
}

// Which modes a day's nights represent, in a stable order.
//
// Pulled out of the view so it can be tested: a fill rule that lives
// inside a component is only verifiable by rendering, and inline styles
// do not survive the test shim.
//
// Capped at two. A square is 40px; a third band would be 13px of colour
// nobody can read, and the detail is one tap away.
export function cellModes(nights) {
  const seen = [];
  for (const n of rows(nights)) {
    const m = n.mode || "league";
    if (!seen.includes(m)) seen.push(m);
  }
  return seen.slice(0, 2);
}
