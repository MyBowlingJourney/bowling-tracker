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

// Tournament notes: the event, each block, and the finish.
//
// Three separate boxes on the tournament screen, none of which reached
// the journal -- so a bowler who wrote "moved left 2 after game one" in
// a block's notes could not find it again anywhere. A tournament is
// also the kind of day most worth writing about, which made this the
// worst place to be missing.
//
// The event note is dated by its last block, because that is when it
// was written -- at the end, looking back.
function fromTournaments(tournaments, bowler) {
  const out = [];
  for (const t of rows(tournaments)) {
    if (!mine(t, bowler)) continue;
    const days = rows(t.days);
    const dated = days.map(d => clean(d.date)).filter(Boolean);
    const lastDate = dated.length ? dated[dated.length - 1] : "";
    const event = clean(t.name);

    // One per block: written between games, about that block.
    for (const day of days) {
      const text = clean(day.notes);
      if (!text) continue;
      const scores = rows(day.games)
        .map(g => Number(g.score))
        .filter(v => Number.isFinite(v) && v > 0);
      out.push({
        kind: "tournament",
        date: clean(day.date) || lastDate,
        league: event,
        text,
        detail: [
          days.length > 1 && day.dayNumber ? `Day ${day.dayNumber}` : "",
          clean(day.squad) ? `Squad ${clean(day.squad)}` : "",
          scores.length ? scores.join(" \u00b7 ") : "",
        ].filter(Boolean).join(" \u00b7 "),
      });
    }

    const overall = clean(t.notes);
    if (overall) {
      out.push({ kind: "tournament", date: lastDate, league: event, text: overall, detail: "Overall" });
    }

    // The placement note is about how it finished, which is why it sits
    // beside the finish rather than in the event's notes.
    const placement = clean(t.placementNote);
    if (placement) {
      out.push({ kind: "tournament", date: lastDate, league: event, text: placement, detail: "How it finished" });
    }
  }
  return out;
}

// Lane pattern notes: what the lanes did, on a night.
//
// A pattern record is per league and date and carries its own note.
// There is no box for it on the Bowl screen today, but records imported
// or written by an older version still hold them, and a note a bowler
// wrote is a note the journal owes them.
function fromPatterns(patterns, bowler) {
  return rows(patterns)
    .filter(p => mine(p, bowler) && clean(p.notes))
    .map(p => ({
      kind: "pattern",
      date: clean(p.date),
      league: clean(p.league),
      text: clean(p.notes),
      detail: [clean(p.patternName), clean(p.lane) ? `lane ${clean(p.lane)}` : ""]
        .filter(Boolean).join(" \u00b7 "),
    }));
}

// Everything, newest first.
//
// Ties break session, then drill, then shot: on one night the session note
// is the summary and belongs at the top of that day's entries.
const KIND_ORDER = { session: 0, tournament: 1, pattern: 2, drill: 3, shot: 4 };

export function journalEntries(opts) {
  // A default parameter only covers undefined, not null. Fourth domain
  // module to hit this; the pattern is always the same.
  const { sessions, shots, drills, tournaments, patterns, bowler, labelFor } =
    (opts && typeof opts === "object") ? opts : {};
  const all = [
    ...fromSessions(sessions, bowler),
    ...fromTournaments(tournaments, bowler),
    ...fromPatterns(patterns, bowler),
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
