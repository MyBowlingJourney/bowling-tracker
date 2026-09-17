import { describe, it, expect } from 'vitest';
import {
  STATS_GROUPS, STATS_GROUP_IDS, groupForCard, cardsInGroup, visibleGroups,
} from './statsGroups.js';
import { defaultPreferences, applyEnvironment } from './preferences.js';

const ORDER = applyEnvironment(defaultPreferences('league'), 'league').statsCardOrder;

describe('grouping the stats screen', () => {
  it('offers the five groups', () => {
    expect(STATS_GROUP_IDS).toEqual(['overview', 'trends', 'ball', 'game', 'center']);
  });

  // A card nobody filed should appear somewhere rather than vanish.
  it('falls unknown cards to Overview', () => {
    expect(groupForCard('somethingNew')).toBe('overview');
    expect(groupForCard('')).toBe('overview');
    expect(groupForCard(null)).toBe('overview');
  });

  it('files the obvious ones where they belong', () => {
    expect(groupForCard('byBall')).toBe('ball');
    expect(groupForCard('byCenter')).toBe('center');
    expect(groupForCard('gameByGame')).toBe('game');
    expect(groupForCard('runningAverages')).toBe('trends');
    expect(groupForCard('headlineStats')).toBe('overview');
  });

  // Every card lands in exactly one group: one missing is a card the
  // bowler can no longer reach, one in two is a card shown twice.
  it('places every card exactly once', () => {
    const seen = STATS_GROUP_IDS.flatMap(g => cardsInGroup(ORDER, g));
    expect(seen.slice().sort()).toEqual(ORDER.slice().sort());
    expect(new Set(seen).size).toBe(seen.length);
  });

  // A group is a filter over the order the bowler arranged in Settings,
  // not a second ordering to keep in step with it.
  it('keeps the bowler\'s own order within a group', () => {
    const custom = ['byCenter', 'byBall', 'rackType', 'ballChangeTriggers'];
    expect(cardsInGroup(custom, 'ball')).toEqual(['byBall', 'ballChangeTriggers']);
    expect(cardsInGroup(custom, 'center')).toEqual(['byCenter', 'rackType']);
  });

  // A chip leading to an empty screen reads as one that failed to load.
  it('hides a group whose cards did not render', () => {
    const groups = visibleGroups(ORDER, id => id === 'byBall');
    expect(groups.map(g => g.id)).toEqual(['ball']);
  });

  it('shows every group when everything rendered', () => {
    expect(visibleGroups(ORDER, () => true).map(g => g.id)).toEqual(STATS_GROUP_IDS);
  });

  it('shows nothing when nothing rendered', () => {
    expect(visibleGroups(ORDER, () => false)).toEqual([]);
  });

  it('survives junk', () => {
    for (const j of [null, undefined, 'x', 42, {}]) {
      expect(() => cardsInGroup(j, j)).not.toThrow();
      expect(() => visibleGroups(j, j)).not.toThrow();
      expect(() => groupForCard(j)).not.toThrow();
    }
  });
});
