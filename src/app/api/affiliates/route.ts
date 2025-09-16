
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/firebase-admin';

// Define commission rates
const DIRECT_COMMISSION_RATE = 0.30; // 30%
const INDIRECT_COMMISSION_RATE = 0.05; // 5%
const MAX_COMMISSION_LEVELS = 4; // Maximum 4 levels of commission

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;

  if (!session) {
    return NextResponse.json({ success: false, message: 'User not authenticated' }, { status: 401 });
  }

  try {
    const userId = session; // Firebase UID is the session value

    const appUrl = process.env.APP_URL || 'http://localhost:9002';
    // Use the Firebase UID as the referral code
    const referralLink = `${appUrl}/login?ref=${userId}`;

    // 1. Find Direct Referrals (Level 1)
    const directReferralsRef = db.firestore().collection('users').where('referredBy', '==', userId);
    const directReferralsSnapshot = await directReferralsRef.get();
    
    let allReferralsData: any[] = [];
    let totalAffiliateEarnings = 0;
    const indirectReferralIds: string[] = [];

    // 2. Process Direct Referrals and find their referrals (which are our Indirect Referrals - Level 2)
    if (!directReferralsSnapshot.empty) {
        for (const doc of directReferralsSnapshot.docs) {
            const affiliate = doc.data();
            const affiliateId = doc.id; // The user ID of the referred person (L1)

            // Find subscriptions from this direct affiliate
            const subsSnapshot = await db.firestore().collection('subscriptions')
                .where('userId', '==', affiliateId)
                .where('status', '==', 'COMPLETED')
                .get();
            
            let commissionFromThisAffiliate = 0;
            if (!subsSnapshot.empty) {
                const totalSubscribedAmount = subsSnapshot.docs.reduce((sum, subDoc) => sum + (subDoc.data().amount || 0), 0);
                commissionFromThisAffiliate = totalSubscribedAmount * DIRECT_COMMISSION_RATE;
            }
            
            totalAffiliateEarnings += commissionFromThisAffiliate;

            allReferralsData.push({
                id: affiliate.open_id,
                name: affiliate.displayName,
                avatar: affiliate.photoURL,
                joinDate: affiliate.createdAt?.toDate ? affiliate.createdAt.toDate().toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                status: 'Active', 
                commission: commissionFromThisAffiliate,
                level: 1,
            });

            // Find indirect referrals (L2) for this direct referral
            const indirectReferralsRef = db.firestore().collection('users').where('referredBy', '==', affiliateId);
            const indirectReferralsSnapshot = await indirectReferralsRef.get();
            indirectReferralsSnapshot.forEach(indirectDoc => indirectReferralIds.push(indirectDoc.id));
        }
    }

    // 3. Process Indirect Referrals
    if (indirectReferralIds.length > 0) {
       const uniqueIndirectIds = [...new Set(indirectReferralIds)]; // Ensure no duplicates
       
       for(const indirectId of uniqueIndirectIds) {
           const userDoc = await db.firestore().collection('users').doc(indirectId).get();
           if (!userDoc.exists) continue;

           const affiliate = userDoc.data()!;
           
           // Find subscriptions from this indirect affiliate
            const subsSnapshot = await db.firestore().collection('subscriptions')
                .where('userId', '==', indirectId)
                .where('status', '==', 'COMPLETED')
                .get();

           let commissionFromThisAffiliate = 0;
           if (!subsSnapshot.empty) {
               const totalSubscribedAmount = subsSnapshot.docs.reduce((sum, subDoc) => sum + (subDoc.data().amount || 0), 0);
               commissionFromThisAffiliate = totalSubscribedAmount * INDIRECT_COMMISSION_RATE;
           }

           totalAffiliateEarnings += commissionFromThisAffiliate;

           allReferralsData.push({
               id: affiliate.open_id,
               name: affiliate.displayName,
               avatar: affiliate.photoURL,
               joinDate: affiliate.createdAt?.toDate ? affiliate.createdAt.toDate().toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
               status: 'Active',
               commission: commissionFromThisAffiliate,
               level: 2,
           });
       }
    }

    return NextResponse.json({
      success: true,
      data: {
        referrals: allReferralsData.sort((a, b) => b.commission - a.commission), // Sort by commission
        totalReferrals: allReferralsData.length,
        totalAffiliateEarnings: totalAffiliateEarnings,
        referralLink: referralLink,
      },
    });

  } catch (error: any) {
    console.error('Error fetching affiliate data:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch affiliate data' }, { status: 500 });
  }
}
