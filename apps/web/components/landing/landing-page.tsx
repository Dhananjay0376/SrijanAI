import { ArrowRight } from "lucide-react";
import { NeonButton } from "../ui/NeonButton";

export default function LandingPage() {
  return (
    <main className="landing-shell">
      <section className="landing-hero" aria-labelledby="landing-title">
        <div className="landing-hero-copy">
          <p className="landing-kicker">AI × CONTENT × INDIA</p>
          <h1 id="landing-title">
            Your Content.
            <br />
            Every Month.
            <br />
            <span className="landing-hero-accent">Automated.</span>
          </h1>
          <p className="landing-hero-text">
            India ka pehla AI Content Planner — Hindi, English aur Hinglish mein
            Instagram, YouTube aur LinkedIn ke liye posts automatically
            generate karta hai.
          </p>
          <div className="landing-actions" aria-label="Primary actions">
            <NeonButton href="/sign-up">
              Start for Free <ArrowRight size={18} />
            </NeonButton>
            <NeonButton href="/sign-in" variant="outline">
              Demo Login →
            </NeonButton>
          </div>
        </div>
      </section>
    </main>
  );
}
