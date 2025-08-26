
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DollarSign, BarChart3, Handshake } from 'lucide-react';

interface FeatureProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

const features: FeatureProps[] = [
  {
    icon: <Handshake />,
    title: 'Streamlined Partnerships',
    description:
      'Connect with top brands, manage contracts, and track campaign performance all in one place. Say goodbye to messy spreadsheets.',
  },
  {
    icon: <DollarSign />,
    title: 'Instant Payouts',
    description:
      'Monetize your content instantly. Qualify for payouts based on performance and get paid quickly and securely.',
  },
  {
    icon: <BarChart3 />,
    title: 'Powerful Analytics',
    description:
      'Get deep insights into your audience and content performance. Understand what works and grow your brand faster.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="container py-24 sm:py-32 space-y-8">
      <h2 className="text-3xl lg:text-4xl font-bold md:text-center">
        How{' '}
        <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
          VeriFlow
        </span>{' '}
        Supercharges Your Career
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map(({ icon, title, description }: FeatureProps) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                {icon}
              </div>
              <CardTitle>{title}</CardTitle>
            </CardHeader>

            <CardContent>{description}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
