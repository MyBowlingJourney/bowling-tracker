import journeyIcon from "../journey-icon.png";
import practiceIcon from "./assets/home-icons/practice.png";
import leagueIcon from "./assets/home-icons/league.png";
import tournamentIcon from "./assets/home-icons/tournament.png";
import openBowlingIcon from "./assets/home-icons/open-bowling.png";
import { C, S, ActionRow } from "./ui.jsx";
import { useLayoutEffect, useRef, useState } from "react";
import { recordError } from "./errorLogStore.js";
import { seasonFigures, journeyRecap, latestNight, activeSeasonWindow } from "./domain/home.js";
import { scratchRecordLeagues } from "./domain/tournaments.js";
import { journeyMilestones, upcomingMilestones, describeUpcoming } from "./domain/journey.js";
import { formatDate } from "./constants.js";
import { progressPercent } from "./domain/progressPercent.js";


import { ENVIRONMENTS, ENVIRONMENT_COLORS, ENVIRONMENT_LABELS, ENVIRONMENT_DESCRIPTIONS } from "./domain/preferences.js";

function ModeIcon({ mode }) {
  const icons = {
    practice: practiceIcon,
    league: leagueIcon,
    tournament: tournamentIcon,
    open: openBowlingIcon,
  };
  const src = icons[mode] || openBowlingIcon;
  return (
    <span className="mbj-mode-icon" aria-hidden="true" style={{width:"46px",height:"46px",borderRadius:"12px",background:"none",boxShadow:"none"}}>
      <img src={src} width="46" height="46" alt="" style={{display:"block",width:"46px",height:"46px",borderRadius:"12px",objectFit:"contain"}} />
    </span>
  );
}

// The screen the app opens on, when a night is not under way.
//
// It answers "how am I bowling?" before anyone taps anything. The app
// used to open on a setup form -- a question -- which is the wrong first
// thing to show someone who has already logged twenty nights.
//
// Everything here is derived from stored data and links somewhere
// deeper. Home holds no truth of its own: if a number here differs from
// the Stats screen, that is a bug rather than a second opinion.
export default function HomeView({
  sessions = [], shots = [], tournaments = [], bowler = "",
  leagues = [], onOpenJourney, onOpenStats, onPickMode, badgeCount = 0,
  today = "", onOpenNight, leagueDates = {}, userId = "",
  // { leagueName: "tenpin" | "notap9" } -- no-tap leagues are left out of
  // high game and high series (seasonFigures).
  leagueFormats = {},
}) {
  // Home fits between the header and the bottom nav, with no scrolling.
  //
  // It measures the room it has -- from its own top to the top of the nav
  // bar -- rather than assuming a header height, which changes with the
  // status bar and with which header buttons are showing. The sections
  // are spaced evenly inside that height, and the mode grid is the part
  // that gives way on a short phone.
  const boxRef = useRef(null);
  const [fitHeight, setFitHeight] = useState(null);
  // A phone too short for even the compact cards: Home grows past the
  // fit height and scrolls, with room under it to clear the nav, rather
  // than tucking the last row behind it.
  const [overflowing, setOverflowing] = useState(false);
  const [compact, setCompact] = useState(false);
  // How hard Home is squeezing to fit: 0 roomy, 1 tight, 2 tightest.
  //
  // Measuring alone was never enough. The old pass detected that the
  // content was taller than the space and then simply gave up -- it set
  // `overflowing`, let the height go to auto and allowed the page to
  // scroll. Home is meant to be one screen, so instead it now steps the
  // density down and measures again, and only falls back to scrolling on
  // a viewport too short for even the tightest pass.
  const [density, setDensity] = useState(0);

  // ── The measuring pass has to be able to STOP ───────────────────────
  //
  // It runs after every render and sets state from what it measures, and
  // that state changes the layout it measures next time. When two of those
  // answers disagree -- compact cards make the grid taller, a taller grid
  // says "not compact", full-size cards make it shorter again -- it flips
  // back and forth forever, React gives up after fifty nested updates, and
  // Home crashes with error #185 ("Maximum update depth exceeded").
  //
  // That is what a free-plan account hit: fewer leagues changed the
  // content height just enough to land between the two answers. Two
  // guards, so no content can do it again:
  //
  //   1. Hysteresis on `compact`, like the dead band density already has:
  //      switch to compact below 100px a row, back only above 120px.
  //   2. A cap. More than MAX_PASSES consecutive passes that each changed
  //      something means it is not converging, so it stops, falls back to
  //      scrolling (always safe), and waits for a resize or new content.
  //   3. Measuring happens in the NEXT animation frame, never inside the
  //      commit. A setState inside a layout effect re-renders
  //      synchronously and counts toward React's limit of fifty; from a
  //      frame callback it is an ordinary update that cannot nest. The
  //      first two guards alone did not stop the crash on a real phone,
  //      so this one removes the mechanism React counts rather than
  //      trying to stay under it.
  const MAX_PASSES = 6;
  const passesRef = useRef(0);
  const settledKey = `${sessions.length}|${tournaments.length}|${leagues.length}|${bowler}|${badgeCount}|${today}`;
  const lastKeyRef = useRef(settledKey);
  if (lastKeyRef.current !== settledKey) {
    lastKeyRef.current = settledKey;
    passesRef.current = 0;
  }
  useLayoutEffect(() => {
    function measure(fromResize) {
      if (fromResize === true) passesRef.current = 0;
      if (passesRef.current > MAX_PASSES) return;
      const el = boxRef.current;
      if (!el || typeof document === "undefined") return;
      let changed = false;
      const nav = document.querySelector("[data-bottom-nav]");
      const bottom = nav ? nav.getBoundingClientRect().top : window.innerHeight;
      const top = el.getBoundingClientRect().top + (window.scrollY || 0);
      const h = Math.floor(bottom - top - 12);
      if (h > 0) {
        if (h !== fitHeight) { setFitHeight(h); changed = true; }
        // Minus the padding this state itself adds, or it could never
        // switch back once added (a rotated phone, say).
        const pad = parseFloat(getComputedStyle(el).paddingBottom) || 0;
        const need = el.scrollHeight - pad;
        // One step per pass, up or down, with a dead band between the two
        // thresholds. Stepping by one and re-measuring on the next frame
        // keeps this from oscillating between two densities that both
        // "fit" by their own measurement.
        if (need > h + 1 && density < 2) { setDensity(density + 1); changed = true; }
        else if (density > 0 && need < h - 56) { setDensity(density - 1); changed = true; }
        const over = need > h + 1 && density >= 2;
        if (over !== overflowing) { setOverflowing(over); changed = true; }
      }
      const grid = el.querySelector(".mbj-mode-grid");
      if (grid) {
        const row = (grid.clientHeight - 10) / 2;
        const nextCompact = compact ? row < 120 : row < 100;
        if (nextCompact !== compact) { setCompact(nextCompact); changed = true; }
      }
      if (!changed) { passesRef.current = 0; return; }
      passesRef.current += 1;
      // Not converging: stop here in the one state that always works --
      // content at its natural height, scrolling if it has to. Logged so
      // Diagnostics shows whether this is still happening.
      if (passesRef.current > MAX_PASSES) {
        if (!overflowing) setOverflowing(true);
        recordError({ kind: "render", where: "HomeView.measure", message: `layout did not settle (density ${density}, compact ${compact})` });
      }
    }
    const raf = typeof requestAnimationFrame === "function" ? requestAnimationFrame : (f => setTimeout(f, 16));
    const caf = typeof cancelAnimationFrame === "function" ? cancelAnimationFrame : clearTimeout;
    const frame = raf(() => measure());
    let resizeFrame = null;
    const onResize = () => { caf(resizeFrame); resizeFrame = raf(() => measure(true)); };
    window.addEventListener("resize", onResize);
    return () => {
      caf(frame);
      caf(resizeFrame);
      window.removeEventListener("resize", onResize);
    };
  });
  const recent = latestNight(sessions, tournaments, { bowler });

  // In season, the card means the season. Out of season -- or before any
  // league has its dates set -- it means the career, and says so.
  const seasonWindow = activeSeasonWindow(leagueDates, { leagues, today });
  const figures = seasonFigures(sessions, {
    bowler, leagues,
    since: seasonWindow.inSeason ? seasonWindow.since : null,
    // A best game is a best game wherever it was shot. Tournament
    // scores stay out of the average -- a different pattern and a
    // different discipline -- but a scratch ten-pin event can hold the
    // record, and a three-game one can hold the series too.
    tournamentRecords: scratchRecordLeagues(tournaments, userId),
    noTapLeagues: Object.keys(leagueFormats || {}).filter(n => leagueFormats[n] === "notap9"),
  });
  // Distinct seasons behind a career figure, for "96 games - 4 seasons".
  const careerSeasons = seasonWindow.inSeason ? 0 : (() => {
    const yrs = new Set();
    for (const s of sessions || []) {
      if (!s || s.bowler !== bowler || !s.date) continue;
      const d = String(s.date);
      // A season spans a year boundary, so it is named by the year it
      // STARTED: anything before August belongs to the season that began
      // the previous calendar year.
      const y = Number(d.slice(0, 4)), m = Number(d.slice(5, 7));
      if (!Number.isFinite(y) || !Number.isFinite(m)) continue;
      yrs.add(m >= 8 ? y : y - 1);
    }
    return yrs.size;
  })();
  const seasonHeading = seasonWindow.inSeason ? "This season" : "Your career";
  const scopeLabel = seasonWindow.inSeason
    ? (seasonWindow.label || "League season")
    : (seasonWindow.configured ? "Between seasons" : "All league play");
  // The heading says LEAGUE average, because that is all it is: practice,
  // open bowling and tournaments never count toward it (seasonFigures).
  // High game and series beside it can come from a scratch ten-pin
  // tournament too, so the word belongs on the average alone.
  const averageCaption = seasonWindow.inSeason ? "this season" : "career";
  const countLabel = !figures.games ? "No games yet"
    : seasonWindow.inSeason ? `${figures.games} games logged`
    : `${figures.games} games${careerSeasons > 1 ? ` · ${careerSeasons} seasons` : ""}`;
  // The record-tie badge. Two or more only: "x1" is just the record.
  const tieBadge = n => (n > 1 ? (
    <span style={{display:"inline-block",marginLeft:"5px",fontFamily:"Archivo, system-ui, sans-serif",
      fontSize:"11px",fontWeight:800,color:C.strike,background:C.strike+"1f",
      border:`1px solid ${C.strike}55`,borderRadius:"999px",padding:"1px 6px",
      verticalAlign:"middle",whiteSpace:"nowrap"}}>×{n}</span>
  ) : null);
  const recap = journeyRecap(journeyMilestones(
    (sessions || []).filter(s => s && s.bowler === bowler),
    tournaments,
    (shots || []).filter(s => s && s.bowler === bowler),
  ));
  // The nearest next step, as a teaser on the card that opens Journey:
  // "4 pins short of a 700 series" is the reason to tap it.
  const nextUp = upcomingMilestones(
    (sessions || []).filter(s => s && s.bowler === bowler),
    tournaments,
    (shots || []).filter(s => s && s.bowler === bowler),
    1,
  )[0] || null;

  const stat = (label, value, suffix) => (
    <div style={{
      flex: 1, minWidth: 0, textAlign: "center",
      // No border and no fill: these sit INSIDE the season card now, and
      // a bordered box inside a bordered box reads as three cards that
      // happen to be adjacent rather than one figure in three parts.
    }}>
      <div style={{ fontSize: "27px", fontWeight: 700, color: C.accent, fontFamily: "Roboto Condensed, Archivo, system-ui, sans-serif", letterSpacing: "-0.025em" }}>
        {value === null || value === undefined ? "—" : value}
      </div>
      <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "2px" }}>
        {label}
      </div>
      {suffix && (
        <div style={{ fontSize: "10px", color: C.textMuted }}>{suffix}</div>
      )}
    </div>
  );

  return (
    <div ref={boxRef} className={`mbj-home-fit${density ? ` mbj-home-fit--d${density}` : ""}`}
      style={{display:"flex",flexDirection:"column",justifyContent:"space-between",
        gap:density >= 2 ? "4px" : density === 1 ? "7px" : "10px",
        minHeight:fitHeight?`${fitHeight}px`:"auto",
        height:fitHeight&&!overflowing?`${fitHeight}px`:"auto",
        // Padding, not margin: a margin collapses out through the
        // parents and the page never grows, so nothing scrolls.
        paddingBottom:overflowing?"calc(90px + env(safe-area-inset-bottom, 0px))":0}}>
      <div style={{
        padding:"2px 2px 0",display:"flex",alignItems:"flex-end",justifyContent:"space-between",gap:"12px"
      }}>
        <div>
          <div style={{fontSize:"11px",fontWeight:800,letterSpacing:"0.12em",textTransform:"uppercase",color:C.accent,marginBottom:"5px"}}>Your bowling</div>
          <div style={{fontFamily:"Archivo Expanded, Archivo, system-ui, sans-serif",fontSize:density>=2?"20px":density===1?"23px":"27px",fontWeight:800,lineHeight:1.05,letterSpacing:"-0.045em",color:C.text}}>{seasonHeading}</div>
        </div>
      </div>

      <button onClick={onOpenStats} style={{
        width:"100%",textAlign:"left",cursor:"pointer",fontFamily:"inherit",padding:"0",flexShrink:0,
        background:C.card,border:`1px solid ${C.border}`,borderRadius:"24px",overflow:"hidden",
        boxShadow:`0 18px 40px ${C.bg}40, inset 0 1px 0 ${C.text}10`
      }}>
        <div className="mbj-home-card" style={{padding:"14px 16px 12px",background:`linear-gradient(135deg, ${C.accent}12, transparent 62%)`}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"10px"}}>
            <span style={{fontSize:"12px",fontWeight:700,color:C.textMuted,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{scopeLabel}</span>
            <span style={{fontSize:"12px",fontWeight:700,color:C.accent,flexShrink:0}}>{countLabel}</span>
          </div>
          <div style={{display:"flex",alignItems:"flex-end",gap:"10px"}}>
            {/* The average gives up a little width so the two boxes can
                hold "HIGH SERIES" on one line; stacked, its number sat
                lower than High game's and the pair no longer lined up. */}
            <div style={{minWidth:0,flex:"1 1 0"}}>
              <div style={{fontSize:"11px",fontWeight:800,textTransform:"uppercase",letterSpacing:"0.08em",color:C.textMuted}}>League average</div>
              <div style={{fontFamily:"Roboto Condensed, Archivo, system-ui, sans-serif",fontSize:density>=2?"30px":density===1?"35px":"40px",fontWeight:800,lineHeight:.95,letterSpacing:"-0.045em",color:C.text}}>{figures.average ?? "—"}</div>
              <div style={{fontSize:"12px",color:C.textMuted,marginTop:"3px"}}>{averageCaption}</div>
            </div>
            <div style={{width:"1px",height:"54px",background:C.border,flexShrink:0}}/>
            <div style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) minmax(0,1fr)",gap:"8px",flex:"1.9 1 0"}}>
              <div style={{padding:"9px 8px",borderRadius:"14px",background:C.surface,border:`1px solid ${C.border}`,minWidth:0}}>
                <div style={{fontSize:"clamp(9px, 2.6vw, 10px)",fontWeight:800,textTransform:"uppercase",letterSpacing:"0.03em",color:C.textMuted,whiteSpace:"nowrap"}}>High game</div>
                <div style={{fontFamily:"Roboto Condensed, Archivo, system-ui, sans-serif",fontSize:"25px",fontWeight:800,color:C.text,marginTop:"2px"}} className="mbj-home-num">{figures.highGame ?? "—"}{tieBadge(figures.highGameCount)}</div>
              </div>
              <div style={{padding:"9px 8px",borderRadius:"14px",background:C.surface,border:`1px solid ${C.border}`,minWidth:0}}>
                <div style={{fontSize:"clamp(9px, 2.6vw, 10px)",fontWeight:800,textTransform:"uppercase",letterSpacing:"0.03em",color:C.textMuted,whiteSpace:"nowrap"}}>High series</div>
                <div style={{fontFamily:"Roboto Condensed, Archivo, system-ui, sans-serif",fontSize:"25px",fontWeight:800,color:C.text,marginTop:"2px"}} className="mbj-home-num">{figures.highSeries ?? "—"}{tieBadge(figures.highSeriesCount)}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mbj-home-foot" style={{padding:"8px 16px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",background:C.surface}}>
          <span style={{fontSize:"12px",fontWeight:700,color:C.textMuted}}>Open full statistics</span>
          <span aria-hidden="true" style={{color:C.accent,fontSize:"19px"}}>›</span>
        </div>
      </button>

      <button onClick={onOpenJourney} style={{
        width:"100%",textAlign:"left",cursor:"pointer",fontFamily:"inherit",padding:"0",flexShrink:0,
        background:`linear-gradient(145deg, ${C.accent}18, ${C.card} 58%)`,
        border:`1px solid ${C.accent}55`,borderRadius:"24px",overflow:"hidden",
        boxShadow:`0 18px 42px ${C.accent}18, inset 0 1px 0 ${C.text}12`
      }}>
        <div style={{padding:"13px 15px 14px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"10px"}}>
            <span style={{display:"flex",alignItems:"center",gap:"9px"}}>
              <img src={journeyIcon} alt="" aria-hidden="true" style={{width:"34px",height:"34px",borderRadius:"10px",display:"block",boxShadow:`0 6px 14px ${C.bg}35`}} />
              <span>
                <span style={{display:"block",fontSize:"12px",fontWeight:800,color:C.accent,textTransform:"uppercase",letterSpacing:"0.08em"}}>My Bowling Journey</span>
                <span style={{display:"block",fontSize:"11px",color:C.textMuted,marginTop:"1px"}}>{badgeCount > 0 ? `${badgeCount} badges earned` : "Your milestones and progress"}</span>
              </span>
            </span>
            <span style={{color:C.accent,fontSize:"22px"}}>›</span>
          </div>

          {recap ? (
            <>
              <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",gap:"10px",marginTop:"10px"}}>
                <div>
                  <div style={{fontSize:"11px",fontWeight:800,textTransform:"uppercase",letterSpacing:"0.07em",color:C.textMuted}}>Latest milestone</div>
                  <div style={{fontSize:"20px",fontWeight:800,color:C.text,marginTop:"2px",lineHeight:1.15,letterSpacing:"-0.025em"}}>{recap.label}</div>
                  <div style={{fontSize:"11px",color:C.textMuted,marginTop:"5px"}}>{formatDate(recap.date,{weekday:false})} · {recap.total} milestone{recap.total===1?"":"s"} so far</div>
                </div>
                {nextUp && <div style={{padding:"7px 9px",borderRadius:"12px",background:C.surface,border:`1px solid ${C.border}`,fontSize:"11px",fontWeight:800,color:C.accent,whiteSpace:"nowrap"}}>Next · {describeUpcoming(nextUp).split(" · ")[0]}</div>}
              </div>
              {nextUp && (
                <div style={{marginTop:"10px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:"11px",fontWeight:700,color:C.textMuted,marginBottom:"6px"}}>
                    <span>Progress to next milestone</span><span style={{color:C.accent}}>{progressPercent(nextUp.progress)}%</span>
                  </div>
                  <div style={{height:"8px",borderRadius:"999px",background:C.surface,overflow:"hidden",border:`1px solid ${C.border}`}}>
                    <div style={{width:`${Math.max(4,progressPercent(nextUp.progress))}%`,height:"100%",borderRadius:"999px",background:`linear-gradient(90deg, ${C.accent}, ${C.strike})`}}/>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{marginTop:"10px",fontSize:"18px",fontWeight:700,color:C.text}}>Your bowling story starts here.</div>
          )}
        </div>
      </button>

      <div className="mbj-home-prompt" style={{padding:"0 2px",flexShrink:0}}>
        <div style={{fontSize:density>=1?"18px":"21px",fontWeight:800,color:C.text,letterSpacing:"-0.025em"}}>What are you doing today?</div>
      </div>

      <div className={`mbj-mode-grid${compact ? " mbj-mode-grid--compact" : ""}`}>
        {ENVIRONMENTS.map(env => {
          const description = ENVIRONMENT_DESCRIPTIONS[env] || "";
          return (
            <button key={env} type="button" onClick={() => onPickMode?.(env)} className="mbj-mode-card"
              aria-label={description ? `${ENVIRONMENT_LABELS[env]}. ${description}` : ENVIRONMENT_LABELS[env]}
              style={{"--mode-color": ENVIRONMENT_COLORS[env] || C.accent}}>
              <span className="mbj-mode-icon" aria-hidden="true"><ModeIcon mode={env} color={ENVIRONMENT_COLORS[env] || C.accent} /></span>
              {/* Name only. The one-line descriptions were cut off by the
                  card edge on real phones, and the names say enough. The
                  full text stays in the button's label for screen readers. */}
              <span className="mbj-mode-copy">
                <span className="mbj-mode-label">{ENVIRONMENT_LABELS[env]}</span>
              </span>
              <span className="mbj-mode-arrow" aria-hidden="true">›</span>
            </button>
          );
        })}
      </div>

      {/* The most recent night, one line, opening its results. Replaces
          the Recent tournament card, which could not fit on a Home that
          does not scroll -- and a tournament is only one kind of night. */}
      {recent && (
        <button type="button" onClick={() => onOpenNight?.(recent)}
          aria-label={`Open results for ${recent.kind} night, ${formatDate(recent.date, { weekday: false })}`}
          className="mbj-home-latest"
          style={{
            width:"100%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"space-between",gap:"10px",
            padding:"12px 14px",borderRadius:"14px",cursor:"pointer",fontFamily:"inherit",textAlign:"left",
            background:C.card,border:`1px solid ${C.border}`,color:C.text,
          }}>
          {/* Only the league name shortens: "Latest" and the date always show. */}
          <span style={{fontSize:"13px",color:C.textMuted,minWidth:0,display:"flex",gap:"4px",whiteSpace:"nowrap"}}>
            <span style={{flexShrink:0}}>Latest ·</span>
            <b style={{color:C.text,minWidth:0,overflow:"hidden",textOverflow:"ellipsis"}}>{recent.kind === "league"
              ? String(recent.league).replace(" House Shot", "")
              : recent.kind === "practice" ? "Practice" : recent.league}</b>
            <span style={{flexShrink:0}}>· {formatDate(recent.date, { weekday: false })}</span>
          </span>
          <span style={{fontSize:"13px",fontWeight:800,color:C.accent,flexShrink:0}}>
            {recent.average != null ? `${recent.average} avg` : "Results"} ›
          </span>
        </button>
      )}
    </div>
  );
}
