// Teammates' imported scores, as rows team stats can count.
//
// One person photographs the scorecard; every other column becomes an
// imported_scores record for that teammate to confirm. The rules in
// importVerification.js say those numbers COUNT while pending -- "a
// team's numbers shouldn't sit broken waiting on the one member who bowls
// and goes home" -- but nothing ever fed them into Stats. A captain
// importing for a roster that hasn't signed up yet (every teammate
// pending, nobody to approve anything) saw only their own column in every
// team card.
//
// These rows are for READING team numbers only: they're never saved and
// never written into anyone's history. Approving still does that.
import { effectiveScores, normalizeImportRecord } from "./importVerification.js";

const norm = v => String(v ?? "").trim().toLowerCase();

// records: imported_scores as the app holds them.
// shots/sessions: what this device already has -- a night already logged
// (by the bowler, or proxy-logged by a captain) wins over the import, so
// nothing counts twice.
export function teammateImportRows(records, { shots = [], sessions = [] } = {}) {
  const haveNight = new Set(
    (sessions || []).filter(Boolean).map(s => `${norm(s.bowler)}|${s.league || ""}|${s.date || ""}`));
  const haveGame = new Set(
    (shots || []).filter(Boolean).map(s => `${norm(s.bowler)}|${s.league || ""}|${s.date || ""}|${String(s.game)}`));
  const outSessions = [];
  const outShots = [];
  const seen = new Set();
  for (const raw of Array.isArray(records) ? records : []) {
    const r = normalizeImportRecord(raw);
    if (!r || !r.league || !r.date) continue;
    const scores = effectiveScores(r);
    if (!scores) continue; // rejected: a withdrawn number is not data
    const night = `${norm(r.bowler)}|${r.league}|${r.date}`;
    // Two records for one bowler's night (a re-import): the first wins.
    if (seen.has(night)) continue;
    seen.add(night);
    const id = r.id || `${r.bowler}|${r.league}|${r.date}`;

    if (!haveNight.has(night)) {
      const played = scores.filter(v => v !== null);
      const total = played.reduce((a, b) => a + b, 0);
      outSessions.push({
        id: `import:${id}`,
        bowler: r.bowler,
        teamId: "",
        league: r.league,
        date: r.date,
        sessionSeq: 1,
        scores,
        notes: "",
        total,
        average: played.length ? Math.round(total / played.length) : 0,
        shotCount: 0, strikes: 0, weakTens: 0, ringingTens: 0, tenPinLeaves: 0,
        singlePinLeaves: 0, singlePinSpares: 0, spareAttempts: 0, sparesMade: 0,
        splits: 0, splitsConverted: 0, ballsUsed: [], misses: [], releases: [],
        importedFrom: r.id || null,
      });
    }

    const frames = r.status === "corrected" && Array.isArray(r.correctedShots) && r.correctedShots.length
      ? r.correctedShots
      : (Array.isArray(r.importedShots) ? r.importedShots : []);
    for (const g of frames) {
      if (!g || !Array.isArray(g.shots) || !g.shots.length) continue;
      const game = String(g.gameNumber);
      if (haveGame.has(`${night}|${game}`)) continue;
      g.shots.forEach((sh, i) => {
        if (!sh) return;
        outShots.push({
          ...sh,
          id: `import:${id}:${game}:${i}`,
          bowler: r.bowler,
          league: r.league,
          date: r.date,
          game,
          sessionSeq: 1,
          ball: sh.ball || g.ballUsed || "",
          importedFrom: r.id || null,
        });
      });
    }
  }
  return { shots: outShots, sessions: outSessions };
}
