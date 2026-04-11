const { fetchWithRetry } = require("../http");
const { extractJson } = require("../parse");
const { buildMonthlyPrompt, buildPostPrompt } = require("../prompts");

function getModel() {
  return process.env.GEMINI_MODEL || "gemini-2.5-flash";
}

async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${getModel()}:generateContent`;
  const response = await fetchWithRetry(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.6 },
    }),
    timeoutMs: 20000,
    retries: 2,
  });

  const data = await response.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const parsed = extractJson(text);
  if (!parsed) {
    throw new Error("Gemini response was not valid JSON");
  }
  return parsed;
}

async function generateMonthlyTitles(input) {
  const prompt = buildMonthlyPrompt(input);
  const result = await callGemini(prompt);
  return { provider: "gemini", titles: result.titles || [] };
}

async function generateMonthlyTitlesRetry(input, retryPrompt) {
  const prompt = `${buildMonthlyPrompt(input)}\n\n${retryPrompt}`;
  const result = await callGemini(prompt);
  return { provider: "gemini", titles: result.titles || [] };
}

async function generatePost(input) {
  const prompt = buildPostPrompt(input);
  const result = await callGemini(prompt);
  return {
    provider: "gemini",
    title: result.title || input.title || "Untitled post",
    hook: result.hook || "",
    caption: result.caption || "",
    hashtags: result.hashtags || [],
    cta: result.cta || "",
    platformTips: result.platformTips || [],
  };
}

async function generatePostRetry(input, retryPrompt) {
  const prompt = `${buildPostPrompt(input)}\n\n${retryPrompt}`;
  const result = await callGemini(prompt);
  return {
    provider: "gemini",
    title: result.title || input.title || "Untitled post",
    hook: result.hook || "",
    caption: result.caption || "",
    hashtags: result.hashtags || [],
    cta: result.cta || "",
    platformTips: result.platformTips || [],
  };
}

module.exports = {
  generateMonthlyTitles,
  generateMonthlyTitlesRetry,
  generatePost,
  generatePostRetry,
};
