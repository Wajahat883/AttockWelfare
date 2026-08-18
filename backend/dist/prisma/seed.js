"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../lib/prisma");
const password_1 = require("../utils/password");
async function main() {
    console.log("🌱 Seeding database with demo data...");
    try {
        // Clear existing data (be careful in production!)
        await prisma_1.prisma.payment.deleteMany({});
        await prisma_1.prisma.user.deleteMany({});
        console.log("✅ Cleared existing data");
        // Create Owner
        const owner = await prisma_1.prisma.user.create({
            data: {
                name: "Muhammad Ali",
                fatherName: "Ali Khan",
                address: "House 123, Main Road, Attock",
                phone: "03001111111",
                passwordHash: await (0, password_1.hashPassword)("password123"),
                role: "OWNER",
                monthlyAmount: 1000,
                isActive: true,
            },
        });
        console.log(`✅ Created Owner: ${owner.name} (${owner.phone})`);
        // Create Admin 1
        const admin1 = await prisma_1.prisma.user.create({
            data: {
                name: "Hassan Ahmed",
                fatherName: "Ahmed Khan",
                address: "House 456, Commercial Area, Attock",
                phone: "03002222222",
                passwordHash: await (0, password_1.hashPassword)("password123"),
                role: "ADMIN",
                monthlyAmount: 1000,
                isActive: true,
            },
        });
        console.log(`✅ Created Admin: ${admin1.name} (${admin1.phone})`);
        // Create Admin 2
        const admin2 = await prisma_1.prisma.user.create({
            data: {
                name: "Fatima Khan",
                fatherName: "Khan Sahab",
                address: "House 789, New Town, Attock",
                phone: "03003333333",
                passwordHash: await (0, password_1.hashPassword)("password123"),
                role: "ADMIN",
                monthlyAmount: 1000,
                isActive: true,
            },
        });
        console.log(`✅ Created Admin: ${admin2.name} (${admin2.phone})`);
        // Create regular Users (Members)
        const users = [
            {
                name: "Usman Ali",
                fatherName: "Ali Raza",
                address: "House 111, Street 5, Attock",
                phone: "03004444444",
                monthlyAmount: 500,
            },
            {
                name: "Bilal Khan",
                fatherName: "Khan Bahadur",
                address: "House 222, Street 10, Attock",
                phone: "03005555555",
                monthlyAmount: 500,
            },
            {
                name: "Ayesha Malik",
                fatherName: "Malik Sahab",
                address: "House 333, Satellite Town, Attock",
                phone: "03006666666",
                monthlyAmount: 500,
            },
            {
                name: "Arslan Saeed",
                fatherName: "Saeed Khan",
                address: "House 444, Defense Road, Attock",
                phone: "03007777777",
                monthlyAmount: 500,
            },
            {
                name: "Nida Hassan",
                fatherName: "Hassan Ali",
                address: "Apartment 5, Plaza Building, Attock",
                phone: "03008888888",
                monthlyAmount: 500,
            },
        ];
        for (const userData of users) {
            await prisma_1.prisma.user.create({
                data: {
                    ...userData,
                    passwordHash: await (0, password_1.hashPassword)("password123"),
                    role: "USER",
                    isActive: true,
                },
            });
            console.log(`✅ Created User: ${userData.name} (${userData.phone})`);
        }
        // Create sample payments for current and previous months
        const currentDate = new Date();
        const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;
        const previousMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth()).padStart(2, "0")}`;
        const allUsers = await prisma_1.prisma.user.findMany({ where: { role: "USER" } });
        for (let i = 0; i < allUsers.length; i++) {
            const user = allUsers[i];
            // Some paid previous month
            if (i % 2 === 0) {
                await prisma_1.prisma.payment.create({
                    data: {
                        userId: user.id,
                        month: previousMonth,
                        year: currentDate.getFullYear(),
                        amount: user.monthlyAmount,
                        status: "PAID",
                        paidDate: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 10),
                        addedBy: admin1.id,
                    },
                });
            }
            // Some paid current month
            if (i < 3) {
                await prisma_1.prisma.payment.create({
                    data: {
                        userId: user.id,
                        month: currentMonth,
                        year: currentDate.getFullYear(),
                        amount: user.monthlyAmount,
                        status: "PAID",
                        paidDate: new Date(),
                        addedBy: admin1.id,
                    },
                });
            }
        }
        console.log(`✅ Created sample payments for current and previous months`);
        console.log("\n🎉 Database seeded successfully!");
        console.log("\n📋 Demo Credentials:");
        console.log("  Owner:    03001111111 / password123");
        console.log("  Admin:    03002222222 / password123");
        console.log("  User:     03004444444 / password123");
    }
    catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
    finally {
        await prisma_1.prisma.$disconnect();
    }
}
main();
//# sourceMappingURL=seed.js.map