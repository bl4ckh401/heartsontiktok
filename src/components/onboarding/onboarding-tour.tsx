'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, ArrowRight, ArrowLeft, Sparkles, Target, Zap } from 'lucide-react';
import { OnboardingParticles } from './particles';
import { CompletionCelebration } from './completion-celebration';
import { cn } from '@/lib/utils';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  icon: React.ElementType;
  highlight?: boolean;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Hearts on TikTok! 🎉',
    description: 'Your mission control center for creator success. This is your TikTok profile - we\'ve synced your data automatically!',
    target: '[data-ai-hint="creator avatar"]',
    position: 'bottom',
    icon: Sparkles,
    highlight: true,
  },
  {
    id: 'dashboard',
    title: 'Your Performance Hub 📊',
    description: 'Track your TikTok analytics, total earnings from brand deals, and conversion metrics. Everything you need to grow your creator business.',
    target: '[data-testid="key-metrics"]',
    position: 'top',
    icon: Target,
  },
  {
    id: 'campaigns',
    title: 'Brand Campaigns 🤝',
    description: 'Connect with brands, create sponsored content campaigns, and manage your partnerships. This is where the magic happens!',
    target: 'a[href="/dashboard/campaigns/list"]',
    position: 'right',
    icon: Zap,
  },
  {
    id: 'payouts',
    title: 'Instant M-Pesa Payouts 💰',
    description: 'Get paid instantly to your M-Pesa account. No waiting, no hassle - just instant payments for your hard work.',
    target: 'a[href="/dashboard/payouts"]',
    position: 'right',
    icon: Zap,
  },
  {
    id: 'affiliates',
    title: 'Grow Your Network 🚀',
    description: 'Invite other creators and earn commissions. Build your creator community and increase your passive income.',
    target: 'a[href="/dashboard/affiliates"]',
    position: 'right',
    icon: Zap,
  },
];

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingTour({ isOpen, onClose }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const step = onboardingSteps[currentStep];

  useEffect(() => {
    if (!isOpen || !step) return;

    const findTarget = () => {
      const element = document.querySelector(step.target) as HTMLElement;
      if (element) {
        setTargetElement(element);
        
        // Add highlight class
        element.classList.add('onboarding-highlight');
        
        // Calculate tooltip position
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        let top = 0;
        let left = 0;
        
        switch (step.position) {
          case 'top':
            top = rect.top + scrollTop - 120;
            left = rect.left + scrollLeft + rect.width / 2 - 200;
            break;
          case 'bottom':
            top = rect.bottom + scrollTop + 20;
            left = rect.left + scrollLeft + rect.width / 2 - 200;
            break;
          case 'left':
            top = rect.top + scrollTop + rect.height / 2 - 100;
            left = rect.left + scrollLeft - 420;
            break;
          case 'right':
            top = rect.top + scrollTop + rect.height / 2 - 100;
            left = rect.right + scrollLeft + 20;
            break;
        }
        
        // Ensure tooltip stays within viewport
        const maxLeft = window.innerWidth - 420;
        const maxTop = window.innerHeight - 200;
        
        setTooltipPosition({
          top: Math.max(20, Math.min(top, maxTop)),
          left: Math.max(20, Math.min(left, maxLeft)),
        });
        
        // Scroll element into view
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    // Try to find target immediately
    findTarget();
    
    // If not found, try again after a short delay
    const timeout = setTimeout(findTarget, 100);
    
    return () => {
      clearTimeout(timeout);
      if (targetElement) {
        targetElement.classList.remove('onboarding-highlight');
      }
    };
  }, [currentStep, isOpen, step, targetElement]);

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const [showCelebration, setShowCelebration] = useState(false);

  const handleClose = () => {
    if (targetElement) {
      targetElement.classList.remove('onboarding-highlight');
    }
    
    if (currentStep === onboardingSteps.length - 1) {
      setShowCelebration(true);
    } else {
      localStorage.setItem('onboarding-completed', 'true');
      onClose();
    }
  };

  const handleCelebrationClose = () => {
    setShowCelebration(false);
    localStorage.setItem('onboarding-completed', 'true');
    onClose();
  };

  if (!isOpen || !step) return null;

  const Icon = step.icon;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300" />
      
      {/* Particles */}
      <OnboardingParticles />
      
      {/* Tooltip */}
      <Card 
        className="fixed z-50 w-96 shadow-2xl border-primary/20 bg-gradient-to-br from-card/95 to-card/90 backdrop-blur-sm transition-all duration-300 animate-in fade-in-0 zoom-in-95"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
        }}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="secondary" className="text-xs bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                {currentStep + 1} of {onboardingSteps.length}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="text-muted-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              
              <div className="flex gap-1">
                {onboardingSteps.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "h-2 w-2 rounded-full transition-colors",
                      index === currentStep ? "bg-primary" : "bg-muted"
                    )}
                  />
                ))}
              </div>
              
              <Button
                size="sm"
                onClick={nextStep}
                className="bg-primary hover:bg-primary/90"
              >
                {currentStep === onboardingSteps.length - 1 ? 'Finish' : 'Next'}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <CompletionCelebration 
        isVisible={showCelebration} 
        onClose={handleCelebrationClose} 
      />
    </>
  );
}