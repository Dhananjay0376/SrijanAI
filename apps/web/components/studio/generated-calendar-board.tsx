"use client";

import { Check, Loader2, Sparkles, X } from "lucide-react";
import { type ScheduleGenerationState } from "../../lib/schedule";

type PostStatus = "pending" | "confirmed" | "declined";

type GeneratedPostDetails = {
  title: string;
  hook: string;
  caption: string;
  hashtags: string[];
  cta: string;
  platformTips: string[];
  metaSummary?: string;
};

type GeneratedCalendarBoardProps = {
  data: ScheduleGenerationState;
  statuses: Record<string, PostStatus>;
  generatedPosts: Record<string, GeneratedPostDetails>;
  loadingPostDay: string | null;
  errorMessage: string;
  selectedDay: string | null;
  onSetStatus: (isoKey: string, status: PostStatus) => void;
  onGeneratePost: (isoKey: string) => void;
  onSelectDay: (isoKey: string) => void;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function GeneratedCalendarBoard({
  data,
  statuses,
  generatedPosts,
  loadingPostDay,
  errorMessage,
  selectedDay,
  onSetStatus,
  onGeneratePost,
  onSelectDay,
}: GeneratedCalendarBoardProps) {
  const monthStart = new Date(data.year, new Date(`${data.month} 1, ${data.year}`).getMonth(), 1);
  const firstWeekday = monthStart.getDay();
  const daysInMonth = new Date(data.year, monthStart.getMonth() + 1, 0).getDate();
  const titleMap = new Map(data.dates.map((entry) => [entry.isoKey, entry]));
  const cells: Array<{ isoKey: string; dayNumber: number; isCurrentMonth: boolean }> = [];

  for (let index = 0; index < firstWeekday; index += 1) {
    cells.push({
      isoKey: `empty-before-${index}`,
      dayNumber: 0,
      isCurrentMonth: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(data.year, monthStart.getMonth(), day);
    const monthValue = `${date.getMonth() + 1}`.padStart(2, "0");
    const dayValue = `${day}`.padStart(2, "0");
    cells.push({
      isoKey: `${data.year}-${monthValue}-${dayValue}`,
      dayNumber: day,
      isCurrentMonth: true,
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push({
      isoKey: `empty-after-${cells.length}`,
      dayNumber: 0,
      isCurrentMonth: false,
    });
  }

  const pendingCount = Object.values(statuses).filter((status) => status === "pending").length;
  const confirmedCount = Object.values(statuses).filter((status) => status === "confirmed").length;
  const generatedCount = Object.keys(generatedPosts).length;

  return (
    <section className="generated-calendar-shell">
      <div className="generated-calendar-topbar">
        <div>
          <p className="section-label">Generated Calendar</p>
          <h2>
            {data.niche} · {data.platform} · {data.language}
          </h2>
          <p>{data.monthLabel}</p>
        </div>

        <div className="generated-calendar-stats">
          <span>{pendingCount} pending</span>
          <span>{confirmedCount} confirmed</span>
          <span>{generatedCount} generated</span>
        </div>
      </div>

      {errorMessage ? (
        <p className="schedule-error-note generated-calendar-error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <div className="generated-calendar-grid" role="grid" aria-label={data.monthLabel}>
        {WEEKDAYS.map((day) => (
          <div key={day} className="generated-calendar-weekday">
            {day}
          </div>
        ))}

        {cells.map((cell) => {
          const scheduled = titleMap.get(cell.isoKey);
          const status = statuses[cell.isoKey] ?? "pending";
          const isLoading = loadingPostDay === cell.isoKey;

          return (
            <div
              key={cell.isoKey}
              className={`generated-calendar-day ${
                scheduled ? "is-scheduled" : ""
              } ${cell.isCurrentMonth ? "is-current-month" : "is-filler"} ${
                selectedDay === cell.isoKey ? "is-selected" : ""
              }`}
              role="gridcell"
            >
              {cell.isCurrentMonth ? (
                <>
                  <div className="generated-day-topline">
                    <span>{cell.dayNumber}</span>
                    {scheduled ? (
                      <small className={`generated-status-chip is-${status}`}>{status}</small>
                    ) : null}
                  </div>

                  {scheduled ? (
                    <>
                      <p className="generated-day-title">{scheduled.title}</p>

                      <div className="generated-day-actions">
                        <button
                          type="button"
                          className={`generated-action-button is-confirm ${
                            status === "confirmed" ? "is-active" : ""
                          }`}
                          onClick={() => onSetStatus(cell.isoKey, "confirmed")}
                        >
                          <Check size={13} />
                        </button>
                        <button
                          type="button"
                          className={`generated-action-button is-decline ${
                            status === "declined" ? "is-active" : ""
                          }`}
                          onClick={() => onSetStatus(cell.isoKey, "declined")}
                        >
                          <X size={13} />
                        </button>
                        <button
                          type="button"
                          className="generated-action-button is-generate"
                          onClick={() => onGeneratePost(cell.isoKey)}
                        >
                          {isLoading ? <Loader2 className="studio-spin" size={13} /> : <Sparkles size={13} />}
                          Gen
                        </button>
                        <button
                          type="button"
                          className={`generated-action-button is-view ${
                            selectedDay === cell.isoKey ? "is-active" : ""
                          }`}
                          onClick={() => onSelectDay(cell.isoKey)}
                        >
                          View
                        </button>
                      </div>
                    </>
                  ) : null}
                </>
              ) : null}
            </div>
          );
        })}
      </div>

      {selectedDay ? (
        (() => {
          const selectedEntry = titleMap.get(selectedDay);
          const fullPost = generatedPosts[selectedDay];

          if (!selectedEntry) {
            return null;
          }

          return (
            <div className="generated-post-panel generated-post-panel-expanded">
              <div className="generated-post-panel-header">
                <div>
                  <p className="section-label">Selected Day</p>
                  <strong>
                    Day {selectedEntry.dayNumber}: {selectedEntry.title}
                  </strong>
                </div>
                <small className={`generated-status-chip is-${statuses[selectedDay] ?? "pending"}`}>
                  {statuses[selectedDay] ?? "pending"}
                </small>
              </div>

              {fullPost ? (
                <>
                  <p>{fullPost.hook}</p>
                  <p>{fullPost.caption}</p>
                  <div className="generated-post-tag-row">
                    {fullPost.hashtags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <p className="generated-post-cta">CTA: {fullPost.cta}</p>
                  <div className="generated-post-tip-row">
                    {fullPost.platformTips.map((tip) => (
                      <span key={tip}>{tip}</span>
                    ))}
                  </div>
                  {fullPost.metaSummary ? (
                    <p className="schedule-meta-note">{fullPost.metaSummary}</p>
                  ) : null}
                </>
              ) : (
                <p>
                  This day has a generated title, but the full post is still empty. Use the
                  `Gen` button on the card to create the hook, caption, hashtags, CTA, and
                  platform tips.
                </p>
              )}
            </div>
          );
        })()
      ) : null}
    </section>
  );
}
