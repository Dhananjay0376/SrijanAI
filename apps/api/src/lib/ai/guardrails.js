function getCaptionLengthRule(platform) {
  const normalized = String(platform || "").toLowerCase();

  if (normalized.includes("youtube")) {
    return { min: 80, max: 180, label: "YouTube" };
  }

  if (normalized.includes("twitter") || normalized.includes("x / twitter") || normalized === "x") {
    return { min: 140, max: 240, label: "X" };
  }

  if (normalized.includes("linkedin")) {
    return { min: 500, max: 1200, label: "LinkedIn" };
  }

  return { min: 300, max: 900, label: "Instagram" };
}

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

function validatePostResult(result, platform) {
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

  const captionLength = result.caption.trim().length;
  const rule = getCaptionLengthRule(platform);
  if (captionLength < rule.min || captionLength > rule.max) {
    return {
      ok: false,
      error: `${rule.label} caption must be between ${rule.min} and ${rule.max} characters`,
    };
  }

  return { ok: true };
}

module.exports = { validateMonthlyResult, validatePostResult };
