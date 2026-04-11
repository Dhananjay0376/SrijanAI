import type { ReactNode } from "react";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  ClipboardList,
  FileDown,
  Languages,
  Layers,
  Play,
  Radar,
  Repeat2,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { NeonButton } from "../ui/NeonButton";

const featureCards = [
  {
    icon: <Zap />,
    tone: "orange",
    title: "AI Studio",
    desc: "Generate hooks, captions, scripts, CTAs, and platform-ready post ideas in Hinglish and English.",
  },
  {
    icon: <Calendar />,
    tone: "violet",
    title: "Smart Planner",
    desc: "Turn a niche, goal, and posting rhythm into a visual 30-day calendar you can actually follow.",
  },
  {
    icon: <TrendingUp />,
    tone: "emerald",
    title: "Trend Radar",
    desc: "Shape timely content around creator-friendly Indian trends before your feed feels late.",
  },
  {
    icon: <Layers />,
    tone: "blue",
    title: "Repurpose",
    desc: "Transform one strong idea into a Reel script, thread, carousel, and LinkedIn post.",
  },
];

const studioTools = [
  {
    icon: <Languages />,
    title: "Local voice",
    copy: "Blend English, Hindi, and Hinglish without losing your tone.",
  },
  {
    icon: <Repeat2 />,
    title: "Regenerate fast",
    copy: "Try sharper hooks, calmer captions, or a bolder CTA in one pass.",
  },
  {
    icon: <FileDown />,
    title: "Export ready",
    copy: "Keep calendars and post briefs ready for PDF workflows.",
  },
];

const workflowSteps = [
  "Set niche, platform, language, tone, and monthly goal.",
  "Pick custom days or use smart posting rhythm presets.",
  "Generate titles first, then expand any day into a full post.",
  "Repurpose winners into short-form, carousel, and LinkedIn variants.",
];

const proofStats = [
  { value: "60s", label: "from idea to month plan" },
  { value: "30", label: "calendar slots per cycle" },
  { value: "4x", label: "repurpose paths per idea" },
  { value: "3", label: "AI provider fallback plan" },
];

const sampleDays = ["01", "03", "05", "08", "10", "12", "15", "17", "19", "22", "24", "29"];

export default function LandingPage() {
  return (
    <main className="landing-shell">
      <section className="landing-hero" aria-labelledby="landing-title">
        <div className="landing-hero-copy">
          <p className="landing-kicker">
            <Sparkles size={16} />
            AI content command center for Indian creators
          </p>
          <h1 id="landing-title">
            Create. Srijan. <span>Succeed.</span>
          </h1>
          <p className="landing-hero-text">
            The AI-powered creative partner for the next generation of Indian
            creators. Go from a loose idea to a month of content with a planner,
            studio, and repurposing workflow built around your voice.
          </p>
          <div className="landing-actions" aria-label="Primary actions">
            <NeonButton href="/sign-up">
              Get Started Free <ArrowRight size={18} />
            </NeonButton>
            <NeonButton href="#demo" variant="outline">
              <Play size={17} /> View Demo
            </NeonButton>
          </div>
          <div className="landing-proof-strip" aria-label="Product highlights">
            <span>Hinglish ready</span>
            <span>Calendar first</span>
            <span>Multi-platform output</span>
          </div>
        </div>

        <div className="landing-visual" id="demo" aria-label="SrijanAI planner preview">
          <GlassCard className="planner-console">
            <div className="console-topbar">
              <span>SrijanAI Studio</span>
              <span className="live-pill">Live plan</span>
            </div>
            <div className="console-prompt">
              <span>Prompt</span>
              <p>Fitness creator, Hindi-English tone, 12 posts for April</p>
            </div>
            <div className="console-grid" aria-label="Selected content days">
              {sampleDays.map((day, index) => (
                <div
                  className={index % 3 === 0 ? "console-day is-hot" : "console-day"}
                  key={day}
                >
                  <span>{day}</span>
                  <small>{index % 2 === 0 ? "Reel" : "Post"}</small>
                </div>
              ))}
            </div>
            <div className="console-output">
              <div>
                <span className="output-label">Generated angle</span>
                <strong>3 morning mistakes slowing your fitness progress</strong>
              </div>
              <CheckCircle2 size={22} />
            </div>
          </GlassCard>
        </div>
      </section>

      <section className="proof-stats" aria-label="SrijanAI product stats">
        {proofStats.map((stat) => (
          <div className="proof-stat" key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      <section className="landing-section" aria-labelledby="features-title">
        <div className="section-heading">
          <p className="section-label">Creator toolkit</p>
          <h2 id="features-title">Everything starts with one idea.</h2>
          <p>
            Plan the month, generate the content, and stretch strong ideas into
            platform-specific assets without opening ten tabs.
          </p>
        </div>
        <div className="feature-grid">
          {featureCards.map((feature) => (
            <FeatureCard
              desc={feature.desc}
              icon={feature.icon}
              key={feature.title}
              title={feature.title}
              tone={feature.tone}
            />
          ))}
        </div>
      </section>

      <section className="landing-split">
        <GlassCard className="studio-panel">
          <p className="section-label">Inside the studio</p>
          <h2>Built for creators who ship in public, daily.</h2>
          <p>
            SrijanAI keeps the workflow structured: brand context first, calendar
            next, generation after that. The result feels like a creative ops
            desk, not an empty chatbot.
          </p>
          <div className="studio-tool-list">
            {studioTools.map((tool) => (
              <div className="studio-tool" key={tool.title}>
                <div className="studio-tool-icon">{tool.icon}</div>
                <div>
                  <h3>{tool.title}</h3>
                  <p>{tool.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="workflow-panel">
          <p className="section-label">Workflow</p>
          <h2>From raw idea to a publishable month.</h2>
          <div className="workflow-list">
            {workflowSteps.map((step, index) => (
              <div className="workflow-step" key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="trend-band" aria-label="Trend and repurposing preview">
        <div>
          <p className="section-label">Trend radar</p>
          <h2>Stay timely without chasing noise.</h2>
          <p>
            Track useful creative signals, convert them into angles for your
            niche, and turn the best one into formats for each platform.
          </p>
        </div>
        <div className="trend-cards">
          <GlassCard className="trend-card">
            <Radar className="trend-icon-orange" />
            <span>Rising angle</span>
            <strong>Creator routines that actually work</strong>
          </GlassCard>
          <GlassCard className="trend-card">
            <ClipboardList className="trend-icon-blue" />
            <span>Repurpose queue</span>
            <strong>Reel, carousel, thread, newsletter</strong>
          </GlassCard>
        </div>
      </section>

      <section className="landing-cta">
        <p className="section-label">Start simple</p>
        <h2>Your next month of content can start today.</h2>
        <p>
          Bring the idea. SrijanAI will help shape the calendar, write the first
          pass, and keep the workflow moving.
        </p>
        <NeonButton href="/sign-up">
          Build my content plan <ArrowRight size={18} />
        </NeonButton>
      </section>
    </main>
  );
}

type FeatureCardProps = {
  icon: ReactNode;
  title: string;
  desc: string;
  tone: string;
};

function FeatureCard({ icon, title, desc, tone }: FeatureCardProps) {
  return (
    <GlassCard className={`feature-glass-card feature-tone-${tone}`}>
      <div className="feature-glass-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </GlassCard>
  );
}
