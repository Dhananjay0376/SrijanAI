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

async function pingDatabase() {
  const result = await pool.query(
    "select current_database() as db, current_user as usr, now() as now",
  );
  return result.rows[0];
}

module.exports = { db, pingDatabase, pool, schema };
