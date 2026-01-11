
'use client';
import { useEffect, useState } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { TrendingUp, Users, Video, MessageCircle, Heart, Share2, ArrowUp, ArrowDown, Sparkles } from 'lucide-react';
import Cookies from 'js-cookie';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const MetricCard = ({ title, value, change, changeType, icon: Icon, delay = 0 }: any) => {
  // Ensure value is safe to render
  const safeValue = typeof value === 'object' ? JSON.stringify(value) : value;
  const safeChange = typeof change === 'object' ? '' : change;

  return (
    <div 
    className={cn(
      "glass-card rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(var(--primary),0.2)] group animate-fade-in-up",
      delay && `animate-delay-${delay}`
    )}
  >
    <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-white/5 group-hover:bg-gradient-to-br group-hover:from-primary/20 group-hover:to-secondary/20 transition-colors">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        {safeChange && safeChange !== 'N/A' && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border",
            changeType === 'increase' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
              changeType === 'decrease' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                'bg-white/5 text-muted-foreground border-white/10'
          )}>
            {changeType === 'increase' ? <ArrowUp className="h-3 w-3" /> : changeType === 'decrease' ? <ArrowDown className="h-3 w-3" /> : null}
            {safeChange}
          </div>
        )}
    </div>
    <div className="space-y-1">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="text-3xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent group-hover:from-primary group-hover:to-secondary transition-all">
          {safeValue}
        </div>
    </div>
  </div>
  );
};

interface AffiliateSummary {
  totalEarnings: number;
  totalConversions: number;
}

export default function DashboardPage() {
  const [userProfile, setUserProfile] = useState<any>({});
  const [recentVideos, setRecentVideos] = useState<any[]>([]);
  const [keyMetrics, setKeyMetrics] = useState<any>({
    videoViews: { value: 'N/A', change: 'N/A', changeType: 'neutral' },
    profileViews: { value: 'N/A', change: 'N/A', changeType: 'neutral' },
    likes: { value: 'N/A', change: 'N/A', changeType: 'neutral' },
    comments: { value: 'N/A', change: 'N/A', changeType: 'neutral' },
    shares: { value: 'N/A', change: 'N/A', changeType: 'neutral' },
  });
  const [affiliateSummary, setAffiliateSummary] = useState<AffiliateSummary | null>(null);
  const [loadingAffiliateSummary, setLoadingAffiliateSummary] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const storedUserInfo = Cookies.get('user_info');
        if (storedUserInfo) {
          const userInfoData = JSON.parse(storedUserInfo);
          setUserProfile(userInfoData);
           setKeyMetrics((prevState: any) => ({
            ...prevState,
            likes: { ...prevState.likes, value: userInfoData.likes_count?.toLocaleString() || '0' },
            videoViews: { ...prevState.videoViews, value: userInfoData.video_count?.toLocaleString() || '0' },
          }));
        }

        const videoListResponse = await fetch('/api/videos');
        if (!videoListResponse.ok) {
          // Handle error silently or log
          console.error('Failed to fetch videos');
        } else {
          const videoListData = await videoListResponse.json();
    
          if (videoListData.videos) {
            setRecentVideos(videoListData.videos);

            const totalComments = videoListData.videos.reduce((sum: number, v: any) => sum + (v.comment_count || 0), 0);
            const totalShares = videoListData.videos.reduce((sum: number, v: any) => sum + (v.share_count || 0), 0);

            setKeyMetrics((prev: any) => ({
              ...prev,
              comments: { ...prev.comments, value: totalComments.toLocaleString() },
              shares: { ...prev.shares, value: totalShares.toLocaleString() }
            }));

              // Prepare chart data (reverse to show oldest to newest left to right)
              const data = videoListData.videos.map((v: any, index: number) => ({
                name: `Video ${videoListData.videos.length - index}`, // Better labeling
                views: v.view_count || 0,
                likes: v.like_count || 0,
              })).reverse();
              setChartData(data);
            }
        }

        // Fetch affiliate summary
        setLoadingAffiliateSummary(true);
        const affiliateResponse = await fetch('/api/affiliate/summary');
        if (affiliateResponse.ok) {
          const result = await affiliateResponse.json();
          if (result.success) {
            setAffiliateSummary(result.data);
             }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoadingAffiliateSummary(false);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome / Header Card */}
      <div className="glass-panel rounded-3xl p-8 relative overflow-hidden animate-fade-in-up">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl -z-10" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <Image
              src={userProfile.avatar_url || 'https://placehold.co/64x64.png'}
              alt={userProfile.display_name || 'User Avatar'}
              width={80}
              height={80}
              className="relative rounded-full border-2 border-white/20 shadow-xl"
              data-ai-hint="creator avatar"
            />
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              Welcome back, {userProfile.display_name || 'Creator'}!
            </h2>
            <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              {userProfile.bio_description || "Ready to create some viral content today?"}
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground/80 pt-2">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 shadow-sm">{userProfile.likes_count?.toLocaleString() || 0} Likes</span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 shadow-sm">{userProfile.follower_count?.toLocaleString() || 0} Followers</span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 shadow-sm">{userProfile.following_count?.toLocaleString() || 0} Following</span>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="text-xs text-muted-foreground mb-1">Today's Earnings</p>
              <p className="text-2xl font-bold text-primary">
                KES {affiliateSummary?.totalEarnings.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <MetricCard title="Total Earnings" value={loadingAffiliateSummary ? 'Loading...' : `KES ${affiliateSummary?.totalEarnings.toFixed(2) || '0.00'}`} icon={TrendingUp} delay={100} />
        <MetricCard title="Conversions" value={loadingAffiliateSummary ? 'Loading...' : affiliateSummary?.totalConversions.toLocaleString() || '0'} icon={Users} delay={100} />
        <MetricCard title="Videos Posted" value={userProfile.video_count?.toLocaleString() || '0'} icon={Video} delay={200} />
        <MetricCard title="Total Likes" value={userProfile.likes_count?.toLocaleString() || '0'} icon={Heart} delay={200} />
        <MetricCard title="Comments" value={keyMetrics.comments.value} icon={MessageCircle} delay={300} />
        <MetricCard title="Shares" value={keyMetrics.shares.value} icon={Share2} delay={300} />
      </div>

      {/* Chart Section */}
      <div className="glass-card rounded-3xl p-6 animate-fade-in-up animate-delay-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <CardTitle className="text-xl">Performance Overview</CardTitle>
            <CardDescription>Views across your recent videos</CardDescription>
          </div>
          <Select defaultValue="30">
            <SelectTrigger className="w-[150px] bg-white/5 border-white/10">
              <SelectValue placeholder="Last 30 days" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
        </div>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                dy={10}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
              />
                <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="glass-panel p-3 rounded-xl border border-white/20 shadow-xl">
                        <p className="font-medium text-sm mb-2">{label}</p>
                        <div className="flex items-center gap-2 text-xs text-primary font-bold">
                          <span className="w-2 h-2 rounded-full bg-primary" />
                          {payload[0].value?.toLocaleString()} Views
                        </div>
                      </div>
                    );
                  }
                  return null;
                  }}
                />
              <Area
                type="monotone"
                dataKey="views"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorViews)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Videos Table */}
      <div className="glass-card rounded-3xl p-6 animate-fade-in-up animate-delay-300">
        <div className="flex justify-between items-center mb-6">
          <div>
            <CardTitle className="text-xl">Recent Videos</CardTitle>
            <CardDescription>Detailed engagement stats per video</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="bg-transparent border-white/10 hover:bg-white/5">View All</Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="w-[80px]">Media</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Likes</TableHead>
              <TableHead className="text-right">Comments</TableHead>
              <TableHead className="text-right">Shares</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Skeleton loading state
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-white/5">
                  <TableCell><Skeleton className="h-12 w-12 rounded-lg bg-white/5" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40 bg-white/5" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16 ml-auto bg-white/5" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16 ml-auto bg-white/5" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16 ml-auto bg-white/5" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16 ml-auto bg-white/5" /></TableCell>
                </TableRow>
              ))
            ) : recentVideos.length > 0 ? (
              recentVideos.map((video) => (
                <TableRow key={video.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                  <TableCell>
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 group-hover:border-primary/50 transition-colors">
                      <Image
                        alt={video.title || 'Video thumbnail'}
                          className="object-cover"
                          fill
                          src={video.cover_image_url || 'https://placehold.co/64x64.png'}
                          unoptimized
                          onError={(e) => (e.currentTarget.src = 'https://placehold.co/64x64.png')}
                          data-ai-hint="video thumbnail"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-sm text-foreground/90 group-hover:text-white transition-colors">
                      {video.title || 'Untitled Video'}
                    </TableCell>
                    <TableCell className="text-right text-sm">{video.view_count?.toLocaleString() || 0}</TableCell>
                    <TableCell className="text-right text-sm">{video.like_count?.toLocaleString() || 0}</TableCell>
                    <TableCell className="text-right text-sm">{video.comment_count?.toLocaleString() || 0}</TableCell>
                    <TableCell className="text-right text-sm">{video.share_count?.toLocaleString() || 0}</TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No videos found. Start creating to see stats here!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
    