import { NextResponse } from 'next/server';
import db from '@/lib/firebase-admin';
import * as admin from 'firebase-admin';

/**
 * Swapuzi B2C callback handler
 * Receives transaction status updates from Swapuzi
 */
export async function POST(request: Request) {
  try {
    const callbackData = await request.json();
    console.log('Swapuzi B2C Callback:', JSON.stringify(callbackData, null, 2));

    const { externalId, status, transactionId, amount, phoneNumber } = callbackData;
    
    if (!externalId) {
      console.error('Missing externalId in callback');
      return NextResponse.json({ success: false, message: 'Missing externalId' }, { status: 400 });
    }

    // Find payout by externalId
    const payoutsQuery = db.firestore()
      .collection('payouts')
      .where('externalId', '==', externalId);
    
    const querySnapshot = await payoutsQuery.get();

    if (querySnapshot.empty) {
      console.error(`No payout found for externalId: ${externalId}`);
      return NextResponse.json({ success: false, message: 'Payout not found' }, { status: 404 });
    }

    const payoutDoc = querySnapshot.docs[0];
    const payoutData = payoutDoc.data();
    
    // Determine final status
    let finalStatus: string;
    switch (status?.toLowerCase()) {
      case 'success':
      case 'completed':
        finalStatus = 'COMPLETED';
        break;
      case 'failed':
      case 'error':
        finalStatus = 'FAILED';
        break;
      default:
        finalStatus = 'PENDING';
    }

    // Update payout record
    const updateData: any = {
      status: finalStatus,
      callbackData: callbackData,
      updatedTimestamp: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (transactionId) {
      updateData.finalTransactionId = transactionId;
    }

    await payoutDoc.ref.update(updateData);

    // If successful, update submission statuses
    if (finalStatus === 'COMPLETED' && payoutData.submissionIds) {
      const batch = db.firestore().batch();
      
      payoutData.submissionIds.forEach((submissionId: string) => {
        const submissionRef = db.firestore().collection('submissions').doc(submissionId);
        batch.update(submissionRef, { payoutStatus: 'PAID' });
      });
      
      await batch.commit();
      console.log(`Updated ${payoutData.submissionIds.length} submissions to PAID status`);
    }

    return NextResponse.json({ success: true, message: 'Callback processed' });

  } catch (error: any) {
    console.error('Swapuzi callback error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}