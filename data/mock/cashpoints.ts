/**
 * MOCK DATA — development only.
 *
 * Schematic coordinates for the "Carte des points cash — Conakry" map.
 * x/y are hand-placed, deterministic positions inside the map SVG's
 * 800×520 viewBox (NOT real GPS coordinates — the map is a schema).
 *
 * providerId references entries in data/mock/providers.ts.
 */

export interface CashPoint {
  providerId: string;
  /** SVG x in the 800×520 viewBox */
  x: number;
  /** SVG y in the 800×520 viewBox */
  y: number;
  /** Display opening hours for the cash desk */
  hours: string;
  /** Whether the point keeps physical USD cash on hand */
  hasUsdCash: boolean;
}

export const cashPoints: CashPoint[] = [
  // Kaloum (peninsula tip)
  { providerId: "p1", x: 165, y: 418, hours: "Lun–Sam 08:00–19:00", hasUsdCash: true }, // Kaba Trade
  { providerId: "p4", x: 205, y: 443, hours: "Lun–Sam 08:00–17:30", hasUsdCash: false }, // Guinée Market
  // Dixinn
  { providerId: "p5", x: 268, y: 372, hours: "Lun–Dim 07:30–20:30", hasUsdCash: true }, // Mamadou Change
  { providerId: "p8", x: 312, y: 340, hours: "Lun–Sam 08:00–19:00", hasUsdCash: true }, // Nimba Finance
  // Matam
  { providerId: "p2", x: 340, y: 415, hours: "Lun–Ven 08:30–18:00", hasUsdCash: false }, // Conakry Cash Point
  // Ratoma
  { providerId: "p3", x: 432, y: 310, hours: "Lun–Dim 08:00–20:00", hasUsdCash: false }, // Alpha Change
  { providerId: "p7", x: 508, y: 280, hours: "Lun–Sam 09:00–18:00", hasUsdCash: false }, // Ratoma Exchange
  { providerId: "p6", x: 572, y: 300, hours: "Lun–Sam 08:00–19:00", hasUsdCash: false }, // Binta Express
  // Matoto
  { providerId: "p9", x: 562, y: 398, hours: "Lun–Dim 08:00–20:00", hasUsdCash: true }, // Tymur MrSwap
  { providerId: "p12", x: 662, y: 378, hours: "Lun–Dim 07:30–20:00", hasUsdCash: false }, // Matoto Money Point
];

export function getCashPoint(providerId: string): CashPoint | undefined {
  return cashPoints.find((c) => c.providerId === providerId);
}
