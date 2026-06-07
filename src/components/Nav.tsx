"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { createBrowserClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";

const NAV_LINKS = [
  { id: "hero",      label: "Home" },
  { id: "predictor", label: "Predictor" },
  { id: "bracket",   label: "Bracket" },
  { id: "groups",    label: "Groups" },
  { id: "scorers",   label: "Scorers" },
];

// ── Supabase browser client (singleton)
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function Nav() {
  const [scrolled,    setScrolled]    = useState(false);
  const [active,      setActive]      = useState("hero");
  const [user,        setUser]        = useState<User | null>(null);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [imgError,    setImgError]    = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // ── Scroll listener
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const sections = NAV_LINKS.map((l) => document.getElementById(l.id));
      const current  = sections.findLast(
        (s) => s && s.getBoundingClientRect().top <= 120
      );
      if (current) setActive(current.id);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Auth state
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );
    return () => subscription.unsubscribe();
  }, []);

  // ── Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
    setUser(null);
  };

  // ── Avatar: Google picture or initials fallback
  const avatarUrl   = user?.user_metadata?.avatar_url as string | undefined;
  const displayName = (user?.user_metadata?.full_name as string | undefined) ?? user?.email ?? "";
  const initials    = displayName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

  return (
    <nav
      id="nav"
      style={{
        position:       "fixed",
        top:            0,
        left:           0,
        right:          0,
        zIndex:         200,
        borderBottom:   scrolled ? "1px solid #252525" : "1px solid transparent",
        background:     scrolled ? "rgba(5,5,5,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        transition:     "background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease",
      }}
    >
      <div
        style={{
          maxWidth: 1400, margin: "0 auto",
          padding:  "0 40px",
          height:   72,
          display:  "flex", alignItems: "center", justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <button
          onClick={() => scrollTo("hero")}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "baseline", gap: 4 }}
        >
          <span className="font-display" style={{ fontSize: 28, letterSpacing: "0.1em", color: "#C9A84C", lineHeight: 1 }}>
            XI
          </span>
          <span className="label-xs" style={{ color: "#5A5248", marginLeft: 8 }}>2026</span>
        </button>

        {/* Links */}
        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
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
              display: "inline-flex", alignItems: "center", gap: 6,
              fontFamily: "var(--font-ui)", fontSize: 10, fontWeight: 600,
              letterSpacing: "2px", textTransform: "uppercase",
              color: "#C9A84C", textDecoration: "none",
              border: "1px solid rgba(201,168,76,0.4)",
              borderRadius: 2, padding: "8px 16px",
              transition: "all 0.22s ease",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor="#C9A84C"; (e.currentTarget as HTMLElement).style.background="rgba(201,168,76,0.06)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor="rgba(201,168,76,0.4)"; (e.currentTarget as HTMLElement).style.background="transparent"; }}
          >
            ✦ MY BRACKET
          </Link>

          {/* ── AUTH AREA ── */}
          {user ? (
            // ── Logged-in: Avatar + dropdown
            <div ref={menuRef} style={{ position: "relative" }}>
              <button
                id="nav-avatar-btn"
                onClick={() => setMenuOpen((o) => !o)}
                style={{
                  background:   "none",
                  border:       "2px solid rgba(201,168,76,0.5)",
                  borderRadius: "50%",
                  cursor:       "pointer",
                  padding:      0,
                  width:        38,
                  height:       38,
                  overflow:     "hidden",
                  display:      "flex",
                  alignItems:   "center",
                  justifyContent: "center",
                  transition:   "border-color 0.2s ease",
                  flexShrink:   0,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor="#C9A84C"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor="rgba(201,168,76,0.5)"; }}
                aria-label="User menu"
                aria-expanded={menuOpen}
              >
                {avatarUrl && !imgError ? (
                  <Image
                    src={avatarUrl}
                    alt={displayName}
                    width={38}
                    height={38}
                    style={{ objectFit: "cover", borderRadius: "50%" }}
                    onError={() => setImgError(true)}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span style={{
                    fontFamily: "var(--font-display)", fontSize: 14,
                    color: "#C9A84C", userSelect: "none",
                  }}>
                    {initials}
                  </span>
                )}
              </button>

              {/* ── Dropdown menu ── */}
              {menuOpen && (
                <div
                  style={{
                    position:   "absolute",
                    top:        "calc(100% + 10px)",
                    right:      0,
                    minWidth:   210,
                    background: "#0D0D0D",
                    border:     "1px solid #252525",
                    borderTop:  "2px solid #C9A84C",
                    borderRadius: 2,
                    boxShadow:  "0 16px 40px rgba(0,0,0,0.6)",
                    zIndex:     300,
                    overflow:   "hidden",
                    animation:  "dropdownIn 0.18s ease forwards",
                  }}
                >
                  {/* User info */}
                  <div style={{
                    padding:      "14px 16px 12px",
                    borderBottom: "1px solid #1E1E1E",
                  }}>
                    <p style={{
                      fontFamily:   "var(--font-ui)", fontSize: 12, fontWeight: 600,
                      color:        "#E8E0D0", marginBottom: 2,
                      whiteSpace:   "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>
                      {displayName}
                    </p>
                    <p style={{
                      fontFamily:   "var(--font-ui)", fontSize: 10, color: "#5A5248",
                      whiteSpace:   "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>
                      {user.email}
                    </p>
                  </div>

                  {/* Menu items */}
                  {[
                    { href: "/bracket",    label: "✦ My Bracket" },
                    { href: "/onboarding", label: "✎ Edit Profile" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      style={{
                        display:      "block",
                        padding:      "10px 16px",
                        fontFamily:   "var(--font-ui)", fontSize: 10, fontWeight: 600,
                        letterSpacing:"1.5px", textTransform: "uppercase",
                        color:        "#9A9080", textDecoration: "none",
                        borderBottom: "1px solid #1A1A1A",
                        transition:   "background 0.15s, color 0.15s",
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background="rgba(201,168,76,0.06)"; (e.currentTarget as HTMLElement).style.color="#C9A84C"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background="transparent"; (e.currentTarget as HTMLElement).style.color="#9A9080"; }}
                    >
                      {item.label}
                    </Link>
                  ))}

                  <button
                    id="nav-signout-btn"
                    onClick={handleSignOut}
                    style={{
                      display:   "block", width: "100%", textAlign: "left",
                      padding:   "10px 16px", background: "none", border: "none",
                      fontFamily:"var(--font-ui)", fontSize: 10, fontWeight: 600,
                      letterSpacing: "1.5px", textTransform: "uppercase",
                      color:     "#5A5248", cursor: "pointer",
                      transition:"background 0.15s, color 0.15s",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background="rgba(220,60,60,0.07)"; (e.currentTarget as HTMLElement).style.color="#ff8080"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background="transparent"; (e.currentTarget as HTMLElement).style.color="#5A5248"; }}
                  >
                    ⎋ Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            // ── Logged-out: Sign In button
            <Link
              href="/login"
              id="nav-signin-btn"
              className="btn-gold"
              style={{ fontSize: 9, padding: "10px 20px", textDecoration: "none" }}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      <style>{`
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  );
}
