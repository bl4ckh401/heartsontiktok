'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calendar, Tag, Target } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Cookies from 'js-cookie';

// Define the structure for a Campaign
interface Campaign {
  id: string;
  name: string;
  description: string;
  budget: number;
  brandAssetsUrl?: string;
  createdAt: any; 
}

// Skeleton loader component for campaigns
const CampaignSkeleton = () => (
  <Card className="flex flex-col justify-between overflow-hidden shadow-lg transition-transform hover:scale-[1.02] hover:shadow-xl">
    <CardHeader>
      <Skeleton className="h-40 w-full rounded-lg" />
      <div className="pt-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6 mt-1" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="flex items-center text-sm text-muted-foreground mb-4">
        <Skeleton className="h-5 w-24" />
      </div>
      <div className="flex items-center text-sm text-muted-foreground">
        <Skeleton className="h-5 w-32" />
      </div>
    </CardContent>
    <CardFooter>
      <Skeleton className="h-10 w-full rounded-md" />
    </CardFooter>
  </Card>
);

export default function CampaignListingPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'user' | 'admin' | null>(null); 

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/campaigns'); 
        if (!response.ok) {
          throw new Error(`Error fetching campaigns: ${response.statusText}`);
        }
        const data = await response.json();
        if(data.success) {
          setCampaigns(data.campaigns || []); 
        } else {
          throw new Error(data.message || "Failed to fetch campaigns.");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Get user role from cookies
    const userInfoCookie = Cookies.get('user_info');
    if (userInfoCookie) {
      const parsedUser = JSON.parse(userInfoCookie);
      setUserRole(parsedUser.role || 'user');
    }

    fetchCampaigns();
  }, []);

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Available Campaigns</h1>
        {/* Conditionally render the Create Campaign button */}
        {userRole === 'admin' && (
          <Link href="/dashboard/campaigns/create" passHref>
            <Button data-ai-hint="Create a new campaign">Create Campaign</Button>
          </Link>)}
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CampaignSkeleton />
          <CampaignSkeleton />
          <CampaignSkeleton />
        </div>
      )}

      {error && <p className="text-center text-destructive">Error: {error}</p>}
      
      {!loading && !error && campaigns.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <Target className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-semibold text-foreground">No Campaigns Available</h3>
          <p className="mt-1 text-sm text-muted-foreground">Check back later for new opportunities.</p>
        </div>
      )}

      {!loading && campaigns.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="flex flex-col justify-between overflow-hidden shadow-md transition-transform hover:scale-[1.02] hover:shadow-xl dark:border-gray-800">
              <CardHeader className="p-0">
                <Image 
                  src={`https://picsum.photos/seed/${campaign.id}/600/400`}
                  alt={`${campaign.name} cover image`}
                  width={600}
                  height={400}
                  className="w-full h-40 object-cover"
                  data-ai-hint="social media campaign"
                />
                <div className="p-6">
                  <CardTitle className="text-xl mb-2">{campaign.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{campaign.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <Tag className="mr-2 h-4 w-4" />
                    <span>Budget: KES {campaign.budget.toLocaleString()}</span>
                  </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Link href={`/dashboard/campaigns/${campaign.id}`} className="w-full" passHref>
                  <Button className="w-full">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
