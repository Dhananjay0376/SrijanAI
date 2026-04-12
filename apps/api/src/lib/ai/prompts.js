function getCaptionLengthGuide(platform) {
  const normalized = String(platform || "").toLowerCase();

  if (normalized.includes("youtube")) {
    return {
      label: "short-form YouTube caption",
      instruction:
        "Keep the caption concise: target 80 to 180 characters, 1 to 2 short lines, optimized for a YouTube Short description.",
    };
  }

  if (normalized.includes("twitter") || normalized.includes("x / twitter") || normalized === "x") {
    return {
      label: "X caption",
      instruction:
        "Keep the caption punchy: target 140 to 240 characters, a single compact thought, no long paragraphs.",
    };
  }

  if (normalized.includes("linkedin")) {
    return {
      label: "LinkedIn caption",
      instruction:
        "Keep the caption professional and valuable: target 500 to 1200 characters, broken into short readable paragraphs.",
    };
  }

  return {
    label: "Instagram caption",
    instruction:
      "Keep the caption engaging but readable: target 300 to 900 characters, with a strong opening line and short supporting lines.",
  };
}

function getPlatformPostGuide(platform) {
  const normalized = String(platform || "").toLowerCase();

  if (normalized.includes("youtube")) {
    return {
      platformLabel: "YouTube Shorts",
      hookInstruction:
        "Write a fast, curiosity-driven hook built for the first 1 to 2 seconds of a YouTube Short.",
      captionInstruction:
        "Use a compact YouTube-style description that reinforces the promise of the video without repeating the whole script.",
      hashtagInstruction:
        "Return 3 to 5 hashtags, prioritizing discoverability and topic relevance over broad spammy tags.",
      ctaInstruction:
        "Use a CTA that encourages watching till the end, commenting, or subscribing.",
      tipsInstruction:
        "Give 3 short platform tips focused on retention, pacing, on-screen text, and replay value for Shorts.",
    };
  }

  if (normalized.includes("twitter") || normalized.includes("x / twitter") || normalized === "x") {
    return {
      platformLabel: "X / Twitter",
      hookInstruction:
        "Write a sharp opening line that feels native to X and can stand alone as a strong first sentence.",
      captionInstruction:
        "Keep the body concise, opinionated, and scroll-stopping, with strong sentence rhythm and no fluff.",
      hashtagInstruction:
        "Return 0 to 2 hashtags max, only if they are genuinely useful. Prefer none over weak hashtags.",
      ctaInstruction:
        "Use a CTA that invites replies, reposts, bookmarks, or debate.",
      tipsInstruction:
        "Give 3 short platform tips focused on clarity, punch, formatting, and reply-driving phrasing.",
    };
  }

  if (normalized.includes("linkedin")) {
    return {
      platformLabel: "LinkedIn",
      hookInstruction:
        "Write a professional hook that establishes authority, tension, or a useful takeaway in the first line.",
      captionInstruction:
        "Structure the caption like a high-performing LinkedIn post with short paragraphs, insight density, and easy readability.",
      hashtagInstruction:
        "Return 3 to 5 professional hashtags relevant to the topic and industry.",
      ctaInstruction:
        "Use a CTA that encourages thoughtful comments, professional discussion, or saves/shares.",
      tipsInstruction:
        "Give 3 short platform tips focused on credibility, formatting, insight delivery, and professional tone.",
    };
  }

  return {
    platformLabel: "Instagram",
    hookInstruction:
      "Write an emotionally engaging hook that feels strong on-screen and instantly relevant to the viewer.",
    captionInstruction:
      "Structure the caption for Instagram with a strong opener, short readable lines, and a natural emotional or educational payoff.",
    hashtagInstruction:
      "Return 5 to 8 relevant hashtags mixing niche and mid-size discovery tags.",
    ctaInstruction:
      "Use a CTA that encourages comments, shares, saves, or DMs.",
    tipsInstruction:
      "Give 3 short platform tips focused on visual storytelling, readability, saves, and shareability.",
  };
}

function buildMonthlyPrompt(input) {
  const previousTitles = Array.isArray(input.previousTitles)
    ? input.previousTitles.filter((title) => typeof title === "string" && title.trim().length > 0)
    : [];

  return [
    "You are generating a monthly content calendar for a creator.",
    "Return JSON only with this shape:",
    "{ \"titles\": [\"title1\", \"title2\", \"title3\"] }",
    `Platform: ${input.platform || "unknown"}`,
    `Tone: ${input.tone || "neutral"}`,
    `Niche: ${input.niche || "general"}`,
    `Month: ${input.month} ${input.year}`,
    `Selected days: ${input.selectedDays.join(", ")}`,
    "Every title must be unique within this response.",
    "Do not reuse, paraphrase, or lightly remix an earlier title.",
    previousTitles.length > 0
      ? "Continue the creator's content flow from the previous month with fresh next-step ideas."
      : "Create a cohesive monthly flow with strong variety.",
    previousTitles.length > 0
      ? `Previous month titles to continue from without repeating: ${previousTitles.join(" | ")}`
      : null,
    previousTitles.length > 0
      ? "The new titles must feel like the next chapter, not a copy of the previous month."
      : null,
  ]
    .filter(Boolean)
    .join("\n");
}

function buildPostPrompt(input) {
  const captionGuide = getCaptionLengthGuide(input.platform);
  const platformGuide = getPlatformPostGuide(input.platform);

  return [
    "You are generating a full social post.",
    "Return JSON only with this shape:",
    "{ \"title\": \"...\", \"hook\": \"...\", \"caption\": \"...\", \"hashtags\": [\"#\"], \"cta\": \"...\", \"platformTips\": [\"...\"] }",
    `Platform: ${platformGuide.platformLabel}`,
    `Tone: ${input.tone}`,
    `Language: ${input.language || "English"}`,
    `Caption format goal: ${captionGuide.label}`,
    captionGuide.instruction,
    `Hook rule: ${platformGuide.hookInstruction}`,
    `Caption rule: ${platformGuide.captionInstruction}`,
    `Hashtag rule: ${platformGuide.hashtagInstruction}`,
    `CTA rule: ${platformGuide.ctaInstruction}`,
    `Platform tips rule: ${platformGuide.tipsInstruction}`,
    "Make every field feel native to the selected platform instead of generic social media copy.",
    `Day: ${input.day}`,
    `Title: ${input.title || input.topic || "Generate a title"}`,
    `Topic: ${input.topic || input.title || "General creator content"}`,
  ].join("\n");
}

module.exports = {
  buildMonthlyPrompt,
  buildPostPrompt,
  getCaptionLengthGuide,
  getPlatformPostGuide,
};
