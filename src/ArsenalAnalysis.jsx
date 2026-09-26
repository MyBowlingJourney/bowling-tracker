import { useEffect, useMemo, useRef, useState } from "react";
import { C, S, F, Chip, LockedNote, AiNote } from "./ui.jsx";
import {
  placeArsenal, findGaps, fillCandidates, compareBags,
  MAP_VIEWS, pointFor,
} from "./domain/arsenalMap.js";
import { buildCaddiePayload, normalizeCaddieReply } from "./domain/caddie.js";
import { ballComparison } from "./domain/ballComparison.js";
import { bestEntry } from "./domain/ballCatalog.js";
import { describeSpecs } from "./domain/ballSpecs.js";
import { formatLayout } from "./domain/layouts.js";
import { ballsByBagFor } from "./domain/bags.js";
import { isSplit, isCornerPinLeave } from "./domain/splits.js";
import { featureUnlocked } from "./domain/entitlements.js";
import { friendlyFunctionError, readFunctionFailure, failureDetail } from "./domain/functionErrors.js";
import { recordError } from "./errorLogStore.js";
import { aiLanguage } from "./i18n/index.js";
import { supabase } from "./supabaseClient.js";

// Arsenal analysis, and the Caddie.
//
// Every ball placed on a chart by what its specs, surface and layout say
// it should do -- how strong, how early, how sharp -- next to what it has
// actually scored. The same for each bag, bags side by side, and what the
// arsenal is missing. The numbers come from domain/arsenalMap.js; the
// Caddie (an AI read, Pro) turns them into advice.

// One colour per cover, so a glance says which balls are pearls.
const COVER_COLORS = { solid: "#c2504a", hybrid: "#7a6ff0", pearl: "#3aa9a3" };
const coverColor = c => COVER_COLORS[c] || C.textMuted;
const BAG_COLORS = ["#2f7ed8", "#e07b39"];
const PHASE_LABEL = { fresh: "fresh", transition: "transition", late: "late" };

const cacheKey = fp => `caddie:${fp}${aiLanguage() === "en" ? "" : "|" + aiLanguage()}`;
async function readCache(key) {
  try { const row = await window.storage?.get(key); return row?.value ? normalizeCaddieReply(JSON.parse(row.value)) : null; }
  catch { return null; }
}
async function writeCache(key, value) {
  try { await window.storage?.set(key, JSON.stringify(value)); } catch { /* a nicety */ }
}

// The chart. Plain SVG: every dot is a ball, labelled, with the axis
// words at the ends rather than numbers -- the numbers are estimates and
// the words are what they mean.
function ArsenalChart({ balls, view, selected, onSelect, colorFor, ringFor }) {
  const W = 320, H = 300, pad = { l: 28, r: 12, t: 14, b: 30 };
  const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
  const pts = balls.map(b => ({ b, p: pointFor(b, view) })).filter(x => x.p);
  const X = v => pad.l + (v / 100) * iw;
  const Y = v => pad.t + (1 - v / 100) * ih;
  // Labels placed after the dots, nudged apart so two balls with close
  // numbers don't print on top of each other.
  const labels = [];
  for (const { b, p } of [...pts].sort((a, c) => c.p.y - a.p.y)) {
    let ly = Y(p.y) - 9;
    for (const l of labels) if (Math.abs(l.x - X(p.x)) < 70 && Math.abs(l.y - ly) < 11) ly = l.y - 11;
    labels.push({ x: X(p.x), y: Math.max(pad.t + 8, ly), name: b.name });
  }
  return (
    <div style={{ width: "100%", maxWidth: "520px", margin: "0 auto" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img"
        aria-label={`${view.label}: ${pts.map(x => x.b.name).join(", ")}`}>
        <rect x={pad.l} y={pad.t} width={iw} height={ih} fill="none" stroke={C.border} />
        <line x1={X(50)} y1={pad.t} x2={X(50)} y2={pad.t + ih} stroke={C.border} strokeDasharray="3 4" />
        <line x1={pad.l} y1={Y(50)} x2={pad.l + iw} y2={Y(50)} stroke={C.border} strokeDasharray="3 4" />
        <text x={pad.l} y={H - 10} fontSize="9" fill={C.textMuted}>{view.x.low}</text>
        <text x={pad.l + iw} y={H - 10} fontSize="9" fill={C.textMuted} textAnchor="end">{view.x.high}</text>
        <text x={10} y={pad.t + ih} fontSize="9" fill={C.textMuted} transform={`rotate(-90 10 ${pad.t + ih})`}>{view.y.low}</text>
        <text x={10} y={pad.t} fontSize="9" fill={C.textMuted} textAnchor="end" transform={`rotate(-90 10 ${pad.t})`}>{view.y.high}</text>
        {pts.map(({ b, p }) => {
          const r = 5 + p.size * 7;
          const sel = selected === b.name;
          const ring = ringFor ? ringFor(b) : null;
          return (
            <g key={b.name} onClick={() => onSelect(sel ? "" : b.name)} style={{ cursor: "pointer" }}>
              {ring && <circle cx={X(p.x)} cy={Y(p.y)} r={r + 4} fill="none" stroke={ring} strokeWidth="2" />}
              <circle cx={X(p.x)} cy={Y(p.y)} r={r} fill={colorFor(b)} fillOpacity={b.confidence < 0.7 ? 0.45 : 0.9}
                stroke={sel ? C.text : C.bg} strokeWidth={sel ? 2.5 : 1} />
            </g>
          );
        })}
        {labels.map(l => (
          <text key={l.name} x={Math.min(Math.max(l.x, pad.l + 30), pad.l + iw - 30)} y={l.y} fontSize="9.5"
            fill={selected === l.name ? C.text : C.textMuted} textAnchor="middle"
            fontWeight={selected === l.name ? 700 : 400}>
            {l.name.length > 16 ? l.name.slice(0, 15) + "…" : l.name}
          </text>
        ))}
      </svg>
    </div>
  );
}

// A finding, in words.
function gapText(g) {
  switch (g.id) {
    case "noSpare": return "No spare ball. A plastic ball goes straight at corner pins without hooking.";
    case "missingSpecs": return `${g.balls.join(", ")}: no cover or core entered yet, so ${g.balls.length === 1 ? "it can't" : "they can't"} be placed.`;
    case "noHeavyOil": return "Nothing strong enough for heavy oil or a fresh pattern.";
    case "noDryLanes": return "Nothing weak enough for dry lanes or late in a block when the lanes burn up.";
    case "noSharp": return "No ball with a sharp, angular back end for when you need it to turn the corner.";
    case "noSmooth": return "No smooth, controllable ball for when the back end is too strong.";
    case "ladderGap": return `A big step down from ${g.above} to ${g.below}: a condition between them has no ball.`;
    case "overlap": return `${g.a} and ${g.b} sit almost on top of each other. They do the same job.`;
    default: return "";
  }
}

export default function ArsenalAnalysis({
  bowler = "", balls = [], retired = {}, ballSpecs = {}, ballLayouts = {},
  bags = [], ballBags = {}, shots = [], sessions = [], gameEquipment = {},
  catalogEntries = {}, entitlement = null, leftHanded = false, twoHanded = false,
  onUpgrade,
}) {
  const [scope, setScope] = useState("all"); // "all", a bag id, or "compare"
  const [viewId, setViewId] = useState("motion");
  const [selected, setSelected] = useState("");
  const [compareIds, setCompareIds] = useState([]);
  const view = MAP_VIEWS.find(v => v.id === viewId) || MAP_VIEWS[0];

  const active = useMemo(() => (balls || []).filter(b => !retired?.[b]), [balls, retired]);
  const myBags = useMemo(() => (bags || []).filter(b => b && (!b.bowlerName || b.bowlerName === bowler)), [bags, bowler]);
  const byBag = useMemo(() => ballsByBagFor(ballBags, bowler, active), [ballBags, bowler, active]);

  // Every ball placed, with strike % attached where frames were logged.
  const placed = useMemo(() => {
    const { balls: list, overallAverage } = placeArsenal({
      balls: active, bowler, ballSpecs, ballLayouts, shots, sessions, gameEquipment,
    });
    const strike = new Map(ballComparison(shots, { bowler, isSplit, isCornerPinLeave, leftHanded, minShots: 0 })
      .map(c => [c.ball, c]));
    return {
      overallAverage,
      balls: list.map(b => ({ ...b, strikePct: strike.get(b.name)?.strikeRate ?? null, firstBalls: strike.get(b.name)?.shots ?? null })),
    };
  }, [active, bowler, ballSpecs, ballLayouts, shots, sessions, gameEquipment, leftHanded]);

  const catalog = useMemo(() => Object.values(catalogEntries || {})
    .map(entries => bestEntry(entries)).filter(Boolean)
    .map(e => ({ ballName: e.ballName, brand: e.brand, specs: e.specs })), [catalogEntries]);

  const inScope = useMemo(() => {
    if (scope === "all" || scope === "compare") return placed.balls;
    const names = new Set(byBag[scope] || []);
    return placed.balls.filter(b => names.has(b.name));
  }, [scope, placed, byBag]);

  // A bag set up to carry a plastic ball has its spare, whether or not
  // the plastic ball is in the arsenal list.
  const gapsFor = (list, bag) => findGaps(list).filter(g => !(g.id === "noSpare" && bag?.includesPlastic));
  const gaps = useMemo(() => gapsFor(scope === "compare" ? placed.balls : inScope,
    myBags.find(b => b.id === scope)), [scope, inScope, placed, myBags]);
  const candidates = useMemo(() => {
    const out = [];
    for (const g of gaps) {
      for (const c of fillCandidates(g, placed.balls, catalog, active, 2)) out.push({ gapId: g.id, ...c });
    }
    return out;
  }, [gaps, placed, catalog, active]);

  const compareSet = compareIds.length === 2 ? compareIds : myBags.slice(0, 2).map(b => b.id);
  const compareData = useMemo(() => {
    if (scope !== "compare" || compareSet.length < 2) return null;
    const pick = id => placed.balls.filter(b => (byBag[id] || []).includes(b.name));
    return { ids: compareSet, ...compareBags(pick(compareSet[0]), pick(compareSet[1])) };
  }, [scope, compareSet, placed, byBag]);

  const chartBalls = scope === "compare" && compareData
    ? placed.balls.filter(b => compareSet.some(id => (byBag[id] || []).includes(b.name)))
    : inScope.filter(b => !b.spare);
  const colorFor = b => {
    if (scope === "compare" && compareData) {
      const inA = (byBag[compareSet[0]] || []).includes(b.name);
      return inA ? BAG_COLORS[0] : BAG_COLORS[1];
    }
    return coverColor(b.specs?.coverstock);
  };
  const ringFor = scope === "compare" && compareData
    ? b => (compareData.shared.includes(b.name) ? BAG_COLORS[1] : null) : null;
  const bagName = id => myBags.find(b => b.id === id)?.name || "Bag";
  const sel = placed.balls.find(b => b.name === selected);

  // ── The Caddie ────────────────────────────────────────────────────
  const unlocked = featureUnlocked(entitlement);
  const [caddie, setCaddie] = useState({ status: "idle", result: null, error: null });
  const payload = useMemo(() => buildCaddiePayload({
    placed: scope === "all" || scope === "compare" ? placed.balls : inScope,
    bags: (scope === "compare" ? myBags.filter(b => compareSet.includes(b.id))
      : scope === "all" ? myBags : myBags.filter(b => b.id === scope))
      .map(b => ({ name: b.name, balls: byBag[b.id] || [] })),
    gaps: {
      all: gaps,
      byBag: Object.fromEntries(myBags.map(b => [b.name,
        gapsFor(placed.balls.filter(x => (byBag[b.id] || []).includes(x.name)), b)])),
    },
    candidates, overallAverage: placed.overallAverage, leftHanded, twoHanded,
    focus: scope === "compare" ? "compare" : scope === "all" ? "all" : "bag",
  }), [scope, placed, inScope, myBags, compareSet, byBag, gaps, candidates, leftHanded, twoHanded]);

  // A read already given for exactly this arsenal comes back instantly.
  const lastKey = useRef("");
  useEffect(() => {
    const key = cacheKey(payload.fingerprint);
    if (lastKey.current === key) return;
    lastKey.current = key;
    let live = true;
    readCache(key).then(hit => {
      if (!live) return;
      setCaddie(hit ? { status: "done", result: hit, error: null } : { status: "idle", result: null, error: null });
    });
    return () => { live = false; };
  }, [payload.fingerprint]);

  const placedCount = payload.balls.filter(b => !b.spare && b.strength !== null).length;
  async function askCaddie() {
    if (caddie.status === "loading") return;
    setCaddie({ status: "loading", result: null, error: null });
    const fallback = "The Caddie couldn't answer just then. Tap to try again.";
    try {
      const { data, error } = await supabase.functions.invoke("caddie", { body: { payload, language: aiLanguage() } });
      if (error) {
        const failure = await readFunctionFailure(error);
        recordError({ kind: "function", where: "caddie", message: failure.body?.error || failure.message, detail: failureDetail(failure) });
        setCaddie({ status: "error", result: null, error: friendlyFunctionError(failure, fallback).text });
        return;
      }
      const ok = normalizeCaddieReply(data);
      if (!ok) { setCaddie({ status: "error", result: null, error: fallback }); return; }
      setCaddie({ status: "done", result: ok, error: null });
      writeCache(cacheKey(payload.fingerprint), ok);
    } catch (e) {
      recordError({ kind: "function", where: "caddie", message: String(e) });
      setCaddie({ status: "error", result: null, error: fallback });
    }
  }

  if (!active.length) {
    return (
      <div style={S.card}>
        <div style={S.label}>Arsenal analysis</div>
        <div style={{ fontSize: "12px", color: C.textMuted, lineHeight: 1.5 }}>
          Add your balls on the Balls tab, with their cover and core, and this maps where each one sits and what your bag is missing.
        </div>
      </div>
    );
  }

  const scopeChips = [
    { id: "all", label: "All balls" },
    ...myBags.map(b => ({ id: b.id, label: b.name })),
    ...(myBags.length >= 2 ? [{ id: "compare", label: "Compare bags" }] : []),
  ];

  return (
    <div>
      {/* The Caddie first: the read is what a bowler opens this screen
          for. It follows the All balls / bag / Compare choice below. */}
      {!unlocked ? (
        <LockedNote title="The Caddie">
          Your caddie reads the whole bag — which ball for which condition, which bag is built right, what to add and what to leave home. It's part of the paid plan.
          {onUpgrade && (
            <button style={{ ...S.btn("primary"), width: "100%", marginTop: "8px" }} onClick={onUpgrade}>See the plan</button>
          )}
        </LockedNote>
      ) : (
        <div style={S.card}>
          <div style={S.label}>🏌️ The Caddie</div>
          <div style={{ fontSize: "12px", color: C.textMuted, lineHeight: 1.5, marginBottom: "10px" }}>
            {scope === "compare" ? "Asks which of these two bags is built for what."
              : scope === "all" ? "Reads the whole arsenal: each ball's job, your bags, and what to add or leave home."
              : `Reads ${bagName(scope)}: what it's built for and what it's missing.`}
          </div>
          {caddie.status !== "done" && (
            <button style={{ ...S.btn("primary"), width: "100%" }} disabled={caddie.status === "loading" || placedCount < 1}
              onClick={askCaddie}>
              {caddie.status === "loading" ? "The Caddie is looking over the bag…" : "Ask the Caddie"}
            </button>
          )}
          {placedCount < 1 && (
            <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "6px" }}>Add cover and core to at least one ball first.</div>
          )}
          {caddie.status === "error" && (
            <div style={{ fontSize: "12px", color: C.miss, marginTop: "8px" }}>{caddie.error}</div>
          )}
          {caddie.status === "done" && caddie.result && <CaddieRead r={caddie.result} onAgain={askCaddie} />}
        </div>
      )}
      <div style={S.card}>
        <div style={S.label}>Arsenal analysis</div>
        <div style={{ fontSize: "12px", color: C.textMuted, lineHeight: 1.5, marginBottom: "10px" }}>
          Where each ball sits, from its cover, surface, core and layout — cover and surface count most, because they're what touches the lane. Positions are estimates from specs; your scores show what actually worked.
        </div>
        <div style={{ ...S.chips, marginBottom: "8px" }}>
          {scopeChips.map(c => (
            <Chip key={c.id} label={c.label} selected={scope === c.id} onToggle={() => { setScope(c.id); setSelected(""); }} />
          ))}
        </div>
        {scope === "compare" && myBags.length > 2 && (
          <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
            {[0, 1].map(i => (
              <select key={i} style={{ ...S.sel, flex: 1, minWidth: 0 }} aria-label={i === 0 ? "First bag" : "Second bag"}
                value={compareSet[i] || ""}
                onChange={e => {
                  const next = [...compareSet];
                  next[i] = e.target.value;
                  setCompareIds(next);
                }}>
                {myBags.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            ))}
          </div>
        )}
        <div style={{ ...S.chips, marginBottom: "6px" }}>
          {MAP_VIEWS.map(v => (
            <Chip key={v.id} dense label={v.label} selected={viewId === v.id} onToggle={() => setViewId(v.id)} />
          ))}
        </div>
        <div style={{ fontSize: "11px", color: C.textMuted, marginBottom: "8px", lineHeight: 1.45 }}>{view.help}</div>

        {chartBalls.some(b => pointFor(b, view)) ? (
          <ArsenalChart balls={chartBalls} view={view} selected={selected} onSelect={setSelected}
            colorFor={colorFor} ringFor={ringFor} />
        ) : (
          <div style={{ fontSize: "12px", color: C.textMuted, padding: "20px 0", textAlign: "center" }}>
            No ball here has the specs this chart needs yet.
          </div>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", fontSize: "11px", color: C.textMuted, marginTop: "6px" }}>
          {scope === "compare" && compareData ? (
            <>
              <span><span style={{ color: BAG_COLORS[0] }}>●</span> {bagName(compareSet[0])}</span>
              <span><span style={{ color: BAG_COLORS[1] }}>●</span> {bagName(compareSet[1])}</span>
              <span>◯ in both</span>
            </>
          ) : (
            <>
              <span><span style={{ color: COVER_COLORS.solid }}>●</span> Solid</span>
              <span><span style={{ color: COVER_COLORS.hybrid }}>●</span> Hybrid</span>
              <span><span style={{ color: COVER_COLORS.pearl }}>●</span> Pearl</span>
              <span style={{ opacity: 0.6 }}>● Faded: specs incomplete</span>
            </>
          )}
        </div>

        {sel && (
          <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: `1px solid ${C.border}` }}>
            <BallDetail b={sel} overall={placed.overallAverage} />
          </div>
        )}
      </div>

      {scope === "compare" && compareData && (
        <div style={S.card}>
          <div style={S.label}>Bags side by side</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
              <thead>
                <tr style={{ color: C.textMuted, textAlign: "left" }}>
                  <th style={{ padding: "4px 6px 4px 0", fontWeight: 500 }} />
                  <th style={{ padding: "4px 6px", fontWeight: 600, color: BAG_COLORS[0] }}>{bagName(compareSet[0])}</th>
                  <th style={{ padding: "4px 6px", fontWeight: 600, color: BAG_COLORS[1] }}>{bagName(compareSet[1])}</th>
                </tr>
              </thead>
              <tbody style={{ fontFamily: F.num }}>
                {[["Balls", s => String(s.balls)],
                  ["Strength", s => (s.strength ? `${s.strength[0]}–${s.strength[1]}` : "—")],
                  ["Length", s => (s.length ? `${s.length[0]}–${s.length[1]}` : "—")],
                  ["Back end", s => (s.shape ? `${s.shape[0]}–${s.shape[1]}` : "—")]].map(([label, f]) => (
                  <tr key={label} style={{ borderTop: `1px solid ${C.border}` }}>
                    <td style={{ padding: "5px 6px 5px 0", color: C.textMuted, fontFamily: F.body }}>{label}</td>
                    <td style={{ padding: "5px 6px" }}>{f(compareData.a)}</td>
                    <td style={{ padding: "5px 6px" }}>{f(compareData.b)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "8px", lineHeight: 1.45 }}>
            {compareData.shared.length
              ? `In both bags: ${compareData.shared.join(", ")}.`
              : "No ball is in both bags."} A wider range means the bag covers more conditions.
          </div>
        </div>
      )}

      <div style={S.card}>
        <div style={S.label}>{scope === "all" || scope === "compare" ? "Your balls" : `In ${bagName(scope)}`}</div>
        {(scope === "compare" ? placed.balls : inScope).map(b => (
          <button key={b.name} onClick={() => setSelected(selected === b.name ? "" : b.name)}
            style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none",
              borderTop: `1px solid ${C.border}`, padding: "9px 0", cursor: "pointer", color: C.text, fontFamily: F.body }}>
            <BallRow b={b} />
          </button>
        ))}
        {scope !== "all" && scope !== "compare" && !inScope.length && (
          <div style={{ fontSize: "12px", color: C.textMuted }}>This bag is empty.</div>
        )}
      </div>

      <div style={S.card}>
        <div style={S.label}>{scope === "all" || scope === "compare" ? "What the arsenal is missing" : "What this bag is missing"}</div>
        {gaps.length === 0 ? (
          <div style={{ fontSize: "12px", color: C.textMuted }}>Nothing obvious — it covers strong to weak, smooth to sharp, and has a spare ball.</div>
        ) : gaps.map((g, i) => (
          <div key={i} style={{ fontSize: "12.5px", lineHeight: 1.5, marginBottom: "8px" }}>
            {gapText(g)}
            {candidates.filter(c => c.gapId === g.id).length > 0 && (
              <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "2px" }}>
                From the catalog: {candidates.filter(c => c.gapId === g.id)
                  .map(c => `${c.brand ? c.brand + " " : ""}${c.name} (${[c.placed.tags.strength, c.placed.tags.length, c.placed.tags.shape].filter(Boolean).join(", ").toLowerCase()})`)
                  .join("; ")}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}

function BallRow({ b }) {
  const sc = b.scoring;
  const tags = b.spare ? "Spare ball" : [b.tags?.strength, b.tags?.length, b.tags?.shape].filter(Boolean).join(" · ");
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span aria-hidden="true" style={{ width: "10px", height: "10px", borderRadius: "5px", flexShrink: 0,
          backgroundColor: b.spare ? C.textMuted : coverColor(b.specs?.coverstock) }} />
        <span style={{ fontWeight: 600, fontSize: "13.5px", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.name}</span>
        {sc?.scoresWell && <span style={{ fontSize: "10.5px", color: C.strike, fontWeight: 700 }}>Scores well</span>}
        {sc?.struggles && <span style={{ fontSize: "10.5px", color: C.miss, fontWeight: 700 }}>Below average</span>}
      </div>
      <div style={{ fontSize: "11.5px", color: C.textMuted, marginTop: "2px", paddingLeft: "18px" }}>
        {tags || "Not placed — add cover and core"}
        {!b.spare && b.oil ? ` · ${b.oil}` : ""}
      </div>
      {sc && (
        <div style={{ fontSize: "11.5px", color: C.textMuted, marginTop: "1px", paddingLeft: "18px", fontFamily: F.num }}>
          {sc.games} games · {sc.avg} avg{sc.delta !== null ? ` (${sc.delta >= 0 ? "+" : ""}${sc.delta})` : ""}
          {sc.bestPhase ? ` · best ${PHASE_LABEL[sc.bestPhase]}` : ""}
          {b.strikePct !== null ? ` · ${b.strikePct}% strikes` : ""}
        </div>
      )}
    </div>
  );
}

function BallDetail({ b, overall }) {
  const specs = describeSpecs(b.specs);
  const layout = formatLayout(b.layout);
  const sc = b.scoring;
  return (
    <div style={{ fontSize: "12px", lineHeight: 1.55 }}>
      <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "2px" }}>{b.name}</div>
      <div style={{ color: C.textMuted }}>{specs || "No specs entered"}</div>
      <div style={{ color: C.textMuted }}>
        Surface: {b.surface || "not recorded"}{b.surfaceAssumed ? " (reading it as out of the box)" : ""}
        {" · "}Layout: {layout || "not recorded"}
      </div>
      {!b.spare && b.strength !== null && (
        <div style={{ marginTop: "4px", fontFamily: F.num }}>
          Strength {b.strength} · Length {b.length} · Back end {b.shape}
          <span style={{ color: C.textMuted, fontFamily: F.body }}> — {b.oil}</span>
        </div>
      )}
      {sc ? (
        <div style={{ marginTop: "4px" }}>
          {sc.games} games at {sc.avg}{overall !== null ? `, against your ${overall} overall` : ""}.
          {Object.keys(sc.phases || {}).length > 1 && (
            <span style={{ color: C.textMuted }}> By part of the night: {["fresh", "transition", "late"]
              .filter(p => sc.phases[p]).map(p => `${PHASE_LABEL[p]} ${sc.phases[p].avg} (${sc.phases[p].games})`).join(", ")}.</span>
          )}
        </div>
      ) : (
        <div style={{ marginTop: "4px", color: C.textMuted }}>No games logged with it yet.</div>
      )}
    </div>
  );
}

function CaddieRead({ r, onAgain }) {
  return (
    <div style={{ fontSize: "13px", lineHeight: 1.55 }}>
      <div style={{ marginBottom: "10px" }}>{r.read}</div>
      {r.roles.length > 0 && (
        <div style={{ marginBottom: "10px" }}>
          <div style={{ ...S.label, marginBottom: "4px" }}>Each ball's job</div>
          {r.roles.map((x, i) => (
            <div key={i} style={{ marginBottom: "5px" }}><strong>{x.ball}</strong> — {x.role}</div>
          ))}
        </div>
      )}
      {r.bags.length > 0 && (
        <div style={{ marginBottom: "10px" }}>
          <div style={{ ...S.label, marginBottom: "4px" }}>Bags</div>
          {r.bags.map((x, i) => (
            <div key={i} style={{ marginBottom: "5px" }}><strong>{x.bag}</strong> — {x.note}</div>
          ))}
        </div>
      )}
      {r.gaps.length > 0 && (
        <div style={{ marginBottom: "10px" }}>
          <div style={{ ...S.label, marginBottom: "4px" }}>Gaps</div>
          {r.gaps.map((g, i) => <div key={i} style={{ marginBottom: "4px" }}>• {g}</div>)}
        </div>
      )}
      {r.nextBall && (
        <div style={{ marginBottom: "8px" }}><strong>Next in the bag:</strong> {r.nextBall}</div>
      )}
      {r.bench && (
        <div style={{ marginBottom: "8px" }}><strong>Leave at home:</strong> {r.bench}</div>
      )}
      <AiNote what="The Caddie's read" check="it's working from specs and your logged games, not from watching you throw" />
      <button style={{ ...S.btn(), width: "100%", marginTop: "8px", fontSize: "12px" }} onClick={onAgain}>Ask again</button>
    </div>
  );
}
