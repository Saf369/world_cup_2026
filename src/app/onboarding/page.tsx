"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import "./onboarding.css";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function OnboardingPage() {
  const router  = useRouter();
  const [loading,        setLoading]        = useState(true);
  const [saving,          setSaving]          = useState(false);
  const [error,           setError]           = useState<string | null>(null);
  const [sessionExpired,  setSessionExpired]  = useState(false);
  const [step,            setStep]            = useState<"form" | "done">("form");

  const [name,  setName]  = useState("");
  const [phone, setPhone] = useState("");

  // Guard: must be authenticated
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/login");
        return;
      }
      // Pre-fill from Google profile
      const meta = data.user.user_metadata;
      setName(meta?.full_name ?? "");
      setLoading(false);
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) { setError("Full name is required."); return; }
    const digits = phone.replace(/\D/g, "");
    if (!phone.trim() || digits.length === 0) { setError("Phone number is required."); return; }
    if (digits.length !== 10) { setError("Enter a valid 10-digit mobile number."); return; }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Save to DB first — this is the gate
      const res = await fetch("/api/auth/register", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:  name.trim(),
          phone: `+91${phone.replace(/\D/g, "")}`,
        }),
      });

      // 401 = session expired — check immediately before anything else
      if (res.status === 401) {
        setSessionExpired(true);
        return;
      }

      // Any other failure (except 409 = already registered which is fine)
      if (!res.ok && res.status !== 409) {
        const body = await res.json();
        throw new Error(body.error ?? "Failed to save profile");
      }

      // DB save confirmed — now update Supabase auth metadata
      await supabase.auth.updateUser({
        data: {
          full_name: name.trim(),
          phone:     `+91${phone.replace(/\D/g, "")}`,
        },
      });

      // Show success then redirect to MY BRACKET
      setStep("done");
      setTimeout(() => router.replace("/bracket"), 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="ob-page">
        <div className="ob-spinner-wrap">
          <span className="ob-spinner-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="ob-page">
      <div className="hex-mesh" aria-hidden="true" />
      <div className="ob-glow ob-glow--tl" aria-hidden="true" />
      <div className="ob-glow ob-glow--br" aria-hidden="true" />

      <div className="ob-card">
        {/* Corner ornaments */}
        <span className="lc-corner lc-corner--tl" aria-hidden="true" />
        <span className="lc-corner lc-corner--tr" aria-hidden="true" />
        <span className="lc-corner lc-corner--bl" aria-hidden="true" />
        <span className="lc-corner lc-corner--br" aria-hidden="true" />

        {/* ── Session expired state ── */}
        {sessionExpired ? (
          <div className="ob-session-expired">
            <div className="ob-se-icon">🔒</div>
            <h2 className="ob-se-title">Session Expired</h2>
            <p className="ob-se-desc">
              Your login session has timed out. Please sign in again to continue.
            </p>
            <button
              className="ob-submit btn-sheen"
              style={{ marginTop: 8 }}
              onClick={() => router.replace("/login")}
            >
              Sign In Again →
            </button>
          </div>
        ) : step === "done" ? (
          /* ── Success state ── */
          <div className="ob-success">
            <div className="ob-success-icon">🏆</div>
            <h2 className="ob-success-title">You&rsquo;re in!</h2>
            <p className="ob-success-sub">Redirecting to XI…</p>
            <div className="ob-success-bar">
              <div className="ob-success-fill" />
            </div>
          </div>
        ) : (
          /* ── Form ── */
          <>
            <header className="ob-header">
              <p className="ob-eyebrow">XI 2026</p>
              <h1 className="ob-title">Complete Your Profile</h1>
              <p className="ob-desc">
                Just a few details so we can personalise your experience and
                show you on the leaderboard.
              </p>
            </header>

            <form className="ob-form" onSubmit={handleSubmit} noValidate>
              {/* Full name */}
              <div className="ob-field">
                <label className="ob-label" htmlFor="ob-name">Full Name *</label>
                <input
                  id="ob-name"
                  className="ob-input"
                  type="text"
                  placeholder="e.g. Cristiano Ronaldo"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </div>


              {/* Phone */}
              <div className="ob-field">
                <label className="ob-label" htmlFor="ob-phone">Phone Number *</label>
                <div className="ob-phone-wrap">
                  <span className="ob-phone-prefix">+91</span>
                  <input
                    id="ob-phone"
                    className="ob-input ob-input--phone"
                    type="tel"
                    inputMode="numeric"
                    placeholder="98765 43210"
                    value={phone}
                    maxLength={10}
                    onChange={e => {
                      // Allow digits only, cap at 10
                      const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setPhone(digits);
                    }}
                    autoComplete="tel-national"
                    required
                  />
                </div>
                <p className="ob-hint">10-digit Indian mobile number · Used only for prize notifications · Never shared.</p>
              </div>


              {error && (
                <div className="ob-error" role="alert">{error}</div>
              )}

              <button
                id="ob-submit-btn"
                type="submit"
                className="ob-submit btn-sheen"
                disabled={saving}
              >
                {saving ? (
                  <><span className="ob-spinner" aria-hidden="true" />&nbsp;Saving…</>
                ) : (
                  "JOIN THE COMPETITION →"
                )}
              </button>


            </form>
          </>
        )}
      </div>
    </div>
  );
}
