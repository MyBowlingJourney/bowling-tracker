import { describe, it, expect } from "vitest";
import { leavePins, leaveLabel, rankLeaves, pageState, nextShown } from "./leaveRanking.js";

const splits = [
  { key: "Baby split", pins: "3-10", count: 9, converted: 4, rate: 44 },
  { key: "Baby split", pins: "2-7", count: 5, converted: 3, rate: 60 },
  { key: "4-6", pins: "4-6", count: 4, converted: 0, rate: 0 },
  { key: "7-10", pins: "7-10", count: 3, converted: 0, rate: 0 },
];

describe("leavePins / leaveLabel", () => {
  it("reads pins from `pins` for splits and `key` for non-splits", () => {
    expect(leavePins(splits[0])).toEqual([3, 10]);
    expect(leavePins({ key: "2-4-5-8", count: 1 })).toEqual([2, 4, 5, 8]);
  });
  it("drops anything that isn't a pin", () => {
    expect(leavePins({ key: "9 Pin No-Tap" })).toEqual([]);
    expect(leavePins({ key: "0-11-3" })).toEqual([3]);
    expect(leavePins(null)).toEqual([]);
  });
  it("keeps a split's name only when it differs from the pins", () => {
    expect(leaveLabel(splits[0])).toEqual({ name: "Baby split", pins: "3-10" });
    expect(leaveLabel(splits[2])).toEqual({ name: null, pins: "4-6" });
    expect(leaveLabel({ key: "10", count: 3 })).toEqual({ name: null, pins: "10" });
  });
});

describe("rankLeaves", () => {
  it("missed: most misses first, ties by frequency", () => {
    expect(rankLeaves(splits, "missed").map(r => r.pins)).toEqual(["3-10", "4-6", "7-10", "2-7"]);
  });
  it("made: most conversions first", () => {
    expect(rankLeaves(splits, "made").map(r => r.pins)).toEqual(["3-10", "2-7", "4-6", "7-10"]);
  });
  it("computes made/missed and clamps bad converted values", () => {
    const [r] = rankLeaves([{ key: "10", count: 3, converted: 9 }]);
    expect(r).toMatchObject({ made: 3, missed: 0, rate: 100 });
  });
  it("drops empty and zero-count rows, and never mutates input", () => {
    const input = [null, { key: "7", count: 0 }, { key: "10", count: 2, converted: 1 }];
    const copy = JSON.stringify(input);
    expect(rankLeaves(input).length).toBe(1);
    expect(JSON.stringify(input)).toBe(copy);
  });
  it("orders pins numerically on full ties", () => {
    const r = rankLeaves([{ key: "10", count: 1, converted: 0 }, { key: "2", count: 1, converted: 0 }]);
    expect(r.map(x => x.key)).toEqual(["2", "10"]);
  });
});

describe("paging", () => {
  it("no button at 3 or fewer", () => {
    expect(pageState(0, 3)).toEqual({ visible: 0, button: null });
    expect(pageState(3, 3)).toEqual({ visible: 3, button: null });
  });
  it("walks 3 -> 10 -> all -> 3 on a long list", () => {
    let shown = 3;
    expect(pageState(25, shown)).toEqual({ visible: 3, button: "more" });
    shown = nextShown(25, shown);
    expect(pageState(25, shown)).toEqual({ visible: 10, button: "all" });
    shown = nextShown(25, shown);
    expect(pageState(25, shown)).toEqual({ visible: 25, button: "collapse" });
    shown = nextShown(25, shown);
    expect(pageState(25, shown)).toEqual({ visible: 3, button: "more" });
  });
  it("goes straight to collapse when show more reaches the end", () => {
    const shown = nextShown(8, 3);
    expect(pageState(8, shown)).toEqual({ visible: 8, button: "collapse" });
    expect(pageState(10, nextShown(10, 3))).toEqual({ visible: 10, button: "collapse" });
  });
  it("a list that shrinks under the current page stays consistent", () => {
    expect(pageState(4, 25)).toEqual({ visible: 4, button: "collapse" });
  });
});
