import { useState } from "react";
import { C, S } from "./ui.jsx";
import {
  validateImport, conflictSummary, rowsToImport, importLeagueOptions,
  IMPORT_COLUMNS,
} from "./domain/csvImport.js";
import { isContainerLeague } from "./domain/leagueMembership.js";
import { IMPORTED_SESSION_KEY } from "./constants.js";

// Bringing a season in from a spreadsheet.
//
// Nothing is written until the bowler has seen what would happen. The
// file is read, validated, and reported on; only then is there a button
// that saves anything. A file with problems can be fixed and re-dropped
// without having half-imported it first.

export default function ImportCsv({
  leagues = [], leagueDates = {}, existingDates = [], today = "",
  onImport, onClose,
}) {
  const [league, setLeague] = useState("");
  const [plan, setPlan] = useState(null);
  const [fileName, setFileName] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState("");

  const options = importLeagueOptions(leagues, leagueDates, { isContainer: isContainerLeague });
  const summary = plan ? conflictSummary(plan) : null;

  const readFile = async e => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setDone("");
    try {
      const text = await file.text();
      setPlan(validateImport(text, { today, existingDates }));
    } catch {
      setPlan({ ok: false, error: "That file could not be read.", accepted: [], rejected: [] });
    }
  };

  const save = async choice => {
    const rows = rowsToImport(plan, choice);
    if (!rows.length) {
      // Abort, or an answer that leaves nothing: say so rather than
      // flashing a success message over an empty write.
      setDone(choice === "abort" ? "Import cancelled. Nothing was saved." : "Nothing to import.");
      if (choice === "abort") setPlan(null);
      return;
    }
    setBusy(true);
    try {
      await onImport?.({ rows, league: league || IMPORTED_SESSION_KEY, overwrite: choice === "overwrite" });
      setDone(`Imported ${rows.length} night${rows.length === 1 ? "" : "s"}.`);
      setPlan(null);
    } catch (err) {
      setDone(`That didn't save: ${String(err?.message || err)}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div style={S.card}>
        <div style={S.label}>Import scores from a file</div>
        <div style={{ fontSize: "12px", color: C.textMuted, lineHeight: 1.6 }}>
          A CSV with four columns: {IMPORT_COLUMNS.join(", ")}. Dates look like
          2026-09-17, scores are whole numbers from 0 to 300, and a night can be
          one, two or three games.
        </div>
      </div>

      {/* The league is asked BEFORE the file, because the answer changes
          what the import means and a bowler who picks it afterwards has
          already been shown a report about nights with no home. */}
      <div style={{ ...S.card, marginTop: "8px" }}>
        <div style={S.label}>Import into</div>
        <select style={S.input} value={league} onChange={e => setLeague(e.target.value)}>
          <option value="">Imported (no league)</option>
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "6px" }}>
          Leave it as Imported if these nights don't belong to a league you track.
        </div>
      </div>

      <div style={{ ...S.card, marginTop: "8px" }}>
        <input type="file" accept=".csv,text/csv" onChange={readFile}
          style={{ ...S.input, padding: "10px" }} />
        {fileName && (
          <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "6px" }}>{fileName}</div>
        )}
      </div>

      {done && (
        <div style={{ ...S.card, marginTop: "8px", fontSize: "13px", color: C.text }}>
          {done}
        </div>
      )}

      {plan && !plan.ok && (
        <div style={{ ...S.card, marginTop: "8px", fontSize: "13px", color: C.miss }}>
          {plan.error}
        </div>
      )}

      {plan && plan.ok && (
        <>
          <div style={{ ...S.card, marginTop: "8px" }}>
            <div style={S.label}>What would import</div>
            <div style={{ fontSize: "20px", fontWeight: 500, color: C.text }}>
              {summary.total} night{summary.total === 1 ? "" : "s"}
            </div>
            {plan.rejected.length > 0 && (
              <div style={{ fontSize: "12px", color: C.miss, marginTop: "4px" }}>
                {plan.rejected.length} row{plan.rejected.length === 1 ? "" : "s"} skipped
              </div>
            )}
          </div>

          {/* Every rejection with its row number, so the bowler can open
              the spreadsheet and go straight to it. A count alone would
              mean opening the file and hunting. */}
          {plan.rejected.length > 0 && (
            <div style={{ ...S.card, marginTop: "8px" }}>
              <div style={S.label}>Rows that can't be imported</div>
              {plan.rejected.slice(0, 25).map(r => (
                <div key={r.line} style={{ fontSize: "12px", color: C.textMuted, marginBottom: "3px" }}>
                  <strong style={{ color: C.text }}>Row {r.line}</strong> {"—"} {r.reason}
                </div>
              ))}
              {plan.rejected.length > 25 && (
                <div style={{ fontSize: "11px", color: C.textMuted }}>
                  and {plan.rejected.length - 25} more
                </div>
              )}
            </div>
          )}

          {summary.needsAnswer ? (
            <div style={{ ...S.card, marginTop: "8px" }}>
              <div style={S.label}>
                {summary.conflicts} night{summary.conflicts === 1 ? "" : "s"} you already have
              </div>
              <div style={{ fontSize: "12px", color: C.textMuted, marginBottom: "8px", lineHeight: 1.6 }}>
                {summary.dates.slice(0, 6).join(", ")}
                {summary.dates.length > 6 ? `, and ${summary.dates.length - 6} more` : ""}
              </div>
              <button style={{ ...S.btn("primary"), width: "100%", marginBottom: "6px" }}
                disabled={busy} onClick={() => save("overwrite")}>
                Replace those nights
              </button>
              <button style={{ ...S.btn(), width: "100%", marginBottom: "6px" }}
                disabled={busy} onClick={() => save("skip")}>
                Keep mine, import the other {summary.fresh}
              </button>
              <button style={{ ...S.btn(), width: "100%" }}
                disabled={busy} onClick={() => save("abort")}>
                Cancel the import
              </button>
            </div>
          ) : (
            <button style={{ ...S.btn("primary"), width: "100%", marginTop: "8px" }}
              disabled={busy} onClick={() => save("skip")}>
              {busy ? "Importing…" : `Import ${summary.total} night${summary.total === 1 ? "" : "s"}`}
            </button>
          )}
        </>
      )}

      {onClose && (
        <button style={{ ...S.btn(), width: "100%", marginTop: "8px" }} onClick={onClose}>
          Done
        </button>
      )}
    </div>
  );
}
