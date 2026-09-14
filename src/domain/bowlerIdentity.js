// One bowler, one name.
//
// THE PROBLEM
//
// A bowler can end up in the list twice: once as the handle derived from
// their sign-in (reverett290) and once as the display name they actually
// set (Ryan). Both are offered when filing scores, which is a question
// with no right answer -- they are the same person, and picking the
// wrong one files the night somewhere the other cannot see.
//
// It happens because the two names arrive from different places at
// different times. The handle is written to bowler_names on first sign
// in, before a profile exists; the display name arrives later from the
// profile and is added as if it were somebody new.
//
// WHY MERGE RATHER THAN HIDE
//
// Hiding the handle would orphan every record already filed under it --
// shots, sessions, arsenals, averages. The bowler would see their name
// once and their history not at all. A merge moves the records too, so
// there is one bowler with one history.
//
// WHY THIS IS SAFE TO RUN REPEATEDLY
//
// Merging when there is nothing to merge returns the input unchanged, so
// it can sit in an effect that runs on every profile load without
// needing a "have I done this" flag -- the kind of flag that goes stale
// and re-runs the merge on a name the bowler has since reused.

const list = v => (Array.isArray(v) ? v : []);

const clean = v => String(v ?? "").trim();

// The handle a sign-in address would produce: the part before the @.
//
// Matching on this rather than on "any name that is not the display
// name" matters -- a bowler legitimately has other bowlers in their list
// (teammates, guests) and those must never be merged into them.
export function handleFromEmail(email) {
  const e = clean(email);
  if (!e.includes("@")) return "";
  return e.split("@")[0];
}

// Is this list showing the same person twice?
export function hasDuplicateIdentity(bowlers, email, displayName) {
  const handle = handleFromEmail(email);
  const name = clean(displayName);
  if (!handle || !name || handle === name) return false;
  const names = list(bowlers).map(clean);
  return names.includes(handle) && names.includes(name);
}

// The bowler list with the handle removed.
export function mergedBowlers(bowlers, email, displayName) {
  const handle = handleFromEmail(email);
  const name = clean(displayName);
  if (!handle || !name || handle === name) return list(bowlers);
  const out = [];
  for (const b of list(bowlers)) {
    const c = clean(b);
    if (c === handle) continue;
    if (!out.includes(c)) out.push(c);
  }
  if (!out.includes(name)) out.push(name);
  return out;
}

// Move every record filed under the handle onto the display name.
//
// Takes and returns a plain array so it can be applied to shots,
// sessions, matches or anything else carrying a `.bowler` -- the caller
// saves through whatever path it already uses, so this cannot bypass a
// sync or a validation step.
// Records use TWO field names for the same thing.
//
// shots, sessions, matches, drills and tournaments carry `.bowler`;
// bags and ball groups carry `.bowlerName`. Moving only one of them
// leaves half the bowler's history behind under the old name, which is
// worse than not merging at all -- the list looks clean and the data is
// split.
const BOWLER_FIELDS = ["bowler", "bowlerName"];

export function movedRecords(records, email, displayName) {
  const handle = handleFromEmail(email);
  const name = clean(displayName);
  if (!handle || !name || handle === name) return list(records);
  let touched = false;
  const out = list(records).map(r => {
    if (!r) return r;
    for (const f of BOWLER_FIELDS) {
      if (f in r && clean(r[f]) === handle) { touched = true; return { ...r, [f]: name }; }
    }
    return r;
  });
  // The same array back when nothing changed, so a caller can skip the
  // save entirely rather than writing an identical list every load.
  return touched ? out : list(records);
}

// The same, for anything keyed by bowler name: arsenals, profiles,
// ball specs. A collision keeps the DISPLAY NAME's value -- that is the
// identity the bowler chose and has been using most recently.
export function movedKeyedMap(map, email, displayName) {
  const handle = handleFromEmail(email);
  const name = clean(displayName);
  const src = (map && typeof map === "object" && !Array.isArray(map)) ? map : {};
  if (!handle || !name || handle === name) return src;
  if (!(handle in src)) return src;

  const out = { ...src };
  const fromHandle = out[handle];
  delete out[handle];
  if (!(name in out)) out[name] = fromHandle;
  return out;
}
