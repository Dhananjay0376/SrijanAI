function healthHandler(_req, res) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      status: "ok",
      service: "srijanai-api",
      time: new Date().toISOString(),
    }),
  );
}

module.exports = { healthHandler };

