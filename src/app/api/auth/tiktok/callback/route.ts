
import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import type {NextRequest} from 'next/server';
import admin from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  const {searchParams} = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  const cookieStore = cookies();
  const csrfState = cookieStore.get('csrfState')?.value;

  if (error) {
    console.error(`TikTok Auth Error: ${error}`);
    return NextResponse.redirect(new URL(`/login?error=${error}`, req.url));
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
    const APP_URL = process.env.APP_URL;

    if (!TIKTOK_CLIENT_KEY || !TIKTOK_CLIENT_SECRET || !APP_URL) {
      throw new Error('TikTok client key, secret, or app URL is not defined in environment variables.');
    }
    
    // Exchange auth code for access token
    const tokenUrl = 'https://open.tiktokapis.com/v2/oauth/token/';
    const tokenParams = new URLSearchParams({
      client_key: TIKTOK_CLIENT_KEY,
      client_secret: TIKTOK_CLIENT_SECRET,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: `${APP_URL}/api/auth/tiktok/callback`,
    });

    const tokenRes = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenParams.toString(),
    });
    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      console.error('TikTok token exchange response:', tokenData);
      throw new Error(`Failed to fetch access token: ${tokenData.error_description || 'Unknown error'}`);
    }

    const accessToken = tokenData.access_token;
    
    // Fetch user info from TikTok
    const userRes = await fetch('https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    
    if (!userRes.ok) {
        const text = await userRes.text();
        console.error('TikTok user info raw error response:', text);
        try {
            // Try to parse as JSON to get a more specific error
            const errorJson = JSON.parse(text);
            throw new Error(`Failed to fetch user info from TikTok: ${errorJson.error_description || text}`);
        } catch (e) {
            // If it's not JSON, throw the raw text
            throw new Error('Failed to fetch user info from TikTok.');
        }
    }
    
    const { data: userData, error: userError } = await userRes.json();
    if(userError && userError.code !== 'ok') {
        console.error('TikTok user info error:', userError);
        throw new Error(`Failed to fetch user info: ${userError.message}`);
    }

    const uid = `tiktok:${userData.union_id}`;

    // Create or update user in Firebase
    await admin.auth().updateUser(uid, {
      displayName: userData.display_name,
      photoURL: userData.avatar_url,
    }).catch(async (error) => {
      if (error.code === 'auth/user-not-found') {
        await admin.auth().createUser({
          uid: uid,
          displayName: userData.display_name,
          photoURL: userData.avatar_url,
        });
      } else {
        throw error;
      }
    });

    // Create a session for the user
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await admin.auth().createSessionCookie(uid, {expiresIn});
    
    const response = NextResponse.redirect(new URL('/dashboard?success=login_successful', req.url));
    response.cookies.set('session', sessionCookie, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: expiresIn });

    return response;

  } catch (e: any) {
    console.error('Error in TikTok callback:', e.message);
    const errorMessage = e.message.includes('Failed to fetch access token') 
      ? 'token_exchange_failed' 
      : 'generic_error';
    const errorDescription = e.message;
    return NextResponse.redirect(new URL(`/login?error=${errorMessage}&error_description=${encodeURIComponent(errorDescription)}`, req.url));
  }
}
