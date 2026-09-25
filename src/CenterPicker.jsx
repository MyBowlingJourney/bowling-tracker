import { useState, useRef, useEffect } from "react";
import { C, S, Chip, AiNote } from "./ui.jsx";
import { RACK_TYPES, laneListLabel, normalizeLaneList } from "./domain/centers.js";
import { centerLabel, distanceLabel } from "./domain/centers.js";
import { currentLanguage } from "./i18n/index.js";

// Picks the bowling center a league plays at.
//
// Debounced deliberately: HERE bills per API call rather than per session,
// so firing on every keystroke would burn the free allowance for no benefit.
//
// Manual entry is always available, not a fallback for errors only. Small
// houses are genuinely missing from HERE's data, and a league at one must
// still be recordable.
export default function CenterPicker({ leagueName, currentCenter, onSelect, onSearch, onSetRackType, onSetFreefallLanes }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [manualName, setManualName] = useState("");
  const [showManual, setShowManual] = useState(false);
  const [laneDraft, setLaneDraft] = useState(null);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  function handleQueryChange(value) {
    setQuery(value);
    setError(null);
    clearTimeout(timer.current);
    if (value.trim().length < 3) {
      setResults([]);
      setStatus("idle");
      return;
    }
    setStatus("searching");
    // 600ms after typing stops, not per keystroke.
    timer.current = setTimeout(async () => {
      const out = await onSearch(value.trim());
      if (out.error) {
        setError(out.error);
        setResults([]);
        setStatus("idle");
        return;
      }
      setResults(out.centers || []);
      setStatus(out.centers?.length ? "done" : "empty");
    }, 600);
  }

  return (
    <div>
      {/* Once chosen, the centre is a settled fact, not a headline.

          It had its own label, a bordered accent-tinted panel, a bold
          name, the full postal address and a button -- five elements and
          more visual weight than the LEAGUE it belongs to. A bowler knows
          which alley they bowl at; they do not need it announced above
          the league's own name. One quiet line, with Change beside it. */}
      {currentCenter ? (
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "8px" }}>
          <div style={{ fontSize: "12px", color: C.textMuted, flex: 1, minWidth: 0,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {currentCenter.name}
          </div>
          <button style={{ background: "none", border: "none", padding: 0, cursor: "pointer",
            color: C.accent, fontSize: "12px", flexShrink: 0 }}
            onClick={() => onSelect(null)}>
            Change
          </button>
        </div>
      ) : null}

      {/* How the pins are set.

          String pins are tethered and pulled back up; free-fall pins are
          set by a machine and fall freely. They carry differently, which
          is why USBC certifies string pinsetters separately -- so a
          bowler's strike rate at a string house is not comparable with
          their rate at a free-fall house.

          No "not sure" chip. A bowler who does not know leaves this
          blank -- tapping the selected chip again clears it -- rather
          than the app manufacturing a third category that means the
          same thing as blank but looks like a recorded answer. */}
      {currentCenter && onSetRackType ? (
        <div style={{ marginBottom: "8px" }}>
          <div style={{ fontSize: "11px", color: C.textMuted, marginBottom: "4px" }}>Pins</div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {RACK_TYPES.map(r => {
              const selected = (currentCenter.rackType || "") === r.id;
              return (
                <Chip key={r.id} label={r.label} dense selected={selected}
                  onToggle={() => onSetRackType(currentCenter, selected ? "" : r.id)} />
              );
            })}
          </div>
          {/* A mixed house has to say WHICH lanes, or nothing can be
              compared: every stat resolves string against free fall from
              the lane a shot was thrown on. Free fall is the side that
              gets listed because it is usually the smaller half -- the
              houses converting are converting to string. */}
          {currentCenter.rackType === "mixed" && onSetFreefallLanes && (
            <div style={{ marginTop: "8px" }}>
              <div style={{ fontSize: "11px", color: C.textMuted, marginBottom: "4px" }}>
                Which lanes are free fall? Everything else counts as string.
              </div>
              <input
                style={{ ...S.input, fontSize: "14px", padding: "10px 12px" }}
                type="text" inputMode="numeric" placeholder="e.g. 1-8, 15, 16"
                value={laneDraft ?? laneListLabel(currentCenter.freefallLanes)}
                onChange={e => setLaneDraft(e.target.value)}
                onBlur={() => {
                  if (laneDraft !== null) onSetFreefallLanes(currentCenter, normalizeLaneList(laneDraft));
                  setLaneDraft(null);
                }} />
              <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "4px", lineHeight: 1.45 }}>
                {normalizeLaneList(laneDraft ?? currentCenter.freefallLanes).length
                  ? `Free fall on ${laneListLabel(laneDraft ?? currentCenter.freefallLanes)}.`
                  : "Until these are set, this house stays out of the free fall vs string comparison."}
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
        <div style={S.label}>Bowling Center</div>
          {/* Practice and Casual are container "leagues", not real ones, so
              the league phrasing reads as if Practice were a person --
              "Where does Practice bowl?". Same question, asked the way it
              makes sense for each. */}
          <div style={{ fontSize: "11px", color: C.textMuted, marginBottom: "8px" }}>
            {leagueName === "Practice"
              ? "Where do you usually practice? Setting it lets you compare how you score house to house."
              : leagueName === "Casual"
                ? "Where do you usually bowl for fun? Setting it lets you compare how you score house to house."
                : `Where does ${leagueName || "this league"} bowl? Set once per season — it lets you compare how you score house to house.`}
          </div>

          <input style={S.input} placeholder="Search by name, e.g. Arsenal Bowl"
            value={query} onChange={e => handleQueryChange(e.target.value)} />

          {status === "searching" && (
            <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "6px" }}>Searching…</div>
          )}

          {error && (
            <div style={{ fontSize: "11px", color: C.miss, marginTop: "6px" }}>{error}</div>
          )}

          {status === "empty" && !error && (
            <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "6px" }}>
              No centers found nearby. You can add it by name below.
            </div>
          )}

          {/* Centre lookup goes through a model too, so a name or an
              address here can be wrong or out of date. */}
          {results.length > 0 && <AiNote what="This list" verb="found" check="check the name and address before you rely on it" style={{ marginTop: "10px" }} />}

          {results.length > 0 && (
            <div style={{ marginTop: "8px", border: `1px solid ${C.border}`, borderRadius: "8px", overflow: "hidden" }}>
              {results.map(center => {
                const miles = distanceLabel(center.distance, navigator.language, currentLanguage() === "fr");
                return (
                  <button key={center.hereId || center.name}
                    style={{
                      display: "block", width: "100%", textAlign: "left", background: "none",
                      border: "none", borderBottom: `1px solid ${C.border}`, padding: "8px 10px",
                      cursor: "pointer", color: C.text,
                    }}
                    onClick={() => onSelect(center)}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "13px", fontWeight: 600 }}>{center.name}</span>
                      {miles !== null && (
                        <span style={{ fontSize: "10px", color: C.textMuted }}>{miles}</span>
                      )}
                    </div>
                    {center.address && (
                      <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "2px" }}>{center.address}</div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Always available, not just on failure -- small houses are
              genuinely missing from HERE's data. */}
          {!showManual ? (
            <button style={{ ...S.btn(), width: "100%", marginTop: "8px", fontSize: "12px" }}
              onClick={() => setShowManual(true)}>
              Can't find it? Add by name
            </button>
          ) : (
            <div style={{ marginTop: "8px" }}>
              <div style={S.row}>
                <input style={{ ...S.input, flex: 1 }} placeholder="Center name"
                  value={manualName} onChange={e => setManualName(e.target.value)} />
                <button style={S.btn("sm")} disabled={!manualName.trim()}
                  onClick={() => { onSelect({ name: manualName.trim() }); setManualName(""); setShowManual(false); }}>
                  +
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
