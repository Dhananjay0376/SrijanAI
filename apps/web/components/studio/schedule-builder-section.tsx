"use client";

import { CalendarDays, Loader2 } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { NeonButton } from "../ui/NeonButton";
import {
  type ScheduleDistribution,
  type SchedulePreview,
} from "../../lib/schedule";
import { ScheduleCalendarPreview } from "./schedule-calendar-preview";

const MONTHLY_PRESETS = [8, 12, 15, 30] as const;

const DISTRIBUTION_OPTIONS: Array<{
  value: ScheduleDistribution;
  label: string;
}> = [
  { value: "mon-wed-fri", label: "Mon/Wed/Fri" },
  { value: "tue-thu-sat", label: "Tue/Thu/Sat" },
  { value: "even-dates", label: "Even Dates" },
  { value: "odd-dates", label: "Odd Dates" },
  { value: "daily", label: "Daily" },
];

type ScheduleBuilderSectionProps = {
  monthlyCountMode: "preset" | "custom";
  requestedMonthlyCount: number;
  customMonthlyCount: string;
  distribution: ScheduleDistribution;
  preview: SchedulePreview;
  generatedTitlesByDate?: Record<string, string>;
  isGenerating?: boolean;
  canGenerate?: boolean;
  hasGenerated?: boolean;
  errorMessage?: string;
  metaSummary?: string;
  onSelectPresetCount: (count: number) => void;
  onSelectCustomMode: () => void;
  onCustomMonthlyCountChange: (value: string) => void;
  onDistributionChange: (value: ScheduleDistribution) => void;
  onGenerateCalendar: () => void;
};

export function ScheduleBuilderSection({
  monthlyCountMode,
  requestedMonthlyCount,
  customMonthlyCount,
  distribution,
  preview,
  generatedTitlesByDate = {},
  isGenerating = false,
  canGenerate = true,
  hasGenerated = false,
  errorMessage = "",
  metaSummary,
  onSelectPresetCount,
  onSelectCustomMode,
  onCustomMonthlyCountChange,
  onDistributionChange,
  onGenerateCalendar,
}: ScheduleBuilderSectionProps) {
  return (
    <GlassCard className="schedule-builder-card">
      <div className="studio-card-heading schedule-builder-heading">
        <div>
          <p className="section-label">Step 2</p>
          <h2>Set your schedule</h2>
          <p className="schedule-helper-copy">How often do you want to post?</p>
        </div>
        <span>{preview.monthLabel}</span>
      </div>

      <section className="schedule-builder-block">
        <div className="schedule-block-header">
          <h3>Posts per month</h3>
          <p>Choose a batch size for the next month preview.</p>
        </div>
        <div className="schedule-chip-grid">
          {MONTHLY_PRESETS.map((count) => (
            <button
              key={count}
              type="button"
              className={`schedule-choice-chip ${
                monthlyCountMode === "preset" && requestedMonthlyCount === count
                  ? "is-selected"
                  : ""
              }`}
              onClick={() => onSelectPresetCount(count)}
            >
              <strong>{count}</strong>
              <span>posts</span>
            </button>
          ))}
          <button
            type="button"
            className={`schedule-choice-chip schedule-choice-chip-custom ${
              monthlyCountMode === "custom" ? "is-selected" : ""
            }`}
            onClick={onSelectCustomMode}
          >
            <strong>Custom</strong>
            <span>set your own</span>
          </button>
        </div>

        {monthlyCountMode === "custom" ? (
          <div className="studio-field schedule-custom-field">
            <label htmlFor="custom-monthly-count">Custom monthly post count</label>
            <input
              id="custom-monthly-count"
              inputMode="numeric"
              min={1}
              onChange={(event) => onCustomMonthlyCountChange(event.target.value)}
              placeholder="Enter a positive number"
              type="number"
              value={customMonthlyCount}
            />
          </div>
        ) : null}
      </section>

      <section className="schedule-builder-block">
        <div className="schedule-block-header">
          <h3>Distribution</h3>
          <p>Pick one cadence to decide which dates are eligible.</p>
        </div>
        <div className="schedule-distribution-row">
          {DISTRIBUTION_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`schedule-pill-button ${
                distribution === option.value ? "is-selected" : ""
              }`}
              onClick={() => onDistributionChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <section className="schedule-builder-block">
        <ScheduleCalendarPreview
          generatedTitlesByDate={generatedTitlesByDate}
          isGenerating={isGenerating}
          preview={preview}
        />
      </section>

      <div className="schedule-builder-footer">
        <p>
          {hasGenerated
            ? `${Object.keys(generatedTitlesByDate).length} AI titles placed into ${preview.monthLabel}.`
            : preview.highlightedDates.length < requestedMonthlyCount
              ? `Only ${preview.highlightedDates.length} dates fit this rule in ${preview.monthLabel}.`
              : `Ready to generate ${preview.highlightedDates.length} scheduled posts.`}
        </p>
        {metaSummary ? <p className="schedule-meta-note">{metaSummary}</p> : null}
        {errorMessage ? (
          <p className="schedule-error-note" role="alert">
            {errorMessage}
          </p>
        ) : null}
        <NeonButton
          as="button"
          className="studio-generate-button"
          disabled={!canGenerate || isGenerating}
          onClick={onGenerateCalendar}
          type="button"
        >
          {isGenerating ? (
            <>
              <Loader2 className="studio-spin" size={18} />
              Generating
            </>
          ) : !canGenerate ? (
            <>
              Sign in to Generate
              <CalendarDays size={18} />
            </>
          ) : (
            <>
              Generate Calendar
              <CalendarDays size={18} />
            </>
          )}
        </NeonButton>
      </div>
    </GlassCard>
  );
}
