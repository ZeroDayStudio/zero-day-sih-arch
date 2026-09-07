const MAX_ENTRIES = 256;
const entries = new Map();
const inFlight = new Map();

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function removeExpired() {
  const now = Date.now();
  for (const [key, entry] of entries) {
    if (entry.expiresAt <= now) entries.delete(key);
  }
}

async function getJson(key) {
  removeExpired();
  const entry = entries.get(key);
  if (!entry) return null;
  entries.delete(key);
  entries.set(key, entry);
  return clone(entry.value);
}

async function setJson(key, value, ttlSeconds) {
  removeExpired();
  entries.delete(key);
  entries.set(key, {
    value: clone(value),
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
  while (entries.size > MAX_ENTRIES)
    entries.delete(entries.keys().next().value);
}

async function deleteKey(key) {
  entries.delete(key);
}

async function getOrSetJson(key, ttlSeconds, loader) {
  const cached = await getJson(key);
  if (cached !== null) return { value: cached, cached: true };
  if (inFlight.has(key))
    return { value: await inFlight.get(key), cached: false };

  const pending = Promise.resolve().then(loader);
  inFlight.set(key, pending);
  try {
    const value = await pending;
    await setJson(key, value, ttlSeconds);
    return { value, cached: false };
  } finally {
    inFlight.delete(key);
  }
}

module.exports = { getJson, setJson, deleteKey, getOrSetJson };
