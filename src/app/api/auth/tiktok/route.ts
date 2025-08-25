
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import crypto from 'crypto';

export function GET(req: NextRequest) {
  const TIKTOK_CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY;
  const APP_URL = process.env.APP_URL;

  if (!TIKTOK_CLIENT_KEY || !APP_URL) {
    console.error('Missing required environment variables for TikTok OAuth.');
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  const csrfState = crypto.randomBytes(16).toString('hex');
  const cookieStore = cookies();
  cookieStore.set('csrfState', csrfState, { maxAge: 60 * 60, httpOnly: true, secure: process.env.NODE_ENV === 'production' });


  const redirectURI = `${APP_URL}/api/auth/tiktok/callback`;
  
  const scopes = [
    'user.info.basic',
    'video.publish',
    'video.upload',
    'user.info.profile',
    'user.info.stats',
    'video.list',
  ].join(',');

  let url = 'https://www.tiktok.com/v2/auth/authorize/';
  const params = new URLSearchParams({
    client_key: TIKTOK_CLIENT_KEY,
    scope: scopes,
    response_type: 'code',
    redirect_uri: redirectURI,
    state: csrfState,
  });

  url += `?${params.toString()}`;

  return NextResponse.redirect(url);
}
