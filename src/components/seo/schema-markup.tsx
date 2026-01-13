'use client';

interface SchemaMarkupProps {
  type: 'WebApplication' | 'Organization' | 'Service' | 'Product';
  data: Record<string, any>;
}

export function SchemaMarkup({ type, data }: SchemaMarkupProps) {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaData),
      }}
    />
  );
}

export function CreatorPlatformSchema() {
  return (
    <SchemaMarkup
      type="WebApplication"
      data={{
        name: 'LikezBuddy',
        description: 'Creator monetization platform for TikTok content creators to earn money through brand campaigns',
        url: 'https://likezbuddy.com',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '1000',
          priceCurrency: 'KES',
          description: 'Creator monetization plans starting from KES 1,000'
        },
        featureList: [
          'TikTok Content Monetization',
          'Brand Campaign Management',
          'Affiliate Marketing Program',
          'Real-time Analytics Dashboard',
          'M-Pesa Payment Integration'
        ],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          reviewCount: '1250'
        }
      }}
    />
  );
}