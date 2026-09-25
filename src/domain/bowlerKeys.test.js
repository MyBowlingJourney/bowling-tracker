import { describe, it, expect } from "vitest";
import { bowlerKeys } from "./bowlerKeys.js";

describe("whose game is whose", () => {
  it("carries a name onto the unnamed later games", () => {
    const k = bowlerKeys([
      { bowlerName: "Rob", lineupPosition: 0 }, { bowlerName: null, lineupPosition: 0 },
      { bowlerName: "Tommy", lineupPosition: 1 }, { bowlerName: null, lineupPosition: 1 },
    ]);
    expect(k.map(x => x.name)).toEqual(["rob", "rob", "tommy", "tommy"]);
    expect(new Set(k.map(x => x.key)).size).toBe(2);
  });
  it("carries forward in card order when there are no positions", () => {
    const k = bowlerKeys([{ bowlerName: "Rob" }, {}, {}, { bowlerName: "Tommy" }, {}]);
    expect(k.map(x => x.name)).toEqual(["rob", "rob", "rob", "tommy", "tommy"]);
    expect(k[1].key).toBe(k[0].key);
    expect(k[4].key).not.toBe(k[0].key);
  });
  it("joins a game with a position but no name to the named game at that position", () => {
    const k = bowlerKeys([{ bowlerName: "Rob", lineupPosition: null }, { bowlerName: "Rob", lineupPosition: 0 }, { lineupPosition: 0 }]);
    expect(new Set(k.map(x => x.key)).size).toBe(1);
  });
});
