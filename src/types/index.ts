export type Campaign = {
  id: string;
  name: string;
  description: string;
  budget: number;
  brandAssetsUrl?: string;
  status?: 'Active' | 'Completed' | 'Pending';
  createdAt: any;
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
  photoURL?: string;
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
  status: 'pending' | 'approved' | 'rejected' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'SUBMITTED' | 'PUBLISHED';
  likes?: number;
  earnings?: number;
  createdAt: string;
  title?: string;
  cover_image_url?: string;
  tiktokVideoId?: string;
  campaignName?: string;
};
