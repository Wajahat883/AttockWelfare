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
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});
// API Routes
app.use("/api/auth", auth_routes_1.default);
app.use("/api/members", members_routes_1.default);
app.use("/api/payments", payments_routes_1.default);
app.use("/api/dashboard", dashboard_routes_1.default);
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
        error: err.message || "Internal Server Error",
        timestamp: new Date().toISOString(),
    });
});
// Start server
app.listen(port, () => {
    console.log(`🚀 Backend server running at http://localhost:${port}`);
    console.log(`📝 API Docs: http://localhost:${port}/api/docs`);
});
//# sourceMappingURL=index.js.map