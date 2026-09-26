// The translation engine: English text in, French, Spanish, Japanese or
// Korean text out.
//
// The language comes from the catalog (catalog.lang: "fr", "es", "ja" or
// "ko"; French when absent). What differs between them is kept in LANGUAGE_RULES below:
// how numbers and punctuation are written, the word for "and", and which
// numbers take the singular.
//
// Pure -- no DOM, no React, no storage -- so every rule here is tested in
// engine.test.js.
//
// A catalog has two parts:
//
//   exact:    { "League average": "Moyenne de ligue", ... }
//   patterns: [ ["Delete game {0}", "Supprimer la partie {0}"], ... ]
//
// Patterns cover text built from code, where numbers or names are dropped
// into a sentence. {0}, {1}... in the English match anything; in the French
// they put it back, in whatever order French needs. A captured value is
// itself translated when the catalog knows it -- exactly, by another
// pattern, or as a list ("a, b and c") -- so sentences built from smaller
// sentences come out whole.
//
// {1:s} in the English marks an English plural ending ("game{1:s}"): it
// matches only "", "s" or "es", which keeps it from swallowing a
// neighbouring value.
//
// {0:m} marks an amount of money as formatMoney writes it ("$12.00",
// "₩5,000", "RM1", "AED 5", "KD 0.500"): it matches only that. "{0:m} game" names a poker game
// by its stake ("¥100 game") and must not take "3 game" from the plural
// "{0} game{1:s}" -- a count and a price are different things, and the
// two patterns weigh the same.
//
// Plurals: French treats 0 and 1 as singular, English and Spanish only 1;
// Japanese has no plural, so its entries simply use one form.
// So the translation can say {0|partie|parties}: the first form when
// capture 0 is singular in that language, the second otherwise. The
// English side's own plural pieces are simply left out.
//
// Keys of the form "ctx::English" are context entries: the DOM layer asks
// for them when an element carries data-i18n="ctx", for the rare English
// word that needs two different French words on two screens.
//
// Anything with no entry is returned unchanged, except that numbers are
// always written the language's way (frenchNumbers, spanishNumbers).

const NBSP = "\u00A0";   // before : and % and $ -- the OQLF rules
const NNBSP = "\u202F";  // thousands separator (narrow)

function collapse(s) {
  return String(s).replace(/\s+/g, " ").trim();
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const PLACEHOLDER = /(\{\d+(?::[sm])?\})/;
// A formatted amount (src/domain/currency.js): sign, symbol, digits.
const MONEY_VALUE = "([-+\u2212]?(?:\\$|¥|₩|₱|₹|₡|RM|AED |KD )\\d[\\d,]*(?:\\.\\d+)?)";

// English pattern -> anchored regex.
//
// The space between a value and a word is optional (a value that renders
// as nothing leaves "for  in" collapsed to "for in"), but a word must
// still start and end on a word boundary: " in " must never match the
// "in" inside "Something".
const ALNUM = "A-Za-zÀ-ÿ0-9";
function literalRegex(p) {
  const core = p.trim();
  if (!core) return "\\s*";
  let re = core.split(/\s+/).map(escapeRegex).join("\\s+");
  const alnumStart = new RegExp(`^[${ALNUM}]`).test(core);
  const alnumEnd = new RegExp(`[${ALNUM}]$`).test(core);
  if (/^\s/.test(p)) re = "\\s*" + (alnumStart ? `(?<![${ALNUM}])` : "") + re;
  else if (alnumStart) re = `(?<![${ALNUM}])` + re;
  if (/\s$/.test(p)) re = re + (alnumEnd ? `(?![${ALNUM}])` : "") + "\\s*";
  else if (alnumEnd) re = re + `(?![${ALNUM}])`;
  return re;
}

function compilePattern(en) {
  const parts = en.split(PLACEHOLDER);
  let re = "^";
  const order = [];
  parts.forEach((p, i) => {
    const m = /^\{(\d+)(:[sm])?\}$/.exec(p);
    if (m) {
      // Two values side by side ("Frame {0}{1}") have no word between them
      // to split on; the first is almost always a number, so a number is
      // tried first.
      const rest = parts.slice(i + 1).filter(x => x !== "");
      const glued = rest[0] && /^\{\d+\}$/.test(rest[0]);
      // "{1} {2}": only a space between two values -- the first is one word
      // ("up", "3"), not nothing.
      const spaced = rest[0] && !rest[0].trim() && rest[1] && /^\{\d+/.test(rest[1]);
      re += m[2] === ":s" ? "(es|s|)"
        : m[2] === ":m" ? MONEY_VALUE
        : glued ? "(-?\\d+(?:[.,]\\d+)*|[\\s\\S]*?)"
        : spaced ? "(\\S+|[\\s\\S]*?)"
        : "([\\s\\S]*?)";
      order.push(Number(m[1]));
    } else if (p) {
      let lit = literalRegex(p);
      if (!p.trim() && i > 0 && i < parts.length - 1) lit = "\\s+";
      // A word glued to a value in the English ("Showing{0}", "game{1:s}")
      // may be glued in the text too, so only the far side is a boundary.
      if (i > 0 && !/^\s/.test(p)) lit = lit.replace(new RegExp(`^\\(\\?<!\\[${ALNUM}\\]\\)`), "");
      if (i < parts.length - 1 && !/\s$/.test(p)) lit = lit.replace(new RegExp(`\\(\\?!\\[${ALNUM}\\]\\)$`), "");
      re += lit;
    }
  });
  re += "$";
  return { re: new RegExp(re), order };
}

// The longest whole literal word in a pattern, used to find candidate
// patterns quickly: a text can only match a pattern whose words it
// contains. A word touching a placeholder ("game" in "game{1}") is not
// whole -- the text may say "games" -- so it is not used.
const WORD = /[a-zà-ÿ']{3,}/g;
function indexWord(en) {
  const marked = en.replace(/\{\d+(?::[sm])?\}/g, "\u0001").toLowerCase();
  const words = [];
  let m;
  WORD.lastIndex = 0;
  while ((m = WORD.exec(marked))) {
    const before = marked[m.index - 1], after = marked[m.index + m[0].length];
    if (before === "\u0001" || after === "\u0001") continue;
    words.push(m[0]);
  }
  return words.sort((a, b) => b.length - a.length)[0] || null;
}

function literalLength(en) {
  return en.replace(/\{\d+(?::[sm])?\}/g, "").replace(/\s+/g, "").length;
}

function numberOf(v) {
  const m = /-?\d+(?:[.,]\d+)?/.exec(String(v).replace(/[\s\u00A0\u202F]/g, ""));
  return m ? Number(m[0].replace(",", ".")) : NaN;
}

// A date or a short count ("ven. 25 sept.", "3 pins"): lower-case words,
// but not an English sentence.
function dateLike(s) {
  return /\d/.test(s) && (s.match(/[A-Za-zÀ-ÿ]+/g) || []).every(w => w.length <= 5);
}

// A plural choice keyed on a word rather than a number ("It" / "They").
const SINGULAR_WORDS = new Set(["", "it", "this", "that", "is", "has", "was", "a", "an", "one"]);

function isSingular(v, oneOnly = false) {
  const n = numberOf(v);
  if (Number.isFinite(n)) return oneOnly ? Math.abs(n) === 1 : Math.abs(n) < 2;
  return SINGULAR_WORDS.has(collapse(v).toLowerCase());
}

// Upper-case the first letter, as a label or sentence start needs.
function capitalize(s) {
  return s.replace(/^(\s*[«"“(¿¡]?\s*)([a-zà-ÿ])/, (_, a, c) => a + c.toUpperCase());
}
function startsLower(s) { return /^[a-zà-ÿ]/.test(s); }
function startsUpper(s) { return /^[A-ZÀ-Ý]/.test(s); }

// ── Numbers ────────────────────────────────────────────────────────────
//
// OQLF: decimal comma, thousands separated by a (non-breaking) space,
// "9,99 $", "54 %", "19 h 30", ordinals 1er / 2e.
//
// Applied to every piece of visible text in French, translated or not, so
// a score like "198.4" coming straight from the code still reads right.
// Left alone: anything that looks like a URL or an email, version numbers
// (1.2.3), and times already in 24-hour form.
export function frenchNumbers(text) {
  let s = String(text);
  if (!/\d/.test(s) || /:\/\/|@\w/.test(s)) return s;
  // 12-hour clock -> 24-hour ("7:30 PM" -> "19 h 30")
  s = s.replace(/\b(\d{1,2}):(\d{2})\s?([AaPp])\.?\s?[Mm]\.?(?![A-Za-z])/g, (_, h, m, ap) => {
    let hh = Number(h) % 12;
    if (/[Pp]/.test(ap)) hh += 12;
    return `${hh}${NBSP}h${NBSP}${m}`;
  });
  s = s.replace(/\b(\d{1,2})\s?([AaPp])\.?[Mm]\.?(?![A-Za-z])/g, (_, h, ap) => {
    let hh = Number(h) % 12;
    if (/[Pp]/.test(ap)) hh += 12;
    return `${hh}${NBSP}h`;
  });
  // Money: "$1,234.50" / "-$3" / "+$12.50" -> "1 234,50 $"
  // Not "S$6.98" (Singapore dollars): only a bare "$" is moved.
  s = s.replace(/([-+−]?)(?<![A-Za-z])\$\s?(\d{1,3}(?:,\d{3})+|\d+)(?:\.(\d+))?/g, (_, sign, int, dec) => {
    const i = int.replace(/,/g, NNBSP);
    return `${sign}${i}${dec !== undefined ? "," + dec : ""}${NBSP}$`;
  });
  // Thousands: "12,345" -> "12 345" (only true groups of three)
  s = s.replace(/(^|[^\d.,])(\d{1,3}(?:,\d{3})+)(?![\d,])/g, (_, pre, n) => pre + n.replace(/,/g, NNBSP));
  // Decimals: "198.4" -> "198,4", but not 1.2.3 and not ".5" in "v.5"
  s = s.replace(/(^|[^\d.])(\d+)\.(\d+)(?![\d.])/g, (m, pre, a, b, off, all) => {
    if (all[off + m.length] === ".") return m; // part of a dotted sequence like 1.2.3
    return `${pre}${a},${b}`;
  });
  // Percent: "54%" -> "54 %"
  s = s.replace(/(\d)\s?%/g, `$1${NBSP}%`);
  // A unit or a month keeps its number: "15lb" -> "15 lb", "25 sept."
  s = s.replace(/(\d)\s?(lbs?)\b/g, `$1${NBSP}$2`);
  s = s.replace(/(\d) (janv|févr|mars|avr|mai|juin|juil|août|sept|oct|nov|déc)/g, `$1${NBSP}$2`);
  // Ordinals: 1st -> 1er, 2nd/3rd/4th -> 2e
  s = s.replace(/\b1st\b/g, "1er").replace(/\b(\d+)(?:st|nd|rd|th)\b/g, "$1e");
  return s;
}

// ── Spanish (Latin America) ────────────────────────────────────────────
//
// Mexico, Puerto Rico and the US write numbers as English does -- 198.4,
// 12,345, $4.99, 54% -- so those are left alone. What changes: the
// 12-hour clock says "7:30 p. m.", and English ordinals become 1.º, 2.º.
export function spanishNumbers(text) {
  let s = String(text);
  if (!/\d/.test(s) || /:\/\/|@\w/.test(s)) return s;
  s = s.replace(/\b(\d{1,2}(?::\d{2})?)\s?([AaPp])\.?\s?[Mm]\.?(?![A-Za-z])/g,
    (_, t, ap) => `${t}${NBSP}${/[Pp]/.test(ap) ? "p." : "a."}${NBSP}m.`);
  s = s.replace(/\b(\d+)(?:st|nd|rd|th)\b/g, "$1.º");
  return s;
}

// Spanish spacing: nothing before : ; ! ?, no space before . or , (a value
// that came out empty leaves one behind), never two spaces in a row.
function spanishPunctuation(s) {
  return s
    .replace(/ +([.,:;!?])(?=\s|$)/g, "$1")
    .replace(/ {2,}/g, " ");
}

// ── Japanese ───────────────────────────────────────────────────────────
//
// Japan writes 198.4, 1,250 and 54% as English does. Times are 24-hour
// ("19:30"), and an English ordinal from code is a place ("3rd" -> "3位"):
// in this app that is a finish or a seed.
export function japaneseNumbers(text) {
  let s = String(text);
  if (!/\d/.test(s) || /:\/\/|@\w/.test(s)) return s;
  s = s.replace(/\b(\d{1,2}):(\d{2})\s?([AaPp])\.?\s?[Mm]\.?(?![A-Za-z])/g, (_, h, m, ap) => {
    let hh = Number(h) % 12;
    if (/[Pp]/.test(ap)) hh += 12;
    return `${hh}:${m}`;
  });
  s = s.replace(/\b(\d{1,2})\s?([AaPp])\.?[Mm]\.?(?![A-Za-z])/g, (_, h, ap) => {
    let hh = Number(h) % 12;
    if (/[Pp]/.test(ap)) hh += 12;
    return `${hh}時`;
  });
  // A seed is "第2シード", every other ordinal a place.
  s = s.replace(/\b(\d+)(?:st|nd|rd|th)(?=\s?シード)\s?/g, "第$1");
  s = s.replace(/\b(\d+)(?:st|nd|rd|th)\b/g, "$1位");
  return s;
}

// Japanese spacing: no space before 。、！？ or a closing bracket, none
// after an opening one, never two spaces in a row.
function japanesePunctuation(s) {
  return s
    .replace(/ +([。、！？」』）])/g, "$1")
    .replace(/([「『（]) +/g, "$1")
    .replace(/ +([.,])(?=\s|$)/g, "$1")
    .replace(/ {2,}/g, " ");
}

// ── Korean ─────────────────────────────────────────────────────────────
//
// Korea writes 198.4, 1,250 and 54% as English does. A 12-hour time reads
// "오후 7:30", and an English ordinal from code is a place ("3rd" -> "3위";
// a seed, "3번 시드").
export function koreanNumbers(text) {
  let s = String(text);
  if (!/\d/.test(s) || /:\/\/|@\w/.test(s)) return s;
  s = s.replace(/\b(\d{1,2}(?::\d{2})?)\s?([AaPp])\.?\s?[Mm]\.?(?![A-Za-z])/g,
    (_, t, ap) => `${/[Pp]/.test(ap) ? "오후" : "오전"} ${t}`);
  s = s.replace(/\b(\d+)(?:st|nd|rd|th)(?=\s?시드)\s?/g, "$1번 ");
  s = s.replace(/\b(\d+)(?:st|nd|rd|th)\b/g, "$1위");
  return s;
}

// Korean particles change with the sound before them: 을/를, 이/가,
// 은/는, 과/와, 으로/로. A translation can't know how a name or number
// dropped into it ends, so it writes the choice as "(을)를", "(이)가",
// "(은)는", "(과)와", "(으)로" right after the value, and this picks the
// one that fits. After a word it can't read (a Latin name), the marker
// stays as written, the usual Korean way: "Ryan(이)가".
const KO_PARTICLES = { "(을)를": ["을", "를"], "(이)가": ["이", "가"], "(은)는": ["은", "는"], "(과)와": ["과", "와"], "(으)로": ["으로", "로"], "(이)에요": ["이에요", "예요"], "(이)야": ["이야", "야"] };
// Final sound of the Sino-Korean reading of each digit: true = consonant,
// "l" = ㄹ (which takes 로, not 으로).
const DIGIT_FINAL = { "0": true, "1": "l", "2": false, "3": true, "4": false, "5": false, "6": true, "7": "l", "8": "l", "9": false };
function finalSound(ch) {
  const c = ch.charCodeAt(0);
  if (c >= 0xAC00 && c <= 0xD7A3) {
    const f = (c - 0xAC00) % 28;
    return f === 0 ? false : f === 8 ? "l" : true;
  }
  if (ch in DIGIT_FINAL) return DIGIT_FINAL[ch];
  if (ch === "%") return false; // 퍼센트
  return null; // unknown: a Latin letter, a symbol
}
export function koreanParticles(text) {
  // An English ordinal not yet turned into a place ("3rd") will read 3위,
  // which ends in a vowel.
  return String(text).replace(/(\d(?:st|nd|rd|th))(\((?:을|이|은|과|으)\)(?:를|가|는|와|로|에요|야))/g,
    (m, ord, marker) => ord + (KO_PARTICLES[marker] ? KO_PARTICLES[marker][1] : marker))
    .replace(/([^\s(])(\((?:을|이|은|과|으)\)(?:를|가|는|와|로|에요|야))/g, (m, prev, marker) => {
    const pair = KO_PARTICLES[marker];
    if (!pair) return m;
    const f = finalSound(prev);
    if (f === null) return m;
    if (marker === "(으)로") return prev + (f === true ? "으로" : "로");
    return prev + (f ? pair[0] : pair[1]);
  });
}

function koreanPunctuation(s) {
  return koreanParticles(s)
    .replace(/ +([.,!?])(?=\s|$)/g, "$1")
    .replace(/ {2,}/g, " ");
}

// French spacing: a non-breaking space before a colon, none before ; ! ?
// (Quebec usage, unlike France); no space before . or , (a value that
// came out empty leaves one behind); never two spaces in a row.
function frenchPunctuation(s) {
  return s
    .replace(/(\S) ?:(?=\s|$)/g, (m, c) => (/\d/.test(c) ? m : `${c}${NBSP}:`))
    .replace(/« +/g, `«${NBSP}`).replace(/ +»/g, `${NBSP}»`)
    .replace(/ +([.,])(?=\s|$)/g, "$1")
    .replace(/ {2,}/g, " ");
}

const LANGUAGE_RULES = {
  fr: { numbers: frenchNumbers, punctuation: s => frenchPunctuation(s), and: " et ", oneOnly: false, spaced: true },
  es: { numbers: spanishNumbers, punctuation: s => spanishPunctuation(s), and: " y ", oneOnly: true, spaced: true },
  // Japanese: lists are joined with 、 throughout, and a translated value
  // does not bring English spaces into the sentence around it.
  ja: { numbers: japaneseNumbers, punctuation: s => japanesePunctuation(s), and: "、", comma: "、", oneOnly: true, spaced: false, caps: false },
  // Korean: spaces between words as in English, a list's last item joined
  // with "및", no capitals, and particles fitted to the values dropped in.
  ko: { numbers: koreanNumbers, punctuation: s => koreanPunctuation(s), and: " 및 ", oneOnly: true, spaced: true, caps: false },
};

export function createTranslator(catalog = {}) {
  const lang = LANGUAGE_RULES[catalog.lang] ? catalog.lang : "fr";
  const rules = LANGUAGE_RULES[lang];
  const exact = new Map();
  for (const [en, fr] of Object.entries(catalog.exact || {})) {
    if (typeof fr === "string" && fr) exact.set(collapse(en), fr);
  }
  const byWord = new Map();
  const noWord = [];
  for (const pair of catalog.patterns || []) {
    const [en, fr] = pair;
    if (typeof en !== "string" || typeof fr !== "string" || !fr) continue;
    const c = compilePattern(collapse(en));
    const entry = { en, fr, ...c, weight: literalLength(en) };
    const w = indexWord(en);
    if (w) { if (!byWord.has(w)) byWord.set(w, []); byWord.get(w).push(entry); }
    else noWord.push(entry);
  }
  for (const list of byWord.values()) list.sort((a, b) => b.weight - a.weight);
  noWord.sort((a, b) => b.weight - a.weight);

  // Things the bowler typed -- league, team, ball and people's names -- are
  // never translated, even when one happens to match an entry ("Practice",
  // "Split Happens").
  let protectedNames = new Set();
  let protectedRe = null; // finds those names inside a longer text
  let partials = 0;       // how many lookups came back only partly translated
  const cache = new Map();
  const partialKeys = new Set(); // texts a pattern matched with a value left in English

  // Pieces of sentences ("in", "left", "of"): right where the sentence
  // put them, wrong anywhere else -- so never used for a value dropped
  // into another sentence.
  const fragmentOnly = new Set((catalog.fragments || []).map(collapse));

  // The language's number formatting, except inside a protected name: a
  // ball called "Black Widow 3.0" keeps its dot.
  function numbers(text) {
    const s = String(text);
    if (!protectedRe || !/\d/.test(s)) return rules.numbers(s);
    return s.split(protectedRe).map((part, i) => (i % 2 ? part : rules.numbers(part))).join("");
  }

  function lookupExact(key, depth = 0) {
    if (depth > 0 && fragmentOnly.has(key)) return null;
    return exact.has(key) ? exact.get(key) : null;
  }

  // A captured value, translated if the catalog knows it. Keeps the spaces
  // around it, which the sentence needs ("for" + " Bob").
  function translateCapture(v, depth) {
    const s = String(v);
    const core = collapse(s);
    if (!core || !/[A-Za-z]/.test(core) || protectedNames.has(core)) return { text: s, hit: false };
    const before = partials;
    let hit = core.includes("::") ? null : lookupCore(core, depth + 1);
    let list = false;
    if (hit === null) { hit = translateList(core, depth); list = hit !== null; }
    if (hit === null) return { text: s, hit: false };
    const lead = rules.spaced && /^\s*/.exec(s)[0] ? " " : "", trail = rules.spaced && /\s*$/.exec(s)[0] ? " " : "";
    // Only partly translated (a pattern whose own value stayed English)
    // counts as not translated.
    return { text: lead + hit + trail, hit: hit !== core && partials === before, list };
  }

  // "a, b and c" built in code: translated only when every item is known.
  function translateList(core, depth) {
    const m = /^(.+?)(?:,? and )(.+)$/.exec(core);
    if (!m) return null;
    const items = m[1].split(/, /).concat([m[2]]);
    if (items.length < 2) return null;
    const out = [];
    for (const it of items) {
      if (protectedNames.has(it)) return null;
      const t = lookupCore(it, depth + 1);
      if (t === null) return null;
      out.push(t);
    }
    return out.slice(0, -1).join(rules.comma || ", ") + rules.and + out[out.length - 1];
  }

  // Fills a French template from the captured values. Returns null when a
  // short pattern would leave English words around its French ("{0} of
  // {1}" matching "Every phase of what it paid"): that is not a sentence
  // the pattern was made for, and half-translated reads as broken.
  function fill(fr, caps, depth, weight, en) {
    let rejected = false;
    let untranslated = 0;
    const out = fr.replace(/\{(\d+)(?:\|([^|}]*)\|([^}]*))?\}/g, (whole, i, sing, plur, off) => {
      const v = caps[Number(i)];
      if (sing !== undefined) return isSingular(v ?? "", rules.oneOnly) ? sing : plur;
      if (v === undefined) return "";
      // A value that swallowed one of an inline element's tokens: this
      // pattern was not written for that sentence.
      if (/⟨\d+⟩/.test(v) && !/⟨\d+⟩/.test(en)) rejected = true;
      // "Left {0}" is not "Left: 1" -- a value does not start with a colon.
      if (/^\s*:/.test(v)) rejected = true;
      const { text, hit, list } = translateCapture(v, depth);
      // An email address or a link is a value like a name: never English
      // to translate, never a reason to turn the pattern down.
      const address = /\S@\S|:\/\//.test(text);
      if (!hit && !address && /[A-Za-z]{2,}/.test(text) && !protectedNames.has(collapse(text)) && !dateLike(text)) untranslated++;
      if (!hit && !address && weight < 12 && /(^|[^A-Za-zÀ-ÿ])[a-z]{2,}([^A-Za-zÀ-ÿ]|$)/.test(text)
          && !protectedNames.has(collapse(text)) && !dateLike(text)) rejected = true;
      // A translated word in the middle of a French sentence is lower
      // case ("Main droite", "en ligue"); a name or an acronym is not
      // touched, and neither is a value at the start of a sentence.
      // After a colon too: French lower-cases a common noun there.
      if (hit && /(?:[a-zà-ÿ'’] ?|[^\d] ?: )$/.test(fr.slice(0, off)) && /^\s?[A-ZÀ-Ý][a-zà-ÿ]/.test(text)) {
        const lowered = text.replace(/^(\s?)(.)/, (_, sp, c) => sp + c.toLowerCase());
        // A list built from catalog words ("Práctica y Liga") is lowered
        // item by item; translateList never lets a typed name into one.
        if (!list) return lowered;
        const listSep = new RegExp(`(, |${rules.and})([A-ZÀ-Ý])(?=[a-zà-ÿ])`, "g");
        return lowered.replace(listSep, (_, sep, c) => sep + c.toLowerCase());
      }
      return text;
    });
    return rejected ? null : { out, untranslated };
  }

  function lookupPattern(key, depth) {
    const words = new Set((key.toLowerCase().match(/[a-zà-ÿ']{3,}/g) || []));
    const candidates = [];
    for (const w of words) { const l = byWord.get(w); if (l) candidates.push(...l); }
    candidates.push(...noWord);
    candidates.sort((a, b) => b.weight - a.weight);
    // The heaviest pattern whose values all translate wins; failing that,
    // the heaviest that matched at all ("Hide {0}" with "Side games" beats
    // "{0} games" with "Hide Side").
    let fallback = null;
    for (const p of candidates) {
      const m = p.re.exec(key);
      if (!m) continue;
      const caps = [];
      p.order.forEach((idx, j) => { caps[idx] = m[j + 1]; });
      const r = fill(p.fr, caps, depth, p.weight, p.en);
      if (r === null) continue;
      if (r.untranslated === 0) return r.out;
      if (fallback === null) fallback = r.out;
    }
    if (fallback !== null) partials++;
    return fallback;
  }

  // One piece of text, already collapsed. Exact entries first, then
  // patterns; then the same with the first letter's case flipped, because
  // code sometimes lower-cases a label ("won it") or starts a sentence with
  // a word it also uses mid-sentence.
  function lookupCore(key, depth = 0) {
    if (depth > 3 || protectedNames.has(key)) return null;
    let out = lookupExact(key, depth);
    if (out === null) out = lookupPattern(key, depth);
    if (out === null) {
      const flipped = startsUpper(key) ? key[0].toLowerCase() + key.slice(1)
        : startsLower(key) ? key[0].toUpperCase() + key.slice(1) : null;
      if (flipped) {
        let f = lookupExact(flipped, depth);
        if (f === null) f = lookupPattern(flipped, depth);
        if (f !== null) {
          out = startsLower(key) ? f.replace(/^(\s*)([A-ZÀ-Ý])(?=[a-zà-ÿ'’ ]|$)/, (_, a, c) => a + c.toLowerCase()) : capitalize(f);
        }
      }
    }
    return out;
  }

  // Translates one piece of text. Returns null when there is no entry, so
  // callers can tell "unchanged" from "translated to the same words".
  function lookup(text) {
    const key = collapse(text);
    if (!key || !/[A-Za-z]/.test(key) || protectedNames.has(key)) return null;
    if (cache.has(key)) return cache.get(key);
    const partialsBefore = partials;
    // A line of " · " facts is taken fact by fact first when every fact is
    // known: a long pattern would otherwise swallow several facts into one
    // value it cannot translate.
    let out = lookupExact(key);
    if (out === null && /(^| )· /.test(key)) out = lookupSegments(key, true);
    if (out === null) out = lookupCore(key);
    if (out === null) out = lookupSentences(key);
    if (out === null) out = lookupSegments(key);
    if (out !== null) {
      out = rules.punctuation(out);
      // A label or a sentence starts with a capital in both languages.
      // (Japanese has no capitals: a Latin value at the start -- a name,
      // an email -- stays exactly as it was.)
      if (rules.caps !== false && startsUpper(key) && !key.includes("::")) out = capitalize(out);
    }
    if (cache.size > 8000) { cache.clear(); partialKeys.clear(); }
    cache.set(key, out);
    if (partials !== partialsBefore) partialKeys.add(key);
    return out;
  }

  // A line of separate facts joined with " · " ("134 shots · 43% strikes ·
  // Hybrid"): each fact is its own label, so each is translated on its
  // own and the ones with no entry (names, numbers) stay as they are.
  function lookupSegments(key, all = false) {
    const parts = key.split(/ ?· ?/);
    if (parts.length < 2) return null;
    let any = false, missed = false;
    const out = parts.map(p => {
      const t = /[A-Za-z]/.test(p) && !protectedNames.has(p) ? lookupCore(p) : null;
      if (t !== null) { any = true; return t; }
      if (/[a-z]{2,}/.test(p) && !protectedNames.has(p)) missed = true;
      return p;
    });
    if (all && missed) return null;
    return any ? out.join(" · ").trim() : null;
  }

  // Several sentences run together by code: translated when every one of
  // them is known, otherwise left alone (half-French reads as broken).
  function lookupSentences(key) {
    const parts = key.split(/(?<=[.!?])\s+(?=[A-Z0-9"“«(])/);
    if (parts.length < 2) return null;
    const one = p => {
      let t = /[A-Za-z]/.test(p) ? lookupCore(p) : p;
      // "League." -- a label used as a sentence: the label, then the stop.
      if (t === null && /[.!?]$/.test(p)) {
        const bare = lookupCore(p.slice(0, -1));
        if (bare !== null) t = /[.!?…]$/.test(bare) ? bare : bare + p.slice(-1);
      }
      return t;
    };
    // The longest run of sentences that has an entry, from each point on:
    // an entry can itself be two sentences.
    const out = [];
    for (let i = 0; i < parts.length;) {
      let found = false;
      for (let j = parts.length; j > i; j--) {
        if (i === 0 && j === parts.length) continue; // the whole: already tried
        const t = one(parts.slice(i, j).join(" "));
        if (t !== null) { out.push(t); i = j; found = true; break; }
      }
      if (!found) return null;
    }
    return out.join(" ");
  }

  // Full translation for display: keeps the leading/trailing spaces React
  // put around the text, and always writes numbers the French way.
  function translate(text) {
    const s = String(text ?? "");
    const lead = /^\s*/.exec(s)[0], trail = /\s*$/.exec(s)[0];
    const hit = lookup(s);
    const core = hit !== null ? hit : s.slice(lead.length, s.length - trail.length);
    return lead + numbers(core) + (s.trim() ? trail : "");
  }

  // Longer messages (alerts, confirms): whole first, then paragraph by
  // paragraph, then line by line.
  function translateMessage(text) {
    const s = String(text ?? "");
    const whole = lookup(s);
    const paras = s.split(/\n\s*\n/);
    // A message of several paragraphs or lines is taken whole only when
    // the whole translated cleanly: a short pattern can otherwise swallow
    // three paragraphs (or a list of lines) into one value, flatten them
    // and leave most in English.
    const oneLine = paras.length < 2 && !s.includes("\n");
    if (whole !== null && (oneLine || !partialKeys.has(collapse(s)))) return numbers(whole);
    if (paras.length > 1) return paras.map(p => translateMessage(p)).join("\n\n");
    const lines = s.split("\n");
    if (lines.length > 1) return lines.map(l => translate(l)).join("\n");
    return translate(s);
  }

  function protect(names) {
    protectedNames = new Set([...(names || [])].map(n => collapse(n)).filter(Boolean));
    const withDigits = [...protectedNames].filter(n => /\d/.test(n)).sort((a, b) => b.length - a.length);
    protectedRe = withDigits.length ? new RegExp("(" + withDigits.map(escapeRegex).join("|") + ")") : null;
    cache.clear();
    partialKeys.clear();
  }

  // A context entry ("tab::Clean frames"): exact only -- a context is a
  // label, never a sentence to match patterns against.
  function context(ctx, text) {
    const hit = lookupExact(`${ctx}::${collapse(text)}`);
    return hit ? rules.punctuation(hit) : null;
  }

  return { lang, lookup, translate, translateMessage, protect, numbers, context, has: t => lookup(t) !== null };
}
