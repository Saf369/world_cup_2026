"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { GroupState, Team } from '../../lib/mundial/types';
import { GROUPS, genMatches } from '../../lib/mundial/data';

interface MundialContextType {
  groupStates: Record<string, GroupState>;
  qualifiedTeams: (Team & { group: string; pos: string })[] | null;
  setGroupStates: React.Dispatch<React.SetStateAction<Record<string, GroupState>>>;
  setQualifiedTeams: React.Dispatch<React.SetStateAction<(Team & { group: string; pos: string })[] | null>>;
}

const MundialContext = createContext<MundialContextType | undefined>(undefined);

const INITIAL_STATE: Record<string, GroupState> = {};
Object.keys(GROUPS).forEach(k => {
  INITIAL_STATE[k] = { matches: genMatches(), confirmed: false };
});

export function MundialProvider({ children }: { children: React.ReactNode }) {
  const [groupStates, setGroupStates] = useState<Record<string, GroupState>>(INITIAL_STATE);
  const [qualifiedTeams, setQualifiedTeams] = useState<(Team & { group: string; pos: string })[] | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedGroups = localStorage.getItem('mundial_groupstage_v2');
      if (storedGroups) setGroupStates(JSON.parse(storedGroups));
      
      const storedQual = localStorage.getItem('mundial_qualified_v2');
      if (storedQual) setQualifiedTeams(JSON.parse(storedQual));
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('mundial_groupstage_v2', JSON.stringify(groupStates));
      if (qualifiedTeams) {
        localStorage.setItem('mundial_qualified_v2', JSON.stringify(qualifiedTeams));
      } else {
        localStorage.removeItem('mundial_qualified_v2');
      }
    }
  }, [groupStates, qualifiedTeams, hydrated]);

  if (!hydrated) return null;

  return (
    <MundialContext.Provider value={{ groupStates, qualifiedTeams, setGroupStates, setQualifiedTeams }}>
      {children}
    </MundialContext.Provider>
  );
}

export function useMundial() {
  const context = useContext(MundialContext);
  if (context === undefined) {
    throw new Error('useMundial must be used within a MundialProvider');
  }
  return context;
}
