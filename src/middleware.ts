import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Define public routes that don't require authentication
const publicPaths = [
  '/login',
  '/register',
  '/api/auth',
  '/',
  '/tracking',
  '/_next',
  '/favicon',
  '/_vercel',
  '/public',
  '/_error',
  '/unauthorized',
  '/500',
  '/404'
];

// Define role-based access control
const roleRoutes: Record<string, string[]> = {
  admin: ['/dashboard', '/admin', '/vehicles', '/orders', '/api/admin'],
  operator: ['/dashboard', '/orders', '/vehicles', '/api/operator'],
  client: ['/clients', '/orders', '/tracking', '/api/client'],
  driver: ['/driver', '/orders', '/tracking', '/api/driver']
};

// Define default redirect URLs for each role
const defaultRedirectUrls: Record<string, string> = {
  admin: '/dashboard',
  operator: '/dashboard',
  client: '/clients',
  driver: '/driver/dashboard'
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  try {
    // Get the token
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // If no token, redirect to login
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check role-based access
    const userRole = token.role as string || 'guest';
    const allowedRoutes = roleRoutes[userRole] || [];
    const hasAccess = allowedRoutes.some(route => pathname.startsWith(route));

    // If user doesn't have access, redirect to appropriate dashboard
    if (!hasAccess) {
      const redirectUrl = defaultRedirectUrls[userRole] || '/';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    // Token exists and has access, continue with the request
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/500', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
