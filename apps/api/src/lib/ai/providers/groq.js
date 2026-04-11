async function generateMonthlyTitles(input) {
  return {
    provider: "groq",
    titles: input.selectedDays.map(
      (day) => `Groq placeholder title for day ${day}`,
    ),
  };
}

async function generatePost(input) {
  return {
    provider: "groq",
    title: input.title || "Groq placeholder post title",
    hook: "Groq placeholder hook",
    caption: "Groq placeholder caption",
    hashtags: ["#groq", "#srijanai"],
    cta: "Groq placeholder CTA",
    platformTips: ["Groq placeholder platform tip"],
  };
}

module.exports = { generateMonthlyTitles, generatePost };

