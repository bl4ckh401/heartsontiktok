
'use server';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import db from '@/lib/firebase-admin';

// Define the structure for a Submission document from Firestore
interface Submission {
    id?: string;
    userId: string;
    payoutStatus: 'ELIGIBLE' | 'PENDING' | 'PAID' | 'UNPAID';
    tiktokVideoId?: string;
    title?: string;
    like_count?: number;
    lastPaidLikeCount?: number;
    // Add any other fields you expect from the submission document
}

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('tiktok_access_token')?.value;
  const session = cookieStore.get('session')?.value;

  if (!accessToken || !session) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }
  const userId = session;

  try {
    // 1. Fetch all ELIGIBLE submissions from Firestore for the user
    const submissionsRef = db.firestore().collection('submissions')
      .where('userId', '==', userId)
      .where('payoutStatus', '==', 'ELIGIBLE');
    const submissionsSnapshot = await submissionsRef.get();

    if (submissionsSnapshot.empty) {
        return NextResponse.json({ videos: [] });
    }

    const submissionData = submissionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Submission));
    const tiktokVideoIds = submissionData.map(sub => sub.tiktokVideoId).filter((id): id is string => !!id);

    if (tiktokVideoIds.length === 0) {
        return NextResponse.json({ videos: [] });
    }

    // 2. Fetch up-to-date video details from TikTok for the eligible videos
    const videoFields = 'id,title,cover_image_url,embed_link,like_count,comment_count,share_count,view_count';
    const videoListResponse = await fetch(`https://open.tiktokapis.com/v2/video/list/?fields=${videoFields}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ video_ids: tiktokVideoIds }),
    });

    const videoListData = await videoListResponse.json();

    if (videoListData.error && videoListData.error.code !== 'ok') {
      console.error('Error fetching video list from TikTok:', videoListData.error);
      return NextResponse.json({ error: `TikTok API Error: ${videoListData.error.message}` }, { status: 500 });
    }
    
    const tiktokVideosMap = new Map((videoListData.data?.videos || []).map((v: any) => [v.id, v]));

    // 3. Augment our submission data with the latest metrics from TikTok
    const batch = db.firestore().batch();
    const videosWithStatus = submissionData.map(submission => {
        const tiktokVideo = tiktokVideosMap.get(submission.tiktokVideoId!);
        const updatedLikeCount = tiktokVideo?.like_count || submission.like_count || 0;

        // If the like count has changed, update it in Firestore
        if (tiktokVideo && updatedLikeCount !== submission.like_count) {
             const submissionDocRef = db.firestore().collection('submissions').doc(submission.id!);
             if(submissionDocRef.path) {
                batch.update(submissionDocRef, { like_count: updatedLikeCount });
             }
        }
        
        return {
            id: submission.tiktokVideoId,
            submissionId: submission.id,
            title: tiktokVideo?.title || submission.title,
            cover_image_url: tiktokVideo?.cover_image_url || 'https://placehold.co/400x225.png',
            view_count: tiktokVideo?.view_count || 0,
            like_count: updatedLikeCount,
            comment_count: tiktokVideo?.comment_count || 0,
            payoutStatus: submission.payoutStatus,
            lastPaidLikeCount: submission.lastPaidLikeCount || 0,
        };
    });

    // Commit the batch update for like counts
    if (batch) {
      await batch.commit();
    }
    
    return NextResponse.json({ videos: videosWithStatus });

  } catch (error) {
    console.error('Failed to fetch videos:', error);
    return NextResponse.json({ error: 'Failed to fetch and process videos' }, { status: 500 });
  }
}
