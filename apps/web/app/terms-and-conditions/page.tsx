import Link from "next/link";

const sections = [
  {
    title: "Acceptance of Terms",
    content:
      "By creating an account or using SrijanAI, you agree to these terms. If you do not agree, please do not use the platform. We reserve the right to update these terms, and continued use after changes constitutes acceptance.",
  },
  {
    title: "Service Description",
    content:
      "SrijanAI provides AI-powered content planning and generation tools for creators. Features include monthly calendar management, AI content generation, PDF exports, and scheduling capabilities. The service is provided on an as-is basis.",
  },
  {
    title: "User Responsibilities",
    content:
      "You are responsible for the content you create, publish, and distribute using SrijanAI. You agree not to use the platform to generate harmful, misleading, or illegal content. You must comply with all applicable laws in your jurisdiction.",
  },
  {
    title: "Intellectual Property",
    content:
      "Content generated using SrijanAI belongs to you, the creator. However, you acknowledge that AI-generated content may not be unique and similar content may be generated for other users. SrijanAI retains rights to the platform, brand, and underlying technology.",
  },
  {
    title: "Subscription & Payments",
    content:
      "SrijanAI will offer both free and paid tiers. Paid subscriptions will be billed through Stripe. Refund policies and cancellation terms will be defined before the paid tier launches.",
  },
  {
    title: "Limitation of Liability",
    content:
      "SrijanAI is not liable for the accuracy, appropriateness, or performance of AI-generated content. Use generated content at your own discretion. We are not responsible for third-party platform rules, posting outcomes, or audience reactions.",
  },
  {
    title: "Termination",
    content:
      "We may suspend or terminate accounts that violate these terms. You may delete your account at any time. Upon termination, your data will be deleted in accordance with our privacy policy.",
  },
];

export default function TermsAndConditionsPage() {
  return (
    <main className="page-shell">
      <section className="guide-hero fade-up">
        <p className="section-label">Terms & Conditions</p>
        <h1>
          Rules of{" "}
          <span className="gradient-text-alt">engagement.</span>
        </h1>
        <p>
          Please read these terms carefully before using SrijanAI. They define
          the relationship between you and the platform.
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
        <h2>These terms were last updated on April 11, 2026.</h2>
        <p>
          These terms may be updated as SrijanAI evolves. Significant changes
          will be communicated through the platform. Continued use after changes
          constitutes acceptance of the updated terms.
        </p>
      </section>
    </main>
  );
}
