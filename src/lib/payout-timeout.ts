import admin from './firebase-admin';

const adminDb = admin.firestore();

export async function checkAndUpdateTimeoutPayouts() {
  try {
    const timeoutThreshold = new Date(Date.now() - 10 * 60 * 1000); // 10 minutes ago
    
    // Check video payouts
    const videoPayoutsQuery = adminDb.collection('payouts')
      .where('status', '==', 'PENDING')
      .where('requestTimestamp', '<', timeoutThreshold);
    
    const videoPayouts = await videoPayoutsQuery.get();
    
    // Check affiliate payouts
    const affiliatePayoutsQuery = adminDb.collection('affiliate_payouts')
      .where('status', '==', 'PENDING')
      .where('requestTimestamp', '<', timeoutThreshold);
    
    const affiliatePayouts = await affiliatePayoutsQuery.get();
    
    const batch = adminDb.batch();
    
    // Update timed out video payouts
    videoPayouts.docs.forEach(doc => {
      batch.update(doc.ref, {
        status: 'FAILED',
        failureReason: 'TIMEOUT',
        updatedTimestamp: admin.firestore.FieldValue.serverTimestamp()
      });
    });
    
    // Update timed out affiliate payouts
    affiliatePayouts.docs.forEach(doc => {
      batch.update(doc.ref, {
        status: 'FAILED',
        failureReason: 'TIMEOUT',
        updatedTimestamp: admin.firestore.FieldValue.serverTimestamp()
      });
    });
    
    if (videoPayouts.size > 0 || affiliatePayouts.size > 0) {
      await batch.commit();
      console.log(`Updated ${videoPayouts.size + affiliatePayouts.size} timed out payouts to FAILED`);
    }
    
  } catch (error) {
    console.error('Error checking timeout payouts:', error);
  }
}