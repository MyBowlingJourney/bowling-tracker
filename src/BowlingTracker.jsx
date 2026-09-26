import { useState, useEffect, useRef, useMemo, Suspense } from "react";
import appLogo from "../mbj-logo-512.png";
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
import HeaderMenu from "./HeaderMenu.jsx";
import PastNightResults from "./PastNightResults.jsx";
import { laneDigits } from "./domain/laneInput.js";
import Subscribe from "./Subscribe.jsx";
import CasualLeaderboard from "./CasualLeaderboard.jsx";
const BadgeCollection = lazyScreen("BadgeCollection", () => import("./BadgeCollection.jsx"));

// Ask Brooklyn, the card on the Improve tab.
import AskBrooklyn from "./AskBrooklyn.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";
import GoalsPanel from "./GoalsPanel.jsx";
import ImportedScoresInbox, { InboxList } from "./ImportedScoresInbox.jsx";
import { pendingTeamInvites, buildInbox, inboxCount as countInbox } from "./domain/inbox.js";
import DrillSession from "./DrillSession.jsx";
import { useAuth } from "./AuthProvider.jsx";
import { scopedKey } from "./domain/userScope.js";
import { supabase } from "./supabaseClient.js";
import { classifySyncError, cloudRead, cloudReadDelta, cloudWrite, cloudInsert, cloudUpdate, cloudDelete, getQueuedRecordsForTable, getPendingCount, onPendingCountChange, inspectPendingQueue, clearPendingQueue, discardQueuedTable, flushPendingQueue } from "./syncQueue.js";
import { friendlyFunctionError, readFunctionFailure, failureDetail } from "./domain/functionErrors.js";
import { recordError } from "./errorLogStore.js";
import { mergeDelta, nextCursor, seedCursor } from "./domain/deltaSync.js";
import { normalizeSignupCode, isValidSignupCode, generatePairingCode, normalizePairingCode, isValidPairingCode } from "./domain/signupCodes.js";
import { shouldOfferShotByShot } from "./domain/trackingPrompt.js";
import { shouldPromptForTeam, scoresToAdopt } from "./domain/teamPrompt.js";
import { splitConversionByType, isSplit, isTenPinLeave, isCornerPinLeave, isSinglePinLeave, isWashout, isMakeableSpare } from "./domain/splits.js";
import { maxPossibleScore,
  isStk, firstBallOf, secondBallOf, tenthBall3Available, tenthBall3Pins,
  nextState, tenthFrameStatus, strictPartial, frameQualityScore, makeTheoreticalShots,
  freshRackShots, theoreticalFillBallValue, tenthBall3Earned, strikeRateOf,
} from "./domain/scoring.js";
import { emptyShot, computeSessionStats, findExistingShotSlot } from "./domain/sessions.js";
import { teammateImportRows } from "./domain/teamImports.js";
import { buyInsForLeague, costArraysFor } from "./domain/money.js";
import { normalizeLayout } from "./domain/layouts.js";
import { profileFromRow, profileToRow, emptyProfile, normalizeProfile, resolveHandedness, effectiveLeftHanded, suggestBookAverage, resolveHomeCenters } from "./domain/profiles.js";
import { emptyTournament, normalizeTournament, tournamentToRow, tournamentFromRow, scratchExcludedLeagues } from "./domain/tournaments.js";
import { todaysRoutine, shouldShowLaunchPrompt } from "./domain/launchPrompt.js";
import { normalizeGoals, goalsToRow, goalsFromRow, measurementsFor } from "./domain/goals.js";
import { scoreStats, gamePositionAverages } from "./domain/scoreInsights.js";
import { buildAnalysisPayload, unlockSignature, statLabel, isAnnouncedStat } from "./domain/insightGating.js";
import { drillLines } from "./domain/sessionRecap.js";
import { categorizeCoaching, taskFromRow, taskToRow, noteFromRow, noteToRow, completeTask, recordAttempt, reopenTask, normalizeTask, bowlerSnapshot, shotBreakdown, respondedSince, latestResponseAt } from "./domain/coaching.js";
import { normalizeImportRecord, effectiveScores, approve as approveImport, reject as rejectImport,
  correctAsTeammate, canCorrect as canCorrectImportRecord, isConfirmed,
  pendingFor as pendingForImport, needingReentry as needingImportReentry, shouldSupersede, supersede } from "./domain/importVerification.js";
import { coachViewActive, setCoachView, applyEnvironment, setTrackingMode, toggleStatsCardHidden, unhideStatsCards } from "./domain/preferences.js";
import { emptyBag, normalizeBag, bagToRow, bagFromRow, availableBalls, bagsForEnvironment, plasticLast, bagHasRoom, toggleBallInBag, removeBagMemberships, ballsByBagFor, membershipKey, lockedBagIds } from "./domain/bags.js";
import { DEFAULT_BALL_GROUPS, emptyBallSpecs, normalizeBallSpecs, specsToRow, specsFromRow, groupToRow, groupFromRow } from "./domain/ballSpecs.js";
import { ballKey, catalogState, bestEntry, rejectedBallsFor, clearedSpecsAfterRejection, canVote } from "./domain/ballCatalog.js";
import { normalizeCenter, centerToRow, centerFromRow, findExistingCenter, statsByCenter, statsByRackType } from "./domain/centers.js";
import { rackTypeDetail } from "./domain/rackTypeDetail.js";
import { TabBar } from "./Tabs.jsx";
import { normalizePattern, patternFromRow, patternToRow, patternAverages, allVerifiedPbaPatterns } from "./domain/oilPatterns.js";
import { normalizeLeagueDates, needsBookAverageUpdate , isNoTapLeague, leagueFormat} from "./domain/leagueSeasons.js";
import { archiveOnNewStart, compareSeasons, describeSeasonChange } from "./domain/seasons.js";

import { sessionsForFigures, isBaker, bakerBowlerFor, bakerAlternates } from "./domain/tournamentFormats.js";
import { emptyDrill, normalizeDrill, drillToRow, drillFromRow } from "./domain/drills.js";
import { scorekeepingOptions, allowsOtherBowlers, normalizeGuests, addGuest, removeGuest } from "./domain/scorekeeping.js";
import { allowedLeagues, lockedLeagues, ENTITLEMENT_UNKNOWN, bagLimit, featureUnlocked, withProTrial, proTrialEnded, onProTrial, proTrialDaysLeft, hasPaidSubscription, isTestAccount } from "./domain/entitlements.js";
import { gamesByBall } from "./domain/arsenalMap.js";
import ProTrialEnd from "./ProTrialEnd.jsx";
// Not lazy: it is one small card, it is rendered conditionally already,
// and a Suspense boundary around a prompt this short would flash.
import KeptLeaguePicker from "./KeptLeaguePicker.jsx";
import TrialBanner from "./TrialBanner.jsx";
// The yearly figure the banner quotes when it nudges a monthly
// subscriber. Display only -- what is actually charged is whatever the
// Stripe price says. See purchase.js.
import { reconcilePlayPurchases } from "./purchase.js";
import { takePendingSubscribe } from "./pendingSubscribe.js";
import { standingAfterFirst, knockedFromSecondLeave, toggleKnocked, secondLeaveFrom, pinCountFrom, isAccidentalSpare } from "./domain/spareAttempt.js";
import { visibleLeagues, isLeagueHidden, teamsInLeague, describeLeaveImpact, leaveConfirmationText, isContainerLeague } from "./domain/leagueMembership.js";
import { decodeShare } from "./domain/badgeShare.js";
import { allCompetitiveBadges } from "./domain/badgeContext.js";
import { CASUAL_BADGES, badgeHistory as casualBadgeHistory } from "./domain/casualBadges.js";
import { badgesEarnedOn } from "./domain/nightBadges.js";
import { genieBreakdowns } from "./domain/genieBreakdowns.js";
import { buildGenieContext } from "./domain/genie.js";
import { COMPETITIVE_BADGES, whereEarnable } from "./domain/competitiveBadges.js";
import { casualNightsFrom, setGameEquipment as setGameEquipmentIn, gameEquipmentFromRows, getGameEquipment, defaultPracticeBall, setManualScore as setManualScoreIn, getManualScore, resolveGameScore, normalizeManualScores, manualScoreToRow, manualScoresFromRows, isManualNight } from "./domain/manualScores.js";
import { bowlerHighGame, bowlerHighSeries, hangAssistCounts, teamDateGroups, teamHighGame, teamHighSeries, seasonRecord, weeklyPointsData, gameAvg, teamGameTotalAvg, teamGameTotalAvgAt, rAvg, cAvg, avgProgress, cumulativeAvgBeforeDate, hungCounts, beatHighBowlerStats, scoreValues, scoreConsistency, histogramBuckets } from "./domain/stats.js";
import { lineupSort, renameLeagueInRecords } from "./domain/leagues.js";
import { C, S, F, Chip, applyTheme } from "./ui.jsx";
import { PLASTIC_BALL, DEFAULT_ARSENAL, MISSES, DEFAULT_LEAGUES, localDateString, APP_NAME, PRACTICE_SESSION_KEY, CASUAL_SESSION_KEY, practiceLeagueCloudName, casualLeagueCloudName, practiceLeagueDisplayName, isPracticeLeagueName, isCasualLeagueName, isTournamentLeagueName, TOURNAMENT_SESSION_KEY, tournamentLeagueCloudName, tournamentPhaseLeagueName, tournamentBaseLeagueName, tournamentLeagueEventName, IMPORTED_SESSION_KEY } from "./constants.js";
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
import { backAction } from "./domain/navBack.js";
import { listenForBack } from "./nativeBack.js";

import { STATS_GROUPS } from "./domain/statsGroups.js";
import { protectNames, aiLanguage, t as inAppLanguage } from "./i18n/index.js";
const StatsView = lazyScreen("StatsView", () => import("./StatsView.jsx"));
const ImportScorecard = lazyScreen("ImportScorecard", () => import("./ImportScorecard.jsx"));
const Settings = lazyScreen("Settings", () => import("./Settings.jsx"));
const Profile = lazyScreen("Profile", () => import("./Profile.jsx"));
const ArsenalAnalysis = lazyScreen("ArsenalAnalysis", () => import("./ArsenalAnalysis.jsx"));
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
// The last entitlement we successfully read. Scoped per user by
// scopedStorage, so this cannot cross accounts on a shared device.
const ENTITLEMENT_CACHE_KEY = "bowling-entitlement-v1";
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
// The pattern a league is normally bowled on. A DEFAULT, not a fact:
// a per-night record in lane_patterns still wins wherever one exists.
// Module scope, beside the other league-metadata keys, because the load
// block reads it before the component body reaches saveLeaguePattern.
const LEAGUE_PATTERNS_KEY = "bowling-league-patterns-v1";

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

// ── Keys read straight from localStorage, scoped to the bowler ──────────
//
// A handful of values are read SYNCHRONOUSLY on first render (onboarding,
// tours seen, teams, the resume context, the session counter), so they go
// to localStorage directly instead of through the async window.storage.
// That bypassed the per-user scoping every window.storage key gets, and
// these were the only device-wide values left.
//
// The bug that surfaced it: sign in on a browser where someone else had
// already finished setup, and the new account skipped onboarding -- it
// read the other bowler's flag. The async check then found no flag for
// the new account and deleted the shared one, so the NEXT launch showed
// onboarding. Wrong the first time, right the second, which is the report.
// The same keys also carried one bowler's team names and resume context
// into the next account on a shared phone.
//
// The scoped key is the same one window.storage writes (u:<id>:<key>,
// stored in localStorage), so for onboarding there is now one value, not
// a value and a mirror that could disagree.
//
// An old unscoped value is adopted once by whoever reads it first and then
// deleted -- the same trade adoptLegacyData makes, for the same reasons.
// Except onboarding: its real value was always in the scoped key, so the
// old device-wide copy is only ever dropped, never believed.
function readLocal(key,uid){
  try{
    const ls=window.localStorage;
    const mine=scopedKey(key,uid);
    const value=ls.getItem(mine);
    if(value!==null||mine===key)return value;
    const legacy=ls.getItem(key);
    if(legacy===null)return null;
    ls.removeItem(key);
    if(key===ONBOARDED_KEY)return null;
    ls.setItem(mine,legacy);
    return legacy;
  }catch{return null;}
}
function writeLocal(key,uid,value){
  try{
    const mine=scopedKey(key,uid);
    if(value===null)window.localStorage.removeItem(mine);
    else window.localStorage.setItem(mine,value);
  }catch{}
}
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
  // Whose device-local values these are. BowlingTracker is keyed on the
  // user id in main.jsx, so this cannot change under a mounted tracker.
  const uid=user?.id||null;

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
  // Which plan the Subscribe screen opens on. Set from the welcome page's
  // Subscribe buttons (see pendingSubscribe.js); yearly otherwise.
  const[subscribePeriod,setSubscribePeriod]=useState("year");
  // Setup: Gear and Team as one screen with four tabs. The view id stays
  // "locker"; the old "teams" view and "setup-team" are entry points that
  // land on the right tab (see the effect below).
  const[setupTab,setSetupTab]=useState("balls");
  // Improve's three tabs: AI (Brooklyn and Insights), Goals (goals and
  // drills) and Coach (the coaching screen, inline).
  const[improveTab,setImproveTab]=useState("ai");
  useEffect(()=>{
    if(view==="teams"){ setSetupTab("league"); setView("locker"); }
    else if(view==="setup-team"){ setSetupTab("team"); setView("locker"); }
  },[view]);

  // Stats and Trends are one nav tab ("Data") with a sub-tab, rather than
  // two top-level tabs. They already share statsBowler/statsLeague, so the
  // "Viewing" selection carries across the sub-tab switch instead of being
  // re-picked -- which is the main reason merging them works.
  // "overview" is the Mine chip. This started as "stats", which is not a
  // chip id: Stats opened with no chip highlighted, and anything keyed on
  // the chip had to guess what "stats" meant.
  const[dataTab,setDataTab]=useState("overview");
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

  // Session identity -- a plain counter per bowler+league+date.
  //
  // A night used to be identified by (bowler, league, date). That is one
  // night per league per day, which is right for a league and wrong for
  // everything else: two practices in a day merged into one, the second
  // continuing the first's game numbering, and its filed row overwriting
  // the first's. Open bowling has the same problem (two outings in a day
  // is ordinary) and a tournament could in principle.
  //
  // Durable, not device-local: session_seq is a real NOT NULL DEFAULT 1
  // column on shots, sessions, manual_scores and drills, and it is part
  // of every uniqueness key that used to say "one per day". The
  // localStorage copy here is just the current counter, so a session
  // survives a reload mid-night; the records themselves carry their own.
  const[sessionSeqMap,setSessionSeqMap]=useState(()=>{
    try{
      const raw=readLocal("bowling-session-seq-v1",uid);
      const parsed=raw?JSON.parse(raw):{};
      return (parsed&&typeof parsed==="object")?parsed:{};
    }catch{ return {}; }
  });
  const sessionSeqKey=(bowler,league,date)=>`${bowler}||${league}||${date}`;
  function bumpSessionSeq(bowler,league,date){
    setSessionSeqMap(prev=>{
      const key=sessionSeqKey(bowler,league,date);
      const next={...prev,[key]:(prev[key]||1)+1};
      writeLocal("bowling-session-seq-v1",uid,JSON.stringify(next));
      return next;
    });
  }

  const[teams,setTeams]=useState(()=>{
  try{
    const raw=readLocal("bowling-teams-v1",uid);
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
  // Starts UNKNOWN, not null. null is "asked, and they are free"; unknown
  // is "could not ask yet". Before billing went live both spelled null
  // and it did not matter. Now the difference is whether a paying
  // subscriber is locked out while the query is in flight. See
  // ENTITLEMENT_UNKNOWN in domain/entitlements.js.
  const[entitlementRow,setEntitlement]=useState(ENTITLEMENT_UNKNOWN);
  // The stored row plus the account's 60-day Pro trial (from its creation
  // time), so every gate answers from one object. The server applies the
  // same rule in is_subscriber().
  const entitlement=useMemo(()=>withProTrial(entitlementRow,user?.created_at),[entitlementRow,user?.created_at]);
  // Bumped after an in-app (Play) purchase so the entitlement is read
  // again. The read below otherwise runs only when the user changes.
  const[entitlementReload,setEntitlementReload]=useState(0);
  // And again whenever the app comes back to the foreground. A renewal,
  // cancellation or refund lands in the database while the app sits in
  // the background (play-rtdn, stripe-webhook); without this the app kept
  // the answer it read at launch, and a subscriber whose period had just
  // renewed was shown padlocks until they restarted the app. At most once
  // a minute -- it is one small query, but switching apps is frequent.
  useEffect(()=>{
    if(typeof document==="undefined")return;
    let last=Date.now();
    const onVisible=()=>{
      if(document.visibilityState!=="visible")return;
      if(Date.now()-last<60_000)return;
      last=Date.now();
      setEntitlementReload(n=>n+1);
    };
    document.addEventListener("visibilitychange",onVisible);
    return()=>document.removeEventListener("visibilitychange",onVisible);
  },[]);
  // Paid-for Play purchases that never got confirmed (see
  // reconcilePlayPurchases): checked once per sign-in, and the
  // entitlement re-read if any were rescued. Does nothing on the web.
  useEffect(()=>{
    if(!user?.id)return;
    let live=true;
    reconcilePlayPurchases().then(n=>{ if(live&&n>0)setEntitlementReload(k=>k+1); });
    return()=>{live=false;};
  },[user?.id]);
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
  // What was typed into the header menu's search box, handed to Help.
  const[helpQuery,setHelpQuery]=useState("");
  // The past open bowling night being viewed, for the "pastNight" screen.
  // The import screen stays alive behind the app once it has been
  // opened; importRunId remounts it after a finished import.
  const[importOpened,setImportOpened]=useState(false);
  const[importRunId,setImportRunId]=useState(0);
  useEffect(()=>{if(view==="import")setImportOpened(true);},[view]);
  const[pastNightDate,setPastNightDate]=useState("");
  // Cleared on leaving Help, so reaching Help another way starts blank.
  useEffect(()=>{if(view!=="help")setHelpQuery("");},[view]);
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
  // Bumped to re-read the league list -- after joining a league, or a team
  // in a league this bowler was not in yet.
  const[leaguesReload,setLeaguesReload]=useState(0);
  // Open team requests and invites involving this bowler -- see
  // my_team_requests() in 20260925140000_team_joining.sql.
  const[teamRequests,setTeamRequests]=useState([]);
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

  // Create a team from the Leagues card in Team, so a league and its
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
    // The free plan covers one team. Settings enforced that; the Team
    // tab's "+ Add team" went straight here and did not. Counted from the
    // cloud roster, because the startup team list carries names only.
    // A team in THIS league doesn't count: a new one replaces it.
    if(!featureUnlocked(entitlement)&&user?.id){
      const mine=await cloudRead("team_members",q=>q.select("team_id").eq("user_id",user.id));
      if(mine.online&&Array.isArray(mine.data)){
        const leagueOf=new Map((teams||[]).map(t=>[t.id,t.league]));
        const elsewhere=mine.data.filter(r=>leagueOf.has(r.team_id)&&leagueOf.get(r.team_id)!==leagueName);
        if(elsewhere.length>=1){
          if(window.confirm("The free plan covers one team, and you're already on one. Upgrade to Pro to add another?"))setView("subscribe");
          return;
        }
      }
    }
    // One team per bowler per league: making a new team moves you onto it
    // (the database takes you off the other one), so say so first.
    const inLeague=await fetchLeagueTeams(leagueName);
    const current=Array.isArray(inLeague)?inLeague.find(t=>t.is_member):null;
    if(current&&!window.confirm(`You're on ${current.name} in this league. Making ${clean} puts you on its roster and takes you off ${current.name}'s. Your scores stay yours.`))return;
    const id=crypto.randomUUID();
    let leagueId=leagueIdsRef.current[leagueName];
    if(!leagueId){
      const{data,online}=await cloudRead("leagues",q=>q.select("id").eq("name",leagueName).limit(1),{paginate:false});
      if(online&&data&&data[0]){
        leagueId=data[0].id;
        leagueIdsRef.current[leagueName]=leagueId;
      }
    }
    persistTeams([...(teams||[]),{id,name:clean,league:leagueName,members:[],pendingInvites:[]}]);
    // Show the new team on Setup's Team tab -- AFTER the writes below.
    // The Team tab fetches its own list when focused on a team it doesn't
    // have, and focusing before the insert meant fetching before the team
    // existed, so it opened on some other team instead.
    const showNewTeam=()=>{ setFocusTeamId(id); setSetupTab("team"); };
    if(!leagueId){
      showNewTeam();
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
    showNewTeam();


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
    // Done by the database (befriend_teammates), for people who share a
    // team with this bowler. The app used to insert ACCEPTED rows itself,
    // and the policy that allowed that let anyone make themselves a
    // "friend" of anyone -- and friends can read each other's shots.
    const{data:made,error}=await supabase.rpc("befriend_teammates");
    if(error||!made)return existing;
    const again=await cloudRead("friendships",q=>q.select("id,requester_id,addressee_id,status"));
    if(!again.online||!Array.isArray(again.data))return existing;
    return again.data.filter(f=>f.requester_id===myId||f.addressee_id===myId);
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
  // Everyone on your teams, for Compare To in Stats: members with an
  // account AND pending ones (invited or name-only, not signed up yet).
  //
  // Compare To only offered friends, and a teammate became a friend only
  // after joining -- so a pending teammate could never be compared to,
  // and neither could an active one whose friendship hadn't been made
  // yet. The startup team list carries names only, so the roster is read
  // here: team_members for accounts, pending_invites for the rest.
  // [{teamId, teamName, league, members:[{userId,name}], pending:[{id,name}]}]
  const[teamRosters,setTeamRosters]=useState([]);
  const teamIdKey=(teams||[]).map(t=>t.id).filter(Boolean).sort().join(",");
  useEffect(()=>{
    if(!user?.id||!teamIdKey)return;
    let cancelled=false;
    (async()=>{
      const[memRes,invRes]=await Promise.all([
        cloudRead("team_members",q=>q.select("team_id,user_id,lineup_position,profiles(display_name)")),
        cloudRead("pending_invites",q=>q.select("id,team_id,invited_name,lineup_position").is("accepted_at",null)),
      ]);
      if(cancelled||!memRes.online||!Array.isArray(memRes.data))return;
      const invites=invRes.online&&Array.isArray(invRes.data)?invRes.data:[];
      const byPos=(a,b)=>(a.pos??99)-(b.pos??99);
      setTeamRosters((teams||[]).filter(t=>t.id).map(t=>({
        teamId:t.id,teamName:t.name,league:t.league,
        members:memRes.data.filter(m=>m.team_id===t.id&&m.user_id!==user.id)
          .map(m=>({userId:m.user_id,name:(m.profiles?.display_name||"").trim(),pos:m.lineup_position}))
          .filter(m=>m.name).sort(byPos),
        pending:invites.filter(i=>i.team_id===t.id)
          .map(i=>({id:i.id,name:(i.invited_name||"").trim(),pos:i.lineup_position}))
          .filter(i=>i.name).sort(byPos),
      })).filter(r=>r.members.length||r.pending.length));
    })();
    return()=>{cancelled=true;};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[user?.id,teamIdKey,view==="data"]);
  // What Compare To offers: the roster read above, and -- for any team it
  // could not read (no signal at launch, a failed query) -- the names the
  // Team screen already knows, members and pending alike. A read that
  // failed once used to leave the pending teammates out until a restart.
  const compareRosters=useMemo(()=>{
    const me=displayName||activeBowler;
    const have=new Set((teamRosters||[]).map(r=>r.teamId));
    const extra=(teams||[]).filter(t=>t&&t.id&&!have.has(t.id)).map(t=>({
      teamId:t.id,teamName:t.name,league:t.league,members:[],
      pending:(t.members||[]).map(m=>typeof m==="string"?m:(m?.displayName||m?.name||""))
        .filter(n=>n&&n!==me).map(n=>({id:`${t.id}:${n}`,name:n})),
    })).filter(r=>r.pending.length);
    return [...(teamRosters||[]),...extra];
  },[teamRosters,teams,displayName,activeBowler]);

  // One teammate's numbers, for comparing against. Stored in the same
  // friendShots/friendSessions maps under a "mate:team:name" key, so the
  // comparison math needs nothing new.
  //
  // Filtered to that bowler's NAME, from three places:
  //  - rows the team can see under that name (a captain logging a pending
  //    teammate stores them under the captain's account, with the team);
  //  - an active member's own rows under their name;
  //  - rows this device logged for them.
  // A friend's fetch takes everything under their account, which for a
  // captain would blend in every teammate they log for -- so it isn't
  // reused here.
  async function loadTeammateData(teamId,userId,name){
    const key=["mate",teamId,name].join(":");
    if(!teamId||!name)return key;
    const nameById={};
    Object.entries(leagueIdsRef.current||{}).forEach(([n,id])=>{nameById[id]=n;});
    const same=v=>String(v||"").trim().toLowerCase()===name.toLowerCase();
    const reads=[
      cloudRead("shots",q=>q.select("*").eq("team_id",teamId).eq("bowler_name",name)),
      cloudRead("sessions",q=>q.select("*").eq("team_id",teamId).eq("bowler_name",name)),
    ];
    if(userId){
      reads.push(
        cloudRead("shots",q=>q.select("*").eq("user_id",userId).eq("bowler_name",name)),
        cloudRead("sessions",q=>q.select("*").eq("user_id",userId).eq("bowler_name",name)),
      );
    }
    const res=await Promise.all(reads);
    const rows=i=>res[i]&&res[i].online&&Array.isArray(res[i].data)?res[i].data:[];
    const byId=(list)=>{const m=new Map();list.forEach(r=>{if(r&&r.id&&!m.has(r.id))m.set(r.id,r);});return [...m.values()];};
    const cloudShots=[...rows(0),...rows(2)].map(r=>shotFromSupabaseRow(r,nameById));
    const cloudSessions=[...rows(1),...rows(3)].map(r=>sessionFromSupabaseRow(r,nameById));
    // Imported scorecard columns count too -- for a teammate who hasn't
    // signed up, they're usually all there is.
    const mateShots=byId([...shots.filter(s=>same(s.bowler)),...cloudShots,...teamImports.shots.filter(s=>same(s.bowler))]);
    const mateSessions=byId([...sessions.filter(s=>same(s.bowler)),...cloudSessions,...teamImports.sessions.filter(s=>same(s.bowler))]);
    setFriendShots(prev=>({...prev,[key]:mateShots}));
    setFriendSessions(prev=>({...prev,[key]:mateSessions}));
    return key;
  }
  const[coachBowlerShots,setCoachBowlerShots]=useState({});
  // The live pairing code this bowler has generated, if any, and
  // whatever the last claim attempt said. No search state: coaches and
  // bowlers pair with a code now, not by looking each other up.
  const[coachInviteCode,setCoachInviteCode]=useState(null);
  const[coachCodeError,setCoachCodeError]=useState("");
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
  const[leaguePatterns,setLeaguePatterns]=useState({});
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
    // A new mode, however it was chosen, is not "left open bowling".
    setCasualLeft(false);
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
    return readLocal(ONBOARDED_KEY,uid)==="1";
  });
  // Shown once, after setup. Read synchronously like the flag above --
  // an async read would flash the tour at someone who'd already done it.
  // Which tours this bowler has seen -- one per environment, plus coach.
  // A list rather than a flag, because someone who signed up casual and
  // comes back for a league shouldn't have to find the league features
  // alone, but shouldn't sit through the casual tour again either.
  const[toursSeen,setToursSeen]=useState(()=>{
    try{return JSON.parse(readLocal(TOURS_SEEN_KEY,uid)||"[]");}
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
      writeLocal(TOURS_SEEN_KEY,uid,JSON.stringify(next));
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
    return readLocal(ONBOARDED_KEY,uid)!=="1";
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

  // Came from a Subscribe button on the welcome page: open the Subscribe
  // screen on the plan they picked. Waits until onboarding, the welcome
  // screen and any walkthrough are all done -- the walkthrough moves
  // between screens itself and ends on Home, which would bury Subscribe
  // underneath it. So a brand-new bowler sets up first and is taken to
  // Subscribe straight after.
  const firstRunBusy=(showOnboarding&&!onboarded)||showWelcome||!!activeTour;
  useEffect(()=>{
    if(firstRunBusy)return;
    const period=takePendingSubscribe();
    if(!period)return;
    setSubscribePeriod(period);
    setView("subscribe");
  },[firstRunBusy]);
  const[newBallName,setNewBallName]=useState("");
  const[retiredBalls,setRetiredBalls]=useState({});
  const[ballAddMessage,setBallAddMessage]=useState("");
  // Restored from the last session context, so a refresh mid-night lands
  // back where you were. Only restored when the saved date is TODAY --
  // reopening the app on a new day should start a new night, not resume
  // last Tuesday's.
  const savedContext=(()=>{
    try{
      const raw=readLocal(SESSION_CONTEXT_KEY,uid);
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
  // True from picking Open bowling on Home until that round is saved. The
  // simplified open-bowling nav keys on this -- see casualMode.
  const[casualRound,setCasualRound]=useState(false);
  // Set when open bowling is ENDED or CANCELLED: the bowler has left the
  // mode, so the full six-tab nav comes back even if nothing was filed
  // (a night where only guests bowled files no session for the owner).
  // Cleared when a mode is picked on Home.
  const[casualLeft,setCasualLeft]=useState(false);
  // Which badge collection the Badges screen shows: "casual" (open
  // bowling) or "competitive". null = follow the mode you are in. Either
  // set is reachable from either mode through the switch on that screen.
  const[badgeSet,setBadgeSet]=useState(null);

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
  // Which phase of the event the Scoring tab is on: qualifying, match
  // play or the stepladder. Held here rather than inside the tournament
  // card because the shot context depends on it -- each phase files its
  // frames under its own container league, so match play game 1 does
  // not land on top of qualifying game 1.
  const[tournamentPhase,setTournamentPhase]=useState("qualifying");
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
  //
  // This is the PICK. What the stats read is statsBowler, derived below
  // per chip -- see statsScope.
  const[statsBowlerPick,setStatsBowler]=useState(displayName||"");
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
    if(displayName&&!statsBowlerPick&&!statsLeaguePick)setStatsBowler(displayName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[displayName]);
  const[compareBowlerPick,setCompareBowler]=useState("");
  // Set alongside compareBowler when the comparison target is a FRIEND
  // rather than someone in the local roster -- lets the merged-shots
  // effect below know which friend's cloud data to fold in, without
  // requiring every existing s.bowler===compareBowler filter throughout
  // this file to be rewritten to understand two different kinds of id.
  const[compareFriendIdPick,setCompareFriendId]=useState("");
  const[statsLeaguePick,setStatsLeague]=useState("");
  const[compareLeaguePick,setCompareLeague]=useState("");
  // In French, names the bowler typed are shown exactly as typed -- never
  // run through the translation (see i18n/index.js protectNames).
  useEffect(()=>{
    const names=[displayName,...bowlers,...leagues,...Object.keys(arsenals||{}),
      ...Object.values(arsenals||{}).flat(),...(teams||[]).map(t=>t&&t.name),
      ...(centers||[]).map(c=>c&&c.name),...(oilPatterns||[]).map(p=>p&&p.name),
      ...(friends||[]).map(f=>f&&f.displayName),...(bags||[]).map(b=>b&&b.name)];
    // Not the app's own names (the Practice/Open/Tournament containers, the
    // plastic ball, the sample leagues): those are labels, and translate.
    protectNames(names.filter(n=>typeof n==="string"&&!DEFAULT_LEAGUES.includes(n)
      &&n!==PLASTIC_BALL&&!(DEFAULT_ARSENAL||[]).includes(n)
      &&!isPracticeLeagueName(n)&&!isCasualLeagueName(n)&&!isTournamentLeagueName(n)&&n!==IMPORTED_SESSION_KEY));
  },[displayName,bowlers,leagues,arsenals,teams,centers,oilPatterns,friends,bags]);
  // The Team chip's own team, chosen from the picker at the top of it.
  const[teamStatsLeague,setTeamStatsLeague]=useState("");

  // ── Which filters apply, per Stats chip ──────────────────────────────
  //
  // Viewing and Compare To live on Mine; Trends has Viewing and a league
  // filter. They used to be ONE selection shared by every chip, so
  // pointing Mine at a teammate, or Trends at one league, silently
  // narrowed Team, Ball, Game and Center too -- with no filter showing on
  // those chips to explain why their numbers had changed.
  //
  // Each chip now reads its own scope:
  //   Mine, Trends       -- what was picked there
  //   Team               -- the team picked on the Team chip
  //   Ball, Game, Center -- you, across everything
  // Picks are remembered, so going back to Mine finds them unchanged.
  //
  // Everything downstream reads statsBowler / statsLeague / compare*
  // under their old names, so the scoping lives here and nowhere else.
  // Outside the Stats screen the picks apply exactly as before.
  const teamStatsLeagueEffective=teamStatsLeague||(leagues||[]).find(l=>!isContainerLeague(l))||"";
  const statsScope=(view!=="data"||dataTab==="overview"||dataTab==="trends")?"picked"
    :dataTab==="team"?"team":"you";
  const statsBowler=statsScope==="picked"?statsBowlerPick:statsScope==="team"?"":(displayName||statsBowlerPick);
  const statsLeague=statsScope==="picked"?statsLeaguePick:statsScope==="team"?teamStatsLeagueEffective:"";
  const compareBowler=statsScope==="picked"?compareBowlerPick:"";
  const compareLeague=statsScope==="picked"?compareLeaguePick:"";
  const compareFriendId=statsScope==="picked"?compareFriendIdPick:"";
  // A container league in the saved context is corruption from the bug
  // above, not a league the bowler picked. Dropping it here repairs a
  // context already written that way -- otherwise every existing
  // installation stays stuck on the tournament it last bowled.
  const[sessionLeague,setSessionLeague]=useState(
    isContainerLeague(savedContext?.league)?"":(savedContext?.league||""));
  const[sessionDate,setSessionDate]=useState(savedContext?.date||localDateString());
  // Declared below activeBowler/sessionDate: both are consts further down
  // in this component, and referencing either before its own declaration
  // throws "Cannot access before initialization" -- not a lint nitpick, a
  // hard crash on every page load.
  //
  // effectiveSessionLeague is declared later still, so the league part is
  // resolved the same way it is: this must not run before it exists.
  const currentSessionSeq=sessionSeqMap[sessionSeqKey(activeBowler,
    preferences.environment==="practice"?PRACTICE_SESSION_KEY:
    preferences.environment==="casual"?CASUAL_SESSION_KEY:
    (sessionLeague||""),sessionDate)]||1;

  // Changing the date starts a new night at game 1, frame 1.
  //
  // setSessionDate alone left the form on whatever game and frame the
  // last night ended on -- so a second tournament squad began at "game
  // 3, frame 7", and those shots filed under game 3 of a block that had
  // never bowled games 1 or 2.
  //
  // The bowler is always at the start of a night they have just dated.
  // If they are genuinely resuming one, the frame stepper moves.
  // keepTournament: the caller is OPENING a tournament, so the
  // fresh-start rule below must not run.
  //
  // openImportedNight loads the event and then moves the date, both in
  // one tick. React has not re-rendered in between, so `activeTournament`
  // read here is still the PREVIOUS card -- and if that card's squads
  // carry different dates, the rule below decides this date belongs to
  // no event and replaces the card with a blank one. The load is undone
  // a line after it happened, and the bowler lands on Results with an
  // empty tournament: the first day of an event opening with no details
  // while a later day opens fine, depending only on which dates the
  // previous card happened to hold.
  function changeSessionDate(next,{keepTournament=false}={}){
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
    if(keepTournament)return;
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

  // Cleaned on load too: a negative lane saved before the field was fixed
  // would otherwise come back every time the app opened.
  const[startingLane,setStartingLane]=useState(laneDigits(savedContext?.lane));
  const[confirmClear,setConfirmClear]=useState(false);
  const[showBackup,setShowBackup]=useState(false);
  const[expandedSections,setExpandedSections]=useState({releaseMiss:false,ballChange:false,notes:false,tonightSession:false,arsenal:false,surface:false,/* open by default: reaching this card means a league is chosen and the
     bowler is here to enter scores */manualScores:true,ballPick:false,logGoals:false,
     /* open by default: the accessory fields are how most bowlers use
        this app, so the card starts the way the form has always looked
        and collapsing it is the bowler's choice. Initialized here rather
        than inferred from undefined -- toggling an absent key flips it to
        true, so the first tap on a card that was already showing did
        nothing. */optional:true});
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
      // Two sessions on one day (a second practice) are different slots:
      // the session number is part of the key, as it is in the database.
      const key=`${s.bowler}|${s.league}|${s.date}|${Number(s.sessionSeq)||1}|${s.game}|${s.frame}|${s.ballNum||""}`;
      lastIndexForKey.set(key,idx);
    });
    return rawShots.filter((s,idx)=>{
      const key=`${s.bowler}|${s.league}|${s.date}|${Number(s.sessionSeq)||1}|${s.game}|${s.frame}|${s.ballNum||""}`;
      return lastIndexForKey.get(key)===idx;
    });
  }

  // Dedup safety net for sessions, same reasoning as migrateShots.
  function migrateSessions(rawSessions){
    const lastIndexForSessionKey=new Map();
    rawSessions.forEach((s,idx)=>{
      lastIndexForSessionKey.set(`${s.bowler}|${s.league}|${s.date}|${Number(s.sessionSeq)||1}`,idx);
    });
    return rawSessions.filter((s,idx)=>
      lastIndexForSessionKey.get(`${s.bowler}|${s.league}|${s.date}|${Number(s.sessionSeq)||1}`)===idx
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
    if(readLocal(ONBOARDED_KEY,uid)==="1")return;
    writeLocal(ONBOARDED_KEY,uid,"1");
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
        writeLocal(ONBOARDED_KEY,uid,isDone?"1":null);
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
  // CLOUD-FIRST, LOCAL CACHE AS THE OFFLINE FALLBACK -- the same shape as
  // shots, leagues and seasons, and for a much sharper reason.
  //
  // This used to fetch fresh on every load and keep nothing. While
  // BILLING_LIVE was false that was invisible: an absent entitlement
  // unlocked everything anyway. With billing on it inverted, and a
  // subscriber whose entitlement query lost a race with bowling-alley
  // wifi got their leagues cut to one and every paid screen locked --
  // mid league night, having paid. The server refuses to fail that way
  // on purpose (see nightcap/index.ts); the client should not either.
  //
  // window.storage is already user-scoped, so a cached row cannot leak
  // from one account into another on a shared phone.
  useEffect(()=>{
    if(!user?.id){setEntitlement(null);return;}
    let live=true;
    (async()=>{
      // Last known answer first, so the gates are right before the
      // network has said anything -- and stay right if it never does.
      let hadCache=false;
      try{
        const cached=await window.storage.get(ENTITLEMENT_CACHE_KEY);
        if(cached?.value&&live){
          let parsed=JSON.parse(cached.value);
          // A renewing subscription whose cached period just ended has
          // almost certainly renewed -- we simply have not been able to
          // ask. Three days' grace on the CACHED copy only, so a
          // subscriber opening the app offline at the lanes the morning
          // after their renewal is not locked out. The fresh read below
          // replaces it the moment the network answers.
          if(parsed&&typeof parsed==="object"&&["active","trialing"].includes(parsed.status)&&parsed.current_period_end){
            const ends=Date.parse(parsed.current_period_end);
            if(Number.isFinite(ends))parsed={...parsed,current_period_end:new Date(ends+3*864e5).toISOString()};
          }
          // null is a legitimate cached answer: "asked, they are free".
          setEntitlement(parsed);
          hadCache=true;
        }
      }catch{ /* unreadable cache is the same as no cache */ }

      try{
        const{data,error}=await supabase.from("entitlements")
          .select("plan,status,billing_period,current_period_end,trial_end,kept_league_id,created_at,is_test_account")
          .eq("user_id",user.id).maybeSingle();
        if(!live)return;
        if(error){
          // Keep whatever the cache gave us. With no cache this stays
          // UNKNOWN, which fails OPEN rather than locking out somebody
          // who may well have paid.
          console.error("entitlement read failed, using cached value:",error.message,hadCache?"(cache hit)":"(no cache -- unlocked until we can ask)");
          return;
        }
        const row=data||null;
        setEntitlement(row);
        try{ await window.storage.set(ENTITLEMENT_CACHE_KEY,JSON.stringify(row)); }catch{ /* cache is best effort */ }
      }catch(e){
        if(live)console.error("entitlement read threw, using cached value:",String(e),hadCache?"(cache hit)":"(no cache -- unlocked until we can ask)");
      }
    })();
    return()=>{live=false;};
  },[user?.id,entitlementReload]);

  useEffect(()=>{
    if(!user?.id)return;
    loadCoaching();
    loadImportedScores();
    loadFriendRequests();
    loadTeamInvites();
    loadTeamRequests();
    loadFriends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[user?.id]);

  // Re-checked when the inbox opens: a teammate may have asked to join, or
  // been approved, since the app started.
  useEffect(()=>{
    if(view==="inbox")loadTeamRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[view]);

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
          cloudRead("bowler_profiles",q=>q.select("bowler_name,left_handed,backup_ball,two_handed,is_coach,aliases,home_centers,notes,book_average,book_games,book_season,book_average_as_of,all_time_high_game,all_time_high_series,drift_boards,lateral_offset")),
          cloudRead("ball_bags",q=>q.select("bowler_name,ball,bag_id")),
          cloudRead("drills",q=>q.select("id,bowler_name,date,target,custom_target,custom_pins,ball,made,missed,notes,session_seq")),
          cloudRead("hidden_leagues",q=>q.select("league_id")),
          // rack_type and created_by are BOTH read here, and both were
          // missing.
          //
          // centerFromRow maps `rackType: row.rack_type || ""` and
          // `createdBy: row.created_by || ""`, but neither column was in
          // this select -- so rackType was "" for every centre ever
          // loaded, rackTypeByLeague came out empty, and statsByRackType
          // returned nothing. The string-versus-free-fall comparison
          // could not populate for anybody, with any data, ever.
          //
          // created_by has its own consequence, described in
          // centerFromRow: without it the client cannot tell that a
          // centre belongs to someone else, so it rewrites a shared row,
          // gets refused by RLS, and tries again tomorrow.
          //
          // A mapper that reads a column the query does not ask for
          // fails silently in exactly this way: no error, just a field
          // that is quietly always empty.
          cloudRead("bowling_centers",q=>q.select("id,here_id,name,address,city,state,postal_code,country,lat,lng,rack_type,freefall_lanes,created_by")),
          cloudRead("oil_patterns",q=>q.select("id,name,series,length_feet,ratio,volume_ml,forward_ml,reverse_ml,verified,source_note,year")),
          cloudRead("bowler_goals",q=>q.select("bowler_name,goals")),
          cloudRead("tournaments",q=>q.select("id,bowler_name,name,center,days,buy_in,winnings,side_pots,match_play,stepladder,match_play_next_round,placement,placement_note,notes,handicap,baker_partner,baker_starter,baker_alternate,scoring_basis,pin_format,play_style")),
          cloudRead("leagues",q=>q.select("id,name,center_id,start_date,end_date,format,pattern_name")),
          // A longer wait than the default: the catalog is a thousand balls
          // with per-weight specs, and on a slow signal one page could run
          // past 6s -- which threw the whole read away and left search
          // with nothing.
          cloudRead("ball_submissions",q=>q.select("id,submitted_by,ball_key,ball_name,brand,coverstock,core_type,weight,rg,diff,int_diff,created_at,official,source_note,weight_specs").order("id",{ascending:true}),{timeoutMs:20000}),
          cloudRead("ball_confirmations",q=>q.select("submission_id,confirmed_by,vote")),
          cloudRead("ball_groups",q=>q.select("id,bowler_name,name,sort_order")),
          cloudRead("bags",q=>q.select("id,bowler_name,name,bag_type,ball_limit,includes_plastic").order("created_at",{ascending:true})),
          cloudRead("manual_scores",q=>q.select("bowler_name,league_id,date,game,score,ball,surface,session_seq")),
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
          // Guest shots never go to the cloud, so a full fetch cannot bring
          // them back -- keep the ones already on this device, or a Force
          // resync (or a long absence) wipes every guest's night.
          let guestShots=[];
          try{
            const prev=await window.storage.get(STORAGE_KEY);
            const arr=prev?JSON.parse(prev.value):[];
            if(Array.isArray(arr))guestShots=arr.filter(x=>x&&x.localOnly===true);
          }catch{}
          migratedShots=migrateShots([...cloudShots,...guestShots,...pendingShots]);
          setShots(migratedShots);
          try{await window.storage.set(STORAGE_KEY,JSON.stringify(migratedShots));}catch{}
          // A completed full sync -- from here on, later opens can ask
          // for only what changed instead of repeating this.
          // A SERVER timestamp or no cursor at all -- never the phone's
          // clock. seedCursor explains why; the short version is that a
          // cursor seeded from local time can sit ahead of rows that
          // already exist, and those rows are then never asked for
          // again. No cursor simply means the next open fetches in full.
          const seed=seedCursor(shotsRes.data.map(r=>r.updated_at));
          if(seed){try{await window.storage.set(SHOTS_CURSOR_KEY,seed);}catch{}}
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
          // A SERVER timestamp or no cursor at all -- never the phone's
          // clock. seedCursor explains why; the short version is that a
          // cursor seeded from local time can sit ahead of rows that
          // already exist, and those rows are then never asked for
          // again. No cursor simply means the next open fetches in full.
          const seed=seedCursor(sessionsRes.data.map(r=>r.updated_at));
          if(seed){try{await window.storage.set(SESSIONS_CURSOR_KEY,seed);}catch{}}
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

        // Only this bowler's leagues -- the read above returns every
        // league (see loadLeagues), and these maps are keyed by NAME, so
        // another bowler's same-named league would overwrite this one's
        // dates, center and pattern. No list (offline, or the table not
        // there yet): the cached maps below, not a polluted one.
        const myLeagues=await cloudRead("user_leagues",q=>q.select("league_id"));
        const myLeagueIds=myLeagues.online&&Array.isArray(myLeagues.data)
          ?new Set(myLeagues.data.map(r=>r&&r.league_id).filter(Boolean))
          :null;
                if(leagueCentersRes.online&&leagueCentersRes.data&&myLeagueIds){
          const map={};
          const dateMap={};
          const formatMap={};
          const patternMap={};
          leagueCentersRes.data.filter(r=>r&&myLeagueIds.has(r.id)).forEach(r=>{
            if(r.center_id)map[r.name]=r.center_id;
            if(r.start_date||r.end_date)dateMap[r.name]=normalizeLeagueDates({startDate:r.start_date||"",endDate:r.end_date||""});

            if(r.format)formatMap[r.name]=leagueFormat(r.format);
            if(r.pattern_name)patternMap[r.name]=String(r.pattern_name);
          });
          setLeagueCenters(map);
          setLeagueDates(dateMap);
          setLeagueFormats(formatMap);
          setLeaguePatterns(patternMap);
          try{await window.storage.set(LEAGUE_CENTERS_KEY,JSON.stringify(map));}catch{}
          try{await window.storage.set(LEAGUE_DATES_KEY,JSON.stringify(dateMap));}catch{}
          try{await window.storage.set(LEAGUE_PATTERNS_KEY,JSON.stringify(patternMap));}catch{}
        }else{
          const lc=await readCached(LEAGUE_CENTERS_KEY,"object");
          if(lc)setLeagueCenters(lc);
          const ld=await readCached(LEAGUE_DATES_KEY,"object");
          if(ld)setLeagueDates(ld);
          // Cached too, so the pattern comparison still has its
          // defaults on an offline open.
          const lp=await readCached(LEAGUE_PATTERNS_KEY,"object");
          if(lp)setLeaguePatterns(lp);
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
      // THIS bowler's leagues, from user_leagues -- not every row in
      // \`leagues\`. That table is readable by everyone on purpose (a shared
      // league is joined by name), and reading it as "my leagues" listed
      // every league in the database on every account: a brand-new account
      // opened on "choose your active league" with someone else's six.
      // It also mapped names to OTHER bowlers' league ids, and names are
      // only unique per creator. See 20260924120000_user_leagues.sql.
      const mine=await cloudRead("user_leagues",q=>q.select("league_id,leagues(id,name)"));
      const online=mine.online;
      const data=online&&Array.isArray(mine.data)
        ?mine.data.map(r=>r&&r.leagues).filter(r=>r&&r.id&&r.name)
        :null;
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
        // Written even when empty. An empty answer from the server is the
        // truth for a new account, and skipping the write is what left a
        // previous list sitting in this device's cache.
        setLeagues(names);
        try{await window.storage.set(LEAGUES_KEY,JSON.stringify(names));}catch{}
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
  },[leaguesReload]);

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


  // ── Refresh everything from the cloud ───────────────────────────────
  //
  // Shots and sessions are the only two tables fetched INCREMENTALLY:
  // each load asks for rows changed since a stored cursor, instead of
  // re-downloading a whole career every time the app opens. That is the
  // right default -- a bowler with ten seasons should not wait for all
  // ten to come down to see tonight -- but it has one failure mode with
  // no way out of it from inside the app.
  //
  // If the cursor ever ends up AHEAD of a row's updated_at, that row is
  // never asked for again. Rows written directly to the database rather
  // than through the app do this routinely; so does a device whose clock
  // ran ahead, or a write that landed while a sync was mid-flight. The
  // data is in the cloud, correct and owned by the right person, and the
  // app simply never requests it. Nothing errors. The bowler sees a
  // history with a hole in it and no reason for it.
  //
  // Every other table is read in full on every load, so this affects
  // exactly the two that are not.
  //
  // WHY THIS CLEARS ONLY THE CURSORS, NOT THE CACHED ROWS:
  //
  // With no cursor, the next load takes the full-fetch path and replaces
  // the cached array wholesale, which is the fix. Deleting the cached
  // rows here as well would buy nothing and cost something real -- if
  // that fetch then fails (a dead spot at the alley, and this is a
  // phone), the load falls back to the cache, and the cache would be the
  // thing we had just thrown away. The bowler would be looking at an
  // empty app.
  //
  // So the worst case here is an ordinary failed sync: they still see
  // everything they saw before, and the refresh happens next time.
  //
  // Pending local changes are flushed FIRST. They survive either way --
  // the full-fetch path re-adds anything still queued -- but sending
  // them before the refresh means the cloud is the newer copy, which is
  // the direction that cannot lose anything.
  const[resyncBusy,setResyncBusy]=useState(false);
  const[resyncError,setResyncError]=useState("");
  async function forceResync(){
    setResyncBusy(true);
    setResyncError("");
    // Flushing is best-effort: a queue that will not send is a reason to
    // refresh, not a reason to refuse to.
    try{await flushPendingQueue();}catch{}
    try{
      // `delete`, not `remove` -- the adapter in this file and the scoped
      // wrapper in scopedStorage.js both expose get/set/delete, and a
      // call to a method that does not exist would throw, be swallowed,
      // and leave the cursors in place while still reloading. The button
      // would look like it worked and change nothing.
      await window.storage.delete(SHOTS_CURSOR_KEY);
      await window.storage.delete(SESSIONS_CURSOR_KEY);
    }catch{
      // Said out loud rather than reloading anyway. A reload that did not
      // clear the cursors changes nothing, and "I pressed it and it did
      // not help" is the worst thing a repair button can do.
      setResyncError("Could not clear the sync markers on this device. Nothing was changed.");
      setResyncBusy(false);
      return;
    }
    // Reload rather than re-running load() in place: the cursors are
    // read once at the top of it, so an in-place re-run would have to
    // re-enter the same effect anyway, and a reload is the one thing
    // guaranteed to start from a clean read of storage.
    try{window.location.reload();}catch{setResyncBusy(false);}
  }

  // Your name changed on the server (set_display_name): every shot,
  // session and score there now carries the new name, and everything
  // cached on this phone still carries the old one. Carry the one piece
  // of state that is keyed by name and lives only here -- the session
  // counter -- across, then reload from the cloud.
  const forceResyncRef=useRef(null);
  forceResyncRef.current=forceResync;
  useEffect(()=>{
    function onRenamed(e){
      const from=String(e?.detail?.from||"");
      const to=String(e?.detail?.to||"");
      if(from&&to&&from!==to){
        try{
          const raw=readLocal("bowling-session-seq-v1",uid);
          const map=raw?JSON.parse(raw):{};
          const next={};
          for(const[k,v]of Object.entries(map||{})){
            const parts=k.split("||");
            if(parts[0]===from)parts[0]=to;
            const nk=parts.join("||");
            next[nk]=Math.max(Number(next[nk])||0,Number(v)||0);
          }
          writeLocal("bowling-session-seq-v1",uid,JSON.stringify(next));
        }catch{}
      }
      forceResyncRef.current?.();
    }
    window.addEventListener("mbj:bowler-renamed",onRenamed);
    return()=>window.removeEventListener("mbj:bowler-renamed",onRenamed);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[uid]);

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
  // Several bowlers can each have a league with the same name. Only this
  // bowler's OWN row is ever picked up by name.
  //
  // It used to fall back to rows[0] -- whichever same-named league the
  // database returned first, at any bowling center -- so typing "Monday
  // Night" quietly joined a stranger's league in another town. Joining
  // someone else's league is now a choice the bowler makes from a list
  // that shows each one's center (league_matches, joinExistingLeague).
  function pickLeagueRow(rows){
    return rows.find(r=>r&&r.created_by&&r.created_by===user?.id)||null;
  }
  // Joining a league somebody else created: record it as this bowler's,
  // so it is in their list before they have logged anything in it. The
  // triggers cover every later write; this covers the gap. Best effort --
  // the first session logged in it adds the same row anyway.
  function adoptLeague(leagueId){
    if(!leagueId)return;
    supabase.rpc("add_my_league",{p_league_id:leagueId}).then(({error})=>{
      if(error)console.error("add_my_league failed:",error.message);
    },()=>{});
  }

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
      const existing=await cloudRead("leagues",q=>q.select("id,name,created_by").eq("name",name));
      const own=existing.online&&Array.isArray(existing.data)?pickLeagueRow(existing.data):null;
      if(own){
        leagueIdsRef.current[name]=own.id;
        adoptLeague(own.id);
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
      const after=await cloudRead("leagues",q=>q.select("id,name,created_by").eq("name",name));
      const ownAfter=after.online&&Array.isArray(after.data)?pickLeagueRow(after.data):null;
      if(ownAfter){
        leagueIdsRef.current[name]=ownAfter.id;
        adoptLeague(ownAfter.id);
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

  // ── Joining a league or team someone else set up ────────────────────
  //
  // Same-named leagues already on the app, with their center and how many
  // bowlers are in each, so the bowler can pick the one at THEIR house.
  // Leagues they already belong to are left out.
  // includeMine: also the ones this bowler is in -- used to spot a league
  // they have TWO copies of (their own, and the shared one they joined
  // through a team).
  async function findLeagueMatches(name,{includeMine=false}={}){
    const clean=String(name||"").trim();
    if(!clean||!supabase)return[];
    try{
      const{data,error}=await supabase.rpc("league_matches",{p_name:clean});
      if(error||!Array.isArray(data))return[];
      return data.filter(m=>m&&m.id&&(includeMine||!m.mine));
    }catch{return[];}
  }

  // Folds this bowler's own copy of a league into the shared one with the
  // same name -- every game, team and setting moves across (see
  // merge_into_league). The whole app reloads afterwards: shots, sessions
  // and teams all carried the old league's id, and a reload is the one
  // way to be sure nothing on screen still points at it.
  async function mergeLeague(leagueName,match){
    const fromId=leagueIdsRef.current?.[leagueName];
    if(!fromId||!match?.id||fromId===match.id)return false;
    const where=match.center_name?` at ${match.center_name}`:"";
    if(!confirm(`Combine your "${leagueName}" with the shared one${where}?\n\nYour games, teams and league settings move into it, and you'll see the teams already there. This can't be undone.`))return false;
    const{error}=await supabase.rpc("merge_into_league",{p_from:fromId,p_to:match.id});
    if(error){
      alert(/only the bowler who made/i.test(error.message||"")
        ?"Only the bowler who added this league can combine it. Ask them, or join the shared league from a team code."
        :"Couldn't combine them just now. Nothing was changed — try again in a moment.");
      return false;
    }
    window.location.reload();
    return true;
  }

  // Pulls one league's row into every name-keyed map (id, center, dates,
  // format, pattern) and re-reads the league list, so a league joined a
  // moment ago -- directly, or by joining a team in it -- shows up
  // complete without a restart.
  async function absorbLeague(leagueId){
    if(!leagueId)return;
    const res=await cloudRead("leagues",q=>q.select("id,name,center_id,start_date,end_date,format,pattern_name").eq("id",leagueId),{paginate:false});
    const r=res.online&&Array.isArray(res.data)?res.data[0]:null;
    if(r&&r.name){
      leagueIdsRef.current[r.name]=r.id;
      if(r.center_id)setLeagueCenters(prev=>({...prev,[r.name]:r.center_id}));
      if(r.start_date||r.end_date)setLeagueDates(prev=>({...prev,[r.name]:normalizeLeagueDates({startDate:r.start_date||"",endDate:r.end_date||""})}));
      if(r.format)setLeagueFormats(prev=>({...prev,[r.name]:leagueFormat(r.format)}));
      if(r.pattern_name)setLeaguePatterns(prev=>({...prev,[r.name]:String(r.pattern_name)}));
    }
    setLeaguesReload(n=>n+1);
  }

  // Joins a league another bowler created. The league's own row -- its
  // center, dates, format -- is shared, so this bowler sees what the
  // league already has rather than starting a parallel copy of it.
  async function joinExistingLeague(match){
    const name=String(match?.name||"").trim();
    if(!match?.id||!name)return false;
    if(leagues.some(l=>l.toLowerCase()===name.toLowerCase())){
      alert("You already have a league with that name. Rename yours first, then join this one.");
      return false;
    }
    const{error}=await supabase.rpc("add_my_league",{p_league_id:match.id});
    if(error){
      alert("Couldn't join that league just now. Check your connection and try again.");
      return false;
    }
    leagueIdsRef.current[name]=match.id;
    await saveLeagues([name,...leagues]);
    await absorbLeague(match.id);
    return true;
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

  // Mirrors saveLeagueFormat exactly, including the cloudUpdate: an
  // upsert would send the whole row and blank the league's centre, dates
  // and format along the way.
  async function saveLeaguePattern(name,patternName){
    const clean=String(patternName||"").trim();
    const next={...leaguePatterns};
    if(clean)next[name]=clean; else delete next[name];
    setLeaguePatterns(next);
    try{window.storage.set(LEAGUE_PATTERNS_KEY,JSON.stringify(next));}catch{}
    const id=leagueIdsRef.current?.[name];
    if(id)await cloudUpdate("leagues",{id},{pattern_name:clean||null});
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
    // THE CLOUD IS ASKED FIRST, and nothing local moves until it agrees.
    //
    // This used to rename every shot, session, match and lane pattern
    // first and rename the league row afterwards. saveShots and friends
    // push to the cloud as well as writing locally (see syncShotsToCloud),
    // so by the time a duplicate came back from the leagues table the
    // bowler's whole season had ALREADY been relabelled, on this device
    // and in the cloud, while the league row itself still held the old
    // name. The duplicate branch undid the id remap and said "pick a
    // different name" -- which reads as "nothing happened" to somebody
    // whose every shot had just been re-attributed to a different league
    // on every device they own.
    //
    // A duplicate is the EXPECTED outcome whenever the other name was
    // created on another device and has not synced here yet, which makes
    // this a path real bowlers hit, not a theoretical one.
    //
    // Renaming the league row first means a refusal costs nothing: there
    // is nothing to undo, because nothing has been written.
    const existingId=leagueIdsRef.current[oldName];
    let renameFailed=false;
    if(existingId){
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
        // Nothing to undo -- see above. No local record has been touched.
        alert(`You already have a league called "${clean}". Pick a different name.`);
        return;
      }
      renameFailed=!result.synced;
      // Only now that the row carries the new name does the id map move.
      delete leagueIdsRef.current[oldName];
      leagueIdsRef.current[clean]=existingId;
    }else{
      const failed=await ensureLeaguesInCloud([clean]);
      renameFailed=failed.length>0;
    }

    // The league row is renamed (or is queued to be). Now the records
    // that point at it by name can follow.
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

    if(renameFailed){
      alert(`"${clean}" was renamed on this device only and hasn't reached the cloud yet. It'll keep retrying in the background if you're offline; check back if this persists.`);
    }
    // The per-league maps are keyed by NAME, so a rename orphans every
    // one of them until the next cloud read rebuilds it. Moved across
    // here so the league keeps its settings for the rest of the session
    // rather than appearing to have lost them.
    //
    // leaguePatterns matters most of the four: it is the only one whose
    // value the bowler typed rather than picked, so losing it looks like
    // the app forgot what they said.
    const remapByName=(map,setter,key)=>{
      if(!map||!(oldName in map))return;
      const next={...map};
      next[clean]=next[oldName];
      delete next[oldName];
      setter(next);
      if(key){try{window.storage.set(key,JSON.stringify(next));}catch{}}
    };
    remapByName(leaguePatterns,setLeaguePatterns,LEAGUE_PATTERNS_KEY);
    remapByName(leagueCenters,setLeagueCenters,LEAGUE_CENTERS_KEY);
    remapByName(leagueDates,setLeagueDates,LEAGUE_DATES_KEY);
    remapByName(leagueFormats,setLeagueFormats,LEAGUE_FORMATS_KEY);

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
    setActiveDrill({...emptyDrill(activeBowler,sessionDate),sessionSeq:currentSessionSeq});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[preferences.environment,practiceMode,activeDrill,activeBowler,sessionDate]);

  // ── Practice drills ─────────────────────────────────────────────────
  function startDrill(){
    setActiveDrill({...emptyDrill(activeBowler,sessionDate),sessionSeq:currentSessionSeq});
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
    setActiveDrill({...emptyDrill(activeBowler,sessionDate),sessionSeq:currentSessionSeq});
    setDrillSaved(false);
  }
  function saveDrill(){
    if(!activeDrill||!activeBowler)return;
    // Second guard, independent of the one in selectBowler: never stamp a
    // drill with a bowler other than the one it was started for. If those
    // ever disagree, something upstream is wrong and writing the row
    // anyway would corrupt that bowler's drill history.
    if(activeDrill.bowler&&activeDrill.bowler!==activeBowler)return;
    const withId={...normalizeDrill(activeDrill),id:activeDrill.id||crypto.randomUUID(),bowler:activeDrill.bowler||activeBowler,
      // The drill keeps the session it was STARTED in, not whichever one
      // happens to be current when it is saved.
      sessionSeq:activeDrill.sessionSeq||currentSessionSeq};
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
    writeLocal("bowling-teams-v1",uid,JSON.stringify(next));
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
      const CENTERS_FALLBACK="Couldn't search for centers right now. You can add the center by name instead.";
      if(error){
        const failure=await readFunctionFailure(error);
        recordError({kind:"function",where:"find-centers",message:failure.body?.error||failure.message,detail:failureDetail(failure)});
        return{error:friendlyFunctionError(failure,CENTERS_FALLBACK).text};
      }
      if(data?.error)return{error:friendlyFunctionError({status:500,body:data},CENTERS_FALLBACK).text};
      return{centers:data?.centers||[]};
    }catch(e){
      recordError({kind:"function",where:"find-centers",message:String(e?.message||e)});
      return{error:"Couldn't search for centers right now. You can add the center by name instead."};
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
    // Pin type goes through set_center_pins(), not a table update.
    //
    // Pin type is a fact about the building, and the Pins chips sit under
    // every league's center -- but the only UPDATE policy on
    // bowling_centers is for a bowler's own HAND-ENTERED center. Every
    // center found through the lookup refused the update, the fallback
    // upsert was refused too (42501, "USING expression"), and the chips
    // looked saved here and came back blank everywhere else. The function
    // lets any signed-in bowler set those two columns and nothing else.
    //
    // "no such center" (P0002) means the row never reached the cloud --
    // created offline, or its first write was dropped. Only then, and only
    // for a center this bowler made, is the whole row sent.
    if(updated){
      (async()=>{
        const row=centerToRow(updated,user?.id||null);
        try{
          const{error}=await supabase.rpc("set_center_pins",{
            p_center_id:centerId,
            p_rack_type:row.rack_type,
            p_freefall_lanes:row.freefall_lanes,
          });
          if(!error)return;
          const mine=!updated.createdBy||updated.createdBy===(user?.id||"");
          if(error.code==="P0002"&&mine){
            await cloudWrite("bowling_centers",row);
            return;
          }
          recordError({kind:"write-failed",where:"set_center_pins",message:error.message||"",code:error.code||""});
        }catch(e){
          recordError({kind:"write-failed",where:"set_center_pins",message:String(e?.message||e)});
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
    // Seeded in the app's language: from here on they are the bowler's own
    // names, stored as written.
    const seeded=DEFAULT_BALL_GROUPS.map((name,i)=>({
      id:crypto.randomUUID(),bowlerName,name:inAppLanguage(name),sortOrder:i,
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

  async function loadTeamRequests(){
    if(!user?.id||!supabase)return;
    try{
      const{data,error}=await supabase.rpc("my_team_requests");
      // Before the migration runs the function does not exist; the inbox
      // simply has nothing from it rather than an error.
      if(!error&&Array.isArray(data))setTeamRequests(data);
    }catch{}
  }

  // Answered straight from the inbox -- tapping through to the Team tab
  // to find the right team's card was a detour, and before the requests
  // card moved to the top of that tab it was a dead end.
  const[teamRequestBusy,setTeamRequestBusy]=useState(null);
  async function answerTeamRequest(r,accept){
    if(!supabase||!r?.id)return;
    if(accept&&r.kind==="invite"&&r.current_team
      &&!window.confirm(`You're on ${r.current_team} in this league. Joining ${r.team_name||"this team"} takes you off ${r.current_team}'s roster. Your scores stay yours.`))return;
    setTeamRequestBusy(r.id);
    try{
      const{error}=await supabase.rpc("answer_team_request",{p_request_id:r.id,p_accept:accept});
      if(error){
        setSessionSaveMessage("That request was already answered, or couldn't be reached. Refreshing.");
        setTimeout(()=>setSessionSaveMessage(null),5000);
      }else if(accept){
        setSessionSaveMessage(r.kind==="invite"
          ?`You're on ${r.team_name||"the team"}.`
          :`${r.bowler_name||"They"} ${r.bowler_name?"is":"are"} on ${r.team_name||"your team"} now.`);
        setTimeout(()=>setSessionSaveMessage(null),5000);
        if(r.kind==="invite"&&r.league_id)await absorbLeague(r.league_id);
      }
    }catch{}
    await loadTeamRequests();
    setTeamRequestBusy(null);
  }

  // Every team in one of this bowler's leagues -- names and sizes, not
  // rosters -- so the League card can show the whole league, not only the
  // teams this bowler is on (which is all RLS lets the teams table show).
  async function fetchLeagueTeams(leagueName){
    const id=leagueIdsRef.current?.[leagueName];
    if(!id||!supabase)return null;
    try{
      const{data,error}=await supabase.rpc("league_teams",{p_league_id:id});
      return !error&&Array.isArray(data)?data:null;
    }catch{return null;}
  }
  async function askToJoinTeam(teamId,{teamName="",current=null,pending=null}={}){
    if(!teamId||!supabase)return false;
    const lines=[];
    if(current)lines.push(`You're on ${current} in this league. If ${teamName||"they"} approve${teamName?"s":""} you, you'll be taken off ${current}'s roster. Your scores stay yours.`);
    if(pending)lines.push(`This replaces your request to join ${pending}.`);
    if(lines.length&&!window.confirm(lines.join("\n\n")))return false;
    try{
      const{error}=await supabase.rpc("request_to_join_team",{p_team_id:teamId});
      await loadTeamRequests();
      return !error||error.hint==="already_member";
    }catch{return false;}
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
    // League names straight from the leagues table.
    //
    // This runs at sign-in, alongside the league load that fills
    // leagueIdsRef -- so the ref was often still empty, every record came
    // back with no league, and approving one filed its frames under no
    // league at all. That is how the 9/10 night never reached the
    // calendar.
    const missing=[...new Set(res.data.map(r=>r.league_id).filter(id=>id&&!nameById[id]))];
    if(missing.length){
      const lg=await cloudRead("leagues",q=>q.select("id,name").in("id",missing));
      if(lg.online&&Array.isArray(lg.data))lg.data.forEach(l=>{if(l&&l.id)nameById[l.id]=l.name;});
    }
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
        // The import reads the roster itself and sends the id; the team
        // here usually has no members loaded (see ImportScorecard).
        bowler_user_id:e.bowlerUserId||member?.userId||null,
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
    // Filed under no league, a night reaches nothing that groups by
    // league -- the calendar, the season, the team. Better to stop than
    // to write it there.
    const mine=record.bowler===activeBowler||record.bowler===displayName;
    if(mine&&!record.league){
      window.alert("Couldn't tell which league this night belongs to. Reload the app and try again.");
      return;
    }
    const approved=approveImport(record);
    replaceImportRecord(approved);
    // Frames and scores go into history only for this account's own
    // bowler -- under the account's name or the one selected in Who's
    // Bowling.
    if(!mine)return;

    const frames=record.correctedShots?.length?record.correctedShots:record.importedShots;
    const added=Array.isArray(frames)&&frames.length?await addApprovedFrames(record,frames):[];
    await fileApprovedNight(record,added);
  }

  // The night's session row: its scores, series and average.
  //
  // Approving used to write only the frames, so a night came back as
  // "in progress" with no scores -- and a card with totals but no frames
  // wrote nothing at all. A night the bowler already filed is left alone.
  async function fileApprovedNight(record,addedShots){
    const scores=(effectiveScores(record)||[]).filter(v=>v!=null);
    if(!scores.length)return;
    const exists=sessions.some(x=>x&&x.bowler===record.bowler&&x.league===record.league&&x.date===record.date);
    if(exists)return;
    const night=[...shots,...addedShots].filter(sh=>sh.bowler===record.bowler&&sh.league===record.league&&sh.date===record.date);
    const total=scores.reduce((a,b)=>a+b,0);
    const session={
      id:crypto.randomUUID(),bowler:record.bowler,teamId:night[0]?.teamId||"",league:record.league,date:record.date,
      scores,sessionSeq:1,notes:"",total,average:Math.floor(total/scores.length),
      pokerQuarter:[0,0,0],pokerDollar:[0,0,0],threeSixNineWinnings:0,jackpotWinnings:0,
      highGameWinnings:[0,0,0],pokerQuarterCost:[0,0,0],pokerDollarCost:[0,0,0],highGameCost:[0,0,0],threeSixNineCost:0,
      ...computeSessionStats(night),
    };
    await saveSessions([...sessions,session]);
  }

  async function addApprovedFrames(record,frames){

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
          sessionSeq:1,
        });
      }
    }
    if(!newShots.length)return [];
    await saveShots([...shots,...newShots]);
    return newShots;
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

  // ── Pairing a coach and a bowler ────────────────────────────────────
  //
  // This was a search of `profiles` by display name. That table exposes
  // id and display_name and nothing else, so two bowlers with the same
  // name were one list of identical rows and a coach picked between
  // them by guessing. A code removes the guess: the two people are
  // already together when it is handed over.
  //
  // Same format as the team-roster codes -- see domain/signupCodes.js.
  async function createCoachingCode(iAmCoach){
    if(!user?.id)return;
    setCoachCodeError("");
    const code=generatePairingCode();
    const row={
      id:crypto.randomUUID(),
      code,
      created_by:user.id,
      inviter_is_coach:!!iAmCoach,
    };
    // Written straight through, NOT via cloudWrite.
    //
    // cloudWrite queues a failed write for later and reports
    // {synced:false,queued:true} rather than an error -- right for a
    // score logged in a basement with no signal, wrong for this. A code
    // that is only in the outbox cannot be claimed by anybody, so
    // showing it would have the coach read out eight characters that do
    // not work yet, and the bowler told the code is invalid.
    //
    // So it is shown only once the row is really there.
    const{error}=await supabase.from("coaching_invites").insert(row);
    if(error){
      setCoachCodeError("Couldn't make a code just now — check your connection and try again.");
      return;
    }
    setCoachInviteCode({code,iAmCoach:!!iAmCoach});
  }

  function clearCoachingCode(){
    setCoachInviteCode(null);
    setCoachCodeError("");
  }

  async function claimCoachingCode(raw){
    if(!user?.id)return;
    setCoachCodeError("");
    if(!isValidPairingCode(raw)){
      // Caught here rather than at the server so a mistype says so
      // immediately, and a wrong-length code is never sent as a
      // different code entirely (see isValidSignupCode).
      setCoachCodeError("That code doesn't look right — it's 8 characters.");
      return false;
    }
    const code=normalizePairingCode(raw);
    const{error}=await supabase.rpc("claim_coaching_code",{code});
    if(error){
      // The function's own messages are written for bowlers ("That code
      // is not valid", "That is your own code"), so they pass through.
      setCoachCodeError(error.message||"That code is not valid.");
      return false;
    }
    await loadCoaching();
    return true;
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
    // Validated against RAW, not against the normalized form -- which is
    // exactly what isValidSignupCode's own comment asks for, and what
    // this call site was getting wrong.
    //
    // normalizeSignupCode truncates to eight characters. Hand it the
    // normalized value and a nine-character mistype has already been cut
    // down to something eight characters long and perfectly valid, so
    // the check passes and a DIFFERENT code than the one typed goes to
    // the server: "ABCD23456" is silently claimed as "ABCD-2345". The
    // code is how a bowler consents to joining a roster, so landing on
    // the wrong one -- or getting an inexplicable refusal for a code
    // that looked fine -- is worse than being told about the typo.
    if(!isValidSignupCode(raw))return "That doesn't look like a team code.";
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
    writeLocal(ONBOARDED_KEY,uid,"1");
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

  // Leagues whose scores stay out of the scratch record: Baker (half a
  // partner's pins) and no-tap (a nine is a strike). Read from each
  // tournament's own format rather than guessed from its name.
  const scratchExcluded=useMemo(
    ()=>scratchExcludedLeagues(tournaments,user?.id||""),
    [tournaments,user?.id]);

  // Move a block's frames onto the block's own date.
  //
  // The two dates are set separately -- the shot form files under the
  // session date, the block carries its own -- so bowling first and
  // dating the block afterwards leaves the frames behind on the day
  // they were thrown. The reading side tolerates that (see pickForDay),
  // but tolerating a mismatch forever is not the same as not having
  // one: every screen that keys on a date has to know about it.
  //
  // Only the frames of THIS event, only from a date the bowler
  // confirmed, and the night's session row travels with them so the
  // calendar does not keep a night whose games have left.
  async function moveTournamentFrames(from,to){
    const a=String(from||""),b=String(to||"");
    if(!a||!b||a===b)return;
    const who=form.bowler||activeBowler;
    const base=tournamentBaseLeagueName(effectiveSessionLeague);
    const isMine=lg=>tournamentBaseLeagueName(String(lg||""))===base;

    const nextShots=(shots||[]).map(sh=>
      (sh&&sh.bowler===who&&isMine(sh.league)&&String(sh.date)===a)
        ?{...sh,date:b}:sh);
    if(nextShots.some((sh,i)=>sh!==(shots||[])[i]))await saveShots(nextShots);

    // The session row too. If the destination already has one, the old
    // row is dropped rather than duplicated -- two rows for one night
    // is what every lookup here is keyed to avoid.
    const rows=sessions||[];
    const old=rows.find(x=>x&&x.bowler===who&&isMine(x.league)&&String(x.date)===a);
    if(old){
      const already=rows.find(x=>x&&x!==old&&x.bowler===who&&isMine(x.league)&&String(x.date)===b);
      const nextSessions=already
        ?rows.filter(x=>x!==old)
        :rows.map(x=>x===old?{...x,date:b}:x);
      await saveSessions(nextSessions);
    }
  }

  function updateTournament(next){
    const normalized=normalizeTournament(next);
    setActiveTournament(normalized);
    try{window.storage.set(TOURNAMENT_KEY,JSON.stringify(normalized));}catch{}
  }

  // Clear the card for a new event. The saved one stays in history.
  // Abandon this tournament: everything entered for it goes, then Home.
  //
  // The tournament Set up tab had no way out. A wrong event, a test entry,
  // a block logged against the wrong tournament -- the only exits were to
  // save something that never happened, or to delete it piece by piece.
  //
  // Mirrors cancelSession for a league night, scoped to THIS event: its
  // shots (including any logged before it was named, which file under the
  // bare "Tournament" key on its dates), typed scores, any session rows,
  // and the tournament itself if it was ever saved. Asks twice in the UI.
  async function cancelTournament(){
    const t=activeTournament||{};
    const bowler=t.bowler||activeBowler;
    const league=t.name?tournamentLeagueCloudName(t.name,user?.id||""):TOURNAMENT_SESSION_KEY;
    const dates=new Set((t.days||[]).map(d=>String(d?.date||"")).filter(Boolean));
    // Phase leagues sit one segment below the event's own name, so
    // stripping the suffix is what makes cancelling take match play and
    // the stepladder with it rather than orphaning their frames.
    const ofThisEvent=(lg,date)=>tournamentBaseLeagueName(lg)===league
      ||(tournamentBaseLeagueName(lg)===TOURNAMENT_SESSION_KEY&&dates.has(String(date)));

    const keep=(shots||[]).filter(sh=>!(sh&&sh.bowler===bowler&&ofThisEvent(sh.league,sh.date)));
    if(keep.length!==(shots||[]).length)await saveShots(keep);

    for(const date of dates){
      for(const lg of new Set([league,TOURNAMENT_SESSION_KEY])){
        for(let g=1;g<=12;g++){
          if(getManualScore(manualScoresRef.current,bowler,lg,date,g)!=null){
            await updateManualScore(bowler,lg,date,g,"");
          }
        }
      }
    }

    const sessionsKept=(sessions||[]).filter(x=>!(x&&x.bowler===bowler&&ofThisEvent(x.league,x.date)));
    if(sessionsKept.length!==(sessions||[]).length)await saveSessions(sessionsKept);

    if(t.id&&(tournaments||[]).some(x=>x&&x.id===t.id)){
      const remaining=tournaments.filter(x=>x.id!==t.id);
      setTournaments(remaining);
      try{window.storage.set(TOURNAMENTS_KEY,JSON.stringify(remaining));}catch{}
      cloudDelete("tournaments",t.id);
    }

    closeTournament();
    setTournamentTab("setup");
    setView("home");
    try{window.scrollTo({top:0,behavior:"smooth"});}catch{}
  }

  function closeTournament(){
    const fresh=normalizeTournament({...emptyTournament(),bowler:activeBowler});
    setActiveTournament(fresh);
    try{window.storage.set(TOURNAMENT_KEY,JSON.stringify(fresh));}catch{}
    setTournamentSaveMessage("");
  }

  // finish: the bowler is done with the event.
  //
  // "End Tournament & View Results" saves and stays -- it is the step
  // before the results are read, and losing the block on the way to
  // looking at it would be absurd. "Save & Finish" saves and closes.
  async function saveTournament({finish=true}={}){
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
    // Today's block is filed as well, so the night reads as ended -- Home
    // goes back to the dashboard and the Nightcap knows it is over.
    await fileNight({quiet:true});
    setTournamentSaved(true);
    setTimeout(()=>setTournamentSaved(false),1500);
    // FINISHED means finished.
    //
    // The card used to stay loaded, so that a two-day event could be
    // saved at the end of day one and carried on the next morning. But
    // the button that gets here says "Save & Finish Tournament" and
    // then sends the bowler home -- so the next time they chose
    // Tournament they found last week's squads, dates and times sitting
    // there, and had to work out whether the app had failed to save or
    // was waiting for something.
    //
    // The event is in history and one tap away on the calendar, which
    // is where another block of it is added from. Nothing is lost by
    // clearing the card, and the next event starts clean.
    //
    // Not finished: "End Tournament & View Results" saves and stays --
    // it is the step before the results are read, and closing the card
    // on the way to looking at it would be absurd.
    if(!finish){
      setTournamentTab("results");
      try{window.scrollTo({top:0});}catch{}
      return;
    }
    closeTournament();
    setTournamentTab("setup");
    setView("home");
    try{window.scrollTo({top:0,behavior:"smooth"});}catch{}
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
      result:"",otherLeave:[],spareMade:"",secondLeave:undefined,strikeDescription:"",
      release:"",miss:[],ballChangeReason:[],pinCount:"",notes:"",
    };

    // Resume this bowler at their own next unplayed frame for tonight's
    // league/date, instead of leaving them wherever the previous bowler was.
    if(sessionLeague){
      // This bowler's own session number for tonight (each bowler has one).
      const bSeq=sessionSeqMap[sessionSeqKey(name,
        preferences.environment==="practice"?PRACTICE_SESSION_KEY:
        preferences.environment==="casual"?CASUAL_SESSION_KEY:
        (sessionLeague||""),sessionDate)]||1;
      const allBShots=shots.filter(s=>s.bowler===name&&s.league===effectiveSessionLeague&&s.date===sessionDate
        &&(Number(s.sessionSeq)||1)===bSeq);
      if(allBShots.length){
        // Resume from the LAST ball bowled, tenth-frame balls 2 and 3
        // included. Looking only at ball 1 sent a bowler who had finished
        // the game with X X X back to ball 2 of that tenth -- and the next
        // save overwrote the ball that was already there.
        const last=[...allBShots].sort((a,b)=>{
          const ga=parseInt(a.game),gb=parseInt(b.game);
          if(ga!==gb)return ga-gb;
          const fa=parseInt(a.frame),fb=parseInt(b.frame);
          if(fa!==fb)return fa-fb;
          return (Number(a.ballNum)||1)-(Number(b.ballNum)||1);
        }).pop();
        const{game:ng,frame:nf,ballNum:nb}=nextState(allBShots,name,effectiveSessionLeague,sessionDate,last.game,last.frame,last.ballNum,bSeq);
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
        average:scores.length?Math.floor(total/scores.length):null,
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
          // The key's tail is "game|session" (older keys: just "game").
          // Sending the whole tail as the game was a 22P02 on the integer
          // column, discarded after three tries -- and the typed scores
          // came back on the next load.
          const[gamePart,seqPart]=k.slice(prefix.length).split("|");
          const game=parseInt(gamePart,10);
          if(!Number.isFinite(game))continue;
          const match={bowler_name:bowler,league_id:leagueId,date,game};
          if(seqPart!==undefined&&Number.isFinite(parseInt(seqPart,10)))match.session_seq=parseInt(seqPart,10);
          await cloudDelete("manual_scores",match);
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
    // Lanes start at 1. Anything else is no lane, not a negative one.
    if(!(start>=1))return null;
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
          // Scoped: the load above reads this through window.storage, which
          // adds the user prefix. Written unscoped, it was never read back,
          // so lane lines reset on every reload.
          writeLocal("bowling-ball-lane-lines-v1",uid,JSON.stringify(updated));
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
      // Re-answering clears the pin taps.
      //
      // "Yes" means everything went down, so a partial list contradicts
      // it. Clearing on any change also stops a stale list surviving a
      // No -> Yes -> No round trip, where the picker would reopen with
      // pins already lit that the bowler never tapped this time.
      return{...f,spareMade:newVal,pinCount:pc,secondLeave:undefined};
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
      // Changing what stood after the FIRST ball invalidates any answer
      // about the second: the spare ball was thrown at a different rack.
      // It already resets spareMade for the same reason.
      return{...f,otherLeave:newLeave,pinCount:String(fb),spareMade:"",secondLeave:undefined};
    });
  }

  const standingPins=standingCount(form.otherLeave);
  const firstBallPins=form.result==="Other Leave"?Math.max(0,10-standingPins):null;
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
      // Match play and the stepladder bowl their own games from 1, so
      // they file under their own container league -- see
      // tournamentPhaseLeagueName.
      ?tournamentPhaseLeagueName(
          activeTournament?.name
            ?tournamentLeagueCloudName(activeTournament.name,user?.id||"")
            :TOURNAMENT_SESSION_KEY,
          tournamentPhase)
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
  // THE NIGHT is the event, not the phase.
  //
  // Match play and the stepladder file their frames under their own
  // container leagues so their game numbering cannot collide with
  // qualifying's. That is a detail of where shots are WRITTEN; the
  // night itself -- its session row, its money, its recap, its Nightcap
  // -- belongs to the event. Keying the night on the phase league meant
  // that leaving the Scoring tab on Stepladder and coming back to
  // Results found no session at all, and the recap and Nightcap simply
  // vanished.
  const nightLeague=preferences.environment==="tournament"
    ?tournamentBaseLeagueName(effectiveSessionLeague)
    :effectiveSessionLeague;
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
  // behind showSparePins, which itself requires standingPins > 0 -- so with
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
  // Same condition the stepper used, renamed for what it now shows.
  //
  // A single pin never reaches it: "Spare made?" has already asked the
  // only question a single pin has. That is why Weak 10 and Ringing 10
  // skip it -- they are single-pin leaves by definition.
  const showSparePins=hasLeave&&form.spareMade==="No"&&!isSinglePin&&standingPins>0;

  // The pins the spare ball was thrown at, and which of them fell.
  const sparePinsStanding=standingAfterFirst(form);
  const spareKnocked=knockedFromSecondLeave(sparePinsStanding,form.secondLeave)||[];
  // Every standing pin tapped: this frame IS a spare, and will be saved
  // as one. Not blocked, and NOT written into the form -- flipping
  // spareMade here would hide the picker mid-tap and make a mis-tap
  // unrecoverable. The form keeps saying "No" until save.
  const spareWillConvert=showSparePins&&isAccidentalSpare(sparePinsStanding,spareKnocked);

  // Tapping a pin writes BOTH the new field and the old one.
  //
  // pinCount stays exactly as it was -- the frame total -- so scoring,
  // stats and every existing consumer carry on untouched. It is simply
  // derived now instead of typed, which also means the two can never
  // disagree the way a stepper and a leave could.
  function toggleSparePin(pin){
    setForm(f=>{
      const standing=standingAfterFirst(f);
      const wasKnocked=knockedFromSecondLeave(standing,f.secondLeave)||[];
      const knocked=toggleKnocked(wasKnocked,pin);
      return{
        ...f,
        secondLeave:secondLeaveFrom(standing,knocked),
        pinCount:String(pinCountFrom(standing,knocked)),
      };
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
      // Ball 2 goes too when ball 1 stops being a strike -- and until now
      // this comment was the only place that happened.
      //
      // A ball-2 record exists for exactly one reason: ball 1 was a
      // strike, which reset the rack and bought a second delivery of its
      // own. Edit that strike into anything else and ball 2 has lost the
      // thing that created it. A non-strike ball 1 carries its own second
      // delivery inside its own record -- a spare goes straight to ball 3
      // and an open ends the frame -- so a surviving ball 2 is a delivery
      // that was never bowled.
      //
      // Found by sweeping every edit of every frame against an
      // independent scorer: "X X X" with ball 1 edited to a spare kept
      // its ball 2, and the ninth frame scored 268 where it should have
      // scored 259. Silent and plausible, which is the bad kind.
      //
      // Ball 2 first, then ball 3, because whether ball 3 is still earned
      // depends on the ball 2 that is left behind afterwards.
      if(parseInt(shotData.frame)===10){
        const mine=s=>s.bowler===shotData.bowler&&s.league===shotData.league
          &&s.date===shotData.date&&String(s.game)===String(shotData.game)
          &&parseInt(s.frame)===10;
        const drop=async pred=>{
          const stale=updated.filter(s=>mine(s)&&pred(s));
          if(!stale.length)return;
          updated=updated.filter(s=>!(mine(s)&&pred(s)));
          for(const sh of stale)await cloudDelete("shots",sh.id);
        };

        const firstBall=updated.find(s=>mine(s)&&(!s.ballNum||Number(s.ballNum)===1))||null;
        if(firstBall&&!isStk(firstBall)){
          await drop(s=>Number(s.ballNum)===2);
        }

        const b1=updated.find(s=>mine(s)&&(!s.ballNum||Number(s.ballNum)===1))||null;
        const b2=updated.find(s=>mine(s)&&Number(s.ballNum)===2)||null;
        if(!tenthBall3Earned(b1,b2)){
          await drop(s=>Number(s.ballNum)===3);
        }
      }

      await saveShots(updated);
      setEditingId(null);

      // ── An edit can OWE the tenth more balls ────────────────────────
      //
      // The block above drops a fill ball an edit un-earned. This is the
      // same problem in reverse, and it had no handling at all.
      //
      // Bowl an open tenth: one record, the game is over, and the form
      // moves on to the next game. Now go back and correct that first
      // ball to a strike. The tenth has just earned two more balls that
      // do not exist -- and the edit finished by restoring preEditForm,
      // which is the NEXT GAME. There was no route back to ball 2: the
      // tenth showed a lone strike, frames 9 and 10 went blank because a
      // tenth mid-frame genuinely cannot be scored, and the only way to
      // finish the frame was to delete it and bowl it again.
      //
      // nextState is the same function the normal save path uses to
      // decide where to go after a ball, and it already knows every
      // version of this rule -- strike on ball 1 owes ball 2, a strike
      // on ball 2 owes ball 3, a spare skips to ball 3. Asking it here
      // rather than re-deriving the sequence keeps one answer to the
      // question.
      //
      // Only when that ball is genuinely MISSING. Editing ball 1 of a
      // complete X X X tenth also "owes" ball 2, but ball 2 is sitting
      // right there -- landing on it would overwrite a ball that was
      // already bowled.
      // WALKED forward, not asked once.
      //
      // Asking nextState for the ball after the edited one finds the gap
      // only when the gap is immediately next. Edit ball 1 of a tenth
      // holding "X X" and the answer is ball 2 -- which is already
      // there -- so it reported nothing owed while ball 3 was missing and
      // earned, and the bowler was stranded on an unfinishable frame
      // again, one ball further along.
      //
      // So it steps: next ball, and if that one exists, next again, until
      // it finds one that is missing or the frame ends. Bounded at three
      // because a tenth has three balls.
      let owed=null;
      if(parseInt(shotData.frame)===10){
        const here=s=>s&&s.bowler===shotData.bowler&&s.league===shotData.league
          &&s.date===shotData.date&&String(s.game)===String(shotData.game)
          &&parseInt(s.frame)===10&&(Number(s.sessionSeq)||1)===(Number(shotData.sessionSeq)||1);
        let cursor=shotBallNum;
        for(let step=0;step<3;step++){
          const ns=nextState(updated,shotData.bowler,shotData.league,shotData.date,
                             String(shotData.game),"10",cursor,Number(shotData.sessionSeq)||1);
          if(!(ns&&String(ns.frame)==="10"&&String(ns.game)===String(shotData.game)))break;
          const filled=updated.some(s=>here(s)&&Number(s.ballNum)===Number(ns.ballNum));
          if(!filled){owed=ns;break;}
          if(Number(ns.ballNum)===Number(cursor))break;   // no progress, stop
          cursor=Number(ns.ballNum);
        }
      }

      if(owed){
        // Carry the gear, same as everywhere else: the next ball of the
        // tenth is the same bowler on the same lane with the same ball.
        setForm({
          ...emptyShot(),
          bowler:shotData.bowler,
          league:shotData.league,
          date:shotData.date,
          lane:shotData.lane,
          game:String(shotData.game),
          frame:"10",
          ballNum:owed.ballNum,
          ball:shotData.ball,
          surface:shotData.surface,
          startingBoard:shotData.startingBoard,
          targetArrows:shotData.targetArrows,
          heelNumber:shotData.heelNumber,
          soleNumber:shotData.soleNumber,
        });
      }else{
        // Return to wherever the user was actively logging before they jumped
        // into edit mode, instead of resetting all the way back to Frame 1.
        setForm(preEditForm||emptyShot());
      }
      setPreEditForm(null);
    } else {
      // A "slot" is uniquely identified by bowler+league+date+game+frame+ballNum.
      // If one somehow already exists (e.g. a stale ball selector re-offering an
      // already-played 10th-frame ball), overwrite it rather than adding a
      // second shot for the same slot — a duplicate would corrupt frame lookups
      // in strictPartial, which expects exactly one shot per slot.
      const existingSlot=findExistingShotSlot(shots,{...form,league:shotLeague,date:shotDate,ballNum:shotBallNum,sessionSeq:currentSessionSeq});
      // Every standing pin tapped means the spare was made, whatever the
      // Spare made chip still says.
      //
      // Resolved HERE rather than in the picker on purpose: writing "Yes"
      // into the form the moment the last pin is tapped would hide the
      // picker, and a bowler who mis-tapped would have no way back to it.
      // Deciding at save keeps every tap reversible right up to the
      // moment it stops being editable.
      //
      // secondLeave is already [] and pinCount already 10 in this case --
      // both derived from the taps -- so nothing else needs adjusting.
      const tappedEverything=form.result==="Other Leave"
        &&form.spareMade==="No"
        &&isAccidentalSpare(standingAfterFirst(form),
                            knockedFromSecondLeave(standingAfterFirst(form),form.secondLeave)||[]);

      const toSave={
        ...form,
        spareMade:tappedEverything?"Yes":form.spareMade,
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
        // Which session of that day. Every environment has one: two
        // practices, two open-bowling outings and (rarely) two
        // tournaments in a day are all real, and a league night is
        // simply always session 1.
        sessionSeq:currentSessionSeq,
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
      const{game:ng,frame:nf,ballNum:nb}=nextState(updated,form.bowler,shotLeague,shotDate,form.game,form.frame,form.ballNum,currentSessionSeq);


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
    // No scroll here any more.
    //
    // This was window.scrollTo(0,0), which looked right only because the
    // edit banner used to sit at the top of the tab. Tapping a frame threw
    // the bowler to the top of the page and away from the frames they had
    // just tapped. LogView now scrolls to the banner itself, and the
    // banner sits directly above the frames -- so the shot being edited
    // and the card it belongs to arrive together.
  }

  // Leaving edit mode, two ways.
  //
  //   cancelEdit()                 -- "never mind". The edit is abandoned
  //                                   and the form goes back to whatever
  //                                   the bowler was in the middle of
  //                                   before they tapped the frame.
  //
  //   cancelEdit({stayOnFrame:true}) -- the shot was DELETED. Going back
  //                                   to preEditForm would jump the
  //                                   bowler forward to the next unbowled
  //                                   frame, which is exactly the frame
  //                                   they are not thinking about: they
  //                                   deleted frame 3 because frame 3 is
  //                                   wrong, and frame 3 is now empty and
  //                                   waiting to be re-bowled. So the
  //                                   form lands ON the deleted frame,
  //                                   cleared.
  //
  // The gear carries either way -- same ball, surface, line and shoes the
  // shot was bowled with. Re-bowling a frame is not a new setup, and
  // re-entering all of it to correct one result is the kind of tax that
  // stops people correcting anything.
  function cancelEdit(opts){
    setEditingId(null);

    if(opts&&opts.stayOnFrame){
      // `form` is still the shot that was just deleted, which is what
      // makes it the right source for where to land.
      setForm({
        ...emptyShot(),
        bowler:form.bowler,
        league:form.league,
        date:form.date,
        lane:form.lane,
        game:form.game,
        frame:form.frame,
        // The tenth is bowled ball by ball, so a deleted ball 2 comes
        // back as ball 2. Everywhere else ballNum is null.
        ballNum:parseInt(form.frame)===10?(form.ballNum||1):null,
        ball:form.ball,
        surface:form.surface,
        startingBoard:form.startingBoard,
        targetArrows:form.targetArrows,
        heelNumber:form.heelNumber,
        soleNumber:form.soleNumber,
      });
    }else{
      setForm(preEditForm||emptyShot());
    }

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
    writeLocal("bowling-ball-lane-lines-v1",uid,null);
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
    writeLocal("bowling-ball-lane-lines-v1",uid,JSON.stringify(newBallLaneLines));
    if(newBowlers.length)setActiveBowler(newBowlers[0]);
  }

  // ── Score helpers ─────────────────────────────────────────────────────────

  // Strict running score: only frames with fully resolved bonus balls

  // seq, when given, additionally requires a shot's sessionSeq to match
  // -- a shot with none predates the idea and reads as session 1. A
  // caller that omits it gets every session of that day, which is what
  // history and season stats want.
  function getGameStrict(bowler,league,date,game,seq=null){
    // String() on BOTH sides of every comparison.
    //
    // s.game===String(game) failed for a shot whose game is the number 1
    // -- 1 === "1" is false. The scoresheet compares String to String
    // and matched, so it drew a full game while this returned nothing:
    // the series summary blank next to a scoresheet showing 211.
    const gs=shots.filter(s=>s.bowler===bowler&&s.league===league
      &&String(s.date)===String(date)&&String(s.game)===String(game)
      &&(seq==null||(Number(s.sessionSeq)||1)===seq));
    // A manually-entered score wins over the shot-derived one. Every score
    // path in the app funnels through here, so overriding at this single
    // point covers live scores, session totals, averages, and stats alike.
    //
    return resolveGameScore(manualScores,bowler,league,date,game,strictPartial(gs),seq??1);
  }

  // The FRAME-derived score only -- no manual override.
  //
  // getGameStrict above deliberately lets a manual entry win, and every
  // total in the app goes through it. But "is this game locked" is a
  // different question from "what did this game score": locking on the
  // resolved value meant typing a single digit produced a manual score,
  // which made the box disabled, which DROPPED FOCUS mid-entry and left
  // the game uneditable forever. One digit in, no way back.
  //
  // So the lock asks this instead: are there frames for this game?
  function getGameFrames(bowler,league,date,game,seq=null){
    const gs=shots.filter(s=>s.bowler===bowler&&s.league===league
      &&String(s.date)===String(date)&&String(s.game)===String(game)
      &&(seq==null||(Number(s.sessionSeq)||1)===seq));
    return strictPartial(gs);
  }

  // seq is derived here, not passed in -- every call site already names
  // the bowler/league/date it means, and deriving it the same way
  // getGameStrict does keeps the two impossible to disagree. Only a real
  // number for practice #2-or-later; undefined (meaning "the plain key")
  // for practice #1 and for every non-practice call.
  function updateManualScore(bowler,league,date,game,value,seqOverride){
    // The live session's number, unless the caller files a specific night
    // (the scorecard import files session 1, as its frames are).
    const seq=Number.isInteger(seqOverride)&&seqOverride>0?seqOverride:currentSessionSeq;
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
    const updated=setManualScoreIn(manualScoresRef.current,bowler,league,date,game,value,seq);
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
      const had=getManualScore(manualScores,bowler,league,date,game,seq);
      const score=getManualScore(updated,bowler,league,date,game,seq);
      if(score===null&&had!==null){
        cloudDelete("manual_scores",{bowler_name:bowler,league_id:leagueId,date,game,session_seq:seq});
      }
      // Nothing to save: a blank box that was already blank. This used to
      // fall through to the write below and upsert an EMPTY row -- the
      // import clears each game's box, so every imported night got three
      // null "typed scores" in the cloud. Equipment still saves through
      // updateGameEquipment, which writes the row itself.
      else if(score===null){ /* nothing */ }
      // Keyed by the natural (user, bowler, league, date, game, session)
      // tuple, so correcting a typed score updates instead of colliding
      // -- and so the SECOND session of a day gets its own row rather
      // than overwriting the first's. The column list has to match
      // manual_scores_slot_key exactly or the upsert has no arbiter.
      else cloudWrite("manual_scores",manualScoreToRow(bowler,leagueId,date,game,score,user?.id||null,
        getGameEquipment(gameEquipmentRef.current,bowler,league,date,game,seq),seq),
        {onConflict:"user_id,bowler_name,league_id,date,game,session_seq"});
    },600);
  }

  // Ball/surface for a games-only practice game. Rides on the same
  // manual_scores row; if there's no score yet the row is created with
  // the equipment and a null score, and the score fills in later.
  function updateGameEquipment(bowler,league,date,game,patch){
    const seq=currentSessionSeq;
    const updated=setGameEquipmentIn(gameEquipmentRef.current,bowler,league,date,game,patch,seq);
    gameEquipmentRef.current=updated;
    setGameEquipment(updated);
    try{window.storage.set(GAME_EQUIPMENT_KEY,JSON.stringify(updated));}catch{}
    const leagueId=leagueIdsRef.current[league];
    if(!leagueId)return;
    const score=getManualScore(manualScoresRef.current,bowler,league,date,game,seq);
    cloudWrite("manual_scores",manualScoreToRow(bowler,leagueId,date,game,score,user?.id||null,
      getGameEquipment(updated,bowler,league,date,game,seq),seq),
      {onConflict:"user_id,bowler_name,league_id,date,game,session_seq"});
  }

  // Game numbers with anything in them for one session: frames or a
  // typed score. At least 1-3, the usual league night.
  function nightGameNumbers(bowler,league,date,seq,shotList=shots,scoreMap=manualScoresRef.current){
    const found=new Set([1,2,3]);
    for(const sh of shotList||[]){
      if(sh&&sh.bowler===bowler&&sh.league===league&&String(sh.date)===String(date)
        &&(Number(sh.sessionSeq)||1)===seq){const g=parseInt(sh.game);if(g>0)found.add(g);}
    }
    const prefix=`${bowler}|${league}|${date}|`;
    for(const k of Object.keys(scoreMap||{})){
      if(!k.startsWith(prefix))continue;
      const[gPart,sPart]=k.slice(prefix.length).split("|");
      if((parseInt(sPart,10)||1)!==seq)continue;
      const g=parseInt(gPart,10);if(g>0)found.add(g);
    }
    return [...found].sort((a,b)=>a-b);
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

    // Tonight's session only (a second practice has its own game 1), and
    // every game bowled -- practice can run past three.
    const seq=currentSessionSeq;
    const games=nightGameNumbers(nightBowler,nightLeague,nightDate,seq);
    const scores=games.map(g=>getGameStrict(nightBowler,nightLeague,nightDate,g,seq));
    const valid=scores.filter(s=>s!=null);
    return valid.length?valid.reduce((a,b)=>a+b,0):null;
  }


  // Delete ONE game: the typed score and the frames behind it.
  //
  // A game can be wrong in two different ways -- a score typed into the
  // wrong box, or a game logged shot by shot that never happened -- and
  // clearing the number only fixed the first. With frames still there
  // the game reappeared from the shots the moment the box was cleared,
  // which reads as the app refusing to forget.
  //
  // Scoped exactly like cancelSession: this bowler, this league, this
  // date, this game number. Games are NOT renumbered afterwards --
  // deleting game 2 of three leaves 1 and 3, because renumbering would
  // silently move game 3's shots onto game 2 and make a bowler's own
  // record disagree with the scoresheet they bowled it on.
  async function deleteGame(game){
    const bowler=nightBowler, league=nightLeague, date=nightDate;
    const g=parseInt(game);
    if(!league||!bowler||!Number.isFinite(g))return;
    const seq=currentSessionSeq;

    const keep=(shots||[]).filter(sh=>!(sh
      &&sh.bowler===bowler&&sh.league===league
      &&String(sh.date)===String(date)&&String(sh.game)===String(g)
      &&(Number(sh.sessionSeq)||1)===seq));
    if(keep.length!==(shots||[]).length)await saveShots(keep);

    if(getManualScore(manualScoresRef.current,bowler,league,date,g,seq)!=null){
      await updateManualScore(bowler,league,date,g,"");
    }

    // If tonight was already filed (Save & Finish, then reopened to fix
    // something), the session row still carries its own copy of every
    // game score. Clearing the live shot and the typed box left that
    // copy untouched, so a deleted game kept appearing in Results --
    // read from the stale filed row the moment the live scores it used
    // to prefer went empty -- and a night's only game, once "deleted",
    // still counted as a saved night for the same reason.
    const existing=sessions.find(s=>s.bowler===bowler&&s.league===league&&String(s.date)===String(date)
      &&(Number(s.sessionSeq)||1)===seq);
    if(existing){
      // Rebuilt from the games that are left, the way fileNight builds
      // it. Removing position g-1 was wrong once any earlier game had
      // been deleted: the list has no game numbers, so the positions had
      // already shifted and the wrong score went (or none did).
      const nightShots=keep.filter(sh=>sh&&sh.bowler===bowler&&sh.league===league
        &&String(sh.date)===String(date)&&(Number(sh.sessionSeq)||1)===seq);
      const scoreMap={...(manualScoresRef.current||{})};
      delete scoreMap[`${bowler}|${league}|${date}|${g}|${seq}`];
      const trimmed=nightGameNumbers(bowler,league,date,seq,nightShots,scoreMap)
        .filter(n=>n!==g)
        .map(n=>resolveGameScore(scoreMap,bowler,league,date,n,
          strictPartial(nightShots.filter(sh=>String(sh.game)===String(n))),seq))
        .filter(v=>v!=null);
      if(!trimmed.length){
        await saveSessions(sessions.filter(s=>s.id!==existing.id));
      }else{
        const ss=nightShots;
        const updated={...existing,scores:trimmed,
          total:trimmed.reduce((a,b)=>a+b,0),
          average:Math.floor(trimmed.reduce((a,b)=>a+b,0)/trimmed.length),
          ...computeSessionStats(ss)};
        await saveSessions(sessions.map(s=>s.id===existing.id?updated:s));
      }
    }
  }

  // Abandon tonight and go home, taking the data with it.
  //
  // League mode holds you until the session is ended, which is right
  // while a night is genuinely in progress -- and wrong when the night
  // is not happening: a wrong league picked, a date typo, a practice
  // logged against a league. Without this the only exits were to end a
  // session that never was (filing a junk night into the averages) or
  // to hunt for the entries and delete them one by one.
  //
  // DESTRUCTIVE, and scoped to THIS bowler at THIS league on THIS date:
  // the shots, the typed game scores, tonight's lane patterns, the match
  // record, the session row if one was written, and the setup choices
  // (league, lane, date, note). A teammate's own scores are left alone.
  //
  // Nothing here is recoverable, so the button asks twice.
  async function cancelSession(){
    const bowler=nightBowler, league=nightLeague, date=nightDate;
    if(!league||!bowler)return;
    // Cancelling cancels the session open right now -- not an earlier
    // one the same day, which cancelSession's plain bowler+league+date
    // filters could not otherwise tell apart from this one.
    const cancelSeq=currentSessionSeq;

    // Shots first. saveShots diffs against the previous list and issues a
    // cloudDelete for every id that disappeared, so this removes them
    // from the cloud as well as the device.
    const keep=(shots||[]).filter(sh=>!(sh
      &&sh.bowler===bowler&&sh.league===league&&String(sh.date)===String(date)
      &&(Number(sh.sessionSeq)||1)===cancelSeq));
    if(keep.length!==(shots||[]).length)await saveShots(keep);

    // Typed scores, through the normal path so each one's cloud row is
    // deleted the same way clearing the box by hand would.
    // Open bowling is one sheet for the whole group, so cancelling it
    // clears every name on the sheet, not just the phone's owner.
    const scoreHolders=preferences.environment==="casual"
      ?[...new Set([bowler,...(scoreOptions||[])].filter(Boolean))]
      :[bowler];
    for(const who of scoreHolders){
      for(let g=1;g<=12;g++){
        if(getManualScore(manualScoresRef.current,who,league,date,g,cancelSeq)!=null){
          await updateManualScore(who,league,date,g,"");
        }
      }
    }

    // Tonight's lane conditions go too.
    //
    // These were left behind the first time, on the reasoning that a
    // pattern is setup rather than scoring. That was wrong: what is
    // recorded here is what THIS session was bowled on, so a cancelled
    // session that still remembers its pattern is a night the app has
    // half-forgotten -- start the league again and yesterday's shot is
    // still sitting in the box.
    //
    // Every lane of the night, including the lane-less "Tonight" record
    // written before a starting lane is known. saveLanePatterns diffs
    // against the previous list and issues a cloudDelete for each id
    // that disappeared, so these leave the cloud as well.
    //
    // The LEAGUE's usual pattern is deliberately untouched: that is a
    // property of the league, not of tonight, and cancelling one night
    // should not make a bowler set their house shot up again.
    const patternsKept=(lanePatterns||[]).filter(lp=>!(lp
      &&lp.league===league&&String(lp.date)===String(date)));
    if(patternsKept.length!==(lanePatterns||[]).length){
      await saveLanePatterns(patternsKept);
    }

    // The night's match record goes too: games won and lost, opponent,
    // handicap. These were kept as "setup, not scoring", so cancelling a
    // night picked against the wrong league left its points behind --
    // start again and last attempt's wins and losses were already filled
    // in. A cancelled night is one that did not happen.
    const matchesKept=(matches||[]).filter(m=>!(m
      &&m.league===league&&String(m.date)===String(date)));
    if(matchesKept.length!==(matches||[]).length){
      await saveMatches(matchesKept);
    }

    // And the session row, if the night was ever ended and resumed.
    // Otherwise its scores stay in every average after the shots are gone.
    const sessionsKept=(sessions||[]).filter(x=>!(x
      &&x.bowler===bowler&&x.league===league&&String(x.date)===String(date)
      &&(Number(x.sessionSeq)||1)===cancelSeq));
    if(sessionsKept.length!==(sessions||[]).length){
      await saveSessions(sessionsKept);
    }

    // This cancelled session is done with too -- the next one opened
    // today is a new one, same as after Save & Finish.
    bumpSessionSeq(bowler,league,date);

    // Back to a clean slate: no league chosen, no lane, today's date, an
    // empty note and frame one -- then home. The league used to stay
    // selected, so the next visit resumed the night that was cancelled.
    setSessionLeague("");
    setStartingLane("");
    setSessionDate(localDateString());
    setSessionNotes("");
    setForm({...emptyShot(),bowler:activeBowler});
    setEditingId(null);
    setSessionSaved(false);
    setSessionSaveMessage("");
    setLeagueTabChoice("setup");
    if(preferences.environment==="casual"){setCasualRound(false);setCasualLeft(true);}
    setView("home");
    try{window.scrollTo({top:0,behavior:"smooth"});}catch{}
  }

  // Open bowling's Save & View Results: files the night quietly and stays
  // on the page. casualRound keeps the simplified nav until End Open
  // Bowling, rather than it switching to six tabs mid-results.
  async function saveCasualResults(){
    setCasualRound(true);
    await fileNight({quiet:true});
  }
  function endCasual(){
    setCasualLeft(true);
    finishNight();
  }

  // History > Sessions: a tapped row opens that night's results.
  //
  // Open bowling goes to its own read-only results screen -- the scoring
  // screen only ever shows the night in progress. Everything else opens
  // the way an imported night does. A tournament night needs its
  // tournament record; without one there is nothing to open, so the row
  // does nothing rather than opening the wrong event.
  function openHistoryNight(s){
    if(!s||!s.date)return;
    const lg=String(s.league||"");
    if(isCasualLeagueName(lg)||lg===CASUAL_SESSION_KEY){
      setPastNightDate(s.date);
      setView("pastNight");
      try{window.scrollTo({top:0});}catch{}
      return;
    }
    if(s.mode==="tournament"||isTournamentLeagueName(lg)){
      // By date OR by name.
      //
      // The date is optional on a block and plenty of events are logged
      // without one, so a date-only lookup found nothing and the row
      // silently did nothing when tapped -- the one outcome worse than
      // opening the wrong thing.
      const wanted=isTournamentLeagueName(lg)?tournamentLeagueEventName(lg):lg;
      const byDate=(tournaments||[]).find(t=>(Array.isArray(t?.days)?t.days:[]).some(d=>d&&d.date===s.date));
      const byName=wanted
        ?(tournaments||[]).find(t=>String(t?.name||"")===String(wanted))
        :null;
      const t=byDate||byName;
      if(t){ openImportedNight({kind:"tournament",league:lg,date:s.date,tournament:t}); return; }
      // Nothing matched: still open the tournament screen on Results
      // rather than swallowing the tap.
      openImportedNight({kind:"tournament",league:lg,date:s.date,tournament:null});
      return;
    }
    openImportedNight({kind:isPracticeLeagueName(lg)?"practice":"league",league:s.league,date:s.date});
  }

  // After an import: switch to the mode the card was imported as and open
  // its Results, for the league/date it was filed under.
  function openImportedNight({kind,league,date,tournament}){
    const env=kind==="tournament"?"tournament":kind==="practice"?"practice":"league";
    if(preferences.environment!==env)updatePreferences(prev=>applyEnvironment(prev,env));
    if(env==="league"){
      setSessionLeague(league);
      setLeagueTabChoice("results");
    }else if(env==="practice"){
      setPracticeMode("results");
    }else{
      // Open THAT tournament. Replacing the card on screen is safe when it
      // is empty, is this same event, or is already saved in history; an
      // unsaved, different event in progress is left alone rather than
      // lost, and the import is still filed under the right event.
      const cur=activeTournament||{};
      const safe=!cur.name||cur.id===tournament?.id||(tournaments||[]).some(t=>t.id===cur.id);
      const loaded=!!(tournament&&safe);
      // Load it even when the ids already match.
      //
      // The old guard skipped the load whenever cur.id===tournament.id,
      // on the assumption that the card in memory IS that event. After a
      // save the card is cleared for the next event but keeps nothing to
      // say so, so opening the event you just filed found an id match
      // against an empty card and loaded nothing: Results with no
      // scores, no recap and no Nightcap. Loading the stored copy is
      // cheap and is the only version that is certainly complete.
      if(loaded)updateTournament(tournament);
      // Why the screen is empty, when it is -- rather than leaving the
      // bowler to guess. Recorded, not shown: it belongs in Diagnostics
      // beside whatever else went wrong that session.
      if(!loaded){
        recordError({
          kind:"state",where:"openTournament",
          message:tournament?"Tournament found but another unsaved event is open":"No saved tournament matched this night",
          detail:`league=${league||""} date=${date||""} current=${cur.name||"(empty)"}`,
        });
      }
      setTournamentTab("results");
      // Back to qualifying: the phase decides which container league the
      // shot form writes to, and reopening a finished event on the
      // stepladder points it at a phase the bowler is not bowling.
      setTournamentPhase("qualifying");
    }
    // keepTournament: this call IS the open. See changeSessionDate.
    if(date)changeSessionDate(date,{keepTournament:env==="tournament"});
    setView("log");
    try{window.scrollTo({top:0});}catch{}
  }

  async function submitSession(){
    if(await fileNight())finishNight();
  }

  // File tonight as a session row. Returns whether it did.
  //
  // Split out of submitSession so a TOURNAMENT save files its block too.
  // Only End Block ever filed one, and End Block has been unreachable in
  // a tournament, so a tournament night never counted as ended: Home
  // stayed the scoring screen all day once a tournament shot was logged,
  // and the Nightcap never saw the night as finished.
  //
  // quiet: say nothing when there is nothing to file (a tournament saved
  // with only its setup filled in is not a mistake).
  async function fileNight({quiet=false}={}){
    // effectiveSessionLeague, not sessionLeague. Practice and casual have
    // no league to pick, so sessionLeague is "" there and this returned
    // immediately -- meaning neither environment could ever end a
    // session or produce a summary, however the button was wired.
    if(!effectiveSessionLeague||!activeBowler)return false;
    // Every game bowled, not the first three.
    //
    // [1,2,3] is a league assumption, and it was silently dropping games
    // four and five from a tournament block or a long practice -- the
    // shots were saved, but the session that summarises them stopped at
    // three, so the series and average were wrong for those nights.
    //
    // gameScores is already sized to the night. Practice passes its own
    // seq, so filing a night only picks up THIS practice's games, not an
    // earlier one bowled the same day.
    const fileSeq=currentSessionSeq;
    const scores=gameScores.map((_,idx)=>idx+1).map(g=>getGameStrict(nightBowler,nightLeague,nightDate,g,fileSeq)).filter(s=>s!=null);
    // A drill-only practice has no games at all -- that is not a failure
    // to file, it is the whole night. Requiring a game here blocked
    // exactly the practices this app exists to track: the ones that are
    // just target work. Only block when there is truly nothing -- no
    // games AND no drill attempts tonight.
    const hasDrillWork=preferences.environment==="practice"
      &&(drills||[]).some(d=>d&&d.bowler===activeBowler&&d.date===sessionDate
        &&(Number(d.made||0)+Number(d.missed||0))>0);
    if(!scores.length&&!hasDrillWork){
      // Nothing is entered right now -- but a session row from EARLIER
      // today (games since deleted one by one, rather than through
      // Cancel Practice) can still be sitting in storage. Leaving it
      // there is how a bowler saw a 256 in Results with every game box
      // empty: the boxes reflect right now, that row does not.
      //
      // Scoped to practice only. A real league night reaching here with
      // an empty box is very likely mid-entry, not abandoned, and
      // deleting an already-filed league session because the boxes are
      // momentarily blank would erase real standings data on a false
      // read.
      const stale=preferences.environment==="practice"
        &&sessions.find(s=>s.bowler===activeBowler&&s.league===effectiveSessionLeague&&s.date===sessionDate
          // THIS practice's row only. Without the session number, saving
          // an empty second practice deleted the first one's filed night.
          &&(Number(s.sessionSeq)||1)===fileSeq);
      if(stale){
        await saveSessions(sessions.filter(s=>s.id!==stale.id));
        return true;
      }
      // Previously silently did nothing here — no feedback at all, even
      // though this is a common, valid state (e.g. only the match points
      // have been entered so far, no shots logged yet for this night).
      // Says so plainly instead of leaving the tap looking like it failed.
      if(!quiet){
        setSessionSaveMessage("No shots logged yet for this night");
        setTimeout(()=>setSessionSaveMessage(null),2000);
      }
      return false;
    }
    // Nothing to file as a session row for a drill-only night -- drills
    // live in their own table, not in sessions -- but the night still
    // ended, so say so.
    if(!scores.length&&hasDrillWork)return true;
    // The row is filed under the EVENT, not the phase.
    //
    // A tournament's phases write their frames to their own container
    // leagues so their game numbers cannot collide. Filing the night's
    // session under whichever phase happened to be selected when Save
    // was tapped produced a session row nothing else looks for -- the
    // recap, the Nightcap and the money all key on the event -- so a
    // tournament saved from the Stepladder tab came back empty.
    //
    // Frames still come from every phase league of this event, because
    // they are all the same night's bowling.
    const fileLeague=nightLeague;
    const ss=shots.filter(s=>s.bowler===activeBowler
      &&(preferences.environment==="tournament"
        ?tournamentBaseLeagueName(s.league)===fileLeague
        :s.league===fileLeague)
      &&s.date===sessionDate
      // This session's frames only: a second practice the same day has
      // its own strike and spare numbers.
      &&(Number(s.sessionSeq)||1)===fileSeq);
    // A session is uniquely identified by bowler+league+date. If one already
    // exists (e.g. a double-tap on Save), update it in place rather than
    // adding a duplicate — a duplicate would silently double-count this
    // night in every average, the leaderboard, and the season record.
    const existing=sessions.find(s=>s.bowler===activeBowler
      &&(preferences.environment==="tournament"
        ?tournamentBaseLeagueName(s.league)===fileLeague
        :s.league===fileLeague)
      &&s.date===sessionDate
      &&(Number(s.sessionSeq)||1)===fileSeq);
    const session={
      id:existing?existing.id:crypto.randomUUID(),bowler:activeBowler,teamId:ss[0]?.teamId||"",league:fileLeague,date:sessionDate,scores,
      sessionSeq:fileSeq,
      notes:sessionNotes||existing?.notes||"",
      total:scores.reduce((a,b)=>a+b,0),
      average:Math.floor(scores.reduce((a,b)=>a+b,0)/scores.length),
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
    return true;
  }

  function finishNight(){
    // This session is DONE -- the next one opened for this bowler, in
    // this league, on this date is a new one, not a continuation.
    // Bumped on finish rather than on start, so a session already open
    // keeps its own bucket instead of splitting mid-way.
    bumpSessionSeq(nightBowler,nightLeague,nightDate);
    // Saved -- now HOME. The button reads "Save League & Return Home".
    //
    // It used to jump to Results and stay there. Results is now where the
    // bowler reviews the night BEFORE saving: the scores, the running
    // averages and "Pour the nightcap" are all there while the night is
    // still open, so saving is the last thing done, and it finishes.
    //
    // Every mode's tab goes back to its start, so the next night opens on
    // Set up rather than on the Results of this one.
    setLeagueTabChoice("setup");
    setTournamentTab("setup");
    setPracticeMode("games");
    setCasualRound(false);
    setSessionSaved(true);
    setView("home");
    try{window.scrollTo({top:0,behavior:"smooth"});}catch{}
    setTimeout(()=>setSessionSaved(false),1500);
  }

  // Updates one game's poker winnings on an already-saved session. Local
  // state updates instantly; the cloud sync is debounced the same way
  // match opponent/handicap and lane pattern fields are, since typing a
  // dollar amount digit-by-digit would otherwise fire a write per
  // keystroke.
  // Poker winnings go through the SAME path as every other per-game money
  // field, rather than keeping a copy of it.
  //
  // This used to map over `sessions` looking for s.id===sessionId. A
  // night with no filed row yet has a DERIVED session, which has no id,
  // so the map matched nothing and the write vanished without a word --
  // type a poker win before the scores are in and the number simply
  // would not stay. setSessionMoneyArray already solved exactly this
  // with ensureSessionRow; poker was the one field still doing it the
  // old way.
  function setPokerWinnings(sessionId,gameIdx,type,amount){
    setSessionMoneyArray(sessionId,type==="quarter"?"pokerQuarter":"pokerDollar",gameIdx,amount);
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
  // The ROW itself, not just its id.
  //
  // setSessions is asynchronous, so the callers below still hold the old
  // `sessions` array in their closure when they run. Handing them only an
  // id left them mapping over a list that did not contain the row yet --
  // the map matched nothing, the amount was dropped, and their own
  // setSessions call then overwrote the row ensureSessionRow had just
  // added. Every buy-in and every winning entered before the night had a
  // session row disappeared exactly this way, which is the normal case
  // for money: pots are paid before the first ball.
  const pendingSessionRowRef=useRef(null);

  // The latest sessions list, synchronously.
  //
  // applyCosts writes three games across four money fields in one loop --
  // a dozen writes, all before React re-renders. Each one read the same
  // stale `sessions` from its own closure and overwrote the one before
  // it, so only the LAST write of the burst survived. That is why a $1
  // quarter buy-in over three games stored nothing: the pots card said
  // "$3.00 paid in" (computed live from the rates) while the winnings
  // card said "$0.00 paid in" (summed from the stored cost arrays), and
  // the night's net was wrong by the whole buy-in.
  //
  // Every money write goes through commitSessions, which composes on the
  // ref rather than on the closure, so a burst accumulates.
  const sessionsRef=useRef(sessions);
  useEffect(()=>{sessionsRef.current=sessions;},[sessions]);

  function commitSessions(fn){
    const prev=sessionsRef.current;
    const next=fn(prev);
    sessionsRef.current=next;
    setSessions(next);
    try{window.storage.set(SESSIONS_KEY,JSON.stringify(next));}catch{}
    return {prev,next};
  }

  // Cleared once the row is really in state, and whenever the night
  // changes. A held id that no longer matches the night on screen would
  // file the next money entry against the wrong session.
  useEffect(()=>{
    const id=pendingSessionIdRef.current;
    if(!id)return;
    const row=sessions.find(s=>s.id===id);
    if(!row||row.bowler!==nightBowler||row.league!==nightLeague||row.date!==nightDate){
      pendingSessionIdRef.current="";
      pendingSessionRowRef.current=null;
    } else if(sessions.some(s=>s.id===id)){
      pendingSessionIdRef.current="";
      pendingSessionRowRef.current=null;
    }
  },[sessions,nightBowler,nightLeague,nightDate]);

  function ensureSessionRow(){
    const existing=sessionsRef.current.find(s=>s.bowler===nightBowler
      &&s.league===nightLeague&&s.date===nightDate
      &&(Number(s.sessionSeq)||1)===currentSessionSeq);
    if(existing)return existing.id;
    if(pendingSessionIdRef.current&&pendingSessionRowRef.current
      &&(Number(pendingSessionRowRef.current.sessionSeq)||1)===currentSessionSeq)return pendingSessionIdRef.current;
    if(!nightBowler||!nightLeague||!nightDate)return "";
    const row={
      id:crypto.randomUUID(),
      bowler:nightBowler,league:nightLeague,date:nightDate,
      // Which session of the day this row belongs to. Without it a row
      // created here reads as session 1, so money entered in the second
      // session of a day would attach to the first.
      sessionSeq:currentSessionSeq,
      scores:[],total:0,average:0,
      pokerQuarter:[0,0,0],pokerDollar:[0,0,0],
      threeSixNineWinnings:0,jackpotWinnings:0,
      highGameWinnings:[0,0,0],
      pokerQuarterCost:[0,0,0],pokerDollarCost:[0,0,0],
      highGameCost:[0,0,0],threeSixNineCost:0,
    };
    pendingSessionIdRef.current=row.id;
    pendingSessionRowRef.current=row;
    commitSessions(prev=>[...prev,row]);
    return row.id;
  }

  // The list to write into: `sessions` when it already holds the row, and
  // `sessions` plus the row ensureSessionRow just made when it does not.
  // Without the second case the write lands nowhere and undoes the row.
  function sessionsIncluding(list,id){
    if(list.some(s=>s.id===id))return list;
    const pending=pendingSessionRowRef.current;
    return (pending&&pending.id===id)?[...list,pending]:[...list];
  }

  function setSessionMoneyArray(sessionId,field,gameIdx,amount){
    const id=sessionId||ensureSessionRow();
    if(!id)return;
    const {prev:prevSessions,next:updatedSessions}=commitSessions(list=>
      sessionsIncluding(list,id).map(s=>{
        if(s.id!==id)return s;
        const arr=[...(s[field]||[0,0,0])];
        arr[gameIdx]=amount;
        return{...s,[field]:arr};
      }));

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
    const {prev:prevSessions,next:updatedSessions}=commitSessions(list=>
      sessionsIncluding(list,ensuredId)
        .map(s=>s.id!==ensuredId?s:{...s,[field]:amount}));

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
    const key=type==="jackpot"?"jackpotWinnings":"threeSixNineWinnings";
    const {prev:prevSessions,next:updatedSessions}=commitSessions(list=>
      sessionsIncluding(list,ensuredId)
        .map(s=>s.id!==ensuredId?s:{...s,[key]:amount}));

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
    // A shared link carries open bowling nights; only that collection
    // can take them in, whatever mode the app is in.
    setBadgeSet("casual");
    setPendingBadgeImport(payload);
  },[]);

  async function askGenie(question){
    const summary=statsSummaryForGenie();
    const{data,error}=await supabase.functions.invoke("bowling-genie",{
      body:{question,context:buildGenieContext(summary),language:aiLanguage()},
    });
    // READ THE BODY on a non-2xx.
    //
    // supabase-js reports every non-2xx as the same opaque "Edge Function
    // returned a non-2xx status code" and puts the actual response on
    // error.context. The function already returns a useful { error }
    // message; without this it is discarded, and a Gemini rejection, a
    // rate limit and a bad model name all read identically.
    // Brooklyn's own voice for "it didn't work". The server's real reason
    // goes to the error log; a bowler never sees plumbing.
    const GENIE_FALLBACK="Brooklyn couldn't answer that right now. Try again in a few minutes.";
    if(error){
      const failure=await readFunctionFailure(error);
      const limited=failure.body?.limited===true;
      recordError({kind:"function",where:"bowling-genie",message:failure.body?.error||failure.message,detail:failureDetail(failure)});
      const detail=friendlyFunctionError(failure,GENIE_FALLBACK).text;
      // The SERVER's limit is the real one; make the display agree.
      //
      // Two counters exist: the client counts answers it received, the
      // server counts requests it was sent. A failed request spends a
      // server question and records nothing on the client, so a day of
      // errors leaves the card saying "3 questions left" while the server
      // says "you've used all three".
      //
      // Believing the server costs a question that was genuinely spent, and
      // is far better than offering three that do not exist.
      if(limited){
        const today=localDateString();
        setGenieAsked(prev=>{
          const mine=prev.filter(a=>a&&a.date===today);
          if(mine.length>=3)return prev;
          return [...prev,...Array(3-mine.length).fill({date:today})];
        });
      }
      return{error:detail};
    }

    if(!data?.text){
      // Not recorded: a failure must not spend a question.
      // RETURN the reason rather than throwing it.
      //
      // Throwing sent this straight to the Genie's catch block, which
      // replaces whatever went wrong with "Couldn't reach Brooklyn. Try
      // again in a moment." So an exhausted Gemini quota, a retired
      // model and a server fault all read as a blip worth retrying --
      // and the one message the code had already worked out was thrown
      // away one line before it could be shown.
      if(data?.error)recordError({kind:"function",where:"bowling-genie",message:String(data.error)});
      return{error:data?.error?friendlyFunctionError({status:500,body:data},GENIE_FALLBACK).text:"Brooklyn had no answer for that."};
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
    const hg=bowlerHighGame(visibleSessions,activeBowler,scratchExcluded);
    const hs=bowlerHighSeries(visibleSessions,activeBowler,scratchExcluded);

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
      const bakerFor=lg=>(tournaments||[]).find(x=>
        tournamentLeagueCloudName(x.name,user?.id)===lg);
      return own.filter(s=>{
        // Through the phase suffix: match play frames belong to the
        // same Baker event as qualifying's.
        const lg=tournamentBaseLeagueName(s.league);
        if(!bakerLeagues.has(lg))return true;
        const t=bakerFor(lg);
        return bakerBowlerFor(s.game,parseInt(s.frame,10),
          t?.bakerStarter||"me",bakerAlternates(t))==="me";
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
      average:scores.length?Math.floor(scores.reduce((a,b)=>a+b,0)/scores.length):null,

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
      // The shots, sliced -- by ball, game, lane of the pair, oil
      // pattern, centre and the rest. What lets her answer a question
      // the Stats screens don't. See domain/genieBreakdowns.js.
      breakdowns:(()=>{
        try{
          const patternByNight=new Map();
          for(const p of (lanePatterns||[]))if(p?.patternName)patternByNight.set(`${p.league}|${p.date}`,p.patternName);
          const tournamentPattern=(lg,date)=>{
            for(const t of (tournaments||[])){
              if(tournamentLeagueCloudName(t?.name,user?.id)!==tournamentBaseLeagueName(lg))continue;
              const d=(Array.isArray(t.days)?t.days:[]).find(x=>x&&x.date===date);
              if(d?.oilPattern)return String(d.oilPattern).trim();
            }
            return null;
          };
          const centerName=lg=>{
            const id=leagueCenters?.[lg];
            return id?((centers||[]).find(c=>c&&c.id===id)?.name||null):null;
          };
          return genieBreakdowns(myShots,{
            isSplit,
            patternFor:(lg,date)=>patternByNight.get(`${lg}|${date}`)
              ||(typeof leaguePatterns?.[lg]==="string"&&leaguePatterns[lg].trim())
              ||tournamentPattern(lg,date)||null,
            centerFor:centerName,
            kindFor:lg=>isPracticeLeagueName(lg)?"practice":isTournamentLeagueName(lg)?"tournament"
              :isCasualLeagueName(lg)?"open bowling":"league",
          });
        }catch{ return []; }
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
      teamGameAvg:(()=>{const v=teamGameTotalAvg(sessions,"");return v?Math.floor(v):null;})(),
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
    // Tournament rows and frames are matched through the phase suffix.
    //
    // The night is the event; its frames are spread across qualifying,
    // match play and the stepladder, and a session row filed from any
    // of those tabs before this was fixed still names a phase. Reading
    // them all back as one night is what makes a saved tournament open
    // with its scores, its recap and its Nightcap intact.
    const sameNight=lg=>preferences.environment==="tournament"
      ?tournamentBaseLeagueName(String(lg||""))===nightLeague
      :lg===nightLeague;

    const saved=[...sessions].reverse().find(s=>s.bowler===nightBowler
      &&sameNight(s.league)&&s.date===nightDate);

    const ss=shots.filter(s=>s&&s.bowler===nightBowler
      &&sameNight(s.league)&&String(s.date)===String(nightDate));

    // NOT gated on having bowled yet.
    //
    // Requiring frames kept Side games blank before the first ball --
    // which is precisely when a bowler ticks the pots they are in and
    // owes the buy-ins. The card has to be there first.
    //
    // A night needs only a bowler, a league and a date to exist. Without
    // those there is no night to describe, and returning null is right.
    if(!nightBowler||!nightLeague||!nightDate)return saved||null;

    const scores=[1,2,3].map(g=>getGameStrict(nightBowler,nightLeague,nightDate,g))
      .filter(v=>v!=null);

    // A stored row keeps its id, its money and its note; the SCORING half
    // is always derived live.
    //
    // Entering a buy-in creates a session row before a ball is thrown --
    // scores:[] and none of the shot stats. Returning that row as-is
    // shadowed the derived night, so the recap read "0 series" and,
    // because tenPinLeaves and weakTens were simply absent, "NaN" 10
    // pins. Overlaying also keeps a filed night honest: its shots and
    // typed scores still exist, so re-deriving reproduces them, and a
    // game deleted afterwards drops out instead of lingering.
    const live={
      scores,
      total:scores.reduce((a,b)=>a+b,0),
      average:scores.length?Math.floor(scores.reduce((a,b)=>a+b,0)/scores.length):0,
      ...computeSessionStats(ss),
    };
    if(saved)return {...saved,...live};

    return {
      // No id: this is NOT a row and must never be saved as one. Anything
      // that writes reads the real session or creates it through
      // endSession.
      id:"",
      bowler:nightBowler,league:nightLeague,date:nightDate,
      pokerQuarter:[0,0,0],pokerDollar:[0,0,0],
      threeSixNineWinnings:0,jackpotWinnings:0,
      highGameWinnings:[0,0,0],
      pokerQuarterCost:[0,0,0],pokerDollarCost:[0,0,0],
      highGameCost:[0,0,0],threeSixNineCost:0,
      inProgress:true,
      ...live,
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
      average:scores.length?Math.floor(scores.reduce((a,b)=>a+b,0)/scores.length):0,
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
  // Which league the free plan follows is worked out over ALL their
  // leagues, and hidden ones are removed afterwards. Doing it over the
  // not-hidden list let hiding stand in for switching: hide the kept
  // league and the pick fell through to the other one, unhide it and it
  // came back -- two leagues on the free plan, one tap each way.
  const leaguePickOpts={entitlement,keptLeagueName,mostRecentLeagueName};
  const visibleLeagueNames=allowedLeagues(leagues||[],leaguePickOpts).filter(n=>notUserHidden.includes(n));
  // What has gone quiet, for the picker. This is empty whenever billing
  // is off or the bowler is subscribed -- allowedLeagues returns
  // everything in both cases -- so it is the whole visibility condition
  // and no separate BILLING_LIVE check is needed at the call site.
  const lockedLeagueNames=lockedLeagues(leagues||[],leaguePickOpts).filter(n=>notUserHidden.includes(n));
  // What the Log screen offers to bowl in: the free plan's league only.
  // It used to offer every league, so a free bowler who logged Tuesday one
  // week and Thursday the next swapped which one was "theirs" each time --
  // two leagues on the free plan, forever.
  const logLeagues=activeLeagues.filter(n=>!lockedLeagueNames.includes(n));
  // The houses this bowler named as home during setup, offered first
  // whenever a league's center is being chosen.
  const myHomeCenters=resolveHomeCenters(profiles?.[displayName]||profiles?.[activeBowler]||null,centers);
  // Applied locally rather than re-read from the server. The picker only
  // calls this after its update came back without an error and with a
  // row, so the value is already known good -- and a round trip here
  // would leave the card on screen, still asking, after the bowler had
  // answered it.
  const onKeptLeagueSaved=name=>{
    const id=leagueIdsRef.current?.[name];
    if(!id)return;
    // Guarded on typeof: prev can be the ENTITLEMENT_UNKNOWN string, and
    // spreading a string would produce {0:"u",1:"n",...} -- an object that
    // is truthy, has no plan, and reads as a locked-out free bowler.
    // null ("asked, they are free") is the usual case for a first pick:
    // set_kept_league has just created their row, so the pick is
    // reflected at once instead of the picker staying up until the next
    // entitlement reload.
    setEntitlement(prev=>(prev&&typeof prev==="object")?{...prev,kept_league_id:id}
      :prev===null?{plan:"free",status:"none",kept_league_id:id}:prev);
  };
  const visibleLeagueKey=visibleLeagueNames.join("\u0001");
  // Memoised: these run over the bowler's whole history, and this
  // component re-renders on every keystroke anywhere inside it.
  // Container leagues are ALWAYS visible, and this is not an exception --
  // it is the rule the league filter already follows, finally applied to
  // the rows as well.
  //
  // Containers are deliberately kept OUT of the leagues list so that
  // "Practice" doesn't sit in the Team tab beside real leagues
  // (isContainerLeague says so in as many words). visibleLeagueNames is
  // built from that list, so `ok` can never contain one -- and this
  // filter admitted a shot only if its league was in `ok`.
  //
  // The result: every practice, casual and tournament shot was dropped
  // from every view fed by visibleShots. The shots saved correctly and
  // scored correctly -- maxScoreThisGame reads the raw list and always
  // showed a number for them -- they simply never came back out. The
  // scoresheet stayed blank and tapping a frame did nothing, because
  // there was no shot behind it to open.
  //
  // allowedLeagues already gets this right: it partitions containers out
  // and returns them unconditionally, paywall or not. The two filters
  // disagreed, and this is the one that was wrong.
  const visibleShots=useMemo(()=>{
    const ok=new Set(visibleLeagueNames);
    return shots.filter(s=>!s||!s.league||ok.has(s.league)||isContainerLeague(s.league));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[shots,visibleLeagueKey]);
  const visibleSessions=useMemo(()=>{
    const ok=new Set(visibleLeagueNames);
    return sessions.filter(s=>!s||!s.league||ok.has(s.league)||isContainerLeague(s.league));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[sessions,visibleLeagueKey]);

  // Stats count teammates' imported scorecard columns too -- pending ones
  // included, which is the rule (see domain/teamImports.js). A captain
  // scoring for a roster that hasn't signed up yet otherwise has team
  // cards with one bowler on them. Stats only: these are never saved, and
  // History, the calendar and Journey stay this account's own.
  const teamImports=useMemo(()=>teammateImportRows(importedScores,{shots,sessions}),[importedScores,shots,sessions]);
  const statsPoolShots=useMemo(()=>teamImports.shots.length?[...shots,...teamImports.shots]:shots,[shots,teamImports]);
  const statsVisibleShots=useMemo(()=>{
    if(!teamImports.shots.length)return visibleShots;
    const ok=new Set(visibleLeagueNames);
    return [...visibleShots,...teamImports.shots.filter(s=>ok.has(s.league))];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[visibleShots,teamImports,visibleLeagueKey]);
  const statsVisibleSessions=useMemo(()=>{
    if(!teamImports.sessions.length)return visibleSessions;
    const ok=new Set(visibleLeagueNames);
    return [...visibleSessions,...teamImports.sessions.filter(s=>ok.has(s.league))];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[visibleSessions,teamImports,visibleLeagueKey]);

  const leaguesWithCenters=leagues.map(name=>({name,centerId:leagueCenters[name]}));
  const centerStats=statsByCenter(sessions,leaguesWithCenters,centers,statsBowler||activeBowler,shots);

  // ── The end of the 60-day Pro trial ─────────────────────────────────
  //
  // "ended": the trial is over, nothing paid replaced it, and they have
  // not yet chosen -- the ask sits at the top of Home until they do.
  // "ending": the last seven days, a heads-up they can put off for the
  // day. Neither ever shows to a subscriber or a test account.
  const proChoiceKey="pro-trial-choice-v1";
  const[proChoice,setProChoice]=useState(()=>{try{return readLocal(proChoiceKey,uid)||"";}catch{return "";}});
  const[proLaterDay,setProLaterDay]=useState(()=>{try{return readLocal("pro-trial-later-v1",uid)||"";}catch{return "";}});
  // Re-read once the account is known: the first render has no uid.
  useEffect(()=>{
    try{setProChoice(readLocal(proChoiceKey,uid)||"");setProLaterDay(readLocal("pro-trial-later-v1",uid)||"");}catch{}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[uid]);
  const proEnded=proTrialEnded(entitlement)&&proChoice!=="basic";
  const proDaysLeft=!hasPaidSubscription(entitlement)&&!isTestAccount(entitlement)&&onProTrial(entitlement)?proTrialDaysLeft(entitlement):0;
  const proEnding=proDaysLeft>0&&proDaysLeft<=7&&proLaterDay!==localDateString();
  const proPromptCtx=useMemo(()=>{
    if(!proEnded&&!proEnding)return null;
    const me=displayName||activeBowler;
    const mySessions=sessions.filter(x=>x&&x.bowler===me);
    const perBall={};
    for(const g of gamesByBall(mySessions,shots,gameEquipment,me))perBall[g.ball]=(perBall[g.ball]||0)+1;
    const top=Object.entries(perBall).sort((a,b)=>b[1]-a[1])[0];
    const firstBalls={};
    for(const x of shots){
      if(!x||x.bowler!==me||!x.ball)continue;
      if(x.ballNum&&Number(x.ballNum)!==1)continue;
      firstBalls[x.ball]=(firstBalls[x.ball]||0)+1;
    }
    const mates=new Set((teamRosters||[]).flatMap(r=>[...r.members.map(m=>m.name),...r.pending.map(p=>p.name)]));
    return{
      topBall:top?{ball:top[0],games:top[1]}:null,
      games:mySessions.reduce((n,x)=>n+(Array.isArray(x.scores)?x.scores.filter(v=>Number.isFinite(Number(v))).length:0),0),
      ctx:{
        leagues:leagues||[],
        teams:(teams||[]).length,
        bags:(bags||[]).filter(b=>b&&(!b.bowlerName||b.bowlerName===me)),
        ballFirstBalls:firstBalls,
        teammates:mates.size,
        friends:(friends||[]).length,
        centers:(centerStats||[]).length,
        seasons:0,
        sidePots:(tournaments||[]).filter(t=>t&&Array.isArray(t.sidePots)&&t.sidePots.length>0).length,
        coaching:(coachingRels||[]).length>0,
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[proEnded,proEnding,sessions,shots,gameEquipment,leagues,teams,bags,teamRosters,friends,tournaments,coachingRels,displayName,activeBowler]);
  function chooseBasic(){
    try{writeLocal(proChoiceKey,uid,"basic");}catch{}
    setProChoice("basic");
  }
  function proLater(){
    const d=localDateString();
    try{writeLocal("pro-trial-later-v1",uid,d);}catch{}
    setProLaterDay(d);
  }
  // Computed HERE, beside centerStats, and for the same reason.
  //
  // StatsView called statsByRackType itself and handed it `allLeagues`,
  // which is a list of league NAMES. That function reads l.centerId off
  // each entry to find the centre, and a string has no centerId -- so
  // centerByLeague came out empty, every session and shot was skipped,
  // and the free-fall-versus-string card returned nothing. With no data
  // and no error, it looked exactly like "you have not bowled enough
  // yet".
  //
  // leaguesWithCenters is the shape it actually wants, and it only
  // exists at this level, which is why centerStats was already computed
  // here rather than in the view.
  const rackTypeStats=statsByRackType(sessions,shots,leaguesWithCenters,centers,statsBowler||activeBowler);
  // The rest of the Free Fall vs String card -- spares, splits, leaves and
  // strike shapes -- off the same league -> centre -> rack type lookup.
  const rackTypeDetailStats=rackTypeDetail(shots,leaguesWithCenters,centers,statsBowler||activeBowler,
    leftHandedForBowler(statsBowler||activeBowler));

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
  // "" (not tried), "running", "merged" (reloading) or "local" (the
  // server couldn't; merge on this phone instead).
  const serverMergeRef=useRef("");
  const[serverMergeTick,setServerMergeTick]=useState(0);
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
      // On the server, when it can: merge_bowlers moves every row of the
      // handle's history onto you in one step, numbers any night you both
      // have so neither overwrites the other, and keeps the handle as an
      // alias. Then this phone reloads. The local merge below is only for
      // a database that doesn't have merge_bowlers yet.
      // Anything but a real server merge (offline, no such bowler there,
      // an older database) falls through to the local merge, once.
      if(serverMergeRef.current!=="local"){
        if(serverMergeRef.current)return; // running, or merged and reloading
        serverMergeRef.current="running";
        const bump=()=>setServerMergeTick(t=>t+1);
        supabase.rpc("merge_bowlers",{p_from_name:handleFromEmail(email),p_into_name:displayName})
          .then(({data,error})=>{
            if(!error&&data&&data.merged){
              serverMergeRef.current="merged";
              window.dispatchEvent(new CustomEvent("mbj:bowler-renamed",{detail:{from:handleFromEmail(email),to:displayName}}));
              return;
            }
            serverMergeRef.current="local";bump();
          })
          .catch(()=>{serverMergeRef.current="local";bump();});
        return;
      }
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
  },[displayName,bowlers.length,user?.email,shots.length,sessions.length,tournaments.length,drills.length,bags.length,serverMergeTick]);

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
      writeLocal(SESSION_CONTEXT_KEY,uid,JSON.stringify({
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
      highGame:bowlerHighGame(sessions,who,scratchExcluded)?.value??null,
      highSeries:bowlerHighSeries(sessions,who,scratchExcluded)?.value??null,
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
      const fresh=insightSignature.split(",").filter(k=>k&&!before.has(k)&&isAnnouncedStat(k)).map(statLabel);
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
    // What the bowler reads is decided in domain/functionErrors.js; what
    // actually went wrong goes to the local error log (Settings >
    // Diagnostics). This used to print supabase-js's "Edge Function
    // returned a non-2xx status code" straight onto the Improve tab.
    const FALLBACK="Couldn't get your insights right now. Try again in a few minutes.";
    try{
      const{data,error}=await supabase.functions.invoke("analyze-performance",{body:{payload,language:aiLanguage()}});
      if(error){
        const failure=await readFunctionFailure(error);
        recordError({kind:"function",where:"analyze-performance",message:failure.body?.error||failure.message,detail:failureDetail(failure)});
        const{text,kind}=friendlyFunctionError(failure,FALLBACK);
        return{error:text,upgrade:kind==="upgrade"};
      }
      if(data?.error){
        recordError({kind:"function",where:"analyze-performance",message:String(data.error)});
        return{error:friendlyFunctionError({status:500,body:data},FALLBACK).text};
      }
      return data;
    }catch(e){
      recordError({kind:"function",where:"analyze-performance",message:String(e?.message||e)});
      return{error:FALLBACK};
    }
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
  // History, Stats, Improve, Gear and Team are all built on shot data,
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
    // Reached from the Settings upgrade card, so Settings is the parent
    // -- the tree, not history, exactly as badges->journey is the tab
    // the link lives on rather than wherever you happened to come from.
    subscribe:"settings",
    // Opened from the Balls and Bags tabs of Setup.
    arsenal:"locker",
  };
  const parentView=PARENT_VIEW[view]||null;

  // Android's back gesture follows the same tree as the arrow above.
  // A ref so the one listener always sees the current screen.
  const backRef=useRef(null);
  backRef.current=({exit})=>{
    const act=backAction({activeTour,view,parentView});
    if(act.type==="closeTour")finishTour();
    else if(act.type==="view")setView(act.view);
    else exit();
  };
  useEffect(()=>listenForBack(()=>backRef.current),[]);

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
  const competitiveBadgeHist=(()=>{
    try{
      return allCompetitiveBadges({
        sessions,shots,matches,drills,teams,leagueDates,
        bowler:activeBowler,
      })||{};
    }catch{ return {}; }
  })();
  const earnedBadgeCount=Object.values(competitiveBadgeHist).filter(r=>r&&r.count).length;

  // The badges one night earned, for its share card. Only the active
  // bowler's -- the history is theirs -- and open bowling has its own
  // pool. Worked out when a share button renders, from the same history
  // the Badges screen uses, so the two can never disagree.
  function badgesEarnedOnNight(date,env){
    try{
      if(env==="casual"){
        const hist=casualBadgeHistory(activeBowler,casualNightsFrom(manualScores,CASUAL_SESSION_KEY));
        return badgesEarnedOn(hist,CASUAL_BADGES,date);
      }
      return badgesEarnedOn(competitiveBadgeHist,COMPETITIVE_BADGES,date);
    }catch{ return []; }
  }

  // Keyed on having ENDED the night in this visit, not on a session
  // existing for today. "A session exists" stayed true for the rest of the
  // day, so a second round of open bowling after the first was filed got
  // the full six-tab nav from its first frame -- the simplified view
  // appeared not to work at all. Picking Open bowling on Home sets
  // casualRound, so each new round starts simplified; saving the round
  // clears it, so ending still unlocks the full nav as intended above.
  const casualMode=preferences.environment==="casual"&&!casualLeft&&(casualRound||!nightEnded);
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
    // Setup: balls, bags, leagues and team in one tab. Gear and Team
    // were two tabs for one job -- getting ready to bowl -- and merging
    // them takes the bar from six tabs to five.
    {id:"locker",  label:"Setup",   icon:"🧰"}, // internal id stays "locker" -- plumbing, not shown
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
    teamRequests,
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
    const iconViews=["profile","settings","inbox","social","coaching","import","help","arsenal",
      // badges too: a shared badge link opens it directly, and a link
      // that lands on Home is a broken link.
      "journey","data","log","badges",
      // subscribe: reached from the Settings upgrade card, not a nav tab.
      "subscribe"];
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

  // Locked bags (past the free plan's one-per-type) are not offered when
  // logging. Same ordering rule as BagManager, via lockedBagIds.
  const allBowlerBags=bags.filter(b=>b.bowlerName===activeBowler);
  const lockedBags=lockedBagIds(allBowlerBags,bagLimit(entitlement));
  const bowlerBags=allBowlerBags.filter(b=>!lockedBags.has(b.id));
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
  // effectiveLeftHanded, not resolveHandedness.
  //
  // A backup ball mirrors the shot, so a right-hander throwing one plays
  // the left side of the lane and their corner pin is the 7. Everything
  // downstream of here reasons about sides -- corner pins, splits, the
  // lane drawing -- and wants the hand the BALL behaves like. The hand
  // the bowler calls themselves is read straight off the profile, in the
  // one place that asks the question: their profile chip.
  const activeBowlerLeftHanded=effectiveLeftHanded(profiles[activeBowler],rosterLeftHanded);

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
    // A shot with no sessionSeq predates this concept and reads as
    // session 1, same as an explicit 1. A DIFFERENT number is a shot
    // from another session the same day and belongs to that one.
    for(const sh of shots||[]){
      if(sh&&sh.bowler===activeBowler&&sh.league===league&&sh.date===sessionDate
        &&(Number(sh.sessionSeq)||1)===currentSessionSeq){
        const n=parseInt(sh.game);
        if(Number.isFinite(n)&&n>highest)highest=n;
      }
    }
    // From game 2, not 4: the loop assumed the three-game floor, so in
    // practice (floor of one) typed or imported games 2 and 3 were left
    // out -- an imported 201/188/222 practice summarised as one 201.
    for(let n=2;n<=12;n++){
      if(getGameStrict(nightBowler,nightLeague,nightDate,n,currentSessionSeq)!=null)highest=Math.max(highest,n);
    }
    highest=Math.min(12,highest);
    return Array.from({length:highest},(_,i)=>
      getGameStrict(nightBowler,nightLeague,nightDate,i+1,currentSessionSeq));
  })();

  // Same length as gameScores, frames only. Passed to LogView so the
  // score boxes can tell "this game was bowled shot by shot" apart from
  // "this game has a number in it".
  const frameScores=gameScores.map((_,i)=>
    getGameFrames(nightBowler,nightLeague,nightDate,i+1));

  const sessionTotal=getSessionTotal();

  // Corner pin depends on which hand THREW the shot, and a "Stats" view
  // can legitimately blend several bowlers (statsBowler === "" is
  // Team/combined; a team-compare view is a whole roster). A single
  // leftHanded flag would silently apply one person's hand to everyone
  // else's shots, so this resolves it per bowler and the corner-pin
  // filters below call it per shot.
  function leftHandedForBowler(name){
    const rosterLeftHanded=!!teams.find(t=>t.memberHandedness&&name in t.memberHandedness)?.memberHandedness?.[name];
    return effectiveLeftHanded(profiles[name],rosterLeftHanded);
  }

  // ── Stats ─────────────────────────────────────────────────────────────────
  // statsBowler === "" means Team/combined (everyone's shots together)
  const statsShots=statsPoolShots.filter(s=>(statsBowler?s.bowler===statsBowler:true)&&(statsLeague?s.league===statsLeague:true));
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
  // Over strike CHANCES, not every row: a 10th-frame spare attempt is
  // not a chance to strike. Same count as Trends and the Nightcap.
  const stkR=strikeRateOf(statsShots)??0;
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
  const goalHighGame=bowlerHighGame(sessions,goalBowler,scratchExcluded);
  const goalHighSeries=bowlerHighSeries(sessions,goalBowler,scratchExcluded);
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
    highGame:bowlerHighGame(sessions,activeBowler,scratchExcluded)?.value??null,
    highSeries:bowlerHighSeries(sessions,activeBowler,scratchExcluded)?.value??null,
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
  const compareSessions=compareFriendId?(friendSessions[compareFriendId]||[]):[...sessions,...teamImports.sessions];

  // A friend's shots live in the cloud under THEIR user_id, fetched
  // separately into friendShots -- never merged into this account's own
  // `shots` array, so there is no path by which a friend's data can leak
  // into this account's own primary stats. Only compareShots, which
  // feeds the comparison-only team* metrics below, ever reads it.
  const compareShots=compareFriendId
  ?(friendShots[compareFriendId]||[])
  :compareBowler
    ?statsPoolShots.filter(s=>s.bowler===compareBowler)
    :compareLeague
      ?statsPoolShots.filter(s=>s.league===compareLeague)
      :shots; // unused when showTeamCompare is false
  const teamTot=compareShots.length;
  const teamStkR=strikeRateOf(compareShots)??0;
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

  /* RAW, deliberately: these are the signed-in coach's OWN sessions,
     and coaching is a paid feature -- anyone who can reach this screen is
     a subscriber, so there is nothing of theirs to hide from them. Built
     once and shown in two places: its own screen (reached from Settings
     and links) and the Coach tab on Improve. */
  const coachingPanel=(
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
      onCreateCode={createCoachingCode}
      onClearCode={clearCoachingCode}
      onClaimCode={claimCoachingCode}
      inviteCode={coachInviteCode}
      codeError={coachCodeError}
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
  );

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
            {/* The app name gets its own sizing, because it is the only
                header title long enough to wrap.

                Every other title here is one short word -- Stats, Badges,
                Journey -- and 18px is right for those. "🎳 My Bowling
                Journey" is twenty-one characters, and on a narrow phone it
                wrapped to a second line and made the whole sticky header a
                row taller. That cost a row of the scoresheet on every
                screen, all day, to avoid truncating a name the bowler
                already knows.

                clamp() sizes it off the viewport rather than a breakpoint:
                18px where there is room, down to 14px on a small phone,
                and nothing in between needs a media query.

                nowrap is what actually guarantees one row; the ellipsis is
                the escape valve for the worst case, which is a 320px
                screen with both the sync and inbox buttons showing. If
                that truncation ever shows up in practice, dropping the 🎳
                buys back about 26px and is a one-line change. */}
            {/* Journey is opened from Home and belongs to it, so it carries
                the app name and logo too rather than a blank title. */}
            {(view==="home"||view==="log"||view==="journey")
              ? <div style={{display:"flex",alignItems:"center",gap:"9px",minWidth:0}}>
                  <img src={appLogo} alt="" aria-hidden="true" className="mbj-app-logo" style={{width:"32px",height:"32px",borderRadius:"9px",objectFit:"cover",flexShrink:0,boxShadow:`0 5px 14px ${C.bg}30`}} />
                  <div style={{...S.title,fontSize:"clamp(13px, 3.9vw, 19px)",letterSpacing:"-0.02em",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",minWidth:0}}>{APP_NAME}</div>
                </div>
              : <div data-i18n="title" style={S.title}>{navTabs.find(t=>t.id===view)?.label
                  ||(view==="settings"?"Settings":view==="profile"?"Profile"
                    :view==="inbox"?"Inbox":view==="coaching"?"Coach"
                    :view==="help"?"Help":view==="pastNight"?"Results":view==="social"?(casualMode?"Standings":"Friends"):view==="import"?"Import scorecard"
                    :view==="subscribe"?"My Bowling Journey Pro":view==="arsenal"?"Arsenal":"")}</div>}
          </div>

          <div style={{display:"flex",gap:"7px",flexShrink:0,alignItems:"center"}}>
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
            {/* Pro, for anyone who does not have it: one tap to the
                Subscribe screen from anywhere. Hidden while the
                entitlement is still loading (so a subscriber never sees
                it flash), for subscribers and test accounts, and on the
                Subscribe screen itself. */}
            {entitlement!==ENTITLEMENT_UNKNOWN&&!featureUnlocked(entitlement)&&view!=="subscribe"&&(
              <button onClick={()=>setView("subscribe")}
                style={{background:C.accent,border:`1px solid ${C.accent}`,cursor:"pointer",
                  fontSize:"12px",fontWeight:800,color:C.onAccent||"#fff",height:"34px",
                  padding:"0 10px",borderRadius:"10px",lineHeight:1,letterSpacing:"0.02em",
                  boxShadow:`0 4px 12px ${C.accent}33`,whiteSpace:"nowrap"}}
                aria-label="Get Pro">
                Pro
              </button>
            )}
            {!casualMode&&<button onClick={()=>setView("import")}
              style={{background:C.surface,border:`1px solid ${C.border}`,cursor:"pointer",
                fontSize:"12px",fontWeight:700,color:C.text,height:"34px",
                padding:"0 9px",borderRadius:"10px",lineHeight:1,boxShadow:`0 4px 12px ${C.bg}22`,
                display:"flex",alignItems:"center",gap:"4px",whiteSpace:"nowrap"}}
              aria-label="Import scorecard">
              <span style={{fontSize:"13px"}}>📷</span>
              <span className="mbj-import-word">Import</span>
            </button>}
            {/* Search, Profile and Settings, folded into one menu. Search
                stays reachable in open bowling -- it is the way back for
                someone who picked that mode by accident. */}
            <HeaderMenu
              onSearch={q=>{setHelpQuery(q);setView("help");}}
              onOpenProfile={()=>setView("profile")}
              onOpenSettings={()=>setView("settings")}/>
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
      {/* zIndex 300, ABOVE everything else on the screen.
        
          It was 60, which is under the nav bar (100) and under Brooklyn's
          bubble and the tour (199-200) -- so the one screen whose whole
          job is to be "the only thing on it" rendered with the nav and
          the bubble sitting on top of it. Worse, a nav bar painted above
          a full-screen overlay is still TAPPABLE: tapping a tab changed
          the view underneath while showWelcome stayed true, so the
          "You're all set" message followed the bowler around the app
          with no way to dismiss it except the tour buttons it was
          covering.
        
          Raising the layer fixes both halves at once -- nothing above it
          to see, and nothing above it to tap. If another overlay is ever
          added, this is the one that has to stay on top: it is the only
          screen shown before the app is usable. */}
      {showWelcome&&onboarded&&!activeTour&&(
        <div style={{position:"fixed",inset:0,zIndex:300,background:C.bg,
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

      <div className={`mbj-app-content mbj-view-${view}`} style={S.content}>
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
        <TrialBanner
          entitlement={entitlement}
          onManage={()=>setView("subscribe")}
          onSwitchAnnual={()=>setView("subscribe")} />

        {view==="insights"&&(<>
          {/* Three tabs rather than one long page: AI (Brooklyn and
              Insights), Goals (goals and drills), Coach (the coaching
              screen). The Coach tab is always there, so a bowler with no
              coach yet can find where connecting starts. */}
          <TabBar label="Improve" value={improveTab} onChange={setImproveTab}
            tabs={[
              {id:"ai",label:"AI"},
              {id:"goals",label:"Goals"},
              {id:"coach",label:coachViewOn&&unreadResponseCount>0?`Coach · ${unreadResponseCount}`:"Coach"},
            ]}/>

          {improveTab==="ai"&&(<>
            {/* Insights first, then Brooklyn: read what the app found,
                then ask about what it didn't cover. */}
            <InsightsView stats={insightStats} onAnalyze={analyzePerformance} bowlerName={statsBowler||activeBowler}
              newlyAvailable={newInsights} onDismissNew={()=>setNewInsights([])}
              hasCoach={insightCoaches.length>0}
              coachName={insightCoaches.map(c=>c.displayName).join(" and ")}/>
            {/* Ask Brooklyn. Hidden until something is logged -- with no
                data every answer is "you haven't logged anything yet" --
                and never in open bowling, which logs scores and nothing
                else. */}
            {onboarded&&hasAnythingLogged&&!casualMode&&(
              <div style={{marginTop:"12px"}}>
                <AskBrooklyn leftHanded={!!preferences.leftHanded} asked={genieAsked} today={localDateString()} onAsk={askGenie}/>
              </div>
            )}
          </>)}

          {improveTab==="goals"&&(<>
            {/* Shown even with no goals set: the only way to create a
                first goal is the "+ Add a goal" button inside the panel.
                GoalsPanel handles the empty case itself. */}
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
          </>)}

          {improveTab==="coach"&&coachingPanel}
        </>)}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* SOCIAL VIEW — Teams + Friends share one nav slot                  */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* Friends only. Teams moved to the Team tab, beside the Leagues editor,
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
        {view==="badges"&&(
          <div style={{...S.chips,marginBottom:"10px"}}>
            {[["competitive","Competitive"],["casual","Open bowling"]].map(([id,label])=>(
              <Chip key={id} label={label}
                selected={(badgeSet||(casualMode?"casual":"competitive"))===id}
                onToggle={()=>setBadgeSet(id)}/>
            ))}
          </div>
        )}
        {view==="badges"&&((badgeSet||(casualMode?"casual":"competitive"))==="casual"?(
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
            {/* Team requests and invites, answerable right here. */}
            {teamRequests.filter(r=>r&&r.mine_to_answer).map(r=>(
              <div key={r.id} style={{...S.card,border:`1px solid ${C.accent}55`}}>
                <div style={{fontSize:"14px",fontWeight:600,color:C.text,marginBottom:"2px"}}>
                  {r.kind==="invite"?`Invitation to join ${r.team_name||"a team"}`:`${r.bowler_name||"A bowler"} wants to join ${r.team_name||"your team"}`}
                </div>
                <div style={{fontSize:"12px",color:C.textMuted,marginBottom:"10px"}}>
                  {r.league_name?`${r.league_name} · `:""}
                  {r.kind==="invite"
                    ?(r.current_team?`Joining takes you off ${r.current_team}.`:"Joining lets teammates see your scores and yours theirs.")
                    :(r.current_team?`Approving moves them off ${r.current_team}.`:"Anyone on the team can answer.")}
                </div>
                <div style={{display:"flex",gap:"8px"}}>
                  <button style={{...S.btn("primary"),flex:1}} disabled={teamRequestBusy===r.id}
                    onClick={()=>answerTeamRequest(r,true)}>{r.kind==="invite"?"Join":"Approve"}</button>
                  <button style={{...S.btn(),flex:1}} disabled={teamRequestBusy===r.id}
                    onClick={()=>answerTeamRequest(r,false)}>{r.kind==="invite"?"No thanks":"Decline"}</button>
                </div>
              </div>
            ))}
            <InboxList items={myInboxItems.filter(i=>i.type!=="teamJoin")} onOpen={item=>{
              // A task set BY a coach is homework for the bowler, so open
              // the Coach tab on the bowling side rather than dropping
              // them into coach view looking at their own bowlers.
              if(item.type==="coachTask")updatePreferences(prev=>setCoachView(prev,false));
              // Team requests are answered on Setup > Team.
              if(item.view==="team"){setSetupTab("team");setView("locker");return;}
              setView(item.view);
            }}/>
            <ImportedScoresInbox

              records={importedScores}

              // The ACCOUNT's name, as the header count uses. Scoped to the
              // active bowler, a night sent to "Ryan Everett" while "Ryan"
              // was selected counted in the badge and showed nothing here.
              bowler={displayName||activeBowler}

              // This bowler's own scores, so the card can say where the
              // photo disagrees with what they typed. Manual entry still
              // wins by default -- this only makes the disagreement
              // visible instead of resolving it in silence.
              myScores={(() => {
                const out = {};
                for (const x of sessions) {
                  if (!x || x.bowler !== (displayName||activeBowler) || !Array.isArray(x.scores)) continue;
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

        {view==="locker"&&(
          <TabBar label="Setup" value={setupTab} onChange={setSetupTab}
            tabs={[{id:"balls",label:"Balls"},{id:"bags",label:"Bags"},{id:"league",label:"League"},{id:"team",label:"Team"}]}/>
        )}

        {(view==="profile"||(view==="locker"&&(setupTab==="balls"||setupTab==="bags")))&&(
          <Profile
            ballStats={bStats}
            only={view==="locker"
              ?[setupTab==="bags"?"bags":"arsenal"]
              :["identity","aliases","coaching","bookAverage","homeCenters","notes"]}
            bowlers={bowlers} activeBowler={activeBowler} selectBowler={selectBowler}
            profiles={profiles} setProfile={setProfile} teams={teams}
            arsenals={arsenals} ballLayouts={ballLayouts} setBallLayout={setBallLayout} removeBall={removeBall}
            newBallName={newBallName} ballAddMessage={ballAddMessage} retiredBalls={retiredBalls} setBallRetired={setBallRetired} setNewBallName={setNewBallName} addBall={addBall}
            bags={bags} ballBags={ballBags} saveBag={saveBag} deleteBag={deleteBag} toggleBallBag={toggleBallBag} entitlement={entitlement}
            centers={centers} ensureCenter={ensureCenter} searchCenters={searchCenters}
            ballSpecs={ballSpecs} setBallSpec={setBallSpec} ballGroups={ballGroups}
            saveBallGroup={saveBallGroup} deleteBallGroup={deleteBallGroup} seedDefaultGroups={seedDefaultGroups}
            catalogEntries={catalogEntries} catalogAck={catalogAck} userId={user?.id} publishBallSpecs={publishBallSpecs} voteOnEntry={voteOnEntry} acknowledgeRejection={acknowledgeRejection}
            bookAverageDue={bookAverageCheck.needed} bookAverageTriggerLeague={bookAverageCheck.league} bookAverageSuggestion={bookAverageSuggestion} acknowledgeBookAverageUpdate={acknowledgeBookAverageUpdate}
            onOpenArsenalAnalysis={()=>setView("arsenal")}/>
        )}

        {view==="arsenal"&&(()=>{
          const who=displayName||activeBowler;
          const prof=normalizeProfile(profiles[who],who);
          return(
            <Suspense fallback={null}>
              <ArsenalAnalysis bowler={who} balls={arsenals[who]||[]} retired={retiredBalls[who]||{}}
                ballSpecs={ballSpecs} ballLayouts={ballLayouts} bags={bags} ballBags={ballBags}
                shots={visibleShots} sessions={visibleSessions} gameEquipment={gameEquipment}
                catalogEntries={catalogEntries} entitlement={entitlement}
                leftHanded={leftHandedForBowler(who)} twoHanded={!!prof.twoHanded}
                onUpgrade={()=>setView("subscribe")}/>
            </Suspense>
          );
        })()}

        {/* The Team tab also renders the Leagues editor -- where you bowl belongs
            with your equipment, not buried in app settings. Same Settings
            component in a card-filtered mode, so there is still exactly
            one Leagues editor rather than two that can drift. */}
        {/* Friends moved to Stats, beside Compare To.
      
            It was in the Team tab, alongside leagues and equipment -- but a
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
        {view==="locker"&&setupTab==="league"&&lockedLeagueNames.length>0&&(
          <KeptLeaguePicker
            onUpgrade={()=>setView("subscribe")}
            leagues={notUserHidden}
            keptLeagueName={keptLeagueName}
            defaultLeagueName={mostRecentLeagueName}
            leagueIds={leagueIdsRef.current||{}}
            userId={user?.id||""}
            onSaved={onKeptLeagueSaved} />
        )}

        {view==="locker"&&setupTab==="league"&&(
          /* RAW shots and sessions below, deliberately.
             
             Backup & Restore lives on this screen. An export that quietly
             omitted a league the bowler has stopped paying to SEE would be
             withholding their own data -- a data-rights problem, and the
             fastest route to a one-star review. hasData is raw for the
             same reason: "is there anything to clear" is about everything
             they have, not what the plan happens to show. */
          <Settings
            mode="leagues"
            onCreateTeam={createTeamForLeague} onAddLeague={addLeague} findLeagueMatches={findLeagueMatches} onJoinLeague={joinExistingLeague} onMergeLeague={mergeLeague} fetchLeagueTeams={fetchLeagueTeams} onAskToJoinTeam={askToJoinTeam}
            restartOnboarding={restartOnboarding} replayTour={replayTour} isCoach={showCoachingTab}
            showBackup={showBackup} setShowBackup={setShowBackup}
            backupStatus={backupStatus} setBackupStatus={setBackupStatus}
            forceResync={forceResync} resyncBusy={resyncBusy} resyncError={resyncError}
            pendingSyncCount={pendingSyncCount}
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
            centers={centers} leagueCenters={leagueCenters} setLeagueCenter={setLeagueCenter} searchCenters={searchCenters} homeCenters={myHomeCenters}
            leagueDates={leagueDates} setLeagueDates={saveLeagueDates}
            leagueFormats={leagueFormats} setLeagueFormat={saveLeagueFormat} updateCenter={updateCenter} renameLeague={renameLeague}
            leaguePatterns={leaguePatterns} setLeaguePattern={saveLeaguePattern}
            // pickerPatterns, not oilPatterns: the DB table holds only what
            // the community has actually entered, which on a young install
            // is nothing -- so the league picker searched an empty list and
            // matched no pattern that exists. This is the same list the Log
            // screen offers: community rows PLUS the verified PBA seeds.
            oilPatterns={pickerPatterns}
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
        {view==="locker"&&setupTab==="team"&&(
          <TeamManagement
            // activeLeagues, not the raw list: Practice and Just Bowling
            // are containers, and offering to add a team to one is
            // offering something that can't work.
            leagues={activeLeagues}
            onTeamsChange={persistTeams}
            focusTeamId={focusTeamId}
            onCreateTeam={createTeamForLeague}
            // Joining a team can put the bowler in a league they were not
            // in, so the league list and its details are re-read.
            onJoinedTeam={leagueId=>{absorbLeague(leagueId);loadTeamRequests();}}
            onRequestsChanged={loadTeamRequests}
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
              // For the container-league names a tournament's scores are
              // filed under, when deciding which may hold a record.
              userId={user?.id||""}
              onOpenBadges={()=>{ setBadgeSet(null); setView("badges"); }} />
          </Suspense>
        )}

        {(view==="settings"||view==="history")&&(
          /* RAW shots and sessions below, deliberately.
             
             Backup & Restore lives on this screen. An export that quietly
             omitted a league the bowler has stopped paying to SEE would be
             withholding their own data -- a data-rights problem, and the
             fastest route to a one-star review. hasData is raw for the
             same reason: "is there anything to clear" is about everything
             they have, not what the plan happens to show.

             deleteNight is what makes the calendar's "Delete this night"
             appear -- History never passed it, so the confirm-and-delete
             flow built into CalendarView was unreachable. */
          <Settings
            // Keyed on the mode so History and Settings are two instances.
            // One shared instance kept whichever section it opened on: open
            // History first and the Settings screen stayed on History's
            // section, with no Pro card and no settings cards at all.
            key={view==="history"?"history":"settings"}
            mode={view==="history"?"history":"settings"}
            onOpenNight={openHistoryNight}
            deleteNight={deleteNight}

            // TOURNAMENTS. History is the screen that shows the calendar
            // and the journal, and it was the one mount that never
            // received them -- so a tournament had no day on the
            // calendar, no phases on the card it did show, and every
            // note written on a tournament screen was missing from the
            // journal. Nothing was wrong with any of those features;
            // they were reading an empty list.
            tournaments={tournaments}
            // Lane pattern notes are the last writable note field the
            // journal was missing.
            lanePatterns={lanePatterns}

            drills={drills}
            restartOnboarding={restartOnboarding} replayTour={replayTour} isCoach={showCoachingTab}
            showBackup={showBackup} setShowBackup={setShowBackup}
            backupStatus={backupStatus} setBackupStatus={setBackupStatus}
            forceResync={forceResync} resyncBusy={resyncBusy} resyncError={resyncError}
            pendingSyncCount={pendingSyncCount}
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
            centers={centers} leagueCenters={leagueCenters} setLeagueCenter={setLeagueCenter} searchCenters={searchCenters} homeCenters={myHomeCenters}
            leagueDates={leagueDates} setLeagueDates={saveLeagueDates} renameLeague={renameLeague}
            hiddenLeagues={hiddenLeagues} leagueIds={leagueIdsRef.current} toggleLeagueHidden={toggleLeagueHidden}
            shots={shots}
            teams={teams} activeBowler={activeBowler} leaveTeam={leaveTeam} leftHandedForBowler={leftHandedForBowler}
            onOpenSubscribe={()=>setView("subscribe")}
            onOpenBadges={()=>{ setBadgeSet(null); setView("badges"); }}/>
        )}

        {view==="subscribe"&&(
          <Subscribe entitlement={entitlement} initialPeriod={subscribePeriod} onClose={()=>setView("settings")} onPurchased={()=>setEntitlementReload(n=>n+1)}/>
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
            me={displayName||activeBowler}
            onOpenMyBadges={()=>{ setBadgeSet("casual"); setView("badges"); }}/>
        )}

        {view==="pastNight"&&(
          <PastNightResults
            date={pastNightDate}
            manualScores={manualScores}
            activeBowler={activeBowler}
            badgesEarnedOnNight={badgesEarnedOnNight}
            leftHandedForBowler={leftHandedForBowler}
            onBack={()=>setView("history")}/>
        )}

        {view==="help"&&(
          <HelpView
            key={helpQuery}
            initialQuery={helpQuery}
            environment={preferences.environment}
            onNavigate={setView}
            onClose={()=>setView("log")}
            onReplayTour={replayTour}/>
        )}

        {/* Stays MOUNTED once opened, hidden rather than unmounted.
            
            A read takes a minute or two, and leaving the screen used to
            throw away the whole import -- the photos, the review, an
            extraction already in flight. Hidden keeps all of it, so
            checking a score on another tab and coming back lands exactly
            where they left off. A finished import bumps importRunId,
            which remounts it fresh for next time. */}
        {importOpened&&(
          <div style={view==="import"?undefined:{display:"none"}} aria-hidden={view!=="import"?"true":undefined}>
          {/* RAW shots, deliberately. Import dedupes against everything
              already logged, so a filtered list would let it re-import a
              night into a league the bowler cannot currently see -- and
              they would never find the duplicate to fix it. */}
          <ImportScorecard
            bowlers={bowlers} activeBowler={activeBowler} profiles={profiles} leagues={leagues} teams={teams} tournaments={tournaments} shots={shots} saveShots={saveShots} onSubmitTeammateScores={submitTeammateScores}
            updateManualScore={updateManualScore}
            setSessionLeague={setSessionLeague} setSessionDate={changeSessionDate} selectBowler={selectBowler}
            setView={setView} setSessionSaveMessage={setSessionSaveMessage}
            userId={user?.id||""}
            leftHandedForBowler={leftHandedForBowler}
            key={importRunId}
            onImported={n=>{setImportRunId(i=>i+1);openImportedNight(n);}}
          />
          </div>
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
        {view==="home"&&!nightLive&&proPromptCtx&&(
          <ProTrialEnd ctx={proPromptCtx.ctx} topBall={proPromptCtx.topBall} games={proPromptCtx.games}
            daysLeft={proEnded?0:proDaysLeft}
            onKeep={period=>{setSubscribePeriod(period);setView("subscribe");}}
            onBasic={chooseBasic} onLater={proLater}/>
        )}

        {/* After the trial ask is answered, not beside it: choosing which
            league stays is the second question, and only for Basic. */}
        {view==="home"&&!nightLive&&!proEnded&&lockedLeagueNames.length>0&&!keptLeagueName&&(
          <KeptLeaguePicker
            onUpgrade={()=>setView("subscribe")}
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
              // The "Latest" row: opens that night's results, the same way
              // an imported scorecard opens its night.
              onOpenNight={n=>openImportedNight({kind:n.kind,league:n.league,date:n.date,tournament:n.tournament})}

              badgeCount={earnedBadgeCount}

              // The season windows, so Home can tell "this season" from
              // "between seasons" instead of labelling every league night
              // ever bowled as the current one.
              leagueDates={leagueDates}
              leagueFormats={leagueFormats}

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
                // A night started from Home starts at the beginning.
                //
                // Each mode remembers its tab, and ending a night leaves it
                // on Results -- so the next league night opened straight
                // onto last week's Results the moment a league was chosen.
                // Home is only offered when no night is live, so there is
                // never a night in progress to lose by resetting here.
                setLeagueTabChoice("setup");
                setTournamentTab("setup");
                setPracticeMode("games");
                setSessionSaved(false);
                setSessionSaveMessage(null);
                setCasualRound(env==="casual");
                setCasualLeft(false);
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
            shots={visibleShots} sessions={visibleSessions} bowlers={bowlers} footerHeight={footerHeight} footerRef={footerRef} teams={teams} leagues={logLeagues} startEdit={startEdit} deleteShot={deleteShot}
            activeBowler={activeBowler} arsenals={arsenals}
            form={form} setForm={setForm} editingId={editingId} saved={saved} sessionSaved={sessionSaved} sessionSaveMessage={sessionSaveMessage}
            sessionLeague={sessionLeague} setSessionLeague={setSessionLeague} effectiveSessionLeague={effectiveSessionLeague} sessionDate={sessionDate} setSessionDate={changeSessionDate}
            startingLane={startingLane} setStartingLane={setStartingLane} expandedSections={expandedSections}
            offerShotByShot={offerShotByShot} onTryShotByShot={tryShotByShot} onDismissShotByShot={dismissShotPrompt}
            promptForTeam={promptForTeam} onDismissTeamPrompt={dismissTeamPrompt}
            ballNumLabel={ballNumLabel} curSession={curSession} currentLane={currentLane} firstBallPins={firstBallPins} gameScores={gameScores} frameScores={frameScores}
            hasLeave={hasLeave} leaveDescribed={leaveDescribed} inTenth={inTenth} isNoTap={isNoTap} isStrike={isStrike} needsSpareMade={needsSpareMade} needsPins={needsPins} sessionTotal={sessionTotal} showSparePins={showSparePins} sparePinsStanding={sparePinsStanding} spareKnocked={spareKnocked} spareWillConvert={spareWillConvert} toggleSparePin={toggleSparePin}
            standingPins={standingPins} tenthOptions={tenthOptions} autoFillLine={autoFillLine} calcLane={calcLane} cancelEdit={cancelEdit} cycleGameResult={cycleGameResult} cycleSeriesResult={cycleSeriesResult}
            getLanePattern={getLanePattern} getMatch={getMatch} handleBallChange={handleBallChange} handleLeaveToggle={handleLeaveToggle} handleLineChange={handleLineChange}
            handleSpareMadeToggle={handleSpareMadeToggle} matchHandicap={matchHandicap} previousShotBall={previousShotBall}
            selectBowler={selectBowler} set={set} setLanePattern={setLanePattern} setMatchHandicap={setMatchHandicap} setMatchOpponent={setMatchOpponent} setPokerWinnings={setPokerWinnings} setThreeSixNineWinnings={setThreeSixNineWinnings} winningsSaved={winningsSaved} confirmWinningsSaved={confirmWinningsSaved} setView={setView}
            leagueBuyIns={leagueBuyIns} onSaveLeagueBuyIns={saveLeagueBuyIns} onReplayTour={replayTour}
            casualExtraGames={casualExtraGames} setCasualExtraGames={setCasualExtraGames}
            strictPartial={strictPartial} submitSession={submitSession} fileNightQuietly={()=>fileNight({quiet:true})} saveCasualResults={saveCasualResults} endCasual={endCasual} cancelSession={cancelSession} deleteGame={deleteGame} submitShot={submitShot} theoreticalScoreForGame={theoreticalScoreForGame} maxScoreThisGame={maxScoreThisGame} toggle={toggle} toggleMulti={toggleMulti} toggleSection={toggleSection}
            preferences={logPreferences}
            setSessionMoneyArray={setSessionMoneyArray} setSessionMoneyValue={setSessionMoneyValue}
            activeBowlerLeftHanded={activeBowlerLeftHanded}
            ballLayouts={ballLayouts}
            tournamentSaveMessage={tournamentSaveMessage}

            leagueTabChoice={leagueTabChoice} setLeagueTabChoice={setLeagueTabChoice}
            tournamentTab={tournamentTab} setTournamentTab={setTournamentTab}
            tournamentPhase={tournamentPhase} setTournamentPhase={setTournamentPhase}

            deleteNight={deleteNight}
            activeTournament={activeTournament} updateTournament={updateTournament} saveTournament={saveTournament} moveTournamentFrames={moveTournamentFrames} cancelTournament={cancelTournament} closeTournament={closeTournament} tournamentSaved={tournamentSaved}
            manualScores={manualScores} updateManualScore={updateManualScore}
            ownerName={ownerName} scoringForOthers={scoringForOthers} setScoringForOthers={setScoringForOthers}
            oilPatterns={pickerPatterns} submitOilPattern={submitOilPattern} leaguePatterns={leaguePatterns} tournaments={tournaments} practicePriorAverage={practicePriorAverage}
            scoreOptions={scoreOptions} guests={guests} newGuestName={newGuestName} setNewGuestName={setNewGuestName}
            addGuestBowler={addGuestBowler} removeGuestBowler={removeGuestBowler}
            gameEquipment={gameEquipment} updateGameEquipment={updateGameEquipment}
            sessionSeq={currentSessionSeq}
            badgesEarnedOnNight={badgesEarnedOnNight}
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
        {view==="coaching"&&coachingPanel}

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
            // With teammates' imported columns, like Stats: a team's
            // trend was drawn from this account's own rows alone, so it
            // came out identical to your own.
            sessions={statsVisibleSessions} shots={statsVisibleShots} bowlers={bowlers} leagues={leagues} teams={teams}
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
            centerStats={centerStats}
            lanePatterns={lanePatterns} leaguePatterns={leaguePatterns}
            oilPatterns={oilPatterns}
            statsGroup={dataTab}

            leftHandedForBowler={leftHandedForBowler}

            ballProfile={profiles[statsBowler]||myProfile}

            SHOT_SAMPLE_THRESHOLD={SHOT_SAMPLE_THRESHOLD}

            onImportCsv={importCsvNights}

            centers={centers}

            tournaments={tournaments}

            closedSeasons={closedSeasons} leagueDates={leagueDates}
            rackTypeStats={rackTypeStats} rackTypeDetail={rackTypeDetailStats}
            view={view} entitlement={entitlement} shots={statsVisibleShots} sessions={statsVisibleSessions} bowlers={bowlers} teams={teams} leagues={leagues} arsenals={arsenals} saved={saved}
            statsBowler={statsBowler} setStatsBowler={chooseStatsBowler} compareBowler={compareBowler} setCompareBowler={setCompareBowler}
            compareFriendId={compareFriendId} setCompareFriendId={setCompareFriendId}
            friends={friends} onLoadFriendData={loadFriendData} teamRosters={compareRosters} onLoadTeammateData={loadTeammateData} onOpenFriends={()=>setView("social")} compareSessions={compareSessions} displayName={displayName}
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
            teamStatsLeague={teamStatsLeagueEffective} setTeamStatsLeague={setTeamStatsLeague}
            onHideStatsCard={id=>updatePreferences(prev=>toggleStatsCardHidden(prev,id))}
            onUnhideStatsCards={ids=>updatePreferences(prev=>unhideStatsCards(prev,ids))}
          />
        )}
      </Suspense>
        </ErrorBoundary>
      </div>




      {/* Bottom nav. At the bottom because the top of a phone is out of
          thumb reach and this app is used standing up holding a ball.
          One badge per tab, on the tab where the waiting thing lives:
          "something needs you" and "here's where" become one signal. */}
      <nav data-bottom-nav style={{position:"fixed",bottom:0,left:0,right:0,zIndex:100,display:"flex",backgroundColor:C.surface+"F2",backdropFilter:"blur(18px)",WebkitBackdropFilter:"blur(18px)",borderTop:`1px solid ${C.border}CC`,padding:"8px 5px calc(10px + env(safe-area-inset-bottom, 0px))",boxShadow:`0 -12px 32px ${C.bg}44`}}>
        {navTabs.map(t=>{
          const on=view===t.id||(t.id==="history"&&view==="pastNight")||(t.id==="insights"&&view==="coaching")||(t.id==="locker"&&view==="social")||(t.id==="log"&&view==="import");
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
                flex:1,background:isBowl?C.accent+"28":on?C.accent+"10":"none",
                border:isBowl?`1px solid ${C.accent}66`:on?`1px solid ${C.accent}22`:"1px solid transparent",cursor:"pointer",
                display:"flex",flexDirection:"column",alignItems:"center",gap:isBowl?"4px":"3px",
                padding:isBowl?"6px 0":"6px 0",margin:isBowl?"0 1px":"0 1px",
                borderRadius:"12px",position:"relative",
                color:on?C.accent:C.textMuted,fontFamily:F.body,
                fontSize:isBowl?"11px":"10.5px",fontWeight:(on||isBowl)?700:600,
                WebkitTapHighlightColor:"transparent",boxShadow:on?`inset 0 1px 0 ${C.accent}22`:"none",
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
