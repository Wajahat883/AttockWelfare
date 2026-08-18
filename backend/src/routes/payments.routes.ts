import { Router, Response } from "express";
import { AuthRequest, authenticate, ownerOrAdmin } from "../middleware/auth.middleware";

const router = Router();

// TODO: Implement payment routes
// GET /api/payments/:userId - Get user payments
router.get("/:userId", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  res.json({ message: "Get payments - Coming soon" });
});

// POST /api/payments - Record new payment (Owner/Admin only)
router.post("/", authenticate, ownerOrAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  res.json({ message: "Create payment - Coming soon" });
});

export default router;
