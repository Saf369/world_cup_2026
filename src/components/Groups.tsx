"use client";
import { useState } from "react";

interface Team {
  name: string; flag: string; played: number;
  won: number; drawn: number; lost: number;
  gf: number; ga: number; pts: number; isTop?: boolean; rank: number;
}
interface Group { label: string; host?: string; teams: Team[]; }

const GROUPS: Group[] = [
  { label: "Group A", host: "Mexico", teams: [
    { name: "MEXICO",       flag: "🇲🇽", rank: 15, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0,isTop:true },
    { name: "SOUTH KOREA",  flag: "🇰🇷", rank: 16, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0,isTop:true },
    { name: "SOUTH AFRICA", flag: "🇿🇦", rank: 33, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0 },
    { name: "CZECHIA",      flag: "🇨🇿", rank: 37, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0 },
  ]},
  { label: "Group B", host: "Canada", teams: [
    { name: "CANADA",       flag: "🇨🇦", rank: 11, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0,isTop:true },
    { name: "SWITZERLAND",  flag: "🇨🇭", rank: 17, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0,isTop:true },
    { name: "BOSNIA-HERZ.", flag: "🇧🇦", rank: 38, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0 },
    { name: "QATAR",        flag: "🇶🇦", rank: 39, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0 },
  ]},
  { label: "Group C", teams: [
    { name: "BRAZIL",       flag: "🇧🇷", rank:  6, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0,isTop:true },
    { name: "MOROCCO",      flag: "🇲🇦", rank: 13, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0,isTop:true },
    { name: "SCOTLAND",     flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", rank: 31, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0 },
    { name: "HAITI",        flag: "🇭🇹", rank: 47, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0 },
  ]},
  { label: "Group D", host: "USA", teams: [
    { name: "USA",          flag: "🇺🇸", rank: 11, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0,isTop:true },
    { name: "AUSTRALIA",    flag: "🇦🇺", rank: 20, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0,isTop:true },
    { name: "TÜRKIYE",      flag: "🇹🇷", rank: 23, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0 },
    { name: "PARAGUAY",     flag: "🇵🇾", rank: 25, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0 },
  ]},
  { label: "Group E", teams: [
    { name: "GERMANY",      flag: "🇩🇪", rank:  9, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0,isTop:true },
    { name: "ECUADOR",      flag: "🇪🇨", rank: 22, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0,isTop:true },
    { name: "IVORY COAST",  flag: "🇨🇮", rank: 32, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0 },
    { name: "CURAÇAO",      flag: "🇨🇼", rank: 46, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0 },
  ]},
  { label: "Group F", teams: [
    { name: "NETHERLANDS",  flag: "🇳🇱", rank:  7, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0,isTop:true },
    { name: "JAPAN",        flag: "🇯🇵", rank: 12, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0,isTop:true },
    { name: "SWEDEN",       flag: "🇸🇪", rank: 26, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0 },
    { name: "TUNISIA",      flag: "🇹🇳", rank: 27, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0 },
  ]},
  { label: "Group G", teams: [
    { name: "BELGIUM",      flag: "🇧🇪", rank:  8, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0,isTop:true },
    { name: "IRAN",         flag: "🇮🇷", rank: 28, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0,isTop:true },
    { name: "EGYPT",        flag: "🇪🇬", rank: 29, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0 },
    { name: "NEW ZEALAND",  flag: "🇳🇿", rank: 41, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0 },
  ]},
  { label: "Group H", teams: [
    { name: "SPAIN",        flag: "🇪🇸", rank:  2, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0,isTop:true },
    { name: "URUGUAY",      flag: "🇺🇾", rank: 10, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0,isTop:true },
    { name: "SAUDI ARABIA", flag: "🇸🇦", rank: 35, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0 },
    { name: "CAPE VERDE",   flag: "🇨🇻", rank: 45, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0 },
  ]},
  { label: "Group I", teams: [
    { name: "FRANCE",       flag: "🇫🇷", rank:  1, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0,isTop:true },
    { name: "SENEGAL",      flag: "🇸🇳", rank: 18, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0,isTop:true },
    { name: "NORWAY",       flag: "🇳🇴", rank: 21, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0 },
    { name: "IRAQ",         flag: "🇮🇶", rank: 40, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0 },
  ]},
  { label: "Group J", teams: [
    { name: "ARGENTINA",    flag: "🇦🇷", rank:  3, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0,isTop:true },
    { name: "AUSTRIA",      flag: "🇦🇹", rank: 19, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0,isTop:true },
    { name: "ALGERIA",      flag: "🇩🇿", rank: 30, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0 },
    { name: "JORDAN",       flag: "🇯🇴", rank: 36, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0 },
  ]},
  { label: "Group K", teams: [
    { name: "PORTUGAL",     flag: "🇵🇹", rank:  5, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0,isTop:true },
    { name: "COLOMBIA",     flag: "🇨🇴", rank: 24, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0,isTop:true },
    { name: "DR CONGO",     flag: "🇨🇩", rank: 42, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0 },
    { name: "UZBEKISTAN",   flag: "🇺🇿", rank: 43, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0 },
  ]},
  { label: "Group L", teams: [
    { name: "ENGLAND",      flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", rank:  4, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0,isTop:true },
    { name: "CROATIA",      flag: "🇭🇷", rank: 14, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0,isTop:true },
    { name: "GHANA",        flag: "🇬🇭", rank: 34, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0 },
    { name: "PANAMA",       flag: "🇵🇦", rank: 44, played:0,won:0,drawn:0,lost:0,gf:0,ga:0,pts:0 },
  ]},
];

const COL_HEADERS = ["", "P", "W", "D", "L", "GF", "GA", "GD", "PTS"];

function GroupCard({ group }: { group: Group }) {
  return (
    <div className="panel" style={{ position: "relative", overflow: "hidden" }}>
      <div className="corner-ornament top-left" />
      <div className="corner-ornament top-right" />
      <div style={{ padding: "14px 20px 10px", borderBottom: "1px solid #252525", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 2, height: 16, background: "#C9A84C" }} />
          <span className="font-display" style={{ fontSize: 16, color: "#C9A84C", letterSpacing: "0.12em" }}>{group.label}</span>
        </div>
        {group.host && <span className="label-xs" style={{ color: "#5A5248", fontSize: 8 }}>Host: {group.host}</span>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 24px 24px 24px 24px 24px 24px 24px 32px", padding: "8px 16px", borderBottom: "1px solid #1E1E1E" }}>
        {COL_HEADERS.map((h, i) => (
          <span key={i} className="label-xs" style={{ textAlign: i === 0 ? "left" : "center", color: "#5A5248", fontSize: 8 }}>{h}</span>
        ))}
      </div>
      {group.teams.map((team, i) => (
        <div
          key={i}
          style={{ display: "grid", gridTemplateColumns: "1fr 24px 24px 24px 24px 24px 24px 24px 32px", padding: "10px 16px", borderBottom: i < group.teams.length - 1 ? "1px solid #1A1A1A" : "none", alignItems: "center", background: team.isTop ? "rgba(201,168,76,0.02)" : "transparent", transition: "background 0.2s ease" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(201,168,76,0.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = team.isTop ? "rgba(201,168,76,0.02)" : "transparent")}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 2, height: 14, background: team.isTop ? "#C9A84C" : "#252525", borderRadius: 1, flexShrink: 0 }} />
            <span style={{ fontSize: 14 }}>{team.flag}</span>
            <div>
              <span className="label-xs" style={{ fontSize: 9, color: team.isTop ? "#E8E0D0" : "#9A9080", letterSpacing: "1px", display: "block" }}>{team.name}</span>
              <span className="label-xs" style={{ fontSize: 7, color: "#5A5248" }}>#{team.rank}</span>
            </div>
          </div>
          {[team.played, team.won, team.drawn, team.lost, team.gf, team.ga, team.gf - team.ga].map((v, j) => (
            <span key={j} className="label-xs" style={{ textAlign: "center", color: "#5A5248", fontSize: 10 }}>
              {v === 0 ? "—" : v > 0 && j === 6 ? `+${v}` : v}
            </span>
          ))}
          <span className="font-display" style={{ textAlign: "center", fontSize: 14, color: team.isTop ? "#C9A84C" : "#9A9080", letterSpacing: "0.05em" }}>
            {team.pts === 0 ? "—" : team.pts}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Groups() {
  const [visibleGroups, setVisibleGroups] = useState(4);
  return (
    <section id="groups" style={{ background: "#050505", padding: "100px 0", borderTop: "1px solid #252525" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 40px" }}>
        <div style={{ marginBottom: 16 }}>
          <div className="eyebrow" style={{ marginBottom: 16 }}>Stage One · 48 Teams · 12 Groups A–L</div>
          <h2 className="section-title">Group <em>Tables</em></h2>
        </div>
        <div style={{ marginBottom: 32, display: "flex", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 2, height: 14, background: "#C9A84C", borderRadius: 1 }} />
            <span className="label-xs" style={{ color: "#9A9080", fontSize: 9 }}>Projected qualification (Top 2 + Best 8 third-place = 32 advance)</span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
          {GROUPS.slice(0, visibleGroups).map((group, i) => <GroupCard key={i} group={group} />)}
        </div>
        <div style={{ textAlign: "center", marginTop: 32, display: "flex", gap: 12, justifyContent: "center" }}>
          {visibleGroups < GROUPS.length && (
            <button className="btn-outline" onClick={() => setVisibleGroups(Math.min(visibleGroups + 4, GROUPS.length))}>
              Show More Groups ({GROUPS.length - visibleGroups} remaining)
            </button>
          )}
          {visibleGroups > 4 && (
            <button className="btn-outline" onClick={() => setVisibleGroups(4)}>Show Less</button>
          )}
        </div>
      </div>
    </section>
  );
}
