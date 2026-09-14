// Retiring a ball, rather than deleting it.
//
// Bowlers sell balls, crack them, or just stop throwing them. Deleting
// was the only option, and deleting a ball that has thrown two thousand
// shots throws away the answer to "was the Phaze actually better on this
// pattern" -- the one question an old ball is still good for.
//
// A retired ball:
//
//   leaves the active arsenal and every bag
//   keeps every shot, every stat, every carry number it ever earned
//   stays available for comparison, permanently
//   can come back, because bowlers buy their old ball again
//
// WHY A DATE RATHER THAN A FLAG
//
// retiredOn answers "is it retired" and "since when" with one field. The
// second question matters: a ball retired in March should not be
// compared against this season's oil without the bowler knowing why the
// sample stops there.

// SHAPE
//
// An arsenal is an array of ball NAMES, not objects, so retirement lives
// beside it rather than on it:
//
//   arsenal    ["Phaze II", "Zen", "Hy-Road"]
//   retired    { "Zen": "2026-03-01" }
//
// A separate map rather than converting arsenals to objects: the array
// of names is read in a dozen places and threaded through bags, the ball
// picker and every stat, and a shape change there is a migration with
// far more surface than this feature is worth.

const names = v => (Array.isArray(v) ? v : []).filter(x => typeof x === "string" && x.trim());

const map = v => (v && typeof v === "object" && !Array.isArray(v)) ? v : {};

const clean = v => String(v ?? "").trim();

export function isRetired(retired, ballName) {
  return !!clean(map(retired)[clean(ballName)]);
}

export function retiredOn(retired, ballName) {
  return clean(map(retired)[clean(ballName)]);
}

// The balls a bowler actually throws -- the arsenal, the bags, the ball
// picker.
export function activeBalls(arsenal, retired) {
  return names(arsenal).filter(n => !isRetired(retired, n));
}

// The balls they used to throw, most recently retired first: the ball
// sold last month is the one they still remember.
export function retiredBallNames(arsenal, retired) {
  return names(arsenal)
    .filter(n => isRetired(retired, n))
    .sort((a, b) => retiredOn(retired, b).localeCompare(retiredOn(retired, a)));
}

// Retire a ball as of a date. Returns a new map.
//
// Retiring one already retired keeps the ORIGINAL date -- re-tapping
// should not quietly rewrite when it happened.
export function retireBall(retired, ballName, date) {
  const name = clean(ballName);
  if (!name) return { ...map(retired) };
  const existing = map(retired);
  if (clean(existing[name])) return { ...existing };
  return { ...existing, [name]: clean(date) || new Date().toISOString().slice(0, 10) };
}

// Bring a ball back. Bowlers rebuy a ball they regret selling, and the
// old shots are still theirs.
export function unretireBall(retired, ballName) {
  const next = { ...map(retired) };
  delete next[clean(ballName)];
  return next;
}

// How much the ball still has to say.
//
// A ball with four hundred shots behind it is worth comparing against; a
// ball with six is not, and showing them identically invites reading
// noise as signal.
export function retiredBallSummary(ballName, retired, shots) {
  const name = clean(ballName);
  if (!name) return null;
  const mine = (Array.isArray(shots) ? shots : [])
    .filter(s => s && clean(s.ball) === name);
  const strikes = mine.filter(s => s.result === "Strike").length;
  return {
    name,
    retiredOn: retiredOn(retired, name),
    shots: mine.length,
    strikes,
    // Null, not 0% -- "0% of nothing" is not a rate.
    strikeRate: mine.length ? Math.round((strikes / mine.length) * 1000) / 10 : null,
    comparable: mine.length >= 50,
  };
}

export function describeRetirement(summary) {
  const s = (summary && typeof summary === "object") ? summary : null;
  if (!s) return "";
  const when = s.retiredOn ? `Retired ${s.retiredOn}` : "Retired";
  if (!s.shots) return `${when} \u00b7 nothing logged with it`;
  const shots = `${s.shots} shot${s.shots === 1 ? "" : "s"}`;
  if (!s.comparable) return `${when} \u00b7 ${shots}, too few to compare`;
  return `${when} \u00b7 ${shots} \u00b7 ${s.strikeRate}% strikes`;
}
