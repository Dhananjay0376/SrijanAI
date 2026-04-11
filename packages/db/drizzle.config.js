const { getDatabaseUrl } = require("./src/env");

const databaseUrl = getDatabaseUrl();

module.exports = {
  schema: "./src/schema.js",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
};
