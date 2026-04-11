const guideSteps = [
  "Set your niche, platform, language, and tone.",
  "Choose how many posts you want in the month.",
  "Select exact calendar days or use quick presets like Mon/Wed/Fri or odd dates.",
  "Generate monthly titles, then open any day to create the full post.",
  "Refine, copy, export, and later schedule or publish supported posts.",
];

export default function GuidePage() {
  return (
    <main className="content-page-shell">
      <section className="content-page-card">
        <p className="section-label">Guide</p>
        <h1>How SrijanAI will work for creators.</h1>
        <ol className="step-list">
          {guideSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
    </main>
  );
}

