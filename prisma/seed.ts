import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const DUMMY_MESSAGES_COUNT = 100;

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding ...');

  console.log('✉️ Seeding messages ...');
  for (let i = 1; i < DUMMY_MESSAGES_COUNT; i++) {
    await prisma.message.upsert({
      where: { id: i },
      update: {},
      create: {
        content: faker.lorem.sentence(),
        username: faker.internet.userName(),
        createdAt: faker.date.recent(),
      },
    });
  }
  console.log('✅ Messages seeded!');

  console.log('🌳 Seeding finished!');
}

main()
  .catch((e) => {
    console.error(e);

    process.exit(1);
  })

  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
