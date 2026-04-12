const defaultApiBaseUrl = "http://localhost:4000";

export function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || defaultApiBaseUrl;
}

export async function generatePreview(input: {
  topic: string;
  platform: string;
  tone: string;
  language: string;
}) {
  const response = await fetch(`${getApiBaseUrl()}/generate/preview`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error || "Preview generation failed");
  }

  return payload as {
    title: string;
    hook: string;
    caption: string;
    hashtags: string[];
    cta: string;
    platformTips: string[];
    meta?: {
      provider?: string;
      attempts?: number;
      durationMs?: number;
    };
  };
}

export async function generateMonthlyCalendar(input: {
  profileId: string;
  month: string;
  year: number;
  selectedDays: number[];
  niche: string;
  platform: string;
  tone: string;
  language: string;
}) {
  const response = await fetch(`${getApiBaseUrl()}/generate/monthly`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error || "Monthly calendar generation failed");
  }

  return payload as {
    titles: string[];
    meta?: {
      provider?: string;
      attempts?: number;
      durationMs?: number;
    };
  };
}
