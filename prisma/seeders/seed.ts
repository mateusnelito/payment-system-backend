import { prisma } from '../../src/lib/prisma.lib';

async function seed() {
  // Generate default user types
  await prisma.userType.createMany({
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
