// Supabase Edge Function: nightcap
//
// One league night, read back to the bowler in a human voice.
//
// Takes PRE-COMPUTED facts (never raw shot rows) from src/domain/nightcap.js
// and returns two or three of them, chosen and phrased. The model does no
// arithmetic here at all -- every number in its output was handed to it in
// a sentence that already contained that number. There is no arrangement
// of those sentences that produces a wrong figure, which is the entire
// reason the split exists.
//
// Why a model at all, when the app already has a deterministic recap:
// the deterministic recap says the same shape of thing every week ("185
// average over 3 games -- 12 above your average") and a bowler stops
// reading it. The job here is SELECTION and VOICE -- which two of eleven
// true things were worth saying tonight, said the way a friend would say
// them on the walk out. That is the part a template cannot do.
//
// Deploy with: supabase functions deploy nightcap
// Secrets required: gemini_api_key, ALLOWED_ORIGINS (both lowercase-safe)

import { createClient } from "jsr:@supabase/supabase-js@2";

const GEMINI_API_KEY = Deno.env.get("gemini_api_key");
const MODEL = Deno.env.get("nightcap_gemini_model") || "gemini-3.6-flash";
const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

// Takes its CORS headers as an argument rather than reading a module-level
// constant -- see analyze-performance for the ReferenceError this shape
// prevents.
function json(body: unknown, cors: Record<string, string>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    opener: {
      type: "string",
      description: "One sentence naming how the night went, using the scores given. No greeting, no bowler's name.",
    },
    notes: {
      type: "array",
      description: "Two or three observations. Two is the normal number. Never pad to three.",
      items: { type: "string" },
    },
    // Nullable on purpose. A night with nothing to work on must be
    // allowed to end without homework -- a nudge invented to fill this
    // field is the exact failure this feature exists to avoid.
    nudge: {
      type: "string",
      description: "One conditional suggestion for next week, or omit entirely when the facts do not support one.",
    },
  },
  required: ["opener", "notes"],
};

const SYSTEM_PROMPT = `You are writing a "Nightcap" -- a short read-back of ONE night of league bowling, shown to the bowler on the results screen when the night ends.

WHAT YOU RECEIVE
A list of facts about tonight, already computed and already correct. Each carries its own numbers and its own sample.

HARD RULES
1. Use ONLY the facts supplied. Never compute, estimate, combine or infer a number. Every figure you print must appear in a supplied fact exactly as given.
2. This is ONE NIGHT. Never say "you tend to", "you usually", "your game is", "lately", or anything else spanning more than tonight. Three games cannot support a pattern and claiming one is the single worst thing you can do here.
3. Never diagnose technique. You did not watch the delivery. "Your leaves were on the right" is an observation and allowed. "You were coming up light" is a claim about a throw nobody recorded, and is not -- UNLESS a fact says the bowler logged that miss themselves, in which case it is their own account and you may state it.
4. Pick the two or three facts most worth saying. Skip the rest silently. Do not list, do not summarise everything, do not mention that you left things out.
5. The opener states how the night went. Facts about side, splits, carry and spares belong in the notes -- a bowler already knows what they shot.
6. A percentage in a supplied fact is already a percentage. Quote it exactly; the bowler is looking at the same number on the same screen.

THE NUDGE
At most one, and only when a fact actually supports it. Phrase it as a condition the bowler can check against what they felt, never as a verdict: "if you were coming up heavy, that is the adjustment to make earlier next week" -- not "you were coming up heavy". If nothing supports a nudge, omit the field. A clean night is allowed to just be a clean night.

TONE
A friend who was two lanes over, saying something on the way out. Warm, plain, short. Not a coach. Not a cheerleader. Do not open with a greeting or the bowler's name. Do not praise a bad night or console a good one. Say the true thing.

LENGTH
Opener: one sentence. Each note: one or two sentences. Nudge: one sentence. The whole thing should be readable in about fifteen seconds.`;

// Requires a real, signed-in user before spending anything. Identical in
// shape to the other three functions: the anon key plus the caller's own
// Authorization header, and getUser() validating that JWT rather than
// trusting it.
async function requireUser(req, cors) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return { user: null, response: json({ error: "Not authenticated" }, cors, 401) };
  }
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_ANON_KEY"),
    { global: { headers: { Authorization: authHeader } } },
  );
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return { user: null, response: json({ error: "Not authenticated" }, cors, 401) };
  }
  return { user, response: null };
}

// Fails SAFE, not open -- see analyze-performance for why both failure
// paths returning true made every signed-in account unlimited against a
// billed API, silently.
const fallbackHits = new Map<string, number[]>();

function withinFallbackLimit(userId: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (fallbackHits.get(userId) || []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    fallbackHits.set(userId, recent);
    return false;
  }
  recent.push(now);
  fallbackHits.set(userId, recent);
  if (fallbackHits.size > 5000) {
    for (const [k, v] of fallbackHits) {
      if (!v.some((t) => now - t < windowMs)) fallbackHits.delete(k);
    }
  }
  return true;
}

async function withinRateLimit(req, endpoint, limit, windowInterval, userId, windowMs) {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_ANON_KEY"),
      { global: { headers: { Authorization: req.headers.get("Authorization") } } },
    );
    const { data, error } = await supabase.rpc("check_api_rate_limit", {
      p_endpoint: endpoint,
      p_limit: limit,
      p_window: windowInterval,
    });
    if (error) {
      console.error(`rate limit check failed for ${endpoint}, falling back:`, error.message);
      return withinFallbackLimit(userId, limit, windowMs);
    }
    return data !== false;
  } catch (e) {
    console.error(`rate limit check threw for ${endpoint}, falling back:`, String(e));
    return withinFallbackLimit(userId, limit, windowMs);
  }
}

// Shared-secret origin list, same as the other three. An unconfigured
// deploy falls back to "*" deliberately, so a missing secret degrades to
// working rather than to every request being rejected.
function corsFor(req) {
  const configured = (Deno.env.get("ALLOWED_ORIGINS") || "").split(",").map(s => s.trim()).filter(Boolean);
  const origin = req.headers.get("Origin") || "";
  const allow = configured.length === 0
    ? "*"
    : (configured.includes(origin) ? origin : configured[0]);
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Vary": "Origin",
  };
}

// Deno.serve, not the std/http `serve` import -- the pinned deno.land
// import has to be fetched at boot, and a failed fetch means the function
// never starts and the client sees only "Failed to send a request to the
// Edge Function".
Deno.serve(async (req) => {
  const CORS = corsFor(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  // Auth BEFORE the key check: an unauthenticated caller should get a
  // 401, not a hint about whether the server is configured.
  const auth = await requireUser(req, CORS);
  if (auth.response) return auth.response;

  // A nightcap is poured once a night. Ten an hour leaves room for a
  // retry, a second bowler being scored on the same phone, and a
  // curious tap or two, without leaving the budget open.
  if (!(await withinRateLimit(req, "nightcap", 10, "1 hour", auth.user.id, 60 * 60 * 1000))) {
    return json({
      error: "That's a few nightcaps in one hour. Give it a little while and try again.",
    }, CORS, 429);
  }

  if (!GEMINI_API_KEY) {
    return json({ error: "Nightcap isn't configured on the server." }, CORS, 500);
  }

  try {
    const { payload } = await req.json();
    const facts = Array.isArray(payload?.facts)
      ? payload.facts.filter((f) => typeof f === "string" && f.trim())
      : [];

    // Defence in depth. The client already refuses to call with a thin
    // night, but an empty fact list must never reach the model: there
    // would be nothing to select from and it would write something
    // anyway.
    if (facts.length < 2) {
      return json({ error: "Not enough logged tonight for a nightcap." }, CORS, 400);
    }

    const serialised = JSON.stringify(facts);
    if (facts.length > 16 || serialised.length > 3_000) {
      console.warn("nightcap: oversized payload rejected", facts.length, serialised.length);
      return json({ error: "Payload too large." }, CORS, 413);
    }

    const userPrompt = [
      `Games: ${payload?.games ?? "unknown"}. First balls logged: ${payload?.firstBalls ?? "unknown"}.`,
      "",
      "Facts about tonight:",
      ...facts.map((f) => `- ${f}`),
    ].join("\n");

    // A bowler is standing at the end of a lane waiting for this, so the
    // timeout is shorter than the analysis function's: a nightcap that
    // takes forty-five seconds has already failed at its job even if it
    // eventually arrives.
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);

    let res;
    try {
      res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: "user", parts: [{ text: userPrompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: RESPONSE_SCHEMA,
            // Higher than the analysis function's 0.2, and deliberately
            // so. That one is reporting, where variation between runs on
            // identical data would undermine trust. This one is voice --
            // a bowler sees it thirty times a season, and thirty
            // identically-shaped sentences is the template it was built
            // to replace.
            temperature: 0.7,
          },
        }),
      });
    } catch (e) {
      clearTimeout(timer);
      if (e?.name === "AbortError") {
        return json({ error: "The nightcap took too long. Tap to try again." }, CORS, 504);
      }
      throw e;
    }

    clearTimeout(timer);

    if (!res.ok) {
      const detail = await res.text();
      console.error("Gemini error", res.status, detail);
      return json({ error: `Couldn't pour the nightcap (${res.status}). Tap to try again.` }, CORS, 502);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.error("Gemini returned no text", JSON.stringify(data).slice(0, 500));
      return json({ error: "The nightcap came back empty. Tap to try again." }, CORS, 502);
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      console.error("Unparseable nightcap", text.slice(0, 500));
      return json({ error: "The nightcap came back malformed. Tap to try again." }, CORS, 502);
    }

    const notes = Array.isArray(parsed.notes)
      ? parsed.notes.filter((n) => typeof n === "string" && n.trim()).slice(0, 3)
      : [];

    // An opener alone is not a nightcap -- it is the score, which the
    // bowler is already looking at. Better to say it failed and let them
    // tap again than to show a card that restates the scoreboard.
    if (!notes.length) {
      console.error("nightcap: model returned no notes", text.slice(0, 300));
      return json({ error: "The nightcap came back thin. Tap to try again." }, CORS, 502);
    }

    return json({
      opener: typeof parsed.opener === "string" ? parsed.opener.trim() : "",
      notes,
      nudge: typeof parsed.nudge === "string" && parsed.nudge.trim() ? parsed.nudge.trim() : null,
      generatedAt: new Date().toISOString(),
      // Echoed back so the UI can show what it was drawn from rather
      // than presenting conclusions with no visible basis.
      basedOn: { games: payload?.games ?? null, firstBalls: payload?.firstBalls ?? null },
    }, CORS);
  } catch (err) {
    console.error("nightcap failed", err);
    return json({ error: "Couldn't pour the nightcap just then. Tap to try again." }, CORS, 500);
  }
});
