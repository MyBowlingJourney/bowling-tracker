import { describe, it, expect } from 'vitest';
import {
  journeyMilestones, nextMilestone, journeyProgress, describeMilestone,
} from './journey.js';

const SESSIONS = [
  { date: '2024-11-05', scores: [212, 180, 190] },   // 582 series, 212 game
  { date: '2025-01-14', scores: [200, 210, 208] },   // 618 series
  { date: '2026-09-01', scores: [246, 220, 216] },   // 682 series, 246 game
];
const find = (ms, id) => ms.find(m => m.id === id);

describe('what the journey knows', () => {
  const ms = journeyMilestones(SESSIONS, [{ name: 'City Open', winnings: '75' }]);

  it('earns a milestone the bowler passed', () => {
    expect(find(ms, 'game-200').state).toBe('earned');
    expect(find(ms, 'series-600').state).toBe('earned');
  });

  // The date it FIRST happened, not the most recent night above it.
  it('dates an earned milestone from when it first happened', () => {
    expect(find(ms, 'game-200').date).toBe('2024-11-05');
  });

  // The line the whole feature exists for.
  it('says how far off the next one is', () => {
    const m = find(ms, 'series-700');
    expect(m.state).toBe('reach');
    expect(describeMilestone(m)).toBe('18 pins away');
  });

  it('locks what is a long way off', () => {
    expect(find(ms, 'game-300').state).toBe('locked');
    expect(find(ms, 'series-800').state).toBe('locked');
  });

  // Nearest by POSITION, not by smallest gap -- a 290 game must not skip
  // the bowler past everything to the 300.
  it('picks the next step by order, not by gap', () => {
    expect(nextMilestone(ms).id).toBe('game-250');
  });

  it('counts progress', () => {
    const { earned, total } = journeyProgress(ms);
    expect(total).toBe(ms.length);
    expect(earned).toBeGreaterThan(0);
  });

  it('counts tournaments played and cashed', () => {
    expect(find(ms, 'tourney-first').state).toBe('earned');
    expect(find(ms, 'tourney-cash').state).toBe('earned');
  });

  it('does not cash an event that won nothing', () => {
    const none = journeyMilestones(SESSIONS, [{ name: 'City Open' }]);
    expect(find(none, 'tourney-cash').state).not.toBe('earned');
  });
});

describe('a series needs three games', () => {
  // A single 246 is a good game, not a 246 series.
  it('ignores a one-game night for series milestones', () => {
    const ms = journeyMilestones([{ date: '2026-09-01', scores: [246] }], []);
    expect(find(ms, 'series-500').state).not.toBe('earned');
    expect(find(ms, 'game-200').state).toBe('earned');
  });
});

describe('a bowler with no history', () => {
  const ms = journeyMilestones([], []);

  it('locks every scoring milestone', () => {
    expect(ms.filter(m => m.kind !== 'count').every(m => m.state === 'locked')).toBe(true);
  });

  // "Bowl a tournament" is one action away for anybody, which is exactly
  // the nudge a new bowler should see -- not a locked door.
  it('shows bowling a first tournament as in reach', () => {
    expect(find(ms, 'tourney-first').state).toBe('reach');
  });

  it('starts them at the first step', () => {
    expect(nextMilestone(ms).id).toBe('game-200');
  });

  it('says "Not yet" rather than a fake gap', () => {
    expect(describeMilestone(find(ms, 'game-200'))).toBe('Not yet');
  });

  it('survives junk', () => {
    for (const j of [null, undefined, 'x', 42, [null], [{}]]) {
      expect(() => journeyMilestones(j, j)).not.toThrow();
      expect(() => nextMilestone(j)).not.toThrow();
      expect(() => journeyProgress(j)).not.toThrow();
      expect(() => describeMilestone(j)).not.toThrow();
    }
    expect(describeMilestone(null)).toBe('');
  });
});
