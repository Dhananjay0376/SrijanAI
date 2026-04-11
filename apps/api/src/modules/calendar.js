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

function updateCalendarTitles(calendarId, titles) {
  const calendar = calendars.get(calendarId);
  if (!calendar) {
    return null;
  }

  const updatedDays = calendar.days.map((day, index) => ({
    ...day,
    title: titles[index] || day.title,
    status: titles[index] ? "generated" : day.status,
  }));

  const updated = {
    ...calendar,
    days: updatedDays,
    updatedAt: new Date().toISOString(),
  };

  calendars.set(calendarId, updated);
  return updated;
}

module.exports = {
  createCalendar,
  getCalendar,
  listCalendarsByUser,
  updateCalendarTitles,
};
