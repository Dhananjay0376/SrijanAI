const profiles = new Map();

function createProfile(input) {
  const id = `profile_${Date.now()}`;
  const now = new Date().toISOString();
  const profile = {
    id,
    userId: input.userId,
    niche: input.niche,
    language: input.language,
    platform: input.platform,
    tone: input.tone,
    monthlyPostCount: input.monthlyPostCount,
    postingGoals: input.postingGoals || null,
    preferredPostingDays: input.preferredPostingDays || [],
    contentPillars: input.contentPillars || [],
    createdAt: now,
    updatedAt: now,
  };

  profiles.set(id, profile);
  return profile;
}

function getProfile(profileId) {
  return profiles.get(profileId) || null;
}

function listProfilesByUser(userId) {
  return Array.from(profiles.values()).filter(
    (profile) => profile.userId === userId,
  );
}

module.exports = { createProfile, getProfile, listProfilesByUser };
