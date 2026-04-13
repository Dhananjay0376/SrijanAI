function isHinglishLanguage(language) {
  const normalized = String(language || "").toLowerCase();
  return normalized.includes("hinglish") || normalized.includes("hindi + english");
}

function getCaptionLengthGuide(platform, language) {
  const normalized = String(platform || "").toLowerCase();
  const isHinglish = isHinglishLanguage(language);

  if (normalized.includes("youtube")) {
    return {
      label: "short-form YouTube caption",
      instruction:
        isHinglish
          ? "Write a fuller Hinglish YouTube Short description: target 180 to 320 characters, 2 to 4 short lines, with a stronger setup, payoff, and CTA."
          : "Write a fuller YouTube Short description: target 150 to 280 characters, 2 to 4 short lines, with a clear setup, payoff, and CTA.",
      min: isHinglish ? 180 : 150,
      max: isHinglish ? 320 : 280,
    };
  }

  if (normalized.includes("twitter") || normalized.includes("x / twitter") || normalized === "x") {
    return {
      label: "X caption",
      instruction:
        isHinglish
          ? "Keep the X caption sharp but meaningfully longer: target 220 to 300 characters, 2 compact lines, with strong opinion, tension, or payoff."
          : "Keep the X caption sharp but slightly fuller: target 180 to 280 characters, 1 to 3 compact lines, with strong opinion, tension, or payoff.",
      min: isHinglish ? 220 : 180,
      max: isHinglish ? 300 : 280,
    };
  }

  if (normalized.includes("linkedin")) {
    return {
      label: "LinkedIn caption",
      instruction:
        isHinglish
          ? "Write a substantial Hinglish LinkedIn caption: target 900 to 1800 characters, broken into short readable paragraphs with a clear insight arc, example, and takeaway."
          : "Write a substantial LinkedIn caption: target 700 to 1600 characters, broken into short readable paragraphs with a clear insight arc, example, and takeaway.",
      min: isHinglish ? 900 : 700,
      max: isHinglish ? 1800 : 1600,
    };
  }

  return {
    label: "Instagram caption",
    instruction:
      isHinglish
        ? "Write a longer Hinglish Instagram caption: target 650 to 1500 characters, with a strong hook, emotional or educational depth, short readable lines, and a meaningful closing CTA."
        : "Write a longer Instagram caption: target 500 to 1300 characters, with a strong hook, emotional or educational depth, short readable lines, and a meaningful closing CTA.",
    min: isHinglish ? 650 : 500,
    max: isHinglish ? 1500 : 1300,
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
  const captionGuide = getCaptionLengthGuide(input.platform, input.language);
  const platformGuide = getPlatformPostGuide(input.platform);
  const isHinglish = isHinglishLanguage(input.language);

  return [
    "You are generating a full social post.",
    "Return JSON only with this shape:",
    "{ \"title\": \"...\", \"hook\": \"...\", \"caption\": \"...\", \"hashtags\": [\"#\"], \"cta\": \"...\", \"platformTips\": [\"...\"] }",
    `Platform: ${platformGuide.platformLabel}`,
    `Tone: ${input.tone}`,
    `Language: ${input.language || "English"}`,
    `Caption format goal: ${captionGuide.label}`,
    `Caption length target: ${captionGuide.min} to ${captionGuide.max} characters.`,
    captionGuide.instruction,
    `Hook rule: ${platformGuide.hookInstruction}`,
    `Caption rule: ${platformGuide.captionInstruction}`,
    `Hashtag rule: ${platformGuide.hashtagInstruction}`,
    `CTA rule: ${platformGuide.ctaInstruction}`,
    `Platform tips rule: ${platformGuide.tipsInstruction}`,
    "Make every field feel native to the selected platform instead of generic social media copy.",
    isHinglish
      ? "For Hinglish, write naturally in a Hindi-English blend using Roman script. Do not collapse into mostly English. Keep the phrasing conversational, culturally natural, and meaningfully detailed."
      : "Write in the requested language naturally and avoid generic filler phrasing.",
    "Do not make the caption feel underwritten. Expand with concrete insight, emotional payoff, examples, or actionable detail while staying platform-native.",
    `Day: ${input.day}`,
    `Title: ${input.title || input.topic || "Generate a title"}`,
    `Topic: ${input.topic || input.title || "General creator content"}`,
  ].join("\n");
}

function buildPostRetryPrompt(input, validationError) {
  const captionGuide = getCaptionLengthGuide(input.platform, input.language);
  const isHinglish = isHinglishLanguage(input.language);

  return [
    "Your previous response did not satisfy the post requirements.",
    validationError ? `Problem to fix: ${validationError}` : null,
    "Regenerate the entire JSON response.",
    `The caption must land between ${captionGuide.min} and ${captionGuide.max} characters.`,
    "The caption must be substantially more developed than before, not a minor expansion.",
    "Add concrete detail, stronger setup, richer explanation, and a better closing payoff while staying native to the platform.",
    isHinglish
      ? "For Hinglish, keep the caption naturally bilingual in Roman script and make it feel full-length, expressive, and detailed."
      : "Do not return a short caption. Favor a fuller, more complete version.",
    "Return ONLY valid JSON with this exact shape:",
    '{ "title": "...", "hook": "...", "caption": "...", "hashtags": ["#"], "cta": "...", "platformTips": ["..."] }',
  ]
    .filter(Boolean)
    .join("\n");
}

module.exports = {
  buildMonthlyPrompt,
  buildPostPrompt,
  buildPostRetryPrompt,
  getCaptionLengthGuide,
  getPlatformPostGuide,
  isHinglishLanguage,
};
