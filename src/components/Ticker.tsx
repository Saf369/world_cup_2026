"use client";

const TICKER_ITEMS = [
  // ET 3pm Jun 11  → IST 12:30 AM Jun 12
  { label: "MEXICO",      score: "— vs —", vs: "SOUTH AFRICA", status: "Jun 12, 12:30 AM", live: false, upcoming: true },
  // ET 3pm Jun 12  → IST 12:30 AM Jun 13
  { label: "CANADA",      score: "— vs —", vs: "BOSNIA-HERZ.", status: "Jun 13, 12:30 AM", live: false, upcoming: true },
  // ET 9pm Jun 12  → IST 6:30 AM Jun 13
  { label: "USA",         score: "— vs —", vs: "PARAGUAY",     status: "Jun 13, 6:30 AM",  live: false, upcoming: true },
  // ET 6pm Jun 13  → IST 3:30 AM Jun 14
  { label: "BRAZIL",      score: "— vs —", vs: "MOROCCO",      status: "Jun 14, 3:30 AM",  live: false, upcoming: true },
  // ET 1pm Jun 14  → IST 10:30 PM Jun 14
  { label: "GERMANY",     score: "— vs —", vs: "CURAÇAO",      status: "Jun 14, 10:30 PM", live: false, upcoming: true },
  // ET 4pm Jun 14  → IST 1:30 AM Jun 15
  { label: "NETHERLANDS", score: "— vs —", vs: "JAPAN",        status: "Jun 15, 1:30 AM",  live: false, upcoming: true },
  // ET noon Jun 15 → IST 9:30 PM Jun 15
  { label: "SPAIN",       score: "— vs —", vs: "CAPE VERDE",   status: "Jun 15, 9:30 PM",  live: false, upcoming: true },
  // ET 3pm Jun 15  → IST 12:30 AM Jun 16
  { label: "BELGIUM",     score: "— vs —", vs: "EGYPT",        status: "Jun 16, 12:30 AM", live: false, upcoming: true },
  // ET 9pm Jun 15  → IST 6:30 AM Jun 16
  { label: "ARGENTINA",   score: "— vs —", vs: "ALGERIA",      status: "Jun 16, 6:30 AM",  live: false, upcoming: true },
  // ET 4pm Jun 15  → IST 1:30 AM Jun 16
  { label: "ENGLAND",     score: "— vs —", vs: "CROATIA",      status: "Jun 16, 1:30 AM",  live: false, upcoming: true },
  // ET 1pm Jun 16  → IST 10:30 PM Jun 16
  { label: "PORTUGAL",    score: "— vs —", vs: "DR CONGO",     status: "Jun 16, 10:30 PM", live: false, upcoming: true },
  // ET 3pm Jun 16  → IST 12:30 AM Jun 17
  { label: "FRANCE",      score: "— vs —", vs: "SENEGAL",      status: "Jun 17, 12:30 AM", live: false, upcoming: true },
  // ET 3pm Jul 19  → IST 12:30 AM Jul 20
  { label: "FINAL",       score: "MetLife Stadium", vs: "NJ",  status: "Jul 20, 12:30 AM", live: false, upcoming: true },
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
          WC 2026
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
              {item.upcoming && !item.live && (
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#252525",
                    border: "1px solid #5A5248",
                    flexShrink: 0,
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
                style={{ fontSize: 13, color: "#C9A84C", letterSpacing: "0.08em" }}
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
