import React from 'react';
import { Team } from './types';

interface PdfCaptureProps {
  confirmedChampion: Team | null;
  userName: string;
  predictionDate: string;
  getTeamAt: (r: number, m: number, s: 0 | 1) => Team;
  getWinnerAt: (r: number, m: number) => Team | null;
  renderCaptureMatch: (teamA: Team | null, teamB: Team | null, winner: Team | null) => React.ReactNode;
}

export default function PdfCapture({
  confirmedChampion,
  userName,
  predictionDate,
  getTeamAt,
  getWinnerAt,
  renderCaptureMatch
}: PdfCaptureProps) {
  return (
    <>
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
            <div style={{display: 'flex', flex: 1}}>
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
                      <div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
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

            {/* Connector SF to Final - Left */}
            <div style={{display: 'flex', flexDirection: 'column', flex: 0.5}}>
                <div style={{flex: 1, display: 'flex', alignItems: 'center'}}>
                    <div style={{width: '100%', height: 1, backgroundColor: '#7A6230'}}></div>
                </div>
            </div>

            {/* FINAL BOX */}
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: 120, flexShrink: 0}}>
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

            {/* Connector SF to Final - Right */}
            <div style={{display: 'flex', flexDirection: 'column', flex: 0.5}}>
                <div style={{flex: 1, display: 'flex', alignItems: 'center'}}>
                    <div style={{width: '100%', height: 1, backgroundColor: '#7A6230'}}></div>
                </div>
            </div>

            {/* HALF 2 */}
            <div style={{display: 'flex', flex: 1, flexDirection: 'row-reverse'}}>
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
                      <div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
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
    </>
  );
}
