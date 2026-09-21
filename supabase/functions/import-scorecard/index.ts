// Supabase Edge Function: import-scorecard
//
// Receives one or more scorecard screenshot images (e.g. from LaneTalk),
// sends them to Google's Gemini API for vision extraction, and returns
// structured frame-by-frame data shaped to match this app's own `shots`
// model as closely as possible -- so the client-side conversion step is
// close to a direct field mapping, not a translation.
//
// Uses Gemini specifically because it has a genuine, permanent free tier
// for this kind of vision-understanding call (not image generation, which
// is priced differently) -- see the project's ideas discussion for why.
// The API key lives here, server-side, specifically so it's never exposed
// in the client-side bundle where anyone could extract and abuse it.
//
// Deploy with: supabase functions deploy import-scorecard
// Requires a GEMINI_API_KEY secret set via:
//   supabase secrets set GEMINI_API_KEY=your-key-here
// Get a free key (no credit card required) at https://aistudio.google.com

import { createClient } from "jsr:@supabase/supabase-js@2";
import { recordAiTokens } from "../_shared/aiUsage.ts";
import { geminiKey } from "../_shared/geminiKey.ts";

// Read through _shared/geminiKey.ts, which accepts both spellings the
// secret has been stored under. This line used to do that itself, until a
// case-insensitive find-and-replace made both halves identical and left
// every AI feature reporting "no key" at once. See that file.
const GEMINI_API_KEY = geminiKey();
// Kept in step with analyze-performance, which was migrated to this model
// already. gemini-2.5-flash was retired for new callers and returns a 404
// -- which surfaced here as a bare "Gemini API error" for a while because
// the client was discarding the detail the function sent alongside it.
// The counting phase asks for almost nothing, so it answers fast.
const COUNT_SCHEMA = {
  type: "object",
  properties: {
    bowlerCount: { type: "integer", nullable: true, description: "How many different bowlers appear." },
    gameCount: { type: "integer", nullable: true, description: "How many games EACH bowler bowled, as shown on this card." },
    bowlerNames: {
      type: "array",
      nullable: true,
      items: { type: "string" },
      description: "Each bowler's name exactly as printed, in the order they appear.",
    },
  },
  required: ["gameCount"],
};

const COUNT_PROMPT = `Look at this bowling scorecard and answer only these questions.

How many DIFFERENT bowlers are on it? Count every row or column with a name.
How many GAMES does each bowler have? A card usually shows 3.
What is each bowler's name, exactly as printed?

Do not transcribe any scores or frames. Do not explain. Answer with JSON only.`;

// The model, overridable WITHOUT a code deploy.
//
// Free-tier limits are per model and can be brutal -- gemini-3.6-flash
// allows 5 requests a minute and 20 a DAY, which four failed imports with
// retries will exhaust before lunch. Trying a different model should be a
// dashboard change, not an edit, a commit and a deploy.
//
// Set IMPORT_GEMINI_MODEL as a Supabase secret to switch. The constant is
// the fallback, so nothing changes until the secret exists.
//
// Model IDs are checked at the call, not here -- a wrong one returns a
// 404 the client already explains as "pointed at a model that's no longer
// available", which is the right message for a typo in a secret.
const GEMINI_MODEL = Deno.env.get("IMPORT_GEMINI_MODEL")?.trim()
  || "gemini-3.6-flash";

// The model used when the FAST one saw frame detail it could not read.
//
// Lite reads scores in 15s and does not read pin decks at all. That is the
// right trade for a results screen and the wrong one for a scorecard, so a
// card that has frames and came back without them is retried here.
//
// Separate secret, because the two models are chosen for opposite
// reasons: one for speed on easy cards, one for capability on hard ones.
const GEMINI_MODEL_DETAILED = Deno.env.get("IMPORT_GEMINI_MODEL_DETAILED")?.trim()
  || "gemini-3.6-flash";

// Where the detailed read goes when its model is BUSY.
//
// Google answers a popular model with 503 "experiencing high demand" --
// seen on gemini-3.8-flash on 21 Sep, three times running, which left a
// scorecard with frames imported as scores only. Waiting does not help a
// bowler standing at the lanes; another capable model does. Tried in
// order, only on busy/overloaded/unavailable answers (503, a rate-limit
// 429, 404, a timeout) -- never on a bad request or an exhausted quota,
// where the next model would fail the same way.
//
// Comma-separated secret to change it without a deploy.
const DETAILED_FALLBACKS = (Deno.env.get("IMPORT_GEMINI_MODEL_FALLBACKS") ?? "gemini-3.7-flash,gemini-3.6-flash")
  .split(",").map((m) => m.trim()).filter(Boolean);
// Built per request, because the model varies: the fast one by default,
// the detailed one on a retry.
//
// The ?key= is NOT optional and is easy to lose in a refactor -- doing so
// returns a 403 "Method doesn't allow unregistered callers", which reads
// like a permissions problem with the function rather than a missing
// query parameter. It cost a deploy and an import to find.
const geminiUrlFor = (model: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

// One uniform shape for every frame, 1 through 10. Each frame is just a
// list of the actual deliveries (balls) physically thrown in it, each with
// its own strike/pins-standing observation -- Gemini reports raw physical
// facts, not this app's internal data-modeling conventions for how frame
// 10 splits across separate vs. embedded shot records. That translation
// happens in tested client-side code instead, since asking a vision model
// to reason about an app-specific data model on top of reading the image
// is a needless extra source of error.
//
// Frames 1-9 have 1 ball (if a strike) or 2 balls (if not). Frame 10 has
// 2 or 3 balls, depending on strikes/spares -- the client-side conversion
// figures out how many balls SHOULD exist and only trusts what's present.
// A COMPACT ball. The pin list is a string, not an array of strings.
//
// This is the app's biggest output cost. A full scorecard is thirty
// frames, roughly sixty deliveries, and every one was emitting a nested
// array: ["4","6","7","10"] -- brackets, quotes and commas around each
// digit. As a plain "4,6,7,10" it says the same thing in about half the
// tokens, and output tokens are what made a 247KB image take 61 seconds.
//
// The client accepts BOTH shapes, so an older deployed function keeps
// working and this can be rolled back without a matching client change.
const BALL_SCHEMA = {
  type: "object",
  properties: {
    ballIndex: { type: "integer", description: "1, 2, or 3 -- which delivery within the frame this is" },
    isStrike: { type: "boolean" },
    pinsStanding: {
      // An ARRAY of pin numbers, not a string, and not a count.
      //
      // This was changed to a comma-separated string to cut output tokens.
      // It cut accuracy instead: a string field invites a NUMBER, and the
      // model started answering with how many pins were standing rather
      // than which ones. A 6-10 spare came back as "2".
      //
      // That is invisible downstream -- "2" is a valid pin number -- so it
      // silently became a 2-pin leave, and every frame collapsed into
      // strike, 9-open or 9-spare.
      //
      // An array of identities cannot be mistaken for a count. The token
      // saving was never worth this, and was never measured against a real
      // import before shipping.
      type: "array",
      items: { type: "string" },
      description: "WHICH pins are left standing after THIS delivery, as their numbers 1-10 read from the pin-deck graphic -- for example [\"6\",\"10\"] for a 6-10 split, or [\"4\",\"6\",\"7\",\"10\"] for the big four. This is the IDENTITY of each standing pin, NEVER a count: two pins standing is [\"6\",\"10\"], not [\"2\"]. Empty array if isStrike is true, or if this delivery cleared every pin that was left.",
    },
  },
  required: ["ballIndex", "isStrike", "pinsStanding"],
};

const FRAME_SCHEMA = {
  type: "object",
  properties: {
    frameNumber: { type: "integer", description: "1 through 10" },
    balls: {
      type: "array",
      items: BALL_SCHEMA,
      description: "Every delivery physically thrown in this frame, in order. Frames 1-9: 1 ball if a strike, 2 if not. Frame 10: 2 or 3 balls depending on strikes/spares earned -- only include balls actually shown, never guess or pad to a fixed count. Omit this entirely if the scorecard shows no per-frame detail.",
    },
  },
  required: ["frameNumber", "balls"],
};

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    // Does this card SHOW frame detail?
    //
    // Empty frames are ambiguous on their own: a results screen has none,
    // and a scorecard the model failed to read has none either. Those
    // need opposite responses -- accept, or retry on a stronger model --
    // and they are indistinguishable from the output alone.
    //
    // SEEING pin decks is far easier than reading thirty of them, so even
    // a model that cannot transcribe them can answer this.
    hasFrameDetail: {

      type: "boolean",

      // NOT nullable, and required below. A model free to omit this
      // omits it -- and an absent answer reads the same as "no frames",
      // so the escalation never fires on the card that needs it.

      description: "True if this scorecard shows per-frame detail -- pin-deck graphics, frame boxes, or per-frame marks like X and /. False if it shows only game totals and series, as a results or standings screen does.",
    },
    // COUNT THE BOWLERS FIRST.
    //
    // A four-bowler team card was returning one bowler -- always the top
    // row -- with the other three silently absent. The instructions
    // already said to return everyone; the model agreed and then did not.
    //
    // Asking for the count as its own field makes the model read the
    // whole card before it starts transcribing, and gives the client a
    // number to check the result against. A schema field is much harder
    // to skip than a sentence of prose.
    bowlerCount: {
      type: "integer",
      nullable: true,
      description: "How many DIFFERENT bowlers appear on this scorecard. Count every row or column with a name, even if you cannot read all of their scores. A team card usually shows 4 or 5.",
    },
    // FLAT list of games, exactly as this schema was before team support

    // was added -- one bowler per game, identified by bowlerName, rather
    // than games nested inside a bowlers array.
    //
    // The nested version added a level (bowlers > games > frames > balls
    // > pinsStanding) to a schema that already sat five deep, and Gemini
    // rejects a responseSchema past its complexity limit. Carrying the
    // bowler on each game keeps the depth identical to the version that
    // demonstrably worked, and the client groups by bowlerName.
    games: {
      type: "array",
      items: {
        type: "object",
        properties: {
          bowlerName: { type: "string", nullable: true, description: "The bowler this game belongs to, exactly as printed on the scorecard including abbreviations (e.g. 'R. Nadon'). Null on a single-bowler card with no name shown." },
          lineupPosition: { type: "integer", nullable: true, description: "Zero-based position of this bowler's column on the card, in the order bowlers appear." },
          // The SCRATCH series -- pins actually knocked down.
          //
          // "Series total" alone got the handicap column on a card that
          // prints both: 129+156+141 is 426 scratch, printed as 498 with
          // a 72 handicap. Handicap is league bookkeeping, not a bowling
          // result, and storing it would inflate every average and stat
          // built on it.
          //
          // It also destroys the only check available on a scores-only
          // import: the games must add to the scratch series exactly. A
          // near-enough comparison against a handicap total checks
          // nothing.
          seriesTotal: { type: "integer", nullable: true, description: "This bowler's SCRATCH series -- the sum of their game scores, with NO handicap added. If the card shows both a scratch and a handicap or total column, take the scratch one. If it shows only one series number and a separate handicap column, subtract the handicap. Null if the card prints no series at all." },
          handicap: { type: "integer", nullable: true, description: "This bowler's handicap for the night, if the card prints one in its own column. Null if the card shows no handicap. Do not calculate or guess it." },
          gameNumber: { type: "integer" },
          ballUsed: { type: "string", nullable: true, description: "The ball name shown for this game, if visible (e.g. 'Bionic'). Null if not shown or not legible." },
          frames: { type: "array", items: FRAME_SCHEMA },
          totalScore: { type: "integer", nullable: true, description: "The game's final score as printed on the scorecard, if visible. Null if not shown or not legible." },
        },
        required: ["gameNumber"],
      },
    },
  },
  required: ["games", "hasFrameDetail"],
};

// The schema for the DETAILED retry: frames REQUIRED on every game.
//
// In RESPONSE_SCHEMA only gameNumber is required, because a results screen
// has no frames and must still validate. But structured output treats an
// optional field as optional -- and on 21 Sep gemini-3.6-flash and
// 3.7-flash answered hasFrameDetail:true with no frames at all, three
// times, even when the prompt said an empty array was wrong for this card.
// The retry only runs for a card already known to show frames, so there
// the schema can insist: every game carries at least one frame.
const DETAILED_SCHEMA = {
  ...RESPONSE_SCHEMA,
  properties: {
    ...RESPONSE_SCHEMA.properties,
    games: {
      ...RESPONSE_SCHEMA.properties.games,
      items: {
        ...RESPONSE_SCHEMA.properties.games.items,
        properties: {
          ...RESPONSE_SCHEMA.properties.games.items.properties,
          frames: { type: "array", items: FRAME_SCHEMA, minItems: 1,
            description: "Every frame of this game, 1 through 10, read from the pin-deck graphics and marks. This card shows frame detail, so this must not be empty." },
        },
        // bowlerName required too (it may still be null). Optional, the
        // retry dropped it and the card came back as "?" -- the name was
        // on the card and the fast read had it.
        required: ["gameNumber", "frames", "bowlerName", "totalScore"],
      },
    },
  },
};

const EXTRACTION_PROMPT = `You are reading a bowling scorecard screenshot (from an app called LaneTalk). Extract every game and frame shown into the exact JSON shape requested.

THE PIN NUMBERING. Read this before naming any pin.

A rack is a triangle with its point toward the bowler. Seen from above, the way
a scorecard draws it, the rows from BACK to FRONT are:

    7  8  9  10      <- back row, four pins, LEFT to RIGHT
      4  5  6        <- three pins
        2  3         <- two pins
          1          <- head pin, nearest the bowler

So 7 is the BACK LEFT corner and 10 is the BACK RIGHT corner. 4 is on the LEFT
side, 6 is on the RIGHT side. 2 is LEFT of centre, 3 is RIGHT of centre.

LEFT AND RIGHT ARE THE MOST COMMON MISTAKE. A 4-7 leave (both on the left) and
a 6-10 leave (both on the right) are mirror images of each other and look almost
identical if you lose track of which side is which. Check the horizontal
position of every standing pin against the row it is in before you name it:

- a pin in the back row at the far left is 7, at the far right is 10
- a pin in the three-pin row at the left is 4, centre is 5, right is 6
- a pin in the two-pin row at the left is 2, at the right is 3

Do not infer the pins from the score. A 2-count leave could be 4-7, 6-10, 2-8,
or several others -- only the graphic tells you which, and getting the count
right while getting the identities wrong is worse than useless.

For each frame, focus on the small triangular pin-deck graphic above the frame's score box, not just the text notation -- the graphic shows which of the 10 pins were knocked down (typically colored/filled) versus left standing (typically gray/outlined) after each ball thrown. Standard ten-pin numbering: pin 1 is the headpin at the front; pins 2-3 are the next row back; pins 4-6 the next; pins 7-10 are the back row.

Report each frame as a plain, ordered list of the actual deliveries (balls) physically thrown in it -- do not try to interpret bowling scoring rules or bonus-ball logic, just describe what you see, ball by ball, in the order thrown:

- Frames 1-9: report 1 ball if it was a strike (all 10 pins down), or 2 balls if not (the first ball's leave, then the second ball's result on whatever remained).
- Frame 10: report every ball actually shown for that frame -- this could be 2 or 3 balls depending on strikes and spares earned, but only report what the screenshot actually shows. Do not guess or invent a ball that isn't visibly recorded.

For each ball, read the pin-deck graphic carefully to determine EXACTLY which pin numbers were left standing immediately after that specific delivery -- this is the most important and most error-prone part, so take your time with it. An empty list means either a strike (if the first ball of a fresh rack) or that the delivery cleared every pin that was still standing (a spare/conversion on a later ball in the frame).

If a game's ball name is shown as a tag/label near that game, include it. If not visible or you're unsure, use null rather than guessing.

Also record each game's final printed score in totalScore when the scorecard shows one.

IMPORTANT -- some scorecards show only game totals with no per-frame detail at all (no pin-deck graphics, no frame boxes). That is a valid and common case, not a failure. When that happens, return the games with their totalScore and an empty frames array. Do not invent frames to fill the gap.

ALSO set hasFrameDetail. This is about what the card SHOWS, not about what you
managed to read. If the card has pin-deck graphics, frame boxes, or per-frame
marks like X and / anywhere on it, set hasFrameDetail to true -- even if you
cannot make out the individual pins, and even if you return no frames at all.
Set it to false ONLY for a card that shows nothing but game totals and series,
like a results or standings screen.

Answering true and returning no frames is expected and useful. Answering false
about a card that plainly shows frames is a mistake.

BEFORE TRANSCRIBING ANYTHING, count the bowlers. Look down the whole card and
count every row (or column) that has a name against it. Put that number in
bowlerCount. Then transcribe EVERY one of them.

Returning only the first bowler is the single most common mistake on these
cards. If the card shows four names, "games" must contain that bowler's games
FOUR times over -- once per bowler -- not just the first name's. A results
screen listing Dayton, Zack, Connor and Ryan with three games each is twelve
entries, and bowlerCount is 4.

Do not stop after the first row. Do not summarise. Do not omit a bowler because
their scores look similar to another's, because their name is hard to read, or
because they bowled the same score three times -- 174, 174, 174 is a real and
common result.

TEAM SCORECARDS -- many scorecards show a whole team, one column or row per bowler. Return EVERY bowler's games in the single flat "games" list, and tag each game with who it belongs to:
- bowlerName exactly as printed, including abbreviations ("R. Nadon", "RYAN N"). Do not expand, correct, or guess at a fuller name; the app matches the printed text itself.
- lineupPosition as the zero-based position of that bowler's column, in the order bowlers appear on the card.
- seriesTotal as the SCRATCH series (no handicap), repeated on each of their games.
- handicap separately if the card prints one. Never fold it into seriesTotal.
So a four-bowler team playing three games each returns twelve entries in "games", not four. On a single-bowler card, bowlerName may be null.

Repeat bowlerName and lineupPosition on EVERY game belonging to that bowler -- not just their first one. Game 2 and game 3 of the same bowler must each carry that bowler's name and position, otherwise there is no way to tell whose game it is.

Respond with valid JSON matching the provided schema exactly. If a screenshot shows partial or cut-off games, only include complete frames you can actually read clearly from the pin-deck graphic -- do not guess or fabricate a frame or ball you can't clearly see.`;

// Per-user ceiling. This is the most expensive of the three functions --
// up to six images through a vision model per call -- so it gets the
// tightest limit. Auth already stops a stranger; this stops one account
// looping.
//
// Fails OPEN: a broken rate limiter should degrade to "no limit", not
// "nobody can import". Auth is the security boundary; this is cost control.
async function withinRateLimit(req, endpoint, limit, windowInterval) {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_ANON_KEY"),
      { global: { headers: { Authorization: req.headers.get("Authorization") } } },
    );
    const { data, error } = await supabase.rpc("check_api_rate_limit", {
      p_endpoint: endpoint, p_limit: limit, p_window: windowInterval,
    });
    if (error) {
      // FAIL CLOSED. A limiter that opens on failure is not a limiter.
      //
      // This returned true when the check itself failed, so a database
      // fault -- or anything that reliably breaks the RPC -- let every
      // request through unmetered. That is the exact condition under
      // which a limit matters most, and it is reachable on purpose.
      //
      // The cost of closing is that a database problem also stops
      // imports. That is the right way round: a bowler who cannot import
      // for ten minutes is inconvenienced, an uncapped image endpoint
      // billed per token is a bill with no ceiling.
      console.error("rate limit check failed, denying:", endpoint, error.message);
      return "unavailable";
    }
    return data !== false ? true : "limited";
  } catch (e) {
    console.error("rate limit check threw, denying:", endpoint, String(e));
    return "unavailable";
  }
}

// Allowed origins, rather than "*".
//
// Auth is the real boundary -- a stranger's browser now gets a 401 -- but
// "*" lets any site on the internet make credentialed calls to these
// endpoints from a victim's browser, and these three spend money against
// external API keys. Pinning the origin is cheap defence in depth.
//
// ALLOWED_ORIGINS is a comma-separated env var so the origin can change
// (custom domain, preview deploys) without a code change. If it isn't set
// the function falls back to "*" -- deliberately, so an unconfigured
// deploy keeps working rather than locking every request out; set it in
// production.
function corsFor(req) {
  const configured = (Deno.env.get("ALLOWED_ORIGINS") || "").split(",").map(s => s.trim()).filter(Boolean);
  const origin = req.headers.get("Origin") || "";
  const allow = configured.length === 0
    ? "*"
    : (configured.includes(origin) ? origin : configured[0]);
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    // Tells caches the response varies per origin, so a permissive cached
    // response can't be served to a different site.
    "Vary": "Origin",
  };
}

// ── The paywall, server side ────────────────────────────────────────
//
// Mirrors BILLING_LIVE in src/domain/entitlements.js, and the client's
// copy of the status logic mirrors public.is_subscriber(). The client
// decides what to SHOW; this decides what to SERVE, and this is the one
// that matters -- the anon key ships in every copy of the app, so a
// check that only runs in the browser is a courtesy, not a boundary.
//
// OFF by default. Turning it on before purchases work would lock out
// every existing bowler, because nobody has an entitlement row yet. Set
// the secret BILLING_LIVE to "true" in the same release that ships Play
// Billing and Stripe -- and not one release earlier.
const BILLING_LIVE = (Deno.env.get("BILLING_LIVE") || "").trim().toLowerCase() === "true";

// FAILS OPEN, deliberately -- the opposite of the rate limit above, and
// worth understanding before anyone "fixes" it.
//
// The two failures are not symmetrical. A broken rate-limit check that
// lets a request through costs one Gemini call. A broken entitlement
// check that blocks one turns a bowler who has paid into a bowler
// staring at a padlock on league night with a receipt in their inbox.
// The first is a rounding error; the second is a refund and a review.
//
// The bypass this theoretically opens needs the database itself to be
// failing, which is not a state a caller can put it in.
async function hasSubscription(req: Request): Promise<boolean> {
  if (!BILLING_LIVE) return true;
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } },
    );
    const { data, error } = await supabase.rpc("is_subscriber");
    if (error) {
      console.error("is_subscriber check failed, allowing through:", error.message);
      return true;
    }
    return data === true;
  } catch (e) {
    console.error("is_subscriber threw, allowing through:", String(e));
    return true;
  }
}

Deno.serve(async (req) => {
  // When this request started, for the time budget below.
  const t0 = Date.now();
  const corsHeaders = corsFor(req);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!GEMINI_API_KEY) {
      // The setup instructions go to the function log, where the person who
      // can act on them looks. A bowler was shown this paragraph verbatim.
      console.error("import-scorecard: no Gemini key. Set GEMINI_API_KEY in Project Settings > Edge Functions > Secrets.");
      return new Response(JSON.stringify({
        error: "The scorecard reader isn't available right now.",
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Require a real, signed-in user -- this costs API quota, so it
    // shouldn't be callable by anyone who happens to find the URL.
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_ANON_KEY"),
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Paid, and checked here rather than only in the browser.
    //
    // This was briefly a free allowance of one import a week. It came out
    // because one a week is exactly one league night -- so the free tier
    // covered a single-league bowler's entire use of the feature, forever,
    // and walled off nobody it was meant to. The 30-day trial is where a
    // new bowler gets to see what import does, several times, on real
    // league nights.
    //
    // Removing it also removed the worst gap in the paywall: the weekly
    // counter recorded BEFORE the model ran, so an import that failed with
    // a 502 cost a free bowler their whole week.
    if (!(await hasSubscription(req))) {
      return new Response(JSON.stringify({
        error: "Scorecard import is part of the paid plan.",
        upgrade: true,
      }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Three outcomes, not two: allowed, over the limit, or the check
    // itself is broken. Failing closed is right, but saying "you have
    // imported a lot" when the database is down sends a bowler away to
    // wait out a limit they never hit.
    const limitState = await withinRateLimit(req, "import-scorecard", 20, "1 hour");
    if (limitState === "unavailable") {
      return new Response(JSON.stringify({
        error: "The import service can't check its limits right now. Try again shortly.",
        reason: "limit_unavailable",
        requestId,
      }), { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (limitState !== true) {
      return new Response(JSON.stringify({
        error: "You've imported a lot in the last hour. Give it a little while and try again.",
      }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // mode / onlyGame drive a TWO-PHASE extraction.
    //
    // One request reading thirty frames of pin-deck detail took 61s. The
    // work is output tokens, not bandwidth -- the image is 247KB -- so the
    // fix is to ask for less per request and run them at once:
    //
    //   mode "count"  -> how many games and bowlers, and their names. A
    //                    tiny answer, so it comes back in a few seconds.
    //   onlyGame: N   -> the full schema, but one game. Ten frames each,
    //                    fired in parallel, so the wait is the slowest
    //                    single game rather than the sum of all of them.
    //
    // Neither is required. A request with neither behaves exactly as it
    // did before, which is the fallback when counting fails.
    // An id the bowler can quote and the logs can be searched by.
    //
    // Replaces returning the exception text: a stack trace or a raw
    // upstream payload tells an attacker about the server and tells a
    // bowler nothing. An id tells the bowler nothing either, which is the
    // point -- it is a handle into logs they cannot read.
    const requestId = crypto.randomUUID().slice(0, 8);

    const { images, mode, onlyGame, detailed, totalsOnly } = await req.json();
    // images: array of { base64: string, mimeType: string } -- one entry per uploaded screenshot
    if (!Array.isArray(images) || !images.length) {
      return new Response(JSON.stringify({ error: "No images provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (images.length > 6) {
      return new Response(JSON.stringify({ error: "Too many images in one request (max 6)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Size limits enforced HERE, not just in the client.
    //
    // The app downscales before uploading, but that's a courtesy to the
    // bowler's data plan, not a control -- nothing stops a caller skipping
    // the client and POSTing a 200MB body straight at this function, which
    // would then forward it to Gemini and bill for it.
    //
    // 8MB per image and 20MB total. The client no longer downscales --
    // resizing was destroying the small digits and pin-deck graphics the
    // model has to read -- so these now sit above a full-resolution phone
    // screenshot or photo, and still far below anything worth paying to
    // process. The client stops at 18MB total, just under this.
    const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
    const MAX_TOTAL_BYTES = 20 * 1024 * 1024;
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

    let totalBytes = 0;
    for (const img of images) {
      if (typeof img?.base64 !== "string" || !img.base64) {
        return new Response(JSON.stringify({ error: "One of the images was empty or malformed." }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const type = (img.mimeType || "image/jpeg").toLowerCase();
      if (!ALLOWED_TYPES.includes(type)) {
        return new Response(JSON.stringify({ error: `Unsupported image type: ${type}` }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      // base64 encodes 3 bytes as 4 characters, so decoded size is ~3/4
      // of the string length. Measured on the string to avoid decoding a
      // huge payload just to find out it's too big.
      const bytes = Math.floor(img.base64.length * 0.75);
      if (bytes > MAX_IMAGE_BYTES) {
        return new Response(JSON.stringify({ error: "One of the images is too large. Try a smaller photo." }), {
          status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      totalBytes += bytes;
    }
    if (totalBytes > MAX_TOTAL_BYTES) {
      return new Response(JSON.stringify({ error: "Those images come to too much to send at once. Try fewer at a time." }), {
        status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const counting = mode === "count";
    // The client sets detailed:true on the retry after a card reported
    // frame detail and returned none.
    const modelChain = detailed
      ? [...new Set([GEMINI_MODEL_DETAILED, ...DETAILED_FALLBACKS])]
      : [GEMINI_MODEL];
    let modelForRequest = modelChain[0];
    // Which models were tried and why they were passed over, for the log.
    const skipped: string[] = [];
    const gameFilter = Number.isInteger(onlyGame) && onlyGame > 0 ? onlyGame : null;

    // One game only. Said plainly and twice -- once as an instruction and
    // once as a restatement -- because a model reading a card full of
    // games will happily transcribe all of them otherwise.
    const gameSuffix = gameFilter
      ? `\n\nEXTRACT ONLY GAME ${gameFilter}. Ignore every other game on this card completely. Return exactly one entry in "games" per bowler, and set gameNumber to ${gameFilter} on each. Do not return game ${gameFilter === 1 ? 2 : 1} or any other game.`
      : "";

    // The detailed retry happens BECAUSE a first read said this card shows
    // frames. The base prompt goes out of its way to say empty frames are
    // acceptable -- right for a results screen, and exactly the permission
    // a careful model takes on a hard card: on 21 Sep gemini-3.6-flash and
    // 3.7-flash both answered "has frame detail" and returned zero frames,
    // while the Lite model on the same photo returned thirty. So the retry
    // withdraws that permission for this card.
    const detailedSuffix = detailed && !counting
      ? `\n\nTHIS CARD HAS BEEN CHECKED AND DOES SHOW PER-FRAME DETAIL. For this card, an empty frames array is WRONG. Transcribe every frame of every game you can see -- all ten frames per game, each ball's pins, marks for strikes (X) and spares (/). Use each frame's running total printed on the card to check your reading, and make each game's frames add up to its printed totalScore. Where a single pin is genuinely unreadable, give your best reading consistent with the running total rather than dropping the frame. Also give every game its bowlerName exactly as printed on the card, and its printed totalScore.`
      : "";

    // The bowler said this card is game totals only (the default). Frames
    // are not wanted, so asking for none also saves the output tokens that
    // dominate the time on a full card.
    const totalsSuffix = totalsOnly && !detailed && !counting
      ? `\n\nFOR THIS REQUEST, DO NOT TRANSCRIBE FRAMES. Return every bowler's games with bowlerName, lineupPosition, gameNumber, totalScore, seriesTotal and handicap, and an empty frames array on every game.`
      : "";

    const parts = [
      { text: counting ? COUNT_PROMPT : EXTRACTION_PROMPT + gameSuffix + detailedSuffix + totalsSuffix },
      ...images.map((img) => ({
        inline_data: { mime_type: img.mimeType || "image/jpeg", data: img.base64 },
      })),
    ];

    // 503 (model overloaded) and 429 (rate limited) are transient -- the
    // model is busy, not broken, and a spike usually clears in seconds.
    // Retrying here rather than showing the bowler an error means most
    // spikes never surface at all. Everything else fails immediately;
    // retrying a bad request just wastes the bowler's time.
    const requestBody = JSON.stringify({
      contents: [{ parts }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: counting ? COUNT_SCHEMA : (detailed ? DETAILED_SCHEMA : RESPONSE_SCHEMA),

        // NO thinking cap. It was tried at 512 and broke frame-level cards.
        //
        // The reasoning was that transcription needs no reasoning. That
        // holds for a results screen -- four names and twelve numbers --
        // and is wrong for a full scorecard, where thirty frames of
        // pin-deck graphics have to be read, and each frame's marks
        // reconciled against its running total.
        //
        // The symptom was not a wrong answer. It was three EMPTY games:
        // the model returned the shells it knew were there and gave up on
        // the contents. A cheap import that returns nothing is not fast,
        // it is broken.
        //
        // Speed has to come from somewhere that cannot cost accuracy.

        // Deterministic. Two imports of the same photo should not disagree,
        // and creative variation has no value when copying digits.
        temperature: 0,
      },
    });

    const RETRY_DELAYS_MS = [2000, 5000];
    let geminiRes: Response | null = null;
    let lastErrText = "";
    // Counts RETRIES, not attempts. Reporting the constant meant the
    // message claimed three retries when a request that failed twice had
    // been retried twice -- and a non-transient failure isn't retried at
    // all, so a fixed number would have been wrong there too.
    let retries = 0;

    // A HARD CEILING on each attempt.
    //
    // The call had no timeout and retries twice, so a slow or stuck
    // Gemini response left the bowler on a spinner with no end and no
    // error -- nothing was even written to diagnostics, because neither
    // the success nor the failure path was ever reached.
    //
    // 90s is deliberately generous: a full scorecard with thirty frames
    // of pin-deck detail is genuinely slow to read, and cutting a working
    // import short is worse than waiting. This exists to end a hang, not
    // to hurry a success.
    const ATTEMPT_TIMEOUT_MS = 90_000;

    // THE WHOLE REQUEST has a ceiling too: Supabase stops an Edge Function
    // at about 150s of wall clock and the client sees a bare 546 -- which
    // is what happened on 21 Sep: a busy 3.8 Flash, a retry and a fallback
    // added up to 153s and the frames were thrown away mid-read.
    //
    // So every attempt is sized to what is LEFT of a budget kept under
    // that limit, and when too little is left to finish a read, the
    // function stops and says "timeout" itself rather than being killed.
    // Overridable, in case the plan's limit changes (IMPORT_BUDGET_MS).
    const BUDGET_MS = Number(Deno.env.get("IMPORT_BUDGET_MS")) || 135_000;
    // A detailed read under this is not going to finish -- starting one
    // only burns tokens on an answer that will be cut off.
    const MIN_ATTEMPT_MS = 25_000;
    const left = () => BUDGET_MS - (Date.now() - t0);
    let outOfTime = false;

    for (let m = 0; m < modelChain.length; m++) {
    modelForRequest = modelChain[m];
    // With another model waiting, one quick retry is enough before moving
    // on; the full ladder is for the last model standing.
    const delays = m < modelChain.length - 1 ? [2000] : RETRY_DELAYS_MS;
    for (let attempt = 0; attempt <= delays.length; attempt++) {
      if (left() < MIN_ATTEMPT_MS) { outOfTime = true; break; }
      // The first model, with others behind it, may not take the whole
      // budget: a model that is slow because it is overloaded should
      // leave room for the next one to actually read the card.
      const cap = m < modelChain.length - 1 ? 65_000 : ATTEMPT_TIMEOUT_MS;
      const attemptMs = Math.min(cap, left() - 3_000);
      const ac = new AbortController();
      const killer = setTimeout(() => ac.abort(), attemptMs);
      try {
      // A URL without the key returns a 403 that reads like a function
      // permissions problem. Catch it here, where the message can say
      // what is actually wrong.
      const url = geminiUrlFor(modelForRequest);
      if (!url.includes("?key=") || url.endsWith("?key=")) {
        return new Response(JSON.stringify({
          error: "Server misconfigured: the Gemini API key is missing from the request URL.",
          reason: "missing_key",
        }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      geminiRes = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestBody,
        signal: ac.signal,
      });
      if (geminiRes.ok) break;

      lastErrText = await geminiRes.text();

      // A 429 is TWO different failures wearing one status code.
      //
      //   A rate spike -- too many requests in a moment. Waiting a few
      //   seconds clears it, which is what the retry is for.
      //
      //   An exhausted QUOTA -- the daily or per-minute allowance is
      //   gone. Retrying cannot help, and it makes things worse: one
      //   import becomes three calls against an allowance that has
      //   already run out, so it takes longer to recover.
      //
      // Google says which in the body. Treating them the same meant every
      // quota failure burned two extra calls on the way to the same
      // answer.
      const quotaExhausted = /quota|exceeded your current quota|RESOURCE_EXHAUSTED/i
        .test(lastErrText);
      const transient = geminiRes.status === 503
        || (geminiRes.status === 429 && !quotaExhausted);
      if (!transient || attempt === delays.length) break;
      await new Promise((r) => setTimeout(r, delays[attempt]));
      retries++;
      } catch (err) {
        // A timed-out attempt is transient by definition, so it retries
        // like a 503 rather than failing the whole import. The last one
        // falls through to the error response below with a message that
        // says what happened, instead of the caller waiting forever.
        geminiRes = null;
        lastErrText = (err as Error)?.name === "AbortError"
          ? `attempt timed out after ${Math.round(attemptMs / 1000)}s`
          : String(err);
        if (attempt === delays.length) break;
        // A model that ran out the clock is overloaded, not unlucky: with
        // another model waiting, go to it rather than wait out this one
        // a second time.
        if (m < modelChain.length - 1) break;
        await new Promise((r) => setTimeout(r, delays[attempt]));
        retries++;
      } finally {
        clearTimeout(killer);
      }
    }
    if (geminiRes && geminiRes.ok) break;
    if (outOfTime) break;
    // Next model only when this one was busy or gone, not when the
    // request itself was the problem.
    const st = geminiRes?.status ?? 0;
    const quotaGone = /quota|exceeded your current quota|RESOURCE_EXHAUSTED/i.test(lastErrText);
    const busy = st === 503 || st === 404 || st === 0 || (st === 429 && !quotaGone);
    if (!busy) break;
    skipped.push(`${modelForRequest}:${st || "timeout"}`);
    }

    if (!geminiRes || !geminiRes.ok) {
      const status = geminiRes?.status ?? 0;
      // A machine-readable reason so the client can say something useful
      // instead of showing raw API JSON to a bowler.
      const reason = outOfTime || (!geminiRes && /timed out/.test(lastErrText)) ? "timeout"
        : status === 503 ? "busy"
        : status === 429 ? (/quota|RESOURCE_EXHAUSTED/i.test(lastErrText) ? "quota" : "rate_limited")
        : status === 404 ? "model_unavailable"
        : "api_error";
      return new Response(JSON.stringify({
        error: "Gemini API error",
        reason,
        upstreamStatus: status,
        // Raw upstream text is useful while developing and is not
        // something to expose indefinitely on a public endpoint -- it can
        // carry internal quota details and request identifiers. The
        // `reason` above is what the client actually branches on.
        retries,
        model: modelForRequest,
        skipped,
        detail: Deno.env.get("EXPOSE_UPSTREAM_ERRORS") === "true" ? lastErrText : undefined,
      }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const geminiData = await geminiRes.json();

    // The variant matters more here than anywhere else.
    //
    // Import is the one feature that can spend twice on a single card: a
    // cheap counting look, the real extraction, and -- when the fast
    // model came back without frame detail -- an escalation to the
    // stronger model. Recording which kind of call this was turns the
    // extract-to-detailed ratio into a number you can query, and that
    // ratio is the escalation rate.
    //
    // Worth having specifically because escalation is the only path
    // running on Gemini 3.8 Flash, whose price doubles on 1 Jan 2027.
    // Everything else is on Flash Lite and unaffected. Knowing how often
    // cards escalate is how you find out whether that change costs you
    // anything at all.
    //
    // Recorded before the text check: an empty response still cost
    // tokens, and a card that burned the stronger model and returned
    // nothing is the single most expensive outcome there is. Not awaited.
    recordAiTokens(
      req,
      "import-scorecard",
      modelForRequest,
      geminiData?.usageMetadata,
      counting ? "count" : (detailed ? "detailed" : "extract"),
    );

    const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return new Response(JSON.stringify({ error: "Gemini returned no extractable content", requestId }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let extracted;
    try {
      extracted = JSON.parse(text);
    } catch {
      return new Response(JSON.stringify({ error: "Gemini's response wasn't valid JSON", requestId }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Which model produced this, so a model switch is measurable rather
    // than a guess -- quality and speed both move when it changes.
    return new Response(JSON.stringify({ ...extracted, model: modelForRequest, skipped }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("import-scorecard failed:", requestId, err);
    return new Response(JSON.stringify({ error: "Unexpected error", requestId }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
