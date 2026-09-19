import { describe, it, expect } from 'vitest';
import { paymentRail } from './billing.js';

// The Play state mapping is tested in playBilling.test.js, against
// supabase/functions/_shared/play.ts where it actually lives.

describe('which rail', () => {
  it('is Play in the app and Stripe on the web', () => {
    expect(paymentRail({ isNative: true })).toBe('play');
    expect(paymentRail({ isNative: false })).toBe('stripe');
  });

  // Not knowing must mean the web, which is the rail that works
  // everywhere. Defaulting the other way would offer Play billing to a
  // browser with no Play Store in it, and the purchase would simply
  // fail with nothing to fall back to.
  it('treats an unknown platform as the web', () => {
    expect(paymentRail()).toBe('stripe');
    expect(paymentRail({})).toBe('stripe');
    expect(paymentRail({ isNative: undefined })).toBe('stripe');
    expect(paymentRail({ isNative: null })).toBe('stripe');
  });

  // Only a real boolean true. The string "false" is truthy, and so is
  // "no" -- a truthiness check here would send a web bowler to a Play
  // Store that is not there, with nothing to fall back to.
  it('only says Play for a real true', () => {
    for (const v of ['true', 'false', 'no', 1, {}, [], 0, '', NaN]) {
      expect(`${JSON.stringify(v)}:${paymentRail({ isNative: v })}`)
        .toBe(`${JSON.stringify(v)}:stripe`);
    }
  });
});
