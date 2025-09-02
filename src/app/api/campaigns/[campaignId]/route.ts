import { NextResponse } from 'next/server';
import db from '@/lib/firebase-admin';
import * as admin from 'firebase-admin';

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

export async function POST(
  request: Request,
  { params }: { params: { campaignId: string } }
) {
  const { videoId, likeCount } = await request.json();

  if (!videoId || likeCount === undefined) {
    return NextResponse.json({ success: false, message: 'Missing videoId or likeCount' }, { status: 400 });
  }

  try {
    const submissionQuery = await db.firestore()
      .collection('submissions')
      .where('campaignId', '==', params.campaignId)
      .where('tiktokVideoId', '==', videoId)
      .limit(1)
      .get();
    
    if (submissionQuery.empty) {
      return NextResponse.json({ success: false, message: 'Submission not found for this campaign and video' }, { status: 404 });
    }

    const submissionDoc = submissionQuery.docs[0];
    await submissionDoc.ref.update({
      like_count: likeCount,
      metricsLastUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, message: "Like count updated." });

  } catch (error) {
    console.error(`Error updating like count for video ${videoId} in campaign ${params.campaignId}:`, error);
    return NextResponse.json(
      { success: false, message: 'Error updating like count' },
      { status: 500 }
    );
  }
}
