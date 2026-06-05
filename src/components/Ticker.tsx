"use client";

const TICKER_ITEMS = [
  { label: "ARGENTINA", score: "3 — 1", vs: "FRANCE",   status: "FT",  live: false },
  { label: "SPAIN",     score: "2 — 0", vs: "GERMANY",  status: "FT",  live: false },
  { label: "BRAZIL",    score: "1 — ",  vs: "PORTUGAL", status: "67′", live: true  },
  { label: "ENGLAND",   score: "0 — 0", vs: "NETHERLANDS", status: "45′", live: true },
  { label: "MOROCCO",   score: "2 — 1", vs: "SENEGAL",  status: "FT",  live: false },
  { label: "USA",       score: "1 — 2", vs: "MEXICO",   status: "FT",  live: false },
  { label: "JAPAN",     score: "3 — 0", vs: "CROATIA",  status: "FT",  live: false },
  { label: "COLOMBIA",  score: "0 — ",  vs: "ECUADOR",  status: "12′", live: true  },
];

// Duplicate for seamless loop
const ITEMS = [...TICKER_ITEMS, ...TICKER_ITEMS];

export default function Ticker() {
  return (
    <div
      id="ticker"
      style={{
        background: "#0D0D0D",
        borderBottom: "1px solid #252525",
        overflow: "hidden",
        position: "relative",
        height: 40,
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Gold left label */}
      <div
        style={{
          flexShrink: 0,
          width: 120,
          height: "100%",
          background: "#C9A84C",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
        }}
      >
        <span
          className="font-display"
          style={{ fontSize: 12, color: "#050505", letterSpacing: "0.15em" }}
        >
          LIVE
        </span>
      </div>

      {/* Scrolling track */}
      <div style={{ overflow: "hidden", flex: 1, position: "relative" }}>
        <div className="ticker-track" style={{ display: "flex", gap: 0 }}>
          {ITEMS.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "0 32px",
                borderRight: "1px solid #252525",
                height: 40,
                flexShrink: 0,
              }}
            >
              {item.live && (
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#C9A84C",
                    boxShadow: "0 0 6px rgba(201,168,76,0.8)",
                    flexShrink: 0,
                    animation: "pulse 1.5s ease-in-out infinite",
                  }}
                />
              )}
              <span
                className="label-xs"
                style={{ color: "#E8E0D0", letterSpacing: "1.5px", fontSize: 10 }}
              >
                {item.label}
              </span>
              <span
                className="font-display"
                style={{ fontSize: 14, color: "#C9A84C", letterSpacing: "0.1em" }}
              >
                {item.score}
              </span>
              <span
                className="label-xs"
                style={{ color: "#E8E0D0", letterSpacing: "1.5px", fontSize: 10 }}
              >
                {item.vs}
              </span>
              <span
                className="label-xs"
                style={{
                  color: item.live ? "#C9A84C" : "#5A5248",
                  fontSize: 9,
                  marginLeft: 4,
                }}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Fade-out right edge */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 80,
          background:
            "linear-gradient(to right, transparent, #0D0D0D)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
