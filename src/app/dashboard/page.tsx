
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


export default function DashboardPage() {
    const [userProfile, setUserProfile] = useState<any>({});
    const [recentVideos, setRecentVideos] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);
    const [keyMetrics, setKeyMetrics] = useState<any>({
        videoViews: { value: 'N/A', change: 'N/A', changeType: 'neutral' },
        profileViews: { value: 'N/A', change: 'N/A', changeType: 'neutral' },
        likes: { value: 'N/A', change: 'N/A', changeType: 'neutral' },
        comments: { value: 'N/A', change: 'N/A', changeType: 'neutral' },
        shares: { value: 'N/A', change: 'N/A', changeType: 'neutral' },
    });

    useEffect(() => {
        const userInfoCookie = Cookies.get('user_info');
        if (userInfoCookie) {
            try {
                const userInfo = JSON.parse(userInfoCookie);
                setUserProfile(userInfo);

                // Initialize metrics from user profile if available
                setKeyMetrics((prev: any) => ({
                    ...prev,
                    likes: { ...prev.likes, value: userInfo.likes_count?.toLocaleString() || '0' },
                    videoViews: { ...prev.videoViews, value: userInfo.video_count?.toLocaleString() || '0' }
                }));
            } catch (error) {
                console.error('Failed to parse user info cookie:', error);
            }
        }
    }, []);

    useEffect(() => {
        // Fetch recent videos - this would typically be another server call
        // For now, we are simulating this with a placeholder
        const fetchRecentVideos = async () => {
          const accessToken = Cookies.get('tiktok_access_token');
          if (!accessToken) return;

          try {
            const videoFields = 'id,title,cover_image_url,embed_link,like_count,comment_count,share_count,view_count';
            // Note: The /video/list endpoint is a POST request according to TikTok docs
            const videoListResponse = await fetch(`https://open.tiktokapis.com/v2/video/list/?fields=${videoFields}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ max_count: 20 }),
            });

            const videoListData = await videoListResponse.json();

            if (videoListData.error && videoListData.error.code !== 'ok') {
                console.error('Error fetching video list:', videoListData.error);
                return;
            }

            if (videoListData.data && videoListData.data.videos) {
              setRecentVideos(videoListData.data.videos);

              // Aggregate some data for charts and metrics
              const totalViews = videoListData.data.videos.reduce((sum: number, v: any) => sum + (v.view_count || 0), 0);
              const totalComments = videoListData.data.videos.reduce((sum: number, v: any) => sum + (v.comment_count || 0), 0);
              const totalShares = videoListData.data.videos.reduce((sum: number, v: any) => sum + (v.share_count || 0), 0);

              setKeyMetrics((prev: any) => ({
                ...prev,
                videoViews: { ...prev.videoViews, value: totalViews.toLocaleString() },
                comments: { ...prev.comments, value: totalComments.toLocaleString() },
                shares: { ...prev.shares, value: totalShares.toLocaleString() }
              }));
              
              // Create some dummy chart data based on video views
              setChartData(videoListData.data.videos.map((v: any, index: number) => ({
                name: `Video ${index + 1}`,
                views: v.view_count || 0,
              })).reverse());
            }
          } catch(error) {
             console.error('Failed to fetch recent videos:', error);
          }
        };

        fetchRecentVideos();
    }, []);


        return (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 flex items-center space-x-4">
                <Image
                  src={userProfile.avatar_url || "https://placehold.co/64x64.png"}
                  alt={userProfile.display_name || "User Avatar"}
                  width={64}
                  height={64}
                  className="rounded-full"
                  data-ai-hint="creator avatar"
                />
                <div>
                  <h2 className="text-2xl font-bold">{userProfile.display_name || 'Creator Name'}</h2>
                  <p className="text-muted-foreground">{userProfile.bio_description}</p>
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
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                  <MetricCard title="Video Views" value={keyMetrics.videoViews.value} icon={Video} />
                  <MetricCard title="Profile Views" {...keyMetrics.profileViews} icon={Users} />
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
                <CardDescription>
                  Your latest video performance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
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
                      <TableRow key={video.id}>
                        <TableCell className="hidden sm:table-cell">
                          <Image
                            alt={video.title || "Video thumbnail"}
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src={video.cover_image_url || 'https://placehold.co/64x64.png'}
                            width="64"
                            unoptimized // Since TikTok URLs might not be configured in next.config.js
                            onError={(e) => e.currentTarget.src = 'https://placehold.co/64x64.png'} // Fallback image
                            data-ai-hint="video thumbnail"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{video.title || 'Untitled Video'}</TableCell>
                        <TableCell>{video.view_count?.toLocaleString() || 0}</TableCell>
                        <TableCell>{video.like_count?.toLocaleString() || 0}</TableCell>
                        <TableCell>{video.comment_count?.toLocaleString() || 0}</TableCell>
                         <TableCell>{video.share_count?.toLocaleString() || 0}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );
      }

    