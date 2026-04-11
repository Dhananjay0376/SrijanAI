"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Copy,
  Hash,
  BriefcaseBusiness,
  Camera,
  Loader2,
  MessageCircle,
  RefreshCcw,
  Send,
  Sparkles,
  Video,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";

const platforms = [
  {
    id: "instagram",
    icon: <Camera />,
    label: "Reel",
    channel: "Instagram",
    format: "45-sec hook-first Reel",
    accent: "orange",
  },
  {
    id: "youtube",
    icon: <Video />,
    label: "Short",
    channel: "YouTube",
    format: "60-sec retention Short",
    accent: "red",
  },
  {
    id: "twitter",
    icon: <MessageCircle />,
    label: "Thread",
    channel: "X / Twitter",
    format: "7-part punchy thread",
    accent: "blue",
  },
  {
    id: "linkedin",
    icon: <BriefcaseBusiness />,
    label: "Post",
    channel: "LinkedIn",
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
  const [platform, setPlatform] = useState("instagram");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState(tones[0]);
  const [language, setLanguage] = useState(languages[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

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
