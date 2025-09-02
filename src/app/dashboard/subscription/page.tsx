
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Check, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const tiers = [
  {
    id: 'Gold',
    name: 'Gold',
    price: 500,
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
    popular: false,
  },
  {
    id: 'Platinum',
    name: 'Platinum',
    price: 750,
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
    popular: true,
  },
  {
    id: 'Diamond',
    name: 'Diamond',
    price: 1000,
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
    popular: false,
  },
];

type Plan = (typeof tiers)[0];

export default function SubscriptionPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);

  useEffect(() => {
    const planId = searchParams.get('plan');
    if (planId) {
      const planFromUrl = tiers.find(t => t.id.toLowerCase() === planId.toLowerCase());
      if (planFromUrl) {
        handleChoosePlan(planFromUrl);
      }
      // Clean the URL
      router.replace('/dashboard/subscription', { scroll: false });
    }
  }, [searchParams, router]);

  useEffect(() => {
    // Fetch user's current subscription status
    const fetchUserStatus = async () => {
        try {
            const response = await fetch('/api/user/status');
            const data = await response.json();
            if (data.success && data.subscriptionStatus === 'ACTIVE') {
                setCurrentPlan(data.subscriptionPlan);
            }
        } catch (error) {
            console.error("Failed to fetch user status", error);
        }
    };
    fetchUserStatus();
  }, []);

  const handleChoosePlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleSubscribe = async () => {
    if (!selectedPlan) return;

    if (!phoneNumber.match(/^(254)\d{9}$/)) {
        toast({
            title: 'Invalid Phone Number',
            description: 'Please enter a valid Safaricom number in the format 254XXXXXXXXX.',
            variant: 'destructive'
        });
        return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan.name, phoneNumber }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to initiate subscription.');
      }
      
      toast({
        title: 'Check your phone!',
        description: `An M-Pesa payment prompt for KES ${selectedPlan.price} has been sent to your phone. Please complete the transaction.`,
      });
      
      setIsModalOpen(false);
      setPhoneNumber('');

    } catch (error: any) {
      toast({
        title: 'Subscription Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          {currentPlan ? `You are on the ${currentPlan} Plan` : 'Choose Your Path to Success'}
        </h1>
        <p className="text-xl text-muted-foreground mt-2">
          {currentPlan ? 'Manage your subscription or upgrade to a different plan.' : 'Upgrade your plan to unlock more features and earning potential.'}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            className={`flex flex-col border-2 ${
              tier.popular
                ? 'border-primary shadow-2xl scale-105'
                : 'border-border'
            } ${
              currentPlan === tier.name ? 'ring-2 ring-offset-2 ring-offset-background ring-green-500' : ''
            }`}
          >
            <CardHeader className="relative">
              {tier.popular && (
                <div className="absolute top-0 right-6 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 text-sm font-semibold rounded-full shadow-lg">
                  Most Popular
                </div>
              )}
               {currentPlan === tier.name && (
                <div className="absolute top-0 left-6 -translate-y-1/2 bg-green-500 text-white px-3 py-1 text-sm font-semibold rounded-full shadow-lg">
                  Current Plan
                </div>
              )}
              <CardTitle className="text-2xl pt-4">{tier.name}</CardTitle>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">KES {tier.price}</span>
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
              <Button
                className="w-full"
                variant={tier.popular ? 'default' : 'outline'}
                onClick={() => handleChoosePlan(tier)}
                disabled={currentPlan === tier.name}
              >
                {currentPlan === tier.name ? 'Your Current Plan' : tier.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Subscribe to {selectedPlan?.name} Plan</DialogTitle>
            <DialogDescription>
              Enter your M-Pesa phone number to complete the subscription for KES {selectedPlan?.price}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
             <Label htmlFor="phone">M-Pesa Phone Number</Label>
             <Input
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="254712345678"
                disabled={isLoading}
             />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isLoading}>Cancel</Button>
            <Button onClick={handleSubscribe} disabled={isLoading || !phoneNumber}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Processing...' : `Subscribe for KES ${selectedPlan?.price}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
