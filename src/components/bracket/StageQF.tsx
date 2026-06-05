"use client";
import { useBracket, ALL_GROUPS, type Confidence } from "./BracketProvider";

function getFlag(name: string) {
  for (const g of ALL_GROUPS) {
    const t = g.teams.find(t => t.name === name);
    if (t) return t.flag;
  }
  return "🏳";
}

function ConfidencePicker({
  value,
  onChange,
}: {
  value: Confidence;
  onChange: (c: Confidence) => void;
}) {
  return (
    <div style={{ marginTop: 14, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div className="label-xs" style={{ color: "#C9A84C", fontSize: 8, letterSpacing: "2px" }}>
        HOW CONFIDENT ARE YOU?
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {(["LOW", "MED", "HIGH"] as Confidence[]).map(c => (
          <button
            key={c}
            className={`confidence-pill ${value === c ? "selected" : ""}`}
            onClick={() => onChange(c)}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

function QFCard({
  matchIdx,
  teamA,
  teamB,
  pick,
}: {
  matchIdx: number;
  teamA: string;
  teamB: string;
  pick: { winner: string | null; confidence: Confidence };
}) {
  const { setQFPick } = useBracket();
  const winner = pick.winner;

  return (
    <div
      style={{
        background: "#0D0D0D",
        border: `1px solid ${winner ? "rgba(201,168,76,0.3)" : "#252525"}`,
        borderRadius: 2,
        overflow: "hidden",
        maxWidth: 600,
        margin: "0 auto",
        width: "100%",
        transition: "border-color 0.3s ease",
      }}
    >
      {/* Match label */}
      <div style={{ padding: "12px 20px 8px", borderBottom: "1px solid #1E1E1E" }}>
        <span className="label-xs" style={{ color: "#5A4E38", fontSize: 7, letterSpacing: "3px" }}>
          QUARTER-FINAL {String(matchIdx + 1).padStart(2, "0")}
        </span>
      </div>

      <div style={{ display: "flex" }}>
        {/* Team A */}
        <button
          className={`ko-team-btn ${winner === teamA ? "selected" : ""} ${winner && winner !== teamA ? "eliminated" : ""}`}
          onClick={() => setQFPick(matchIdx, teamA)}
          style={{
            borderRight: winner === teamA ? "2px solid #C9A84C" : "1px solid #1E1E1E",
            padding: "20px 16px",
          }}
        >
          <span style={{ fontSize: 36 }}>{getFlag(teamA)}</span>
          <span className="font-display" style={{ fontSize: 16, color: winner === teamA ? "#C9A84C" : "#9A9080", letterSpacing: "0.1em" }}>
            {teamA.toUpperCase()}
          </span>
          {winner === teamA && (
            <span className="result-badge home-win" style={{ fontSize: 7, padding: "2px 8px", marginTop: 4 }}>ADVANCES ✦</span>
          )}
        </button>

        {/* VS */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0 12px", background: "#0A0A0A" }}>
          <span className="font-serif" style={{ fontSize: "1rem", fontStyle: "italic", color: "#3A3530" }}>vs</span>
        </div>

        {/* Team B */}
        <button
          className={`ko-team-btn ${winner === teamB ? "selected" : ""} ${winner && winner !== teamB ? "eliminated" : ""}`}
          onClick={() => setQFPick(matchIdx, teamB)}
          style={{
            borderLeft: winner === teamB ? "2px solid #C9A84C" : "none",
            padding: "20px 16px",
          }}
        >
          <span style={{ fontSize: 36 }}>{getFlag(teamB)}</span>
          <span className="font-display" style={{ fontSize: 16, color: winner === teamB ? "#C9A84C" : "#9A9080", letterSpacing: "0.1em" }}>
            {teamB.toUpperCase()}
          </span>
          {winner === teamB && (
            <span className="result-badge home-win" style={{ fontSize: 7, padding: "2px 8px", marginTop: 4 }}>ADVANCES ✦</span>
          )}
        </button>
      </div>

      {/* Confidence */}
      <div style={{ borderTop: "1px solid #1E1E1E", padding: "12px 20px 16px" }}>
        <ConfidencePicker
          value={pick.confidence}
          onChange={c => setQFPick(matchIdx, pick.winner ?? "", c)}
        />
      </div>
    </div>
  );
}

export default function StageQF() {
  const { predictions, qfTeams, confirmQF, setActiveStage } = useBracket();
  const picks = predictions.qf;
  const validPairs = qfTeams.filter(([a, b]) => a && b);
  const allPicked = validPairs.length === 4 && picks.every(p => p.winner);

  if (validPairs.length === 0) {
    return (
      <div className="stage-in" style={{ textAlign: "center", padding: "80px 0" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <div className="font-display" style={{ fontSize: 24, color: "#5A5248", letterSpacing: "0.1em" }}>
          COMPLETE ROUND OF 16 FIRST
        </div>
        <button className="btn-outline" style={{ marginTop: 24 }} onClick={() => setActiveStage(2)}>
          Go to Round of 16
        </button>
      </div>
    );
  }

  return (
    <div className="stage-in">
      <div style={{ marginBottom: 32 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>Stage 04 · 8 Teams · 4 Matches</div>
        <h2 className="section-title">Quarter <em>Finals</em></h2>
        <p style={{ color: "#5A5248", fontSize: 12, marginTop: 8 }}>
          Pick your winners and rate your confidence.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
        {qfTeams.map(([teamA, teamB], i) => (
          <QFCard
            key={i}
            matchIdx={i}
            teamA={teamA || "TBD"}
            teamB={teamB || "TBD"}
            pick={picks[i]}
          />
        ))}
      </div>

      <button
        className="btn-gold btn-sheen"
        onClick={confirmQF}
        disabled={!allPicked}
        style={{
          width: "100%", justifyContent: "center",
          fontFamily: "var(--font-display)", fontSize: 13, letterSpacing: "3px", padding: "16px",
          opacity: allPicked ? 1 : 0.4,
          cursor: allPicked ? "pointer" : "not-allowed",
        }}
        id="confirm-qf"
      >
        CONFIRM QUARTER-FINALS
      </button>
    </div>
  );
}
