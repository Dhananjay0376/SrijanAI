const groq = require("./providers/groq");
const gemini = require("./providers/gemini");
const openrouter = require("./providers/openrouter");

const providers = [groq, gemini, openrouter];

async function runWithFallback(taskName, input) {
  let lastError = null;

  for (const provider of providers) {
    try {
      if (taskName === "monthly") {
        return await provider.generateMonthlyTitles(input);
      }
      if (taskName === "post") {
        return await provider.generatePost(input);
      }
    } catch (error) {
      lastError = error;
    }
  }

  const message = lastError ? lastError.message : "All providers failed";
  throw new Error(message);
}

async function generateMonthlyTitles(input) {
  return runWithFallback("monthly", input);
}

async function generatePost(input) {
  return runWithFallback("post", input);
}

module.exports = { generateMonthlyTitles, generatePost };

