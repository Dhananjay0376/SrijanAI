export type CalendarDayStatus =
  | "planned"
  | "generated"
  | "reviewed"
  | "approved"
  | "scheduled"
  | "posted";

export type CalendarDay = {
  date: string;
  status: CalendarDayStatus;
  title?: string;
  postId?: string;
};

export type MonthlyCalendar = {
  id: string;
  userId: string;
  month: string;
  year: number;
  days: CalendarDay[];
  createdAt: string;
  updatedAt: string;
};

export type GenerateMonthlyCalendarRequest = {
  profileId: string;
  month: string;
  year: number;
  selectedDays: number[];
};

