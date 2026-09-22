// Shared color palette, style helpers, and small presentational components
// used throughout the app. Pulled into its own module (rather than living
// in BowlingTracker.jsx, where they originated) specifically so that split-
// out view files (HistoryView.jsx, StatsView.jsx, etc.) can import them
// without creating a circular import — BowlingTracker.jsx imports those
// view components to render them, so those files can't in turn import
// shared utilities back from BowlingTracker.jsx itself.

import { themeFor, DEFAULT_THEME, normalizeThemeId } from "./domain/themes.js";

// C is a LIVE object, not a constant. Every component reads C.x inside
// its render, and every S style is rebuilt from C when the theme
// changes -- so switching theme is: mutate C in place, rebuild S in
// place, re-render the root. Nothing else in the app has to know a theme
// exists, and the 60-odd `${C.accent}22` alpha blends across 23 files
// keep working unchanged because C.accent is still a plain hex string.
//
// Mutating rather than reassigning matters: importers hold a reference
// to THIS object. A new object would leave every earlier import pointing
// at the old colours.
export const C = { ...themeFor(DEFAULT_THEME).colors };

// Type. Two families with clearly different jobs -- see styles.css.
export const F = {
  body: "'Archivo', system-ui, -apple-system, sans-serif",
  display: "'Archivo Expanded', 'Archivo', system-ui, sans-serif",
  // Every score, average and percentage. Condensed so a three-digit
  // series sits big on a phone without wrapping.
  num: "'Roboto Condensed', 'Archivo', system-ui, sans-serif",
};

let activeThemeId = DEFAULT_THEME;
export function currentThemeId() { return activeThemeId; }

// Applies a theme in place. Returns true when the theme actually changed
// so the caller knows whether a re-render is needed.
export function applyTheme(id) {
  const next = normalizeThemeId(id);
  if (next === activeThemeId && C.bg === themeFor(next).colors.bg) return false;
  activeThemeId = next;
  Object.assign(C, themeFor(next).colors);
  Object.assign(S, buildStyles());
  // The page body sits outside React; without this the area behind a
  // short screen keeps the previous theme's colour.
  if (typeof document !== "undefined" && document.body) {
    document.body.style.backgroundColor = C.bg;
    document.documentElement.setAttribute("data-mbj-theme", next);
    // styles.css reads this for :focus-visible rings, which inline
    // styles can't express.
    document.documentElement.style.setProperty("--ba-accent", C.accent);
    setSelectChrome();
    // The browser chrome -- mobile address bar, task-switcher preview --
    // should match whichever theme is active, not the static default
    // baked into index.html for the moment before React mounts.
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", C.bg);
  }
  return true;
}

export const S = {};
function buildStyles() { return {
  app:{minHeight:"100vh",backgroundColor:C.bg,backgroundImage:`radial-gradient(circle at 50% -10%, ${C.accent}18 0%, transparent 42%), linear-gradient(180deg, ${C.bg} 0%, ${C.bg} 52%, ${C.surface} 100%)`,color:C.text,fontFamily:F.body,fontSize:"15px",lineHeight:1.55,letterSpacing:"-0.005em"},
  // The top padding carries the status-bar inset, and that is not
  // cosmetic -- it is what makes the header's buttons TAPPABLE.
  //
  // Android 15 (API 35) enforces edge-to-edge: the WebView draws behind
  // the status bar whether the app opts in or not. This header is sticky
  // at top:0, so with a flat 16px it sat underneath the status bar, and
  // Android's system UI swallowed every touch aimed at Search, Import,
  // Profile and Settings. They rendered perfectly and did nothing.
  //
  // The giveaway was that they worked fine from remote devtools: a
  // devtools click dispatches straight into the DOM and never asks the
  // OS, so it hit a handler the finger could not reach. That split --
  // works in devtools, dead to touch -- is the signature of content
  // under system UI, not of a broken handler.
  //
  // env() needs viewport-fit=cover in index.html to report anything but
  // 0; the two changes only work together. The fallback keeps this
  // honest on anything that doesn't support env() at all.
  //
  // The background still extends under the status bar, which is the
  // point of edge-to-edge and looks deliberate. Only the CONTENT moves
  // down out of it.
  header:{backgroundColor:C.bg+"E8",backdropFilter:"blur(22px)",WebkitBackdropFilter:"blur(22px)",padding:"calc(15px + env(safe-area-inset-top, 0px)) 18px 13px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,borderBottom:`1px solid ${C.border}`,boxShadow:`0 10px 34px ${C.bg}66, inset 0 -1px 0 ${C.text}06`},
  // The wordmark. Weight and width carry it, not uppercase tracking --
  // ALL-CAPS-with-letterspacing was the single loudest "generated
  // dashboard" signal in the old header.
  title:{fontSize:"20px",fontWeight:700,fontFamily:F.display,letterSpacing:"-0.035em",color:C.text},
  // Five tabs, not four. Tighter gap and horizontal padding, plus
  // flexShrink:0 on the buttons so labels never wrap mid-word if a
  // narrow phone still runs short.
  nav:{display:"flex",gap:"3px",flexShrink:0},
  // Active tab is an underline in the accent, not a filled pill. A
  // filled pill competes with every button on the page for "the thing
  // to press"; an underline just says where you are.
  navBtn:(a)=>({padding:"8px 11px 9px",whiteSpace:"nowrap",flexShrink:0,border:`1px solid ${a?C.accent+"44":"transparent"}`,borderBottom:`2px solid ${a?C.accent:"transparent"}`,borderRadius:"10px",cursor:"pointer",fontSize:"13px",fontWeight:a?700:500,backgroundColor:a?C.accent+"14":"transparent",color:a?C.text:C.textMuted,fontFamily:F.body}),
  // Bottom padding clears the fixed nav (and the iOS home indicator via
  // safe-area). Without it the last card on every screen sits underneath
  // the tab bar and can't be reached.
  content:{padding:"22px 18px",paddingBottom:"calc(102px + env(safe-area-inset-bottom, 0px))",maxWidth:"520px",margin:"0 auto"},
  // No hairline border. On a dark ground the card tone already separates
  // it; a border on every card is what made every screen read at the same
  // volume, because nothing was allowed to be quieter than anything else.
  card:{backgroundColor:C.card,borderRadius:"22px",padding:"20px",marginBottom:"18px",border:`1px solid ${C.accent}2B`,boxShadow:`0 16px 38px ${C.bg}45, 0 0 0 1px ${C.text}06, inset 0 1px 0 ${C.text}18`,backgroundImage:`linear-gradient(180deg, ${C.accent}12 0%, transparent 34%), linear-gradient(145deg, ${C.text}08, transparent 52%)`},
  // Section headings. Sentence case, normal tracking, readable size.
  // This one definition was 172 all-caps tracked-out eyebrows across the
  // app -- the visual language of a spreadsheet column header, and the
  // thing most responsible for it feeling like accounting software.
  label:{fontSize:"11px",fontWeight:800,letterSpacing:"0.08em",textTransform:"uppercase",color:C.accent,marginBottom:"11px"},
  chips:{display:"flex",flexWrap:"wrap",gap:"8px",marginBottom:"14px"},
  chip:(sel,col)=>({padding:"9px 15px",borderRadius:"999px",border:`1px solid ${sel?(col||C.accent)+"88":C.border}`,background:sel?`linear-gradient(180deg, ${col?col+"2A":C.accentDim}, ${col?col+"18":C.accentDim})`:C.surface,color:sel?(col||C.accent):C.textMuted,cursor:"pointer",fontSize:"13px",fontWeight:sel?700:600,fontFamily:F.body,WebkitTapHighlightColor:"transparent",transition:"transform 120ms ease, background-color 120ms ease",boxShadow:sel?`0 6px 16px ${col||C.accent}18, inset 0 1px 0 ${C.text}10`:`inset 0 1px 0 ${C.text}08`}),
  row:{display:"flex",gap:"8px",marginBottom:"8px"},
  input:{width:"100%",backgroundColor:C.surface,border:`1px solid ${C.border}`,borderRadius:"14px",padding:"14px 15px",color:C.text,fontSize:"15px",fontFamily:F.body,boxSizing:"border-box",outline:"none",boxShadow:`0 5px 16px ${C.bg}18, inset 0 1px 0 ${C.text}08`},
  sel:{flex:1,backgroundColor:C.surface,border:`1px solid ${C.border}`,borderRadius:"14px",padding:"14px 15px",color:C.text,fontSize:"15px",fontFamily:F.body,outline:"none",appearance:"none",boxShadow:`0 5px 16px ${C.bg}18, inset 0 1px 0 ${C.text}08`},
  btn:(v)=>({padding:"14px 20px",borderRadius:"15px",border:`1px solid ${v==="primary"?C.accent+"AA":C.border}`,cursor:"pointer",fontSize:"15px",fontWeight:700,fontFamily:F.body,WebkitTapHighlightColor:"transparent",boxShadow:v==="primary"?`0 12px 30px ${C.accent}45, inset 0 1px 0 ${C.text}28`:`0 7px 18px ${C.bg}35, inset 0 1px 0 ${C.text}10`,...(v==="primary"?{backgroundColor:C.accent,backgroundImage:`linear-gradient(180deg, ${C.accent}, ${C.accent}D9)`,color:C.onAccent,width:"100%"}:v==="sm"?{backgroundColor:C.surface,color:C.text,padding:"8px 14px",fontSize:"18px"}:v==="warn"?{backgroundColor:C.miss+"1A",color:C.miss,width:"100%"}:{backgroundColor:C.surface,color:C.text})}),
  divider:{height:"1px",backgroundColor:C.border,margin:"16px 0",opacity:0.6},
  shotCard:{backgroundColor:C.card,borderRadius:"14px",padding:"13px",marginBottom:"9px",display:"flex",gap:"12px",alignItems:"flex-start",border:`1px solid ${C.border}AA`},
  dot:(r)=>({width:"32px",height:"32px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",fontWeight:700,flexShrink:0,backgroundColor:r==="Strike"?C.strike+"22":r?.includes("10")?C.miss+"22":C.spare+"22",color:r==="Strike"?C.strike:r?.includes("10")?C.miss:C.spare}),
  tag:(c)=>({display:"inline-block",padding:"4px 10px",borderRadius:"999px",fontSize:"12px",fontWeight:500,backgroundColor:(c||C.accent)+"18",color:c||C.accent,marginRight:"4px",marginBottom:"4px"}),
  // Peer groups (Shots/Strike%/Spare%, Game 1/2/3) still use boxes -- those
  // ARE equals, so a row of them is the right shape. But they were filled
  // surface panels while every redesigned card sits flat on the card
  // background, so they read as a different component. Same tone as the
  // cards around them, separated by a hairline instead of a fill.
  statBox:{backgroundColor:C.surface,borderRadius:"18px",padding:"15px 9px",textAlign:"center",flex:1,border:`1px solid ${C.accent}22`,boxShadow:`0 10px 22px ${C.bg}32, inset 0 1px 0 ${C.text}10`},
  // Numbers are the point. Condensed, big, in the text colour -- accent
  // is reserved for the one number on a screen that matters most, not
  // sprayed across every stat so that none of them stands out.
  statNum:{fontSize:"32px",fontWeight:700,fontFamily:F.num,fontVariantNumeric:"tabular-nums",color:C.accent,lineHeight:1,marginBottom:"6px",letterSpacing:"-0.035em"},
  statLbl:{fontSize:"12px",color:C.textMuted,textTransform:"none",letterSpacing:"0"},
}; }
Object.assign(S, buildStyles());
setSelectChrome();

// Every <select> gets a chevron in a tinted well, drawn by styles.css
// from these two variables. An SVG in a data URI cannot read CSS
// variables, so the accent is baked in -- at load, and on every theme
// change (the first applyTheme can return early, so load must do it too).
function setSelectChrome() {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-mbj-theme", activeThemeId);
  root.style.setProperty("--mbj-bg", C.bg);
  root.style.setProperty("--mbj-card", C.card);
  root.style.setProperty("--mbj-surface", C.surface);
  root.style.setProperty("--mbj-text", C.text);
  root.style.setProperty("--mbj-muted", C.textMuted);
  root.style.setProperty("--mbj-border", C.border);
  root.style.setProperty("--mbj-accent", C.accent);
  root.style.setProperty("--mbj-on-accent", C.onAccent);
  const a = encodeURIComponent(C.accent);
  document.documentElement.style.setProperty("--ba-select-chevron",
    `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 34 34'%3E%3Crect width='34' height='34' rx='9' fill='${a}' fill-opacity='0.13'/%3E%3Cpath d='M11 14l6 6 6-6' fill='none' stroke='${a}' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`);
  document.documentElement.style.setProperty("--ba-select-border", C.accent + "66");
}

// A tinted action row: coloured icon, label, chevron.
//
// The pattern that answers "what would you like to do?" without a
// tutorial. Each destination carries a colour and an icon, so it becomes
// recognisable before it is read -- a bowler learns the shape of "log a
// game" in two sessions and stops reading the label at all.
//
// This is the fix for the discovery problem that tutorials could not
// solve. Four modes behind identical text chips all look like the same
// decision; four tinted rows look like four different things.
//
// One component rather than per-screen styling, so a row on the mode
// picker and a row on a settings list cannot drift apart.
export function ActionRow({icon,label,detail,color,onClick,disabled,compact}){
  const tint=color||C.accent;
  const pad=compact?"12px 14px":"15px 16px";
  const box=compact?40:44;
  const gap=compact?"9px":"11px";
  return (
    <button onClick={onClick} disabled={disabled}
      style={{
        width:"100%",display:"flex",alignItems:"center",gap:"12px",
        background:`linear-gradient(135deg, ${C.card}, ${C.surface})`,
        border:`1px solid ${C.border}`,borderRadius:"18px",
        padding:pad,marginBottom:gap,
        boxShadow:`0 10px 28px ${C.bg}38, inset 0 1px 0 ${C.text}12`,
        textAlign:"left",cursor:disabled?"default":"pointer",
        opacity:disabled?0.5:1,fontFamily:F.body,
        WebkitTapHighlightColor:"transparent",transition:"transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease",
      }}>
      <span aria-hidden="true" style={{
        width:`${box}px`,height:`${box}px`,borderRadius:"13px",flexShrink:0,
        background:`linear-gradient(145deg, ${tint}, ${tint}CC)`,color:C.onAccent,
        display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:compact?"18px":"19px",
        boxShadow:`0 7px 16px ${tint}35, inset 0 1px 0 ${C.text}22`,
      }}>{icon}</span>
      <span style={{flex:1,minWidth:0}}>
        <span style={{display:"block",fontSize:compact?"15px":"16px",fontWeight:700,color:C.text,letterSpacing:"-0.01em"}}>
          {label}
        </span>
        {detail&&(<span style={{display:"block",fontSize:"12px",color:C.textMuted,marginTop:"2px",lineHeight:1.35}}>{detail}</span>)}
      </span>
      <span aria-hidden="true" style={{color:C.textMuted,fontSize:"22px",fontWeight:300,flexShrink:0,lineHeight:1}}>›</span>
    </button>
  );
}

export function Chip({label,selected,onToggle,color,dense,fill}){
  // fill: share the row equally instead of sizing to the text.
  //
  // Six chips sized to their labels come to more than a phone's width,
  // and estimating whether they fit has been wrong twice. Sharing the
  // width is not an estimate -- flex:1 with min-width:0 cannot overflow,
  // whatever the labels say.
  const base=dense?{...S.chip(selected,color),padding:"5px 9px"}:S.chip(selected,color);
  const style=fill
    ?{...base,flex:"1 1 0",minWidth:0,padding:dense?"6px 2px":"9px 2px",
      // Shrinks with the screen so a tab name never needs its "…":
      // at 360px six tabs have ~50px each, and 13px "Center" needs 57.
      fontSize:dense?"clamp(10px, 2.85vw, 13px)":"clamp(10px, 2.9vw, 13px)",letterSpacing:"-0.01em",
      textAlign:"center",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}
    :base;
  return <button style={style} onClick={onToggle}>{label}</button>;
}

// Renders the ten pins in their actual rack positions — back row (7-10) at
// top, headpin (1) at bottom — so tapping matches where the pin physically
// stood, rather than a linear row of numbered chips a bowler has to
// translate from memory.
// The rack, at thumb size.
//
// `available` is optional and exists for the spare picker. Without it
// every pin is tappable, which is what picking a leave wants: any pin
// could be the one still standing.
//
// With it, only those pins can be tapped and the rest are drawn faint --
// they were already down before this ball, so they are not a choice. They
// still have to be DRAWN, because a rack missing its fallen pins loses
// its shape and you can no longer tell where the live pins are standing.
// They render as spans rather than disabled buttons so they are out of
// the tab order entirely rather than merely unclickable.
export function PinDeck({selected,onToggle,available}){
  const rows=[
    [{n:"7",x:14},{n:"8",x:38},{n:"9",x:62},{n:"10",x:86}],
    [{n:"4",x:26},{n:"5",x:50},{n:"6",x:74}],
    [{n:"2",x:38},{n:"3",x:62}],
    [{n:"1",x:50}],
  ];
  const pinSize=52,rowGap=58,topPad=8;
  // Compared as strings throughout: this component has always spoken
  // "7", and a caller holding numbers would silently match nothing.
  const limited=Array.isArray(available);
  const canTap=n=>!limited||available.map(String).includes(n);
  return (
    <div style={{position:"relative",height:`${topPad*2+rowGap*3+pinSize}px`,margin:"12px 0"}}>
      {rows.map((row,rowIdx)=>row.map(pin=>{
        const isSelected=Array.isArray(selected)&&selected.map(String).includes(pin.n);
        const place={
          position:"absolute",left:`${pin.x}%`,top:`${rowIdx*rowGap+topPad}px`,
          transform:"translateX(-50%)",width:`${pinSize}px`,height:`${pinSize}px`,
          borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:"16px",fontWeight:700,boxSizing:"border-box",
        };
        if(!canTap(pin.n)){
          return (
            <span key={pin.n} aria-hidden="true" style={{
              ...place,border:`1px solid ${C.border}`,backgroundColor:"transparent",
              color:"transparent",
            }}/>
          );
        }
        return (
          <button key={pin.n} type="button" onClick={()=>onToggle(pin.n)}
            aria-pressed={isSelected}
            aria-label={`Pin ${pin.n}`}
            style={{
              ...place,
              border:`2px solid ${isSelected?C.spare:C.border}`,
              backgroundColor:isSelected?C.spare+"33":C.surface,color:isSelected?C.spare:C.textMuted,
              WebkitTapHighlightColor:"transparent",cursor:"pointer",
            }}>{pin.n}</button>
        );
      }))}
    </div>
  );
}

// `fixed`: always open, no chevron and nothing to tap. For a card that
// is the whole of its screen -- Setup's Balls, Bags and League tabs --
// where collapsing it would only leave an empty tab.
export function CollapsibleCard({title,summary,expanded,onToggle,children,cardStyle,fixed=false}){
  if(fixed)return (
    <div style={cardStyle||S.card}>
      <div style={{...S.label,marginBottom:0}}>
        {title}
        {summary&&<span style={{color:C.textMuted,fontWeight:400,textTransform:"none",letterSpacing:"normal"}}> · {summary}</span>}
      </div>
      <div style={{marginTop:"12px"}}>{children}</div>
    </div>
  );
  return (
    <div style={cardStyle||S.card}>
      {/* The chevron sits on the LEFT, before the title.

          It used to be flush right -- a phone-width away from the words
          it belongs to, which made a column of cards read as two
          unrelated columns. On the left it is one control: marker, then
          name. */}
      <div style={{display:"flex",alignItems:"center",gap:"6px",cursor:"pointer",WebkitTapHighlightColor:"transparent"}} onClick={onToggle}>
        <span style={{color:C.textMuted,fontSize:"11px",lineHeight:1}}>{expanded?"▾":"▸"}</span>
        <div style={{...S.label,marginBottom:0}}>
          {title}
          {summary&&<span style={{color:C.textMuted,fontWeight:400,textTransform:"none",letterSpacing:"normal"}}> · {summary}</span>}
        </div>
      </div>
      {expanded&&<div style={{marginTop:"12px"}}>{children}</div>}
    </div>
  );
}

export function CompareBadge({value,teamValue,lowerIsBetter,label}){
  if(value==null||teamValue==null||isNaN(value)||isNaN(teamValue))return null;
  const who=label||"team";
  const diff=Math.round(value-teamValue);
  if(diff===0)return <div style={{fontSize:"10px",color:C.textMuted,marginTop:"2px"}}>≈ {who}</div>;
  const better=lowerIsBetter?diff<0:diff>0;
  return (
    <div style={{fontSize:"10px",color:better?C.strike:C.miss,marginTop:"2px",fontWeight:600}}>
      {diff>0?"▲":"▼"} {Math.abs(diff)} vs {who}
    </div>
  );
}

export function resultSym(r){
  if(r==="Strike")return"X";
  if(r==="Weak 10")return"W";
  if(r==="Ringing 10")return"R";
  return"L";
}

// ── Stat card layout ────────────────────────────────────────────────────
//
// Every Stats card was a row of identical boxes -- 46 of them across the
// screen -- which gave the eye nowhere to land and made no number more
// important than any other. These two components express the shape the
// cards actually want: one figure that leads, then supporting rows.
//
// Built as components rather than hand-editing each card because there
// are ~20 of them; doing it by hand is how you end up with nineteen
// slightly different paddings and one card that throws because someone
// forgot an import.

// The headline figure of a card, plus optional context line and badge.
export function StatLead({ value, unit = "", caption, detail, badge, color }) {
  return (
    <>
      <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "2px" }}>
        <div className="num" style={{ fontSize: "44px", fontWeight: 700, fontFamily: F.num, lineHeight: 0.9, color: color || C.text }}>
          {value}{unit}
        </div>
        {caption && <span style={{ fontSize: "13px", color: C.textMuted }}>{caption}</span>}
      </div>
      {badge}
      {detail && (
        <div style={{ fontSize: "12.5px", color: C.textMuted, margin: "6px 0 10px", lineHeight: 1.5 }}>{detail}</div>
      )}
    </>
  );
}

// A supporting row. `fill` (0-100) draws a proportional bar, which lets
// the eye compare before it reads.
export function StatRow({ label, value, sub, fill = null, color, badge, last = false }) {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "7px 0", fontSize: "13.5px",
                    borderBottom: last ? "none" : `1px solid ${C.border}` }}>
        <span>{label}</span>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {fill != null && (
            <div style={{ height: "5px", width: "64px", background: C.border, borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.max(0, Math.min(100, fill))}%`, background: color || C.accent, borderRadius: "3px" }} />
            </div>
          )}
          <b className="num" style={{ fontFamily: F.num, fontSize: "16px", color: color || C.text }}>{value}</b>
          {sub && <span style={{ fontSize: "12px", color: C.textMuted }}>{sub}</span>}
        </div>
      </div>
      {badge}
    </>
  );
}

// The divider between the lead figure and its supporting rows.
export function StatRows({ children }) {
  return <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "8px" }}>{children}</div>;
}

// The standing disclaimer for anything an AI produced.
//
// One component, used everywhere, so the wording cannot drift and no AI
// feature can quietly ship without one.
//
// InsightsView already had a good disclaimer of its own and keeps it --
// it is longer and more specific than this, and it earns the space
// because a coaching analysis invites more trust than a one-line answer.
// Scorecard import, centre lookup and the genie had nothing.
//
// Deliberately short. A paragraph of hedging gets skipped; one line
// under the output gets read. It says the two things that actually
// matter: a machine wrote it, and it can be wrong about your bowling
// specifically.
// `verb` because not every AI surface WRITES something. The scorecard
// import READS a photo; saying it was "written by AI" is just wrong, and
// swapping only the subject produced "This card was read by AI, so it was
// written by AI".
// `check` too, because the right way to verify differs by surface. A
// coaching answer is checked against what you saw on the lane; a list of
// bowling centres is not, and telling someone to do that is nonsense
// dressed as caution.
// A paid feature, SHOWN rather than hidden.
//
// Hiding a paid feature makes the paid tier invisible, and nobody buys
// what they have never seen. This names the specific thing being
// withheld at the moment it would have been useful, which is the only
// honest shape a paywall has -- and the only one that converts.
//
// One component rather than four hand-rolled cards, so the padlock says
// the same thing in the same voice wherever a bowler meets it.
export function LockedNote({ title, children }) {
  return (
    <div style={{ ...S.card, border: `1px solid ${C.accent}66`, backgroundColor: C.accent + "0D" }}>
      <div style={{ ...S.label, color: C.accent }}>{title} 🔒</div>
      <div style={{ fontSize: "12px", color: C.textMuted, lineHeight: 1.5 }}>{children}</div>
    </div>
  );
}

export function AiNote({ what = "This", verb = "written", check = "check it against what you saw on the lane", style: extra }) {
  return (
    <div style={{
      fontSize: "10.5px", color: C.textMuted, lineHeight: 1.5,
      marginTop: "8px", opacity: 0.85, ...extra,
    }}>
      {what} was {verb} by AI. It can be confidently wrong — {check}.
    </div>
  );
}
