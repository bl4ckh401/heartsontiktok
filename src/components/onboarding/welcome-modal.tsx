'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, Zap, Users, X } from 'lucide-react';
import { useOnboarding } from './onboarding-provider';

const features = [
  {
    icon: TrendingUp,
    title: 'Track Performance',
    description: 'Monitor your TikTok analytics and growth metrics in real-time.',
  },
  {
    icon: Zap,
    title: 'Instant Payouts',
    description: 'Get paid instantly via M-Pesa for your content and collaborations.',
  },
  {
    icon: Users,
    title: 'Brand Partnerships',
    description: 'Connect with brands and manage lucrative partnership campaigns.',
  },
];

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { startOnboarding, hasCompletedOnboarding } = useOnboarding();

  useEffect(() => {
    if (!hasCompletedOnboarding) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [hasCompletedOnboarding]);

  const handleStartTour = () => {
    setIsOpen(false);
    startOnboarding();
  };

  const handleSkip = () => {
    setIsOpen(false);
    localStorage.setItem('onboarding-completed', 'true');
  };

  if (!isOpen || hasCompletedOnboarding) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-primary/20 bg-card/95 backdrop-blur-sm animate-in fade-in-0 zoom-in-95 duration-300">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1" />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSkip}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20">
              <Sparkles className="h-12 w-12 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome to Hearts on TikTok!
          </CardTitle>
          <p className="text-muted-foreground text-lg mt-2">
            Your mission control center for creator success
          </p>
          <Badge variant="secondary" className="mt-4 mx-auto">
            🚀 Let's get you started
          </Badge>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="text-center p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                >
                  <div className="flex justify-center mb-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={handleStartTour}
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold"
              size="lg"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Take the Tour
            </Button>
            <Button
              variant="outline"
              onClick={handleSkip}
              className="sm:w-auto"
              size="lg"
            >
              Skip for now
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center">
            You can always start the tour later by clicking the help icon in the header
          </p>
        </CardContent>
      </Card>
    </div>
  );
}