export type SupportedPlatform =
  | "instagram"
  | "youtube"
  | "tiktok"
  | "linkedin"
  | "x"
  | "threads"
  | "facebook";

export type ToneStyle =
  | "friendly"
  | "professional"
  | "bold"
  | "educational"
  | "playful"
  | "luxury"
  | "direct";

export type CreatorProfileInput = {
  niche: string;
  language: string;
  platform: SupportedPlatform;
  tone: ToneStyle;
  monthlyPostCount: number;
  postingGoals?: string;
  preferredPostingDays?: number[];
  contentPillars?: string[];
};

export type CreatorProfile = CreatorProfileInput & {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

