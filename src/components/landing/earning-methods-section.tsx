
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DollarSign, Gift, Users } from 'lucide-react';

const earningMethods = [
  {
    icon: <DollarSign className="h-8 w-8 text-primary" />,
    title: 'Video Performance Payouts',
    description:
      'Earn KES 50 for every 1,000 likes on your campaign videos. Get paid based on actual engagement with daily payout limits based on your plan.',
  },
  {
    icon: <Gift className="h-8 w-8 text-primary" />,
    title: '4-Level Affiliate Program',
    description:
      'Earn 30% commission from direct referrals and 5% from 4 levels of indirect referrals. Build recurring income from subscription payments of your referral network.',
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Campaign Participation',
    description:
      'Join multiple campaigns per month based on your plan (3-10 campaigns). Participate in brand campaigns and monetize your TikTok content effectively.',
  },
];

export function EarningMethodsSection() {
  return (
    <section id="earning-methods" className="bg-muted/50 py-24 sm:py-32">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Multiple Ways to{' '}
            <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
              Monetize Your Influence
            </span>
          </h2>
          <p className="text-xl text-muted-foreground mt-2">
            hearts on tiktok provides a suite of tools to help you turn your creativity into a career.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {earningMethods.map(({ icon, title, description }) => (
            <Card key={title} className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                    {icon}
                </div>
                <CardTitle className="pt-4">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
