function validateMonthlyResult(result, expectedCount) {
  if (!result || typeof result !== "object") {
    return { ok: false, error: "Monthly result must be an object" };
  }

  if (!Array.isArray(result.titles)) {
    return { ok: false, error: "Monthly result must include titles array" };
  }

  if (expectedCount && result.titles.length !== expectedCount) {
    return {
      ok: false,
      error: `Monthly result must include ${expectedCount} titles`,
    };
  }

  const invalidTitle = result.titles.find(
    (title) => typeof title !== "string" || title.trim().length === 0,
  );

  if (invalidTitle) {
    return { ok: false, error: "Monthly titles must be non-empty strings" };
  }

  return { ok: true };
}

function validatePostResult(result) {
  if (!result || typeof result !== "object") {
    return { ok: false, error: "Post result must be an object" };
  }

  const requiredStringFields = ["title", "hook", "caption", "cta"];
  for (const field of requiredStringFields) {
    if (typeof result[field] !== "string" || result[field].trim().length === 0) {
      return { ok: false, error: `Post result missing ${field}` };
    }
  }

  if (!Array.isArray(result.hashtags)) {
    return { ok: false, error: "Post result must include hashtags array" };
  }

  if (!Array.isArray(result.platformTips)) {
    return { ok: false, error: "Post result must include platformTips array" };
  }

  return { ok: true };
}

module.exports = { validateMonthlyResult, validatePostResult };

