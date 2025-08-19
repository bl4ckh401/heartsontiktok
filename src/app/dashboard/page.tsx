import {
  DollarSign,
  Megaphone,
  Users,
  TrendingUp,
  Activity,
  AlertTriangle,
  Sparkles,
  Bot,
} from 'lucide-react';
import Image from 'next/image';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { AnomalyDetector } from '@/components/anomaly-detector';

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

const recentCampaigns = [
  {
    brand: 'TechGlow',
    payout: '$2,500',
    logo: 'https://placehold.co/40x40.png',
    aiHint: 'technology logo',
  },
  {
    brand: 'NourishCo',
    payout: '$1,800',
    logo: 'https://placehold.co/40x40.png',
    aiHint: 'food logo',
  },
  {
    brand: 'FitLife Wear',
    payout: '$3,200',
    logo: 'https://placehold.co/40x40.png',
    aiHint: 'fitness logo',
  },
  {
    brand: 'EcoScapes',
    payout: '$2,100',
    logo: 'https://placehold.co/40x40.png',
    aiHint: 'nature logo',
  },
  {
    brand: 'Quantum Gaming',
    payout: '$4,500',
    logo: 'https://placehold.co/40x40.png',
    aiHint: 'gaming logo',
  },
];


export default function DashboardPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, Alex!</h1>
        <p className="text-muted-foreground">Here's your creator dashboard at a glance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {kpiCards.map(card => (
           <Card key={card.label} className="shadow-sm hover:shadow-md transition-shadow duration-300">
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">{card.label}</CardTitle>
               <card.icon className="h-5 w-5 text-muted-foreground" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{card.value}</div>
               <p className="text-xs text-muted-foreground">
                 <span className={card.delta.startsWith('+') ? 'text-green-500' : 'text-red-500'}>{card.delta}</span>
                 <span className="ml-2">{card.timeframe}</span>
               </p>
             </CardContent>
           </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-2">
            <Activity className="h-6 w-6" />
            Recent Activity
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Recent Campaigns</h3>
              <Carousel opts={{ align: "start" }} className="w-full">
                <CarouselContent>
                  {recentCampaigns.map((campaign, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                      <div className="p-1">
                        <Card className="group hover:shadow-lg transition-shadow duration-300">
                          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                            <Image
                              src={campaign.logo}
                              alt={`${campaign.brand} logo`}
                              width={40}
                              height={40}
                              className="rounded-full mb-3 grayscale group-hover:grayscale-0 transition-all duration-300"
                              data-ai-hint={campaign.aiHint}
                            />
                            <p className="font-semibold text-lg">{campaign.brand}</p>
                            <p className="text-primary font-bold">{campaign.payout}</p>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex" />
                <CarouselNext className="hidden sm:flex" />
              </Carousel>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Anomaly Alerts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-green-500/10 border-green-500/30 shadow-sm hover:shadow-green-500/20 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-400">
                      <Sparkles className="h-5 w-5" />
                      Viral Spike Detected
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-200/80">Your "Quantum Gaming" post is gaining traction faster than usual. Capitalize on it!</p>
                  </CardContent>
                  <div className="absolute top-0 right-0 h-16 w-16 bg-green-500/20 rounded-full -mt-4 -mr-4 blur-2xl"></div>
                </Card>
                <Card className="bg-red-500/10 border-red-500/30 shadow-sm hover:shadow-red-500/20 hover:shadow-lg transition-all duration-300">
                   <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-400">
                      <AlertTriangle className="h-5 w-5" />
                      Fraud Risk Alert
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-red-200/80">Unusual engagement patterns detected on your "NourishCo" campaign. We recommend a review.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
           <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-2">
            <Bot className="h-6 w-6" />
            AI Analyzer
          </h2>
          <AnomalyDetector />
        </div>
      </div>
    </>
  );
}