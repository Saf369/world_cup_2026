"use client";
import { useBracket, ALL_GROUPS, type Standing } from "./BracketProvider";

// Shared knockout card used for R32 and R16
function KOCard({
  matchIdx,
  teamA,
  teamB,
  flagA,
  flagB,
  badgeA,
  badgeB,
  winner,
  onPick,
}: {
  matchIdx: number;
  teamA: string; teamB: string;
  flagA: string; flagB: string;
  badgeA?: string; badgeB?: string;
  winner: string | null;
  onPick: (team: string) => void;
}) {
  return (
    <div
      style={{
        background: "#0D0D0D",
        border: "1px solid #252525",
        borderRadius: 2,
        overflow: "hidden",
        position: "relative",
        minHeight: 100,
        transition: "border-color 0.2s ease",
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "#252525")}
    >
      {/* Match # */}
      <div className="label-xs" style={{ position: "absolute", top: 8, left: 12, color: "#5A4E38", fontSize: 7, letterSpacing: "2.5px" }}>
        MATCH {String(matchIdx + 1).padStart(2, "0")}
      </div>

      <div style={{ display: "flex", height: "100%" }}>
        {/* Team A */}
        <button
          className={`ko-team-btn ${winner === teamA ? "selected" : ""} ${winner && winner !== teamA ? "eliminated" : ""}`}
          onClick={() => onPick(teamA)}
          id={`ko-pick-${matchIdx}-a`}
          style={{ borderRight: winner === teamA ? "2px solid #C9A84C" : "1px solid #252525" }}
        >
          <span style={{ fontSize: 28 }}>{flagA}</span>
          <span
            className="label-xs"
            style={{ fontSize: 9, letterSpacing: "1.2px", color: winner === teamA ? "#C9A84C" : "#9A9080", textAlign: "center" }}
          >
            {teamA.toUpperCase()}
          </span>
          {badgeA && (
            <span className="label-xs" style={{ fontSize: 7, color: "#5A5248" }}>{badgeA}</span>
          )}
          {winner === teamA && (
            <span className="result-badge home-win" style={{ fontSize: 7, padding: "2px 8px", marginTop: 2 }}>ADVANCES</span>
          )}
        </button>

        {/* VS divider */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0 8px", background: "#0A0A0A" }}>
          <span className="font-serif" style={{ fontSize: "0.9rem", fontStyle: "italic", color: "#3A3530" }}>vs</span>
        </div>

        {/* Team B */}
        <button
          className={`ko-team-btn ${winner === teamB ? "selected" : ""} ${winner && winner !== teamB ? "eliminated" : ""}`}
          onClick={() => onPick(teamB)}
          id={`ko-pick-${matchIdx}-b`}
          style={{ borderLeft: winner === teamB ? "2px solid #C9A84C" : "none" }}
        >
          <span style={{ fontSize: 28 }}>{flagB}</span>
          <span
            className="label-xs"
            style={{ fontSize: 9, letterSpacing: "1.2px", color: winner === teamB ? "#C9A84C" : "#9A9080", textAlign: "center" }}
          >
            {teamB.toUpperCase()}
          </span>
          {badgeB && (
            <span className="label-xs" style={{ fontSize: 7, color: "#5A5248" }}>{badgeB}</span>
          )}
          {winner === teamB && (
            <span className="result-badge home-win" style={{ fontSize: 7, padding: "2px 8px", marginTop: 2 }}>ADVANCES</span>
          )}
        </button>
      </div>
    </div>
  );
}

// Helper: get flag for a team name
function getFlag(name: string): string {
  for (const g of ALL_GROUPS) {
    const t = g.teams.find(t => t.name === name);
    if (t) return t.flag;
  }
  return "🏳";
}

// ─── ROUND OF 32 ─────────────────────────────────────────────────────────────

export function StageR32() {
  const { predictions, r32Teams, setR32Pick, confirmR32, setActiveStage } = useBracket();
  const picks = predictions.r32;
  const allPicked = r32Teams.length === 16 && picks.slice(0, r32Teams.length).every(p => p.winner);

  if (r32Teams.length === 0) {
    return (
      <div className="stage-in" style={{ textAlign: "center", padding: "80px 0" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <div className="font-display" style={{ fontSize: 24, color: "#5A5248", letterSpacing: "0.1em" }}>
          COMPLETE GROUP STAGE FIRST
        </div>
        <button className="btn-outline" style={{ marginTop: 24 }} onClick={() => setActiveStage(0)}>
          Go to Group Stage
        </button>
      </div>
    );
  }

  return (
    <div className="stage-in">
      <div style={{ marginBottom: 32 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>Stage 02 · 32 Teams · 16 Matches</div>
        <h2 className="section-title">Round of <em>32</em></h2>
        <p style={{ color: "#5A5248", fontSize: 12, marginTop: 8 }}>
          Click the team you predict will advance.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}>
        {r32Teams.map((pair, i) => (
          <KOCard
            key={i}
            matchIdx={i}
            teamA={pair[0].team.name}
            teamB={pair[1].team.name}
            flagA={pair[0].team.flag}
            flagB={pair[1].team.flag}
            badgeA={`1ST — GRP ${pair[0].groupLabel}`}
            badgeB={`2ND — GRP ${pair[1].groupLabel}`}
            winner={picks[i]?.winner ?? null}
            onPick={team => setR32Pick(i, team)}
          />
        ))}
      </div>

      <button
        className="btn-gold btn-sheen"
        onClick={confirmR32}
        disabled={!allPicked}
        style={{
          width: "100%", justifyContent: "center",
          fontFamily: "var(--font-display)", fontSize: 13, letterSpacing: "3px", padding: "16px",
          opacity: allPicked ? 1 : 0.4,
          cursor: allPicked ? "pointer" : "not-allowed",
        }}
        id="confirm-r32"
      >
        CONFIRM ROUND OF 32
      </button>
    </div>
  );
}

// ─── ROUND OF 16 ─────────────────────────────────────────────────────────────

export function StageR16() {
  const { predictions, r16Teams, setR16Pick, confirmR16, setActiveStage } = useBracket();
  const picks = predictions.r16;
  const validPairs = r16Teams.filter(([a, b]) => a && b);
  const allPicked = validPairs.length === 8 && picks.slice(0, 8).every(p => p.winner);

  if (validPairs.length === 0) {
    return (
      <div className="stage-in" style={{ textAlign: "center", padding: "80px 0" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <div className="font-display" style={{ fontSize: 24, color: "#5A5248", letterSpacing: "0.1em" }}>
          COMPLETE ROUND OF 32 FIRST
        </div>
        <button className="btn-outline" style={{ marginTop: 24 }} onClick={() => setActiveStage(1)}>
          Go to Round of 32
        </button>
      </div>
    );
  }

  return (
    <div className="stage-in">
      <div style={{ marginBottom: 32 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>Stage 03 · 16 Teams · 8 Matches</div>
        <h2 className="section-title">Round of <em>16</em></h2>
        <p style={{ color: "#5A5248", fontSize: 12, marginTop: 8 }}>
          Teams populate from your Round of 32 picks.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}>
        {r16Teams.map(([teamA, teamB], i) => (
          <KOCard
            key={i}
            matchIdx={i}
            teamA={teamA || "TBD"}
            teamB={teamB || "TBD"}
            flagA={getFlag(teamA)}
            flagB={getFlag(teamB)}
            badgeA={teamA ? "YOUR PICK ✦" : ""}
            badgeB={teamB ? "YOUR PICK ✦" : ""}
            winner={picks[i]?.winner ?? null}
            onPick={team => setR16Pick(i, team)}
          />
        ))}
      </div>

      <button
        className="btn-gold btn-sheen"
        onClick={confirmR16}
        disabled={!allPicked}
        style={{
          width: "100%", justifyContent: "center",
          fontFamily: "var(--font-display)", fontSize: 13, letterSpacing: "3px", padding: "16px",
          opacity: allPicked ? 1 : 0.4,
          cursor: allPicked ? "pointer" : "not-allowed",
        }}
        id="confirm-r16"
      >
        CONFIRM ROUND OF 16
      </button>
    </div>
  );
}
