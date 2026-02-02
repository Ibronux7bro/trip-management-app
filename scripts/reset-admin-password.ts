import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function resetAdminPassword() {
  const email = 'admin@nukhbat-naql.sa';
  const newPassword = 'Admin@1234'; // Simple password for testing
  
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

    console.log('✅ Password reset successfully!');
    console.log('User:', JSON.stringify(updatedUser, null, 2));
    console.log('New password:', newPassword);
    console.log('Hashed password:', hashedPassword);
    
  } catch (error) {
    console.error('❌ Error resetting password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPassword();
