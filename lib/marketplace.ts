/**
 * Shared marketplace types. The old standalone offer-building/ranking
 * helpers were superseded by the two-product architecture (ranking now
 * lives in app/marketplace/page.tsx with its weights shown in the UI).
 */
import type { Provider, ProviderService } from "@/types";

export interface Offer {
  provider: Provider;
  service: ProviderService;
  /** What the customer receives after the provider fee, for a given amount. */
  receiveGnf: number;
  feeGnf: number;
  score: number;
}
