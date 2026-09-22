// The badges a single night earned, for the share card.
//
// Reads a badge history -- competitiveBadgeHistory or casual
// badgeHistory, both {id: {count, lastDate, dates}} -- and returns the
// definitions of the ones earned on `date`, in the order the definitions
// list them (which is the order the Badges screen shows them).
//
// `dates`, not `lastDate`: a repeatable badge earned tonight and again
// next week has a lastDate of next week, and sharing tonight's card
// later would lose it. A history with no `dates` (from an older build)
// falls back to lastDate for non-repeats rather than showing nothing.
export function badgesEarnedOn(history, definitions, date) {
  const d = String(date ?? "").trim();
  if (!d || !history || typeof history !== "object") return [];
  const defs = Array.isArray(definitions) ? definitions : [];
  return defs
    .filter(b => b && b.id)
    .filter(b => {
      const rec = history[b.id];
      if (!rec || !rec.count) return false;
      if (Array.isArray(rec.dates)) return rec.dates.includes(d);
      return rec.lastDate === d;
    })
    .map(b => ({ id: b.id, emoji: b.emoji || "", name: b.name || "" }));
}
