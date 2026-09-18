import { C, S, F } from "./ui.jsx";

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
        <span style={{ display: "flex", gap: "8px", fontSize: "13px" }}>
          <span style={lit(headerIcon === "help")}>🔍</span>
          {!casual && <span style={lit(headerIcon === "import")}>📷</span>}
          <span style={{ opacity: 0.55 }}>👤</span>
          <span style={lit(headerIcon === "settings")}>⚙️</span>
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
const NAV_TABS = [
  ["🏠", "Home"], ["🎒", "Gear"], ["👥", "Team"],
  ["📈", "Stats"], ["🎯", "Improve"], ["📖", "History"],
];
export const TAB_INDEX = { home: 0, gear: 1, team: 2, stats: 3, improve: 4, history: 5, log: 0 };

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
function PinRack({ standing = [] }) {
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
        return (
          <div key={n} style={{
            position: "absolute", left: `${x}%`, top: `${r * gap + 3}px`,
            transform: "translateX(-50%)", width: `${size}px`, height: `${size}px`,
            borderRadius: "50%", boxSizing: "border-box",
            border: `2px solid ${on ? C.spare : C.border}`,
            background: on ? C.spare + "33" : C.surface,
            color: on ? C.spare : C.textMuted,
            fontSize: "9px", fontWeight: 700, fontFamily: F.body,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>{n}</div>
        );
      }))}
      <div style={{ ...muted, position: "absolute", right: 0, bottom: 0 }}>← still standing</div>
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
      <span style={{ fontWeight: 700, color: colour || C.text }}>{right}</span>
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

const SCREENS = {
  // ── Look around ───────────────────────────────────────────────────────
  //
  // Each of these stands on the tab it is describing, so the lit nav
  // entry and the content agree. That is the whole teaching job: this
  // row, that screen.
  "look-score": () => (
    <Phone title="Bowl">
      <Spot>
        <div style={card}>
          <div style={label}>Game 1</div>
          <Frames highlight={3} />
        </div>
      </Spot>
      <Note>Scores, or every ball</Note>
      <Nav active={0} />
    </Phone>
  ),

  "look-gear": () => (
    <Phone title="Gear">
      <Spot>
        <div style={card}>
          <div style={label}>League bag · 4 balls</div>
          <Row left="Bionic" right="15 lb" />
          <Row left="Phaze II" right="15 lb" />
          <Row left="Zen Master" right="15 lb" />
          <Row left="Spare ball" right="15 lb" dim />
        </div>
      </Spot>
      <Note>Layouts, surface, specs</Note>
      <Nav active={1} />
    </Phone>
  ),

  "look-team": () => (
    <Phone title="Team">
      <Spot>
        <div style={card}>
          <div style={label}>Tuesday House Shot</div>
          <Row left="Split Happens" right="4 bowlers" />
        </div>
        <div style={card}>
          <div style={label}>Roster</div>
          <Row left="You" right="215" />
          <Row left="Rob" right="198" />
          <Row left="Kim" right="186" />
        </div>
      </Spot>
      <Note>A league first, a team later</Note>
      <Nav active={2} />
    </Phone>
  ),

  "look-stats": () => (
    <Phone title="Stats">
      <Spot>
        <Chips items={["Mine", "Trends", "Team", "Ball", "Game", "Center"]} sel={0} />
      </Spot>
      <div style={{ ...card, marginTop: "8px" }}>
        <div style={label}>Strike rate</div>
        <Row left="This season" right="61%" colour={C.strike} />
        <Row left="Last season" right="54%" dim />
      </div>
      <Nav active={3} />
    </Phone>
  ),

  "look-journey": () => (
    <Phone title="My Bowling Journey">
      <Spot>
        <div style={card}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: C.text, fontFamily: F.body }}>My journey</div>
          <Row left="First 200 game" right="4 Mar" colour={C.strike} />
          <Row left="First 600 series" right="18 Mar" colour={C.strike} />
          <Row left="First turkey" right="2 Apr" colour={C.strike} />
        </div>
        <div style={card}>
          <div style={label}>Badges</div>
          <div style={{ display: "flex", gap: "6px", fontSize: "16px" }}>
            <span>🏆</span><span>🎯</span><span>🔥</span><span style={{ opacity: 0.3 }}>🎳</span>
          </div>
        </div>
      </Spot>
      <Nav active={0} />
    </Phone>
  ),

  "look-calendar": () => (
    <Phone title="History">
      <Spot>
        <div style={card}>
          <div style={label}>March</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "3px" }}>
            {Array.from({ length: 21 }, (_, i) => (
              <div key={i} style={{
                width: "11px", height: "11px", borderRadius: "3px",
                background: [1, 8, 15].includes(i) ? C.strike : C.border,
                opacity: [1, 8, 15].includes(i) ? 1 : 0.45,
              }} />
            ))}
          </div>
        </div>
        <div style={card}>
          <div style={label}>Journal · 18 Mar</div>
          <div style={muted}>Lanes broke down early. Moved left 3 and it came back.</div>
        </div>
      </Spot>
      <Nav active={5} />
    </Phone>
  ),

  // ── Scorekeeping ──────────────────────────────────────────────────────
  "score-game": () => (
    <Phone title="Bowl">
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
    <Phone title="Bowl">
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
    <Phone title="Bowl">
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
    <Phone title="Bowl">
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
        <Spot style={{ marginTop: "8px" }}>
          <div style={{ ...label, marginBottom: "4px" }}>Knocked down</div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ ...chip(false), padding: "4px 10px" }}>−</span>
            <span style={{ fontSize: "14px", fontWeight: 700, color: C.text, fontFamily: F.body }}>2</span>
            <span style={{ ...chip(false), padding: "4px 10px" }}>+</span>
          </div>
        </Spot>
      </div>
      <Nav active={0} />
    </Phone>
  ),

  "score-results": () => (
    <Phone title="Bowl">
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
  "ai-import-shot": () => (
    <Phone title="Bowl" headerIcon="import">
      <div style={card}>
        <div style={label}>Scorecard</div>
        <div style={{
          border: `1px dashed ${C.accent}`, borderRadius: "8px",
          padding: "18px 8px", textAlign: "center",
        }}>
          <div style={{ fontSize: "22px" }}>📷</div>
          <div style={{ ...muted, marginTop: "4px" }}>Photograph the monitor</div>
        </div>
      </div>
      <Note up={false}>The camera icon, top right</Note>
      <ScoreTable rows={[["You", ["212", "187"]], ["Rob", ["165", "201"]]]} />
      <Nav active={0} />
    </Phone>
  ),

  "ai-import-check": () => (
    <Phone title="History">
      <Spot>
        <div style={card}>
          <div style={label}>Imported · waiting on you</div>
          <Row left="You · 18 Mar" right="212 · 187 · 226" />
          <Row left="Rob · 18 Mar" right="165 · 201 · 178" />
          <div style={{ display: "flex", gap: "4px", marginTop: "6px" }}>
            <span style={chip(true, C.strike)}>Confirm</span>
            <span style={chip(false)}>Edit</span>
          </div>
        </div>
      </Spot>
      <Note>Nothing files until you say so</Note>
      <Nav active={5} />
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
      <Nav active={4} />
    </Phone>
  ),

  "ai-brooklyn": () => (
    <Phone title="Improve">
      <div style={card}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
          <span style={{ fontSize: "14px" }}>🧞‍♀️</span>
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
      <Nav active={4} />
    </Phone>
  ),

  // ── Stats ─────────────────────────────────────────────────────────────
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
      <Nav active={3} />
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
      <Nav active={3} />
    </Phone>
  ),

  "stats-thresholds": () => (
    <Phone title="Stats">
      <Spot>
        <div style={card}>
          <div style={label}>Ball comparison · locked</div>
          <Row left="Bionic" right="94 of 50 ✓" colour={C.strike} />
          <Row left="Zen Master" right="31 of 50" dim />
          <div style={{ ...muted, marginTop: "6px" }}>19 more first balls with the Zen Master.</div>
        </div>
      </Spot>
      <div style={card}>
        <div style={label}>Questions it can answer</div>
        <div style={{ fontSize: "10px", color: C.text, fontFamily: F.body, lineHeight: 1.6 }}>
          Which ball carries best?<br />Where is a spare leaking?<br />Do I fall off in game three?
        </div>
      </div>
      <Nav active={3} />
    </Phone>
  ),

  "stats-trend": () => (
    <Phone title="Stats">
      <Chips items={["Mine", "Trends", "Team", "Ball", "Game", "Center"]} sel={1} />
      <Spot style={{ marginTop: "8px" }}>
        <div style={card}>
          <div style={{ display: "flex", gap: "4px", marginBottom: "6px" }}>
            <Field head="Metric" value="Average" />
            <Field head="Ball" value="All" />
            <Field head="League" value="Tue" />
          </div>
          <div style={{ display: "flex", gap: "4px" }}>
            <span style={chip(false)}>Games</span>
            <span style={chip(true)}>Last 90 days</span>
            <span style={chip(false)}>Dates</span>
          </div>
        </div>
      </Spot>
      <div style={{ ...muted, textAlign: "center" }}>Showing 13 of 40 games</div>
      <Nav active={3} />
    </Phone>
  ),
};
export default function TourScreen({ stepId, track }) {
  const Screen = SCREENS[stepId];
  if (!Screen) return null;
  return <Screen track={track} />;
}
