"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Camera,
  Palette,
  CalendarDays,
  Rocket,
  Sparkles,
  Layers,
  Zap,
} from "lucide-react";
import { Show } from "@clerk/nextjs";
import { LandingSnowOverlay } from "./landing-snow-overlay";
import { NeonButton } from "../ui/NeonButton";
import { hasClerkPublishableKey } from "../../lib/auth";

const creationFeatures = [
  {
    icon: <Camera size={28} />,
    title: "AI Script Engine",
    description:
      "Generate scroll-stopping scripts for Reels, Shorts & carousels in seconds.",
    accent: "emerald",
  },
  {
    icon: <Palette size={28} />,
    title: "Visual Mood Board",
    description:
      "AI-curated color palettes, fonts & visual styles matched to your niche.",
    accent: "violet",
  },
  {
    icon: <CalendarDays size={28} />,
    title: "Smart Calendar",
    description:
      "30-day content plans auto-filled with optimal posting times & themes.",
    accent: "blue",
  },
  {
    icon: <Layers size={28} />,
    title: "Multi-Platform Export",
    description:
      "One idea → adapted drafts for Instagram, YouTube, LinkedIn & X.",
    accent: "orange",
  },
];

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
      { threshold: 0.2 },
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
        {hasClerkPublishableKey ? (
          <>
            {/* ── Signed-in: Deep Dive into Creation ── */}
            <Show when="signed-in">
              <div className="deep-dive-panel">
                <div className="deep-dive-badge">
                  <Sparkles size={16} />
                  Welcome back, Creator
                </div>
                <h2 id="landing-bottom-cta-title">
                  Deep Dive into <span>Creation</span>
                </h2>
                <p className="deep-dive-subtitle">
                  Your studio is warmed up and ready. Pick a superpower below or
                  jump straight into your creative cockpit.
                </p>

                <div className="deep-dive-grid">
                  {creationFeatures.map((feature) => (
                    <div
                      className={`deep-dive-card deep-dive-accent-${feature.accent}`}
                      key={feature.title}
                    >
                      <div className="deep-dive-card-icon">{feature.icon}</div>
                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                    </div>
                  ))}
                </div>

                <div className="deep-dive-actions">
                  <NeonButton
                    className="landing-bottom-cta-button"
                    href="/dashboard"
                  >
                    <Rocket size={20} />
                    Launch Studio
                    <ArrowRight size={18} />
                  </NeonButton>
                  <p className="deep-dive-hint">
                    <Zap size={14} />
                    Your creative engine is online — zero setup needed
                  </p>
                </div>
              </div>
            </Show>

            {/* ── Signed-out: Original CTA ── */}
            <Show when="signed-out">
              <div className="landing-bottom-cta-inner">
                <h2 id="landing-bottom-cta-title">
                  Start Your <span>Content Journey</span>
                </h2>
                <p>
                  Join thousands of Indian micro-creators automating their
                  content.
                </p>
                <NeonButton
                  className="landing-bottom-cta-button"
                  href="/sign-up"
                >
                  Create Free Account <ArrowRight size={18} />
                </NeonButton>
              </div>
            </Show>
          </>
        ) : (
          /* ── Fallback when Clerk is not configured ── */
          <div className="landing-bottom-cta-inner">
            <h2 id="landing-bottom-cta-title">
              Start Your <span>Content Journey</span>
            </h2>
            <p>
              Join thousands of Indian micro-creators automating their content.
            </p>
            <NeonButton
              className="landing-bottom-cta-button"
              href="/sign-up"
            >
              Create Free Account <ArrowRight size={18} />
            </NeonButton>
          </div>
        )}
      </section>
    </main>
  );
}
