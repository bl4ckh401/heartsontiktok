
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('tiktok_access_token')?.value;
  const session = cookieStore.get('session')?.value;

  if (!accessToken || !session) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  try {
    // Fetch recent videos from TikTok
    // Note: video.list requires 'video.list' scope
    const videoFields = 'id,title,cover_image_url,embed_link,like_count,create_time,share_url';
    
    // We request the most recent 20 videos
    const response = await fetch('https://open.tiktokapis.com/v2/video/list/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        max_count: 20, 
        fields: videoFields.split(',')
      }),
    });

    const data = await response.json();

    if (data.error && data.error.code !== 'ok') {
      console.error('TikTok API Error (video/list):', data.error);
      return NextResponse.json({ 
        error: data.error.message || 'Failed to fetch videos from TikTok',
        details: data.error
      }, { status: 400 });
    }

    const videos = data.data?.videos || [];

    return NextResponse.json({ videos });

  } catch (error: any) {
    console.error('Error fetching TikTok videos:', error);
    return NextResponse.json({ error: 'Internal server error fetching videos' }, { status: 500 });
  }
}
