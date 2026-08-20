"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const members_routes_1 = __importDefault(require("./routes/members.routes"));
const payments_routes_1 = __importDefault(require("./routes/payments.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const defaulters_routes_1 = __importDefault(require("./routes/defaulters.routes"));
const reports_routes_1 = __importDefault(require("./routes/reports.routes"));
const admins_routes_1 = __importDefault(require("./routes/admins.routes"));
const login_rate_limit_1 = require("./middleware/login-rate-limit");
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Middleware
const allowedOrigins = (process.env.FRONTEND_URL ?? "http://localhost:3000,http://127.0.0.1:3000").split(",").map((origin) => origin.trim()).filter(Boolean);
app.use((0, cors_1.default)({ origin: allowedOrigins }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/auth/login", login_rate_limit_1.loginRateLimit);
// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});
// API Routes
app.get("/api", (_req, res) => {
    res.json({ name: "Attock Welfare API", version: "1.0.0", health: "/health" });
});
app.get("/api/docs", (_req, res) => {
    res.json({
        name: "Attock Welfare API",
        endpoints: [
            "POST /api/auth/login",
            "GET /api/auth/me",
            "GET|POST|PUT|DELETE /api/members",
            "GET|POST|DELETE /api/payments",
            "GET /api/defaulters",
            "GET /api/dashboard/summary",
            "GET /api/reports/monthly/:month/:year",
            "GET /api/reports/yearly/:year",
        ],
    });
});
app.use("/api/auth", auth_routes_1.default);
app.use("/api/members", members_routes_1.default);
app.use("/api/payments", payments_routes_1.default);
app.use("/api/dashboard", dashboard_routes_1.default);
app.use("/api/defaulters", defaulters_routes_1.default);
app.use("/api/reports", reports_routes_1.default);
app.use("/api/admins", admins_routes_1.default);
// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: "Not Found",
        message: `Route ${req.path} not found`,
        timestamp: new Date().toISOString(),
    });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error("[ERROR]", err);
    res.status(err.status || 500).json({
        error: "Internal Server Error",
        timestamp: new Date().toISOString(),
    });
});
// Start server
app.listen(port, () => {
    console.log(`🚀 Backend server running at http://localhost:${port}`);
    console.log(`📝 API Docs: http://localhost:${port}/api/docs`);
});
//# sourceMappingURL=index.js.map