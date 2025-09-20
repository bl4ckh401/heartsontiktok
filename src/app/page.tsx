
import { Header } from '@/components/landing/header';
import { HeroSection } from '@/components/landing/hero-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { CtaSection } from '@/components/landing/cta-section';
import { Footer } from '@/components/landing/footer';
import { PricingSection } from '@/components/landing/pricing-section';
import { EarningMethodsSection } from '@/components/landing/earning-methods-section';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hearts On TikTok - Turn Your TikTok Content Into Income | Creator Monetization Platform',
  description: 'Join thousands of TikTok creators earning real money with Hearts On TikTok. Get paid KES 50 per 1,000 likes, access exclusive brand campaigns, and build sustainable income from your content.',
  keywords: [
    'TikTok monetization platform',
    'earn money from TikTok',
    'TikTok creator income',
    'social media monetization Kenya',
    'TikTok brand partnerships',
    'creator economy platform',
    'TikTok affiliate marketing',
    'content creator earnings',
    'TikTok campaign management'
  ],
  openGraph: {
    title: 'Hearts On TikTok - Turn Your TikTok Content Into Income',
    description: 'Join thousands of TikTok creators earning real money. Get paid KES 50 per 1,000 likes and access exclusive brand campaigns.',
    images: ['/og-home.jpg'],
  },
};

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1" role="main">
        <article>
          <HeroSection />
          <section aria-labelledby="features-heading">
            <FeaturesSection />
          </section>
          <section aria-labelledby="earning-methods-heading">
            <EarningMethodsSection />
          </section>
          <section aria-labelledby="pricing-heading">
            <PricingSection />
          </section>
          <section aria-labelledby="testimonials-heading">
            <TestimonialsSection />
          </section>
          <section aria-labelledby="cta-heading">
            <CtaSection />
          </section>
        </article>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Hearts On TikTok',
            description: 'Creator monetization platform for TikTok content creators',
            url: 'https://heartsontiktok.vercel.app',
            logo: 'https://heartsontiktok.vercel.app/logo.png',
            sameAs: [
              'https://twitter.com/heartsontiktok',
              'https://instagram.com/heartsontiktok'
            ],
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'Customer Service',
              availableLanguage: 'English'
            },
            areaServed: 'Kenya',
            serviceType: 'Creator Monetization Platform'
          })
        }}
      />
    </div>
  );
}
