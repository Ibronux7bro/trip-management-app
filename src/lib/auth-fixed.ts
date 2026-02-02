import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions, DefaultSession, User as DefaultUser, RequestInternal } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// User type that extends NextAuth's default user type
interface User extends DefaultUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: 'admin' | 'client' | 'driver' | 'operator';
  permissions: string[];
  phone?: string | null;
}

// App user type
type AppUser = {
  id: string;
  email: string | null;
  name: string | null;
  role: 'admin' | 'client' | 'driver' | 'operator';
  image?: string | null;
  phone?: string | null;
  password?: string | null;
  permissions: string[] | string;
  emailVerified?: Date | null;
};

declare module 'next-auth' {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: 'admin' | 'client' | 'driver' | 'operator';
    permissions: string[];
    phone?: string | null;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: 'admin' | 'client' | 'driver' | 'operator';
      permissions: string[];
      phone?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'admin' | 'client' | 'driver' | 'operator';
    permissions: string[];
    phone?: string | null;
    avatar?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing email or password');
          return null;
        }

        const { email, password } = credentials as { email: string; password: string };
        const prisma = new PrismaClient();

        // Type assertion for the user object we'll return
        type AuthUser = {
          id: string;
          email: string | undefined;
          name: string | undefined;
          role: 'admin' | 'client' | 'driver' | 'operator';
          image: string | null;
          phone: string | undefined;
          permissions: string[];
        };

        try {
          console.log('🔑 Login attempt for email:', email);

          // Find user by email (case-insensitive)
          const dbUser = await prisma.user.findFirst({
            where: {
              email: email.toLowerCase()
            },
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              image: true,
              phone: true,
              password: true,
              permissions: true,
              emailVerified: true
            }
          });

          if (!dbUser) {
            console.log('❌ User not found:', email);
            return null;
          }

          console.log('✅ User found:', dbUser.email);

          // Check if user has a password
          if (!dbUser.password) {
            console.log('❌ No password set for user');
            return null;
          }

          // Log password details for debugging
          console.log('🔒 Password details:', {
            hasPassword: !!dbUser.password,
            passwordLength: dbUser.password.length,
            isBcryptHash: dbUser.password.startsWith('$2a$') ||
              dbUser.password.startsWith('$2b$') ||
              dbUser.password.startsWith('$2y$')
          });

          // Compare passwords using bcrypt
          const isPasswordValid = await bcrypt.compare(password, dbUser.password);

          if (!isPasswordValid) {
            console.log('❌ Incorrect password');
            return null;
          }

          console.log('✅ Password is valid');

          // Parse permissions
          let userPermissions: string[] = [];
          try {
            userPermissions = typeof dbUser.permissions === 'string'
              ? JSON.parse(dbUser.permissions)
              : Array.isArray(dbUser.permissions)
                ? dbUser.permissions
                : [];
            console.log('🔑 User permissions:', userPermissions);
          } catch (e) {
            console.error('❌ Error parsing permissions:', e);
            userPermissions = [];
          }

          // Create user object with proper null handling and type assertion
          const user: AuthUser = {
            id: dbUser.id,
            email: dbUser.email || undefined,
            name: dbUser.name || undefined,
            role: dbUser.role as 'admin' | 'client' | 'driver' | 'operator',
            image: dbUser.image || null,
            phone: dbUser.phone || undefined,
            permissions: userPermissions
          } as const;

          console.log('👤 Authentication successful for user:', {
            id: user.id,
            email: user.email,
            role: user.role,
            permissions: user.permissions
          });

          return user;

        } catch (error) {
          console.error('❌ Authentication error:', error);
          return null;
        } finally {
          await prisma.$disconnect();
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Update token with user data if available
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.permissions = user.permissions || [];
        if (user.phone) token.phone = user.phone;
        if (user.image) token.avatar = user.image;
      }

      // Log token in development (sensitive data removed)
      if (process.env.NODE_ENV === 'development') {
        const { iat, exp, jti, ...safeToken } = token;
        console.log('🔄 JWT callback:', safeToken);
      }

      return token;
    },
    async session({ session, token }) {
      // Update session with token data
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'admin' | 'client' | 'driver' | 'operator';
        session.user.permissions = token.permissions as string[];
        if (token.phone) session.user.phone = token.phone as string;
        if (token.avatar) session.user.image = token.avatar as string;
      }

      console.log('🔑 Session callback:', {
        userId: session.user?.id,
        email: session.user?.email,
        role: session.user?.role,
        permissions: session.user?.permissions
      });

      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      try {
        if (new URL(url).origin === baseUrl) return url;
      } catch (e) {
        // Invalid URL, return base URL
      }
      return baseUrl;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key',
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  events: {
    async signIn(message) {
      console.log('🔑 User signed in:', message.user?.email);
    },
    async signOut() {
      console.log('👋 User signed out');
    }
  }
};

export default authOptions;
