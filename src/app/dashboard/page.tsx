import {
  DollarSign,
  Megaphone,
  Users,
  TrendingUp,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const kpiCards = [
  {
    label: 'Total Earnings',
    value: '$12,345.67',
    delta: '+12.5%',
    timeframe: 'vs last 30 days',
    icon: DollarSign,
  },
  {
    label: 'Active Campaigns',
    value: '8',
    delta: '+2',
    timeframe: 'this month',
    icon: Megaphone,
  },
  {
    label: 'Follower Growth',
    value: '2,150',
    delta: '+8.1%',
    timeframe: 'this month',
    icon: Users,
  },
  {
    label: 'Engagement Rate',
    value: '4.82%',
    delta: '-0.2%',
    timeframe: 'vs last 30 days',
    icon: TrendingUp,
  },
];


export default function DashboardPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Welcome back, Alex!</h1>
        <p className="text-muted-foreground">Here's your creator dashboard at a glance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map(card => (
           <Card key={card.label}>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">{card.label}</CardTitle>
               <card.icon className="h-5 w-5 text-muted-foreground" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{card.value}</div>
               <p className="text-xs text-muted-foreground">
                 <span className={card.delta.startsWith('+') ? 'text-accent' : 'text-destructive'}>{card.delta}</span>
                 <span className="ml-2">{card.timeframe}</span>
               </p>
             </CardContent>
           </Card>
        ))}
      </div>
    </>
  );
}
