
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Hearts On TikTok - Creator Monetization Platform | Earn Money from TikTok Content',
  description: 'Transform your TikTok passion into income with Hearts On TikTok. Join thousands of creators earning KES 50 per 1,000 likes through brand campaigns, affiliate programs, and content monetization.',
  keywords: [
    'TikTok monetization',
    'creator economy Kenya',
    'TikTok earnings',
    'social media monetization',
    'influencer marketing platform',
    'TikTok brand partnerships',
    'content creator income',
    'TikTok affiliate program',
    'creator mission control',
    'TikTok analytics dashboard'
  ],
  authors: [{ name: 'Hearts On TikTok Team' }],
  creator: 'Hearts On TikTok',
  publisher: 'Hearts On TikTok',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://heartsontiktok.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Hearts On TikTok - Creator Monetization Platform',
    description: 'Transform your TikTok passion into income. Earn KES 50 per 1,000 likes through brand campaigns and affiliate programs.',
    url: 'https://heartsontiktok.vercel.app',
    siteName: 'Hearts On TikTok',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Hearts On TikTok - Creator Monetization Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hearts On TikTok - Creator Monetization Platform',
    description: 'Transform your TikTok passion into income. Earn KES 50 per 1,000 likes through brand campaigns.',
    images: ['/og-image.jpg'],
    creator: '@heartsontiktok',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#673AB7" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Hearts On TikTok" />
        <link rel="canonical" href="https://heartsontiktok.vercel.app" />
        <meta name="geo.region" content="KE" />
        <meta name="geo.country" content="Kenya" />
        <meta name="language" content="English" />
        <meta name="rating" content="General" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Hearts On TikTok',
              description: 'Creator monetization platform for TikTok content creators to earn money through brand campaigns and affiliate programs',
              url: 'https://heartsontiktok.vercel.app',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '1000',
                priceCurrency: 'KES',
                description: 'Gold Plan - Start monetizing your TikTok content'
              },
              creator: {
                '@type': 'Organization',
                name: 'Hearts On TikTok',
                url: 'https://heartsontiktok.vercel.app'
              },
              featureList: [
                'TikTok Content Monetization',
                'Brand Campaign Management',
                'Affiliate Marketing Program',
                'Real-time Analytics Dashboard',
                'M-Pesa Payment Integration'
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
