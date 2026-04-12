require("dotenv").config({ path: [".env.local", ".env"] });

const http = require("node:http");
const dotenv = require("dotenv");
const { dbHealthHandler, healthHandler } = require("./modules/health");
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
const { getCorsHeaders, parseJsonBody, sendError, sendJson } = require("./lib/http");
const { logEvent } = require("./lib/logger");
const {
  validateMonthlyResponse,
  validatePostResponse,
} = require("./lib/schema");
const { generateMonthlyTitles, generatePost } = require("./lib/ai/router");
const {
  validateCreatorProfile,
  validateCalendar,
  validatePreviewGeneration,
  validatePost,
  validateMonthlyGeneration,
  validatePostGeneration,
} = require("./lib/validation");

const server = http.createServer(async (req, res) => {
  try {
  const isDatabaseUnavailable = (error) => {
    const message = String(error?.message || "").toLowerCase();
    const code = String(error?.code || "").toUpperCase();

    return (
      code === "ETIMEDOUT" ||
      code === "ECONNREFUSED" ||
      code === "EHOSTUNREACH" ||
      code === "ENETUNREACH" ||
      message.includes("timeout") ||
      message.includes("connect") ||
      message.includes("network")
    );
  };

  const sendDataAccessError = (error, entity) => {
    if (isDatabaseUnavailable(error)) {
      sendError(res, 503, `Database unavailable while fetching ${entity}`, error.message);
      return;
    }

    sendError(res, 500, `Failed to fetch ${entity}`, error.message);
  };

  if (req.method === "OPTIONS") {
    res.writeHead(204, getCorsHeaders());
    res.end();
    return;
  }

  if (req.method === "GET" && (req.url === "/" || req.url === "")) {
    const headers = getCorsHeaders();
    headers["Content-Type"] = "text/html";
    res.writeHead(200, headers);
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>SrijanAI API</title>
        <style>
          body { 
            background: #051110; color: #029cc1; 
            font-family: 'Inter', system-ui, sans-serif; 
            display: flex; justify-content: center; align-items: center; 
            height: 100vh; margin: 0; 
          }
          .container { 
            text-align: center; 
            padding: 40px;
            border: 1px solid rgba(2, 156, 193, 0.2);
            border-radius: 12px;
            background: rgba(5, 17, 16, 0.6);
            backdrop-filter: blur(10px);
            box-shadow: 0 0 30px rgba(2, 156, 193, 0.1);
          }
          h1 { 
            font-size: 2.5rem; margin: 0 0 10px; 
            color: #29b8b0; 
            text-shadow: 0 0 15px rgba(41, 184, 176, 0.5); 
          }
          p { font-size: 1.1rem; opacity: 0.8; margin-bottom: 25px; }
          .btn { 
            color: #029cc1; text-decoration: none; 
            border: 1px solid #029cc1; padding: 12px 24px; 
            border-radius: 6px; display: inline-block; 
            transition: all 0.3s; font-weight: 500;
          }
          .btn:hover { 
            background: #029cc1; color: #051110; 
            box-shadow: 0 0 20px rgba(2, 156, 193, 0.6); 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>SrijanAI Core API</h1>
          <p>Gateway is online and successfully routing traffic.</p>
          <a class="btn" href="/health">Check System Health</a>
        </div>
      </body>
      </html>
    `);
    return;
  }

  if (req.url === "/health") {
    return healthHandler(req, res);
  }

  if (req.url === "/health/db") {
    return dbHealthHandler(req, res);
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
    try {
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
    } catch (error) {
      sendDataAccessError(error, "profiles");
      return;
    }
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
    try {
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
    } catch (error) {
      sendDataAccessError(error, "calendars");
      return;
    }
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
    try {
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
    } catch (error) {
      sendDataAccessError(error, "posts");
      return;
    }
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
          let warning = null;

          if (input.calendarId) {
            try {
              calendar = await updateCalendarTitles(input.calendarId, result.titles);
              if (!calendar) {
                sendError(res, 404, "Calendar not found");
                return;
              }
            } catch (error) {
              if (isDatabaseUnavailable(error)) {
                warning = "Calendar generated, but it could not be saved because the database is unavailable.";
              } else {
                throw error;
              }
            }
          } else if (input.userId) {
            try {
              const created = await createCalendar({
                userId: input.userId,
                month: input.month,
                year: input.year,
                selectedDays: input.selectedDays,
              });
              calendar = await updateCalendarTitles(created.id, result.titles);
            } catch (error) {
              if (isDatabaseUnavailable(error)) {
                warning = "Calendar generated, but it could not be saved because the database is unavailable.";
              } else {
                throw error;
              }
            }
          }

          logEvent("generation.monthly", {
            provider: result.meta?.provider,
            attempts: result.meta?.attempts,
            durationMs: result.meta?.durationMs,
            persisted: Boolean(calendar),
          });
          const responsePayload = { ...result, calendar, warning };
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
          const isPreviewCalendar = String(input.calendarId || "").startsWith("preview-");
          let stored;
          let warning = null;

          if (isPreviewCalendar) {
            const now = new Date().toISOString();
            stored = {
              id: `preview-${Date.now()}`,
              calendarId: input.calendarId,
              day: input.day,
              title: result.title,
              hook: result.hook,
              caption: result.caption,
              hashtags: result.hashtags,
              cta: result.cta,
              platformTips: result.platformTips,
              createdAt: now,
              updatedAt: now,
            };
            warning = "Post generated in preview mode and was not saved.";
          } else {
            try {
              stored = await createPost({
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
            } catch (error) {
              if (isDatabaseUnavailable(error)) {
                const now = new Date().toISOString();
                stored = {
                  id: `generated-${Date.now()}`,
                  calendarId: input.calendarId,
                  day: input.day,
                  title: result.title,
                  hook: result.hook,
                  caption: result.caption,
                  hashtags: result.hashtags,
                  cta: result.cta,
                  platformTips: result.platformTips,
                  createdAt: now,
                  updatedAt: now,
                };
                warning = "Post generated, but it could not be saved because the database is unavailable.";
              } else {
                throw error;
              }
            }
          }
          logEvent("generation.post", {
            provider: result.meta?.provider,
            attempts: result.meta?.attempts,
            durationMs: result.meta?.durationMs,
            persisted: !warning,
          });
          const responsePayload = { post: stored, meta: result.meta, warning };
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

  if (req.method === "POST" && req.url === "/generate/preview") {
    parseJsonBody(req)
      .then(async (input) => {
        const errors = validatePreviewGeneration(input);
        if (errors.length > 0) {
          sendError(res, 400, "Invalid preview generation input", errors);
          return;
        }

        try {
          const result = await generatePost({
            calendarId: "preview",
            day: new Date().toISOString().slice(0, 10),
            language: input.language,
            platform: input.platform,
            title: input.topic,
            topic: input.topic,
            tone: input.topic,
          });

          sendJson(res, 200, {
            title: result.title,
            hook: result.hook,
            caption: result.caption,
            hashtags: result.hashtags,
            cta: result.cta,
            platformTips: result.platformTips,
            meta: result.meta,
          });
        } catch (error) {
          sendError(res, 502, "Preview generation failed", error.message);
        }
      })
      .catch((error) => {
        if (error?.message?.includes("Unexpected")) {
          sendError(res, 400, "Invalid JSON body");
          return;
        }
        sendError(res, 500, "Failed to generate preview", error.message);
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
