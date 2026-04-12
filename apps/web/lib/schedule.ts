export type ScheduleDistribution =
  | "mon-wed-fri"
  | "tue-thu-sat"
  | "even-dates"
  | "odd-dates"
  | "daily";

export type SchedulePreview = {
  monthLabel: string;
  monthStart: Date;
  calendarDays: CalendarDay[];
  highlightedDates: Date[];
  eligibleDates: Date[];
};

export type CalendarDay = {
  date: Date;
  dayNumber: number;
  isoKey: string;
  isCurrentMonth: boolean;
  isHighlighted: boolean;
};

const WEEKDAY_FORMATTER = new Intl.DateTimeFormat("en-US", { weekday: "short" });
const MONTH_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

export const WEEKDAY_LABELS = Array.from({ length: 7 }, (_, index) =>
  WEEKDAY_FORMATTER.format(new Date(2024, 0, index + 7)),
);

export function getNextMonthStart(baseDate = new Date()) {
  return new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 1);
}

export function buildSchedulePreview(
  monthlyCount: number,
  distribution: ScheduleDistribution,
  baseDate = new Date(),
): SchedulePreview {
  const monthStart = getNextMonthStart(baseDate);
  const eligibleDates = getEligibleDates(monthStart, distribution);
  const highlightedDates = eligibleDates.slice(0, Math.max(0, monthlyCount));
  const highlightedKeys = new Set(highlightedDates.map(createIsoDateKey));

  return {
    monthLabel: MONTH_FORMATTER.format(monthStart),
    monthStart,
    calendarDays: buildCalendarDays(monthStart, highlightedKeys),
    highlightedDates,
    eligibleDates,
  };
}

export function sanitizeMonthlyCount(value: number) {
  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.max(1, Math.floor(value));
}

function buildCalendarDays(monthStart: Date, highlightedKeys: Set<string>) {
  const daysInMonth = new Date(
    monthStart.getFullYear(),
    monthStart.getMonth() + 1,
    0,
  ).getDate();
  const leadingEmptyDays = monthStart.getDay();
  const calendarDays: CalendarDay[] = [];

  for (let index = 0; index < leadingEmptyDays; index += 1) {
    const date = new Date(
      monthStart.getFullYear(),
      monthStart.getMonth(),
      index - leadingEmptyDays + 1,
    );

    calendarDays.push({
      date,
      dayNumber: date.getDate(),
      isoKey: createIsoDateKey(date),
      isCurrentMonth: false,
      isHighlighted: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(monthStart.getFullYear(), monthStart.getMonth(), day);
    const isoKey = createIsoDateKey(date);

    calendarDays.push({
      date,
      dayNumber: day,
      isoKey,
      isCurrentMonth: true,
      isHighlighted: highlightedKeys.has(isoKey),
    });
  }

  const trailingSlots = (7 - (calendarDays.length % 7)) % 7;

  for (let index = 1; index <= trailingSlots; index += 1) {
    const date = new Date(
      monthStart.getFullYear(),
      monthStart.getMonth() + 1,
      index,
    );

    calendarDays.push({
      date,
      dayNumber: date.getDate(),
      isoKey: createIsoDateKey(date),
      isCurrentMonth: false,
      isHighlighted: false,
    });
  }

  return calendarDays;
}

function getEligibleDates(monthStart: Date, distribution: ScheduleDistribution) {
  const daysInMonth = new Date(
    monthStart.getFullYear(),
    monthStart.getMonth() + 1,
    0,
  ).getDate();
  const eligibleDates: Date[] = [];

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(monthStart.getFullYear(), monthStart.getMonth(), day);

    if (isDateEligible(date, distribution)) {
      eligibleDates.push(date);
    }
  }

  return eligibleDates;
}

function isDateEligible(date: Date, distribution: ScheduleDistribution) {
  const dayOfWeek = date.getDay();
  const dayNumber = date.getDate();

  switch (distribution) {
    case "mon-wed-fri":
      return [1, 3, 5].includes(dayOfWeek);
    case "tue-thu-sat":
      return [2, 4, 6].includes(dayOfWeek);
    case "even-dates":
      return dayNumber % 2 === 0;
    case "odd-dates":
      return dayNumber % 2 === 1;
    case "daily":
      return true;
    default:
      return false;
  }
}

function createIsoDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}
