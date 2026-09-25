import { describe, it, expect } from 'vitest';
import {
  placeBall, layoutEffect, surfaceTexture, gamesByBall, scoringByBall, findGaps,
  fillCandidates, placeArsenal, pointFor, MAP_VIEWS, isSpareBall, compareBags,
} from './arsenalMap.js';

const phaze = { coverstock: 'solid', coreType: 'symmetric', rg: '2.48', diff: '0.051' };
const hyRoadPearl = { coverstock: 'pearl', coreType: 'symmetric', rg: '2.57', diff: '0.046' };
const widow = { coverstock: 'hybrid', coreType: 'asymmetric', rg: '2.50', diff: '0.058', intDiff: '0.018' };
const weakPearl = { coverstock: 'pearl', coreType: 'symmetric', rg: '2.68', diff: '0.006' };

describe('placeBall', () => {
  it('puts a sanded solid early and strong, a polished pearl long and sharp', () => {
    const solid = placeBall(phaze, null, 'Box');
    const pearl = placeBall(hyRoadPearl, null, 'Polish');
    expect(solid.strength).toBeGreaterThan(pearl.strength);
    expect(solid.length).toBeLessThan(pearl.length);
    expect(solid.shape).toBeLessThan(pearl.shape);
    expect(solid.tags).toEqual({ strength: 'Strong', length: 'Early', shape: 'Smooth' });
  });

  it('weights the cover and surface above the core', () => {
    // Same core, different surface: a big move. Same surface, a small
    // change of RG: a small one.
    const sanded = placeBall(phaze, null, '500');
    const polished = placeBall(phaze, null, 'Polish');
    const higherRg = placeBall({ ...phaze, rg: '2.52' }, null, 'Box');
    const box = placeBall(phaze, null, 'Box');
    expect(sanded.strength - polished.strength).toBeGreaterThan(Math.abs(box.strength - higherRg.strength) * 3);
  });

  it('moves with the layout: a high drilling angle goes longer', () => {
    const early = placeBall(phaze, { system: 'dual_angle', values: { drillingAngle: '30', pinToPap: '4', valAngle: '45' } }, 'Box');
    const late = placeBall(phaze, { system: 'dual_angle', values: { drillingAngle: '80', pinToPap: '4', valAngle: '45' } }, 'Box');
    expect(late.length).toBeGreaterThan(early.length);
  });

  it('reports low confidence when only the cover is known', () => {
    const p = placeBall({ coverstock: 'pearl' }, null, '');
    expect(p.confidence).toBeLessThan(0.7);
    expect(p.surfaceAssumed).toBe(true);
  });

  it('cannot place a ball with nothing entered', () => {
    const p = placeBall({}, null, '');
    expect(p.strength).toBeNull();
  });
});

describe('surfaceTexture / layoutEffect', () => {
  it('reads Box as the factory finish for the cover', () => {
    expect(surfaceTexture('Box', 'pearl').value).toBeLessThan(surfaceTexture('Box', 'solid').value);
    expect(surfaceTexture('1000', 'pearl')).toEqual({ value: 0.88, assumed: false });
  });
  it('returns null for no layout and a flare factor for a pin near 4"', () => {
    expect(layoutEffect(null)).toBeNull();
    expect(layoutEffect({ system: 'vls', values: { pinToPap: '4', psaToPap: '4', pinBuffer: '2' } }).flare).toBe(1);
  });
});

describe('scoring by ball', () => {
  const sessions = [
    { bowler: 'Ryan', league: 'Tue', date: '2026-09-01', sessionSeq: 1, scores: [220, 210, 180] },
    { bowler: 'Ryan', league: 'Tue', date: '2026-09-08', sessionSeq: 1, scores: [230, 200, 170] },
  ];
  const eq = {
    'Ryan|Tue|2026-09-01|1|1': { ball: 'Phaze II' }, 'Ryan|Tue|2026-09-01|2|1': { ball: 'Phaze II' },
    'Ryan|Tue|2026-09-01|3|1': { ball: 'Hy-Road' }, 'Ryan|Tue|2026-09-08|1|1': { ball: 'Phaze II' },
  };
  const shots = [
    ...Array.from({ length: 10 }, (_, i) => ({ bowler: 'Ryan', league: 'Tue', date: '2026-09-08', game: '2', frame: String(i + 1), ball: 'Phaze II', sessionSeq: 1 })),
    ...Array.from({ length: 10 }, (_, i) => ({ bowler: 'Ryan', league: 'Tue', date: '2026-09-08', game: '3', frame: String(i + 1), ball: 'Hy-Road', sessionSeq: 1 })),
  ];
  it('attributes a game to the typed ball, else the ball thrown most', () => {
    const g = gamesByBall(sessions, shots, eq, 'Ryan');
    expect(g).toHaveLength(6);
    expect(g.filter(x => x.ball === 'Phaze II').map(x => x.score)).toEqual([220, 210, 230, 200]);
  });
  it('averages each ball against the bowler, and does not call a thin sample', () => {
    const s = scoringByBall(gamesByBall(sessions, shots, eq, 'Ryan'));
    expect(s.overall).toBe(202);
    expect(s.byBall['Phaze II']).toMatchObject({ games: 4, avg: 215, delta: 13, scoresWell: false });
    expect(s.byBall['Hy-Road']).toMatchObject({ games: 2, avg: 175 });
  });
});

describe('findGaps', () => {
  const place = (name, specs, surface = 'Box') => ({ name, spare: false, specs, ...placeBall(specs, null, surface) });
  it('finds no spare, nothing for dry lanes, and a missing-specs ball', () => {
    const g = findGaps([place('Phaze', phaze), place('Widow', widow), { name: 'Mystery', spare: false, strength: null, length: null, shape: null }]);
    const ids = g.map(x => x.id);
    expect(ids).toContain('noSpare');
    expect(ids).toContain('noDryLanes');
    expect(ids).toContain('missingSpecs');
  });
  it('flags two balls that do the same job', () => {
    const g = findGaps([place('A', phaze), place('B', phaze), { name: 'Plastic', spare: true }]);
    expect(g.find(x => x.id === 'overlap')).toMatchObject({ a: 'A', b: 'B' });
    expect(g.map(x => x.id)).not.toContain('noSpare');
  });
  it('flags a big step in the ladder', () => {
    const g = findGaps([place('Strong', phaze, '500'), place('Weak', weakPearl, 'Polish'), { name: 'Plastic', spare: true }]);
    expect(g.find(x => x.id === 'ladderGap')).toMatchObject({ above: 'Strong', below: 'Weak' });
  });
});

describe('fillCandidates', () => {
  it('suggests catalog balls that fill the gap and skips ones already owned', () => {
    const owned = [{ name: 'Phaze', spare: false, specs: phaze, ...placeBall(phaze, null, 'Box') }];
    const catalog = [
      { ballName: 'Ice Pearl', brand: 'Storm', specs: weakPearl },
      { ballName: 'Phaze', brand: 'Storm', specs: phaze },
      { ballName: 'Clear Spare', brand: 'X', specs: weakPearl },
    ];
    const c = fillCandidates({ id: 'noDryLanes' }, owned, catalog, ['Phaze']);
    expect(c.map(x => x.name)).toEqual(['Ice Pearl']);
  });
});

describe('placeArsenal / pointFor / bags', () => {
  it('places every ball with its surface and layout', () => {
    const r = placeArsenal({
      balls: ['Phaze', 'Plastic'], bowler: 'Ryan',
      ballSpecs: { 'Ryan|Phaze': phaze }, ballLayouts: {},
      shots: [{ bowler: 'Ryan', ball: 'Phaze', surface: '1000', date: '2026-09-01', game: '1' }],
      sessions: [], gameEquipment: {},
    });
    expect(r.balls[0]).toMatchObject({ name: 'Phaze', surface: '1000', spare: false });
    expect(r.balls[1].spare).toBe(true);
    expect(isSpareBall('Plastic')).toBe(true);
    const p = pointFor(r.balls[0], MAP_VIEWS.find(v => v.id === 'core'));
    expect(p.x).toBeLessThan(20); // low RG
    expect(pointFor(r.balls[1], MAP_VIEWS[0])).toBeNull();
  });
  it('compares two bags', () => {
    const a = [{ name: 'A', strength: 70, length: 20, shape: 30 }, { name: 'B', strength: 40, length: 60, shape: 60 }];
    const b = [{ name: 'B', strength: 40, length: 60, shape: 60 }];
    const c = compareBags(a, b);
    expect(c.shared).toEqual(['B']);
    expect(c.a.strength).toEqual([40, 70]);
  });
});
