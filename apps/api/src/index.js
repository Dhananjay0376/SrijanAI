const http = require("node:http");
const { healthHandler } = require("./modules/health");
const { notFoundHandler } = require("./modules/not-found");

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    return healthHandler(req, res);
  }

  return notFoundHandler(req, res);
});

const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});

