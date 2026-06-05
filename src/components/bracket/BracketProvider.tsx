"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

// ─── TYPES ───────────────────────────────────────────────────────────────────

export interface BTeam {
  name: string;
  flag: string;
  rank: number;
}

export interface BGroup {
  label: string;
  teams: [BTeam, BTeam, BTeam, BTeam];
}

export type Confidence = "LOW" | "MED" | "HIGH" | null;

export interface MatchScore { home: number | ""; away: number | ""; }

export interface GroupState {
  matches: MatchScore[]; // 6 matches
  confirmed: boolean;
}

export interface KOPick { winner: string | null; }
export interface QFPick { winner: string | null; confidence: Confidence; }
export interface SFPick { winner: string | null; score: [number|"", number|""]; scorer: string; }
export interface FinalPick {
  score: [number|"", number|""];
  winner: string | null;
  confidence: Confidence;
  scorer: string;
}

export interface Predictions {
  groups: Record<string, GroupState>;
  r32: KOPick[];   // 16
  r16: KOPick[];   // 8
  qf:  QFPick[];   // 4
  sf:  SFPick[];   // 2
  final: FinalPick;
  completedStages: string[];
}

// ─── GROUP DATA ──────────────────────────────────────────────────────────────

export const ALL_GROUPS: BGroup[] = [
  { label: "A", teams: [
    { name: "Mexico",       flag: "🇲🇽", rank: 15 },
    { name: "South Korea",  flag: "🇰🇷", rank: 16 },
    { name: "South Africa", flag: "🇿🇦", rank: 33 },
    { name: "Czechia",      flag: "🇨🇿", rank: 37 },
  ]},
  { label: "B", teams: [
    { name: "Canada",       flag: "🇨🇦", rank: 11 },
    { name: "Switzerland",  flag: "🇨🇭", rank: 17 },
    { name: "Bosnia-Herz.", flag: "🇧🇦", rank: 38 },
    { name: "Qatar",        flag: "🇶🇦", rank: 39 },
  ]},
  { label: "C", teams: [
    { name: "Brazil",       flag: "🇧🇷", rank:  6 },
    { name: "Morocco",      flag: "🇲🇦", rank: 13 },
    { name: "Scotland",     flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", rank: 31 },
    { name: "Haiti",        flag: "🇭🇹", rank: 47 },
  ]},
  { label: "D", teams: [
    { name: "USA",          flag: "🇺🇸", rank: 11 },
    { name: "Australia",    flag: "🇦🇺", rank: 20 },
    { name: "Türkiye",      flag: "🇹🇷", rank: 23 },
    { name: "Paraguay",     flag: "🇵🇾", rank: 25 },
  ]},
  { label: "E", teams: [
    { name: "Germany",      flag: "🇩🇪", rank:  9 },
    { name: "Ecuador",      flag: "🇪🇨", rank: 22 },
    { name: "Ivory Coast",  flag: "🇨🇮", rank: 32 },
    { name: "Curaçao",      flag: "🇨🇼", rank: 46 },
  ]},
  { label: "F", teams: [
    { name: "Netherlands",  flag: "🇳🇱", rank:  7 },
    { name: "Japan",        flag: "🇯🇵", rank: 12 },
    { name: "Sweden",       flag: "🇸🇪", rank: 26 },
    { name: "Tunisia",      flag: "🇹🇳", rank: 27 },
  ]},
  { label: "G", teams: [
    { name: "Belgium",      flag: "🇧🇪", rank:  8 },
    { name: "Iran",         flag: "🇮🇷", rank: 28 },
    { name: "Egypt",        flag: "🇪🇬", rank: 29 },
    { name: "New Zealand",  flag: "🇳🇿", rank: 41 },
  ]},
  { label: "H", teams: [
    { name: "Spain",        flag: "🇪🇸", rank:  2 },
    { name: "Uruguay",      flag: "🇺🇾", rank: 10 },
    { name: "Saudi Arabia", flag: "🇸🇦", rank: 35 },
    { name: "Cape Verde",   flag: "🇨🇻", rank: 45 },
  ]},
  { label: "I", teams: [
    { name: "France",       flag: "🇫🇷", rank:  1 },
    { name: "Senegal",      flag: "🇸🇳", rank: 18 },
    { name: "Norway",       flag: "🇳🇴", rank: 21 },
    { name: "Iraq",         flag: "🇮🇶", rank: 40 },
  ]},
  { label: "J", teams: [
    { name: "Argentina",    flag: "🇦🇷", rank:  3 },
    { name: "Austria",      flag: "🇦🇹", rank: 19 },
    { name: "Algeria",      flag: "🇩🇿", rank: 30 },
    { name: "Jordan",       flag: "🇯🇴", rank: 36 },
  ]},
  { label: "K", teams: [
    { name: "Portugal",     flag: "🇵🇹", rank:  5 },
    { name: "Colombia",     flag: "🇨🇴", rank: 24 },
    { name: "DR Congo",     flag: "🇨🇩", rank: 42 },
    { name: "Uzbekistan",   flag: "🇺🇿", rank: 43 },
  ]},
  { label: "L", teams: [
    { name: "England",      flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", rank:  4 },
    { name: "Croatia",      flag: "🇭🇷", rank: 14 },
    { name: "Ghana",        flag: "🇬🇭", rank: 34 },
    { name: "Panama",       flag: "🇵🇦", rank: 44 },
  ]},
];

// Round-robin match pairings for 4 teams: [home idx, away idx]
export const MATCH_PAIRINGS: [number,number][] = [
  [0,1],[0,2],[0,3],[1,2],[1,3],[2,3]
];

// ─── STANDINGS ALGORITHM ─────────────────────────────────────────────────────

export interface Standing {
  team: BTeam;
  p: number; w: number; d: number; l: number;
  gf: number; ga: number; gd: number; pts: number;
  groupLabel: string;
  originalIdx: number;
}

export function computeStandings(group: BGroup, scores: MatchScore[]): Standing[] {
  const stats = group.teams.map(() => ({ w:0,d:0,l:0,gf:0,ga:0,pts:0 }));
  scores.forEach((s, i) => {
    const [hi, ai] = MATCH_PAIRINGS[i];
    const hg = typeof s.home === "number" ? s.home : 0;
    const ag = typeof s.away === "number" ? s.away : 0;
    stats[hi].gf += hg; stats[hi].ga += ag;
    stats[ai].gf += ag; stats[ai].ga += hg;
    if (hg > ag)      { stats[hi].w++; stats[hi].pts+=3; stats[ai].l++; }
    else if (hg < ag) { stats[ai].w++; stats[ai].pts+=3; stats[hi].l++; }
    else              { stats[hi].d++; stats[ai].d++; stats[hi].pts++; stats[ai].pts++; }
  });
  const rows: Standing[] = group.teams.map((t,i) => ({
    team: t,
    p: stats[i].w+stats[i].d+stats[i].l,
    w: stats[i].w, d: stats[i].d, l: stats[i].l,
    gf: stats[i].gf, ga: stats[i].ga,
    gd: stats[i].gf - stats[i].ga,
    pts: stats[i].pts,
    groupLabel: group.label,
    originalIdx: i,
  }));
  rows.sort((a,b) => b.pts-a.pts || b.gd-a.gd || b.gf-a.gf || a.team.rank-b.team.rank);
  return rows;
}

// ─── R32 BRACKET SEEDING (simplified FIFA-style) ─────────────────────────────
// Returns 16 match pairings as [teamA, teamB] using group standings
export function deriveR32(groupStandings: Record<string, Standing[]>): [Standing, Standing][] {
  const g = (label: string, pos: number) => groupStandings[label]?.[pos];
  // 12 1st-place, 12 2nd-place, take 8 best 3rd-place
  const thirds = ALL_GROUPS.map(gr => groupStandings[gr.label]?.[2]).filter(Boolean);
  thirds.sort((a,b) => b.pts-a.pts || b.gd-a.gd || b.gf-a.gf || a.team.rank-b.team.rank);
  const t = thirds.slice(0, 8);
  // Simple bracket: A1-B2, C1-D2, E1-F2, G1-H2, I1-J2, K1-L2
  //                 B1-A2, D1-C2, F1-E2, H1-G2, J1-I2, L1-K2
  //                 4 best-3rd matchups
  const matches: [Standing, Standing][] = [
    [g("A",0), g("B",1)], [g("C",0), g("D",1)],
    [g("E",0), g("F",1)], [g("G",0), g("H",1)],
    [g("I",0), g("J",1)], [g("K",0), g("L",1)],
    [g("B",0), g("A",1)], [g("D",0), g("C",1)],
    [g("F",0), g("E",1)], [g("H",0), g("G",1)],
    [g("J",0), g("I",1)], [g("L",0), g("K",1)],
    [t[0], t[1]], [t[2], t[3]], [t[4], t[5]], [t[6], t[7]],
  ];
  return matches.filter(m => m[0] && m[1]) as [Standing, Standing][];
}

// ─── INITIAL STATE ────────────────────────────────────────────────────────────

const makeGroupState = (): GroupState => ({
  matches: Array(6).fill(null).map(() => ({ home: "", away: "" })),
  confirmed: false,
});

const INITIAL: Predictions = {
  groups: Object.fromEntries(ALL_GROUPS.map(g => [g.label, makeGroupState()])),
  r32:   Array(16).fill(null).map(() => ({ winner: null })),
  r16:   Array(8).fill(null).map(() => ({ winner: null })),
  qf:    Array(4).fill(null).map(() => ({ winner: null, confidence: null })),
  sf:    Array(2).fill(null).map(() => ({ winner: null, score: ["",""], scorer: "" })),
  final: { score: ["",""], winner: null, confidence: null, scorer: "" },
  completedStages: [],
};

// ─── CONTEXT ─────────────────────────────────────────────────────────────────

interface BracketCtx {
  predictions: Predictions;
  activeStage: number;
  setActiveStage: (s: number) => void;
  updateGroupMatch: (group: string, matchIdx: number, side: "home"|"away", val: number|"") => void;
  confirmGroup: (group: string) => void;
  setR32Pick: (idx: number, winner: string) => void;
  confirmR32: () => void;
  setR16Pick: (idx: number, winner: string) => void;
  confirmR16: () => void;
  setQFPick: (idx: number, winner: string, confidence?: Confidence) => void;
  confirmQF: () => void;
  setSFPick: (idx: number, field: "winner"|"scorer"|"scoreH"|"scoreA", val: string|number|"") => void;
  confirmSF: () => void;
  setFinalField: (field: "winner"|"scorer"|"confidence"|"scoreH"|"scoreA", val: string|number|""|Confidence) => void;
  confirmFinal: () => void;
  resetAll: () => void;
  groupStandings: Record<string, Standing[]>;
  r32Teams: [Standing, Standing][];
  r16Teams: [string, string][];
  qfTeams: [string, string][];
  sfTeams: [string, string][];
  progressPct: number;
}

const BracketContext = createContext<BracketCtx | null>(null);

export function useBracket() {
  const ctx = useContext(BracketContext);
  if (!ctx) throw new Error("useBracket must be used within BracketProvider");
  return ctx;
}

// ─── PROVIDER ────────────────────────────────────────────────────────────────

const LS_KEY = "mundial_bracket_v2";

export function BracketProvider({ children }: { children: React.ReactNode }) {
  const [predictions, setPredictions] = useState<Predictions>(INITIAL);
  const [activeStage, setActiveStage] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  // Restore from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Predictions;
        setPredictions(parsed);
        // Restore active stage to last completed + 1
        const stageMap = ["groups","r32","r16","qf","sf","final"];
        const lastComplete = stageMap.reduce((acc, s, i) =>
          parsed.completedStages.includes(s) ? i : acc, -1);
        setActiveStage(Math.min(lastComplete + 1, 6));
      }
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(LS_KEY, JSON.stringify(predictions)); }
    catch { /* ignore */ }
  }, [predictions, hydrated]);

  // ─── DERIVED DATA ────────────────────────────────────────────────────────

  const groupStandings: Record<string, Standing[]> = {};
  ALL_GROUPS.forEach(g => {
    groupStandings[g.label] = computeStandings(g, predictions.groups[g.label].matches);
  });

  const allGroupsConfirmed = ALL_GROUPS.every(g => predictions.groups[g.label].confirmed);
  const r32Teams: [Standing, Standing][] = allGroupsConfirmed ? deriveR32(groupStandings) : [];

  // R16 teams come from R32 picks
  const r16Teams: [string, string][] = [];
  for (let i = 0; i < 8; i++) {
    const aWinner = predictions.r32[i * 2]?.winner ?? "";
    const bWinner = predictions.r32[i * 2 + 1]?.winner ?? "";
    r16Teams.push([aWinner, bWinner]);
  }

  // QF teams from R16 picks
  const qfTeams: [string, string][] = [];
  for (let i = 0; i < 4; i++) {
    qfTeams.push([
      predictions.r16[i * 2]?.winner ?? "",
      predictions.r16[i * 2 + 1]?.winner ?? "",
    ]);
  }

  // SF teams from QF picks
  const sfTeams: [string, string][] = [
    [predictions.qf[0]?.winner ?? "", predictions.qf[1]?.winner ?? ""],
    [predictions.qf[2]?.winner ?? "", predictions.qf[3]?.winner ?? ""],
  ];

  // Progress
  const STAGE_WEIGHTS = [40, 10, 10, 15, 10, 10, 5];
  const stageKeys   = ["groups","r32","r16","qf","sf","final","champion"];
  const progressPct = stageKeys.reduce((acc, key, i) =>
    predictions.completedStages.includes(key) ? acc + STAGE_WEIGHTS[i] : acc, 0);

  // ─── MUTATORS ────────────────────────────────────────────────────────────

  const updateGroupMatch = useCallback((group: string, matchIdx: number, side: "home"|"away", val: number|"") => {
    setPredictions(p => ({
      ...p,
      groups: {
        ...p.groups,
        [group]: {
          ...p.groups[group],
          matches: p.groups[group].matches.map((m,i) =>
            i === matchIdx ? { ...m, [side]: val } : m
          ),
        },
      },
    }));
  }, []);

  const confirmGroup = useCallback((group: string) => {
    setPredictions(p => {
      const newGroups = { ...p.groups, [group]: { ...p.groups[group], confirmed: true } };
      const allDone = ALL_GROUPS.every(g => newGroups[g.label].confirmed);
      return {
        ...p,
        groups: newGroups,
        completedStages: allDone && !p.completedStages.includes("groups")
          ? [...p.completedStages, "groups"]
          : p.completedStages,
      };
    });
  }, []);

  const setR32Pick = useCallback((idx: number, winner: string) => {
    setPredictions(p => ({
      ...p,
      r32: p.r32.map((m,i) => i===idx ? { winner } : m),
    }));
  }, []);

  const confirmR32 = useCallback(() => {
    setPredictions(p => ({
      ...p,
      completedStages: p.completedStages.includes("r32")
        ? p.completedStages : [...p.completedStages, "r32"],
    }));
    setActiveStage(2);
  }, []);

  const setR16Pick = useCallback((idx: number, winner: string) => {
    setPredictions(p => ({
      ...p,
      r16: p.r16.map((m,i) => i===idx ? { winner } : m),
    }));
  }, []);

  const confirmR16 = useCallback(() => {
    setPredictions(p => ({
      ...p,
      completedStages: p.completedStages.includes("r16")
        ? p.completedStages : [...p.completedStages, "r16"],
    }));
    setActiveStage(3);
  }, []);

  const setQFPick = useCallback((idx: number, winner: string, confidence?: Confidence) => {
    setPredictions(p => ({
      ...p,
      qf: p.qf.map((m,i) => i===idx
        ? { winner, confidence: confidence ?? m.confidence }
        : m),
    }));
  }, []);

  const confirmQF = useCallback(() => {
    setPredictions(p => ({
      ...p,
      completedStages: p.completedStages.includes("qf")
        ? p.completedStages : [...p.completedStages, "qf"],
    }));
    setActiveStage(4);
  }, []);

  const setSFPick = useCallback((idx: number, field: "winner"|"scorer"|"scoreH"|"scoreA", val: string|number|"") => {
    setPredictions(p => ({
      ...p,
      sf: p.sf.map((m,i) => {
        if (i !== idx) return m;
        if (field === "winner") return { ...m, winner: val as string };
        if (field === "scorer") return { ...m, scorer: val as string };
        if (field === "scoreH") return { ...m, score: [val as number|"", m.score[1]] };
        return { ...m, score: [m.score[0], val as number|""] };
      }),
    }));
  }, []);

  const confirmSF = useCallback(() => {
    setPredictions(p => ({
      ...p,
      completedStages: p.completedStages.includes("sf")
        ? p.completedStages : [...p.completedStages, "sf"],
    }));
    setActiveStage(5);
  }, []);

  const setFinalField = useCallback((field: "winner"|"scorer"|"confidence"|"scoreH"|"scoreA", val: string|number|""|Confidence) => {
    setPredictions(p => {
      const f = p.final;
      if (field === "winner")     return { ...p, final: { ...f, winner: val as string } };
      if (field === "scorer")     return { ...p, final: { ...f, scorer: val as string } };
      if (field === "confidence") return { ...p, final: { ...f, confidence: val as Confidence } };
      if (field === "scoreH")     return { ...p, final: { ...f, score: [val as number|"", f.score[1]] } };
      return { ...p, final: { ...f, score: [f.score[0], val as number|""] } };
    });
  }, []);

  const confirmFinal = useCallback(() => {
    setPredictions(p => ({
      ...p,
      completedStages: p.completedStages.includes("final")
        ? [...p.completedStages, "champion"]
        : [...p.completedStages, "final", "champion"],
    }));
    setActiveStage(6);
  }, []);

  const resetAll = useCallback(() => {
    setPredictions(INITIAL);
    setActiveStage(0);
    try { localStorage.removeItem(LS_KEY); } catch { /* ignore */ }
  }, []);

  const value: BracketCtx = {
    predictions, activeStage, setActiveStage,
    updateGroupMatch, confirmGroup,
    setR32Pick, confirmR32,
    setR16Pick, confirmR16,
    setQFPick, confirmQF,
    setSFPick, confirmSF,
    setFinalField, confirmFinal,
    resetAll,
    groupStandings, r32Teams, r16Teams, qfTeams, sfTeams,
    progressPct,
  };

  if (!hydrated) return null; // Avoid SSR mismatch

  return (
    <BracketContext.Provider value={value}>
      {children}
    </BracketContext.Provider>
  );
}
