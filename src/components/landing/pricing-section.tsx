
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
    name: 'Creator',
    price: '$0',
    frequency: '/month',
    description: 'For creators just getting started.',
    features: [
      'Access to public campaigns',
      'Instant video performance analytics',
      'Standard payouts',
      'Community support',
    ],
    cta: 'Get Started for Free',
    href: '/login',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$29',
    frequency: '/month',
    description: 'For professional creators scaling their brand.',
    features: [
      'Everything in Creator, plus:',
      'Exclusive brand partnerships',
      'Advanced analytics & trend insights',
      'Priority payouts',
      'Dedicated email support',
    ],
    cta: 'Upgrade to Pro',
    href: '/login',
    popular: true,
  },
  {
    name: 'Business',
    price: 'Contact Us',
    frequency: '',
    description: 'For agencies and brands managing multiple creators.',
    features: [
      'Everything in Pro, plus:',
      'Multi-user team access',
      'Campaign management tools',
      'Custom reporting & API access',
      'Dedicated account manager',
    ],
    cta: 'Contact Sales',
    href: '#',
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="container py-24 sm:py-32">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">
          Choose the Plan That's Right for You
        </h2>
        <p className="text-xl text-muted-foreground mt-2">
          Simple, transparent pricing for creators at every level.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            className={`flex flex-col border-2 ${
              tier.popular ? 'border-primary shadow-lg' : 'border-border'
            }`}
          >
            <CardHeader className="relative">
              {tier.popular && (
                <div className="absolute top-0 right-6 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 text-sm font-semibold rounded-full">
                  Most Popular
                </div>
              )}
              <CardTitle>{tier.name}</CardTitle>
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
                    <Check className="h-5 w-5 text-green-500 mr-3" />
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
