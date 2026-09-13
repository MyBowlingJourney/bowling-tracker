import { describe, it, expect } from 'vitest';
import {
  handicapPerGame, gameWithHandicap, appliesHandicap, handicapPins,
  isBaker, bakerFrameOwner, bakerFramesFor, isMyBakerFrame,
  myBakerShots, scoreCountsForBowler, bakerScoreNote, BAKER_STARTERS,
} from './tournamentFormats.js';

describe('handicap', () => {
  const t = { format: 'handicap', handicap: '40' };

  // A 40-pin handicap across four games is 160 pins, not 40. Adding it
  // once would under-report by three games and put a bowler below a cut
  // line they actually cleared.
  it('applies to every game, not once to the series', () => {
    expect(handicapPins(t, 4)).toBe(160);
    expect(handicapPins(t, 1)).toBe(40);
  });

  // Games entered, not games scheduled -- a block abandoned after two
  // earns two games of handicap.
  it('counts only games actually bowled', () => {
    expect(handicapPins(t, 2)).toBe(80);
    expect(handicapPins(t, 0)).toBe(0);
  });

  it('adds to a single game', () => {
    expect(gameWithHandicap(180, 40)).toBe(220);
    expect(gameWithHandicap('180', '40')).toBe(220);
  });

  it('does nothing for a game with no score', () => {
    expect(gameWithHandicap('', 40)).toBe(null);
  });

  // Stored but not applied: switching to scratch and back should not
  // lose the number the bowler typed.
  it('is ignored in a scratch event even when a value is stored', () => {
    expect(appliesHandicap({ format: 'scratch', handicap: '40' })).toBe(false);
    expect(handicapPins({ format: 'scratch', handicap: '40' }, 4)).toBe(0);
  });

  it('is ignored when the handicap is zero or missing', () => {
    expect(appliesHandicap({ format: 'handicap', handicap: '0' })).toBe(false);
    expect(appliesHandicap({ format: 'handicap' })).toBe(false);
  });
});

describe('Baker frame ownership', () => {
  it('gives the starter the odd frames', () => {
    expect(bakerFramesFor('me', 'me')).toEqual([1, 3, 5, 7, 9]);
    expect(bakerFramesFor('partner', 'me')).toEqual([2, 4, 6, 8, 10]);
  });

  it('flips when the partner starts', () => {
    expect(bakerFramesFor('me', 'partner')).toEqual([2, 4, 6, 8, 10]);
    expect(bakerFramesFor('partner', 'partner')).toEqual([1, 3, 5, 7, 9]);
  });

  // Whoever starts the 10th bowls all of it, fill ball included -- a
  // fill ball earned by a strike belongs to whoever threw the strike.
  it('does not split the tenth frame', () => {
    expect(bakerFrameOwner(10, 'me')).toBe('partner');
    expect(bakerFrameOwner(10, 'partner')).toBe('me');
  });

  it('covers all ten frames between the two bowlers', () => {
    const mine = bakerFramesFor('me', 'me');
    const theirs = bakerFramesFor('partner', 'me');
    expect([...mine, ...theirs].sort((a, b) => a - b)).toEqual([1,2,3,4,5,6,7,8,9,10]);
  });

  // A wrong owner silently misattributes a strike, so a bad frame number
  // returns null rather than a guess.
  it('refuses a frame number outside 1-10', () => {
    for (const f of [0, 11, -1, null, 'x']) expect(bakerFrameOwner(f, 'me')).toBe(null);
  });

  it('treats an unrecognised starter as me', () => {
    expect(bakerFrameOwner(1, undefined)).toBe('me');
    expect(bakerFrameOwner(1, 'nonsense')).toBe('me');
  });

  it('offers both starting options', () => {
    expect(BAKER_STARTERS.map(s => s.id)).toEqual(['me', 'partner']);
  });
});

describe('what a Baker game contributes', () => {
  const shots = [1,2,3,4,5,6,7,8,9,10].map(f => ({ frame: String(f), result: 'Strike' }));

  // The frames are entirely the bowler's -- they threw those balls -- so
  // strike percentage and carry should count them.
  it('keeps only the bowler’s own frames', () => {
    expect(myBakerShots(shots, 'me').map(s => s.frame)).toEqual(['1','3','5','7','9']);
    expect(myBakerShots(shots, 'partner').map(s => s.frame)).toEqual(['2','4','6','8','10']);
  });

  // Half the score was thrown by someone else.
  it('keeps a Baker score out of the bowler’s average', () => {
    expect(scoreCountsForBowler({ format: 'baker' })).toBe(false);
    expect(scoreCountsForBowler({ format: 'scratch' })).toBe(true);
    expect(scoreCountsForBowler({ format: 'handicap' })).toBe(true);
  });

  // Without a reason, an excluded 210 looks like a bug.
  it('explains why the score is set aside', () => {
    const note = bakerScoreNote({ format: 'baker', bakerPartner: 'Dave' });
    expect(note).toContain('Dave');
    expect(note).toContain('out of your average');
    expect(note).toContain('still count');
  });

  it('says nothing for a non-Baker event', () => {
    expect(bakerScoreNote({ format: 'scratch' })).toBe('');
  });

  it('copes with no partner name', () => {
    expect(bakerScoreNote({ format: 'baker' })).toContain('your partner');
  });
});

describe('survives junk', () => {
  it('every entry point', () => {
    for (const j of [null, undefined, 'x', 42, {}, [], [null]]) {
      expect(() => handicapPerGame(j)).not.toThrow();
      expect(() => gameWithHandicap(j, j)).not.toThrow();
      expect(() => handicapPins(j, j)).not.toThrow();
      expect(() => bakerFrameOwner(j, j)).not.toThrow();
      expect(() => bakerFramesFor(j, j)).not.toThrow();
      expect(() => myBakerShots(j, j)).not.toThrow();
      expect(() => bakerScoreNote(j)).not.toThrow();
      expect(() => isBaker(j)).not.toThrow();
      expect(() => isMyBakerFrame(j, j)).not.toThrow();
    }
    expect(myBakerShots(null, 'me')).toEqual([]);
    expect(handicapPerGame(null)).toBe(0);
  });
});
