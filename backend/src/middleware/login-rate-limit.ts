import { Request, Response, NextFunction } from "express";

const attempts = new Map<string, { count: number; resetAt: number }>();

export function loginAttemptKey(req: Request) {
  const phone = typeof req.body?.phone === "string" ? req.body.phone.trim() : "unknown";
  return `${req.ip ?? "unknown"}:${phone}`;
}

export function loginRateLimit(req: Request, res: Response, next: NextFunction): void {
  const key = loginAttemptKey(req);
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 });
    next();
    return;
  }
  if (current.count >= 5) {
    res.status(429).json({ error: "Too Many Requests", message: "Too many login attempts. Try again later." });
    return;
  }
  current.count += 1;
  next();
}

export function clearLoginAttempts(req: Request) {
  attempts.delete(loginAttemptKey(req));
}
