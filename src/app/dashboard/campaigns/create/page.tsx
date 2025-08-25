
'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

const CampaignCreatePage: React.FC = () => {
  const [campaignName, setCampaignName] = useState('');
  const [budgetAmount, setBudgetAmount] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [brandAssetsUrl, setBrandAssetsUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    const formData = new FormData();
    formData.append('campaignName', campaignName);
    formData.append('description', description);
    formData.append('totalBudgetKES', budgetAmount.toString());
    formData.append('brandAssetsUrl', brandAssetsUrl);

    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create campaign');
      }

      toast({
        title: 'Success!',
        description: 'Campaign created successfully.',
      });

      setCampaignName('');
      setDescription('');
      setBudgetAmount('');
      setBrandAssetsUrl('');
      
    } catch (error: any) {
      setSubmitError(error.message);
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Campaign</CardTitle>
          <CardDescription>Fill in the details to create a new brand awareness campaign.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="campaignName">Campaign Name</Label>
              <Input
                type="text"
                id="campaignName"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                required
                placeholder="e.g. Summer Sale Kickoff"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Briefly describe the campaign goals and target audience."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budgetAmount">Total Budget (KES)</Label>
              <Input
                type="number"
                id="budgetAmount"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(parseFloat(e.target.value) || '')}
                required
                placeholder="e.g. 50000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brandAssetsUrl">Brand Assets URL</Label>
              <Input
                type="url"
                id="brandAssetsUrl"
                value={brandAssetsUrl}
                onChange={(e) => setBrandAssetsUrl(e.target.value)}
                placeholder="https://example.com/assets.zip"
              />
              <CardDescription>Link to a folder (e.g., Google Drive) with brand logos, images, or guidelines.</CardDescription>
            </div>

            {submitError && (
              <p className="text-sm text-destructive">{submitError}</p>
            )}

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitting ? 'Creating...' : 'Create Campaign'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignCreatePage;
