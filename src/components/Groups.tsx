"use client";

interface Team {
  name: string; flag: string; played: number;
  won: number; drawn: number; lost: number;
  gf: number; ga: number; pts: number; isTop?: boolean;
}

interface Group { label: string; teams: Team[]; }

const GROUPS: Group[] = [
  {
    label: "Group A",
    teams: [
      { name: "ARGENTINA", flag: "🇦🇷", played: 3, won: 3, drawn: 0, lost: 0, gf: 7, ga: 2, pts: 9, isTop: true },
      { name: "POLAND",    flag: "🇵🇱", played: 3, won: 1, drawn: 1, lost: 1, gf: 4, ga: 3, pts: 4, isTop: true },
      { name: "MEXICO",    flag: "🇲🇽", played: 3, won: 1, drawn: 0, lost: 2, gf: 2, ga: 4, pts: 3 },
      { name: "SAUDI ARABIA", flag: "🇸🇦", played: 3, won: 1, drawn: 0, lost: 2, gf: 3, ga: 7, pts: 3 },
    ],
  },
  {
    label: "Group B",
    teams: [
      { name: "FRANCE",  flag: "🇫🇷", played: 3, won: 2, drawn: 1, lost: 0, gf: 6, ga: 2, pts: 7, isTop: true },
      { name: "DENMARK", flag: "🇩🇰", played: 3, won: 1, drawn: 1, lost: 1, gf: 3, ga: 3, pts: 4, isTop: true },
      { name: "TUNISIA", flag: "🇹🇳", played: 3, won: 1, drawn: 0, lost: 2, gf: 2, ga: 4, pts: 3 },
      { name: "AUSTRALIA", flag: "🇦🇺", played: 3, won: 0, drawn: 1, lost: 2, gf: 1, ga: 3, pts: 1 },
    ],
  },
  {
    label: "Group C",
    teams: [
      { name: "SPAIN",    flag: "🇪🇸", played: 3, won: 3, drawn: 0, lost: 0, gf: 8, ga: 1, pts: 9, isTop: true },
      { name: "GERMANY",  flag: "🇩🇪", played: 3, won: 2, drawn: 0, lost: 1, gf: 5, ga: 3, pts: 6, isTop: true },
      { name: "JAPAN",    flag: "🇯🇵", played: 3, won: 1, drawn: 0, lost: 2, gf: 4, ga: 5, pts: 3 },
      { name: "COSTA RICA", flag: "🇨🇷", played: 3, won: 0, drawn: 0, lost: 3, gf: 1, ga: 9, pts: 0 },
    ],
  },
  {
    label: "Group D",
    teams: [
      { name: "BRAZIL",  flag: "🇧🇷", played: 3, won: 2, drawn: 0, lost: 1, gf: 5, ga: 3, pts: 6, isTop: true },
      { name: "PORTUGAL",flag: "🇵🇹", played: 3, won: 2, drawn: 0, lost: 1, gf: 6, ga: 4, pts: 6, isTop: true },
      { name: "GHANA",   flag: "🇬🇭", played: 3, won: 1, drawn: 0, lost: 2, gf: 4, ga: 5, pts: 3 },
      { name: "URUGUAY", flag: "🇺🇾", played: 3, won: 1, drawn: 0, lost: 2, gf: 2, ga: 5, pts: 3 },
    ],
  },
];

const COL_HEADERS = ["", "P", "W", "D", "L", "GF", "GA", "GD", "PTS"];

function GroupCard({ group }: { group: Group }) {
  return (
    <div
      className="panel"
      style={{ position: "relative", overflow: "hidden" }}
    >
      <div className="corner-ornament top-left" />
      <div className="corner-ornament top-right" />

      {/* Group label */}
      <div
        style={{
          padding: "16px 20px 12px",
          borderBottom: "1px solid #252525",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div style={{ width: 2, height: 16, background: "#C9A84C" }} />
        <span
          className="font-display"
          style={{ fontSize: 16, color: "#C9A84C", letterSpacing: "0.12em" }}
        >
          {group.label}
        </span>
      </div>

      {/* Column headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 28px 28px 28px 28px 28px 28px 28px 36px",
          padding: "8px 16px",
          borderBottom: "1px solid #1E1E1E",
        }}
      >
        {COL_HEADERS.map((h, i) => (
          <span
            key={i}
            className="label-xs"
            style={{ textAlign: i === 0 ? "left" : "center", color: "#5A5248" }}
          >
            {h}
          </span>
        ))}
      </div>

      {/* Teams */}
      {group.teams.map((team, i) => (
        <div
          key={i}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 28px 28px 28px 28px 28px 28px 28px 36px",
            padding: "10px 16px",
            borderBottom: i < group.teams.length - 1 ? "1px solid #1A1A1A" : "none",
            alignItems: "center",
            background: team.isTop ? "rgba(201,168,76,0.02)" : "transparent",
            transition: "background 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(201,168,76,0.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = team.isTop ? "rgba(201,168,76,0.02)" : "transparent")}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Qualification indicator */}
            <div
              style={{
                width: 2,
                height: 14,
                background: team.isTop ? "#C9A84C" : "#252525",
                borderRadius: 1,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 14 }}>{team.flag}</span>
            <span
              className="label-xs"
              style={{
                fontSize: 10,
                color: team.isTop ? "#E8E0D0" : "#9A9080",
                letterSpacing: "1px",
              }}
            >
              {team.name}
            </span>
          </div>
          {[team.played, team.won, team.drawn, team.lost, team.gf, team.ga, team.gf - team.ga].map((v, j) => (
            <span
              key={j}
              className="label-xs"
              style={{ textAlign: "center", color: "#5A5248", fontSize: 10 }}
            >
              {v > 0 ? `+${v}` : v}
            </span>
          ))}
          <span
            className="font-display"
            style={{
              textAlign: "center",
              fontSize: 14,
              color: team.isTop ? "#C9A84C" : "#9A9080",
              letterSpacing: "0.05em",
            }}
          >
            {team.pts}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Groups() {
  return (
    <section
      id="groups"
      style={{ background: "#050505", padding: "100px 0", borderTop: "1px solid #252525" }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 40px" }}>
        <div style={{ marginBottom: 48 }}>
          <div className="eyebrow" style={{ marginBottom: 16 }}>Stage One</div>
          <h2 className="section-title">Group <em>Tables</em></h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 24,
          }}
        >
          {GROUPS.map((group, i) => (
            <GroupCard key={i} group={group} />
          ))}
        </div>
      </div>
    </section>
  );
}
