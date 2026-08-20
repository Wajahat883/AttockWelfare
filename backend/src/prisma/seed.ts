import { prisma } from "../lib/prisma";
import { hashPassword } from "../utils/password";

async function main() {
  if (process.env.ALLOW_DEMO_SEED !== "true") {
    console.log("Demo seed disabled. Set ALLOW_DEMO_SEED=true only for a disposable development database.");
    return;
  }
  console.log("🌱 Seeding database with demo data...");

  try {
    // Clear existing data (be careful in production!)
    await prisma.payment.deleteMany({});
    await prisma.user.deleteMany({});
    console.log("✅ Cleared existing data");

    // Create Owner
    const owner = await prisma.user.create({
      data: {
        name: "Muhammad Ali",
        fatherName: "Ali Khan",
        address: "House 123, Main Road, Attock",
        phone: "03001111111",
        email: "waji2156@gmail.com",
        passwordHash: await hashPassword("Waji2156@"),
        role: "OWNER",
        monthlyAmount: 1000,
        isActive: true,
      },
    });
    console.log(`✅ Created Owner: ${owner.name} (${owner.phone})`);

    const paymentActorId = owner.id;

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
      await prisma.user.create({
        data: {
          ...userData,
          email: `${userData.phone}@attockwelfare.local`,
          passwordHash: await hashPassword("password123"),
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

    const allUsers = await prisma.user.findMany({ where: { role: "USER" } });

    for (let i = 0; i < allUsers.length; i++) {
      const user = allUsers[i];
      
      // Some paid previous month
      if (i % 2 === 0) {
        await prisma.payment.create({
          data: {
            userId: user.id,
            month: previousMonth,
            year: currentDate.getFullYear(),
            amount: user.monthlyAmount,
            status: "PAID",
            paidDate: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 10),
             addedBy: paymentActorId,
          },
        });
      }

      // Some paid current month
      if (i < 3) {
        await prisma.payment.create({
          data: {
            userId: user.id,
            month: currentMonth,
            year: currentDate.getFullYear(),
            amount: user.monthlyAmount,
            status: "PAID",
            paidDate: new Date(),
             addedBy: paymentActorId,
          },
        });
      }
    }

    console.log(`✅ Created sample payments for current and previous months`);
    console.log("\n🎉 Database seeded successfully!");
    console.log("\n📋 Demo Credentials:");
    console.log("  Owner:    waji2156@gmail.com / Waji2156@");
    console.log("  User:     03004444444 / password123");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
