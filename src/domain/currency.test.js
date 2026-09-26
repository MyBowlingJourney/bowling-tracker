import { describe, it, expect, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  CURRENCIES, currencyForZone, localCurrency, localTimeZone, resetLocalTimeZone,
  formatMoney, moneySymbol, isDollar, scaleMoney, moneyStep,
  pokerStakes, pokerGameLabels, moneyBagsThreshold, MONEY_BAGS_DOLLARS, MONEY_SCALED_FROM,
} from './currency.js';
import { checkoutCurrencyFor } from './billing.js';
import { defaultBuyIns, buyInsForLeague, DEFAULT_BUY_INS, costArraysFor } from './money.js';
import { seasonBadges } from './competitiveBadgeEarning.js';
import { COMPETITIVE_BADGES } from './competitiveBadges.js';
import { competitiveBadges } from './badgeContext.js';
import { milestoneGlyph } from './journey.js';
import { moneyGameLabel } from './preferences.js';
import { sessionHighlights, tournamentLines } from './shareCard.js';
import { summaryToText } from './seasonExport.js';
import { createTranslator } from '../i18n/engine.js';

// The device's zone, for the functions that read it. Intl is swapped for
// one call's worth and the cache is cleared on both sides.
function inZone(tz, fn) {
  const orig = Intl.DateTimeFormat;
  Intl.DateTimeFormat = function () { return { resolvedOptions: () => ({ timeZone: tz }) }; };
  resetLocalTimeZone();
  try { return fn(); } finally { Intl.DateTimeFormat = orig; resetLocalTimeZone(); }
}
afterEach(() => resetLocalTimeZone());

describe('which currency a phone is in', () => {
  it('follows the subscription price zones for the four with their own money', () => {
    expect(currencyForZone('Asia/Tokyo').id).toBe('jpy');
    expect(currencyForZone('Japan').id).toBe('jpy');
    expect(currencyForZone('Asia/Seoul').id).toBe('krw');
    expect(currencyForZone('ROK').id).toBe('krw');
    expect(currencyForZone('Asia/Kuala_Lumpur').id).toBe('myr');
    expect(currencyForZone('Asia/Kuching').id).toBe('myr');
    expect(currencyForZone('Asia/Manila').id).toBe('php');
  });

  it('is dollars everywhere else, including the other local-price countries', () => {
    for (const tz of ['America/New_York', 'America/Toronto', 'Canada/Eastern', 'Asia/Singapore',
      'America/Mexico_City', 'Australia/Sydney', 'Pacific/Auckland', 'Europe/London', '', undefined, null, 42]) {
      expect(currencyForZone(tz).id).toBe('dollar');
    }
  });

  it('reads its zones from billing.js, so the two lists cannot drift', () => {
    // Every zone billing prices in yen, won, ringgit or pesos is that
    // currency here -- checked through billing's own answer.
    const map = { jpy: 'jpy', krw: 'krw', myr: 'myr', php: 'php' };
    for (const tz of ['Asia/Tokyo', 'Asia/Seoul', 'Asia/Kuala_Lumpur', 'Asia/Manila', 'Asia/Singapore', 'America/Cancun']) {
      expect(currencyForZone(tz).id).toBe(map[checkoutCurrencyFor(tz)] || 'dollar');
    }
  });

  it('reads the device zone, and falls back to dollars when Intl throws', () => {
    expect(inZone('Asia/Seoul', () => localCurrency().id)).toBe('krw');
    expect(inZone('Asia/Tokyo', () => moneySymbol())).toBe('¥');
    const orig = Intl.DateTimeFormat;
    Intl.DateTimeFormat = function () { throw new Error('no Intl'); };
    resetLocalTimeZone();
    try {
      expect(localTimeZone()).toBe('');
      expect(localCurrency().id).toBe('dollar');
    } finally { Intl.DateTimeFormat = orig; resetLocalTimeZone(); }
  });
});

describe('formatMoney', () => {
  it('writes dollars byte-for-byte as toFixed(2) did', () => {
    for (const v of [0, 0.25, 1, 3.75, 7, 12, 26.25, 54.25, 99.999, 123.45, 1234.5, 100000]) {
      expect(formatMoney(v, { currency: 'dollar' })).toBe(`$${v.toFixed(2)}`);
    }
    expect(formatMoney(12, { currency: 'dollar' })).toBe('$12.00');
    expect(formatMoney(0.25, { currency: 'dollar' })).toBe('$0.25');
  });

  it('keeps each site\'s sign and whole-dollar shapes', () => {
    expect(formatMoney(-5, { currency: 'dollar' })).toBe('−$5.00');
    expect(formatMoney(-5, { currency: 'dollar', minus: '-' })).toBe('-$5.00');
    expect(formatMoney(45, { currency: 'dollar', decimals: 0, signed: true })).toBe('+$45');
    expect(formatMoney(0, { currency: 'dollar', signed: true })).toBe('+$0.00');
    expect(formatMoney(20.4, { currency: 'dollar', decimals: 0 })).toBe('$20');
    expect(formatMoney(12.5, { currency: 'dollar', raw: true })).toBe('$12.5');
    expect(formatMoney(3, { currency: 'dollar', raw: true })).toBe('$3');
  });

  it('writes yen and won whole, with thousands separators', () => {
    expect(formatMoney(1500, { currency: 'jpy' })).toBe('¥1,500');
    expect(formatMoney(5000, { currency: 'krw' })).toBe('₩5,000');
    expect(formatMoney(1234567, { currency: 'krw' })).toBe('₩1,234,567');
    expect(formatMoney(1500.4, { currency: 'jpy' })).toBe('¥1,500');
    // Never more decimals than the currency has.
    expect(formatMoney(1500, { currency: 'jpy', decimals: 2 })).toBe('¥1,500');
    expect(formatMoney(12.5, { currency: 'krw', raw: true })).toBe('₩13');
  });

  it('writes ringgit and pesos with two decimals', () => {
    expect(formatMoney(12, { currency: 'myr' })).toBe('RM12.00');
    expect(formatMoney(350, { currency: 'php' })).toBe('₱350.00');
    expect(formatMoney(1234.5, { currency: 'php' })).toBe('₱1,234.50');
    expect(formatMoney(45, { currency: 'myr', decimals: 0, signed: true })).toBe('+RM45');
  });

  it('signs the whole amount, and never shows a minus zero', () => {
    expect(formatMoney(-500, { currency: 'jpy' })).toBe('−¥500');
    expect(formatMoney(-0.4, { currency: 'jpy' })).toBe('¥0');
    expect(formatMoney(-0.001, { currency: 'dollar' })).toBe('$0.00');
    expect(formatMoney(NaN, { currency: 'krw' })).toBe('₩0');
    expect(formatMoney('12', { currency: 'myr' })).toBe('RM12.00');
  });

  it('uses the device currency when none is given', () => {
    expect(inZone('Asia/Seoul', () => formatMoney(5000))).toBe('₩5,000');
    expect(inZone('America/Toronto', () => formatMoney(12))).toBe('$12.00');
  });
});

describe('amounts the app chooses', () => {
  it('scales dollar thresholds and samples by the currency factor', () => {
    expect(scaleMoney(100, 'dollar')).toBe(100);
    expect(scaleMoney(100, 'jpy')).toBe(10000);
    expect(scaleMoney(100, 'krw')).toBe(100000);
    expect(scaleMoney(100, 'myr')).toBe(500);
    expect(scaleMoney(100, 'php')).toBe(5000);
  });

  it('steps whole units where there are no fractions', () => {
    expect(moneyStep('0.25', 'dollar')).toBe('0.25');
    expect(moneyStep('0.25', 'myr')).toBe('0.25');
    expect(moneyStep('0.25', 'jpy')).toBe('1');
    expect(moneyStep('0.25', 'krw')).toBe('1');
  });

  it('runs local poker stakes, keeping the dollar names for dollars', () => {
    expect(pokerStakes('dollar')).toEqual({ pokerQuarter: 0.25, pokerDollar: 1 });
    expect(pokerStakes('jpy')).toEqual({ pokerQuarter: 100, pokerDollar: 500 });
    expect(pokerStakes('krw')).toEqual({ pokerQuarter: 500, pokerDollar: 1000 });
    expect(pokerStakes('myr')).toEqual({ pokerQuarter: 1, pokerDollar: 5 });
    expect(pokerStakes('php')).toEqual({ pokerQuarter: 20, pokerDollar: 50 });
    expect(pokerGameLabels('dollar')).toEqual({ pokerQuarter: 'Quarter game', pokerDollar: 'Dollar game' });
    expect(pokerGameLabels('jpy')).toEqual({ pokerQuarter: '¥100 game', pokerDollar: '¥500 game' });
    expect(pokerGameLabels('krw')).toEqual({ pokerQuarter: '₩500 game', pokerDollar: '₩1,000 game' });
    expect(pokerGameLabels('myr')).toEqual({ pokerQuarter: 'RM1 game', pokerDollar: 'RM5 game' });
    expect(pokerGameLabels('php')).toEqual({ pokerQuarter: '₱20 game', pokerDollar: '₱50 game' });
    expect(moneyGameLabel('pokerDollar', 'krw')).toBe('₩1,000 game');
    expect(moneyGameLabel('highGame', 'krw')).toBe('High game');
    expect(moneyGameLabel('pokerQuarter', 'dollar')).toBe('Quarter game');
  });

  it('defaults a league\'s buy-ins to local stakes without touching saved rates', () => {
    expect(defaultBuyIns('dollar')).toBe(DEFAULT_BUY_INS);
    expect(defaultBuyIns('krw')).toEqual({ pokerQuarter: 500, pokerDollar: 1000, highGame: 0, threeSixNine: 0 });
    // No defaults passed: the dollar set every existing caller expects.
    expect(buyInsForLeague({}, 'Tue')).toEqual(DEFAULT_BUY_INS);
    expect(buyInsForLeague({}, 'Tue', defaultBuyIns('jpy')).pokerQuarter).toBe(100);
    // A saved rate is the bowler's own number and wins in any currency.
    expect(buyInsForLeague({ Tue: { pokerQuarter: 300 } }, 'Tue', defaultBuyIns('jpy')).pokerQuarter).toBe(300);
    const costs = costArraysFor(buyInsForLeague({}, 'Tue', defaultBuyIns('krw')), 3, { pokerQuarter: true });
    expect(costs.pokerQuarterCost).toEqual([500, 500, 500]);
  });
});

describe('Money bags in local money', () => {
  it('scales the threshold', () => {
    expect(moneyBagsThreshold('dollar')).toBe(MONEY_BAGS_DOLLARS);
    expect(moneyBagsThreshold('jpy')).toBe(10000);
    expect(moneyBagsThreshold('krw')).toBe(100000);
    expect(moneyBagsThreshold('myr')).toBe(500);
    expect(moneyBagsThreshold('php')).toBe(5000);
  });

  it('is earned at the scaled figure', () => {
    expect(seasonBadges({ lifetimeMoneyWon: 99999, moneyBagsThreshold: 100000 })).not.toContain('money-bags');
    expect(seasonBadges({ lifetimeMoneyWon: 100000, moneyBagsThreshold: 100000 })).toContain('money-bags');
    // No threshold in the context: $100, as before.
    expect(seasonBadges({ lifetimeMoneyWon: 100 })).toContain('money-bags');
  });

  it('keeps a badge earned under the old flat 100', () => {
    expect(seasonBadges({ lifetimeMoneyWon: 5000, legacyMoneyWon: 150, moneyBagsThreshold: 100000 })).toContain('money-bags');
    expect(seasonBadges({ lifetimeMoneyWon: 5000, legacyMoneyWon: 99, moneyBagsThreshold: 100000 })).not.toContain('money-bags');
  });

  it('counts only nights before the change as legacy', () => {
    const night = (date, won) => ({
      bowler: 'Minji', league: 'Tue', date, scores: [180, 190, 200],
      pokerQuarter: [won, 0, 0], pokerDollar: [0, 0, 0], highGameWinnings: [0, 0, 0],
    });
    const earned = sessions => !!competitiveBadges({ sessions, bowler: 'Minji', currency: 'krw' })['money-bags']?.count;
    // ₩500 won before the threshold scaled: already shown, still earned.
    expect(earned([night('2026-09-01', 500)])).toBe(true);
    // The same ₩500 after it: short of ₩100,000.
    expect(earned([night(MONEY_SCALED_FROM, 500)])).toBe(false);
    expect(earned([night(MONEY_SCALED_FROM, 60000), night('2026-10-08', 40000)])).toBe(true);
    // Dollars: unchanged either side of the date.
    const dollars = sessions => !!competitiveBadges({ sessions, bowler: 'Minji', currency: 'dollar' })['money-bags']?.count;
    expect(dollars([night('2026-10-08', 99)])).toBe(false);
    expect(dollars([night('2026-10-08', 100)])).toBe(true);
  });

  it('shows the scaled threshold in the badge text', () => {
    const blurb = () => COMPETITIVE_BADGES.find(b => b.id === 'money-bags').blurb;
    expect(inZone('America/New_York', blurb)).toBe('$100 won in side games, all-time.');
    expect(inZone('Asia/Seoul', blurb)).toBe('₩100,000 won in side games, all-time.');
    expect(inZone('Asia/Tokyo', blurb)).toBe('¥10,000 won in side games, all-time.');
    expect(inZone('Asia/Kuala_Lumpur', blurb)).toBe('RM500 won in side games, all-time.');
    expect(inZone('Asia/Manila', blurb)).toBe('₱5,000 won in side games, all-time.');
  });
});

describe('money in shared text', () => {
  it('reads as before in dollars and in local money elsewhere', () => {
    const hi = () => sessionHighlights({ scores: [180], moneyWon: 12.5 })[0];
    expect(inZone('America/Chicago', hi)).toBe('Won $12.5 in side pots');
    expect(inZone('Asia/Seoul', hi)).toBe('Won ₩13 in side pots');
    const net = () => tournamentLines({ net: 45 }).pop();
    expect(inZone('America/Chicago', net)).toBe('Up $45.00 on the day');
    expect(inZone('Asia/Tokyo', net)).toBe('Up ¥45 on the day');
    const season = () => summaryToText({ bowler: 'Minji', sessions: 1, games: 3, average: 190, highGame: 200, won: 1000, paid: 6000, net: -5000, strikeRate: null }).split('\n').pop();
    expect(inZone('America/Chicago', season)).toBe('−$5000 on the season');
    expect(inZone('Asia/Seoul', season)).toBe('−₩5,000 on the season');
  });

  it('marks a first cash with the bowler\'s money sign', () => {
    expect(milestoneGlyph({ id: 'tourney-cash', target: 1 }, 'dollar')).toBe('$');
    expect(milestoneGlyph({ id: 'tourney-cash', target: 1 }, 'krw')).toBe('₩');
    expect(milestoneGlyph({ id: 'first-spare', target: 1 }, 'krw')).toBe('/');
  });
});

// The catalogs are generated (see their headers). What matters here is
// what the app shows: every label a currency can produce translates, and
// no key still expects a "$" the code no longer prints.
describe('catalogs and money', () => {
  const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'i18n');
  const load = file => {
    const src = fs.readFileSync(path.join(dir, file), 'utf8');
    return JSON.parse(src.slice(src.indexOf('= {') + 2, src.lastIndexOf(';')));
  };
  const CATALOGS = { 'fr-CA.js': 'fr', 'es-419.js': 'es', 'ja-JP.js': 'ja', 'ko-KR.js': 'ko' };

  for (const [file, lang] of Object.entries(CATALOGS)) {
    const cat = load(file);
    const tr = createTranslator(cat);

    it(`${lang}: no pattern keeps a "$" in front of a value`, () => {
      expect(cat.patterns.filter(([en]) => /\$\{\d/.test(en)).map(p => p[0])).toEqual([]);
      const dollarKeys = Object.keys(cat.exact).filter(k => k.includes('$'));
      expect(dollarKeys.sort()).toEqual(['Dollar $', 'Quarter $']);
    });

    it(`${lang}: names every local poker game`, () => {
      for (const c of Object.values(CURRENCIES)) {
        if (c.id === 'dollar') continue;
        for (const label of Object.values(pokerGameLabels(c))) {
          const out = tr.translate(label);
          expect(out).not.toBe(label);
          expect(out).toContain(c.symbol);
          expect(out).not.toMatch(/\bgame\b/);
        }
      }
      // And a plain count still goes to the plural pattern, not to the
      // money one.
      expect(tr.translate('3 games')).not.toContain('3 game');
    });

    it(`${lang}: puts a local amount where the dollar one was`, () => {
      // French re-groups thousands its own way ("₩5 000"); the amount and
      // its symbol are what must survive.
      const t = tr.translate('₩5,000 paid in — up ₩1,000 on the night.');
      const bare = t.replace(/[\s,]/g, '');
      expect(bare).toContain('₩5000');
      expect(bare).toContain('₩1000');
      expect(t).not.toMatch(/paid|night/);
      expect(tr.translate('Poker Winnings (¥)')).toContain('¥');
      expect(tr.translate('Poker Winnings (¥)')).not.toContain('Poker Winnings');
      expect(tr.translate('₩100,000 won in side games, all-time.')).toContain('100');
      expect(tr.translate('₩100,000 won in side games, all-time.')).not.toContain('side games');
    });
  }

  it('fr: dollars still read the French way', () => {
    const fr = createTranslator(load('fr-CA.js'));
    const NB = ' ';
    expect(fr.translate('Poker Winnings ($)')).toBe('Gains au poker ($)');
    expect(fr.translate('$100 won in side games, all-time.')).toBe(`100${NB}$ gagnés en cagnottes, au total.`);
    expect(fr.translate('$7.75 paid in — down $7.75 on the night.')).toBe(`Mise${NB}: 7,75${NB}$ — perte de 7,75${NB}$ pour la soirée.`);
  });
});

describe('India, the UAE and Costa Rica', () => {
  it('have their own money; Hong Kong and Puerto Rico stay on "$"', () => {
    expect(currencyForZone('Asia/Kolkata').id).toBe('inr');
    expect(currencyForZone('Asia/Calcutta').id).toBe('inr');
    expect(currencyForZone('Asia/Dubai').id).toBe('aed');
    expect(currencyForZone('America/Costa_Rica').id).toBe('crc');
    for (const tz of ['Asia/Hong_Kong', 'America/Puerto_Rico', 'Asia/Muscat', 'America/Lima', 'Africa/Johannesburg']) {
      expect(currencyForZone(tz).id).toBe('dollar');
    }
  });

  it('writes each the way it is written there', () => {
    expect(formatMoney(5000, { currency: 'inr' })).toBe('₹5,000');
    expect(formatMoney(12.5, { currency: 'inr' })).toBe('₹13');
    expect(formatMoney(12.5, { currency: 'aed' })).toBe('AED 12.50');
    expect(formatMoney(-5, { currency: 'aed' })).toBe('−AED 5.00');
    expect(formatMoney(45, { currency: 'aed', signed: true, decimals: 0 })).toBe('+AED 45');
    expect(formatMoney(1234.5, { currency: 'aed' })).toBe('AED 1,234.50');
    expect(formatMoney(27000, { currency: 'crc' })).toBe('₡27,000');
    expect(moneySymbol('aed')).toBe('AED');
    expect(moneyStep('0.25', 'inr')).toBe('1');
    expect(moneyStep('0.25', 'aed')).toBe('0.25');
  });

  it('scales thresholds and stakes to house money', () => {
    expect(moneyBagsThreshold('inr')).toBe(5000);
    expect(moneyBagsThreshold('aed')).toBe(500);
    expect(moneyBagsThreshold('crc')).toBe(50000);
    expect(pokerGameLabels('inr')).toEqual({ pokerQuarter: '₹20 game', pokerDollar: '₹50 game' });
    expect(pokerGameLabels('aed')).toEqual({ pokerQuarter: 'AED 1 game', pokerDollar: 'AED 5 game' });
    expect(pokerGameLabels('crc')).toEqual({ pokerQuarter: '₡100 game', pokerDollar: '₡500 game' });
    expect(defaultBuyIns('crc')).toEqual({ pokerQuarter: 100, pokerDollar: 500, highGame: 0, threeSixNine: 0 });
  });

  it('shows the scaled badge threshold and the first-cash sign', () => {
    const blurb = () => COMPETITIVE_BADGES.find(b => b.id === 'money-bags').blurb;
    expect(inZone('Asia/Kolkata', blurb)).toBe('₹5,000 won in side games, all-time.');
    expect(inZone('Asia/Dubai', blurb)).toBe('AED 500 won in side games, all-time.');
    expect(inZone('America/Costa_Rica', blurb)).toBe('₡50,000 won in side games, all-time.');
    expect(milestoneGlyph({ id: 'tourney-cash', target: 1 }, 'aed')).toBe('AED');
    expect(milestoneGlyph({ id: 'tourney-cash', target: 1 }, 'inr')).toBe('₹');
  });

  it('reads the same in shared text', () => {
    const net = () => tournamentLines({ net: 45 }).pop();
    expect(inZone('Asia/Dubai', net)).toBe('Up AED 45.00 on the day');
    expect(inZone('Asia/Kolkata', net)).toBe('Up ₹45 on the day');
  });
});

describe('Kuwait and Brunei', () => {
  it('writes dinars to three decimals; Brunei and Bermuda stay on "$"', () => {
    expect(currencyForZone('Asia/Kuwait').id).toBe('kwd');
    expect(currencyForZone('Asia/Brunei').id).toBe('dollar');
    expect(currencyForZone('Atlantic/Bermuda').id).toBe('dollar');
    expect(formatMoney(1.5, { currency: 'kwd' })).toBe('KD 1.500');
    expect(formatMoney(-0.25, { currency: 'kwd' })).toBe('−KD 0.250');
    expect(formatMoney(1234.5, { currency: 'kwd' })).toBe('KD 1,234.500');
    expect(moneySymbol('kwd')).toBe('KD');
    expect(moneyStep('0.25', 'kwd')).toBe('0.001');
  });

  it('scales to a clean dinar figure', () => {
    expect(scaleMoney(100, 'kwd')).toBe(30);
    expect(moneyBagsThreshold('kwd')).toBe(30);
    expect(pokerGameLabels('kwd')).toEqual({ pokerQuarter: 'KD 0.100 game', pokerDollar: 'KD 0.500 game' });
    const blurb = () => COMPETITIVE_BADGES.find(b => b.id === 'money-bags').blurb;
    expect(inZone('Asia/Kuwait', blurb)).toBe('KD 30 won in side games, all-time.');
    expect(milestoneGlyph({ id: 'tourney-cash', target: 1 }, 'kwd')).toBe('KD');
    const net = () => tournamentLines({ net: 1.5 }).pop();
    expect(inZone('Asia/Kuwait', net)).toBe('Up KD 1.500 on the day');
  });
});
