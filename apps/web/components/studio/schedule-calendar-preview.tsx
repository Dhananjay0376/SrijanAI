"use client";

import { WEEKDAY_LABELS, type SchedulePreview } from "../../lib/schedule";

type ScheduleCalendarPreviewProps = {
  preview: SchedulePreview;
  generatedTitlesByDate?: Record<string, string>;
  isGenerating?: boolean;
};

export function ScheduleCalendarPreview({
  preview,
  generatedTitlesByDate = {},
  isGenerating = false,
}: ScheduleCalendarPreviewProps) {
  return (
    <div className="schedule-calendar-shell">
      <div className="schedule-calendar-header">
        <div>
          <p className="section-label">Preview Calendar</p>
          <h3>{preview.monthLabel}</h3>
        </div>
        <p>{preview.highlightedDates.length} posts highlighted</p>
      </div>

      <div className="schedule-calendar-grid" role="grid" aria-label={preview.monthLabel}>
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="schedule-weekday">
            {label}
          </div>
        ))}

        {preview.calendarDays.map((day) => (
          <div
            key={day.isoKey}
            className={`schedule-day ${
              day.isCurrentMonth ? "is-current-month" : "is-outside-month"
            } ${day.isHighlighted ? "is-highlighted" : ""}`}
            role="gridcell"
            aria-selected={day.isHighlighted}
          >
            <div className="schedule-day-topline">
              <span>{day.dayNumber}</span>
              {day.isHighlighted && generatedTitlesByDate[day.isoKey] ? (
                <small>AI</small>
              ) : null}
            </div>

            {day.isHighlighted ? (
              generatedTitlesByDate[day.isoKey] ? (
                <p className="schedule-day-title">{generatedTitlesByDate[day.isoKey]}</p>
              ) : (
                <p className="schedule-day-placeholder">
                  {isGenerating ? "Generating title..." : "Selected posting day"}
                </p>
              )
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
