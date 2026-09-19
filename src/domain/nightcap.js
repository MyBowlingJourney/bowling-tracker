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
// It is not trend-spotting. One night is three games and about thirty
// frames -- nowhere near enough to support "you tend to" about anything,
// and Insights already does the across-seasons work with proper sample
// gating. Every fact here is scoped to tonight and phrased as tonight.
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

  return out;
}

// What actually goes over the wire.
//
// Capped, because the far end is billed per token and because a payload
// that can grow without limit is a payload someone can grow on purpose.
// The cap is generous against a real night -- twelve facts of a hundred
// characters -- so trimming means something has gone wrong, not that a
// bowler had a long night.
export const MAX_FACTS = 12;
export const MAX_PAYLOAD_CHARS = 2400;

export function nightcapPayload(shots, opts = {}) {
  const computed = nightcapFacts(shots, opts);
  if (!computed.enough) return null;
  const facts = computed.facts.slice(0, MAX_FACTS).map(f => f.text);
  const payload = {
    firstBalls: computed.firstBalls,
    games: computed.games,
    facts,
  };
  if (JSON.stringify(payload).length > MAX_PAYLOAD_CHARS) {
    payload.facts = payload.facts.slice(0, 8);
  }
  return payload;
}
