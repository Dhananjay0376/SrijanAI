const groq = require("./providers/groq");
const gemini = require("./providers/gemini");
const openrouter = require("./providers/openrouter");
const {
  validateMonthlyResult,
  validatePostResult,
} = require("./guardrails");

const providers = [groq, gemini, openrouter];

async function runWithFallback(taskName, input) {
  let lastError = null;

  for (const provider of providers) {
    try {
      if (taskName === "monthly") {
        const result = await provider.generateMonthlyTitles(input);
        const guard = validateMonthlyResult(result, input.selectedDays?.length);
        if (!guard.ok) {
          throw new Error(guard.error);
        }
        return result;
      }
      if (taskName === "post") {
        const result = await provider.generatePost(input);
        const guard = validatePostResult(result);
        if (!guard.ok) {
          throw new Error(guard.error);
        }
        return result;
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
