"use client";
import React from 'react';
import { StandingRow, Team } from '../../lib/mundial/types';

interface Props {
  standings: StandingRow[];
  teams: Team[];
}

export function StandingsTable({ standings, teams }: Props) {
  return (
    <div className="mundial-sm">
      <div className="mundial-sm-hdr">
        <div className="mundial-sm-hdr-pos"></div>
        <div className="mundial-sm-hdr-flag"></div>
        <div className="mundial-sm-hdr-name"></div>
        <div className="mundial-sm-hdr-stat">P</div>
        <div className="mundial-sm-hdr-stat">W</div>
        <div className="mundial-sm-hdr-stat">GD</div>
        <div className="mundial-sm-hdr-pts">Pts</div>
      </div>
      {standings.map((row, ri) => {
        const t = teams[row.teamIdx];
        const gd = row.gf - row.ga;
        const gdStr = gd > 0 ? '+' + gd : String(gd);
        const rClass = ri === 0 ? 'r1' : ri === 1 ? 'r2' : ri === 2 ? 'r3' : 'r4';
        
        return (
          <div className={`mundial-sm-row ${rClass}`} key={ri}>
            <div className="mundial-sm-pos">{ri + 1}</div>
            <div className="mundial-sm-flag">{t.flag}</div>
            <div className="mundial-sm-name">{t.name}</div>
            <div className="mundial-sm-stat">{row.played}</div>
            <div className="mundial-sm-stat">{row.won}</div>
            <div className="mundial-sm-stat">{gdStr}</div>
            <div className="mundial-sm-pts">{row.pts}</div>
          </div>
        );
      })}
    </div>
  );
}
