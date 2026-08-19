/**
 * Marketplace offer derivation + transparent ranking.
 *
 * Ranking uses trust/quality signals only: fee, rating, response time,
 * liquidity headroom and completion history. Paid placement (Featured)
 * NEVER changes this score — sponsored rows are surfaced separately and
 * always carry an explicit "Sponsored" label.
 */
import type { Provider, ProviderService } from "@/types";
import type { RailId } from "@/config/product";

export interface Offer {
  provider: Provider;
  service: ProviderService;
  /** What the customer receives after the provider fee, for a given amount. */
  receiveGnf: number;
  feeGnf: number;
  score: number;
}

export interface SearchParams {
  have: RailId;
  need: RailId;
  amountGnf: number;
  district: string; // "Tous les quartiers" = all
}

export const defaultSearch: SearchParams = {
  have: "bank",
  need: "cash",
  amountGnf: 10_000_000,
  district: "Tous les quartiers",
};

export function buildOffers(
  providers: Provider[],
  params: SearchParams
): Offer[] {
  const out: Offer[] = [];
  for (const p of providers) {
    for (const s of p.services) {
      if (s.from !== params.have || s.to !== params.need) continue;
      if (params.amountGnf < s.minGnf || params.amountGnf > s.maxGnf) continue;
      if (
        params.district !== "Tous les quartiers" &&
        !p.locations.some((l) => l.district === params.district)
      )
        continue;
      if (s.availableGnf < params.amountGnf) continue;
      const feeGnf = Math.round((params.amountGnf * s.feePct) / 100);
      out.push({
        provider: p,
        service: s,
        feeGnf,
        receiveGnf: params.amountGnf - feeGnf,
        score: trustScore(p, s),
      });
    }
  }
  return out;
}

/** Transparent trust score in [0, 100]. */
export function trustScore(p: Provider, s: ProviderService): number {
  const feeScore = Math.max(0, 1 - (s.feePct - 1.5) / 1.5); // 1.5% → 1, 3% → 0
  const ratingScore = (p.rating - 4) / 1; // 4.0 → 0, 5.0 → 1
  const responseScore = Math.max(0, 1 - p.responseMinutes / 30);
  const liquidityScore = Math.min(1, s.availableGnf / 300_000_000);
  const historyScore = Math.min(1, p.completedDeals / 2000);
  const openBonus = p.status === "open" ? 1 : p.status === "closing_soon" ? 0.6 : 0.1;
  return Math.round(
    (feeScore * 0.28 +
      ratingScore * 0.22 +
      responseScore * 0.16 +
      liquidityScore * 0.14 +
      historyScore * 0.1 +
      openBonus * 0.1) *
      100
  );
}

export type SortKey =
  | "best"
  | "lowest_fee"
  | "highest_rating"
  | "fastest"
  | "largest_liquidity";

export function sortOffers(offers: Offer[], key: SortKey): Offer[] {
  const xs = [...offers];
  switch (key) {
    case "lowest_fee":
      return xs.sort((a, b) => a.service.feePct - b.service.feePct);
    case "highest_rating":
      return xs.sort((a, b) => b.provider.rating - a.provider.rating);
    case "fastest":
      return xs.sort(
        (a, b) => a.provider.responseMinutes - b.provider.responseMinutes
      );
    case "largest_liquidity":
      return xs.sort(
        (a, b) => b.service.availableGnf - a.service.availableGnf
      );
    default:
      return xs.sort((a, b) => b.score - a.score);
  }
}

export type QuickFilter =
  | "all"
  | "best_price"
  | "fastest"
  | "high_limits"
  | "open_now"
  | "verified_pro";

export function applyQuickFilter(offers: Offer[], f: QuickFilter): Offer[] {
  switch (f) {
    case "best_price": {
      const min = Math.min(...offers.map((o) => o.service.feePct));
      return offers.filter((o) => o.service.feePct <= min + 0.2);
    }
    case "fastest":
      return offers.filter((o) => o.provider.responseMinutes <= 10);
    case "high_limits":
      return offers.filter((o) => o.service.maxGnf >= 25_000_000);
    case "open_now":
      return offers.filter((o) => o.provider.status === "open");
    case "verified_pro":
      return offers.filter(
        (o) =>
          o.provider.subscriptionTier === "pro" &&
          o.provider.verification.level === "enhanced"
      );
    default:
      return offers;
  }
}
