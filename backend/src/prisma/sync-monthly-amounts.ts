import { prisma } from "../lib/prisma";

async function main() {
  const users = await prisma.user.findMany({ where: { role: "USER", monthlyAmount: 0 }, select: { id: true } });
  let updated = 0;
  for (const user of users) {
    const latest = await prisma.payment.findFirst({ where: { userId: user.id, status: { not: "UNPAID" } }, orderBy: [{ paidDate: "desc" }, { createdAt: "desc" }], select: { amount: true } });
    if (latest) { await prisma.user.update({ where: { id: user.id }, data: { monthlyAmount: latest.amount } }); updated += 1; }
  }
  console.log(`Updated monthly amounts for ${updated} members.`);
}
main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
