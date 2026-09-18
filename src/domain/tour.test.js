import { describe, it, expect } from 'vitest';
import {
  TOUR_TRACKS, TRACK_KEYS, FIRST_TOUR, availableTours, stepsForTrack,
  tourSteps, tourLength, stepAt, isLastStep,
  stepsSeenFrom, recordStepsSeen,
  hasSeenTour, markTourSeen, tourToOffer, pendingModeTour,
  needsLeagueSetup,
} from './tour.js';

// The tours were rebuilt from mode-based tracks (casual/practice/league/
// tournament/coach) to topic-based ones. These tests pin the shape the
// rebuild is meant to have, and the failure modes the old tours actually
// shipped.

describe('tracks', () => {
  it('has exactly the four topic tracks', () => {
    expect(TRACK_KEYS).toEqual(['look', 'score', 'ai', 'stats']);
  });

  it('every track has a label and a blurb', () => {
    for (const t of TOUR_TRACKS) {
      expect(typeof t.label).toBe('string');
      expect(t.label.length).toBeGreaterThan(0);
      expect(typeof t.blurb).toBe('string');
      expect(t.blurb.length).toBeGreaterThan(0);
    }
  });

  it('offers every track for replay — none is gated', () => {
    expect(availableTours().length).toBe(TOUR_TRACKS.length);
  });

  it('the first tour is one of the tracks', () => {
    expect(TRACK_KEYS).toContain(FIRST_TOUR);
  });
});

describe('slide counts', () => {
  // The counts are the specification, not an accident of authoring: a
  // track that quietly loses a slide is a topic that stops being
  // explained, and nothing else would notice.
  it('look around is 6 slides', () => expect(stepsForTrack('look').length).toBe(6));
  it('scorekeeping is 5 slides', () => expect(stepsForTrack('score').length).toBe(5));
  it('AI is 4 slides', () => expect(stepsForTrack('ai').length).toBe(4));
  it('stats is 4 slides', () => expect(stepsForTrack('stats').length).toBe(4));

  it('19 slides in total, with no step in two tracks', () => {
    const all = TRACK_KEYS.flatMap(k => stepsForTrack(k));
    expect(all.length).toBe(19);
    expect(new Set(all.map(s => s.id)).size).toBe(19);
  });
});

describe('every step is renderable', () => {
  const all = TRACK_KEYS.flatMap(k => stepsForTrack(k));

  it('each has an id, a title and a body', () => {
    for (const s of all) {
      expect(s.id).toMatch(/^[a-z][a-z-]+$/);
      expect(s.title.length).toBeGreaterThan(0);
      expect(s.body.length).toBeGreaterThan(0);
    }
  });

  it('each names the track it belongs to', () => {
    for (const s of all) expect(TRACK_KEYS).toContain(s.track);
  });

  it('no step mentions the Vault, which no longer exists', () => {
    // The whole reason for the rebuild. A tour promising a screen the
    // bowler will never find is worse than no tour.
    const text = all.map(s => `${s.title} ${s.body}`).join(' ');
    expect(/vault/i.test(text)).toBe(false);
  });
});

describe('tourSteps', () => {
  it('returns the named track', () => {
    expect(tourSteps({}, { track: 'ai' }).every(s => s.track === 'ai')).toBe(true);
  });

  it('falls back to the first tour for an unknown track', () => {
    // Callers predating the topic tracks pass "general" or "league". A
    // tour that opens empty looks like a broken button.
    for (const stale of ['general', 'league', 'casual', 'coach', undefined]) {
      expect(tourSteps({}, { track: stale }).length).toBe(stepsForTrack(FIRST_TOUR).length);
    }
  });

  it('survives junk in place of preferences or options', () => {
    for (const junk of [null, undefined, 7, 'x', []]) {
      expect(() => tourSteps(junk, junk)).not.toThrow();
      expect(tourSteps(junk, junk).length).toBeGreaterThan(0);
    }
  });

  it('drops steps already seen', () => {
    const first = stepsForTrack('score')[0].id;
    const got = tourSteps({}, { track: 'score', skipSeen: [first] });
    expect(got.map(s => s.id)).not.toContain(first);
    expect(got.length).toBe(4);
  });

  it('never returns nothing when everything has been seen', () => {
    const all = stepsForTrack('stats').map(s => s.id);
    const got = tourSteps({}, { track: 'stats', skipSeen: all });
    expect(got.length).toBe(1);
  });
});

describe('navigation', () => {
  const opts = { track: 'look' };

  it('tourLength matches the track', () => {
    expect(tourLength({}, opts)).toBe(6);
  });

  it('clamps rather than wrapping at both ends', () => {
    const steps = tourSteps({}, opts);
    expect(stepAt({}, -5, opts)).toBe(steps[0]);
    expect(stepAt({}, 999, opts)).toBe(steps[steps.length - 1]);
  });

  it('knows the last step', () => {
    expect(isLastStep({}, 4, opts)).toBe(false);
    expect(isLastStep({}, 5, opts)).toBe(true);
    expect(isLastStep({}, 99, opts)).toBe(true);
  });
});

describe('what has been seen', () => {
  it('records and recognises a track', () => {
    const seen = markTourSeen([], 'look');
    expect(hasSeenTour(seen, 'look')).toBe(true);
    expect(hasSeenTour(seen, 'stats')).toBe(false);
  });

  it('marking twice does not duplicate', () => {
    expect(markTourSeen(['look'], 'look')).toEqual(['look']);
  });

  it('tolerates a non-array', () => {
    expect(hasSeenTour(null, 'look')).toBe(false);
    expect(markTourSeen(null, 'look')).toEqual(['look']);
  });

  it('records step ids seen', () => {
    expect(recordStepsSeen([], [{ id: 'a' }, { id: 'b' }]).sort()).toEqual(['a', 'b']);
    expect(stepsSeenFrom(null)).toEqual([]);
  });
});

describe('what gets offered', () => {
  it('offers the look-around tour to someone new', () => {
    expect(tourToOffer({ seen: [] })).toBe(FIRST_TOUR);
  });

  it('offers nothing once it has been seen', () => {
    expect(tourToOffer({ seen: [FIRST_TOUR] })).toBe(null);
  });

  it('an old environment key does not count as the tour being seen', () => {
    // Existing bowlers have "league" or "casual" stored from the old
    // per-environment scheme. Those must not be mistaken for a topic
    // track -- being offered the look-around once more is the safe
    // direction; silently never offering it is not.
    expect(tourToOffer({ seen: ['league', 'casual', 'tournament'] })).toBe(FIRST_TOUR);
  });

  it('survives junk', () => {
    for (const junk of [null, undefined, 7, 'x', []]) {
      expect(() => tourToOffer(junk)).not.toThrow();
    }
  });

  it('no tour is triggered by switching mode', () => {
    expect(pendingModeTour()).toBe(null);
    expect(pendingModeTour({ environment: 'tournament', seen: [] })).toBe(null);
  });
});

describe('needsLeagueSetup', () => {
  it('only applies to league', () => {
    expect(needsLeagueSetup({ environment: 'casual', leagues: [] })).toBe(false);
    expect(needsLeagueSetup({ environment: 'practice', leagues: [] })).toBe(false);
  });

  it('true when a league bowler has no league', () => {
    expect(needsLeagueSetup({ environment: 'league', leagues: [] })).toBe(true);
  });

  it('false once a real league exists', () => {
    expect(needsLeagueSetup({ environment: 'league', leagues: ['Tuesday House Shot'] })).toBe(false);
  });

  it('a missing TEAM is not a reason to block', () => {
    // 11 of 31 new league bowlers abandoned at the roster screen when
    // this gated on a team. Scores need a league; they do not need a team.
    expect(needsLeagueSetup({ environment: 'league', leagues: ['Tuesday House Shot'], teams: [] })).toBe(false);
  });

  it('survives junk', () => {
    for (const junk of [null, undefined, 7, 'x', []]) {
      expect(() => needsLeagueSetup(junk)).not.toThrow();
      expect(needsLeagueSetup(junk)).toBe(false);
    }
  });
});
