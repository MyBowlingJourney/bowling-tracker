import { C, S, F } from "./ui.jsx";
import { TOUR_TRACKS, FIRST_TOUR } from "./domain/tour.js";
import journeyIcon from "../journey-icon.png";

// Mock-ups built from the app's OWN style tokens.
//
// These were SVG schematics, which looked like a wireframe of the app
// rather than the app. Now they're real DOM using S.card, S.chip,
// S.label and the live theme colours -- so a card here has the same
// radius, padding and border as a card on the Bowl tab, and a theme
// change carries through automatically.
//
// Populated with realistic data on purpose. A new bowler's real app is
// empty, so showing their actual screen would teach nothing: the point
// is to show what it looks like once there's a game in it.

// A phone-shaped frame, so it reads as "this is a screen" rather than
// as more of the tour's own UI.
// Brooklyn's lamp, as it sits in the header.
//
// The real one is a drawn SVG rather than an emoji, so a glyph here
// would not look like the thing a bowler is being told to tap. This is
// a simplified version of the same shape, in the same accent colour.
function Lamp({ on }) {
  return (
    <svg width="17" height="13" viewBox="0 0 24 18" aria-hidden="true"
      style={on ? undefined : { opacity: 0.55 }}>
      {/* Body, spout and handle -- enough to read as a lamp at 17px. */}
      <ellipse cx="11" cy="14.5" rx="8" ry="2.4" fill={C.accent} />
      <path d="M4 13.5c0-4 3-6.5 7-6.5s7 2.5 7 6.5z" fill={C.accent} />
      <path d="M18 11.5l5-2.5-5-1.4z" fill={C.accent} />
      <path d="M11 7V4.6" stroke={C.accent} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="11" cy="3.4" r="1.6" fill={C.accent} />
    </svg>
  );
}

// The header, as the app actually draws it.
//
// It had a magnifier, a camera, a person and a cog -- four icons, three
// of which have not existed separately for a while. What is really
// there, left to right:
//
//   the app name (the LOGGING screens show the app name, not a tab
//   name -- there is no tab called "Bowl")
//   Brooklyn's lamp, once there is something to ask about
//   Import, a LABELLED button, because a bare camera read as "take a
//     photo" and bowlers hunted for import elsewhere
//   the menu, three lines, holding search, profile and settings
//
// `headerIcon` lights one of them: "genie" | "import" | "menu".
function Phone({ children, title, headerIcon, casual }) {
  return (
    <div style={{
      border: `1px solid ${C.border}`, borderRadius: "18px", overflow: "hidden",
      background: C.bg, maxWidth: "300px", margin: "0 auto",
      boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 12px", background: C.surface, borderBottom: `1px solid ${C.border}`,
      }}>
        <span style={{ fontSize: "13px", fontWeight: 700, color: C.text, fontFamily: F.body }}>{title}</span>
        <span style={{ display: "flex", gap: "7px", alignItems: "center", fontSize: "13px" }}>
          {/* Brooklyn is never offered on a casual night. */}
          {!casual && (
            <span style={headerIcon === "genie" ? lit(true) : undefined}>
              <Lamp on={headerIcon === "genie"} />
            </span>
          )}
          {!casual && (
            <span style={{
              ...(headerIcon === "import" ? lit(true) : { opacity: 0.55 }),
              border: `1px solid ${C.border}`, borderRadius: "7px",
              padding: "2px 5px", fontSize: "9px", fontWeight: 700,
              color: C.text, fontFamily: F.body, display: "flex",
              alignItems: "center", gap: "3px", whiteSpace: "nowrap",
            }}>
              <span style={{ fontSize: "10px" }}>📷</span>Import
            </span>
          )}
          <span style={headerIcon === "menu" ? lit(true) : { opacity: 0.55 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.text}
              strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </span>
        </span>
      </div>
      <div style={{ padding: "10px", minHeight: "230px" }}>{children}</div>
    </div>
  );
}

// The spotlight: a ring around whatever the step is about.
function lit(on) {
  return on
    ? {
        outline: `2px solid ${C.accent}`, outlineOffset: "3px",
        borderRadius: "6px", background: C.accent + "22",
      }
    : { opacity: 0.55 };
}

function Spot({ on = true, children, style }) {
  return (
    <div style={{
      ...(on ? { outline: `2px solid ${C.accent}`, outlineOffset: "2px", borderRadius: "12px" } : {}),
      ...style,
    }}>
      {children}
    </div>
  );
}

// Points at the thing above or below it.
function Note({ children, up = true }) {
  return (
    <div style={{
      fontSize: "11px", fontWeight: 700, color: C.accent,
      textAlign: "center", margin: up ? "8px 0 0" : "0 0 8px", fontFamily: F.body,
    }}>
      {up ? "▲ " : "▼ "}{children}
    </div>
  );
}

// Scaled-down versions of the real components' shapes.
const card = { ...S.card, padding: "10px", marginBottom: "8px" };
const label = { ...S.label, fontSize: "10px", marginBottom: "6px" };
const chip = (sel, col) => ({ ...S.chip(sel, col), fontSize: "10px", padding: "5px 9px" });
const muted = { fontSize: "10px", color: C.textMuted, fontFamily: F.body };

// The real nav, in the real order.
//
// This drew five tabs ending in a Vault that no longer exists, and
// omitted Gear and Team entirely. Every tour slide carrying it was
// pointing new bowlers at a row they would never see.
//
// Indices, so a screen can say which tab it is standing on:
//   0 Home  1 Gear  2 Team  3 Stats  4 Improve  5 History
// Gear and Team are one Setup tab now, so both of their slides stand on it.
const NAV_TABS = [
  ["🏠", "Home"], ["🧰", "Setup"],
  ["📈", "Stats"], ["🎯", "Improve"], ["📖", "History"],
];
export const TAB_INDEX = { home: 0, gear: 1, team: 1, setup: 1, stats: 2, improve: 3, history: 4, log: 0 };

function Nav({ active }) {
  const tabs = NAV_TABS;
  return (
    <div style={{
      display: "flex", borderTop: `1px solid ${C.border}`,
      margin: "8px -10px -10px", background: C.surface, padding: "6px 0",
    }}>
      {tabs.map(([icon, name], i) => (
        <div key={name} style={{
          flex: 1, textAlign: "center",
          ...(i === active ? { outline: `2px solid ${C.accent}`, outlineOffset: "-3px", borderRadius: "8px" } : {}),
        }}>
          <div style={{ fontSize: "13px", opacity: i === active ? 1 : 0.6 }}>{icon}</div>
          <div style={{
            fontSize: "7px", fontFamily: F.body,
            color: i === active ? C.accent : C.textMuted,
            fontWeight: i === active ? 700 : 400,
          }}>{name}</div>
        </div>
      ))}
    </div>
  );
}

// Ten frames, mid-game, exactly as the real scoresheet lays them out.
function Frames({ highlight }) {
  const marks = [["X"], ["X"], ["9", "/"], ["8", "-"], [], [], [], [], [], []];
  const totals = ["29", "49", "67", "75", "", "", "", "", "", ""];
  return (
    <div style={{ display: "flex", gap: "1px" }}>
      {marks.map((mk, i) => (
        <div key={i} style={{
          flex: 1, border: `1px solid ${i === highlight ? C.accent : C.border}`,
          borderRadius: "3px", textAlign: "center", padding: "1px 0",
          background: i === highlight ? C.accent + "18" : "transparent",
        }}>
          <div style={{ fontSize: "6px", color: C.textMuted }}>{i + 1}</div>
          <div style={{ fontSize: "9px", fontWeight: 700, minHeight: "11px", color: C.strike }}>
            {mk.join(" ")}
          </div>
          <div style={{ fontSize: "8px", fontWeight: 700, color: C.text, minHeight: "10px" }}>
            {totals[i]}
          </div>
        </div>
      ))}
    </div>
  );
}

// The pin rack, laid out like ui.jsx's PinDeck: 7-8-9-10 across the
// back, then 4-5-6, then 2-3, then the headpin. A row of number chips
// wouldn't teach anything -- the whole point is that it looks like a
// rack, so a bowler taps the pins they can actually see standing.
// The rack, twice over.
//
// `standing` lights the pins left after the first ball. `knocked` is the
// spare picker's answer -- which of those the second ball took -- and
// `caption` names whichever question the rack is asking, since the same
// drawing now appears for two different ones.
//
// Pins that were never standing stay faint in both, exactly as they do in
// the app: the rack loses its shape without them.
function PinRack({ standing = [], knocked = [], caption = "\u2190 still standing" }) {
  const rows = [
    [["7", 14], ["8", 38], ["9", 62], ["10", 86]],
    [["4", 26], ["5", 50], ["6", 74]],
    [["2", 38], ["3", 62]],
    [["1", 50]],
  ];
  const size = 22, gap = 25;
  return (
    <div style={{ position: "relative", height: `${gap * 3 + size + 6}px`, margin: "4px 0" }}>
      {rows.map((row, r) => row.map(([n, x]) => {
        const on = standing.includes(n);
        const down = knocked.includes(n);
        // Knocked down by the spare ball reads as filled; still standing
        // reads as outlined. Same two states the scoresheet's rack uses.
        const border = down ? C.spare : on ? C.spare : C.border;
        const fill = down ? C.spare : on ? C.spare + "33" : C.surface;
        const ink = down ? C.onAccent : on ? C.spare : C.textMuted;
        return (
          <div key={n} style={{
            position: "absolute", left: `${x}%`, top: `${r * gap + 3}px`,
            transform: "translateX(-50%)", width: `${size}px`, height: `${size}px`,
            borderRadius: "50%", boxSizing: "border-box",
            border: `2px solid ${border}`,
            background: fill,
            color: ink,
            fontSize: "9px", fontWeight: 700, fontFamily: F.body,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>{n}</div>
        );
      }))}
      <div style={{ ...muted, position: "absolute", right: 0, bottom: 0 }}>{caption}</div>
    </div>
  );
}

// The Result card, in the state each scoring lesson needs.
function ResultCard({ stage }) {
  const strike = stage === "strike";
  const leave = stage === "spare" || stage === "miss";
  return (
    <div style={card}>
      <div style={label}>Result</div>
      <Spot on={strike} style={{ display: "inline-block", marginBottom: "6px" }}>
        <span style={chip(strike, C.strike)}>Strike</span>
      </Spot>{" "}
      <span style={chip(false)}>Weak 10</span>{" "}
      <span style={chip(false)}>Ringing 10</span>
      <div style={{ marginTop: "6px" }}>
        <Spot on={leave} style={{ display: "inline-block" }}>
          <span style={chip(leave, C.spare)}>Other Leave</span>
        </Spot>
      </div>

      {leave && (
        <>
          <div style={{ ...label, marginTop: "10px" }}>Pins standing</div>
          <PinRack standing={["3", "10"]} />

          <div style={{ ...label, marginTop: "10px" }}>Spare made?</div>
          <div style={{ display: "flex", gap: "6px" }}>
            <Spot on={stage === "spare"}>
              <span style={chip(stage === "spare", C.strike)}>Yes</span>
            </Spot>
            <Spot on={stage === "miss"}>
              <span style={chip(stage === "miss", C.miss)}>No</span>
            </Spot>
          </div>

          {/* Answering No opens the rack a second time.
              
              The lesson used to stop at the chip, because what came next
              was a number stepper and there was nothing to draw. Now the
              bowler taps the pins they knocked down, so the tour has to
              show the step it is describing -- a screen that ends one
              tap before the real one does is worse than no screen. */}
          {stage === "miss" && (
            <>
              <div style={{ ...label, marginTop: "10px" }}>Which pins did you knock down?</div>
              <PinRack standing={["3", "10"]} knocked={["3"]} caption="← tap what fell" />
            </>
          )}
        </>
      )}
    </div>
  );
}

// The casual scoresheet, drawn the way it really works: the name column
// is fixed, the games scroll, and the total sits on the right. Showing a
// fourth part-visible column is what tells a bowler it scrolls.
function ScoreTable({ rows = [] }) {
  const total = vals => {
    const nums = vals.filter(v => v !== "").map(Number);
    return nums.length ? nums.reduce((a, b) => a + b, 0) : null;
  };
  const cell = { width: "48px", flexShrink: 0, textAlign: "center", fontSize: "11px" };
  return (
    <div style={{ display: "flex", border: `1px solid ${C.border}`, borderRadius: "6px", overflow: "hidden" }}>
      <div style={{ flexShrink: 0, width: "52px", background: C.surface, borderRight: `1px solid ${C.border}` }}>
        <div style={{ ...muted, height: "18px", lineHeight: "18px", paddingLeft: "5px", fontSize: "8px" }}>BOWLER</div>
        {rows.map(([name]) => (
          <div key={name} style={{ height: "24px", lineHeight: "24px", paddingLeft: "5px",
            fontSize: "10px", fontWeight: 600, color: C.text, borderTop: `1px solid ${C.border}` }}>{name}</div>
        ))}
      </div>
      <div style={{ flex: 1, overflow: "hidden" }}>
        <div style={{ display: "flex", height: "18px", background: C.surface }}>
          {["G1", "G2"].map(g => (
            <div key={g} style={{ ...cell, ...muted, lineHeight: "18px", fontSize: "8px" }}>{g}</div>
          ))}
        </div>
        {rows.map(([name, vals]) => (
          <div key={name} style={{ display: "flex", height: "24px", borderTop: `1px solid ${C.border}` }}>
            {vals.map((v, i) => (
              <div key={i} style={{ ...cell, lineHeight: "24px", fontWeight: 600,
                color: v ? C.text : C.textMuted }}>{v || ""}</div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ flexShrink: 0, width: "38px", background: C.surface, borderLeft: `1px solid ${C.border}` }}>
        <div style={{ ...muted, height: "18px", lineHeight: "18px", textAlign: "center", fontSize: "8px" }}>TOTAL</div>
        {rows.map(([name, vals]) => {
          const t = total(vals);
          return (
            <div key={name} style={{ height: "24px", lineHeight: "24px", textAlign: "center",
              fontSize: "11px", fontWeight: 700, color: t != null ? C.accent : C.textMuted,
              borderTop: `1px solid ${C.border}` }}>{t != null ? t : "—"}</div>
          );
        })}
      </div>
    </div>
  );
}

// A row of stat chips, the way the Stats screen actually lays them out:
// one row, no scrolling, the selected one filled.
function Chips({ items, sel = 0 }) {
  return (
    <div style={{ display: "flex", gap: "4px" }}>
      {items.map((t, i) => (
        <span key={t} style={{ ...chip(i === sel), flex: "1 1 0", minWidth: 0,
          textAlign: "center", padding: "5px 2px" }}>{t}</span>
      ))}
    </div>
  );
}

// A labelled field, as the line card draws them.
function Field({ head, value, lit: on }) {
  return (
    <div style={{ flex: "1 1 0", minWidth: 0 }}>
      <div style={{ fontSize: "8px", color: C.textMuted, fontFamily: F.body, marginBottom: "2px" }}>{head}</div>
      <div style={{
        border: `1px solid ${on ? C.accent : C.border}`, borderRadius: "6px",
        padding: "4px 0", textAlign: "center", fontSize: "11px", fontWeight: 700,
        color: C.text, fontFamily: F.body,
        background: on ? C.accent + "18" : "transparent",
      }}>{value}</div>
    </div>
  );
}

// A row in a list: name on the left, number on the right.
function Row({ left, right, colour, dim }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      fontSize: "10px", fontFamily: F.body, padding: "3px 0",
      color: dim ? C.textMuted : C.text,
    }}>
      <span>{left}</span>
      <span style={{ fontWeight: 700, color: colour || (dim ? C.textMuted : C.text), opacity: dim ? 0.75 : 1 }}>{right}</span>
    </div>
  );
}

// A small bar, for the comparison slide.
function Bar({ pct, colour }) {
  return (
    <div style={{ height: "6px", borderRadius: "3px", background: C.border, overflow: "hidden" }}>
      <div style={{ width: `${Math.max(0, Math.min(100, pct))}%`, height: "100%", background: colour || C.accent }} />
    </div>
  );
}

// A dropdown, drawn the way the app's selects look.
function Select({ value }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      border: `1px solid ${C.border}`, borderRadius: "6px", padding: "5px 8px",
      fontSize: "10px", color: C.text, fontFamily: F.body, background: C.surface,
    }}>
      <span>{value}</span><span style={{ opacity: 0.6 }}>{"\u25be"}</span>
    </div>
  );
}

// A real plotted line, so the trend slide shows a trend rather than the
// controls that produce one. Drawn as an SVG polyline from actual
// numbers -- the shape is a season that dips mid-way and recovers, which
// is what a bowler is looking for when they open this.
function Sparkline({ values = [], width = 250, height = 66 }) {
  if (values.length < 2) return null;
  const pad = 6;
  const lo = Math.min(...values), hi = Math.max(...values);
  const span = hi - lo || 1;
  const x = i => pad + (i / (values.length - 1)) * (width - pad * 2);
  const y = v => (height - pad) - ((v - lo) / span) * (height - pad * 2);
  const pts = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", display: "block" }}
         role="img" aria-label="Average over the last 13 games">
      {[0.25, 0.5, 0.75].map(f => (
        <line key={f} x1={pad} x2={width - pad} y1={pad + f * (height - pad * 2)}
              y2={pad + f * (height - pad * 2)} stroke={C.border} strokeWidth="1" />
      ))}
      <polyline points={pts} fill="none" stroke={C.accent} strokeWidth="2"
                strokeLinejoin="round" strokeLinecap="round" />
      {values.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r="2" fill={C.accent} />
      ))}
    </svg>
  );
}

// Tiny pin racks over the first four frames, as the scoresheet draws
// them: a strike is every pin down, a spare shows the pin the second ball
// took, an open frame shows what was left standing.
function MiniRacks() {
  const racks = [[], [], [["10", "d2"]], [["7", "s"], ["10", "s"]]];
  const rows = [["7", "8", "9", "10"], ["4", "5", "6"], ["2", "3"], ["1"]];
  return (
    <div style={{ display: "flex", gap: "1px", marginBottom: "2px" }}>
      {Array.from({ length: 10 }, (_, i) => {
        const r = racks[i];
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "1px", minHeight: "16px" }}>
            {r && rows.map((row, ri) => (
              <div key={ri} style={{ display: "flex", gap: "1px" }}>
                {row.map(p => {
                  const st = (r.find(([n]) => n === p) || [p, "d1"])[1];
                  const fill = st === "d1" ? C.strike : st === "d2" ? C.spare : "transparent";
                  return <span key={p} style={{ width: "3px", height: "3px", borderRadius: "50%", background: fill,
                    border: st === "s" ? `0.5px solid ${C.textMuted}` : "none" }} />;
                })}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// One ball as the Gear tab lists it.
function BallRow({ initials, colour, name, line, spec, last }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "5px 0",
      borderBottom: last ? "none" : `1px solid ${C.border}` }}>
      <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: colour, color: "#FFF",
        fontSize: "8px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: F.body, flexShrink: 0 }}>{initials}</div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: "10.5px", fontWeight: 700, color: C.text, fontFamily: F.body }}>{name}</div>
        <div style={{ ...muted, fontSize: "8.5px" }}>{line}</div>
        <div style={{ ...muted, fontSize: "8px" }}>{spec}</div>
      </div>
    </div>
  );
}

function StatBox({ value, label: lab, colour }) {
  return (
    <div style={{ flex: 1, border: `1px solid ${C.border}`, borderRadius: "7px", padding: "5px 0", textAlign: "center" }}>
      <div style={{ fontSize: "13px", fontWeight: 700, fontFamily: F.num, color: colour || C.text }}>{value}</div>
      <div style={{ ...muted, fontSize: "8px" }}>{lab}</div>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.textMuted}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "block" }}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

const SCREENS = {
  // ── Look around ───────────────────────────────────────────────────────
  //
  // Each of these stands on the tab it is describing, so the lit nav
  // entry and the content agree. That is the whole teaching job: this
  // row, that screen.
  // The six "look" screens are drawn to match the app as it is now:
  // pin racks over the frames, the arsenal as the Gear tab shows it, the
  // team picker and bowling order, Viewing beside Compare To with an eye
  // on each card, the Journey hero with Up next, and History's chips.
  // They had drifted -- a "League bag" list, a strike-rate card Mine does
  // not open on, a plain milestone list -- and a tour is a promise about
  // what the bowler will find.
  "look-score": () => (
    <Phone title="My Bowling Journey">
      <Spot>
        <div style={card}>
          <div style={label}>Game 1</div>
          <MiniRacks />
          <Frames highlight={3} />
        </div>
      </Spot>
      <Note>Scores, or every ball</Note>
      <div style={{ ...card, marginTop: "8px" }}>
        <div style={label}>Result</div>
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {/* The labels the app actually shows. "Other Leave" is the
              STORED value; the chip reads "Other", and a lefty sees
              Weak 7 / Ringing 7 rather than 10s. */}
          <span style={chip(false)}>Strike</span>
          <span style={chip(false)}>Weak 10</span>
          <span style={chip(false)}>Ringing 10</span>
          <span style={chip(false)}>Other</span>
        </div>
      </div>
      <Nav active={0} />
    </Phone>
  ),

  "look-gear": () => (
    <Phone title="Setup">
      {/* The header says "Setup"; which of the four you are on is the
          chip row, exactly as the real screen draws it. */}
      <Chips items={["Balls", "Bags", "League", "Team"]} sel={0} />
      <Spot style={{ marginTop: "8px" }}>
        <div style={card}>
          <div style={label}>Arsenal · 3 balls</div>
          <BallRow initials="PI" colour="#7B2A8C" name="Phaze II" line="47% strikes · 54% spares" spec="15lb · RG 2.5 / Diff 0.05" />
          <BallRow initials="HY" colour="#4B2A8C" name="Hy-Road" line="45% strikes · 61% spares" spec="15lb · RG 2.57 / Diff 0.046" />
          <BallRow initials="ST" colour="#2F7A4F" name="Storm Tour" line="45% strikes · 67% spares" spec="15lb · RG 2.49 / Diff 0.05" last />
        </div>
      </Spot>
      <Note>Layouts, surface, specs</Note>
      <Nav active={1} />
    </Phone>
  ),

  "look-team": () => (
    <Phone title="Setup">
      <Chips items={["Balls", "Bags", "League", "Team"]} sel={3} />
      <Spot style={{ marginTop: "8px" }}>
        <div style={card}>
          <div style={label}>Team</div>
          <Select value="Split Happens — Tuesday House Shot" />
        </div>
        <div style={card}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: C.text, fontFamily: F.body }}>Split Happens</div>
          <div style={{ ...muted, marginBottom: "6px" }}>Tuesday House Shot · 4 bowlers</div>
          <div style={label}>Roster / Bowling Order</div>
          <Row left="1.  You" right="215" />
          <Row left="2.  Rob" right="198" />
          <Row left="3.  Kim" right="186" />
          <Row left="4.  Dee" right="171" />
        </div>
      </Spot>
      <Note>A league first, a team later</Note>
      <Nav active={1} />
    </Phone>
  ),

  "look-stats": () => (
    <Phone title="Stats">
      <Spot>
        <Chips items={["Mine", "Trends", "Team", "Ball", "Game", "Center"]} sel={0} />
      </Spot>
      <div style={{ ...card, marginTop: "8px", display: "flex", gap: "6px" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={label}>Viewing</div>
          <Select value="You" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={label}>Compare To</div>
          <Select value="None" />
        </div>
      </div>
      <div style={{ ...card, position: "relative" }}>
        <div style={label}>This season</div>
        <Spot style={{ position: "absolute", top: "6px", right: "6px", padding: "1px 3px" }}>
          <EyeIcon />
        </Spot>
        <div style={{ display: "flex", gap: "4px" }}>
          <StatBox value="191" label="Average" />
          <StatBox value="47%" label="Strike" colour={C.strike} />
          <StatBox value="62%" label="Spare" colour={C.spare} />
        </div>
      </div>
      <Nav active={2} />
    </Phone>
  ),

  "look-journey": () => (
    <Phone title="My Bowling Journey">
      <Spot>
        <div style={{
          borderRadius: "10px", padding: "10px", marginBottom: "8px", color: "#FFFFFF",
          background: "linear-gradient(155deg, #0B4DB3 0%, #00398B 42%, #061A45 100%)",
        }}>
          {/* The Badges pill, which the slide's words promise and the
              picture did not have -- it is how badges are reached, so
              leaving it out sent a bowler hunting for a screen with no
              door on it. */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img src={journeyIcon} alt="" width="26" height="26" style={{ borderRadius: "7px" }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "12px", fontWeight: 700, fontFamily: F.body }}>My Bowling Journey</div>
              <div style={{ fontSize: "8.5px", opacity: 0.75, fontFamily: F.body }}>On the road since Jul 9</div>
            </div>
            <span style={{
              background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.22)",
              borderRadius: "999px", fontSize: "8.5px", fontWeight: 600,
              padding: "3px 7px", fontFamily: F.body, whiteSpace: "nowrap", flexShrink: 0,
            }}>{"\u{1F3C5}"} Badges</span>
          </div>
          <div style={{ display: "flex", marginTop: "8px", paddingTop: "6px", borderTop: "1px solid rgba(255,255,255,0.16)" }}>
            {[["15", "nights"], ["45", "games"], ["8,569", "pins down"], ["23", "milestones"]].map(([v, l]) => (
              <div key={l} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, fontFamily: F.num }}>{v}</div>
                <div style={{ fontSize: "7px", opacity: 0.75, fontFamily: F.body }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={card}>
          <div style={label}>Up next</div>
          <Row left="First 700 series" right="99%" colour={C.accent} />
          <Bar pct={99} colour={C.accent} />
          <div style={{ ...muted, marginTop: "3px" }}>4 pins short · best 696</div>
        </div>
      </Spot>
      <Nav active={0} />
    </Phone>
  ),

  "look-calendar": () => (
    <Phone title="History">
      {/* Four chips. Journey was one of these and is its own screen now,
          reached from Home -- drawing it here sent a bowler looking for
          a chip that is not on the row. */}
      <Chips items={["Sessions", "Season", "Calendar", "Journal"]} sel={2} />
      <Spot style={{ marginTop: "8px" }}>
        <div style={card}>
          <div style={label}>September</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "3px" }}>
            {Array.from({ length: 21 }, (_, i) => (
              <div key={i} style={{
                width: "11px", height: "11px", borderRadius: "3px",
                background: [3, 10, 17].includes(i) ? C.strike : C.border,
                opacity: [3, 10, 17].includes(i) ? 1 : 0.45,
              }} />
            ))}
          </div>
        </div>
        <div style={card}>
          <div style={label}>Journal</div>
          {/* Nothing is TYPED here: notes are written on the shot, the
              drill, the pattern or the session and gathered into this
              screen. What this screen adds is finding them again --
              search, plus the kind chips and the date range behind
              Filter. */}
          <div style={{
            border: `1px solid ${C.border}`, borderRadius: "6px", padding: "4px 8px",
            fontSize: "10px", color: C.textMuted, fontFamily: F.body, marginBottom: "6px",
          }}>Search your notes…</div>
          <div style={{
            fontSize: "9px", color: C.accent, fontFamily: F.body,
            textDecoration: "underline", marginBottom: "5px",
          }}>Filters</div>
          <div style={{ display: "flex", gap: "3px", flexWrap: "wrap", marginBottom: "6px" }}>
            <span style={chip(false)}>Night</span>
            <span style={chip(true)}>Tournament</span>
            <span style={chip(false)}>Drill</span>
            <span style={chip(false)}>Shot</span>
          </div>
          <div style={{ fontSize: "9px", color: C.textMuted, fontFamily: F.body }}>10 Sep</div>
          <div style={muted}>Lanes broke down early. Moved left 3 and it came back.</div>
        </div>
      </Spot>
      <Nav active={4} />
    </Phone>
  ),

  "look-more": () => (
    <div style={{ textAlign: "center", padding: "18px 10px" }}>
      <div style={{ fontSize: "28px", marginBottom: "10px" }}>🎳</div>
      {/* Read from TOUR_TRACKS rather than listed here.

          This was three hardcoded cards and stayed three after two more
          tours were written -- the closing slide of the first tour, the
          one whole job of which is telling a new bowler what else
          exists, quietly stopped naming half of it. A list that has to
          be updated by hand is a list that goes stale. */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxWidth: "240px", margin: "0 auto" }}>
        {TOUR_TRACKS.filter(t => t.key !== FIRST_TOUR).map(t => (
          <div key={t.key} style={{ ...card, marginBottom: 0, textAlign: "left" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: C.text, fontFamily: F.body }}>{t.label}</div>
            <div style={muted}>{t.blurb}</div>
          </div>
        ))}
      </div>
      <div style={{ ...muted, marginTop: "10px" }}>Settings › Walkthroughs</div>
    </div>
  ),

  // ── Scorekeeping ──────────────────────────────────────────────────────
  "score-game": () => (
    <Phone title="My Bowling Journey">
      <Spot>
        <div style={card}>
          <div style={label}>Tonight's scores</div>
          {[["Game 1", "212"], ["Game 2", "187"], ["Game 3", "—"]].map(([g, v]) => (
            <div key={g} style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
              <span style={{ ...muted, flex: 1 }}>{g}</span>
              <div style={{
                border: `1px solid ${v === "—" ? C.accent : C.border}`, borderRadius: "6px",
                padding: "4px 14px", fontSize: "12px", fontWeight: 700,
                color: v === "—" ? C.textMuted : C.text, fontFamily: F.body,
              }}>{v}</div>
            </div>
          ))}
        </div>
      </Spot>
      <Note>Three numbers and you're done</Note>
      <Nav active={0} />
    </Phone>
  ),

  // The three frame outcomes share a shape on purpose: same card, same
  // pin rack, different answer. The bowler learns one screen, not three.
  "score-strike": () => (
    <Phone title="My Bowling Journey">
      <div style={card}>
        <div style={label}>Frame 4 · Ball 1</div>
        <Spot>
          <div style={{ display: "flex", gap: "4px" }}>
            <span style={chip(true, C.strike)}>Strike</span>
            <span style={chip(false)}>Weak 10</span>
            <span style={chip(false)}>Other leave</span>
          </div>
        </Spot>
        <div style={{ marginTop: "8px" }}>
          <div style={{ ...label, marginBottom: "4px" }}>How it hit</div>
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            <span style={chip(true, C.strike)}>Flush</span>
            <span style={chip(false)}>High</span>
            <span style={chip(false)}>Messenger</span>
          </div>
        </div>
      </div>
      <Note>Frame over — no pins to pick</Note>
      <Nav active={0} />
    </Phone>
  ),

  "score-spare": () => (
    <Phone title="My Bowling Journey">
      <div style={card}>
        <div style={label}>Frame 5 · left standing</div>
        <Spot><PinRack standing={["10"]} /></Spot>
        <div style={{ marginTop: "8px" }}>
          <div style={{ ...label, marginBottom: "4px" }}>Spare Made</div>
          <div style={{ display: "flex", gap: "4px" }}>
            <span style={chip(true, C.strike)}>Yes</span>
            <span style={chip(false)}>No</span>
          </div>
        </div>
      </div>
      <Note>Tap the pins, then answer</Note>
      <Nav active={0} />
    </Phone>
  ),

  "score-open": () => (
    <Phone title="My Bowling Journey">
      <div style={card}>
        <div style={label}>Frame 6 · left standing</div>
        <PinRack standing={["2", "4", "5"]} />
        <div style={{ marginTop: "8px" }}>
          <div style={{ ...label, marginBottom: "4px" }}>Spare Made</div>
          <div style={{ display: "flex", gap: "4px" }}>
            <span style={chip(false)}>Yes</span>
            <span style={chip(true, C.miss)}>No</span>
          </div>
        </div>
        {/* The pin deck, not a counter: answering No opens the rack
            again and you tap which of the standing pins fell. The
            stepper this used to draw is not in the app any more. */}
        <Spot style={{ marginTop: "8px" }}>
          <div style={{ ...label, marginBottom: "4px" }}>Which pins did you knock down?</div>
          <PinRack standing={["2", "4", "5"]} knocked={["2", "4"]} caption="← tap what fell" />
        </Spot>
      </div>
      <Note>None fell? Just save</Note>
      <Nav active={0} />
    </Phone>
  ),

  "score-results": () => (
    <Phone title="My Bowling Journey">
      <Spot>
        <Chips items={["Set up", "Scoring", "Side games", "Results"]} sel={3} />
      </Spot>
      <div style={{ ...card, marginTop: "8px" }}>
        <div style={label}>Tonight</div>
        <Row left="Games" right="212 · 187 · 226" />
        <Row left="Series" right="625" colour={C.strike} />
        <Row left="vs average" right="+18" colour={C.strike} />
        <Row left="Won" right="$12 (3-6-10)" />
      </div>
      <Nav active={0} />
    </Phone>
  ),

  // ── AI ────────────────────────────────────────────────────────────────
  // The real import screen, in its real order: what kind of night, which
  // team, the date, then the file picker. The previous version drew a
  // dashed "photograph the monitor" placeholder and a score table, which
  // is not a screen this app has ever shown.
  // ── Tournaments ───────────────────────────────────────────────────────
  //
  // These stand on the Bowl tab, because that is where a tournament is
  // bowled -- the event's four tabs (Set up, Scoring, Brackets, Results)
  // sit INSIDE it rather than in the nav. Drawing them on a nav tab of
  // their own would send a bowler looking for a sixth row entry.
  "tourn-setup": () => (
    <Phone title="Tournament">
      <Chips items={["Set up", "Scoring", "Brackets", "Results"]} sel={0} />
      <div style={{ ...card, marginTop: "8px" }}>
        <div style={label}>Tournament</div>
        <Select value="Spring Masters" />
        <div style={{ ...label, marginTop: "8px" }}>Center</div>
        <Select value="Bowlero Pittsburgh" />
      </div>
      {/* Three independent questions, which is the thing worth teaching:
          they are not one setting with six values. */}
      <Spot>
        <div style={card}>
          <div style={{ display: "flex", gap: "6px" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={label}>Style</div>
              <div style={{ display: "flex", gap: "3px" }}>
                <span style={chip(true)}>Standard</span>
                <span style={chip(false)}>Baker</span>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={label}>Scoring</div>
              <div style={{ display: "flex", gap: "3px" }}>
                <span style={chip(true)}>Scratch</span>
                <span style={chip(false)}>Handicap</span>
              </div>
            </div>
          </div>
          <div style={{ marginTop: "8px" }}>
            <div style={label}>Format</div>
            <div style={{ display: "flex", gap: "3px" }}>
              <span style={chip(true)}>10 pin</span>
              <span style={chip(false)}>9 pin no-tap</span>
            </div>
          </div>
        </div>
      </Spot>
      <Note>Mix them however the event runs</Note>
      <Nav active={0} />
    </Phone>
  ),

  "tourn-qualifying": () => (
    <Phone title="Tournament">
      <Chips items={["Set up", "Scoring", "Brackets", "Results"]} sel={1} />
      <div style={{ marginTop: "8px" }}>
        <Chips items={["Qualifying", "Match Play", "Stepladder"]} sel={0} />
      </div>
      <div style={{ marginTop: "6px" }}>
        <Chips items={["Day 1", "Day 2"]} sel={1} />
      </div>
      <Spot style={{ marginTop: "6px" }}>
        <div style={card}>
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <span style={{ ...label, marginBottom: 0 }}>Cut</span>
            <span style={chip(true)}>+</span>
            <span style={chip(false)}>−</span>
            <div style={{
              flex: 1, border: `1px solid ${C.border}`, borderRadius: "6px",
              padding: "3px 6px", fontSize: "10px", color: C.text, fontFamily: F.body,
            }}>150</div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: C.strike }}>{"▲"} +62</span>
          </div>
          <div style={{ ...muted, marginTop: "4px" }}>
            1812 of 1750 across 8 games (all blocks so far).
          </div>
        </div>
      </Spot>
      <Note>Where you stand, updated every game</Note>
      <Nav active={0} />
    </Phone>
  ),

  "tourn-cut": () => (
    <Phone title="Tournament">
      <div style={card}>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <span style={{ ...label, marginBottom: 0 }}>Cut</span>
          <span style={{ ...muted, flex: 1 }}>+150</span>
          <span style={{ fontSize: "11px", fontWeight: 700, color: C.strike }}>{"▲"} +62</span>
        </div>
      </div>
      <Spot>
        <div style={card}>
          <div style={label}>Qualified for</div>
          <div style={{ display: "flex", gap: "3px", flexWrap: "wrap" }}>
            <span style={chip(true, C.strike)}>Match play</span>
            <span style={chip(false)}>Stepladder</span>
            <span style={chip(false)}>N/A</span>
          </div>
          <div style={{
            marginTop: "8px", borderRadius: "8px", padding: "6px",
            background: C.accent, color: "#FFFFFF", textAlign: "center",
            fontSize: "10px", fontWeight: 700, fontFamily: F.body,
          }}>Go to match play {"→"}</div>
        </div>
      </Spot>
      <Note>The margin already said you made it</Note>
      <Nav active={0} />
    </Phone>
  ),

  "tourn-match": () => (
    <Phone title="Tournament">
      <div style={{ marginBottom: "8px" }}>
        <Chips items={["Qualifying", "Match Play", "Stepladder"]} sel={1} />
      </div>
      <Spot>
        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
            <span style={{ fontSize: "10px", fontWeight: 700, color: C.text, fontFamily: F.body }}>
              Match 1 <span style={{ color: C.strike }}>WIN</span>
              <span style={{ color: C.textMuted, fontWeight: 400 }}> by 23</span>
            </span>
            <span style={{ fontSize: "9px", color: C.accent, fontFamily: F.body, textDecoration: "underline" }}>
              Track frames (G1)
            </span>
          </div>
          <div style={{ display: "flex", gap: "4px" }}>
            <Field head="Opponent" value="D. Rowe" />
            <Field head="You" value="223" lit />
            <Field head="Them" value="200" />
          </div>
        </div>
      </Spot>
      <Note>Game 1 again — qualifying doesn't follow you here</Note>
      <div style={card}>
        <Row left="Record" right="2–1" />
        <Row left="Bonus pins" right="+60" colour={C.strike} />
        <Row left="Total" right="705" />
      </div>
      <Nav active={0} />
    </Phone>
  ),

  "tourn-stepladder": () => (
    <Phone title="Tournament">
      <div style={{ marginBottom: "8px" }}>
        <Chips items={["Qualifying", "Match Play", "Stepladder"]} sel={2} />
      </div>
      <div style={card}>
        <div style={{ display: "flex", gap: "4px" }}>
          <Field head="Your seed" value="4" lit />
          <Field head="Date" value="22 Mar" />
        </div>
      </div>
      <Spot>
        <div style={card}>
          <div style={{ fontSize: "10px", fontWeight: 700, color: C.text, fontFamily: F.body, marginBottom: "5px" }}>
            Step 2 <span style={{ color: C.miss }}>LOSS</span>
            <span style={{ color: C.textMuted, fontWeight: 400 }}> by 11</span>
          </div>
          <div style={{ display: "flex", gap: "4px" }}>
            <Field head="Opponent" value="K. Vance" />
            <Field head="Seed" value="2" />
            <Field head="You" value="201" />
            <Field head="Them" value="212" />
          </div>
        </div>
      </Spot>
      <div style={{ ...card, textAlign: "center" }}>
        <div style={{ fontSize: "18px", fontWeight: 700, color: C.accent, fontFamily: F.body }}>2nd</div>
        <div style={label}>Finished</div>
        <div style={muted}>Won one step, then out to the 2 seed.</div>
      </div>
      <Note up={false}>Worked out from your seed — never asked</Note>
      <Nav active={0} />
    </Phone>
  ),

  "tourn-results": () => (
    <Phone title="Tournament">
      <Chips items={["Set up", "Scoring", "Brackets", "Results"]} sel={3} />
      <Spot style={{ marginTop: "8px" }}>
        <div style={card}>
          <div style={label}>Qualifying</div>
          <Row left="8 games" right="1812" />
          <Row left="Average" right="226" />
          <div style={{ ...label, marginTop: "8px" }}>Match play</div>
          <Row left="Record" right="2–1" colour={C.strike} />
          <div style={{ ...label, marginTop: "8px" }}>Stepladder</div>
          <Row left="Finished" right="2nd" colour={C.accent} />
        </div>
      </Spot>
      <div style={card}>
        <Row left="Brackets" right="+$45" colour={C.strike} />
        <Row left="Net" right="+$20" colour={C.strike} />
      </div>
      <Note up={false}>Every phase, and what it paid</Note>
      <Nav active={0} />
    </Phone>
  ),

  "ai-import-shot": () => (
    <Phone title="Import scorecard" headerIcon="import">
      <div style={card}>
        <div style={label}>What are you importing?</div>
        <div style={{ display: "flex", gap: "4px", marginBottom: "8px" }}>
          <span style={chip(false)}>Practice</span>
          <span style={chip(true)}>League</span>
          <span style={chip(false)}>Tournament</span>
        </div>

        <div style={label}>Which team?</div>
        <Select value="Split Happens · Tuesday" />

        <div style={{ ...label, marginTop: "8px" }}>Date</div>
        <Select value="18 Mar 2026" />

        <Spot style={{ marginTop: "8px" }}>
          <div style={label}>Scorecard Screenshot</div>
          {/* No "2 selected" caption. The picker on a phone hands back
              one photo at a time, so a count implying otherwise is a
              promise the screen does not keep. */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{
              border: `1px solid ${C.border}`, borderRadius: "6px",
              padding: "4px 8px", fontSize: "10px", color: C.text,
              fontFamily: F.body, background: C.surface,
            }}>Choose file</span>
            <div style={{
              width: "26px", height: "26px", borderRadius: "5px",
              border: `1px solid ${C.border}`, background: C.surface,
            }} />
          </div>
        </Spot>
      </div>
      <Nav active={0} />
    </Phone>
  ),

  "ai-insights": () => (
    <Phone title="Improve">
      <Spot>
        <div style={card}>
          <div style={label}>What changed</div>
          <div style={{ fontSize: "10px", color: C.text, fontFamily: F.body, lineHeight: 1.5 }}>
            Your Bionic is carrying 8% better than the Phaze II on this pattern — 61% against 53% over 94 first balls.
          </div>
        </div>
      </Spot>
      <div style={card}>
        <div style={label}>Not yet</div>
        <Row left="10 pin conversion" right="18 more" dim />
      </div>
      <Nav active={3} />
    </Phone>
  ),

  "ai-nightcap": () => (
    <Phone title="My Bowling Journey">
      <Chips items={["Set up", "Scoring", "Side games", "Results"]} sel={3} />
      <Spot style={{ marginTop: "8px" }}>
        <div style={{ ...card, border: `1px solid ${C.accent}66`, background: C.accent + "0D" }}>
          <div style={{ ...label, color: C.accent }}>Nightcap 🥃</div>
          <div style={{ fontSize: "10px", color: C.text, fontFamily: F.body, lineHeight: 1.55 }}>
            Six of your eight opens were single-pin leaves — the 10 alone cost you 27 pins. The Bionic carried everything in game three; it was the one you finished on.
          </div>
        </div>
      </Spot>
      <div style={card}>
        <div style={label}>Ryan's night</div>
        <Row left="Series" right="612" colour={C.strike} />
      </div>
      <Nav active={0} />
    </Phone>
  ),

  // Stands on Home with the LAMP lit, not on Improve.
  //
  // Brooklyn is reached from the header on every screen -- she is not a
  // tab, and lighting one sent bowlers to Improve looking for her.
  "ai-brooklyn": () => (
    <Phone title="My Bowling Journey" headerIcon="genie">
      <Note>Her lamp, on every screen</Note>
      <div style={card}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
          <Lamp on />
          <span style={{ fontSize: "11px", fontWeight: 700, color: C.text, fontFamily: F.body }}>Brooklyn</span>
          <span style={{ ...muted, marginLeft: "auto" }}>2 wishes left today</span>
        </div>
        <Spot>
          <div style={{
            border: `1px solid ${C.border}`, borderRadius: "8px", padding: "6px 8px",
            fontSize: "10px", color: C.textMuted, fontFamily: F.body,
          }}>
            Which ball should I start on next week?
          </div>
        </Spot>
        <div style={{ fontSize: "10px", color: C.text, fontFamily: F.body, marginTop: "6px", lineHeight: 1.5 }}>
          On a 37-foot pattern you've struck more with the Bionic every time out. Start there.
        </div>
      </div>
      <Nav active={0} />
    </Phone>
  ),

  // ── Stats ─────────────────────────────────────────────────────────────
  // ── Coaching ──────────────────────────────────────────────────────────
  //
  // On the Improve tab, because that is where the Coach button lives --
  // it is not a nav entry of its own, and the tab stays lit while the
  // Coach screen is open.
  "coach-connect": () => (
    <Phone title="Coach">
      <div style={card}>
        <div style={label}>Connect with someone</div>
        <div style={{ display: "flex", gap: "3px", marginBottom: "8px" }}>
          <span style={chip(false)}>They coach me</span>
          <span style={chip(true)}>I coach them</span>
        </div>
        {/* The code, drawn the way the screen shows it: big, spaced and
            meant to be read out loud. */}
        <Spot>
          <div style={{
            border: `1px solid ${C.accent}`, borderRadius: "10px",
            padding: "10px", textAlign: "center", background: C.accent + "12",
          }}>
            <div style={{ ...muted, marginBottom: "4px" }}>Read this to the bowler</div>
            <div style={{
              fontFamily: F.num, fontSize: "19px", fontWeight: 700,
              letterSpacing: "0.12em", color: C.text,
            }}>7KPQ-2M4R</div>
            <div style={{ ...muted, marginTop: "4px" }}>Works once, for the next 7 days</div>
          </div>
        </Spot>
      </div>
      <div style={card}>
        <div style={label}>Got a code?</div>
        <div style={{ display: "flex", gap: "4px" }}>
          <div style={{
            flex: 1, border: `1px solid ${C.border}`, borderRadius: "6px",
            padding: "4px 8px", fontSize: "11px", color: C.textMuted,
            fontFamily: F.num, letterSpacing: "0.08em",
          }}>ABCD-2345</div>
          <span style={{
            borderRadius: "6px", padding: "4px 10px", background: C.accent,
            color: "#FFFFFF", fontSize: "10px", fontWeight: 700, fontFamily: F.body,
          }}>Connect</span>
        </div>
      </div>
      <Note up={false}>Works once, on their phone</Note>
      <Nav active={3} />
    </Phone>
  ),

  "coach-switch": () => (
    <Phone title="Coach">
      <Spot>
        <div style={card}>
          <div style={label}>View</div>
          <div style={{ display: "flex", gap: "3px" }}>
            <span style={chip(false)}>I{"’"}m bowling</span>
            <span style={chip(true, C.spare)}>I{"’"}m coaching</span>
          </div>
        </div>
      </Spot>
      <div style={card}>
        <div style={label}>Your bowlers</div>
        <div style={{ display: "flex", gap: "3px", flexWrap: "wrap" }}>
          <span style={chip(true, C.accent)}>Dana Reyes</span>
          <span style={chip(false)}>{"•"} Sam Ortiz</span>
        </div>
      </div>
      <Note>A dot means they answered something</Note>
      <Nav active={3} />
    </Phone>
  ),

  "coach-bowler": () => (
    <Phone title="Coach">
      <div style={card}>
        <div style={{ display: "flex", gap: "3px" }}>
          <span style={chip(true, C.accent)}>Dana Reyes</span>
          <span style={chip(false)}>Sam Ortiz</span>
        </div>
      </div>
      <Spot>
        <div style={card}>
          <div style={label}>From 412 shots</div>
          <div style={{ display: "flex", gap: "4px", marginBottom: "8px" }}>
            <StatBox value="184" label="Average" />
            <StatBox value="41%" label="Strike" colour={C.strike} />
            <StatBox value="58%" label="Spare" colour={C.spare} />
          </div>
          <div style={label}>Recent</div>
          <Row left="18 Mar · Tuesday Classic" right="201 · 178 · 195" />
          <Row left="11 Mar · Tuesday Classic" right="166 · 212 · 180" />
        </div>
      </Spot>
      <Note up={false}>How much data it{"’"}s built on, beside it</Note>
      <Nav active={3} />
    </Phone>
  ),

  "coach-task": () => (
    <Phone title="Coach">
      <Spot>
        <div style={card}>
          <div style={label}>New task</div>
          <Select value="Clean up the single-pin spares" />
          <div style={{ ...label, marginTop: "8px" }}>Measurable target (optional)</div>
          <div style={{ display: "flex", gap: "4px" }}>
            <Field head="Metric" value="Spare %" />
            <Field head="Target" value="60" lit />
            <Field head="Due" value="1 Apr" />
          </div>
        </div>
      </Spot>
      <Note up={false}>Leave the target off if it isn{"’"}t a number</Note>
      <div style={card}>
        <Row left="Open" right="2" />
        <Row left="Done &amp; Attempted" right="5" dim />
      </div>
      <Nav active={3} />
    </Phone>
  ),

  "coach-respond": () => (
    <Phone title="Coach">
      <div style={card}>
        <div style={label}>View</div>
        <div style={{ display: "flex", gap: "3px" }}>
          <span style={chip(true)}>I{"’"}m bowling</span>
          <span style={chip(false, C.spare)}>I{"’"}m coaching</span>
        </div>
      </div>
      <Spot>
        <div style={card}>
          <div style={{ fontSize: "10px", fontWeight: 700, color: C.text, fontFamily: F.body, marginBottom: "4px" }}>
            Clean up the single-pin spares
          </div>
          <div style={{ ...muted, marginBottom: "6px" }}>Target 60% {"·"} due 1 Apr</div>
          <Bar pct={72} colour={C.spare} />
          <div style={{ ...muted, marginTop: "4px", marginBottom: "6px" }}>Reached 58% so far</div>
          <div style={{ display: "flex", gap: "4px" }}>
            <span style={chip(true, C.strike)}>Mark done</span>
            <span style={chip(false)}>Record attempt</span>
          </div>
        </div>
      </Spot>
      <Note up={false}>What came back, not just what was asked</Note>
      <Nav active={3} />
    </Phone>
  ),

  "stats-breakdown": () => (
    <Phone title="Stats">
      <Spot>
        <Chips items={["Mine", "Trends", "Team", "Ball", "Game", "Center"]} sel={3} />
      </Spot>
      <div style={{ ...card, marginTop: "8px" }}>
        <div style={label}>By ball · strike rate</div>
        <Row left="Bionic" right="61%" colour={C.strike} />
        <Row left="Phaze II" right="53%" />
        <Row left="Zen Master" right="47%" />
      </div>
      <Nav active={2} />
    </Phone>
  ),

  "stats-compare": () => (
    <Phone title="Stats">
      <div style={card}>
        <div style={label}>You vs Split Happens</div>
        <div style={{ marginBottom: "6px" }}>
          <Row left="You" right="61%" colour={C.strike} />
          <Bar pct={61} colour={C.strike} />
        </div>
        <div style={{ marginBottom: "6px" }}>
          <Row left="Rob" right="48%" />
          <Bar pct={48} />
        </div>
        <div>
          <Row left="Team average" right="52%" dim />
          <Bar pct={52} colour={C.textMuted} />
        </div>
      </div>
      <Note up={false}>Same measure, same scale</Note>
      <Nav active={2} />
    </Phone>
  ),

  "stats-thresholds": () => (
    <Phone title="Stats">
      <Spot>
        <div style={card}>
          <div style={label}>Ball · strike rate</div>
          <Row left="Bionic" right="61% · 94 shots" colour={C.strike} />
          {/* Shown, not locked: faded, with how many more it needs --
              the same way the Ball card treats a thin sample. */}
          <Row left="Zen Master" right="47% · 8 more shots needed" dim />
        </div>
      </Spot>
      <div style={card}>
        <div style={label}>Questions it can answer</div>
        <div style={{ fontSize: "10px", color: C.text, fontFamily: F.body, lineHeight: 1.6 }}>
          Which ball carries best?<br />Where is a spare leaking?<br />Do I fall off in game three?
        </div>
      </div>
      <Nav active={2} />
    </Phone>
  ),

  "stats-trend": () => (
    <Phone title="Stats">
      <Chips items={["Mine", "Trends", "Team", "Ball", "Game", "Center"]} sel={1} />
      <div style={{ ...card, marginTop: "8px" }}>
        <div style={{ display: "flex", gap: "4px", marginBottom: "6px" }}>
          <Field head="Metric" value="Average" />
          <Field head="Ball" value="All" />
          <Field head="League" value="Tue" />
        </div>
        <Spot>
          <Sparkline values={[188, 195, 191, 204, 199, 186, 178, 183, 192, 201, 208, 199, 212]} />
        </Spot>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
          <span style={muted}>Jan</span><span style={muted}>Mar</span>
        </div>
        <div style={{ display: "flex", gap: "4px", marginTop: "6px" }}>
          <span style={chip(false)}>Games</span>
          <span style={chip(true)}>Last 90 days</span>
          <span style={chip(false)}>Dates</span>
        </div>
      </div>
      <div style={{ ...muted, textAlign: "center" }}>Showing 13 of 40 games</div>
      <Nav active={2} />
    </Phone>
  ),
};
export default function TourScreen({ stepId, track }) {
  const Screen = SCREENS[stepId];
  if (!Screen) return null;
  return <Screen track={track} />;
}
