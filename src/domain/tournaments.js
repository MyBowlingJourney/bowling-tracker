import { leagueFormat } from "./leagueSeasons.js";
import { handicapPins, scoringBasis, pinFormat, playStyle } from "./tournamentFormats.js";
// Tournament sessions.
//
// A tournament night is shaped differently enough from a league night that
// it gets its own record rather than being forced into `sessions`:
//
//   - Game count varies. Leagues are 3; tournaments might be 4, 6, 8, or an
//     odd number for a squad. Nothing here assumes 3.
//   - Lane pair changes per game. Tournaments move you after every game, so
//     the pair belongs to the GAME, not the session.
//   - It can span multiple days, each with its own cut line -- surviving day
//     one says nothing about day two.
//   - Scores are usually entered as finished games. Shot-by-shot logging is
//     impractical when you're moving pairs and racing a squad clock.
//
// Cut lines are the interesting part. A cut line is a total to beat, and
// what matters is your margin against it: positive is above the cut (good),
// negative is how far you'd need to make up. Whether you ACTUALLY made the
// cut is a separate recorded fact, because the posted line can shift and is
// often only final once the squad finishes.

import { normalizeSidePots, sidePotTotals } from "./sidePots.js";
import { normalizeMatchPlay, emptyMatchPlay, matchPlayTotals } from "./matchPlay.js";

export function emptyTournamentGame(gameNumber = 1) {
  // scoreAuto: this score came from frame tracking and should keep
  // following the frames until the bowler types over it.
  return { gameNumber, score: "", lanePair: "", scoreAuto: false };
}

export function emptyTournamentDay(dayNumber = 1) {
  return {
    dayNumber,
    date: "",
    blockNumber: "",
    startTime: "",
    // Squad scheduling: which squad and where you're assigned. startTime
    // above is when it begins; these say which one and which pair.
    squad: "",
    startingLanes: "",
    oilPattern: "",
    games: [emptyTournamentGame(1)],
    cutLine: "",
    // "+" or "-": is the cut over or under a 200 average.
    cutSign: "+",
    // null = not yet known (the usual state until the squad finishes)
    madeCut: null,
    notes: "",
  };
}

// Tournament formats.
//
// Metadata, not scoring. Tournament games are entered as final scores --
// the house scorer has already applied no-tap by the time the bowler
// types the number -- so none of this changes how anything is
// calculated. It changes what the number MEANS.
//
// Which matters: a 250 in a 9-pin no-tap squad is not a 250 in a scratch
// event, and averaging them together quietly inflates a bowler's record.
// Stored so that comparison can be made honestly later, and so a bowler
// looking back in two years knows what they actually bowled.
// The four axes live in tournamentFormats.js, which also holds what each
// one DOES. Re-exported here so callers have one import for tournaments.
export {
  SCORING_BASES, PIN_FORMATS, PLAY_STYLES,
  scoringBasis, pinFormat, playStyle,
} from "./tournamentFormats.js";

// Should this event's SCORES join the bowler's scratch figures?
//
// Two reasons they might not, and they are independent:
//
//   Baker    -- half the pins were thrown by a partner. Not the
//               bowler's score to claim.
//   No-tap   -- a nine counts as a strike, so the scores run high.
//               Pooling them inflates an average with an easier format.
//
// Handicap is NOT a reason. The scratch pins underneath are entirely the
// bowler's and entirely comparable; only the total on the sheet differs.
//
// The FRAMES are a separate question and the answer is usually yes --
// see myBakerShots. A bowler threw the balls they threw, whatever the
// event was called.
export function scoresJoinScratchFigures(tournament) {
  return playStyle(tournament) === "standard" && pinFormat(tournament) === "tenpin";
}

// A short description of the event's settings, for history and share
// cards -- "Handicap, 9 pin no-tap, Baker". Defaults are left out: a
// standard scratch 10-pin event needs no explaining.
export function describeTournamentFormat(tournament) {
  const bits = [];
  if (scoringBasis(tournament) === "handicap") bits.push("Handicap");
  if (pinFormat(tournament) === "notap9") bits.push("9 pin no-tap");
  if (playStyle(tournament) === "baker") bits.push("Baker");
  return bits.join(" · ");
}

export function emptyTournament() {
  return {
    // Recorded, not computed -- scores alone cannot show a win.
    placement: "",
    placementNote: "",
    id: "",
    bowler: "",
    name: "",
    center: "",
    // Blank means unrecorded rather than scratch. An old tournament
    // logged before this field existed should not silently claim to have
    // been a scratch event.
    // Four independent axes; every default means "as it always was".
    scoringBasis: "scratch",
    pinFormat: "tenpin",
    playStyle: "standard",
    // Handicap pins, added to EVERY game when the format is handicap.
    // Kept when the format changes so switching away and back does not
    // lose what the bowler typed.
    handicap: "",
    // Baker: who you are bowling with, and who throws frame 1.
    bakerPartner: "",
    bakerStarter: "me",
    days: [emptyTournamentDay(1)],
    buyIn: "",
    winnings: "",
    // Itemised side action, separate from the main entry above.
    sidePots: [],
    // The head-to-head phase after the cut. Empty until a bowler makes it
    // -- most tournaments end at qualifying for most bowlers.
    matchPlay: emptyMatchPlay(),
    notes: "",
  };
}

function num(v) {
  if (v === null || v === undefined) return null;
  const raw = String(v).trim();
  if (raw === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

// A bowling game is 0-300. Anything outside that isn't a score, it's a
// typo -- and letting it through would corrupt a tournament total.
function gameScore(v) {
  const n = num(v);
  if (n === null) return null;
  const r = Math.round(n);
  return r < 0 || r > 300 ? null : r;
}

export function normalizeTournament(raw) {
  const base = emptyTournament();
  if (!raw || typeof raw !== "object") return base;
  const days = Array.isArray(raw.days) && raw.days.length
    ? raw.days.map((d, i) => normalizeTournamentDay(d, i + 1))
    : base.days;
  return {
    id: raw.id || "",
    bowler: raw.bowler || "",
    name: raw.name || "",
    center: raw.center || "",
    // Validated against the known list rather than trusted: a format
    // nobody can interpret is worse than none recorded.
    scoringBasis: scoringBasis(raw),
    pinFormat: pinFormat(raw),
    playStyle: playStyle(raw),
    handicap: raw.handicap ?? "",
    bakerPartner: raw.bakerPartner || "",
    bakerStarter: raw.bakerStarter === "partner" ? "partner" : "me",
    // Listed here as well as in emptyTournament: this function rebuilds
    // the object field by field, so anything missing HERE is dropped on
    // every save.
    placement: raw.placement || "",
    placementNote: raw.placementNote || "",
    days,
    buyIn: raw.buyIn ?? "",
    winnings: raw.winnings ?? "",
    sidePots: normalizeSidePots(raw.sidePots),
    matchPlay: normalizeMatchPlay(raw.matchPlay),
    notes: raw.notes || "",
  };
}

export function normalizeTournamentDay(raw, dayNumber = 1) {
  const base = emptyTournamentDay(dayNumber);
  if (!raw || typeof raw !== "object") return base;
  const games = Array.isArray(raw.games) && raw.games.length
    ? raw.games.map((g, i) => ({
        gameNumber: i + 1,
        score: g?.score ?? "",
        lanePair: g?.lanePair ?? "",
        scoreAuto: g?.scoreAuto === true,
      }))
    : base.games;
  return {
    dayNumber: raw.dayNumber ?? dayNumber,
    date: raw.date || "",
    blockNumber: raw.blockNumber ?? "",
    startTime: raw.startTime || "",
    squad: raw.squad || "",
    startingLanes: raw.startingLanes || "",
    oilPattern: raw.oilPattern || "",
    games,
    cutLine: raw.cutLine ?? "",
    cutSign: raw.cutSign === "-" ? "-" : "+",
    // true / false / "na" / null. "na" is the bowler saying this block
    // had no cut at all, which is a different statement from null ("not
    // known yet") and has to survive a round trip to say so. Everything
    // that counts cuts tests === true or === false, so "na" is excluded
    // from the stats exactly like null.
    madeCut: raw.madeCut === true || raw.madeCut === false ? raw.madeCut
      : raw.madeCut === "na" ? "na" : null,
    notes: raw.notes || "",
  };
}

// ── Game management ─────────────────────────────────────────────────────
// Every updater below takes a tournament or a day and returns a new one.
// Handed something that is not an object -- state before it loads, a
// null from the cloud -- they used to throw on `.days` or `.games`.
//
// They now return the input UNTOUCHED. Not an invented empty
// tournament: fabricating a shape here would hide the real problem
// further downstream, where an empty tournament looks like a real one
// the bowler deleted.
function isRecord(v) { return !!v && typeof v === "object" && !Array.isArray(v); }

export function addGame(day) {
  if (!isRecord(day)) return day;
  const games = day.games || [];
  return { ...day, games: [...games, emptyTournamentGame(games.length + 1)] };
}

export function removeGame(day, gameNumber) {
  if (!isRecord(day)) return day;
  const remaining = (day.games || []).filter(g => g.gameNumber !== gameNumber);
  // Renumber so game numbers stay contiguous after a removal from the middle.
  return { ...day, games: remaining.map((g, i) => ({ ...g, gameNumber: i + 1 })) };
}

export function setGameField(day, gameNumber, field, value) {
  if (!isRecord(day)) return day;
  return {
    ...day,
    games: (day.games || []).map(g => g.gameNumber === gameNumber ? { ...g, [field]: value } : g),
  };
}

// ── Day management ──────────────────────────────────────────────────────
export function addDay(tournament) {
  if (!isRecord(tournament)) return tournament;
  const days = tournament.days || [];
  return { ...tournament, days: [...days, emptyTournamentDay(days.length + 1)] };
}

export function removeDay(tournament, dayNumber) {
  if (!isRecord(tournament)) return tournament;
  const remaining = (tournament.days || []).filter(d => d.dayNumber !== dayNumber);
  const days = remaining.length ? remaining : [emptyTournamentDay(1)];
  return { ...tournament, days: days.map((d, i) => ({ ...d, dayNumber: i + 1 })) };
}

export function setDayField(tournament, dayNumber, field, value) {
  if (!isRecord(tournament)) return tournament;
  return {
    ...tournament,
    days: (tournament.days || []).map(d => d.dayNumber === dayNumber ? { ...d, [field]: value } : d),
  };
}

export function updateDay(tournament, dayNumber, updater) {
  if (!isRecord(tournament)) return tournament;
  return {
    ...tournament,
    days: (tournament.days || []).map(d => d.dayNumber === dayNumber ? updater(d) : d),
  };
}

// ── Totals and cut ──────────────────────────────────────────────────────
// Only games with an entered score count. A blank game is one not yet
// bowled, not a zero -- treating it as zero would make a running total
// during a block look catastrophic.
// A game's score: what the bowler typed, or what their frames add up to.
//
// The same rule league play already uses in resolveGameScore -- a typed
// score wins, and frames fill the gap. Without it a bowler frame-tracking
// a tournament had to log every shot AND type the total, which is the
// same number entered twice and two chances to disagree.
//
// The typed score wins deliberately. The house scorer is what decides
// whether you cashed, and if a frame was mis-tapped the bowler needs a
// way to say "no, it was 212" that the app does not argue with.
//
// `shotScores` is a map of game number to shot-derived score, supplied by
// the caller because this module has no access to shots. Absent, this
// behaves exactly as it did before -- which is what every existing caller
// and test relies on.
export function resolveTournamentGameScore(game, shotScores) {
  const typed = gameScore(game?.score);
  if (typed !== null) return typed;
  const map = (shotScores && typeof shotScores === "object") ? shotScores : null;
  if (!map) return null;
  const derived = map[String(game?.gameNumber)];
  const n = Number(derived);
  return Number.isFinite(n) && n >= 0 && n <= 300 ? n : null;
}

export function dayTotal(day, shotScores) {
  const scores = (day?.games || [])
    .map(g => resolveTournamentGameScore(g, shotScores))
    .filter(v => v !== null);
  if (!scores.length) return null;
  return scores.reduce((a, b) => a + b, 0);
}

export function dayGamesEntered(day, shotScores) {
  return (day?.games || [])
    .filter(g => resolveTournamentGameScore(g, shotScores) !== null).length;
}

export function dayAverage(day, shotScores) {
  const total = dayTotal(day, shotScores);
  const n = dayGamesEntered(day, shotScores);
  return total === null || n === 0 ? null : total / n;
}

// Margin against the day's cut line. Positive = above the cut.
// Returns null when either side is unknown, so the UI can stay quiet
// rather than implying a standing that isn't real yet.
// Pace scoring: 200 a game is even, and a cut is quoted as pins over or
// under that.
//
// A cut posted as "+150" after eight games means 1750, and "-20" means
// 1580. Bowlers read and repeat cuts this way, so asking for the raw
// total made them do arithmetic the app can do -- and a mistake in that
// arithmetic silently misreports whether they cashed.
export const PACE_PER_GAME = 200;

// The absolute total the cut represents, for however many games have
// been bowled.
//
// Games ENTERED, not scheduled: a cut quoted after eight games means
// nothing until eight are in, and computing it against five would show a
// bowler comfortably over a line that has not been reached yet.
export function cutTarget(day, shotScores) {
  const pace = num(day?.cutLine);
  if (pace === null) return null;
  const games = dayGamesEntered(day, shotScores);
  if (!games) return null;
  return (PACE_PER_GAME * games) + (day?.cutSign === "-" ? -pace : pace);
}

export function cutMargin(day, shotScores) {
  const total = dayTotal(day, shotScores);
  const target = cutTarget(day, shotScores);
  if (total === null || target === null) return null;
  return total - target;
}

// The total that decides where a bowler finished.
//
// Handicap included, because that is the number the tournament used --
// a bowler checking the cut line needs what was on the sheet, not their
// scratch pins. Scratch and Baker events add nothing, so this is the
// same figure as before for them.
export function tournamentTotalWithHandicap(tournament, shotScores) {
  const scratch = tournamentTotal(tournament, shotScores);
  if (scratch === null) return null;
  return scratch + handicapPins(tournament, tournamentGamesEntered(tournament, shotScores));
}

export function tournamentTotal(tournament, shotScores) {
  // .map(d => dayTotal(d, shotScores)), NOT .map(dayTotal) -- passing the
  // function directly hands Array.map's index as the second argument, so
  // day 1 would look up shot scores in the number 1.
  const totals = (tournament?.days || [])
    .map(d => dayTotal(d, shotScores)).filter(v => v !== null);
  if (!totals.length) return null;
  return totals.reduce((a, b) => a + b, 0);
}

export function tournamentGamesEntered(tournament, shotScores) {
  return (tournament?.days || []).reduce((a, d) => a + dayGamesEntered(d, shotScores), 0);
}

export function tournamentAverage(tournament, shotScores) {
  const total = tournamentTotal(tournament, shotScores);
  const n = tournamentGamesEntered(tournament, shotScores);
  return total === null || n === 0 ? null : total / n;
}

// Net money. Buy-in is a cost, winnings are a return; blank counts as zero
// here (unlike scores) because "didn't pay" and "paid nothing" are the same.
export function tournamentMoney(tournament) {
  const buyIn = num(tournament?.buyIn) ?? 0;
  const winnings = num(tournament?.winnings) ?? 0;
  const side = sidePotTotals(tournament?.sidePots);
  // entryNet and net are both reported: the first answers "was the
  // tournament itself worth entering", the second "did I leave up".
  // Collapsing them would hide a bowler who cashes the main event every
  // week and gives it all back in brackets.
  const entryNet = Math.round((winnings - buyIn) * 100) / 100;
  return {
    buyIn,
    winnings,
    entryNet,
    side,
    totalCost: Math.round((buyIn + side.cost) * 100) / 100,
    totalWon: Math.round((winnings + side.won) * 100) / 100,
    net: Math.round((entryNet + side.net) * 100) / 100,
  };
}

// Qualifying total plus the match-play block, which is what actually
// decides a finish at events that have one.
export function tournamentFinalTotal(tournament) {
  const qualifying = tournamentTotal(tournament);
  const mp = matchPlayTotals(tournament?.matchPlay);
  if (!mp.played) return { qualifying, matchPlay: null, total: qualifying };
  return { qualifying, matchPlay: mp, total: qualifying + mp.total };
}

// ── Supabase mapping ────────────────────────────────────────────────────
export function tournamentToRow(t, userId) {
  return {
    id: t.id,
    user_id: userId,
    bowler_name: t.bowler,
    name: t.name,
    center: t.center || null,
    scoring_basis: scoringBasis(t),
    pin_format: pinFormat(t),
    play_style: playStyle(t),
    handicap: num(t.handicap),
    baker_partner: t.bakerPartner || null,
    baker_starter: t.bakerStarter === "partner" ? "partner" : "me",
    days: t.days || [],
    buy_in: num(t.buyIn),
    winnings: num(t.winnings),
    side_pots: normalizeSidePots(t.sidePots),
    match_play: normalizeMatchPlay(t.matchPlay),
    notes: t.notes || null,
  };
}

export function tournamentFromRow(row) {
  if (!row) return null;
  return normalizeTournament({
    id: row.id,
    bowler: row.bowler_name || "",
    name: row.name || "",
    center: row.center || "",
    scoringBasis: scoringBasis({ scoringBasis: row.scoring_basis }),
    pinFormat: pinFormat({ pinFormat: row.pin_format }),
    playStyle: playStyle({ playStyle: row.play_style }),
    handicap: row.handicap == null ? "" : String(row.handicap),
    bakerPartner: row.baker_partner || "",
    bakerStarter: row.baker_starter === "partner" ? "partner" : "me",
    days: row.days || [],
    buyIn: row.buy_in == null ? "" : String(row.buy_in),
    winnings: row.winnings == null ? "" : String(row.winnings),
    sidePots: row.side_pots || [],
    matchPlay: row.match_play || null,
    notes: row.notes || "",
  });
}
