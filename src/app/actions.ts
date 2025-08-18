'use server';

import { z } from 'zod';
import {
  detectCampaignAnomaly,
  type CampaignAnomalyInput,
} from '@/ai/flows/campaign-anomaly-detector';

const FormSchema = z.object({
  campaignId: z.string(),
  metrics: z.string(),
});

const MetricsSchema = z.array(
  z.object({
    timestamp: z.string(),
    views: z.number(),
    likes: z.number(),
    comments: z.number(),
    shares: z.number(),
  })
);

export async function runCampaignAnomalyDetector(formData: FormData) {
  const validatedFields = FormSchema.safeParse({
    campaignId: formData.get('campaignId'),
    metrics: formData.get('metrics'),
  });

  if (!validatedFields.success) {
    return {
      error: 'Invalid form data.',
    };
  }

  let metrics;
  try {
    metrics = JSON.parse(validatedFields.data.metrics);
  } catch (error) {
    return { error: 'Metrics data is not valid JSON.' };
  }

  const validatedMetrics = MetricsSchema.safeParse(metrics);
  if (!validatedMetrics.success) {
    return {
      error: 'JSON structure does not match the required metrics format.',
    };
  }

  const anomalyInput: CampaignAnomalyInput = {
    campaignId: validatedFields.data.campaignId,
    metrics: validatedMetrics.data,
  };

  try {
    const result = await detectCampaignAnomaly(anomalyInput);
    return { data: result };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to run anomaly detection.' };
  }
}
