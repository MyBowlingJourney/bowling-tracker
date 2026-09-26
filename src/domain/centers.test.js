import { describe, it, expect } from 'vitest';
import {
  emptyCenter, normalizeCenter, centerLabel, distanceMiles, distanceLabel, centerKey,
  findExistingCenter, statsByCenter, centerToRow, centerFromRow,
  rackTypeLabel, RACK_TYPES, statsByRackType, normalizeLaneList, laneListLabel, rackTypeForLane,
} from './centers.js';

// Shape taken from a real HERE Discover response.
const arsenal = {
  hereId: 'here:pds:place:840dppnh-42987a39b8963d2647a58aa1fc82a571',
  name: 'Arsenal Bowl',
  address: 'Arsenal Bowl, 4104 Butler St, Pittsburgh, PA 15201-3122, United States',
  city: 'Pittsburgh', state: 'PA', postalCode: '15201-3122', country: 'USA',
  lat: 40.46954, lng: -79.96106,
};

describe('normalizeCenter', () => {
  it('handles a real HERE result', () => {
    const c = normalizeCenter(arsenal);
    expect(c.name).toBe('Arsenal Bowl');
    expect(c.lat).toBe(40.46954);
  });

  it('returns a complete center for missing input', () => {
    expect(normalizeCenter(null)).toEqual(emptyCenter());
  });
});

describe('centerLabel', () => {
  it('includes city and state when known', () => {
    expect(centerLabel(normalizeCenter(arsenal))).toBe('Arsenal Bowl · Pittsburgh, PA');
  });

  it('falls back to the name alone for a hand-entered center', () => {
    expect(centerLabel({ name: 'Small House' })).toBe('Small House');
  });
});

describe('deduplication', () => {
  const existing = [
    { id: 'c1', ...arsenal },
    { id: 'c2', hereId: null, name: 'Small House', city: 'Millvale' },
  ];

  it('matches on HERE id when both sides have one', () => {
    expect(findExistingCenter(arsenal, existing).id).toBe('c1');
  });

  it('matches a hand-entered center on name and city, ignoring case and spacing', () => {
    // Without this, one house splits into two and its stats fragment.
    expect(findExistingCenter({ name: '  small   HOUSE ', city: 'millvale' }, existing).id).toBe('c2');
  });

  it('treats the same name in a different city as a different house', () => {
    expect(findExistingCenter({ name: 'Small House', city: 'Erie' }, existing)).toBeNull();
  });
});

describe('distanceMiles', () => {
  it('converts metres to miles', () => {
    expect(distanceMiles(4364)).toBe(2.7);
  });

  it('returns null when the search was not location-anchored', () => {
    expect(distanceMiles(null)).toBeNull();
  });
});

describe('distanceLabel', () => {
  it('uses miles in the US and kilometres elsewhere', () => {
    expect(distanceLabel(4364, 'en-US')).toBe('2.7 mi');
    expect(distanceLabel(4364, 'en')).toBe('2.7 mi');
    expect(distanceLabel(4364, 'en-CA')).toBe('4.4 km');
    expect(distanceLabel(4364, 'en-AU')).toBe('4.4 km');
  });

  it('follows the region of a Spanish phone: miles in the US and Puerto Rico', () => {
    expect(distanceLabel(4364, 'es-US')).toBe('2.7 mi');
    expect(distanceLabel(4364, 'es-PR')).toBe('2.7 mi');
    expect(distanceLabel(4364, 'es-MX')).toBe('4.4 km');
  });

  it('always uses kilometres in French', () => {
    expect(distanceLabel(4364, 'en-US', true)).toBe('4.4 km');
  });

  it('returns null when the search was not location-anchored', () => {
    expect(distanceLabel(null, 'en-CA')).toBeNull();
  });
});

describe('statsByCenter', () => {
  const leagues = [
    { name: 'Thursday House Shot', centerId: 'c1' },
    { name: 'Tuesday House Shot', centerId: 'c2' },
    { name: 'No Center League' },
  ];
  const centers = [
    { id: 'c1', name: 'Arsenal Bowl', city: 'Pittsburgh', state: 'PA' },
    { id: 'c2', name: 'Small House', city: 'Millvale' },
  ];
  const sessions = [
    { bowler: 'Ryan', league: 'Thursday House Shot', scores: [200, 210, 220] },
    { bowler: 'Ryan', league: 'Thursday House Shot', scores: [190, 200, 180] },
    { bowler: 'Ryan', league: 'Tuesday House Shot', scores: [170, 160, 180] },
    { bowler: 'Ryan', league: 'No Center League', scores: [300, 300, 300] },
    { bowler: 'Aaron', league: 'Thursday House Shot', scores: [100, 100, 100] },
  ];

  it('averages a bowler by house, best first', () => {
    const out = statsByCenter(sessions, leagues, centers, 'Ryan');
    expect(out.map(s => s.center.name)).toEqual(['Arsenal Bowl', 'Small House']);
    expect(out[0].average).toBe(200);
    expect(out[1].average).toBe(170);
  });

  it('excludes leagues with no center rather than inventing a bucket', () => {
    // Those 300s would otherwise show up as an "unknown house" with a
    // meaningless average.
    const out = statsByCenter(sessions, leagues, centers, 'Ryan');
    expect(out.some(s => s.average === 300)).toBe(false);
  });

  it('scopes to the requested bowler', () => {
    expect(statsByCenter(sessions, leagues, centers, 'Aaron')[0].average).toBe(100);
  });

  it('tolerates empty inputs', () => {
    expect(statsByCenter(null, null, null, 'Ryan')).toEqual([]);
  });
});

describe('supabase round trip', () => {
  it('preserves the HERE id and coordinates', () => {
    const back = centerFromRow(centerToRow({ id: 'c1', ...arsenal }, 'u1'));
    expect(back.hereId).toBe(arsenal.hereId);
    expect([back.lat, back.lng]).toEqual([40.46954, -79.96106]);
  });
});

describe('rack type', () => {
  // String pins are tethered and pulled back up; free-fall pins fall
  // freely. They carry differently, which is why USBC certifies string
  // pinsetters separately -- so a strike rate at one is not comparable
  // with a strike rate at the other.
  it('defaults to unrecorded, not free fall', () => {
    expect(emptyCenter().rackType).toBe('');
  });

  it('accepts both the client and the cloud field name', () => {
    expect(normalizeCenter({ name: 'X', rackType: 'string' }).rackType).toBe('string');
    expect(normalizeCenter({ name: 'X', rack_type: 'freefall' }).rackType).toBe('freefall');
  });

  // A rack type nobody can interpret is worse than none.
  it('falls back to unrecorded for anything unrecognised', () => {
    expect(normalizeCenter({ name: 'X', rackType: 'wooden' }).rackType).toBe('');
    expect(normalizeCenter({ name: 'X', rackType: 42 }).rackType).toBe('');
  });

  it('labels the ones it knows', () => {
    expect(rackTypeLabel('string')).toBe('String');
    expect(rackTypeLabel('freefall')).toBe('Free fall');
    expect(rackTypeLabel('nonsense')).toBe('');
  });

  it('survives junk', () => {
    for (const junk of [null, undefined, 'x', 42, []]) {
      expect(() => normalizeCenter(junk)).not.toThrow();
      expect(() => rackTypeLabel(junk)).not.toThrow();
    }
  });
});

describe('rack type vs "not sure"', () => {
  it('offers the real answers and mixed, but no "not sure"', () => {
    // "mixed" is a real answer about the house, not a way of saying "I
    // don't know" -- a bowler who doesn't know still leaves it blank.
    expect(RACK_TYPES.map(r => r.id).sort()).toEqual(['freefall', 'mixed', 'string']);
  });

  it('still normalizes a blank to unrecorded', () => {
    expect(normalizeCenter({ name: 'X' }).rackType).toBe('');
  });
});

describe('statsByRackType', () => {
  const leagues = [{ name: 'Tue', centerId: 'c1' }, { name: 'Thu', centerId: 'c2' }, { name: 'Fri', centerId: 'c3' }];
  const centers = [
    { id: 'c1', rackType: 'freefall' },
    { id: 'c2', rackType: 'string' },
    { id: 'c3', rackType: '' }, // unrecorded
  ];
  const sessions = [
    { bowler: 'Ryan', league: 'Tue', scores: [200, 210, 190] },
    { bowler: 'Ryan', league: 'Thu', scores: [180, 175, 185] },
    { bowler: 'Ryan', league: 'Fri', scores: [150, 150, 150] },
  ];
  const strike = (league, desc) => ({ bowler: 'Ryan', league, result: 'Strike', strikeDescription: desc });
  const shots = [
    strike('Tue', 'Flush'), strike('Tue', 'Messenger'),
    strike('Thu', 'Messenger'), strike('Thu', 'Messenger'), strike('Thu', 'High'),
    strike('Fri', 'Messenger'),
  ];

  it('separates average by rack type', () => {
    const r = statsByRackType(sessions, shots, leagues, centers, 'Ryan');
    expect(r.find(x => x.rackType === 'Free fall').average).toBe(200);
    expect(r.find(x => x.rackType === 'String').average).toBe(180);
  });

  // A centre with no rack type recorded contributes to neither bucket --
  // it is not guessed into one.
  it('excludes a centre with no rack type recorded', () => {
    const r = statsByRackType(sessions, shots, leagues, centers, 'Ryan');
    const totalGames = r.reduce((a, x) => a + x.games, 0);
    expect(totalGames).toBe(6); // Tue + Thu, not Fri's 3
  });

  // Messenger rate is against STRIKES, not every shot -- a messenger is
  // a strike carried a particular way.
  it('rates messengers against strikes, not all shots', () => {
    const r = statsByRackType(sessions, shots, leagues, centers, 'Ryan');
    expect(r.find(x => x.rackType === 'Free fall').messengerRate).toBe(50);
    expect(r.find(x => x.rackType === 'String').messengerRate).toBeCloseTo(66.7, 1);
  });

  // "0% of nothing" is not a rate.
  it('gives null rather than 0 when there are no strikes', () => {
    const r = statsByRackType([{ bowler: 'Ryan', league: 'Tue', scores: [180] }], [], leagues, centers, 'Ryan');
    expect(r.find(x => x.rackType === 'Free fall').messengerRate).toBe(null);
  });

  it('keeps one bowler out of another’s figures', () => {
    const withDave = [...sessions, { bowler: 'Dave', league: 'Tue', scores: [90] }];
    const r = statsByRackType(withDave, shots, leagues, centers, 'Ryan');
    expect(r.find(x => x.rackType === 'Free fall').games).toBe(3);
  });

  it('survives junk', () => {
    for (const junk of [null, undefined, 'x', 42, {}, [null]]) {
      expect(() => statsByRackType(junk, junk, junk, junk, junk)).not.toThrow();
    }
    expect(statsByRackType(null, null, null, null, 'Ryan')).toEqual([]);
  });
});

describe('rack type persistence', () => {
  // Without this the value lived only in memory and vanished on reload,
  // which would have looked like the chips not saving.
  it('round-trips through a row', () => {
    const row = centerToRow({ id: '1', name: 'Holiday', rackType: 'string' }, 'u1');
    expect(row.rack_type).toBe('string');
    expect(centerFromRow(row).rackType).toBe('string');
  });

  // Unrecorded is NULL, not an empty string -- an empty string would be a
  // third value meaning the same thing as blank.
  it('writes null when unrecorded', () => {
    expect(centerToRow({ id: '2', name: 'X' }, 'u1').rack_type).toBe(null);
    expect(centerFromRow({ id: '2', name: 'X', rack_type: null }).rackType).toBe('');
  });
});

describe('free fall against string', () => {
  const leagues = [{ name: 'Tuesday', centerId: 'c1' }, { name: 'Thursday', centerId: 'c2' }];
  const centers = [
    { id: 'c1', name: 'Oak Hill', rackType: 'freefall' },
    { id: 'c2', name: 'Maple', rackType: 'string' },
  ];
  const sessions = [
    { bowler: 'R', league: 'Tuesday', date: 'd1', scores: [210, 220, 200] },
    { bowler: 'R', league: 'Thursday', date: 'd2', scores: [180, 175, 190] },
  ];
  const strike = (league, strikeDescription) => ({
    bowler: 'R', league, date: 'd', ballNum: '1', result: 'Strike', strikeDescription,
  });

  // String pins are tethered, so they deflect differently and messengers
  // are rarer. USBC certifies them separately for that reason.
  it('separates the two rack types', () => {
    const r = statsByRackType(sessions, [], leagues, centers, 'R');
    const ff = r.find(x => x.rackType === 'Free fall');
    const st = r.find(x => x.rackType === 'String');
    expect(ff.average).toBe(210);
    expect(st.average).toBe(181.7);
  });

  it('counts messengers per rack type', () => {
    const shots = [
      strike('Tuesday', 'Messenger'), strike('Tuesday', 'Flush'),
      strike('Tuesday', 'Flush'), strike('Tuesday', 'Flush'),
      strike('Thursday', 'Flush'),
    ];
    const r = statsByRackType(sessions, shots, leagues, centers, 'R');
    expect(r.find(x => x.rackType === 'Free fall').messengerRate).toBe(25);
    expect(r.find(x => x.rackType === 'String').messengerRate).toBe(0);
  });

  // A rate off no strikes is not a fact about pins.
  it('has no messenger rate without strikes', () => {
    const r = statsByRackType(sessions, [], leagues, centers, 'R');
    expect(r.find(x => x.rackType === 'Free fall').messengerRate).toBe(null);
  });

  // One type is not a comparison -- it is your average again.
  it('reports one type when only one has been bowled', () => {
    const r = statsByRackType(sessions, [], [leagues[0]], [centers[0]], 'R')
      .filter(x => x.games > 0);
    expect(r).toHaveLength(1);
  });

  it('reports nothing when rack type was never recorded', () => {
    const blank = [{ id: 'c1', name: 'Oak Hill', rackType: '' }];
    const r = statsByRackType(sessions, [], [leagues[0]], blank, 'R')
      .filter(x => x.games > 0);
    expect(r).toHaveLength(0);
  });

  it('survives junk', () => {
    for (const j of [null, undefined, 'x', 42]) {
      expect(() => statsByRackType(j, j, j, j, j)).not.toThrow();
    }
  });
});


describe('mixed houses', () => {
  const mixed = { id: 'm1', rackType: 'mixed', freefallLanes: [9, 10, 11, 12] };

  it('reads lane lists however they are typed', () => {
    expect(normalizeLaneList('1, 2, 7-10')).toEqual([1, 2, 7, 8, 9, 10]);
    expect(normalizeLaneList(['3', '5-6', 9])).toEqual([3, 5, 6, 9]);
    expect(normalizeLaneList('rubbish')).toEqual([]);
    expect(normalizeLaneList(null)).toEqual([]);
  });

  it('reads a lane list back in ranges', () => {
    expect(laneListLabel([1, 2, 3, 4, 9, 12])).toBe('1-4, 9, 12');
  });

  it('answers per lane', () => {
    expect(rackTypeForLane(mixed, 9)).toBe('freefall');
    expect(rackTypeForLane(mixed, '10')).toBe('freefall');
    expect(rackTypeForLane(mixed, 3)).toBe('string');
  });

  it('refuses to guess without a lane, or before the lanes are recorded', () => {
    expect(rackTypeForLane(mixed, '')).toBeNull();
    expect(rackTypeForLane(mixed, null)).toBeNull();
    expect(rackTypeForLane({ rackType: 'mixed', freefallLanes: [] }, 9)).toBeNull();
  });

  it('leaves single-type houses alone', () => {
    expect(rackTypeForLane({ rackType: 'string' }, 4)).toBe('string');
    expect(rackTypeForLane({ rackType: 'freefall' }, null)).toBe('freefall');
    expect(rackTypeForLane({ rackType: '' }, 4)).toBeNull();
  });

  it('buckets shots in one house by the lane they were thrown on', () => {
    const leagues = [{ name: 'Mon', centerId: 'm1' }];
    const shots = [
      { bowler: 'R', league: 'Mon', date: '2026-01-05', game: '1', lane: '9', ballNum: 1, result: 'Strike' },
      { bowler: 'R', league: 'Mon', date: '2026-01-05', game: '1', lane: '9', ballNum: 1, result: 'Strike' },
      { bowler: 'R', league: 'Mon', date: '2026-01-05', game: '2', lane: '3', ballNum: 1, result: 'Other Leave', otherLeave: ['10'] },
      // No lane: cannot be placed, so it counts for neither.
      { bowler: 'R', league: 'Mon', date: '2026-01-05', game: '3', lane: '', ballNum: 1, result: 'Strike' },
    ];
    const [ff, st] = statsByRackType([], shots, leagues, [mixed], 'R');
    expect(ff.firstBalls).toBe(2);
    expect(ff.strikes).toBe(2);
    expect(st.firstBalls).toBe(1);
    expect(st.strikes).toBe(0);
  });

  it('gives a game score to the rack type its shots were bowled on', () => {
    const leagues = [{ name: 'Mon', centerId: 'm1' }];
    const sessions = [{ bowler: 'R', league: 'Mon', date: '2026-01-05', scores: [200, 150, 180] }];
    const shots = [
      { bowler: 'R', league: 'Mon', date: '2026-01-05', game: '1', lane: '9', ballNum: 1, result: 'Strike' },
      { bowler: 'R', league: 'Mon', date: '2026-01-05', game: '2', lane: '4', ballNum: 1, result: 'Strike' },
      // Game 3 crossed both pairs, so its score belongs to neither.
      { bowler: 'R', league: 'Mon', date: '2026-01-05', game: '3', lane: '9', ballNum: 1, result: 'Strike' },
      { bowler: 'R', league: 'Mon', date: '2026-01-05', game: '3', lane: '4', ballNum: 1, result: 'Strike' },
    ];
    const [ff, st] = statsByRackType(sessions, shots, leagues, [mixed], 'R');
    expect(ff.games).toBe(1);
    expect(ff.average).toBe(200);
    expect(st.games).toBe(1);
    expect(st.average).toBe(150);
  });
});

import { deviceLocationAllowed, COUNTRY_SEARCH_ANCHOR } from './centers.js';
describe('deviceLocationAllowed', () => {
  it('never asks for the device location on Korean time', () => {
    expect(deviceLocationAllowed('Asia/Seoul')).toBe(false);
    expect(deviceLocationAllowed('America/New_York')).toBe(true);
    expect(deviceLocationAllowed('')).toBe(true);
    expect(COUNTRY_SEARCH_ANCHOR['Asia/Seoul']).toEqual({ lat: 36.35, lng: 127.8 });
  });
});

import { centerNameKey, centerMatchRank, matchCentersByName } from './centers.js';
describe('matching a centre name while typing', () => {
  it('matches the start of the name before it is finished', () => {
    expect(centerMatchRank('Holi', 'Holiday Bowl')).toBe(0);
    expect(centerMatchRank('holiday b', 'Holiday Bowl')).toBe(0);
    expect(centerMatchRank('Holiday Bowl', 'Holiday Bowl')).toBe(0);
  });
  it('matches the start of any word, in any order', () => {
    expect(centerMatchRank('bowl', 'Holiday Bowl')).toBe(1);
    expect(centerMatchRank('bo hol', 'Holiday Bowl')).toBe(1);
    expect(centerMatchRank('lanes', 'Holiday Bowl')).toBe(null);
  });
  it('ignores case, accents and punctuation', () => {
    expect(centerNameKey("Dave's Salle de Quilles Été")).toBe('daves salle de quilles ete');
    expect(centerMatchRank('daves', "Dave's Lanes")).toBe(0);
    expect(centerMatchRank('quilles ete', 'Salle de Quilles Été')).toBe(1);
    expect(centerMatchRank('holidaybowl', 'Holiday Bowl')).toBe(2);
  });
  it('matches Korean and Japanese names as they are typed', () => {
    expect(centerMatchRank('홀리', '홀리데이 볼링장')).toBe(0);
    expect(centerMatchRank('볼링', '홀리데이 볼링장')).toBe(1);
    expect(centerMatchRank('ラウンド', 'ラウンドワン 横浜')).toBe(0);
  });
  it('does not match unrelated names', () => {
    expect(centerMatchRank('Holiday', 'AMF Lanes')).toBe(null);
    expect(centerMatchRank('Holiday', '')).toBe(null);
  });
  it('ranks the name that starts with the text first, then the nearest', () => {
    const list = [
      { name: 'Bowl-O-Rama', distance: 900 },
      { name: 'Holiday Bowl', distance: 5000 },
      { name: 'Super Holiday Lanes', distance: 100 },
      { name: 'Holiday Lanes', distance: 2000 },
      { name: 'AMF Lanes', distance: 50 },
    ];
    expect(matchCentersByName('holi', list).map(c => c.name))
      .toEqual(['Holiday Lanes', 'Holiday Bowl', 'Super Holiday Lanes']);
    expect(matchCentersByName('', list)).toHaveLength(5);
    expect(matchCentersByName('x', null)).toEqual([]);
  });
});
describe('centre name keys keep Japanese voiced kana whole', () => {
  it('does not split ド into ト and a mark', () => {
    expect(centerNameKey('ラウンドワン')).toBe('ラウンドワン');
  });
});
