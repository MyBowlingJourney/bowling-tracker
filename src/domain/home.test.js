import { describe, it, expect } from 'vitest';
import { sessionIsLive, seasonFigures, journeyRecap, latestNight, activeSeasonWindow } from './home.js';

const night = (date, scores) => ({ bowler: 'R', league: 'Tuesday', date, scores });

describe('what home says', () => {
  const sessions = [
    night('2026-09-01', [218, 201, 226]),
    night('2026-09-08', [190, 205, 240]),
    night('2026-08-01', [300, 200, 200]),
  ];

  // Season-scoped on purpose: a high game from four years ago is a
  // memory, not a standard to measure tonight against. All-time belongs
  // on Journey, where it is a milestone.
  it('scopes the figures to the season', () => {
    const f = seasonFigures(sessions, { bowler: 'R', leagues: ['Tuesday'], since: '2026-09-01' });
    expect(f.highGame).toBe(240);
    expect(f.games).toBe(6);
  });

  it('includes everything without a start date', () => {
    expect(seasonFigures(sessions, { bowler: 'R' }).highGame).toBe(300);
  });

  // A two-game night would otherwise look like a poor three-game series.
  it('only counts a full night as a series', () => {
    const f = seasonFigures([night('2026-09-01', [200, 200])], { bowler: 'R' });
    expect(f.highSeries).toBe(null);
    expect(f.average).toBe(200);
  });

  // A zero average reads as terrible bowling; a blank reads as a new
  // season.
  it('returns blanks, not zeroes, with no games', () => {
    const f = seasonFigures([], { bowler: 'R' });
    expect(f.average).toBe(null);
    expect(f.highGame).toBe(null);
    expect(f.highSeries).toBe(null);
  });

  it('ignores another bowler', () => {
    const theirs = [{ ...night('2026-09-01', [300, 300, 300]), bowler: 'Maggie' }];
    expect(seasonFigures(theirs, { bowler: 'R' }).average).toBe(null);
  });

  it('ignores leagues outside the scope', () => {
    const other = [{ ...night('2026-09-01', [300, 300, 300]), league: 'Practice\u00b7u1' }];
    expect(seasonFigures(other, { bowler: 'R', leagues: ['Tuesday'] }).average).toBe(null);
  });

  // Home becomes the scoring screen while a night is live, so this
  // decides which of two entirely different screens appears on launch.
  it('sees a night that has shots today', () => {
    const shots = [{ bowler: 'R', league: 'Tuesday', date: '2026-09-15', frame: '1' }];
    expect(sessionIsLive(shots, { bowler: 'R', league: 'Tuesday', date: '2026-09-15' })).toBe(true);
  });

  it('does not see yesterday as live', () => {
    const shots = [{ bowler: 'R', league: 'Tuesday', date: '2026-09-14', frame: '1' }];
    expect(sessionIsLive(shots, { bowler: 'R', league: 'Tuesday', date: '2026-09-15' })).toBe(false);
  });

  it('needs a bowler, a league and a date', () => {
    const shots = [{ bowler: 'R', league: 'Tuesday', date: '2026-09-15' }];
    expect(sessionIsLive(shots, { bowler: 'R', league: '', date: '2026-09-15' })).toBe(false);
    expect(sessionIsLive(shots, {})).toBe(false);
  });

  // The most recent thing earned, not the next target -- a recap that
  // asks for something is a demand, not a recap.
  it('recaps the latest milestone', () => {
    const r = journeyRecap([
      { state: 'earned', label: 'First 600 series', date: '2026-03-22' },
      { state: 'earned', label: 'First 200 game', date: '2025-01-10' },
    ]);
    expect(r.label).toBe('First 600 series');
    expect(r.total).toBe(2);
  });

  it('has no recap before the first milestone', () => {
    expect(journeyRecap([])).toBe(null);
  });

  it('survives junk', () => {
    for (const j of [null, undefined, 'x', 42, [null]]) {
      expect(() => seasonFigures(j, j)).not.toThrow();
      expect(() => sessionIsLive(j, j)).not.toThrow();
      expect(() => journeyRecap(j)).not.toThrow();
    }
  });
});

describe('what counts toward a season figure', () => {
  const night = (league, date, scores) => ({ bowler: 'R', league, date, scores });

  // These are the numbers a bowler quotes -- their average, their high
  // game -- and those mean league play. A practice night spent working
  // the 10 pin scores 120s by design.
  it('ignores practice', () => {
    const f = seasonFigures([
      night('Tuesday', 'd1', [210, 200, 220]),
      night('Practice\u00b7u1', 'd2', [120, 130, 140]),
    ], { bowler: 'R' });
    expect(f.games).toBe(3);
    expect(f.average).toBe(210);
  });

  // The classifier misses a bare "Practice", which is why the calendar
  // checks for it separately.
  it('ignores a bare "Practice" league too', () => {
    const f = seasonFigures([
      night('Tuesday', 'd1', [210, 200, 220]),
      night('Practice', 'd2', [110, 115, 120]),
    ], { bowler: 'R' });
    expect(f.games).toBe(3);
  });

  it('ignores open bowling', () => {
    const f = seasonFigures([
      night('Tuesday', 'd1', [210, 200, 220]),
      night('Just Bowling\u00b7u1', 'd2', [90, 95, 100]),
    ], { bowler: 'R' });
    expect(f.games).toBe(3);
  });

  // Tournaments are real competition and belong in the figures.
  it('keeps tournaments', () => {
    const f = seasonFigures([
      night('Tuesday', 'd1', [200, 200, 200]),
      night('City Championship', 'd2', [230, 240, 250]),
    ], { bowler: 'R' });
    expect(f.games).toBe(6);
    expect(f.highGame).toBe(250);
  });

  it('has nothing to show from practice alone', () => {
    const f = seasonFigures([night('Practice\u00b7u1', 'd1', [120, 130, 140])], { bowler: 'R' });
    expect(f.average).toBe(null);
    expect(f.games).toBe(0);
  });
});

describe('latestNight', () => {
  const s = (league, date, scores = [200, 210, 190], bowler = 'R') => ({ bowler, league, date, scores });
  const t = (name, dates, bowler = 'R') => ({ name, bowler,
    days: dates.map(date => ({ date, games: [{ score: 220 }, { score: 180 }] })) });

  it('is null with nothing logged', () => {
    expect(latestNight([], [], { bowler: 'R' })).toBe(null);
    expect(latestNight(null, undefined, {})).toBe(null);
  });

  it('picks the newest league night, with its average', () => {
    const n = latestNight([s('Tuesday', '2026-09-08'), s('Thursday', '2026-09-17', [210, 200, 214])], [], { bowler: 'R' });
    expect(n).toMatchObject({ kind: 'league', league: 'Thursday', date: '2026-09-17', average: 208 });
  });

  it('marks practice as practice', () => {
    expect(latestNight([s('Practice', '2026-09-20')], [], { bowler: 'R' }).kind).toBe('practice');
  });

  it('skips open bowling, even when it is newest', () => {
    const n = latestNight([s('Tuesday', '2026-09-15'), s('Just Bowling', '2026-09-20')], [], { bowler: 'R' });
    expect(n.league).toBe('Tuesday');
  });

  it('includes tournament days and hands back the tournament', () => {
    const ev = t('Fall Classic', ['2026-09-19', '2026-09-20']);
    const n = latestNight([s('Tuesday', '2026-09-15')], [ev], { bowler: 'R' });
    expect(n).toMatchObject({ kind: 'tournament', league: 'Fall Classic', date: '2026-09-20', average: 200 });
    expect(n.tournament).toBe(ev);
  });

  it('prefers the tournament on a shared date', () => {
    const n = latestNight([s('Tuesday', '2026-09-20')], [t('Fall Classic', ['2026-09-20'])], { bowler: 'R' });
    expect(n.kind).toBe('tournament');
  });

  it("ignores other bowlers' nights", () => {
    const n = latestNight([s('Tuesday', '2026-09-20', [200], 'Guest'), s('Tuesday', '2026-09-10')], [], { bowler: 'R' });
    expect(n.date).toBe('2026-09-10');
  });
});

// ── Season window and record ties ───────────────────────────────────────
describe('seasonFigures: season window', () => {
  const S = (date, scores) => ({ bowler: 'Ryan', league: 'Thursday', date, scores });
  const sessions = [
    S('2025-10-02', [200, 210, 190]),   // last season
    S('2026-09-10', [279, 180, 170]),   // this season
    S('2026-09-17', [279, 190, 200]),
  ];

  it('without a window, counts every night -- the behaviour that made "this season" a lie', () => {
    expect(seasonFigures(sessions, { bowler: 'Ryan' }).games).toBe(9);
  });

  it('since and until scope the figures to one season', () => {
    const f = seasonFigures(sessions, { bowler: 'Ryan', since: '2026-09-01', until: '2026-12-31' });
    expect(f.games).toBe(6);
    expect(f.nights).toBe(2);
  });

  it('until alone closes a finished season', () => {
    const f = seasonFigures(sessions, { bowler: 'Ryan', until: '2025-12-31' });
    expect(f.games).toBe(3);
    expect(f.highGame).toBe(210);
  });
});

describe('seasonFigures: record ties', () => {
  const S = (date, scores) => ({ bowler: 'Ryan', league: 'Thursday', date, scores });

  it('counts how many times the top game has been matched', () => {
    const f = seasonFigures([S('2026-09-10', [279, 180, 170]), S('2026-09-17', [279, 190, 200])], { bowler: 'Ryan' });
    expect(f.highGame).toBe(279);
    expect(f.highGameCount).toBe(2);
  });

  it('a new record resets the count rather than adding to it', () => {
    const f = seasonFigures([S('2026-09-10', [279, 279, 170]), S('2026-09-17', [280, 190, 200])], { bowler: 'Ryan' });
    expect(f.highGame).toBe(280);
    expect(f.highGameCount).toBe(1);
  });

  it('counts series ties over full nights only', () => {
    const f = seasonFigures([
      S('2026-09-10', [240, 240, 240]),
      S('2026-09-17', [240, 240, 240]),
      S('2026-09-24', [300, 300]),        // two games: not a series
    ], { bowler: 'Ryan' });
    expect(f.highSeries).toBe(720);
    expect(f.highSeriesCount).toBe(2);
  });

  it('reports zero counts when there is nothing logged', () => {
    const f = seasonFigures([], { bowler: 'Ryan' });
    expect(f.highGameCount).toBe(0);
    expect(f.highSeriesCount).toBe(0);
  });
});

describe('activeSeasonWindow', () => {
  const dates = { Thursday: { startDate: '2026-09-01', endDate: '2027-04-30' } };

  it('is in season inside the window', () => {
    const w = activeSeasonWindow(dates, { today: '2026-09-23' });
    expect(w.inSeason).toBe(true);
    expect(w.since).toBe('2026-09-01');
  });

  it('is out of season after the end date', () => {
    expect(activeSeasonWindow(dates, { today: '2026-06-15' }).inSeason).toBe(false);
  });

  it('is out of season before it starts', () => {
    expect(activeSeasonWindow(dates, { today: '2026-08-15' }).inSeason).toBe(false);
  });

  it('reports "not configured" when no league has dates, so the card can say career rather than lie', () => {
    const w = activeSeasonWindow({}, { today: '2026-09-23' });
    expect(w.inSeason).toBe(false);
    expect(w.configured).toBe(false);
  });

  it('takes the earliest start when two leagues are both running', () => {
    const w = activeSeasonWindow({
      Thursday: { startDate: '2026-09-01', endDate: '2027-04-30' },
      Sunday: { startDate: '2026-08-15', endDate: '2027-03-30' },
    }, { today: '2026-09-23' });
    expect(w.inSeason).toBe(true);
    expect(w.since).toBe('2026-08-15');
    expect(w.label).toBe('2 leagues');
  });

  it('ignores leagues this bowler does not play', () => {
    const w = activeSeasonWindow({
      Thursday: { startDate: '2026-09-01', endDate: '2027-04-30' },
      Other: { startDate: '2026-08-01', endDate: '2027-03-30' },
    }, { today: '2026-09-23', leagues: ['Thursday'] });
    expect(w.since).toBe('2026-09-01');
    expect(w.label).toBe('Thursday');
  });
});

describe('seasonFigures: 9-pin no-tap leagues', () => {
  const nights = [
    { bowler: 'Ryan', league: 'Tuesday Classic', date: '2026-09-01', scores: [279, 240, 229] },
    { bowler: 'Ryan', league: 'No Tap Night', date: '2026-09-02', scores: [300, 290, 280] },
  ];

  // A no-tap 300 is not a 300.
  it('keeps no-tap games out of high game and high series', () => {
    const f = seasonFigures(nights, { bowler: 'Ryan', noTapLeagues: ['No Tap Night'] });
    expect(f.highGame).toBe(279);
    expect(f.highSeries).toBe(748);
  });

  it('still counts them in the league average', () => {
    const f = seasonFigures(nights, { bowler: 'Ryan', noTapLeagues: ['No Tap Night'] });
    expect(f.games).toBe(6);
    expect(f.average).toBe(269.6);
  });

  it('treats every league as ten-pin when no formats are given', () => {
    const f = seasonFigures(nights, { bowler: 'Ryan' });
    expect(f.highGame).toBe(300);
  });
});
