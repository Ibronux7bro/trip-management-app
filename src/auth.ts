import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth-config';

// Export the auth handler for API routes
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
