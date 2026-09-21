import { describe, it, expect } from "vitest";
import { rackTypeDetail, pinsStanding, biggestChanges } from "./rackTypeDetail.js";

const leagues = [{ name: "Tue", centerId: "c1" }, { name: "Thu", centerId: "c2" }, { name: "Sat", centerId: "c3" }];
const centers = [{ id: "c1", rackType: "freefall" }, { id: "c2", rackType: "string" }, { id: "c3" }];
const shot = (league, o) => ({ bowler: "Ryan", league, ballNum: 1, ...o });
const strike = (league, d) => shot(league, { result: "Strike", strikeDescription: d });
const leave = (league, pins, made = "Yes") => shot(league, { result: "Other Leave", otherLeave: pins.map(String), spareMade: made });

describe("pinsStanding", () => {
  it("reads leaves, corner results by hand, and nothing for strikes", () => {
    expect(pinsStanding({ result: "Other Leave", otherLeave: ["10", "7", "9 Pin No-Tap"] })).toEqual([10, 7]);
    expect(pinsStanding({ result: "Weak 10" })).toEqual([10]);
    expect(pinsStanding({ result: "Ringing 10" }, true)).toEqual([7]);
    expect(pinsStanding({ result: "Strike" })).toEqual([]);
    expect(pinsStanding(null)).toEqual([]);
  });
});

describe("rackTypeDetail", () => {
  const shots = [
    strike("Tue", "Messenger"), strike("Tue", "Flush"), strike("Tue", "Messenger"),
    leave("Tue", [10]), leave("Tue", [3, 10], "No"),
    strike("Thu", "Flush"), leave("Thu", [10]), leave("Thu", [10], "No"),
    shot("Thu", { result: "Weak 10", spareMade: "Yes" }),
    leave("Sat", [7, 10], "No"),                       // no rack type: ignored
    { ...leave("Thu", [10]), bowler: "Sam" },           // someone else: ignored
    { ...leave("Thu", [10]), ballNum: 2 },              // second ball: spare, not a first ball
  ];
  const r = rackTypeDetail(shots, leagues, centers, "Ryan");

  it("splits first balls, spares and splits by rack type", () => {
    expect(r.freefall.firstBalls).toBe(5);
    expect(r.string.firstBalls).toBe(4);
    expect(r.freefall.spareRate).toBe(100);           // the 3-10 is a split, excluded
    expect(r.freefall.splitRate).toBe(20);
    expect(r.string.spareAttempts).toBe(4);
    expect(r.string.cornerRate).toBe(75);
  });

  it("pin rates are shares of first balls", () => {
    expect(r.string.pinRates["10"]).toBe(75);
    expect(r.freefall.pinRates["3"]).toBe(20);
  });

  it("strike shapes are shares of described strikes", () => {
    expect(r.freefall.shapes).toEqual([
      { shape: "Flush", count: 1, pct: 33.3 }, { shape: "Messenger", count: 2, pct: 66.7 },
    ]);
    expect(r.string.described).toBe(1);
  });

  it("gates the thin tabs", () => {
    expect(r.leavesReady).toBe(false);
    expect(r.strikesReady).toBe(false);
  });

  it("uses the left-handed corner pin", () => {
    const l = rackTypeDetail([shot("Thu", { result: "Weak 10", spareMade: "Yes" }), leave("Thu", [7])], leagues, centers, "Ryan", true);
    expect(l.cornerPin).toBe(7);
    expect(l.string.cornerRate).toBe(100);
  });

  it("survives junk", () => {
    for (const j of [null, undefined, 3, "x", [null, 1]]) expect(() => rackTypeDetail(j, j, j, j)).not.toThrow();
  });
});

describe("biggestChanges", () => {
  it("ranks by the size of the move and ignores rare leaves", () => {
    const ff = { firstBalls: 100, leaves: { "10": 9, "4-6": 1, "7": 2 } };
    const st = { firstBalls: 100, leaves: { "10": 15, "4-6": 4, "5": 1 } };
    const r = biggestChanges(ff, st);
    expect(r.map(x => [x.key, x.change])).toEqual([["10", 6], ["4-6", 3]]);
  });
});
