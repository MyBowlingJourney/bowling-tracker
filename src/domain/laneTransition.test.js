import { describe, it, expect } from 'vitest';
import {
  blockPositions, nightsIn, patternsIn, patternForNight, patternLengthFor,
  shotsAt, positionLabel, typicalGames, HOUSE_PATTERN,
} from './laneTransition.js';
import { ballComparison, ballLine, BREAKPOINT_FEET } from './ballComparison.js';
import { isSplit, isCornerPinLeave } from './splits.js';

// A bowler who moves. Start on 20 and drift left a couple of boards a
// game, which is what a transition looks like -- and exactly the thing a
// single average erases.
const shot = (date, game, frame, o = {}) => ({
  bowler: 'Ryan', league: 'Monday', date, game: String(game), frame: String(frame),
  ballNum: null, ball: 'Phaze', result: 'Strike', otherLeave: [], spareMade: '', pinCount: '',
  startingBoard: String(20 + (game - 1) * 2), actualArrows: String(15 + (game - 1)), ...o,
});

const night = (date, games = 3, o = {}) => {
  const out = [];
  for (let g = 1; g <= games; g++) for (let f = 1; f <= 10; f++) out.push(shot(date, g, f, o));
  return out;
};

const PATTERNS = [
  { date: '2026-09-06', patternName: 'Kegel Main St', length: '41' },
  { date: '2026-09-13', patternName: 'Kegel Main St', length: '41' },
  { date: '2026-09-20', patternName: 'Scorpion', length: '47' },
];

describe('where a shot sits in its block', () => {
  it('runs from the first ball to the last', () => {
    const shots = night('2026-09-06');
    const pos = blockPositions(shots);
    expect(pos.get(shots[0])).toBe(0);
    expect(pos.get(shots[shots.length - 1])).toBe(1);
  });

  // Measured in frames, not games: the move that matters is usually made
  // in the middle of one.
  it('moves within a game, not just between games', () => {
    const shots = night('2026-09-06');
    const pos = blockPositions(shots);
    expect(pos.get(shots[4])).toBeGreaterThan(pos.get(shots[0]));
    expect(pos.get(shots[4])).toBeLessThan(pos.get(shots[9]));
  });

  // A night abandoned after two games is two games long. Stretching it
  // to three would put its last shot at 0.67 and claim a transition
  // nobody bowled.
  it('measures each night against its own length', () => {
    const short = night('2026-09-06', 2);
    const long = night('2026-09-13', 5);
    const pos = blockPositions([...short, ...long]);
    expect(pos.get(short[short.length - 1])).toBe(1);
    expect(pos.get(long[long.length - 1])).toBe(1);
  });

  it('is safe on junk', () => {
    expect(() => blockPositions(null)).not.toThrow();
    expect(() => blockPositions([null, {}, 'x'])).not.toThrow();
  });
});

describe('scrubbing the block', () => {
  const shots = [...night('2026-09-06'), ...night('2026-09-13')];

  // The whole point: the line at the start is not the line at the end.
  it('shows a different line early and late', () => {
    const early = shotsAt(shots, { at: 0, lanePatterns: PATTERNS });
    const late = shotsAt(shots, { at: 1, lanePatterns: PATTERNS });
    const boards = r => [...new Set(r.shots.map(s => Number(s.startingBoard)))];
    expect(Math.max(...boards(early))).toBeLessThan(Math.min(...boards(late)));
  });

  it('pools every night by position when no night is named', () => {
    expect(shotsAt(shots, { at: 0.5, lanePatterns: PATTERNS }).nights).toBe(2);
  });

  it('scrubs one night alone when one is named', () => {
    const r = shotsAt(shots, { at: 0.5, date: '2026-09-13', lanePatterns: PATTERNS });
    expect(r.nights).toBe(1);
    expect(r.shots.every(s => s.date === '2026-09-13')).toBe(true);
  });

  it('keeps only the nights bowled on a named pattern', () => {
    const all = [...shots, ...night('2026-09-20')];
    const r = shotsAt(all, { at: 0.5, pattern: 'Scorpion', lanePatterns: PATTERNS });
    expect(r.shots.every(s => s.date === '2026-09-20')).toBe(true);
  });

  // The window is clamped at the ends rather than slid inward: position
  // 0 covers less of the block, but it covers the START of it.
  it('keeps the ends honest', () => {
    const early = shotsAt(shots, { at: 0, lanePatterns: PATTERNS });
    const middle = shotsAt(shots, { at: 0.5, lanePatterns: PATTERNS });
    expect(early.shots.length).toBeLessThan(middle.shots.length);
    // Every shot at position 0 really is from the front of the block.
    const pos = blockPositions(shots);
    expect(early.shots.every(s => pos.get(s) <= 0.16)).toBe(true);
  });

  it('never returns a shot from outside the window', () => {
    const pos = blockPositions(shots);
    for (const at of [0, 0.25, 0.5, 0.75, 1]) {
      const r = shotsAt(shots, { at, halfWindow: 0.1, lanePatterns: PATTERNS });
      expect(r.shots.every(s => Math.abs(pos.get(s) - at) <= 0.1 + 1e-9)).toBe(true);
    }
  });

  it('is safe on junk', () => {
    expect(() => shotsAt(null, null)).not.toThrow();
    expect(shotsAt([], { at: 5 }).shots).toEqual([]);
  });
});

describe('nights and patterns', () => {
  const shots = [...night('2026-09-06'), ...night('2026-09-13'), ...night('2026-09-20')];

  it('lists nights newest first, with their pattern', () => {
    const list = nightsIn(shots, PATTERNS);
    expect(list.map(n => n.date)).toEqual(['2026-09-20', '2026-09-13', '2026-09-06']);
    expect(list[0].pattern).toBe('Scorpion');
    expect(list[0].games).toBe(3);
  });

  it('counts the nights behind each pattern', () => {
    const list = patternsIn(shots, PATTERNS);
    expect(list.find(p => p.name === 'Kegel Main St').nights).toBe(2);
    expect(list.find(p => p.name === 'Scorpion').nights).toBe(1);
  });

  // An unrecorded night is the HOUSE shot, not a gap.
  //
  // Nearly every league night is bowled on the house pattern and nobody
  // writes that down, because it is the default. Filing those under a
  // blank and dropping them threw away most of a league bowler's season
  // and left the picker empty for anyone who had never bowled a sport
  // pattern -- so the control was invisible for exactly the people who
  // had the most nights in it.
  it('treats a night nobody recorded a pattern for as the house shot', () => {
    expect(patternForNight(PATTERNS, '2026-10-01')).toBe(HOUSE_PATTERN);
    expect(patternForNight(null, '2026-09-06')).toBe(HOUSE_PATTERN);
  });

  it('buckets unrecorded nights together and keeps named ones apart', () => {
    const shots2 = [...night('2026-09-20'), ...night('2026-10-04')];
    const list = patternsIn(shots2, PATTERNS);
    expect(list.map(p => p.name).sort()).toEqual([HOUSE_PATTERN, 'Scorpion']);
    expect(list.find(p => p.name === HOUSE_PATTERN).nights).toBe(1);
  });

  it('filters to the house nights when the house shot is chosen', () => {
    const shots2 = [...night('2026-09-20'), ...night('2026-10-04')];
    const r = shotsAt(shots2, { at: 0.5, pattern: HOUSE_PATTERN, lanePatterns: PATTERNS });
    expect(r.shots.every(s => s.date === '2026-10-04')).toBe(true);
  });

  // The house shot has no recorded length -- that is what makes it the
  // house shot -- so the caller falls back to the league default.
  it('has no length of its own for the house shot', () => {
    expect(patternLengthFor(PATTERNS, HOUSE_PATTERN)).toBeNull();
  });

  // Where the ball turns comes from the pattern, so a 47-foot block has
  // to draw a later breakpoint than a 41-foot one.
  it('knows how long a pattern is', () => {
    expect(patternLengthFor(PATTERNS, 'Scorpion')).toBe(47);
    expect(patternLengthFor(PATTERNS, 'Kegel Main St')).toBe(41);
    expect(patternLengthFor(PATTERNS, 'Nothing')).toBeNull();
  });
});

describe('labels', () => {
  it('speaks in games and frames, not decimals', () => {
    expect(positionLabel(0, 3)).toBe('Game 1, frame 1');
    expect(positionLabel(1, 3)).toBe('Game 3, frame 10');
    expect(positionLabel(0.5, 3)).toBe('Game 2, frame 6');
  });

  // The median, so one five-game practice block does not stretch the
  // labels on a season of three-game league nights.
  it('takes the typical night length, not the longest', () => {
    const shots = [...night('2026-09-06'), ...night('2026-09-13'), ...night('2026-09-20', 5)];
    expect(typicalGames(shots)).toBe(3);
  });

  it('falls back sensibly with nothing to go on', () => {
    expect(typicalGames([])).toBe(3);
    expect(positionLabel(null, null)).toBe('Game 1, frame 1');
  });
});

// ── The payoff ──────────────────────────────────────────────────────────
describe('the drawn line actually migrates', () => {
  it('moves across the block the way the bowler moved', () => {
    const shots = [...night('2026-09-06'), ...night('2026-09-13')];
    const lineAt = at => {
      const picked = shotsAt(shots, { at, lanePatterns: PATTERNS });
      const [entry] = ballComparison(picked.shots, {
        bowler: 'Ryan', league: 'Monday', isSplit, isCornerPinLeave, minShots: 0,
      });
      return ballLine(entry, { patternLength: 41 }).points[0].board;
    };
    const early = lineAt(0), middle = lineAt(0.5), late = lineAt(1);
    expect(middle).toBeGreaterThan(early);
    expect(late).toBeGreaterThan(middle);
  });

  // The bug this whole feature answers.
  //
  // Averaged over the night the line sits in the middle and stays there,
  // so a bowler who moved four boards across the block is shown one line
  // that matches neither end. Here the mean lands on 22, which happens
  // to be a board he really did stand on in game 2 -- the average is not
  // wrong so much as MUTE. It is the same number at the first ball and
  // the last, and the movement is the thing worth seeing.
  it('says the same thing at both ends, which is what the slider fixes', () => {
    const shots = [...night('2026-09-06'), ...night('2026-09-13')];
    const [all] = ballComparison(shots, {
      bowler: 'Ryan', league: 'Monday', isSplit, isCornerPinLeave, minShots: 0,
    });
    const boards = [...new Set(shots.map(s => Number(s.startingBoard)))].sort((a, b) => a - b);
    expect(boards).toEqual([20, 22, 24]);          // he stood on three
    expect(all.startBoard).toBe(22);               // the card drew one

    // And it matches neither the line he started on nor the one he
    // finished on, which is the half of the night each is true for.
    expect(all.startBoard).not.toBe(boards[0]);
    expect(all.startBoard).not.toBe(boards[boards.length - 1]);
  });
});

// ── The house shot breaks at forty feet ─────────────────────────────────
//
// The card resolves the breakpoint depth like this:
//
//   House          the house default, 40 ft
//   a named block  that pattern's own length
//   every pattern  the league default
//
// The middle case is why the picker exists. The FIRST case is a fix: it
// used to fall through to the league default, which is
// patternLengthForLeague -- the length of the most recent NAMED pattern
// in the league. Bowl one 37-foot sport night and that became the house
// length for every house night of the season, so the breakpoint sat at
// 37 feet on a shot that breaks at 40.
//
// The house shot is defined by nobody having written a length down.
// Borrowing the last sport block's is the opposite of what that absence
// means.
describe('how deep the ball turns', () => {
  const LANE_PATTERNS = [{ date: '2026-09-20', patternName: 'Wolf', length: '37' }];
  const LEAGUE_DEFAULT = 37;               // what patternLengthForLeague returns here

  // The card's own rule, so the assertions describe the card.
  const feetFor = pattern => (pattern === HOUSE_PATTERN
    ? BREAKPOINT_FEET
    : (patternLengthFor(LANE_PATTERNS, pattern) ?? LEAGUE_DEFAULT));

  it('uses forty feet for the house shot, not the last sport block', () => {
    expect(BREAKPOINT_FEET).toBe(40);
    expect(feetFor(HOUSE_PATTERN)).toBe(40);
    expect(feetFor(HOUSE_PATTERN)).not.toBe(LEAGUE_DEFAULT);
  });

  it('uses a named pattern’s own length', () => {
    expect(feetFor('Wolf')).toBe(37);
  });

  it('draws the breakpoint at whatever depth it resolved', () => {
    const entry = { ball: 'b', startBoard: 25, arrowBoard: 15, breakpointBoard: 7 };
    expect(ballLine(entry, { patternLength: feetFor(HOUSE_PATTERN) }).points[2].feet).toBe(40);
    expect(ballLine(entry, { patternLength: feetFor('Wolf') }).points[2].feet).toBe(37);
  });
});

// ── Naming a night the same way the rest of the app does ────────────────
//
// The picker's name for a night IS the key the scoring band looks up. Any
// disagreement does not throw or warn -- the band simply does not draw,
// for that pattern only, while the others work. Both bugs below were found
// that way and neither was visible from the lane diagram itself.

describe('a league default names the night', () => {
  const shots = [...night('2026-01-05'), ...night('2026-01-12')];
  const defaults = { Monday: 'House Shot' };

  // patternAverages has consulted the league default since it was added;
  // the picker did not, so it offered "House" against scoring filed under
  // "House Shot" -- for every night a solo bowler owns, since
  // lane_patterns rows only sync for bowlers on a TEAM.
  it('uses it when no night has a record of its own', () => {
    expect(patternForNight([], '2026-01-05', 'Monday', defaults)).toBe('House Shot');
    expect(patternsIn(shots, [], defaults).map(p => p.name)).toEqual(['House Shot']);
  });

  // A night the bowler actually wrote a pattern on beats a guess.
  it('never overrides a night that has its own record', () => {
    const rows = [{ league: 'Monday', date: '2026-01-12', patternName: 'Wolf' }];
    expect(patternForNight(rows, '2026-01-12', 'Monday', defaults)).toBe('Wolf');
    expect(patternsIn(shots, rows, defaults).map(p => p.name).sort())
      .toEqual(['House Shot', 'Wolf']);
  });

  it('falls back to the house shot with no default and no record', () => {
    expect(patternForNight([], '2026-01-05', 'Monday', {})).toBe(HOUSE_PATTERN);
    expect(patternForNight([], '2026-01-05', 'Monday', null)).toBe(HOUSE_PATTERN);
  });
});

describe('two leagues on the same date', () => {
  const rows = [{ league: 'Monday', date: '2026-01-05', patternName: 'Wolf' }];

  // Same calendar day, different house, different oil. Matching on date
  // alone put Monday's recorded pattern on the Thursday night too.
  it('does not put one league\'s pattern on the other', () => {
    expect(patternForNight(rows, '2026-01-05', 'Monday')).toBe('Wolf');
    expect(patternForNight(rows, '2026-01-05', 'Thursday')).toBe(HOUSE_PATTERN);
  });

  // A row with no league of its own, or a caller that has none, still
  // matches on date -- which is every row written before leagues were
  // recorded on them.
  it('still matches on date when either side has no league', () => {
    const bare = [{ date: '2026-01-05', patternName: 'Wolf' }];
    expect(patternForNight(bare, '2026-01-05', 'Thursday')).toBe('Wolf');
    expect(patternForNight(rows, '2026-01-05')).toBe('Wolf');
  });
});
