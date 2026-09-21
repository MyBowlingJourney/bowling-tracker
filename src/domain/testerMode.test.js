import { describe, it, expect } from 'vitest';
import { nextTap, tapsLeft, readTesterMode, writeTesterMode, TAPS_TO_TOGGLE, TAP_WINDOW_MS } from './testerMode.js';

const mem = () => { const m = new Map(); return { getItem: k => m.has(k) ? m.get(k) : null, setItem: (k, v) => m.set(k, String(v)), removeItem: k => m.delete(k) }; };

describe('nextTap', () => {
  it('toggles on the seventh quick tap and resets', () => {
    let s = null, t = 1000;
    for (let i = 1; i < TAPS_TO_TOGGLE; i++) { s = nextTap(s, t += 200); expect(s.toggled).toBe(false); expect(s.count).toBe(i); }
    s = nextTap(s, t += 200);
    expect(s.toggled).toBe(true); expect(s.count).toBe(0);
  });
  it('a slow tap starts the count again', () => {
    let s = nextTap(null, 1000); s = nextTap(s, 1200);
    s = nextTap(s, 1200 + TAP_WINDOW_MS + 1);
    expect(s.count).toBe(1);
  });
  it('survives junk state', () => {
    expect(nextTap('x', 5).count).toBe(1);
  });
  it('counts down', () => {
    expect(tapsLeft({ count: 4 })).toBe(3);
    expect(tapsLeft(null)).toBe(TAPS_TO_TOGGLE);
  });
});

describe('tester flag storage', () => {
  it('round-trips and turns off', () => {
    const s = mem();
    expect(readTesterMode(s)).toBe(false);
    writeTesterMode(true, s); expect(readTesterMode(s)).toBe(true);
    writeTesterMode(false, s); expect(readTesterMode(s)).toBe(false);
  });
  it('never throws without storage', () => {
    expect(readTesterMode(null)).toBe(false);
    expect(() => writeTesterMode(true, null)).not.toThrow();
  });
});
