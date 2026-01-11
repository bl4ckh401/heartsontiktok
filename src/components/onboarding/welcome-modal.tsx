'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Rocket, Sparkles } from 'lucide-react';
import { useOnboarding } from './onboarding-provider';

export function WelcomeModal() {
    const [open, setOpen] = useState(false);
    const { startOnboarding } = useOnboarding();

    useEffect(() => {
        // Check if user has already seen the onboarding
        const hasCompletedOnboarding = localStorage.getItem('onboarding-completed');
        if (!hasCompletedOnboarding) {
            // Show welcome modal after a short delay
            const timer = setTimeout(() => {
                setOpen(true);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleStartTour = () => {
        setOpen(false);
        startOnboarding();
    };

    const handleSkip = () => {
        setOpen(false);
        localStorage.setItem('onboarding-completed', 'true');
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px] glass-panel border-primary/20 bg-black/80 backdrop-blur-xl">
                <DialogHeader>
                    <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 border border-primary/20">
                        <Rocket className="h-6 w-6 text-primary" />
                    </div>
                    <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Welcome to LikezBuddy!
                    </DialogTitle>
                    <DialogDescription className="text-center text-muted-foreground pt-2">
                        Your new creator dashboard is ready. Take a quick tour to learn how to maximize your earnings and grow your audience.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-start gap-3">
                        <Sparkles className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-foreground/80">
                            <strong>New Feature:</strong> Use the "Pro Creator Tips" in the sidebar to get daily insights on trending content.
                        </p>
                    </div>
                </div>
                <DialogFooter className="flex-col gap-2 sm:gap-0 sm:flex-row">
                    <Button variant="outline" onClick={handleSkip} className="w-full sm:w-auto border-white/10 hover:bg-white/5">
                        Skip Tour
                    </Button>
                    <Button onClick={handleStartTour} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25">
                        Start Tour
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
