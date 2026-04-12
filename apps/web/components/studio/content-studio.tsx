"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Copy,
  Hash,
  Loader2,
  RefreshCcw,
  Send,
  Sparkles,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { GlassCard } from "../ui/GlassCard";
import { NeonButton } from "../ui/NeonButton";
import { useRef } from "react";

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

export function ContentStudio() {
  const { user } = useUser();
  const [platform, setPlatform] = useState("instagram");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState(tones[0]);
  const [language, setLanguage] = useState(languages[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const studioMainRef = useRef<HTMLElement>(null);

  const handleScrollToContent = () => {
    studioMainRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const activePlatform = platforms.find((item) => item.id === platform) ?? platforms[0];
  const promptScore = Math.min(100, 24 + topic.trim().length * 2);
  const normalizedTopic = topic.trim() || "5 hidden productivity hacks for Indian students";

  const generatedContent = useMemo(
    () => buildGeneratedContent(normalizedTopic, activePlatform.channel, tone, language),
    [activePlatform.channel, language, normalizedTopic, tone],
  );

  function handleGenerate() {
    setIsGenerating(true);
    window.setTimeout(() => {
      setHasGenerated(true);
      setIsGenerating(false);
    }, 650);
  }

  return (
    <main className="studio-shell">
      <div className="cosmic-comets" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={`comet comet-${i + 1}`} />
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
            <button className="create-plan-button" onClick={handleScrollToContent}>
              + Create First Plan
            </button>
          </div>
        </div>
      </section>

      <div className="content-anchor" ref={studioMainRef as any} />

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
              <h2>Shape the idea</h2>
            </div>
            <span>{activePlatform.channel}</span>
          </div>

          <div className="studio-field">
            <label htmlFor="content-topic">What is the topic?</label>
            <textarea
              id="content-topic"
              onChange={(event) => setTopic(event.target.value)}
              placeholder="e.g. 5 hidden productivity hacks for Indian students..."
              value={topic}
            />
            <div className="studio-helper-row">
              <span>{topic.trim().length} characters</span>
              <span>{promptScore}% prompt signal</span>
            </div>
          </div>

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

          <div className="studio-action-row">
            <button type="button">
              <Copy size={16} />
              Copy draft
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
