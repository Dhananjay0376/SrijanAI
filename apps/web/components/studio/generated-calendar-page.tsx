"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlassCard } from "../ui/GlassCard";
import { generatePostDetails } from "../../lib/api";
import { type ScheduleGenerationState } from "../../lib/schedule";
import { GeneratedCalendarBoard } from "./generated-calendar-board";

const STORAGE_KEY = "srijanai.generated-calendar";

type PostStatus = "pending" | "confirmed" | "declined";

type GeneratedPostDetailsState = {
  title: string;
  hook: string;
  caption: string;
  hashtags: string[];
  cta: string;
  platformTips: string[];
  metaSummary?: string;
};

export function GeneratedCalendarPage() {
  const router = useRouter();
  const [data, setData] = useState<ScheduleGenerationState | null>(null);
  const [loadingPostDay, setLoadingPostDay] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [statuses, setStatuses] = useState<Record<string, PostStatus>>({});
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [generatedPosts, setGeneratedPosts] = useState<Record<string, GeneratedPostDetailsState>>(
    {},
  );

  useEffect(() => {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw) as ScheduleGenerationState;
      setData(parsed);
      setStatuses(
        parsed.dates.reduce<Record<string, PostStatus>>((accumulator, item) => {
          accumulator[item.isoKey] = "pending";
          return accumulator;
        }, {}),
      );
      setSelectedDay(parsed.dates[0]?.isoKey ?? null);
    } catch {
      setErrorMessage("Unable to load the generated calendar from this session.");
    }
  }, []);

  const calendarDayMap = useMemo(() => {
    if (!data) {
      return new Map<string, { isoKey: string; title: string }>();
    }

    return new Map(data.dates.map((item) => [item.isoKey, item]));
  }, [data]);

  async function handleGeneratePost(isoKey: string) {
    if (!data) {
      return;
    }

    const dayEntry = calendarDayMap.get(isoKey);

    if (!dayEntry) {
      return;
    }

    setLoadingPostDay(isoKey);
    setErrorMessage("");

    try {
      const result = await generatePostDetails({
        calendarId: `preview-${data.month}-${data.year}`,
        day: isoKey,
        platform: data.platform,
        tone: data.tone,
        language: data.language,
        title: dayEntry.title,
        topic: data.niche,
      });

      setGeneratedPosts((current) => ({
        ...current,
        [isoKey]: {
          title: result.post.title,
          hook: result.post.hook,
          caption: result.post.caption,
          hashtags: result.post.hashtags,
          cta: result.post.cta,
          platformTips: result.post.platformTips,
          metaSummary: result.meta?.provider
            ? `Generated with ${result.meta.provider}${typeof result.meta.durationMs === "number" ? ` in ${result.meta.durationMs}ms` : ""}.`
            : undefined,
        },
      }));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to generate the full post right now.",
      );
    } finally {
      setLoadingPostDay(null);
    }
  }

  if (!data) {
    return (
      <main className="studio-shell">
        <section className="studio-hero">
          <div>
            <p className="studio-kicker">AI content lab</p>
            <h1>Generated calendar not found</h1>
            <p>Generate a calendar first, then we’ll bring you back here.</p>
          </div>
        </section>

        <GlassCard className="studio-input-card schedule-context-card">
          <div className="studio-card-heading">
            <div>
              <p className="section-label">Next Step</p>
              <h2>Return to schedule builder</h2>
            </div>
            <Link className="schedule-back-link" href="/dashboard/create-plan/schedule">
              Back to schedule
            </Link>
          </div>
        </GlassCard>
      </main>
    );
  }

  return (
    <main className="studio-shell">
      <section className="studio-hero">
        <div>
          <p className="studio-kicker">AI content lab</p>
          <h1>Monthly calendar generated</h1>
          <p>
            Review each scheduled title, confirm or decline it, and use Gen to create
            the full post package for any selected day.
          </p>
        </div>
        <GlassCard className="studio-system-card">
          <span>Workflow status</span>
          <strong>Calendar ready</strong>
          <p>Titles are generated. Full post generation happens day by day.</p>
          <div className="studio-score-track">
            <div style={{ width: "100%" }} />
          </div>
        </GlassCard>
      </section>

      <GlassCard className="studio-input-card schedule-context-card">
        <div className="studio-card-heading">
          <div>
            <p className="section-label">Flow Controls</p>
            <h2>Continue refining your month</h2>
          </div>
          <div className="generated-calendar-link-row">
            <Link className="schedule-back-link" href="/dashboard/create-plan/schedule">
              Back to schedule
            </Link>
            <button
              type="button"
              className="schedule-back-link"
              onClick={() => {
                window.sessionStorage.removeItem(STORAGE_KEY);
                router.push("/dashboard/create-plan");
              }}
            >
              Start over
            </button>
          </div>
        </div>
      </GlassCard>

      <GeneratedCalendarBoard
        data={data}
        errorMessage={errorMessage}
        generatedPosts={generatedPosts}
        loadingPostDay={loadingPostDay}
        onSelectDay={setSelectedDay}
        onGeneratePost={handleGeneratePost}
        onSetStatus={(isoKey, status) =>
          setStatuses((current) => ({
            ...current,
            [isoKey]: status,
          }))
        }
        selectedDay={selectedDay}
        statuses={statuses}
      />
    </main>
  );
}
