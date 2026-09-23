// The only place a nightcap fact becomes English.
//
// THIS FILE IS THE SECURITY BOUNDARY. Everything above it is numbers.
//
// The client sends an id from a closed set and a handful of numbers. This
// picks the sentence and fills the blanks. A caller who skips the client
// and posts whatever they like still cannot put a sentence in front of
// the model, because the wire format has no field that becomes one -- an
// unknown id is dropped, a number that is not a number is dropped, and a
// value outside its enum is dropped.
//
// The earlier version of this feature sent finished prose and sanitised
// it on arrival. Sanitising narrows a hole; it does not close one. This
// closes it, at the cost of a template per fact, which is the trade worth
// making for text that ends up inside a prompt.
//
// ONE EXCEPTION, NAMED
//
// Ball names travel as text, because "your other ball" is no use to
// somebody with five in the bag. They are the only bowler-typed bytes
// that reach the model, and they are held to an allowlist of the
// characters that appear in real ball names, capped at forty. No
// newlines, no colons, no brackets, no sentence-ending punctuation. The
// same rule runs on the client so it never sends something this drops.
//
// No imports on purpose: this runs under Deno inside the edge function
// and under vitest from src/domain/nightcapRender.test.js, and anything
// imported here would have to satisfy both.

// ── Value checks ────────────────────────────────────────────────────────

// A whole number inside a plausible range, or null.
//
// Range, not just type. "strikes: 1e9" is a finite number and would make
// a sentence that is nonsense, and a payload of enormous integers is a
// cheap way to inflate a prompt.
function int(v: unknown, min: number, max: number): number | null {
  // typeof, not Number(). Number(null), Number(""), Number([]) and
  // Number(false) are all 0 -- so a fact with a field missing rendered
  // as a confident "0 strikes on 30 first balls", which is worse than
  // no sentence: it is a wrong number stated with the same certainty as
  // a right one. A number field must arrive as a number.
  if (typeof v !== "number" || !Number.isFinite(v)) return null;
  const r = Math.round(v);
  return r >= min && r <= max ? r : null;
}

// A percentage. Separate from int() so the bound is stated once.
const pct = (v: unknown) => int(v, 0, 100);

// A count of anything a bowler could do in a lifetime of league nights.
const count = (v: unknown) => int(v, 0, 100_000);

const oneOf = <T extends string>(v: unknown, allowed: readonly T[]): T | null =>
  typeof v === "string" && (allowed as readonly string[]).includes(v) ? (v as T) : null;

const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);

// The stored miss values, exactly as src/constants.js lists them. A
// hand-edited record cannot put a word here that the app never offered.
const MISSES = ["Left", "Right", "Fast", "Slow", "Execution"] as const;

// The stored strike descriptions, likewise. These stay canonical for both
// hands in the database -- a left-hander taps "Trip 6" and the record
// says "Trip 4" -- so they are mirrored back for display here, the same
// way strikeDescriptionsForHand does it in the app. Without that, a lefty
// would read a nightcap naming pins on the wrong side of the deck.
const STRIKE_SHAPES = [
  "Flush", "High", "Light", "Messenger", "Half Pocket", "Trip 4", "Kick 10", "Brooklyn",
] as const;

const MIRRORED_SHAPES: Record<string, string> = { "Trip 4": "Trip 6", "Kick 10": "Kick 7" };

function shapeForHand(shape: string, hand: string): string {
  return hand === "left" ? (MIRRORED_SHAPES[shape] ?? shape) : shape;
}

// A split, as pin numbers: "7-10", "4-6-7-10". Digits and dashes only.
const splitKey = (v: unknown): string | null =>
  typeof v === "string" && /^\d{1,2}(-\d{1,2}){1,9}$/.test(v) ? v : null;

// The one free-text field. See the header.
//
// Narrowed three ways, all structural rather than by blocklist: an
// allowlist of the characters that appear in real ball names, forty
// characters, and at most five words. A ball is a product -- "Phaze II",
// "Storm IQ Tour Emerald", "Hy-Road Pearl" -- and five words covers every
// real one while leaving very little room for a sentence.
//
// This does NOT make a ball name safe the way a number is safe. Five
// words of letters can still read as an instruction. What it does is
// remove every structural tool: no newline to start a new line, no colon
// or angle bracket to fake a header or close a block, no room for
// context. Combined with the fenced data block and the fact that the
// output goes back to the caller's own screen, that is where this lands
// -- and the ball name is the only place it lands at all.
export const MAX_BALL_NAME = 40;
export const MAX_BALL_WORDS = 5;

export function safeBallName(v: unknown): string | null {
  const s = String(v ?? "")
    .replace(/[^A-Za-z0-9 .'&+/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_BALL_NAME)
    .split(" ")
    .slice(0, MAX_BALL_WORDS)
    .join(" ")
    .trim();
  return s || null;
}

// Teammates' names, for the team facts. The second free-text field, held
// tighter than a ball name: letters, spaces and . ' - only, twenty-four
// characters, three words. No digits, no slashes, nothing that ends a
// sentence. The client applies the identical rule.
export const MAX_PERSON_NAME = 24;
export const MAX_PERSON_WORDS = 3;

export function safePersonName(v: unknown): string | null {
  const s = String(v ?? "")
    .replace(/[^A-Za-z .'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_PERSON_NAME)
    .split(" ")
    .slice(0, MAX_PERSON_WORDS)
    .join(" ")
    .trim();
  return s || null;
}

// "Sam 3, you 1" -- or with names off, "you 1, a teammate 3".
function teamList(items: unknown[], opts: RenderOptions | undefined, cap: number): string | null {
  const parts: string[] = [];
  for (const raw of items.slice(0, cap)) {
    const b = raw as Record<string, unknown>;
    const n = int(b?.count, 1, 300);
    if (n === null) continue;
    const who = b?.you === true ? "this bowler"
      : opts?.teamNames === false ? "a teammate"
      : safePersonName(b?.name);
    if (!who) continue;
    parts.push(`${who} ${n}`);
  }
  return parts.length ? parts.join(", ") : null;
}

const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);

// A list of counted things: "Right 5, Left 2".
function countedList(items: unknown[], valueOf: (v: unknown) => string | null, cap = 5): string | null {
  const parts: string[] = [];
  for (const raw of items.slice(0, cap)) {
    const item = raw as Record<string, unknown>;
    const value = valueOf(item?.value ?? item?.key);
    const n = count(item?.count);
    if (value === null || n === null) continue;
    parts.push(`${value} ${n}`);
  }
  return parts.length ? parts.join(", ") : null;
}

// ── The sentences ───────────────────────────────────────────────────────
//
// One per fact id. Each returns a finished sentence, or null when the
// numbers it needs are missing or out of range -- a fact that cannot be
// rendered correctly is not rendered at all, because a sentence with a
// hole in it is worse than one fewer fact.
// 1st, 2nd, 3rd -- for seeds and finishing places.
function ordinalWord(n: number): string {
  const abs = Math.abs(Math.round(n));
  const rem100 = abs % 100;
  if (rem100 >= 11 && rem100 <= 13) return `${abs}th`;
  const rem10 = abs % 10;
  return `${abs}${rem10 === 1 ? "st" : rem10 === 2 ? "nd" : rem10 === 3 ? "rd" : "th"}`;
}

export type RenderOptions = { ballNames?: boolean; teamNames?: boolean; event?: string };

// A league night and a tournament block are the same shape of data and
// different words. The facts carry figures, not wording, so the wording
// lives here -- and a tournament read back as "their league average
// across 6 nights" is the whole feature sounding like it was not paying
// attention.
function isTournament(opts?: RenderOptions) { return opts?.event === "tournament"; }
// What the season figure is a season OF.
function scopeWord(opts?: RenderOptions) { return isTournament(opts) ? "event" : "league"; }
// What one of those samples is called.
function blockWord(opts?: RenderOptions, n = 2) {
  return isTournament(opts) ? (n === 1 ? "block" : "blocks") : (n === 1 ? "night" : "nights");
}
// And what THIS one is called, in a sentence about right now.
function nowWord(opts?: RenderOptions) { return isTournament(opts) ? "This block" : "Tonight"; }
type Renderer = (f: Record<string, unknown>, opts?: RenderOptions) => string | null;

export const RENDERERS: Record<string, Renderer> = {
  series(f, opts) {
    const scores = arr(f.scores).map(v => int(v, 0, 300)).filter((v): v is number => v !== null);
    const total = count(f.total), avg = int(f.avg, 0, 300), games = int(f.games, 1, 30);
    if (!scores.length || total === null || avg === null || games === null) return null;
    return `Scores ${isTournament(opts) ? "this block" : "tonight"}: ${scores.join(", ")} — ${total} series, ${avg} average over ${games} ${plural(games, "game", "games")}.`;
  },

  vsAverage(f, opts) {
    const avg = int(f.avg, 0, 300), seasonAvg = int(f.seasonAvg, 0, 300), diff = int(f.diff, -300, 300);
    if (avg === null || seasonAvg === null || diff === null) return null;
    const scope = scopeWord(opts);
    if (diff === 0) return `That is exactly their ${scope} average of ${seasonAvg}.`;
    return `That is ${Math.abs(diff)} ${diff > 0 ? "above" : "below"} their ${scope} average of ${seasonAvg}.`;
  },

  strikes(f) {
    const strikes = count(f.strikes), firstBalls = count(f.firstBalls), p = pct(f.pct);
    if (strikes === null || !firstBalls || p === null) return null;
    return `${strikes} strikes on ${firstBalls} first balls (${p}%).`;
  },

  spares(f) {
    const made = count(f.made), attempts = count(f.attempts), p = pct(f.pct);
    if (made === null || !attempts || p === null) return null;
    return `${made} of ${attempts} makeable spares converted (${p}%), splits excluded.`;
  },

  singlePins(f) {
    const made = count(f.made), attempts = count(f.attempts);
    if (made === null || !attempts) return null;
    return `${made} of ${attempts} single-pin spares made.`;
  },

  cornerPin(f) {
    const pin = oneOf(String(f.pin), ["7", "10"]);
    const left = count(f.left), made = count(f.made);
    if (!pin || !left || made === null) return null;
    return `The ${pin} pin was left ${left} ${plural(left, "time", "times")} and made ${made} of them.`;
  },

  splits(f) {
    const n = count(f.count), converted = count(f.converted);
    if (!n || converted === null) return null;
    // Built here rather than through countedList: a split is named by
    // its pins and only shows a count when it happened more than once,
    // which is a different shape from "Right 5, Left 2".
    const types: string[] = [];
    for (const raw of arr(f.types).slice(0, 3)) {
      const t = raw as Record<string, unknown>;
      const key = splitKey(t?.key);
      const c = count(t?.count);
      if (!key || !c) continue;
      types.push(c > 1 ? `${key} (${c})` : key);
    }
    const named = types.length ? ` — ${types.join(", ")}` : "";
    return `${n} ${plural(n, "split", "splits")} tonight, ${converted} converted${named}.`;
  },

  // ── The team's night ──────────────────────────────────────────────────

  teamHung(f, opts) {
    const list = teamList(arr(f.bowlers), opts, 3);
    if (!list) return null;
    return `Team banter — hung tonight (the only one on the team without a strike in a frame everyone else struck): ${list}.`;
  },

  handUp(f, opts) {
    const list = teamList(arr(f.bowlers), opts, 6);
    if (!list) return null;
    return `Team banter — lone 5-pins missed tonight, which by team custom owes a drink to everyone with a hand up: ${list}.`;
  },

  pinsLeft(f) {
    const pins = count(f.pins);
    if (!pins) return null;
    return `${pins} pins were left on the lane: that is the gap between the series bowled and what it would have been with every makeable spare converted.`;
  },

  leaveSide(f) {
    const total = count(f.total), left = count(f.left), right = count(f.right), both = count(f.both);
    const hand = oneOf(f.hand, ["left", "right"]);
    if (!total || left === null || right === null || both === null || !hand) return null;
    const parts: string[] = [];
    if (left) parts.push(`${left} entirely on the left`);
    if (right) parts.push(`${right} entirely on the right`);
    if (both) parts.push(`${both} across both sides`);
    if (!parts.length) return null;
    return `Of ${total} leaves with a side to them: ${parts.join(", ")}. The bowler is ${hand}-handed.`;
  },

  leaveSideByGame(f) {
    const parts: string[] = [];
    for (const raw of arr(f.games).slice(0, 12)) {
      const g = raw as Record<string, unknown>;
      const game = int(g?.game, 1, 30), left = count(g?.left), right = count(g?.right);
      if (game === null || left === null || right === null) continue;
      parts.push(`G${game}: ${left}L/${right}R`);
    }
    return parts.length ? `Left/right leaves by game — ${parts.join(", ")}.` : null;
  },

  misses(f) {
    const total = count(f.total);
    const list = countedList(arr(f.items), v => oneOf(v, MISSES));
    if (!total || !list) return null;
    return `Misses the bowler logged themselves: ${list} (${total} recorded).`;
  },

  strikeShape(f) {
    const total = count(f.total);
    const hand = oneOf(f.hand, ["left", "right"]) ?? "right";
    const list = countedList(arr(f.items), v => {
      const shape = oneOf(v, STRIKE_SHAPES);
      return shape ? shapeForHand(shape, hand) : null;
    });
    if (!total || !list) return null;
    return `Strike hits described: ${list} (${total} described).`;
  },

  byBall(f, opts) {
    const parts: string[] = [];
    let n = 0;
    for (const raw of arr(f.balls).slice(0, 4)) {
      const b = raw as Record<string, unknown>;
      const firstBalls = count(b?.firstBalls), strikes = count(b?.strikes);
      if (!firstBalls || strikes === null) continue;
      // With names off, the balls are numbered instead. The comparison
      // survives -- which one carried is still visible -- and not one
      // byte the bowler typed reaches the model. See NAME_BALLS.
      const name = opts?.ballNames === false
        ? `Ball ${++n} (most used first)`
        : safeBallName(b?.ball);
      if (!name) continue;
      parts.push(`${name}: ${strikes} strikes on ${firstBalls} first balls`);
    }
    if (parts.length < 2) return null;
    return `Balls thrown tonight — ${parts.join("; ")}. These are one night's samples and small.`;
  },

  byGame(f) {
    const parts: string[] = [];
    for (const raw of arr(f.games).slice(0, 12)) {
      const g = raw as Record<string, unknown>;
      const game = int(g?.game, 1, 30), strikes = count(g?.strikes), firstBalls = count(g?.firstBalls);
      if (game === null || strikes === null || firstBalls === null) continue;
      parts.push(`G${game}: ${strikes} strikes on ${firstBalls} first balls`);
    }
    return parts.length ? `Strikes by game — ${parts.join("; ")}.` : null;
  },

  // ── Season comparisons ────────────────────────────────────────────────
  //
  // Each states BOTH figures and BOTH samples in one sentence. That is
  // what makes the comparison something the model may repeat rather than
  // arithmetic it has to do, and arithmetic is the one thing it is
  // forbidden.

  seasonStrikes(f, opts) {
    const sp = pct(f.seasonPct), sn = count(f.seasonFirstBalls), nights = count(f.seasonNights);
    const tp = pct(f.tonightPct), tn = count(f.tonightFirstBalls);
    if (sp === null || !sn || !nights || tp === null || !tn) return null;
    return `Season so far in this ${scopeWord(opts)}: ${sp}% strikes on ${sn} first balls across ${nights} ${blockWord(opts, nights)}. ${nowWord(opts)} was ${tp}% on ${tn}.`;
  },

  // ── The rest of the event ─────────────────────────────────────────────
  //
  // Same rules as everything above: numbers arrive, sentences are
  // written here, and a figure that is not a plausible one drops the
  // whole line rather than printing a question mark at a bowler.

  eventCut(f) {
    const margin = int(f.margin, -3000, 3000);
    if (margin === null) return null;
    if (margin === 0) return `Finished exactly on the cut line.`;
    return margin > 0
      ? `Made the cut by ${margin} pins.`
      : `Missed the cut by ${Math.abs(margin)} pins.`;
  },

  eventMatchPlay(f) {
    const played = int(f.played, 1, 40);
    const wins = int(f.wins, 0, 40), losses = int(f.losses, 0, 40), ties = int(f.ties, 0, 40);
    if (played === null || wins === null || losses === null) return null;
    const record = ties ? `${wins}-${losses}-${ties}` : `${wins}-${losses}`;
    const bonus = int(f.bonusPins, 0, 3000);
    const total = int(f.total, 0, 20000);
    const avg = int(f.average, 0, 300);
    const diff = int(f.pinDiff, -3000, 3000);
    const bits = [`Match play: ${record} over ${played} ${plural(played, "match", "matches")}`];
    if (avg !== null) bits.push(`${avg} average`);
    if (bonus !== null && bonus > 0) bits.push(`${bonus} bonus pins`);
    if (total !== null) bits.push(`${total} with bonus`);
    let line = `${bits.join(", ")}.`;
    if (diff !== null && diff !== 0) {
      line += ` ${diff > 0 ? "Outscored" : "Outscored by"} their opponents by ${Math.abs(diff)} pins across the block.`;
    }
    return line;
  },

  eventStepladder(f) {
    const played = int(f.played, 1, 20);
    const wins = int(f.wins, 0, 20), losses = int(f.losses, 0, 20);
    if (played === null || wins === null || losses === null) return null;
    const seed = int(f.seed, 1, 99);
    const place = int(f.place, 1, 99);
    const opened = seed === null ? "" : ` from the ${ordinalWord(seed)} seed`;
    const climbed = `${wins} of ${played} ${plural(played, "step", "steps")} won`;
    if (place === null) return `Stepladder${opened}: ${climbed}.`;
    if (place === 1) return `Won the stepladder${opened}, ${climbed}.`;
    return `Stepladder${opened}: ${climbed}, finishing ${ordinalWord(place)}.`;
  },

  eventSide(f) {
    const entries = int(f.entries, 1, 99);
    const cost = int(f.cost, 0, 100000);
    const won = int(f.won, 0, 1000000);
    const net = int(f.net, -100000, 1000000);
    if (entries === null || cost === null || won === null || net === null) return null;
    const side = `Brackets and side pots: ${entries} ${plural(entries, "entry", "entries")}, $${cost} in, $${won} back`;
    if (net === 0) return `${side} — even.`;
    return `${side} — ${net > 0 ? "up" : "down"} $${Math.abs(net)}.`;
  },

  eventFinish(f) {
    // A closed set, matched exactly. The finish is the one fact here
    // that is a word rather than a number, so it is the one that has to
    // come from a list rather than from the wire.
    const FINISHES: Record<string, string> = {
      won: "Won the tournament.",
      runnerUp: "Finished runner-up.",
      topFive: "Finished in the top five.",
      cashed: "Cashed.",
      madeCut: "Made the cut.",
    };
    const id = typeof f.placement === "string" ? f.placement : "";
    return Object.prototype.hasOwnProperty.call(FINISHES, id) ? FINISHES[id] : null;
  },

  seasonSpares(f, opts) {
    const sp = pct(f.seasonPct), sa = count(f.seasonAttempts);
    const tp = pct(f.tonightPct), ta = count(f.tonightAttempts);
    if (sp === null || !sa || tp === null || !ta) return null;
    return `Season spare conversion: ${sp}% on ${sa} attempts. ${nowWord(opts)} was ${tp}% on ${ta}.`;
  },

  seasonSinglePins(f, opts) {
    const sp = pct(f.seasonPct), sa = count(f.seasonAttempts);
    const tp = pct(f.tonightPct), ta = count(f.tonightAttempts);
    if (sp === null || !sa || tp === null || !ta) return null;
    return `Season single-pin spares: ${sp}% on ${sa}. ${nowWord(opts)} was ${tp}% on ${ta}.`;
  },

  seasonCornerPin(f, opts) {
    const pin = oneOf(String(f.pin), ["7", "10"]);
    const sl = count(f.seasonLeft), sp = pct(f.seasonPct);
    const tl = count(f.tonightLeft), tm = count(f.tonightMade);
    if (!pin || !sl || sp === null || !tl || tm === null) return null;
    return `Season ${pin} pin: left ${sl} times, made ${sp}%. ${nowWord(opts)}: left ${tl}, made ${tm}.`;
  },

  seasonLeaveSide(f, opts) {
    const sl = pct(f.seasonLeftPct), sr = pct(f.seasonRightPct), st = count(f.seasonTotal);
    const tl = pct(f.tonightLeftPct), tr = pct(f.tonightRightPct), tt = count(f.tonightTotal);
    if (sl === null || sr === null || !st || tl === null || tr === null || !tt) return null;
    return `Season leaves with a side: ${sl}% left / ${sr}% right on ${st} leaves. ${nowWord(opts)}: ${tl}% left / ${tr}% right on ${tt}.`;
  },
};

export const KNOWN_IDS = Object.keys(RENDERERS);

// Every fact the client sent, as sentences this file wrote.
//
// Unknown ids are dropped silently rather than refused. A client one
// release ahead of a deployed function would otherwise get an error
// instead of a nightcap, for a fact the function simply has no template
// for yet -- the rest of the night is still worth reading.
export function renderFacts(facts: unknown, opts: RenderOptions = {}): string[] {
  const out: string[] = [];
  for (const raw of arr(facts).slice(0, 16)) {
    const fact = raw as Record<string, unknown>;
    const id = typeof fact?.id === "string" ? fact.id : "";
    // hasOwnProperty, not `RENDERERS[id]`: an id of "constructor" or
    // "toString" would otherwise resolve to a function off the prototype
    // and be called with a fact as its argument.
    const render = Object.prototype.hasOwnProperty.call(RENDERERS, id) ? RENDERERS[id] : null;
    if (!render) continue;
    let line: string | null = null;
    try {
      line = render(fact, opts);
    } catch {
      // A renderer is a template, not logic, so this should not happen.
      // If it ever does, one missing sentence is the right cost.
      line = null;
    }
    if (line) out.push(line);
  }
  return out;
}
