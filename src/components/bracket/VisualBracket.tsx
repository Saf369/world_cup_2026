"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import "./visual-bracket.css";

// ─── TYPES ───────────────────────────────────────────────────────────────────

export interface Team {
  n: string;
  f: string;
  seed: string;
}

// ─── INITIAL DATA ────────────────────────────────────────────────────────────

// Pre-seeded R32 matchups.
// 8 left matches, 8 right matches
const R32_DATA = [
  // LEFT SIDE R32 (8 matches, top to bottom)
  [
    { n: "Germany", f: "🇩🇪", seed: "1E" },
    { n: "Australia", f: "🇦🇺", seed: "3D" },
  ],
  [
    { n: "France", f: "🇫🇷", seed: "1I" },
    { n: "Egypt", f: "🇪🇬", seed: "3G" },
  ],
  [
    { n: "Denmark", f: "🇩🇰", seed: "2A" },
    { n: "Switzerland", f: "🇨🇭", seed: "2B" },
  ],
  [
    { n: "Netherlands", f: "🇳🇱", seed: "1F" },
    { n: "Morocco", f: "🇲🇦", seed: "2C" },
  ],
  [
    { n: "Colombia", f: "🇨🇴", seed: "2K" },
    { n: "Croatia", f: "🇭🇷", seed: "2L" },
  ],
  [
    { n: "Spain", f: "🇪🇸", seed: "1H" },
    { n: "Austria", f: "🇦🇹", seed: "2J" },
  ],
  [
    { n: "USA", f: "🇺🇸", seed: "1D" },
    { n: "Canada", f: "🇨🇦", seed: "3B" },
  ],
  [
    { n: "Belgium", f: "🇧🇪", seed: "1G" },
    { n: "South Korea", f: "🇰🇷", seed: "3A" },
  ],

  // RIGHT SIDE R32 (8 matches, top to bottom)
  [
    { n: "Brazil", f: "🇧🇷", seed: "1C" },
    { n: "Japan", f: "🇯🇵", seed: "2F" },
  ],
  [
    { n: "Ecuador", f: "🇪🇨", seed: "2E" },
    { n: "Senegal", f: "🇸🇳", seed: "2I" },
  ],
  [
    { n: "Mexico", f: "🇲🇽", seed: "1A" },
    { n: "Ukraine", f: "🇺🇦", seed: "3F" },
  ],
  [
    { n: "England", f: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", seed: "1L" },
    { n: "Norway", f: "🇳🇴", seed: "3I" },
  ],
  [
    { n: "Argentina", f: "🇦🇷", seed: "1J" },
    { n: "Uruguay", f: "🇺🇾", seed: "2H" },
  ],
  [
    { n: "Türkiye", f: "🇹🇷", seed: "2D" },
    { n: "Iran", f: "🇮🇷", seed: "2G" },
  ],
  [
    { n: "Italy", f: "🇮🇹", seed: "1B" },
    { n: "Algeria", f: "🇩🇿", seed: "3J" },
  ],
  [
    { n: "Portugal", f: "🇵🇹", seed: "1K" },
    { n: "Panama", f: "🇵🇦", seed: "3L" },
  ],
];

// Helper to make an empty team
const EMPTY_TEAM = { n: "TBD", f: "", seed: "" };

const INITIAL_ROUNDS = [
  Array(16).fill(null), // R32 winners (8 left, 8 right)
  Array(8).fill(null), // R16 winners (4 left, 4 right)
  Array(4).fill(null), // QF winners (2 left, 2 right)
  Array(2).fill(null), // SF winners (1 left, 1 right)
  Array(1).fill(null), // Final winner (1)
];

const LS_KEY = "mundial_bracket_v2_visual";

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function VisualBracket() {
  const [rounds, setRounds] = useState<(Team | null)[][]>(INITIAL_ROUNDS);
  const [toast, setToast] = useState<{ msg: string; visible: boolean }>({
    msg: "",
    visible: false,
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_KEY);
      if (stored) {
        setRounds(JSON.parse(stored));
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(rounds));
    } catch {
      /* ignore */
    }
  }, [rounds, hydrated]);

  // ─── LOGIC ─────────────────────────────────────────────────────────────────

  const showToast = useCallback((msg: string) => {
    setToast({ msg, visible: true });
    setTimeout(() => {
      setToast((prev) => (prev.msg === msg ? { ...prev, visible: false } : prev));
    }, 2800);
  }, []);

  // Team Resolution Function
  const getTeamAt = useCallback(
    (roundIdx: number, matchIdx: number, side: 0 | 1): Team => {
      if (roundIdx === 0) {
        return R32_DATA[matchIdx][side];
      }
      const prevRoundIdx = roundIdx - 1;
      const prevRound = rounds[prevRoundIdx];
      if (roundIdx === 1) {
        return prevRound[matchIdx * 2 + side] || EMPTY_TEAM;
      }
      if (roundIdx === 2) {
        return prevRound[matchIdx * 2 + side] || EMPTY_TEAM;
      }
      if (roundIdx === 3) {
        return prevRound[matchIdx * 2 + side] || EMPTY_TEAM;
      }
      if (roundIdx === 4) {
        return prevRound[side] || EMPTY_TEAM;
      }
      return EMPTY_TEAM;
    },
    [rounds]
  );

  const getWinnerAt = useCallback(
    (roundIdx: number, matchIdx: number): Team | null => {
      if (roundIdx < 0 || roundIdx > 4) return null;
      return rounds[roundIdx][matchIdx];
    },
    [rounds]
  );

  const clearDownstream = (newRounds: (Team | null)[][], startRound: number, startMatchIdx: number) => {
    // recursively clear
    let currentRound = startRound;
    let currentMatchIdx = startMatchIdx;

    while (currentRound < 4) {
      const nextRound = currentRound + 1;
      const nextMatchIdx = Math.floor(currentMatchIdx / 2);
      if (newRounds[nextRound][nextMatchIdx]) {
        newRounds[nextRound][nextMatchIdx] = null;
        currentRound = nextRound;
        currentMatchIdx = nextMatchIdx;
      } else {
        break; // already cleared
      }
    }
    // Also clear the final winner if we affected the final
    if (currentRound === 4 && newRounds[4][0]) {
       newRounds[4][0] = null;
    }
  };

  const handlePick = (
    roundIdx: number,
    matchIdx: number,
    team: Team,
    teamA: Team,
    teamB: Team
  ) => {
    // If either team is TBD, click does nothing
    if (teamA.n === "TBD" || teamB.n === "TBD") return;
    if (team.n === "TBD") return;

    setRounds((prevRounds) => {
      const newRounds = prevRounds.map((r) => [...r]);
      
      // Only clear if the pick changed
      if (newRounds[roundIdx][matchIdx]?.n !== team.n) {
        newRounds[roundIdx][matchIdx] = team;
        clearDownstream(newRounds, roundIdx, matchIdx);
        
        if (roundIdx === 4) {
             showToast(`🏆 ${team.n} — YOUR 2026 CHAMPION!`);
        } else {
             showToast(`${team.f} ${team.n} ADVANCES`);
        }
      }
      return newRounds;
    });
  };

  const resetBracket = () => {
    setRounds(INITIAL_ROUNDS);
    showToast("BRACKET RESET");
  };

  // Indicators
  const counts = {
    r32: rounds[0].filter(Boolean).length,
    r16: rounds[1].filter(Boolean).length,
    qf: rounds[2].filter(Boolean).length,
    sf: rounds[3].filter(Boolean).length,
    final: rounds[4].filter(Boolean).length,
  };

  if (!hydrated) return null;

  // ─── RENDER HELPERS ────────────────────────────────────────────────────────

  const renderTeamCard = (
    team: Team,
    otherTeam: Team,
    isRightSide: boolean,
    roundIdx: number,
    matchIdx: number,
    isFinal = false
  ) => {
    const winner = getWinnerAt(roundIdx, matchIdx);
    const isWinner = winner?.n === team.n;
    const isLoser = winner && winner.n !== team.n;
    const isEmpty = team.n === "TBD";

    let stateClass = "default";
    if (isEmpty) stateClass = "empty";
    else if (isWinner) stateClass = "winner";
    else if (isLoser) stateClass = "loser";

    const badge = (
      <span className="advances-badge">
        {isFinal ? "★" : isRightSide ? "◀" : "▶"} {isFinal ? "" : "ADVANCES"}
      </span>
    );

    const leftContent = isRightSide ? (
      <>
        {badge}
        <span className="seed">{team.seed}</span>
        <span className="name" style={{ textAlign: "right" }}>{team.n}</span>
        <span className="flag">{team.f}</span>
      </>
    ) : (
      <>
        <span className="flag">{team.f}</span>
        <span className="name">{team.n}</span>
        <span className="seed">{team.seed}</span>
        {badge}
      </>
    );

    return (
      <div
        className={`team-card ${isRightSide ? "right-side" : "left-side"} ${stateClass} ${isFinal ? 'final-row' : ''}`}
        onClick={() => handlePick(roundIdx, matchIdx, team, team, otherTeam)}
      >
        {leftContent}
      </div>
    );
  };

  const renderMatchSlot = (roundIdx: number, matchIdx: number, isRightSide: boolean) => {
    const teamA = getTeamAt(roundIdx, matchIdx, 0);
    const teamB = getTeamAt(roundIdx, matchIdx, 1);

    return (
      <div className="match-slot" key={`r${roundIdx}-m${matchIdx}`}>
        {renderTeamCard(teamA, teamB, isRightSide, roundIdx, matchIdx)}
        <div className="divider-line"></div>
        {renderTeamCard(teamB, teamA, isRightSide, roundIdx, matchIdx)}
      </div>
    );
  };

  const renderColumn = (title: string, roundIdx: number, startIdx: number, count: number, isRightSide: boolean, flex: number) => {
    const matches = [];
    for (let i = 0; i < count; i++) {
      matches.push(renderMatchSlot(roundIdx, startIdx + i, isRightSide));
    }
    return (
      <div className="bracket-column" style={{ flex }}>
        <div className="column-header">{title}</div>
        <div className="column-body">
            {matches}
        </div>
      </div>
    );
  };

  const renderFinalColumn = () => {
    const finalistA = getTeamAt(4, 0, 0);
    const finalistB = getTeamAt(4, 0, 1);
    const champion = getWinnerAt(4, 0);

    return (
      <div className="bracket-column final-column" style={{ width: 160, flex: "none" }}>
        <div className="column-header">★ Final ★</div>
        <div className="final-card-container">
            <div className="final-card">
            <div className="corner-ornament top-left"></div>
            <div className="corner-ornament top-right"></div>
            <div className="corner-ornament bottom-left"></div>
            <div className="corner-ornament bottom-right"></div>
            <div className="glow-overlay"></div>
            
            <div className="final-content">
                <div className="finalists-area">
                   {renderTeamCard(finalistA, finalistB, false, 4, 0, true)}
                   <div className="divider-line"></div>
                   {renderTeamCard(finalistB, finalistA, false, 4, 0, true)}
                </div>

                {champion && (
                <div className="champion-area">
                    <div className="champ-flag champ-pulse">{champion.f}</div>
                    <div className="champ-label">WINNERS</div>
                    <div className="champ-name">{champion.n}</div>
                </div>
                )}
            </div>
            </div>
        </div>
      </div>
    );
  };

  // ─── RENDER ────────────────────────────────────────────────────────────────

  return (
    <div className="visual-bracket-page">
      {/* 1. NAVIGATION BAR */}
      <div className="nav-bar">
        <div className="nav-left">
          <Link href="/" className="logo-link">
            MUNDIAL
          </Link>
          <span className="sub-label">World Cup 2026 Bracket</span>
        </div>
        
        <div className="nav-center">
          <div className={`round-pill ${counts.r32 === 16 ? "active" : ""}`}>R32</div>
          <div className={`round-pill ${counts.r16 === 8 ? "active" : ""}`}>R16</div>
          <div className={`round-pill ${counts.qf === 4 ? "active" : ""}`}>QF</div>
          <div className={`round-pill ${counts.sf === 2 ? "active" : ""}`}>SF</div>
          <div className={`round-pill ${counts.final === 1 ? "active" : ""}`}>Final</div>
        </div>

        <div className="nav-right">
          <Link href="/" className="my-bracket-badge" style={{ textDecoration: 'none', display: 'inline-block', cursor: 'pointer' }}>
            ← BACK TO HOME
          </Link>
        </div>
      </div>

      {/* 2. INSTRUCTION STRIP */}
      <div className="instruction-strip">
        Click a team to pick the <span className="highlight">WINNER</span> — bracket auto-advances round by round
      </div>

      {/* 3. BRACKET AREA */}
      <div className="bracket-scroll-container">
        <div className="bracket-inner">
          {/* LEFT HALF */}
          {renderColumn("Round of 32", 0, 0, 8, false, 1.4)}
          {renderColumn("Round of 16", 1, 0, 4, false, 1.2)}
          {renderColumn("Quarter-Finals", 2, 0, 2, false, 1.0)}
          {renderColumn("Semi-Finals", 3, 0, 1, false, 1.0)}

          {/* CENTER */}
          {renderFinalColumn()}

          {/* RIGHT HALF */}
          {renderColumn("Semi-Finals", 3, 1, 1, true, 1.0)}
          {renderColumn("Quarter-Finals", 2, 2, 2, true, 1.0)}
          {renderColumn("Round of 16", 1, 4, 4, true, 1.2)}
          {renderColumn("Round of 32", 0, 8, 8, true, 1.4)}
        </div>
      </div>

      {/* 4. RESET STRIP */}
      <div className="reset-strip">
        <button className="reset-button" onClick={resetBracket}>
          ↺ Reset Bracket
        </button>
      </div>

      {/* TOAST */}
      <div className={`toast-notification ${toast.visible ? "visible" : ""}`}>
        {toast.msg}
      </div>
    </div>
  );
}
