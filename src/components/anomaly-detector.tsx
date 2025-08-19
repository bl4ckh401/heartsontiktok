'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertTriangle, Bot, Loader2, Terminal } from 'lucide-react';
import { runCampaignAnomalyDetector } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { CampaignAnomalyOutput } from '@/ai/flows/campaign-anomaly-detector';

const formSchema = z.object({
  campaignId: z.string().min(1, { message: 'Campaign ID is required.' }),
  metrics: z
    .string({
      required_error: 'Metrics data is required.',
    })
    .min(1, { message: 'Metrics data is required.' }),
});

const exampleMetrics = [
  { timestamp: "2024-01-01T12:00:00Z", views: 1000, likes: 100, comments: 10, shares: 5 },
  { timestamp: "2024-01-02T12:00:00Z", views: 1200, likes: 120, comments: 12, shares: 6 },
  { timestamp: "2024-01-03T12:00:00Z", views: 50000, likes: 5000, comments: 500, shares: 250 },
  { timestamp: "2024-01-04T12:00:00Z", views: 1500, likes: 150, comments: 15, shares: 7 },
];

export function AnomalyDetector() {
  const [result, setResult] = useState<CampaignAnomalyOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      campaignId: 'CAMPAIGN-123',
      metrics: JSON.stringify(exampleMetrics, null, 2),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    setError(null);

    const formData = new FormData();
    formData.append('campaignId', values.campaignId);
    formData.append('metrics', values.metrics);

    const response = await runCampaignAnomalyDetector(formData);

    if (response.error) {
      setError(response.error);
    } else if (response.data) {
      setResult(response.data);
    }
    
    setIsLoading(false);
  }

  return (
    <Card className="h-full flex flex-col shadow-sm">
      <CardHeader>
        <CardDescription>
          Paste your campaign metrics as a JSON array to detect unusual activity.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-grow flex flex-col">
          <CardContent className="flex-grow space-y-4">
            <FormField
              control={form.control}
              name="campaignId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign ID</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Q4-HOLIDAY-2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="metrics"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Metrics Data (JSON)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste your campaign metrics here."
                      className="min-h-[150px] font-mono text-xs"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col items-start gap-4">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Run Analysis'
              )}
            </Button>
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {result && (
              <Alert variant={result.isAnomaly ? 'destructive' : 'default'}>
                <Terminal className="h-4 w-4" />
                <AlertTitle>
                  {result.isAnomaly ? 'Anomaly Detected!' : 'Analysis Complete'}
                </Title>
                <AlertDescription>
                  {result.anomalyDescription}
                </AlertDescription>
              </Alert>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}