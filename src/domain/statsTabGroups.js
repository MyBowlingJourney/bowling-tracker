// Tabbed cards on the Mine chip.
//
// Thirteen cards became four. Each group is one card with a tab per
// member, and the members stay real cards underneath: they keep their own
// ids, so hiding one, locking a paid one, and the "Not yet" list all work
// per card exactly as before. Grouping happens only at render time.
//
// A tab exists only for a member that rendered. A group with one member
// left shows as that plain card -- a tab bar with one tab is a label
// pretending to be a control.

export const STATS_TAB_GROUPS = Object.freeze([
  { id: "glance", title: "At a glance", tabs: [
    { card: "headlineStats", label: "Rates" },
    { card: "personalRecords", label: "Records" },
    { card: "cleanFrames", label: "Clean frames" },
  ] },
  { id: "spares", title: "Spares", tabs: [
    { card: "singlePinSpares", label: "Single pins" },
    { card: "tenPinLeaves", label: "10-pin" },
    { card: "splits", label: "Splits" },
    { card: "nonSplitLeaves", label: "Other leaves" },
  ] },
  { id: "delivery", title: "Delivery", tabs: [
    { card: "firstBallAverage", label: "First ball" },
    { card: "strikeQuality", label: "Strikes" },
    { card: "missDistribution", label: "Misses" },
    { card: "releaseQuality", label: "Release" },
  ] },
  { id: "sideGames", title: "Side games", tabs: [
    { card: "money", label: "Money" },
    { card: "threeSixNine", label: "3-6-9" },
  ] },
]);

const GROUP_OF = new Map();
for (const g of STATS_TAB_GROUPS) for (const t of g.tabs) GROUP_OF.set(t.card, g);

export function tabGroupFor(cardId) {
  return GROUP_OF.get(cardId) || null;
}

// Turns the list of cards that rendered into what the screen shows.
//
// Returns entries of { kind: "card", id } or
// { kind: "group", group, tabs: [{card, label}] }. A group sits where its
// first shown member would have sat; its tabs run in the group's own
// order, not the screen's, so the tab bar reads the same every time.
export function groupShownCards(shown) {
  const list = (Array.isArray(shown) ? shown : []).filter(id => typeof id === "string" && id);
  const present = new Set(list);
  const out = [];
  const emitted = new Set();
  for (const id of list) {
    const g = GROUP_OF.get(id);
    if (!g) { out.push({ kind: "card", id }); continue; }
    if (emitted.has(g.id)) continue;
    emitted.add(g.id);
    const tabs = g.tabs.filter(t => present.has(t.card));
    if (tabs.length === 1) out.push({ kind: "card", id: tabs[0].card });
    else out.push({ kind: "group", group: g, tabs });
  }
  return out;
}

// Which tab opens: the one used last if it's still there, else the first.
export function initialTab(tabs, remembered) {
  const cards = (Array.isArray(tabs) ? tabs : []).map(t => t.card);
  return cards.includes(remembered) ? remembered : (cards[0] ?? null);
}
