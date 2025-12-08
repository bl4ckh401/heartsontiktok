import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  
  // Clear all authentication-related cookies
  const response = NextResponse.redirect(new URL('/login', process.env.APP_URL || 'http://localhost:3000'));
  
  response.cookies.delete('tiktok_access_token');
  response.cookies.delete('user_info');
  response.cookies.delete('session');
  
  return response;
}