
'use server';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/firebase-admin';
import * as admin from 'firebase-admin';

// Define campaign limits per plan
const CAMPAIGN_LIMITS = {
  Gold: 3,
  Platinum: 8,
  Diamond: Infinity,
};

async function canSubmitToCampaign(userId: string): Promise<{ canSubmit: boolean; message: string }> {
  const userRef = db.firestore().collection('users').doc(userId);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    return { canSubmit: false, message: 'User profile not found.' };
  }

  const userData = userDoc.data();
  const plan = userData?.subscriptionPlan;

  if (!plan || !CAMPAIGN_LIMITS[plan as keyof typeof CAMPAIGN_LIMITS]) {
    return { canSubmit: false, message: 'Invalid or no active subscription plan found.' };
  }

  const limit = CAMPAIGN_LIMITS[plan as keyof typeof CAMPAIGN_LIMITS];
  if (limit === Infinity) {
    return { canSubmit: true, message: '' };
  }

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date(startOfMonth);
  endOfMonth.setMonth(startOfMonth.getMonth() + 1);

  const submissionsQuery = db.firestore().collection('submissions')
    .where('userId', '==', userId)
    .where('submittedAt', '>=', startOfMonth)
    .where('submittedAt', '<', endOfMonth);
    
  const submissionsSnapshot = await submissionsQuery.get();
  const uniqueCampaignIds = new Set(submissionsSnapshot.docs.map(doc => doc.data().campaignId));

  if (uniqueCampaignIds.size >= limit) {
    return { canSubmit: false, message: `You have reached your monthly limit of ${limit} campaign submissions for the ${plan} plan.` };
  }

  return { canSubmit: true, message: '' };
}


export async function POST(request: Request) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('tiktok_access_token')?.value;
  const userInfoCookie = cookieStore.get('user_info')?.value;
  const session = cookieStore.get('session')?.value;


  if (!accessToken || !userInfoCookie || !session) {
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
    const userId = session; // Using Firebase UID from session

    // Enforce campaign submission limits
    const submissionCheck = await canSubmitToCampaign(userId);
    if (!submissionCheck.canSubmit) {
      return NextResponse.json({ success: false, message: submissionCheck.message }, { status: 403 });
    }

    // Hardcoded for unaudited app compliance
    const postInfo: any = {
      title: hashtags ? `${title} ${hashtags}` : title,
      privacy_level: 'SELF_ONLY',
      disable_duet: false,
      disable_comment: false,
      disable_stitch: false,
      brand_content_toggle: false,
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
      headers: {
        'Content-Type': videoFile.type,
        'Content-Length': String(videoFile.size),
        'Content-Range': `bytes 0-${videoFile.size - 1}/${videoFile.size}`
       },
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
      userId: userId, // Store Firebase UID
      tiktokOpenId: userInfo.open_id, // Also store open_id for reference
      title: title,
      hashtags: hashtags,
      tiktokPublishId: publish_id,
      status: 'SUBMITTED', // Initial status, will be polled for completion.
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
      payoutStatus: 'ELIGIBLE', // Assume eligible until paid.
    };

    const submissionRef = await db.firestore().collection('submissions').add(submissionData);
    
    return NextResponse.json({
      success: true,
      message: 'Video upload initiated. We will now verify the publication status.',
      publishId: publish_id,
      submissionId: submissionRef.id,
    });

  } catch (error: any) {
    console.error('Error in post-video route:', error);
    return NextResponse.json({ success: false, message: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}
