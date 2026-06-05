"use client";
import { useBracket, ALL_GROUPS } from "./BracketProvider";

function getFlag(name: string) {
  for (const g of ALL_GROUPS) {
    const t = g.teams.find(t => t.name === name);
    if (t) return t.flag;
  }
  return "🏳";
}

function SFCard({ matchIdx }: { matchIdx: number }) {
  const { predictions, sfTeams, setSFPick } = useBracket();
  const [teamA, teamB] = sfTeams[matchIdx] ?? ["", ""];
  const pick = predictions.sf[matchIdx];
  const winner = pick?.winner ?? null;

  return (
    <div
      style={{
        background: "#0D0D0D",
        border: `1px solid ${winner ? "rgba(201,168,76,0.35)" : "#252525"}`,
        borderRadius: 2,
        overflow: "hidden",
        transition: "border-color 0.3s ease",
        width: "100%",
      }}
    >
      {/* Header */}
      <div style={{ padding: "12px 24px 10px", borderBottom: "1px solid #1E1E1E", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="label-xs" style={{ color: "#5A4E38", fontSize: 7, letterSpacing: "3px" }}>
          SEMI-FINAL {String(matchIdx + 1).padStart(2, "0")}
        </span>
        <span className="label-xs" style={{ color: "#5A5248", fontSize: 8 }}>Jul 11–12, 2026</span>
      </div>

      {/* Teams + Score */}
      <div style={{ display: "flex", minHeight: 160 }}>
        {/* Team A */}
        <button
          className={`ko-team-btn ${winner === teamA ? "selected" : ""} ${winner && winner !== teamA ? "eliminated" : ""}`}
          onClick={() => setSFPick(matchIdx, "winner", teamA)}
          style={{
            borderRight: winner === teamA ? "2px solid #C9A84C" : "1px solid #252525",
            padding: "24px 20px",
          }}
        >
          <span style={{ fontSize: 44 }}>{getFlag(teamA)}</span>
          <span className="font-display" style={{ fontSize: 20, color: winner === teamA ? "#C9A84C" : "#9A9080", letterSpacing: "0.1em" }}>
            {(teamA || "TBD").toUpperCase()}
          </span>
          {winner === teamA && (
            <span className="result-badge home-win" style={{ fontSize: 7, padding: "2px 8px", marginTop: 4 }}>
              TO THE FINAL ✦
            </span>
          )}
        </button>

        {/* Center — VS + score inputs */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px 20px", background: "#0A0A0A", gap: 12 }}>
          <span className="font-serif" style={{ fontSize: "1.2rem", fontStyle: "italic", color: "#3A3530" }}>vs</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="number" min={0} max={20}
              className="score-input"
              value={pick?.score[0] === "" ? "" : pick?.score[0]}
              onChange={e => setSFPick(matchIdx, "scoreH", e.target.value === "" ? "" : parseInt(e.target.value) || 0)}
              id={`sf-score-${matchIdx}-home`}
            />
            <span className="font-display" style={{ fontSize: 16, color: "#5A5248" }}>–</span>
            <input
              type="number" min={0} max={20}
              className="score-input"
              value={pick?.score[1] === "" ? "" : pick?.score[1]}
              onChange={e => setSFPick(matchIdx, "scoreA", e.target.value === "" ? "" : parseInt(e.target.value) || 0)}
              id={`sf-score-${matchIdx}-away`}
            />
          </div>
          <span className="label-xs" style={{ color: "#5A5248", fontSize: 8 }}>AET if needed</span>
        </div>

        {/* Team B */}
        <button
          className={`ko-team-btn ${winner === teamB ? "selected" : ""} ${winner && winner !== teamB ? "eliminated" : ""}`}
          onClick={() => setSFPick(matchIdx, "winner", teamB)}
          style={{
            borderLeft: winner === teamB ? "2px solid #C9A84C" : "none",
            padding: "24px 20px",
          }}
        >
          <span style={{ fontSize: 44 }}>{getFlag(teamB)}</span>
          <span className="font-display" style={{ fontSize: 20, color: winner === teamB ? "#C9A84C" : "#9A9080", letterSpacing: "0.1em" }}>
            {(teamB || "TBD").toUpperCase()}
          </span>
          {winner === teamB && (
            <span className="result-badge home-win" style={{ fontSize: 7, padding: "2px 8px", marginTop: 4 }}>
              TO THE FINAL ✦
            </span>
          )}
        </button>
      </div>

      {/* Scorer prediction */}
      <div style={{ borderTop: "1px solid #1E1E1E", padding: "12px 24px 16px" }}>
        <div className="label-xs" style={{ color: "#C9A84C", fontSize: 8, letterSpacing: "2px", marginBottom: 8 }}>
          PREDICT GOALSCORER:
        </div>
        <input
          type="text"
          className="scorer-input"
          placeholder="Player name..."
          value={pick?.scorer ?? ""}
          onChange={e => setSFPick(matchIdx, "scorer", e.target.value)}
          id={`sf-scorer-${matchIdx}`}
        />
      </div>
    </div>
  );
}

export default function StageSF() {
  const { predictions, sfTeams, confirmSF, setActiveStage } = useBracket();
  const validPairs = sfTeams.filter(([a, b]) => a && b);
  const picks = predictions.sf;
  const allPicked = validPairs.length === 2 && picks.every(p => p.winner);

  if (validPairs.length === 0) {
    return (
      <div className="stage-in" style={{ textAlign: "center", padding: "80px 0" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <div className="font-display" style={{ fontSize: 24, color: "#5A5248", letterSpacing: "0.1em" }}>
          COMPLETE QUARTER-FINALS FIRST
        </div>
        <button className="btn-outline" style={{ marginTop: 24 }} onClick={() => setActiveStage(3)}>
          Go to Quarter-Finals
        </button>
      </div>
    );
  }

  return (
    <div className="stage-in">
      <div style={{ marginBottom: 32 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>Stage 05 · 4 Teams · 2 Matches</div>
        <h2 className="section-title">Semi <em>Finals</em></h2>
        <p style={{ color: "#5A5248", fontSize: 12, marginTop: 8 }}>
          Predict the finalists, scoreline, and goalscorer.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 32 }}>
        {[0, 1].map(i => <SFCard key={i} matchIdx={i} />)}
      </div>

      <button
        className="btn-gold btn-sheen"
        onClick={confirmSF}
        disabled={!allPicked}
        style={{
          width: "100%", justifyContent: "center",
          fontFamily: "var(--font-display)", fontSize: 13, letterSpacing: "3px", padding: "16px",
          opacity: allPicked ? 1 : 0.4,
          cursor: allPicked ? "pointer" : "not-allowed",
        }}
        id="confirm-sf"
      >
        CONFIRM SEMI-FINALS
      </button>
    </div>
  );
}
