
import { NextResponse } from 'next/server';
import db from '@/lib/firebase-admin';

// This endpoint receives the final status of a C2B STK Push transaction from Safaricom
export async function POST(request: Request) {
  try {
    const callbackData = await request.json();
    console.log('M-Pesa STK Push Callback Received:', JSON.stringify(callbackData, null, 2));

    const { Body } = callbackData;
    if (!Body || !Body.stkCallback) {
      throw new Error('Invalid callback data received');
    }
    
    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = Body.stkCallback;

    // Find the subscription request in Firestore using the CheckoutRequestID
    const subscriptionsQuery = db.firestore().collection('subscriptions').where('mpesaCheckoutRequestID', '==', CheckoutRequestID);
    const querySnapshot = await subscriptionsQuery.get();

    if (querySnapshot.empty) {
      console.error(`No subscription found for CheckoutRequestID: ${CheckoutRequestID}`);
      // Acknowledge receipt to prevent Safaricom retries
      return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    const subscriptionDoc = querySnapshot.docs[0];
    const subscriptionId = subscriptionDoc.id;
    const subscriptionData = subscriptionDoc.data();

    // Prepare update data
    const updateData: any = {
      mpesaResultCode: ResultCode,
      mpesaResultDesc: ResultDesc,
      status: ResultCode === 0 ? 'COMPLETED' : 'FAILED',
      updatedTimestamp: new Date().toISOString(),
    };

    if (ResultCode === 0 && CallbackMetadata) {
        // Extract payment details from the callback metadata
        const metadataItems = CallbackMetadata.Item.reduce((acc: any, item: any) => {
            acc[item.Name] = item.Value;
            return acc;
        }, {});

        updateData.mpesaReceiptNumber = metadataItems.MpesaReceiptNumber;
        updateData.transactionDate = metadataItems.TransactionDate;
        // You can add more fields like Amount, PhoneNumber etc. if needed for the record
    }

    // Update the subscription document
    await db.firestore().collection('subscriptions').doc(subscriptionId).update(updateData);

    // If payment was successful, update the user's main profile
    if (ResultCode === 0) {
        const userRef = db.firestore().collection('users').doc(subscriptionData.userId);
        await userRef.update({
            subscriptionPlan: subscriptionData.plan,
            subscriptionStatus: 'ACTIVE',
            subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Example: 30-day subscription
        });
    }

    // Acknowledge receipt to Safaricom
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });

  } catch (error: any) {
    console.error('Error processing M-Pesa STK Push callback:', error);
    // Even on error, we should tell Safaricom we received it to stop retries.
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted but failed to process internally" });
  }
}
