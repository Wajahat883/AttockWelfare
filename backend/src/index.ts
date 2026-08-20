import "dotenv/config";
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import memberRoutes from "./routes/members.routes";
import paymentRoutes from "./routes/payments.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import defaulterRoutes from "./routes/defaulters.routes";
import reportsRoutes from "./routes/reports.routes";
import adminsRoutes from "./routes/admins.routes";
import { loginRateLimit } from "./middleware/login-rate-limit";

const app: Express = express();
const port = process.env.PORT || 5000;

// Middleware
const allowedOrigins = (process.env.FRONTEND_URL ?? "http://localhost:3000,http://127.0.0.1:3000").split(",").map((origin) => origin.trim()).filter(Boolean);
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth/login", loginRateLimit);

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// API Routes
app.get("/api", (_req: Request, res: Response) => {
  res.json({ name: "Attock Welfare API", version: "1.0.0", health: "/health" });
});
app.get("/api/docs", (_req: Request, res: Response) => {
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
app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/defaulters", defaulterRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/admins", adminsRoutes);

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.path} not found`,
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
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
