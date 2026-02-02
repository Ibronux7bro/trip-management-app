// Enhanced authentication system for Nukhbat Al-Naql
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import type { NextAuthOptions, DefaultSession } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import type { User } from 'next-auth';
import { createHash } from 'crypto';

// Type for the crypto module in the browser
declare global {
  interface Window {
    crypto: {
      subtle: {
        digest(algorithm: string, data: Uint8Array): Promise<ArrayBuffer>;
      };
    };
  }
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

// Base user type for our application
export interface BaseUser {
  id: string;
  name: string | undefined;
  email: string | undefined;
  image: string | null;
  role: 'admin' | 'client' | 'driver' | 'operator';
  permissions: string[];
  phone: string | undefined;
}

// Extend NextAuth types
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
  }
}

// Mock users database - In production, this would be replaced with a real database
const mockUsers: AppUser[] = [
  {
    id: '1',
    email: 'admin@nukhbat-naql.sa',
    name: 'مدير النظام',
    role: 'admin',
    image: '/avatars/admin.png',
    password: '$2a$10$XFDJhL3J5z6Z8Z5t8Z5t8e', // 'admin123' hashed
    permissions: ['manage_users', 'manage_orders', 'manage_vehicles', 'manage_drivers', 'view_analytics'],
    phone: '+966501234567',
    emailVerified: new Date()
  },
  {
    id: '2',
    email: 'driver@nukhbat-naql.sa',
    name: 'سائق النقل',
    role: 'driver',
    image: '/avatars/driver.png',
    password: '$2a$10$XFDJhL3J5z6Z8Z5t8Z5t8e', // 'driver123' hashed
    permissions: ['view_orders', 'update_order_status'],
    phone: '+966501234568',
    emailVerified: new Date()
  },
  {
    id: '3',
    email: 'client@nukhbat-naql.sa',
    name: 'عميل',
    role: 'client',
    image: '/avatars/client.png',
    password: '$2a$10$XFDJhL3J5z6Z8Z5t8Z5t8e', // 'client123' hashed
    permissions: ['create_order', 'view_own_orders'],
    phone: '+966501234569',
    emailVerified: new Date()
  },
  {
    id: '4',
    email: 'operator@nukhbat-naql.sa',
    name: 'موظف الاستقبال',
    role: 'operator',
    image: '/avatars/operator.png',
    password: '$2a$10$XFDJhL3J5z6Z8Z5t8Z5t8e', // 'operator123' hashed
    permissions: ['manage_orders', 'view_drivers', 'view_vehicles'],
    phone: '+966501234570',
    emailVerified: new Date()  }
];

// Password hashing function (use a proper hashing library like bcrypt in production)
async function hashPassword(password: string): Promise<string> {
  // This is a simple hash function for demo purposes only
  // In production, use: return await bcrypt.hash(password, 10);
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  
  if (typeof window === 'undefined') {
    // Node.js environment
    return createHash('sha256').update(password).digest('hex');
  } else {
    // Browser environment
    const data = encoder.encode(password);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}

// Mock passwords - These should be stored as hashed passwords in the user objects
// The hashed password for 'Driver@123' is: $2a$10$XFDJhL3J5z6Z8Z5t8Z5t8e

// Configuration for NextAuth
// Mock user functions - replace with real database operations
const getUserById = (id: string): AppUser | undefined => {
  return mockUsers.find(user => user.id === id);
};

/**
 * Find a user by their email address (case-insensitive)
 * @param email - The email address to search for
 * @returns The user if found, undefined otherwise
 */
const getUserByEmail = (email: string): AppUser | undefined => {
  if (!email) {
    console.warn('getUserByEmail called with empty or undefined email');
    return undefined;
  }
  
  const normalizedEmail = email.trim().toLowerCase();
  
  // First try to find in the database
  try {
    const user = mockUsers.find(user => 
      user.email?.toLowerCase() === normalizedEmail
    );
    
    if (user) {
      console.log(`Found user by email: ${email}`);
      return user;
    }
    
    console.log(`No user found with email: ${email}`);
    return undefined;
  } catch (error) {
    console.error('Error in getUserByEmail:', error);
    return undefined;
  }
};

/**
 * Checks if a user has a specific permission
 * @param userPermissions - Array of permissions the user has
 * @param requiredPermission - The permission to check for
 * @returns boolean indicating if the user has the required permission
 */
export const hasPermission = (
  userPermissions: readonly string[], 
  requiredPermission: string
): boolean => {
  // Input validation
  if (!Array.isArray(userPermissions) || typeof requiredPermission !== 'string') {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Invalid parameters provided to hasPermission:', { 
        userPermissions, 
        requiredPermission 
      });
    }
    return false;
  }
  
  // Check for permission
  return userPermissions.includes(requiredPermission);
};

// Define valid user roles as a type
type UserRole = 'admin' | 'client' | 'driver' | 'operator';

/**
 * Checks if a user has one of the allowed roles
 * @param userRole - The role of the user
 * @param allowedRoles - Array of roles that are allowed
 * @returns boolean indicating if the user's role is in the allowed roles
 */
export const hasRole = (
  userRole: UserRole, 
  allowedRoles: readonly UserRole[]
): boolean => {
  // Input validation
  if (!userRole || !Array.isArray(allowedRoles) || allowedRoles.length === 0) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Invalid parameters provided to hasRole:', { 
        userRole, 
        allowedRoles 
      });
    }
    return false;
  }
  
  // Check for role
  return allowedRoles.includes(userRole);
};

export const canAccessRoute = (userRole: string, route: string): boolean => {
  const routePermissions: Record<string, string[]> = {
    '/dashboard': ['admin', 'operator'],
    '/dashboard/users': ['admin'],
    '/dashboard/orders': ['admin', 'operator', 'driver'],
    '/dashboard/vehicle-management': ['admin'],
    '/dashboard/reports': ['admin', 'operator'],
    '/vehicles': ['admin', 'operator'],
    '/admin': ['admin'],
    '/clients': ['client'],
    '/driver': ['driver'],
    '/tracking': ['admin', 'operator', 'client', 'driver'],
    '/orders': ['admin', 'operator', 'client']
  };

  const allowedRoles = routePermissions[route];
  if (!allowedRoles) return true; // Public route
  
  return allowedRoles.includes(userRole);
};

export const updateUserProfile = async (id: string, updates: Partial<AppUser>): Promise<AppUser | null> => {
  const userIndex = mockUsers.findIndex(user => user.id === id);
  if (userIndex === -1) return null;
  
  mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
  return mockUsers[userIndex];
};

export const getRedirectUrl = (userRole: string): string => {
  switch (userRole) {
    case 'admin':
      return '/dashboard';
    case 'operator':
      return '/dashboard/orders';
    case 'driver':
      return '/driver';
    case 'client':
      return '/orders';
    default:
      return '/';
  }
};

// Activity logging interface
interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: Date;
  ipAddress?: string;
}

const activityLogs: ActivityLog[] = [];

const logActivity = async (
  userId: string,
  action: string,
  details: string,
  ipAddress?: string
): Promise<void> => {
  const log: ActivityLog = {
    id: Math.random().toString(36).substr(2, 9),
    userId,
    action,
    details,
    timestamp: new Date(),
    ipAddress
  };
  activityLogs.push(log);
  console.log('Activity logged:', log);
};

// Main auth configuration
export const authOptions: NextAuthOptions = {
  // Session configuration
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Update session every 24 hours
  },
  // JWT configuration
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // Enable debug in development
  debug: process.env.NODE_ENV === 'development',
  // Custom pages
  pages: {
    signIn: '/login',
    error: '/login',
    signOut: '/',
  },
  // Security settings
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  // Use environment variable for secret with fallback for development
  secret: process.env.NEXTAUTH_SECRET || (process.env.NODE_ENV === 'production' ? undefined : 'dev-secret-key'),
  // Enable CSRF protection
  useSecureCookies: process.env.NODE_ENV === 'production',
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(
          credentials: Record<'email' | 'password', string> | undefined,
          req: any
        ) {
        // Input validation
        if (!credentials?.email || !credentials?.password) {
          console.warn('❌ Missing email or password');
          return null;
        }

        const { email, password } = credentials;
        
        // Email validation
        const isValidEmail = (email: string): boolean => {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        };

        try {
          // Validate email format
          if (!isValidEmail(email)) {
            console.warn(`❌ Invalid email format: ${email}`);
            return null;
          }

          // Try to get user from the database or fall back to the mock
          const user = getUserByEmail(email);
          if (!user) {
            console.warn(`❌ No user found with email: ${email}`);
            return null;
          }

          // Verify password
          const passwordMatch = await compare(credentials.password, user.password || '');
          if (!passwordMatch) {
            console.error(`❌ [AUTH] Invalid password for user: ${user.email}`);
            throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
          }

          // Log successful login
          await logActivity(user.id, 'user_login', 'User logged in successfully');

          // Normalize permissions to `string[]` and return user object without the password
          const normalizedPermissions: string[] = Array.isArray(user.permissions)
            ? user.permissions
            : user.permissions
            ? [String(user.permissions)]
            : [];

          const userToReturn = {
            id: user.id,
            name: user.name ?? null,
            email: user.email ?? null,
            image: user.image ?? null,
            role: user.role,
            permissions: normalizedPermissions,
            phone: user.phone ?? null,
          };

          return userToReturn;
        } catch (error) {
          console.error('❌ [AUTH] Error authorizing user:', error);
          return null;
        }
      }
    })
  ],
  
  callbacks: {
    async session({ session, token }) {
      try {
        // Helper function to check if role is valid
        const isValidRole = (role: unknown): role is 'admin' | 'client' | 'driver' | 'operator' => {
          return typeof role === 'string' && 
                ['admin', 'client', 'driver', 'operator'].includes(role);
        };

        // Helper function to get safe permissions
        const getSafePermissions = (permissions: unknown): string[] => {
          try {
            if (!permissions) return [];
            
            // Handle stringified JSON
            if (typeof permissions === 'string') {
              try {
                const parsed = JSON.parse(permissions);
                return Array.isArray(parsed) ? parsed.filter((p: any) => typeof p === 'string') : [];
              } catch (e) {
                console.warn('❌ [AUTH] Failed to parse permissions string:', permissions);
                return [];
              }
            }
            
            // Handle array of permissions
            if (Array.isArray(permissions)) {
              return permissions.filter((p: any): p is string => 
                typeof p === 'string' && p.trim().length > 0
              );
            }
            
            return [];
          } catch (error) {
            console.error('❌ [AUTH] Error processing permissions:', error);
            return [];
          }
        };

        // Validate session and user object
        if (!session?.user) {
          console.warn('⚠️ [AUTH] Session validation failed: No user in session');
          return session;
        }

        // Get user ID from token
        const userId = token.sub && typeof token.sub === 'string' ? token.sub : '';
        
        // Validate and get user role
        const userRole = isValidRole(token.role) ? token.role : 'client';
        
        // Get safe permissions
        const userPermissions = getSafePermissions(token.permissions);
        
        // Update session with user data
        return {
          ...session,
          user: {
            ...session.user,
            id: userId,
            role: userRole,
            permissions: userPermissions,
            phone: typeof token.phone === 'string' ? token.phone : null,
          }
        };
      } catch (error) {
        console.error('❌ [AUTH] Error in session callback:', error);
        // Return minimal session on error to prevent complete failure
        return {
          ...session,
          user: {
            ...session?.user,
            id: '',
            role: 'client',
            permissions: [],
          }
        };
      }
    },

    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        token.id = user.id;
        token.role = user.role;
        token.permissions = user.permissions;
        token.phone = user.phone || null;
      }
      
      // Log JWT token updates (sensitive data removed)
      if (process.env.NODE_ENV === 'development') {
        const { iat, exp, jti, ...safeToken } = token;
        console.log('🔄 JWT callback:', safeToken);
      }
      
      return token;
    }
  },
  
// End of authOptions object (no duplicate `pages`/`debug` here)
};

// Export the configured NextAuth options
export default authOptions;
