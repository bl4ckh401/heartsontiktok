
'use server';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import db from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('tiktok_access_token')?.value;
  const userInfoCookie = cookieStore.get('user_info')?.value;

  if (!accessToken || !userInfoCookie) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  try {
    const userInfo = JSON.parse(userInfoCookie);
    const userId = userInfo.open_id;

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
    
    const videoPayoutStatuses: { [key: string]: string } = {};
    submissionsSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.tiktokVideoId) {
            // Statuses could be: SUBMITTED, PENDING, PAID, FAILED
            videoPayoutStatuses[data.tiktokVideoId] = data.payoutStatus || 'ELIGIBLE';
        }
    });

    // 3. Filter for eligible videos
    const MIN_PAYOUT_VIEWS = 1000;
    const eligibleVideos = videoListData.data.videos.filter((video: any) => {
        const isEligibleByViews = (video.view_count || 0) >= MIN_PAYOUT_VIEWS;
        // A video is eligible if it has enough views AND does not have a 'PENDING' or 'PAID' status in our DB.
        const payoutStatus = videoPayoutStatuses[video.id];
        const isEligibleByStatus = payoutStatus !== 'PENDING' && payoutStatus !== 'PAID';

        return isEligibleByViews && isEligibleByStatus;
    });

    // 4. Augment video data with our internal status for the frontend if needed
     const videosWithStatus = eligibleVideos.map((video: any) => ({
        ...video,
        payoutStatus: videoPayoutStatuses[video.id] || 'ELIGIBLE' // Add our status
    }));


    return NextResponse.json({ videos: videosWithStatus });

  } catch (error) {
    console.error('Failed to fetch videos:', error);
    return NextResponse.json({ error: 'Failed to fetch and process videos' }, { status: 500 });
  }
}
