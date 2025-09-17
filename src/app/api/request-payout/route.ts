
'use server';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/firebase-admin';
import { initiateB2CTransfer, getPayoutBalance } from '@/lib/swapuzi';
import * as admin from 'firebase-admin';
import { PLAN_CONFIG, PlanType } from '@/lib/plan-config';

// This function will be triggered when a user requests a payout.
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;

  if (!session) {
    return NextResponse.json({ success: false, message: 'User not authenticated' }, { status: 401 });
  }
  const userId = session;

  try {
    const { videoIds, phoneNumber } = await request.json();
    
    if (!videoIds || !Array.isArray(videoIds) || videoIds.length === 0 || !phoneNumber) {
      return NextResponse.json({ success: false, message: 'Missing video IDs or phone number' }, { status: 400 });
    }

    const userRef = db.firestore().collection('users').doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
        return NextResponse.json({ success: false, message: 'User profile not found.' }, { status: 404 });
    }

    const userData = userDoc.data();
    const plan = userData?.subscriptionPlan as PlanType;

    if (!plan || !PLAN_CONFIG[plan]) {
        return NextResponse.json({ success: false, message: 'User has no valid subscription plan for payouts.' }, { status: 403 });
    }

    const payoutRate = PLAN_CONFIG[plan].payoutRatePer1000Likes;
    
    let totalCalculatedAmount = 0;
    const eligibleSubmissions: { id: string; payout: number; newLikeCount: number, campaignId: string }[] = [];
    
    const submissionsRef = db.firestore().collection('submissions')
        .where('userId', '==', userId)
        .where('tiktokVideoId', 'in', videoIds);
    const submissionsSnapshot = await submissionsRef.get();

    if (submissionsSnapshot.empty) {
        return NextResponse.json({ success: false, message: 'No matching video submissions found for this user.' }, { status: 404 });
    }

    for (const doc of submissionsSnapshot.docs) {
        const submission = doc.data();
        
        if (submission.payoutStatus !== 'ELIGIBLE') {
            console.warn(`Attempt to payout for non-eligible video ${submission.tiktokVideoId}. Status: ${submission.payoutStatus}. Skipping.`);
            continue;
        }

        const currentLikeCount = submission.like_count || 0;
        const lastPaidLikeCount = submission.lastPaidLikeCount || 0;
        
        if (currentLikeCount <= lastPaidLikeCount) {
            continue; // No new likes to pay out
        }

        const newLikes = currentLikeCount - lastPaidLikeCount;
        const payoutAmount = (newLikes / 1000) * payoutRate;
        
        if (payoutAmount > 0) {
            totalCalculatedAmount += payoutAmount;
            eligibleSubmissions.push({ 
                id: doc.id, 
                payout: payoutAmount, 
                newLikeCount: currentLikeCount,
                campaignId: submission.campaignId,
            });
        }
    }

    if (totalCalculatedAmount <= 0) {
        return NextResponse.json({ success: false, message: 'No new likes to payout or amount is zero.' }, { status: 400 });
    }
    
    const finalAmount = Math.floor(totalCalculatedAmount);
    if (finalAmount < 1) {
        return NextResponse.json({ success: false, message: `Total payout amount (KES ${finalAmount}) is below the minimum required (KES 10).` }, { status: 400 });
    }
    
    // Check daily payout limit
    const maxDailyPayout = PLAN_CONFIG[plan].maxDailyPayout;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Get today's payouts (both video and affiliate)
    const [videoPayoutsToday, affiliatePayoutsToday] = await Promise.all([
        db.firestore().collection('payouts')
            .where('userId', '==', userId)
            .where('status', '==', 'COMPLETED')
            .where('requestTimestamp', '>=', today)
            .where('requestTimestamp', '<', tomorrow)
            .get(),
        db.firestore().collection('affiliate_payouts')
            .where('userId', '==', userId)
            .where('status', '==', 'COMPLETED')
            .where('requestTimestamp', '>=', today)
            .where('requestTimestamp', '<', tomorrow)
            .get()
    ]);
    
    const todaysTotalPayouts = [
        ...videoPayoutsToday.docs.map(doc => doc.data().amount || 0),
        ...affiliatePayoutsToday.docs.map(doc => doc.data().amount || 0)
    ].reduce((sum, amount) => sum + amount, 0);
    
    if (todaysTotalPayouts + finalAmount > maxDailyPayout) {
        return NextResponse.json({ 
            success: false, 
            message: `Daily payout limit exceeded. Limit: KES ${maxDailyPayout}, Used today: KES ${todaysTotalPayouts}, Requested: KES ${finalAmount}` 
        }, { status: 400 });
    }

    // --- Campaign Budget Check ---
    const campaignId = eligibleSubmissions[0]?.campaignId;
    if (!campaignId) {
        return NextResponse.json({ success: false, message: 'Could not determine campaign for payout.' }, { status: 400 });
    }
    const campaignRef = db.firestore().collection('campaigns').doc(campaignId);
    const campaignDoc = await campaignRef.get();
    if (!campaignDoc.exists || (campaignDoc.data()?.budget || 0) < finalAmount) {
         return NextResponse.json({ success: false, message: 'Campaign budget is insufficient to cover this payout.' }, { status: 400 });
    }

    // Check balance before initiating payout
    const balance = await getPayoutBalance();
    if (balance.balance < finalAmount) {
      return NextResponse.json({ 
        success: false, 
        message: `Insufficient balance. Available: KES ${balance.balance}, Required: KES ${finalAmount}` 
      }, { status: 400 });
    }

    const externalId = `payout_${Date.now()}_${userId.slice(-6)}`;
    const callbackUrl = `${process.env.APP_URL}/api/payouts/callback/swapuzi`;
    
    const result = await initiateB2CTransfer(finalAmount, phoneNumber, externalId, callbackUrl);
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to initiate payout');
    }

    const payoutRef = db.firestore().collection('payouts').doc();
    await payoutRef.set({
      payoutId: payoutRef.id,
      userId: userId,
      amount: finalAmount,
      phoneNumber: phoneNumber,
      submissionIds: eligibleSubmissions.map(s => s.id),
      status: 'PENDING',
      externalId: externalId,
      swapuziTransactionId: result.transactionId,
      requestTimestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    const batch = db.firestore().batch();
    eligibleSubmissions.forEach(sub => {
        const submissionDocRef = db.firestore().collection('submissions').doc(sub.id);
        batch.update(submissionDocRef, { 
            payoutStatus: 'PENDING', 
            payoutId: payoutRef.id,
            lastPaidLikeCount: sub.newLikeCount // IMPORTANT: Update the last paid count
        });
    });

    // Atomically decrement campaign budget
    batch.update(campaignRef, { budget: admin.firestore.FieldValue.increment(-finalAmount) });

    await batch.commit();

    return NextResponse.json({ success: true, message: 'Payout initiated successfully.', data: result });

  } catch (error: any) {
    console.error('Error processing payout request:', error);
    const errorMessage = error.response?.data?.errorMessage || error.message || 'An unexpected error occurred.';
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
