"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginAttemptKey = loginAttemptKey;
exports.loginRateLimit = loginRateLimit;
exports.clearLoginAttempts = clearLoginAttempts;
const attempts = new Map();
function loginAttemptKey(req) {
    const phone = typeof req.body?.phone === "string" ? req.body.phone.trim() : "unknown";
    return `${req.ip ?? "unknown"}:${phone}`;
}
function loginRateLimit(req, res, next) {
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
function clearLoginAttempts(req) {
    attempts.delete(loginAttemptKey(req));
}
//# sourceMappingURL=login-rate-limit.js.map