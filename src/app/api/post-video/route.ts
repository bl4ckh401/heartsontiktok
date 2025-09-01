
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/firebase-admin';

export async function POST(request: Request) {
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get('tiktok_access_token')?.value;
  const userInfoCookie = (await cookieStore).get('user_info')?.value;

  if (!accessToken || !userInfoCookie) {
    return NextResponse.json({ success: false, message: 'User not authenticated' }, { status: 401 });
  }

  const formData = await request.formData();
  const videoFile = formData.get('video') as File;
  const title = formData.get('title') as string;
  const hashtags = formData.get('hashtags') as string;
  const paidPartnership = formData.get('paidPartnership') === 'true';
  const campaignId = formData.get('campaignId') as string;

  // Basic validation for required fields
  if (!videoFile || !title || !campaignId) {
    return NextResponse.json({ success: false, message: 'Missing required fields (video, title, campaignId)' }, { status: 400 });
  }

  // Optional: Validate file type and size if needed
  if (!videoFile.type.startsWith('video/')) {
    return NextResponse.json({ success: false, message: 'Invalid file type. Please upload a video.' }, { status: 400 });
  }

  if (videoFile.size === 0) { // Basic check for empty file
    return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
  }

  try {
    const userInfo = JSON.parse(userInfoCookie);

    // Step 1: Query Creator Info (Optional but good practice)
    const creatorInfoResponse = await fetch('https://open.tiktokapis.com/v2/post/publish/creator_info/query/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
    });

    if (!creatorInfoResponse.ok) { // Check HTTP status code first
      const errorBody = await creatorInfoResponse.text(); // Read response body for more info
      console.error(`TikTok Creator Info API HTTP Error: ${creatorInfoResponse.status}`, errorBody);
      return NextResponse.json({
        success: false,
        message: `Failed to get TikTok creator info. Status: ${creatorInfoResponse.status}`,
      }, { status: creatorInfoResponse.status });
    }


    const creatorInfoData = await creatorInfoResponse.json();

    if (creatorInfoData.error.code !== 'ok') {
      console.error('TikTok Creator Info Error:', creatorInfoData.error);
      return NextResponse.json({ success: false, message: `TikTok API Error: ${creatorInfoData.error.message}` }, { status: 500 });
    }

    // Step 2: Initialize Video Post
    const postInfo: any = {

      privacy_level: 'SELF_ONLY',
      brand_content_toggle: paidPartnership,
      ...(title && title.trim().length > 0 && { title: title }),
      disable_duet: false,
      disable_comment: false,
      disable_stitch: false,
      // video_cover_timestamp_ms is optional and not strictly needed for basic posting
      // is_aigc is optional and not needed unless dealing with AI content
      // brand_organic_toggle is optional
    };

    // NOTE: The TikTok API documentation for video/init/ does *not* list 'hashtags'
    // as a field in the post_info object. Hashtags might be part of the 'title'
    // or handled in a different step (e.g., the final publish call).
    const chunkSizeBytes = 10 * 1024 * 1024; // 10MB chunk size as per example


    const initResponse = await fetch('https://open.tiktokapis.com/v2/post/publish/video/init/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8', // Note: This is for initiating the post, not the video upload
      },
      body: JSON.stringify({
        post_info: postInfo,
        source_info: { // Assuming DIRECT_UPLOAD source type for direct file upload
          source: 'FILE_UPLOAD', // As per TikTok docs for direct upload
          video_size: videoFile.size,
          chunk_size: videoFile.size, // Use the defined chunk size
          total_chunk_count: Math.ceil(videoFile.size / chunkSizeBytes), // Calculated based on video size and chunk size
        }
      }),
    });

    if (!initResponse.ok) { // Check HTTP status code first
      const errorBody = await initResponse.text(); // Read response body for more info
      console.error(`TikTok Post Init API HTTP Error: ${initResponse.status}`, errorBody);
      return NextResponse.json({
        success: false,
        message: `Failed to initialize TikTok post. Status: ${initResponse.status}`,
      }, { status: initResponse.status });
    }

    const initData = await initResponse.json(); // Now parse JSON if HTTP status is OK

    if (initData.error?.code !== 'ok') {
      console.error('TikTok Post Init Error:', initData.error);
      return NextResponse.json({ success: false, message: `TikTok Post Init Error: ${initData.error.message}` }, { status: 500 });
    }
    const publishId = initData.data.publish_id;

    // Get the upload URL from the initialization response
    const uploadUrl = initData.data.upload_url; // This is the URL to PUT the video file to

    // Step 3: Upload the video file to TikTok's upload URL
    // This involves making a separate PUT request with the video file data
    console.log(`Uploading video for publishId: ${publishId} to URL: ${uploadUrl}`);
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      // The Content-Type should match the video file type
      headers: {
        'Content-Type': videoFile.type,
      },
      body: videoFile.stream(), // Use stream() for potentially large files
      // Note: The exact way to handle file streaming might depend on the environment
      // and available libraries. `videoFile.stream()` works in Vercel Edge Functions
      // and newer Node.js versions. For broader compatibility or very large files,
      // consider using a library like 'formidable' or 'busboy' on the server side
      // to handle the incoming file stream and then stream it to TikTok.
    });


    if (!uploadResponse.ok) {
      // Attempt to parse error response from TikTok if available
      const uploadErrorData = await uploadResponse.json().catch(() => null);
      // TikTok might return errors in different formats, adjust parsing as needed
      const errorMessage = uploadErrorData?.message || uploadErrorData?.error?.message || `TikTok Video Upload failed with status ${uploadResponse.status}`;

      console.error('TikTok Video Upload Error:', uploadResponse.status, uploadErrorData);
      throw new Error(`TikTok Video Upload failed with status ${uploadResponse.status}`);
    }

    // Note: TikTok's upload process is asynchronous. The PUT request completes when TikTok
    // receives the file, but processing (transcoding, etc.) happens afterwards.
    // In a production environment, you MUST implement a mechanism to check the upload status
    // with TikTok using the publish_id before considering the video ready for publishing.

    // Step 4: Record the submission in Firestore (with initial status)
    const submissionData = {
      campaignId: campaignId,
      userId: userInfo.open_id, // Using open_id as the user identifier
      title: title,
      hashtags: hashtags,
      tiktokPublishId: publishId,
      status: 'SUBMITTED', // Initial status
      submittedAt: new Date().toISOString(),
    };

    await db.firestore().collection('submissions').add(submissionData);

    // Step 5: Publish the video (after upload is complete and verified - not implemented here)
    // The endpoint below is for checking status, NOT for publishing.
    // In a real production application, you would ideally wait for TikTok to confirm the upload is processed
    // before calling the publish endpoint. This often requires polling their status API or webhooks.
    // Publishing usually requires a separate API call to a specific PUBLISH endpoint.
    // Since we cannot implement the asynchronous wait here, we are just logging the publishId.

    console.log(`Video upload initiated. Track status using publishId: ${publishId}`);
    // In a production system:
    // 1. Add this submission to a queue (e.g., Pub/Sub, Cloud Tasks).
    // 2. A background worker processes the queue.
    // 3. The worker polls TikTok's status check endpoint (`v2/post/publish/status/check/`)
    //    using the `publish_id` until the status indicates processing is complete and successful.
    // 4. Once ready, the worker calls the TikTok PUBLISH endpoint (refer to TikTok docs for the exact endpoint and method, likely POST).
    // 5. The worker updates the submission status in Firestore (e.g., 'PROCESSING', 'PUBLISHED', 'FAILED').

    // For demonstration, we are just returning success based on initiation and upload PUT request
    // success, but actual publishing hasn't happened yet in a way that ensures TikTok is ready.

    // The following code is for CHECKING STATUS, not PUBLISHING.
    /*
    const publishData = await publishResponse.json();
    // Check publishData for success/failure of the status check
    */

    // Return a success response indicating the upload was initiated and recorded.
    // The client will need to check the status periodically or be notified
    // through a separate mechanism once the video is processed and published by TikTok.
    return NextResponse.json({
      success: true,
      message: 'Video upload initiated. Processing will continue in the background.',
      publishId: publishId, // Return publishId for tracking
    });

  } catch (error: any) {
    console.error('Error posting video to TikTok:', error);
    return NextResponse.json({ success: false, message: 'Failed to post video to TikTok.' }, { status: 500 });
  }
}
