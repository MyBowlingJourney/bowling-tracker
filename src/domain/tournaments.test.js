import { describe, it, expect } from 'vitest';
import {
  emptyTournament, tournamentToRow, tournamentFromRow,
  TOURNAMENT_FORMATS, TOURNAMENT_FORMAT_IDS, TOURNAMENT_SCORING_FORMATS, formatLabel, isNonScratchFormat,
  resolveTournamentGameScore, dayTotal, dayGamesEntered, tournamentGamesEntered,
  tournamentTotal, tournamentAverage,
  tournamentTotalWithHandicap,
} from './tournaments.js';
describe('tournament format', () => {
  // Metadata, not scoring. Tournament games are entered as final scores,
  // so the house scorer has already applied no-tap by the time the
  // bowler types the number.
  // Event format and scoring format are different axes. Scratch and
  // Baker describe how the event runs; no-tap describes what a frame is
  // worth, and a Baker squad can be either -- so folding them into one
  // field needed a combinatorial list ("baker-no-tap"), which is what
  // this used to be drifting into.
  it('offers only event formats, not scoring', () => {
    expect(TOURNAMENT_FORMAT_IDS).toEqual(['scratch', 'handicap', 'baker']);
    expect(TOURNAMENT_FORMAT_IDS).not.toContain('no-tap-9');
  });

  it('offers scoring format separately, sharing the league vocabulary', () => {
    expect(TOURNAMENT_SCORING_FORMATS.map(f => f.id)).toEqual(['tenpin', 'notap9']);
  });

  // Tournament games can be frame-tracked, so this one is not metadata --
  // the app scores them itself and no-tap changes the number.
  it('round-trips the scoring format', () => {
    const t = { ...emptyTournament(), id: 't1', bowler: 'Ryan', scoringFormat: 'notap9' };
    expect(tournamentToRow(t, 'u1').scoring_format).toBe('notap9');
    expect(tournamentFromRow(tournamentToRow(t, 'u1')).scoringFormat).toBe('notap9');
  });

  // An event recorded before this existed was a 10-pin event.
  it('defaults scoring to 10 pin', () => {
    expect(tournamentFromRow({ id: 't', scoring_format: null }).scoringFormat).toBe('tenpin');
  });

  // A 250 in a no-tap squad is not a 250 in a scratch event, and a Baker
  // score is not an individual score at all.
  it('knows which formats should not be pooled with scratch play', () => {
    expect(isNonScratchFormat('no-tap-9')).toBe(true);
    expect(isNonScratchFormat('baker')).toBe(true);
    expect(isNonScratchFormat('scratch')).toBe(false);
    expect(isNonScratchFormat('handicap')).toBe(false);
  });

  // Blank means unrecorded. A tournament logged before this field
  // existed should not claim to have been scratch.
  it('leaves the format blank by default', () => {
    expect(emptyTournament().format).toBe('');
    expect(isNonScratchFormat('')).toBe(false);
  });

  it('round-trips the event format', () => {
    const t = { ...emptyTournament(), id: 't1', bowler: 'Ryan', name: 'Open', format: 'baker' };
    expect(tournamentToRow(t, 'u1').format).toBe('baker');
    expect(tournamentFromRow({ ...tournamentToRow(t, 'u1') }).format).toBe('baker');
  });

  it('stores null rather than an empty string when unrecorded', () => {
    expect(tournamentToRow(emptyTournament(), 'u1').format).toBe(null);
  });

  it('survives junk', () => {
    for (const junk of [null, undefined, 42, {}]) {
      expect(() => formatLabel(junk)).not.toThrow();
      expect(() => isNonScratchFormat(junk)).not.toThrow();
    }
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
    expect(tournamentTotalWithHandicap({ format: 'handicap', handicap: '40', days: [day] })).toBe(690);
  });

  it('leaves a scratch event alone even with a handicap stored', () => {
    expect(tournamentTotalWithHandicap({ format: 'scratch', handicap: '40', days: [day] })).toBe(570);
  });

  it('leaves Baker alone', () => {
    expect(tournamentTotalWithHandicap({ format: 'baker', handicap: '40', days: [day] })).toBe(570);
  });

  it('gives nothing when nothing was bowled', () => {
    expect(tournamentTotalWithHandicap({ format: 'handicap', handicap: '40', days: [{ games: [] }] })).toBe(null);
  });

  it('survives junk', () => {
    for (const j of [null, undefined, 'x', 42, {}]) {
      expect(() => tournamentTotalWithHandicap(j, j)).not.toThrow();
    }
  });
});
