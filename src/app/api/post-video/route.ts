
'use server';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/firebase-admin';
import * as admin from 'firebase-admin';

const CAMPAIGN_LIMITS = {
  Gold: 3,
  Platinum: 8,
  Diamond: Infinity,
};

async function canSubmitToCampaign(userId: string, campaignId: string): Promise<{ canSubmit: boolean; message: string }> {
  const userRef = db.firestore().collection('users').doc(userId);
  const campaignRef = db.firestore().collection('campaigns').doc(campaignId);

  const [userDoc, campaignDoc] = await Promise.all([userRef.get(), campaignRef.get()]);

  if (!userDoc.exists) {
    return { canSubmit: false, message: 'User profile not found.' };
  }
  if (!campaignDoc.exists) {
    return { canSubmit: false, message: 'Campaign not found.' };
  }

  const userData = userDoc.data();
  const campaignData = campaignDoc.data();

  if (campaignData?.status === 'INACTIVE') {
      return { canSubmit: false, message: 'This campaign is no longer active and cannot accept new submissions.' };
  }
  if ((campaignData?.budget || 0) <= 0) {
      return { canSubmit: false, message: 'This campaign has depleted its budget and is no longer active.' };
  }

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
    const userId = session; 

    const submissionCheck = await canSubmitToCampaign(userId, campaignId);
    if (!submissionCheck.canSubmit) {
      return NextResponse.json({ success: false, message: submissionCheck.message }, { status: 403 });
    }

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
        const errorText = await uploadResponse.text();
        console.error('TikTok Video Upload HTTP Error:', uploadResponse.status, errorText);
        throw new Error(`TikTok video upload failed with status: ${uploadResponse.status}`);
    }

    const submissionData = {
      campaignId: campaignId,
      userId: userId, 
      tiktokOpenId: userInfo.open_id,
      title: title,
      hashtags: hashtags,
      tiktokPublishId: publish_id,
      status: 'SUBMITTED', 
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
      payoutStatus: 'UNPAID', // Initial status is UNPAID, becomes ELIGIBLE after metrics update
      like_count: 0,
      lastPaidLikeCount: 0, // Initialize tracking for incremental payouts
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
