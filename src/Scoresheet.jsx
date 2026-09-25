import { useRef, useEffect, useState, useCallback } from "react";
import { C, S } from "./ui.jsx";
import { frameScoresheet } from "./domain/scoring.js";
import { PIN_ROWS, rowPinDecks, frameWidthUnits } from "./domain/pinRack.js";

// The ten frames, the way a bowler already pictures a game.
//
// Editing a frame used to mean History > Shots > scroll until you find
// it. That's a database view of something every bowler reads as a
// scoresheet: ten boxes left to right, marks in the corners, a running
// total underneath. Tapping the frame you want is how it should work.
//
// Live: it rebuilds from `shots` on every render, so a mark appears the
// moment a shot is saved rather than after leaving and returning.
//
// ── Five frames, not ten ────────────────────────────────────────────────
//
// Ten frames across a phone gave each one 32px, which is enough for two
// marks and a number and nothing else. Five frames get 65px, which is
// enough to draw the rack -- and the rack is the whole point: "8 1" says
// the frame was open, the hollow 7 says which pin beat you.
//
// The other five are a swipe away, and the row follows the frame being
// bowled on its own (see the scroll rules below).

const VISIBLE_FRAMES = 5;
const GAP = 3;

// One share of the row: the visible width split five ways, gaps removed.
const SHARE = `((100% - ${(VISIBLE_FRAMES - 1) * GAP}px) / ${VISIBLE_FRAMES})`;

function pinStyle(state, split, size) {
  const base = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "50%",
    boxSizing: "border-box",
    display: "block",
  };
  if (state === "down1") return { ...base, backgroundColor: C.strike };
  if (state === "down2") return { ...base, backgroundColor: C.spare };
  // Stood on a 9-pin no-tap strike: counted, but it did not fall. A ring
  // in the strike colour -- part of the X, visibly not knocked down.
  if (state === "notap") return { ...base, backgroundColor: "transparent", border: `2px solid ${C.strike}` };
  // Standing. A split gets the miss colour AND a heavier stroke -- one
  // hue at this size is a thin signal, and it is the wrong one to lose.
  if (state === "standing") {
    return split
      ? { ...base, backgroundColor: C.miss + "1F", border: `2px solid ${C.miss}` }
      : { ...base, backgroundColor: "transparent", border: `1.5px solid ${C.textMuted}` };
  }
  return { ...base, backgroundColor: "transparent", border: `1px solid ${C.border}` };
}

function Rack({ deck, size }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
      {PIN_ROWS.map((row, ri) => (
        <div key={ri} style={{ display: "flex", gap: size > 8 ? "3px" : "2px" }}>
          {row.map(p => (
            <span key={p} style={pinStyle(deck.states[p], deck.split, size)} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Scoresheet({
  shots = [],
  currentFrame = null,   // string|number — the frame being logged now
  currentBall = null,    // 1|2|3 within the tenth
  // Which game this card is. Only used to notice when it CHANGES: a new
  // game is a new card, and it has to start at frame 1 with the row
  // scrolled all the way back.
  //
  // Passed explicitly rather than inferred from "currentFrame went 10 ->
  // 1" or "shots emptied", because both of those also happen when a
  // bowler taps frame 1 to correct it, and re-deriving it here would be
  // a second, worse copy of something the caller already knows.
  game = null,
  onSelectFrame,         // (frame, shot) => void
  bowlerName = "",       // whose card this is
  maxScore = null,       // ceiling if they strike out from here
  // Which corner pin "Weak 10" / "Ringing 10" actually means. Those
  // results store no pin number -- the pin is in the name, canonical for
  // both hands -- so the rack cannot draw them without knowing the hand.
  leftHanded = false,
  // All ten frames at once, wrapping onto a second row, instead of five
  // with the rest a swipe away. For reviewing a finished card (the
  // import), where every frame matters equally and nothing is live.
  wrap = false,
}) {
  const rows = frameScoresheet(shots);
  const scrollerRef = useRef(null);
  const autoLeftRef = useRef(0);

  // Manual scroll wins.
  //
  // Swiping back to check frame 2 and being yanked forward by a save is
  // the kind of thing that makes a live-updating list unusable. So once
  // the bowler scrolls away from the live frame the row stops following,
  // and starts again only when they bring that frame back into view --
  // the same rule a chat window uses for new messages.
  const [following, setFollowing] = useState(true);

  // Nothing bowled and nothing in progress: a row of ten empty boxes is
  // just noise before the first ball.
  const anything = rows.some(r => r.marks.length || r.running != null);

  const scrollToCurrent = useCallback((smooth) => {
    const scroller = scrollerRef.current;
    if (!scroller || currentFrame == null) return;
    const el = scroller.querySelector(`[data-frame="${currentFrame}"]`);
    if (!el) return;

    // Right-align the live frame, clamped at zero.
    //
    // The clamp IS the "always show five" rule: for frames 1-5 the target
    // is negative, so the row simply stays put. From frame 6 on it slides
    // one frame at a time, and the frame being bowled is never the
    // leftmost one -- the two or three before it stay in view, which is
    // what a bowler actually glances at.
    const target = Math.max(0, el.offsetLeft + el.offsetWidth - scroller.clientWidth);
    const reduced = typeof window !== "undefined"
      && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    autoLeftRef.current = target;

    // Feature-detected, not assumed. jsdom does not implement scrollTo on
    // elements, and this runs on mount -- an unguarded call would throw
    // inside every test that renders a scoresheet, turning a cosmetic
    // nicety into a suite-wide failure. Setting scrollLeft works
    // everywhere and is the correct fallback rather than a stub.
    if (typeof scroller.scrollTo === "function") {
      scroller.scrollTo({ left: target, behavior: smooth && !reduced ? "smooth" : "auto" });
    } else {
      scroller.scrollLeft = target;
    }
  }, [currentFrame]);

  // Follow the game. Keyed on the shot count as well as the frame so the
  // tenth -- three balls inside one frame number -- still advances.
  useEffect(() => {
    if (!following) return;
    scrollToCurrent(true);
  }, [currentFrame, shots.length, following, scrollToCurrent]);

  // A new game starts the row over at frame 1.
  //
  // This deliberately ignores `following`. That rule protects a bowler
  // reading back through the game they are bowling -- but the tenth is
  // the frame most likely to have been scrolled to by hand, so at the
  // exact moment the game ends, `following` is very often false. The row
  // then stayed parked on frame 10 of a card that no longer exists while
  // the new game's frame 1 sat off-screen to the left.
  //
  // There is nothing to protect here: the shots are gone and the frames
  // under the scroll position belong to a different game. Following
  // resumes too, since frame 1 IS the live frame now.
  //
  // Not smooth: the old game sliding away frame by frame reads as the
  // row losing its place rather than a new card arriving.
  const prevGame = useRef(game);
  useEffect(() => {
    if (prevGame.current === game) return;
    prevGame.current = game;

    const scroller = scrollerRef.current;
    if (!scroller) return;
    autoLeftRef.current = 0;
    if (typeof scroller.scrollTo === "function") {
      scroller.scrollTo({ left: 0, behavior: "auto" });
    } else {
      scroller.scrollLeft = 0;
    }
    setFollowing(true);
  }, [game]);

  const onScroll = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller || currentFrame == null) return;
    const el = scroller.querySelector(`[data-frame="${currentFrame}"]`);
    if (!el) return;

    // Is the live frame fully in view? If so we are effectively where the
    // follow would put us, so resume; otherwise the bowler is reading
    // somewhere else and should be left alone.
    const left = el.offsetLeft - scroller.scrollLeft;
    const right = left + el.offsetWidth;
    const visible = left >= -1 && right <= scroller.clientWidth + 1;
    setFollowing(prev => (prev === visible ? prev : visible));
  }, [currentFrame]);

  if (!anything && !currentFrame) return null;

  return (
    <div style={{ ...S.card, padding: "12px 10px 10px", marginBottom: "12px" }}>
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        style={{
          display: "flex",
          gap: `${GAP}px`,
          // Centred rows when wrapped: 5, then 4, then the tenth -- a
          // rack's shape, and no ragged gap at the end of each row.
          ...(wrap ? { flexWrap: "wrap", justifyContent: "center" } : {
            overflowX: "auto",
            // Momentum on iOS, and no vertical bounce stealing the gesture.
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
          }),
        }}
      >
        {rows.map(r => {
          const isCurrent = String(r.frame) === String(currentFrame);
          const tenth = r.frame === 10;
          const bowled = r.marks.length > 0;
          const decks = rowPinDecks(r, leftHanded);

          // The tenth takes the room its decks need and no more: an open
          // tenth never reset, so it is exactly as wide as any other
          // frame. A wide tenth means marks, which is readable from the
          // shape of the box before a single pin is.
          const units = tenth ? frameWidthUnits(decks.length) : 1;
          const pinSize = tenth && decks.length > 1 ? 7 : 9;

          return (
            <button
              key={r.frame}
              data-frame={r.frame}
              /* The tenth's other balls travel with the tap.

                 The row only ever passed r.shot, which is ball 1 -- so
                 tapping the tenth could only ever edit the first ball,
                 with no way to reach a bad second or fill ball. */
              onClick={() => onSelectFrame?.(r.frame, r.shot, r.tenth)}

              aria-label={`Frame ${r.frame}${bowled ? `, ${r.marks.join(" ")}` : ", not bowled"}${r.running != null ? `, running ${r.running}` : ""}`}
              style={{
                flex: `0 0 calc(${SHARE} * ${units})`,
                padding: 0,
                cursor: "pointer",
                background: isCurrent ? C.accent + "14" : "transparent",
                border: `1px solid ${isCurrent ? C.accent : C.border}`,
                borderRadius: "8px",
                color: C.text,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* Frame number, small — it's an index, not the content. */}
              <div style={{
                fontSize: "10px",
                color: isCurrent ? C.accent : C.textMuted,
                fontWeight: isCurrent ? 600 : 400,
                lineHeight: 1,
                paddingTop: "4px",
              }}>
                {r.frame}
              </div>

              {/* One rack per deck. An unbowled frame draws none rather
                  than an empty deck: ten faint circles in every frame
                  ahead of the bowler is noise, and it makes the card
                  look busier the LESS has happened. */}
              <div style={{
                display: "flex",
                gap: "4px",
                padding: "5px 0 6px",
                minHeight: "40px",
                alignItems: "center",
              }}>
                {decks.map((d, i) => <Rack key={i} deck={d} size={pinSize} />)}
              </div>

              {/* Marks. The tenth gets three boxes; every other frame two. */}
              <div style={{ display: "flex", justifyContent: "center", gap: "2px", minHeight: "20px", alignItems: "center" }}>
                {Array.from({ length: tenth ? 3 : 2 }).map((_, i) => (
                  <span key={i} style={{
                    width: tenth ? "16px" : "19px",
                    fontSize: "15px",
                    fontWeight: 700,
                    lineHeight: "20px",
                    color: r.marks[i] === "X" || r.marks[i] === "/" ? C.strike : C.text,
                  }}>
                    {r.marks[i] || ""}
                  </span>
                ))}
              </div>

              {/* Running total. Blank when it genuinely isn't known yet --
                  frame 7 can't be scored until 8 and 9 are bowled, and a
                  provisional number there would be a lie. */}
              <div style={{
                width: "100%",
                fontSize: "14px",
                fontWeight: 700,
                lineHeight: "22px",
                minHeight: "22px",
                marginTop: "auto",
                color: r.running != null ? C.text : C.textMuted,
                borderTop: `1px solid ${C.border}`,
              }}>
                {r.running != null ? r.running : ""}
              </div>
            </button>
          );
        })}
      </div>

      {/* Whose card this is, and what the game can still reach.

          The name matters when logging for a teammate: the frames look
          identical whoever they belong to, and entering someone else's
          shots under your own name is the most common first-session
          mistake. The max is a fact about the game, so it belongs here
          rather than above the result buttons. */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        marginTop: "8px", fontSize: "10px", color: C.textMuted,
      }}>
        <span style={{ fontWeight: 600, color: bowlerName ? C.text : C.textMuted }}>
          {bowlerName || ""}
        </span>
        <span>
          {currentFrame ? "Tap any frame to edit" : ""}
          {currentBall && Number(currentFrame) === 10 ? ` · ball ${currentBall}` : ""}
        </span>
        <span style={{ color: C.accent, fontWeight: 600 }}>
          {maxScore != null ? `${maxScore} max` : ""}
        </span>
      </div>
    </div>
  );
}
