const { randomUUID } = require("node:crypto");
const { and, asc, eq, inArray } = require("drizzle-orm");
const { db, schema } = require("./client");

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
    createdAt: toIsoString(row.createdAt),
    updatedAt: toIsoString(row.updatedAt),
  };
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
      date: day.date,
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
      date: `${input.year}-${String(input.month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
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
  return db.transaction(async (tx) => {
    const now = new Date();
    const [existingPost] = await tx
      .select()
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
          eq(schema.calendarDays.date, input.day),
        ),
      );

    await tx
      .update(schema.calendars)
      .set({ updatedAt: now })
      .where(eq(schema.calendars.id, input.calendarId));

    return mapPost(post);
  });
}

async function getPost(postId) {
  const [post] = await db
    .select()
    .from(schema.posts)
    .where(eq(schema.posts.id, postId))
    .limit(1);

  return mapPost(post);
}

async function listPostsByCalendar(calendarId) {
  const posts = await db
    .select()
    .from(schema.posts)
    .where(eq(schema.posts.calendarId, calendarId))
    .orderBy(asc(schema.posts.createdAt));

  return posts.map(mapPost);
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
  updateCalendarTitles,
};
