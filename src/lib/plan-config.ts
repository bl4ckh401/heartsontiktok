export const PLAN_CONFIG = {
  Free: {
    price: 0,
    maxCampaignParticipationPerMonth: 1,
    minWithdrawal: 0,
    maxWithdrawal: 0,
    maxDailyPayout: 0, // Payouts disabled for Free plan
    payoutRatePer1000Likes: 50,
  },
  Gold: {
    price: 1000,
    maxCampaignParticipationPerMonth: 3,
    maxDailyPayout: 10000,
    payoutRatePer1000Likes: 50,
  },
  Platinum: {
    price: 3000,
    maxCampaignParticipationPerMonth: 5,
    maxDailyPayout: 15000,
    payoutRatePer1000Likes: 50,
  },
  Diamond: {
    price: 5500,
    maxCampaignParticipationPerMonth: 10,
    maxDailyPayout: 20000,
    payoutRatePer1000Likes: 50,
  },
} as const;

export type PlanType = keyof typeof PLAN_CONFIG;

export const COMMISSION_RATES = {
  DIRECT: 0.30, // 30%
  INDIRECT: 0.05, // 5%
  MAX_LEVELS: 4,
} as const;