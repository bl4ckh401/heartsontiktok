'use server';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/firebase-admin';
import { initiateB2CTransfer, getPayoutBalance } from '@/lib/swapuzi';
import * as admin from 'firebase-admin';

const DIRECT_COMMISSION_RATE = 0.30; // 30%
const INDIRECT_COMMISSION_RATE = 0.05; // 5%

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;

  if (!session) {
    return NextResponse.json({ success: false, message: 'User not authenticated' }, { status: 401 });
  }
  const userId = session;

  try {
    const { referralIds, phoneNumber } = await request.json();
    
    if (!referralIds || !Array.isArray(referralIds) || referralIds.length === 0 || !phoneNumber) {
      return NextResponse.json({ success: false, message: 'Missing referral IDs or phone number' }, { status: 400 });
    }

    let totalCalculatedAmount = 0;
    const eligibleReferrals: { id: string; commission: number; level: number }[] = [];
    
    // Process each selected referral
    for (const referralOpenId of referralIds) {
      // Find user by open_id
      const userQuery = await db.firestore().collection('users')
        .where('open_id', '==', referralOpenId)
        .limit(1)
        .get();
      
      if (userQuery.empty) continue;
      
      const userDoc = userQuery.docs[0];
      const referralUserId = userDoc.id;
      const referralData = userDoc.data();
      let commission = 0;
      let level = 0;
      
      // Find the level of this referral in relation to the current user
      const findReferralLevel = async (targetUserId: string, currentUserId: string, currentLevel: number = 0): Promise<number> => {
        if (currentLevel >= 4) return 0; // Max 4 levels
        
        const directReferrals = await db.firestore().collection('users')
          .where('referredBy', '==', currentUserId)
          .get();
        
        for (const doc of directReferrals.docs) {
          if (doc.id === targetUserId) {
            return currentLevel + 1;
          }
          
          const deeperLevel = await findReferralLevel(targetUserId, doc.id, currentLevel + 1);
          if (deeperLevel > 0) {
            return deeperLevel;
          }
        }
        
        return 0;
      };
      
      level = await findReferralLevel(referralUserId, userId);
      
      if (level > 0 && level <= 4) {
        const subsSnapshot = await db.firestore().collection('subscriptions')
          .where('userId', '==', referralUserId)
          .where('status', '==', 'COMPLETED')
          .get();
        
        if (!subsSnapshot.empty) {
          const totalSubscribedAmount = subsSnapshot.docs.reduce((sum, subDoc) => sum + (subDoc.data().amount || 0), 0);
          const rate = level === 1 ? DIRECT_COMMISSION_RATE : INDIRECT_COMMISSION_RATE;
          commission = totalSubscribedAmount * rate;
        }
      }
      
      if (commission > 0) {
        totalCalculatedAmount += commission;
        eligibleReferrals.push({ id: referralOpenId, commission, level });
      }
    }

    if (totalCalculatedAmount <= 0) {
      return NextResponse.json({ success: false, message: 'No commission available for selected referrals.' }, { status: 400 });
    }
    
    const finalAmount = Math.floor(totalCalculatedAmount);
    if (finalAmount < 10) {
      return NextResponse.json({ success: false, message: `Total payout amount (KES ${finalAmount}) is below the minimum required (KES 10).` }, { status: 400 });
    }

    // Check balance before initiating payout
    const balance = await getPayoutBalance();
    if (balance.balance < finalAmount) {
      return NextResponse.json({ 
        success: false, 
        message: `Insufficient balance. Available: KES ${balance.balance}, Required: KES ${finalAmount}` 
      }, { status: 400 });
    }

    const externalId = `affiliate_payout_${Date.now()}_${userId.slice(-6)}`;
    const callbackUrl = `${process.env.APP_URL}/api/payouts/callback/swapuzi`;
    
    const result = await initiateB2CTransfer(finalAmount, phoneNumber, externalId, callbackUrl);
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to initiate payout');
    }

    // Store payout record
    const payoutRef = db.firestore().collection('affiliate_payouts').doc();
    await payoutRef.set({
      payoutId: payoutRef.id,
      userId: userId,
      amount: finalAmount,
      phoneNumber: phoneNumber,
      referralIds: eligibleReferrals.map(r => r.id),
      referralCommissions: eligibleReferrals,
      status: 'PENDING',
      externalId: externalId,
      swapuziTransactionId: result.transactionId,
      requestTimestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, message: 'Affiliate payout initiated successfully.', data: result });

  } catch (error: any) {
    console.error('Error processing affiliate payout request:', error);
    const errorMessage = error.response?.data?.errorMessage || error.message || 'An unexpected error occurred.';
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}