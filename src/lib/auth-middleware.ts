import { NextRequest, NextResponse } from 'next/server';
import admin from './firebase-admin';

const adminDb = admin.firestore();

export async function checkAdminRole(request: NextRequest) {
  try {
    // Get user ID from session cookie
    const sessionCookie = request.cookies.get('session');
    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = sessionCookie.value;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check user role in Firestore
    const userDoc = await adminDb.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const user = userDoc.data();
    if (user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    return null; // User is admin, continue
  } catch (error) {
    console.error('Error checking admin role:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}