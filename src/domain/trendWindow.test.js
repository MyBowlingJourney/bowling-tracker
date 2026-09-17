import { describe, it, expect } from 'vitest';
import {
  TREND_WINDOW_MODE_IDS, defaultTrendWindow, normalizeTrendWindow,
  applyTrendWindow, describeTrendWindow,
} from './trendWindow.js';

const pts = Array.from({ length: 40 }, (_, i) => ({
  date: new Date(Date.UTC(2026, 0, 1 + i * 7)).toISOString().slice(0, 10),
  value: 200 + i,
}));
const LAST = pts[pts.length - 1].date;

describe('how far back a trend reaches', () => {
  it('offers the four modes', () => {
    expect(TREND_WINDOW_MODE_IDS).toEqual(['all', 'games', 'days', 'range']);
  });

  it('shows everything by default', () => {
    expect(applyTrendWindow(pts, defaultTrendWindow(), { today: LAST })).toHaveLength(40);
  });

  // "My last 20" means the most recent 20, counted from the end.
  it('takes the last N games from the end', () => {
    const out = applyTrendWindow(pts, { mode: 'games', games: 10 }, { today: LAST });
    expect(out).toHaveLength(10);
    expect(out[out.length - 1].date).toBe(LAST);
  });

  it('does not fail when asked for more games than exist', () => {
    expect(applyTrendWindow(pts, { mode: 'games', games: 500 }, { today: LAST })).toHaveLength(40);
  });

  // Inclusive: "last 30 days" includes the night 30 days ago.
  it('includes the boundary day', () => {
    const cutoff = new Date(Date.parse(`${LAST}T00:00:00Z`) - 30 * 86400000)
      .toISOString().slice(0, 10);
    const out = applyTrendWindow([{ date: cutoff }], { mode: 'days', days: 30 }, { today: LAST });
    expect(out).toHaveLength(1);
  });

  it('measures days from the latest point when no today is given', () => {
    const out = applyTrendWindow(pts, { mode: 'days', days: 90 });
    expect(out.length).toBeGreaterThan(0);
    expect(out[out.length - 1].date).toBe(LAST);
  });

  it('filters a two-ended range', () => {
    const out = applyTrendWindow(pts,
      { mode: 'range', from: '2026-03-01', to: '2026-05-01' }, { today: LAST });
    expect(out.every(p => p.date >= '2026-03-01' && p.date <= '2026-05-01')).toBe(true);
  });

  // One bound is still useful: everything since a date, or up to one.
  it('accepts a range with only one end', () => {
    const after = applyTrendWindow(pts, { mode: 'range', from: '2026-06-01' }, { today: LAST });
    expect(after.every(p => p.date >= '2026-06-01')).toBe(true);
    const before = applyTrendWindow(pts, { mode: 'range', to: '2026-02-01' }, { today: LAST });
    expect(before.every(p => p.date <= '2026-02-01')).toBe(true);
  });

  it('shows everything for an empty range', () => {
    expect(applyTrendWindow(pts, { mode: 'range' }, { today: LAST })).toHaveLength(40);
  });

  it('falls back to sane values for nonsense', () => {
    const w = normalizeTrendWindow({ mode: 'sideways', games: -4, days: 'x' });
    expect(w.mode).toBe('all');
    expect(w.games).toBeGreaterThan(0);
    expect(w.days).toBeGreaterThan(0);
  });

  // A bowler looking at eight points needs to know whether that is all
  // they have or all the window allowed.
  it('says what was left out', () => {
    expect(describeTrendWindow({ mode: 'games', games: 10 }, 10, 40)).toContain('of 40');
    expect(describeTrendWindow({ mode: 'all' }, 40, 40)).toBe('40 of 40');
  });

  it('survives junk', () => {
    for (const j of [null, undefined, 'x', 42, {}]) {
      expect(() => applyTrendWindow(j, j, j)).not.toThrow();
      expect(() => describeTrendWindow(j, j, j)).not.toThrow();
      expect(() => normalizeTrendWindow(j)).not.toThrow();
    }
  });
});
