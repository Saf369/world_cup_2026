"use client";
import { useBracket } from "./BracketProvider";

const STAGES = [
  { key: "groups",   label: "Group Stage",    step: "01" },
  { key: "r32",      label: "Round of 32",    step: "02" },
  { key: "r16",      label: "Round of 16",    step: "03" },
  { key: "qf",       label: "Quarter-Finals", step: "04" },
  { key: "sf",       label: "Semi-Finals",    step: "05" },
  { key: "final",    label: "The Final",      step: "06" },
  { key: "champion", label: "Your Champion",  step: "07" },
];

export default function Sidebar() {
  const { activeStage, setActiveStage, predictions, progressPct } = useBracket();
  const completed = predictions.completedStages;

  // A stage is unlocked if all previous stages are complete
  const isUnlocked = (stageIdx: number) => {
    if (stageIdx === 0) return true;
    const prevKey = STAGES[stageIdx - 1].key;
    return completed.includes(prevKey);
  };

  return (
    <aside
      className="bracket-sidebar"
      style={{
        width: 240,
        minHeight: "100vh",
        background: "#0D0D0D",
        borderRight: "1px solid #252525",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100vh",
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div style={{ padding: "28px 24px 20px", borderBottom: "1px solid #252525" }}>
        <div
          className="font-display"
          style={{ fontSize: 20, color: "#C9A84C", letterSpacing: "4px", marginBottom: 4 }}
        >
          MY BRACKET
        </div>
        <div className="label-xs" style={{ color: "#5A5248", fontSize: 8, letterSpacing: "2.5px" }}>
          FIFA WORLD CUP 2026
        </div>
      </div>

      {/* Stage list */}
      <nav style={{ flex: 1, padding: "16px 0", overflowY: "auto" }}>
        {STAGES.map((stage, idx) => {
          const isActive    = activeStage === idx;
          const isComplete  = completed.includes(stage.key);
          const unlocked    = isUnlocked(idx);
          const isLocked    = !unlocked && !isComplete;

          return (
            <button
              key={stage.key}
              onClick={() => {
                if (isLocked) return;
                setActiveStage(idx);
              }}
              title={isLocked ? "Complete previous stage to unlock" : undefined}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 24px",
                background: isActive ? "rgba(201,168,76,0.06)" : "transparent",
                borderLeft: isActive ? "2px solid #C9A84C" : "2px solid transparent",
                border: "none",
                cursor: isLocked ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                textAlign: "left",
              }}
              onMouseEnter={(e) => {
                if (!isActive && !isLocked)
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,168,76,0.03)";
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              {/* Step circle */}
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  border: `1px solid ${isComplete ? "#C9A84C" : isActive ? "#C9A84C" : "#252525"}`,
                  background: isComplete ? "#C9A84C" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.3s ease",
                }}
              >
                {isComplete ? (
                  <span style={{ fontSize: 11, color: "#050505", fontWeight: 700 }}>✓</span>
                ) : isLocked ? (
                  <span style={{ fontSize: 10 }}>🔒</span>
                ) : (
                  <span
                    className="font-display"
                    style={{ fontSize: 10, color: isActive ? "#C9A84C" : "#5A5248", letterSpacing: "0.05em" }}
                  >
                    {stage.step}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className="label-xs"
                style={{
                  fontSize: 9,
                  letterSpacing: "1.8px",
                  color: isActive ? "#C9A84C" : isComplete ? "#E8E0D0" : isLocked ? "#3A3530" : "#9A9080",
                  transition: "color 0.2s ease",
                }}
              >
                {stage.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Progress bar */}
      <div style={{ padding: "20px 24px", borderTop: "1px solid #252525" }}>
        <div
          className="label-xs"
          style={{ color: "#C9A84C", fontSize: 8, letterSpacing: "3px", marginBottom: 10 }}
        >
          PREDICTION COMPLETE
        </div>
        <div className="bracket-progress-bar">
          <div
            className="bracket-progress-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div
          className="font-display"
          style={{ fontSize: 22, color: "#C9A84C", marginTop: 8, letterSpacing: "0.05em" }}
        >
          {progressPct}%
        </div>
      </div>
    </aside>
  );
}
