
import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import type {NextRequest} from 'next/server';

export async function GET(req: NextRequest) {
  const {searchParams, protocol, host} = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  const cookieStore = cookies();
  const csrfState = cookieStore.get('csrfState')?.value;

  if (error) {
    console.error(`TikTok Auth Error: ${error}`);
    return NextResponse.redirect(new URL(`/login?error=${error}&error_description=${encodeURIComponent(errorDescription || 'Unknown error.')}`, req.url));
  }
  
  if (!state || state !== csrfState) {
    return NextResponse.redirect(new URL('/login?error=invalid_state', req.url));
  }
  
  cookieStore.delete('csrfState');

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=missing_code', req.url));
  }

  try {
    const TIKTOK_CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY;
    const TIKTOK_CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET;
    
    // Dynamically construct the redirect URI to ensure it matches exactly.
    const redirectUri = `${protocol}//${host}/api/auth/tiktok/callback`;

    if (!TIKTOK_CLIENT_KEY || !TIKTOK_CLIENT_SECRET) {
      throw new Error('TikTok client key or secret is not defined in environment variables.');
    }
    
    const tokenUrl = 'https://open.tiktokapis.com/v2/oauth/token/';
    const decodedCode = decodeURIComponent(code);

    const tokenParams = new URLSearchParams({
      client_key: TIKTOK_CLIENT_KEY,
      client_secret: TIKTOK_CLIENT_SECRET,
      code: decodedCode,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    });

    const tokenRes = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenParams.toString(),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || tokenData.error) {
      console.error('TikTok token exchange response:', tokenData);
      const errorMessage = tokenData.error_description || 'Unknown token exchange error';
      throw new Error(`Failed to fetch access token: ${errorMessage}`);
    }

    const accessToken = tokenData.access_token;
    
    const userFields = 'open_id,union_id,avatar_url,display_name';
    const userRes = await fetch(`https://open.tiktokapis.com/v2/user/info/?fields=${userFields}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    
    const userData = await userRes.json();
    
    if (userData.error && userData.error.code !== 'ok') {
        console.error('TikTok user info error:', userData.error);
        const errorMessage = userData.error.message || JSON.stringify(userData.error);
        throw new Error(`Failed to fetch user info from TikTok: ${errorMessage}`);
    }
    
    // TEMPORARY: Set a simple session cookie without Firebase
    const response = NextResponse.redirect(new URL('/dashboard', req.url));
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    response.cookies.set('session', 'true', { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: expiresIn });
    response.cookies.set('user_info', JSON.stringify(userData.data), { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: expiresIn });


    return response;

  } catch (e: any) {
    console.error('Error in TikTok callback:', e.message);
    const errorMessage = e.message || 'generic_error';
    return NextResponse.redirect(new URL(`/login?error=generic_error&error_description=${encodeURIComponent(errorMessage)}`, req.url));
  }
}
