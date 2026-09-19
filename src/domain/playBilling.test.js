// Tests the Play mapping, from here.
//
// play.ts lives in supabase/functions/_shared because that is where it
// has to run -- two functions import it and they must agree -- but it
// decides who has paid, so going untested would be the wrong trade. It
// has no imports, so vitest can load it straight out of supabase/
// without any of the Deno runtime coming with it. Same arrangement as
// nightcapRender.test.js.
//
// The two that carry the weight:
//   1. Every documented state maps the way we decided, and an unknown
//      one grants nothing.
//   2. What this writes, isSubscriber() reads back the same way -- that
//      agreement IS the paywall working.
import { describe, it, expect } from 'vitest';
import {
  playStateToStatus, playStatus, billingPeriodFor, currentPeriodEnd,
  basePlanIdOf, offerIdOf, isTrialPurchase, entitlementFromPlayPurchase,
  PLAY_STATE_TO_STATUS,
  PLAY_BASE_PLAN_MONTHLY, PLAY_BASE_PLAN_YEARLY, PLAY_TRIAL_OFFER_ID,
} from '../../supabase/functions/_shared/play.ts';
import { isSubscriber } from './entitlements.js';

const NOW = Date.parse('2026-01-15T20:00:00Z');
const future = d => new Date(NOW + d * 86_400_000).toISOString();
const past = d => new Date(NOW - d * 86_400_000).toISOString();

const purchase = (state, over = {}) => ({
  subscriptionState: state,
  purchaseToken: 'tok-123',
  lineItems: [{
    productId: 'PLACEHOLDER_product_plus',
    expiryTime: future(20),
    offerDetails: { basePlanId: PLAY_BASE_PLAN_MONTHLY },
    ...over,
  }],
});

// The nine states Google documents. Listed here so that a tenth one
// appearing in the map without a decision about it fails a test rather
// than reaching a bowler.
const ALL_STATES = [
  'SUBSCRIPTION_STATE_ACTIVE',
  'SUBSCRIPTION_STATE_IN_GRACE_PERIOD',
  'SUBSCRIPTION_STATE_ON_HOLD',
  'SUBSCRIPTION_STATE_PAUSED',
  'SUBSCRIPTION_STATE_CANCELED',
  'SUBSCRIPTION_STATE_EXPIRED',
  'SUBSCRIPTION_STATE_PENDING',
  'SUBSCRIPTION_STATE_PENDING_PURCHASE_CANCELED',
  'SUBSCRIPTION_STATE_UNSPECIFIED',
];

describe('Play states', () => {
  it('covers every documented state and nothing else', () => {
    expect(Object.keys(PLAY_STATE_TO_STATUS).sort()).toEqual([...ALL_STATES].sort());
  });

  it('maps each one the way we decided', () => {
    const want = {
      SUBSCRIPTION_STATE_ACTIVE: 'active',
      SUBSCRIPTION_STATE_IN_GRACE_PERIOD: 'grace',
      SUBSCRIPTION_STATE_ON_HOLD: 'on_hold',
      SUBSCRIPTION_STATE_PAUSED: 'paused',
      SUBSCRIPTION_STATE_CANCELED: 'canceled',
      SUBSCRIPTION_STATE_EXPIRED: 'expired',
      SUBSCRIPTION_STATE_PENDING: 'none',
      SUBSCRIPTION_STATE_PENDING_PURCHASE_CANCELED: 'none',
      SUBSCRIPTION_STATE_UNSPECIFIED: 'none',
    };
    for (const s of ALL_STATES) {
      expect(`${s}:${playStateToStatus(s)}`).toBe(`${s}:${want[s]}`);
    }
  });

  // The direction that matters. A state Google adds after we ship must
  // not grant anything.
  it('refuses a state it has never seen', () => {
    expect(playStateToStatus('SUBSCRIPTION_STATE_SOMETHING_NEW')).toBe('none');
    expect(playStateToStatus(undefined)).toBe('none');
    expect(playStateToStatus(null)).toBe('none');
    expect(playStateToStatus(42)).toBe('none');
    // Not reachable off Object's prototype.
    expect(playStateToStatus('constructor')).toBe('none');
    expect(playStateToStatus('toString')).toBe('none');
  });
});

describe('billing period', () => {
  it('reads the base plan', () => {
    expect(billingPeriodFor(PLAY_BASE_PLAN_MONTHLY)).toBe('month');
    expect(billingPeriodFor(PLAY_BASE_PLAN_YEARLY)).toBe('year');
  });

  // A base plan id one character off must be null, not a guess. Null
  // makes shouldOfferAnnual() silent; a guess makes it wrong.
  it('is null for anything else', () => {
    expect(billingPeriodFor('monthly')).toBe(null);
    expect(billingPeriodFor('')).toBe(null);
    expect(billingPeriodFor(null)).toBe(null);
    expect(billingPeriodFor('constructor')).toBe(null);
  });
});

describe('period end', () => {
  it('reads expiryTime off the line item', () => {
    expect(currentPeriodEnd(purchase('SUBSCRIPTION_STATE_ACTIVE'))).toBe(future(20));
  });

  // An upgrade in flight can carry two line items. Taking the first
  // would end access at the plan they just left.
  it('takes the latest expiry when there are several', () => {
    const p = {
      lineItems: [
        { expiryTime: future(2), offerDetails: { basePlanId: PLAY_BASE_PLAN_MONTHLY } },
        { expiryTime: future(300), offerDetails: { basePlanId: PLAY_BASE_PLAN_YEARLY } },
      ],
    };
    expect(currentPeriodEnd(p)).toBe(future(300));
    // and the plan reported is the one that expiry belongs to
    expect(basePlanIdOf(p)).toBe(PLAY_BASE_PLAN_YEARLY);
  });

  it('survives a purchase with nothing useful in it', () => {
    expect(currentPeriodEnd(null)).toBe(null);
    expect(currentPeriodEnd({})).toBe(null);
    expect(currentPeriodEnd({ lineItems: [] })).toBe(null);
    expect(currentPeriodEnd({ lineItems: [null, {}] })).toBe(null);
    expect(currentPeriodEnd({ lineItems: [{ expiryTime: 'not a date' }] })).toBe(null);
    expect(basePlanIdOf(null)).toBe(null);
    expect(offerIdOf({})).toBe(null);
  });
});

describe('telling a trial from a paying subscription', () => {
  const trial = purchase('SUBSCRIPTION_STATE_ACTIVE', {
    offerDetails: { basePlanId: PLAY_BASE_PLAN_MONTHLY, offerId: PLAY_TRIAL_OFFER_ID },
  });

  it('reads the trial offer id', () => {
    expect(isTrialPurchase(trial)).toBe(true);
    expect(playStatus(trial)).toBe('trialing');
  });

  // Play reports a trial as ACTIVE, so without the offer id this is
  // indistinguishable from a paying subscriber.
  it('leaves a paying subscriber alone', () => {
    const paid = purchase('SUBSCRIPTION_STATE_ACTIVE');
    expect(isTrialPurchase(paid)).toBe(false);
    expect(playStatus(paid)).toBe('active');
  });

  it('does not call some other promotional offer a trial', () => {
    const promo = purchase('SUBSCRIPTION_STATE_ACTIVE', {
      offerDetails: { basePlanId: PLAY_BASE_PLAN_MONTHLY, offerId: 'winback-20pct' },
    });
    expect(playStatus(promo)).toBe('active');
  });

  // Only an ACTIVE subscription can be trialing. A trial that lapsed is
  // expired, not "trialing with no time left".
  it('never calls a dead subscription a trial', () => {
    const dead = { ...trial, subscriptionState: 'SUBSCRIPTION_STATE_EXPIRED' };
    expect(playStatus(dead)).toBe('expired');
  });
});

describe('the row we write', () => {
  it('grants plus for every status that means access', () => {
    for (const [state, status] of [
      ['SUBSCRIPTION_STATE_ACTIVE', 'active'],
      ['SUBSCRIPTION_STATE_IN_GRACE_PERIOD', 'grace'],
      ['SUBSCRIPTION_STATE_CANCELED', 'canceled'],
    ]) {
      const row = entitlementFromPlayPurchase(purchase(state));
      expect(`${state}:${row.plan}:${row.status}`).toBe(`${state}:plus:${status}`);
    }
  });

  it('writes free for every status that does not', () => {
    for (const state of [
      'SUBSCRIPTION_STATE_ON_HOLD', 'SUBSCRIPTION_STATE_PAUSED',
      'SUBSCRIPTION_STATE_EXPIRED', 'SUBSCRIPTION_STATE_PENDING',
      'SUBSCRIPTION_STATE_PENDING_PURCHASE_CANCELED', 'SUBSCRIPTION_STATE_UNSPECIFIED',
    ]) {
      expect(`${state}:${entitlementFromPlayPurchase(purchase(state)).plan}`).toBe(`${state}:free`);
    }
  });

  // The whole point of the mapping: what this file writes, the gate must
  // read back the same way. These two agreeing is the paywall working.
  it('agrees with isSubscriber about who has access', () => {
    for (const state of ALL_STATES) {
      const row = entitlementFromPlayPurchase(purchase(state));
      const grants = row.plan === 'plus';
      expect(`${state}:${isSubscriber(row, NOW)}`).toBe(`${state}:${grants}`);
    }
  });

  // grace means the period has ALREADY ended. isSubscriber must still
  // say yes, or every failed card is cut off mid-season.
  it('keeps a grace subscriber even with the period behind them', () => {
    const p = purchase('SUBSCRIPTION_STATE_IN_GRACE_PERIOD', {
      expiryTime: past(2), offerDetails: { basePlanId: PLAY_BASE_PLAN_MONTHLY },
    });
    const row = entitlementFromPlayPurchase(p);
    expect(row.status).toBe('grace');
    expect(isSubscriber(row, NOW)).toBe(true);
  });

  it('only gives a trial_end to a trial', () => {
    const trial = purchase('SUBSCRIPTION_STATE_ACTIVE', {
      expiryTime: future(30),
      offerDetails: { basePlanId: PLAY_BASE_PLAN_MONTHLY, offerId: PLAY_TRIAL_OFFER_ID },
    });
    expect(entitlementFromPlayPurchase(trial).trial_end).toBe(future(30));
    expect(entitlementFromPlayPurchase(purchase('SUBSCRIPTION_STATE_ACTIVE')).trial_end).toBe(null);
  });

  it('carries the token and the period', () => {
    const row = entitlementFromPlayPurchase(purchase('SUBSCRIPTION_STATE_ACTIVE'));
    expect(row.play_purchase_token).toBe('tok-123');
    expect(row.billing_period).toBe('month');
    expect(row.source).toBe('play');
  });

  // Every value written must satisfy the CHECK constraints on the table,
  // or the write fails and the bowler stays locked out after paying.
  it('only ever writes values the table allows', () => {
    const PLANS = ['free', 'plus'];
    const STATUSES = ['none', 'trialing', 'active', 'grace', 'on_hold', 'paused', 'canceled', 'expired'];
    const PERIODS = ['month', 'year', null];
    const SOURCES = ['play', 'stripe', 'manual'];
    for (const state of ALL_STATES) {
      const row = entitlementFromPlayPurchase(purchase(state));
      expect(PLANS).toContain(row.plan);
      expect(STATUSES).toContain(row.status);
      expect(PERIODS).toContain(row.billing_period);
      expect(SOURCES).toContain(row.source);
    }
  });

  it('survives rubbish rather than writing rubbish', () => {
    const row = entitlementFromPlayPurchase(null);
    expect(row.plan).toBe('free');
    expect(row.status).toBe('none');
    expect(row.current_period_end).toBe(null);
    expect(row.play_purchase_token).toBe(null);
    expect(isSubscriber(row, NOW)).toBe(false);
  });
});
