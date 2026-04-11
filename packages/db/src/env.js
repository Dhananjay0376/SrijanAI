const fs = require("node:fs");
const path = require("node:path");

function loadEnvFromFile() {
  if (process.env.DATABASE_URL) {
    return;
  }

  const envPath = path.join(__dirname, "..", "..", "..", "apps", "api", ".env.local");
  if (!fs.existsSync(envPath)) {
    return;
  }

  const content = fs.readFileSync(envPath, "utf8");
  content.split(/\r?\n/).forEach((line) => {
    if (!line || line.startsWith("#") || !line.includes("=")) {
      return;
    }
    const [key, ...rest] = line.split("=");
    if (!process.env[key]) {
      process.env[key] = rest.join("=");
    }
  });
}

function withSslMode(url) {
  if (!url) {
    return url;
  }

  const sslEnabled = process.env.DATABASE_SSL === "true";
  const sslMode = process.env.DATABASE_SSL_MODE || (sslEnabled ? "no-verify" : null);

  if (!sslMode) {
    return url;
  }

  try {
    const parsed = new URL(url);
    if (!parsed.searchParams.has("sslmode")) {
      parsed.searchParams.set("sslmode", sslMode);
    }
    return parsed.toString();
  } catch {
    if (url.includes("sslmode=")) {
      return url;
    }
    const joiner = url.includes("?") ? "&" : "?";
    return `${url}${joiner}sslmode=${sslMode}`;
  }
}

function withHostOverride(url, hostOverride = process.env.DATABASE_HOSTADDR) {
  if (!url || !hostOverride) {
    return url;
  }

  try {
    const parsed = new URL(url);
    parsed.hostname = hostOverride;
    return parsed.toString();
  } catch {
    return url;
  }
}

function getDatabaseUrl() {
  loadEnvFromFile();
  return withHostOverride(withSslMode(process.env.DATABASE_URL));
}

function getPgSslConfig() {
  loadEnvFromFile();

  if (process.env.DATABASE_SSL !== "true") {
    return undefined;
  }

  const sslMode = process.env.DATABASE_SSL_MODE || "no-verify";
  if (sslMode === "no-verify") {
    return { rejectUnauthorized: false };
  }

  return {};
}

module.exports = {
  getDatabaseUrl,
  getPgSslConfig,
  loadEnvFromFile,
  withHostOverride,
  withSslMode,
};
