import { describe, it, expect } from 'vitest';
import { reconcileTenth, tenthBallsOwed, convertExtractedGameToShots } from './scorecardImport.js';

const ctx = { bowler: 'R', league: 'L', date: '2026-09-18', game: '1' };
const s = (ballNum, result, extra = {}) => ({ frame: '10', ballNum, result, otherLeave: [], spareMade: '', pinCount: '', ...extra });
const nine = { frame: '9', ballNum: null, result: 'Strike' };
const balls = list => list.filter(x => x.frame === '10').map(x => `${x.ballNum}:${x.result || '_'}`).join(' ');

describe('tenthBallsOwed', () => {
  it('open 10th is one record', () => expect(tenthBallsOwed([s(1, 'Other Leave', { spareMade: 'No' })])).toEqual([1]));
  it('spare earns the fill', () => expect(tenthBallsOwed([s(1, 'Other Leave', { spareMade: 'Yes' })])).toEqual([1, 3]));
  it('strike then leave', () => expect(tenthBallsOwed([s(1, 'Strike'), s(2, 'Other Leave', { spareMade: 'No' })])).toEqual([1, 2]));
  it('two strikes earn the third', () => expect(tenthBallsOwed([s(1, 'Strike'), s(2, 'Strike')])).toEqual([1, 2, 3]));
});

describe('reconcileTenth', () => {
  it('open -> spare adds a blank fill ball', () => {
    const out = reconcileTenth([nine, s(1, 'Other Leave', { spareMade: 'Yes' })]);
    expect(balls(out)).toBe('1:Other Leave 3:_');
    expect(out.find(x => x.ballNum === 3).fill).toBe(true);
  });
  it('open -> strike adds ball 2, and a strike there adds ball 3', () => {
    let out = reconcileTenth([nine, s(1, 'Strike')]);
    expect(balls(out)).toBe('1:Strike 2:_');
    out = reconcileTenth(out.map(x => x.ballNum === 2 ? { ...x, result: 'Strike' } : x));
    expect(balls(out)).toBe('1:Strike 2:Strike 3:_');
  });
  it('taking the mark away drops the balls it earned', () => {
    const out = reconcileTenth([nine, s(1, 'Other Leave', { spareMade: 'No' }), s(3, 'Strike')]);
    expect(balls(out)).toBe('1:Other Leave');
  });
  it('leaves other frames alone and keeps existing balls', () => {
    const out = reconcileTenth([nine, s(1, 'Strike'), s(2, 'Other Leave', { spareMade: 'Yes', otherLeave: ['10'] })]);
    expect(out[0]).toEqual(nine);
    expect(balls(out)).toBe('1:Strike 2:Other Leave');
  });
  it('no 10th, no change', () => { const l = [nine]; expect(reconcileTenth(l)).toBe(l); });
});

describe('import records the second-ball leave', () => {
  it('open frame keeps which pins stayed up', () => {
    const { shots } = convertExtractedGameToShots({ frames: [
      { frameNumber: 1, balls: [{ ballIndex: 1, isStrike: false, pinsStanding: ['7', '10'] }, { ballIndex: 2, isStrike: false, pinsStanding: ['10'] }] },
    ] }, ctx);
    expect(shots[0].secondLeave).toEqual([10]);
    expect(shots[0].pinCount).toBe('9');
  });
  it('a spare leaves nothing standing', () => {
    const { shots } = convertExtractedGameToShots({ frames: [
      { frameNumber: 1, balls: [{ ballIndex: 1, isStrike: false, pinsStanding: ['10'] }, { ballIndex: 2, isStrike: false, pinsStanding: [] }] },
    ] }, ctx);
    expect(shots[0].secondLeave).toEqual([]);
  });
});
