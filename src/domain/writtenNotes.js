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

// notes: [{ text, gameNumber, bowlerName }] as the AI transcribed them.
// Returns { games, found, used }.
export function applyWrittenNotes(games, notes) {
  const result = { games, found: 0, used: 0 };
  if (!Array.isArray(games) || !Array.isArray(notes) || !notes.length) return result;
  const norm = s => String(s || "").trim().toLowerCase();
  const copy = games.map(g => ({ ...g, frames: Array.isArray(g?.frames)
    ? g.frames.map(f => ({ ...f, balls: Array.isArray(f?.balls) ? f.balls.map(b => ({ ...b })) : f?.balls }))
    : g?.frames }));
  const bowlers = new Set(copy.map(g => norm(g.bowlerName)));
  // A note's bowler, loosely: the AI may write "Rob" for "Rob Thurs 9/24".
  const sameBowler = (a, b) => { const x = norm(a), y = norm(b); return !!x && !!y && (x === y || x.includes(y) || y.includes(x)); };
  // The one ball in this game the note fits, or null.
  const fitIn = (g, pins) => {
    const fits = candidates(g).filter(c => !c.frame.fromNote
      && c.balls.every(b => pinList(b.pinsStanding).length === pins.length));
    return fits.length === 1 ? fits[0] : null;
  };
  const apply = (hit, pins) => {
    for (const b of hit.balls) b.pinsStanding = pins.map(String);
    hit.frame.fromNote = [...new Set([...(hit.frame.fromNote || []), ...hit.balls.map(b => b.ballIndex ?? 1)])];
    hit.frame.needsReview = false;
    result.used++;
  };

  // Pass 1: notes that point at exactly one game.
  const unresolved = [];
  for (const note of notes) {
    const pins = pinsFromNote(note?.text);
    if (!pins) continue;
    result.found++;
    const gn = Number(note?.gameNumber);
    const named = bowlers.size > 1 && note?.bowlerName;
    const games_ = copy.filter(g => Number(g.gameNumber) === gn && (!named || sameBowler(g.bowlerName, note.bowlerName)));
    if (games_.length === 1) {
      // Exactly one ball it can belong to, or it is left for the review:
      // two places a one-pin note could go is a guess, not a reading.
      const hit = fitIn(games_[0], pins);
      if (hit) apply(hit, pins);
      continue;
    }
    if (games_.length > 1) unresolved.push({ note, pins, gn, games: games_ });
  }

  // Pass 2: the same game number on several bowlers' screenshots, with
  // no bowler named -- one screenshot per bowler, each with a "4" under
  // Game 3. Only settled when it cannot be a guess:
  //   - only one of those games has a ball the note fits: it goes there;
  //   - or every one of them does, and there are exactly that many
  //     identical notes: one each.
  const byGame = new Map();
  for (const u of unresolved) {
    if (!byGame.has(u.gn)) byGame.set(u.gn, []);
    byGame.get(u.gn).push(u);
  }
  for (const list of byGame.values()) {
    const games_ = list[0].games;
    const sameText = list.every(u => u.pins.join() === list[0].pins.join());
    const open = games_.map(g => ({ g, hit: fitIn(g, list[0].pins) })).filter(x => x.hit);
    if (sameText && open.length === list.length) {
      for (const x of open) apply(x.hit, list[0].pins);
      continue;
    }
    for (const u of list) {
      const fitting = u.games.map(g => ({ g, hit: fitIn(g, u.pins) })).filter(x => x.hit);
      if (fitting.length === 1) apply(fitting[0].hit, u.pins);
    }
  }
  result.games = copy;
  return result;
}
