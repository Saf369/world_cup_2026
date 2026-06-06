"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import "./visual-bracket.css";

import { Team, GroupData, GroupSelection } from './types';
import { GROUPS_DATA, EMPTY_TEAM, TBD_3, INITIAL_ROUNDS, LS_KEY } from './constants';
import PdfCapture from './PdfCapture';
import { ChampionConfirmDialog, ChampionCard } from './ChampionModals';

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
  const [championConfirmDialog, setChampionConfirmDialog] = useState<Team | null>(null);
  const [confirmedChampion, setConfirmedChampion] = useState<Team | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [predictionDate, setPredictionDate] = useState<string>("");
  const [showChampionCard, setShowChampionCard] = useState<boolean>(false);

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
        if (parsed.confirmedChampion) setConfirmedChampion(parsed.confirmedChampion);
        if (parsed.userName) setUserName(parsed.userName);
        if (parsed.predictionDate) setPredictionDate(parsed.predictionDate);
      }
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(LS_KEY, JSON.stringify({ groupSelections, rounds, customTeams, thirdRankings, thirdRankingsConfirmed, confirmedChampion, userName, predictionDate }));
  }, [groupSelections, rounds, customTeams, thirdRankings, thirdRankingsConfirmed, confirmedChampion, userName, predictionDate, hydrated]);

  // ─── LOGIC ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!document.getElementById("jspdf-script")) {
      const script = document.createElement("script");
      script.id = "jspdf-script";
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      document.body.appendChild(script);
    }
  }, []);

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
        return groupSelections[g.id].selected[2];
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
           if (v.selected[2] === tName) gId = k;
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
      if (sel.length >= 3) return prev;
      return { ...prev, [groupId]: { ...prev[groupId], selected: [...sel, teamName] } };
    });
  };

  const confirmGroup = (groupId: string) => {
    setGroupSelections(prev => {
      const next = { ...prev, [groupId]: { ...prev[groupId], confirmed: true } };
      return next;
    });

    const currentCount = Object.values(groupSelections).filter(g => g.confirmed).length;
    if (currentCount + 1 === 12) {
        showToast("All groups confirmed! Proceed to Best 8.");
        setTimeout(() => setActiveTab('best8'), 600);
    } else {
        showToast(`✓ GROUP ${groupId} CONFIRMED`);
        const nextUnconfirmed = GROUPS_DATA.find(g => g.id !== groupId && !groupSelections[g.id].confirmed);
        if (nextUnconfirmed) {
            setTimeout(() => {
                document.getElementById(`group-${nextUnconfirmed.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }
  };

  const confirmAllGroups = () => {
    setGroupSelections(prev => {
      const next = { ...prev };
      GROUPS_DATA.forEach(g => {
        const currentSel = next[g.id].selected;
        if (currentSel.length < 3) {
            const unselected = g.teams.filter(t => !currentSel.includes(t.n));
            const needed = 3 - currentSel.length;
            const newSelections = [...currentSel, ...unselected.slice(0, needed).map(t => t.n)];
            next[g.id] = { selected: newSelections, confirmed: true };
        } else {
            next[g.id] = { ...next[g.id], confirmed: true };
        }
      });
      return next;
    });
    showToast("All groups auto-filled and confirmed! Proceed to Best 8.");
    setTimeout(() => setActiveTab('best8'), 600);
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
    if (teamA.n === "TBD" || teamB.n === "TBD" || teamA.n === "3rd Place TBD" || teamB.n === "3rd Place TBD") return;
    if (team.n === "TBD" || team.n === "3rd Place TBD") return;

    if (roundIdx === 4 && rounds[4][0]?.n !== team.n) {
        setChampionConfirmDialog(team);
        return;
    }

    setRounds((prevRounds) => {
      const newRounds = prevRounds.map((r) => [...r]);
      if (newRounds[roundIdx][matchIdx]?.n !== team.n) {
        newRounds[roundIdx][matchIdx] = team;
        clearDownstream(newRounds, roundIdx, matchIdx);
        showToast(`${team.f} ${team.n} ADVANCES`);
      }
      return newRounds;
    });
  };

  const confirmChampion = () => {
    if (!championConfirmDialog) return;
    const team = championConfirmDialog;
    
    setRounds((prevRounds) => {
      const newRounds = prevRounds.map((r) => [...r]);
      newRounds[4][0] = team;
      return newRounds;
    });
    
    setConfirmedChampion(team);
    setChampionConfirmDialog(null);
    const dateStr = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    setPredictionDate(dateStr);
    setShowChampionCard(true);
    showToast(`🏆 ${team.n} — YOUR 2026 CHAMPION!`);
  };

  const generatePDF = async () => {
    if (typeof window === 'undefined') return;
    
    let html2canvasObj = (window as any).html2canvas;
    if (!html2canvasObj) {
        showToast("PDF generator loading, please wait...");
        try {
            await new Promise((resolve, reject) => {
                const script = document.createElement("script");
                script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
                script.onload = () => resolve((window as any).html2canvas);
                script.onerror = () => reject();
                document.head.appendChild(script);
            });
            html2canvasObj = (window as any).html2canvas;
        } catch (e) {
            showToast("Failed to load PDF generator.");
            return;
        }
    }

    if (!(window as any).jspdf) return;
    const { jsPDF } = (window as any).jspdf;
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    
    const setBg = () => doc.setFillColor(6, 8, 16);
    const setGoldText = () => doc.setTextColor(201, 168, 76);
    const setWhiteText = () => doc.setTextColor(240, 232, 208);
    const setMutedGoldText = () => doc.setTextColor(154, 136, 96);
    const setDarkGoldText = () => doc.setTextColor(74, 68, 48);
    
    // --- PAGE 1: COVER ---
    setBg(); doc.rect(0, 0, 297, 210, 'F');
    doc.setFont("helvetica", "bold"); doc.setFontSize(28); setGoldText();
    doc.text("MUNDIAL 2026", 148.5, 40, { align: "center" });
    doc.setFont("helvetica", "normal"); doc.setFontSize(11); setMutedGoldText();
    doc.text("FIFA WORLD CUP PREDICTION", 148.5, 50, { align: "center" });
    
    doc.setDrawColor(122, 98, 48); doc.setLineWidth(0.35);
    doc.line(12, 65, 285, 65);
    
    try {
        const flagEl = document.getElementById('pdf-champion-flag');
        if (flagEl && html2canvasObj && confirmedChampion?.f) {
            const canvas = await html2canvasObj(flagEl, { backgroundColor: null, scale: 2, logging: false });
            const imgData = canvas.toDataURL('image/png');
            doc.addImage(imgData, 'PNG', 133.5, 75, 30, 30);
        } else {
            doc.setFillColor(201, 168, 76);
            doc.circle(148.5, 85, 5, 'F'); doc.circle(143.5, 95, 5, 'F'); doc.circle(153.5, 95, 5, 'F');
        }
    } catch (e) {
        doc.setFillColor(201, 168, 76);
        doc.circle(148.5, 85, 5, 'F'); doc.circle(143.5, 95, 5, 'F'); doc.circle(153.5, 95, 5, 'F');
    }
    
    doc.setFont("helvetica", "bold"); doc.setFontSize(36); setGoldText();
    doc.text(confirmedChampion?.n || "Unknown", 148.5, 120, { align: "center" });
    
    doc.setFont("helvetica", "normal"); doc.setFontSize(10); setMutedGoldText();
    doc.text(`Predicted by: ${userName || 'My Prediction'}`, 148.5, 140, { align: "center" });
    doc.text(`Date: ${predictionDate}`, 148.5, 150, { align: "center" });
    doc.setFontSize(9); setDarkGoldText();
    doc.text("FIFA World Cup 2026 · USA · Canada · Mexico", 148.5, 170, { align: "center" });
    
    doc.setDrawColor(122, 98, 48); doc.line(12, 195, 285, 195);
    doc.setFontSize(7);
    doc.text("Generated by MUNDIAL Predictor", 148.5, 200, { align: "center" });

    // --- PAGE 2: FULL BRACKET CAPTURE ---
    try {
        const captureEl = document.getElementById('pdf-bracket-capture');
        if (captureEl && html2canvasObj) {
            const canvas = await html2canvasObj(captureEl, { 
                scale: 2, 
                backgroundColor: '#060810',
                logging: false
            });
            const imgData = canvas.toDataURL('image/png');
            doc.addPage("a4", "landscape");
            doc.addImage(imgData, 'PNG', 0, 0, 297, 210);
        }
    } catch (err) {
        console.error("html2canvas failed", err);
    }

    // --- PAGE 4: GROUP STAGE SUMMARY ---
    doc.addPage("a4", "portrait");
    setBg(); doc.rect(0, 0, 210, 297, 'F');
    doc.setFont("helvetica", "bold"); doc.setFontSize(16); setGoldText();
    doc.text("GROUP STAGE RESULTS", 105, 20, { align: "center" });
    doc.setFont("helvetica", "normal"); doc.setFontSize(9); setMutedGoldText();
    doc.text("12 Groups · 48 Teams · 32 Qualified", 105, 26, { align: "center" });
    
    let gy = 40;
    GROUPS_DATA.forEach((g, i) => {
        const col = i % 3; const row = Math.floor(i / 3);
        const gx = 20 + col * 60; const currentY = gy + row * 55;
        
        doc.setFont("helvetica", "bold"); doc.setFontSize(14); setGoldText();
        doc.text(`Group ${g.id}`, gx, currentY);
        doc.setDrawColor(201, 168, 76); doc.setLineWidth(0.2);
        doc.line(gx, currentY + 2, gx + 45, currentY + 2);
        
        const sel = groupSelections[g.id];
        const t1 = sel.selected[0]; const t2 = sel.selected[1]; const t3 = sel.selected[2];
        const unselected = g.teams.filter(t => !sel.selected.includes(t.n))[0]?.n;
        const sorted = [t1, t2, t3, unselected];
        
        sorted.forEach((tName, idx) => {
            const ty = currentY + 12 + idx * 9;
            const isQ = idx < 2; const is3rdQ = idx === 2 && thirdRankings.slice(0, 8).includes(tName);
            
            if (isQ || is3rdQ) {
                doc.setFillColor(201, 168, 76); doc.rect(gx, ty - 2.5, 2, 2, 'F');
            }
            doc.setFontSize(8); 
            doc.setTextColor(isQ || is3rdQ ? 240 : 74, isQ || is3rdQ ? 232 : 68, isQ || is3rdQ ? 208 : 48);
            doc.text(`${idx + 1}`, gx + 4, ty);
            
            doc.setFillColor(30, 34, 53); doc.rect(gx + 8, ty - 3.5, 6, 4, 'F');
            doc.setFont("helvetica", "bold"); doc.setFontSize(5); setGoldText();
            doc.text(tName ? tName.substring(0,3).toUpperCase() : "", gx + 11, ty - 0.5, {align: 'center'});
            
            doc.setFontSize(8);
            doc.setTextColor(isQ || is3rdQ ? 240 : 74, isQ || is3rdQ ? 232 : 68, isQ || is3rdQ ? 208 : 48);
            let trunc = tName || "TBD"; if (trunc.length > 12) trunc = trunc.substring(0, 12) + ".";
            doc.text(trunc, gx + 16, ty);
            
            if (is3rdQ) { doc.setFontSize(6); setGoldText(); doc.text("3RD", gx + 40, ty); }
        });
    });

    doc.setFont("helvetica", "bold"); doc.setFontSize(10); setGoldText();
    doc.text("BEST 8 ADVANCING 3RD PLACE TEAMS", 105, 262, { align: "center" });
    doc.setDrawColor(201, 168, 76); doc.setLineWidth(0.2);
    doc.line(75, 264, 135, 264);
    
    doc.setFont("helvetica", "normal"); doc.setFontSize(8); setWhiteText();
    const row1 = thirdRankings.slice(0, 4).join("   ·   ");
    const row2 = thirdRankings.slice(4, 8).join("   ·   ");
    doc.text(row1, 105, 270, { align: "center" });
    doc.text(row2, 105, 276, { align: "center" });

    doc.setDrawColor(122, 98, 48); doc.line(12, 285, 198, 285);
    doc.setFontSize(7); setDarkGoldText();
    doc.text("Generated by MUNDIAL Predictor", 105, 290, { align: "center" });

    const abbr = confirmedChampion?.n ? confirmedChampion.n.substring(0,3).toUpperCase() : "TBD";
    const dateStrSafe = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '');
    doc.save(`MUNDIAL-2026-${abbr}-${dateStrSafe}.pdf`);
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

    const leftContent = isRightSide ? (
      <>
        {badge}
        {renderName()}
        <span className="flag">{team.f}</span>
      </>
    ) : (
      <>
        <span className="flag">{team.f}</span>
        {renderName()}
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

  const renderCaptureMatch = (teamA: Team | null, teamB: Team | null, winner: Team | null) => {
    const renderTeam = (team: Team | null) => {
       const isWin = team && winner && team.n === winner.n && team.n !== "TBD" && team.n !== "3rd Place TBD";
       return (
          <div style={{
              height: 28, backgroundColor: isWin ? '#12100a' : '#0C0E18',
              borderLeft: `3px solid ${isWin ? '#C9A84C' : 'transparent'}`,
              display: 'flex', alignItems: 'center', gap: 6, padding: '0 6px',
              borderBottom: '1px solid #1E2235'
          }}>
             {team && team.n !== "TBD" && team.n !== "3rd Place TBD" ? (
                <>
                   <div style={{fontSize: 14}}>{team.f}</div>
                   <div style={{fontFamily: 'Bebas Neue', fontSize: 11, color: '#F0E8D0', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                      {team.n}
                   </div>
                   <div style={{fontFamily: 'Bebas Neue', fontSize: 13, color: '#C9A84C', width: 16, textAlign: 'right'}}></div>
                </>
             ) : (
                <div style={{fontFamily: 'Bebas Neue', fontSize: 11, color: '#4A4430'}}>TBD</div>
             )}
          </div>
       );
    };

    return (
       <div style={{display: 'flex', flexDirection: 'column', border: '1px solid #1E2235', borderRadius: 2, overflow: 'hidden'}}>
           {renderTeam(teamA)}
           {renderTeam(teamB)}
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

        <div className="nav-right" style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
          {confirmedChampion && (
            <div 
              className="my-bracket-badge" 
              style={{ cursor: 'pointer', background: 'rgba(201,168,76,0.1)', color: 'var(--gold)', border: '1px solid var(--gold-dim)' }}
              onClick={() => setShowChampionCard(true)}
            >
              🏆 View My Prediction
            </div>
          )}
          <Link href="/" className="my-bracket-badge" style={{ textDecoration: 'none', display: 'inline-block', cursor: 'pointer' }}>
            ← BACK TO HOME
          </Link>
        </div>
      </div>

      {activeTab === 'groups' && (
        <>
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <button 
              className="gc-btn" 
              style={{ width: 'auto', padding: '12px 32px', display: 'inline-flex', fontSize: '12px', gap: '8px' }}
              onClick={confirmAllGroups}
            >
              ⚡ AUTO-FILL & CONFIRM ALL GROUPS
            </button>
          </div>
          <div className="gs-grid">
            {GROUPS_DATA.map(group => {
            const sel = groupSelections[group.id];
            return (
              <div key={group.id} id={`group-${group.id}`} className="gc-card">
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
                           opacity: (!isSelected && sel.selected.length === 3) ? 0.4 : 1,
                           pointerEvents: sel.confirmed ? 'none' : 'auto'
                        }}
                      >
                        <div className="gc-pos">{displayPos + 1}</div>
                        <div className="gc-flag">{t.f}</div>
                        <div className="gc-name">{t.n}</div>
                        {isSelected && (
                          <div className={`gc-sel-badge ${selIndex === 0 ? 'badge-1st' : selIndex === 1 ? 'badge-2nd' : 'badge-3rd'}`}>
                            {selIndex === 0 ? '1st' : selIndex === 1 ? '2nd' : '3rd'}
                          </div>
                        )}
                        {!isSelected && sel.selected.length === 3 && (
                          <div className={`gc-sel-badge badge-4th`}>
                            4th
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="gc-btn-wrap">
                  <button 
                    className="gc-btn" 
                    disabled={sel.selected.length !== 3 || sel.confirmed}
                    onClick={() => confirmGroup(group.id)}
                  >
                    {sel.confirmed ? `Group ${group.id} Confirmed` : `Confirm Group ${group.id}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        </>
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
                if (v.selected[2] === tName) gId = k;
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

      {/* CONFIRMATION DIALOG */}
      {championConfirmDialog && (
        <div className="modal-overlay" onClick={() => setChampionConfirmDialog(null)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cm-header">
              <div className="cm-sup">MUNDIAL 2026</div>
              <div className="cm-sub">FINAL PREDICTION</div>
              <div className="cm-divider"></div>
            </div>
            
            <div className="cm-team">
              <div className="cm-flag">{championConfirmDialog.f}</div>
              <div className="cm-name">{championConfirmDialog.n}</div>
              <div className="cm-pill">YOUR PREDICTED CHAMPION</div>
            </div>
            
            <div className="cm-question">
              <div className="cm-q-title">Are you sure?</div>
              <div className="cm-q-desc">This will lock your bracket and generate your champion card.</div>
            </div>
            
            <div className="cm-actions">
              <button className="cm-btn cm-btn-back" onClick={() => setChampionConfirmDialog(null)}>GO BACK</button>
              <button className="cm-btn cm-btn-confirm" onClick={confirmChampion}>CONFIRM CHAMPION</button>
            </div>
          </div>
        </div>
      )}

      {/* CHAMPION CARD */}
      {showChampionCard && confirmedChampion && (
        <div className="champion-overlay">
          <div className="confetti-container">
            {Array.from({ length: 50 }).map((_, i) => (
               <div key={i} className="confetti" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 3}s` }}></div>
            ))}
          </div>
          <button className="close-champion" onClick={() => setShowChampionCard(false)}>✕ Close</button>
          
          <div className="champion-card">
             <div className="champ-card-glow"></div>
             <div className="champ-card-shimmer"></div>
             <div className="corner-flourish tl"></div>
             <div className="corner-flourish tr"></div>
             <div className="corner-flourish bl"></div>
             <div className="corner-flourish br"></div>
             
             <div className="champ-header">🏆 WORLD CUP 2026 CHAMPION</div>
             <div className="champ-subtext">YOUR PREDICTION</div>
             <div className="champ-big-flag">{confirmedChampion.f}</div>
             <div className="champ-big-name">{confirmedChampion.n}</div>
             <div className="champ-divider"></div>
             
             <div className="champ-meta">
               <div style={{marginBottom: 10}}>
                 Predicted by: <input className="name-input" style={{textAlign: 'center', display: 'inline', width: '120px', background: 'rgba(0,0,0,0.5)', padding: '2px 8px'}} value={userName} onChange={e => setUserName(e.target.value)} placeholder="My Prediction" />
               </div>
               <div>Date predicted: {predictionDate}</div>
               <div>FIFA World Cup 2026 · USA · Canada · Mexico</div>
             </div>

             <div className="champ-share-section">
               <div className="share-label">SHARE YOUR PREDICTION</div>
               <div className="share-buttons">
                 <button onClick={generatePDF}>📄 Download PDF</button>
                 <button onClick={() => window.open(`whatsapp://send?text=My FIFA World Cup 2026 Champion is ${confirmedChampion.n}! Predict yours at MUNDIAL.`)}>💬 WhatsApp</button>
                 <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=My FIFA World Cup 2026 Champion is ${confirmedChampion.n}! Predict yours at MUNDIAL.`)}>𝕏 Twitter</button>
                 <button onClick={() => { navigator.clipboard.writeText(`My FIFA World Cup 2026 Champion is ${confirmedChampion.n}! Predict yours at MUNDIAL.`); showToast("Link copied!"); }}>🔗 Copy Link</button>
               </div>
             </div>
          </div>
        </div>
      )}

      {/* HIDDEN FLAG CAPTURE FOR PDF COVER */}
      <div id="pdf-champion-flag" style={{
         position: 'fixed', left: -9999, top: -9999, fontSize: '64px',
         width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
         {confirmedChampion?.f}
      </div>

      {/* HIDDEN PDF CAPTURE DIV */}
      <div id="pdf-bracket-capture" style={{
         position: 'fixed', left: -9999, top: -9999, width: 1782, height: 1260,
         backgroundColor: '#060810', color: '#C9A84C', padding: '50px 60px',
         boxSizing: 'border-box', display: 'flex', flexDirection: 'column'
      }}>
         <div style={{textAlign: 'center', marginBottom: 20}}>
            <div style={{fontFamily: 'Bebas Neue', fontSize: 20, color: '#C9A84C'}}>MUNDIAL 2026 — FULL BRACKET PREDICTION</div>
            <div style={{fontFamily: 'Montserrat', fontSize: 9, color: '#4A4430'}}>FIFA World Cup 2026 · USA · Canada · Mexico</div>
            <div style={{height: 1, backgroundColor: '#7A6230', marginTop: 10, opacity: 0.5}}></div>
         </div>
         
         <div style={{display: 'flex', flex: 1, justifyContent: 'space-between', alignItems: 'stretch'}}>
            {/* HALF 1 */}
            <div style={{display: 'flex', flex: 1, justifyContent: 'space-between'}}>
               {[8, 4, 2, 1].map((numMatches, roundIdx) => (
                  <React.Fragment key={`h1-${roundIdx}`}>
                  <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-around', width: 110, position: 'relative'}}>
                     <div style={{position: 'absolute', top: -20, width: '100%', textAlign: 'center', fontFamily: 'Montserrat', fontSize: 7, color: '#4A4430', letterSpacing: 2, textTransform: 'uppercase'}}>
                        {roundIdx === 0 ? "ROUND OF 32" : roundIdx === 1 ? "ROUND OF 16" : roundIdx === 2 ? "QUARTER-FINAL" : "SEMI-FINAL"}
                     </div>
                     {Array.from({length: numMatches}).map((_, matchInRound) => {
                        const globalMatchIdx = matchInRound;
                        const teamA = getTeamAt(roundIdx, globalMatchIdx, 0);
                        const teamB = getTeamAt(roundIdx, globalMatchIdx, 1);
                        const winner = getWinnerAt(roundIdx, globalMatchIdx);
                        return <React.Fragment key={matchInRound}>{renderCaptureMatch(teamA, teamB, winner)}</React.Fragment>;
                     })}
                  </div>
                  {/* Connectors Half 1 */}
                  {roundIdx < 3 && (
                      <div style={{display: 'flex', flexDirection: 'column', width: 20}}>
                         {Array.from({length: numMatches / 2}).map((_, i) => (
                            <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                                <div style={{ width: '100%', height: '50%', borderTop: '1px solid #7A6230', borderRight: '1px solid #7A6230', borderBottom: '1px solid #7A6230' }}></div>
                            </div>
                         ))}
                      </div>
                  )}
                  </React.Fragment>
               ))}
            </div>

            {/* FINAL BOX */}
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: 120, margin: '0 20px', position: 'relative'}}>
                {/* connector from sf to final */}
                <div style={{position: 'absolute', left: -20, width: 20, height: 1, backgroundColor: '#7A6230'}}></div>
                <div style={{position: 'absolute', right: -20, width: 20, height: 1, backgroundColor: '#7A6230'}}></div>
                
                <div style={{fontSize: 24, marginBottom: 10}}>🏆</div>
                <div style={{backgroundColor: '#0C0E18', border: '2px solid #C9A84C', borderTop: '4px solid #C9A84C', width: '100%', padding: 10, textAlign: 'center'}}>
                   <div style={{fontFamily: 'Bebas Neue', fontSize: 14, letterSpacing: 3, marginBottom: 10, color: '#C9A84C'}}>FINAL</div>
                   {renderCaptureMatch(getTeamAt(4, 0, 0), getTeamAt(4, 0, 1), getWinnerAt(4, 0))}
                   {getWinnerAt(4, 0)?.n && getWinnerAt(4, 0)?.n !== "TBD" && (
                       <div style={{marginTop: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8}}>
                           <span style={{fontSize: 20}}>{getWinnerAt(4, 0)?.f}</span>
                           <span style={{fontFamily: 'Bebas Neue', fontSize: 16, color: '#C9A84C'}}>* {getWinnerAt(4, 0)?.n} *</span>
                       </div>
                   )}
                </div>
            </div>

            {/* HALF 2 */}
            <div style={{display: 'flex', flex: 1, justifyContent: 'space-between', flexDirection: 'row-reverse'}}>
               {[8, 4, 2, 1].map((numMatches, roundIdx) => (
                  <React.Fragment key={`h2-${roundIdx}`}>
                  <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-around', width: 110, position: 'relative'}}>
                     <div style={{position: 'absolute', top: -20, width: '100%', textAlign: 'center', fontFamily: 'Montserrat', fontSize: 7, color: '#4A4430', letterSpacing: 2, textTransform: 'uppercase'}}>
                        {roundIdx === 0 ? "ROUND OF 32" : roundIdx === 1 ? "ROUND OF 16" : roundIdx === 2 ? "QUARTER-FINAL" : "SEMI-FINAL"}
                     </div>
                     {Array.from({length: numMatches}).map((_, matchInRound) => {
                        const globalMatchIdx = (numMatches === 8 ? 8 : numMatches === 4 ? 4 : numMatches === 2 ? 2 : 1) + matchInRound;
                        const teamA = getTeamAt(roundIdx, globalMatchIdx, 0);
                        const teamB = getTeamAt(roundIdx, globalMatchIdx, 1);
                        const winner = getWinnerAt(roundIdx, globalMatchIdx);
                        return <React.Fragment key={matchInRound}>{renderCaptureMatch(teamA, teamB, winner)}</React.Fragment>;
                     })}
                  </div>
                  {/* Connectors Half 2 */}
                  {roundIdx < 3 && (
                      <div style={{display: 'flex', flexDirection: 'column', width: 20}}>
                         {Array.from({length: numMatches / 2}).map((_, i) => (
                            <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                                <div style={{ width: '100%', height: '50%', borderTop: '1px solid #7A6230', borderLeft: '1px solid #7A6230', borderBottom: '1px solid #7A6230' }}></div>
                            </div>
                         ))}
                      </div>
                  )}
                  </React.Fragment>
               ))}
            </div>
         </div>

         {/* WATERMARK */}
         <div style={{position: 'absolute', bottom: 30, right: 40, fontFamily: 'Montserrat', fontSize: 16, color: '#9A8860'}}>
            Predicted by: {userName || 'My Prediction'} &nbsp;&nbsp;·&nbsp;&nbsp; Date: {predictionDate}
         </div>
      </div>
    </div>
  );
}
