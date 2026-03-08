const requests = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 20;

export function rateLimit(ip: string): { ok: boolean; remaining: number } {
  const now = Date.now();
  const entry = requests.get(ip);

  if (!entry || now > entry.resetAt) {
    requests.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, remaining: MAX_REQUESTS - 1 };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { ok: false, remaining: 0 };
  }

  entry.count++;
  return { ok: true, remaining: MAX_REQUESTS - entry.count };
}

// Cleanup stale entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, val] of requests) {
      if (now > val.resetAt) requests.delete(key);
    }
  }, 300_000);
}
