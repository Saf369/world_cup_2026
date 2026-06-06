"use client";
import React from 'react';
import Link from 'next/link';

export function Navbar({ confirmedCount, filledCount }: { confirmedCount: number, filledCount: number }) {
  const pct = Math.round((confirmedCount / 12) * 100);
  
  return (
    <>
      <nav className="mundial-nav">
        <div className="mundial-logo">MUNDIAL<span>Group Stage Predictor · 2026</span></div>
        <div className="mundial-nav-mid">
          <div className="mundial-npill active">Group Stage</div>
          <div style={{ fontSize: 9, color: 'var(--tm)' }}>›</div>
          <Link href="/bracket" className={`mundial-npill ${confirmedCount === 12 ? 'done' : ''}`} style={{textDecoration: 'none'}}>Round of 32</Link>
          <div style={{ fontSize: 9, color: 'var(--tm)' }}>›</div>
          <Link href="/bracket" className="mundial-npill" style={{textDecoration: 'none'}}>Bracket</Link>
        </div>
        <div className="mundial-nav-r">
          <div className="mundial-prog-text"><b>{confirmedCount}</b>/12 confirmed</div>
          <div className="mundial-prog-bar-w"><div className="mundial-prog-bar-f" style={{ width: `${pct}%` }}></div></div>
          <div className="mundial-prog-text"><b>{filledCount}</b>/72 filled</div>
        </div>
      </nav>
      <div className="mundial-infobar">
        <div className="mundial-ib"><b>48 Teams</b> · 12 Groups</div>
        <div className="mundial-ib">Top <b>2</b> per group qualify · Best <b>8</b> third-place teams advance</div>
        <div className="mundial-ib">Tiebreaker: <b>Pts → GD → GF → H2H</b></div>
      </div>
    </>
  );
}
