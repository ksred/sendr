import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create default user
  const password = await hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'admin@sendr.com' },
    update: {},
    create: {
      email: 'admin@sendr.com',
      name: 'Admin User',
      password,
      balances: {
        create: [
          {
            currency: 'USD',
            amount: 10000,
          },
          {
            currency: 'EUR',
            amount: 8500,
          },
        ],
      },
    },
  });

  console.log({ user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
