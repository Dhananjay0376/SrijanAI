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
  let response: Response;

  try {
    response = await fetch(`${getApiBaseUrl()}/generate/preview`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });
  } catch {
    throw new Error(
      `Unable to reach the API at ${getApiBaseUrl()}. Start the API server and check NEXT_PUBLIC_API_BASE_URL if needed.`,
    );
  }

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
  let response: Response;

  try {
    response = await fetch(`${getApiBaseUrl()}/generate/monthly`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });
  } catch {
    throw new Error(
      `Unable to reach the API at ${getApiBaseUrl()}. Start the API server and check NEXT_PUBLIC_API_BASE_URL if needed.`,
    );
  }

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

export async function generatePostDetails(input: {
  calendarId: string;
  day: string;
  platform: string;
  tone: string;
  language?: string;
  title?: string;
  topic?: string;
}) {
  let response: Response;

  try {
    response = await fetch(`${getApiBaseUrl()}/generate/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });
  } catch {
    throw new Error(
      `Unable to reach the API at ${getApiBaseUrl()}. Start the API server and check NEXT_PUBLIC_API_BASE_URL if needed.`,
    );
  }

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error || "Post generation failed");
  }

  return payload as {
    post: {
      id: string;
      calendarDay: string;
      title: string;
      hook: string;
      caption: string;
      hashtags: string[];
      cta: string;
      platformTips: string[];
      createdAt: string;
      updatedAt: string;
    };
    meta?: {
      provider?: string;
      attempts?: number;
      durationMs?: number;
    };
  };
}
