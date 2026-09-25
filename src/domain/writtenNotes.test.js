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

describe("two screenshots, one note each, no bowler named", () => {
  const tenth = pins => [B(1, false, ["6"]), B(2, false, []), B(3, false, pins)];
  it("gives each bowler's game 3 its own 4", () => {
    const rob = { gameNumber: 3, bowlerName: "Rob Thurs 9/24", frames: [{ frameNumber: 10, balls: tenth(["10"]) }] };
    const tom = { gameNumber: 3, bowlerName: "Tommy Thurs 9/24", frames: [{ frameNumber: 10, balls: tenth(["10"]) }] };
    const rob1 = { gameNumber: 1, bowlerName: "Rob Thurs 9/24", frames: [{ frameNumber: 10, balls: [B(1, false, ["8", "10"]), B(2, false, []), B(3, false, ["7", "8", "9"])] }] };
    const out = applyWrittenNotes([rob1, rob, tom], [
      { text: "1-3-6", gameNumber: 1 }, { text: "4", gameNumber: 3 }, { text: "4", gameNumber: 3 },
    ]);
    expect(out.used).toBe(3);
    expect(out.games[1].frames[0].balls[2].pinsStanding).toEqual(["4"]);
    expect(out.games[2].frames[0].balls[2].pinsStanding).toEqual(["4"]);
  });
  it("matches a short bowler name", () => {
    const rob = { gameNumber: 3, bowlerName: "Rob Thurs 9/24", frames: [{ frameNumber: 10, balls: tenth(["10"]) }] };
    const tom = { gameNumber: 3, bowlerName: "Tommy Thurs 9/24", frames: [{ frameNumber: 10, balls: tenth(["10"]) }] };
    const out = applyWrittenNotes([rob, tom], [{ text: "4", gameNumber: 3, bowlerName: "Tommy" }]);
    expect(out.games[0].frames[0].balls[2].pinsStanding).toEqual(["10"]);
    expect(out.games[1].frames[0].balls[2].pinsStanding).toEqual(["4"]);
  });
  it("does not guess with one note and two bowlers who could both take it", () => {
    const rob = { gameNumber: 3, bowlerName: "Rob", frames: [{ frameNumber: 10, balls: tenth(["10"]) }] };
    const tom = { gameNumber: 3, bowlerName: "Tommy", frames: [{ frameNumber: 10, balls: tenth(["10"]) }] };
    expect(applyWrittenNotes([rob, tom], [{ text: "4", gameNumber: 3 }]).used).toBe(0);
  });
});

describe("placing a note on a team card", () => {
  const spare9 = pins => [B(1, false, ["6"]), B(2, false, []), B(3, false, pins)];
  const g = (n, name, pos, tenth) => ({ gameNumber: n, bowlerName: name, lineupPosition: pos, frames: [{ frameNumber: 10, balls: tenth }] });
  // Rob and Tommy, one screenshot each; the AI names only each first game.
  const night = () => [
    g(1, "Rob Thurs 9/24", 0, [B(1, false, ["9", "10"]), B(2, false, []), B(3, false, ["7", "8", "10"])]),
    g(2, null, 0, [B(1, true, []), B(2, false, ["10"]), B(3, false, [])]),
    g(3, null, 0, spare9(["10"])),
    g(1, "Tommy Thurs 9/24", 1, [B(1, true, []), B(2, true, []), B(3, false, ["10"])]),
    g(2, null, 1, [B(1, false, ["7", "9", "10"]), B(2, false, ["7", "10"])]),
    g(3, null, 1, spare9(["10"])),
  ];
  const imageOf = [0, 0, 0, 1, 1, 1];
  const fill = (out, i) => out.games[i].frames[0].balls[2].pinsStanding;

  it("goes by the image the note is written on", () => {
    const out = applyWrittenNotes(night(), [
      { text: "4", gameNumber: 3, imageNumber: 2 }, { text: "4", gameNumber: 3, imageNumber: 1 },
    ], { imageOf });
    expect(out.used).toBe(2);
    expect(fill(out, 2)).toEqual(["4"]);
    expect(fill(out, 5)).toEqual(["4"]);
  });
  it("places a lone 4 by its image even when the AI missed the other one", () => {
    const out = applyWrittenNotes(night(), [{ text: "4", gameNumber: 3, imageNumber: 2 }], { imageOf });
    expect(fill(out, 2)).toEqual(["10"]);
    expect(fill(out, 5)).toEqual(["4"]);
  });
  it("finds a named bowler's later games, which the AI left unnamed", () => {
    const out = applyWrittenNotes(night(), [{ text: "4", gameNumber: 3, bowlerName: "Tommy Thurs 9/24" }]);
    expect(fill(out, 5)).toEqual(["4"]);
    expect(fill(out, 2)).toEqual(["10"]);
  });
  it("with no game number, takes the bowler's last game when that settles it", () => {
    const out = applyWrittenNotes(night(), [{ text: "4", gameNumber: null, imageNumber: 1 }], { imageOf });
    expect(fill(out, 2)).toEqual(["4"]);
  });
  it("a note between two rows falls back to the row above", () => {
    // Rob's "1-3-6" sits under game 1, above game 2.
    const out = applyWrittenNotes(night(), [{ text: "1-3-6", gameNumber: 2, imageNumber: 1 }], { imageOf });
    expect(fill(out, 0)).toEqual(["1", "3", "6"]);
  });
  it("still does not guess one note between two bowlers", () => {
    const out = applyWrittenNotes(night(), [{ text: "4", gameNumber: 3 }]);
    expect(out.used).toBe(0);
    expect(out.outcomes[0]).toMatch(/2 places fit/);
  });
  it("says where each note went, without names", () => {
    const out = applyWrittenNotes(night(), [{ text: "4", gameNumber: 3, imageNumber: 2 }], { imageOf });
    expect(out.outcomes).toEqual(['"4" img2 g3 -> bowler 2 G3F10B3']);
  });
});

describe('a note placed in a game other than the one it was read beside', () => {
  it('fills the pins but keeps the frame flagged', () => {
    const g1 = { gameNumber: 1, bowlerName: 'Rob', frames: [{ frameNumber: 10, balls: [B(1, false, ['9', '10']), B(2, false, []), B(3, false, ['7', '8', '10'])] }] };
    const g2 = { gameNumber: 2, bowlerName: 'Rob', frames: [{ frameNumber: 10, balls: [B(1, true, []), B(2, true, []), B(3, true, [])] }] };
    const out = applyWrittenNotes([g1, g2], [{ text: '1-3-6', gameNumber: 2 }]);
    expect(out.games[0].frames[0].balls[2].pinsStanding).toEqual(['1', '3', '6']);
    expect(out.games[0].frames[0].noteGuessed).toBe(true);
    expect(out.outcomes[0]).toMatch(/\(check\)$/);
  });
  it('a note in its own game is not flagged', () => {
    const g = { gameNumber: 3, bowlerName: 'Rob', frames: [{ frameNumber: 10, balls: [B(1, false, ['6']), B(2, false, []), B(3, false, ['10'])] }] };
    const out = applyWrittenNotes([g], [{ text: '4', gameNumber: 3 }]);
    expect(out.games[0].frames[0].noteGuessed).toBeUndefined();
  });
});
