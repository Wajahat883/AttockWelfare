import { Router, Response } from "express";
import { AuthRequest, authenticate, ownerOrAdmin } from "../middleware/auth.middleware";
import { prisma } from "../lib/prisma";
import { buildWhatsAppUrl, generateWhatsAppMessage } from "../utils/whatsapp";

const router = Router();
const monthPattern = /^\d{4}-(0[1-9]|1[0-2])$/;

router.get("/monthly/:month/:year", authenticate, ownerOrAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  const month = String(req.params.month);
  const year = Number(req.params.year);
  if (!monthPattern.test(month) || Number(month.slice(0, 4)) !== year) { res.status(400).json({ error: "Bad Request", message: "Use a valid month and year" }); return; }
  try {
    const [payments, totalMembers, pending] = await Promise.all([
      prisma.payment.findMany({ where: { month, year }, include: { user: { select: { id: true, name: true, phone: true, monthlyAmount: true } } }, orderBy: { createdAt: "desc" } }),
      prisma.user.count({ where: { role: "USER", isActive: true } }),
      prisma.user.count({ where: { role: "USER", isActive: true, NOT: { payments: { some: { month, status: "PAID" } } } } }),
    ]);
    const collected = payments.filter((payment) => payment.status !== "UNPAID").reduce((sum, payment) => sum + Number(payment.amount), 0);
    res.json({ success: true, data: { month, year, totalMembers, collected, pending, payments } });
  } catch (error) { console.error("[MONTHLY REPORT ERROR]", error); res.status(500).json({ error: "Internal Server Error", message: "Failed to build monthly report" }); }
});

router.get("/yearly/:year", authenticate, ownerOrAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  const year = Number(req.params.year);
  if (!Number.isInteger(year) || year < 2000 || year > new Date().getFullYear() + 1) { res.status(400).json({ error: "Bad Request", message: "Use a valid year" }); return; }
  try {
    const payments = await prisma.payment.findMany({ where: { year }, orderBy: { month: "asc" } });
    const months = Array.from({ length: 12 }, (_, index) => {
      const month = `${year}-${String(index + 1).padStart(2, "0")}`;
      const entries = payments.filter((payment) => payment.month === month);
      return { month, collected: entries.filter((payment) => payment.status !== "UNPAID").reduce((sum, payment) => sum + Number(payment.amount), 0), payments: entries.length };
    });
    res.json({ success: true, data: { year, totalCollected: months.reduce((sum, month) => sum + month.collected, 0), months } });
  } catch (error) { console.error("[YEARLY REPORT ERROR]", error); res.status(500).json({ error: "Internal Server Error", message: "Failed to build yearly report" }); }
});

router.get("/whatsapp/:id", authenticate, ownerOrAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) { res.status(400).json({ error: "Bad Request", message: "Invalid member ID" }); return; }
  try {
    const member = await prisma.user.findFirst({ where: { id, role: "USER", isActive: true }, select: { name: true, phone: true, monthlyAmount: true } });
    if (!member) { res.status(404).json({ error: "Not Found", message: "Active member not found" }); return; }
    const message = generateWhatsAppMessage(member);
    res.json({ success: true, data: { url: buildWhatsAppUrl(member.phone, message), message } });
  } catch (error) { console.error("[WHATSAPP ERROR]", error); res.status(500).json({ error: "Internal Server Error", message: "Failed to create WhatsApp reminder" }); }
});

export default router;
