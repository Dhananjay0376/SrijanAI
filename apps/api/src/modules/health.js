const { pingDatabase } = require("@srijanai/db");

function writeJson(res, statusCode, body) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

function healthHandler(_req, res) {
  writeJson(res, 200, {
    status: "ok",
    service: "srijanai-api",
    time: new Date().toISOString(),
  });
}

async function dbHealthHandler(_req, res) {
  try {
    const result = await pingDatabase();
    writeJson(res, 200, {
      status: "ok",
      service: "srijanai-api",
      database: {
        name: result.db,
        user: result.usr,
        time: result.now,
      },
    });
  } catch (error) {
    writeJson(res, 503, {
      status: "error",
      service: "srijanai-api",
      database: {
        code: error.code || "NO_CODE",
        message: error.message,
      },
    });
  }
}

module.exports = { dbHealthHandler, healthHandler };
