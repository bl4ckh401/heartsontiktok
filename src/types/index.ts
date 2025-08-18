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
