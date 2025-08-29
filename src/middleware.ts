
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  // If trying to access a protected route without a session, redirect to login
  if (!session && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If has a session and tries to access login or the root landing page, redirect to dashboard
  if (session && (pathname === '/login' || pathname === '/')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Match all routes except for static assets, image optimization, and API routes.
  // This ensures the middleware runs on all page navigations.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|terms|privacy).*)'
  ],
};
