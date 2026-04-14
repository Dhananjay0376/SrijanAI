const defaultApiBaseUrl = "http://localhost:4000";
const productionApiFallbackUrl = "https://api-production-b573.up.railway.app";

export function getApiBaseUrl() {
  const configuredApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

  if (configuredApiBaseUrl) {
    return configuredApiBaseUrl.replace(/\/+$/, "");
  }

  const isClient = typeof window !== "undefined";

  if (isClient) {
    const hostname = window.location.hostname;
    const isLocalBrowser =
      hostname === "localhost" || hostname === "127.0.0.1" || hostname === "0.0.0.0";

    if (isLocalBrowser) {
      return defaultApiBaseUrl;
    }

    // NEXT_PUBLIC_* variables are baked in at build time. If the variable was
    // not available during the build, fall back to the known production API URL
    // rather than crashing the app entirely.
    console.warn(
      "[SrijanAI] NEXT_PUBLIC_API_BASE_URL was not set at build time. " +
      `Falling back to ${productionApiFallbackUrl}. ` +
      "To fix this permanently, ensure the variable is set in your Railway Web " +
      "service variables before deploying."
    );
    return productionApiFallbackUrl;
  }

  // Server-side (SSR/SSG): use the fallback in production rather than throwing,
  // since the variable may simply not have been inlined during the build.
  if (process.env.NODE_ENV === "production") {
    console.warn(
      "[SrijanAI] NEXT_PUBLIC_API_BASE_URL is not set server-side. " +
      `Falling back to ${productionApiFallbackUrl}.`
    );
    return productionApiFallbackUrl;
  }

  return defaultApiBaseUrl;
}

async function readJsonSafely(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function generatePreview(input: {
  topic: string;
  platform: string;
  tone: string;
  language: string;
}) {
  const apiBaseUrl = getApiBaseUrl();
  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}/generate/preview`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });
  } catch {
    throw new Error(
      `Unable to reach the API at ${apiBaseUrl}. Start the API server and check NEXT_PUBLIC_API_BASE_URL if needed.`,
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
  userId: string;
  profileId: string;
  month: string;
  year: number;
  selectedDays: number[];
  niche: string;
  platform: string;
  tone: string;
  language: string;
  previousTitles?: string[];
}) {
  const apiBaseUrl = getApiBaseUrl();
  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}/generate/monthly`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });
  } catch {
    throw new Error(
      `Unable to reach the API at ${apiBaseUrl}. Start the API server and check NEXT_PUBLIC_API_BASE_URL if needed.`,
    );
  }

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error || "Monthly calendar generation failed");
  }

  return payload as {
    titles: string[];
    calendar: {
      id: string;
      userId: string;
      month: string;
      year: number;
      days: Array<{
        id: string;
        date: string;
        status: string;
        title: string | null;
        postId: string | null;
      }>;
    };
    warning?: string | null;
    meta?: {
      provider?: string;
      attempts?: number;
      durationMs?: number;
    };
  };
}

export async function getCalendarsByUser(userId: string) {
  const apiBaseUrl = getApiBaseUrl();
  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}/calendars?userId=${userId}`);
  } catch {
    throw new Error(`Unable to reach the API at ${apiBaseUrl}.`);
  }

  const payload = await readJsonSafely(response);

  if (!response.ok) {
    if (response.status >= 500) {
      return [];
    }

    throw new Error(payload?.error || "Failed to fetch calendars");
  }

  return payload as Array<{
    id: string;
    userId: string;
    month: string;
    year: number;
    days: Array<{
      date: string;
      status: string;
      title: string;
    }>;
    createdAt: string;
  }>;
}

export async function getCalendarById(id: string) {
  const apiBaseUrl = getApiBaseUrl();
  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}/calendars?id=${id}`);
  } catch {
    throw new Error(`Unable to reach the API at ${apiBaseUrl}.`);
  }

  const payload = await readJsonSafely(response);

  if (!response.ok) {
    throw new Error(payload?.error || "Failed to fetch calendar");
  }

  return payload as {
    id: string;
    userId: string;
    month: string;
    year: number;
    days: Array<{
      id: string;
      date: string;
      status: string;
      title: string | null;
      postId: string | null;
    }>;
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
  const apiBaseUrl = getApiBaseUrl();
  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}/generate/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });
  } catch {
    throw new Error(
      `Unable to reach the API at ${apiBaseUrl}. Start the API server and check NEXT_PUBLIC_API_BASE_URL if needed.`,
    );
  }

  const payload = await readJsonSafely(response);

  if (!response.ok) {
    throw new Error(payload?.error || "Post generation failed");
  }

  return payload as {
    post: {
      id: string;
      calendarId: string;
      day: string;
      title: string;
      hook: string;
      caption: string;
      hashtags: string[];
      cta: string;
      platformTips: string[];
      createdAt: string;
      updatedAt: string;
    };
    warning?: string | null;
    meta?: {
      provider?: string;
      attempts?: number;
      durationMs?: number;
    };
  };
}

export async function generateThumbnail(input: {
  calendarId: string;
  day: string;
  platform: string;
  tone: string;
  language?: string;
  title: string;
  hook?: string;
  caption?: string;
  cta?: string;
  topic?: string;
}) {
  const apiBaseUrl = getApiBaseUrl();
  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}/generate/thumbnail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });
  } catch {
    throw new Error(
      `Unable to reach the API at ${apiBaseUrl}. Start the API server and check NEXT_PUBLIC_API_BASE_URL if needed.`,
    );
  }

  const payload = await readJsonSafely(response);

  if (!response.ok) {
    throw new Error(payload?.error || "Thumbnail generation failed");
  }

  return payload as {
    thumbnail: {
      prompt?: string;
      mimeType: string;
      base64: string;
    };
    warning?: string | null;
    meta?: {
      provider?: string;
      attempts?: number;
      durationMs?: number;
    };
  };
}

export async function listPostsByCalendar(calendarId: string) {
  const apiBaseUrl = getApiBaseUrl();
  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}/posts?calendarId=${calendarId}`);
  } catch {
    throw new Error(`Unable to reach the API at ${apiBaseUrl}.`);
  }

  const payload = await readJsonSafely(response);

  if (!response.ok) {
    if (response.status >= 500) {
      return [];
    }

    throw new Error(payload?.error || "Failed to fetch posts");
  }

  return payload as Array<{
    id: string;
    calendarId: string;
    day: string;
    platform: string;
    tone: string;
    title: string;
    hook: string;
    caption: string;
    hashtags: string[];
    cta: string;
    platformTips: string[];
    videoTips: string[];
    thumbnailPrompt: string | null;
    thumbnailMimeType: string | null;
    thumbnailBase64: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
}
