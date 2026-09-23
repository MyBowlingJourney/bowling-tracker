import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { TOUR_TRACKS, TRACK_KEYS, stepsForTrack, FIRST_TOUR } from './domain/tour.js';

// The tour promises a bowler what they will find in the app.
//
// It is the one part of the app with no way to notice it has gone
// stale: nothing imports the mock-ups, no screen renders against them,
// and a slide describing a chip row that changed last month looks
// exactly like one that is right. Several drifts had accumulated before
// anyone looked -- a Journey chip that had moved to its own screen, an
// "Other Leave" label the app shows as "Other", a journal drawn without
// the filters it had gained, a header of four icons where the app has
// three different ones, and a "Bowl" tab that does not exist.
//
// These are the mechanical parts of that promise: a step with no
// mock-up renders its words over blank space, and a track with no steps
// is a menu entry that opens nothing. Neither can be caught by reading
// the file, because both look fine in isolation.
//
// Whether a slide MATCHES the screen it describes still needs eyes.
// That is the argument for keeping the mock-ups small.

const SRC = path.resolve(__dirname);
const screenSource = fs.readFileSync(path.join(SRC, 'TourScreen.jsx'), 'utf8');

// The SCREENS map keys, read from the source rather than imported: the
// module is JSX and pulls in ui.jsx, which a plain node test cannot
// render. The keys are the contract; the markup is not.
function screenIds() {
  const body = screenSource.slice(screenSource.indexOf('const SCREENS = {'));
  return new Set([...body.matchAll(/^ {2}"([a-z0-9-]+)":/gm)].map(m => m[1]));
}

describe('tour contract', () => {
  const ids = screenIds();

  it('finds the mock-ups to check', () => {
    // A check that silently examines nothing passes forever while
    // covering nothing -- same reasoning as the other parser guards.
    expect(ids.size).toBeGreaterThan(15);
  });

  it('every step has a mock-up', () => {
    const missing = [];
    for (const track of TRACK_KEYS) {
      for (const step of stepsForTrack(track)) {
        if (!ids.has(step.id)) missing.push(`${track}: ${step.id}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it('every mock-up belongs to a step', () => {
    const stepIds = new Set(TRACK_KEYS.flatMap(t => stepsForTrack(t).map(s => s.id)));
    // An orphan is dead markup that will drift with nothing to correct
    // it, and it is invisible: nothing renders it.
    expect([...ids].filter(id => !stepIds.has(id))).toEqual([]);
  });

  it('every track has steps', () => {
    expect(TOUR_TRACKS.filter(t => !stepsForTrack(t.key).length).map(t => t.key)).toEqual([]);
  });

  it('every track in the menu is a real track, and the first tour is one', () => {
    expect(TOUR_TRACKS.map(t => t.key)).toEqual(TRACK_KEYS);
    expect(TRACK_KEYS).toContain(FIRST_TOUR);
  });

  it('every step declares a tab that exists', () => {
    // A step whose tab is not a real view navigates the app behind the
    // tour to nowhere, which reads as the tour breaking the app.
    const tabs = new Set(['home', 'log', 'gear', 'team', 'setup', 'stats', 'improve', 'history', 'social']);
    const bad = TRACK_KEYS.flatMap(t => stepsForTrack(t))
      .filter(s => s.tab && !tabs.has(s.tab))
      .map(s => `${s.id}: ${s.tab}`);
    expect(bad).toEqual([]);
  });

  it('step ids are unique', () => {
    const all = TRACK_KEYS.flatMap(t => stepsForTrack(t).map(s => s.id));
    expect(all.length).toBe(new Set(all).size);
  });

  it('the closing slide names every other track', () => {
    // It used to say "three other tours" and was wrong by the time a
    // fourth existed. Naming them is only better than counting them if
    // the names keep up. (The PICTURE beside these words is built from
    // TOUR_TRACKS directly, so only the prose can drift now.)
    const closing = stepsForTrack(FIRST_TOUR).find(s => s.id === 'look-more');
    expect(closing).toBeTruthy();
    const body = closing.body.toLowerCase();
    const unnamed = TOUR_TRACKS
      .filter(t => t.key !== FIRST_TOUR)
      .filter(t => !body.includes(t.key));
    expect(unnamed.map(t => t.key)).toEqual([]);
  });

  it('no mock-up draws a tab the nav does not have', () => {
    // "Bowl" was a Phone title on seven slides and has not been a tab
    // for a long time -- the logging screens show the app name. A tour
    // naming a tab that is not on the row is the single most confusing
    // thing it can do, because the bowler goes looking for it.
    const titles = [...screenSource.matchAll(/<Phone title="([^"]+)"/g)].map(m => m[1]);
    const allowed = new Set([
      'My Bowling Journey', 'Setup', 'Stats', 'Improve', 'History',
      'Tournament', 'Import scorecard', 'Coach', 'Results', 'Friends', 'Standings',
    ]);
    expect(titles.filter(t => !allowed.has(t))).toEqual([]);
  });
});
