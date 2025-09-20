import { NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';
import { checkAdminRole } from '@/lib/auth-middleware';

const adminDb = admin.firestore();

export async function GET(request: NextRequest) {
  // Check if user is admin
  const adminCheck = await checkAdminRole(request);
  if (adminCheck) return adminCheck;

  try {
    // Get all campaign submissions from Firestore
    const submissionsSnapshot = await adminDb.collection('submissions')
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get();
    
    const submissions = submissionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
    }));

    return NextResponse.json({
      success: true,
      submissions
    });

  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}