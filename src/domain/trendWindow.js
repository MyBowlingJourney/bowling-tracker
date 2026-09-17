// How far back a trend reaches.
//
// A line over every night a bowler has ever logged answers a different
// question from a line over the last ten. One says "am I a better bowler
// than I was", the other says "is what I changed last month working".
// Both are worth asking and the chart can only draw one at a time.
//
// Three ways to say it, because bowlers think in all three: the last N
// games, the last N days, or a season between two dates.

export const TREND_WINDOW_MODES = [
  { id: "all", label: "All" },
  { id: "games", label: "Games" },
  { id: "days", label: "Days" },
  { id: "range", label: "Dates" },
];

export const TREND_WINDOW_MODE_IDS = TREND_WINDOW_MODES.map(m => m.id);

// Sensible offers for each mode. A free-text number field on a phone is
// a keyboard nobody wants; these cover what people actually ask for.
export const GAME_CHOICES = [10, 20, 30, 60];
export const DAY_CHOICES = [30, 60, 90, 180, 365];

export const defaultTrendWindow = () => ({
  mode: "all",
  games: 20,
  days: 90,
  from: "",
  to: "",
});

export function normalizeTrendWindow(raw) {
  const w = raw && typeof raw === "object" ? raw : {};
  const d = defaultTrendWindow();
  return {
    mode: TREND_WINDOW_MODE_IDS.includes(w.mode) ? w.mode : d.mode,
    games: Number.isFinite(Number(w.games)) && Number(w.games) > 0
      ? Math.floor(Number(w.games)) : d.games,
    days: Number.isFinite(Number(w.days)) && Number(w.days) > 0
      ? Math.floor(Number(w.days)) : d.days,
    from: String(w.from ?? "").trim(),
    to: String(w.to ?? "").trim(),
  };
}

const clean = v => String(v ?? "").trim();

// Apply the window to a list of points that carry a date.
//
// Points are assumed sorted oldest first, which is how the chart wants
// them -- but the games window counts from the END, because "my last 20"
// means the most recent 20 whatever order they arrive in.
export function applyTrendWindow(points, window, opts) {
  // A default parameter only covers undefined, not null. Eighth module to
  // hit this; it never varies.
  const { today } = (opts && typeof opts === "object") ? opts : {};
  const rows = (Array.isArray(points) ? points : []).filter(p => p && typeof p === "object");
  const w = normalizeTrendWindow(window);
  if (!rows.length || w.mode === "all") return rows;

  if (w.mode === "games") return rows.slice(-w.games);

  if (w.mode === "days") {
    const end = clean(today) || latestDate(rows);
    if (!end) return rows;
    const cutoff = shiftDays(end, -w.days);
    if (!cutoff) return rows;
    // Inclusive: "last 30 days" includes the night 30 days ago.
    return rows.filter(p => clean(p.date) >= cutoff);
  }

  // A range with only one end given is still useful -- everything after
  // a date, or everything up to one -- so each bound is optional.
  const from = clean(w.from), to = clean(w.to);
  if (!from && !to) return rows;
  return rows.filter(p => {
    const d = clean(p.date);
    if (!d) return false;
    if (from && d < from) return false;
    if (to && d > to) return false;
    return true;
  });
}

function latestDate(rows) {
  let best = "";
  for (const p of rows) {
    const d = clean(p.date);
    if (d > best) best = d;
  }
  return best;
}

function shiftDays(iso, delta) {
  const t = Date.parse(`${iso}T00:00:00Z`);
  if (Number.isNaN(t)) return "";
  return new Date(t + delta * 86400000).toISOString().slice(0, 10);
}

// What the window is currently showing, for a line under the chart.
//
// Says what was EXCLUDED as well as what is in, because a bowler looking
// at eight points needs to know whether that is all they have or all the
// window allowed.
export function describeTrendWindow(window, shown, total) {
  const w = normalizeTrendWindow(window);
  const n = Number(shown) || 0;
  const all = Number(total) || 0;
  if (w.mode === "all" || n >= all) return `${n} of ${all}`;
  // "Last 10 nights" when plotting nights, but the same window plots
  // games in every-game mode -- so it says neither and gives the count.
  if (w.mode === "games") return `Last ${w.games} — showing ${n} of ${all}`;
  if (w.mode === "days") return `Last ${w.days} days — showing ${n} of ${all}`;
  const from = clean(w.from) || "the start";
  const to = clean(w.to) || "now";
  return `${from} to ${to} — showing ${n} of ${all}`;
}
