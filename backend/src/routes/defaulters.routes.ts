import { Router, Response } from "express";
import { AuthRequest, authenticate, ownerOrAdmin } from "../middleware/auth.middleware";
import { getDefaulters } from "../services/defaulter.service";
import { getCurrentMonth, getCurrentYear } from "../utils/date";

const router = Router();

router.get("/", authenticate, ownerOrAdmin, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.json({ success: true, data: { month: getCurrentMonth(), year: getCurrentYear(), members: await getDefaulters() } });
  } catch (error) {
    console.error("[DEFAULTERS ERROR]", error);
    res.status(500).json({ error: "Internal Server Error", message: "Failed to get defaulters" });
  }
});

export default router;
