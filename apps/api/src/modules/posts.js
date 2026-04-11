const posts = new Map();

function createPost(input) {
  const id = `post_${Date.now()}`;
  const now = new Date().toISOString();
  const post = {
    id,
    calendarId: input.calendarId,
    day: input.day,
    platform: input.platform,
    tone: input.tone,
    title: input.title || "Untitled post",
    hook: input.hook || "",
    caption: input.caption || "",
    hashtags: Array.isArray(input.hashtags) ? input.hashtags : [],
    cta: input.cta || "",
    platformTips: Array.isArray(input.platformTips) ? input.platformTips : [],
    videoTips: Array.isArray(input.videoTips) ? input.videoTips : [],
    createdAt: now,
    updatedAt: now,
  };

  posts.set(id, post);
  return post;
}

function getPost(postId) {
  return posts.get(postId) || null;
}

function listPostsByCalendar(calendarId) {
  return Array.from(posts.values()).filter(
    (post) => post.calendarId === calendarId,
  );
}

module.exports = { createPost, getPost, listPostsByCalendar };

