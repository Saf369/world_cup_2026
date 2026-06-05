"use client";

interface Scorer {
  rank: number;
  name: string;
  country: string;
  flag: string;
  goals: number;
  assists: number;
  mins: number;
  ratio: number; // goals per 90
}

const SCORERS: Scorer[] = [
  { rank: 1,  name: "Kylian Mbappé",     country: "France",    flag: "🇫🇷", goals: 8, assists: 3, mins: 630, ratio: 1.14 },
  { rank: 2,  name: "Lionel Messi",      country: "Argentina", flag: "🇦🇷", goals: 7, assists: 6, mins: 658, ratio: 0.96 },
  { rank: 3,  name: "Vinícius Jr.",      country: "Brazil",    flag: "🇧🇷", goals: 6, assists: 4, mins: 612, ratio: 0.88 },
  { rank: 4,  name: "Lamine Yamal",      country: "Spain",     flag: "🇪🇸", goals: 5, assists: 5, mins: 579, ratio: 0.78 },
  { rank: 5,  name: "Erling Haaland",    country: "Norway",    flag: "🇳🇴", goals: 5, assists: 1, mins: 540, ratio: 0.83 },
  { rank: 6,  name: "Pedri",             country: "Spain",     flag: "🇪🇸", goals: 4, assists: 6, mins: 602, ratio: 0.60 },
  { rank: 7,  name: "Jude Bellingham",   country: "England",   flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", goals: 4, assists: 3, mins: 618, ratio: 0.58 },
  { rank: 8,  name: "Julián Álvarez",    country: "Argentina", flag: "🇦🇷", goals: 4, assists: 2, mins: 550, ratio: 0.65 },
  { rank: 9,  name: "Rafael Leão",       country: "Portugal",  flag: "🇵🇹", goals: 3, assists: 4, mins: 520, ratio: 0.52 },
  { rank: 10, name: "Rodri",             country: "Spain",     flag: "🇪🇸", goals: 3, assists: 2, mins: 598, ratio: 0.45 },
];

function ScorerRow({ scorer }: { scorer: Scorer }) {
  return (
    <div
      className="scorer-row"
      style={{
        display: "grid",
        gridTemplateColumns: "32px 1fr 64px 64px 64px 64px",
        alignItems: "center",
        gap: 16,
        padding: "16px 20px 16px 24px",
        cursor: "default",
      }}
    >
      {/* Rank */}
      <span
        className="font-display"
        style={{
          fontSize: 18,
          color: scorer.rank <= 3 ? "#C9A84C" : "#5A5248",
          letterSpacing: "0.05em",
        }}
      >
        {String(scorer.rank).padStart(2, "0")}
      </span>

      {/* Player */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 20 }}>{scorer.flag}</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: "#E8E0D0", letterSpacing: "0.5px" }}>
            {scorer.name}
          </div>
          <div className="label-xs" style={{ color: "#5A5248", marginTop: 2 }}>
            {scorer.country}
          </div>
        </div>
      </div>

      {/* Goals */}
      <div style={{ textAlign: "center" }}>
        <div
          className="font-display"
          style={{ fontSize: 22, color: "#C9A84C", letterSpacing: "0.05em" }}
        >
          {scorer.goals}
        </div>
        <div className="label-xs" style={{ color: "#5A5248" }}>Goals</div>
      </div>

      {/* Assists */}
      <div style={{ textAlign: "center" }}>
        <div
          className="font-display"
          style={{ fontSize: 22, color: "#9A9080", letterSpacing: "0.05em" }}
        >
          {scorer.assists}
        </div>
        <div className="label-xs" style={{ color: "#5A5248" }}>Assists</div>
      </div>

      {/* Mins */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 13, color: "#9A9080", fontWeight: 500 }}>
          {scorer.mins}′
        </div>
        <div className="label-xs" style={{ color: "#5A5248" }}>Mins</div>
      </div>

      {/* Per 90 */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 13, color: "#9A9080", fontWeight: 500 }}>
          {scorer.ratio.toFixed(2)}
        </div>
        <div className="label-xs" style={{ color: "#5A5248" }}>P90</div>
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
        <div style={{ marginBottom: 48 }}>
          <div className="eyebrow" style={{ marginBottom: 16 }}>Player Rankings</div>
          <h2 className="section-title">Top <em>Scorers</em></h2>
        </div>

        <div
          className="panel"
          style={{ overflow: "hidden", position: "relative" }}
        >
          <div className="corner-ornament top-left" />
          <div className="corner-ornament top-right" />

          {/* Table header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "32px 1fr 64px 64px 64px 64px",
              alignItems: "center",
              gap: 16,
              padding: "12px 20px 12px 24px",
              borderBottom: "1px solid #252525",
              background: "#0D0D0D",
            }}
          >
            <span className="label-xs">#</span>
            <span className="label-xs">Player</span>
            <span className="label-xs" style={{ textAlign: "center" }}>Goals</span>
            <span className="label-xs" style={{ textAlign: "center" }}>Assists</span>
            <span className="label-xs" style={{ textAlign: "center" }}>Mins</span>
            <span className="label-xs" style={{ textAlign: "center" }}>P90</span>
          </div>

          {SCORERS.map((scorer) => (
            <ScorerRow key={scorer.rank} scorer={scorer} />
          ))}
        </div>
      </div>
    </section>
  );
}
