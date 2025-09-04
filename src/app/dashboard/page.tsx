
'use client';
import { useEffect, useState } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
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
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { TrendingUp, Users, Video, MessageCircle, Heart, Share2, ArrowUp, ArrowDown } from 'lucide-react';
import Cookies from 'js-cookie';

const MetricCard = ({ title, value, change, changeType, icon: Icon }: any) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground flex items-center">
        {change !== 'N/A' && (
          <span className={changeType === 'increase' ? 'text-green-500' : changeType === 'decrease' ? 'text-red-500' : ''}>
            {change}
          </span>
        )}
      </p>
    </CardContent>
  </Card>
);

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

  useEffect(() => {
    const fetchTikTokData = async () => {
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
          const errorData = await videoListResponse.json();
          throw new Error(errorData.error || 'Failed to fetch videos');
        }

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

          setChartData(videoListData.videos.map((v: any, index: number) => ({
            name: `Video ${index + 1}`,
            views: v.view_count || 0,
          })).reverse());
        } else if (videoListData.error) {
            console.error('Error from /api/videos:', videoListData.error);
        }
      } catch (error) {
        console.error('Error fetching TikTok data:', error);
      }
    };

    const fetchAffiliateSummary = async () => {
      setLoadingAffiliateSummary(true);
      try {
        const response = await fetch('/api/affiliate/summary');
        if (!response.ok) {
          throw new Error(`Failed to fetch affiliate summary: ${response.statusText}`);
        }
        const result = await response.json();
        if (result.success) {
            setAffiliateSummary(result.data);
        } else {
            throw new Error(result.message || 'Could not fetch affiliate summary');
        }
      } catch (error) {
        console.error('Error fetching affiliate summary:', error);
        setAffiliateSummary({ totalEarnings: 0, totalConversions: 0 }); // Set a default on error
      } finally {
        setLoadingAffiliateSummary(false);
      }
    };

    fetchTikTokData();
    fetchAffiliateSummary();
  }, []);

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardContent className="p-6 flex items-center space-x-4">
          <Image
            src={userProfile.avatar_url || 'https://placehold.co/64x64.png'}
            alt={userProfile.display_name || 'User Avatar'}
            width={64}
            height={64}
            className="rounded-full"
            data-ai-hint="creator avatar"
          />
          <div>
            <h2 className="text-2xl font-bold">{userProfile.display_name || 'Creator Name'}</h2>
            <p className="text-muted-foreground text-sm md:text-base">{userProfile.bio_description}</p>
            <div className="text-sm text-muted-foreground mt-1">
              <span>{userProfile.likes_count?.toLocaleString()} Likes</span> &middot;{' '}
              <span>{userProfile.follower_count?.toLocaleString()} Followers</span> &middot;{' '}
              <span>{userProfile.following_count?.toLocaleString()} Following</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Key Metrics</CardTitle>
            <Select defaultValue="7">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <MetricCard title="Videos Posted" value={userProfile.video_count?.toLocaleString() || '0'} icon={Video} />
            <MetricCard
              title="Total Earnings"
              value={loadingAffiliateSummary ? 'Loading...' : `KES ${affiliateSummary?.totalEarnings.toFixed(2) || '0.00'}`}
              icon={TrendingUp}
            />
            <MetricCard
              title="Conversions"
              value={loadingAffiliateSummary ? 'Loading...' : affiliateSummary?.totalConversions.toLocaleString() || '0'} icon={Users} />
            <MetricCard title="Likes" value={userProfile.likes_count?.toLocaleString() || '0'} icon={Heart} />
            <MetricCard title="Comments" value={keyMetrics.comments.value} icon={MessageCircle} />
            <MetricCard title="Shares" value={keyMetrics.shares.value} icon={Share2} />
          </div>
          <div className="mt-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                  }}
                />
                <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Videos</CardTitle>
          <CardDescription>Your latest video performance.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Thumbnail</span>
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Likes</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead>Shares</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentVideos.map((video) => (
                <TableRow key={video.id} className="hover:bg-muted/50">
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt={video.title || 'Video thumbnail'}
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={video.cover_image_url || 'https://placehold.co/64x64.png'}
                      width="64"
                      unoptimized
                      onError={(e) => (e.currentTarget.src = 'https://placehold.co/64x64.png')}
                      data-ai-hint="video thumbnail"
                    />
                  </TableCell>
                  <TableCell className="font-medium text-sm">{video.title || 'Untitled Video'}</TableCell>
                  <TableCell className="text-sm">{video.view_count?.toLocaleString() || 0}</TableCell>
                  <TableCell className="text-sm">{video.like_count?.toLocaleString() || 0}</TableCell>
                  <TableCell className="text-sm">{video.comment_count?.toLocaleString() || 0}</TableCell>
                  <TableCell className="text-sm">{video.share_count?.toLocaleString() || 0}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

    