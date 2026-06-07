"use client";

interface Scorer {
  rank: number;
  name: string;
  country: string;
  flag: string;
  goals: number;
  assists: number;
  mins: number;
  ratio: number; // goals per 90 — projected
  odds: string;  // top scorer odds
}

// Pre-tournament top scorer predictions based on form, squad role & odds
const SCORERS: Scorer[] = [
  { rank: 1,  name: "TBD", country: "TBD", flag: "", goals: 0, assists: 0, mins: 0, ratio: 0.00, odds: "TBD" },
  { rank: 2,  name: "TBD", country: "TBD", flag: "", goals: 0, assists: 0, mins: 0, ratio: 0.00, odds: "TBD" },
  { rank: 3,  name: "TBD", country: "TBD", flag: "", goals: 0, assists: 0, mins: 0, ratio: 0.00, odds: "TBD" },
  { rank: 4,  name: "TBD", country: "TBD", flag: "", goals: 0, assists: 0, mins: 0, ratio: 0.00, odds: "TBD" },
  { rank: 5,  name: "TBD", country: "TBD", flag: "", goals: 0, assists: 0, mins: 0, ratio: 0.00, odds: "TBD" },
  { rank: 6,  name: "TBD", country: "TBD", flag: "", goals: 0, assists: 0, mins: 0, ratio: 0.00, odds: "TBD" },
  { rank: 7,  name: "TBD", country: "TBD", flag: "", goals: 0, assists: 0, mins: 0, ratio: 0.00, odds: "TBD" },
  { rank: 8,  name: "TBD", country: "TBD", flag: "", goals: 0, assists: 0, mins: 0, ratio: 0.00, odds: "TBD" },
  { rank: 9,  name: "TBD", country: "TBD", flag: "", goals: 0, assists: 0, mins: 0, ratio: 0.00, odds: "TBD" },
  { rank: 10, name: "TBD", country: "TBD", flag: "", goals: 0, assists: 0, mins: 0, ratio: 0.00, odds: "TBD" },
];

function ScorerRow({ scorer }: { scorer: Scorer }) {
  return (
    <div
      className="scorer-row"
      style={{
        display: "grid",
        gridTemplateColumns: "32px 1fr 72px 72px 72px 72px",
        alignItems: "center",
        gap: 16,
        padding: "16px 20px 16px 24px",
        cursor: "default",
      }}
    >
      <span
        className="font-display"
        style={{ fontSize: 18, color: scorer.rank <= 3 ? "#C9A84C" : "#5A5248", letterSpacing: "0.05em" }}
      >
        {String(scorer.rank).padStart(2, "0")}
      </span>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 20 }}>{scorer.flag}</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: "#E8E0D0", letterSpacing: "0.5px" }}>{scorer.name}</div>
          <div className="label-xs" style={{ color: "#5A5248", marginTop: 2 }}>{scorer.country}</div>
        </div>
      </div>

      {/* Projected P90 */}
      <div style={{ textAlign: "center" }}>
        <div className="font-display" style={{ fontSize: 22, color: "#C9A84C", letterSpacing: "0.05em" }}>
          {scorer.ratio.toFixed(2)}
        </div>
        <div className="label-xs" style={{ color: "#5A5248" }}>Proj. P90</div>
      </div>

      {/* Goals (live) */}
      <div style={{ textAlign: "center" }}>
        <div className="font-display" style={{ fontSize: 22, color: "#9A9080", letterSpacing: "0.05em" }}>
          {scorer.goals}
        </div>
        <div className="label-xs" style={{ color: "#5A5248" }}>Goals</div>
      </div>

      {/* Assists */}
      <div style={{ textAlign: "center" }}>
        <div className="font-display" style={{ fontSize: 22, color: "#9A9080", letterSpacing: "0.05em" }}>
          {scorer.assists}
        </div>
        <div className="label-xs" style={{ color: "#5A5248" }}>Assists</div>
      </div>

      {/* Top scorer odds */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 13, color: "#9A9080", fontWeight: 500 }}>{scorer.odds}</div>
        <div className="label-xs" style={{ color: "#5A5248" }}>Top Scorer</div>
      </div>
    </div>
  );
}

export default function TopScorers() {
  return (
    <section
      id="scorers"
      style={{ background: "#0D0D0D", padding: "100px 0", borderTop: "1px solid #252525" }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 40px" }}>
        <div style={{ marginBottom: 16 }}>
          <div className="eyebrow" style={{ marginBottom: 16 }}>Player Rankings · Pre-Tournament Projections</div>
          <h2 className="section-title">Top <em>Scorers</em></h2>
        </div>

        {/* Note */}
        <div style={{ marginBottom: 32, padding: "12px 20px", background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.12)", borderRadius: 2 }}>
          <span className="label-xs" style={{ color: "#5A5248" }}>
            Tournament begins Jun 11, 2026 · Squads confirmed Jun 2, 2026 · 26 players per nation · Statistics update live
          </span>
        </div>

        <div className="panel" style={{ overflow: "hidden", position: "relative" }}>
          <div className="corner-ornament top-left" />
          <div className="corner-ornament top-right" />

          {/* Table header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "32px 1fr 72px 72px 72px 72px",
              alignItems: "center",
              gap: 16,
              padding: "12px 20px 12px 24px",
              borderBottom: "1px solid #252525",
              background: "#0D0D0D",
            }}
          >
            <span className="label-xs">#</span>
            <span className="label-xs">Player</span>
            <span className="label-xs" style={{ textAlign: "center" }}>Proj. P90</span>
            <span className="label-xs" style={{ textAlign: "center" }}>Goals</span>
            <span className="label-xs" style={{ textAlign: "center" }}>Assists</span>
            <span className="label-xs" style={{ textAlign: "center" }}>Odds</span>
          </div>

          {SCORERS.map((scorer) => (
            <ScorerRow key={scorer.rank} scorer={scorer} />
          ))}
        </div>

        {/* Championship odds reference */}
        <div style={{ marginTop: 48 }}>
          <div className="eyebrow" style={{ marginBottom: 24 }}>Championship Odds Reference</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
            {[
              { team: "France 🇫🇷",      odds: "3.50", prob: "28.6%", rank: "#1" },
              { team: "Brazil 🇧🇷",       odds: "4.20", prob: "23.8%", rank: "#6" },
              { team: "Argentina 🇦🇷",    odds: "4.80", prob: "20.8%", rank: "#3" },
              { team: "Spain 🇪🇸",        odds: "5.50", prob: "18.2%", rank: "#2" },
              { team: "England 🏴󠁧󠁢󠁥󠁮󠁧󠁿",     odds: "6.00", prob: "16.7%", rank: "#4" },
              { team: "Germany 🇩🇪",      odds: "7.00", prob: "14.3%", rank: "#9" },
            ].map((c) => (
              <div key={c.team} style={{ background: "#111111", border: "1px solid #252525", borderRadius: 2, padding: "16px", textAlign: "center" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#252525")}
              >
                <div className="label-xs" style={{ color: "#5A5248", marginBottom: 4 }}>{c.rank}</div>
                <div style={{ fontSize: 12, color: "#E8E0D0", fontWeight: 500, marginBottom: 4 }}>{c.team}</div>
                <div className="font-display" style={{ fontSize: 20, color: "#C9A84C" }}>{c.odds}</div>
                <div className="label-xs" style={{ color: "#5A5248", marginTop: 4 }}>{c.prob} implied</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
