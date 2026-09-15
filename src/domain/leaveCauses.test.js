import { describe, it, expect } from 'vitest';
import {
  shotsLeaving, shotsNotLeaving, leaveCauseProfile, missingCauseFields,
} from './leaveCauses.js';

const shot = (id, leave, extra = {}) => ({
  id, ballNum: '1', otherLeave: leave, ...extra,
});

describe('why a leave keeps happening', () => {
  // Asked "why do I keep leaving the ten pin", Brooklyn answered with a
  // conversion rate, because every stat she had was a frequency. The
  // shot record carries the causes; they just never reached her.
  const tenPins = () => Array.from({ length: 10 }, (_, i) =>
    shot(`t${i}`, ['10'], { ballSpeed: 16.8, revRate: 320, miss: 'Light', ball: 'Bionic' }));
  const others = () => Array.from({ length: 30 }, (_, i) =>
    shot(`o${i}`, [], { ballSpeed: 15.2, revRate: 360, miss: 'Flush', ball: 'Bionic' }));

  it('finds the shots that left exactly that pin', () => {
    const shots = [...tenPins(), ...others(), shot('x', ['7', '10'])];
    expect(shotsLeaving(shots, ['10'])).toHaveLength(10);
  });

  // A 7-10 is not a 10. Matching loosely would blame one leave's causes
  // on another.
  it('does not match a different leave containing that pin', () => {
    expect(shotsLeaving([shot('a', ['7', '10'])], ['10'])).toHaveLength(0);
  });

  // A leave is what the rack looked like after the strike attempt.
  it('ignores second balls', () => {
    const shots = [{ id: 'b', ballNum: '2', otherLeave: ['10'] }];
    expect(shotsLeaving(shots, ['10'])).toHaveLength(0);
  });

  it('separates the comparison group', () => {
    expect(shotsNotLeaving([...tenPins(), ...others()], ['10'])).toHaveLength(30);
  });

  // A number means nothing alone: 16.8 mph is only interesting next to
  // 15.2 on everything else.
  it('contrasts the causes against the other shots', () => {
    const p = leaveCauseProfile([...tenPins(), ...others()], ['10']);
    expect(p.enough).toBe(true);
    const speed = p.factors.find(f => f.key === 'ballSpeed');
    expect(speed.whenLeft).toBe(16.8);
    expect(speed.otherwise).toBe(15.2);
    expect(speed.delta).toBeCloseTo(1.6, 1);
  });

  it('reports where it missed', () => {
    const p = leaveCauseProfile([...tenPins(), ...others()], ['10']);
    expect(p.factors.find(f => f.key === 'miss').whenLeft).toBe('Light');
  });

  // Below the sample bar a difference is noise wearing a number's
  // clothes.
  it('refuses to guess from too few shots', () => {
    const p = leaveCauseProfile([shot('a', ['10']), shot('b', ['10'])], ['10']);
    expect(p.enough).toBe(false);
    expect(p.factors).toEqual([]);
  });

  // Never compare against nothing.
  it('skips a field the other shots do not record', () => {
    const left = Array.from({ length: 10 }, (_, i) => shot(`t${i}`, ['10'], { ballSpeed: 16 }));
    const rest = Array.from({ length: 10 }, (_, i) => shot(`o${i}`, []));
    expect(leaveCauseProfile([...left, ...rest], ['10']).factors
      .some(f => f.key === 'ballSpeed')).toBe(false);
  });

  // So "I can't tell you why yet" can say what to do about it.
  it('names what is not being tracked', () => {
    const bare = Array.from({ length: 12 }, (_, i) => shot(`t${i}`, ['10']));
    const missing = missingCauseFields(bare, ['10']).map(f => f.key);
    expect(missing).toContain('ballSpeed');
    expect(missing).toContain('miss');
  });

  it('names nothing when everything is tracked', () => {
    expect(missingCauseFields(tenPins(), ['10']).map(f => f.key)).not.toContain('ballSpeed');
  });

  it('survives junk', () => {
    for (const j of [null, undefined, 'x', 42, [null], [{}]]) {
      expect(() => leaveCauseProfile(j, j)).not.toThrow();
      expect(() => shotsLeaving(j, j)).not.toThrow();
      expect(() => missingCauseFields(j, j)).not.toThrow();
    }
  });
});
