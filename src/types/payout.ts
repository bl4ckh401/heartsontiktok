export interface PayoutRequest {
  payoutId: string;
  userId: string;
  amount: number;
  phoneNumber: string;
  submissionIds: string[];
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  externalId: string;
  swapuziTransactionId?: string;
  finalTransactionId?: string;
  requestTimestamp: any;
  updatedTimestamp?: any;
  callbackData?: any;
}

export interface SwapuziCallback {
  externalId: string;
  status: 'success' | 'failed' | 'pending';
  transactionId?: string;
  amount: number;
  phoneNumber: string;
  message?: string;
}

export interface AffiliatePayoutRequest {
  payoutId: string;
  userId: string;
  amount: number;
  phoneNumber: string;
  referralIds: string[];
  referralCommissions: { id: string; commission: number; level: number }[];
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  externalId: string;
  swapuziTransactionId?: string;
  finalTransactionId?: string;
  requestTimestamp: any;
  updatedTimestamp?: any;
  callbackData?: any;
}