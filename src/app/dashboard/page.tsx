
'use client';
import {
  BarChart,
  Bar,
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

const userProfile = {
  avatar: 'https://placehold.co/64x64.png',
  name: 'couple_up_app',
  bio: 'Love in frames & moments ❤️',
  likes: '1.6K',
  followers: '5',
  following: '58',
};

const keyMetrics = {
  videoViews: { value: '5.4K', change: '+5,407', changeType: 'increase' },
  profileViews: { value: '50', change: '+50', changeType: 'increase' },
  likes: { value: '327', change: '+327', changeType: 'increase' },
  comments: { value: '1', change: '+1', changeType: 'increase' },
  shares: { value: '6', change: '+6', changeType: 'increase' },
};

const chartData = [
  { name: 'Aug 16', views: 0 },
  { name: 'Aug 17', views: 0 },
  { name: 'Aug 18', views: 1000 },
  { name: 'Aug 19', views: 1800 },
  { name: 'Aug 20', views: 3551 },
  { name: 'Aug 21', views: 1200 },
  { name: 'Aug 22', views: 900 },
];

const recentVideos = [
  {
    thumbnail: 'https://placehold.co/120x160.png',
    title: 'Our latest trip to the mountains!',
    views: '1.2M',
    likes: '89.1K',
    comments: '2,345',
    status: 'Active',
  },
  {
    thumbnail: 'https://placehold.co/120x160.png',
    title: 'How to make the perfect coffee',
    views: '8M',
    likes: '1.2M',
    comments: '12.5K',
    status: 'Active',
  },
  {
    thumbnail: 'https://placehold.co/120x160.png',
    title: 'Unboxing the new tech gadget',
    views: '450K',
    likes: '22K',
    comments: '876',
    status: 'Completed',
  },
  {
    thumbnail: 'https://placehold.co/120x160.png',
    title: 'A day in the life of a creator',
    views: '2.1M',
    likes: '150K',
    comments: '4,120',
    status: 'Active',
  },
];

const MetricCard = ({ title, value, change, changeType, icon: Icon }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center">
            <span className={changeType === 'increase' ? 'text-green-500' : 'text-red-500'}>
                {change}
            </span>
        </p>
      </CardContent>
    </Card>
);

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 flex items-center space-x-4">
          <Image
            src={userProfile.avatar}
            alt="User Avatar"
            width={64}
            height={64}
            className="rounded-full"
            data-ai-hint="creator avatar"
          />
          <div>
            <h2 className="text-2xl font-bold">{userProfile.name}</h2>
            <p className="text-muted-foreground">{userProfile.bio}</p>
            <div className="text-sm text-muted-foreground mt-1">
              <span>{userProfile.likes} Likes</span> &middot;{' '}
              <span>{userProfile.followers} Followers</span> &middot;{' '}
              <span>{userProfile.following} Following</span>
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
            <MetricCard title="Video Views" {...keyMetrics.videoViews} icon={Video} />
            <MetricCard title="Profile Views" {...keyMetrics.profileViews} icon={Users} />
            <MetricCard title="Likes" {...keyMetrics.likes} icon={Heart} />
            <MetricCard title="Comments" {...keyMetrics.comments} icon={MessageCircle} />
            <MetricCard title="Shares" {...keyMetrics.shares} icon={Share2} />
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
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Views</TableHead>
                <TableHead className="hidden md:table-cell">Likes</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentVideos.map((video) => (
                <TableRow key={video.title}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt="Product image"
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={video.thumbnail}
                      width="64"
                      data-ai-hint="video thumbnail"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{video.title}</TableCell>
                  <TableCell>
                    <Badge variant={video.status === 'Active' ? 'default' : 'outline'}>{video.status}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{video.views}</TableCell>
                  <TableCell className="hidden md:table-cell">{video.likes}</TableCell>
                  <TableCell>
                    {/* Actions can go here */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
