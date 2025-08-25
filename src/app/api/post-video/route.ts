
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/firebase-admin';

export async function POST(request: Request) {
  const { videoUrl, title, campaignId } = await request.json();
  const cookieStore = cookies();
  const accessToken = cookieStore.get('tiktok_access_token')?.value;
  const userInfoCookie = cookieStore.get('user_info')?.value;

  if (!accessToken || !userInfoCookie) {
    return NextResponse.json({ success: false, message: 'User not authenticated' }, { status: 401 });
  }

  if (!videoUrl || !title || !campaignId) {
    return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
  }

  try {
    const userInfo = JSON.parse(userInfoCookie);
    
    // Step 1: Query Creator Info (Optional but good practice)
    const creatorInfoResponse = await fetch('https://open.tiktokapis.com/v2/post/publish/creator_info/query/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
    });

    const creatorInfoData = await creatorInfoResponse.json();

    if (creatorInfoData.error.code !== 'ok') {
      console.error('TikTok Creator Info Error:', creatorInfoData.error);
      return NextResponse.json({ success: false, message: `TikTok API Error: ${creatorInfoData.error.message}` }, { status: 500 });
    }
    
    // Step 2: Initialize Video Post
    const postInfo = {
      title: title,
      privacy_level: 'PUBLIC_TO_EVERYONE', // Or another level from creatorInfoData.data.privacy_level_options
      disable_duet: false,
      disable_comment: false,
      disable_stitch: false,
    };

    const sourceInfo = {
      source: 'PULL_FROM_URL',
      video_url: videoUrl,
    };

    const initResponse = await fetch('https://open.tiktokapis.com/v2/post/publish/video/init/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        post_info: postInfo,
        source_info: sourceInfo,
      }),
    });

    const initData = await initResponse.json();

    if (initData.error.code !== 'ok') {
      console.error('TikTok Post Init Error:', initData.error);
      return NextResponse.json({ success: false, message: `TikTok Post Init Error: ${initData.error.message}` }, { status: 500 });
    }

    const publishId = initData.data.publish_id;

    // Step 3: Record the submission in Firestore
    const submissionData = {
      campaignId: campaignId,
      userId: userInfo.open_id, // Using open_id as the user identifier
      videoUrl: videoUrl,
      caption: title,
      tiktokPublishId: publishId,
      status: 'SUBMITTED', // Initial status
      submittedAt: new Date().toISOString(),
    };

    await db.firestore().collection('submissions').add(submissionData);

    return NextResponse.json({ success: true, publishId: publishId });

  } catch (error: any) {
    console.error('Error posting video to TikTok:', error);
    return NextResponse.json({ success: false, message: 'Failed to post video to TikTok.' }, { status: 500 });
  }
}
