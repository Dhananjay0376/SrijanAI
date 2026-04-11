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

module.exports = { validateCreatorProfile, validateCalendar };

