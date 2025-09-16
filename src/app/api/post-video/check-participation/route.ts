import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/firebase-admin';
import { PLAN_CONFIG, PlanType } from '@/lib/plan-config';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;

  if (!session) {
    return NextResponse.json({ success: false, message: 'User not authenticated' }, { status: 401 });
  }

  try {
    const { campaignId } = await request.json();
    const userId = session;
    
    if (!campaignId) {
      return NextResponse.json({ success: false, message: 'Campaign ID is required' }, { status: 400 });
    }
    
    // Get user's plan
    const userDoc = await db.firestore().collection('users').doc(userId).get();
    const userPlan = userDoc.data()?.subscriptionPlan as PlanType;
    
    if (!userPlan || !PLAN_CONFIG[userPlan]) {
      return NextResponse.json({ success: false, message: 'User has no valid subscription plan.' }, { status: 403 });
    }
    
    // Get current month's campaign participations
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    
    const submissionsSnapshot = await db.firestore().collection('submissions')
      .where('userId', '==', userId)
      .where('submittedAt', '>=', startOfMonth)
      .where('submittedAt', '<=', endOfMonth)
      .get();
    
    // Count unique campaigns participated in
    const uniqueCampaigns = new Set(submissionsSnapshot.docs.map(doc => doc.data().campaignId));
    const currentParticipations = uniqueCampaigns.size;
    const maxParticipations = PLAN_CONFIG[userPlan].maxCampaignParticipationPerMonth;
    
    // Check if already participated in this campaign
    const alreadyParticipated = uniqueCampaigns.has(campaignId);
    
    // Can participate if: already in this campaign OR under monthly limit
    const canParticipate = alreadyParticipated || currentParticipations < maxParticipations;
    
    return NextResponse.json({
      success: true,
      data: {
        canParticipate,
        currentParticipations,
        maxParticipations,
        alreadyParticipated,
        plan: userPlan,
        message: canParticipate ? 'Can participate' : `Monthly participation limit reached. ${userPlan} plan allows ${maxParticipations} campaigns per month.`
      }
    });
    
  } catch (error: any) {
    console.error('Error checking participation limit:', error);
    return NextResponse.json({ success: false, message: 'Failed to check participation limit' }, { status: 500 });
  }
}