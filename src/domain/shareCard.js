// Sharing a night's scores.
//
// The share itself is just text plus, where the device supports it, a
// picture of the summary card. Both carry the app name and the link,
// because a screenshot of three numbers tells nobody where it came from
// -- and "where did you get that?" is the whole growth loop for a free
// app that casual bowlers use once.
//
// Text first: it's what every share target accepts. The image is a bonus
// for the ones that show it (Messages, Instagram, WhatsApp).

import { APP_NAME, APP_URL } from "../constants.js";

// Re-exported, not redeclared.
//
// APP_URL now lives in constants.js beside APP_NAME -- one identity file.
// This module is the one that stamps the address onto every card and QR
// code, so exporting it here keeps that surface intact for anything
// already importing it from this file, without creating a second value
// that could drift from the first.
export { APP_URL };


function scoresLine(scores) {
  const clean = (Array.isArray(scores) ? scores : []).filter(v => Number.isFinite(v));
  return clean.length ? clean.join("  ·  ") : "";
}

// One summary in plain words, the way a bowler would text it. No stats
// jargon: "617 series" not "series: 617"; a single game is just the
// score.
export function shareText(arg) {
  // A default parameter covers undefined, not null.
  const { bowler, scores, league, date, environment, highlights = [], earned = [] } = (arg && typeof arg === "object") ? arg : {};
  const clean = (Array.isArray(scores) ? scores : []).filter(v => Number.isFinite(v));
  const series = clean.reduce((a, b) => a + b, 0);
  const who = bowler ? `${bowler} bowled` : "Bowled";
  const where = league ? ` at ${league.replace(" House Shot", "")}` : "";
  const when = date ? ` on ${date}` : "";

  let headline;
  if (clean.length === 0) headline = `${who}${where}${when}.`;
  else if (clean.length === 1) headline = `${who} a ${clean[0]}${where}${when}.`;
  else headline = `${who} ${series} for ${clean.length}${where}${when}: ${scoresLine(clean)}.`;

  const extras = (Array.isArray(highlights) ? highlights : []).filter(Boolean).map(h => `• ${h}`);
  const badgeNames = (Array.isArray(earned) ? earned : []).filter(b => b && b.name)
    .map(b => `${b.emoji ? b.emoji + " " : ""}${b.name}`);
  const tag = environment === "practice" ? "Practice session" : environment === "casual" ? "Just for fun" : "";

  return [
    headline,
    ...(extras.length ? ["", ...extras] : []),
    ...(badgeNames.length ? ["", `Badge${badgeNames.length === 1 ? "" : "s"} earned: ${badgeNames.join(", ")}`] : []),
    ...(tag ? ["", tag] : []),
    "",
    `Tracked with ${APP_NAME} — ${APP_URL}`,
  ].join("\n");
}

// A title for the share sheet, kept short because iOS shows it in the
// header of the sheet.
export function shareTitle(arg) {
  // A default parameter covers undefined, not null.
  const { bowler, scores } = (arg && typeof arg === "object") ? arg : {};
  const clean = (Array.isArray(scores) ? scores : []).filter(v => Number.isFinite(v));
  const series = clean.reduce((a, b) => a + b, 0);
  if (clean.length > 1) return `${bowler ? bowler + ": " : ""}${series} series`;
  if (clean.length === 1) return `${bowler ? bowler + ": " : ""}${clean[0]}`;
  return APP_NAME;
}

// Draws the summary card to a canvas. Returns null anywhere canvas isn't
// available (tests, old browsers), and the caller falls back to text.
//
// Sized for a phone share: 1080x1080 is what Instagram and most feeds
// crop least. Colours come from the active theme so the card matches
// what the bowler is looking at.
// The app mark: one lane arrow. Same geometry as the app icon
// (a triangle in the accent), so a shared card and the icon on a phone
// home screen are recognisably the same thing.
export function drawArrowMark(ctx, x, y, size, color) {
  if (!ctx || typeof ctx.beginPath !== "function") return;
  if (!ctx) return null;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x + size / 2, y);
  ctx.lineTo(x + size, y + size);
  ctx.lineTo(x, y + size);
  ctx.closePath();
  ctx.fill();
  return true;
}

// The second argument defaults to {}. Destructuring happens BEFORE the
// body, so a guard inside never runs -- calling this with only a ctx
// threw on the parameter list itself.
export function drawShareCard(ctx, { bowler, scores, league, date, colors, fonts, highlights, earned, logo } = {}) {
  // A canvas context or nothing. Checking for the METHOD rather than
  // truthiness: any object passes a truthy test and then throws on
  // the first draw call.
  if (!ctx || typeof ctx.fillRect !== "function") return null;
  const W = 1080, H = 1080;
  const c = colors || {};
  const clean = (Array.isArray(scores) ? scores : []).filter(v => Number.isFinite(v));
  const series = clean.reduce((a, b) => a + b, 0);

  ctx.fillStyle = c.bg || "#14110E";
  ctx.fillRect(0, 0, W, H);

  // No background mark. The ball-with-spokes wheel that sat bottom right
  // was the old app icon; the logo now sits with the name in the corner
  // (see drawBrand), so the card carries one mark, not two.

  // Name and where
  ctx.fillStyle = c.textMuted || "#9A8F80";
  ctx.font = `500 34px ${fonts?.body || "system-ui, sans-serif"}`;
  ctx.textBaseline = "top";
  const sub = [bowler, league ? league.replace(" House Shot", "") : "", date].filter(Boolean).join("   ");
  ctx.fillText(sub, 80, 90);

  // THE number
  ctx.fillStyle = c.text || "#F4F0E6";
  ctx.font = `700 300px ${fonts?.num || "system-ui, sans-serif"}`;
  ctx.fillText(clean.length > 1 ? String(series) : String(clean[0] ?? "—"), 72, 150);

  ctx.fillStyle = c.textMuted || "#9A8F80";
  ctx.font = `500 36px ${fonts?.body || "system-ui, sans-serif"}`;
  ctx.fillText(clean.length > 1 ? `${clean.length}-game series` : clean.length === 1 ? "Game" : "", 84, 480);

  // The individual games
  if (clean.length > 1) {
    ctx.fillStyle = c.text || "#F4F0E6";
    ctx.font = `700 84px ${fonts?.num || "system-ui, sans-serif"}`;
    clean.forEach((s, i) => ctx.fillText(String(s), 84 + i * 220, 560));
    ctx.fillStyle = c.textMuted || "#9A8F80";
    ctx.font = `500 28px ${fonts?.body || "system-ui, sans-serif"}`;
    clean.forEach((_, i) => ctx.fillText(`Game ${i + 1}`, 88 + i * 220, 650));
  }

  // Highlights on the image itself. The text carries them for every
  // share target, but the picture is what actually gets looked at -- a
  // card showing only three numbers wastes the moment.
  // Filtered before slicing: a caller that builds this list with
  // conditional entries leaves nulls in it, and String(null) drew the
  // word "null" on the card -- and a null also ate one of the three
  // slots a real highlight could have used.
  const hl = (highlights || []).filter(h => h != null && String(h).trim() !== "").slice(0, 3);
  if (hl.length) {
    ctx.font = `500 34px ${fonts?.body || "system-ui, sans-serif"}`;
    hl.forEach((line, i) => {
      ctx.fillStyle = c.accent || "#E8A33D";
      ctx.fillText("\u2022", 84, 700 + i * 52);
      ctx.fillStyle = c.text || "#F4F0E6";
      ctx.fillText(String(line), 116, 700 + i * 52);
    });
  }

  // Badges earned this night, when there are any. A badge is the thing a
  // bowler most wants to show off, and until now the card never said.
  // Two lines at most. The first ends above the QR code (which starts at
  // y 890) so it can run nearly the full width; the second stops short
  // of the code's left edge.
  drawEarnedBadges(ctx, { earned, x: 84, y: 836, maxWidth: 920, secondWidth: 800, colors: c, fonts });

  // Attribution, bottom left: the logo beside the name. Always present,
  // always readable -- it is what makes a shared card an invitation.
  drawBrand(ctx, { x: 80, y: 948, size: 84, logo, colors: c, fonts, nameSize: 40, urlSize: 30 });

  return true;
}

// The logo, the app name beside it, and the address under the name.
//
// The logo is the app icon, loaded by the caller and passed in as an
// image. A share can happen offline, and the icon ships inside the app,
// so it is there -- but if it has not loaded (or there is no DOM, as in
// tests) the lane-arrow triangle stands in, so the card never goes out
// without a mark.
export function drawBrand(ctx, { x, y, size, logo, colors, fonts, nameSize = 34, urlSize = 26 } = {}) {
  if (!ctx || typeof ctx.fillText !== "function") return null;
  const c = colors || {};
  const hasLogo = !!logo && (logo.naturalWidth > 0 || logo.width > 0) && typeof ctx.drawImage === "function";
  if (hasLogo) {
    try {
      ctx.save?.();
      // Rounded like the icon on a home screen.
      if (typeof ctx.roundRect === "function" && typeof ctx.clip === "function") {
        ctx.beginPath(); ctx.roundRect(x, y, size, size, size * 0.22); ctx.clip();
      }
      ctx.drawImage(logo, x, y, size, size);
      ctx.restore?.();
    } catch { drawArrowMark(ctx, x, y + size * 0.15, size * 0.7, c.accent || "#E8A33D"); }
  } else {
    drawArrowMark(ctx, x, y + size * 0.15, size * 0.7, c.accent || "#E8A33D");
  }
  const tx = x + size + 18;
  ctx.textBaseline = "top";
  ctx.fillStyle = c.accent || "#E8A33D";
  ctx.font = `700 ${nameSize}px ${fonts?.display || "system-ui, sans-serif"}`;
  ctx.fillText(APP_NAME, tx, y + size / 2 - nameSize - 2);
  ctx.fillStyle = c.textMuted || "#9A8F80";
  ctx.font = `500 ${urlSize}px ${fonts?.body || "system-ui, sans-serif"}`;
  ctx.fillText(APP_URL.replace(/^https?:\/\//, ""), tx, y + size / 2 + 6);
  return true;
}

// "BADGES  🦃 Turkey · 🧹 Clean game", wrapping to a second line when
// they don't fit on one, and "+2 more" only past that -- never running
// under the QR code.
export function drawEarnedBadges(ctx, { earned, x, y, maxWidth, secondWidth, colors, fonts } = {}) {
  const list = (Array.isArray(earned) ? earned : []).filter(b => b && b.name);
  if (!list.length || !ctx || typeof ctx.fillText !== "function") return null;
  const c = colors || {};
  const measure = t => (typeof ctx.measureText === "function" ? ctx.measureText(t).width : t.length * 18);
  ctx.textBaseline = "top";
  ctx.font = `700 26px ${fonts?.body || "system-ui, sans-serif"}`;
  ctx.fillStyle = c.accent || "#E8A33D";
  const label = list.length === 1 ? "BADGE" : "BADGES";
  ctx.fillText(label, x, y + 6);
  const start = x + measure(label) + 20;
  ctx.font = `600 34px ${fonts?.body || "system-ui, sans-serif"}`;
  const parts = list.map(b => `${b.emoji ? b.emoji + " " : ""}${b.name}`);
  const sep = "  \u00b7  ";
  const room1 = maxWidth - (start - x);
  const room2 = (secondWidth || maxWidth) - (start - x);
  // Greedy: as many as fit on line one, then line two.
  let i = 1;
  while (i < parts.length && measure(parts.slice(0, i + 1).join(sep)) <= room1) i++;
  const line1 = parts.slice(0, i);
  const rest = parts.slice(i);
  let line2 = [];
  if (rest.length) {
    let n = rest.length;
    const tail = k => (k < rest.length ? `${k ? sep.trimEnd() + " " : ""}+${rest.length - k} more` : "");
    while (n > 0 && measure(rest.slice(0, n).join(sep) + tail(n)) > room2) n--;
    line2 = n ? [rest.slice(0, n).join(sep) + tail(n)] : [`+${rest.length} more`];
  }
  ctx.fillStyle = c.text || "#F4F0E6";
  ctx.fillText(line1.join(sep), start, y);
  if (line2.length) ctx.fillText(line2[0], start, y + 46);
  return line1.length + (line2.length ? rest.length : 0);
}

// ── What's worth saying about a night ──────────────────────────────────
//
// "203 · 221 · 193" is a scoreline, not a story. What a bowler actually
// wants to post is the thing that made the night good: a goal they hit,
// money they won, a personal best, a clean game.
//
// Ordered by what a bowler would lead with, and capped -- three good
// lines beat eight mediocre ones, and a share that scrolls doesn't get
// read. Everything is derived from data already on the session, so this
// adds no new tracking burden.
export function sessionHighlights(arg) {
  // A null session is what a caller passes before a night has loaded.
  const {
  scores = [], strikes = 0, shotCount = 0, sparesMade = 0, spareAttempts = 0,
  cleanGames = 0, goalsHit = [], moneyWon = 0, priorBest = null,
  priorAverage = null, environment = "league",
} = (arg && typeof arg === "object") ? arg : {};

  const out = [];
  const clean = scores.filter(v => Number.isFinite(v));
  const series = clean.reduce((a, b) => a + b, 0);
  const high = clean.length ? Math.max(...clean) : null;

  // 1. Money first -- it's the least common and the most fun to post.
  if (moneyWon > 0) out.push(`Won $${moneyWon} in side pots`);

  // 2. A goal you set and then hit is the whole point of setting it.
  for (const g of goalsHit.slice(0, 2)) out.push(`Hit my goal: ${g}`);

  // 3. Personal bests, which people genuinely brag about.
  if (priorBest != null && clean.length > 1 && series > priorBest) {
    out.push(`New personal best series — beat ${priorBest}`);
  } else if (priorBest != null && high != null && clean.length === 1 && high > priorBest) {
    out.push(`New personal best game — beat ${priorBest}`);
  }

  // 4. Clean games: no open frames is a real bowling achievement and
  //    reads better than a percentage.
  if (cleanGames === clean.length && clean.length > 0) out.push("Clean card — no open frames");
  else if (cleanGames > 0) out.push(`${cleanGames} clean game${cleanGames === 1 ? "" : "s"}`);

  // 5. Beating your own average, which is the everyday version of a win.
  if (priorAverage != null && clean.length) {
    const avg = Math.floor(series / clean.length);
    const diff = avg - Math.floor(priorAverage);
    if (diff >= 5) out.push(`${diff} pins over my average`);
  }

  // 6. Rates last, and only when they're actually good -- posting "48%
  //    strikes" helps nobody.
  const strikePct = shotCount ? Math.round((strikes / shotCount) * 100) : null;
  if (strikePct != null && strikePct >= 55) out.push(`${strikePct}% strikes`);
  const sparePct = spareAttempts ? Math.round((sparesMade / spareAttempts) * 100) : null;
  if (sparePct != null && sparePct >= 80) out.push(`${sparePct}% spares`);

  return out.slice(0, 4);
}

// ── Sharing a TREND, which is a different picture ───────────────────────
//
// A trend is a shape over time, not a scoreline. Feeding its points into
// drawShareCard as `scores` produced two bugs at once: the games were
// summed into a nonsense "9825 series", and 50 of them drawn 220px apart
// ran ~11,000px wide on a 1080px card -- the overflow being the black bar.
//
// So a trend gets its own card: the line itself, with high, low and
// average, and no series total anywhere.
export function drawTrendCard(ctx, { bowler, label, points, league, colors, fonts, logo } = {}) {
  // A canvas context or nothing. Checking for the METHOD rather than
  // truthiness: any object passes a truthy test and then throws on
  // the first draw call.
  if (!ctx || typeof ctx.fillRect !== "function") return null;
  const W = 1080, H = 1080;
  const c = colors || {};
  const vals = (Array.isArray(points) ? points : []).map(p => (typeof p === "number" ? p : p?.value))
    .filter(v => Number.isFinite(v));

  ctx.fillStyle = c.bg || "#14110E";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = c.textMuted || "#9A8F80";
  ctx.font = `500 34px ${fonts?.body || "system-ui, sans-serif"}`;
  ctx.textBaseline = "top";
  ctx.fillText([bowler, league ? league.replace(" House Shot", "") : ""].filter(Boolean).join("   "), 80, 84);

  ctx.fillStyle = c.text || "#F4F0E6";
  ctx.font = `700 60px ${fonts?.display || fonts?.body || "system-ui, sans-serif"}`;
  ctx.fillText(label || "Trend", 80, 132);

  if (!vals.length) return true;

  const hi = Math.max(...vals), lo = Math.min(...vals);
  const avg = Math.floor(vals.reduce((a, b) => a + b, 0) / vals.length);

  // The graph. Padded so a flat line doesn't sit on the axis, and scaled
  // to the data rather than to zero -- a bowling average never starts at
  // zero, and anchoring there flattens every real change into a
  // straight line.
  const left = 90, right = W - 90, top = 300, bottom = 720;
  const span = Math.max(1, hi - lo);
  const x = i => left + (vals.length === 1 ? (right - left) / 2 : (i / (vals.length - 1)) * (right - left));
  const y = v => bottom - ((v - lo) / span) * (bottom - top);

  ctx.strokeStyle = c.border || "#332B22";
  ctx.lineWidth = 2;
  for (let g = 0; g <= 3; g++) {
    const gy = top + (g / 3) * (bottom - top);
    ctx.beginPath(); ctx.moveTo(left, gy); ctx.lineTo(right, gy); ctx.stroke();
  }

  ctx.strokeStyle = c.accent || "#E8A33D";
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  vals.forEach((v, i) => (i === 0 ? ctx.moveTo(x(i), y(v)) : ctx.lineTo(x(i), y(v))));
  ctx.stroke();

  // Dots only when there are few enough to be distinguishable; at 50
  // points they merge into a caterpillar and hurt readability.
  if (vals.length <= 20) {
    ctx.fillStyle = c.accent || "#E8A33D";
    vals.forEach((v, i) => { ctx.beginPath(); ctx.arc(x(i), y(v), 9, 0, Math.PI * 2); ctx.fill(); });
  }

  // High / low / average, which is what a trend is actually about.
  const stats = [["High", hi], ["Average", avg], ["Low", lo]];
  stats.forEach(([name, val], i) => {
    const sx = 80 + i * 320;
    ctx.fillStyle = c.text || "#F4F0E6";
    ctx.font = `700 76px ${fonts?.num || "system-ui, sans-serif"}`;
    ctx.fillText(String(val), sx, 790);
    ctx.fillStyle = c.textMuted || "#9A8F80";
    ctx.font = `500 30px ${fonts?.body || "system-ui, sans-serif"}`;
    ctx.fillText(name, sx, 880);
  });

  ctx.fillStyle = c.textMuted || "#9A8F80";
  ctx.font = `500 28px ${fonts?.body || "system-ui, sans-serif"}`;
  ctx.fillText(`${vals.length} games`, 80, 934);

  // Mark, name AND url -- the score card already had all three; this
  // card was missing the url, so a screenshot of it said what app made
  // it but not where to get it.
  drawBrand(ctx, { x: 80, y: 962, size: 72, logo, colors: c, fonts });

  return true;
}

// Text for a shared trend. No series total -- summing a season of games
// produces a number that means nothing.
export function trendShareText(arg) {
  // A default parameter covers undefined, not null.
  const { bowler, label, points, league } = (arg && typeof arg === "object") ? arg : {};
  const vals = (Array.isArray(points) ? points : []).map(p => (typeof p === "number" ? p : p?.value))
    .filter(v => Number.isFinite(v));
  if (!vals.length) return `${label || "Trend"}\n\nTracked with ${APP_NAME} — ${APP_URL}`;
  const hi = Math.max(...vals), lo = Math.min(...vals);
  const avg = Math.floor(vals.reduce((a, b) => a + b, 0) / vals.length);
  const where = league ? ` at ${league.replace(" House Shot", "")}` : "";
  return [
    `${bowler ? bowler + "'s " : ""}${label || "trend"}${where}`,
    `${vals.length} games — averaging ${avg}, high ${hi}, low ${lo}.`,
    "",
    `Tracked with ${APP_NAME} — ${APP_URL}`,
  ].join("\n");
}

// ── Standings ──────────────────────────────────────────────────────────
//
// Focus group Finding 4: 9 of 50 looked for a way to share the running
// table, not just one night. The night recap had a share and the
// standings did not, which is backwards for the thing people said they
// would install the app to settle arguments with.
//
// Ranked by AVERAGE, matching CasualLeaderboard -- people bowl different
// numbers of games, and the games count travels alongside so a
// three-game average is not mistaken for a thirty-game one.
export function drawStandingsCard(ctx, { rows, me, colors, fonts, logo } = {}) {
  // A canvas context or nothing. Checking for the METHOD rather than
  // truthiness: any object passes a truthy test and then throws on
  // the first draw call.
  if (!ctx || typeof ctx.fillRect !== "function") return null;
  if (!ctx) return null;
  const W = 1080, H = 1080;
  const c = colors || {};
  // Rows are filtered to real objects, not merely checked for being an
  // array. A null or a stray number in the list throws on .bowler and
  // takes the whole share down with it -- HANDOFF 4.4, guards that
  // check null but not type. My first version of this did exactly
  // that, and a test caught it.
  const list = (Array.isArray(rows) ? rows : [])
    .filter(r => r && typeof r === "object")
    .slice(0, 10);

  ctx.fillStyle = c.bg || "#14110E";
  ctx.fillRect(0, 0, W, H);

  ctx.textBaseline = "top";
  ctx.fillStyle = c.textMuted || "#9A8F80";
  ctx.font = `500 34px ${fonts?.body || "system-ui, sans-serif"}`;
  // The DISPLAY name. CASUAL_SESSION_KEY is still "Just Bowling" because
  // it is a stored league key, but nobody should read that on a card they
  // post to a group chat.
  ctx.fillText("Open bowling", 80, 84);

  ctx.fillStyle = c.text || "#F4F0E6";
  ctx.font = `700 60px ${fonts?.display || fonts?.body || "system-ui, sans-serif"}`;
  ctx.fillText("Standings", 80, 132);

  if (!list.length) {
    ctx.fillStyle = c.textMuted || "#9A8F80";
    ctx.font = `500 30px ${fonts?.body || "system-ui, sans-serif"}`;
    ctx.fillText("No nights bowled yet.", 80, 260);
  }

  let y = 268;
  const rowH = 66;
  list.forEach((r, i) => {
    const mine = !!me && r.bowler === me;
    if (i > 0) {
      ctx.strokeStyle = c.border || "#332B22";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(80, y - 10); ctx.lineTo(W - 80, y - 10); ctx.stroke();
    }
    // The bowler's own row is marked, because the first thing anyone
    // does with a table they are in is look for themselves.
    ctx.fillStyle = mine ? (c.accent || "#E8A33D") : (c.textMuted || "#9A8F80");
    ctx.font = `700 34px ${fonts?.body || "system-ui, sans-serif"}`;
    ctx.fillText(String(i + 1), 80, y + 6);

    ctx.fillStyle = mine ? (c.accent || "#E8A33D") : (c.text || "#F4F0E6");
    ctx.font = `${mine ? 700 : 500} 38px ${fonts?.body || "system-ui, sans-serif"}`;
    ctx.fillText(String(r.bowler || "").slice(0, 22), 150, y);

    ctx.textAlign = "right";
    ctx.fillStyle = c.text || "#F4F0E6";
    ctx.font = `700 40px ${fonts?.display || fonts?.body || "system-ui, sans-serif"}`;
    ctx.fillText(String(r.average ?? ""), W - 200, y);
    ctx.fillStyle = c.textMuted || "#9A8F80";
    ctx.font = `500 26px ${fonts?.body || "system-ui, sans-serif"}`;
    ctx.fillText(`${r.games ?? 0}g`, W - 80, y + 10);
    ctx.textAlign = "left";

    y += rowH;
  });

  drawBrand(ctx, { x: 80, y: 962, size: 72, logo, colors: c, fonts });

  return true;
}

// Text for shared standings, for every tier below the image share.
// A bowler's badges, as a picture they can send on.
//
// The point is the IMAGE, not the app. Someone who bowls four times a
// year will post this to a group chat and never install anything, and
// that is a perfectly good outcome -- so the card has to stand alone:
// their name, what they earned, and enough branding that anyone curious
// knows where it came from.
export function drawBadgeCard(ctx, options) {
  if (!ctx || typeof ctx.fillRect !== "function") return null;
  const o = (options && typeof options === "object") ? options : {};
  const badges = Array.isArray(o.badges) ? o.badges.filter(b => b && typeof b === "object") : [];
  const name = typeof o.bowler === "string" ? o.bowler : "";
  const total = Number(o.total) || 0;
  const colors = o.colors || {};
  const fonts = o.fonts || {};

  const W = 1080, H = 1080;
  const bg = colors.bg || "#14110E";
  const text = colors.text || "#F5F1EA";
  const muted = colors.muted || "#9A9287";
  const accent = colors.accent || "#4ADE9B";
  const body = fonts.body || "system-ui, sans-serif";

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = text;
  ctx.font = `700 64px ${body}`;
  ctx.fillText(name || "Badges", 72, 130);

  ctx.fillStyle = accent;
  ctx.font = `700 40px ${body}`;
  ctx.fillText(`${badges.length}${total ? ` of ${total}` : ""} badges`, 72, 196);

  // The badges themselves, two columns. Capped at twelve: a card people
  // actually look at beats a complete one they scroll past.
  const shown = badges.slice(0, 12);
  ctx.font = `500 34px ${body}`;
  shown.forEach((b, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 72 + col * 480;
    const y = 300 + row * 92;
    ctx.fillStyle = text;
    ctx.fillText(`${b.emoji || ""} ${b.name || ""}`.trim().slice(0, 26), x, y);
    if (b.count > 1) {
      ctx.fillStyle = muted;
      ctx.font = `500 26px ${body}`;
      ctx.fillText(`x${b.count}`, x + 380, y);
      ctx.font = `500 34px ${body}`;
    }
  });

  if (badges.length > shown.length) {
    ctx.fillStyle = muted;
    ctx.font = `500 30px ${body}`;
    ctx.fillText(`and ${badges.length - shown.length} more`, 72, 300 + Math.ceil(shown.length / 2) * 92 + 20);
  }

  // Logo and name bottom left, as on every other card.
  drawBrand(ctx, { x: 72, y: H - 132, size: 72, logo: o.logo, colors: { ...colors, textMuted: muted }, fonts });

  return { width: W, height: H };
}

// The words that go with the picture, for a text message.
// `collection` is for sharing the whole Badges screen rather than one
// night's haul: "earned 7 of 30 badges", not "7 badges tonight".
export function badgeShareText(bowler, badges, link, { collection = false, total = 0 } = {}) {
  const name = typeof bowler === "string" && bowler.trim() ? bowler.trim() : "You";
  const list = Array.isArray(badges) ? badges.filter(b => b && typeof b === "object") : [];
  const outOf = Number(total) > 0 ? ` of ${Number(total)}` : "";
  const head = collection
    ? `${name} has earned ${list.length}${outOf} badge${list.length === 1 && !outOf ? "" : "s"}`
    : list.length === 1
      ? `${name} earned a badge tonight`
      : `${name} earned ${list.length} badges tonight`;
  const top = list.slice(0, 3).map(b => `${b.emoji || ""} ${b.name || ""}`.trim()).join(", ");
  const tail = typeof link === "string" && link ? `\n\nKeep them: ${link}` : "";
  return `${head}${top ? ` — ${top}` : ""}.${tail}`;
}

export function standingsShareText(arg) {
  // A default parameter covers undefined, not null.
  const { rows, me } = (arg && typeof arg === "object") ? arg : {};
  // Rows are filtered to real objects, not merely checked for being an
  // array. A null or a stray number in the list throws on .bowler and
  // takes the whole share down with it -- HANDOFF 4.4, guards that
  // check null but not type. My first version of this did exactly
  // that, and a test caught it.
  const list = (Array.isArray(rows) ? rows : [])
    .filter(r => r && typeof r === "object")
    .slice(0, 10);
  if (!list.length) return `Standings\n\nTracked with ${APP_NAME} — ${APP_URL}`;
  const lines = list.map((r, i) =>
    `${i + 1}. ${r.bowler}${!!me && r.bowler === me ? " (me)" : ""} — ${r.average} avg, ${r.games ?? 0} games`);
  return ["Standings", ...lines, "", `Tracked with ${APP_NAME} — ${APP_URL}`].join("\n");
}

// ── A whole tournament, on one card ─────────────────────────────────────
//
// A league night is one number: the series. A tournament is a day with
// phases -- qualifying against a cut, then match play, then a ladder --
// and the thing a bowler wants to post is how it FINISHED, with the
// bowling that got them there underneath it.
//
// So the big number is the qualifying total, the headline above it is
// the finish where there is one, and each phase gets a line of its own.
// Everything is optional: most tournaments end at qualifying, and a card
// that prints "Match play: —" says the bowler failed at something they
// never entered.

// What to call each finish, on a card.
const FINISH_LABEL = {
  won: "WON IT",
  runnerUp: "RUNNER-UP",
  topFive: "TOP FIVE",
  cashed: "CASHED",
  madeCut: "MADE THE CUT",
};

function finishLabel(id) {
  return Object.prototype.hasOwnProperty.call(FINISH_LABEL, id) ? FINISH_LABEL[id] : "";
}

function ord(n) {
  const v = Math.abs(Math.round(Number(n)));
  if (!Number.isFinite(v)) return "";
  const r100 = v % 100;
  if (r100 >= 11 && r100 <= 13) return `${v}th`;
  const r10 = v % 10;
  return `${v}${r10 === 1 ? "st" : r10 === 2 ? "nd" : r10 === 3 ? "rd" : "th"}`;
}

// The phase lines, in the order they were bowled. Shared by the card and
// the text so the two cannot describe different days.
export function tournamentLines(t) {
  const o = (t && typeof t === "object") ? t : {};
  const out = [];
  const num = v => (Number.isFinite(Number(v)) ? Number(v) : null);

  const total = num(o.total), games = num(o.games);
  if (total !== null && games) {
    // The average is SCRATCH pins over games, always. total includes
    // handicap in a handicap event -- it is the number on the sheet --
    // and dividing that by games gave a handicapped bowler an average
    // twenty pins better than the one they bowl.
    const scratch = num(o.scratch);
    const avg = Math.floor((scratch ?? total) / games);
    const hcp = scratch !== null && total > scratch ? total - scratch : 0;
    out.push(`Qualifying: ${total} across ${games} game${games === 1 ? "" : "s"}`
      + (hcp ? ` (${scratch} scratch + ${hcp} hcp)` : "")
      + ` \u00b7 ${avg} average`);
  }
  const cut = num(o.cutMargin);
  if (cut !== null) {
    out.push(cut >= 0 ? `Made the cut by ${cut}` : `Missed the cut by ${Math.abs(cut)}`);
  }
  const mp = o.matchPlay;
  if (mp && num(mp.played)) {
    const rec = mp.ties ? `${mp.wins}-${mp.losses}-${mp.ties}` : `${mp.wins}-${mp.losses}`;
    const bonus = num(mp.total) !== null ? `, ${mp.total} with bonus` : "";
    out.push(`Match play: ${rec}${bonus}`);
  }
  const sl = o.stepladder;
  if (sl && num(sl.played)) {
    const seed = num(sl.seed) ? ` from the ${ord(sl.seed)} seed` : "";
    const place = num(sl.place);
    out.push(place === 1
      ? `Won the stepladder${seed}`
      : place
        ? `Stepladder: ${ord(place)}${seed}`
        : `Stepladder: ${sl.wins} of ${sl.played} steps won${seed}`);
  }
  const net = num(o.net);
  if (net !== null && net !== 0) {
    out.push(net > 0 ? `Up $${Math.abs(net).toFixed(2)} on the day` : `Down $${Math.abs(net).toFixed(2)} on the day`);
  }
  return out;
}

export function drawTournamentCard(ctx, { bowler, event, center, date, tournament, colors, fonts, logo } = {}) {
  if (!ctx || typeof ctx.fillRect !== "function") return null;
  const W = 1080, H = 1080;
  const c = colors || {};
  const t = (tournament && typeof tournament === "object") ? tournament : {};

  ctx.fillStyle = c.bg || "#14110E";
  ctx.fillRect(0, 0, W, H);
  ctx.textBaseline = "top";

  // Who, what and when.
  ctx.fillStyle = c.textMuted || "#9A8F80";
  ctx.font = `500 34px ${fonts?.body || "system-ui, sans-serif"}`;
  ctx.fillText([bowler, date].filter(Boolean).join("   "), 80, 84);

  ctx.fillStyle = c.text || "#F4F0E6";
  ctx.font = `700 52px ${fonts?.body || "system-ui, sans-serif"}`;
  ctx.fillText(String(event || "Tournament").slice(0, 34), 80, 132);

  if (center) {
    ctx.fillStyle = c.textMuted || "#9A8F80";
    ctx.font = `500 30px ${fonts?.body || "system-ui, sans-serif"}`;
    ctx.fillText(String(center).slice(0, 44), 80, 196);
  }

  // The finish, where the event settled it. In the accent colour and
  // above the number, because it is the headline and the pins are the
  // evidence.
  const finish = finishLabel(t.placement);
  let y = 250;
  if (finish) {
    ctx.fillStyle = c.accent || "#E8A33D";
    ctx.font = `700 76px ${fonts?.body || "system-ui, sans-serif"}`;
    ctx.fillText(finish, 78, y);
    y += 96;
  }

  // The pins.
  const total = Number.isFinite(Number(t.total)) ? Number(t.total) : null;
  const games = Number.isFinite(Number(t.games)) ? Number(t.games) : 0;
  ctx.fillStyle = c.text || "#F4F0E6";
  ctx.font = `700 210px ${fonts?.num || "system-ui, sans-serif"}`;
  ctx.fillText(total === null ? "\u2014" : String(total), 72, y);
  y += 220;
  ctx.fillStyle = c.textMuted || "#9A8F80";
  ctx.font = `500 34px ${fonts?.body || "system-ui, sans-serif"}`;
  if (total !== null && games) {
    // Scratch average, for the same reason as tournamentLines.
    const scratch = Number.isFinite(Number(t.scratch)) ? Number(t.scratch) : total;
    ctx.fillText(`${games} game${games === 1 ? "" : "s"} \u00b7 ${Math.floor(scratch / games)} average`, 84, y);
  }
  y += 62;

  // Every phase, one line each. Capped so a long day cannot run into
  // the attribution at the bottom.
  const lines = tournamentLines(t).slice(1, 6);
  ctx.font = `500 34px ${fonts?.body || "system-ui, sans-serif"}`;
  lines.forEach((line, i) => {
    ctx.fillStyle = c.accent || "#E8A33D";
    ctx.fillText("\u2022", 84, y + i * 52);
    ctx.fillStyle = c.text || "#F4F0E6";
    ctx.fillText(String(line), 116, y + i * 52);
  });

  drawBrand(ctx, { x: 80, y: 948, size: 84, logo, colors: c, fonts, nameSize: 40, urlSize: 30 });
  return true;
}

export function tournamentShareText(arg) {
  const { bowler, event, center, date, tournament } = (arg && typeof arg === "object") ? arg : {};
  const t = (tournament && typeof tournament === "object") ? tournament : {};
  const who = bowler ? `${bowler} bowled` : "Bowled";
  const what = event ? ` ${event}` : " a tournament";
  const where = center ? ` at ${center}` : "";
  const when = date ? ` on ${date}` : "";
  const finish = finishLabel(t.placement);
  const head = finish
    ? `${who}${what}${where}${when} \u2014 ${finish.toLowerCase()}.`
    : `${who}${what}${where}${when}.`;
  const lines = tournamentLines(t);
  return [head, ...(lines.length ? ["", ...lines.map(l => `\u2022 ${l}`)] : []), "", `Tracked with ${APP_NAME} \u2014 ${APP_URL}`].join("\n");
}

// ── QR code, for a card that gets printed or just looked at ─────────────
//
// The url text works when the card is viewed on a phone -- someone can
// read it and type it in. It does nothing for a screenshot posted to
// Instagram, a photo of a phone screen, or a printed scoresheet pinned to
// a league board. A QR code is tappable from a photo of a photo.
//
// Optional and drawn last, so it's additive to the mark+name+url that
// already carry attribution -- if the QR can't be generated (offline, the
// qrcode package unavailable) the card still says where it came from.
export async function drawShareQr(ctx, x, y, size, QRCode) {
  if (!ctx || !QRCode) return false;
  try {
    const dataUrl = await QRCode.toDataURL(APP_URL, { width: size, margin: 0 });
    const img = await new Promise((resolve, reject) => {
      const im = new Image();
      im.onload = () => resolve(im);
      im.onerror = reject;
      im.src = dataUrl;
    });
    // A small quiet plate behind it: a QR code needs contrast to scan,
    // and it's drawn near the accent-colored wordmark, not guaranteed
    // to sit on the plain background.
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(x - 8, y - 8, size + 16, size + 16);
    ctx.drawImage(img, x, y, size, size);
    return true;
  } catch {
    return false;
  }
}
