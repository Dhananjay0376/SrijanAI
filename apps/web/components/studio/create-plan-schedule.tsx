"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { ScheduleBuilderSection } from "./schedule-builder-section";
import { generateMonthlyCalendar } from "../../lib/api";
import {
  buildSchedulePreview,
  sanitizeMonthlyCount,
  toIsoDateKey,
  type ScheduleDistribution,
  type ScheduleGenerationState,
} from "../../lib/schedule";

const PLATFORM_LABELS: Record<string, string> = {
  instagram: "Instagram",
  youtube: "YouTube",
  twitter: "Twitter",
  linkedin: "LinkedIn",
};

const NICHE_LABELS: Record<string, string> = {
  exams: "Exam Tips",
  motivation: "Motivation",
  startup: "Startup",
  astrology: "Astrology",
  finance: "Finance",
  fitness: "Fitness",
  cooking: "Cooking",
  discipline: "Self Discipline",
  fashion: "Fashion",
  tech: "Tech Tips",
  custom: "Custom",
};

export function CreatePlanSchedule() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [monthlyCountMode, setMonthlyCountMode] = useState<"preset" | "custom">("preset");
  const [selectedMonthlyCount, setSelectedMonthlyCount] = useState(12);
  const [customMonthlyCount, setCustomMonthlyCount] = useState("18");
  const [distribution, setDistribution] =
    useState<ScheduleDistribution>("mon-wed-fri");
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [metaSummary, setMetaSummary] = useState("");
  const [generatedTitlesByDate, setGeneratedTitlesByDate] = useState<Record<string, string>>(
    {},
  );

  const platform = searchParams.get("platform") ?? "instagram";
  const niche = searchParams.get("niche") ?? "exams";
  const tone = searchParams.get("tone") ?? "Energetic (Gen Z)";
  const language = searchParams.get("language") ?? "Hinglish";
  const topic = searchParams.get("topic")?.trim() ?? "";
  const displayTopic =
    niche === "custom" ? topic || "Your custom idea" : NICHE_LABELS[niche] ?? "Exam Tips";
  const platformLabel = PLATFORM_LABELS[platform] ?? "Instagram";

  const requestedMonthlyCount = useMemo(() => {
    if (monthlyCountMode === "custom") {
      return sanitizeMonthlyCount(Number(customMonthlyCount || "1"));
    }

    return selectedMonthlyCount;
  }, [customMonthlyCount, monthlyCountMode, selectedMonthlyCount]);

  const preview = useMemo(
    () => buildSchedulePreview(requestedMonthlyCount, distribution),
    [distribution, requestedMonthlyCount],
  );
  const highlightedSignature = useMemo(
    () => preview.highlightedDates.map((date) => date.toISOString()).join("|"),
    [preview.highlightedDates],
  );

  useEffect(() => {
    setGeneratedTitlesByDate({});
    setMetaSummary("");
    setErrorMessage("");
  }, [highlightedSignature]);

  async function handleGenerateCalendar() {
    setIsGenerating(true);
    setErrorMessage("");
    setMetaSummary("");

    try {
      const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
        preview.monthStart,
      );
      const result = await generateMonthlyCalendar({
        profileId: "create-plan-schedule",
        month,
        year: preview.monthStart.getFullYear(),
        selectedDays: preview.highlightedDates.map((date) => date.getDate()),
        niche: displayTopic,
        platform: platformLabel,
        tone,
        language,
      });

      const nextTitlesByDate = preview.highlightedDates.reduce<Record<string, string>>((accumulator, date, index) => {
        const title = result.titles[index];

        if (title) {
          accumulator[toIsoDateKey(date)] = title;
        }

        return accumulator;
      }, {});

      const generatedState: ScheduleGenerationState = {
        platform: platformLabel,
        niche: displayTopic,
        tone,
        language,
        monthLabel: preview.monthLabel,
        month,
        year: preview.monthStart.getFullYear(),
        distribution,
        requestedMonthlyCount,
        generatedAt: new Date().toISOString(),
        dates: preview.highlightedDates.map((date, index) => ({
          isoKey: toIsoDateKey(date),
          dayNumber: date.getDate(),
          title: result.titles[index] || "Untitled post",
        })),
      };

      window.sessionStorage.setItem(
        "srijanai.generated-calendar",
        JSON.stringify(generatedState),
      );
      setMetaSummary(
        result.meta?.provider
          ? `Generated with ${result.meta.provider}${typeof result.meta.durationMs === "number" ? ` in ${result.meta.durationMs}ms` : ""}.`
          : "AI titles generated for this month.",
      );
      setGeneratedTitlesByDate(nextTitlesByDate);
      router.push("/dashboard/create-plan/generated");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to generate the monthly calendar right now.",
      );
    } finally {
      setIsGenerating(false);
    }
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
          <h1>Set your schedule</h1>
          <p>
            Choose your posting cadence for the next month and preview the exact
            highlighted dates before saving anything.
          </p>
        </div>
        <GlassCard className="studio-system-card">
          <span>Creator setup</span>
          <strong>{platformLabel} schedule</strong>
          <p>Your step 1 selections came with you to this page.</p>
          <div className="studio-score-track">
            <div style={{ width: "100%" }} />
          </div>
        </GlassCard>
      </section>

      <GlassCard className="studio-input-card schedule-context-card">
        <div className="studio-card-heading">
          <div>
            <p className="section-label">Step 1 Summary</p>
            <h2>Creator setup locked in</h2>
          </div>
          <Link className="schedule-back-link" href="/dashboard/create-plan">
            Edit setup
          </Link>
        </div>

        <div className="studio-setup-summary">
          <span>{platformLabel}</span>
          <span>{displayTopic}</span>
          <span>{tone}</span>
          <span>{language}</span>
        </div>
      </GlassCard>

      <section className="studio-stack">
        <ScheduleBuilderSection
          monthlyCountMode={monthlyCountMode}
          requestedMonthlyCount={requestedMonthlyCount}
          customMonthlyCount={customMonthlyCount}
          distribution={distribution}
          preview={preview}
          generatedTitlesByDate={generatedTitlesByDate}
          hasGenerated={Object.keys(generatedTitlesByDate).length > 0}
          isGenerating={isGenerating}
          errorMessage={errorMessage}
          metaSummary={metaSummary}
          onCustomMonthlyCountChange={(value) => {
            setMonthlyCountMode("custom");
            setCustomMonthlyCount(value);
          }}
          onGenerateCalendar={handleGenerateCalendar}
          onDistributionChange={setDistribution}
          onSelectCustomMode={() => setMonthlyCountMode("custom")}
          onSelectPresetCount={(count) => {
            setMonthlyCountMode("preset");
            setSelectedMonthlyCount(count);
          }}
        />
      </section>
    </main>
  );
}
