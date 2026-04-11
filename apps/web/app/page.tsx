import Link from "next/link";

const painPoints = [
  "Creators lose hours every month trying to decide what to post and when to post it.",
  "Platform adaptation is repetitive, and manual caption writing drains energy fast.",
  "Inconsistent planning leads to burnout, content gaps, and weaker audience trust.",
];

const featureHighlights = [
  "Interactive monthly calendar with manual day picking and smart presets",
  "AI fallback chain across Groq, Gemini, and OpenRouter for reliability",
  "Per-post generation with hooks, captions, hashtags, CTAs, and platform tips",
];

const workflowSteps = [
  {
    title: "Set your creator profile",
    copy: "Start with niche, platform, language, tone, and monthly posting goals.",
  },
  {
    title: "Shape the calendar",
    copy: "Choose the exact posting days yourself or use one-click patterns like odd dates or Mon/Wed/Fri.",
  },
  {
    title: "Generate and refine",
    copy: "Create titles first, then open any day to generate the full post, video tips, and export-ready assets.",
  },
];

const proofPoints = [
  "30-post monthly planning flow",
  "Beautiful branded PDF exports",
  "Future-ready scheduling and Android reminders",
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Production-grade AI workflow for creators</p>
          <h1>Plan, generate, and manage a month of content in one focused flow.</h1>
          <p className="hero-text">
            SrijanAI is being built as a content workflow engine for creators
            who need strategy, speed, and consistency. Move from creator inputs
            to a full monthly calendar, deep post generation, and export-ready
            content without losing your brand voice.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" href="/sign-up">
              Start building content
            </Link>
            <Link className="secondary-button" href="#features">
              Explore the system
            </Link>
          </div>
          <div className="proof-strip">
            {proofPoints.map((point) => (
              <span key={point}>{point}</span>
            ))}
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
          <h2>Creators need structure, not another empty prompt box.</h2>
          <ul>
            {painPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </article>

        <article className="content-card accent-card">
          <p className="section-label">What we are building first</p>
          <h2>Web-first product foundation with a serious creator workflow.</h2>
          <ul>
            {featureHighlights.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="story-grid">
        {workflowSteps.map((step, index) => (
          <article className="story-card" key={step.title}>
            <span className="story-index">0{index + 1}</span>
            <h2>{step.title}</h2>
            <p>{step.copy}</p>
          </article>
        ))}
      </section>

      <section className="roadmap-section" id="roadmap">
        <p className="section-label">Current build phase</p>
        <h2>The web foundation is ready, and auth is now scaffolded for app growth.</h2>
        <p>
          From here we move into onboarding, dashboard structure, calendar
          logic, and the AI generation workflow that will power monthly content
          planning end to end.
        </p>
      </section>
    </main>
  );
}
