'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, Suspense, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { TikTokIcon } from '@/components/tiktok-icon';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const plan = searchParams.get('plan');
  const ref = searchParams.get('ref');

  useEffect(() => {
    if (errorDescription) {
      toast({
        title: 'Authentication Error',
        description: decodeURIComponent(errorDescription),
        variant: 'destructive',
      });
      router.replace('/login', { scroll: false });
    }
  }, [errorDescription, toast, router]);

  useEffect(() => {
    if (ref) {
      document.cookie = `referral_id=${ref}; path=/; max-age=86400`;
    }
  }, [ref]);

  const authUrl = plan ? `/api/auth/tiktok?plan=${plan}` : '/api/auth/tiktok';

  const errorMessages: { [key: string]: string } = {
    tiktok_auth_failed: 'Authentication with TikTok failed. Please try again.',
    invalid_state: 'Invalid state. The request could not be verified, please try again.',
    missing_code: 'The authorization code was not provided by TikTok. Please try again.',
    token_exchange_failed: 'Could not verify your TikTok account. Please check your app configuration and try again.',
    generic_error: 'An unexpected error occurred. Please try again later.',
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Welcome Back</h1>
        <p className="text-muted-foreground">Log in to manage your campaigns and earnings.</p>
      </div>

      {error && (
        <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-4 duration-300">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{errorMessages[error] || 'Authentication Error'}</AlertTitle>
          {errorDescription && <AlertDescription>{decodeURIComponent(errorDescription)}</AlertDescription>}
        </Alert>
      )}

      <div className="space-y-4">
        <Button asChild className="w-full h-14 text-lg font-medium relative overflow-hidden group transition-all duration-300 shadow-[0_0_20px_rgba(255,0,80,0.3)] hover:shadow-[0_0_30px_rgba(255,0,80,0.5)]" size="lg">
          <Link href={authUrl} prefetch={false} className="flex items-center justify-center gap-3">
            <span className="absolute inset-0 bg-gradient-to-r from-[#00f2ea] to-[#ff0050] opacity-10 group-hover:opacity-20 transition-opacity" />
            <TikTokIcon className="h-6 w-6 relative z-10" />
            <span className="relative z-10">Continue with TikTok</span>
            <ArrowRight className="w-5 h-5 ml-1 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 relative z-10" />
          </Link>
        </Button>

        <p className="text-xs text-center text-muted-foreground pt-4">
          By connecting, you agree to our <Link href="/terms" className="underline hover:text-primary transition-colors">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-primary transition-colors">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(leftColRef.current,
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 1 }
    )
      .fromTo(rightColRef.current,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 1 },
        "-=0.5"
      );

    // Subtle floating animation for background elements
    gsap.to(".floating-orb", {
      y: "random(-20, 20)",
      x: "random(-20, 20)",
      duration: "random(3, 5)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.5
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="h-screen w-full flex bg-background overflow-hidden relative">
      {/* Left Column - Visuals (Hidden on mobile) */}
      <div
        ref={leftColRef}
        className="hidden lg:flex lg:w-1/2 relative bg-black items-center justify-center p-12 overflow-hidden border-r border-white/10 h-full"
      >
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-[#0a0a0a] to-black" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] floating-orb" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] floating-orb" />

        <div className="relative z-10 max-w-lg space-y-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium text-white/80">#1 Creator Platform</span>
            </div>
            <h2 className="text-5xl font-extrabold tracking-tight text-white leading-tight">
              Turn Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary animate-gradient-x">Influence</span> <br />
              Into Income.
            </h2>
            <p className="text-xl text-white/60 leading-relaxed">
              Join 10,000+ creators who are earning daily with LikezBuddy. Track your improved stats and manage brand deals all for free.
            </p>
          </div>

          <div className="grid gap-6">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Secure Payments</h3>
                <p className="text-white/50">Instant M-Pesa withdrawals with bank-grade security.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Verified Campaigns</h3>
                <p className="text-white/50">Access legitimate brand deals vetted by our team.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div
        ref={rightColRef}
        className="flex-1 flex flex-col items-center justify-center p-4 lg:p-12 relative overflow-y-auto h-full"
      >
        <div className="w-full max-w-[400px] relative z-10 my-auto">
          {/* Mobile Background inside the scrollable area */}
          <div className="lg:hidden absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none h-screen fixed top-0 left-0" />

          <div className="glass-panel lg:border-none lg:bg-transparent lg:backdrop-blur-none p-5 lg:p-0 rounded-3xl lg:rounded-none shadow-2xl lg:shadow-none border-white/10 lg:border-0 bg-black/40 lg:bg-transparent backdrop-blur-xl">
            <Suspense fallback={
              <div className="flex flex-col items-center justify-center space-y-4 h-64">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-muted-foreground">Loading...</p>
              </div>
            }>
              <LoginContent />
            </Suspense>
          </div>

          <div className="mt-8 text-center lg:hidden pb-8">
            <p className="text-muted-foreground text-sm">Trusted by 10,000+ Creators</p>
          </div>
        </div>
      </div>
    </div>
  );
}
