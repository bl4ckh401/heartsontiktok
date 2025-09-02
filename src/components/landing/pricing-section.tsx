
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
    price: 'KES 500',
    frequency: '/lifetime',
    description: 'Perfect for starting your monetization journey.',
    features: [
      'Earn KES 0.005 per 1000 Likes',
      'Access to public campaigns',
      'Standard video performance analytics',
      'Standard payouts',
      'Community support',
    ],
    cta: 'Choose Gold',
    href: '/login?plan=Gold',
    popular: false,
  },
  {
    name: 'Platinum',
    price: 'KES 750',
    frequency: '/lifetime',
    description: 'For creators ready to accelerate their growth.',
    features: [
      'Earn KES 0.0075 per 1000 Likes',
      'Access to exclusive brand campaigns',
      'Advanced analytics & trend insights',
      'Priority payouts',
      'Dedicated email support',
    ],
    cta: 'Choose Platinum',
    href: '/login?plan=Platinum',
    popular: true,
  },
  {
    name: 'Diamond',
    price: 'KES 1000',
    frequency: '/lifetime',
    description: 'The ultimate toolkit for professional creators.',
    features: [
      'Earn KES 0.01 per 1000 Likes',
      'First access to premium campaigns',
      'AI-powered content strategy tools',
      'Instant payouts',
      'Dedicated account manager',
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
              tier.popular ? 'border-primary shadow-2xl scale-105' : 'border-border'
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
