// Script to seed the database with sample data
const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create sample users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      permissions: JSON.stringify(['read:profile', 'update:profile', 'delete:profile', 'create:users', 'read:users', 'update:users', 'delete:users', 'create:orders', 'read:orders', 'update:orders', 'delete:orders', 'manage:system']),
      password: 'admin123'
    },
  });

  const driver = await prisma.user.upsert({
    where: { email: 'driver@example.com' },
    update: {},
    create: {
      email: 'driver@example.com',
      name: 'Driver User',
      role: 'driver',
      permissions: JSON.stringify(['read:profile', 'update:profile', 'read:own:orders', 'update:own:orders']),
      password: 'driver123'
    },
  });

  const client = await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: {},
    create: {
      email: 'client@example.com',
      name: 'Client User',
      role: 'client',
      permissions: JSON.stringify(['read:profile', 'update:profile', 'create:orders', 'read:own:orders', 'update:own:orders']),
      password: 'client123'
    },
  });

  console.log('Users created:', { admin, driver, client });

  // Create sample orders
  const order1 = await prisma.order.create({
    data: {
      userId: client.id,
      carType: 'سيدان',
      carModel: 'تويوتا كامري 2020',
      plateNumber: 'أ ب ج 1234',
      fromCity: 'الرياض',
      toCity: 'جدة',
      paymentMethod: 'نقدي',
      price: 1500.00,
      status: 'pending',
    },
  });

  const order2 = await prisma.order.create({
    data: {
      userId: client.id,
      carType: 'دفع رباعي',
      carModel: 'لاند كروزر 2021',
      plateNumber: 'د هـ و 5678',
      fromCity: 'جدة',
      toCity: 'الدمام',
      paymentMethod: 'بطاقة ائتمان',
      price: 2000.00,
      status: 'completed',
    },
  });

  const order3 = await prisma.order.create({
    data: {
      userId: admin.id,
      carType: 'شاحنة',
      carModel: 'هينو 2019',
      plateNumber: 'ز ح ط 9012',
      fromCity: 'الدمام',
      toCity: 'الرياض',
      paymentMethod: 'تحويل بنكي',
      price: 3500.00,
      status: 'in_progress',
    },
  });

  console.log('Orders created:', { order1, order2, order3 });

  // Create sample vehicles
  const vehicle1 = await prisma.vehicle.create({
    data: {
      plateNumber: 'أ ب ج 1234',
      type: 'سيدان',
      model: 'تويوتا كامري 2020',
      year: 2020,
      status: 'available',
    },
  });

  const vehicle2 = await prisma.vehicle.create({
    data: {
      plateNumber: 'د هـ و 5678',
      type: 'دفع رباعي',
      model: 'لاند كروزر 2021',
      year: 2021,
      status: 'available',
    },
  });

  const vehicle3 = await prisma.vehicle.create({
    data: {
      plateNumber: 'ز ح ط 9012',
      type: 'شاحنة',
      model: 'هينو 2019',
      year: 2019,
      status: 'maintenance',
    },
  });

  console.log('Vehicles created:', { vehicle1, vehicle2, vehicle3 });
  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
