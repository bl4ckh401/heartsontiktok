
'use server';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/firebase-admin';
import { getMpesaToken, initiateSTKPush } from '@/lib/mpesa';
import * as admin from 'firebase-admin';

// Define plan details to prevent tampering from the client-side
const PLANS = {
  Gold: { name: 'Gold', amount: 1 },
  Platinum: { name: 'Platinum', amount: 2 },
  Diamond: { name: 'Diamond', amount: 3 },
};

export async function POST(request: Request) {
  const cookieStore = cookies();
  const userInfoCookie = (await cookieStore).get('user_info')?.value;

  if (!userInfoCookie) {
    return NextResponse.json({ success: false, message: 'User not authenticated' }, { status: 401 });
  }

  try {
    const { plan, phoneNumber } = await request.json();
    const userInfo = JSON.parse(userInfoCookie);
    const userId = userInfo.open_id;

    if (!plan || !PLANS[plan as keyof typeof PLANS]) {
      return NextResponse.json({ success: false, message: 'Invalid subscription plan selected.' }, { status: 400 });
    }

    if (!phoneNumber || !phoneNumber.match(/^(254)\d{9}$/)) {
        return NextResponse.json({ success: false, message: 'Invalid phone number. Please use the format 254XXXXXXXXX.' }, { status: 400 });
    }

    const selectedPlan = PLANS[plan as keyof typeof PLANS];
    const amount = selectedPlan.amount;

    // 1. Get M-Pesa Auth Token
    const accessToken = await getMpesaToken();

    // 2. Initiate STK Push
    const accountRef = `SUB-${userId.substring(0, 10)}`; // Create a unique reference
    const transactionDesc = `Subscription to ${selectedPlan.name} Plan for hearts on tiktok`;
    const stkResult = await initiateSTKPush(accessToken, phoneNumber, amount, accountRef, transactionDesc);
    
    if (stkResult.ResponseCode !== '0') {
        throw new Error(stkResult.ResponseDescription || 'Failed to initiate STK push.');
    }

    // 3. Log the subscription attempt in Firestore for tracking
    const subscriptionRef = db.firestore().collection('subscriptions').doc();
    await subscriptionRef.set({
      subscriptionId: subscriptionRef.id,
      userId: userId,
      plan: selectedPlan.name,
      amount: amount,
      phoneNumber: phoneNumber,
      status: 'PENDING_PAYMENT',
      mpesaMerchantRequestID: stkResult.MerchantRequestID,
      mpesaCheckoutRequestID: stkResult.CheckoutRequestID,
      requestTimestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ 
        success: true, 
        message: 'Subscription initiated successfully. Please check your phone to complete the payment.', 
        data: {
            merchantRequestID: stkResult.MerchantRequestID,
            checkoutRequestID: stkResult.CheckoutRequestID
        } 
    });

  } catch (error: any) {
    console.error('Error processing subscription request:', error);
    const errorMessage = error.response?.data?.errorMessage || error.message || 'An unexpected error occurred.';
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
