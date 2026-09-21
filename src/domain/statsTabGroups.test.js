import { describe, it, expect } from "vitest";
import { groupShownCards, initialTab, STATS_TAB_GROUPS, tabGroupFor } from "./statsTabGroups.js";
import { STATS_CARD_IDS } from "./preferences.js";
import { groupForCard } from "./statsGroups.js";

describe("groupShownCards", () => {
  it("collapses members into one group at the first member's position", () => {
    const r = groupShownCards(["viewing", "headlineStats", "splits", "personalRecords", "strikeStreak", "singlePinSpares"]);
    expect(r.map(e => e.kind === "group" ? `G:${e.group.id}` : e.id))
      .toEqual(["viewing", "G:glance", "G:spares", "strikeStreak"]);
  });
  it("orders tabs by the group, not the screen", () => {
    const r = groupShownCards(["nonSplitLeaves", "singlePinSpares", "splits"]);
    expect(r[0].tabs.map(t => t.card)).toEqual(["singlePinSpares", "splits", "nonSplitLeaves"]);
  });
  it("a lone member shows as its plain card", () => {
    expect(groupShownCards(["money", "headlineStats"])).toEqual([
      { kind: "card", id: "money" }, { kind: "card", id: "headlineStats" },
    ]);
  });
  it("leaves ungrouped cards and junk alone", () => {
    expect(groupShownCards(["byBall", null, 3, ""])).toEqual([{ kind: "card", id: "byBall" }]);
    expect(groupShownCards(null)).toEqual([]);
  });
});

describe("initialTab", () => {
  const tabs = [{ card: "a" }, { card: "b" }];
  it("remembers the last tab while it exists", () => {
    expect(initialTab(tabs, "b")).toBe("b");
    expect(initialTab(tabs, "gone")).toBe("a");
    expect(initialTab([], "a")).toBeNull();
  });
});

describe("the groups themselves", () => {
  it("every member is a real card, in exactly one group, on the Mine chip", () => {
    const seen = new Set();
    for (const g of STATS_TAB_GROUPS) for (const t of g.tabs) {
      expect(STATS_CARD_IDS).toContain(t.card);
      expect(seen.has(t.card)).toBe(false);
      seen.add(t.card);
      expect(groupForCard(t.card)).toBe("overview");
      expect(tabGroupFor(t.card)).toBe(g);
    }
  });
});
