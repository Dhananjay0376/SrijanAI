"use client";

<<<<<<< HEAD
import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Copy,
  Hash,
  Loader2,
  RefreshCcw,
  Send,
  Sparkles,
  BookOpen,
  Flame,
  Rocket,
  Moon,
  Coins,
  Dumbbell,
  Utensils,
  Zap,
  ShoppingBag,
  Laptop,
  Target,
  Pencil,
} from "lucide-react";
=======
import { useMemo, useRef, useState } from "react";
import { CheckCircle2, Copy, Hash, Loader2, RefreshCcw, Send, Sparkles } from "lucide-react";
>>>>>>> 2b51383e3ac657791597224922cb10127adab028
import { useUser } from "@clerk/nextjs";
import { GlassCard } from "../ui/GlassCard";
import { NeonButton } from "../ui/NeonButton";
import { generatePreview } from "../../lib/api";

const InstagramIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const YoutubeIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const TwitterIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const platforms = [
  {
    id: "instagram",
    icon: <InstagramIcon />,
    label: "Instagram",
    channel: "Instagram Reel",
    format: "45-sec hook-first Reel",
    accent: "orange",
  },
  {
    id: "youtube",
    icon: <YoutubeIcon />,
    label: "YouTube",
    channel: "YouTube Short",
    format: "60-sec retention Short",
    accent: "red",
  },
  {
    id: "twitter",
    icon: <TwitterIcon />,
    label: "Twitter",
    channel: "X / Twitter",
    format: "7-part punchy thread",
    accent: "blue",
  },
  {
    id: "linkedin",
    icon: <LinkedinIcon />,
    label: "LinkedIn",
    channel: "LinkedIn Post",
    format: "Authority-building post",
    accent: "violet",
  },
];

const tones = ["Energetic (Gen Z)", "Professional", "Informative", "Funny/Sarcastic"];
const languages = ["Hinglish", "English", "Hindi"];

const starters = [
  "5 hidden productivity hacks for Indian students",
  "How solo creators can plan 30 days of content",
  "Budget AI tools every small business should try",
];

const nicheList = [
  { id: "exams", label: "Exam Tips", icon: <BookOpen size={24} />, color: "emerald" },
  { id: "motivation", label: "Motivation", icon: <Flame size={24} />, color: "orange" },
  { id: "startup", label: "Startup", icon: <Rocket size={24} />, color: "blue" },
  { id: "astrology", label: "Astrology", icon: <Moon size={24} />, color: "violet" },
  { id: "finance", label: "Finance", icon: <Coins size={24} />, color: "yellow" },
  { id: "fitness", label: "Fitness", icon: <Dumbbell size={24} />, color: "red" },
  { id: "cooking", label: "Cooking", icon: <Utensils size={24} />, color: "amber" },
  { id: "discipline", label: "Self Discipline", icon: <Zap size={24} />, color: "cyan" },
  { id: "fashion", label: "Fashion", icon: <ShoppingBag size={24} />, color: "pink" },
  { id: "tech", label: "Tech Tips", icon: <Laptop size={24} />, color: "indigo" },
  { id: "custom", label: "Custom", icon: <Target size={24} />, color: "slate" },
];

export function ContentStudio() {
  const { user } = useUser();
  const [platform, setPlatform] = useState("instagram");
  const [topic, setTopic] = useState("");
  const [niche, setNiche] = useState(nicheList[0].id);
  const [tone, setTone] = useState(tones[0]);
  const [language, setLanguage] = useState(languages[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
<<<<<<< HEAD

  const activeNiche = nicheList.find(n => n.id === niche) ?? nicheList[0];
  const workbenchRef = useRef<HTMLElement>(null);

  const scrollToWorkbench = () => {
    workbenchRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const activePlatform = platforms.find((item) => item.id === platform) ?? platforms[0];
  const currentTopic = niche === "custom" ? (topic || "Your custom idea") : activeNiche.label;
  const promptScore = Math.min(100, 24 + (niche === "custom" ? topic.length * 2 : 50));
  const normalizedTopic = currentTopic;

  const generatedContent = useMemo(
    () => buildGeneratedContent(normalizedTopic, activePlatform.channel, tone, language),
    [activePlatform.channel, language, normalizedTopic, tone],
  );

  function handleGenerate() {
=======
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<ReturnType<typeof buildGeneratedContent> | null>(null);
  const [generationMeta, setGenerationMeta] = useState<{
    provider?: string;
    attempts?: number;
    durationMs?: number;
  } | null>(null);
  const studioMainRef = useRef<HTMLElement>(null);

  const activePlatform = platforms.find((item) => item.id === platform) ?? platforms[0];
  const promptScore = Math.min(100, 24 + topic.trim().length * 2);
  const normalizedTopic = topic.trim() || "5 hidden productivity hacks for Indian students";
  const previewContent = useMemo(
    () => buildGeneratedContent(normalizedTopic, activePlatform.channel, tone, language),
    [activePlatform.channel, language, normalizedTopic, tone],
  );
  const generatedContent = generatedDraft ?? previewContent;

  const handleScrollToContent = () => {
    studioMainRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  async function handleGenerate() {
    setCopied(false);
    setErrorMessage("");
>>>>>>> 2b51383e3ac657791597224922cb10127adab028
    setIsGenerating(true);
    try {
      const result = await generatePreview({
        topic: normalizedTopic,
        platform: activePlatform.label,
        tone,
        language,
      });

      setGeneratedDraft({
        title: result.title,
        body: `${result.hook}\n\n${result.caption}`,
        tags: result.hashtags?.map((tag) => tag.replace(/^#/, "")) || [],
      });
      setGenerationMeta(result.meta ?? null);
      setHasGenerated(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to generate content right now.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleCopy() {
    const text = [
      generatedContent.title,
      generatedContent.body,
      generatedContent.tags.map((tag) => `#${tag}`).join(" "),
    ]
      .filter(Boolean)
      .join("\n\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
  }

  return (
    <main className="studio-shell">
      <div className="cosmic-comets" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className={`comet comet-${index + 1}`} />
        ))}
      </div>

      <section className="dashboard-intro">
        <p className="section-label">DASHBOARD</p>
        <h1 className="dashboard-greeting">
          Good morning, {user?.firstName ?? "Creator"} ☀️
        </h1>
        <p className="dashboard-subtitle">Create your first content plan to get started.</p>

        <div className="dashboard-empty-state">
          <div className="empty-state-box">
            <div className="empty-state-icon">
              <Sparkles size={24} />
            </div>
            <h2>No plans yet</h2>
            <button className="create-plan-button" onClick={scrollToWorkbench}>
              + Create First Plan
            </button>
          </div>
        </div>
      </section>

      <div className="content-anchor" ref={workbenchRef as any} />

      <section className="studio-hero">
        <div>
          <p className="studio-kicker">
            <Sparkles size={16} />
            AI content lab
          </p>
          <h1>Content Studio</h1>
          <p>
            Craft your next viral piece with a focused AI workflow for Indian
            creators. Pick the platform, tune the voice, and preview a ready
            draft before you move it into your calendar.
          </p>
        </div>
        <GlassCard className="studio-system-card">
          <span>System status</span>
          <strong>Creative engine ready</strong>
          <p>Prompt score updates live as you add context.</p>
          <div className="studio-score-track">
            <div style={{ width: `${promptScore}%` }} />
          </div>
        </GlassCard>
      </section>

      <section className="platform-grid" aria-label="Choose content platform">
        {platforms.map((item) => (
          <button
            aria-pressed={platform === item.id}
            className={`platform-tile platform-${item.accent} ${
              platform === item.id ? "is-selected" : ""
            }`}
            key={item.id}
            onClick={() => setPlatform(item.id)}
            type="button"
          >
            {item.icon}
            <span>{item.label}</span>
            <small>{item.format}</small>
          </button>
        ))}
      </section>

      <section className="studio-workbench">
        <GlassCard className="studio-input-card">
          <div className="studio-card-heading">
            <div>
              <p className="section-label">Prompt builder</p>
              <h2>Choose your niche</h2>
            </div>
            <span>{activePlatform.channel}</span>
          </div>

          <div className="niche-selector">
            <p className="section-label">YOUR NICHE</p>
            <div className="niche-grid">
              {nicheList.map((item) => (
                <button
                  key={item.id}
                  className={`niche-card niche-${item.color} ${niche === item.id ? 'is-selected' : ''}`}
                  onClick={() => setNiche(item.id)}
                  type="button"
                >
                  <div className="niche-icon">{item.icon}</div>
                  <span>{item.label}</span>
                  {item.id === "custom" && <Pencil size={12} className="custom-indicator" />}
                </button>
              ))}
            </div>
          </div>

          {niche === "custom" && (
            <div className="studio-field custom-input-fade">
              <label htmlFor="content-topic">What is your custom niche/topic?</label>
              <textarea
                id="content-topic"
                onChange={(event) => setTopic(event.target.value)}
                placeholder="Describe your niche in detail..."
                value={topic}
              />
            </div>
          )}

          <div className="starter-row" aria-label="Topic starters">
            {starters.map((starter) => (
              <button key={starter} onClick={() => setTopic(starter)} type="button">
                {starter}
              </button>
            ))}
          </div>

          <div className="studio-select-grid">
            <div className="studio-field">
              <label htmlFor="content-tone">Tone</label>
              <select
                id="content-tone"
                onChange={(event) => setTone(event.target.value)}
                value={tone}
              >
                {tones.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>
            <div className="studio-field">
              <label htmlFor="content-language">Language</label>
              <select
                id="content-language"
                onChange={(event) => setLanguage(event.target.value)}
                value={language}
              >
                {languages.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>

          <NeonButton
            as="button"
            className="studio-generate-button"
            onClick={handleGenerate}
            type="button"
          >
            {isGenerating ? (
              <>
                <Loader2 className="studio-spin" size={18} />
                Generating
              </>
            ) : (
              <>
                Generate Content
                <Sparkles size={18} />
              </>
            )}
          </NeonButton>
        </GlassCard>

        <GlassCard className="studio-output-card">
          <div className="studio-card-heading">
            <div>
              <p className="section-label">Live preview</p>
              <h2>{activePlatform.label} draft</h2>
            </div>
            <span>{language}</span>
          </div>

          <div className={`output-device output-${activePlatform.accent}`}>
            <div className="output-toolbar">
              <span>{activePlatform.channel}</span>
              <span>{tone}</span>
            </div>
            <h3>{generatedContent.title}</h3>
            <p>{generatedContent.body}</p>
            <div className="hashtag-row">
              {generatedContent.tags.map((tag) => (
                <span key={tag}>
                  <Hash size={13} />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {errorMessage ? (
            <p className="studio-helper-row" role="alert">
              {errorMessage}
            </p>
          ) : null}

          {generationMeta ? (
            <p className="studio-helper-row">
              {generationMeta.provider ? `Provider: ${generationMeta.provider}` : "AI preview ready"}
              {typeof generationMeta.durationMs === "number"
                ? ` • ${generationMeta.durationMs}ms`
                : ""}
            </p>
          ) : null}

          <div className="studio-action-row">
            <button onClick={handleCopy} type="button">
              <Copy size={16} />
              {copied ? "Copied" : "Copy draft"}
            </button>
            <button onClick={handleGenerate} type="button">
              <RefreshCcw size={16} />
              Regenerate
            </button>
            <button type="button">
              <Send size={16} />
              Add to plan
            </button>
          </div>

          <div className="studio-checklist">
            {[
              "Hook-first opening",
              `${activePlatform.format}`,
              `${language} voice pass`,
              hasGenerated ? "Fresh AI variation ready" : "Preview mode active",
            ].map((item) => (
              <span key={item}>
                <CheckCircle2 size={15} />
                {item}
              </span>
            ))}
          </div>
        </GlassCard>
      </section>
    </main>
  );
}

function buildGeneratedContent(
  topic: string,
  platform: string,
  tone: string,
  language: string,
) {
  return {
    title: `Stop scrolling: ${topic}`,
    body: `Use this ${platform} angle in a ${tone.toLowerCase()} voice. Open with the pain, show one sharp example, then give a simple action step. Keep it ${language}, specific, and creator-native.`,
    tags: ["SrijanAI", "CreatorWorkflow", "ContentPlan"],
  };
}
