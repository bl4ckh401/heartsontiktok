
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/firebase-admin';

export async function GET(request: Request) {
  const cookieStore = cookies();
  const userInfoCookie = cookieStore.get('user_info')?.value;

  if (!userInfoCookie) {
    return NextResponse.json({ success: false, message: 'User not authenticated' }, { status: 401 });
  }

  try {
    const userInfo = JSON.parse(userInfoCookie);
    const userId = userInfo.open_id;

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Could not determine authenticated user' }, { status: 401 });
    }

    const appUrl = process.env.APP_URL || 'http://localhost:9002';
    const referralLink = `${appUrl}/login?ref=${userId}`;

    // 1. Fetch users who were referred by the current user
    const referralsRef = db.firestore().collection('users').where('referredBy', '==', userId);
    const referralsSnapshot = await referralsRef.get();

    if (referralsSnapshot.empty) {
      return NextResponse.json({
        success: true,
        data: {
          referrals: [],
          totalReferrals: 0,
          totalAffiliateEarnings: 0,
          referralLink: referralLink,
        },
      });
    }
    
    // 2. For each referral, calculate their earnings and the affiliate's commission
    const referralsData = await Promise.all(referralsSnapshot.docs.map(async (doc) => {
      const affiliate = doc.data();
      const affiliateId = doc.id; // The user ID of the referred person

      // 3. Find submissions from this affiliate
      const submissionsRef = db.firestore().collection('submissions').where('userId', '==', affiliateId).where('status', '==', 'PUBLISHED');
      const submissionsSnapshot = await submissionsRef.get();
      
      let affiliateTotalEarnings = 0;
      if (!submissionsSnapshot.empty) {
          // In a real app, earnings logic would be more complex, potentially looking up campaign payout rates.
          // For now, we simulate a simple earning per published video.
          affiliateTotalEarnings = submissionsSnapshot.size * 500; // e.g., Affiliate earns KES 500 per video
      }
      
      // Calculate the 2% commission for the referrer
      const referrerCommission = affiliateTotalEarnings * 0.02;

      return {
        id: affiliate.open_id,
        name: affiliate.displayName,
        avatar: affiliate.photoURL,
        joinDate: affiliate.createdAt?.toDate().toISOString().split('T')[0] || new Date().toISOString().split('T')[0], // format as YYYY-MM-DD
        status: 'Active', // This could be enhanced with more logic
        earnings: referrerCommission,
      };
    }));

    const totalAffiliateEarnings = referralsData.reduce((sum, r) => sum + r.earnings, 0);

    return NextResponse.json({
      success: true,
      data: {
        referrals: referralsData,
        totalReferrals: referralsData.length,
        totalAffiliateEarnings: totalAffiliateEarnings,
        referralLink: referralLink,
      },
    });

  } catch (error: any) {
    console.error('Error fetching affiliate data:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch affiliate data' }, { status: 500 });
  }
}
