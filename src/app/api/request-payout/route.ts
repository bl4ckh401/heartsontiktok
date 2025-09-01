
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/firebase-admin';
import { getMpesaToken, initiateB2CPayout } from '@/lib/mpesa';

// This function will be triggered when a user requests a payout.
export async function POST(request: Request) {
  const cookieStore = cookies();
  const userInfoCookie = cookieStore.get('user_info')?.value;

  if (!userInfoCookie) {
    return NextResponse.json({ success: false, message: 'User not authenticated' }, { status: 401 });
  }

  try {
    const { videoIds, phoneNumber, amount } = await request.json();
    const userInfo = JSON.parse(userInfoCookie);
    const userId = userInfo.open_id;

    if (!videoIds || !Array.isArray(videoIds) || videoIds.length === 0 || !phoneNumber || !amount) {
      return NextResponse.json({ success: false, message: 'Missing video IDs, phone number, or amount' }, { status: 400 });
    }

    // 1. Verify video eligibility and calculate final amount from backend to prevent tampering
    // This is a crucial security step. The frontend amount is for display; recalculate it here.
    let calculatedAmount = 0;
    const videoDocs = await db.firestore().collection('videos').where(admin.firestore.FieldPath.documentId(), 'in', videoIds).get();

    for (const doc of videoDocs.docs) {
        const video = doc.data();
        if (video.userId !== userId || video.payoutStatus === 'PAID') {
            // Skip videos that don't belong to the user or are already paid out
            continue;
        }
        // Replace with your actual payout calculation logic (e.g., based on views/likes)
        calculatedAmount += (video.view_count || 0) * 0.01; 
    }

    if (calculatedAmount <= 0) {
        return NextResponse.json({ success: false, message: 'No eligible videos for payout or amount is zero.' }, { status: 400 });
    }
    
    // Use the securely calculated amount
    const finalAmount = Math.floor(calculatedAmount); // M-Pesa only accepts integers

    // 2. Get M-Pesa Auth Token
    const accessToken = await getMpesaToken();

    // 3. Initiate B2C Payout
    const remarks = `Payout for ${videoIds.length} videos.`;
    const result = await initiateB2CPayout(accessToken, finalAmount, phoneNumber, remarks);

    // 4. Log the payout request in Firestore for tracking
    const payoutRef = db.firestore().collection('payouts').doc();
    await payoutRef.set({
      payoutId: payoutRef.id,
      userId: userId,
      amount: finalAmount,
      phoneNumber: phoneNumber,
      videoIds: videoIds,
      status: 'PENDING', // Initial status
      safaricomConversationID: result.ConversationID,
      safaricomOriginatorConversationID: result.OriginatorConversationID,
      requestTimestamp: new Date().toISOString(),
    });
    
    // 5. Update the videos to mark them as pending payout
    const batch = db.firestore().batch();
    videoIds.forEach((videoId: string) => {
        const videoRef = db.firestore().collection('videos').doc(videoId);
        batch.update(videoRef, { payoutStatus: 'PENDING', payoutId: payoutRef.id });
    });
    await batch.commit();

    return NextResponse.json({ success: true, message: 'Payout initiated successfully.', data: result });

  } catch (error: any) {
    console.error('Error processing payout request:', error);
    // Differentiate between our errors and Safaricom's
    const errorMessage = error.response?.data?.errorMessage || error.message || 'An unexpected error occurred.';
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
