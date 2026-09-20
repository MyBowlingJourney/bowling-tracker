import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { mergeDelta, nextCursor, seedCursor } from './domain/deltaSync.js';

// ── Can a row ever become permanently unreachable? ──────────────────
//
// This file exists because of a night spent proving, query by query,
// that 1,152 shots were in the cloud, correctly owned, correctly
// timestamped, visible under RLS -- and simply never asked for by the
// app. Nothing errored. The bowler saw a season with a hole in it.
//
// mergeDelta and nextCursor both have thorough unit tests and every one
// of them passed throughout. They were not wrong. The bug was in the
// SEQUENCE: sync, store a cursor, rows arrive, sync again with a cursor
// that had moved past them. No single-function test can see that,
// because no single function is at fault.
//
// So these tests run the sequence, across loads, the way a phone does.
//
// ── The one invariant ───────────────────────────────────────────────
//
// A cursor is a promise: "I have everything up to here." If it is ever
// set later than what the client actually holds, every row in the gap
// is unreachable FOREVER -- cursors only move forward, so no later sync
// re-asks for them. That is the whole bug class, and it is one
// property, checkable directly.

// A stand-in for the server. Rows carry server-assigned timestamps,
// which is the entire point: the client's clock must never be mistaken
// for one of these.
function makeCloud() {
  const rows = [];
  return {
    insert(id, updated_at, extra = {}) {
      rows.push({ id, updated_at, ...extra });
      return this;
    },
    // What cloudReadDelta does: everything at or after the cursor.
    since(cursor) {
      return cursor ? rows.filter(r => r.updated_at >= cursor) : [...rows];
    },
    all() {
      return [...rows];
    },
  };
}

// One app launch. Full fetch when there is no cursor, delta when there
// is -- matching the branch in BowlingTracker's load().
function launch(cloud, device) {
  if (!device.cursor) {
    const rows = cloud.since(null);
    device.rows = rows.slice();
    const seed = seedCursor(rows.map(r => r.updated_at));
    if (seed) device.cursor = seed;
  } else {
    const rows = cloud.since(device.cursor);
    device.rows = mergeDelta(device.rows, rows, []);
    device.cursor = nextCursor(device.cursor, rows.map(r => r.updated_at));
  }
  return device;
}

const has = (device, id) => device.rows.some(r => r.id === id);

describe('the sync cursor never outruns the data', () => {
  // The invariant, stated once and checked after every scenario below.
  function assertCursorIsHonest(device) {
    if (!device.cursor || !device.rows.length) return;
    const newestHeld = device.rows
      .map(r => r.updated_at)
      .sort()
      .slice(-1)[0];
    // Equal is fine and deliberate -- nextCursor uses the max as-is so
    // the boundary row is re-fetched next time, which merging makes
    // free. Later than the newest row held is the failure.
    expect(device.cursor <= newestHeld).toBe(true);
  }

  it('picks up rows written after the first sync', () => {
    const cloud = makeCloud().insert('a', '2026-09-18T06:10:00Z');
    const device = launch(cloud, { rows: [], cursor: null });
    expect(has(device, 'a')).toBe(true);

    cloud.insert('b', '2026-09-20T01:28:44Z');
    launch(cloud, device);

    expect(has(device, 'b')).toBe(true);
    assertCursorIsHonest(device);
  });

  // THE BUG, as a test.
  //
  // First launch on a phone whose table is empty -- a new sign-in, a
  // reinstall, a second device. The old code seeded the cursor from
  // `new Date()`. Then a row that already existed on the server, or one
  // written a moment later by another device with a server timestamp
  // just behind the phone's clock, sits below the cursor forever.
  it('does not strand rows when the first sync finds an empty table', () => {
    const cloud = makeCloud();
    const device = launch(cloud, { rows: [], cursor: null });

    // Nothing came back, so nothing is claimed. This is the fix: no
    // cursor rather than a cursor made of local time.
    expect(device.cursor).toBeFalsy();

    // A row whose server timestamp is BEFORE this phone's idea of now.
    cloud.insert('written-during-the-sync', '2026-09-20T03:35:00Z');
    launch(cloud, device);

    expect(has(device, 'written-during-the-sync')).toBe(true);
    assertCursorIsHonest(device);
  });

  // The same hole, reached the other way: rows came back but their
  // timestamps are unreadable, so there is no trustworthy server time
  // to anchor to. Claiming "now" would strand every one of them.
  it('claims nothing when no timestamp can be read', () => {
    expect(seedCursor([])).toBeNull();
    expect(seedCursor([null, undefined, 'not a date'])).toBeNull();
  });

  // A phone running fast must not be able to skip anything. With the
  // cursor only ever taken from server timestamps, the local clock
  // cannot enter the calculation at all -- which is the property, not
  // just the symptom.
  it('is unaffected by a phone clock running ahead', () => {
    const cloud = makeCloud().insert('a', '2026-09-18T06:10:00Z');
    const device = launch(cloud, { rows: [], cursor: null });

    const realNow = Date.now;
    try {
      // A day fast.
      Date.now = () => realNow() + 864e5;
      cloud.insert('b', '2026-09-20T01:28:44Z');
      launch(cloud, device);
    } finally {
      Date.now = realNow;
    }

    expect(has(device, 'b')).toBe(true);
    assertCursorIsHonest(device);
  });

  // Rows sharing the exact timestamp of the cursor must come back, not
  // be skipped as "already seen". nextCursor takes the max as-is rather
  // than max+1ms precisely so this stays safe.
  it('keeps rows written in the same instant as the cursor', () => {
    const cloud = makeCloud()
      .insert('a', '2026-09-18T06:10:00Z')
      .insert('b', '2026-09-18T06:10:00Z');
    const device = launch(cloud, { rows: [], cursor: null });
    expect(device.cursor).toBe('2026-09-18T06:10:00.000Z');

    cloud.insert('c', '2026-09-18T06:10:00Z');
    launch(cloud, device);

    expect(has(device, 'c')).toBe(true);
    assertCursorIsHonest(device);
  });

  // Many launches, rows arriving between each. Nothing may be lost at
  // any point -- this is the shape of ordinary use over a season.
  it('loses nothing across many launches', () => {
    const cloud = makeCloud();
    const device = { rows: [], cursor: null };
    for (let i = 0; i < 25; i++) {
      cloud.insert(`row-${i}`, new Date(Date.UTC(2026, 0, 1 + i, 12)).toISOString());
      launch(cloud, device);
      assertCursorIsHonest(device);
    }
    expect(device.rows.length).toBe(25);
    expect(cloud.all().every(r => has(device, r.id))).toBe(true);
  });

  // Clearing the cursor is what the Refresh from the Cloud button does.
  // It must recover a device that has somehow got ahead of itself --
  // that is the whole reason the button exists.
  it('recovers everything once the cursor is cleared', () => {
    const cloud = makeCloud().insert('a', '2026-09-18T06:10:00Z');
    const device = launch(cloud, { rows: [], cursor: null });

    // Simulate the damaged state: a cursor from the future, rows
    // beneath it, exactly as the app was found tonight.
    device.cursor = '2027-01-01T00:00:00Z';
    cloud.insert('stranded', '2026-09-20T01:28:44Z');
    launch(cloud, device);
    expect(has(device, 'stranded')).toBe(false); // still lost...

    device.cursor = null;                        // ...until the refresh
    launch(cloud, device);

    expect(has(device, 'stranded')).toBe(true);
    assertCursorIsHonest(device);
  });
});

// ── The app must actually use the safe seed ─────────────────────────
//
// Same reasoning as the call-site block in statsCards.test.jsx: the
// simulation above is only meaningful if the real load does the same
// thing. `new Date()` anywhere near a cursor is the defect, so the
// check is simply that it is not there.
describe('the real load seeds its cursors safely', () => {
  const tracker = fs.readFileSync(
    path.join(path.resolve(__dirname), 'BowlingTracker.jsx'), 'utf8'
  );

  it('seeds both cursors from server timestamps', () => {
    const seeds = tracker.match(/const\s+seed\s*=\s*[^;]+;/g) || [];
    expect(seeds.length).toBe(2); // shots and sessions
    for (const line of seeds) {
      expect(line).toContain('seedCursor');
      expect(line).not.toContain('new Date');
    }
  });

  it('stores a cursor only when there is a real one to store', () => {
    // `if (seed)` is what turns "no trustworthy timestamp" into "fetch
    // in full next time" rather than into a cursor of local time.
    const guarded = tracker.match(/if\(seed\)\{try\{await window\.storage\.set/g) || [];
    expect(guarded.length).toBe(2);
  });
});
