// @vitest-environment jsdom
import { describe, it, expect, beforeAll } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import StatsView from './StatsView.jsx';
import { statsByCenter, statsByRackType } from './domain/centers.js';
import { defaultPreferences } from './domain/preferences.js';
import fs from 'fs';
import path from 'path';

// ── Do the cards actually SHOW anything? ────────────────────────────
//
// The failure this guards against is not a crash. It is a card that
// quietly renders nothing.
//
// statsByRackType takes a list of leagues and reads `l.centerId` off
// each one. It was called with a list of league NAME STRINGS. A string
// has no centerId, so every session and shot was skipped, the function
// returned [], and the Free Fall vs String card returned null. No error,
// no warning, no failing test -- the card simply was not there, which on
// screen is indistinguishable from "you have not bowled enough yet".
//
// It then took TWO rounds to fix, because the first fix addressed a
// different cause of the same blank card (a missing column in the
// query, now covered by schemaContract.test.js) and the blankness was
// reported as fixed while still blank.
//
// Every unit test on statsByRackType passed throughout. They pass the
// right shape, because they were written by whoever knew the shape.
// This test does the opposite: it builds the inputs the way the APP
// builds them and asserts real numbers reach the screen.
//
// WHY RENDERED MARKUP AND NOT RETURN VALUES: a function returning good
// data that no card displays is the same bug from the bowler's side.
// Asserting on the HTML is the only assertion that cannot pass while
// the screen is empty.

beforeAll(() => {
  globalThis.window = {
    ...(globalThis.window || {}),
    storage: { get: async () => null, set: async () => {}, delete: async () => {} },
    matchMedia: () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} }),
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    addEventListener: () => {}, removeEventListener: () => {},
  };
});

// ── A bowler with a real season ─────────────────────────────────────
//
// Two houses, one of each rack type, because the comparison card needs
// both to say anything -- one type is not a comparison, it is your
// average again.
const BOWLER = 'Ryan';

const centers = [
  { id: 'c1', name: 'Riverside Lanes', city: 'Pittsburgh', state: 'PA', rackType: 'freefall' },
  { id: 'c2', name: 'Kingpin Alley', city: 'Springfield', state: 'OH', rackType: 'string' },
];

// The app holds leagues as a list of NAMES and the center as a separate
// name->id map. Reproduced exactly, because the shape mismatch between
// these two and what the stats functions want is the bug.
const leagues = ['Tuesday Classic', 'Thursday Handicap'];
const leagueCenters = { 'Tuesday Classic': 'c1', 'Thursday Handicap': 'c2' };

const sessions = [
  { bowler: BOWLER, league: 'Tuesday Classic', date: '2026-01-06', scores: [210, 225, 198], total: 633 },
  { bowler: BOWLER, league: 'Tuesday Classic', date: '2026-01-13', scores: [190, 244, 212], total: 646 },
  { bowler: BOWLER, league: 'Thursday Handicap', date: '2026-01-08', scores: [180, 175, 190], total: 545 },
  { bowler: BOWLER, league: 'Thursday Handicap', date: '2026-01-15', scores: [201, 168, 188], total: 557 },
];

// First balls, with a messenger count that differs by rack type -- the
// whole point of the card, since strung pins rarely send one.
function firstBalls(league, count, strikes, messengers) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const isStrike = i < strikes;
    out.push({
      bowler: BOWLER, league, date: '2026-01-06', game: 1, frame: (i % 10) + 1, ballNum: 1,
      result: isStrike ? 'Strike' : 'Other Leave',
      strikeDescription: isStrike ? (i < messengers ? 'Messenger' : 'Flush') : '',
    });
  }
  return out;
}
const shots = [
  ...firstBalls('Tuesday Classic', 60, 40, 10),
  ...firstBalls('Thursday Handicap', 60, 30, 3),
];

// Exactly how BowlingTracker builds them. If this line and the app's
// ever disagree, this test is testing a fiction -- so the last block in
// this file reads the real call site and checks it still matches.
const leaguesWithCenters = leagues.map(name => ({ name, centerId: leagueCenters[name] }));
const centerStats = statsByCenter(sessions, leaguesWithCenters, centers, BOWLER, shots);
const rackTypeStats = statsByRackType(sessions, shots, leaguesWithCenters, centers, BOWLER);

// ── Every other prop, at a neutral value ────────────────────────────
//
// StatsView takes 91 props and builds EVERY card's JSX eagerly into one
// object before filtering down to the group being shown -- so rendering
// the Center group still evaluates the Splits card, the ten-pin card and
// the rest. 66 of those props have no default, and omitting any one of
// them is a runtime crash rather than a missing card.
//
// Shapes here are taken from how BowlingTracker computes each one, not
// guessed: rng, bStats, mCounts and compareSessions are arrays because
// their definitions are filters and maps; bowlerLeagueCount is a count;
// leftHandedForBowler is a function.
//
// Neutral, not realistic, on purpose. The cards under test get real
// data above; everything else gets the emptiest legal value, so if one
// of those cards ever starts rendering content out of nothing, that is
// a bug this fixture will expose rather than hide.
// The app's own defaults, not a hand-written literal. A partial
// preferences object is worse than none: StatsView reads
// preferences.trackedFields.miss, so a fixture missing trackedFields
// crashes in a way that looks like a product bug and is not.
const PREFS = defaultPreferences('league');

// A paying bowler. Comparison cards -- one house against another, free
// fall against string -- are part of the paid plan, so with a free
// entitlement these cards correctly render a lock instead of numbers.
// Shape taken from hasPaidSubscription: plan "plus", a live status, and
// a period end in the future.
const SUBSCRIBER = {
  plan: 'plus',
  status: 'active',
  current_period_end: new Date(Date.now() + 30 * 864e5).toISOString(),
};

const NEUTRAL = {
  leftHandedForBowler: () => false,
  ballProfile: {},
  setStatsBowler: () => {}, setCompareBowler: () => {}, setCompareFriendId: () => {},
  setStatsLeague: () => {}, setCompareLeague: () => {},
  onLoadFriendData: () => {}, onOpenFriends: () => {},
  compareBowler: '', compareFriendId: '', compareSessions: [],
  statsLeague: '', compareLeague: '', compareLabel: '',
  FRAME_POSITION_RELIABILITY_THRESHOLD: 20,
  allFirstBalls: [], fivePinAttempts: [], framePosition: [], frameShots: [],
  mCounts: [], nonSplitLeaveList: [], nonStrikeFirstBalls: [], rng: [],
  singlePinAttempts: [], splitBreakdownList: [], tenPinAttempts: [], bStats: [],
  bowlerLeagueCount: 1,
  cleanFrameCount: 0, cleanFrameR: 0, firstBallAvg: 0, fivePinMisses: 0,
  framePositionGamesLogged: 0, framePositionReliable: false,
  hideIndividualOnly: false, isTeamView: false, showTeamCompare: false,
  leaveAvg: 0, singlePinMade: 0, singlePinSpareR: 0, spR: 0,
  splitConvR: 0, splitCount: 0, splitR: 0, stk: 0, stkR: 0,
  teamCleanFrameR: 0, teamFirstBallAvg: 0, teamLeaveAvg: 0,
  teamSinglePinSpareR: 0, teamSpR: 0, teamSplitConvR: 0, teamSplitR: 0,
  teamStkR: 0, teamTenPinRate: 0, teamTenPinSpareR: 0,
  tenPinLeaveCount: 0, tenPinMade: 0, tenPinSpareR: 0, tot: 0, wk: 0,
  handicapMatches: () => [], handicapSplit: () => ({ won: 0, lost: 0 }),
  longestStrikeStreak: () => 0, theoreticalScoreForGame: () => 0,
};

function renderCenterGroup(overrides = {}) {
  return renderToStaticMarkup(
    <StatsView
      {...NEUTRAL}
      entitlement={SUBSCRIBER}
      statsGroup="center"
      view="stats"
      shots={shots}
      statsShots={shots}
      sessions={sessions}
      bowlers={[BOWLER]}
      leagues={leagues}
      centers={centers}
      centerStats={centerStats}
      rackTypeStats={rackTypeStats}
      statsBowler={BOWLER}
      displayName={BOWLER}
      arsenals={{ [BOWLER]: [] }}
      teams={[]}
      matches={[]}
      saved={[]}
      preferences={PREFS}
      {...overrides}
    />
  );
}

describe('the stats inputs the app actually builds', () => {
  // The bug in one assertion. These are the values the app hands the
  // stats functions, and the only thing wrong with them was their shape.
  it('produces populated rack type stats, not an empty list', () => {
    expect(rackTypeStats.length).toBe(2);
    expect(rackTypeStats.every(r => r.games > 0)).toBe(true);
  });

  it('produces populated center stats', () => {
    expect(centerStats.length).toBe(2);
    expect(centerStats.every(c => c.games > 0 && c.average > 0)).toBe(true);
  });

  // Passing league NAMES instead of objects is what broke it. Proven
  // here so the shape requirement is documented as behaviour rather
  // than as a comment somebody can drift away from.
  it('returns nothing when handed league names instead of objects', () => {
    expect(statsByRackType(sessions, shots, leagues, centers, BOWLER)).toEqual([]);
    expect(statsByCenter(sessions, leagues, centers, BOWLER, shots)).toEqual([]);
  });
});

describe('the Center cards render real numbers', () => {
  const html = renderCenterGroup();

  it('renders both houses by name', () => {
    expect(html).toContain('Riverside Lanes');
    expect(html).toContain('Kingpin Alley');
  });

  it('renders the By Bowling Center card with games and a high game', () => {
    expect(html).toContain('By Bowling Center');
    expect(html).toContain('6 games');
    // High game is the other half of what this card is for.
    expect(html).toContain('High 244');
  });

  it('renders the Free Fall vs String card with both rack types', () => {
    expect(html).toContain('Free Fall vs String');
    expect(html).toContain('Free fall');
    expect(html).toContain('String');
  });

  it('shows a strike percentage on the rack type card', () => {
    // 40 of 60 first balls at the free-fall house.
    expect(html).toContain('66.7% strikes');
    // 30 of 60 at the strung house.
    expect(html).toContain('50% strikes');
  });

  // The label matters as much as the number. "25% messengers" next to a
  // strike rate reads as a share of every shot; it is a share OF the
  // strikes, and the two stacked together otherwise look like they add
  // up to something.
  it('states that the messenger rate is a share of strikes', () => {
    expect(html).toContain('of strikes were messengers');
    expect(html).toContain('25% of strikes were messengers'); // 10 of 40
    expect(html).toContain('10% of strikes were messengers'); // 3 of 30
  });

  // By Bowling Center was trimmed to average, games and high game.
  // Rack type and messengers moved to the card built for that question.
  it('keeps the rack type and messenger detail off the per-house card', () => {
    const perHouse = html.slice(
      html.indexOf('By Bowling Center'),
      html.indexOf('Free Fall vs String')
    );
    expect(perHouse).not.toContain('messengers');
    expect(perHouse).not.toContain('sessions');
  });
});

describe('the Center cards when there is nothing to show', () => {
  // An empty state must be empty, not a row of zeroes and NaNs. "0% of
  // nothing" is not a rate, and a 0 here reads as "this never happens".
  it('renders without throwing and without inventing numbers', () => {
    const html = renderToStaticMarkup(
      <StatsView
        {...NEUTRAL}
        entitlement={SUBSCRIBER}
        statsGroup="center" view="stats"
        shots={[]} statsShots={[]} sessions={[]} bowlers={[BOWLER]} leagues={[]}
        centers={[]} centerStats={[]} rackTypeStats={[]}
        statsBowler={BOWLER} displayName={BOWLER} arsenals={{ [BOWLER]: [] }}
        teams={[]} matches={[]} saved={[]}
        preferences={PREFS}
      />
    );
    expect(html).not.toContain('NaN');
    expect(html).not.toContain('undefined');
    expect(html).not.toContain('Free Fall vs String');
  });
});

// ── The paywall, proven rather than assumed ─────────────────────────
//
// Comparison cards are paid. That was switched on by flipping
// BILLING_LIVE and never verified from a free account -- a paywall
// nobody has watched hold is a paywall you hope is holding.
//
// This asserts BOTH directions from the same fixture, which is what
// makes it meaningful: identical data, one subscriber, one free bowler,
// and the numbers must appear for exactly one of them. A gate that
// passes because the data was empty proves nothing.
describe('the paywall on comparison cards', () => {
  const paid = renderCenterGroup({ entitlement: SUBSCRIBER });
  const free = renderCenterGroup({ entitlement: null });

  it('shows the numbers to a subscriber', () => {
    expect(paid).toContain('Riverside Lanes');
    expect(paid).toContain('66.7% strikes');
  });

  it('withholds them from a free bowler, with the same data', () => {
    expect(free).not.toContain('Riverside Lanes');
    expect(free).not.toContain('66.7% strikes');
    expect(free).not.toContain('of strikes were messengers');
  });

  // Locked must say WHY, not look like an empty app. A bowler who sees
  // a blank card assumes the feature is broken; one who sees a lock
  // knows there is something to buy.
  it('says it is locked rather than rendering nothing', () => {
    expect(free).toContain('By Bowling Center');
    expect(free).toContain('paid plan');
  });

  // A test account bypasses billing without having paid -- the whole
  // point of the flag, and the thing that would quietly disable the
  // paywall for everyone if isTestAccount were ever widened.
  it('treats a test account as unlocked', () => {
    const html = renderCenterGroup({ entitlement: { is_test_account: true } });
    expect(html).toContain('Riverside Lanes');
  });
});

// ── Is the fixture above still telling the truth? ───────────────────
//
// Everything in this file rests on one assumption: that the app builds
// its stats inputs the way the fixture does. The fixture is a COPY of
// BowlingTracker's line, and a copy can drift. If the app went back to
// passing bare league names, every test above would still pass while
// the card went blank again -- the exact failure this file exists to
// prevent, now hidden BY the file meant to catch it.
//
// So the call site is read from source and checked. Text, not
// behaviour, because the value being checked is which variable gets
// passed, and that does not survive being imported.
describe('the real call site still matches this fixture', () => {
  const tracker = fs.readFileSync(
    path.join(path.resolve(__dirname), 'BowlingTracker.jsx'), 'utf8'
  );

  it('still builds leaguesWithCenters as objects carrying centerId', () => {
    // The shape, not the formatting: whitespace may change, the fact
    // that each entry carries a centerId may not.
    const built = tracker.match(
      /const\s+leaguesWithCenters\s*=\s*leagues\.map\(\s*\(?\s*\w+\s*\)?\s*=>\s*\(\{([^}]*)\}\)/
    );
    expect(built).not.toBeNull();
    expect(built[1]).toContain('centerId');
  });

  // Passing `leagues` here instead of `leaguesWithCenters` is the
  // original bug, verbatim. Both functions take it, and both broke.
  it('passes leaguesWithCenters -- not leagues -- to both stats functions', () => {
    const rackCall = tracker.match(/statsByRackType\(([^;]*?)\)\s*;/);
    const centerCall = tracker.match(/const\s+centerStats\s*=\s*statsByCenter\(([^;]*?)\)\s*;/);

    expect(rackCall).not.toBeNull();
    expect(centerCall).not.toBeNull();

    for (const [label, call] of [['statsByRackType', rackCall[1]], ['statsByCenter', centerCall[1]]]) {
      const args = call.split(',').map(a => a.trim());
      expect(args, `${label} must receive leaguesWithCenters`).toContain('leaguesWithCenters');
      // And must NOT receive the bare names list in its place.
      expect(args, `${label} must not receive the bare leagues list`).not.toContain('leagues');
    }
  });
});

// ── A missing prop must cost a card, not the screen ─────────────────
//
// StatsView takes 91 props. A caller that forgets one used to take out
// the entire Stats screen: `frameShots.length` on undefined throws,
// React unmounts, and the bowler sees nothing at all with no way back.
//
// The props whose absence throws now have empty defaults. This renders
// with almost nothing passed -- far less than any real caller does --
// and asserts the screen survives. It is the safety net, tested; the
// block above is the real call site, also tested. Both matter, and for
// different reasons.
describe('a missing prop degrades instead of crashing', () => {
  it('renders every stats group with no props at all', () => {
    for (const group of ['overview', 'center', 'ball', 'game', 'team', 'trends']) {
      expect(() => renderToStaticMarkup(<StatsView statsGroup={group} />),
        `group "${group}" must not throw when given nothing`).not.toThrow();
    }
  });

  // The case that actually bites, and the one the first version of this
  // test missed: the card-building block is behind `shots.length > 0`,
  // so passing NOTHING never reaches the props that throw. A caller that
  // has shots but forgot the derived props is the real-world shape of
  // the mistake -- and the only shape that exercises the defaults.
  it('renders every stats group with shots but nothing derived', () => {
    for (const group of ['overview', 'center', 'ball', 'game', 'team', 'trends']) {
      expect(() => renderToStaticMarkup(
        <StatsView statsGroup={group} shots={shots} statsBowler={BOWLER} />
      ), `group "${group}" must not throw when only shots are passed`).not.toThrow();
    }
  });

  it('invents no numbers when it has no data', () => {
    const html = renderToStaticMarkup(
      <StatsView statsGroup="overview" shots={shots} statsBowler={BOWLER} />);
    // The three ways a missing value leaks onto the screen as a claim.
    expect(html).not.toContain('NaN');
    expect(html).not.toContain('undefined');
    expect(html).not.toContain('Infinity');
  });

  // The point of leaving numbers undefined rather than defaulting them
  // to 0: a bowler with no data loaded must not be told they strike 0%
  // of the time. An em dash says "not known"; a zero says "never".
  it('shows a dash rather than a zero for an unknown rate', () => {
    const html = renderToStaticMarkup(
      <StatsView statsGroup="overview" shots={shots} statsBowler={BOWLER} />);
    expect(html).not.toContain('0% strikes');
    expect(html).not.toContain('0.00');
  });
});
