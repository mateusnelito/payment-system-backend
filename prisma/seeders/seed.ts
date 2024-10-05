import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { prisma } from '../../src/lib/prisma.lib';

// Generates a random number between min and max
function generateRandomNumber(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

async function seed() {
  // Create default account types: 'MERCHANT' and 'COMMON'
  await prisma.accountType.createMany({
    data: [{ name: 'MERCHANT' }, { name: 'COMMON' }],
  });

  // Generate 20 user IDs using nanoid
  const usersIds = Array.from({ length: 20 }, () => nanoid());

  // Create 20 users with unique IDs, emails, and hashed passwords
  try {
    await prisma.user.createMany({
      data: await Promise.all(
        Array.from({ length: 20 }, async (_, i) => ({
          id: usersIds[i],
          fullName: `User ${i + generateRandomNumber(0, 1000)}`,
          email: Math.random().toString(36).substring(2) + '@example.com',
          bi: `000000000LA${generateRandomNumber(0, 9)}0${i}`, // Unique BI format
          passwordHash: await bcrypt.hash(`Password@1234`, 10), // Hashed password
        }))
      ),
    });
  } catch (error) {
    if (error.code === 'P2002') {
      console.error('Error: email or bi already exists.');
    }
  }

  // Create 20 accounts linked to each user
  await prisma.account.createMany({
    data: usersIds.map((userId) => ({
      id: nanoid(),
      userId,
      accountTypeId: generateRandomNumber(1, 2), // Random account type (1 or 2)
      balance: generateRandomNumber(100, 10000), // Random balance between 100 and 10,000
    })),
  });

  // Retrieve all accounts from the database
  const accounts = await prisma.account.findMany();

  // Create 100 transactions between random accounts
  const transactions = Array.from({ length: 100 })
    .map(() => {
      const fromAccount = accounts[generateRandomNumber(0, 19)];
      const toAccount = accounts[generateRandomNumber(0, 19)];
      const amount = generateRandomNumber(100, 500);

      // Prevent transactions to the same account or if balance is insufficient
      if (fromAccount.id === toAccount.id || fromAccount.balance < amount)
        return null;

      return {
        fromAccountId: fromAccount.id,
        toAccountId: toAccount.id,
        amount,
      };
    })
    .filter((transaction) => transaction !== null); // Filter out invalid transactions

  // Create the transactions in the database
  await prisma.transaction.createMany({ data: transactions });
}

seed()
  .then(() => console.log('\n🌱 Database seeded successfully\n'))
  .catch((err) => {
    console.error(`🛑 Error seeding database: \n ${err}`);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect(); // Ensure Prisma disconnects after the seed
  });
