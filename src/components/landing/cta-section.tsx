
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function CtaSection() {
  return (
    <section id="cta" className="bg-muted/50 py-16 my-24 sm:my-32">
      <div className="container text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          Ready to Take Control of Your{' '}
          <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            Creator Career
          </span>
          ?
        </h2>
        <p className="text-xl text-muted-foreground mt-4 mb-8">
          Join thousands of creators who are building sustainable careers with likezBuddy.
        </p>

        <Button asChild className="text-lg">
          <Link href="/login">Sign Up for Free</Link>
        </Button>
      </div>
    </section>
  );
}
