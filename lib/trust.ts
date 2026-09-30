import type { Provider } from "@/types";

export type TrustPart = { id: string; fr: string; en: string; value: number; weight: number };
export type Trust = { score: number; tier: "excellent" | "strong" | "fair"; parts: TrustPart[] };

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

const verificationPoints: Record<string, number> = { identity: 55, business: 70, location: 82, enhanced: 100 };

/**
 * Trust Score (demo): deterministic 0–100 blend of verification depth,
 * completion rate, response speed, track record and reviews. Pure function of
 * the mock provider — no real risk model behind it.
 */
export function trustScore(p: Provider): Trust {
  const parts: TrustPart[] = [
    { id: "ver", fr: "Vérification", en: "Verification", value: verificationPoints[p.verification.level] ?? 60, weight: 0.3 },
    { id: "rel", fr: "Fiabilité", en: "Reliability", value: clamp(p.successRate), weight: 0.25 },
    { id: "spd", fr: "Rapidité", en: "Speed", value: clamp(100 - p.responseMinutes * 4), weight: 0.15 },
    { id: "exp", fr: "Expérience", en: "Track record", value: clamp(Math.min(100, p.completedDeals / 30 + p.monthsOnNimba * 2)), weight: 0.15 },
    { id: "rev", fr: "Avis", en: "Reviews", value: clamp((p.rating / 5) * 100), weight: 0.15 },
  ];
  const score = clamp(parts.reduce((s, x) => s + x.value * x.weight, 0));
  return { score, tier: score >= 90 ? "excellent" : score >= 75 ? "strong" : "fair", parts };
}
