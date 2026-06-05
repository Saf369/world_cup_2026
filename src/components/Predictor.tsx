"use client";
import { useEffect, useRef, useState } from "react";

interface MatchStats {
  label: string;
  homeVal: number;
  awayVal: number;
  homeDisplay: string;
  awayDisplay: string;
}

interface Match {
  home: { name: string; flag: string; prob: number; rank: number };
  away: { name: string; flag: string; prob: number; rank: number };
  date: string;
  venue: string;
  group: string;
  stats: MatchStats[];
  odds: { home: string; draw: string; away: string };
}

// Opening match + other high-profile Group Stage fixtures using real 2026 data
const MATCHES: Match[] = [
  {
    home: { name: "MEXICO",    flag: "🇲🇽", prob: 44, rank: 15 },
    away: { name: "SOUTH AFRICA", flag: "🇿🇦", prob: 21, rank: 33 },
    date: "Jun 11, 2026 — 20:00 local",
    venue: "Estadio Azteca, Mexico City",
    group: "GROUP A — Opening Match",
    odds: { home: "1.85", draw: "3.40", away: "4.20" },
    stats: [
      { label: "FIFA Ranking",   homeVal: 75, awayVal: 34, homeDisplay: "#15",    awayDisplay: "#33" },
      { label: "Win Probability",homeVal: 63, awayVal: 37, homeDisplay: "63%",    awayDisplay: "21%" },
      { label: "xG (Avg)",       homeVal: 68, awayVal: 38, homeDisplay: "1.72",   awayDisplay: "0.94" },
      { label: "Form (L5)",      homeVal: 72, awayVal: 50, homeDisplay: "W W D W W", awayDisplay: "W L W D W" },
      { label: "Home Advantage", homeVal: 90, awayVal: 30, homeDisplay: "HIGH",   awayDisplay: "AWAY" },
    ],
  },
  {
    home: { name: "FRANCE",    flag: "🇫🇷", prob: 65, rank: 1 },
    away: { name: "SENEGAL",   flag: "🇸🇳", prob: 18, rank: 18 },
    date: "Jun 14, 2026 — 16:00 UTC",
    venue: "AT&T Stadium, Dallas",
    group: "GROUP I",
    odds: { home: "1.55", draw: "4.00", away: "5.50" },
    stats: [
      { label: "FIFA Ranking",    homeVal: 100, awayVal: 50, homeDisplay: "#1",    awayDisplay: "#18" },
      { label: "Win Probability", homeVal: 65,  awayVal: 35, homeDisplay: "65%",   awayDisplay: "18%" },
      { label: "xG (Avg)",        homeVal: 82,  awayVal: 48, homeDisplay: "2.14",  awayDisplay: "1.24" },
      { label: "Form (L5)",       homeVal: 86,  awayVal: 64, homeDisplay: "W W W W D", awayDisplay: "W W D W L" },
      { label: "Title Odds",      homeVal: 90,  awayVal: 15, homeDisplay: "28.6%", awayDisplay: "—" },
    ],
  },
  {
    home: { name: "BRAZIL",    flag: "🇧🇷", prob: 61, rank: 6 },
    away: { name: "MOROCCO",   flag: "🇲🇦", prob: 20, rank: 13 },
    date: "Jun 13, 2026 — 19:00 UTC",
    venue: "SoFi Stadium, Los Angeles",
    group: "GROUP C",
    odds: { home: "1.65", draw: "3.80", away: "4.80" },
    stats: [
      { label: "FIFA Ranking",    homeVal: 90, awayVal: 60, homeDisplay: "#6",    awayDisplay: "#13" },
      { label: "Win Probability", homeVal: 61, awayVal: 39, homeDisplay: "61%",   awayDisplay: "20%" },
      { label: "xG (Avg)",        homeVal: 79, awayVal: 52, homeDisplay: "2.04",  awayDisplay: "1.31" },
      { label: "Form (L5)",       homeVal: 80, awayVal: 74, homeDisplay: "W W W D W", awayDisplay: "W D W W W" },
      { label: "Title Odds",      homeVal: 78, awayVal: 14, homeDisplay: "23.8%", awayDisplay: "—" },
    ],
  },
  {
    home: { name: "ARGENTINA", flag: "🇦🇷", prob: 68, rank: 3 },
    away: { name: "ALGERIA",   flag: "🇩🇿", prob: 12, rank: 30 },
    date: "Jun 15, 2026 — 21:00 UTC",
    venue: "Mercedes-Benz Stadium, Atlanta",
    group: "GROUP J — Defending Champions",
    odds: { home: "1.35", draw: "4.80", away: "8.00" },
    stats: [
      { label: "FIFA Ranking",    homeVal: 95,  awayVal: 38, homeDisplay: "#3",    awayDisplay: "#30" },
      { label: "Win Probability", homeVal: 75,  awayVal: 25, homeDisplay: "68%",   awayDisplay: "12%" },
      { label: "xG (Avg)",        homeVal: 88,  awayVal: 34, homeDisplay: "2.32",  awayDisplay: "0.86" },
      { label: "Form (L5)",       homeVal: 90,  awayVal: 56, homeDisplay: "W W W W W", awayDisplay: "W D W L W" },
      { label: "Title Odds",      homeVal: 85,  awayVal: 5,  homeDisplay: "20.8%", awayDisplay: "—" },
    ],
  },
  {
    home: { name: "SPAIN",     flag: "🇪🇸", prob: 62, rank: 2 },
    away: { name: "URUGUAY",   flag: "🇺🇾", prob: 22, rank: 10 },
    date: "Jun 14, 2026 — 21:00 UTC",
    venue: "Hard Rock Stadium, Miami",
    group: "GROUP H",
    odds: { home: "1.70", draw: "3.60", away: "4.50" },
    stats: [
      { label: "FIFA Ranking",    homeVal: 98,  awayVal: 68, homeDisplay: "#2",    awayDisplay: "#10" },
      { label: "Win Probability", homeVal: 62,  awayVal: 38, homeDisplay: "62%",   awayDisplay: "22%" },
      { label: "xG (Avg)",        homeVal: 84,  awayVal: 56, homeDisplay: "2.18",  awayDisplay: "1.44" },
      { label: "Form (L5)",       homeVal: 88,  awayVal: 72, homeDisplay: "W W W W W", awayDisplay: "W W D W L" },
      { label: "Title Odds",      homeVal: 80,  awayVal: 20, homeDisplay: "18.2%", awayDisplay: "6.3%" },
    ],
  },
];

function ProbBar({ value, animated }: { value: number; animated: boolean }) {
  return (
    <div style={{ flex: 1 }}>
      <div className="prob-bar-wrap">
        <div
          className={`prob-bar ${animated ? "animated" : ""}`}
          style={{ "--target-width": `${value}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}

function StatRow({ stat, animated }: { stat: MatchStats; animated: boolean }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        gap: 12,
        padding: "10px 0",
        borderBottom: "1px solid #1E1E1E",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexDirection: "row-reverse" }}>
        <span className="label-xs" style={{ color: "#E8E0D0", minWidth: 56, textAlign: "right", fontSize: 9 }}>
          {stat.homeDisplay}
        </span>
        <ProbBar value={stat.homeVal} animated={animated} />
      </div>
      <span className="label-xs" style={{ color: "#5A5248", whiteSpace: "nowrap", textAlign: "center" }}>
        {stat.label}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <ProbBar value={stat.awayVal} animated={animated} />
        <span className="label-xs" style={{ color: "#E8E0D0", minWidth: 56, fontSize: 9 }}>
          {stat.awayDisplay}
        </span>
      </div>
    </div>
  );
}

export default function Predictor() {
  const [activeMatch, setActiveMatch] = useState(0);
  const [animated, setAnimated] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    setAnimated(false);
    const t = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(t);
  }, [activeMatch]);

  const match = MATCHES[activeMatch];

  return (
    <section
      id="predictor"
      ref={sectionRef}
      style={{ background: "#050505", padding: "100px 0", borderTop: "1px solid #252525" }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 40px" }}>
        <div style={{ marginBottom: 48 }}>
          <div className="eyebrow" style={{ marginBottom: 16 }}>AI Match Analysis · 2026</div>
          <h2 className="section-title">Match <em>Predictor</em></h2>
        </div>

        {/* Match tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 40, flexWrap: "wrap" }}>
          {MATCHES.map((m, i) => (
            <button
              key={i}
              onClick={() => setActiveMatch(i)}
              style={{
                padding: "8px 16px",
                background: activeMatch === i ? "#C9A84C" : "transparent",
                border: `1px solid ${activeMatch === i ? "#C9A84C" : "#252525"}`,
                color: activeMatch === i ? "#050505" : "#9A9080",
                fontFamily: "var(--font-ui)", fontSize: 9, fontWeight: 600,
                letterSpacing: 1.8, textTransform: "uppercase", cursor: "pointer",
                transition: "all 0.22s ease", borderRadius: 2,
              }}
            >
              {m.home.name} vs {m.away.name}
            </button>
          ))}
        </div>

        <div className="panel" style={{ padding: 0, overflow: "visible", position: "relative" }}>
          <div className="corner-ornament top-left" />
          <div className="corner-ornament top-right" />
          <div className="corner-ornament bottom-left" />
          <div className="corner-ornament bottom-right" />
          <div style={{ padding: "48px" }}>
            {/* Group badge */}
            <div style={{ textAlign: "center", marginBottom: 8 }}>
              <span style={{
                display: "inline-block",
                background: "rgba(201,168,76,0.08)",
                border: "1px solid rgba(201,168,76,0.3)",
                borderRadius: 2,
                padding: "4px 16px",
                fontSize: 9,
                fontFamily: "var(--font-ui)",
                fontWeight: 600,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#C9A84C",
              }}>{match.group}</span>
            </div>

            {/* Teams */}
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div className="label-xs" style={{ color: "#C9A84C", marginBottom: 4 }}>{match.venue}</div>
              <div className="label-xs" style={{ color: "#5A5248", marginBottom: 28 }}>{match.date}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 24 }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 52, marginBottom: 6 }}>{match.home.flag}</div>
                  <div className="font-display" style={{ fontSize: 24, color: "#E8E0D0" }}>{match.home.name}</div>
                  <div className="label-xs" style={{ color: "#5A5248", marginBottom: 4 }}>FIFA #{match.home.rank}</div>
                  <div className="font-display" style={{ fontSize: 44, color: "#C9A84C" }}>{match.home.prob}%</div>
                  <div className="label-xs" style={{ color: "#5A5248" }}>Win Probability</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <span className="font-serif" style={{ fontSize: "1.6rem", fontStyle: "italic", color: "#5A5248" }}>vs</span>
                  {/* Odds strip */}
                  <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 6 }}>
                    {[
                      { l: "1", v: match.odds.home },
                      { l: "X", v: match.odds.draw },
                      { l: "2", v: match.odds.away },
                    ].map((o) => (
                      <div key={o.l} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <span className="label-xs" style={{ color: "#5A5248", fontSize: 8 }}>{o.l}</span>
                        <span className="font-display" style={{ fontSize: 14, color: "#9A9080", letterSpacing: "0.05em" }}>{o.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 52, marginBottom: 6 }}>{match.away.flag}</div>
                  <div className="font-display" style={{ fontSize: 24, color: "#E8E0D0" }}>{match.away.name}</div>
                  <div className="label-xs" style={{ color: "#5A5248", marginBottom: 4 }}>FIFA #{match.away.rank}</div>
                  <div className="font-display" style={{ fontSize: 44, color: "#9A9080" }}>{match.away.prob}%</div>
                  <div className="label-xs" style={{ color: "#5A5248" }}>Win Probability</div>
                </div>
              </div>
              <div style={{ marginTop: 20 }}>
                <div className="prob-bar-wrap" style={{ height: 4 }}>
                  <div
                    className={`prob-bar ${animated ? "animated" : ""}`}
                    style={{ "--target-width": `${match.home.prob}%` } as React.CSSProperties}
                  />
                </div>
              </div>
            </div>

            <div className="divider" style={{ marginBottom: 28 }} />
            <div className="eyebrow" style={{ marginBottom: 16 }}>Statistical Breakdown</div>
            {match.stats.map((stat, i) => <StatRow key={i} stat={stat} animated={animated} />)}

            {/* Mini info cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginTop: 32 }}>
              {[
                { label: "AI Confidence", value: "HIGH",  sub: "Model v4.2" },
                { label: "Probability Inputs", value: "8",  sub: "Weighted factors" },
                { label: "WC Format",     value: "2026", sub: "48-team · 104 matches" },
                { label: "Extra Time",    value: "AET",  sub: "Knockouts if tied" },
              ].map((card, i) => (
                <div key={i} style={{ background: "#0D0D0D", border: "1px solid #252525", borderRadius: 2, padding: "16px 20px", textAlign: "center" }}>
                  <div className="font-display" style={{ fontSize: 22, color: "#C9A84C" }}>{card.value}</div>
                  <div className="label-xs" style={{ color: "#E8E0D0", marginTop: 4 }}>{card.label}</div>
                  <div className="label-xs" style={{ color: "#5A5248" }}>{card.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
