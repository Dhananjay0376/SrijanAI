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
  return [
    "You are generating a full social post.",
    "Return JSON only with this shape:",
    "{ \"title\": \"...\", \"hook\": \"...\", \"caption\": \"...\", \"hashtags\": [\"#\"], \"cta\": \"...\", \"platformTips\": [\"...\"] }",
    `Platform: ${input.platform}`,
    `Tone: ${input.tone}`,
    `Day: ${input.day}`,
    `Title: ${input.title || "Generate a title"}`,
  ].join("\n");
}

module.exports = { buildMonthlyPrompt, buildPostPrompt };

