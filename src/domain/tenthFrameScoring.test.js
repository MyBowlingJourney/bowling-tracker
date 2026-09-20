import { describe, it, expect } from 'vitest';
import { frameScoresheet, tenthBall3Earned, tenthBall3Available } from './scoring.js';

// ── The tenth is not always three records ───────────────────────────────
//
// nextState stores a non-strike tenth in ball 1's OWN record: a spare
// there goes straight to ball 3 with no ball-2 row behind it, and an open
// tenth ends the game as a single row. Two places in scoring.js assumed a
// ball-2 record always existed, and both broke on the games real bowlers
// actually bowl:
//
//   tenthBall3Earned said a spare embedded in ball 1 had not earned its
//   fill ball, and the edit path in submitShot uses that answer to DELETE
//   ball 3 -- so editing anything in a "9 / X" tenth threw the X away.
//
//   frame 9's bonus lookup returned null for the tenth's second ball, so
//   frame 9 could not be scored -- and once a frame cannot be scored,
//   every frame after it is null too. A finished game showed a running
//   total through frame 8 and two blank boxes, which looked like "the
//   score doesn't recalculate 9 and 10" and was really "9 and 10 were
//   never scoreable".

const shot = (frame, o = {}) => ({
  id: `f${frame}b${o.ballNum || 0}`, frame: String(frame), ballNum: o.ballNum ?? null,
  game: '1', bowler: 'Ryan', league: 'L', date: '2026-09-20',
  result: 'Strike', otherLeave: [], spareMade: '', pinCount: '', ...o,
});

const X = { result: 'Strike', otherLeave: [], spareMade: '', pinCount: '' };
const nine = { result: 'Other Leave', otherLeave: ['7'], spareMade: 'No', pinCount: '9' };
const spare = { result: 'Other Leave', otherLeave: ['7'], spareMade: 'Yes', pinCount: '10' };
const open8 = { result: 'Other Leave', otherLeave: ['7', '10'], spareMade: 'No', pinCount: '8' };

// Nine strikes, so every tenth below is scored against the same body and
// the arithmetic is easy to check by hand.
const nineStrikes = () => [...Array(9)].map((_, i) => shot(i + 1));
const withTenth = balls => frameScoresheet([...nineStrikes(), ...balls]);

const TENTHS = {
  'X X X': [shot(10, { ballNum: 1, ...X }), shot(10, { ballNum: 2, ...X }), shot(10, { ballNum: 3, ...X })],
  // Two records, not three: ball 2 bundles the 9 and its conversion.
  'X 9 /': [shot(10, { ballNum: 1, ...X }), shot(10, { ballNum: 2, ...spare })],
  '9 / X': [shot(10, { ballNum: 1, ...spare }), shot(10, { ballNum: 3, ...X })],
  'open': [shot(10, { ballNum: 1, ...open8 })],
};

describe('a finished game always scores frames 9 and 10', () => {
  for (const [name, balls] of Object.entries(TENTHS)) {
    it(`with a tenth of ${name}`, () => {
      const rows = withTenth(balls);
      expect(rows[8].running).not.toBeNull();
      expect(rows[9].running).not.toBeNull();
    });
  }

  // The numbers, so a refactor cannot quietly drift.
  it('scores each tenth correctly', () => {
    expect(withTenth(TENTHS['X X X'])[9].running).toBe(300);
    // 1-7 = 210, f8 = 10+10+9 = 29 (239), f9 = 10+9+1 = 20 (259), f10 = 20.
    expect(withTenth(TENTHS['9 / X'])[9].running).toBe(279);
    // f8 = 10+10+8 = 28 (238), f9 = 10+8+0 = 18 (256), f10 = 8.
    expect(withTenth(TENTHS['open'])[9].running).toBe(264);
  });

  // Editing an earlier frame has to move them. This is what was reported.
  for (const [name, balls] of Object.entries(TENTHS)) {
    it(`recalculates 9 and 10 when frame 4 is edited (tenth of ${name})`, () => {
      const before = withTenth(balls);
      const after = frameScoresheet([
        ...nineStrikes().map(s => (parseInt(s.frame) === 4 ? shot(4, { ...open8 }) : s)),
        ...balls,
      ]);
      expect(after[8].running).not.toBe(before[8].running);
      expect(after[9].running).not.toBe(before[9].running);
      expect(after[9].running).not.toBeNull();
    });
  }
});

describe('a tenth still being bowled is honestly unscoreable', () => {
  // Ball 1 thrown, "Spare made?" not yet answered. The second ball really
  // is unknown here, and guessing would be worse than a blank box.
  it('leaves frame 9 blank until the tenth answers', () => {
    const rows = frameScoresheet([...nineStrikes(),
      shot(10, { ballNum: 1, result: 'Other Leave', otherLeave: ['7', '10'], spareMade: '', pinCount: '' })]);
    expect(rows[8].running).toBeNull();
    expect(rows[9].running).toBeNull();
  });
});

describe('the fill ball is earned, not assumed', () => {
  it('is earned by a strike on ball 1', () => {
    expect(tenthBall3Earned(X, null)).toBe(true);
  });

  // The one the edit path was getting wrong, and the reason a "9 / X"
  // tenth lost its X the moment anything in the game was edited.
  it('is earned by a spare embedded in ball 1', () => {
    expect(tenthBall3Earned(spare, null)).toBe(true);
  });

  it('is earned by a spare across two records', () => {
    expect(tenthBall3Earned(nine, spare)).toBe(true);
  });

  it('is not earned by an open tenth', () => {
    expect(tenthBall3Earned(open8, null)).toBe(false);
    expect(tenthBall3Earned(null, null)).toBe(false);
  });

  // The two functions describe the same frame and must agree about it.
  it('agrees with tenthBall3Available about the embedded spare', () => {
    expect(tenthBall3Earned(spare, null)).toBe(true);
    expect(tenthBall3Available(spare, null)).toBe(10);   // fresh rack
  });
});
