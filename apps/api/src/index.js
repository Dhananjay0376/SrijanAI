const http = require("node:http");
const { healthHandler } = require("./modules/health");
const {
  createProfile,
  getProfile,
  listProfilesByUser,
} = require("./modules/creator-profile");
const {
  createCalendar,
  getCalendar,
  listCalendarsByUser,
  updateCalendarTitles,
} = require("./modules/calendar");
const { createPost, getPost, listPostsByCalendar } = require("./modules/posts");
const { notFoundHandler } = require("./modules/not-found");
const { parseJsonBody, sendError, sendJson } = require("./lib/http");
const { logEvent } = require("./lib/logger");
const {
  validateMonthlyResponse,
  validatePostResponse,
} = require("./lib/schema");
const { generateMonthlyTitles, generatePost } = require("./lib/ai/router");
const {
  validateCreatorProfile,
  validateCalendar,
  validatePost,
  validateMonthlyGeneration,
  validatePostGeneration,
} = require("./lib/validation");

const server = http.createServer(async (req, res) => {
  try {
  if (req.url === "/health") {
    return healthHandler(req, res);
  }

  if (req.method === "POST" && req.url === "/profiles") {
    parseJsonBody(req)
      .then(async (input) => {
        const errors = validateCreatorProfile(input);
        if (errors.length > 0) {
          sendError(res, 400, "Invalid creator profile input", errors);
          return;
        }
        const profile = await createProfile(input);
        sendJson(res, 201, profile);
      })
      .catch((error) => {
        if (error?.message?.includes("Unexpected")) {
          sendError(res, 400, "Invalid JSON body");
          return;
        }
        sendError(res, 500, "Failed to create profile", error.message);
      });
    return;
  }

  if (req.method === "GET" && req.url.startsWith("/profiles")) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const profileId = url.searchParams.get("id");
    const userId = url.searchParams.get("userId");

    if (profileId) {
      const profile = await getProfile(profileId);
      if (!profile) {
        sendError(res, 404, "Profile not found");
        return;
      }
      sendJson(res, 200, profile);
      return;
    }

    if (userId) {
      sendJson(res, 200, await listProfilesByUser(userId));
      return;
    }

    sendError(res, 400, "Provide id or userId to fetch profiles");
    return;
  }

  if (req.method === "POST" && req.url === "/calendars") {
    parseJsonBody(req)
      .then(async (input) => {
        const errors = validateCalendar(input);
        if (errors.length > 0) {
          sendError(res, 400, "Invalid calendar input", errors);
          return;
        }
        const calendar = await createCalendar(input);
        sendJson(res, 201, calendar);
      })
      .catch((error) => {
        if (error?.message?.includes("Unexpected")) {
          sendError(res, 400, "Invalid JSON body");
          return;
        }
        sendError(res, 500, "Failed to create calendar", error.message);
      });
    return;
  }

  if (req.method === "GET" && req.url.startsWith("/calendars")) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const calendarId = url.searchParams.get("id");
    const userId = url.searchParams.get("userId");

    if (calendarId) {
      const calendar = await getCalendar(calendarId);
      if (!calendar) {
        sendError(res, 404, "Calendar not found");
        return;
      }
      sendJson(res, 200, calendar);
      return;
    }

    if (userId) {
      sendJson(res, 200, await listCalendarsByUser(userId));
      return;
    }

    sendError(res, 400, "Provide id or userId to fetch calendars");
    return;
  }

  if (req.method === "POST" && req.url === "/posts") {
    parseJsonBody(req)
      .then(async (input) => {
        const errors = validatePost(input);
        if (errors.length > 0) {
          sendError(res, 400, "Invalid post input", errors);
          return;
        }
        const post = await createPost(input);
        sendJson(res, 201, post);
      })
      .catch((error) => {
        if (error?.message?.includes("Unexpected")) {
          sendError(res, 400, "Invalid JSON body");
          return;
        }
        sendError(res, 500, "Failed to create post", error.message);
      });
    return;
  }

  if (req.method === "GET" && req.url.startsWith("/posts")) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const postId = url.searchParams.get("id");
    const calendarId = url.searchParams.get("calendarId");

    if (postId) {
      const post = await getPost(postId);
      if (!post) {
        sendError(res, 404, "Post not found");
        return;
      }
      sendJson(res, 200, post);
      return;
    }

    if (calendarId) {
      sendJson(res, 200, await listPostsByCalendar(calendarId));
      return;
    }

    sendError(res, 400, "Provide id or calendarId to fetch posts");
    return;
  }

  if (req.method === "POST" && req.url === "/generate/monthly") {
    parseJsonBody(req)
      .then(async (input) => {
        const errors = validateMonthlyGeneration(input);
        if (errors.length > 0) {
          sendError(res, 400, "Invalid monthly generation input", errors);
          return;
        }
        try {
          const result = await generateMonthlyTitles(input);
          let calendar = null;

          if (input.calendarId) {
            calendar = await updateCalendarTitles(input.calendarId, result.titles);
            if (!calendar) {
              sendError(res, 404, "Calendar not found");
              return;
            }
          } else if (input.userId) {
            const created = await createCalendar({
              userId: input.userId,
              month: input.month,
              year: input.year,
              selectedDays: input.selectedDays,
            });
            calendar = await updateCalendarTitles(created.id, result.titles);
          }

          logEvent("generation.monthly", {
            provider: result.meta?.provider,
            attempts: result.meta?.attempts,
            durationMs: result.meta?.durationMs,
          });
          const responsePayload = { ...result, calendar };
          const responseErrors = validateMonthlyResponse(responsePayload);
          if (responseErrors.length > 0) {
            sendError(res, 500, "Response schema violation", responseErrors);
            return;
          }
          sendJson(res, 200, responsePayload);
        } catch (error) {
          sendError(res, 502, "Generation failed", error.message);
        }
      })
      .catch((error) => {
        if (error?.message?.includes("Unexpected")) {
        sendError(res, 400, "Invalid JSON body");
          return;
        }
        sendError(res, 500, "Failed to generate monthly plan", error.message);
      });
    return;
  }

  if (req.method === "POST" && req.url === "/generate/post") {
    parseJsonBody(req)
      .then(async (input) => {
        const errors = validatePostGeneration(input);
        if (errors.length > 0) {
          sendError(res, 400, "Invalid post generation input", errors);
          return;
        }
        try {
          const result = await generatePost(input);
          const stored = await createPost({
            calendarId: input.calendarId,
            day: input.day,
            platform: input.platform,
            tone: input.tone,
            title: result.title,
            hook: result.hook,
            caption: result.caption,
            hashtags: result.hashtags,
            cta: result.cta,
            platformTips: result.platformTips,
          });
          logEvent("generation.post", {
            provider: result.meta?.provider,
            attempts: result.meta?.attempts,
            durationMs: result.meta?.durationMs,
          });
          const responsePayload = { post: stored, meta: result.meta };
          const responseErrors = validatePostResponse(responsePayload);
          if (responseErrors.length > 0) {
            sendError(res, 500, "Response schema violation", responseErrors);
            return;
          }
          sendJson(res, 200, responsePayload);
        } catch (error) {
          sendError(res, 502, "Generation failed", error.message);
        }
      })
      .catch((error) => {
        if (error?.message?.includes("Unexpected")) {
          sendError(res, 400, "Invalid JSON body");
          return;
        }
        sendError(res, 500, "Failed to generate post", error.message);
      });
    return;
  }

  return notFoundHandler(req, res);
  } catch (error) {
    sendError(res, 500, "Internal server error", error.message);
  }
});

const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});
