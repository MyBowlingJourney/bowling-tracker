import { describe, it, expect } from "vitest";
import {
  normalizeStepladder, addStep, removeStep, setStepField, setStepladderField,
  stepResult, stepladderResult, describeStepladder, ordinal,
} from "./stepladder.js";

function ladder(seed, steps) {
  return {
    yourSeed: String(seed),
    steps: steps.map((s, i) => ({
      stepNumber: i + 1,
      opponent: s.o || "",
      opponentSeed: String(s.s),
      yourScore: String(s.y),
      opponentScore: String(s.t),
    })),
  };
}

describe("stepResult", () => {
  it("is null until both scores are in", () => {
    expect(stepResult({ yourScore: "200", opponentScore: "" })).toBe(null);
    expect(stepResult({ yourScore: "", opponentScore: "200" })).toBe(null);
  });
  it("reads win, loss and tie", () => {
    expect(stepResult({ yourScore: "201", opponentScore: "200" })).toBe("win");
    expect(stepResult({ yourScore: "199", opponentScore: "200" })).toBe("loss");
    expect(stepResult({ yourScore: "200", opponentScore: "200" })).toBe("tie");
  });
  it("ignores a score outside 0-300", () => {
    expect(stepResult({ yourScore: "301", opponentScore: "200" })).toBe(null);
  });
});

describe("stepladderResult — finishing position", () => {
  it("puts the bottom seed last when they lose their first step", () => {
    expect(stepladderResult(ladder(5, [{ s: 4, y: 180, t: 200 }])).place).toBe(5);
  });
  it("moves the bottom seed up one place per win", () => {
    expect(stepladderResult(ladder(5, [
      { s: 4, y: 220, t: 200 }, { s: 3, y: 180, t: 190 },
    ])).place).toBe(4);
  });
  it("gives a waiting seed the place below the bowler who beat them", () => {
    // Seed 3 waits; the bowler climbing from below is seed 4.
    expect(stepladderResult(ladder(3, [{ s: 4, y: 180, t: 200 }])).place).toBe(4);
  });
  it("counts a waiting seed's wins", () => {
    expect(stepladderResult(ladder(3, [
      { s: 4, y: 220, t: 200 }, { s: 2, y: 180, t: 200 },
    ])).place).toBe(3);
  });
  it("finishes the top seed second when they lose the final", () => {
    expect(stepladderResult(ladder(1, [{ s: 2, y: 190, t: 220 }])).place).toBe(2);
  });
  it("gives first to whoever beats the number one seed", () => {
    expect(stepladderResult(ladder(5, [
      { s: 4, y: 220, t: 200 }, { s: 3, y: 230, t: 210 },
      { s: 2, y: 240, t: 200 }, { s: 1, y: 250, t: 220 },
    ])).place).toBe(1);
    expect(stepladderResult(ladder(2, [{ s: 1, y: 250, t: 220 }])).place).toBe(1);
  });
  it("reports nothing while the ladder is still live", () => {
    const r = stepladderResult(ladder(5, [{ s: 4, y: 220, t: 200 }]));
    expect(r.place).toBe(null);
    expect(r.decided).toBe(false);
  });
  it("reports nothing without a seed", () => {
    const r = stepladderResult({ yourSeed: "", steps: [{ opponentSeed: "4", yourScore: "180", opponentScore: "200" }] });
    expect(r.place).toBe(null);
  });
  it("survives junk", () => {
    const r = stepladderResult({ yourSeed: "x", steps: [{ yourScore: "999", opponentScore: "200", opponentSeed: "0" }] });
    expect(r.played).toBe(0);
    expect(r.place).toBe(null);
    expect(stepladderResult(null).place).toBe(null);
  });
  it("averages over steps actually bowled, truncated", () => {
    const r = stepladderResult(ladder(3, [
      { s: 4, y: 201, t: 200 }, { s: 2, y: 200, t: 210 },
    ]));
    expect(r.played).toBe(2);
    expect(r.average).toBe(200);
  });
});

describe("step list editing", () => {
  it("adds, edits and renumbers", () => {
    let sl = addStep(addStep(normalizeStepladder(null)));
    expect(sl.steps.map(s => s.stepNumber)).toEqual([1, 2]);
    sl = setStepField(sl, 2, "yourScore", "215");
    expect(sl.steps[1].yourScore).toBe("215");
    sl = addStep(sl);
    sl = removeStep(sl, 1);
    expect(sl.steps.map(s => s.stepNumber)).toEqual([1, 2]);
  });
  it("keeps the seed through an edit", () => {
    const sl = setStepladderField(normalizeStepladder(null), "yourSeed", "4");
    expect(addStep(sl).yourSeed).toBe("4");
  });
});

describe("describeStepladder", () => {
  it("says nothing before a step is bowled", () => {
    expect(describeStepladder(normalizeStepladder(null))).toBe("");
  });
  it("names the finish", () => {
    expect(describeStepladder(ladder(5, [{ s: 4, y: 180, t: 200 }]))).toContain("5th");
    expect(describeStepladder(ladder(2, [{ s: 1, y: 250, t: 220 }]))).toContain("Won the stepladder");
  });
});

describe("ordinal", () => {
  it("handles the teens", () => {
    expect([1, 2, 3, 4, 11, 12, 13, 21, 22].map(ordinal))
      .toEqual(["1st", "2nd", "3rd", "4th", "11th", "12th", "13th", "21st", "22nd"]);
  });
});
