"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import "./login.css";

// ── Floating particle
function Particle({ style }: { style: React.CSSProperties }) {
  return <div className="login-particle" style={style} />;
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);
  const [particles, setParticles] = useState<React.CSSProperties[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  // Generate particles client-side only (avoids SSR mismatch)
  useEffect(() => {
    const p: React.CSSProperties[] = Array.from({ length: 28 }, () => ({
      left:              `${Math.random() * 100}%`,
      top:               `${Math.random() * 100}%`,
      animationDelay:    `${Math.random() * 6}s`,
      animationDuration: `${4 + Math.random() * 6}s`,
      opacity:           Math.random() * 0.5 + 0.1,
      width:             `${2 + Math.random() * 3}px`,
      height:            `${2 + Math.random() * 3}px`,
    }));
    setParticles(p);
  }, []);

  // Card tilt on mouse move
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const handleMove = (e: MouseEvent) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(900px) rotateY(${dx * 4}deg) rotateX(${-dy * 3}deg)`;
    };
    const handleLeave = () => {
      card.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg)";
    };
    card.addEventListener("mousemove", handleMove);
    card.addEventListener("mouseleave", handleLeave);
    return () => {
      card.removeEventListener("mousemove", handleMove);
      card.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      );
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      // Supabase redirects to Google — loading stays true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Hex mesh background */}
      <div className="hex-mesh" aria-hidden="true" />

      {/* Floating gold particles */}
      <div className="login-particles" aria-hidden="true">
        {particles.map((s, i) => <Particle key={i} style={s} />)}
      </div>

      {/* Ambient glow blobs */}
      <div className="login-glow login-glow--tl" aria-hidden="true" />
      <div className="login-glow login-glow--br" aria-hidden="true" />

      {/* ── CARD ─────────────────────────────── */}
      <div className="login-card-wrap" ref={cardRef}>
        <div className="login-card">

          {/* Corner ornaments */}
          <span className="lc-corner lc-corner--tl" aria-hidden="true" />
          <span className="lc-corner lc-corner--tr" aria-hidden="true" />
          <span className="lc-corner lc-corner--bl" aria-hidden="true" />
          <span className="lc-corner lc-corner--br" aria-hidden="true" />

          {/* Inner shimmer */}
          <div className="lc-shimmer" aria-hidden="true" />

          {/* ── HEADER ── */}
          <header className="lc-header">
            <div className="lc-trophy" aria-label="Trophy">🏆</div>
            <h1 className="lc-wordmark">XI</h1>
            <p className="lc-subtitle">WORLD CUP 2026 PREDICTOR</p>
          </header>

          {/* ── DIVIDER ── */}
          <div className="lc-rule" aria-hidden="true">
            <span /><span className="lc-rule-diamond">◆</span><span />
          </div>

          {/* ── BODY ── */}
          <div className="lc-body">
            <p className="lc-tagline">Sign in to save your predictions &amp; compete on the leaderboard</p>

            {error && (
              <div className="lc-error" role="alert">{error}</div>
            )}

            {/* Google Sign-in Button */}
            <button
              id="btn-google-signin"
              className={`lc-google-btn btn-sheen ${loading ? "loading" : ""}`}
              onClick={handleGoogleLogin}
              disabled={loading}
              aria-label="Continue with Google"
            >
              {loading ? (
                <>
                  <span className="lc-spinner" aria-hidden="true" />
                  <span>SIGNING IN…</span>
                </>
              ) : (
                <>
                  {/* Google G icon */}
                  <svg className="lc-g-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>CONTINUE WITH GOOGLE</span>
                </>
              )}
            </button>


          </div>

          {/* ── FOOTER ── */}
          <footer className="lc-footer">
            <p className="lc-footer-text">FIFA World Cup 2026 · USA · Canada · Mexico</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
