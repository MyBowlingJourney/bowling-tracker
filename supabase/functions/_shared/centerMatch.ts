// Matching a centre's name as the bowler types.
//
// A copy of centerNameKey / centerMatchRank / matchCentersByName in
// src/domain/centers.js (edge functions can't import the app's source).
// Keep the two in step: src/domain/centers.test.js covers the rules.
//
// Every typed word must be the START of a word in the name
// ("hol bo" -> Holiday Bowl), ignoring case, accents and punctuation.

export function centerNameKey(s: unknown): string {
  return String(s ?? "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "").normalize("NFC")
    .toLowerCase()
    .replace(/['’`.]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

// 0 = name starts with the text, 1 = every typed word starts a word of
// the name, 2 = the text is inside the name with spaces removed,
// null = no match.
export function centerMatchRank(query: unknown, name: unknown): number | null {
  const q = centerNameKey(query);
  if (!q) return 0;
  const n = centerNameKey(name);
  if (!n) return null;
  if (n.startsWith(q)) return 0;
  const words = n.split(" ");
  if (q.split(" ").every((t) => words.some((w) => w.startsWith(t)))) return 1;
  if (n.replace(/ /g, "").includes(q.replace(/ /g, ""))) return 2;
  return null;
}
