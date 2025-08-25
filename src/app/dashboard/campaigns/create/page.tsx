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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

const CampaignCreatePage: React.FC = () => {
  const [campaignName, setCampaignName] = useState('');
  const [budgetAmount, setBudgetAmount] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [brandAssets, setBrandAssets] = useState<FileList | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log('Campaign Name:', campaignName);
    console.log('Description:', description);
    console.log('Total Budget (KES):', budgetAmount);

    const formData = new FormData();
    formData.append('campaignName', campaignName);
    formData.append('description', description);
    formData.append('totalBudgetKES', budgetAmount.toString());
    if (brandAssets) {
      for (let i = 0; i < brandAssets.length; i++) {
        formData.append('brandAssets', brandAssets[i]);
      }
 setSubmitting(true);
    }
    fetch('/api/campaigns', {
      method: 'POST',
      body: formData, // Use FormData for file uploads
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to create campaign');
        }
        // Handle successful creation (e.g., show a success message, clear form, redirect)
        console.log('Campaign created successfully:', data);
        alert('Campaign created successfully!'); // Simple feedback
        // Optionally reset form fields:
        setCampaignName('');
        setDescription('');
        setBudgetAmount('');
        setBrandAssets(null);
      })
      .catch((error) => {
        setSubmitError(error.message);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setBrandAssets(event.target.files);
    } else {
      setBrandAssets(null);
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
              <Label htmlFor="campaignName">Campaign Name:</Label>
              <Input
                type="text"
                id="campaignName"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description:</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budgetAmount">Total Budget (KES):</Label>
              <Input
                type="number"
                id="budgetAmount"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(parseFloat(e.target.value) || '')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brandAssets">Brand Assets:</Label>
              <Input
                type="file"
                id="brandAssets"
                onChange={handleFileChange}
                multiple
              />
              <CardDescription>Upload relevant brand logos, images, or guidelines.</CardDescription>
            </div>

            {submitError && (
              <p className="text-red-500 text-sm">{submitError}</p>
            )}

            <Button type="submit" className="w-full">Create Campaign</Button>
          </form>
        </CardContent>
      </Card>

      {/* Optional: Display a preview of uploaded assets */}
      {brandAssets && brandAssets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Brand Assets Preview</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from(brandAssets).map((file, index) => (
              <div key={index} className="border rounded p-2 flex justify-center items-center overflow-hidden">
                <img src={URL.createObjectURL(file)} alt={`Asset preview ${index + 1}`} className="max-h-24 object-contain" onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CampaignCreatePage;