'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Eye, Heart, MessageCircle, Video, Loader2, AlertCircle, RefreshCw, Users, Wallet } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface EligibleVideo {
    id: string; // tiktokVideoId
    submissionId: string;
    title: string;
    cover_image_url: string;
    view_count: number;
    like_count: number;
    comment_count: number;
    payoutStatus: 'ELIGIBLE' | 'PENDING' | 'PAID' | 'UNPAID';
    lastPaidLikeCount: number;
}

interface Referral {
    id: string;
    name: string;
    avatar: string;
    joinDate: string;
    status: 'Active' | 'Pending';
    commission: number;
    level: 1 | 2 | 3 | 4;
}

import { PLAN_CONFIG } from '@/lib/plan-config';

export default function PayoutsPage() {
    const [eligibleVideos, setEligibleVideos] = useState<EligibleVideo[]>([]);
    const [selectedVideoIds, setSelectedVideoIds] = useState<string[]>([]);
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [selectedReferrals, setSelectedReferrals] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [affiliateLoading, setAffiliateLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [affiliateError, setAffiliateError] = useState<string | null>(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [affiliatePhoneNumber, setAffiliatePhoneNumber] = useState('');
    const [payoutStatus, setPayoutStatus] = useState<'idle' | 'loading'>('idle');
    const [affiliatePayoutStatus, setAffiliatePayoutStatus] = useState<'idle' | 'loading'>('idle');
    const [userPlan, setUserPlan] = useState<string | null>(null);

    const { toast } = useToast();

    const fetchUserPlan = useCallback(async () => {
        try {
            const res = await fetch('/api/user/status');
            const data = await res.json();
            if (data.success && data.subscriptionPlan) {
                setUserPlan(data.subscriptionPlan);
            }
        } catch (err) {
            console.error("Failed to fetch user plan", err);
        }
    }, []);

    const fetchEligibleVideos = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/videos');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch videos.');
            }
            const data = await response.json();
            if (data.videos) {
                setEligibleVideos(data.videos.filter((v: any) => v.payoutStatus === 'ELIGIBLE'));
            } else if (data.error) {
                throw new Error(data.error);
            }
        } catch (err: any) {
            setError(err.message);
            toast({
                title: 'Error Fetching Videos',
                description: err.message,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);
    
    const fetchAffiliateData = useCallback(async () => {
        setAffiliateLoading(true);
        setAffiliateError(null);
        try {
            const response = await fetch('/api/affiliates');
            const result = await response.json();
            
            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Failed to fetch affiliate data.');
            }
            
            setReferrals(result.data.referrals.filter((r: Referral) => r.commission > 0));
        } catch (err: any) {
            setAffiliateError(err.message);
            toast({
                title: 'Error Fetching Affiliates',
                description: err.message,
                variant: 'destructive',
            });
        } finally {
            setAffiliateLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchUserPlan();
        fetchEligibleVideos();
        fetchAffiliateData();
    }, [fetchUserPlan, fetchEligibleVideos, fetchAffiliateData]);

    const handleSelectVideo = (videoId: string) => {
        setSelectedVideoIds((prevIds) =>
            prevIds.includes(videoId)
                ? prevIds.filter((id) => id !== videoId)
                : [...prevIds, videoId]
        );
    };
    
    const handleSelectReferral = (referralId: string) => {
        setSelectedReferrals(prev => 
            prev.includes(referralId) 
                ? prev.filter(id => id !== referralId)
                : [...prev, referralId]
        );
    };
    
    const estimatedTotalPayout = useMemo(() => {
        return selectedVideoIds.reduce((total, id) => {
            const video = eligibleVideos.find(v => v.id === id);
            if (!video || !userPlan || !PLAN_CONFIG[userPlan]) return total;
            const rate = PLAN_CONFIG[userPlan].payoutRatePer1000Likes;
            const newLikes = video.like_count - video.lastPaidLikeCount;
            const payout = (newLikes / 1000) * rate; 
            return total + (payout > 0 ? payout : 0);
        }, 0);
    }, [selectedVideoIds, eligibleVideos, userPlan]);
    
    const selectedCommission = useMemo(() => {
        return selectedReferrals.reduce((total, id) => {
            const referral = referrals.find(r => r.id === id);
            return total + (referral?.commission || 0);
        }, 0);
    }, [selectedReferrals, referrals]);

    const triggerPayout = async () => {
        if (selectedVideoIds.length === 0) {
            toast({ title: 'No videos selected', description: 'Please select at least one video.', variant: 'destructive' });
            return;
        }
        if (!phoneNumber.match(/^(254)\d{9}$/)) {
            toast({ title: 'Invalid Phone Number', description: 'Please use the format 254XXXXXXXXX (e.g., 254712345678).', variant: 'destructive' });
            return;
        }

        setPayoutStatus('loading');
        setError(null);

        try {
            const response = await fetch('/api/request-payout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    videoIds: selectedVideoIds, 
                    phoneNumber: phoneNumber,
                }),
            });

            const result = await response.json();

            if (result.success) {
                toast({ 
                    title: 'Payout Request Successful!', 
                    description: `Your payout request has been submitted. You may receive an M-Pesa prompt.` 
                });
                setSelectedVideoIds([]);
                setPhoneNumber('');
                fetchEligibleVideos();
            } else {
                throw new Error(result.message || 'Payout request failed.');
            }
        } catch (err: any) {
            setError(err.message);
            toast({ title: 'Payout Failed', description: err.message, variant: 'destructive' });
        } finally {
             setPayoutStatus('idle');
        }
    };
    
    const triggerAffiliatePayout = async () => {
        if (selectedReferrals.length === 0) {
            toast({ title: 'No referrals selected', description: 'Please select at least one referral.', variant: 'destructive' });
            return;
        }
        if (!affiliatePhoneNumber.match(/^(254)\d{9}$/)) {
            toast({ title: 'Invalid Phone Number', description: 'Please use the format 254XXXXXXXXX (e.g., 254712345678).', variant: 'destructive' });
            return;
        }
        
        setAffiliatePayoutStatus('loading');
        setAffiliateError(null);
        
        try {
            const response = await fetch('/api/request-affiliate-payout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    referralIds: selectedReferrals, 
                    phoneNumber: affiliatePhoneNumber,
                }),
            });
            
            const result = await response.json();
            
            if (result.success) {
                toast({ 
                    title: 'Affiliate Payout Request Successful!', 
                    description: 'Your affiliate payout request has been submitted. You may receive an M-Pesa prompt.' 
                });
                setSelectedReferrals([]);
                setAffiliatePhoneNumber('');
                fetchAffiliateData();
            } else {
                throw new Error(result.message || 'Affiliate payout request failed.');
            }
        } catch (err: any) {
            setAffiliateError(err.message);
            toast({ title: 'Affiliate Payout Failed', description: err.message, variant: 'destructive' });
        } finally {
            setAffiliatePayoutStatus('idle');
        }
    };

    const VideoSkeleton = () => (
        <Card className="overflow-hidden">
            <Skeleton className="aspect-video w-full" />
            <CardContent className="p-4">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="container mx-auto py-6 space-y-8">
             <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Request Payout</h1>
                    <p className="text-muted-foreground mt-1">Get paid for your videos and affiliate commissions.</p>
                </div>
            </div>
            
            <Tabs defaultValue="videos" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="videos" className="flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        Video Payouts
                    </TabsTrigger>
                    <TabsTrigger value="affiliates" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Affiliate Payouts
                    </TabsTrigger>
                </TabsList>
                
                <TabsContent value="videos" className="space-y-6">
                    <div className="flex justify-end">
                        <Button variant="outline" size="sm" onClick={fetchEligibleVideos} disabled={loading}>
                            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh Videos
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Eligible Videos</CardTitle>
                                    <CardDescription>
                                        Videos ready for payout. Earn KES 50 per 1,000 likes on all plans. Daily limits: <span className="font-bold text-primary">{userPlan === 'Gold' ? 'KES 10,000' : userPlan === 'Platinum' ? 'KES 15,000' : userPlan === 'Diamond' ? 'KES 20,000' : '...'}</span>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {loading && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                           {[...Array(4)].map((_, i) => <VideoSkeleton key={i} />)}
                                        </div>
                                    )}
                                    {error && (
                                        <div className="flex flex-col items-center justify-center text-center py-10">
                                            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                                            <p className="font-semibold">Failed to load videos</p>
                                            <p className="text-muted-foreground text-sm">{error}</p>
                                        </div>
                                    )}
                                    {!loading && !error && eligibleVideos.length === 0 && (
                                         <div className="text-center py-16 border-2 border-dashed rounded-lg">
                                            <Video className="mx-auto h-12 w-12 text-muted-foreground" />
                                            <h3 className="mt-2 text-sm font-semibold text-foreground">No Eligible Videos</h3>
                                            <p className="mt-1 text-sm text-muted-foreground">Keep creating! Videos submitted for campaigns will appear here once published.</p>
                                         </div>
                                    )}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {eligibleVideos.map((video) => (
                                            <Card
                                                key={video.id}
                                                className={`overflow-hidden transition-all duration-200 cursor-pointer ${selectedVideoIds.includes(video.id) ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : 'ring-0 hover:ring-2 hover:ring-muted-foreground/20'}`}
                                                onClick={() => handleSelectVideo(video.id)}
                                            >
                                                <div className="relative">
                                                    <Image
                                                        alt={video.title || "Video thumbnail"}
                                                        className="aspect-video w-full object-cover"
                                                        height="200"
                                                        src={video.cover_image_url || 'https://placehold.co/400x225.png'}
                                                        width="400"
                                                        unoptimized
                                                        onError={(e) => e.currentTarget.src = 'https://placehold.co/400x225.png'}
                                                        data-ai-hint="video thumbnail"
                                                    />
                                                    <div className="absolute top-2 right-2">
                                                         <Checkbox checked={selectedVideoIds.includes(video.id)} className="bg-background/80 backdrop-blur-sm h-6 w-6 border-2" />
                                                    </div>
                                                </div>
                                                <CardContent className="p-4">
                                                    <h3 className="font-semibold truncate" title={video.title || 'Untitled Video'}>{video.title || 'Untitled Video'}</h3>
                                                    <div className="flex justify-between text-sm text-muted-foreground mt-2">
                                                        <div className="flex items-center gap-1.5"><Eye className="h-4 w-4" /> {video.view_count?.toLocaleString() || 0}</div>
                                                        <div className="flex items-center gap-1.5"><Heart className="h-4 w-4" /> {video.like_count?.toLocaleString() || 0}</div>
                                                        <div className="flex items-center gap-1.5"><MessageCircle className="h-4 w-4" /> {video.comment_count?.toLocaleString() || 0}</div>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mt-2">Likes paid for: {video.lastPaidLikeCount.toLocaleString()}</p>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="lg:col-span-1 space-y-6">
                            <Card className="sticky top-6">
                                <CardHeader>
                                    <CardTitle>Video Payout Summary</CardTitle>
                                    <CardDescription>Enter your M-Pesa number to receive payment.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                     <div>
                                        <p className="text-sm text-muted-foreground">Videos Selected</p>
                                        <p className="text-2xl font-bold">{selectedVideoIds.length}</p>
                                    </div>
                                     <div>
                                        <p className="text-sm text-muted-foreground">Estimated Payout (from New Likes)</p>
                                        <p className="text-4xl font-bold text-primary">KES {estimatedTotalPayout.toFixed(2)}</p>
                                        <p className="text-xs text-muted-foreground">Final amount calculated on the backend.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="phoneNumber" className="text-sm font-medium">M-Pesa Number</label>
                                        <Input
                                            id="phoneNumber"
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            placeholder="e.g., 254712345678"
                                            disabled={payoutStatus === 'loading' || selectedVideoIds.length === 0}
                                        />
                                    </div>
                                </CardContent>
                                <CardContent>
                                     <Button onClick={triggerPayout} className="w-full" size="lg" disabled={selectedVideoIds.length === 0 || payoutStatus === 'loading' || !phoneNumber.match(/^(254)\d{9}$/)}>
                                        {payoutStatus === 'loading' ? <Loader2 className="animate-spin" /> : `Request Payout`}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
                
                <TabsContent value="affiliates" className="space-y-6">
                    <div className="flex justify-end">
                        <Button variant="outline" size="sm" onClick={fetchAffiliateData} disabled={affiliateLoading}>
                            <RefreshCw className={`mr-2 h-4 w-4 ${affiliateLoading ? 'animate-spin' : ''}`} />
                            Refresh Affiliates
                        </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Eligible Referrals</CardTitle>
                                    <CardDescription>
                                        Select referrals with earned commissions to request payout.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {affiliateLoading && (
                                        <div className="space-y-4">
                                           {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
                                        </div>
                                    )}
                                    {affiliateError && (
                                        <div className="flex flex-col items-center justify-center text-center py-10">
                                            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                                            <p className="font-semibold">Failed to load referrals</p>
                                            <p className="text-muted-foreground text-sm">{affiliateError}</p>
                                        </div>
                                    )}
                                    {!affiliateLoading && !affiliateError && referrals.length === 0 && (
                                         <div className="text-center py-16 border-2 border-dashed rounded-lg">
                                            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                                            <h3 className="mt-2 text-sm font-semibold text-foreground">No Eligible Referrals</h3>
                                            <p className="mt-1 text-sm text-muted-foreground">Referrals with earned commissions will appear here.</p>
                                         </div>
                                    )}
                                    <div className="space-y-2">
                                        {referrals.map((referral) => (
                                            <Card
                                                key={referral.id}
                                                className={`p-4 cursor-pointer transition-all duration-200 ${selectedReferrals.includes(referral.id) ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : 'ring-0 hover:ring-2 hover:ring-muted-foreground/20'}`}
                                                onClick={() => handleSelectReferral(referral.id)}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <Checkbox 
                                                        checked={selectedReferrals.includes(referral.id)}
                                                        onCheckedChange={() => handleSelectReferral(referral.id)}
                                                        disabled={referral.commission <= 0}
                                                    />
                                                    <Image 
                                                        src={referral.avatar || 'https://i.pravatar.cc/150'} 
                                                        alt={referral.name} 
                                                        width={40} 
                                                        height={40} 
                                                        className="rounded-full" 
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium">{referral.name}</span>
                                                            <Badge variant={referral.level === 1 ? 'default' : 'secondary'}>
                                                                Level {referral.level}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">
                                                            Joined: {new Date(referral.joinDate).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold">KES {referral.commission.toFixed(2)}</p>
                                                        <p className="text-xs text-muted-foreground">Commission</p>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="lg:col-span-1 space-y-6">
                            <Card className="sticky top-6">
                                <CardHeader>
                                    <CardTitle>Affiliate Payout Summary</CardTitle>
                                    <CardDescription>Enter your M-Pesa number to receive commission.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                     <div>
                                        <p className="text-sm text-muted-foreground">Referrals Selected</p>
                                        <p className="text-2xl font-bold">{selectedReferrals.length}</p>
                                    </div>
                                     <div>
                                        <p className="text-sm text-muted-foreground">Total Commission</p>
                                        <p className="text-4xl font-bold text-primary">KES {selectedCommission.toFixed(2)}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="affiliatePhoneNumber" className="text-sm font-medium">M-Pesa Number</label>
                                        <Input
                                            id="affiliatePhoneNumber"
                                            type="tel"
                                            value={affiliatePhoneNumber}
                                            onChange={(e) => setAffiliatePhoneNumber(e.target.value)}
                                            placeholder="e.g., 254712345678"
                                            disabled={affiliatePayoutStatus === 'loading' || selectedReferrals.length === 0}
                                        />
                                    </div>
                                </CardContent>
                                <CardContent>
                                     <Button onClick={triggerAffiliatePayout} className="w-full" size="lg" disabled={selectedReferrals.length === 0 || affiliatePayoutStatus === 'loading' || !affiliatePhoneNumber.match(/^(254)\d{9}$/)}>
                                        {affiliatePayoutStatus === 'loading' ? <Loader2 className="animate-spin" /> : `Request Payout`}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}