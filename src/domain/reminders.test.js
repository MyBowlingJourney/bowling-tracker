import { describe, it, expect } from 'vitest';
import { inferLeagueDay, normalizeReminder, isLeagueDay, reminderToIcs, reminderSpec, reminderToGoogleCalendarUrl } from './reminders.js';

describe('inferLeagueDay', () => {
  it('finds the weekday a league bowls on from its sessions', () => {
    const sessions = [
      { league: 'Thu', date: '2026-09-03' }, { league: 'Thu', date: '2026-09-10' }, { league: 'Thu', date: '2026-09-17' },
    ];
    expect(inferLeagueDay(sessions, 'Thu')).toBe(4);
  });

  it('refuses to guess without a clear majority', () => {
    // A league split across two nights must not get a reminder for the
    // wrong one -- null means "don't nag".
    const split = [
      { league: 'X', date: '2026-09-01' }, { league: 'X', date: '2026-09-03' },
      { league: 'X', date: '2026-09-08' }, { league: 'X', date: '2026-09-10' },
    ];
    expect(inferLeagueDay(split, 'X')).toBeNull();
  });

  it('needs a minimum number of sessions', () => {
    expect(inferLeagueDay([{ league: 'Y', date: '2026-09-03' }], 'Y')).toBeNull();
  });
});

describe('normalizeReminder', () => {
  it('rejects an impossible weekday', () => {
    expect(normalizeReminder({ day: 9 })).toBeNull();
  });

  it('defaults a malformed time', () => {
    expect(normalizeReminder({ day: 4, time: 'bad' }).time).toBe('19:00');
  });
});

describe('reminderToIcs', () => {
  const r = reminderSpec('Thursday House Shot', 4, 60, '19:00');

  it('recurs weekly on the right day with an alarm', () => {
    const ics = reminderToIcs(r, 'Arsenal Bowl');
    expect(ics).toContain('RRULE:FREQ=WEEKLY;BYDAY=TH');
    expect(ics).toContain('TRIGGER:-PT60M');
  });

  it('escapes commas in the location so the file stays valid', () => {
    expect(reminderToIcs(r, 'Bowl, Inc')).toContain('Bowl\\, Inc');
  });
});

describe('reminderToGoogleCalendarUrl', () => {
  // Monday 21 Sep 2026, 01:00 local
  const now = new Date(2026, 8, 21, 1, 0, 0);
  const parse = u => new URL(u).searchParams;
  it('points at Google Calendar add-event with a weekly rule on the league night', () => {
    const u = reminderToGoogleCalendarUrl(reminderSpec('Thursday Mixed', 4), 'Plaza Lanes', now);
    expect(u.startsWith('https://calendar.google.com/calendar/render?')).toBe(true);
    const q = parse(u);
    expect(q.get('action')).toBe('TEMPLATE');
    expect(q.get('text')).toBe('Thursday Mixed bowling');
    expect(q.get('recur')).toBe('RRULE:FREQ=WEEKLY;BYDAY=TH');
    expect(q.get('location')).toBe('Plaza Lanes');
  });
  it('starts on the next occurrence at 7pm, three hours long, floating time', () => {
    const q = parse(reminderToGoogleCalendarUrl(reminderSpec('Thursday Mixed', 4), '', now));
    expect(q.get('dates')).toBe('20260924T190000/20260924T220000');
    expect(q.get('location')).toBeNull();
  });
  it('today counts as the next occurrence', () => {
    const q = parse(reminderToGoogleCalendarUrl(reminderSpec('Monday Men', 1), '', now));
    expect(q.get('dates').slice(0, 8)).toBe('20260921');
  });
  it('drops House Shot from the title', () => {
    expect(parse(reminderToGoogleCalendarUrl(reminderSpec('Tues House Shot', 2), '', now)).get('text')).toBe('Tues bowling');
  });
  it('refuses a reminder with no league or a bad day', () => {
    expect(reminderToGoogleCalendarUrl(reminderSpec('', 2), '', now)).toBeNull();
    expect(reminderToGoogleCalendarUrl({ league: 'X', day: 9 }, '', now)).toBeNull();
    expect(reminderToGoogleCalendarUrl(null)).toBeNull();
  });
});
