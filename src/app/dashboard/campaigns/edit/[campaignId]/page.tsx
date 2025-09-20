'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WysiwygEditor } from '@/components/ui/wysiwyg-editor';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { Campaign } from '@/types';

export default function EditCampaignPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const campaignId = params.campaignId as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    budget: 0,
    brandAssetsUrl: ''
  });

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await fetch(`/api/campaigns/${campaignId}`);
        const result = await response.json();
        
        if (result.success && result.campaign) {
          setCampaign(result.campaign);
          setFormData({
            name: result.campaign.name || '',
            description: result.campaign.description || '',
            budget: result.campaign.budget || 0,
            brandAssetsUrl: result.campaign.brandAssetsUrl || ''
          });
        } else {
          toast({
            title: 'Error',
            description: 'Campaign not found',
            variant: 'destructive'
          });
          router.push('/dashboard/campaigns/list');
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load campaign',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    if (campaignId) {
      fetchCampaign();
    }
  }, [campaignId, toast, router]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Campaign updated successfully'
        });
        router.push(`/dashboard/campaigns/${campaignId}`);
      } else {
        throw new Error(result.message || 'Failed to update campaign');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  if (!campaign) {
    return <div className="flex items-center justify-center h-64">Campaign not found</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/campaigns/${campaignId}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Campaign</h1>
          <p className="text-muted-foreground">Update campaign details and budget</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
          <CardDescription>Edit the campaign information below</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Campaign Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter campaign name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Budget (KES)</Label>
            <Input
              id="budget"
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData(prev => ({ ...prev, budget: Number(e.target.value) }))}
              placeholder="Enter budget amount"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brandAssetsUrl">Brand Assets URL</Label>
            <Input
              id="brandAssetsUrl"
              value={formData.brandAssetsUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, brandAssetsUrl: e.target.value }))}
              placeholder="Enter brand assets URL"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <WysiwygEditor
              value={formData.description}
              onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
              placeholder="Enter campaign description..."
            />
          </div>

          <div className="flex gap-4">
            <Button onClick={handleSave} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Link href={`/dashboard/campaigns/${campaignId}`}>
              <Button variant="outline">Cancel</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}