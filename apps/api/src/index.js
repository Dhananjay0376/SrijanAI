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
} = require("./modules/calendar");
const { createPost, getPost, listPostsByCalendar } = require("./modules/posts");
const { notFoundHandler } = require("./modules/not-found");
const { parseJsonBody, sendError, sendJson } = require("./lib/http");
const {
  validateCreatorProfile,
  validateCalendar,
  validatePost,
} = require("./lib/validation");

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    return healthHandler(req, res);
  }

  if (req.method === "POST" && req.url === "/profiles") {
    parseJsonBody(req)
      .then((input) => {
        const errors = validateCreatorProfile(input);
        if (errors.length > 0) {
          sendError(res, 400, "Invalid creator profile input", errors);
          return;
        }
        const profile = createProfile(input);
        sendJson(res, 201, profile);
      })
      .catch(() => {
        sendError(res, 400, "Invalid JSON body");
      });
    return;
  }

  if (req.method === "GET" && req.url.startsWith("/profiles")) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const profileId = url.searchParams.get("id");
    const userId = url.searchParams.get("userId");

    if (profileId) {
      const profile = getProfile(profileId);
      if (!profile) {
        sendError(res, 404, "Profile not found");
        return;
      }
      sendJson(res, 200, profile);
      return;
    }

    if (userId) {
      sendJson(res, 200, listProfilesByUser(userId));
      return;
    }

    sendError(res, 400, "Provide id or userId to fetch profiles");
    return;
  }

  if (req.method === "POST" && req.url === "/calendars") {
    parseJsonBody(req)
      .then((input) => {
        const errors = validateCalendar(input);
        if (errors.length > 0) {
          sendError(res, 400, "Invalid calendar input", errors);
          return;
        }
        const calendar = createCalendar(input);
        sendJson(res, 201, calendar);
      })
      .catch(() => {
        sendError(res, 400, "Invalid JSON body");
      });
    return;
  }

  if (req.method === "GET" && req.url.startsWith("/calendars")) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const calendarId = url.searchParams.get("id");
    const userId = url.searchParams.get("userId");

    if (calendarId) {
      const calendar = getCalendar(calendarId);
      if (!calendar) {
        sendError(res, 404, "Calendar not found");
        return;
      }
      sendJson(res, 200, calendar);
      return;
    }

    if (userId) {
      sendJson(res, 200, listCalendarsByUser(userId));
      return;
    }

    sendError(res, 400, "Provide id or userId to fetch calendars");
    return;
  }

  if (req.method === "POST" && req.url === "/posts") {
    parseJsonBody(req)
      .then((input) => {
        const errors = validatePost(input);
        if (errors.length > 0) {
          sendError(res, 400, "Invalid post input", errors);
          return;
        }
        const post = createPost(input);
        sendJson(res, 201, post);
      })
      .catch(() => {
        sendError(res, 400, "Invalid JSON body");
      });
    return;
  }

  if (req.method === "GET" && req.url.startsWith("/posts")) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const postId = url.searchParams.get("id");
    const calendarId = url.searchParams.get("calendarId");

    if (postId) {
      const post = getPost(postId);
      if (!post) {
        sendError(res, 404, "Post not found");
        return;
      }
      sendJson(res, 200, post);
      return;
    }

    if (calendarId) {
      sendJson(res, 200, listPostsByCalendar(calendarId));
      return;
    }

    sendError(res, 400, "Provide id or calendarId to fetch posts");
    return;
  }

  return notFoundHandler(req, res);
});

const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});
