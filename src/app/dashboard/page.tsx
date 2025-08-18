import {
  Activity,
  DollarSign,
  Megaphone,
  Users,
} from 'lucide-react';
import { AnomalyDetector } from '@/components/anomaly-detector';
import {
  Card,
  CardContent,
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
import type { Campaign } from '@/types';

const metricCards = [
  {
    title: 'Total Earnings',
    icon: DollarSign,
    value: '$45,231.89',
    change: '+20.1% from last month',
  },
  {
    title: 'Active Campaigns',
    icon: Megaphone,
    value: '12',
    change: '+2 since last week',
  },
  {
    title: 'Total Followers',
    icon: Users,
    value: '235k',
    change: '+180.1% from last month',
  },
  {
    title: 'Engagement Rate',
    icon: Activity,
    value: '5.7%',
    change: '+0.5% from last month',
  },
];

const campaigns: Campaign[] = [
    { id: 'CMP-001', name: 'Summer Sale', brand: 'FashionNova', status: 'Active', impressions: 120500, clicks: 8200, ctr: '6.80%', earnings: 1500.00 },
    { id: 'CMP-002', name: 'New Product Launch', brand: 'Techtronics', status: 'Active', impressions: 350000, clicks: 15050, ctr: '4.30%', earnings: 4500.00 },
    { id: 'CMP-003', name: 'Holiday Special', brand: 'Gourmet Foods', status: 'Completed', impressions: 800200, clicks: 95200, ctr: '11.90%', earnings: 12500.00 },
    { id: 'CMP-004', name: 'Brand Awareness', brand: 'EcoLiving', status: 'Pending', impressions: 0, clicks: 0, ctr: '0.00%', earnings: 0.00 },
    { id: 'CMP-005', name: 'Q4 Gaming Collab', brand: 'GameSphere', status: 'Active', impressions: 1250000, clicks: 65000, ctr: '5.20%', earnings: 9800.00 },
];

const statusVariant = {
  Active: 'default',
  Completed: 'secondary',
  Pending: 'outline',
} as const;

export default function DashboardPage() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {metricCards.map(card => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Earnings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map(campaign => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <div className="font-medium">{campaign.name}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        {campaign.brand}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[campaign.status]}>
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      ${campaign.earnings.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <div className="lg:col-span-2 xl:col-span-1">
          <AnomalyDetector />
        </div>
      </div>
    </>
  );
}
