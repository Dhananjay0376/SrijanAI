async function generateMonthlyTitles(input) {
  return {
    provider: "openrouter",
    titles: input.selectedDays.map(
      (day) => `OpenRouter placeholder title for day ${day}`,
    ),
  };
}

async function generatePost(input) {
  return {
    provider: "openrouter",
    title: input.title || "OpenRouter placeholder post title",
    hook: "OpenRouter placeholder hook",
    caption: "OpenRouter placeholder caption",
    hashtags: ["#openrouter", "#srijanai"],
    cta: "OpenRouter placeholder CTA",
    platformTips: ["OpenRouter placeholder platform tip"],
  };
}

module.exports = { generateMonthlyTitles, generatePost };

