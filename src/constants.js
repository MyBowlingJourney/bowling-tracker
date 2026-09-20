// The app's name, in one place so a rename doesn't mean hunting through
// JSX for a hardcoded string.
// One name, one place. Several screens used to hardcode it -- the sign
// in screen was still showing "Shot Tracker", two names behind -- so a
// rename left the app calling itself different things depending where
// you looked.
export const APP_NAME = "My Bowling Journey";

// Where the app lives. Beside the name for the same reason: one place to
// change when it moves.
//
// It is stamped on every share card and encoded in the QR code, so a stale
// value here is a wrong address printed on other people's screens. Moving
// to a real domain is this one line -- but QR codes and images already
// shared keep the old address forever, so the move is worth making before
// there are many of them.
//
// Moved to the custom domain 18 Sep 2026, once it actually resolved and
// served -- deliberately not before. A share card drawn against a domain
// that isn't answering yet is a wrong address on someone else's phone,
// and unlike a broken page it never corrects itself.
//
// No trailing slash, on purpose. shareCard.js prints this with the
// protocol stripped, so a trailing slash would render as
// "mybowlingjourney.com/" on every card. The QR code is happy either way.
export const APP_URL = "https://mybowlingjourney.com";

// The Google OAuth **web** client ID, used for "Sign in with Google".
//
// HARDCODED, AND THAT IS CORRECT -- this is not a secret.
//
// An OAuth client ID is public by design: it identifies the app to
// Google and ships in the JavaScript bundle of every site that uses one.
// Anyone can read it out of this app today by opening devtools. The
// client SECRET is the sensitive half, and it lives only in Supabase,
// never in this repo.
//
// Kept here rather than in a VITE_ env var deliberately. An env var for
// a public value buys no security and adds a failure mode this project
// has already been burned by: it would need to exist in .env locally AND
// as a GitHub Actions secret, and if the CI one were ever missing the
// build would still succeed and ship `undefined` -- sign-in would break
// in production only, with nothing failing loudly at build time.
//
// ANDROID USES THIS SAME WEB ID. That is not a mistake and it is the
// single most confusing part of Google sign-in: the Android OAuth client
// proves the app's identity via its SHA-1 fingerprint, but the ID token
// Google issues is addressed to the WEB client. Putting the Android
// client ID here instead produces a token Supabase rejects for a bad
// audience.
export const GOOGLE_WEB_CLIENT_ID =
  "82054895214-dgil1a6989enktahek88uc82iosc8ju9.apps.googleusercontent.com";

// Practice and casual nights aren't leagues, but every per-night record in
// this app -- manual game scores, session recaps -- is keyed by
// (bowler, league, date). Rather than special-case every one of those,
// these two act as the "league" for those environments.
//
// They are deliberately plain names a bowler would recognise if they ever
// saw them in an export, not opaque ids.
// The plastic spare ball, as a reserved arsenal entry.
//
// A plastic is equipment nearly every league bowler carries and almost
// none would list by model name -- "my plastic" is the whole identity.
// Making it a reserved name rather than a separate flag means it flows
// through everything an arsenal ball already flows through: the ball
// picker, drill chips, per-ball stats, bags. One toggle in Arsenal adds
// or removes it.
export const PLASTIC_BALL = "Plastic";

export const PRACTICE_SESSION_KEY = "Practice";

// The name the practice league is stored under IN THE CLOUD.
//
// leagues.name is globally unique (leagues_name_key), because real leagues
// are shared objects -- a team joins "Tuesday House Shot" and everyone
// means the same one. Practice is the opposite: personal to one bowler.
// Storing it as plain "Practice" meant the first bowler to practise
// claimed the name for the entire system and every other bowler got a
// 23505 on their first practice session.
//
// So the row is per-user and the display name stays "Practice" -- see
// practiceLeagueDisplayName, which translates at the mapping boundary so
// nothing else in the app has to know.
export function practiceLeagueCloudName(userId) {
  return `${PRACTICE_SESSION_KEY}\u00b7${userId}`;
}

export function isPracticeLeagueName(name) {
  // The bare key counts too, not just the per-user form.
  //
  // These only matched "Practice\u00b7<id>", so a session stored
  // under the plain key slipped through every caller -- and the callers
  // are the ones deciding what counts as real bowling. A 300 shot in
  // practice was showing as a season high game because its league
  // was the bare key.
  //
  // Each caller had grown its own `|| name === "..."` patch. Fixing it
  // here means the next caller does not have to remember.
  return typeof name === "string"
    && (name === PRACTICE_SESSION_KEY
      || name.startsWith(`${PRACTICE_SESSION_KEY}\u00b7`));
}

// Casual gets the same treatment, for the same reason.
//
// Casual scores used to be device-local: no league row meant the cloud
// write bailed out, so a reinstall or a new phone lost every casual
// night and every badge earned with it. Now that the friends
// leaderboard builds up over months, that's real data to lose.
export function casualLeagueCloudName(userId) {
  return `${CASUAL_SESSION_KEY}\u00b7${userId}`;
}

export function isCasualLeagueName(name) {
  // The bare key counts too, not just the per-user form.
  //
  // These only matched "Casual\u00b7<id>", so a session stored
  // under the plain key slipped through every caller -- and the callers
  // are the ones deciding what counts as real bowling. A 300 shot in
  // open bowling was showing as a season high game because its league
  // was the bare key.
  //
  // Each caller had grown its own `|| name === "..."` patch. Fixing it
  // here means the next caller does not have to remember.
  return typeof name === "string"
    && (name === CASUAL_SESSION_KEY
      || name.startsWith(`${CASUAL_SESSION_KEY}\u00b7`));
}

// Any per-user league reads back as its plain display name.
// Tournament container leagues, one per event.
//
// Shots have to belong to a league -- every stat, filter and history
// view keys off one -- and a tournament is not a league. Practice and
// open bowling solve this with a single reserved league each; a
// tournament cannot, because pooling every event into one bucket would
// flatten exactly what a bowler wants to see. The pattern you shot 172
// on at the City Open is the thing worth knowing before you bowl it
// again, and "Tournament: 189 average" tells you nothing.
//
// So the league is named for the event. Same prefix trick as the others,
// with the event name carried in the middle so it survives the round
// trip and can be displayed without a lookup.
//
//   Tournament\u00b7City Open\u00b7<userId>
//
// The separator is U+00B7, which is already the convention here and
// cannot appear in a league name a bowler types.
export const TOURNAMENT_SESSION_KEY = "Tournament";

export function tournamentLeagueCloudName(eventName, userId) {
  const clean = String(eventName || "").trim().replace(/\u00b7/g, " ") || "Tournament";
  return `${TOURNAMENT_SESSION_KEY}\u00b7${clean}\u00b7${userId}`;
}

export function isTournamentLeagueName(name) {
  // The bare key counts too, not just the per-user form.
  //
  // These only matched "Tournament\u00b7<id>", so a session stored
  // under the plain key slipped through every caller -- and the callers
  // are the ones deciding what counts as real bowling. A 300 shot in
  // tournament was showing as a season high game because its league
  // was the bare key.
  //
  // Each caller had grown its own `|| name === "..."` patch. Fixing it
  // here means the next caller does not have to remember.
  return typeof name === "string"
    && (name === TOURNAMENT_SESSION_KEY
      || name.startsWith(`${TOURNAMENT_SESSION_KEY}\u00b7`));
}

// "Tournament\u00b7City Open\u00b7abc123" -> "City Open"
export function tournamentLeagueEventName(name) {
  if (!isTournamentLeagueName(name)) return "";
  const parts = String(name).split("\u00b7");
  return parts.length >= 3 ? parts.slice(1, -1).join("\u00b7") : "";
}

// What open bowling is CALLED, as opposed to what it is stored as.
//
// CASUAL_SESSION_KEY is "Just Bowling" and has to stay that way: it is
// the league name on every casual session already saved, so renaming it
// would orphan that data. The mode has been called Open bowling
// everywhere else for a while, and History was the one place still
// showing the storage key to the bowler.
export const CASUAL_DISPLAY_NAME = "Open bowling";

export function practiceLeagueDisplayName(name) {
  if (isCasualLeagueName(name)) return CASUAL_DISPLAY_NAME;
  // The event name, not "Tournament" -- the whole point of a league per
  // event is that History and Stats can tell them apart.
  if (isTournamentLeagueName(name)) return tournamentLeagueEventName(name) || TOURNAMENT_SESSION_KEY;
  // Always a string.
  //
  // This returned null and undefined straight through, and every caller
  // that did .replace(" House Shot", "") on the result crashed the whole
  // screen on a session whose league was not set.
  return isPracticeLeagueName(name) ? PRACTICE_SESSION_KEY : String(name ?? "");
}
export const CASUAL_SESSION_KEY = "Just Bowling";

// Where imported nights land when the bowler does not pick a league.
//
// A session has to belong to one, and a CSV has no column for it. This
// is a container like Practice and Just Bowling -- it exists so the rows
// have somewhere to live, and it is filtered out of league pickers for
// the same reason: nobody bowls a night "in" it.
export const IMPORTED_SESSION_KEY = "Imported";

export function importedLeagueCloudName(userId) {
  return `${IMPORTED_SESSION_KEY}\u00b7${userId}`;
}

export function isImportedLeagueName(name) {
  return typeof name === "string"
    && (name === IMPORTED_SESSION_KEY
      || name.startsWith(`${IMPORTED_SESSION_KEY}\u00b7`));
}

// Domain/form constants shared across BowlingTracker.jsx and the view
// files split out of it. Kept separate from ui.jsx, which is specifically
// about styling/presentation -- these are actual data values (the set of
// valid ball surfaces, shot results, etc.), not visual concerns.

// Seed arsenal for the very first bowler created (preserves continuity with
// existing logged data). Every bowler added after that starts with an empty
// arsenal and builds their own list.
export const DEFAULT_ARSENAL = [
  "Bionic","Ion Max Solid","Ion Max Pearl",
  "Phaze II Solid","Phaze II Pearl",
  "Harsh Reality Pearl","Road Warrior Pearl","Equinox Pearl",
];
export const SURFACES = ["Box","500","1000","1500","2000","3000","4000","Polish","Lane Shine"];
export const RESULTS = ["Strike","Weak 10","Ringing 10","Other Leave"];

// A left-handed bowler's ball hooks the opposite way, so the corner pin
// they characteristically leave is the 7, not the 10. The two failure
// modes are the same (weak = missed light/early, ringing = hit slightly
// high) -- only which pin survives differs. These are display labels; the
// underlying stored result values stay "Weak 10"/"Ringing 10" so all
// existing scoring, stats, and history logic keeps working unchanged.
export function resultsForHandedness(leftHanded){
  if(!leftHanded)return RESULTS;
  return RESULTS.map(r=>
    r==="Weak 10"?"Weak 7":r==="Ringing 10"?"Ringing 7":r
  );
}

// Maps a displayed label back to the stored result value, so a lefty
// tapping "Weak 7" still saves the same "Weak 10" record everything else
// already understands.
export function storedResultFor(label){
  if(label==="Weak 7")return"Weak 10";
  if(label==="Ringing 7")return"Ringing 10";
  return label;
}
export const STRIKE_DESCRIPTIONS = ["Flush","High","Light","Messenger","Half Pocket","Trip 4","Kick 10","Brooklyn"];

// "Trip 4" and "Kick 10" name the specific pin that carried through or
// got kicked out -- a lefty's ball approaches from the opposite side, so
// her equivalent pins are the mirror image (4\u21946, 10\u21947, matching the
// same deck mirror domain/splits.js uses for corner pins, washouts, and
// drill targets). The other five descriptions ("Flush", "Brooklyn", etc)
// aren't tied to a specific pin number and stay as-is for both hands.
//
// Same convention as resultsForHandedness below: the STORED value stays
// canonical ("Trip 4") for both hands so history and stats keep working
// off one identifier; only the label a lefty sees flips.
export function strikeDescriptionsForHand(leftHanded){
  if(!leftHanded)return STRIKE_DESCRIPTIONS;
  return STRIKE_DESCRIPTIONS.map(d=>
    d==="Trip 4"?"Trip 6":d==="Kick 10"?"Kick 7":d
  );
}

export function storedStrikeDescriptionFor(label){
  if(label==="Trip 6")return"Trip 4";
  if(label==="Kick 7")return"Kick 10";
  return label;
}
export const RELEASES = ["Good","Acceptable","Bad"];
export const MISSES = ["Left","Right","Fast","Slow","Execution"];
export const BALL_CHANGE_REASONS = [
  "Too early","Too late","Too round","Too sharp",
  "Roll out","Poor carry","No miss room","Lane transition","Surface worn",
];
export const DEFAULT_LEAGUES = ["Tuesday House Shot","Thursday House Shot"];

// Returns today's date as YYYY-MM-DD using LOCAL date components, not UTC.
// new Date().toISOString() always converts to UTC first -- for anyone west
// of UTC (all of the US, for instance), bowling in the evening can already
// be "tomorrow" in UTC while it's still today locally, silently dating a
// session one day ahead of when it was actually bowled.
export function localDateString(d=new Date()){
  // An unusable date falls back to TODAY, never to "NaN-NaN-NaN".
  //
  // The default argument only covers an omitted one. Handed null, a
  // string, or a Date built from something unparseable, this threw --
  // or worse, returned "NaN-NaN-NaN", which is a perfectly storable
  // string. Every session and shot is KEYED by this value, so one of
  // those would write a row that could never be matched, edited or
  // deduplicated again: a night that exists and cannot be found.
  //
  // Today is the right fallback because that is what the caller meant
  // by asking; an unusable date is a bug upstream, and the bowler's
  // night should still land somewhere real.
  if (!(d instanceof Date) || Number.isNaN(d.getTime())) d = new Date();
  const y=d.getFullYear();
  const m=String(d.getMonth()+1).padStart(2,"0");
  const day=String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
}

// Human-readable date for display. Storage stays ISO ("2026-09-01") --
// it sorts and compares correctly -- but a bowler doesn't think of their
// league night as an ISO string, and forty places were showing one.
//
// Parsed from parts, not `new Date(iso)`: a bare date string is treated
// as UTC midnight, which rolls back to the previous evening for anyone
// west of Greenwich. Every Tuesday-night bowler in North America would
// have seen "Mon".
//
// Year only when it isn't this year: "Tue 1 Sep" for tonight's league,
// "Tue 1 Sep 2025" for last season's.
export function formatDate(iso, { weekday = true, today = new Date() } = {}) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ""));
  if (!m) return String(iso || "");
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (Number.isNaN(d.getTime())) return String(iso);
  const opts = { day: "numeric", month: "short" };
  if (weekday) opts.weekday = "short";
  if (d.getFullYear() !== today.getFullYear()) opts.year = "numeric";
  return d.toLocaleDateString(undefined, opts);
}

// Shorter form for tight spots -- a list row, a chip. "1 Sep".
export function formatDateShort(iso, today) {
  return formatDate(iso, { weekday: false, today });
}
