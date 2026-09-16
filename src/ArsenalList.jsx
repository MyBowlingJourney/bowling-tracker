import { useState } from "react";
import { C, S, Chip } from "./ui.jsx";
import {
  LAYOUT_SYSTEMS, LAYOUT_SYSTEM_LABELS, LAYOUT_FIELDS,
  emptyLayout, normalizeLayout, formatLayout, layoutFieldErrors,
  setLayoutSystem, setLayoutValue,
} from "./domain/layouts.js";
import BallCatalogPanel from "./BallCatalogPanel.jsx";
import { rejectedBallsFor, ballKey } from "./domain/ballCatalog.js";

import { activeBalls, retiredBallNames, retiredBallSummary, describeRetirement, isRetired } from "./domain/retiredBalls.js";
import {
  COVERSTOCKS, CORE_TYPES, COVERSTOCK_LABELS, CORE_TYPE_LABELS,
  GROUP_MODES, GROUP_MODE_LABELS, normalizeBallSpecs,
  setSpecField, describeSpecs, groupBalls,
} from "./domain/ballSpecs.js";

function SpecEditor({ specs, groups, onChange }) {
  const s = normalizeBallSpecs(specs);
  const numField = (key, label, placeholder, step) => (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: "10px", color: C.textMuted, marginBottom: "3px" }}>{label}</div>
      <input style={{ ...S.input, fontSize: "13px", padding: "6px 8px" }}
        type="number" step={step} inputMode="decimal" placeholder={placeholder}
        value={s[key]} onChange={e => onChange(setSpecField(s, key, e.target.value))} />
    </div>
  );

  return (
    <div style={{ marginTop: "8px" }}>
      {groups.length > 0 && (
        <>
          <div style={{ ...S.label, marginBottom: "6px" }}>Group</div>
          <div style={S.chips}>
            <Chip label="Ungrouped" dense selected={!s.groupId}
              onToggle={() => onChange(setSpecField(s, "groupId", ""))} />
            {groups.map(g => (
              <Chip key={g.id} label={g.name} dense selected={s.groupId === g.id}
                onToggle={() => onChange(setSpecField(s, "groupId", g.id))} />
            ))}
          </div>
        </>
      )}

      <div style={{ ...S.label, marginTop: "10px", marginBottom: "6px" }}>Coverstock</div>
      <div style={S.chips}>
        {COVERSTOCKS.map(cs => (
          <Chip key={cs} label={COVERSTOCK_LABELS[cs]} dense selected={s.coverstock === cs}
            onToggle={() => onChange(setSpecField(s, "coverstock", s.coverstock === cs ? "" : cs))} />
        ))}
      </div>

      <div style={{ ...S.label, marginTop: "10px", marginBottom: "6px" }}>Core</div>
      <div style={S.chips}>
        {CORE_TYPES.map(ct => (
          <Chip key={ct} label={CORE_TYPE_LABELS[ct]} dense selected={s.coreType === ct}
            onToggle={() => onChange(setSpecField(s, "coreType", s.coreType === ct ? "" : ct))} />
        ))}
      </div>

      <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
        {numField("weight", "Weight (lb)", "15", "1")}
        {numField("rg", "RG", "2.50", "0.001")}
        {numField("diff", "Diff", "0.045", "0.001")}
      </div>

      {/* Intermediate differential exists only on asymmetric balls, so the
          field appears only when it is meaningful. Switching back to
          symmetric clears any value rather than leaving a stale one. */}
      {s.coreType === "asymmetric" && (
        <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
          {numField("intDiff", "Int. Diff (asymmetric only)", "0.020", "0.001")}
        </div>
      )}
    </div>
  );
}

// Editor for one ball's drilling layout. The three systems each get their
// own labeled fields, because their numbers measure different reference
// points -- a generic "three numbers" form would silently let someone
// record a VLS layout under Dual Angle labels and never notice.
function LayoutEditor({ layout, onChange }) {
  const current = normalizeLayout(layout) || emptyLayout();
  const errors = layoutFieldErrors(current);

  return (
    <div style={{ marginTop: "8px" }}>
      <div style={{ ...S.label, marginBottom: "6px" }}>Layout System</div>
      <div style={S.chips}>
        {LAYOUT_SYSTEMS.map(sys => (
          <Chip key={sys} label={LAYOUT_SYSTEM_LABELS[sys]} dense
            selected={current.system === sys}
            onToggle={() => onChange(setLayoutSystem(current, sys))} />
        ))}
      </div>
      <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
        {LAYOUT_FIELDS[current.system].map(f => (
          <div key={f.key} style={{ flex: 1 }}>
            <div style={{ fontSize: "10px", color: C.textMuted, marginBottom: "3px" }}>
              {f.label} ({f.unit})
            </div>
            <input
              style={{
                ...S.input, fontSize: "13px", padding: "6px 8px",
                border: `1px solid ${errors[f.key] ? C.miss : C.border}`,
              }}
              type="number" step={f.step} inputMode="decimal"
              placeholder={f.unit}
              value={current.values[f.key]}
              onChange={e => onChange(setLayoutValue(current, f.key, e.target.value))} />
            {errors[f.key] && (
              <div style={{ fontSize: "10px", color: C.miss, marginTop: "2px" }}>{errors[f.key]}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// The arsenal list. Each ball is its own row rather than a bare chip,
// because a ball now carries a layout worth showing at a glance -- and
// because removal deserves an explicit button rather than "tapping the
// ball itself deletes it", which is easy to do by accident on a phone.
export default function ArsenalList({
  ballStats = [],
  activeBowler, balls, ballLayouts, setBallLayout, removeBall,
  retired = {}, setBallRetired, shots = [],
  ballSpecs, setBallSpec, ballGroups, seedDefaultGroups, saveBallGroup, deleteBallGroup,
  catalogEntries, catalogAck, userId, publishBallSpecs, voteOnEntry, acknowledgeRejection,
}) {
  // Normalised once, here, rather than at each of the four read sites.
  // An arsenal that has not loaded yet is an empty one.
  balls = Array.isArray(balls) ? balls : [];
  const [openBall, setOpenBall] = useState(null);
  const [openTab, setOpenTab] = useState("specs");
  const [confirmRemove, setConfirmRemove] = useState(null);
  const [groupMode, setGroupMode] = useState("none");
  const [newGroupName, setNewGroupName] = useState("");

  // Active and archived are two lists, not one list with a flag.
  //
  // A bowler scanning their bag wants the balls they throw. The archive
  // is a different question -- "what did the Zen do on this pattern" --
  // asked rarely and deliberately, so it gets its own chip rather than
  // greyed-out rows cluttering the arsenal.
  const [gearTab, setGearTab] = useState("active");
  const active = activeBalls(balls, retired);
  const archived = retiredBallNames(balls, retired);
  const shown = gearTab === "archive" ? archived : active;

  const groups = (ballGroups || []).filter(g => g.bowlerName === activeBowler);
  const specsByBall = {};
  // An arsenal that has not loaded is an empty one, not a crash.
  balls.forEach(b => { specsByBall[b] = normalizeBallSpecs(ballSpecs?.[`${activeBowler}|${b}`]); });

  if (!balls.length) {
    return (
      <div style={{ fontSize: "12px", color: C.textMuted, marginTop: "8px" }}>
        Add {activeBowler}'s balls to start logging shots.
      </div>
    );
  }

  const sections = groupBalls(groupMode, shown, specsByBall, groups);

  const gearChips = (
    <div style={{ ...S.chips, marginBottom: "10px" }}>
      <Chip label={`Active \u00b7 ${active.length}`} selected={gearTab === "active"}
        onToggle={() => setGearTab("active")} />
      {/* Only once something is IN it. An empty Archive chip is a
          question the bowler has no reason to ask. */}
      {archived.length > 0 && (
        <Chip label={`Archive \u00b7 ${archived.length}`} selected={gearTab === "archive"}
          onToggle={() => setGearTab("archive")} />
      )}
    </div>
  );

  // A stable colour per ball, from its name.
  //
  // Same ball, same colour, every time -- that is what lets a bowler find
  // the Phaze in a list of six without reading any of them. Random or
  // index-based colours would reshuffle whenever a ball is added.
  //
  // Hues are snapped to a 12-step wheel rather than taken raw.
  //
  // A raw hash gave Zen 91 degrees and Harsh Reality 94 -- two colours no
  // one can tell apart, which defeats the only purpose here. Snapping to
  // 30-degree steps means two balls either look clearly different or
  // exactly the same, and "exactly the same" is at least honest.
  function ballTint(name) {
    let h = 0;
    for (const ch of String(name || "")) h = (h * 31 + ch.charCodeAt(0)) % 360;
    return `hsl(${Math.round(h / 30) * 30 % 360}, 42%, 38%)`;
  }

  function ballInitials(name) {
    const words = String(name || "").trim().split(/\s+/).filter(Boolean);
    if (!words.length) return "?";
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }

  // "412 shots · 59% strikes · 83% spares", from the same numbers the
  // Stats screen shows -- one source, so the two cannot disagree.
  //
  // Shots rather than games and average: bStats counts DELIVERIES with
  // this ball, and a game is not attributable to one ball when a bowler
  // switches mid-game. Showing "38 games" would be a number this data
  // cannot support, however well it reads.
  //
  // Null when the ball has no logged shots, so a new ball says so rather
  // than showing zeroes that look like bad performance.
  function perf(name) {
    const b = (ballStats || []).find(x => x && x.ball === name);
    if (!b || !b.total) return null;
    const bits = [`${b.total} shot${b.total === 1 ? "" : "s"}`];
    if (b.rate !== null && b.rate !== undefined) bits.push(`${b.rate}% strikes`);
    if (b.spareRate !== null && b.spareRate !== undefined) bits.push(`${b.spareRate}% spares`);
    return bits.join(" \u00b7 ");
  }

  function renderBall(ball) {
    const key = `${activeBowler}|${ball}`;
    const layout = formatLayout(ballLayouts?.[key]);
    const specText = describeSpecs(specsByBall[ball]);
    const isOpen = openBall === ball;
    return (
      <div key={ball} style={{
        ...S.card,
        padding: "12px 14px",
        marginBottom: "10px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* A ball, not a bullet.
              
              The app has no ball photographs, so a coloured disc stands in
              -- derived from the name so the same ball is the same colour
              every time, which is what makes a list scannable without
              reading it. A generic icon would not: five identical icons
              are five bullet points. */}
          <div aria-hidden="true" style={{
            width: "44px", height: "44px", borderRadius: "50%", flexShrink: 0,
            backgroundColor: ballTint(ball),
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#FFFFFF", fontSize: "15px", fontWeight: 500,
          }}>{ballInitials(ball)}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "15px", fontWeight: 500 }}>{ball}</div>
            {/* What this ball DOES for you, above what it is made of.
                
                Average, games and carry are the reason to open the screen;
                coverstock and layout are reference. The old row led with
                specs and never showed performance at all -- the one thing
                no other bowling app can tell you. */}
            {perf(ball) ? (
              <div style={{ fontSize: "12px", color: C.textMuted, marginTop: "2px" }}>
                {perf(ball)}
              </div>
            ) : (
              <div style={{ fontSize: "12px", color: C.textMuted, marginTop: "2px" }}>
                No games logged with it yet
              </div>
            )}
            {specText && (
              <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "2px" }}>{specText}</div>
            )}
            <div style={{ fontSize: "11px", color: layout ? C.accent : C.textMuted, marginTop: "2px" }}>
              {layout || "No layout recorded"}
            </div>
          </div>
          <button style={{ ...S.btn(), padding: "4px 10px", fontSize: "11px" }}
            onClick={() => setOpenBall(isOpen ? null : ball)}>
            {isOpen ? "Done" : "Details"}
          </button>
          {confirmRemove === ball ? (
            <>
              <button style={{ ...S.btn("warn"), padding: "4px 10px", fontSize: "11px", width: "auto" }}
                onClick={() => { removeBall(activeBowler, ball); setConfirmRemove(null); }}>Remove</button>
              <button style={{ ...S.btn(), padding: "4px 8px", fontSize: "11px" }}
                onClick={() => setConfirmRemove(null)}>Cancel</button>
            </>
          ) : (
            <button style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: "16px", padding: "0 4px" }}
              onClick={() => setConfirmRemove(ball)} aria-label={`Remove ${ball}`}>×</button>
          )}
        </div>

        {isOpen && (
          <>
            <div style={{ ...S.chips, marginTop: "8px" }}>
              <Chip label="Specs" dense selected={openTab === "specs"} onToggle={() => setOpenTab("specs")} />
              <Chip label="Layout" dense selected={openTab === "layout"} onToggle={() => setOpenTab("layout")} />
            </div>
            {openTab === "specs" ? (
              <>
                <SpecEditor specs={specsByBall[ball]} groups={groups}
                  onChange={next => setBallSpec(activeBowler, ball, next)} />
                {publishBallSpecs && (
                  <BallCatalogPanel
                    ballName={ball}
                    userId={userId}
                    entries={catalogEntries?.[ballKey(ball)] || []}
                    myOwnSpecs={specsByBall[ball]}
                    onApply={specs => setBallSpec(activeBowler, ball, specs)}
                    onPublish={publishBallSpecs}
                    onVote={voteOnEntry} />
                )}
              </>
            ) : (
              <LayoutEditor layout={ballLayouts?.[key]}
                onChange={next => setBallLayout(activeBowler, ball, next)} />
            )}

            {/* Retire, at the bottom of the ball's own details.
                
                Sold, cracked, or just not thrown any more. Deleting is
                the only other option and it takes the shots with it --
                and a ball with two thousand shots behind it is still the
                answer to "was the Phaze better on this pattern".
                
                The summary says what the archive would preserve, so the
                bowler can see it is worth keeping before they decide. */}
            {setBallRetired && (
              <div style={{ marginTop: "10px", paddingTop: "8px",
                borderTop: `1px solid ${C.border}` }}>
                {isRetired(retired, ball) ? (
                  <>
                    <div style={{ fontSize: "11px", color: C.textMuted, marginBottom: "6px" }}>
                      {describeRetirement(retiredBallSummary(ball, retired, shots))}
                    </div>
                    <button style={S.btn("sm")} onClick={() => setBallRetired(ball, false)}>
                      Throwing it again
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: "11px", color: C.textMuted, marginBottom: "6px", lineHeight: 1.5 }}>
                      No longer throwing this ball? Archiving takes it out of your
                      arsenal and bags and keeps every shot you logged with it.
                    </div>
                    <button style={S.btn("sm")} onClick={() => setBallRetired(ball, true)}>
                      Archive this ball
                    </button>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  const rejected = rejectedBallsFor(balls, catalogEntries || {}, catalogAck || []);

  return (
    <div style={{ marginBottom: "10px" }}>
      {gearChips}
      {/* Community specs for a ball this bowler owns were disputed and
          removed. The ball itself stays -- they know they own it; only the
          numbers were in question. */}
      {rejected.map(ball => (
        <div key={ball} style={{ ...S.card, border: `1px solid ${C.miss}44`, marginBottom: "10px" }}>
          <div style={{ ...S.label, color: C.miss }}>Specs Removed</div>
          <div style={{ fontSize: "12px", color: C.textMuted, marginBottom: "8px" }}>
            Other bowlers reported the shared specs for <strong style={{ color: C.text }}>{ball}</strong> as incorrect, so they've been removed. You still have the ball — just re-enter its details when you get a chance.
          </div>
          <button style={{ ...S.btn(), width: "100%" }} onClick={() => acknowledgeRejection?.(ball)}>
            Got it
          </button>
        </div>
      ))}

      {/* Grouping only appears once the list is long enough to need it --
          sorting four balls into buckets is more work than scanning them. */}
      {balls.length > 4 && (
        <>
          <div style={{ ...S.label, marginBottom: "6px" }}>Group by</div>
          <div style={{ ...S.chips, marginBottom: "10px" }}>
            {GROUP_MODES.map(mode => (
              <Chip key={mode} label={GROUP_MODE_LABELS[mode]} dense selected={groupMode === mode}
                onToggle={() => {
                  if (mode === "group" && groups.length === 0) seedDefaultGroups?.(activeBowler);
                  setGroupMode(mode);
                }} />
            ))}
          </div>
        </>
      )}

      {/* The groups themselves.

          "My groups" seeded six defaults and then offered no way to see
          them, rename one, add one or delete one -- the handlers were
          passed all the way down and never rendered. And the only place a
          ball's group could be set was inside that ball's spec editor,
          which nothing pointed at. So the mode looked like a feature with
          the middle missing. */}
      {groupMode === "group" && saveBallGroup && (
        <div style={{ ...S.card, backgroundColor: C.surface, padding: "10px 12px", marginBottom: "12px" }}>
          <div style={{ ...S.label, marginBottom: "6px" }}>Your groups</div>
          {groups.map(g => (
            <div key={g.id} style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "6px" }}>
              <input style={{ ...S.input, flex: 1, minWidth: 0, marginBottom: 0, fontSize: "12px", padding: "6px 8px" }}
                value={g.name}
                onChange={e => saveBallGroup({ ...g, name: e.target.value })} />
              <button style={{ ...S.btn(), width: "auto", padding: "6px 10px", fontSize: "11px" }}
                onClick={() => { if (window.confirm(`Delete "${g.name}"? Its balls become ungrouped.`)) deleteBallGroup?.(g.id); }}>
                Delete
              </button>
            </div>
          ))}
          <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
            <input style={{ ...S.input, flex: 1, minWidth: 0, marginBottom: 0, fontSize: "12px", padding: "6px 8px" }}
              value={newGroupName} onChange={e => setNewGroupName(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && newGroupName.trim()) { saveBallGroup({ name: newGroupName.trim(), sortOrder: groups.length }); setNewGroupName(""); } }}
              placeholder="New group, e.g. Dry lanes" />
            <button style={{ ...S.btn("primary"), width: "auto", padding: "6px 12px", fontSize: "11px" }}
              disabled={!newGroupName.trim()}
              onClick={() => { saveBallGroup({ name: newGroupName.trim(), sortOrder: groups.length }); setNewGroupName(""); }}>
              Add
            </button>
          </div>
          <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "8px", lineHeight: 1.5 }}>
            To put a ball in a group, open the ball and pick the group under its specs.
          </div>
        </div>
      )}

      {sections.map(section => (
        <div key={section.key} style={{ marginBottom: groupMode === "none" ? 0 : "14px" }}>
          {groupMode !== "none" && (
            <div style={{ fontSize: "13px", fontWeight: 600, color: C.text, marginBottom: "6px" }}>
              {section.label} · {section.balls.length}
            </div>
          )}
          {section.balls.map(renderBall)}
        </div>
      ))}
    </div>
  );
}
