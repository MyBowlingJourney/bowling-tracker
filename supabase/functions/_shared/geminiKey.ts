// The Gemini API key, read in ONE place for every function that calls it.
//
// ── Why this file exists ────────────────────────────────────────────────
//
// Insights, Brooklyn, Nightcap and the scorecard reader all stopped
// working at once, each reporting its own flavour of "no key": Insights a
// bare non-2xx, Brooklyn "The lamp is cold", the importer a paragraph
// about project secrets. One cause, four symptoms.
//
// The secret has historically been stored lowercase (gemini_api_key) in
// this project while code read GEMINI_API_KEY; import-scorecard carried a
// line meant to accept both:
//
//   Deno.env.get("GEMINI_API_KEY") || Deno.env.get("gemini_api_key")
//
// A case-insensitive find-and-replace turned that into the same name
// twice, and the other three only ever read the uppercase one. Environment
// lookups are case-sensitive, so a lowercase secret was invisible to all
// four.
//
// Reading the key here, under both spellings, means it cannot drift
// between functions again: fix it once, fixed everywhere.
//
// DO NOT "tidy" the second spelling away -- it is the load-bearing half.
// If you rename the secret, rename it in Supabase; this file keeps working
// either way.
export function geminiKey(): string {
  return (Deno.env.get("GEMINI_API_KEY") || Deno.env.get("gemini_api_key") || "").trim();
}
