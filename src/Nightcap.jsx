// The Nightcap — what tonight was, read back on the way out.
//
// Sits at the top of the league results card, above the scores, because
// it is the thing worth reading and a bowler should not have to scroll
// for it after a three-hour night.
//
// The facts are computed in src/domain/nightcap.js, where they can be
// tested. This component renders, calls, caches and handles failure. It
// computes nothing.

import { useState, useRef, useEffect, useMemo } from "react";
import { C, S } from "./ui.jsx";
import { supabase } from "./supabaseClient.js";
import { nightcapPayload } from "./domain/nightcap.js";
import { canPourNightcap, BILLING_LIVE } from "./domain/entitlements.js";

// Cached per night AND per set of facts.
//
// The night alone is not enough. A bowler who pours the nightcap and then
// fixes a mis-logged frame would keep being shown the version written
// from the wrong frame, with no way to tell it was stale and no way to
// clear it. The fingerprint changes when the facts do, so an edit is a
// cache miss and a correction rather than a wrong card that persists.
//
// The cache is not an optimisation either. The results card remounts
// every time the bowler leaves the Bowl tab and comes back, and an effect
// that fired on every mount would bill a call each time for a night whose
// facts have not changed.
const cacheKey = (bowler, league, date, fingerprint) =>
  `nightcap:${bowler}|${league}|${date}|${fingerprint}`;

// A cached or returned nightcap, checked before it reaches the renderer.
//
// Cached JSON has been on a device across app versions and can be
// anything by the time it comes back; a server response is validated at
// the far end but arrives over a network. React throws if handed an
// object where it expects a string, and that throw takes the whole
// results screen with it -- so a malformed nightcap has to degrade to no
// nightcap, not to a blank app.
function sane(result) {
  if (!result || typeof result !== "object") return null;
  const str = (v, cap) => (typeof v === "string" && v.trim() ? v.trim().slice(0, cap) : null);
  const notes = (Array.isArray(result.notes) ? result.notes : [])
    .map(n => str(n, 400)).filter(Boolean).slice(0, 3);
  if (!notes.length) return null;
  return {
    opener: str(result.opener, 300) || "",
    notes,
    nudge: str(result.nudge, 300),
  };
}

async function readCache(key) {
  try {
    const row = await window.storage?.get(key);
    return row?.value ? sane(JSON.parse(row.value)) : null;
  } catch { return null; }
}

async function writeCache(key, value) {
  try { await window.storage?.set(key, JSON.stringify(value)); } catch { /* the cache is a nicety */ }
}

export default function Nightcap({
  shots, bowler, league, date, leftHanded = false,
  scores = [], priorAverage = null, pinsLeftOnLane = null,
  // The night is filed -- there is a saved session for it. This is the
  // durable "the night is over" signal, unlike the save confirmation
  // flag, which is true for a second and a half and then sends the
  // bowler to Home.
  sessionEnded = false,
  entitlement = null,
}) {
  const [state, setState] = useState({ status: "idle", result: null, error: null });

  // Memoised, and this one matters.
  //
  // nightcapPayload walks the bowler's WHOLE history in this league to
  // build the season comparison. This component renders inside the
  // results block, which re-renders on every keystroke elsewhere in
  // LogView -- so without this, a bowler four years into a league is
  // re-scanning tens of thousands of shot rows on every character they
  // type into a note, on a phone. That is not a slow card; that is the
  // screen locking up.
  //
  // scores is an array prop with a fresh identity each render, so it is
  // depended on by value rather than by reference.
  const scoreKey = (Array.isArray(scores) ? scores : []).join(",");
  const payload = useMemo(
    () => nightcapPayload(shots, { bowler, league, date, leftHanded, scores, priorAverage, pinsLeftOnLane }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [shots, bowler, league, date, leftHanded, scoreKey, priorAverage, pinsLeftOnLane],
  );

  const allowed = canPourNightcap(entitlement);
  const ck = payload ? cacheKey(bowler, league, date, payload.fingerprint) : null;

  // One attempt per distinct night-and-facts. Not a bare boolean:
  // scoring a second bowler on the same phone is a different night's
  // worth of shots and deserves its own pour.
  const attempted = useRef(null);
  // Stops a double tap, or a tap landing on top of the automatic pour,
  // from buying the same nightcap twice.
  const inFlight = useRef(false);

  async function pour(force = false) {
    // supabase is null under test, where every component is rendered to
    // prove it does not throw. Calling into it there would fail the
    // render rather than the network.
    if (!supabase || !payload || !ck) return;
    if (inFlight.current) return;
    if (!force) {
      const cached = await readCache(ck);
      if (cached) { setState({ status: "done", result: cached, error: null }); return; }
    }
    inFlight.current = true;
    setState({ status: "loading", result: null, error: null });
    try {
      const { data, error } = await supabase.functions.invoke("nightcap", { body: { payload } });
      if (error) {
        // supabase-js v2 collapses every non-2xx into an opaque error and
        // hangs the real body off error.context. Without reading it, a
        // transient hiccup and a permanently broken deploy read
        // identically to the bowler -- which is how "try again" stopped
        // being offered for a problem a second tap would have fixed.
        let message = "";
        try {
          const res = error?.context;
          if (res && typeof res.json === "function") {
            const body = await res.json();
            if (body?.error) message = body.error;
          }
        } catch { /* body wasn't JSON; the status is all we have */ }
        const raw = message || error.message || "";
        if (/failed to send a request|failed to fetch|networkerror/i.test(raw)) {
          setState({ status: "error", result: null,
            error: "No signal for this one. It'll still be here when you're back online." });
          return;
        }
        setState({ status: "error", result: null,
          error: raw || "Couldn't pour the nightcap just then. Tap to try again." });
        return;
      }
      if (data?.error) {
        setState({ status: "error", result: null, error: data.error });
        return;
      }
      const ok = sane(data);
      if (!ok) {
        setState({ status: "error", result: null,
          error: "That nightcap came back in a shape the app couldn't read. Tap to try again." });
        return;
      }
      setState({ status: "done", result: ok, error: null });
      writeCache(ck, ok);
    } catch (e) {
      setState({ status: "error", result: null,
        error: e?.message || "Couldn't pour the nightcap just then. Tap to try again." });
    } finally {
      inFlight.current = false;
    }
  }

  // Shows a cached pour instantly, and pours once the night is filed.
  //
  // Keyed on the cache key, which carries both the night and the facts.
  // So switching to another bowler, or correcting a frame, clears what is
  // on screen rather than leaving one bowler looking at another's card --
  // which is what happened when this was keyed on mount alone.
  //
  // Deliberately NOT triggered by a scorecard that merely looks complete:
  // mid-night, games one and two are scored and game three has not
  // started, which looks finished and is not.
  //
  // A failure is not retried automatically. The button below is how a
  // bowler asks again; a component that re-requested on every mount after
  // a server error would spend money in a loop nobody can see.
  useEffect(() => {
    if (!ck || !allowed) return;
    if (attempted.current === ck) return;
    let live = true;
    // Whatever is on screen belongs to the previous night or the previous
    // version of this one. Clear it before anything async starts.
    setState({ status: "idle", result: null, error: null });
    (async () => {
      const cached = await readCache(ck);
      if (!live) return;
      if (cached) { attempted.current = ck; setState({ status: "done", result: cached, error: null }); return; }
      if (!sessionEnded) return;
      attempted.current = ck;
      pour(true);
    })();
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ck, allowed, sessionEnded]);

  // Nothing logged, or not enough of it. No card at all rather than an
  // empty one: a bowler who only kept score has not opted into any of
  // this and should not be shown a box explaining what they are missing.
  if (!payload) return null;

  const card = {
    ...S.card,
    border: `1px solid ${C.accent}66`,
    backgroundColor: C.accent + "0D",
  };

  // Locked, not hidden. The fact count is real -- their shots, tonight --
  // and stopping one sentence short of saying what it found is the only
  // honest version of a paywall. Never shown while there is nothing to
  // buy, which is the state the app ships in.
  if (!allowed && BILLING_LIVE) {
    return (
      <div style={card}>
        <div style={{ ...S.label, color: C.accent }}>Nightcap 🥃</div>
        <div style={{ fontSize: "13px", color: C.text, marginBottom: "6px" }}>
          There are {payload.facts.length} things worth saying about tonight.
        </div>
        <div style={{ fontSize: "12px", color: C.textMuted }}>
          The Nightcap reads your night back to you — where the leaves sat, what the
          opens cost, which ball was carrying. Part of the paid plan.
        </div>
      </div>
    );
  }

  return (
    <div style={card}>
      <div style={{ ...S.label, color: C.accent, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>Nightcap 🥃</span>
        {state.status === "done" && (
          <button
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer",
                     fontSize: "11px", color: C.textMuted, fontWeight: 400 }}
            onClick={() => pour(true)}>
            Pour another
          </button>
        )}
      </div>

      {state.status === "idle" && (
        <>
          <div style={{ fontSize: "12px", color: C.textMuted, marginBottom: "8px" }}>
            {payload.facts.length} things were true about tonight. Here are the two or three worth hearing.
          </div>
          <button style={{ ...S.btn(), width: "100%", fontSize: "13px" }} onClick={() => pour(false)}>
            Pour the nightcap
          </button>
        </>
      )}

      {state.status === "loading" && (
        <div style={{ fontSize: "13px", color: C.textMuted, padding: "6px 0" }}>
          Reading back the night…
        </div>
      )}

      {state.status === "error" && (
        <>
          <div style={{ fontSize: "13px", color: C.miss, marginBottom: "8px" }}>
            {state.error}
          </div>
          <button style={{ ...S.btn(), width: "100%", fontSize: "13px" }} onClick={() => pour(true)}>
            Try again
          </button>
        </>
      )}

      {state.status === "done" && state.result && (
        <>
          {state.result.opener && (
            <div style={{ fontSize: "14px", color: C.text, fontWeight: 600, marginBottom: "10px", lineHeight: 1.4 }}>
              {state.result.opener}
            </div>
          )}
          {state.result.notes.map((n, i) => (
            <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start", marginBottom: "8px" }}>
              <span style={{ color: C.accent, lineHeight: 1.5, flexShrink: 0 }}>•</span>
              <span style={{ fontSize: "13px", color: C.text, lineHeight: 1.5 }}>{n}</span>
            </div>
          ))}
          {state.result.nudge && (
            <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: `1px solid ${C.border}`,
                          fontSize: "13px", color: C.spare, lineHeight: 1.5 }}>
              {state.result.nudge}
            </div>
          )}
          {/* What it was drawn from. Conclusions with no visible basis are
              what makes a bowler stop believing the app, and this is one
              line. It also says exactly how far back the comparison
              reaches, so "more than usual" is never something the bowler
              has to take on trust. */}
          <div style={{ fontSize: "10px", color: C.textMuted, marginTop: "10px" }}>
            {payload.firstBalls} first balls across {payload.games} game{payload.games === 1 ? "" : "s"}
            {payload.hasSeason
              ? `, against ${payload.seasonNights} earlier nights in this league.`
              : " — tonight only."}
          </div>
        </>
      )}
    </div>
  );
}
