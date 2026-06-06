"use client";
import React from 'react';
import { Match, Team } from '../../lib/mundial/types';

interface Props {
  match: Match;
  matchIdx: number;
  teams: Team[];
  confirmed: boolean;
  onScoreChange: (matchIdx: number, isHome: boolean, val: string) => void;
}

export function MatchRow({ match, matchIdx, teams, confirmed, onScoreChange }: Props) {
  const ht = teams[match.homeIdx];
  const at = teams[match.awayIdx];
  
  const hasH = match.homeScore !== '';
  const hasA = match.awayScore !== '';
  const hs = hasH ? parseInt(match.homeScore) : null;
  const as = hasA ? parseInt(match.awayScore) : null;
  
  const hWin = hasH && hasA && hs! > as!;
  const aWin = hasH && hasA && as! > hs!;
  const draw = hasH && hasA && hs === as;
  
  let rc = 'empty', rt = '';
  if (hWin) { rc = 'hw'; rt = ht.abbr; }
  else if (draw) { rc = 'dw'; rt = '='; }
  else if (aWin) { rc = 'aw'; rt = at.abbr; }

  const handleInput = (isHome: boolean, e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (val !== '') {
      let num = parseInt(val);
      if (num < 0) num = 0;
      if (num > 20) num = 20;
      val = num.toString();
    }
    onScoreChange(matchIdx, isHome, val);
  };

  return (
    <div className="mundial-match-row">
      <div className="mundial-mr-team">
        <span className="mundial-mr-flag">{ht.flag}</span>
        <span className={`mundial-mr-name ${hWin ? 'winning' : ''}`}>{ht.abbr}</span>
      </div>
      <div className="mundial-mr-scores">
        <input 
          type="number" 
          className={`mundial-si ${hasH ? 'filled' : ''}`}
          value={match.homeScore} 
          min="0" max="20" placeholder="0" 
          disabled={confirmed}
          onChange={(e) => handleInput(true, e)} 
        />
        <span className="mundial-mr-dash">-</span>
        <input 
          type="number" 
          className={`mundial-si ${hasA ? 'filled' : ''}`}
          value={match.awayScore} 
          min="0" max="20" placeholder="0" 
          disabled={confirmed}
          onChange={(e) => handleInput(false, e)} 
        />
      </div>
      <div className="mundial-mr-team away">
        <span className={`mundial-mr-name ${aWin ? 'winning' : ''}`}>{at.abbr}</span>
        <span className="mundial-mr-flag">{at.flag}</span>
      </div>
      <div className={`mundial-mr-result ${rc}`}>{rt}</div>
    </div>
  );
}
