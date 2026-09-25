import { bowlerKeys } from "./bowlerKeys.js";

// A bowler's own notes on a scorecard screenshot.
//
// LaneTalk draws one rack for the tenth, so the fill ball after a spare
// never appears in the picture, and a frame corrected by hand shows a
// hand instead of pins. Bowlers who know this write the missing leave on
// the screenshot -- a "4" under the tenth, "1-3-6" beside it.
//
// Asking the AI to APPLY those notes did not work: it read the card and
// guessed the fill ball anyway. So the job is split. The AI only
// transcribes what is written and which game row it sits by (reading big
// text is what it is good at); this file decides, by rules, which ball a
// note belongs to -- and only uses it where the pin COUNT already agrees
// with the card's marks, so a note can fill in which pins, never change a
// score.

// "4", "1-3-6", "10", "7 10", "4,7". Anything with words in it is not a
// leave and is left alone.
export function pinsFromNote(text) {
  const t = String(text || "").trim();
  if (!t || !/^[\s\d,\-–/.&+]+$/.test(t)) return null;
  const pins = [...new Set((t.match(/10|[1-9]/g) || []).map(Number))].filter(n => n >= 1 && n <= 10);
  return pins.length ? pins.sort((a, b) => a - b) : null;
}

function pinList(raw) {
  if (Array.isArray(raw)) return raw.map(String).map(s => s.trim()).filter(Boolean);
  if (typeof raw === "string") return raw.split(/[^0-9]+/).filter(Boolean);
  return [];
}

// The balls a note could belong to, in the order they are tried:
//   1. the tenth's fill ball after a spare (never drawn by LaneTalk)
//   2. the first ball of any frame the picture could not read (the hand)
function candidates(game) {
  const out = [];
  const frames = Array.isArray(game?.frames) ? game.frames : [];
  const tenth = frames.find(f => Number(f?.frameNumber) === 10);
  if (tenth && Array.isArray(tenth.balls)) {
    const b = [...tenth.balls].sort((x, y) => (x.ballIndex ?? 0) - (y.ballIndex ?? 0));
    const spareFirst = b[0] && !b[0].isStrike && b[1] && pinList(b[1].pinsStanding).length === 0;
    if (spareFirst && b[2] && !b[2].isStrike) out.push({ frame: tenth, balls: [b[2]] });
  }
  for (const f of frames) {
    if (!f?.needsReview || !Array.isArray(f.balls)) continue;
    const b = [...f.balls].sort((x, y) => (x.ballIndex ?? 0) - (y.ballIndex ?? 0));
    if (!b[0] || b[0].isStrike) continue;
    // An open frame whose second ball took nothing ("9 -") stands the
    // same pins after both balls, so the note fills both.
    const same = b[1] && pinList(b[1].pinsStanding).length === pinList(b[0].pinsStanding).length;
    out.push({ frame: f, balls: same ? [b[0], b[1]] : [b[0]] });
  }
  return out;
}

// notes: [{ text, gameNumber, bowlerName, imageNumber }] as the AI
// transcribed them. opts.imageOf: for each game, the image (0-based) its
// frames were read from, when the pixel reader paired them.
// Returns { games, found, used, outcomes } -- outcomes is one short line
// per note for the diagnostics (pins, game and bowler NUMBER, never names).
//
// Which ball a note belongs to, most reliable signal first:
//   1. the image it is written on (a team's card is a screenshot each);
//   2. the bowler name the AI put on it;
//   3. the game number -- or, with none, the bowler's last game, since a
//      note under the card sits nearest the last row;
// and then the pin COUNT: the note goes only where exactly one ball has
// that many pins standing. On the real Rob/Tommy card the AI dropped the
// bowler on one "4" and missed the other entirely, so a note that fits
// two bowlers' games equally is left, never guessed -- unless there are
// exactly as many identical notes as places they fit.
export function applyWrittenNotes(games, notes, opts = {}) {
  const result = { games, found: 0, used: 0, outcomes: [] };
  if (!Array.isArray(games) || !Array.isArray(notes) || !notes.length) return result;
  const norm = s => String(s || "").trim().toLowerCase();
  const copy = games.map(g => ({ ...g, frames: Array.isArray(g?.frames)
    ? g.frames.map(f => ({ ...f, balls: Array.isArray(f?.balls) ? f.balls.map(b => ({ ...b })) : f?.balls }))
    : g?.frames }));
  const keys = bowlerKeys(copy);
  const bowlerOrder = [...new Set(keys.map(k => k.key))];
  const imageOf = Array.isArray(opts.imageOf) && opts.imageOf.length === copy.length ? opts.imageOf : null;
  // A note's bowler, loosely: the AI may write "Rob" for "Rob Thurs 9/24".
  const sameBowler = (a, b) => { const x = norm(a), y = norm(b); return !!x && !!y && (x === y || x.includes(y) || y.includes(x)); };
  const label = i => `${bowlerOrder.length > 1 ? `bowler ${bowlerOrder.indexOf(keys[i].key) + 1} ` : ""}G${copy[i].gameNumber}`;

  // Every ball in these games the note could fill.
  const fitsIn = (idx, pins) => {
    const out = [];
    for (const i of idx) {
      for (const c of candidates(copy[i])) {
        if (c.frame.fromNote) continue;
        if (c.balls.every(b => pinList(b.pinsStanding).length === pins.length)) out.push({ ...c, gi: i });
      }
    }
    return out;
  };
  const where = hit => `${label(hit.gi)}F${hit.frame.frameNumber} ball ${hit.balls.map(b => b.ballIndex ?? 1).join("+")}`;
  const apply = (hit, pins) => {
    for (const b of hit.balls) b.pinsStanding = pins.map(String);
    hit.frame.fromNote = [...new Set([...(hit.frame.fromNote || []), ...hit.balls.map(b => b.ballIndex ?? 1)])];
    hit.frame.needsReview = false;
    result.used++;
  };

  // The games a note can be about, and how they were narrowed.
  const scopeOf = note => {
    let idx = copy.map((_, i) => i);
    const img = Number(note?.imageNumber);
    let byImage = false;
    if (imageOf && Number.isInteger(img) && img >= 1) {
      const p = idx.filter(i => imageOf[i] === img - 1);
      if (p.length) { idx = p; byImage = true; }
    }
    if (!byImage && bowlerOrder.length > 1 && note?.bowlerName) {
      const p = idx.filter(i => sameBowler(keys[i].name, note.bowlerName));
      if (p.length) idx = p;
    }
    const gn = Number(note?.gameNumber);
    if (Number.isInteger(gn) && gn >= 1) {
      // A note written between two rows is "below" one and "above" the
      // other; the row above is kept as a fallback when nothing in the
      // stated game fits.
      return { idx: idx.filter(i => Number(copy[i].gameNumber) === gn), gameKnown: true,
        above: idx.filter(i => Number(copy[i].gameNumber) === gn - 1) };
    }
    return { idx, gameKnown: false };
  };
  // Each bowler's last game in the scope.
  const lastGames = idx => {
    const best = new Map();
    for (const i of idx) {
      const k = keys[i].key;
      if (!best.has(k) || Number(copy[i].gameNumber) > Number(copy[best.get(k)].gameNumber)) best.set(k, i);
    }
    return [...best.values()];
  };

  // Pass 1: every note on its own.
  const pending = [];
  notes.forEach((note, n) => {
    const pins = pinsFromNote(note?.text);
    if (!pins) return;
    result.found++;
    const tag = `"${pins.join("-")}"${note?.imageNumber ? ` img${note.imageNumber}` : ""} g${note?.gameNumber ?? "?"}${note?.bowlerName ? " named" : ""}`;
    const scope = scopeOf(note);
    let { idx } = scope;
    const { gameKnown } = scope;
    let fits = idx.length ? fitsIn(idx, pins) : [];
    if (!fits.length && gameKnown && scope.above.length) {
      const up = fitsIn(scope.above, pins);
      if (up.length === 1) { idx = scope.above; fits = up; }
    }
    if (!idx.length) { result.outcomes[n] = `${tag}: no such game`; return; }
    if (fits.length > 1 && !gameKnown) {
      const last = fitsIn(lastGames(idx), pins);
      if (last.length === 1) fits = last;
    }
    if (fits.length === 1) { apply(fits[0], pins); result.outcomes[n] = `${tag} -> ${where(fits[0])}`; return; }
    result.outcomes[n] = fits.length ? `${tag}: ${fits.length} places fit` : `${tag}: no ball with ${pins.length} pin(s) standing`;
    if (fits.length) pending.push({ n, tag, pins, idx, gameKnown });
  });

  // Pass 2: notes that fit more than one place. Identical notes that fit
  // exactly as many places as there are notes go one each (a "4" under
  // game 3 on each of two screenshots); after that, anything left with a
  // single place it can go takes it.
  const groups = new Map();
  for (const p of pending) {
    const k = p.pins.join("-");
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(p);
  }
  for (const list of groups.values()) {
    const sets = list.map(p => fitsIn(p.idx, p.pins));
    const sig = s => s.map(where).sort().join("|");
    if (list.length > 1 && sets.every(s => sig(s) === sig(sets[0])) && sets[0].length === list.length) {
      sets[0].forEach((hit, j) => {
        apply(hit, list[j].pins);
        result.outcomes[list[j].n] = `${list[j].tag} -> ${where(hit)} (paired)`;
      });
      continue;
    }
    for (const p of list) {
      const fits = fitsIn(p.idx, p.pins);
      if (fits.length === 1) { apply(fits[0], p.pins); result.outcomes[p.n] = `${p.tag} -> ${where(fits[0])}`; }
    }
  }
  result.outcomes = result.outcomes.filter(Boolean);
  result.games = copy;
  return result;
}
