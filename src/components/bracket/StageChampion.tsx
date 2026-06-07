"use client";
import { useState } from "react";
import { useBracket, ALL_GROUPS } from "./BracketProvider";

function getFlag(name: string) {
  for (const g of ALL_GROUPS) { const t = g.teams.find(t => t.name === name); if (t) return t.flag; }
  return "🏳";
}

function buildShareText(p: ReturnType<typeof useBracket>["predictions"]) {
  const lines = ["🏆 MY XI 2026 BRACKET", "================================"];
  ALL_GROUPS.forEach(g => {
    const gs = p.groups[g.label];
    if (gs.confirmed) lines.push(`Group ${g.label}: confirmed`);
  });
  p.r32.forEach((m, i) => m.winner && lines.push(`R32 Match ${i+1}: ${m.winner}`));
  p.r16.forEach((m, i) => m.winner && lines.push(`R16 Match ${i+1}: ${m.winner}`));
  p.qf.forEach((m,  i) => m.winner && lines.push(`QF ${i+1}: ${m.winner} (${m.confidence ?? "?"})`));
  p.sf.forEach((m,  i) => m.winner && lines.push(`SF ${i+1}: ${m.winner} ${m.score[0]}–${m.score[1]}`));
  if (p.final.winner) lines.push(`🏆 CHAMPION: ${p.final.winner} (${p.final.score[0]}–${p.final.score[1]})`);
  lines.push("================================");
  lines.push("Made with XI — xi2026.app");
  return lines.join("\n");
}

function StatsStrip() {
  const { predictions } = useBracket();
  // Total goals from group stage
  let totalGoals = 0;
  let biggestWin = 0;
  let biggestWinMatch = "";
  const teamGoals: Record<string, number> = {};
  ALL_GROUPS.forEach(g => {
    const gs = predictions.groups[g.label];
    gs.matches.forEach((m, mi) => {
      const hg = typeof m.home === "number" ? m.home : 0;
      const ag = typeof m.away === "number" ? m.away : 0;
      totalGoals += hg + ag;
      const margin = Math.abs(hg - ag);
      if (margin > biggestWin) {
        biggestWin = margin;
        const [hi, ai] = [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]][mi];
        biggestWinMatch = `${g.teams[hi].name} ${hg}–${ag} ${g.teams[ai].name}`;
      }
      const [hi, ai] = [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]][mi];
      teamGoals[g.teams[hi].name] = (teamGoals[g.teams[hi].name]??0)+hg;
      teamGoals[g.teams[ai].name] = (teamGoals[g.teams[ai].name]??0)+ag;
    });
  });
  const topScoringTeam = Object.entries(teamGoals).sort((a,b)=>b[1]-a[1])[0];

  const stats = [
    { label: "Total Goals Predicted", value: totalGoals || "—", sub: "All group matches" },
    { label: "Biggest Win", value: biggestWin ? `+${biggestWin}` : "—", sub: biggestWinMatch || "Not calculated" },
    { label: "Top Scoring Team", value: topScoringTeam?.[0] ?? "—", sub: topScoringTeam ? `${topScoringTeam[1]} goals scored` : "" },
    { label: "Your Champion", value: predictions.final.winner ?? "—", sub: predictions.final.score[0] !== "" ? `${predictions.final.score[0]}–${predictions.final.score[1]}` : "Predicted score" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, background: "#0D0D0D", border: "1px solid #252525", borderRadius: 2, marginBottom: 32, overflow: "hidden" }}>
      {stats.map((s, i) => (
        <div key={i} style={{ padding: "20px", borderRight: i < 3 ? "1px solid #252525" : "none", textAlign: "center" }}>
          <div className="font-display" style={{ fontSize: 22, color: "#C9A84C", letterSpacing: "0.05em", marginBottom: 4 }}>{String(s.value)}</div>
          <div className="label-xs" style={{ color: "#E8E0D0", marginBottom: 4, fontSize: 8 }}>{s.label}</div>
          <div className="label-xs" style={{ color: "#5A5248", fontSize: 7 }}>{s.sub}</div>
        </div>
      ))}
    </div>
  );
}

export default function StageChampion() {
  const { predictions, resetAll } = useBracket();
  const [showShare, setShowShare] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [copied, setCopied] = useState(false);

  const champion = predictions.final.winner;
  const finalScore = predictions.final.score;
  const finalConf = predictions.final.confidence;

  const shareText = buildShareText(predictions);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const handlePDF = () => { window.print(); };

  if (!champion) {
    return (
      <div className="stage-in" style={{ textAlign: "center", padding: "80px 0" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🏆</div>
        <div className="font-display" style={{ fontSize: 24, color: "#5A5248", letterSpacing: "0.1em" }}>
          COMPLETE THE FINAL FIRST
        </div>
      </div>
    );
  }

  return (
    <div className="stage-in">
      {/* Share modal */}
      {showShare && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "#0D0D0D", border: "1px solid rgba(201,168,76,0.4)", borderRadius: 2, padding: 32, maxWidth: 560, width: "100%", position: "relative" }}>
            <div className="corner-ornament top-left" />
            <div className="corner-ornament top-right" />
            <div className="font-display" style={{ fontSize: 18, color: "#C9A84C", letterSpacing: "0.1em", marginBottom: 16 }}>SHARE YOUR BRACKET</div>
            <textarea
              readOnly
              value={shareText}
              style={{ width: "100%", height: 200, background: "#141414", border: "1px solid #252525", borderRadius: 2, color: "#9A9080", fontFamily: "monospace", fontSize: 11, padding: 12, resize: "none", outline: "none" }}
            />
            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <button className="btn-gold btn-sheen" onClick={handleCopy} style={{ flex: 1, justifyContent: "center" }}>
                {copied ? "COPIED ✓" : "COPY TO CLIPBOARD"}
              </button>
              <button className="btn-outline" onClick={() => setShowShare(false)} style={{ flex: 1, justifyContent: "center" }}>CLOSE</button>
            </div>
          </div>
        </div>
      )}

      {/* Reset confirm modal */}
      {showReset && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "#0D0D0D", border: "1px solid rgba(201,168,76,0.4)", borderRadius: 2, padding: 32, maxWidth: 400, width: "100%", textAlign: "center" }}>
            <div className="font-display" style={{ fontSize: 20, color: "#E8E0D0", letterSpacing: "0.1em", marginBottom: 8 }}>RESET ALL PREDICTIONS?</div>
            <div className="label-xs" style={{ color: "#5A5248", marginBottom: 24 }}>This will permanently clear your entire bracket.</div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button className="btn-gold" onClick={() => { resetAll(); setShowReset(false); }}>YES, RESET</button>
              <button className="btn-outline" onClick={() => setShowReset(false)}>NO, KEEP IT</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>Stage 07 · Prediction Complete</div>
        <h2 className="section-title">Your <em>Champion</em></h2>
      </div>

      {/* Champion hero card */}
      <div style={{ position: "relative", background: "#050505", border: "1px solid rgba(201,168,76,0.4)", borderRadius: 2, minHeight: 280, overflow: "hidden", marginBottom: 24, textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 30%, rgba(201,168,76,0.1) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div className="hex-mesh" />
        <div className="corner-ornament top-left" style={{ top: 20, left: 20 }} />
        <div className="corner-ornament top-right" style={{ top: 20, right: 20 }} />
        <div className="corner-ornament bottom-left" style={{ bottom: 20, left: 20 }} />
        <div className="corner-ornament bottom-right" style={{ bottom: 20, right: 20 }} />

        <div style={{ position: "relative", zIndex: 2, paddingTop: 32, paddingBottom: 32 }}>
          {/* Trophy */}
          <div className="trophy-reveal trophy-glow" style={{ fontSize: 64, marginBottom: 12, display: "inline-block" }}>🏆</div>

          <div className="label-xs" style={{ color: "#C9A84C", fontSize: 8, letterSpacing: "6px", marginBottom: 12 }}>
            YOUR 2026 WORLD CUP CHAMPION
          </div>
          <div style={{ fontSize: 80, marginBottom: 8 }}>{getFlag(champion)}</div>
          <div
            className="font-display"
            style={{ fontSize: "clamp(36px,6vw,64px)", color: "#C9A84C", letterSpacing: "0.1em", textShadow: "0 0 40px rgba(201,168,76,0.3)" }}
          >
            {champion.toUpperCase()}
          </div>

          {(finalScore[0] !== "" && finalScore[1] !== "") && (
            <div className="font-display" style={{ fontSize: 32, color: "#9A9080", letterSpacing: "0.08em", marginTop: 8 }}>
              {finalScore[0]} — {finalScore[1]}
            </div>
          )}
          {finalConf && (
            <div style={{ marginTop: 12 }}>
              <span className={`confidence-pill selected`} style={{ pointerEvents: "none" }}>
                {finalConf} CONFIDENCE
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Stats strip */}
      <StatsStrip />

      {/* Action buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <button
          className="btn-outline btn-sheen"
          onClick={() => setShowShare(true)}
          style={{ justifyContent: "center", gap: 8 }}
          id="btn-share"
        >
          ✦ SHARE MY BRACKET
        </button>
        <button
          className="btn-gold btn-sheen"
          onClick={handlePDF}
          style={{ justifyContent: "center", gap: 8 }}
          id="btn-pdf"
        >
          ↓ DOWNLOAD PDF
        </button>
        <button
          onClick={() => setShowReset(true)}
          style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            gap: 8, padding: "12px 28px",
            fontFamily: "var(--font-ui)", fontSize: 10, fontWeight: 600,
            letterSpacing: "2.5px", textTransform: "uppercase",
            color: "#8B3A3A", background: "transparent",
            border: "1px solid #3A1A1A", borderRadius: 2,
            cursor: "pointer", transition: "all 0.22s ease",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor="#8B3A3A"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor="#3A1A1A"; }}
          id="btn-reset"
        >
          ↺ START OVER
        </button>
      </div>
    </div>
  );
}
