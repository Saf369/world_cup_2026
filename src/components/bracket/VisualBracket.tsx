"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import "./visual-bracket.css";

// ─── TYPES ───────────────────────────────────────────────────────────────────
export interface Team {
  n: string;
  f: string;
  seed: string;
  groupId?: string;
}

export interface GroupData {
  id: string;
  teams: { n: string; f: string; abbr: string }[];
}

export interface GroupSelection {
  selected: string[]; // array of team names, up to 2
  confirmed: boolean;
}

// ─── INITIAL DATA ────────────────────────────────────────────────────────────
const GROUPS_DATA: GroupData[] = [
  { id: 'A', teams: [{ n: 'Mexico', f: '🇲🇽', abbr: 'MEX' }, { n: 'South Africa', f: '🇿🇦', abbr: 'RSA' }, { n: 'South Korea', f: '🇰🇷', abbr: 'KOR' }, { n: 'Czechia', f: '🇨🇿', abbr: 'CZE' }] },
  { id: 'B', teams: [{ n: 'Canada', f: '🇨🇦', abbr: 'CAN' }, { n: 'Bosnia-Herz.', f: '🇧🇦', abbr: 'BIH' }, { n: 'Qatar', f: '🇶🇦', abbr: 'QAT' }, { n: 'Switzerland', f: '🇨🇭', abbr: 'SUI' }] },
  { id: 'C', teams: [{ n: 'Brazil', f: '🇧🇷', abbr: 'BRA' }, { n: 'Morocco', f: '🇲🇦', abbr: 'MAR' }, { n: 'Haiti', f: '🇭🇹', abbr: 'HAI' }, { n: 'Scotland', f: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', abbr: 'SCO' }] },
  { id: 'D', teams: [{ n: 'USA', f: '🇺🇸', abbr: 'USA' }, { n: 'Paraguay', f: '🇵🇾', abbr: 'PAR' }, { n: 'Australia', f: '🇦🇺', abbr: 'AUS' }, { n: 'Türkiye', f: '🇹🇷', abbr: 'TUR' }] },
  { id: 'E', teams: [{ n: 'Germany', f: '🇩🇪', abbr: 'GER' }, { n: 'Curaçao', f: '🇨🇼', abbr: 'CUW' }, { n: 'Ivory Coast', f: '🇨🇮', abbr: 'CIV' }, { n: 'Ecuador', f: '🇪🇨', abbr: 'ECU' }] },
  { id: 'F', teams: [{ n: 'Netherlands', f: '🇳🇱', abbr: 'NED' }, { n: 'Japan', f: '🇯🇵', abbr: 'JPN' }, { n: 'Sweden', f: '🇸🇪', abbr: 'SWE' }, { n: 'Tunisia', f: '🇹🇳', abbr: 'TUN' }] },
  { id: 'G', teams: [{ n: 'Belgium', f: '🇧🇪', abbr: 'BEL' }, { n: 'Egypt', f: '🇪🇬', abbr: 'EGY' }, { n: 'Iran', f: '🇮🇷', abbr: 'IRN' }, { n: 'New Zealand', f: '🇳🇿', abbr: 'NZL' }] },
  { id: 'H', teams: [{ n: 'Spain', f: '🇪🇸', abbr: 'ESP' }, { n: 'Cape Verde', f: '🇨🇻', abbr: 'CPV' }, { n: 'Saudi Arabia', f: '🇸🇦', abbr: 'KSA' }, { n: 'Uruguay', f: '🇺🇾', abbr: 'URU' }] },
  { id: 'I', teams: [{ n: 'France', f: '🇫🇷', abbr: 'FRA' }, { n: 'Senegal', f: '🇸🇳', abbr: 'SEN' }, { n: 'Iraq', f: '🇮🇶', abbr: 'IRQ' }, { n: 'Norway', f: '🇳🇴', abbr: 'NOR' }] },
  { id: 'J', teams: [{ n: 'Argentina', f: '🇦🇷', abbr: 'ARG' }, { n: 'Algeria', f: '🇩🇿', abbr: 'ALG' }, { n: 'Austria', f: '🇦🇹', abbr: 'AUT' }, { n: 'Jordan', f: '🇯🇴', abbr: 'JOR' }] },
  { id: 'K', teams: [{ n: 'Portugal', f: '🇵🇹', abbr: 'POR' }, { n: 'DR Congo', f: '🇨🇩', abbr: 'COD' }, { n: 'Uzbekistan', f: '🇺🇿', abbr: 'UZB' }, { n: 'Colombia', f: '🇨🇴', abbr: 'COL' }] },
  { id: 'L', teams: [{ n: 'England', f: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', abbr: 'ENG' }, { n: 'Croatia', f: '🇭🇷', abbr: 'CRO' }, { n: 'Ghana', f: '🇬🇭', abbr: 'GHA' }, { n: 'Panama', f: '🇵🇦', abbr: 'PAN' }] }
];

const EMPTY_TEAM = { n: "TBD", f: "", seed: "" };
const TBD_3 = { n: "3rd Place TBD", f: "", seed: "3rd" };

const INITIAL_ROUNDS = [
  Array(16).fill(null), // R32 winners (8 left, 8 right)
  Array(8).fill(null), // R16 winners (4 left, 4 right)
  Array(4).fill(null), // QF winners (2 left, 2 right)
  Array(2).fill(null), // SF winners (1 left, 1 right)
  Array(1).fill(null), // Final winner (1)
];

const LS_KEY = "mundial2026";

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function VisualBracket() {
  const [activeTab, setActiveTab] = useState<'groups' | 'best8' | 'bracket'>('groups');
  
  // State
  const [groupSelections, setGroupSelections] = useState<Record<string, GroupSelection>>(() => {
    const init: Record<string, GroupSelection> = {};
    GROUPS_DATA.forEach(g => { init[g.id] = { selected: [], confirmed: false }; });
    return init;
  });
  
  const [thirdRankings, setThirdRankings] = useState<string[]>([]);
  const [thirdRankingsConfirmed, setThirdRankingsConfirmed] = useState(false);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  
  const [rounds, setRounds] = useState<(Team | null)[][]>(INITIAL_ROUNDS);
  const [customTeams, setCustomTeams] = useState<Record<string, string>>({});

  const [toast, setToast] = useState<{ msg: string; visible: boolean }>({ msg: "", visible: false });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.groupSelections) setGroupSelections(parsed.groupSelections);
        if (parsed.rounds) setRounds(parsed.rounds);
        if (parsed.customTeams) setCustomTeams(parsed.customTeams);
        if (parsed.thirdRankings) setThirdRankings(parsed.thirdRankings);
        if (parsed.thirdRankingsConfirmed !== undefined) setThirdRankingsConfirmed(parsed.thirdRankingsConfirmed);
      }
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(LS_KEY, JSON.stringify({ groupSelections, rounds, customTeams, thirdRankings, thirdRankingsConfirmed }));
  }, [groupSelections, rounds, customTeams, thirdRankings, thirdRankingsConfirmed, hydrated]);

  // ─── LOGIC ─────────────────────────────────────────────────────────────────

  const showToast = useCallback((msg: string) => {
    setToast({ msg, visible: true });
    setTimeout(() => {
      setToast((prev) => (prev.msg === msg ? { ...prev, visible: false } : prev));
    }, 2800);
  }, []);

  const confirmedGroupCount = Object.values(groupSelections).filter(g => g.confirmed).length;
  const groupsAllConfirmed = confirmedGroupCount === 12;

  useEffect(() => {
    if (groupsAllConfirmed && thirdRankings.length === 0) {
      const thirds = GROUPS_DATA.map(g => {
        const sel = groupSelections[g.id].selected;
        return g.teams.filter(t => !sel.includes(t.n))[0].n;
      });
      setThirdRankings(thirds);
    } else if (!groupsAllConfirmed) {
      setThirdRankings([]);
      setThirdRankingsConfirmed(false);
    }
  }, [groupsAllConfirmed, groupSelections, thirdRankings.length]);

  const generatedR32Data = useMemo(() => {
    if (!groupsAllConfirmed) {
      return Array.from({ length: 16 }, () => [{ ...EMPTY_TEAM }, { ...EMPTY_TEAM }]);
    }

    const getFirst = (id: string) => {
      const g = GROUPS_DATA.find(x => x.id === id)!;
      const tName = groupSelections[id].selected[0];
      const t = g.teams.find(x => x.n === tName)!;
      return { n: t.n, f: t.f, seed: `W`, groupId: id };
    };
    const getSecond = (id: string) => {
      const g = GROUPS_DATA.find(x => x.id === id)!;
      const tName = groupSelections[id].selected[1];
      const t = g.teams.find(x => x.n === tName)!;
      return { n: t.n, f: t.f, seed: `RU`, groupId: id };
    };

    const M1 = [getFirst('A'), getSecond('C')];
    const M2 = [getFirst('B'), getSecond('D')];
    const M3 = [getFirst('C'), getSecond('A')];
    const M4 = [getFirst('D'), getSecond('B')];
    const M5 = [getFirst('E'), getSecond('G')];
    const M6 = [getFirst('F'), getSecond('H')];
    const M7 = [getFirst('G'), getSecond('E')];
    const M8 = [getFirst('H'), getSecond('F')];

    const M9 = [getFirst('I'), getSecond('K')];
    const M10 = [getFirst('J'), getSecond('L')];
    const M11 = [getFirst('K'), getSecond('I')];
    const M12 = [getFirst('L'), getSecond('J')];

    const best8 = thirdRankingsConfirmed ? thirdRankings.slice(0, 8) : [];
    const getThird = (idx: number) => {
       if (!thirdRankingsConfirmed || !best8[idx]) return {...TBD_3};
       const tName = best8[idx];
       let gId = "";
       Object.entries(groupSelections).forEach(([k,v]) => {
           const unselected = GROUPS_DATA.find(g => g.id === k)!.teams.filter(t => !v.selected.includes(t.n));
           if (unselected[0]?.n === tName) gId = k;
       });
       if (!gId) return {...TBD_3};
       const g = GROUPS_DATA.find(x => x.id === gId)!;
       const t = g.teams.find(x => x.n === tName)!;
       return { n: t.n, f: t.f, seed: `3rd`, groupId: gId };
    };

    return [
      M1, M2, M3, M4, M5, M6, M7, M8, 
      M9, M10, M11, M12, 
      [getThird(0), getThird(1)], [getThird(2), getThird(3)], [getThird(4), getThird(5)], [getThird(6), getThird(7)]
    ];
  }, [groupSelections, thirdRankings, thirdRankingsConfirmed, groupsAllConfirmed]);

  const toggleGroupTeam = (groupId: string, teamName: string) => {
    if (groupSelections[groupId].confirmed) return;
    setGroupSelections(prev => {
      const sel = prev[groupId].selected;
      if (sel.includes(teamName)) {
        return { ...prev, [groupId]: { ...prev[groupId], selected: sel.filter(x => x !== teamName) } };
      }
      if (sel.length >= 2) return prev;
      return { ...prev, [groupId]: { ...prev[groupId], selected: [...sel, teamName] } };
    });
  };

  const confirmGroup = (groupId: string) => {
    setGroupSelections(prev => {
      const next = { ...prev, [groupId]: { ...prev[groupId], confirmed: true } };
      const count = Object.values(next).filter(g => g.confirmed).length;
      if (count === 12) {
        showToast("All groups confirmed! Proceed to Best 8.");
      } else {
        showToast(`✓ GROUP ${groupId} CONFIRMED`);
      }
      return next;
    });
  };

  const getTeamAt = useCallback((roundIdx: number, matchIdx: number, side: 0 | 1): Team => {
    if (roundIdx === 0) {
      const base = generatedR32Data[matchIdx][side];
      if (base.seed === '3rd') {
        const custom = customTeams[`r${roundIdx}-m${matchIdx}-s${side}`];
        if (custom) return { ...base, n: custom };
      }
      return base;
    }
    const prevRoundIdx = roundIdx - 1;
    const prevRound = rounds[prevRoundIdx];
    if (roundIdx >= 1 && roundIdx <= 3) {
      return prevRound[matchIdx * 2 + side] || EMPTY_TEAM;
    }
    if (roundIdx === 4) {
      return prevRound[side] || EMPTY_TEAM;
    }
    return EMPTY_TEAM;
  }, [rounds, generatedR32Data, customTeams]);

  const getWinnerAt = useCallback((roundIdx: number, matchIdx: number): Team | null => {
    if (roundIdx < 0 || roundIdx > 4) return null;
    return rounds[roundIdx][matchIdx];
  }, [rounds]);

  const clearDownstream = (newRounds: (Team | null)[][], startRound: number, startMatchIdx: number) => {
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
        break;
      }
    }
    if (currentRound === 4 && newRounds[4][0]) {
       newRounds[4][0] = null;
    }
  };

  const handlePick = (roundIdx: number, matchIdx: number, team: Team, teamA: Team, teamB: Team) => {
    if (teamA.n === "TBD" || teamB.n === "TBD" || teamA.seed === "3rd" || teamB.seed === "3rd") {
        if (team.n === "TBD" || team.seed === "3rd") return; // Let custom typed names work? Wait, if they type it, it's fine.
        if (teamA.seed === "3rd" && !customTeams[`r${roundIdx}-m${matchIdx}-s0`]) return;
        if (teamB.seed === "3rd" && !customTeams[`r${roundIdx}-m${matchIdx}-s1`]) return;
    }
    if (team.n === "TBD" || team.n === "3rd Place TBD") return;

    setRounds((prevRounds) => {
      const newRounds = prevRounds.map((r) => [...r]);
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
    setGroupSelections(() => {
        const init: Record<string, GroupSelection> = {};
        GROUPS_DATA.forEach(g => { init[g.id] = { selected: [], confirmed: false }; });
        return init;
    });
    setThirdRankings([]);
    setThirdRankingsConfirmed(false);
    setCustomTeams({});
    setActiveTab('groups');
    showToast("ALL PREDICTIONS RESET");
  };

  const counts = {
    r32: rounds[0].filter(Boolean).length,
    r16: rounds[1].filter(Boolean).length,
    qf: rounds[2].filter(Boolean).length,
    sf: rounds[3].filter(Boolean).length,
    final: rounds[4].filter(Boolean).length,
  };

  if (!hydrated) return null;

  // ─── RENDER HELPERS ────────────────────────────────────────────────────────

  const renderTeamCard = (team: Team, otherTeam: Team, isRightSide: boolean, roundIdx: number, matchIdx: number, side: 0|1, isFinal = false) => {
    const winner = getWinnerAt(roundIdx, matchIdx);
    const isWinner = winner?.n === team.n;
    const isLoser = winner && winner.n !== team.n;
    const isEmpty = team.n === "TBD" || team.n === "3rd Place TBD";
    const isAutoFilled = !!team.groupId;

    let stateClass = "default";
    if (isEmpty) stateClass = "empty";
    else if (isWinner) stateClass = "winner";
    else if (isLoser) stateClass = "loser";

    const badge = (
      <span className="advances-badge">
        {isFinal ? "★" : isRightSide ? "◀" : "▶"} {isFinal ? "" : "ADVANCES"}
      </span>
    );

    const isEditable3rd = team.seed === '3rd' && roundIdx === 0;

    const renderName = () => {
        if (isEditable3rd) {
            return (
                <input 
                    className="name-input" 
                    value={team.n === "3rd Place TBD" ? "" : team.n} 
                    placeholder="3rd Place TBD"
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setCustomTeams(p => ({...p, [`r${roundIdx}-m${matchIdx}-s${side}`]: e.target.value}))}
                />
            );
        }
        return (
            <span className="name" style={{ textAlign: isRightSide ? "right" : "left" }}>
                {team.n}
            </span>
        );
    };

    const seedEl = team.seed ? (
       <span className={`seed-badge seed-${team.seed.toLowerCase()}`} title={isAutoFilled ? "Auto-filled ✓" : ""}>
         {team.seed}
       </span>
    ) : <span className="seed">{team.seed}</span>;

    const leftContent = isRightSide ? (
      <>
        {badge}
        {seedEl}
        {renderName()}
        <span className="flag">{team.f}</span>
      </>
    ) : (
      <>
        <span className="flag">{team.f}</span>
        {renderName()}
        {seedEl}
        {badge}
      </>
    );

    return (
      <div
        className={`team-card ${isRightSide ? "right-side" : "left-side"} ${stateClass} ${isFinal ? 'final-row' : ''}`}
        onClick={() => handlePick(roundIdx, matchIdx, team, team, otherTeam)}
        title={isAutoFilled ? "Auto-filled ✓" : ""}
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
        {renderTeamCard(teamA, teamB, isRightSide, roundIdx, matchIdx, 0)}
        <div className="divider-line"></div>
        {renderTeamCard(teamB, teamA, isRightSide, roundIdx, matchIdx, 1)}
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
                   {renderTeamCard(finalistA, finalistB, false, 4, 0, 0, true)}
                   <div className="divider-line"></div>
                   {renderTeamCard(finalistB, finalistA, false, 4, 0, 1, true)}
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
          <span className="sub-label">World Cup 2026 Predictor</span>
        </div>
        
        <div className="nav-center">
          <div 
            className={`round-pill ${activeTab === 'groups' ? "active" : ""}`}
            onClick={() => setActiveTab('groups')}
            style={{ cursor: 'pointer' }}
          >
            Group Stage {groupsAllConfirmed ? '✓' : `(${confirmedGroupCount}/12)`}
          </div>
          <div 
            className={`round-pill ${activeTab === 'best8' ? "active" : ""} ${!groupsAllConfirmed ? "disabled" : ""}`}
            onClick={() => { if (groupsAllConfirmed) setActiveTab('best8'); }}
            style={{ cursor: groupsAllConfirmed ? 'pointer' : 'not-allowed', opacity: groupsAllConfirmed ? 1 : 0.4 }}
          >
            Best 8 {thirdRankingsConfirmed ? '✓' : (groupsAllConfirmed ? '(Pending)' : '(Locked)')}
          </div>
          <div 
            className={`round-pill ${activeTab === 'bracket' && counts.r32 === 16 ? "active" : ""}`}
            onClick={() => { if (thirdRankingsConfirmed) setActiveTab('bracket'); }}
            style={{ cursor: thirdRankingsConfirmed ? 'pointer' : 'not-allowed', opacity: thirdRankingsConfirmed ? 1 : 0.4 }}
          >
            Round of 32 {thirdRankingsConfirmed ? '' : '(Locked)'}
          </div>
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

      {activeTab === 'groups' && (
        <div className="gs-grid">
          {GROUPS_DATA.map(group => {
            const sel = groupSelections[group.id];
            return (
              <div key={group.id} className="gc-card">
                <div className="gc-header">
                  <div className="gc-letter">{group.id}</div>
                  {sel.confirmed && <div className="gc-badge">✓ DONE</div>}
                </div>
                <div className="gc-body" style={{ position: 'relative', height: 160 }}>
                  {group.teams.map((t) => {
                    const isSelected = sel.selected.includes(t.n);
                    const selIndex = sel.selected.indexOf(t.n);
                    const unselected = group.teams.filter(x => !sel.selected.includes(x.n));
                    const unselIndex = unselected.findIndex(x => x.n === t.n);
                    
                    let displayPos = 0;
                    if (isSelected) {
                      displayPos = selIndex;
                    } else {
                      displayPos = sel.selected.length + unselIndex;
                    }

                    return (
                      <div 
                        key={t.n} 
                        className={`gc-row ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleGroupTeam(group.id, t.n)}
                        style={{ 
                           position: 'absolute', 
                           top: displayPos * 40, 
                           left: 0, 
                           right: 0, 
                           height: 40, 
                           transition: 'top 0.3s ease, opacity 0.3s ease, background 0.2s',
                           opacity: (!isSelected && sel.selected.length === 2) ? 0.4 : 1,
                           pointerEvents: sel.confirmed ? 'none' : 'auto'
                        }}
                      >
                        <div className="gc-pos">{displayPos + 1}</div>
                        <div className="gc-flag">{t.f}</div>
                        <div className="gc-name">{t.n}</div>
                        {isSelected && (
                          <div className={`gc-sel-badge ${selIndex === 0 ? 'badge-1st' : 'badge-2nd'}`}>
                            {selIndex === 0 ? '1st' : '2nd'}
                          </div>
                        )}
                        {!isSelected && sel.selected.length === 2 && (
                          <div className={`gc-sel-badge ${displayPos === 2 ? 'badge-3rd' : 'badge-4th'}`}>
                            {displayPos === 2 ? '3rd' : '4th'}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="gc-btn-wrap">
                  <button 
                    className="gc-btn" 
                    disabled={sel.selected.length !== 2 || sel.confirmed}
                    onClick={() => confirmGroup(group.id)}
                  >
                    {sel.confirmed ? `Group ${group.id} Confirmed` : `Confirm Group ${group.id}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'best8' && (
        <div className="rankings-panel">
          <div className="rankings-header">Best 8 Qualifiers</div>
          <p style={{textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', marginBottom: '16px'}}>
            Drag to rank the 12 third-place finishers. The top 8 will advance to the Round of 32.
          </p>
          <div className="rankings-list">
            {thirdRankings.map((tName, idx) => {
              let flag = "", gId = "";
              Object.entries(groupSelections).forEach(([k,v]) => {
                const unselected = GROUPS_DATA.find(g => g.id === k)!.teams.filter(t => !v.selected.includes(t.n));
                if (unselected[0]?.n === tName) gId = k;
              });
              const grp = GROUPS_DATA.find(g => g.id === gId);
              if (grp) { const tm = grp.teams.find(x => x.n === tName); if(tm) flag = tm.f; }

              return (
                <React.Fragment key={tName}>
                  <div 
                    className={`ranking-row ${idx >= 8 ? 'eliminated' : ''}`}
                    draggable={!thirdRankingsConfirmed}
                    onDragStart={(e) => { setDraggedItem(idx); e.dataTransfer.effectAllowed = 'move'; }}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnter={(e) => {
                       e.preventDefault();
                       if (draggedItem === null || draggedItem === idx) return;
                       setThirdRankings(prev => {
                          const next = [...prev];
                          const item = next.splice(draggedItem, 1)[0];
                          next.splice(idx, 0, item);
                          return next;
                       });
                       setDraggedItem(idx);
                    }}
                    onDragEnd={() => setDraggedItem(null)}
                    style={{ cursor: thirdRankingsConfirmed ? 'default' : 'grab' }}
                  >
                    {!thirdRankingsConfirmed && <div className="ranking-drag">≡</div>}
                    <div className={`ranking-num ${idx < 8 ? 'top8' : ''}`} style={{marginLeft: 10}}>{idx + 1}.</div>
                    <div className="gc-flag" style={{marginLeft: 10}}>{flag}</div>
                    <div className="gc-name">{tName} <span style={{color:'var(--text-muted)'}}>(Group {gId})</span></div>
                    
                    <div className="ranking-controls">
                      {idx < 8 ? (
                         <span style={{fontSize: '9px', color: 'var(--gold)', border: '1px solid var(--gold)', padding: '2px 6px', borderRadius: 2, textTransform: 'uppercase'}}>Advances</span>
                      ) : (
                         <span style={{fontSize: '9px', color: '#ff6b6b', border: '1px solid #ff6b6b', padding: '2px 6px', borderRadius: 2, textTransform: 'uppercase'}}>Eliminated</span>
                      )}
                    </div>
                  </div>
                  {idx === 7 && <div className="ranking-divider">--- QUALIFICATION LINE ---</div>}
                </React.Fragment>
              );
            })}
          </div>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            {!thirdRankingsConfirmed ? (
              <button 
                className="gc-btn" 
                style={{marginTop: 20, maxWidth: 300, padding: 12}} 
                onClick={() => {
                   setThirdRankingsConfirmed(true);
                   showToast("Best 8 Confirmed! R32 Bracket Filled!");
                   setActiveTab('bracket');
                }}
              >
                Confirm Best 8
              </button>
            ) : (
              <button 
                className="gc-btn" 
                style={{marginTop: 20, maxWidth: 300, background: 'var(--black-border)', color: 'var(--text-muted)'}} 
                onClick={() => setThirdRankingsConfirmed(false)}
              >
                Edit Rankings
              </button>
            )}
          </div>
        </div>
      )}

      {activeTab === 'bracket' && (
        <>
          {/* 2. INSTRUCTION STRIP */}
          <div className="instruction-strip">
            {!thirdRankingsConfirmed ? (
              <span>Complete the <a style={{color:'var(--gold)', cursor:'pointer'}} onClick={() => setActiveTab('best8')}>Best 8</a> ranking to auto-fill teams into the bracket.</span>
            ) : (
              <span>Click a team to pick the <span className="highlight">WINNER</span> — bracket auto-advances round by round. <span className="from-gs-badge">From Group Stage ✓</span></span>
            )}
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
        </>
      )}

      {/* 4. RESET STRIP */}
      <div className="reset-strip">
        <button className="reset-button" onClick={resetBracket}>
          ↺ Reset All Predictions
        </button>
      </div>

      {/* TOAST */}
      <div className={`toast-notification ${toast.visible ? "visible" : ""}`}>
        {toast.msg}
      </div>
    </div>
  );
}
