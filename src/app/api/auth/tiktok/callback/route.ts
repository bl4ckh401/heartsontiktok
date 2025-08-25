
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  const cookieStore = cookies();
  const csrfState = cookieStore.get('csrfState')?.value;

  // Clear the CSRF state cookie after using it
  cookieStore.delete('csrfState');

  if (error) {
    console.error(`TikTok Auth Error: ${error} - ${errorDescription}`);
    // Redirect to an error page or the login page with an error message
    return NextResponse.redirect(new URL('/login?error=tiktok_auth_failed', req.url));
  }

  if (!state || state !== csrfState) {
    console.error('TikTok Auth Error: Invalid CSRF state');
    // Redirect to an error page for state mismatch
    return NextResponse.redirect(new URL('/login?error=invalid_state', req.url));
  }

  if (!code) {
    console.error('TikTok Auth Error: No code provided');
    return NextResponse.redirect(new URL('/login?error=missing_code', req.url));
  }

  try {
    const TIKTOK_CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY;
    const TIKTOK_CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET;
    const APP_URL = process.env.APP_URL;


    if (!TIKTOK_CLIENT_KEY || !TIKTOK_CLIENT_SECRET || !APP_URL) {
      throw new Error('TikTok client key, secret, or app URL is not defined in environment variables.');
    }

    const tokenUrl = 'https://open.tiktokapis.com/v2/oauth/token/';
    
    const params = new URLSearchParams();
    params.append('client_key', TIKTOK_CLIENT_KEY);
    params.append('client_secret', TIKTOK_CLIENT_SECRET);
    params.append('code', code);
    params.append('grant_type', 'authorization_code');
    params.append('redirect_uri', `${APP_URL}/api/auth/tiktok/callback`);

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(`Failed to fetch access token: ${data.error_description || response.statusText}`);
    }

    // SUCCESS! You have the access token.
    // In a real application, you would:
    // 1. Save the access_token, refresh_token, and expiry to the user's record in your Firebase database.
    // 2. Create a session for the user (e.g., using a JWT or session cookie).
    // 3. Redirect them to their dashboard.
    console.log('Successfully obtained TikTok Access Token:', data);

    // For now, we'll just redirect to the dashboard.
    return NextResponse.redirect(new URL('/dashboard', req.url));

  } catch (e: any) {
    console.error('Error fetching TikTok access token:', e.message);
    return NextResponse.redirect(new URL('/login?error=token_exchange_failed', req.url));
  }
}
