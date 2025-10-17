'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Enhanced auth configuration with better type safety
type User = {
  id: string;
  role: string;
  permissions: string[];
  [key: string]: any;
};

type Token = {
  id?: string;
  role?: string;
  permissions?: string[];
  [key: string]: any;
};

type Session = {
  user?: User;
  [key: string]: any;
};

export const authConfig = {
  // Session configuration
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  // Enable debug logs in development
  debug: process.env.NODE_ENV === 'development',
  // Callbacks for JWT and Session
  callbacks: {
    async jwt({ token, user, account }: { token: Token; user?: User; account?: any }) {
      try {
        // Initial sign in
        if (user) {
          token.id = user.id;
          token.role = user.role || 'user';
          token.permissions = user.permissions || [];
        }
        return token;
      } catch (error) {
        console.error('JWT callback error:', error);
        return token;
      }
    },
    async session({ session, token }: { session: Session; token: Token }) {
      try {
        if (session?.user) {
          session.user.id = token.id || '';
          session.user.role = token.role || 'user';
          session.user.permissions = token.permissions || [];
        }
        return session;
      } catch (error) {
        console.error('Session callback error:', error);
        return session;
      }
    },
  },
  // Pages configuration
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  // Enable automatic token rotation
  useSecureCookies: process.env.NODE_ENV === 'production',
  // Ensure cookies are only accessible via HTTP (not JavaScript)
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
};

interface AuthProviderProps {
  children: ReactNode;
  session?: any;
}

export function AuthProvider({ children, session }: AuthProviderProps) {
  const router = useRouter();

  // Handle session errors
  useEffect(() => {
    const handleError = (event: any) => {
      if (event?.detail?.error === 'SessionError') {
        // Handle session errors (e.g., token expired)
        console.error('Session error:', event.detail);
        // Redirect to sign-in page on session error
        router.push('/auth/signin');
      }
    };

    // Listen for session errors
    window.addEventListener('next-auth:error', handleError);
    return () => window.removeEventListener('next-auth:error', handleError);
  }, [router]);

  // Handle session errors in a separate effect
  useEffect(() => {
    const handleError = (error: Error) => {
      console.error('Session error:', error);
      // You can add additional error handling here if needed
    };

    // Set up error handling
    const errorHandler = (event: Event) => {
      if (event.type === 'error') {
        handleError(event as unknown as Error);
      }
    };

    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  return (
    <SessionProvider
      session={session}
      // Session will be automatically handled by NextAuth
      refetchInterval={5 * 60} // Refetch session every 5 minutes
      refetchOnWindowFocus={true}
      // Revalidate session when the tab regains focus
      refetchWhenOffline={false} // Don't refetch session when offline
    >
      {children}
    </SessionProvider>
  );
}
