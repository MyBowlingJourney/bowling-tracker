import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

// ── Two webhooks at once must not undo each other ───────────────────
//
// Stripe does not deliver one event at a time. The logs showed two
// deliveries three minutes old, both 200, for one subscription.
//
// The webhook re-fetches the subscription from Stripe before writing,
// which makes processing the SAME event twice safe -- a redelivery
// re-reads current truth and writes the same thing. It does nothing
// about two DIFFERENT events in flight together: both fetch, both
// write, and the last write wins no matter which fetch was newer.
//
// The failure that matters is not the one that costs money, it is the
// one that takes access away. A stale row reading "active" after a
// cancellation is a small revenue leak. A stale row reading "canceled"
// after a renewal logs a paying subscriber out of what they just paid
// for.
//
// entitlementFromStripeSubscription and every status mapping are
// already covered in stripeBilling.test.js. What was not covered, and
// what this file covers, is the ORDER of writes -- which, exactly like
// the sync cursor, is a property of a sequence and invisible to any
// test of a single call.

// A stand-in for the entitlements table, with the two operations the
// webhook now uses. `update ... .or(ordered)` matches only when the
// stored event is older or absent, which is the whole guard.
function makeTable() {
  let rows = [];
  return {
    rows: () => rows,
    get: userId => rows.find(r => r.user_id === userId) || null,
    updateIfNewer(userId, values, eventTime) {
      const row = rows.find(r => r.user_id === userId);
      if (!row) return [];
      if (row.last_event_at && row.last_event_at > eventTime) return [];
      Object.assign(row, values, { last_event_at: eventTime });
      return [{ user_id: userId }];
    },
    insert(userId, values, eventTime) {
      if (rows.some(r => r.user_id === userId)) {
        const err = new Error('duplicate key value');
        err.code = '23505';
        throw err;
      }
      rows.push({ user_id: userId, ...values, last_event_at: eventTime });
      return [{ user_id: userId }];
    },
  };
}

// The write path from stripe-webhook/index.ts, in the same order.
function applyEvent(table, userId, row, eventTime) {
  let applied = table.updateIfNewer(userId, row, eventTime).length > 0;
  if (!applied) {
    try {
      table.insert(userId, row, eventTime);
      applied = true;
    } catch (err) {
      if (err.code !== '23505') throw err;
      // The row exists after all -- either a newer event beat us, or two
      // first events raced. One ordered update tells those apart.
      applied = table.updateIfNewer(userId, row, eventTime).length > 0;
    }
  }
  return applied;
}

const U = 'user-1';
const active = { plan: 'plus', status: 'active' };
const canceled = { plan: 'plus', status: 'canceled' };
const free = { plan: 'free', status: 'none' };

const EARLY = '2026-09-20T01:00:00.000Z';
const LATE = '2026-09-20T01:05:00.000Z';

describe('entitlement writes are ordered by Stripe event time', () => {
  it('writes the first event for a bowler', () => {
    const t = makeTable();
    expect(applyEvent(t, U, active, EARLY)).toBe(true);
    expect(t.get(U).status).toBe('active');
  });

  it('applies a newer event over an older one', () => {
    const t = makeTable();
    applyEvent(t, U, active, EARLY);
    applyEvent(t, U, canceled, LATE);
    expect(t.get(U).status).toBe('canceled');
  });

  // THE BUG. Events arrive out of order -- routinely, since Stripe
  // retries and parallelises. The older one must not land last.
  it('ignores an older event arriving after a newer one', () => {
    const t = makeTable();
    applyEvent(t, U, canceled, LATE);
    applyEvent(t, U, active, EARLY);   // stale delivery, arrives second
    expect(t.get(U).status).toBe('canceled');
    expect(t.get(U).last_event_at).toBe(LATE);
  });

  // The expensive direction, stated on its own so it can never be
  // quietly traded away: a renewal must not be undone by a stale
  // cancellation.
  it('never lets a stale cancellation take Pro from a paying bowler', () => {
    const t = makeTable();
    applyEvent(t, U, active, LATE);     // they renewed
    applyEvent(t, U, free, EARLY);      // older cancellation lands late
    expect(t.get(U).plan).toBe('plus');
    expect(t.get(U).status).toBe('active');
  });

  // A redelivery of the SAME event. Equal timestamps must still apply,
  // not be rejected as "not newer" -- an event whose first delivery
  // failed halfway through has to be able to complete.
  it('still applies a redelivery of the same event', () => {
    const t = makeTable();
    applyEvent(t, U, active, EARLY);
    expect(applyEvent(t, U, active, EARLY)).toBe(true);
    expect(t.get(U).status).toBe('active');
  });

  // Two FIRST events for one bowler, racing. Whichever inserts first,
  // the newer one must be what remains.
  it('resolves two first-ever events to the newer one', () => {
    for (const order of [['older-first'], ['newer-first']]) {
      const t = makeTable();
      if (order[0] === 'older-first') {
        applyEvent(t, U, active, EARLY);
        applyEvent(t, U, canceled, LATE);
      } else {
        applyEvent(t, U, canceled, LATE);
        applyEvent(t, U, active, EARLY);
      }
      expect(t.get(U).status, `${order[0]} must end canceled`).toBe('canceled');
    }
  });

  it('keeps one bowler out of another bowler\'s row', () => {
    const t = makeTable();
    applyEvent(t, U, active, EARLY);
    applyEvent(t, 'user-2', free, LATE);
    expect(t.get(U).status).toBe('active');
    expect(t.get('user-2').status).toBe('none');
  });

  // Many deliveries in random order. The end state must be the newest
  // event every time, not merely usually.
  it('always settles on the newest event, whatever the arrival order', () => {
    const events = [
      { row: active, at: '2026-09-20T01:00:00.000Z' },
      { row: canceled, at: '2026-09-20T01:01:00.000Z' },
      { row: free, at: '2026-09-20T01:02:00.000Z' },
      { row: active, at: '2026-09-20T01:03:00.000Z' },
    ];
    for (let seed = 0; seed < 24; seed++) {
      const shuffled = [...events].sort(() => ((seed % 3) - 1) || 1);
      const t = makeTable();
      for (const e of shuffled) applyEvent(t, U, e.row, e.at);
      expect(t.get(U).last_event_at).toBe('2026-09-20T01:03:00.000Z');
      expect(t.get(U).status).toBe('active');
    }
  });
});

// ── The deployed function must actually do this ─────────────────────
//
// The simulation above is only worth anything if the real webhook
// writes the same way. A plain upsert on user_id is the bug verbatim,
// so its absence is the thing to assert.
describe('the real webhook writes in order', () => {
  const src = readFileSync(
    new URL('../../supabase/functions/stripe-webhook/index.ts', import.meta.url),
    'utf8',
  );

  it('does not upsert entitlements unconditionally', () => {
    // The exact shape that lost writes.
    expect(src).not.toMatch(/from\("entitlements"\)\s*\.upsert\(/);
  });

  it('guards the write on last_event_at', () => {
    expect(src).toContain('last_event_at.is.null');
    expect(src).toContain('last_event_at.lte.');
  });

  it("orders by Stripe's event time, not our clock", () => {
    // eventTime comes from event.created. A Date.now() or new Date()
    // anywhere in the ordering is the same class of bug as seeding a
    // sync cursor from the phone's clock.
    const guard = src.slice(src.indexOf('const ordered ='), src.indexOf('await markApplied'));
    expect(guard).not.toContain('Date.now');
    expect(guard).not.toContain('new Date');
    expect(guard).toContain('eventTime');
  });

  it('treats a 23505 on insert as a race, not a failure', () => {
    expect(src).toContain('23505');
  });
});
