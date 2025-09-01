
'use server';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/firebase-admin';
import { getMpesaToken, initiateB2CPayout } from '@/lib/mpesa';
import * as admin from 'firebase-admin';

// This function will be triggered when a user requests a payout.
export async function POST(request: Request) {
  const cookieStore = cookies();
  const userInfoCookie = cookieStore.get('user_info')?.value;

  if (!userInfoCookie) {
    return NextResponse.json({ success: false, message: 'User not authenticated' }, { status: 401 });
  }

  try {
    const { videoIds, phoneNumber } = await request.json();
    const userInfo = JSON.parse(userInfoCookie);
    const userId = userInfo.open_id;

    if (!videoIds || !Array.isArray(videoIds) || videoIds.length === 0 || !phoneNumber) {
      return NextResponse.json({ success: false, message: 'Missing video IDs or phone number' }, { status: 400 });
    }

    // --- Secure Backend Calculation and Validation ---
    // 1. Verify video eligibility and calculate final amount from backend to prevent tampering.
    // This is a crucial security step.
    let calculatedAmount = 0;
    const eligibleVideoIdsToPayout: string[] = [];
    const PAYOUT_RATE_PER_1000_VIEWS = 10; // KES 10 per 1000 views. MUST match client for estimates.
    
    // Fetch submissions from Firestore to check their status and view count from our source of truth.
    const submissionsRef = db.firestore().collection('submissions').where('userId', '==', userId).where('tiktokVideoId', 'in', videoIds);
    const submissionsSnapshot = await submissionsRef.get();

    if (submissionsSnapshot.empty) {
        return NextResponse.json({ success: false, message: 'No matching video submissions found for this user.' }, { status: 404 });
    }

    for (const doc of submissionsSnapshot.docs) {
        const submission = doc.data();
        
        // CRITICAL: Check if video is actually eligible for payout.
        // It must not be in 'PENDING' or 'PAID' status.
        if (submission.payoutStatus === 'PENDING' || submission.payoutStatus === 'PAID') {
            console.warn(`Attempt to payout already processed video ${submission.tiktokVideoId}. Skipping.`);
            continue;
        }

        // Use the view_count from the submission record in Firestore, which should be updated periodically.
        const viewCount = submission.view_count || 0;
        calculatedAmount += (viewCount / 1000) * PAYOUT_RATE_PER_1000_VIEWS;
        eligibleVideoIdsToPayout.push(doc.id); // Use the Firestore document ID
    }


    if (calculatedAmount <= 0) {
        return NextResponse.json({ success: false, message: 'No eligible videos for payout or amount is zero.' }, { status: 400 });
    }
    
    const finalAmount = Math.floor(calculatedAmount); // M-Pesa only accepts integers
    if (finalAmount < 10) { // M-Pesa has a minimum B2C amount
        return NextResponse.json({ success: false, message: 'Payout amount is below the minimum required (KES 10).' }, { status: 400 });
    }


    // 2. Get M-Pesa Auth Token
    const accessToken = await getMpesaToken();

    // 3. Initiate B2C Payout
    const remarks = `Creator payout for ${eligibleVideoIdsToPayout.length} videos.`;
    const result = await initiateB2CPayout(accessToken, finalAmount, phoneNumber, remarks);

    // 4. Log the payout request in Firestore for tracking
    const payoutRef = db.firestore().collection('payouts').doc();
    await payoutRef.set({
      payoutId: payoutRef.id,
      userId: userId,
      amount: finalAmount,
      phoneNumber: phoneNumber,
      submissionIds: eligibleVideoIdsToPayout, // Store Firestore submission IDs
      status: 'PENDING_CONFIRMATION', // Status indicating we are waiting for Safaricom's callback
      safaricomConversationID: result.ConversationID,
      safaricomOriginatorConversationID: result.OriginatorConversationID,
      requestTimestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    // 5. Update the video submissions to mark them as pending payout to prevent double-payout
    const batch = db.firestore().batch();
    eligibleVideoIdsToPayout.forEach((submissionId: string) => {
        const submissionDocRef = db.firestore().collection('submissions').doc(submissionId);
        batch.update(submissionDocRef, { payoutStatus: 'PENDING', payoutId: payoutRef.id });
    });
    await batch.commit();

    return NextResponse.json({ success: true, message: 'Payout initiated successfully.', data: result });

  } catch (error: any) {
    console.error('Error processing payout request:', error);
    const errorMessage = error.response?.data?.errorMessage || error.message || 'An unexpected error occurred.';
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
