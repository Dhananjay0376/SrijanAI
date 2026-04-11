const painPoints = [
  "Turn monthly content planning into a guided 60-second workflow.",
  "Generate post ideas, captions, CTAs, hashtags, and platform tips in one place.",
  "Move from creator intent to a structured calendar without burnout.",
];

const featureHighlights = [
  "Interactive calendar with smart day presets",
  "AI provider fallback across Groq, Gemini, and OpenRouter",
  "Per-post generation, video guidance, and branded PDF exports",
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Production-grade AI workflow for creators</p>
          <h1>Plan a full month of content before your coffee gets cold.</h1>
          <p className="hero-text">
            SrijanAI is being built to help creators generate a monthly content
            calendar, refine every post, and turn ideas into publish-ready
            assets across their chosen platforms.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#roadmap">
              Explore the roadmap
            </a>
            <a className="secondary-button" href="#features">
              See core features
            </a>
          </div>
        </div>
        <div className="hero-card">
          <div className="orb orb-one" />
          <div className="orb orb-two" />
          <div className="calendar-panel">
            <div className="calendar-header">
              <span>April Plan</span>
              <span>12 posts selected</span>
            </div>
            <div className="calendar-grid">
              {["1", "3", "5", "8", "10", "12", "15", "17", "19", "22", "24", "29"].map(
                (day) => (
                  <div className="calendar-day is-active" key={day}>
                    {day}
                  </div>
                ),
              )}
            </div>
            <div className="calendar-meta">
              <span>Preset: Mon / Wed / Fri</span>
              <span>Status: Generation ready</span>
            </div>
          </div>
        </div>
      </section>

      <section className="content-grid" id="features">
        <article className="content-card">
          <p className="section-label">Why it matters</p>
          <h2>Creators need a system, not another blank box.</h2>
          <ul>
            {painPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </article>

        <article className="content-card accent-card">
          <p className="section-label">What we are building first</p>
          <h2>Web-first monorepo with a serious product foundation.</h2>
          <ul>
            {featureHighlights.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="roadmap-section" id="roadmap">
        <p className="section-label">Current build phase</p>
        <h2>We have documented the product and started the monorepo foundation.</h2>
        <p>
          The next steps are the marketing site, authentication, onboarding,
          and the calendar workflow that will power monthly content generation.
        </p>
      </section>
    </main>
  );
}

