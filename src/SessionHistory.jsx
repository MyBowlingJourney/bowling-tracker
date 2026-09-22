import { useState } from "react";
import { C, S } from "./ui.jsx";
import { formatDate, practiceLeagueDisplayName } from "./constants.js";

const PAGE_SIZE = 15;

// Every saved session, newest first. Lives under Settings → History rather
// than on the Stats tab: it's a long reference list that grows without
// bound, and it was pushing the actual analysis off the bottom of a phone
// screen. Looking up "what did I shoot three weeks ago" is a deliberate
// act, not something you want between you and your averages.
export default function SessionHistory({ sessions, bowlers, leagues, teams = [], displayName = "", statsBowler, setStatsBowler, statsLeague, setStatsLeague, onOpenNight }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Your own sessions only. The sessions array also holds nights logged
  // on behalf of teammates, which aren't yours to browse or act on from
  // your own history screen -- hiding the bowler filter without scoping
  // the data would have left theirs mixed into the list.
  // Null rows filtered before anything reads a field off them.
  //
  // A partial sync or an interrupted write leaves a null in this list,
  // and s.bowler threw -- which shows the error boundary instead of a
  // bowler's history. The domain layer was hardened against exactly this
  // shape; the components read the arrays themselves and were not.
  const rows = (Array.isArray(sessions) ? sessions : []).filter(s => s && typeof s === "object");
  const mine = rows.filter(s => !displayName || s.bowler === displayName);
  const filtered = mine
    .filter(s => (!statsLeague || s.league === statsLeague));
  const ordered = [...filtered].reverse();
  const visible = ordered.slice(0, visibleCount);

  // Filters change which sessions match, so a stale expanded count from a
  // previous bowler/league would either hide sessions that should now be
  // visible or keep showing "Load More" past the end of a smaller list.
  function updateFilter(setter, value) {
    setVisibleCount(PAGE_SIZE);
    setter(value);
  }

  // One option per league the bowler has sessions in, labelled with the
  // team's name when a team exists for it. Falls back to the league name
  // so a league without a team is still filterable rather than vanishing.
  // League names are strings; a null in the list reached String(l) fine
  // but a null TEAM did not, and a session with no league threw on
  // s.league.replace below.
  const teamOptions = (Array.isArray(leagues) ? leagues : []).filter(l => l != null).map(l => {
    const team = (teams || []).find(t => t.league === l);
    // The DISPLAY name: a container league's stored name carries the user
    // id, so a filter chip read "Tournament·Tourny 5·c3e40233-...".
    return { league: l, name: team?.name || practiceLeagueDisplayName(l).replace(" House Shot", "") };
  });

  return (
    <div>
      {/* Two separate filters, each with its own heading.
      
          They used to be two chip rows stacked under a single "Filter"
          label, so nothing said they were different dimensions -- a row
          of names above a row of teams reads as one long list of things
          to pick between, not two independent choices. */}
      {teamOptions.length > 1 && (
        <div style={S.card}>
          {/* No bowler filter: this is your own session history. The local
              roster also holds teammates you log for, and their nights
              aren't yours to browse from here. */}
          {/* Team rather than league: a league can hold several teams,
              and the team is the group a session actually belongs to.
              statsLeague still carries the value, since that's the key
              sessions are filed under -- the team just supplies it. */}
          {teamOptions.length > 1 && (
            <>
              {/* A dropdown, not a chip row.
                
                  One chip per team wrapped across several lines for
                  anyone in more than a couple of leagues, pushing the
                  history it filters off the screen -- on the screen whose
                  whole job is showing that history. A picker is one line
                  whatever the roster looks like. */}
              <div style={S.label}>Filter</div>
              <select
                style={{ ...S.sel, width: "100%" }}
                value={statsLeague || ""}
                onChange={e => updateFilter(setStatsLeague, e.target.value)}>
                <option value="">All teams</option>
                {teamOptions.map(t => (
                  <option key={t.league} value={t.league}>{t.name}</option>
                ))}
              </select>
            </>
          )}
        </div>
      )}

      <div style={S.card}>
        <div style={S.label}>Session History</div>
        <div style={{ fontSize: "11px", color: C.textMuted, marginBottom: "10px" }}>
          {filtered.length === 0
            ? "0 sessions"
            : `Showing ${visible.length} of ${filtered.length}, newest first.`}
        </div>
        {filtered.length === 0 ? (
          <div style={{ fontSize: "12px", color: C.textMuted, lineHeight: 1.5 }}>Nothing saved yet. Finish a night with "Save & Finish" on its Results tab and it lands here.</div>
        ) : (
          <>
            {visible.map(s => (
              // A row opens that night's results. A div with a button role
              // rather than a <button>, so the row keeps its own layout and
              // text styles untouched.
              <div key={s.id}
                role={onOpenNight ? "button" : undefined} tabIndex={onOpenNight ? 0 : undefined}
                onClick={onOpenNight ? () => onOpenNight(s) : undefined}
                onKeyDown={onOpenNight ? e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpenNight(s); } } : undefined}
                aria-label={onOpenNight ? `Open results for ${formatDate(s.date)}` : undefined}
                style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: "10px", marginBottom: "10px",
                  cursor: onOpenNight ? "pointer" : "default" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", gap: "10px", alignItems: "baseline" }}>
                  <span style={{ fontSize: "12px", fontWeight: 600, minWidth: 0 }}>
                    {!statsBowler && s.bowler ? `${s.bowler} · ` : ""}{practiceLeagueDisplayName(s.league).replace(" House Shot", "")}
                  </span>
                  <span style={{ fontSize: "11px", color: C.textMuted, whiteSpace: "nowrap", flexShrink: 0 }}>{formatDate(s.date)}{onOpenNight && <span aria-hidden="true" style={{ color: C.accent, marginLeft: "6px" }}>›</span>}</span>
                </div>
                <div style={{ display: "flex", gap: "6px", marginBottom: "4px" }}>
                  {/* A session whose scores never arrived: the row still
                      shows, with no game boxes, rather than blanking the
                      screen. */}
                  {(Array.isArray(s.scores)?s.scores:[]).map((sc, i) => <span key={i} style={{ fontSize: "13px", fontWeight: 600 }}>{sc}</span>)}
                  <span style={{ fontSize: "13px", color: C.textMuted }}>·</span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: C.accent }}>{s.total}</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  <span style={S.tag(C.strike)}>{s.shotCount ? Math.round((s.strikes / s.shotCount) * 100) : 0}% strikes</span>
                  <span style={S.tag(C.miss)}>{s.tenPinLeaves ?? (s.weakTens + s.ringingTens)} ten pins</span>
                  {s.spareAttempts > 0 && <span style={S.tag(C.spare)}>{Math.round((s.sparesMade / s.spareAttempts) * 100)}% spares</span>}
                  {s.splits > 0 && <span style={S.tag(C.miss)}>{s.splits} splits</span>}
                </div>
              </div>
            ))}
            {visible.length < filtered.length && (
              <button style={{ ...S.btn(), width: "100%" }} onClick={() => setVisibleCount(c => c + PAGE_SIZE)}>
                Load {Math.min(PAGE_SIZE, filtered.length - visible.length)} More
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
