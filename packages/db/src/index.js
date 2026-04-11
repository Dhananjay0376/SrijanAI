const { Pool } = require("pg");
const { drizzle } = require("drizzle-orm/node-postgres");
const schema = require("./schema");
const { getDatabaseUrl } = require("./env");

const connectionString = getDatabaseUrl();

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const sslEnabled = process.env.DATABASE_SSL === "true";

const pool = new Pool({
  connectionString,
  ssl: sslEnabled ? { rejectUnauthorized: false } : undefined,
});

const db = drizzle(pool, { schema });

module.exports = { db, pool, schema };
