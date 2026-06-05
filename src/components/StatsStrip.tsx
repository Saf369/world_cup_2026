"use client";

const STATS = [
  { value: "48",   label: "Matches", suffix: "" },
  { value: "32",   label: "Nations", suffix: "" },
  { value: "16",   label: "Venues",  suffix: "" },
  { value: "5.2M", label: "Fans",    suffix: "+" },
  { value: "94",   label: "Goals",   suffix: "" },
  { value: "2.4",  label: "Avg Goals", suffix: "" },
];

export default function StatsStrip() {
  return (
    <section
      id="stats"
      style={{
        background: "#0D0D0D",
        borderBottom: "1px solid #252525",
        borderTop: "1px solid #252525",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 40px",
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: 0,
        }}
      >
        {STATS.map((stat, i) => (
          <div
            key={i}
            style={{
              padding: "28px 24px",
              borderRight: i < STATS.length - 1 ? "1px solid #252525" : "none",
              textAlign: "center",
              position: "relative",
            }}
          >
            {/* Subtle top gold accent */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: 24,
                height: 1,
                background: "#C9A84C",
                opacity: 0.5,
              }}
            />
            <div
              className="font-display"
              style={{
                fontSize: 36,
                letterSpacing: "0.05em",
                color: "#C9A84C",
                lineHeight: 1,
              }}
            >
              {stat.value}
              <span style={{ fontSize: 20, opacity: 0.7 }}>{stat.suffix}</span>
            </div>
            <div className="label-xs" style={{ marginTop: 6, color: "#5A5248" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
