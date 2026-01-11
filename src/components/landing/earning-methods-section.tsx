"use client";

import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

const methods = [
  {
        title: "Pay Per Like",
        description: "The simplest way to earn. Post quality content, get likes, and get paid KES 50 for every 1,000 likes.",
        image: "/assets/landing/pay_per_like.png"
  },
  {
      title: "Affiliate Marketing",
      description: "Promote products from our brand partners. Earn up to 20% commission on every sale generated through your unique link.",
      image: "/assets/landing/affiliate_marketing.png"
  },
  {
      title: "Referral Bonuses",
      description: "Invite other creators to join LikezBuddy. Earn 5% of their earnings for their first 3 months.",
      image: "/assets/landing/referral_bonuses.png"
  }
];

export function EarningMethodsSection() {
  return (
      <section className="py-24 bg-background/50 relative">
      <div className="container">
              <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Multiple Ways to <span className="text-secondary">Earn</span></h2>
                  <p className="text-xl text-muted-foreground">
                      Diversify your income streams with our comprehensive monetization tools.
          </p>
        </div>

              <div className="space-y-24">
                  {methods.map((method, index) => (
                      <div key={index} className={`flex flex-col lg:flex-row gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                          <div className="flex-1 space-y-6">
                              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm uppercase tracking-wide">
                                  <CheckCircle2 className="w-4 h-4" /> Method {index + 1}
                              </div>
                              <h3 className="text-3xl md:text-4xl font-bold">{method.title}</h3>
                              <p className="text-xl text-muted-foreground leading-relaxed">
                                  {method.description}
                              </p>
                          </div>
                          <div className="flex-1 w-full aspect-video rounded-3xl overflow-hidden glass-panel p-2 transform hover:scale-[1.02] transition-transform duration-500">
                              <div className="w-full h-full rounded-2xl bg-muted/20 relative overflow-hidden group">
                                  <Image 
                                    src={method.image} 
                                    alt={`${method.title} preview`}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                              </div>
                          </div>
                      </div>
          ))}
        </div>
      </div>
    </section>
  );
}
