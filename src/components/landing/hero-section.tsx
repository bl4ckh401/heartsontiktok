"use client";

import { useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, TrendingUp, DollarSign, Zap, Users } from 'lucide-react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const floatRef1 = useRef<HTMLDivElement>(null);
  const floatRef2 = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Initial State to prevent FOUC
    gsap.set(textRef.current?.children || [], { autoAlpha: 0, y: 50 });
    gsap.set(visualRef.current, { autoAlpha: 0, x: 100 });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Initial fade in and slide up for text content
    tl.to(textRef.current?.children || [], {
      y: 0,
      autoAlpha: 1,
      duration: 1,
      stagger: 0.15
    });

    // Visual entrance (slide from right)
    tl.to(visualRef.current, {
      x: 0,
      autoAlpha: 1,
      duration: 1.2
    }, "-=0.8");

    // Floating elements animation (random floating movement)
    const floatElements = [floatRef1.current, floatRef2.current];
    floatElements.forEach((el, index) => {
      gsap.to(el, {
        y: "random(-15, 15)",
        x: "random(-10, 10)",
        rotation: "random(-3, 3)",
        duration: "random(3, 5)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.5
      });
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full overflow-hidden bg-background">
      {/* Background Gradient Orbs */}
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/20 rounded-full blur-[80px] md:blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-secondary/20 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-primary/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none mix-blend-screen" />

      <div className="container grid lg:grid-cols-2 place-items-center py-16 md:py-36 gap-12 relative z-10">

        {/* Left Column: Text Content */}
        <div ref={textRef} className="text-center lg:text-start space-y-6 md:space-y-8">
          <div className="inline-block glass-panel px-4 py-1.5 rounded-full border-primary/30">
            <span className="text-xs md:text-sm font-bold text-gradient flex items-center gap-2 tracking-wide uppercase">
              <Zap className="w-3 h-3 md:w-4 md:h-4 fill-primary text-primary" />
              #1 Monetization Platform in Kenya
            </span>
          </div>

          <main className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
            <h1>
              Dominate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-secondary animate-gradient-x">Niche.</span> <br />
              Monetize <span className="text-secondary">Every Like.</span>
            </h1>
          </main>

          <p className="text-lg md:text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0 leading-relaxed">
            Stop leaving money on the table. Join thousands of creators earning <span className="text-foreground font-bold">High-Yield RPM (KES 50/1k Likes)</span>.
            Get paid daily via M-Pesa.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Button size="lg" className="w-full sm:w-auto text-lg h-12 md:h-14 px-8 rounded-full shadow-[0_0_20px_rgba(235,0,255,0.3)] hover:shadow-[0_0_30px_rgba(235,0,255,0.5)] transition-all duration-300 bg-primary hover:bg-primary/90 text-white border-0" asChild>
              <Link href="/login">
                Start Earning Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg h-12 md:h-14 px-8 rounded-full border-white/10 hover:bg-white/5 hover:border-white/20 transition-all text-foreground" asChild>
              <Link href="#how-it-works">
                How it Works
              </Link>
            </Button>
          </div>

          <div className="pt-4 flex items-center justify-center lg:justify-start gap-8 opacity-90">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-lg leading-none">10k+</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Creators</p>
              </div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-full">
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="font-bold text-lg leading-none">Same Day</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">M-Pesa Payouts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual/Dashboard Preview */}
        <div ref={visualRef} className="relative w-full max-w-[600px] aspect-square mx-auto lg:mr-0 perspective-1000 mt-8 lg:mt-0">

          {/* Main Glass Card (Dashboard Mockup) */}
          <div className="relative z-20 w-full h-full glass-panel rounded-3xl overflow-hidden p-2 transform rotate-y-12 rotate-x-6 hover:rotate-0 transition-transform duration-700 ease-out-expo border-t border-l border-white/20 shadow-2xl shadow-black/50">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 pointer-events-none" />
            <Image
              src="/images/dashboard-hero.png"
              alt="LikezBuddy Dashboard"
              fill
              className="object-cover rounded-2xl opacity-90 hover:opacity-100 transition-opacity duration-500"
            />

            {/* Floating Elements */}
            <div ref={floatRef1} className="absolute -top-6 -right-6 z-30 glass-panel p-4 rounded-2xl flex items-center gap-3 shadow-xl backdrop-blur-xl border border-white/10 hidden sm:flex">
              <div className="bg-green-500/20 p-2.5 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Daily Earnings</p>
                <p className="text-xl font-bold text-white">+ KES 1,250</p>
              </div>
            </div>

            <div ref={floatRef2} className="absolute bottom-10 -left-8 z-30 glass-panel p-4 rounded-2xl flex items-center gap-3 shadow-xl backdrop-blur-xl border border-white/10 hidden sm:flex">
              <div className="bg-primary/20 p-2.5 rounded-full">
                <Star className="w-6 h-6 text-primary fill-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Campaign Success</p>
                <p className="text-xl font-bold text-white">98%</p>
              </div>
            </div>
          </div>

          {/* Decorative Elements behind */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/40 via-transparent to-secondary/40 rounded-full blur-[80px] -z-10 opacity-60" />
        </div>

      </div>
    </section>
  );
}
