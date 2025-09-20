import { NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';
import { checkAdminRole } from '@/lib/auth-middleware';

const adminDb = admin.firestore();

export async function GET(request: NextRequest) {
  // Check if user is admin
  const adminCheck = await checkAdminRole(request);
  if (adminCheck) return adminCheck;

  try {
    // Get all transactions from multiple collections
    const [subscriptionsSnapshot, payoutsSnapshot, affiliatePayoutsSnapshot] = await Promise.all([
      adminDb.collection('subscriptions').orderBy('createdAt', 'desc').limit(50).get(),
      adminDb.collection('payouts').orderBy('requestTimestamp', 'desc').limit(50).get(),
      adminDb.collection('affiliate_payouts').orderBy('requestTimestamp', 'desc').limit(50).get()
    ]);
    
    const transactions = [
      ...subscriptionsSnapshot.docs.map(doc => ({
        id: doc.id,
        type: 'subscription',
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      })),
      ...payoutsSnapshot.docs.map(doc => ({
        id: doc.id,
        type: 'payout',
        ...doc.data(),
        createdAt: doc.data().requestTimestamp?.toDate?.()?.toISOString() || new Date().toISOString()
      })),
      ...affiliatePayoutsSnapshot.docs.map(doc => ({
        id: doc.id,
        type: 'affiliate',
        ...doc.data(),
        createdAt: doc.data().requestTimestamp?.toDate?.()?.toISOString() || new Date().toISOString()
      }))
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      transactions
    });

  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}