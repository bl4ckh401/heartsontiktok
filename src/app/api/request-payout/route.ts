
'use server';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/firebase-admin';
import { getMpesaToken, initiateB2CPayout } from '@/lib/mpesa';
import * as admin from 'firebase-admin';

// Define payout rates per 1000 likes for each plan
const PAYOUT_RATES_PER_1000_LIKES = {
  Gold: 15,
  Platinum: 35,
  Diamond: 50,
};

// This function will be triggered when a user requests a payout.
export async function POST(request: Request) {
  const cookieStore = cookies();
  const session = cookieStore.get('session')?.value;

  if (!session) {
    return NextResponse.json({ success: false, message: 'User not authenticated' }, { status: 401 });
  }
  const userId = session; // The Firebase UID is in the session cookie

  try {
    const { videoIds, phoneNumber } = await request.json();
    
    if (!videoIds || !Array.isArray(videoIds) || videoIds.length === 0 || !phoneNumber) {
      return NextResponse.json({ success: false, message: 'Missing video IDs or phone number' }, { status: 400 });
    }

    // --- Secure Backend Calculation and Validation ---
    const userRef = db.firestore().collection('users').doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
        return NextResponse.json({ success: false, message: 'User profile not found.' }, { status: 404 });
    }

    const userData = userDoc.data();
    const plan = userData?.subscriptionPlan as keyof typeof PAYOUT_RATES_PER_1000_LIKES;

    if (!plan || !PAYOUT_RATES_PER_1000_LIKES[plan]) {
        return NextResponse.json({ success: false, message: 'User has no valid subscription plan for payouts.' }, { status: 403 });
    }

    const payoutRate = PAYOUT_RATES_PER_1000_LIKES[plan];
    
    let calculatedAmount = 0;
    const eligibleSubmissionIds: string[] = [];
    
    // Fetch submissions from Firestore to check their status and view count from our source of truth.
    const submissionsRef = db.firestore().collection('submissions').where('userId', '==', userId).where('tiktokVideoId', 'in', videoIds);
    const submissionsSnapshot = await submissionsRef.get();

    if (submissionsSnapshot.empty) {
        return NextResponse.json({ success: false, message: 'No matching video submissions found for this user.' }, { status: 404 });
    }

    for (const doc of submissionsSnapshot.docs) {
        const submission = doc.data();
        
        if (submission.payoutStatus !== 'ELIGIBLE') {
            console.warn(`Attempt to payout already processed or ineligible video ${submission.tiktokVideoId}. Skipping.`);
            continue;
        }

        const likeCount = submission.like_count || 0;
        calculatedAmount += (likeCount / 1000) * payoutRate;
        eligibleSubmissionIds.push(doc.id); // Use the Firestore document ID for tracking
    }


    if (calculatedAmount <= 0) {
        return NextResponse.json({ success: false, message: 'No eligible videos for payout or amount is zero.' }, { status: 400 });
    }
    
    const finalAmount = Math.floor(calculatedAmount); // M-Pesa only accepts integers
    if (finalAmount < 10) { // M-Pesa has a minimum B2C amount
        return NextResponse.json({ success: false, message: `Payout amount (KES ${finalAmount}) is below the minimum required (KES 10).` }, { status: 400 });
    }


    // Get M-Pesa Auth Token
    const accessToken = await getMpesaToken();

    // Initiate B2C Payout
    const remarks = `VeriFlow payout for ${eligibleSubmissionIds.length} videos.`;
    const result = await initiateB2CPayout(accessToken, finalAmount, phoneNumber, remarks);
    
    if (result.ResponseCode !== '0') {
      throw new Error(result.ResponseDescription || 'Failed to initiate M-Pesa payout request.');
    }


    // Log the payout request in Firestore for tracking
    const payoutRef = db.firestore().collection('payouts').doc();
    await payoutRef.set({
      payoutId: payoutRef.id,
      userId: userId,
      amount: finalAmount,
      phoneNumber: phoneNumber,
      submissionIds: eligibleSubmissionIds,
      status: 'PENDING_CONFIRMATION',
      safaricomConversationID: result.ConversationID,
      safaricomOriginatorConversationID: result.OriginatorConversationID,
      requestTimestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    // Update the video submissions to mark them as pending payout to prevent double-payout
    const batch = db.firestore().batch();
    eligibleSubmissionIds.forEach((submissionId: string) => {
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
