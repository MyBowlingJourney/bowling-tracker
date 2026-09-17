// WHY a leave keeps happening, not how often.
//
// Asked "why do I keep leaving the ten pin", Brooklyn answered with a
// conversion rate -- because a conversion rate was all she had. Every
// stat in the analysis payload is a FREQUENCY: strike rate, spare
// conversion, leave counts, open-frame rate. Fourteen of them, and not
// one is a cause.
//
// So she substituted the nearest question she could answer. That is not
// the model being lazy; it is the payload having no answer in it.
//
// The shot record already carries the causal variables -- where the ball
// missed, how fast, how many revs, which ball, what line. They just never
// reached her. This turns those into the comparison that actually
// answers a "why": what was DIFFERENT about the shots that left this pin,
// against the shots that did not.

const rows = v => (Array.isArray(v) ? v : []).filter(x => x && typeof x === "object");

const num = v => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const clean = v => String(v ?? "").trim();

// Average of the numbers present, or null when none are.
function avg(values) {
  const ns = values.map(num).filter(v => v !== null);
  if (!ns.length) return null;
  return Math.round((ns.reduce((a, b) => a + b, 0) / ns.length) * 10) / 10;
}

// The most common non-empty value, with its share.
function commonest(values) {
  const counts = new Map();
  for (const v of values.map(clean).filter(Boolean)) {
    counts.set(v, (counts.get(v) || 0) + 1);
  }
  if (!counts.size) return null;
  const [value, n] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  const total = [...counts.values()].reduce((a, b) => a + b, 0);
  return { value, share: Math.round((n / total) * 100) };
}

// Shots whose FIRST ball left exactly this set of pins.
//
// First ball only: a leave is what the rack looked like after the strike
// attempt, and a second ball cannot leave anything by definition.
export function shotsLeaving(shots, pins) {
  const want = [...new Set(rows(pins).length ? pins : (Array.isArray(pins) ? pins : []))]
    .map(p => String(p).trim()).filter(Boolean).sort().join(",");
  if (!want) return [];

  return rows(shots).filter(s => {
    if (Number(s.ballNum) !== 1) return false;
    const got = (Array.isArray(s.otherLeave) ? s.otherLeave : [])
      .map(p => String(p).trim()).filter(Boolean).sort().join(",");
    return got === want;
  });
}

// Every first ball that did NOT leave this, for comparison.
//
// A number means nothing alone: 16.1 mph on ten-pin shots is only
// interesting next to 15.4 on the rest. The contrast is the finding.
export function shotsNotLeaving(shots, pins) {
  const leaving = new Set(shotsLeaving(shots, pins).map(s => s.id));
  return rows(shots).filter(s => Number(s.ballNum) === 1 && !leaving.has(s.id));
}

// What was different about the shots that left it.
//
// Returns only fields where BOTH groups have data, so a comparison is
// never made against nothing. Each entry carries both values so the
// caller can state the contrast rather than assert a cause.
export function leaveCauseProfile(shots, pins, minSample = 8) {
  const left = shotsLeaving(shots, pins);
  const rest = shotsNotLeaving(shots, pins);

  // Below this, a difference is noise wearing a number's clothes.
  if (left.length < minSample) {
    return { enough: false, count: left.length, need: minSample, factors: [] };
  }

  const factors = [];

  const numeric = [
    ["ballSpeed", "ball speed", "mph"],
    ["revRate", "rev rate", "rpm"],
    ["axisRotation", "axis rotation", "\u00b0"],
    // Axis tilt sits in the same card as speed, revs and rotation, and is
    // the same kind of measurement -- it was added to the form and never
    // added here, so a bowler could record it every shot and the analysis
    // would never mention it.
    ["axisTilt", "axis tilt", "\u00b0"],
    // Heel and sole: the shoe setting. They change how the slide ends,
    // which changes the release -- a bowler who switches to a slicker
    // heel on a dry approach is changing a variable, and the analysis
    // should be able to see it alongside the rest.
    ["heelNumber", "heel setting", ""],
    ["soleNumber", "sole setting", ""],
    ["actualBoard", "board at the arrows", ""],
  ];
  for (const [key, label, unit] of numeric) {
    const a = avg(left.map(s => s[key]));
    const b = avg(rest.map(s => s[key]));
    if (a === null || b === null) continue;
    factors.push({ key, label, unit, whenLeft: a, otherwise: b, delta: Math.round((a - b) * 10) / 10 });
  }

  const categorical = [
    ["miss", "where it missed"],
    ["release", "release"],
    ["ball", "ball"],
  ];
  for (const [key, label] of categorical) {
    const a = commonest(left.map(s => s[key]));
    const b = commonest(rest.map(s => s[key]));
    if (!a) continue;
    factors.push({ key, label, whenLeft: a.value, whenLeftShare: a.share,
      otherwise: b ? b.value : null, otherwiseShare: b ? b.share : null });
  }

  return { enough: true, count: left.length, need: minSample, factors };
}

// The fields that WOULD answer the question but are not being recorded.
//
// So an honest "I cannot tell you why yet" can name what to track rather
// than leaving the bowler with nothing to do about it.
export function missingCauseFields(shots, pins) {
  const left = shotsLeaving(shots, pins);
  const fields = [
    ["miss", "where the ball missed"],
    ["ballSpeed", "ball speed"],
    ["revRate", "rev rate"],
    ["release", "release"],
    ["actualBoard", "the board you actually hit"],
  ];
  return fields
    .filter(([key]) => !left.some(s => clean(s[key])))
    .map(([key, label]) => ({ key, label }));
}
