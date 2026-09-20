import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { isContainerLeague } from './leagueMembership.js';
import { allowedLeagues } from './entitlements.js';

// ── Container leagues must survive the visibility filter ────────────────
//
// This guards a bug that made every practice, casual and tournament shot
// invisible across the whole app.
//
// The shape of it is worth keeping, because nothing about it looked
// broken from any single angle:
//
//   Container leagues are deliberately kept OUT of the leagues list, so
//   "Practice" doesn't sit in the Vault beside real leagues.
//
//   visibleLeagueNames is built from that list.
//
//   visibleShots admitted a shot only if its league was in that set.
//
// Each step is correct on its own. Together they dropped every shot
// bowled outside a named league -- silently, because the shots saved
// fine and scored fine. maxScoreThisGame reads the RAW list, so a game
// would show "247 max" above a completely empty scoresheet, and tapping
// a frame did nothing because there was no shot behind it.
//
// allowedLeagues had it right all along: it partitions containers out
// and returns them unconditionally. These tests pin the agreement
// between the two, in both directions.

const CONTAINERS = ['Practice', 'Just Bowling', 'Casual'];

describe('what counts as a container', () => {
  it('recognises practice, both casual names, and tournaments', () => {
    for (const name of CONTAINERS) {
      expect(isContainerLeague(name)).toBe(true);
    }
  });

  it('does not mistake a real league for one', () => {
    for (const name of ['Tuesday Classic', 'Monday Night Mixed', 'Scratch Masters']) {
      expect(isContainerLeague(name)).toBe(false);
    }
  });
});

describe('allowedLeagues keeps containers whatever the entitlement', () => {
  // A free bowler over the league limit loses real leagues. They must
  // never lose the ability to log a practice session -- that is not a
  // paid feature, and the data is theirs either way.
  it('returns containers even when real leagues are being locked', () => {
    const leagues = ['Practice', 'Just Bowling', 'Tuesday Classic', 'Monday Mixed', 'Thursday Trios'];
    const allowed = allowedLeagues(leagues, {
      entitlement: null,
      keptLeagueName: 'Tuesday Classic',
      billingLive: true,
    });
    expect(allowed).toContain('Practice');
    expect(allowed).toContain('Just Bowling');
    expect(allowed).toContain('Tuesday Classic');
  });
});

// ── The filter itself ───────────────────────────────────────────────────
//
// Modelled exactly as BowlingTracker builds it, and asserted against the
// real source below so the model cannot drift away from the app.
function visible(rows, visibleLeagueNames) {
  const ok = new Set(visibleLeagueNames);
  return rows.filter(s => !s || !s.league || ok.has(s.league) || isContainerLeague(s.league));
}

describe('shots bowled outside a named league still come back', () => {
  // The exact scenario from the bug report: a practice game, logged and
  // saved, that the scoresheet could not see.
  it('keeps a practice shot when the leagues list has no practice in it', () => {
    const shot = { id: 's1', league: 'Practice', bowler: 'Ryan', game: '1', frame: '1' };
    // Containers are absent from this list ON PURPOSE -- that is the
    // whole reason the bug existed.
    const named = ['Tuesday Classic'];
    expect(visible([shot], named)).toHaveLength(1);
  });

  it('keeps casual under either of its names', () => {
    const rows = [
      { id: 'a', league: 'Just Bowling' },
      { id: 'b', league: 'Casual' },
    ];
    expect(visible(rows, ['Tuesday Classic'])).toHaveLength(2);
  });

  it('still hides a real league the bowler has hidden or lost', () => {
    // The paywall and the hide-a-league feature must keep working. This
    // is the half of the behaviour that was correct.
    const rows = [
      { id: 'keep', league: 'Tuesday Classic' },
      { id: 'drop', league: 'Monday Mixed' },
    ];
    const kept = visible(rows, ['Tuesday Classic']);
    expect(kept.map(r => r.id)).toEqual(['keep']);
  });

  it('keeps a shot with no league at all', () => {
    expect(visible([{ id: 'x', league: '' }, { id: 'y' }], [])).toHaveLength(2);
  });

  it('survives nulls in the list', () => {
    expect(() => visible([null, undefined, { league: 'Practice' }], [])).not.toThrow();
  });
});

// ── The real code must actually do this ─────────────────────────────────
describe('BowlingTracker applies it to both shots and sessions', () => {
  const src = readFileSync(new URL('../BowlingTracker.jsx', import.meta.url), 'utf8');

  function filterBody(name) {
    const start = src.indexOf(`const ${name}=useMemo(`);
    expect(start).toBeGreaterThan(-1);
    return src.slice(start, src.indexOf('},[', start));
  }

  // Both, not one. Sessions carry the series and the scores; shots carry
  // the frames. Fixing only one leaves a practice night half visible,
  // which is harder to diagnose than it being wholly gone.
  it('exempts containers in visibleShots', () => {
    expect(filterBody('visibleShots')).toContain('isContainerLeague(s.league)');
  });

  it('exempts containers in visibleSessions', () => {
    expect(filterBody('visibleSessions')).toContain('isContainerLeague(s.league)');
  });

  it('still consults the allowed set rather than letting everything through', () => {
    // The fix must not become "show all rows". A real league that is
    // hidden or locked has to stay hidden.
    const body = filterBody('visibleShots');
    expect(body).toContain('ok.has(s.league)');
  });
});
