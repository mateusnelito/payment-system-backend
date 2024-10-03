import { prisma } from '../../src/lib/prisma.lib';

async function seed() {
  // Generate default account types
  await prisma.accountType.createMany({
    data: [{ name: 'SHOPKEEPER' }, { name: 'COMMON' }],
  });
}

seed()
  .then(() => console.log('🌱 Database seeded successfully'))
  .catch((err) => {
    console.error(`🛑 Error seeding database: \n ${err}`);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
