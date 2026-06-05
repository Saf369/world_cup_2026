"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { id: "hero",      label: "Home" },
  { id: "predictor", label: "Predictor" },
  { id: "bracket",   label: "Bracket" },
  { id: "groups",    label: "Groups" },
  { id: "scorers",   label: "Scorers" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive]     = useState("hero");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const sections = NAV_LINKS.map((l) => document.getElementById(l.id));
      const current = sections.findLast(
        (s) => s && s.getBoundingClientRect().top <= 120
      );
      if (current) setActive(current.id);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      id="nav"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        borderBottom: scrolled ? "1px solid #252525" : "1px solid transparent",
        background: scrolled ? "rgba(5, 5, 5, 0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        transition: "background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 40px",
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <button
          onClick={() => scrollTo("hero")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "baseline",
            gap: 4,
          }}
        >
          <span
            className="font-display"
            style={{
              fontSize: 28,
              letterSpacing: "0.1em",
              color: "#C9A84C",
              lineHeight: 1,
            }}
          >
            MUNDIAL
          </span>
          <span
            className="label-xs"
            style={{ color: "#5A5248", marginLeft: 8 }}
          >
            2026
          </span>
        </button>

        {/* Links */}
        <div
          style={{
            display: "flex",
            gap: 36,
            alignItems: "center",
          }}
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              id={`nav-${link.id}`}
              onClick={() => scrollTo(link.id)}
              className={`nav-link ${active === link.id ? "active" : ""}`}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link
            href="/bracket"
            id="nav-my-bracket"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "var(--font-ui)",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#C9A84C",
              textDecoration: "none",
              border: "1px solid rgba(201,168,76,0.4)",
              borderRadius: 2,
              padding: "8px 16px",
              transition: "all 0.22s ease",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor="#C9A84C"; (e.currentTarget as HTMLElement).style.background="rgba(201,168,76,0.06)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor="rgba(201,168,76,0.4)"; (e.currentTarget as HTMLElement).style.background="transparent"; }}
          >
            ✦ MY BRACKET
          </Link>
          <button className="btn-gold" style={{ fontSize: 9, padding: "10px 20px" }}>
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
}
