import { describe, it, expect } from 'vitest';
import { rateSummary, headToHeadOpponents } from './headToHead.js';

const shot = (bowler, result, extra = {}) => ({ bowler, league: 'L', date: '2026-09-01', game: '1', frame: '1', result, spareMade: '', ...extra });

describe('headToHead', () => {
  it('lists teammates with frames in the league, most first, not you', () => {
    const shots = [shot('Me', 'Strike'), shot('A', 'Strike'), shot('B', 'Strike'), shot('B', 'Strike'), shot('C', 'Strike', { league: 'Other' })];
    expect(headToHeadOpponents(shots, 'L', 'Me').map(o => o.name)).toEqual(['B', 'A']);
  });
  it('summarises strike and spare rates', () => {
    const r = rateSummary([shot('A', 'Strike'), shot('A', '7', { spareMade: 'Yes', otherLeave: [3] }), shot('A', '8', { spareMade: 'No', otherLeave: [2, 4] })]);
    expect(r.strike).toBe(33);
    expect(r.shots).toBe(3);
  });
});
