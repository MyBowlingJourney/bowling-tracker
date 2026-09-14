import { describe, it, expect } from 'vitest';
import {
  handleFromEmail, hasDuplicateIdentity, mergedBowlers, movedRecords, movedKeyedMap,
} from './bowlerIdentity.js';

const EMAIL = 'reverett290@example.com';
const NAME = 'Ryan';

describe('one bowler, one name', () => {
  // The handle is written to bowler_names on first sign in, before a
  // profile exists. The display name arrives later and was added beside
  // it -- so the bowler appeared twice when filing scores.
  it('reads the handle from the address', () => {
    expect(handleFromEmail(EMAIL)).toBe('reverett290');
  });

  it('spots the duplicate', () => {
    expect(hasDuplicateIdentity(['reverett290', NAME], EMAIL, NAME)).toBe(true);
  });

  it('says no once there is nothing to merge', () => {
    expect(hasDuplicateIdentity([NAME, 'Maggie'], EMAIL, NAME)).toBe(false);
  });

  it('drops the handle and keeps everyone else', () => {
    expect(mergedBowlers(['reverett290', NAME, 'Maggie'], EMAIL, NAME))
      .toEqual([NAME, 'Maggie']);
  });

  // Hiding the handle without moving records would orphan every shot,
  // session and arsenal filed under it.
  it('moves records onto the display name', () => {
    const recs = [{ bowler: 'reverett290' }, { bowler: 'Maggie' }];
    expect(movedRecords(recs, EMAIL, NAME).map(r => r.bowler)).toEqual([NAME, 'Maggie']);
  });

  // bags and ball groups use bowlerName, not bowler. Moving one and not
  // the other splits the history in half.
  it('moves bowlerName as well as bowler', () => {
    const recs = [{ bowlerName: 'reverett290' }, { bowler: 'reverett290' }];
    const out = movedRecords(recs, EMAIL, NAME);
    expect(out[0].bowlerName).toBe(NAME);
    expect(out[1].bowler).toBe(NAME);
  });

  // A bowler legitimately has other bowlers in their list.
  it('never touches a teammate', () => {
    expect(movedRecords([{ bowler: 'Maggie' }], EMAIL, NAME)[0].bowler).toBe('Maggie');
  });

  it('moves maps keyed by bowler', () => {
    expect(movedKeyedMap({ reverett290: ['Zen'], Maggie: ['Hy-Road'] }, EMAIL, NAME))
      .toEqual({ Maggie: ['Hy-Road'], Ryan: ['Zen'] });
  });

  // So it can sit in an effect without a "have I done this" flag.
  it('returns the same array when nothing moved', () => {
    const recs = [{ bowler: NAME }];
    expect(movedRecords(recs, EMAIL, NAME)).toBe(recs);
  });

  it('does nothing without an address or a name', () => {
    expect(mergedBowlers(['a'], '', NAME)).toEqual(['a']);
    expect(mergedBowlers(['a'], EMAIL, '')).toEqual(['a']);
  });

  it('survives junk', () => {
    for (const j of [null, undefined, 'x', 42, {}, [null]]) {
      expect(() => handleFromEmail(j)).not.toThrow();
      expect(() => hasDuplicateIdentity(j, j, j)).not.toThrow();
      expect(() => mergedBowlers(j, j, j)).not.toThrow();
      expect(() => movedRecords(j, j, j)).not.toThrow();
      expect(() => movedKeyedMap(j, j, j)).not.toThrow();
    }
  });
});
