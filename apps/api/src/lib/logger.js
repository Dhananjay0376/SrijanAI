function logEvent(event, payload) {
  const entry = {
    event,
    time: new Date().toISOString(),
    ...payload,
  };
  console.log(JSON.stringify(entry));
}

module.exports = { logEvent };

