import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Complete Your Profile — MUNDIAL 2026",
  description: "Set up your MUNDIAL profile to appear on the leaderboard and receive prize notifications.",
};

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
