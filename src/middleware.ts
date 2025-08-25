
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const url = request.nextUrl.clone();

  const isLoginPage = url.pathname === '/login';

  // If the user is on the login page
  if (isLoginPage) {
    // If they have a session, redirect to the dashboard
    if (session) {
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
    // Otherwise, let them view the login page
    return NextResponse.next();
  }

  // For any other page, check for a session
  if (!session) {
    // If no session, redirect to login, but preserve the original path for after login
    url.searchParams.set('next', url.pathname);
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
  
  // If they have a session, let them proceed
  return NextResponse.next();
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
}
