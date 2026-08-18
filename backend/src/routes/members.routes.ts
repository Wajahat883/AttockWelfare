import { Router, Response } from "express";
import { AuthRequest, authenticate, ownerOrAdmin } from "../middleware/auth.middleware";

const router = Router();

// TODO: Implement member routes
// GET /api/members - List all members (Owner/Admin only)
router.get("/", authenticate, ownerOrAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  res.json({ message: "Get members - Coming soon" });
});

// POST /api/members - Create new member (Owner/Admin only)
router.post("/", authenticate, ownerOrAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  res.json({ message: "Create member - Coming soon" });
});

// GET /api/members/:id - Get member details
router.get("/:id", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  res.json({ message: "Get member details - Coming soon" });
});

export default router;
