"use client";
import { useState, useEffect } from "react";
import {
  useBracket,
  ALL_GROUPS,
  MATCH_PAIRINGS,
  computeStandings,
  type MatchScore,
  type Standing,
} from "./BracketProvider";

// ─── MATCH CARD ───────────────────────────────────────────────────────────────

function MatchCard({
  groupLabel,
  matchIdx,
  homeTeam,
  awayTeam,
  score,
}: {
  groupLabel: string;
  matchIdx: number;
  homeTeam: { name: string; flag: string };
  awayTeam: { name: string; flag: string };
  score: MatchScore;
}) {
  const { updateGroupMatch } = useBracket();
  const hg = typeof score.home === "number" ? score.home : null;
  const ag = typeof score.away === "number" ? score.away : null;
  const bothFilled = hg !== null && ag !== null;
  const result = bothFilled
    ? hg! > ag! ? "home" : hg! < ag! ? "away" : "draw"
    : null;

  return (
    <div
      style={{
        background: "#0D0D0D",
        border: "1px solid #252525",
        borderRadius: 2,
        padding: "16px",
        position: "relative",
      }}
    >
      {/* Corner ornaments */}
      <div className="corner-ornament top-left" style={{ top: 8, left: 8, width: 20, height: 20 }} />
      <div className="corner-ornament top-right" style={{ top: 8, right: 8, width: 20, height: 20 }} />

      {/* Match number */}
      <div className="label-xs" style={{ color: "#5A4E38", fontSize: 8, letterSpacing: "3px", marginBottom: 12 }}>
        MATCH {String(matchIdx + 1).padStart(2, "0")}
      </div>

      {/* Teams + Score */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 12 }}>
        {/* Home */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: "#E8E0D0", letterSpacing: "1px", fontFamily: "var(--font-ui)" }}>
              {homeTeam.name}
            </div>
          </div>
          <span style={{ fontSize: 24 }}>{homeTeam.flag}</span>
        </div>

        {/* Score inputs */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            type="number" min={0} max={20}
            className="score-input"
            value={score.home === "" ? "" : score.home}
            onChange={e => {
              const v = e.target.value === "" ? "" : Math.max(0, parseInt(e.target.value) || 0);
              updateGroupMatch(groupLabel, matchIdx, "home", v as number | "");
            }}
            id={`score-${groupLabel}-${matchIdx}-home`}
          />
          <span className="font-display" style={{ fontSize: 18, color: "#5A5248" }}>–</span>
          <input
            type="number" min={0} max={20}
            className="score-input"
            value={score.away === "" ? "" : score.away}
            onChange={e => {
              const v = e.target.value === "" ? "" : Math.max(0, parseInt(e.target.value) || 0);
              updateGroupMatch(groupLabel, matchIdx, "away", v as number | "");
            }}
            id={`score-${groupLabel}-${matchIdx}-away`}
          />
        </div>

        {/* Away */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 24 }}>{awayTeam.flag}</span>
          <div style={{ fontSize: 11, fontWeight: 500, color: "#E8E0D0", letterSpacing: "1px", fontFamily: "var(--font-ui)" }}>
            {awayTeam.name}
          </div>
        </div>
      </div>

      {/* Result badge */}
      {result && (
        <div style={{ textAlign: "center", marginTop: 10 }}>
          <span className={`result-badge ${result === "home" ? "home-win" : result === "away" ? "away-win" : "draw"}`}>
            {result === "home" ? `${homeTeam.name} Win` : result === "away" ? `${awayTeam.name} Win` : "Draw"}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── STANDINGS TABLE ──────────────────────────────────────────────────────────

function StandingsTable({ standings }: { standings: Standing[] }) {
  return (
    <div style={{ marginTop: 24 }}>
      <div className="eyebrow" style={{ marginBottom: 12 }}>Live Standings</div>
      <div style={{ background: "#0D0D0D", border: "1px solid #252525", borderRadius: 2, overflow: "hidden" }}>
        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "24px 1fr 28px 28px 28px 28px 28px 28px 36px", padding: "8px 16px", borderBottom: "1px solid #1E1E1E" }}>
          {["", "Team", "P","W","D","L","GF","GA","PTS"].map((h,i) => (
            <span key={i} className="label-xs" style={{ textAlign: i > 1 ? "center" : "left", color: "#5A5248", fontSize: 8 }}>{h}</span>
          ))}
        </div>
        {standings.map((s, i) => (
          <div
            key={s.team.name}
            style={{
              display: "grid",
              gridTemplateColumns: "24px 1fr 28px 28px 28px 28px 28px 28px 36px",
              padding: "10px 16px",
              borderBottom: i < 3 ? "1px solid #1A1A1A" : "none",
              background: i < 2 ? "rgba(201,168,76,0.03)" : "transparent",
              borderLeft: i < 2 ? "2px solid #C9A84C" : "2px solid transparent",
              alignItems: "center",
              transition: "all 0.3s ease",
            }}
          >
            <span className="font-display" style={{ fontSize: 12, color: i < 2 ? "#C9A84C" : "#5A5248" }}>{i+1}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 14 }}>{s.team.flag}</span>
              <span className="label-xs" style={{ fontSize: 9, color: i < 2 ? "#E8E0D0" : "#9A9080", letterSpacing: "0.8px" }}>{s.team.name}</span>
            </div>
            {[s.p,s.w,s.d,s.l,s.gf,s.ga].map((v,j) => (
              <span key={j} className="label-xs" style={{ textAlign: "center", color: "#5A5248", fontSize: 10 }}>{v}</span>
            ))}
            <span className="font-display" style={{ textAlign: "center", fontSize: 14, color: i < 2 ? "#C9A84C" : "#9A9080" }}>{s.pts}</span>
          </div>
        ))}
      </div>
      <div className="label-xs" style={{ color: "#5A5248", marginTop: 8, fontSize: 8 }}>
        ▐ Gold border = projected qualification · Top 2 advance automatically
      </div>
    </div>
  );
}

// ─── MAIN GROUP STAGE COMPONENT ───────────────────────────────────────────────

export default function StageGroupStage() {
  const { predictions, confirmGroup, groupStandings } = useBracket();
  const [activeGroup, setActiveGroup] = useState("A");
  const [showNotif, setShowNotif] = useState(false);
  const [prevAllConfirmed, setPrevAllConfirmed] = useState(false);

  const group = ALL_GROUPS.find(g => g.label === activeGroup)!;
  const groupState = predictions.groups[activeGroup];
  const standings = groupStandings[activeGroup];

  const allScoresFilled = groupState.matches.every(
    m => m.home !== "" && m.away !== ""
  );
  const allGroupsConfirmed = ALL_GROUPS.every(g => predictions.groups[g.label].confirmed);

  // Show notification when all groups confirmed
  useEffect(() => {
    if (allGroupsConfirmed && !prevAllConfirmed) {
      setShowNotif(true);
      const t = setTimeout(() => setShowNotif(false), 4000);
      return () => clearTimeout(t);
    }
    setPrevAllConfirmed(allGroupsConfirmed);
  }, [allGroupsConfirmed, prevAllConfirmed]);

  return (
    <div className="stage-in">
      {/* Notification */}
      {showNotif && (
        <div
          className="bracket-notif"
          style={{
            background: "#0D0D0D",
            border: "1px solid #C9A84C",
            borderRadius: 2,
            padding: "14px 20px",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 0 24px rgba(201,168,76,0.12)",
          }}
        >
          <span className="font-display" style={{ fontSize: 16, color: "#C9A84C", letterSpacing: "0.1em" }}>
            GROUP STAGE COMPLETE — ROUND OF 32 UNLOCKED
          </span>
          <button
            onClick={() => setShowNotif(false)}
            style={{ background: "none", border: "none", color: "#C9A84C", cursor: "pointer", fontSize: 16 }}
          >×</button>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>Stage 01 · 12 Groups · 72 Matches</div>
        <h2 className="section-title">Group <em>Stage</em></h2>
      </div>

      {/* Group tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
        {ALL_GROUPS.map(g => {
          const isComplete = predictions.groups[g.label].confirmed;
          return (
            <div key={g.label} style={{ position: "relative", paddingBottom: 8 }}>
              <button
                className={`group-tab ${activeGroup === g.label ? "active" : ""}`}
                onClick={() => setActiveGroup(g.label)}
                id={`group-tab-${g.label}`}
              >
                {g.label}
              </button>
              {isComplete && <div className="group-tab-dot" />}
            </div>
          );
        })}
      </div>

      {/* Group info */}
      <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
        <div className="font-display" style={{ fontSize: 28, color: "#C9A84C", letterSpacing: "0.15em" }}>
          GROUP {activeGroup}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {group.teams.map(t => (
            <span key={t.name} title={t.name} style={{ fontSize: 20 }}>{t.flag}</span>
          ))}
        </div>
        {groupState.confirmed && (
          <span className="result-badge home-win" style={{ marginLeft: 4 }}>Confirmed ✓</span>
        )}
      </div>

      {/* Match cards 2-col grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 28 }}>
        {MATCH_PAIRINGS.map(([hi, ai], matchIdx) => (
          <MatchCard
            key={matchIdx}
            groupLabel={activeGroup}
            matchIdx={matchIdx}
            homeTeam={group.teams[hi]}
            awayTeam={group.teams[ai]}
            score={groupState.matches[matchIdx]}
          />
        ))}
      </div>

      {/* Live standings table */}
      <StandingsTable standings={standings} />

      {/* Confirm button */}
      <div style={{ marginTop: 24 }}>
        <button
          className="btn-gold btn-sheen"
          onClick={() => confirmGroup(activeGroup, predictions)}
          disabled={!allScoresFilled || groupState.confirmed}
          style={{
            width: "100%",
            justifyContent: "center",
            fontFamily: "var(--font-display)",
            fontSize: 13,
            letterSpacing: "3px",
            padding: "16px",
            opacity: !allScoresFilled || groupState.confirmed ? 0.4 : 1,
            cursor: !allScoresFilled || groupState.confirmed ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
          }}
          id={`confirm-group-${activeGroup}`}
        >
          {groupState.confirmed ? `GROUP ${activeGroup} CONFIRMED ✓` : `CONFIRM GROUP ${activeGroup}`}
        </button>
        {!allScoresFilled && (
          <p className="label-xs" style={{ color: "#5A5248", textAlign: "center", marginTop: 8, fontSize: 8 }}>
            Enter all 6 match scores to confirm
          </p>
        )}
      </div>
    </div>
  );
}
