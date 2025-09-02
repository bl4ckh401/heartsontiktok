
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/firebase-admin';

export async function POST(request: Request) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('tiktok_access_token')?.value;
  const userInfoCookie = cookieStore.get('user_info')?.value;

  if (!accessToken || !userInfoCookie) {
    return NextResponse.json({ success: false, message: 'User not authenticated' }, { status: 401 });
  }

  const formData = await request.formData();
  const videoFile = formData.get('video') as File;
  const title = formData.get('title') as string;
  const hashtags = formData.get('hashtags') as string;
  const campaignId = formData.get('campaignId') as string;

  if (!videoFile || !title || !campaignId) {
    return NextResponse.json({ success: false, message: 'Missing required fields (video, title, campaignId)' }, { status: 400 });
  }

  if (videoFile.size === 0) {
    return NextResponse.json({ success: false, message: 'Video file is empty.' }, { status: 400 });
  }
  if (!videoFile.type.startsWith('video/')) {
    return NextResponse.json({ success: false, message: 'Invalid file type. Please upload a video.' }, { status: 400 });
  }

  try {
    const userInfo = JSON.parse(userInfoCookie);

    // Per TikTok's guidelines for unaudited apps, all posts must be private.
    const postInfo: any = {
      title: hashtags ? `${title} ${hashtags}` : title,
      privacy_level: 'SELF_ONLY',
      disable_duet: false,
      disable_comment: false,
      disable_stitch: false,
      brand_content_toggle: false, // Must be false for unaudited apps
    };

    const initResponse = await fetch('https://open.tiktokapis.com/v2/post/publish/video/init/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        post_info: postInfo,
        source_info: {
          source: 'FILE_UPLOAD',
          video_size: videoFile.size,
          chunk_size: videoFile.size,
          total_chunk_count: 1,
        }
      }),
    });

    const initData = await initResponse.json();

    if (initData.error?.code !== 'ok') {
      console.error('TikTok Post Init Error:', initData.error);
      const userMessage = `TikTok API Error: ${initData.error.message}. Please ensure your TikTok account is set to private and try again.`;
      return NextResponse.json({ success: false, message: userMessage, status: 400, error: initData.error });
    }

    const { publish_id, upload_url } = initData.data;

    const uploadResponse = await fetch(upload_url, {
      method: 'PUT',
      headers: { 'Content-Type': videoFile.type, },
      body: videoFile.stream(),
      // @ts-ignore
      duplex: 'half',
    });

    if (!uploadResponse.ok) {
        console.error('TikTok Video Upload HTTP Error:', uploadResponse.status, await uploadResponse.text());
        throw new Error(`TikTok video upload failed with status: ${uploadResponse.status}`);
    }

    const submissionData = {
      campaignId: campaignId,
      userId: userInfo.open_id,
      title: title,
      hashtags: hashtags,
      tiktokPublishId: publish_id,
      status: 'SUBMITTED', // Initial status, should be checked later
      submittedAt: new Date().toISOString(),
    };

    await db.firestore().collection('submissions').add(submissionData);
    
    // In a real production app, you would now start polling the publish status endpoint
    // or handle webhooks to confirm the video is published before updating the status
    // in Firestore to 'PUBLISHED'.

    return NextResponse.json({
      success: true,
      message: 'Video upload initiated. Processing will continue in the background.',
      publishId: publish_id,
    });

  } catch (error: any) {
    console.error('Error in post-video route:', error);
    return NextResponse.json({ success: false, message: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}
