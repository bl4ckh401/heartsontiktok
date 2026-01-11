"use client";

import { useRef } from 'react';
import { Heart, DollarSign, Zap, Users, ShieldCheck, Rocket } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const features = [
  {
        icon: <Heart className="w-8 h-8 text-pink-500" />,
        title: "Monetize Every Like",
        description: "Your content is valuable. Earn KES 50 for every 1,000 likes you generate on TikTok."
  },
  {
      icon: <DollarSign className="w-8 h-8 text-green-500" />,
      title: "Instant M-Pesa Payouts",
      description: "No waiting for monthly checks. Withdraw your earnings directly to M-Pesa instantly."
  },
  {
      icon: <Users className="w-8 h-8 text-blue-500" />,
      title: "Creator Community",
      description: "Join thousands of Kenyan creators. Share tips, collaborate, and grow together."
  },
    {
        icon: <Zap className="w-8 h-8 text-yellow-500" />,
        title: "Brand Campaigns",
        description: "Access exclusive high-paying campaigns from top brands looking for creators like you."
    },
    {
        icon: <ShieldCheck className="w-8 h-8 text-purple-500" />,
        title: "Secure Platform",
        description: "Your data and earnings are safe with us. We use bank-grade security for all transactions."
    },
    {
        icon: <Rocket className="w-8 h-8 text-orange-500" />,
        title: "Growth Tools",
        description: "Get analytics and insights to help you grow your audience and increase your earnings."
    }
];

export function FeaturesSection() {
    const containerRef = useRef<HTMLElement>(null);
    const cardsRef = useRef<HTMLDivElement[]>([]);

    useGSAP(() => {
        // Simple fade in for now, assuming user will scroll
        // In a real app we'd use ScrollTrigger
        gsap.fromTo(cardsRef.current,
            { y: 50, autoAlpha: 0 },
            {
                y: 0,
                autoAlpha: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                delay: 0.5 // Small delay to allow page load
            }
        );
    }, { scope: containerRef });

  return (
      <section ref={containerRef} className="py-24 relative overflow-hidden bg-background">
          <div className="container relative z-10">
              <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                      Everything You Need to <span className="text-primary">Evolve</span>
                  </h2>
                  <p className="text-xl text-muted-foreground">
                      We provide the tools and platform for you to turn your creative passion into a sustainable career.
                  </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {features.map((feature, index) => (
                      <div
                          key={index}
                          ref={(el) => { if (el) cardsRef.current[index] = el; }}
                          className="group glass-panel p-8 rounded-3xl border border-white/5 hover:border-primary/20 transition-all duration-300 hover:-translate-y-2"
                      >
                          <div className="mb-6 p-4 bg-background/50 rounded-2xl w-fit group-hover:bg-primary/10 transition-colors">
                              {feature.icon}
              </div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                  </p>
              </div>
          ))}
              </div>
      </div>
    </section>
  );
}
