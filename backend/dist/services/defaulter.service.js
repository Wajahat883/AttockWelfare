"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaulters = getDefaulters;
const prisma_1 = require("../lib/prisma");
const date_1 = require("../utils/date");
async function getDefaulters() {
    const month = (0, date_1.getCurrentMonth)();
    return prisma_1.prisma.user.findMany({
        where: { role: "USER", isActive: true, NOT: { payments: { some: { month, status: "PAID" } } } },
        select: { id: true, name: true, fatherName: true, address: true, phone: true, monthlyAmount: true, isActive: true, createdAt: true },
        orderBy: { name: "asc" },
    });
}
//# sourceMappingURL=defaulter.service.js.map