const http = require("node:http");
const { healthHandler } = require("./modules/health");
const { createProfile } = require("./modules/creator-profile");
const { createCalendar } = require("./modules/calendar");
const { notFoundHandler } = require("./modules/not-found");
const { parseJsonBody, sendError, sendJson } = require("./lib/http");
const {
  validateCreatorProfile,
  validateCalendar,
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

  return notFoundHandler(req, res);
});

const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});
