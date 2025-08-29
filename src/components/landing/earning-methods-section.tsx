
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
    title: 'Direct Campaign Payouts',
    description:
      'Participate in campaigns from top brands and get paid directly for your content based on fixed rates or performance metrics.',
  },
  {
    icon: <Gift className="h-8 w-8 text-primary" />,
    title: 'Affiliate Program',
    description:
      'Invite other creators to hearts on tiktok and earn a 10% commission on the views from every video they post. Build a recurring revenue stream with our multi-level referral system.',
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Performance Bonuses',
    description:
      'Unlock special bonuses and rewards for top-performing content that exceeds campaign goals and drives exceptional engagement.',
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
