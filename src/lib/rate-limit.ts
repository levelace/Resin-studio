// Lightweight in-memory rate limiter. Good enough for single-instance deployments
// and to stop obvious abuse. Swap for Upstash Redis for multi-instance prod.

type Bucket = { count: number; resetAt: number };
const store = new Map<string, Bucket>();

export function rateLimit(key: string, limit = 10, windowMs = 60_000) {
  const now = Date.now();
  const bucket = store.get(key);
  if (!bucket || bucket.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }
  if (bucket.count >= limit) return { ok: false, remaining: 0 };
  bucket.count += 1;
  return { ok: true, remaining: limit - bucket.count };
}

export function clientKey(req: Request, scope: string) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  return `${scope}:${ip}`;
}
