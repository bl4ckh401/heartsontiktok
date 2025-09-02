
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/firebase-admin';

export async function GET(request: Request) {
  const cookieStore = cookies();
  const session = cookieStore.get('session')?.value; 

  if (!session) {
    return NextResponse.json({ success: false, message: 'User not authenticated' }, { status: 401 });
  }

  try {
    const userId = session; // The session cookie contains the Firebase UID

    if (!userId) {
         return NextResponse.json({ success: false, message: 'Could not determine authenticated user from session' }, { status: 401 });
    }

    let totalEarnings = 0;
    let totalConversions = 0;

    // --- Fetching Total Conversions (Direct Referrals) & Affiliate Earnings ---
    const directReferralsRef = db.firestore().collection('users').where('referredBy', '==', userId);
    const directReferralsSnapshot = await directReferralsRef.get();
    
    totalConversions = directReferralsSnapshot.size;

    // In a real application, total earnings would be a sum of direct and indirect commissions.
    // For this summary, we will simplify and use the same logic as the main affiliates endpoint.
    // A more optimized approach would be to store a running total of affiliate earnings on the user document.

    let directCommission = 0;
    const directReferralIds = directReferralsSnapshot.docs.map(doc => doc.id);

    if (directReferralIds.length > 0) {
      for (const refId of directReferralIds) {
        const subsSnapshot = await db.firestore().collection('subscriptions')
          .where('userId', '==', refId)
          .where('status', '==', 'COMPLETED')
          .get();
        const totalSubscribedAmount = subsSnapshot.docs.reduce((sum, doc) => sum + (doc.data().amount || 0), 0);
        directCommission += totalSubscribedAmount * 0.10; // 10%
      }
    }
    
    // For simplicity, this summary does not calculate indirect commissions. 
    // The main affiliate page provides the full breakdown.
    totalEarnings = directCommission;

    return NextResponse.json({
      success: true,
      data: {
        totalEarnings: totalEarnings,
        totalConversions: totalConversions,
      },
    });

  } catch (error: any) {
    console.error('Error fetching affiliate summary:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch affiliate summary' }, { status: 500 });
  }
}
