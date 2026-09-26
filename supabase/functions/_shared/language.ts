// Which language an AI feature answers in.
//
// The app sends `language: "fr-CA"` when it is showing Quebec French and
// `language: "es-419"` for Latin American Spanish, `language: "ja-JP"`
// for Japanese and `language: "ko-KR"` for Korean (see src/i18n/index.js aiLanguage); anything else, or
// nothing, is English.
// Only the words the bowler reads change: JSON keys, fixed values the
// app compares against, and the numbers themselves stay exactly as the
// prompt specifies.

export type AnswerLanguage = "fr-CA" | "es-419" | "ja-JP" | "ko-KR" | "en";

export function answerLanguage(body: unknown): AnswerLanguage {
  const v = (body as { language?: unknown } | null)?.language;
  return v === "fr-CA" || v === "es-419" || v === "ja-JP" || v === "ko-KR" ? v : "en";
}

// Appended to a system prompt. Empty for English, so the English prompts
// are exactly what they were.
export function languageInstruction(lang: AnswerLanguage): string {
  if (lang === "es-419") return SPANISH;
  if (lang === "ja-JP") return JAPANESE;
  if (lang === "ko-KR") return KOREAN;
  if (lang !== "fr-CA") return "";
  return `

LANGUAGE. The bowler reads the app in Quebec French. Write every word they will read in natural Quebec French (français québécois), not France French, addressing them as « vous ». The statistics you are given are labelled in English; translate what you say, never quote the English labels.
Use the Quebec bowling terms: quilles (the sport, never "bowling"), abat (strike), réserve (spare), écart (split), dalot (gutter), carreau (frame), carreau ouvert (open frame), partie (game), triple (three-game series), pointage (score), moyenne (average), quilles restantes (leave), quille de tête (headpin), poche (pocket), allée (lane), boule (ball), boule d'abat / boule de réserve, patron d'huilage (oil pattern), crochet (hook), lâcher (release), ligue, équipe, soirée (league night), entraînement (practice), tournoi.
Write numbers the French way: decimal comma (198,4), a space before % (54 %), dollars after the number (6,99 $).
Keep names exactly as given: the bowler's, teammates', leagues', centres' and balls' names, and brand names.
If you are asked to return JSON, the keys and any fixed values listed in the instructions stay exactly as specified in English; only the free text inside is in French.`;
}

// Latin American Spanish, for bowlers in Mexico, Puerto Rico, the US and
// the rest of Latin America. The bowling words are the ones those league
// bowlers use -- several are English loanwords (strike, spare, split) --
// and match the app's own Spanish (src/i18n/glossary-es.md).
const SPANISH = `

LANGUAGE. The bowler reads the app in Latin American Spanish. Write every word they will read in natural Latin American Spanish as spoken in Mexico and Puerto Rico, not Spain's Spanish (no "vosotros", no "ordenador", no "móvil"), addressing them as "tú". The statistics you are given are labelled in English; translate what you say, never quote the English labels.
Use these bowling terms: boliche (the sport), strike, spare, split (these three stay in English, as league bowlers say them; plural strikes, spares, splits), canal (gutter), cuadro (frame), cuadro abierto (open frame), cuadro limpio (clean frame), juego (game), serie (series), puntaje (score), promedio (average), pinos que quedan (leave), pino 1 (headpin), bolsillo (pocket), pista (lane), bola (ball), bola de strike / bola de spare, patrón de aceite (oil pattern), gancho (hook), soltada (release), liga, equipo, noche de liga (league night), práctica (practice), torneo.
Write numbers the way Mexico and the US do: decimal point (198.4), comma for thousands (1,250), 54%, $4.99.
Use opening question and exclamation marks (¿…? ¡…!).
Keep names exactly as given: the bowler's, teammates', leagues', centers' and balls' names, and brand names.
If you are asked to return JSON, the keys and any fixed values listed in the instructions stay exactly as specified in English; only the free text inside is in Spanish.`;

// Japanese. Bowling in Japan is talked about almost entirely in katakana
// loanwords; these match the app's own Japanese (src/i18n/glossary-ja.md).
const JAPANESE = `

LANGUAGE. The bowler reads the app in Japanese. Write every word they will read in natural, polite Japanese (です・ます調), as a Japanese bowling app would — friendly, not stiff. Do not use あなた; leave the subject implied, as Japanese naturally does. The statistics you are given are labelled in English; translate what you say, never quote the English labels.
Use these bowling terms: ボウリング (the sport), ストライク, スペア, スプリット, ガター, フレーム, オープンフレーム, ゲーム, シリーズ, スコア, アベレージ, 残りピン (leave), ヘッドピン, ポケット, レーン, ボール, ストライクボール / スペアボール, オイルパターン, フック, リリース, リーグ, チーム, リーグナイト, 練習, 大会 (tournament), ダブル, ターキー, ボウラー.
Write numbers as Japanese apps do: 198.4, 1,250, 54%; times in 24-hour form (19:30).
Keep names exactly as given: the bowler's, teammates', leagues', centers' and balls' names, and brand names — do not convert them to katakana.
If you are asked to return JSON, the keys and any fixed values listed in the instructions stay exactly as specified in English; only the free text inside is in Japanese.`;

// Korean. Korean bowlers use English loanwords for nearly every bowling
// term; these match the app's own Korean (src/i18n/glossary-ko.md).
const KOREAN = `

LANGUAGE. The bowler reads the app in Korean. Write every word they will read in natural, polite Korean (해요체 — friendly and polite, as Korean apps write; not 합니다체 for chat text, never 반말). Avoid "당신"; leave the subject implied, as Korean naturally does. The statistics you are given are labelled in English; translate what you say, never quote the English labels.
Use these bowling terms: 볼링 (the sport), 스트라이크, 스페어, 스플릿, 거터, 프레임, 오픈 프레임, 게임, 시리즈, 점수, 에버리지, 남은 핀 (leave), 헤드핀, 포켓, 레인, 볼, 스트라이크 볼 / 스페어 볼, 오일 패턴, 훅, 릴리스, 리그, 팀, 리그전 (league night), 연습, 대회 (tournament), 더블, 터키, 볼러.
Write numbers as Korean apps do: 198.4, 1,250, 54%.
Keep names exactly as given: the bowler's, teammates', leagues', centers' and balls' names, and brand names — do not convert them to Hangul.
If you are asked to return JSON, the keys and any fixed values listed in the instructions stay exactly as specified in English; only the free text inside is in Korean.`;
