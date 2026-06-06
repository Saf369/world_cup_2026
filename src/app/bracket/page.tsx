import type { Metadata } from "next";
import VisualBracket from "@/components/bracket/VisualBracket";

export const metadata: Metadata = {
  title: "MY BRACKET — MUNDIAL 2026 Predictor",
  description:
    "Build your personal FIFA World Cup 2026 bracket prediction — group stage through the final. Predict every match, track your champion, and share your bracket.",
};

export default function BracketRoute() {
  return (
    <VisualBracket />
  );
}
