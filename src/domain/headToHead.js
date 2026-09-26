// One bowler's rate stats, the same way the Stats card and Compare To
// compute them -- so a head-to-head between two teammates reads the
// same numbers each of them sees on their own card.
import { strikeRateOf, freshRackShots, firstBallOf } from "./scoring.js";
import { isSplit, isCornerPinLeave, isSinglePinLeave } from "./splits.js";

const pct = (a, b) => (b ? Math.round((a / b) * 100) : null);
const avg = list => (list.length ? Math.round((list.reduce((a, b) => a + b, 0) / list.length) * 10) / 10 : null);

export function rateSummary(shots, { leftHanded = false } = {}) {
  const list = (Array.isArray(shots) ? shots : []).filter(s => s && typeof s === "object");
  const spAtt = list.filter(s => s.result !== "Strike" && s.spareMade !== "" && s.spareMade != null && !isSplit(s));
  const splits = list.filter(isSplit);
  const tenAtt = list.filter(s => isCornerPinLeave(s, leftHanded) && s.spareMade !== "" && s.spareMade != null);
  const oneAtt = list.filter(s => isSinglePinLeave(s) && s.spareMade !== "" && s.spareMade != null);
  const frames = list.filter(s => !s.ballNum || Number(s.ballNum) === 1);
  const fresh = freshRackShots(list);
  const fb = fresh.map(firstBallOf).filter(v => v != null);
  const leave = fresh.filter(s => s.result !== "Strike").map(firstBallOf).filter(v => v != null);
  return {
    shots: list.length,
    strike: strikeRateOf(list),
    spare: pct(spAtt.filter(s => s.spareMade === "Yes").length, spAtt.length),
    cleanFrame: pct(frames.filter(s => s.result === "Strike" || s.spareMade === "Yes").length, frames.length),
    split: pct(splits.length, list.length),
    tenPinSpare: pct(tenAtt.filter(s => s.spareMade === "Yes").length, tenAtt.length),
    singlePinSpare: pct(oneAtt.filter(s => s.spareMade === "Yes").length, oneAtt.length),
    firstBallAvg: avg(fb),
    leaveAvg: avg(leave),
  };
}

// Teammates worth offering, most shots first: anyone with frames in the
// league, other than the bowler themselves.
export function headToHeadOpponents(shots, league, me) {
  const counts = new Map();
  for (const s of Array.isArray(shots) ? shots : []) {
    if (!s || !s.bowler || s.bowler === me) continue;
    if (league && s.league !== league) continue;
    counts.set(s.bowler, (counts.get(s.bowler) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([name, n]) => ({ name, shots: n }));
}
