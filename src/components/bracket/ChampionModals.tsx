import React from 'react';
import { Team } from './types';

interface ChampionConfirmDialogProps {
  champion: Team;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ChampionConfirmDialog({ champion, onConfirm, onCancel }: ChampionConfirmDialogProps) {
  return (
    <div className="champion-confirm-overlay">
      <div className="champion-confirm-card">
        <div className="cm-flag">{champion.f}</div>
        <div className="cm-name">{champion.n}</div>
        <div className="cm-prompt">Are you sure this is your predicted champion?</div>
        <div className="cm-actions">
          <button className="cm-btn cm-btn-back" onClick={onCancel}>GO BACK</button>
          <button className="cm-btn cm-btn-confirm" onClick={onConfirm}>CONFIRM CHAMPION</button>
        </div>
      </div>
    </div>
  );
}

interface ChampionCardProps {
  champion: Team;
  userName: string;
  setUserName: (name: string) => void;
  predictionDate: string;
  onClose: () => void;
  onDownload: () => void;
}

export function ChampionCard({ champion, userName, setUserName, predictionDate, onClose, onDownload }: ChampionCardProps) {
  return (
    <div className="champion-overlay">
      <div className="confetti-container">
        {Array.from({ length: 50 }).map((_, i) => (
           <div key={i} className="confetti" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 3}s` }}></div>
        ))}
      </div>
      <button className="close-champion" onClick={onClose}>✕ Close</button>
      
      <div className="champion-card">
         <div className="champ-card-glow"></div>
         <div className="champ-card-shimmer"></div>
         <div className="corner-flourish tl"></div>
         <div className="corner-flourish tr"></div>
         <div className="corner-flourish bl"></div>
         <div className="corner-flourish br"></div>
         
         <div className="champ-header">🏆 WORLD CUP 2026 CHAMPION</div>
         <div className="champ-subtext">YOUR PREDICTION</div>
         <div className="champ-big-flag">{champion.f}</div>
         <div className="champ-big-name">{champion.n}</div>
         <div className="champ-divider"></div>
         
         <div className="champ-meta">
           <div style={{marginBottom: 10}}>
             Predicted by: <input className="name-input" style={{textAlign: 'center', display: 'inline', width: '120px', background: 'rgba(0,0,0,0.5)', padding: '2px 8px'}} value={userName} onChange={e => setUserName(e.target.value)} placeholder="My Prediction" />
           </div>
           <div>Date: {predictionDate}</div>
         </div>
         
         <div className="champ-share-section">
           <div className="share-label">SHARE YOUR PREDICTION</div>
           <div className="share-buttons">
             <button onClick={onDownload}>📄 Download PDF</button>
             <button onClick={() => window.open(`whatsapp://send?text=My FIFA World Cup 2026 Champion is ${champion.n}! Predict yours at XI.`)}>💬 WhatsApp</button>
             <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=My FIFA World Cup 2026 Champion is ${champion.n}! Predict yours at XI.`)}>𝕏 Twitter</button>
             <button onClick={() => { navigator.clipboard.writeText(`My FIFA World Cup 2026 Champion is ${champion.n}! Predict yours at XI.`); alert("Link copied!"); }}>🔗 Copy Link</button>
           </div>
         </div>
      </div>
    </div>
  );
}
