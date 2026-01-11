
'use server';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/firebase-admin';
import * as admin from 'firebase-admin';
import { PLAN_CONFIG, PlanType } from '@/lib/plan-config';

// Duplicate validation logic to preserve legacy code isolation
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

  const plan = userData?.subscriptionPlan as PlanType;

  if (!plan || !PLAN_CONFIG[plan]) {
    return { canSubmit: false, message: 'Invalid or no active subscription plan found.' };
  }

  const limit = PLAN_CONFIG[plan].maxCampaignParticipationPerMonth;

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
    return { canSubmit: false, message: `You have reached your monthly limit of ${limit} campaign participations for the ${plan} plan.` };
  }

  return { canSubmit: true, message: '' };
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('tiktok_access_token')?.value;
  const userInfoCookie = cookieStore.get('user_info')?.value;
  const session = cookieStore.get('session')?.value;

  if (!accessToken || !userInfoCookie || !session) {
    return NextResponse.json({ success: false, message: 'User not authenticated' }, { status: 401 });
  }

  try {
    const { campaignId, videoId, videoTitle, videoCover } = await request.json();

    if (!campaignId || !videoId) {
      return NextResponse.json({ success: false, message: 'Missing required fields (campaignId, videoId)' }, { status: 400 });
    }

    const userInfo = JSON.parse(userInfoCookie);
    const userId = session; 

    // 1. Validate Campaign Eligibility
    const submissionCheck = await canSubmitToCampaign(userId, campaignId);
    if (!submissionCheck.canSubmit) {
      return NextResponse.json({ success: false, message: submissionCheck.message }, { status: 403 });
    }

    // 2. Validate Duplicate Submission for this Video
    const existingVideoQuery = await db.firestore().collection('submissions')
      .where('tiktokVideoId', '==', videoId)
      .get();

    if (!existingVideoQuery.empty) {
        return NextResponse.json({ success: false, message: 'This video has already been submitted to a campaign.' }, { status: 400 });
    }

    // 3. Create Submission Record
    const submissionData = {
      campaignId: campaignId,
      userId: userId, 
      tiktokOpenId: userInfo.open_id,
      title: videoTitle || 'Untitled Video',
      tiktokVideoId: videoId,
      cover_image_url: videoCover || '',
      status: 'PUBLISHED', // Direct to PUBLISHED since it's already on TikTok
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
      payoutStatus: 'ELIGIBLE', // Immediately eligible for tracking
      like_count: 0, // Will be updated by the periodic tracker
      lastPaidLikeCount: 0, 
      submissionMethod: 'SELECT_EXISTING'
    };

    const submissionRef = await db.firestore().collection('submissions').add(submissionData);
    
    return NextResponse.json({
      success: true,
      message: 'Video successfully submitted for tracking!',
      submissionId: submissionRef.id,
    });

  } catch (error: any) {
    console.error('Error in submit-video route:', error);
    return NextResponse.json({ success: false, message: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}
