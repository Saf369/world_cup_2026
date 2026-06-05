"use client";
import { useEffect, useRef, useState } from "react";

export default function Hero() {
  const [loaded, setLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setLoaded(true);
    // Subtle particle glow on canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: { x: number; y: number; r: number; a: number; vx: number; vy: number; va: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        a: Math.random(),
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        va: (Math.random() - 0.5) * 0.005,
      });
    }

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.a += p.va;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        p.a = Math.max(0.05, Math.min(0.6, p.a));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${p.a})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "#050505",
        overflow: "hidden",
      }}
    >
      {/* Hex mesh */}
      <div className="hex-mesh" />

      {/* Canvas particles */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Radial glow — centre */}
      <div
        className="radial-glow"
        style={{
          width: "60vw",
          height: "60vw",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 65%)",
          zIndex: 1,
        }}
      />

      {/* Corner ornaments — hero panel */}
      <div className="corner-ornament top-left"    style={{ top: 100, left: 40, zIndex: 3 }} />
      <div className="corner-ornament top-right"   style={{ top: 100, right: 40, zIndex: 3 }} />
      <div className="corner-ornament bottom-left" style={{ bottom: 40, left: 40, zIndex: 3 }} />
      <div className="corner-ornament bottom-right"style={{ bottom: 40, right: 40, zIndex: 3 }} />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 4,
          maxWidth: 1400,
          margin: "0 auto",
          padding: "80px 40px 80px",
          width: "100%",
        }}
      >
        {/* Eyebrow */}
        <div className="eyebrow" style={{ marginBottom: 24 }}>
          FIFA World Cup 2026 · Jun 11 – Jul 19 · USA · Canada · Mexico
        </div>

        {/* Main headline */}
        <h1
          className="display-xl"
          style={{
            maxWidth: 900,
            marginBottom: 8,
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          PREDICT
          <br />
          <span style={{ color: "#C9A84C" }}>THE</span> GLORY
        </h1>

        {/* Sub serif */}
        <p
          className="font-serif"
          style={{
            fontSize: "clamp(1.2rem, 2vw, 1.6rem)",
            fontStyle: "italic",
            color: "#C9A84C",
            marginBottom: 32,
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
            transform: loaded ? "translateY(0)" : "translateY(20px)",
          }}
        >
          48 Nations. 104 Matches. One Champion.
        </p>

        <p
          style={{
            maxWidth: 540,
            color: "#9A9080",
            lineHeight: 1.8,
            fontSize: 14,
            marginBottom: 48,
            fontWeight: 300,
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.8s ease 0.35s",
          }}
        >
          The most sophisticated prediction platform ever built for the beautiful game.
          Harness AI-driven analytics for all 104 matches — from Mexico vs South Africa
          at Estadio Azteca on June 11 to the Grand Final at MetLife Stadium on July 19.
        </p>

        {/* CTAs */}
        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.8s ease 0.5s",
          }}
        >
          <button className="btn-gold">Start Predicting</button>
          <button className="btn-outline">View Bracket</button>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            opacity: 0.5,
          }}
        >
          <span className="label-xs">Scroll</span>
          <div
            style={{
              width: 1,
              height: 48,
              background: "linear-gradient(to bottom, #C9A84C, transparent)",
              animation: "scrollPulse 1.8s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      {/* Bottom border */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 1,
          background:
            "linear-gradient(90deg, transparent 0%, #C9A84C 50%, transparent 100%)",
          opacity: 0.3,
        }}
      />

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(1); }
          50% { opacity: 0.8; transform: scaleY(1.1); }
        }
      `}</style>
    </section>
  );
}
