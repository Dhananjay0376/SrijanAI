const groq = require("./providers/groq");
const gemini = require("./providers/gemini");
const openrouter = require("./providers/openrouter");
const {
  validateMonthlyResult,
  validatePostResult,
} = require("./guardrails");

const providers = [groq, gemini, openrouter];

function buildRetryPrompt(taskName, input) {
  if (taskName === "monthly") {
    return (
      "Return ONLY valid JSON with this shape:\n" +
      '{ "titles": ["title1", "title2"] }'
    );
  }
  return (
    "Return ONLY valid JSON with this shape:\n" +
    '{ "title": "...", "hook": "...", "caption": "...", "hashtags": ["#"], "cta": "...", "platformTips": ["..."] }'
  );
}

async function runWithFallback(taskName, input) {
  let lastError = null;

  for (const provider of providers) {
    try {
      if (taskName === "monthly") {
        let result = await provider.generateMonthlyTitles(input);
        let guard = validateMonthlyResult(result, input.selectedDays?.length);
        if (!guard.ok && provider.generateMonthlyTitlesRetry) {
          result = await provider.generateMonthlyTitlesRetry(
            input,
            buildRetryPrompt(taskName, input),
          );
          guard = validateMonthlyResult(result, input.selectedDays?.length);
        }
        if (!guard.ok) {
          throw new Error(guard.error);
        }
        return result;
      }
      if (taskName === "post") {
        let result = await provider.generatePost(input);
        let guard = validatePostResult(result);
        if (!guard.ok && provider.generatePostRetry) {
          result = await provider.generatePostRetry(
            input,
            buildRetryPrompt(taskName, input),
          );
          guard = validatePostResult(result);
        }
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
