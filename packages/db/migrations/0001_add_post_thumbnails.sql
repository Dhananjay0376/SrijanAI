ALTER TABLE "posts"
ADD COLUMN "thumbnail_prompt" text;
--> statement-breakpoint
ALTER TABLE "posts"
ADD COLUMN "thumbnail_mime_type" varchar(100);
--> statement-breakpoint
ALTER TABLE "posts"
ADD COLUMN "thumbnail_base64" text;
