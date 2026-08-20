"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const prisma_1 = require("../lib/prisma");
const date_1 = require("../utils/date");
const defaulter_service_1 = require("../services/defaulter.service");
const router = (0, express_1.Router)();
router.get("/summary", auth_middleware_1.authenticate, auth_middleware_1.ownerOrAdmin, async (_req, res) => {
    try {
        const month = (0, date_1.getCurrentMonth)();
        const [totalMembers, totalAdmins, payments, defaulters, expected, expectedAll] = await Promise.all([
            prisma_1.prisma.user.count({ where: { role: "USER", isActive: true } }),
            prisma_1.prisma.user.count({ where: { role: "ADMIN", isActive: true } }),
            prisma_1.prisma.payment.findMany({ where: { month }, include: { user: { select: { id: true, name: true, phone: true } } }, orderBy: { paidDate: "desc" } }),
            (0, defaulter_service_1.getDefaulters)(),
            prisma_1.prisma.user.aggregate({ where: { role: "USER", isActive: true }, _sum: { monthlyAmount: true } }),
            prisma_1.prisma.user.aggregate({ where: { role: { in: ["USER", "ADMIN"] }, isActive: true }, _sum: { monthlyAmount: true } }),
        ]);
        const collected = payments.filter((payment) => payment.status !== "UNPAID").reduce((sum, payment) => sum + Number(payment.amount), 0);
        res.json({ success: true, data: { currentMonth: month, currentYear: (0, date_1.getCurrentYear)(), totalMembers, totalAdmins, totalExpectedAmount: Number(expectedAll._sum.monthlyAmount ?? 0), collectedThisMonth: collected, totalPaymentRecords: payments.length, recentPayments: payments.slice(0, 12), pendingThisMonth: Math.max(0, Number(expected._sum.monthlyAmount ?? 0) - collected), defaulterCount: defaulters.length } });
    }
    catch (error) {
        console.error("[SUMMARY ERROR]", error);
        res.status(500).json({ error: "Internal Server Error", message: "Failed to get dashboard summary" });
    }
});
router.get("/defaulters", auth_middleware_1.authenticate, auth_middleware_1.ownerOrAdmin, async (_req, res) => {
    try {
        res.json({ success: true, data: await (0, defaulter_service_1.getDefaulters)() });
    }
    catch (error) {
        console.error("[DASHBOARD DEFAULTERS ERROR]", error);
        res.status(500).json({ error: "Internal Server Error", message: "Failed to get defaulters" });
    }
});
router.get("/yearly-report/:year", auth_middleware_1.authenticate, auth_middleware_1.ownerOrAdmin, async (req, res) => {
    const year = Number(req.params.year);
    if (!Number.isInteger(year)) {
        res.status(400).json({ error: "Bad Request", message: "Invalid year" });
        return;
    }
    const payments = await prisma_1.prisma.payment.findMany({ where: { year } });
    res.json({ success: true, data: { year, collected: payments.filter((payment) => payment.status !== "UNPAID").reduce((sum, payment) => sum + Number(payment.amount), 0), payments } });
});
exports.default = router;
//# sourceMappingURL=dashboard.routes.js.map