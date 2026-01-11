
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
 const TIKTOK_CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY;

  if (!TIKTOK_CLIENT_KEY) {
    console.error('Missing TIKTOK_CLIENT_KEY environment variable for TikTok OAuth.');
    return NextResponse.json({ error: 'Server configuration error: Missing TikTok Client Key.' }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const plan = searchParams.get('plan');

  const csrfState = crypto.randomBytes(16).toString('hex');
  // Embed the plan in the state, so we can retrieve it after the callback
  const stateWithPlan = plan ? `${csrfState}&plan=${plan}` : csrfState;

  const cookieStore = cookies();
  (await cookieStore).set('csrfState', csrfState, { maxAge: 60 * 60, httpOnly: true, secure: process.env.NODE_ENV === 'production' });

  // Ensure no trailing slash on APP_URL
  const appUrl = (process.env.APP_URL || '').replace(/\/$/, '');
  const redirectUri = `${appUrl}/api/auth/tiktok/callback`;
  
  const scopes = [
    'user.info.basic',
    'user.info.profile',
    // 'user.info.stats',
    // 'video.list',
    // 'video.publish',
    // 'video.upload',
 ].join(',');

  let url = 'https://www.tiktok.com/v2/auth/authorize/';
  const params = new URLSearchParams({
    client_key: TIKTOK_CLIENT_KEY,
    scope: scopes,
    response_type: 'code',
    redirect_uri: redirectUri,
    state: stateWithPlan,
  });

  console.log('Initiating TikTok Auth with scopes:', scopes);

  url += `?${params.toString()}`;

  return NextResponse.redirect(url);
}
