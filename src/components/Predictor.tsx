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
  home: { name: string; flag: string; prob: number };
  away: { name: string; flag: string; prob: number };
  date: string;
  venue: string;
  stats: MatchStats[];
}

const MATCHES: Match[] = [
  {
    home: { name: "ARGENTINA", flag: "🇦🇷", prob: 62 },
    away: { name: "FRANCE",    flag: "🇫🇷", prob: 38 },
    date: "Jul 14, 2026 — 19:00 UTC",
    venue: "MetLife Stadium, New York",
    stats: [
      { label: "Possession",    homeVal: 58, awayVal: 42, homeDisplay: "58%",   awayDisplay: "42%" },
      { label: "Shot Accuracy", homeVal: 71, awayVal: 59, homeDisplay: "71%",   awayDisplay: "59%" },
      { label: "Pass Success",  homeVal: 89, awayVal: 86, homeDisplay: "89%",   awayDisplay: "86%" },
      { label: "xG",            homeVal: 64, awayVal: 44, homeDisplay: "1.92",  awayDisplay: "1.32" },
      { label: "Form",          homeVal: 82, awayVal: 74, homeDisplay: "W W W", awayDisplay: "W W D" },
    ],
  },
  {
    home: { name: "BRAZIL",   flag: "🇧🇷", prob: 55 },
    away: { name: "PORTUGAL", flag: "🇵🇹", prob: 45 },
    date: "Jul 10, 2026 — 16:00 UTC",
    venue: "AT&T Stadium, Dallas",
    stats: [
      { label: "Possession",    homeVal: 61, awayVal: 39, homeDisplay: "61%",   awayDisplay: "39%" },
      { label: "Shot Accuracy", homeVal: 68, awayVal: 63, homeDisplay: "68%",   awayDisplay: "63%" },
      { label: "Pass Success",  homeVal: 91, awayVal: 88, homeDisplay: "91%",   awayDisplay: "88%" },
      { label: "xG",            homeVal: 56, awayVal: 52, homeDisplay: "1.68",  awayDisplay: "1.56" },
      { label: "Form",          homeVal: 76, awayVal: 78, homeDisplay: "W D W", awayDisplay: "W W W" },
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
        <span className="label-xs" style={{ color: "#E8E0D0", minWidth: 36, textAlign: "right" }}>
          {stat.homeDisplay}
        </span>
        <ProbBar value={stat.homeVal} animated={animated} />
      </div>
      <span className="label-xs" style={{ color: "#5A5248", whiteSpace: "nowrap", textAlign: "center" }}>
        {stat.label}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <ProbBar value={stat.awayVal} animated={animated} />
        <span className="label-xs" style={{ color: "#E8E0D0", minWidth: 36 }}>
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
          <div className="eyebrow" style={{ marginBottom: 16 }}>AI Match Analysis</div>
          <h2 className="section-title">Match <em>Predictor</em></h2>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 40 }}>
          {MATCHES.map((m, i) => (
            <button
              key={i}
              onClick={() => setActiveMatch(i)}
              style={{
                padding: "10px 20px",
                background: activeMatch === i ? "#C9A84C" : "transparent",
                border: `1px solid ${activeMatch === i ? "#C9A84C" : "#252525"}`,
                color: activeMatch === i ? "#050505" : "#9A9080",
                fontFamily: "var(--font-ui)", fontSize: 10, fontWeight: 600,
                letterSpacing: 2, textTransform: "uppercase", cursor: "pointer",
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
            {/* Teams */}
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div className="label-xs" style={{ color: "#C9A84C", marginBottom: 6 }}>{match.venue}</div>
              <div className="label-xs" style={{ color: "#5A5248", marginBottom: 28 }}>{match.date}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 24 }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 52, marginBottom: 6 }}>{match.home.flag}</div>
                  <div className="font-display" style={{ fontSize: 24, color: "#E8E0D0" }}>{match.home.name}</div>
                  <div className="font-display" style={{ fontSize: 44, color: "#C9A84C" }}>{match.home.prob}%</div>
                  <div className="label-xs" style={{ color: "#5A5248" }}>Win Probability</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <span className="font-serif" style={{ fontSize: "1.6rem", fontStyle: "italic", color: "#5A5248" }}>vs</span>
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 52, marginBottom: 6 }}>{match.away.flag}</div>
                  <div className="font-display" style={{ fontSize: 24, color: "#E8E0D0" }}>{match.away.name}</div>
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

            {/* Mini cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginTop: 32 }}>
              {[
                { label: "AI Confidence", value: "HIGH",  sub: "Model v4.2" },
                { label: "Data Points",   value: "12.4K", sub: "Per match" },
                { label: "Accuracy Rate", value: "78.3%", sub: "2022 WC" },
                { label: "Last Updated",  value: "LIVE",  sub: "Real-time" },
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
