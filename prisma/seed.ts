import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // إنشاء المستخدمين
  const users = [
    {
      email: 'admin@nukhbat-naql.sa',
      name: 'مدير النظام',
      role: 'admin',
      password: 'Admin@123',
      phone: '+966501234567',
      permissions: JSON.stringify([
        'manage_users',
        'manage_orders',
        'manage_vehicles',
        'manage_drivers',
        'view_analytics',
        'manage_settings',
        'send_notifications'
      ])
    },
    {
      email: 'driver@nukhbat-naql.sa',
      name: 'محمد عبدالله السعد',
      role: 'driver',
      password: 'Driver@123',
      phone: '+966501234568',
      permissions: JSON.stringify([
        'view_assigned_orders',
        'update_order_status',
        'update_location',
        'view_vehicle_info',
        'view_history',
        'contact_support'
      ])
    },
    {
      email: 'client@nukhbat-naql.sa',
      name: 'أحمد محمد العلي',
      role: 'client',
      password: 'Client@123',
      phone: '+966509876543',
      permissions: JSON.stringify([
        'create_orders',
        'track_orders',
        'view_invoices',
        'update_profile'
      ])
    },
    {
      email: 'operator@nukhbat-naql.sa',
      name: 'سارة أحمد الخالد',
      role: 'operator',
      password: 'Operator@123',
      phone: '+966507777777',
      permissions: JSON.stringify([
        'manage_orders',
        'assign_drivers',
        'track_vehicles',
        'handle_support',
        'send_notifications'
      ])
    }
  ];

  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData,
    });
    console.log(`Created/Updated user: ${user.email}`);
  }

  // إنشاء بعض المركبات التجريبية
  const vehicles = [
    {
      plateNumber: 'ABC-1234',
      vehicleType: 'truck',
      model: 'Toyota Hilux',
      year: 2023,
      capacity: 1000,
      fuelType: 'diesel',
      mileage: 15000,
      status: 'Available'
    },
    {
      plateNumber: 'XYZ-5678',
      vehicleType: 'van',
      model: 'Ford Transit',
      year: 2022,
      capacity: 800,
      fuelType: 'petrol',
      mileage: 25000,
      status: 'Available'
    }
  ];

  for (const vehicleData of vehicles) {
    const vehicle = await prisma.vehicle.upsert({
      where: { plateNumber: vehicleData.plateNumber },
      update: {},
      create: vehicleData,
    });
    console.log(`Created/Updated vehicle: ${vehicle.plateNumber}`);
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
