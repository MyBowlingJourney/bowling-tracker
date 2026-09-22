import { useState } from "react";
import { C, S, F, ActionRow } from "./ui.jsx";
import journeyIcon from "../journey-icon.png";
import { formatDate } from "./constants.js";
import {
  journeyMilestones,
  journeyProgress,
  bandedJourney,
  upcomingMilestones,
  describeUpcoming,
  journeyTotals,
  milestoneGlyph,
} from "./domain/journey.js";

// My Journey -- the screen the app is named after.
//
// It was a small grey zigzag of circles in an ordinary card: a dotted line
// running straight THROUGH the circles, raw ISO dates, every "first"
// labelled "1", and nothing ahead ("Keep bowling to see what's next").
// Correct, and forgettable, on the one screen that should feel like the
// point of the whole app.
//
// Now, top to bottom:
//   1. The hero -- the app's own mark on its own navy, the name, how long
//      the journey has been going, and the lifetime numbers.
//   2. Up next -- the one or two nearest steps, with how far along.
//   3. The road -- every milestone earned, newest first, on a line that
//      runs BEHIND solid medallions, with readable dates.
//   4. Older milestones folded by average band, then Badges.
//
// The brand colours in the hero are fixed rather than themed: the logo is
// navy in every theme, and the card is where the logo lives.

const BRAND = {
  top: "#0B4DB3",
  mid: "#00398B",
  deep: "#061A45",
  ink: "#FFFFFF",
  soft: "rgba(255,255,255,0.74)",
  line: "rgba(255,255,255,0.16)",
  glow: "#7CC4FF",
};

// Road geometry, in the SVG's own 320-wide units.
const X = [92, 228];
const STEP = 112;
const TOP_PAD = 58;
const BOTTOM_PAD = 48;
const R = 24;          // medallion radius
const R_LATEST = 31;   // the newest one, bigger

const day = iso => formatDate(iso, { weekday: false });

function Stat({ value, label }) {
  return (
    <div style={{ flex: 1, minWidth: 0, textAlign: "center" }}>
      {/* Sized for six digits: pins passes 100,000 in a few seasons. */}
      <div style={{ fontFamily: F.num, fontSize: String(value).length > 6 ? "20px" : "24px", fontWeight: 700,
        color: BRAND.ink, lineHeight: 1.05, whiteSpace: "nowrap" }}>
        {value}
      </div>
      <div style={{ fontSize: "11px", color: BRAND.soft, marginTop: "3px", letterSpacing: "0.02em" }}>
        {label}
      </div>
    </div>
  );
}

function Hero({ totals, earned, onOpenBadges }) {
  return (
    <div className="mbj-journey-hero" style={{
      ...S.card, padding: 0, overflow: "hidden", border: "none",
      background: `linear-gradient(155deg, ${BRAND.top} 0%, ${BRAND.mid} 42%, ${BRAND.deep} 100%)`,
      color: BRAND.ink, position: "relative",
    }}>
      {/* The lane from the logo, echoed faintly across the card. */}
      <svg viewBox="0 0 360 200" preserveAspectRatio="none" aria-hidden="true"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.22 }}>
        <path d="M -20 210 C 120 150, 180 120, 380 40" fill="none" stroke={BRAND.glow} strokeWidth="26" strokeLinecap="round" />
        <path d="M -20 238 C 130 176, 200 150, 380 78" fill="none" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" />
      </svg>

      <div style={{ position: "relative", padding: "18px 18px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img src={journeyIcon} alt="" width="52" height="52"
            style={{ borderRadius: "14px", boxShadow: "0 6px 18px rgba(0,0,0,0.35)", flexShrink: 0 }}
            onError={e => { e.currentTarget.style.display = "none"; }} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontFamily: F.display, fontSize: "19px", fontWeight: 700, lineHeight: 1.15 }}>
              My Bowling Journey
            </div>
            <div style={{ fontSize: "12px", color: BRAND.soft, marginTop: "3px" }}>
              {totals.since ? `On the road since ${day(totals.since)}` : "The road starts with your first night"}
            </div>
          </div>
          {onOpenBadges && (
            <button onClick={onOpenBadges} aria-label="Badges"
              style={{
                background: "rgba(255,255,255,0.14)", border: `1px solid ${BRAND.line}`,
                borderRadius: "999px", color: BRAND.ink, fontSize: "12px", fontWeight: 600,
                padding: "6px 10px", cursor: "pointer", flexShrink: 0,
                WebkitTapHighlightColor: "transparent",
              }}>
              {"\u{1F3C5}"} Badges
            </button>
          )}
        </div>

        <div style={{ display: "flex", marginTop: "18px", paddingTop: "14px", borderTop: `1px solid ${BRAND.line}` }}>
          <Stat value={totals.nights.toLocaleString()} label={totals.nights === 1 ? "night" : "nights"} />
          <Stat value={totals.games.toLocaleString()} label={totals.games === 1 ? "game" : "games"} />
          <Stat value={totals.pins.toLocaleString()} label="pins down" />
          <Stat value={earned.toLocaleString()} label={earned === 1 ? "milestone" : "milestones"} />
        </div>
      </div>
    </div>
  );
}

function Medallion({ glyph, color, size = 40, filled = false }) {
  const long = String(glyph).length > 2;
  return (
    <div style={{
      width: `${size}px`, height: `${size}px`, borderRadius: "50%", flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      backgroundColor: filled ? color : C.card, border: `2px solid ${color}`,
      color: filled ? C.onAccent : color, fontFamily: F.num, fontWeight: 700,
      fontSize: long ? "12px" : "15px",
    }}>
      {glyph}
    </div>
  );
}

function UpNext({ steps }) {
  if (!steps.length) return null;
  return (
    <div style={S.card}>
      <div style={S.label}>Up next</div>
      {steps.map((m, i) => (
        <div key={m.id} style={{ display: "flex", alignItems: "center", gap: "12px",
          paddingTop: i ? "12px" : "4px", marginTop: i ? "12px" : 0,
          borderTop: i ? `1px solid ${C.border}` : "none" }}>
          <Medallion glyph={milestoneGlyph(m)} color={C.accent} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px" }}>
              <div style={{ fontSize: "14px", fontWeight: 600, color: C.text }}>{m.label}</div>
              <div style={{ fontFamily: F.num, fontSize: "13px", fontWeight: 700, color: C.accent, flexShrink: 0 }}>
                {Math.round(m.progress * 100)}%
              </div>
            </div>
            <div style={{ height: "7px", borderRadius: "4px", backgroundColor: C.surface, overflow: "hidden", margin: "7px 0 5px" }}>
              <div style={{ width: `${Math.max(4, Math.round(m.progress * 100))}%`, height: "100%",
                borderRadius: "4px", background: `linear-gradient(90deg, ${C.accent}, ${C.strike})` }} />
            </div>
            <div style={{ fontSize: "11.5px", color: C.textMuted }}>{describeUpcoming(m)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Road({ drawn }) {
  const height = TOP_PAD + (drawn.length - 1) * STEP + BOTTOM_PAD;
  const pos = i => ({ x: X[i % 2], y: TOP_PAD + i * STEP });
  const path = drawn.map((m, i) => {
    const p = pos(i);
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = pos(i - 1);
    const mid = (prev.y + p.y) / 2;
    return `C ${prev.x} ${mid}, ${p.x} ${mid}, ${p.x} ${p.y}`;
  }).join(" ");

  return (
    <svg viewBox={`0 0 320 ${height}`} style={{ width: "100%", height: "auto", display: "block" }}
      role="img" aria-label="Your bowling milestones, newest first">
      <defs>
        <linearGradient id="journeyRoad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.accent} />
          <stop offset="100%" stopColor={C.strike} stopOpacity="0.55" />
        </linearGradient>
      </defs>
      {/* The road: a soft wide band with a bright centre line, drawn FIRST
          so every medallion sits on top of it rather than being crossed
          by it. */}
      <path d={path} fill="none" stroke={C.accent} strokeOpacity="0.14" strokeWidth="18" strokeLinecap="round" />
      <path d={path} fill="none" stroke="url(#journeyRoad)" strokeWidth="3.5" strokeLinecap="round" />

      {drawn.map((m, i) => {
        const p = pos(i);
        const latest = i === 0;
        const r = latest ? R_LATEST : R;
        const col = latest ? C.accent : C.strike;
        const glyph = milestoneGlyph(m);
        const labelLeft = p.x > 160;
        const tx = labelLeft ? p.x - r - 12 : p.x + r + 12;
        const anchor = labelLeft ? "end" : "start";
        return (
          <g key={m.id}>
            {latest && <circle cx={p.x} cy={p.y} r={r + 8} fill={C.accent} fillOpacity="0.16" />}
            <circle cx={p.x} cy={p.y} r={r} fill={C.card} stroke={col} strokeWidth={latest ? 3 : 2} />
            <circle cx={p.x} cy={p.y} r={r - 5} fill={col} fillOpacity={latest ? 0.2 : 0.12} />
            <text x={p.x} y={p.y + (String(glyph).length > 2 ? 4 : 5)} textAnchor="middle"
              style={{ fontFamily: F.num, fontSize: String(glyph).length > 2 ? "12px" : latest ? "16px" : "14px",
                fontWeight: 700, fill: col }}>
              {glyph}
            </text>
            {latest && (
              <text x={tx} y={p.y - 22} textAnchor={anchor}
                style={{ fontSize: "9.5px", fontWeight: 700, letterSpacing: "0.08em", fill: C.accent }}>
                LATEST
              </text>
            )}
            <text x={tx} y={p.y - 3} textAnchor={anchor}
              style={{ fontSize: latest ? "14px" : "13px", fontWeight: latest ? 700 : 600, fill: C.text }}>
              {m.label}
            </text>
            <text x={tx} y={p.y + 14} textAnchor={anchor}
              style={{ fontSize: "11px", fill: C.textMuted }}>
              {day(m.date)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function JourneyView({ onOpenBadges, sessions = [], tournaments = [], bowler = "", shots = [] }) {
  const mine = (Array.isArray(sessions) ? sessions : [])
    .filter(s => s && (!bowler || s.bowler === bowler));
  const myShots = (Array.isArray(shots) ? shots : [])
    .filter(sh => sh && (!bowler || sh.bowler === bowler));
  const milestones = journeyMilestones(mine, tournaments, myShots);
  const upcoming = upcomingMilestones(mine, tournaments, myShots, 2);
  const totals = journeyTotals(mine);

  const allScores = mine.flatMap(s => Array.isArray(s.scores) ? s.scores : [])
    .map(Number).filter(Number.isFinite);
  const average = allScores.length
    ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
    : 0;
  const { open: openMilestones, bands } = bandedJourney(milestones, average);
  const [openBands, setOpenBands] = useState({});
  const { earned } = journeyProgress(milestones);

  // Newest first: the top of the road is where the bowler is now.
  const drawn = [...openMilestones].reverse();

  if (!drawn.length) {
    return (
      <>
        <Hero totals={totals} earned={0} onOpenBadges={onOpenBadges} />
        <div style={{ ...S.card, textAlign: "center", padding: "22px 16px" }}>
          <div style={{ fontSize: "14px", fontWeight: 600, color: C.text }}>Your road starts here</div>
          <div style={{ fontSize: "12.5px", color: C.textMuted, marginTop: "8px", lineHeight: 1.6 }}>
            Log a night and your first milestones land on the road with the
            date you did them — first strike, first spare, first 100.
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Hero totals={totals} earned={earned} onOpenBadges={onOpenBadges} />
      <UpNext steps={upcoming} />

      <div style={{ ...S.card, paddingTop: "14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={S.label}>The road so far</div>
          <div style={{ fontSize: "11px", color: C.textMuted }}>newest first</div>
        </div>
        <Road drawn={drawn} />

        {/* Folded history, nearest first.

            A 200 average bowler has earned every step up to 180 and should
            not scroll past "Broke 75" to reach their own road. Deleting
            those would be worse -- they did break 75, on a date, and that
            is the whole point of a timeline. So they fold instead. */}
        {bands.map(band => {
          const isOpen = !!openBands[band.ceiling];
          return (
            <div key={band.ceiling} style={{ marginTop: "8px",
              borderTop: `1px solid ${C.border}`, paddingTop: "8px" }}>
              <button
                onClick={() => setOpenBands(o => ({ ...o, [band.ceiling]: !isOpen }))}
                aria-expanded={isOpen}
                style={{ background: "none", border: "none", padding: "4px 0", width: "100%",
                  textAlign: "left", cursor: "pointer", color: C.textMuted,
                  fontSize: "12px", display: "flex", justifyContent: "space-between" }}>
                <span>{isOpen ? "▾" : "▸"} {band.label}</span>
                <span>{band.milestones.length}</span>
              </button>
              {isOpen && (
                <div style={{ marginTop: "4px" }}>
                  {band.milestones.map(m => (
                    <div key={m.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "5px 0" }}>
                      <Medallion glyph={milestoneGlyph(m)} color={C.strike} size={30} />
                      <span style={{ flex: 1, fontSize: "12.5px", color: C.text }}>{m.label}</span>
                      <span style={{ fontSize: "11px", color: C.textMuted }}>{day(m.date)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {onOpenBadges && (
        <div style={{ ...S.card, padding: "6px 12px" }}>
          {/* Badges live at the foot of the road as well as in the hero.
              A badge and a milestone are both a record of something
              earned; milestones are dated points on a line and badges are
              a collection. */}
          <ActionRow
            icon={"\u{1F3C5}"}
            color={C.spare}
            label="Badges"
            detail="What you've collected along the way"
            onClick={onOpenBadges} />
        </div>
      )}
    </>
  );
}
