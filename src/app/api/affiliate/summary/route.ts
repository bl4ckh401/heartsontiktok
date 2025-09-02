
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/firebase-admin';

// Define commission rates
const DIRECT_COMMISSION_RATE = 0.10; // 10%
const INDIRECT_COMMISSION_RATE = 0.02; // 2%

export async function GET(request: Request) {
  const cookieStore = await cookies();
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
    const indirectReferralIds: string[] = [];

    // --- Fetching Total Conversions (Direct Referrals) & Direct Affiliate Earnings ---
    const directReferralsRef = db.firestore().collection('users').where('referredBy', '==', userId);
    const directReferralsSnapshot = await directReferralsRef.get();
    
    totalConversions = directReferralsSnapshot.size;

    if (!directReferralsSnapshot.empty) {
        for (const doc of directReferralsSnapshot.docs) {
            const affiliateId = doc.id;
            const subsSnapshot = await db.firestore().collection('subscriptions')
              .where('userId', '==', affiliateId)
              .where('status', '==', 'COMPLETED')
              .get();
            const totalSubscribedAmount = subsSnapshot.docs.reduce((sum, doc) => sum + (doc.data().amount || 0), 0);
            totalEarnings += totalSubscribedAmount * DIRECT_COMMISSION_RATE;

            // Find indirect referrals for this direct referral
            const indirectReferralsRef = db.firestore().collection('users').where('referredBy', '==', affiliateId);
            const indirectReferralsSnapshot = await indirectReferralsRef.get();
            indirectReferralsSnapshot.forEach(indirectDoc => indirectReferralIds.push(indirectDoc.id));
        }
    }
    
    // --- Fetching Indirect Affiliate Earnings ---
    if (indirectReferralIds.length > 0) {
        const uniqueIndirectIds = [...new Set(indirectReferralIds)];
        for(const indirectId of uniqueIndirectIds) {
            const subsSnapshot = await db.firestore().collection('subscriptions')
                .where('userId', '==', indirectId)
                .where('status', '==', 'COMPLETED')
                .get();
            const totalSubscribedAmount = subsSnapshot.docs.reduce((sum, doc) => sum + (doc.data().amount || 0), 0);
            totalEarnings += totalSubscribedAmount * INDIRECT_COMMISSION_RATE;
        }
        totalConversions += uniqueIndirectIds.length;
    }


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
