"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlassCard } from "../ui/GlassCard";
import { generateMonthlyCalendar, generatePostDetails, listPostsByCalendar } from "../../lib/api";
import {
  buildSchedulePreviewForMonth,
  inferScheduleDistributionFromDates,
  type ScheduleGenerationState,
} from "../../lib/schedule";
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

const GENERATED_CALENDAR_STORAGE_KEY = "srijanai.generated-calendar";

function getCalendarContextStorageKey(calendarId: string) {
  return `srijanai.calendar-context:${calendarId}`;
}

function normalizeIsoDate(dateValue: string, year?: number, month?: string) {
  if (typeof dateValue !== "string") {
    return "";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return dateValue;
  }

  const monthNameMatch = dateValue.match(/^(\d{4})-([A-Za-z]+)-(\d{2})$/);
  if (monthNameMatch) {
    const parsed = new Date(`${monthNameMatch[2]} 1, ${monthNameMatch[1]}`);
    if (!Number.isNaN(parsed.getTime())) {
      return `${monthNameMatch[1]}-${`${parsed.getMonth() + 1}`.padStart(2, "0")}-${monthNameMatch[3]}`;
    }
  }

  const trailingDayMatch = dateValue.match(/(\d{1,2})$/);
  if (!trailingDayMatch || !year || !month) {
    return dateValue;
  }

  const parsedMonth = new Date(`${month} 1, ${year}`);
  if (Number.isNaN(parsedMonth.getTime())) {
    return dateValue;
  }

  return `${year}-${`${parsedMonth.getMonth() + 1}`.padStart(2, "0")}-${trailingDayMatch[1].padStart(2, "0")}`;
}

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
  const [isContinuingMonth, setIsContinuingMonth] = useState(false);
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
      let parsedContext: ScheduleGenerationState | null = null;
      const storedContext =
        typeof window !== "undefined" && initialData.id
          ? window.sessionStorage.getItem(getCalendarContextStorageKey(initialData.id))
          : null;
      if (storedContext) {
        try {
          parsedContext = JSON.parse(storedContext) as ScheduleGenerationState;
        } catch {
          parsedContext = null;
        }
      }
      const contextDates = new Map(
        (parsedContext?.dates || []).map((entry) => [entry.isoKey, entry]),
      );
      const initialDates = (initialData.days || []).map((day: any) => {
        const isoKey = normalizeIsoDate(day.date, initialData.year, initialData.month);
        const fallbackContextEntry = contextDates.get(isoKey);

        return {
          isoKey,
          dayNumber: parseInt(isoKey.split("-")[2] || "0", 10),
          title: day.title || fallbackContextEntry?.title || "Untitled post",
        };
      });
      const mergedDates =
        initialDates.length > 0
          ? initialDates
          : (parsedContext?.dates || []).map((entry) => ({
              isoKey: normalizeIsoDate(entry.isoKey, initialData.year, initialData.month),
              dayNumber: entry.dayNumber,
              title: entry.title || "Untitled post",
            }));
      const mappedData: ScheduleGenerationState = {
        platform: parsedContext?.platform || initialData.platform || "Instagram",
        niche: parsedContext?.niche || initialData.niche || "Exam Tips",
        tone: parsedContext?.tone || initialData.tone || "Energetic",
        language: parsedContext?.language || initialData.language || "Hinglish",
        monthLabel: `${initialData.month} ${initialData.year}`,
        month: initialData.month,
        year: initialData.year,
        distribution: parsedContext?.distribution || "mon-wed-fri",
        requestedMonthlyCount: parsedContext?.requestedMonthlyCount || mergedDates.length || 0,
        generatedAt: parsedContext?.generatedAt || initialData.createdAt || new Date().toISOString(),
        dates: mergedDates,
      };
      
      setData(mappedData);
      setStatuses(
        (initialData.days || []).reduce((accumulator: Record<string, PostStatus>, day: any) => {
          const isoKey = normalizeIsoDate(day.date, initialData.year, initialData.month);
          accumulator[isoKey] = day.status === "generated" ? "confirmed" : "pending";
          return accumulator;
        }, {}),
      );
      setGeneratedPosts(
        initialPosts.reduce<Record<string, GeneratedPostDetailsState>>((accumulator, post) => {
          accumulator[post.day] = mapGeneratedPost(post);
          return accumulator;
        }, {}),
      );
      setSelectedDay(null);
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
      setSelectedDay(null);
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

  async function handleContinueToNextMonth() {
    if (!data || !initialData?.id || !initialData?.userId) {
      return;
    }

    const currentDates = data.dates.map((item) => new Date(`${item.isoKey}T00:00:00`));
    if (currentDates.length === 0) {
      return;
    }

    const inferredDistribution =
      inferScheduleDistributionFromDates(currentDates) || data.distribution;
    const currentMonthStart = new Date(
      currentDates[0].getFullYear(),
      currentDates[0].getMonth(),
      1,
    );
    const nextMonthStart = new Date(
      currentMonthStart.getFullYear(),
      currentMonthStart.getMonth() + 1,
      1,
    );
    const nextPreview = buildSchedulePreviewForMonth(
      data.requestedMonthlyCount,
      inferredDistribution,
      nextMonthStart,
    );

    setIsContinuingMonth(true);
    setErrorMessage("");

    try {
      const nextMonth = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
        nextMonthStart,
      );
      const previousTitles = Array.from(
        new Set(
          data.dates
            .map((item) => item.title.trim())
            .filter((title) => title.length > 0),
        ),
      );
      const result = await generateMonthlyCalendar({
        userId: initialData.userId,
        profileId: `continue-${initialData.id}`,
        month: nextMonth,
        year: nextMonthStart.getFullYear(),
        selectedDays: nextPreview.highlightedDates.map((date) => date.getDate()),
        niche: data.niche,
        platform: data.platform,
        tone: data.tone,
        language: data.language,
        previousTitles,
      });

      const nextState: ScheduleGenerationState = {
        platform: data.platform,
        niche: data.niche,
        tone: data.tone,
        language: data.language,
        monthLabel: nextPreview.monthLabel,
        month: nextMonth,
        year: nextMonthStart.getFullYear(),
        distribution: inferredDistribution,
        requestedMonthlyCount: nextPreview.highlightedDates.length,
        generatedAt: new Date().toISOString(),
        dates: nextPreview.highlightedDates.map((date, index) => ({
          isoKey: `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`,
          dayNumber: date.getDate(),
          title: result.titles[index] || "Untitled post",
        })),
      };

      window.sessionStorage.setItem(GENERATED_CALENDAR_STORAGE_KEY, JSON.stringify(nextState));
      if (result.calendar?.id) {
        window.sessionStorage.setItem(
          getCalendarContextStorageKey(result.calendar.id),
          JSON.stringify(nextState),
        );
        router.push(`/dashboard/calendar/${result.calendar.id}`);
        return;
      }

      router.push("/dashboard/create-plan/generated");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to continue this calendar into the next month.",
      );
    } finally {
      setIsContinuingMonth(false);
    }
  }

  if (!data) {
    return (
      <main className="studio-shell">
        <div className="cosmic-comets" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className={`comet comet-${index + 1}`} />
          ))}
        </div>
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
      <div className="cosmic-comets" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className={`comet comet-${index + 1}`} />
        ))}
      </div>
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
            {initialData?.id ? (
              <button
                type="button"
                className="schedule-back-link"
                disabled={isContinuingMonth}
                onClick={handleContinueToNextMonth}
              >
                {isContinuingMonth ? "Continuing..." : "Continue to next month"}
              </button>
            ) : null}
            <button
              type="button"
              className="schedule-back-link"
              onClick={() => {
                window.sessionStorage.removeItem(GENERATED_CALENDAR_STORAGE_KEY);
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
