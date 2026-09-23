import { useState } from "react";
import { C, S, Chip } from "./ui.jsx";

import { practiceLeagueDisplayName } from "./constants.js";
import {
  monthGrid,
  monthsWithSessions,
  monthLabel,
  weekdayLabels,
  shiftMonth,
  tournamentNights,
  cellModes,
  shotNights,
  drillNights,
  nightNotes,
  withTournamentDetail,
} from "./domain/calendar.js";

// A month of bowling nights.
//
// The Sessions list answers "what did I shoot". This answers a different
// question: when do I actually bowl, and what does a month of it look
// like. Gaps carry as much as entries -- three weeks missed in February
// is obvious here and invisible in a list.
//
// A tapped night expands in place rather than navigating away, because
// the reason to be here is scanning the shape of a month and losing the
// grid to see one night defeats that.
// One colour per kind of night.
//
// Drawn from the existing palette rather than invented, so the calendar
// agrees with the rest of the app: accent for league (the default
// bowling colour everywhere else), spare-green for practice, strike for
// tournament, muted for open bowling -- which is deliberately the
// quietest, since it is the mode that strips everything back.
// Four modes, four colours that are actually different.
//
// practice used to be c.spare, which in the default "lane" theme is the
// SAME hex as c.accent -- so league and practice drew identically and
// the calendar read as uncoloured. A palette token means a role
// ("spare"), not a distinct hue, and two roles can share one.
//
// miss is the only remaining token that differs from accent in every
// theme; checked across all eight.
// Fixed hues, not theme tokens: in Pin deck accent AND miss are both red,
// so league and practice drew the same. Mid-brightness so they read on
// light and dark cards alike.
const MODE_COLORS = {
  league: () => "#3B82F6",
  practice: () => "#22A55B",
  tournament: () => "#E0902A",
  casual: c => c.textMuted,
};

const MODE_LABELS = {
  league: "League",
  practice: "Practice",
  tournament: "Tournament",
  casual: "Open bowling",
};

// A tournament day, phase by phase.
const FINISH_LABEL = {
  won: "\u{1F3C6} Won it",
  runnerUp: "\u{1F948} Runner-up",
  topFive: "\u{1F3C5} Top five",
  cashed: "\u{1F4B0} Cashed",
  madeCut: "\u2705 Made the cut",
};

function ordinalPlace(n) {
  const v = Math.abs(Math.round(Number(n)));
  if (!Number.isFinite(v)) return "";
  const r100 = v % 100;
  if (r100 >= 11 && r100 <= 13) return `${v}th`;
  const r10 = v % 10;
  return `${v}${r10 === 1 ? "st" : r10 === 2 ? "nd" : r10 === 3 ? "rd" : "th"}`;
}

function TournamentNightLines({ event, scores }) {
  const e = event || {};
  const q = e.qualifying;
  const finish = FINISH_LABEL[e.placement] || "";
  const line = { fontSize: "11px", color: C.textMuted, marginTop: "2px" };
  const heading = { fontSize: "10px", color: C.textMuted, letterSpacing: "0.06em", marginTop: "6px" };
  return (
    <>
      {/* The finish leads: it is what the day amounted to. */}
      {finish && (
        <div style={{ fontSize: "13px", fontWeight: 700, color: C.strike, marginBottom: "4px" }}>
          {finish}
        </div>
      )}

      {q && (<>
        <div style={heading}>QUALIFYING</div>
        <div style={{ fontSize: "13px", color: C.text }}>{(scores || []).join(" \u00b7 ")}</div>
        <div style={line}>
          {q.total} total · {q.average} average · {q.high} high
          {q.handicap > 0 ? ` (${q.scratch} scratch + ${q.handicap} hcp)` : ""}
          {e.cutMargin !== null && e.cutMargin !== undefined && (
            <span style={{ color: e.cutMargin >= 0 ? C.strike : C.miss, fontWeight: 600 }}>
              {" \u00b7 "}{e.cutMargin >= 0 ? `+${e.cutMargin}` : e.cutMargin} vs the cut
            </span>
          )}
        </div>
      </>)}

      {e.matchPlay && (<>
        <div style={heading}>MATCH PLAY</div>
        <div style={line}>
          {e.matchPlay.wins}-{e.matchPlay.losses}{e.matchPlay.ties ? `-${e.matchPlay.ties}` : ""}
          {" over "}{e.matchPlay.played} match{e.matchPlay.played === 1 ? "" : "es"}
          {e.matchPlay.average !== null ? ` \u00b7 ${e.matchPlay.average} average` : ""}
          {" \u00b7 "}{e.matchPlay.total} with bonus
        </div>
      </>)}

      {e.stepladder && (<>
        <div style={heading}>STEPLADDER</div>
        <div style={line}>
          {e.stepladder.seed ? `${ordinalPlace(e.stepladder.seed)} seed \u00b7 ` : ""}
          {e.stepladder.wins} of {e.stepladder.played} step{e.stepladder.played === 1 ? "" : "s"} won
          {e.stepladder.place ? ` \u00b7 finished ${ordinalPlace(e.stepladder.place)}` : ""}
        </div>
      </>)}
    </>
  );
}

export default function CalendarView({
  sessions = [], shots = [], drills = [], tournaments = [], bowler = "", league = "", weekStart = 0,
  onDeleteNight, onOpenNight,
}) {
  // Tournament days are folded in as nights, because they are nights the
  // bowler bowled -- they just live in a different table. Without this a
  // tournament weekend is a blank square.
  //
  // Only when no league filter is on: a tournament is not part of a
  // league, so filtering to one and still showing them would be wrong.
  const allNights = league
    ? (() => {
        const base = [...sessions, ...shotNights(shots, sessions)];
        return withTournamentDetail([...base, ...drillNights(drills, base)], tournaments);
      })()
    : (() => {
        const base = [...sessions, ...shotNights(shots, sessions)];
        // withTournamentDetail, not just the tournamentNights below: a
        // saved tournament also leaves a session row, and that is the
        // one the calendar shows. Without this the phases appear only
        // for an event with no session behind it.
        return withTournamentDetail([...base, ...drillNights(drills, base),
                ...tournamentNights(tournaments, bowler)], tournaments);
      })();

  const months = monthsWithSessions(allNights, bowler, league);

  const [monthIdx, setMonthIdx] = useState(0);
  const [openDate, setOpenDate] = useState(null);
  // Which night is one tap from being deleted. Cleared by paging
  // months or opening another night, so a primed Delete cannot sit
  // waiting on a screen the bowler has moved on from.
  const [armed, setArmed] = useState(null);

  if (!months.length) {
    return (
      <div style={S.card}>
        <div style={{ fontSize: "12px", color: C.textMuted, lineHeight: 1.5 }}>
          Nothing logged yet. Once you've bowled a night or two, this shows the
          shape of a month — which weeks you bowled and which you missed.
        </div>
      </div>
    );
  }

  // Clamped rather than wrapped: paging past the oldest month should
  // stop, not jump to the newest.
  const key = months[Math.min(Math.max(monthIdx, 0), months.length - 1)];
  const grid = monthGrid(key, allNights, bowler, league, weekStart);
  if (!grid) return null;

  // Stepping moves by calendar month, but only lands on months with
  // something in them -- an empty month between two busy ones is worth
  // seeing INSIDE a grid, not as a blank page to click through.
  const step = dir => {
    const next = monthIdx + dir;
    if (next < 0 || next >= months.length) return;
    setMonthIdx(next);
    setOpenDate(null);
    setArmed(null);
  };

  // Solid for one kind of night, a horizontal split for two.
  function cellFill(nights) {
    const modes = cellModes(nights);
    const col = m => (MODE_COLORS[m] || MODE_COLORS.league)(C) + "44";
    if (modes.length === 1) return { backgroundColor: col(modes[0]) };
    return {
      backgroundColor: "transparent",
      backgroundImage: `linear-gradient(to bottom, ${col(modes[0])} 0 50%, ${col(modes[1])} 50% 100%)`,
    };
  }

  // Which colours are actually on screen this month. A fixed legend
  // would explain colours the bowler cannot see.
  const modesShown = [...new Set(grid.cells.flatMap(c => c.nights.map(n => n.mode || "league")))];

  const open = openDate

    ? grid.cells.find(c => c.date === openDate)
    : null;

  return (
    <>
      <div style={{ ...S.card, paddingBottom: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
          <button
            onClick={() => step(1)}
            disabled={monthIdx >= months.length - 1}
            aria-label="Earlier month"
            style={{
              ...S.btn("sm"), width: "auto", padding: "4px 10px",
              opacity: monthIdx >= months.length - 1 ? 0.35 : 1,
            }}>‹</button>
          <div style={{ flex: 1, textAlign: "center", fontSize: "14px", fontWeight: 600, color: C.text }}>
            {grid.label}
          </div>
          <button
            onClick={() => step(-1)}
            disabled={monthIdx <= 0}
            aria-label="Later month"
            style={{
              ...S.btn("sm"), width: "auto", padding: "4px 10px",
              opacity: monthIdx <= 0 ? 0.35 : 1,
            }}>›</button>
        </div>

        <div style={{ fontSize: "11px", color: C.textMuted, textAlign: "center", marginBottom: "10px" }}>
          {grid.nightsBowled
            ? `${grid.nightsBowled} night${grid.nightsBowled === 1 ? "" : "s"} · ${grid.games} games · ${grid.average} average · ${grid.high} high`
            : "Nothing bowled this month"}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
          {weekdayLabels(weekStart).map((d, i) => (
            <div key={i} style={{
              fontSize: "10px", color: C.textMuted, textAlign: "center",
              paddingBottom: "4px",
            }}>{d}</div>
          ))}

          {grid.cells.map((cell, i) => {
            const bowled = cell.nights.length > 0;
            const selected = cell.date && cell.date === openDate;
            return (
              <button
                key={i}
                disabled={!bowled}
                onClick={() => { setArmed(null); setOpenDate(selected ? null : cell.date); }}
                style={{
                  aspectRatio: "1", border: selected ? `1.5px solid ${C.accent}` : "1px solid transparent",
                  borderRadius: "6px",
                  // A bowled night is filled; an empty day is just a
                  // number. The contrast is the whole point of the view.
                  //
                  // Two kinds of night on one day -- a league night and
                  // a practice session, say -- splits the square
                  // horizontally rather than one silently winning.
                  // Three or more is not worth a third band: the square
                  // is 40px and the detail is one tap away.
                  ...(bowled ? cellFill(cell.nights) : { backgroundColor: "transparent" }),

                  color: cell.day === null ? "transparent" : (bowled ? C.text : C.textMuted),
                  fontSize: "11px", fontWeight: bowled ? 600 : 400,
                  cursor: bowled ? "pointer" : "default",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: "1px",
                  padding: 0, WebkitTapHighlightColor: "transparent",
                }}>
                <span>{cell.day ?? ""}</span>
                {/* The series is the one number that fits in a box this
                    size. Everything else waits for a tap. */}
                {bowled && (
                  <span style={{ fontSize: "8.5px", fontWeight: 400, color: C.textMuted }}>
                    {cell.nights.length === 1 ? cell.nights[0].series : `${cell.nights.length}×`}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Only the colours actually on screen. A fixed legend would
            explain a colour the bowler cannot see this month. */}
        {modesShown.length > 1 && (
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", marginTop: "10px" }}>
            {modesShown.map(m => (
              <div key={m} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{
                  width: "9px", height: "9px", borderRadius: "2px",
                  backgroundColor: (MODE_COLORS[m] || MODE_COLORS.league)(C) + "88",
                }} />
                <span style={{ fontSize: "10px", color: C.textMuted }}>{MODE_LABELS[m] || m}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {open && open.nights.map((night, i) => (
        <div key={i} style={{ ...S.card, cursor: onOpenNight ? "pointer" : undefined }}
          role={onOpenNight ? "button" : undefined} tabIndex={onOpenNight ? 0 : undefined}
          aria-label={onOpenNight ? `Open results for ${night.date}` : undefined}
          onClick={onOpenNight ? e => { if (e.target.closest("button")) return; onOpenNight(night); } : undefined}
          onKeyDown={onOpenNight ? e => { if (e.key === "Enter" && e.target === e.currentTarget) onOpenNight(night); } : undefined}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: (MODE_COLORS[night.mode]||MODE_COLORS.league)(C) }}>
              {/* Display name: a container league's stored name carries
                  the user id, and the calendar was printing the uuid. */}
              {practiceLeagueDisplayName(night.league) || "Bowling"}
            </div>
            <div style={{ fontSize: "12px", color: C.textMuted }}>{night.date}{onOpenNight ? " ›" : ""}</div>
          </div>
          {/* A tournament day is not a league night.
              
              "781 series, 260 average, 289 high" describes a Tuesday.
              A tournament day had a cut, and maybe match play and a
              ladder after it, and the finish is the part a bowler came
              back to see. Each phase appears only if it was bowled. */}
          {night.event ? (
            <TournamentNightLines event={night.event} scores={night.scores} />
          ) : (<>
            <div style={{ fontSize: "13px", color: C.text, marginBottom: "4px" }}>
              {night.scores.join(" · ")}
            </div>
            <div style={{ fontSize: "11px", color: C.textMuted }}>
              {night.series} series · {night.average} average · {night.high} high
            </div>
          </>)}
          {/* How the night was bowled, when the frames were logged.
              
              The calendar showed what you scored and nothing about how --
              which is the part worth looking back at. A scores-only night
              has no strike count, so this appears only when there is one
              rather than printing zeros. */}
          {night.strikes != null && night.shotCount ? (
            <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "2px" }}>
              {Math.round((night.strikes / night.shotCount) * 100)}% strikes
              {night.spareAttempts
                ? ` · ${Math.round((night.sparesMade / night.spareAttempts) * 100)}% spares`
                : ""}
              {night.splits ? ` · ${night.splits} split${night.splits === 1 ? "" : "s"}` : ""}
            </div>
          ) : null}
          {/* What you wrote that night.
              
              Notes ride on shots -- the box saves with each delivery --
              so they were written during the night and then had nowhere
              to be read. The calendar is where a bowler goes to remember
              a night, and "moved left 2 after game one" is the part worth
              remembering. The scores are already in the book.
              
              Only rendered when there are any: an empty notes heading on
              every night is noise on the nights you wrote nothing. */}
          {(() => {
            // The night's own note leads, then the shot notes.
            //
            // A session note is about the whole night and a shot note about
            // one delivery, so the summary reads top-down the way the night
            // happened rather than mixing the two.
            const sessionNote = String(night.notes || "").trim();
            const shotNotes = nightNotes(shots, {
              bowler, league: night.league, date: night.date,
            });
            const notes = sessionNote ? [sessionNote, ...shotNotes] : shotNotes;
            if (!notes.length) return null;
            return (
              <div style={{
                marginTop: "6px", paddingTop: "6px",
                borderTop: `1px solid ${C.border}`,
              }}>
                {notes.map((n, i) => (
                  <div key={i} style={{
                    fontSize: "12px", color: C.text,
                    lineHeight: 1.45, marginBottom: "2px",
                  }}>{n}</div>
                ))}
              </div>
            );
          })()}

          {/* Delete, behind a second tap.

              This removes a night's scores AND its frames -- work that
              cannot be got back, on a screen a bowler is browsing rather
              than editing. One tap is too easy next to a date cell.

              The second tap says what will go, with counts, so "are you
              sure" is answerable rather than rhetorical. */}
          {onDeleteNight && (
            armed === `${night.date}|${night.league}` ? (
              <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: `1px solid ${C.border}` }}>
                <div style={{ fontSize: "12px", color: C.miss, marginBottom: "6px", lineHeight: 1.5 }}>
                  Delete this night? {night.games} game{night.games === 1 ? "" : "s"} and every
                  frame logged with them. This cannot be undone.
                </div>
                <div style={S.chips}>
                  <Chip label="Yes, delete it" dense color={C.miss}
                    onToggle={() => { setArmed(null); setOpenDate(null); onDeleteNight(night); }} />
                  <Chip label="Keep it" dense onToggle={() => setArmed(null)} />
                </div>
              </div>
            ) : (
              <button
                onClick={() => setArmed(`${night.date}|${night.league}`)}
                style={{ background: "none", border: "none", padding: "6px 0 0", cursor: "pointer",
                  color: C.textMuted, fontSize: "11px" }}>
                Delete this night
              </button>
            )
          )}
        </div>
      ))}
    </>
  );
}
