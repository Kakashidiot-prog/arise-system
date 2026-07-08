const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: { quests: true },
    orderBy: { id: 'asc' }
  });
  
  users.forEach(u => {
    console.log(`User ID: ${u.id}, Username: ${u.username}, Quests: ${u.quests.length}`);
  });
}

main().finally(() => prisma.$disconnect());
