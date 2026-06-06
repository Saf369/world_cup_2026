import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import VisualBracket from "@/components/bracket/VisualBracket";

export const metadata: Metadata = {
  title: "MY BRACKET — MUNDIAL 2026 Predictor",
  description:
    "Build your personal FIFA World Cup 2026 bracket prediction — group stage through the final. Predict every match, track your champion, and share your bracket.",
};

export default async function BracketRoute() {
  const supabase = await createClient();

  // Check if there's a logged-in user
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    // Signed-in user: check if they've completed onboarding (row exists in users table)
    const { data: profile } = await (supabase as any)
      .from("users")
      .select("id")
      .eq("email", user.email)
      .maybeSingle();

    if (!profile) {
      // No profile row means onboarding is not done — send them back
      redirect("/onboarding");
    }
  }
  // Anonymous users (no session) pass through freely — they use localStorage only

  return <VisualBracket />;
}
