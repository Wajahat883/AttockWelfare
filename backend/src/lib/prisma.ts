import "dotenv/config";
import { PrismaClient } from "../generated/prisma";

export const prisma = new PrismaClient({
  log: ["info", "warn", "error"],
});

// Handle shutdown gracefully
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
