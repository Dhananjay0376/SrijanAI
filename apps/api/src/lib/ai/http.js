async function fetchWithTimeout(url, options) {
  const controller = new AbortController();
  const timeout = options.timeoutMs || 20000;
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchWithRetry(url, options) {
  const retries = options.retries ?? 2;
  let attempt = 0;
  let lastError = null;

  while (attempt <= retries) {
    try {
      const response = await fetchWithTimeout(url, options);
      if (response.status >= 500 || response.status === 429) {
        lastError = new Error(`Upstream error ${response.status}`);
      } else {
        return response;
      }
    } catch (error) {
      lastError = error;
    }

    attempt += 1;
  }

  throw lastError || new Error("Request failed");
}

module.exports = { fetchWithRetry };

