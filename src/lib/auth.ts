// Enhanced authentication system for Nukhbat Al-Naql
import CredentialsProvider from 'next-auth/providers/credentials';
import type { DefaultSession, User as DefaultUser } from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
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
  email: string;
  name: string;
  role: 'admin' | 'client' | 'driver' | 'operator';
  avatar?: string;
  phone?: string;
  password?: string;
  permissions: string[];
};

// Base user type for our application
export interface BaseUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: 'admin' | 'client' | 'driver' | 'operator';
  permissions: string[];
  phone?: string;
  avatar?: string;
}

// Extend NextAuth types
declare module 'next-auth' {
  interface Session {
    user: BaseUser;
  }
  
  interface User extends BaseUser {}
}

// Mock users database - In production, this would be replaced with a real database
const mockUsers: AppUser[] = [
  {
    id: '1',
    email: 'admin@nukhbat-naql.sa',
    name: 'مدير النظام',
    role: 'admin',
    avatar: '/avatars/admin.png',
    phone: '+966501234567',
    permissions: [
      'manage_users',
      'manage_orders',
      'manage_vehicles',
      'manage_drivers',
      'view_analytics',
      'manage_settings',
      'send_notifications'
    ]
  },
  {
    id: '2',
    email: 'client@nukhbat-naql.sa',
    name: 'أحمد محمد العلي',
    role: 'client',
    avatar: '/avatars/client.png',
    phone: '+966509876543',
    permissions: [
      'create_orders',
      'track_orders',
      'view_invoices',
      'update_profile'
    ]
  },
  {
    id: '3',
    email: 'driver@nukhbat-naql.sa',
    name: 'محمد عبدالله السعد',
    role: 'driver',
    avatar: '/avatars/driver.png',
    phone: '+966501234568',
    password: '$2a$10$XFDJhL3J5z6Z8Z5t8Z5t8e', // Hashed 'Driver@123'
    permissions: [
      'view_assigned_orders',
      'update_order_status',
      'update_location',
      'view_vehicle_info',
      'view_history',
      'contact_support'
    ]
  },
  {
    id: '4',
    email: 'operator@nukhbat-naql.sa',
    name: 'سارة أحمد الخالد',
    role: 'operator',
    avatar: '/avatars/operator.png',
    phone: '+966507777777',
    permissions: [
      'manage_orders',
      'assign_drivers',
      'track_vehicles',
      'handle_support',
      'send_notifications'
    ]
  }
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

const getUserByEmail = (email: string): AppUser | undefined => {
  return mockUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
};

export const hasPermission = (userPermissions: string[], requiredPermission: string): boolean => {
  return userPermissions.includes(requiredPermission);
};

export const hasRole = (userRole: string, allowedRoles: string[]): boolean => {
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
export const authOptions: NextAuthConfig = {
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
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const { email, password } = credentials as { email: string; password: string };
        try {
          console.log('Login attempt with credentials:', email);

          // Find user by email (case-insensitive)
          const user = mockUsers.find(u => 
            u.email.toLowerCase() === email.toLowerCase()
          );
          
          if (!user) {
            console.log('User not found:', email);
            throw new Error('Invalid email or password');
          }

          console.log('User found:', user.email);
          
          // For demo purposes, we'll use a simple comparison with hashed passwords
          // In production, use a proper password hashing library like bcrypt
          let isPasswordValid = false;
          const password = typeof credentials.password === 'string' ? credentials.password : '';
          const hashedPassword = await hashPassword(password);
          
          // Check if the provided password matches the stored hashed password
          if (user.password && user.password === hashedPassword) {
            isPasswordValid = true;
          }
          
          // Fallback for demo accounts (remove in production)
          if (!isPasswordValid) {
            if (user.email.toLowerCase() === 'driver@nukhbat-naql.sa' && 
                credentials.password === 'Driver@123') {
              isPasswordValid = true;
            } 
            else if (user.email.toLowerCase() === 'admin@nukhbat-naql.sa' && 
                     credentials.password === 'Admin@123') {
              isPasswordValid = true;
            }
            else if (user.email.toLowerCase() === 'client@nukhbat-naql.sa' && 
                     credentials.password === 'Client@123') {
              isPasswordValid = true;
            }
            else if (user.email.toLowerCase() === 'operator@nukhbat-naql.sa' && 
                     credentials.password === 'Operator@123') {
              isPasswordValid = true;
            }
          }
          
          if (!isPasswordValid) {
            console.log('Invalid password for user:', user.email);
            throw new Error('Invalid email or password');
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: user.avatar,
            phone: user.phone,
            permissions: user.permissions
          };
        } catch (error) {
          console.error('Authentication error:', error);
          throw new Error('An error occurred during login');
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }: { 
      token: any; 
      user?: any; 
      account?: any;
    }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.permissions = user.permissions;
        token.phone = user.phone;
        token.avatar = user.avatar;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      // Add user data to session
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.permissions = token.permissions as string[];
        if (token.phone) session.user.phone = token.phone as string;
        if (token.avatar) session.user.avatar = token.avatar as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Redirect based on user role after login
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      try {
        if (new URL(url).origin === baseUrl) return url;
      } catch (e) {
        // Invalid URL, return base URL
      }
      return baseUrl;
    }
  }
};

// Export the configured NextAuth options
export default authOptions;
