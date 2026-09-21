import { describe, it, expect } from "vitest";
import { handUpCounts } from "./stats.js";

const five = (bowler, made, extra = {}) => ({
  bowler, league: "Tue", result: "Other Leave", otherLeave: ["5"], spareMade: made, ...extra,
});

describe("handUpCounts", () => {
  it("counts lone-5 misses per bowler", () => {
    const shots = [five("Ryan", "No"), five("Ryan", "No"), five("Sam", "No"), five("Sam", "Yes")];
    expect(handUpCounts(shots, "Tue")).toEqual({ Ryan: 2, Sam: 1 });
  });
  it("ignores makes, unrecorded spares, and other leaves", () => {
    const shots = [
      five("Ryan", "Yes"), five("Ryan", ""),
      five("Ryan", "No", { otherLeave: ["5", "7"] }),
      five("Ryan", "No", { otherLeave: ["10"] }),
      five("Ryan", "No", { result: "Strike" }),
    ];
    expect(handUpCounts(shots, "Tue")).toEqual({});
  });
  it("a 9-pin no-tap marker doesn't stop it being a lone 5", () => {
    expect(handUpCounts([five("Ryan", "No", { otherLeave: ["5", "9 Pin No-Tap"] })], "Tue")).toEqual({ Ryan: 1 });
  });
  it("accepts numeric pins", () => {
    expect(handUpCounts([five("Ryan", "No", { otherLeave: [5] })], "Tue")).toEqual({ Ryan: 1 });
  });
  it("filters by league, and counts every league when none given", () => {
    const shots = [five("Ryan", "No"), five("Ryan", "No", { league: "Thu" })];
    expect(handUpCounts(shots, "Tue")).toEqual({ Ryan: 1 });
    expect(handUpCounts(shots)).toEqual({ Ryan: 2 });
  });
  it("survives junk input", () => {
    expect(handUpCounts(null)).toEqual({});
    expect(handUpCounts([null, 3, "x", five("Ryan", "No", { otherLeave: null })])).toEqual({});
  });
});
