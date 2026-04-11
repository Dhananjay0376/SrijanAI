const http = require("node:http");
const { healthHandler } = require("./modules/health");
const { createProfile } = require("./modules/creator-profile");
const { createCalendar } = require("./modules/calendar");
const { notFoundHandler } = require("./modules/not-found");

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    return healthHandler(req, res);
  }

  if (req.method === "POST" && req.url === "/profiles") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      const input = JSON.parse(body || "{}");
      const profile = createProfile(input);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(profile));
    });
    return;
  }

  if (req.method === "POST" && req.url === "/calendars") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      const input = JSON.parse(body || "{}");
      const calendar = createCalendar(input);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(calendar));
    });
    return;
  }

  return notFoundHandler(req, res);
});

const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});
