"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../lib/prisma");
const password_1 = require("../utils/password");
async function main() {
    const owner = await prisma_1.prisma.user.findFirst({ where: { role: "OWNER" } });
    if (!owner)
        throw new Error("No owner account found");
    await prisma_1.prisma.user.update({ where: { id: owner.id }, data: { email: "waji2156@gmail.com", passwordHash: await (0, password_1.hashPassword)("Waji2156@"), isActive: true } });
    const removed = await prisma_1.prisma.user.deleteMany({ where: { role: "ADMIN", phone: { in: ["03002222222", "03003333333"] } } });
    console.log(`Owner configured. Removed ${removed.count} demo admin account(s).`);
}
main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma_1.prisma.$disconnect());
//# sourceMappingURL=configure-owner.js.map