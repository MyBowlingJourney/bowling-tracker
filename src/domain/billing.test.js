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

import { isCanadianTimeZone, displayPricesFor, checkoutCurrencyFor } from './billing.js';

describe('Canadian prices', () => {
  it('knows the Canadian time zones, old names included', () => {
    for (const tz of ['America/Toronto', 'America/Vancouver', 'America/Halifax', 'America/St_Johns',
      'America/Regina', 'America/Montreal', 'Canada/Eastern', 'America/Winnipeg', 'America/Edmonton']) {
      expect(isCanadianTimeZone(tz)).toBe(true);
    }
  });
  it('is not fooled by nearby or French-speaking places', () => {
    for (const tz of ['America/New_York', 'America/Detroit', 'America/Chicago', 'Europe/Paris',
      'Australia/Sydney', 'Pacific/Auckland', 'America/Los_Angeles', '', undefined, null]) {
      expect(isCanadianTimeZone(tz)).toBe(false);
    }
  });
  it('shows the Play Canada prices in Canada and US dollars elsewhere', () => {
    expect(displayPricesFor('America/Toronto')).toEqual({ month: '$6.99', year: '$69.99' });
    expect(displayPricesFor('America/New_York')).toEqual({ month: '$4.99', year: '$49.99' });
  });
  it('asks Stripe for CAD only in Canada', () => {
    expect(checkoutCurrencyFor('America/Vancouver')).toBe('cad');
    expect(checkoutCurrencyFor('America/Denver')).toBe('');
  });
});

import { annualPriceToShow, PRICES_USD, PRICES_CAD } from './billing.js';

describe('the yearly price on the trial banner', () => {
  it("uses Google's own price on Play", () => {
    expect(annualPriceToShow({ rail: 'play', offers: { prices: { year: 'A$79.99' } }, displayPrices: PRICES_USD })).toBe('A$79.99');
  });
  it('shows no price on Play rather than a US one when Google gave none', () => {
    expect(annualPriceToShow({ rail: 'play', offers: null, displayPrices: PRICES_USD })).toBe('');
    expect(annualPriceToShow({ rail: 'play', offers: { prices: { year: null } }, displayPrices: PRICES_USD })).toBe('');
  });
  it('uses the checkout price on the web', () => {
    expect(annualPriceToShow({ rail: 'stripe', offers: null, displayPrices: PRICES_USD })).toBe('$49.99');
    expect(annualPriceToShow({ rail: 'stripe', offers: null, displayPrices: PRICES_CAD })).toBe('$69.99');
  });
});

describe('Japan pricing', () => {
  it('shows yen, tax included, and asks checkout for JPY on Japan time', () => {
    expect(displayPricesFor('Asia/Tokyo')).toEqual({ month: '¥800', year: '¥8,000' });
    expect(displayPricesFor('Japan')).toEqual({ month: '¥800', year: '¥8,000' });
    expect(checkoutCurrencyFor('Asia/Tokyo')).toBe('jpy');
    expect(checkoutCurrencyFor('Asia/Bangkok')).toBe('');
    expect(displayPricesFor('Asia/Bangkok')).toEqual({ month: '$4.99', year: '$49.99' });
  });
});

describe('Singapore, Malaysia and the Philippines', () => {
  it('show local prices and ask checkout for the local currency', () => {
    expect(displayPricesFor('Asia/Singapore')).toEqual({ month: 'S$6.98', year: 'S$69.98' });
    expect(checkoutCurrencyFor('Asia/Singapore')).toBe('sgd');
    expect(displayPricesFor('Asia/Kuala_Lumpur')).toEqual({ month: 'RM21.90', year: 'RM219.90' });
    expect(checkoutCurrencyFor('Asia/Kuching')).toBe('myr');
    expect(displayPricesFor('Asia/Manila')).toEqual({ month: '₱349', year: '₱3,490' });
    expect(checkoutCurrencyFor('Asia/Manila')).toBe('php');
    expect(checkoutCurrencyFor('Asia/Bangkok')).toBe('');
  });
});

describe('Mexico', () => {
  it('shows pesos and asks checkout for MXN on Mexico time', () => {
    expect(displayPricesFor('America/Mexico_City')).toEqual({ month: 'MX$99', year: 'MX$999' });
    expect(checkoutCurrencyFor('America/Tijuana')).toBe('mxn');
    expect(checkoutCurrencyFor('America/Chicago')).toBe('');
  });
});

describe('South Korea', () => {
  it('shows won and asks checkout for KRW on Korean time', () => {
    expect(displayPricesFor('Asia/Seoul')).toEqual({ month: '₩7,900', year: '₩79,000' });
    expect(checkoutCurrencyFor('Asia/Seoul')).toBe('krw');
  });
});

describe('Hong Kong, India, the UAE, Costa Rica, Kuwait and Brunei', () => {
  it('show local prices and ask checkout for the local currency', () => {
    expect(displayPricesFor('Asia/Hong_Kong')).toEqual({ month: 'HK$38', year: 'HK$388' });
    expect(checkoutCurrencyFor('Hongkong')).toBe('hkd');
    expect(displayPricesFor('Asia/Kolkata')).toEqual({ month: '₹449', year: '₹4,490' });
    expect(checkoutCurrencyFor('Asia/Calcutta')).toBe('inr');
    expect(displayPricesFor('Asia/Dubai')).toEqual({ month: 'AED 18.99', year: 'AED 189.99' });
    expect(checkoutCurrencyFor('Asia/Dubai')).toBe('aed');
    expect(displayPricesFor('America/Costa_Rica')).toEqual({ month: '₡2,700', year: '₡27,000' });
    expect(checkoutCurrencyFor('America/Costa_Rica')).toBe('crc');
  });

  it('shows dinars in Kuwait and Brunei dollars in Brunei', () => {
    expect(displayPricesFor('Asia/Kuwait')).toEqual({ month: 'KD 1.500', year: 'KD 15.000' });
    expect(checkoutCurrencyFor('Asia/Kuwait')).toBe('kwd');
    expect(displayPricesFor('Asia/Brunei')).toEqual({ month: 'B$6.98', year: 'B$69.98' });
    expect(checkoutCurrencyFor('Asia/Brunei')).toBe('bnd');
  });

  it('leaves Puerto Rico, Bermuda and the dropped countries on US prices', () => {
    for (const tz of ['America/Puerto_Rico', 'Atlantic/Bermuda', 'Asia/Muscat', 'America/Lima', 'Africa/Johannesburg',
      'Asia/Riyadh', 'America/Sao_Paulo', 'America/Nassau', 'Asia/Bangkok']) {
      expect(displayPricesFor(tz)).toEqual({ month: '$4.99', year: '$49.99' });
      expect(checkoutCurrencyFor(tz)).toBe('');
    }
  });
});
