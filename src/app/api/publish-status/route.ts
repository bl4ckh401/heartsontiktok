
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/firebase-admin';
import * as admin from 'firebase-admin';

export async function POST(request: Request) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('tiktok_access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ success: false, message: 'User not authenticated' }, { status: 401 });
  }

  const { publishId, submissionId } = await request.json();

  if (!publishId || !submissionId) {
    return NextResponse.json({ success: false, message: 'Missing publishId or submissionId' }, { status: 400 });
  }

  try {
    const statusResponse = await fetch('https://open.tiktokapis.com/v2/post/publish/status/fetch/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        publish_id: publishId,
      }),
    });

    const statusData = await statusResponse.json();

    if (statusData.error?.code !== 'ok') {
      console.error('TikTok Publish Status Error:', statusData.error);
      const errorMessage = `TikTok API Error: ${statusData.error.message}.`;
      return NextResponse.json({ success: false, message: errorMessage, error: statusData.error }, { status: 400 });
    }
    
    const { status, publicaly_available_post_id } = statusData.data;

    const submissionRef = db.firestore().collection('submissions').doc(submissionId);

    // Update Firestore if the video is live
    if (status === 'PUBLISH_COMPLETE') {
      await submissionRef.update({
        status: 'PUBLISHED',
        tiktokVideoId: publicaly_available_post_id,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return NextResponse.json({ success: true, status: 'PUBLISHED' });
    }
    
    // Handle other statuses
    if (status === 'PUBLISH_FAILED') {
         await submissionRef.update({
            status: 'FAILED',
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return NextResponse.json({ success: false, status: 'FAILED', message: 'TikTok reported that the video publish failed.' });
    }

    // If still processing, just return the current status
    return NextResponse.json({ success: true, status: status });

  } catch (error: any) {
    console.error('Error in publish-status route:', error);
    return NextResponse.json({ success: false, message: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}
