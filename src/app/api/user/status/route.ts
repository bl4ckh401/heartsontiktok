
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/firebase-admin';

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;

  if (!session) {
    return NextResponse.json({ success: false, message: 'User not authenticated' }, { status: 401 });
  }

  try {
    const userRef = db.firestore().collection('users').doc(session);
    const doc = await userRef.get();

    if (!doc.exists) {
      return NextResponse.json({ 
        success: true, // Success is true, but they have no active plan
        subscriptionStatus: 'INACTIVE', 
        subscriptionPlan: null 
      });
    }

    const userData = doc.data();
    return NextResponse.json({
      success: true,
      subscriptionStatus: userData?.subscriptionStatus || 'INACTIVE',
      subscriptionPlan: userData?.subscriptionPlan || null,
      role: userData?.role || 'user',
    });

  } catch (error: any) {
    console.error('Error fetching user status:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch user status' }, { status: 500 });
  }
}
