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
      .orderBy('submittedAt', 'desc')
      .limit(100)
      .get();
    
    const submissionsData = submissionsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
      };
    });

    // Fetch campaign details
    const campaignIds = Array.from(new Set(submissionsData.map((s: any) => s.campaignId).filter(Boolean)));
    const campaignsSnapshot = await Promise.all(
      campaignIds.map(id => adminDb.collection('campaigns').doc(id).get())
    );
    const campaignsMap = campaignsSnapshot.reduce((acc, doc) => {
      if (doc.exists) {
        acc[doc.id] = doc.data()?.name || 'Unknown Campaign';
      }
      return acc;
    }, {} as Record<string, string>);

    const submissions = submissionsData.map((s: any) => ({
      ...s,
      campaignName: campaignsMap[s.campaignId] || 'Unknown',
      createdAt: (s.submittedAt?.toDate?.() || s.createdAt?.toDate?.() || new Date()).toISOString()
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