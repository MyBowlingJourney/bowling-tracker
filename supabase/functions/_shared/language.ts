// Which language an AI feature answers in.
//
// The app sends `language: "fr-CA"` when it is showing French (see
// src/i18n/index.js aiLanguage); anything else, or nothing, is English.
// Only the words the bowler reads change: JSON keys, fixed values the
// app compares against, and the numbers themselves stay exactly as the
// prompt specifies.

export type AnswerLanguage = "fr-CA" | "en";

export function answerLanguage(body: unknown): AnswerLanguage {
  const v = (body as { language?: unknown } | null)?.language;
  return v === "fr-CA" ? "fr-CA" : "en";
}

// Appended to a system prompt. Empty for English, so the English prompts
// are exactly what they were.
export function languageInstruction(lang: AnswerLanguage): string {
  if (lang !== "fr-CA") return "";
  return `

LANGUAGE. The bowler reads the app in Quebec French. Write every word they will read in natural Quebec French (français québécois), not France French, addressing them as « vous ». The statistics you are given are labelled in English; translate what you say, never quote the English labels.
Use the Quebec bowling terms: quilles (the sport, never "bowling"), abat (strike), réserve (spare), écart (split), dalot (gutter), carreau (frame), carreau ouvert (open frame), partie (game), triple (three-game series), pointage (score), moyenne (average), quilles restantes (leave), quille de tête (headpin), poche (pocket), allée (lane), boule (ball), boule d'abat / boule de réserve, patron d'huilage (oil pattern), crochet (hook), lâcher (release), ligue, équipe, soirée (league night), entraînement (practice), tournoi.
Write numbers the French way: decimal comma (198,4), a space before % (54 %), dollars after the number (6,99 $).
Keep names exactly as given: the bowler's, teammates', leagues', centres' and balls' names, and brand names.
If you are asked to return JSON, the keys and any fixed values listed in the instructions stay exactly as specified in English; only the free text inside is in French.`;
}
