import { describe, it, expect } from "vitest";
import { readPinDecks, applyPinDecks, applyPinDecksByImage } from "./pinDeckPixels.js";

// A synthetic LaneTalk-style card: grey strips of ten cells split by dark
// lines, each holding the ten-dot rack. Colours as LaneTalk draws them.
const W = 800, CELL_H = 64, GAP = 60, CW = 80;
const GREY = [215, 215, 215], DOWN = [128, 128, 128], GREEN = [80, 210, 110], WHITE = [255, 255, 255], BG = [30, 32, 44];
// Pin centres inside a cell, as fractions of its width and height.
const AT = { 7: [0.2, 0.18], 8: [0.4, 0.18], 9: [0.6, 0.18], 10: [0.8, 0.18], 4: [0.3, 0.4], 5: [0.5, 0.4], 6: [0.7, 0.4], 2: [0.4, 0.62], 3: [0.6, 0.62], 1: [0.5, 0.84] };

function card(games) {
  const H = games.length * (CELL_H + GAP) + GAP;
  const data = new Uint8ClampedArray(W * H * 4);
  const put = (x, y, c) => { if (x < 0 || y < 0 || x >= W || y >= H) return; const i = (y * W + x) * 4; data[i] = c[0]; data[i + 1] = c[1]; data[i + 2] = c[2]; data[i + 3] = 255; };
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) put(x, y, BG);
  games.forEach((frames, gi) => {
    const y0 = GAP + gi * (CELL_H + GAP);
    for (let y = y0; y < y0 + CELL_H; y++) for (let x = 0; x < W; x++) put(x, y, (x % CW === 0 && x > 0) ? [20, 20, 20] : GREY);
    frames.forEach(({ converted = [], missed = [], tint = null }, fi) => {
      // A highlighted frame: yellow ground, and every dot tinted with it.
      if (tint) for (let y = y0; y < y0 + CELL_H; y++) for (let x = fi * CW + 1; x < (fi + 1) * CW; x++) put(x, y, tint);
      for (const [pin, [fx, fy]] of Object.entries(AT)) {
        const cx = Math.round(fi * CW + fx * CW), cy = Math.round(y0 + fy * CELL_H);
        const p = Number(pin);
        const plain = missed.includes(p) ? WHITE : converted.includes(p) ? GREEN : DOWN;
        const col = tint && plain === DOWN ? [152, 141, 80] : plain;
        for (let dy = -5; dy <= 5; dy++) for (let dx = -5; dx <= 5; dx++) {
          const d = dx * dx + dy * dy;
          if (d > 25) continue;
          put(cx + dx, cy + dy, (col !== DOWN && d > 16) ? [10, 10, 10] : col);
        }
      }
    });
  });
  return { width: W, height: H, data };
}

const strike = {};
const g1 = [{ converted: [4] }, strike, { converted: [6, 10] }, strike, strike, strike, strike, strike, strike, { missed: [10] }];
const g2 = [{ converted: [2, 4, 5, 8] }, strike, { missed: [3, 6, 10] }, strike, strike, strike, strike, { converted: [6, 10], missed: [4, 7] }, strike, { converted: [1, 2, 8] }];

describe("reading pin decks from pixels", () => {
  it("reads which pins were left, converted and missed", () => {
    const r = readPinDecks(card([g1, g2]));
    expect(r.strips).toHaveLength(2);
    const f = r.strips.map(s => s.frames.map(x => x.leave.join("-")));
    expect(f[0]).toEqual(["4", "", "6-10", "", "", "", "", "", "", "10"]);
    expect(f[1]).toEqual(["2-4-5-8", "", "3-6-10", "", "", "", "", "4-6-7-10", "", "1-2-8"]);
    expect(r.strips[1].frames[7].missed).toEqual([4, 7]);
  });
  it("finds nothing in an image that is not a scorecard", () => {
    const blank = { width: 100, height: 100, data: new Uint8ClampedArray(100 * 100 * 4) };
    expect(readPinDecks(blank)).toBeNull();
  });
});

const B = (strike, pins) => ({ isStrike: strike, pinsStanding: pins });
const frame = (n, ...balls) => ({ frameNumber: n, balls: balls.map((b, i) => ({ ballIndex: i + 1, ...b })) });

describe("putting the reading into the AI's frames", () => {
  const reading = readPinDecks(card([g1]));
  const aiGame = () => ({ gameNumber: 1, bowlerName: "Ryan", frames: [
    frame(1, B(false, ["10"]), B(false, [])),              // wrong pin, right count
    frame(2, B(true, [])),
    frame(3, B(false, ["3", "10"]), B(false, [])),         // wrong pins, right count
    ...[4, 5, 6, 7, 8, 9].map(n => frame(n, B(true, []))),
    frame(10, B(true, []), B(true, []), B(false, ["10"])),
  ] });

  it("corrects wrong pins where the counts agree", () => {
    const out = applyPinDecks([aiGame()], reading);
    expect(out.corrected).toBe(2);
    expect(out.kept).toBe(0);
    expect(out.games[0].frames[0].balls[0].pinsStanding).toEqual(["4"]);
    expect(out.games[0].frames[2].balls[0].pinsStanding).toEqual(["6", "10"]);
    expect(out.games[0].frames[9].balls[2].pinsStanding).toEqual(["10"]);
  });
  it("leaves a frame alone when the counts disagree", () => {
    const g = aiGame();
    g.frames[0].balls[0].pinsStanding = ["2", "10"];
    const out = applyPinDecks([g], reading);
    expect(out.kept).toBe(1);
    expect(out.games[0].frames[0].balls[0].pinsStanding).toEqual(["2", "10"]);
  });
  it("does nothing on a card with more than one bowler or a strip per game mismatch", () => {
    expect(applyPinDecks([aiGame(), { ...aiGame(), bowlerName: "Sam" }], reading).applied).toBe(false);
    expect(applyPinDecks([aiGame(), { ...aiGame(), gameNumber: 2 }], reading).applied).toBe(false);
  });
});

describe("a highlighted frame", () => {
  it("reads a yellow-tinted tenth the same way", () => {
    const g = [...g1.slice(0, 9), { converted: [6], tint: [255, 235, 136] }];
    const r = readPinDecks(card([g]));
    expect(r.strips[0].frames[9].leave).toEqual([6]);
  });
});

describe("a frame the reader could not see", () => {
  it("is flagged for review and left as the AI read it", () => {
    const reading = readPinDecks(card([g1]));
    reading.strips[0].frames[0] = null; // e.g. LaneTalk's hand symbol
    const g = { gameNumber: 1, bowlerName: "Ryan", frames: [
      frame(1, B(false, ["10"]), B(false, [])),
      ...[2, 3, 4, 5, 6, 7, 8, 9].map(n => frame(n, B(true, []))),
      frame(10, B(true, []), B(true, []), B(false, ["10"])),
    ] };
    const out = applyPinDecks([g], reading);
    expect(out.games[0].frames[0].needsReview).toBe(true);
    expect(out.games[0].frames[0].balls[0].pinsStanding).toEqual(["10"]);
  });
});

describe("one screenshot per bowler", () => {
  it("pairs each image with the bowler whose frames it matches, in either order", () => {
    const a = readPinDecks(card([g1])), b = readPinDecks(card([g2]));
    const game = (name, leaves) => ({ gameNumber: 1, bowlerName: name, frames: leaves.map((l, i) => i < 9
      ? (l.length ? frame(i + 1, B(false, l.map(() => "9")), B(false, [])) : frame(i + 1, B(true, [])))
      : frame(10, B(false, l.map(() => "9")), B(false, []))) });
    const ryan = game("Ryan", [["4"], [], ["6", "10"], [], [], [], [], [], [], ["10"]]);
    const rob = game("Rob", [["2", "4", "5", "8"], [], ["3", "6", "10"], [], [], [], [], ["4", "6", "7", "10"], [], ["1", "2", "8"]]);
    for (const readings of [[a, b], [b, a]]) {
      const out = applyPinDecksByImage([ryan, rob], readings);
      expect(out.applied).toBe(true);
      expect(out.games[0].frames[0].balls[0].pinsStanding).toEqual(["4"]);
      expect(out.games[1].frames[0].balls[0].pinsStanding).toEqual(["2", "4", "5", "8"]);
    }
  });
});
