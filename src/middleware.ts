
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import db from '@/lib/firebase-admin';

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
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If there's a session, verify subscription status for dashboard pages
  if (pathname.startsWith('/dashboard')) {
      try {
        const userRef = db.firestore().collection('users').doc(session);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
            const userData = userDoc.data();
            const isSubscribed = userData?.subscriptionStatus === 'ACTIVE';

            if (!isSubscribed && pathname !== '/dashboard/subscription') {
                return NextResponse.redirect(new URL('/dashboard/subscription', request.url));
            }
        } else {
             // User document doesn't exist, treat as unsubscribed
             return NextResponse.redirect(new URL('/dashboard/subscription', request.url));
        }

      } catch (error) {
          console.error("Middleware Firestore error:", error);
          // Fallback: if DB check fails, redirect to login to be safe
          return NextResponse.redirect(new URL('/login?error=session_error', request.url));
      }
  }


  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
