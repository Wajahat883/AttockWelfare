import { Router, Response } from "express";
import { AuthRequest, authenticate, ownerOrAdmin } from "../middleware/auth.middleware";
import { prisma } from "../lib/prisma";
import { getCurrentMonth, getCurrentYear } from "../utils/date";

const router = Router();

const validStatuses = ["PAID", "UNPAID", "PARTIAL"] as const;

router.get("/month/:month/year/:year", authenticate, ownerOrAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  const month = typeof req.params.month === "string" ? req.params.month : "";
  const year = typeof req.params.year === "string" ? req.params.year : "";
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month) || Number(year) !== Number(month.slice(0, 4))) { res.status(400).json({ error: "Bad Request", message: "Use a valid YYYY-MM month and matching year" }); return; }
  try {
    const payments = await prisma.payment.findMany({ where: { month, year: Number(year) }, include: { user: { select: { id: true, name: true, phone: true, monthlyAmount: true } } }, orderBy: { paidDate: "desc" } });
    res.json({ success: true, data: payments });
  } catch (error) { console.error("[MONTH PAYMENTS ERROR]", error); res.status(500).json({ error: "Internal Server Error", message: "Failed to get payments" }); }
});

router.get("/:userId", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = Number(req.params.userId);
  if (!Number.isInteger(userId)) { res.status(400).json({ error: "Bad Request", message: "Invalid user ID" }); return; }
  if (req.user!.role === "USER" && req.user!.userId !== userId) { res.status(403).json({ error: "Forbidden", message: "You can only view your own payments" }); return; }
  try { res.json({ success: true, data: await prisma.payment.findMany({ where: { userId }, orderBy: { month: "desc" } }) }); }
  catch (error) { console.error("[PAYMENTS ERROR]", error); res.status(500).json({ error: "Internal Server Error", message: "Failed to get payments" }); }
});

router.post("/", authenticate, ownerOrAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = Number(req.body.userId); const amount = Number(req.body.amount); const status = typeof req.body.status === "string" ? req.body.status.toUpperCase() : ""; const paymentMethod = typeof req.body.paymentMethod === "string" ? req.body.paymentMethod.toUpperCase() : "CASH";
  const validMethods = ["CASH", "BANK_TRANSFER", "JAZZCASH", "EASYPAISA", "OTHER"] as const;
  if (!Number.isInteger(userId) || !Number.isFinite(amount) || amount < 0 || !validStatuses.includes(status as typeof validStatuses[number]) || !validMethods.includes(paymentMethod as typeof validMethods[number])) { res.status(400).json({ error: "Bad Request", message: "Provide a member ID, valid amount, status, and payment method" }); return; }
  try {
    const member = await prisma.user.findFirst({ where: { id: userId, role: "USER", isActive: true }, select: { id: true } });
    if (!member) { res.status(404).json({ error: "Not Found", message: "Active member not found" }); return; }
    const month = getCurrentMonth(); const year = getCurrentYear(); const paidDate = status === "PAID" || status === "PARTIAL" ? new Date() : null;
    const existing = await prisma.payment.findFirst({ where: { userId, month } });
    const payment = existing
      ? await prisma.payment.update({ where: { id: existing.id }, data: { amount, status: status as "PAID" | "UNPAID" | "PARTIAL", paymentMethod: paymentMethod as "CASH" | "BANK_TRANSFER" | "JAZZCASH" | "EASYPAISA" | "OTHER", paidDate, addedBy: req.user!.userId } })
      : await prisma.payment.create({ data: { userId, amount, status: status as "PAID" | "UNPAID" | "PARTIAL", paymentMethod: paymentMethod as "CASH" | "BANK_TRANSFER" | "JAZZCASH" | "EASYPAISA" | "OTHER", month, year, paidDate, addedBy: req.user!.userId } });
    await prisma.auditLog.create({ data: { actorId: req.user!.userId, action: existing ? "UPDATE" : "CREATE", entity: "PAYMENT", entityId: payment.id, details: JSON.stringify({ userId, amount, status, paymentMethod }) } });
    res.status(existing ? 200 : 201).json({ success: true, data: payment });
  } catch (error) { console.error("[CREATE PAYMENT ERROR]", error); res.status(500).json({ error: "Internal Server Error", message: "Failed to record payment" }); }
});

router.delete("/:id", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  if (req.user!.role !== "OWNER") { res.status(403).json({ error: "Forbidden", message: "Only the owner can delete payments" }); return; }
  const id = Number(req.params.id); if (!Number.isInteger(id)) { res.status(400).json({ error: "Bad Request", message: "Invalid payment ID" }); return; }
  try { await prisma.payment.delete({ where: { id } }); res.status(204).send(); }
  catch (error: unknown) { if (typeof error === "object" && error && "code" in error && error.code === "P2025") { res.status(404).json({ error: "Not Found", message: "Payment not found" }); return; } console.error("[DELETE PAYMENT ERROR]", error); res.status(500).json({ error: "Internal Server Error", message: "Failed to delete payment" }); }
});

export default router;
