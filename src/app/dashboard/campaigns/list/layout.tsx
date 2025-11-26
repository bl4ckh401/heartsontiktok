import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Available TikTok Brand Campaigns | LikezBuddy Creator Dashboard',
  description: 'Browse and join exclusive TikTok brand campaigns. Earn money from your content with verified brand partnerships and sponsored content opportunities.',
  keywords: [
    'TikTok brand campaigns',
    'sponsored content opportunities',
    'creator brand partnerships',
    'TikTok marketing campaigns',
    'influencer collaborations'
  ],
  robots: {
    index: false,
    follow: false,
  },
};

export default function CampaignListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}