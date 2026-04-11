const { fetchWithRetry } = require("../http");
const { extractJson } = require("../parse");
const { buildMonthlyPrompt, buildPostPrompt } = require("../prompts");

const endpoint = "https://openrouter.ai/api/v1/chat/completions";

function getModel() {
  return process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";
}

async function callOpenRouter(messages) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not set");
  }

  const response = await fetchWithRetry(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "http://localhost",
      "X-Title": "SrijanAI",
    },
    body: JSON.stringify({
      model: getModel(),
      messages,
      temperature: 0.6,
    }),
    timeoutMs: 20000,
    retries: 2,
  });

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content || "";
  const parsed = extractJson(content);
  if (!parsed) {
    throw new Error("OpenRouter response was not valid JSON");
  }
  return parsed;
}

async function generateMonthlyTitles(input) {
  const prompt = buildMonthlyPrompt(input);
  const result = await callOpenRouter([{ role: "user", content: prompt }]);
  return { provider: "openrouter", titles: result.titles || [] };
}

async function generateMonthlyTitlesRetry(input, retryPrompt) {
  const prompt = `${buildMonthlyPrompt(input)}\n\n${retryPrompt}`;
  const result = await callOpenRouter([{ role: "user", content: prompt }]);
  return { provider: "openrouter", titles: result.titles || [] };
}

async function generatePost(input) {
  const prompt = buildPostPrompt(input);
  const result = await callOpenRouter([{ role: "user", content: prompt }]);
  return {
    provider: "openrouter",
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
  const result = await callOpenRouter([{ role: "user", content: prompt }]);
  return {
    provider: "openrouter",
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
