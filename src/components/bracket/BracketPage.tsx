"use client";
import { useBracket } from "./BracketProvider";
import Sidebar from "./Sidebar";
import StageGroupStage from "./StageGroupStage";
import { StageR32, StageR16 } from "./StageKnockout";
import StageQF from "./StageQF";
import StageSF from "./StageSF";
import StageFinal from "./StageFinal";
import StageChampion from "./StageChampion";
import Link from "next/link";

const STAGE_COMPONENTS = [
  StageGroupStage,
  StageR32,
  StageR16,
  StageQF,
  StageSF,
  StageFinal,
  StageChampion,
];

export default function BracketPage() {
  const { activeStage } = useBracket();
  const ActiveStage = STAGE_COMPONENTS[activeStage] ?? StageGroupStage;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050505",
        display: "flex",
        fontFamily: "var(--font-ui)",
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div
        className="bracket-content"
        style={{
          flex: 1,
          minHeight: "100vh",
          overflowY: "auto",
        }}
      >
        {/* Top bar */}
        <div
          className="bracket-nav"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            background: "rgba(5,5,5,0.96)",
            borderBottom: "1px solid #252525",
            backdropFilter: "blur(16px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 40px",
            height: 56,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link
              href="/"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 18,
                color: "#C9A84C",
                letterSpacing: "0.12em",
                textDecoration: "none",
              }}
            >
              MUNDIAL
            </Link>
            <span style={{ color: "#252525" }}>›</span>
            <span className="label-xs" style={{ color: "#5A5248", fontSize: 9 }}>MY BRACKET</span>
          </div>
          <Link href="/" className="btn-outline" style={{ fontSize: 9, padding: "8px 16px" }}>
            ← Back to Home
          </Link>
        </div>

        {/* Stage area */}
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 40px" }}>
          <ActiveStage key={activeStage} />
        </div>
      </div>
    </div>
  );
}
