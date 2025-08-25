import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const tiktokAccessToken = (await cookieStore).get('tiktok_access_token');

  if (tiktokAccessToken) {
    return NextResponse.json({ accessToken: tiktokAccessToken.value });
  } else {
    return NextResponse.json({ error: 'TikTok access token not found' }, { status: 404 });
  }
}