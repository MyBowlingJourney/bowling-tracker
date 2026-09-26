// A picture of a stat card, exactly as it is on screen, for sharing.
//
// The card is copied with every element's computed style written inline,
// wrapped in an SVG <foreignObject>, and drawn onto a canvas -- so what
// is shared is what the bowler is looking at: the Viewing and Compare To
// choices, the league, the tab that is open, the chart as drawn. Nothing
// is recomputed for the picture, so it cannot disagree with the screen.
//
// The picture is then framed: what it is and whose numbers they are at
// the top (with any comparison), the app mark and a QR code at the
// bottom, so it says where it came from wherever it ends up.
//
// No library: html-to-image does the same thing and would be one more
// dependency in the lockfile for ~100 lines. Buttons marked
// data-share-exclude (the eye, the share icon itself) are left out.

import { drawBrand, drawShareQr } from "./domain/shareCard.js";

const XHTML = "http://www.w3.org/1999/xhtml";

function inlineStyles(src, dst) {
  if (!(src instanceof Element) || !(dst instanceof Element)) return;
  const cs = window.getComputedStyle(src);
  let css = "";
  for (let i = 0; i < cs.length; i++) {
    const p = cs[i];
    css += `${p}:${cs.getPropertyValue(p)};`;
  }
  dst.setAttribute("style", css);
  // Form controls show their CURRENT value, which lives in properties the
  // clone does not copy.
  if (src instanceof HTMLSelectElement) {
    const opts = dst.querySelectorAll("option");
    opts.forEach((o, i) => { if (i === src.selectedIndex) o.setAttribute("selected", "selected"); else o.removeAttribute("selected"); });
  } else if (src instanceof HTMLInputElement) {
    dst.setAttribute("value", src.value);
  }
  const a = src.children, b = dst.children;
  for (let i = 0; i < a.length && i < b.length; i++) inlineStyles(a[i], b[i]);
}

// The card as an <img>, at its on-screen size.
export async function snapshotNode(node) {
  if (typeof window === "undefined" || !node) return null;
  const rect = node.getBoundingClientRect();
  const width = Math.ceil(rect.width), height = Math.ceil(rect.height);
  if (!width || !height) return null;
  const clone = node.cloneNode(true);
  inlineStyles(node, clone);
  // Canvases lose their pixels when cloned; carry them over as images.
  const srcCanvases = node.querySelectorAll("canvas"), dstCanvases = clone.querySelectorAll("canvas");
  srcCanvases.forEach((c, i) => {
    try {
      const img = document.createElement("img");
      img.setAttribute("src", c.toDataURL());
      img.setAttribute("style", dstCanvases[i].getAttribute("style") || "");
      dstCanvases[i].replaceWith(img);
    } catch { /* a tainted canvas is left blank */ }
  });
  clone.querySelectorAll("[data-share-exclude]").forEach(el => el.remove());
  clone.style.margin = "0";
  // The shadow would be cut off at the picture edge and read as a smudge.
  clone.style.boxShadow = "none";
  clone.setAttribute("xmlns", XHTML);
  const html = new XMLSerializer().serializeToString(clone);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">`
    + `<foreignObject x="0" y="0" width="100%" height="100%">${html}</foreignObject></svg>`;
  const img = new Image();
  img.decoding = "sync";
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  });
  return { img, width, height };
}

function wrap(ctx, text, maxWidth) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (ctx.measureText(next).width > maxWidth && line) { lines.push(line); line = w; } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

// The shareable picture: title and context above, the card, brand below.
export async function renderCardShare(node, { title = "", context = "", colors = {}, fonts = {}, logo = null } = {}) {
  const snap = await snapshotNode(node);
  if (!snap) return null;
  const W = 1080, pad = 48;
  const scale = (W - pad * 2) / snap.width;
  const cardH = Math.round(snap.height * scale);
  const probe = document.createElement("canvas").getContext("2d");
  probe.font = `500 30px ${fonts.body || "system-ui, sans-serif"}`;
  const ctxLines = context ? wrap(probe, context, W - pad * 2) : [];
  const headH = 40 + 52 + (ctxLines.length ? ctxLines.length * 40 + 8 : 0) + 24;
  const footH = 180;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = headH + cardH + footH;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = colors.bg || "#0F1412";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.textBaseline = "top";
  let y = 40;
  ctx.fillStyle = colors.text || "#F4F0E6";
  ctx.font = `700 44px ${fonts.display || fonts.body || "system-ui, sans-serif"}`;
  ctx.fillText(title, pad, y);
  y += 52;
  ctx.fillStyle = colors.textMuted || "#9A8F80";
  ctx.font = `500 30px ${fonts.body || "system-ui, sans-serif"}`;
  for (const l of ctxLines) { ctx.fillText(l, pad, y); y += 40; }
  y = headH;
  ctx.drawImage(snap.img, pad, y, W - pad * 2, cardH);
  const fy = headH + cardH + 30;
  drawBrand(ctx, { x: pad, y: fy, size: 110, logo, colors, fonts });
  try {
    const { default: QRCode } = await import("qrcode");
    await drawShareQr(ctx, W - pad - 120, fy - 5, 120, QRCode);
  } catch { /* the mark and URL already say where it came from */ }
  return await new Promise(res => canvas.toBlob(res, "image/png"));
}
