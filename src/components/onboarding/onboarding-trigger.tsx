'use client';

import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { useOnboarding } from './onboarding-provider';

export function OnboardingTrigger() {
  const { startOnboarding } = useOnboarding();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={startOnboarding}
      className="text-muted-foreground hover:text-primary"
      title="Take a tour"
    >
      <HelpCircle className="h-5 w-5" />
    </Button>
  );
}