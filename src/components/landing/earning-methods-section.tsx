"use client";

import { CheckCircle2 } from 'lucide-react';

const methods = [
  {
        title: "Pay Per Like",
        description: "The simplest way to earn. Post quality content, get likes, and get paid KES 50 for every 1,000 likes.",
        image: "https://picsum.photos/seed/like_earn/600/400"
  },
  {
      title: "Affiliate Marketing",
      description: "Promote products from our brand partners. Earn up to 20% commission on every sale generated through your unique link.",
      image: "https://picsum.photos/seed/affiliate/600/400"
  },
  {
      title: "Referral Bonuses",
      description: "Invite other creators to join LikezBuddy. Earn 5% of their earnings for their first 3 months.",
      image: "https://picsum.photos/seed/referral/600/400"
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
                          <div className="flex-1 w-full aspect-video rounded-3xl overflow-hidden glass-panel p-2">
                              <div className="w-full h-full rounded-2xl bg-muted/20 relative overflow-hidden">
                                  {/* Placeholder for actual image */}
                                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary/40 font-bold text-4xl">
                                      {method.title} Preview
                                  </div>
                              </div>
                          </div>
                      </div>
          ))}
        </div>
      </div>
    </section>
  );
}
