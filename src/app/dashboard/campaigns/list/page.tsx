'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';


interface Campaign {
  id: string;
  name: string;
  description: string;
  // Add other relevant campaign properties here
}

export default function CampaignListingPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        // Replace with actual API call to fetch campaigns
        const response = await fetch('/api/campaigns'); // Example API endpoint
        if (!response.ok) {
          throw new Error(`Error fetching campaigns: ${response.statusText}`);
        }
        const data = await response.json(); // Assuming the API returns { success: boolean, data: Campaign[] }
        setCampaigns(data.data || []); // Set campaigns from the 'data' field of the response
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []); // Empty dependency array means this effect runs once on mount

  if (loading) {
    return <p>Loading campaigns...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error loading campaigns: {error}</p>;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Available Campaigns</h1>
      {campaigns.length === 0 ? (
        <p>No campaigns available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="flex flex-col justify-between">
              <CardHeader>
                {/* You might want to display a campaign image here if available */}
                <CardTitle>{campaign.name}</CardTitle>
                <CardDescription>{campaign.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/dashboard/campaigns/${campaign.id}`} className="text-blue-500 hover:underline">
                  View Details
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}