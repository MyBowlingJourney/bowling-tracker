import { describe, it, expect } from 'vitest';
import { nightcapFacts, nightcapPayload, nightShots, seasonShots, rateSet,
  MIN_FIRST_BALLS, MIN_NIGHTS_FOR_SEASON, MAX_FACTS } from './nightcap.js';

const NIGHT = { bowler: 'Ryan', league: 'Tuesday House Shot', date: '2026-01-06' };

// A first ball. ballNum is deliberately left off on most of these: the
// real data is mostly null there, and a helper that always sets 1 would
// test a shape the app rarely sees.
function ball(over = {}) {
  return { id: Math.random().toString(36), ...NIGHT, game: '1', frame: '1', result: 'Strike', otherLeave: [], spareMade: '', ...over };
}

function leave(pins, over = {}) {
  return ball({ result: 'Other Leave', otherLeave: pins, ...over });
}

// Enough first balls to clear the floor, all strikes, so any fact under
// test is the only interesting thing in the list.
function filler(n = MIN_FIRST_BALLS) {
  return Array.from({ length: n }, (_, i) => ball({ frame: String((i % 10) + 1) }));
}

const textOf = (result, id) => (result.facts.find(f => f.id === id) || {}).text;

describe('nightShots', () => {
  it('keeps one bowler, one league, one date', () => {
    const shots = [
      ball(),
      ball({ bowler: 'Kim' }),
      ball({ league: 'Thursday House Shot' }),
      ball({ date: '2026-01-13' }),
    ];
    expect(nightShots(shots, NIGHT)).toHaveLength(1);
  });

  it('survives nulls in the list', () => {
    expect(nightShots([null, undefined, ball()], NIGHT)).toHaveLength(1);
  });
});

describe('nightcapFacts', () => {
  it('says nothing about a night with too little logged', () => {
    const r = nightcapFacts(filler(MIN_FIRST_BALLS - 1), NIGHT);
    expect(r.enough).toBe(false);
    expect(r.facts).toEqual([]);
  });

  it('counts a first ball whether ballNum is null or 1', () => {
    const shots = [...filler(5), ...filler(5).map(s => ({ ...s, ballNum: 1 }))];
    expect(nightcapFacts(shots, NIGHT).firstBalls).toBe(10);
  });

  // A second ball is not a first ball, and counting it as one would put
  // every spare attempt into the strike percentage's denominator.
  it('leaves second balls out of the first-ball count', () => {
    const shots = [...filler(), ball({ ballNum: 2, result: 'Other Leave', otherLeave: ['10'] })];
    expect(nightcapFacts(shots, NIGHT).firstBalls).toBe(MIN_FIRST_BALLS);
  });

  it('states the strike count with its sample', () => {
    const shots = [...filler(8), leave(['10']), leave(['10'])];
    expect(textOf(nightcapFacts(shots, NIGHT), 'strikes'))
      .toBe('8 strikes on 10 first balls (80%).');
  });

  it('reports the scores and the gap to the league average', () => {
    const r = nightcapFacts(filler(), { ...NIGHT, scores: [180, 200, 190], priorAverage: 175 });
    expect(textOf(r, 'series')).toContain('570 series, 190 average over 3 games');
    expect(textOf(r, 'vsAverage')).toBe('That is 15 above their league average of 175.');
  });

  it('excludes splits from the spare conversion', () => {
    const shots = [
      ...filler(),
      leave(['7', '10'], { spareMade: 'No' }),   // split -- not a spare miss
      leave(['10'], { spareMade: 'Yes' }),
      leave(['4'], { spareMade: 'No' }),
    ];
    expect(textOf(nightcapFacts(shots, NIGHT), 'spares'))
      .toBe('1 of 2 makeable spares converted (50%), splits excluded.');
  });

  it('names the splits it saw', () => {
    const shots = [...filler(), leave(['7', '10'], { spareMade: 'No' }), leave(['3', '10'], { spareMade: 'Yes' })];
    const t = textOf(nightcapFacts(shots, NIGHT), 'splits');
    expect(t).toContain('2 splits tonight, 1 converted');
    expect(t).toContain('7-10');
    expect(t).toContain('Baby split');
  });

  it('says nothing about splits on a night with none', () => {
    expect(textOf(nightcapFacts(filler(), NIGHT), 'splits')).toBeUndefined();
  });

  it('reports which side the leaves sat on, and the hand', () => {
    const shots = [
      ...filler(6),
      leave(['3', '6']), leave(['10']), leave(['6']), leave(['9']),
    ];
    const t = textOf(nightcapFacts(shots, NIGHT), 'leaveSide');
    expect(t).toContain('4 entirely on the right');
    expect(t).toContain('right-handed');
  });

  it('names the left-hander as left-handed', () => {
    const shots = [...filler(6), leave(['3']), leave(['10']), leave(['6']), leave(['9'])];
    expect(textOf(nightcapFacts(shots, { ...NIGHT, leftHanded: true }), 'leaveSide'))
      .toContain('left-handed');
  });

  // Four is the floor. Three leaves on one side out of thirty frames is
  // a coincidence, and stated as a finding it becomes advice.
  it('will not call a side from three leaves', () => {
    const shots = [...filler(7), leave(['10']), leave(['6']), leave(['9'])];
    expect(textOf(nightcapFacts(shots, NIGHT), 'leaveSide')).toBeUndefined();
  });

  it('breaks the side skew down by game when there is more than one', () => {
    const shots = [
      ...filler(6),
      leave(['10'], { game: '1' }), leave(['6'], { game: '1' }),
      leave(['9'], { game: '2' }), leave(['3'], { game: '2' }),
    ];
    expect(textOf(nightcapFacts(shots, NIGHT), 'leaveSideByGame'))
      .toBe('Left/right leaves by game — G1: 0L/2R, G2: 0L/2R.');
  });

  it('passes on the misses the bowler logged themselves', () => {
    const shots = [...filler(7), leave(['10'], { miss: ['Right'] }), leave(['4'], { miss: ['Right'] }), leave(['2'], { miss: ['Left'] })];
    expect(textOf(nightcapFacts(shots, NIGHT), 'misses'))
      .toBe('Misses the bowler logged themselves: Right 2, Left 1 (3 recorded).');
  });

  // Five first balls against thirty is not a comparison, and offered as
  // one it reads as "your spare ball isn't striking".
  it('will not compare a ball that barely got thrown', () => {
    const shots = [
      ...filler(12).map(s => ({ ...s, ball: 'Phaze II' })),
      ...filler(3).map(s => ({ ...s, ball: 'Zen' })),
    ];
    expect(textOf(nightcapFacts(shots, NIGHT), 'byBall')).toBeUndefined();
  });

  it('compares two balls that both saw real work', () => {
    const shots = [
      ...filler(8).map(s => ({ ...s, ball: 'Phaze II' })),
      ...filler(8).map(s => ({ ...s, ball: 'Zen', result: 'Other Leave', otherLeave: ['10'] })),
    ];
    const t = textOf(nightcapFacts(shots, NIGHT), 'byBall');
    expect(t).toContain('Phaze II: 8 strikes on 8 first balls');
    expect(t).toContain('Zen: 0 strikes on 8 first balls');
    expect(t).toContain('small');
  });

  it('carries the pins left on the lane through unchanged', () => {
    expect(textOf(nightcapFacts(filler(), { ...NIGHT, pinsLeftOnLane: 34 }), 'pinsLeft'))
      .toContain('34 pins were left on the lane');
    // Nothing missed is not a fact worth a sentence.
    expect(textOf(nightcapFacts(filler(), { ...NIGHT, pinsLeftOnLane: 0 }), 'pinsLeft')).toBeUndefined();
  });

  it('does not throw on damaged rows', () => {
    const shots = [null, { }, ...filler(), { ...ball(), otherLeave: null, miss: null }];
    expect(() => nightcapFacts(shots, NIGHT)).not.toThrow();
  });
});

// A season of nights before tonight: n dates, each a full-ish night, in
// the same league. Leaves sit on the LEFT so tonight's right-side run is
// visibly different rather than more of the same.
function season(nights = MIN_NIGHTS_FOR_SEASON + 1) {
  const out = [];
  for (let d = 0; d < nights; d++) {
    const date = `2025-11-${String(d + 1).padStart(2, '0')}`;
    for (let i = 0; i < 30; i++) {
      const frame = String((i % 10) + 1), game = String(Math.floor(i / 10) + 1);
      out.push(i % 3 === 0
        ? { ...leave(['4'], { spareMade: 'Yes' }), date, game, frame, id: `s${d}-${i}` }
        : { ...ball(), date, game, frame, id: `s${d}-${i}` });
    }
  }
  return out;
}

describe('the season a night sits in', () => {
  it('offers nothing until there are enough nights behind it', () => {
    const r = nightcapFacts([...filler(30), ...season(MIN_NIGHTS_FOR_SEASON - 1)], NIGHT);
    expect(r.hasSeason).toBe(false);
    expect(r.facts.some(f => f.id.startsWith('season'))).toBe(false);
  });

  it('compares tonight with the season once the history is there', () => {
    const r = nightcapFacts([...filler(30), ...season()], NIGHT);
    expect(r.hasSeason).toBe(true);
    // Both figures and both samples in one sentence -- the model must
    // never be left to subtract them itself.
    const t = textOf(r, 'seasonStrikes');
    expect(t).toContain('Season so far in this league');
    expect(t).toContain('Tonight was');
    expect(t).toContain('nights');
  });

  it('counts nights, not sessions it was told about', () => {
    const r = nightcapFacts([...filler(30), ...season(9)], NIGHT);
    expect(r.seasonNights).toBe(9);
  });

  // The line the scoresheet has never been able to show.
  it('says where the leaves usually sit against where they sat tonight', () => {
    const shots = [...filler(20), ...Array.from({ length: 10 }, (_, i) =>
      ({ ...leave(['10']), id: `t${i}`, frame: String((i % 10) + 1) })), ...season()];
    const t = textOf(nightcapFacts(shots, NIGHT), 'seasonLeaveSide');
    expect(t).toContain('Season leaves with a side');
    expect(t).toContain('Tonight:');
  });

  it('holds a statistic back when the season has the nights but not the sample', () => {
    // Nine nights, but every frame a strike, so there are no season spare
    // attempts to compare against.
    const thin = [];
    for (let d = 0; d < 9; d++) for (let i = 0; i < 30; i++)
      thin.push({ ...ball(), date: `2025-12-${String(d + 1).padStart(2, '0')}`, id: `x${d}-${i}` });
    const r = nightcapFacts([...filler(20), leave(['4'], { spareMade: 'No' }), ...thin], NIGHT);
    expect(r.hasSeason).toBe(true);
    expect(textOf(r, 'seasonSpares')).toBeUndefined();
  });
});

describe('seasonShots', () => {
  it('excludes tonight by date rather than by ordering', () => {
    const shots = [ball(), { ...ball(), date: '2025-12-01' }, { ...ball(), date: '2026-02-01' }];
    // A make-up game entered with a LATER date is still not tonight.
    expect(seasonShots(shots, NIGHT)).toHaveLength(2);
  });
});

describe('rateSet', () => {
  it('computes tonight and the season the same way', () => {
    const r = rateSet([...filler(8), leave(['10'], { spareMade: 'Yes' }), leave(['4'], { spareMade: 'No' })]);
    expect(r.firstBalls).toBe(10);
    expect(r.strikes).toBe(8);
    expect(r.spareAttempts).toBe(2);
    expect(r.sparesMade).toBe(1);
    expect(r.nights).toBe(1);
  });
});

describe('nightcapPayload', () => {
  it('is null when there is nothing worth saying', () => {
    expect(nightcapPayload(filler(2), NIGHT)).toBe(null);
  });

  it('sends plain sentences, not fields', () => {
    const p = nightcapPayload(filler(), NIGHT);
    expect(p.facts.every(f => typeof f === 'string')).toBe(true);
    expect(p.firstBalls).toBe(MIN_FIRST_BALLS);
  });

  it('keeps every season line when it has to trim', () => {
    const shots = [...filler(30), ...season(12)];
    const p = nightcapPayload(shots, { ...NIGHT, scores: [200, 210, 190], priorAverage: 180, pinsLeftOnLane: 40 });
    const seasonLines = p.facts.filter(f => f.startsWith('Season'));
    expect(seasonLines.length).toBeGreaterThan(0);
    expect(p.facts.length).toBeLessThanOrEqual(MAX_FACTS);
    // Every season line survived -- the trim came out of tonight.
    expect(p.hasSeason).toBe(true);
  });

  it('stays inside its cap', () => {
    const shots = [
      ...filler(20),
      ...Array.from({ length: 10 }, (_, i) => leave(['3', '10'], { game: String((i % 3) + 1), spareMade: 'No', miss: ['Right'] })),
    ];
    const p = nightcapPayload(shots, { ...NIGHT, scores: [200, 210, 190], priorAverage: 180, pinsLeftOnLane: 40 });
    expect(p.facts.length).toBeLessThanOrEqual(12);
    expect(JSON.stringify(p).length).toBeLessThanOrEqual(2400);
  });
});
