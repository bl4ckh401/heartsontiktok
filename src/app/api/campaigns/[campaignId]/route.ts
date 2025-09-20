import { NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';
import { checkAdminRole } from '@/lib/auth-middleware';

const adminDb = admin.firestore();

export async function GET(request: NextRequest, { params }: { params: { campaignId: string } }) {
  try {
    const { campaignId } = params;
    
    const campaignDoc = await adminDb.collection('campaigns').doc(campaignId).get();
    
    if (!campaignDoc.exists) {
      return NextResponse.json(
        { success: false, message: 'Campaign not found' },
        { status: 404 }
      );
    }

    const campaign = {
      id: campaignDoc.id,
      ...campaignDoc.data()
    };

    return NextResponse.json({
      success: true,
      campaign
    });

  } catch (error) {
    console.error('Error fetching campaign:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch campaign' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { campaignId: string } }) {
  // Check if user is admin
  const adminCheck = await checkAdminRole(request);
  if (adminCheck) return adminCheck;

  try {
    const { campaignId } = params;
    const { name, description, budget, brandAssetsUrl } = await request.json();

    if (!name || !description || budget === undefined) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const updateData = {
      name,
      description,
      budget: Number(budget),
      brandAssetsUrl: brandAssetsUrl || '',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await adminDb.collection('campaigns').doc(campaignId).update(updateData);

    return NextResponse.json({
      success: true,
      message: 'Campaign updated successfully'
    });

  } catch (error) {
    console.error('Error updating campaign:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update campaign' },
      { status: 500 }
    );
  }
}