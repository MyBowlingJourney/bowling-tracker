// The journal: every note a bowler has written, in one place.
//
// Notes are scattered by design -- a shot note rides on the delivery, a
// drill note on the drill, a session note on the night. That is right for
// writing them, and useless for reading them back: "what did I say about
// the 10 pin last winter" meant opening nights one at a time.
//
// This gathers all three into one list, newest first, each carrying
// enough context to mean something on its own.
//
// It reads what already exists. The journal stores nothing of its own, so
// a note edited at its source changes here too and there is no second
// copy to fall out of step.

const rows = v => (Array.isArray(v) ? v : []).filter(x => x && typeof x === "object");

const clean = v => String(v ?? "").trim();

const mine = (r, bowler) => !clean(bowler) || clean(r.bowler) === clean(bowler);

// Session notes: one per night, about the night.
function fromSessions(sessions, bowler) {
  return rows(sessions)
    .filter(s => mine(s, bowler) && clean(s.notes))
    .map(s => ({
      kind: "session",
      date: clean(s.date),
      league: clean(s.league),
      text: clean(s.notes),
      // A night's scores give the note somewhere to stand: "felt slow"
      // reads differently beside 620 than beside 480.
      detail: Array.isArray(s.scores) && s.scores.length
        ? s.scores.filter(v => Number.isFinite(Number(v))).join(" \u00b7 ")
        : "",
    }));
}

// Shot notes: written mid-frame, about a delivery.
//
// Deduplicated per night because the notes box keeps its text between
// shots -- three more balls without clearing it saves the same line three
// times, and three identical entries read as three thoughts.
function fromShots(shots, bowler) {
  const seen = new Set();
  const out = [];
  for (const sh of rows(shots)) {
    if (!mine(sh, bowler)) continue;
    const text = clean(sh.notes);
    if (!text) continue;
    const key = `${clean(sh.date)}|${clean(sh.league)}|${text}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      kind: "shot",
      date: clean(sh.date),
      league: clean(sh.league),
      text,
      detail: clean(sh.game) ? `Game ${clean(sh.game)}, frame ${clean(sh.frame)}` : "",
    });
  }
  return out;
}

// Drill notes: about a target worked on.
function fromDrills(drills, bowler, labelFor) {
  return rows(drills)
    .filter(d => mine(d, bowler) && clean(d.notes))
    .map(d => {
      const target = clean(d.customTarget) || clean(d.target);
      const made = Number(d.made) || 0;
      const missed = Number(d.missed) || 0;
      const attempts = made + missed;
      return {
        kind: "drill",
        date: clean(d.date),
        league: "",
        text: clean(d.notes),
        detail: [
          typeof labelFor === "function" ? labelFor(target) : target,
          attempts ? `${made}/${attempts}` : "",
        ].filter(Boolean).join(" \u00b7 "),
      };
    });
}

// Everything, newest first.
//
// Ties break session, then drill, then shot: on one night the session note
// is the summary and belongs at the top of that day's entries.
const KIND_ORDER = { session: 0, drill: 1, shot: 2 };

export function journalEntries(opts) {
  // A default parameter only covers undefined, not null. Fourth domain
  // module to hit this; the pattern is always the same.
  const { sessions, shots, drills, bowler, labelFor } =
    (opts && typeof opts === "object") ? opts : {};
  const all = [
    ...fromSessions(sessions, bowler),
    ...fromDrills(drills, bowler, labelFor),
    ...fromShots(shots, bowler),
  ];
  return all.sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return KIND_ORDER[a.kind] - KIND_ORDER[b.kind];
  });
}

// Filter by free text, across the note and its context.
//
// Searching "10 pin" should find a drill note whose target is the 10 pin
// even when the words never appear in what the bowler typed -- the label
// is part of what the entry says.
export function searchJournal(entries, query) {
  const q = clean(query).toLowerCase();
  if (!q) return rows(entries);
  return rows(entries).filter(e =>
    `${e.text} ${e.detail} ${e.league} ${e.date}`.toLowerCase().includes(q));
}

// Grouped by date, for rendering under day headings.
export function journalByDate(entries) {
  const out = [];
  let current = null;
  for (const e of rows(entries)) {
    if (!current || current.date !== e.date) {
      current = { date: e.date, entries: [] };
      out.push(current);
    }
    current.entries.push(e);
  }
  return out;
}
