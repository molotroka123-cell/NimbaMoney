/** Core Nimba Money data models. All mock values live in /data/mock — never inline in UI. */

import type { RailId } from "@/config/product";

export type Lang = "fr" | "en";

export type VerificationLevel =
  | "identity"
  | "business"
  | "location"
  | "enhanced";

export type ProviderType = "business" | "p2p";

export type SubscriptionTier = "free" | "pro";

export type ProviderStatus = "open" | "closing_soon" | "offline";

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  kycLevel: "none" | "basic" | "full";
  createdAt: string;
}

export interface Verification {
  level: VerificationLevel;
  ownerIdentity: boolean;
  businessRegistration: boolean;
  businessAddress: boolean;
  phone: boolean;
  operatingLocation: boolean;
  settlementAccount: boolean;
  complianceReview: boolean;
  securityDeposit?: boolean;
  lastReviewedAt: string;
}

export interface ProviderLocation {
  id: string;
  city: string;
  commune: string;
  district: string;
  address: string;
  openingHours: string;
  status: ProviderStatus;
}

export interface ProviderService {
  id: string;
  from: RailId;
  to: RailId;
  feePct: number; // e.g. 2.0
  minGnf: number;
  maxGnf: number;
  availableGnf: number;
  estimatedMinutes: [number, number];
}

export interface LiquiditySnapshot {
  totalAvailableGnf: number;
  updatedAt: string;
}

export interface Provider {
  id: string;
  slug: string;
  name: string;
  logoInitials: string;
  logoHue: number; // deterministic avatar tint
  type: ProviderType;
  verification: Verification;
  rating: number;
  reviewCount: number;
  completedDeals: number;
  successRate: number; // 0-100
  responseMinutes: number;
  joinedAt: string;
  monthsOnNimba: number;
  locations: ProviderLocation[];
  services: ProviderService[];
  liquidity: LiquiditySnapshot;
  limits: { minGnf: number; maxGnf: number };
  status: ProviderStatus;
  subscriptionTier: SubscriptionTier;
  isFeatured: boolean;
  about?: string;
}

export type RequestStatus =
  | "created"
  | "accepted"
  | "instructions"
  | "transfer_confirmed"
  | "released"
  | "completed"
  | "cancelled"
  | "disputed";

export interface DealRequest {
  id: string;
  providerId: string;
  from: RailId;
  to: RailId;
  amountGnf: number;
  feePct: number;
  feeGnf: number;
  receiveGnf: number;
  district: string;
  status: RequestStatus;
  createdAt: string;
  etaMinutes: number;
  timeline: { step: RequestStatus; at?: string; done: boolean }[];
}

export interface Deal {
  id: string;
  requestId: string;
  providerId: string;
  customerId: string;
  amountGnf: number;
  feeGnf: number;
  finalGnf: number;
  method: string;
  completedAt: string;
  status: "completed" | "disputed" | "refunded";
  receiptId: string;
}

export interface Review {
  id: string;
  providerId: string;
  author: string;
  rating: number;
  text: string;
  dealSummary: string;
  amountGnf: number;
  verifiedDeal: boolean;
  sentiment: "positive" | "neutral" | "dispute";
  date: string;
}

export type DisputeReason =
  | "no_response"
  | "payment_not_received"
  | "wrong_amount"
  | "different_terms"
  | "other";

export interface Dispute {
  id: string;
  requestId: string;
  providerId: string;
  reason: DisputeReason;
  status: "open" | "reviewing" | "resolved" | "rejected";
  openedAt: string;
}

export interface Message {
  id: string;
  threadId: string;
  from: "customer" | "provider" | "system";
  text: string;
  at: string;
  attachment?: { kind: "image" | "receipt" | "document"; name: string };
}

export interface MessageThread {
  id: string;
  providerId: string;
  requestId?: string;
  unread: number;
  lastAt: string;
  messages: Message[];
}

export interface Subscription {
  tier: SubscriptionTier;
  renewsAt?: string;
  /** Illustrative / configurable — never a commercial promise. */
  priceGnfPerMonth?: number;
}

export interface FeaturedPlacement {
  id: string;
  providerId: string;
  district: string;
  service: string;
  startsAt: string;
  endsAt: string;
  budgetGnf: number;
  status: "active" | "scheduled" | "ended";
}

export interface Invoice {
  id: string;
  providerId: string;
  period: string;
  commissionGnf: number;
  subscriptionGnf: number;
  totalGnf: number;
  status: "due" | "paid" | "overdue";
}

export interface AuditEvent {
  id: string;
  actor: string;
  action: string;
  target: string;
  at: string;
  note?: string;
}

export interface ProviderApplication {
  id: string;
  businessName: string;
  ownerName: string;
  district: string;
  services: string[];
  submittedAt: string;
  status: "new" | "in_review" | "needs_info" | "approved" | "rejected";
  riskNote?: string;
}

export interface OpsRequestRow {
  id: string;
  customer: string;
  amountGnf: number;
  from: RailId;
  to: RailId;
  district: string;
  ageMinutes: number;
  status: "unmatched" | "assigned" | "accepted" | "completed" | "issue";
  assignedProviderId?: string;
}

export interface ReconciliationRow {
  id: string;
  providerId: string;
  date: string;
  deals: number;
  volumeGnf: number;
  commissionGnf: number;
  status: "reconciled" | "needs_review" | "disputed";
}
