
'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Download,
  UploadCloud,
  Loader2,
  Info,
} from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Assuming a basic Campaign interface; expand as needed
interface Campaign {
  id: string;
  name: string;
  description: string;
  budget: number;
  brandAssetsUrl?: string;
  createdAt: any;
  requirements?: string; // Add requirements field
}

const CampaignDetailsPage = () => {
  const params = useParams();
  const campaignId = params.campaignId as string;
  const { toast } = useToast();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!campaignId) return;

    const fetchCampaignDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/campaigns/${campaignId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch campaign details.');
        }
        const data = await response.json();
        setCampaign(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignDetails();
  }, [campaignId]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.append('campaignId', campaign.id);

    try {
      const response = await fetch('/api/post-video', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();

      if (response.ok && result.success) {
        toast({
            title: 'Submission Successful!',
            description: "Your video has been submitted and is processing. It will be posted privately to your TikTok account.",
        });
        (e.target as HTMLFormElement).reset();
      } else {
        throw new Error(result.message || 'Video submission failed. Please ensure your TikTok account is set to private and try again.');
      }
    } catch (err: any) {
        toast({
            title: 'Submission Failed',
            description: err.message,
            variant: 'destructive'
        });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return <CampaignDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Something Went Wrong</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/campaigns/list">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Campaigns
          </Link>
        </Button>
      </div>
    );
  }

  if (!campaign) {
    return <p>Campaign not found.</p>;
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <Link
        href="/dashboard/campaigns/list"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Campaigns
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="overflow-hidden">
            <Image
              src={`https://picsum.photos/seed/${campaign.id}/1200/600`}
              alt={`${campaign.name} cover image`}
              width={1200}
              height={600}
              className="w-full h-64 object-cover"
              data-ai-hint="social media marketing"
            />
            <CardHeader>
              <CardTitle className="text-3xl font-bold">{campaign.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">Campaign Brief</h3>
              <p className="text-muted-foreground">{campaign.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Creator Requirements</CardTitle>
              <CardDescription>
                What you need to do to successfully complete this campaign.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-inside list-none space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Content:</strong> Create one high-quality TikTok video (15-60 seconds) showcasing the product.
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Mention:</strong> Tag our official account @heartsontiktok in the video caption.
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Hashtag:</strong> Include the official campaign hashtag #HeartsOnTiktokCreator in your caption.
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Authenticity:</strong> Your content should be genuine and reflect your personal style.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compensation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-bold">
                  KES {campaign.budget.toLocaleString()}
                </span>
                <span className="text-muted-foreground">Fixed Rate</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Paid upon successful review of the content.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submit Your Content</CardTitle>
              <CardDescription>
                Upload your video to post it to your TikTok profile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive" className="mb-4">
                <Info className="h-4 w-4" />
                <AlertTitle>Action Required</AlertTitle>
                <AlertDescription>
                  Before submitting, please go to your TikTok app and set your account to **Private**. This is a temporary requirement for our app.
                </AlertDescription>
              </Alert>
              <form
                onSubmit={handleFormSubmit}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="videoFile">
                    Video File <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="videoFile"
                    type="file"
                    name="video"
                    accept="video/*"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Video Title <span className="text-red-500">*</span></Label>
                  <Textarea id="title" name="title" placeholder="Write a compelling title..." required disabled={isSubmitting}/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hashtags">Hashtags</Label>
                  <Input id="hashtags" name="hashtags" placeholder="#campaignhashtag #relevant" disabled={isSubmitting}/>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  By submitting, you agree to post this content to your TikTok account. It will be posted privately.
                </p>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                  {isSubmitting ? 'Submitting...' : 'Submit to TikTok'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {campaign.brandAssetsUrl && (
            <Card>
              <CardHeader>
                <CardTitle>Brand Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" asChild className="w-full">
                  <a
                    href={campaign.brandAssetsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Assets
                  </a>
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Click to download logos, product images, and brand guidelines.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

const CampaignDetailsSkeleton = () => (
  <div className="container mx-auto py-6 space-y-8">
    <Skeleton className="h-6 w-48" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <Card>
          <Skeleton className="h-64 w-full" />
          <CardHeader>
            <Skeleton className="h-10 w-3/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-6 w-1/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-3 w-1/2 mt-2" />
          </CardContent>
        </Card>
        <Skeleton className="h-16 w-full" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-3 w-3/4 mt-2" />
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

export default CampaignDetailsPage;

    