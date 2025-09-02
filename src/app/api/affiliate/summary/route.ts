
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
    // The session cookie contains the Firebase UID, which is tiktok:<open_id>
    // We can extract the open_id from it.
    const userId = session.replace('tiktok:', '');

    if (!userId) {
         return NextResponse.json({ success: false, message: 'Could not determine authenticated user from session' }, { status: 401 });
    }

    let totalEarnings = 0;
    let totalConversions = 0;

    // --- Fetching Total Conversions & Earnings ---
    // Query the 'submissions' collection where the userId matches.
    const submissionsRef = db.firestore().collection('submissions').where('userId', '==', userId).where('status', '==', 'PUBLISHED');
    const submissionsSnapshot = await submissionsRef.get();
    
    totalConversions = submissionsSnapshot.size;

    // In a real application, earnings calculation would depend on your payout model.
    // For now, we'll simulate a simple earning per published video.
    // This should match the logic used elsewhere (e.g., payouts page) for consistency.
    const PAYOUT_RATE_PER_SUBMISSION = 500; // Example: KES 500 per published video.
    totalEarnings = totalConversions * PAYOUT_RATE_PER_SUBMISSION; 

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
