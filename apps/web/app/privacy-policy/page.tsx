import Link from "next/link";

const sections = [
  {
    title: "Information We Collect",
    content:
      "When you create an account, we collect your email address, display name, and authentication data through our third-party provider (Clerk). When you use the platform, we store your creator profile preferences, generated content, calendar configurations, and export history.",
  },
  {
    title: "How We Use Your Data",
    content:
      "Your data is used to personalize AI-generated content, maintain your creator profile and preferences, provide calendar and content management features, generate PDF exports, and improve the quality of our AI generation pipeline.",
  },
  {
    title: "AI & Content Generation",
    content:
      "Content you generate through SrijanAI is processed by third-party AI providers (Groq, Gemini, OpenRouter). Your inputs may be sent to these providers for generation purposes. We do not use your generated content to train our models.",
  },
  {
    title: "Data Storage & Security",
    content:
      "Your data is stored in secured, managed databases. We use industry-standard encryption in transit and at rest. Authentication is handled by Clerk, a SOC 2 compliant auth provider.",
  },
  {
    title: "Your Rights",
    content:
      "You may request access to, correction of, or deletion of your personal data at any time. You can export your content and delete your account through the platform settings.",
  },
  {
    title: "Contact",
    content:
      "For privacy-related questions, please contact us through the channels listed in the footer of this website.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="page-shell">
      <section className="guide-hero fade-up">
        <p className="section-label">Privacy Policy</p>
        <h1>
          How we handle your{" "}
          <span className="gradient-text">data.</span>
        </h1>
        <p>
          Your privacy matters. This policy explains what data SrijanAI collects,
          how it&apos;s used, and what rights you have.
        </p>
      </section>

      <div className="guide-steps">
        {sections.map((section, index) => (
          <div className="guide-step fade-up" key={section.title}>
            <div className="guide-step-number">{String(index + 1).padStart(2, "0")}</div>
            <div className="guide-step-content">
              <h3>{section.title}</h3>
              <p>{section.content}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="about-mission fade-up" style={{ marginTop: "2rem" }}>
        <p className="section-label">Last updated</p>
        <h2>This policy was last updated on April 11, 2026.</h2>
        <p>
          This privacy policy may be updated as SrijanAI evolves. We will notify
          users of significant changes through the platform and update the date
          above accordingly.
        </p>
      </section>
    </main>
  );
}
