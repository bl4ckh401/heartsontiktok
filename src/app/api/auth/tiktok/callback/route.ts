
import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import type {NextRequest} from 'next/server';
import db, { auth as adminAuth } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  const {searchParams} = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  
  const cookieStore = await cookies();
  const csrfState = cookieStore.get('csrfState')?.value;
  // Retrieve the plan from the state parameter
  const plan = state ? new URLSearchParams(state).get('plan') : null;


  if (error) {
    console.error(`TikTok Auth Error: ${error}`);
    return NextResponse.redirect(new URL(`/login?error=${error}&error_description=${encodeURIComponent(errorDescription || 'Unknown error.')}`, req.url));
  }
  
  if (!state || state.split('&')[0] !== csrfState) {
    return NextResponse.redirect(new URL('/login?error=invalid_state&error_description=Invalid+state.+The+request+could+not+be+verified.', req.url));
  }
  
  cookieStore.delete('csrfState');

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=missing_code&error_description=The+authorization+code+was+not+provided+by+TikTok.', req.url));
  }

  try {
    const TIKTOK_CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY;
    const TIKTOK_CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET;
    
    if (!TIKTOK_CLIENT_KEY || !TIKTOK_CLIENT_SECRET) {
      throw new Error('TikTok client key or secret is not defined in environment variables.');
    }
    
    const appUrl = (process.env.APP_URL || '').replace(/\/$/, '');
    const redirectUri = `${appUrl}/api/auth/tiktok/callback`;

    const tokenUrl = 'https://open.tiktokapis.com/v2/oauth/token/';
    const tokenParams = new URLSearchParams({
      client_key: TIKTOK_CLIENT_KEY,
      client_secret: TIKTOK_CLIENT_SECRET,
      code: decodeURIComponent(code),
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
      const errorMessage = tokenData.error_description || tokenData.error || 'Unknown token exchange error';
      throw new Error(`Failed to fetch access token: ${errorMessage}`);
    }

    const accessToken = tokenData.access_token;
    
    const userFields = 'open_id,union_id,avatar_url,display_name,bio_description,is_verified,follower_count,following_count,likes_count,video_count';
    const userRes = await fetch(`https://open.tiktokapis.com/v2/user/info/?fields=${userFields}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    
    const userData = await userRes.json();
    
    if (userData.error && userData.error.code !== 'ok') {
        console.error('TikTok user info error:', userData.error);
        const errorMessage = userData.error.message || JSON.stringify(userData.error);
        throw new Error(`Failed to fetch user info from TikTok: ${errorMessage}`);
    }
    
    const tiktokUserData = userData.data.user;
    const firebaseUid = `tiktok:${tiktokUserData.open_id}`;
    
    const referralCookie = cookieStore.get('referral_id');
    const referredBy = referralCookie ? referralCookie.value : null;

    try {
      await adminAuth.getUser(firebaseUid);
      await adminAuth.updateUser(firebaseUid, {
        displayName: tiktokUserData.display_name,
        photoURL: tiktokUserData.avatar_url,
      });
      await db.firestore().collection('users').doc(firebaseUid).set({
        displayName: tiktokUserData.display_name,
        photoURL: tiktokUserData.avatar_url,
        open_id: tiktokUserData.open_id,
        updatedAt: new Date(),
      }, { merge: true });
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        await adminAuth.createUser({
          uid: firebaseUid,
          displayName: tiktokUserData.display_name,
          photoURL: tiktokUserData.avatar_url,
        });
    const userDoc: any = {
      displayName: tiktokUserData.display_name,
      photoURL: tiktokUserData.avatar_url,
      open_id: tiktokUserData.open_id,
      createdAt: new Date(),
      subscriptionPlan: 'Free',
      subscriptionStatus: 'ACTIVE',
    };
    if (referredBy) {
      userDoc.referredBy = referredBy;
    }
    await db.firestore().collection('users').doc(firebaseUid).set(userDoc);
      } else {
        throw error;
      }
    }

    const expiresIn = tokenData.expires_in;
    
    // Redirect to subscription page with plan pre-selected, or dashboard if no plan
    const redirectPath = plan ? `/dashboard/subscription?plan=${plan}` : '/dashboard';
    const response = NextResponse.redirect(new URL(redirectPath, req.url));

    response.cookies.set('tiktok_access_token', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: expiresIn });
    response.cookies.set('user_info', JSON.stringify(userData.data.user), { maxAge: expiresIn });
    response.cookies.set('session', firebaseUid, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: expiresIn });
    
    if (referralCookie) {
        response.cookies.delete('referral_id');
    }

    return response;

  } catch (e: any) {
    console.error('Error in TikTok callback:', e);
    const errorMessage = e.message || 'An unexpected error occurred. Please try again later.';
    return NextResponse.redirect(new URL(`/login?error=generic_error&error_description=${encodeURIComponent(errorMessage)}`, req.url));
  }
}
