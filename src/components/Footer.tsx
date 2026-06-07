"use client";

const COLS = [
  {
    title: "XI",
    subtitle: "The Elite Platform",
    items: [
      "World Cup 2026 Predictor",
      "AI Match Analysis",
      "Live Tournament Bracket",
      "Group Stage Tables",
    ],
    isLogo: true,
  },
  {
    title: "Platform",
    items: ["Match Predictor", "Knockout Bracket", "Group Tables", "Top Scorers", "Live Ticker"],
  },
  {
    title: "Community",
    items: ["Leaderboard", "Prediction League", "Expert Picks", "Daily Challenges", "Prizes"],
  },
  {
    title: "Legal",
    items: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Responsible Gambling", "Contact"],
  },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: "#050505",
        borderTop: "1px solid #252525",
        padding: "80px 0 40px",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 40px" }}>
        {/* Top gold rule */}
        <div
          style={{
            width: "100%",
            height: 1,
            background: "linear-gradient(90deg, #C9A84C 0%, rgba(201,168,76,0.2) 40%, transparent 100%)",
            marginBottom: 64,
          }}
        />

        {/* Four columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
            gap: 48,
            marginBottom: 64,
          }}
        >
          {COLS.map((col, i) => (
            <div key={i}>
              {col.isLogo ? (
                <>
                  <div
                    className="font-display"
                    style={{ fontSize: 32, color: "#C9A84C", letterSpacing: "0.12em", marginBottom: 8 }}
                  >
                    {col.title}
                  </div>
                  <div
                    className="font-serif"
                    style={{ fontSize: "1rem", fontStyle: "italic", color: "#5A5248", marginBottom: 24 }}
                  >
                    {col.subtitle}
                  </div>
                  <p
                    style={{
                      color: "#5A5248",
                      fontSize: 12,
                      lineHeight: 1.8,
                      fontWeight: 300,
                      marginBottom: 24,
                    }}
                  >
                    The world&apos;s most sophisticated World Cup prediction platform.
                    AI-powered analytics meet elite football intelligence.
                  </p>
                  <div style={{ display: "flex", gap: 16 }}>
                    {[
                      { 
                        url: "https://github.com/Saf369",
                        icon: <svg viewBox="0 0 24 24" fill="currentColor" height="18" width="18"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg> 
                      },
                      { 
                        url: "https://www.linkedin.com/in/safwan-muhammed-8277b0317/",
                        icon: <svg viewBox="0 0 24 24" fill="currentColor" height="18" width="18"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg> 
                      },
                    ].map((s, i) => (
                      <button
                        key={i}
                        onClick={() => window.open(s.url, "_blank")}
                        style={{
                          width: 36,
                          height: 36,
                          background: "transparent",
                          border: "1px solid #252525",
                          borderRadius: 2,
                          color: "#5A5248",
                          cursor: "pointer",
                          transition: "all 0.22s ease",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.borderColor = "#C9A84C";
                          (e.currentTarget as HTMLButtonElement).style.color = "#C9A84C";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.borderColor = "#252525";
                          (e.currentTarget as HTMLButtonElement).style.color = "#5A5248";
                        }}
                      >
                        {s.icon}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 24,
                    }}
                  >
                    <div style={{ width: 16, height: 1, background: "#C9A84C", opacity: 0.6 }} />
                    <span
                      className="label-xs"
                      style={{ color: "#C9A84C", letterSpacing: "2px" }}
                    >
                      {col.title}
                    </span>
                  </div>
                  <ul style={{ listStyle: "none" }}>
                    {col.items.map((item) => (
                      <li key={item} style={{ marginBottom: 12 }}>
                        <button
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: 12,
                            color: "#5A5248",
                            fontFamily: "var(--font-ui)",
                            letterSpacing: "0.5px",
                            fontWeight: 300,
                            transition: "color 0.2s ease",
                            padding: 0,
                            textAlign: "left",
                          }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#C9A84C")}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#5A5248")}
                        >
                          {item}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid #1E1E1E",
            paddingTop: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span className="label-xs" style={{ color: "#5A5248", letterSpacing: "1.5px" }}>
            © 2026 XI. All rights reserved.
          </span>
          <span
            className="font-serif"
            style={{ fontSize: "0.85rem", fontStyle: "italic", color: "#5A5248", opacity: 0.6 }}
          >
            Crafted for the beautiful game.
          </span>
          <span className="label-xs" style={{ color: "#5A5248", letterSpacing: "1.5px" }}>
            USA · Canada · Mexico
          </span>
        </div>
      </div>
    </footer>
  );
}
