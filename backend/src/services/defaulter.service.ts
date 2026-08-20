import { prisma } from "../lib/prisma";
import { getCurrentMonth } from "../utils/date";

export async function getDefaulters() {
  const month = getCurrentMonth();
  return prisma.user.findMany({
    where: { role: "USER", isActive: true, NOT: { payments: { some: { month, status: "PAID" } } } },
    select: { id: true, name: true, fatherName: true, address: true, phone: true, monthlyAmount: true, isActive: true, createdAt: true },
    orderBy: { name: "asc" },
  });
}
