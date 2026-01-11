'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle, X, Play, BookOpen } from 'lucide-react';
import { useOnboarding } from './onboarding-provider';
import { cn } from '@/lib/utils';

export function FloatingHelp() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { startOnboarding, hasCompletedOnboarding } = useOnboarding();

  if (!hasCompletedOnboarding) return null;

  return (
    <div className="fixed bottom-6 right-6 z-30">
      {isExpanded && (
        <Card className="mb-4 w-64 shadow-lg border-primary/20 bg-card/95 backdrop-blur-sm animate-in slide-in-from-bottom-2 duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Need help?</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(false)}
                className="h-6 w-6"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  startOnboarding();
                  setIsExpanded(false);
                }}
                className="w-full justify-start text-xs"
              >
                <Play className="h-3 w-3 mr-2" />
                Take the tour again
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs"
                asChild
              >
                <a href="mailto:support@likezzbuddy.com">
                  <BookOpen className="h-3 w-3 mr-2" />
                  Contact support
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90 transition-all duration-200",
          isExpanded && "rotate-180"
        )}
      >
        <HelpCircle className="h-6 w-6" />
      </Button>
    </div>
  );
}