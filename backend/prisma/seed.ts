import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // Create default admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fireguard.com' },
    update: {},
    create: {
      email: 'admin@fireguard.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  console.log('✅ Created admin user:');
  console.log('   Email: admin@fireguard.com');
  console.log('   Password: admin123');
  console.log('   Role: ADMIN\n');

  // Create sample alerts for demo
  const sampleAlerts = [
    {
      deviceId: 'device-001',
      temperature: 25.5,
      smokeLevel: 2.1,
      status: 'SAFE',
      location: 'Building A, Floor 1',
      notes: 'Normal operating conditions',
    },
    {
      deviceId: 'device-002',
      temperature: 45.0,
      smokeLevel: 8.5,
      status: 'WARNING',
      location: 'Building A, Floor 2',
      notes: 'Elevated temperature detected',
    },
    {
      deviceId: 'device-003',
      temperature: 85.0,
      smokeLevel: 25.0,
      status: 'ALERT',
      location: 'Building B, Floor 3',
      notes: 'Fire detected! Immediate action required',
    },
  ];

  for (const alert of sampleAlerts) {
    await prisma.alert.create({
      data: {
        ...alert,
        userId: admin.id,
      },
    });
  }

  console.log('✅ Created 3 sample alerts\n');

  console.log('🎉 Seeding completed!\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
