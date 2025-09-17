'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface OnboardingContextType {
  isOnboardingOpen: boolean;
  startOnboarding: () => void;
  closeOnboarding: () => void;
  hasCompletedOnboarding: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(true);

  useEffect(() => {
    const completed = localStorage.getItem('onboarding-completed');
    const hasCompleted = completed === 'true';
    setHasCompletedOnboarding(hasCompleted);
    
    // Auto-start onboarding for new users after a short delay
    if (!hasCompleted) {
      const timer = setTimeout(() => {
        setIsOnboardingOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const startOnboarding = () => {
    setIsOnboardingOpen(true);
  };

  const closeOnboarding = () => {
    setIsOnboardingOpen(false);
    setHasCompletedOnboarding(true);
  };

  return (
    <OnboardingContext.Provider
      value={{
        isOnboardingOpen,
        startOnboarding,
        closeOnboarding,
        hasCompletedOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}