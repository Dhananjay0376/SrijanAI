const { fetchWithRetry } = require("../http");
const { extractJson } = require("../parse");
const { buildMonthlyPrompt, buildPostPrompt } = require("../prompts");

const endpoint = "https://api.groq.com/openai/v1/chat/completions";

function getModel() {
  return process.env.GROQ_MODEL || "llama-3.1-8b-instant";
}

async function callGroq(messages) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not set");
  }

  const response = await fetchWithRetry(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
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
    throw new Error("Groq response was not valid JSON");
  }
  return parsed;
}

async function generateMonthlyTitles(input) {
  const prompt = buildMonthlyPrompt(input);
  const result = await callGroq([{ role: "user", content: prompt }]);
  return { provider: "groq", titles: result.titles || [] };
}

async function generatePost(input) {
  const prompt = buildPostPrompt(input);
  const result = await callGroq([{ role: "user", content: prompt }]);
  return {
    provider: "groq",
    title: result.title || input.title || "Untitled post",
    hook: result.hook || "",
    caption: result.caption || "",
    hashtags: result.hashtags || [],
    cta: result.cta || "",
    platformTips: result.platformTips || [],
  };
}

module.exports = { generateMonthlyTitles, generatePost };
