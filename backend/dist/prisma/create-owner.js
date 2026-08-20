"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../lib/prisma");
const password_1 = require("../utils/password");
async function main() {
    const [name, phone, password] = process.argv.slice(2);
    if (!name || !phone || !password || password.length < 8) {
        console.error("Usage: npm run owner:create -- \"Name\" phone password");
        process.exit(1);
    }
    await prisma_1.prisma.user.create({ data: { name, phone, passwordHash: await (0, password_1.hashPassword)(password), role: "OWNER", monthlyAmount: 0 } });
    console.log("Owner created successfully");
}
main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma_1.prisma.$disconnect());
//# sourceMappingURL=create-owner.js.map