"use client";

import type { ComponentProps } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  CalendarDays,
  Coins,
  Dumbbell,
  Flame,
  Laptop,
  Moon,
  Pencil,
  Rocket,
  ShoppingBag,
  Sparkles,
  Target,
  Utensils,
  Zap,
} from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { NeonButton } from "../ui/NeonButton";

const InstagramIcon = (props: ComponentProps<"svg">) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const YoutubeIcon = (props: ComponentProps<"svg">) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const TwitterIcon = (props: ComponentProps<"svg">) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon = (props: ComponentProps<"svg">) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const platforms = [
  { id: "instagram", icon: <InstagramIcon />, label: "Instagram", channel: "Instagram Reel", format: "45-sec hook-first Reel", accent: "orange" },
  { id: "youtube", icon: <YoutubeIcon />, label: "YouTube", channel: "YouTube Short", format: "60-sec retention Short", accent: "red" },
  { id: "twitter", icon: <TwitterIcon />, label: "Twitter", channel: "X / Twitter", format: "7-part punchy thread", accent: "blue" },
  { id: "linkedin", icon: <LinkedinIcon />, label: "LinkedIn", channel: "LinkedIn Post", format: "Authority-building post", accent: "violet" },
] as const;

const tones = ["Energetic (Gen Z)", "Professional", "Informative", "Funny/Sarcastic"] as const;
const languages = ["Hinglish", "English", "Hindi"] as const;

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
] as const;

export function ContentStudio() {
  const router = useRouter();
  const [platform, setPlatform] = useState<(typeof platforms)[number]["id"]>("instagram");
  const [topic, setTopic] = useState("");
  const [niche, setNiche] = useState<(typeof nicheList)[number]["id"]>(nicheList[0].id);
  const [tone, setTone] = useState<(typeof tones)[number]>(tones[0]);
  const [language, setLanguage] = useState<(typeof languages)[number]>(languages[0]);

  const activePlatform = platforms.find((item) => item.id === platform) ?? platforms[0];
  const activeNiche = nicheList.find((item) => item.id === niche) ?? nicheList[0];
  const currentTopic = niche === "custom" ? topic.trim() || "Your custom idea" : activeNiche.label;
  const promptScore = Math.min(100, 24 + (niche === "custom" ? topic.trim().length * 2 : 50));

  function handleAdvanceToSchedule() {
    const params = new URLSearchParams({
      platform,
      niche,
      tone,
      language,
    });

    if (niche === "custom" && topic.trim()) {
      params.set("topic", topic.trim());
    }

    router.push(`/dashboard/create-plan/schedule?${params.toString()}`);
  }

  return (
    <main className="studio-shell">
      <div className="cosmic-comets" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className={`comet comet-${index + 1}`} />
        ))}
      </div>

      <section className="studio-hero">
        <div>
          <p className="studio-kicker">
            <Sparkles size={16} />
            AI content lab
          </p>
          <h1>Content Studio</h1>
          <p>
            Shape your creator setup first, then build a local posting rhythm for the
            next month without leaving the page.
          </p>
        </div>
        <GlassCard className="studio-system-card">
          <span>System status</span>
          <strong>Schedule builder ready</strong>
          <p>Creator setup stays pinned while you preview the next month.</p>
          <div className="studio-score-track">
            <div style={{ width: `${promptScore}%` }} />
          </div>
        </GlassCard>
      </section>

      <section className="platform-grid" aria-label="Choose content platform">
        {platforms.map((item) => (
          <button
            aria-pressed={platform === item.id}
            className={`platform-tile platform-${item.accent} ${platform === item.id ? "is-selected" : ""}`}
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

      <section className="studio-stack">
        <GlassCard className="studio-input-card">
          <div className="studio-card-heading">
            <div>
              <p className="section-label">Step 1</p>
              <h2>Creator setup</h2>
            </div>
            <span>{activePlatform.channel}</span>
          </div>

          <div className="studio-setup-summary">
            <span>{currentTopic}</span>
            <span>{tone}</span>
            <span>{language}</span>
          </div>

          <div className="niche-selector">
            <p className="section-label">Your niche</p>
            <div className="niche-grid">
              {nicheList.map((item) => (
                <button
                  key={item.id}
                  className={`niche-card niche-${item.color} ${niche === item.id ? "is-selected" : ""}`}
                  onClick={() => setNiche(item.id)}
                  type="button"
                >
                  <div className="niche-icon">{item.icon}</div>
                  <span>{item.label}</span>
                  {item.id === "custom" ? (
                    <Pencil size={12} className="custom-indicator" />
                  ) : null}
                </button>
              ))}
            </div>
          </div>

          {niche === "custom" ? (
            <div className="studio-field custom-input-fade">
              <label htmlFor="content-topic">What is your custom niche/topic?</label>
              <textarea
                id="content-topic"
                onChange={(event) => setTopic(event.target.value)}
                placeholder="Describe your niche in detail..."
                value={topic}
              />
            </div>
          ) : null}

          <div className="studio-select-grid">
            <div className="studio-field">
              <label htmlFor="content-tone">Tone</label>
              <select id="content-tone" onChange={(event) => setTone(event.target.value as (typeof tones)[number])} value={tone}>
                {tones.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>
            <div className="studio-field">
              <label htmlFor="content-language">Language</label>
              <select id="content-language" onChange={(event) => setLanguage(event.target.value as (typeof languages)[number])} value={language}>
                {languages.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>

          <NeonButton as="button" className="studio-generate-button" onClick={handleAdvanceToSchedule} type="button">
            Set Schedule
            <CalendarDays size={18} />
          </NeonButton>
        </GlassCard>
      </section>
    </main>
  );
}
