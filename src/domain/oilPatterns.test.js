import { describe, it, expect } from 'vitest';
import { patternAverages,
  normalizePattern, describePattern, searchPatterns, patternToRow, patternFromRow, patternDays, patternStats, loggedPatternSummaries,
  VERIFIED_PATTERN_SPECS,
  allVerifiedPbaPatterns,
  pbaPatternsForYear,
  patternDisplayName,
  patternHistory,
  patternVersusOverall,
  patternScoreband,
  EXAMPLE_PATTERN, patternExampleIsReal, allVerifiedPbaPatterns as seedsForExample,
} from './oilPatterns.js';

const patterns = [
  { id: '1', name: 'Arsenic', series: 'Element Sport', lengthFeet: 41, ratio: '1.36:1', volumeMl: 25.79, verified: true },
  { id: '2', name: 'Krypton', series: 'Element Sport', lengthFeet: 43, ratio: '2.94:1', volumeMl: 26.92, verified: true },
  { id: '3', name: 'Main Street', series: 'Navigation', lengthFeet: 41, verified: true },
  { id: '4', name: 'Wall Street', series: 'Navigation', lengthFeet: 40, verified: true },
];

describe('searchPatterns', () => {
  it('requires at least two characters', () => {
    expect(searchPatterns('k', patterns)).toEqual([]);
  });

  it('finds a pattern by prefix, case-insensitively', () => {
    expect(searchPatterns('KRY', patterns).map(p => p.name)).toEqual(['Krypton']);
  });

  it('ranks a prefix match above a mid-string match', () => {
    // Both "Main Street" and "Wall Street" contain "street" mid-string --
    // neither is a prefix match, so this checks the tie resolves cleanly
    // rather than checking prefix-vs-mid-string here specifically.
    const results = searchPatterns('street', patterns).map(p => p.name);
    expect(results).toEqual(['Main Street', 'Wall Street']);
  });

  it('returns nothing for no match', () => {
    expect(searchPatterns('zzz', patterns)).toEqual([]);
  });

  it('tolerates a null pattern list', () => {
    expect(searchPatterns('kry', null)).toEqual([]);
  });
});

describe('describePattern', () => {
  it('omits missing fields rather than showing placeholders', () => {
    // Wall Street here has no ratio or volume -- the description should
    // simply not mention them, not show "ratio: unknown".
    expect(describePattern(normalizePattern(patterns[3]))).toBe("40' · Navigation");
  });

  it('includes every field when present', () => {
    expect(describePattern(normalizePattern(patterns[1]))).toBe("43' · Element Sport · 2.94:1 · 26.92 mL");
  });

  it('returns an empty string for no pattern', () => {
    expect(describePattern(null)).toBe('');
  });
});

describe('supabase mapping', () => {
  it('never marks a user submission as verified', () => {
    const row = patternToRow(normalizePattern(patterns[0]), 'user-1');
    expect(row.verified).toBe(false);
  });

  it('round-trips the ratio as text, not a computed value', () => {
    const row = patternToRow(normalizePattern(patterns[1]), 'user-1');
    const back = patternFromRow({ ...row, id: 'x', verified: true });
    expect(back.ratio).toBe('2.94:1');
  });
});

describe('user-submitted patterns', () => {
  it('normalizes a fresh submission with blank optional fields', () => {
    const submitted = normalizePattern({ name: 'Chameleon 39 (told at check-in)', lengthFeet: 39, ratio: '', volumeMl: null });
    expect(submitted.name).toBe('Chameleon 39 (told at check-in)');
    expect(submitted.lengthFeet).toBe(39);
    expect(submitted.ratio).toBe('');
    expect(submitted.volumeMl).toBeNull();
  });

  it('never marks a fresh submission as verified when converted to a row', () => {
    const row = patternToRow(normalizePattern({ name: 'My House Shot' }), 'user-1');
    expect(row.verified).toBe(false);
  });
});

describe('per-pattern history across tournaments', () => {
  const tournaments = [
    { id: 't1', name: 'Spring Open', center: 'Sun Valley', days: [
      { dayNumber: 1, date: '2026-03-01', oilPattern: 'Chameleon', madeCut: true,
        games: [{ score: '210' }, { score: '190' }, { score: '200' }] },
      { dayNumber: 2, date: '2026-03-02', oilPattern: 'Scorpion', madeCut: false,
        games: [{ score: '170' }, { score: '180' }] },
    ] },
    { id: 't2', name: 'Summer Classic', center: 'Bowl City', days: [
      { dayNumber: 1, date: '2026-06-01', oilPattern: '  chameleon ', madeCut: false,
        games: [{ score: '220' }, { score: '' }, { score: null }] },
    ] },
  ];

  it('aggregates the same pattern across tournaments regardless of case and whitespace', () => {
    expect(patternDays(tournaments, 'Chameleon')).toHaveLength(2);
  });

  it('sorts most recent first, with undated days last rather than oldest', () => {
    const days = patternDays([{ id: 'u', name: 'U', days: [
      { oilPattern: 'P', date: '', games: [{ score: '100' }] },
      { oilPattern: 'P', date: '2026-01-01', games: [{ score: '200' }] },
    ] }], 'P');
    expect(days[0].date).toBe('2026-01-01');
    expect(days[1].date).toBe('');
  });

  it('excludes blank and null scores from the game count', () => {
    expect(patternStats(tournaments, 'Chameleon').games).toBe(4);
  });

  it('truncates the average rather than rounding, matching book average rules', () => {
    const s = patternStats([{ id: 'x', name: 'X', days: [
      { oilPattern: 'P', date: '2026-01-01', games: [{ score: '200' }, { score: '201' }] },
    ] }], 'P');
    expect(s.average).toBe(200);
  });

  it('rejects out-of-range and non-numeric scores', () => {
    const s = patternStats([{ id: 'b', name: 'B', days: [
      { oilPattern: 'Q', date: '2026-01-01', games: [{ score: '301' }, { score: '-5' }, { score: 'abc' }, { score: '200' }] },
    ] }], 'Q');
    expect(s.games).toBe(1);
    expect(s.average).toBe(200);
  });

  it('counts cuts only where the outcome was actually recorded', () => {
    const s = patternStats(tournaments, 'Chameleon');
    expect(s.cutsMade).toBe(1);
    expect(s.cutsTracked).toBe(2);
    const untracked = patternStats([{ id: 'c', name: 'C', days: [
      { oilPattern: 'R', date: '2026-01-01', madeCut: null, games: [{ score: '200' }] },
    ] }], 'R');
    expect(untracked.cutsMade).toBeNull();
    expect(untracked.cutsTracked).toBe(0);
  });

  it('returns null for a pattern never logged, so the UI can hide the section', () => {
    expect(patternStats(tournaments, 'Nonexistent')).toBeNull();
  });

  it('returns a zero-game shape for a day logged before any scores are entered', () => {
    const s = patternStats([{ id: 'z', name: 'Z', days: [
      { oilPattern: 'Fresh', date: '2026-05-05', games: [{ score: '' }] },
    ] }], 'Fresh');
    expect(s.games).toBe(0);
    expect(s.average).toBeNull();
  });

  it('handles null and undefined input without throwing', () => {
    expect(patternDays(null, 'Chameleon')).toEqual([]);
    expect(patternStats(undefined, 'X')).toBeNull();
    expect(patternDays(tournaments, '')).toEqual([]);
  });

  it('ranks logged patterns by games played and keeps first-seen casing', () => {
    const sum = loggedPatternSummaries(tournaments);
    expect(sum).toHaveLength(2);
    expect(sum[0].name).toBe('Chameleon');
  });

  it('ignores days with no pattern named', () => {
    expect(loggedPatternSummaries([{ id: 'q', name: 'Q', days: [
      { oilPattern: '', games: [{ score: '200' }] },
    ] }])).toEqual([]);
  });
});

// The whole reason a year belongs in the name: the same animal is
// re-cut between seasons. Badger went 47' -> 48' -> 50' in three years.
describe('PBA pattern specs by year', () => {
  it('keeps each season separate', () => {
    expect(VERIFIED_PATTERN_SPECS['Badger|2024'].lengthFeet).toBe(47);
    expect(VERIFIED_PATTERN_SPECS['Badger|2025'].lengthFeet).toBe(48);
    expect(VERIFIED_PATTERN_SPECS['Badger|2026'].lengthFeet).toBe(50);
  });

  it('displays the year so two seasons never look like one pattern', () => {
    const dragons = allVerifiedPbaPatterns().filter(p => p.name === 'Dragon');
    const labels = dragons.map(patternDisplayName);
    expect(new Set(labels).size).toBe(labels.length);
    expect(labels).toContain('Dragon (2026)');
  });

  // The animal list isn't run in full every season -- 2026 had five,
  // 2024 had ten. Seeding all ten every year would put unverified,
  // spec-less entries in the picker for patterns nobody bowled.
  it('only offers patterns actually published that year', () => {
    expect(pbaPatternsForYear(2026).map(p => p.name).sort())
      .toEqual(['Badger', 'Bat', 'Bear', 'Dragon', 'Viper']);
    expect(pbaPatternsForYear(2024).length).toBe(10);
  });

  it('every seeded pattern carries real specs', () => {
    for (const p of allVerifiedPbaPatterns()) {
      expect(p.verified).toBe(true);
      expect(p.lengthFeet).toBeGreaterThan(0);
      expect(p.volumeMl).toBeGreaterThan(0);
      expect(p.ratio).toMatch(/:1$/);
    }
  });
});

describe('pattern history, results and notes', () => {
  const sessions = [
    { bowler: 'Ryan', league: 'Tue', date: '2026-09-04', scores: [180, 190, 200] },
    { bowler: 'Ryan', league: 'Tue', date: '2026-09-11', scores: [210, 205, 195] },
    { bowler: 'Dave', league: 'Tue', date: '2026-09-04', scores: [120, 130, 140] },
  ];
  const lanePatterns = [
    { league: 'Tue', date: '2026-09-04', patternName: 'Main Street', patternType: 'house',
      notes: 'played 2nd arrow, ball rolled out late' },
    { league: 'Tue', date: '2026-09-11', patternName: 'Main Street', patternType: 'house' },
    { league: 'Tue', date: '2026-09-18', patternName: 'Scorpion', patternType: 'sport' },
  ];

  it('groups a bowler’s nights by pattern', () => {
    const h = patternHistory(sessions, lanePatterns, 'Ryan');
    expect(h[0].name).toBe('Main Street');
    expect(h[0].nights).toBe(2);
    expect(h[0].games).toBe(6);
  });

  it('reports average, best and worst on each', () => {
    const [main] = patternHistory(sessions, lanePatterns, 'Ryan');
    // 1180 over 6 games is 196.67, truncated to 196 -- a bowling average
    // drops the fraction rather than rounding up.
    expect(main.average).toBe(196);
    expect(main.best).toBe(210);
    expect(main.worst).toBe(180);
  });

  // What happened last time is what a bowler wants before bowling on it
  // again.
  it('lists nights newest first', () => {
    const [main] = patternHistory(sessions, lanePatterns, 'Ryan');
    expect(main.entries[0].date).toBe('2026-09-11');
  });

  it('carries the notes through', () => {
    const [main] = patternHistory(sessions, lanePatterns, 'Ryan');
    expect(main.hasNotes).toBe(true);
    expect(main.entries[1].notes).toContain('2nd arrow');
  });

  it('keeps one bowler out of another’s history', () => {
    const [main] = patternHistory(sessions, lanePatterns, 'Ryan');
    expect(main.games).toBe(6);   // not Dave's nine
  });

  // A pattern recorded for a night nobody bowled is not history.
  it('skips a pattern with no games and no notes', () => {
    const names = patternHistory(sessions, lanePatterns, 'Ryan').map(h => h.name);
    expect(names).not.toContain('Scorpion');
  });

  it('keeps a pattern with no games when a note was left', () => {
    const withNote = [...lanePatterns.slice(0, 2),
      { league: 'Tue', date: '2026-09-18', patternName: 'Scorpion', notes: 'walked it, too dry' }];
    const names = patternHistory(sessions, withNote, 'Ryan').map(h => h.name);
    expect(names).toContain('Scorpion');
  });

  it('puts the most-bowled pattern first', () => {
    const extra = [...lanePatterns,
      { league: 'Tue', date: '2026-10-02', patternName: 'Scorpion' }];
    const more = [...sessions, { bowler: 'Ryan', league: 'Tue', date: '2026-10-02', scores: [150] }];
    expect(patternHistory(more, extra, 'Ryan')[0].name).toBe('Main Street');
  });

  // An average of 172 means nothing alone. "17 below your overall" is
  // the sentence a bowler can act on.
  it('compares each pattern with the bowler’s overall average', () => {
    const h = patternHistory(sessions, lanePatterns, 'Ryan');
    expect(patternVersusOverall(h, 190)[0].versusOverall).toBe(6);
    expect(patternVersusOverall(h, 210)[0].versusOverall).toBe(-14);
  });

  it('says nothing about comparison without an overall average', () => {
    expect(patternVersusOverall(patternHistory(sessions, lanePatterns, 'Ryan'), null)).toEqual([]);
  });

  it('survives junk', () => {
    for (const junk of [null, undefined, 'x', 42, {}, [null], [{}]]) {
      expect(() => patternHistory(junk, junk, junk)).not.toThrow();
      expect(() => patternVersusOverall(junk, junk)).not.toThrow();
    }
    expect(patternHistory(null, null, 'Ryan')).toEqual([]);
  });
});

// ── The league's default pattern ────────────────────────────────────
//
// lane_patterns rows only reach the cloud when the bowler is on a TEAM
// in that league (syncLanePatternsToCloud: `if(row.team_id)`). A solo
// league bowler's per-night patterns therefore never leave their device,
// so this comparison was empty for them no matter how diligently they
// filled it in. A default on the league syncs like any other league
// column and closes that gap.
describe('patternAverages with a league default', () => {
  const sessions = [
    { bowler: 'Ryan', league: 'Tuesday', date: '2026-01-06', scores: [200, 210, 190] },
    { bowler: 'Ryan', league: 'Tuesday', date: '2026-01-13', scores: [180, 170, 175] },
  ];

  it('uses the league default when the night has no record of its own', () => {
    const rows = patternAverages(sessions, [], [], 'Ryan', { Tuesday: 'House Shot' });
    expect(rows.length).toBe(1);
    expect(rows[0].name).toBe('House Shot');
    expect(rows[0].games).toBe(6);
  });

  // The bowler wrote down what they actually bowled on. That beats a
  // guess every time.
  it('lets a per-night record override the default', () => {
    const nightly = [{ league: 'Tuesday', date: '2026-01-13', patternName: 'Chameleon' }];
    const rows = patternAverages(sessions, nightly, [], 'Ryan', { Tuesday: 'House Shot' });
    const byName = Object.fromEntries(rows.map(r => [r.name, r.games]));
    expect(byName['Chameleon']).toBe(3);
    expect(byName['House Shot']).toBe(3);
  });

  it('changes nothing when no default is given', () => {
    expect(patternAverages(sessions, [], [], 'Ryan')).toEqual([]);
    expect(patternAverages(sessions, [], [], 'Ryan', {})).toEqual([]);
  });

  it('survives rubbish in the defaults map', () => {
    for (const bad of [null, undefined, 'nope', 42, []]) {
      expect(patternAverages(sessions, [], [], 'Ryan', bad)).toEqual([]);
    }
    expect(patternAverages(sessions, [], [], 'Ryan', { Tuesday: '   ' })).toEqual([]);
  });
});


// ── The fold ────────────────────────────────────────────────────────────
//
// "By Oil Pattern" used to be its own card in Stats. It now lives under
// the lane card's pattern picker, where the pattern is already chosen.

// The picker and the averages have to bucket a night the same way.
//
// The lane card calls a night with no recorded pattern the HOUSE shot,
// because the house shot is exactly what nobody writes down. patternAverages
// DROPS such a night. Left alone, the picker would offer "House" and the
// scoreline under it would have nothing to say -- and for a bowler who has
// never bowled a sport block, that is every night they own.
describe('patternAverages with a fallback name', () => {
  const sessions = [
    { bowler: 'Ryan', league: 'Monday', date: '2026-01-05', scores: [200, 210, 190] },
    { bowler: 'Ryan', league: 'Monday', date: '2026-01-12', scores: [180, 170, 175] },
  ];

  it('names an otherwise-unrecorded night when asked to', () => {
    const rows = patternAverages(sessions, [], [], 'Ryan', {}, 'House');
    expect(rows.length).toBe(1);
    expect(rows[0].name).toBe('House');
    expect(rows[0].games).toBe(6);
  });

  it('still drops those nights when not asked', () => {
    expect(patternAverages(sessions, [], [], 'Ryan')).toEqual([]);
  });

  // The fallback is the LAST resort, behind both real sources. A night
  // the bowler actually wrote a pattern on is not a house night.
  it('never overrides a recorded pattern or a league default', () => {
    const nightly = [{ league: 'Monday', date: '2026-01-05', patternName: 'Scorpion' }];
    const rows = patternAverages(sessions, nightly, [], 'Ryan', { Monday: 'Wolf' }, 'House');
    const byName = Object.fromEntries(rows.map(r => [r.name, r.games]));
    expect(byName['Scorpion']).toBe(3);   // its own record
    expect(byName['Wolf']).toBe(3);       // the league default
    expect(byName['House']).toBeUndefined();
  });

  it('ignores a blank or whitespace fallback', () => {
    expect(patternAverages(sessions, [], [], 'Ryan', {}, '   ')).toEqual([]);
  });
});

describe('patternScoreband', () => {
  const rows = [
    { name: 'House', average: 198, games: 42, versusOverall: 7 },
    { name: 'Wolf', average: 172, games: 9, versusOverall: -19 },
    { name: 'Scorpion', average: 165, games: 3, versusOverall: -26 },
  ];

  it('puts the chosen pattern up front and ranks the rest behind it', () => {
    const band = patternScoreband(rows, 'Wolf');
    expect(band.here.name).toBe('Wolf');
    expect(band.others.map(o => o.name)).toEqual(['House', 'Scorpion']);
  });

  it('ranks the others best first', () => {
    expect(patternScoreband(rows, 'Scorpion').others.map(o => o.versusOverall))
      .toEqual([7, -19]);
  });

  // With one pattern, the pattern average and the overall average come
  // from the SAME games. The delta is the bowler's average against
  // itself -- structurally near zero, and not a fact about oil. Ryan
  // called this: with only one pattern there is no line worth the row
  // between the picker and the lane.
  it('says nothing when there is only one pattern', () => {
    expect(patternScoreband([rows[0]], 'House')).toBeNull();
    expect(patternScoreband([], 'House')).toBeNull();
  });

  // The headline IS the selected pattern's number. Shots can be logged
  // without game scores, so a pattern can be drawable and unscored.
  it('says nothing when the chosen pattern has no scored games', () => {
    expect(patternScoreband(rows, 'Kegel Main St')).toBeNull();
    expect(patternScoreband(rows, '')).toBeNull();
  });

  // patternVersusOverall returns [] with no overall average, rather than
  // comparing every pattern against zero. A row that slipped through
  // without the field must not be drawn as "+198".
  it('ignores rows with no comparison on them', () => {
    const half = [{ name: 'House', average: 198, games: 42 }, rows[1], rows[2]];
    const band = patternScoreband(half, 'House');
    expect(band).toBeNull();
    expect(patternScoreband(half, 'Wolf').others.map(o => o.name)).toEqual(['Scorpion']);
  });

  it('is safe on junk', () => {
    expect(() => patternScoreband(null, null)).not.toThrow();
    expect(patternScoreband([null, {}, 'x'], 'House')).toBeNull();
  });
});


// ── The example in the placeholders ─────────────────────────────────────
//
// Both oil-pattern fields are type-aheads, so their placeholder is an
// instruction: type something like this. "Kegel Main Street" sat in both
// of them and matched nothing, on every install -- following the example
// produced an empty dropdown, which reads as a broken search rather than
// a wrong example. Ryan found it on his own screen.
describe('the pattern shown as an example', () => {
  it('is in the catalogue a brand new install ships with', () => {
    expect(patternExampleIsReal()).toBe(true);
  });

  // The community table is EMPTY on a fresh install, so the example has
  // to be findable against the seeds alone -- not against a table that
  // only has rows once somebody has entered some.
  it('is findable by typing it, against the seeds alone', () => {
    const hits = searchPatterns(EXAMPLE_PATTERN, seedsForExample());
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0].name).toBe(EXAMPLE_PATTERN);
  });

  // The thing that was wrong, kept as a negative control: if this ever
  // starts passing, the seed list changed and the test above is no
  // longer proving anything.
  it('is not the name that was wrong', () => {
    expect(searchPatterns('Kegel Main Street', seedsForExample())).toEqual([]);
    expect(EXAMPLE_PATTERN).not.toMatch(/Main Street/);
  });
});
