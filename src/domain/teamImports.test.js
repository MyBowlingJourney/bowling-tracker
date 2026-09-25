import { describe, it, expect } from 'vitest';
import { teammateImportRows } from './teamImports.js';

const rec = o => ({ id: 'r1', bowler: 'Sophie', uploadedBy: 'u1', league: 'Tuesday', date: '2026-09-10',
  importedScores: [180, 166, 161], status: 'pending', ...o });
const frames = [{ gameNumber: 1, ballUsed: 'Phaze', shots: [{ frame: 1, result: 'Strike' }, { frame: 2, result: 'Strike' }] }];

describe('teammateImportRows', () => {
  it('turns a pending teammate column into a night that counts', () => {
    const { sessions } = teammateImportRows([rec()]);
    expect(sessions).toHaveLength(1);
    expect(sessions[0]).toMatchObject({ bowler: 'Sophie', league: 'Tuesday', date: '2026-09-10', scores: [180, 166, 161], total: 507, average: 169 });
  });

  it('carries the frames, tagged with where they came from', () => {
    const { shots } = teammateImportRows([rec({ importedShots: frames })]);
    expect(shots).toHaveLength(2);
    expect(shots[0]).toMatchObject({ bowler: 'Sophie', league: 'Tuesday', game: '1', ball: 'Phaze', importedFrom: 'r1' });
    expect(new Set(shots.map(s => s.id)).size).toBe(2);
  });

  it('drops a rejected record: a withdrawn number is not data', () => {
    expect(teammateImportRows([rec({ status: 'rejected' })]).sessions).toEqual([]);
  });

  it('uses the corrected scores and frames when there are some', () => {
    const r = rec({ status: 'corrected', correctedScores: [200, 190, 180], importedShots: frames, correctedShots: [{ gameNumber: 1, shots: [{ frame: 1, result: 'Spare' }] }] });
    const out = teammateImportRows([r]);
    expect(out.sessions[0].scores).toEqual([200, 190, 180]);
    expect(out.shots.map(s => s.result)).toEqual(['Spare']);
  });

  it('leaves a night already on this device alone, so nothing counts twice', () => {
    const out = teammateImportRows([rec({ importedShots: frames })], {
      sessions: [{ bowler: 'sophie', league: 'Tuesday', date: '2026-09-10', scores: [1] }],
      shots: [{ bowler: 'Sophie', league: 'Tuesday', date: '2026-09-10', game: '1' }],
    });
    expect(out.sessions).toEqual([]);
    expect(out.shots).toEqual([]);
  });

  it('counts one record per bowler per night', () => {
    expect(teammateImportRows([rec(), rec({ id: 'r2' })]).sessions).toHaveLength(1);
  });

  it('skips a record with no league', () => {
    expect(teammateImportRows([rec({ league: '' })]).sessions).toEqual([]);
  });
});
