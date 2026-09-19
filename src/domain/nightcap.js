// Nightcap — what was true about ONE night that nobody noticed.
//
// The existing recaps are template-fillers: "185 average over 3 games --
// 12 above your average." True, useful, and it says the same shape of
// thing every week. A bowler stops reading it by the third night.
//
// This file computes the things a scorer never surfaces -- which side the
// leaves clustered on, what the opens actually cost, which ball was
// carrying -- as FACTS, deterministically, here, where they can be tested.
// The model that turns them into sentences never computes anything: it
// selects the two or three worth saying and says them in a human voice.
//
// That split is the whole design. A model asked to compute gets arithmetic
// wrong quietly; a model asked to choose and phrase cannot get a number
// wrong, because it was handed the number.
//
// WHAT THIS IS NOT
//
// It is not trend-spotting FROM ONE NIGHT. Three games and about thirty
// frames cannot support "you tend to" about anything, and a model given
// only tonight will still find a pattern in it if nothing stops it.
//
// The season is a different matter. Where this bowler has enough history
// in this league, tonight is stated ALONGSIDE the season figure and its
// sample, so a comparison is available to the model as a fact rather than
// as an inference it had to make. Those facts are gated by the same
// SAMPLE_THRESHOLDS table Insights uses -- no new thresholds were
// invented for this -- and behind a second gate of eight prior nights,
// because a rate computed from two long nights is not a season.
//
// Nothing here is ever phrased as a trend unless a supplied fact carries
// both numbers and both samples. The model is forbidden to subtract them
// itself.
//
// It is not diagnosis either. "Your leaves were on the right" is an
// observation. "You were coming up light" is a claim about a delivery
// nobody watched -- unless the bowler recorded the miss themselves, in
// which case it stops being a guess and becomes a fact, which is why
// recorded misses are collected separately below.

import {
  isSplit, isSinglePinLeave, isCornerPinLeave,
  leaveSide, splitKey, splitName,
} from "./splits.js";
import { SAMPLE_THRESHOLDS, meetsThreshold } from "./insightGating.js";

// Nights of history in this league before a season figure is offered at
// all, on top of whatever per-statistic threshold applies.
//
// trendOverTime is the existing table's own answer to "how many sessions
// before a claim spanning sessions is fair", and that is exactly the
// claim a season comparison makes. Reused rather than re-decided: a
// second opinion on the same question, held in a second place, is how
// two numbers end up disagreeing.
export const MIN_NIGHTS_FOR_SEASON = SAMPLE_THRESHOLDS.trendOverTime;

// Null ELEMENTS, not just a null list -- the convention every domain
// function here follows. A partial sync puts a null in the array and the
// first property access takes the screen down with it.
const rows = v => (Array.isArray(v) ? v : []).filter(x => x && typeof x === "object");

const clean = v => String(v ?? "").trim();

// A first ball is ball ONE whether it was stored as 1 or as null.
// Both forms are in the real data -- findExistingShotSlot documents 137
// nulls against 15 ones on one device -- and the scorer treats them as
// the same thing. This makes the third place agree.
const isFirstBall = s => !s.ballNum || Number(s.ballNum) === 1;

const pct = (n, d) => (d ? Math.round((n / d) * 100) : null);

// A night needs enough frames to say anything about. One game is the
// floor: below that, "two of your three leaves were on the right" is
// noise dressed as a finding, and saying nothing is the honest output.
export const MIN_FIRST_BALLS = 10;

// Tallies a list of strings into [{value, count}], commonest first.
function tally(values) {
  const counts = new Map();
  for (const v of values.map(clean).filter(Boolean)) {
    counts.set(v, (counts.get(v) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}

// Everything before tonight, for this bowler in this league.
//
// Excludes tonight explicitly rather than filtering on "< date": a night
// logged out of order, or a make-up game entered later, would otherwise
// be silently dropped from its own season or counted into it twice.
export function seasonShots(shots, { bowler, league, date }) {
  return rows(shots).filter(s =>
    clean(s.bowler) === clean(bowler) &&
    clean(s.league) === clean(league) &&
    clean(s.date) && clean(s.date) !== clean(date));
}

// One set of rates, computed one way.
//
// Tonight and the season go through this same function, so a comparison
// between them is a comparison of like with like. Two parallel
// implementations of "spare conversion" drift, and the first anyone knows
// of it is a card saying tonight beat a season average it was never
// measured against.
export function rateSet(shotList, leftHanded = false) {
  const list = rows(shotList);
  const firsts = list.filter(isFirstBall);
  const spareAttempts = list.filter(s => s.result !== "Strike" && clean(s.spareMade) !== "" && !isSplit(s));
  const singles = firsts.filter(isSinglePinLeave);
  const corners = firsts.filter(s => isCornerPinLeave(s, leftHanded));
  const sided = firsts.map(leaveSide).filter(v => v && v !== "center");
  return {
    nights: [...new Set(list.map(s => clean(s.date)).filter(Boolean))].length,
    firstBalls: firsts.length,
    strikes: firsts.filter(s => s.result === "Strike").length,
    spareAttempts: spareAttempts.length,
    sparesMade: spareAttempts.filter(s => clean(s.spareMade) === "Yes").length,
    singles: singles.length,
    singlesMade: singles.filter(s => clean(s.spareMade) === "Yes").length,
    corners: corners.length,
    cornersMade: corners.filter(s => clean(s.spareMade) === "Yes").length,
    sided: sided.length,
    sidedLeft: sided.filter(v => v === "left").length,
    sidedRight: sided.filter(v => v === "right").length,
  };
}

// The night's shots for one bowler, in one league, on one date.
//
// Filtered here rather than by the caller so every fact below is computed
// off the same set. The caller passing a pre-filtered list and this
// filtering again is harmless; the caller passing everything and this NOT
// filtering would quietly mix last week's league night into tonight.
export function nightShots(shots, { bowler, league, date }) {
  return rows(shots).filter(s =>
    clean(s.bowler) === clean(bowler) &&
    clean(s.league) === clean(league) &&
    clean(s.date) === clean(date));
}

// ── The facts ───────────────────────────────────────────────────────────
//
// Each fact is a complete English sentence carrying its own numbers and
// its own sample. That shape is deliberate: the model is given prose it
// may select from and rephrase, never fields it must assemble. There is
// no arrangement of these strings that produces a wrong number.
//
// A fact that isn't interesting is not emitted. "0 splits tonight" is
// true and worthless, and a list padded with non-events teaches the model
// that padding is expected.
export function nightcapFacts(shots, {
  bowler, league, date, leftHanded = false,
  scores = [], priorAverage = null, pinsLeftOnLane = null,
} = {}) {
  const mine = nightShots(shots, { bowler, league, date });
  const firsts = mine.filter(isFirstBall);
  const games = [...new Set(mine.map(s => clean(s.game)).filter(Boolean))]
    .sort((a, b) => Number(a) - Number(b));

  const out = { enough: false, firstBalls: firsts.length, games: games.length, facts: [] };
  if (firsts.length < MIN_FIRST_BALLS) return out;
  out.enough = true;

  const add = (id, text) => { if (text) out.facts.push({ id, text }); };

  // ── The night, in scores ──────────────────────────────────────────────
  const played = (Array.isArray(scores) ? scores : []).filter(v => typeof v === "number");
  if (played.length) {
    const total = played.reduce((a, b) => a + b, 0);
    const avg = Math.round(total / played.length);
    add("series", `Scores tonight: ${played.join(", ")} — ${total} series, ${avg} average over ${played.length} game${played.length === 1 ? "" : "s"}.`);
    if (typeof priorAverage === "number") {
      const diff = avg - Math.round(priorAverage);
      add("vsAverage", diff === 0
        ? `That is exactly their league average of ${Math.round(priorAverage)}.`
        : `That is ${Math.abs(diff)} ${diff > 0 ? "above" : "below"} their league average of ${Math.round(priorAverage)}.`);
    }
  }

  // ── Strikes and what the first ball left ──────────────────────────────
  const strikes = firsts.filter(s => s.result === "Strike").length;
  add("strikes", `${strikes} strikes on ${firsts.length} first balls (${pct(strikes, firsts.length)}%).`);

  // ── Spares ────────────────────────────────────────────────────────────
  // Splits excluded from the conversion rate, matching computeSessionStats
  // and every other spare figure in the app. A bowler who left four
  // 7-10s should not read as having a spare problem.
  const spareAttempts = mine.filter(s => s.result !== "Strike" && clean(s.spareMade) !== "" && !isSplit(s));
  const sparesMade = spareAttempts.filter(s => clean(s.spareMade) === "Yes");
  if (spareAttempts.length) {
    add("spares", `${sparesMade.length} of ${spareAttempts.length} makeable spares converted (${pct(sparesMade.length, spareAttempts.length)}%), splits excluded.`);
  }

  const singles = firsts.filter(isSinglePinLeave);
  const singlesMade = singles.filter(s => clean(s.spareMade) === "Yes");
  if (singles.length >= 3) {
    add("singlePins", `${singlesMade.length} of ${singles.length} single-pin spares made.`);
  }

  const corners = firsts.filter(s => isCornerPinLeave(s, leftHanded));
  const cornersMade = corners.filter(s => clean(s.spareMade) === "Yes");
  if (corners.length >= 2) {
    const pin = leftHanded ? "7" : "10";
    add("cornerPin", `The ${pin} pin was left ${corners.length} times and made ${cornersMade.length} of them.`);
  }

  // ── Splits ────────────────────────────────────────────────────────────
  const splits = mine.filter(isSplit);
  if (splits.length) {
    const made = splits.filter(s => clean(s.spareMade) === "Yes").length;
    const named = tally(splits.map(s => splitName(splitKey(s)))).slice(0, 3)
      .map(t => t.count > 1 ? `${t.value} (${t.count})` : t.value);
    add("splits", `${splits.length} split${splits.length === 1 ? "" : "s"} tonight, ${made} converted${named.length ? ` — ${named.join(", ")}` : ""}.`);
  }

  // ── What the opens cost, in pins ──────────────────────────────────────
  //
  // Taken from the theoretical score the app already computes and already
  // shows on this same card, rather than recomputed here. Two numbers on
  // one screen that disagree because they were derived twice is worse
  // than either number being absent.
  if (typeof pinsLeftOnLane === "number" && pinsLeftOnLane > 0) {
    add("pinsLeft", `${pinsLeftOnLane} pins were left on the lane: that is the gap between the series bowled and what it would have been with every makeable spare converted.`);
  }

  // ── Which side the leaves were on ─────────────────────────────────────
  //
  // The fact a scorer never tells you. Reported as a physical side and
  // nothing more -- which miss produces which side depends on the hand,
  // the line and the lane, and asserting one from a pin count is the kind
  // of invented cause this app refuses everywhere else.
  const sided = firsts
    .map(s => ({ s, side: leaveSide(s) }))
    .filter(x => x.side && x.side !== "center");
  if (sided.length >= 4) {
    const left = sided.filter(x => x.side === "left").length;
    const right = sided.filter(x => x.side === "right").length;
    const both = sided.filter(x => x.side === "both").length;
    const parts = [];
    if (left) parts.push(`${left} entirely on the left`);
    if (right) parts.push(`${right} entirely on the right`);
    if (both) parts.push(`${both} across both sides`);
    add("leaveSide", `Of ${sided.length} leaves with a side to them: ${parts.join(", ")}. The bowler is ${leftHanded ? "left" : "right"}-handed.`);

    // Where in the night the skew sat. This is the part that supports
    // "earlier next time" -- a skew that only appears in game three is a
    // different night from one that was there from the first frame.
    if (games.length > 1 && (left >= 3 || right >= 3)) {
      const perGame = games.map(g => {
        const inGame = sided.filter(x => clean(x.s.game) === g);
        const l = inGame.filter(x => x.side === "left").length;
        const r = inGame.filter(x => x.side === "right").length;
        return `G${g}: ${l}L/${r}R`;
      });
      add("leaveSideByGame", `Left/right leaves by game — ${perGame.join(", ")}.`);
    }
  }

  // ── Misses the bowler recorded themselves ─────────────────────────────
  //
  // The only causal data in the record. Everything else here is an
  // outcome; this is the bowler's own account of what they did, so it is
  // the one place a nudge can stop being conditional.
  const misses = tally(mine.flatMap(s => Array.isArray(s.miss) ? s.miss : s.miss ? [s.miss] : []));
  const missTotal = misses.reduce((a, m) => a + m.count, 0);
  if (missTotal >= 3) {
    add("misses", `Misses the bowler logged themselves: ${misses.map(m => `${m.value} ${m.count}`).join(", ")} (${missTotal} recorded).`);
  }

  // ── How the strikes came ──────────────────────────────────────────────
  const shapes = tally(firsts.map(s => s.strikeDescription));
  const shapeTotal = shapes.reduce((a, m) => a + m.count, 0);
  if (shapeTotal >= 3) {
    add("strikeShape", `Strike hits described: ${shapes.map(m => `${m.value} ${m.count}`).join(", ")} (${shapeTotal} described).`);
  }

  // ── Ball by ball ──────────────────────────────────────────────────────
  //
  // Only when two balls both saw a real share of the night. Five first
  // balls against thirty is not a comparison, and offered as one it
  // becomes "your spare ball isn't striking".
  const byBall = {};
  for (const s of firsts) {
    const b = clean(s.ball);
    if (!b) continue;
    const e = byBall[b] || (byBall[b] = { ball: b, firsts: 0, strikes: 0 });
    e.firsts += 1;
    if (s.result === "Strike") e.strikes += 1;
  }
  const comparable = Object.values(byBall).filter(b => b.firsts >= 6);
  if (comparable.length >= 2) {
    const line = comparable
      .sort((a, b) => b.firsts - a.firsts)
      .map(b => `${b.ball}: ${b.strikes} strikes on ${b.firsts} first balls`)
      .join("; ");
    add("byBall", `Balls thrown tonight — ${line}. These are one night's samples and small.`);
  }

  // ── Game by game ──────────────────────────────────────────────────────
  if (games.length > 1) {
    const line = games.map(g => {
      const inGame = firsts.filter(s => clean(s.game) === g);
      const st = inGame.filter(s => s.result === "Strike").length;
      return `G${g}: ${st} strikes on ${inGame.length} first balls`;
    }).join("; ");
    add("byGame", `Strikes by game — ${line}.`);
  }

  // ── The season this night sits in ─────────────────────────────────────
  //
  // Only where the history actually supports it. Each line carries BOTH
  // figures and BOTH samples, because that is what makes the comparison a
  // fact the model may repeat rather than arithmetic it has to do -- and
  // arithmetic is the one thing it is not allowed to do here.
  //
  // Gated twice: eight prior nights in this league, and then the same
  // per-statistic threshold Insights uses. A bowler four weeks into a
  // season gets tonight and nothing else, which is correct -- there is no
  // season yet to compare against.
  const prior = rateSet(seasonShots(shots, { bowler, league, date }), leftHanded);
  out.seasonNights = prior.nights;
  out.hasSeason = prior.nights >= MIN_NIGHTS_FOR_SEASON;

  if (out.hasSeason) {
    if (meetsThreshold("overallStrikeRate", prior.firstBalls)) {
      add("seasonStrikes", `Season so far in this league: ${pct(prior.strikes, prior.firstBalls)}% strikes on ${prior.firstBalls} first balls across ${prior.nights} nights. Tonight was ${pct(strikes, firsts.length)}% on ${firsts.length}.`);
    }
    if (spareAttempts.length && meetsThreshold("spareConversion", prior.spareAttempts)) {
      add("seasonSpares", `Season spare conversion: ${pct(prior.sparesMade, prior.spareAttempts)}% on ${prior.spareAttempts} attempts. Tonight was ${pct(sparesMade.length, spareAttempts.length)}% on ${spareAttempts.length}.`);
    }
    if (singles.length >= 3 && meetsThreshold("singlePinSpares", prior.singles)) {
      add("seasonSinglePins", `Season single-pin spares: ${pct(prior.singlesMade, prior.singles)}% on ${prior.singles}. Tonight was ${pct(singlesMade.length, singles.length)}% on ${singles.length}.`);
    }
    if (corners.length >= 2 && meetsThreshold("cornerPinSpares", prior.corners)) {
      const pin = leftHanded ? "7" : "10";
      add("seasonCornerPin", `Season ${pin} pin: left ${prior.corners} times, made ${pct(prior.cornersMade, prior.corners)}%. Tonight: left ${corners.length}, made ${cornersMade.length}.`);
    }
    // Where the leaves usually sit, against where they sat tonight. The
    // most useful season line in here, and the one the scoresheet has
    // never been able to show: a bowler whose leaves are normally even
    // and were all on one side tonight learns something real, and one
    // whose leaves are always on that side learns that tonight was
    // ordinary -- which is equally worth knowing and saves a pointless
    // adjustment.
    //
    // Gated on specificLeave: this is a rate at a class of leave, which
    // is what that threshold is for.
    if (sided.length >= 4 && meetsThreshold("specificLeave", prior.sided)) {
      const tl = sided.filter(x => x.side === "left").length;
      const tr = sided.filter(x => x.side === "right").length;
      add("seasonLeaveSide", `Season leaves with a side: ${pct(prior.sidedLeft, prior.sided)}% left / ${pct(prior.sidedRight, prior.sided)}% right on ${prior.sided} leaves. Tonight: ${pct(tl, sided.length)}% left / ${pct(tr, sided.length)}% right on ${sided.length}.`);
    }
  }

  return out;
}

// What actually goes over the wire.
//
// Capped, because the far end is billed per token and because a payload
// that can grow without limit is a payload someone can grow on purpose.
// The cap is generous against a real night, so trimming means something
// has gone wrong rather than that a bowler had a long night.
//
// The edge function refuses more than 16 facts and more than 4,000
// characters. These sit below both on purpose: a client and a server that
// agree exactly have no margin, and the first fact added later would be
// refused by a check nobody remembered was there.
export const MAX_FACTS = 15;
export const MAX_FACT_CHARS = 240;
export const MAX_PAYLOAD_CHARS = 3000;

// One line, no control characters, bounded length.
//
// Every fact this file produces is already a single sentence, so this
// changes nothing about normal output. It exists because a fact is prose
// that ends up inside a prompt, and prose that reaches a prompt with
// newlines in it is the shape every prompt-injection attempt takes. A
// bowler's ball name and league name both reach these strings and both
// are free text they typed.
//
// The server checks the same thing again rather than trusting this. This
// is here so the client never SENDS something the server would refuse --
// a rejection the bowler could do nothing about.
function oneLine(text) {
  return String(text ?? "")
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001f\u007f]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_FACT_CHARS);
}

// A stable 32-bit hash of the facts, so the cache can tell one night's
// nightcap from the same night re-computed after an edit.
//
// Not for security -- it is a change detector. Without it a bowler who
// fixed a mis-logged frame would keep seeing the nightcap written from
// the wrong frame, with no way to know it was stale and no way to clear
// it. FNV-1a: small, no dependency, and good enough to notice a
// character changing.
export function factsFingerprint(facts) {
  let h = 0x811c9dc5;
  const s = (Array.isArray(facts) ? facts : []).join("\u0001");
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36);
}

export function nightcapPayload(shots, opts = {}) {
  const computed = nightcapFacts(shots, opts);
  if (!computed.enough) return null;

  // Season lines are kept whatever else goes.
  //
  // They are computed last and so sit at the end of the list, which meant
  // a flat slice dropped them first -- and dropped them hardest for the
  // bowler with the most history, whose night produces the most other
  // facts too. That is exactly backwards: a season figure took months to
  // earn and is the only thing here that a single night cannot say.
  const season = computed.facts.filter(f => f.id.startsWith("season")).map(f => oneLine(f.text));
  const tonight = computed.facts.filter(f => !f.id.startsWith("season")).map(f => oneLine(f.text));
  const room = Math.max(0, MAX_FACTS - season.length);

  const payload = {
    firstBalls: computed.firstBalls,
    games: computed.games,
    // Whether any fact below carries a season figure. The prompt reads
    // this to know whether comparison language is available at all -- it
    // is not allowed to reach for it on a night that has none.
    hasSeason: season.length > 0,
    seasonNights: computed.seasonNights ?? 0,
    facts: [...tonight.slice(0, room), ...season],
  };

  if (JSON.stringify(payload).length > MAX_PAYLOAD_CHARS) {
    payload.facts = [...tonight.slice(0, Math.max(0, 8 - season.length)), ...season];
  }
  payload.fingerprint = factsFingerprint(payload.facts);
  return payload;
}
