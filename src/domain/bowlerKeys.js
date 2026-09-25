// Whose game is whose, on an AI reading of a scorecard.
//
// The model names a bowler's first game and often leaves bowlerName null
// on the rest, and it sometimes gives a lineupPosition on one game and not
// the next. Anything that groups games by bowler has to fill those gaps
// the same way, or one bowler's night splits into "game 1" plus a
// nameless "games 2 and 3".
//
// Returns one entry per game, in the same order:
//   { key, name }  -- key is stable per bowler; name is the printed name,
//                     lower-cased, carried forward where the game had none.
export function bowlerKeys(games) {
  const list = Array.isArray(games) ? games : [];
  const norm = s => String(s || "").trim().toLowerCase();
  const pos = g => (Number.isInteger(g?.lineupPosition) ? g.lineupPosition : null);
  const nameByPos = new Map();
  const posByName = new Map();
  for (const g of list) {
    const n = norm(g?.bowlerName), p = pos(g);
    if (n && p !== null) {
      if (!nameByPos.has(p)) nameByPos.set(p, n);
      if (!posByName.has(n)) posByName.set(n, p);
    }
  }
  let lastName = "";
  let lastPos = null;
  return list.map(g => {
    const own = norm(g?.bowlerName);
    const p0 = pos(g);
    const name = own || (p0 !== null ? nameByPos.get(p0) : "") || lastName;
    const p = p0 !== null ? p0 : (name && posByName.has(name) ? posByName.get(name) : (own ? null : lastPos));
    if (name) lastName = name;
    if (p !== null) lastPos = p;
    return { key: p !== null ? `pos:${p}` : `name:${name}`, name };
  });
}
