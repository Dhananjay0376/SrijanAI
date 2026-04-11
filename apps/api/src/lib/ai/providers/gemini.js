async function generateMonthlyTitles(input) {
  return {
    provider: "gemini",
    titles: input.selectedDays.map(
      (day) => `Gemini placeholder title for day ${day}`,
    ),
  };
}

async function generatePost(input) {
  return {
    provider: "gemini",
    title: input.title || "Gemini placeholder post title",
    hook: "Gemini placeholder hook",
    caption: "Gemini placeholder caption",
    hashtags: ["#gemini", "#srijanai"],
    cta: "Gemini placeholder CTA",
    platformTips: ["Gemini placeholder platform tip"],
  };
}

module.exports = { generateMonthlyTitles, generatePost };

