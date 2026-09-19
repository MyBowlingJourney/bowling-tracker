// Tests the Stripe mapping, from here.
//
// stripe.ts lives in supabase/functions/_shared because that is where it
// runs, but it decides who has paid on the web rail, so going untested
// would be the wrong trade. It has no imports, so vitest can load it
// straight out of supabase/. Same arrangement as nightcapRender.test.js
// and playBilling.test.js.
//
// The two that carry the weight:
//   1. current_period_end is read from the ITEM (Basil moved it), with
//      the old subscription-level field still honoured.
//   2. What this writes, isSubscriber() reads back the same way.
import { describe, it, expect } from 'vitest';
import {
  stripeStateToStatus, stripeStatus, billingPeriodOf, currentPeriodEnd,
  priceIdOf, entitlementFromStripeSubscription, STRIPE_STATUS_TO_STATUS,
} from '../../supabase/functions/_shared/stripe.ts';
import { isSubscriber } from './entitlements.js';

const NOW = Date.parse('2026-01-15T20:00:00Z');
const unix = d => Math.floor((NOW + d * 86_400_000) / 1000);
const iso = d => new Date(Math.floor((NOW + d * 86_400_000) / 1000) * 1000).toISOString();

const sub = (status, over = {}) => ({
  id: 'sub_123',
  customer: 'cus_123',
  status,
  items: {
    data: [{
      price: { id: 'price_test_monthly', recurring: { interval: 'month' } },
      current_period_end: unix(20),
    }],
  },
  ...over,
});

const ALL_STATES = [
  'trialing', 'active', 'past_due', 'unpaid',
  'paused', 'canceled', 'incomplete', 'incomplete_expired',
];

describe('Stripe statuses', () => {
  it('covers every documented status and nothing else', () => {
    expect(Object.keys(STRIPE_STATUS_TO_STATUS).sort()).toEqual([...ALL_STATES].sort());
  });

  it('maps each one the way we decided', () => {
    const want = {
      trialing: 'trialing',
      active: 'active',
      past_due: 'grace',
      unpaid: 'on_hold',
      paused: 'paused',
      canceled: 'expired',
      incomplete: 'none',
      incomplete_expired: 'expired',
    };
    for (const s of ALL_STATES) {
      expect(`${s}:${stripeStateToStatus(s)}`).toBe(`${s}:${want[s]}`);
    }
  });

  // The expensive confusion. Stripe's "canceled" means OVER; ours means
  // "cancelled but paid through the period". Mapping one onto the other
  // hands a free month to everybody who cancels.
  it('does not confuse Stripe canceled with ours', () => {
    expect(stripeStatus(sub('canceled'))).toBe('expired');
    expect(stripeStatus(sub('active', { cancel_at_period_end: true }))).toBe('canceled');
    expect(stripeStatus(sub('active', { cancel_at_period_end: false }))).toBe('active');
  });

  // Cancelling during a trial leaves nothing paid for, so it must not
  // become our "canceled", which grants access to the period end.
  it('does not turn a cancelled trial into paid time', () => {
    expect(stripeStatus(sub('trialing', { cancel_at_period_end: true }))).toBe('trialing');
  });

  it('refuses a status it has never seen', () => {
    expect(stripeStateToStatus('something_new')).toBe('none');
    expect(stripeStateToStatus(undefined)).toBe('none');
    expect(stripeStateToStatus(null)).toBe('none');
    expect(stripeStateToStatus('constructor')).toBe('none');
    expect(stripeStateToStatus('toString')).toBe('none');
  });
});

describe('the period end Basil moved', () => {
  it('reads it off the subscription ITEM', () => {
    expect(currentPeriodEnd(sub('active'))).toBe(iso(20));
  });

  // A webhook endpoint is pinned to an API version, so one created
  // before Basil still sends the old shape.
  it('still honours the old subscription-level field', () => {
    const old = { status: 'active', current_period_end: unix(15), items: { data: [] } };
    expect(currentPeriodEnd(old)).toBe(iso(15));
  });

  it('prefers the item when both are present', () => {
    const both = sub('active', { current_period_end: unix(1) });
    expect(currentPeriodEnd(both)).toBe(iso(20));
  });

  // A plan change can briefly carry two items.
  it('takes the latest across items', () => {
    const two = {
      status: 'active',
      items: { data: [
        { price: { recurring: { interval: 'month' } }, current_period_end: unix(3) },
        { price: { recurring: { interval: 'year' } }, current_period_end: unix(300) },
      ] },
    };
    expect(currentPeriodEnd(two)).toBe(iso(300));
    expect(billingPeriodOf(two)).toBe('year');
  });

  // THE money bug. A null end on an active plan reads as a manual grant
  // -- open-ended -- so a missing period end is a free subscription
  // forever, not a lockout.
  it('never leaves an active subscriber with no end date', () => {
    const row = entitlementFromStripeSubscription(sub('active'));
    expect(row.current_period_end).not.toBe(null);
    expect(isSubscriber(row, NOW)).toBe(true);
    expect(isSubscriber(row, NOW + 40 * 86_400_000)).toBe(false);
  });

  it('survives a subscription with nothing useful in it', () => {
    expect(currentPeriodEnd(null)).toBe(null);
    expect(currentPeriodEnd({})).toBe(null);
    expect(currentPeriodEnd({ items: { data: [] } })).toBe(null);
    expect(currentPeriodEnd({ items: { data: [null, {}] } })).toBe(null);
    expect(currentPeriodEnd({ current_period_end: 'soon' })).toBe(null);
    expect(billingPeriodOf(null)).toBe(null);
    expect(priceIdOf({})).toBe(null);
  });
});

describe('billing period', () => {
  it('comes from the price interval, not a table of ids', () => {
    expect(billingPeriodOf(sub('active'))).toBe('month');
    const yearly = sub('active', {
      items: { data: [{ price: { recurring: { interval: 'year' } }, current_period_end: unix(300) }] },
    });
    expect(billingPeriodOf(yearly)).toBe('year');
  });

  it('is null for an interval we do not sell', () => {
    for (const interval of ['week', 'day', '', undefined]) {
      const s = sub('active', {
        items: { data: [{ price: { recurring: { interval } }, current_period_end: unix(5) }] },
      });
      expect(`${interval}:${billingPeriodOf(s)}`).toBe(`${interval}:null`);
    }
  });
});

describe('the row we write', () => {
  it('grants plus for every status that means access', () => {
    for (const [state, status] of [['active', 'active'], ['trialing', 'trialing'], ['past_due', 'grace']]) {
      const row = entitlementFromStripeSubscription(sub(state));
      expect(`${state}:${row.plan}:${row.status}`).toBe(`${state}:plus:${status}`);
    }
    const cancelling = entitlementFromStripeSubscription(sub('active', { cancel_at_period_end: true }));
    expect(`${cancelling.plan}:${cancelling.status}`).toBe('plus:canceled');
  });

  it('writes free for every status that does not', () => {
    for (const state of ['unpaid', 'paused', 'canceled', 'incomplete', 'incomplete_expired']) {
      expect(`${state}:${entitlementFromStripeSubscription(sub(state)).plan}`).toBe(`${state}:free`);
    }
  });

  // The agreement that IS the paywall working.
  it('agrees with isSubscriber about who has access', () => {
    for (const state of ALL_STATES) {
      const row = entitlementFromStripeSubscription(sub(state));
      expect(`${state}:${isSubscriber(row, NOW)}`).toBe(`${state}:${row.plan === 'plus'}`);
    }
  });

  it('keeps a past_due subscriber even with the period behind them', () => {
    const late = sub('past_due', {
      items: { data: [{ price: { recurring: { interval: 'month' } }, current_period_end: unix(-2) }] },
    });
    const row = entitlementFromStripeSubscription(late);
    expect(row.status).toBe('grace');
    expect(isSubscriber(row, NOW)).toBe(true);
  });

  it('only gives a trial_end to a trial', () => {
    const t = sub('trialing', { trial_end: unix(12) });
    expect(entitlementFromStripeSubscription(t).trial_end).toBe(iso(12));
    expect(entitlementFromStripeSubscription(sub('active', { trial_end: unix(12) })).trial_end).toBe(null);
  });

  it('carries the ids the webhook needs to find them again', () => {
    const row = entitlementFromStripeSubscription(sub('active'));
    expect(row.stripe_customer_id).toBe('cus_123');
    expect(row.stripe_subscription_id).toBe('sub_123');
    expect(row.source).toBe('stripe');
  });

  // Every value must satisfy the CHECK constraints on the table, or the
  // write fails and the bowler stays locked out after paying.
  it('only ever writes values the table allows', () => {
    const PLANS = ['free', 'plus'];
    const STATUSES = ['none', 'trialing', 'active', 'grace', 'on_hold', 'paused', 'canceled', 'expired'];
    const PERIODS = ['month', 'year', null];
    for (const state of ALL_STATES) {
      const row = entitlementFromStripeSubscription(sub(state));
      expect(PLANS).toContain(row.plan);
      expect(STATUSES).toContain(row.status);
      expect(PERIODS).toContain(row.billing_period);
      expect(row.source).toBe('stripe');
    }
  });

  it('survives rubbish rather than writing rubbish', () => {
    const row = entitlementFromStripeSubscription(null);
    expect(row.plan).toBe('free');
    expect(row.status).toBe('none');
    expect(row.current_period_end).toBe(null);
    expect(row.stripe_subscription_id).toBe(null);
    expect(isSubscriber(row, NOW)).toBe(false);
  });
});
