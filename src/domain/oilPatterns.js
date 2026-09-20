// Oil patterns.
//
// Seeded with real, named Kegel commercial patterns (Element, Landmark,
// Navigation series) -- see migration_oil_patterns.sql for exactly which
// entries were cross-verified against Kegel's own site versus taken from a
// single compiled source. Deliberately does NOT seed PBA tournament
// patterns: the same name gets reused year to year with different actual
// numbers, so there's no single stable spec to seed under one name. A
// bowler who wants to log one adds it by hand with whatever they were told.
//
// This is read/search-only from the app's side for the seeded rows --
// there's no voting or verification workflow like the ball catalog, since
// getting an oil pattern's length wrong is a much smaller stake than a
// ball's drilling spec, and the seed data already carries its own
// verification-level notes rather than needing community consensus.

export function normalizePattern(raw) {
  if (!raw || typeof raw !== "object") return null;
  const name = (raw.name || "").trim();
  if (!name) return null;
  return {
    id: raw.id || "",
    name,
    series: raw.series || "",
    lengthFeet: raw.lengthFeet ?? null,
    ratio: raw.ratio || "",
    volumeMl: raw.volumeMl ?? null,
    forwardMl: raw.forwardMl ?? null,
    reverseMl: raw.reverseMl ?? null,
    verified: !!raw.verified,
    sourceNote: raw.sourceNote || "",
    // The season the specs belong to. PBA animal patterns keep their
    // names year to year but the length, volume and ratio change -- a
    // "Chameleon" without a year is ambiguous, and a bowler's 2024
    // Chameleon numbers don't belong in the same bucket as 2026's.
    year: Number.isInteger(Number(raw.year)) && Number(raw.year) > 1990 ? Number(raw.year) : null,
  };
}

// ── PBA animal patterns ────────────────────────────────────────────────
//
// The names are stable; the specs are not. So this seeds the NAMES, with
// the year as the thing that disambiguates, and leaves length/volume/
// ratio for the bowler or the community to fill from the official PBA
// pattern sheet for that season. Shipping guessed numbers here would put
// wrong specs behind a verified-looking entry, which is worse than blank.
export const PBA_ANIMAL_PATTERNS = ["Wolf", "Cheetah", "Bat", "Viper", "Bear", "Chameleon", "Scorpion", "Dragon", "Shark", "Badger"];

// Where the authoritative year-tagged specs live. Kegel makes the
// patterns and publishes each season's sheet, so a bowler filling these
// in has one correct place to look rather than a search result.
export const PATTERN_SPEC_SOURCE = "https://patternlibrary.kegel.net";

// Specs verified against a year-tagged source. Deliberately sparse.
//
// Published lengths for the SAME animal differ by up to four feet
// depending on the season and who published them -- Shark appears as 44',
// 45' and 48'; Cheetah as 33' and 35'; Bear as 38', 39' and 41'. That's
// not sloppy reporting, it's the patterns genuinely being re-cut between
// seasons, which is exactly why the year belongs in the name.
//
// The consequence: a plausible-looking table assembled from memory would
// be wrong for most bowler-year combinations, and wrong specs behind a
// confident-looking entry are worse than a blank a bowler fills in
// correctly. So only entries confirmed against a specific year's sheet
// go here, keyed by "Name|Year".
export const VERIFIED_PATTERN_SPECS = {
  // ── 2026 ──
  "Badger|2026": { lengthFeet: 50, volumeMl: 35.36, ratio: "2.91:1" },
  "Bat|2026": { lengthFeet: 37, volumeMl: 25.2, ratio: "2.81:1" },
  "Bear|2026": { lengthFeet: 38, volumeMl: 29.58, ratio: "2.01:1" },
  "Dragon|2026": { lengthFeet: 47, volumeMl: 26.4, ratio: "2.65:1" },
  "Viper|2026": { lengthFeet: 37, volumeMl: 25.56, ratio: "2.65:1" },
  // ── 2025 ──
  "Badger|2025": { lengthFeet: 48, volumeMl: 32.02, ratio: "2.48:1" },
  "Bat|2025": { lengthFeet: 37, volumeMl: 29.02, ratio: "2.57:1" },
  "Chameleon|2025": { lengthFeet: 41, volumeMl: 33.24, ratio: "2.66:1" },
  "Cheetah|2025": { lengthFeet: 35, volumeMl: 36.9, ratio: "1.62:1" },
  "Scorpion|2025": { lengthFeet: 44, volumeMl: 31.35, ratio: "2.67:1" },
  "Viper|2025": { lengthFeet: 38, volumeMl: 27.8, ratio: "2.26:1" },
  "Wolf|2025": { lengthFeet: 34, volumeMl: 31.78, ratio: "1.31:1" },
  // ── 2024 ──
  "Badger|2024": { lengthFeet: 47, volumeMl: 28.7, ratio: "3.19:1" },
  "Bat|2024": { lengthFeet: 37, volumeMl: 25.2, ratio: "2.81:1" },
  "Bear|2024": { lengthFeet: 41, volumeMl: 30.1, ratio: "2.29:1" },
  "Chameleon|2024": { lengthFeet: 39, volumeMl: 30.2, ratio: "2.63:1" },
  "Cheetah|2024": { lengthFeet: 35, volumeMl: 33.55, ratio: "2.00:1" },
  "Dragon|2024": { lengthFeet: 45, volumeMl: 29.5, ratio: "3.03:1" },
  "Scorpion|2024": { lengthFeet: 42, volumeMl: 35.05, ratio: "2.78:1" },
  "Shark|2024": { lengthFeet: 48, volumeMl: 29.2, ratio: "2.78:1" },
  "Viper|2024": { lengthFeet: 37, volumeMl: 32.4, ratio: "2.34:1" },
  "Wolf|2024": { lengthFeet: 34, volumeMl: 29.8, ratio: "2.13:1" },
};

// The years we actually hold specs for, newest first. Used to offer the
// picker something real rather than a guessed current year -- if the
// 2027 sheet hasn't been entered yet, offering "Dragon (2027)" with no
// specs is worse than offering the 2026 one that's complete.
export const VERIFIED_PATTERN_YEARS = [...new Set(
  Object.keys(VERIFIED_PATTERN_SPECS).map(k => Number(k.split("|")[1])),
)].sort((a, b) => b - a);

export function pbaAnimalPatternSeeds(year = new Date().getFullYear()) {
  return PBA_ANIMAL_PATTERNS.map(name => {
    const verified = VERIFIED_PATTERN_SPECS[`${name}|${year}`];
    return normalizePattern({
      id: `pba-${name.toLowerCase()}-${year}`,
      name,
      series: "PBA Animal",
      year,
      ...(verified || {}),
      verified: !!verified,
      sourceNote: verified
        ? `Official ${year} PBA specs.`
        : `Not on the ${year} sheet — check patternlibrary.kegel.net if you bowled it.`,
    });
  });
}

// Only the patterns actually published for a given year. The full animal
// list isn't run every season -- 2026 had five, 2024 had ten -- so
// offering all ten every year would put nine unverified entries in the
// picker for a season that only used five.
export function pbaPatternsForYear(year) {
  return pbaAnimalPatternSeeds(year).filter(p => p.verified);
}

// Every pattern we hold real specs for, newest year first. This is what
// the picker should offer.
export function allVerifiedPbaPatterns() {
  return VERIFIED_PATTERN_YEARS.flatMap(y => pbaPatternsForYear(y));
}

// Display name: "Chameleon (2026)" when a year is set, so two seasons of
// the same animal never look like one pattern.
export function patternDisplayName(pattern) {
  if (!pattern?.name) return "";
  return pattern.year ? `${pattern.name} (${pattern.year})` : pattern.name;
}

// A short line for showing under a pattern's name, e.g.
// "41' · Element Sport · 1.36:1 · 25.79 mL"
export function describePattern(pattern) {
  if (pattern?.year && !pattern?.lengthFeet && !pattern?.volumeMl) {
    return `${pattern.series || "Sport"} · ${pattern.year} · specs not entered yet`;
  }
  if (!pattern) return "";
  const parts = [];
  if (pattern.lengthFeet) parts.push(`${pattern.lengthFeet}'`);
  if (pattern.series) parts.push(pattern.series);
  if (pattern.ratio) parts.push(pattern.ratio);
  if (pattern.volumeMl) parts.push(`${pattern.volumeMl} mL`);
  return parts.join(" · ");
}

function key(name) {
  return (typeof name === "string" ? name : "").trim().toLowerCase();
}

// Search-as-you-type over the pattern library. Same ranking approach as
// the ball catalog's search: prefix matches before mid-string matches, so
// typing "Kry" surfaces "Krypton" before anything with "kry" buried in the
// middle of a longer name.
export function searchPatterns(query, patterns, limit = 8) {
  const q = key(typeof query === "string" ? query : "");
  if (q.length < 2) return [];
  const scored = (patterns || [])
    .map(normalizePattern)
    .filter(Boolean)
    .map(p => ({ pattern: p, idx: key(p.name).indexOf(q) }))
    .filter(x => x.idx !== -1);

  return scored
    .sort((a, b) => {
      const aPrefix = a.idx === 0 ? 0 : 1;
      const bPrefix = b.idx === 0 ? 0 : 1;
      if (aPrefix !== bPrefix) return aPrefix - bPrefix;
      return a.pattern.name.localeCompare(b.pattern.name);
    })
    .slice(0, limit)
    .map(x => x.pattern);
}

// ── Supabase mapping ────────────────────────────────────────────────────
export function patternToRow(pattern, userId) {
  if (!pattern || typeof pattern !== "object") return null;
  return {
    name: pattern.name,
    year: pattern.year ?? null,
    series: pattern.series || null,
    length_feet: pattern.lengthFeet || null,
    ratio: pattern.ratio || null,
    volume_ml: pattern.volumeMl || null,
    forward_ml: pattern.forwardMl || null,
    reverse_ml: pattern.reverseMl || null,
    verified: false, // a user submission is never auto-verified
    created_by: userId || null,
  };
}

export function patternFromRow(row) {
  if (!row) return null;
  return normalizePattern({
    id: row.id,
    name: row.name,
    year: row.year,
    series: row.series,
    lengthFeet: row.length_feet,
    ratio: row.ratio,
    volumeMl: row.volume_ml,
    forwardMl: row.forward_ml,
    reverseMl: row.reverse_ml,
    verified: row.verified,
    sourceNote: row.source_note,
  });
}

// ── Per-pattern history across tournaments ──────────────────────────────
//
// A bowler's real question is "how do I actually score on this pattern?"
// Tournament days each carry an oilPattern name and a set of games, so
// history is an aggregation across every day that names the same pattern.
//
// Matching is by normalized name, not id: a bowler may have logged the
// same pattern before it existed in the library (typed by hand) and again
// after picking it from the list. Those are the same pattern to them, so
// they aggregate together.
//
// Deliberately NOT computed here: strike percentage, carry, or anything
// needing shot-level data. Tournament days store game scores only, so
// score-derived stats are all that can honestly be produced. Shot-level
// pattern stats would need shots tagged with the pattern, which they
// aren't.

function scoresForDay(day) {
  return (day?.games || [])
    .map(g => (g.score === "" || g.score == null ? null : Number(g.score)))
    .filter(s => s != null && Number.isFinite(s) && s >= 0 && s <= 300);
}

// Every logged day matching a pattern name, flattened across tournaments.
export function patternDays(tournaments, patternName) {
  const target = key(patternName);
  if (!target) return [];
  const out = [];
  for (const t of (Array.isArray(tournaments) ? tournaments : [])) {
    for (const day of t?.days || []) {
      if (key(day?.oilPattern) !== target) continue;
      const scores = scoresForDay(day);
      out.push({
        tournamentId: t.id || "",
        tournamentName: t.name || "",
        center: t.center || "",
        date: day.date || "",
        dayNumber: day.dayNumber ?? null,
        scores,
        madeCut: day.madeCut === true || day.madeCut === false ? day.madeCut : null,
      });
    }
  }
  // Most recent first; days with no date sort last rather than pretending
  // to be the oldest.
  return out.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date.localeCompare(a.date);
  });
}

// Aggregate stats for one pattern. Returns null when nothing is logged,
// so callers can hide the section rather than render a row of dashes.
export function patternStats(tournaments, patternName) {
  const days = patternDays(tournaments, patternName);
  const allScores = days.flatMap(d => d.scores);
  if (!allScores.length) {
    return days.length ? { days, games: 0, average: null, high: null, low: null, cutsMade: null, cutsTracked: 0 } : null;
  }
  const total = allScores.reduce((a, b) => a + b, 0);
  const tracked = days.filter(d => d.madeCut === true || d.madeCut === false);
  return {
    days,
    games: allScores.length,
    // Bowling averages truncate, they don't round -- same rule the book
    // average code follows.
    average: Math.floor(total / allScores.length),
    high: Math.max(...allScores),
    low: Math.min(...allScores),
    cutsMade: tracked.length ? tracked.filter(d => d.madeCut === true).length : null,
    cutsTracked: tracked.length,
  };
}

// Every pattern the bowler has actually logged, with its stats, ranked by
// how much they've played it. For a "your patterns" overview.
export function loggedPatternSummaries(tournaments) {
  const names = new Map();
  for (const t of (Array.isArray(tournaments) ? tournaments : [])) {
    for (const day of t?.days || []) {
      const name = (day?.oilPattern || "").trim();
      if (!name) continue;
      if (!names.has(key(name))) names.set(key(name), name);
    }
  }
  return [...names.values()]
    .map(name => ({ name, stats: patternStats(tournaments, name) }))
    .filter(x => x.stats)
    .sort((a, b) => {
      if (b.stats.games !== a.stats.games) return b.stats.games - a.stats.games;
      return a.name.localeCompare(b.name);
    });
}

// Per-pattern scoring, for Insights.
//
// 18/50 tournament players: "my Chameleon numbers and my house-shot
// numbers are two different bowlers." Blending them analyses a bowler who
// does not exist. The pattern library already knows what was down; this
// joins it to what was scored.
//
// Two sources, because a pattern is recorded differently in each:
//   - League nights: lanePatterns rows keyed by (league, date).
//   - Tournaments: the pattern is on the tournament day itself.
// A bowler's history on each oil pattern: every night, what they shot,
// and what they wrote down afterwards.
//
// patternAverages already gives a name and an average, and that feeds the
// AI snapshot -- but nothing has ever shown a bowler their own pattern
// history. Which is the wrong way round: the person who most needs to
// know they average 172 on Scorpion and 201 on the house shot is the
// bowler about to pick a ball for Thursday.
//
// NOTES ARE THE POINT, not a decoration. An average tells you a pattern
// is hard; "played 4th arrow, ball rolled out, should have moved right"
// tells you what to do about it next time. That is the thing bowlers
// keep in their phone notes app today, and the reason to keep it here is
// that here it sits next to the score it belongs to.
export function patternHistory(sessions, lanePatterns, bowler) {
  const nights = (Array.isArray(lanePatterns) ? lanePatterns : [])
    .filter(p => p && typeof p === "object" && p.patternName);

  // One entry per night the bowler actually bowled on a named pattern.
  const byPattern = new Map();

  for (const p of nights) {
    const name = String(p.patternName).trim();
    if (!name) continue;

    const mine = (Array.isArray(sessions) ? sessions : []).filter(s =>
      s && typeof s === "object"
      && (!bowler || s.bowler === bowler)
      && s.league === p.league && String(s.date) === String(p.date));

    const scores = mine
      .flatMap(s => Array.isArray(s.scores) ? s.scores : [])
      .map(v => Number(v))
      .filter(v => Number.isFinite(v));

    // A pattern recorded for a night nobody bowled is not history. It
    // still counts as a note the bowler left, though, so it is kept when
    // there is one.
    if (!scores.length && !String(p.notes || "").trim()) continue;

    if (!byPattern.has(name)) byPattern.set(name, []);
    byPattern.get(name).push({
      date: p.date || "",
      league: p.league || "",
      lane: p.lane || "",
      scores,
      series: scores.length ? scores.reduce((a, b) => a + b, 0) : null,
      notes: String(p.notes || "").trim(),
      type: p.patternType || "",
      length: p.length ?? null,
      ratio: p.ratio ?? null,
      volume: p.volume ?? null,
    });
  }

  return [...byPattern.entries()]
    .map(([name, entries]) => {
      const all = entries.flatMap(e => e.scores);
      const sorted = entries.slice()
        .sort((a, b) => String(b.date).localeCompare(String(a.date)));
      return {
        name,
        nights: entries.length,
        games: all.length,
        average: all.length ? Math.round(all.reduce((a, b) => a + b, 0) / all.length) : null,
        best: all.length ? Math.max(...all) : null,
        worst: all.length ? Math.min(...all) : null,
        // Newest first: what happened last time is what a bowler wants
        // before bowling on it again.
        entries: sorted,
        // Whether there is anything written down worth reading.
        hasNotes: entries.some(e => e.notes),
        type: sorted.find(e => e.type)?.type || "",
      };
    })
    // Most-bowled first, so a pattern seen once does not sit above the
    // house shot.
    .sort((a, b) => b.games - a.games || String(a.name).localeCompare(String(b.name)));
}

// How a pattern compares with everything else this bowler has bowled.
//
// An average of 172 means nothing on its own. "17 below your overall"
// is the sentence a bowler can act on.
export function patternVersusOverall(history, overallAverage) {
  // Number(null) is 0 and 0 is finite, so the obvious check passed with
  // no average at all -- and every pattern came back "+197 versus your
  // overall", comparing against zero. Same trap as badgeContext; it is
  // the most repeated bug in this codebase.
  if (overallAverage === null || overallAverage === undefined || overallAverage === "") return [];
  const overall = Number(overallAverage);
  if (!Number.isFinite(overall)) return [];
  return (Array.isArray(history) ? history : [])
    .filter(h => h && Number.isFinite(Number(h.average)))
    .map(h => ({ ...h, versusOverall: Math.round(Number(h.average) - overall) }));
}

// leagueDefaults: { [leagueName]: patternName } — the pattern a league is
// normally bowled on, set once on the league instead of re-entered every
// week.
//
// It exists because the per-night records could not reach most bowlers.
// lane_patterns rows only sync when the bowler is on a TEAM in that
// league (see syncLanePatternsToCloud: `if(row.team_id)`), so a solo
// league bowler entered a pattern, watched it save, and had it live in
// local storage only -- invisible to this function on any other device
// and gone when that device was replaced. A default on the league syncs
// like any other league column, so the comparison finally populates for
// bowlers who are not on a team.
//
// The per-night record still WINS wherever one exists. A league that
// rotates patterns -- PBA Experience, any sport league -- is the reason
// this is a default rather than a fixed property of the league.
// fallbackName: what to call a night that has neither a lane_patterns row
// nor a league default.
//
// Left off, such a night is DROPPED -- which is right for the Stats card,
// where naming a pattern nobody recorded would be inventing one.
//
// The lane card needs the opposite, because it has already made the call:
// its picker buckets every unrecorded night as the house shot, on the
// grounds that the house shot is precisely what nobody writes down. If
// the averages here quietly dropped those nights, the picker would offer
// "House" and the scoreline under it would have nothing to say -- and for
// a bowler who has never bowled a sport block, that is every night they
// own. So the caller that made that decision passes the name it used,
// and the two agree by construction rather than by coincidence.
export function patternAverages(sessions, lanePatterns, tournaments, bowler, leagueDefaults = {}, fallbackName = "") {
  const byPattern = new Map();

  function add(name, scores) {
    const clean = (Array.isArray(scores) ? scores : []).filter(v => Number.isFinite(v));
    if (!name || !clean.length) return;
    const key = String(name).trim();
    if (!key) return;
    if (!byPattern.has(key)) byPattern.set(key, []);
    byPattern.get(key).push(...clean);
  }

  // League nights, matched on the night they were bowled.
  const patternByNight = new Map();
  for (const p of (Array.isArray(lanePatterns) ? lanePatterns : [])) {
    if (!p?.patternName) continue;
    patternByNight.set(`${p.league}|${p.date}`, p.patternName);
  }
  const defaults = (leagueDefaults && typeof leagueDefaults === "object") ? leagueDefaults : {};
  for (const s of (Array.isArray(sessions) ? sessions : [])) {
    if (!s || (bowler && s.bowler !== bowler)) continue;
    // The night's own record first, the league's default second. Never
    // the other way round: a bowler who wrote down what they actually
    // bowled on has told us something the default is only guessing at.
    const name = patternByNight.get(`${s.league}|${s.date}`)
      || (typeof defaults[s.league] === "string" ? defaults[s.league].trim() : "")
      // Last, and only when the caller asked for it. See fallbackName.
      || String(fallbackName || "").trim();
    if (name) add(name, s.scores);
  }

  // Tournament days carry their own pattern.
  for (const t of (Array.isArray(tournaments) ? tournaments : [])) {
    if (!t || (bowler && t.bowler && t.bowler !== bowler)) continue;
    for (const d of (Array.isArray(t.days) ? t.days : [])) {
      const scores = (Array.isArray(d?.games) ? d.games : [])
        .map(g => Number(g?.score))
        .filter(v => Number.isFinite(v));
      add(d?.oilPattern, scores);
    }
  }

  return [...byPattern.entries()]
    .map(([name, scores]) => ({
      name,
      games: scores.length,
      average: Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10,
    }))
    .sort((a, b) => b.games - a.games);
}

// How long the pattern is that a league was most recently bowled on.
//
// The ball-path drawing needs to know where down the lane the ball has to
// turn. It used to ask the bowler for that distance per shot, which is not
// a thing anyone can judge by eye -- the breakpoint BOARD is something you
// watch the ball cross, the footage is a guess. The pattern length is what
// actually sets it, and it is already recorded once per night.
//
// Resolved in order: the bowler's own saved pattern (which carries a
// length), then the published spec for that name, newest year first.
// Returns null when the pattern is unknown or was never named, and the
// caller falls back to the 40-foot house default rather than inventing one.
export function patternLengthForLeague(lanePatterns, league, oilPatterns) {
  const nights = (Array.isArray(lanePatterns) ? lanePatterns : [])
    .filter(p => p && typeof p === "object" && p.patternName
      && (!league || p.league === league))
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
  if (!nights.length) return null;

  return patternLengthByName(nights[0].patternName, oilPatterns);
}

/**
 * How long a NAMED pattern is, from the catalogue rather than from a
 * night.
 *
 * Split out of patternLengthForLeague, which resolved a length for the
 * league's most recent named pattern and then had that length used for
 * every pattern on screen. Asking by name is the thing callers actually
 * want; asking by league was how one block's length leaked onto another.
 *
 * The bowler's own saved pattern first -- they may have been told the
 * real number at the desk -- then the published spec. Null when neither
 * knows, which is not a failure: the house shot has no published length
 * because nobody lays it to a sheet.
 */
export function patternLengthByName(name, oilPatterns) {
  const want = String(name || "").trim();
  if (!want) return null;

  const mine = (Array.isArray(oilPatterns) ? oilPatterns : [])
    .find(p => p && typeof p === "object"
      && String(p.name || "").trim().toLowerCase() === want.toLowerCase());
  const ownLength = Number(mine?.lengthFeet);
  if (Number.isFinite(ownLength) && ownLength > 0) return ownLength;

  // Published specs are keyed "Name|Year". Newest year wins: the same
  // animal is re-laid at a different length most seasons.
  const keys = Object.keys(VERIFIED_PATTERN_SPECS)
    .filter(k => k.split("|")[0].toLowerCase() === want.toLowerCase())
    .sort((a, b) => Number(b.split("|")[1] || 0) - Number(a.split("|")[1] || 0));
  if (!keys.length) return null;

  const spec = Number(VERIFIED_PATTERN_SPECS[keys[0]]?.lengthFeet);
  return Number.isFinite(spec) && spec > 0 ? spec : null;
}

/**
 * The selected pattern's scoring, and the rest ranked behind it.
 *
 * This is the old "By Oil Pattern" card folded into the lane card. It was
 * a standalone list of every pattern against the overall average; here
 * the pattern is already chosen -- it is the thing drawing the lines --
 * so the one you are looking at becomes the headline and the others
 * become the comparison you can open.
 *
 * Returns null when there is nothing worth a row:
 *
 *   - FEWER THAN TWO PATTERNS. With one, the pattern average and the
 *     overall average are computed from the same games, so the delta is
 *     the bowler's average compared against itself -- structurally near
 *     zero and not a fact about oil. The standalone card refused for the
 *     same reason and it still holds.
 *
 *   - NO SCORED GAMES ON THE SELECTED PATTERN. Shots can be logged
 *     without game scores, and the headline here IS the selected
 *     pattern's number. Without it there is no band, only a ranking of
 *     patterns that are not the one on screen.
 *
 * Others are ranked best-first, which is the order that answers "where
 * does this one sit" at a glance.
 */
export function patternScoreband(scores, selectedName) {
  const rows = (Array.isArray(scores) ? scores : [])
    .filter(r => r && typeof r === "object" && String(r.name || "").trim()
      && Number.isFinite(Number(r.average))
      && Number.isFinite(Number(r.versusOverall)));
  if (rows.length < 2) return null;

  const want = String(selectedName || "").trim();
  if (!want) return null;
  const here = rows.find(r => String(r.name).trim() === want);
  if (!here) return null;

  const others = rows.filter(r => r !== here)
    .sort((a, b) => Number(b.versusOverall) - Number(a.versusOverall));
  return { here, others };
}
