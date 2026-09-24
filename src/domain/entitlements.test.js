import { describe, it, expect } from 'vitest';
import {
  isSubscriber, hasPaidSubscription, isTestAccount,
  ENTITLEMENT_UNKNOWN, isEntitlementKnown,
  isTrialing, shouldOfferAnnual, trialDaysLeft, featureUnlocked,
  canUseInsights, canUseGenie, canPourNightcap, canUseCoaching,
  canUseBracketsAndSidePots, canCompareToFriend, canImportScorecard,
  canSeeStatsCard, leagueLimit, teamLimit, allowedLeagues, lockedLeagues,
  PAID_STATS_CARDS, BILLING_LIVE, FREE_LEAGUE_LIMIT, ANNUAL_PROMPT_AFTER_DAYS,
} from './entitlements.js';

const NOW = Date.parse('2026-01-15T20:00:00Z');
const future = d => new Date(NOW + d * 86_400_000).toISOString();
const past = d => new Date(NOW - d * 86_400_000).toISOString();

const ent = over => ({ plan: 'plus', status: 'active', current_period_end: future(20), ...over });

// Every gate, so a new one cannot be added without appearing here.
const GATES = [
  ['canUseInsights', (e, o) => canUseInsights(e, o)],
  ['canUseGenie', (e, o) => canUseGenie(e, o)],
  ['canPourNightcap', (e, o) => canPourNightcap(e, o)],
  ['canUseCoaching', (e, o) => canUseCoaching(e, o)],
  ['canUseBracketsAndSidePots', (e, o) => canUseBracketsAndSidePots(e, o)],
  ['canCompareToFriend', (e, o) => canCompareToFriend(e, o)],
];

// Billing is ON as of the release that shipped Stripe. This test used to
// assert the switch was off and every gate open; it now asserts the
// opposite, and that flip was the point of the test -- it is a tripwire
// that fails loudly when somebody changes the switch, in either
// direction, so the change is always deliberate.
//
// A free bowler with no entitlement row is now GATED. That is the whole
// business model, and the thing to keep an eye on: the server half lives
// in the BILLING_LIVE secret on the Edge Functions, and if that is not
// also "true" the app hides features the backend still serves.
describe('the kill switch', () => {
  it('is on, so a free bowler is gated', () => {
    expect(BILLING_LIVE).toBe(true);
    for (const [name, gate] of GATES) {
      expect(`${name}:${gate(null)}`).toBe(`${name}:false`);
    }
    expect(canSeeStatsCard('headToHead', null)).toBe(false);
    expect(leagueLimit(null)).toBe(FREE_LEAGUE_LIMIT);
    expect(canImportScorecard(null)).toBe(false);
  });

  // The free tier is not nothing. Scores, averages, spares and ball
  // numbers stay free forever -- that is what the landing page and the
  // terms both promise, so a stats card that is not on the paid list
  // must still answer yes with billing live.
  it('leaves the free tier genuinely usable', () => {
    expect(canSeeStatsCard('someFreeCard', null)).toBe(true);
    expect(leagueLimit(null)).toBeGreaterThan(0);
  });

  it('gates everything for a free bowler once it is on', () => {
    const o = { now: NOW, billingLive: true };
    for (const [name, gate] of GATES) {
      expect(`${name}:${gate(null, o)}`).toBe(`${name}:false`);
    }
    expect(canSeeStatsCard('headToHead', null, o)).toBe(false);
    expect(leagueLimit(null, o)).toBe(FREE_LEAGUE_LIMIT);
  });

  it('opens everything for a subscriber once it is on', () => {
    const o = { now: NOW, billingLive: true };
    for (const [name, gate] of GATES) {
      expect(`${name}:${gate(ent(), o)}`).toBe(`${name}:true`);
    }
    expect(canSeeStatsCard('headToHead', ent(), o)).toBe(true);
    expect(leagueLimit(ent(), o)).toBe(Infinity);
    expect(teamLimit(ent(), o)).toBe(Infinity);
  });
});

// The logic that must match public.is_subscriber() exactly. Each case
// here is a paying bowler locked out on league night if it is wrong.
describe('isSubscriber', () => {
  it('says yes while active and inside the period', () => {
    expect(isSubscriber(ent({ status: 'active' }), NOW)).toBe(true);
  });

  it('says yes during a trial', () => {
    expect(isSubscriber(ent({ status: 'trialing' }), NOW)).toBe(true);
  });

  // Grace means the period has ALREADY ended and the store is retrying
  // the card. Checking the date here would cut off every expired card
  // mid-season, which is the whole failure grace exists to prevent.
  it('says yes in grace even though the period has ended', () => {
    expect(isSubscriber(ent({ status: 'grace', current_period_end: past(2) }), NOW)).toBe(true);
  });

  it('honours a cancellation until the period they already paid for ends', () => {
    expect(isSubscriber(ent({ status: 'canceled', current_period_end: future(10) }), NOW)).toBe(true);
    expect(isSubscriber(ent({ status: 'canceled', current_period_end: past(1) }), NOW)).toBe(false);
    // No end date and cancelled is not "forever" -- it is unknown, and
    // unknown must not be access.
    expect(isSubscriber(ent({ status: 'canceled', current_period_end: null }), NOW)).toBe(false);
  });

  it('says no once the store has given up or the bowler paused', () => {
    for (const status of ['on_hold', 'paused', 'expired', 'none']) {
      expect(`${status}:${isSubscriber(ent({ status }), NOW)}`).toBe(`${status}:false`);
    }
  });

  it('says no when the period has run out', () => {
    expect(isSubscriber(ent({ status: 'active', current_period_end: past(1) }), NOW)).toBe(false);
  });

  // A manual grant -- a comped account, a prize -- has no end date.
  it('treats a missing period end as open-ended for an active plan', () => {
    expect(isSubscriber(ent({ status: 'active', current_period_end: null }), NOW)).toBe(true);
  });

  it('says no for a free plan whatever the status', () => {
    expect(isSubscriber(ent({ plan: 'free', status: 'active' }), NOW)).toBe(false);
  });

  it('survives nothing, rubbish and unparseable dates', () => {
    expect(isSubscriber(null, NOW)).toBe(false);
    expect(isSubscriber(undefined, NOW)).toBe(false);
    expect(isSubscriber('plus', NOW)).toBe(false);
    expect(isSubscriber({}, NOW)).toBe(false);
    expect(isSubscriber(ent({ current_period_end: 'not a date' }), NOW)).toBe(false);
    // Absent and unreadable must stay different: absent is a manual
    // grant, unreadable is corruption.
    expect(isSubscriber(ent({ current_period_end: null }), NOW)).toBe(true);
    expect(isSubscriber(ent({ current_period_end: '' }), NOW)).toBe(true);
    expect(trialDaysLeft({ trial_end: 'not a date' }, NOW)).toBe(0);
  });
});

describe('the trial', () => {
  it('knows a trial from a paid subscription', () => {
    expect(isTrialing(ent({ status: 'trialing' }), NOW)).toBe(true);
    expect(isTrialing(ent({ status: 'active' }), NOW)).toBe(false);
    expect(isTrialing(null, NOW)).toBe(false);
  });

  // Six hours left is "1 day", not "0 days" -- which would read as
  // expired to someone who still has access.
  it('rounds the days left up', () => {
    expect(trialDaysLeft({ trial_end: new Date(NOW + 6 * 3_600_000).toISOString() }, NOW)).toBe(1);
    expect(trialDaysLeft({ trial_end: future(29.5) }, NOW)).toBe(30);
    expect(trialDaysLeft({ trial_end: past(1) }, NOW)).toBe(0);
    expect(trialDaysLeft({}, NOW)).toBe(0);
  });

});

describe('suggesting the annual plan', () => {
  const monthly = over => ent({ billing_period: 'month', created_at: past(90), ...over });

  it('asks a monthly subscriber who has been here two months', () => {
    expect(shouldOfferAnnual(monthly(), NOW)).toBe(true);
  });

  it('waits until they have been paying that long', () => {
    expect(shouldOfferAnnual(monthly({ created_at: past(ANNUAL_PROMPT_AFTER_DAYS - 1) }), NOW)).toBe(false);
    expect(shouldOfferAnnual(monthly({ created_at: past(ANNUAL_PROMPT_AFTER_DAYS) }), NOW)).toBe(true);
  });

  // The one that would be embarrassing.
  it('never asks a yearly subscriber to switch to yearly', () => {
    expect(shouldOfferAnnual(monthly({ billing_period: 'year' }), NOW)).toBe(false);
  });

  it('does not ask during the trial', () => {
    expect(shouldOfferAnnual(monthly({ status: 'trialing' }), NOW)).toBe(false);
  });

  it('does not ask someone who is not subscribed', () => {
    expect(shouldOfferAnnual(null, NOW)).toBe(false);
    expect(shouldOfferAnnual(monthly({ status: 'expired' }), NOW)).toBe(false);
  });

  // billing_period does not exist in the schema yet. Absent must read as
  // "do not ask", never as "ask everybody".
  it('stays quiet while the column is missing', () => {
    expect(shouldOfferAnnual(ent({ created_at: past(90) }), NOW)).toBe(false);
    expect(shouldOfferAnnual(monthly({ created_at: null }), NOW)).toBe(false);
    expect(shouldOfferAnnual(monthly({ created_at: 'not a date' }), NOW)).toBe(false);
  });
});

describe('the paid stats cards', () => {
  const o = { now: NOW, billingLive: true };

  it('gates every card that compares two things', () => {
    for (const id of PAID_STATS_CARDS) {
      expect(`${id}:${canSeeStatsCard(id, null, o)}`).toBe(`${id}:false`);
    }
  });

  // The three that sound like they should be paid and are not.
  it('leaves a bowler their own numbers', () => {
    for (const id of ['byBall', 'headlineStats', 'splits', 'tenPinLeaves', 'framePosition']) {
      expect(`${id}:${canSeeStatsCard(id, null, o)}`).toBe(`${id}:true`);
    }
  });

  it('opens the compared cards for a subscriber', () => {
    for (const id of PAID_STATS_CARDS) {
      expect(`${id}:${canSeeStatsCard(id, ent(), o)}`).toBe(`${id}:true`);
    }
  });

  // Rank everybody, so they would fail the rule -- free by decision.
  it('leaves the league fun boards free: Giant Killer, Hung and Hand Up', () => {
    for (const id of ['giantKiller', 'hung', 'loneFivePin']) {
      expect(PAID_STATS_CARDS).not.toContain(id);
      expect(`${id}:${canSeeStatsCard(id, null, o)}`).toBe(`${id}:true`);
    }
  });

  it('does not gate a card nobody has heard of', () => {
    expect(canSeeStatsCard('somethingNew', null, o)).toBe(true);
  });
});

describe('scorecard import', () => {
  const o = { now: NOW, billingLive: true };

  // No weekly allowance any more -- a plain gate like the other three.
  it('is paid, full stop', () => {
    expect(canImportScorecard(null, o)).toBe(false);
    expect(canImportScorecard(ent(), o)).toBe(true);
  });

  it('is open during the trial', () => {
    expect(canImportScorecard(ent({ status: 'trialing' }), o)).toBe(true);
  });
});

describe('which leagues a free bowler keeps', () => {
  const o = { now: NOW, billingLive: true };
  const LEAGUES = ['Thursday House Shot', 'Tuesday House Shot', 'Practice·abc', 'Just Bowling·abc'];

  it('leaves a subscriber everything', () => {
    expect(allowedLeagues(LEAGUES, { ...o, entitlement: ent() })).toEqual(LEAGUES);
  });

  // The important one. Practice and Just Bowling are storage, not
  // leagues anybody joined -- counting them would stop a lapsed bowler
  // practising, which is exactly when they are most likely to come back.
  it('never counts a container against the limit', () => {
    const got = allowedLeagues(LEAGUES, { ...o, keptLeagueName: 'Tuesday House Shot' });
    expect(got).toContain('Practice·abc');
    expect(got).toContain('Just Bowling·abc');
    expect(got).toContain('Tuesday House Shot');
    expect(got).not.toContain('Thursday House Shot');
  });

  it('keeps the one they chose', () => {
    expect(allowedLeagues(LEAGUES, { ...o, keptLeagueName: 'Thursday House Shot' }))
      .toContain('Thursday House Shot');
  });

  it('falls back to the one they bowled most recently', () => {
    expect(allowedLeagues(LEAGUES, { ...o, mostRecentLeagueName: 'Thursday House Shot' }))
      .toContain('Thursday House Shot');
  });

  it('prefers their choice over the recent one', () => {
    const got = allowedLeagues(LEAGUES, {
      ...o, keptLeagueName: 'Tuesday House Shot', mostRecentLeagueName: 'Thursday House Shot',
    });
    expect(got).toContain('Tuesday House Shot');
    expect(got).not.toContain('Thursday House Shot');
  });

  it('is at least stable when it knows nothing', () => {
    const a = allowedLeagues(LEAGUES, o);
    const b = allowedLeagues([...LEAGUES].reverse(), o);
    expect(a.filter(n => n.includes('House Shot'))).toEqual(b.filter(n => n.includes('House Shot')));
  });

  it('ignores a kept league that no longer exists', () => {
    const got = allowedLeagues(LEAGUES, { ...o, keptLeagueName: 'A league they left' });
    expect(got.filter(n => n.includes('House Shot'))).toHaveLength(1);
  });

  it('changes nothing for a bowler who only has one league', () => {
    const one = ['Tuesday House Shot', 'Practice·abc'];
    expect(allowedLeagues(one, o)).toEqual(one);
    expect(lockedLeagues(one, o)).toEqual([]);
  });

  it('reports what went quiet, for the picker', () => {
    expect(lockedLeagues(LEAGUES, { ...o, keptLeagueName: 'Tuesday House Shot' }))
      .toEqual(['Thursday House Shot']);
  });

  it('survives nothing', () => {
    expect(allowedLeagues(null, o)).toEqual([]);
    expect(allowedLeagues([null, '', 3], o)).toEqual([]);
    expect(lockedLeagues(undefined, o)).toEqual([]);
  });
});

describe('featureUnlocked', () => {
  it('is the one place the kill switch is read', () => {
    expect(featureUnlocked(null, { now: NOW, billingLive: false })).toBe(true);
    expect(featureUnlocked(null, { now: NOW, billingLive: true })).toBe(false);
    expect(featureUnlocked(ent(), { now: NOW, billingLive: true })).toBe(true);
  });

  it('defaults to the shipped switch when not told otherwise', () => {
    expect(featureUnlocked(null)).toBe(!BILLING_LIVE);
  });
});

// ── Test accounts ───────────────────────────────────────────────────
//
// One flag that unlocks everything regardless of BILLING_LIVE, for us
// and for an App Store reviewer who must be able to see every paid
// screen without a card.
//
// The whole point of these tests is the SPLIT: a test account has
// access but does not have a subscription, and merging those two
// questions back into one predicate would silently make billing
// untestable from the only account set up to test it.
describe('test accounts', () => {
  const NOW_T = Date.parse('2026-01-15T20:00:00Z');
  const testAcct = { plan: 'free', status: 'none', is_test_account: true };
  const freeAcct = { plan: 'free', status: 'none' };
  const paidAcct = {
    plan: 'plus', status: 'active',
    current_period_end: new Date(NOW_T + 20 * 86_400_000).toISOString(),
  };

  it('unlocks everything even with billing live', () => {
    expect(featureUnlocked(testAcct, { now: NOW_T, billingLive: true })).toBe(true);
    expect(featureUnlocked(freeAcct, { now: NOW_T, billingLive: true })).toBe(false);
  });

  it('has access but does NOT have a subscription', () => {
    expect(isSubscriber(testAcct, NOW_T)).toBe(true);
    expect(hasPaidSubscription(testAcct, NOW_T)).toBe(false);
  });

  it('can therefore still reach checkout, which is the point', () => {
    // The Subscribe screen and create-checkout both gate on
    // hasPaidSubscription. False here means the buy button is reachable.
    expect(hasPaidSubscription(testAcct, NOW_T)).toBe(false);
  });

  it('leaves a real subscriber answering yes to both', () => {
    expect(isSubscriber(paidAcct, NOW_T)).toBe(true);
    expect(hasPaidSubscription(paidAcct, NOW_T)).toBe(true);
  });

  it('only a literal true counts, never a truthy value', () => {
    for (const v of ['true', 1, 'yes', {}, [], 'false']) {
      expect(`${JSON.stringify(v)}:${isTestAccount({ is_test_account: v })}`)
        .toBe(`${JSON.stringify(v)}:false`);
    }
    expect(isTestAccount({ is_test_account: true })).toBe(true);
    expect(isTestAccount(null)).toBe(false);
    expect(isTestAccount(undefined)).toBe(false);
  });

  it('gives limits away too, not just the AI features', () => {
    expect(leagueLimit(testAcct, { billingLive: true })).toBe(Infinity);
    expect(teamLimit(testAcct, { billingLive: true })).toBe(Infinity);
    expect(leagueLimit(freeAcct, { billingLive: true })).toBe(FREE_LEAGUE_LIMIT);
  });
});

// ── "Not known yet" must not be read as "no" ────────────────────────
//
// These exist because the difference only started mattering the day
// BILLING_LIVE flipped. Before that an absent entitlement unlocked
// everything, so null-for-both was harmless; after it, a subscriber
// whose entitlement query lost a race with bad wifi was locked out of
// what they had paid for, mid league night.
describe('unknown entitlement', () => {
  const NOW_U = Date.parse('2026-01-15T20:00:00Z');

  it('is distinguishable from a known-free bowler', () => {
    expect(isEntitlementKnown(null)).toBe(true);
    expect(isEntitlementKnown(ENTITLEMENT_UNKNOWN)).toBe(false);
  });

  it('fails OPEN, matching the server', () => {
    expect(featureUnlocked(ENTITLEMENT_UNKNOWN, { now: NOW_U, billingLive: true })).toBe(true);
  });

  it('still gates a bowler we DID ask about', () => {
    // The whole value of the distinction: null is an answer, and the
    // answer is no.
    expect(featureUnlocked(null, { now: NOW_U, billingLive: true })).toBe(false);
  });

  it('unlocks every gate and both limits while unknown', () => {
    for (const [name, gate] of GATES) {
      expect(`${name}:${gate(ENTITLEMENT_UNKNOWN, { now: NOW_U, billingLive: true })}`).toBe(`${name}:true`);
    }
    expect(leagueLimit(ENTITLEMENT_UNKNOWN, { billingLive: true })).toBe(Infinity);
    expect(teamLimit(ENTITLEMENT_UNKNOWN, { billingLive: true })).toBe(Infinity);
    expect(canSeeStatsCard('headToHead', ENTITLEMENT_UNKNOWN, { billingLive: true })).toBe(true);
  });

  // The sentinel is a STRING, and React state updaters elsewhere do
  // {...prev}. Spreading a string yields {0:'u',1:'n',...}: truthy, no
  // plan, and therefore a locked-out free bowler. Anything that spreads
  // the entitlement must check typeof first.
  it('is not mistaken for a subscriber if something spreads it', () => {
    const spread = { ...ENTITLEMENT_UNKNOWN };
    expect(isSubscriber(spread, NOW_U)).toBe(false);
    expect(featureUnlocked(spread, { now: NOW_U, billingLive: true })).toBe(false);
  });
});
