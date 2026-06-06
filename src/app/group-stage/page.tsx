"use client";
import React, { useState, useEffect, useCallback } from 'react';
import '../../styles/mundial.css';
import { GROUPS, genMatches } from '../../lib/mundial/data';
import { calcStandings, getQualifiedTeams } from '../../lib/mundial/standings';
import { GroupState } from '../../lib/mundial/types';
import { Navbar } from '../../components/mundial/Navbar';
import { GroupCard } from '../../components/mundial/GroupCard';

const INITIAL_STATE: Record<string, GroupState> = {};
Object.keys(GROUPS).forEach(k => {
  INITIAL_STATE[k] = { matches: genMatches(), confirmed: false };
});

import { useMundial } from '../../components/mundial/MundialProvider';
import Link from 'next/link';

export default function GroupStagePage() {
  const { groupStates: state, setGroupStates: setState, setQualifiedTeams } = useMundial();
  const [toast, setToast] = useState({ msg: '', visible: false });

  const showToast = useCallback((msg: string) => {
    setToast({ msg, visible: true });
    setTimeout(() => setToast(prev => prev.msg === msg ? { ...prev, visible: false } : prev), 3000);
  }, []);

  const handleScoreChange = (groupKey: string, matchIdx: number, isHome: boolean, val: string) => {
    setState(prev => {
      const next = { ...prev };
      next[groupKey] = { ...next[groupKey], matches: [...next[groupKey].matches] };
      if (isHome) next[groupKey].matches[matchIdx].homeScore = val;
      else next[groupKey].matches[matchIdx].awayScore = val;
      return next;
    });
  };

  const confirmGroup = (k: string) => {
    setState(prev => {
      const next = { ...prev, [k]: { ...prev[k], confirmed: true } };
      
      const remaining = Object.keys(next).filter(g => !next[g].confirmed);
      if (remaining.length === 0) {
        const qualified = getQualifiedTeams(next);
        setQualifiedTeams(qualified);
        showToast('🏆 ALL 12 GROUPS CONFIRMED — ROUND OF 32 UNLOCKED');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        showToast(`✓ GROUP ${k} CONFIRMED`);
      }
      
      return next;
    });
  };

  let filledCount = 0;
  let confirmedCount = 0;
  Object.keys(state).forEach(k => {
    state[k].matches.forEach(m => { if (m.homeScore !== '' && m.awayScore !== '') filledCount++; });
    if (state[k].confirmed) confirmedCount++;
  });

  const allConfirmed = confirmedCount === 12;
  const qualified = allConfirmed ? getQualifiedTeams(state) : [];

  return (
    <div className="mundial-bg">
      <Navbar confirmedCount={confirmedCount} filledCount={filledCount} />
      
      <div className="mundial-wrap">
        {allConfirmed && (
          <div className="mundial-qual-banner" style={{ position: 'relative' }}>
            <div className="mundial-qb-title">🏆 All Groups Confirmed — 32 Teams Qualified</div>
            <div className="mundial-qb-grid">
              {qualified.map((t, i) => (
                <div className="mundial-qb-team" key={i}>
                  {t.flag} <b>{t.abbr}</b>
                  <span style={{ fontSize: 6, color: 'var(--ts)' }}>{t.pos} · Grp {t.group}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
              <Link href="/bracket" style={{
                background: 'var(--g)', color: 'var(--bk)', padding: '10px 24px', 
                borderRadius: '4px', textDecoration: 'none', fontFamily: 'var(--font-ui), sans-serif',
                fontWeight: 700, fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase'
              }}>
                Go to My Bracket →
              </Link>
            </div>
          </div>
        )}

        <div className="mundial-grid">
          {Object.keys(GROUPS).map(k => (
            <GroupCard 
              key={k}
              groupKey={k}
              groupState={state[k]}
              teams={GROUPS[k]}
              standings={calcStandings(k, state[k])}
              onScoreChange={(mi, isHome, val) => handleScoreChange(k, mi, isHome, val)}
              onConfirm={() => confirmGroup(k)}
            />
          ))}
        </div>
      </div>

      <div className={`mundial-toast ${toast.visible ? 'show' : ''}`}>
        {toast.msg}
      </div>
    </div>
  );
}
