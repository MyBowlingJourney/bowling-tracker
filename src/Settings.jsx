import { useState, useEffect, Suspense } from "react";
import { C, S, Chip, CollapsibleCard, LockedNote } from "./ui.jsx";
import { THEMES, DARK_THEME_IDS, LIGHT_THEME_IDS } from "./domain/themes.js";
import { useAuth } from "./AuthProvider.jsx";
import { getPendingCount } from "./syncQueue.js";
import CalendarView from "./CalendarView.jsx";
import ImportCsv from "./ImportCsv.jsx";
import JournalView from "./JournalView.jsx";
// Lazy, exactly as BowlingTracker loads it: Journey is a big screen and
// most visits to History never open it.
import { lazyScreen } from "./lazyScreen.js";
const JourneyScreen = lazyScreen("Journey", () => import("./JourneyView.jsx"));
import { LEAGUE_FORMATS, leagueFormat, isNoTapLeague } from "./domain/leagueSeasons.js";
import { availableTours } from "./domain/tour.js";
import SessionHistory from "./SessionHistory.jsx";
import CenterPicker from "./CenterPicker.jsx";
import OilPatternPicker from "./OilPatternPicker.jsx";
import { isContainerLeague, isLeagueHidden, teamsInLeague } from "./domain/leagueMembership.js";
import { sessionsToCsv, shotsToCsv, seasonSummary, summaryToText } from "./domain/seasonExport.js";
import { inferLeagueDay, dayName, reminderSpec, reminderToIcs } from "./domain/reminders.js";
import { localDateString, APP_URL, APP_NAME } from "./constants.js";
import { leagueLimit, teamLimit, isSubscriber, isTestAccount, hasPaidSubscription, isTrialing, trialDaysLeft } from "./domain/entitlements.js";
import {
  ENVIRONMENT_LABELS,
  ENVIRONMENT_DESCRIPTIONS,
  MONEY_GAMES,
  MONEY_GAME_LABELS,
  isMoneyGameShown,
  setMoneyGameHidden,
  setTheme,
  TRACKED_FIELD_KEYS,
  MOVABLE_STATS_CARDS,
  TRACKING_MODE_LABELS,
  resetToEnvironmentDefaults,
  moveStatsCard,
  toggleStatsCardHidden,
  reconcileCardOrder,
  } from "./domain/preferences.js";

const CARD_LABEL_BY_ID = Object.fromEntries(MOVABLE_STATS_CARDS.map(c => [c.id, c.label]));

export default function Settings({
  onAddLeague,
  drills = [],
  mode = "both",
  restartOnboarding, replayTour, isCoach = false,
  // The bowler's subscription, for the league and team limits.
  entitlement = null,
  // Opens the Subscribe screen. Settings has no navigation of its own --
  // this is the one door out to it, so the upgrade card below can only
  // exist if the caller wires this up.
  onOpenSubscribe,
  // Journey renders here too (History > Journey), and its badges link
  // needs somewhere to go.
  onOpenBadges,
  showBackup, setShowBackup, backupStatus, setBackupStatus,
  importText, setImportText, exportData, importData,
  confirmClear, setConfirmClear, clearAllData, hasData,
  sessions, bowlers, leagues,
  statsBowler, setStatsBowler, statsLeague, setStatsLeague,
  filterBowler, setFilterBowler, filterBall, setFilterBall,
  filterResult, setFilterResult, filtered, ballUniverse,
  startEdit, deleteShot,
  centers, leagueCenters, setLeagueCenter, searchCenters,
  leagueDates, setLeagueDates, renameLeague,
  leagueFormats = {}, setLeagueFormat,
  leaguePatterns = {}, setLeaguePattern, oilPatterns = [],
  updateCenter,
  tournaments = [], deleteNight, onImportCsv,
  hiddenLeagues, leagueIds, toggleLeagueHidden, teams, activeBowler, leaveTeam, onCreateTeam,
  shots, leftHandedForBowler,
}) {
  const { preferences, updatePreferences, displayName, user, signOut, deleteAccount } = useAuth();

  // How many teams this bowler is actually ON, for the free-plan limit.
  //
  // teamsInLeague is the same helper the team list below uses, so "my
  // teams" means one thing in both places -- teams prop carries every
  // team in a league the bowler can see, not just theirs, so a bare
  // teams.length would lock somebody out over other people's teams.
  const myTeamCount = new Set(
    (leagues || []).flatMap(l => teamsInLeague(l, teams || [], displayName).map(t => t.id))
  ).size;
  // Account deletion is irreversible, so it is armed in three steps:
  // open the Danger Zone, press the button, then type your own email
  // address. Nothing here is a single tap.
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteAccountError, setDeleteAccountError] = useState("");
  const [savedFlash, setSavedFlash] = useState(false);
  const [error, setError] = useState(null);
  // Settings has two distinct jobs now: configuring the app, and browsing
  // history. History is long reference data, so it lives behind its own
  // section rather than padding out the settings scroll.
  // mode: "both" is the original screen with a Settings/History switch;
  // "history" and "settings" render just one half, for the History tab
  // and the settings icon respectively. Reusing this component for both
  // destinations means the History tab is the exact code that already
  // worked, not a copy.
  const [section, setSection] = useState(mode === "history" ? "history" : "settings");

  // Which settings cards this instance shows. "leagues" is rendered by the
  // Vault tab -- where you bowl belongs with your equipment, not buried in
  // app settings -- and the settings icon renders everything else. One
  // component, so there is still exactly one Leagues editor.
  // Just Bowling gets a much shorter Settings.
  //
  // Accessory fields, money games and the stats card layout all
  // configure features that mode doesn't have, and Reset offers to
  // restore defaults for settings it never shows. Four cards of dead
  // options make a simple mode feel complicated.
  const casualMode = preferences.environment === "casual";
  const cardsFor = {
    leagues: ["leagues"],
    settings: casualMode
      // Walkthroughs stay: a casual bowler is the most likely to want to
      // rewatch one, and it used to ride on the "reset" id -- so cutting
      // Reset silently cut the tours too.
      //
      // "about" is in BOTH lists deliberately. Google requires the privacy
      // policy to be reachable from inside the app, and an account
      // deletion route to be findable -- neither of which stops mattering
      // because someone bowls casually.
      ? ["session", "look", "walkthroughs", "backup", "account", "about", "dangerZone"]
      : ["session", "look", "trackingDetail", "moneyGames", "statsLayout", "backup", "walkthroughs", "reset", "account", "about", "dangerZone"],
  };
  const allowed = mode === "leagues" ? cardsFor.leagues : (mode === "settings" ? cardsFor.settings : null);
  const showCard = id => !allowed || allowed.includes(id);
  const [historyTab, setHistoryTab] = useState("sessions");
  // Reset wipes theme and card order as well as toggles, so it confirms
  // rather than firing on a single tap.
  const [resetArmed, setResetArmed] = useState(false);
  // Keyed by league so two leagues' in-progress team names can't collide.
  const [teamDrafts, setTeamDrafts] = useState({});
  const [shareStatus, setShareStatus] = useState("");

  // Every settings card is collapsible, keyed by section id. Environment
  // defaults open since it's the one setting almost everyone touches first;
  // the rest default closed so the screen reads as a scannable list of
  // headings, each with a summary, rather than every toggle laid bare at
  // once. Danger Zone and Backup default closed too, on top of their own
  // internal confirmation steps -- collapsing them is an extra deliberate
  // step before reaching something destructive or data-heavy.
  const [newLeagueName, setNewLeagueName] = useState("");

  const [expanded, setExpanded] = useState({
    session: true, look: false, trackingDetail: false,
    moneyGames: false, statsLayout: false,
    backup: false, reset: false, account: false, about: false, dangerZone: false,
    // Open by default. The other cards are settings you go
    // looking for; this is the one a lost bowler needs to SEE.
    walkthroughs: true,
  });
  // Walkthroughs is the one card that opens by default, so it is the one
  // card whose CLOSED state has to be remembered. Every other card starts
  // collapsed, and re-collapsing on return is what someone expects.
  //
  // Without this, closing it was undone by every visit to Settings --
  // the app quietly overriding a choice the bowler had just made, which
  // is a small thing that reads as the app not listening.
  //
  // Per user, like every other key, so one person collapsing it does not
  // decide it for someone else signing in on the same phone.
  const WALKTHROUGHS_KEY = "bowling-walkthroughs-collapsed-v1";

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const row = await window.storage?.get(WALKTHROUGHS_KEY);
        // Only a stored collapse changes anything: absent means open,
        // which is the default this card ships with.
        if (!cancelled && row) setExpanded(e => ({ ...e, walkthroughs: false }));
      } catch { /* storage unavailable -- leave it open */ }
    })();
    return () => { cancelled = true; };
  }, []);

  function toggle(id) {
    setExpanded(e => {
      const next = { ...e, [id]: !e[id] };
      if (id === "walkthroughs") {
        // Store the collapse, remove it on re-open, so the key exists
        // only while the preference differs from the default.
        try {
          if (next.walkthroughs) window.storage?.delete(WALKTHROUGHS_KEY);
          else window.storage?.set(WALKTHROUGHS_KEY, new Date().toISOString());
        } catch { /* nothing to do */ }
      }
      return next;
    });
  }

  const [editingLeague, setEditingLeague] = useState(null);
  const [leagueDraft, setLeagueDraft] = useState("");

  async function commitRename(oldName) {
    const next = leagueDraft.trim();
    setEditingLeague(null);
    if (!next || next === oldName) return;
    if ((leagues || []).some(l => l !== oldName && l.toLowerCase() === next.toLowerCase())) {
      setError("A league with that name already exists.");
      return;
    }
    await renameLeague(oldName, next);
  }

  async function apply(next) {
    setError(null);
    const result = await updatePreferences(next);
    if (result.error) { setError(result.error.message); return; }
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1200);
  }

  const cardOrder = reconcileCardOrder(preferences.statsCardOrder);
  const hidden = new Set(preferences.hiddenStatsCards || []);

  return (
    <div>
      {/* Placed at the very top, not the bottom, of what can be a long
          scrolling page. A confirmation or error tied to a control near
          the top of a 30-card Settings screen was previously rendered
          below everything else -- easy to tap something, see nothing
          happen, and conclude the app is broken when the message was
          simply off-screen. */}
      {savedFlash && <div style={{ fontSize: "13px", color: C.strike, textAlign: "center", marginBottom: "10px" }}>✓ Saved</div>}
      {error && <div style={{ fontSize: "13px", color: C.miss, textAlign: "center", marginBottom: "10px" }}>{error}</div>}

      {mode === "both" && (
        <div style={{ ...S.card, padding: "10px 12px" }}>
          <div style={S.chips}>
            <Chip label="Settings" selected={section === "settings"} onToggle={() => setSection("settings")} />
            <Chip label="History" selected={section === "history"} onToggle={() => setSection("history")} />
          </div>
        </div>
      )}

      {/* The one door to Subscribe. Not gated on the free/paid split alone
          -- a trialing or already-paying bowler still gets the card, just
          worded differently, so "manage my subscription" always has
          somewhere to go rather than only appearing before they pay. */}
      {section === "settings" && onOpenSubscribe && (
        <div style={{ ...S.card, padding: "12px" }}>
          {isSubscriber(entitlement) ? (
            <>
              <div style={{ fontWeight: 600, marginBottom: "4px" }}>My Bowling Journey Pro</div>
              <div style={{ fontSize: "13px", color: C.textMuted, marginBottom: "8px" }}>
                {subscriptionLine(entitlement)}
              </div>
            </>
          ) : (
            <>
              <div style={{ fontWeight: 600, marginBottom: "4px" }}>Unlock My Bowling Journey Pro</div>
              <div style={{ fontSize: "13px", color: C.textMuted, marginBottom: "8px" }}>
                Unlimited leagues, full stats, and more.
              </div>
            </>
          )}
          {/* A test account is unlocked but has no subscription, so
              "Manage subscription" would open a screen with nothing to
              manage. It gets the buy entry point instead -- which is
              also how billing gets tested from that account. */}
          <button style={S.btn("primary")} onClick={onOpenSubscribe}>
            {hasPaidSubscription(entitlement) ? "Manage subscription" : "See Pro"}
          </button>
        </div>
      )}

      {section === "history" && (
        <>
          <div style={{ ...S.card, padding: "10px 12px" }}>
            {/* fill, not a guess at whether five labels fit.
              
                They wrapped onto a second line on a phone, which read as
                two groups of tabs rather than one set of five. Chip's
                fill prop shares the width equally -- flex:1 with
                min-width:0 cannot overflow whatever the labels say --
                so this is one row on every handset without a sideways
                scroll. Its own comment notes that estimating the fit has
                already been wrong twice; this stops estimating. */}
            <div style={{ ...S.chips, flexWrap: "nowrap", marginBottom: 0 }}>
              <Chip label="Sessions" dense fill selected={historyTab === "sessions"} onToggle={() => setHistoryTab("sessions")} />
              <Chip label="Season" dense fill selected={historyTab === "season"} onToggle={() => setHistoryTab("season")} />
              <Chip label="Calendar" dense fill selected={historyTab === "calendar"} onToggle={() => setHistoryTab("calendar")} />
              {/* The journal sits beside the calendar because they
                  answer the same question from opposite ends: the
                  calendar is when you bowled, the journal is what you
                  said about it. */}
              {/* Journey lives here too, not only on its own tab.
                  League mode holds a bowler on the Log screen until the
                  night ends, which puts Journey out of reach for the
                  length of a session. History is already where they go
                  to look back. */}
              <Chip label="Journey" dense fill selected={historyTab === "journey"}
                onToggle={() => setHistoryTab("journey")} />
              <Chip label="Journal" dense fill selected={historyTab === "journal"}
                onToggle={() => setHistoryTab("journal")} />

            </div>
          </div>
          {/* A month grid rather than another list.

              Sessions answers "what did I shoot"; this answers "when do
              I bowl, and what does a month look like". The gaps carry as
              much as the entries -- three weeks missed is obvious here
              and invisible in a list. */}
          {/* NOT filtered by the Stats league picker.

              It was, so selecting a league left every night the same mode
              -- one colour, nothing to code -- and hid practice,
              tournaments and open bowling from the month entirely.

              The calendar answers "what did I bowl this month", across all
              of it. The colours ARE the filter. */}
          {historyTab === "calendar" && (
            <CalendarView
              sessions={sessions || []}
              tournaments={tournaments || []}
              onDeleteNight={deleteNight ? n => deleteNight(statsBowler || activeBowler, n.league, n.date) : undefined}
              bowler={statsBowler || activeBowler}
              league="" />
          )}
          {historyTab === "journey" && (
            <Suspense fallback={null}>
              <JourneyScreen
                sessions={sessions || []}
                shots={shots || []}
                tournaments={tournaments || []}
                bowler={displayName || activeBowler}
                onOpenBadges={onOpenBadges} />
            </Suspense>
          )}
          {historyTab === "journal" && (
            <JournalView
              sessions={sessions || []}
              shots={shots || []}
              drills={drills || []}
              bowler={statsBowler || activeBowler} />
          )}
          {historyTab === "sessions" && (
            <SessionHistory
              sessions={sessions || []} bowlers={bowlers || []} leagues={leagues || []} teams={teams || []} displayName={displayName}
              statsBowler={statsBowler} setStatsBowler={setStatsBowler}
              statsLeague={statsLeague} setStatsLeague={setStatsLeague} />
          )}
          {historyTab === "season" && (() => {
            const bowler = statsBowler || activeBowler;
            const sum = seasonSummary(sessions || [], shots || [], bowler, statsLeague);
            function download(name, text) {
              const blob = new Blob([text], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url; a.download = name; a.click();
              setTimeout(() => URL.revokeObjectURL(url), 1000);
            }
            async function share() {
              const text = summaryToText(sum);
              try {
                if (navigator.share) { await navigator.share({ text }); setShareStatus("Shared"); }
                else { await navigator.clipboard.writeText(text); setShareStatus("Copied to clipboard"); }
              } catch { setShareStatus(""); }
              setTimeout(() => setShareStatus(""), 2000);
            }
            return (
              <>
                {sum ? (
                  <div style={{ ...S.card, border: `1px solid ${C.accent}44` }}>
                    <div style={{ ...S.label, color: C.accent }}>
                      {sum.bowler}{sum.league ? ` · ${sum.league.replace(" House Shot", "")}` : ""}
                    </div>
                    <div style={{ fontSize: "11px", color: C.textMuted, marginBottom: "10px" }}>
                      {sum.firstDate} to {sum.lastDate} · {sum.sessions} night{sum.sessions === 1 ? "" : "s"}, {sum.games} game{sum.games === 1 ? "" : "s"}
                    </div>
                    <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
                      <div style={{ ...S.statBox, border: `1px solid ${C.accent}44` }}>
                        <div style={{ ...S.statNum, color: C.accent }}>{sum.average}</div>
                        <div style={S.statLbl}>Average</div>
                      </div>
                      <div style={S.statBox}>
                        <div style={S.statNum}>{sum.highGame}</div>
                        <div style={S.statLbl}>High Game</div>
                      </div>
                      {sum.highSeries && (
                        <div style={S.statBox}>
                          <div style={S.statNum}>{sum.highSeries}</div>
                          <div style={S.statLbl}>High Series</div>
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
                      <div style={S.statBox}>
                        <div style={{ ...S.statNum, fontSize: "18px", color: C.strike }}>{sum.gamesOver200}</div>
                        <div style={S.statLbl}>200+ Games</div>
                      </div>
                      {sum.strikeRate !== null && (
                        <div style={S.statBox}>
                          <div style={{ ...S.statNum, fontSize: "18px", color: C.strike }}>{sum.strikeRate}%</div>
                          <div style={S.statLbl}>Strikes</div>
                        </div>
                      )}
                      {(sum.won || sum.paid) ? (
                        <div style={S.statBox}>
                          <div style={{ ...S.statNum, fontSize: "18px", color: sum.net >= 0 ? C.strike : C.miss }}>
                            {sum.net < 0 ? "−" : "+"}${Math.abs(sum.net).toFixed(0)}
                          </div>
                          <div style={S.statLbl}>Net</div>
                        </div>
                      ) : null}
                    </div>
                    <button style={S.btn("primary")} onClick={share}>
                      {shareStatus || "Share Summary"}
                    </button>
                  </div>
                ) : (
                  <div style={S.card}>
                    <div style={{ fontSize: "12px", color: C.textMuted }}>No sessions yet for this bowler and league.</div>
                  </div>
                )}

              </>
            );
          })()}
        </>
      )}

      {(section === "settings" || mode === "leagues") && (<>
      {/* First, because it's the one setting a person changes and then
          looks at everything else through. Swatches rather than names
          alone: nobody can picture "Urethane" from the word. */}
      {/* Bowling mode and tracking style, duplicated here on purpose.
      
          Both live on the Bowl tab, in the "Bowling today?" card -- which
          is the right place to CHANGE them on a given night. But that
          card collapses to a one-line summary once answered, and a
          bowler who can't find their stats, or who picked Just Bowling
          by accident and watched four tabs vanish, looks in Settings.
          
          Two places to find the same switch beats one place nobody
          thinks of. */}
      {/* "What you're bowling" removed.
          
          Mode and tracking style moved to Home, leaving a card whose
          only job was to announce which mode you were in. */}

      {showCard("look") && (
      <CollapsibleCard title="App appearance" summary={THEMES[preferences.theme]?.label || THEMES.lane.label}
        expanded={expanded.look} onToggle={() => toggle("look")}>
        <div style={{ fontSize: "11px", color: C.textMuted, marginBottom: "10px" }}>
          Each one takes its colour from a different part of the house. Dark ones for a dim centre, light ones for a bright room or daytime.
        </div>
        {[["Dark", DARK_THEME_IDS], ["Light", LIGHT_THEME_IDS]].map(([group, ids]) => (
          <div key={group} style={{ marginBottom: "10px" }}>
            <div style={{ fontSize: "12px", color: C.textMuted, marginBottom: "6px" }}>{group}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {ids.map(id => {
                const t = THEMES[id];
                const on = (preferences.theme || "lane") === id;
                return (
                  <button key={id} onClick={() => apply(setTheme(preferences, id))}
                    style={{
                      textAlign: "left", cursor: "pointer", padding: "10px", borderRadius: "10px",
                      backgroundColor: t.colors.card, color: t.colors.text,
                      border: `2px solid ${on ? t.colors.accent : t.colors.border}`,
                    }}>
                    <div style={{ display: "flex", gap: "4px", marginBottom: "8px" }}>
                      {[t.colors.accent, t.colors.strike, t.colors.spare, t.colors.miss].map((c, i) => (
                        <span key={i} style={{ width: "14px", height: "14px", borderRadius: "7px", backgroundColor: c, display: "inline-block" }} />
                      ))}
                    </div>
                    <div style={{ fontSize: "13px", fontWeight: 600 }}>{t.label}{on ? " ✓" : ""}</div>
                    <div style={{ fontSize: "10px", color: t.colors.textMuted, marginTop: "2px", lineHeight: 1.4 }}>{t.hint}</div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </CollapsibleCard>
      )}

      {/* Environment and Tracking Detail are NOT here any more. They live
          on the Bowl tab's "Bowling today?" card, which stays on screen
          collapsed after you answer it -- so there's one place to set
          them, and it's the screen where they matter. Two places to change
          what mode you're bowling in was how you'd end up with Settings
          saying one thing and the Log tab behaving like another. */}

      {/* Centers attach to LEAGUES, not sessions -- a league bowls at one
          house for a season, so this is one entry per season instead of a
          tap every night. */}
      {/* Rendered even with NO leagues. It used to be hidden until one
          existed, so a bowler with none saw no Leagues card and no way
          to make one -- and nothing anywhere else created a league
          either. addLeague() had existed in BowlingTracker with no
          caller. */}
        {/* The count must match the list below it, which already filters
            container leagues. Counting them made the card read "1 league"
            for a bowler who had created none -- the tournament's own
            container, which is not a league they joined. */}
      {showCard("leagues") && (
        <CollapsibleCard title="Leagues"
          summary={(() => {
            const n = (leagues || []).filter(l => !isContainerLeague(l)).length;
            return `${n} league${n === 1 ? "" : "s"}`;
          })()}
          expanded={expanded.whereYouBowl} onToggle={() => toggle("whereYouBowl")}>
          <div style={{ fontSize: "12px", color: C.textMuted, marginBottom: "10px" }}>
            {(leagues || []).filter(l => !isContainerLeague(l)).length
              ? "Add a league, rename one, set its center and season dates, or hide one you're not bowling any more."
              : "Add the league you bowl in and you can start putting scores in straight away. A team isn't needed yet."}
          </div>

          {/* One league on the free plan.
              
              Counting only REAL leagues: Practice, Just Bowling and the
              tournament containers are storage, not leagues anybody
              joined, and counting them would stop a free bowler
              practising. */}
          {onAddLeague && (leagues || []).filter(n => !isContainerLeague(n)).length >= leagueLimit(entitlement) && (
            <LockedNote title="More leagues">
              The free plan covers one league. Bowling a second one — a summer league,
              or Tuesday and Thursday — is part of the paid plan. Nothing you have
              already logged goes anywhere.
            </LockedNote>
          )}
          {onAddLeague && (leagues || []).filter(n => !isContainerLeague(n)).length < leagueLimit(entitlement) && (
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              {/* minWidth 0 on the input and width auto on the button.

                  S.btn("primary") carries width:100%, so in a flex row it
                  claimed the whole line and squeezed the input down to a
                  sliver -- a text field too narrow to read what you had
                  typed, beside a button the width of the screen. */}
              <input style={{ ...S.input, flex: 1, minWidth: 0, marginBottom: 0 }}
                value={newLeagueName}
                onChange={e => setNewLeagueName(e.target.value)}
                onKeyDown={async e => {
                  if (e.key !== "Enter") return;
                  const name = newLeagueName.trim();
                  if (!name) return;
                  await onAddLeague(name);
                  setNewLeagueName("");
                }}
                placeholder="League name, e.g. Tuesday Night Mixed" />
              <button style={{ ...S.btn("primary"), width: "auto", flexShrink: 0, padding: "9px 16px", fontSize: "13px" }}
                disabled={!newLeagueName.trim()}
                onClick={async () => {
                  const name = newLeagueName.trim();
                  if (!name) return;
                  // Dates are set afterwards from the row below, so this
                  // asks for one thing: the name. Season dates at this
                  // moment are the "admin before first value" problem the
                  // whole change exists to remove.
                  await onAddLeague(name);
                  setNewLeagueName("");
                }}>
                Add
              </button>
            </div>
          )}
          {/* Practice and Just Bowling are filtered out.
          
              They're containers that exist so scores have somewhere to
              hang -- nobody joins them, they have no team, and they
              can't be renamed or deleted. Offering to add a team to
              "Practice" is offering something that can't work. */}
          {(leagues || []).filter(l => !isContainerLeague(l)).map((league, i) => {
            const centerId = leagueCenters?.[league];
            const center = (centers || []).find(c => c.id === centerId) || null;
            return (
              <div key={league} style={{ paddingBottom: "10px", marginBottom: "10px", borderBottom: i < leagues.length - 1 ? `1px solid ${C.border}` : "none" }}>
                {/* Rename. renameLeague already existed and rewrites every
                    shot, session and record to the new name -- it just was
                    never exposed, so a league typed wrong at creation was
                    permanent. */}
                {editingLeague === league ? (
                  <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
                    <input style={{ ...S.input, flex: 1, fontSize: "13px" }} autoFocus
                      value={leagueDraft} onChange={e => setLeagueDraft(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") commitRename(league); }} />
                    <button style={{ ...S.btn(), padding: "8px 12px", fontSize: "12px" }}
                      disabled={!leagueDraft.trim()} onClick={() => commitRename(league)}>Save</button>
                    <button style={{ ...S.btn(), padding: "8px 12px", fontSize: "12px" }}
                      onClick={() => setEditingLeague(null)}>Cancel</button>
                  </div>
                ) : (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px", gap: "8px" }}>
                    {/* The league is the heading of its own section. At
                        13px semibold it was the same size as the centre
                        name and the season labels beneath it, so scanning
                        a list of four leagues gave nothing to anchor on. */}
                    <div style={{ fontSize: "17px", fontWeight: 700, color: C.text, letterSpacing: "-0.01em" }}>
                      {league.replace(" House Shot", "")}
                    </div>
                    {renameLeague && (
                      <button style={{ background: "none", border: "none", color: C.accent, cursor: "pointer", fontSize: "12px", padding: 0 }}
                        onClick={() => { setEditingLeague(league); setLeagueDraft(league); }}>Rename</button>
                    )}
                  </div>
                )}
                <CenterPicker
                  leagueName={league.replace(" House Shot", "")}
                  currentCenter={center}
                  onSelect={candidate => setLeagueCenter(league, candidate)}
                  onSetRackType={(c, rackType) => updateCenter(c.id, { rackType })}
                  onSearch={searchCenters} />

                {/* Season dates, editable here in case they were skipped
                    or typed wrong at creation -- this is what the
                    book-average update prompt keys off of. */}
                <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "8px", marginBottom: "4px" }}>
                  {league === "Practice" || league === "Casual" ? "Date range (optional)" : "Season dates"}
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input type="date" style={{ ...S.input, flex: 1, fontSize: "12px" }}
                    value={leagueDates?.[league]?.startDate || ""}
                    onChange={e => setLeagueDates(league, e.target.value, leagueDates?.[league]?.endDate || "")} />
                  <input type="date" style={{ ...S.input, flex: 1, fontSize: "12px" }}
                    value={leagueDates?.[league]?.endDate || ""}
                    onChange={e => setLeagueDates(league, leagueDates?.[league]?.startDate || "", e.target.value)} />
                </div>

                {/* Scoring format.

                    Not a display preference -- 9-pin no-tap changes what
                    a frame SCORES, so it has to be set per league and
                    known wherever a game is scored.

                    10 pin is the default and stays selected unless the
                    bowler says otherwise: a league that predates this
                    setting was a 10-pin league, and quietly rescoring
                    someone's season would be worse than not offering the
                    option at all. */}
                {league !== "Practice" && league !== "Casual" && (
                  <>
                    <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "8px", marginBottom: "4px" }}>
                      Scoring
                    </div>
                    <div style={S.chips}>
                      {LEAGUE_FORMATS.map(f => (
                        <Chip key={f.id} label={f.label} dense
                          selected={leagueFormat(leagueFormats?.[league]) === f.id}
                          onToggle={() => setLeagueFormat(league, f.id)} />
                      ))}
                    </div>
                    {isNoTapLeague(leagueFormats?.[league]) && (
                      <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "4px", lineHeight: 1.5 }}>
                        Nine on the first ball counts as a strike. Those are kept separate from your
                        regular strike percentage, but still count toward how your ball carries.
                      </div>
                    )}

                    {/* The pattern this league is normally bowled on.
                      
                        A DEFAULT, not a fact about the league: whatever
                        you record for a specific night on the Log screen
                        still wins. Sport and PBA Experience leagues
                        rotate weekly, so a fixed league property would be
                        wrong for them -- but a house league runs the same
                        shot every week, and re-entering it every night is
                        friction for no reason.
                      
                        It also fills a real gap. The per-night records
                        only reach the cloud when you are on a TEAM in the
                        league; set here, the pattern rides along with the
                        league itself, so pattern stats work whether or
                        not you bowl on a team. */}
                    {setLeaguePattern && (
                      <>
                        <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "10px", marginBottom: "4px" }}>
                          Usual oil pattern
                        </div>
                        {/* Type-ahead over the pattern catalogue rather
                            than a free-text box -- but free text still
                            saves, because house shots have local names
                            and a brand new PBA pattern is not in the
                            catalogue the week it appears. */}
                        <OilPatternPicker
                          value={leaguePatterns?.[league] || ""}
                          patterns={oilPatterns}
                          placeholder="e.g. House Shot, Kegel Main Street"
                          onChange={name => setLeaguePattern(league, name)} />
                        <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "4px", lineHeight: 1.5 }}>
                          Used for any night you don't record a pattern for. Leave blank if this
                          league rotates.
                        </div>
                      </>
                    )}
                  </>
                )}

                {/* Hiding is personal and reversible: the league leaves
                    YOUR pickers, but teammates, rosters, and every past
                    score are untouched. */}
                <div style={{ ...S.chips, marginTop: "8px" }}>
                  <Chip
                    label={isLeagueHidden(league, hiddenLeagues || [], leagueIds || {}) ? "Hidden — show again" : "Hide this league"}
                    dense
                    selected={isLeagueHidden(league, hiddenLeagues || [], leagueIds || {})}
                    onToggle={() => toggleLeagueHidden(league)} />
                </div>
                {isLeagueHidden(league, hiddenLeagues || [], leagueIds || {}) && (
                  <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "4px" }}>
                    Won't appear when logging. Past scores still count toward your averages.
                  </div>
                )}

                {/* Reminder: a recurring calendar event with an alarm. The
                    league's night is inferred from logged sessions. Push
                    notifications need the native app wrapper, so this is
                    the delivery a web app can offer today -- and it keeps
                    working even if the app is closed. */}
                {(() => {
                  const day = inferLeagueDay(sessions || [], league);
                  if (day === null) return null;
                  const centerId = leagueCenters?.[league];
                  const center = (centers || []).find(c => c.id === centerId);
                  function addToCalendar() {
                    const ics = reminderToIcs(reminderSpec(league, day, 60, "19:00"), center?.name);
                    const blob = new Blob([ics], { type: "text/calendar" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url; a.download = `${league.replace(/\W+/g, "-").toLowerCase()}-reminder.ics`; a.click();
                    setTimeout(() => URL.revokeObjectURL(url), 1000);
                  }
                  return (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                      <span style={{ fontSize: "11px", color: C.textMuted }}>
                        {/* A real league has a fixed night; practice and
                            casual don't, so "Bowls on Tuesdays" would be
                            claiming a schedule that doesn't exist. */}
                        {league === "Practice" || league === "Casual"
                          ? `Usually ${dayName(day)}s`
                          : `Bowls on ${dayName(day)}s`}
                      </span>
                      <button style={{ ...S.btn(), padding: "3px 8px", fontSize: "10px" }} onClick={addToCalendar}>
                        Add weekly reminder
                      </button>
                    </div>
                  );
                })()}

                {/* Every team in this league, not just the ones you're on.
                    Adding a team used to mean scrolling to a separate Teams
                    card that had its own duplicate "Add League" form -- so
                    you'd add a league here, then add it again down there
                    before a team could attach to it.
                    
                    Deliberately shows team NAMES only, no rosters: this is
                    the league's shape at a glance. Managing who's on a
                    team stays in the Teams card below, where the roster
                    editing already lives. */}
                {(() => {
                  const all = (teams || []).filter(t => t.league === league);
                  const mine = new Set(teamsInLeague(league, teams || [], displayName).map(t => t.id));
                  if (!all.length) return null;
                  return (
                    <div style={{ marginTop: "8px" }}>
                      <div style={{ fontSize: "11px", color: C.textMuted, marginBottom: "4px" }}>
                        {all.length} team{all.length === 1 ? "" : "s"} in this league
                      </div>
                      {all.map(team => (
                        <div key={team.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                          <span style={{ fontSize: "12px", color: mine.has(team.id) ? C.text : C.textMuted }}>
                            <span style={{ fontSize: "14px", fontWeight: 600, color: C.text }}>{team.name}</span>
                            {mine.has(team.id) ? <span style={{ color: C.textMuted, fontWeight: 400 }}> · yours</span> : ""}
                          </span>
                          {/* Leaving is scoped to the SIGNED-IN user, not the
                              active bowler -- the active bowler may be a
                              proxy-logged teammate whose membership isn't
                              yours to change. */}
                          {mine.has(team.id) && (
                            <button style={{ ...S.btn(), padding: "3px 8px", fontSize: "10px" }}
                              onClick={() => leaveTeam(team, league)}>
                              Leave team
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {/* Set apart from the league's own settings above.

                    Center, season dates, Hide and Rename all configure the
                    LEAGUE. Adding a team is a different thing entirely,
                    and sitting flush underneath them it read as one more
                    league field -- an unlabelled box with an Add button,
                    indistinguishable from the row above it. A rule, a
                    tinted panel and a heading say where the league stops
                    and the team starts. */}
                {/* One team on the free plan, counted with the same
                    helper the list above uses so "my teams" means the
                    same thing in both places. */}
                {onCreateTeam && league !== "Practice" && league !== "Casual"
                  && myTeamCount >= teamLimit(entitlement) && (
                  <div style={{ marginTop: "12px" }}>
                    <LockedNote title="More teams">
                      The free plan covers one team. Your scores keep counting for the
                      team you are already on.
                    </LockedNote>
                  </div>
                )}
                {onCreateTeam && league !== "Practice" && league !== "Casual"
                  && myTeamCount < teamLimit(entitlement) && (
                  <div style={{
                    marginTop: "12px", paddingTop: "12px",
                    borderTop: `1px solid ${C.border}`,
                  }}>
                    <div style={{
                      backgroundColor: C.surface, borderRadius: "10px",
                      padding: "10px 12px",
                    }}>
                      <div style={{ ...S.label, marginBottom: "2px" }}>Add a team</div>
                      <div style={{ fontSize: "11px", color: C.textMuted, marginBottom: "8px", lineHeight: 1.45 }}>
                        Your scores in this league will join it — including nights you have already logged.
                      </div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <input style={{ ...S.input, flex: 1, minWidth: 0, marginBottom: 0, fontSize: "12px", padding: "8px 10px" }}
                      placeholder="Add a team to this league"
                      value={teamDrafts[league] || ""}
                      onChange={e => setTeamDrafts(d => ({ ...d, [league]: e.target.value }))}
                      onKeyDown={e => { if (e.key === "Enter") { onCreateTeam(league, (teamDrafts[league] || "").trim()); setTeamDrafts(d => ({ ...d, [league]: "" })); } }} />
                    <button style={{ ...S.btn("primary"), width: "auto", flexShrink: 0, padding: "8px 14px", fontSize: "12px" }}
                      disabled={!(teamDrafts[league] || "").trim()}
                      onClick={() => { onCreateTeam(league, (teamDrafts[league] || "").trim()); setTeamDrafts(d => ({ ...d, [league]: "" })); }}>
                      Add
                    </button>
                  </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </CollapsibleCard>
      )}

      {/* Not offered in casual: "Just Bowling" exists to be scores-only,
          so a tracking choice there is a control that does nothing. */}

      {/* The accessory fields card is gone: those nine fields are always
          on now. They were chips a bowler had to find and switch on
          before the fields appeared at all, and the log screen scrolls to
          the next field, so having them present costs little. */}

      {showCard("moneyGames") && (
      <CollapsibleCard title="Money Games" summary={preferences.showMoneyGames ? "Shown" : "Hidden"}
        expanded={expanded.moneyGames} onToggle={() => toggle("moneyGames")}>
        <div style={{ fontSize: "12px", color: C.textMuted, marginBottom: "10px" }}>
          Poker, 3-6-9, and High Game Pot tracking cards on the Log and Data tabs.
        </div>

        {/* Which pots this house actually runs. Hiding one here means it
            doesn't exist for this bowler at all -- different from not
            entering it on a given night, which is a per-session toggle on
            the Bowl tab.
            
            A house that runs a quarter game and nothing else was still
            shown four rows every week, three of them noise. */}
        {/* The per-pot switches ARE the control now. A master
            shown/hidden toggle above them was redundant -- hiding all
            four is the same thing, and having both meant a pot could be
            "shown" while the whole card was hidden. */}
        {true && (
          <>
            <div style={{ ...S.label, marginTop: "4px" }}>Which pots does your house run?</div>
            {MONEY_GAMES.map(g => {
              const shown = isMoneyGameShown(preferences, g);
              return (
                <div key={g} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0" }}>
                  <span style={{ fontSize: "13px", color: shown ? C.text : C.textMuted }}>
                    {MONEY_GAME_LABELS[g]}
                  </span>
                  <Chip label={shown ? "Shown" : "Hidden"} dense selected={shown}
                    onToggle={() => apply(prev => setMoneyGameHidden(prev, g, shown))}
                    color={shown ? C.strike : C.miss} />
                </div>
              );
            })}
          </>
        )}
      </CollapsibleCard>
      )}

      {showCard("statsLayout") && (
      <CollapsibleCard title="Stats Card Layout" summary={`${cardOrder.length - hidden.size} of ${cardOrder.length} visible`}
        expanded={expanded.statsLayout} onToggle={() => toggle("statsLayout")}>
        <div style={{ fontSize: "12px", color: C.textMuted, marginBottom: "10px" }}>
          Reorder or hide whole cards on the Data tab. Each card moves as one unit — the stats grouped inside it stay together.
        </div>
        {cardOrder.map((id, idx) => {
          const isHidden = hidden.has(id);
          return (
            <div key={id} style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
              <div style={{ flex: 1, fontSize: "13px", color: isHidden ? C.textMuted : C.text, textDecoration: isHidden ? "line-through" : "none" }}>
                {CARD_LABEL_BY_ID[id] || id}
              </div>
              <button style={{ ...S.btn(), padding: "4px 10px", fontSize: "13px", opacity: idx === 0 ? 0.3 : 1 }}
                disabled={idx === 0}
                onClick={() => apply(prev => moveStatsCard(prev, id, "up"))} aria-label="Move up">↑</button>
              <button style={{ ...S.btn(), padding: "4px 10px", fontSize: "13px", opacity: idx === cardOrder.length - 1 ? 0.3 : 1 }}
                disabled={idx === cardOrder.length - 1}
                onClick={() => apply(prev => moveStatsCard(prev, id, "down"))} aria-label="Move down">↓</button>
              <button style={{ ...S.btn(), padding: "4px 10px", fontSize: "11px", minWidth: "54px" }}
                onClick={() => apply(prev => toggleStatsCardHidden(prev, id))}>
                {isHidden ? "Show" : "Hide"}
              </button>
            </div>
          );
        })}
      </CollapsibleCard>
      )}

      {/* Export lives in Settings, not under History › Season.
          
          It is a data tool, not a way of looking back at a season -- and
          it sat at the foot of a tab a bowler opens to read their nights,
          where nobody thinks to look for a CSV.
          
          Written fresh rather than relocated: the History copy leaned on
          a `download` helper and a `bowler` name declared inside that
          tab's own scope, and carrying the markup across without them was
          the slow way to a broken file. */}
      {showCard("backup") && (() => {
        const who = statsBowler || activeBowler;
        const saveCsv = (name, text) => {
          const blob = new Blob([text], { type: "text/csv" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url; a.download = name; a.click();
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        };
        return (
          <CollapsibleCard title="Export"
            summary=""
            // Collapsed by default: exporting a CSV is a rare, deliberate
            // act, and an open card put two buttons nobody presses above
            // the settings people actually change.
            expanded={expanded.exportCsv === true}
            onToggle={() => toggle("exportCsv")}>
            <div style={{ fontSize: "11px", color: C.textMuted, marginBottom: "8px" }}>
              Your data, as spreadsheets. Sessions is one row per night; shots is one row per delivery.
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button style={{ ...S.btn(), flex: 1 }}
                onClick={() => saveCsv(`sessions-${who || "all"}.csv`, sessionsToCsv(sessions || [], who))}>
                Sessions CSV
              </button>
              <button style={{ ...S.btn(), flex: 1 }}
                onClick={() => saveCsv(`shots-${who || "all"}.csv`, shotsToCsv(shots || [], who))}>
                Shots CSV
              </button>
            </div>
          </CollapsibleCard>
        );
      })()}

      {/* Import sits with Export: they are the same job in two
          directions, and a bowler looking for one will look here for the
          other. Collapsed, because importing a season is something you do
          once. */}
      {showCard("backup") && (
      <CollapsibleCard title="Import scores"
        summary=""
        expanded={expanded.importCsv === true}
        onToggle={() => toggle("importCsv")}>
        <ImportCsv
          leagues={leagues || []}
          leagueDates={leagueDates || {}}
          existingDates={(sessions || [])
            .filter(x => x && x.bowler === (statsBowler || activeBowler))
            .map(x => x.date)}
          today={localDateString()}
          onImport={onImportCsv} />
      </CollapsibleCard>
      )}

      {showCard("backup") && (
      <CollapsibleCard title="Backup &amp; Restore" summary={hasData ? "" : "No data yet"}
        expanded={expanded.backup} onToggle={() => toggle("backup")}
        cardStyle={{ ...S.card, border: `1px solid ${C.accent}44` }}>
        <div style={{ fontSize: "12px", color: C.textMuted, marginBottom: "10px" }}>
          Save a copy of everything — shots, sessions, bowlers, arsenals, and match results — so your season is safe no matter what. If you ever open this app and your history looks empty, restore it here.
        </div>
        {!showBackup ? (
          <button style={S.btn()} onClick={() => { setShowBackup(true); setBackupStatus(""); }}>Open Backup &amp; Restore</button>
        ) : (
          <>
            <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
              <button style={{ ...S.btn("primary"), flex: 1 }} onClick={() => {
                const json = exportData();
                const blob = new Blob([json], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `bowling-backup-${localDateString()}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                setBackupStatus("Backup downloaded.");
              }}>Download Backup</button>
              <button style={{ ...S.btn(), flex: 1 }} onClick={() => setShowBackup(false)}>Close</button>
            </div>
            <div style={{ fontSize: "11px", color: C.textMuted, marginBottom: "6px" }}>
              If the download doesn't work in this environment, copy the text below instead and save it somewhere safe.
            </div>
            <textarea readOnly value={exportData()} onClick={e => e.target.select()}
              style={{ ...S.input, minHeight: "90px", fontFamily: "monospace", fontSize: "11px", marginBottom: "12px" }} />
            <div style={{ fontSize: "11px", color: C.textMuted, marginBottom: "6px" }}>
              To restore, paste a backup below and tap Restore. This adds anything missing — it won't erase what's already here.
            </div>
            <textarea value={importText} onChange={e => setImportText(e.target.value)}
              placeholder="Paste backup JSON here…"
              style={{ ...S.input, minHeight: "70px", fontFamily: "monospace", fontSize: "11px", marginBottom: "8px" }} />
            <button style={{ ...S.btn("primary"), width: "100%" }} onClick={() => importData()}>Restore This Backup</button>
            {backupStatus && (
              <div style={{ fontSize: "12px", color: backupStatus.startsWith("Couldn't") ? C.miss : C.strike, marginTop: "8px" }}>{backupStatus}</div>
            )}
          </>
        )}
      </CollapsibleCard>
      )}

      {/* Named for WHAT it resets, not which environment it resets to.
          It was "Reset to League Defaults" with "League" as the summary,
          which read as "reset my league mode" -- but it rebuilds the whole
          preferences object: theme, every tracked field, money games, and
          the Stats card order. Someone reaching for it to fix one toggle
          lost their theme and card layout with no warning. */}
      {/* Replay the walkthrough. Separate from Reset settings: someone
          who wants a reminder of what a tab does shouldn't have to
          consider wiping their theme and layout to get it. */}
      {/* Every walkthrough, replayable. One per way of bowling, because
          the league tour explains rosters and money games that a casual
          bowler never sees, and the casual tour would bore a league
          bowler. Coaching is gated to coaches -- offering it to everyone
          would advertise a mode most people will never use. */}
      {showCard("walkthroughs") && replayTour && (
        <CollapsibleCard title="Walkthroughs"
          summary={`${availableTours().length} available`}
          expanded={expanded.walkthroughs} onToggle={() => toggle("walkthroughs")}>
          <div style={{ fontSize: "11px", color: C.textMuted, marginBottom: "10px" }}>
            Watch any of these again, any time.
          </div>
          {availableTours().map(t => (
            <div key={t.key} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              gap: "10px", padding: "8px 0", borderTop: `1px solid ${C.border}`,
            }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: C.text }}>{t.label}</div>
                <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "1px" }}>{t.blurb}</div>
              </div>
              <button style={{ ...S.btn(), padding: "7px 12px", fontSize: "12px", flexShrink: 0 }}
                onClick={() => replayTour(t.key)}>
                Watch
              </button>
            </div>
          ))}
        </CollapsibleCard>
      )}

      {/* The Diagnostics card used to sit here.
          
          The record it showed still exists -- errors are still captured
          and still redacted before storage -- but it now goes straight to
          error_reports instead of being displayed. A bowler could not act
          on "23503 violates foreign key constraint", and a card counting
          "3 issues" in their settings only suggests the app is broken.
          See errorReport.js. */}
      {showCard("account") && (
      <CollapsibleCard title="Account"
        summary={user?.email || "Signed in"}
        expanded={expanded.account} onToggle={() => toggle("account")}>
        <div style={{ fontSize: "12px", color: C.textMuted, marginBottom: "10px", lineHeight: 1.5 }}>
          Signed in as {user?.email || "this device"}.
        </div>
        {/* Signing out is NOT destructive -- but on an offline-first app
            it can look destructive, because anything still in the sync
            queue belongs to this account and is not on the server yet.
            
            So the count is checked FIRST and named in the confirm. A
            bowler who logged a night in a basement with no signal and
            then signs out has a real chance of losing it, and "are you
            sure?" with no number does not tell them that. */}
        <button style={{ ...S.btn(), width: "100%", padding: "9px", fontSize: "12px" }}
          onClick={async () => {
            let pending = 0;
            try { pending = await getPendingCount(); } catch { pending = 0; }
            const warning = pending > 0
              ? `${pending} change${pending === 1 ? "" : "s"} ${pending === 1 ? "has" : "have"} not reached the cloud yet. `
                + `Signing out now may lose ${pending === 1 ? "it" : "them"}. Sign out anyway?`
              : "Sign out of this account?";
            if (!window.confirm(warning)) return;
            try { await signOut?.(); }
            catch { window.alert("Could not sign out. Check your connection and try again."); }
          }}>
          Sign out
        </button>
      </CollapsibleCard>
      )}

      {/* About & Legal.

          Google requires the privacy policy to be reachable from inside
          the app, not only from the store listing, and requires an
          in-app route to account deletion. This card is that route.

          ── Why ABSOLUTE urls, not "/privacy.html" ──────────────────────

          public/ is copied into dist/, which is bundled into the native
          app -- so a relative link WOULD resolve, to the copy frozen
          inside whatever build the bowler installed. Legal pages change,
          and a stale privacy policy on someone's phone is worse than no
          link at all. APP_URL always points at the live ones, which are
          also the urls Google is given.

          ── Why target="_blank" ─────────────────────────────────────────

          Without it the WebView navigates itself to the page, and the
          native shell has no browser chrome -- no back button, no close.
          The bowler is simply stuck in a privacy policy until they kill
          the app. target="_blank" is what asks the OS to open a real
          browser instead.

          VERIFY THIS ON A DEVICE. Capacitor's handling of external links
          has changed across majors and was once an outright bug (issue
          5786). If tapping one of these navigates in place rather than
          opening a browser, the fix is the @capacitor/browser plugin and
          an onClick calling Browser.open -- not a workaround here. */}
      {showCard("about") && (
      <CollapsibleCard title="About & Legal"
        summary={APP_NAME}
        expanded={expanded.about} onToggle={() => toggle("about")}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[
            { label: "Privacy Policy", href: `${APP_URL}/privacy.html` },
            { label: "Terms of Service", href: `${APP_URL}/terms.html` },
            { label: "Delete your account", href: `${APP_URL}/delete-account.html` },
          ].map(link => (
            <a key={link.href} href={link.href}
              target="_blank" rel="noopener noreferrer"
              style={{ ...S.btn(), width: "100%", padding: "10px", fontSize: "13px",
                       textAlign: "center", textDecoration: "none", display: "block" }}>
              {link.label}
            </a>
          ))}
        </div>

        <div style={{ fontSize: "12px", color: C.textMuted, marginTop: "12px", lineHeight: 1.6 }}>
          Questions, or want your data deleted?{" "}
          <a href="mailto:support@mybowlingjourney.com" style={{ color: C.accent }}>
            support@mybowlingjourney.com
          </a>
        </div>
        <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "8px" }}>
          {APP_NAME} is published by My Bowling Journey LLC.
        </div>
      </CollapsibleCard>
      )}

      {/* The hasData gate moved OFF the card and onto Clear All Data.

          It used to hide the whole Danger Zone, which meant a bowler with
          no data had no in-app route to delete their account -- and the
          bowler most likely to want one is precisely the person who
          signed up, looked around, and decided against it. Google
          requires that route to exist; so does common decency.

          Clear All Data still hides when there is nothing to clear,
          because a button that empties an already-empty app is noise. */}
      {showCard("dangerZone") && (
        <CollapsibleCard title="Danger Zone" summary=""
          expanded={expanded.dangerZone} onToggle={() => toggle("dangerZone")}
          cardStyle={{ ...S.card, border: `1px solid ${C.miss}44` }}>

          {hasData && (!confirmClear ? (
            <>
              <button style={S.btn("warn")} onClick={() => setConfirmClear(true)}>Clear All Data</button>
              {/* Says what it does AND what it leaves, because the button
                  below it removes the account entirely. Two red buttons
                  with similar-sounding names, one recoverable-ish and one
                  final, is exactly where someone taps the wrong thing. */}
              <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "8px", lineHeight: 1.5 }}>
                Removes your bowling history including your shots, match results and lane
                notes. Your account, profile, arsenal and teams are unaffected.
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: "12px", color: C.textMuted, marginBottom: "10px" }}>
                This deletes every logged shot, session, match result (opponents, handicaps, win/loss), and lane condition note. This can't be undone. Consider downloading a backup above first.
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button style={{ ...S.btn("warn"), flex: 1 }} onClick={async () => { await clearAllData(); setConfirmClear(false); }}>
                  Yes, Delete Everything
                </button>
                <button style={{ ...S.btn(), flex: 1 }} onClick={() => setConfirmClear(false)}>Cancel</button>
              </div>
            </>
          ))}

          {/* Account deletion. A different thing from Clear All Data, and
              the difference is worth spelling out on screen: that one
              empties your logging and leaves the account standing, this
              one removes the account itself and everything attached to
              it, and you cannot sign back in afterwards. */}
          {user && (
            <div style={{
              marginTop: hasData ? "18px" : 0,
              paddingTop: hasData ? "16px" : 0,
              borderTop: hasData ? `1px solid ${C.border}` : "none",
            }}>
              {!confirmDeleteAccount ? (
                <>
                  <button style={S.btn("warn")} onClick={() => { setConfirmDeleteAccount(true); setDeleteAccountError(""); }}>
                    Delete My Account
                  </button>
                  <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "8px", lineHeight: 1.5 }}>
                    Removes your account and everything in it, permanently.
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: "12px", color: C.text, marginBottom: "10px", lineHeight: 1.6 }}>
                    This deletes your account and <strong>everything attached to it</strong> — every
                    shot and session, your profile and name, your arsenal, goals, and your place on
                    any team. You won't be able to sign back in, and we can't recover it.
                  </div>
                  <div style={{ fontSize: "12px", color: C.textMuted, marginBottom: "10px", lineHeight: 1.6 }}>
                    Leagues and teams you created are kept only if other bowlers are still using
                    them, so nobody loses a league they're bowling in. Any that nobody else is in
                    go with everything else.
                  </div>
                  <div style={{ fontSize: "12px", color: C.textMuted, marginBottom: "12px", lineHeight: 1.6 }}>
                    Want a copy first? Use <strong>Backup &amp; Restore</strong> above before you do this.
                  </div>

                  <div style={{ ...S.label, marginBottom: "6px" }}>
                    Type <span style={{ color: C.text }}>{user.email}</span> to confirm
                  </div>
                  <input
                    style={{ ...S.input, marginBottom: "10px" }}
                    value={deleteConfirmText}
                    autoComplete="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    disabled={deletingAccount}
                    placeholder={user.email}
                    onChange={e => { setDeleteConfirmText(e.target.value); if (deleteAccountError) setDeleteAccountError(""); }}
                  />

                  {deleteAccountError && (
                    <div style={{ fontSize: "12px", color: C.miss, marginBottom: "10px", lineHeight: 1.5 }}>
                      {deleteAccountError}
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      style={{
                        ...S.btn("warn"), flex: 1,
                        opacity: deletingAccount || deleteConfirmText.trim().toLowerCase() !== (user.email || "").toLowerCase() ? 0.5 : 1,
                      }}
                      disabled={deletingAccount || deleteConfirmText.trim().toLowerCase() !== (user.email || "").toLowerCase()}
                      onClick={async () => {
                        setDeletingAccount(true);
                        setDeleteAccountError("");
                        const { error } = await deleteAccount();
                        // No success branch: deleteAccount signs out, which
                        // unmounts this entire screen. Setting state here
                        // would be a write to a component on its way out.
                        if (error) {
                          setDeletingAccount(false);
                          setDeleteAccountError(error.message || "Couldn't delete the account.");
                        }
                      }}>
                      {deletingAccount ? "Deleting…" : "Permanently Delete"}
                    </button>
                    <button
                      style={{ ...S.btn(), flex: 1 }}
                      disabled={deletingAccount}
                      onClick={() => { setConfirmDeleteAccount(false); setDeleteConfirmText(""); setDeleteAccountError(""); }}>
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </CollapsibleCard>
      )}
      </>)}
    </div>
  );
}

// What the upgrade card says underneath the heading.
//
// The countdown is guarded on days > 0, exactly as TrialBanner guards
// its own. trialDaysLeft() returns 0 both for "the trial is over" and
// for "trial_end is missing or unreadable", and the first version of
// this card printed that straight out -- so a bowler whose trial had
// just converted, or whose trial_end never got recorded, was told
// "0 days left in your trial" while everything was still unlocked and
// their card had just been charged. That reads as expired, which is the
// opposite of true, and it is the kind of thing that produces a refund
// request from somebody who was perfectly happy.
//
// A subscriber with nothing specific to say is simply subscribed.
function subscriptionLine(entitlement) {
  // Named, not disguised as a subscription. If this said "You're
  // subscribed" we would have no way to tell a working paywall from a
  // flag left switched on.
  if (isTestAccount(entitlement)) return "Test account — everything unlocked";
  if (isTrialing(entitlement)) {
    const days = trialDaysLeft(entitlement);
    if (days > 0) return `${days} day${days === 1 ? "" : "s"} left in your trial`;
  }
  if (entitlement?.status === "canceled") return "Ending — you keep Pro until the period you paid for runs out";
  if (entitlement?.status === "grace") return "There's a problem with your payment method";
  return "You're subscribed";
}
