import journeyIcon from "../journey-icon.png";
import practiceIcon from "./assets/home-icons/practice.png";
import leagueIcon from "./assets/home-icons/league.png";
import tournamentIcon from "./assets/home-icons/tournament.png";
import openBowlingIcon from "./assets/home-icons/open-bowling.png";
import { C, S, ActionRow } from "./ui.jsx";
import { seasonFigures, journeyRecap, recentTournament } from "./domain/home.js";
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
    <span className="mbj-mode-icon" aria-hidden="true" style={{width:"64px",height:"64px",borderRadius:"16px",background:"none",boxShadow:"none"}}>
      <img src={src} width="64" height="64" alt="" style={{display:"block",width:"64px",height:"64px",borderRadius:"16px",objectFit:"contain"}} />
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
  today = "",
}) {
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
    <>
      <div style={{
        marginBottom:"18px",padding:"2px 2px 0",display:"flex",alignItems:"flex-end",justifyContent:"space-between",gap:"12px"
      }}>
        <div>
          <div style={{fontSize:"11px",fontWeight:800,letterSpacing:"0.12em",textTransform:"uppercase",color:C.accent,marginBottom:"5px"}}>Your bowling</div>
          <div style={{fontFamily:"Archivo Expanded, Archivo, system-ui, sans-serif",fontSize:"27px",fontWeight:800,lineHeight:1.05,letterSpacing:"-0.045em",color:C.text}}>This season</div>
        </div>
        <button onClick={onOpenStats} aria-label="Open statistics" style={{border:`1px solid ${C.accent}44`,background:C.accentDim,color:C.accent,borderRadius:"999px",padding:"8px 11px",fontSize:"12px",fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>View stats</button>
      </div>

      <button onClick={onOpenStats} style={{
        width:"100%",textAlign:"left",cursor:"pointer",fontFamily:"inherit",padding:"0",marginBottom:"14px",
        background:C.card,border:`1px solid ${C.border}`,borderRadius:"24px",overflow:"hidden",
        boxShadow:`0 18px 40px ${C.bg}40, inset 0 1px 0 ${C.text}10`
      }}>
        <div style={{padding:"18px 18px 16px",background:`linear-gradient(135deg, ${C.accent}12, transparent 62%)`}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"10px"}}>
            <span style={{fontSize:"12px",fontWeight:700,color:C.textMuted}}>League season</span>
            <span style={{fontSize:"12px",fontWeight:700,color:C.accent}}>{figures.games ? `${figures.games} games logged` : "No games yet"}</span>
          </div>
          <div style={{display:"flex",alignItems:"flex-end",gap:"10px"}}>
            <div style={{minWidth:0,flex:"1.25 1 0"}}>
              <div style={{fontSize:"11px",fontWeight:800,textTransform:"uppercase",letterSpacing:"0.08em",color:C.textMuted}}>Average</div>
              <div style={{fontFamily:"Roboto Condensed, Archivo, system-ui, sans-serif",fontSize:"46px",fontWeight:800,lineHeight:.95,letterSpacing:"-0.045em",color:C.text}}>{figures.average ?? "—"}</div>
              <div style={{fontSize:"12px",color:C.textMuted,marginTop:"5px"}}>season average</div>
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
        <div style={{padding:"10px 18px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",background:C.surface}}>
          <span style={{fontSize:"12px",fontWeight:700,color:C.textMuted}}>Open full statistics</span>
          <span aria-hidden="true" style={{color:C.accent,fontSize:"19px"}}>›</span>
        </div>
      </button>

      <button onClick={onOpenJourney} style={{
        width:"100%",textAlign:"left",cursor:"pointer",fontFamily:"inherit",padding:"0",marginBottom:"20px",
        background:`linear-gradient(145deg, ${C.accent}18, ${C.card} 58%)`,
        border:`1px solid ${C.accent}55`,borderRadius:"24px",overflow:"hidden",
        boxShadow:`0 18px 42px ${C.accent}18, inset 0 1px 0 ${C.text}12`
      }}>
        <div style={{padding:"16px 17px 17px"}}>
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
              <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",gap:"10px",marginTop:"16px"}}>
                <div>
                  <div style={{fontSize:"11px",fontWeight:800,textTransform:"uppercase",letterSpacing:"0.07em",color:C.textMuted}}>Latest milestone</div>
                  <div style={{fontSize:"23px",fontWeight:800,color:C.text,marginTop:"3px",lineHeight:1.15,letterSpacing:"-0.025em"}}>{recap.label}</div>
                  <div style={{fontSize:"11px",color:C.textMuted,marginTop:"5px"}}>{formatDate(recap.date,{weekday:false})} · {recap.total} milestone{recap.total===1?"":"s"} so far</div>
                </div>
                {nextUp && <div style={{padding:"7px 9px",borderRadius:"12px",background:C.surface,border:`1px solid ${C.border}`,fontSize:"11px",fontWeight:800,color:C.accent,whiteSpace:"nowrap"}}>Next · {describeUpcoming(nextUp).split(" · ")[0]}</div>}
              </div>
              {nextUp && (
                <div style={{marginTop:"14px"}}>
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
            <div style={{marginTop:"15px",fontSize:"18px",fontWeight:700,color:C.text}}>Your bowling story starts here.</div>
          )}
        </div>
      </button>

      <div style={{display:"flex",alignItems:"end",justifyContent:"space-between",marginBottom:"10px",padding:"0 2px"}}>
        <div>
          <div style={{fontSize:"20px",fontWeight:800,color:C.text,letterSpacing:"-0.025em"}}>What are you doing today?</div>
          <div style={{fontSize:"12px",color:C.textMuted,marginTop:"2px"}}>Jump straight into the kind of bowling you’re doing.</div>
        </div>
      </div>

      <div className="mbj-mode-grid" style={{marginBottom:"4px"}}>
        {ENVIRONMENTS.map(env => {
          const description = ENVIRONMENT_DESCRIPTIONS[env] || "";
          const shortDescription = description.split(".")[0] + (description.includes(".") ? "." : "");
          return (
            <button key={env} type="button" onClick={() => onPickMode?.(env)} className="mbj-mode-card"
              style={{"--mode-color": ENVIRONMENT_COLORS[env] || C.accent}}>
              <span className="mbj-mode-icon" aria-hidden="true"><ModeIcon mode={env} color={ENVIRONMENT_COLORS[env] || C.accent} /></span>
              <span className="mbj-mode-copy">
                <span className="mbj-mode-label">{ENVIRONMENT_LABELS[env]}</span>
                <span className="mbj-mode-detail">{shortDescription}</span>
              </span>
              <span className="mbj-mode-arrow" aria-hidden="true">›</span>
            </button>
          );
        })}
      </div>

      {(() => {
        const t = recentTournament(tournaments, { bowler, today });
        if (!t) return null;
        return (
          <div style={{...S.card,padding:"16px 17px",marginTop:"8px",background:`linear-gradient(135deg, ${C.surface}, ${C.card})`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:"10px",fontWeight:800,textTransform:"uppercase",letterSpacing:"0.08em",color:C.textMuted}}>Recent tournament</div>
                <div style={{fontSize:"17px",fontWeight:800,color:C.text,marginTop:"3px"}}>{t.name}</div>
              </div>
              <span style={{fontSize:"20px",color:C.accent}}>›</span>
            </div>
            <div style={{fontSize:"11px",color:C.textMuted,marginTop:"3px"}}>{[t.center,t.date].filter(Boolean).join(" · ")}</div>
            {t.games ? <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"8px",marginTop:"13px"}}>
              {[ [t.average,"Average"],[t.best,"Best"],[t.games,"Games"] ].map(([v,l])=><div key={l} style={{padding:"9px",borderRadius:"13px",background:C.card,border:`1px solid ${C.border}`,textAlign:"center"}}><div style={{fontFamily:"Roboto Condensed, Archivo, system-ui, sans-serif",fontSize:"20px",fontWeight:800,color:C.text}}>{v}</div><div style={{fontSize:"10px",color:C.textMuted,marginTop:"2px"}}>{l}</div></div>)}
            </div> : null}
          </div>
        );
      })()}
    </>
  );
}
