
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  // Assume user is authenticated if session cookie exists
  // In a real app, you'd verify this session against your backend
  const isAuthenticated = !!session;

  const isPublicRoute = 
    pathname === '/login' || 
    pathname === '/' || 
    pathname === '/terms' || 
    pathname === '/privacy';

  // Allow API routes, Next.js internal routes, and static files to pass through
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // If trying to access a protected route and not authenticated, redirect to login
  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If authenticated and trying to access login or landing page, redirect to dashboard
  if (isAuthenticated && (pathname === '/login' || pathname === '/')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
