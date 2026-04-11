function assertArray(value, name) {
  if (!Array.isArray(value)) {
    return `${name} must be an array`;
  }
  return null;
}

function assertString(value, name) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return `${name} must be a non-empty string`;
  }
  return null;
}

function assertNumber(value, name) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return `${name} must be a number`;
  }
  return null;
}

function validateMonthlyResponse(payload) {
  const errors = [];

  if (!payload || typeof payload !== "object") {
    return ["Response must be an object"];
  }

  const titleError = assertArray(payload.titles, "titles");
  if (titleError) {
    errors.push(titleError);
  }

  if (payload.meta) {
    const providerError = assertString(payload.meta.provider, "meta.provider");
    if (providerError) {
      errors.push(providerError);
    }
    const attemptError = assertNumber(payload.meta.attempts, "meta.attempts");
    if (attemptError) {
      errors.push(attemptError);
    }
    const durationError = assertNumber(
      payload.meta.durationMs,
      "meta.durationMs",
    );
    if (durationError) {
      errors.push(durationError);
    }
  }

  return errors;
}

function validatePostResponse(payload) {
  const errors = [];

  if (!payload || typeof payload !== "object") {
    return ["Response must be an object"];
  }

  if (!payload.post || typeof payload.post !== "object") {
    return ["Response must include post object"];
  }

  const requiredFields = ["id", "calendarId", "day", "title"];
  for (const field of requiredFields) {
    const error = assertString(payload.post[field], `post.${field}`);
    if (error) {
      errors.push(error);
    }
  }

  const metaErrors = validateMonthlyResponse({
    titles: [],
    meta: payload.meta || null,
  }).filter((error) => error.includes("meta."));
  errors.push(...metaErrors);

  return errors;
}

module.exports = { validateMonthlyResponse, validatePostResponse };
