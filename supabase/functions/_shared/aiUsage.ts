// What a Gemini call actually cost, in tokens.
//
// Every model here is priced per million tokens, so the only way to know
// what a feature costs is to count what it spends. Reading the pricing
// page answers what a token costs, never how many a scorecard takes --
// and images, which dominate import, are exactly where an estimate is
// least trustworthy.
//
// FIRE AND FORGET, ALWAYS.
//
// Nothing in here may break a feature. A bowler waiting on their insight
// does not care whether we recorded the token count, and observability
// that can take down the thing it observes is worse than none: it turns
// a working feature into a broken one for the sake of a number nobody is
// reading at that moment. So every failure is caught and logged, and the
// caller is never made to await the result.

import { createClient } from "jsr:@supabase/supabase-js@2";

// Gemini's own response shape. thoughtsTokenCount only appears on
// thinking-capable models and is absent elsewhere.
interface GeminiUsageMetadata {
  promptTokenCount?: number;
  candidatesTokenCount?: number;
  thoughtsTokenCount?: number;
  totalTokenCount?: number;
}

function asCount(value: unknown): number {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n);
}

/**
 * Record one Gemini call's token usage.
 *
 * Deliberately NOT awaited by callers -- see the note above. Returns a
 * promise only so tests can await it when they want determinism.
 *
 * @param variant  Which kind of call, for endpoints that make more than
 *                 one. For import-scorecard: "count", "extract" or
 *                 "detailed". The extract-to-detailed ratio is the
 *                 escalation rate, and the escalation path is the only
 *                 one on the model whose price doubles in January 2027.
 */
export async function recordAiTokens(
  req: Request,
  endpoint: string,
  model: string,
  usage: unknown,
  variant?: string,
): Promise<void> {
  try {
    const u = (usage ?? {}) as GeminiUsageMetadata;

    const prompt = asCount(u.promptTokenCount);
    // Thinking tokens bill as output. Counting only candidatesTokenCount
    // would under-report the cost of any thinking-capable model, and
    // under-reporting is the failure mode that matters here -- a budget
    // built on it is wrong in the expensive direction.
    const output = asCount(u.candidatesTokenCount) + asCount(u.thoughtsTokenCount);

    // No usageMetadata at all means a response shape we don't recognise
    // (or an error body). Recording a zero row would quietly pad the call
    // count with calls we know nothing about.
    if (prompt === 0 && output === 0) return;

    // Built here rather than passed in. The callers create their Supabase
    // clients inside whichever helper needs one, so at the point a Gemini
    // response is parsed there is usually no client in scope -- and
    // threading one through every call path, to serve telemetry, would
    // put this concern into signatures that have nothing to do with it.
    //
    // The bowler's own Authorization header, not the service role:
    // record_ai_tokens runs as the caller so auth.uid() identifies them,
    // exactly as the rate limiter does.
    const auth = req.headers.get("Authorization");
    if (!auth) return;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: auth } } },
    );

    const { error } = await supabase.rpc("record_ai_tokens", {
      p_endpoint: endpoint,
      p_model: model || "unknown",
      p_variant: variant ?? null,
      p_prompt: prompt,
      p_output: output,
    });

    if (error) {
      console.error(`token recording failed for ${endpoint}:`, error.message);
    }
  } catch (e) {
    console.error(`token recording threw for ${endpoint}:`, String(e));
  }
}
