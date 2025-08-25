'use client';

import { useParams } from 'next/navigation';
import React from 'react';

// Dummy campaign data (replace with fetched data in a real app)
const dummyCampaign = {
  id: 'dummy-campaign-1', // Replace with a specific dummy ID if needed for consistency
  name: `Dummy Campaign`,
  description: `This is a detailed description for a dummy campaign. It outlines the goals, target audience, and messaging.`,
  budget: Math.floor(Math.random() * 10000) + 1000, // Random dummy budget
  brandAssets: [
    '/placeholder-logo.png', // Placeholder image for a logo
    '/placeholder-banner.png', // Placeholder image for a banner
  ],
  requirements: 'Create a short video showcasing the product in a natural setting. Mention key features.',
  timeline: 'Two weeks from selection date.',
};

export default function CampaignDetailsPage() { 
  const params = useParams();
  const campaignId = params.campaignId;
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Campaign Details</h1> {/* Move the budget to state */}
      <p className="text-muted-foreground">Displaying details for Campaign ID: {campaignId}</p>
      <div className="mt-8 p-4 border rounded">
        <h2 className="text-xl font-semibold">Campaign Information</h2> {/* Initialize state with a random budget */}
        <p><strong>Name:</strong> {dummyCampaign.name}</p> {/* Use the budget from state */}
        <p><strong>Description:</strong> {dummyCampaign.description}</p>
        <p><strong>Budget:</strong> ${dummyCampaign.budget.toLocaleString('en-US')}</p> {/* Remove the direct use of Math.random() */}
        <p><strong>Requirements:</strong> {dummyCampaign.requirements}</p> 
        <p><strong>Timeline:</strong> {dummyCampaign.timeline}</p>

        <div className="mt-8 p-4 border rounded">
          <h2 className="text-xl font-semibold">Brand Assets</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            {dummyCampaign.brandAssets.map((asset, index) => (
              <div key={index} className="border rounded p-2 flex justify-center items-center">
                <img src={asset} alt={`Brand Asset ${index + 1}`} className="max-h-32 object-contain" />
                {/* In a real application, you might offer a download link */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}