"use client";
import { useBracket, ALL_GROUPS, type Confidence } from "./BracketProvider";

function getFlag(name: string) {
  for (const g of ALL_GROUPS) {
    const t = g.teams.find(t => t.name === name);
    if (t) return t.flag;
  }
  return "🏳";
}

export default function StageFinal() {
  const { predictions, setFinalField, confirmFinal, setActiveStage } = useBracket();
  // Derive finalists from SF picks
  const sfPicks = predictions.sf;
  const teamA = sfPicks[0]?.winner ?? "";
  const teamB = sfPicks[1]?.winner ?? "";
  const final = predictions.final;

  const scoreH = final.score[0];
  const scoreA = final.score[1];
  const predicted =
    typeof scoreH === "number" && typeof scoreA === "number"
      ? scoreH > scoreA ? teamA : scoreH < scoreA ? teamB : "DRAW"
      : null;

  const canConfirm = teamA && teamB && final.winner;

  if (!teamA || !teamB) {
    return (
      <div className="stage-in" style={{ textAlign: "center", padding: "80px 0" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <div className="font-display" style={{ fontSize: 24, color: "#5A5248", letterSpacing: "0.1em" }}>
          COMPLETE SEMI-FINALS FIRST
        </div>
        <button className="btn-outline" style={{ marginTop: 24 }} onClick={() => setActiveStage(4)}>
          Go to Semi-Finals
        </button>
      </div>
    );
  }

  return (
    <div className="stage-in">
      <div style={{ marginBottom: 32 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>Stage 06 · The Moment of Truth</div>
        <h2 className="section-title">The <em>Final</em></h2>
      </div>

      {/* HERO CARD */}
      <div
        style={{
          position: "relative",
          background: "#050505",
          border: "1px solid rgba(201,168,76,0.35)",
          borderTop: "2px solid #C9A84C",
          borderRadius: 2,
          minHeight: 300,
          overflow: "hidden",
          marginBottom: 24,
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />
        <div className="hex-mesh" style={{ opacity: 0.5 }} />

        {/* Corner ornaments */}
        <div className="corner-ornament top-left" style={{ top: 16, left: 16 }} />
        <div className="corner-ornament top-right" style={{ top: 16, right: 16 }} />
        <div className="corner-ornament bottom-left" style={{ bottom: 16, left: 16 }} />
        <div className="corner-ornament bottom-right" style={{ bottom: 16, right: 16 }} />

        {/* Header label */}
        <div style={{ textAlign: "center", paddingTop: 28, position: "relative", zIndex: 2 }}>
          <div
            className="font-display"
            style={{ fontSize: 12, letterSpacing: "6px", color: "#C9A84C" }}
          >
            THE FINAL — JULY 19, 2026 — METLIFE STADIUM
          </div>
          <div className="divider-gold" style={{ margin: "12px auto" }} />
        </div>

        {/* Two team panels + VS + scores */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            gap: 0,
            position: "relative",
            zIndex: 2,
            padding: "20px 32px 0",
          }}
        >
          {/* Team A */}
          <button
            onClick={() => setFinalField("winner", teamA)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              textAlign: "center",
              padding: "16px",
              borderRadius: 2,
              transition: "background 0.2s ease",
              outline: final.winner === teamA ? "1px solid rgba(201,168,76,0.5)" : "none",
              opacity: final.winner && final.winner !== teamA ? 0.5 : 1,
            }}
            id="final-pick-a"
          >
            <div style={{ fontSize: 64, marginBottom: 8 }}>{getFlag(teamA)}</div>
            <div className="font-display" style={{ fontSize: 32, color: final.winner === teamA ? "#C9A84C" : "#E8E0D0", letterSpacing: "0.1em" }}>
              {teamA.toUpperCase()}
            </div>
            <div className="label-xs" style={{ color: "#5A5248", fontSize: 8, marginTop: 4, letterSpacing: "2px" }}>
              YOUR FINALIST
            </div>
            {final.winner === teamA && (
              <div className="result-badge home-win" style={{ margin: "8px auto 0", fontSize: 7, padding: "3px 12px" }}>
                YOUR CHAMPION ✦
              </div>
            )}
          </button>

          {/* Center — VS + score */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "0 24px" }}>
            <span className="font-display" style={{ fontSize: 48, color: "#C9A84C", letterSpacing: "0.1em" }}>VS</span>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="number" min={0} max={20}
                className="score-input score-input-lg"
                value={scoreH === "" ? "" : scoreH}
                onChange={e => setFinalField("scoreH", e.target.value === "" ? "" : parseInt(e.target.value) || 0)}
                id="final-score-home"
              />
              <span className="font-display" style={{ fontSize: 24, color: "#5A5248" }}>–</span>
              <input
                type="number" min={0} max={20}
                className="score-input score-input-lg"
                value={scoreA === "" ? "" : scoreA}
                onChange={e => setFinalField("scoreA", e.target.value === "" ? "" : parseInt(e.target.value) || 0)}
                id="final-score-away"
              />
            </div>
            {predicted && (
              <div style={{ textAlign: "center" }}>
                <div className="label-xs" style={{ color: "#5A5248", fontSize: 7, letterSpacing: "3px", marginBottom: 4 }}>PREDICTED WINNER</div>
                <div className="font-display" style={{ fontSize: 14, color: "#C9A84C", letterSpacing: "4px" }}>
                  {predicted.toUpperCase()}
                </div>
              </div>
            )}
          </div>

          {/* Team B */}
          <button
            onClick={() => setFinalField("winner", teamB)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              textAlign: "center",
              padding: "16px",
              borderRadius: 2,
              transition: "background 0.2s ease",
              outline: final.winner === teamB ? "1px solid rgba(201,168,76,0.5)" : "none",
              opacity: final.winner && final.winner !== teamB ? 0.5 : 1,
            }}
            id="final-pick-b"
          >
            <div style={{ fontSize: 64, marginBottom: 8 }}>{getFlag(teamB)}</div>
            <div className="font-display" style={{ fontSize: 32, color: final.winner === teamB ? "#C9A84C" : "#E8E0D0", letterSpacing: "0.1em" }}>
              {teamB.toUpperCase()}
            </div>
            <div className="label-xs" style={{ color: "#5A5248", fontSize: 8, marginTop: 4, letterSpacing: "2px" }}>
              YOUR FINALIST
            </div>
            {final.winner === teamB && (
              <div className="result-badge home-win" style={{ margin: "8px auto 0", fontSize: 7, padding: "3px 12px" }}>
                YOUR CHAMPION ✦
              </div>
            )}
          </button>
        </div>

        {/* Bottom padding */}
        <div style={{ height: 28 }} />
      </div>

      {/* Confidence + Scorer */}
      <div
        style={{
          background: "#0D0D0D",
          border: "1px solid #252525",
          borderRadius: 2,
          padding: "20px 24px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          marginBottom: 24,
        }}
      >
        {/* Confidence */}
        <div>
          <div className="label-xs" style={{ color: "#C9A84C", fontSize: 8, letterSpacing: "2px", marginBottom: 10 }}>
            CONFIDENCE LEVEL
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {(["LOW", "MED", "HIGH"] as Confidence[]).map(c => (
              <button
                key={c}
                className={`confidence-pill ${final.confidence === c ? "selected" : ""}`}
                onClick={() => setFinalField("confidence", c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Goalscorer */}
        <div>
          <div className="label-xs" style={{ color: "#C9A84C", fontSize: 8, letterSpacing: "2px", marginBottom: 10 }}>
            PREDICT FINAL GOALSCORER:
          </div>
          <input
            type="text"
            className="scorer-input"
            placeholder="Player name..."
            value={final.scorer}
            onChange={e => setFinalField("scorer", e.target.value)}
            id="final-scorer"
          />
        </div>
      </div>

      {/* Confirm */}
      <button
        className="btn-gold btn-sheen"
        onClick={() => confirmFinal(predictions)}
        disabled={!canConfirm}
        style={{
          width: "100%", justifyContent: "center",
          fontFamily: "var(--font-display)", fontSize: 14, letterSpacing: "4px", padding: "18px",
          opacity: canConfirm ? 1 : 0.4,
          cursor: canConfirm ? "pointer" : "not-allowed",
        }}
        id="confirm-final"
      >
        LOCK IN MY CHAMPION
      </button>
      {!final.winner && (
        <p className="label-xs" style={{ color: "#5A5248", textAlign: "center", marginTop: 8, fontSize: 8 }}>
          Click on a team above to select your World Cup Champion
        </p>
      )}
    </div>
  );
}
