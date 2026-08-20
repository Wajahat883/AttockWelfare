import { prisma } from "../lib/prisma";
import { hashPassword } from "../utils/password";

async function main() {
  const [name, phone, password] = process.argv.slice(2);
  if (!name || !phone || !password || password.length < 8) { console.error("Usage: npm run owner:create -- \"Name\" phone password"); process.exit(1); }
  await prisma.user.create({ data: { name, phone, passwordHash: await hashPassword(password), role: "OWNER", monthlyAmount: 0 } });
  console.log("Owner created successfully");
}
main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
