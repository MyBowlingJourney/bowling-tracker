import { describe, it, expect, vi, beforeEach } from 'vitest';

// In-memory fake for idb's openDB — just enough surface to back the one
// object store syncQueue.js uses (pending_writes, keyed by autoincrement
// queueId). vi.hoisted lets this state be reset between tests even though
// the vi.mock factory below is hoisted above these declarations.
const dbState = vi.hoisted(() => ({ store: [], nextId: 1 }));

vi.mock('idb', () => ({
  openDB: async () => ({
    async add(_storeName, value) {
      const queueId = dbState.nextId++;
      dbState.store.push({ ...value, queueId });
      return queueId;
    },
    async put(_storeName, value) {
      const idx = dbState.store.findIndex(item => item.queueId === value.queueId);
      if (idx >= 0) dbState.store[idx] = value;
      else dbState.store.push(value);
      return value.queueId;
    },
    async getAll() {
      return [...dbState.store];
    },
    async delete(_storeName, queueId) {
      dbState.store = dbState.store.filter(item => item.queueId !== queueId);
    },
    async count() {
      return dbState.store.length;
    },
  }),
}));

// Configurable fake Supabase client. Each test sets `supabaseState.upsert`/
// `.delete`/`.update` to whatever behavior it wants to exercise (fast
// success, slow timeout, immediate error, zero rows affected).
//
// `signals` records every AbortSignal handed to a query, which is how the
// timeout behaviour is checked: withTimeout must CANCEL a request it has
// given up on, not merely stop waiting for it.
const supabaseState = vi.hoisted(() => ({
  upsert: async () => ({ error: null }),
  insert: async () => ({ error: null }),
  delete: async () => ({ error: null }),
  update: async () => ({ error: null }),
  select: async () => ({ data: [], error: null }),
  signals: [],
}));

// Shaped like a PostgREST builder: thenable, chainable, and carrying
// .abortSignal(). The real client has all three, and a mock missing any
// of them silently skips the code path that uses it.
function fakeQuery(run) {
  const filters = {};
  const q = {
    eq(k, v) { filters[k] = v; return q; },
    gte(k, v) { filters[k] = v; return q; },
    // select/gte are here because cloudRead and cloudReadDelta use them.
    // Nothing below tests those yet -- but a mock that silently lacks a
    // method the code calls fails as "x is not a function" three layers
    // down, which reads like a bug in the code rather than a gap in the
    // fake.
    select() { return q; },
    // range() is how cloudRead and cloudReadDelta page past the
    // server's 1000-row ceiling. Added for the same reason select and
    // gte are here: nothing below calls it yet, and a fake missing a
    // method the code calls fails in a way that reads like a bug in the
    // code. The range is recorded so a future test can assert which
    // pages were asked for.
    range(from, to) { filters.__range = [from, to]; return q; },
    abortSignal(sig) { supabaseState.signals.push(sig); return q; },
    then(resolve, reject) { Promise.resolve().then(() => run(filters)).then(resolve, reject); },
  };
  return q;
}

vi.mock('./supabaseClient.js', () => ({
  supabase: {
    from: (table) => ({
      upsert: (record) => fakeQuery(() => supabaseState.upsert(table, record)),
      insert: (record) => fakeQuery(() => supabaseState.insert(table, record)),
      delete: () => fakeQuery((filters) => supabaseState.delete(table, filters)),
      update: (changes) => fakeQuery((filters) => supabaseState.update(table, filters, changes)),
      select: () => fakeQuery((filters) => supabaseState.select(table, filters)),
    }),
  },
}));

const { cloudWrite, cloudInsert, cloudDelete, cloudUpdate, flushPendingQueue, getPendingCount } = await import('./syncQueue.js');
const { setActiveUserId } = await import('./domain/userScope.js');

function resetDb() { dbState.store = []; dbState.nextId = 1; }
function delay(ms, value) { return new Promise(resolve => setTimeout(() => resolve(value), ms)); }

beforeEach(() => {
  resetDb();
  // The queue is user-scoped: every item records who queued it, and
  // nothing is counted or flushed for anyone else. Without a signed-in
  // user there is no owner to stamp, so writes queue but are not this
  // user's backlog -- which is the point, and which made every count
  // assertion below read zero until this line existed.
  setActiveUserId('test-user');
  supabaseState.upsert = async () => ({ error: null });
  supabaseState.delete = async () => ({ error: null });
  supabaseState.update = async () => ({ error: null });
  supabaseState.select = async () => ({ data: [], error: null });
  supabaseState.signals = [];
});

describe('cloudWrite', () => {
  it('a fast successful write is not queued', async () => {
    const result = await cloudWrite('shots', { id: 'a' }, { timeoutMs: 100 });
    expect(result).toEqual({ synced: true, queued: false });
    expect(await getPendingCount()).toBe(0);
  });

  it('a write that hangs past the timeout falls back to the queue', async () => {
    supabaseState.upsert = () => delay(500, { error: null });
    const result = await cloudWrite('shots', { id: 'b' }, { timeoutMs: 50 });
    expect(result.synced).toBe(false);
    expect(result.queued).toBe(true);
    expect(await getPendingCount()).toBe(1);
  });

  it('an immediate error (offline) queues right away, without waiting out the full timeout', async () => {
    supabaseState.upsert = async () => { throw new Error('network error'); };
    const start = Date.now();
    const result = await cloudWrite('shots', { id: 'c' }, { timeoutMs: 5000 });
    const elapsed = Date.now() - start;
    expect(result.queued).toBe(true);
    expect(elapsed).toBeLessThan(1000); // nowhere near the 5s timeout
  });
});

describe('cloudDelete', () => {
  it('a fast successful delete is not queued', async () => {
    const result = await cloudDelete('shots', 'some-id', { timeoutMs: 100 });
    // `affected` is how many rows the delete actually touched. It is here
    // because RLS denies a command with no matching policy SILENTLY --
    // zero rows, no error -- and that is how deleting a team appeared to
    // work for months while changing nothing.
    //
    // null, not 0: this mock does not report a count, and an unknown
    // count must never be read as "nothing happened" or every backend
    // that answers differently looks like a silent failure.
    expect(result).toEqual({ synced: true, queued: false, affected: null });
  });

  it('reports how many rows a delete actually removed', async () => {
    supabaseState.delete = async () => ({ error: null, count: 0 });
    const result = await cloudDelete('shots', 'some-id', { timeoutMs: 100 });
    // Still "synced" -- PostgREST did not error, and pretending otherwise
    // would queue a retry that fails the same way forever.
    expect(result.synced).toBe(true);
    expect(result.affected).toBe(0);
  });

  it('accepts a composite match object for tables without a single id column', async () => {
    let capturedFilters = null;
    supabaseState.delete = async (_table, filters) => { capturedFilters = filters; return { error: null }; };
    await cloudDelete('team_members', { team_id: 'team-1', user_id: 'user-1' }, { timeoutMs: 100 });
    expect(capturedFilters).toEqual({ team_id: 'team-1', user_id: 'user-1' });
  });

  it('falls back to the queue on failure, preserving the match object as the payload', async () => {
    supabaseState.delete = async () => { throw new Error('offline'); };
    await cloudDelete('team_members', { team_id: 'team-1', user_id: 'user-1' }, { timeoutMs: 50 });
    expect(await getPendingCount()).toBe(1);
  });
});

describe('cloudUpdate', () => {
  it('sends the changes and matches on every key it was given', async () => {
    let seen = null;
    supabaseState.update = async (_t, filters, changes) => { seen = { filters, changes }; return { error: null }; };
    await cloudUpdate('team_members', { team_id: 't1', user_id: 'u1' }, { lineup_position: 2 }, { timeoutMs: 100 });
    expect(seen.filters).toEqual({ team_id: 't1', user_id: 'u1' });
    expect(seen.changes).toEqual({ lineup_position: 2 });
  });

  it('treats a bare id as a match on id', async () => {
    let seen = null;
    supabaseState.update = async (_t, filters) => { seen = filters; return { error: null }; };
    await cloudUpdate('teams', 'team-1', { name: 'x' }, { timeoutMs: 100 });
    expect(seen).toEqual({ id: 'team-1' });
  });

  it('falls back to the queue on failure', async () => {
    supabaseState.update = async () => { throw new Error('offline'); };
    const result = await cloudUpdate('teams', 'team-1', { name: 'x' }, { timeoutMs: 50 });
    expect(result.queued).toBe(true);
    expect(await getPendingCount()).toBe(1);
  });

  // The silent-failure case. With RLS on, a command with no matching
  // policy is denied by matching ZERO rows and returning NO error -- so
  // the client sees success. Three bugs of this exact shape shipped:
  // deleting a team did nothing, editing a coaching note did not save,
  // and a roster row could not be written by the team's own creator.
  it('reports how many rows it changed, so a denial is visible', async () => {
    supabaseState.update = async () => ({ error: null, count: 0 });
    const result = await cloudUpdate('teams', 'team-1', { name: 'x' }, { timeoutMs: 100 });
    expect(result.synced).toBe(true);
    expect(result.affected).toBe(0);
  });

  it('does not read an unknown count as zero', async () => {
    supabaseState.update = async () => ({ error: null });
    const result = await cloudUpdate('teams', 'team-1', { name: 'x' }, { timeoutMs: 100 });
    expect(result.affected).toBe(null);
  });
});

// A timeout that stops waiting but leaves the request running is how the
// same row got written twice: the app gave up, queued a retry, and the
// original landed minutes later.
describe('timed-out requests are cancelled', () => {
  it('attaches an abort signal to the query', async () => {
    await cloudWrite('shots', { id: 'a' }, { timeoutMs: 100 });
    expect(supabaseState.signals.length).toBeGreaterThan(0);
  });

  it('aborts the signal when the timeout wins', async () => {
    supabaseState.upsert = () => delay(500, { error: null });
    await cloudWrite('shots', { id: 'slow' }, { timeoutMs: 30 });
    await delay(20);
    expect(supabaseState.signals.some(sig => sig.aborted)).toBe(true);
  });

  it('leaves a request that finished in time alone', async () => {
    await cloudWrite('shots', { id: 'fast' }, { timeoutMs: 5000 });
    await delay(20);
    expect(supabaseState.signals.some(sig => sig.aborted)).toBe(false);
  });
});

describe('flushPendingQueue', () => {
  it('processes queued items in order and removes them on success', async () => {
    supabaseState.upsert = async () => { throw new Error('offline'); };
    await cloudWrite('shots', { id: 'x' }, { timeoutMs: 50 });
    await cloudWrite('shots', { id: 'y' }, { timeoutMs: 50 });
    expect(await getPendingCount()).toBe(2);

    supabaseState.upsert = async () => ({ error: null }); // back online
    await flushPendingQueue();
    expect(await getPendingCount()).toBe(0);
  });

  it('stops at the first failure, preserving order rather than skipping ahead', async () => {
    supabaseState.upsert = async () => { throw new Error('offline'); };
    await cloudWrite('shots', { id: 'x' }, { timeoutMs: 50 });
    await cloudWrite('shots', { id: 'y' }, { timeoutMs: 50 });
    await cloudWrite('shots', { id: 'z' }, { timeoutMs: 50 });

    const attempted = [];
    supabaseState.upsert = async (_table, record) => {
      attempted.push(record.id);
      if (record.id === 'y') throw new Error('still offline for this one');
      return { error: null };
    };
    await flushPendingQueue();

    expect(attempted).toEqual(['x', 'y']); // never reaches z
    expect(await getPendingCount()).toBe(2); // y and z both still queued
  });

  // ── Permanent failures expiring themselves ────────────────────────────
  //
  // A permanently-failing item cannot wedge the queue (it is skipped), but
  // before this it stayed forever and only a deliberate tap in the sync
  // panel removed it. Users should never have to do that, so droppable
  // ones now expire -- and the ones syncErrors says are NOT droppable
  // still must not.

  // Messages phrased the way Postgres actually phrases them. The first
  // draft of these said "failed with 23503", which classifySyncError read
  // as an HTTP 503 -- a real bug in the classifier, now fixed, and a
  // reminder that a test error should look like a production one.
  const MESSAGES = {
    '23503': 'insert or update on table "hidden_leagues" violates foreign key constraint "hidden_leagues_league_id_fkey"',
    '23505': 'duplicate key value violates unique constraint "shots_pkey"',
    '42501': 'new row violates row-level security policy for table "shots"',
  };
  const err = (code) => { const e = new Error(MESSAGES[code] || `error ${code}`); e.code = code; return e; };

  it('drops a foreign-key failure only after the third attempt', async () => {
    // Not the first: an FK violation is temporary when the parent row is
    // queued BEHIND the child, so an immediate drop would bin a write
    // that would have succeeded on the next flush.
    supabaseState.upsert = async () => { throw new Error('offline'); };
    await cloudWrite('hidden_leagues', { id: 'h1', league_id: 'ghost' }, { timeoutMs: 50 });
    expect(await getPendingCount()).toBe(1);

    supabaseState.upsert = async () => { throw err('23503'); };
    await flushPendingQueue();
    expect(await getPendingCount()).toBe(1);   // attempt 1: kept
    await flushPendingQueue();
    expect(await getPendingCount()).toBe(1);   // attempt 2: kept
    await flushPendingQueue();
    expect(await getPendingCount()).toBe(0);   // attempt 3: dropped
  });

  it('NEVER drops a permission denial, however many attempts', async () => {
    // 42501 is canDiscard:false in syncErrors, because the write never
    // landed and a policy fix could still let it through. Dropping it
    // would lose a real game to keep the queue tidy.
    supabaseState.upsert = async () => { throw new Error('offline'); };
    await cloudWrite('shots', { id: 's1' }, { timeoutMs: 50 });

    supabaseState.upsert = async () => { throw err('42501'); };
    for (let i = 0; i < 10; i++) await flushPendingQueue();
    expect(await getPendingCount()).toBe(1);
  });

  it('never drops a transient failure, however many attempts', async () => {
    supabaseState.upsert = async () => { throw new Error('offline'); };
    await cloudWrite('shots', { id: 's2' }, { timeoutMs: 50 });
    for (let i = 0; i < 10; i++) await flushPendingQueue();
    expect(await getPendingCount()).toBe(1);
  });

  it('still drops a duplicate immediately, without waiting for attempts', async () => {
    // 23505 means the row is already in the cloud, so there is nothing to
    // preserve and no reason to wait three flushes to say so.
    supabaseState.upsert = async () => { throw new Error('offline'); };
    await cloudWrite('shots', { id: 's3' }, { timeoutMs: 50 });

    supabaseState.upsert = async () => { throw err('23505'); };
    await flushPendingQueue();
    expect(await getPendingCount()).toBe(0);
  });

  it('counts attempts per item, not globally', async () => {
    // Two stuck items must each get their own three attempts; a shared
    // counter would drop the second one early.
    supabaseState.upsert = async () => { throw new Error('offline'); };
    await cloudWrite('hidden_leagues', { id: 'a' }, { timeoutMs: 50 });
    await cloudWrite('hidden_leagues', { id: 'b' }, { timeoutMs: 50 });

    supabaseState.upsert = async () => { throw err('23503'); };
    await flushPendingQueue();
    await flushPendingQueue();
    expect(await getPendingCount()).toBe(2);
    await flushPendingQueue();
    expect(await getPendingCount()).toBe(0);
  });
});

// The cross-account bug, at the unit level. A logs a shot offline, signs
// out, B signs in, the 30-second flush timer fires -- and A's shot used
// to land in B's account and be deleted from the queue on success, so A
// did not merely leak it, A lost it.
describe('user scoping', () => {
  it('does not flush one user\'s queued writes through another user\'s session', async () => {
    supabaseState.upsert = async () => { throw new Error('offline'); };
    setActiveUserId('bowler-a');
    await cloudWrite('shots', { id: 'a-shot' }, { timeoutMs: 50 });
    expect(await getPendingCount()).toBe(1);

    const attempted = [];
    supabaseState.upsert = async (_table, record) => { attempted.push(record.id); return { error: null }; };

    setActiveUserId('bowler-b'); // A signs out, B signs in
    expect(await getPendingCount()).toBe(0); // not B's backlog
    await flushPendingQueue();
    expect(attempted).toEqual([]); // nothing sent under B's session

    setActiveUserId('bowler-a'); // A comes back
    expect(await getPendingCount()).toBe(1); // still theirs, not lost
    await flushPendingQueue();
    expect(attempted).toEqual(['a-shot']);
    expect(await getPendingCount()).toBe(0);
  });

  it('flushes nothing at all when signed out', async () => {
    supabaseState.upsert = async () => { throw new Error('offline'); };
    setActiveUserId('bowler-a');
    await cloudWrite('shots', { id: 'a-shot' }, { timeoutMs: 50 });

    const attempted = [];
    supabaseState.upsert = async (_table, record) => { attempted.push(record.id); return { error: null }; };
    setActiveUserId(null);
    await flushPendingQueue();
    expect(attempted).toEqual([]);
  });

  it('counts only the current user\'s backlog', async () => {
    supabaseState.upsert = async () => { throw new Error('offline'); };
    setActiveUserId('bowler-a');
    await cloudWrite('shots', { id: 'a1' }, { timeoutMs: 50 });
    await cloudWrite('shots', { id: 'a2' }, { timeoutMs: 50 });
    setActiveUserId('bowler-b');
    await cloudWrite('shots', { id: 'b1' }, { timeoutMs: 50 });

    expect(await getPendingCount()).toBe(1);
    setActiveUserId('bowler-a');
    expect(await getPendingCount()).toBe(2);
  });
});

describe('cloudInsert never upserts', () => {
  // An upsert compiles to ON CONFLICT DO UPDATE SET over every column in
  // the payload, key columns included. Harmless while a role may update
  // every column, and broken the moment column privileges are narrowed --
  // team_members now grants UPDATE on three columns only, so an upsert
  // that hits an existing row is refused.
  //
  // The refusal is not rare: cloudWrite times out at six seconds and
  // queues for retry, so a write that succeeded slowly gets replayed,
  // hits the conflict, and would fail forever.
  it('sends an insert and never an upsert', async () => {
    const seen = [];
    supabaseState.insert = async (t) => { seen.push(['insert', t]); return { error: null }; };
    supabaseState.upsert = async (t) => { seen.push(['upsert', t]); return { error: null }; };
    await cloudInsert('team_members', { team_id: 't', user_id: 'u', lineup_position: 0 });
    expect(seen).toEqual([['insert', 'team_members']]);
  });

  // Adding someone already on the roster means the roster is correct --
  // but only the call site knows the constraint means that, so it has to
  // say so.
  it('treats a duplicate as success when the caller declares it idempotent', async () => {
    supabaseState.insert = async () => ({ error: { code: '23505', message: 'duplicate key' } });
    const res = await cloudInsert('team_members', { team_id: 't', user_id: 'u' }, { idempotent: true });
    expect(res.synced).toBe(true);
    expect(res.queued).toBe(false);
  });

  // A unique violation can mean a genuinely different object collided on
  // a unique field. Reporting that as success would hide a real conflict.
  it('reports an undeclared duplicate as a failure', async () => {
    supabaseState.insert = async () => ({ error: { code: '23505', message: 'duplicate key' } });
    const res = await cloudInsert('leagues', { name: 'Tuesday' });
    expect(res.synced).toBe(false);
    expect(res.duplicate).toBe(true);
  });

  // And it must not queue: retrying hits the same constraint forever,
  // which is the doomed-write loop this queue already learned about.
  it('does not queue an undeclared duplicate', async () => {
    supabaseState.insert = async () => ({ error: { code: '23505', message: 'duplicate key' } });
    const before = await getPendingCount();
    await cloudInsert('leagues', { name: 'Tuesday' });
    expect(await getPendingCount()).toBe(before);
  });

  // A genuine failure still has to survive to be retried.
  it('queues anything else', async () => {
    supabaseState.insert = async () => ({ error: { code: '42501', message: 'permission denied' } });
    const res = await cloudInsert('team_members', { team_id: 't', user_id: 'u' });
    expect(res.queued).toBe(true);
  });
});
