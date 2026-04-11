import Link from "next/link";

const guideSteps = [
  {
    number: "01",
    title: "Set your creator profile",
    description:
      "Define your niche, target platform, preferred language, content tone, and monthly posting goals. This becomes the foundation for all AI generation.",
  },
  {
    number: "02",
    title: "Choose your posting frequency",
    description:
      "Decide how many posts you want in the month. Whether it's 8 focused posts or 30 daily entries, SrijanAI adapts to your rhythm.",
  },
  {
    number: "03",
    title: "Select calendar days",
    description:
      "Pick exact dates manually or use smart presets like Mon/Wed/Fri, odd dates, or even dates. Watch the calendar update in real time as you shape your month.",
  },
  {
    number: "04",
    title: "Generate monthly titles",
    description:
      "With one click, generate content titles for every selected date. Each title is niche-aware, platform-optimized, and aligned with your tone.",
  },
  {
    number: "05",
    title: "Deep-generate each post",
    description:
      "Open any day to create the complete post — hook, caption, hashtags, CTA, platform tips, and optional video execution guidance. Refine, copy, regenerate, or export as PDF.",
  },
];

export default function GuidePage() {
  return (
    <main className="landing-shell guide-page-shell">
      <div className="cosmic-comets" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={`comet comet-${i + 1}`} />
        ))}
      </div>
      {/* ── Hero ── */}
      <section className="guide-hero fade-up">
        <p className="section-label">Guide</p>
        <h1>
          How SrijanAI will work for{" "}
          <span className="gradient-text">creators.</span>
        </h1>
        <p>
          From profile setup to export-ready content, here&apos;s the complete
          workflow that turns monthly planning from hours into minutes.
        </p>
      </section>

      {/* ── Steps ── */}
      <div className="guide-steps">
        {guideSteps.map((step) => (
          <div className="guide-step fade-up" key={step.number}>
            <div className="guide-step-number">{step.number}</div>
            <div className="guide-step-content">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── CTA ── */}
      <section className="cta-band fade-up" style={{ marginTop: "3rem" }}>
        <p className="section-label">Ready to try it?</p>
        <h2>
          Start building your{" "}
          <span className="gradient-text">content calendar</span> today.
        </h2>
        <div className="cta-actions">
          <Link className="primary-button" href="/sign-up">
            Get started for free →
          </Link>
          <Link className="secondary-button" href="/about">
            Learn more about us
          </Link>
        </div>
      </section>
    </main>
  );
}
