import { useState, useEffect } from "react";
import { C, S, F } from "./ui.jsx";
import { shareText, shareTitle, drawShareCard, drawTrendCard, trendShareText, drawStandingsCard, standingsShareText, drawBadgeCard, badgeShareText, drawTournamentCard, tournamentShareText, drawShareQr } from "./domain/shareCard.js";
import logoUrl from "../mbj-logo-512.png";
import { t, tMessage } from "./i18n/index.js";

// The app icon, for the corner of every share card. It ships inside the
// app bundle, so it loads offline; loaded once and reused. A failed load
// resolves to null and the card draws its fallback mark instead.
let logoPromise = null;
function loadLogo() {
  if (typeof Image === "undefined") return Promise.resolve(null);
  if (!logoPromise) {
    logoPromise = new Promise(res => {
      const img = new Image();
      img.onload = () => res(img);
      img.onerror = () => { logoPromise = null; res(null); };
      img.src = logoUrl;
    });
  }
  return logoPromise;
}

// One tap to share a night's scores.
//
// Three tiers, best available first:
//   1. Native share sheet WITH the summary image (iOS, Android Chrome).
//      The picture is what gets posted; the text carries the link.
//   2. Native share sheet with text only, where files aren't supported.
//   3. Copy to clipboard, with the button saying so, for desktop or an
//      old browser. Nothing here can fail silently -- a share button
//      that does nothing is worse than no button.
//
// The attribution is in the text on every tier and drawn into the image
// on tier 1, so however it's shared, it says where it came from.

async function renderCardBlob(summary) {
  if (typeof document === "undefined") return null;
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 1080; canvas.height = 1080;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const logo = await loadLogo();
    // A trend is a shape over time, not a scoreline -- it gets the graph
    // card instead of the score card.
    // A tournament is a day of phases rather than one scoreline, so it
    // gets its own card: the finish on top, the pins under it, and a
    // line for each phase that was actually bowled.
    if (summary?.tournament) drawTournamentCard(ctx, { ...summary, colors: C, fonts: F, logo });
    else if (summary?.trend) drawTrendCard(ctx, { ...summary, colors: C, fonts: F, logo });
    // A running table is neither a scoreline nor a shape over time, so it
    // gets its own card rather than being forced into either.
    else if (summary?.standings) drawStandingsCard(ctx, { ...summary, colors: C, fonts: F, logo });
    // A badge card is meant to be posted somewhere, so it has to stand
    // alone: their name, what they earned, and the app name for anyone
    // who asks where it came from.
    else if (summary?.badges) drawBadgeCard(ctx, { ...summary, colors: C, fonts: F, logo });
    else drawShareCard(ctx, { ...summary, colors: C, fonts: F, logo });
    // Additive: mark+name+url are already drawn above, so a QR that
    // fails to load (offline, package unavailable) still leaves a card
    // that says where it came from -- it just can't be scanned.
    try {
      const { default: QRCode } = await import("qrcode");
      await drawShareQr(ctx, 900, summary?.trend ? 940 : 890, 130, QRCode);
    } catch {}
    return await new Promise(res => canvas.toBlob(res, "image/png"));
  } catch {
    return null;
  }
}

// Hand the picture to the phone's own share sheet.
//
// navigator.share does not exist inside an Android WebView, which is
// exactly where this app runs -- so every share on Android fell all the
// way through to "copy some text", which is what a shared night looked
// like: a list. Capacitor's Share plugin IS the native sheet, and
// Filesystem gives it a real file to hand over. Both are imported
// dynamically and either may be absent (the web build, an older
// install), so every step is allowed to fail into the next one.
async function shareNative({ blob, title, text }) {
  if (!blob) return false;
  try {
    const { Capacitor } = await import("@capacitor/core");
    if (!Capacitor?.isNativePlatform?.()) return false;
    const { Share } = await import("@capacitor/share");
    const { Filesystem, Directory } = await import("@capacitor/filesystem");
    const dataUrl = await new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(String(r.result || ""));
      r.onerror = rej;
      r.readAsDataURL(blob);
    });
    const base64 = dataUrl.split(",")[1];
    if (!base64) return false;
    // Cache, not Documents: a throwaway copy of a picture the app can
    // redraw any time, and it should not sit in the bowler's files.
    const path = `mbj-share-${Date.now()}.png`;
    const w = await Filesystem.writeFile({ path, data: base64, directory: Directory.Cache });
    await Share.share({ title, text, files: [w.uri] });
    try { await Filesystem.deleteFile({ path, directory: Directory.Cache }); } catch {}
    return true;
  } catch {
    return false;
  }
}

export default function ShareButton({ summary, label = "Share", compact = false, iconOnly = false }) {
  const [state, setState] = useState("idle"); // idle | working | copied | done | failed
  // The rendered card, held open for the preview sheet. Nothing else
  // keeps the object URL, so this component revokes it.
  const [preview, setPreview] = useState(null); // { url, text }

  useEffect(() => () => { if (preview?.url) { try { URL.revokeObjectURL(preview.url); } catch {} } }, [preview]);

  async function copyText(text) {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {}
    return false;
  }

  async function share() {
    setState("working");
    // Built in English by the share-card code, then put in the app's
    // language: this text leaves the app, so the page translator never
    // sees it. (The picture is drawn in the app's language by the canvas
    // hook in i18n/index.js.)
    // A picture made by the caller (a stat card, as it is on screen)
    // brings its own title and text; everything else is drawn here.
    const custom = typeof summary?.makeBlob === "function";
    const text = custom ? tMessage(summary.text || "") : tMessage(summary?.tournament ? tournamentShareText(summary)
      : summary?.trend ? trendShareText(summary)
      : summary?.standings ? standingsShareText(summary)
      : summary?.badges ? badgeShareText(summary.bowler, summary.badges, summary.link, { collection: !!summary.collection, total: summary.total })
      : shareText(summary));
    const title = custom ? t(summary.title || "") : t(summary?.tournament ? (summary.event || "Tournament")
      : summary?.trend ? (summary.label || "Trend")
      : summary?.standings ? "Standings"
      : summary?.badges ? "Badges"
      : shareTitle(summary));
    try {
      // The picture is the point, so it is drawn before anything decides
      // how to send it.
      const blob = custom
        ? await summary.makeBlob({ logo: await loadLogo(), colors: C, fonts: F }).catch(() => null)
        : await renderCardBlob(summary);

      if (await shareNative({ blob, title, text })) {
        setState("done"); setTimeout(() => setState("idle"), 1500);
        return;
      }

      if (typeof navigator !== "undefined" && navigator.share) {
        if (blob && navigator.canShare) {
          const file = new File([blob], "my-bowling-journey.png", { type: "image/png" });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({ title, text, files: [file] });
            setState("done"); setTimeout(() => setState("idle"), 1500);
            return;
          }
        }
        await navigator.share({ title, text });
        setState("done"); setTimeout(() => setState("idle"), 1500);
        return;
      }

      // Last resort is still the card, not a paragraph: show it, and let
      // them save it or copy the text from the same sheet. A bowler who
      // asks to share a night is never handed a list of numbers.
      if (blob) {
        setPreview({ url: URL.createObjectURL(blob), text });
        setState("idle");
        return;
      }

      if (await copyText(text)) {
        setState("copied"); setTimeout(() => setState("idle"), 2000);
        return;
      }
      setState("failed"); setTimeout(() => setState("idle"), 2000);
    } catch (e) {
      // AbortError is the person closing the sheet -- not a failure.
      if (e && e.name === "AbortError") { setState("idle"); return; }
      setState("failed"); setTimeout(() => setState("idle"), 2000);
    }
  }

  const caption =
    state === "working" ? "Preparing…" :
    state === "copied" ? "Copied — paste it anywhere" :
    state === "done" ? "Shared" :
    state === "failed" ? "Couldn't share on this device" :
    label;

  const sheet = preview && (
    <div role="dialog" aria-modal="true" aria-label="Share card"
      onClick={() => setPreview(null)}
      style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.72)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "18px", gap: "12px" }}>
      <img src={preview.url} alt="Share card"
        onClick={e => e.stopPropagation()}
        style={{ width: "100%", maxWidth: "420px", borderRadius: "14px", display: "block" }} />
      <div style={{ color: "#fff", fontSize: "12px", opacity: 0.85, textAlign: "center" }}>
        Press and hold the card to save or share it.
      </div>
      <div onClick={e => e.stopPropagation()}
        style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "420px" }}>
        <button style={{ ...S.btn(), flex: 1 }}
          onClick={async () => { const ok = await copyText(preview.text); setState(ok ? "copied" : "failed"); setTimeout(() => setState("idle"), 2000); }}>
          Copy text
        </button>
        <button style={{ ...S.btn(), flex: 1 }} onClick={() => setPreview(null)}>Close</button>
      </div>
    </div>
  );

  // Icon only, for the corner of a stat card beside the eye. A state
  // other than idle still says what happened, next to the icon.
  if (iconOnly) {
    return (
      <>
      {sheet}
      <button onClick={share} disabled={state === "working"} data-share-exclude=""
        aria-label={`Share ${summary?.title || "this card"}`} title={`Share ${summary?.title || "this card"}`}
        style={{ height: "30px", minWidth: "30px", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px",
          background: "none", border: "none", padding: 0, cursor: "pointer",
          color: C.textMuted, opacity: state === "working" ? 0.4 : 0.7, WebkitTapHighlightColor: "transparent" }}>
        {state !== "idle" && state !== "working" && (
          <span style={{ fontSize: "10px", color: C.textMuted, whiteSpace: "nowrap" }}>{caption}</span>
        )}
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
      </button>
      </>
    );
  }

  return (
    <>
    {sheet}
    <button onClick={share} disabled={state === "working"}
      style={compact
        ? { ...S.btn(), padding: "8px 12px", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px" }
        : { ...S.btn(), width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
      aria-label={`Share ${summary?.tournament ? (summary.event || "tournament") : shareTitle(summary)}`}>
      <span aria-hidden="true">↗</span>
      {caption}
    </button>
    </>
  );
}
