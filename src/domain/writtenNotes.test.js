import { describe, it, expect } from "vitest";
import { pinsFromNote, applyWrittenNotes } from "./writtenNotes.js";

const B = (i, strike, pins) => ({ ballIndex: i, isStrike: strike, pinsStanding: pins });
const game = (n, tenth, extra = []) => ({ gameNumber: n, bowlerName: "Rob", frames: [
  ...extra,
  { frameNumber: 10, balls: tenth },
] });

describe("reading a note", () => {
  it("takes pin numbers and nothing else", () => {
    expect(pinsFromNote("4")).toEqual([4]);
    expect(pinsFromNote("1-3-6")).toEqual([1, 3, 6]);
    expect(pinsFromNote("10")).toEqual([10]);
    expect(pinsFromNote(" 7, 10 ")).toEqual([7, 10]);
    expect(pinsFromNote("Lane 1")).toBeNull();
    expect(pinsFromNote("Holiday Bowl")).toBeNull();
    expect(pinsFromNote("")).toBeNull();
  });
});

describe("using a note", () => {
  it("fills the fill ball after a spare in the tenth", () => {
    // "9 / 9" with "4" written under it.
    const g = game(3, [B(1, false, ["6"]), B(2, false, []), B(3, false, ["10"])]);
    const out = applyWrittenNotes([g], [{ text: "4", gameNumber: 3 }]);
    expect(out.used).toBe(1);
    expect(out.games[0].frames[0].balls[2].pinsStanding).toEqual(["4"]);
    expect(out.games[0].frames[0].fromNote).toEqual([3]);
  });
  it("fills a three-pin fill ball from 1-3-6", () => {
    const g = game(1, [B(1, false, ["8", "10"]), B(2, false, []), B(3, false, ["7", "8", "9"])]);
    const out = applyWrittenNotes([g], [{ text: "1-3-6", gameNumber: 1 }]);
    expect(out.games[0].frames[0].balls[2].pinsStanding).toEqual(["1", "3", "6"]);
  });
  it("fills a frame the picture could not read (LaneTalk's hand)", () => {
    const hand = { frameNumber: 7, needsReview: true, balls: [B(1, false, ["7"]), B(2, false, ["7"])] };
    const g = game(3, [B(1, true, []), B(2, true, []), B(3, false, ["8"])], [hand]);
    const out = applyWrittenNotes([g], [{ text: "10", gameNumber: 3 }]);
    const f7 = out.games[0].frames[0];
    expect(f7.balls.map(b => b.pinsStanding)).toEqual([["10"], ["10"]]);
    expect(f7.needsReview).toBe(false);
  });
  it("never changes a count: a one-pin note does not fit a two-pin ball", () => {
    const g = game(3, [B(1, false, ["6"]), B(2, false, []), B(3, false, ["7", "10"])]);
    const out = applyWrittenNotes([g], [{ text: "4", gameNumber: 3 }]);
    expect(out.used).toBe(0);
    expect(out.games[0].frames[0].balls[2].pinsStanding).toEqual(["7", "10"]);
  });
  it("leaves it when two balls could take the note", () => {
    const hand = { frameNumber: 7, needsReview: true, balls: [B(1, false, ["7"]), B(2, false, [])] };
    const g = game(3, [B(1, false, ["6"]), B(2, false, []), B(3, false, ["10"])], [hand]);
    expect(applyWrittenNotes([g], [{ text: "4", gameNumber: 3 }]).used).toBe(0);
  });
  it("matches the note to the right bowler on a two-bowler card", () => {
    const rob = game(3, [B(1, false, ["6"]), B(2, false, []), B(3, false, ["10"])]);
    const tom = { ...game(3, [B(1, false, ["6"]), B(2, false, []), B(3, false, ["10"])]), bowlerName: "Tommy" };
    const out = applyWrittenNotes([rob, tom], [{ text: "4", gameNumber: 3, bowlerName: "Tommy" }]);
    expect(out.games[0].frames[0].balls[2].pinsStanding).toEqual(["10"]);
    expect(out.games[1].frames[0].balls[2].pinsStanding).toEqual(["4"]);
  });
});
