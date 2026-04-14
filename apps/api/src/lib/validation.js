function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

function validateCreatorProfile(input) {
  const errors = [];

  if (!isNonEmptyString(input.niche)) {
    errors.push("niche is required");
  }
  if (!isNonEmptyString(input.language)) {
    errors.push("language is required");
  }
  if (!isNonEmptyString(input.platform)) {
    errors.push("platform is required");
  }
  if (!isNonEmptyString(input.tone)) {
    errors.push("tone is required");
  }
  if (!isPositiveInteger(input.monthlyPostCount)) {
    errors.push("monthlyPostCount must be a positive integer");
  }
  if (!isNonEmptyString(input.userId)) {
    errors.push("userId is required");
  }

  return errors;
}

function validateCalendar(input) {
  const errors = [];

  if (!isNonEmptyString(input.userId)) {
    errors.push("userId is required");
  }
  if (!isNonEmptyString(input.month)) {
    errors.push("month is required");
  }
  if (!isPositiveInteger(input.year)) {
    errors.push("year must be a positive integer");
  }
  if (!Array.isArray(input.selectedDays) || input.selectedDays.length === 0) {
    errors.push("selectedDays must be a non-empty array");
  }

  return errors;
}

function validatePost(input) {
  const errors = [];

  if (!isNonEmptyString(input.calendarId)) {
    errors.push("calendarId is required");
  }
  if (!isNonEmptyString(input.day)) {
    errors.push("day is required");
  }
  if (!isNonEmptyString(input.platform)) {
    errors.push("platform is required");
  }
  if (!isNonEmptyString(input.tone)) {
    errors.push("tone is required");
  }

  return errors;
}

function validateMonthlyGeneration(input) {
  const errors = [];

  if (!isNonEmptyString(input.profileId)) {
    errors.push("profileId is required");
  }
  if (!isNonEmptyString(input.month)) {
    errors.push("month is required");
  }
  if (!isPositiveInteger(input.year)) {
    errors.push("year must be a positive integer");
  }
  if (!Array.isArray(input.selectedDays) || input.selectedDays.length === 0) {
    errors.push("selectedDays must be a non-empty array");
  }
  if (
    input.previousTitles !== undefined &&
    (!Array.isArray(input.previousTitles) ||
      input.previousTitles.some((title) => !isNonEmptyString(title)))
  ) {
    errors.push("previousTitles must be an array of non-empty strings");
  }

  return errors;
}

function validatePostGeneration(input) {
  const errors = [];

  if (!isNonEmptyString(input.calendarId)) {
    errors.push("calendarId is required");
  }
  if (!isNonEmptyString(input.day)) {
    errors.push("day is required");
  }
  if (!isNonEmptyString(input.platform)) {
    errors.push("platform is required");
  }
  if (!isNonEmptyString(input.tone)) {
    errors.push("tone is required");
  }

  return errors;
}

function validatePreviewGeneration(input) {
  const errors = [];

  if (!isNonEmptyString(input.topic)) {
    errors.push("topic is required");
  }
  if (!isNonEmptyString(input.platform)) {
    errors.push("platform is required");
  }
  if (!isNonEmptyString(input.tone)) {
    errors.push("tone is required");
  }
  if (!isNonEmptyString(input.language)) {
    errors.push("language is required");
  }

  return errors;
}

function validateThumbnailGeneration(input) {
  const errors = [];

  if (!isNonEmptyString(input.calendarId)) {
    errors.push("calendarId is required");
  }
  if (!isNonEmptyString(input.day)) {
    errors.push("day is required");
  }
  if (!isNonEmptyString(input.platform)) {
    errors.push("platform is required");
  }
  if (!isNonEmptyString(input.tone)) {
    errors.push("tone is required");
  }
  if (!isNonEmptyString(input.title)) {
    errors.push("title is required");
  }

  return errors;
}

module.exports = {
  validateCreatorProfile,
  validateCalendar,
  validatePreviewGeneration,
  validatePost,
  validateMonthlyGeneration,
  validatePostGeneration,
  validateThumbnailGeneration,
};
