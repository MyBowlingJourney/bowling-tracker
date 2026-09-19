// The Nightcap — what tonight was, read back on the way out.
//
// Sits at the top of the league results card, above the scores, because
// it is the thing worth reading and a bowler should not have to scroll
// for it after a three-hour night.
//
// The facts are computed in src/domain/nightcap.js, where they can be
// tested. This component renders, calls, caches and handles failure. It
// computes nothing.

import { useState, useRef, useEffect } from "react";
import { C, S } from "./ui.jsx";
import { supabase } from "./supabaseClient.js";
import { nightcapPayload } from "./domain/nightcap.js";
import { canPourNightcap, BILLING_LIVE } from "./domain/entitlements.js";

// Cached per night, in the same user-scoped storage everything else uses.
//
// Not an optimisation. The results card remounts every time the bowler
// leaves the Bowl tab and comes back, and an effect that fires on mount
// would bill a Gemini call each time -- for a night whose facts cannot
// have changed, since the session is already filed. One pour per night,
// and "Pour another" is the only way to spend again.
const cacheKey = (bowler, league, date) => `nightcap:${bowler}|${league}|${date}`;

async function readCache(key) {
  try {
    const row = await window.storage?.get(key);
    return row?.value ? JSON.parse(row.value) : null;
  } catch { return null; }
}

async function writeCache(key, value) {
  try { await window.storage?.set(key, JSON.stringify(value)); } catch { /* cache is a nicety */ }
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
  // One pour per night, tracked by the night's own key rather than a bare
  // boolean: scoring a second bowler on the same phone is a different
  // night's worth of shots and deserves its own.
  const attempted = useRef(null);
  const key = `${bowler}|${league}|${date}`;

  const payload = nightcapPayload(shots, {
    bowler, league, date, leftHanded, scores, priorAverage, pinsLeftOnLane,
  });

  const allowed = canPourNightcap(entitlement);

  async function pour(force = false) {
    // supabase is null under test, where every component is rendered to
    // prove it does not throw. Calling into it there would fail the
    // render rather than the network.
    if (!supabase || !payload) return;
    const ck = cacheKey(bowler, league, date);
    if (!force) {
      const cached = await readCache(ck);
      if (cached) { setState({ status: "done", result: cached, error: null }); return; }
    }
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
      setState({ status: "done", result: data, error: null });
      writeCache(ck, data);
    } catch (e) {
      setState({ status: "error", result: null,
        error: e?.message || "Couldn't pour the nightcap just then. Tap to try again." });
    }
  }

  // Pours itself once the night is filed, and shows a cached pour
  // instantly on every visit after that.
  //
  // Deliberately NOT keyed on a scorecard that looks complete: mid-night,
  // games one and two are scored and game three has not started, which
  // looks finished and is not. A filed session is unambiguous.
  //
  // A failure is not retried automatically -- the button below is how a
  // bowler asks again, and a component that re-requests on every mount
  // after a server error spends money in a loop nobody can see.
  useEffect(() => {
    if (!allowed || !payload) return;
    if (attempted.current === key) return;
    let live = true;
    (async () => {
      const cached = await readCache(cacheKey(bowler, league, date));
      if (!live) return;
      if (cached) { attempted.current = key; setState({ status: "done", result: cached, error: null }); return; }
      if (!sessionEnded) return;
      attempted.current = key;
      pour(true);
    })();
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionEnded, allowed, key, !!payload]);

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
          {(Array.isArray(state.result.notes) ? state.result.notes : []).map((n, i) => (
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
              line. It also says out loud that nothing here spans more
              than tonight. */}
          <div style={{ fontSize: "10px", color: C.textMuted, marginTop: "10px" }}>
            From tonight only — {payload.firstBalls} first balls across {payload.games} game
            {payload.games === 1 ? "" : "s"}.
          </div>
        </>
      )}
    </div>
  );
}
