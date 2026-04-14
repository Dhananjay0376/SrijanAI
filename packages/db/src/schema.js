const {
  pgTable,
  text,
  varchar,
  integer,
  timestamp,
  jsonb,
} = require("drizzle-orm/pg-core");

const creatorProfiles = pgTable("creator_profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  niche: varchar("niche", { length: 200 }).notNull(),
  language: varchar("language", { length: 40 }).notNull(),
  platform: varchar("platform", { length: 40 }).notNull(),
  tone: varchar("tone", { length: 40 }).notNull(),
  monthlyPostCount: integer("monthly_post_count").notNull(),
  postingGoals: text("posting_goals"),
  preferredPostingDays: jsonb("preferred_posting_days").$type("number[]"),
  contentPillars: jsonb("content_pillars").$type("string[]"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

const calendars = pgTable("content_calendars", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  month: varchar("month", { length: 20 }).notNull(),
  year: integer("year").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

const calendarDays = pgTable("calendar_days", {
  id: text("id").primaryKey(),
  calendarId: text("calendar_id").notNull(),
  date: varchar("date", { length: 20 }).notNull(),
  status: varchar("status", { length: 20 }).notNull(),
  title: text("title"),
  postId: text("post_id"),
});

const posts = pgTable("posts", {
  id: text("id").primaryKey(),
  calendarId: text("calendar_id").notNull(),
  day: varchar("day", { length: 20 }).notNull(),
  platform: varchar("platform", { length: 40 }).notNull(),
  tone: varchar("tone", { length: 40 }).notNull(),
  title: text("title").notNull(),
  hook: text("hook").notNull(),
  caption: text("caption").notNull(),
  hashtags: jsonb("hashtags").$type("string[]"),
  cta: text("cta").notNull(),
  platformTips: jsonb("platform_tips").$type("string[]"),
  videoTips: jsonb("video_tips").$type("string[]"),
  thumbnailPrompt: text("thumbnail_prompt"),
  thumbnailMimeType: varchar("thumbnail_mime_type", { length: 100 }),
  thumbnailBase64: text("thumbnail_base64"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

module.exports = {
  creatorProfiles,
  calendars,
  calendarDays,
  posts,
};
