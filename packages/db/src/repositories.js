const { randomUUID } = require("node:crypto");
const { and, asc, eq, inArray, or } = require("drizzle-orm");
const { db, schema } = require("./client");

function isMissingColumnError(error) {
  const message = String(error?.message || "").toLowerCase();
  return (
    (message.includes("column") &&
      (message.includes("does not exist") || message.includes("doesn't exist"))) ||
    (message.includes("failed query") &&
      (message.includes("thumbnail_prompt") ||
        message.includes("thumbnail_mime_type") ||
        message.includes("thumbnail_base64")))
  );
}

function toIsoString(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return new Date(value).toISOString();
}

function mapProfile(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    userId: row.userId,
    niche: row.niche,
    language: row.language,
    platform: row.platform,
    tone: row.tone,
    monthlyPostCount: row.monthlyPostCount,
    postingGoals: row.postingGoals,
    preferredPostingDays: row.preferredPostingDays || [],
    contentPillars: row.contentPillars || [],
    createdAt: toIsoString(row.createdAt),
    updatedAt: toIsoString(row.updatedAt),
  };
}

function mapPost(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    calendarId: row.calendarId,
    day: row.day,
    platform: row.platform,
    tone: row.tone,
    title: row.title,
    hook: row.hook,
    caption: row.caption,
    hashtags: row.hashtags || [],
    cta: row.cta,
    platformTips: row.platformTips || [],
    videoTips: row.videoTips || [],
    thumbnailPrompt: row.thumbnailPrompt || null,
    thumbnailMimeType: row.thumbnailMimeType || null,
    thumbnailBase64: row.thumbnailBase64 || null,
    createdAt: toIsoString(row.createdAt),
    updatedAt: toIsoString(row.updatedAt),
  };
}

function getMonthNumber(month) {
  if (typeof month === "number" && Number.isInteger(month)) {
    return month >= 1 && month <= 12 ? month : null;
  }

  if (typeof month !== "string") {
    return null;
  }

  const trimmed = month.trim();
  if (trimmed.length === 0) {
    return null;
  }

  const numericMonth = Number(trimmed);
  if (Number.isInteger(numericMonth) && numericMonth >= 1 && numericMonth <= 12) {
    return numericMonth;
  }

  const parsedDate = new Date(`${trimmed} 1, 2000`);
  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate.getMonth() + 1;
}

function buildIsoDate(year, month, day) {
  const monthNumber = getMonthNumber(month);

  if (!Number.isInteger(year) || !monthNumber || !Number.isInteger(day)) {
    return null;
  }

  return `${year}-${String(monthNumber).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function buildLegacyCalendarDate(year, month, day) {
  if (!Number.isInteger(year) || !month || !Number.isInteger(day)) {
    return null;
  }

  return `${year}-${String(month)}-${String(day).padStart(2, "0")}`;
}

function normalizeCalendarDayDate(dateValue, calendarRow) {
  if (typeof dateValue !== "string") {
    return dateValue;
  }

  const isoMatch = dateValue.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    return dateValue;
  }

  const monthNameMatch = dateValue.match(/^(\d{4})-([A-Za-z]+)-(\d{2})$/);
  if (monthNameMatch) {
    const [, yearText, monthText, dayText] = monthNameMatch;
    const normalized = buildIsoDate(Number(yearText), monthText, Number(dayText));
    if (normalized) {
      return normalized;
    }
  }

  const trailingDayMatch = dateValue.match(/(\d{1,2})$/);
  if (!trailingDayMatch) {
    return dateValue;
  }

  const normalized = buildIsoDate(
    calendarRow?.year,
    calendarRow?.month,
    Number(trailingDayMatch[1]),
  );

  return normalized || dateValue;
}

function mapCalendar(calendarRow, dayRows = []) {
  if (!calendarRow) {
    return null;
  }

  return {
    id: calendarRow.id,
    userId: calendarRow.userId,
    month: calendarRow.month,
    year: calendarRow.year,
    days: dayRows.map((day) => ({
      id: day.id,
      date: normalizeCalendarDayDate(day.date, calendarRow),
      status: day.status,
      title: day.title,
      postId: day.postId,
    })),
    createdAt: toIsoString(calendarRow.createdAt),
    updatedAt: toIsoString(calendarRow.updatedAt),
  };
}

async function getCalendarDays(executor, calendarId) {
  return executor
    .select()
    .from(schema.calendarDays)
    .where(eq(schema.calendarDays.calendarId, calendarId))
    .orderBy(asc(schema.calendarDays.date));
}

async function createProfile(input) {
  const now = new Date();
  const profile = {
    id: randomUUID(),
    userId: input.userId,
    niche: input.niche,
    language: input.language,
    platform: input.platform,
    tone: input.tone,
    monthlyPostCount: input.monthlyPostCount,
    postingGoals: input.postingGoals || null,
    preferredPostingDays: input.preferredPostingDays || [],
    contentPillars: input.contentPillars || [],
    createdAt: now,
    updatedAt: now,
  };

  const [created] = await db
    .insert(schema.creatorProfiles)
    .values(profile)
    .returning();

  return mapProfile(created);
}

async function getProfile(profileId) {
  const [profile] = await db
    .select()
    .from(schema.creatorProfiles)
    .where(eq(schema.creatorProfiles.id, profileId))
    .limit(1);

  return mapProfile(profile);
}

async function listProfilesByUser(userId) {
  const profiles = await db
    .select()
    .from(schema.creatorProfiles)
    .where(eq(schema.creatorProfiles.userId, userId))
    .orderBy(asc(schema.creatorProfiles.createdAt));

  return profiles.map(mapProfile);
}

async function createCalendar(input) {
  return db.transaction(async (tx) => {
    const now = new Date();
    const calendarId = randomUUID();

    const [calendar] = await tx
      .insert(schema.calendars)
      .values({
        id: calendarId,
        userId: input.userId,
        month: input.month,
        year: input.year,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    const dayRows = input.selectedDays.map((day) => ({
      id: randomUUID(),
      calendarId,
      date:
        buildIsoDate(input.year, input.month, day) ||
        buildLegacyCalendarDate(input.year, input.month, day),
      status: "planned",
      title: null,
      postId: null,
    }));

    if (dayRows.length > 0) {
      await tx.insert(schema.calendarDays).values(dayRows);
    }

    const storedDays = await getCalendarDays(tx, calendarId);
    return mapCalendar(calendar, storedDays);
  });
}

async function getCalendar(calendarId) {
  const [calendar] = await db
    .select()
    .from(schema.calendars)
    .where(eq(schema.calendars.id, calendarId))
    .limit(1);

  if (!calendar) {
    return null;
  }

  const days = await getCalendarDays(db, calendarId);
  return mapCalendar(calendar, days);
}

async function listCalendarsByUser(userId) {
  const calendars = await db
    .select()
    .from(schema.calendars)
    .where(eq(schema.calendars.userId, userId))
    .orderBy(asc(schema.calendars.createdAt));

  if (calendars.length === 0) {
    return [];
  }

  const calendarIds = calendars.map((calendar) => calendar.id);
  const days = await db
    .select()
    .from(schema.calendarDays)
    .where(inArray(schema.calendarDays.calendarId, calendarIds))
    .orderBy(asc(schema.calendarDays.date));

  const daysByCalendarId = new Map();
  for (const day of days) {
    if (!daysByCalendarId.has(day.calendarId)) {
      daysByCalendarId.set(day.calendarId, []);
    }
    daysByCalendarId.get(day.calendarId).push(day);
  }

  return calendars.map((calendar) =>
    mapCalendar(calendar, daysByCalendarId.get(calendar.id) || []),
  );
}

async function updateCalendarTitles(calendarId, titles) {
  return db.transaction(async (tx) => {
    const days = await getCalendarDays(tx, calendarId);
    if (days.length === 0) {
      const [calendar] = await tx
        .select()
        .from(schema.calendars)
        .where(eq(schema.calendars.id, calendarId))
        .limit(1);

      return calendar ? mapCalendar(calendar, []) : null;
    }

    for (const [index, day] of days.entries()) {
      const nextTitle = titles[index];
      if (!nextTitle) {
        continue;
      }

      await tx
        .update(schema.calendarDays)
        .set({
          title: nextTitle,
          status: "generated",
        })
        .where(eq(schema.calendarDays.id, day.id));
    }

    const [calendar] = await tx
      .update(schema.calendars)
      .set({ updatedAt: new Date() })
      .where(eq(schema.calendars.id, calendarId))
      .returning();

    const updatedDays = await getCalendarDays(tx, calendarId);
    return mapCalendar(calendar, updatedDays);
  });
}

async function createPost(input) {
  const persistPost = async (includeThumbnailColumns) =>
    db.transaction(async (tx) => {
      const now = new Date();
      const [calendar] = await tx
        .select()
        .from(schema.calendars)
        .where(eq(schema.calendars.id, input.calendarId))
        .limit(1);
      const legacyCalendarDay = buildLegacyCalendarDate(
        calendar?.year,
        calendar?.month,
        Number(String(input.day).slice(-2)),
      );
      const [existingPost] = await tx
        .select({
          id: schema.posts.id,
        })
        .from(schema.posts)
        .where(
          and(
            eq(schema.posts.calendarId, input.calendarId),
            eq(schema.posts.day, input.day),
          ),
        )
        .limit(1);

      const postId = existingPost?.id || randomUUID();

      const nextValues = {
        calendarId: input.calendarId,
        day: input.day,
        platform: input.platform,
        tone: input.tone,
        title: input.title || "Untitled post",
        hook: input.hook || "",
        caption: input.caption || "",
        hashtags: Array.isArray(input.hashtags) ? input.hashtags : [],
        cta: input.cta || "",
        platformTips: Array.isArray(input.platformTips) ? input.platformTips : [],
        videoTips: Array.isArray(input.videoTips) ? input.videoTips : [],
        ...(includeThumbnailColumns
          ? {
              thumbnailPrompt: input.thumbnailPrompt || null,
              thumbnailMimeType: input.thumbnailMimeType || null,
              thumbnailBase64: input.thumbnailBase64 || null,
            }
          : {}),
        updatedAt: now,
      };

      let post;

      if (existingPost) {
        [post] = await tx
          .update(schema.posts)
          .set(nextValues)
          .where(eq(schema.posts.id, existingPost.id))
          .returning();
      } else {
        [post] = await tx
          .insert(schema.posts)
          .values({
            id: postId,
            ...nextValues,
            createdAt: now,
          })
          .returning();
      }

      await tx
        .update(schema.calendarDays)
        .set({
          postId,
          status: "generated",
          title: input.title || "Untitled post",
        })
        .where(
          and(
            eq(schema.calendarDays.calendarId, input.calendarId),
            or(
              eq(schema.calendarDays.date, input.day),
              ...(legacyCalendarDay ? [eq(schema.calendarDays.date, legacyCalendarDay)] : []),
            ),
          ),
        );

      await tx
        .update(schema.calendars)
        .set({ updatedAt: now })
        .where(eq(schema.calendars.id, input.calendarId));

      return mapPost(post);
    });

  try {
    return await persistPost(true);
  } catch (error) {
    if (!isMissingColumnError(error)) {
      throw error;
    }

    return persistPost(false);
  }
}

async function getPost(postId) {
  try {
    const [post] = await db
      .select()
      .from(schema.posts)
      .where(eq(schema.posts.id, postId))
      .limit(1);

    return mapPost(post);
  } catch (error) {
    if (!isMissingColumnError(error)) {
      throw error;
    }

    const [post] = await db
      .select({
        id: schema.posts.id,
        calendarId: schema.posts.calendarId,
        day: schema.posts.day,
        platform: schema.posts.platform,
        tone: schema.posts.tone,
        title: schema.posts.title,
        hook: schema.posts.hook,
        caption: schema.posts.caption,
        hashtags: schema.posts.hashtags,
        cta: schema.posts.cta,
        platformTips: schema.posts.platformTips,
        videoTips: schema.posts.videoTips,
        createdAt: schema.posts.createdAt,
        updatedAt: schema.posts.updatedAt,
      })
      .from(schema.posts)
      .where(eq(schema.posts.id, postId))
      .limit(1);

    return mapPost(post);
  }
}

async function listPostsByCalendar(calendarId) {
  try {
    const posts = await db
      .select()
      .from(schema.posts)
      .where(eq(schema.posts.calendarId, calendarId))
      .orderBy(asc(schema.posts.createdAt));

    return posts.map(mapPost);
  } catch (error) {
    if (!isMissingColumnError(error)) {
      throw error;
    }

    const posts = await db
      .select({
        id: schema.posts.id,
        calendarId: schema.posts.calendarId,
        day: schema.posts.day,
        platform: schema.posts.platform,
        tone: schema.posts.tone,
        title: schema.posts.title,
        hook: schema.posts.hook,
        caption: schema.posts.caption,
        hashtags: schema.posts.hashtags,
        cta: schema.posts.cta,
        platformTips: schema.posts.platformTips,
        videoTips: schema.posts.videoTips,
        createdAt: schema.posts.createdAt,
        updatedAt: schema.posts.updatedAt,
      })
      .from(schema.posts)
      .where(eq(schema.posts.calendarId, calendarId))
      .orderBy(asc(schema.posts.createdAt));

    return posts.map(mapPost);
  }
}

async function updatePostThumbnail(input) {
  try {
    return await db.transaction(async (tx) => {
      const [existingPost] = await tx
        .select({
          id: schema.posts.id,
        })
        .from(schema.posts)
        .where(
          and(
            eq(schema.posts.calendarId, input.calendarId),
            eq(schema.posts.day, input.day),
          ),
        )
        .limit(1);

      if (!existingPost) {
        return null;
      }

      const [updatedPost] = await tx
        .update(schema.posts)
        .set({
          thumbnailPrompt: input.thumbnailPrompt || null,
          thumbnailMimeType: input.thumbnailMimeType || null,
          thumbnailBase64: input.thumbnailBase64 || null,
          updatedAt: new Date(),
        })
        .where(eq(schema.posts.id, existingPost.id))
        .returning();

      return mapPost(updatedPost);
    });
  } catch (error) {
    if (!isMissingColumnError(error)) {
      throw error;
    }

    return null;
  }
}

module.exports = {
  createCalendar,
  createPost,
  createProfile,
  getCalendar,
  getPost,
  getProfile,
  listCalendarsByUser,
  listPostsByCalendar,
  listProfilesByUser,
  updatePostThumbnail,
  updateCalendarTitles,
};
