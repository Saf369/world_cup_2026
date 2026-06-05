import Nav from "@/components/Nav";
import Ticker from "@/components/Ticker";
import Hero from "@/components/Hero";
import StatsStrip from "@/components/StatsStrip";
import Predictor from "@/components/Predictor";
import Bracket from "@/components/Bracket";
import Groups from "@/components/Groups";
import TopScorers from "@/components/TopScorers";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <main style={{ minHeight: "100vh", background: "#050505", paddingTop: 72 }}>
      <Nav />
      <Ticker />
      <Hero />
      <StatsStrip />
      <Predictor />
      <Bracket />
      <Groups />
      <TopScorers />
      <Footer />
    </main>
  );
}
