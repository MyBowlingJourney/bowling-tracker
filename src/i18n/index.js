// Which language the app shows, and switching it on.
//
// "auto" (the default) follows the phone: a phone set to French gets
// Quebec French, one set to Spanish gets Latin American Spanish, and
// everything else English. Settings can pin any of them.
//
// The choice is kept on the DEVICE, not the account, and read synchronously
// before the first render, so the app never flashes English and then
// switches. It is also copied to the account's user_metadata.language,
// which is what the sign-in email template reads to pick its language
// (Supabase templates can branch on .Data.language).
//
// A catalog is loaded only when its language is on, so English users
// never download either one.
import { createTranslator } from "./engine.js";

export const LANGUAGE_KEY = "mbj-language-v1";
export const LANGUAGE_CHOICES = ["auto", "fr", "es", "en"];

// Each language the app can show: its tag (what <html lang>, the AI
// features and the sign-in email are told) and how its catalog loads.
const LANGUAGES = {
  fr: { tag: "fr-CA", load: () => import("./fr-CA.js").then(m => m.FR_CA) },
  es: { tag: "es-419", load: () => import("./es-419.js").then(m => m.ES_419) },
};

export function chosenLanguage() {
  try {
    const v = window.localStorage.getItem(LANGUAGE_KEY);
    return LANGUAGE_CHOICES.includes(v) ? v : "auto";
  } catch { return "auto"; }
}

export function phoneLanguage() {
  try {
    const list = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language];
    // The phone's FIRST language decides: French or Spanish listed second
    // (a bilingual phone set to English first) keeps English.
    const first = String(list[0] || "");
    if (/^fr\b/i.test(first)) return "fr";
    if (/^es\b/i.test(first)) return "es";
    return "en";
  } catch { return "en"; }
}

export function resolvedLanguage(choice = chosenLanguage()) {
  if (choice === "fr" || choice === "es" || choice === "en") return choice;
  return phoneLanguage();
}

// Switching reloads the app: every screen then renders from scratch in the
// new language, which is simpler and safer than re-translating in place.
export function setLanguage(choice) {
  if (!LANGUAGE_CHOICES.includes(choice)) return;
  try { window.localStorage.setItem(LANGUAGE_KEY, choice); } catch { /* private mode */ }
  window.location.reload();
}

let active = null; // the translator while French or Spanish is on
let activeLang = "en";
let dom = null;    // the page translator, to re-run when protected names change
let protectedKey = "";

// For the few places text never reaches the page: canvas share images, AI
// requests, help search. English in, the current language out.
export function t(text) {
  return active ? active.translate(text) : String(text ?? "");
}
// The same for a longer message (share text, several lines).
export function tMessage(text) {
  return active ? active.translateMessage(text) : String(text ?? "");
}
// "fr", "es" or "en".
export function currentLanguage() {
  return active ? activeLang : "en";
}
// The language to ask the AI features to answer in.
export function aiLanguage() {
  return active ? LANGUAGES[activeLang].tag : "en";
}

// Names the bowler typed -- leagues, teams, balls, people, centres -- are
// shown exactly as typed, never "translated" because one happens to match
// an entry (a team called "Split Happens", a league called "Practice").
export function protectNames(names) {
  if (!active) return;
  const list = [...new Set((names || []).filter(n => typeof n === "string" && n.trim()))].sort();
  const key = list.join("\u0001");
  if (key === protectedKey) return;
  protectedKey = key;
  active.protect(list);
  if (dom) dom.refresh();
}

// Dates and numbers formatted with no locale named follow the APP's
// language, not the phone's: French chosen on an English phone still
// shows "3 octobre", and English chosen on a French phone shows "October 3".
//
// Spanish keeps the phone's own Spanish where it writes numbers the way
// the app does (Mexico, the US, Puerto Rico: 198.4, $4.99), and otherwise
// uses Latin American Spanish (es-419), which does too -- a phone set to
// Spain's or Argentina's Spanish would write 198,4 next to the app's 198.4.
function spanishLocale() {
  const phone = String(navigator.language || "");
  return /^es-(MX|US|PR)\b/i.test(phone) ? phone : "es-419";
}
function followAppLanguage(lang) {
  const loc = lang === "fr" ? "fr-CA"
    : lang === "es" ? spanishLocale()
    : (/^en\b/i.test(navigator.language || "") ? navigator.language : "en-US");
  const wrap = (proto, name) => {
    const orig = proto[name];
    if (typeof orig !== "function" || orig.__mbj) return;
    const f = function (locales, opts) { return orig.call(this, locales == null ? loc : locales, opts); };
    f.__mbj = true;
    proto[name] = f;
  };
  wrap(Date.prototype, "toLocaleDateString");
  wrap(Date.prototype, "toLocaleTimeString");
  wrap(Date.prototype, "toLocaleString");
  wrap(Number.prototype, "toLocaleString");
}

// Share pictures are drawn on a canvas, which the page translator never
// sees. Text drawn -- and measured, so layouts still fit -- goes through
// the same translation.
function translateCanvasText(tr) {
  const P = window.CanvasRenderingContext2D && window.CanvasRenderingContext2D.prototype;
  if (!P || P.fillText.__mbj) return;
  for (const name of ["fillText", "strokeText", "measureText"]) {
    const orig = P[name];
    const f = function (text, ...rest) { return orig.call(this, tr.translate(String(text ?? "")), ...rest); };
    f.__mbj = true;
    P[name] = f;
  }
}

export async function startLanguage() {
  const lang = resolvedLanguage();
  try { followAppLanguage(lang); } catch { /* formatting stays on the phone's language */ }
  const spec = LANGUAGES[lang];
  if (!spec) { document.documentElement.lang = "en"; return "en"; }
  try {
    const [catalog, { installDomTranslation }] = await Promise.all([
      spec.load(),
      import("./dom.js"),
    ]);
    active = createTranslator(catalog);
    activeLang = lang;
    document.documentElement.lang = spec.tag;
    dom = installDomTranslation(active);
    try { translateCanvasText(active); } catch { /* pictures stay English */ }
    return lang;
  } catch (e) {
    // A failed download leaves the app in English rather than broken.
    active = null;
    document.documentElement.lang = "en";
    return "en";
  }
}
