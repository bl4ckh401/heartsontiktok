
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  // Allow access to API routes, static files, and public pages
  if (pathname.startsWith('/api') || 
      pathname.startsWith('/_next') || 
      pathname.includes('.') || 
      ['/', '/login', '/terms', '/privacy'].includes(pathname)) {
    
    // If user has a session and tries to access landing or login, redirect to dashboard
    if (session && (pathname === '/' || pathname === '/login')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    return NextResponse.next();
  }

  // For all other routes (assumed to be protected), check for session
  if (!session) {
    // If trying to access a dashboard page without a session, redirect to login
    // but preserve any plan selection in the query params.
    const url = new URL('/login', request.url);
    if (request.nextUrl.searchParams.has('plan')) {
      url.searchParams.set('plan', request.nextUrl.searchParams.get('plan')!);
    }
    return NextResponse.redirect(url);
  }

  // If there's a session, we let the request proceed.
  // The subscription status check will be handled within the dashboard layout component,
  // which is a more robust pattern as it can perform this check on the client-side
  // or server-side without running database logic in the edge middleware.

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except for static files and image optimization files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
