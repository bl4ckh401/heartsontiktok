"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function CtaSection() {
  return (
      <section className="py-32 relative overflow-hidden">
          {/* Background with gradient */}
          <div className="absolute inset-0 bg-primary/5">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10" />
          </div>

          <div className="container relative z-10 text-center">
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                  Ready to Start <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Earning?</span>
        </h2>
              <p className="text-2xl text-muted-foreground max-w-2xl mx-auto mb-10">
                  Join the fastest growing community of creators in Kenya. Sign up in seconds and monetize your next post.
        </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button size="lg" className="text-lg h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-white" asChild>
                      <Link href="/login">
                          Create Free Account <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="text-lg h-14 px-8 rounded-full" asChild>
                      <Link href="/contact">
                          Talk to Sales
                      </Link>
                  </Button>
              </div>
      </div>
    </section>
  );
}
