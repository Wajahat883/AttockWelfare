import { Router, Response } from "express";
import { AuthRequest, authenticate } from "../middleware/auth.middleware";

const router = Router();

// TODO: Implement dashboard routes
// GET /api/dashboard/summary - Dashboard summary stats
router.get("/summary", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  res.json({ message: "Dashboard summary - Coming soon" });
});

// GET /api/dashboard/defaulters - List defaulters for current month
router.get("/defaulters", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  res.json({ message: "Defaulters list - Coming soon" });
});

export default router;
