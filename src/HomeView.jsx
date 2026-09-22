import journeyIcon from "../journey-icon.png";
import practiceIcon from "./assets/home-icons/practice.png";
import leagueIcon from "./assets/home-icons/league.png";
import tournamentIcon from "./assets/home-icons/tournament.png";
import openBowlingIcon from "./assets/home-icons/open-bowling.png";
import { C, S, ActionRow } from "./ui.jsx";
import { useLayoutEffect, useRef, useState } from "react";
import { seasonFigures, journeyRecap, latestNight } from "./domain/home.js";
import { journeyMilestones, upcomingMilestones, describeUpcoming } from "./domain/journey.js";
import { formatDate } from "./constants.js";


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
  today = "", onOpenNight,
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
  useLayoutEffect(() => {
    function measure() {
      const el = boxRef.current;
      if (!el || typeof document === "undefined") return;
      const nav = document.querySelector("[data-bottom-nav]");
      const bottom = nav ? nav.getBoundingClientRect().top : window.innerHeight;
      const top = el.getBoundingClientRect().top + (window.scrollY || 0);
      const h = Math.floor(bottom - top - 12);
      if (h > 0) {
        setFitHeight(h);
        // Minus the padding this state itself adds, or it could never
        // switch back once added (a rotated phone, say).
        const pad = parseFloat(getComputedStyle(el).paddingBottom) || 0;
        setOverflowing(el.scrollHeight - pad > h + 1);
      }
      const grid = el.querySelector(".mbj-mode-grid");
      if (grid) setCompact((grid.clientHeight - 10) / 2 < 100);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  });
  const recent = latestNight(sessions, tournaments, { bowler });

  const figures = seasonFigures(sessions, { bowler, leagues });
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
    <div ref={boxRef} className="mbj-home-fit"
      style={{display:"flex",flexDirection:"column",justifyContent:"space-between",gap:"10px",
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
          <div style={{fontFamily:"Archivo Expanded, Archivo, system-ui, sans-serif",fontSize:"27px",fontWeight:800,lineHeight:1.05,letterSpacing:"-0.045em",color:C.text}}>This season</div>
        </div>
      </div>

      <button onClick={onOpenStats} style={{
        width:"100%",textAlign:"left",cursor:"pointer",fontFamily:"inherit",padding:"0",flexShrink:0,
        background:C.card,border:`1px solid ${C.border}`,borderRadius:"24px",overflow:"hidden",
        boxShadow:`0 18px 40px ${C.bg}40, inset 0 1px 0 ${C.text}10`
      }}>
        <div style={{padding:"14px 16px 12px",background:`linear-gradient(135deg, ${C.accent}12, transparent 62%)`}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"10px"}}>
            <span style={{fontSize:"12px",fontWeight:700,color:C.textMuted}}>League season</span>
            <span style={{fontSize:"12px",fontWeight:700,color:C.accent}}>{figures.games ? `${figures.games} games logged` : "No games yet"}</span>
          </div>
          <div style={{display:"flex",alignItems:"flex-end",gap:"10px"}}>
            <div style={{minWidth:0,flex:"1.25 1 0"}}>
              <div style={{fontSize:"11px",fontWeight:800,textTransform:"uppercase",letterSpacing:"0.08em",color:C.textMuted}}>Average</div>
              <div style={{fontFamily:"Roboto Condensed, Archivo, system-ui, sans-serif",fontSize:"40px",fontWeight:800,lineHeight:.95,letterSpacing:"-0.045em",color:C.text}}>{figures.average ?? "—"}</div>
              <div style={{fontSize:"12px",color:C.textMuted,marginTop:"3px"}}>season average</div>
            </div>
            <div style={{width:"1px",height:"54px",background:C.border,flexShrink:0}}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",flex:"1.5 1 0"}}>
              <div style={{padding:"9px 10px",borderRadius:"14px",background:C.surface,border:`1px solid ${C.border}`}}>
                <div style={{fontSize:"10px",fontWeight:800,textTransform:"uppercase",letterSpacing:"0.06em",color:C.textMuted}}>High game</div>
                <div style={{fontFamily:"Roboto Condensed, Archivo, system-ui, sans-serif",fontSize:"25px",fontWeight:800,color:C.text,marginTop:"2px"}}>{figures.highGame ?? "—"}</div>
              </div>
              <div style={{padding:"9px 10px",borderRadius:"14px",background:C.surface,border:`1px solid ${C.border}`}}>
                <div style={{fontSize:"10px",fontWeight:800,textTransform:"uppercase",letterSpacing:"0.06em",color:C.textMuted}}>High series</div>
                <div style={{fontFamily:"Roboto Condensed, Archivo, system-ui, sans-serif",fontSize:"25px",fontWeight:800,color:C.text,marginTop:"2px"}}>{figures.highSeries ?? "—"}</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{padding:"8px 16px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",background:C.surface}}>
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
                    <span>Progress to next milestone</span><span style={{color:C.accent}}>{Math.round(nextUp.progress*100)}%</span>
                  </div>
                  <div style={{height:"8px",borderRadius:"999px",background:C.surface,overflow:"hidden",border:`1px solid ${C.border}`}}>
                    <div style={{width:`${Math.max(4,Math.round(nextUp.progress*100))}%`,height:"100%",borderRadius:"999px",background:`linear-gradient(90deg, ${C.accent}, ${C.strike})`}}/>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{marginTop:"10px",fontSize:"18px",fontWeight:700,color:C.text}}>Your bowling story starts here.</div>
          )}
        </div>
      </button>

      <div style={{padding:"0 2px",flexShrink:0}}>
        <div style={{fontSize:"21px",fontWeight:800,color:C.text,letterSpacing:"-0.025em"}}>What are you doing today?</div>
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
          style={{
            width:"100%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"space-between",gap:"10px",
            padding:"12px 14px",borderRadius:"14px",cursor:"pointer",fontFamily:"inherit",textAlign:"left",
            background:C.card,border:`1px solid ${C.border}`,color:C.text,
          }}>
          <span style={{fontSize:"13px",color:C.textMuted,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
            Latest · <b style={{color:C.text}}>{recent.kind === "league"
              ? String(recent.league).replace(" House Shot", "")
              : recent.kind === "practice" ? "Practice" : recent.league}</b> · {formatDate(recent.date, { weekday: false })}
          </span>
          <span style={{fontSize:"13px",fontWeight:800,color:C.accent,flexShrink:0}}>
            {recent.average != null ? `${recent.average} avg` : "Results"} ›
          </span>
        </button>
      )}
    </div>
  );
}
