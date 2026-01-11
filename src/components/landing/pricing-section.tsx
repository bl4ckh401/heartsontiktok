import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Check } from 'lucide-react';
import Link from 'next/link';

const tiers = [
  {
    name: 'Gold',
    price: 'KES 1,000',
    frequency: '/lifetime',
    description: 'Perfect for starting your monetization journey.',
    features: [
      'Earn KES 50 per 1000 Likes',
      'Participate in 3 campaigns per month',
      'Daily payout limit: KES 10,000',
      '30% direct referral commission',
      '5% indirect referral commission (4 levels)',
      'M-Pesa payouts',
    ],
    cta: 'Choose Gold',
    href: '/login?plan=Gold',
    popular: false,
  },
  {
    name: 'Platinum',
    price: 'KES 3,000',
    frequency: '/lifetime',
    description: 'For creators ready to accelerate their growth.',
    features: [
      'Earn KES 50 per 1000 Likes',
      'Participate in 5 campaigns per month',
      'Daily payout limit: KES 15,000',
      '30% direct referral commission',
      '5% indirect referral commission (4 levels)',
      'Priority M-Pesa payouts',
    ],
    cta: 'Choose Platinum',
    href: '/login?plan=Platinum',
    popular: true,
  },
  {
    name: 'Diamond',
    price: 'KES 5,500',
    frequency: '/lifetime',
    description: 'The ultimate toolkit for professional creators.',
    features: [
      'Earn KES 50 per 1000 Likes',
      'Participate in 10 campaigns per month',
      'Daily payout limit: KES 20,000',
      '30% direct referral commission',
      '5% indirect referral commission (4 levels)',
      'Instant M-Pesa payouts',
    ],
    cta: 'Choose Diamond',
    href: '/login?plan=Diamond',
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="container py-24 sm:py-32">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">
          Choose Your Path to Success
        </h2>
        <p className="text-xl text-muted-foreground mt-2">
          Simple, transparent pricing for creators at every level.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            className={`flex flex-col border-2 ${
              tier.popular ? 'border-primary md:shadow-2xl md:scale-105' : 'border-border'
            }`}
          >
            <CardHeader className="relative">
              {tier.popular && (
                <div className="absolute top-0 right-6 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 text-sm font-semibold rounded-full shadow-lg">
                  Most Popular
                </div>
              )}
              <CardTitle className='text-2xl'>{tier.name}</CardTitle>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">{tier.price}</span>
                {tier.frequency && (
                  <span className="text-muted-foreground ml-1">
                    {tier.frequency}
                  </span>
                )}
              </div>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-4">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" variant={tier.popular ? 'default' : 'outline'}>
                <Link href={tier.href}>{tier.cta}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}