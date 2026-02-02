import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUser() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'admin@nukhbat-naql.sa' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
        permissions: true,
        phone: true,
        emailVerified: true
      }
    });

    console.log('User details:');
    console.log(JSON.stringify(user, null, 2));
    
    if (!user) {
      console.log('User not found');
      return;
    }

    console.log('\nPassword length:', user.password?.length);
    console.log('Is password hashed?', user.password?.startsWith('$2b$'));
    
  } catch (error) {
    console.error('Error checking user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();
