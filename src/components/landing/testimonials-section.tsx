"use client";

import { Star } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
        name: "Sarah Wanjiku",
        role: "Lifestyle Creator",
        image: "/images/sarah.png",
        content: "I used to struggle to monetize my TikToks despite having good views. With LikezBuddy, I started earning from day one. The daily M-Pesa withdrawals are a lifesaver!"
  },
  {
      name: "Kevin Omondi",
      role: "Comedy Skits",
      image: "/images/kevin.png",
      content: "The best platform for Kenyan creators hands down. KES 50 per 1k likes adds up fast when you have a viral video. Highly recommended!"
  },
  {
      name: "Brenda K.",
      role: "Dance Trends",
      image: "/images/brenda.png",
      content: "Apart from the like earnings, the brand campaigns have helped me work with companies I never thought I could reach. It's a game changer."
  }
];

export function TestimonialsSection() {
  return (
      <section className="py-16 md:py-24 bg-background relative overflow-hidden">
          <div className="container relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-center mb-12 md:mb-16">
                  Trusted by <span className="text-primary">Top Creators</span>
        </h2>

              <div className="grid md:grid-cols-3 gap-6 md:gap-8 hover:opacity-100 group-hover:opacity-100 transition-opacity">
                  {testimonials.map((testimonial, index) => (
                      <div key={index} className="glass-panel p-6 md:p-8 rounded-3xl border border-white/5 relative hover:border-primary/20 transition-all duration-300">
                          <div className="flex gap-1 mb-6 text-yellow-500">
                              {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="w-5 h-5 fill-current" />
                              ))}
                          </div>
                          <p className="text-base md:text-lg text-muted-foreground mb-8 leading-relaxed line-clamp-4 md:line-clamp-none">
                              "{testimonial.content}"
                          </p>
                  <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
                          <Image
                              src={testimonial.image}
                              alt={testimonial.name}
                              fill
                              className="object-cover"
                          />
                      </div>
                      <div>
                          <p className="font-bold text-foreground">{testimonial.name}</p>
                          <p className="text-sm text-primary">{testimonial.role}</p>
                      </div>
                  </div>
              </div>
          ))}
              </div>
      </div>
    </section>
  );
}
