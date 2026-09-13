import { describe, it, expect } from 'vitest';
import {
  emptyTournament, tournamentToRow, tournamentFromRow,
      
  resolveTournamentGameScore, dayTotal, dayGamesEntered, tournamentGamesEntered,
  tournamentTotal, tournamentAverage,
  tournamentTotalWithHandicap,
  SCORING_BASES, PIN_FORMATS, PLAY_STYLES, scoresJoinScratchFigures, describeTournamentFormat,
} from './tournaments.js';
describe('four independent settings', () => {
  // Not one dropdown with six values: a Baker squad can be handicapped,
  // no-tap and frame-tracked at once. An earlier version packed
  // scratch/handicap/baker into one field and was already drifting into
  // a combinatorial list with "baker-no-tap".
  it('offers each axis separately', () => {
    expect(SCORING_BASES.map(o => o.id)).toEqual(['scratch', 'handicap']);
    expect(PIN_FORMATS.map(o => o.id)).toEqual(['tenpin', 'notap9']);
    expect(PLAY_STYLES.map(o => o.id)).toEqual(['standard', 'baker']);
  });

  // Every default means "behaves as it always has".
  it('defaults to scratch, 10 pin, standard', () => {
    const t = emptyTournament();
    expect(t.scoringBasis).toBe('scratch');
    expect(t.pinFormat).toBe('tenpin');
    expect(t.playStyle).toBe('standard');
  });

  it('round-trips all four through a row', () => {
    const t = { ...emptyTournament(), id: 't1', bowler: 'Ryan',
      scoringBasis: 'handicap', pinFormat: 'notap9', playStyle: 'baker' };
    const back = tournamentFromRow(tournamentToRow(t, 'u1'));
    expect(back.scoringBasis).toBe('handicap');
    expect(back.pinFormat).toBe('notap9');
    expect(back.playStyle).toBe('baker');
  });

  // An unknown value scores as standard rather than stranding the event.
  it('falls back to the default for anything unrecognised', () => {
    const back = tournamentFromRow({ id: 't', scoring_basis: 'nope', pin_format: 'nope',
      play_style: 'nope' });
    expect(back.scoringBasis).toBe('scratch');
    expect(back.pinFormat).toBe('tenpin');
    expect(back.playStyle).toBe('standard');
  });

  // Handicap is not a reason to exclude a score: the scratch pins
  // underneath are entirely the bowler's and entirely comparable.
  it('keeps handicap scores in the scratch figures', () => {
    expect(scoresJoinScratchFigures({ scoringBasis: 'handicap' })).toBe(true);
  });

  it('keeps Baker and no-tap out of them', () => {
    expect(scoresJoinScratchFigures({ playStyle: 'baker' })).toBe(false);
    expect(scoresJoinScratchFigures({ pinFormat: 'notap9' })).toBe(false);
  });

  // A standard scratch 10-pin event needs no explaining.
  it('describes only the non-default settings', () => {
    expect(describeTournamentFormat(emptyTournament())).toBe('');
    expect(describeTournamentFormat({ scoringBasis: 'handicap', pinFormat: 'notap9', playStyle: 'baker' }))
      .toBe('Handicap · 9 pin no-tap · Baker');
  });
});

describe('a tournament game score comes from frames when none is typed', () => {
  // Tournament games are typed by hand, so a bowler frame-tracking an
  // event had to log every shot AND type the total -- one number entered
  // twice, with two chances to disagree. Same rule league already uses.
  const day = { games: [
    { gameNumber: 1, score: '212' },
    { gameNumber: 2, score: '' },
    { gameNumber: 3, score: '' },
  ] };
  const frames = { '2': 190, '3': 205 };

  it('uses the typed score when there is one', () => {
    expect(resolveTournamentGameScore({ gameNumber: 1, score: '212' }, { '1': 180 })).toBe(212);
  });

  // The house scorer decides whether you cashed. A mis-tapped frame
  // needs an override the app does not argue with.
  it('lets a typed score beat the frames', () => {
    expect(dayTotal({ games: [{ gameNumber: 1, score: '212' }] }, { '1': 180 })).toBe(212);
  });

  it('falls back to the frames when nothing is typed', () => {
    expect(resolveTournamentGameScore({ gameNumber: 2, score: '' }, frames)).toBe(190);
  });

  it('totals a mix of typed and frame-derived games', () => {
    expect(dayTotal(day, frames)).toBe(607);
    expect(dayGamesEntered(day, frames)).toBe(3);
  });

  // Every existing caller passes no second argument, and must be
  // unaffected.
  it('behaves exactly as before with no frame scores', () => {
    expect(dayTotal(day)).toBe(212);
    expect(dayGamesEntered(day)).toBe(1);
  });

  it('rejects an impossible frame-derived score', () => {
    expect(resolveTournamentGameScore({ gameNumber: 2, score: '' }, { '2': 400 })).toBe(null);
    expect(resolveTournamentGameScore({ gameNumber: 2, score: '' }, { '2': -5 })).toBe(null);
  });

  it('carries through to the tournament totals', () => {
    const t = { days: [day] };
    expect(tournamentTotal(t, frames)).toBe(607);
    expect(tournamentGamesEntered(t, frames)).toBe(3);
    expect(Math.round(tournamentAverage(t, frames))).toBe(202);
  });

  // .map(dayTotal) would hand Array.map's index as the second argument,
  // so day 1 would look up frame scores in the number 1.
  it('does not confuse the day index for frame scores', () => {
    const t = { days: [day, { games: [{ gameNumber: 1, score: '150' }] }] };
    expect(tournamentTotal(t, frames)).toBe(757);
  });

  it('survives junk', () => {
    for (const j of [null, undefined, 'x', 42, []]) {
      expect(() => resolveTournamentGameScore(j, j)).not.toThrow();
      expect(() => dayTotal(day, j)).not.toThrow();
      expect(() => tournamentTotal({ days: [day] }, j)).not.toThrow();
    }
  });
});

describe('handicap reaches the total', () => {
  const day = { games: [
    { gameNumber: 1, score: '180' }, { gameNumber: 2, score: '190' }, { gameNumber: 3, score: '200' },
  ] };

  // The number the tournament used, which is what decides the cut.
  it('adds the handicap once per game', () => {
    expect(tournamentTotalWithHandicap({ scoringBasis: 'handicap', handicap: '40', days: [day] })).toBe(690);
  });

  it('leaves a scratch event alone even with a handicap stored', () => {
    expect(tournamentTotalWithHandicap({ scoringBasis: 'scratch', handicap: '40', days: [day] })).toBe(570);
  });

  it('leaves Baker alone', () => {
    expect(tournamentTotalWithHandicap({ playStyle: 'baker', handicap: '40', days: [day] })).toBe(570);
  });

  it('gives nothing when nothing was bowled', () => {
    expect(tournamentTotalWithHandicap({ scoringBasis: 'handicap', handicap: '40', days: [{ games: [] }] })).toBe(null);
  });

  it('survives junk', () => {
    for (const j of [null, undefined, 'x', 42, {}]) {
      expect(() => tournamentTotalWithHandicap(j, j)).not.toThrow();
    }
  });
});
