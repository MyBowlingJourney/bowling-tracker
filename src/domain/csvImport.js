// Importing a season from a CSV.
//
// Four columns: date, game 1, game 2, game 3. Most bowling apps have no
// way in at all, so a bowler arriving with years of scores in a
// spreadsheet has to either retype them or give up on the history.
//
// Everything here is validation. The file comes from outside -- a export
// from another app, a spreadsheet somebody maintained by hand, a
// download from a league secretary -- and none of it can be trusted to
// be the shape it claims. A bad row is rejected with a reason and the
// rest still import: one typo in row 40 should not cost a bowler the
// other 39.

export const IMPORT_COLUMNS = ["date", "game1", "game2", "game3"];
export const MAX_ROWS = 2000;
export const MIN_SCORE = 0;
export const MAX_SCORE = 300;

// A real CSV, not a split on commas.
//
// Quoted fields can contain commas and escaped quotes, and a league
// export with "Smith, John" in it would otherwise shift every column
// after it. Also strips a UTF-8 BOM, which Excel writes by default and
// which otherwise becomes part of the first header name.
export function parseCsv(text) {
  const src = String(text ?? "").replace(/^\uFEFF/, "");
  if (!src.trim()) return [];

  const rows = [];
  let row = [], field = "", quoted = false, i = 0;

  while (i < src.length) {
    const c = src[i];
    if (quoted) {
      if (c === '"') {
        if (src[i + 1] === '"') { field += '"'; i += 2; continue; }
        quoted = false; i++; continue;
      }
      field += c; i++; continue;
    }
    if (c === '"') { quoted = true; i++; continue; }
    if (c === ",") { row.push(field); field = ""; i++; continue; }
    if (c === "\r") { i++; continue; }
    if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; i++; continue; }
    field += c; i++;
  }
  row.push(field);
  rows.push(row);

  // Trailing blank line from a file that ends in a newline.
  return rows.filter(r => r.length > 1 || String(r[0] ?? "").trim() !== "");
}

const clean = v => String(v ?? "").trim();

// Header names, loosely matched.
//
// "Game 1", "game_1" and "G1" all mean the same thing, and rejecting a
// file over a space would be the kind of strictness that helps nobody.
// The COLUMNS themselves are strict; only their spelling is forgiving.
const HEADER_ALIASES = {
  date: ["date", "bowleddate", "datebowled", "day"],
  game1: ["game1", "g1", "gameone", "first"],
  game2: ["game2", "g2", "gametwo", "second"],
  game3: ["game3", "g3", "gamethree", "third"],
};

const canon = h => clean(h).toLowerCase().replace(/[^a-z0-9]/g, "");

export function mapHeader(headerRow) {
  const cells = (Array.isArray(headerRow) ? headerRow : []).map(canon);
  const index = {};
  for (const [key, aliases] of Object.entries(HEADER_ALIASES)) {
    const at = cells.findIndex(c => aliases.includes(c));
    if (at >= 0) index[key] = at;
  }
  return index;
}

// Strict ISO, on purpose.
//
// 01/02/2026 is the 1st of February to most of the world and the 2nd of
// January in the US, and there is no way to tell which a given file
// means. Guessing would silently file a whole season to the wrong dates,
// which is worse than asking the bowler to reformat one column.
const ISO = /^(\d{4})-(\d{2})-(\d{2})$/;

export function validateDate(raw, opts) {
  // A default parameter only covers undefined, not null. Seventh module
  // to hit this; the pattern never varies.
  const { today } = (opts && typeof opts === "object") ? opts : {};
  const v = clean(raw);
  if (!v) return { ok: false, reason: "no date" };
  const m = ISO.exec(v);
  if (!m) return { ok: false, reason: `date must look like 2026-09-17, got "${v}"` };

  const [, y, mo, d] = m;
  const year = Number(y), month = Number(mo), day = Number(d);
  // Date.parse accepts 2026-02-31 and rolls it forward to March, so the
  // parts are checked against the real calendar instead.
  const dt = new Date(Date.UTC(year, month - 1, day));
  if (dt.getUTCFullYear() !== year || dt.getUTCMonth() !== month - 1 || dt.getUTCDate() !== day) {
    return { ok: false, reason: `no such date: ${v}` };
  }
  if (year < 1900) return { ok: false, reason: `date looks wrong: ${v}` };

  const now = clean(today);
  if (now && v > now) return { ok: false, reason: `date is in the future: ${v}` };
  return { ok: true, value: v };
}

// A game score, or nothing.
//
// Blank is allowed: a night can be one or two games, and a bowler should
// not have to invent a third. A blank is not a zero -- zero is a real
// score a bowler can bowl, and the two are stored differently.
export function validateScore(raw, label) {
  const v = clean(raw);
  if (!v) return { ok: true, value: null };
  if (!/^-?\d+$/.test(v)) return { ok: false, reason: `${label} must be a whole number, got "${v}"` };
  const n = Number(v);
  if (n < MIN_SCORE || n > MAX_SCORE) {
    return { ok: false, reason: `${label} must be between ${MIN_SCORE} and ${MAX_SCORE}, got ${n}` };
  }
  return { ok: true, value: n };
}

// The whole file: what would import, what would not, and why.
//
// Nothing is written here. This returns a plan the bowler confirms, so a
// file with problems can be fixed and re-dropped rather than half
// imported.
export function validateImport(text, opts) {
  const { today, existingDates } = (opts && typeof opts === "object") ? opts : {};
  const rows = parseCsv(text);
  if (!rows.length) {
    return { ok: false, error: "That file is empty.", rows: [], accepted: [], rejected: [] };
  }

  const index = mapHeader(rows[0]);
  const missing = IMPORT_COLUMNS.filter(c => index[c] === undefined);
  if (missing.length) {
    return {
      ok: false,
      error: `The header row needs these columns: ${missing.join(", ")}.`,
      rows: [], accepted: [], rejected: [],
    };
  }

  const body = rows.slice(1);
  if (body.length > MAX_ROWS) {
    return {
      ok: false,
      error: `That file has ${body.length} rows. The limit is ${MAX_ROWS}.`,
      rows: [], accepted: [], rejected: [],
    };
  }

  const already = new Set((Array.isArray(existingDates) ? existingDates : []).map(clean));
  const seen = new Set();
  const accepted = [], rejected = [];

  body.forEach((cells, n) => {
    // Row numbers as the bowler sees them in a spreadsheet: the header is
    // row 1, so the first data row is row 2.
    const line = n + 2;
    const blank = cells.every(c => clean(c) === "");
    if (blank) return;

    const date = validateDate(cells[index.date], { today });
    if (!date.ok) { rejected.push({ line, reason: date.reason }); return; }

    const scores = [];
    let bad = null;
    for (const [key, label] of [["game1", "game 1"], ["game2", "game 2"], ["game3", "game 3"]]) {
      const r = validateScore(cells[index[key]], label);
      if (!r.ok) { bad = r.reason; break; }
      scores.push(r.value);
    }
    if (bad) { rejected.push({ line, reason: bad }); return; }

    const real = scores.filter(v => v !== null);
    if (!real.length) { rejected.push({ line, reason: "no scores on that row" }); return; }

    // A gap is a mistake worth catching: 210, blank, 195 means a column
    // was missed, not that the bowler skipped the middle game.
    const firstBlank = scores.indexOf(null);
    if (firstBlank !== -1 && scores.slice(firstBlank).some(v => v !== null)) {
      rejected.push({ line, reason: "a game is blank between two scores" });
      return;
    }

    if (seen.has(date.value)) {
      rejected.push({ line, reason: `${date.value} appears twice in this file` });
      return;
    }
    seen.add(date.value);

    // A night you already have is a QUESTION, not a rejection.
    //
    // It used to be dropped with a reason, which quietly decided for the
    // bowler that their existing night was the right one. It might be:
    // they may also have re-exported a season they had already typed in,
    // or be fixing scores they got wrong. Only they know.
    //
    // So it lands in accepted, flagged, and the caller asks.
    accepted.push({
      line, date: date.value, scores: real,
      conflict: already.has(date.value),
    });
  });

  return {
    ok: accepted.length > 0,
    error: accepted.length ? "" : "Nothing in that file could be imported.",
    accepted,
    rejected,
    rows: body.length,
  };
}


// What the bowler is being asked, once a file validates.
//
// Three answers, because there are three reasonable things to want:
// replace the nights you already have, keep them and import only what is
// new, or stop and go look at the file first.
export const CONFLICT_CHOICES = ["overwrite", "skip", "abort"];

export function conflictSummary(plan) {
  const accepted = Array.isArray(plan && plan.accepted) ? plan.accepted : [];
  const clashing = accepted.filter(r => r && r.conflict);
  return {
    total: accepted.length,
    conflicts: clashing.length,
    fresh: accepted.length - clashing.length,
    dates: clashing.map(r => r.date),
    // No question to ask when nothing clashes.
    needsAnswer: clashing.length > 0,
  };
}

// The rows to actually write, given the bowler's answer.
export function rowsToImport(plan, choice) {
  const accepted = Array.isArray(plan && plan.accepted) ? plan.accepted : [];
  if (choice === "abort") return [];
  if (choice === "skip") return accepted.filter(r => r && !r.conflict);
  if (choice === "overwrite") return accepted.slice();
  // No answer given: safe only when nothing needed one.
  return accepted.some(r => r && r.conflict) ? [] : accepted.slice();
}
