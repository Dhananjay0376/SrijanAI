const { Client } = require("pg");
const { getDatabaseUrl, getPgSslConfig } = require("../src/env");

async function main() {
  const connectionString = getDatabaseUrl();

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const client = new Client({
    connectionString,
    ssl: getPgSslConfig(),
    connectionTimeoutMillis: 15000,
  });

  await client.connect();
  const result = await client.query(
    "select current_database() as db, current_user as usr, now() as now",
  );
  await client.end();

  console.log(
    JSON.stringify({
      status: "ok",
      db: result.rows[0].db,
      user: result.rows[0].usr,
      time: result.rows[0].now,
    }),
  );
}

main().catch((error) => {
  console.error(
    JSON.stringify({
      status: "error",
      code: error.code || "NO_CODE",
      message: error.message,
    }),
  );
  process.exit(1);
});
