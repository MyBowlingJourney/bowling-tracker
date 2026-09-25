import { describe, it, expect } from 'vitest';
import { proLosses, trialHeadline } from './proTrial.js';
import {
  withProTrial, onProTrial, proTrialDaysLeft, proTrialEnded, isSubscriber, hasPaidSubscription,
  featureUnlocked, ENTITLEMENT_UNKNOWN, PRO_TRIAL_DAYS,
} from './entitlements.js';

const NOW = Date.parse('2026-09-25T12:00:00Z');
const daysAgo = d => new Date(NOW - d * 86_400_000).toISOString();

describe('the 60-day reverse trial', () => {
  it('unlocks a new account with no entitlement row, and counts down', () => {
    const e = withProTrial(null, daysAgo(10));
    expect(onProTrial(e, NOW)).toBe(true);
    expect(isSubscriber(e, NOW)).toBe(true);
    expect(featureUnlocked(e, { now: NOW })).toBe(true);
    expect(hasPaidSubscription(e, NOW)).toBe(false); // they can still buy
    expect(proTrialDaysLeft(e, NOW)).toBe(PRO_TRIAL_DAYS - 10);
    expect(proTrialEnded(e, NOW)).toBe(false);
  });
  it('locks an account past 60 days and marks the trial ended', () => {
    const e = withProTrial(null, daysAgo(61));
    expect(featureUnlocked(e, { now: NOW })).toBe(false);
    expect(proTrialEnded(e, NOW)).toBe(true);
  });
  it('never asks a subscriber or a test account', () => {
    const paid = withProTrial({ plan: 'plus', status: 'active', current_period_end: daysAgo(-20) }, daysAgo(90));
    expect(proTrialEnded(paid, NOW)).toBe(false);
    const test = withProTrial({ is_test_account: true }, daysAgo(90));
    expect(proTrialEnded(test, NOW)).toBe(false);
  });
  it('leaves unknown alone and grants nothing on an unreadable date', () => {
    expect(withProTrial(ENTITLEMENT_UNKNOWN, daysAgo(1))).toBe(ENTITLEMENT_UNKNOWN);
    expect(withProTrial(null, 'garbage')).toBeNull();
    expect(featureUnlocked(withProTrial(null, undefined), { now: NOW })).toBe(false);
  });
});

describe('proLosses', () => {
  it('lists only what they used, with their numbers', () => {
    const l = proLosses({
      leagues: ['Tue', 'Thu', 'Practice'], teams: 1, bags: [{ bagType: 'league' }, { bagType: 'league' }, { bagType: 'tournament' }],
      usage: { nightcap: 8, genie: 0, caddie: 1 }, ballFirstBalls: { A: 40, B: 12, C: 3 }, teammates: 3,
    });
    const ids = l.map(x => x.id);
    expect(ids).toEqual(['leagues', 'ballCompare', 'nightcap', 'caddie', 'bags', 'headToHead']);
    expect(l[0].title).toBe('All 2 of your leagues');
    expect(l.find(x => x.id === 'nightcap').detail).toContain("poured 8");
    expect(l.find(x => x.id === 'bags').title).toBe('All 3 of your bags');
  });
  it('is empty for someone who used nothing Pro', () => {
    expect(proLosses({ leagues: ['Tue'], teams: 1, bags: [{ bagType: 'league' }], usage: {} })).toEqual([]);
  });
});

describe('trialHeadline', () => {
  it('leads with their most-used ball', () => {
    const h = trialHeadline({ topBall: { ball: 'Storm Ion Max', games: 12 } }, '$4.99');
    expect(h.title).toBe("You've logged 12 games with your Storm Ion Max!");
    expect(h.body).toContain('$4.99/month');
  });
  it('falls back to Nightcaps, then leagues, then games', () => {
    expect(trialHeadline({ usage: { nightcap: 5 } }).title).toBe("You've poured 5 Nightcaps!");
    expect(trialHeadline({ leagues: ['A', 'B'] }).title).toBe("You're tracking 2 leagues!");
    expect(trialHeadline({ games: 30 }).title).toContain('30 games');
    expect(trialHeadline({}).title).toBe('Your 60 days of Pro are up.');
  });
});
