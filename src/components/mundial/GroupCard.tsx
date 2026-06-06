"use client";
import React, { useState } from 'react';
import { GroupState, Team, StandingRow } from '../../lib/mundial/types';
import { StandingsTable } from './StandingsTable';
import { MatchRow } from './MatchRow';

interface Props {
  groupKey: string;
  groupState: GroupState;
  teams: Team[];
  standings: StandingRow[];
  onScoreChange: (matchIdx: number, isHome: boolean, val: string) => void;
  onConfirm: () => void;
}

export function GroupCard({ groupKey, groupState, teams, standings, onScoreChange, onConfirm }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const allFilled = groupState.matches.every(m => m.homeScore !== '' && m.awayScore !== '');

  return (
    <div className={`mundial-gcard ${groupState.confirmed ? 'confirmed' : ''}`}>
      <div className="mundial-gh">
        <div className="mundial-gh-left">
          <div className="mundial-gh-letter">{groupKey}</div>
          <div className="mundial-gh-sub">Group</div>
        </div>
        <div className="mundial-gh-status">✓ Done</div>
      </div>

      <StandingsTable standings={standings} teams={teams} />

      <button className={`mundial-toggle-btn ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Hide' : 'Enter'} Scores <span className="arr">▼</span>
      </button>

      <div className={`mundial-matches ${isOpen ? 'open' : ''}`}>
        {groupState.matches.map((m, mi) => (
          <MatchRow 
            key={mi} 
            match={m} 
            matchIdx={mi} 
            teams={teams} 
            confirmed={groupState.confirmed}
            onScoreChange={onScoreChange} 
          />
        ))}
        
        <div className="mundial-cbtn-wrap">
          <button 
            className={`mundial-cbtn ${groupState.confirmed ? 'confirmed-state' : ''}`}
            disabled={!groupState.confirmed && !allFilled}
            onClick={() => !groupState.confirmed && onConfirm()}
          >
            {groupState.confirmed ? '✓ Confirmed' : `Confirm Group ${groupKey}`}
          </button>
        </div>
      </div>
    </div>
  );
}
