import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Sign In — XI 2026 Predictor",
  description:
    "Sign in with Google to save your FIFA World Cup 2026 predictions, compete on the leaderboard, and track your accuracy across the tournament.",
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
