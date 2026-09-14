import { describe, it, expect } from 'vitest';
import {
  journeyMilestones,
  describeMilestone,
  journeyProgress,
  nextMilestone,
  bandedJourney,
} from './journey.js';

const night = (date, scores) => ({ bowler: 'R', league: 'T', date, scores });
const ids = ms => ms.map(m => m.id);

describe('the journey is a timeline', () => {
  // It used to be a ladder of targets in difficulty order, which reads
  // as a goal progression and tells a bowler who is nowhere near the
  // next target that they are behind. This is a history instead.
  it('lists only what happened, plus one step ahead', () => {
    const ms = journeyMilestones([night('2026-09-01', [62])], []);
    expect(ms.filter(m => m.state === 'earned').length).toBeGreaterThan(0);
    expect(ms.filter(m => m.state !== 'earned')).toHaveLength(1);
  });

  it('dates every earned milestone', () => {
    const ms = journeyMilestones([night('2026-09-01', [105])], []);
    for (const m of ms.filter(x => x.state === 'earned')) {
      expect(m.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  // A timeline that reorders itself is not a timeline.
  it('orders by date, not by difficulty', () => {
    const ms = journeyMilestones([
      night('2025-09-01', [180, 195, 210]),
      night('2026-01-01', [220, 215, 230]),
    ], []);
    const dates = ms.filter(m => m.state === 'earned').map(m => m.date);
    expect([...dates]).toEqual([...dates].sort());
  });

  // A child's first spare and a scratch bowler's 300 are both on the
  // catalogue; an app that starts its history at 200 tells a beginner
  // their first season did not count.
  it('gives a brand new bowler something already earned', () => {
    const ms = journeyMilestones([night('2026-09-01', [62])], []);
    expect(ids(ms)).toContain('nights-1');
    expect(ids(ms)).toContain('game-50');
  });

  it('reaches the top end for a scratch bowler', () => {
    const ms = journeyMilestones([night('2026-09-01', [300, 280, 260])], []);
    expect(ids(ms)).toContain('game-300');
    expect(ids(ms)).toContain('series-800');
  });

  // The opposite of a wall of locked achievements.
  it('offers exactly one next step', () => {
    const ms = journeyMilestones([night('2026-09-01', [105])], []);
    const next = nextMilestone(ms);
    expect(next).toBeTruthy();
    expect(next.state).not.toBe('earned');
  });

  it('starts an empty journey at the first night', () => {
    const ms = journeyMilestones([], []);
    expect(ms).toHaveLength(1);
    expect(ms[0].id).toBe('nights-1');
    expect(describeMilestone(ms[0])).toBe('0 of 1');
  });

  it('counts a tournament and a cash', () => {
    const events = [{ name: 'City Open', winnings: '120', days: [{ date: '2026-03-07' }] }];
    const ms = journeyMilestones([night('2026-03-07', [200, 190, 180])], events);
    expect(ids(ms)).toContain('tourney-first');
    expect(ids(ms)).toContain('tourney-cash');
  });

  it('does not cash an event that won nothing', () => {
    const events = [{ name: 'City Open', winnings: '0', days: [{ date: '2026-03-07' }] }];
    const ms = journeyMilestones([night('2026-03-07', [200])], events);
    expect(ids(ms)).not.toContain('tourney-cash');
  });

  it('describes progress toward a count', () => {
    const ms = journeyMilestones([night('2026-09-01', [105])], []);
    expect(describeMilestone(nextMilestone(ms))).toMatch(/of/);
  });

  it('reports progress', () => {
    const ms = journeyMilestones([night('2026-09-01', [105])], []);
    const { earned, total } = journeyProgress(ms);
    expect(earned).toBeGreaterThan(0);
    expect(total).toBeGreaterThanOrEqual(earned);
  });

  it('survives junk', () => {
    for (const j of [null, undefined, 'x', 42, [null], [{}]]) {
      expect(() => journeyMilestones(j, j)).not.toThrow();
      expect(() => journeyProgress(j)).not.toThrow();
      expect(() => nextMilestone(j)).not.toThrow();
      expect(() => describeMilestone(j)).not.toThrow();
    }
  });
});

describe('frame-level milestones', () => {
  const sh = (date, game, frame, extra) =>
    ({ bowler: 'R', league: 'T', date, game: String(game), frame: String(frame), ...extra });
  const X = { result: 'Strike' };

  // A first strike and a first spare are the two biggest moments a new
  // bowler has, and neither shows up in a score.
  it('finds a first strike and a first spare', () => {
    const shots = [sh('2026-01-05', 1, 1, X),
                   sh('2026-02-01', 1, 1, { result: 'Other Leave', spareMade: 'Yes' })];
    const ms = journeyMilestones([night('2026-01-05', [120])], [], shots);
    expect(ids(ms)).toContain('first-strike');
    expect(ids(ms)).toContain('first-spare');
  });

  it('dates a turkey to the night it happened', () => {
    const shots = [sh('2026-01-05', 1, 1, X), sh('2026-01-05', 1, 2, X), sh('2026-01-05', 1, 3, X)];
    const ms = journeyMilestones([night('2026-01-05', [150])], [], shots);
    const turkey = ms.find(m => m.id === 'first-turkey');
    expect(turkey.date).toBe('2026-01-05');
  });

  // The tenth of one game and the first of the next are not consecutive
  // frames in any sense a bowler means.
  it('does not run a streak across games', () => {
    const shots = [sh('2026-01-05', 1, 9, X), sh('2026-01-05', 1, 10, X),
                   sh('2026-01-05', 2, 1, X)];
    expect(ids(journeyMilestones([night('2026-01-05', [150])], [], shots)))
      .not.toContain('first-turkey');
  });

  it('needs no shots to work', () => {
    expect(() => journeyMilestones([night('2026-01-05', [150])], [], [])).not.toThrow();
  });
});

describe('folding away milestones a bowler is past', () => {
  const many = [];
  for (let i = 0; i < 12; i++) many.push(night(`2025-0${(i % 9) + 1}-01`, [200, 205, 195]));
  const ms = journeyMilestones(many, [], []);

  // A new bowler should see their whole road.
  it('folds nothing without an average', () => {
    expect(bandedJourney(ms, 0).bands).toHaveLength(0);
  });

  it('folds nothing for a beginner', () => {
    expect(bandedJourney(ms, 95).bands).toHaveLength(0);
  });

  it('folds the low bands for a 200 bowler', () => {
    const { open, bands } = bandedJourney(ms, 200);
    expect(bands.length).toBeGreaterThan(2);
    expect(open.length).toBeLessThan(ms.length);
  });

  // Folding the ground they are standing on is how a feature starts
  // feeling like it is hiding things.
  it('does not fold the band a bowler is living in', () => {
    expect(bandedJourney(ms, 182).bands.some(b => b.ceiling === 180)).toBe(false);
  });

  it('keeps the next step in view', () => {
    const { open } = bandedJourney(ms, 200);
    expect(open.some(m => m.state !== 'earned')).toBe(true);
  });

  it('loses nothing', () => {
    const { open, bands } = bandedJourney(ms, 200);
    const total = open.length + bands.reduce((n, b) => n + b.milestones.length, 0);
    expect(total).toBe(ms.length);
  });

  it('orders bands nearest first', () => {
    const ceilings = bandedJourney(ms, 200).bands.map(b => b.ceiling);
    expect(ceilings).toEqual([...ceilings].sort((a, b) => b - a));
  });

  it('survives junk', () => {
    for (const j of [null, undefined, 'x', 42, [null]]) {
      expect(() => bandedJourney(j, j)).not.toThrow();
    }
  });
});
