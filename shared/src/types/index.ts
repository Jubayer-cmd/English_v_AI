export * from "./auth";
export * from "./voice";

// Subscription types
export interface Plan {
  id: string;
  name: string;
  type: "FREE" | "BASIC" | "STANDARD" | "PREMIUM";
  price: number;
  currency: string;
  billingCycle: string;
  voiceMinutes: number;
  textMessages: number;
  features: string[];
  isActive: boolean;
  isPopular: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: "ACTIVE" | "CANCELLED" | "EXPIRED" | "PAST_DUE" | "TRIAL";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt?: string;
  trialStart?: string;
  trialEnd?: string;
  voiceMinutesUsed: number;
  textMessagesUsed: number;
  createdAt: string;
  updatedAt: string;
  plan: Plan;
}

export interface Usage {
  voiceMinutesUsed: number;
  textMessagesUsed: number;
  voiceMinutesLimit: number;
  textMessagesLimit: number;
}
