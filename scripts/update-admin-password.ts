import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function updateAdminPassword() {
  const email = 'admin@nukhbat-naql.sa';
  const newPassword = 'Secure@1234';
  
  try {
    // Hash the new password
    const hashedPassword = await hash(newPassword, 10);
    
    // Update the user's password
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    console.log('✅ Password updated successfully!');
    console.log('User:', JSON.stringify(updatedUser, null, 2));
    console.log('New password:', newPassword);
    
  } catch (error) {
    console.error('❌ Error updating password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminPassword();
