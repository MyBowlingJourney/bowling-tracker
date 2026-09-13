// Bowling centers.
//
// Attached to leagues rather than sessions -- a league bowls at one house
// for a season, so it's one entry per season instead of a tap every night.
//
// The point of recording them isn't the address; it's being able to say
// "you average 12 pins higher at Arsenal Bowl than at Bowlero." Everything
// here exists to make centers resolve to ONE identity so those stats
// aggregate correctly.

// How the pins are set.
//
// String pins are tethered and pulled back up; free-fall pins are set by
// a machine and fall freely. They carry differently -- string machines
// are widely held to reduce messenger strikes and to change what a light
// hit does -- so a bowler's carry percentage at a string house is not
// comparable with their carry at a free-fall house.
//
// USBC certifies string pinsetters separately for that reason. Worth
// recording so a bowler can see why their strike rate moved when they
// changed centres, rather than assuming it was them.
//
// Unknown is the default and stays a real answer: most bowlers will not
// know, and guessing on their behalf would put a wrong fact in their
// history.
// No "not sure" option, by design. A bowler who does not know leaves
// the field blank -- normalizeCenter already treats that as unrecorded --
// rather than the app manufacturing a third category that means the same
// thing as blank but looks like an answer.
export const RACK_TYPES = [
  { id: "freefall", label: "Free fall", blurb: "Pins set by machine, fall freely." },
  { id: "string", label: "String", blurb: "Pins on strings, pulled back up." },
];

export const RACK_TYPE_IDS = RACK_TYPES.map(r => r.id).filter(Boolean);

export function rackTypeLabel(id) {
  return RACK_TYPES.find(r => r.id === id)?.label || "";
}

export function emptyCenter() {
  return {
    id: "",
    hereId: null,
    name: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    lat: null,
    lng: null,
    // "" means unrecorded, not free fall.
    rackType: "",
  };
}

function numOrNull(v) {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}

export function normalizeCenter(raw) {
  const base = emptyCenter();
  if (!raw || typeof raw !== "object") return base;
  return {
    id: raw.id || "",
    hereId: raw.hereId || null,
    name: (raw.name || "").trim(),
    address: raw.address || "",
    city: raw.city || "",
    state: raw.state || "",
    postalCode: raw.postalCode || "",
    country: raw.country || "",
    // Accepts either shape: rackType from the client, rack_type from a
    // cloud row. Anything unrecognised falls back to unrecorded rather
    // than being stored as a rack type nobody can interpret.
    rackType: RACK_TYPE_IDS.includes(raw.rackType) ? raw.rackType
      : RACK_TYPE_IDS.includes(raw.rack_type) ? raw.rack_type : "",
    lat: numOrNull(raw.lat),
    lng: numOrNull(raw.lng),
  };
}

// A short label for lists: "Arsenal Bowl · Pittsburgh, PA".
// Falls back gracefully when a hand-entered center has no city.
export function centerLabel(center) {
  if (!center?.name) return "";
  const place = [center.city, center.state].filter(Boolean).join(", ");
  return place ? `${center.name} · ${place}` : center.name;
}

// Distance in whole miles, for showing how far a search result is.
// HERE returns metres; null means the search wasn't location-anchored.
export function distanceMiles(metres) {
  if (typeof metres !== "number") return null;
  return Math.round((metres / 1609.34) * 10) / 10;
}

// Matching key for centers with no HERE id -- hand-entered ones. Name plus
// city, normalized, so "Arsenal Bowl" and " arsenal  bowl " in the same
// city are recognized as one house rather than splitting its stats.
export function centerKey(center) {
  const name = (center?.name || "").trim().toLowerCase().replace(/\s+/g, " ");
  const city = (center?.city || "").trim().toLowerCase();
  return city ? `${name}|${city}` : name;
}

// Finds an existing center matching a search result, so picking the same
// venue twice doesn't create a duplicate row. HERE id is authoritative when
// both sides have one; otherwise fall back to name+city.
export function findExistingCenter(candidate, centers) {
  const list = Array.isArray(centers) ? centers : [];
  if (candidate?.hereId) {
    const byId = list.find(c => c.hereId && c.hereId === candidate.hereId);
    if (byId) return byId;
  }
  const key = centerKey(candidate);
  return list.find(c => centerKey(c) === key) || null;
}

// ── Per-center stats ────────────────────────────────────────────────────
// The actual payoff: how a bowler performs house to house.
//
// Sessions don't store a center directly -- they store a league, and the
// league points at a center. So this resolves through the league, which
// also means a league that hasn't set its center yet is simply excluded
// rather than lumped into a fake "unknown" bucket.
// Free fall vs string: average and messenger rate.
//
// Grouped by rackType rather than by individual centre, because the
// question a bowler actually has is "does this TYPE of machine change my
// bowling", not "how did I do at this one building" -- that comparison
// already exists in statsByCenter. Centres with no rackType recorded are
// left out of both buckets rather than guessed into one.
//
// Messenger rate needs a decision about the denominator. Counted against
// STRIKES, not against all shots: a messenger is a strike being carried a
// particular way, so "how often does a strike come in as a messenger" is
// the honest question. Counting against every shot would conflate two
// things -- how often you strike at all, and how often a strike carries
// via a messenger -- and dilute the second by the first.
export function statsByRackType(sessions, shots, leagues, centers, bowler) {
  leagues = (Array.isArray(leagues) ? leagues : []).filter(x => x && typeof x === "object");
  centers = (Array.isArray(centers) ? centers : []).filter(x => x && typeof x === "object");
  sessions = (Array.isArray(sessions) ? sessions : []).filter(x => x && typeof x === "object");
  shots = (Array.isArray(shots) ? shots : []).filter(x => x && typeof x === "object");

  const centerByLeague = {};
  leagues.forEach(l => { if (l.centerId) centerByLeague[l.name] = l.centerId; });
  const centerById = {};
  centers.forEach(c => { centerById[c.id] = c; });

  // Only leagues whose centre has a recorded rack type contribute at all.
  const rackTypeByLeague = {};
  for (const [league, centerId] of Object.entries(centerByLeague)) {
    const rt = centerById[centerId]?.rackType;
    if (rt) rackTypeByLeague[league] = rt;
  }

  const buckets = { freefall: { games: [], strikes: 0, messengers: 0 },
                     string: { games: [], strikes: 0, messengers: 0 } };

  sessions
    .filter(s => !bowler || s.bowler === bowler)
    .forEach(session => {
      const rt = rackTypeByLeague[session.league];
      if (!rt) return;
      (session.scores || []).forEach(sc => {
        if (typeof sc === "number") buckets[rt].games.push(sc);
      });
    });

  shots
    .filter(sh => !bowler || sh.bowler === bowler)
    .forEach(sh => {
      const rt = rackTypeByLeague[sh.league];
      if (!rt) return;
      if (sh.result !== "Strike") return;
      buckets[rt].strikes += 1;
      if (sh.strikeDescription === "Messenger") buckets[rt].messengers += 1;
    });

  const summarize = (label, b) => ({
    rackType: label,
    games: b.games.length,
    average: b.games.length
      ? Math.round((b.games.reduce((x, y) => x + y, 0) / b.games.length) * 10) / 10
      : null,
    strikes: b.strikes,
    messengers: b.messengers,
    // Null rather than 0 with no strikes -- "0% of nothing" is not a
    // rate, and showing one invites reading it as "never happens".
    messengerRate: b.strikes ? Math.round((b.messengers / b.strikes) * 1000) / 10 : null,
  });

  return [summarize("Free fall", buckets.freefall), summarize("String", buckets.string)]
    .filter(s => s.games > 0 || s.strikes > 0);
}

export function statsByCenter(sessions, leagues, centers, bowler) {
  // Null elements, and a non-list argument, both handled: these
  // lists come from the cloud and one bad row threw.
  leagues = (Array.isArray(leagues) ? leagues : []).filter(x => x && typeof x === "object");
  centers = (Array.isArray(centers) ? centers : []).filter(x => x && typeof x === "object");
  // Null ELEMENTS too. Array.isArray says the container is a list
  // and nothing about its contents, and one null row -- from a
  // partial import or a half-written record -- was enough to throw.
  sessions = (Array.isArray(sessions) ? sessions : []).filter(x => x && typeof x === "object");
  const centerByLeague = {};
  (leagues || []).forEach(l => {
    if (l.centerId) centerByLeague[l.name] = l.centerId;
  });
  const centerById = {};
  (centers || []).forEach(c => { centerById[c.id] = c; });

  const buckets = {};
  (sessions || [])
    .filter(s => !bowler || s.bowler === bowler)
    .forEach(session => {
      const centerId = centerByLeague[session.league];
      if (!centerId) return;
      const b = buckets[centerId] = buckets[centerId] || { games: [], sessions: 0 };
      b.sessions += 1;
      (session.scores || []).forEach(sc => {
        if (typeof sc === "number") b.games.push(sc);
      });
    });

  return Object.entries(buckets)
    .map(([centerId, b]) => ({
      center: centerById[centerId] || null,
      centerId,
      sessions: b.sessions,
      games: b.games.length,
      average: b.games.length
        ? Math.round((b.games.reduce((x, y) => x + y, 0) / b.games.length) * 10) / 10
        : null,
      high: b.games.length ? Math.max(...b.games) : null,
    }))
    .filter(s => s.center && s.games > 0)
    .sort((a, b) => (b.average ?? 0) - (a.average ?? 0));
}

// ── Supabase mapping ────────────────────────────────────────────────────
export function centerToRow(center, userId) {
  return {
    id: center.id,
    here_id: center.hereId || null,
    name: center.name,
    address: center.address || null,
    city: center.city || null,
    state: center.state || null,
    postal_code: center.postalCode || null,
    country: center.country || null,
    lat: center.lat,
    lng: center.lng,
    created_by: userId || null,
  };
}

export function centerFromRow(row) {
  if (!row) return null;
  return normalizeCenter({
    id: row.id,
    hereId: row.here_id,
    name: row.name,
    address: row.address,
    city: row.city,
    state: row.state,
    postalCode: row.postal_code,
    country: row.country,
    lat: row.lat,
    lng: row.lng,
  });
}
