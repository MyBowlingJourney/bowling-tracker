import { useState, useEffect, useRef, useMemo, Suspense } from "react";
// lazyScreen instead of React.lazy: a deploy while the app is open
// replaces every content-hashed chunk, and a page already loaded asks
// for names that no longer exist. See src/lazyScreen.js.
import { lazyScreen } from "./lazyScreen.js";
import LogView from "./LogView.jsx";
// SessionStart is no longer rendered anywhere.
//
// Its card asked which mode you are bowling, and Home asks that now
// with four tinted rows -- so both render sites were removed and the
// import was the only thing keeping the file in the bundle.
//
// The file itself is left in place: showSessionStart and
// dismissSessionStart still exist and still gate other cards, and the
// component is the obvious home if a launch prompt is wanted again.
import Onboarding from "./Onboarding.jsx";
// Lazy: the tour is a full-screen takeover gated on activeTour, so a
// returning bowler pays for none of it. Its TourScreen mock-ups are
// the single biggest chunk that was loading on every open.
const Tour = lazyScreen("Tour", () => import("./Tour.jsx"));

// Lazy like the others -- see lazyScreen for the stale-chunk recovery.
const JourneyScreen = lazyScreen("Journey", () => import("./JourneyView.jsx"));

const HomeScreen = lazyScreen("Home", () => import("./HomeView.jsx"));
import { tourSteps, tourToOffer, markTourSeen, hasSeenTour, needsLeagueSetup, availableTours, FIRST_TOUR, TRACK_KEYS } from "./domain/tour.js";
import HelpView from "./HelpView.jsx";
import CasualLeaderboard from "./CasualLeaderboard.jsx";
const BadgeCollection = lazyScreen("BadgeCollection", () => import("./BadgeCollection.jsx"));

// Not lazy: the lamp is on every screen, so it is never the thing being
// waited for -- and a floating button that pops in late looks broken.
import BowlingGenie from "./BowlingGenie.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";
import GoalsPanel from "./GoalsPanel.jsx";
import ImportedScoresInbox, { InboxList } from "./ImportedScoresInbox.jsx";
import { pendingTeamInvites, buildInbox, inboxCount as countInbox } from "./domain/inbox.js";
import DrillSession from "./DrillSession.jsx";
import { useAuth } from "./AuthProvider.jsx";
import { supabase } from "./supabaseClient.js";
import { classifySyncError, cloudRead, cloudReadDelta, cloudWrite, cloudInsert, cloudUpdate, cloudDelete, getQueuedRecordsForTable, getPendingCount, onPendingCountChange, inspectPendingQueue, clearPendingQueue, discardQueuedTable, flushPendingQueue } from "./syncQueue.js";
import { mergeDelta, nextCursor } from "./domain/deltaSync.js";
import { normalizeSignupCode, isValidSignupCode } from "./domain/signupCodes.js";
import { shouldOfferShotByShot } from "./domain/trackingPrompt.js";
import { shouldPromptForTeam, scoresToAdopt } from "./domain/teamPrompt.js";
import { splitConversionByType, isSplit, isTenPinLeave, isCornerPinLeave, isSinglePinLeave, isWashout, isMakeableSpare } from "./domain/splits.js";
import { maxPossibleScore,
  isStk, firstBallOf, secondBallOf, tenthBall3Available, tenthBall3Pins,
  nextState, tenthFrameStatus, strictPartial, frameQualityScore, makeTheoreticalShots,
  freshRackShots, theoreticalFillBallValue, tenthBall3Earned,
} from "./domain/scoring.js";
import { emptyShot, computeSessionStats, findExistingShotSlot } from "./domain/sessions.js";
import { buyInsForLeague, costArraysFor } from "./domain/money.js";
import { normalizeLayout } from "./domain/layouts.js";
import { profileFromRow, profileToRow, emptyProfile, normalizeProfile, resolveHandedness, suggestBookAverage } from "./domain/profiles.js";
import { emptyTournament, normalizeTournament, tournamentToRow, tournamentFromRow } from "./domain/tournaments.js";
import { todaysRoutine, shouldShowLaunchPrompt } from "./domain/launchPrompt.js";
import { normalizeGoals, goalsToRow, goalsFromRow, measurementsFor } from "./domain/goals.js";
import { scoreStats, gamePositionAverages } from "./domain/scoreInsights.js";
import { buildAnalysisPayload, unlockSignature, statLabel } from "./domain/insightGating.js";
import { drillLines } from "./domain/sessionRecap.js";
import { categorizeCoaching, taskFromRow, taskToRow, noteFromRow, noteToRow, completeTask, recordAttempt, reopenTask, normalizeTask, bowlerSnapshot, shotBreakdown, respondedSince, latestResponseAt } from "./domain/coaching.js";
import { normalizeImportRecord, effectiveScores, approve as approveImport, reject as rejectImport,
  correctAsTeammate, canCorrect as canCorrectImportRecord, isConfirmed,
  pendingFor as pendingForImport, needingReentry as needingImportReentry, shouldSupersede, supersede } from "./domain/importVerification.js";
import { coachViewActive, setCoachView, applyEnvironment, setTrackingMode } from "./domain/preferences.js";
import { emptyBag, normalizeBag, bagToRow, bagFromRow, availableBalls, bagsForEnvironment, plasticLast, bagHasRoom, toggleBallInBag, removeBagMemberships, ballsByBagFor, membershipKey } from "./domain/bags.js";
import { DEFAULT_BALL_GROUPS, emptyBallSpecs, normalizeBallSpecs, specsToRow, specsFromRow, groupToRow, groupFromRow } from "./domain/ballSpecs.js";
import { ballKey, catalogState, bestEntry, rejectedBallsFor, clearedSpecsAfterRejection, canVote } from "./domain/ballCatalog.js";
import { normalizeCenter, centerToRow, centerFromRow, findExistingCenter, statsByCenter } from "./domain/centers.js";
import { normalizePattern, patternFromRow, patternToRow, patternAverages, allVerifiedPbaPatterns } from "./domain/oilPatterns.js";
import { normalizeLeagueDates, needsBookAverageUpdate , isNoTapLeague, leagueFormat} from "./domain/leagueSeasons.js";
import { archiveOnNewStart, compareSeasons, describeSeasonChange } from "./domain/seasons.js";

import { sessionsForFigures, isBaker, bakerBowlerFor } from "./domain/tournamentFormats.js";
import { emptyDrill, normalizeDrill, drillToRow, drillFromRow } from "./domain/drills.js";
import { scorekeepingOptions, allowsOtherBowlers, normalizeGuests, addGuest, removeGuest } from "./domain/scorekeeping.js";
import { allowedLeagues, lockedLeagues } from "./domain/entitlements.js";
// Not lazy: it is one small card, it is rendered conditionally already,
// and a Suspense boundary around a prompt this short would flash.
import KeptLeaguePicker from "./KeptLeaguePicker.jsx";
import TrialBanner from "./TrialBanner.jsx";
import { visibleLeagues, isLeagueHidden, teamsInLeague, describeLeaveImpact, leaveConfirmationText, isContainerLeague } from "./domain/leagueMembership.js";
import { decodeShare } from "./domain/badgeShare.js";
import { allCompetitiveBadges } from "./domain/badgeContext.js";
import { buildGenieContext } from "./domain/genie.js";
import { COMPETITIVE_BADGES, whereEarnable } from "./domain/competitiveBadges.js";
import { casualNightsFrom, setGameEquipment as setGameEquipmentIn, gameEquipmentFromRows, getGameEquipment, defaultPracticeBall, setManualScore as setManualScoreIn, getManualScore, resolveGameScore, normalizeManualScores, manualScoreToRow, manualScoresFromRows, isManualNight } from "./domain/manualScores.js";
import { bowlerHighGame, bowlerHighSeries, hangAssistCounts, teamDateGroups, teamHighGame, teamHighSeries, seasonRecord, weeklyPointsData, gameAvg, teamGameTotalAvg, teamGameTotalAvgAt, rAvg, cAvg, avgProgress, cumulativeAvgBeforeDate, hungCounts, beatHighBowlerStats, scoreValues, scoreConsistency, histogramBuckets } from "./domain/stats.js";
import { lineupSort, renameLeagueInRecords } from "./domain/leagues.js";
import { C, S, F, Chip, applyTheme } from "./ui.jsx";
import { PLASTIC_BALL, DEFAULT_ARSENAL, MISSES, DEFAULT_LEAGUES, localDateString, APP_NAME, PRACTICE_SESSION_KEY, CASUAL_SESSION_KEY, practiceLeagueCloudName, casualLeagueCloudName, practiceLeagueDisplayName, isPracticeLeagueName, isCasualLeagueName, TOURNAMENT_SESSION_KEY, tournamentLeagueCloudName, IMPORTED_SESSION_KEY } from "./constants.js";
import { validTeamId,
  shotToSupabaseRow, shotFromSupabaseRow, sessionToSupabaseRow, sessionFromSupabaseRow,
  matchToSupabaseRow, matchFromSupabaseRow, lanePatternToSupabaseRow, lanePatternFromSupabaseRow,
  closedSeasonToRow, closedSeasonFromRow,
} from "./domain/supabaseMapping.js";

// Screens behind a tab or icon are loaded ON DEMAND, not at startup.
//
// The Bowl tab is what opens when the app launches, and it needs none of
// these. Loading them eagerly meant every bowler downloaded the entire
// app -- including recharts, ~400KB and by far the heaviest dependency,
// pulled in by StatsView and TrendsView -- before they could log a shot
// at the lanes on centre wifi.
//
// Each still renders exactly as before; only WHEN its code arrives
// changes. Suspense shows a brief placeholder on first visit to a tab,
// then it's cached for the session.
const TeamManagement = lazyScreen("TeamManagement", () => import("./TeamManagement.jsx"));
const Friends = lazyScreen("Friends", () => import("./Friends.jsx"));
import { categorizeFriendships } from "./Friends.jsx";

import { retireBall, unretireBall, activeBalls, retiredBallNames, retiredBallSummary, describeRetirement, isRetired } from "./domain/retiredBalls.js";

import { hasDuplicateIdentity, mergedBowlers, movedRecords, movedKeyedMap, handleFromEmail } from "./domain/bowlerIdentity.js";

import { leaveCauseProfile, missingCauseFields } from "./domain/leaveCauses.js";

import { sessionIsLive } from "./domain/home.js";

import { STATS_GROUPS } from "./domain/statsGroups.js";
const StatsView = lazyScreen("StatsView", () => import("./StatsView.jsx"));
const ImportScorecard = lazyScreen("ImportScorecard", () => import("./ImportScorecard.jsx"));
const Settings = lazyScreen("Settings", () => import("./Settings.jsx"));
const Profile = lazyScreen("Profile", () => import("./Profile.jsx"));
const TrendsView = lazyScreen("TrendsView", () => import("./TrendsView.jsx"));
const CoachingView = lazyScreen("CoachingView", () => import("./CoachingView.jsx"));
const InsightsView = lazyScreen("InsightsView", () => import("./InsightsView.jsx"));


// Browser persistence adapter. The original app used the ChatGPT host
// storage API; GitHub Pages needs a browser-native equivalent. Guarded by
// typeof so this module can also be imported under Vitest's Node test
// environment, where there is no `window` at all.
if (typeof window !== "undefined" && !window.storage) {
  window.storage = {
    async get(key) {
      const value = window.localStorage.getItem(key);
      return value === null ? null : { value };
    },
    async set(key, value) {
      window.localStorage.setItem(key, value);
      return { value };
    },
    async delete(key) {
      window.localStorage.removeItem(key);
    },
  };
}

const STORAGE_KEY = "bowling-shots-v2";
// Delta sync cursors: the timestamp of the latest change this device has
// already pulled for shots/sessions. Present means "ask for what changed
// since this"; absent means "this device has never completed a sync" and
// a full fetch runs instead, same as every load did before this existed.
//
// -v1 so a stale cursor from a future format change can't be misread as
// a valid one — same convention as every other local key here.
const SHOTS_CURSOR_KEY = "bowling-shots-cursor-v1";
const SESSIONS_CURSOR_KEY = "bowling-sessions-cursor-v1";
// Tonight's context: which league, which date, which lane pair.
//
// Shots were always saved, but the context needed to FIND them was not --
// sessionLeague reset to "" on every refresh, so a bowler mid-session who
// reloaded (or whose phone reclaimed the tab, which happens constantly at
// an alley) came back to a screen showing no scores. The data was intact
// the whole time; nothing could locate it.
const SESSION_CONTEXT_KEY = "bowling-session-context-v1";
const SESSIONS_KEY = "bowling-sessions-v2";
const BOWLERS_KEY = "bowling-bowlers-v1";
const ARSENALS_KEY = "bowling-arsenals-v1";
// Retired balls, per bowler: { "Ryan": { "Zen": "2026-03-01" } }.
//
// Beside the arsenal rather than inside it: an arsenal is an array of
// ball NAMES, read in a dozen places and threaded through bags, the ball
// picker and every stat. Changing that shape to carry a date is a
// migration with far more surface than this feature is worth.
const RETIRED_BALLS_KEY = "bowling-retired-balls-v1";
const LAYOUTS_KEY = "bowling-ball-layouts-v1";
const PROFILES_KEY = "bowling-bowler-profiles-v1";
// Dismissal of the shot-by-shot offer. Device-level and permanent:
// asked and answered. Scoped per user by the storage wrapper like
// every other key, so one bowler saying no does not silence it for
// another person signing in on the same phone.
const SHOT_PROMPT_KEY = "bowling-shot-prompt-dismissed-v1";
// Dismissal of the "add a team" reminder. Per user, like every other
// key, so one bowler saying no does not silence it for someone else
// signing in on the same phone.
const TEAM_PROMPT_KEY = "bowling-team-prompt-dismissed-v1";
const TOURNAMENT_KEY = "bowling-active-tournament-v1";
const TOURNAMENTS_KEY = "bowling-tournaments-v1";
const BAGS_KEY = "bowling-bags-v1";
const BALL_BAGS_KEY = "bowling-ball-bag-assignments-v1";
const BALL_SPECS_KEY = "bowling-ball-specs-v1";
const BALL_GROUPS_KEY = "bowling-ball-groups-v1";
const CATALOG_ACK_KEY = "bowling-catalog-ack-v1";
const CENTERS_KEY = "bowling-centers-v1";
const OIL_PATTERNS_KEY = "bowling-oil-patterns-v1";
const LEAGUE_CENTERS_KEY = "bowling-league-centers-v1";
// Buy-in rates per league. A league's buy-ins don't change game to game
// or week to week, so they're entered once and reused -- see
// domain/money.js.
const LEAGUE_BUY_INS_KEY = "bowling-league-buy-ins-v1";
const LEAGUE_DATES_KEY = "bowling-league-dates-v1";

const CLOSED_SEASONS_KEY = "bowling-closed-seasons-v1";
const HIDDEN_LEAGUES_KEY = "bowling-hidden-leagues-v1";
const DRILLS_KEY = "bowling-drills-v1";
// Signature of what was analysable last time Insights was evaluated, so a
// newly-crossed threshold can be announced exactly once.
const INSIGHT_UNLOCK_KEY = "bowling-insight-unlocks-v1";
// When the coach last read their bowlers' task responses.
const COACH_SEEN_KEY = "bowling-coach-seen-v1";
const GUESTS_KEY = "bowling-practice-guests-v1";
const MANUAL_SCORES_KEY = "bowling-manual-scores-v1";
const GAME_EQUIPMENT_KEY = "bowling-game-equipment-v1";
const SESSION_START_KEY = "bowling-session-start-dismissed-v1";
// Separate from the dismissed-date key: "have they ever seen it" and "did
// they dismiss it today" are different questions and both are needed.
const SESSION_START_SEEN_KEY = "bowling-session-start-seen-v1";
// Whether the full-screen first-launch flow has been completed. Separate
// from the daily prompt's keys: this one is once-ever.
const ONBOARDED_KEY = "bowling-onboarded-v1";
// The walkthrough after setup. Separate from ONBOARDED_KEY so an
// existing bowler who already finished setup doesn't get a tour they
// never asked for on the next update.
const TOURS_SEEN_KEY = "bowling-tours-seen-v1";
const GOALS_KEY = "bowling-goals-v1";
const MATCHES_KEY = "bowling-matches-v1";
const LANE_PATTERNS_KEY = "bowling-lane-patterns-v1";
const LEAGUES_KEY = "bowling-leagues-v1";

// ── Score calculator ──────────────────────────────────────────────────────────
// Shots: {frame:"1"-"10", ballNum:1-3 (frame 10 only), result, spareMade, pinCount}
// pinCount = total pins for that frame (both balls combined for open frames 1-9)
//            for frame 10: per-ball pin count
// isStk(s): Strike or 9 Pin No-Tap


// A "single pin leave" is any shot where exactly one pin was left standing,
// regardless of which pin — Weak 10/Ringing 10 (always the 10 pin), or
// "Other Leave" with exactly one pin selected (7, 4, 8, 10, etc.).


// first ball pins for a frame (used for bonus calculation)
// For frames 1-9: otherLeave = pins standing after ball 1 → firstBall = 10 - standing
// For 10th frame balls: same logic applies when ball is at a fresh set


// Second ball pins for a non-strike frame
// For open frames: pinCount is the TOTAL frame pins (both balls)
// so second ball = pinCount - firstBall


// 10th-frame ball 3 doesn't always face a fresh 10-pin rack: if ball 1 struck
// but ball 2 did NOT (left some pins standing), ball 3 is attempting only
// those specific remaining pins — not a full fresh rack. This computes how
// many pins were actually available to ball 3.


// Pins knocked on 10th-frame ball 3, correctly scoped to what was available
// (rather than always assuming a fresh 10-pin rack).


// ── Empty shot factory ────────────────────────────────────────────────────────


// Maps a client shot object to a Supabase `shots` row. league_id is
// resolved from the shot's league NAME via leagueIdsMap (name -> id) — the
// client keeps working with league names everywhere else, this is the one
// place that needs the real id.


// The inverse: a Supabase row back to the client's shot shape. leagueNameById
// is id -> name, the reverse of leagueIdsMap above.






// ── Determine next state after saving a shot ─────────────────────────────────


// Given a bowler's shots for one specific night, returns which ball
// number(s) are valid to enter next in the 10th frame — [] means the frame
// is complete (no bonus ball earned), [1] means it hasn't started yet.
// Scoped by league+date+game for the same reason nextState is: game
// numbers (1/2/3) repeat every night, so an unscoped lookup would let an
// unrelated night's 10th frame contaminate tonight's.


// Aggregates a night's worth of shots for one bowler into the derived stats
// a session record stores. Takes exactly the shots that belong to that
// night (already filtered by bowler+league+date) — deliberately doesn't do
// that filtering itself, so it stays a pure function of "these shots" with
// no dependency on how the caller found them.


// A "slot" is uniquely identified by bowler+league+date+game+frame+ballNum.
// Finding an existing match before saving is what prevents a duplicate shot
// from corrupting frame lookups in strictPartial, which expects exactly one
// shot per slot.


// Cascades a league rename across any record type that carries a `.league`
// field (shots, sessions, matches, lane patterns) — renaming a league must
// never leave old records silently orphaned under a name nothing matches
// anymore.








// A stable id derived from a natural key, so writes that represent "the
// same logical row" upsert instead of colliding with a unique constraint.
// Used where a table has a uniqueness rule the app must respect on retry:
// one vote per (user, submission), one submission per (user, ball).
async function stableId(...parts){
  // Length-prefix each part so no choice of separator inside a value can
  // make two different inputs hash the same -- ball names are free text.
  const data=new TextEncoder().encode(parts.map(p=>`${String(p).length}:${p}`).join("|"));
  const hash=await crypto.subtle.digest("SHA-256",data);
  const hex=[...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,"0")).join("");
  // Format as a UUID so Postgres accepts it in a uuid column.
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-4${hex.slice(13,16)}-8${hex.slice(17,20)}-${hex.slice(20,32)}`;
}


// Reads a locally cached value and rejects it if it isn't the expected
// shape. Local storage outlives app versions -- a key written by an old
// build, or a bad restore, can hold anything. A wrong-shaped value doesn't
// just render oddly; it crashes the first handler that spreads or maps it.
async function readCached(key,expect){
  try{
    const r=await window.storage.get(key);
    if(!r)return null;
    const v=JSON.parse(r.value);
    if(expect==="array"&&!Array.isArray(v))return null;
    if(expect==="object"&&(typeof v!=="object"||v===null||Array.isArray(v)))return null;
    return v;
  }catch{return null;}
}

// Merges a delta fetch into a table's local cache and persists both the
// result and the advanced cursor.
//
// One routine shared by shots and sessions rather than two copies, so a
// fix to the merge logic can't land on one table and not the other by
// accident — exactly the kind of drift this whole session has been
// finding and fixing in existing code.
async function applyDelta(deltaRes,{storageKey,cursorKey,cursor,mapRow,migrate,pendingTable}){
  if(deltaRes.online){
    const existingRaw=await window.storage.get(storageKey);
    let existing=[];
    if(existingRaw){try{const p=JSON.parse(existingRaw.value);if(Array.isArray(p))existing=p;}catch{}}

    // The same "an unsynced local edit always wins" rule the full-fetch
    // path already used, reapplied on top of the merge.
    const pending=await getQueuedRecordsForTable(pendingTable);
    const pendingIds=new Set(pending.map(p=>p.id));
    const tombstoneIds=(deltaRes.tombstones||[]).map(t=>t.row_id);
    const incoming=(deltaRes.rows||[]).filter(row=>!pendingIds.has(row.id)).map(mapRow);
    const merged=mergeDelta(existing,incoming,tombstoneIds).filter(row=>!pendingIds.has(row.id));
    const pendingObjs=pending.map(mapRow);
    const result=migrate([...merged,...pendingObjs]);

    const timestamps=[
      ...(deltaRes.rows||[]).map(r=>r.updated_at),
      ...(deltaRes.tombstones||[]).map(t=>t.deleted_at),
    ];
    const newCursor=nextCursor(cursor,timestamps);
    try{
      await window.storage.set(storageKey,JSON.stringify(result));
      await window.storage.set(cursorKey,newCursor);
    }catch{}
    return result;
  }
  // The delta fetch failed -- offline, or a transient error. Same
  // fallback as every load has always had: whatever is cached, left
  // untouched, cursor left alone so the next attempt resumes from the
  // same point instead of losing progress.
  const r=await window.storage.get(storageKey);
  let loaded=[];
  if(r){try{const p=JSON.parse(r.value);if(Array.isArray(p))loaded=p;}catch{}}
  return migrate(loaded);
}

export default function BowlingTracker(){
  const{user,preferences,updatePreferences,displayName,updateDisplayName}=useAuth();

  // Theme. Applied synchronously during render rather than in an effect,
  // so the FIRST paint is already in the chosen theme -- an effect would
  // flash the default palette for one frame on every load. applyTheme is
  // idempotent and returns false when nothing changed, so this costs
  // nothing on the renders where the theme is already right.
  //
  // Mutating C during render is deliberate and safe here: every component
  // reads C at its own render, which happens after this line in the same
  // pass, and the token object is stable so nothing re-renders in a loop.
  applyTheme(preferences?.theme);
  // Maps league name -> its Supabase row id. The client keeps `leagues` as
  // plain name strings everywhere (unchanged, to avoid rewriting every call
  // site that compares/filters by league name) — this ref is what lets
  // renameLeague update the correct row in place by id, instead of
  // deleting-and-recreating it (which would cascade-delete every team in
  // that league, since teams.league_id references leagues.id).
  const leagueIdsRef=useRef({});
  const[view,setView]=useState("home");

  // Stats and Trends are one nav tab ("Data") with a sub-tab, rather than
  // two top-level tabs. They already share statsBowler/statsLeague, so the
  // "Viewing" selection carries across the sub-tab switch instead of being
  // re-picked -- which is the main reason merging them works.
  const[dataTab,setDataTab]=useState("stats");
  // Teams and Friends share one nav slot. Which of the two is showing is
  // its own bit of state so switching between them doesn't disturb `view`.
  const[shots,setShots]=useState([]);
  const[sessions,setSessions]=useState([]);
  const[bowlers,setBowlers]=useState([]);
  // The fixed footer's actual height changes depending on which optional
  // rows are showing (the spare-made warning, the Cancel Edit button) — a
  // static guess is always wrong in some state, either leaving visible dead
  // space above it or letting it overlap the last card. Measured live via
  // ResizeObserver instead, so the spacer above it always matches exactly.
  const footerRef=useRef(null);
  const[footerHeight,setFooterHeight]=useState(80);
  const[teams,setTeams]=useState(()=>{
  try{
    const raw=window.localStorage.getItem("bowling-teams-v1");
    if(!raw)return [];
    const parsed=JSON.parse(raw);
    return Array.isArray(parsed)?parsed:[];
  }catch{
    return [];
  }
  });
  const[leagues,setLeagues]=useState(DEFAULT_LEAGUES);
  // The subscription. Null is the normal state for a free bowler, and
  // every gate in domain/entitlements.js reads null as unsubscribed.
  const[entitlement,setEntitlement]=useState(null);
  const[activeBowler,setActiveBowler]=useState("");
  const[newBowlerName,setNewBowlerName]=useState("");
  const[arsenals,setArsenals]=useState({}); // {bowlerName: [ballName,...]}
  // Drilling layouts, keyed "bowlerName|ballName" -> {system, values}.
  // Kept separate from `arsenals` (a plain string array of ball names)
  // rather than restructuring it, so every existing consumer of arsenals
  // -- ballUniverse, addBall, removeBall, the cloud sync -- keeps working
  // unchanged. A ball with no layout recorded simply has no entry here.
  const[ballLayouts,setBallLayouts]=useState({});
  // Per-bowler profiles, keyed by bowler name -- handedness, two-handed
  // delivery, home centers, notes. Team/league membership is deliberately
  // NOT stored here; it's derived from the roster so the two can't drift.
  const[profiles,setProfiles]=useState({});
  const[shotPromptDismissed,setShotPromptDismissed]=useState(true); // assume dismissed until storage says otherwise, so it cannot flash on load
  const[teamPromptDismissed,setTeamPromptDismissed]=useState(true);

  // A payload from a shared link, waiting for the Badges tab to mount.
  const[pendingBadgeImport,setPendingBadgeImport]=useState(null);

  // Questions asked, for the UI count only. The Edge Function keeps the
  // authoritative tally -- this resets if storage is cleared, which is
  // exactly why it cannot be the limit.
  const[genieAsked,setGenieAsked]=useState([]);
  // The tournament currently being entered. Kept as one working record
  // rather than a list -- you're filling in one tournament at a time, and
  // saving commits it to the cloud.
  // Bags are kept alongside `arsenals` rather than restructuring it.
  // `arsenals` stays the flat {bowler: [ball]} list of everything a bowler
  // owns -- which ballUniverse, stats, and history all still depend on --
  // and `ballBags` records which bag each ball is packed in, keyed
  // "bowler|ball". A ball with no entry is unassigned.
  const[bags,setBags]=useState([]);
  const[ballBags,setBallBags]=useState({});
  const[selectedBagId,setSelectedBagId]=useState("");
  // Ball specs keyed "bowler|ball", and the bowler's own ball groups.
  const[ballSpecs,setBallSpecs]=useState({});
  const[ballGroups,setBallGroups]=useState([]);
  // Community ball catalog: every submission, grouped by normalized ball
  // name, plus which rejection notices this user has already dismissed.
  const[catalogEntries,setCatalogEntries]=useState({});
  const[catalogAck,setCatalogAck]=useState([]);
  // Bowling centers are shared across users; `leagueCenters` maps a league
  // NAME to a center id. Kept as a parallel map rather than restructuring
  // `leagues` (a plain string array) that half the app depends on.
  const[centers,setCenters]=useState([]);
  const[oilPatterns,setOilPatterns]=useState([]);
  const[tournaments,setTournaments]=useState([]);
  // Keyed by bowler name, like arsenals and profiles -- a proxy-logged
  // teammate with no account can still have goals set for them.
  const[goalsByBowler,setGoalsByBowler]=useState({});
  // Coaching. Kept cloud-only rather than cached locally: these rows
  // belong to two people, and a stale local copy of someone else's notes
  // or tasks is worse than showing nothing until the read lands.
  const[coachingRels,setCoachingRels]=useState([]);
  const[coachProfilesById,setCoachProfilesById]=useState({});
  // Handedness of each coached bowler, so their tasks are labelled with
  // the pins they actually leave. Comes from a view that exposes ONLY
  // this field -- see migration_coach_reads_bowler_handedness.sql for why
  // it isn't a policy on bowler_profiles.
  const[coachHandednessById,setCoachHandednessById]=useState({});
  // Scores imported from someone else's scorecard photo, awaiting this
  // bowler's confirmation. Cloud-only: they belong to two people, and a
  // stale local copy of a teammate's scores is worse than none.
  const[importedScores,setImportedScores]=useState([]);
  // Friend requests waiting on this account. Loaded here rather than
  // read from the Social tab, because Social only mounts when the bowler
  // visits it -- and an inbox that only knows about a request after you
  // check the tab it lives on is no better than the tab.
  //
  // Read-only here: accepting still happens on Social, which owns the
  // full friendship state. This copy just refreshes afterwards.
  const[incomingFriendRequests,setIncomingFriendRequests]=useState([]);
  // Team invites addressed to this account's email. Loaded at the top
  // level for the same reason friend requests are: the invitee has no
  // other screen to find them on.
  const[myTeamInvites,setMyTeamInvites]=useState([]);
  const[inviteBusyId,setInviteBusyId]=useState(null);
  // Held locally while onboarding runs, then committed once. Writing to
  // the real profile on every keystroke would create a bowler named "R"
  // the moment someone starts typing.
  const[onboardingProfile,setOnboardingProfile]=useState(()=>emptyProfile(""));
  const[tasksByRelationship,setTasksByRelationship]=useState({});
  const[notesByRelationship,setNotesByRelationship]=useState({});
  // Sessions for whichever bowler the coach currently has selected in the
  // Coach tab. Loaded on demand per bowler, not all at once for every
  // bowler a coach has -- a coach could have many, and there's no reason
  // to pull everyone's history before the coach has picked someone to look
  // at.
  const[coachBowlerSessions,setCoachBowlerSessions]=useState({});

  // Accepted friends, and their sessions/shots fetched on demand -- the
  // same shape as coachBowlerSessions above, and for the same reason: a
  // friend's games live in the cloud under THEIR user_id, not in this
  // account's own shots array, so comparing against one means a separate
  // fetch keyed by id rather than a name filter on local data.
  //
  // This is what gives "friend" an actual job distinct from "teammate":
  // RLS already grants teammates and friends identical read access to
  // sessions/shots (are_friends(user_id) and is_team_member(team_id) are
  // parallel policies), but Compare To only ever offered bowlers already
  // present in this device's local roster. A friend who isn't on your
  // team has no reason to be in that list -- until now, adding them as a
  // friend bought nothing Compare To could use.
  // The team just created from the Leagues card, so the Teams section
  // below can scroll straight to its roster.
  const[focusTeamId,setFocusTeamId]=useState("");
  const[friends,setFriends]=useState([]); // [{userId, displayName}]
  const[friendSessions,setFriendSessions]=useState({});
  const[friendShots,setFriendShots]=useState({});

  // Create a team from the Leagues card in Vault, so a league and its
  // teams are set up in one place.
  //
  // Mirrors TeamManagement's createTeam deliberately, including the stale
  // league-id fallback: leagueIdsRef can be out of date if the league was
  // created moments ago, and writing a team with a null league_id makes a
  // team that can never sync and that teammates will never see.
  async function createTeamForLeague(leagueName,name){
    const clean=(name||"").trim();
    if(!clean||!leagueName)return;
    const existing=(teams||[]).filter(t=>t.league===leagueName);
    if(existing.some(t=>t.name.toLowerCase()===clean.toLowerCase())){
      window.alert("A team with that name already exists in this league.");
      return;
    }
    const id=crypto.randomUUID();
    let leagueId=leagueIdsRef.current[leagueName];
    if(!leagueId){
      const{data,online}=await cloudRead("leagues",q=>q.select("id").eq("name",leagueName).limit(1));
      if(online&&data&&data[0]){
        leagueId=data[0].id;
        leagueIdsRef.current[leagueName]=leagueId;
      }
    }
    persistTeams([...(teams||[]),{id,name:clean,league:leagueName,members:[],pendingInvites:[]}]);
    setFocusTeamId(id);
    if(!leagueId){
      window.alert(`Couldn't find "${leagueName}" in the cloud — this team was created on this device only and won't be visible to teammates. Try again once you're back online.`);
      return;
    }
    // created_by is OMITTED, not sent as null.
    //
    // The INSERT policy requires created_by = auth.uid(), and the column
    // defaults to auth.uid() -- but a DEFAULT only applies to a column
    // left out of the statement entirely. Sending an explicit null
    // bypasses the default and fails the policy, which is exactly what
    // broke team creation: `user?.id||null` resolved to null and the
    // write was rejected with 42501.
    //
    // Letting the database fill it is also the more robust rule: it
    // cannot be wrong, and it does not depend on `user` being in scope
    // at every call site that ever creates a team.
    const result=await cloudWrite("teams",{id,name:clean,league_id:leagueId});

    // Put the creator on the roster.
    //
    // Creating a team used to leave it with no members at all, which was
    // invisible while every team was world-readable. It is not invisible
    // now: teams are scoped by is_team_member(), so a team with an empty
    // roster is one its own creator has no membership claim on. Three
    // separate policies had to be widened to created_by to paper over
    // that -- viewing, renaming and deleting. This removes the reason
    // they are load-bearing: after it, created_by and membership agree
    // from the moment the team exists.
    //
    // Deliberately NOT gated on result.synced. If the team write was
    // queued because there is no signal at the lanes, this queues behind
    // it, and the queue flushes in order -- so the membership lands right
    // after the team rather than being skipped entirely.
    //
    // Guarded on user?.id because user_id has no default and cannot be
    // null; sending undefined would fail the NOT NULL constraint rather
    // than fall back to anything sensible.
    if(user?.id){
      await cloudInsert("team_members",{team_id:id,user_id:user.id,lineup_position:0},{idempotent:true});
    }


    if(!result.synced){
      window.alert(`"${clean}" was created locally but couldn't reach the cloud yet (${result.reason||"unknown reason"}). It'll keep retrying in the background.`);
    }
  }

  // Re-run when the roster changes.
  //
  // loadFriends fires on login, but `teams` arrives later in the startup
  // batch -- so the first pass sees an empty roster and auto-friends
  // nobody. Keyed on the teammate ids rather than the array so it doesn't
  // re-run on every unrelated team edit.
  // Keyed on team IDS, not members: members are empty at startup, so a
  // member-based key never changed and this never re-ran.
  // Keyed on the ROSTER, not just the team ids.
  //
  // This was team ids alone, so adding a member to an existing team left
  // the key unchanged, the effect never re-ran, and syncTeammateFriendships
  // never saw them -- the teammate was added and simply never became a
  // friend. It only fired when a team was created or joined, which is
  // the one case where the roster is empty anyway.
  //
  // Member ids are sorted so a reorder of the roster is not mistaken for
  // a change: lineup position is not a reason to re-read friendships.
  const teammateKey=(teams||[])
    .map(t=>`${t.id}:${(t.members||[]).map(m=>m?.userId).filter(Boolean).sort().join("|")}`)
    .filter(Boolean).sort().join(",");

  useEffect(()=>{
    if(!user?.id||!teammateKey)return;
    loadFriends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[user?.id,teammateKey]);

  // Buy-ins load from local storage on mount. Deliberately device-local
  // rather than synced: they're a convenience default for filling in
  // costs, not a fact about the league that other people need.
  useEffect(()=>{
    (async()=>{
      try{
        const raw=await window.storage.get(LEAGUE_BUY_INS_KEY);
        if(raw)setLeagueBuyIns(JSON.parse(raw.value));
      }catch{}
    })();
  },[]);

  function saveLeagueBuyIns(league,rates){
    setLeagueBuyIns(prev=>{
      const next={...prev,[league]:rates};
      try{window.storage.set(LEAGUE_BUY_INS_KEY,JSON.stringify(next));}catch{}
      return next;
    });
  }

  // Teammates become friends automatically.
  //
  // They already see each other's sessions and shots -- RLS grants
  // is_team_member and are_friends identical read access -- so this adds
  // no new exposure. What it adds is presence in the friends list, which
  // is what Compare To and the Trends/Stats viewing pickers are built on.
  //
  // Created as ACCEPTED with no request: asking someone to confirm a
  // person they already share a roster with is a notification for
  // nothing. Removing a teammate from the team doesn't remove the
  // friendship -- people who bowled together stay connected unless one of
  // them says otherwise.
  async function syncTeammateFriendships(existing){
    const myId=user?.id;
    if(!myId)return existing;

    const already=new Set(existing.map(f=>
      f.requester_id===myId?f.addressee_id:f.requester_id));

    // Read team_members directly rather than from `teams`.
    //
    // The startup teams fetch is NAMES ONLY -- members stay [] until the
    // Teams screen is opened. This function walked that empty array and
    // created nothing, which is why teammates never became friends and
    // why the Stats and Trends pickers had nobody to list.
    const myTeamIds=(teams||[]).map(t=>t.id).filter(Boolean);
    if(!myTeamIds.length)return existing;
    const memRes=await cloudRead("team_members",q=>
      q.select("team_id,user_id").in("team_id",myTeamIds));
    if(!memRes.online||!Array.isArray(memRes.data))return existing;

    const teammateIds=new Set();
    for(const row of memRes.data){
      const id=row.user_id;
      if(id&&id!==myId&&!already.has(id))teammateIds.add(id);
    }
    if(!teammateIds.size)return existing;

    const created=[];
    for(const otherId of teammateIds){
      const row={id:crypto.randomUUID(),requester_id:myId,addressee_id:otherId,status:"accepted"};
      const res=await cloudWrite("friendships",row);
      // A failure here is not worth surfacing: the friendship is a
      // convenience, and the queue retries. Nothing the bowler did has
      // failed.
      if(res.synced!==false)created.push(row);
    }
    return [...existing,...created];
  }

  async function loadFriends(){
    const{data,online}=await cloudRead("friendships",q=>q.select("id,requester_id,addressee_id,status"));
    if(!online||!data)return;
    const myId=user?.id;
    const relevant=data.filter(f=>f.requester_id===myId||f.addressee_id===myId);
    const otherIds=[...new Set(relevant.map(f=>f.requester_id===myId?f.addressee_id:f.requester_id))];
    let profilesById={};
    if(otherIds.length){
      const profRes=await cloudRead("profiles",q=>q.select("id,display_name").in("id",otherIds));
      if(profRes.online&&profRes.data)profRes.data.forEach(p=>{profilesById[p.id]=p.display_name;});
    }
    // Teammates first, so they appear in the same pass rather than only
    // after a reload.
    const withTeammates=await syncTeammateFriendships(relevant);
    const otherIds2=[...new Set(withTeammates.map(f=>f.requester_id===myId?f.addressee_id:f.requester_id))];
    const unknown=otherIds2.filter(id=>!profilesById[id]);
    if(unknown.length){
      const more=await cloudRead("profiles",q=>q.select("id,display_name").in("id",unknown));
      if(more.online&&more.data)more.data.forEach(p=>{profilesById[p.id]=p.display_name;});
    }
    const{accepted}=categorizeFriendships(withTeammates,myId,profilesById);
    setFriends(accepted);
  }

  // Mirrors loadCoachBowlerSessions below almost exactly -- same fetch
  // shape, same reason (another user's cloud data by id), same
  // leagueIdsRef caveat about league name resolution for a different
  // account's rows.
  async function loadFriendData(friendUserId){
    if(!friendUserId||friendSessions[friendUserId])return;
    const nameById={};
    Object.entries(leagueIdsRef.current||{}).forEach(([name,id])=>{nameById[id]=name;});

    const res=await cloudRead("sessions",q=>q.select("*").eq("user_id",friendUserId));
    if(res.online&&res.data){
      setFriendSessions(prev=>({...prev,[friendUserId]:res.data.map(row=>sessionFromSupabaseRow(row,nameById))}));
    }
    const shotRes=await cloudRead("shots",q=>q.select("*").eq("user_id",friendUserId));
    if(shotRes.online&&Array.isArray(shotRes.data)){
      setFriendShots(prev=>({...prev,[friendUserId]:shotRes.data.map(row=>shotFromSupabaseRow(row,nameById))}));
    }
  }
  const[coachBowlerShots,setCoachBowlerShots]=useState({});
  const[coachSearchResults,setCoachSearchResults]=useState([]);
  const[coachSearching,setCoachSearching]=useState(false);
  const coachSearchTimer=useRef(null);
  const[leagueCenters,setLeagueCenters]=useState({});
  // {leagueName: {pokerQuarter, pokerDollar, highGame, threeSixNine}}
  const[leagueBuyIns,setLeagueBuyIns]=useState({});
  // Season boundaries per league, keyed by name: {name: {startDate, endDate}}.
  // Shared across everyone in the league (like center), unlike per-bowler
  // book-average tracking which lives on the profile.
  const[leagueDates,setLeagueDates]=useState({});
  // Scoring format per league. Absent means 10 pin, so no existing
  // league changes meaning because this was added.
  const[leagueFormats,setLeagueFormats]=useState({});
  // Archived season ranges, one row per season that has ended. Written
  // when a new start date would otherwise overwrite the old range.
  const[closedSeasons,setClosedSeasons]=useState([]);
  // Leagues this user has hidden. Personal and reversible -- hidden
  // leagues drop out of pickers but their sessions stay in history and
  // keep counting toward averages.
  const[hiddenLeagues,setHiddenLeagues]=useState([]);
  // Practice drills: focused repetition scored as a rate, kept apart from
  // games so 30 shots at the 10 pin never distort an average.
  const[drills,setDrills]=useState([]);
  const[activeDrill,setActiveDrill]=useState(null);
  // Unsaved drills, kept per bowler.
  //
  // A drill in progress belongs to whoever started it, so switching
  // bowlers must not carry one person's counts onto another. But simply
  // discarding it threw away real work: log a drill, add a partner,
  // switch, and your attempts were gone with no way back. Stashing by
  // bowler gets both -- each person's in-progress drill waits for them,
  // and nobody ever sees someone else's numbers.
  const[drillDrafts,setDrillDrafts]=useState({});
  const[drillSaved,setDrillSaved]=useState(false);
  // Practice-only tracking override. Lives here, not in preferences: a
  // bowler switching to scores-only for one practice must not change how
  // their league nights are documented. Resets when practice is left.
  const[practiceTracking,setPracticeTracking]=useState(null); // null = follow settings
  const[practiceMode,setPracticeMode]=useState("games");
  // Practice/Drill is gated to preferences.environment==="practice" in
  // LogView, so switching to another environment mid-drill hides it from
  // view without warning -- the state (still "drill", still holding
  // whatever was in progress) survives in memory. Returning to Practice
  // later would silently resume that old drill instead of starting fresh.
  // Resetting on every environment change means Practice always opens on
  // Games, which is the expected default rather than "wherever I left it."
  useEffect(() => {
    if (preferences.environment !== "practice") setPracticeMode("games");
  }, [preferences.environment]);
  // Practice/casual partners. Deliberately NEVER written to the cloud --
  // these are names typed about people who aren't users of this app and
  // haven't agreed to anything. Local storage only.
  const[guests,setGuests]=useState([]);
  const[newGuestName,setNewGuestName]=useState("");
  // Ref so syncShotsToCloud always reads the current list, not a stale
  // closure -- a guest added mid-session must be excluded immediately.
  const guestsRef=useRef([]);
  const[scoringForOthers,setScoringForOthers]=useState(false);
  const[activeTournament,setActiveTournament]=useState(emptyTournament());
  const[tournamentSaved,setTournamentSaved]=useState(false);
  const[tournamentSaveMessage,setTournamentSaveMessage]=useState("");
  // Manually-entered game scores, keyed bowler|league|date|game. These take
  // precedence over scores computed from shots -- see domain/manualScores.js.
  const[manualScores,setManualScores]=useState({});
  // Mirrors manualScores so a burst of writes in one tick each build on
  // the last. State alone can't do that -- every call in the same tick
  // sees the same closure value.
  const manualScoresRef=useRef({});
  // Ball and surface per games-only practice game. See
  // domain/manualScores.js gameEquipment*.
  const[gameEquipment,setGameEquipment]=useState({});
  const gameEquipmentRef=useRef({});
  // Launch prompt state. Two separate facts feed the decision in
  // domain/launchPrompt.js: the date it was last dismissed, and whether
  // it has ever been seen at all. Defaults keep it hidden until the load
  // effect has actually read storage, so it can't flash on startup.
  const[sessionStartDismissedDate,setSessionStartDismissedDate]=useState(localDateString());

  // The night's own note, kept on the SESSION.
  //
  // It used to write form.notes -- the shot form -- so a note typed on the
  // Results tab saved only if the bowler happened to throw another ball
  // afterwards, which on that tab they will not. It read as saved and
  // vanished.
  const[sessionNotes,setSessionNotes]=useState("");

  // Shown once, after onboarding, instead of the tour.
  const[showWelcome,setShowWelcome]=useState(false);
  const[sessionStartSeen,setSessionStartSeen]=useState(true);
  // Has the "where" question been answered in THIS prompt? Drives the
  // staged reveal -- the tracking question only appears afterwards.
  // Session-local, not persisted: the prompt is per-day, so a fresh
  // prompt should start fresh.
  // Read synchronously on the very first render from a localStorage
  // mirror of the flag.
  //
  // The async window.storage read below is still the source of truth, but
  // waiting for it meant an initial render with nothing decided, which
  // showed a blank holding screen -- a visible flash in the browser, and
  // in SSR (where effects never run) a permanently blank app. localStorage
  // is synchronous, so mirroring the flag there lets the very first paint
  // already know which screen to show.
  const[onboarded,setOnboarded]=useState(()=>{
    try{return window.localStorage.getItem(ONBOARDED_KEY)==="1";}
    catch{return false;}
  });
  // Shown once, after setup. Read synchronously like the flag above --
  // an async read would flash the tour at someone who'd already done it.
  // Which tours this bowler has seen -- one per environment, plus coach.
  // A list rather than a flag, because someone who signed up casual and
  // comes back for a league shouldn't have to find the league features
  // alone, but shouldn't sit through the casual tour again either.
  const[toursSeen,setToursSeen]=useState(()=>{
    try{return JSON.parse(window.localStorage.getItem(TOURS_SEEN_KEY)||"[]");}
    catch{return [];}
  });
  // The tour showing right now, if any: a track key, or "" for none.
  // How many game columns the casual table shows. Two by default; the
  // "+ Add a game" button raises it. Resets with the session, since
  // last Friday's six games say nothing about tonight.
  const[casualExtraGames,setCasualExtraGames]=useState(2);

  const[activeTour,setActiveTour]=useState("");

  function finishTour(){
    if(activeTour){
      const next=markTourSeen(toursSeen,activeTour);
      setToursSeen(next);
      try{window.localStorage.setItem(TOURS_SEEN_KEY,JSON.stringify(next));}catch{}
    }
    setActiveTour("");
    // Same reason as finishOnboarding: the tour is an overlay, and
    // closing it reveals whatever scroll offset the page underneath was
    // left at.
    scrollToTop();
  }

  // Start a specific tour on demand -- from Settings, or from the
  // league-setup nudge.
  function startTour(track){
    setActiveTour(track);
    // Tracks are TOPICS now ("look", "score", "ai", "stats"), not modes,
    // so there is no environment to map a track onto -- the old call
    // rewrote preferences.environment from the track name, which for a
    // topic track would have set environment:"stats".
    const first=tourSteps(preferences,{track})[0];
    if(first?.tab)setView(first.tab);
  }
  // Latched at mount, deliberately NOT recomputed as data arrives.
  //
  // The gate used to also consult sessions/shots to spot an existing
  // bowler upgrading in. But those load asynchronously: on the first paint
  // they're empty, so onboarding rendered, and a moment later the cloud
  // read populated them and the gate flipped straight to the main app --
  // a visible flash of the onboarding screen on every launch. Latching the
  // decision once means whatever screen you land on is the screen you
  // stay on until you finish.
  const[showOnboarding,setShowOnboarding]=useState(()=>{
    try{return window.localStorage.getItem(ONBOARDED_KEY)!=="1";}
    catch{return true;}
  });

  // A new screen starts at the top.
  //
  // The browser keeps the scroll position when only the content changes,
  // so arriving somewhere new left you part-way down it -- most visibly
  // straight after onboarding, where the first thing a new bowler saw
  // was the middle of a screen they had never seen the top of.
  //
  // Handled once here rather than per screen: three places already did
  // this for their own reasons, and the next screen to need it would
  // have been the fourth.
  //
  // showOnboarding is in the deps because onboarding is a separate
  // render branch, not a view -- finishing it swaps the whole tree
  // without `view` ever changing, which is the case that was reported
  // and the one keying on `view` alone would have missed.
  useEffect(()=>{
    try{window.scrollTo(0,0);}catch{ /* not a browser */ }
  },[view,showOnboarding]);
  const[newBallName,setNewBallName]=useState("");
  const[retiredBalls,setRetiredBalls]=useState({});
  const[ballAddMessage,setBallAddMessage]=useState("");
  // Restored from the last session context, so a refresh mid-night lands
  // back where you were. Only restored when the saved date is TODAY --
  // reopening the app on a new day should start a new night, not resume
  // last Tuesday's.
  const savedContext=(()=>{
    try{
      const raw=window.localStorage.getItem(SESSION_CONTEXT_KEY);
      if(!raw)return null;
      const c=JSON.parse(raw);
      return c&&c.date===localDateString()?c:null;
    }catch{return null;}
  })();

  // Resume where the bowler was, not frame 1 -- see SESSION_CONTEXT_KEY.
  const[form,setForm]=useState(()=>{
    const base=emptyShot();
    if(!savedContext)return base;
    return{...base,
      game:savedContext.game||base.game,
      frame:savedContext.frame||base.frame,
      ballNum:savedContext.ballNum??base.ballNum,
      league:savedContext.league||base.league,
      date:savedContext.date||base.date};
  });
  const[editingId,setEditingId]=useState(null);
  const[preEditForm,setPreEditForm]=useState(null);
  const[saved,setSaved]=useState(false);
  const[sessionSaved,setSessionSaved]=useState(false);

  // Which tab the Log screen is showing, owned HERE rather than in
  // LogView, because ending a session has to move it -- and a child
  // cannot be told to change its own state from the outside.
  // League opens on Set up, not Scoring.
  //
  // Arriving from Home means the night has not started: no league picked,
  // no lane, no team. Scoring first showed an empty sheet and hid the
  // questions that make it work, so a bowler had to find the Set up chip
  // before anything they typed would file correctly.
  //
  // The derived leagueTab still forces Set up when no league is chosen;
  // this makes the DEFAULT agree with that rather than fighting it.
  const[leagueTabChoice,setLeagueTabChoice]=useState("setup");
  const[tournamentTab,setTournamentTab]=useState("setup");
  const setLeagueTab=setLeagueTabChoice;
  const[sessionSaveMessage,setSessionSaveMessage]=useState(null);
  const[winningsSaved,setWinningsSaved]=useState(false);
  const[filterBall,setFilterBall]=useState("");
  const[filterResult,setFilterResult]=useState("");
  const[filterBowler,setFilterBowler]=useState("");
  // Stats opens on YOUR numbers, not the team's.
  //
  // isTeamView is `!statsBowler && bowlers.length > 1`, so an empty
  // default meant anyone with a team set up landed on team stats -- and
  // the Stats tab is overwhelmingly opened to check your own game. The
  // team is one tap away and still fully available; it just isn't the
  // thing you have to navigate away from.
  const[statsBowler,setStatsBowler]=useState(displayName||"");
  // displayName arrives asynchronously, so the initial value above is ""
  // on first paint -- which shows the unfiltered view: every shot in the
  // local array, including teammates proxy-logged and every column off an
  // imported scorecard, blended into one average. Settle on the account
  // once it's known, unless the bowler has already picked someone.
  const statsBowlerTouched=useRef(false);
  const chooseStatsBowler=v=>{statsBowlerTouched.current=true;setStatsBowler(v);};
  const chooseStatsLeague=v=>{statsBowlerTouched.current=true;setStatsLeague(v);};
  useEffect(()=>{
    if(statsBowlerTouched.current)return;
    if(displayName&&!statsBowler&&!statsLeague)setStatsBowler(displayName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[displayName]);
  const[compareBowler,setCompareBowler]=useState("");
  // Set alongside compareBowler when the comparison target is a FRIEND
  // rather than someone in the local roster -- lets the merged-shots
  // effect below know which friend's cloud data to fold in, without
  // requiring every existing s.bowler===compareBowler filter throughout
  // this file to be rewritten to understand two different kinds of id.
  const[compareFriendId,setCompareFriendId]=useState("");
  const[statsLeague,setStatsLeague]=useState("");
  const[compareLeague,setCompareLeague]=useState("");
  // A container league in the saved context is corruption from the bug
  // above, not a league the bowler picked. Dropping it here repairs a
  // context already written that way -- otherwise every existing
  // installation stays stuck on the tournament it last bowled.
  const[sessionLeague,setSessionLeague]=useState(
    isContainerLeague(savedContext?.league)?"":(savedContext?.league||""));
  const[sessionDate,setSessionDate]=useState(savedContext?.date||localDateString());

  // Changing the date starts a new night at game 1, frame 1.
  //
  // setSessionDate alone left the form on whatever game and frame the
  // last night ended on -- so a second tournament squad began at "game
  // 3, frame 7", and those shots filed under game 3 of a block that had
  // never bowled games 1 or 2.
  //
  // The bowler is always at the start of a night they have just dated.
  // If they are genuinely resuming one, the frame stepper moves.
  function changeSessionDate(next){
    setSessionDate(next);

    // Resume where that date left off, if it has shots.
    //
    // Resetting to game 1 frame 1 unconditionally was right for a new
    // night and wrong for a correction: a league bowler fixing a typo
    // mid-session lost their place and would have overwritten frame 1.
    //
    // nextState is the same function the save path uses to advance, so
    // resuming lands exactly where logging stopped.
    const who=form.bowler||activeBowler;
    const lg=form.league||effectiveSessionLeague;
    const existing=(shots||[]).filter(sh=>sh&&sh.bowler===who
      &&sh.league===lg&&String(sh.date)===String(next));
    if(existing.length){
      const last=existing[existing.length-1];
      const{game:g,frame:f,ballNum:b}=nextState(existing,who,lg,next,last.game,last.frame,last.ballNum);
      setForm(fm=>({...fm,date:next,game:g,frame:f,ballNum:b}));
    } else {
      setForm(fm=>({...fm,date:next,game:"1",frame:"1",ballNum:null}));
    }


    // A date outside the saved tournament starts a fresh one.
    //
    // Otherwise the bowler arrives at a new event and finds the last
    // one's name, centre, squads and scores waiting -- and either bowls
    // into it by mistake or clears it by hand.
    //
    // Three conditions, all required:
    //
    //   SAVED -- it has an id and is in the saved list, so switching away
    //     loses nothing. An unsaved tournament is still being entered and
    //     must not be swept aside by a date change.
    //   DATED -- at least one squad has a date. With none there is no way
    //     to tell whether this date belongs to it.
    //   NOT THIS DATE -- no squad carries the date being moved to.
    if(preferences.environment!=="tournament")return;
    const t=activeTournament;
    if(!t||!t.id)return;
    if(!(tournaments||[]).some(x=>x&&x.id===t.id))return;
    const dates=(t.days||[]).map(d=>String(d?.date||"")).filter(Boolean);
    if(!dates.length)return;
    if(dates.includes(String(next)))return;

    const fresh=normalizeTournament({...emptyTournament(),bowler:activeBowler});
    setActiveTournament(fresh);
    try{window.storage.set(TOURNAMENT_KEY,JSON.stringify(fresh));}catch{}
  }

  const[startingLane,setStartingLane]=useState(savedContext?.lane||"");
  const[confirmClear,setConfirmClear]=useState(false);
  const[showBackup,setShowBackup]=useState(false);
  const[expandedSections,setExpandedSections]=useState({releaseMiss:false,ballChange:false,notes:false,tonightSession:false,arsenal:false,surface:false,/* open by default: reaching this card means a league is chosen and the
     bowler is here to enter scores */manualScores:true,ballPick:false,logGoals:false});
  function toggleSection(key){setExpandedSections(s=>({...s,[key]:!s[key]}));}
  const[importText,setImportText]=useState("");
  const[backupStatus,setBackupStatus]=useState("");
  const[ballLaneLines,setBallLaneLines]=useState({});
  const[matches,setMatches]=useState([]); // [{id,league,date,games:[null|true|false×3],series:null|true|false}]
  const[lanePatterns,setLanePatterns]=useState([]); // [{league,date,lane,patternType:"house"|"official",patternName,length,volume,ratio}]

  // One-time self-healing cleanup for a fixed bug: some 10th-frame "ball 1"
  // shots got saved with ballNum null instead of an explicit 1 (a frame
  // 9→10 transition bug, since fixed). That produced phantom duplicate rows
  // in history — one untagged, one correctly tagged ballNum:1 — for the same
  // physical shot. This normalizes them and keeps only the most recent copy
  // per slot, so old corrupted data cleans itself up automatically on load.
  // Dedup safety net: if a slot somehow ends up with more than one shot
  // record (a sync race, a retry that landed twice), keep only the most
  // recently-saved one so a duplicate never double-counts anywhere.
  function migrateShots(rawShots){
    const lastIndexForKey=new Map();
    rawShots.forEach((s,idx)=>{
      const key=`${s.bowler}|${s.league}|${s.date}|${s.game}|${s.frame}|${s.ballNum||""}`;
      lastIndexForKey.set(key,idx);
    });
    return rawShots.filter((s,idx)=>{
      const key=`${s.bowler}|${s.league}|${s.date}|${s.game}|${s.frame}|${s.ballNum||""}`;
      return lastIndexForKey.get(key)===idx;
    });
  }

  // Dedup safety net for sessions, same reasoning as migrateShots.
  function migrateSessions(rawSessions){
    const lastIndexForSessionKey=new Map();
    rawSessions.forEach((s,idx)=>{
      lastIndexForSessionKey.set(`${s.bowler}|${s.league}|${s.date}`,idx);
    });
    return rawSessions.filter((s,idx)=>
      lastIndexForSessionKey.get(`${s.bowler}|${s.league}|${s.date}`)===idx
    );
  }

  // Deliberately its own effect, not part of the big load() below.
  //
  // load() is one long try block spanning every table; if any earlier
  // await in it throws, everything after is skipped. Keeping the
  // onboarding read out of it means a transient cloudRead failure can't
  // stop the gate from resolving.
  // An existing bowler upgrading into this build has plenty of data but no
  // onboarding flag. Once their data has actually loaded, record that
  // they're established so future launches go straight to the app.
  //
  // Writes storage only -- deliberately does not touch `onboarded` state,
  // because flipping it mid-render is exactly the yank that caused the
  // onboarding screen to flash and disappear.
  useEffect(()=>{
    if(sessions.length===0&&shots.length===0)return;
    try{
      if(window.localStorage.getItem(ONBOARDED_KEY)==="1")return;
      window.localStorage.setItem(ONBOARDED_KEY,"1");
    }catch{}
    try{window.storage.set(ONBOARDED_KEY,"1");}catch{}
  },[sessions.length,shots.length]);

  useEffect(()=>{
    let cancelled=false;
    (async()=>{
      try{
        const done=await window.storage.get(ONBOARDED_KEY);
        if(cancelled)return;
        const isDone=done?.value==="1";
        setOnboarded(isDone);
        // Re-mirror so the next launch decides synchronously. Covers a
        // bowler whose localStorage was cleared but whose main storage
        // still has the flag -- they get onboarding once, then never again.
        try{
          if(isDone)window.localStorage.setItem(ONBOARDED_KEY,"1");
          else window.localStorage.removeItem(ONBOARDED_KEY);
        }catch{}
      }catch{
        // Main storage unavailable: trust whatever the synchronous mirror
        // already decided rather than overriding it either way.
      }
    })();
    return()=>{cancelled=true;};
  },[]);

  // Its own effect, not part of load() below: that function is one long
  // try block, and a failure in any earlier table would silently skip
  // coaching entirely.
  // The subscription, read once per sign-in.
  //
  // Its own effect rather than another line in the big Promise.all
  // above: that array is destructured POSITIONALLY and carries a "must
  // stay last" invariant, so inserting into it is a way to silently
  // shift every reader by one. A billing lookup should also not be able
  // to take the night's shots down with it.
  //
  // RLS lets a bowler read their own row and no policy lets anyone write
  // one from the client, so this is read-only by construction. A missing
  // row is normal for a free bowler, not an error.
  //
  // billing_period is selected now that the column exists (verified
  // against the live schema: text, nullable, CHECK in ('month','year')).
  // Without it shouldOfferAnnual() reads undefined and answers false, so
  // the annual nudge could never fire.
  //
  // Anything added here must exist in the table FIRST. Selecting a
  // column that is not there fails the whole query, which would leave
  // every bowler reading as unsubscribed rather than failing loudly.
  useEffect(()=>{
    if(!user?.id){setEntitlement(null);return;}
    let live=true;
    (async()=>{
      try{
        const{data,error}=await supabase.from("entitlements")
          .select("plan,status,billing_period,current_period_end,trial_end,kept_league_id,created_at")
          .eq("user_id",user.id).maybeSingle();
        if(!live)return;
        if(error){console.error("entitlement read failed:",error.message);return;}
        setEntitlement(data||null);
      }catch(e){ if(live)console.error("entitlement read threw:",String(e)); }
    })();
    return()=>{live=false;};
  },[user?.id]);

  useEffect(()=>{
    if(!user?.id)return;
    loadCoaching();
    loadImportedScores();
    loadFriendRequests();
    loadTeamInvites();
    loadFriends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[user?.id]);

  useEffect(()=>{
    async function load(){
      try{
        let migratedShots=[];
        // Shots: cloud-first, local storage as the offline fallback/cache.
        // Fetches its own small league id<->name map rather than relying on
        // the separate leagues-loading effect's timing, since effects don't
        // guarantee ordering relative to each other.
        const leaguesForShots=await cloudRead("leagues",q=>q.select("id,name"));
        const leagueNameById={};
        if(leaguesForShots.online&&leaguesForShots.data){
          leaguesForShots.data.forEach(l=>{leagueNameById[l.id]=practiceLeagueDisplayName(l.name);});
        }

        // Everything else in ONE parallel batch.
        //
        // This load was 21 sequential awaits: each read waited for the one
        // before it, so startup cost 21 round trips -- 2-5 seconds on a
        // phone before anything appeared, and worse the worse the
        // connection. The requests are independent; only the league map
        // above must resolve first, because six of the mappers below need
        // it to turn a league_id into a name.
        //
        // Queries are byte-for-byte the ones that ran sequentially, so no
        // select is narrowed. Each result keeps its own { online, data }
        // shape, so every guard below works unchanged and one table
        // failing still doesn't take the others down.
        // Delta sync: a cursor present means this device has synced
        // before, so ask for only what changed instead of everything.
        // Absent (first run, or a cleared/reinstalled app) falls
        // through to the full fetch every load used to do.
        //
        // A cursor older than the tombstone retention window is treated
        // as absent. Tombstones are pruned after 90 days, so a device
        // that's been away longer could never learn about deletes that
        // happened while it was gone -- it would silently resurrect
        // shots the bowler removed. A full resync costs one expensive
        // load after months away, which is the right trade.
        const TOMBSTONE_RETENTION_DAYS=90;
        const cursorIsUsable=iso=>{
          if(!iso)return false;
          const t=new Date(iso).getTime();
          if(!Number.isFinite(t))return false;
          const ageDays=(Date.now()-t)/86400000;
          return ageDays<TOMBSTONE_RETENTION_DAYS-7; // a week of margin
        };
        const rawShotsCursor=(await window.storage.get(SHOTS_CURSOR_KEY))?.value||null;
        const rawSessionsCursor=(await window.storage.get(SESSIONS_CURSOR_KEY))?.value||null;
        const shotsCursor=cursorIsUsable(rawShotsCursor)?rawShotsCursor:null;
        const sessionsCursor=cursorIsUsable(rawSessionsCursor)?rawSessionsCursor:null;

        const [
          shotsRes,
          sessionsRes,
          bowlersRes,
          arsenalsRes,
          profilesRes,
          memberRes,
          drillsRes,
          hiddenRes,
          centersRes,
          patternsRes,
          goalsRes,
          tournamentsRes,
          leagueCentersRes,
          subsRes,
          votesRes,
          groupsRes,
          bagsRes,
          manualRes,
          matchesRes,
          lanePatternsRes,
          teamsRes,
        ] = await Promise.all([
          // Byte-for-byte the same call as before whenever there is no
          // cursor yet, so a first run behaves exactly as it always has.
          shotsCursor?cloudReadDelta("shots",shotsCursor):cloudRead("shots",q=>q.select("*")),
          sessionsCursor?cloudReadDelta("sessions",sessionsCursor):cloudRead("sessions",q=>q.select("*")),
          cloudRead("bowler_names",q=>q.select("name")),
          cloudRead("arsenals",q=>q.select("bowler_name,ball,layout_system,layout_values,group_id,coverstock,core_type,weight,rg,diff,int_diff")),
          cloudRead("bowler_profiles",q=>q.select("bowler_name,left_handed,two_handed,is_coach,aliases,home_centers,notes,book_average,book_games,book_season,book_average_as_of")),
          cloudRead("ball_bags",q=>q.select("bowler_name,ball,bag_id")),
          cloudRead("drills",q=>q.select("id,bowler_name,date,target,custom_target,custom_pins,ball,made,missed,notes")),
          cloudRead("hidden_leagues",q=>q.select("league_id")),
          cloudRead("bowling_centers",q=>q.select("id,here_id,name,address,city,state,postal_code,country,lat,lng")),
          cloudRead("oil_patterns",q=>q.select("id,name,series,length_feet,ratio,volume_ml,forward_ml,reverse_ml,verified,source_note,year")),
          cloudRead("bowler_goals",q=>q.select("bowler_name,goals")),
          cloudRead("tournaments",q=>q.select("id,bowler_name,name,center,days,buy_in,winnings,side_pots,match_play,notes")),
          cloudRead("leagues",q=>q.select("name,center_id,start_date,end_date")),
          cloudRead("ball_submissions",q=>q.select("id,submitted_by,ball_key,ball_name,brand,coverstock,core_type,weight,rg,diff,int_diff,created_at,official,source_note,weight_specs")),
          cloudRead("ball_confirmations",q=>q.select("submission_id,confirmed_by,vote")),
          cloudRead("ball_groups",q=>q.select("id,bowler_name,name,sort_order")),
          cloudRead("bags",q=>q.select("id,bowler_name,name,bag_type,ball_limit,includes_plastic")),
          cloudRead("manual_scores",q=>q.select("bowler_name,league_id,date,game,score,ball,surface")),
          cloudRead("matches",q=>q.select("*")),
          cloudRead("lane_patterns",q=>q.select("*")),
          // Teams, so a team's NAME is known from first paint. Without
          // this the list stayed empty until the bowler opened the Teams
          // screen, and every team label fell back to the league name.
          // MUST stay last, matching teamsRes in the destructuring above.
          cloudRead("teams",q=>q.select("id,name,league_id")),
        ]);



        if(shotsCursor){
          // A device that's synced before: only what changed since last
          // time, merged into what's already cached -- instead of
          // re-downloading a whole career on every single open.
          migratedShots=await applyDelta(shotsRes,{
            storageKey:STORAGE_KEY,cursorKey:SHOTS_CURSOR_KEY,cursor:shotsCursor,
            mapRow:row=>shotFromSupabaseRow(row,leagueNameById),
            migrate:migrateShots,pendingTable:"shots",
          });
          setShots(migratedShots);
        }else if(shotsRes.online&&shotsRes.data){
          const pending=await getQueuedRecordsForTable("shots");
          const pendingIds=new Set(pending.map(p=>p.id));
          const cloudShots=shotsRes.data.filter(row=>!pendingIds.has(row.id)).map(row=>shotFromSupabaseRow(row,leagueNameById));
          const pendingShots=pending.map(row=>shotFromSupabaseRow(row,leagueNameById));
          migratedShots=migrateShots([...cloudShots,...pendingShots]);
          setShots(migratedShots);
          try{await window.storage.set(STORAGE_KEY,JSON.stringify(migratedShots));}catch{}
          // A completed full sync -- from here on, later opens can ask
          // for only what changed instead of repeating this.
          const seed=nextCursor(null,shotsRes.data.map(r=>r.updated_at))||new Date().toISOString();
          try{await window.storage.set(SHOTS_CURSOR_KEY,seed);}catch{}
        }else{
          const r=await window.storage.get(STORAGE_KEY);
          if(r){
            const loaded=JSON.parse(r.value);
            // Guarded: a corrupted or old-format value used to abort the
            // ENTIRE remaining load, because every read below shares this
            // one try block.
            migratedShots=migrateShots(Array.isArray(loaded)?loaded:[]);
            setShots(migratedShots);
            if(JSON.stringify(migratedShots)!==JSON.stringify(loaded)){
              try{await window.storage.set(STORAGE_KEY,JSON.stringify(migratedShots));}catch{}
            }
          }
        }
                if(sessionsCursor){
          const migratedSessions=await applyDelta(sessionsRes,{
            storageKey:SESSIONS_KEY,cursorKey:SESSIONS_CURSOR_KEY,cursor:sessionsCursor,
            mapRow:row=>sessionFromSupabaseRow(row,leagueNameById),
            migrate:migrateSessions,pendingTable:"sessions",
          });
          setSessions(migratedSessions);
        }else if(sessionsRes.online&&sessionsRes.data){
          const pendingSessions=await getQueuedRecordsForTable("sessions");
          const pendingIds=new Set(pendingSessions.map(p=>p.id));
          const cloudSessions=sessionsRes.data.filter(row=>!pendingIds.has(row.id)).map(row=>sessionFromSupabaseRow(row,leagueNameById));
          const pendingSessionObjs=pendingSessions.map(row=>sessionFromSupabaseRow(row,leagueNameById));
          const migratedSessions=migrateSessions([...cloudSessions,...pendingSessionObjs]);
          setSessions(migratedSessions);
          try{await window.storage.set(SESSIONS_KEY,JSON.stringify(migratedSessions));}catch{}
          const seed=nextCursor(null,sessionsRes.data.map(r=>r.updated_at))||new Date().toISOString();
          try{await window.storage.set(SESSIONS_CURSOR_KEY,seed);}catch{}
        }else{
          const s=await window.storage.get(SESSIONS_KEY);
          if(s){
            const loadedSessions=JSON.parse(s.value);
            const migratedSessions=migrateSessions(Array.isArray(loadedSessions)?loadedSessions:[]);
            setSessions(migratedSessions);
            if(JSON.stringify(migratedSessions)!==JSON.stringify(loadedSessions)){
              try{await window.storage.set(SESSIONS_KEY,JSON.stringify(migratedSessions));}catch{}
            }
          }
        }
                if(bowlersRes.online&&bowlersRes.data){
          const pendingBowlers=await getQueuedRecordsForTable("bowler_names");
          const names=[...new Set([...bowlersRes.data.map(r=>r.name),...pendingBowlers.map(r=>r.name)])];
          setBowlers(names);
          // Keep form.bowler in step with the chip that renders selected.
          // Setting activeBowler alone left the shot form with bowler:""
          // from emptyShot(), so the Ball card reported "no bowler" even
          // though a chip looked chosen.
          if(names.length){
            setActiveBowler(names[0]);
            setForm(f=>f.bowler?f:{...f,bowler:names[0]});
          }
          try{await window.storage.set(BOWLERS_KEY,JSON.stringify(names));}catch{}
        }else{
          const b=await window.storage.get(BOWLERS_KEY);
          if(b){
            const raw=JSON.parse(b.value);
            const list=Array.isArray(raw)?raw:[];
            setBowlers(list);
            if(list.length){
              setActiveBowler(list[0]);
              setForm(f=>f.bowler?f:{...f,bowler:list[0]});
            }
          }
        }

                if(arsenalsRes.online&&arsenalsRes.data){
          const pendingArsenalRows=await getQueuedRecordsForTable("arsenals");
          const rebuilt={};
          const rebuiltLayouts={};
          const rebuiltSpecs={};
          [...arsenalsRes.data,...pendingArsenalRows].forEach(row=>{
            if(!rebuilt[row.bowler_name])rebuilt[row.bowler_name]=[];
            if(!rebuilt[row.bowler_name].includes(row.ball))rebuilt[row.bowler_name].push(row.ball);
            const normalized=normalizeLayout({system:row.layout_system,values:row.layout_values});
            if(normalized)rebuiltLayouts[`${row.bowler_name}|${row.ball}`]=normalized;
            rebuiltSpecs[`${row.bowler_name}|${row.ball}`]=specsFromRow(row);
          });
          setArsenals(rebuilt);
          setBallLayouts(rebuiltLayouts);
          setBallSpecs(rebuiltSpecs);
          try{await window.storage.set(BALL_SPECS_KEY,JSON.stringify(rebuiltSpecs));}catch{}
          try{await window.storage.set(ARSENALS_KEY,JSON.stringify(rebuilt));}catch{}
          try{await window.storage.set(LAYOUTS_KEY,JSON.stringify(rebuiltLayouts));}catch{}
        }else{
          const a=await window.storage.get(ARSENALS_KEY);

          try{
            const r=await window.storage.get(RETIRED_BALLS_KEY);
            const parsed=r?JSON.parse(typeof r==="string"?r:r.value??"{}"):null;
            if(parsed&&typeof parsed==="object")setRetiredBalls(parsed);
          }catch{}
          if(a){const v=JSON.parse(a.value);if(v&&typeof v==="object"&&!Array.isArray(v))setArsenals(v);}
          const bl=await window.storage.get(LAYOUTS_KEY);
          if(bl){const v=JSON.parse(bl.value);if(v&&typeof v==="object"&&!Array.isArray(v))setBallLayouts(v);}
          const bsp=await readCached(BALL_SPECS_KEY,"object");
          if(bsp)setBallSpecs(bsp);
          const bb=await readCached(BALL_BAGS_KEY,"object");
          if(bb)setBallBags(bb);
        }

        // Every column profileFromRow reads. The select had drifted behind the
        // mapper: is_coach, and the four book-average columns, all existed in
        // the table and were mapped on the way out, but were never fetched --
        // so they came back undefined on every load and silently reset.
                if(profilesRes.online&&profilesRes.data){
          const rebuiltProfiles={};
          profilesRes.data.forEach(row=>{
            const p=profileFromRow(row);
            if(p&&p.bowlerName)rebuiltProfiles[p.bowlerName]=p;
          });

          // Teammates' profiles come from an RPC, not the table.
          //
          // The table read now returns only YOUR rows: the broad teammate
          // policy was dropped because it exposed the whole row, including
          // private `notes` and book average. The RPC returns just the
          // columns a teammate legitimately needs -- name, handedness,
          // two-handed, aliases -- so name matching and left-handed leave
          // rendering keep working without handing over private notes.
          //
          // Own rows win on conflict: never let a teammate's limited copy
          // overwrite your full profile.
          try{
            const{data:mates,error:matesErr}=await supabase.rpc("teammate_bowler_profiles");
            if(!matesErr&&Array.isArray(mates)){
              mates.forEach(row=>{
                const p=profileFromRow(row);
                if(p&&p.bowlerName&&!rebuiltProfiles[p.bowlerName])rebuiltProfiles[p.bowlerName]=p;
              });
            }
          }catch{}

          setProfiles(rebuiltProfiles);
          try{await window.storage.set(PROFILES_KEY,JSON.stringify(rebuiltProfiles));}catch{}
        }else{
          const dismissed=await window.storage.get(SHOT_PROMPT_KEY);
          setShotPromptDismissed(!!dismissed);
          const teamDismissed=await window.storage.get(TEAM_PROMPT_KEY);
          setTeamPromptDismissed(!!teamDismissed);
          const pr=await readCached(PROFILES_KEY,"object");
          if(pr)setProfiles(Object.fromEntries(Object.entries(pr).map(([k,v])=>[k,normalizeProfile(v,k)])));
        }

                if(memberRes.online&&memberRes.data){
          const rebuiltMembership={};
          memberRes.data.forEach(r=>{rebuiltMembership[membershipKey(r.bowler_name,r.ball,r.bag_id)]=true;});
          setBallBags(rebuiltMembership);
          try{await window.storage.set(BALL_BAGS_KEY,JSON.stringify(rebuiltMembership));}catch{}
        }else{
        }

        const cachedGuests=await readCached(GUESTS_KEY,"array");
        if(cachedGuests){const g=normalizeGuests(cachedGuests);setGuests(g);guestsRef.current=g;}

                if(drillsRes.online&&drillsRes.data){
          const rebuilt=drillsRes.data.map(drillFromRow).filter(Boolean);
          setDrills(rebuilt);
          try{await window.storage.set(DRILLS_KEY,JSON.stringify(rebuilt));}catch{}
        }else{
          const dr=await readCached(DRILLS_KEY,"array");
          if(dr)setDrills(dr.map(normalizeDrill));
        }

                if(hiddenRes.online&&hiddenRes.data){
          const ids=hiddenRes.data.map(r=>r.league_id).filter(Boolean);
          setHiddenLeagues(ids);
          try{await window.storage.set(HIDDEN_LEAGUES_KEY,JSON.stringify(ids));}catch{}
        }else{
          const hl=await readCached(HIDDEN_LEAGUES_KEY,"array");
          if(hl)setHiddenLeagues(hl.filter(x=>typeof x==="string"));
        }

                if(centersRes.online&&centersRes.data){
          const rebuilt=centersRes.data.map(centerFromRow).filter(Boolean);
          setCenters(rebuilt);
          try{await window.storage.set(CENTERS_KEY,JSON.stringify(rebuilt));}catch{}
        }else{
          const cs=await readCached(CENTERS_KEY,"array");
          if(cs)setCenters(cs.map(normalizeCenter).filter(c=>c.id&&c.name));
        }

                if(patternsRes.online&&patternsRes.data){
          const rebuilt=patternsRes.data.map(patternFromRow).filter(Boolean);
          setOilPatterns(rebuilt);
          try{await window.storage.set(OIL_PATTERNS_KEY,JSON.stringify(rebuilt));}catch{}
        }else{
          const op=await readCached(OIL_PATTERNS_KEY,"array");
          if(op)setOilPatterns(op.map(normalizePattern).filter(Boolean));
        }

                if(goalsRes.online&&goalsRes.data){
          // A goal saved while offline sits in the sync queue, not in the
          // cloud. Taking the cloud rows verbatim would overwrite it with
          // the older server copy and silently revert the change -- same
          // merge the matches load does, for the same reason.
          const pendingGoals=await getQueuedRecordsForTable("bowler_goals");
          const pendingBowlers=new Set(pendingGoals.map(r=>r.bowler_name));
          const rebuilt={};
          goalsRes.data
            .filter(r=>!pendingBowlers.has(r.bowler_name))
            .forEach(r=>{rebuilt[r.bowler_name]=goalsFromRow(r);});
          pendingGoals.forEach(r=>{rebuilt[r.bowler_name]=goalsFromRow(r);});
          setGoalsByBowler(rebuilt);
          try{await window.storage.set(GOALS_KEY,JSON.stringify(rebuilt));}catch{}
        }else{
          try{
            const cached=await window.storage.get(GOALS_KEY);
            if(cached){
              const parsed=JSON.parse(cached.value);
              const rebuilt={};
              Object.keys(parsed||{}).forEach(k=>{rebuilt[k]=normalizeGoals(parsed[k]);});
              setGoalsByBowler(rebuilt);
            }
          }catch{}
        }

                if(tournamentsRes.online&&tournamentsRes.data){
          const rebuilt=tournamentsRes.data.map(tournamentFromRow).filter(Boolean);
          setTournaments(rebuilt);
          try{await window.storage.set(TOURNAMENTS_KEY,JSON.stringify(rebuilt));}catch{}
        }else{
          const ts=await readCached(TOURNAMENTS_KEY,"array");
          if(ts)setTournaments(ts.map(normalizeTournament).filter(Boolean));
        }

        // The tournament in progress.
        //
        // TOURNAMENT_KEY was written on every edit and never read back,
        // so a refresh dropped the whole thing -- name, block details,
        // format, everything -- and the bowler started from an empty
        // card. The saved LIST loaded fine, which made it look like
        // saving worked and only the current one was broken.
        //
        // Restored after the list, so a tournament that was saved and is
        // still being edited comes back as the edited version.
        {
          const active=await readCached(TOURNAMENT_KEY,"object");
          if(active&&typeof active==="object"){
            const restored=normalizeTournament(active);
            if(restored)setActiveTournament(restored);
          }
        }

                if(leagueCentersRes.online&&leagueCentersRes.data){
          const map={};
          const dateMap={};
          const formatMap={};
          leagueCentersRes.data.forEach(r=>{
            if(r.center_id)map[r.name]=r.center_id;
            if(r.start_date||r.end_date)dateMap[r.name]=normalizeLeagueDates({startDate:r.start_date||"",endDate:r.end_date||""});

            if(r.format)formatMap[r.name]=leagueFormat(r.format);
          });
          setLeagueCenters(map);
          setLeagueDates(dateMap);
          setLeagueFormats(formatMap);
          try{await window.storage.set(LEAGUE_CENTERS_KEY,JSON.stringify(map));}catch{}
          try{await window.storage.set(LEAGUE_DATES_KEY,JSON.stringify(dateMap));}catch{}
        }else{
          const lc=await readCached(LEAGUE_CENTERS_KEY,"object");
          if(lc)setLeagueCenters(lc);
          const ld=await readCached(LEAGUE_DATES_KEY,"object");
          if(ld)setLeagueDates(ld);
        }

        // Archived seasons. Cloud first, local cache when offline --
        // the same shape as everything else here.
        {
          const csRes=await cloudRead("closed_seasons",q=>q.select("*"));
          if(csRes.online&&Array.isArray(csRes.data)){
            const list=csRes.data.map(closedSeasonFromRow).filter(Boolean);
            setClosedSeasons(list);
            try{await window.storage.set(CLOSED_SEASONS_KEY,JSON.stringify(list));}catch{}
          }else{
            const cached=await readCached(CLOSED_SEASONS_KEY,"array");
            if(cached)setClosedSeasons(cached);
          }
        }

                        if(subsRes.online&&subsRes.data){
          const tally={};
          (votesRes.data||[]).forEach(v=>{
            const t=tally[v.submission_id]=tally[v.submission_id]||{approvals:0,rejections:0,mine:null};
            if(v.vote==="reject")t.rejections++; else t.approvals++;
            if(v.confirmed_by===user?.id)t.mine=v.vote;
          });
          const byKey={};
          subsRes.data.forEach(row=>{
            const t=tally[row.id]||{approvals:0,rejections:0,mine:null};
            const entry={
              id:row.id,submittedBy:row.submitted_by,ballKey:row.ball_key,ballName:row.ball_name,
              brand:row.brand||"",createdAt:row.created_at,
              // Official rows never accumulate votes -- see canVote in
              // ballCatalog.js -- so approvals/rejections stay at 0 for
              // them regardless of what's in the confirmations table.
              official:!!row.official,sourceNote:row.source_note||"",
              // Per-weight breakdown, when the source published more than
              // one -- optional, so a plain community submission (one
              // bowler, one weight) just has this as null.
              weightSpecs:Array.isArray(row.weight_specs)?row.weight_specs:null,
              approvals:t.approvals,rejections:t.rejections,myVote:t.mine,
              specs:specsFromRow(row),
            };
            (byKey[row.ball_key]=byKey[row.ball_key]||[]).push(entry);
          });
          setCatalogEntries(byKey);
        }

        try{
          const ack=await readCached(CATALOG_ACK_KEY,"array");
          if(ack)setCatalogAck(ack.filter(x=>typeof x==="string"));
        }catch{}

                if(groupsRes.online&&groupsRes.data){
          const rebuiltGroups=groupsRes.data.map(groupFromRow).filter(Boolean)
            .sort((a,b)=>a.sortOrder-b.sortOrder);
          setBallGroups(rebuiltGroups);
          try{await window.storage.set(BALL_GROUPS_KEY,JSON.stringify(rebuiltGroups));}catch{}
        }else{
          const bg2=await readCached(BALL_GROUPS_KEY,"array");
          if(bg2)setBallGroups(bg2.filter(g=>g&&typeof g==="object"&&g.id));
        }

                if(bagsRes.online&&bagsRes.data){
          const rebuiltBags=bagsRes.data.map(bagFromRow).filter(Boolean);
          setBags(rebuiltBags);
          try{await window.storage.set(BAGS_KEY,JSON.stringify(rebuiltBags));}catch{}
        }else{
          const bg=await window.storage.get(BAGS_KEY);
          if(bg){const v=JSON.parse(bg.value);if(Array.isArray(v))setBags(v.map(b=>normalizeBag(b)));}
        }

                if(manualRes.online&&manualRes.data){
          const rebuilt=manualScoresFromRows(manualRes.data,leagueNameById);
          const equip=gameEquipmentFromRows(manualRes.data,leagueNameById);
          gameEquipmentRef.current=equip;
          setGameEquipment(equip);
          try{await window.storage.set(GAME_EQUIPMENT_KEY,JSON.stringify(equip));}catch{}
          // Ref kept in step on every load path, or the first import
          // after a reload would build on an empty ref and wipe what was
          // already there.
          manualScoresRef.current=rebuilt;
          setManualScores(rebuilt);
          try{await window.storage.set(MANUAL_SCORES_KEY,JSON.stringify(rebuilt));}catch{}
        }else{
          const ms=await window.storage.get(MANUAL_SCORES_KEY);
          if(ms){
            const loaded=normalizeManualScores(JSON.parse(ms.value));
            manualScoresRef.current=loaded;
            setManualScores(loaded);
          }
          try{
            const ge=await window.storage.get(GAME_EQUIPMENT_KEY);
            if(ge){const loadedE=JSON.parse(ge.value)||{};gameEquipmentRef.current=loadedE;setGameEquipment(loadedE);}
          }catch{}
        }

        try{
          const dismissed=await window.storage.get(SESSION_START_KEY);
          setSessionStartDismissedDate(dismissed?.value||"");
        }catch{setSessionStartDismissedDate("");}
        try{
          const seen=await window.storage.get(SESSION_START_SEEN_KEY);
          setSessionStartSeen(seen?.value==="1");
        }catch{setSessionStartSeen(false);}

                if(matchesRes.online&&matchesRes.data){
          const pendingMatches=await getQueuedRecordsForTable("matches");
          const pendingMatchIds=new Set(pendingMatches.map(p=>p.id));
          const cloudMatches=matchesRes.data.filter(row=>!pendingMatchIds.has(row.id)).map(row=>matchFromSupabaseRow(row,leagueNameById));
          const pendingMatchObjs=pendingMatches.map(row=>matchFromSupabaseRow(row,leagueNameById));
          const mergedMatches=[...cloudMatches,...pendingMatchObjs];
          setMatches(mergedMatches);
          try{await window.storage.set(MATCHES_KEY,JSON.stringify(mergedMatches));}catch{}
        }else{
          const m=await window.storage.get(MATCHES_KEY);
          if(m){const v=JSON.parse(m.value);if(Array.isArray(v))setMatches(v);}
        }

        // Team names, resolved to league NAMES so every lookup can match
        // on the name rather than an id. Members aren't loaded here --
        // nothing on Stats or Trends needs them, and the Teams screen
        // loads the full roster when it opens.
        if(teamsRes.online&&teamsRes.data){
          setTeams(prev=>{
            const byId=Object.fromEntries((prev||[]).map(t=>[t.id,t]));
            return teamsRes.data.map(row=>({
              ...(byId[row.id]||{}),
              id:row.id,
              name:row.name,
              league:leagueNameById[row.league_id]||byId[row.id]?.league||"",
              // This fetch is names only -- the Teams screen loads the
              // roster. Default to [] so callers doing
              // team.members.includes(...) don't throw; an undefined here
              // silently killed the league chip's tap handler.
              members:byId[row.id]?.members||[],
            }));
          });
        }

                if(lanePatternsRes.online&&lanePatternsRes.data){
          const pendingPatterns=await getQueuedRecordsForTable("lane_patterns");
          const pendingPatternIds=new Set(pendingPatterns.map(p=>p.id));
          const cloudPatterns=lanePatternsRes.data.filter(row=>!pendingPatternIds.has(row.id)).map(row=>lanePatternFromSupabaseRow(row,leagueNameById));
          const pendingPatternObjs=pendingPatterns.map(row=>lanePatternFromSupabaseRow(row,leagueNameById));
          const mergedPatterns=[...cloudPatterns,...pendingPatternObjs];
          setLanePatterns(mergedPatterns);
          try{await window.storage.set(LANE_PATTERNS_KEY,JSON.stringify(mergedPatterns));}catch{}
        }else{
          const lp=await window.storage.get(LANE_PATTERNS_KEY);
          if(lp){const v=JSON.parse(lp.value);if(v&&typeof v==="object")setLanePatterns(v);}
        }
        const bl=await window.storage.get("bowling-ball-lane-lines-v1");
        if(bl){const v=JSON.parse(bl.value);if(v&&typeof v==="object"&&!Array.isArray(v))setBallLaneLines(v);}
      }catch{}
    }
    load();
  },[]);

  // Leagues: cloud-first, falling back to whatever's cached locally if
  // there's no signal right now. Local storage doubles as the offline
  // cache here — every successful cloud load mirrors into it, so a later
  // offline load still has something to show instead of nothing.
  useEffect(()=>{
    async function loadLeagues(){
      const{data,online}=await cloudRead("leagues",q=>q.select("id,name"));
      if(online&&data){
        const pending=await getQueuedRecordsForTable("leagues");
        // Practice leagues are stored per-user as "Practice·<id>" because
        // leagues.name is globally unique. They register and list under
        // the plain display name -- otherwise the suffixed form would
        // appear in the league picker and nothing would resolve
        // "Practice" to an id.
        //
        // Another bowler's practice league is not this bowler's: only
        // one matching THIS user is mapped, so a shared read can't point
        // practice at someone else's row.
        const myPractice=user?.id?practiceLeagueCloudName(user.id):null;
        // Casual has a per-user container row too, mapped exactly like
        // practice: only the one matching THIS user, and never listed as
        // a league anyone can pick.
        const myCasual=user?.id?casualLeagueCloudName(user.id):null;
        const register=r=>{
          if(isPracticeLeagueName(r.name)){
            if(r.name===myPractice)leagueIdsRef.current[PRACTICE_SESSION_KEY]=r.id;
            return;
          }
          if(isCasualLeagueName(r.name)){
            if(r.name===myCasual)leagueIdsRef.current[CASUAL_SESSION_KEY]=r.id;
            return;
          }
          leagueIdsRef.current[r.name]=r.id;
        };
        data.forEach(register);
        pending.forEach(r=>{
          if(isPracticeLeagueName(r.name)){
            if(r.name===myPractice&&!leagueIdsRef.current[PRACTICE_SESSION_KEY])leagueIdsRef.current[PRACTICE_SESSION_KEY]=r.id;
            return;
          }
          if(isCasualLeagueName(r.name)){
            if(r.name===myCasual&&!leagueIdsRef.current[CASUAL_SESSION_KEY])leagueIdsRef.current[CASUAL_SESSION_KEY]=r.id;
            return;
          }
          if(!leagueIdsRef.current[r.name])leagueIdsRef.current[r.name]=r.id;
        });
        const listable=r=>{
          if(isPracticeLeagueName(r.name))return r.name===myPractice?PRACTICE_SESSION_KEY:null;
          if(isCasualLeagueName(r.name))return r.name===myCasual?CASUAL_SESSION_KEY:null;
          return r.name;
        };
        const names=[...new Set([...data.map(listable),...pending.map(listable)].filter(Boolean))];
        if(names.length){
          setLeagues(names);
          try{await window.storage.set(LEAGUES_KEY,JSON.stringify(names));}catch{}
        }
        return;
      }
      try{
        const lg=await window.storage.get(LEAGUES_KEY);
        if(lg){
          const list=JSON.parse(lg.value);
          if(Array.isArray(list)&&list.length)setLeagues([...new Set(list.map(String).map(s=>s.trim()).filter(Boolean))]);
        }
      }catch{}
    }
    loadLeagues();
  },[]);

  // Live count of writes sitting in the offline queue, not yet confirmed
  // synced to Supabase. Surfaced in the header so "is my data actually
  // reaching the cloud" has a direct, always-visible answer instead of
  // needing to manually check Supabase after every entry.
  const[pendingSyncCount,setPendingSyncCount]=useState(0);
  // Debounce timers for match text fields (opponent, handicap) — typing
  // fires a cloud write on every keystroke otherwise, which is both
  // wasteful and a plausible way to overwhelm the connection with rapid
  // concurrent requests to the same row. Keyed per team+date so editing one
  // match doesn't reset another's pending save.
  const matchSaveTimers=useRef({});
  const lanePatternSaveTimers=useRef({});
  const pokerSaveTimers=useRef({});
  useEffect(()=>{
    getPendingCount().then(setPendingSyncCount);
    return onPendingCountChange(setPendingSyncCount);
  },[]);

  const[showSyncDetail,setShowSyncDetail]=useState(false);
  // Technical detail is opt-in: the default view explains, not debugs.
  const[syncBreakdown,setSyncBreakdown]=useState(null);
  async function openSyncDetail(){
    const inspection=await inspectPendingQueue();
    setSyncBreakdown(inspection);
    setShowSyncDetail(true);
  }


  // Forces every match currently held locally through a fresh diff-and-sync
  // attempt using whatever the CURRENT code actually does — not a retry of
  // some already-queued payload. Needed because flushPendingQueue() resends
  // a stuck item's stored payload verbatim; it was captured at the moment
  // of the original failure using whatever mapping logic existed then, and
  // never gets re-transformed on retry. If that logic was buggy at the
  // time, every retry just resends the exact same broken data forever —
  // this is the only way to actually apply a fix to data that predates it.
  async function handleResyncAll(){
    await syncShotsToCloud([],shots);
    await syncSessionsToCloud([],sessions);
    await syncMatchesToCloud([],matches);
    await syncLanePatternsToCloud([],lanePatterns);
  }


  const[syncingNow,setSyncingNow]=useState(false);
  async function handleSyncNow(){
    setSyncingNow(true);
    await flushPendingQueue();
    const inspection=await inspectPendingQueue();
    setSyncBreakdown(inspection);
    setSyncingNow(false);
  }

    async function saveBowlers(u){
      const prevSet=new Set(bowlers);
      const nextSet=new Set(u);
      setBowlers(u);
      try{await window.storage.set(BOWLERS_KEY,JSON.stringify(u));}catch{}

      for(const name of prevSet){
        if(!nextSet.has(name))cloudDelete("bowler_names",{name});
      }
      for(const name of nextSet){
        if(!prevSet.has(name))cloudWrite("bowler_names",{id:crypto.randomUUID(),name,created_by:user?.id||null});
      }
    }

    // Arsenals are a nested {bowlerName: [balls]} object locally, but a flat
    // set of (bowler_name, ball) rows in Supabase — diffed as composite
    // pairs (via JSON.stringify, safe against any separator-collision risk
    // a plain string key could have) rather than by a single id.
    async function saveArsenals(u){
      const prevPairs=new Map();
      Object.entries(arsenals).forEach(([bowler,balls])=>{
        balls.forEach(ball=>prevPairs.set(JSON.stringify([bowler,ball]),{bowler,ball}));
      });
      const nextPairs=new Map();
      Object.entries(u).forEach(([bowler,balls])=>{
        balls.forEach(ball=>nextPairs.set(JSON.stringify([bowler,ball]),{bowler,ball}));
      });

      setArsenals(u);
      try{await window.storage.set(ARSENALS_KEY,JSON.stringify(u));}catch{}

      for(const[key,{bowler,ball}]of prevPairs){
        if(!nextPairs.has(key))cloudDelete("arsenals",{bowler_name:bowler,ball});
      }
      for(const[key,{bowler,ball}]of nextPairs){
        if(!prevPairs.has(key))cloudWrite("arsenals",{id:crypto.randomUUID(),bowler_name:bowler,ball,created_by:user?.id||null});
      }
    }
  async function syncLanePatternsToCloud(prevPatterns,nextPatterns){
    const prevById=new Map(prevPatterns.map(p=>[p.id,p]));
    const nextById=new Map(nextPatterns.map(p=>[p.id,p]));
    for(const id of prevById.keys()){
      if(!nextById.has(id))await cloudDelete("lane_patterns",id);
    }
    for(const[id,pattern]of nextById){
      const prev=prevById.get(id);
      if(!prev||JSON.stringify(prev)!==JSON.stringify(pattern)){
        const row=lanePatternToSupabaseRow(pattern,leagueIdsRef.current);
        // Without a real team_id, this write can never succeed — same
        // reasoning as matches, see syncMatchesToCloud.
        if(row.team_id)await cloudWrite("lane_patterns",row);
      }
    }
  }
  async function saveLanePatterns(u){
    const prev=lanePatterns;
    setLanePatterns(u);
    try{await window.storage.set(LANE_PATTERNS_KEY,JSON.stringify(u));}catch{}
    await syncLanePatternsToCloud(prev,u);
  }
  async function saveLeagues(u){setLeagues(u);try{await window.storage.set(LEAGUES_KEY,JSON.stringify(u));}catch{}}

  // Ensures each of these league names has a real row in Supabase, inserting
  // one (with a client-generated id, so it's stable even if this goes
  // through the offline sync queue) for any name not already tracked.
  // Returns the list of names that failed to actually sync, so callers can
  // warn rather than silently trust a write that may never have happened.
  async function ensureLeaguesInCloud(names){
    const failed=[];
    for(const name of names){
      if(leagueIdsRef.current[name])continue;

      // Look before inserting. leagues.name is globally unique, so a row
      // may already exist for two ordinary reasons:
      //
      //   1. This device created it, then reloaded. leagueIdsRef is
      //      rebuilt from the cloud on load, so anything called before
      //      that finishes sees an empty ref and tries to insert again --
      //      with a NEW uuid, guaranteeing a 23505 against the row it
      //      created itself moments earlier.
      //   2. Another bowler already created that league. Real leagues are
      //      shared, so joining an existing one is the normal case, not
      //      an error.
      //
      // Either way the right move is to adopt the existing id, not to
      // fail the write.
      const existing=await cloudRead("leagues",q=>q.select("id,name").eq("name",name));
      if(existing.online&&Array.isArray(existing.data)&&existing.data.length){
        leagueIdsRef.current[name]=existing.data[0].id;
        continue;
      }

      const id=crypto.randomUUID();
      // Same reasoning as team creation above: omit created_by so the
      // column DEFAULT auth.uid() fills it. An explicit null would fail
      // the INSERT policy the same way.
      const result=await cloudWrite("leagues",{id,name});
      // `duplicate` is NOT the same as success under this id.
      //
      // cloudWrite reports synced:true on a 23505 because the row really
      // is in the cloud -- which is right for it and wrong to act on
      // here. leagues is UNIQUE (created_by, name), so a 23505 means a
      // row with this NAME already exists under a DIFFERENT id: usually
      // one this device inserted moments earlier whose response timed
      // out. Adopting `id` registers a league that does not exist.
      //
      // That is what produced the FK storm: hidden_leagues was then
      // written with the phantom league_id, failed
      // hidden_leagues_league_id_fkey, and retried 89 times before the
      // queue marked it permanent.
      //
      // On a duplicate, fall through to the re-read below, which already
      // exists to find the real id.
      if(result.synced&&!result.duplicate){
        leagueIdsRef.current[name]=id;
        continue;
      }

      // Lost a race between the check above and the insert -- someone
      // else created the same league in between. Re-read rather than
      // reporting a failure the bowler can do nothing about.
      const after=await cloudRead("leagues",q=>q.select("id,name").eq("name",name));
      if(after.online&&Array.isArray(after.data)&&after.data.length){
        leagueIdsRef.current[name]=after.data[0].id;
      }else{
        failed.push(name);
      }
    }
    return failed;
  }

  // Practice needs a REAL league row, not just a stand-in name.
  //
  // Sessions and manual scores both resolve a league_id before they sync;
  // a name with no row behind it resolves to null and the write is
  // skipped, which is why practice scores stayed on the device forever
  // while practice SHOTS synced fine (shots tolerate a null league_id).
  //
  // Created lazily on the first practice session rather than at signup,
  // so a bowler who never practises never gets a league they didn't ask
  // for. Hidden from the league pickers -- it is a container for syncing,
  // not somewhere you choose to bowl.
  const practiceLeagueEnsured=useRef(false);
  async function ensurePracticeLeague(){
    if(practiceLeagueEnsured.current)return leagueIdsRef.current[PRACTICE_SESSION_KEY]||null;
    practiceLeagueEnsured.current=true;
    if(!leagues.includes(PRACTICE_SESSION_KEY)){
      await saveLeagues([...leagues,PRACTICE_SESSION_KEY]);
    }
    // Created under a per-user name because leagues.name is globally
    // unique; registered locally under "Practice" so the rest of the app
    // never sees the suffixed form.
    const cloudName=practiceLeagueCloudName(user.id);
    if(!leagueIdsRef.current[PRACTICE_SESSION_KEY]){
      const failedCloud=await ensureLeaguesInCloud([cloudName]);
      if(!failedCloud.length&&leagueIdsRef.current[cloudName]){
        leagueIdsRef.current[PRACTICE_SESSION_KEY]=leagueIdsRef.current[cloudName];
      }
    }
    const failed=leagueIdsRef.current[PRACTICE_SESSION_KEY]?[]:[PRACTICE_SESSION_KEY];
    if(failed.length){
      // Offline or the write failed: practice still works exactly as it
      // did before, on-device. It syncs on a later attempt.
      practiceLeagueEnsured.current=false;
      return null;
    }
    // hiddenLeagues stores league IDs, not names -- pushing the name here
    // would add an entry that never matches anything and leave Practice
    // sitting in every league picker.
    const practiceId=leagueIdsRef.current[PRACTICE_SESSION_KEY]||null;
    if(practiceId&&!hiddenLeagues.includes(practiceId)){
      const updated=[...hiddenLeagues,practiceId];
      setHiddenLeagues(updated);
      try{await window.storage.set(HIDDEN_LEAGUES_KEY,JSON.stringify(updated));}catch{}
      // onConflict on the NATURAL key. Without it the upsert conflicts on
      // the primary key -- and a fresh randomUUID() never matches the
      // existing row, so it becomes an insert and hits the
      // (user_id, league_id) unique constraint with 23505.
      cloudWrite("hidden_leagues",{id:crypto.randomUUID(),user_id:user?.id||null,league_id:practiceId},{onConflict:"user_id,league_id"});
    }
    return practiceId;
  }

  // Casual gets a league row too, so casual scores sync.
  //
  // updateManualScore bails on `if(!leagueId)return`, so without a row
  // every casual night lived only in device storage -- a reinstall or a
  // new phone lost the friends leaderboard and every badge on it. Now
  // that it builds up over months, that's real data.
  //
  // Same shape as ensurePracticeLeague: per-user cloud name, hidden from
  // league pickers, and a failure just means it stays local and retries
  // later rather than blocking the night.
  const casualLeagueEnsured=useRef(false);
  async function ensureCasualLeague(){
    if(casualLeagueEnsured.current)return leagueIdsRef.current[CASUAL_SESSION_KEY]||null;
    casualLeagueEnsured.current=true;
    if(!user?.id)  {casualLeagueEnsured.current=false;return null;}

    if(!leagues.includes(CASUAL_SESSION_KEY)){
      await saveLeagues([...leagues,CASUAL_SESSION_KEY]);
    }
    const cloudName=casualLeagueCloudName(user.id);
    if(!leagueIdsRef.current[CASUAL_SESSION_KEY]){
      const failedCloud=await ensureLeaguesInCloud([cloudName]);
      if(!failedCloud.length&&leagueIdsRef.current[cloudName]){
        leagueIdsRef.current[CASUAL_SESSION_KEY]=leagueIdsRef.current[cloudName];
      }
    }
    const casualId=leagueIdsRef.current[CASUAL_SESSION_KEY]||null;
    if(!casualId){
      // Offline, or the write failed. Casual still works on-device
      // exactly as it did; this retries on a later session.
      casualLeagueEnsured.current=false;
      return null;
    }
    // Hidden from league pickers -- "Just Bowling" is a container, not a
    // league anyone chooses from a list.
    if(!hiddenLeagues.includes(casualId)){
      const updated=[...hiddenLeagues,casualId];
      setHiddenLeagues(updated);
      try{await window.storage.set(HIDDEN_LEAGUES_KEY,JSON.stringify(updated));}catch{}
      cloudWrite("hidden_leagues",{id:crypto.randomUUID(),user_id:user?.id||null,league_id:casualId},{onConflict:"user_id,league_id"});
    }
    return casualId;
  }

  async function addLeague(name,startDate,endDate){
    const clean=name.trim();
    if(!clean)return;
    if(leagues.some(l=>l.toLowerCase()===clean.toLowerCase())){alert("A league with that name already exists.");return;}
    // Newest FIRST. Appending put a new league at the bottom of a list
    // long enough to scroll, so adding one looked like nothing had
    // happened -- the thing you just made was off screen.
    await saveLeagues([clean,...leagues]);
    if(startDate||endDate)await saveLeagueDates(clean,startDate,endDate);
    const failed=await ensureLeaguesInCloud([clean]);
    if(failed.length){
      alert(`"${clean}" was saved on this device only and hasn't reached the cloud yet — it won't be visible to teammates or usable for creating a team until it syncs. It'll keep retrying in the background if you're offline; check back if this persists.`);
    }
  }

  // Editable later too -- a season date typed wrong at creation, or a
  // league that never had one, shouldn't be locked in forever.
  // Adding a pattern that isn't in the seed set -- a house shot, a PBA
  // Tour stop that wasn't included, or one typed wrong the first time.
  // Never marked verified: only the seeded, sourced rows carry that.
  async function submitOilPattern(pattern){
    const normalized=normalizePattern(pattern);
    if(!normalized)return null;
    // If it already exists (same name, case-insensitive), don't create a
    // duplicate -- just use the existing one.
    const existing=oilPatterns.find(p=>p.name.toLowerCase()===normalized.name.toLowerCase());
    if(existing)return existing;
    const updated=[...oilPatterns,normalized];
    setOilPatterns(updated);
    try{window.storage.set(OIL_PATTERNS_KEY,JSON.stringify(updated));}catch{}
    cloudWrite("oil_patterns",patternToRow(normalized,user?.id||null));
    return normalized;
  }

  const LEAGUE_FORMATS_KEY="bowling-league-formats-v1";

  async function saveLeagueFormat(name,format){
    const next={...leagueFormats,[name]:leagueFormat(format)};
    setLeagueFormats(next);
    try{window.storage.set(LEAGUE_FORMATS_KEY,JSON.stringify(next));}catch{}
    const id=leagueIdsRef.current?.[name];
    // cloudUpdate, not cloudWrite: an upsert would send the whole row and
    // blank the league's other columns.
    if(id)await cloudUpdate("leagues",{id},{format:leagueFormat(format)});
  }

  async function saveLeagueDates(name,startDate,endDate){
    const normalized=normalizeLeagueDates({startDate,endDate});

    // Archive the season this replaces, if it replaces one.
    //
    // leagues.start_date and end_date describe ONE season, so this edit
    // is the moment last season's boundaries would be lost. No button
    // and no schedule -- the archive happens at the only point the data
    // would otherwise go.
    //
    // Returns null for a correction inside the current range, so fixing
    // a typo in the start date does not mint a phantom season.
    const toArchive=archiveOnNewStart(name,leagueDates?.[name],normalized.startDate);
    if(toArchive){
      const row={...toArchive,id:crypto.randomUUID()};
      const nextClosed=[...closedSeasons,row];
      setClosedSeasons(nextClosed);
      try{window.storage.set(CLOSED_SEASONS_KEY,JSON.stringify(nextClosed));}catch{}
      // cloudInsert, not cloudWrite: these rows are only ever created.
      // The (user_id, league, end_date) unique constraint means a double
      // save is the same season, which is why it is idempotent.
      await cloudInsert("closed_seasons",closedSeasonToRow(row,user?.id||null),{idempotent:true});
    }

    const updated={...leagueDates,[name]:normalized};

    setLeagueDates(updated);
    try{window.storage.set(LEAGUE_DATES_KEY,JSON.stringify(updated));}catch{}
    const leagueId=leagueIdsRef.current[name];
    if(leagueId)cloudUpdate("leagues",{id:leagueId},{start_date:normalized.startDate||null,end_date:normalized.endDate||null});
  }

  async function renameLeague(oldName,newName){
    const clean=newName.trim();
    if(!clean||oldName===clean)return;
    if(leagues.some(l=>l!==oldName&&l.toLowerCase()===clean.toLowerCase())){alert("A league with that name already exists.");return;}
    const updatedShots=renameLeagueInRecords(shots,oldName,clean);
    const updatedSessions=renameLeagueInRecords(sessions,oldName,clean);
    const updatedMatches=renameLeagueInRecords(matches,oldName,clean);
    const updatedLanePatterns=renameLeagueInRecords(lanePatterns,oldName,clean);
    const updatedLeagues=leagues.map(l=>l===oldName?clean:l);
    await saveShots(updatedShots);
    await saveSessions(updatedSessions);
    await saveMatches(updatedMatches);
    await saveLanePatterns(updatedLanePatterns);
    await saveLeagues(updatedLeagues);
    // Update the SAME row by its existing id — never delete-and-recreate,
    // since teams.league_id references this row and deleting it would
    // cascade-delete every team in the league.
    const existingId=leagueIdsRef.current[oldName];
    let renameFailed=false;
    if(existingId){
      delete leagueIdsRef.current[oldName];
      leagueIdsRef.current[clean]=existingId;
      const result=await cloudWrite("leagues",{id:existingId,name:clean});
      // A duplicate here is a REFUSAL, not a success.
      //
      // leagues is UNIQUE (created_by, name), so 23505 means this bowler
      // already has a league by that name. cloudWrite reports synced:true
      // because the row it collided with really is in the cloud -- but
      // nothing was renamed. Reported as success, the device would show
      // the new name while the cloud kept the old one, and the next read
      // would quietly put the old name back.
      if(result.duplicate){
        // Undo the local remap so state matches the cloud.
        delete leagueIdsRef.current[clean];
        leagueIdsRef.current[oldName]=existingId;
        alert(`You already have a league called "${clean}". Pick a different name.`);
        return;
      }
      renameFailed=!result.synced;
    }else{
      const failed=await ensureLeaguesInCloud([clean]);
      renameFailed=failed.length>0;
    }
    if(renameFailed){
      alert(`"${clean}" was renamed on this device only and hasn't reached the cloud yet. It'll keep retrying in the background if you're offline; check back if this persists.`);
    }
    setSessionLeague(v=>v===oldName?clean:v);
    setStatsLeague(v=>v===oldName?clean:v);
    // setTrendScope(...) was here and referenced a state that does not
    // exist -- so renaming a league threw "setTrendScope is not
    // defined" and took the app down. Trends is scoped by statsLeague
    // (see the <TrendsView> props), which the line above already
    // updates, so this was redundant as well as broken.
    setCompareLeague(v=>v===oldName?clean:v);
    setForm(f=>f.league===oldName?{...f,league:clean}:f);
    setPreEditForm(f=>f?.league===oldName?{...f,league:clean}:f);
  }

  async function addBowler(){
    const name=newBowlerName.trim();
    if(!name||bowlers.includes(name))return;
    const updated=[...bowlers,name];
    await saveBowlers(updated);
    // The very first bowler ever added inherits the legacy default arsenal
    // (continuity with existing logged data). Everyone after starts blank.
    if(bowlers.length===0&&Object.keys(arsenals).length===0){
      await saveArsenals({...arsenals,[name]:[...DEFAULT_ARSENAL]});
    } else if(!arsenals[name]){
      await saveArsenals({...arsenals,[name]:[]});
    }
    setNewBowlerName("");
    if(!activeBowler)setActiveBowler(name);
  }

  async function removeBowler(name){
    const updated=bowlers.filter(b=>b!==name);
    await saveBowlers(updated);
    const{[name]:_,...restArsenals}=arsenals;
    await saveArsenals(restArsenals);
    if(activeBowler===name)setActiveBowler(updated[0]||"");
    if(filterBowler===name)setFilterBowler("");
    if(statsBowler===name)setStatsBowler("");
    if(compareBowler===name)setCompareBowler("");
  }

  // Called with no arguments from the text field, or with a name and specs
  // when someone picks a community catalog suggestion -- which adds the
  // ball and fills its specs in one step.
  // Retire a ball, or bring it back.
  //
  // Not a delete. A ball with two thousand shots behind it still answers
  // "was the Phaze better on this pattern" -- the one question an old
  // ball is good for. Retiring takes it out of the arsenal and every
  // bag; the shots stay exactly where they are.
  async function setBallRetired(ballName,retire){
    const owner=displayName||activeBowler;
    if(!owner||!ballName)return;
    const mine=retiredBalls[owner]||{};
    const next=retire
      ?retireBall(mine,ballName,localDateString())
      :unretireBall(mine,ballName);
    const all={...retiredBalls,[owner]:next};
    setRetiredBalls(all);
    try{window.storage.set(RETIRED_BALLS_KEY,JSON.stringify(all));}catch{}

    // Bag memberships are left ALONE on purpose.
    //
    // A retired ball disappears from bags because the bag screens read
    // the active arsenal, not because its membership rows were deleted.
    // That means un-retiring a ball puts it back in the bags it was in,
    // which is what a bowler who rebuys a ball expects -- and it cannot
    // lose data the way a cascade delete can.
  }

  async function addBall(presetName,presetSpecs){
    const name=(presetName??newBallName).trim();

    // The arsenal the PROFILE SCREEN is showing, not activeBowler.
    //
    // Profile lists arsenals[displayName || activeBowler] and this wrote
    // to arsenals[activeBowler]. When those differ -- an account display
    // name beside a bowler name, which is the normal case -- the ball was
    // added to one arsenal and the list showed the other. It looked like
    // nothing happened, and the ball still turned up in the shot picker
    // because that reads the whole ball universe.
    const owner=displayName||activeBowler;
    if(!name||!owner){
      // A silent return here is how this hid: no ball, no error, no clue.
      setBallAddMessage(!owner?"Pick a bowler first.":"Give the ball a name.");
      setTimeout(()=>setBallAddMessage(""),4000);
      return;
    }
    const current=arsenals[owner]||[];
    if(current.includes(name)){setNewBallName("");return;}
    await saveArsenals({...arsenals,[owner]:[...current,name]});
    if(presetSpecs)setBallSpec(owner,name,presetSpecs);

    setNewBallName("");
  }

  // Saves a ball's drilling layout. Local state updates immediately; the
  // cloud write is debounced because this is typed digit-by-digit and
  // would otherwise fire a write per keystroke.
  // ── Practice guests (local only) ────────────────────────────────────
  function addGuestBowler(){
    const updated=addGuest(guests,newGuestName);
    if(updated===guests){setNewGuestName("");return;}
    setGuests(updated);
    guestsRef.current=updated;
    setNewGuestName("");
    // No cloudWrite here, on purpose -- see the state declaration.
    try{window.storage.set(GUESTS_KEY,JSON.stringify(updated));}catch{}
  }
  function removeGuestBowler(name){
    const updated=removeGuest(guests,name);
    setGuests(updated);
    guestsRef.current=updated;
    try{window.storage.set(GUESTS_KEY,JSON.stringify(updated));}catch{}
    if(activeBowler===name)selectBowler(displayName||bowlers[0]||"");
  }

  // Drill mode should always show a drill. Without this, switching to a
  // bowler who has no drill in progress left the mode selected but the
  // card gone, and the only way back was toggling to Games and returning.
  useEffect(()=>{
    if(preferences.environment!=="practice")return;
    if(practiceMode!=="drill")return;
    if(activeDrill)return;
    if(!activeBowler)return;
    setActiveDrill(emptyDrill(activeBowler,sessionDate));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[preferences.environment,practiceMode,activeDrill,activeBowler,sessionDate]);

  // ── Practice drills ─────────────────────────────────────────────────
  function startDrill(){
    setActiveDrill(emptyDrill(activeBowler,sessionDate));
    setDrillSaved(false);
  }

  // Begins a SECOND (or third) drill in the same session.
  //
  // Without this there was no way to work more than one target a night:
  // saveDrill leaves activeDrill pointing at the saved record, so changing
  // the target and saving again updated that same row instead of adding a
  // new one -- the first drill was silently overwritten and never reached
  // the recap. Starting fresh gives the next drill its own id.
  function startAnotherDrill(){
    setActiveDrill(emptyDrill(activeBowler,sessionDate));
    setDrillSaved(false);
  }
  function saveDrill(){
    if(!activeDrill||!activeBowler)return;
    // Second guard, independent of the one in selectBowler: never stamp a
    // drill with a bowler other than the one it was started for. If those
    // ever disagree, something upstream is wrong and writing the row
    // anyway would corrupt that bowler's drill history.
    if(activeDrill.bowler&&activeDrill.bowler!==activeBowler)return;
    const withId={...normalizeDrill(activeDrill),id:activeDrill.id||crypto.randomUUID(),bowler:activeDrill.bowler||activeBowler};
    const updated=[...drills.filter(d=>d.id!==withId.id),withId];
    setDrills(updated);
    try{window.storage.set(DRILLS_KEY,JSON.stringify(updated));}catch{}
    cloudWrite("drills",drillToRow(withId,user?.id||null));
    setActiveDrill(withId);
    // No longer a draft once it's saved.
    setDrillDrafts(prev=>{const next={...prev};delete next[withId.bowler];return next;});
    setDrillSaved(true);
    setTimeout(()=>setDrillSaved(false),1500);
  }

  // ── Hiding leagues & leaving teams ──────────────────────────────────
  function toggleLeagueHidden(leagueName){
    const leagueId=leagueIdsRef.current[leagueName];
    if(!leagueId)return;
    const isHidden=hiddenLeagues.includes(leagueId);
    const updated=isHidden?hiddenLeagues.filter(id=>id!==leagueId):[...hiddenLeagues,leagueId];
    setHiddenLeagues(updated);
    try{window.storage.set(HIDDEN_LEAGUES_KEY,JSON.stringify(updated));}catch{}
    if(isHidden)cloudDelete("hidden_leagues",{user_id:user?.id,league_id:leagueId});
    else cloudWrite("hidden_leagues",{id:crypto.randomUUID(),user_id:user?.id||null,league_id:leagueId},{onConflict:"user_id,league_id"});
  }

  // Leaving a team is visible to other people, so the confirmation spells
  // out exactly what changes -- including that past scores are kept.
  // Leaving acts on the SIGNED-IN user only -- never on activeBowler, which
  // may be a teammate being proxy-logged. Using activeBowler here would show
  // the teammate removed while the cloud actually removed the signed-in
  // user: two different people, silently.
  // Teams were READ from localStorage at startup but never WRITTEN, so
  // the list was empty on every load until the bowler happened to open
  // the Teams screen. Everything that looks up a team name -- the Viewing
  // chips, comparison badges, running averages, season record -- silently
  // fell back to the league name, which is why "Split Happens" kept
  // showing as "Tuesday".
  function persistTeams(next){
    setTeams(next);
    try{window.localStorage.setItem("bowling-teams-v1",JSON.stringify(next));}catch{}
  }

  async function leaveTeam(team,leagueName){
    if(!user?.id||!displayName)return;
    if(!(team.members||[]).includes(displayName)){
      window.alert(`You're not on ${team.name} as ${displayName}, so there's nothing to leave.`);
      return;
    }
    const impact=describeLeaveImpact(team,leagueName,teams,displayName);
    if(!window.confirm(leaveConfirmationText(impact)))return;
    const updatedTeams=teams.map(t=>t.id===team.id
      ?{...t,members:(t.members||[]).filter(m=>m!==displayName)}
      :t);
    persistTeams(updatedTeams);
    cloudDelete("team_members",{team_id:team.id,user_id:user.id});
  }

  // ── Bowling centers ─────────────────────────────────────────────────
  async function searchCenters(query){
    // Needs a location to search near -- HERE has no idea where to look
    // otherwise. Falls back to the bowler's last known center if geolocation
    // is refused, so the picker still works without location permission.
    const coords=await new Promise(resolve=>{
      if(!navigator?.geolocation)return resolve(null);
      navigator.geolocation.getCurrentPosition(
        p=>resolve({lat:p.coords.latitude,lng:p.coords.longitude}),
        ()=>resolve(null),
        {timeout:8000,maximumAge:600000}
      );
    });
    const fallback=centers.find(c=>c.lat!=null);
    const at=coords||(fallback?{lat:fallback.lat,lng:fallback.lng}:null);
    if(!at)return{error:"Location is needed to find nearby centers. Allow location access, or add the center by name."};

    try{
      const{data,error}=await supabase.functions.invoke("find-centers",{
        body:{query,lat:at.lat,lng:at.lng},
      });
      if(error)return{error:error.message||"Center search failed."};
      if(data?.error)return{error:data.error};
      return{centers:data?.centers||[]};
    }catch(e){
      return{error:e.message||"Couldn't search for centers right now."};
    }
  }

  // Saves a center if it's new, or returns the existing row for the same
  // venue -- so picking the same house twice never creates a duplicate.
  function ensureCenter(candidate){
    const existing=findExistingCenter(candidate,centers);
    if(existing)return existing;
    const created={...normalizeCenter(candidate),id:crypto.randomUUID()};
    const updated=[...centers,created];
    setCenters(updated);
    try{window.storage.set(CENTERS_KEY,JSON.stringify(updated));}catch{}
    cloudWrite("bowling_centers",centerToRow(created,user?.id||null));
    return created;
  }

  // Update a field on a centre that already exists.
  //
  // NOT via ensureCenter/setLeagueCenter. ensureCenter's job is "give me
  // a centre for this candidate, creating one if needed" -- so when the
  // centre already exists it returns it UNCHANGED and discards whatever
  // was passed in. Routing an edit through it meant the rack-type chips
  // fired, nothing persisted, and they re-rendered from untouched state
  // looking like they were not selectable at all.
  function updateCenter(centerId,changes){
    if(!centerId||!changes||typeof changes!=="object")return;
    const next=(centers||[]).map(c=>c&&c.id===centerId?{...c,...changes}:c);
    setCenters(next);
    try{window.storage.set(CENTERS_KEY,JSON.stringify(next));}catch{}
    const updated=next.find(c=>c&&c.id===centerId);
    // cloudUpdate, not cloudWrite: an upsert would resend every column
    // and blank anything not in `changes`.
    // Update, then fall back to a write if the row was not there.
    //
    // cloudUpdate matched 0 rows in the wild -- "no-rows on id", four
    // times. A centre can exist locally and not in the cloud: it was
    // created before this table synced, or its original write failed and
    // the queue dropped it. The update then did nothing, silently, so
    // rack type looked saved and came back empty on another device.
    //
    // The upsert is safe here. bowling_centers has no narrowed column
    // grants -- unlike team_members and imported_scores -- so sending
    // the whole row cannot be refused for touching a column it should
    // not.
    if(updated){
      (async()=>{
        const res=await cloudUpdate("bowling_centers",{id:centerId},centerToRow(updated,user?.id||null));
        // Only re-send a centre WE created.
        //
        // A zero-row update means one of two things: the row is missing,
        // or it belongs to another bowler and RLS hid it. The upsert
        // fixes the first and is refused for the second -- 42501 on the
        // USING expression, six times in one day, because nothing stopped
        // it trying again on the next save.
        //
        // createdBy is empty for a centre this device made and has not
        // synced yet, which is exactly the case the upsert is for.
        const mine=!updated.createdBy||updated.createdBy===(user?.id||"");
        if(res&&res.synced&&res.affected===0&&mine){
          await cloudWrite("bowling_centers",centerToRow(updated,user?.id||null));
        }
      })();
    }

  }

  function setLeagueCenter(leagueName,candidate){
    const center=candidate?ensureCenter(candidate):null;
    const updated={...leagueCenters};
    if(center)updated[leagueName]=center.id; else delete updated[leagueName];
    setLeagueCenters(updated);
    try{window.storage.set(LEAGUE_CENTERS_KEY,JSON.stringify(updated));}catch{}

    const leagueId=leagueIdsRef.current[leagueName];
    if(leagueId)cloudUpdate("leagues",{id:leagueId},{center_id:center?center.id:null});
  }

  // ── Community ball catalog ──────────────────────────────────────────
  // Publishing specs is opt-in and separate from saving them privately:
  // a bowler's own arsenal is theirs regardless of what the community says.
  async function publishBallSpecs(ballName,specs){
    if(!user?.id)return;
    const key=ballKey(ballName);
    // Stable per (user, ball) so "Update Shared" replaces the row rather
    // than violating unique(submitted_by, ball_key).
    const id=await stableId("submission",key,user.id);
    const entry={
      id,submittedBy:user.id,ballKey:key,ballName,brand:"",
      createdAt:new Date().toISOString(),approvals:0,rejections:0,myVote:null,
      specs:normalizeBallSpecs(specs),
    };
    setCatalogEntries(prev=>{
      const existing=(prev[key]||[]).filter(e=>e.submittedBy!==user.id);
      return{...prev,[key]:[...existing,entry]};
    });
    cloudWrite("ball_submissions",{
      id,submitted_by:user.id,ball_key:key,ball_name:ballName,
      ...specsToRow(normalizeBallSpecs(specs)),
    });
  }

  async function voteOnEntry(entryKey,entryId,vote){
    if(!user?.id)return;
    setCatalogEntries(prev=>({
      ...prev,
      [entryKey]:(prev[entryKey]||[]).map(e=>{
        if(e.id!==entryId)return e;
        // Replace this user's previous vote rather than stacking a second.
        const hadApprove=e.myVote==="approve";
        const hadReject=e.myVote==="reject";
        return{
          ...e,
          approvals:e.approvals-(hadApprove?1:0)+(vote==="approve"?1:0),
          rejections:e.rejections-(hadReject?1:0)+(vote==="reject"?1:0),
          myVote:vote,
        };
      }),
    }));
    // Same user + same submission must always be the same row, or changing
    // your vote violates unique(submission_id, confirmed_by) and the write
    // sits in the sync queue forever.
    const id=await stableId("vote",entryId,user.id);
    cloudWrite("ball_confirmations",{id,submission_id:entryId,confirmed_by:user.id,vote});
  }

  // Dismissing a rejection notice also clears the now-untrusted specs from
  // this bowler's own arsenal -- but keeps the ball itself, since they know
  // they own it and only the numbers were disputed.
  function acknowledgeRejection(ballName){
    const key=ballKey(ballName);
    const updated=[...catalogAck,key];
    setCatalogAck(updated);
    try{window.storage.set(CATALOG_ACK_KEY,JSON.stringify(updated));}catch{}
    if(activeBowler)setBallSpec(activeBowler,ballName,clearedSpecsAfterRejection(ballName));
  }

  // ── Ball specs & groups ─────────────────────────────────────────────
  function setBallSpec(bowlerName,ballName,specs){
    const key=`${bowlerName}|${ballName}`;
    const normalized=normalizeBallSpecs(specs);
    const updated={...ballSpecs,[key]:normalized};
    setBallSpecs(updated);
    try{window.storage.set(BALL_SPECS_KEY,JSON.stringify(updated));}catch{}
    clearTimeout(pokerSaveTimers.current[`spec|${key}`]);
    pokerSaveTimers.current[`spec|${key}`]=setTimeout(()=>{
      // Partial update: `arsenals` also holds this ball's drilling layout,
      // which an upsert would wipe out.
      cloudUpdate("arsenals",{bowler_name:bowlerName,ball:ballName},specsToRow(normalized));
    },600);
  }

  function saveBallGroup(group){
    const withId={...group,id:group.id||crypto.randomUUID(),bowlerName:group.bowlerName||activeBowler};
    const updated=ballGroups.some(g=>g.id===withId.id)
      ?ballGroups.map(g=>g.id===withId.id?withId:g)
      :[...ballGroups,withId];
    setBallGroups(updated);
    try{window.storage.set(BALL_GROUPS_KEY,JSON.stringify(updated));}catch{}
    clearTimeout(pokerSaveTimers.current[`bgroup|${withId.id}`]);
    pokerSaveTimers.current[`bgroup|${withId.id}`]=setTimeout(()=>{
      cloudWrite("ball_groups",groupToRow(withId,user?.id||null));
    },600);
    return withId;
  }

  function deleteBallGroup(groupId){
    setBallGroups(prev=>{
      const updated=prev.filter(g=>g.id!==groupId);
      try{window.storage.set(BALL_GROUPS_KEY,JSON.stringify(updated));}catch{}
      return updated;
    });
    // Balls in a deleted group become ungrouped rather than disappearing.
    setBallSpecs(prev=>{
      const updated={};
      for(const[k,v]of Object.entries(prev))updated[k]=v.groupId===groupId?{...v,groupId:""}:v;
      try{window.storage.set(BALL_SPECS_KEY,JSON.stringify(updated));}catch{}
      return updated;
    });
    cloudDelete("ball_groups",groupId);
  }

  // Seeds the seven standard groups the first time a bowler opens grouping.
  // They're ordinary rows from that point on -- renameable and deletable.
  function seedDefaultGroups(bowlerName){
    if(ballGroups.some(g=>g.bowlerName===bowlerName))return;
    const seeded=DEFAULT_BALL_GROUPS.map((name,i)=>({
      id:crypto.randomUUID(),bowlerName,name,sortOrder:i,
    }));
    const updated=[...ballGroups,...seeded];
    setBallGroups(updated);
    try{window.storage.set(BALL_GROUPS_KEY,JSON.stringify(updated));}catch{}
    seeded.forEach(g=>cloudWrite("ball_groups",groupToRow(g,user?.id||null)));
  }

  // ── Bags ────────────────────────────────────────────────────────────
  function saveBag(bag){
    const withId={...normalizeBag(bag,bag.bowlerName||activeBowler),id:bag.id||crypto.randomUUID()};
    const updated=bags.some(b=>b.id===withId.id)
      ?bags.map(b=>b.id===withId.id?withId:b)
      :[...bags,withId];
    setBags(updated);
    try{window.storage.set(BAGS_KEY,JSON.stringify(updated));}catch{}
    clearTimeout(pokerSaveTimers.current[`bag|${withId.id}`]);
    pokerSaveTimers.current[`bag|${withId.id}`]=setTimeout(()=>{
      cloudWrite("bags",bagToRow(withId,user?.id||null));
    },600);
    return withId;
  }

  function deleteBag(bagId){
    setBags(prev=>{
      const updated=prev.filter(b=>b.id!==bagId);
      try{window.storage.set(BAGS_KEY,JSON.stringify(updated));}catch{}
      return updated;
    });
    // Balls in a deleted bag become unassigned rather than vanishing --
    // the bowler still owns them, they're just not packed for anything.
    setBallBags(prev=>{
      const updated=removeBagMemberships(prev,bagId);
      try{window.storage.set(BALL_BAGS_KEY,JSON.stringify(updated));}catch{}
      return updated;
    });
    if(selectedBagId===bagId)setSelectedBagId("");
    cloudDelete("bags",bagId);
  }

  // A ball can live in many bags at once -- a benchmark ball might be in
  // the league bag and every tournament bag -- so this toggles one
  // membership rather than moving the ball.
  function toggleBallBag(bowlerName,ballName,bagId){
    const wasIn=!!ballBags[membershipKey(bowlerName,ballName,bagId)];
    const updated=toggleBallInBag(ballBags,bowlerName,ballName,bagId);
    setBallBags(updated);
    try{window.storage.set(BALL_BAGS_KEY,JSON.stringify(updated));}catch{}
    if(wasIn)cloudDelete("ball_bags",{bowler_name:bowlerName,ball:ballName,bag_id:bagId});
    // Same natural-key upsert as hidden_leagues: a fresh id can never
    // match the existing row, so without this a ball put back into a bag
    // it was previously in fails with 23505 rather than being a no-op.
    else cloudWrite("ball_bags",{id:crypto.randomUUID(),bowler_name:bowlerName,ball:ballName,bag_id:bagId,created_by:user?.id||null},{onConflict:"created_by,bowler_name,ball,bag_id"});
  }

  function setBallLayout(bowlerName,ballName,layout){
    const key=`${bowlerName}|${ballName}`;
    const updated={...ballLayouts,[key]:layout};
    setBallLayouts(updated);
    try{window.storage.set(LAYOUTS_KEY,JSON.stringify(updated));}catch{}

    clearTimeout(pokerSaveTimers.current[`layout|${key}`]);
    pokerSaveTimers.current[`layout|${key}`]=setTimeout(()=>{
      // Partial update for the same reason as specs above -- these two
      // features write different columns of the same arsenals row.
      cloudUpdate("arsenals",{bowler_name:bowlerName,ball:ballName},{
        layout_system:layout?.system||null,
        layout_values:layout?.values||null,
      });
    },600);
  }

  // Saves a bowler's profile. Debounced like other typed fields so a
  // name or note doesn't fire a cloud write per keystroke.
  // Lets a bowler re-run the first-launch setup from Settings -- handy if
  // they skipped it, or their situation changed.
  // Task responses the coach hasn't read yet. Push is blocked on
  // packaging; this is the part that works today and is arguably more
  // useful anyway -- which bowler needs attention, visible at a glance.
  const[coachSeenAt,setCoachSeenAt]=useState(undefined);
  useEffect(()=>{
    (async()=>{
      try{const r=await window.storage.get(COACH_SEEN_KEY);setCoachSeenAt(r?r.value:null);}
      catch{setCoachSeenAt(null);}
    })();
  },[]);
  const unreadResponses=coachSeenAt===undefined?{}:respondedSince(tasksByRelationship,coachSeenAt);
  const unreadResponseCount=Object.values(unreadResponses).reduce((n,list)=>n+list.length,0);
  async function markCoachResponsesSeen(){
    const latest=latestResponseAt(tasksByRelationship);
    if(!latest)return;
    setCoachSeenAt(latest);
    try{await window.storage.set(COACH_SEEN_KEY,latest);}catch{}
  }

  // One place that knows how a team member is named, because the shape
  // differs by origin: cloud rows map to {userId, displayName}, while a
  // locally-added roster entry can still be a bare string.
  function teamMemberName(m){
    if(typeof m==="string")return m;
    return m?.displayName||m?.bowlerName||"";
  }

  async function loadTeamInvites(){
    if(!user?.email)return;
    const res=await cloudRead("pending_invites",q=>q.select("*"));
    if(!res.online||!Array.isArray(res.data))return;
    const mine=res.data.filter(r=>
      String(r.invited_email||"").toLowerCase()===String(user.email).toLowerCase());
    const teamNames={};
    teams.forEach(t=>{teamNames[t.id]=t.name;});
    // Team names come from teams the invitee can already see. For a team
    // they're NOT on yet -- the normal case -- there's no name to show,
    // so fetch just the names for the teams they've been invited to.
    const unknown=[...new Set(mine.map(r=>r.team_id).filter(id=>!teamNames[id]))];
    if(unknown.length){
      const nameRes=await cloudRead("teams",q=>q.select("id,name").in("id",unknown));
      if(nameRes.online&&Array.isArray(nameRes.data)){
        nameRes.data.forEach(t=>{teamNames[t.id]=t.name;});
      }
    }
    setMyTeamInvites(pendingTeamInvites(mine,teamNames));
  }

  async function acceptTeamInvite(invite){
    setInviteBusyId(invite.id);
    try{
      // Joining writes to team_members, which the invitee has no direct
      // permission for -- the RPC is scoped to exactly the invite that
      // names them.
      const{data,error}=await supabase.rpc("accept_team_invite",{invite_id:invite.id});
      if(!error&&data){
        setMyTeamInvites(prev=>prev.filter(i=>i.id!==invite.id));
        // Teams are loaded by TeamManagement when the Social tab opens,
        // so the new membership appears there rather than being spliced
        // into local state here -- a half-built team object missing
        // members/pendingInvites would break that screen's assumptions.
        setSessionSaveMessage(`You've joined ${invite.teamName||"the team"}. It'll show under Social.`);
        setTimeout(()=>setSessionSaveMessage(null),5000);
      }else{
        setSessionSaveMessage("Couldn't join that team just now — try again in a moment.");
        setTimeout(()=>setSessionSaveMessage(null),5000);
      }
    }catch{}
    setInviteBusyId(null);
  }

  async function declineTeamInvite(invite){
    setInviteBusyId(invite.id);
    // Recorded rather than deleted: a deleted invite is indistinguishable
    // from one never sent, so the captain would just re-invite.
    await cloudUpdate("pending_invites",{id:invite.id},{declined_at:new Date().toISOString()});
    setMyTeamInvites(prev=>prev.filter(i=>i.id!==invite.id));
    setInviteBusyId(null);
  }

  async function loadFriendRequests(){
    if(!user?.id)return;
    const res=await cloudRead("friendships",q=>q.select("id,requester_id,addressee_id,status"));
    if(!res.online||!Array.isArray(res.data))return;
    const pending=res.data.filter(f=>f.addressee_id===user.id&&f.status==="pending");
    if(!pending.length){setIncomingFriendRequests([]);return;}
    const ids=[...new Set(pending.map(f=>f.requester_id))];
    const profRes=await cloudRead("profiles",q=>q.select("id,display_name").in("id",ids));
    const nameById={};
    if(profRes.online&&Array.isArray(profRes.data)){
      profRes.data.forEach(p=>{nameById[p.id]=p.display_name;});
    }
    setIncomingFriendRequests(pending.map(f=>({
      friendshipId:f.id,
      userId:f.requester_id,
      displayName:nameById[f.requester_id]||"Someone",
    })));
  }

  // ── Imported scores awaiting verification ───────────────────────────
  async function loadImportedScores(){
    if(!user?.id)return;
    const res=await cloudRead("imported_scores",q=>q.select("*"));
    if(!res.online||!Array.isArray(res.data))return;
    const nameById={};
    Object.entries(leagueIdsRef.current||{}).forEach(([name,id])=>{nameById[id]=name;});
    setImportedScores(res.data.map(r=>normalizeImportRecord({
      id:r.id,
      bowler:r.bowler_name,
      uploadedBy:r.uploaded_by,
      league:nameById[r.league_id]||"",
      date:r.date,
      importedScores:r.imported_scores,
      correctedScores:r.corrected_scores,
      importedShots:r.imported_shots,
      correctedShots:r.corrected_shots,
      status:r.status,
      respondedAt:r.responded_at,
      correctedBy:r.corrected_by,
      note:r.note,
    })).filter(Boolean));
  }

  // Called by the scorecard import for every column mapped to someone
  // OTHER than the person importing. Nothing reaches their real history
  // -- these are pending records they approve, reject, or correct.
  async function submitTeammateScores(entries){
    if(!user?.id||!entries?.length)return;
    const rows=[];
    for(const e of entries){
      const team=teams.find(t=>t.id===e.teamId);
      // Cloud-loaded members carry displayName; there is no bowlerName
      // field on them. Matching only on bowlerName silently found nobody,
      // so every teammate's scores were filed with a null bowler_user_id
      // and nobody could ever confirm them. Plain strings are still
      // handled for a locally-added roster.
      const member=(team?.members||[]).find(m=>teamMemberName(m)===e.bowler);
      rows.push({
        id:crypto.randomUUID(),
        // Null when the teammate has no account yet -- their scores still
        // belong on the team's card, they just have nobody to confirm them.
        bowler_user_id:member?.userId||null,
        bowler_name:e.bowler,
        uploaded_by:user.id,
        // Locally-created teams have a generated id, not a UUID -- see
        // validTeamId. Sending one is a 22P02 the bowler can't act on.
        team_id:validTeamId(e.teamId),
        league_id:leagueIdsRef.current[e.league]||null,
        date:e.date,
        imported_scores:e.importedScores,
        // The frames from the photo, proposed rather than applied.
        imported_shots:e.importedShots?.length?e.importedShots:null,
        status:"pending",
      });
    }
    // Shown immediately, so the team's card is complete the moment it's
    // imported rather than after a round trip.
    setImportedScores(prev=>[...prev,...entries.map((e,i)=>normalizeImportRecord({
      id:rows[i].id,
      bowler:e.bowler,
      uploadedBy:user.id,
      league:e.league,
      date:e.date,
      importedScores:e.importedScores,
      importedShots:e.importedShots||[],
      status:"pending",
    })).filter(Boolean)]);
    // cloudInsert: these rows are only ever created here. An upsert would
    // compile to ON CONFLICT DO UPDATE over every column in the payload,
    // including bowler_user_id and date, which are no longer updatable --
    // so a retry after a slow-but-successful write would fail forever.
    // NOT idempotent: these rows carry fresh ids, so a 23505 here is a
    // genuine collision rather than "already imported" -- and the import
    // dedup upstream is what prevents the same night being submitted
    // twice. Swallowing it would hide a real conflict.
    for(const row of rows)await cloudInsert("imported_scores",row);
  }

  function replaceImportRecord(next){
    setImportedScores(prev=>prev.map(r=>r.id===next.id?next:r));
    cloudUpdate("imported_scores",{id:next.id},{
      status:next.status,
      corrected_scores:next.correctedScores,
      corrected_shots:next.correctedShots||null,
      responded_at:next.respondedAt||null,
      corrected_by:next.correctedBy?(teams.flatMap(t=>t.members||[]).find(m=>teamMemberName(m)===next.correctedBy)?.userId||user?.id||null):null,
      note:next.note||null,
    });
  }

  // Whether the active bowler may fix a teammate's unconfirmed record.
  // The rules live in domain/importVerification.js -- this just supplies
  // the session history and who has confirmed their own scores.
  function canCorrectImport(record){
    const verifiedTeammates=importedScores
      .filter(r=>r.league===record.league&&r.date===record.date&&isConfirmed(r))
      .map(r=>r.bowler);
    // canCorrect, not correctAsTeammate: the latter also rejects a call
    // with no replacement scores, which would report "not allowed" for a
    // record the bowler is perfectly entitled to fix.
    return canCorrectImportRecord(record,activeBowler,{sessions,verifiedTeammates});
  }

  // Approving accepts the scores AND, when the photo had frames, writes
  // them into this bowler's shot history.
  //
  // Marked with imported_from so an imported frame is never silently
  // indistinguishable from one the bowler logged themselves: the data is
  // usable in stats, but its provenance travels with it.
  //
  // Only the bowler's OWN approval does this. Nothing is written until
  // they say the numbers are right, which is the whole point of the
  // pending state.
  // Nights the bowler already logged themselves, settled without asking.
  //
  // A pending row nags OTHER teammates once a session passes -- so
  // hiding it from this bowler's inbox only moved the noise. Superseded
  // means "nothing to confirm", which is true, without claiming anyone
  // verified it.
  //
  // Only when the numbers agree; a disagreement stays pending so the
  // conflict warning can do its job.
  useEffect(()=>{
    if(!activeBowler||!importedScores.length)return;
    const byNight={};
    for(const x of sessions){
      if(!x||x.bowler!==activeBowler||!Array.isArray(x.scores))continue;
      const key=`${x.league??""}|${x.date??""}`;
      byNight[key]=byNight[key]||{};
      x.scores.forEach((v,i)=>{if(v!=null)byNight[key][String(i+1)]=v;});
    }
    for(const r of importedScores){
      if(!r||r.bowler!==activeBowler)continue;
      const mine=byNight[`${r.league??""}|${r.date??""}`];
      if(!mine)continue;
      if(shouldSupersede(r,mine))replaceImportRecord(supersede(r));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[importedScores,sessions,activeBowler]);

  async function approveImportedScores(record){
    const approved=approveImport(record);
    replaceImportRecord(approved);

    const frames=record.correctedShots?.length?record.correctedShots:record.importedShots;
    if(!Array.isArray(frames)||!frames.length)return;
    if(record.bowler!==activeBowler)return;

    // Don't duplicate: if this bowler already has shots for this
    // league/date/game, the import has already been applied (or they
    // logged it themselves) and re-adding would double every frame.
    const already=new Set(shots
      .filter(sh=>sh.bowler===record.bowler&&sh.league===record.league&&sh.date===record.date)
      .map(sh=>String(sh.game)));

    const newShots=[];
    for(const g of frames){
      if(already.has(String(g.gameNumber)))continue;
      for(const sh of (g.shots||[])){
        newShots.push({
          ...sh,
          id:crypto.randomUUID(),
          bowler:record.bowler,
          league:record.league,
          date:record.date,
          game:String(g.gameNumber),
          ball:sh.ball||g.ballUsed||"",
          importedFrom:record.id,
        });
      }
    }
    if(!newShots.length)return;
    await saveShots([...shots,...newShots]);
  }
  function rejectImportedScores(record,corrected){replaceImportRecord(rejectImport(record,corrected,{by:record.bowler}));}
  function correctTeammateScores(record,corrected){
    // Which teammates have already confirmed their own scores for this
    // night -- the permission check needs that, not just "is on the team".
    const verifiedTeammates=importedScores
      .filter(r=>r.league===record.league&&r.date===record.date&&isConfirmed(r))
      .map(r=>r.bowler);
    const{record:next,error}=correctAsTeammate(record,corrected,activeBowler,{
      sessions,verifiedTeammates,
    });
    if(error)return error;
    replaceImportRecord(next);
    return null;
  }

  // ── Coaching ────────────────────────────────────────────────────────
  async function loadCoaching(){
    if(!user?.id)return;
    const relRes=await cloudRead("coaching_relationships",q=>q.select("id,coach_id,bowler_id,requested_by,status"));
    if(!relRes.online||!relRes.data)return;
    const mine=relRes.data.filter(r=>r.coach_id===user.id||r.bowler_id===user.id);
    setCoachingRels(mine);

    // Resolve the OTHER person's display name for each row.
    const otherIds=[...new Set(mine.map(r=>r.coach_id===user.id?r.bowler_id:r.coach_id))];
    if(otherIds.length){
      const profRes=await cloudRead("profiles",q=>q.select("id,display_name").in("id",otherIds));
      // Best-effort: if the handedness view isn't present yet (migration
      // not run), coaching still works -- labels just fall back to the
      // right-handed default rather than the screen failing.
      // An RPC now, not a table read: coached_bowler_handedness became a
      // security definer FUNCTION rather than a view, so it can pin its
      // search_path and can't leak rows to a predicate evaluated before
      // its own filter. Same rows, same boundary.
      //
      // Still tolerant of the call failing: a coach whose database
      // hasn't had this migration applied falls back to right-handed
      // defaults rather than losing the coaching screen entirely.
      try{
        const{data:handData,error:handErr}=await supabase.rpc("coached_bowler_handedness");
        if(!handErr&&Array.isArray(handData)){
          const byId={};
          handData.forEach(r=>{if(r.left_handed)byId[r.bowler_user_id]=true;});
          setCoachHandednessById(byId);
        }
      }catch{}
      if(profRes.online&&profRes.data){
        const byId={};
        profRes.data.forEach(p=>{byId[p.id]=p.display_name;});
        setCoachProfilesById(byId);
      }
    }

    // Tasks and notes only exist for accepted relationships -- the RLS
    // enforces that too, so a pending request returns nothing either way.
    const acceptedIds=mine.filter(r=>r.status==="accepted").map(r=>r.id);
    if(!acceptedIds.length){setTasksByRelationship({});setNotesByRelationship({});return;}

    const taskRes=await cloudRead("coaching_tasks",q=>q.select("*").in("relationship_id",acceptedIds));
    if(taskRes.online&&taskRes.data){
      const byRel={};
      taskRes.data.forEach(row=>{
        const t=taskFromRow(row);
        if(!t)return;
        (byRel[row.relationship_id]=byRel[row.relationship_id]||[]).push(t);
      });
      setTasksByRelationship(byRel);
    }
    const noteRes=await cloudRead("coaching_notes",q=>q.select("*").in("relationship_id",acceptedIds));
    if(noteRes.online&&noteRes.data){
      const byRel={};
      noteRes.data.forEach(row=>{
        const n=noteFromRow(row);
        if(!n)return;
        (byRel[row.relationship_id]=byRel[row.relationship_id]||[]).push(n);
      });
      setNotesByRelationship(byRel);
    }
  }

  async function loadCoachBowlerSessions(bowlerUserId){
    if(!bowlerUserId||coachBowlerSessions[bowlerUserId])return;
    const res=await cloudRead("sessions",q=>q.select("*").eq("user_id",bowlerUserId));
    if(!res.online||!res.data)return;
    // leagueIdsRef maps name->id for the SIGNED-IN user's own leagues, so
    // it won't have every id a different bowler's rows might reference --
    // inverted here as the best available mapping; a league id it doesn't
    // recognize falls back to the raw id via sessionFromSupabaseRow's own
    // handling rather than crashing.
    const nameById={};
    Object.entries(leagueIdsRef.current||{}).forEach(([name,id])=>{nameById[id]=name;});
    const mapped=res.data.map(row=>sessionFromSupabaseRow(row,nameById));
    setCoachBowlerSessions(prev=>({...prev,[bowlerUserId]:mapped}));

    // Shots are a separate, optional read: the policy for them may not be
    // in place yet (see migration_coach_reads_bowler_shots.sql, which is
    // deliberately additive because that table's existing policies aren't
    // reproducible from this repo). If it returns nothing, the coach
    // still gets scores -- the screen degrades rather than breaking.
    const shotRes=await cloudRead("shots",q=>q.select("*").eq("user_id",bowlerUserId));
    if(shotRes.online&&Array.isArray(shotRes.data)){
      setCoachBowlerShots(prev=>({...prev,[bowlerUserId]:shotRes.data.map(row=>shotFromSupabaseRow(row,nameById))}));
    }
  }

  function searchCoachProfiles(term){
    clearTimeout(coachSearchTimer.current);
    if(!term.trim()){setCoachSearchResults([]);setCoachSearching(false);return;}
    setCoachSearching(true);
    coachSearchTimer.current=setTimeout(async()=>{
      const{data,online}=await cloudRead("profiles",q=>q.select("id,display_name").ilike("display_name",`%${term.trim()}%`).limit(8));
      setCoachSearchResults((online&&data)?data.filter(p=>p.id!==user?.id):[]);
      setCoachSearching(false);
    },300);
  }

  async function requestCoaching(profile,iAmCoach){
    if(!user?.id||!profile?.id)return;
    // Don't send a second request to someone already connected or pending.
    const existing=coachingRels.find(r=>
      (r.coach_id===profile.id&&r.bowler_id===user.id)||
      (r.coach_id===user.id&&r.bowler_id===profile.id));
    if(existing)return;
    const row={
      id:crypto.randomUUID(),
      coach_id:iAmCoach?user.id:profile.id,
      bowler_id:iAmCoach?profile.id:user.id,
      requested_by:user.id,
      status:"pending",
    };
    setCoachingRels(prev=>[...prev,row]);
    setCoachProfilesById(prev=>({...prev,[profile.id]:profile.display_name}));
    setCoachSearchResults([]);
    await cloudWrite("coaching_relationships",row);
  }

  // Only the coach sets this -- see migration_coaching_next_session.sql.
  // cloudUpdate rather than cloudWrite so it patches the two columns
  // instead of upserting a whole row and blanking what it doesn't know.
  async function setNextCoachingSession(relationshipId,date,note){
    setCoachingRels(prev=>prev.map(r=>r.id===relationshipId
      ?{...r,next_session:date||null,next_session_note:note||null}:r));
    await cloudUpdate("coaching_relationships",{id:relationshipId},
      {next_session:date||null,next_session_note:note||null});
  }

  async function respondCoaching(relationshipId,status){
    setCoachingRels(prev=>prev.map(r=>r.id===relationshipId?{...r,status}:r));
    await cloudUpdate("coaching_relationships",{id:relationshipId},{status});
    if(status==="accepted")loadCoaching();
  }

  async function endCoaching(relationshipId){
    setCoachingRels(prev=>prev.filter(r=>r.id!==relationshipId));
    await cloudDelete("coaching_relationships",{id:relationshipId});
  }

  async function addCoachingTask(relationshipId,draft){
    const t=normalizeTask({...draft,relationshipId,assignedBy:user?.id||""});
    if(!t)return;
    const withId={...t,id:crypto.randomUUID()};
    setTasksByRelationship(prev=>({...prev,[relationshipId]:[...(prev[relationshipId]||[]),withId]}));
    await cloudWrite("coaching_tasks",taskToRow(withId,relationshipId,user?.id||null));
  }

  function replaceTask(relationshipId,next){
    setTasksByRelationship(prev=>({
      ...prev,
      [relationshipId]:(prev[relationshipId]||[]).map(t=>t.id===next.id?next:t),
    }));
    cloudUpdate("coaching_tasks",{id:next.id},taskToRow(next,relationshipId,next.assignedBy||user?.id||null));
  }

  function completeCoachingTask(relationshipId,task,note){replaceTask(relationshipId,completeTask(task,note));}
  function attemptCoachingTask(relationshipId,task,reached,note){replaceTask(relationshipId,recordAttempt(task,reached,note));}
  function reopenCoachingTask(relationshipId,task){replaceTask(relationshipId,reopenTask(task));}

  async function removeCoachingTask(relationshipId,task){
    setTasksByRelationship(prev=>({
      ...prev,
      [relationshipId]:(prev[relationshipId]||[]).filter(t=>t.id!==task.id),
    }));
    await cloudDelete("coaching_tasks",{id:task.id});
  }

  async function addCoachingNote(relationshipId,body){
    const clean=(body||"").trim();
    if(!clean)return;
    const note={id:crypto.randomUUID(),relationshipId,authorId:user?.id||"",body:clean,createdAt:new Date().toISOString()};
    setNotesByRelationship(prev=>({...prev,[relationshipId]:[...(prev[relationshipId]||[]),note]}));
    await cloudWrite("coaching_notes",{id:note.id,...noteToRow(note,relationshipId,user?.id||null),created_at:note.createdAt});
  }

  // A coach setting one of their bowler's goals, from the roster.
  //
  // Writes the BOWLER's goal, not a separate coach-only copy: the point
  // is that both people watch the same number between sessions, and two
  // parallel goal lists would drift the moment either edited theirs.
  // Passing a null target removes it.
  function setBowlerGoal(bowlerName,typeId,target){
    if(!bowlerName||!typeId)return;
    const current=goalsByBowler[bowlerName]||[];
    const next=target==null
      ? current.filter(g=>g.typeId!==typeId)
      : [...current.filter(g=>g.typeId!==typeId),{typeId,target:Number(target)}];
    saveGoals(bowlerName,next);
  }

  function saveGoals(bowler,next){
    // activeBowler starts empty, so without this a goal set before any
    // bowler exists would write a row with bowler_name "" -- which the
    // not-null constraint accepts, leaving an unreachable junk row that
    // no view ever reads back.
    if(!bowler)return;
    const normalized=normalizeGoals(next);
    const updated={...goalsByBowler,[bowler]:normalized};
    setGoalsByBowler(updated);
    try{window.storage.set(GOALS_KEY,JSON.stringify(updated));}catch{}
    cloudWrite("bowler_goals",goalsToRow(normalized,bowler,user?.id||null),{onConflict:"created_by,bowler_name"});
  }

  function replayTour(track){
    // Falls back to a TRACK, not an environment.
    //
    // This was `track||preferences.environment||"league"`, from when a
    // track WAS an environment. With topic tracks, a no-argument call --
    // and HelpView's "Show me around the app again" is exactly that --
    // handed tourSteps the string "league", which matches no track and
    // lands on the look-around tour through the unknown-track fallback.
    // It played the right tour by accident, which is a different thing
    // from playing it on purpose and stops being true the moment that
    // fallback changes.
    startTour(TRACK_KEYS.includes(track) ? track : FIRST_TOUR);
  }

  function restartOnboarding(){
    // Seed from the existing profile. Without this an established bowler
    // reruns setup to a blank name field, and finishing would either
    // create a SECOND bowler under whatever they retyped or wipe the
    // handedness and centers they already had.
    const existing=activeBowler?profiles[activeBowler]:null;
    setOnboardingProfile(existing
      ?normalizeProfile(existing,activeBowler)
      :emptyProfile(activeBowler||""));
    try{window.localStorage.removeItem(ONBOARDED_KEY);}catch{}
    try{window.storage.set(ONBOARDED_KEY,"0");}catch{}
    setOnboarded(false);
    setShowOnboarding(true);
  }

  // Claiming a signup code. Returns an error string, or "" on success.
  //
  // The RPC is security definer: the claimer isn't on the team yet and
  // can't see the invite row, so the database does the checking. It
  // writes only the caller's own user id, so a code can't be used to add
  // anyone else.
  async function claimSignupCode(raw){
    const code=normalizeSignupCode(raw);
    if(!isValidSignupCode(code))return "That doesn't look like a team code.";
    try{
      const{error}=await supabase.rpc("claim_signup_code",{code});
      if(error)return error.message||"That code is not valid.";
      // Teams refresh on the next startup fetch; nothing to call here.
      return "";
    }catch{
      return "Couldn't check that code — you may be offline. You can enter it later in Settings.";
    }
  }

  function finishOnboarding(){
    // Commit what onboarding collected. The name creates the bowler --
    // everything downstream keys off bowler name, so this has to happen
    // before anything else can be logged.
    const typed=(onboardingProfile.bowlerName||"").trim();
    if(typed){
      if(!bowlers.includes(typed))saveBowlers([...bowlers,typed]);
      selectBowler(typed);
      // Merge over whatever that bowler already had rather than replacing
      // it: rerunning setup must not discard an arsenal, notes or a book
      // average that onboarding never asks about.
      const prior=profiles[typed];
      setProfile(typed,normalizeProfile({...(prior||{}),...onboardingProfile,bowlerName:typed},typed));

      // Push the name to the CLOUD profile too, not just the local one.
      //
      // Onboarding tells the bowler "your name is how teammates find
      // you", but it only ever wrote a local bowler profile. The cloud
      // profiles.display_name row stayed empty, so teammates saw
      // "Unknown" and name search couldn't find them -- until they
      // happened to open Team Management, which was the ONLY place that
      // called updateDisplayName.
      //
      // Fire-and-forget: a failure here must not block finishing setup,
      // and the sync queue retries it. Team Management still lets them
      // change it later.
      if(updateDisplayName)updateDisplayName(typed).catch(()=>{});
    }
    setOnboarded(true);
    try{window.storage.set(ONBOARDED_KEY,"1");}catch{}
    try{window.localStorage.setItem(ONBOARDED_KEY,"1");}catch{}
    // Completing the full-screen flow counts as having seen the prompt --
    // it asks the same two questions, so the daily card shouldn't appear
    // again immediately afterwards on the same day.
    setSessionStartSeen(true);
    const today=localDateString();
    setSessionStartDismissedDate(today);
    try{window.storage.set(SESSION_START_SEEN_KEY,"1");}catch{}
    try{window.storage.set(SESSION_START_KEY,today);}catch{}

    // THE WELCOME SCREEN IS SHOWN HERE, because here is where onboarding
    // actually ends.
    //
    // It used to be raised from the Bowl screen, when a bowler picked a
    // mode. That is not this moment. A new bowler finishing setup went
    // straight to Home and never saw it; the only way to reach it was to
    // finish setup, land on Home, go to Bowl and pick a mode, by which
    // point "welcome, let us show you around" is too late to mean
    // anything.
    //
    // Nothing fires on picking a mode now, and nothing should. Launching
    // a twelve-step walkthrough at someone who has just typed their name
    // is asking them to read the manual before touching the ball -- they
    // came to log a score. One screen saying where help lives, shown
    // once; the tours stay in Settings for anyone who wants them, and the
    // search bar answers the actual question rather than all twelve.
    // Picking a mode is something a bowler does every week, not a first
    // run.
    //
    // The callback and the piece of state that used to coordinate that
    // are gone. This comment is what they were protecting.
    //
    // Checked against toursSeen so it stays a once-only screen for
    // someone who reruns setup from Settings.
    if(!hasSeenTour(toursSeen,FIRST_TOUR))setShowWelcome(true);

    // Back to the top.
    //
    // Onboarding is a tall scrolling form and Home replaces it in the
    // same scroll container, so the browser keeps the offset: a bowler
    // who scrolled to the bottom to press Finish arrived on Home already
    // scrolled past the season figures and the journey row, looking at
    // whatever happened to be at that offset. Nothing about that reads
    // as "you are at the top of your home screen".
    scrollToTop();
  }

  // One place, guarded.
  //
  // window.scrollTo does not exist in the test DOM, and on iOS Safari a
  // smooth scroll queued during an unmount is sometimes dropped, so this
  // asks for an instant jump and ignores a failure rather than throwing
  // inside a state update.
  function scrollToTop(){
    try{
      if(typeof window!=="undefined"&&typeof window.scrollTo==="function"){
        window.scrollTo({top:0,left:0,behavior:"instant"});
      }
    }catch{
      try{window.scrollTo(0,0);}catch{}
    }
  }

  function dismissSessionStart(){
    const today=localDateString();
    setSessionStartDismissedDate(today);
    setSessionStartSeen(true);
    try{window.storage.set(SESSION_START_KEY,today);}catch{}
    try{window.storage.set(SESSION_START_SEEN_KEY,"1");}catch{}
  }

  function updateTournament(next){
    const normalized=normalizeTournament(next);
    setActiveTournament(normalized);
    try{window.storage.set(TOURNAMENT_KEY,JSON.stringify(normalized));}catch{}
  }

  // Clear the card for a new event. The saved one stays in history.
  function closeTournament(){
    const fresh=normalizeTournament({...emptyTournament(),bowler:activeBowler});
    setActiveTournament(fresh);
    try{window.storage.set(TOURNAMENT_KEY,JSON.stringify(fresh));}catch{}
    setTournamentSaveMessage("");
  }

  async function saveTournament(){
    // A silent return: tapping Save Tournament with no name did
    // nothing at all -- no save, no error, no clue which field was
    // missing, on a different tab from the button. A refusal the
    // bowler cannot see is worse than the mistake it guards against.
    if(!activeTournament.name.trim()){
      setTournamentSaveMessage("Give the tournament a name first — it's on the Set up tab.");
      setTimeout(()=>setTournamentSaveMessage(""),4000);
      return;
    }
    // Same guard as saveDrill: a tournament belongs to the bowler who
    // bowled it. Stamping the CURRENT activeBowler onto one that already
    // names someone else would file their scores under the wrong person --
    // reachable by switching bowlers in practice and returning here.
    // Both of MY names count as me.
    //
    // A tournament saved before the display name existed carries the
    // sign-in handle (reverett290). A bare string comparison then reads
    // that as somebody else and refuses to save the bowler's own event:
    // "This tournament is reverett290's. Switch bowler to save it."
    //
    // The merge in the profile sync renames these as it finds them, but
    // it only runs when both names are in the bowler list, and it cannot
    // reach a tournament saved on another device or restored from a
    // backup. So the CHECK has to be tolerant as well as the data.
    const myNames=new Set([activeBowler,displayName,handleFromEmail(user?.email)]
      .map(n=>String(n||"").trim()).filter(Boolean));
    if(activeTournament.bowler&&!myNames.has(String(activeTournament.bowler).trim())){
      setTournamentSaveMessage(`This tournament is ${activeTournament.bowler}\u2019s. Switch bowler to save it.`);
      setTimeout(()=>setTournamentSaveMessage(""),4000);
      return;
    }
    setTournamentSaveMessage("");
    const withIds={...activeTournament,id:activeTournament.id||crypto.randomUUID(),bowler:activeTournament.bowler||activeBowler};
    setActiveTournament(withIds);
    try{window.storage.set(TOURNAMENT_KEY,JSON.stringify(withIds));}catch{}
    // Keep the saved-tournament list in sync so pattern history reflects
    // this tournament immediately, not only after a reload.
    const merged=[...tournaments.filter(t=>t.id!==withIds.id),withIds];
    setTournaments(merged);
    try{window.storage.set(TOURNAMENTS_KEY,JSON.stringify(merged));}catch{}
    cloudWrite("tournaments",tournamentToRow(withIds,user?.id||null));
    setTournamentSaved(true);
    setTimeout(()=>setTournamentSaved(false),1500);
  }

  function setProfile(bowlerName,profile){
    const normalized=normalizeProfile(profile,bowlerName);
    const updated={...profiles,[bowlerName]:normalized};
    setProfiles(updated);
    try{window.storage.set(PROFILES_KEY,JSON.stringify(updated));}catch{}

    clearTimeout(pokerSaveTimers.current[`profile|${bowlerName}`]);
    pokerSaveTimers.current[`profile|${bowlerName}`]=setTimeout(()=>{
      // Keyed by (created_by, bowler_name), not by the generated id --
      // without this, editing a profile fails on every save after the first.
      cloudWrite("bowler_profiles",profileToRow(normalized,user?.id||null),{onConflict:"created_by,bowler_name"});
    },600);
  }

  // Accepting, overriding, or dismissing the book-average prompt all do the
  // same thing underneath: record that this bowler has now been asked
  // about this specific season-end, so it never nags again for the same
  // one. `newAverage` is omitted entirely on a plain dismissal -- "not
  // now" must not silently overwrite a real book average with nothing.
  function acknowledgeBookAverageUpdate(bowlerName,endDate,newAverage){
    const current=normalizeProfile(profiles[bowlerName],bowlerName);
    const next={...current,bookAverageAsOf:endDate};
    if(newAverage!==undefined&&newAverage!==null&&newAverage!==""){
      next.bookAverage=String(newAverage);
    }
    setProfile(bowlerName,next);
  }

  async function removeBall(bowlerName,ballName){
    const current=arsenals[bowlerName]||[];
    await saveArsenals({...arsenals,[bowlerName]:current.filter(b=>b!==ballName)});
    if(form.bowler===bowlerName&&form.ball===ballName){
      handleBallChange("");
    }

    // Clean up everything keyed on this ball. Left alone, bag memberships
    // silently reattach if the same ball is ever re-added, and orphaned
    // ball_bags rows accumulate in the cloud. Layouts and specs live on
    // the arsenals row, which saveArsenals already deletes.
    const key=`${bowlerName}|${ballName}`;
    const bagIds=Object.keys(ballBags)
      .filter(k=>k.startsWith(`${key}|`))
      .map(k=>k.split("|")[2]);
    if(bagIds.length){
      const nextBags={...ballBags};
      bagIds.forEach(bagId=>{delete nextBags[membershipKey(bowlerName,ballName,bagId)];});
      setBallBags(nextBags);
      try{window.storage.set(BALL_BAGS_KEY,JSON.stringify(nextBags));}catch{}
      bagIds.forEach(bagId=>cloudDelete("ball_bags",{bowler_name:bowlerName,ball:ballName,bag_id:bagId}));
    }
    setBallLayouts(prev=>{const n={...prev};delete n[key];return n;});
    setBallSpecs(prev=>{const n={...prev};delete n[key];return n;});
  }

  // Ball names to iterate for a given bowler's stats/filters — the union of
  // their current arsenal plus any ball names appearing in their logged shots
  // (so removing a ball from the arsenal never hides historical data).
  // bowlerKey==="" means everyone combined.
  function ballUniverse(bowlerKey){
    const fromArsenal=bowlerKey?(arsenals[bowlerKey]||[]):[...new Set(Object.values(arsenals).flat())];
    const relevantShots=bowlerKey?shots.filter(s=>s.bowler===bowlerKey):shots;
    const fromShots=[...new Set(relevantShots.map(s=>s.ball).filter(Boolean))];
    return[...new Set([...fromArsenal,...fromShots])];
  }

  function autoFillLineFor(bowlerName,ball,game,frame){
    const lane=calcLane(startingLane,game,frame);
    if(!ball||!lane||!bowlerName)return{startingBoard:"",targetArrows:""};
    return ballLaneLines[bowlerName]?.[ball]?.[lane]||{startingBoard:"",targetArrows:""};
  }
  function autoFillLine(ball,game,frame){
    return autoFillLineFor(activeBowler,ball,game,frame);
  }

  // The ball used on the most recently logged shot for whoever's active
  // right now (editing an existing shot uses that shot's own bowler/league/
  // date instead). Used to show Ball Change Reason only when the current
  // ball selection actually differs from what was just thrown — not on
  // every shot, and not on the very first shot of the night when there's
  // nothing yet to compare against.
  function previousShotBall(){
    const bowlerName=editingId?form.bowler:activeBowler;
    // effectiveSessionLeague, not sessionLeague.
    //
    // Practice, open bowling and tournaments all bowl under a container
    // league rather than one the bowler picked -- sessionLeague is blank
    // for them. Saving shots with the blank value meant a tournament's
    // frames never matched the tournament, so the games card stayed
    // empty and the recap reported no shots logged.
    const league=editingId?form.league:effectiveSessionLeague;

    const date=editingId?form.date:sessionDate;
    if(!bowlerName||!league||!date)return null;
    const relevant=shots.filter(s=>s.bowler===bowlerName&&s.league===league&&s.date===date&&s.id!==editingId);
    if(!relevant.length)return null;
    const last=[...relevant].sort((a,b)=>{
      const ga=parseInt(a.game),gb=parseInt(b.game);
      if(ga!==gb)return ga-gb;
      const fa=parseInt(a.frame),fb=parseInt(b.frame);
      if(fa!==fb)return fa-fb;
      return (a.ballNum||0)-(b.ballNum||0);
    }).pop();
    return last?.ball||null;
  }

  function selectBowler(name){
    const team=teams.find(t=>t.league===sessionLeague&&(t.members||[]).includes(name));
    const teamId=team?.id||"";
    setActiveBowler(name);

    // Park the outgoing bowler's drill under their own name and pick up
    // whatever the incoming bowler had. Keyed by the drill's OWN bowler
    // field rather than the outgoing activeBowler, so a draft can never be
    // filed under the wrong person even if the two ever disagree.
    if(activeDrill){
      const owner=activeDrill.bowler||activeBowler;
      if(owner)setDrillDrafts(prev=>({...prev,[owner]:activeDrill}));
    }
    setActiveDrill(drillDrafts[name]||null);
    setDrillSaved(false);

    // Everything about the shot itself — equipment, execution, and what
    // happened on the delivery — is specific to whoever's actually at the
    // line right now. None of it should follow from one bowler to another,
    // or linger from this same bowler's last completed shot.
    const resetFields={
      ball:"",surface:"",startingBoard:"",targetArrows:"",
      result:"",otherLeave:[],spareMade:"",strikeDescription:"",
      release:"",miss:[],ballChangeReason:[],pinCount:"",notes:"",
    };

    // Resume this bowler at their own next unplayed frame for tonight's
    // league/date, instead of leaving them wherever the previous bowler was.
    if(sessionLeague){
      const bShots=shots.filter(s=>s.bowler===name&&s.league===effectiveSessionLeague&&s.date===sessionDate&&(!s.ballNum||s.ballNum===1));
      if(bShots.length){
        const last=[...bShots].sort((a,b)=>{
          const ga=parseInt(a.game),gb=parseInt(b.game);
          if(ga!==gb)return ga-gb;
          return parseInt(a.frame)-parseInt(b.frame);
        }).pop();
        const allBShots=shots.filter(s=>s.bowler===name&&s.league===effectiveSessionLeague&&s.date===sessionDate);
        const{game:ng,frame:nf,ballNum:nb}=nextState(allBShots,name,sessionLeague,sessionDate,last.game,last.frame,last.ballNum);
        setForm(f=>({...f,...resetFields,bowler:name,teamId,league:effectiveSessionLeague,date:sessionDate,game:ng,frame:nf,ballNum:nb}));
        return;
      }
      // No shots yet for this bowler tonight — start fresh at Game 1 Frame 1
      setForm(f=>({...f,...resetFields,bowler:name,teamId,league:effectiveSessionLeague,date:sessionDate,game:"1",frame:"1",ballNum:null}));
      return;
    }
    setForm(f=>({...f,...resetFields,bowler:name}));
  }

  // Every existing call site passes the WHOLE new shots array (unchanged
  // from before this migration) — this diffs it against current state so
  // only what actually changed gets pushed to Supabase, rather than
  // rewriting every shot on every save.
  async function syncShotsToCloud(prevShots,nextShots){
    // A shot logged for a practice guest carries their name in
    // shot.bowler. Guests are people who never agreed to be in this app,
    // and the UI promises their scores stay on the device -- so their
    // shots are excluded from the upload, not just their names. They
    // remain in local state and in every on-device stat.
    // Two checks, because the guest LIST can change. A shot is marked
    // localOnly when it's logged, so removing someone from the list later
    // can't retroactively make their past shots uploadable. The list check
    // is the belt to that braces, covering any shot logged before this.
    const guestSet=new Set(guestsRef.current||[]);
    const isGuestShot=s=>s?.localOnly===true||(s?.bowler&&guestSet.has(s.bowler));

    const prevById=new Map(prevShots.filter(s=>!isGuestShot(s)).map(s=>[s.id,s]));
    const nextById=new Map(nextShots.filter(s=>!isGuestShot(s)).map(s=>[s.id,s]));
    for(const id of prevById.keys()){
      if(!nextById.has(id))await cloudDelete("shots",id);
    }
    for(const[id,shot]of nextById){
      const prev=prevById.get(id);
      if(!prev||JSON.stringify(prev)!==JSON.stringify(shot)){
        await cloudWrite("shots",shotToSupabaseRow(shot,user?.id,leagueIdsRef.current));
      }
    }
  }
  // Delete a whole night: the session, its shots, and its typed scores.
  //
  // All three, because a night lives in three places. Removing the
  // session alone leaves the shots behind, and they rebuild the night on
  // the next load -- the bowler deletes it, it comes back, and now they
  // do not trust the button.
  //
  // saveShots and saveSessions each diff against what they had and issue
  // their own cloud deletes, so this goes through them rather than
  // deleting rows by hand. Manual scores are keyed by
  // bowler|league|date|game, so the night's keys are prefix-matched.
  //
  // Returns what it removed, so the caller can say so rather than
  // claiming success blindly.
  // Writing an imported CSV.
  //
  // One save, not one per night: a file of eighty nights saved
  // individually is eighty round trips and eighty chances to half
  // finish. The rows were validated and the bowler has answered the
  // overwrite question before this runs.
  async function importCsvNights({rows,league,overwrite}){
    const list=Array.isArray(rows)?rows:[];
    if(!list.length)return;
    const who=activeBowler;
    const lg=String(league||"").trim()||IMPORTED_SESSION_KEY;

    // Replacing means the old night goes first. Filtering by date rather
    // than by id because an imported night has no id in common with the
    // one it replaces.
    const replacing=new Set(overwrite?list.map(r=>r.date):[]);
    const kept=(sessions||[]).filter(sn=>
      !(sn&&sn.bowler===who&&replacing.has(sn.date)));

    const made=list.map(r=>{
      const scores=(r.scores||[]).map(Number).filter(Number.isFinite);
      const total=scores.reduce((a,b)=>a+b,0);
      return {
        id:crypto.randomUUID(),
        bowler:who,
        teamId:"",
        league:lg,
        date:r.date,
        scores,
        total,
        average:scores.length?Math.round(total/scores.length):null,
        notes:"",
      };
    });
    await saveSessions([...kept,...made]);
  }

  async function deleteNight(bowler,league,date){
    if(!bowler||!league||!date)return {sessions:0,shots:0,scores:0};

    const isNight=r=>r&&r.bowler===bowler&&r.league===league&&String(r.date)===String(date);

    const keptSessions=(sessions||[]).filter(r=>!isNight(r));
    const keptShots=(shots||[]).filter(r=>!isNight(r));
    const removed={
      sessions:(sessions||[]).length-keptSessions.length,
      shots:(shots||[]).length-keptShots.length,
      scores:0,
    };

    const prefix=`${bowler}|${league}|${date}|`;
    const keptScores={};
    for(const[k,v]of Object.entries(manualScores||{})){
      if(k.startsWith(prefix)){removed.scores+=1;continue;}
      keptScores[k]=v;
    }

    if(removed.shots)await saveShots(keptShots);
    if(removed.sessions)await saveSessions(keptSessions);
    if(removed.scores){
      setManualScores(keptScores);
      try{window.storage.set(MANUAL_SCORES_KEY,JSON.stringify(keptScores));}catch{}
      // The cloud rows go too, or the next load restores them. Matched
      // on the same columns setManualScore deletes by -- there is no id
      // on these rows, they are keyed by who/where/when/which game.
      const leagueId=leagueIdsRef.current?.[league]||null;
      if(leagueId){
        for(const k of Object.keys(manualScores||{})){
          if(!k.startsWith(prefix))continue;
          const game=k.slice(prefix.length);
          await cloudDelete("manual_scores",{bowler_name:bowler,league_id:leagueId,date,game});
        }
      }

    }
    return removed;
  }

  async function saveShots(u){
    const prev=shots;
    setShots(u);
    try{await window.storage.set(STORAGE_KEY,JSON.stringify(u));}catch{}
    await syncShotsToCloud(prev,u);
  }
  async function syncSessionsToCloud(prevSessions,nextSessions){
    const prevById=new Map(prevSessions.map(s=>[s.id,s]));
    const nextById=new Map(nextSessions.map(s=>[s.id,s]));
    for(const id of prevById.keys()){
      if(!nextById.has(id))await cloudDelete("sessions",id);
    }
    for(const[id,session]of nextById){
      const prev=prevById.get(id);
      if(!prev||JSON.stringify(prev)!==JSON.stringify(session)){
        await cloudWrite("sessions",sessionToSupabaseRow(session,user?.id,leagueIdsRef.current));
      }
    }
  }
  async function saveSessions(u){
    const prev=sessions;
    setSessions(u);
    try{await window.storage.set(SESSIONS_KEY,JSON.stringify(u));}catch{}
    await syncSessionsToCloud(prev,u);
  }
  async function syncMatchesToCloud(prevMatches,nextMatches){
    const prevById=new Map(prevMatches.map(m=>[m.id,m]));
    const nextById=new Map(nextMatches.map(m=>[m.id,m]));
    for(const id of prevById.keys()){
      if(!nextById.has(id))await cloudDelete("matches",id);
    }
    for(const[id,match]of nextById){
      const prev=prevById.get(id);
      if(!prev||JSON.stringify(prev)!==JSON.stringify(match)){
        const row=matchToSupabaseRow(match,leagueIdsRef.current);
        // Without a real team_id, this write can never succeed — matches
        // RLS requires team_id is not null. Rather than queue a doomed
        // write forever, leave it tracked locally only until the bowler
        // is actually set up as a team member.
        if(row.team_id)await cloudWrite("matches",row);
      }
    }
  }
  async function saveMatches(u){
    const prev=matches;
    setMatches(u);
    try{await window.storage.set(MATCHES_KEY,JSON.stringify(u));}catch{}
    await syncMatchesToCloud(prev,u);
  }

  // Matches are keyed by teamId (not league) so two teams in the same
  // league on the same date don't collide into one shared record. league is
  // still carried on each record for the stats-reading side (seasonRecord,
  // weeklyPointsData, handicapMatches), which filter by league and don't
  // need to change.
  function getMatch(teamId,date,league){
    const byTeam=matches.find(m=>m.teamId===teamId&&m.date===date);
    if(byTeam)return byTeam;
    // Falls back to league+date when the team_id-based lookup finds
    // nothing — this happens when a bowler's team-membership resolution
    // has changed since the match was originally saved (not yet a real
    // team member when first logged, but resolves differently now), so
    // today's teamId no longer matches what's actually stored on the old
    // record even though it's the same match.
    if(league)return matches.find(m=>m.league===league&&m.date===date);
    return null;
  }

  // Lane condition (oil pattern) for a specific lane on a specific night —
  // defaults to House Shot implicitly (no record needed) until the user
  // actively records an official pattern for that lane. Lookup stays
  // league+date+lane based (unaffected by team resolution) since a lane's
  // physical condition isn't inherently team-specific — teamId is only
  // attached at creation time, for the Supabase row's RLS/ownership.
  function getLanePattern(league,date,lane){
    return lanePatterns.find(p=>p.league===league&&p.date===date&&String(p.lane)===String(lane));
  }
  function setLanePattern(teamId,league,date,lane,updates){
    const existing=getLanePattern(league,date,lane);
    const prevPatterns=lanePatterns;
    const updatedPatterns=existing
      ?lanePatterns.map(p=>p===existing?{...p,...updates}:p)
      :[...lanePatterns,{id:crypto.randomUUID(),teamId,league,date,lane:String(lane),patternType:"house",patternName:"",length:"",volume:"",ratio:"",...updates}];

    setLanePatterns(updatedPatterns);
    try{window.storage.set(LANE_PATTERNS_KEY,JSON.stringify(updatedPatterns));}catch{}

    const debounceKey=`${teamId}|${date}|${lane}`;
    clearTimeout(lanePatternSaveTimers.current[debounceKey]);
    lanePatternSaveTimers.current[debounceKey]=setTimeout(()=>{
      syncLanePatternsToCloud(prevPatterns,updatedPatterns);
    },600);
  }
  // Cycles a result through Not Marked → Won → Lost → Not Marked
  function nextResult(cur){ return cur===null?true:cur===true?false:null; }

  async function cycleGameResult(teamId,league,date,gameIdx){
    const existing=getMatch(teamId,date,league);
    if(existing){
      const games=[...existing.games];
      games[gameIdx]=nextResult(games[gameIdx]??null);
      await saveMatches(matches.map(m=>m.id===existing.id?{...m,games}:m));
    } else {
      const games=[null,null,null];
      games[gameIdx]=true;
      await saveMatches([...matches,{id:crypto.randomUUID(),teamId,league,date,games,series:null,opponent:"",handicap:""}]);
    }
  }

  async function cycleSeriesResult(teamId,league,date){
    const existing=getMatch(teamId,date,league);
    if(existing){
      await saveMatches(matches.map(m=>m.id===existing.id?{...m,series:nextResult(existing.series??null)}:m));
    } else {
      await saveMatches([...matches,{id:crypto.randomUUID(),teamId,league,date,games:[null,null,null],series:true,opponent:"",handicap:""}]);
    }
  }

  function updateMatchField(teamId,league,date,field,value){
    const existing=getMatch(teamId,date,league);
    const prevMatches=matches;
    const updatedMatches=existing
      ?matches.map(m=>m.id===existing.id?{...m,[field]:value}:m)
      :[...matches,{id:crypto.randomUUID(),teamId,league,date,games:[null,null,null],series:null,opponent:"",handicap:"",[field]:value}];

    setMatches(updatedMatches);
    try{window.storage.set(MATCHES_KEY,JSON.stringify(updatedMatches));}catch{}

    const debounceKey=`${teamId}|${date}`;
    clearTimeout(matchSaveTimers.current[debounceKey]);
    matchSaveTimers.current[debounceKey]=setTimeout(()=>{
      syncMatchesToCloud(prevMatches,updatedMatches);
    },600);
  }
  function setMatchOpponent(teamId,league,date,opponent){
    updateMatchField(teamId,league,date,"opponent",opponent);
  }
  function setMatchHandicap(teamId,league,date,value){
    updateMatchField(teamId,league,date,"handicap",value);
  }

  // Normalizes legacy per-game handicap arrays (from before this was a single
  // value) down to one number, so old saved data still displays correctly.
  function matchHandicap(m){
    if(!m)return "";
    if(Array.isArray(m.handicap))return m.handicap.find(v=>v!=="" && v!=null) ?? "";
    return m.handicap ?? "";
  }

  // ── Lane calculation ──────────────────────────────────────────────────────
  function calcLane(sl,game,frame,ballNum){
    if(!sl||!game||!frame)return null;
    const start=parseInt(sl),g=parseInt(game),f=parseInt(frame);
    function lat(gsl,fr){
      const gp=gsl%2===0?gsl-1:gsl+1;
      if(fr<=9)return fr%2===1?gsl:gp;
      // frame 10: same lane as frame 10 ball 1
      return 10%2===0?gp:gsl;
    }
    let gs=start;
    for(let gn=1;gn<g;gn++)gs=lat(gs,10);
    // For frame 10 ball 2 and 3, lane = same as ball 1 (frame 10)
    // calcLane for frame 10 always returns the frame 10 lane
    return lat(gs,f);
  }

  function handleBallChange(newBall){
    // Tapping the selected ball again clears it. Every other chip in the
    // app toggles; this one only ever set, so a mis-tap on the wrong ball
    // couldn't be undone without picking a different wrong one.
    if(form.ball===newBall){
      setForm(f=>({...f,ball:"",startingBoard:"",targetArrows:""}));
      return;
    }
    const lane=calcLane(startingLane,form.game,form.frame);
    const stored=activeBowler?ballLaneLines[activeBowler]?.[newBall]?.[lane]:null;
    setForm(f=>({...f,ball:newBall,startingBoard:stored?.startingBoard||"",targetArrows:stored?.targetArrows||""}));
  }

  function handleLineChange(field,val){
    setForm(f=>{
      const lane=calcLane(startingLane,f.game,f.frame);
      if(f.ball&&lane&&activeBowler&&!editingId){
        setBallLaneLines(prev=>{
          const updated={
            ...prev,
            [activeBowler]:{
              ...(prev[activeBowler]||{}),
              [f.ball]:{...(prev[activeBowler]?.[f.ball]||{}),[lane]:{startingBoard:field==="startingBoard"?val:f.startingBoard,targetArrows:field==="targetArrows"?val:f.targetArrows}}
            }
          };
          try{window.localStorage.setItem("bowling-ball-lane-lines-v1",JSON.stringify(updated));}catch{}
          return updated;
        });
      }
      return{...f,[field]:val};
    });
  }

  function handleSpareMadeToggle(val){
    setForm(f=>{
      const newVal=f.spareMade===val?"":val;
      let pc=f.pinCount;
      const isSingle=f.result==="Weak 10"||f.result==="Ringing 10"||standingCount(f.otherLeave)===1;
      if(newVal==="Yes"){
        // A made spare puts all ten down -- but only once we know what was
        // standing. With "Other Leave" and no pins ticked there is no leave
        // to convert, and writing "10" here satisfied needsPins' count
        // escape hatch, which unlocked Save and filed a frame as "10 spare"
        // -- ten down on the first ball is a strike, not a spare, so the
        // frame was unscoreable. Leaving the count empty keeps needsPins
        // true and the save blocked.
        pc=(f.result==="Other Leave"&&standingCount(f.otherLeave)===0)?"":"10";
      } else if(newVal==="No"&&isSingle){
        const fb=f.result==="Other Leave"?Math.max(0,10-standingCount(f.otherLeave)):9;
        pc=String(fb);
      }
      return{...f,spareMade:newVal,pinCount:pc};
    });
  }

  function set(field,val){setForm(f=>({...f,[field]:val}));}
  function toggle(field,val){setForm(f=>({...f,[field]:f[field]===val?"":val}));}
  function toggleMulti(field,val){
    setForm(f=>{
      const arr=Array.isArray(f[field])?f[field]:[];
      return{...f,[field]:arr.includes(val)?arr.filter(x=>x!==val):[...arr,val]};
    });
  }

  // Standing pins (excluding 9 Pin No-Tap)
  function standingCount(leave){return(Array.isArray(leave)?leave:[]).filter(p=>p!=="9 Pin No-Tap").length;}

  function handleLeaveToggle(pin){
    setForm(f=>{
      const arr=Array.isArray(f.otherLeave)?f.otherLeave:[];
      const newLeave=arr.includes(pin)?arr.filter(x=>x!==pin):[...arr,pin];
      const standing=newLeave.filter(p=>p!=="9 Pin No-Tap").length;
      const fb=Math.max(0,10-standing);
      return{...f,otherLeave:newLeave,pinCount:String(fb),spareMade:""};
    });
  }

  const standingPins=standingCount(form.otherLeave);
  const firstBallPins=form.result==="Other Leave"?Math.max(0,10-standingPins):null;
  const maxPinCount=firstBallPins!==null?firstBallPins+Math.max(0,standingPins-1):9;
  const minPinCount=firstBallPins!==null?firstBallPins:0;
  const isSinglePin=standingPins===1;
  // Declared here, above its first use.
  //
  // It used to sit ~280 lines further down, which was fine until the
  // no-tap check below started reading it -- const is not hoisted, so
  // the app crashed on mount with "Cannot access before
  // initialization". Nothing here depends on anything local, so it is
  // safe this high.
  const effectiveSessionLeague=
    preferences.environment==="practice"?PRACTICE_SESSION_KEY:
    preferences.environment==="casual"?CASUAL_SESSION_KEY:
    // A tournament gets its own container league, named for the event.
    //
    // Shots have to belong to a league -- every stat, filter and history
    // view keys off one -- and without this they saved with an empty
    // league in tournament mode, orphaned from everything. One container
    // per event rather than one for all tournaments, because the pattern
    // you shot 172 on at the City Open is the thing worth knowing before
    // you bowl it again.
    //
    // Falls back to the plain key until the tournament has a name, so a
    // shot logged before the bowler types one is not lost.
    preferences.environment==="tournament"
      ?(activeTournament?.name
          ?tournamentLeagueCloudName(activeTournament.name,user?.id||"")
          :TOURNAMENT_SESSION_KEY)
      :sessionLeague;

  // Who and when the CURRENT night belongs to.
  //
  // WHO can vary per shot -- a bowler keeps score for a teammate, so
  // form.bowler is meaningful and leads. This is what fixed the summary
  // reading "reverett290" while the shots were filed under "Ryan".
  //
  // WHERE and WHEN cannot. They are properties of the session, and the
  // session knows them: submitShot writes exactly these values. Letting
  // form lead meant a stale form.league survived the switch out of a
  // tournament, so league night showed the tournament's session, scores
  // and recap -- "Tournament·Tourny 5·<uuid>" under a League header.
  //
  // form is the fallback, not the authority, for those two.
  const nightBowler=form.bowler||activeBowler;
  // NO fallback to the form.
  //
  // With no league chosen, effectiveSessionLeague is blank and falling
  // back handed the stale tournament container straight through -- so a
  // bowler who had picked no league at all still saw the tournament's
  // session, scores and recap.
  //
  // Blank is the correct answer here. It means "no night selected", and
  // every lookup keyed on it should find nothing rather than find
  // somebody else's night.
  const nightLeague=effectiveSessionLeague;
  const nightDate=sessionDate;


  // A no-tap strike, worked out rather than declared.
  //
  // In a 9-pin no-tap league a first ball that leaves ONE pin is a
  // strike. The bowler should not have to tell the app that -- the app
  // knows the league format and can see the leave.
  //
  // This replaces a "9 Pin No-Tap" pseudo-pin the bowler used to tick in
  // the leave list, which was a second thing to remember and put a fake
  // pin in the pin data.
  //
  // First ball only, and one pin only. Nine down across two balls is a
  // spare, and it always was.
  // In a tournament the format lives on the tournament, not on a league
  // the bowler configured -- but tournament shots already sit under a
  // per-event container league, so the detection below needs no special
  // case beyond reading the format from the right place.
  const activeScoringFormat=preferences.environment==="tournament"
    ?activeTournament?.pinFormat
    :leagueFormats?.[effectiveSessionLeague];
  const noTapLeague=isNoTapLeague(activeScoringFormat);
  // A ball thrown at a FULL RACK, which is what no-tap applies to.
  //
  // Frames 1-9: only the first ball. The tenth is different -- a strike
  // or a spare resets the pins, so ball 2 after a strike and ball 3
  // after a strike or spare are also full-rack balls.
  //
  // Treating only ballNum 1 as a fresh rack meant a ringing 10 on the
  // tenth's second ball, after a strike, was offered as a SPARE -- and
  // scored 289 in a nine-pin no-tap game, which cannot happen.
  const isFirstBall=(()=>{
    if(!form.ballNum||Number(form.ballNum)===1)return true;
    if(parseInt(form.frame)!==10)return false;
    const tenth=(shots||[]).filter(sh=>sh
      &&sh.bowler===(form.bowler||activeBowler)
      &&sh.league===effectiveSessionLeague
      &&String(sh.date)===String(sessionDate)
      &&String(sh.game)===String(form.game)
      &&parseInt(sh.frame)===10);
    const ball=n=>tenth.find(sh=>Number(sh.ballNum)===n)||null;
    if(Number(form.ballNum)===2)return isStk(ball(1));
    if(Number(form.ballNum)===3){
      const b1=ball(1),b2=ball(2);
      // Ball 3 faces a full rack after two strikes, or after a spare.
      return isStk(b2)||(!!b1&&!!b2&&b2.spareMade==="Yes");
    }
    return false;
  })();
  const pinsLeft=(form.otherLeave||[]).length;
  const isNoTap=noTapLeague&&isFirstBall&&form.result!=="Strike"&&(
    // A named corner-pin leave is one pin by definition; anything else
    // has to actually have one pin ticked.
    form.result==="Weak 10"||form.result==="Ringing 10"
      ?true
      :(form.result==="Other Leave"&&pinsLeft===1)
  );

  const isStrike=form.result==="Strike";
  const hasLeave=form.result&&!isStrike&&!isNoTap;
  // A blank Spare Made isn't a safe "no" — the scoring engine treats it
  // exactly like an explicit "No" (a full miss on the second ball), which
  // can silently produce a wrong score if the question just never got
  // answered. 10th-frame ball 3 is the one case that never asks (it's the
  // last delivery, nothing left to convert).
  const needsSpareMade=hasLeave&&!(parseInt(form.frame)===10&&form.ballNum===3)&&!form.spareMade;

  // "Other Leave" with nothing ticked is not a frame.
  //
  // The app let it save and moved on, so the frame existed with no pins
  // and no count -- unscoreable, and a permanent blank in the scoresheet
  // that nothing flagged. Weak 10 and Ringing 10 name their own pin, so
  // only the open-ended option needs this.
  //
  // The 10th's third ball is exempt for the same reason it skips Spare
  // Made: it is a fill ball, not a leave.
  //
  // The pin COUNT used to satisfy this too ("...or enter how many you
  // knocked down"), but the only control that sets a count is the stepper
  // behind showPinCount, which itself requires standingPins > 0 -- so with
  // an empty leave that path was unreachable by hand. The only thing that
  // ever filled it was handleSpareMadeToggle writing "10" for a made
  // spare, which is precisely the sequence this is meant to stop. Keying
  // solely on ticked pins closes that door without removing any way in.
  const needsPins=form.result==="Other Leave"
    &&!(parseInt(form.frame)===10&&Number(form.ballNum)===3)
    &&!(form.otherLeave||[]).length;

  // Spare Made cannot be answered before the leave is described.
  //
  // "Other Leave" names no pins of its own, so until one is ticked there
  // is nothing to convert and the Yes/No question is unanswerable. Weak 10
  // and Ringing 10 name their pin by definition and still ask immediately.
  const leaveDescribed=form.result!=="Other Leave"
    ||(form.otherLeave||[]).length>0;


  // Measures the fixed Save Shot footer so the page can reserve space for
  // it. Previously keyed only on `view`, which meant the effect never
  // re-ran when the footer appeared, vanished, or grew -- switching into
  // Practice doesn't change `view`, so the observer was often never
  // attached at all and the spacer kept a stale height. The Notes card,
  // being last, ended up underneath the footer.
  //
  // Depends on everything that changes whether the footer renders or how
  // tall it is, and reserves the default when it isn't rendered at all.
  useEffect(()=>{
    let raf=0,ro=null,cancelled=false;
    const attach=()=>{
      if(cancelled)return;
      const el=footerRef.current;
      if(!el){
        // The footer has not rendered yet.
        //
        // This used to set 0 and return, which left no observer and no
        // retry -- so the spacer stayed at zero and the last cards sat
        // under the sticky bar until something else changed a dependency
        // and re-ran the effect. That is why it came right as soon as you
        // tapped anything, and only then.
        //
        // Waiting a frame and looking again costs nothing and fixes the
        // first paint, which is the one every bowler sees.
        raf=requestAnimationFrame(attach);
        return;
      }
      const measure=()=>setFooterHeight(el.offsetHeight);
      measure();
      if(typeof ResizeObserver==="undefined")return;
      ro=new ResizeObserver(measure);
      ro.observe(el);
    };
    attach();
    return()=>{cancelled=true;cancelAnimationFrame(raf);if(ro)ro.disconnect();};
  },[view,preferences.trackingMode,preferences.environment,practiceMode,editingId,needsSpareMade]);
  const showPinCount=hasLeave&&form.spareMade==="No"&&!isSinglePin&&standingPins>0;

  function stepPinCount(delta){
    setForm(f=>{
      const cur=f.pinCount!==""?parseInt(f.pinCount):minPinCount;
      const next=Math.max(minPinCount,Math.min(maxPinCount,cur+delta));
      return{...f,pinCount:String(next)};
    });
  }

  // ── Submit shot ───────────────────────────────────────────────────────────
  // True when the shot being logged belongs to a local-only guest.
  function shotIsGuest(bowlerName){
    return (guestsRef.current||[]).includes(bowlerName);
  }

  async function submitShot(){
    if(!form.result||!form.bowler)return;

    // Declared HERE, in submitShot.
    //
    // The previous version referenced `league` and `date` without
    // declaring them in this function -- they resolved to identically
    // named consts inside previousShotBall(), several hundred lines
    // away, which is a different shot entirely. No error, no warning:
    // just every saved shot carrying the wrong league.
    //
    // Editing keeps the shot's own league and date; a new shot takes the
    // session's. form.league is not trusted for a new shot because it is
    // only refreshed when the bowler changes, so entering a tournament
    // with a bowler already selected leaves it stale.
    const shotLeague=editingId?form.league:effectiveSessionLeague;
    const shotDate=editingId?form.date:sessionDate;

    // Frames 1-9 carry NO ball number. The 10th does.
    //
    // That is the shape the scoring engine reads: strictPartial finds
    // frames 1-9 with `!s.ballNum`, so a 1 sitting on frame 3 makes the
    // whole game invisible -- no score, no series, nothing filling in.
    //
    // The form is not trusted for this. It holds a ball number from
    // whatever the bowler last did, and nothing cleared it on the way
    // back from the tenth. Normalising here means the record is right
    // regardless of what the form was carrying.
    // The tenth's ball number, healed against what is already there.
    //
    // Diagnostics showed a tenth holding a single shot numbered BALL 2,
    // with no ball 1 -- so the frame could never close, and the game
    // scored 210 instead of 259 because the scorer had no first ball to
    // read.
    //
    // nextState returns ball 1 correctly on entering the tenth, so the
    // form had drifted. Rather than trust it: the first shot in a tenth
    // IS ball 1, the second is ball 2, the third is ball 3. Numbering by
    // what exists cannot drift.
    const shotBallNum=(()=>{
      if(parseInt(form.frame)!==10)return null;
      if(editingId)return Number(form.ballNum)||1;
      const already=shots.filter(sh=>sh
        &&sh.bowler===form.bowler&&sh.league===shotLeague&&sh.date===shotDate
        &&String(sh.game)===String(form.game)&&parseInt(sh.frame)===10).length;
      // An EMPTY tenth always gets ball 1. That is the only case that
      // was wrong: diagnostics showed a tenth whose only shot was
      // numbered 2, so the frame had no first ball and could never
      // close.
      //
      // Once there IS a first ball, the form's number is trusted --
      // nextState knows the tenth's sequence better than a count does.
      // A spare on the first ball earns a FILL ball, which is ball 3,
      // not ball 2; forcing sequential numbering renumbered it to 2 and
      // broke the frame a different way.
      if(!already)return 1;
      const asked=Number(form.ballNum)||0;
      return (asked>=1&&asked<=3)?asked:Math.min(3,already+1);
    })();


    // A no-tap strike is stored as the LEAVE, with noTap: true -- not as
    // result "Strike".
    //
    // It used to store "Strike", which meant every stat counting
    // result === "Strike" swallowed it: strike percentage, carry rate and
    // the 300 badge all inflated by shots that left a pin standing. One
    // is inherently easier than the other and pooling them makes both
    // numbers meaningless.
    //
    // Stored this way, scoring still treats it as a strike (isStk reads
    // the flag), strike stats exclude it for free, and carry stats keyed
    // on Weak 10 / Ringing 10 pick it up unchanged -- which is right,
    // because how the ball drove through the rack is the same
    // information either way.
    const effectiveResult=form.result;
    const noTapFlag=isNoTap?true:undefined;

    const autoLane=calcLane(startingLane,form.game,form.frame,form.ballNum);

    if(editingId){
      const shotData={...form,ballNum:shotBallNum,result:effectiveResult,noTap:noTapFlag,_displayResult:form.result,_displayLeave:[...(form.otherLeave||[])]};
      let updated=shots.map(s=>s.id===editingId?{...shotData,id:editingId}:s);

      // Drop a fill ball the edit just un-earned.
      //
      // Three strikes in the 10th, then ball 1 edited to an open: ball 3
      // was still there, giving "9 miss, strike" -- a frame that cannot
      // happen and a score to match. The entry path never allowed it,
      // because it asks ball by ball; only editing could produce it.
      //
      // Ball 2 goes too when ball 1 stops being a strike and no spare
      // follows, for the same reason: the frame is over after two balls
      // and the second one is now the last.
      if(parseInt(shotData.frame)===10){
        const mine=s=>s.bowler===shotData.bowler&&s.league===shotData.league
          &&s.date===shotData.date&&String(s.game)===String(shotData.game)
          &&parseInt(s.frame)===10;
        const b1=updated.find(s=>mine(s)&&(!s.ballNum||Number(s.ballNum)===1))||null;
        const b2=updated.find(s=>mine(s)&&Number(s.ballNum)===2)||null;
        if(!tenthBall3Earned(b1,b2)){
          const stale=updated.filter(s=>mine(s)&&Number(s.ballNum)===3);
          if(stale.length){
            updated=updated.filter(s=>!(mine(s)&&Number(s.ballNum)===3));
            for(const sh of stale)await cloudDelete("shots",sh.id);
          }
        }
      }

      await saveShots(updated);
      setEditingId(null);
      // Return to wherever the user was actively logging before they jumped
      // into edit mode, instead of resetting all the way back to Frame 1.
      setForm(preEditForm||emptyShot());
      setPreEditForm(null);
    } else {
      // A "slot" is uniquely identified by bowler+league+date+game+frame+ballNum.
      // If one somehow already exists (e.g. a stale ball selector re-offering an
      // already-played 10th-frame ball), overwrite it rather than adding a
      // second shot for the same slot — a duplicate would corrupt frame lookups
      // in strictPartial, which expects exactly one shot per slot.
      const existingSlot=findExistingShotSlot(shots,{...form,league:shotLeague,date:shotDate,ballNum:shotBallNum});
      const toSave={
        ...form,
        // league and date EXPLICITLY, after the spread.
        //
        // ...form carried form.league, which is only refreshed when the
        // bowler changes -- so entering a tournament with a bowler
        // already selected saved every shot under whatever league was
        // there before, usually blank. The computed values above were
        // right and simply never reached the record.
        //
        // This is why frame-tracked scores never appeared: the shots
        // existed, under a league nothing was looking for.
        league:shotLeague,
        date:shotDate,
        ballNum:shotBallNum,
        id:existingSlot?existingSlot.id:crypto.randomUUID(),

        // Stamped at log time so it survives the guest being removed from
        // the list later -- the promise was that their scores stay on this
        // device, and that has to hold permanently.
        localOnly:shotIsGuest(form.bowler)||undefined,
        result:effectiveResult,
        noTap:noTapFlag,
        _displayResult:form.result,
        _displayLeave:[...(form.otherLeave||[])],
        lane:autoLane?String(autoLane):form.lane,
      };
      const updated=existingSlot?shots.map(s=>s.id===existingSlot.id?toSave:s):[...shots,toSave];
      await saveShots(updated);

      // Determine next frame/game/ballNum
      // shotLeague/shotDate, not form.league/form.date.
      //
      // This is what made Save Shot look dead. The shot saved fine, but
      // nextState then searched for it under the stale form values,
      // found nothing, and returned "game 1, frame 1" -- so the form
      // reset to the start of the game instead of advancing. Nothing
      // visibly happened, and the next shot overwrote frame 1.
      const{game:ng,frame:nf,ballNum:nb}=nextState(updated,form.bowler,shotLeague,shotDate,form.game,form.frame,form.ballNum);


      // Auto-fill line for next shot
      let line={startingBoard:"",targetArrows:""};
      if(nb===null){
        // New frame — auto-fill from stored lines
        line=autoFillLine(form.ball,ng,nf);
      } else {
        // Frame 10 ball 2/3 — same lane, keep current line
        line={startingBoard:form.startingBoard,targetArrows:form.targetArrows};
      }

      setForm({
        ...emptyShot(),
        bowler:form.bowler,
        // The league this shot was actually filed under, so the next one
        // starts from the same place rather than the stale value.
        league:shotLeague,
        date:shotDate,
        game:ng,
        frame:nf,
        ballNum:nb,
        ball:form.ball,
        surface:form.surface,
        startingBoard:line.startingBoard,
        targetArrows:line.targetArrows,
        // Shoes carry too.
        //
        // Heel and sole are a setting on the shoe, not a property of the
        // shot -- a bowler changes them when the approach is sticky or
        // slick, maybe once a night, and then bowls thirty more shots.
        // Clearing them every shot meant retyping the same two numbers
        // all night or, far more likely, not bothering, which is how the
        // field ends up empty on every shot but the first.
        //
        // Same reasoning as ball, surface and line above, which already
        // carried for exactly this reason.
        heelNumber:form.heelNumber,
        soleNumber:form.soleNumber,
      });
    }
    setSaved(true);
    setTimeout(()=>setSaved(false),1500);
  }

  function startEdit(shot){
    if(!editingId) setPreEditForm(form);
    setForm({...shot,result:shot._displayResult||shot.result,otherLeave:shot._displayLeave||shot.otherLeave||[]});
    setEditingId(shot.id);
    setView("log");
    window.scrollTo(0,0);
  }

  function cancelEdit(){
    setEditingId(null);
    setForm(preEditForm||emptyShot());
    setPreEditForm(null);
  }

  // Deleting the FIRST ball of the 10th takes the whole frame.
  //
  // Removing just that row left balls 2 and 3 behind, and the scoresheet
  // reads whatever is first as ball 1 -- so deleting a strike from
  // "X, 9 spare" promoted the 9 to the first ball and invented a frame
  // the bowler never bowled.
  //
  // Balls 2 and 3 only exist because ball 1 earned them. Take away what
  // earned them and they are not a partial frame, they are orphans.
  //
  // Deleting ball 2 or 3 on its own is left alone: that is a bowler
  // correcting the back half of a frame they did bowl.
  async function deleteShot(id){
    const target=shots.find(s=>s.id===id);
    if(!target)return;

    const isFirstOfTenth=parseInt(target.frame)===10
      &&(!target.ballNum||Number(target.ballNum)===1);
    if(!isFirstOfTenth){
      await saveShots(shots.filter(s=>s.id!==id));
      return;
    }

    const sameFrame=s=>s&&s.bowler===target.bowler&&s.league===target.league
      &&s.date===target.date&&String(s.game)===String(target.game)
      &&parseInt(s.frame)===10;
    const doomed=shots.filter(sameFrame);
    await saveShots(shots.filter(s=>!sameFrame(s)));
    // saveShots diffs and issues its own cloud deletes, so the rows go
    // with it -- no separate cloudDelete needed here.
    void doomed;
  }


  async function clearAllData(){
    await saveShots([]);
    await saveSessions([]);
    await saveMatches([]);
    await saveLanePatterns([]);
    setForm({...emptyShot(),bowler:activeBowler});
    setEditingId(null);
    setSessionLeague("");
    setStartingLane("");
    setBallLaneLines({});
    try{window.localStorage.removeItem("bowling-ball-lane-lines-v1");}catch{}
  }

  function exportData(){
    return JSON.stringify({
      exportedAt:new Date().toISOString(),
      version:2,
      shots,sessions,bowlers,arsenals,matches,ballLaneLines,lanePatterns,leagues,
    },null,2);
  }

  async function importData(jsonText){
    const data=JSON.parse(jsonText); // let this throw — caller shows the error
    if(!data||typeof data!=="object")throw new Error("Not a valid backup file");
    const newShots=Array.isArray(data.shots)?data.shots:[];
    const newSessions=Array.isArray(data.sessions)?data.sessions:[];
    const newBowlers=Array.isArray(data.bowlers)?data.bowlers:[];
    const newArsenals=(data.arsenals&&typeof data.arsenals==="object")?data.arsenals:{};
    const newMatches=Array.isArray(data.matches)?data.matches:[];
    const newBallLaneLines=(data.ballLaneLines&&typeof data.ballLaneLines==="object")?data.ballLaneLines:{};
    const newLanePatterns=Array.isArray(data.lanePatterns)?data.lanePatterns:[];
    const discoveredLeagues=[
      ...(Array.isArray(data.leagues)?data.leagues:[]),
      ...newShots.map(s=>s.league),
      ...newSessions.map(s=>s.league),
      ...newMatches.map(m=>m.league),
      ...newLanePatterns.map(p=>p.league),
    ].filter(Boolean);
    const importedLeagues=[...new Set(discoveredLeagues.map(String).map(s=>s.trim()).filter(Boolean))];
    const migratedShots=migrateShots(newShots);
    await saveShots(migratedShots);
    await saveSessions(migrateSessions(newSessions));
    await saveBowlers(newBowlers);
    await saveArsenals(newArsenals);
    await saveMatches(newMatches);
    await saveLanePatterns(newLanePatterns);
    const finalLeagues=importedLeagues.length?importedLeagues:DEFAULT_LEAGUES;
    await saveLeagues(finalLeagues);
    const failedLeagues=await ensureLeaguesInCloud(finalLeagues);
    if(failedLeagues.length){
      alert(`These leagues were restored on this device only and haven't reached the cloud yet: ${failedLeagues.join(", ")}. They'll keep retrying in the background if you're offline.`);
    }
    setBallLaneLines(newBallLaneLines);
    try{window.localStorage.setItem("bowling-ball-lane-lines-v1",JSON.stringify(newBallLaneLines));}catch{}
    if(newBowlers.length)setActiveBowler(newBowlers[0]);
  }

  // ── Score helpers ─────────────────────────────────────────────────────────

  // Strict running score: only frames with fully resolved bonus balls

  function getGameStrict(bowler,league,date,game){
    // String() on BOTH sides of every comparison.
    //
    // s.game===String(game) failed for a shot whose game is the number 1
    // -- 1 === "1" is false. The scoresheet compares String to String
    // and matched, so it drew a full game while this returned nothing:
    // the series summary blank next to a scoresheet showing 211.
    const gs=shots.filter(s=>s.bowler===bowler&&s.league===league
      &&String(s.date)===String(date)&&String(s.game)===String(game));
    // A manually-entered score wins over the shot-derived one. Every score
    // path in the app funnels through here, so overriding at this single
    // point covers live scores, session totals, averages, and stats alike.
    return resolveGameScore(manualScores,bowler,league,date,game,strictPartial(gs));
  }

  function updateManualScore(bowler,league,date,game,value){
    // Built from a ref, not from the `manualScores` closure value.
    //
    // The scorecard import writes three games in one tick. Reading the
    // closure meant all three started from the same snapshot, so games 1
    // and 2 were overwritten by game 3 and imported as blank. A human
    // typing one score at a time never hit it, because each tap was its
    // own render.
    //
    // A ref rather than a functional setState updater because the lines
    // below need the new value NOW -- to persist it and to queue the
    // cloud write. React runs an updater during the next render, not
    // during the call, so reading it back from there would be null.
    const updated=setManualScoreIn(manualScoresRef.current,bowler,league,date,game,value);
    manualScoresRef.current=updated;
    setManualScores(updated);
    try{window.storage.set(MANUAL_SCORES_KEY,JSON.stringify(updated));}catch{}

    const leagueId=leagueIdsRef.current[league];
    if(!leagueId)return;
    clearTimeout(pokerSaveTimers.current[`manual|${bowler}|${date}|${game}`]);
    pokerSaveTimers.current[`manual|${bowler}|${date}|${game}`]=setTimeout(()=>{
      // Only delete a score that WAS there.
      //
      // Clearing a box that was already empty issued a delete matching no
      // rows -- a "write-noop, matched 0 rows" in diagnostics for every
      // empty box touched, three at a time on an import. Harmless, and it
      // buries the noops that mean something.
      const had=getManualScore(manualScores,bowler,league,date,game);
      const score=getManualScore(updated,bowler,league,date,game);
      if(score===null&&had!==null){
        cloudDelete("manual_scores",{bowler_name:bowler,league_id:leagueId,date,game});
      }
      // Same: keyed by the natural (user, bowler, league, date, game)
      // tuple, so correcting a typed score updates instead of colliding.
      else cloudWrite("manual_scores",manualScoreToRow(bowler,leagueId,date,game,score,user?.id||null,
        getGameEquipment(gameEquipmentRef.current,bowler,league,date,game)),{onConflict:"user_id,bowler_name,league_id,date,game"});
    },600);
  }

  // Ball/surface for a games-only practice game. Rides on the same
  // manual_scores row; if there's no score yet the row is created with
  // the equipment and a null score, and the score fills in later.
  function updateGameEquipment(bowler,league,date,game,patch){
    const updated=setGameEquipmentIn(gameEquipmentRef.current,bowler,league,date,game,patch);
    gameEquipmentRef.current=updated;
    setGameEquipment(updated);
    try{window.storage.set(GAME_EQUIPMENT_KEY,JSON.stringify(updated));}catch{}
    const leagueId=leagueIdsRef.current[league];
    if(!leagueId)return;
    const score=getManualScore(manualScoresRef.current,bowler,league,date,game);
    cloudWrite("manual_scores",manualScoreToRow(bowler,leagueId,date,game,score,user?.id||null,
      getGameEquipment(updated,bowler,league,date,game)),{onConflict:"user_id,bowler_name,league_id,date,game"});
  }

  function getSessionTotal(){
    // Guard on the SAME identity the line below computes with.
    //
    // sessionLeague is blank in practice, open bowling and tournaments --
    // they bowl under a container league -- so this returned null before
    // computing anything. The series sat empty next to a G1 box showing
    // 246, because the guard and the computation disagreed about which
    // night this is.
    if(!nightLeague||!nightBowler)return null;

    const scores=[1,2,3].map(g=>getGameStrict(nightBowler,nightLeague,nightDate,g));
    const valid=scores.filter(s=>s!=null);
    return valid.length?valid.reduce((a,b)=>a+b,0):null;
  }


  async function submitSession(){
    // effectiveSessionLeague, not sessionLeague. Practice and casual have
    // no league to pick, so sessionLeague is "" there and this returned
    // immediately -- meaning neither environment could ever end a
    // session or produce a summary, however the button was wired.
    if(!effectiveSessionLeague||!activeBowler)return;
    // Every game bowled, not the first three.
    //
    // [1,2,3] is a league assumption, and it was silently dropping games
    // four and five from a tournament block or a long practice -- the
    // shots were saved, but the session that summarises them stopped at
    // three, so the series and average were wrong for those nights.
    //
    // gameScores is already sized to the night.
    const scores=gameScores.map((_,idx)=>idx+1).map(g=>getGameStrict(nightBowler,nightLeague,nightDate,g)).filter(s=>s!=null);
    if(!scores.length){
      // Previously silently did nothing here — no feedback at all, even
      // though this is a common, valid state (e.g. only the match points
      // have been entered so far, no shots logged yet for this night).
      // Says so plainly instead of leaving the tap looking like it failed.
      setSessionSaveMessage("No shots logged yet for this night");
      setTimeout(()=>setSessionSaveMessage(null),2000);
      return;
    }
    const ss=shots.filter(s=>s.bowler===activeBowler&&s.league===effectiveSessionLeague&&s.date===sessionDate);
    // A session is uniquely identified by bowler+league+date. If one already
    // exists (e.g. a double-tap on Save), update it in place rather than
    // adding a duplicate — a duplicate would silently double-count this
    // night in every average, the leaderboard, and the season record.
    const existing=sessions.find(s=>s.bowler===activeBowler&&s.league===effectiveSessionLeague&&s.date===sessionDate);
    const session={
      id:existing?existing.id:crypto.randomUUID(),bowler:activeBowler,teamId:ss[0]?.teamId||"",league:effectiveSessionLeague,date:sessionDate,scores,
      notes:sessionNotes||existing?.notes||"",
      total:scores.reduce((a,b)=>a+b,0),
      average:Math.round(scores.reduce((a,b)=>a+b,0)/scores.length),
      pokerQuarter:existing?.pokerQuarter||[0,0,0],
      pokerDollar:existing?.pokerDollar||[0,0,0],
      threeSixNineWinnings:existing?.threeSixNineWinnings||0,
      jackpotWinnings:existing?.jackpotWinnings||0,
      highGameWinnings:existing?.highGameWinnings||[0,0,0],
      pokerQuarterCost:existing?.pokerQuarterCost||[0,0,0],
      pokerDollarCost:existing?.pokerDollarCost||[0,0,0],
      highGameCost:existing?.highGameCost||[0,0,0],
      threeSixNineCost:existing?.threeSixNineCost||0,
      ...computeSessionStats(ss),
    };
    const updated=existing?sessions.map(s=>s.id===existing.id?session:s):[...sessions,session];
    await saveSessions(updated);

    // Take the bowler TO the results.
    //
    // The button says "End Session & View Summary" and did not view
    // anything: setShowSummary set a flag nothing reads, so the night was
    // saved and the screen did not move. The bowler is left looking at
    // the shot form they have just finished with.
    //
    // Each mode keeps its results in a different place, so the jump has
    // to know which one:
    //
    //   league / practice / open bowling -> the Results tab, where the
    //     recap, the running averages and the share button live.
    //   tournament -> the tournament card's own Results tab, which has
    //     the block totals, the cut line and the money.
    if(preferences.environment==="tournament"){
      setTournamentTab("results");
    } else {
      setLeagueTab("results");
    }
    // Scroll to the top, or the results open below the fold and it still
    // looks as though nothing happened.
    setSessionSaved(true);
    // Back to Home once the night is filed.
    //
    // The tabs above are still set, so returning to Bowl later lands on
    // Results -- but the night is over, and leaving a bowler on the
    // scoring screen invites them to keep logging into a session they
    // just ended.
    //
    // After the confirmation, not instead of it: the button says
    // "Session Saved" for a moment first, so the screen changing is the
    // consequence of something they saw work rather than a jump.
    setTimeout(()=>{
      setSessionSaved(false);
      setView("home");
      try{window.scrollTo({top:0,behavior:"smooth"});}catch{}
    },1500);
  }

  // Updates one game's poker winnings on an already-saved session. Local
  // state updates instantly; the cloud sync is debounced the same way
  // match opponent/handicap and lane pattern fields are, since typing a
  // dollar amount digit-by-digit would otherwise fire a write per
  // keystroke.
  function setPokerWinnings(sessionId,gameIdx,type,amount){
    const prevSessions=sessions;
    const key=type==="quarter"?"pokerQuarter":"pokerDollar";
    const updatedSessions=sessions.map(s=>{
      if(s.id!==sessionId)return s;
      const arr=[...(s[key]||[0,0,0])];
      arr[gameIdx]=amount;
      return{...s,[key]:arr};
    });
    setSessions(updatedSessions);
    try{window.storage.set(SESSIONS_KEY,JSON.stringify(updatedSessions));}catch{}

    const debounceKey=`${sessionId}|${type}`;
    clearTimeout(pokerSaveTimers.current[debounceKey]);
    pokerSaveTimers.current[debounceKey]=setTimeout(()=>{
      syncSessionsToCloud(prevSessions,updatedSessions);
    },600);
  }

  // Generalized per-game money entry, covering High Game Pot winnings plus
  // every buy-in cost array. Same optimistic-then-debounced-sync shape as
  // setPokerWinnings -- factored to one function because these all behave
  // identically and only differ by which field they write.
  // Create the session row if the night does not have one yet.
  //
  // curSession can be DERIVED from frames for a night in progress, and a
  // derived one has no id. Writing money against it matched no row and
  // vanished silently -- the bowler ticks a pot, the number disappears.
  //
  // Buy-ins are owed before the first ball, so this is the normal case
  // for money, not an edge one.
  // The id of a row created THIS tick, so a burst of writes shares one.
  //
  // applyCosts writes every money field in a loop. React has not flushed
  // setSessions between those calls, so each one looked up the stale
  // list, found nothing, and created another row -- one tap producing a
  // handful of duplicate sessions for the same night.
  const pendingSessionIdRef=useRef("");

  // Cleared once the row is really in state, and whenever the night
  // changes. A held id that no longer matches the night on screen would
  // file the next money entry against the wrong session.
  useEffect(()=>{
    const id=pendingSessionIdRef.current;
    if(!id)return;
    const row=sessions.find(s=>s.id===id);
    if(!row||row.bowler!==nightBowler||row.league!==nightLeague||row.date!==nightDate){
      pendingSessionIdRef.current="";
    } else if(sessions.some(s=>s.id===id)){
      pendingSessionIdRef.current="";
    }
  },[sessions,nightBowler,nightLeague,nightDate]);

  function ensureSessionRow(){
    const existing=sessions.find(s=>s.bowler===nightBowler
      &&s.league===nightLeague&&s.date===nightDate);
    if(existing)return existing.id;
    if(pendingSessionIdRef.current)return pendingSessionIdRef.current;
    if(!nightBowler||!nightLeague||!nightDate)return "";
    const row={
      id:crypto.randomUUID(),
      bowler:nightBowler,league:nightLeague,date:nightDate,
      scores:[],total:0,average:0,
      pokerQuarter:[0,0,0],pokerDollar:[0,0,0],
      threeSixNineWinnings:0,jackpotWinnings:0,
      highGameWinnings:[0,0,0],
      pokerQuarterCost:[0,0,0],pokerDollarCost:[0,0,0],
      highGameCost:[0,0,0],threeSixNineCost:0,
    };
    pendingSessionIdRef.current=row.id;
    const next=[...sessions,row];
    setSessions(next);
    try{window.storage.set(SESSIONS_KEY,JSON.stringify(next));}catch{}
    return row.id;
  }

  function setSessionMoneyArray(sessionId,field,gameIdx,amount){
    const id=sessionId||ensureSessionRow();
    if(!id)return;
    const prevSessions=sessions;
    const updatedSessions=(sessions.some(s=>s.id===id)?sessions:[...sessions])
      .map(s=>{
      if(s.id!==id)return s;
      const arr=[...(s[field]||[0,0,0])];
      arr[gameIdx]=amount;
      return{...s,[field]:arr};
    });
    setSessions(updatedSessions);
    try{window.storage.set(SESSIONS_KEY,JSON.stringify(updatedSessions));}catch{}

    const debounceKey=`${sessionId}|${field}|${gameIdx}`;
    clearTimeout(pokerSaveTimers.current[debounceKey]);
    pokerSaveTimers.current[debounceKey]=setTimeout(()=>{
      syncSessionsToCloud(prevSessions,updatedSessions);
    },600);
  }

  // Single-value money entry (3-6-9's session-wide buy-in), as opposed to
  // the per-game arrays above.
  function setSessionMoneyValue(sessionId,field,amount){
    // A night in progress has no session row yet; create it rather
    // than writing into nothing. See ensureSessionRow.
    const ensuredId=sessionId||ensureSessionRow();
    if(!ensuredId)return;
    const prevSessions=sessions;
    const updatedSessions=sessions.map(s=>s.id!==ensuredId?s:{...s,[field]:amount});
    setSessions(updatedSessions);
    try{window.storage.set(SESSIONS_KEY,JSON.stringify(updatedSessions));}catch{}

    const debounceKey=`${sessionId}|${field}`;
    clearTimeout(pokerSaveTimers.current[debounceKey]);
    pokerSaveTimers.current[debounceKey]=setTimeout(()=>{
      syncSessionsToCloud(prevSessions,updatedSessions);
    },600);
  }

  function confirmWinningsSaved(){
    setWinningsSaved(true);
    setTimeout(()=>setWinningsSaved(false),1500);
  }

  // 3-6-9 winnings are a single value per session, not a per-game array
  // like poker -- the win itself is whole-session (all 9 specific strikes
  // across games 1, 2, and 3), not something that happens per individual
  // game. type is "pot" for the regular win or "jackpot" for the bonus.
  function setThreeSixNineWinnings(sessionId,type,amount){
    // A night in progress has no session row yet; create it rather
    // than writing into nothing. See ensureSessionRow.
    const ensuredId=sessionId||ensureSessionRow();
    if(!ensuredId)return;
    const prevSessions=sessions;
    const key=type==="jackpot"?"jackpotWinnings":"threeSixNineWinnings";
    const updatedSessions=sessions.map(s=>s.id!==ensuredId?s:{...s,[key]:amount});
    setSessions(updatedSessions);
    try{window.storage.set(SESSIONS_KEY,JSON.stringify(updatedSessions));}catch{}

    const debounceKey=`${sessionId}|369|${type}`;
    clearTimeout(pokerSaveTimers.current[debounceKey]);
    pokerSaveTimers.current[debounceKey]=setTimeout(()=>{
      syncSessionsToCloud(prevSessions,updatedSessions);
    },600);
  }

  // Longest run of consecutive strikes for a bowler this season. Strikes
  // carry across game boundaries within the same night (e.g. striking out
  // game 1 and opening game 2 with strikes continues the streak), but reset
  // between different nights (league+date), since those aren't consecutive
  // deliveries in real life.
  function longestStrikeStreak(bowler){
    const bowlerShots=bowler?shots.filter(s=>s.bowler===bowler):[];
    const nights={};
    bowlerShots.forEach(s=>{
      const key=`${s.league}|${s.date}`;
      (nights[key]=nights[key]||[]).push(s);
    });
    let best=0;
    Object.values(nights).forEach(nightShots=>{
      const ordered=[...nightShots].sort((a,b)=>{
        const ga=parseInt(a.game),gb=parseInt(b.game);
        if(ga!==gb)return ga-gb;
        const fa=parseInt(a.frame),fb=parseInt(b.frame);
        if(fa!==fb)return fa-fb;
        return(a.ballNum||0)-(b.ballNum||0);
      });
      let run=0;
      ordered.forEach(s=>{
        if(s.result==="Strike"){run++;if(run>best)best=run;}
        else{run=0;}
      });
    });
    return best;
  }

  // Cumulative running-average trend over the season, one point per date.
  // metric: 0/1/2 = that game's score, "weekly" = the night's overall average.
  // bowler==="" pools every bowler together (team); league==="" blends both
  // leagues. On a shared date with multiple bowlers, each date's value is the
  // average ACROSS those bowlers for that night before folding into the
  // running average — this works identically whether there's one bowler
  // (individual trend) or many (team trend).

  // Every match with both a handicap value AND at least one result marked,
  // sorted by handicap ascending — the raw data for "do we do better closer
  // to scratch or with a big handicap" analysis.
  function handicapMatches(league){
    return matches
      .filter(m=>!league||m.league===league)
      .map(m=>{
        const h=parseFloat(matchHandicap(m));
        if(isNaN(h))return null;
        const pointsAvailable=m.games.filter(v=>v!==null).length+(m.series!==null?1:0);
        if(!pointsAvailable)return null;
        const pointsWon=m.games.filter(v=>v===true).length+(m.series===true?1:0);
        return{handicap:h,pointsWon,pointsAvailable,rate:Math.round((pointsWon/pointsAvailable)*100),date:m.date,opponent:m.opponent,league:m.league};
      })
      .filter(Boolean)
      .sort((a,b)=>a.handicap-b.handicap);
  }

  // Splits matches into "smaller handicap" (closer to scratch) vs "larger
  // handicap" halves by median, and compares the points-won rate for each —
  // directly answers whether performance tracks handicap size.
  function handicapSplit(league){
    const data=handicapMatches(league);
    if(data.length<2)return null;
    const mid=Math.ceil(data.length/2);
    const smaller=data.slice(0,mid),larger=data.slice(mid);
    const rateOf=g=>{
      const won=g.reduce((a,m)=>a+m.pointsWon,0),avail=g.reduce((a,m)=>a+m.pointsAvailable,0);
      return avail?Math.round((won/avail)*100):null;
    };
    const avgHandicapOf=g=>Math.round(g.reduce((a,m)=>a+m.handicap,0)/g.length);
    return{
      smaller:{rate:rateOf(smaller),avgHandicap:avgHandicapOf(smaller),count:smaller.length},
      larger:{rate:rateOf(larger),avgHandicap:avgHandicapOf(larger),count:larger.length},
    };
  }

  // Tonight's session row, if one exists yet.
  //
  // Uses effectiveSessionLeague, not sessionLeague: practice and casual
  // have no league to pick, so sessionLeague is "" there and this never
  // matched -- meaning neither environment could ever find its own
  // session.
  // Focus group Finding 3. The rule lives in domain/trackingPrompt.js so
  // it is testable without a render; this only supplies today's inputs.
  const offerShotByShot=shouldOfferShotByShot({
    sessions,bowler:activeBowler,trackingMode:preferences.trackingMode,
    environment:preferences.environment,dismissed:shotPromptDismissed,
  });

  // Focus group Finding 2. The rule lives in domain/teamPrompt.js so it
  // is testable without a render; this supplies today's inputs.
  const promptForTeam=shouldPromptForTeam({
    environment:preferences.environment,league:effectiveSessionLeague,
    teams,sessions,bowler:activeBowler,dismissed:teamPromptDismissed,
  });

  // Moves existing team-less scores onto a newly created or joined team.
  //
  // Local state first, then the cloud: the app should show the change
  // immediately, and a failed cloud write is queued and retried rather
  // than losing it. Each row is updated by id, so a partial failure
  // leaves the rest correct instead of rolling everything back.
  // Scores logged before a team existed join it as soon as one appears.
  //
  // Watching `teams` rather than hooking team CREATION, because a bowler
  // can also arrive at a team by accepting an invite or entering a signup
  // code -- three call sites, one of which runs after a page reload. An
  // effect covers all of them and is idempotent: once the scores carry a
  // teamId, scoresToAdopt returns nothing and this does no work.
  //
  // Focus group Finding 2: a league bowler can log from the moment they
  // add a league and add the team later. That promise is only kept if the
  // nights already in the app become the team's nights -- otherwise "add
  // a team whenever you like" quietly means "start again".
  useEffect(()=>{
    if(!activeBowler||!Array.isArray(teams))return;
    (async()=>{
      for(const t of teams){
        if(t&&t.id&&t.league) await adoptScoresIntoTeam(t.id,t.league);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[teams,activeBowler]);

  async function adoptScoresIntoTeam(teamId,leagueName){

    if(!teamId||!leagueName||!activeBowler)return;

    const shotsToMove=scoresToAdopt(shots,activeBowler,leagueName);
    const sessionsToMove=scoresToAdopt(sessions,activeBowler,leagueName);
    if(!shotsToMove.length&&!sessionsToMove.length)return;

    const movedIds=new Set(shotsToMove.map(x=>x.id));
    const movedSessionIds=new Set(sessionsToMove.map(x=>x.id));
    const nextShots=shots.map(x=>movedIds.has(x.id)?{...x,teamId}:x);
    const nextSessions=sessions.map(x=>movedSessionIds.has(x.id)?{...x,teamId}:x);
    setShots(nextShots); setSessions(nextSessions);
    try{
      await window.storage.set(STORAGE_KEY,JSON.stringify(nextShots));
      await window.storage.set(SESSIONS_KEY,JSON.stringify(nextSessions));
    }catch{}

    // Upsert the WHOLE row, not a partial update of team_id.
    //
    // cloudUpdate matches on id, and a session or shot that has never
    // reached the cloud has no row to match -- so the update changed
    // nothing and reported success. The diagnostics log caught exactly
    // this on a real device: "sessions.update / no-rows / matched 0 rows
    // on id", four times.
    //
    // An upsert updates the row if it is there and inserts it if it is
    // not, which is the right answer either way: a night logged offline
    // should reach the cloud WITH its team already attached.
    const leagueIds=leagueIdsRef.current;
    for(const row of shotsToMove){
      await cloudWrite("shots",shotToSupabaseRow({...row,teamId},user?.id,leagueIds));
    }
    for(const row of sessionsToMove){
      await cloudWrite("sessions",sessionToSupabaseRow({...row,teamId},user?.id,leagueIds));
    }
  }

  // Nights that arrived in a shared link, written back as manual scores.
  //
  // The merge already happened in BadgeCollection -- this takes the whole
  // merged list and writes the rows it does not already have. Kept LOCAL:
  // an imported night is somebody else's record of an evening, and
  // pushing it to the cloud as though this device had scored it would
  // make two sources of truth for one night.
  //
  // See domain/badgeShare.js for why nights travel rather than badges.
  // A shared link, opened.
  //
  // The payload rides in the URL fragment, which never reaches a server --
  // so someone's nights are not sitting in a web log somewhere. Read once
  // on open, then cleared from the address bar so a reload does not
  // re-run it and so the code is not left on screen.
  //
  // Tapping the link IS the import. The paste field on the Badges tab is
  // the fallback for when a link arrives mangled, which group chats do.
  useEffect(()=>{
    let hash="";
    try{ hash=window.location.hash||""; }catch{ return; }
    const m=/^#badges=(.+)$/.exec(hash);
    if(!m)return;
    const payload=decodeShare(m[1]);
    try{ window.history.replaceState(null,"",window.location.pathname+window.location.search); }catch{}
    if(!payload)return;
    setView("badges");
    setPendingBadgeImport(payload);
  },[]);

  async function askGenie(question){
    const summary=statsSummaryForGenie();
    const{data,error}=await supabase.functions.invoke("bowling-genie",{
      body:{question,context:buildGenieContext(summary)},
    });
    // READ THE BODY on a non-2xx.
    //
    // supabase-js reports every non-2xx as the same opaque "Edge Function
    // returned a non-2xx status code" and puts the actual response on
    // error.context. The function already returns a useful { error }
    // message; without this it is discarded, and a Gemini rejection, a
    // rate limit and a bad model name all read identically.
    if(error){
      let detail="";
      let limited=false;
      try{
        const res=error?.context;
        if(res&&typeof res.json==="function"){
          const body=await res.json();
          detail=body?.error||body?.detail||"";
          limited=body?.limited===true;
        }
      }catch{ /* body was not JSON; the status is all we have */ }
      // The SERVER's limit is the real one; make the display agree.
      //
      // Two counters exist: the client counts answers it received, the
      // server counts requests it was sent. A failed request spends a
      // server wish and records nothing on the client, so a day of
      // errors leaves the lamp saying "3 wishes left" while the server
      // says "you've used all three".
      //
      // Believing the server costs a wish that was genuinely spent, and
      // is far better than offering three that do not exist.
      if(limited){
        const today=localDateString();
        setGenieAsked(prev=>{
          const mine=prev.filter(a=>a&&a.date===today);
          if(mine.length>=3)return prev;
          return [...prev,...Array(3-mine.length).fill({date:today})];
        });
      }
      return{error:detail||error.message||"Brooklyn had no answer for that."};
    }

    if(!data?.text){
      // Not recorded: a failure must not spend a wish.
      // RETURN the reason rather than throwing it.
      //
      // Throwing sent this straight to the Genie's catch block, which
      // replaces whatever went wrong with "Couldn't reach Brooklyn. Try
      // again in a moment." So an exhausted Gemini quota, a retired
      // model and a server fault all read as a blip worth retrying --
      // and the one message the code had already worked out was thrown
      // away one line before it could be shown.
      return{error:data?.error||error?.message||"Brooklyn had no answer for that."};
    }
    const today=localDateString();
    setGenieAsked(prev=>[...prev,{date:today}]);
    // The gated payload goes back with the answer so the guard can check
    // whether Brooklyn discussed anything the analysis would withhold.
    // Same withheld list, same standard -- she cannot claim what the
    // Improve tab refuses to.
    return{text:data.text,truncated:!!data.truncated,payload:buildAnalysisPayload(insightStats)};

  }

  // What the genie is told. Computed stats, never raw history -- see
  // domain/genie.js for why that is the whole cost story.
  function statsSummaryForGenie(){
    // visibleSessions/visibleShots throughout -- same reason as
    // insightStats. Brooklyn must not know about a league the bowler
    // is not being shown.
    const mine=visibleSessions.filter(s=>s&&s.bowler===activeBowler);
    const scores=mine.flatMap(s=>Array.isArray(s.scores)?s.scores:[]).filter(v=>Number.isFinite(Number(v))).map(Number);
    const hg=bowlerHighGame(visibleSessions,activeBowler);
    const hs=bowlerHighSeries(visibleSessions,activeBowler);

    // The shot-level figures come from shotBreakdown, the same function
    // the coaching screen uses -- rather than a second implementation
    // that could disagree with what the bowler sees on Stats.
    //
    // The dataflow audit caught this: buildGenieContext read thirteen
    // fields and this supplied five, so the genie was answering from an
    // average and a handedness. The spare and split numbers -- the whole
    // reason to ask it anything -- were never sent.
    // In a BAKER block, only the frames THIS bowler threw.
    //
    // Baker shots are filed under the logging bowler for every frame, so
    // a partner's frames look like the user's own. Frame-level metrics --
    // strike rate, spare conversion, which leaves keep appearing, how a
    // ball carries -- are built on these, and crediting a partner's
    // frames does not merely inflate a number: it teaches the coaching
    // the wrong thing about how someone bowls.
    //
    // Game-level figures are handled the other way round, by excluding
    // Baker sessions entirely (see bowlerHighGame). One score for five
    // frames each is nobody's game; five frames of balls are absolutely
    // somebody's frames.
    const myShots=(()=>{
      const own=visibleShots.filter(s=>s&&s.bowler===activeBowler);
      const bakerLeagues=new Set(
        (tournaments||[]).filter(t=>isBaker(t))
          .map(t=>tournamentLeagueCloudName(t.name,user?.id))
          .filter(Boolean));
      if(!bakerLeagues.size)return own;
      const starterFor=lg=>{
        const t=(tournaments||[]).find(x=>
          tournamentLeagueCloudName(x.name,user?.id)===lg);
        return t?.bakerStarter||"me";
      };
      return own.filter(s=>{
        if(!bakerLeagues.has(s.league))return true;
        return bakerBowlerFor(s.game,parseInt(s.frame,10),starterFor(s.league))==="me";
      });
    })();
    const bd=shotBreakdown(myShots,{
      isSplit,isSinglePinLeave,isCornerPinLeave,leftHanded:!!preferences.leftHanded,
    });

    // Most-used ball, by shots thrown with it.
    const ballCounts={};
    for(const s of myShots) if(s.ball) ballCounts[s.ball]=(ballCounts[s.ball]||0)+1;
    const topBall=Object.entries(ballCounts).sort((a,b)=>b[1]-a[1])[0]?.[0]||null;

    const pctOrNull=v=>(v===null||v===undefined?null:`${v}%`);

    return{
      // The bowler's name is deliberately absent.
      //
      // Nothing reads it since buildGenieContext stopped sending it, and
      // leaving an unused name on the object that gets serialised to a
      // third party is a leak waiting for the next person who adds a
      // field to the payload and copies the shape.
      //
      // If a future feature genuinely needs it, add it back at the point
      // of use rather than carrying it here on the chance.
      // The team the bowler is actually on, not every team in the league.
      teamName:(()=>{
        const mineTeams=(teams||[]).filter(t=>t&&Array.isArray(t.members)
          // Members carry `name` and `userId`; activeBowler is a display
          // name, so match on name and fall back to the signed-in id.
          &&t.members.some(m=>m&&(m.name===activeBowler||(user?.id&&m.userId===user.id))));
        return mineTeams.map(t=>t.name).filter(Boolean).join(", ")||null;
      })(),
      average:scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):null,

      highGame:hg?.value??null,
      highSeries:hs?.value??null,
      gamesLogged:scores.length,
      strikePct:pctOrNull(bd.strikeRate),
      sparePct:pctOrNull(bd.spareRate),
      singlePinPct:pctOrNull(bd.singlePinRate),
      splitPct:pctOrNull(bd.splitRate),
      // Frames that were neither a strike nor a spare, per game.
      opensPerGame:(bd.frames&&scores.length)
        ?Math.round(((bd.frames-(bd.strikeSample*(bd.strikeRate||0)/100)-(bd.spareSample*(bd.spareRate||0)/100))/scores.length)*10)/10
        :null,
      cornerPinPct:pctOrNull(bd.cornerPinRate),

      // WHY the common leaves happen, not just how often.
      //
      // Everything above is a frequency. Asked "why do I keep leaving the
      // ten pin", Brooklyn had nothing causal to reach for and answered
      // with a conversion rate instead -- the nearest question she could
      // actually answer.
      //
      // These compare the shots that left each corner pin against the
      // shots that did not: speed, revs, where it missed, which ball. The
      // contrast is the answer; a single number never is.
      //
      // Corner pins only, because they are what bowlers ask about and
      // because every extra leave is payload the model has to read past.
      leaveCauses:(()=>{
        const corners=preferences.leftHanded?[["7"],["4","7"]]:[["10"],["6","10"]];
        const out={};
        for(const pins of corners){
          const key=pins.join("-");
          const profile=leaveCauseProfile(myShots,pins);
          if(profile.enough&&profile.factors.length){
            out[key]=profile;
          } else if(profile.count>0){
            // Say WHAT WOULD ANSWER IT rather than nothing. An honest
            // "not yet, track this" is worth more than a confident
            // answer to a question that was not asked.
            out[key]={
              enough:false,count:profile.count,need:profile.need,
              missing:missingCauseFields(myShots,pins).map(f=>f.label),
            };
          }
        }
        return Object.keys(out).length?out:null;
      })(),
      topBall,
      arsenal:(arsenals?.[activeBowler]||[]).join(", ")||null,
      leagues:[...new Set(mine.map(s=>s.league).filter(Boolean))].join(", ")||null,
      handedness:preferences.leftHanded?"left-handed":"right-handed",
      byPosition:(()=>{
        const pos=gamePositionAverages(sessions,activeBowler);
        if(!pos||!pos.length)return null;
        return pos.map((v,i)=>`game ${i+1}: ${Math.round(v)}`).join(", ");
      })(),
      timesHung:hungCounts(shots,"")[activeBowler]??null,
      hangAssists:hangAssistCounts(shots,"")[activeBowler]??null,

      // Team AGGREGATES only -- no teammate named, no individual average
      // sent. See domain/genie.js for why that line is drawn here.
      teamHighGame:teamHighGame(sessions,"")?.value??null,
      teamHighSeries:teamHighSeries(sessions,"")?.value??null,
      teamGameAvg:(()=>{const v=teamGameTotalAvg(sessions,"");return v?Math.round(v):null;})(),
      teamPoints:(()=>{
        const w=weeklyPointsData(matches,"");
        if(!Array.isArray(w)||!w.length)return null;
        const won=w.reduce((a,x)=>a+(x?.pointsWon||0),0);
        const avail=w.reduce((a,x)=>a+(x?.pointsAvailable||0),0);
        return avail?`${won} of ${avail}`:null;
      })(),
      recentAverage:(()=>{
        const recent=[...mine].sort((a,b)=>String(b.date).localeCompare(String(a.date))).slice(0,5);
        const v=recent.flatMap(x=>Array.isArray(x.scores)?x.scores:[]).filter(n=>Number.isFinite(Number(n))).map(Number);
        return v.length?Math.round(v.reduce((a,b)=>a+b,0)/v.length):null;
      })(),
      scoreConsistency:(()=>{const c=scoreConsistency(sessions,activeBowler,"");return c?Math.round(c):null;})(),
      bookAverage:normalizeProfile(profiles[activeBowler],activeBowler).bookAverage??null,
      nightsLogged:new Set(mine.map(x=>x.date)).size||null,
      commonLeave:(()=>{
        const counts={};
        for(const sh of myShots){
          const l=Array.isArray(sh.otherLeave)?sh.otherLeave.join("-"):null;
          if(l)counts[l]=(counts[l]||0)+1;
        }
        return Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]?.[0]||null;
      })(),
      tenPinPct:(()=>{
        const att=myShots.filter(x=>x.result==="Weak 10"||x.result==="Ringing 10");
        if(!att.length)return null;
        return Math.round((att.filter(x=>x.spareMade==="Yes").length/att.length)*100)+"%";
      })(),
      // Everything the analysis gets, so Brooklyn is never working from
      // less than the Improve tab already has.
      ballRates:(()=>{
        const by={};
        for(const sh of myShots){
          if(!sh.ball||(sh.ballNum&&sh.ballNum!==1))continue;
          (by[sh.ball]=by[sh.ball]||{n:0,x:0}).n++;
          if(sh.result==="Strike")by[sh.ball].x++;
        }
        const rows=Object.entries(by).filter(([,v])=>v.n>=25)
          .map(([b,v])=>`${b} ${Math.round((v.x/v.n)*100)}% over ${v.n}`);
        return rows.join("; ")||null;
      })(),
      drillRates:(()=>{
        const by={};
        for(const d of drills.filter(x=>x&&x.bowler===activeBowler)){
          const key=d.target==="custom"?(d.customTarget||"custom"):d.target;
          if(!key)continue;
          (by[key]=by[key]||{made:0,att:0});
          by[key].made+=Number(d.made)||0;
          by[key].att+=(Number(d.made)||0)+(Number(d.missed)||0);
        }
        // Same 25-attempt bar the analysis uses, so Brooklyn cannot quote
        // a rate the Improve tab would refuse to claim.
        const rows=Object.entries(by).filter(([,v])=>v.att>=25)
          .map(([t,v])=>`${t} ${Math.round((v.made/v.att)*100)}% over ${v.att}`);
        return rows.join("; ")||null;
      })(),
      centerAverages:(()=>{

        const by={};
        for(const x of mine){
          if(!x.center||!Array.isArray(x.scores))continue;
          const v=x.scores.filter(n=>Number.isFinite(Number(n))).map(Number);
          if(!v.length)continue;
          (by[x.center]=by[x.center]||{n:0,t:0});
          by[x.center].n+=v.length;
          by[x.center].t+=v.reduce((a,b)=>a+b,0);
        }
        const rows=Object.entries(by).filter(([,v])=>v.n>=9)
          .map(([c,v])=>`${c} ${Math.round(v.t/v.n)} over ${v.n}`);
        return rows.join("; ")||null;
      })(),

      teamRecord:(()=>{

        const r=seasonRecord(sessions,"");
        return r?`${r.wins||0}-${r.losses||0}`:null;
      })(),
    };
  }



  async function importCasualNights(merged){


    if(!Array.isArray(merged)||!activeBowler)return;
    let updated=manualScoresRef.current;
    for(const night of merged){
      if(!night||typeof night!=="object")continue;
      const scores=(night.scoresByBowler||{})[activeBowler];
      if(!Array.isArray(scores))continue;
      scores.forEach((value,i)=>{
        if(value==null)return;
        const existing=getManualScore(updated,activeBowler,CASUAL_SESSION_KEY,night.date,i+1);
        if(existing!=null)return;   // never overwrite a score this device kept
        updated=setManualScoreIn(updated,activeBowler,CASUAL_SESSION_KEY,night.date,i+1,value);
      });
    }
    manualScoresRef.current=updated;
    setManualScores(updated);
    try{await window.storage.set(MANUAL_SCORES_KEY,JSON.stringify(updated));}catch{}
  }

  async function dismissTeamPrompt(){


    setTeamPromptDismissed(true);
    try{await window.storage.set(TEAM_PROMPT_KEY,new Date().toISOString());}catch{}
  }

  async function dismissShotPrompt(){
    setShotPromptDismissed(true);
    try{await window.storage.set(SHOT_PROMPT_KEY,new Date().toISOString());}catch{}
  }

  // Accepting switches the mode AND dismisses, so someone who tries it and
  // switches back is not asked a second time -- they have their answer.
  async function tryShotByShot(){
    await dismissShotPrompt();
    updatePreferences(prev=>setTrackingMode(prev,"shot"));
  }

  // Tonight's session -- the saved row, or one derived from the frames.
  //
  // A session ROW is only written by "End session". Everything keyed off
  // curSession therefore showed nothing until the bowler tapped it:
  // the Side games card was blank in the middle of a league night, and
  // the Results tab with it.
  //
  // Money is the sharpest case. Buy-ins are owed the moment the night
  // starts, and the bowler ticks the pots they are in BEFORE bowling --
  // so requiring a finished session to show that card is backwards.
  //
  // computeSessionStats is the same function endSession uses, so the
  // in-progress view and the saved one cannot disagree.
  // Is a night under way? Home shows scoring while it is.
  //
  // Reads SHOTS rather than a session row: a row is only written by
  // "End session", so waiting for one would mean Home never took over
  // during the night it is meant to cover.
  // A night is live until it is ENDED, not merely until it has shots.
  //
  // sessionIsLive reads shots, and ending a session does not delete them
  // -- so Home would have gone back to the scoring screen the moment the
  // bowler returned to it, on a night they had just filed.
  //
  // A saved session row is the record that the night is finished, which
  // is exactly the signal "End session" writes.
  const nightEnded=(sessions||[]).some(x=>x&&x.bowler===nightBowler
    &&x.league===nightLeague&&x.date===nightDate);
  const nightLive=!nightEnded
    &&sessionIsLive(shots,{bowler:nightBowler,league:nightLeague,date:nightDate});

  // Load the note belonging to the night being viewed.
  //
  // Without this, opening a night that already has a note shows an empty
  // box -- and then saving writes that empty over what was there. Keyed
  // on the night, not on every render, so typing is not overwritten
  // mid-word.
  const loadedNoteFor=useRef("");
  useEffect(()=>{
    const key=`${nightBowler}|${nightLeague}|${nightDate}`;
    // Only when the NIGHT changes, not whenever sessions change.
    //
    // sessions is rewritten by every background sync, so depending on it
    // meant a sync landing mid-sentence replaced what the bowler was
    // typing with the stored value.
    if(loadedNoteFor.current===key)return;
    loadedNoteFor.current=key;
    const row=(sessions||[]).find(x=>x&&x.bowler===nightBowler
      &&x.league===nightLeague&&x.date===nightDate);
    setSessionNotes(row?.notes||"");
  },[nightBowler,nightLeague,nightDate,sessions]);

  const curSession=(()=>{
    const saved=[...sessions].reverse().find(s=>s.bowler===nightBowler
      &&s.league===nightLeague&&s.date===nightDate);
    if(saved)return saved;

    const ss=shots.filter(s=>s&&s.bowler===nightBowler
      &&s.league===nightLeague&&String(s.date)===String(nightDate));

    // NOT gated on having bowled yet.
    //
    // Requiring frames kept Side games blank before the first ball --
    // which is precisely when a bowler ticks the pots they are in and
    // owes the buy-ins. The card has to be there first.
    //
    // A night needs only a bowler, a league and a date to exist. Without
    // those there is no night to describe, and returning null is right.
    if(!nightBowler||!nightLeague||!nightDate)return null;

    const scores=[1,2,3].map(g=>getGameStrict(nightBowler,nightLeague,nightDate,g))
      .filter(v=>v!=null);
    return {
      // No id: this is NOT a row and must never be saved as one. Anything
      // that writes reads the real session or creates it through
      // endSession.
      id:"",
      bowler:nightBowler,league:nightLeague,date:nightDate,
      scores,
      total:scores.reduce((a,b)=>a+b,0),
      average:scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):0,
      pokerQuarter:[0,0,0],pokerDollar:[0,0,0],
      threeSixNineWinnings:0,jackpotWinnings:0,
      highGameWinnings:[0,0,0],
      pokerQuarterCost:[0,0,0],pokerDollarCost:[0,0,0],
      highGameCost:[0,0,0],threeSixNineCost:0,
      inProgress:true,
      ...computeSessionStats(ss),
    };
  })();

  // Money games need a session row to attach winnings to, and that row
  // was only created by "End session". So poker and bracket winnings --
  // the things you settle up game by game, at the lanes -- were invisible
  // for the entire night and only appeared in the recap afterwards.
  //
  // Create the row as soon as there are scores, so the money card is
  // there while it's useful. submitSession updates this same row rather
  // than adding a second one, because it matches on the same
  // (bowler, league, date) key.
  const anyScoreEntered=[1,2,3].some(g=>getGameStrict(nightBowler,nightLeague,nightDate,g)!=null);
  const startedSessionRef=useRef("");
  useEffect(()=>{
    if(!preferences.showMoneyGames)return;
    if(!anyScoreEntered||curSession)return;
    if(!activeBowler||!effectiveSessionLeague)return;
    const key=`${activeBowler}|${effectiveSessionLeague}|${sessionDate}`;
    if(startedSessionRef.current===key)return;
    startedSessionRef.current=key;
    const scores=[1,2,3].map(g=>getGameStrict(nightBowler,nightLeague,nightDate,g)).filter(v=>v!=null);
    // computeSessionStats supplies misses, releases, shotCount, strikes,
    // spareAttempts and sparesMade. The Summary block calls
    // cs.misses.filter(...) and cs.releases.filter(...) directly, so a
    // draft without them threw on render and blanked the screen the
    // moment a league was selected -- selecting a league is what first
    // makes this session findable, and therefore what first renders the
    // Summary.
    const nightShots=shots.filter(sh=>sh.bowler===activeBowler
      &&sh.league===effectiveSessionLeague&&sh.date===sessionDate);
    const draft={
      id:crypto.randomUUID(),bowler:activeBowler,league:effectiveSessionLeague,date:sessionDate,
      scores,total:scores.reduce((a,b)=>a+b,0),
      average:scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):0,
      pokerQuarter:[0,0,0],pokerDollar:[0,0,0],threeSixNineWinnings:0,jackpotWinnings:0,
      highGameWinnings:[0,0,0],
      // Costs pre-filled from this league's saved buy-ins, so they never
      // have to be typed again. Still stored per game on the session, so
      // a one-off week -- skipped the dollar game in game 3 -- stays
      // representable and past nights keep whatever they actually cost.
      ...costArraysFor(buyInsForLeague(leagueBuyIns,effectiveSessionLeague),scores.length),
      ...computeSessionStats(nightShots),
    };
    const updated=[...sessions,draft];
    setSessions(updated);
    try{window.storage.set(SESSIONS_KEY,JSON.stringify(updated));}catch{}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[anyScoreEntered,curSession,activeBowler,effectiveSessionLeague,sessionDate,preferences.showMoneyGames]);
  const currentLane=calcLane(startingLane,form.game,form.frame,form.ballNum);
  // Handedness comes from the team roster (set in Team Management). A
  // lefty's mechanics mirror a righty's, so their weak/ringing corner pin
  // is the 7, not the 10 -- the logging chips flip to match rather than
  // asking them to mentally translate every shot.
  // Profile is the source of truth; the roster value is the fallback for
  // bowlers whose profile hasn't been filled in yet, so existing lefties
  // keep working without needing a data migration.
  // Which balls the Log tab offers. Practice sees everything the bowler
  // owns; league and tournament see only the selected bag. Bags for the
  // current bowler are grouped so the selector can show counts.
  // Per-center performance -- sessions resolve through their league to a
  // center, which is why leagues carry the center rather than sessions.
  // Pickers show only unhidden leagues; stats and history still use the
  // full list, so hiding never removes anyone's scores from their averages.
  const activeLeagues=visibleLeagues(leagues,hiddenLeagues,leagueIdsRef.current);

  // ── What this bowler is allowed to SEE ──────────────────────────────
  //
  // Two hiding mechanisms, applied in order, and deliberately different
  // things. hidden_leagues is a league the BOWLER chose to hide and can
  // unhide. The plan limit is one they cannot. They stay separate so a
  // bowler who hid Thursday themselves is not handed it back the day
  // they subscribe.
  //
  // HIDDEN IS NEVER DELETED. Every shot keeps syncing, keeps being
  // exported, and comes back the moment they subscribe again -- which is
  // why Settings and ImportScorecard below are still given the RAW
  // arrays, each with a note saying so.
  //
  // This also fixes something that predates any paywall: cAvg() with no
  // league argument pools every competitive session, so a league the
  // bowler had hidden was still sitting inside their Composite average.
  const keptLeagueName=(()=>{
    const id=entitlement?.kept_league_id;
    if(!id)return "";
    const byName=leagueIdsRef.current||{};
    return Object.keys(byName).find(n=>byName[n]===id)||"";
  })();
  // The default until they choose: the last real league they bowled.
  const mostRecentLeagueName=(()=>{
    let best=null;
    for(const s of sessions){
      if(!s||!s.league||isContainerLeague(s.league))continue;
      if(!best||String(s.date||"")>String(best.date||""))best=s;
    }
    return best?best.league:"";
  })();
  // Matches visibleLeagues' own hidden test, but KEEPS containers --
  // Practice and Just Bowling are storage, not leagues anybody joined,
  // and a lapsed bowler who cannot practise is one who does not come
  // back.
  const notUserHidden=(()=>{
    const hidden=new Set(hiddenLeagues||[]);
    return (leagues||[]).filter(name=>{
      const id=leagueIdsRef.current?.[name];
      return !id||!hidden.has(id);
    });
  })();
  const visibleLeagueNames=allowedLeagues(notUserHidden,{entitlement,keptLeagueName,mostRecentLeagueName});
  // What has gone quiet, for the picker. This is empty whenever billing
  // is off or the bowler is subscribed -- allowedLeagues returns
  // everything in both cases -- so it is the whole visibility condition
  // and no separate BILLING_LIVE check is needed at the call site.
  const lockedLeagueNames=lockedLeagues(notUserHidden,{entitlement,keptLeagueName,mostRecentLeagueName});
  // Applied locally rather than re-read from the server. The picker only
  // calls this after its update came back without an error and with a
  // row, so the value is already known good -- and a round trip here
  // would leave the card on screen, still asking, after the bowler had
  // answered it.
  const onKeptLeagueSaved=name=>{
    const id=leagueIdsRef.current?.[name];
    if(!id)return;
    setEntitlement(prev=>prev?{...prev,kept_league_id:id}:prev);
  };
  const visibleLeagueKey=visibleLeagueNames.join("\u0001");
  // Memoised: these run over the bowler's whole history, and this
  // component re-renders on every keystroke anywhere inside it.
  const visibleShots=useMemo(()=>{
    const ok=new Set(visibleLeagueNames);
    return shots.filter(s=>!s||!s.league||ok.has(s.league));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[shots,visibleLeagueKey]);
  const visibleSessions=useMemo(()=>{
    const ok=new Set(visibleLeagueNames);
    return sessions.filter(s=>!s||!s.league||ok.has(s.league));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[sessions,visibleLeagueKey]);

  const leaguesWithCenters=leagues.map(name=>({name,centerId:leagueCenters[name]}));
  const centerStats=statsByCenter(sessions,leaguesWithCenters,centers,statsBowler||activeBowler,shots);

  // Whether the active bowler should be prompted to update their book
  // average, and what the app would suggest if so. Computed here rather
  // than inside Profile.jsx because it needs `teams` (to know which
  // leagues this bowler is actually in) and `leagueDates` (the season
  // boundaries) -- both already assembled at this level.
  const bowlerLeagueNames=[...new Set(
    teams.filter(t=>(t.members||[]).includes(activeBowler)).map(t=>t.league)
  )];
  const bowlerLeaguesWithDates=bowlerLeagueNames.map(name=>({
    name, endDate:leagueDates[name]?.endDate||"",
  }));
  // Quieter launch prompt: silent on established bowling nights, shown on
  // unusual days. See domain/launchPrompt.js for the reasoning.
  const showSessionStart=shouldShowLaunchPrompt({
    sessions,
    bowler:activeBowler,
    seenOnce:sessionStartSeen,
    dismissedDate:sessionStartDismissedDate,
  });

  // What this bowler usually does on today's weekday, learned from what
  // they've actually bowled. Tuesday means league, Thursday means
  // practice -- and on a day with no clear routine it stays null rather
  // than guessing.
  const routine=todaysRoutine(sessions,tournaments,activeBowler);
  const DAY_NAMES_SHORT=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  // Set the mode to match the routine on a recognised night.
  //
  // This closes a hole the guided prompt opened: on an established night
  // the prompt stays quiet, so a bowler who chose Tournament on Saturday
  // arrived at Tuesday league night still in tournament mode, with
  // nothing asking and -- now that mode lives on the prompt rather than
  // in Settings -- nowhere obvious to fix it.
  //
  // Only when the prompt is NOT showing: if it's up, the bowler is
  // answering for themselves and the app shouldn't move under them. And
  // only once per day, so it never fights a deliberate mid-session change.
  const routineAppliedRef=useRef("");
  useEffect(()=>{
    if(showSessionStart)return;
    if(!routine.mode)return;
    const today=localDateString();
    if(routineAppliedRef.current===today)return;
    routineAppliedRef.current=today;
    if(preferences.environment!==routine.mode){
      updatePreferences(prev=>applyEnvironment(prev,routine.mode));
    }
  },[showSessionStart,routine.mode,preferences.environment]);

  // displayName loads asynchronously from the profile, so the useState
  // initialiser above sees "" on first render and never re-runs. This
  // fills it in when it arrives -- but only if the bowler hasn't already
  // picked someone, so it never overrides a deliberate choice or snaps
  // back while they're looking at a teammate.
  const statsBowlerDefaulted=useRef(false);
  useEffect(()=>{
    if(statsBowlerDefaulted.current)return;
    if(!displayName)return;
    statsBowlerDefaulted.current=true;
    setStatsBowler(prev=>prev||displayName);
  },[displayName]);

  // Keep the cloud name and the local bowler list in step.
  //
  // The two were only ever written independently: onboarding created a
  // local bowler, Team Management wrote the cloud profile, and neither
  // told the other. A bowler who set their name on one device and opened
  // the app on another got a cloud name with no matching bowler, so
  // nothing they logged was attributed to them.
  //
  // Runs once per name change, and only ADDS -- it never renames or
  // removes an existing bowler, since guests and teammates live in the
  // same list.
  const nameSyncedRef=useRef("");
  const clean=v=>String(v??"").trim();
  useEffect(()=>{
    if(!displayName)return;

    // The MERGE is checked before the once-per-name guard.
    //
    // That guard exists so the display name is not re-added on every
    // render, and it returns early after the first run -- which would
    // stop the merge the moment records arrive, because shots and
    // sessions load after the profile does. The merge is idempotent:
    // hasDuplicateIdentity is false once there is nothing left to
    // merge, so checking it every time costs a comparison and nothing
    // else.
    if(hasDuplicateIdentity(bowlers,user?.email,displayName)){
      const email=user?.email;
      saveBowlers(mergedBowlers(bowlers,email,displayName));
      const movedShots=movedRecords(shots,email,displayName);
      if(movedShots!==shots)saveShots(movedShots);
      const movedSessions=movedRecords(sessions,email,displayName);
      if(movedSessions!==sessions)saveSessions(movedSessions);
      const movedArsenals=movedKeyedMap(arsenals,email,displayName);
      if(movedArsenals!==arsenals)saveArsenals(movedArsenals);

      // Tournaments, drills and bags carry the bowler too. Moving only
      // shots and sessions would leave half the history under the old
      // name -- the list looks clean and the data is split, which is
      // worse than not merging.
      //
      // The tournament one is what said "This tournament is
      // reverett290's. Switch bowler to save it." about the bowler's own
      // event.
      const movedTournaments=movedRecords(tournaments,email,displayName);
      if(movedTournaments!==tournaments){
        setTournaments(movedTournaments);
        try{window.storage.set(TOURNAMENTS_KEY,JSON.stringify(movedTournaments));}catch{}
        if(activeTournament&&clean(activeTournament.bowler)===handleFromEmail(email)){
          setActiveTournament({...activeTournament,bowler:displayName});
        }
      }
      const movedDrills=movedRecords(drills,email,displayName);
      if(movedDrills!==drills){
        setDrills(movedDrills);
        try{window.storage.set(DRILLS_KEY,JSON.stringify(movedDrills));}catch{}
      }
      const movedBags=movedRecords(bags,email,displayName);
      if(movedBags!==bags)setBags(movedBags);

      if(activeBowler===handleFromEmail(email))selectBowler(displayName);
      return;
    }

    if(nameSyncedRef.current===displayName)return;
    nameSyncedRef.current=displayName;

    // MERGE the sign-in handle into the display name, do not add beside it.
    //
    // The handle (reverett290) is written to bowler_names on first sign
    // in, before a profile exists. The display name (Ryan) arrives later
    // from the profile, and adding it made the bowler appear TWICE --
    // both offered when filing scores, which is a question with no right
    // answer, and picking the wrong one files the night where the other
    // cannot see it.
    //
    // Records move with the name. Hiding the handle instead would orphan
    // every shot, session and arsenal already filed under it: the bowler
    // would see their name once and their history not at all.
    if(!bowlers.includes(displayName)){
      saveBowlers([...bowlers,displayName]);
      if(!activeBowler)selectBowler(displayName);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  // shots/sessions/arsenals are in the deps because the merge MOVES them.
  // They load asynchronously, so an effect that ran only on displayName
  // would merge the bowler list against records that had not arrived and
  // leave the history behind under the old name.
  },[displayName,bowlers.length,user?.email,shots.length,sessions.length,tournaments.length,drills.length,bags.length]);

  // A new SESSION starts with no ball chosen. A new GAME does not.
  //
  // The ball carries forward shot to shot and game to game -- you don't
  // re-pick it every frame, and switching balls between games is a
  // deliberate act, not a default. But a new night is a genuine fresh
  // start: the lanes, the pattern and the ball you want to open with
  // all change, and inheriting last Tuesday's choice would quietly
  // attribute tonight's first shots to a ball you may not have thrown.
  //
  // Keyed on bowler + league + date, which is what a session IS.
  const sessionKey=`${activeBowler}|${effectiveSessionLeague}|${sessionDate}`;
  const lastSessionKeyRef=useRef(sessionKey);
  useEffect(()=>{
    if(lastSessionKeyRef.current===sessionKey)return;
    lastSessionKeyRef.current=sessionKey;
    // Only clear when not mid-edit -- an edit holds the shot's own ball,
    // and wiping it would change a saved shot's equipment silently.
    if(!editingId)setForm(f=>({...f,ball:"",surface:""}));
    // A new night starts at two columns again. Six games last Friday
    // says nothing about tonight, and a table that opens wide implies
    // games nobody has bowled.
    setCasualExtraGames(2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[sessionKey]);

  // Persist tonight's context so a refresh doesn't lose the session.
  //
  // localStorage rather than window.storage: this has to be readable
  // SYNCHRONOUSLY on the very first render, before any async load
  // resolves, or the first paint shows an empty session and the scores
  // appear to vanish even though they arrive a moment later.
  useEffect(()=>{
    try{
      window.localStorage.setItem(SESSION_CONTEXT_KEY,JSON.stringify({
        // sessionLeague, NOT effectiveSessionLeague.
        //
        // This is the bug that made league night show tournament data.
        //
        // effectiveSessionLeague is the CONTAINER in practice, open
        // bowling and tournament modes. Saving it here wrote
        // "Tournament\u00b7Tourny 5\u00b7<uid>" into the resume context, and
        // sessionLeague is initialised from that on the next load -- so
        // the tournament's container became the bowler's LEAGUE, for
        // good. Every screen keyed on it then showed the tournament:
        // shot context, scoresheet, side games, results.
        //
        // sessionLeague is the league the bowler actually picked. The
        // container is derived from the mode and never needs storing.
        league:sessionLeague,date:sessionDate,lane:startingLane,
        // Where they'd got to. Without this the form reset to game 1
        // frame 1 on refresh, and since saving matches on
        // (bowler, league, date, game, frame), the NEXT shot silently
        // overwrote frame 1 instead of continuing the game.
        game:form.game,frame:form.frame,ballNum:form.ballNum??null,
      }));
    }catch{}
  },[sessionLeague,sessionDate,startingLane,form.game,form.frame,form.ballNum]);

  const activeBowlerProfile=normalizeProfile(profiles[activeBowler],activeBowler);
  const bookAverageCheck=needsBookAverageUpdate(
    bowlerLeaguesWithDates,activeBowlerProfile.bookAverageAsOf||"",
  );
  const bookAverageSuggestion=bookAverageCheck.needed
    ?suggestBookAverage(sessions,activeBowler)
    :null;

  // Pre-computed statistics for Insights. Deliberately assembled here and
  // sent as summary figures -- raw shot rows would be 8x the tokens and
  // invite the model to find patterns it can't properly weigh.
  const insightStats=(()=>{
    const who=statsBowler||activeBowler;
    // With no bowler selected, "everyone's shots" would be analysed as if
    // they were one person's game. Return an empty stat block instead so
    // the Insights tab shows its "pick a bowler" state rather than a
    // meaningless blended analysis.
    if(!who)return{gameCount:0,firstBalls:0,balls:[],centers:[]};
    // visibleShots, not shots: a hidden league must not reach the
    // Insights payload. The feature is paid today so a free bowler
    // cannot call it -- but the moment anything becomes partly free, a
    // raw payload leaks a league the bowler cannot even see.
    const mine=visibleShots.filter(s=>s.bowler===who);
    const firstBalls=mine.filter(s=>!s.ballNum||s.ballNum===1);
    const strikes=firstBalls.filter(s=>s.result==="Strike").length;
    const spareAtt=mine.filter(s=>s.result!=="Strike"&&s.spareMade!=="");
    const spareMade=spareAtt.filter(s=>s.spareMade==="Yes").length;
    const tenPins=mine.filter(s=>s.result==="Weak 10"||s.result==="Ringing 10");
    const tenMade=tenPins.filter(s=>s.spareMade==="Yes").length;
    // isSplit takes the SHOT, not its leave array -- it checks
    // shot.result === "Other Leave" before looking at the pins.
    //
    // Passing the bare array meant shot.result was undefined, the very
    // first check failed, and isSplit returned false for every shot. The
    // count was always exactly zero, so Insights reported a 0% split rate
    // no matter what the bowler actually left. Everywhere else in the app
    // calls isSplit(shot) correctly, which is why Stats showed the true 9%.
    const splits=firstBalls.filter(isSplit).length;
    // Grouped leaves, for the two spare rates the analysis was missing.
    // Corner pin is hand-aware: for a lefty it is the 7, not the 10.
    const singlePinAtt=mine.filter(s=>isSinglePinLeave(s)&&s.spareMade!=="");
    const singlePinMade=singlePinAtt.filter(s=>s.spareMade==="Yes").length;
    const cornerPinAtt=mine.filter(s=>isCornerPinLeave(s,!!preferences.leftHanded)&&s.spareMade!=="");
    const cornerPinMade=cornerPinAtt.filter(s=>s.spareMade==="Yes").length;

    // Baker and no-tap scores are left out of the figures.
    //
    // A frame-tracked tournament creates a session under the event's
    // container league, so without this a Baker block lands in the
    // average like any other night -- and half those pins belong to a
    // partner. No-tap is out for a different reason: a nine counts as a
    // strike, so pooling it inflates the average with an easier format.
    //
    // Only the SCORES are filtered. `mine` above is shots, untouched, so
    // strike percentage, carry by ball and leave patterns still count
    // every ball the bowler actually threw.
    const mySessions=sessionsForFigures(sessions,tournaments).filter(s=>!who||s.bowler===who);

    const gameCount=mySessions.reduce((n,s)=>n+(s.scores?.length||0),0);

    const ballRows=[...new Set(mine.map(s=>s.ball).filter(Boolean))].map(name=>{
      const bs=firstBalls.filter(s=>s.ball===name);
      const spec=ballSpecs[`${who}|${name}`]||{};
      return{
        name,
        firstBalls:bs.length,
        // Percentage, matching every other rate in this payload and what
        // the Stats view shows for the same ball.
        strikeRate:bs.length?Math.round((bs.filter(s=>s.result==="Strike").length/bs.length)*100):null,
        coverstock:spec.coverstock||"",
        coreType:spec.coreType||"",
      };
    });

    return{
      gameCount,
      firstBalls:firstBalls.length,
      // PERCENTAGES (0-100), not fractions.
      //
      // These were 0-1 fractions while everything the bowler sees -- the
      // Stats view, per-ball rows, goals -- is a percentage. The model got
      // splitRate: 0.09, read it as a percentage, and reported "0%" for a
      // split rate the app was showing as 9%. Same silent error applied to
      // strike rate, spare conversion and ten pins.
      //
      // Rounding here too, so the model can't produce spurious precision
      // like "8.9743% of first balls".
      strikeRate:firstBalls.length?Math.round((strikes/firstBalls.length)*100):null,
      spareAttempts:spareAtt.length,
      spareConversion:spareAtt.length?Math.round((spareMade/spareAtt.length)*100):null,
      tenPinAttempts:tenPins.length,
      tenPinRate:tenPins.length?Math.round((tenMade/tenPins.length)*100):null,
      splitRate:firstBalls.length?Math.round((splits/firstBalls.length)*100):null,
      sessionCount:mySessions.length,
      recentAverages:mySessions.slice(-8).map(s=>s.average).filter(v=>typeof v==="number"),
      // Facts, not rates, so ungated -- the same reasoning as handedness.
      // bookAverage especially: the analysis could compute a strike rate
      // but not say whether the bowler is above or below their book,
      // which is the frame a league bowler judges everything else by.
      average:(()=>{
        const v=mySessions.flatMap(x=>Array.isArray(x.scores)?x.scores:[])
          .filter(n=>Number.isFinite(Number(n))).map(Number);
        return v.length?Math.round(v.reduce((a,b)=>a+b,0)/v.length):null;
      })(),
      bookAverage:normalizeProfile(profiles[who],who).bookAverage??null,
      highGame:bowlerHighGame(sessions,who)?.value??null,
      highSeries:bowlerHighSeries(sessions,who)?.value??null,
      gamesLogged:gameCount,
      nightsLogged:new Set(mySessions.map(x=>x.date)).size||null,

      // The hand-rolled drill aggregation that sat here is gone.
      //
      // The same object already sets drills: from drillLines() further
      // down, and a duplicate key in an object literal is not a tie -- the
      // later one wins silently. So this block computed a result nothing
      // ever read, while Vite refused to build it at all.
      //
      // drillLines is the better half anyway: it carries proper target
      // labels rather than raw ids like "3-6-10".
      // Fed to buildAnalysisPayload, which gates each one on its own

      // threshold -- so these appear in the analysis as the sample for
      // each becomes real, not all at once.
      handedness:preferences.leftHanded?"left-handed":"right-handed",
      singlePinAttempts:singlePinAtt.length,
      singlePinRate:singlePinAtt.length?Math.round((singlePinMade/singlePinAtt.length)*100):null,
      cornerPinAttempts:cornerPinAtt.length,
      cornerPinRate:cornerPinAtt.length?Math.round((cornerPinMade/cornerPinAtt.length)*100):null,
      frameCount:firstBalls.length,
      openFramesPerGame:(firstBalls.length&&gameCount)
        ?Math.round((firstBalls.filter(x=>x.result!=="Strike"&&x.spareMade!=="Yes").length/gameCount)*10)/10
        :null,
      completeSets:mySessions.filter(x=>Array.isArray(x.scores)&&x.scores.length>=3).length,
      averageByPosition:(()=>{
        const pos=gamePositionAverages(sessions,who);
        return (pos&&pos.length)?pos.map(v=>Math.round(v)):null;
      })(),
      scoreSpread:(()=>{const c=scoreConsistency(sessions,who,"");return c?Math.round(c):null;})(),
      mostCommonLeave:(()=>{
        const counts={};
        for(const sh of mine){
          const l=Array.isArray(sh.otherLeave)?sh.otherLeave.join("-"):null;
          if(l)counts[l]=(counts[l]||0)+1;
        }
        return Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]?.[0]||null;
      })(),
      balls:ballRows,

      centers:centerStats.map(c=>({name:c.center.name,average:c.average,games:c.games})),
      // Drills, patterns, and score-only statistics: data the app already
      // had and Insights was ignoring. Each is gated on its own sample in
      // buildAnalysisPayload, so adding them here widens what CAN be
      // analysed without loosening any bar.
      drills:drillLines(drills,who,null,leftHandedForBowler(who)).map(l=>({
        label:l.label,attempts:l.attempts,rate:l.rate,
      })),
      patterns:patternAverages(sessions,lanePatterns,tournaments,who),
      scoreStats:scoreStats(mySessions,who,normalizeProfile(profiles[who],who).bookAverage),
    };
  })();

  // Notifies once when a statistic crosses its threshold, so a bowler
  // isn't left checking a tab that had nothing for them last time.
  //
  // Keyed on a signature of WHAT is analysable rather than a count, so it
  // fires on the transition and not on every render. Persisted, so it
  // survives a reload and doesn't re-announce the same unlock. Seeded on
  // first run rather than firing -- an existing bowler opening the app
  // after this ships should not be told everything they already had is
  // "new".
  const[insightUnlockSeen,setInsightUnlockSeen]=useState(null);
  const[newInsights,setNewInsights]=useState([]);

  // Depends on the SIGNATURE STRING, not on insightStats.
  //
  // insightStats is rebuilt fresh on every render, so a new object
  // identity every time -- an effect keyed on it re-ran on every render,
  // called setState, re-rendered, and looped until the app went black.
  // The signature is a plain string that only changes when what's
  // analysable actually changes, which is the thing this cares about.
  const insightSignature=unlockSignature(buildAnalysisPayload(insightStats));
  useEffect(()=>{
    if(!insightSignature)return;
    let cancelled=false;
    (async()=>{
      let seen=insightUnlockSeen;
      if(seen===null){
        try{
          const r=await window.storage.get(INSIGHT_UNLOCK_KEY);
          if(r){
            seen=r.value;
          }else{
            // First run since this shipped: record what's already there
            // rather than announcing it as new.
            await window.storage.set(INSIGHT_UNLOCK_KEY,insightSignature);
            seen=insightSignature;
          }
        }catch{seen=insightSignature;}
        if(cancelled)return;
        setInsightUnlockSeen(seen);
      }
      const before=new Set(String(seen||"").split(",").filter(Boolean));
      const fresh=insightSignature.split(",").filter(k=>k&&!before.has(k)).map(statLabel);
      if(fresh.length&&!cancelled){
        setNewInsights(fresh);
        setInsightUnlockSeen(insightSignature);
        try{await window.storage.set(INSIGHT_UNLOCK_KEY,insightSignature);}catch{}
      }
    })();
    return()=>{cancelled=true;};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[insightSignature]);

    async function analyzePerformance(payload){
    try{
      const{data,error}=await supabase.functions.invoke("analyze-performance",{body:{payload}});
      if(error){
        // "Failed to send a request to the Edge Function" means the
        // request never reached Supabase at all -- the function isn't
        // deployed, failed to boot, or the phone is offline. That string
        // tells a bowler nothing they can act on, so translate it.
        const raw=error.message||"";
        if(/failed to send a request|failed to fetch|networkerror/i.test(raw)){
          return{error:"Couldn't reach the analysis service. If you're online and this keeps happening, it needs redeploying."};
        }
        return{error:raw||"Analysis failed."};
      }
      if(data?.error)return{error:data.error};
      return data;
    }catch(e){return{error:e.message||"Couldn't generate insights right now."};}
  }

  // Whose game can be recorded here. Tournaments are always the owner
  // alone; league draws on the roster; practice/casual on local guests.
  const ownerName=displayName||bowlers[0]||"";

  // Practice and casual have no league to pick, so sessionLeague is always
  // "" there -- which silently disabled game-score entry AND the session
  // recaps, both of which key off it. These environments get a stable
  // stand-in key instead.


  // Create the practice league row the moment practice is entered, not
  // when a score is first typed. saveSession and updateManualScore both
  // resolve league_id synchronously, so the row has to already exist by
  // then -- doing it on demand would silently drop the first score of
  // every practice session.
  useEffect(()=>{
    // Casual is scores-only, so the score card is the whole screen --
    // it opens by default there and nowhere else.
    if(preferences.environment==="casual")setExpandedSections(e=>({...e,manualScores:true}));
    // League: Tonight's Session open by default. It's the first thing you
    // set on a league night -- which league, which lane -- so making it a
    // tap to reach put a step in front of every session.
    if(preferences.environment==="league")setExpandedSections(e=>({...e,tonightSession:true}));
    if(preferences.environment!=="practice")setPracticeTracking(null);
    if(preferences.environment==="practice"&&user?.id)ensurePracticeLeague();
    // Casual gets its row the same way, so casual scores sync instead of
    // living only on this phone.
    if(preferences.environment==="casual"&&user?.id)ensureCasualLeague();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[preferences.environment,user?.id]);

  // The signed-in user's own profile, which is what carries the coach
  // flag. Distinct from activeBowlerProfile: that follows whoever is being
  // logged for, and a guest never has a coach flag.
  const myProfile=normalizeProfile(profiles[ownerName]||profiles[activeBowler],ownerName||activeBowler);
  // Requires BOTH the profile flag and the toggle -- see coachViewActive.
  const coachViewOn=coachViewActive(preferences,myProfile);

  // Offer the coach walkthrough the first time coach mode is turned on.
  // Keyed on coachViewOn flipping true, not on being a coach: someone can
  // be marked a coach and never open the coach view, and the tour is
  // about that view.
  useEffect(()=>{
    if(!coachViewOn||!onboarded)return;
    // The coach walkthrough is gone with the mode-based tracks. Coaches
    // get the same four topic tours as everyone else, from Settings.
    // Left as a no-op rather than deleted so the hook's shape -- and the
    // reason it is keyed on coachViewOn -- survives if a coach tour comes
    // back.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[coachViewOn]);
  // The tab appears for anyone who coaches OR is in any coaching
  // relationship, so a bowler being coached can reach their tasks without
  // being told to flip a coach setting that isn't about them.
  const showCoachingTab=!!myProfile.isCoach||coachingRels.length>0;

  // Social is Teams + Friends, both of which are about the coach's OWN
  // bowling, not their coaching. It's also now redundant for coaching:
  // friendship and an accepted coaching relationship grant the same
  // session read, and coaching grants it directionally rather than
  // symmetrically -- so a coach no longer needs to friend a bowler to
  // see their scores.
  //
  // Gated on coachViewActive rather than on isCoach: most coaches bowl
  // leagues themselves, and hiding Social from them permanently would
  // take away a tab they need for their own game. Switching back to
  // "I'm bowling" brings it back.
  // What the Log tab treats as the current preferences. In practice, a
  // session-only tracking choice overrides the stored one so a bowler can
  // switch to scores-only for tonight without touching Settings -- and
  // therefore without changing how their league nights get documented.
  const logPreferences=(preferences.environment==="practice"&&practiceTracking)
    ?{...preferences,trackingMode:practiceTracking}
    :preferences;

  // The pattern picker always offers the PBA animals for this season and
  // last, on top of whatever the community has entered. Seeded in memory,
  // not written to the cloud: they become real rows only when a bowler
  // fills in specs and saves.
  // The picker offers every PBA pattern we hold real specs for, on top of
  // whatever the community has entered. Only verified year-tagged entries
  // are seeded -- the animal list isn't run in full every season, so
  // offering all ten each year would fill the picker with patterns that
  // weren't bowled and have no specs behind them.
  //
  // Seeded in memory: they become rows only when a bowler picks one.
  const pickerPatterns=(()=>{
    const have=new Set(oilPatterns.map(p=>`${p.name}|${p.year||""}`));
    const seeds=allVerifiedPbaPatterns().filter(p=>!have.has(`${p.name}|${p.year}`));
    return [...oilPatterns,...seeds];
  })();

  // Five tabs, one per step of the loop: bowl -> review -> understand ->
  // improve -> manage. Internal view ids are unchanged -- "log" is still
  // "log" -- so every existing view==="..." check keeps working; only the
  // tab that reaches it is new. Social and Coach are reachable from
  // inside Improve rather than being destinations of their own.
  // Just Bowling gets two tabs, not five.
  //
  // History, Stats, Improve and Vault are all built on shot data,
  // leagues or equipment -- none of which a casual bowler has. Showing
  // four tabs that lead to empty screens makes the app look like it
  // isn't working, and makes a simple night look like homework.
  //
  // Friends replaces them: the leaderboard of everyone who's been on a
  // scoresheet, which is the only other thing a casual bowler wants.
  // Anything at all worth asking about: a logged score, a shot, or a
  // drill. Checked across every bowler on the device rather than just
  // the active one -- a scorekeeper whose own name has no games yet
  // still has plenty for Brooklyn to work with.
  const hasAnythingLogged=
    sessions.some(x=>x&&Array.isArray(x.scores)&&x.scores.some(v=>v!=null))
    ||shots.length>0
    ||drills.length>0;

  // Where "up" is, for each screen that is not a tab.
  //
  // A real hierarchy, not browser history: scoring belongs under Home
  // because that is where the mode was chosen, and Badges under Journey
  // because that is the only link to it. Null means the screen IS a tab
  // and there is nowhere up to go.
  const PARENT_VIEW={
    log:"home", journey:"home", data:"home",
    badges:"journey",
    settings:"home", profile:"home", inbox:"home",
    coaching:"home", import:"home", help:"home", social:"home",
  };
  const parentView=PARENT_VIEW[view]||null;

  // The casual nav applies only while a casual night is actually running.
  //
  // It keyed on the preference alone, which survives the night -- so
  // finishing an open-bowling session left a bowler on Home with three
  // tabs and no way to reach Team, Stats, Improve or History. They were
  // not bowling casually any more; the app just still thought so.
  //
  // Home already asks what you are doing next, so once the night is filed
  // the full nav is the honest one.
  //
  // Keyed on nightENDED, not nightLive: live means "has shots", so the
  // nav went six tabs -> three on the first ball and back to six at the
  // end. Changing the nav underneath a bowler mid-night is worse than
  // either layout. Ended is a single transition, at the moment the night
  // is actually over.
  // How many badges the bowler has actually earned.
  //
  // The same source the Badges screen uses -- a history entry with a
  // count above zero -- rather than a second way of deciding what
  // "earned" means, which is how two screens end up disagreeing about the
  // same collection.
  const earnedBadgeCount=(()=>{
    try{
      const hist=allCompetitiveBadges({
        sessions,shots,matches,drills,teams,leagueDates,
        bowler:activeBowler,
      });
      return Object.values(hist||{}).filter(r=>r&&r.count).length;
    }catch{ return 0; }
  })();

  const casualMode=preferences.environment==="casual"&&!nightEnded;
  const navTabs=casualMode?[
    // Home first, so open bowling is never a dead end.
    //
    // Casual had Standings, Bowl and Badges and no way back to Home --
    // switching into open bowling stranded you there, because the mode is
    // changed FROM Home and there was nothing to return to. A mode you
    // can enter and not leave is a trap, not a mode.
    //
    // Bowl stays in the middle: it is the thing you reach for mid-game,
    // and the middle of a bottom bar is the easiest place to hit
    // one-handed while holding a ball.
    {id:"home",   label:"Home",     icon:"\u{1F3E0}"},
    {id:"log",    label:"Bowl",     icon:"\u{1F3B3}"},
    {id:"social", label:"Standings",icon:"\u{1F4CA}"},
  ]:[
    // HOME first, and Home becomes the night while one is live.
    //
    // Bowling is the most frequent thing anyone does here, so a Bowl tab
    // looks obvious -- but a tab spends a permanent slot on something
    // that is only relevant a few hours a week. Instead Home IS the
    // scoring screen while a night is under way, and the dashboard the
    // rest of the time. No resume step, and no tab sitting idle.
    //
    // That also fixes the real cost of dropping Bowl: leaving scoring to
    // check a ball or the standings and getting straight back. Home is
    // where you already are.
    //
    // Journey moves to a card on Home rather than a tab. It is more
    // prominent there, not less -- it is the first thing under the
    // headline numbers instead of one of five icons.
    {id:"home",    label:"Home",    icon:"🏠"},
    {id:"locker",  label:"Gear",    icon:"🎒"}, // internal id stays "locker" -- plumbing, not shown
    {id:"teams",   label:"Team",    icon:"👥"},
    // Stats gets the bar back.
    //
    // It was reached from a card on Home, which is fine for a glance and
    // wrong for the screen that holds everything the app knows about a
    // bowler's game. Six tabs is one more than ideal, but a tab is 63px
    // at 380px -- still above the touch minimum, and cheaper than burying
    // the thing the whole product is for.
    {id:"data",    label:"Stats",   icon:"📈"},
    {id:"insights",label:"Improve", icon:"🎯"},
    {id:"history", label:"History", icon:"📖"},
  ];
  // Icons go inline beside the title until the nav genuinely needs the
  // width. Five was the count that pushed "Social" off a phone screen and
  // prompted stacking in the first place; four fits comfortably.

  // Everything outstanding, from every source -- coaching invitations,
  // friend and team requests, coach tasks, imported scores, the book
  // average prompt. Previously each lived only on its own tab, so
  // "is anything waiting for me" meant checking five places.
  // The header icon and count use the ACCOUNT's inbox, not the active
  // bowler's.
  //
  // Who's Bowling changes activeBowler when logging for a teammate, and
  // scoping the count to it meant the inbox icon appeared and vanished
  // depending on whose scores you were entering -- items addressed to
  // you were invisible while you had a teammate selected.
  const myInboxItems=buildInbox({
    bowler:displayName||activeBowler,
    userId:user?.id,
    importedScores,
    sessions,
    coachingRelationships:coachingRels,
    coachingProfilesById:coachProfilesById,
    tasksByRelationship,
    unreadResponses,
    friendRequests:incomingFriendRequests,
    teamInvites:myTeamInvites,
    bookAverageDue:bookAverageCheck,
    catalogRejections:rejectedBallsFor(arsenals[displayName||activeBowler]||[],catalogEntries,catalogAck),
    coachViewOn,
  });

  // The icon is conditional: a permanent icon for a usually-empty inbox
  // is clutter, and one that only appears when something is waiting needs
  // no label.
  const inboxCount=countInbox(myInboxItems);

  // Whether the bowler being VIEWED has an accepted coach -- Insights adds
  // a line telling them to check with that coach before acting on it.
  // Uses the viewed bowler, not the signed-in account: a coach reading a
  // bowler's insights should see the same caveat the bowler does.
  const insightCoaches=categorizeCoaching(coachingRels,user?.id,coachProfilesById).myCoaches;

  // Turning coach view on while sitting on Social would strand the user
  // on a tab that is no longer in the nav -- a blank screen with no way
  // back except the tab they can't see. Same for the Coach tab if the
  // last coaching relationship is ended while viewing it.
  useEffect(()=>{
    // Screens reached from a header icon or a Home card rather than the
    // nav. They're legitimate views, so they must not be treated as "not
    // in the nav" and bounced -- which would have thrown a coach off
    // Settings the moment they flipped coach view.
    //
    // journey and data joined this list when the nav went to five tabs:
    // both are now reached from cards on Home, and without them here the
    // guard threw you straight back to logging the moment you tapped
    // either card. A destination is not illegitimate just because it has
    // no tab.
    // "log" is here for the same reason: picking a mode on Home sets it,
    // and it has no tab either. Without it the mode rows bounced you
    // back to Home the instant you tapped one.
    const iconViews=["profile","settings","inbox","social","coaching","import","help",
      // badges too: a shared badge link opens it directly, and a link
      // that lands on Home is a broken link.
      "journey","data","log","badges"];
    if(!navTabs.some(t=>t.id===view)&&!iconViews.includes(view))setView("home");
  },[view,coachViewOn,showCoachingTab]);

  // Every tab opens at the top.
  //
  // Swapping the view keeps the browser's scroll position, so tapping
  // Stats from halfway down Bowl landed you halfway down Stats -- on
  // whatever card happened to be there. Nothing was broken, which is
  // exactly why it read as the app being arbitrary.
  useEffect(()=>{
    window.scrollTo(0,0);
  },[view]);

  const scoreOptions=scorekeepingOptions({
    environment:preferences.environment,
    owner:ownerName,
    league:effectiveSessionLeague,
    teams,
    guests,
  });

  const bowlerBags=bags.filter(b=>b.bowlerName===activeBowler);
  const envBags=bagsForEnvironment(bowlerBags,preferences.environment);
  // A selected bag from another environment or another bowler isn't in
  // envBags -- resolve it to "nothing selected" rather than letting the
  // Log tab silently show zero balls with no way to tell why.
  //
  // With exactly ONE bag for this environment, it is the answer -- so it
  // is selected without being asked for. Falling back to "" meant
  // availableBalls returned the WHOLE arsenal: a bowler who had packed a
  // tournament bag still saw every ball they own, which is the opposite
  // of why they packed it. Asking someone to choose between one option
  // is not a choice.
  const effectiveBagId=envBags.some(b=>b.id===selectedBagId)
    ?selectedBagId
    :(envBags.length===1?envBags[0].id:"");
  const bowlerBalls=arsenals[activeBowler]||[];
  const ballsByBag=ballsByBagFor(ballBags,activeBowler,bowlerBalls);
  // envBags.length tells availableBalls whether this bowler has any bags
  // for this environment at all -- with none, the arsenal is unfiltered
  // rather than empty.
  // Sorted at the source so every picker that uses logBalls gets it:
  // the shot form, the ball-pick card and the per-game dropdowns.
  const logBalls=plasticLast(availableBalls(preferences.environment,ballsByBag,effectiveBagId,bowlerBalls,envBags.length>0),PLASTIC_BALL);

  const rosterLeftHanded=!!teams.find(t=>t.memberHandedness&&activeBowler in t.memberHandedness)?.memberHandedness?.[activeBowler];
  const activeBowlerLeftHanded=resolveHandedness(profiles[activeBowler],rosterLeftHanded);

  const inTenth=parseInt(form.frame)===10;

  // Which 10th-frame ball numbers are legitimately selectable right now.
  // A non-strike + spare on ball 1 means ball 2 WAS the spare conversion —
  // there is no separate "ball 2" shot to log, so it's never offered.
  function tenthBallOptions(){
    return tenthFrameStatus(shots,form.bowler,form.league,form.date,form.game);
  }
  const tenthOptions=tenthBallOptions();

  useEffect(()=>{
    if(editingId)return;
    if(inTenth&&form.ballNum&&!tenthOptions.includes(form.ballNum)&&tenthOptions.length>0){
      set("ballNum",tenthOptions[0]);
    }
  },[inTenth,form.game,form.bowler,form.ballNum,shots]);
  const ballNumLabel=inTenth?` · Ball ${form.ballNum||1}`:"";

  // Every game bowled tonight, not just the first three.
  //
  // These were three fixed lookups, so the summary at the top of Shot
  // Context stopped at G3 -- fine for a league night, wrong for a
  // tournament block, where game 4 onward simply never appeared however
  // many the bowler entered.
  //
  // Length follows the work: three at a minimum so a league night keeps
  // its familiar shape, more once the bowler has gone past it, in either
  // frames or typed scores. Capped at twelve to match the stepper.
  const gameScores=(()=>{
    const league=effectiveSessionLeague;
    // Practice starts at ONE game, not three.
    //
    // A league night is three games by definition, so showing G1 G2 G3
    // from the first ball is right there. Practice is not: a bowler
    // throws one, or two, or five, and three empty boxes told them the
    // app expected three and they were behind.
    //
    // It still grows from the shots below, so a second game appears the
    // moment one is bowled. Tournaments keep the floor of three because a
    // block is at least that.
    let highest=preferences.environment==="practice"?1:3;
    for(const sh of shots||[]){
      if(sh&&sh.bowler===activeBowler&&sh.league===league&&sh.date===sessionDate){
        const n=parseInt(sh.game);
        if(Number.isFinite(n)&&n>highest)highest=n;
      }
    }
    for(let n=4;n<=12;n++){
      if(getGameStrict(nightBowler,nightLeague,nightDate,n)!=null)highest=Math.max(highest,n);
    }
    highest=Math.min(12,highest);
    return Array.from({length:highest},(_,i)=>
      getGameStrict(nightBowler,nightLeague,nightDate,i+1));
  })();

  const sessionTotal=getSessionTotal();

  // Corner pin depends on which hand THREW the shot, and a "Stats" view
  // can legitimately blend several bowlers (statsBowler === "" is
  // Team/combined; a team-compare view is a whole roster). A single
  // leftHanded flag would silently apply one person's hand to everyone
  // else's shots, so this resolves it per bowler and the corner-pin
  // filters below call it per shot.
  function leftHandedForBowler(name){
    const rosterLeftHanded=!!teams.find(t=>t.memberHandedness&&name in t.memberHandedness)?.memberHandedness?.[name];
    return resolveHandedness(profiles[name],rosterLeftHanded);
  }

  // ── Stats ─────────────────────────────────────────────────────────────────
  // statsBowler === "" means Team/combined (everyone's shots together)
  const statsShots=shots.filter(s=>(statsBowler?s.bowler===statsBowler:true)&&(statsLeague?s.league===statsLeague:true));
  // History > Shots shows only THIS bowler's own shots.
  //
  // It used to list everything in the local array, which includes shots
  // proxy-logged for teammates and shots that arrived from an imported
  // scorecard. Every row has a delete button, so a bowler could delete a
  // teammate's frames from their own history screen -- and a teammate
  // doing the same on their device could delete these.
  //
  // Scoped to displayName (the signed-in account) rather than
  // activeBowler: activeBowler changes when logging for someone else,
  // and "whose history am I looking at" should not follow that.
  const myShots=shots.filter(s=>!displayName||s.bowler===displayName);
  const filtered=myShots.filter(s=>{
    if(filterBowler&&s.bowler!==filterBowler)return false;
    if(filterBall.startsWith("__")){if(s.teamId!==filterBall.slice(2))return false;}
    else if(filterBall&&s.ball!==filterBall)return false;
    if(filterResult&&s.result!==filterResult)return false;
    return true;
  });
  const tot=statsShots.length;
  const stk=statsShots.filter(s=>s.result==="Strike").length;
  const stkR=tot?Math.round((stk/tot)*100):0;
  const wk=statsShots.filter(s=>s.result==="Weak 10").length;
  const rng=statsShots.filter(s=>s.result==="Ringing 10").length;
  // Spare % excludes splits — splits are tracked as their own conversion
  // rate below, and folding them into the general spare rate understates
  // how well someone is converting the regular, non-split leaves. This
  // matches the standard convention (and LaneTalk).
  const spAtt=statsShots.filter(s=>s.result!=="Strike"&&s.spareMade!==""&&!isSplit(s));
  const spMade=spAtt.filter(s=>s.spareMade==="Yes").length;
  const spR=spAtt.length?Math.round((spMade/spAtt.length)*100):0;
  const splitShots=statsShots.filter(isSplit);
  const splitCount=splitShots.length;
  const splitR=tot?Math.round((splitCount/tot)*100):0;
  const splitConverted=splitShots.filter(s=>s.spareMade==="Yes").length;
  const splitConvR=splitCount?Math.round((splitConverted/splitCount)*100):0;
  // Uses each shot's OWN bowler's hand, not a single flag for the view --
  // see leftHandedForBowler above. Was isTenPinLeave, which only matches
  // the 10 pin and silently missed every left-handed bowler's 7-pin
  // leaves logged by pin number (Weak/Ringing 10 stayed correct for both
  // hands, since those are canonical stored values either way).
  const tenPinAttempts=statsShots.filter(s=>isCornerPinLeave(s,leftHandedForBowler(s.bowler))&&s.spareMade!=="");
  const tenPinMade=tenPinAttempts.filter(s=>s.spareMade==="Yes").length;
  const tenPinSpareR=tenPinAttempts.length?Math.round((tenPinMade/tenPinAttempts.length)*100):0;
  const tenPinLeaveCount=statsShots.filter(s=>isCornerPinLeave(s,leftHandedForBowler(s.bowler))).length;
  const singlePinAttempts=statsShots.filter(s=>isSinglePinLeave(s)&&s.spareMade!=="");
  const singlePinMade=singlePinAttempts.filter(s=>s.spareMade==="Yes").length;
  // Specifically the lone 5-pin (not any other single pin) — a shot the
  // request specifically wants counted as a named stat, not folded into
  // the general single-pin spare rate above.
  const fivePinAttempts=statsShots.filter(s=>s.result==="Other Leave"&&Array.isArray(s.otherLeave)&&s.otherLeave.filter(p=>p!=="9 Pin No-Tap").length===1&&s.otherLeave.includes("5")&&s.spareMade!=="");
  const fivePinMisses=fivePinAttempts.filter(s=>s.spareMade==="No").length;
  const singlePinSpareR=singlePinAttempts.length?Math.round((singlePinMade/singlePinAttempts.length)*100):0;
  const frameShots=statsShots.filter(s=>!s.ballNum||s.ballNum===1);
  const cleanFrameCount=frameShots.filter(s=>s.result==="Strike"||s.spareMade==="Yes").length;
  const cleanFrameR=frameShots.length?Math.round((cleanFrameCount/frameShots.length)*100):0;

  // ── Goal measurements ─────────────────────────────────────────────────
  // Each goal-able statistic paired with the sample it actually rests on.
  // Getting the pairing right is the whole point of the gate: strike rate
  // is per FIRST BALL, spare conversion per ATTEMPT, and quoting the wrong
  // denominator would let a goal report progress it hasn't earned.
  //
  // These follow the current Stats view filters (bowler / league), so a
  // goal reads against whatever the bowler is looking at rather than a
  // hidden global figure that wouldn't match the numbers on screen.
  //
  // Three sharp edges in these helpers, all of which silently produced
  // "nothing logged" before:
  //   - rAvg() requires an EXACT league match and returns null for the
  //     all-leagues view (statsLeague === ""). cAvg() is the one that
  //     treats a blank league as "all", so that's what a goal uses.
  //   - bowlerHighGame/Series return an OBJECT ({value,date,league,...}),
  //     not a number, so the .value has to be unwrapped.
  //   - both high helpers match on an exact bowler name and return null
  //     for the all-bowlers view, so that falls back to the logged-in
  //     bowler rather than reporting nothing.
  // The bowler's average BEFORE tonight, for the practice recap. Excludes
  // the current date on purpose: comparing tonight against an average that
  // already contains tonight would drag the baseline toward the very
  // result being judged, so a good night would look smaller than it was.
  const practicePriorAverage=(()=>{
    const prior=sessions.filter(s=>s.bowler===activeBowler&&s.date!==sessionDate);
    const all=prior.flatMap(s=>Array.isArray(s.scores)?s.scores:[]).filter(v=>Number.isFinite(v));
    if(!all.length)return null;
    return Math.floor(all.reduce((a,b)=>a+b,0)/all.length);
  })();

  const goalBowler=statsBowler||activeBowler;
  // Goals and Trends are always scoped to ONE bowler (goalBowler falls
  // back to activeBowler, never to a blended team), so a single flag is
  // correct here -- unlike the Stats cards above, which reuse
  // leftHandedForBowler per shot because they can show a blended view.
  const viewedLeftHanded=leftHandedForBowler(goalBowler);
  const trendsLeftHanded=viewedLeftHanded;
  // Reuses the Stats computation above rather than keeping a second copy
  // that could drift from it -- both now go through the same
  // leftHandedForBowler + isCornerPinLeave path.
  const cornerPinAttempts=goalBowler===statsBowler?tenPinAttempts:statsShots.filter(s=>isCornerPinLeave(s,viewedLeftHanded)&&s.spareMade!=="");
  const cornerPinMade=cornerPinAttempts.filter(s=>s.spareMade==="Yes").length;
  const cornerPinSpareR=cornerPinAttempts.length?Math.round((cornerPinMade/cornerPinAttempts.length)*100):0;
  const goalHighGame=bowlerHighGame(sessions,goalBowler);
  const goalHighSeries=bowlerHighSeries(sessions,goalBowler);
  const goalMeasurements={
    average:{current:cAvg(sessions,goalBowler,statsLeague),sample:1},
    highGame:{current:goalHighGame?goalHighGame.value:null,sample:1},
    highSeries:{current:goalHighSeries?goalHighSeries.value:null,sample:1},
    // Strike rate is measured over first balls only, not every shot.
    strikeRate:{
      current:frameShots.length?Math.round((frameShots.filter(s=>s.result==="Strike").length/frameShots.length)*100):null,
      sample:frameShots.length,
    },
    spareRate:{current:spAtt.length?spR:null,sample:spAtt.length},
    singlePinSpareRate:{
      current:singlePinAttempts.length?singlePinSpareR:null,
      sample:singlePinAttempts.length,
    },
    // Attempts, not leaves: tenPinAttempts already filters to leaves with
    // a recorded outcome, so an unfinished frame isn't scored as a miss.
    tenPinSpareRate:{
      current:cornerPinAttempts.length?cornerPinSpareR:null,
      sample:cornerPinAttempts.length,
    },
    cleanFrameRate:{current:frameShots.length?cleanFrameR:null,sample:frameShots.length},
  };
  const activeGoals=goalsByBowler[goalBowler]||[];

  // Goals for the Log tab. Scoped to the bowler actually at the line and
  // the league they're bowling tonight -- NOT to the Stats tab's
  // "Viewing" picker, which can be pointed at a teammate. Sharing
  // goalMeasurements would show that teammate's progress to whoever is
  // logging shots.
  const logGoals=goalsByBowler[activeBowler]||[];
  // Measured across ALL of this bowler's play, not just tonight's league.
  //
  // Goals are stored per bowler (goalsByBowler), never per league, so
  // scoping the measurement to one league answered a different question
  // from the one the goal asks. It looked fine on a league night --
  // that's where the data was -- and went blank in practice, where the
  // league is the "Practice" container and holds none of their history.
  //
  // Deliberately league-agnostic rather than practice-specific: a bowler
  // in a Thursday session would have had the same problem, seeing only
  // Thursday's numbers against a goal covering their whole game.
  const logGoalMeasurements=measurementsFor({
    shots,sessions,bowler:activeBowler,league:null,
    isSplit,isSinglePinLeave,isCornerPinLeave,
    leftHanded:leftHandedForBowler(activeBowler),
    average:cAvg(sessions,activeBowler,null),
    highGame:bowlerHighGame(sessions,activeBowler)?.value??null,
    highSeries:bowlerHighSeries(sessions,activeBowler)?.value??null,
  });

  // Weighted frame-quality score (0-100), strict priority order:
  //   Strike (100)
  //   > non-split spare, ranked by how few pins were left (a leave that's
  //     mostly cleared on ball 1, e.g. a lone 10-pin, scores near the top
  //     of this band; a leave needing more pins covered scores near the
  //     bottom of it — but every non-split spare still outscores every
  //     split spare)
  //   > split spare, ranked the same way within its own lower band
  //   > open, ranked by total pinfall (0-9)
  // Each tier gets its own fixed band so a lower tier can never outscore a
  // higher one no matter the pin count — e.g. a converted 7-pin split still
  // beats every open frame, but loses to every made non-split spare.

  // Clean-frame rate broken out by FRAME NUMBER (1-10) instead of aggregated
  // or by game — answers "is there a specific spot in every game where I
  // tend to leave pins" (lane transition, warm-up, 9th-frame score-math
  // lapse), a different axis than Game-by-Game Averages. Each frame number
  // only gets one sample per game played, so this needs real volume before
  // it means anything — 20 games (~6-7 nights) is the threshold below which
  // it's flagged as unreliable rather than hidden outright, since the
  // recording itself doesn't cost anything to keep running in the meantime.
  const FRAME_POSITION_RELIABILITY_THRESHOLD=20;
  function framePositionStats(dataset){
    const stats=[];
    for(let f=1;f<=10;f++){
      const atF=dataset.filter(s=>parseInt(s.frame)===f&&(!s.ballNum||s.ballNum===1));
      const scoreVals=atF.map(frameQualityScore).filter(v=>v!=null);
      const avgScore=scoreVals.length?Math.round((scoreVals.reduce((a,b)=>a+b,0)/scoreVals.length)*10)/10:null;
      stats.push({frame:f,total:atF.length,avgScore});
    }
    return stats;
  }
  const framePosition=framePositionStats(statsShots);
  const framePositionGamesLogged=framePosition[0]?.total||0;
  const framePositionReliable=framePositionGamesLogged>=FRAME_POSITION_RELIABILITY_THRESHOLD;

  // Every genuinely "fresh rack" delivery — not just each frame's official
  // first ball, but also any 10th-frame bonus ball thrown at a full reset
  // rack. A 10th-frame ball 2 only ever exists in this data when ball 1 was
  // a strike, so it's always a fresh rack. Ball 3 is a fresh rack unless a
  // ball 2 exists and wasn't a strike (in which case it's a fill attempt at
  // whatever ball 2 left, not a fresh rack). This is what makes the count
  // range from 30 up to 36 across a 3-game series, matching LaneTalk.
  const freshRackCount=freshRackShots(statsShots);

  // The bowler's average of their most recent N (default 10) fresh-rack
  // first-ball deliveries, ordered chronologically, counting only
  // deliveries strictly BEFORE the given reference shot. Always
  // computable given at least one prior fresh-rack delivery exists
  // anywhere in the bowler's history — frames 1-9 of the SAME game alone
  // already provide up to 9 of them, so even a bowler's very first game
  // has this available by the time the 10th frame is reached.
  // The value to use for a theoretical 10th-frame fill ball: the bowler's
  // cumulative first-ball average from every OTHER game they've bowled,
  // blended with THIS specific game's own first-ball average so far
  // (frames 1-9 plus the 10th frame's own first ball, up to 10 values).
  // If no other games exist yet (this is their very first game), uses
  // only this game's data — there's nothing else to blend with.

  // Theoretical score for one specific game: what the bowler would have
  // scored had every makeable spare (including the 10th frame's first
  // ball, filled with their own recent first-ball average) been converted.
  // Returns null if that game isn't fully logged yet.
  // The ceiling on the game being bowled right now: strike out from here
  // and this is what you finish with.
  //
  // Only meaningful shot by shot -- a game entered as a final score has
  // no remaining balls to project. Returns null once the tenth is
  // complete, since there's nothing left to throw.
  const maxScoreThisGame=(()=>{
    if(preferences.trackingMode!=="shot")return null;
    if(!activeBowler||!effectiveSessionLeague)return null;
    const gameShots=shots.filter(s=>s.bowler===activeBowler
      &&s.league===effectiveSessionLeague&&s.date===sessionDate
      &&s.game===String(form.game));
    if(!gameShots.length)return null;
    return maxPossibleScore(gameShots);
  })();

  function theoreticalScoreForGame(bowler,league,date,game){
    const gameShots=shots.filter(s=>s.bowler===bowler&&s.league===league&&s.date===date&&s.game===String(game));
    if(!gameShots.length)return null;
    const f10b1=gameShots.find(s=>parseInt(s.frame)===10&&(!s.ballNum||s.ballNum===1));
    const avgFB=f10b1?theoreticalFillBallValue(shots,bowler,league,date,game):null;
    const team=teams.find(t=>t.league===league);
    const isLeftHanded=!!team?.memberHandedness?.[bowler];
    const theoretical=makeTheoreticalShots(gameShots,isLeftHanded,avgFB);
    return strictPartial(theoretical);
  }

  // First-Ball Average — standard definition, every fresh-rack delivery
  // counted with a strike scored as 10. This is the industry-standard
  // metric (matches LaneTalk and most scoring apps), so it's directly
  // comparable elsewhere.
  const allFirstBalls=freshRackCount.map(firstBallOf).filter(v=>v!=null);
  const firstBallAvg=allFirstBalls.length?(allFirstBalls.reduce((a,b)=>a+b,0)/allFirstBalls.length):null;

  // Leave Average — pins on ball 1 (or any fresh-rack ball) when it's NOT a
  // strike. Strike % is binary; this isolates how good the leave actually is
  // on a miss.
  const nonStrikeFirstBalls=freshRackCount.filter(s=>s.result!=="Strike").map(firstBallOf).filter(v=>v!=null);
  const leaveAvg=nonStrikeFirstBalls.length?(nonStrikeFirstBalls.reduce((a,b)=>a+b,0)/nonStrikeFirstBalls.length):null;

  // Split breakdown by specific pin combination (e.g. "5-7", "2-4-5"), not
  // just the aggregate split rate — shows which leaves actually recur.
  // Per-split-type conversion, from the domain so it's tested and so the
  // 4-7-10 and the 3-10 stop being one number. Mapped to the shape the
  // Splits card already renders.
  const splitBreakdownList=splitConversionByType(statsShots)
    .map(e=>({key:e.name,pins:e.key,count:e.left,converted:e.made,rate:e.rate??0}));

  // Breakdown of every recurring NON-split leave (e.g. "2-4-5"), single or
  // multi-pin — how often it happens and how often it's converted. Weak 10 /
  // Ringing 10 fold into "10" since they're the same physical leave.
  function nonSplitLeaveBreakdown(dataset){
    const groups={};
    dataset.forEach(s=>{
      if(s.result==="Strike")return;
      if(isSplit(s))return; // already covered by the split breakdown
      let key;
      if(s.result==="Weak 10"||s.result==="Ringing 10"){
        key="10";
      } else if(s.result==="Other Leave"){
        const pins=(Array.isArray(s.otherLeave)?s.otherLeave:[]).filter(p=>p!=="9 Pin No-Tap").map(Number).sort((a,b)=>a-b);
        if(!pins.length)return;
        key=pins.join("-");
      } else return;
      if(!groups[key])groups[key]={key,count:0,converted:0};
      groups[key].count++;
      if(s.spareMade==="Yes")groups[key].converted++;
    });
    return Object.values(groups).map(g=>({...g,rate:g.count?Math.round(g.converted/g.count*100):0}))
      .sort((a,b)=>b.count-a.count);
  }
  const nonSplitLeaveList=nonSplitLeaveBreakdown(statsShots);

  const isTeamView=!statsBowler&&bowlers.length>1;
  // How many distinct leagues the currently-viewed bowler has played — if
  // it's just one, "Combined" would be identical to that single league's
  // average, so there's no point showing it twice.
  const bowlerLeagueCount=statsBowler?new Set(sessions.filter(s=>s.bowler===statsBowler).map(s=>s.league)).size:0;

  // Comparison baseline is fully opt-in via "Compare To" — "None" is a real
  // default (no comparison, no badges) rather than silently comparing to a
  // blended team. Pick a specific bowler (compareBowler) or a specific
  // league's team (compareLeague, e.g. Tuesday Team vs Thursday Team).
  // Filtered by league name, not team_id — a shot's league is set directly
  // and reliably at log time, matching statsShots' approach for the same
  // team viewed directly. team_id depends on team-membership resolution
  // that's proven fragile (a bowler not yet recognized as a team member
  // when a shot was logged, a team recreated afterward, etc.), so relying
  // on it here could silently compare against a skewed subset of shots
  // that share a league but disagree on team_id for reasons that have
  // nothing to do with which team they actually belong to.
  // Same reasoning as compareShots above, for the two comparison-average
  // lookups in StatsView that filter SESSIONS by compareBowler
  // (rAvg/cAvg against a per-league or combined average). Kept as its own
  // array rather than merged into the primary `sessions`, for the same
  // reason: no path by which a friend's nights become part of this
  // account's own season record.
  const compareSessions=compareFriendId?(friendSessions[compareFriendId]||[]):sessions;

  // A friend's shots live in the cloud under THEIR user_id, fetched
  // separately into friendShots -- never merged into this account's own
  // `shots` array, so there is no path by which a friend's data can leak
  // into this account's own primary stats. Only compareShots, which
  // feeds the comparison-only team* metrics below, ever reads it.
  const compareShots=compareFriendId
  ?(friendShots[compareFriendId]||[])
  :compareBowler
    ?shots.filter(s=>s.bowler===compareBowler)
    :compareLeague
      ?shots.filter(s=>s.league===compareLeague)
      :shots; // unused when showTeamCompare is false
  const teamTot=compareShots.length;
  const teamStkR=teamTot?Math.round((compareShots.filter(s=>s.result==="Strike").length/teamTot)*100):0;
  const teamSpAtt=compareShots.filter(s=>s.result!=="Strike"&&s.spareMade!==""&&!isSplit(s));
  const teamSpR=teamSpAtt.length?Math.round((teamSpAtt.filter(s=>s.spareMade==="Yes").length/teamSpAtt.length)*100):0;
  const teamSplitShotsAll=compareShots.filter(isSplit);
  const teamSplitR=teamTot?Math.round((teamSplitShotsAll.length/teamTot)*100):0;
  const teamSplitConvR=teamSplitShotsAll.length?Math.round((teamSplitShotsAll.filter(s=>s.spareMade==="Yes").length/teamSplitShotsAll.length)*100):0;
  const teamTenPinAttemptsAll=compareShots.filter(s=>isCornerPinLeave(s,leftHandedForBowler(s.bowler))&&s.spareMade!=="");
  const teamTenPinSpareR=teamTenPinAttemptsAll.length?Math.round((teamTenPinAttemptsAll.filter(s=>s.spareMade==="Yes").length/teamTenPinAttemptsAll.length)*100):0;
  const teamTenPinRate=teamTot?Math.round((compareShots.filter(s=>isCornerPinLeave(s,leftHandedForBowler(s.bowler))).length/teamTot)*100):0;
  const teamSinglePinAttemptsAll=compareShots.filter(s=>isSinglePinLeave(s)&&s.spareMade!=="");
  const teamSinglePinSpareR=teamSinglePinAttemptsAll.length?Math.round((teamSinglePinAttemptsAll.filter(s=>s.spareMade==="Yes").length/teamSinglePinAttemptsAll.length)*100):0;
  const teamFrameShotsAll=compareShots.filter(s=>!s.ballNum||s.ballNum===1);
  const teamCleanFrameR=teamFrameShotsAll.length?Math.round((teamFrameShotsAll.filter(s=>s.result==="Strike"||s.spareMade==="Yes").length/teamFrameShotsAll.length)*100):0;
  const teamFreshRackCount=freshRackShots(compareShots);
  const teamAllFirstBalls=teamFreshRackCount.map(firstBallOf).filter(v=>v!=null);
  const teamFirstBallAvg=teamAllFirstBalls.length?(teamAllFirstBalls.reduce((a,b)=>a+b,0)/teamAllFirstBalls.length):null;
  const teamNonStrikeFirstBalls=teamFreshRackCount.filter(s=>s.result!=="Strike").map(firstBallOf).filter(v=>v!=null);
  const teamLeaveAvg=teamNonStrikeFirstBalls.length?(teamNonStrikeFirstBalls.reduce((a,b)=>a+b,0)/teamNonStrikeFirstBalls.length):null;
  const showTeamCompare=!!compareBowler||!!compareLeague;
  // The comparison label. When comparing against a TEAM rather than a
  // bowler, this must be the team's name -- it was the league's, so every
  // "▲ 4 vs Tuesday" badge named a league the bowler doesn't think of as
  // the thing they're being compared to.
  //
  // Matched on the normalised name because team.league is the raw cloud
  // league name, which may or may not carry the " House Shot" suffix.
  const teamNameForLeagueName=(l)=>{
    const norm=v=>String(v||"").replace(" House Shot","").trim().toLowerCase();
    const t=(teams||[]).find(t=>t.name&&norm(t.league)===norm(l));
    return t?t.name:String(l||"").replace(" House Shot","");
  };
  const compareLabel=compareBowler||(compareLeague?teamNameForLeagueName(compareLeague):"");
  const hideIndividualOnly=isTeamView||!!compareBowler;
  const SHOT_SAMPLE_THRESHOLD=20;
  const bStats=ballUniverse(statsBowler).map(ball=>{
    const bs=statsShots.filter(s=>s.ball===ball);
    const bSt=bs.filter(s=>s.result==="Strike").length;
    const nonStrike=bs.filter(s=>s.result!=="Strike");
    const leaveVals=nonStrike.map(firstBallOf).filter(v=>v!=null);
    const leaveAvg=leaveVals.length?Math.round((leaveVals.reduce((a,b)=>a+b,0)/leaveVals.length)*10)/10:null;
    const tenPin=bs.filter(isTenPinLeave).length;
    const splits=bs.filter(isSplit).length;
    const spAtt=bs.filter(s=>s.result!=="Strike"&&s.spareMade!==""&&!isSplit(s));
    const spMade=spAtt.filter(s=>s.spareMade==="Yes").length;
    return{
      ball,total:bs.length,strikes:bSt,
      rate:bs.length?Math.round((bSt/bs.length)*100):null,
      wk:bs.filter(s=>s.result==="Weak 10").length,
      leaveAvg,
      tenPinRate:bs.length?Math.round((tenPin/bs.length)*100):null,
      splitRate:bs.length?Math.round((splits/bs.length)*100):null,
      spareRate:spAtt.length?Math.round((spMade/spAtt.length)*100):null,
      reliable:bs.length>=SHOT_SAMPLE_THRESHOLD,
    };
  }).filter(b=>b.total>0);
  const mCounts=MISSES.map(m=>({miss:m,count:statsShots.filter(s=>Array.isArray(s.miss)?s.miss.includes(m):s.miss===m).length})).filter(m=>m.count>0);

  // ── First-launch gate ─────────────────────────────────────────────────
  // Renders instead of the whole app -- no nav, no header, no Log tab
  // behind it. The flag is read synchronously from localStorage on the
  // first render (see the useState initializer), so the correct screen is
  // chosen on the very first paint rather than after a blank frame.
  //
  // Uses the latched value only -- see the useState above for why this
  // must not depend on asynchronously-loaded data.
  if(showOnboarding&&!onboarded){
    return(
      <Onboarding
        preferences={preferences}
        onApply={updatePreferences}
        onFinish={finishOnboarding}
        profile={onboardingProfile}
        onClaimCode={claimSignupCode}
        onProfileChange={setOnboardingProfile}
        centers={centers}
        searchCenters={searchCenters}
        ensureCenter={ensureCenter}/>
    );
  }

  return(
    <div style={S.app}>
      {/* Header.
        
          Rebuilt around the two things a header is actually for: telling
          you where you are, and surfacing anything that needs you.

          What went:
          - The wordmark on every screen. You know what app you opened;
            repeating it on all five tabs bought nothing and cost the
            most valuable row on the page. It stays on the Bowl tab,
            which is the closest thing to a home screen.
          - stackHeaderIcons. It was hardcoded false once the nav moved
            to the bottom, so the whole stacked-layout branch was dead
            code pretending to be a layout decision.
          - The permanent "Saved & backed up" line. Confirming success
            on every screen forever trains people to stop reading it.
            It now speaks up only when something is actually pending. */}
      {/* Marked so scroll targets can measure it.
        
          The header is sticky, so anything scrolled to the top of the
          page lands underneath it. LogView measures this element to
          offset by its real height -- which matters because the title
          wraps to two lines on a narrow screen, making a hardcoded
          guess wrong by a whole line. */}
      <div data-app-header style={S.header}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"8px",minWidth:0,width:"100%"}}>
          <div style={{minWidth:0,display:"flex",alignItems:"baseline",gap:"8px"}}>
            {/* The app name on HOME and while scoring.
              
                Home is the front door and the screen the app opens on --
                showing "Home" there names the tab rather than the app,
                which is the one place the name belongs. */}
            {/* Back, for screens that are not tabs.
              
                The nav reaches five places; everything else -- scoring,
                Journey, Stats, Badges, Settings -- is reached FROM one of
                them and had no way back except finding the right tab.
              
                This walks the tree rather than history: from scoring you
                go Home because that is where you chose the mode, and from
                Badges you go to Journey because that is where the link
                is. Browser-style "last screen" would send you back to
                wherever you happened to come from, which is not the same
                thing and is worse when you arrived from a share link. */}
            {parentView&&(
              <button onClick={()=>setView(parentView)}
                aria-label="Back"
                style={{background:"none",border:"none",padding:"0 8px 0 0",
                  cursor:"pointer",color:C.text,fontSize:"22px",lineHeight:1,
                  WebkitTapHighlightColor:"transparent"}}>
                {"\u2039"}
              </button>
            )}
            {(view==="home"||view==="log")
              ? <div style={S.title}>🎳 {APP_NAME}</div>
              : <div style={S.title}>{navTabs.find(t=>t.id===view)?.label
                  ||(view==="settings"?"Settings":view==="profile"?"Profile"
                    :view==="inbox"?"Inbox":view==="coaching"?"Coach"
                    :view==="help"?"Help":view==="social"?(casualMode?"Standings":"Friends"):view==="import"?"Import scorecard":"")}</div>}
          </div>

          <div style={{display:"flex",gap:"12px",flexShrink:0,alignItems:"center"}}>
            {/* Only shown when something is genuinely in flight. */}
            {pendingSyncCount>0&&(
              <button onClick={openSyncDetail}
                style={{background:"none",border:"none",padding:0,fontSize:"11px",fontWeight:600,color:C.spare,cursor:"pointer"}}
                aria-label={`${pendingSyncCount} changes backing up`}>
                ⟳ Backing up
              </button>
            )}
            {/* Inbox stays in the header with profile and settings: it's
                "things waiting for you", which is a different job from
                reviewing past scores. Shown only when there IS something
                waiting -- a permanently-empty tray is just noise. */}
            {inboxCount>0&&(
              <button onClick={()=>setView("inbox")}
                style={{background:"none",border:"none",cursor:"pointer",fontSize:"17px",padding:0,lineHeight:1,position:"relative"}}
                aria-label={`Inbox, ${inboxCount} waiting`}>
                📥
                <span style={{position:"absolute",top:"-4px",right:"-6px",minWidth:"15px",height:"15px",borderRadius:"8px",backgroundColor:C.miss,color:"#fff",fontSize:"9px",fontWeight:700,lineHeight:"15px",textAlign:"center",padding:"0 3px"}}>{inboxCount}</span>
              </button>
            )}
            {/* Search stays in Just Bowling -- it's the only way back
                for someone who picked that mode by accident and watched
                four tabs disappear. Its CONTENT is filtered instead; see
                the mode filter in domain/help.js.
              
                Import is genuinely hidden: there's no scorecard to
                photograph on a casual night. */}
            {<button onClick={()=>setView("help")}
              style={{background:"none",border:"none",cursor:"pointer",fontSize:"17px",padding:0,lineHeight:1}}
              aria-label="Search help">🔍</button>}

            {/* Import lives here rather than on the Log tab. On Log it was
                gated on the current environment AND on a league already
                being chosen, so importing a league scorecard meant
                setting up a league night first, and importing a
                tournament card while in practice mode wasn't possible at
                all. From the header it asks what's being imported
                instead of inheriting whatever mode Log is in. */}
            {/* Labelled, not just an icon. A bare camera reads as "take a
                photo" -- several bowlers looked for import on the Bowl
                tab and gave up. There's room in the header for the words. */}
            {!casualMode&&<button onClick={()=>setView("import")}
              style={{background:"none",border:`1px solid ${C.border}`,cursor:"pointer",
                fontSize:"12px",fontWeight:600,color:C.text,
                padding:"5px 9px",borderRadius:"7px",lineHeight:1,
                display:"flex",alignItems:"center",gap:"4px",whiteSpace:"nowrap"}}
              aria-label="Import scorecard">
              <span style={{fontSize:"13px"}}>📷</span>
              <span>Import</span>
            </button>}
            <button onClick={()=>setView("profile")} style={{background:"none",border:"none",cursor:"pointer",fontSize:"17px",padding:0,lineHeight:1}} aria-label="Profile">👤</button>
            <button onClick={()=>setView("settings")} style={{background:"none",border:"none",cursor:"pointer",fontSize:"17px",padding:0,lineHeight:1}} aria-label="Settings">⚙️</button>
          </div>
        </div>
      </div>

      {/* The walkthrough, over the top of the real app rather than
          instead of it -- a new bowler reads each step while looking at
          the tab it describes. */}
      {/* Shown once, after onboarding, in place of the tour.
        
          Full screen rather than a card, because it is the only thing on
          it: one sentence saying we are getting out of the way, and two
          places to look if they get stuck. */}
      {/* The one screen between finishing setup and the app.
        
          Shown once, to someone who has just signed up and is keen to
          start. Two ways out and no third: begin the look-around tour,
          or go straight to Home. The decline says WHERE the tours live,
          because "no thanks" with no signpost means they are never found.
        
          Beginning the tour clears showWelcome as well as opening it --
          the welcome only hides itself while a tour is running, so
          leaving it set meant this screen reappeared the moment the tour
          finished. */}
      {showWelcome&&onboarded&&!activeTour&&(
        <div style={{position:"fixed",inset:0,zIndex:60,background:C.bg,
          display:"flex",alignItems:"center",justifyContent:"center",padding:"24px"}}>
          <div style={{maxWidth:"420px",width:"100%"}}>
            <div style={{fontSize:"22px",fontWeight:600,color:C.text,marginBottom:"10px"}}>
              You're all set
            </div>
            <div style={{fontSize:"15px",color:C.text,lineHeight:1.6,marginBottom:"16px"}}>
              We know you're keen to get started — so we won't hold you up
              for long. We'd just like to show you around first.
            </div>
            {/* The bargain, stated plainly.
              
                Every accessory field is on by default, which is a lot to
                ask of someone who has just signed up. This says why it is
                worth it and that none of it is required -- a bowler who
                logs scores only still gets a working app. */}
            <div style={{fontSize:"14px",color:C.text,lineHeight:1.6,marginBottom:"24px"}}>
              And remember, you can document as much or as little as you
              want. The more you tell us, the more we can give back.
            </div>
            <button style={{...S.btn("primary"),width:"100%"}}
              onClick={()=>{ setShowWelcome(false); startTour(FIRST_TOUR); }}>
              Begin
            </button>
            <button
              style={{background:"none",border:"none",color:C.textMuted,cursor:"pointer",
                fontSize:"13px",marginTop:"14px",padding:"8px",width:"100%",lineHeight:1.5}}
              onClick={()=>{ setShowWelcome(false); setView("home"); scrollToTop(); }}>
              No thanks — I'll take the tour later from the settings menu
            </button>
          </div>
        </div>
      )}

      {activeTour&&onboarded&&(
        // A dimmed backdrop rather than null while the chunk loads.
        //
        // The tour is a full-screen takeover, so with fallback={null} a
        // bowler taps "Watch" and nothing visibly happens -- and taps
        // again. A backdrop makes the tap feel registered, and it's the
        // same colour the tour lands on, so there's no flash.
        <Suspense fallback={
          <div style={{position:"fixed",inset:0,zIndex:200,backgroundColor:C.bg}}/>
        }>
          <Tour
            preferences={preferences}
            track={activeTour}
            onNavigate={setView}
            onFinish={finishTour}/>
        </Suspense>
      )}

      {showSyncDetail&&syncBreakdown&&(()=>{
        // Plain language first, technical detail on request.
        //
        // This used to show the raw Postgres error, the table name and a
        // Discard button by default. A bowler seeing
        // `duplicate key value violates unique constraint ... (23505)`
        // has no way to know whether their scores are safe or what to tap.
        //
        // Auto-clearing instead would be worse: a queued write is a game
        // that hasn't reached the cloud, and silently dropping it loses a
        // score with nothing to tell them. So it explains, retries, and
        // only discards on a deliberate tap.
        const firstErr=syncBreakdown.firstError||null;
        const info=classifySyncError(firstErr);
        return(
        <div style={{...S.card,margin:"12px 16px",border:`1px solid ${info.kind==="transient"?C.border:C.spare+"44"}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px"}}>
            <div style={{fontSize:"14px",fontWeight:600}}>{info.title}</div>
            <button style={{...S.btn(),padding:"4px 10px",fontSize:"11px"}} onClick={()=>setShowSyncDetail(false)}>Close</button>
          </div>

          <div style={{fontSize:"12.5px",color:C.textMuted,lineHeight:1.5,marginBottom:"10px"}}>
            {info.detail}
          </div>

          {/* The reassurance that matters most, stated plainly. */}
          <div style={{fontSize:"12px",color:C.strike,marginBottom:"12px"}}>
            ✓ {syncBreakdown.total} {syncBreakdown.total===1?"change is":"changes are"} saved on this phone. Nothing is lost.
          </div>

          {info.canRetry&&(
            <button style={{...S.btn("primary"),marginBottom:"8px"}} onClick={handleSyncNow} disabled={syncingNow}>
              {syncingNow?"Trying…":"Try again now"}
            </button>
          )}

          {/* No technical detail, and no Discard button.
            
              Both existed so a bowler could clear an item that would
              never sync. Nothing gets stuck like that any more: a
              permanent failure that syncErrors marks canDiscard now
              expires itself after three flushes, and the one kind that
              does not -- a 42501 -- never offered the button anyway,
              because discarding it would bin a real game over a policy
              bug that might still be fixed.
            
              What is left is what a bowler can actually use: what is
              happening, that nothing is lost, and a way to retry. The
              detail behind the old button now goes to the error reports
              instead, where it reaches someone who can act on it. */}
        </div>
        );
      })()}

      <div style={S.content}>
        {/* A crash in one screen used to unmount the whole app, leaving
            a blank white page with no message and no way back. This
            keeps the nav alive and shows what broke -- on a phone there
            are no dev tools, so if the app does not say, nobody can.
            Keyed on view so switching tabs clears a stuck error. */}
        <ErrorBoundary key={view}>
      {/* One boundary around every view. A lazy screen shows this for the
          moment its code is fetched on first visit, then it's cached for
          the session. Deliberately plain -- a spinner that flashes for
          80ms is more distracting than a quiet gap. */}
      <Suspense fallback={<div style={{padding:"32px 0",textAlign:"center",color:C.textMuted,fontSize:"13px"}}>Loading…</div>}>

        {/* Top of the content area so it sits above whichever screen is
            showing, and inside the boundary so a fault in it cannot
            blank the app.

            NO VIEW CONDITION, deliberately. The trial takes a card and
            converts on its own, so the date it converts belongs in front
            of the bowler until it happens -- not on the two screens we
            guessed they would visit. There is no dismiss button either:
            an unexpected charge is a refund AND a one-star review from
            somebody who was going to keep paying.

            TrialBanner returns null unless there is something true to
            say, so this is unconditional at the call site on purpose --
            the decision of whether to appear lives in one file, with the
            dates, rather than being half here and half there. */}
        <TrialBanner entitlement={entitlement} />

        {view==="insights"&&(<>
          {/* Improve is the whole improvement loop, so the two things
              that used to be their own tabs live here as entry points:
              coaching (the person helping you) and social (the people
              you bowl with). Still their own views underneath, so the
              screens themselves are untouched. */}
          <div style={{display:"flex",gap:"8px",marginBottom:"12px"}}>
            {showCoachingTab&&(
              <button style={{...S.btn(),flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:"6px"}} onClick={()=>setView("coaching")}>
                🧑‍🏫 Coach{coachViewOn&&unreadResponseCount>0?` · ${unreadResponseCount}`:""}
              </button>
            )}
          </div>

          {/* Goals live here now, not on the Log tab. A goal is something
              you set and review between sessions, not while standing on
              the approach mid-frame -- and Improve is where the whole
              loop lives: see what's costing you, set a target, drill it,
              check the trend. */}
          {/* Shown even with no goals set. Gating on logGoals.length>0
              meant the panel only appeared once a goal existed -- and the
              only way to create one is the "+ Add a goal" button inside
              the panel, so a bowler with no goals had no route to a first
              one. GoalsPanel handles the empty case itself. */}
          {activeBowler&&(
            <GoalsPanel
              goals={logGoals}
              measurements={logGoalMeasurements}
              leftHanded={leftHandedForBowler(activeBowler)}
              onChange={next=>saveGoals(activeBowler,next)}/>
          )}

          {/* Practice drills, reachable without first switching the app
              into practice mode and hunting for the toggle. */}
          {activeBowler&&(
            <button style={{...S.btn(),width:"100%",marginBottom:"12px",display:"flex",alignItems:"center",justifyContent:"center",gap:"6px"}}
              onClick={()=>{
                // Drills only make sense in practice, so switch the
                // environment with the tap rather than making them find
                // the setting first.
                updatePreferences(prev=>applyEnvironment(prev,"practice"));
                setPracticeMode("drill");
                if(!activeDrill)startDrill();
                setView("log");
              }}>
              🎯 Start a practice drill
            </button>
          )}

          <InsightsView stats={insightStats} onAnalyze={analyzePerformance} bowlerName={statsBowler||activeBowler}
            newlyAvailable={newInsights} onDismissNew={()=>setNewInsights([])}
            hasCoach={insightCoaches.length>0}
            coachName={insightCoaches.map(c=>c.displayName).join(" and ")}/>
        </>)}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* SOCIAL VIEW — Teams + Friends share one nav slot                  */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* Friends only. Teams moved to Vault, beside the Leagues editor,
            because roster setup is part of setting up a league -- not a
            social activity. With one thing left here the tab switcher is
            just a row that does nothing. */}
        {/* Two pools, one screen.

            Casual keeps its own badges -- its thresholds were tuned for
            people who bowl a few times a year and read as trivial or
            mocking against a real average. Competitive modes get the
            league/tournament/practice set instead.

            Sharing and importing are casual-only: they exist because one
            phone keeps score for a group of friends, which is not how a
            league night works. */}
        {view==="badges"&&(casualMode?(
          <BadgeCollection nights={casualNightsFrom(manualScores,CASUAL_SESSION_KEY)} me={activeBowler}
            onImportNights={importCasualNights}
            pendingImport={pendingBadgeImport} onPendingImportDone={()=>setPendingBadgeImport(null)}/>
        ):(
          <BadgeCollection
            badges={COMPETITIVE_BADGES}
            history={allCompetitiveBadges({
              sessions,shots,matches,drills,teams,leagueDates,
              bowler:activeBowler,
              // NO league filter. A collection is lifetime, not tonight.
              //
              // This passed sessionLeague -- the league selected for the
              // session in progress. On the Badges tab that is usually
              // empty or some other league, so every one of the bowler's
              // nights was filtered out and nothing could ever show as
              // earned. Badges span every league you have ever bowled.
              league:"",
              profile:normalizeProfile(profiles[activeBowler],activeBowler),
            })}
            lockedNote={whereEarnable}
            me={activeBowler}/>
        ))}

        {view==="social"&&!casualMode&&(
          <Friends onRequestsChanged={loadFriendRequests}/>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* PROFILE + SETTINGS                                                */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* Its own screen, reached from an icon that only exists while
            something is waiting. A confirmation request for a night that
            already happened is admin, not logging -- and a permanent
            icon for a usually-empty inbox is clutter. */}
        {view==="inbox"&&(
          <>
            {/* Links out to whichever screen already owns each workflow.
                The inbox notifies; it doesn't re-implement accepting a
                coaching invitation in a second place. */}
            <InboxList items={myInboxItems} onOpen={item=>{
              // A task set BY a coach is homework for the bowler, so open
              // the Coach tab on the bowling side rather than dropping
              // them into coach view looking at their own bowlers.
              if(item.type==="coachTask")updatePreferences(prev=>setCoachView(prev,false));
              setView(item.view);
            }}/>
            <ImportedScoresInbox

              records={importedScores}

              bowler={activeBowler}

              // This bowler's own scores, so the card can say where the
              // photo disagrees with what they typed. Manual entry still
              // wins by default -- this only makes the disagreement
              // visible instead of resolving it in silence.
              myScores={(() => {
                const out = {};
                for (const x of sessions) {
                  if (!x || x.bowler !== activeBowler || !Array.isArray(x.scores)) continue;
                  const key = `${x.league ?? ""}|${x.date ?? ""}`;
                  out[key] = out[key] || {};
                  x.scores.forEach((v, i) => { if (v != null) out[key][String(i + 1)] = v; });
                }
                return out;
              })()}
              onApprove={approveImportedScores}
              onReject={rejectImportedScores}
              onCorrectTeammate={correctTeammateScores}
              canCorrect={r=>canCorrectImport(r)}
              teamInvites={myTeamInvites}
              onAcceptInvite={acceptTeamInvite}
              onDeclineInvite={declineTeamInvite}
              inviteBusyId={inviteBusyId}/>
            {inboxCount===0&&(
              <div style={S.card}>
                <div style={S.label}>Nothing Waiting</div>
                <div style={{fontSize:"12px",color:C.textMuted}}>
                  Requests, coach tasks and scores to confirm show up here.
                </div>
              </div>
            )}
            <button style={{...S.btn(),width:"100%"}} onClick={()=>setView("log")}>Done</button>
            <div style={{height:"32px"}}/>
          </>
        )}

        {(view==="profile"||view==="locker")&&(
          <Profile
            ballStats={bStats}
            only={view==="locker"
              ?["arsenal","bags"]
              :["identity","aliases","coaching","bookAverage","homeCenters","notes"]}
            bowlers={bowlers} activeBowler={activeBowler} selectBowler={selectBowler}
            profiles={profiles} setProfile={setProfile} teams={teams}
            arsenals={arsenals} ballLayouts={ballLayouts} setBallLayout={setBallLayout} removeBall={removeBall}
            newBallName={newBallName} ballAddMessage={ballAddMessage} retiredBalls={retiredBalls} setBallRetired={setBallRetired} setNewBallName={setNewBallName} addBall={addBall}
            bags={bags} ballBags={ballBags} saveBag={saveBag} deleteBag={deleteBag} toggleBallBag={toggleBallBag}
            centers={centers} ensureCenter={ensureCenter} searchCenters={searchCenters}
            ballSpecs={ballSpecs} setBallSpec={setBallSpec} ballGroups={ballGroups}
            saveBallGroup={saveBallGroup} deleteBallGroup={deleteBallGroup} seedDefaultGroups={seedDefaultGroups}
            catalogEntries={catalogEntries} catalogAck={catalogAck} userId={user?.id} publishBallSpecs={publishBallSpecs} voteOnEntry={voteOnEntry} acknowledgeRejection={acknowledgeRejection}
            bookAverageDue={bookAverageCheck.needed} bookAverageTriggerLeague={bookAverageCheck.league} bookAverageSuggestion={bookAverageSuggestion} acknowledgeBookAverageUpdate={acknowledgeBookAverageUpdate}/>
        )}

        {/* Vault also renders the Leagues editor -- where you bowl belongs
            with your equipment, not buried in app settings. Same Settings
            component in a card-filtered mode, so there is still exactly
            one Leagues editor rather than two that can drift. */}
        {/* Friends moved to Stats, beside Compare To.
      
            It was in the Vault, alongside leagues and equipment -- but a
            person isn't equipment, and for a league bowler "Friends"
            isn't really a destination: teammates are auto-friended,
            requests arrive in the inbox, and the list exists almost
            entirely to populate the Compare To dropdown.
          
            Putting it where that dropdown lives makes it contextual: you
            open Compare To, find nobody there, and the fix is right
            beside it. */}

        {/* The permanent control, on the Leagues screen where the rest of
            their leagues are. Unlike the Home version this has no
            keptLeagueName test: once a league is paused, changing which
            one it is has to stay reachable -- a bowler who picks Tuesday
            and then switches nights in January needs a way back. */}
        {view==="teams"&&lockedLeagueNames.length>0&&(
          <KeptLeaguePicker
            leagues={notUserHidden}
            keptLeagueName={keptLeagueName}
            defaultLeagueName={mostRecentLeagueName}
            leagueIds={leagueIdsRef.current||{}}
            userId={user?.id||""}
            onSaved={onKeptLeagueSaved} />
        )}

        {view==="teams"&&(
          /* RAW shots and sessions below, deliberately.
             
             Backup & Restore lives on this screen. An export that quietly
             omitted a league the bowler has stopped paying to SEE would be
             withholding their own data -- a data-rights problem, and the
             fastest route to a one-star review. hasData is raw for the
             same reason: "is there anything to clear" is about everything
             they have, not what the plan happens to show. */
          <Settings
            mode="leagues"
            onCreateTeam={createTeamForLeague} onAddLeague={addLeague}
            restartOnboarding={restartOnboarding} replayTour={replayTour} isCoach={showCoachingTab}
            showBackup={showBackup} setShowBackup={setShowBackup}
            backupStatus={backupStatus} setBackupStatus={setBackupStatus}
            importText={importText} setImportText={setImportText}
            exportData={exportData} importData={importData}
            confirmClear={confirmClear} setConfirmClear={setConfirmClear}
            clearAllData={clearAllData} hasData={shots.length>0}
            entitlement={entitlement}
            sessions={sessions} bowlers={bowlers} leagues={leagues} tournaments={tournaments}
            statsBowler={statsBowler} setStatsBowler={chooseStatsBowler}
            statsLeague={statsLeague} setStatsLeague={chooseStatsLeague}
            filterBowler={filterBowler} setFilterBowler={setFilterBowler}
            filterBall={filterBall} setFilterBall={setFilterBall}
            filterResult={filterResult} setFilterResult={setFilterResult}
            filtered={filtered} ballUniverse={ballUniverse}
            startEdit={startEdit} deleteShot={deleteShot}
            centers={centers} leagueCenters={leagueCenters} setLeagueCenter={setLeagueCenter} searchCenters={searchCenters}
            leagueDates={leagueDates} setLeagueDates={saveLeagueDates}
            leagueFormats={leagueFormats} setLeagueFormat={saveLeagueFormat} updateCenter={updateCenter} renameLeague={renameLeague}
            hiddenLeagues={hiddenLeagues} leagueIds={leagueIdsRef.current} toggleLeagueHidden={toggleLeagueHidden}
            shots={shots}
            teams={teams} activeBowler={activeBowler} leaveTeam={leaveTeam} leftHandedForBowler={leftHandedForBowler}/>
        )}

        {/* Teams, directly under the Leagues editor.
      
            These belong together: you add a league, then immediately want
            a team for it. Teams previously lived on the Friends screen --
            a different tab entirely -- so setting up a league meant
            finishing here, navigating away, and finding a tab that mixes
            roster management with friend requests.
          
            Friends stays where it is: adding a friend is a different task
            from managing a roster, and it isn't part of league setup. */}
        {view==="teams"&&(
          <TeamManagement
            // activeLeagues, not the raw list: Practice and Just Bowling
            // are containers, and offering to add a team to one is
            // offering something that can't work.
            leagues={activeLeagues}
            onTeamsChange={persistTeams}
            focusTeamId={focusTeamId}
          />
        )}

        {/* The History tab carries the inbox badge, so tapping it has to
            lead somewhere that shows what's waiting. Rather than a second
            destination, the pending items sit at the top of History --
            imported scores are history anyway, just unconfirmed. */}
        {view==="history"&&inboxCount>0&&(
          <button style={{...S.btn(),width:"100%",marginBottom:"12px",display:"flex",alignItems:"center",justifyContent:"center",gap:"6px"}}
            onClick={()=>setView("inbox")}>
            📥 {inboxCount} waiting for you
          </button>
        )}

        {/* Journey is its own screen now, not a chip inside History.
          
            It is the app's name and the reason someone keeps it for
            years, and it was three taps deep behind a label that gave no
            hint it was there. */}
        {view==="journey"&&(
          <Suspense fallback={null}>
            <JourneyScreen
              sessions={visibleSessions} shots={visibleShots} tournaments={tournaments}
              bowler={displayName||activeBowler}
              onOpenBadges={()=>setView("badges")} />
          </Suspense>
        )}

        {(view==="settings"||view==="history")&&(
          /* RAW shots and sessions below, deliberately.
             
             Backup & Restore lives on this screen. An export that quietly
             omitted a league the bowler has stopped paying to SEE would be
             withholding their own data -- a data-rights problem, and the
             fastest route to a one-star review. hasData is raw for the
             same reason: "is there anything to clear" is about everything
             they have, not what the plan happens to show. */
          <Settings
            mode={view==="history"?"history":"settings"}

            drills={drills}
            restartOnboarding={restartOnboarding} replayTour={replayTour} isCoach={showCoachingTab}
            showBackup={showBackup} setShowBackup={setShowBackup}
            backupStatus={backupStatus} setBackupStatus={setBackupStatus}
            importText={importText} setImportText={setImportText}
            exportData={exportData} importData={importData}
            confirmClear={confirmClear} setConfirmClear={setConfirmClear}
            clearAllData={clearAllData} hasData={shots.length>0}
            entitlement={entitlement}
            sessions={sessions} bowlers={bowlers} leagues={leagues}
            statsBowler={statsBowler} setStatsBowler={chooseStatsBowler}
            statsLeague={statsLeague} setStatsLeague={chooseStatsLeague}
            filterBowler={filterBowler} setFilterBowler={setFilterBowler}
            filterBall={filterBall} setFilterBall={setFilterBall}
            filterResult={filterResult} setFilterResult={setFilterResult}
            filtered={filtered} ballUniverse={ballUniverse}
            startEdit={startEdit} deleteShot={deleteShot}
            centers={centers} leagueCenters={leagueCenters} setLeagueCenter={setLeagueCenter} searchCenters={searchCenters}
            leagueDates={leagueDates} setLeagueDates={saveLeagueDates} renameLeague={renameLeague}
            hiddenLeagues={hiddenLeagues} leagueIds={leagueIdsRef.current} toggleLeagueHidden={toggleLeagueHidden}
            shots={shots}
            teams={teams} activeBowler={activeBowler} leaveTeam={leaveTeam} leftHandedForBowler={leftHandedForBowler}/>
        )}

        {/* Practice and casual: nothing to ask. The container league is
            fixed and the bowler is whoever is selected in "Keeping score
            for", so the import opens straight on the screenshot picker
            instead of asking two questions with one answer each. */}
        {/* No preset league or bowler: the import asks what kind of card
            it is and files accordingly, rather than inheriting whichever
            mode the Log tab was left in. Reaching it from the header
            means Log may not even be the last screen the bowler was on. */}
        {/* Just Bowling's Friends tab: the leaderboard. The normal
            Friends screen is about requests and rosters, neither of
            which a casual bowler has. */}
        {view==="social"&&casualMode&&(
          <CasualLeaderboard
            nights={casualNightsFrom(manualScores,CASUAL_SESSION_KEY)}
            me={displayName||activeBowler}/>
        )}

        {view==="help"&&(
          <HelpView
            environment={preferences.environment}
            onNavigate={setView}
            onClose={()=>setView("log")}
            onReplayTour={replayTour}/>
        )}

        {view==="import"&&(
          /* RAW shots, deliberately. Import dedupes against everything
             already logged, so a filtered list would let it re-import a
             night into a league the bowler cannot currently see -- and
             they would never find the duplicate to fix it. */
          <ImportScorecard
            bowlers={bowlers} activeBowler={activeBowler} profiles={profiles} leagues={leagues} teams={teams} tournaments={tournaments} shots={shots} saveShots={saveShots} onSubmitTeammateScores={submitTeammateScores}
            updateManualScore={updateManualScore}
            setSessionLeague={setSessionLeague} setSessionDate={changeSessionDate} selectBowler={selectBowler}
            setView={setView} setSessionSaveMessage={setSessionSaveMessage}
          />
        )}

        {/* Home IS the night while one is live.
          
            Scoring gets the screen from the first shot until "End
            session", then Home reverts to the dashboard. That is why
            there is no Bowl tab: leaving scoring to check a ball and
            coming back is one tap, not two, because Home is where you
            already were.
          
            sessionIsLive reads SHOTS, not a session row -- a row is only
            written by "End session", so waiting for one would mean Home
            never took over. */}
        {/* The one-time ask, above everything else on Home, because a
            bowler whose Thursday night has just gone quiet should not
            have to go looking for the reason.

            Once they have answered -- keptLeagueName set -- this stops
            appearing here and lives in Settings instead, which is where
            you go to change a setting rather than to be asked about one.
            Without the keptLeagueName test it would sit on Home forever,
            since a paused league is still paused after they choose. */}
        {view==="home"&&!nightLive&&lockedLeagueNames.length>0&&!keptLeagueName&&(
          <KeptLeaguePicker
            leagues={notUserHidden}
            keptLeagueName={keptLeagueName}
            defaultLeagueName={mostRecentLeagueName}
            leagueIds={leagueIdsRef.current||{}}
            userId={user?.id||""}
            onSaved={onKeptLeagueSaved} />
        )}

        {view==="home"&&!nightLive&&(
          <Suspense fallback={null}>
            <HomeScreen
              sessions={visibleSessions} shots={visibleShots} tournaments={tournaments}
              bowler={displayName||activeBowler}
              leagues={leagues}
              onOpenJourney={()=>setView("journey")}
              onOpenStats={()=>setView("data")}

              badgeCount={earnedBadgeCount}

              today={localDateString()}
              onPickMode={env=>{
                // Set the mode, then go straight to scoring.
                //
                // The mode is PASSED to the tour, not read back:
                // updatePreferences schedules the change, so
                // preferences.environment is still the old value here.
                // The same mistake once started the Open bowling tour
                // when a bowler picked Practice.
                updatePreferences(prev=>applyEnvironment(prev,env));
                // The launch prompt asks which mode you are in. You have
                // just answered that on Home, so showing it again on
                // arrival asks the same question twice -- and it is the
                // first thing on the screen you were sent to.
                dismissSessionStart();
                setView("log");
              }} />
          </Suspense>
        )}

        {(view==="log"||(view==="home"&&nightLive))&&(
          /* goalsPanel: Goals on the Results tab, at the end of the night.
              
              LogView has rendered this card since it was written and
              nothing ever supplied the prop, so it has never once
              appeared for a real bowler. The panel below is the same one
              Improve shows -- one component, one set of goals, two
              places to meet it.
              
              A comment cannot sit between attributes inside the opening
             tag, which is why it is out here. */
          <LogView
            profiles={profiles}
            goalsPanel={activeBowler?(
              <GoalsPanel goals={logGoals} measurements={logGoalMeasurements}
                leftHanded={leftHandedForBowler(activeBowler)}
                onChange={next=>saveGoals(activeBowler,next)}/>
            ):null}
            sessionNotes={sessionNotes} setSessionNotes={setSessionNotes}
            entitlement={entitlement}
            shots={visibleShots} sessions={visibleSessions} bowlers={bowlers} footerHeight={footerHeight} footerRef={footerRef} teams={teams} leagues={activeLeagues} startEdit={startEdit} deleteShot={deleteShot}
            activeBowler={activeBowler} arsenals={arsenals}
            form={form} setForm={setForm} editingId={editingId} saved={saved} sessionSaved={sessionSaved} sessionSaveMessage={sessionSaveMessage}
            sessionLeague={sessionLeague} setSessionLeague={setSessionLeague} effectiveSessionLeague={effectiveSessionLeague} sessionDate={sessionDate} setSessionDate={changeSessionDate}
            startingLane={startingLane} setStartingLane={setStartingLane} expandedSections={expandedSections}
            offerShotByShot={offerShotByShot} onTryShotByShot={tryShotByShot} onDismissShotByShot={dismissShotPrompt}
            promptForTeam={promptForTeam} onDismissTeamPrompt={dismissTeamPrompt}
            ballNumLabel={ballNumLabel} curSession={curSession} currentLane={currentLane} firstBallPins={firstBallPins} gameScores={gameScores}
            hasLeave={hasLeave} leaveDescribed={leaveDescribed} inTenth={inTenth} isNoTap={isNoTap} isStrike={isStrike} needsSpareMade={needsSpareMade} needsPins={needsPins} sessionTotal={sessionTotal} showPinCount={showPinCount}
            standingPins={standingPins} tenthOptions={tenthOptions} autoFillLine={autoFillLine} calcLane={calcLane} cancelEdit={cancelEdit} cycleGameResult={cycleGameResult} cycleSeriesResult={cycleSeriesResult}
            getLanePattern={getLanePattern} getMatch={getMatch} handleBallChange={handleBallChange} handleLeaveToggle={handleLeaveToggle} handleLineChange={handleLineChange}
            handleSpareMadeToggle={handleSpareMadeToggle} matchHandicap={matchHandicap} previousShotBall={previousShotBall}
            selectBowler={selectBowler} set={set} setLanePattern={setLanePattern} setMatchHandicap={setMatchHandicap} setMatchOpponent={setMatchOpponent} setPokerWinnings={setPokerWinnings} setThreeSixNineWinnings={setThreeSixNineWinnings} winningsSaved={winningsSaved} confirmWinningsSaved={confirmWinningsSaved} setView={setView}
            leagueBuyIns={leagueBuyIns} onSaveLeagueBuyIns={saveLeagueBuyIns} onReplayTour={replayTour}
            casualExtraGames={casualExtraGames} setCasualExtraGames={setCasualExtraGames}
            stepPinCount={stepPinCount} strictPartial={strictPartial} submitSession={submitSession} submitShot={submitShot} theoreticalScoreForGame={theoreticalScoreForGame} maxScoreThisGame={maxScoreThisGame} toggle={toggle} toggleMulti={toggleMulti} toggleSection={toggleSection}
            preferences={logPreferences}
            setSessionMoneyArray={setSessionMoneyArray} setSessionMoneyValue={setSessionMoneyValue}
            activeBowlerLeftHanded={activeBowlerLeftHanded}
            ballLayouts={ballLayouts}
            tournamentSaveMessage={tournamentSaveMessage}

            leagueTabChoice={leagueTabChoice} setLeagueTabChoice={setLeagueTabChoice}
            tournamentTab={tournamentTab} setTournamentTab={setTournamentTab}

            deleteNight={deleteNight}
            activeTournament={activeTournament} updateTournament={updateTournament} saveTournament={saveTournament} closeTournament={closeTournament} tournamentSaved={tournamentSaved}
            manualScores={manualScores} updateManualScore={updateManualScore}
            ownerName={ownerName} scoringForOthers={scoringForOthers} setScoringForOthers={setScoringForOthers}
            oilPatterns={pickerPatterns} submitOilPattern={submitOilPattern} tournaments={tournaments} practicePriorAverage={practicePriorAverage}
            scoreOptions={scoreOptions} guests={guests} newGuestName={newGuestName} setNewGuestName={setNewGuestName}
            addGuestBowler={addGuestBowler} removeGuestBowler={removeGuestBowler}
            gameEquipment={gameEquipment} updateGameEquipment={updateGameEquipment}
            practiceMode={practiceMode} setPracticeMode={setPracticeMode} activeDrill={activeDrill} setActiveDrill={setActiveDrill} startDrill={startDrill} startAnotherDrill={startAnotherDrill} saveDrill={saveDrill} drillSaved={drillSaved} drills={drills} leftHandedForBowler={leftHandedForBowler}
            envBags={envBags} selectedBagId={effectiveBagId} setSelectedBagId={setSelectedBagId} logBalls={logBalls}
            showSessionStart={showSessionStart}
          />
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* HISTORY VIEW                                                      */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* STATS VIEW                                                        */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {view==="coaching"&&(
          /* RAW, deliberately: these are the signed-in coach's OWN
             sessions, and coaching is a paid feature -- anyone who can
             reach this screen is a subscriber, so there is nothing of
             theirs to hide from them. */
          <CoachingView
            entitlement={entitlement}
            myUserId={user?.id||""}
            relationships={coachingRels}
            profilesById={coachProfilesById}
            tasksByRelationship={tasksByRelationship}
            notesByRelationship={notesByRelationship}
            coachViewOn={coachViewOn}
            setNextCoachingSession={setNextCoachingSession} onSetBowlerGoal={setBowlerGoal}
            sessions={sessions} leagues={leagues}
            isCoach={!!myProfile.isCoach}
            onToggleCoachView={v=>updatePreferences(prev=>setCoachView(prev,v))}
            onSearch={searchCoachProfiles}
            searchResults={coachSearchResults}
            searching={coachSearching}
            onRequest={requestCoaching}
            onRespond={respondCoaching}
            onEnd={endCoaching}
            onAddTask={addCoachingTask}
            onRemoveTask={removeCoachingTask}
            onCompleteTask={completeCoachingTask}
            onAttemptTask={attemptCoachingTask}
            onReopenTask={reopenCoachingTask}
            onAddNote={addCoachingNote}
            leftHandedByUserId={coachHandednessById}
            unreadResponses={unreadResponses}
            onMarkResponsesSeen={markCoachResponsesSeen}
            onSelectBowler={loadCoachBowlerSessions}
            bowlerSnapshots={Object.fromEntries(Object.entries(coachBowlerSessions).map(([id,sess])=>[id,bowlerSnapshot(sess)]))}
            bowlerBreakdowns={Object.fromEntries(Object.entries(coachBowlerShots).map(([id,sh])=>[id,shotBreakdown(sh,{
              isSplit,isSinglePinLeave,isCornerPinLeave,leftHanded:!!coachHandednessById[id],
            })]))}/>
        )}

        {view==="data"&&(
          <div style={{...S.card,paddingTop:"12px",paddingBottom:"12px"}}>
            {/* One row, not two.
              
                "Stats" and "Trends" lived here while the group chips
                lived inside StatsView, which put two chip rows on top of
                each other. These are the same kind of choice -- which
                slice of your numbers am I looking at -- so they belong in
                the same row.
              
                Trends is still its own screen; the rest filter StatsView. */}
            {/* One row, and it cannot scroll.
              
                Twice I worked out that six chips "should" fit and twice
                they did not -- a label's rendered width depends on the
                font the device actually has, which is not something to
                compute from character counts.
              
                So they share the row instead: each takes an equal slice
                and truncates if its label is too long. A guarantee
                rather than an estimate. */}
            <div style={{...S.chips,flexWrap:"nowrap",gap:"5px"}}>
              {STATS_GROUPS.map(g=>(
                <Chip key={g.id} label={g.label} selected={dataTab===g.id}
                  dense fill onToggle={()=>setDataTab(g.id)}/>
              ))}
            </div>
          </div>
        )}

        {view==="data"&&dataTab==="trends"&&(
          <TrendsView
            sessions={visibleSessions} shots={visibleShots} bowlers={bowlers} leagues={leagues} teams={teams}
            arsenals={arsenals} gameEquipment={gameEquipment}
            statsBowler={statsBowler} setStatsBowler={chooseStatsBowler}
            statsLeague={statsLeague} setStatsLeague={chooseStatsLeague}
            friends={friends} displayName={displayName}
            isSplit={isSplit}
            isCornerPinLeave={shot=>isCornerPinLeave(shot,trendsLeftHanded)}
            leftHanded={trendsLeftHanded}/>
        )}

        {/* Every group except Trends renders StatsView, filtered to that
            group. Trends has its own screen above. */}
        {view==="data"&&dataTab!=="trends"&&(
          <StatsView
            // Improve lost its tab; Stats is where a bowler is already
            // asking "why", so the coaching is reached from there.
            onOpenImprove={()=>setView("insights")}
            centerStats={centerStats}
            lanePatterns={lanePatterns}
            oilPatterns={oilPatterns}
            statsGroup={dataTab}

            leftHandedForBowler={leftHandedForBowler}

            ballProfile={profiles[statsBowler]||myProfile}

            SHOT_SAMPLE_THRESHOLD={SHOT_SAMPLE_THRESHOLD}

            onImportCsv={importCsvNights}

            centers={centers}

            tournaments={tournaments}

            closedSeasons={closedSeasons} leagueDates={leagueDates}
            view={view} entitlement={entitlement} shots={visibleShots} sessions={visibleSessions} bowlers={bowlers} teams={teams} leagues={leagues} arsenals={arsenals} saved={saved}
            statsBowler={statsBowler} setStatsBowler={chooseStatsBowler} compareBowler={compareBowler} setCompareBowler={setCompareBowler}
            compareFriendId={compareFriendId} setCompareFriendId={setCompareFriendId}
            friends={friends} onLoadFriendData={loadFriendData} onOpenFriends={()=>setView("social")} compareSessions={compareSessions} displayName={displayName}
            statsLeague={statsLeague} setStatsLeague={chooseStatsLeague}
            compareLeague={compareLeague} setCompareLeague={setCompareLeague}
            matches={matches}
            FRAME_POSITION_RELIABILITY_THRESHOLD={FRAME_POSITION_RELIABILITY_THRESHOLD}  allFirstBalls={allFirstBalls} bStats={bStats} bowlerLeagueCount={bowlerLeagueCount}
            cleanFrameCount={cleanFrameCount} cleanFrameR={cleanFrameR} compareLabel={compareLabel} firstBallAvg={firstBallAvg} fivePinAttempts={fivePinAttempts} fivePinMisses={fivePinMisses}
            framePosition={framePosition} framePositionGamesLogged={framePositionGamesLogged} framePositionReliable={framePositionReliable} frameShots={frameShots} hideIndividualOnly={hideIndividualOnly}
            isTeamView={isTeamView} leaveAvg={leaveAvg} mCounts={mCounts} nonSplitLeaveList={nonSplitLeaveList} nonStrikeFirstBalls={nonStrikeFirstBalls} rng={rng} showTeamCompare={showTeamCompare}
            singlePinAttempts={singlePinAttempts} singlePinMade={singlePinMade} singlePinSpareR={singlePinSpareR} spR={spR} splitBreakdownList={splitBreakdownList} splitConvR={splitConvR}
            splitCount={splitCount} splitR={splitR} statsShots={statsShots} stk={stk} stkR={stkR} teamCleanFrameR={teamCleanFrameR} teamFirstBallAvg={teamFirstBallAvg} teamLeaveAvg={teamLeaveAvg}
            teamSinglePinSpareR={teamSinglePinSpareR} teamSpR={teamSpR} teamSplitConvR={teamSplitConvR} teamSplitR={teamSplitR} teamStkR={teamStkR} teamTenPinRate={teamTenPinRate}
            teamTenPinSpareR={teamTenPinSpareR} tenPinAttempts={tenPinAttempts} tenPinLeaveCount={tenPinLeaveCount} tenPinMade={tenPinMade} tenPinSpareR={tenPinSpareR} tot={tot} wk={wk}
            handicapMatches={handicapMatches} handicapSplit={handicapSplit} longestStrikeStreak={longestStrikeStreak}
            theoreticalScoreForGame={theoreticalScoreForGame}
            preferences={preferences}
            viewedLeftHanded={viewedLeftHanded}
          />
        )}
      </Suspense>
        </ErrorBoundary>
      </div>

      {/* The genie floats over every screen, including casual -- a bowler
          out with friends can still ask why they keep leaving the 10.

          Hidden until there is something to ask ABOUT.

          A genie with no data answers every question with a variation of
          "you haven't logged anything yet", which is worse than no genie:
          the bowler spends a wish finding out there was nothing to spend
          it on, and the feature's first impression is an empty shrug.

          One logged game is the bar -- not a good sample, but enough that
          an answer is about them rather than about nothing. Brooklyn is
          told to say when a sample is thin, so a thin answer is honest
          rather than hollow. */}
      {/* Not in open bowling.

          Brooklyn answers from league and practice statistics -- spare
          conversion, carry by ball, position in the set. Open bowling
          logs scores and nothing else, so she would be answering every
          question from an average, which is the thin-data problem the
          lamp is already hidden for elsewhere.

          It is also the wrong tone. Open bowling deliberately strips the
          app back to a scoresheet and badges; a coaching genie is
          exactly the kind of thing that mode exists to get out of the
          way. */}
      {onboarded&&hasAnythingLogged&&!casualMode&&(
        <BowlingGenie asked={genieAsked} today={localDateString()} onAsk={askGenie}/>
      )}


      {/* Bottom nav. At the bottom because the top of a phone is out of
          thumb reach and this app is used standing up holding a ball.
          One badge per tab, on the tab where the waiting thing lives:
          "something needs you" and "here's where" become one signal. */}
      <nav style={{position:"fixed",bottom:0,left:0,right:0,zIndex:100,display:"flex",backgroundColor:C.surface,borderTop:`1px solid ${C.border}`,padding:"8px 4px calc(10px + env(safe-area-inset-bottom, 0px))"}}>
        {navTabs.map(t=>{
          const on=view===t.id||(t.id==="insights"&&view==="coaching")||(t.id==="locker"&&view==="social")||(t.id==="log"&&view==="import");
          // History does NOT badge the inbox count -- the inbox is
          // "things waiting for you" and lives in the header; History is
          // for reviewing what already happened. Two different jobs.
          const badge=
            t.id==="insights"?((newInsights.length>0&&view!=="insights"?1:0)+(coachViewOn?unreadResponseCount:0)):
            0;
          // Bowl gets a distinct treatment, not just the active-tab color --
          // a bigger icon inside a soft accent wash, so it reads as THE
          // action of the bar rather than one destination among seven,
          // whether or not it happens to be the current view.
          const isBowl=t.id==="log";
          return(
            <button key={t.id} onClick={()=>setView(t.id)} aria-label={t.label}
              style={{
                // "15" hex alpha is ~8% opacity -- against the nav
                // background that read as barely there. "40" (~25%) plus
                // a visible border is what actually holds up as contrast
                // rather than a tint, in both light and dark surfaces.
                flex:1,background:isBowl?C.accent+"40":"none",
                border:isBowl?`1px solid ${C.accent}66`:"none",cursor:"pointer",
                display:"flex",flexDirection:"column",alignItems:"center",gap:isBowl?"4px":"3px",
                padding:isBowl?"5px 0":"5px 0",margin:isBowl?"0 1px":0,
                borderRadius:isBowl?"10px":0,position:"relative",
                color:on?C.accent:C.textMuted,fontFamily:F.body,
                fontSize:isBowl?"11px":"10.5px",fontWeight:(on||isBowl)?600:500,
                WebkitTapHighlightColor:"transparent",
              }}>
              <span style={{fontSize:isBowl?"23px":"17px",lineHeight:1}} aria-hidden="true">{t.icon}</span>
              {t.label}
              {badge>0&&(
                <span style={{position:"absolute",top:"2px",right:"calc(50% - 20px)",minWidth:"14px",height:"14px",borderRadius:"7px",backgroundColor:C.miss,color:"#fff",fontSize:"9px",fontWeight:700,lineHeight:"14px",textAlign:"center",padding:"0 3px"}}>{badge}</span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
