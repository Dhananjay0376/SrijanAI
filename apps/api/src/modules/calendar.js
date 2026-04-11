const calendars = new Map();

function createCalendar(input) {
  const id = `calendar_${Date.now()}`;
  const now = new Date().toISOString();
  const days = input.selectedDays.map((day) => ({
    date: `${input.year}-${String(input.month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    status: "planned",
  }));

  const calendar = {
    id,
    userId: input.userId,
    month: input.month,
    year: input.year,
    days,
    createdAt: now,
    updatedAt: now,
  };

  calendars.set(id, calendar);
  return calendar;
}

function getCalendar(calendarId) {
  return calendars.get(calendarId) || null;
}

function listCalendarsByUser(userId) {
  return Array.from(calendars.values()).filter(
    (calendar) => calendar.userId === userId,
  );
}

module.exports = { createCalendar, getCalendar, listCalendarsByUser };
