
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get('tiktok_access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'TikTok access token not found' }, { status: 401 });
  }

  try {
    const videoFields = 'id,title,cover_image_url,embed_link,like_count,comment_count,share_count,view_count';
    const videoListResponse = await fetch(`https://open.tiktokapis.com/v2/video/list/?fields=${videoFields}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ max_count: 20 }),
    });

    const videoListData = await videoListResponse.json();

    if (videoListData.error && videoListData.error.code !== 'ok') {
      console.error('Error fetching video list from TikTok:', videoListData.error);
      return NextResponse.json({ error: `TikTok API Error: ${videoListData.error.message}` }, { status: 500 });
    }

    return NextResponse.json({ videos: videoListData.data.videos });

  } catch (error) {
    console.error('Failed to fetch videos from TikTok:', error);
    return NextResponse.json({ error: 'Failed to fetch videos from TikTok' }, { status: 500 });
  }
}
