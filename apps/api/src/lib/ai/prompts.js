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

function buildMonthlyPrompt(input) {
  return [
    "You are generating a monthly content calendar for a creator.",
    "Return JSON only with this shape:",
    "{ \"titles\": [\"title1\", \"title2\", \"title3\"] }",
    `Platform: ${input.platform || "unknown"}`,
    `Tone: ${input.tone || "neutral"}`,
    `Niche: ${input.niche || "general"}`,
    `Month: ${input.month} ${input.year}`,
    `Selected days: ${input.selectedDays.join(", ")}`,
  ].join("\n");
}

function buildPostPrompt(input) {
  const captionGuide = getCaptionLengthGuide(input.platform);

  return [
    "You are generating a full social post.",
    "Return JSON only with this shape:",
    "{ \"title\": \"...\", \"hook\": \"...\", \"caption\": \"...\", \"hashtags\": [\"#\"], \"cta\": \"...\", \"platformTips\": [\"...\"] }",
    `Platform: ${input.platform}`,
    `Tone: ${input.tone}`,
    `Language: ${input.language || "English"}`,
    `Caption format goal: ${captionGuide.label}`,
    captionGuide.instruction,
    `Day: ${input.day}`,
    `Title: ${input.title || input.topic || "Generate a title"}`,
    `Topic: ${input.topic || input.title || "General creator content"}`,
  ].join("\n");
}

module.exports = { buildMonthlyPrompt, buildPostPrompt, getCaptionLengthGuide };
