import { useState } from "react";
import { C, S } from "./ui.jsx";
import { TabBar } from "./Tabs.jsx";
import { MiniRack } from "./LeaveBreakdown.jsx";

// Free fall vs string, in three tabs: the numbers side by side, what each
// leaves standing, and how the strikes carried.
//
// `rows` is statsByRackType's output (average, strike %, messenger share);
// `detail` is rackTypeDetail's (spares, splits, leaves, strike shapes).
// Tabs without enough behind them are left out rather than drawn thin.

const FF = () => C.accent;
const ST = () => C.compare;
const fmt = v => (v == null ? "—" : Number.isInteger(v) ? String(v) : v.toFixed(1));
const MIRROR = { "Trip 4": "Trip 6", "Kick 10": "Kick 7" };
// Messenger is a fixed violet, not the theme accent: on Glow the accent
// is a teal a shade off the strike green, and the two bars read as one.
const SHAPE_COLORS = () => ({ Flush: C.strike, Messenger: "#8B5CF6", Light: "#7A8CA3", High: "#B9C3D0",
  "Half Pocket": C.spare, "Trip 4": "#5B6B85", "Kick 10": "#9AA7B8", Brooklyn: C.miss });

function Key({ ff, st }) {
  const dot = c => <span style={{ width: "10px", height: "10px", borderRadius: "3px", background: c, flexShrink: 0 }} />;
  return (
    <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", fontSize: "12px", color: C.textMuted, marginBottom: "14px" }}>
      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>{dot(FF())}Free fall · {ff.games} game{ff.games === 1 ? "" : "s"}</span>
      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>{dot(ST())}String · {st.games} game{st.games === 1 ? "" : "s"}</span>
    </div>
  );
}

function Delta({ a, b, lowerIsBetter, unit }) {
  if (a == null || b == null) return null;
  const d = Math.round((b - a) * 10) / 10;
  if (d === 0) return <span style={{ fontSize: "12px", color: C.textMuted }}>same</span>;
  const worse = lowerIsBetter ? d > 0 : d < 0;
  return (
    <span style={{ fontSize: "12px", fontWeight: 700, color: worse ? C.miss : C.strike }}>
      {d > 0 ? "+" : "−"}{fmt(Math.abs(d))}{unit} on string
    </span>
  );
}

function Numbers({ ff, st, detail }) {
  const dff = detail?.freefall || {}, dst = detail?.string || {};
  const corner = detail?.cornerPin || 10;
  const all = [
    { label: "Average", a: ff.average, b: st.average, unit: "", scale: 300 },
    { label: "Strike %", a: ff.strikeRate, b: st.strikeRate, unit: "%" },
    { label: "Spare %", a: dff.spareRate, b: dst.spareRate, unit: "%", sub: "splits excluded" },
    { label: "Messengers", a: ff.messengerRate, b: st.messengerRate, unit: "%", sub: "share of strikes" },
    { label: "Splits left", a: dff.splitRate, b: dst.splitRate, unit: "%", lower: true, sub: "share of first balls" },
    { label: `${corner}-pins left`, a: dff.cornerRate, b: dst.cornerRate, unit: "%", lower: true, sub: "share of first balls" },
  ].filter(r => r.a != null && r.b != null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      {all.map(r => {
        const max = Math.max(r.a, r.b, 1) * (r.scale ? 1.1 : 1.15);
        const bar = (v, c) => (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ flexGrow: 1, height: "10px", borderRadius: "5px", background: C.border }}>
              <div style={{ height: "10px", borderRadius: "5px", width: `${Math.min(100, (v / max) * 100)}%`, background: c }} />
            </div>
            <span style={{ width: "44px", textAlign: "right", fontSize: "13px", fontWeight: 600 }}>{fmt(v)}{r.unit}</span>
          </div>
        );
        return (
          <div key={r.label} style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px", fontSize: "13px" }}>
              <span style={{ fontWeight: 600 }}>{r.label}
                {r.sub && <span style={{ fontSize: "11px", fontWeight: 400, color: C.textMuted, marginLeft: "6px" }}>{r.sub}</span>}
              </span>
              <Delta a={r.a} b={r.b} lowerIsBetter={r.lower} unit={r.unit === "%" ? " pts" : ""} />
            </div>
            {bar(r.a, FF())}
            {bar(r.b, ST())}
          </div>
        );
      })}
    </div>
  );
}

function Leaves({ detail }) {
  const { freefall, string, biggestChanges = [], cornerPin } = detail;
  // One scale across both racks, so the darker rack really did leave
  // more standing -- normalising each on its own would make both look
  // equally bad.
  const max = Math.max(1, ...Object.values(freefall.pinRates), ...Object.values(string.pinRates));
  const heat = rates => Object.fromEntries(Object.entries(rates).map(([p, v]) => [p, v / max]));
  const side = (title, color, d) => (
    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
      <div style={{ fontSize: "13px", fontWeight: 600, color }}>{title}</div>
      <MiniRack size={120} color={C.miss} heat={heat(d.pinRates)} label={`${title}: how often each pin was left standing`} />
      <div style={{ fontSize: "11px", color: C.textMuted, textAlign: "center" }}>
        {cornerPin}-pin left {fmt(d.cornerRate)}% of first balls
      </div>
    </div>
  );
  return (
    <div>
      <div style={{ fontSize: "12px", color: C.textMuted, marginBottom: "12px" }}>What's left standing on each. Darker means left more often.</div>
      <div style={{ display: "flex", gap: "12px" }}>
        {side("Free fall", FF(), freefall)}
        {side("String", ST(), string)}
      </div>
      {biggestChanges.length > 0 && (
        <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: `1px solid ${C.border}` }}>
          <div style={{ ...S.label, marginBottom: "8px" }}>Biggest change on string</div>
          {biggestChanges.map(r => (
            <div key={r.key} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <MiniRack pins={r.key.split("-").map(Number)} size={36} color={r.change > 0 ? C.miss : C.strike} />
              <span style={{ flexGrow: 1, fontSize: "14px", fontWeight: 600 }}>{r.key}</span>
              <span style={{ fontSize: "12px", color: C.textMuted }}>
                {fmt(r.freefallRate)}% → <strong style={{ color: C.text }}>{fmt(r.stringRate)}%</strong>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Strikes({ ff, st, detail, leftHanded }) {
  const colors = SHAPE_COLORS();
  const name = s => (leftHanded ? MIRROR[s] || s : s);
  const shapes = [...new Set([...detail.freefall.shapes, ...detail.string.shapes].map(x => x.shape))];
  const pctOf = (d, s) => d.shapes.find(x => x.shape === s)?.pct ?? 0;
  const stack = (title, d, strikeRate) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
        <span style={{ fontWeight: 600 }}>{title}</span>
        <span style={{ color: C.textMuted }}>{strikeRate != null ? `${fmt(strikeRate)}% strikes · ` : ""}{d.described} described</span>
      </div>
      <div style={{ display: "flex", height: "18px", borderRadius: "6px", overflow: "hidden", background: C.border }}>
        {d.shapes.map((x, i) => <div key={x.shape} title={`${name(x.shape)} ${fmt(x.pct)}%`} style={{ width: `${x.pct}%`, background: colors[x.shape], borderLeft: i ? `2px solid ${C.card}` : "none" }} />)}
      </div>
    </div>
  );
  return (
    <div>
      <div style={{ fontSize: "12px", color: C.textMuted, marginBottom: "12px" }}>How your strikes carried, from the ones you described.</div>
      {stack("Free fall", detail.freefall, ff.strikeRate)}
      {stack("String", detail.string, st.strikeRate)}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", paddingTop: "10px", borderTop: `1px solid ${C.border}` }}>
        {shapes.map(s => (
          <div key={s} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "3px", background: colors[s] }} />{name(s)}
            </span>
            <span style={{ color: C.textMuted }}>
              {fmt(pctOf(detail.freefall, s))}% → <strong style={{ color: C.text }}>{fmt(pctOf(detail.string, s))}%</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RackTypeCard({ rows, detail, leftHanded = false }) {
  const ff = (rows || []).find(r => r?.rackType === "Free fall");
  const st = (rows || []).find(r => r?.rackType === "String");
  const [tab, setTab] = useState("numbers");
  if (!ff || !st || !(ff.games > 0) || !(st.games > 0)) return null;
  const tabs = [
    { id: "numbers", label: "Numbers" },
    detail?.leavesReady && { id: "leaves", label: "Leaves" },
    detail?.strikesReady && { id: "strikes", label: "Strikes" },
  ].filter(Boolean);
  const current = tabs.some(t => t.id === tab) ? tab : "numbers";
  return (
    <div style={S.card}>
      <div style={S.label}>Free Fall vs String</div>
      {tabs.length > 1 && <TabBar label="Free fall vs string view" tabs={tabs} value={current} onChange={setTab} />}
      <Key ff={ff} st={st} />
      {current === "numbers" && <Numbers ff={ff} st={st} detail={detail} />}
      {current === "leaves" && <Leaves detail={detail} />}
      {current === "strikes" && <Strikes ff={ff} st={st} detail={detail} leftHanded={leftHanded} />}
    </div>
  );
}
