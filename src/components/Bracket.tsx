"use client";

interface TeamRow {
  name: string;
  flag: string;
  isWinner?: boolean;
}

interface Round {
  label: string;
  date: string;
  matches: [TeamRow, TeamRow][];
}

// Predicted AI bracket based on FIFA rankings & championship odds
const ROUNDS: Round[] = [
  {
    label: "Quarter Finals",
    date: "Jul 4–7, 2026",
    matches: [
      [{ name: "TBD", flag: "" }, { name: "TBD", flag: "" }],
      [{ name: "TBD", flag: "" }, { name: "TBD", flag: "" }],
      [{ name: "TBD", flag: "" }, { name: "TBD", flag: "" }],
      [{ name: "TBD", flag: "" }, { name: "TBD", flag: "" }],
    ],
  },
  {
    label: "Semi Finals",
    date: "Jul 11–12, 2026",
    matches: [
      [{ name: "TBD", flag: "" }, { name: "TBD", flag: "" }],
      [{ name: "TBD", flag: "" }, { name: "TBD", flag: "" }],
    ],
  },
  {
    label: "Final",
    date: "Jul 19, 2026 · MetLife",
    matches: [
      [{ name: "TBD", flag: "" }, { name: "TBD", flag: "" }],
    ],
  },
];

function BracketRow({ team }: { team: TeamRow }) {
  return (
    <div
      className="bracket-row"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 16px",
      }}
    >
      <span style={{ fontSize: 18 }}>{team.flag}</span>
      <span
        className="label-xs"
        style={{
          fontSize: 11,
          letterSpacing: "1.5px",
          color: team.isWinner ? "#C9A84C" : "#9A9080",
          fontWeight: team.isWinner ? 600 : 400,
        }}
      >
        {team.name}
      </span>
      {team.isWinner && (
        <span style={{ marginLeft: "auto", color: "#C9A84C", fontSize: 12 }}>✦</span>
      )}
    </div>
  );
}

function BracketMatch({ match }: { match: [TeamRow, TeamRow] }) {
  return (
    <div
      style={{
        background: "#111111",
        border: "1px solid #252525",
        borderRadius: 2,
        overflow: "hidden",
        marginBottom: 12,
        position: "relative",
      }}
    >
      {/* Gold left accent on winner side */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: "50%",
          width: 2,
          background: match[0].isWinner ? "#C9A84C" : "transparent",
        }}
      />
      <BracketRow team={match[0]} />
      <div style={{ height: 1, background: "#1E1E1E" }} />
      <BracketRow team={match[1]} />
    </div>
  );
}

export default function Bracket() {
  return (
    <section
      id="bracket"
      style={{ background: "#0D0D0D", padding: "100px 0", borderTop: "1px solid #252525" }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 40px" }}>
        <div style={{ marginBottom: 12 }}>
          <div className="eyebrow" style={{ marginBottom: 16 }}>Tournament Structure</div>
          <h2 className="section-title">Knockout <em>Bracket</em></h2>
        </div>

        {/* Format note */}
        <div style={{
          marginBottom: 40,
          padding: "14px 20px",
          background: "rgba(201,168,76,0.04)",
          border: "1px solid rgba(201,168,76,0.15)",
          borderRadius: 2,
          display: "flex",
          gap: 32,
          flexWrap: "wrap",
        }}>
          {[
            { label: "Format", val: "Round of 32 → R16 → QF → SF → Final" },
            { label: "Qualifiers", val: "Top 2 per group + Best 8 third-place (32 total)" },
            { label: "If Tied", val: "30 min Extra Time → Penalty Shootout" },
          ].map((item) => (
            <div key={item.label}>
              <span className="label-xs" style={{ color: "#5A5248" }}>{item.label}: </span>
              <span className="label-xs" style={{ color: "#9A9080" }}>{item.val}</span>
            </div>
          ))}
        </div>

        <div style={{ overflowX: "auto", paddingBottom: 24 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${ROUNDS.length}, minmax(240px, 1fr))`,
              gap: 32,
              minWidth: 720,
              alignItems: "center",
            }}
          >
            {ROUNDS.map((round, ri) => (
              <div key={ri}>
                {/* Round label */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    marginBottom: 24,
                    paddingBottom: 12,
                    borderBottom: "1px solid #252525",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 1, height: 16, background: "#C9A84C", opacity: 0.6 }} />
                    <span
                      className="font-display"
                      style={{ fontSize: 16, color: "#C9A84C", letterSpacing: "0.1em" }}
                    >
                      {round.label}
                    </span>
                  </div>
                  <span className="label-xs" style={{ color: "#5A5248", paddingLeft: 11 }}>{round.date}</span>
                </div>

                {/* Matches */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: ri === 2 ? 0 : 12,
                  }}
                >
                  {round.matches.map((match, mi) => (
                    <BracketMatch key={mi} match={match} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Champion callout */}
        <div
          style={{
            marginTop: 48,
            padding: "32px 40px",
            background: "#0A0A0A",
            border: "1px solid rgba(201,168,76,0.3)",
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            gap: 24,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse at left center, rgba(201,168,76,0.05) 0%, transparent 60%)",
            }}
          />
          <div className="corner-ornament top-left" />
          <div className="corner-ornament top-right" />
          <div style={{ fontSize: 48, position: "relative" }}>🇫🇷</div>
          <div style={{ position: "relative" }}>
            <div className="label-xs" style={{ color: "#C9A84C", marginBottom: 4 }}>
              AI Predicted Champion · 2026 · FIFA Rank #1
            </div>
            <div
              className="font-display"
              style={{ fontSize: 36, color: "#E8E0D0", letterSpacing: "0.1em" }}
            >
              FRANCE
            </div>
            <div className="label-xs" style={{ color: "#5A5248", marginTop: 4 }}>
              28.6% Championship Probability · Odds 3.50 · Winners 1998, 2018
            </div>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right", position: "relative" }}>
            <div style={{ display: "flex", gap: 24 }}>
              {[
                { team: "Brazil 🇧🇷",    pct: "23.8%", rank: "#6" },
                { team: "Argentina 🇦🇷", pct: "20.8%", rank: "#3" },
                { team: "Spain 🇪🇸",     pct: "18.2%", rank: "#2" },
              ].map((c) => (
                <div key={c.team} style={{ textAlign: "center" }}>
                  <div className="font-display" style={{ fontSize: 16, color: "#9A9080" }}>{c.pct}</div>
                  <div className="label-xs" style={{ color: "#5A5248", marginTop: 2 }}>{c.team}</div>
                  <div className="label-xs" style={{ color: "#5A5248" }}>{c.rank}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
