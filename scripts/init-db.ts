// scripts/init-db.ts

// ...existing code...
// Correction: Add the .ts extension to the relative import.
import { dummyUsers } from './data.ts'; 
import { PrismaClient } from '@prisma/client';
// ...existing code...

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  await prisma.user.deleteMany();
  console.log("Existing users deleted.");

  for (const userData of dummyUsers) {
    const user = await prisma.user.create({ data: userData });
    console.log(`Created user: ${user.username}`);
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });