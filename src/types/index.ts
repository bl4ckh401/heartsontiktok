export type Campaign = {
  id: string;
  name: string;
  brand: string;
  status: 'Active' | 'Completed' | 'Pending';
  impressions: number;
  clicks: number;
  ctr: string;
  earnings: number;
};

export type Metric = {
  timestamp: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
};

export type UserRole = 'user' | 'admin';

export type User = {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  subscriptionStatus: 'ACTIVE' | 'INACTIVE';
  subscriptionPlan?: string;
  createdAt: string;
};

export type Transaction = {
  id: string;
  userId: string;
  type: 'subscription' | 'payout' | 'affiliate';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  phoneNumber?: string;
  createdAt: string;
};

export type CampaignSubmission = {
  id: string;
  campaignId: string;
  userId: string;
  videoUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  likes?: number;
  earnings?: number;
  createdAt: string;
};
