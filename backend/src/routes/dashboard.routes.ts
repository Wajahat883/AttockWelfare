import { Router, Response } from "express";
import { AuthRequest, authenticate, ownerOrAdmin } from "../middleware/auth.middleware";
import { prisma } from "../lib/prisma";
import { getCurrentMonth, getCurrentYear } from "../utils/date";
import { getDefaulters } from "../services/defaulter.service";

const router = Router();

router.get("/summary", authenticate, ownerOrAdmin, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const month = getCurrentMonth();
    const [totalMembers, totalAdmins, payments, defaulters, expected, expectedAll] = await Promise.all([
      prisma.user.count({ where: { role: "USER", isActive: true } }),
      prisma.user.count({ where: { role: "ADMIN", isActive: true } }),
      prisma.payment.findMany({ where: { month }, include: { user: { select: { id: true, name: true, phone: true } } }, orderBy: { paidDate: "desc" } }),
      getDefaulters(),
      prisma.user.aggregate({ where: { role: "USER", isActive: true }, _sum: { monthlyAmount: true } }),
      prisma.user.aggregate({ where: { role: { in: ["USER", "ADMIN"] }, isActive: true }, _sum: { monthlyAmount: true } }),
    ]);
    const collected = payments.filter((payment) => payment.status !== "UNPAID").reduce((sum, payment) => sum + Number(payment.amount), 0);
    res.json({ success: true, data: { currentMonth: month, currentYear: getCurrentYear(), totalMembers, totalAdmins, totalExpectedAmount: Number(expectedAll._sum.monthlyAmount ?? 0), collectedThisMonth: collected, totalPaymentRecords: payments.length, recentPayments: payments.slice(0, 12), pendingThisMonth: Math.max(0, Number(expected._sum.monthlyAmount ?? 0) - collected), defaulterCount: defaulters.length } });
  } catch (error) { console.error("[SUMMARY ERROR]", error); res.status(500).json({ error: "Internal Server Error", message: "Failed to get dashboard summary" }); }
});

router.get("/defaulters", authenticate, ownerOrAdmin, async (_req: AuthRequest, res: Response): Promise<void> => {
  try { res.json({ success: true, data: await getDefaulters() }); }
  catch (error) { console.error("[DASHBOARD DEFAULTERS ERROR]", error); res.status(500).json({ error: "Internal Server Error", message: "Failed to get defaulters" }); }
});

router.get("/yearly-report/:year", authenticate, ownerOrAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  const year = Number(req.params.year);
  if (!Number.isInteger(year)) { res.status(400).json({ error: "Bad Request", message: "Invalid year" }); return; }
  const payments = await prisma.payment.findMany({ where: { year } });
  res.json({ success: true, data: { year, collected: payments.filter((payment) => payment.status !== "UNPAID").reduce((sum, payment) => sum + Number(payment.amount), 0), payments } });
});

export default router;
