
'use server';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import db from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('tiktok_access_token')?.value;
  const session = cookieStore.get('session')?.value;

  if (!accessToken || !session) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }
  const userId = session; // Firebase UID from session

  try {
    // 1. Fetch user's videos from TikTok
    const videoFields = 'id,title,cover_image_url,embed_link,like_count,comment_count,share_count,view_count';
    const videoListResponse = await fetch(`https://open.tiktokapis.com/v2/video/list/?fields=${videoFields}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ max_count: 20 }), // Consider pagination for > 20 videos
    });

    const videoListData = await videoListResponse.json();

    if (videoListData.error && videoListData.error.code !== 'ok') {
      console.error('Error fetching video list from TikTok:', videoListData.error);
      return NextResponse.json({ error: `TikTok API Error: ${videoListData.error.message}` }, { status: 500 });
    }
    
    if (!videoListData.data?.videos || videoListData.data.videos.length === 0) {
        return NextResponse.json({ videos: [] });
    }

    // 2. Get payout status for these videos from our backend (Firestore)
    const tiktokVideoIds = videoListData.data.videos.map((v: any) => v.id);
    const submissionsRef = db.firestore().collection('submissions').where('tiktokVideoId', 'in', tiktokVideoIds).where('userId', '==', userId);
    const submissionsSnapshot = await submissionsRef.get();
    
    const videoStatusMap: { [key: string]: { payoutStatus: string; like_count: number } } = {};
    submissionsSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.tiktokVideoId) {
            videoStatusMap[data.tiktokVideoId] = {
                payoutStatus: data.payoutStatus || 'ELIGIBLE',
                like_count: data.like_count || 0
            };
        }
    });

    // 3. Augment video data with our internal status and latest metrics from Firestore
    // This is important because the video list API might not have real-time stats
     const videosWithStatus = videoListData.data.videos.map((video: any) => ({
        ...video,
        payoutStatus: videoStatusMap[video.id]?.payoutStatus || 'ELIGIBLE', // Default to ELIGIBLE if not in our DB
        like_count: videoStatusMap[video.id]?.like_count || video.like_count || 0 // Prefer our stored like count
    })).filter((video: any) => video.payoutStatus === 'ELIGIBLE'); // Only return eligible videos

    return NextResponse.json({ videos: videosWithStatus });

  } catch (error) {
    console.error('Failed to fetch videos:', error);
    return NextResponse.json({ error: 'Failed to fetch and process videos' }, { status: 500 });
  }
}
