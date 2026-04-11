export type GeneratedPost = {
  id: string;
  calendarDay: string;
  title: string;
  hook: string;
  caption: string;
  hashtags: string[];
  cta: string;
  platformTips: string[];
  videoTips?: string[];
  createdAt: string;
  updatedAt: string;
};

export type GeneratePostRequest = {
  calendarId: string;
  day: string;
  platform: string;
  tone: string;
};

