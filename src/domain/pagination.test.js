import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

// ── Reading past the 1000-row ceiling ───────────────────────────────
//
// PostgREST caps every response at a maximum row count; Supabase's
// default is 1000. It does not error and it does not warn. It returns
// the first 1000 rows and a `content-range: 0-999/*` header that
// nothing in this app was reading.
//
// A bowler with 2020 shots got 1000 of them. Averages stayed correct,
// because sessions is a small table well under the cap, while every
// shot-derived number silently described half a season. That mismatch
// -- right averages, wrong strike rate -- is what it looks like from
// the outside, and it reads as a stats bug rather than a sync one.
//
// The part that makes it permanent: after a truncated read the cursor
// advances to the newest row IN THAT PAGE. Rows older than it can then
// never be requested again -- a delta only asks for newer, and a full
// refresh truncates at 1000 all over again. They are not late. They are
// gone until something clears the cursor.
//
// It takes roughly one active season to reach, which is why nothing in
// testing ever saw it.
//
// These tests use a fake query builder that enforces the SAME ceiling
// the server does. A fake that returns everything would pass whether or
// not the code paginates, which would make it worse than no test.

const SERVER_CAP = 1000;

// Mimics PostgREST: honours .range() and truncates anything larger than
// the cap, exactly as the real server does.
function makeTable(rowCount) {
  const rows = Array.from({ length: rowCount }, (_, i) => ({ id: `r${i}`, updated_at: `2026-01-01T00:00:${i}Z` }));
  const calls = [];
  const builder = () => {
    let from = 0;
    let to = SERVER_CAP - 1;
    const q = {
      select() { return q; },
      gte() { return q; },
      eq() { return q; },
      abortSignal() { return q; },
      range(a, b) {
        from = a;
        // The server never sends more than the cap, however wide the ask.
        to = Math.min(b, a + SERVER_CAP - 1);
        return q;
      },
      then(resolve) {
        calls.push([from, to]);
        resolve({ data: rows.slice(from, to + 1), error: null });
      },
    };
    return q;
  };
  return { builder, calls, total: rowCount };
}

// The loop under test, matching readAllPages in syncQueue.js. Imported
// behaviour is asserted separately below against the real source; this
// models the algorithm so the edge cases can be driven directly.
async function readAllPages(build) {
  const all = [];
  for (let from = 0; ; from += SERVER_CAP) {
    const { data, error } = await build().range(from, from + SERVER_CAP - 1);
    if (error) throw error;
    const page = data || [];
    all.push(...page);
    if (page.length < SERVER_CAP) return all;
  }
}

describe('reading a table larger than the server will send at once', () => {
  it('returns every row, not the first page', async () => {
    const t = makeTable(2020);
    const rows = await readAllPages(t.builder);
    expect(rows.length).toBe(2020);
  });

  it('asks for the pages it needs and no more', async () => {
    const t = makeTable(2020);
    await readAllPages(t.builder);
    // 0-999, 1000-1999, 2000-2999 (short, stops).
    expect(t.calls).toEqual([[0, 999], [1000, 1999], [2000, 2999]]);
  });

  it('loses nothing at the page boundary', async () => {
    const t = makeTable(2020);
    const rows = await readAllPages(t.builder);
    const ids = new Set(rows.map(r => r.id));
    expect(ids.size).toBe(2020);           // no duplicates
    expect(ids.has('r999')).toBe(true);    // last of page one
    expect(ids.has('r1000')).toBe(true);   // first of page two
  });

  // Exactly the cap is the case a short-page check can get wrong: the
  // first page is full, so it must ask again and get an empty second
  // page before concluding it is done.
  it('handles a table of exactly the cap', async () => {
    const t = makeTable(1000);
    const rows = await readAllPages(t.builder);
    expect(rows.length).toBe(1000);
    expect(t.calls).toEqual([[0, 999], [1000, 1999]]);
  });

  it('handles an empty table without looping', async () => {
    const t = makeTable(0);
    expect(await readAllPages(t.builder)).toEqual([]);
    expect(t.calls).toEqual([[0, 999]]);
  });

  it('handles a table under the cap in one request', async () => {
    const t = makeTable(868);
    const rows = await readAllPages(t.builder);
    expect(rows.length).toBe(868);
    expect(t.calls).toEqual([[0, 999]]);
  });

  // The real season, at the size that broke it.
  it('reads a 2020-shot season completely', async () => {
    const t = makeTable(2020);
    const rows = await readAllPages(t.builder);
    expect(rows.length).toBe(t.total);
    expect(rows[0].id).toBe('r0');
    expect(rows[rows.length - 1].id).toBe('r2019');
  });

  // Without paging, this is what the app did -- kept for contrast, so
  // the difference between the two behaviours is stated rather than
  // implied.
  it('one unpaged request would have returned only 1000', async () => {
    const t = makeTable(2020);
    const { data } = await t.builder().range(0, 9999);
    expect(data.length).toBe(SERVER_CAP);
  });
});

// ── The real code must actually page ────────────────────────────────
describe('syncQueue reads every page', () => {
  const src = readFileSync(new URL('../syncQueue.js', import.meta.url), 'utf8');

  it('has a paging helper', () => {
    expect(src).toContain('readAllPages');
    expect(src).toMatch(/\.range\(/);
  });

  it('pages the full read and both halves of the delta', () => {
    // cloudRead, delta rows, delta tombstones.
    const uses = src.match(/readAllPages\(/g) || [];
    expect(uses.length).toBeGreaterThanOrEqual(4); // 1 definition + 3 uses
  });

  it('stops on a short page rather than asking for an exact count', () => {
    // Scoped to the paging helper itself. `count: 'exact'` is used
    // legitimately elsewhere in this file -- on UPDATE and DELETE, to
    // report how many rows were affected -- and asserting against the
    // whole file flags those, which is a false alarm about correct code.
    //
    // Here it would mean counting the entire table on every page to
    // learn what a short page already tells us, on the largest table
    // the app has.
    const start = src.indexOf('async function readAllPages');
    expect(start).toBeGreaterThan(-1);
    const helper = src.slice(start, src.indexOf('export async function cloudRead', start));
    expect(helper).not.toContain('count:');
    expect(helper).toContain('PAGE_SIZE');
  });

  it('builds a fresh query per page', () => {
    // A PostgREST builder is single-use. Re-ranging a spent one returns
    // the first page forever, which turns the loop into a hang.
    expect(src).toMatch(/readAllPages\(\s*\(\)\s*=>/);
  });
});
