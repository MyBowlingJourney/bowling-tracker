// What a bowler is entitled to, in one place.
//
// Every gate in the app asks a question here and nowhere else. That is
// not tidiness: a paywall scattered through fifteen components is a
// paywall nobody can audit, and the first thing you need to answer when
// somebody emails saying "I paid and it's still locked" is "which check
// said no".
//
// PURE. No React, no supabase, no dates read from the wall clock unless
// you let them be. The entitlement row is fetched elsewhere and handed
// in; this file only decides.
//
// ── THE SERVER IS THE AUTHORITY ──────────────────────────────────────
//
// isSubscriber() below mirrors public.is_subscriber() in the database,
// deliberately and exactly. The duplication is the point: the client
// needs an answer without a round-trip on every render, and the server
// needs an answer it can trust when the client is a hostile script.
//
// So the rule is: this file decides what to SHOW. The database decides
// what to SERVE. Anything that costs money -- Insights, Brooklyn,
// Nightcap, scorecard import -- is gated again inside its Edge Function
// by calling is_subscriber(), because the anon key ships in the browser
// and a client-side check is a courtesy, not a boundary.
//
// If you change the status logic here, change it there in the same
// commit. The statuses are listed in both places for exactly that
// reason.

import { isContainerLeague } from "./leagueMembership.js";

// ── The kill switch ─────────────────────────────────────────────────
//
// FALSE until buying actually works.
//
// Gating before there is a way to pay locks bowlers out of features with
// no route to unlock them -- a bug that looks exactly like a scam. While
// this is false every gate below answers yes, the locked states are
// unreachable, and the app behaves as it does today.
//
// Flip it in the same release that ships Play Billing and Stripe, not
// before. It is one line so that the decision is one line.
export const BILLING_LIVE = true;

// ── The plan ────────────────────────────────────────────────────────
//
// NAMING, and it is deliberate: the paid tier is called "My Bowling
// Journey Pro" everywhere a bowler can read it, and is stored as
// plan = "plus" everywhere a machine can read it.
//
// They differ because the stored value is load-bearing in ways the name
// is not: it is in a CHECK constraint on public.entitlements, in
// public.is_subscriber(), and in both store mappings. Renaming it would
// mean a constraint change and six files touched, all inside the code
// that decides who has paid, to change something no customer sees.
//
// So this is not a leftover to tidy up. If the marketing name changes
// again, change the display strings and leave "plus" alone.

export const FREE_LEAGUE_LIMIT = 1;
export const FREE_TEAM_LIMIT = 1;

// The trial takes a card and converts to the monthly plan. Thirty days
// covers four league nights, which is roughly the first point the app has
// anything interesting to say about somebody's game.
export const TRIAL_DAYS = 30;

// When to suggest the annual plan to a monthly subscriber.
//
// Two months, and the timing is the whole point: a bowler on day 30 is
// still deciding whether they want this, and one three months in knows.
//
// Annual is churn insurance rather than extra revenue, and the break-even
// is worth writing down -- 49.99 / 6.99 is 7.15 months. A monthly
// subscriber who would have stayed longer than that costs you money by
// switching. Below it, the switch pays. Revisit once there is real
// retention data instead of a guess.
export const ANNUAL_PROMPT_AFTER_DAYS = 60;

// The stats cards behind the wall.
//
// One rule, and it is answerable without judgement: does this card
// compare two things? People, balls, houses, patterns, rack types, or
// this season against last. Everything else is free, including byBall --
// which reports each ball's own numbers and compares nothing.
//
// A rule rather than a list is what matters here. When card thirty-six
// arrives, nobody has to relitigate the philosophy; they ask the one
// question and put it on the right side.
export const PAID_STATS_CARDS = Object.freeze([
  "headToHead",       // you against another bowler
  "teamLeaderboard",  // teammates ranked
  "giantKiller",      // every bowler ranked by who beat the league's best
  "hung",             // every bowler ranked by times left hanging
  "ballCompare",      // ball against ball
  "byCenter",         // house against house
  "patternHistory",   // pattern against pattern
  "rackType",         // free fall against string
  "seasonCompare",    // this season against last
]);

const PAID_CARD_SET = new Set(PAID_STATS_CARDS);

// ── Reading the entitlement ─────────────────────────────────────────

// ABSENT and UNREADABLE are different answers, and collapsing them was a
// real bug: a null current_period_end means "no end recorded", which is a
// manual grant and therefore open-ended -- so a date that merely failed
// to parse was being read as a grant, and garbage in that column bought
// somebody a permanent subscription.
//
// null  -> the field is genuinely empty
// NaN   -> something is there and we cannot read it, which is never access
const at = v => {
  if (v === null || v === undefined || v === "") return null;
  const t = Date.parse(v);
  return Number.isFinite(t) ? t : NaN;
};

// Is this bowler paid up right now?
//
// MIRRORS public.is_subscriber(). Three separate "yes" cases, and each
// one is a bug that locks out a paying customer if you get it wrong:
//
//   trialing / active   paid up, and the period end is the boundary
//   grace               the card failed and the store is still retrying.
//                       The period has ALREADY ended -- that is what
//                       grace is -- so it must NOT be checked against
//                       the date. Cutting someone off here punishes an
//                       expired card in the middle of a season; the
//                       store says it has given up by moving them to
//                       on_hold.
//   canceled            they cancelled but paid through the period, so
//                       they keep it until the date they already bought.
//
// Everything else is no: on_hold, paused (a bowler taking the summer
// off, deliberately not charged), expired, none.
//
// A null current_period_end means no end was recorded -- a manual grant
// -- and is open-ended rather than expired.
export function hasPaidSubscription(entitlement, now = Date.now()) {
  const e = entitlement && typeof entitlement === "object" ? entitlement : null;
  if (!e || e.plan !== "plus") return false;
  const ends = at(e.current_period_end);
  // Fail closed on a date nobody can read. The alternative is granting
  // access on corrupt data, which is the one direction this must never
  // fail in.
  if (Number.isNaN(ends)) return false;
  switch (e.status) {
    case "trialing":
    case "active":
      return ends === null || ends > now;
    case "grace":
      return true;
    case "canceled":
      return ends !== null && ends > now;
    default:
      return false;
  }
}

// ── Test accounts ───────────────────────────────────────────────────
//
// One flag, set in the database, that unlocks everything regardless of
// BILLING_LIVE. It exists so the app can be used in full without a
// subscription: by us, and by an App Store or Play reviewer, who has to
// be able to see every paid screen without being asked for a card.
//
// NOT the same thing as comping somebody. A comped bowler has been GIVEN
// a subscription -- free months, goodwill after a bad night of sync --
// and should behave like a subscriber everywhere, including in the
// dashboard and in any revenue figure. A test account is not a customer
// at all and must never be counted as one. Keeping them as separate
// ideas is what stops "how many subscribers do we have" from quietly
// including the developer.
//
// SAFE TO TRUST CLIENT-SIDE: `authenticated` holds only SELECT on
// entitlements -- no UPDATE, no INSERT -- so a bowler cannot set this on
// themselves. Only service_role and postgres can write it, which means
// the flag arriving in the browser was put there by us.
export function isTestAccount(entitlement) {
  return entitlement?.is_test_account === true;
}

// The question every ACCESS gate asks: may they use Pro things?
//
// Deliberately split from hasPaidSubscription, which is the question the
// CHECKOUT guards ask: do they already have a subscription, so block a
// second purchase? Fold the two together and a test account can never
// exercise the purchase flow -- Subscribe and create-checkout would both
// refuse it -- and testing billing is half the reason the flag exists.
//
// Two questions, two predicates, each defined once. The double-charge
// bug came from one question having two different answers in two files.
export function isSubscriber(entitlement, now = Date.now()) {
  return isTestAccount(entitlement) || hasPaidSubscription(entitlement, now);
}

export function isTrialing(entitlement, now = Date.now()) {
  return isSubscriber(entitlement, now) && entitlement?.status === "trialing";
}

// Time to suggest the annual plan?
//
// Needs the billing_period column to know they are on monthly. While
// that is absent this answers false, which is the safe direction -- an
// annual subscriber must never be asked to switch to annual.
//
// Deliberately NOT a discount. The annual plan is already 40% cheaper
// than twelve months of monthly, and discounting a discount gives away
// margin for a decision the arithmetic already makes. It is also easy to
// add later and painful to remove, because taking one away reads as a
// price rise.
export function shouldOfferAnnual(entitlement, now = Date.now()) {
  if (!isSubscriber(entitlement, now)) return false;
  if (entitlement?.status === "trialing") return false;
  if (entitlement?.billing_period !== "month") return false;
  const since = at(entitlement?.created_at);
  if (!Number.isFinite(since)) return false;
  return now - since >= ANNUAL_PROMPT_AFTER_DAYS * 86_400_000;
}

// Days left in a trial, for the banner. Rounded UP: a bowler with six
// hours left has "1 day", not "0 days", which would read as expired.
export function trialDaysLeft(entitlement, now = Date.now()) {
  const ends = at(entitlement?.trial_end);
  if (!Number.isFinite(ends) || ends <= now) return 0;
  return Math.ceil((ends - now) / 86_400_000);
}

// ── The gates ───────────────────────────────────────────────────────
//
// Each takes the whole entitlement rather than a boolean, so the shape of
// the answer can grow -- a partial plan, a comped account -- without
// every call site changing.
//
// billingLive is an explicit option rather than a closed-over constant,
// and that is what makes the paywall testable BEFORE it is switched on.
// With the constant baked in, every gate returns true today and the
// tests that matter -- the ones proving a free bowler is actually
// stopped -- could not be written until the day it flips, which is the
// worst possible day to discover they fail. It also gives you a way to
// preview the locked app without shipping a release.
export function featureUnlocked(entitlement, { now = Date.now(), billingLive = BILLING_LIVE } = {}) {
  return !billingLive || isSubscriber(entitlement, now);
}

// The three that cost money on every call. Gated AGAIN inside their Edge
// Functions; this only decides what the screen shows.
export const canUseInsights = (entitlement, opts) => featureUnlocked(entitlement, opts);
export const canUseGenie = (entitlement, opts) => featureUnlocked(entitlement, opts);
export const canPourNightcap = (entitlement, opts) => featureUnlocked(entitlement, opts);

export const canUseCoaching = (entitlement, opts) => featureUnlocked(entitlement, opts);
export const canUseBracketsAndSidePots = (entitlement, opts) => featureUnlocked(entitlement, opts);
export const canCompareToFriend = (entitlement, opts) => featureUnlocked(entitlement, opts);

// Scorecard import. A plain gate like the rest.
//
// This was briefly one free import a week. It came out because one a
// week is exactly one league night -- so the allowance covered a
// single-league bowler's entire use of the feature, forever, and walled
// off nobody it was meant to. The 30-day trial is where a new bowler
// sees what import does, several times, on real league nights.
export const canImportScorecard = (entitlement, opts) => featureUnlocked(entitlement, opts);

export function canSeeStatsCard(cardId, entitlement, opts) {
  if (!PAID_CARD_SET.has(cardId)) return true;
  return featureUnlocked(entitlement, opts);
}

export function leagueLimit(entitlement, opts) {
  return featureUnlocked(entitlement, opts) ? Infinity : FREE_LEAGUE_LIMIT;
}

export function teamLimit(entitlement, opts) {
  return featureUnlocked(entitlement, opts) ? Infinity : FREE_TEAM_LIMIT;
}

// ── Which leagues a free bowler can still see ───────────────────────
//
// Hidden, never deleted. A bowler who lapses keeps every shot they ever
// logged; one league goes quiet until they subscribe again, and comes
// straight back when they do.
//
// CONTAINERS ARE NEVER COUNTED. Practice, Just Bowling, Tournament and
// Imported are storage, not leagues somebody joined -- counting them
// would mean a lapsed bowler could not practice, which is both wrong and
// the exact moment they are most likely to come back.
//
// Which real league survives, in order:
//   1. the one they chose (kept_league_id, resolved to a name by the
//      caller -- this file does not know about ids)
//   2. the one they bowled most recently, as a default until they choose
//   3. the first, sorted, so the answer is at least stable
//
// Deliberately NOT auto-picking and forgetting: the caller asks them,
// through the inbox and at sign-in, and stores the answer. Guessing
// right half the time is worse than guessing once and asking.
export function allowedLeagues(leagues, {
  entitlement = null, keptLeagueName = "", mostRecentLeagueName = "",
  now = Date.now(), billingLive = BILLING_LIVE,
} = {}) {
  const all = (Array.isArray(leagues) ? leagues : []).filter(n => typeof n === "string" && n.trim());
  if (featureUnlocked(entitlement, { now, billingLive })) return all;

  const containers = all.filter(isContainerLeague);
  const real = all.filter(n => !isContainerLeague(n));
  if (real.length <= FREE_LEAGUE_LIMIT) return all;

  const pick = [keptLeagueName, mostRecentLeagueName].find(n => n && real.includes(n))
    || [...real].sort()[0];

  return [...containers, pick];
}

// The leagues a free bowler has lost access to, for the picker that asks
// them which one to keep. Their data is untouched; this is only what the
// app stops showing.
export function lockedLeagues(leagues, opts = {}) {
  const all = (Array.isArray(leagues) ? leagues : []).filter(n => typeof n === "string" && n.trim());
  const visible = new Set(allowedLeagues(all, opts));
  return all.filter(n => !visible.has(n));
}
