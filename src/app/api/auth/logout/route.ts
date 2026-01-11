import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const cookieStore = await cookies();
  
  // Clear all authentication-related cookies
  // Use absolute URL for cleaner redirect handling
  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  const response = NextResponse.redirect(new URL('/login', appUrl));

  // Set headers to prevent caching
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  
  response.cookies.delete('tiktok_access_token');
  response.cookies.delete('user_info');
  response.cookies.delete('session');
  
  // Force expire them explicitly in case delete() logic varies
  response.cookies.set('session', '', { maxAge: 0 });
  response.cookies.set('user_info', '', { maxAge: 0 });

  return response;
}