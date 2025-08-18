'use server';

/**
 * @fileOverview Implements an anomaly detection system for campaign metrics.
 *
 * - detectCampaignAnomaly - Detects anomalies in campaign performance.
 * - CampaignAnomalyInput - Input schema for the anomaly detection flow.
 * - CampaignAnomalyOutput - Output schema for the anomaly detection flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CampaignAnomalyInputSchema = z.object({
  campaignId: z.string().describe('The ID of the campaign to analyze.'),
  metrics: z
    .array(
      z.object({
        timestamp: z.string().describe('Timestamp of the metric.'),
        views: z.number().describe('Number of views at the timestamp.'),
        likes: z.number().describe('Number of likes at the timestamp.'),
        comments: z.number().describe('Number of comments at the timestamp.'),
        shares: z.number().describe('Number of shares at the timestamp.'),
      })
    )
    .describe('An array of metrics for the campaign over time.'),
});
export type CampaignAnomalyInput = z.infer<typeof CampaignAnomalyInputSchema>;

const CampaignAnomalyOutputSchema = z.object({
  isAnomaly: z
    .boolean()
    .describe('Whether an anomaly is detected in the campaign metrics.'),
  anomalyDescription: z
    .string()
    .describe('A description of the detected anomaly, if any.'),
});
export type CampaignAnomalyOutput = z.infer<typeof CampaignAnomalyOutputSchema>;

export async function detectCampaignAnomaly(
  input: CampaignAnomalyInput
): Promise<CampaignAnomalyOutput> {
  return campaignAnomalyDetectionFlow(input);
}

const campaignAnomalyDetectionPrompt = ai.definePrompt({
  name: 'campaignAnomalyDetectionPrompt',
  input: {schema: CampaignAnomalyInputSchema},
  output: {schema: CampaignAnomalyOutputSchema},
  prompt: `You are an expert in detecting anomalies in social media campaign metrics.
  Given the campaign ID and its metrics over time, analyze the data and determine if there is any anomaly.
  An anomaly could be a sudden spike in views, likes, comments, or shares, or any other unusual pattern.

  Campaign ID: {{{campaignId}}}
  Metrics:
  {{#each metrics}}
    Timestamp: {{{timestamp}}}, Views: {{{views}}}, Likes: {{{likes}}}, Comments: {{{comments}}}, Shares: {{{shares}}}
  {{/each}}

  Based on the provided data, determine if there is an anomaly in the campaign's performance.
  If an anomaly is detected, provide a detailed description of the anomaly, including the specific metrics and timestamps involved.
  If no anomaly is detected, indicate that the campaign is performing as expected.
  Be concise and clear in your analysis.
  Ensure the output is well formatted and easily understandable.
  Make sure to set the isAnomaly field correctly.`,
});

const campaignAnomalyDetectionFlow = ai.defineFlow(
  {
    name: 'campaignAnomalyDetectionFlow',
    inputSchema: CampaignAnomalyInputSchema,
    outputSchema: CampaignAnomalyOutputSchema,
  },
  async input => {
    const {output} = await campaignAnomalyDetectionPrompt(input);
    return output!;
  }
);
