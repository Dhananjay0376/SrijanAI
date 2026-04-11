const { Pool } = require("pg");
const { drizzle } = require("drizzle-orm/node-postgres");
const schema = require("./schema");
const { getDatabaseUrl, getPgSslConfig } = require("./env");

const connectionString = getDatabaseUrl();

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({
  connectionString,
  ssl: getPgSslConfig(),
});

const db = drizzle(pool, { schema });

module.exports = { db, pool, schema };
