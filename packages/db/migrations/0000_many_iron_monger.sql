CREATE TABLE "creator_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"niche" varchar(200) NOT NULL,
	"language" varchar(40) NOT NULL,
	"platform" varchar(40) NOT NULL,
	"tone" varchar(40) NOT NULL,
	"monthly_post_count" integer NOT NULL,
	"posting_goals" text,
	"preferred_posting_days" jsonb,
	"content_pillars" jsonb,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_calendars" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"month" varchar(20) NOT NULL,
	"year" integer NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "calendar_days" (
	"id" text PRIMARY KEY NOT NULL,
	"calendar_id" text NOT NULL,
	"date" varchar(20) NOT NULL,
	"status" varchar(20) NOT NULL,
	"title" text,
	"post_id" text
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" text PRIMARY KEY NOT NULL,
	"calendar_id" text NOT NULL,
	"day" varchar(20) NOT NULL,
	"platform" varchar(40) NOT NULL,
	"tone" varchar(40) NOT NULL,
	"title" text NOT NULL,
	"hook" text NOT NULL,
	"caption" text NOT NULL,
	"hashtags" jsonb,
	"cta" text NOT NULL,
	"platform_tips" jsonb,
	"video_tips" jsonb,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
