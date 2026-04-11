const values = [
  {
    icon: "⚡",
    title: "Speed Without Sacrifice",
    description:
      "Generate a full month of content in under 60 seconds. No shortcuts on quality — every post is platform-aware and brand-consistent.",
  },
  {
    icon: "🧠",
    title: "Creator-First Intelligence",
    description:
      "AI that understands niche, tone, and audience. Not generic outputs — structured content that sounds like you wrote it.",
  },
  {
    icon: "🔄",
    title: "Repeatable Workflows",
    description:
      "Turn monthly planning from a chaotic sprint into a calm, reliable rhythm. Same process, better results, every month.",
  },
  {
    icon: "🛡️",
    title: "Reliability by Design",
    description:
      "Multi-provider AI fallback chain ensures generation never stalls. Groq, Gemini, and OpenRouter working in sequence.",
  },
  {
    icon: "📊",
    title: "Structure Over Chaos",
    description:
      "Calendar-first approach brings clarity. See your full month at a glance, pick dates, approve content, and export.",
  },
  {
    icon: "🚀",
    title: "Built for Growth",
    description:
      "Starting web-first, expanding to Android. Your content workflow travels with you — desktop, tablet, and phone.",
  },
];

export default function AboutPage() {
  return (
    <main className="page-shell">
      {/* ── Hero ── */}
      <section className="about-hero fade-up">
        <p className="section-label">About SrijanAI</p>
        <h1>
          Built for creators who need{" "}
          <span className="gradient-text">consistency</span> without creative
          fatigue.
        </h1>
        <p>
          SrijanAI is being designed as a practical content operating system for
          creators, educators, coaches, and small brands. The goal is not just
          to generate text, but to reduce planning overhead, protect creator
          energy, and turn strategy into a reliable monthly rhythm.
        </p>
      </section>

      {/* ── Values Grid ── */}
      <section className="about-values fade-up">
        {values.map((value) => (
          <div className="about-value-card" key={value.title}>
            <div className="about-value-icon">{value.icon}</div>
            <h3>{value.title}</h3>
            <p>{value.description}</p>
          </div>
        ))}
      </section>

      {/* ── Mission ── */}
      <section className="about-mission fade-up">
        <p className="section-label">Our mission</p>
        <h2>
          Make content planning feel like{" "}
          <span className="gradient-text-alt">a superpower</span>, not a chore.
        </h2>
        <p>
          Every creator deserves a system that respects their time and protects
          their voice. SrijanAI is building the infrastructure to make monthly
          content creation fast, structured, and sustainable — so creators can
          focus on what they do best: creating.
        </p>
        <p>
          The product starts on the web with a strong workflow foundation and
          will expand into Android with reminder and generation features powered
          by the same backend systems. We believe the best tools don&apos;t just
          generate content — they give creators confidence in their process.
        </p>
      </section>
    </main>
  );
}
