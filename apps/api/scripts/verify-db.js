const path = require("node:path");
const dotenv = require("dotenv");
const { Client } = require("pg");

dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

const connectionString = process.env.DATABASE_URL;

async function verifyConnection() {
  console.log("--- Database Connection Diagnostic ---");
  console.log(`Connecting to: ${connectionString?.split("@")[1] || "URL NOT FOUND"}`);

  if (!connectionString) {
    console.error("ERROR: DATABASE_URL is not defined in .env.local");
    process.exit(1);
  }

  const client = new Client({
    connectionString,
    ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 5000,
  });

  try {
    const start = Date.now();
    await client.connect();
    const duration = Date.now() - start;

    console.log(`SUCCESS: Connected to database in ${duration}ms`);

    const result = await client.query(
      "SELECT current_user, current_database(), now()",
    );
    console.log("Postgres Info:", result.rows[0]);

    await client.end();
    console.log("--- Diagnostic Complete ---");
  } catch (error) {
    console.error("FAILURE: Could not connect to database");
    console.error("Error Code:", error.code);
    console.error("Error Message:", error.message);

    if (error.code === "ETIMEDOUT") {
      console.error("");
      console.error("SUGGESTION: This is a network timeout. Please check:");
      console.error("1. Is your IP allowed in Supabase Dashboard -> Settings -> Database?");
      console.error("2. Are you behind a corporate firewall or VPN that blocks port 6543?");
      console.error("3. Try using the direct connection on port 5432 if the pooler is down.");
    }

    process.exit(1);
  }
}

verifyConnection();
