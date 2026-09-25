// Reading pin decks from the PIXELS of a scorecard image, not from AI.
//
// Why this exists. The vision model reads the marks and scores on a
// LaneTalk-style card well, and the pin decks badly: on a real 226 / 208
// / 154 card it got the right NUMBER of pins in every frame and the wrong
// PINS in ten of thirty -- 4 read as 10, 2-5 as 3-6, 3-6-10 as 4-7-8.
// The totals still added up, so nothing downstream could tell.
//
// The drawing itself is completely regular: every frame is a light-grey
// cell holding ten dots at fixed positions in a triangle, and each dot's
// colour says what happened to that pin. So the positions can be measured
// once and every dot's colour read directly -- no judgement involved.
//
//   grey dot             knocked down by the first ball
//   green dot            left by the first ball, knocked down by the second
//   white dot, dark ring left standing after both balls
//
// Everything here is pure: it takes {width, height, data} (the shape of a
// canvas ImageData, RGBA bytes) and returns what it read, or null for any
// part it is not sure of. The caller only uses a frame when this reading
// agrees with the AI's pin COUNT for it, so a card in some other style --
// or a frame this misreads -- falls back to the AI and the review screen.

// The rack, row by row from the back, left to right as drawn.
const ROWS = [[7, 8, 9, 10], [4, 5, 6], [2, 3], [1]];
const CELL_GREY = 215;

function isCellGrey(d, i) {
  return Math.abs(d[i] - CELL_GREY) < 14 && Math.abs(d[i + 1] - CELL_GREY) < 14 && Math.abs(d[i + 2] - CELL_GREY) < 14;
}

function median(xs) {
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

// The grey strips: runs of rows where a good share of pixels are the
// cell grey. Rows through the dots have fewer grey pixels, so nearby runs
// are merged.
function findBands(img) {
  const { width: W, height: H, data: d } = img;
  const bands = [];
  const minH = Math.max(20, Math.round(W * 0.035));
  for (let y = 0; y < H; y++) {
    let n = 0;
    for (let x = 0; x < W; x++) if (isCellGrey(d, (y * W + x) * 4)) n++;
    if (n / W > 0.25) {
      const last = bands[bands.length - 1];
      if (last && y - last[1] <= Math.max(6, Math.round(W * 0.011))) last[1] = y + 1;
      else bands.push([y, y + 1]);
    }
  }
  return bands.filter(([a, b]) => b - a >= minH);
}

// Frame cells inside a strip, split at the dark vertical lines.
function findCells(img, y0, y1) {
  const { width: W, data: d } = img;
  const h = y1 - y0;
  const seps = [];
  for (let x = 0; x < W; x++) {
    let grey = 0, sum = 0;
    for (let y = y0; y < y1; y++) {
      const i = (y * W + x) * 4;
      if (isCellGrey(d, i)) grey++;
      sum += (d[i] + d[i + 1] + d[i + 2]) / 3;
    }
    // A cell line has almost no cell grey in it (a column through the
    // dots still has plenty). Its darkness varies with scaling, so it is
    // not tested.
    if (grey / h < 0.15) seps.push(x);
  }
  const cuts = [];
  let prev = -10;
  for (const x of seps) { if (x - prev > 3) cuts.push(x); prev = x; }
  const edges = [0, ...cuts, W];
  const minW = Math.max(20, Math.round(W * 0.04));
  const cells = [];
  for (let i = 0; i + 1 < edges.length; i++) if (edges[i + 1] - edges[i] >= minW) cells.push([edges[i], edges[i + 1]]);
  return cells;
}

// The dots in one cell, as centroids: connected blobs of anything that is
// not cell grey, ignoring anything touching the cell's edge (the lines).
function dotsIn(img, y0, y1, x0, x1) {
  const { width: W, data: d } = img;
  const w = x1 - x0, h = y1 - y0;
  const scale = W / 1080;
  const minArea = Math.max(12, Math.round(40 * scale * scale));
  const mark = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = ((y0 + y) * W + x0 + x) * 4;
    const diff = Math.max(Math.abs(d[i] - CELL_GREY), Math.abs(d[i + 1] - CELL_GREY), Math.abs(d[i + 2] - CELL_GREY));
    if (diff > 30) mark[y * w + x] = 1;
  }
  const seen = new Uint8Array(w * h);
  const dots = [];
  const stack = [];
  for (let s = 0; s < w * h; s++) {
    if (!mark[s] || seen[s]) continue;
    let n = 0, sx = 0, sy = 0, edge = false;
    stack.push(s); seen[s] = 1;
    while (stack.length) {
      const p = stack.pop();
      const px = p % w, py = (p - px) / w;
      n++; sx += px; sy += py;
      if (px <= 1 || px >= w - 2 || py <= 0 || py >= h - 1) edge = true;
      for (const q of [p - 1, p + 1, p - w, p + w]) {
        if (q < 0 || q >= w * h || seen[q] || !mark[q]) continue;
        if ((q === p - 1 && px === 0) || (q === p + 1 && px === w - 1)) continue;
        seen[q] = 1; stack.push(q);
      }
    }
    if (n >= minArea && !edge) dots.push({ y: sy / n, x: sx / n });
  }
  return dots;
}

// Dots grouped into rows; a clean rack is rows of 4, 3, 2 and 1.
function rowsOf(dots, tol) {
  const sorted = [...dots].sort((a, b) => a.y - b.y);
  const rows = [];
  for (const p of sorted) {
    const last = rows[rows.length - 1];
    if (last && Math.abs(last[0].y - p.y) < tol) last.push(p);
    else rows.push([p]);
  }
  return rows.map(r => r.sort((a, b) => a.x - b.x));
}

function averageAt(img, cx, cy, r = 2) {
  const { width: W, height: H, data: d } = img;
  let R = 0, G = 0, B = 0, n = 0;
  for (let y = Math.round(cy) - r; y <= Math.round(cy) + r; y++) for (let x = Math.round(cx) - r; x <= Math.round(cx) + r; x++) {
    if (x < 0 || y < 0 || x >= W || y >= H) continue;
    const i = (y * W + x) * 4;
    R += d[i]; G += d[i + 1]; B += d[i + 2]; n++;
  }
  return n ? [R / n, G / n, B / n] : null;
}

// A dot's state, judged against its own cell's background rather than a
// fixed grey: LaneTalk tints a highlighted frame yellow, and every dot in
// it is tinted too -- a grey "down" dot there reads as olive, not grey.
function classify(img, cx, cy, bg) {
  const c = averageAt(img, cx, cy);
  if (!c || !bg) return null;
  const [r, g, b] = c;
  const lum = (r + g + b) / 3, bgLum = (bg[0] + bg[1] + bg[2]) / 3;
  if (g > r + 40 && g > b + 20) return "converted";
  if (Math.min(r, g, b) > 230 || lum > bgLum + 15) return "missed";
  if (lum < bgLum * 0.8) return "down";
  return null;
}

// The cell's own background: the middle value of four samples just
// inside its corners, clear of the dots and the dividing lines.
function cellBackground(img, y0, y1, x0, x1) {
  const pts = [[x0 + 4, y0 + 3], [x1 - 5, y0 + 3], [x0 + 4, y1 - 4], [x1 - 5, y1 - 4]]
    .map(([x, y]) => averageAt(img, x, y, 1)).filter(Boolean)
    .sort((a, b) => (a[0] + a[1] + a[2]) - (b[0] + b[1] + b[2]));
  return pts.length ? pts[pts.length >> 1] : null;
}

// Reads every frame of every strip. Returns
//   { strips: [ { frames: [ {leave:[..], missed:[..]} | null ] } ], lattice: n }
// or null when the image does not look like this kind of card at all.
export function readPinDecks(img) {
  if (!img || !img.width || !img.height || !img.data) return null;
  const bands = findBands(img);
  if (!bands.length) return null;
  const tol = Math.max(4, 8 * (img.width / 1080));

  // Learn where each pin sits from every cell whose rack is clean.
  const samples = {};
  for (const row of ROWS) for (const p of row) samples[p] = [];
  const layout = bands.map(([y0, y1]) => ({ y0, y1, cells: findCells(img, y0, y1) }));
  let clean = 0;
  for (const band of layout) for (const [x0, x1] of band.cells) {
    const rows = rowsOf(dotsIn(img, band.y0, band.y1, x0, x1), tol);
    if (rows.map(r => r.length).join() !== "4,3,2,1") continue;
    clean++;
    const mid = (x1 - x0) / 2;
    rows.forEach((r, ri) => r.forEach((p, i) => samples[ROWS[ri][i]].push({ dy: p.y, dx: p.x - mid })));
  }
  // One clean cell could be a coincidence; three is a layout.
  if (clean < 3) return null;
  const lattice = {};
  for (const [pin, s] of Object.entries(samples)) lattice[pin] = { dy: median(s.map(v => v.dy)), dx: median(s.map(v => v.dx)) };

  const strips = layout.map(band => {
    if (band.cells.length !== 10) return { frames: null };
    const frames = band.cells.map(([x0, x1]) => {
      const mid = (x1 - x0) / 2;
      const bg = cellBackground(img, band.y0, band.y1, x0, x1);
      const leave = [], missed = [];
      for (const [pin, at] of Object.entries(lattice)) {
        const state = classify(img, x0 + mid + at.dx, band.y0 + at.dy, bg);
        if (!state) return null;
        if (state !== "down") leave.push(Number(pin));
        if (state === "missed") missed.push(Number(pin));
      }
      return { leave: leave.sort((a, b) => a - b), missed: missed.sort((a, b) => a - b) };
    });
    return { frames };
  });
  return { strips, lattice: clean };
}

// ── Putting the reading into the AI's games ───────────────────────────

function pinList(raw) {
  if (Array.isArray(raw)) return raw.map(String).map(s => s.trim()).filter(Boolean);
  if (typeof raw === "string") return raw.split(/[^0-9]+/).filter(Boolean);
  return [];
}

// Replaces the AI's pin identities with the pixel reading, frame by
// frame, ONLY where the two agree on how many pins were standing. The AI
// is good at counts and marks and those decide the score; the pixels are
// right about which pins. Anything that does not line up is left as the
// AI read it, for the review screen.
//
// Strips run top to bottom and are matched to games in order, and only
// on a one-bowler card with exactly one strip per game.
export function applyPinDecks(games, reading) {
  const result = { games, corrected: 0, confirmed: 0, kept: 0, applied: false, reason: "" };
  if (!reading || !Array.isArray(games) || !games.length) { result.reason = "no reading"; return result; }
  const withFrames = games.filter(g => Array.isArray(g?.frames) && g.frames.length);
  const names = new Set(withFrames.map(g => String(g?.bowlerName || "").trim().toLowerCase()).filter(Boolean));
  const positions = new Set(withFrames.map(g => g?.lineupPosition ?? 0));
  if (names.size > 1 || positions.size > 1) { result.reason = "more than one bowler"; return result; }
  const strips = reading.strips.filter(s => s.frames);
  if (strips.length !== withFrames.length || strips.length !== reading.strips.length) {
    result.reason = `${reading.strips.length} strips for ${withFrames.length} games`;
    return result;
  }
  const order = [...withFrames].sort((a, b) => (a.gameNumber ?? 0) - (b.gameNumber ?? 0));
  const stripFor = new Map(order.map((g, i) => [g, strips[i]]));

  result.games = games.map(g => {
    const strip = stripFor.get(g);
    if (!strip) return g;
    const frames = g.frames.map(f => ({ ...f, balls: Array.isArray(f?.balls) ? f.balls.map(b => ({ ...b })) : f?.balls }));
    for (const f of frames) {
      const n = Number(f?.frameNumber);
      const read = n >= 1 && n <= 10 ? strip.frames[n - 1] : null;
      const balls = Array.isArray(f?.balls) ? [...f.balls].sort((a, b) => (a.ballIndex ?? 0) - (b.ballIndex ?? 0)) : [];
      if (!read || !balls.length) {
        result.kept++;
        // A cell the reader could not make out -- LaneTalk draws a hand
        // instead of a rack on a frame that was corrected by hand. The
        // AI's reading of it is flagged for the review screen.
        if (!read && balls.length) f.needsReview = true;
        continue;
      }
      // [ball, pins it should have standing]
      const plan = [];
      // Frames 1-9 draw their only rack; the tenth draws the first rack
      // that was not a strike.
      const at = n < 10 ? (balls[0].isStrike ? -1 : 0) : balls.findIndex(b => !b.isStrike);
      if (at < 0) {
        // All strikes: the drawing must agree that nothing was left.
        if (read.leave.length) result.kept++; else result.confirmed++;
        continue;
      }
      plan.push([balls[at], read.leave]);
      if (balls[at + 1]) plan.push([balls[at + 1], read.missed]);
      // All or nothing: every ball's count must agree, or the frame is
      // left exactly as the AI read it.
      if (plan.some(([b, pins]) => pinList(b.pinsStanding).length !== pins.length)) { result.kept++; continue; }
      let changed = false;
      for (const [b, pins] of plan) {
        const next = pins.map(String);
        if (pinList(b.pinsStanding).sort().join() !== [...next].sort().join()) changed = true;
        b.pinsStanding = next;
      }
      if (changed) result.corrected++; else result.confirmed++;
    }
    return { ...g, frames };
  });
  result.applied = result.corrected + result.confirmed > 0;
  return result;
}
