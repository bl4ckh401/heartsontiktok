import { NextResponse } from 'next/server';
import db from '@/lib/firebase-admin';

export async function GET(
  request: Request,
  { params }: { params: { campaignId: string } }
) {
  try {
    const campaignId = params.campaignId;
    if (!campaignId) {
      return NextResponse.json(
        { success: false, message: 'Campaign ID is required' },
        { status: 400 }
      );
    }

    const campaignRef = db.firestore().collection('campaigns').doc(campaignId);
    const doc = await campaignRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { success: false, message: 'Campaign not found' },
        { status: 404 }
      );
    }

    const campaignData = {
      id: doc.id,
      ...doc.data(),
    };

    return NextResponse.json(campaignData);
  } catch (error) {
    console.error(`Error fetching campaign ${params.campaignId}:`, error);
    return NextResponse.json(
      { success: false, message: 'Error fetching campaign details' },
      { status: 500 }
    );
  }
}

    