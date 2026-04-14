const { getCaptionLengthGuide } = require("./prompts");

function getCaptionLengthRule(platform, language) {
  const guide = getCaptionLengthGuide(platform, language);

  return {
    min: guide.min,
    max: guide.max,
    label: guide.label,
  };
}

function getPlatformPostRule(platform) {
  const normalized = String(platform || "").toLowerCase();

  if (normalized.includes("youtube")) {
    return { minHashtags: 3, maxHashtags: 5, minTips: 3, maxTips: 3, maxCtaLength: 120 };
  }

  if (normalized.includes("twitter") || normalized.includes("x / twitter") || normalized === "x") {
    return { minHashtags: 0, maxHashtags: 2, minTips: 3, maxTips: 3, maxCtaLength: 90 };
  }

  if (normalized.includes("linkedin")) {
    return { minHashtags: 3, maxHashtags: 5, minTips: 3, maxTips: 3, maxCtaLength: 160 };
  }

  return { minHashtags: 5, maxHashtags: 8, minTips: 3, maxTips: 3, maxCtaLength: 200 };
}

function normalizeTitle(title) {
  return String(title || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function validateMonthlyResult(result, expectedCount, forbiddenTitles = []) {
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

  const seenTitles = new Set();
  for (const title of result.titles) {
    const normalized = normalizeTitle(title);
    if (seenTitles.has(normalized)) {
      return { ok: false, error: "Monthly titles must be unique" };
    }
    seenTitles.add(normalized);
  }

  const forbidden = new Set(
    forbiddenTitles
      .filter((title) => typeof title === "string" && title.trim().length > 0)
      .map(normalizeTitle),
  );

  for (const title of result.titles) {
    if (forbidden.has(normalizeTitle(title))) {
      return {
        ok: false,
        error: "Monthly titles must not repeat titles from the previous month",
      };
    }
  }

  return { ok: true };
}

function validatePostResult(result, platform, language) {
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

  const platformRule = getPlatformPostRule(platform);
  if (
    result.hashtags.length < platformRule.minHashtags ||
    result.hashtags.length > platformRule.maxHashtags
  ) {
    return {
      ok: false,
      error: `Post result must include between ${platformRule.minHashtags} and ${platformRule.maxHashtags} hashtags for this platform`,
    };
  }

  if (
    result.platformTips.length < platformRule.minTips ||
    result.platformTips.length > platformRule.maxTips
  ) {
    return {
      ok: false,
      error: `Post result must include ${platformRule.minTips} platform tips`,
    };
  }

  if (result.cta.trim().length > platformRule.maxCtaLength) {
    return {
      ok: false,
      error: `CTA is too long for this platform`,
    };
  }

  const captionLength = result.caption.trim().length;
  const rule = getCaptionLengthRule(platform, language);
  if (captionLength < rule.min || captionLength > rule.max) {
    return {
      ok: false,
      error: `${rule.label} caption must be between ${rule.min} and ${rule.max} characters`,
    };
  }

  return { ok: true };
}

module.exports = { validateMonthlyResult, validatePostResult };
