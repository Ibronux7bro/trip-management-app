import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthConfig } from 'next-auth';
import { prisma } from './db';
import type { BaseUser } from './auth';

export type UserRole = 'admin' | 'client' | 'driver' | 'operator';

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
    permissions: string[];
  }
}

// Default user role and permissions
const DEFAULT_ROLE = 'user';
const DEFAULT_PERMISSIONS: string[] = ['read:profile', 'update:profile'];

// Role-based permissions
const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: [
    'read:profile', 'update:profile', 'delete:profile',
    'create:users', 'read:users', 'update:users', 'delete:users',
    'create:orders', 'read:orders', 'update:orders', 'delete:orders',
    'manage:system'
  ],
  operator: [
    'read:profile', 'update:profile',
    'create:orders', 'read:orders', 'update:orders',
    'read:users'
  ],
  driver: [
    'read:profile', 'update:profile',
    'read:own:orders', 'update:own:orders'
  ],
  client: [
    'read:profile', 'update:profile',
    'create:orders', 'read:own:orders', 'update:own:orders'
  ]
};

// Get permissions for a role
function getPermissionsForRole(role: string): string[] {
  return ROLE_PERMISSIONS[role.toLowerCase()] || DEFAULT_PERMISSIONS;
}

// Mock users - In production, replace with database calls
interface MockUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  password: string;
  permissions: string[];
  image?: string | null;
  phone?: string;
  avatar?: string;
}

const mockUsers: MockUser[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    password: 'admin123',
    permissions: getPermissionsForRole('admin'),
    image: null
  },
  {
    id: '2',
    email: 'driver@example.com',
    name: 'Driver User',
    role: 'driver',
    password: 'driver123',
    permissions: getPermissionsForRole('driver'),
    image: null
  },
  {
    id: '3',
    email: 'client@example.com',
    name: 'Client User',
    role: 'client',
    password: 'client123',
    permissions: getPermissionsForRole('client'),
    image: null
  }
];

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log('Missing credentials');
            return null;
          }

          // In production, fetch user from database
          const user = mockUsers.find(u => u.email === credentials.email);
          
          if (!user) {
            console.log('User not found:', credentials.email);
            return null;
          }
          
          // In production, verify hashed password
          const isValidPassword = user.password === credentials.password;
          
          if (!isValidPassword) {
            console.log('Invalid password for user:', user.email);
            return null;
          }

          console.log('User authenticated successfully:', user.email);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
            permissions: user.permissions
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role as UserRole;
        token.permissions = user.permissions;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.permissions = token.permissions as string[];
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key',
  debug: process.env.NODE_ENV === 'development'
};

export default authConfig;