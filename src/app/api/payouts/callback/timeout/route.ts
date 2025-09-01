
import { NextResponse } from 'next/server';
import db from '@/lib/firebase-admin';

// This endpoint receives timeout notifications for B2C transactions
export async function POST(request: Request) {
  try {
    const callbackData = await request.json();
    console.log('M-Pesa B2C Queue Timeout Callback Received:', JSON.stringify(callbackData, null, 2));

    const { OriginatorConversationID, ConversationID, ResultCode, ResultDesc } = callbackData.Result;

    if (!OriginatorConversationID) {
      console.error('Timeout callback missing OriginatorConversationID.');
      return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    // Find the payout request and mark it as timed out or failed
    const payoutsQuery = db.firestore().collection('payouts').where('safaricomOriginatorConversationID', '==', OriginatorConversationID);
    const querySnapshot = await payoutsQuery.get();

    if (!querySnapshot.empty) {
      const payoutDoc = querySnapshot.docs[0];
      await db.firestore().collection('payouts').doc(payoutDoc.id).update({
        status: 'TIMED_OUT',
        safaricomResultCode: ResultCode,
        safaricomResultDesc: ResultDesc || 'The transaction timed out.',
        updatedTimestamp: new Date().toISOString(),
      });
    } else {
        console.warn(`Received a timeout for an unknown OriginatorConversationID: ${OriginatorConversationID}`);
    }
    
    // Acknowledge receipt to Safaricom
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (error: any) {
    console.error('Error processing M-Pesa timeout callback:', error);
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted but failed to process internally" });
  }
}
