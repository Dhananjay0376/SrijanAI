"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlassCard } from "../ui/GlassCard";
import { generatePostDetails, listPostsByCalendar } from "../../lib/api";
import { type ScheduleGenerationState } from "../../lib/schedule";
import { GeneratedCalendarBoard } from "./generated-calendar-board";

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

export function GeneratedCalendarPage({
  initialData,
  initialPosts = [],
}: {
  initialData?: any;
  initialPosts?: Array<{
    id: string;
    calendarId: string;
    day: string;
    title: string;
    hook: string;
    caption: string;
    hashtags: string[];
    cta: string;
    platformTips: string[];
  }>;
}) {
  const router = useRouter();
  const [data, setData] = useState<ScheduleGenerationState | null>(null);
  const [loadingPostDay, setLoadingPostDay] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [statuses, setStatuses] = useState<Record<string, PostStatus>>({});
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [generatedPosts, setGeneratedPosts] = useState<Record<string, GeneratedPostDetailsState>>(
    {},
  );

  const mapGeneratedPost = (post: {
    day: string;
    title: string;
    hook: string;
    caption: string;
    hashtags: string[];
    cta: string;
    platformTips: string[];
  }) => ({
    title: post.title,
    hook: post.hook,
    caption: post.caption,
    hashtags: post.hashtags,
    cta: post.cta,
    platformTips: post.platformTips,
  });

  useEffect(() => {
    if (initialData) {
      const mappedData: ScheduleGenerationState = {
        platform: initialData.platform || "Instagram",
        niche: initialData.niche || "Exam Tips",
        tone: initialData.tone || "Energetic",
        language: initialData.language || "Hinglish",
        monthLabel: `${initialData.month} ${initialData.year}`,
        month: initialData.month,
        year: initialData.year,
        distribution: "mon-wed-fri", // Default or fetch from somewhere
        requestedMonthlyCount: initialData.days?.length || 0,
        generatedAt: initialData.createdAt || new Date().toISOString(),
        dates: (initialData.days || []).map((day: any) => ({
          isoKey: day.date,
          dayNumber: parseInt(day.date.split("-")[2], 10),
          title: day.title || "Untitled post",
        })),
      };
      
      setData(mappedData);
      setStatuses(
        (initialData.days || []).reduce((accumulator: Record<string, PostStatus>, day: any) => {
          accumulator[day.date] = day.status === "generated" ? "confirmed" : "pending";
          return accumulator;
        }, {}),
      );
      setGeneratedPosts(
        initialPosts.reduce<Record<string, GeneratedPostDetailsState>>((accumulator, post) => {
          accumulator[post.day] = mapGeneratedPost(post);
          return accumulator;
        }, {}),
      );
      setSelectedDay(initialData.days?.[0]?.date ?? null);
      return;
    }

    const raw = window.sessionStorage.getItem("srijanai.generated-calendar");

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

  useEffect(() => {
    if (!initialData?.id) {
      return;
    }

    if (initialPosts.length > 0) {
      return;
    }

    let isActive = true;

    listPostsByCalendar(initialData.id)
      .then((posts) => {
        if (!isActive) {
          return;
        }

        setGeneratedPosts(
          posts.reduce<Record<string, GeneratedPostDetailsState>>((accumulator, post) => {
            accumulator[post.day] = mapGeneratedPost(post);
            return accumulator;
          }, {}),
        );
      })
      .catch((error) => {
        if (!isActive) {
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load previously generated posts for this calendar.",
        );
      });

    return () => {
      isActive = false;
    };
  }, [initialData?.id, initialPosts]);

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

    setSelectedDay(isoKey);
    setLoadingPostDay(isoKey);
    setErrorMessage("");

    try {
      const result = await generatePostDetails({
        calendarId: initialData?.id || `preview-${data.month}-${data.year}`,
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
          metaSummary: result.warning
            ? result.meta?.provider
              ? `Generated with ${result.meta.provider}${typeof result.meta.durationMs === "number" ? ` in ${result.meta.durationMs}ms` : ""}. ${result.warning}`
              : result.warning
            : result.meta?.provider
              ? `Generated with ${result.meta.provider}${typeof result.meta.durationMs === "number" ? ` in ${result.meta.durationMs}ms` : ""}.`
              : undefined,
        },
      }));
      setStatuses((current) => ({
        ...current,
        [isoKey]: current[isoKey] === "declined" ? "declined" : "confirmed",
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
                window.sessionStorage.removeItem("srijanai.generated-calendar");
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
