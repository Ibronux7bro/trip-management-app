import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// User role type
type UserRole = 'admin' | 'client' | 'driver' | 'operator';

// Hash password with bcrypt
async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Test user data
const testUsers = [
  {
    name: 'Admin User',
    email: 'admin@nukhbat-naql.sa',
    password: 'Admin@1234',
    role: 'admin' as UserRole,
    permissions: [
      'dashboard:view',
      'users:manage',
      'vehicles:manage',
      'drivers:manage',
      'trips:manage',
      'reports:view'
    ],
    phone: '+966501234567',
  },
  {
    name: 'Driver User',
    email: 'driver@nukhbat-naql.sa',
    password: 'Driver@1234',
    role: 'driver' as UserRole,
    permissions: [
      'dashboard:view',
      'trips:view',
      'trips:update',
      'profile:edit'
    ],
    phone: '+966502345678',
  },
];

async function createTestUsers() {
  console.log('🚀 Starting test users creation...');

  for (const userData of testUsers) {
    try {
      console.log(`\n🔧 Processing user: ${userData.email}`);

      // Hash the password
      const hashedPassword = await hashPassword(userData.password);

      // Create or update user
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {
          name: userData.name,
          password: hashedPassword,
          role: userData.role,
          permissions: JSON.stringify(userData.permissions),
          phone: userData.phone,
          emailVerified: new Date(),
        },
        create: {
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          role: userData.role,
          permissions: JSON.stringify(userData.permissions),
          phone: userData.phone,
          emailVerified: new Date(),
        },
      });

      console.log(`✅ Successfully created/updated user: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Permissions: ${userData.permissions.join(', ')}`);
      console.log(`   Password (for testing): ${userData.password}`);
    } catch (error) {
      console.error(`❌ Error creating user ${userData.email}:`, error);
    }
  }
}

// Execute the function
createTestUsers()
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('\n🏁 Test user creation completed');
  });
