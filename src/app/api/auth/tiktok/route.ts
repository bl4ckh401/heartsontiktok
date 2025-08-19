
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import crypto from 'crypto';

export function GET(req: NextRequest) {
  const csrfState = crypto.randomBytes(16).toString('hex');
  const cookieStore = cookies();
  cookieStore.set('csrfState', csrfState, { maxAge: 60000, httpOnly: true, secure: process.env.NODE_ENV === 'production' });

  const TIKTOK_CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY;
  if (!TIKTOK_CLIENT_KEY) {
    // In a real app, you'd want to handle this more gracefully
    // and show an error page to the user.
    throw new Error('TIKTOK_CLIENT_KEY is not defined in .env');
  }

  const redirectURI = `${process.env.APP_URL}/api/auth/tiktok/callback`;
  
  let url = 'https://www.tiktok.com/v2/auth/authorize/';
  const params = new URLSearchParams({
    client_key: TIKTOK_CLIENT_KEY,
    scope: 'user.info.basic',
    response_type: 'code',
    redirect_uri: redirectURI,
    state: csrfState,
  });

  url += `?${params.toString()}`;

  return NextResponse.redirect(url);
}
