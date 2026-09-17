import { describe, it, expect } from 'vitest';
import { allCompetitiveBadges, competitiveBadges, practiceBadges } from './badgeContext.js';

const night = (date, scores = [200, 200, 200]) =>
  ({ bowler: 'R', league: 'Tuesday', date, scores });
const args = sessions =>
  ({ sessions, shots: [], matches: [], drills: [], teams: [], leagueDates: {}, bowler: 'R' });

describe('competitive badge history', () => {
  // This module had no test file, and it drives the badge count on Home
  // and every date on the Journey card.
  it('earns the first-night badge once', () => {
    const h = allCompetitiveBadges(args([night('2026-09-01'), night('2026-09-08')]));
    expect(h['league-first-night'].count).toBe(1);
  });

  // It was stamped with the most recent night, so the Journey card told a
  // bowler their first league night was today -- every week.
  it('dates the first night to the FIRST night', () => {
    const h = allCompetitiveBadges(args([
      night('2026-09-01'), night('2026-09-08'), night('2026-09-15'),
    ]));
    expect(h['league-first-night'].lastDate).toBe('2026-09-01');
  });

  it('is unmoved by the order the nights arrive in', () => {
    const h = allCompetitiveBadges(args([
      night('2026-09-15'), night('2026-09-01'), night('2026-09-08'),
    ]));
    expect(h['league-first-night'].lastDate).toBe('2026-09-01');
  });

  it('earns nothing from no nights', () => {
    const h = allCompetitiveBadges(args([]));
    expect(Object.values(h).filter(r => r && r.count)).toHaveLength(0);
  });

  it('stays on one bowler', () => {
    const h = allCompetitiveBadges(args([{ ...night('2026-09-01'), bowler: 'Maggie' }]));
    expect(h['league-first-night'].count).toBe(0);
  });

  it('survives junk', () => {
    for (const j of [null, undefined, 'x', 42, []]) {
      expect(() => allCompetitiveBadges(j)).not.toThrow();
      expect(() => competitiveBadges(j)).not.toThrow();
      expect(() => practiceBadges(j)).not.toThrow();
    }
  });
});
