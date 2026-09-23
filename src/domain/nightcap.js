// Nightcap — what was true about ONE night that nobody noticed.
//
// The existing recaps are template-fillers: "185 average over 3 games --
// 12 above your average." True, useful, and it says the same shape of
// thing every week. A bowler stops reading it by the third night.
//
// This file computes the things a scorer never surfaces -- which side the
// leaves clustered on, what the opens actually cost, which ball was
// carrying -- as NUMBERS, deterministically, here, where they can be
// tested. The edge function turns those numbers into sentences from its
// own fixed templates, and the model that chooses between the sentences
// never computes anything.
//
// WHY NUMBERS AND NOT SENTENCES
//
// This file used to emit finished prose, which the function passed
// straight into the prompt. That prose contained free text the bowler had
// typed -- ball names, league names -- and prose that reaches a prompt is
// prose an attacker can write. Sanitising it only ever narrows the hole.
//
// So the wire format carries no sentences at all: an id from a closed
// set, and numbers. The server owns every word of structure, which means
// a caller who skips the client entirely cannot put a sentence in front
// of the model -- there is no field for one. See
// supabase/functions/nightcap/render.ts, which is the only place these
// become English.
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
// It is not diagnosis either. "Your leaves were on the right" is an
// observation. "You were coming up light" is a claim about a delivery
// nobody watched -- unless the bowler recorded the miss themselves, in
// which case it stops being a guess and becomes a fact, which is why
// recorded misses are collected separately below.

import {
  isSplit, isSinglePinLeave, isCornerPinLeave,
  leaveSide, splitKey,
} from "./splits.js";
import { SAMPLE_THRESHOLDS, meetsThreshold } from "./insightGating.js";
import { hungCounts, handUpCounts } from "./stats.js";

// Nights of history in this league before a season figure is offered at
// all, on top of whatever per-statistic threshold applies.
//
// trendOverTime is the existing table's own answer to "how many sessions
// before a claim spanning sessions is fair", and that is exactly the
// claim a season comparison makes. Reused rather than re-decided: a
// second opinion on the same question, held in a second place, is how two
// numbers end up disagreeing.
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

// The one piece of bowler-typed text that still travels.
//
// A ball name has to, or the nightcap can only say "your other ball",
// which is no use to someone with five in the bag. Everything else on the
// wire is a number or a value from a closed set.
//
// So it is narrowed as far as it can go without becoming useless:
// letters, digits, spaces and the handful of marks that appear in real
// ball names ("Phaze II", "IQ Tour Emerald", "Hy-Road"), capped at forty
// characters. No newlines, no colons, no brackets, nothing that could end
// a sentence and start an instruction. The server applies the identical
// rule rather than trusting this one; this is here so the client never
// sends something the server would drop.
export const MAX_BALL_NAME = 40;
export const MAX_BALL_WORDS = 5;

export function safeBallName(name) {
  return String(name ?? "")
    .replace(/[^A-Za-z0-9 .'&+/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_BALL_NAME)
    .split(" ")
    .slice(0, MAX_BALL_WORDS)
    .join(" ")
    .trim();
}

// Teammates' names -- the second piece of typed text that travels, for
// the team facts below. "Sam got hung twice" is the whole joke; "a
// teammate got hung twice" isn't one.
//
// Tighter than a ball name, because a name has fewer legitimate shapes:
// letters, spaces, apostrophes, dots and hyphens ("O'Neil", "J.R.",
// "Mary-Kate"), twenty-four characters, three words. No digits, no
// slashes, nothing that ends a sentence. render.ts applies the same rule.
export const MAX_PERSON_NAME = 24;
export const MAX_PERSON_WORDS = 3;

export function safePersonName(name) {
  return String(name ?? "")
    .replace(/[^A-Za-z .'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_PERSON_NAME)
    .split(" ")
    .slice(0, MAX_PERSON_WORDS)
    .join(" ")
    .trim();
}

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
// Each fact is an id from a closed set plus the numbers that go with it.
// The id chooses the server's sentence; the numbers fill its blanks.
// There is no field here that becomes structure, which is the whole point
// -- see the header.
//
// A fact that isn't interesting is not emitted. "0 splits tonight" is
// true and worthless, and a list padded with non-events teaches the model
// that padding is expected.
export function nightcapFacts(shots, {
  bowler, league, date, leftHanded = false,
  scores = [], priorAverage = null, pinsLeftOnLane = null,
  // What else happened at this event: the cut, match play, the
  // stepladder, side action, and where it finished. Null for a league
  // night, which has none of them.
  //
  // Handed in already computed rather than derived here: every one of
  // these lives in the tournament record, not in the shots, and this
  // file only ever sees shots.
  tournament = null,
} = {}) {
  const mine = nightShots(shots, { bowler, league, date });
  const firsts = mine.filter(isFirstBall);
  const games = [...new Set(mine.map(s => clean(s.game)).filter(Boolean))]
    .sort((a, b) => Number(a) - Number(b));

  const out = { enough: false, firstBalls: firsts.length, games: games.length, facts: [] };
  if (firsts.length < MIN_FIRST_BALLS) return out;
  out.enough = true;

  const hand = leftHanded ? "left" : "right";
  const add = (id, data) => out.facts.push({ id, ...data });

  // ── The night, in scores ──────────────────────────────────────────────
  const played = (Array.isArray(scores) ? scores : []).filter(v => typeof v === "number");
  if (played.length) {
    const total = played.reduce((a, b) => a + b, 0);
    const avg = Math.floor(total / played.length);
    add("series", { scores: played, total, avg, games: played.length });
    if (typeof priorAverage === "number") {
      const seasonAvg = Math.floor(priorAverage);
      add("vsAverage", { avg, seasonAvg, diff: avg - seasonAvg });
    }
  }

  // ── Strikes and what the first ball left ──────────────────────────────
  const strikes = firsts.filter(s => s.result === "Strike").length;
  add("strikes", { strikes, firstBalls: firsts.length, pct: pct(strikes, firsts.length) });

  // ── Spares ────────────────────────────────────────────────────────────
  // Splits excluded from the conversion rate, matching computeSessionStats
  // and every other spare figure in the app. A bowler who left four
  // 7-10s should not read as having a spare problem.
  const spareAttempts = mine.filter(s => s.result !== "Strike" && clean(s.spareMade) !== "" && !isSplit(s));
  const sparesMade = spareAttempts.filter(s => clean(s.spareMade) === "Yes");
  if (spareAttempts.length) {
    add("spares", {
      made: sparesMade.length, attempts: spareAttempts.length,
      pct: pct(sparesMade.length, spareAttempts.length),
    });
  }

  const singles = firsts.filter(isSinglePinLeave);
  const singlesMade = singles.filter(s => clean(s.spareMade) === "Yes");
  if (singles.length >= 3) {
    add("singlePins", { made: singlesMade.length, attempts: singles.length });
  }

  const corners = firsts.filter(s => isCornerPinLeave(s, leftHanded));
  const cornersMade = corners.filter(s => clean(s.spareMade) === "Yes");
  if (corners.length >= 2) {
    add("cornerPin", { pin: leftHanded ? 7 : 10, left: corners.length, made: cornersMade.length });
  }

  // ── Splits ────────────────────────────────────────────────────────────
  //
  // Sent as pin keys ("7-10", "3-10"), not names. splitName would put a
  // free-text table on the wire for no gain: "a 3-10" reads at least as
  // well as "a Baby split" and is clearer to anyone who doesn't use the
  // nickname. The server validates the shape as digits and dashes, so
  // there is nothing here that could be anything else.
  const splits = mine.filter(isSplit);
  if (splits.length) {
    const made = splits.filter(s => clean(s.spareMade) === "Yes").length;
    const types = tally(splits.map(s => splitKey(s)))
      .filter(t => /^\d{1,2}(-\d{1,2})*$/.test(t.value))
      .slice(0, 3)
      .map(t => ({ key: t.value, count: t.count }));
    add("splits", { count: splits.length, converted: made, types });
  }

  // ── The team's night ──────────────────────────────────────────────────
  //
  // Who got hung and who missed a lone 5 (hand up -- that's a round
  // owed). Team banter, and the part of the night the bowler will
  // actually repeat on the way out.
  //
  // Every bowler in this league on this date, not just this one: being
  // hung is only defined against teammates' frames. Only emitted when
  // someone actually did it -- "nobody got hung" is a non-event -- and
  // only once at least two bowlers have logged tonight, since a
  // teammate who hasn't logged yet can't have been hung.
  //
  // `you` marks this bowler's own entry so the server can say "you"
  // rather than their name back to them.
  const tonightAll = rows(shots).filter(s =>
    clean(s.league) === clean(league) && clean(s.date) === clean(date));
  const teamSize = new Set(tonightAll.map(s => clean(s.bowler)).filter(Boolean)).size;
  if (teamSize >= 2) {
    const ranked = counts => Object.entries(counts)
      .filter(([, n]) => n > 0)
      .map(([name, n]) => ({ name: safePersonName(name), count: n, you: clean(name) === clean(bowler) }))
      .filter(e => e.name)
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    const hung = ranked(hungCounts(tonightAll, league)).slice(0, 3);
    if (hung.length) add("teamHung", { bowlers: hung });
    const handUp = ranked(handUpCounts(tonightAll, league)).slice(0, 6);
    if (handUp.length) add("handUp", { bowlers: handUp });
  }

  // ── What the opens cost, in pins ──────────────────────────────────────
  //
  // Taken from the theoretical score the app already computes and already
  // shows on this same card, rather than recomputed here. Two numbers on
  // one screen that disagree because they were derived twice is worse
  // than either number being absent.
  if (typeof pinsLeftOnLane === "number" && pinsLeftOnLane > 0) {
    add("pinsLeft", { pins: Math.round(pinsLeftOnLane) });
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
    add("leaveSide", { total: sided.length, left, right, both, hand });

    // Where in the night the skew sat. This is the part that supports
    // "earlier next time" -- a skew that only appears in game three is a
    // different night from one that was there from the first frame.
    if (games.length > 1 && (left >= 3 || right >= 3)) {
      add("leaveSideByGame", {
        games: games.slice(0, 12).map(g => {
          const inGame = sided.filter(x => clean(x.s.game) === g);
          return {
            game: Number(g) || 0,
            left: inGame.filter(x => x.side === "left").length,
            right: inGame.filter(x => x.side === "right").length,
          };
        }),
      });
    }
  }

  // ── Misses the bowler recorded themselves ─────────────────────────────
  //
  // The only causal data in the record. Everything else here is an
  // outcome; this is the bowler's own account of what they did, so it is
  // the one place a nudge can stop being conditional.
  //
  // Values come from the MISSES list and the server checks them against
  // its own copy of it, so a hand-edited record cannot put a word here
  // that the app never offered.
  const misses = tally(mine.flatMap(s => Array.isArray(s.miss) ? s.miss : s.miss ? [s.miss] : []));
  const missTotal = misses.reduce((a, m) => a + m.count, 0);
  if (missTotal >= 3) {
    add("misses", { total: missTotal, items: misses.slice(0, 5) });
  }

  // ── How the strikes came ──────────────────────────────────────────────
  //
  // Stored values stay canonical for both hands ("Trip 4" is recorded for
  // a lefty who tapped "Trip 6"), which is why the hand travels with
  // them: the server mirrors them back for display exactly as the UI
  // does, rather than the two disagreeing about what the bowler saw.
  const shapes = tally(firsts.map(s => s.strikeDescription));
  const shapeTotal = shapes.reduce((a, m) => a + m.count, 0);
  if (shapeTotal >= 3) {
    add("strikeShape", { total: shapeTotal, hand, items: shapes.slice(0, 5) });
  }

  // ── Ball by ball ──────────────────────────────────────────────────────
  //
  // Only when two balls both saw a real share of the night. Five first
  // balls against thirty is not a comparison, and offered as one it
  // becomes "your spare ball isn't striking".
  const byBall = {};
  for (const s of firsts) {
    const b = safeBallName(s.ball);
    if (!b) continue;
    const e = byBall[b] || (byBall[b] = { ball: b, firstBalls: 0, strikes: 0 });
    e.firstBalls += 1;
    if (s.result === "Strike") e.strikes += 1;
  }
  const comparable = Object.values(byBall).filter(b => b.firstBalls >= 6);
  if (comparable.length >= 2) {
    add("byBall", {
      balls: comparable.sort((a, b) => b.firstBalls - a.firstBalls).slice(0, 4),
    });
  }

  // ── Game by game ──────────────────────────────────────────────────────
  if (games.length > 1) {
    add("byGame", {
      games: games.slice(0, 12).map(g => {
        const inGame = firsts.filter(s => clean(s.game) === g);
        return {
          game: Number(g) || 0,
          strikes: inGame.filter(s => s.result === "Strike").length,
          firstBalls: inGame.length,
        };
      }),
    });
  }

  // ── The season this night sits in ─────────────────────────────────────
  //
  // Only where the history actually supports it. Each fact carries BOTH
  // figures and BOTH samples, because that is what lets the server state
  // the comparison outright rather than leaving arithmetic to the model
  // -- and arithmetic is the one thing it is not allowed to do here.
  //
  // Gated twice: eight prior nights in this league, and then the same
  // per-statistic threshold Insights uses. A bowler four weeks into a
  // season gets tonight and nothing else, which is correct -- there is no
  // season yet to compare against.
  // ── The rest of the event ─────────────────────────────────────────────
  //
  // A tournament block is not the whole story: a bowler who shot 1230,
  // made the cut by 40, went 4-2 in match play and lost the ladder's
  // first step has had a day, and a read-back covering only the first of
  // those describes the least interesting part of it.
  //
  // Numbers only. Opponent names never reach the payload -- they are
  // somebody else's name in a prompt, for no gain.
  if (tournament && typeof tournament === "object") {
    const n = v => (typeof v === "number" && Number.isFinite(v) ? Math.round(v) : null);

    const cut = n(tournament.cutMargin);
    if (cut !== null) add("eventCut", { margin: cut, made: cut >= 0 });

    const mp = tournament.matchPlay;
    if (mp && n(mp.played) > 0) {
      add("eventMatchPlay", {
        played: n(mp.played), wins: n(mp.wins) ?? 0, losses: n(mp.losses) ?? 0,
        ties: n(mp.ties) ?? 0, bonusPins: n(mp.bonusPins) ?? 0,
        total: n(mp.total), average: n(mp.average),
        pinDiff: n(mp.pinDiff),
      });
    }

    const sl = tournament.stepladder;
    if (sl && n(sl.played) > 0) {
      add("eventStepladder", {
        played: n(sl.played), wins: n(sl.wins) ?? 0, losses: n(sl.losses) ?? 0,
        seed: n(sl.seed), place: n(sl.place),
      });
    }

    const side = tournament.sidePots;
    if (side && n(side.count) > 0) {
      add("eventSide", {
        entries: n(side.count), cost: n(side.cost) ?? 0,
        won: n(side.won) ?? 0, net: n(side.net) ?? 0,
      });
    }

    if (typeof tournament.placement === "string" && tournament.placement) {
      add("eventFinish", { placement: tournament.placement });
    }
  }

  const prior = rateSet(seasonShots(shots, { bowler, league, date }), leftHanded);
  out.seasonNights = prior.nights;
  out.hasSeason = prior.nights >= MIN_NIGHTS_FOR_SEASON;

  if (out.hasSeason) {
    if (meetsThreshold("overallStrikeRate", prior.firstBalls)) {
      add("seasonStrikes", {
        seasonPct: pct(prior.strikes, prior.firstBalls), seasonFirstBalls: prior.firstBalls,
        seasonNights: prior.nights,
        tonightPct: pct(strikes, firsts.length), tonightFirstBalls: firsts.length,
      });
    }
    if (spareAttempts.length && meetsThreshold("spareConversion", prior.spareAttempts)) {
      add("seasonSpares", {
        seasonPct: pct(prior.sparesMade, prior.spareAttempts), seasonAttempts: prior.spareAttempts,
        tonightPct: pct(sparesMade.length, spareAttempts.length), tonightAttempts: spareAttempts.length,
      });
    }
    if (singles.length >= 3 && meetsThreshold("singlePinSpares", prior.singles)) {
      add("seasonSinglePins", {
        seasonPct: pct(prior.singlesMade, prior.singles), seasonAttempts: prior.singles,
        tonightPct: pct(singlesMade.length, singles.length), tonightAttempts: singles.length,
      });
    }
    if (corners.length >= 2 && meetsThreshold("cornerPinSpares", prior.corners)) {
      add("seasonCornerPin", {
        pin: leftHanded ? 7 : 10,
        seasonLeft: prior.corners, seasonPct: pct(prior.cornersMade, prior.corners),
        tonightLeft: corners.length, tonightMade: cornersMade.length,
      });
    }
    // Where the leaves usually sit, against where they sat tonight. The
    // most useful season fact in here, and the one the scoresheet has
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
      add("seasonLeaveSide", {
        seasonLeftPct: pct(prior.sidedLeft, prior.sided), seasonRightPct: pct(prior.sidedRight, prior.sided),
        seasonTotal: prior.sided,
        tonightLeftPct: pct(tl, sided.length), tonightRightPct: pct(tr, sided.length),
        tonightTotal: sided.length,
      });
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
export const MAX_PAYLOAD_CHARS = 3000;

// A stable hash of the facts, so the cache can tell one night's nightcap
// from the same night recomputed after an edit.
//
// Not for security -- it is a change detector. Without it a bowler who
// fixed a mis-logged frame would keep seeing the nightcap written from
// the wrong frame, with no way to know it was stale and no way to clear
// it. FNV-1a over UTF-8 bytes: small, no dependency, and identical on
// every platform regardless of how a name is encoded.
export function factsFingerprint(facts) {
  let h = 0x811c9dc5;
  const text = JSON.stringify(Array.isArray(facts) ? facts : []);
  // TextEncoder rather than per-character codes: it hashes the bytes that
  // actually travel, so two devices cannot disagree about a name with an
  // accent in it -- and it keeps this loop free of the string-method call
  // that the data-flow audit reads as a field nothing ever writes.
  const bytes = new TextEncoder().encode(text);
  for (let i = 0; i < bytes.length; i++) {
    h ^= bytes[i];
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36);
}

export function nightcapPayload(shots, opts = {}) {
  const computed = nightcapFacts(shots, opts);
  if (!computed.enough) return null;

  // Season facts are kept whatever else goes.
  //
  // They are computed last and so sit at the end of the list, which meant
  // a flat slice dropped them first -- and dropped them hardest for the
  // bowler with the most history, whose night produces the most other
  // facts too. That is exactly backwards: a season figure took months to
  // earn and is the only thing here that a single night cannot say.
  // Event facts are kept for the same reason season facts are: they say
  // what the day WAS. A block's spare percentage is worth less than the
  // fact that the bowler won the thing.
  const keep = f => f.id.startsWith("season") || f.id.startsWith("event");
  const season = computed.facts.filter(keep);
  const tonight = computed.facts.filter(f => !keep(f));
  const room = Math.max(0, MAX_FACTS - season.length);

  const payload = {
    // League night or tournament block, so the server can word it right.
    // Two values only; anything else is a league night.
    event: opts?.event === "tournament" ? "tournament" : "league",
    firstBalls: computed.firstBalls,
    games: computed.games,
    // Whether any fact below carries a season figure. The prompt reads
    // this to know whether comparison language is available at all -- it
    // is not allowed to reach for it on a night that has none.
    hasSeason: season.some(f => f.id.startsWith("season")),
    seasonNights: computed.seasonNights ?? 0,
    facts: [...tonight.slice(0, room), ...season],
  };

  if (JSON.stringify(payload).length > MAX_PAYLOAD_CHARS) {
    payload.facts = [...tonight.slice(0, Math.max(0, 8 - season.length)), ...season];
  }
  payload.fingerprint = factsFingerprint(payload.facts);
  return payload;
}
