'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input'; // Assuming Input is from your UI library
import Image from 'next/image';

const PayoutPage = () => {
  const [allUserVideos, setAllUserVideos] = useState<any[]>([]);
  const [eligibleVideos, setEligibleVideos] = useState<any[]>([]); // State to hold eligible videos
  const [selectedVideoIds, setSelectedVideoIds] = useState<string[]>([]);
  const [payoutEligible, setPayoutEligible] = useState(false);
  const [payoutStatus, setPayoutStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const MINIMUM_PAYOUT_VIEWS = 1000; // Define the minimum view count for payout

  // Placeholder for AI verification status
  const [aiVerificationStatus, setAiVerificationStatus] = useState<{ [key: string]: 'idle' | 'pending' | 'verified' | 'failed' }>({});

  useEffect(() => {
    const fetchUserVideos = async () => {
      try {
        // Fetch access token
        const tokenResponse = await fetch('/api/get-tiktok-token');
        const tokenData = await tokenResponse.json();

        if (!tokenData.accessToken) {
          console.error("TikTok access token not found.");
          // Handle the case where the token is not available (e.g., redirect to login)
          return;
        }

        const accessToken = tokenData.accessToken;
        const videoFields = 'id,title,cover_image_url,embed_link,like_count,comment_count,share_count,view_count,duration,video_description';

        // Fetch all user videos (TikTok API supports fetching up to 20 per request,
        // you might need pagination here for users with many videos)
        const videoListResponse = await fetch(
          `https://open.tiktokapis.com/v2/video/list/?fields=${videoFields}`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ max_count: 20 }), // Fetch up to 20 videos
          }
        );

        const videoListData = await videoListResponse.json();

        if (videoListData.error && videoListData.error.code !== 'ok') {
          console.error('Error fetching video list:', videoListData.error);
          // Handle error
          return;
        }

        if (videoListData.data && videoListData.data.videos) {
          // Filter eligible videos client-side for now
          const filteredVideos = videoListData.data.videos.filter((video: any) => (video.view_count || 0) >= MINIMUM_PAYOUT_VIEWS);
          setAllUserVideos(videoListData.data.videos); // Keep all videos if needed elsewhere
          setEligibleVideos(filteredVideos); // Set eligible videos
        }
      } catch (error) {
        console.error('Error fetching user videos:', error);
      }
    };
    fetchUserVideos();
  }, []);

  const handleCheckboxChange = (videoId: string) => {
    setSelectedVideoIds(prevSelected =>
      prevSelected.includes(videoId)
        ? prevSelected.filter(id => id !== videoId)
        : [...prevSelected, videoId]
    );
  };

  const handleRequestPayout = async () => {
    setPayoutStatus('loading');

    if (selectedVideoIds.length === 0) {
      setPayoutStatus('error');
      console.error('Please select at least one video for payout.');
      return;
    }

    if (!phoneNumber.trim()) { // Assuming phoneNumber state still exists for payment info
      setPayoutStatus('error');
      console.error('Phone number is required.');
      return;
    }

    // Prepare data for bulk payout
    try {
      const payoutResponse = await fetch('/api/request-payout', {
        method: 'POST', // Assuming your backend accepts POST for payout requests
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoIds: selectedVideoIds, phoneNumber }), // Send array of selected IDs
      });
      const payoutResult = await payoutResponse.json();
      if (payoutResult.success) {
        setPayoutStatus('success');
      } else {
        setPayoutStatus('error');
        console.error('Payout request failed:', payoutResult.message);
      }
    } catch (error) {
      console.error('Error sending payout request:', error);
    }
  };

  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Payout</CardTitle>
          <p className="text-muted-foreground">Select the videos you want to request a payout for.</p>
        </CardHeader>
        <CardContent className="space-y-6">

        {/* Display list of eligible videos */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {eligibleVideos.map(video => (
 <Card
 key={video.id}
 // Apply selected style to the card
 className={`cursor-pointer ${selectedVideoIds.includes(video.id) ? 'border-2 border-blue-500' : ''}`}
 onClick={() => handleCheckboxChange(video.id)} // Allow clicking card to select
 >
 <CardContent className="flex flex-col items-center p-4">
 <input
                type="checkbox"
 className="self-end"
 checked={selectedVideoIds.includes(video.id)}
 onChange={() => handleCheckboxChange(video.id)}
 onClick={(e) => e.stopPropagation()} // Prevent card click when clicking checkbox
 />
 <Image
 src={video.cover_image_url || 'https://placehold.co/120x160.png'}
 alt={video.title || 'Video thumbnail'}
 width={120}
 height={160}
 className="rounded-md object-cover mt-2"
 unoptimized
 />
 <p className="text-sm font-medium mt-2 text-center">{video.title || 'Untitled Video'}</p>
 <div className="text-xs text-muted-foreground mt-1 text-center">
 <span>Views: {video.view_count?.toLocaleString() || 0}</span> &middot;{' '}
 <span>Likes: {video.like_count?.toLocaleString() || 0}</span>
 </div>
 {/* Placeholder for AI verification status */}
 <div className="text-xs mt-2">
                  AI Verification: {aiVerificationStatus[video.id] || 'Pending'}
 </div>
 </CardContent>
 </Card>
 ))}
          {eligibleVideos.length === 0 && (
 <p className="text-center text-muted-foreground col-span-full">No eligible videos found for payout yet.</p>
 )}
 </div>

        {selectedVideoIds.length > 0 && (
 <div className="space-y-2 mt-6">
 <h3 className="text-lg font-semibold">Payment Information</h3>
 <p className="text-muted-foreground">Please provide your M-Pesa phone number to receive the payout for the selected videos.</p>
 <Input
 placeholder="Enter M-Pesa phone number (e.g., 0712345678)"
 value={phoneNumber}
 onChange={(e) => setPhoneNumber(e.target.value)}
            type="tel" // Use type="tel" for phone number input
 />
 <button onClick={handleRequestPayout} disabled={payoutStatus === 'loading' || !phoneNumber.trim()} className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50">
 {payoutStatus === 'loading' ? 'Processing Payout...' : `Request Payout for ${selectedVideoIds.length} Video${selectedVideoIds.length > 1 ? 's' : ''}`}
 </button>
 <p className="text-sm text-muted-foreground mt-2">Note: Payouts are processed securely. Do not share sensitive information.</p>
 {/* Placeholder button/action to trigger AI verification */}
 {selectedVideoIds.length > 0 && aiVerificationStatus[selectedVideoIds[0]] !== 'verified' && ( // Example: show button if at least one selected and first is not verified
 <button
             onClick={() => {
 // Implement logic to trigger AI verification for selected videos
 console.log('Triggering AI verification for:', selectedVideoIds);
 // Update AI verification status for selected videos to 'pending'
 selectedVideoIds.forEach(id => setAiVerificationStatus(prev => ({ ...prev, [id]: 'pending' })));
 }}
 className="px-4 py-2 bg-blue-500 text-white rounded mt-2"
 >
 Trigger AI Verification
 </button>
 )}
 </div>
 )}
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          {payoutStatus === 'success' && <p className="text-green-600">Payout request submitted successfully! You will receive a confirmation shortly.</p>}
          {payoutStatus === 'error' && <p className="text-red-500">Error processing payout request. Please try again later or contact support.</p>}
        </CardFooter>
      </Card>
    </div>
 );
};

export default PayoutPage;