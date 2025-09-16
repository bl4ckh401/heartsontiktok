import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/firebase-admin';
import { PLAN_CONFIG, PlanType } from '@/lib/plan-config';

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;

  if (!session) {
    return NextResponse.json({ success: false, message: 'User not authenticated' }, { status: 401 });
  }

  try {
    const userId = session;
    
    // Get user's plan
    const userDoc = await db.firestore().collection('users').doc(userId).get();
    const userPlan = userDoc.data()?.subscriptionPlan as PlanType;
    
    if (!userPlan || !PLAN_CONFIG[userPlan]) {
      return NextResponse.json({ success: false, message: 'User has no valid subscription plan.' }, { status: 403 });
    }
    
    // Get current month's campaign participations (submissions)
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
    
    return NextResponse.json({
      success: true,
      data: {
        currentParticipations,
        maxParticipations,
        canParticipateMore: currentParticipations < maxParticipations,
        plan: userPlan
      }
    });
    
  } catch (error: any) {
    console.error('Error checking campaign limit:', error);
    return NextResponse.json({ success: false, message: 'Failed to check campaign limit' }, { status: 500 });
  }
}