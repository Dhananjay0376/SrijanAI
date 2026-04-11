"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { LandingSnowOverlay } from "./landing-snow-overlay";
import { NeonButton } from "../ui/NeonButton";

export default function LandingPage() {
  const ctaRef = useRef<HTMLElement | null>(null);
  const [ctaVisible, setCtaVisible] = useState(false);

  useEffect(() => {
    const node = ctaRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setCtaVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <main className="landing-shell">
      <LandingSnowOverlay />

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
            <NeonButton
              className="landing-demo-button"
              href="/sign-in"
              variant="outline"
            >
              Demo Login →
            </NeonButton>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="landing-bottom-cta-title"
        className={`landing-bottom-cta ${ctaVisible ? "is-visible" : ""}`}
        ref={ctaRef}
      >
        <div className="landing-bottom-cta-inner">
          <h2 id="landing-bottom-cta-title">
            Start Your <span>Content Journey</span>
          </h2>
          <p>Join thousands of Indian micro-creators automating their content.</p>
          <NeonButton className="landing-bottom-cta-button" href="/sign-up">
            Create Free Account <ArrowRight size={18} />
          </NeonButton>
        </div>
      </section>
    </main>
  );
}
