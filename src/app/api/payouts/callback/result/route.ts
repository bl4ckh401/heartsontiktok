
import { NextResponse } from 'next/server';
import db from '@/lib/firebase-admin';

// This endpoint receives the final status of a B2C transaction from Safaricom
export async function POST(request: Request) {
  try {
    const callbackData = await request.json();
    console.log('M-Pesa B2C Result Callback Received:', JSON.stringify(callbackData, null, 2));

    const { Result } = callbackData;
    if (!Result) {
      throw new Error('Invalid callback data received');
    }

    const {
      OriginatorConversationID,
      ConversationID,
      ResultCode,
      ResultDesc,
      TransactionReceipt,
    } = Result;
    
    // Find the payout request in Firestore using the OriginatorConversationID
    const payoutsQuery = db.firestore().collection('payouts').where('safaricomOriginatorConversationID', '==', OriginatorConversationID);
    const querySnapshot = await payoutsQuery.get();

    if (querySnapshot.empty) {
      console.error(`No payout found for OriginatorConversationID: ${OriginatorConversationID}`);
      // Acknowledge receipt even if we can't find it to prevent Safaricom retries
      return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    const payoutDoc = querySnapshot.docs[0];
    const payoutId = payoutDoc.id;
    const payoutData = payoutDoc.data();

    const updateData: any = {
      safaricomResultCode: ResultCode,
      safaricomResultDesc: ResultDesc,
      safaricomConversationID: ConversationID,
      status: ResultCode === 0 ? 'COMPLETED' : 'FAILED',
      updatedTimestamp: new Date().toISOString(),
    };

    if (ResultCode === 0 && TransactionReceipt) {
        updateData.safaricomTransactionID = TransactionReceipt.TransactionID;
        updateData.transactionCompletedDateTime = TransactionReceipt.TransactionCompletedDateTime;
    }

    // Update the payout document
    await db.firestore().collection('payouts').doc(payoutId).update(updateData);

    // If successful, update the videos to 'PAID'
    if (ResultCode === 0 && payoutData.videoIds) {
        const batch = db.firestore().batch();
        payoutData.videoIds.forEach((videoId: string) => {
            const videoRef = db.firestore().collection('videos').doc(videoId);
            batch.update(videoRef, { payoutStatus: 'PAID' });
        });
        await batch.commit();
    }


    // Acknowledge receipt to Safaricom
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });

  } catch (error: any) {
    console.error('Error processing M-Pesa result callback:', error);
    // Even on error, we should tell Safaricom we received it to stop retries.
    // A more robust system might return a non-zero code to signal an issue.
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted but failed to process internally" });
  }
}
