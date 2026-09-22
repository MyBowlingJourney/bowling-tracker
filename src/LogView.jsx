import { useState, useRef, useEffect, lazy, Suspense} from "react";
import { C, S, F, Chip, PinDeck, CollapsibleCard, StatLead } from "./ui.jsx";
import { PLASTIC_BALL, formatDate, localDateString, RESULTS, SURFACES, RELEASES, MISSES, BALL_CHANGE_REASONS, resultsForHandedness, storedResultFor, strikeDescriptionsForHand, storedStrikeDescriptionFor, practiceLeagueDisplayName } from "./constants.js";
import { rAvg, cAvg, threeSixNineResults, cumulativeAvgBeforeDate } from "./domain/stats.js";
import { buyInsForLeague, costArraysFor, sessionMoney } from "./domain/money.js";
import { anyMoneyGameShown, visibleMoneyGames } from "./domain/preferences.js";
import { nextLeagueDate, prebowlConflict } from "./domain/sessions.js";
import { needsLeagueSetup } from "./domain/tour.js";
import { EXAMPLE_PATTERN } from "./domain/oilPatterns.js";
import { achievementsFor, PLACEMENTS } from "./domain/achievements.js";
import { inferLeagueDay } from "./domain/reminders.js";
import Scoresheet from "./Scoresheet.jsx";
import TournamentSession from "./TournamentSession.jsx";
import DrillSession from "./DrillSession.jsx";
import SessionRecap from "./SessionRecap.jsx";
import { casualRecap } from "./domain/sessionRecap.js";
import Nightcap from "./Nightcap.jsx";
import ShareButton from "./ShareButton.jsx";
import OilPatternPicker from "./OilPatternPicker.jsx";
import { sessionHighlights } from "./domain/shareCard.js";
import { getManualScore, resolveGameScore, seriesTotal, getGameEquipment, defaultPracticeBall } from "./domain/manualScores.js";
import { formatLayout } from "./domain/layouts.js";
import { otherBowlerSource, scorekeepingHelp, boardMiss, acceptBoardKeystroke } from "./domain/scorekeeping.js";
import { plasticLast } from "./domain/bags.js";



import { maxPossibleScore } from "./domain/scoring.js";

import { revealBottomDelta, MIN_SCROLL } from "./domain/scrollReveal.js";

import { isBaker, bakerBowlerFor } from "./domain/tournamentFormats.js";

import { practiceSummary, practiceShotStats } from "./domain/practiceSummary.js";

import { isSplit } from "./domain/splits.js";
import { laneDigits } from "./domain/laneInput.js";
import { deleteGameColumnPlan, columnHasScores } from "./domain/casualColumns.js";
export default function LogView({
  // The night's own note, owned by BowlingTracker so it can be saved with
  // the session. It used to write form.notes -- the shot form -- so a
  // note typed on Results only persisted if another ball was thrown.
  sessionNotes = "", setSessionNotes,
  // Was used free at the night-achievements block below and never
  // declared anywhere, so rendering a completed session threw
  // "profiles is not defined" and took the screen down. Defaulted
  // to {} so a caller that does not pass it degrades to "no previous
  // bests known" rather than crashing -- the optional chaining at
  // the use site already handles an empty object.
  profiles = {},
  // Focus group Finding 3. Passed in rather than computed here so the
  // decision stays in one pure, tested place and LogView only renders.
  offerShotByShot = false, onTryShotByShot, onDismissShotByShot,
  // Focus group Finding 2. Computed in BowlingTracker so the rule stays
  // in one tested place; this only renders it.
  promptForTeam = false, onDismissTeamPrompt,
  shots, sessions, bowlers, footerHeight, footerRef, teams, leagues, startEdit, deleteShot,
  activeBowler, arsenals, form, setForm, editingId, saved, sessionSaved, sessionSaveMessage, tournamentSaveMessage,
  leagueTabChoice = "scoring", setLeagueTabChoice, tournamentTab = "setup", setTournamentTab,
  sessionLeague, setSessionLeague, effectiveSessionLeague, sessionDate, setSessionDate,
  startingLane, setStartingLane, expandedSections, badgesEarnedOnNight,
  ballNumLabel, curSession, currentLane, firstBallPins, gameScores = [], frameScores = [],
  hasLeave, leaveDescribed, inTenth, isNoTap, isStrike, needsSpareMade, needsPins, sessionTotal,
  standingPins, tenthOptions,
  autoFillLine, calcLane, cancelEdit, cycleGameResult, cycleSeriesResult,
  getLanePattern, getMatch, handleBallChange, handleLeaveToggle, handleLineChange,
  handleSpareMadeToggle, matchHandicap, previousShotBall, selectBowler, set, setLanePattern, setMatchHandicap, setMatchOpponent, setPokerWinnings, setThreeSixNineWinnings, winningsSaved, confirmWinningsSaved, setView,
  leagueBuyIns, onSaveLeagueBuyIns, onReplayTour, casualExtraGames = 2, setCasualExtraGames,
  showSparePins, sparePinsStanding, spareKnocked, toggleSparePin, spareWillConvert, strictPartial, submitSession, cancelSession, deleteGame, submitShot, theoreticalScoreForGame, maxScoreThisGame, toggle, toggleMulti, toggleSection,
  preferences, setSessionMoneyArray, setSessionMoneyValue, activeBowlerLeftHanded,
  saveCasualResults, endCasual, ballLayouts, activeTournament, updateTournament, saveTournament, closeTournament, cancelTournament, tournamentSaved,
  manualScores, updateManualScore,
  // Handed straight to the Nightcap, which is the only paid thing
  // on this screen.
  entitlement = null,
  showSessionStart, goalsPanel, practiceMode, setPracticeMode, gameEquipment, updateGameEquipment, activeDrill, setActiveDrill, startDrill, startAnotherDrill, saveDrill, drillSaved, drills, leftHandedForBowler,
  ownerName, scoringForOthers, setScoringForOthers, scoreOptions, guests, newGuestName, setNewGuestName, addGuestBowler, removeGuestBowler,
  oilPatterns, submitOilPattern, leaguePatterns = {}, tournaments, practicePriorAverage,
  envBags, selectedBagId, setSelectedBagId, logBalls,
  }) {
  // What each environment shows on the Log tab. Kept in one place so the
  // rules read as rules rather than being scattered through 1,100 lines
  // of JSX:
  //   - Tournament and casual never show goals or the ball/surface cards:
  //     a tournament bowler is working from the tournament card, and a
  //     casual night is scores only.
  //   - Drills keep their own ball chips inside the drill card and don't
  //     need the separate ball and surface cards under them.
  const env=preferences.environment;
  const isDrill=env==="practice"&&practiceMode==="drill";
  // Extra game rows the bowler asked for beyond what's been entered.
  // Session-local: a practice where you added a 4th game shouldn't make
  // every future session start with four empty boxes.
  const [extraGames,setExtraGames]=useState(0);
  // Cancelling deletes tonight's shots, so it is armed before it fires.
  // Local, not lifted: nothing outside this screen needs to know that a
  // confirm is half-open, and it should reset if the screen is left.
  const [cancelArmed,setCancelArmed]=useState(false);
  // The cancel confirmation opens UNDER the fixed End Session bar.
  //
  // It expands in place, at the bottom of Set up, and the bar is pinned
  // over the bottom of the window -- so the two buttons that answer the
  // question it just asked were behind it, and the only way to reach
  // them was to scroll a page that had just changed height.
  //
  // Same treatment as every other reveal on this screen: measure against
  // the BAR's top rather than the window's, and bring the card's bottom
  // above it. allowUp, because this has to land whichever way the page
  // currently sits; cap, so its own top never slides under the header
  // and hides what is being agreed to.
  const cancelRef=useRef(null);
  // Open bowling: Results appear only once asked for. Local, so leaving
  // the screen hides them again -- a filed night shows them regardless.
  const [casualResultsShown,setCasualResultsShown]=useState(false);
  // Open bowling's two tabs, Scoring and Results -- the same shape every
  // mode now has. Local: a new round of open bowling starts on Scoring.
  const [casualTab,setCasualTab]=useState("scoring");
  const [casualMsg,setCasualMsg]=useState("");
  const [casualSpacer,setCasualSpacer]=useState(0);
  const howItWentRef=useRef(null);
  // Which game number is armed for deletion, or null. One at a time, so
  // arming a second cancels the first rather than leaving two live.
  const [gameToDelete,setGameToDelete]=useState(null);

  // Score fields are locked while logging shot by shot.
  //
  // With shots being recorded, a score is already derived from them. An
  // accidental keystroke in a score box would silently override that
  // derived score -- manual entry takes precedence -- and the bowler
  // would have no idea their real score had been replaced.
  //
  // One lock for all games, not one per game: a bowler switching to
  // manual entry mid-night is switching for the rest of the night, and
  // three separate padlocks is three times the friction for no benefit.

  // League needs a league picked before anything else is worth showing.
  //
  // Not just tidiness -- it's a data-integrity gate. Shots and scores are
  // filed against (bowler, league, date), so anything logged before a
  // league is chosen has nowhere to go: it wouldn't sync, wouldn't appear
  // once a league WAS picked, and would still skew any average that
  // doesn't filter by league. Waiting for one tap prevents all of it.
  const leagueReady=env!=="league"||!!effectiveSessionLeague;


  // Shot-derived scores for this tournament day, by game number.
  //
  // Tournament games are typed by hand, so a bowler frame-tracking an
  // event had to log every shot AND type the total -- one number entered
  // twice, with two chances to disagree.
  //
  // This supplies the frames half. resolveTournamentGameScore prefers
  // whatever was typed, because the house scorer decides whether you
  // cashed and a mis-tapped frame needs an override the app will not
  // argue with.
  // Frame-derived scores for a tournament, keyed BY BLOCK DATE then by
  // game number.
  //
  // One flat map of game -> score was wrong the moment a tournament had
  // more than one block: day 1 game 1 and day 2 game 1 are different
  // games, and a single map showed the same number for both. A bowler
  // with a Saturday and a Sunday block saw Saturday's frames under
  // Sunday's games.
  //
  // Keyed on the block's own date rather than the session date, because
  // those drift apart -- the shot form can still be on today while the
  // bowler is filling in tomorrow's block.
  const tournamentShotScoresByDate=(()=>{
    // The early return logged nothing, so "no entry at all" was
    // indistinguishable from "never ran". Say which.
    if(env!=="tournament"||!activeBowler||!effectiveSessionLeague){
      if(env==="tournament"&&(shots||[]).length){
      }
      return null;
    }

    // Same identity the scoresheet resolves, so the two cannot disagree.
    // activeBowler alone missed shots saved under the form's bowler --
    // a full game on the scoresheet, nothing in any score box.
    const nightBowler=form.bowler||activeBowler;
    const nightLeague=effectiveSessionLeague;
    const mine=(shots||[]).filter(sh=>sh&&sh.bowler===nightBowler
      &&sh.league===nightLeague);

    if(!mine.length){
      // Shots exist for this bowler somewhere, just not under this
      // league -- the single most likely cause, and invisible until now.
      const anywhere=(shots||[]).filter(sh=>sh&&sh.bowler===(form.bowler||activeBowler));
      if(anywhere.length){
      }
      return null;
    }

    const byDate={};
    for(const sh of mine){
      const d=String(sh.date||"");
      if(!d)continue;
      (byDate[d]=byDate[d]||{});
      (byDate[d][String(sh.game)]=byDate[d][String(sh.game)]||[]).push(sh);
    }
    // Two maps: the scores, and the shots they came from. Completeness
    // is a question about the shots -- has the tenth been bowled out --
    // and a score alone cannot answer it.
    const out={};
    const raw={};
    for(const[date,games]of Object.entries(byDate)){
      raw[date]=games;

      const scores={};
      for(const[game,gs]of Object.entries(games)){
        const v=strictPartial(gs);
        if(typeof v!=="number")continue;
        // Completeness travels WITH the score, in one map, and is
        // decided WITHOUT reading ball numbers.
        //
        // The old rule looked for the tenth's ball 1 and ball 2 by
        // number. That made filling depend on every shot carrying the
        // right ballNum -- and a single wrong one anywhere in the tenth
        // left the game permanently "in progress": score present,
        // nothing filled, and nothing to show for it.
        //
        // maxPossibleScore returns null once no further ball can change
        // the total. That IS finished, and it is derived from the same
        // frame data the score is, so the two cannot disagree.
        const done=maxPossibleScore(gs)===null;
        scores[game]={score:v,complete:done};
        // Not finished: say what the tenth actually looks like.
        //
        // This is the one thing left that can stop a completed game
        // filling, and it is invisible from the outside -- the score
        // shows, the box stays empty, and nothing says which frame is
        // unresolved.
        if(!done){
          const tenth=gs.filter(sh=>parseInt(sh.frame)===10)
            .map(sh=>`b${sh.ballNum??"-"}:${sh.result||"?"}${sh.spareMade?"/"+sh.spareMade:""}${sh.pinCount?"("+sh.pinCount+")":""}`)
            .join(" ")||"none";
        }

      }
      if(Object.keys(scores).length)out[date]=scores;
    }
    // Nothing derived, but shots exist: say why, once.
    //
    // Every link here has been verified in isolation and the bug has
    // survived six fixes, which means an assumption about the real data
    // is wrong. This records what was actually found instead of guessing
    // again -- bowler, league, dates and games seen, and what the scorer
    // made of them.
    if(!Object.keys(out).length&&mine.length){
      const sample=mine.slice(0,3).map(sh=>
        `f${sh.frame}${sh.ballNum?`b${sh.ballNum}`:""}:${sh.result||"?"}`).join(" ");
    }
    return Object.keys(out).length?{scores:out,shots:raw}:null;

  })();


  const showGoals=leagueReady&&(env==="league"||(env==="practice"&&!isDrill));
    // Ball, surface, line and the rest of the accessory fields.
    //
    // Everywhere except open bowling. Tournament and drills used to be
    // excluded too -- tournament because its card was already dense, and
    // the bowler had asked for them gone at the time.
    //
    // The comment that sat here predicted exactly what went wrong: "a
    // frame-tracked tournament records no ball per shot, so carry-by-ball
    // will have nothing from those nights". It did, and a tournament is
    // the setting where the line matters MOST -- a fresh pattern you may
    // never see again is worth writing down.
    //
    // Open bowling stays out: scores-only is the entire point of that
    // mode, so it does not get the choice at all.
    //
    // leagueReady stays: in league play a session with no league picked
    // has nowhere to file the shot.
    const showEquipment=leagueReady&&env!=="casual";

  // Shot Context (game/frame/lane) is meaningless without shots -- a
  // scores-only night has games, not frames. It had no gate at all.
  // Tournament tab, owned here so Shot Context can follow it.
  // League tabs. Same treatment as the tournament card: a league night
  // carries setup, scoring, side pots and a recap, and one scroll of all
  // of it buries the part you came for.
  //
  // Defaults to scoring, not setup -- a league bowler arriving mid-night
  // wants the scoresheet, and setup is a once-a-season job.
  // Scoring by default, EXCEPT when the night is not set up yet.
  //
  // The league picker lives on Set up. Defaulting to Scoring meant a
  // bowler with no league chosen landed on a tab that cannot choose one
  // -- and the only way forward was a tab they had no reason to open.
  //
  // Once a league is picked, arriving mid-night should land on the
  // scoresheet, which is what a league bowler actually came for.
  // DERIVED, not just an initial value.
  //
  // A lazy initialiser runs once, and sessionLeague is empty on the
  // first render while the saved context loads -- so the tab would latch
  // to "setup" and stay there even after a league appeared.
  //
  // Forcing setup whenever no league is chosen also means the bowler
  // cannot navigate away from the one tab that can fix that, which is
  // the right constraint rather than an accident.
  const leagueTab=sessionLeague?leagueTabChoice:"setup";
  const setLeagueTab=setLeagueTabChoice;
  const leagueTabs=env==="league";
  // Which tab a block belongs to, for BOTH tab strips.
  //
  // This was `!leagueTabs || leagueTab === t`, so outside league mode it
  // answered TRUE for every tab name -- and the tournament screen has its
  // own tabs. The night recap, gated on onTab("results"), therefore
  // appeared under Set up, Scoring, Brackets and Match as well: four
  // screens showing a summary of a session, one of which is the place it
  // belongs.
  //
  // In tournament mode the answer comes from the TOURNAMENT tab instead.
  // Practice and open bowling have no tabs at all, so there everything
  // still shows, which is what "no tabs" should mean.
  const onTab=t=>{
    if(env==="tournament")return tournamentTab===t;
    // Practice has chips too -- Games, Drill and Results -- and until now
    // this returned true for every tab name in practice, so the
    // "Tonight's Session" summary card rendered on Games and Drill as
    // well as Results. Three chips, one screen, no difference between
    // them but the form at the bottom.
    //
    // Games and Drill are for doing; Results is for looking back. Setup
    // and results content belongs there, scoring belongs on the other
    // two.
    if(env==="practice"){
      // Named explicitly, not "anything that is not results".
      //
      // The catch-all returned true for "side" as well, and the night
      // summary card renders on results OR side -- so the whole results
      // table appeared on Games and Drill, which is exactly what the
      // chips were meant to separate.
      //
      // Practice has no side pots and no setup of its own, so those are
      // false outright.
      if(t==="results")return practiceMode==="results";
      if(t==="scoring")return practiceMode!=="results";
      return false;
    }
    // Open bowling: Results shows the recap, everything else belongs to
    // Scoring. It had no tabs, so results appeared under the scores on
    // one long page.
    if(env==="casual")return t==="results"?casualTab==="results":casualTab!=="results";
    if(!leagueTabs)return true;
    return leagueTab===t;
  };

  const [tenthPick,setTenthPick]=useState(null);
  // Scroll target for Save Shot.
  //
  // Picking a result is the last thing a bowler does before saving, and
  // the button is below the fold on a phone -- so every shot needed a
  // scroll the app could have done itself. Between frames that is a
  // hundred scrolls a night.
  // How many games the stepper will go to.
  //
  // Three everywhere else, which is right for a league night. A
  // tournament block is whatever the bowler made it -- five-game
  // qualifying, eight-game blocks -- so the cap comes from the block
  // itself rather than a second setting to keep in step.
  //
  // The block for tonight if one matches the session date, otherwise the
  // longest block in the event: a bowler stepping through games before
  // filling in dates should not hit a wall at three.
  // How far the game stepper goes.
  //
  // Three is right for a league night. A tournament is whatever the
  // bowler is bowling -- five-game qualifying, eight-game blocks -- so
  // it must not stop them at three.
  //
  // Deliberately NOT derived from the block's game count. That was the
  // first attempt and it depended on the block being dated, matching
  // tonight, and already having the games added -- three ways to still
  // be stuck at three with no way to tell which one bit. In a tournament
  // the stepper simply always allows one more, which is what "let the
  // bowler control it" actually means.
  //
  // Twelve is a stop, not a limit anyone should reach: it is past any
  // real block, and an unbounded stepper turns a stuck tap into a game
  // number in the hundreds.
  const maxGames=env==="tournament"
    ? Math.min(12, Math.max(3, (parseInt(form.game)||1)+1))
    : 3;

  // Kept as a scroll anchor for the disabled-reason hint, which stays in
  // flow where the button used to be. The button itself is sticky now, so
  // there is nothing to scroll TO -- the old scrollToSave helper went
  // with it rather than sitting unused.

  // Scroll the MINIMUM needed to bring a section fully into view above
  // the bottom nav.
  //
  // Three things this gets right that the previous version did not:
  //
  //   The ref wraps the button itself, not an empty div above it.
  //   Measuring a zero-height marker meant aligning the button's TOP to
  //   the nav, which put the button underneath it -- the exact symptom.
  //
  //   It only ever scrolls DOWN. Scrolling up to "centre" something
  //   throws away context the bowler was reading.
  //
  //   It does nothing when the target is already visible, so tapping a
  //   second chip does not jog the page.
  //
  // The nav is measured rather than assumed: its height moves with the
  // phone's safe-area inset.
  const scrollTo=ref=>requestAnimationFrame(()=>requestAnimationFrame(()=>{
    const el=ref.current;
    if(!el)return;
    // Wrapped, because this runs two frames later.
    //
    // By then the view may have unmounted -- ending a session navigates
    // Home -- and an exception in a requestAnimationFrame callback has
    // nothing above it to catch it: it surfaces as an unhandled error
    // with a stack pointing at a timer, which tells a bowler nothing and
    // told me nothing either until a harness hit it.
    //
    // Scrolling is a convenience. Failing to scroll is not worth an error.
    try{
    const nav=document.querySelector("nav");
    const navTop=window.innerHeight-(nav?nav.getBoundingClientRect().height:64);
    const delta=el.getBoundingClientRect().bottom-(navTop-8);
    if(delta>2)window.scrollBy({top:delta,behavior:"smooth"});
    }catch{ /* no DOM to scroll */ }
  }));


  // Put an element's TOP just under the header.
  //
  // scrollTo above pulls an element's BOTTOM above the nav, which is what
  // you want for a save button. For the field a bowler is about to fill,
  // the opposite is right: they should be looking at it with the rest of
  // the form below, not at the bottom edge of the screen.
  //
  // The header is sticky, so its height has to come off or the element
  // lands underneath it.
  const scrollToTopOf=ref=>requestAnimationFrame(()=>requestAnimationFrame(()=>{
    const el=ref.current;
    if(!el)return;
    try{
    const header=document.querySelector("header")
      ||document.querySelector("[data-app-header]");
    const headerH=header?header.getBoundingClientRect().height:64;
    const delta=el.getBoundingClientRect().top-(headerH+8);
    if(Math.abs(delta)>2)window.scrollBy({top:delta,behavior:"smooth"});
    }catch{ /* no DOM to scroll */ }
  }));

  // Bring the BOTTOM of a region onto the screen.
  //
  // scrollToTopOf pins an element's TOP under the header, which is right
  // when something new appears and you want to start reading at it. It is
  // wrong for "show me the rest of the form", where what matters is the
  // far end: the last accessory cards are Shoes and Execution, and the
  // bowler wants to see those with Save Shot underneath them.
  //
  //   cap = false  the region is TALLER than the screen (the accessory
  //                grid). Its top cannot stay visible and does not need
  //                to -- the bowler has already read it on the way down.
  //                Scroll all the way to the bottom edge.
  //
  //   cap = true   the region FITS (the Result card). Reveal its end, but
  //                never so far that its own top slips under the header,
  //                which would hide the answer being looked at.
  //
  // Either way it refuses to scroll backwards: already visible means
  // already done, and moving the page then is the app taking a decision
  // the bowler did not make.
  // The arithmetic lives in domain/scrollReveal.js so it can be tested;
  // this half only measures and scrolls.
  const revealBottomOf=(ref,{cap=false,allowUp=false}={})=>requestAnimationFrame(()=>requestAnimationFrame(()=>{
    const el=ref&&ref.current;
    if(!el)return;
    try{
      const header=document.querySelector("header")
        ||document.querySelector("[data-app-header]");

      // The fixed Save Shot bar covers the bottom of the window, so the
      // useful area ends at ITS top. Measured, not computed: when the bar
      // is not on screen there is nothing to clear and the window bottom
      // is the limit.
      const viewport=window.innerHeight||0;
      const barTop=footerRef&&footerRef.current
        ?footerRef.current.getBoundingClientRect().top
        :viewport;

      const delta=revealBottomDelta({
        rect:el.getBoundingClientRect(),
        bottomLimit:Math.min(viewport,barTop>0?barTop:viewport),
        headerH:header?header.getBoundingClientRect().height:64,
        cap,allowUp,
      });
      if(Math.abs(delta)>MIN_SCROLL)window.scrollBy({top:delta,behavior:"smooth"});
    }catch{ /* no DOM to scroll */ }
  }));

  // The fields a result reveals, so the next tap is already on screen.
  // A label above each field, and smaller text inside it.
  //
  // Placeholders vanish the moment a bowler types, so a filled form was a
  // row of numbers with nothing saying which was which -- fine while you
  // are filling it in, useless when you come back to check. Release and
  // miss already had headers; heel, sole and every measurement did not.
  //
  // The input text drops to 13px because these are short values -- two
  // digits, a decimal -- and 15px in a half-width column left no room
  // for the header above it.
  const fieldHead={fontSize:"11px",color:C.textMuted,marginBottom:"3px"};
  const smallInput={fontSize:"13px",padding:"9px 10px"};

  const strikeDescRef=useRef(null);
  const pinsStandingRef=useRef(null);
  const spareMadeRef=useRef(null);
  const totalPinsRef=useRef(null);
  const detailsRef=useRef(null);
  const resultCardRef=useRef(null);
  const tenthPickRef=useRef(null);

  // The tenth's ball chooser has to be looked at to be used.
  //
  // Top-aligned, not bottom-aligned like the Result card. The chooser
  // sits directly above the frames, so putting its top under the header
  // leaves the scoresheet immediately below it -- the question and the
  // frame it is about, on screen together. Landing on its bottom edge
  // would push the frames off.
  //
  // scrollToTopOf moves in either direction, and the chooser is above
  // the frames the bowler just tapped, so this is normally upward.
  useEffect(()=>{
    if(tenthPick)scrollToTopOf(tenthPickRef);
  },[tenthPick]);

  // Entering edit mode lands on the RESULT card, not the banner.
  //
  // The banner says which shot is open; the Result card is the thing you
  // came to change, and it is the one field a shot cannot be saved
  // without. Landing on the banner put the answer below the fold and
  // made every edit start with a scroll.
  //
  // Capped, because the Result card fits on a screen: reveal its end
  // with Save Shot below it, without pushing its own top under the
  // header.
  //
  // This used to be window.scrollTo(0,0) inside startEdit, which worked
  // only because the banner happened to be at the top of the page. It
  // read as "tapping a frame throws you to the top", and on the tenth --
  // where the ball chooser runs first -- that is exactly what it was.
  useEffect(()=>{
    if(editingId)revealBottomOf(resultCardRef,{cap:true,allowUp:true});
  },[editingId]);

  // ── Landing after a save has to wait for the form to empty ───────────
  //
  // Saving is async, and the form reset that follows it collapses every
  // field the result opened -- the pin picker, the strike description,
  // the spare question. The page gets several hundred pixels SHORTER.
  //
  // Scrolling from inside the click handler therefore measured the tall
  // page, asked for a position that no longer existed once the form
  // emptied, and got silently clamped to whatever the new bottom was.
  // The arithmetic was right and aimed at a layout that was about to
  // stop existing -- which is why this looked like a tuning problem and
  // was not one.
  //
  // So the click only raises a flag, and the scroll happens on the
  // render that installs the fresh form. emptyShot() mints a new id
  // every time, so form.id changing IS "a new blank form is now on
  // screen" -- and it covers an edit being saved as well as a new shot,
  // which a shot count would not.
  const landAfterSave=useRef(false);
  useEffect(()=>{
    if(!landAfterSave.current)return;
    landAfterSave.current=false;
    revealBottomOf(resultCardRef,{cap:true,allowUp:true});
  },[form.id]);


  // Shot Context (game/frame/lane) is meaningless without shots -- a
  // scores-only night has games, not frames.
  //
  // And in a tournament it belongs to the Scoring tab only. It sits
  // beside the tournament card rather than inside it, so without this it
  // appeared under Set up, Brackets and Results as well -- three places
  // where "which frame are you on" is not a question.
  // BOTH ways of logging are always available now.
  //
  // Asking "frame or scores?" up front made a bowler choose before they
  // knew what either gave them, and 38 of 50 league bowlers never found
  // frame tracking at all -- the setting WAS the discovery problem.
  //
  // So game entry sits on top and frame tracking below it, always. A
  // bowler types three scores and leaves, or carries on down the screen
  // and records the frames. No mode, no setting, no wrong choice.
  //
  // Casual is still excluded: open bowling is the mode for not keeping
  // score seriously, and drills have their own screen.
  const showShotContext=leagueReady&&env!=="casual"&&!isDrill
    &&(env!=="tournament"||tournamentTab==="scoring");

  // Whether the fixed bar at the bottom shows.
  //
  // In a tournament it used to be excluded outright, to keep "End Block"
  // off the screen -- the tournament card has its own Save Tournament.
  // But Save Shot lives in the same bar, so every tournament, in every
  // style and format, could pick a result and had no way to save it.
  // The bar now shows in tournament Scoring whenever there is a shot to
  // save, carrying Save Shot alone (the session button stays hidden).
  // Open bowling too, now: it ends like every mode, with End Open Bowling
  // & View Results then Save & Finish Open Bowling on this bar. It has no
  // shot form, so the bar carries only that one button there.
  // Tournament: on Scoring and Match, for End Tournament & View Results
  // (and Save Shot on Scoring). Set up has Start Scoring; Results has its
  // own Save & Finish.
  const footerShown=!!(editingId||(activeBowler&&effectiveSessionLeague
    &&(env!=="tournament"||tournamentTab==="scoring"||tournamentTab==="match")));

  // In BAKER, the name follows the FRAME, not the session.
  //
  // Baker alternates every frame and the alternation carries across
  // games, so the bowler on the shot context was simply whoever the
  // session was filed under -- wrong for half of every game, and wrong
  // for the whole of every second game.
  //
  // We know who started the block, so we know whose frame this is. Null
  // outside Baker, so everything else keeps the session's bowler.
  // Both names, for a Baker heading.
  const bakerTeamName=(()=>{
    // Tournament mode only. The active tournament card stays in memory
    // after the event, so a Baker block made every LEAGUE night read as
    // a Baker night: pair heading, no Nightcap, frames given to a partner.
    if(env!=="tournament")return null;
    if(!activeTournament||!isBaker(activeTournament))return null;
    const me=form.bowler||activeBowler;
    const partner=activeTournament.bakerPartner;
    if(!me||!partner)return null;
    return `${me} & ${partner}`;
  })();

  const bakerBowlerName=(()=>{
    // Tournament mode only. The active tournament card stays in memory
    // after the event, so a Baker block made every LEAGUE night read as
    // a Baker night: pair heading, no Nightcap, frames given to a partner.
    if(env!=="tournament")return null;
    if(!activeTournament||!isBaker(activeTournament))return null;
    const who=bakerBowlerFor(form.game,form.frame,activeTournament.bakerStarter);
    if(!who)return null;
    const me=form.bowler||activeBowler||"Me";
    const partner=activeTournament.bakerPartner||"Partner";
    return who==="me"?me:partner;
  })();


  // The night summary: achievements, the Nightcap, the scores and the
  // running averages, and "Share tonight".
  //
  // A function rather than inline JSX so it can be placed in two spots:
  // after the scoring cards in league, and INSIDE the tournament card on
  // a tournament's Results -- between the finish and winnings and the
  // Tournament Notes, with Save at the very bottom. Rendered inline, it
  // always landed after the whole tournament card, below Save.
  const renderNightSummary=()=>{
              const cs=curSession;
              const sr=cs.shotCount?Math.round((cs.strikes/cs.shotCount)*100):0;
              const spr=cs.spareAttempts?Math.round((cs.sparesMade/cs.spareAttempts)*100):0;
              const leagueAs=leagues.map(league=>({league,avg:rAvg(sessions,activeBowler,league)})).filter(x=>x.avg!=null),cA=cAvg(sessions,activeBowler);
              // Defaulted, not assumed. A session saved by an older version
              // of the app -- or a draft created mid-night -- may not carry
              // these arrays, and calling .filter() on undefined throws
              // during render, which blanks the entire screen. A missing
              // array should cost a chart, not the app.
              const csMisses=Array.isArray(cs.misses)?cs.misses:[];
              const csReleases=Array.isArray(cs.releases)?cs.releases:[];
              const mDist=MISSES.map(m=>({m,c:csMisses.filter(x=>x===m).length})).filter(x=>x.c>0);
              const gR=csReleases.filter(r=>r==="Good").length,bR=csReleases.filter(r=>r==="Bad").length,rT=csReleases.length;
              // Honor scores, personal bests and tournament placement.
              // Above the numbers, because a 300 or a new personal best
              // is the thing a bowler looks for first and the thing
              // they'll actually share.
              const nightAchievements=achievementsFor({
                games:(cs.scores||[]).filter(v=>v!=null),
                seriesTotal:cs.total??null,
                previous:{
                  highGame:profiles?.[cs.bowler]?.allTimeHighGame,
                  highSeries:profiles?.[cs.bowler]?.allTimeHighSeries,
                },
                placementId:cs.placement,
                tournamentName:cs.tournamentName||"",
              });
              // Theoretical scores, computed ONCE for the whole block.
              //
              // They used to live inside the card that displays them, which
              // was fine until the Nightcap needed the same number. Two
              // derivations of one figure on one screen disagree eventually,
              // and the bowler has no way to know which is the real one --
              // so there is one derivation and both readers use it.
              //
              // The games actually bowled, not a fixed three: [1,2,3] is a
              // league assumption, and a practice night can be one game or
              // five. gameScores is already sized to the night.
              const theoreticalScores=gameScores
                .map((_,idx)=>idx+1)
                .map(g=>theoreticalScoreForGame(cs.bowler,cs.league,cs.date,g));
              const anyTheoretical=theoreticalScores.some(v=>v!=null);
              // Theory Total covers the WHOLE series so it lines up directly
              // against the real series. A game with no theoretical value
              // (nothing makeable was missed, or it isn't computable)
              // contributes its real score, since that game genuinely
              // couldn't have gone any better.
              const played=cs.scores
                .map((real,i)=>({real,theory:theoreticalScores[i]}))
                .filter(x=>typeof x.real==="number");
              const theoryTotal=played.reduce((a,x)=>a+(x.theory??x.real),0);
              const realTotal=played.reduce((a,x)=>a+x.real,0);
              const leftOnLane=theoryTotal-realTotal;
              return(
                <>
                {nightAchievements.length>0&&(
                  <div style={{...S.card,border:`1px solid ${C.spare}66`,backgroundColor:C.spare+"0F"}}>
                    {nightAchievements.map(a=>(
                      <div key={a.id} style={{display:"flex",gap:"10px",alignItems:"flex-start",marginBottom:"6px"}}>
                        <span style={{fontSize:"22px",lineHeight:1}}>{a.emoji}</span>
                        <div>
                          <div style={{fontSize:"14px",fontWeight:700,color:C.text}}>{a.title}</div>
                          {a.detail&&<div style={{fontSize:"12px",color:C.textMuted,marginTop:"1px"}}>{a.detail}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* The Nightcap. Top of the results, above the scores.
                    
                    League only. A tournament block is a different shape of
                    night -- blocks, a cut line, a standing -- and the facts
                    below are league facts. A Baker night belongs to the
                    pair rather than to one bowler, the same reason the
                    heading below refuses to call it anybody's night, so it
                    gets no personal read-back either.
                    
                    Results tab only: this block also renders on Side
                    games, where a card about leaves and carry is not what
                    anyone came for.
                    
                    sessionEnded asks whether the night is FILED, not
                    whether the save was confirmed. The confirmation flag
                    is true for a second and a half and then sends the
                    bowler to Home, so a pour triggered by it would arrive
                    on a screen nobody is looking at. A saved session for
                    this bowler, league and date is durable and means the
                    same thing. */}
                {/* League AND tournament now. A tournament block was left
                    out as "a different shape of night", but its frames
                    are read back the same way -- the client tells the
                    server which kind it is, so the wording fits.
                    
                    Baker still gets none: the frames belong to the pair.
                    It says so, rather than the card simply not being
                    there, which read as the feature being missing. */}
                {(env==="league"||env==="tournament")&&onTab("results")&&bakerTeamName&&(
                  <div style={{...S.card,fontSize:"12px",color:C.textMuted,lineHeight:1.5}}>
                    <span style={{fontWeight:600,color:C.text}}>Nightcap</span> isn't poured on a Baker night — the frames belong to the pair, not to one bowler.
                  </div>
                )}
                {(env==="league"||env==="tournament")&&onTab("results")&&!bakerTeamName&&(
                  <Nightcap
                    event={env}
                    shots={shots}
                    bowler={cs.bowler}
                    league={cs.league}
                    date={cs.date}
                    leftHanded={leftHandedForBowler?leftHandedForBowler(cs.bowler):false}
                    scores={cs.scores}
                    priorAverage={cumulativeAvgBeforeDate(sessions,cs.bowler,cs.league,cs.date)}
                    pinsLeftOnLane={anyTheoretical&&played.length?leftOnLane:null}
                    sessionEnded={(sessions||[]).some(s=>s&&s.bowler===cs.bowler&&s.league===cs.league&&s.date===cs.date)}
                    entitlement={entitlement}/>
                )}

                <div style={{...S.card,border:`1px solid ${C.accent}44`}}>
                  {/* Results only, like the scores below it. On Side
                      games the bowler already knows whose night it is and
                      which league they are standing in -- the heading is a
                      recap title on a tab that is not the recap. */}
                  {onTab("results")&&(
                    <div style={{...S.label}}>
                      {/* A BAKER night belongs to the pair, not to one of
                          them. One score for five frames each, so "Ryan's
                          night" over a shared total credits one bowler with
                          both halves -- the same mistake as counting a Baker
                          game as a personal high game, in the heading. */}
                      {bakerTeamName
                        ? `${bakerTeamName} — tonight`
                        : (cs.bowler?`${cs.bowler}'s night`:"Tonight")}
                      {/* The DISPLAY name. A container league's stored name
                          carries the user id -- "Tournament·Tourny 5·c3e40233-
                          c180-4d76-be28-36abd33f9c07" -- and the recap header
                          was printing the whole thing. */}
                      <span style={{fontWeight:400,color:C.textMuted}}> — {practiceLeagueDisplayName(cs.league).replace(" House Shot","")}, {formatDate(cs.date)}</span>
                    </div>
                  )}
                  {/* Results only. This card is shared with Side games,
                      where the game scores are not what you came for: that
                      tab is about what was won and owed, and the bowler
                      just entered these numbers a tab ago. Repeating them
                      above the money pushes the thing being looked for
                      further down the screen. */}
                  {onTab("results")&&(
                    <div style={{display:"flex",gap:"6px",marginBottom:"12px"}}>
                      {cs.scores.map((s,i)=>(<div key={i} style={S.statBox}><div style={{...S.statNum,fontSize:"20px"}}>{s}</div><div style={S.statLbl}>G{i+1}</div></div>))}
                      <div style={{...S.statBox,border:`1px solid ${C.accent}44`}}>
                        <div style={{...S.statNum,fontSize:"20px",color:C.accent}}>{cs.total}</div>
                        <div style={S.statLbl}>Series</div>
                      </div>
                    </div>
                  )}
                  {(()=>{
                    // Results only. "If every makeable spare had been
                    // made" is post-match analysis; Side games is about
                    // what was won and owed.
                    if(!onTab("results"))return null;
                    if(!anyTheoretical)return null;
                    return(
                      <div style={{marginBottom:"12px"}}>
                        <div style={{fontSize:"12px",color:C.textMuted,marginBottom:"6px"}}>If every makeable spare had been made</div>
                        <div style={{display:"flex",gap:"6px"}}>
                          {theoreticalScores.map((v,i)=>(
                            <div key={i} style={{...S.statBox,border:`1px solid ${C.spare}44`}}>
                              <div style={{...S.statNum,fontSize:"18px",color:v!=null?C.spare:C.textMuted}}>{v??"—"}</div>
                              <div style={S.statLbl}>G{i+1} Theory</div>
                            </div>
                          ))}
                          {played.length>0&&(
                            <div style={{...S.statBox,border:`1px solid ${C.spare}`}}>
                              <div style={{...S.statNum,fontSize:"18px",color:C.spare}}>{theoryTotal}</div>
                              <div style={S.statLbl}>Theory Series</div>
                            </div>
                          )}
                        </div>
                        {played.length>0&&(
                          <div style={{textAlign:"center",marginTop:"8px",fontSize:"12px"}}>
                            {leftOnLane>0?(
                              <span style={{color:C.miss,fontWeight:600}}>
                                ▼ {leftOnLane} pins left on the lane
                              </span>
                            ):(
                              <span style={{color:C.strike,fontWeight:600}}>
                                ✓ Converted every makeable spare
                              </span>
                            )}
                            <span style={{color:C.textMuted,fontWeight:400,marginLeft:"6px"}}>
                              ({realTotal} actual vs {theoryTotal} possible)
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {onTab("side")&&anyMoneyGameShown(preferences)&&(
                    <>

                      {/* Buy-ins are per LEAGUE, not per game and not per
                          week: the quarter game costs a quarter every game
                          all season. This used to be nine boxes re-typed
                          every week, which is repetition whose most likely
                          outcome is getting one of them wrong.
                          
                          Editing here updates the rate for this league and
                          applies it to tonight. Past nights keep whatever
                          they actually cost. */}
                      {(()=>{
                        const rates=buyInsForLeague(leagueBuyIns,cs.league);
                        // Games to charge for. Defaults to a FULL night.
                        //
                        // This was the count of scores entered, which is
                        // zero before the first ball -- so every cost came
                        // out [0,0,0], "in this pot" is derived from a
                        // non-zero cost, and the toggle did nothing at all
                        // however many times it was tapped.
                        //
                        // Pots are entered before bowling starts. A bowler
                        // who ticks the quarter game owes it for the night,
                        // and the cost corrects itself as the real games
                        // land.
                        const games=Math.max(
                          (cs.scores||[]).filter(v=>v!=null).length, 3);
                        const pots=visibleMoneyGames(preferences);

                        // Whether the bowler is IN each pot tonight,
                        // derived from what the session already records
                        // rather than stored twice: a non-zero cost means
                        // they entered it.
                        //
                        // Saving a buy-in rate used to mean paying it
                        // every week forever -- the app assumed you were
                        // in every pot every night, so a week you sat one
                        // out silently charged you for it and net
                        // winnings drifted from reality with nothing on
                        // screen to explain why.
                        const costField={pokerQuarter:"pokerQuarterCost",pokerDollar:"pokerDollarCost",
                                         highGame:"highGameCost",threeSixNine:"threeSixNineCost"};
                        const isIn=key=>key==="threeSixNine"
                          ?Number(cs.threeSixNineCost||0)>0
                          :((cs[costField[key]]||[]).some(v=>Number(v)>0));

                        const applyCosts=(nextRates,playing)=>{
                          const arrays=costArraysFor(nextRates,games,playing);
                          Object.entries(arrays).forEach(([field,value])=>{
                            if(Array.isArray(value)){
                              value.forEach((v,i)=>setSessionMoneyArray(cs.id,field,i,v));
                            } else {
                              setSessionMoneyValue(cs.id,field,value);
                            }
                          });
                        };
                        const playingNow=()=>Object.fromEntries(pots.map(k=>[k,isIn(k)]));

                        const setRate=(key,val)=>{
                          const next={...rates,[key]:val===""?0:parseFloat(val)||0};
                          onSaveLeagueBuyIns?.(cs.league,next);
                          // Entering a rate means you're in that pot --
                          // otherwise typing a number would do nothing
                          // visible, which reads as broken.
                          applyCosts(next,{...playingNow(),[key]:true});
                        };
                        const togglePot=key=>applyCosts(rates,{...playingNow(),[key]:!isIn(key)});

                        const label={pokerQuarter:"Quarter game",pokerDollar:"Dollar game",
                                     highGame:"High game",threeSixNine:"3-6-9 (whole night)"};
                        const step={pokerQuarter:"0.25",pokerDollar:"1",highGame:"1",threeSixNine:"1"};

                        const owed=pots.reduce((sum,k)=>{
                          if(!isIn(k))return sum;
                          return sum+(k==="threeSixNine"?rates[k]:rates[k]*games);
                        },0);

                        if(!pots.length)return null;
                        return(
                          <div style={{marginBottom:"12px"}}>
                            <div style={{fontSize:"12px",color:C.textMuted,marginBottom:"6px"}}>Money games tonight</div>
                            <div style={{fontSize:"11px",color:C.textMuted,marginBottom:"8px"}}>
                              Tap the ones you're in. Buy-ins are saved for {String(cs.league||"this league").replace(" House Shot","")} — you won't need to enter them again.
                            </div>
                            {pots.map(key=>{
                              const inIt=isIn(key);
                              return(
                                <div key={key} style={{display:"flex",gap:"8px",alignItems:"center",marginBottom:"6px"}}>
                                  <button onClick={()=>togglePot(key)}
                                    aria-label={`${label[key]}: ${inIt?"playing":"not playing"}`}
                                    style={{flex:1,textAlign:"left",cursor:"pointer",padding:"6px 8px",borderRadius:"8px",
                                      border:`1px solid ${inIt?C.strike+"66":C.border}`,
                                      background:inIt?C.strike+"11":"transparent",
                                      color:inIt?C.text:C.textMuted,fontSize:"12px"}}>
                                    {inIt?"✓ ":""}{label[key]}
                                  </button>
                                  <input style={{...S.input,width:"90px",fontSize:"13px",padding:"6px 10px",textAlign:"right",
                                    opacity:inIt?1:0.45}}
                                    type="number" step={step[key]} placeholder="$"
                                    value={rates[key]===0?"":rates[key]}
                                    onChange={e=>setRate(key,e.target.value)}/>
                                </div>
                              );
                            })}
                            <div style={{fontSize:"11px",color:C.textMuted,marginTop:"6px"}}>
                              {games} game{games===1?"":"s"} tonight · ${owed.toFixed(2)} paid in
                            </div>
                          </div>
                        );
                      })()}


                      <div style={{marginBottom:"12px"}}>
                        <div style={{fontSize:"12px",color:C.textMuted,marginBottom:"6px"}}>Poker Winnings ($)</div>
                        {[0,1,2].map(gameIdx=>{
                          if(cs.scores[gameIdx]==null)return null;
                          const quarterVal=(cs.pokerQuarter||[0,0,0])[gameIdx]??0;
                          const dollarVal=(cs.pokerDollar||[0,0,0])[gameIdx]??0;
                          return(
                            <div key={gameIdx} style={{display:"flex",gap:"8px",alignItems:"center",marginBottom:"6px"}}>
                              <div style={{fontSize:"12px",color:C.textMuted,width:"28px"}}>G{gameIdx+1}</div>
                              <input style={{...S.input,flex:1,fontSize:"13px",padding:"6px 10px"}} type="number" step="0.25" placeholder="Quarter $"
                                value={quarterVal||""} onChange={e=>setPokerWinnings(cs.id,gameIdx,"quarter",e.target.value===""?0:parseFloat(e.target.value))}/>
                              <input style={{...S.input,flex:1,fontSize:"13px",padding:"6px 10px"}} type="number" step="1" placeholder="Dollar $"
                                value={dollarVal||""} onChange={e=>setPokerWinnings(cs.id,gameIdx,"dollar",e.target.value===""?0:parseFloat(e.target.value))}/>
                            </div>
                          );
                        })}
                      </div>

                      <div style={{marginBottom:"12px"}}>
                        <div style={{fontSize:"12px",color:C.textMuted,marginBottom:"6px"}}>High Game Pot ($)</div>
                        <div style={{fontSize:"11px",color:C.textMuted,marginBottom:"6px"}}>
                          Highest game in the league takes it — enter what you won, if anything.
                        </div>
                        {[0,1,2].map(gameIdx=>{
                          if(cs.scores[gameIdx]==null)return null;
                          const val=(cs.highGameWinnings||[0,0,0])[gameIdx]??0;
                          return(
                            <div key={gameIdx} style={{display:"flex",gap:"8px",alignItems:"center",marginBottom:"6px"}}>
                              <div style={{fontSize:"12px",color:C.textMuted,width:"64px"}}>G{gameIdx+1} · {cs.scores[gameIdx]}</div>
                              <input style={{...S.input,flex:1,fontSize:"13px",padding:"6px 10px"}} type="number" step="1" placeholder="Won $"
                                value={val||""} onChange={e=>setSessionMoneyArray(cs.id,"highGameWinnings",gameIdx,e.target.value===""?0:parseFloat(e.target.value))}/>
                            </div>
                          );
                        })}
                      </div>

                      {(()=>{
                        // 3-6-9: a single, whole-session win (all 9 specific
                        // strikes across games 1, 2, AND 3) -- not per-game
                        // like poker, so this only shows once per session, and
                        // only when actually qualified. The jackpot input is
                        // additionally gated on game 3's 10th being a full
                        // turkey, on top of the win itself.
                        const r369=threeSixNineResults(shots,cs.bowler,cs.league,cs.date);
                        if(!r369.qualifies)return null;
                        return(
                          <div style={{marginBottom:"12px"}}>
                            <div style={{fontSize:"12px",color:C.textMuted,marginBottom:"6px"}}>3-6-9 Winnings ($)</div>
                            <div style={{display:"flex",gap:"8px",alignItems:"center",marginBottom:"6px"}}>
                              <div style={{fontSize:"12px",color:C.strike,width:"56px"}}>Pot</div>
                              <input style={{...S.input,flex:1,fontSize:"13px",padding:"6px 10px"}} type="number" step="1" placeholder="$"
                                value={cs.threeSixNineWinnings||""} onChange={e=>setThreeSixNineWinnings(cs.id,"pot",e.target.value===""?0:parseFloat(e.target.value))}/>
                            </div>
                            {r369.jackpotEligible&&(
                              <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
                                <div style={{fontSize:"12px",color:C.spare,width:"56px"}}>Jackpot</div>
                                <input style={{...S.input,flex:1,fontSize:"13px",padding:"6px 10px"}} type="number" step="1" placeholder="$"
                                  value={cs.jackpotWinnings||""} onChange={e=>setThreeSixNineWinnings(cs.id,"jackpot",e.target.value===""?0:parseFloat(e.target.value))}/>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                      {(()=>{
                        const m=sessionMoney(cs);
                        if(!m)return null;
                        // Net leads, matching the Money Games card in
                        // Stats. Won and paid-in are its components, not
                        // three peer figures -- and net is the only one
                        // anyone quotes on the drive home.
                        return(
                          <div style={{marginBottom:"12px"}}>
                            <StatLead
                              value={`$${m.gross.toFixed(2)}`}
                              caption="won tonight" color={C.strike}
                              detail={`$${m.cost.toFixed(2)} paid in — ${m.net>=0?"up":"down"} $${Math.abs(m.net).toFixed(2)} on the night.`}/>
                          </div>
                        );
                      })()}

                      <button style={{...S.btn("primary"),marginBottom:"12px"}} onClick={confirmWinningsSaved}>
                        {winningsSaved?"✓ Winnings Saved":"Save Winnings"}
                      </button>
                    </>
                  )}

                  {/* Results only, with everything else in this card.
                      Side games ends at Save Winnings: what was won and
                      owed, and nothing about how the night was bowled. */}
                  {onTab("results")&&(
                  <div style={{display:"flex",gap:"6px",marginBottom:"12px"}}>
                    <div style={S.statBox}><div style={{...S.statNum,fontSize:"18px",color:C.strike}}>{sr}%</div><div style={S.statLbl}>Strike %</div></div>
                    <div style={S.statBox}><div style={{...S.statNum,fontSize:"18px",color:C.spare}}>{spr}%</div><div style={S.statLbl}>Spare %</div></div>
                    <div style={S.statBox}><div style={{...S.statNum,fontSize:"18px",color:C.miss}}>{cs.tenPinLeaves??(cs.weakTens+cs.ringingTens)}</div><div style={S.statLbl}>10 Pins</div></div>
                  </div>
                  )}
                  {onTab("results")&&(cs.weakTens>0||cs.ringingTens>0||cs.tenPinLeaves>0)&&(
                    <div style={{display:"flex",gap:"6px",marginBottom:"12px"}}>
                      <div style={S.statBox}><div style={{...S.statNum,fontSize:"16px",color:C.miss}}>{cs.weakTens}</div><div style={S.statLbl}>Weak 10s</div></div>
                      <div style={S.statBox}><div style={{...S.statNum,fontSize:"16px",color:C.spare}}>{cs.ringingTens}</div><div style={S.statLbl}>Ringing 10s</div></div>
                      {cs.tenPinLeaves>(cs.weakTens+cs.ringingTens)&&(
                        <div style={S.statBox}><div style={{...S.statNum,fontSize:"16px",color:C.textMuted}}>{cs.tenPinLeaves-cs.weakTens-cs.ringingTens}</div><div style={S.statLbl}>Other 10s</div></div>
                      )}
                    </div>
                  )}
                  {onTab("results")&&cs.splits>0&&(
                    <div style={{display:"flex",gap:"6px",marginBottom:"12px"}}>
                      <div style={S.statBox}><div style={{...S.statNum,fontSize:"16px",color:C.miss}}>{cs.splits}</div><div style={S.statLbl}>Splits</div></div>
                      <div style={S.statBox}><div style={{...S.statNum,fontSize:"16px",color:C.strike}}>{Math.round((cs.splitsConverted/cs.splits)*100)}%</div><div style={S.statLbl}>Converted</div></div>
                    </div>
                  )}
                  {onTab("results")&&(cs.ballsUsed||[]).length>0&&(<div style={{marginBottom:"10px"}}><div style={S.label}>Balls used</div><div style={{display:"flex",flexWrap:"wrap",gap:"6px"}}>{(cs.ballsUsed||[]).map(b=><span key={b} style={S.tag()}>{b}</span>)}</div></div>)}
                  {onTab("results")&&rT>0&&(
                    <div style={{marginBottom:"10px"}}>
                      <div style={S.label}>Release Quality</div>
                      <div style={{display:"flex",gap:"6px"}}>
                        <div style={S.statBox}><div style={{...S.statNum,fontSize:"16px",color:C.strike}}>{rT?Math.round((gR/rT)*100):0}%</div><div style={S.statLbl}>Good</div></div>
                        <div style={S.statBox}><div style={{...S.statNum,fontSize:"16px",color:C.miss}}>{rT?Math.round((bR/rT)*100):0}%</div><div style={S.statLbl}>Bad</div></div>
                      </div>
                    </div>
                  )}
                  {onTab("results")&&mDist.length>0&&(<div style={{marginBottom:"12px"}}><div style={S.label}>Misses</div><div style={{display:"flex",flexWrap:"wrap",gap:"6px"}}>{mDist.map(x=><span key={x.m} style={S.tag(C.miss)}>{x.m}: {x.c}</span>)}</div></div>)}
                  {/* Results only. Running averages and "Share tonight"
                      are the recap; Side games ends at Save Winnings. */}
                  {onTab("results")&&(
                  <>
                  {/* League figures, so not on a tournament's Results -- a
                      tournament night is not a league night, and showing
                      league averages there read as if it were. */}
                  {env!=="tournament"&&(<>
                  <div style={S.divider}/>
                  <div style={S.label}>Running Averages</div>
                  <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
                    {leagueAs.map(({league,avg})=><div key={league} style={S.statBox}><div style={{...S.statNum,fontSize:"18px"}}>{avg}</div><div style={S.statLbl}>{league.replace(" House Shot","")}</div></div>)}
                    {cA&&<div style={{...S.statBox,border:`1px solid ${C.accent}44`}}><div style={{...S.statNum,fontSize:"18px",color:C.accent}}>{cA}</div><div style={S.statLbl}>Composite</div></div>}
                  </div>
                  </>)}
                  {/* Share sits with the summary because that's the moment
                      someone wants to send it -- not buried in a menu. */}
                  <div style={{marginTop:"14px"}}>
                    <ShareButton label="Share tonight" summary={{
                      bowler:cs.bowler||activeBowler,
                      // Badges are the active bowler's; a teammate's night
                      // logged on this phone gets none rather than theirs.
                      earned:(!cs.bowler||cs.bowler===activeBowler)?(badgesEarnedOnNight?.(cs.date,"league")||[]):[],
                      scores:cs.scores,
                      league:cs.league,
                      date:formatDate(cs.date),
                      environment:"league",
                      // Real achievements, not raw rates -- see
                      // sessionHighlights. A goal you hit or money you won
                      // is what someone actually wants to post; "48%
                      // strikes" helps nobody.
                      // These are DERIVED at share time from data that
                      // exists, not read from fields on the session -- an
                      // earlier version read cs.moneyWon, cs.goalsHit and
                      // cs.priorBest, none of which were ever written, so
                      // the card silently never showed money or goals.
                      highlights:sessionHighlights({
                        scores:cs.scores,
                        strikes:cs.strikes,shotCount:cs.shotCount,
                        sparesMade:cs.sparesMade,spareAttempts:cs.spareAttempts,
                        // Money: net winnings on the night, from the same
                        // calculation the Money Games card uses.
                        moneyWon:Math.max(0,sessionMoney(cs)?.net||0),
                        // Personal best: the best series BEFORE tonight, so
                        // tonight can be compared against it.
                        priorBest:(()=>{
                          const others=sessions.filter(s=>s.bowler===cs.bowler&&s.id!==cs.id&&Array.isArray(s.scores)&&s.scores.length>1);
                          return others.length?Math.max(...others.map(s=>s.total||s.scores.reduce((a,b)=>a+b,0))):null;
                        })(),
                        // Average before tonight, competitive only.
                        priorAverage:cAvg(sessions.filter(s=>s.id!==cs.id),cs.bowler,null),
                        environment:"league",
                      }),
                    }}/>
                  </div>
                  </>
                  )}
                </div>
                </>
              );
            };

  return (
    <>
          <>
            {/* While the guided prompt is up it's the ONLY thing on the
                tab, vertically centred between header and nav. Showing
                eleven cards behind a question nobody has answered yet is
                what made this screen overwhelming. */}
            {/* The "Bowling today?" card is gone from here.
                
                It asked which mode you are in -- and Home now asks that
                with four tinted rows, which is where the question
                belongs: you answer it once, on the way in. Asking again
                on arrival made it the first thing on the screen you had
                just been sent to.
                
                showSessionStart still gates the blocks below, because
                "has a mode been chosen" is still the right question for
                what the scoring screen shows. Only the card is gone. */}


            {/* Once answered the card COLLAPSES rather than disappearing.
                Removing it entirely meant changing your mind -- wrong
                environment, or you decided to log shot by shot after all
                -- meant a trip to Settings. Collapsed, the answers stay
            {/* The collapsed mode-changer is gone too.
                
                It existed so changing your mind did not mean a trip to
                Settings. Going back Home does that now -- the four modes
                are there, one tap each, and the back arrow in the header
                is one tap away. A permanent card on every scoring screen
                to cover a rare change of mind was a poor trade for the
                space it took at the top of the night. */}




            {/* Everything below waits for the prompt to be answered. */}
            {/* Everything below used to be hidden while the "Bowling
                today?" card was up, so the card had the screen to itself.
                
                That card is gone -- Home asks the question now -- but the
                gate stayed, and it was hiding the league tabs and the
                game-score entry on any night the prompt would have
                fired. The card it deferred to no longer exists, so
                deferring to it is just a blank screen. */}
            {(<>

            {/* League tabs, restored.
                
                They were lost with the "Bowling today?" block they sat
                inside -- removing that card took the strip with it, so
                league lost Set up, Scoring, Side games and Results in one
                go while tournaments kept theirs.
                
                The tab is DERIVED, not stored: with no league chosen it
                forces Set up, because every other tab is about a night
                that does not exist yet. */}
            {leagueTabs&&!editingId&&(
              <div style={{...S.card,padding:"10px 12px"}}>
                <div style={{...S.chips,flexWrap:"nowrap",gap:"4px",marginBottom:0}}>
                  {[["setup","Set up"],["scoring","Scoring"],
                    ["side","Side games"],["results","Results"]].map(([id,label])=>(
                    <Chip key={id} label={label} dense fill
                      selected={leagueTab===id}
                      onToggle={()=>setLeagueTab(id)} />
                  ))}
                </div>
              </div>
            )}

            {/* Open bowling's tabs, like practice's: somewhere to bowl and
                somewhere to look back at the night before it is saved. */}
            {!editingId&&preferences.environment==="casual"&&effectiveSessionLeague&&(
              <div style={{...S.card,padding:"10px 12px"}}>
                <div style={{...S.chips,marginBottom:0}}>
                  <Chip label="Scoring" selected={casualTab!=="results"} onToggle={()=>setCasualTab("scoring")}/>
                  <Chip label="Results" selected={casualTab==="results"} onToggle={()=>{setCasualResultsShown(true);setCasualTab("results");}}/>
                </div>
              </div>
            )}

            {!editingId&&activeBowler&&preferences.environment==="practice"&&(
              <div style={{...S.card,padding:"10px 12px"}}>
                <div style={S.chips}>
                  <Chip label="Games" selected={practiceMode==="games"} onToggle={()=>setPracticeMode("games")}/>
                  <Chip label="Drill" selected={practiceMode==="drill"} onToggle={()=>{setPracticeMode("drill");if(!activeDrill)startDrill();}}/>
                  {/* Results, so practice has somewhere to look back at.
                      
                      Games and Drill were both places to DO something and
                      neither had a place to see how it went -- the only
                      way to read a practice was to end it and hope the
                      recap covered it. */}
                  <Chip label="Results" selected={practiceMode==="results"}
                    onToggle={()=>setPracticeMode("results")} />
                </div>
                {/* Tracking depth for THIS practice only. It changes what the
                    Log tab shows tonight and nothing in Settings, so a
                    scores-only practice can't quietly turn a league night
                    into scores-only too. */}
                {/* The "tracking tonight" question is gone.
                    
                    It asked frame or scores-only for this practice. Both
                    are always available now -- game entry on top, frames
                    below -- so the question had nothing left to switch
                    and the answer changed nothing on screen. */}

              </div>
            )}

            {!editingId&&activeBowler&&(preferences.environment==="practice"||preferences.environment==="casual")&&(
              <div style={{...S.card,padding:"10px 12px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{...S.label,marginBottom:0}}>
                    {preferences.environment==="practice"?"Practice":"Bowling"}
                  </div>
                  <input style={{...S.input,width:"auto",fontSize:"12px",padding:"4px 8px"}} type="date"
                    value={sessionDate} onChange={e=>setSessionDate(e.target.value)}/>
                </div>
              </div>
            )}

            {/* The date card leads practice.
                
                It was gated on the setup tab, and practice has no setup
                tab any more -- so the one card telling a bowler WHICH
                night they are logging never rendered there at all.
                
                Above the scores, because which night it is has to be
                settled before the numbers mean anything. */}
            {(onTab("setup")||env==="practice")&&!editingId&&activeBowler&&preferences.environment!=="tournament"&&preferences.environment!=="practice"&&preferences.environment!=="casual"&&(
              <CollapsibleCard
                title="Tonight's Session"
                summary={sessionLeague?`${sessionLeague.replace(" House Shot","")} · ${formatDate(sessionDate)}`:""}
                expanded={expandedSections.tonightSession}
                onToggle={()=>toggleSection("tonightSession")}>
                <div style={S.chips}>
                  {leagues.map(l=>(
                    <Chip key={l} label={l.replace(" House Shot","")} selected={sessionLeague===l}
                      onToggle={()=>{const team=teams.find(t=>t.league===l&&(t.members||[]).includes(activeBowler));setSessionLeague(l);setForm(f=>({...f,league:l,teamId:team?.id||"",date:sessionDate}));}}/>
                  ))}
                </div>
                <div style={{marginBottom:"10px"}}>
                  <input style={S.input} type="date" value={sessionDate}
                    onChange={e=>{setSessionDate(e.target.value);set("date",e.target.value);}}/>
                </div>

                {/* Prebowling: games thrown early that count for a future
                    week -- often on the same night as the current week's
                    session, before or after it.
                    
                    Filed under the date they COUNT FOR, not the date
                    thrown. That's correct for standings, and it's what
                    keeps them from colliding: sessions are keyed on
                    (bowler, league, date), so a prebowl filed under today
                    would share a key with tonight's real session and one
                    would silently overwrite the other. */}
                {preferences.environment==="league"&&sessionLeague&&(()=>{
                  const bowledOn=localDateString();
                  const isPrebowl=sessionDate>bowledOn;
                  const conflict=isPrebowl
                    ?prebowlConflict(sessions,activeBowler,effectiveSessionLeague,sessionDate,bowledOn)
                    :"";
                  const leagueDay=inferLeagueDay(
                    (sessions||[]).filter(s=>s.bowler===activeBowler),effectiveSessionLeague);
                  return(
                    <div style={{marginBottom:"10px"}}>
                      <button
                        onClick={()=>{
                          if(isPrebowl){
                            setSessionDate(bowledOn);set("date",bowledOn);
                          }else{
                            const next=nextLeagueDate(bowledOn,leagueDay)
                              ||nextLeagueDate(bowledOn,new Date(`${bowledOn}T00:00:00`).getDay());
                            setSessionDate(next);set("date",next);
                          }
                          
                        }}
                        style={{width:"100%",textAlign:"left",cursor:"pointer",
                          padding:"8px 10px",borderRadius:"8px",fontSize:"12px",
                          border:`1px solid ${isPrebowl?C.accent:C.border}`,
                          background:isPrebowl?C.accent+"11":"transparent",
                          color:isPrebowl?C.text:C.textMuted}}>
                        {isPrebowl?"✓ Prebowling":"Prebowling for a future week?"}
                      </button>
                      {isPrebowl&&(
                        <div style={{fontSize:"11px",color:conflict?C.miss:C.textMuted,marginTop:"4px",lineHeight:1.4}}>
                          {conflict||`Counts for ${formatDate(sessionDate)}. Bowled today — change the date above if that's the wrong week.`}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Opponent & handicap — moved here from Stats, since this is
                    known before bowling starts and belongs with the rest of
                    tonight's setup. Keyed by team when one resolves (so two
                    teams sharing a league on the same night get separate
                    records); falls back to the league name itself when the
                    active bowler isn't yet set up as a team member, so this
                    still works before Teams is fully configured. */}
                {sessionLeague&&(()=>{
                  const matchKey=form.teamId||sessionLeague;
                  const m=getMatch(matchKey,sessionDate,sessionLeague)||{opponent:"",handicap:""};
                  const handicap=matchHandicap(m);
                  return(
                    <div style={{marginBottom:"12px"}}>
                      <div style={S.label}>Opponent</div>
                      <div style={S.row}>
                        <input style={{...S.input,flex:2}} placeholder="Opponent (e.g. Team Name)"
                          value={m.opponent||""} onChange={e=>setMatchOpponent(matchKey,sessionLeague,sessionDate,e.target.value)}/>
                        <input style={{...S.input,flex:1,textAlign:"center"}} type="number" placeholder="Handicap"
                          value={handicap} onChange={e=>setMatchHandicap(matchKey,sessionLeague,sessionDate,e.target.value)}/>
                      </div>
                    </div>
                  );
                })()}

                {/* Starting lane */}
                <div style={{marginBottom:"12px"}}>
                  <div style={S.label}>Starting Lane</div>
                  <div style={S.row}>
                    <input style={{...S.input,flex:1,textAlign:"center",fontSize:"18px",fontWeight:700}}
                      type="text" inputMode="numeric" pattern="[0-9]*" maxLength={3}
                      placeholder="e.g. 8" value={startingLane}
                      onChange={e=>setStartingLane(laneDigits(e.target.value))}/>
                    {startingLane&&(()=>{
                      const l=parseInt(startingLane),p=l%2===0?l-1:l+1;
                      return(
                        <div style={{flex:2,backgroundColor:C.surface,borderRadius:"8px",padding:"8px 12px",border:`1px solid ${C.border}`}}>
                          <div style={{fontSize:"13px",fontWeight:600,color:C.accent}}>Lanes {Math.min(l,p)} & {Math.max(l,p)}</div>
                          <div style={{fontSize:"10px",color:C.textMuted,marginTop:"2px"}}>
                            G1F1→{startingLane} · G1F10→{calcLane(startingLane,1,10)||"?"} · G2F1→{calcLane(startingLane,2,1)||"?"}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Lane conditions (oil pattern) — one entry per physical lane in
                    tonight's pair, since leagues sometimes run a different
                    pattern on each lane of the pair. Defaults to House Shot
                    implicitly; no record exists until something is changed. */}
                {sessionLeague&&(()=>{
                  // NO LONGER GATED ON THE STARTING LANE.
                  //
                  // Knowing what you are bowling on does not require
                  // knowing which pair you drew, but this section only
                  // appeared once a lane had been typed -- so "what is
                  // tonight's pattern" was invisible to anyone who had not
                  // filled in a field that has nothing to do with it.
                  //
                  // With no lane yet there is one row for the night; with
                  // a lane there is one per physical lane, because leagues
                  // do sometimes run a different pattern on each lane of
                  // the pair. The night-level record is stored under lane
                  // "" and the per-lane rows FALL BACK to it, so a pattern
                  // entered before lanes are known is not lost the moment
                  // one is: it shows on both lanes until one of them is
                  // deliberately changed.
                  const l=parseInt(startingLane),p=l%2===0?l-1:l+1;
                  const lanesToShow=startingLane
                    ?[...new Set([l,p])].filter(n=>!isNaN(n))
                    :[""];
                  // What the league usually runs, so "override" is a
                  // visible act rather than typing into a blank box and
                  // hoping. Absent when the league has no default set.
                  const leagueUsual=(leaguePatterns?.[effectiveSessionLeague]
                    ||leaguePatterns?.[sessionLeague]||"").trim();
                  const renderLaneRow=(lane)=>{
                    const nightly=getLanePattern(sessionLeague,sessionDate,"");
                    const rec=getLanePattern(sessionLeague,sessionDate,lane)
                      ||(lane!==""?nightly:null)
                      ||{patternType:"house",patternName:"",length:"",volume:"",ratio:""};
                    const isOfficial=rec.patternType==="official";
                    return(
                      <div key={lane} style={{marginBottom:"10px"}}>
                        <div style={{fontSize:"11px",color:C.textMuted,marginBottom:"4px"}}>
                          {lane===""?"Tonight":`Lane ${lane}`}
                        </div>
                        <div style={S.chips}>
                          <Chip label="House Shot" selected={!isOfficial} onToggle={()=>setLanePattern(form.teamId||sessionLeague,sessionLeague,sessionDate,lane,{patternType:"house"})}/>
                          <Chip label="Official Pattern" selected={isOfficial} onToggle={()=>setLanePattern(form.teamId||sessionLeague,sessionLeague,sessionDate,lane,{patternType:"official"})} color={C.spare}/>
                        </div>
                        {isOfficial&&(
                          <div style={{marginTop:"6px"}}>
                            {/* Picking a known pattern brings its specs
                                with it. Length, volume and ratio are
                                properties OF the pattern, so asking a
                                bowler to copy three numbers off the sheet
                                on the wall was work the catalogue could
                                already do. Typed-in names still save --
                                the list accelerates, it does not gate. */}
                            <div style={{marginBottom:"6px"}}>
                              <OilPatternPicker
                                value={rec.patternName}
                                patterns={oilPatterns}
                                placeholder={`Pattern name (e.g. ${EXAMPLE_PATTERN})`}
                                onChange={(name,picked)=>setLanePattern(
                                  form.teamId||sessionLeague,sessionLeague,sessionDate,lane,
                                  picked
                                    ? {patternName:name,
                                       length:picked.lengthFeet!=null?String(picked.lengthFeet):rec.length,
                                       volume:picked.volumeMl!=null?String(picked.volumeMl):rec.volume,
                                       ratio:picked.ratio||rec.ratio}
                                    : {patternName:name})}/>
                            </div>
                            <div style={S.row}>
                              <input style={{...S.input,flex:1}} type="number" placeholder="Length (ft)"
                                value={rec.length} onChange={e=>setLanePattern(form.teamId||sessionLeague,sessionLeague,sessionDate,lane,{length:e.target.value})}/>
                              <input style={{...S.input,flex:1}} type="number" placeholder="Volume (mL)"
                                value={rec.volume} onChange={e=>setLanePattern(form.teamId||sessionLeague,sessionLeague,sessionDate,lane,{volume:e.target.value})}/>
                              <input style={{...S.input,flex:1}} placeholder="Ratio (e.g. 3:1)"
                                value={rec.ratio} onChange={e=>setLanePattern(form.teamId||sessionLeague,sessionLeague,sessionDate,lane,{ratio:e.target.value})}/>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  };
                  return(
                    <div style={{marginBottom:"12px"}}>
                      <div style={S.label}>Lane Conditions</div>
                      {leagueUsual&&(
                        <div style={{fontSize:"11px",color:C.textMuted,marginBottom:"6px",lineHeight:1.5}}>
                          This league usually runs <strong>{leagueUsual}</strong>. Anything you set
                          here is for tonight only.
                        </div>
                      )}
                      {lanesToShow.map(renderLaneRow)}
                    </div>
                  );
                })()}

                {sessionLeague&&(
                  <>
                    {/* Points won — moved here from Stats' Log Match Results,
                        since you naturally mark these as the night wraps up. */}
                    {sessionLeague&&(()=>{
                      const matchKey=form.teamId||sessionLeague;
                      const m=getMatch(matchKey,sessionDate,sessionLeague)||{games:[null,null,null],series:null};
                      const pointsWon=m.games.filter(v=>v===true).length+(m.series===true?1:0);
                      const pointsMarked=m.games.filter(v=>v!==null).length+(m.series!==null?1:0);
                      const resultChip=(val,onTap,label)=>(
                        <button key={label} onClick={onTap} style={{
                          padding:"6px 10px",borderRadius:"8px",border:`1px solid ${val===true?C.strike:val===false?C.miss:C.border}`,
                          backgroundColor:val===true?C.strike+"22":val===false?C.miss+"22":"transparent",
                          color:val===true?C.strike:val===false?C.miss:C.textMuted,
                          fontSize:"12px",fontWeight:600,cursor:"pointer",WebkitTapHighlightColor:"transparent",
                        }}>{label}{val===true?" ✓":val===false?" ✗":""}</button>
                      );
                      return(
                        <div style={{marginBottom:"10px"}}>
                          <div style={S.label}>Points Won</div>
                          <div style={{fontSize:"11px",color:C.textMuted,marginBottom:"8px"}}>4 points per night — 1 per game, 1 for total pinfall. Tap to cycle: not marked → won → lost.</div>
                          <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"6px"}}>
                            {[0,1,2].map(idx=>resultChip(m.games[idx]??null,()=>cycleGameResult(matchKey,sessionLeague,sessionDate,idx),`G${idx+1}`))}
                            {resultChip(m.series??null,()=>cycleSeriesResult(matchKey,sessionLeague,sessionDate),"Pinfall")}
                          </div>
                          {pointsMarked>0&&(
                            <div style={{fontSize:"12px",fontWeight:600,color:C.accent}}>{pointsWon} of 4 points</div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Into Scoring, from where the setting-up ends.
                      
                        Set up is a checklist -- league, date, lane,
                        pattern -- and finishing it leaves you at the
                        bottom of a card with the next step a scroll back
                        up to a chip you have to know to look for. This is
                        the same navigation, put where the work actually
                        finishes.
                      
                        Not a "start": nothing is created or saved by
                        pressing it, so leaving Set up and coming back
                        costs nothing. */}
                    <button
                      style={{...S.btn("primary"),marginTop:"4px"}}
                      onClick={()=>{
                        setLeagueTabChoice("scoring");
                        // The tab content above changes, so the useful
                        // place to be is the top of it, not the bottom of
                        // the card that was just left.
                        try{window.scrollTo({top:0,behavior:"smooth"});}catch{}
                      }}>
                      Start Scoring
                    </button>

                    {/* Cancel sits HERE, in Set up, not at the bottom of
                        the page.
                      
                        It was after the sticky footer -- last in the
                        document, underneath a bar that is always on
                        screen -- so on a phone it was covered by the
                        footer and effectively invisible. Set up is also
                        where it belongs: it is where the night is
                        configured, so it is where you go to decide the
                        night should not exist.
                      
                        Asks twice: this deletes tonight's shots and typed
                        scores and none of it comes back. Quiet styling on
                        purpose -- it sits under the button most people
                        actually want. */}
                    {typeof cancelSession==="function"&&(
                      <div style={{marginTop:"10px"}}>
                        {!cancelArmed?(
                          <button
                            style={{background:"none",border:"none",color:C.textMuted,cursor:"pointer",
                                    fontSize:"13px",padding:"8px",width:"100%",
                                    WebkitTapHighlightColor:"transparent"}}
                            onClick={()=>{
                              setCancelArmed(true);
                              // After the card exists, not before: it is
                              // rendered by this very state change.
                              revealBottomOf(cancelRef,{cap:true,allowUp:true});
                            }}>
                            Cancel League
                          </button>
                        ):(
                          <div ref={cancelRef} style={{...S.card,padding:"12px",marginBottom:0}}>
                            <div style={{fontSize:"13px",color:C.text,lineHeight:1.5,marginBottom:"10px"}}>
                              This deletes tonight's shots, game scores and match points for{" "}
                              <strong>{form.bowler||activeBowler}</strong> in{" "}
                              <strong>{(sessionLeague||"").replace(" House Shot","")}</strong>, clears
                              the setup, and takes you back to Home. This cannot be undone.
                            </div>
                            <div style={{display:"flex",gap:"8px"}}>
                              <button style={{...S.btn(),flex:1}} onClick={()=>setCancelArmed(false)}>
                                Keep bowling
                              </button>
                              <button style={{...S.btn("warn"),flex:1}}
                                onClick={()=>{ setCancelArmed(false); cancelSession(); }}>
                                Delete and exit
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Save moved to the bottom of Enter Game Scores.

                         It sat here, in Tonight's SETUP -- above the card
                         where the scores are actually typed. You finished
                         the third game and then scrolled back up past the
                         entry fields to save. The action belongs where the
                         work ends. */}
                  </>
                )}
              </CollapsibleCard>
            )}


            {/* Game scores FIRST, directly under the chips.
                
                This sat below the shot form, so a bowler whose night is
                three numbers had to scroll past every frame-tracking
                control to reach the only thing they came to do. The
                order now matches what the note above the frame section
                says: type your scores here, go further down if you want
                the detail. */}
            {onTab("scoring")&&!editingId&&activeBowler&&effectiveSessionLeague&&preferences.environment!=="casual"&&preferences.environment!=="tournament"&&!(preferences.environment==="practice"&&practiceMode==="drill")&&(()=>{
              // How many game rows to show.
              //
              // Was hardcoded to 3, which is right for a league night and
              // wrong for practice -- people bowl one game, or five, or
              // stop after two. Derived from what's actually been entered
              // so it grows with real data, with a floor of 1 rather than
              // three empty boxes on a fresh session.
              //
              // League and tournament keep a floor of 3, because a
              // standard night IS three games and pre-showing them saves
              // two taps.
              const standardGames=preferences.environment==="practice"||preferences.environment==="casual"?1:3;
              const highestEntered=[1,2,3,4,5,6,7,8,9,10].reduce((hi,g)=>
                getManualScore(manualScores,activeBowler,effectiveSessionLeague,sessionDate,g)!=null?g:hi,0);
              // Games bowled frame by frame count too.
              //
              // This card only ever looked at TYPED scores, so a fourth
              // game bowled in frame tracking had a score, appeared in
              // the series total and on the scoresheet -- and had no row
              // here. The card that is supposed to list the night's games
              // was the one place the game did not exist, and adding it
              // by hand with "+ Add game" was the only way to see it.
              //
              // frameScores is already the right length: BowlingTracker
              // grows it from the shots. It just was not being asked.
              //
              // Capped at 12 to match the ceiling upstream, so a bad
              // game number in imported data cannot render a hundred
              // rows.
              const highestBowled=frameScores.reduce(
                (hi,v,i)=>(v!=null&&i+1<=12?i+1:hi),0);
              const gameCount=Math.min(12,
                Math.max(standardGames,highestEntered,highestBowled,extraGames));
              const gameNums=Array.from({length:gameCount},(_,i)=>i+1);
              const entered=gameNums.map(g=>getManualScore(manualScores,activeBowler,effectiveSessionLeague,sessionDate,g));

              // The series counts what each game is WORTH, not what was
              // typed.
              //
              // This summed `entered` -- manual scores only -- so a night
              // bowled frame by frame showed every game's score sitting
              // in its own box and then no series and no average
              // underneath them, with the collapsed card's summary blank
              // too. The numbers were on screen and refused to add up,
              // which reads as the app being broken rather than as a
              // missing feature.
              //
              // resolveGameScore is the same rule the boxes above already
              // display and the same one the rest of the app scores a
              // night by: a typed score wins where there is one, frames
              // fill in the rest. Anything else lets the card disagree
              // with itself.
              const resolved=gameNums.map(g=>
                resolveGameScore(manualScores,activeBowler,effectiveSessionLeague,
                                 sessionDate,g,frameScores[g-1]??null));
              const total=seriesTotal(resolved);
              const scoredGames=resolved.filter(v=>typeof v==="number").length;
              // The card is defaulted OPEN in BowlingTracker's
              // expandedSections. Reaching it means a league is chosen and
              // the bowler is here to enter scores -- a closed card is one
              // more tap between them and the thing they opened the app to
              // do. Collapsing it by hand still sticks.
              return(
                <CollapsibleCard
                  title="Enter Game Scores"
                  summary={total!=null?`${total} series`:""}
                  expanded={env==="practice"
                    ? expandedSections.manualScores===true
                    : expandedSections.manualScores!==false}

                  onToggle={()=>toggleSection("manualScores")}>
                  {/* Which bag, asked ONCE rather than per game.

                      Only when there is a choice to make: with one bag it
                      is already the answer, and with none every ball is
                      offered. */}
                  {envBags.length>1&&(
                    <div style={{marginBottom:"10px"}}>
                      <div style={{...S.label,marginBottom:"4px"}}>Which bag tonight?</div>
                      <select style={{...S.sel,width:"100%"}}
                        value={selectedBagId||""}
                        onChange={e=>setSelectedBagId(e.target.value)}>
                        <option value="">All my balls</option>
                        {envBags.map(bag=>(<option key={bag.id} value={bag.id}>{bag.name}</option>))}
                      </select>
                    </div>
                  )}
                  {/* The explanatory paragraph is gone.

                      It said the series total adds itself (visible), that
                      this is for people not logging shot by shot (they
                      chose that mode), that manual entry wins over shot
                      data (true, and irrelevant until it happens), and
                      what noting a ball is for. Four sentences of
                      instruction above three number fields. */}
                  {/* Round 7, finding 7.
 
                      Removing the old four-sentence paragraph was right, but
                      it was the only place explaining that noting a ball
                      attributes the WHOLE game to it. Nobody could work out
                      how to record a ball change mid-game, and the answer --
                      shot-by-shot -- was nowhere on the screen.
 
                      One line, and only when a ball can actually be chosen. */}
                  {/* Shown only when there is a derived score to protect.
                      
                      Was keyed to shot mode, which no longer exists. The
                      honest condition is whether any game actually has
                      frames -- with no frames there is nothing to
                      override, and the control would be pure friction. */}
                  {/* The lock notice and its "Switch to game scores"
                      button are gone.
                      
                      Both ways of logging are always available now, so
                      there is no mode to switch to -- the control offered
                      a journey to where the bowler already was. The lock
                      itself stays: a game with frames still computes its
                      own score. */}
                  {gameNums.map(g=>{
                    // Per-game ball is offered EVERYWHERE now, not only in
                    // practice. Lane transition is exactly as real on a
                    // league night: the same ball can average 210 in game
                    // one and 190 in game three, and recording which ball
                    // bowled which game is what makes that visible in
                    // Trends without shot-by-shot logging.
                    const isPracticeGames=preferences.environment!=="casual";
                    const arsenal=(arsenals?.[activeBowler]||[]);
                    const equip=isPracticeGames?getGameEquipment(gameEquipment,activeBowler,effectiveSessionLeague,sessionDate,g):null;
                    // One real ball means no choice to make -- it's pre-filled.
                    // Plastic never defaults but is always offered.
                    const defaultBall=defaultPracticeBall(arsenal,PLASTIC_BALL);
                    const shownBall=equip?(equip.ball||defaultBall):"";
                    // Plastic is always offered -- it is a spare ball, not
                    // part of a bag -- and a ball already recorded stays
                    // listed even if it has since left the bag, so an old
                    // game never loses what it was bowled with.
                    const gameBalls=plasticLast([...new Set([
                      ...(logBalls||[]),
                      ...(arsenal.includes(PLASTIC_BALL)?[PLASTIC_BALL]:[]),
                      ...(shownBall?[shownBall]:[]),
                    ])],PLASTIC_BALL);
                    return(
                    // ── One row per game ──────────────────────────────
                    //
                    // This was two stacked rows -- G-label and score, then
                    // ball and surface indented 36px underneath -- so a
                    // three-game night cost six rows plus the gaps between
                    // them, and most of the card was the empty right-hand
                    // half of the score row.
                    //
                    // Everything about one game now sits on one line, and
                    // the line wraps instead of being cut: the two
                    // dropdowns are `flex: 1 1 104px`, so where there is
                    // room they share the space left over, and on a narrow
                    // phone they drop to a second line as a PAIR rather
                    // than squeezing to nothing. No breakpoint to pick and
                    // nothing to keep in step with a stylesheet -- the row
                    // measures itself.
                    <div key={g} style={{marginBottom:isPracticeGames?"8px":"6px"}}>
                      <div style={{display:"flex",flexWrap:"wrap",gap:"6px",
                        alignItems:"center",marginBottom:0}}>
                        <div style={{fontSize:"12px",color:C.textMuted,
                          width:"22px",flexShrink:0}}>G{g}</div>
                        {(()=>{
                          // Locked only when THIS game has frames logged.
                          //
                          // The condition used to be "tracking mode is
                          // shot", which no longer exists -- both ways of
                          // logging are always available now, so keying
                          // the lock to a mode would have disabled score
                          // entry for everyone.
                          //
                          // The real rule is narrower and always was: a
                          // game whose frames are recorded has a computed
                          // score, and letting someone type a different
                          // one leaves two answers for the same game.
                          // Games with no frames stay typable.
                          // A game whose frames are logged computes its own score, so
                          // typing a different one would leave two answers for
                          // one game. The unlock escape hatch went with the
                          // "switch to game scores" control -- nothing could set
                          // it any more, so the flag was always false and this
                          // read as a live choice that was not one.
                          // LOCKED BY FRAMES, not by "has a number in it".
                          //
                          // This read gameScores, which is the RESOLVED
                          // score -- and a manual entry wins there. So the
                          // first digit typed produced a manual score, the
                          // box turned disabled, and a disabled input drops
                          // focus: the keyboard closed, the remaining
                          // digits went nowhere, and the game could never
                          // be edited again. "150" was unreachable; you got
                          // "1" and a dead box.
                          //
                          // A manual score never locks. It is the thing the
                          // bowler is allowed to change, and being able to
                          // CLEAR it is what lets frames take the game over
                          // -- which was impossible while the box was
                          // disabled.
                          const frameScore=frameScores[g-1];
                          const manualScore=entered[g-1];
                          const locked=frameScore!=null&&manualScore==null;
                          return(
                            // Fixed width, not flex:1. A score is three
                            // digits; letting it take every spare pixel
                            // is what made the row look half empty, and
                            // it is now the dropdowns that absorb the
                            // slack.
                            <input style={{...S.input,...smallInput,
                              width:"72px",flexShrink:0,textAlign:"center",
                              opacity:locked?0.5:1}}
                              type="number" inputMode="numeric" placeholder="Score"
                              aria-label={`Game ${g} score`}
                              disabled={locked}
                              // Show the frame-derived score when there is one.
                              //
                              // The box locked as soon as a game had frames but
                              // kept showing the MANUAL value, which is empty --
                              // so bowling a full game frame by frame left G1
                              // blank and uneditable. The score existed; it just
                              // had nowhere to appear.
                              //
                              // Manual entry still wins where no frames exist,
                              // which is the whole point of having both.
                              // Shows what is actually USED, so the box
                              // never disagrees with the series total.
                              // resolveGameScore prefers the manual score,
                              // so this does too.
                              value={manualScore!=null
                                ? String(manualScore)
                                : (frameScore==null?"":String(frameScore))}
                              onChange={e=>updateManualScore(activeBowler,effectiveSessionLeague,sessionDate,g,e.target.value)}/>
                          );
                        })()}
                        {/* Delete this game -- the typed score AND the
                            frames behind it. Clearing the box alone left
                            the shots, so the game came straight back.
                          
                            Only offered when there is something to
                            delete, so an empty row is not decorated with
                            a destructive control. */}
                        {typeof deleteGame==="function"
                          &&(entered[g-1]!=null||frameScores[g-1]!=null)?(
                          <button
                            aria-label={`Delete game ${g}`}
                            onClick={()=>setGameToDelete(gameToDelete===g?null:g)}
                            style={{background:"none",border:"none",cursor:"pointer",
                                    color:gameToDelete===g?C.miss:C.textMuted,
                                    fontSize:"16px",width:"24px",flexShrink:0,
                                    padding:0,lineHeight:1,
                                    WebkitTapHighlightColor:"transparent"}}>
                            ×
                          </button>
                        ):(
                          // An empty game has nothing to delete, but the
                          // column still has to be there or the dropdowns
                          // on that row start 24px further left than the
                          // ones above them -- which reads as a layout
                          // bug rather than an absent button.
                          <span aria-hidden="true"
                            style={{width:"24px",flexShrink:0}}/>
                        )}

                        {/* Ball and surface, on the SAME row as the score.

                            What ball, in what state, for what score is one
                            statement about one game, and it now reads as
                            one line. They were a second indented row
                            underneath, which is where most of the card's
                            height went.

                            `flex: 1 1 104px` is what makes that safe: they
                            share whatever the score and the label leave
                            behind, and when that is less than 104px each
                            they wrap together onto their own line instead
                            of shrinking into illegibility. */}
                        {isPracticeGames&&gameBalls.length>0&&(
                          <>
                            {/* The list is the selected league bag's balls
                                (logBalls), not the whole arsenal: the balls
                                actually carried that night are the only
                                ones that can have bowled the game. With no
                                bag defined it falls back to everything, so
                                nobody is forced to pack one first. */}
                            <select data-compact="" style={{...S.sel,...smallInput,
                              flex:"1 1 104px",minWidth:0}}
                              aria-label={`Game ${g} ball`}
                              value={shownBall||""}
                              onChange={e=>updateGameEquipment(activeBowler,effectiveSessionLeague,sessionDate,g,{ball:e.target.value})}>
                              <option value="">Ball…</option>
                              {gameBalls.map(b=>(<option key={b} value={b}>{b}</option>))}
                            </select>
                            {/* Disabled rather than hidden for plastic: a
                                field that appears and disappears as you
                                pick a ball shifts everything under it. */}
                            <select data-compact="" style={{...S.sel,...smallInput,
                              flex:"1 1 104px",minWidth:0}}
                              aria-label={`Game ${g} surface`}
                              value={equip.surface||""}
                              disabled={!shownBall||shownBall===PLASTIC_BALL}
                              onChange={e=>updateGameEquipment(activeBowler,effectiveSessionLeague,sessionDate,g,{surface:e.target.value})}>
                              <option value="">Surface…</option>
                              {SURFACES.map(sf=>(<option key={sf} value={sf}>{sf}</option>))}
                            </select>
                          </>
                        )}
                      </div>
                      {gameToDelete===g&&(
                        <div style={{...S.card,padding:"10px 12px",marginBottom:"8px"}}>
                          <div style={{fontSize:"12px",color:C.text,lineHeight:1.5,marginBottom:"8px"}}>
                            Delete game {g}? This removes the score
                            {frameScores[g-1]!=null?" and every frame logged for it":""}.
                            It can't be undone.
                          </div>
                          <div style={{display:"flex",gap:"8px"}}>
                            <button style={{...S.btn("sm"),flex:1,fontSize:"13px"}}
                              onClick={()=>setGameToDelete(null)}>Keep it</button>
                            <button style={{...S.btn("warn"),flex:1,fontSize:"13px",padding:"8px 14px"}}
                              onClick={()=>{ setGameToDelete(null); deleteGame(g); }}>
                              Delete game {g}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    );
                  })}

                  {/* Add and remove game rows. Practice especially isn't
                      always three games -- people bowl one, or five, or
                      stop after two. Removing clears that game's score so
                      the row and its data go together; without that a
                      "deleted" game would still count toward the series. */}
                  <div style={{display:"flex",gap:"8px",marginTop:"4px"}}>
                    <button style={{...S.btn(),flex:1,fontSize:"13px",padding:"9px"}}
                      onClick={()=>setExtraGames(gameCount+1)}>
                      + Add game
                    </button>
                    {/* "Remove game N" is gone.
                        
                        It deleted the last game's score and dropped the
                        count in one tap, with no confirmation, sitting
                        right beside "Add game" -- a destructive action
                        the width of a thumb from the one you meant.
                        
                        Clearing the box does the same thing and is
                        already how every other score is removed. */}
                  </div>
                  {total!=null&&(
                    <div style={{display:"flex",gap:"6px",marginTop:"10px"}}>
                      <div style={{...S.statBox,border:`1px solid ${C.accent}44`}}>
                        <div style={{...S.statNum,fontSize:"20px",color:C.accent}}>{total}</div>
                        <div style={S.statLbl}>Series</div>
                      </div>
                      <div style={S.statBox}>
                        <div style={{...S.statNum,fontSize:"20px"}}>
                          {/* Divided by the games that HAVE a score, from
                              the same resolved list the total came from.
                              Dividing a resolved total by a count of
                              typed scores gave a 600 series an average of
                              600 the moment one game was frame-tracked --
                              or a divide by zero when none were typed. */}
                          {scoredGames?Math.round(total/scoredGames):"—"}
                        </div>
                        <div style={S.statLbl}>Average</div>
                      </div>
                    </div>
                  )}

                  {/* No save button here any more -- the sticky bar at
                      the bottom of the screen is the one place a session
                      ends, in every mode. Three buttons for one idea was
                      the problem. */}

                </CollapsibleCard>
              );
            })()}


            {/* Shot-by-shot, offered at the moment it means something.

                Finding 3: of 50 established league bowlers, only 12 found
                shot-by-shot -- and 11 of those 12 said it was why they'd
                keep the app. The feature that converts serious users was
                invisible to three quarters of them, because it is a
                setting chosen at setup, before anyone has data it could
                explain.

                So it is offered here, after a few nights of scores-only,
                where it can promise something concrete instead of
                pitching a feature. Once, dismissible, and never again --
                a prompt people learn to swipe away is worse than none.
                The default does not move; round 5 showed shot-by-shot
                bounces beginners. */}
            {offerShotByShot&&!editingId&&(
              <div style={{backgroundColor:C.accent+"11",border:`1px solid ${C.accent}44`,borderRadius:"10px",padding:"12px 14px",marginBottom:"12px"}}>
                <div style={{fontSize:"14px",fontWeight:600,color:C.text,marginBottom:"4px"}}>
                  Want to see which spares are costing you?
                </div>
                <div style={{fontSize:"12px",color:C.textMuted,lineHeight:1.5,marginBottom:"10px"}}>
                  You've logged a few nights on game tracking. Tracking one game frame by frame
                  turns those into spare conversion, carry and leave patterns. You can switch
                  back whenever you like.
                </div>
                <div style={{display:"flex",gap:"8px"}}>
                  <button style={{...S.btn("primary"),flex:1,padding:"8px",fontSize:"12px"}}
                    onClick={onTryShotByShot}>Try it for a game</button>
                  <button style={{...S.btn(),flex:1,padding:"8px",fontSize:"12px"}}
                    onClick={onDismissShotByShot}>No thanks</button>
                </div>
              </div>
            )}

            {/* Whose game is being recorded. Renamed from "Who's Bowling",
                which read as "who is here tonight" rather than "whose shot
                am I logging" -- and the answer differs by environment:
                league keeps the team book, practice partners are
                local-only guests. Tournaments don't get this card at all --
                a tournament bowler is always logging their own results, so
                a card that could only ever say "it's you" adds nothing. */}


            {/* In Practice, a night can be games OR a drill. A drill is a
                focused repetition scored as a rate -- it's kept out of the
                game flow entirely so it can never touch an average. */}

            {!editingId&&activeBowler&&preferences.environment==="practice"&&practiceMode==="drill"&&activeDrill&&(
              <DrillSession
                drill={activeDrill}
                onChange={setActiveDrill}
                onSave={saveDrill}
                saved={drillSaved}
                balls={logBalls}
                drills={drills}
                bowler={activeBowler}
                sessionDate={sessionDate}
                onStartAnother={startAnotherDrill}
                leftHanded={leftHandedForBowler ? leftHandedForBowler(activeBowler) : false}/>
            )}

            {/* The arsenal lives on the Profile screen, not here. Managing
                equipment mid-session was a second place to do the same
                thing, and the Log tab is for logging. */}

            {/* Session card */}

            {/* In a tournament, "Tonight's Session" doesn't fit: game count
                varies, lane pairs change per game, and there may be several
                days with their own cut lines. The tournament form replaces
                it entirely rather than trying to bend one into the other. */}
            {!editingId&&activeBowler&&preferences.environment==="tournament"&&(
              <TournamentSession
                resultsSummary={!editingId&&curSession?renderNightSummary():null}
                entitlement={entitlement}
                tab={tournamentTab} onTabChange={setTournamentTab}

                onUseDate={setSessionDate}

                saveMessage={tournamentSaveMessage}

                onCloseTournament={closeTournament}
                shotScoresByDate={tournamentShotScoresByDate?.scores||null}

                sessionDate={sessionDate}
                tournament={activeTournament}
                onChange={updateTournament}
                onSave={saveTournament}
                onCancelTournament={cancelTournament}
                saved={tournamentSaved}
                oilPatterns={oilPatterns} submitOilPattern={submitOilPattern} tournaments={tournaments}/>
            )}

            {/* "Tonight's Session" is league framing -- series, money games,
                match points. Practice has none of that, so it gets a plain
                date header instead of a card promising things that aren't
                there. */}

            {/* Import moved to the header. It was here, gated on the
                current environment and on a league already being chosen --
                which meant importing a league card required setting up a
                league night first, and importing a tournament card while
                in practice mode was impossible.
                
                It's now reachable from anywhere and asks what's being
                imported, so the import no longer inherits whatever mode
                the Log tab happens to be in. */}

            {/* Says what's missing rather than showing nothing. The card
                itself stays gated on a league because a score is keyed by
                (bowler, league, date, game): one entered with an empty
                league lands under a key the real league never reads, so
                it wouldn't sync, wouldn't appear once a league WAS picked,
                and would still be counted by any average that doesn't
                filter by league. Silent loss plus a polluted composite --
                worse than asking for one tap first. */}
            {/* LEAGUE ONLY. Practice and casual have no league to pick --
                their container league is created for them -- so telling a
                practice bowler to "pick tonight's league" is asking for
                something that doesn't exist in that mode. */}
            {/* No league or team at all -- not "pick one", there's
                nothing to pick. Scores are filed against a league, so
                this is a genuine dead end without setup, and a blank
                screen would read as the app being broken. */}
            {/* Not gated on activeBowler.
            
                It used to be, which meant a bowler with no active
                selection got neither the entry form NOR this prompt --
                a blank tab with no way forward. Needing to set up a
                league is true whether or not a bowler chip is
                highlighted. */}
            {onTab("setup")&&!editingId&&needsLeagueSetup({
              environment:preferences.environment,leagues,teams,
            })&&(
              <div style={{...S.card,border:`1px solid ${C.accent}44`}}>
                <div style={{fontSize:"15px",fontWeight:700,color:C.text,marginBottom:"6px"}}>
                  We love leagues too! 🎳
                </div>
                <div style={{fontSize:"13px",color:C.textMuted,lineHeight:1.55,marginBottom:"12px"}}>
                  Add the league you bowl in and you can start putting scores in straight
                  away. A team isn't needed yet — you can add one whenever you like, and
                  tonight's scores will join it.
                </div>
                {/* Setup's League tab, which is where the Leagues card
                    lives -- "teams" lands there. */}
                <button style={S.btn("primary")} onClick={()=>setView("teams")}>
                  Add my league
                </button>
                {/* "look", not "league". Tracks are topics now, and
                    "league" matched no track -- it reached the look-around
                    tour only through the unknown-track fallback. The
                    look-around tour is the right one here anyway: its third
                    slide is Team, which is where a league gets set up. */}
                {onReplayTour&&(
                  <button style={{...S.btn(),width:"100%",marginTop:"8px",fontSize:"12px"}}
                    onClick={()=>onReplayTour("look")}>
                    Show me how first
                  </button>
                )}
              </div>
            )}

            {/* The team, asked for AFTER a night rather than before one.

                Focus group Finding 2: requiring a team before any score
                could be entered cost 62% of new league bowlers a wall,
                and 11 of 31 abandoned during team setup -- most at the
                roster screen, asked for teammates' emails they did not
                have. "I just wanted to put tonight's scores in."

                So it is a reminder with a reason attached, shown only
                once a real night exists to attach it to, and dismissible
                for good. A prompt people learn to swipe away is worse
                than none. */}
            {onTab("setup")&&!editingId&&promptForTeam&&(
              <div style={{backgroundColor:C.accent+"11",border:`1px solid ${C.accent}44`,borderRadius:"10px",padding:"12px 14px",marginBottom:"12px"}}>
                <div style={{fontSize:"14px",fontWeight:600,color:C.text,marginBottom:"4px"}}>
                  Want these to count for your team?
                </div>
                <div style={{fontSize:"12px",color:C.textMuted,lineHeight:1.5,marginBottom:"10px"}}>
                  {/* Round 7, finding 5: a new league bowler is JOINING a team
                      someone else named, not creating one. Nine of fifty
                      hesitated over whether they were about to make a
                      duplicate of their real team. */}
                  Your scores are saved and yours either way. Joining your team — or making
                  one if it's not there yet — puts them on the team sheet as well: standings,
                  side pots and everyone's averages in one place. Everything you've already
                  logged in this league comes with you.
                </div>
                <div style={{display:"flex",gap:"8px"}}>
                  <button style={{...S.btn("primary"),flex:1,padding:"8px",fontSize:"12px"}}
                    onClick={()=>setView("setup-team")}>Add or join my team</button>
                  <button style={{...S.btn(),flex:1,padding:"8px",fontSize:"12px"}}
                    onClick={onDismissTeamPrompt}>Not now</button>
                </div>
              </div>
            )}

            {/* The empty "Enter Game Scores" placeholder used to sit here,
                telling a bowler to pick a league. Removed: the session
                picker directly above it already asks for one, so this was
                a second card saying the same thing -- and a card titled
                "Enter Game Scores" that cannot take a score reads as
                broken rather than as an instruction. Nothing appears here
                until a league is chosen, and then the real card does. */}

            {/* Shot-form order, top to bottom:
                  context (game, frame, lane) -> result -> ball -> surface
                  -> line -> release & miss -> shoes -> notes.
                Context first because it's what changes every shot; result
                right under it because "frame 5: strike" is one thought;
                equipment after because it changes rarely; shoes above
                notes because both are things you set once and leave. */}

            {/* Says what the second half is for.
                
                Game entry above, frame tracking below, and without a line
                between them a bowler who has typed three scores has no
                reason to scroll -- which is how frame tracking stayed
                undiscovered when it was a setting.
                
                Names what it BUYS rather than what it is. "Shot-by-shot
                tracking" is a feature; "which leaves keep costing you" is
                a reason. */}
            {onTab("scoring")&&showShotContext&&(
              <div style={{
                fontSize:"12px",color:C.textMuted,lineHeight:1.5,
                padding:"10px 12px",marginBottom:"10px",
                backgroundColor:C.surface,borderRadius:"10px",
                border:`1px solid ${C.border}`,
              }}>
                Scores above are enough. Frames below add shot and ball data.
              </div>
            )}

            {onTab("scoring")&&showShotContext&&(
            <div style={S.card}>
              <div style={S.label}>
                Shot Context
                {inTenth&&<span style={{color:C.spare,marginLeft:"8px"}}>10th Frame{ballNumLabel}</span>}
              </div>
              {!editingId&&(
                <div style={{fontSize:"12px",color:C.textMuted,marginBottom:"10px"}}>
                  {/* effectiveSessionLeague, not sessionLeague: practice and
                      casual have a container league rather than one you
                      pick, so keying off sessionLeague told a practice
                      bowler to "pick a league above" -- something that
                      doesn't exist in that mode. */}
                  {/* The bowler the shots are filed under, not the
                      account name. activeBowler can be the sign-in
                      identity -- an email-derived handle -- while the
                      shots belong to "Ryan", and showing the wrong one
                      here made it look like the app was logging for
                      somebody else. */}
                  {bakerBowlerName||form.bowler||activeBowler||"No bowler selected"}

                  {effectiveSessionLeague
                    /* The DISPLAY name. A container league's stored name
                       carries the user id -- "Tournament·Tourny Test
                       1·c3e40233-c180-4d76-be28-36abd33f9c07" -- and the
                       header was showing all of it. */
                    ? ` — ${practiceLeagueDisplayName(effectiveSessionLeague).replace(" House Shot","")}, ${formatDate(sessionDate)}`

                    : preferences.environment==="league" ? " — pick a league above" : ` — ${formatDate(sessionDate)}`}
                </div>
              )}
              {editingId&&(
                <div style={S.row}>
                  <input style={{...S.input,flex:1}} placeholder="League" value={form.league} onChange={e=>set("league",e.target.value)}/>
                  <input style={{...S.input,flex:1}} type="date" value={form.date} onChange={e=>set("date",e.target.value)}/>
                </div>
              )}

              {/* Live scores — moved here from Tonight's Session, so they're
                  visible right alongside where you're actively logging. */}
              {/* The series is the one loud thing on this screen. Four
                  equal boxes made the total the same size as game 1 --
                  which is the size of everything else -- so nothing on
                  the page ever read as the thing you came for. */}
              {/* effectiveSessionLeague, not sessionLeague.
                  
                  sessionLeague is blank in practice, open bowling and
                  tournaments -- they bowl under a container league -- so
                  this gate hid the whole series-and-games summary in
                  exactly the modes that were logging shots. */}
              {!editingId&&effectiveSessionLeague&&(

                <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",gap:"12px",marginBottom:"14px"}}>
                  <div>
                    <div className="num" style={{fontSize:"56px",lineHeight:0.9,fontWeight:700,fontFamily:F.num,letterSpacing:"-0.02em",color:sessionTotal!=null?C.text:C.textMuted}}>
                      {sessionTotal!=null?sessionTotal:"—"}
                    </div>
                    <div style={{fontSize:"12px",color:C.textMuted,marginTop:"6px"}}>Series so far</div>
                  </div>
                  <div style={{display:"flex",gap:"14px",paddingBottom:"4px"}}>
                    {/* Every game bowled, not a fixed three. A
                        tournament block can be five or eight, and games
                        past the third simply never appeared. */}
                    {gameScores.map((score,i)=>(

                      <div key={i} style={{textAlign:"center"}}>
                        <div className="num" style={{fontSize:"22px",lineHeight:1,fontWeight:700,fontFamily:F.num,color:score!=null?C.text:C.textMuted}}>
                          {score!=null?score:"—"}
                        </div>
                        <div style={{fontSize:"11px",color:C.textMuted,marginTop:"4px"}}>G{i+1}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Game stepper */}
              <div style={{display:"flex",gap:"8px",marginBottom:"10px"}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:"12px",color:C.textMuted,marginBottom:"4px"}}>Game</div>
                  <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                    <button style={S.btn("sm")} onClick={()=>{
                      const v=String(Math.max(1,(parseInt(form.game)||1)-1));
                      const line=!editingId?autoFillLine(form.ball,v,form.frame):{startingBoard:form.startingBoard,targetArrows:form.targetArrows};
                      setForm(p=>({...p,game:v,startingBoard:line.startingBoard,targetArrows:line.targetArrows}));
                    }}>−</button>
                    <div style={{flex:1,textAlign:"center",fontSize:"22px",fontWeight:700}}>{form.game||1}</div>
                    <button style={S.btn("sm")} onClick={()=>{
                      const v=String(Math.min(maxGames,(parseInt(form.game)||1)+1));
                      const line=!editingId?autoFillLine(form.ball,v,form.frame):{startingBoard:form.startingBoard,targetArrows:form.targetArrows};
                      setForm(p=>({...p,game:v,startingBoard:line.startingBoard,targetArrows:line.targetArrows}));
                    }}>+</button>
                  </div>
                </div>

                {/* Frame stepper — max 10 */}
                <div style={{flex:1}}>
                  <div style={{fontSize:"12px",color:C.textMuted,marginBottom:"4px"}}>Frame</div>
                  <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                    <button style={S.btn("sm")} onClick={()=>{
                      const v=String(Math.max(1,(parseInt(form.frame)||1)-1));
                      const line=!editingId?autoFillLine(form.ball,form.game,v):{startingBoard:form.startingBoard,targetArrows:form.targetArrows};
                      setForm(p=>({...p,frame:v,ballNum:null,startingBoard:line.startingBoard,targetArrows:line.targetArrows}));
                    }}>−</button>
                    <div style={{flex:1,textAlign:"center",fontSize:"22px",fontWeight:700}}>{form.frame||1}</div>
                    <button style={S.btn("sm")} onClick={()=>{
                      const v=String(Math.min(10,(parseInt(form.frame)||1)+1));
                      const line=!editingId?autoFillLine(form.ball,form.game,v):{startingBoard:form.startingBoard,targetArrows:form.targetArrows};
                      setForm(p=>({...p,frame:v,ballNum:parseInt(v)===10?1:null,startingBoard:line.startingBoard,targetArrows:line.targetArrows}));
                    }}>+</button>
                  </div>
                </div>
              </div>

              {/* 10th frame ball selector */}
              {inTenth&&!editingId&&(
                <div style={{marginBottom:"10px"}}>
                  <div style={{fontSize:"12px",color:C.textMuted,marginBottom:"6px"}}>Ball in 10th</div>
                  <div style={S.chips}>
                    {tenthOptions.map(n=>(
                      <Chip key={n} label={`Ball ${n}`} selected={form.ballNum===n} onToggle={()=>set("ballNum",n)} color={C.spare}/>
                    ))}
                  </div>
                </div>
              )}

              {/* Lane display */}
              {!editingId&&startingLane&&(
                <div style={{textAlign:"center",padding:"10px",backgroundColor:C.surface,borderRadius:"8px",border:`1px solid ${C.border}`}}>
                  <span style={{fontSize:"12px",color:C.textMuted,marginRight:"8px"}}>Lane</span>
                  <span style={{fontSize:"22px",fontWeight:700,color:C.accent}}>{currentLane||"—"}</span>
                </div>
              )}
              {editingId&&(
                <input style={S.input} placeholder="Lane" type="text" inputMode="numeric" pattern="[0-9]*" maxLength={3} value={form.lane} onChange={e=>set("lane",laneDigits(e.target.value))}/>
              )}
            </div>
            )}

            {/* The ten frames, between the frame picker above and the
                result being entered below -- which is where a bowler
                looks to check what they just did. Rebuilt from `shots`
                every render, so a mark appears as soon as a shot saves. */}
            {/* Which ball in the tenth -- directly above the frames, in
                the same place as the Editing Shot banner below it.
                
                It used to render several cards up, beside Shot Context.
                But it is the ANSWER to tapping the tenth, so it belongs
                next to the frame that was tapped: up there it opened
                off-screen behind the bowler and the tap read as doing
                nothing at all, which is why the tenth felt like the one
                frame that could not be edited.
                
                The banner and this card are the same idea one step apart
                -- "which shot do you mean" and "this is the shot you are
                editing" -- so they share a spot, and only one is ever on
                screen: picking a ball here starts the edit, which is
                what puts the banner up.
                
                Only when there is more than one ball. A single-ball
                tenth goes straight in, because a chooser with one option
                is a tap for nothing. Labels say what was actually
                thrown, so the bowler finds the right ball by recognising
                it rather than by counting. */}
            {tenthPick&&(
              // Amber, like the Editing Shot banner below it, and for the
              // same reason: this is an edit in progress. It used to be
              // an accent-bordered plain card, which is what every other
              // card on the tab looks like -- so the one card that means
              // "you are changing something already bowled" was the only
              // one not saying so.
              //
              // Same background, border, radius and padding as the
              // banner, and the same ✏️ and heading weight, because the
              // two appear in the same spot one after the other and a
              // shift in either would read as the page jumping.
              <div ref={tenthPickRef}
                style={{backgroundColor:C.spare+"22",border:`1px solid ${C.spare}44`,
                  borderRadius:"10px",padding:"12px 16px",marginBottom:"12px"}}>
                <div style={{display:"flex",justifyContent:"space-between",
                  alignItems:"center",gap:"8px",marginBottom:"10px"}}>
                  {/* Says EDIT, not just "which ball".

                      "Which ball in the 10th?" described the choice and
                      never the reason for it, so a bowler who tapped the
                      tenth by accident had nothing telling them what
                      answering would do. */}
                  <div style={{fontSize:"13px",color:C.spare,fontWeight:600}}>
                    ✏️ Edit the 10th — which ball?
                  </div>
                  <button style={{...S.btn(),padding:"6px 12px",fontSize:"12px",flexShrink:0}}
                    onClick={()=>setTenthPick(null)}>Cancel</button>
                </div>
                <div style={S.chips}>
                  {tenthPick.balls.map((b,i)=>(
                    <Chip key={i}
                      label={`${i===2?"Fill":`Ball ${i+1}`} · ${b.result==="Strike"?"X":(b._displayResult||b.result||"—")}`}
                      onToggle={()=>{setTenthPick(null);startEdit(b);}} />
                  ))}
                </div>
              </div>
            )}

            {/* Edit banner, directly above the frames.
                
                It used to sit near the top of the tab, several cards away
                from the scoresheet. Tapping a frame scrolled the page to
                it, which put the banner on screen and the frames -- the
                thing being edited -- off it. Beside the frames, one
                scroll target serves both: you see WHICH shot you are
                editing and the card it belongs to at the same time. */}
            {editingId&&(
              <div style={{backgroundColor:C.spare+"22",border:`1px solid ${C.spare}44`,borderRadius:"10px",padding:"12px 16px",marginBottom:"12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontSize:"13px",color:C.spare,fontWeight:600}}>✏️ Editing Shot</div>
                <button style={{...S.btn(),padding:"6px 12px",fontSize:"12px"}} onClick={()=>cancelEdit?.()}>Cancel</button>
              </div>
            )}

            {onTab("scoring")&&showShotContext&&(
              <Scoresheet

                shots={(shots||[]).filter(sh=>{
                  // Matched loosely on purpose.
                  //
                  // A shot is saved by spreading ...form, and a blank
                  // form starts with bowler:"" and league:"" -- so a shot
                  // logged before those fields are populated is stored
                  // with empty strings. Comparing them strictly against
                  // activeBowler / effectiveSessionLeague matched nothing,
                  // which is why frames stayed blank and no frame ever
                  // had a shot to open for editing.
                  //
                  // An empty field on either side means "unset", not
                  // "different", so it doesn't exclude the shot.
                  // EXACT, not permissive.
                  //
                  // This matched when either side was blank, so a blank
                  // form.league matched every league -- and a tournament
                  // bowled the same day as league night showed its games
                  // on the league scoresheet. Two different nights
                  // presented as one.
                  //
                  // The permissive version existed because the form used
                  // to drift; it no longer does, and the resolved values
                  // below are the same ones the save path writes.
                  const eq=(a,b)=>String(a??"")===String(b??"");
                  return eq(sh.bowler,form.bowler||activeBowler)
                    &&eq(sh.league,effectiveSessionLeague)
                    &&eq(sh.date,sessionDate)
                    &&eq(sh.game,form.game);

                })}
                currentFrame={form.frame}
                currentBall={form.ballNum}
                /* So the row can start over at frame 1 when the game
                   rolls, instead of staying parked on the last game's
                   tenth. */
                game={form.game}
                bowlerName={form.bowler||activeBowler}
                maxScore={maxScoreThisGame}
                /* The card's own bowler, not the active one -- logging for
                   a left-handed teammate has to draw their corner pin. */
                leftHanded={leftHandedForBowler
                  ? leftHandedForBowler(form.bowler||activeBowler)
                  : activeBowlerLeftHanded}
                onSelectFrame={(frame,shot,tenth)=>{

                  // The tenth can hold three balls, so ask which one.
                  //
                  // Tapping it used to jump straight into ball 1, which
                  // is the only ball you could reach -- a mis-tapped fill
                  // ball had no way in at all.
                  const balls=[tenth?.ball1,tenth?.ball2,tenth?.ball3].filter(Boolean);
                  if(Number(frame)===10&&balls.length>1&&startEdit){
                    setTenthPick({balls});
                    return;
                  }

                  const goTo=()=>setForm(f=>({...f,frame:String(frame),
                    ballNum:Number(frame)===10?1:null}));

                  // A bowled frame opens for editing.
                  if(shot&&startEdit){startEdit(shot);return;}

                  // An EMPTY frame while editing means "never mind" --
                  // tapping away from an edit is the natural way to
                  // abandon it, and leaving Update/Cancel as the only
                  // exits made the scoresheet feel stuck.
                  if(editingId){cancelEdit?.();goTo();return;}

                  // An empty frame with a finished shot in hand saves it
                  // first, so tapping the next frame is a second path to
                  // Save Shot rather than silently discarding what was
                  // entered. Same condition the Save button uses -- if it
                  // wouldn't save on tap, it doesn't save here either.
                  const canSave=form.result&&form.bowler&&!needsSpareMade&&!needsPins;
                  if(canSave&&submitShot){submitShot();return;}

                  goTo();
                }}/>
            )}

            {/* Not in Just Bowling: the scores table lists everyone and
                takes their scores directly, so a separate "who am I
                keeping score for" card is the same information twice
                and a switch nobody needs to flip. */}
            {/* Not until a league is chosen either.

                In league mode nothing below can be recorded without one --
                scores are filed against a league -- so asking who is
                bowling first is asking for a setting that has nowhere to
                apply. It puts two cards of setup in front of someone who
                came to enter a score. */}
            {onTab("scoring")&&!editingId&&preferences.environment!=="tournament"&&preferences.environment!=="casual"
              &&(preferences.environment!=="league"||!!effectiveSessionLeague)
              // Not on a drill. A drill is one bowler working on one
              // thing -- there is nobody else to keep score for, so the
              // card asked a question with one possible answer and took
              // a card's worth of space above the drill to do it.
              &&!isDrill
              // ...and not in practice at all. A practice night is one
              // bowler working alone, games or drills alike -- there is
              // nobody else to keep score for, so the card asked a
              // question with one possible answer. It was already off for
              // drills; games is the same situation.
              &&preferences.environment!=="practice"&&(
              <div style={{...S.card,padding:"10px 12px"}}>
                {/* Below Shot Context and kept short: this is a setting
                    you touch once a night, not something to scroll past
                    before every shot. The name also shows on the
                    scoresheet, so this card doesn't have to shout. */}
                <div style={{...S.label,marginBottom:"6px"}}>Keeping score for</div>

                <>
                    <div style={{...S.chips,gap:"4px",marginBottom:0}}>
                      {/* Guarded against "" === "".
                      
                          With no displayName loaded and no bowlers yet,
                          both sides are empty strings, so this chip
                          rendered as SELECTED while activeBowler was
                          actually "". Every downstream card is gated on
                          activeBowler, so the bowler saw a chosen chip,
                          no entry form, and no setup prompt -- a dead
                          end that looks like a working screen. */}
                      <Chip label={`${ownerName||"Me"} (me)`} selected={!!ownerName&&activeBowler===ownerName}
                        onToggle={()=>selectBowler(ownerName)} color={C.accent} dense/>
                      {scoringForOthers&&scoreOptions.filter(n=>n!==ownerName).map(b=>(
                        <Chip key={b} label={b} selected={activeBowler===b}
                          onToggle={()=>selectBowler(b)} color={C.accent} dense/>
                      ))}
                    </div>

                    <div style={{...S.chips,marginTop:"6px",marginBottom:0}}>
                      <Chip label={scoringForOthers?"✓ Also scoring for others":"Also scoring for others"}
                        dense selected={scoringForOthers}
                        onToggle={()=>{
                          const next=!scoringForOthers;
                          setScoringForOthers(next);
                          // Turning it off must not leave the form pointed
                          // at someone who's no longer selectable.
                          if(!next&&activeBowler!==ownerName)selectBowler(ownerName);
                        }}/>
                    </div>

                    {scoringForOthers&&(
                      <>
                        <div style={{fontSize:"11px",color:C.textMuted,marginTop:"6px"}}>
                          {scorekeepingHelp(preferences.environment)}
                        </div>

                        {otherBowlerSource(preferences.environment)==="freetext"&&(
                          <>
                            <div style={{...S.row,marginTop:"8px"}}>
                              <input style={{...S.input,flex:1}} placeholder="Add someone bowling with you"
                                value={newGuestName} onChange={e=>setNewGuestName(e.target.value)}
                                onKeyDown={e=>{if(e.key==="Enter")addGuestBowler();}}/>
                              <button style={S.btn("sm")} onClick={addGuestBowler}>+</button>
                            </div>
                            {(guests||[]).length>0&&(
                              <div style={{...S.chips,marginTop:"6px"}}>
                                {guests.map(g=>(
                                  <Chip key={g} label={`${g}  ×`} dense selected color={C.textMuted}
                                    onToggle={()=>removeGuestBowler(g)}/>
                                ))}
                              </div>
                            )}
                          </>
                        )}

                        {otherBowlerSource(preferences.environment)==="roster"&&scoreOptions.length<=1&&(
                          <div style={{fontSize:"11px",color:C.textMuted,marginTop:"6px"}}>
                            No teammates on this league's roster yet — add them on the Social tab.
                          </div>
                        )}
                      </>
                    )}
                  </>
              </div>
            )}


            {onTab("scoring")&&showShotContext&&(
            <div ref={resultCardRef} style={S.card}>
              {/* The ceiling on the game in progress: strike out from here
                  and this is what you finish with.
                  
                  Lives on the Result card, not in the session header. The
                  header sits inside "Tonight's Session", which collapses
                  once setup is answered -- so it was hidden for the entire
                  time a bowler is actually throwing, which is exactly when
                  this number matters. It was also gated on sessionLeague,
                  so practice never saw it at all. */}
              {/* Max score moved to the scoresheet -- it's a fact about
                  the GAME, so it belongs under the frames rather than
                  above the buttons for a single shot. */}
              {/* The only required field on the whole shot form.
                  
                  canSave is `form.result && form.bowler && !needsSpareMade
                  && !needsPins` -- and the last two only ever apply BECAUSE
                  a result was chosen. So Result is the one answer a shot
                  cannot be saved without; line, release, ball, breakpoint
                  and notes are all optional.
                  
                  Saying so here rather than marking the other cards
                  "optional": there is one required field and a dozen
                  optional ones, and labelling the dozen is both more noise
                  and easier to fall out of date. A bowler who sees Required
                  on exactly one card can infer the rest. */}
              <div style={{display:"flex",alignItems:"baseline",gap:"8px",marginBottom:"8px"}}>
                <div style={{...S.label,marginBottom:0}}>Result</div>
                <span style={{fontSize:"11px",fontWeight:600,color:C.accent,
                  letterSpacing:"0.02em"}}>Required</span>
                <span style={{fontSize:"11px",color:C.textMuted,marginLeft:"auto"}}>
                  everything else is optional
                </span>
              </div>
              {/* One row, four equal columns.
                  
                  S.chips wraps, so four results spilled onto two rows at
                  phone width -- and the four are one choice, which reads
                  wrong split across lines. A grid keeps them level and
                  each cell stays above the touch minimum at 380px. */}
              <div style={{display:"grid",
                gridTemplateColumns:"repeat(4, minmax(0, 1fr))",
                gap:"6px",marginBottom:"12px"}}>
                {resultsForHandedness(activeBowlerLeftHanded).map(label=>{
                  // `label` is what the bowler sees (e.g. "Weak 7" for a
                  // lefty); `stored` is what actually gets saved, which is
                  // always the canonical "Weak 10"/"Ringing 10" value.
                  const stored=storedResultFor(label);
                  return(
                    <Chip key={label} fill label={label==="Other Leave"?"Other":label} selected={form.result===stored}
                      onToggle={()=>{
                        const newResult=form.result===stored?"":stored;

                        // Go to the field this result just revealed.
                        //
                        // Each result opens a different next question, and
                        // the bowler should be looking AT it rather than at
                        // the save button with the question off-screen
                        // above. Anchored to the top so the rest of the form
                        // sits below it, in reading order.
                        //
                        //   Strike        -> Strike Description
                        //   Weak/Ringing  -> Spare Made (a corner pin is up)
                        //   Other Leave   -> Pins Standing (which pins?)
                        //
                        // Clearing a result scrolls nowhere: nothing new
                        // appeared, so moving the page would be the app
                        // taking a decision the bowler did not make.
                        if(newResult==="Strike")scrollToTopOf(strikeDescRef);
                        else if(newResult==="Other Leave")scrollToTopOf(pinsStandingRef);
                        else if(newResult)scrollToTopOf(spareMadeRef);



                        // Deselecting the result of a SAVED shot deletes
                        // it. The result is what a frame is -- a shot with
                        // no result isn't an empty frame, it's a row that
                        // can't be scored and would sit in the scoresheet
                        // as a permanent blank.
                        //
                        // Confirmed, because it can't be undone, and
                        // cancelled by putting the result back rather than
                        // leaving the frame in a broken state.
                        if(!newResult&&editingId&&deleteShot){
                          const which=`frame ${form.frame}${form.ballNum?`, ball ${form.ballNum}`:""} of game ${form.game}`;
                          if(!window.confirm(`Clearing the result deletes ${which}. Delete it?`))return;
                          deleteShot(editingId);
                          // Stay on the frame that was just emptied. It is
                          // the frame the bowler is looking at and the one
                          // they are about to re-bowl; the default exit
                          // would send them forward to the next unbowled
                          // frame instead.
                          cancelEdit?.({stayOnFrame:true});
                          return;
                        }

                        setForm(f=>({
                          ...f,
                          result:newResult,
                          otherLeave:newResult==="Other Leave"?f.otherLeave:[],
                          spareMade:"",
                          // A new result rebuilds the frame, so the
                          // spare ball's answer no longer describes it.
                          secondLeave:undefined,
                          // Weak/Ringing always leave a single corner pin:
                          // first ball = 9, and if missed, adds 0 — so the frame total is
                          // deterministic and doesn't need a manual pin-count entry.
                          pinCount:(newResult==="Weak 10"||newResult==="Ringing 10")?"9":"",
                        }));
                      }}
                      color={stored==="Strike"?C.strike:stored.includes("10")?C.miss:C.spare}/>
                  );
                })}
              </div>

              {form.result==="Other Leave"&&(
                <>
                  {/* Scroll target for Other Leave: the pins are the next
                      thing to answer, so this is what has to come into
                      view -- not the save button below it. */}
                  <div ref={pinsStandingRef} style={S.label}>Pins Standing</div>
                  <div style={S.chips}>
                    {/* Gutter — a one-tap shortcut for all 10 pins standing,
                        rather than tapping each pin chip individually. Not a
                        separate stored result value; it produces the exact
                        same underlying state (otherLeave=all 10,
                        pinCount="0") that manually tapping every pin would,
                        so the scoring engine needs no changes and this
                        chip's "selected" state just reflects whether that
                        state currently holds. */}
                    <Chip label="Gutter"
                      selected={form.otherLeave.length===10}
                      onToggle={()=>{
                        const isGutter=form.otherLeave.length===10;
                        setForm(f=>(isGutter
                          ?{...f,otherLeave:[],pinCount:"",spareMade:"",secondLeave:undefined}
                          :{...f,otherLeave:["1","2","3","4","5","6","7","8","9","10"],pinCount:"0",spareMade:"",secondLeave:undefined}
                        ));
                      }}
                      color={C.miss}/>
                    {/* The "9 Pin No-Tap" chip is gone.
                        
                        No-tap is a property of the LEAGUE, set when the
                        format is defined, and scoring applies it
                        automatically from there. Marking it per shot asked
                        the bowler to restate a rule the app already knows,
                        and let them disagree with it.
                        
                        Practice never had a format to disagree with, so it
                        was pure noise there. */}
                  </div>
                  <PinDeck
                    selected={Array.isArray(form.otherLeave)?form.otherLeave:[]}
                    onToggle={p=>handleLeaveToggle(p)}/>
                  {isNoTap&&<div style={{fontSize:"13px",color:C.strike,fontWeight:600,marginTop:"4px"}}>9 Pin No-Tap → scored as Strike</div>}
                  {!isNoTap&&Array.isArray(form.otherLeave)&&form.otherLeave.length>0&&(
                    <div style={{fontSize:"13px",color:C.spare,fontWeight:600,marginTop:"4px"}}>
                      Leave: {[...form.otherLeave].sort((a,b)=>Number(a)-Number(b)).join("-")}
                      {standingPins>0&&<span style={{color:C.textMuted,fontWeight:400}}> · First ball: {firstBallPins}</span>}
                    </div>
                  )}
                </>
              )}

              {isStrike&&(
                <>
                  {/* No divider. It drew a line across the card between
                      the result and what follows, which read as the end
                      of the card rather than a change of subject inside
                      it -- the spacing already does that job. */}
                  <div ref={strikeDescRef} style={{...S.label,marginBottom:"8px"}}>Strike Description</div>
                  {/* Eight options in two rows, sized to their words.
                      
                      Equal columns forced "Messenger" and "Half Pocket"
                      into a cell built for "High", so the text overflowed
                      its button. These are labels of very different
                      lengths and there is no reason for them to be the
                      same width.
                      
                      So: wrap, but shrink to fit. Smaller text and
                      tighter padding than a normal chip, which is what
                      brings eight of them down to two rows without
                      cutting any of them off. */}
                  <div style={{display:"flex",flexWrap:"wrap",
                    gap:"5px",marginBottom:"12px"}}>
                    {strikeDescriptionsForHand(activeBowlerLeftHanded).map(label=>(
                      <Chip key={label} label={label} dense
                        selected={storedStrikeDescriptionFor(label)===form.strikeDescription}
                        onToggle={()=>{
                          const stored=storedStrikeDescriptionFor(label);
                          set("strikeDescription",form.strikeDescription===stored?"":stored);
                        }} color={C.strike}/>
                    ))}
                  </div>
                </>
              )}

              {/* Hidden until the leave is described.
                  Offering Yes/No against an empty "Other Leave" let the
                  bowler answer a question the app could not score, and
                  filed the frame as "10 spare". Hiding it rather than
                  disabling Save points at the actual next step -- the pin
                  pad above -- instead of reporting a failure at the bottom
                  of the form. */}
              {hasLeave&&leaveDescribed&&!(inTenth&&form.ballNum===3)&&(
                <>
                  <div style={S.divider}/>
                  <div ref={spareMadeRef} style={S.label}>Spare Made</div>
                  <div style={S.chips}>
                    {/* Scrolls again after answering.

                        Answering "No" reveals the total-pins field, so
                        the save button moves further down than it was
                        when the result was picked -- the first scroll is
                        no longer far enough and the bowler is back to
                        scrolling by hand. */}
                    {["Yes","No"].map(s=>(
                      <Chip key={s} label={s} selected={form.spareMade===s}
                        onToggle={()=>{
                          handleSpareMadeToggle(s);

                          // Where "Yes" goes depends on what asked the
                          // question, which is the whole subtlety here.
                          //
                          //   Other Leave -> the frame is finished, and
                          //     the only thing left is the optional
                          //     detail. Go to the END of it, so Shoes and
                          //     Execution sit above Save Shot and the
                          //     shot can be saved without another swipe.
                          //
                          //   Weak / Ringing 10 -> a corner pin needs no
                          //     picker, so "No" reveals nothing either.
                          //     Scrolling on one answer and not the other
                          //     made the two behave differently for no
                          //     reason a bowler could see, so neither
                          //     moves the page.
                          //
                          // "No" on Other Leave opens the pin picker, so
                          // that is the next thing to answer and it goes
                          // to the top, with the rest of the form below.
                          if(s==="No"&&form.result==="Other Leave"){
                            scrollToTopOf(totalPinsRef);
                          }else if(s==="Yes"&&form.result==="Other Leave"){
                            revealBottomOf(detailsRef);
                          }
                        }}
                        color={s==="Yes"?C.strike:C.miss}/>
                    ))}
                  </div>
                </>
              )}

              {showSparePins&&(
                <>
                  <div style={S.divider}/>
                  <div ref={totalPinsRef} style={S.label}>Which pins did you knock down?</div>
                  <div style={{fontSize:"12px",color:C.textMuted,lineHeight:1.45,marginBottom:"14px"}}>
                    Tap the ones that fell. None of them? Just save the shot.
                  </div>

                  {/* The shared rack, with the pins that are no longer a
                      choice locked out. Same component the leave is
                      picked with, so the gesture is one the bowler has
                      already made this frame. */}
                  <PinDeck
                    selected={spareKnocked.map(String)}
                    available={sparePinsStanding.map(String)}
                    onToggle={n=>toggleSparePin(Number(n))}/>

                  {spareWillConvert?(
                    /* Every standing pin tapped IS a spare, so say what
                       will happen rather than asking for a correction --
                       the bowler has already told us what they did.
                       
                       Spare made is deliberately NOT flipped to Yes here:
                       that would hide the picker mid-tap, and a mis-tap
                       has to stay undoable. Untap one and this reverts to
                       an open frame with no fuss. The conversion happens
                       at save. */
                    <div style={{fontSize:"12px",color:C.strike,lineHeight:1.45}}>
                      That's every pin — we'll save this as a spare.
                    </div>
                  ):(
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",fontSize:"12px",color:C.textMuted}}>
                      <span>First ball: <strong style={{color:C.text}}>{firstBallPins}</strong></span>
                      <span>Second ball: <strong style={{color:C.spare,fontFamily:F.num,fontSize:"16px"}}>{spareKnocked.length}</strong></span>
                    </div>
                  )}

                  {/* Nothing can tell when the tapping is finished.
                      
                      Every other field in this form reveals the next one
                      the moment it is answered, but a pin picker has no
                      such moment -- one pin or four, the bowler is the
                      only one who knows. So they say so, and this is the
                      button that says it. Scrolling by hand still works;
                      this just saves the swipe. */}
                  <div style={{display:"flex",justifyContent:"flex-end",marginTop:"10px"}}>
                    <button type="button"
                      onClick={()=>revealBottomOf(detailsRef)}
                      aria-label="Done picking pins — show the rest of the form"
                      style={{
                        display:"flex",alignItems:"center",gap:"6px",
                        padding:"8px 14px",minHeight:"44px",
                        borderRadius:"20px",border:`1px solid ${C.border}`,
                        backgroundColor:C.surface,color:C.textMuted,
                        fontFamily:F.body,fontSize:"12px",fontWeight:500,
                        cursor:"pointer",WebkitTapHighlightColor:"transparent",
                      }}>
                      Done
                      {/* Drawn rather than typed. The "↓" glyph is a hairline
                          at this size and the heavier arrows (⬇ ⇩) are
                          emoji-presentation on Android, so the font decides
                          how thick it looks. An SVG does not care. */}
                      <svg aria-hidden="true" width="14" height="16" viewBox="0 0 14 16"
                        fill="none" stroke="currentColor" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round"
                        style={{display:"block",flexShrink:0}}>
                        <line x1="7" y1="2" x2="7" y2="12"/>
                        <polyline points="2.5,8 7,13 11.5,8"/>
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </div>
            )}

            {/* Ball and surface, below the result.

                These sat between the scoresheet and the result, on the
                argument that the ball is the one thing changed DURING a
                game so it belonged beside the frames. That held while the
                scoresheet was a thin strip; with pin racks it is roughly
                twice as tall, and two dropdowns wedged between the frames
                and the result pushed the thing you actually came here to
                tap below the fold.

                Result first, then equipment: you record WHAT happened
                before you record what you threw it with. The choice still
                carries forward shot to shot and game to game, and still
                resets only for a new session. */}
            {onTab("scoring")&&showShotContext&&logBalls.length>0&&(
              <div style={{...S.card,padding:"10px 12px",marginBottom:"8px",
                display:"grid",gridTemplateColumns:"repeat(2, minmax(0, 1fr))",gap:"10px"}}>
                {/* Ball and surface, side by side.
                    
                    They are one decision -- which ball, in what state --
                    and surface was a whole collapsible card of chips two
                    screens further down. A dropdown costs one row and the
                    pair now reads as the equipment line it always was.
                    
                    minmax(0, 1fr) rather than 1fr: a long ball name has a
                    min-content width that pushes an even split sideways
                    off a phone. */}
                <div style={{minWidth:0}}>
                  <div style={{...S.label,marginBottom:"4px"}}>Ball</div>
                  <select style={{...S.sel,width:"100%",padding:"8px 10px",fontSize:"14px"}}
                    value={form.ball||""}
                    onChange={e=>editingId?toggle("ball",e.target.value):handleBallChange(e.target.value)}>
                    <option value="">— pick a ball —</option>
                    {logBalls.map(b=>{
                      const layout=formatLayout(ballLayouts?.[`${form.bowler}|${b}`]);
                      return <option key={b} value={b}>{layout?`${b} · ${layout}`:b}</option>;
                    })}
                  </select>
                </div>
                <div style={{minWidth:0}}>
                  <div style={{...S.label,marginBottom:"4px"}}>Surface</div>
                  <select style={{...S.sel,width:"100%",padding:"8px 10px",fontSize:"14px"}}
                    value={form.surface||""}
                    onChange={e=>set("surface",e.target.value)}>
                    <option value="">—</option>
                    {SURFACES.map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            )}

            {/* Save Shot, with the shot.
                
                This was a bar fixed to the bottom of the screen. Moving
                it here puts it where the work finishes: you pick a
                result, you save. The sticky bar is now the session
                button, which is the one control that should be reachable
                from anywhere on a long page.
                
                The spare-made warning stays attached to it -- it explains
                why the button is disabled, and separating them left the
                bowler tapping a dead button with the reason somewhere
                off-screen. */}


            {/* Enter game scores directly, without shot-by-shot logging.
                Two cases: a screenshot that only showed game totals, and
                bowlers who want score tracking without logging 30 shots a
                night. A score entered here overrides whatever the shots
                would have computed -- see domain/manualScores.js. */}
            {/* Score entry is available in BOTH tracking modes.
                
                Shot by shot is a choice made at the start of a night, not
                a commitment for all three games -- bowlers get tired of
                logging 30 shots and want to finish on scores without
                abandoning the shot data they already have. Gating this on
                trackingMode forced an all-or-nothing switch.
                
                In shot mode the fields are LOCKED by default: with shots
                being logged, a derived score is already showing, and an
                accidental keystroke silently overriding it would be worse
                than the inconvenience of one extra tap. */}
            {/* Just Bowling gets a scoring TABLE, not a per-bowler form.
            
                A casual night is several people on one lane and one phone
                keeping score, so the natural shape is the sheet on the
                monitor: names down the side, games across the top. That
                also removes the need to keep switching "who's bowling
                for" between every entry -- the whole group is on screen
                at once.
                
                Never collapsible: in this mode it's the only thing on the
                tab that matters. */}
            {/* Scoring tab only: Results shows the night, not the entry table. */}
            {!editingId&&preferences.environment==="casual"&&effectiveSessionLeague&&casualTab!=="results"&&(()=>{
              const people=scoreOptions.length?scoreOptions:[ownerName].filter(Boolean);
              const highest=[1,2,3,4,5,6,7,8,9,10].reduce((hi,g)=>
                people.some(p=>getManualScore(manualScores,p,effectiveSessionLeague,sessionDate,g)!=null)?g:hi,0);
              // Starts at two games, grows on request.
              //
              // Auto-growing by one every time someone filled a column
              // meant the table crept wider on its own and never settled
              // -- there was always one empty column implying another
              // game. Two is the honest default for a casual night, and
              // an explicit button means the width is the bowler's
              // choice rather than a side effect of typing.
              // At least one column, not two: a deleted G2 has to be able
              // to go. New nights still open with two (casualExtraGames
              // starts at 2).
              const cols=Math.min(10,Math.max(1,highest,casualExtraGames));
              const gameNums=Array.from({length:cols},(_,i)=>i+1);
              const getScore=(who,g)=>getManualScore(manualScores,who,effectiveSessionLeague,sessionDate,g);
              // The x beside each game. G2 onwards: the column goes, for
              // everyone, and later games move down. G1 stays -- its x
              // clears the scores. Asks first when there is anything in
              // the column, since it cannot be undone.
              const deleteColumn=g=>{
                if(columnHasScores({people,game:g,get:getScore})){
                  const msg=g===1
                    ?"Clear everyone's game 1 scores?"
                    :`Delete game ${g} for everyone?${g<cols?` Later games move down one.`:""}`;
                  if(typeof window!=="undefined"&&window.confirm&&!window.confirm(msg))return;
                }
                for(const w of deleteGameColumnPlan({people,game:g,lastGame:cols,get:getScore})){
                  updateManualScore(w.who,effectiveSessionLeague,sessionDate,w.game,w.value);
                }
                if(g>1)setCasualExtraGames(Math.max(1,cols-1));
              };

              const NAME_W=92;
              const CELL_W=54;
              return(
                <div style={{...S.card,paddingBottom:"10px"}}>
                  <div style={S.label}>Scores</div>
                  <div style={{fontSize:"11px",color:C.textMuted,marginBottom:"10px"}}>
                    Just the final score for each game. Totals add themselves.
                  </div>

                  {/* The name column is frozen and the games scroll, so a
                      long night doesn't squeeze the names into nothing. */}
                  <div style={{display:"flex",border:`1px solid ${C.border}`,borderRadius:"10px",overflow:"hidden"}}>
                    <div style={{flexShrink:0,width:`${NAME_W}px`,borderRight:`1px solid ${C.border}`,backgroundColor:C.surface}}>
                      <div style={{height:"30px",display:"flex",alignItems:"center",padding:"0 8px",
                                   borderBottom:`1px solid ${C.border}`}}>
                        <span style={{fontSize:"10px",fontWeight:700,color:C.textMuted,letterSpacing:"0.06em"}}>BOWLER</span>
                      </div>
                      {people.map(p=>(
                        <div key={p} style={{height:"42px",display:"flex",alignItems:"center",padding:"0 8px",
                                             borderBottom:`1px solid ${C.border}`}}>
                          <span style={{fontSize:"12px",fontWeight:600,color:C.text,
                                        overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p}</span>
                        </div>
                      ))}
                      <div style={{height:"34px",display:"flex",alignItems:"center",padding:"0 8px"}}>
                        <span style={{fontSize:"11px",fontWeight:700,color:C.textMuted}}>Total</span>
                      </div>
                    </div>

                    <div style={{overflowX:"auto",flex:1}}>
                      <div style={{display:"flex",height:"30px",borderBottom:`1px solid ${C.border}`,backgroundColor:C.surface}}>
                        {gameNums.map(g=>(
                          <div key={g} style={{width:`${CELL_W}px`,flexShrink:0,display:"flex",alignItems:"center",
                                               justifyContent:"center",borderRight:`1px solid ${C.border}`}}>
                            <span style={{fontSize:"10px",fontWeight:700,color:C.textMuted}}>G{g}</span>
                            <button type="button" onClick={()=>deleteColumn(g)}
                              aria-label={g===1?"Clear game 1 scores":`Delete game ${g}`}
                              style={{background:"none",border:"none",padding:"0 0 0 4px",margin:0,cursor:"pointer",
                                      color:C.textMuted,fontSize:"13px",lineHeight:1,opacity:0.75,
                                      WebkitTapHighlightColor:"transparent"}}>×</button>
                          </div>
                        ))}
                      </div>
                      {people.map(p=>(
                        <div key={p} style={{display:"flex",height:"42px",borderBottom:`1px solid ${C.border}`}}>
                          {gameNums.map(g=>{
                            const v=getManualScore(manualScores,p,effectiveSessionLeague,sessionDate,g);
                            return(
                              <div key={g} style={{width:`${CELL_W}px`,flexShrink:0,borderRight:`1px solid ${C.border}`}}>
                                <input
                                  type="number" inputMode="numeric"
                                  value={v==null?"":String(v)}
                                  onChange={e=>updateManualScore(p,effectiveSessionLeague,sessionDate,g,e.target.value)}
                                  aria-label={`${p}, game ${g}`}
                                  style={{width:"100%",height:"100%",border:"none",outline:"none",
                                          background:"transparent",textAlign:"center",
                                          fontSize:"15px",fontWeight:600,color:C.text,
                                          fontFamily:F.num,padding:0}}/>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                      <div style={{display:"flex",height:"34px"}}>
                        {gameNums.map(g=>(
                          <div key={g} style={{width:`${CELL_W}px`,flexShrink:0,borderRight:`1px solid ${C.border}`}}/>
                        ))}
                      </div>
                    </div>

                    {/* Series totals, pinned on the right so they stay
                        visible however far the games scroll. */}
                    <div style={{flexShrink:0,width:"52px",borderLeft:`1px solid ${C.border}`,backgroundColor:C.surface}}>
                      <div style={{height:"30px",display:"flex",alignItems:"center",justifyContent:"center",
                                   borderBottom:`1px solid ${C.border}`}}>
                        <span style={{fontSize:"10px",fontWeight:700,color:C.textMuted}}>TOTAL</span>
                      </div>
                      {people.map(p=>{
                        const t=seriesTotal(gameNums.map(g=>getManualScore(manualScores,p,effectiveSessionLeague,sessionDate,g)));
                        return(
                          <div key={p} style={{height:"42px",display:"flex",alignItems:"center",justifyContent:"center",
                                               borderBottom:`1px solid ${C.border}`}}>
                            <span style={{fontSize:"14px",fontWeight:700,color:t!=null?C.accent:C.textMuted,fontFamily:F.num}}>
                              {t!=null?t:"—"}
                            </span>
                          </div>
                        );
                      })}
                      <div style={{height:"34px"}}/>
                    </div>
                  </div>

                  {cols<10&&(
                    <button style={{...S.btn(),width:"100%",marginTop:"8px",fontSize:"12px"}}
                      onClick={()=>setCasualExtraGames(Math.min(10,cols+1))}>
                      + Add a game
                    </button>
                  )}

                  {/* Adding people lives here now -- the table IS the
                      who's-bowling list, so a separate card for it was
                      the same information twice. */}
                  <div style={{...S.row,marginTop:"10px"}}>
                    <input style={{...S.input,flex:1,fontSize:"13px"}} placeholder="Add someone bowling with you"
                      value={newGuestName} onChange={e=>setNewGuestName(e.target.value)}
                      onKeyDown={e=>{if(e.key==="Enter")addGuestBowler();}}/>
                    <button style={S.btn("sm")} onClick={addGuestBowler}>+</button>
                  </div>
                  {(guests||[]).length>0&&(
                    <div style={{...S.chips,marginTop:"6px"}}>
                      {guests.map(g=>(
                        <Chip key={g} label={`${g}  ×`} dense selected color={C.textMuted}
                          onToggle={()=>removeGuestBowler(g)}/>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}


            {/* Casual and practice get their own recap instead of the
                league summary below: both are scores-only, and the league
                block leans on theoretical scores, releases and misses that
                neither environment records. */}
            {/* The end-session button used to live here, gated to
                exclude league, tournament and drills -- which is why the
                drills tab had no way to finish a session at all. It is
                now the sticky bar at the bottom, unconditional. */}

            {/* Open bowling's first page: Cancel, quiet, under the scores.
                Ending the night is the bottom bar's End Open Bowling &
                View Results, then Save & Finish on Results -- the same two
                steps as every other mode. */}
            {!editingId&&preferences.environment==="casual"&&effectiveSessionLeague&&casualTab!=="results"&&(()=>{
              return (
                <div style={{marginBottom:"12px"}}>
                  {typeof cancelSession==="function"&&(
                    <div style={{marginTop:"10px"}}>
                      {!cancelArmed?(
                        <button
                          style={{background:"none",border:"none",color:C.textMuted,cursor:"pointer",
                                  fontSize:"13px",padding:"8px",width:"100%",
                                  WebkitTapHighlightColor:"transparent"}}
                          onClick={()=>{ setCancelArmed(true); revealBottomOf(cancelRef,{cap:true,allowUp:true}); }}>
                          Cancel Open Bowling
                        </button>
                      ):(
                        <div ref={cancelRef} style={{...S.card,padding:"12px",marginBottom:0}}>
                          <div style={{fontSize:"13px",color:C.text,lineHeight:1.5,marginBottom:"10px"}}>
                            This deletes tonight's open bowling scores for everyone on the sheet and takes you back to Home. This cannot be undone.
                          </div>
                          <div style={{display:"flex",gap:"8px"}}>
                            <button style={{...S.btn(),flex:1}} onClick={()=>setCancelArmed(false)}>
                              Keep bowling
                            </button>
                            <button style={{...S.btn("warn"),flex:1}}
                              onClick={()=>{ setCancelArmed(false); setCasualResultsShown(false); setCasualSpacer(0); cancelSession(); }}>
                              Delete and exit
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}

            {onTab("results")&&!editingId&&(preferences.environment==="practice"||preferences.environment==="casual")&&effectiveSessionLeague&&(
              <SessionRecap
                howItWentRef={howItWentRef}
                // No End Open Bowling here any more: Save & Finish Open
                // Bowling on the bottom bar is the one way to finish.
                onEnd={undefined}
                environment={preferences.environment}
                manualScores={manualScores}
                bowler={activeBowler}
                allBowlers={scoreOptions}
                league={effectiveSessionLeague}
                date={sessionDate}
                priorAverage={practicePriorAverage}
                drills={drills}
                badgesEarnedOnNight={badgesEarnedOnNight}
                leftHandedForBowler={leftHandedForBowler}/>
            )}

            {/* Goals, for the bowler actually at the line. Only rendered
                when they have some -- an empty goals card while logging
                is noise. Deliberately collapsed by default so it doesn't
                push the shot form down the screen. */}
            {/* Goals used to sit here, at the top of Results. Removed:
                they live on Improve, and at the end of a night the
                scores are what a bowler came to see. */}

            {/* Summary */}
            {/* Renders for Results AND Side games: the money card lives
                inside this block alongside the recap, and each child below
                is gated to the tab it belongs on. */}
            {/* Not in practice.
                
                This card is league framing: running averages across your
                leagues, series, money games, "Share tonight". A practice
                night has no league average to move and nothing to share
                as a result, and the practice summary below already says
                what the night was. */}
            {env!=="tournament"&&(onTab("results")||onTab("side"))&&!editingId
              &&preferences.environment!=="casual"&&preferences.environment!=="practice"
              &&curSession&&renderNightSummary()}

            {/* No divider between Result and the fields below it.
                
                It drew a full-width rule across the screen, which reads
                as the end of a section rather than a gap between two
                cards -- and the cards already have their own edges. */}


            {/* Result. Regression fix: the earlier card reorder moved this
                block above its old wrapper without carrying the guard
                with it, so Result rendered unconditionally in every
                tracking mode -- including scores-only, where there is no
                per-shot result to record. */}

            {/* The equipment strip -- ball, surface, line, speed, shoes --
                is part of logging a shot, so it belongs with the shot
                form and nowhere else. It was appearing under Set up,
                Side games and Results, where there is no shot to attach
                it to. */}
            {onTab("scoring")&&showEquipment&&(<>

            {/* Ball — collapsible. Once a bowler settles on a ball they may
                throw it for a dozen frames, so a permanently-expanded grid
                of every ball in the bag is wasted screen. */}
            {/* The second ball picker is gone.
                
                Ball is chosen in the row beside Surface, above. This card
                was the same choice again, further down the same screen,
                writing the same field -- so the two could show different
                balls for one delivery. */}

            {/* Ball Change Reason — only relevant when the ball actually
                changed from the previous shot; collapsed by default. */}
            {(()=>{
              const lastBall=previousShotBall();
              const ballJustChanged=!!lastBall&&!!form.ball&&lastBall!==form.ball;
              if(!ballJustChanged)return null;
              return(
                <CollapsibleCard
                  title="Ball Change Reason"
                  summary={form.ballChangeReason.length?`${form.ballChangeReason.length} selected`:""}
                  expanded={editingId?true:expandedSections.ballChange}
                  onToggle={()=>toggleSection("ballChange")}>
                  <div style={{fontSize:"11px",color:C.textMuted,marginBottom:"10px"}}>Switched from {lastBall} to {form.ball} — why?</div>
                  <div style={S.chips}>
                    {BALL_CHANGE_REASONS.map(r=>(
                      <Chip key={r} label={r} selected={form.ballChangeReason.includes(r)} onToggle={()=>toggleMulti("ballChangeReason",r)}/>
                    ))}
                  </div>
                </CollapsibleCard>
              );
            })()}


            {/* The whole shot-logging form only appears in shot-by-shot
                mode. In game mode it's replaced by the score entry card
                above -- showing both would imply you need to do both.
                Editing an existing shot always shows the form, since
                that's how a logged shot gets corrected. */}
            {onTab("scoring")&&(editingId||(leagueReady&&env!=="casual"&&!(preferences.environment==="practice"&&practiceMode==="drill")))&&(<>
            </>)}

            {/* The accessory details, as a real 2x2 grid.
                
                Two stacked columns did not line up: each column packed
                its own cards, so Shoes began where Line ended (205px)
                while Execution began where Measurements ended (180px)
                and the second row was 25px out of step.
                
                One grid with four children places them row by row, so
                Line sits beside Measurements and Shoes beside Execution,
                actually level.
                
                alignItems:"start" so a short card does not stretch to
                match a tall neighbour. */}
            <div ref={detailsRef} style={{display:"grid",
              gridTemplateColumns:"repeat(2, minmax(0, 1fr))",
              gap:"10px",alignItems:"start"}}>
            {/* Line */}
            {preferences.trackedFields.line&&(
              <div style={S.card}>
                {/* The card header and Start on one row.
                    
                    Start used to sit in a grid of its own below the
                    header, with an empty left cell holding the space open.
                    That left a blank rectangle the width of half the card
                    for no reason -- the header row was already there and
                    already half empty.
                    
                    baseline alignment so the label and the field label sit
                    on the same line rather than the input dragging the
                    header down. */}
                <div style={{...S.label,marginBottom:"8px"}}>
                  Line{!editingId&&currentLane?` · Lane ${currentLane}`:""}
                </div>

                  {/* Four boards, in the order the ball meets them.

                      Reading left to right, top to bottom: where you stand,
                      where you mean to send it, where it actually crossed,
                      and where it turned. Every one is a board number, so
                      they share one grid rather than each getting a row.

                      The breakpoint DISTANCE field is gone. Nobody can
                      judge footage down a lane to any useful precision --
                      the board is something you watch the ball cross, the
                      distance is a guess -- so it cost a tap per shot and
                      returned noise. The ball path drawing now takes the
                      turn distance from the oil pattern length, which is
                      what actually determines it and is already recorded
                      once per session. */}
                  <div style={{display:"grid",
                    gridTemplateColumns:"repeat(2, minmax(0, 1fr))",gap:"8px",marginBottom:"8px"}}>
                    <div style={{minWidth:0}}>
                      <div style={fieldHead}>Stand</div>
                      <input style={{...S.input,...smallInput,width:"100%"}}
                        type="number" inputMode="numeric" placeholder="board #"
                        value={form.startingBoard}
                        onChange={e=>{const v=acceptBoardKeystroke(e.target.value); if(v===null)return;
                          editingId?set("startingBoard",v):handleLineChange("startingBoard",v);}}/>
                    </div>
                    <div style={{minWidth:0}}>
                      <div style={fieldHead}>Target</div>
                      <input style={{...S.input,...smallInput,width:"100%"}}
                        type="number" inputMode="numeric" placeholder="board #"
                        value={form.targetArrows}
                        onChange={e=>{const v=acceptBoardKeystroke(e.target.value); if(v===null)return;
                          editingId?set("targetArrows",v):handleLineChange("targetArrows",v);}}/>
                    </div>
                    <div style={{minWidth:0}}>
                      <div style={fieldHead}>Hit</div>
                      <input style={{...S.input,...smallInput,width:"100%"}}
                        type="number" inputMode="numeric" placeholder="board #"
                        value={form.actualArrows}
                        onChange={e=>{const v=acceptBoardKeystroke(e.target.value); if(v!==null)set("actualArrows",v);}}/>
                    </div>
                    <div style={{minWidth:0}}>
                      <div style={fieldHead}>Breakpoint</div>
                      <input style={{...S.input,...smallInput,width:"100%"}}
                        type="number" inputMode="numeric" placeholder="board #"
                        value={form.breakpointBoard}
                        onChange={e=>{const v=acceptBoardKeystroke(e.target.value); if(v!==null)set("breakpointBoard",v);}}/>
                    </div>
                  </div>
                {(()=>{
                  // The gap between target and actual is the whole point of
                  // recording both: consistently missing the same direction
                  // is an execution problem, which is a different fix from
                  // having picked the wrong line to begin with.
                  // Handedness decides which way the numbers run, so the
                  // maths lives in the domain with a test rather than
                  // inline here -- it was hardcoded as "right" for
                  // everyone, which is backwards for every right-hander.
                  const miss=boardMiss(form.targetArrows,form.actualArrows,activeBowlerLeftHanded);
                  if(!miss)return null;
                  if(miss.boards===0)return(
                    <div style={{fontSize:"12px",color:C.strike,fontWeight:600,marginTop:"6px",textAlign:"center"}}>On target</div>
                  );
                  return(
                    <div style={{fontSize:"12px",color:C.spare,fontWeight:600,marginTop:"6px",textAlign:"center"}}>
                      {miss.boards} board{miss.boards===1?"":"s"} {miss.direction} of target
                    </div>
                  );
                })()}
              </div>
            )}
            {(preferences.trackedFields.ballSpeed||preferences.trackedFields.revRate
              ||preferences.trackedFields.axisRotation||preferences.trackedFields.axisTilt)&&(
              <div style={S.card}>
                <div style={S.label}>Release</div>
                <div style={{display:"grid",
                  gridTemplateColumns:"repeat(2, minmax(0, 1fr))",gap:"8px"}}>
                  {preferences.trackedFields.ballSpeed&&(
                    <div style={{minWidth:0}}>
                      <div style={fieldHead}>Speed</div>
                      <input style={{...S.input,...smallInput,width:"100%"}}
                        type="number" step="0.1" inputMode="decimal" placeholder="mph"
                        value={form.ballSpeed} onChange={e=>set("ballSpeed",e.target.value)}/>
                    </div>
                  )}
                  {preferences.trackedFields.revRate&&(
                    <div style={{minWidth:0}}>
                      <div style={fieldHead}>Rev rate</div>
                      <input style={{...S.input,...smallInput,width:"100%"}}
                        type="number" inputMode="numeric" placeholder="rpm"
                        value={form.revRate} onChange={e=>set("revRate",e.target.value)}/>
                    </div>
                  )}
                  {preferences.trackedFields.axisRotation&&(
                    <div style={{minWidth:0}}>
                      <div style={fieldHead}>Axis rot.</div>
                      <input style={{...S.input,...smallInput,width:"100%"}}
                        type="number" inputMode="numeric" placeholder="degrees"
                        value={form.axisRotation} onChange={e=>set("axisRotation",e.target.value)}/>
                    </div>
                  )}
                  {preferences.trackedFields.axisTilt&&(
                    <div style={{minWidth:0}}>
                      <div style={fieldHead}>Axis tilt</div>
                      <input style={{...S.input,...smallInput,width:"100%"}}
                        type="number" inputMode="numeric" placeholder="degrees"
                        value={form.axisTilt} onChange={e=>set("axisTilt",e.target.value)}/>
                    </div>
                  )}
                </div>
              </div>
            )}
            {preferences.trackedFields.shoes&&(
              <div style={S.card}>
                <div style={S.label}>Shoes</div>
                <div style={{display:"grid",
                  gridTemplateColumns:"repeat(2, minmax(0, 1fr))",gap:"8px"}}>
                  <div style={{minWidth:0}}>
                    <div style={fieldHead}>Heel #</div>
                    <input style={{...S.input,...smallInput,width:"100%"}}
                      inputMode="numeric"
                      value={form.heelNumber} onChange={e=>set("heelNumber",e.target.value)}/>
                  </div>
                  <div style={{minWidth:0}}>
                    <div style={fieldHead}>Sole #</div>
                    <input style={{...S.input,...smallInput,width:"100%"}}
                      inputMode="numeric"
                      value={form.soleNumber} onChange={e=>set("soleNumber",e.target.value)}/>
                  </div>
                </div>
              </div>
            )}
            {/* Execution -- how the shot came out. */}
            {(preferences.trackedFields.release||preferences.trackedFields.miss)&&(
              <div style={S.card}>
                {/* Always open, no collapse.
                    
                    Release and miss are two dropdowns -- one row. A
                    collapse header costs about as much height as the
                    content it hides, so the toggle only ever added a
                    tap to a field filled every shot. */}
                <div style={S.label}>Execution</div>
                {/* Release and miss, side by side.
                    
                    Two stacks of chips took four rows between them for
                    what is one question each. Equal columns, so neither
                    reads as the more important of the pair.
                    
                    Miss still STORES an array even though it picks one.
                    A delivery misses in one direction, but the field has
                    always been a list and everything downstream reads it
                    as one -- changing the shape to match the control
                    would be a data migration dressed as a layout tweak. */}
                {/* Side by side again, so the card is the same height as
                    Shoes beside it -- stacked, Execution ran a row taller
                    and the pair no longer lined up. The dropdowns lose a
                    little inner padding here to leave "Acceptable" room
                    to read. One column when only one is tracked. */}
                <div style={{display:"grid",
                  gridTemplateColumns:(preferences.trackedFields.release&&preferences.trackedFields.miss)
                    ?"repeat(2, minmax(0, 1fr))":"minmax(0, 1fr)",gap:"8px"}}>
                  {preferences.trackedFields.release&&(
                    <div style={{minWidth:0}}>
                      <div style={fieldHead}>Release</div>
                      <select data-compact="" data-tight="" style={{...S.sel,...smallInput,width:"100%",paddingLeft:"8px"}}
                        value={form.release||""}
                        onChange={e=>set("release",e.target.value)}>
                        <option value="">—</option>
                        {RELEASES.map(r=><option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  )}
                  {preferences.trackedFields.miss&&(
                    <div style={{minWidth:0}}>
                      <div style={fieldHead}>Miss</div>
                      <select data-compact="" data-tight="" style={{...S.sel,...smallInput,width:"100%",paddingLeft:"8px"}}
                        value={form.miss?.[0]||""}
                        onChange={e=>set("miss",e.target.value?[e.target.value]:[])}>
                        <option value="">—</option>
                        {MISSES.map(m=><option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )}
            </div>



            {/* Ball Speed — an accessory field like the others: on by
                default in Practice (where comparing speed against outcomes
                is the point), off elsewhere, but opt-in either way. */}

            {/* Rev rate and axis rotation are self-reported estimates -- there's
                no way to measure them without a sensor -- so they're labelled
                as such rather than presented as data. Off by default. */}

            {/* Release Measurements -- speed, revs, rotation and tilt.
                
                Ball speed was its own card directly above this one, which
                split four numbers describing the same delivery across two
                cards for no reason.
                
                "Measurements" rather than "Estimates": a bowler with a
                ball-tracking system has real figures, and calling their
                data an estimate is wrong. The old subtitle told everyone
                these cannot be measured without a sensor, which is both
                untrue for those bowlers and unhelpful for the rest. */}


            {/* Shoes — heel and sole numbers. Interchangeable soles get
                swapped for approach conditions, so this isn't constant for
                a bowler the way shoe size would be. */}

            {/* Save Shot sits AFTER the detail cards, not before them.
                
                It led the screen, so the button came before the fields it
                saves -- a bowler filling in ball, surface, line and speed
                scrolled past Save to reach them, then scrolled back up.
                Last is where a submit belongs. */}
            {onTab("scoring")&&(editingId||(leagueReady&&env!=="casual"
              &&!(preferences.environment==="practice"&&practiceMode==="drill")
              /* Tournament: Scoring tab only. Saving a shot from the
                 Brackets or Results tab is not a thing a bowler means to
                 do, and it appeared on all four. */
              &&(env!=="tournament"||tournamentTab==="scoring")))&&(
              <div style={{marginBottom:"4px"}}>
                {/* Why the button is disabled, next to the button.
                    Pins first: it is the earlier question, and answering
                    it is what makes Spare Made worth asking. */}
                {needsPins?(
                  <div style={{fontSize:"12px",color:C.spare,marginTop:"8px",textAlign:"center"}}>
                    Tap the pins you left standing.
                  </div>
                ):needsSpareMade&&(
                  <div style={{fontSize:"12px",color:C.spare,marginTop:"8px",textAlign:"center"}}>Answer "Spare Made" above to save.</div>
                )}

              </div>
            )}

            {/* Notes -- not in a tournament, where the tournament card
                carries its own day notes and overall notes. Two notes
                fields on one screen is a question about which one to
                use. */}


            </>)}
            </>)}

          {/* Clears the sticky session bar.

              Moved OUT of the shot-mode block above. The bar used to be
              Save Shot, which only appeared in shot mode, so the spacer
              belonged there too. The bar is the session button now and
              shows in every mode -- left where it was, the last card in
              game-tracking and on the drills tab would sit underneath
              it. */}
            {/* Clears whatever is fixed at the bottom.

                In a tournament there is no sticky bar, but the nav is
                still fixed at bottom:0 -- so gating this out with the
                bar left the Save Tournament button tucked under it.
                The nav needs clearing either way. */}
          {/* Matches the footer's own condition exactly.
              
              It carried !editingId while the bar now shows when editing,
              so the bar would have covered the bottom of the form -- the
              same class of bug as the one above, one element over. */}
          </>
          {/* The sticky bar is the SESSION button now, in every mode.
              
              It was Save Shot, which meant the "I'm done" control was an
              inline button somewhere up the page in some modes, missing
              entirely on the drills tab, and in a collapsible card in
              others. Three different places for one idea.
              
              Sits ABOVE the bottom nav, not under it. The nav is fixed at
              bottom:0 with zIndex 100, so this bar -- also fixed at
              bottom:0, zIndex 50 -- rendered behind it and looked like
              the button had vanished. 64px clears the nav; the safe-area
              inset clears the iOS home indicator underneath it. */}
          {/* Not in a tournament. The tournament card has its own Save
              Tournament on the Results tab, and two buttons that both
              end something is a question about which one finishes the
              event. */}
            {/* Practice results: games AND drills, one night.
                
                The two chips each only knew about themselves, so a bowler
                who shot three games and then worked the 10 pin for
                twenty minutes could only ever see half of what they did.
                
                Each half is shown only if it happened -- an empty drills
                section reads as a broken feature rather than a thing you
                did not do that night. */}
            {env==="practice"&&onTab("results")&&!editingId&&activeBowler&&(()=>{
              const ps=practiceSummary({
                sessions, liveScores:gameScores, drills,
                bowler:activeBowler, date:sessionDate,
              });
              if(ps.didNothing) return (
                <div style={{...S.card,fontSize:"13px",color:C.textMuted}}>
                  Nothing logged yet tonight. Shoot a game or run a drill and it lands here.
                </div>
              );
              // Drills are all this card reports now, so a games-only
              // night has nothing to put in it -- and an empty card reads
              // as something that failed to load.
              // Games are all this card reports now, so a drill-only
              // night has nothing to put in it -- Drill Recap above
              // covers that night in full.
              if(!ps.didGames) return null;
              return (
                <div style={S.card}>
                  {/* The Games block is gone.
                      
                      Average, best and total restated the scores that are
                      already in Enter Game Scores a card above -- the same
                      numbers twice on one screen, which invites a bowler to
                      check whether they agree.
                      
                      Drills stay: nothing else on this tab reports them. */}
                  {/* Games, not drills.
                      
                      Drill Recap above already lists every target with its
                      made-of-attempts and the overall line -- this card
                      repeated all of it a few hundred pixels lower.
                      
                      The games summary has no such twin: Enter Game Scores
                      holds the raw numbers, and this is what they add up
                      to. */}
                  {ps.didGames&&(
                    <>
                      <div style={S.label}>Games</div>
                      <div style={{display:"flex",gap:"6px",marginBottom:"8px"}}>
                        <div style={S.statBox}>
                          <div style={{fontSize:"18px",fontWeight:500}}>{ps.games.average}</div>
                          <div style={{fontSize:"11px",color:C.textMuted}}>average</div>
                        </div>
                        <div style={S.statBox}>
                          <div style={{fontSize:"18px",fontWeight:500}}>{ps.games.best}</div>
                          <div style={{fontSize:"11px",color:C.textMuted}}>best</div>
                        </div>
                        <div style={S.statBox}>
                          <div style={{fontSize:"18px",fontWeight:500}}>{ps.games.total}</div>
                          <div style={{fontSize:"11px",color:C.textMuted}}>series</div>
                        </div>
                      </div>
                      <div style={{fontSize:"12px",color:C.textMuted,marginBottom:"10px"}}>
                        {ps.games.games.join(" · ")}
                      </div>
                      {/* What the FRAMES say, when they were logged.
                          
                          Average, best and series is what any scoresheet
                          gives. The reason to record every delivery is that
                          the app can say things a scoresheet cannot, and if
                          a bowler took that trouble the recap owes them the
                          difference.
                          
                          A scores-only practice gets nothing here rather
                          than detail invented from three numbers. */}
                      {(()=>{
                        const st=practiceShotStats(shots,{
                          bowler:activeBowler,league:effectiveSessionLeague,
                          date:sessionDate,isSplit,
                        });
                        if(!st) return null;
                        return (
                          <>
                            <div style={{borderTop:`1px solid ${C.border}`,paddingTop:"10px"}}>
                              <div style={{display:"flex",gap:"6px",marginBottom:"8px"}}>
                                <div style={S.statBox}>
                                  <div style={{fontSize:"16px",fontWeight:500,color:C.strike}}>{st.strikeRate}%</div>
                                  <div style={{fontSize:"11px",color:C.textMuted}}>strikes</div>
                                </div>
                                <div style={S.statBox}>
                                  <div style={{fontSize:"16px",fontWeight:500,color:C.spare}}>
                                    {st.spareRate==null?"—":`${st.spareRate}%`}
                                  </div>
                                  <div style={{fontSize:"11px",color:C.textMuted}}>spares</div>
                                </div>
                                <div style={S.statBox}>
                                  <div style={{fontSize:"16px",fontWeight:500}}>{st.cleanRate}%</div>
                                  <div style={{fontSize:"11px",color:C.textMuted}}>clean</div>
                                </div>
                              </div>
                              <div style={{fontSize:"12px",color:C.textMuted,lineHeight:1.6}}>
                                {st.strikes} of {st.firstBalls} first balls struck
                                {st.spareChances>0&&`, ${st.sparesMade} of ${st.spareChances} spares made`}
                                {st.splits>0&&`, ${st.splits} split${st.splits===1?"":"s"}`}
                                {"."}
                              </div>
                              {/* Only with more than one ball thrown: one ball
                                  is not a comparison. */}
                              {st.bestBall&&(
                                <div style={{fontSize:"12px",color:C.text,marginTop:"6px"}}>
                                  Best carry tonight: {st.bestBall.ball} {"·"} {st.bestBall.rate}%
                                  {" "}over {st.bestBall.first} first balls
                                </div>
                              )}
                            </div>
                          </>
                        );
                      })()}
                    </>
                  )}
                </div>
              );
            })()}


            {/* Notes live at the END of Results, in every mode.
                
                They were on Scoring and hidden in tournaments: a box for
                what you noticed, sitting in the middle of the screen you
                use between shots, and absent from the mode where a block
                is most worth writing down.
                
                Results is where you look back, and last is where a note
                belongs -- after the numbers it is about.*/}
            {/* League and open bowling only. A tournament has its own
                Tournament Notes on the card above, and practice had a
                note nobody asked for at the end of a practice night. */}
            {onTab("results")&&env!=="tournament"&&env!=="practice"&&env!=="casual"&&(
            <CollapsibleCard
              title="Session Notes"
              summary={form.notes?"✓":""}
              expanded={editingId?true:expandedSections.notes}
              onToggle={()=>toggleSection("notes")}>
              <textarea style={{...S.input,minHeight:"60px",resize:"vertical"}}
                placeholder="How the night went, what to try next time…" value={sessionNotes} onChange={e=>setSessionNotes?.(e.target.value)}/>
            </CollapsibleCard>
            )}
            {/* Practice's first page is Games, so its Cancel lives there --
                quiet, at the foot, asking twice, like league's on Set up
                and open bowling's under the scores. Practice had no way
                to discard a session at all. */}
            {!editingId&&env==="practice"&&practiceMode==="games"&&effectiveSessionLeague&&typeof cancelSession==="function"&&(
              <div style={{marginBottom:"12px"}}>
                {!cancelArmed?(
                  <button
                    style={{background:"none",border:"none",color:C.textMuted,cursor:"pointer",
                            fontSize:"13px",padding:"8px",width:"100%",
                            WebkitTapHighlightColor:"transparent"}}
                    onClick={()=>{ setCancelArmed(true); revealBottomOf(cancelRef,{cap:true,allowUp:true}); }}>
                    Cancel Practice
                  </button>
                ):(
                  <div ref={cancelRef} style={{...S.card,padding:"12px",marginBottom:0}}>
                    <div style={{fontSize:"13px",color:C.text,lineHeight:1.5,marginBottom:"10px"}}>
                      This deletes today's practice shots and game scores for{" "}
                      <strong>{form.bowler||activeBowler}</strong> and takes you back to Home. This cannot be undone.
                    </div>
                    <div style={{display:"flex",gap:"8px"}}>
                      <button style={{...S.btn(),flex:1}} onClick={()=>setCancelArmed(false)}>
                        Keep practicing
                      </button>
                      <button style={{...S.btn("warn"),flex:1}}
                        onClick={()=>{ setCancelArmed(false); cancelSession(); }}>
                        Delete and exit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* The spacer goes LAST, after every card.
                
                It sat inside the shot-form fragment, so anything rendered
                after that fragment -- the practice summary, Session Notes
                -- had nothing between it and the sticky bar and got cut
                off at the bottom. A spacer only clears what precedes it. */}
          {env==="casual"&&casualSpacer>0&&<div style={{height:`${casualSpacer}px`}}/>}
          {(editingId||(activeBowler&&effectiveSessionLeague))&&(
            <div style={{height:footerShown?`${footerHeight}px`:"76px"}}/>
          )}

          {/* The bar shows while EDITING too.
              
              !editingId hid the whole footer, so the Update button inside
              it could never render however its own condition read -- which
              is why fixing that condition changed nothing.
              
              Editing needs the bar for Update; it does not need the
              session button, because there is no night in progress to
              end. Each button decides for itself below. */}
          {footerShown&&(
          <div ref={footerRef} style={{position:"fixed",bottom:"calc(64px + env(safe-area-inset-bottom, 0px))",left:0,right:0,zIndex:50,padding:"10px 14px",display:"flex",gap:"8px",backgroundColor:C.bg,borderTop:`1px solid ${C.border}`}}>
            {/* Save Shot, sticky, left of the session button.
                
                In flow it sat below the accessory details, so it scrolled
                off as soon as a bowler opened anything -- the one control
                they press every single shot. Here it is always reachable,
                and the two buttons sit in the order the night runs: save
                this shot, over and over, then end the session once.
                
                Only when there is a shot to save. In game-scores-only
                logging there is no shot form, and a permanent disabled
                button would be a control that never does anything. */}
            {/* editingId first, on its own.
                
                Correcting a logged shot has to be saveable wherever
                you opened it from -- History, a drill, open bowling --
                and none of those satisfy showShotContext. The in-flow
                button this replaced started with editingId for that
                reason; making it sticky dropped the clause and left
                three ways to edit a shot with no way to save it. */}
            {(editingId||(onTab("scoring")&&showShotContext))&&(
              <button style={{...S.btn("primary"),flex:1}}
                onClick={()=>{
                  // Every new frame starts in the same place: the Result
                  // card's bottom just above Save Shot, which leaves most
                  // of Shot Context visible above it. That is the
                  // baseline, and the effect above performs it once the
                  // fresh form has rendered -- not here, where the page
                  // is still the tall one.
                  //
                  // It used to go to the top of Shot Context, which put
                  // the frame counter on screen and the one field the
                  // next shot actually needs below the fold -- most
                  // obviously coming out of the 9th.
                  landAfterSave.current=true;
                  submitShot();
                }}
                disabled={!form.result||!form.bowler||needsPins||needsSpareMade}>
                {saved?(editingId?"✓ Updated":"✓ Saved"):(editingId?"Update":"Save Shot")}
              </button>
            )}
            {/* Not while editing: there is no session in progress to
                end, and "End Practice" beside "Update" invites a bowler to
                finish a night they are not in. */}
            {/* Not in a tournament either: the tournament card has its own
                Save Tournament on Results, and "End Block" beside it asks
                which one finishes the event. */}
            {/* Every mode ends in the same two steps:
                  on Scoring   -> "End <mode> & View Results": to Results,
                                  nothing saved yet;
                  on Results   -> "Save & Finish <mode>": saves, goes home.
                A night is always seen before it is filed. Tournament has
                the same two buttons inside its own screen. League's Set up
                has Start Scoring instead, so nothing ends from there. */}
            {!editingId&&!(env==="league"&&leagueTab==="setup")
              &&!(env==="tournament"&&tournamentTab!=="scoring"&&tournamentTab!=="match")&&(()=>{
              const name=env==="practice"?"Practice":env==="league"?"League":env==="tournament"?"Tournament":"Open Bowling";
              // Tournament's Save & Finish is on its Results tab, inside
              // the tournament screen, so the bar only ever moves it on.
              const onResults=env==="tournament"?false
                :env==="practice"?practiceMode==="results"
                :env==="league"?leagueTab==="results":casualTab==="results";
              const toResults=()=>{
                if(env==="casual"){
                  const people=scoreOptions.length?scoreOptions:[ownerName].filter(Boolean);
                  if(!casualRecap(manualScores,people,effectiveSessionLeague,sessionDate)){
                    setCasualMsg("Enter a score first");
                    setTimeout(()=>setCasualMsg(""),2000);
                    return;
                  }
                  setCasualResultsShown(true);
                  setCasualTab("results");
                }
                else if(env==="practice")setPracticeMode("results");
                else if(env==="tournament")setTournamentTab("results");
                else setLeagueTabChoice("results");
                try{window.scrollTo({top:0});}catch{}
              };
              const saveAndFinish=env==="casual"
                ?async()=>{ await saveCasualResults?.(); setCasualResultsShown(false); setCasualSpacer(0); setCasualTab("scoring"); endCasual?.(); }
                :submitSession;
              return (
                <button style={{...S.btn("primary"),flex:1}} onClick={onResults?saveAndFinish:toResults}>
                  {(env==="casual"&&casualMsg)||sessionSaveMessage||(sessionSaved
                    ?"✓ Session Saved"
                    :onResults?`Save & Finish ${name}`:`End ${name} & View Results`)}
                </button>
              );
            })()}
          </div>
          )}

    </>
  );
}
