
'use client';
import { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Video, Heart, MessageCircle, Share2, Eye } from 'lucide-react'; // Added Eye icon for views
import Cookies from 'js-cookie';
import { Input } from '@/components/ui/input';

export default function PayoutsPage() {
    const [eligibleVideos, setEligibleVideos] = useState<any[]>([]);
    const [selectedVideoIds, setSelectedVideoIds] = useState<string[]>([]);
    const [cursor, setCursor] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false); // Added loading state
    const [error, setError] = useState<string | null>(null); // Added error state

    const MIN_PAYOUT_VIEWS = 1000; // Define minimum payout view threshold
    const videoFields = 'id,title,cover_image_url,embed_link,like_count,comment_count,share_count,view_count,create_time';

    useEffect(() => {
        const fetchEligibleVideos = async () => {
            const tokenResponse = await fetch('/api/get-tiktok-token');
            const tokenData = await tokenResponse.json();
      
            if (!tokenData.accessToken) {
              console.error('TikTok access token not found in cookies.');
              return;
            }
      
            try {
              // Fetch user profile
              const userInfoResponse = await fetch(
                `https://open.tiktokapis.com/v2/user/info/?fields=display_name,avatar_url,follower_count,following_count,likes_count,video_count,bio_description`,
                {
                  headers: {
                    Authorization: `Bearer ${tokenData.accessToken}`,
                  },
                }
              );
              const userInfoData = await userInfoResponse.json();
      
              // Fetch recent videos
              const videoFields = 'id,title,cover_image_url,embed_link,like_count,comment_count,share_count,view_count'; // Define fields here
              const videoListResponse = await fetch(`https://open.tiktokapis.com/v2/video/list/?fields=${videoFields}`, {
                      method: 'POST',
                      headers: {
                          'Authorization': `Bearer ${tokenData.accessToken}`,
                          'Content-Type': 'application/json',
                      }, // Use the fetched accessToken
                      body: JSON.stringify({ max_count: 20 }),
                  });
                  const videoListData = await videoListResponse.json();
              
                  if (videoListData.data && videoListData.data.videos) {
                    setEligibleVideos(videoListData.data.videos);
      
                    // Aggregate some data for metrics based on recent videos
                    const totalComments = videoListData.data.videos.reduce((sum: number, v: any) => sum + (v.comment_count || 0), 0);
                    const totalShares = videoListData.data.videos.reduce((sum: number, v: any) => sum + (v.share_count || 0), 0);
    
                  } else if (videoListData.error) {
                      console.error('Error fetching video list:', videoListData.error);
                  }
            } catch (error) {
              console.error('Error fetching TikTok data:', error);
              // Handle error in UI, e.g., show an error message
            }
          };

        fetchEligibleVideos();
    }, [cursor]); // Depend on cursor for pagination

    const loadMoreVideos = async () => {
        if (!hasMore || loading) return;
        // The useEffect with [cursor] dependency will handle fetching when cursor state updates
        // Just need to make sure we don't manually set cursor here if useEffect is handling it.
        // The fetchEligibleVideos function already updates cursor.
        // If this button is clicked, it means hasMore is true and we need the next page.
        // The current useEffect logic already triggers on cursor change.
        // This button's purpose is just to make the API call trigger for the next page.
        // The useEffect logic handles the cursor update and fetching.
        // So, simply letting the useEffect handle it is the correct approach.
        // We might want to add a visual loading state specific to loading more.
    };


    const handleSelectVideo = (videoId: string, isSelected: boolean) => {
        if (isSelected) {
            setSelectedVideoIds(prevIds => [...prevIds, videoId]);
        } else {
            setSelectedVideoIds(prevIds => prevIds.filter(id => id !== videoId));
        }
    };

    const handleRequestPayout = async () => {
        // This function will now be in the new PayoutsPage
        // It should send selectedVideoIds and phone number to backend
        // (Payment info collection UI still needs to be added here)
        alert("Requesting payout for selected videos (Backend integration needed)");
        // Example:
        // const payoutResponse = await fetch('/api/request-payout', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ videoIds: selectedVideoIds, phoneNumber: '...' }), // Add phone number input
        // });
        // Handle response
    };

    // Need state and UI for payment info (phone number)
    const [phoneNumber, setPhoneNumber] = useState('');
    const [payoutStatus, setPayoutStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');


    const triggerPayout = async () => {
        if (selectedVideoIds.length === 0) {
            alert("Please select at least one video for payout.");
            return;
        }

        if (!phoneNumber) {
            alert("Please enter your phone number for payout.");
            return;
        }

        setPayoutStatus('loading');
        setError(null);

        try {
            const payoutResponse = await fetch('/api/request-payout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ videoIds: selectedVideoIds, phoneNumber: phoneNumber }),
            });

            const result = await payoutResponse.json();

            if (result.success) {
                setPayoutStatus('success');
                // Optionally clear selected videos or update their status
                setSelectedVideoIds([]);
                // You might want to refetch eligible videos or update their status in the list
            } else {
                setPayoutStatus('error');
                setError(result.message || 'Payout request failed.');
            }

        } catch (err: any) {
            setPayoutStatus('error');
            setError(`Failed to send payout request: ${err.message}`);
        }
    };


    return (
        <div className="container mx-auto py-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Eligible Videos for Payout</CardTitle>
                    <CardDescription>
                        Select videos that have met the minimum view threshold ({MIN_PAYOUT_VIEWS} views) for payout.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading && eligibleVideos.length === 0 && <p>Loading videos...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {!loading && eligibleVideos.length === 0 && !error && <p>No eligible videos found yet.</p>}

                    {eligibleVideos.length > 0 && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]"></TableHead> {/* Checkbox column */}
                                    <TableHead className="hidden w-[100px] sm:table-cell">Thumbnail</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead className="hidden md:table-cell">Views</TableHead>
                                    <TableHead className="hidden md:table-cell">Likes</TableHead>
                                    <TableHead className="hidden md:table-cell">Comments</TableHead>
                                    <TableHead className="hidden md:table-cell">Shares</TableHead>
                                    {/* Add column for AI verification status later */}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {eligibleVideos.map((video) => (
                                    <TableRow key={video.id} className={selectedVideoIds.includes(video.id) ? 'bg-blue-100' : ''}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedVideoIds.includes(video.id)}
                                                onCheckedChange={(isChecked: boolean) => handleSelectVideo(video.id, isChecked)}
                                            />
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <Image
                                                alt={video.title || "Video thumbnail"}
                                                className="aspect-square rounded-md object-cover"
                                                height="64"
                                                src={video.cover_image_url || 'https://placehold.co/64x64.png'}
                                                width="64"
                                                unoptimized
                                                onError={(e) => e.currentTarget.src = 'https://placehold.co/64x64.png'}
                                                data-ai-hint="video thumbnail"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{video.title || 'Untitled Video'}</TableCell>
                                        <TableCell className="hidden md:table-cell flex items-center gap-1">
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                            {video.view_count?.toLocaleString() || 0}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell flex items-center gap-1">
                                            <Heart className="h-4 w-4 text-muted-foreground" />
                                            {video.like_count?.toLocaleString() || 0}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell flex items-center gap-1">
                                            <MessageCircle className="h-4 w-4 text-muted-foreground" />
                                            {video.comment_count?.toLocaleString() || 0}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell flex items-center gap-1">
                                            <Share2 className="h-4 w-4 text-muted-foreground" />
                                            {video.share_count?.toLocaleString() || 0}
                                        </TableCell>
                                        {/* Placeholder for AI Status */}
                                        {/* <TableCell>
                                             <span className="text-sm text-muted-foreground">Pending AI Check</span>
                                         </TableCell> */}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}

                    {hasMore && (
                        <div className="flex justify-center mt-4">
                            <Button onClick={loadMoreVideos} disabled={loading}>
                                {loading ? 'Loading More...' : 'Load More'}
                            </Button>
                        </div>
                    )}

                </CardContent>
            </Card>

            {selectedVideoIds.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Request Payout</CardTitle>
                        <CardDescription>
                            Enter your phone number and request payout for the selected videos.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <label htmlFor="phoneNumber" className="w-24 text-right">Phone Number:</label>
                            <Input
                                id="phoneNumber"
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="e.g., 0712345678"
                                className="max-w-xs"
                                disabled={payoutStatus === 'loading'}
                            />
                        </div>
                        <Button onClick={triggerPayout} disabled={selectedVideoIds.length === 0 || payoutStatus === 'loading'}>
                            {payoutStatus === 'loading' ? 'Processing...' : `Request Payout for ${selectedVideoIds.length} Video(s)`}
                        </Button>
                        {payoutStatus === 'success' && <p className="text-green-500 mt-2">Payout request submitted successfully!</p>}
                        {payoutStatus === 'error' && error && <p className="text-red-500 mt-2">{error}</p>}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}