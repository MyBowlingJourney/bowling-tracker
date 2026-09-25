import { useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthProvider.jsx";
import { cloudUpdate, cloudRead, cloudWrite, cloudInsert, cloudDelete } from "./syncQueue.js";
import { generateSignupCode } from "./domain/signupCodes.js";
import { APP_NAME } from "./constants.js";
import { supabase } from "./supabaseClient.js";

// Pure roster-management functions, extracted so they're testable without
// rendering the component. Each takes the current `teams` array plus
// whatever's needed and returns a new array — no cloud calls, no React
// state, no id generation (callers pass in an id already generated via
// crypto.randomUUID(), keeping these fully deterministic).

export function addTeamMember(teams, teamId, profile) {
  const team = teams.find(t => t.id === teamId);
  if (!team || team.members.some(m => m.userId === profile.id)) return teams;
  const lineupPosition = team.members.length;
  const newMember = { userId: profile.id, displayName: profile.display_name, lineupPosition };
  return teams.map(t => t.id === teamId ? { ...t, members: [...t.members, newMember] } : t);
}

export function removeTeamMember(teams, teamId, userId) {
  return teams.map(t => t.id === teamId
    ? { ...t, members: t.members.filter(m => m.userId !== userId) }
    : t
  );
}

// Swaps the member at `index` with its neighbor in `direction` (-1 or +1)
// and renumbers lineup_position to match the new order. Returns the SAME
// array reference if the move is out of bounds, so callers can check
// `result === teams` to know nothing changed.
export function moveTeamMember(teams, teamId, index, direction) {
  const team = teams.find(t => t.id === teamId);
  if (!team) return teams;
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= team.members.length) return teams;

  const members = [...team.members];
  [members[index], members[newIndex]] = [members[newIndex], members[index]];
  const renumbered = members.map((m, i) => ({ ...m, lineupPosition: i }));

  return teams.map(t => t.id === teamId ? { ...t, members: renumbered } : t);
}

// Returns { teams, invite, error }. error is 'invalid' (blank name/email),
// 'no-team' (bad teamId), 'duplicate' (email already invited to this team),
// or null on success.
// email is optional — a blank one creates a name-only "placeholder" roster
// slot rather than an error. Duplicate-checking only applies when an email
// is actually given, since multiple email-less placeholders are allowed.
// Hand an invite code to the phone's messaging: the native share sheet
// in the app (Capacitor Share -- navigator.share does not exist in the
// Android WebView), the browser's share sheet on the web, and a plain
// SMS link as the last resort.
async function textInviteCode(message) {
  try {
    const { Capacitor } = await import("@capacitor/core");
    if (Capacitor?.isNativePlatform?.()) {
      const { Share } = await import("@capacitor/share");
      await Share.share({ text: message });
      return;
    }
  } catch { /* not native, or the plugin is missing */ }
  try {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      await navigator.share({ text: message });
      return;
    }
  } catch (e) {
    if (e && e.name === "AbortError") return;   // they closed the sheet
  }
  try { window.location.href = `sms:?&body=${encodeURIComponent(message)}`; } catch { /* nothing left to try */ }
}

export function createTeamInvite(teams, teamId, id, name, email, useCode = false) {
  const cleanName = (name || "").trim();
  const cleanEmail = (email || "").trim().toLowerCase();
  if (!cleanName) return { teams, invite: null, error: "invalid" };

  // Email is REQUIRED.
  //
  // It's the only link between a placeholder and the account that person
  // eventually creates. Without one, the only way to connect them was a
  // captain searching every account on the app and pressing Link -- which
  // let a captain add ANY user to their roster without that person's
  // knowledge, and team membership grants read access to sessions and
  // shots. Requiring the email removes the need for that path entirely:
  // the person signs up, sees the invite, and accepts it themselves.
  // Email OR a signup code. Not neither.
  //
  // Both give the teammate a way to claim the spot THEMSELVES. What was
  // banned is a placeholder with no route at all, because the only way
  // to resolve one of those was a captain searching every account on the
  // app and linking one -- which let a captain add anyone, without
  // consent, and team membership grants read access to sessions and
  // shots.
  if (!cleanEmail && !useCode) return { teams, invite: null, error: "no-contact" };
  if (cleanEmail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cleanEmail)) {
    return { teams, invite: null, error: "bad-email" };
  }

  const team = teams.find(t => t.id === teamId);
  if (!team) return { teams, invite: null, error: "no-team" };
  if (cleanEmail && team.pendingInvites.some(inv => inv.email && inv.email.toLowerCase() === cleanEmail)) {
    return { teams, invite: null, error: "duplicate" };
  }
  const lineupPosition = team.members.length + team.pendingInvites.length;
  const invite = {
    id, name: cleanName, email: cleanEmail || null, lineupPosition,
    leftHanded: false, isSub: false,
    signupCode: useCode ? generateSignupCode() : null,
  };
  const newTeams = teams.map(t => t.id === teamId ? { ...t, pendingInvites: [...t.pendingInvites, invite] } : t);
  return { teams: newTeams, invite, error: null };
}

export function cancelTeamInvite(teams, teamId, inviteId) {
  return teams.map(t => t.id === teamId
    ? { ...t, pendingInvites: t.pendingInvites.filter(inv => inv.id !== inviteId) }
    : t
  );
}

// The canonical shape of a freshly-created team — every field the render
// code assumes exists (members, pendingInvites) must be present here, or
// creating a team crashes the instant it tries to render. Centralized so
// this can't silently drift out of sync with what the render code expects,
// the way the inline version in createTeam() once did.
export function newTeamObject(id, name, league) {
  return { id, name, league, members: [], pendingInvites: [] };
}

// Converts a placeholder into a real member, in one atomic local update.
// Used by both linking directions: a team member manually picking an
// account, or the new person claiming their own placeholder. Preserves the
// invite's original lineup position so the roster order doesn't shuffle
// just because someone finally signed up. Returns the SAME array reference
// if teamId/inviteId don't resolve to anything, so callers can check
// `result === teams` to know nothing changed.
export function resolvePlaceholder(teams, teamId, inviteId, profile) {
  const team = teams.find(t => t.id === teamId);
  if (!team) return teams;
  const invite = team.pendingInvites.find(inv => inv.id === inviteId);
  if (!invite) return teams;

  const withoutPlaceholder = team.pendingInvites.filter(inv => inv.id !== inviteId);
  const alreadyMember = team.members.some(m => m.userId === profile.id);
  const newMembers = alreadyMember
    ? team.members
    : [...team.members, { userId: profile.id, displayName: profile.display_name, lineupPosition: invite.lineupPosition ?? team.members.length }];

  return teams.map(t => t.id === teamId ? { ...t, pendingInvites: withoutPlaceholder, members: newMembers } : t);
}

// Shares the live palette from ui.jsx instead of carrying a private copy
// of the original slate-and-blue. A private copy meant this screen stayed
// on the old colours no matter which theme was chosen -- and `danger`
// here is just the shared `miss` red under another name.
import { C as SHARED_C } from "./ui.jsx";
const C = new Proxy({}, {
  get(_, key) {
    if (key === "danger") return SHARED_C.miss;
    return SHARED_C[key];
  },
});

// Getters, not captured values: each style recomputes from the live C
// when read, so a theme change is reflected on the next render instead
// of freezing this screen on whatever colours were current at load.
const S = new Proxy({}, {
  get(_, key) {
    const styles = ({
  card:{
    backgroundColor:C.card,
    borderRadius:"12px",
    padding:"16px",
    marginBottom:"12px",
    border:`1px solid ${C.border}`,
  },
  label:{
    fontSize:"13px",fontWeight:600,color:C.text,
    marginBottom:"8px",
  },
  input:{
    width:"100%",
    backgroundColor:C.surface,
    border:`1px solid ${C.border}`,
    borderRadius:"8px",
    padding:"10px 12px",
    color:C.text,
    fontSize:"14px",
    boxSizing:"border-box",
    outline:"none",
  },
  // Dropdowns. Same box as an input; the arrow on the right comes from
  // the global select rule in styles.css.
  sel:{
    width:"100%",
    backgroundColor:C.surface,
    border:`1px solid ${C.border}`,
    borderRadius:"8px",
    padding:"10px 12px",
    color:C.text,
    fontSize:"14px",
    boxSizing:"border-box",
    outline:"none",
  },
  button:{
    backgroundColor:C.surface,
    color:C.text,
    border:`1px solid ${C.border}`,
    borderRadius:"8px",
    padding:"9px 12px",
    fontSize:"13px",
    fontWeight:600,
    cursor:"pointer",
  },
  primary:{
    backgroundColor:C.accent,
    color:C.onAccent,
    border:"none",
    borderRadius:"8px",
    padding:"10px 14px",
    fontSize:"13px",
    fontWeight:700,
    cursor:"pointer",
  },
});
    return styles[key];
  },
});

// The last teams list loaded, per signed-in account.
//
// The Team tab unmounts when you leave it, so every visit started from
// nothing and showed "Loading teams…" while four reads went out. The
// cached list is shown at once on the next visit and refreshed quietly
// behind it. Keyed by user id, so switching accounts never shows the
// previous account's teams; nothing is cached without a signed-in user.
const teamsCache = new Map();

export default function TeamManagement({
  leagues = [],
  onTeamsChange, focusTeamId,
  // A second way to make a team, from this tab. Creating one from the
  // League tab is easy to miss, so "Add team" here asks for the league it
  // belongs to and hands off to the same function. Absent: no button.
  onCreateTeam = null,
  // Told when this bowler joins a team -- by code, or by accepting an
  // invite -- with the team's league id, so the parent can add the league
  // to their list. And when a request is answered, to refresh the inbox.
  onJoinedTeam = null,
  onRequestsChanged = null,
}) {
  const{user,displayName,updateDisplayName}=useAuth();
  // Maps league name -> its Supabase row id, built from its own small fetch
  // on mount. Teams are stored client-side keyed by league NAME (matching
  // how the rest of the app already works with leagues as plain strings) —
  // this ref is only consulted at the moment of talking to Supabase, so a
  // team row always gets the correct league_id foreign key.
  const cached = user?.id ? teamsCache.get(user.id) : null;
  const leagueIdsRef = useRef({ ...(cached?.leagueIds || {}) });
  const[teams, setTeams] = useState(() => cached?.teams || []);
  // Only a first-ever visit waits on a spinner; later ones show the
  // cached list while the refresh runs.
  const[loading, setLoading] = useState(!cached);
  const[loadError, setLoadError] = useState(false);
  const[editingTeamId, setEditingTeamId] = useState(null);

  // The team just created from the Leagues card above. Scrolled to on
  // arrival so adding players continues straight on from adding the team,
  // rather than leaving the bowler to find it further down the page.
  // Which team's cards are showing. Every team used to render its own
  // full stack -- name, roster, invite form, "not signed up yet" form --
  // so three teams meant scrolling past three of everything to reach the
  // one you wanted.
  const [shownTeamId, setShownTeamId] = useState("");
  const [adding, setAdding] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamLeague, setNewTeamLeague] = useState("");
  const shownTeam = teams.find(t => t.id === shownTeamId) || teams[0] || null;

  const focusedTeamRef = useRef(null);

  // A team created in the Leagues card above has to be FETCHED before it
  // can be scrolled to.
  //
  // This component loads its own teams once, on mount. A team added from
  // the card above therefore did not exist in this list at all -- the
  // scroll had no target, nothing was selected, and the bowler was left
  // on a page that had visibly not reacted to what they just did. The
  // team only appeared on the next visit to the Team tab.
  //
  // Which is the whole "adding players continues straight on from adding
  // the team" intention failing silently.
  useEffect(() => {
    if (!focusTeamId) return;
    let cancelled = false;
    (async () => {
      if (!teams.some(t => t.id === focusTeamId)) await loadAll();
      if (!cancelled) setShownTeamId(focusTeamId);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusTeamId]);

  // Scroll separately, once the team is actually on screen. Doing it in
  // the effect above ran before the render that creates the node, so the
  // ref was still null and the scroll silently did nothing.
  useEffect(() => {
    if (!focusTeamId || shownTeamId !== focusTeamId) return;
    if (!focusedTeamRef.current) return;
    focusedTeamRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [focusTeamId, shownTeamId, teams.length]);
  const[editingName, setEditingName] = useState("");
  // Asked at creation because there's no other reliable way to know when a
  // season ends -- leagues in this app have no automatic boundary, so this
  // is what makes the book-average update prompt possible at all. Optional:
  // an ongoing house shot with no fixed end just leaves these blank, and
  // the prompt never fires for it.
  // "Your Name" editing
  const[editingMyName, setEditingMyName] = useState(false);
  const[myNameInput, setMyNameInput] = useState("");
  // Per-team invite-by-email form: {[teamId]: {name, email}}
  const[inviteForm, setInviteForm] = useState({});
  // ── Joining ──────────────────────────────────────────────────────────
  // Open requests and invites involving this bowler (my_team_requests()).
  const[requests, setRequests] = useState([]);
  const[busyId, setBusyId] = useState(null);
  const[joinCode, setJoinCode] = useState("");
  const[joinBusy, setJoinBusy] = useState(false);
  const[joinMsg, setJoinMsg] = useState(null);
  const[findLeague, setFindLeague] = useState("");
  const[leagueTeams, setLeagueTeams] = useState(null);
  const[copiedTeamId, setCopiedTeamId] = useState(null);
  // Per-placeholder "link to an account" search, keyed by invite id:
  // {[inviteId]: {term, results, searching}}
  // Self-claim: invites addressed to this account's own verified email,
  // loaded automatically rather than searched by typed name -- RLS now
  // only returns rows actually meant for this signed-in user, so there's
  // no free-text search surface that could leak or let someone claim a
  // spot that isn't theirs.
  // QR code for the sign-in URL, generated once on mount

  async function loadAll() {
    if (!(user?.id && teamsCache.has(user.id))) setLoading(true);
    // try/finally, because "Loading teams..." with no way out is worse
    // than an empty list.
    //
    // setLoading(false) was the last statement and nothing caught a
    // throw: one cloudRead rejecting -- offline, a dropped connection, a
    // permissions error -- left the spinner up permanently with no
    // message and no retry.
    try {

    // All four reads at once. They were awaited one after another, so
    // the tab waited for four round trips in a row; none needs another's
    // result, so the wait is now the slowest one rather than the sum.
    const [leaguesRes, firstTeams, membersRes, firstInvites, myLeaguesRes] = await Promise.all([
      cloudRead("leagues", q => q.select("id,name")),
      // created_by so a team you made can show YOU on its roster even
      // when the membership row has not landed -- see the fallback where
      // members are assembled below.
      cloudRead("teams", q => q.select("id,name,league_id,created_by,join_code")),
      cloudRead("team_members", q => q.select("team_id,user_id,lineup_position,left_handed,is_sub,profiles(display_name)")),
      // Selecting signup_code fails outright if migration_signup_codes.sql
      // hasn't been run -- and a failed select here blanks the whole Team
      // tab. Try with it, fall back without (below), so a database one
      // migration behind loses the codes rather than the screen.
      cloudRead("pending_invites", q =>
        q.select("id,team_id,invited_name,invited_email,lineup_position,left_handed,is_sub,signup_code").is("accepted_at", null)),
      // This bowler's own leagues. `leagues` above is every league in the
      // database (readable by all, so shared leagues can be joined), and
      // names are only unique per creator -- so only these may be put in
      // the name -> id map a new team is created from. See
      // 20260924120000_user_leagues.sql.
      cloudRead("user_leagues", q => q.select("league_id")),
    ]);
    const myLeagueIds = myLeaguesRes.online && Array.isArray(myLeaguesRes.data)
      ? new Set(myLeaguesRes.data.map(r => r && r.league_id).filter(Boolean))
      : null;
    const leagueNameById = {};
    if (leaguesRes.online && leaguesRes.data) {
      leaguesRes.data.forEach(l => {
        // Any league can be NAMED (a team you were invited to may sit in
        // someone else's league), but only yours map a name to an id.
        leagueNameById[l.id] = l.name;
        if (myLeagueIds && myLeagueIds.has(l.id)) leagueIdsRef.current[l.name] = l.id;
      });
    }

    // join_code arrives with 20260925140000_team_joining.sql. A database
    // one migration behind loses the codes, not the whole tab.
    let teamsRes = firstTeams;
    if (!teamsRes.online || teamsRes.error) {
      teamsRes = await cloudRead("teams", q => q.select("id,name,league_id,created_by"));
    }
    loadRequests();

    let invitesRes = firstInvites;
    if (!invitesRes.online || invitesRes.error) {
      invitesRes = await cloudRead("pending_invites", q =>
        q.select("id,team_id,invited_name,invited_email,lineup_position,left_handed,is_sub").is("accepted_at", null));
    }

    if (teamsRes.online && teamsRes.data) {
      const membersByTeam = {};
      (membersRes.data || []).forEach(m => {
        if (!membersByTeam[m.team_id]) membersByTeam[m.team_id] = [];
        membersByTeam[m.team_id].push({
          userId: m.user_id,
          displayName: m.profiles?.display_name || "Unknown",
          lineupPosition: m.lineup_position ?? 0,
          leftHanded: !!m.left_handed,
          isSub: !!m.is_sub,
        });
      });
      Object.values(membersByTeam).forEach(list => list.sort((a, b) => a.lineupPosition - b.lineupPosition));

      const invitesByTeam = {};
      (invitesRes.data || []).forEach(inv => {
        if (!invitesByTeam[inv.team_id]) invitesByTeam[inv.team_id] = [];
        invitesByTeam[inv.team_id].push({
          id: inv.id, name: inv.invited_name, email: inv.invited_email, lineupPosition: inv.lineup_position,
          leftHanded: !!inv.left_handed, isSub: !!inv.is_sub,
          signupCode: inv.signup_code || null,
        });
      });

      const nextTeams = teamsRes.data.map(t => {
        const loaded = membersByTeam[t.id] || [];
        // A team you created always shows YOU on its roster.
        //
        // The membership row is written right after the team, but it can
        // fail or be queued -- and it did, on a real device: 42501 on
        // team_members.upsert, fourteen times, from writes queued before
        // a policy fix. The result was a team you had just made reporting
        // "0 bowlers", which reads as though creating it had not worked.
        //
        // Derived from created_by rather than invented: if the database
        // says you made this team, you are on it. The real row still
        // arrives and simply replaces this.
        const iMadeIt = !!user?.id && t.created_by === user.id;
        const meMissing = iMadeIt && !loaded.some(m => m.userId === user.id);
        const members = meMissing
          ? [{ userId: user.id, displayName: displayName || "You", lineupPosition: 0, leftHanded: false, isSub: false }, ...loaded]
          : loaded;
        return {
          id: t.id,
          name: t.name,
          leagueId: t.league_id,
          joinCode: t.join_code || "",
          league: leagueNameById[t.league_id] || "",
          members,
          pendingInvites: invitesByTeam[t.id] || [],
        };
      });
      setTeams(nextTeams);
      if (user?.id) teamsCache.set(user.id, { teams: nextTeams, leagueIds: { ...leagueIdsRef.current } });
    }
    } catch (err) {
      // The list stays as it was. An empty Teams tab the bowler can act
      // on beats a spinner that never resolves.
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the cache in step with every change made on this tab -- renames,
  // roster edits, invites -- so the next visit shows what the bowler last
  // saw rather than the list as it was first loaded.
  useEffect(() => {
    if (!loading && user?.id) teamsCache.set(user.id, { teams, leagueIds: { ...leagueIdsRef.current } });
  }, [teams, loading, user?.id]);



  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  // Tells the parent about the current teams whenever they change, in the
  // SAME shape it always used (members as plain display-name strings) —
  // BowlingTracker.jsx's existing team-membership checks (e.g.
  // t.members.includes(activeBowler)) keep working unchanged. Internally
  // this component tracks richer per-member data (userId, lineup position)
  // that the parent doesn't need to know about.
  useEffect(() => {
    const simplified = teams.map(t => {
      // Placeholders merged in alongside real members, sorted together by
      // lineup position — a placeholder's scores are tracked identically to
      // a real member's (proxy-logged under their name), so anything that
      // resolves "is this bowler on this team" (team_id lookups, match/shot
      // cloud sync) needs to see them the same way, in the same actual
      // bowling order. The only real difference is they don't have a
      // linked account yet, which doesn't matter for local team membership.
      const combined = [
        ...t.members.map(m => ({ name: m.displayName, lineupPosition: m.lineupPosition ?? 0, leftHanded: !!m.leftHanded, isSub: !!m.isSub })),
        ...t.pendingInvites.map(inv => ({ name: inv.name, lineupPosition: inv.lineupPosition ?? 999, leftHanded: !!inv.leftHanded, isSub: !!inv.isSub })),
      ].sort((a, b) => a.lineupPosition - b.lineupPosition);
      const memberHandedness = {};
      const memberIsSub = {};
      combined.forEach(x => { memberHandedness[x.name] = x.leftHanded; memberIsSub[x.name] = x.isSub; });
      return { id: t.id, name: t.name, league: t.league, members: combined.map(x => x.name), memberHandedness, memberIsSub };
    });
    onTeamsChange?.(simplified);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teams]);

  const leagueList = (leagues || []).length ? leagues : ["Tuesday House Shot", "Thursday House Shot"];



  // ── Joining ──────────────────────────────────────────────────────────

  async function loadRequests() {
    if (!supabase || !user?.id) return;
    try {
      const { data, error } = await supabase.rpc("my_team_requests");
      if (!error && Array.isArray(data)) setRequests(data);
    } catch { /* offline: keep what is shown */ }
  }

  // After anything that changes membership: re-read the roster and the
  // requests here, and tell the parent (inbox badge, league list).
  async function afterMembershipChange(leagueId) {
    await loadAll();
    await loadRequests();
    if (leagueId && onJoinedTeam) onJoinedTeam(leagueId);
    else onRequestsChanged?.();
  }

  async function joinWithCode(confirmed = false) {
    const code = joinCode.trim();
    if (!code || !supabase) return;
    setJoinBusy(true);
    setJoinMsg(null);
    try {
      const { data, error } = await supabase.rpc("join_team_with_code", { p_code: code, p_confirm: confirmed });
      const row = Array.isArray(data) ? data[0] : null;
      // One team per league: the database answers first with the team
      // they would leave, and nothing moves until they say yes.
      if (!error && row && row.needs_confirm) {
        setJoinBusy(false);
        if (confirm(`You're on ${row.switched_from} in ${row.league_name || "this league"}. Joining ${row.team_name} takes you off ${row.switched_from}'s roster. Your scores stay yours.`)) {
          await joinWithCode(true);
        }
        return;
      }
      if (error) {
        setJoinMsg({ ok: false, text: /too many/i.test(error.message || "")
          ? "Too many tries. Wait a little and try again."
          : "Couldn't join just now. Check your connection and try again." });
      } else if (!row) {
        setJoinMsg({ ok: false, text: "That code didn't match a team. Check it with whoever sent it." });
      } else {
        setJoinCode("");
        setJoinMsg({ ok: true, text: `You're on ${row.team_name}${row.league_name ? ` (${row.league_name})` : ""}.${row.switched_from ? ` You're off ${row.switched_from}.` : ""}` });
        setShownTeamId(row.team_id);
        await afterMembershipChange(row.league_id);
      }
    } catch {
      setJoinMsg({ ok: false, text: "Couldn't join just now. Check your connection and try again." });
    }
    setJoinBusy(false);
  }

  async function answer(request, accept) {
    if (!supabase) return;
    if (accept && request.kind === "invite" && request.current_team
      && !confirm(`You're on ${request.current_team} in this league. Joining ${request.team_name} takes you off ${request.current_team}'s roster. Your scores stay yours.`)) return;
    setBusyId(request.id);
    try {
      const { error } = await supabase.rpc("answer_team_request", { p_request_id: request.id, p_accept: accept });
      if (error) alert("Couldn't do that just now. It may already have been answered — pull down to refresh.");
      const joinedMyself = accept && !error && request.kind === "invite" && request.user_id === user?.id;
      if (joinedMyself) setShownTeamId(request.team_id);
      await afterMembershipChange(joinedMyself ? request.league_id : null);
      if (findLeague) await loadLeagueTeams(findLeague);
    } catch { /* nothing to undo */ }
    setBusyId(null);
  }

  async function loadLeagueTeams(leagueName) {
    setFindLeague(leagueName);
    setLeagueTeams(null);
    const id = leagueIdsRef.current[leagueName];
    if (!id || !supabase) { setLeagueTeams([]); return; }
    try {
      const { data, error } = await supabase.rpc("league_teams", { p_league_id: id });
      setLeagueTeams(!error && Array.isArray(data) ? data : []);
    } catch { setLeagueTeams([]); }
  }

  async function askToJoin(team) {
    if (!supabase) return;
    const list = Array.isArray(leagueTeams) ? leagueTeams : [];
    const current = list.find(t => t.is_member && t.id !== team.id);
    const pending = list.find(t => t.requested && t.id !== team.id);
    const lines = [];
    if (current) lines.push(`You're on ${current.name} in this league. If ${team.name} approves you, you'll be taken off ${current.name}'s roster. Your scores stay yours.`);
    if (pending) lines.push(`This replaces your request to join ${pending.name}.`);
    if (lines.length && !confirm(lines.join("\n\n"))) return;
    setBusyId(team.id);
    try {
      const { error } = await supabase.rpc("request_to_join_team", { p_team_id: team.id });
      if (error && error.hint !== "already_member") {
        alert("Couldn't send that just now. Check your connection and try again.");
      }
      await loadLeagueTeams(findLeague);
      await afterMembershipChange(null);
    } catch { /* nothing to undo */ }
    setBusyId(null);
  }

  async function copyCode(team) {
    try {
      await navigator.clipboard.writeText(team.joinCode);
      setCopiedTeamId(team.id);
      setTimeout(() => setCopiedTeamId(null), 2000);
    } catch { /* clipboard blocked: the code is on screen to read out */ }
  }

  async function newCode(team) {
    if (!supabase) return;
    if (!confirm("Make a new code? The old one stops working, so anyone you sent it to will need the new one.")) return;
    try {
      const { data, error } = await supabase.rpc("reset_team_code", { p_team_id: team.id });
      if (!error && data) setTeams(prev => prev.map(t => t.id === team.id ? { ...t, joinCode: data } : t));
    } catch { /* keep the old code on screen */ }
  }

  function startRename(team) {
    setEditingTeamId(team.id);
    setEditingName(team.name);
  }

  function saveRename(teamId) {
    const name = editingName.trim();
    if (!name) return;
    const renaming = teams.find(t => t.id === teamId);
    const duplicate = teams.some(team => team.id !== teamId
      && team.league === renaming?.league
      && team.name.toLowerCase() === name.toLowerCase());
    if (duplicate) { alert("A team with that name already exists in this league."); return; }

    setTeams(prev => prev.map(team => team.id === teamId ? { ...team, name } : team));
    // cloudUpdate, not cloudWrite: cloudWrite UPSERTS the whole row, so
    // sending just { id, name } wrote league_id as null and the NOT NULL
    // constraint rejected it with 23502 -- then the queue retried the
    // same doomed write forever. A rename should change the name and
    // nothing else, which is what an UPDATE does.
    cloudUpdate("teams", { id: teamId }, { name });
    setEditingTeamId(null);
    setEditingName("");
  }

  function deleteTeam(teamId) {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;
    if (!window.confirm(`Delete "${team.name}"? This removes the team and its roster, but does not delete any bowler accounts.`)) return;

    setTeams(prev => prev.filter(t => t.id !== teamId));
    cloudDelete("teams", teamId); // cascades team_members server-side
  }

  function removeMember(teamId, userId) {
    setTeams(prev => removeTeamMember(prev, teamId, userId));
    cloudDelete("team_members", { team_id: teamId, user_id: userId });
  }

  // Pre-assigns a roster slot to someone who hasn't signed up yet. When
  // they eventually sign in with this exact email, a database trigger
  // automatically sets their display name and adds them to this team —
  // nothing further needs to happen on this end.
  function createInvite(teamId) {
    const form = inviteForm[teamId] || {};
    const id = crypto.randomUUID();
    const { teams: newTeams, invite, error } = createTeamInvite(teams, teamId, id, form.name, form.email, form.useCode !== false);
    if (error === "duplicate") {
      alert("There's already a pending invite for that email on this team.");
      return;
    }
    if (error === "no-contact") {
      alert("Add an email, or tick \u201cI don\u2019t have their email\u201d to get a code you can text them. Either way they need a way to claim this spot themselves.");
      return;
    }
    if (error === "bad-email") {
      alert("That doesn't look like an email address.");
      return;
    }
    if (error || !invite) return;
    setTeams(newTeams);
    setInviteForm(prev => ({ ...prev, [teamId]: { name: "", email: "" } }));
    cloudWrite("pending_invites", {
      id, team_id: teamId, invited_name: invite.name, invited_email: invite.email,
      lineup_position: invite.lineupPosition, created_by: user?.id || null,
      // Only sent when there IS a code.
      //
      // Writing signup_code: null unconditionally means every invite --
      // including ordinary email ones -- references a column that
      // doesn't exist until migration_signup_codes.sql has been run,
      // and Postgres rejects the whole insert. That took the Team tab down
      // for anyone whose database was a migration behind.
      //
      // A month is long enough to catch someone who signs up next
      // Tuesday, short enough that an abandoned code doesn't sit live
      // forever.
      ...(invite.signupCode ? {
        signup_code: invite.signupCode,
        code_expires_at: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
      } : {}),
    });
  }

  function cancelInvite(teamId, inviteId) {
    setTeams(prev => cancelTeamInvite(prev, teamId, inviteId));
    cloudDelete("pending_invites", inviteId);
  }

  // Handedness and sub status for a real member. Only the changed field is
  // sent — upsert() only updates columns present in the payload, so
  // lineup_position and everything else on the existing row is left alone.
  function setMemberHandedness(teamId, userId, leftHanded) {
    setTeams(prev => prev.map(t => t.id !== teamId ? t : {
      ...t,
      members: t.members.map(m => m.userId === userId ? { ...m, leftHanded } : m),
    }));
    // cloudUpdate, not cloudWrite, for the same reason as the rename
    // above -- and for a second one: an upsert compiles to ON CONFLICT DO
    // UPDATE SET team_id=..., user_id=..., left_handed=..., so it writes
    // the key columns even though only handedness changed. That blocks
    // revoking UPDATE on team_id and user_id, which is what stops a
    // teammate rewriting whose roster row is whose.
    cloudUpdate("team_members", { team_id: teamId, user_id: userId }, { left_handed: leftHanded });
  }
  function setMemberIsSub(teamId, userId, isSub) {
    setTeams(prev => prev.map(t => t.id !== teamId ? t : {
      ...t,
      members: t.members.map(m => m.userId === userId ? { ...m, isSub } : m),
    }));
    cloudUpdate("team_members", { team_id: teamId, user_id: userId }, { is_sub: isSub });
  }

  // Same, for a placeholder.
  function setInviteHandedness(teamId, inviteId, leftHanded) {
    setTeams(prev => prev.map(t => t.id !== teamId ? t : {
      ...t,
      pendingInvites: t.pendingInvites.map(inv => inv.id === inviteId ? { ...inv, leftHanded } : inv),
    }));
    // cloudUpdate, not cloudWrite. cloudWrite upserts the WHOLE row, so
    // sending { id, left_handed } wiped team_id, invited_name and
    // invited_email to null -- rejected by NOT NULL, then retried
    // forever by the queue. Same bug the team rename had.
    cloudUpdate("pending_invites", { id: inviteId }, { left_handed: leftHanded });
  }
  function setInviteIsSub(teamId, inviteId, isSub) {
    setTeams(prev => prev.map(t => t.id !== teamId ? t : {
      ...t,
      pendingInvites: t.pendingInvites.map(inv => inv.id === inviteId ? { ...inv, isSub } : inv),
    }));
    cloudUpdate("pending_invites", { id: inviteId }, { is_sub: isSub });
  }

  // Manual link: a team member picks any real, already-signed-up account
  // for one of their own placeholders.






  async function saveMyName() {
    const name = myNameInput.trim();
    if (!name) return;
    setEditingMyName(false);
    const { error } = await updateDisplayName(name);
    if (error) alert(error.message);
  }

  function moveMember(teamId, index, direction) {
    const newTeams = moveTeamMember(teams, teamId, index, direction);
    if (newTeams === teams) return; // out of bounds, nothing changed
    setTeams(newTeams);
    const movedTeam = newTeams.find(t => t.id === teamId);
    const newIndex = index + direction;
    cloudUpdate("team_members", { team_id: teamId, user_id: movedTeam.members[index].userId }, { lineup_position: movedTeam.members[index].lineupPosition });
    cloudUpdate("team_members", { team_id: teamId, user_id: movedTeam.members[newIndex].userId }, { lineup_position: movedTeam.members[newIndex].lineupPosition });
  }

  return (
    <div>
      {loading && (
        <div style={S.card}>
          <div style={{ color:C.textMuted, textAlign:"center", padding:"12px 0" }}>Loading teams…</div>
        </div>
      )}

      {!loading && loadError && (
        <div style={{...S.card, borderColor: C.miss}}>
          <div style={{fontSize:"13px", color:C.miss, marginBottom:"8px"}}>
            Couldn't load your teams. You may be offline.
          </div>
          <button style={S.button} onClick={() => { setLoadError(false); loadAll(); }}>
            Try again
          </button>
        </div>
      )}

      {/* Requests to join any of this bowler's teams, at the top of the tab
          rather than inside one team's card: the card shows one team at a
          time, so a request for a different team was invisible after
          tapping through from the inbox. Anyone on the team can answer. */}
      {!loading && requests.some(r => r.kind === "request" && r.mine_to_answer) && (
        <div style={{ ...S.card, border:`1px solid ${C.accent}66` }}>
          <div style={S.label}>Waiting to join your team</div>
          {requests.filter(r => r.kind === "request" && r.mine_to_answer).map(r => (
            <div key={r.id} style={{ display:"flex", alignItems:"center", gap:"8px", padding:"8px 0", borderTop:`1px solid ${C.border}` }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:"14px", color:C.text }}><strong>{r.bowler_name}</strong> wants to join {r.team_name}</div>
                <div style={{ fontSize:"11px", color:C.textMuted }}>
                  {r.league_name || ""}{r.current_team ? `${r.league_name ? " · " : ""}approving moves them off ${r.current_team}` : ""}
                </div>
              </div>
              <button style={S.primary} disabled={busyId===r.id} onClick={()=>answer(r,true)}>Approve</button>
              <button style={S.button} disabled={busyId===r.id} onClick={()=>answer(r,false)}>Decline</button>
            </div>
          ))}
        </div>
      )}

      {/* Add team. A team has to belong to a league -- scores, standings
          and side pots all hang off it -- so the league is picked first
          and Create stays off until both are there. */}
      {!loading && onCreateTeam && (
        <div style={S.card}>
          {!adding ? (
            <button style={{ ...S.primary, width: "100%", minHeight: "44px" }}
              onClick={() => { setAdding(true); setNewTeamLeague(leagues.length === 1 ? leagues[0] : ""); }}>
              + Add team
            </button>
          ) : leagues.length === 0 ? (
            <div>
              <div style={{ fontSize: "13px", color: C.textMuted, lineHeight: 1.5, marginBottom: "10px" }}>
                A team belongs to a league. Add your league on the League tab first, then come back here.
              </div>
              <button style={S.button} onClick={() => setAdding(false)}>OK</button>
            </div>
          ) : (
            <div>
              <div style={S.label}>New team</div>
              <label style={{ display: "block", fontSize: "12px", color: C.textMuted, marginBottom: "4px" }} htmlFor="new-team-league">League</label>
              <select id="new-team-league" style={{ ...S.sel, width: "100%", marginBottom: "10px" }}
                value={newTeamLeague} onChange={e => setNewTeamLeague(e.target.value)}>
                <option value="" disabled>Pick the league this team bowls in</option>
                {leagues.map(l => <option key={l} value={l}>{String(l).replace(" House Shot", "")}</option>)}
              </select>
              <label style={{ display: "block", fontSize: "12px", color: C.textMuted, marginBottom: "4px" }} htmlFor="new-team-name">Team name</label>
              <input id="new-team-name" style={{ ...S.input, marginBottom: "10px" }}
                value={newTeamName} onChange={e => setNewTeamName(e.target.value)}
                placeholder="e.g. Split Happens" />
              <div style={{ display: "flex", gap: "8px" }}>
                <button style={{ ...S.primary, flex: 1 }}
                  disabled={!newTeamLeague || !newTeamName.trim()}
                  onClick={async () => {
                    const name = newTeamName.trim();
                    if (!newTeamLeague || !name) return;
                    if (teams.some(t => t.league === newTeamLeague && t.name.toLowerCase() === name.toLowerCase())) {
                      alert("A team with that name already exists in this league.");
                      return;
                    }
                    await onCreateTeam(newTeamLeague, name);
                    setAdding(false); setNewTeamName(""); setNewTeamLeague("");
                  }}>
                  Create team
                </button>
                <button style={S.button} onClick={() => { setAdding(false); setNewTeamName(""); }}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Joining a team someone else runs: invitations waiting for this
          bowler, a team code, or finding the team in one of their leagues
          and asking. Every way in has a yes from the team or the bowler. */}
      {!loading && (() => {
        const invitesToMe = requests.filter(r => r.kind === "invite" && r.user_id === user?.id);
        const myAsks = requests.filter(r => r.kind === "request" && r.user_id === user?.id);
        const myLeagueNames = (leagues || []).filter(l => leagueIdsRef.current[l]);
        return (
          <div style={S.card}>
            <div style={S.label}>Join a team</div>

            {invitesToMe.map(r => (
              <div key={r.id} style={{ display:"flex", alignItems:"center", gap:"8px", padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:"14px", fontWeight:600, color:C.text }}>You're invited to {r.team_name}</div>
                  {r.league_name && <div style={{ fontSize:"11px", color:C.textMuted }}>{r.league_name}</div>}
                </div>
                <button style={S.primary} disabled={busyId===r.id} onClick={()=>answer(r,true)}>Join</button>
                <button style={S.button} disabled={busyId===r.id} onClick={()=>answer(r,false)}>No thanks</button>
              </div>
            ))}

            <div style={{ fontSize:"12px", color:C.textMuted, margin:"10px 0 6px" }}>
              Got a team code from a teammate? Enter it here.
            </div>
            <div style={{ display:"flex", gap:"8px" }}>
              <input id="team-join-code" style={{ ...S.input, flex:1, minWidth:0, textTransform:"uppercase", letterSpacing:"0.08em" }}
                value={joinCode} onChange={e=>{ setJoinCode(e.target.value); setJoinMsg(null); }}
                onKeyDown={e=>{ if(e.key==="Enter") joinWithCode(false); }}
                placeholder="ABCD-1234" autoCapitalize="characters" autoComplete="off" />
              <button style={S.primary} disabled={joinBusy || !joinCode.trim()} onClick={()=>joinWithCode(false)}>
                {joinBusy ? "Joining…" : "Join"}
              </button>
            </div>
            {joinMsg && (
              <div style={{ fontSize:"12px", marginTop:"6px", color: joinMsg.ok ? C.accent : C.danger }}>{joinMsg.text}</div>
            )}

            {myLeagueNames.length > 0 && (
              <div style={{ marginTop:"14px", paddingTop:"12px", borderTop:`1px solid ${C.border}` }}>
                <div style={{ fontSize:"12px", color:C.textMuted, marginBottom:"6px" }}>
                  No code? Find your team in your league and ask to join. Anyone on the team can approve you.
                </div>
                <select id="team-find-league" style={{ ...S.sel, width:"100%" }}
                  value={findLeague} onChange={e=>{ if(e.target.value) loadLeagueTeams(e.target.value); else { setFindLeague(""); setLeagueTeams(null); } }}>
                  <option value="">Pick a league</option>
                  {myLeagueNames.map(l => <option key={l} value={l}>{String(l).replace(" House Shot","")}</option>)}
                </select>
                {findLeague && leagueTeams === null && (
                  <div style={{ fontSize:"12px", color:C.textMuted, marginTop:"8px" }}>Looking…</div>
                )}
                {findLeague && Array.isArray(leagueTeams) && leagueTeams.length === 0 && (
                  <div style={{ fontSize:"12px", color:C.textMuted, marginTop:"8px" }}>
                    No teams in this league yet. You can make one with Add team.
                  </div>
                )}
                {Array.isArray(leagueTeams) && leagueTeams.map(t => (
                  <div key={t.id} style={{ display:"flex", alignItems:"center", gap:"8px", padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:"14px", color:C.text }}>{t.name}</div>
                      <div style={{ fontSize:"11px", color:C.textMuted }}>{t.bowlers} {t.bowlers===1?"bowler":"bowlers"}</div>
                    </div>
                    {t.is_member ? (
                      <span style={{ fontSize:"12px", color:C.accent }}>Your team</span>
                    ) : t.requested ? (
                      <span style={{ fontSize:"12px", color:C.textMuted }}>Asked</span>
                    ) : (
                      <button style={S.button} disabled={busyId===t.id} onClick={()=>askToJoin(t)}>Ask to join</button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {myAsks.map(r => (
              <div key={r.id} style={{ display:"flex", alignItems:"center", gap:"8px", paddingTop:"10px" }}>
                <div style={{ flex:1, minWidth:0, fontSize:"12px", color:C.textMuted }}>
                  Asked to join {r.team_name} — waiting for someone on the team to approve.
                </div>
                <button style={S.button} disabled={busyId===r.id} onClick={()=>answer(r,false)}>Withdraw</button>
              </div>
            ))}
          </div>
        );
      })()}

      {!loading && !loadError && teams.length===0 && !adding && (
        <div style={S.card}>
          <div style={{color:C.textMuted,textAlign:"center",padding:"12px 0"}}>
            No teams yet. Tap Add team, or add one under a league on the League tab.
          </div>
        </div>
      )}

      {/* Every team, not just one league's. The league dropdown that used
          to scope this list is gone: picking a league now happens in the
          Leagues card above, where teams are created, so a second picker
          here was a way to end up looking at a different league than the
          one you just added a team to. */}
      {/* One team at a time, chosen from a dropdown. */}
      {teams.length > 1 && (
        <div style={S.card}>
          <div style={S.label}>Team</div>
          <select style={{ ...S.sel, width: "100%" }}
            value={shownTeam?.id || ""}
            onChange={e => setShownTeamId(e.target.value)}>
            {teams.map(t => (
              <option key={t.id} value={t.id}>
                {t.name}{t.league ? ` — ${String(t.league).replace(" House Shot", "")}` : ""}
              </option>
            ))}
          </select>
        </div>
      )}

      {[shownTeam].filter(Boolean).map(team => (
        <div key={team.id} ref={team.id===focusTeamId?focusedTeamRef:null} style={{
          ...S.card,
          // A brief outline on the team you just made, so it's obvious
          // which one the page jumped to.
          ...(team.id===focusTeamId?{border:`1px solid ${C.accent}66`}:{}),
        }}>
          {editingTeamId===team.id ? (
            <div>
              <div style={S.label}>Team Name</div>
              <div style={{display:"flex",gap:"8px"}}>
                <input value={editingName} onChange={e=>setEditingName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")saveRename(team.id);}} autoFocus style={{...S.input,flex:1}}/>
                <button style={S.primary} onClick={()=>saveRename(team.id)}>Save</button>
                <button style={S.button} onClick={()=>{setEditingTeamId(null);setEditingName("");}}>Cancel</button>
              </div>
            </div>
          ) : (
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px"}}>
              <div>
                <div style={{fontSize:"18px",fontWeight:700,color:C.text}}>{team.name}</div>
                <div style={{fontSize:"11px",color:C.textMuted,marginTop:"3px"}}>
                  {team.league?`${String(team.league).replace(" House Shot","")} · `:""}
                  {team.members.length} {team.members.length===1?"bowler":"bowlers"}
                </div>
              </div>
              <div style={{display:"flex",gap:"6px"}}>
                <button style={S.button} onClick={()=>startRename(team)}>Rename</button>
                <button style={{...S.button,color:C.danger}} onClick={()=>deleteTeam(team.id)}>Delete</button>
              </div>
            </div>
          )}

          {team.joinCode && (
            <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"12px", padding:"10px 12px", borderRadius:"10px", border:`1px dashed ${C.border}` }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:"11px", color:C.textMuted }}>Team code — text it to teammates so they can join</div>
                <div style={{ fontSize:"18px", fontWeight:700, letterSpacing:"0.12em", color:C.text, fontVariantNumeric:"tabular-nums", whiteSpace:"nowrap" }}>{team.joinCode}</div>
              </div>
              <button style={S.button} onClick={()=>copyCode(team)}>{copiedTeamId===team.id ? "Copied" : "Copy"}</button>
              <button style={S.button} onClick={()=>newCode(team)} title="Make a new code; the old one stops working">New</button>
            </div>
          )}

          <div style={S.label}>Roster / Bowling Order</div>
          {/* Directive, not a dead statement.

              This is the exact moment Focus group Finding 2 records people
              abandoning -- 11 of 31 -- and "No bowlers assigned." told
              them a fact rather than what to do, or that stopping here was
              fine. It is fine: the team works with just you on it, and
              every teammate can be added later. Saying so removes the
              sense that setup is unfinished. */}
          {team.members.length===0 && team.pendingInvites.length===0 && (
            <div style={{color:C.textMuted,fontSize:"12px",padding:"6px 0 12px",lineHeight:1.5}}>
              Just you so far — add teammates below, or leave it and come back to it.
              Your scores count either way.
            </div>
          )}
          {team.members.map((member, index) => (
            <div key={member.userId} style={{display:"flex",alignItems:"center",gap:"8px",padding:"8px 0",borderTop:`1px solid ${C.border}`}}>
              <div style={{width:"24px",color:C.textMuted,fontWeight:700}}>{index+1}.</div>
              <div style={{flex:1,color:C.text}}>{member.displayName}</div>
              <button style={{...S.button,minWidth:"28px"}} title="Bowling hand — tap to switch"
                onClick={()=>setMemberHandedness(team.id,member.userId,!member.leftHanded)}><span data-i18n="hand">{member.leftHanded?"L":"R"}</span></button>
              {/* C.text, not undefined, for the off state.

                  `color: undefined` spread AFTER S.button does not mean
                  "leave S.button's colour alone" -- it overrides it, and
                  React then omits the colour from the inline style
                  entirely. The button falls back to the browser's default
                  button text, which is near-black, so on every dark theme
                  this read as dark-on-dark while the L/R button beside it
                  -- which overrides nothing -- stayed legible.

                  Not a contrast problem: every theme scores above 14:1
                  for text on surface. The colour simply was not applied. */}
              <button style={{...S.button,color:member.isSub?C.accent:C.text}} title="Sub — tap to toggle"
                onClick={()=>setMemberIsSub(team.id,member.userId,!member.isSub)}>{member.isSub?"Sub ✓":"Sub"}</button>
              <button style={S.button} disabled={index===0} onClick={()=>moveMember(team.id,index,-1)}>↑</button>
              <button style={S.button} disabled={index===team.members.length-1} onClick={()=>moveMember(team.id,index,1)}>↓</button>
              <button style={{...S.button,color:C.danger}} onClick={()=>removeMember(team.id,member.userId)}>×</button>
            </div>
          ))}
          {team.pendingInvites.map(invite => (
            <div key={invite.id} style={{padding:"8px 0",borderTop:`1px solid ${C.border}`}}>
              <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                <div style={{width:"24px"}}></div>
                <div style={{flex:1}}>
                  <div>
                    <div style={{color:C.textMuted,fontStyle:"italic"}}>{invite.name}</div>
                    {/* The code, big enough to read off a phone and copy
                        into a text. Shown until it's claimed. */}
                    {invite.signupCode&&(
                      <div style={{marginTop:"3px",display:"flex",alignItems:"center",gap:"6px"}}>
                        <span style={{
                          fontFamily:"monospace",fontSize:"13px",fontWeight:700,
                          letterSpacing:"1px",color:C.accent,
                        }}>{invite.signupCode}</span>
                        <button
                          onClick={()=>textInviteCode(`Join our team on ${APP_NAME} — sign up and enter code ${invite.signupCode}`)}
                          style={{...S.button,padding:"3px 8px",fontSize:"10px",color:C.accent,borderColor:C.accent}}>
                          Text
                        </button>
                        <button
                          onClick={()=>{
                            const msg=`Join our team on ${APP_NAME} — sign up and enter code ${invite.signupCode}`;
                            try{navigator.clipboard?.writeText(msg);}catch{}
                          }}
                          style={{...S.button,padding:"3px 8px",fontSize:"10px"}}>
                          Copy
                        </button>
                      </div>
                    )}
                  </div>
                  <div style={{color:C.textMuted,fontSize:"10px"}}>
                    {invite.email ? "invited · not signed in yet" : "placeholder · no email on file"}
                  </div>
                </div>
                <button style={{...S.button,minWidth:"28px"}} title="Bowling hand — tap to switch"
                  onClick={()=>setInviteHandedness(team.id,invite.id,!invite.leftHanded)}><span data-i18n="hand">{invite.leftHanded?"L":"R"}</span></button>
                {/* Same fix as the roster row above -- see the note there.
                    An undefined colour is an override, not an absence. */}
                <button style={{...S.button,color:invite.isSub?C.accent:C.text}} title="Sub — tap to toggle"
                  onClick={()=>setInviteIsSub(team.id,invite.id,!invite.isSub)}>{invite.isSub?"Sub ✓":"Sub"}</button>
                <button style={{...S.button,color:C.danger}} onClick={()=>cancelInvite(team.id,invite.id)}>×</button>
              </div>
            </div>
          ))}

          <div style={{marginTop:"12px",paddingTop:"12px",borderTop:`1px solid ${C.border}`}}>
            {/* No name search here any more. Searching every display name on
                the app for "Ryan" is not a way to find a teammate; the team
                code above is. Invitations already sent before this change
                still show, so they can be withdrawn. */}
            {requests.filter(r => r.team_id === team.id && r.kind === "invite").map(r => (
              <div key={r.id} style={{display:"flex",alignItems:"center",gap:"8px",padding:"4px 0"}}>
                <span style={{flex:1,minWidth:0,fontSize:"12px",color:C.textMuted}}>{r.bowler_name} — invited, waiting for them to accept</span>
                <button style={S.button} disabled={busyId===r.id} onClick={()=>answer(r,false)}>Withdraw</button>
              </div>
            ))}

            <div>
              {/* Email is required here.
              
                  It's the only link between this placeholder and the
                  account the person eventually makes: they sign up, see
                  the invite, and accept it. There used to be a "Link
                  Account" button that searched every profile on the app
                  and joined one to this spot -- which let a captain add
                  anyone at all to their roster without that person
                  knowing, and team membership grants read access to
                  their sessions and shots. */}
              <div style={S.label}>Add Someone Not Signed Up Yet</div>
              <div style={{fontSize:"11px",color:C.textMuted,marginBottom:"8px"}}>
                Reserves their spot on the roster now — you can start logging their scores under their name right away via Who's Bowling, no account needed yet. Either way they claim the spot themselves and everything you've logged is already there: with a code, you get one to text them and they enter it when they sign up; with their email, they're linked the moment they sign in with that exact address.
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
                <input
                  value={inviteForm[team.id]?.name || ""}
                  onChange={e=>setInviteForm(prev=>({...prev,[team.id]:{...prev[team.id],name:e.target.value}}))}
                  placeholder="Their name"
                  style={S.input}
                />
                {/* Two equal buttons, not a field plus an afterthought.

                    Focus group Finding 2: only 7 of 22 noticed the code
                    option, because it sat BELOW the email field as a
                    single line of muted text. Anything under a filled-in
                    input reads as a footnote to it -- people had already
                    committed to typing an email before they saw there was
                    a choice. Presenting both first makes it a decision
                    rather than an escape hatch.

                    A captain standing at the lanes with four teammates
                    and two email addresses needs the second option to be
                    as visible as the first. */}
                <div style={{display:"flex",gap:"8px"}}>
                  {/* Code first, and the default: at the lanes a captain
                      rarely has everyone's email, and a code can go in a
                      text straight away. */}
                  {[
                    {code:true, label:"Text them a code"},
                    {code:false,label:"I have their email"},
                  ].map(opt=>{
                    const on=(inviteForm[team.id]?.useCode!==false)===opt.code;
                    return (
                      <button key={String(opt.code)}
                        onClick={()=>setInviteForm(prev=>({...prev,[team.id]:{
                          ...prev[team.id],useCode:opt.code,email:"",
                        }}))}
                        style={{
                          flex:1,textAlign:"center",padding:"10px 8px",borderRadius:"8px",
                          cursor:"pointer",fontSize:"12px",fontWeight:on?700:500,
                          border:`1px solid ${on?C.accent:C.border}`,
                          background:on?C.accent+"11":"transparent",
                          color:on?C.accent:C.textMuted,
                          WebkitTapHighlightColor:"transparent",
                        }}>
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                {inviteForm[team.id]?.useCode===false && (
                  <input
                    value={inviteForm[team.id]?.email || ""}
                    onChange={e=>setInviteForm(prev=>({...prev,[team.id]:{...prev[team.id],email:e.target.value}}))}
                    placeholder="Their email"
                    type="email"
                    style={S.input}
                  />
                )}
                {inviteForm[team.id]?.useCode!==false && (
                  <div style={{fontSize:"11px",color:C.textMuted}}>
                    They will get a code to enter when they sign up. It links them to this spot the same way an email invite does.
                  </div>
                )}

                <button style={S.primary} onClick={()=>createInvite(team.id)}>Add to Roster</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
