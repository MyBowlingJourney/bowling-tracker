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
  // A house that converted half its lanes and left the rest. Common
  // enough that recording it as one type or the other would put every
  // shot in the wrong bucket -- so "mixed" carries the lane numbers that
  // are still free fall, and every stat resolves per shot from the lane
  // it was thrown on.
  { id: "mixed", label: "Mixed house", blurb: "Some lanes string, some free fall." },
];

export const RACK_TYPE_IDS = RACK_TYPES.map(r => r.id).filter(Boolean);

// Lane numbers, however they arrive: an array from the cloud, or the
// "1, 2, 7-10" a bowler types. Ranges expand, duplicates collapse, and
// anything that is not a lane number is dropped rather than stored.
export function normalizeLaneList(raw) {
  const out = new Set();
  const add = n => { if (Number.isInteger(n) && n >= 1 && n <= 200) out.add(n); };
  const fromText = text => String(text).split(/[,;\s]+/).filter(Boolean).forEach(part => {
    const range = part.match(/^(\d+)\s*[-\u2013]\s*(\d+)$/);
    if (range) {
      const a = parseInt(range[1], 10), b = parseInt(range[2], 10);
      if (Number.isInteger(a) && Number.isInteger(b) && Math.abs(b - a) <= 200) {
        for (let n = Math.min(a, b); n <= Math.max(a, b); n++) add(n);
      }
      return;
    }
    add(parseInt(part, 10));
  });
  if (Array.isArray(raw)) raw.forEach(v => (typeof v === "string" ? fromText(v) : add(Number(v))));
  else if (typeof raw === "string") fromText(raw);
  else if (typeof raw === "number") add(raw);
  return [...out].sort((a, b) => a - b);
}

// How a list of lanes reads back to the bowler: "1-4, 9, 12".
export function laneListLabel(lanes) {
  const list = normalizeLaneList(lanes);
  const parts = [];
  let i = 0;
  while (i < list.length) {
    let j = i;
    while (j + 1 < list.length && list[j + 1] === list[j] + 1) j++;
    parts.push(j > i + 1 ? `${list[i]}-${list[j]}` : list.slice(i, j + 1).join(", "));
    i = j + 1;
  }
  return parts.join(", ");
}

// THE question every rack-type statistic has to answer: what was under
// this particular shot?
//
// A single-type house answers it without the lane. A mixed house cannot:
// the same night, the same league, even the same game can cross a string
// pair and a free-fall pair. So a mixed house answers per lane, and
// answers null when the lane is missing or the bowler has not said which
// lanes are which -- null meaning "leave this shot out", never a guess.
export function rackTypeForLane(center, lane) {
  const type = center?.rackType || "";
  if (type !== "mixed") return type || null;
  const lanes = normalizeLaneList(center?.freefallLanes);
  if (!lanes.length) return null;
  const n = parseInt(lane, 10);
  if (!Number.isInteger(n) || n < 1) return null;
  return lanes.includes(n) ? "freefall" : "string";
}

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
    // Mixed houses only: the lane numbers that are FREE FALL. Every
    // other lane in the house is string. Empty while the bowler has not
    // said yet, which reads as "mixed, but we cannot tell which lane is
    // which" -- those shots stay out of the comparison rather than being
    // guessed into a bucket.
    freefallLanes: [],
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
    // Carried so the client can tell a centre it created from one
    // somebody else did. Read-only here -- the server sets it.
    freefallLanes: normalizeLaneList(raw.freefallLanes ?? raw.freefall_lanes),
    createdBy: String(raw.createdBy ?? raw.created_by ?? "").trim(),
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

// The same distance as the bowler reads distances: miles in the US,
// kilometres in Canada, Australia, New Zealand -- and always in French.
// `locale` is the phone's language tag ("en-US", "en-CA", "fr-CA").
export function distanceLabel(metres, locale = "en-US", french = false) {
  if (typeof metres !== "number") return null;
  const region = (/[-_]([A-Za-z]{2})\b/.exec(String(locale)) || [])[1];
  // Puerto Rico signs its roads in kilometres but people talk in miles,
  // as in the rest of the US -- so a Spanish phone set to es-PR gets miles.
  const miles = !french && (!region || ["US", "PR", "LR", "MM"].includes(region.toUpperCase()));
  if (miles) return `${distanceMiles(metres)} mi`;
  return `${Math.round((metres / 1000) * 10) / 10} km`;
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

  // The CENTRE per league, not a rack type: a mixed house answers per
  // lane, so the type is resolved shot by shot below.
  const centerFor = {};
  for (const [league, centerId] of Object.entries(centerByLeague)) {
    const c = centerById[centerId];
    if (c?.rackType) centerFor[league] = c;
  }

  // Which rack type a GAME was bowled on, for mixed houses.
  //
  // A session stores scores, not lanes, so the only record of where a
  // game was bowled is the shots logged during it. A game whose shots all
  // sit on free-fall lanes counts as free fall; one that crosses both --
  // which a pair change mid-game can do -- counts as neither, because
  // splitting one score between two buckets would invent bowling that did
  // not happen.
  const gameType = {};              // "league|date|game" -> "freefall" | "string" | "mixed"
  shots.forEach(sh => {
    const center = centerFor[sh.league];
    if (!center || center.rackType !== "mixed") return;
    const rt = rackTypeForLane(center, sh.lane);
    if (rt !== "freefall" && rt !== "string") return;
    const key = `${sh.league}|${sh.date}|${sh.game}`;
    gameType[key] = gameType[key] && gameType[key] !== rt ? "mixed" : rt;
  });

  // firstBalls counts the strike OPPORTUNITIES, which is what a strike
  // percentage is a percentage of. strikes counts every strike including
  // the tenth-frame extras, because that is the honest denominator for
  // "how many of my strikes carried a messenger".
  const buckets = { freefall: { games: [], strikes: 0, messengers: 0, firstBalls: 0, firstBallStrikes: 0 },
                     string: { games: [], strikes: 0, messengers: 0, firstBalls: 0, firstBallStrikes: 0 } };

  sessions
    .filter(s => !bowler || s.bowler === bowler)
    .forEach(session => {
      const center = centerFor[session.league];
      if (!center) return;
      (session.scores || []).forEach((sc, i) => {
        if (typeof sc !== "number") return;
        // A single-type house needs no lane. A mixed one takes the game's
        // type from the shots logged in it, and skips the game when those
        // are missing or span both.
        const rt = center.rackType === "mixed"
          ? gameType[`${session.league}|${session.date}|${i + 1}`]
          : center.rackType;
        if (rt !== "freefall" && rt !== "string") return;
        buckets[rt].games.push(sc);
      });
    });

  shots
    .filter(sh => !bowler || sh.bowler === bowler)
    .forEach(sh => {
      const rt = rackTypeForLane(centerFor[sh.league], sh.lane);
      if (rt !== "freefall" && rt !== "string") return;
      // The app's first-ball test, copied from domain/stats.js rather
      // than invented here: a first ball is ballNum 1 OR absent, because
      // some paths store it and some do not.
      const isFirstBall = !sh.ballNum || sh.ballNum === 1;
      if (isFirstBall) {
        buckets[rt].firstBalls += 1;
        if (sh.result === "Strike") buckets[rt].firstBallStrikes += 1;
      }
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
    firstBalls: b.firstBalls,
    // Strikes as a share of the balls that could have been strikes.
    // Null rather than 0 with nothing thrown, for the same reason the
    // messenger rate is: a rate off no attempts is not a rate.
    strikeRate: b.firstBalls
      ? Math.round((b.firstBallStrikes / b.firstBalls) * 1000) / 10
      : null,
    // A share of STRIKES, not of shots: "how many of the strikes I got
    // came from a messenger". Strung pins rarely send one, which is the
    // whole comparison this card exists to show.
    //
    // Null rather than 0 with no strikes -- "0% of nothing" is not a
    // rate, and showing one invites reading it as "never happens".
    messengerRate: b.strikes ? Math.round((b.messengers / b.strikes) * 1000) / 10 : null,
  });

  return [summarize("Free fall", buckets.freefall), summarize("String", buckets.string)]
    .filter(s => s.games > 0 || s.strikes > 0 || s.firstBalls > 0);
}

export function statsByCenter(sessions, leagues, centers, bowler, shots) {
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

  // Messengers per centre, from the shots.
  //
  // The card listed houses and averages with no hint of WHY one carries
  // better than another, and the biggest reason is the rack: string pins
  // are tethered, so they deflect differently and messengers are rare.
  //
  // shots is optional so existing callers keep working; without it the
  // rate is simply absent rather than zero, because 0% off no data is not
  // a fact about pins.
  const msg = {};
  (Array.isArray(shots) ? shots : [])
    .filter(x => x && typeof x === "object")
    .filter(x => !bowler || x.bowler === bowler)
    .forEach(x => {
      const centerId = centerByLeague[x.league];
      if (!centerId) return;
      const m = msg[centerId] = msg[centerId] || { strikes: 0, messengers: 0 };
      if (x.result !== "Strike") return;
      m.strikes += 1;
      if (String(x.strikeDescription || "") === "Messenger") m.messengers += 1;
    });

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
      // Absent, not zero, when there are no strikes to take a rate of.
      strikes: msg[centerId]?.strikes || 0,
      messengerRate: msg[centerId]?.strikes
        ? Math.round((msg[centerId].messengers / msg[centerId].strikes) * 100)
        : null,
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
    // Blank means unrecorded, and unrecorded is NULL in the database --
    // an empty string would be a third value meaning the same thing,
    // which is exactly what removing the "not sure" chip avoided.
    rack_type: center.rackType || null,
    // Only meaningful for a mixed house; null everywhere else so a type
    // change cannot leave a stale lane list behind it.
    freefall_lanes: center.rackType === "mixed" && center.freefallLanes?.length
      ? normalizeLaneList(center.freefallLanes)
      : null,
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
    rackType: row.rack_type || "",
    freefallLanes: row.freefall_lanes || [],
    // Who created it.
    //
    // Written on every save and never read back, so the client had no way
    // to know a centre belonged to someone else -- it would try to rewrite
    // a shared row, get refused by RLS, and try again the next time. Six
    // refusals in one day, all for a row it was never allowed to touch.
    createdBy: row.created_by || "",
  });
}

// Where the app does not ask for the device's location at all.
//
// South Korea: using a phone's location is regulated as a location-based
// service there (registration and extra consent), so the app never asks
// for it on a phone set to Korean time. Centres are still searched, by
// name, around the bowler's last known centre -- or, with none yet,
// around the middle of the country, which is not the bowler's location.
const NO_DEVICE_LOCATION = new Set(["Asia/Seoul", "ROK"]);
export function deviceLocationAllowed(tz) {
  return !NO_DEVICE_LOCATION.has(String(tz || ""));
}
// The search anchor for those places when no centre is known yet.
export const COUNTRY_SEARCH_ANCHOR = { "Asia/Seoul": { lat: 36.35, lng: 127.8 }, "ROK": { lat: 36.35, lng: 127.8 } };

// ── Matching a centre's name as the bowler types ─────────────────────
//
// HERE's own text search wants the whole name: "Holi" finds nothing,
// "Holiday Bowl" finds the house. So the search also fetches the bowling
// centres near the bowler and matches them here, word by word, against
// what has been typed so far: every typed word must be the START of a
// word in the name ("hol bo" -> Holiday Bowl), ignoring case, accents and
// punctuation. The same rule runs in the find-centers function
// (supabase/functions/_shared/centerMatch.ts) -- keep the two in step.
export function centerNameKey(s) {
  return String(s ?? "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "").normalize("NFC")
    .toLowerCase()
    .replace(/['’`.]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

// 0 = the name starts with what was typed, 1 = every typed word starts a
// word of the name, 2 = the typed text appears inside the name with the
// spaces taken out ("holidaybowl"), null = no match. Nothing typed
// matches everything at 0.
export function centerMatchRank(query, name) {
  const q = centerNameKey(query);
  if (!q) return 0;
  const n = centerNameKey(name);
  if (!n) return null;
  if (n.startsWith(q)) return 0;
  const words = n.split(" ");
  if (q.split(" ").every(t => words.some(w => w.startsWith(t)))) return 1;
  if (n.replace(/ /g, "").includes(q.replace(/ /g, ""))) return 2;
  return null;
}

// The centres from `list` that match, best match first and nearest first
// within a match.
export function matchCentersByName(query, list) {
  return (Array.isArray(list) ? list : [])
    .map(c => ({ c, rank: c && c.name ? centerMatchRank(query, c.name) : null }))
    .filter(x => x.rank !== null)
    .sort((a, b) => a.rank - b.rank
      || (a.c.distance ?? Infinity) - (b.c.distance ?? Infinity)
      || String(a.c.name).localeCompare(String(b.c.name)))
    .map(x => x.c);
}
