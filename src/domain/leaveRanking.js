// Ranking and paging for the Splits and Non-Split Leaves cards.
//
// The cards show a short "fix these first" list, then a gallery that grows
// in steps. Kept here, not in the component, so the ordering and the
// button states are tested rather than eyeballed.
//
// Input rows are the shape both cards already receive:
//   splits:     {key: name, pins: "3-10", count, converted, rate}
//   non-splits: {key: "3-10",           count, converted, rate}
// so the pins are `pins` when present and `key` otherwise.

export const FIRST_PAGE = 3;
export const PAGE_STEP = 7;

// "3-10" -> [3, 10]. Anything that isn't a pin number is dropped, so a
// malformed key draws an empty rack rather than throwing.
export function leavePins(row){
  const src = String(row?.pins || row?.key || "");
  return src.split("-").map(Number).filter(n => Number.isInteger(n) && n >= 1 && n <= 10);
}

// The label under a rack. A named split keeps its name ("Baby split") with
// the pins beside it, because two different leaves share that name.
export function leaveLabel(row){
  const pins = leavePins(row).join("-");
  const name = row?.key && row.key !== pins ? row.key : null;
  return { name, pins };
}

// mode "missed": most misses first -- where the pins are being lost.
// mode "made":   most conversions first -- what's already reliable.
// Ties fall to how often the leave came up, then to the pins, so the
// order never shuffles between renders.
export function rankLeaves(rows, mode = "missed"){
  const list = (Array.isArray(rows) ? rows : [])
    .filter(r => r && Number(r.count) > 0)
    .map(r => {
      const count = Number(r.count) || 0;
      const made = Math.min(count, Math.max(0, Number(r.converted) || 0));
      return { ...r, count, made, missed: count - made, rate: count ? Math.round(made / count * 100) : 0 };
    });
  const primary = mode === "made" ? "made" : "missed";
  return list.sort((a, b) =>
    b[primary] - a[primary] ||
    b.count - a.count ||
    leavePins(a).join("-").localeCompare(leavePins(b).join("-"), undefined, { numeric: true }));
}

// How many rows show, and what the button says next.
//   3 shown, more exist          -> "Show more"   (adds 7)
//   after that, still more exist -> "Show all"
//   everything shown             -> "Collapse all" (back to 3)
//   3 or fewer in total          -> no button
export function pageState(total, shown){
  const n = Math.max(0, total | 0);
  const visible = Math.min(n, Math.max(FIRST_PAGE, shown | 0));
  if (n <= FIRST_PAGE) return { visible: n, button: null };
  if (visible >= n) return { visible, button: "collapse" };
  if (visible <= FIRST_PAGE) return { visible, button: "more" };
  return { visible, button: "all" };
}

// What pressing the button does to `shown`.
export function nextShown(total, shown){
  const { button } = pageState(total, shown);
  if (button === "more") return FIRST_PAGE + PAGE_STEP;
  if (button === "all") return total;
  return FIRST_PAGE;
}
