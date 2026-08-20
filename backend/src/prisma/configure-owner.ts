import { prisma } from "../lib/prisma";
import { hashPassword } from "../utils/password";

async function main() {
  const owner = await prisma.user.findFirst({ where: { role: "OWNER" } });
  if (!owner) throw new Error("No owner account found");
  await prisma.user.update({ where: { id: owner.id }, data: { email: "waji2156@gmail.com", passwordHash: await hashPassword("Waji2156@"), isActive: true } });
  const removed = await prisma.user.deleteMany({ where: { role: "ADMIN", phone: { in: ["03002222222", "03003333333"] } } });
  console.log(`Owner configured. Removed ${removed.count} demo admin account(s).`);
}
main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
