const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('\n=== USERS ===');
  const users = await prisma.user.findMany();
  console.log(JSON.stringify(users, null, 2));
  
  console.log('\n=== ALERTS ===');
  const alerts = await prisma.alert.findMany();
  console.log(JSON.stringify(alerts, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
